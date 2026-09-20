'use client';

import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Upload,
  FileText,
  Clipboard,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Plus,
  Shield,
  FileUp,
  Sparkles,
  Wifi,
  HardDrive
} from 'lucide-react';
import { EvidenceFile } from '@/types/case';
import { ProvenanceBadge } from './ProvenanceBadge';

interface EvidenceCollectionViewProps {
  evidenceList: EvidenceFile[];
  onAddEvidence: (file: EvidenceFile) => void;
  onRemoveEvidence: (id: string) => void;
  onTogglePrivacy: (id: string) => void;
  onViewSource: (file: EvidenceFile) => void;
  onLoadDemoFiles: () => void;
  onContinue: () => void;
  onBack: () => void;
  lowBandwidth: boolean;
}

export function EvidenceCollectionView({
  evidenceList,
  onAddEvidence,
  onRemoveEvidence,
  onTogglePrivacy,
  onViewSource,
  onLoadDemoFiles,
  onContinue,
  onBack,
  lowBandwidth,
}: EvidenceCollectionViewProps) {
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteContent, setPasteContent] = useState('');
  const [uploadingItem, setUploadingItem] = useState<{ name: string; progress: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Simulated upload handler with real progress simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    setUploadingItem({ name: file.name, progress: 20 });

    const timer1 = setTimeout(() => {
      setUploadingItem({ name: file.name, progress: 65 });
    }, 300);

    const timer2 = setTimeout(() => {
      setUploadingItem({ name: file.name, progress: 100 });

      const newEvidence: EvidenceFile = {
        id: `doc-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        filename: file.name,
        type: isImage ? 'image' : isPdf ? 'pdf' : 'text',
        uploadDate: 'Today',
        pageCount: 1,
        size: `${Math.round(file.size / 1024) || 45} KB`,
        processingStatus: 'processed',
        privacyStatus: 'included',
        contentSummary: `Uploaded document: ${file.name}. Processed with local privacy preservation.`,
        fullSnippet: `Document Name: ${file.name}\nSize: ${file.size} bytes\nType: ${file.type}\nUploaded under citizen control on ${new Date().toLocaleDateString()}.\nCaseCarry has read the text structure for chronological sorting.`,
        keyFields: [
          { label: 'File Name', value: file.name },
          { label: 'Type', value: isPdf ? 'PDF Document' : isImage ? 'Image Scan' : 'Plain Text' },
        ],
      };

      onAddEvidence(newEvidence);
      setUploadingItem(null);
    }, 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteContent.trim()) return;

    const newEvidence: EvidenceFile = {
      id: `doc-${Date.now()}`,
      title: pasteTitle.trim() || 'Pasted Text / WhatsApp Message',
      filename: `Pasted_Note_${new Date().toISOString().slice(0, 10)}.txt`,
      type: 'text',
      uploadDate: 'Today',
      pageCount: 1,
      size: `${Math.round(pasteContent.length / 100) || 1} KB`,
      processingStatus: 'processed',
      privacyStatus: 'included',
      contentSummary: pasteContent.slice(0, 140) + (pasteContent.length > 140 ? '...' : ''),
      fullSnippet: pasteContent,
      keyFields: [
        { label: 'Source Type', value: 'Direct Citizen Text' },
        { label: 'Word Count', value: `${pasteContent.split(/\s+/).length} words` },
      ],
    };

    onAddEvidence(newEvidence);
    setPasteTitle('');
    setPasteContent('');
    setPasteModalOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033] mb-6 p-1 rounded-md transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      {/* Progress pill */}
      <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2457C5] text-xs font-semibold border border-blue-100">
        <span>Step 2 of 6</span>
        <span>•</span>
        <span>Evidence Collection</span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
        Bring what you have
      </h1>
      <p className="text-sm sm:text-base text-[#526071] mt-2 leading-relaxed">
        You don’t need to have everything. Start with the documents or messages that best explain what happened.
      </p>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
        className="hidden"
        aria-label="Upload document"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        capture="environment"
        className="hidden"
        aria-label="Take photo with camera"
      />

      {/* 4 Primary Action Buttons */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Action 1: Take photo */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="p-4 bg-white border border-[#D9DEE7] hover:border-[#2457C5] hover:bg-blue-50/40 rounded-xl flex flex-col items-center justify-center text-center gap-2 shadow-xs transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2457C5] flex items-center justify-center group-hover:bg-[#2457C5] group-hover:text-white transition-colors">
            <Camera size={20} />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#172033]">Take a photo</span>
          <span className="text-[11px] text-[#526071]">Camera scan</span>
        </button>

        {/* Action 2: Choose from phone */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-4 bg-white border border-[#D9DEE7] hover:border-[#2457C5] hover:bg-blue-50/40 rounded-xl flex flex-col items-center justify-center text-center gap-2 shadow-xs transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#18794E] flex items-center justify-center group-hover:bg-[#18794E] group-hover:text-white transition-colors">
            <Upload size={20} />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#172033]">Choose from phone</span>
          <span className="text-[11px] text-[#526071]">Gallery / Images</span>
        </button>

        {/* Action 3: Upload document */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-4 bg-white border border-[#D9DEE7] hover:border-[#2457C5] hover:bg-blue-50/40 rounded-xl flex flex-col items-center justify-center text-center gap-2 shadow-xs transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-[#5B4BB7] flex items-center justify-center group-hover:bg-[#5B4BB7] group-hover:text-white transition-colors">
            <FileText size={20} />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#172033]">Upload document</span>
          <span className="text-[11px] text-[#526071]">PDF, DOC, letter</span>
        </button>

        {/* Action 4: Paste text */}
        <button
          onClick={() => setPasteModalOpen(true)}
          className="p-4 bg-white border border-[#D9DEE7] hover:border-[#2457C5] hover:bg-blue-50/40 rounded-xl flex flex-col items-center justify-center text-center gap-2 shadow-xs transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#A15C00] flex items-center justify-center group-hover:bg-[#A15C00] group-hover:text-white transition-colors">
            <Clipboard size={20} />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#172033]">Paste text</span>
          <span className="text-[11px] text-[#526071]">WhatsApp or email</span>
        </button>
      </div>

      {/* Demo Loader Banner */}
      <div className="mt-5 p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Sparkles size={18} className="text-[#2457C5] shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-[#172033]">
              Need to test the Nigerian Electricity Billing case?
            </div>
            <p className="text-xs text-[#526071]">
              Load all 9 actual uploaded files (Bills, Payment Receipt, Emails, Letters & WhatsApp transcripts) for Adebayo Olatunji.
            </p>
          </div>
        </div>
        <button
          onClick={onLoadDemoFiles}
          className="px-3.5 py-2 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-xs font-bold rounded-lg shrink-0 transition-colors"
        >
          Load 9 Sample Files
        </button>
      </div>

      {/* Low Bandwidth & Offline Note */}
      <div className="mt-3 flex items-center justify-between text-xs text-[#526071] px-1">
        <span className="flex items-center gap-1.5">
          <HardDrive size={13} className="text-[#18794E]" />
          Draft state automatically saved locally
        </span>
        <span className="flex items-center gap-1.5">
          <Shield size={13} className="text-slate-400" />
          Original files are never altered
        </span>
      </div>

      {/* Active Uploading Progress Bar */}
      {uploadingItem && (
        <div className="mt-4 p-4 bg-white border border-[#2457C5] rounded-xl shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span className="text-[#172033] font-bold">Uploading {uploadingItem.name}...</span>
            <span className="text-[#2457C5] font-semibold">{uploadingItem.progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#2457C5] h-full transition-all duration-300 rounded-full"
              style={{ width: `${uploadingItem.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Source Preview List (Section 12) */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#172033] flex items-center gap-2">
            <span>Collected Evidence</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-[#526071] border border-[#D9DEE7]">
              {evidenceList.length} items
            </span>
          </h2>
          <span className="text-xs text-[#526071]">Accepted formats: PDF, JPG, PNG, text</span>
        </div>

        {evidenceList.length === 0 ? (
          <div className="p-8 text-center bg-white border border-dashed border-[#D9DEE7] rounded-xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-[#526071] flex items-center justify-center mx-auto">
              <FileUp size={24} />
            </div>
            <div className="text-sm font-semibold text-[#172033]">No evidence uploaded yet</div>
            <p className="text-xs text-[#526071] max-w-sm mx-auto">
              Take a photo of a letter, upload bills, or paste a WhatsApp chat. You can also continue with what you have.
            </p>
            <button
              onClick={onLoadDemoFiles}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#172033] rounded-lg transition-colors"
            >
              <Sparkles size={13} className="text-[#2457C5]" />
              Load Adebayo’s Case Files
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {evidenceList.map((doc) => (
              <div
                key={doc.id}
                className={`p-3.5 sm:p-4 bg-white border rounded-xl shadow-xs transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  doc.privacyStatus === 'private'
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-[#D9DEE7] hover:border-slate-300'
                }`}
              >
                {/* Left File Details */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2457C5] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-[#172033] truncate">
                        {doc.title}
                      </h3>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-[#526071] border border-slate-200">
                        {doc.type}
                      </span>
                    </div>

                    <div className="text-xs text-[#526071] flex items-center gap-2 mt-0.5 flex-wrap">
                      <span>{doc.filename}</span>
                      <span>•</span>
                      <span>{doc.uploadDate}</span>
                      <span>•</span>
                      <span>{doc.pageCount} page(s)</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-[#18794E] font-medium">
                        <CheckCircle2 size={12} /> Processed
                      </span>
                    </div>

                    {/* Brief snippet */}
                    <p className="text-xs text-[#526071] mt-1.5 line-clamp-1 italic">
                      &ldquo;{doc.contentSummary}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Right Actions: View, Keep Private, Remove */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onViewSource(doc)}
                    className="px-2.5 py-1.5 rounded-lg border border-[#D9DEE7] bg-white hover:bg-slate-50 text-xs font-semibold text-[#172033] inline-flex items-center gap-1.5 transition-colors"
                    title="View source document"
                  >
                    <Eye size={13} className="text-[#2457C5]" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => onTogglePrivacy(doc.id)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                      doc.privacyStatus === 'private'
                        ? 'bg-amber-100 border-amber-300 text-[#A15C00]'
                        : 'border-[#D9DEE7] bg-white hover:bg-slate-50 text-[#526071]'
                    }`}
                    title={doc.privacyStatus === 'private' ? 'Currently private' : 'Keep private'}
                  >
                    <EyeOff size={13} />
                    <span>{doc.privacyStatus === 'private' ? 'Private' : 'Keep private'}</span>
                  </button>

                  <button
                    onClick={() => onRemoveEvidence(doc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove document"
                    aria-label={`Remove ${doc.filename}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paste Modal */}
      {pasteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="bg-white border border-[#D9DEE7] rounded-xl shadow-xl w-full max-w-lg p-5">
            <h3 className="text-base font-bold text-[#172033] mb-1">
              Paste Text or Message
            </h3>
            <p className="text-xs text-[#526071] mb-4">
              Paste email text, SMS notices, WhatsApp conversation logs, or notes you wrote down.
            </p>

            <form onSubmit={handlePasteSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#172033] block mb-1">
                  Source Title / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. WhatsApp conversation with IBEDC on Sept 7"
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg text-xs focus:border-[#2457C5] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#172033] block mb-1">
                  Pasted Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Paste text verbatim here..."
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg text-xs font-mono focus:border-[#2457C5] focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D9DEE7]">
                <button
                  type="button"
                  onClick={() => setPasteModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-[#D9DEE7] text-xs font-semibold text-[#526071]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2457C5] hover:bg-[#1D46A0] text-white rounded-lg text-xs font-semibold"
                >
                  Add Text Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="mt-8 pt-4 border-t border-[#D9DEE7] flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl border border-[#D9DEE7] text-sm font-semibold text-[#526071] hover:text-[#172033] bg-white hover:bg-slate-50 transition-colors"
        >
          Back
        </button>

        <button
          onClick={onContinue}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#2457C5] hover:bg-[#1D46A0] text-white shadow-xs transition-colors"
        >
          <span>Continue with what I have</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
