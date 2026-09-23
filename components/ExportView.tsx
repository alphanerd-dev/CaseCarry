'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  FileText,
  Archive,
  Code,
  Printer,
  CheckCircle2,
  Check,
  ShieldCheck,
  ExternalLink,
  Share2,
  RotateCcw,
  Eye,
  Bookmark,
  Sparkles,
  AlertTriangle,
  MessageCircle,
  Copy,
  FileDown,
  Loader2
} from 'lucide-react';
import { CaseRecord } from '@/types/case';
import { redactEvidenceFile } from '@/lib/redaction';
import { SupportedLanguage, TRANSLATIONS } from '@/lib/i18n';
import { generateCaseCarryPdf } from '@/lib/pdfExport';

interface ExportViewProps {
  caseData: CaseRecord;
  onBackToBundle: () => void;
  onStartAnotherCase: () => void;
  onViewCase: () => void;
  onPreservePrivately?: () => void;
  onGoToVerification?: () => void;
  currentLanguage?: SupportedLanguage;
}

export function ExportView({
  caseData,
  onBackToBundle,
  onStartAnotherCase,
  onViewCase,
  onPreservePrivately,
  onGoToVerification,
  currentLanguage = 'en',
}: ExportViewProps) {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [preservedNotice, setPreservedNotice] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [showWhatsAppPreview, setShowWhatsAppPreview] = useState(false);
  const [whatsAppCopied, setWhatsAppCopied] = useState(false);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const isBlocked = !caseData.verificationReviewed;

  // Generate formatted WhatsApp message text
  const generateWhatsAppMessage = (): string => {
    const includedEvidence = (caseData.evidence || []).filter((e) => e.privacyStatus !== 'private');
    const eventsSummary = caseData.events
      .slice(0, 4)
      .map((ev) => `• [${ev.displayDate || ev.date}] ${ev.title}`)
      .join('\n');

    return `📁 *CASECARRY DISPUTE DOSSIER*
*Ref ID:* ${caseData.id}
*Complainant:* ${caseData.citizenName || 'Citizen'}
*Provider:* ${caseData.provider || 'Service Provider'}
*Account / Ref:* ${caseData.accountReference || 'N/A'}
*Status:* Unresolved Dispute

----------------------------------------
*1. CORE UNRESOLVED ISSUE:*
${caseData.unresolved.problem || caseData.unresolved.whatWasNotResolved || caseData.unresolved.originalIssue || 'Unresolved service dispute'}

*2. REQUESTED RESOLUTION:*
${caseData.unresolved.requestedAction || caseData.unresolved.resolutionVision || 'Formal review and account reconciliation'}

*3. KEY VERIFIED EVENTS (${caseData.events.length} total):*
${eventsSummary}${caseData.events.length > 4 ? `\n...and ${caseData.events.length - 4} more verified events` : ''}

*4. EVIDENCE ATTACHED:*
${includedEvidence.length} indexed document(s) attached and verified.

----------------------------------------
_Prepared & verified via CaseCarry citizen case continuity system._`;
  };

  // WhatsApp share trigger
  const handleShareWhatsApp = () => {
    if (isBlocked) {
      setDownloadSuccess('CaseCarry cannot export an unreviewed case record. Review and verify the timeline events before carrying this case forward.');
      return;
    }

    const message = generateWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;

    // Open WhatsApp link in a new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setDownloadSuccess(t.whatsAppShareSuccess || 'WhatsApp share window opened with verified case dossier.');
  };

  // Copy WhatsApp message text to clipboard
  const handleCopyWhatsAppText = async () => {
    try {
      const text = generateWhatsAppMessage();
      await navigator.clipboard.writeText(text);
      setWhatsAppCopied(true);
      setDownloadSuccess(t.copiedNotice || 'Case dossier text copied to clipboard for WhatsApp sharing.');
      setTimeout(() => setWhatsAppCopied(false), 3000);
    } catch {
      setDownloadSuccess('Could not copy to clipboard automatically.');
    }
  };

  // PDF Export trigger using jsPDF engine
  const handleDownloadPDF = async () => {
    if (isBlocked) {
      setDownloadSuccess('CaseCarry cannot export an unreviewed case record. Review and verify the timeline events before carrying this case forward.');
      return;
    }

    setIsPdfGenerating(true);
    setDownloadSuccess(t.pdfGenerating || 'Generating official PDF bundle...');

    try {
      const success = await generateCaseCarryPdf(caseData, () => {
        window.print();
      });

      if (success) {
        setDownloadSuccess(t.pdfSuccess || 'Official PDF case bundle generated and downloaded.');
      }
    } catch (err) {
      console.error('PDF export error:', err);
      window.print();
      setDownloadSuccess('Fallback to browser print initiated.');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Generate plain text / JSON record for instant download
  const handleDownloadJSON = () => {
    if (isBlocked) {
      setDownloadSuccess('CaseCarry cannot export an unreviewed case record. Review and verify the timeline events before carrying this case forward.');
      return;
    }

    const sanitizedEvidence = (caseData.evidence || [])
      .filter((e) => e.privacyStatus !== 'private')
      .map((e) => (e.privacyStatus === 'redacted' ? redactEvidenceFile(e) : e));

    const exportPayload = {
      ...caseData,
      evidence: sanitizedEvidence,
      retainedPrivateDocumentsCount: (caseData.evidence || []).filter((e) => e.privacyStatus === 'private').length,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CaseCarry_${caseData.id}_Record.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess('Structured JSON Record downloaded successfully.');
  };

  const handleDownloadSummaryDoc = () => {
    if (isBlocked) {
      setDownloadSuccess('CaseCarry cannot export an unreviewed case record. Review and verify the timeline events before carrying this case forward.');
      return;
    }
    const contradictionSection =
      caseData.contradictions && caseData.contradictions.length > 0
        ? caseData.contradictions.map((c) => `• ${c}`).join('\n')
        : '• No institutional contradictions detected.';

    const missingInfoSection =
      caseData.missingInformation && caseData.missingInformation.length > 0
        ? caseData.missingInformation.map((m) => `• ${m}`).join('\n')
        : '• No missing records noted.';

    const textContent = `================================================================================
CASECARRY CARRY-FORWARD CASE BUNDLE
Citizen-Controlled Case Continuity Record
================================================================================

CASE TITLE: ${caseData.title}
RECORD ID: ${caseData.id}
CITIZEN: ${caseData.citizenName || 'Citizen'}
SERVICE PROVIDER: ${caseData.provider || 'Service Provider'}
ACCOUNT REFERENCE: ${caseData.accountReference || 'Not provided'}
STATUS: Unresolved
UPDATED: ${caseData.updatedAt || 'Recent'}

--------------------------------------------------------------------------------
1. ORIGINAL DISPUTE & CONTEXT
--------------------------------------------------------------------------------
${caseData.unresolved.originalIssue || 'Original issue regarding service or billing delivery.'}

--------------------------------------------------------------------------------
2. WHAT REMAINS UNRESOLVED (THE CORE PROBLEM)
--------------------------------------------------------------------------------
${caseData.unresolved.problem || caseData.unresolved.whatWasNotResolved || 'The reported issue remains unresolved.'}

--------------------------------------------------------------------------------
3. WHAT HAS ALREADY BEEN TRIED
--------------------------------------------------------------------------------
${caseData.unresolved.alreadyTried || 'Documented in attached chronology.'}

--------------------------------------------------------------------------------
4. RESPONSES RECEIVED
--------------------------------------------------------------------------------
${caseData.unresolved.responseReceived || 'No satisfactory resolution received.'}

--------------------------------------------------------------------------------
5. REQUESTED ACTION FROM RECIPIENT
--------------------------------------------------------------------------------
${caseData.unresolved.requestedAction || 'Resolution of disputed records and restitution of proper service.'}

FAIR RESOLUTION VISION:
${caseData.unresolved.resolutionVision || 'Fair reconciliation and documented closure.'}

--------------------------------------------------------------------------------
6. VERIFIED CHRONOLOGY & PROVENANCE
--------------------------------------------------------------------------------
${caseData.events
  .map(
    (ev) =>
      `[${ev.displayDate}] ${ev.title}\nProvenance: ${ev.provenanceLabel || ev.provenance}\nDetails: ${ev.description}${
        ev.conflictDetails ? `\n⚠️ Contradiction: ${ev.conflictDetails}` : ''
      }\nSources: ${ev.sourceNames.join(', ') || 'Direct citizen testimony'}\n`
  )
  .join('\n')}

--------------------------------------------------------------------------------
7. EVIDENCE INDEX (ATTACHED ARTIFACTS)
--------------------------------------------------------------------------------
${caseData.evidence
  .filter((e) => e.privacyStatus !== 'private')
  .map(
    (e, idx) =>
      `${idx + 1}. [${e.type.toUpperCase()}] ${e.title} (${e.filename}) - ${e.size} - Privacy: ${
        e.privacyStatus === 'redacted' ? 'Redacted' : 'Included'
      }`
  )
  .join('\n')}

--------------------------------------------------------------------------------
8. SURFACED CONTRADICTIONS & UNCERTAINTIES
--------------------------------------------------------------------------------
CONTRADICTIONS:
${contradictionSection}

MISSING RECORDS / UNCERTAINTIES:
${missingInfoSection}

================================================================================
Generated with CaseCarry (https://casecarry.civic).
No proprietary software needed to read this record.
Citizen-controlled case continuity.
================================================================================
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `CaseCarry_${(caseData.citizenName || 'Citizen').replace(/\s+/g, '_')}_Case_Bundle.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Portable Case Bundle text file downloaded.');
  };

  const handlePrintPaperCopy = () => {
    if (isBlocked) {
      setDownloadSuccess('CaseCarry cannot export an unreviewed case record. Review and verify the timeline events before carrying this case forward.');
      return;
    }
    window.print();
    setDownloadSuccess('Browser print dialogue opened. You can print a physical paper copy or save as PDF.');
  };

  const handlePreserve = () => {
    if (onPreservePrivately) {
      onPreservePrivately();
    }
    setPreservedNotice(true);
    setDownloadSuccess('Case preserved privately in local storage. No external transfer occurred.');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Navigation & Quick Actions */}
      <div className="flex items-center justify-between gap-3 mb-6 print:hidden">
        <button
          id="back-to-bundle-top-btn"
          onClick={onBackToBundle}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033] p-1 rounded-md transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{t.back || 'Back to Bundle Preview'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="export-quick-whatsapp-btn"
            onClick={handleShareWhatsApp}
            disabled={isBlocked}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 shadow-2xs transition-colors cursor-pointer ${
              isBlocked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Share via WhatsApp"
          >
            <MessageCircle size={14} className="text-emerald-700" />
            <span>WhatsApp</span>
          </button>

          <button
            id="export-quick-pdf-btn"
            onClick={handleDownloadPDF}
            disabled={isBlocked || isPdfGenerating}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2457C5]/30 bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-[#2457C5] shadow-2xs transition-colors cursor-pointer ${
              isBlocked || isPdfGenerating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Download PDF"
          >
            {isPdfGenerating ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
          {t.exportTitle || 'Your case bundle is ready'}
        </h1>
        <p className="text-sm sm:text-base text-[#526071] mt-2 leading-relaxed">
          {t.exportSubtitle || 'Export your verified bundle in a recipient-neutral format. Take it to an ombudsman, regulatory commission, caseworker, legal clinic, or civic advocate.'}
        </p>
      </div>

      {/* Verification Gate Barrier if Not Reviewed */}
      {isBlocked && (
        <div className="mb-6 p-5 bg-amber-50 border border-amber-300 rounded-2xl space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-700 shrink-0 mt-0.5" size={20} />
            <div>
              <h2 className="text-sm font-bold text-amber-900">
                Verification Review Required Before Export
              </h2>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                CaseCarry cannot export an unreviewed case record. Review and verify the timeline events before carrying this case forward.
              </p>
            </div>
          </div>
          <div className="pt-1 flex items-center gap-3">
            <button
              onClick={onGoToVerification || onBackToBundle}
              className="px-4 py-2 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-xs font-semibold rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Return to Step 4: Verification</span>
            </button>
          </div>
        </div>
      )}

      {/* Download notification if triggered */}
      {downloadSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-[#18794E] font-medium animate-in fade-in">
          <CheckCircle2 size={16} className="shrink-0 text-[#18794E]" />
          <span className="flex-1">{downloadSuccess}</span>
          <button
            onClick={() => setDownloadSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Primary Export Options Grid */}
      <div className={`space-y-3.5 ${isBlocked ? 'opacity-50 pointer-events-none select-none' : ''}`}>
        
        {/* Option 1: Official PDF Export (Formatted Case Carry Bundle) */}
        <div
          id="export-pdf-card"
          onClick={handleDownloadPDF}
          className="p-5 bg-white border-2 border-[#2457C5]/50 hover:border-[#2457C5] rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2457C5] flex items-center justify-center group-hover:bg-[#2457C5] group-hover:text-white transition-colors shrink-0">
              {isPdfGenerating ? <Loader2 size={24} className="animate-spin" /> : <FileDown size={24} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#172033]">
                  {t.downloadPdf || 'Download Official PDF Bundle (.pdf)'}
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#2457C5]">
                  Official Format
                </span>
              </div>
              <p className="text-xs text-[#526071] mt-0.5 leading-relaxed">
                {t.downloadPdfDesc || 'Formatted, multi-page carry-forward case dossier with verified timeline, metadata, and evidence index.'}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-[#2457C5] group-hover:bg-[#2457C5] group-hover:text-white transition-colors">
            <Download size={18} />
          </div>
        </div>

        {/* Option 2: WhatsApp Share & Dispatch */}
        <div
          id="export-whatsapp-card"
          className="p-5 bg-white border border-emerald-300 hover:border-emerald-500 rounded-xl shadow-xs transition-all flex flex-col gap-3 group"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                <MessageCircle size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#172033]">
                    {t.shareWhatsApp || 'Share on WhatsApp'}
                  </h3>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Direct Send
                  </span>
                </div>
                <p className="text-xs text-[#526071] mt-0.5 leading-relaxed">
                  {t.shareWhatsAppDesc || 'Send formatted case dossier summary directly to a caseworker, lawyer, or support line via WhatsApp.'}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <button
                id="export-whatsapp-open-btn"
                onClick={handleShareWhatsApp}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <ExternalLink size={14} />
                <span>{t.shareWhatsAppBtn || 'Open WhatsApp'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              id="export-whatsapp-copy-btn"
              onClick={handleCopyWhatsAppText}
              className="px-2.5 py-1 text-xs font-semibold text-[#526071] hover:text-[#172033] hover:bg-slate-100 rounded-md inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              {whatsAppCopied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              <span>{whatsAppCopied ? (t.copied || 'Copied!') : (t.copyWhatsAppText || 'Copy WhatsApp Message')}</span>
            </button>

            <button
              onClick={() => setShowWhatsAppPreview(!showWhatsAppPreview)}
              className="px-2.5 py-1 text-xs font-semibold text-[#526071] hover:text-[#172033] hover:bg-slate-100 rounded-md inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Eye size={13} />
              <span>{showWhatsAppPreview ? 'Hide Message Preview' : 'Preview Message Text'}</span>
            </button>
          </div>

          {showWhatsAppPreview && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {generateWhatsAppMessage()}
            </div>
          )}
        </div>

        {/* Option 3: Print Paper Copy (Fallback & Physical Filings) */}
        <div
          id="export-print-copy-card"
          onClick={handlePrintPaperCopy}
          className="p-5 bg-white border border-[#D9DEE7] hover:border-slate-400 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-700 group-hover:text-white transition-colors shrink-0">
              <Printer size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#172033]">
                  {t.printPaperCopy || 'Print Paper Copy'}
                </h3>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-[#526071] border border-slate-200">
                  Paper / Print
                </span>
              </div>
              <p className="text-xs text-[#526071] mt-0.5">
                Opens the browser print dialogue to generate physical hardcopies for submission.
              </p>
            </div>
          </div>
          <Printer size={18} className="text-slate-500 shrink-0" />
        </div>

        {/* Option 4: Universal Plain Text (.txt) */}
        <div
          id="export-txt-card"
          onClick={handleDownloadSummaryDoc}
          className="p-5 bg-white border border-[#D9DEE7] hover:border-slate-400 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#18794E] flex items-center justify-center group-hover:bg-[#18794E] group-hover:text-white transition-colors shrink-0">
              <Archive size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172033]">
                {t.downloadText || 'Download Plain Text (.txt)'}
              </h3>
              <p className="text-xs text-[#526071] mt-0.5">
                Universal text bundle formatted for email attachments or offline filing.
              </p>
            </div>
          </div>
          <Download size={18} className="text-[#18794E] shrink-0" />
        </div>

        {/* Option 5: Structured Open Civic JSON */}
        <div
          id="export-json-card"
          onClick={handleDownloadJSON}
          className="p-5 bg-white border border-[#D9DEE7] hover:border-slate-400 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-700 group-hover:text-white transition-colors shrink-0">
              <Code size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#172033]">
                  {t.downloadJson || 'Download Case Bundle (.json)'}
                </h3>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-[#526071] border border-slate-200">
                  Open Civic Standard
                </span>
              </div>
              <p className="text-xs text-[#526071] mt-0.5">
                Machine-readable case data with event chronology and provenance metadata.
              </p>
            </div>
          </div>
          <Download size={18} className="text-slate-500 shrink-0" />
        </div>

        {/* Option 6: Preserve Privately for Now */}
        <div
          id="export-preserve-card"
          onClick={handlePreserve}
          className="p-5 bg-white border border-[#D9DEE7] hover:border-slate-400 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#A15C00] flex items-center justify-center group-hover:bg-[#A15C00] group-hover:text-white transition-colors shrink-0">
              <Bookmark size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#172033]">
                  Preserve Privately for Now
                </h3>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-[#A15C00]">
                  Private
                </span>
              </div>
              <p className="text-xs text-[#526071] mt-0.5">
                Keep the organized case safely on this device in your browser. Do not export or share anything yet.
              </p>
            </div>
          </div>
          <Check size={18} className="text-[#A15C00] shrink-0" />
        </div>
      </div>

      {/* Trust & Boundary Statement */}
      <div className="mt-8 p-5 bg-slate-900 text-white rounded-xl space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
          <ShieldCheck size={18} />
          <span>You control where this record goes next.</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          CaseCarry will never autonomously email, tweet, or submit your case to an institution. You choose which official desk or caseworker receives this bundle.
        </p>
      </div>

      {/* Validation / Success Checklist */}
      <div className="mt-10 p-6 bg-white border border-[#D9DEE7] rounded-2xl space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#18794E] flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <h2 className="text-base font-bold text-[#172033]">
              Your case has been organized.
            </h2>
            <p className="text-xs text-[#526071]">What you now have in your hands:</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-[#172033]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#18794E] shrink-0" />
            <span>Clear chronological timeline</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#18794E] shrink-0" />
            <span>Source-linked information provenance</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#18794E] shrink-0" />
            <span>Precisely defined unresolved issue</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#18794E] shrink-0" />
            <span>Indexed supporting evidence</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#18794E] shrink-0" />
            <span>Plain-language requested action</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#18794E] shrink-0" />
            <span>Explicit citizen privacy choices</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            id="view-bundle-preview-bottom-btn"
            onClick={onViewCase}
            className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#172033] rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye size={14} />
            <span>View bundle preview</span>
          </button>

          <button
            id="start-another-case-bottom-btn"
            onClick={onStartAnotherCase}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#2457C5] hover:bg-[#1D46A0] text-white rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>{t.startAnotherCase || 'Start another case'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

