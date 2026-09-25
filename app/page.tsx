'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { WorkflowStepper } from '@/components/WorkflowStepper';
import { CivicFooter } from '@/components/CivicFooter';
import { LandingView } from '@/components/LandingView';
import { CaseEntryView } from '@/components/CaseEntryView';
import { EvidenceCollectionView } from '@/components/EvidenceCollectionView';
import { ReconstructionView } from '@/components/ReconstructionView';
import { VerificationView } from '@/components/VerificationView';
import { UnresolvedIssueView } from '@/components/UnresolvedIssueView';
import { PathwayGuidanceView } from '@/components/PathwayGuidanceView';
import { PrivacyReviewView } from '@/components/PrivacyReviewView';
import { CarryForwardBundleView } from '@/components/CarryForwardBundleView';
import { ExportView } from '@/components/ExportView';
import { SourceViewerModal } from '@/components/SourceViewerModal';
import { SupportedLanguage } from '@/lib/i18n';
import { useCaseManager } from '@/hooks/useCaseManager';
import { useWorkflowNavigation } from '@/hooks/useWorkflowNavigation';
import { CaseRecord } from '@/types/case';

export default function Home() {
  // UI Accessibility Preferences
  const [lowBandwidth, setLowBandwidth] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  // Step and View Navigation Hook
  const {
    currentStep,
    setCurrentStep,
    goToStep,
    unlockAllSteps,
    resetProgress,
    stepLabels,
    showWorkflowStepper,
  } = useWorkflowNavigation({ currentLanguage });

  // Core Case State, Persisting Logic, and Action Handlers Hook
  const caseManager = useCaseManager({ currentStep });

  // Start fresh citizen complaint workflow
  const handleStartFreshCase = () => {
    caseManager.startFreshCase();
    resetProgress();
    setCurrentStep('entry');
  };

  // Preload structured demo scenario
  const handlePreloadDemo = () => {
    caseManager.preloadDemo();
    unlockAllSteps();
  };

  // Load existing case from local IndexedDB
  const handleLoadSavedCase = (record: CaseRecord) => {
    caseManager.loadSavedCase(record);
    unlockAllSteps();
    setCurrentStep('bundle');
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F8F7F3] text-[#172033] ${
        lowBandwidth ? 'font-sans' : ''
      }`}
    >
      {/* Universal Header */}
      <Header
        lowBandwidth={lowBandwidth}
        onToggleLowBandwidth={() => setLowBandwidth(!lowBandwidth)}
        currentLanguage={currentLanguage}
        onChangeLanguage={setCurrentLanguage}
        onGoHome={() => setCurrentStep('landing')}
        onStartCase={handleStartFreshCase}
        onLoadSampleCase={() => {
          handlePreloadDemo();
          setCurrentStep('reconstruction');
        }}
        onSelectCase={handleLoadSavedCase}
        activeStep={currentStep}
      />

      {/* Workflow Stepper Navigation Bar */}
      {showWorkflowStepper && (
        <WorkflowStepper
          steps={stepLabels}
          currentStep={currentStep}
          onSelectStep={goToStep}
        />
      )}

      {/* Main Screen Views */}
      <main className="grow">
        {/* Step 0: Landing / Overview */}
        {currentStep === 'landing' && (
          <LandingView
            onStartCase={handleStartFreshCase}
            onExploreSampleCase={() => {
              handlePreloadDemo();
              goToStep('reconstruction');
            }}
            currentLanguage={currentLanguage}
          />
        )}

        {/* Step 1: Initial Context & First Report Outcome */}
        {currentStep === 'entry' && (
          <CaseEntryView
            selectedOutcome={caseManager.selectedOutcome}
            providerName={caseManager.provider}
            referenceNumber={caseManager.referenceNumber}
            initialSummary={caseManager.initialSummary}
            onUpdateContext={caseManager.updateContext}
            onContinue={() => goToStep('evidence')}
            onBack={() => goToStep('landing')}
            isDemoMode={caseManager.isDemoMode}
            onSwitchToReal={handleStartFreshCase}
            currentLanguage={currentLanguage}
          />
        )}

        {/* Step 2: Evidence Files Ingestion & Redaction */}
        {currentStep === 'evidence' && (
          <EvidenceCollectionView
            evidenceList={caseManager.evidenceList}
            onAddEvidence={caseManager.addEvidence}
            onRemoveEvidence={caseManager.removeEvidence}
            onTogglePrivacy={caseManager.toggleEvidencePrivacy}
            onViewSource={(file) => caseManager.setViewingSource(file)}
            onLoadDemoFiles={handlePreloadDemo}
            onContinue={() => goToStep('reconstruction')}
            onBack={() => goToStep('entry')}
            lowBandwidth={lowBandwidth}
            isDemoMode={caseManager.isDemoMode}
            currentLanguage={currentLanguage}
          />
        )}

        {/* Step 3: Chronology Reconstruction */}
        {currentStep === 'reconstruction' && (
          <ReconstructionView
            events={caseManager.events}
            evidenceList={caseManager.evidenceList}
            contradictions={caseManager.contradictions}
            missingInformation={caseManager.missingInformation}
            caseTitle={caseManager.caseTitle}
            provider={caseManager.provider}
            firstReportOutcome={caseManager.selectedOutcome}
            userDescription={caseManager.initialSummary}
            referenceNumber={caseManager.referenceNumber}
            onUpdateReconstruction={caseManager.updateReconstruction}
            onAddCustomEvent={caseManager.addCustomEvent}
            onViewSource={(file) => caseManager.setViewingSource(file)}
            onContinue={() => goToStep('verification')}
            onBack={() => goToStep('evidence')}
            isDemoMode={caseManager.isDemoMode}
            currentLanguage={currentLanguage}
          />
        )}

        {/* Step 4: Verification & Provenance Confirmation */}
        {currentStep === 'verification' && (
          <VerificationView
            events={caseManager.events}
            evidenceList={caseManager.evidenceList}
            onUpdateEvent={caseManager.updateEvent}
            onDeleteEvent={caseManager.deleteEvent}
            onAddCustomEvent={caseManager.addCustomEvent}
            onVerifyAllSourceBacked={caseManager.verifyAllSourceBacked}
            onContinue={() => goToStep('unresolved')}
            onBack={() => goToStep('reconstruction')}
            isDemoMode={caseManager.isDemoMode}
            verificationReviewed={caseManager.verificationReviewed}
            onToggleVerificationReviewed={caseManager.setVerificationReviewed}
            currentLanguage={currentLanguage}
          />
        )}

        {/* Step 5: Unresolved Issue Definition */}
        {currentStep === 'unresolved' && (
          <UnresolvedIssueView
            unresolved={caseManager.unresolved}
            onUpdateUnresolved={caseManager.setUnresolved}
            onContinue={() => goToStep('pathway')}
            onBack={() => goToStep('verification')}
            isDemoMode={caseManager.isDemoMode}
            currentLanguage={currentLanguage}
          />
        )}

        {/* Step 6: Escalation Pathway Guidance */}
        {currentStep === 'pathway' && (
          <PathwayGuidanceView
            pathways={caseManager.pathways}
            selectedPathways={caseManager.selectedPathways}
            extractedFacts={caseManager.extractedFacts}
            safetyAlert={caseManager.safetyAlert}
            discoverySource={caseManager.discoverySource}
            caseInput={caseManager.pathwayDiscoveryInput}
            onUpdatePathways={caseManager.updatePathways}
            onTogglePathway={caseManager.togglePathway}
            onUpdatePathwayStatus={caseManager.updatePathwayStatus}
            onAddCustomPathway={caseManager.addCustomPathway}
            onContinue={() => goToStep('privacy')}
            onSkip={() => goToStep('privacy')}
            onBack={() => goToStep('unresolved')}
            isDemoMode={caseManager.isDemoMode}
            currentLanguage={currentLanguage}
          />
        )}

        {/* Step 7: Privacy Review & Redaction Finalization */}
        {currentStep === 'privacy' && (
          <PrivacyReviewView
            evidenceList={caseManager.evidenceList}
            onUpdateEvidencePrivacy={caseManager.updateEvidencePrivacy}
            onRemoveEvidence={caseManager.removeEvidence}
            onViewSource={(file) => caseManager.setViewingSource(file)}
            onApproveAndCreateBundle={() => goToStep('bundle')}
            onBack={() => goToStep('pathway')}
            currentLanguage={currentLanguage}
          />
        )}

        {/* Step 8: Carry-Forward Structured Bundle */}
        {currentStep === 'bundle' && (
          <CarryForwardBundleView
            caseData={caseManager.currentCaseRecord}
            onContinueToExport={() => goToStep('export')}
            onBack={() => goToStep('privacy')}
            currentLanguage={currentLanguage}
          />
        )}

        {/* Step 9: Export & Hand-off Packages */}
        {currentStep === 'export' && (
          <ExportView
            caseData={caseManager.currentCaseRecord}
            onBackToBundle={() => goToStep('bundle')}
            onStartAnotherCase={handleStartFreshCase}
            onViewCase={() => goToStep('bundle')}
            onPreservePrivately={caseManager.preservePrivately}
            onGoToVerification={() => goToStep('verification')}
            currentLanguage={currentLanguage}
          />
        )}
      </main>

      {/* Source Document Inspector Modal */}
      {caseManager.viewingSource && (
        <SourceViewerModal
          file={caseManager.viewingSource}
          onClose={() => caseManager.setViewingSource(null)}
          onTogglePrivacy={caseManager.toggleEvidencePrivacy}
        />
      )}

      {/* Civic Sovereignty Footer */}
      <CivicFooter />
    </div>
  );
}
