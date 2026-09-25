'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { AppStep, ORDERED_STEPS } from '@/types/case';
import { SupportedLanguage, TRANSLATIONS } from '@/lib/i18n';
import { StepDefinition } from '@/components/WorkflowStepper';

interface UseWorkflowNavigationOptions {
  currentLanguage: SupportedLanguage;
}

// Custom hook managing step state, progression tracking, and view transitions
export function useWorkflowNavigation({ currentLanguage }: UseWorkflowNavigationOptions) {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [, setMaxUnlockedStepIndex] = useState<number>(0);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Localized definitions for the 8 core workflow phases
  const stepLabels: StepDefinition[] = useMemo(
    () => [
      { key: 'entry', label: t.stepContext || 'Context', number: 1 },
      { key: 'evidence', label: t.stepEvidence || 'Evidence', number: 2 },
      { key: 'reconstruction', label: t.stepReconstruction || 'Reconstruction', number: 3 },
      { key: 'verification', label: t.stepVerification || 'Verification', number: 4 },
      { key: 'unresolved', label: t.stepUnresolved || 'Unresolved Issue', number: 5 },
      { key: 'pathway', label: t.stepPathways || 'Pathways', number: 6 },
      { key: 'privacy', label: t.stepPrivacy || 'Privacy', number: 7 },
      { key: 'bundle', label: t.stepBundle || 'Bundle', number: 8 },
    ],
    [t]
  );

  // Transition to a given step and update unlocked progress
  const goToStep = useCallback((step: AppStep) => {
    const idx = ORDERED_STEPS.indexOf(step);
    if (idx >= 0) {
      setMaxUnlockedStepIndex((prev) => Math.max(prev, idx));
    }
    setCurrentStep(step);
  }, []);

  // Unlock all steps (used when loading a demo or saved case)
  const unlockAllSteps = useCallback(() => {
    setMaxUnlockedStepIndex(ORDERED_STEPS.length - 1);
  }, []);

  // Reset unlocked progress (used when starting fresh)
  const resetProgress = useCallback(() => {
    setMaxUnlockedStepIndex(0);
  }, []);

  // Guarded smooth scroll to top on step changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      try {
        window.scrollTo(0, 0);
      } catch {
        // Ignore restricted iframe scroll environments
      }
    }
  }, [currentStep]);

  const showWorkflowStepper = currentStep !== 'landing' && currentStep !== 'export';

  return {
    currentStep,
    setCurrentStep,
    goToStep,
    unlockAllSteps,
    resetProgress,
    stepLabels,
    showWorkflowStepper,
  };
}
