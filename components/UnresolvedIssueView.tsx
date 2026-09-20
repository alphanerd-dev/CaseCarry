'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, HelpCircle, CheckCircle2, MessageSquare, Target } from 'lucide-react';
import { UnresolvedIssue } from '@/types/case';

interface UnresolvedIssueViewProps {
  unresolved: UnresolvedIssue;
  onUpdateUnresolved: (updated: UnresolvedIssue) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function UnresolvedIssueView({
  unresolved,
  onUpdateUnresolved,
  onContinue,
  onBack,
}: UnresolvedIssueViewProps) {
  const [formData, setFormData] = useState<UnresolvedIssue>(unresolved);

  const handleChange = (field: keyof UnresolvedIssue, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdateUnresolved(updated);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033] mb-6 p-1 rounded-md transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Verification</span>
      </button>

      {/* Progress pill */}
      <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2457C5] text-xs font-semibold border border-blue-100">
        <span>Step 5 of 6</span>
        <span>•</span>
        <span>Unresolved Issue Definition</span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
        What remains unresolved?
      </h1>
      <p className="text-sm sm:text-base text-[#526071] mt-2 leading-relaxed">
        This is the part another person or caseworker needs to understand first. Tell it in your own words — no legal jargon required.
      </p>

      {/* Form Fields */}
      <div className="mt-8 space-y-6">
        {/* Core Field: The problem that still needs to be resolved */}
        <div className="bg-white border border-[#2457C5]/50 ring-1 ring-[#2457C5]/30 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-[#172033] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2457C5]" />
              The problem that still needs to be resolved <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-[#2457C5] font-semibold">Primary Focus</span>
          </div>
          <p className="text-xs text-[#526071]">
            Explain what is broken, incorrect, or unpaid today.
          </p>
          <textarea
            rows={4}
            required
            value={formData.problem}
            onChange={(e) => handleChange('problem', e.target.value)}
            placeholder="e.g. IBEDC charged arbitrary estimated bills despite having a working meter. The ₦64,438.50 payment made in August was not credited..."
            className="w-full p-3 border border-[#D9DEE7] rounded-lg text-sm text-[#172033] focus:border-[#2457C5] focus:ring-1 focus:ring-[#2457C5] focus:outline-hidden"
          />
        </div>

        {/* Optional field 1: What have you already tried? */}
        <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 shadow-xs space-y-2">
          <label className="text-xs sm:text-sm font-bold text-[#172033] block">
            What have you already tried? <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <p className="text-xs text-[#526071]">
            Prior letters, payments, visits, or reference numbers.
          </p>
          <textarea
            rows={3}
            value={formData.alreadyTried}
            onChange={(e) => handleChange('alreadyTried', e.target.value)}
            placeholder="e.g. Paid July bill via USSD, sent dispute email on 14 August (CCU-12345), and followed up on WhatsApp..."
            className="w-full p-3 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
          />
        </div>

        {/* Optional field 2: What response did you receive? */}
        <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 shadow-xs space-y-2">
          <label className="text-xs sm:text-sm font-bold text-[#172033] block">
            What response did you receive? <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <p className="text-xs text-[#526071]">
            What did the organization say or do?
          </p>
          <textarea
            rows={3}
            value={formData.responseReceived}
            onChange={(e) => handleChange('responseReceived', e.target.value)}
            placeholder="e.g. IBEDC claimed in a letter dated Sept 3 that the case was resolved and adjusted, but on WhatsApp they said it's still under review..."
            className="w-full p-3 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
          />
        </div>

        {/* Optional field 3: What would resolution look like? */}
        <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 shadow-xs space-y-2">
          <label className="text-xs sm:text-sm font-bold text-[#172033] block">
            What would resolution look like? <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <p className="text-xs text-[#526071]">
            What outcome would fairly resolve this dispute?
          </p>
          <textarea
            rows={3}
            value={formData.resolutionVision}
            onChange={(e) => handleChange('resolutionVision', e.target.value)}
            placeholder="e.g. 1. Credit the ₦64,438.50 payment. 2. Cancel excessive estimated charges. 3. Physically inspect the meter..."
            className="w-full p-3 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
          />
        </div>

        {/* Optional field 4: What action are you asking for now? */}
        <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 shadow-xs space-y-2">
          <label className="text-xs sm:text-sm font-bold text-[#172033] block">
            What action are you asking for now? <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <p className="text-xs text-[#526071]">
            What do you want the next institution, advocate, or caseworker to do?
          </p>
          <textarea
            rows={3}
            value={formData.requestedAction}
            onChange={(e) => handleChange('requestedAction', e.target.value)}
            placeholder="e.g. Intervene with IBEDC to enforce meter inspection and halt any disconnection notice..."
            className="w-full p-3 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
          />
        </div>
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
          disabled={!formData.problem.trim()}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
            formData.problem.trim()
              ? 'bg-[#2457C5] hover:bg-[#1D46A0] text-white shadow-xs'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Pathway Guidance</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
