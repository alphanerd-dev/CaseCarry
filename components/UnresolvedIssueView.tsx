'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  MessageSquare,
  Target,
  FileSpreadsheet,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { UnresolvedIssue } from '@/types/case';
import { SupportedLanguage, TRANSLATIONS } from '@/lib/i18n';

interface UnresolvedIssueViewProps {
  unresolved: UnresolvedIssue;
  onUpdateUnresolved: (updated: UnresolvedIssue) => void;
  onContinue: () => void;
  onBack: () => void;
  isDemoMode?: boolean;
  currentLanguage?: SupportedLanguage;
}

export function UnresolvedIssueView({
  unresolved,
  onUpdateUnresolved,
  onContinue,
  onBack,
  isDemoMode,
  currentLanguage = 'en',
}: UnresolvedIssueViewProps) {
  const [formData, setFormData] = useState<UnresolvedIssue>({
    problem: unresolved.problem || '',
    originalIssue: unresolved.originalIssue || '',
    whatWasRequested: unresolved.whatWasRequested || '',
    whatHappened: unresolved.whatHappened || '',
    responseReceived: unresolved.responseReceived || '',
    whatWasResolved: unresolved.whatWasResolved || '',
    whatWasNotResolved: unresolved.whatWasNotResolved || '',
    requestedAction: unresolved.requestedAction || '',
    resolutionVision: unresolved.resolutionVision || '',
    alreadyTried: unresolved.alreadyTried || '',
  });

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const handleChange = (field: keyof UnresolvedIssue, value: string) => {
    const updated = { ...formData, [field]: value };
    // If user types into whatWasNotResolved and problem is empty, sync them
    if (field === 'whatWasNotResolved' && !formData.problem) {
      updated.problem = value;
    }
    if (field === 'problem' && !formData.whatWasNotResolved) {
      updated.whatWasNotResolved = value;
    }
    setFormData(updated);
    onUpdateUnresolved(updated);
  };

  const hasCoreProblem = Boolean((formData.problem || '').trim()) || Boolean((formData.whatWasNotResolved || '').trim());

  const handleContinueClick = () => {
    if (!unresolved.problem.trim()) {
      onUpdateUnresolved({
        ...unresolved,
        problem: 'Dispute remains unresolved following initial report and provider response.',
      });
    }
    onContinue();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
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
        <span>Step 5 of 8</span>
        <span>•</span>
        <span>{t.stepUnresolved}</span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
        {t.unresolvedTitle}
      </h1>
      <p className="text-sm sm:text-base text-[#526071] mt-2 leading-relaxed">
        {t.unresolvedSubtitle}
      </p>

      {/* Distinction Callout: Original Dispute vs Current Problem */}
      <div className="mt-6 p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2 text-xs">
        <div className="font-bold text-[#2457C5] flex items-center gap-1.5">
          <Target size={15} />
          <span>Case Continuity Distinction: Original Dispute vs. Current Problem</span>
        </div>
        <p className="text-[#172033] leading-relaxed">
          CaseCarry makes a crucial distinction:
          <br />
          <strong className="text-[#526071]">Original issue:</strong> What went wrong in the first place (e.g., incorrect billing or lack of service).
          <br />
          <strong className="text-[#2457C5]">Current unresolved issue:</strong> What occurred <em>after</em> you complained (e.g., the company claimed in writing to have resolved the bill, but the next bill still demanded the money and threatened disconnection).
        </p>
      </div>

      {/* Structured Resolution Framework */}
      <div className="mt-8 space-y-6">
        {/* Field 1: Original Issue */}
        <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 shadow-xs space-y-2">
          <label className="text-sm font-bold text-[#172033] block">
            1. What was the original issue?
          </label>
          <p className="text-xs text-[#526071]">
            What problem did you initially report to the organization?
          </p>
          <textarea
            rows={2}
            value={formData.originalIssue}
            onChange={(e) => handleChange('originalIssue', e.target.value)}
            placeholder="e.g. IBEDC charged an arbitrary estimated bill of ₦64,438.50 for July despite a functional meter being installed."
            className="w-full p-3 border border-[#D9DEE7] rounded-lg text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
          />
        </div>

        {/* Field 2: What Action Was Requested & Tried */}
        <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 shadow-xs space-y-2">
          <label className="text-sm font-bold text-[#172033] block">
            2. What action was requested and what did you try?
          </label>
          <p className="text-xs text-[#526071]">
            Did you submit emails, pay bills, make phone calls, or visit an office?
          </p>
          <textarea
            rows={2}
            value={formData.alreadyTried}
            onChange={(e) => handleChange('alreadyTried', e.target.value)}
            placeholder="e.g. Paid July bill in full via USSD to prevent disconnection; submitted formal dispute email on 14 Aug (CCU-12345); followed up via WhatsApp."
            className="w-full p-3 border border-[#D9DEE7] rounded-lg text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
          />
        </div>

        {/* Field 3: What Response Was Received */}
        <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 shadow-xs space-y-2">
          <label className="text-sm font-bold text-[#172033] block">
            3. What response was received?
          </label>
          <p className="text-xs text-[#526071]">
            What letters, reference numbers, promises, or conflicting statements were given?
          </p>
          <textarea
            rows={2}
            value={formData.responseReceived}
            onChange={(e) => handleChange('responseReceived', e.target.value)}
            placeholder="e.g. IBEDC issued a closure letter on 03 Sept claiming adjustments were effected, but on 07 Sept WhatsApp support stated the ticket remains under review."
            className="w-full p-3 border border-[#D9DEE7] rounded-lg text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
          />
        </div>

        {/* Field 4 & 5: What Was Resolved vs What Was NOT Resolved (Side by Side) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Resolved */}
          <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-xs space-y-2">
            <label className="text-xs sm:text-sm font-bold text-[#18794E] flex items-center gap-1.5">
              <CheckCircle2 size={15} />
              <span>4. What was resolved (if anything)?</span>
            </label>
            <p className="text-[11px] text-[#526071]">
              Any partial progress or acknowledgement made.
            </p>
            <textarea
              rows={3}
              value={formData.whatWasResolved}
              onChange={(e) => handleChange('whatWasResolved', e.target.value)}
              placeholder="e.g. Complaint was acknowledged and Reference CCU-12345 was assigned."
              className="w-full p-2.5 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#18794E] focus:outline-hidden"
            />
          </div>

          {/* NOT Resolved */}
          <div className="bg-white border border-rose-300 ring-1 ring-rose-200 rounded-xl p-4 shadow-xs space-y-2">
            <label className="text-xs sm:text-sm font-bold text-rose-700 flex items-center gap-1.5">
              <AlertCircle size={15} />
              <span>5. What was NOT resolved? <span className="text-rose-500">*</span></span>
            </label>
            <p className="text-[11px] text-[#526071]">
              The core failure or broken state today.
            </p>
            <textarea
              rows={3}
              required
              value={formData.problem}
              onChange={(e) => handleChange('problem', e.target.value)}
              placeholder="e.g. The ₦64,438.50 payment was never credited; excessive estimated billing continues; disconnection threat is active."
              className="w-full p-2.5 border border-rose-300 rounded-lg text-xs sm:text-sm text-[#172033] focus:border-rose-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Field 6: Requested Action from Recipient */}
        <div className="bg-white border border-[#2457C5]/40 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-[#172033] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2457C5]" />
              6. What action do you want from the next recipient?
            </label>
            <span className="text-xs text-[#2457C5] font-semibold">Outcome Goal</span>
          </div>
          <p className="text-xs text-[#526071]">
            What specific action or intervention are you requesting when you present this record?
          </p>
          <textarea
            rows={3}
            value={formData.requestedAction}
            onChange={(e) => handleChange('requestedAction', e.target.value)}
            placeholder="e.g. 1. Reconcile and credit the payment. 2. Reverse estimated billing. 3. Physically inspect the meter. 4. Halt disconnection."
            className="w-full p-3 border border-[#D9DEE7] rounded-lg text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-10 pt-6 border-t border-[#D9DEE7] flex items-center justify-between">
        <button
          id="unresolved-back-btn"
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#526071] hover:text-[#172033] cursor-pointer"
        >
          {t.back}
        </button>

        <button
          id="unresolved-continue-btn"
          type="button"
          onClick={handleContinueClick}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#2457C5] hover:bg-[#1D46A0] text-white shadow-xs transition-all cursor-pointer"
        >
          <span>{t.continue}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
