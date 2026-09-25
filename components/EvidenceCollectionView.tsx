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
  Plus,
  Shield,
  FileUp,
  Sparkles,
  Wifi,
  HardDrive,
  Check,
  X
} from 'lucide-react';
import { EvidenceFile } from '@/types/case';
import { extractPdfContent } from '@/lib/pdfExtract';
import { ProvenanceBadge } from './ProvenanceBadge';
import { SupportedLanguage, TRANSLATIONS } from '@/lib/i18n';

interface EvidenceCollectionViewProps {
  evidenceList: EvidenceFile[];
  onAddEvidence: (file: EvidenceFile) => void;
  onRemoveEvidence: (id: string) => void;
  onTogglePrivacy: (id: string) => void;
  onViewSource: (file: EvidenceFile) => void;
  onLoadDemoFiles?: () => void;
  onContinue: () => void;
  onBack: () => void;
  lowBandwidth: boolean;
  isDemoMode?: boolean;
  currentLanguage?: SupportedLanguage;
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
  isDemoMode,
  currentLanguage = 'en',
}: EvidenceCollectionViewProps) {
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteContent, setPasteContent] = useState('');
  const [pasteCategory, setPasteCategory] = useState<'chat' | 'email' | 'text' | 'letter'>('chat');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processRealFile = async (file: File) => {
    setIsReadingFile(true);
    setUploadError(null);

    const isImage = file.type.startsWith('image/');
    const isText = file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.csv');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024) || 1} KB`;

    if (isImage) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const newEvidence: EvidenceFile = {
          id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          filename: file.name,
          type: 'image',
          uploadDate: 'Today',
          pageCount: 1,
          size: formattedSize,
          processingStatus: 'ready',
          privacyStatus: 'included',
          dataUrl: dataUrl,
          mimeType: file.type || 'image/jpeg',
          isOriginalRetained: true,
          contentSummary: `Image receipt or photograph (${file.name}, ${formattedSize}). Stored locally; ready for visual content verification.`,
          fullSnippet: `Attached image screenshot / photograph: ${file.name}. Preserved for visual evidence verification.`,
          keyFields: [
            { label: 'File Name', value: file.name },
            { label: 'File Type', value: 'Image / Photograph' },
            { label: 'Size', value: formattedSize },
          ],
        };
        onAddEvidence(newEvidence);
        setIsReadingFile(false);
      };
      reader.onerror = () => {
        setUploadError('Failed to read image file.');
        setIsReadingFile(false);
      };
      reader.readAsDataURL(file);
    } else if (isText) {
      const reader = new FileReader();
      reader.onload = () => {
        const textContent = reader.result as string;
        const newEvidence: EvidenceFile = {
          id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          filename: file.name,
          type: 'text',
          uploadDate: 'Today',
          pageCount: 1,
          size: formattedSize,
          processingStatus: 'extracted',
          privacyStatus: 'included',
          rawText: textContent,
          extractedText: textContent,
          mimeType: 'text/plain',
          isOriginalRetained: true,
          contentSummary: textContent.slice(0, 140) + (textContent.length > 140 ? '...' : ''),
          fullSnippet: textContent,
          keyFields: [
            { label: 'File Name', value: file.name },
            { label: 'Character Count', value: `${textContent.length}` },
          ],
        };
        onAddEvidence(newEvidence);
        setIsReadingFile(false);
      };
      reader.onerror = () => {
        setUploadError('Failed to read text file.');
        setIsReadingFile(false);
      };
      reader.readAsText(file);
    } else if (isPdf) {
      // PDF handling with stream extraction and base64 preservation
      let pdfExtract = {
        text: '',
        pageCountEstimate: 1,
        isExtracted: false,
        statusMessage: 'Standard PDF artifact',
      };

      try {
        pdfExtract = await extractPdfContent(file);
      } catch (pdfErr: any) {
        console.warn('PDF stream extraction error, preserving raw file:', pdfErr);
        pdfExtract = {
          text: '',
          pageCountEstimate: 1,
          isExtracted: false,
          statusMessage: 'PDF preserved as binary artifact (text streams not extracted).',
        };
      }

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const newEvidence: EvidenceFile = {
          id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          filename: file.name,
          type: 'pdf',
          uploadDate: 'Today',
          pageCount: pdfExtract.pageCountEstimate,
          size: formattedSize,
          processingStatus: pdfExtract.isExtracted ? 'extracted' : 'binary-ready',
          privacyStatus: 'included',
          dataUrl: dataUrl,
          extractedText: pdfExtract.text,
          mimeType: 'application/pdf',
          isOriginalRetained: true,
          contentSummary: pdfExtract.isExtracted
            ? pdfExtract.text.slice(0, 160) + (pdfExtract.text.length > 160 ? '...' : '')
            : `PDF document (${file.name}, ${formattedSize}). Preserved as binary artifact for case continuity.`,
          fullSnippet: pdfExtract.isExtracted
            ? pdfExtract.text
            : `Document: ${file.name}\nSize: ${formattedSize}\nType: PDF Document\n${pdfExtract.statusMessage}`,
          keyFields: [
            { label: 'Document Name', value: file.name },
            { label: 'Format', value: 'PDF' },
            { label: 'Size', value: formattedSize },
            {
              label: 'Extraction Status',
              value: pdfExtract.isExtracted ? 'Text Streams Extracted' : 'Document Binary Preserved',
            },
          ],
        };
        onAddEvidence(newEvidence);
        setIsReadingFile(false);
      };
      reader.onerror = () => {
        setUploadError('Failed to read PDF file into local storage.');
        setIsReadingFile(false);
      };
      reader.readAsDataURL(file);
    } else {
      // Generic document
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const newEvidence: EvidenceFile = {
          id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          filename: file.name,
          type: 'letter',
          uploadDate: 'Today',
          pageCount: 1,
          size: formattedSize,
          processingStatus: 'metadata-only',
          privacyStatus: 'included',
          dataUrl: dataUrl,
          mimeType: file.type || 'application/octet-stream',
          isOriginalRetained: true,
          contentSummary: `Document file: ${file.name} (${formattedSize}). Stored locally for case continuity record.`,
          fullSnippet: `Document: ${file.name}\nSize: ${formattedSize}\nType: ${file.type || 'Document'}\nUploaded by citizen.`,
          keyFields: [
            { label: 'Document Name', value: file.name },
            { label: 'Size', value: formattedSize },
          ],
        };
        onAddEvidence(newEvidence);
        setIsReadingFile(false);
      };
      reader.onerror = () => {
        setUploadError('Failed to read document file.');
        setIsReadingFile(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      processRealFile(files[i]);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        processRealFile(e.dataTransfer.files[i]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteContent.trim()) return;

    const newEvidence: EvidenceFile = {
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: pasteTitle.trim() || `Citizen Statement (${pasteCategory})`,
      filename: `Statement_${Date.now()}.txt`,
      type: pasteCategory,
      uploadDate: 'Today',
      pageCount: 1,
      size: `${Math.round(pasteContent.length / 1024) || 1} KB`,
      processingStatus: 'extracted',
      privacyStatus: 'included',
      rawText: pasteContent,
      extractedText: pasteContent,
      isOriginalRetained: true,
      contentSummary: pasteContent.slice(0, 140) + (pasteContent.length > 140 ? '...' : ''),
      fullSnippet: pasteContent,
      keyFields: [
        { label: 'Source Type', value: pasteCategory.toUpperCase() },
        { label: 'Word Count', value: `${pasteContent.split(/\s+/).filter(Boolean).length} words` },
      ],
    };

    onAddEvidence(newEvidence);
    setPasteTitle('');
    setPasteContent('');
    setPasteModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Demo Notice */}
      {isDemoMode && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
          <span>
            <strong>Fictional Demo Case:</strong> Showing sample documents from the Ogun electricity case.
          </span>
          <span className="text-[11px] font-semibold text-amber-800">
            {evidenceList.length} sample files loaded
          </span>
        </div>
      )}

      {/* Low-Bandwidth Notice */}
      {lowBandwidth && (
        <div className="mb-6 p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Wifi size={14} className="text-slate-600 shrink-0" />
            <span>
              <strong>Low-Bandwidth Mode Active:</strong> Rich animations are disabled and lightweight document representations are prioritized to conserve mobile data.
            </span>
          </span>
          <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0 ml-2">
            Low Data
          </span>
        </div>
      )}

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
        <span>Step 2 of 8</span>
        <span>•</span>
        <span>{t.stepEvidence}</span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
        {t.evidenceTitle}
      </h1>
      <p className="text-sm sm:text-base text-[#526071] mt-2 leading-relaxed">
        {t.evidenceSubtitle}
      </p>

      {/* Drag & Drop Zone and Mobile Upload Buttons */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`mt-8 p-6 rounded-2xl border-2 border-dashed transition-all text-center ${
          isDragging
            ? 'border-[#2457C5] bg-blue-50/60 shadow-md'
            : 'border-[#D9DEE7] bg-white hover:border-slate-400'
        }`}
      >
        <div className="max-w-md mx-auto space-y-2 mb-5">
          <Upload size={28} className="mx-auto text-[#2457C5]" />
          <div className="text-sm font-bold text-[#172033]">
            {t.dropzoneTitle}
          </div>
          <p className="text-xs text-[#526071]">
            {t.fileSupportText}
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Option 1: Take Photo / Camera (mobile capture) */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="p-4 rounded-xl border border-[#D9DEE7] bg-[#F8F7F3] hover:bg-slate-100 text-left transition-all group flex sm:flex-col items-center sm:items-start gap-3 shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2457C5] flex items-center justify-center shrink-0 group-hover:bg-[#2457C5] group-hover:text-white transition-colors">
              <Camera size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#172033]">Camera / Photo</div>
              <div className="text-xs text-[#526071] mt-0.5">
                Snap paper bill or letter with camera
              </div>
            </div>
          </button>

          {/* Option 2: Choose File (PDF / Images) */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-xl border border-[#D9DEE7] bg-[#F8F7F3] hover:bg-slate-100 text-left transition-all group flex sm:flex-col items-center sm:items-start gap-3 shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#18794E] flex items-center justify-center shrink-0 group-hover:bg-[#18794E] group-hover:text-white transition-colors">
              <Upload size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#172033]">{t.browseFiles}</div>
              <div className="text-xs text-[#526071] mt-0.5">
                Select PDF, JPG, PNG, CSV, or TXT
              </div>
            </div>
          </button>

          {/* Option 3: Paste Text / WhatsApp */}
          <button
            onClick={() => setPasteModalOpen(true)}
            className="p-4 rounded-xl border border-[#D9DEE7] bg-[#F8F7F3] hover:bg-slate-100 text-left transition-all group flex sm:flex-col items-center sm:items-start gap-3 shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5B4BB7] flex items-center justify-center shrink-0 group-hover:bg-[#5B4BB7] group-hover:text-white transition-colors">
              <Clipboard size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#172033]">{t.manualTextEntry}</div>
              <div className="text-xs text-[#526071] mt-0.5">
                Paste message, email, or written note
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Trust & Provenance Principle Banner */}
      <div className="mt-5 p-3.5 bg-[#F8F7F3] border border-[#D9DEE7] rounded-xl text-xs text-[#526071] flex items-start gap-2.5">
        <Shield size={16} className="text-[#18794E] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#172033]">Source Material Integrity:</span> Adding an artifact preserves it as a citizen-supplied source. It does not create an institutional fact (e.g. proof of submission or payment acceptance) until the actual document contents are reconstructed and verified.
        </div>
      </div>

      {/* Hidden inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*,application/pdf,text/*,.txt,.csv,.doc,.docx"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Uploading indicator */}
      {isReadingFile && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3 text-xs text-[#2457C5]">
          <div className="w-4 h-4 border-2 border-[#2457C5] border-t-transparent rounded-full animate-spin shrink-0" />
          <span>Reading file and extracting metadata locally...</span>
        </div>
      )}

      {/* Upload error */}
      {uploadError && (
        <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
          <AlertCircle size={15} />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Uploaded Evidence List */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#526071]">
            Attached Evidence ({evidenceList.length})
          </h2>
          <span className="text-xs text-[#526071]">
            Stored locally on your device
          </span>
        </div>

        {evidenceList.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border-2 border-dashed border-[#D9DEE7] bg-[#F8F7F3] space-y-3">
            <FileUp size={36} className="mx-auto text-slate-400" />
            <div>
              <div className="text-sm font-bold text-[#172033]">
                No evidence items added yet
              </div>
              <p className="text-xs text-[#526071] max-w-md mx-auto mt-1">
                Add at least one document, receipt, or pasted message to reconstruct your chronology. Even a brief written summary is sufficient.
              </p>
            </div>
            {onLoadDemoFiles && !isDemoMode && (
              <div className="pt-2">
                <button
                  onClick={onLoadDemoFiles}
                  className="text-xs font-semibold text-[#2457C5] hover:underline"
                >
                  Or explore with sample evidence files →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {evidenceList.map((file) => (
              <div
                key={file.id}
                className="p-4 rounded-xl border border-[#D9DEE7] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-[#2457C5]">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#172033]">
                        {file.title}
                      </span>
                      <span className="text-[11px] text-[#526071] bg-slate-100 px-2 py-0.5 rounded font-mono">
                        {file.size}
                      </span>
                      {file.processingStatus === 'extracted' && (
                        <span className="text-[10px] bg-emerald-50 text-[#18794E] border border-emerald-200 px-1.5 py-0.2 rounded font-semibold">
                          Text Extracted
                        </span>
                      )}
                      {file.processingStatus === 'binary-ready' && (
                        <span className="text-[10px] bg-blue-50 text-[#2457C5] border border-blue-200 px-1.5 py-0.2 rounded font-semibold">
                          Document Binary Ready
                        </span>
                      )}
                      {file.processingStatus === 'ready' && (
                        <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.2 rounded font-semibold">
                          Visual File Ready
                        </span>
                      )}
                      {file.privacyStatus === 'private' && (
                        <span className="text-[10px] bg-amber-50 text-[#A15C00] border border-amber-200 px-1.5 py-0.2 rounded font-semibold">
                          Kept Private
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#526071] mt-1 line-clamp-1">
                      {file.contentSummary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onViewSource(file)}
                    className="p-1.5 rounded-lg border border-[#D9DEE7] text-xs font-semibold text-[#526071] hover:text-[#172033] hover:bg-slate-50 flex items-center gap-1"
                    title="Inspect document text"
                  >
                    <Eye size={14} />
                    <span className="hidden sm:inline">Inspect</span>
                  </button>

                  <button
                    onClick={() => onTogglePrivacy(file.id)}
                    className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                      file.privacyStatus === 'private'
                        ? 'border-amber-300 bg-amber-50 text-amber-800'
                        : 'border-[#D9DEE7] text-[#526071] hover:bg-slate-50'
                    }`}
                    title={
                      file.privacyStatus === 'private'
                        ? 'Marked private: will not be exported'
                        : 'Included in case bundle'
                    }
                  >
                    {file.privacyStatus === 'private' ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span className="hidden sm:inline">
                      {file.privacyStatus === 'private' ? 'Private' : 'Include'}
                    </span>
                  </button>

                  <button
                    onClick={() => onRemoveEvidence(file.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation and "Continue with what I have" Footer */}
      <div className="mt-10 pt-6 border-t border-[#D9DEE7] flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          id="evidence-back-btn"
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#526071] hover:text-[#172033] cursor-pointer"
        >
          Back
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto justify-end">
          {evidenceList.length === 0 && onLoadDemoFiles && (
            <button
              id="evidence-preload-demo-btn"
              type="button"
              onClick={onLoadDemoFiles}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-[#A15C00] bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
            >
              Load realistic sample documents
            </button>
          )}

          <button
            id="evidence-continue-btn"
            type="button"
            onClick={onContinue}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#2457C5] hover:bg-[#1D46A0] text-white shadow-xs transition-all cursor-pointer"
          >
            <span>
              {evidenceList.length > 0
                ? `Continue to Reconstruction (${evidenceList.length} items)`
                : 'Continue to Reconstruction (Statement only)'}
            </span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Paste Modal */}
      {pasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#D9DEE7] shadow-xl max-w-lg w-full p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9DEE7]">
              <h3 className="text-base font-bold text-[#172033]">
                Paste text, message, or notes
              </h3>
              <button
                onClick={() => setPasteModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePasteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#526071] mb-1">
                  Type of message / note
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['chat', 'email', 'text', 'letter'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPasteCategory(cat)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border capitalize ${
                        pasteCategory === cat
                          ? 'border-[#2457C5] bg-blue-50 text-[#2457C5]'
                          : 'border-[#D9DEE7] text-[#526071]'
                      }`}
                    >
                      {cat === 'chat' ? 'WhatsApp' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#526071] mb-1">
                  Title or description
                </label>
                <input
                  type="text"
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  placeholder="e.g. WhatsApp conversation with customer care agent"
                  className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#526071] mb-1">
                  Paste content or transcript <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  placeholder="Paste the message transcript, date of conversation, agent replies, and notes here..."
                  className="w-full p-3 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPasteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#526071] hover:text-[#172033]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!pasteContent.trim()}
                  className="px-5 py-2 bg-[#2457C5] text-white text-xs font-semibold rounded-xl hover:bg-[#1D46A0] disabled:bg-slate-200 disabled:text-slate-400"
                >
                  Add to Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
