import { CaseEvent, UnresolvedIssue, ProvenanceType } from '@/types/case';

export type AIProviderId = 'gemini' | 'openai' | 'grok' | 'deterministic';

export type ProviderStrategy = 'auto' | 'gemini' | 'openai' | 'grok' | 'deterministic';

export type ProviderErrorCode =
  | 'PROVIDER_AUTH_ERROR'
  | 'PROVIDER_RATE_LIMIT'
  | 'PROVIDER_QUOTA'
  | 'PROVIDER_TIMEOUT'
  | 'PROVIDER_UNAVAILABLE'
  | 'INVALID_PROVIDER_RESPONSE'
  | 'UNSUPPORTED_INPUT'
  | 'UNKNOWN_PROVIDER_ERROR';

export interface ProviderCapabilities {
  text: boolean;
  images: boolean;
  pdf: boolean;
  structuredOutput: boolean;
}

export interface NormalizedEvidence {
  id: string;
  title: string;
  filename: string;
  type: string;
  textSnippet: string;
  mimeType?: string;
  base64Data?: string;
  hasUsableText: boolean;
  pageCount?: number;
}

export interface ReconstructionInput {
  provider?: string;
  referenceNumber?: string;
  failureOutcome?: string;
  userDescription?: string;
  evidenceSources: NormalizedEvidence[];
  strategy?: ProviderStrategy;
}

export interface ProcessingWarning {
  code: string;
  message: string;
  sourceId?: string;
  eventId?: string;
}

export interface ProviderFailureRecord {
  provider: AIProviderId;
  model: string;
  failureType: ProviderErrorCode;
  message: string;
  timestamp: string;
  fallbackProvider?: AIProviderId;
}

export interface AIProcessingMetadata {
  provider: AIProviderId;
  model: string;
  fallbackUsed: boolean;
  primaryProvider?: AIProviderId;
  fallbackReason?: string;
  fallbackHistory?: ProviderFailureRecord[];
  strategyUsed: ProviderStrategy;
  generatedAt: string;
  executionTimeMs?: number;
}

export interface ReconstructionResult {
  provider: AIProviderId;
  model: string;
  events: CaseEvent[];
  contradictions: string[];
  missingInformation: string[];
  unresolvedIssue: UnresolvedIssue;
  processingWarnings: ProcessingWarning[];
  confidence?: 'high' | 'medium' | 'low';
  generatedAt: string;
  fallbackUsed: boolean;
  primaryProvider?: AIProviderId;
  fallbackReason?: string;
  fallbackHistory?: ProviderFailureRecord[];
}

export interface AIProviderStatus {
  id: AIProviderId;
  name: string;
  model: string;
  enabled: boolean;
  isConfigured: boolean;
  capabilities: ProviderCapabilities;
}

export interface ProviderConfig {
  id: AIProviderId;
  name: string;
  model: string;
  fallbackModels?: string[];
  enabled: boolean;
  timeoutMs: number;
  capabilities: ProviderCapabilities;
}
