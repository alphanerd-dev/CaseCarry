'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { AppStep } from '@/types/case';

export interface StepDefinition {
  key: AppStep;
  label: string;
  number: number;
}

interface WorkflowStepperProps {
  steps: StepDefinition[];
  currentStep: AppStep;
  onSelectStep: (step: AppStep) => void;
}

// Interactive horizontal progress stepper for navigating case-building phases
export function WorkflowStepper({
  steps,
  currentStep,
  onSelectStep,
}: WorkflowStepperProps) {
  const currentIndex = steps.findIndex((item) => item.key === currentStep);

  return (
    <nav
      aria-label="Case Progress"
      className="bg-white border-b border-[#D9DEE7] py-2.5 px-3 sm:px-6 overflow-x-auto print:hidden"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-start sm:justify-between min-w-max gap-1.5 sm:gap-2 text-xs">
        {steps.map((s, idx) => {
          const isCurrent = currentStep === s.key;
          const isPassed = idx < currentIndex;

          return (
            <div key={s.key} className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                id={`stepper-nav-${s.key}-btn`}
                onClick={() => onSelectStep(s.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[34px] cursor-pointer ${
                  isCurrent
                    ? 'bg-[#2457C5] text-white shadow-xs'
                    : isPassed
                    ? 'text-[#18794E] hover:bg-emerald-50'
                    : 'text-[#526071] hover:text-[#172033] hover:bg-slate-50'
                }`}
              >
                {/* Step number badge or completed checkmark */}
                <span
                  className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold shrink-0 ${
                    isCurrent
                      ? 'bg-white text-[#2457C5]'
                      : isPassed
                      ? 'bg-[#18794E] text-white'
                      : 'bg-slate-200 text-[#526071]'
                  }`}
                >
                  {isPassed ? <Check size={10} /> : s.number}
                </span>
                <span className="whitespace-nowrap">{s.label}</span>
              </button>

              {/* Chevron separator */}
              {idx < steps.length - 1 && (
                <span className="text-slate-300 select-none">›</span>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
