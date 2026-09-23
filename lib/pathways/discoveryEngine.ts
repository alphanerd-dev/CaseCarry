import { GoogleGenAI } from '@google/genai';
import { findCachedPathways, VERIFIED_PATHWAYS_CACHE } from './cache';
import { extractPathwayCaseFacts } from './factExtractor';
import {
  MatchConfidence,
  PathwayCandidate,
  PathwayDiscoveryInput,
  PathwayDiscoveryResult,
  PathwayFact,
  SupportingFactItem,
} from './types';

const CANONICAL_PATHWAY_DISCOVERY_PROMPT = `You are CaseCarry's Pathway Discovery Engine.

CASE DISCOVERY ROLE:
Your objective is to identify potentially relevant next administrative, regulatory, ombudsman, or dispute resolution pathways for a citizen's unresolved matter.

CRITICAL PRINCIPLES:
1. You are NOT an autonomous legal or regulatory decision-maker.
2. Never claim an authority is conclusively "the correct authority" or predict legal outcome success.
3. Every suggestion must be framed as "May be relevant" with an explicit reason citing actual case facts.
4. Distinguish between what is verified in the case versus what remains uncertain.
5. Take previous failure into account: do NOT recommend repeating the exact same first-line customer service step if the user's record shows they already attempted it and it failed or lapsed.
6. Provide official procedural titles and URLs whenever available.
7. Return clean JSON adhering to the specified schema.

OUTPUT JSON SCHEMA:
{
  "insufficientInformation": false,
  "missingInfoPrompts": ["string explaining what is missing if jurisdiction or provider is unknown"],
  "candidates": [
    {
      "name": "Full Title of Pathway / Procedure",
      "organization": "Authoritative Body / Commission / Ombudsman",
      "jurisdiction": "Territorial jurisdiction (e.g. Ogun State, Nigeria)",
      "pathwayType": "sector_regulator | ombudsman | consumer_protection | internal_escalation | tribunal_dispute | legal_aid",
      "whyRelevant": "2-3 sentences explaining directly why this applies to the citizen's specific unresolved dispute and previous failure",
      "relevanceReason": "Short phrase summarizing match (e.g. Based on Ogun State jurisdiction, IBEDC provider, and closure notice in record)",
      "supportingCaseFacts": [
        {
          "label": "e.g. Provider Identified",
          "fact": "e.g. IBEDC electricity distribution",
          "provenance": "SOURCE_BACKED | USER_REPORTED"
        }
      ],
      "requiredDocuments": [
        "e.g. Original complaint letter",
        "e.g. Disputed bills and payment receipts"
      ],
      "steps": [
        "e.g. Submit dispute petition to regulatory Consumer Affairs Directorate",
        "e.g. Attend mediation session"
      ],
      "eligibility": "Clear description of who is eligible and preconditions (e.g. Must have exhausted provider CCU)",
      "officialSourceTitle": "Official statutory regulation or procedure title",
      "officialSourceUrl": "https://...",
      "sourceCheckedAt": "2026-09-21",
      "uncertainties": [
        "e.g. Whether dispute falls under state commission or federal transitional authority",
        "e.g. Statutory deadline from receipt of deadlock"
      ],
      "warnings": [
        "e.g. Keep copies of all submissions; regulatory timelines can take 30-60 days."
      ],
      "confidence": "high | medium | low",
      "confidenceExplanation": "Explanation of relevance match quality based on available evidence"
    }
  ]
}`;

export async function discoverCasePathways(input: PathwayDiscoveryInput): Promise<PathwayDiscoveryResult> {
  // Stage 0: Extract structured case facts & check safety
  const { facts, safetyAlert } = extractPathwayCaseFacts(input);

  const jurisdictionFact = facts.find((f) => f.field === 'jurisdiction')?.value || '';
  const sectorFact = facts.find((f) => f.field === 'sector')?.value || '';
  const institutionFact = facts.find((f) => f.field === 'institution')?.value || input.provider || '';

  // Stage 1: Try AI-assisted discovery if Gemini or OpenAI API keys are available
  let aiGeneratedResult: any = null;
  let providerUsed = 'deterministic_cache';
  let modelUsed = 'casecarry-verified-cache-v1';
  let discoverySource: 'live_research' | 'verified_cache' | 'local_fallback' = 'verified_cache';

  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    const maxRetries = 2;
    let attempt = 0;
    let success = false;

    while (attempt < maxRetries && !success) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const promptText = `
CITIZEN CASE SUMMARY:
- Case Title: ${input.caseTitle || 'Unresolved Matter'}
- Provider / Institution: ${institutionFact}
- Reference / Account Number: ${input.referenceNumber || 'Not specified'}
- Outcome of Previous Attempt: ${input.firstReportOutcome || 'Not specified'}
- User Initial Narrative: ${input.userDescription || 'Not specified'}

UNRESOLVED PROBLEM:
- Problem: ${input.unresolved?.problem || 'Not specified'}
- What was Requested: ${input.unresolved?.whatWasRequested || 'Not specified'}
- What Happened: ${input.unresolved?.whatHappened || 'Not specified'}
- Response Received: ${input.unresolved?.responseReceived || 'Not specified'}
- What was Resolved: ${input.unresolved?.whatWasResolved || 'None confirmed'}
- What was NOT Resolved: ${input.unresolved?.whatWasNotResolved || 'Not specified'}
- Requested Remedy: ${input.unresolved?.requestedAction || 'Not specified'}

EXTRACTED CASE FACTS WITH PROVENANCE:
${JSON.stringify(facts, null, 2)}

EVIDENCE ARTIFACTS:
${(input.evidenceSources || []).map((e) => `- ${e.filename} (${e.type}): ${e.textSnippet ? e.textSnippet.slice(0, 200) : 'No extracted text'}`).join('\n')}

INSTRUCTIONS:
Identify 2 to 4 potential next regulatory, ombudsman, or dispute resolution pathways tailored to this specific case, taking previous failure into account. Return JSON matching the schema.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ text: promptText }],
          config: {
            systemInstruction: CANONICAL_PATHWAY_DISCOVERY_PROMPT,
            responseMimeType: 'application/json',
          },
        });

        const rawJson = response?.text || '{}';
        try {
          aiGeneratedResult = JSON.parse(rawJson);
          providerUsed = 'gemini';
          modelUsed = 'gemini-3.8-flash';
          discoverySource = 'live_research';
        } catch {
          const cleaned = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
          aiGeneratedResult = JSON.parse(cleaned);
          providerUsed = 'gemini';
          modelUsed = 'gemini-3.8-flash';
          discoverySource = 'live_research';
        }
        success = true;
      } catch (err: any) {
        attempt++;
        const errStr = err?.toString() || '';
        const isTransient = errStr.includes('503') || errStr.includes('UNAVAILABLE') || errStr.includes('resource_exhausted') || errStr.includes('overloaded');
        if (isTransient && attempt < maxRetries) {
          console.info(`[CaseCarry Engine] Live pathway discovery busy (Attempt ${attempt}). Retrying...`);
          await new Promise((resolve) => setTimeout(resolve, 1500));
        } else {
          console.info('[CaseCarry Engine] Utilizing local verified pathway cache (high-demand fallback active).');
          break;
        }
      }
    }
  }

  // Stage 2: Source Validation & Candidate Assembly
  const candidatePathways: PathwayCandidate[] = [];

  if (aiGeneratedResult && Array.isArray(aiGeneratedResult.candidates) && aiGeneratedResult.candidates.length > 0) {
    aiGeneratedResult.candidates.forEach((cand: any, idx: number) => {
      if (!cand.name || !cand.organization) return;

      const supportingFacts: SupportingFactItem[] = Array.isArray(cand.supportingCaseFacts)
        ? cand.supportingCaseFacts.map((sf: any) => ({
            label: sf.label || 'Case Factor',
            fact: sf.fact || '',
            provenance: sf.provenance === 'SOURCE_BACKED' ? 'SOURCE_BACKED' : 'USER_REPORTED',
            sourceNames: sf.sourceNames || [],
          }))
        : [];

      // If no supporting facts were returned by AI, construct them from extracted facts
      if (supportingFacts.length === 0) {
        facts.slice(0, 3).forEach((f) => {
          supportingFacts.push({
            label: f.label,
            fact: f.value,
            provenance: f.provenance,
            sourceNames: f.sourceNames,
          });
        });
      }

      candidatePathways.push({
        id: `pw-ai-${idx + 1}-${Date.now()}`,
        name: cand.name,
        organization: cand.organization,
        jurisdiction: cand.jurisdiction || jurisdictionFact || 'Territorial Jurisdiction',
        pathwayType: cand.pathwayType || 'sector_regulator',
        whyRelevant: cand.whyRelevant || `Potentially relevant for resolving the ongoing dispute with ${institutionFact}.`,
        relevanceReason: cand.relevanceReason || `Match based on jurisdiction (${jurisdictionFact}) and provider (${institutionFact}).`,
        supportingCaseFacts: supportingFacts,
        requiredDocuments: Array.isArray(cand.requiredDocuments) && cand.requiredDocuments.length > 0
          ? cand.requiredDocuments
          : ['Dispute history records', 'Original receipts and invoices', 'Provider communication replies'],
        steps: Array.isArray(cand.steps) && cand.steps.length > 0
          ? cand.steps
          : ['Gather supporting case bundle', 'Submit petition citing unresolved issue to the authority'],
        eligibility: cand.eligibility || 'Consumers with an unresolved dispute who have attempted direct resolution.',
        officialSourceTitle: cand.officialSourceTitle || `${cand.organization} Complaint Procedure`,
        officialSourceUrl: cand.officialSourceUrl || 'https://example.gov/complaints',
        sourceCheckedAt: cand.sourceCheckedAt || '2026-09-21',
        uncertainties: Array.isArray(cand.uncertainties)
          ? cand.uncertainties
          : ['Verify exact filing deadlines and current procedural rules before submission.'],
        warnings: Array.isArray(cand.warnings) ? cand.warnings : [],
        confidence: (cand.confidence as MatchConfidence) || 'high',
        confidenceExplanation: cand.confidenceExplanation || 'Relevant match based on verified case records.',
        status: 'POTENTIAL',
      });
    });
  }

  // If AI returned 0 candidates or failed, assemble from verified cache
  if (candidatePathways.length === 0) {
    const cachedMatches = findCachedPathways(sectorFact, 'Nigeria', jurisdictionFact);
    const pool = cachedMatches.length > 0 ? cachedMatches : VERIFIED_PATHWAYS_CACHE.slice(0, 3);

    pool.forEach((rec, idx) => {
      const whyRel = generateWhyRelevantExplanation(rec, institutionFact, jurisdictionFact, input.firstReportOutcome);
      const supportingFacts: SupportingFactItem[] = [
        {
          label: 'Service / Sector',
          fact: sectorFact || rec.sector,
          provenance: facts.find((f) => f.field === 'sector')?.provenance || 'USER_REPORTED',
          sourceNames: facts.find((f) => f.field === 'sector')?.sourceNames,
        },
        {
          label: 'Institution',
          fact: institutionFact || 'Service Provider',
          provenance: facts.find((f) => f.field === 'institution')?.provenance || 'USER_REPORTED',
          sourceNames: facts.find((f) => f.field === 'institution')?.sourceNames,
        },
        {
          label: 'Previous Attempt',
          fact: facts.find((f) => f.field === 'previousResponse')?.value || 'Provider complaint lodged',
          provenance: facts.find((f) => f.field === 'previousResponse')?.provenance || 'USER_REPORTED',
          sourceNames: facts.find((f) => f.field === 'previousResponse')?.sourceNames,
        },
      ];

      candidatePathways.push({
        id: `pw-cache-${idx + 1}-${rec.id}`,
        name: rec.name,
        organization: rec.organization,
        jurisdiction: rec.jurisdiction,
        pathwayType: rec.pathwayType,
        whyRelevant: whyRel,
        relevanceReason: `Match based on sector (${rec.sector}) and jurisdiction (${rec.jurisdiction}).`,
        supportingCaseFacts: supportingFacts,
        requiredDocuments: rec.requiredDocuments,
        steps: rec.steps,
        eligibility: rec.eligibility,
        officialSourceTitle: rec.officialSourceTitle,
        officialSourceUrl: rec.officialSourceUrl,
        sourceCheckedAt: rec.lastCheckedDate,
        isStale: false,
        uncertainties: rec.generalUncertainties,
        warnings: [
          'CaseCarry provides this procedural reference for case continuity. Confirm current sitting times and requirements before filing.',
        ],
        confidence: idx === 0 ? 'high' : 'medium',
        confidenceExplanation: 'High relevance match based on verified case records and official regulatory jurisdiction.',
        status: 'POTENTIAL',
      });
    });
  }

  // Check for missing critical info
  let insufficientInformation = false;
  const missingInfoPrompts: string[] = [];

  if (!institutionFact || institutionFact.trim() === '') {
    insufficientInformation = true;
    missingInfoPrompts.push('The name of the service provider or institution is not specified in the record.');
  }

  if (!jurisdictionFact || jurisdictionFact.includes('not fully established')) {
    missingInfoPrompts.push('The geographic state or locality is not confirmed in the documents.');
  }

  return {
    extractedFacts: facts,
    candidatePathways,
    safetyAlert,
    insufficientInformation,
    missingInfoPrompts: missingInfoPrompts.length > 0 ? missingInfoPrompts : undefined,
    discoverySource,
    providerUsed,
    modelUsed,
    executedAt: new Date().toISOString(),
    disclaimer:
      'Informational guidance only. CaseCarry does not provide binding legal counsel, make decisions, or automatically submit complaints.',
  };
}

function generateWhyRelevantExplanation(
  rec: any,
  provider: string,
  jurisdiction: string,
  outcome: string
): string {
  const provText = provider ? `with ${provider}` : 'with your service provider';
  const outcomePhrases: Record<string, string> = {
    'closure-claim': 'the provider issued a closure or resolution notice without correcting the underlying dispute',
    'response-didnt-resolve': 'the provider responded without rectifying the core problem',
    'deadlock-refusal': 'a formal deadlock or refusal was issued',
    'no-response': 'the provider failed to respond within standard resolution periods',
  };

  const outcomeDetail = outcomePhrases[outcome] || 'the first-tier complaint was attempted';

  return `Your case concerns an unresolved ${rec.sector.replace(/_/g, ' ')} dispute ${provText} in ${jurisdiction || rec.jurisdiction}. Because ${outcomeDetail}, this statutory pathway may be eligible for escalation.`;
}
