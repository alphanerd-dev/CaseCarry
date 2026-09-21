'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Check,
  FileText
} from 'lucide-react';
import { EvidenceFile } from '@/types/case';
import { ProvenanceBadge } from './ProvenanceBadge';
import { redactEvidenceFile } from '@/lib/redaction';
import { SupportedLanguage, TRANSLATIONS } from '@/lib/i18n';

interface PrivacyReviewViewProps {
  evidenceList: EvidenceFile[];
  onUpdateEvidencePrivacy: (id: string, status: 'included' | 'private' | 'redacted') => void;
  onRemoveEvidence: (id: string) => void;
  onViewSource: (file: EvidenceFile) => void;
  onApproveAndCreateBundle: () => void;
  onBack: () => void;
  currentLanguage?: SupportedLanguage;
}

export function PrivacyReviewView({
  evidenceList,
  onUpdateEvidencePrivacy,
  onRemoveEvidence,
  onViewSource,
  onApproveAndCreateBundle,
  onBack,
  currentLanguage = 'en',
}: PrivacyReviewViewProps) {
  const [previewRedactedId, setPreviewRedactedId] = useState<string | null>(null);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const includedCount = evidenceList.filter((e) => e.privacyStatus === 'included').length;
  const privateCount = evidenceList.filter((e) => e.privacyStatus === 'private').length;
  const redactedCount = evidenceList.filter((e) => e.privacyStatus === 'redacted').length;

  const toggleRedaction = (id: string) => {
    const current = evidenceList.find((e) => e.id === id);
    if (!current) return;

    if (current.privacyStatus === 'redacted') {
      onUpdateEvidencePrivacy(id, 'included');
    } else {
      onUpdateEvidencePrivacy(id, 'redacted');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033] mb-6 p-1 rounded-md transition-colors"
      >
        <ArrowLeft size={16} />
        <span>{t.back}</span>
      </button>

      {/* Progress pill */}
      <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2457C5] text-xs font-semibold border border-blue-100">
        <span>Step 7 of 8</span>
        <span>•</span>
        <span>{t.stepPrivacy}</span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
        {t.privacyTitle}
      </h1>
      <p className="text-sm sm:text-base text-[#526071] mt-2 leading-relaxed">
        {t.privacySubtitle}
      </p>

      {/* Prominent Trust Banner */}
      <div className="mt-6 p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-3">
        <ShieldCheck size={20} className="text-[#18794E] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#172033] leading-relaxed">
          <strong className="text-[#18794E]">Nothing will be sent automatically.</strong> You control this record completely. It stays on your device until you choose to download or hand it to an advocate.
        </div>
      </div>

      {/* Final Summary Count Badges */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="p-3.5 bg-white border border-[#D9DEE7] rounded-xl text-center shadow-xs">
          <span className="text-xs text-[#526071] block font-medium">Included</span>
          <span className="text-xl font-bold text-[#18794E] mt-0.5 block">
            {includedCount} documents
          </span>
        </div>

        <div className="p-3.5 bg-white border border-[#D9DEE7] rounded-xl text-center shadow-xs">
          <span className="text-xs text-[#526071] block font-medium">Private</span>
          <span className="text-xl font-bold text-[#A15C00] mt-0.5 block">
            {privateCount} documents
          </span>
        </div>

        <div className="p-3.5 bg-white border border-[#D9DEE7] rounded-xl text-center shadow-xs">
          <span className="text-xs text-[#526071] block font-medium">Redacted</span>
          <span className="text-xl font-bold text-slate-700 mt-0.5 block">
            {redactedCount} document
          </span>
        </div>
      </div>

      {/* Artifact Privacy List */}
      <div className="mt-8 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#526071]">
          Artifacts in this Case ({evidenceList.length})
        </h2>

        {evidenceList.map((doc) => {
          const isPrivate = doc.privacyStatus === 'private';
          const isRedacted = doc.privacyStatus === 'redacted';
          const isIncluded = doc.privacyStatus === 'included';

          return (
            <div
              key={doc.id}
              className={`p-4 bg-white border rounded-xl shadow-xs transition-all space-y-3 ${
                isPrivate
                  ? 'border-amber-200 bg-amber-50/20'
                  : isRedacted
                  ? 'border-slate-300 bg-slate-50/60'
                  : 'border-[#D9DEE7]'
              }`}
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText size={18} className="text-[#2457C5] shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#172033] truncate">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-[#526071]">
                      {doc.filename} • {doc.size}
                    </p>
                  </div>
                </div>

                <ProvenanceBadge
                  type={isPrivate ? 'private' : isRedacted ? 'redacted' : 'source-backed'}
                  size="sm"
                />
              </div>

              {/* Sensitive fields indicator */}
              <div className="text-xs text-[#526071] bg-[#F8F7F3] p-2.5 rounded-lg border border-[#D9DEE7]/70 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>
                    {isPrivate ? (
                      <strong className="text-amber-800">Kept private on this device.</strong>
                    ) : isRedacted ? (
                      <strong className="text-slate-800">Redacted: Sensitive fields masked with asterisks.</strong>
                    ) : (
                      <span>
                        {doc.type === 'receipt'
                          ? 'Contains: Account Number 0456789123, USSD Gateway Ref'
                          : doc.type === 'email'
                          ? 'Contains: Citizen Email & Phone Number 0803 456 7890'
                          : doc.type === 'pdf'
                          ? 'Contains: Home Address: 12, Alagbon Close, Abeokuta'
                          : 'Verified citizen artifact'}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    {isRedacted && (
                      <button
                        onClick={() =>
                          setPreviewRedactedId(previewRedactedId === doc.id ? null : doc.id)
                        }
                        className="text-xs text-slate-700 font-semibold hover:underline"
                      >
                        {previewRedactedId === doc.id ? 'Hide Masked Text' : 'Show Masked Text'}
                      </button>
                    )}
                    <button
                      onClick={() => onViewSource(doc)}
                      className="text-xs text-[#2457C5] font-semibold hover:underline shrink-0 ml-2"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {isPrivate && (
                  <p className="text-[11px] text-amber-700">
                    This file remains safely stored in your browser storage but will not be transmitted in exported bundles.
                  </p>
                )}

                {isRedacted && previewRedactedId === doc.id && (
                  <div className="mt-2 p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {redactEvidenceFile(doc).extractedText || redactEvidenceFile(doc).contentSummary}
                  </div>
                )}
              </div>

              {/* 4 Privacy Action Controls (Section 19) */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* [✓ Include] */}
                  <button
                    onClick={() => onUpdateEvidencePrivacy(doc.id, 'included')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                      isIncluded
                        ? 'bg-emerald-50 text-[#18794E] border border-emerald-300'
                        : 'bg-white border border-[#D9DEE7] text-[#526071] hover:bg-slate-50'
                    }`}
                  >
                    <Check size={13} className={isIncluded ? 'text-[#18794E]' : 'text-slate-400'} />
                    <span>Include</span>
                  </button>

                  {/* [Keep private] */}
                  <button
                    onClick={() => onUpdateEvidencePrivacy(doc.id, 'private')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                      isPrivate
                        ? 'bg-amber-100 text-[#A15C00] border border-amber-300'
                        : 'bg-white border border-[#D9DEE7] text-[#526071] hover:bg-slate-50'
                    }`}
                  >
                    <EyeOff size={13} />
                    <span>Keep private</span>
                  </button>

                  {/* [Redact] */}
                  <button
                    onClick={() => toggleRedaction(doc.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                      isRedacted
                        ? 'bg-slate-200 text-slate-800 border border-slate-400'
                        : 'bg-white border border-[#D9DEE7] text-[#526071] hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2 h-2 bg-slate-600 rounded-xs inline-block" />
                    <span>Redact</span>
                  </button>
                </div>

                {/* [Remove] */}
                <button
                  onClick={() => onRemoveEvidence(doc.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove artifact entirely"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-8 pt-4 border-t border-[#D9DEE7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl border border-[#D9DEE7] text-sm font-semibold text-[#526071] hover:text-[#172033] bg-white hover:bg-slate-50 transition-colors text-center"
        >
          {t.back}
        </button>

        <button
          onClick={onApproveAndCreateBundle}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#2457C5] hover:bg-[#1D46A0] text-white shadow-xs transition-colors cursor-pointer"
        >
          <span>{t.approveAndCreateBundle}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
