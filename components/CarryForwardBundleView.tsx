'use client';

import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Printer,
  Download,
  Share2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  FileCheck2,
  Check
} from 'lucide-react';
import { CaseRecord } from '@/types/case';
import { ProvenanceBadge } from './ProvenanceBadge';

interface CarryForwardBundleViewProps {
  caseData: CaseRecord;
  onContinueToExport: () => void;
  onBack: () => void;
}

export function CarryForwardBundleView({
  caseData,
  onContinueToExport,
  onBack,
}: CarryForwardBundleViewProps) {
  const includedEvidence = caseData.evidence.filter((e) => e.privacyStatus !== 'private');

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
        <span>Back to Privacy Review</span>
      </button>

      {/* Progress pill & Action button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#18794E] text-xs font-semibold border border-emerald-200">
            <CheckCircle2 size={13} />
            <span>Case Verified & Approved by Citizen</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
            Your case is ready to carry forward
          </h1>
          <p className="text-sm text-[#526071] mt-1">
            This portable, recipient-neutral bundle works on any device or printed paper. No special app or software needed by the recipient.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-[#D9DEE7] bg-white hover:bg-slate-50 text-xs font-semibold text-[#172033] inline-flex items-center gap-1.5 shadow-xs"
          >
            <Printer size={15} />
            <span>Print View</span>
          </button>

          <button
            onClick={onContinueToExport}
            className="px-4 py-2 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-xs font-semibold rounded-xl shadow-xs inline-flex items-center gap-1.5"
          >
            <span>Export & Save Bundle</span>
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
            <span>Record ID: {caseData.id} • Updated: {caseData.updatedAt}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#172033]">
            {caseData.title}
          </h2>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#F8F7F3] p-3 rounded-xl border border-[#D9DEE7]">
            <div>
              <span className="text-[#526071] block">Citizen / Complainant:</span>
              <span className="font-bold text-[#172033]">{caseData.citizenName}</span>
            </div>
            <div>
              <span className="text-[#526071] block">Service Provider:</span>
              <span className="font-bold text-[#172033]">{caseData.provider}</span>
            </div>
            <div>
              <span className="text-[#526071] block">Account Reference:</span>
              <span className="font-mono font-bold text-[#172033]">{caseData.accountReference || '0456789123'}</span>
            </div>
            <div>
              <span className="text-[#526071] block">Status:</span>
              <span className="font-bold text-rose-700">Unresolved</span>
            </div>
          </div>
        </div>

        {/* 1. Case Overview */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#526071] flex items-center gap-2">
            <span>1. Case Overview</span>
          </h3>
          <div className="p-4 bg-slate-50 border border-[#D9DEE7] rounded-xl text-sm leading-relaxed text-[#172033]">
            Citizen Adebayo Olatunji has maintained full timely payment for electrical utility services under Account 0456789123. Despite possessing a functional meter, IBEDC issued arbitrary estimated charges of ₦64,438.50 for July 2026, which the citizen paid via USSD on 12 August. Following a formal dispute (Ref: CCU-12345), IBEDC issued conflicting letters claiming resolution while their official WhatsApp stated the complaint was still under review. The subsequent August bill of ₦106,492.50 double-counted the uncredited balance and continued arbitrary estimated billing.
          </div>
        </section>

        {/* 2. What Remains Unresolved */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#526071] flex items-center gap-2">
            <span>2. What Remains Unresolved</span>
          </h3>
          <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-2 text-sm text-[#172033]">
            <p className="font-semibold text-rose-900 leading-relaxed">
              {caseData.unresolved.problem}
            </p>
          </div>
        </section>

        {/* 3. What Has Already Been Tried & Prior Responses */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#526071]">
            <span>3. What Has Already Been Tried & Responses Received</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-white border border-[#D9DEE7] rounded-xl space-y-1.5">
              <span className="font-bold text-[#526071] block uppercase text-xs">Steps Taken</span>
              <p className="text-[#172033] whitespace-pre-line leading-relaxed">
                {caseData.unresolved.alreadyTried}
              </p>
            </div>

            <div className="p-4 bg-white border border-[#D9DEE7] rounded-xl space-y-1.5">
              <span className="font-bold text-[#526071] block uppercase text-xs">Responses Received</span>
              <p className="text-[#172033] whitespace-pre-line leading-relaxed">
                {caseData.unresolved.responseReceived}
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
              {caseData.unresolved.requestedAction}
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
              <div key={ev.id} className="p-3.5 sm:p-4 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
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

          <div className="border border-[#D9DEE7] rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
            {includedEvidence.map((doc, idx) => (
              <div key={doc.id} className="p-3 bg-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[#526071] w-6">#{idx + 1}</span>
                  <div>
                    <span className="font-bold text-[#172033] block">{doc.title}</span>
                    <span className="text-[11px] text-[#526071]">
                      {doc.filename} • {doc.size} • {doc.uploadDate}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#18794E] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {doc.privacyStatus === 'redacted' ? 'Redacted' : 'Verified Original Attached'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Uncertainty & Disputed Facts */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#526071]">
            <span>7. Uncertainty & Conflicts Noted</span>
          </h3>
          <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl text-xs sm:text-sm text-[#A15C00] space-y-1 leading-relaxed">
            <p>
              <strong>1. Conflicting Institutional Statements:</strong> IBEDC Abeokuta Customer Care Unit letter dated 03 September stated adjustments had been effected and matter was closed; however, on 07 September, IBEDC Care stated on WhatsApp that the complaint is still under review.
            </p>
            <p>
              <strong>2. Uncredited Payment:</strong> A USSD payment of ₦64,438.50 on 12 August (TRX-IBEDC-982341) does not appear as a credit on the 31 August bill.
            </p>
          </div>
        </section>

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
      <div className="mt-8 pt-4 border-t border-[#D9DEE7] flex items-center justify-between gap-3 print:hidden">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl border border-[#D9DEE7] text-sm font-semibold text-[#526071] hover:text-[#172033] bg-white hover:bg-slate-50 transition-colors"
        >
          Back
        </button>

        <button
          onClick={onContinueToExport}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#2457C5] hover:bg-[#1D46A0] text-white shadow-xs transition-colors"
        >
          <span>Export Case Bundle</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
