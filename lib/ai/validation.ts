import { CaseEvent, ProvenanceType, UnresolvedIssue } from '@/types/case';
import { NormalizedEvidence, ProcessingWarning } from './types';

export interface ValidationOutput {
  isValid: boolean;
  events: CaseEvent[];
  unresolvedIssue: UnresolvedIssue;
  contradictions: string[];
  missingInformation: string[];
  warnings: ProcessingWarning[];
  rejectionReason?: string;
}

/**
 * Validates and normalizes the raw output received from any AI provider (Gemini, OpenAI, Grok).
 * Enforces provenance verification, source existence, date integrity, and schema compliance.
 */
export function validateAndNormalizeReconstruction(
  rawOutput: any,
  providedEvidence: NormalizedEvidence[]
): ValidationOutput {
  const warnings: ProcessingWarning[] = [];

  if (!rawOutput || typeof rawOutput !== 'object') {
    return {
      isValid: false,
      events: [],
      unresolvedIssue: { problem: '' },
      contradictions: [],
      missingInformation: [],
      warnings: [],
      rejectionReason: 'Provider output was not a valid JSON object',
    };
  }

  const rawEvents = Array.isArray(rawOutput.events) ? rawOutput.events : [];
  if (rawEvents.length === 0) {
    return {
      isValid: false,
      events: [],
      unresolvedIssue: { problem: '' },
      contradictions: [],
      missingInformation: [],
      warnings: [],
      rejectionReason: 'Provider output contained no reconstruction events',
    };
  }

  const validSourceIdSet = new Set(providedEvidence.map((e) => e.id));
  const validSourceMap = new Map(providedEvidence.map((e) => [e.id, e]));

  const normalizedEvents: CaseEvent[] = [];

  for (let idx = 0; idx < rawEvents.length; idx++) {
    const rawEv = rawEvents[idx];
    if (!rawEv || typeof rawEv !== 'object') continue;

    const eventId = rawEv.id ? String(rawEv.id) : `ev-gen-${Date.now()}-${idx + 1}`;
    const title = (rawEv.title || 'Timeline Event').trim();
    const description = (rawEv.description || title).trim();

    // Date Integrity
    let dateStr = typeof rawEv.date === 'string' ? rawEv.date.trim() : '';
    let displayDate = typeof rawEv.displayDate === 'string' ? rawEv.displayDate.trim() : dateStr;
    let datePrecision = rawEv.datePrecision || 'approximate';

    if (
      !dateStr ||
      dateStr.toLowerCase().includes('unknown') ||
      dateStr.toLowerCase().includes('not established') ||
      dateStr.toLowerCase().includes('unspecified')
    ) {
      dateStr = 'Date not established';
      displayDate = 'Date not established';
      datePrecision = 'not-established';
    }

    // Provenance normalization
    let rawProv = (rawEv.provenance || 'SOURCE_BACKED').toUpperCase().replace(/-/g, '_');
    if (!['SOURCE_BACKED', 'USER_REPORTED', 'AI_INFERRED', 'NEEDS_REVIEW', 'SOURCE_CONFLICT'].includes(rawProv)) {
      rawProv = 'NEEDS_REVIEW';
    }

    let provenance: ProvenanceType = rawProv as ProvenanceType;
    let provenanceLabel = rawEv.provenanceLabel || 'Source-backed';
    let needsReviewReason = rawEv.needsReviewReason;

    // Filter and validate source IDs
    const candidateSourceIds: string[] = Array.isArray(rawEv.sourceIds)
      ? rawEv.sourceIds.map(String)
      : [];

    const existingSourceIds: string[] = [];
    const invalidSourceIds: string[] = [];

    candidateSourceIds.forEach((sid) => {
      if (validSourceIdSet.has(sid)) {
        existingSourceIds.push(sid);
      } else {
        invalidSourceIds.push(sid);
      }
    });

    // RULE 23: Source-Backed Validation
    if (provenance === 'SOURCE_BACKED') {
      if (existingSourceIds.length === 0) {
        // Model claimed SOURCE_BACKED but provided no valid matching source ID
        provenance = 'NEEDS_REVIEW';
        provenanceLabel = 'Needs review (No verified source citation)';
        needsReviewReason = invalidSourceIds.length > 0
          ? `Cited source IDs [${invalidSourceIds.join(', ')}] were not found in provided evidence.`
          : 'Claimed source-backed provenance without providing a valid evidence source ID.';
        
        warnings.push({
          code: 'INVALID_SOURCE_CITATION',
          message: `Event "${title}" was downgraded from SOURCE_BACKED to NEEDS_REVIEW: ${needsReviewReason}`,
          eventId,
        });
      }
    }

    // Compile source names
    const sourceNames = existingSourceIds.map((sid) => validSourceMap.get(sid)?.filename || sid);
    if (sourceNames.length === 0 && provenance === 'USER_REPORTED') {
      sourceNames.push('Citizen Statement');
    }

    // Category
    let category = rawEv.category;
    if (!['billing', 'complaint', 'response', 'payment', 'communication', 'status'].includes(category)) {
      category = 'communication';
    }

    normalizedEvents.push({
      id: eventId,
      date: dateStr,
      displayDate: displayDate || dateStr,
      datePrecision,
      title,
      description,
      provenance,
      provenanceLabel,
      sourceIds: existingSourceIds,
      sourceNames,
      sourceQuote: rawEv.sourceQuote ? String(rawEv.sourceQuote).slice(0, 300) : undefined,
      sourceLocation: rawEv.sourceLocation ? String(rawEv.sourceLocation).slice(0, 100) : undefined,
      conflictDetails: rawEv.conflictDetails ? String(rawEv.conflictDetails) : undefined,
      needsReviewReason,
      verifiedByUser: false,
      category,
    });
  }

  // Normalize Unresolved Issue
  const rawUnresolved = rawOutput.unresolvedDraft || rawOutput.unresolvedIssue || {};
  const unresolvedIssue: UnresolvedIssue = {
    problem: typeof rawUnresolved.problem === 'string' ? rawUnresolved.problem.trim() : 'Core dispute remains unresolved.',
    whatWasRequested: typeof rawUnresolved.whatWasRequested === 'string' ? rawUnresolved.whatWasRequested.trim() : '',
    whatHappened: typeof rawUnresolved.whatHappened === 'string' ? rawUnresolved.whatHappened.trim() : '',
    responseReceived: typeof rawUnresolved.responseReceived === 'string' ? rawUnresolved.responseReceived.trim() : '',
    whatWasResolved: typeof rawUnresolved.whatWasResolved === 'string' ? rawUnresolved.whatWasResolved.trim() : '',
    whatWasNotResolved: typeof rawUnresolved.whatWasNotResolved === 'string' ? rawUnresolved.whatWasNotResolved.trim() : '',
    requestedAction: typeof rawUnresolved.requestedAction === 'string' ? rawUnresolved.requestedAction.trim() : '',
  };

  // Normalize Contradictions & Missing Information
  const contradictions: string[] = Array.isArray(rawOutput.contradictions)
    ? rawOutput.contradictions.map((c: any) => String(c).trim()).filter(Boolean)
    : [];

  const missingInformation: string[] = Array.isArray(rawOutput.missingInformation)
    ? rawOutput.missingInformation.map((m: any) => String(m).trim()).filter(Boolean)
    : [];

  return {
    isValid: normalizedEvents.length > 0,
    events: normalizedEvents,
    unresolvedIssue,
    contradictions,
    missingInformation,
    warnings,
  };
}
