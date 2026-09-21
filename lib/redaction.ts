/**
 * CaseCarry Real Redaction Utility
 * Genuinely transforms sensitive citizen information:
 * - Nigerian & international phone numbers (e.g., 0803 456 7890 -> 0803******90)
 * - Account numbers, meter numbers, transaction refs (e.g., 0456-DEMO-789123 -> ******9123)
 * - Email addresses (e.g., citizen@example.com -> c***n@example.com)
 * - Physical street addresses (e.g., 12, Fictional Street -> [REDACTED ADDRESS])
 */

export interface RedactionResult {
  redactedText: string;
  maskedFields: string[];
}

export function redactSensitiveText(text: string): RedactionResult {
  if (!text) {
    return { redactedText: '', maskedFields: [] };
  }

  let result = text;
  const maskedFields: string[] = [];

  // 1. Nigerian Phone numbers: e.g., +234 803 123 4567, 08031234567, 0800-000-DEMO
  const phoneRegex = /(\+?234|0)[789][01]\d{1}[\s-]?\d{3}[\s-]?\d{4}/g;
  if (phoneRegex.test(result)) {
    maskedFields.push('Phone numbers');
    result = result.replace(phoneRegex, (match) => {
      const clean = match.replace(/[\s-]/g, '');
      const prefix = clean.slice(0, 4);
      const suffix = clean.slice(-2);
      return `${prefix}******${suffix}`;
    });
  }

  // 2. Email addresses: e.g. citizen@example.com -> c***n@example.com
  const emailRegex = /\b([A-Za-z0-9._%+-])[A-Za-z0-9._%+-]*([A-Za-z0-9._%+-])@([A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\b/g;
  if (emailRegex.test(result)) {
    maskedFields.push('Email addresses');
    result = result.replace(emailRegex, (_match, first, last, domain) => {
      return `${first}***${last}@${domain}`;
    });
  }

  // 3. Meter & Account Numbers (8 to 16 digits, with optional hyphens/spaces):
  // e.g., 0456-DEMO-789123 or 5432-DEMO-9876 or 0456789123
  const accountRegex = /\b(\d{3,4})[- ]?([A-Za-z0-9]{2,4})[- ]?(\d{4})\b/g;
  if (accountRegex.test(result)) {
    maskedFields.push('Account / Meter identifiers');
    result = result.replace(accountRegex, (_match, _p1, _p2, suffix) => {
      return `******${suffix}`;
    });
  }

  // Pure 9-14 digit numbers
  const longDigitsRegex = /\b\d{9,14}\b/g;
  if (longDigitsRegex.test(result)) {
    if (!maskedFields.includes('Account / Meter identifiers')) {
      maskedFields.push('Account / Meter identifiers');
    }
    result = result.replace(longDigitsRegex, (match) => {
      return `******${match.slice(-4)}`;
    });
  }

  // 4. Street / Residential Address patterns
  const addressRegex = /\b\d{1,4}[,\s]+([A-Za-z\s]+)(Street|Close|Avenue|Road|Drive|Crescent|Way|Lane|Estate|Quarters)[^,\n]*/gi;
  if (addressRegex.test(result)) {
    maskedFields.push('Residential / street addresses');
    result = result.replace(addressRegex, '[REDACTED ADDRESS]');
  }

  return {
    redactedText: result,
    maskedFields: Array.from(new Set(maskedFields)),
  };
}

export function redactEvidenceFile<T extends {
  privacyStatus?: any;
  rawText?: string;
  fullSnippet?: string;
  extractedText?: string;
  contentSummary?: string;
  keyFields?: Array<{ label: string; value: string }>;
}>(file: T): T {
  const textToRedact = file.rawText || file.fullSnippet || file.extractedText || '';
  const result = redactSensitiveText(textToRedact);
  const summaryResult = redactSensitiveText(file.contentSummary || '');
  const keyFieldsResult = file.keyFields?.map((kf) => ({
    label: kf.label,
    value: redactSensitiveText(kf.value).redactedText,
  }));

  return {
    ...file,
    privacyStatus: 'redacted',
    rawText: file.rawText ? result.redactedText : undefined,
    extractedText: file.extractedText ? result.redactedText : undefined,
    fullSnippet: file.fullSnippet ? result.redactedText : undefined,
    contentSummary: summaryResult.redactedText,
    keyFields: keyFieldsResult,
  };
}
