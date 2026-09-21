import { ProvenanceType } from '@/types/case';

export type PathwayType =
  | 'internal_escalation'
  | 'sector_regulator'
  | 'ombudsman'
  | 'consumer_protection'
  | 'tribunal_dispute'
  | 'legal_aid'
  | 'safety_emergency';

export type PathwayStatus =
  | 'POTENTIAL'
  | 'RELEVANCE_CONFIRMED'
  | 'NEEDS_VERIFICATION'
  | 'PREVIOUSLY_ATTEMPTED'
  | 'NOT_RELEVANT'
  | 'UNAVAILABLE'
  | 'STALE';

export type MatchConfidence = 'high' | 'medium' | 'low';

export interface PathwayFact {
  field:
    | 'jurisdiction'
    | 'country'
    | 'state'
    | 'locality'
    | 'institution'
    | 'institutionType'
    | 'sector'
    | 'serviceInvolved'
    | 'issueType'
    | 'subIssue'
    | 'previousReportingChannel'
    | 'previousAuthority'
    | 'previousResponse'
    | 'responseStatus'
    | 'dateOfPreviousReport'
    | 'dateOfResponse'
    | 'unresolvedIssue'
    | 'requestedRemedy'
    | 'documentsAvailable'
    | 'eligibilityIndicators'
    | 'urgencyIndicators'
    | 'safetyIndicators'
    | 'userObjective';
  label: string;
  value: string;
  provenance: ProvenanceType;
  sourceIds: string[];
  sourceNames?: string[];
}

export interface SupportingFactItem {
  label: string;
  fact: string;
  provenance: ProvenanceType;
  sourceNames?: string[];
}

export interface PathwayCandidate {
  id: string;
  name: string;
  organization: string;
  jurisdiction: string;
  pathwayType: PathwayType;
  whyRelevant: string;
  relevanceReason: string;
  supportingCaseFacts: SupportingFactItem[];
  requiredDocuments: string[];
  steps: string[];
  eligibility: string;
  officialSourceTitle: string;
  officialSourceUrl: string;
  sourceCheckedAt: string;
  isStale?: boolean;
  staleNotice?: string;
  uncertainties: string[];
  warnings: string[];
  confidence: MatchConfidence;
  confidenceExplanation: string;
  status: PathwayStatus;
  userNotes?: string;
  previousAttemptNotes?: string;
}

export interface SafetyAlert {
  isHighRisk: boolean;
  riskType?: 'physical_danger' | 'violence' | 'abuse' | 'medical_emergency' | 'imminent_threat';
  advisory: string;
  emergencyResources: Array<{
    name: string;
    contact: string;
    note: string;
  }>;
}

export interface PathwayDiscoveryInput {
  caseTitle?: string;
  citizenName?: string;
  provider: string;
  referenceNumber?: string;
  firstReportOutcome: string;
  userDescription: string;
  events: Array<{
    id: string;
    title: string;
    description: string;
    date?: string | null;
    displayDate?: string;
    provenance: ProvenanceType;
    sourceNames?: string[];
    sourceIds?: string[];
    category?: string;
  }>;
  unresolved: {
    problem: string;
    whatWasRequested?: string;
    whatHappened?: string;
    responseReceived?: string;
    whatWasResolved?: string;
    whatWasNotResolved?: string;
    requestedAction?: string;
    alreadyTried?: string;
  };
  evidenceSources: Array<{
    id: string;
    title: string;
    filename: string;
    type: string;
    textSnippet?: string;
  }>;
  contradictions?: string[];
  missingInformation?: string[];
}

export interface PathwayDiscoveryResult {
  extractedFacts: PathwayFact[];
  candidatePathways: PathwayCandidate[];
  safetyAlert?: SafetyAlert;
  insufficientInformation?: boolean;
  missingInfoPrompts?: string[];
  discoverySource: 'live_research' | 'verified_cache' | 'local_fallback';
  providerUsed: string;
  modelUsed: string;
  executedAt: string;
  disclaimer: string;
}

export interface CachedPathwayRecord {
  id: string;
  name: string;
  organization: string;
  jurisdiction: string;
  country: string;
  sector: string;
  pathwayType: PathwayType;
  eligibility: string;
  requiredDocuments: string[];
  steps: string[];
  officialSourceTitle: string;
  officialSourceUrl: string;
  lastCheckedDate: string;
  freshnessThresholdDays: number;
  generalUncertainties: string[];
}
