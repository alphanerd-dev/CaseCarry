import { AI_PROVIDERS, isProviderConfigured } from '../config';
import { adaptEvidenceForProvider } from '../evidenceProcessor';
import { CANONICAL_RECONSTRUCTION_SYSTEM_PROMPT, buildReconstructionUserPrompt } from '../prompts';
import { ReconstructionInput, ReconstructionResult } from '../types';
import { validateAndNormalizeReconstruction } from '../validation';
import { ProviderError, ReconstructionProvider, normalizeErrorToCode } from './base';

export class OpenAIProvider implements ReconstructionProvider {
  public readonly id = 'openai' as const;
  public readonly name = AI_PROVIDERS.openai.name;

  public isAvailable(): boolean {
    return isProviderConfigured('openai');
  }

  public async reconstruct(input: ReconstructionInput): Promise<ReconstructionResult> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new ProviderError(
        'openai',
        AI_PROVIDERS.openai.model,
        'PROVIDER_AUTH_ERROR',
        'OPENAI_API_KEY is not configured on the server.'
      );
    }

    const config = AI_PROVIDERS.openai;
    const { adaptedSources } = adaptEvidenceForProvider(
      input.evidenceSources,
      config.capabilities
    );

    const userPrompt = buildReconstructionUserPrompt({
      provider: input.provider,
      referenceNumber: input.referenceNumber,
      failureOutcome: input.failureOutcome,
      userDescription: input.userDescription,
      evidenceSources: adaptedSources,
    });

    const messages = [
      { role: 'system', content: CANONICAL_RECONSTRUCTION_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages,
          response_format: { type: 'json_object' },
          temperature: 0.1,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const status = res.status;
        const msg = errJson?.error?.message || `OpenAI request failed with status ${status}`;

        if (status === 401 || status === 403) {
          throw new ProviderError('openai', config.model, 'PROVIDER_AUTH_ERROR', msg);
        } else if (status === 429) {
          throw new ProviderError('openai', config.model, 'PROVIDER_QUOTA', msg);
        } else if (status >= 500) {
          throw new ProviderError('openai', config.model, 'PROVIDER_UNAVAILABLE', msg);
        }
        throw new ProviderError('openai', config.model, 'UNKNOWN_PROVIDER_ERROR', msg);
      }

      const resJson = await res.json();
      const contentStr = resJson?.choices?.[0]?.message?.content || '{}';

      let parsed: any;
      try {
        parsed = JSON.parse(contentStr);
      } catch {
        const cleaned = contentStr.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      }

      const validation = validateAndNormalizeReconstruction(parsed, input.evidenceSources);
      if (!validation.isValid) {
        throw new ProviderError(
          'openai',
          config.model,
          'INVALID_PROVIDER_RESPONSE',
          validation.rejectionReason || 'OpenAI output failed validation schema'
        );
      }

      return {
        provider: 'openai',
        model: config.model,
        events: validation.events,
        contradictions: validation.contradictions,
        missingInformation: validation.missingInformation,
        unresolvedIssue: validation.unresolvedIssue,
        processingWarnings: validation.warnings,
        confidence: 'high',
        generatedAt: new Date().toISOString(),
        fallbackUsed: false,
      };
    } catch (err: any) {
      if (err instanceof ProviderError) throw err;
      const code = normalizeErrorToCode(err);
      throw new ProviderError('openai', config.model, code, err.message || 'OpenAI call failed', err);
    }
  }
}
