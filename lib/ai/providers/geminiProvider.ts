import { GoogleGenAI } from '@google/genai';
import { AI_PROVIDERS, isProviderConfigured } from '../config';
import { adaptEvidenceForProvider } from '../evidenceProcessor';
import { CANONICAL_RECONSTRUCTION_SYSTEM_PROMPT, buildReconstructionUserPrompt } from '../prompts';
import { ReconstructionInput, ReconstructionResult } from '../types';
import { validateAndNormalizeReconstruction } from '../validation';
import { ProviderError, ReconstructionProvider, normalizeErrorToCode } from './base';

export class GeminiProvider implements ReconstructionProvider {
  public readonly id = 'gemini' as const;
  public readonly name = AI_PROVIDERS.gemini.name;

  public isAvailable(): boolean {
    return isProviderConfigured('gemini');
  }

  public async reconstruct(input: ReconstructionInput): Promise<ReconstructionResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new ProviderError(
        'gemini',
        AI_PROVIDERS.gemini.model,
        'PROVIDER_AUTH_ERROR',
        'GEMINI_API_KEY is not configured on the server.'
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const config = AI_PROVIDERS.gemini;
    const { adaptedSources, mediaAttachments } = adaptEvidenceForProvider(
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

    // Construct Gemini parts
    const parts: any[] = [{ text: userPrompt }];

    for (const media of mediaAttachments) {
      if (media.base64Data) {
        const cleanBase64 = media.base64Data.includes('base64,')
          ? media.base64Data.split('base64,')[1]
          : media.base64Data;
        parts.push({
          inlineData: {
            mimeType: media.mimeType,
            data: cleanBase64,
          },
        });
      }
    }

    const modelsToTry = [config.model, ...(config.fallbackModels || [])];
    let lastError: any = null;

    for (const currentModel of modelsToTry) {
      try {
        // Enforce timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error(`Gemini request timed out after ${config.timeoutMs}ms`)),
            config.timeoutMs
          );
        });

        const apiCallPromise = ai.models.generateContent({
          model: currentModel,
          contents: parts,
          config: {
            systemInstruction: CANONICAL_RECONSTRUCTION_SYSTEM_PROMPT,
            responseMimeType: 'application/json',
          },
        });

        const response: any = await Promise.race([apiCallPromise, timeoutPromise]);
        const responseText = response?.text || '{}';

        let parsed: any;
        try {
          parsed = JSON.parse(responseText);
        } catch {
          const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          parsed = JSON.parse(cleaned);
        }

        const validation = validateAndNormalizeReconstruction(parsed, input.evidenceSources);
        if (!validation.isValid) {
          throw new ProviderError(
            'gemini',
            currentModel,
            'INVALID_PROVIDER_RESPONSE',
            validation.rejectionReason || 'Gemini output failed validation schema'
          );
        }

        return {
          provider: 'gemini',
          model: currentModel,
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
        lastError = err;
        const code = normalizeErrorToCode(err);
        // If it was an auth error or invalid model format, don't keep cycling models pointlessly
        if (code === 'PROVIDER_AUTH_ERROR') {
          throw new ProviderError('gemini', currentModel, code, err.message || 'Authentication error', err);
        }
      }
    }

    const finalCode = normalizeErrorToCode(lastError);
    throw new ProviderError(
      'gemini',
      config.model,
      finalCode,
      lastError?.message || 'Gemini generation failed across candidate models',
      lastError
    );
  }
}
