'use client';

import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  AlertTriangle,
  Building2,
  Scale,
  FileCheck2,
  Calendar,
  Check,
  SkipForward,
  Info
} from 'lucide-react';
import { Pathway } from '@/types/case';

interface PathwayGuidanceViewProps {
  pathways: Pathway[];
  selectedPathways: string[];
  onTogglePathway: (id: string) => void;
  onContinue: () => void;
  onSkip: () => void;
  onBack: () => void;
  isDemoMode?: boolean;
}

export function PathwayGuidanceView({
  pathways,
  selectedPathways,
  onTogglePathway,
  onContinue,
  onSkip,
  onBack,
  isDemoMode,
}: PathwayGuidanceViewProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033] mb-6 p-1 rounded-md transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Unresolved Issue</span>
      </button>

      {/* Progress pill */}
      <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2457C5] text-xs font-semibold border border-blue-100">
        <span>Step 6 of 8 (Optional)</span>
        <span>•</span>
        <span>Relevant Next Pathways</span>
      </div>

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
            Where could you carry this case?
          </h1>
          <p className="text-sm sm:text-base text-[#526071] mt-2 leading-relaxed">
            Based on the current regulatory information available, these pathways may be relevant. CaseCarry is a case continuity tool, not an escalation router — selecting a pathway is optional.
          </p>
        </div>

        {/* Skip button right at the top */}
        <button
          onClick={onSkip}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033] hover:bg-slate-100 rounded-lg border border-[#D9DEE7] shrink-0 self-start"
        >
          <SkipForward size={14} />
          <span>Skip pathway guidance</span>
        </button>
      </div>

      {/* Important Non-Authoritative Guidance Card */}
      <div className="mt-6 p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-[#A15C00] leading-relaxed">
        <AlertTriangle size={17} className="shrink-0 text-[#A15C00] mt-0.5" />
        <div>
          <strong className="text-[#172033]">Informational Attribution:</strong> Based on the current regulatory information available, these pathways may be relevant. CaseCarry does not provide binding legal counsel, make decisions for you, or automatically submit complaints. Always verify current operating procedures.
        </div>
      </div>

      {/* Pathway Cards List */}
      <div className="mt-8 space-y-5">
        {pathways.map((path) => {
          const isSelected = selectedPathways.includes(path.id);

          return (
            <div
              key={path.id}
              className={`p-5 bg-white border rounded-xl shadow-xs transition-all space-y-4 ${
                isSelected
                  ? 'border-[#2457C5] ring-1 ring-[#2457C5]'
                  : 'border-[#D9DEE7] hover:border-slate-300'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-[#2457C5] text-[11px] font-bold mb-1">
                    <span>May be relevant</span>
                  </div>
                  <h3 className="text-base font-bold text-[#172033]">{path.name}</h3>
                  <div className="text-xs text-[#526071] flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="font-semibold text-[#172033]">{path.organization}</span>
                    <span>•</span>
                    <span>{path.jurisdiction}</span>
                    {path.statusNotes && (
                      <>
                        <span>•</span>
                        <span className="text-[#18794E] font-medium">{path.statusNotes}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Selection toggle */}
                <button
                  onClick={() => onTogglePathway(path.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shrink-0 self-start ${
                    isSelected
                      ? 'bg-[#2457C5] text-white'
                      : 'bg-slate-100 text-[#526071] hover:bg-slate-200'
                  }`}
                >
                  <Check size={13} />
                  <span>{isSelected ? 'Referenced in Bundle' : 'Include as reference'}</span>
                </button>
              </div>

              {/* Why Relevant */}
              <div className="text-xs sm:text-sm text-[#172033] bg-[#F8F7F3] p-3.5 rounded-lg border border-[#D9DEE7]">
                <strong className="block text-xs font-bold text-[#526071] uppercase tracking-wider mb-1">
                  Why this may be relevant
                </strong>
                <p className="leading-relaxed">{path.whyRelevant}</p>
              </div>

              {/* Conditions & Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-bold text-[#526071] block mb-1">Eligibility Criteria</span>
                  <p className="text-[#172033]">{path.eligibility}</p>
                </div>

                <div>
                  <span className="font-bold text-[#526071] block mb-1">Documents to Carry</span>
                  <ul className="list-disc list-inside text-[#172033] space-y-0.5">
                    {path.requiredDocuments.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* What CaseCarry Does NOT Know (Section 18) */}
              {path.whatWeDontKnow && (
                <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-xs text-[#A15C00] space-y-0.5">
                  <span className="font-bold text-amber-900 block flex items-center gap-1">
                    <Info size={12} /> What CaseCarry does NOT know:
                  </span>
                  <p className="text-amber-950 leading-relaxed">{path.whatWeDontKnow}</p>
                </div>
              )}

              {/* Source & Attribution Link */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-[#526071]">
                <div className="flex items-center gap-1.5 truncate max-w-sm">
                  <span className="font-semibold text-[#172033]">Authority:</span>
                  <span className="truncate">{path.officialSource}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-slate-400">
                    Checked: {path.lastCheckedDate}
                  </span>
                  {path.sourceUrl && (
                    <a
                      href={path.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2457C5] hover:underline"
                    >
                      <span>Official Source</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation and Skip Footer */}
      <div className="mt-10 pt-6 border-t border-[#D9DEE7] flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#526071] hover:text-[#172033]"
        >
          Back to Unresolved Issue
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={onSkip}
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-[#526071] hover:text-[#172033]"
          >
            Skip this step
          </button>

          <button
            onClick={onContinue}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-sm font-semibold rounded-xl shadow-xs transition-all"
          >
            <span>Continue to Privacy Review</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
