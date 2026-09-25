'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  MessageSquareOff,
  XCircle,
  Share2,
  HelpCircle,
  MoreHorizontal,
  RotateCcw,
  Building2,
  FileText
} from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '@/lib/i18n';

interface CaseEntryViewProps {
  selectedOutcome: string;
  providerName?: string;
  referenceNumber?: string;
  initialSummary?: string;
  onUpdateContext: (outcome: string, provider: string, refNum: string, summary: string) => void;
  onContinue: () => void;
  onBack: () => void;
  isDemoMode?: boolean;
  onSwitchToReal?: () => void;
  currentLanguage?: SupportedLanguage;
}

export function CaseEntryView({
  selectedOutcome,
  providerName = '',
  referenceNumber = '',
  initialSummary = '',
  onUpdateContext,
  onContinue,
  onBack,
  isDemoMode,
  onSwitchToReal,
  currentLanguage = 'en',
}: CaseEntryViewProps) {
  const [outcome, setOutcome] = useState<string>(selectedOutcome || '');
  const [provider, setProvider] = useState<string>(providerName);
  const [refNum, setRefNum] = useState<string>(referenceNumber);
  const [summary, setSummary] = useState<string>(initialSummary);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const OUTCOME_OPTIONS = [
    {
      id: 'no-response',
      title: t.outcomeNoResponse,
      description: t.outcomeNoResponseDesc,
      icon: MessageSquareOff,
    },
    {
      id: 'response-didnt-resolve',
      title: t.outcomeDidntResolve,
      description: t.outcomeDidntResolveDesc,
      icon: RotateCcw,
    },
    {
      id: 'rejected-or-closed',
      title: t.outcomeClosedWithoutReason,
      description: t.outcomeClosedWithoutReasonDesc,
      icon: XCircle,
    },
    {
      id: 'transferred-elsewhere',
      title: t.outcomeReferredLoop,
      description: t.outcomeReferredLoopDesc,
      icon: Share2,
    },
    {
      id: 'something-else',
      title: t.outcomeOther,
      description: t.outcomeOtherDesc,
      icon: MoreHorizontal,
    },
  ];

  const handleSelect = (id: string) => {
    setOutcome(id);
    onUpdateContext(id, provider, refNum, summary);
  };

  const handleFieldChange = (field: 'provider' | 'refNum' | 'summary', val: string) => {
    if (field === 'provider') setProvider(val);
    if (field === 'refNum') setRefNum(val);
    if (field === 'summary') setSummary(val);
    onUpdateContext(
      outcome,
      field === 'provider' ? val : provider,
      field === 'refNum' ? val : refNum,
      field === 'summary' ? val : summary
    );
  };

  const handleContinueClick = () => {
    if (!outcome) {
      handleSelect('response-didnt-resolve');
    }
    onContinue();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Demo Banner */}
      {isDemoMode && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
          <span>
            <strong>{t.fictionalDemo}:</strong> {t.demoNotice}
          </span>
          {onSwitchToReal && (
            <button
              onClick={onSwitchToReal}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-[11px] font-semibold text-amber-800"
            >
              {t.switchToRealCase}
            </button>
          )}
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
        <span>Step 1 of 8</span>
        <span>•</span>
        <span>{t.stepContext}</span>
      </div>

      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
        {t.entryTitle}
      </h1>
      <p className="text-sm sm:text-base text-[#526071] mt-2 leading-relaxed">
        {t.entrySubtitle}
      </p>

      {/* Options List */}
      <div className="mt-8 space-y-3" role="radiogroup" aria-label={t.outcomeQuestion}>
        {OUTCOME_OPTIONS.map((opt) => {
          const isSelected = outcome === opt.id;
          const Icon = opt.icon;

          return (
            <div
              key={opt.id}
              id={`outcome-opt-${opt.id}`}
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
                  <div className="text-xs sm:text-sm text-[#526071] mt-0.5 leading-relaxed">
                    {opt.description}
                  </div>
                </div>
              </div>

              <div className="shrink-0 mt-1">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? 'border-[#2457C5] bg-[#2457C5]'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional Context Details Form */}
      <div className="mt-8 pt-6 border-t border-[#D9DEE7] space-y-4">
        <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
          <Building2 size={16} className="text-[#2457C5]" />
          <span>{t.providerQuestion}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#526071] mb-1">
              {t.providerQuestion}
            </label>
            <input
              id="provider-name-input"
              type="text"
              value={provider}
              onChange={(e) => handleFieldChange('provider', e.target.value)}
              placeholder={t.providerPlaceholder}
              className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
            />
          </div>

          <div>
            <label htmlFor="reference-number-input" className="block text-xs font-semibold text-[#526071] mb-1">
              {t.refNumberQuestion}
            </label>
            <input
              id="reference-number-input"
              type="text"
              value={refNum}
              onChange={(e) => handleFieldChange('refNum', e.target.value)}
              placeholder={t.refNumberPlaceholder}
              className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label htmlFor="initial-summary-input" className="block text-xs font-semibold text-[#526071] mb-1">
            {t.summaryQuestion}
          </label>
          <textarea
            id="initial-summary-input"
            rows={2}
            value={summary}
            onChange={(e) => handleFieldChange('summary', e.target.value)}
            placeholder={t.summaryPlaceholder}
            className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-4 flex items-center justify-between">
        <button
          id="entry-back-btn"
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#526071] hover:text-[#172033] cursor-pointer"
        >
          {t.back}
        </button>

        <button
          id="entry-continue-btn"
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
