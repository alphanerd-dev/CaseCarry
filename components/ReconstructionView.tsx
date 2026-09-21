'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  RotateCw,
  Plus,
  HelpCircle,
  Clock,
  Settings,
  Cpu,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { CaseEvent, EvidenceFile, UnresolvedIssue } from '@/types/case';
import { ProvenanceBadge } from './ProvenanceBadge';
import { AIProviderId, AIProviderStatus, ProviderStrategy } from '@/lib/ai/types';
import { SupportedLanguage, TRANSLATIONS } from '@/lib/i18n';

interface ReconstructionViewProps {
  events: CaseEvent[];
  evidenceList: EvidenceFile[];
  contradictions?: string[];
  missingInformation?: string[];
  caseTitle?: string;
  provider?: string;
  firstReportOutcome?: string;
  userDescription?: string;
  referenceNumber?: string;
  onUpdateReconstruction: (
    events: CaseEvent[],
    contradictions?: string[],
    missingInfo?: string[],
    unresolvedDraft?: Partial<UnresolvedIssue>
  ) => void;
  onAddCustomEvent?: (event: CaseEvent) => void;
  onViewSource: (file: EvidenceFile) => void;
  onContinue: () => void;
  onBack: () => void;
  isDemoMode?: boolean;
  currentLanguage?: SupportedLanguage;
}

export function ReconstructionView({
  events,
  evidenceList,
  contradictions = [],
  missingInformation = [],
  caseTitle = '',
  provider = '',
  firstReportOutcome = '',
  userDescription = '',
  referenceNumber = '',
  onUpdateReconstruction,
  onAddCustomEvent,
  onViewSource,
  onContinue,
  onBack,
  isDemoMode,
  currentLanguage = 'en',
}: ReconstructionViewProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(events[0]?.id || null);
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [reconstructProgressStep, setReconstructProgressStep] = useState(1);
  const [reconstructError, setReconstructError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Multi-Provider AI Settings & Processing State
  const [aiStrategy, setAiStrategy] = useState<ProviderStrategy>('auto');
  const [providerStatuses, setProviderStatuses] = useState<AIProviderStatus[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [lastProcessingMetadata, setLastProcessingMetadata] = useState<any>(null);

  // Manual event adding modal
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualDate, setManualDate] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualProv, setManualProv] = useState<CaseEvent['provenance']>('USER_REPORTED');

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Fetch provider status on mount
  useEffect(() => {
    fetch('/api/ai/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.providers) {
          setProviderStatuses(data.providers);
        }
      })
      .catch(() => {
        // Fallback default status indicators if offline
        setProviderStatuses([
          {
            id: 'gemini',
            name: 'Google Gemini',
            model: 'gemini-3.8-flash',
            enabled: true,
            isConfigured: true,
            capabilities: { text: true, images: true, pdf: true, structuredOutput: true },
          },
          {
            id: 'openai',
            name: 'OpenAI',
            model: 'gpt-4o-mini',
            enabled: true,
            isConfigured: false,
            capabilities: { text: true, images: true, pdf: false, structuredOutput: true },
          },
          {
            id: 'grok',
            name: 'xAI Grok',
            model: 'grok-2-latest',
            enabled: true,
            isConfigured: false,
            capabilities: { text: true, images: true, pdf: false, structuredOutput: true },
          },
          {
            id: 'deterministic',
            name: 'Deterministic Baseline',
            model: 'casecarry-deterministic-v1',
            enabled: true,
            isConfigured: true,
            capabilities: { text: true, images: true, pdf: true, structuredOutput: true },
          },
        ]);
      });
  }, []);

  const handleRunReconstruction = async () => {
    setIsReconstructing(true);
    setReconstructError(null);
    setReconstructProgressStep(1);

    const stepTimer1 = setTimeout(() => setReconstructProgressStep(2), 600);
    const stepTimer2 = setTimeout(() => setReconstructProgressStep(3), 1300);
    const stepTimer3 = setTimeout(() => setReconstructProgressStep(4), 2000);

    try {
      // Prepare normalized evidence sources
      const evidenceSources = evidenceList.map((e) => ({
        id: e.id,
        title: e.title,
        filename: e.filename,
        type: e.type,
        textSnippet: e.extractedText || e.fullSnippet || e.rawText || e.contentSummary || '',
        base64Data: e.dataUrl,
        mimeType: e.mimeType,
      }));

      const res = await fetch('/api/reconstruct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          failureOutcome: firstReportOutcome,
          provider: provider,
          referenceNumber: referenceNumber,
          userDescription: userDescription,
          evidenceSources,
          strategy: aiStrategy,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server reconstruction returned an error.');
      }

      const resJson = await res.json();
      if (resJson.data && resJson.data.events) {
        const generatedEvents: CaseEvent[] = resJson.data.events.map((ev: any, idx: number) => ({
          id: ev.id || `ev-gen-${idx}`,
          date: ev.date || 'Date not established',
          displayDate: ev.displayDate || ev.date || 'Date not established',
          datePrecision: ev.datePrecision || 'approximate',
          title: ev.title || 'Event',
          description: ev.description || '',
          provenance: ev.provenance || 'SOURCE_BACKED',
          provenanceLabel: ev.provenanceLabel || 'Source-backed',
          sourceIds: ev.sourceIds || [],
          sourceNames: ev.sourceNames || [],
          sourceQuote: ev.sourceQuote,
          sourceLocation: ev.sourceLocation,
          conflictDetails: ev.conflictDetails,
          needsReviewReason: ev.needsReviewReason,
          verifiedByUser: false,
          category: ev.category || 'status',
        }));

        onUpdateReconstruction(
          generatedEvents,
          resJson.data.contradictions || [],
          resJson.data.missingInformation || [],
          resJson.data.unresolvedDraft
        );

        if (resJson.data.aiProcessing) {
          setLastProcessingMetadata(resJson.data.aiProcessing);
        }

        if (resJson.fallbackNotice) {
          setFallbackNotice(resJson.fallbackNotice);
        } else {
          setFallbackNotice(null);
        }

        if (generatedEvents.length > 0) {
          setSelectedEventId(generatedEvents[0].id);
        }
      }
    } catch (err: any) {
      // Deterministic fallback safeguarding
      const localEvents: CaseEvent[] = [];

      if (userDescription && userDescription.trim().length > 0) {
        localEvents.push({
          id: `ev-local-user-${Date.now()}`,
          date: 'Date not established',
          displayDate: 'Date not established (Citizen report)',
          datePrecision: 'not-established',
          title: provider ? `Complaint reported to ${provider}` : 'Initial problem reported',
          description: userDescription.slice(0, 320),
          provenance: 'USER_REPORTED',
          provenanceLabel: 'You reported this',
          sourceIds: [],
          sourceNames: ['Citizen Statement'],
          sourceQuote: userDescription.slice(0, 160),
          verifiedByUser: false,
          category: 'complaint',
        });
      }

      evidenceList.forEach((ev, idx) => {
        const foundDate = ev.keyFields?.find((k) => k.label.toLowerCase().includes('date'))?.value;
        const establishedDate = foundDate ? foundDate : 'Date not established';
        const establishedPrecision = foundDate ? 'approximate' : 'not-established';

        localEvents.push({
          id: `ev-local-doc-${idx + 1}-${Date.now()}`,
          date: establishedDate,
          displayDate: foundDate ? foundDate : 'Date not established (In document)',
          datePrecision: establishedPrecision,
          title: ev.title || `Document: ${ev.filename}`,
          description: ev.contentSummary || `Attached evidence: ${ev.filename}.`,
          provenance: 'SOURCE_BACKED',
          provenanceLabel: 'Source-backed',
          sourceIds: [ev.id],
          sourceNames: [ev.filename],
          sourceQuote: ev.fullSnippet ? ev.fullSnippet.slice(0, 160) : ev.title,
          verifiedByUser: false,
          category: ev.type === 'receipt' ? 'payment' : 'communication',
        });
      });

      if (localEvents.length > 0) {
        onUpdateReconstruction(localEvents, [], ['Official written response or final deadlock letter']);
        setSelectedEventId(localEvents[0].id);
        setFallbackNotice(
          'Timeline reconstructed directly from your attached evidence and notes. Please review and verify each event below.'
        );
        setLastProcessingMetadata({
          provider: 'deterministic',
          model: 'casecarry-deterministic-v1',
          fallbackUsed: true,
          primaryProvider: 'gemini',
          fallbackReason: 'AI providers unavailable or disconnected. Reconstructed via local baseline.',
          generatedAt: new Date().toISOString(),
        });
        setReconstructError(null);
      } else {
        setReconstructError(
          err.message || 'Could not reconstruct case automatically. You can add events manually.'
        );
      }
    } finally {
      setIsReconstructing(false);
    }
  };

  const handleCreateManualEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    const newEv: CaseEvent = {
      id: `ev-manual-${Date.now()}`,
      date: manualDate.trim() || 'Date not established',
      displayDate: manualDate.trim() || 'Date not established',
      datePrecision: manualDate.trim() ? 'exact' : 'not-established',
      title: manualTitle,
      description: manualDesc || manualTitle,
      provenance: manualProv,
      provenanceLabel:
        manualProv === 'USER_REPORTED' || manualProv === 'user-reported'
          ? 'You reported this'
          : 'Source-backed',
      sourceIds: [],
      sourceNames: ['Citizen Statement'],
      verifiedByUser: true,
      category: 'complaint',
    };

    if (onAddCustomEvent) {
      onAddCustomEvent(newEv);
    } else {
      onUpdateReconstruction([...events, newEv], contradictions, missingInformation);
    }

    setSelectedEventId(newEv.id);
    setManualTitle('');
    setManualDate('');
    setManualDesc('');
    setManualModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Back button */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          id="back-to-evidence-btn"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033] p-1 rounded-md transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{t.back}</span>
        </button>

        {/* AI Provider Settings Button */}
        <button
          id="ai-provider-settings-btn"
          onClick={() => setShowSettingsModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D9DEE7] bg-white hover:bg-slate-50 text-xs font-semibold text-[#526071] hover:text-[#172033] shadow-xs transition-colors cursor-pointer"
          title="Configure AI reconstruction providers and failover strategy"
        >
          <Cpu size={14} className="text-[#2457C5]" />
          <span>AI Providers: {aiStrategy === 'auto' ? 'Automatic Failover' : aiStrategy}</span>
          <Settings size={13} className="text-slate-400 ml-0.5" />
        </button>
      </div>

      {/* Progress pill */}
      <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2457C5] text-xs font-semibold border border-blue-100">
        <span>Step 3 of 8</span>
        <span>•</span>
        <span>{t.stepReconstruction}</span>
      </div>

      {/* Heading */}
      <div className="max-w-2xl mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
          {t.reconstructTitle}
        </h1>
        <p className="text-sm sm:text-base text-[#526071] mt-2 leading-relaxed">
          {t.reconstructSubtitle}
        </p>
      </div>

      {/* Trust & Provenance Guarantee Banner */}
      <div className="p-4 mb-6 bg-white border border-[#D9DEE7] rounded-xl flex items-start gap-3 shadow-xs">
        <Info size={18} className="text-[#2457C5] shrink-0 mt-0.5" />
        <div className="text-xs text-[#526071] leading-relaxed">
          <strong className="text-[#172033]">Provenance Principles:</strong> Every event cites its source. Facts verified by documents are marked <strong className="text-[#18794E]">Source-backed</strong>, citizen statements are marked <strong className="text-[#A15C00]">You reported this</strong>, and conflicting records are surfaced as <strong className="text-[#A33A3A]">Sources conflict</strong> without taking sides.
        </div>
      </div>

      {/* When no events exist yet (Fresh Real Case): Reconstruct Prompt */}
      {events.length === 0 && !isReconstructing && (
        <div className="p-8 text-center bg-white border border-[#D9DEE7] rounded-2xl shadow-xs space-y-5 my-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2457C5] flex items-center justify-center mx-auto">
            <Sparkles size={24} />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-[#172033]">
              Ready to reconstruct your case timeline
            </h3>
            <p className="text-xs text-[#526071]">
              CaseCarry will analyze {evidenceList.length} evidence artifact{evidenceList.length !== 1 ? 's' : ''}, extract chronological dates, and identify any contradictions.
            </p>
          </div>

          {/* Privacy & Provider Disclosure (Rule 12) */}
          <div className="p-3.5 bg-slate-50 border border-[#D9DEE7] rounded-xl text-xs text-[#526071] max-w-lg mx-auto text-left flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-[#18794E] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#172033]">Privacy & Processing Notice:</strong> CaseCarry may send the sources you select to a configured AI provider to reconstruct your case. If the primary provider is unavailable, another configured provider will be used automatically.
            </div>
          </div>

          {reconstructError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 max-w-lg mx-auto">
              <p className="font-semibold">{reconstructError}</p>
              <p className="mt-1 text-[11px] text-amber-700">
                You can retry reconstruction or add your events manually below.
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="start-ai-reconstruction-btn"
              onClick={handleRunReconstruction}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Start AI Reconstruction</span>
            </button>

            <button
              id="add-manual-event-btn"
              onClick={() => setManualModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 border border-[#D9DEE7] hover:bg-slate-50 text-[#172033] text-sm font-semibold rounded-xl bg-white transition-colors cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Event Manually</span>
            </button>
          </div>
        </div>
      )}

      {/* Reconstructing Progress Screen */}
      {isReconstructing && (
        <div className="p-8 sm:p-12 text-center bg-white border border-blue-200 rounded-2xl shadow-xs space-y-6 my-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2457C5] flex items-center justify-center mx-auto">
            <RotateCw size={24} className="animate-spin text-[#2457C5]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#172033]">
              Reconstructing case chronology...
            </h3>
            <p className="text-xs text-[#526071]">
              Analyzing document text and building an evidence-aware timeline.
            </p>
          </div>

          <div className="max-w-sm mx-auto space-y-2 text-left text-xs text-[#526071]">
            <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${reconstructProgressStep >= 1 ? 'border-emerald-200 bg-emerald-50/50 text-[#18794E]' : 'border-slate-200'}`}>
              <CheckCircle2 size={14} className={reconstructProgressStep >= 1 ? 'text-[#18794E]' : 'text-slate-300'} />
              <span>1. Inspecting uploaded evidence and statements...</span>
            </div>
            <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${reconstructProgressStep >= 2 ? 'border-emerald-200 bg-emerald-50/50 text-[#18794E]' : 'border-slate-200'}`}>
              <CheckCircle2 size={14} className={reconstructProgressStep >= 2 ? 'text-[#18794E]' : 'text-slate-300'} />
              <span>2. Extracting chronological actions and dates...</span>
            </div>
            <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${reconstructProgressStep >= 3 ? 'border-emerald-200 bg-emerald-50/50 text-[#18794E]' : 'border-slate-200'}`}>
              <CheckCircle2 size={14} className={reconstructProgressStep >= 3 ? 'text-[#18794E]' : 'text-slate-300'} />
              <span>3. Assigning provenance categories...</span>
            </div>
            <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${reconstructProgressStep >= 4 ? 'border-emerald-200 bg-emerald-50/50 text-[#18794E]' : 'border-slate-200'}`}>
              <CheckCircle2 size={14} className={reconstructProgressStep >= 4 ? 'text-[#18794E]' : 'text-slate-300'} />
              <span>4. Surfacing contradictions and uncertainties...</span>
            </div>
          </div>
        </div>
      )}

      {/* Provider Used & Fallback Banner */}
      {lastProcessingMetadata && (
        <div className="mb-6 p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <Cpu size={16} className="text-[#2457C5] shrink-0" />
            <div>
              <span className="font-semibold text-[#172033]">
                {lastProcessingMetadata.fallbackUsed
                  ? `Reconstruction generated via ${lastProcessingMetadata.provider === 'openai' ? 'OpenAI' : lastProcessingMetadata.provider === 'grok' ? 'xAI Grok' : lastProcessingMetadata.provider === 'gemini' ? 'Google Gemini' : 'Deterministic Baseline'} (Failover)`
                  : `Reconstruction generated via ${lastProcessingMetadata.provider === 'gemini' ? 'Google Gemini' : lastProcessingMetadata.provider === 'openai' ? 'OpenAI' : lastProcessingMetadata.provider === 'grok' ? 'xAI Grok' : 'Deterministic Baseline'}`}
              </span>
              <span className="text-[#526071] ml-2 text-[11px]">
                Model: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">{lastProcessingMetadata.model}</code>
              </span>
            </div>
          </div>
          <button
            id="view-processing-details-btn"
            onClick={() => setShowDetailsModal(true)}
            className="text-[#2457C5] hover:underline font-semibold text-xs shrink-0 cursor-pointer"
          >
            Processing details
          </button>
        </div>
      )}

      {/* Fallback Notice Banner */}
      {fallbackNotice && (
        <div className="mb-6 p-3.5 rounded-xl border border-blue-200 bg-blue-50/80 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Sparkles size={16} className="text-[#2457C5] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#172033]">Failover Notice</p>
              <p className="text-[#526071] mt-0.5 leading-relaxed">{fallbackNotice}</p>
            </div>
          </div>
          <button
            onClick={() => setFallbackNotice(null)}
            className="text-slate-400 hover:text-slate-600 p-1 text-xs shrink-0 cursor-pointer"
            aria-label="Dismiss notice"
          >
            ✕
          </button>
        </div>
      )}

      {/* Surfaced Contradictions Card */}
      {contradictions.length > 0 && (
        <div className="mb-6 p-4 rounded-xl border border-rose-200 bg-rose-50/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
            <AlertTriangle size={16} />
            <span>Contradictions Surfaced Across Sources ({contradictions.length})</span>
          </div>
          <p className="text-xs text-rose-900 leading-relaxed">
            CaseCarry does not reconcile these or assume which party is correct. Both statements are preserved:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-rose-950 font-medium">
            {contradictions.map((c, i) => (
              <li key={i} className="leading-relaxed">
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Information / Uncertainty Card */}
      {missingInformation.length > 0 && (
        <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <HelpCircle size={16} />
            <span>Missing Information & Preserved Uncertainties ({missingInformation.length})</span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            These gaps were detected from the current record. You may verify or clarify them in the next step:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-amber-950">
            {missingInformation.map((m, i) => (
              <li key={i} className="leading-relaxed">
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Split layout: Chronology (Left) + Source Inspector (Right) */}
      {events.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Event Chronology (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#172033] uppercase tracking-wider">
                Chronology ({events.length} Events)
              </h2>
              <div className="flex items-center gap-2">
                <button
                  id="add-event-toolbar-btn"
                  onClick={() => setManualModalOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2457C5] hover:underline cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add event</span>
                </button>
                <span className="text-slate-300">|</span>
                <button
                  id="re-run-reconstruct-btn"
                  onClick={handleRunReconstruction}
                  disabled={isReconstructing}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#526071] hover:text-[#172033] cursor-pointer"
                >
                  <RotateCw size={12} className={isReconstructing ? 'animate-spin' : ''} />
                  <span>Re-run</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {events.map((ev, index) => {
                const isSelected = ev.id === selectedEventId;
                return (
                  <div
                    key={ev.id}
                    id={`event-item-${ev.id}`}
                    onClick={() => setSelectedEventId(ev.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#2457C5] bg-blue-50/40 shadow-xs ring-1 ring-[#2457C5]/30'
                        : 'border-[#D9DEE7] bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#172033]">
                            {ev.displayDate || ev.date || 'Date not established'}
                          </span>
                          <span className="text-[11px] text-slate-400">•</span>
                          <span className="text-[11px] uppercase font-semibold text-slate-500">
                            {ev.category || 'Event'}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#172033]">{ev.title}</h3>
                      </div>
                      <ProvenanceBadge provenance={ev.provenance} label={ev.provenanceLabel} />
                    </div>

                    <p className="text-xs text-[#526071] mt-2 line-clamp-2 leading-relaxed">
                      {ev.description}
                    </p>

                    {/* Source citations tags */}
                    {ev.sourceNames && ev.sourceNames.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Sources:</span>
                        {ev.sourceNames.map((name, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-[#172033] text-[11px] font-medium"
                          >
                            <FileText size={10} className="text-slate-500" />
                            <span>{name}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Event Source Inspector (5 cols) */}
          <div className="lg:col-span-5 sticky top-6 space-y-4">
            <h2 className="text-sm font-bold text-[#172033] uppercase tracking-wider">
              Source & Evidence Inspector
            </h2>

            {selectedEvent ? (
              <div className="p-5 bg-white border border-[#D9DEE7] rounded-xl shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-500">
                      {selectedEvent.displayDate || selectedEvent.date}
                    </span>
                    <h3 className="text-base font-bold text-[#172033] mt-0.5">
                      {selectedEvent.title}
                    </h3>
                  </div>
                  <ProvenanceBadge
                    provenance={selectedEvent.provenance}
                    label={selectedEvent.provenanceLabel}
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-[#172033] leading-relaxed">
                  {selectedEvent.description}
                </div>

                {/* Direct Source Quote */}
                {selectedEvent.sourceQuote && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Direct Source Citation:
                    </span>
                    <blockquote className="p-3 border-l-2 border-[#2457C5] bg-blue-50/40 text-xs text-[#172033] italic rounded-r-lg">
                      &quot;{selectedEvent.sourceQuote}&quot;
                    </blockquote>
                  </div>
                )}

                {/* Associated Evidence Files */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Associated Artifacts:
                  </span>
                  {selectedEvent.sourceIds && selectedEvent.sourceIds.length > 0 ? (
                    <div className="space-y-1.5">
                      {selectedEvent.sourceIds.map((sid) => {
                        const file = evidenceList.find((f) => f.id === sid);
                        if (!file) return null;
                        return (
                          <div
                            key={sid}
                            className="p-2.5 rounded-lg border border-[#D9DEE7] hover:border-[#2457C5] flex items-center justify-between gap-2 text-xs bg-white transition-colors"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <FileText size={14} className="text-[#2457C5] shrink-0" />
                              <span className="font-semibold text-[#172033] truncate">
                                {file.filename}
                              </span>
                            </div>
                            <button
                              onClick={() => onViewSource(file)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-[#2457C5] hover:bg-blue-50 rounded-md inline-flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              <Eye size={12} />
                              <span>View</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No document citation (Reported directly by citizen).
                    </p>
                  )}
                </div>

                {/* Conflict or review reasons */}
                {selectedEvent.conflictDetails && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                    <strong className="block font-bold">Conflict Details:</strong>
                    <span>{selectedEvent.conflictDetails}</span>
                  </div>
                )}

                {selectedEvent.needsReviewReason && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <strong className="block font-bold">Review Needed:</strong>
                    <span>{selectedEvent.needsReviewReason}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-[#D9DEE7] rounded-xl text-xs text-slate-400">
                Select an event to inspect its source provenance.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Continue bar */}
      <div className="mt-8 pt-4 border-t border-[#D9DEE7] flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl border border-[#D9DEE7] text-sm font-semibold text-[#526071] hover:text-[#172033] bg-white hover:bg-slate-50 transition-colors cursor-pointer"
        >
          {t.back}
        </button>

        <button
          id="continue-to-verification-btn"
          onClick={onContinue}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#2457C5] hover:bg-[#1D46A0] text-white shadow-xs transition-colors cursor-pointer"
        >
          <span>{t.continue}</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* AI Strategy & Provider Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#D9DEE7] space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Cpu size={18} className="text-[#2457C5]" />
                <h3 className="text-base font-bold text-[#172033]">AI Reconstruction Strategy</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm rounded-md cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#526071] leading-relaxed">
              CaseCarry uses a multi-provider reconstruction architecture with controlled failover. All providers operate under the same strict provenance and anti-hallucination rules.
            </p>

            {/* Strategy Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#172033] block">Provider Strategy:</label>
              {[
                {
                  id: 'auto',
                  title: 'Automatic Failover (Recommended)',
                  desc: 'Gemini → OpenAI → xAI Grok → Deterministic baseline. Automatically uses the next available provider if one experiences outages or rate limits.',
                },
                {
                  id: 'gemini',
                  title: 'Google Gemini Only',
                  desc: 'Use Gemini only. Falls back strictly to deterministic baseline if unavailable.',
                },
                {
                  id: 'openai',
                  title: 'OpenAI Only',
                  desc: 'Use OpenAI GPT-4o-mini directly.',
                },
                {
                  id: 'grok',
                  title: 'xAI Grok Only',
                  desc: 'Use xAI Grok directly.',
                },
                {
                  id: 'deterministic',
                  title: 'Deterministic Baseline (Local Only)',
                  desc: 'Rule-based extraction without calling any external AI APIs.',
                },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                    aiStrategy === opt.id
                      ? 'border-[#2457C5] bg-blue-50/40 text-[#172033]'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="strategy"
                    value={opt.id}
                    checked={aiStrategy === opt.id}
                    onChange={() => setAiStrategy(opt.id as ProviderStrategy)}
                    className="mt-0.5 text-[#2457C5] focus:ring-[#2457C5]"
                  />
                  <div>
                    <span className="text-xs font-bold block">{opt.title}</span>
                    <span className="text-[11px] text-[#526071] leading-relaxed block mt-0.5">
                      {opt.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {/* Provider Availability List */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-[#172033] block">Configured Providers Status:</span>
              <div className="space-y-1.5">
                {providerStatuses.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  >
                    <span className="font-semibold text-[#172033]">{p.name}</span>
                    <div className="flex items-center gap-1.5">
                      {p.isConfigured ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#18794E] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check size={11} />
                          <span>Configured</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          <span>Not configured</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 rounded-xl bg-[#2457C5] text-white text-xs font-semibold hover:bg-[#1D46A0] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Details Modal */}
      {showDetailsModal && lastProcessingMetadata && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#D9DEE7] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Cpu size={18} className="text-[#2457C5]" />
                <h3 className="text-base font-bold text-[#172033]">Processing & Provenance Details</h3>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm rounded-md cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#526071]">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-600">Active Provider:</span>
                  <span className="font-bold text-[#172033] uppercase">{lastProcessingMetadata.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-600">Model Identifier:</span>
                  <span className="font-mono text-[#172033]">{lastProcessingMetadata.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-600">Execution Mode:</span>
                  <span className="font-semibold text-[#172033]">
                    {lastProcessingMetadata.fallbackUsed ? 'Failover Fallback' : 'Direct Primary'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-600">Timestamp:</span>
                  <span className="text-[#172033]">{lastProcessingMetadata.generatedAt}</span>
                </div>
              </div>

              {lastProcessingMetadata.fallbackHistory && lastProcessingMetadata.fallbackHistory.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-[#172033]">Provider Failover Events:</span>
                  {lastProcessingMetadata.fallbackHistory.map((item: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-900 space-y-0.5">
                      <div className="font-semibold flex justify-between">
                        <span>{item.provider.toUpperCase()} ({item.failureType})</span>
                        <span className="text-[10px] text-amber-700">{item.timestamp?.slice(11, 19)}</span>
                      </div>
                      <p className="text-amber-800">{item.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 rounded-xl bg-[#2457C5] text-white text-xs font-semibold hover:bg-[#1D46A0] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Event Creation Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateManualEvent}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#D9DEE7] space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#172033]">Add Timeline Event Manually</h3>
              <button
                type="button"
                onClick={() => setManualModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm rounded-md cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#172033] block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reported meter discrepancy via email"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2457C5]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#172033] block mb-1">Date</label>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD or Month YYYY (leave blank if not established)"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2457C5]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#172033] block mb-1">Provenance Source</label>
                <select
                  value={manualProv}
                  onChange={(e) => setManualProv(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2457C5]"
                >
                  <option value="USER_REPORTED">You reported this (Citizen Statement)</option>
                  <option value="SOURCE_BACKED">Source-backed (Verified in attached evidence)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#172033] block mb-1">Description / Details</label>
                <textarea
                  rows={3}
                  placeholder="Describe what occurred..."
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2457C5]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setManualModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#D9DEE7] text-xs font-semibold text-[#526071] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#2457C5] text-white text-xs font-semibold hover:bg-[#1D46A0] transition-colors cursor-pointer"
              >
                Add Event
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
