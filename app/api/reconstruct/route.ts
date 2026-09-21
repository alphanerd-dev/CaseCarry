import { NextRequest, NextResponse } from 'next/server';
import { normalizeEvidenceSources } from '@/lib/ai/evidenceProcessor';
import { reconstructCase } from '@/lib/ai/service';
import { ProviderStrategy } from '@/lib/ai/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      provider,
      referenceNumber,
      failureOutcome,
      userDescription,
      evidenceSources = [],
      strategy = 'auto',
    } = body;

    const normalizedEvidence = normalizeEvidenceSources(evidenceSources);

    const result = await reconstructCase({
      provider: typeof provider === 'string' ? provider.trim() : '',
      referenceNumber: typeof referenceNumber === 'string' ? referenceNumber.trim() : '',
      failureOutcome: typeof failureOutcome === 'string' ? failureOutcome.trim() : '',
      userDescription: typeof userDescription === 'string' ? userDescription.trim() : '',
      evidenceSources: normalizedEvidence,
      strategy: (strategy as ProviderStrategy) || 'auto',
    });

    return NextResponse.json({
      success: true,
      data: {
        events: result.events,
        unresolvedDraft: result.unresolvedIssue,
        contradictions: result.contradictions,
        missingInformation: result.missingInformation,
        aiProcessing: {
          provider: result.provider,
          model: result.model,
          fallbackUsed: result.fallbackUsed,
          primaryProvider: result.primaryProvider,
          fallbackReason: result.fallbackReason,
          fallbackHistory: result.fallbackHistory,
          generatedAt: result.generatedAt,
        },
      },
      fallbackNotice: result.fallbackReason || null,
      providerUsed: result.provider,
      modelUsed: result.model,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred during case reconstruction.',
      },
      { status: 500 }
    );
  }
}
