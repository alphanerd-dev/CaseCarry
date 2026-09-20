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
  Eye
} from 'lucide-react';
import { CaseRecord } from '@/types/case';

interface ExportViewProps {
  caseData: CaseRecord;
  onBackToBundle: () => void;
  onStartAnotherCase: () => void;
  onViewCase: () => void;
}

export function ExportView({
  caseData,
  onBackToBundle,
  onStartAnotherCase,
  onViewCase,
}: ExportViewProps) {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Generate plain text / JSON record for instant download
  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(caseData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CaseCarry_${caseData.id}_Record.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess('Structured JSON Record downloaded successfully.');
  };

  const handleDownloadSummaryDoc = () => {
    const textContent = `================================================================================
CASECARRY CARRY-FORWARD CASE BUNDLE
Citizen-Controlled Case Continuity Record
================================================================================

CASE TITLE: ${caseData.title}
RECORD ID: ${caseData.id}
CITIZEN: ${caseData.citizenName}
SERVICE PROVIDER: ${caseData.provider}
ACCOUNT REFERENCE: ${caseData.accountReference || '0456789123'}
STATUS: Unresolved
UPDATED: ${caseData.updatedAt}

--------------------------------------------------------------------------------
1. WHAT REMAINS UNRESOLVED (THE CORE PROBLEM)
--------------------------------------------------------------------------------
${caseData.unresolved.problem}

--------------------------------------------------------------------------------
2. WHAT HAS ALREADY BEEN TRIED
--------------------------------------------------------------------------------
${caseData.unresolved.alreadyTried}

--------------------------------------------------------------------------------
3. RESPONSES RECEIVED
--------------------------------------------------------------------------------
${caseData.unresolved.responseReceived}

--------------------------------------------------------------------------------
4. REQUESTED ACTION FROM RECIPIENT
--------------------------------------------------------------------------------
${caseData.unresolved.requestedAction}

FAIR RESOLUTION VISION:
${caseData.unresolved.resolutionVision}

--------------------------------------------------------------------------------
5. VERIFIED CHRONOLOGY & PROVENANCE
--------------------------------------------------------------------------------
${caseData.events
  .map(
    (ev, idx) =>
      `[${ev.displayDate}] ${ev.title}\nProvenance: ${ev.provenanceLabel}\nDetails: ${ev.description}${
        ev.conflictDetails ? `\n⚠️ Contradiction: ${ev.conflictDetails}` : ''
      }\nSources: ${ev.sourceNames.join(', ') || 'Direct citizen testimony'}\n`
  )
  .join('\n')}

--------------------------------------------------------------------------------
6. EVIDENCE INDEX (ATTACHED ARTIFACTS)
--------------------------------------------------------------------------------
${caseData.evidence
  .filter((e) => e.privacyStatus !== 'private')
  .map((e, idx) => `${idx + 1}. [${e.type.toUpperCase()}] ${e.title} (${e.filename}) - ${e.uploadDate}`)
  .join('\n')}

--------------------------------------------------------------------------------
7. UNCERTAINTY & SOURCES CONFLICT
--------------------------------------------------------------------------------
- IBEDC formal letter (03 Sept) stated the dispute was resolved and adjustments effected.
- IBEDC WhatsApp care (07 Sept) stated the complaint CCU-12345 was still under review.
- Subsequent August bill shows previous payment was uncredited and estimated billing continued.

================================================================================
Generated with CaseCarry. No proprietary software needed to read this record.
================================================================================
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `CaseCarry_${caseData.citizenName.replace(/\s+/g, '_')}_Case_Bundle.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Portable Case Bundle file downloaded.');
  };

  const handlePrintPDF = () => {
    window.print();
    setDownloadSuccess('Print / Save PDF dialog launched.');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Back button */}
      <button
        onClick={onBackToBundle}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033] mb-6 p-1 rounded-md transition-colors print:hidden"
      >
        <ArrowLeft size={16} />
        <span>Back to Bundle Preview</span>
      </button>

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
          Your case bundle is ready
        </h1>
        <p className="text-sm sm:text-base text-[#526071] mt-2 leading-relaxed">
          Export your verified bundle in a recipient-neutral format. Take it to an ombudsman, regulatory office, caseworker, or civic advocate.
        </p>
      </div>

      {/* Download notification if triggered */}
      {downloadSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-[#18794E] font-medium animate-in fade-in">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Export Options (Section 20) */}
      <div className="space-y-3.5">
        {/* Option 1: Download PDF */}
        <div
          onClick={handlePrintPDF}
          className="p-5 bg-white border border-[#2457C5]/40 hover:border-[#2457C5] rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#2457C5] flex items-center justify-center group-hover:bg-[#2457C5] group-hover:text-white transition-colors shrink-0">
              <FileText size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#172033]">
                  Save / Download PDF
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#2457C5]">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-[#526071] mt-0.5">
                Formatted printable PDF with chronology, evidence citations, and official header.
              </p>
            </div>
          </div>
          <Download size={18} className="text-[#2457C5] shrink-0" />
        </div>

        {/* Option 2: Download Text Bundle */}
        <div
          onClick={handleDownloadSummaryDoc}
          className="p-5 bg-white border border-[#D9DEE7] hover:border-slate-400 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#18794E] flex items-center justify-center group-hover:bg-[#18794E] group-hover:text-white transition-colors shrink-0">
              <Archive size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172033]">
                Download Evidence Bundle (.txt & attachments)
              </h3>
              <p className="text-xs text-[#526071] mt-0.5">
                Universal text bundle formatted for WhatsApp sharing, email attachments, or offline filing.
              </p>
            </div>
          </div>
          <Download size={18} className="text-[#18794E] shrink-0" />
        </div>

        {/* Option 3: Structured JSON Record */}
        <div
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
                  Download Structured Record (JSON)
                </h3>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-[#526071] border border-slate-200">
                  Open Civic Standard
                </span>
              </div>
              <p className="text-xs text-[#526071] mt-0.5">
                Machine-readable open case record with cryptographic evidence hashes and provenance metadata.
              </p>
            </div>
          </div>
          <Download size={18} className="text-slate-500 shrink-0" />
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

      {/* Validation / Success Checklist (Section 21) */}
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
            onClick={onViewCase}
            className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#172033] rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye size={14} />
            <span>View this case</span>
          </button>

          <button
            onClick={onStartAnotherCase}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#2457C5] hover:bg-[#1D46A0] text-white rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <RotateCcw size={14} />
            <span>Start another case</span>
          </button>
        </div>
      </div>
    </div>
  );
}
