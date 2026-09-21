export type ProvenanceType =
  | 'source-backed'
  | 'user-reported'
  | 'inferred'
  | 'needs-review'
  | 'conflict';

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
  processingStatus: 'processed' | 'processing' | 'error' | 'pending';
  privacyStatus: 'included' | 'private' | 'redacted';
  redactedItems?: string[];
  contentSummary: string;
  fullSnippet?: string;
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
  date: string;
  displayDate: string;
  datePrecision?: 'exact' | 'approximate' | 'unspecified';
  title: string;
  description: string;
  provenance: ProvenanceType;
  provenanceLabel: string;
  sourceIds: string[];
  sourceNames: string[];
  sourceQuote?: string;
  verifiedByUser: boolean;
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

export interface Pathway {
  id: string;
  name: string;
  organization: string;
  jurisdiction: string;
  whyRelevant: string;
  eligibility: string;
  requiredDocuments: string[];
  officialSource: string;
  sourceUrl?: string;
  lastCheckedDate: string;
  warning: string;
  whatWeDontKnow?: string;
  statusNotes?: string;
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
  contradictions?: string[];
  missingInformation?: string[];
  createdAt: string;
  updatedAt: string;
  dateOpened?: string;
  isCompleted?: boolean;
  isDemo?: boolean;
  status?: CaseStatus;
}
