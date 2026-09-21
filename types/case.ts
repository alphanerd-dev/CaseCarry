export type ProvenanceType =
  | 'source-backed'
  | 'user-reported'
  | 'inferred'
  | 'needs-review'
  | 'conflict'
  | 'unknown'
  | 'SOURCE_BACKED'
  | 'USER_REPORTED'
  | 'AI_INFERRED'
  | 'NEEDS_REVIEW'
  | 'SOURCE_CONFLICT';

export type DatePrecision =
  | 'exact'
  | 'month'
  | 'approximate'
  | 'relative'
  | 'unknown'
  | 'conflict'
  | 'not-established'
  | 'unspecified';

export type PrivacyStatus =
  | 'included'
  | 'private'
  | 'excluded'
  | 'redacted';

export type CaseStatus =
  | 'draft'
  | 'evidence_collected'
  | 'reconstruction_ready'
  | 'verification_in_progress'
  | 'verified'
  | 'unresolved_defined'
  | 'ready_to_bundle'
  | 'exported'
  | 'preserved_privately';

export interface EvidenceFile {
  id: string;
  title: string;
  filename: string;
  type: 'pdf' | 'image' | 'receipt' | 'email' | 'chat' | 'letter' | 'voicenote' | 'text';
  uploadDate: string;
  pageCount: number;
  size: string;
  processingStatus:
    | 'processed'
    | 'processing'
    | 'error'
    | 'pending'
    | 'extracted'
    | 'binary-ready'
    | 'metadata-only'
    | 'ready';
  privacyStatus: PrivacyStatus;
  redactedItems?: string[];
  contentSummary: string;
  fullSnippet?: string;
  redactedSnippet?: string;
  redactedKeyFields?: string[];
  extractedText?: string;
  fileReference?: string;
  keyFields?: { label: string; value: string }[];
  // Real file handling fields
  dataUrl?: string;
  rawText?: string;
  mimeType?: string;
  isOriginalRetained?: boolean;
}

export interface CaseEvent {
  id: string;
  date: string | null;
  dateText?: string;
  displayDate: string;
  datePrecision?: DatePrecision;
  title: string;
  description: string;
  provenance: ProvenanceType;
  provenanceLabel: string;
  sourceIds: string[];
  sourceNames: string[];
  sourceQuote?: string;
  sourceLocation?: string;
  verifiedByUser: boolean;
  verificationStatus?: 'confirmed' | 'edited' | 'deleted' | 'disputed' | 'unreviewed';
  disputed?: boolean;
  conflictDetails?: string;
  needsReviewReason?: string;
  notes?: string;
  category?: 'billing' | 'complaint' | 'response' | 'payment' | 'communication' | 'status';
}

export interface UnresolvedIssue {
  problem: string;
  originalIssue?: string;
  whatWasRequested?: string;
  whatHappened?: string;
  responseReceived?: string;
  whatWasResolved?: string;
  whatWasNotResolved?: string;
  requestedAction?: string;
  resolutionVision?: string;
  alreadyTried?: string;
}

export interface PathwaySupportingFact {
  label: string;
  fact: string;
  provenance: ProvenanceType;
  sourceNames?: string[];
}

export interface Pathway {
  id: string;
  name: string;
  organization: string;
  jurisdiction: string;
  pathwayType?: 'internal_escalation' | 'sector_regulator' | 'ombudsman' | 'consumer_protection' | 'tribunal_dispute' | 'legal_aid' | 'safety_emergency';
  whyRelevant: string;
  relevanceReason?: string;
  supportingCaseFacts?: PathwaySupportingFact[];
  eligibility: string;
  requiredDocuments: string[];
  steps?: string[];
  officialSource: string;
  sourceUrl?: string;
  lastCheckedDate: string;
  warning: string;
  warnings?: string[];
  whatWeDontKnow?: string;
  uncertainties?: string[];
  statusNotes?: string;
  confidence?: 'high' | 'medium' | 'low';
  confidenceExplanation?: string;
  status?: 'POTENTIAL' | 'RELEVANCE_CONFIRMED' | 'NEEDS_VERIFICATION' | 'PREVIOUSLY_ATTEMPTED' | 'NOT_RELEVANT' | 'UNAVAILABLE' | 'STALE';
  isStale?: boolean;
  staleNotice?: string;
  userNotes?: string;
  previousAttemptNotes?: string;
}

export interface ExtractedCaseFact {
  field: string;
  label: string;
  value: string;
  provenance: ProvenanceType;
  sourceIds: string[];
  sourceNames?: string[];
}

export interface CaseRecord {
  id: string;
  title: string;
  citizenName: string;
  accountReference?: string;
  provider: string;
  firstReportOutcome: string;
  evidence: EvidenceFile[];
  events: CaseEvent[];
  unresolved: UnresolvedIssue;
  selectedPathways: string[];
  pathways?: Pathway[];
  extractedFacts?: ExtractedCaseFact[];
  pathwayDiscoverySource?: 'live_research' | 'verified_cache' | 'local_fallback';
  safetyAlert?: {
    isHighRisk: boolean;
    riskType?: string;
    advisory: string;
    emergencyResources?: Array<{ name: string; contact: string; note: string }>;
  };
  contradictions?: string[];
  missingInformation?: string[];
  createdAt: string;
  updatedAt: string;
  dateOpened?: string;
  isCompleted?: boolean;
  isDemo?: boolean;
  status?: CaseStatus;
  verificationReviewed?: boolean;
  reconstructionMethod?: 'gemini' | 'openai' | 'grok' | 'deterministic' | 'local' | 'fallback-draft' | 'user-created';
  reconstructionNotice?: string;
  sourcesAnalyzedCount?: number;
  aiProcessing?: {
    provider: 'gemini' | 'openai' | 'grok' | 'deterministic';
    model: string;
    fallbackUsed: boolean;
    primaryProvider?: string;
    fallbackReason?: string;
    generatedAt: string;
    fallbackHistory?: Array<{
      provider: string;
      model: string;
      failureType: string;
      message: string;
      timestamp: string;
    }>;
  };
}
