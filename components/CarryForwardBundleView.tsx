'use client';

import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Printer,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  FileCheck2,
  Check,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { CaseRecord } from '@/types/case';
import { ProvenanceBadge } from './ProvenanceBadge';
import { redactEvidenceFile } from '@/lib/redaction';
import { SupportedLanguage, TRANSLATIONS } from '@/lib/i18n';

interface CarryForwardBundleViewProps {
  caseData: CaseRecord;
  onContinueToExport: () => void;
  onBack: () => void;
  currentLanguage?: SupportedLanguage;
}

export function CarryForwardBundleView({
  caseData,
  onContinueToExport,
  onBack,
  currentLanguage = 'en',
}: CarryForwardBundleViewProps) {
  const includedEvidence = (caseData.evidence || []).filter((e) => e.privacyStatus !== 'private');
  const privateEvidence = (caseData.evidence || []).filter((e) => e.privacyStatus === 'private');

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033] mb-6 p-1 rounded-md transition-colors print:hidden"
      >
        <ArrowLeft size={16} />
        <span>{t.back}</span>
      </button>

      {/* Progress pill & Action button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#18794E] text-xs font-semibold border border-emerald-200">
            <CheckCircle2 size={13} />
            <span>Case Verified & Approved by Citizen</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
            {t.bundleTitle}
          </h1>
          <p className="text-sm text-[#526071] mt-1">
            {t.bundleSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="print-bundle-top-btn"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-[#D9DEE7] bg-white hover:bg-slate-50 text-xs font-semibold text-[#172033] inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Open browser print dialogue to print or save as PDF"
          >
            <Printer size={15} className="text-[#2457C5]" />
            <span>{t.printPaperCopy}</span>
          </button>

          <button
            id="continue-to-export-top-btn"
            onClick={onContinueToExport}
            className="px-4 py-2 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-xs font-semibold rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{t.exportBundle}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* THE OFFICIAL CARRY-FORWARD CASE BUNDLE (Standard Paper / Document Layout) */}
      <div className="bg-white border border-[#D9DEE7] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-[#172033]">
        {/* Bundle Header */}
        <div className="border-b border-[#D9DEE7] pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#526071] mb-3">
            <span className="font-mono font-bold uppercase tracking-wider text-[#2457C5]">
              CaseCarry Portable Case Record
            </span>
            <span>Record ID: {caseData.id} • Date: {caseData.updatedAt || 'Recent'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#172033]">
            {caseData.title}
          </h2>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#F8F7F3] p-3 rounded-xl border border-[#D9DEE7]">
            <div>
              <span className="text-[#526071] block">Citizen / Complainant:</span>
              <span className="font-bold text-[#172033]">{caseData.citizenName || 'Citizen'}</span>
            </div>
            <div>
              <span className="text-[#526071] block">Service Provider:</span>
              <span className="font-bold text-[#172033]">{caseData.provider || 'Service Provider'}</span>
            </div>
            <div>
              <span className="text-[#526071] block">Reference / Account:</span>
              <span className="font-mono font-bold text-[#172033]">
                {caseData.accountReference || 'Not provided'}
              </span>
            </div>
            <div>
              <span className="text-[#526071] block">Current Status:</span>
              <span className="font-bold text-rose-700">Unresolved</span>
            </div>
          </div>
        </div>

        {/* 1. Case Overview / Original Dispute */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#526071] flex items-center gap-2">
            <span>1. Original Dispute & Context</span>
          </h3>
          <div className="p-4 bg-slate-50 border border-[#D9DEE7] rounded-xl text-sm leading-relaxed text-[#172033]">
            {caseData.unresolved.originalIssue ||
              `The dispute concerns unresolved service or billing issues with ${caseData.provider}. The citizen initiated a complaint following improper outcome or failure to resolve.`}
          </div>
        </section>

        {/* 2. What Remains Unresolved */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#526071] flex items-center gap-2">
            <span>2. What Remains Unresolved (Current Broken State)</span>
          </h3>
          <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-2 text-sm text-[#172033]">
            <p className="font-semibold text-rose-900 leading-relaxed">
              {caseData.unresolved.problem || caseData.unresolved.whatWasNotResolved}
            </p>
          </div>
        </section>

        {/* 3. Steps Taken & Responses Received */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#526071]">
            <span>3. Steps Taken & Prior Responses</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-white border border-[#D9DEE7] rounded-xl space-y-1.5">
              <span className="font-bold text-[#526071] block uppercase text-xs">Steps Taken</span>
              <p className="text-[#172033] whitespace-pre-line leading-relaxed">
                {caseData.unresolved.alreadyTried || 'Documented in attached chronology.'}
              </p>
            </div>

            <div className="p-4 bg-white border border-[#D9DEE7] rounded-xl space-y-1.5">
              <span className="font-bold text-[#526071] block uppercase text-xs">Responses Received</span>
              <p className="text-[#172033] whitespace-pre-line leading-relaxed">
                {caseData.unresolved.responseReceived || 'No satisfactory response received.'}
              </p>
            </div>
          </div>
        </section>

        {/* 4. Requested Action */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#526071]">
            <span>4. Requested Action</span>
          </h3>
          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl text-sm leading-relaxed text-[#172033] space-y-2">
            <p className="font-medium text-[#172033]">
              {caseData.unresolved.requestedAction || 'Resolution of the disputed problem and correction of records.'}
            </p>
            {caseData.unresolved.resolutionVision && (
              <div className="pt-2 border-t border-blue-200/60 text-xs text-[#526071]">
                <strong className="text-[#172033]">Vision of Fair Resolution:</strong>
                <p className="mt-1 whitespace-pre-line text-[#172033]">
                  {caseData.unresolved.resolutionVision}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 5. Verified Chronology & Source Provenance */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#526071] flex items-center justify-between">
            <span>5. Verified Chronology & Provenance</span>
            <span className="text-xs text-[#526071] font-normal lowercase">
              {caseData.events.length} chronological events
            </span>
          </h3>

          <div className="border border-[#D9DEE7] rounded-xl overflow-hidden divide-y divide-slate-200 text-xs">
            {caseData.events.map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 sm:p-4 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-start justify-between gap-2"
              >
                <div className="sm:w-32 shrink-0">
                  <span className="font-bold text-[#526071] block">{ev.displayDate}</span>
                </div>

                <div className="grow space-y-1">
                  <div className="font-bold text-sm text-[#172033]">{ev.title}</div>
                  <p className="text-[#526071] leading-relaxed">{ev.description}</p>
                  {ev.conflictDetails && (
                    <p className="text-[#A33A3A] font-medium bg-rose-50 p-2 rounded border border-rose-200 mt-1">
                      ⚠️ Contradiction: {ev.conflictDetails}
                    </p>
                  )}
                  {ev.sourceNames.length > 0 && (
                    <div className="text-[11px] text-[#526071] flex items-center gap-1 mt-1">
                      <span>Source:</span>
                      <span className="font-medium text-[#172033]">
                        {ev.sourceNames.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="shrink-0 self-start mt-1 sm:mt-0">
                  <ProvenanceBadge type={ev.provenance} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Evidence Index */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#526071] flex items-center justify-between">
            <span>6. Evidence Index</span>
            <span className="text-xs text-[#18794E] font-medium">
              {includedEvidence.length} documents included
            </span>
          </h3>

          {includedEvidence.length > 0 ? (
            <div className="border border-[#D9DEE7] rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {includedEvidence.map((doc, idx) => (
                <div key={doc.id} className="p-3 bg-white flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#526071] w-6">#{idx + 1}</span>
                    <div>
                      <span className="font-bold text-[#172033] block">{doc.title}</span>
                      <span className="text-[11px] text-[#526071]">
                        {doc.filename} • {doc.size}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#18794E] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {doc.privacyStatus === 'redacted' ? 'Redacted Details' : 'Full Document Attached'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#526071] italic">
              All attached documents were designated as private by the citizen.
            </p>
          )}
        </section>

        {/* 7. Contradictions & Missing Information Surfaced */}
        {((caseData.contradictions && caseData.contradictions.length > 0) ||
          (caseData.missingInformation && caseData.missingInformation.length > 0)) && (
          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#526071]">
              <span>7. Surfaced Contradictions & Missing Information</span>
            </h3>

            {caseData.contradictions && caseData.contradictions.length > 0 && (
              <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-rose-900 block flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Contradictions in Institutional Records:
                </span>
                <ul className="list-disc list-inside space-y-1 text-rose-950">
                  {caseData.contradictions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {caseData.missingInformation && caseData.missingInformation.length > 0 && (
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                  <HelpCircle size={14} /> Missing Records & Noted Uncertainties:
                </span>
                <ul className="list-disc list-inside space-y-1 text-amber-950">
                  {caseData.missingInformation.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
            {privateEvidence.length > 0 && (
              <div className="mt-2.5 p-2.5 bg-[#F8F7F3] border border-[#D9DEE7] rounded-lg text-[11px] text-[#526071] flex items-center justify-between">
                <span>{privateEvidence.length} document(s) retained privately by citizen on local device.</span>
                <span className="font-semibold text-amber-800">Excluded from transmission</span>
              </div>
            )}
          </section>
        )}

        {/* 8. Potential Next Pathways (Rule 22) */}
        {caseData.pathways && caseData.selectedPathways && caseData.selectedPathways.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#526071] flex items-center justify-between">
              <span>8. Potential Next Pathways</span>
              <span className="text-xs text-[#2457C5] font-normal lowercase">
                {caseData.selectedPathways.length} referenced by citizen
              </span>
            </h3>

            <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-[#2457C5]">
              <strong>Standard Attribution:</strong> CaseCarry identified these as potentially relevant pathways based on the case information available at the time of review. CaseCarry did not determine legal rights conclusively or guarantee eligibility.
            </div>

            <div className="space-y-3">
              {caseData.pathways
                .filter((p) => caseData.selectedPathways.includes(p.id))
                .map((path) => (
                  <div
                    key={path.id}
                    className="p-4 bg-white border border-[#D9DEE7] rounded-xl space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-[#172033]">{path.name}</div>
                        <div className="text-[11px] text-[#526071] mt-0.5">
                          Authority: <strong className="text-[#172033]">{path.organization}</strong> • Jurisdiction: {path.jurisdiction}
                        </div>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-[#2457C5] font-semibold self-start shrink-0">
                        Referenced in Bundle
                      </span>
                    </div>

                    <div className="p-3 bg-[#F8F7F3] rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-[#526071] block">Why It May Be Relevant:</span>
                      <p className="text-[#172033] leading-relaxed">{path.whyRelevant}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div>
                        <span className="font-bold text-[#526071] block">Required Documents:</span>
                        <ul className="list-disc list-inside text-[#172033] mt-0.5 space-y-0.5">
                          {path.requiredDocuments.map((doc, idx) => (
                            <li key={idx}>{doc}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-bold text-[#526071] block">Official Procedural Source:</span>
                        <p className="text-[#172033] mt-0.5 font-medium">{path.officialSource}</p>
                        <span className="text-[11px] text-slate-500 block">
                          Checked Date: {path.lastCheckedDate}
                        </span>
                        {path.sourceUrl && (
                          <span className="text-[11px] text-[#2457C5] break-all block mt-0.5">
                            {path.sourceUrl}
                          </span>
                        )}
                      </div>
                    </div>

                    {((path.uncertainties && path.uncertainties.length > 0) || path.whatWeDontKnow) && (
                      <div className="p-2.5 bg-amber-50/50 border border-amber-200 rounded-lg text-[11px] text-amber-900 space-y-0.5">
                        <span className="font-bold text-amber-950 block">Uncertainties / What Requires Verification:</span>
                        <p className="text-amber-950">
                          {path.uncertainties ? path.uncertainties.join('. ') : path.whatWeDontKnow}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Recipient Neutrality Notice */}
        <div className="pt-6 border-t border-[#D9DEE7] text-center text-xs text-[#526071] space-y-1">
          <p className="font-semibold text-[#172033]">
            This record was prepared and verified directly by the citizen using CaseCarry.
          </p>
          <p>
            No special software is required to read this document. All original supporting evidence has been indexed for verification.
          </p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-8 pt-4 border-t border-[#D9DEE7] flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
        <button
          id="back-from-bundle-bottom-btn"
          onClick={onBack}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#D9DEE7] text-sm font-semibold text-[#526071] hover:text-[#172033] bg-white hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Back
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            id="print-bundle-bottom-btn"
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#D9DEE7] bg-white hover:bg-slate-50 text-sm font-semibold text-[#172033] inline-flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            title="Open browser print dialogue to print or save as PDF"
          >
            <Printer size={16} className="text-[#2457C5]" />
            <span>Print Paper Copy</span>
          </button>

          <button
            id="continue-to-export-bottom-btn"
            onClick={onContinueToExport}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#2457C5] hover:bg-[#1D46A0] text-white shadow-xs transition-colors cursor-pointer"
          >
            <span>Export Case Bundle</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
