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
  ShieldAlert
} from 'lucide-react';
import { CaseEvent, EvidenceFile } from '@/types/case';
import { ProvenanceBadge } from './ProvenanceBadge';

interface ReconstructionViewProps {
  events: CaseEvent[];
  evidenceList: EvidenceFile[];
  onViewSource: (file: EvidenceFile) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function ReconstructionView({
  events,
  evidenceList,
  onViewSource,
  onContinue,
  onBack,
}: ReconstructionViewProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(events[0]?.id || null);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

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
        <span>Step 3 of 6</span>
        <span>•</span>
        <span>Reconstruction & Provenance</span>
      </div>

      {/* Heading */}
      <div className="max-w-2xl mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
          Here’s what we found
        </h1>
        <p className="text-sm sm:text-base text-[#526071] mt-2 leading-relaxed">
          CaseCarry created a draft record from the information you provided. Review the source-aware chronology before continuing.
        </p>
      </div>

      {/* Essential Trust Banner */}
      <div className="p-4 mb-6 bg-white border border-[#D9DEE7] rounded-xl flex items-start gap-3 shadow-xs">
        <Info size={18} className="text-[#2457C5] shrink-0 mt-0.5" />
        <div className="text-xs text-[#526071] leading-relaxed">
          <strong className="text-[#172033]">Provenance Guarantee:</strong> Every factual claim cites its origin. Documented facts are marked <strong className="text-[#18794E]">Source-backed</strong>, personal statements are marked <strong className="text-[#A15C00]">You said this</strong>, and contradictions are flagged as <strong className="text-[#A33A3A]">Sources conflict</strong> without taking sides.
        </div>
      </div>

      {/* Split layout: Chronology (Left) + Source Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Event Chronology (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#172033] uppercase tracking-wider">
              Chronology ({events.length} Events Detected)
            </h2>
            <span className="text-xs text-[#526071]">Select event to view source</span>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#D9DEE7]">
            {events.map((ev, idx) => {
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

                  {/* Conflict Callout if present */}
                  {ev.conflictDetails && (
                    <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-[#A33A3A] space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle size={14} />
                        <span>Contradiction between sources</span>
                      </div>
                      <p className="leading-relaxed">{ev.conflictDetails}</p>
                    </div>
                  )}

                  {/* Source citations */}
                  {ev.sourceNames.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-[#526071] flex-wrap">
                        <span className="font-semibold text-slate-400">Source:</span>
                        {ev.sourceNames.map((name, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-[#172033] font-medium border border-slate-200"
                          >
                            <FileText size={11} />
                            {name}
                          </span>
                        ))}
                      </div>

                      {/* Quick view button */}
                      <span className="text-[#2457C5] font-semibold hover:underline inline-flex items-center gap-1">
                        Inspect source
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Source Inspection Panel (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9DEE7]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#526071] flex items-center gap-1.5">
                <FileText size={14} className="text-[#2457C5]" />
                <span>Source Provenance Inspector</span>
              </div>
              <span className="text-[11px] font-semibold text-[#18794E]">Verified</span>
            </div>

            {selectedEvent ? (
              <div className="mt-4 space-y-4">
                <div>
                  <span className="text-xs text-[#526071]">Selected Event</span>
                  <h4 className="text-sm font-bold text-[#172033] mt-0.5">
                    {selectedEvent.title}
                  </h4>
                  <div className="mt-1.5 flex items-center gap-2">
                    <ProvenanceBadge type={selectedEvent.provenance} size="sm" />
                    <span className="text-xs text-[#526071]">{selectedEvent.displayDate}</span>
                  </div>
                </div>

                {/* Sources list */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#172033] block">
                    Associated Artifacts ({selectedEvent.sourceIds.length})
                  </span>

                  {selectedEvent.sourceIds.length === 0 ? (
                    <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs text-[#A15C00]">
                      This event is based on citizen testimony without an external document file. It remains accurately labeled as <strong>You said this</strong>.
                    </div>
                  ) : (
                    selectedEvent.sourceIds.map((sid) => {
                      const file = evidenceList.find((f) => f.id === sid);
                      if (!file) return null;

                      return (
                        <div
                          key={file.id}
                          className="p-3 bg-slate-50 border border-[#D9DEE7] rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#172033] truncate max-w-[200px]">
                              {file.title}
                            </span>
                            <span className="text-[10px] uppercase bg-white px-1.5 py-0.5 rounded border border-[#D9DEE7] font-semibold text-[#526071]">
                              {file.type}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#526071] line-clamp-2">
                            {file.contentSummary}
                          </p>

                          <button
                            onClick={() => onViewSource(file)}
                            className="w-full py-1.5 px-2 bg-white hover:bg-slate-100 border border-[#D9DEE7] rounded text-xs font-semibold text-[#2457C5] inline-flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Eye size={12} />
                            <span>Open Full Document Excerpt</span>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#526071]">
                Tap any event on the left to inspect its sources.
              </div>
            )}
          </div>

          {/* Citizen Verification Note */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-[#2457C5] space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 size={15} />
              <span>Next Step: Your Review & Verification</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              In the next step, you can edit dates, add sources, delete any incorrect event, or mark claims as disputed.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-10 pt-4 border-t border-[#D9DEE7] flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl border border-[#D9DEE7] text-sm font-semibold text-[#526071] hover:text-[#172033] bg-white hover:bg-slate-50 transition-colors"
        >
          Back to Evidence
        </button>

        <button
          onClick={onContinue}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#2457C5] hover:bg-[#1D46A0] text-white shadow-xs transition-colors"
        >
          <span>Check & Verify Record</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
