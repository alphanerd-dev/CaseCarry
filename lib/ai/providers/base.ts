import { AIProviderId, ProviderErrorCode, ReconstructionInput, ReconstructionResult } from '../types';

export class ProviderError extends Error {
  public readonly code: ProviderErrorCode;
  public readonly provider: AIProviderId;
  public readonly model: string;
  public readonly originalError?: any;

  constructor(
    provider: AIProviderId,
    model: string,
    code: ProviderErrorCode,
    message: string,
    originalError?: any
  ) {
    super(message);
    this.name = 'ProviderError';
    this.provider = provider;
    this.model = model;
    this.code = code;
    this.originalError = originalError;
  }
}

export interface ReconstructionProvider {
  id: AIProviderId;
  name: string;
  isAvailable(): boolean;
  reconstruct(input: ReconstructionInput): Promise<ReconstructionResult>;
}

export function normalizeErrorToCode(err: any): ProviderErrorCode {
  if (!err) return 'UNKNOWN_PROVIDER_ERROR';
  if (err.code && typeof err.code === 'string' && err.code.startsWith('PROVIDER_')) {
    return err.code as ProviderErrorCode;
  }

  const msg = (err.message || '').toLowerCase();
  const status = err.status || err.statusCode || 0;

  if (
    status === 401 ||
    status === 403 ||
    msg.includes('api key') ||
    msg.includes('unauthorized') ||
    msg.includes('forbidden') ||
    msg.includes('permission denied') ||
    msg.includes('authentication')
  ) {
    return 'PROVIDER_AUTH_ERROR';
  }

  if (
    status === 429 ||
    msg.includes('quota') ||
    msg.includes('resource_exhausted') ||
    msg.includes('rate limit') ||
    msg.includes('too many requests')
  ) {
    return 'PROVIDER_QUOTA';
  }

  if (
    status === 503 ||
    status === 502 ||
    status === 504 ||
    msg.includes('high demand') ||
    msg.includes('unavailable') ||
    msg.includes('overloaded') ||
    msg.includes('service unavailable')
  ) {
    return 'PROVIDER_UNAVAILABLE';
  }

  if (
    msg.includes('timeout') ||
    msg.includes('timed out') ||
    msg.includes('aborted') ||
    err.name === 'AbortError' ||
    err.name === 'TimeoutError'
  ) {
    return 'PROVIDER_TIMEOUT';
  }

  if (
    msg.includes('json') ||
    msg.includes('unexpected token') ||
    msg.includes('malformed') ||
    msg.includes('invalid structured response')
  ) {
    return 'INVALID_PROVIDER_RESPONSE';
  }

  return 'UNKNOWN_PROVIDER_ERROR';
}
