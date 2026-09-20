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
  Check
} from 'lucide-react';
import { Pathway } from '@/types/case';

interface PathwayGuidanceViewProps {
  pathways: Pathway[];
  selectedPathways: string[];
  onTogglePathway: (id: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function PathwayGuidanceView({
  pathways,
  selectedPathways,
  onTogglePathway,
  onContinue,
  onBack,
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
        <span>Step 6 of 6 (Optional)</span>
        <span>•</span>
        <span>Pathway Guidance</span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
        Where could you continue?
      </h1>
      <p className="text-sm sm:text-base text-[#526071] mt-2 leading-relaxed">
        CaseCarry can show potentially relevant pathways based on the information you’ve provided. Check the source and current requirements before relying on any pathway.
      </p>

      {/* Important Disclaimer Card */}
      <div className="mt-6 p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-[#A15C00] leading-relaxed">
        <AlertTriangle size={17} className="shrink-0 text-[#A15C00] mt-0.5" />
        <div>
          <strong className="text-[#172033]">Non-authoritative Guidance:</strong> These pathways are informational possibilities based on Nigerian public utility and consumer protection regulations. CaseCarry never gives binding legal counsel and never submits complaints autonomously.
        </div>
      </div>

      {/* Pathway Cards */}
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
                  <div className="text-xs text-[#526071] flex items-center gap-2 mt-0.5">
                    <span className="font-semibold text-[#172033]">{path.organization}</span>
                    <span>•</span>
                    <span>{path.jurisdiction}</span>
                  </div>
                </div>

                {/* Selection toggle */}
                <button
                  onClick={() => onTogglePathway(path.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shrink-0 self-start ${
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

              {/* Regulatory Source & Warning */}
              <div className="pt-3 border-t border-slate-100 text-[11px] text-[#526071] space-y-1">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span>
                    <strong>Official Source:</strong> {path.officialSource}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar size={11} /> Checked: {path.lastCheckedDate}
                  </span>
                </div>
                <p className="italic text-slate-500">{path.warning}</p>
              </div>
            </div>
          );
        })}
      </div>

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
          <span>Review Privacy & Sharing</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
