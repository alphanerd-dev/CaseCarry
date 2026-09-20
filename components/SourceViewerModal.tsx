'use client';

import React from 'react';
import { X, FileText, CheckCircle2, Shield, EyeOff, Calendar, HardDrive, Download } from 'lucide-react';
import { EvidenceFile } from '@/types/case';
import { ProvenanceBadge } from './ProvenanceBadge';

interface SourceViewerModalProps {
  file: EvidenceFile | null;
  onClose: () => void;
  onTogglePrivacy: (fileId: string) => void;
}

export function SourceViewerModal({ file, onClose, onTogglePrivacy }: SourceViewerModalProps) {
  if (!file) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="source-viewer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-[#FFFFFF] border border-[#D9DEE7] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D9DEE7] bg-[#F8F7F3]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2457C5]">
              <FileText size={20} />
            </div>
            <div>
              <h3 id="source-viewer-title" className="text-base font-bold text-[#172033]">
                {file.title}
              </h3>
              <p className="text-xs text-[#526071] flex items-center gap-2 mt-0.5">
                <span>{file.filename}</span>
                <span>•</span>
                <span className="uppercase font-semibold">{file.type}</span>
                <span>•</span>
                <span>{file.size}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#526071] hover:text-[#172033] hover:bg-slate-200/60 transition-colors"
            aria-label="Close document viewer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 space-y-5 text-[#172033]">
          {/* Status Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-[#D9DEE7] rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#526071]">Status:</span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#18794E]">
                <CheckCircle2 size={14} /> Processed & preserved
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#526071]">Privacy:</span>
              <ProvenanceBadge type={file.privacyStatus === 'private' ? 'private' : file.privacyStatus === 'redacted' ? 'redacted' : 'source-backed'} size="sm" />
            </div>
          </div>

          {/* Key Extracted Details */}
          {file.keyFields && file.keyFields.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#526071] mb-2">
                Document Details (Extracted by CaseCarry)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm bg-white border border-[#D9DEE7] rounded-lg p-3">
                {file.keyFields.map((field, idx) => (
                  <div key={idx} className="flex flex-col py-1 border-b border-slate-100 last:border-b-0 sm:border-b-0">
                    <span className="text-xs text-[#526071]">{field.label}</span>
                    <span className="font-semibold text-[#172033]">{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Content / Excerpt */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#526071] mb-2">
              Verbatim Text / Extracted Document Content
            </h4>
            <div className="bg-[#F8F7F3] border border-[#D9DEE7] rounded-lg p-4 font-mono text-xs text-[#172033] whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {file.fullSnippet || file.contentSummary}
            </div>
            <p className="text-[11px] text-[#526071] mt-1.5 flex items-center gap-1">
              <Shield size={12} className="text-[#18794E]" />
              The original document is untouched. CaseCarry never modifies original files.
            </p>
          </div>

          {/* Metadata info */}
          <div className="grid grid-cols-2 gap-3 text-xs text-[#526071] border-t border-[#D9DEE7] pt-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>Added: {file.uploadDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HardDrive size={14} />
              <span>Pages / Items: {file.pageCount} page(s)</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#D9DEE7] bg-[#F8F7F3]">
          <button
            onClick={() => onTogglePrivacy(file.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              file.privacyStatus === 'private'
                ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                : 'bg-amber-50 text-[#A15C00] border-[#A15C00]/30 hover:bg-amber-100'
            }`}
          >
            <EyeOff size={14} />
            {file.privacyStatus === 'private' ? 'Mark as Included' : 'Keep Private (Exclude from Bundle)'}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2457C5] hover:bg-[#1D46A0] text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Done Viewing
          </button>
        </div>
      </div>
    </div>
  );
}
