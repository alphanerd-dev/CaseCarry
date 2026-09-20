'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, MessageSquareOff, XCircle, Share2, HelpCircle, MoreHorizontal, RotateCcw } from 'lucide-react';

interface CaseEntryViewProps {
  selectedOutcome: string;
  onSelectOutcome: (outcome: string) => void;
  onContinue: () => void;
  onBack: () => void;
  onPreloadDemo?: () => void;
}

const OUTCOME_OPTIONS = [
  {
    id: 'no-response',
    title: 'No response',
    description: 'I never received a response after submitting my complaint or report.',
    icon: MessageSquareOff,
  },
  {
    id: 'rejected-or-closed',
    title: 'Rejected or closed',
    description: 'My case was formally rejected or closed by the organization.',
    icon: XCircle,
  },
  {
    id: 'transferred-elsewhere',
    title: 'Transferred elsewhere',
    description: 'I was told to contact someone else, another desk, or another agency.',
    icon: Share2,
  },
  {
    id: 'response-didnt-resolve',
    title: 'Response didn’t resolve it',
    description: 'I received a response, letter, or promise, but the underlying problem remains.',
    icon: RotateCcw,
  },
  {
    id: 'something-else',
    title: 'Something else',
    description: 'A different situation occurred (e.g. repeated delays, lost files).',
    icon: MoreHorizontal,
  },
  {
    id: 'not-sure',
    title: 'I’m not sure',
    description: 'I am not certain about the current status or what the official outcome was.',
    icon: HelpCircle,
  },
];

export function CaseEntryView({
  selectedOutcome,
  onSelectOutcome,
  onContinue,
  onBack,
  onPreloadDemo,
}: CaseEntryViewProps) {
  const [outcome, setOutcome] = useState<string>(selectedOutcome || '');

  const handleSelect = (id: string) => {
    setOutcome(id);
    onSelectOutcome(id);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033] mb-6 p-1 rounded-md transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      {/* Progress pill */}
      <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2457C5] text-xs font-semibold border border-blue-100">
        <span>Step 1 of 6</span>
        <span>•</span>
        <span>Case Context</span>
      </div>

      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
        What happened after you first reported it?
      </h1>
      <p className="text-sm sm:text-base text-[#526071] mt-2 leading-relaxed">
        Before we organize your case, tell us what happened after your first report. You can correct anything later.
      </p>

      {/* Options List */}
      <div className="mt-8 space-y-3" role="radiogroup" aria-label="What happened after your first report">
        {OUTCOME_OPTIONS.map((opt) => {
          const isSelected = outcome === opt.id;
          const Icon = opt.icon;

          return (
            <div
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handleSelect(opt.id);
                }
              }}
              tabIndex={0}
              role="radio"
              aria-checked={isSelected}
              className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 select-none ${
                isSelected
                  ? 'border-[#2457C5] bg-blue-50/70 ring-1 ring-[#2457C5]'
                  : 'border-[#D9DEE7] bg-white hover:border-[#2457C5]/40 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-[#2457C5] text-white'
                      : 'bg-slate-100 text-[#526071]'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-base font-bold text-[#172033]">
                    {opt.title}
                  </div>
                  <p className="text-xs sm:text-sm text-[#526071] mt-0.5 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </div>

              {/* Radio Indicator */}
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-colors ${
                  isSelected
                    ? 'border-[#2457C5] bg-[#2457C5] text-white'
                    : 'border-[#D9DEE7] bg-white'
                }`}
              >
                {isSelected && <CheckCircle2 size={16} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Demo Preload Banner */}
      {onPreloadDemo && (
        <div className="mt-6 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-[#A15C00] flex items-center justify-between">
          <span>
            Demonstrating a real case? Select <strong>“Response didn’t resolve it”</strong> or load the sample dispute.
          </span>
          <button
            onClick={onPreloadDemo}
            className="px-2.5 py-1 bg-amber-200/70 hover:bg-amber-200 text-[#A15C00] font-bold rounded-lg shrink-0 ml-2"
          >
            Pre-fill Demo
          </button>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="mt-8 pt-4 border-t border-[#D9DEE7] flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl border border-[#D9DEE7] text-sm font-semibold text-[#526071] hover:text-[#172033] bg-white hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>

        <button
          onClick={onContinue}
          disabled={!outcome}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
            outcome
              ? 'bg-[#2457C5] hover:bg-[#1D46A0] text-white shadow-xs'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Continue</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
