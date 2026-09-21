import { EvidenceFile } from '@/types/case';
import { NormalizedEvidence, ProviderCapabilities } from './types';

/**
 * Normalizes evidence sources into a safe, bounded representation for AI reconstruction.
 * Ensures original file integrity is preserved while creating a clean payload for providers.
 */
export function normalizeEvidenceSources(
  evidenceList: Array<Partial<EvidenceFile> & { id: string; filename: string }>
): NormalizedEvidence[] {
  return evidenceList.map((e) => {
    // Extract best usable text representation
    const textSnippet = (
      e.extractedText ||
      e.fullSnippet ||
      e.rawText ||
      e.contentSummary ||
      ''
    ).trim();

    const hasUsableText = textSnippet.length > 15;

    // Bounded text snippet (max 8000 characters per doc for prompt efficiency)
    const boundedSnippet = textSnippet.length > 8000
      ? textSnippet.slice(0, 8000) + '... [text truncated for length]'
      : textSnippet;

    return {
      id: e.id,
      title: e.title || e.filename,
      filename: e.filename,
      type: e.type || 'text',
      textSnippet: boundedSnippet,
      mimeType: e.mimeType,
      base64Data: e.dataUrl,
      hasUsableText,
      pageCount: e.pageCount || 1,
    };
  });
}

/**
 * Prepares evidence representation adapted to specific provider capabilities.
 * If provider cannot ingest raw PDF or image binaries, relies strictly on text extraction.
 */
export function adaptEvidenceForProvider(
  evidence: NormalizedEvidence[],
  capabilities: ProviderCapabilities
): {
  adaptedSources: NormalizedEvidence[];
  mediaAttachments: Array<{ mimeType: string; base64Data: string; sourceId: string }>;
} {
  const mediaAttachments: Array<{ mimeType: string; base64Data: string; sourceId: string }> = [];

  const adaptedSources = evidence.map((src) => {
    // Check if media can be attached directly
    const isImage = src.mimeType?.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(src.filename);
    const isPdf = src.mimeType === 'application/pdf' || /\.pdf$/i.test(src.filename);

    if (src.base64Data) {
      if (isImage && capabilities.images) {
        mediaAttachments.push({
          mimeType: src.mimeType || 'image/jpeg',
          base64Data: src.base64Data,
          sourceId: src.id,
        });
      } else if (isPdf && capabilities.pdf) {
        mediaAttachments.push({
          mimeType: 'application/pdf',
          base64Data: src.base64Data,
          sourceId: src.id,
        });
      }
    }

    return src;
  });

  return { adaptedSources, mediaAttachments };
}
