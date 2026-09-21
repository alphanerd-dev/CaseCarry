import { AIProviderId, AIProviderStatus, ProviderConfig } from './types';

export const AI_PROVIDERS: Record<AIProviderId, ProviderConfig> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    model: 'gemini-3.8-flash',
    fallbackModels: ['gemini-3.6-flash', 'gemini-3.1-flash-lite'],
    enabled: true,
    timeoutMs: 20000,
    capabilities: {
      text: true,
      images: true,
      pdf: true,
      structuredOutput: true,
    },
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    model: 'gpt-4o-mini',
    fallbackModels: ['gpt-4o'],
    enabled: true,
    timeoutMs: 20000,
    capabilities: {
      text: true,
      images: true,
      pdf: false,
      structuredOutput: true,
    },
  },
  grok: {
    id: 'grok',
    name: 'xAI Grok',
    model: 'grok-2-latest',
    fallbackModels: ['grok-beta'],
    enabled: true,
    timeoutMs: 20000,
    capabilities: {
      text: true,
      images: true,
      pdf: false,
      structuredOutput: true,
    },
  },
  deterministic: {
    id: 'deterministic',
    name: 'Deterministic Baseline',
    model: 'casecarry-deterministic-v1',
    enabled: true,
    timeoutMs: 2000,
    capabilities: {
      text: true,
      images: true,
      pdf: true,
      structuredOutput: true,
    },
  },
};

export const DEFAULT_FAILOVER_ORDER: AIProviderId[] = [
  'gemini',
  'openai',
  'grok',
  'deterministic',
];

export function isProviderConfigured(providerId: AIProviderId): boolean {
  if (providerId === 'deterministic') return true;
  if (providerId === 'gemini') {
    return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  }
  if (providerId === 'openai') {
    return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0);
  }
  if (providerId === 'grok') {
    return Boolean(process.env.XAI_API_KEY && process.env.XAI_API_KEY.trim().length > 0);
  }
  return false;
}

export function getProviderStatusList(): AIProviderStatus[] {
  return (['gemini', 'openai', 'grok', 'deterministic'] as AIProviderId[]).map((id) => {
    const config = AI_PROVIDERS[id];
    return {
      id,
      name: config.name,
      model: config.model,
      enabled: config.enabled,
      isConfigured: isProviderConfigured(id),
      capabilities: config.capabilities,
    };
  });
}
