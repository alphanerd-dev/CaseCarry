import { AI_PROVIDERS, DEFAULT_FAILOVER_ORDER } from './config';
import { DeterministicProvider } from './providers/deterministicProvider';
import { GeminiProvider } from './providers/geminiProvider';
import { GrokProvider } from './providers/grokProvider';
import { OpenAIProvider } from './providers/openaiProvider';
import { ReconstructionProvider } from './providers/base';
import {
  AIProviderId,
  ProviderErrorCode,
  ProviderFailureRecord,
  ProviderStrategy,
  ReconstructionInput,
  ReconstructionResult,
} from './types';

export class ReconstructionService {
  private providers: Map<AIProviderId, ReconstructionProvider>;

  constructor() {
    this.providers = new Map<AIProviderId, ReconstructionProvider>();
    this.providers.set('gemini', new GeminiProvider());
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('grok', new GrokProvider());
    this.providers.set('deterministic', new DeterministicProvider());
  }

  /**
   * Reconstructs a case from evidence using configured providers and controlled failover.
   */
  public async reconstructCase(input: ReconstructionInput): Promise<ReconstructionResult> {
    const strategy: ProviderStrategy = input.strategy || 'auto';
    const failoverHistory: ProviderFailureRecord[] = [];

    // Determine candidate provider list based on strategy
    let providerQueue: AIProviderId[] = [];
    if (strategy === 'gemini') {
      providerQueue = ['gemini', 'deterministic'];
    } else if (strategy === 'openai') {
      providerQueue = ['openai', 'deterministic'];
    } else if (strategy === 'grok') {
      providerQueue = ['grok', 'deterministic'];
    } else if (strategy === 'deterministic') {
      providerQueue = ['deterministic'];
    } else {
      // Auto failover: Gemini -> OpenAI -> Grok -> Deterministic
      providerQueue = [...DEFAULT_FAILOVER_ORDER];
    }

    const primaryTarget = providerQueue[0];

    for (let i = 0; i < providerQueue.length; i++) {
      const providerId = providerQueue[i];
      const providerInstance = this.providers.get(providerId);

      if (!providerInstance) continue;

      // Check if provider credentials/configuration exist
      if (!providerInstance.isAvailable()) {
        if (providerId !== 'deterministic') {
          failoverHistory.push({
            provider: providerId,
            model: AI_PROVIDERS[providerId]?.model || providerId,
            failureType: 'PROVIDER_AUTH_ERROR',
            message: `${providerInstance.name} is not configured with an API key.`,
            timestamp: new Date().toISOString(),
            fallbackProvider: providerQueue[i + 1],
          });
        }
        continue;
      }

      try {
        const result = await providerInstance.reconstruct(input);

        const isFallback = providerId !== primaryTarget;
        let fallbackReason: string | undefined;

        if (isFallback && failoverHistory.length > 0) {
          const primaryFailure = failoverHistory.find((f) => f.provider === primaryTarget);
          if (primaryFailure) {
            fallbackReason = `${AI_PROVIDERS[primaryTarget]?.name || primaryTarget} was unavailable (${primaryFailure.failureType.toLowerCase().replace(/_/g, ' ')}), so CaseCarry used ${AI_PROVIDERS[providerId]?.name || providerId}.`;
          } else {
            fallbackReason = `Primary provider was not configured, so CaseCarry used ${AI_PROVIDERS[providerId]?.name || providerId}.`;
          }
        }

        return {
          ...result,
          fallbackUsed: isFallback,
          primaryProvider: primaryTarget,
          fallbackReason,
          fallbackHistory: failoverHistory.length > 0 ? failoverHistory : undefined,
        };
      } catch (err: any) {
        const failureCode: ProviderErrorCode =
          err.code && typeof err.code === 'string' && err.code.startsWith('PROVIDER_')
            ? err.code
            : 'UNKNOWN_PROVIDER_ERROR';

        const safeMessage = (err.message || 'Provider execution failed')
          // Strip potential secret tokens from error messages
          .replace(/[a-zA-Z0-9_-]{20,}/g, '[REDACTED]');

        failoverHistory.push({
          provider: providerId,
          model: err.model || AI_PROVIDERS[providerId]?.model || providerId,
          failureType: failureCode,
          message: safeMessage,
          timestamp: new Date().toISOString(),
          fallbackProvider: providerQueue[i + 1],
        });

        // Continue loop to next provider in queue
      }
    }

    // If all providers in queue failed, invoke deterministic fallback as absolute safeguard
    const fallbackProvider = new DeterministicProvider();
    const fallbackResult = await fallbackProvider.reconstruct(input);

    return {
      ...fallbackResult,
      fallbackUsed: true,
      primaryProvider: primaryTarget,
      fallbackReason: 'Configured AI providers were unavailable. CaseCarry generated a baseline reconstruction directly from your evidence.',
      fallbackHistory: failoverHistory,
    };
  }
}

// Singleton instance
export const reconstructionService = new ReconstructionService();

export async function reconstructCase(input: ReconstructionInput): Promise<ReconstructionResult> {
  return reconstructionService.reconstructCase(input);
}
