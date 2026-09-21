import { AI_PROVIDERS } from '../config';
import { ReconstructionInput, ReconstructionResult } from '../types';
import { validateAndNormalizeReconstruction } from '../validation';
import { ReconstructionProvider } from './base';

export class DeterministicProvider implements ReconstructionProvider {
  public readonly id = 'deterministic' as const;
  public readonly name = AI_PROVIDERS.deterministic.name;

  public isAvailable(): boolean {
    return true; // Always available offline / locally
  }

  public async reconstruct(input: ReconstructionInput): Promise<ReconstructionResult> {
    const events: any[] = [];
    const contradictions: string[] = [];
    const missingInformation: string[] = [];
    const userDescription = input.userDescription || '';
    const provider = input.provider || '';
    const referenceNumber = input.referenceNumber || '';
    const failureOutcome = input.failureOutcome || '';

    // 1. Initial complaint event from citizen statement
    if (userDescription && userDescription.trim().length > 0) {
      const dateMatch = userDescription.match(
        /\b(20\d\d[-/]\d\d[-/]\d\d|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? 20\d\d|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* 20\d\d)\b/i
      );
      const eventDate = dateMatch ? dateMatch[0] : 'Date not established';
      events.push({
        id: `ev-init-${Date.now()}`,
        date: eventDate,
        displayDate: eventDate,
        datePrecision: dateMatch ? 'approximate' : 'not-established',
        title: provider ? `Dispute reported to ${provider}` : 'Initial problem reported',
        description: userDescription.slice(0, 350) + (userDescription.length > 350 ? '...' : ''),
        provenance: 'USER_REPORTED',
        provenanceLabel: 'You reported this',
        sourceIds: [],
        sourceNames: ['Citizen Statement'],
        sourceQuote: userDescription.slice(0, 180),
        category: 'complaint',
      });
    }

    // 2. Events from provided documentary evidence
    input.evidenceSources.forEach((ev, idx) => {
      const textContent = `${ev.textSnippet || ''}`;
      const dateMatch = textContent.match(
        /\b(20\d\d[-/]\d\d[-/]\d\d|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? 20\d\d|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* 20\d\d)\b/i
      );
      const hasExtractedText = ev.hasUsableText;
      const evDate = dateMatch ? dateMatch[0] : 'Date not established';

      let cat = 'communication';
      const lower = (textContent || `${ev.title} ${ev.filename}`).toLowerCase();
      if (
        lower.includes('bill') ||
        lower.includes('tariff') ||
        lower.includes('charge') ||
        lower.includes('kwh') ||
        lower.includes('meter') ||
        lower.includes('invoice')
      ) {
        cat = 'billing';
      } else if (
        lower.includes('receipt') ||
        lower.includes('payment') ||
        lower.includes('ussd') ||
        lower.includes('paid') ||
        lower.includes('transfer') ||
        lower.includes('bank')
      ) {
        cat = 'payment';
      } else if (
        lower.includes('close') ||
        lower.includes('resolve') ||
        lower.includes('reject') ||
        lower.includes('letter') ||
        lower.includes('notice') ||
        lower.includes('response')
      ) {
        cat = 'response';
      }

      if (hasExtractedText) {
        const quote = ev.textSnippet.trim().slice(0, 180);
        events.push({
          id: `ev-doc-${idx + 1}-${Date.now()}`,
          date: evDate,
          displayDate: evDate,
          datePrecision: dateMatch ? 'approximate' : 'not-established',
          title: ev.title || `Document: ${ev.filename}`,
          description: `Content extracted from ${ev.filename}: ${ev.textSnippet.slice(0, 260)}`,
          provenance: 'SOURCE_BACKED',
          provenanceLabel: 'Source-backed',
          sourceIds: [ev.id],
          sourceNames: [ev.filename],
          sourceQuote: quote,
          category: cat,
        });
      } else {
        events.push({
          id: `ev-doc-${idx + 1}-${Date.now()}`,
          date: 'Date not established',
          displayDate: 'Date not established',
          datePrecision: 'not-established',
          title: `Artifact provided: ${ev.filename}`,
          description: `User provided attachment (${ev.type}): ${ev.filename}. Content has not yet been institutionally reconciled.`,
          provenance: 'USER_REPORTED',
          provenanceLabel: 'Source provided by user',
          sourceIds: [ev.id],
          sourceNames: [ev.filename],
          sourceQuote: `Attached file: ${ev.filename}`,
          category: cat,
        });
      }
    });

    // 3. Institutional failure outcome event
    const outcomeMap: Record<string, { title: string; desc: string; prov: string; label: string; cat: string }> = {
      'closure-claim': {
        title: `${provider || 'Provider'} issued closure/resolved notice`,
        desc: `Provider communications indicated the matter was resolved, but the citizen reports the core problem remains unrectified.`,
        prov: 'SOURCE_CONFLICT',
        label: 'Sources conflict',
        cat: 'response',
      },
      'response-didnt-resolve': {
        title: `${provider || 'Provider'} responded without addressing core issue`,
        desc: `A reply was provided by ${provider || 'the provider'}, but it failed to correct the underlying dispute or deliver the requested remedy.`,
        prov: 'NEEDS_REVIEW',
        label: 'Needs review',
        cat: 'response',
      },
      'deadlock-refusal': {
        title: `${provider || 'Provider'} issued final deadlock or refused claim`,
        desc: `Provider issued a final position or rejected the dispute, establishing deadlock for next-tier escalation.`,
        prov: 'SOURCE_BACKED',
        label: 'Source-backed',
        cat: 'response',
      },
      'no-response': {
        title: `${provider || 'Provider'} statutory response window lapsed without reply`,
        desc: `No formal response or corrective action received from ${provider || 'the provider'} after initial dispute notice.`,
        prov: 'USER_REPORTED',
        label: 'You reported this',
        cat: 'status',
      },
    };

    if (failureOutcome && outcomeMap[failureOutcome]) {
      const out = outcomeMap[failureOutcome];
      events.push({
        id: `ev-outcome-${Date.now()}`,
        date: 'Date not established',
        displayDate: 'Date not established (Reported outcome)',
        datePrecision: 'not-established',
        title: out.title,
        description: out.desc,
        provenance: out.prov,
        provenanceLabel: out.label,
        sourceIds: [],
        sourceNames: [provider ? `${provider} Notice` : 'First-Pathway Outcome'],
        category: out.cat,
      });
    }

    // Contradictions & Missing info
    if (failureOutcome === 'closure-claim') {
      contradictions.push(
        `${provider || 'Provider'} communication claims dispute is resolved, directly conflicting with citizen report and ongoing issue.`
      );
    }

    if (!events.some((e) => e.category === 'response')) {
      missingInformation.push(
        `Official written response or final deadlock letter from ${provider || 'the provider'}`
      );
    }
    if (!events.some((e) => e.category === 'payment') && userDescription.toLowerCase().includes('paid')) {
      missingInformation.push('Official payment receipt or bank transfer confirmation slip');
    }

    const unresolvedProblem = userDescription
      ? `${userDescription.slice(0, 180)}`
      : `Dispute with ${provider || 'the provider'}${referenceNumber ? ` regarding reference ${referenceNumber}` : ''} remains unrectified.`;

    const rawOutput = {
      events,
      unresolvedDraft: {
        problem: unresolvedProblem,
        whatWasRequested: 'Correction of the dispute and formal written resolution.',
        whatHappened: userDescription || 'Dispute was submitted but first pathway did not produce resolution.',
        responseReceived: failureOutcome ? outcomeMap[failureOutcome]?.desc || 'No satisfactory response.' : 'No satisfactory response.',
        whatWasResolved: 'None confirmed by evidence.',
        whatWasNotResolved: unresolvedProblem,
        requestedAction: 'Escalation to competent ombudsman / regulatory pathway.',
      },
      contradictions,
      missingInformation,
    };

    const validation = validateAndNormalizeReconstruction(rawOutput, input.evidenceSources);

    return {
      provider: 'deterministic',
      model: AI_PROVIDERS.deterministic.model,
      events: validation.events,
      contradictions: validation.contradictions,
      missingInformation: validation.missingInformation,
      unresolvedIssue: validation.unresolvedIssue,
      processingWarnings: validation.warnings,
      confidence: 'medium',
      generatedAt: new Date().toISOString(),
      fallbackUsed: false,
    };
  }
}
