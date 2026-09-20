export type ProvenanceType =
  | 'source-backed'
  | 'user-reported'
  | 'inferred'
  | 'needs-review'
  | 'conflict';

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
}

export interface CaseEvent {
  id: string;
  date: string;
  displayDate: string;
  title: string;
  description: string;
  provenance: ProvenanceType;
  provenanceLabel: string;
  sourceIds: string[];
  sourceNames: string[];
  verifiedByUser: boolean;
  disputed?: boolean;
  conflictDetails?: string;
  notes?: string;
  category?: 'billing' | 'complaint' | 'response' | 'payment' | 'communication' | 'status';
}

export interface UnresolvedIssue {
  problem: string;
  alreadyTried: string;
  responseReceived: string;
  resolutionVision: string;
  requestedAction: string;
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
  createdAt: string;
  updatedAt: string;
  isCompleted?: boolean;
}
