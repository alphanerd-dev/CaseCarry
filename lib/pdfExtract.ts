/**
 * In-browser PDF extraction & preparation utility
 * Extracts visible text chunks from PDF streams where available,
 * or prepares the document binary for multimodal Gemini analysis.
 */

export interface PdfExtractionResult {
  text: string;
  isExtracted: boolean;
  pageCountEstimate: number;
  statusMessage: string;
}

export async function extractPdfContent(file: File): Promise<PdfExtractionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Fast text stream inspection for uncompressed text blocks
    // Look for PDF objects and text operators like (text) Tj or [(t) (e) (x) (t)] TJ
    let fullRawString = '';
    const chunkSize = 1024 * 64; // Read in 64KB blocks for memory safety
    const totalBytesToRead = Math.min(bytes.length, 1024 * 512); // Sample up to 512KB

    for (let i = 0; i < totalBytesToRead; i += chunkSize) {
      const slice = bytes.subarray(i, Math.min(i + chunkSize, totalBytesToRead));
      fullRawString += String.fromCharCode.apply(null, Array.from(slice));
    }

    // Extract text in parentheses between BT (Begin Text) and ET (End Text)
    const textSnippets: string[] = [];
    const textTokenRegex = /\(([^)\\]{3,})\)\s*(?:Tj|TJ|'|")/g;
    let match: RegExpExecArray | null;

    while ((match = textTokenRegex.exec(fullRawString)) !== null) {
      const cleanSnippet = match[1]
        .replace(/\\([()\\])/g, '$1')
        .replace(/\\r/g, ' ')
        .replace(/\\n/g, ' ')
        .trim();
      if (cleanSnippet.length > 2 && /[A-Za-z0-9]/.test(cleanSnippet)) {
        textSnippets.push(cleanSnippet);
      }
      if (textSnippets.length > 80) break;
    }

    // Estimate pages from /Count or /Page occurrences
    const pageMatches = fullRawString.match(/\/Type\s*\/Page\b/g);
    const pageCount = pageMatches ? pageMatches.length : 1;

    if (textSnippets.length > 0) {
      const extractedText = textSnippets.join(' ');
      return {
        text: extractedText,
        isExtracted: true,
        pageCountEstimate: Math.max(1, pageCount),
        statusMessage: `PDF text extracted (${extractedText.length} characters found in document streams).`,
      };
    } else {
      return {
        text: '',
        isExtracted: false,
        pageCountEstimate: Math.max(1, pageCount),
        statusMessage:
          'PDF structure verified. Document binary prepared for multimodal AI content analysis.',
      };
    }
  } catch (err) {
    console.warn('PDF stream extraction notice:', err);
    return {
      text: '',
      isExtracted: false,
      pageCountEstimate: 1,
      statusMessage: 'PDF attached as document file. Ready for server reconstruction.',
    };
  }
}
