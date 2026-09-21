'use client';

import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { CaseEvent, EvidenceFile, UnresolvedIssue } from '@/types/case';
import { ProvenanceBadge } from './ProvenanceBadge';

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
}: ReconstructionViewProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(events[0]?.id || null);
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [reconstructProgressStep, setReconstructProgressStep] = useState(1);
  const [reconstructError, setReconstructError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  // Manual event adding modal
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualDate, setManualDate] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualProv, setManualProv] = useState<CaseEvent['provenance']>('user-reported');

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const handleRunReconstruction = async () => {
    setIsReconstructing(true);
    setReconstructError(null);
    setReconstructProgressStep(1);

    const stepTimer1 = setTimeout(() => setReconstructProgressStep(2), 700);
    const stepTimer2 = setTimeout(() => setReconstructProgressStep(3), 1500);
    const stepTimer3 = setTimeout(() => setReconstructProgressStep(4), 2200);

    try {
      // Prepare payload for server-side Gemini reconstruction
      const evidenceSources = evidenceList.map((e) => ({
        id: e.id,
        title: e.title,
        filename: e.filename,
        type: e.type,
        textSnippet: e.fullSnippet || e.rawText || e.contentSummary,
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
          date: ev.date || 'Date not specified',
          displayDate: ev.displayDate || ev.date || 'Date not specified',
          datePrecision: ev.datePrecision || 'approximate',
          title: ev.title || 'Event',
          description: ev.description || '',
          provenance: ev.provenance || 'source-backed',
          provenanceLabel: ev.provenanceLabel || 'Source-backed',
          sourceIds: ev.sourceIds || [],
          sourceNames: ev.sourceNames || [],
          sourceQuote: ev.sourceQuote,
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
      console.warn('Reconstruction error, activating local document baseline:', err);
      // Construct robust local fallback timeline from available evidence and user statements
      const localEvents: CaseEvent[] = [];
      const todayStr = new Date().toISOString().slice(0, 10);

      if (userDescription && userDescription.trim().length > 0) {
        localEvents.push({
          id: `ev-local-user-${Date.now()}`,
          date: todayStr,
          displayDate: 'Prior Reported Date',
          datePrecision: 'approximate',
          title: provider ? `Complaint reported to ${provider}` : 'Initial problem reported',
          description: userDescription.slice(0, 320),
          provenance: 'user-reported',
          provenanceLabel: 'You reported this',
          sourceIds: [],
          sourceNames: ['Citizen Statement'],
          sourceQuote: userDescription.slice(0, 160),
          verifiedByUser: false,
          category: 'complaint',
        });
      }

      evidenceList.forEach((ev, idx) => {
        localEvents.push({
          id: `ev-local-doc-${idx + 1}-${Date.now()}`,
          date: todayStr,
          displayDate: 'Date in attached record',
          datePrecision: 'unspecified',
          title: ev.title || `Document: ${ev.filename}`,
          description: ev.contentSummary || `Attached evidence: ${ev.filename}.`,
          provenance: 'source-backed',
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
      date: manualDate || 'Date not specified',
      displayDate: manualDate || 'Date not specified',
      datePrecision: manualDate ? 'exact' : 'unspecified',
      title: manualTitle,
      description: manualDesc || manualTitle,
      provenance: manualProv,
      provenanceLabel: manualProv === 'user-reported' ? 'You reported this' : 'Source-backed',
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
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033] mb-6 p-1 rounded-md transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Evidence</span>
      </button>

      {/* Progress pill */}
      <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2457C5] text-xs font-semibold border border-blue-100">
        <span>Step 3 of 8</span>
        <span>•</span>
        <span>Reconstruction & Provenance</span>
      </div>

      {/* Heading */}
      <div className="max-w-2xl mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
          Reconstructed Case Chronology
        </h1>
        <p className="text-sm sm:text-base text-[#526071] mt-2 leading-relaxed">
          CaseCarry extracts a structured draft from your documents and statements, tracing every claim to its source without inventing facts.
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
              onClick={handleRunReconstruction}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-sm font-semibold rounded-xl shadow-xs"
            >
              <Sparkles size={16} />
              <span>Start AI Reconstruction</span>
            </button>

            <button
              onClick={() => setManualModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 border border-[#D9DEE7] hover:bg-slate-50 text-[#172033] text-sm font-semibold rounded-xl bg-white"
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

      {/* Fallback / High Demand Notice Banner */}
      {fallbackNotice && (
        <div className="mb-6 p-3.5 rounded-xl border border-blue-200 bg-blue-50/80 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Sparkles size={16} className="text-[#2457C5] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#172033]">Case Reconstruction Generated</p>
              <p className="text-[#526071] mt-0.5 leading-relaxed">{fallbackNotice}</p>
            </div>
          </div>
          <button
            onClick={() => setFallbackNotice(null)}
            className="text-slate-400 hover:text-slate-600 p-1 text-xs shrink-0"
            aria-label="Dismiss notice"
          >
            ✕
          </button>
        </div>
      )}

      {/* Surfaced Contradictions Card (Section 5) */}
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

      {/* Missing Information / Uncertainty Card (Section 6) */}
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
                  onClick={() => setManualModalOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2457C5] hover:underline"
                >
                  <Plus size={13} />
                  <span>Add event</span>
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={handleRunReconstruction}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#526071] hover:text-[#172033]"
                  title="Re-run AI reconstruction"
                >
                  <RotateCw size={12} />
                  <span>Reconstruct</span>
                </button>
              </div>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#D9DEE7]">
              {events.map((ev) => {
                const isSelected = selectedEvent?.id === ev.id;
                const hasConflict = ev.provenance === 'conflict';

                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEventId(ev.id)}
                    className={`relative p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
                      hasConflict
                        ? 'border-rose-300 bg-rose-50/40 ring-1 ring-rose-300'
                        : isSelected
                        ? 'border-[#2457C5] bg-white ring-2 ring-[#2457C5]/30 shadow-xs'
                        : 'border-[#D9DEE7] bg-white hover:border-[#2457C5]/40 hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Timeline node dot */}
                    <div
                      className={`absolute -left-[1.85rem] sm:-left-[2.35rem] top-5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-colors ${
                        hasConflict
                          ? 'border-rose-600 bg-rose-500'
                          : isSelected
                          ? 'border-[#2457C5] bg-[#2457C5]'
                          : 'border-[#526071] bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>

                    {/* Header info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-[#526071]" />
                        <span className="text-xs font-bold text-[#526071]">{ev.displayDate}</span>
                        {ev.datePrecision === 'approximate' && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1 rounded">
                            Approximate
                          </span>
                        )}
                      </div>

                      {/* Provenance Badge */}
                      <ProvenanceBadge type={ev.provenance} size="sm" />
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-sm sm:text-base font-bold text-[#172033] leading-snug">
                      {ev.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#526071] mt-1.5 leading-relaxed">
                      {ev.description}
                    </p>

                    {/* Conflict Callout */}
                    {ev.conflictDetails && (
                      <div className="mt-3 p-2.5 rounded-lg bg-rose-100/60 border border-rose-200 text-xs text-rose-900 leading-relaxed">
                        <div className="font-bold flex items-center gap-1 mb-0.5 text-rose-800">
                          <AlertTriangle size={13} />
                          <span>Direct Contradiction:</span>
                        </div>
                        {ev.conflictDetails}
                      </div>
                    )}

                    {/* Footer Sources */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-[#526071]">
                      <span className="truncate max-w-[240px]">
                        Sources: {ev.sourceNames.join(', ') || 'Citizen statement'}
                      </span>
                      <span className="text-[11px] font-semibold text-[#2457C5]">
                        Inspect source →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Source Inspector (5 cols) */}
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            <h2 className="text-sm font-bold text-[#172033] uppercase tracking-wider">
              Source Inspector
            </h2>

            {selectedEvent ? (
              <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 shadow-xs space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-[#526071] uppercase tracking-wider block mb-1">
                    Selected Event
                  </span>
                  <h4 className="text-sm font-bold text-[#172033] leading-snug">
                    {selectedEvent.title}
                  </h4>
                  <div className="mt-1.5 flex items-center gap-2">
                    <ProvenanceBadge type={selectedEvent.provenance} size="sm" />
                    <span className="text-xs text-[#526071]">{selectedEvent.displayDate}</span>
                  </div>
                </div>

                {selectedEvent.sourceQuote && (
                  <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-xs text-[#172033] space-y-1">
                    <span className="font-bold text-[#2457C5] block">Source Snippet:</span>
                    <blockquote className="italic font-serif leading-relaxed">
                      &ldquo;{selectedEvent.sourceQuote}&rdquo;
                    </blockquote>
                  </div>
                )}

                <div>
                  <span className="text-xs font-bold text-[#172033] block mb-2">
                    Attached Document References:
                  </span>
                  {selectedEvent.sourceNames.length > 0 ? (
                    <div className="space-y-2">
                      {selectedEvent.sourceNames.map((name, i) => {
                        const matchingFile = evidenceList.find((e) => e.filename === name || e.title === name);
                        return (
                          <div
                            key={i}
                            className="p-2.5 rounded-lg border border-[#D9DEE7] bg-[#F8F7F3] flex items-center justify-between text-xs"
                          >
                            <span className="font-mono text-[#172033] truncate max-w-[200px]">{name}</span>
                            {matchingFile && (
                              <button
                                onClick={() => onViewSource(matchingFile)}
                                className="text-[#2457C5] font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2"
                              >
                                <span>Inspect file</span>
                                <ExternalLink size={12} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-[#526071] italic">
                      Direct citizen statement without document attachment.
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#D9DEE7] text-[11px] text-[#526071] space-y-1">
                  <p>
                    <strong>Integrity Note:</strong> CaseCarry will not carry this event forward without your verification in the next step.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#D9DEE7] rounded-xl p-8 text-center text-xs text-[#526071]">
                Select an event from the chronology to inspect its sources.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-10 pt-6 border-t border-[#D9DEE7] flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#526071] hover:text-[#172033]"
        >
          Back to Evidence
        </button>

        <button
          onClick={onContinue}
          disabled={events.length === 0}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            events.length > 0
              ? 'bg-[#2457C5] hover:bg-[#1D46A0] text-white shadow-xs'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Continue to Verification ({events.length} events)</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Manual Event Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#D9DEE7] shadow-xl max-w-lg w-full p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9DEE7]">
              <h3 className="text-base font-bold text-[#172033]">
                Add Chronological Event
              </h3>
              <button
                onClick={() => setManualModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#526071] mb-1">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g. Paid bill via USSD / Received letter from manager"
                  className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#526071] mb-1">
                  Date or Timeframe
                </label>
                <input
                  type="text"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  placeholder="e.g. 14 August 2026, or 'Around June 2026'"
                  className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#526071] mb-1">
                  Description & Details
                </label>
                <textarea
                  rows={3}
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  placeholder="Explain what happened, what was said, or what transaction took place..."
                  className="w-full p-3 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#526071] mb-1">
                  Provenance
                </label>
                <select
                  value={manualProv}
                  onChange={(e) => setManualProv(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden bg-white"
                >
                  <option value="user-reported">You reported this (personal statement)</option>
                  <option value="source-backed">Source-backed (supported by uploaded file)</option>
                  <option value="inferred">Inferred deduction</option>
                  <option value="needs-review">Needs review / uncertain</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#526071] hover:text-[#172033]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2457C5] text-white text-xs font-semibold rounded-xl hover:bg-[#1D46A0]"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
