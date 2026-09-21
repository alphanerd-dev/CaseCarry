'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
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
import {
  SAMPLE_CASE_RECORD,
  SAMPLE_EVIDENCE_FILES,
  SAMPLE_CASE_EVENTS,
  SAMPLE_UNRESOLVED_ISSUE,
  SAMPLE_PATHWAYS,
} from '@/lib/demoData';
import { CaseRecord, CaseEvent, EvidenceFile, UnresolvedIssue, Pathway } from '@/types/case';
import { saveDraftLocally, loadDraftLocally, saveCaseLocally } from '@/lib/storage';
import { SupportedLanguage } from '@/lib/i18n';
import { Check, ShieldCheck, Bookmark } from 'lucide-react';

export type AppStep =
  | 'landing'
  | 'entry'
  | 'evidence'
  | 'reconstruction'
  | 'verification'
  | 'unresolved'
  | 'pathway'
  | 'privacy'
  | 'bundle'
  | 'export';

const STEP_LABELS: { key: AppStep; label: string; number: number }[] = [
  { key: 'entry', label: 'Context', number: 1 },
  { key: 'evidence', label: 'Evidence', number: 2 },
  { key: 'reconstruction', label: 'Reconstruction', number: 3 },
  { key: 'verification', label: 'Verification', number: 4 },
  { key: 'unresolved', label: 'Unresolved Issue', number: 5 },
  { key: 'pathway', label: 'Pathways', number: 6 },
  { key: 'privacy', label: 'Privacy', number: 7 },
  { key: 'bundle', label: 'Bundle', number: 8 },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [lowBandwidth, setLowBandwidth] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  // Case State
  const [caseId, setCaseId] = useState<string>(() => `case-${Date.now()}`);
  const [caseTitle, setCaseTitle] = useState<string>('Unresolved Matter');
  const [citizenName, setCitizenName] = useState<string>('Citizen Complainant');
  const [provider, setProvider] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [initialSummary, setInitialSummary] = useState<string>('');
  const [selectedOutcome, setSelectedOutcome] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Evidence & Chronology
  const [evidenceList, setEvidenceList] = useState<EvidenceFile[]>([]);
  const [events, setEvents] = useState<CaseEvent[]>([]);
  const [contradictions, setContradictions] = useState<string[]>([]);
  const [missingInformation, setMissingInformation] = useState<string[]>([]);

  // Unresolved Issue
  const [unresolved, setUnresolved] = useState<UnresolvedIssue>({
    problem: '',
    originalIssue: '',
    whatWasRequested: '',
    whatHappened: '',
    responseReceived: '',
    whatWasResolved: '',
    whatWasNotResolved: '',
    resolutionVision: '',
    requestedAction: '',
    alreadyTried: '',
  });

  // Pathways
  const [pathways, setPathways] = useState<Pathway[]>(SAMPLE_PATHWAYS);
  const [selectedPathways, setSelectedPathways] = useState<string[]>([]);

  // Modal State for Source Inspector
  const [viewingSource, setViewingSource] = useState<EvidenceFile | null>(null);

  // Auto-Save Draft to Local Storage (IndexedDB with debounce)
  useEffect(() => {
    if (currentStep === 'landing' || isDemoMode) return;

    const currentRecord: CaseRecord = {
      id: caseId,
      title: caseTitle || 'Unresolved Case Record',
      provider: provider || 'Service Provider',
      accountReference: referenceNumber,
      citizenName: citizenName || 'Citizen',
      createdAt: new Date().toISOString().slice(0, 10),
      dateOpened: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      firstReportOutcome: selectedOutcome as any,
      events,
      evidence: evidenceList,
      unresolved,
      pathways,
      selectedPathways,
      contradictions,
      missingInformation,
      isDemo: false,
    };

    const timer = setTimeout(() => {
      saveDraftLocally(currentRecord, currentStep, isDemoMode).catch((e) => console.warn('Draft save error:', e));
    }, 600);

    return () => clearTimeout(timer);
  }, [
    caseId,
    caseTitle,
    provider,
    referenceNumber,
    citizenName,
    selectedOutcome,
    events,
    evidenceList,
    unresolved,
    pathways,
    selectedPathways,
    contradictions,
    missingInformation,
    currentStep,
    isDemoMode,
  ]);

  // Load sample case into state
  const handlePreloadDemo = () => {
    setIsDemoMode(true);
    setCaseId(SAMPLE_CASE_RECORD.id);
    setCaseTitle(SAMPLE_CASE_RECORD.title);
    setCitizenName(SAMPLE_CASE_RECORD.citizenName);
    setProvider(SAMPLE_CASE_RECORD.provider);
    setReferenceNumber(SAMPLE_CASE_RECORD.accountReference || '0456789123');
    setInitialSummary(
      'Disputed improper estimated electricity bill in July 2026. Received closure letter claiming adjustment, but subsequent bill ignored USSD payment and demanded excessive charges under disconnection threat.'
    );
    setSelectedOutcome('response-didnt-resolve');
    setEvidenceList(SAMPLE_EVIDENCE_FILES);
    setEvents(SAMPLE_CASE_EVENTS);
    setContradictions(SAMPLE_CASE_RECORD.contradictions || []);
    setMissingInformation(SAMPLE_CASE_RECORD.missingInformation || []);
    setUnresolved(SAMPLE_UNRESOLVED_ISSUE);
    setPathways(SAMPLE_PATHWAYS);
    setSelectedPathways(['ogserc-dispute-resolution', 'fccpc-nigeria']);
  };

  // Start fresh citizen case
  const handleStartFreshCase = () => {
    setIsDemoMode(false);
    setCaseId(`case-${Date.now()}`);
    setCaseTitle('Unresolved Complaint');
    setCitizenName('Citizen');
    setProvider('');
    setReferenceNumber('');
    setInitialSummary('');
    setSelectedOutcome('');
    setEvidenceList([]);
    setEvents([]);
    setContradictions([]);
    setMissingInformation([]);
    setUnresolved({
      problem: '',
      originalIssue: '',
      whatWasRequested: '',
      whatHappened: '',
      responseReceived: '',
      whatWasResolved: '',
      whatWasNotResolved: '',
      resolutionVision: '',
      requestedAction: '',
      alreadyTried: '',
    });
    setPathways(SAMPLE_PATHWAYS);
    setSelectedPathways([]);
    setCurrentStep('entry');
  };

  // Load a saved case from IndexedDB
  const handleLoadSavedCase = (savedRecord: CaseRecord) => {
    setIsDemoMode(Boolean(savedRecord.isDemo));
    setCaseId(savedRecord.id);
    setCaseTitle(savedRecord.title);
    setCitizenName(savedRecord.citizenName);
    setProvider(savedRecord.provider);
    setReferenceNumber(savedRecord.accountReference || '');
    setSelectedOutcome(savedRecord.firstReportOutcome || '');
    setEvidenceList(savedRecord.evidence || []);
    setEvents(savedRecord.events || []);
    setContradictions(savedRecord.contradictions || []);
    setMissingInformation(savedRecord.missingInformation || []);
    setUnresolved(savedRecord.unresolved);
    setPathways(savedRecord.pathways || SAMPLE_PATHWAYS);
    setSelectedPathways(savedRecord.selectedPathways || []);
    setCurrentStep('bundle');
  };

  // Full current case record
  const currentCaseRecord: CaseRecord = {
    id: caseId,
    title: caseTitle || (provider ? `Case with ${provider}` : 'Unresolved Case Record'),
    provider: provider || 'Service Provider',
    accountReference: referenceNumber,
    citizenName: citizenName || 'Citizen',
    createdAt: new Date().toISOString().slice(0, 10),
    dateOpened: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
    firstReportOutcome: selectedOutcome as any,
    events,
    evidence: evidenceList,
    unresolved,
    pathways,
    selectedPathways,
    contradictions,
    missingInformation,
    isDemo: isDemoMode,
  };

  // Evidence handlers
  const handleAddEvidence = (file: EvidenceFile) => {
    setEvidenceList((prev) => [file, ...prev]);
  };

  const handleRemoveEvidence = (id: string) => {
    setEvidenceList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleEvidencePrivacy = (id: string) => {
    setEvidenceList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = item.privacyStatus === 'included' ? 'private' : 'included';
          return { ...item, privacyStatus: next };
        }
        return item;
      })
    );
  };

  const handleUpdateEvidencePrivacy = (
    id: string,
    status: 'included' | 'private' | 'redacted'
  ) => {
    setEvidenceList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, privacyStatus: status } : item))
    );
  };

  // Chronology & Reconstruction handlers
  const handleUpdateReconstruction = (
    newEvents: CaseEvent[],
    newContradictions?: string[],
    newMissingInfo?: string[],
    unresolvedDraft?: Partial<UnresolvedIssue>
  ) => {
    setEvents(newEvents);
    if (newContradictions) setContradictions(newContradictions);
    if (newMissingInfo) setMissingInformation(newMissingInfo);
    if (unresolvedDraft) {
      setUnresolved((prev) => ({
        ...prev,
        ...unresolvedDraft,
        problem: unresolvedDraft.problem || prev.problem,
      }));
    }
  };

  const handleAddCustomEvent = (ev: CaseEvent) => {
    setEvents((prev) => [...prev, ev]);
  };

  const handleUpdateEvent = (updated: CaseEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleVerifyAllSourceBacked = () => {
    setEvents((prev) =>
      prev.map((e) => (e.provenance === 'source-backed' ? { ...e, verifiedByUser: true } : e))
    );
  };

  // Pathway toggle
  const handleTogglePathway = (id: string) => {
    setSelectedPathways((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Preserve privately to IndexedDB
  const handlePreservePrivately = async () => {
    await saveCaseLocally(currentCaseRecord);
  };

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const showWorkflowStepper = currentStep !== 'landing' && currentStep !== 'export';

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

      {/* Workflow Stepper Navigation */}
      {showWorkflowStepper && (
        <div className="bg-white border-b border-[#D9DEE7] py-2 px-4 sm:px-6 overflow-x-auto print:hidden">
          <div className="max-w-5xl mx-auto flex items-center justify-between min-w-[620px] gap-2 text-xs">
            {STEP_LABELS.map((s, idx) => {
              const isCurrent = currentStep === s.key;
              const currentIndex = STEP_LABELS.findIndex((item) => item.key === currentStep);
              const isPassed = idx < currentIndex;

              // Allow navigation to previous steps or current step
              const canNavigate = idx <= currentIndex || (idx === currentIndex + 1 && (evidenceList.length > 0 || isDemoMode));

              return (
                <div key={s.key} className="flex items-center gap-1.5 shrink-0">
                  <button
                    disabled={!canNavigate}
                    onClick={() => setCurrentStep(s.key)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-[#2457C5] text-white'
                        : isPassed
                        ? 'text-[#18794E] hover:bg-emerald-50'
                        : canNavigate
                        ? 'text-[#526071] hover:text-[#172033]'
                        : 'text-slate-300 cursor-not-allowed'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                        isCurrent
                          ? 'bg-white text-[#2457C5]'
                          : isPassed
                          ? 'bg-[#18794E] text-white'
                          : 'bg-slate-200 text-[#526071]'
                      }`}
                    >
                      {isPassed ? <Check size={10} /> : s.number}
                    </span>
                    <span>{s.label}</span>
                  </button>
                  {idx < STEP_LABELS.length - 1 && (
                    <span className="text-slate-300">›</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Screen Views */}
      <main className="grow">
        {currentStep === 'landing' && (
          <LandingView
            onStartCase={handleStartFreshCase}
            onExploreSampleCase={() => {
              handlePreloadDemo();
              setCurrentStep('reconstruction');
            }}
          />
        )}

        {currentStep === 'entry' && (
          <CaseEntryView
            selectedOutcome={selectedOutcome}
            providerName={provider}
            referenceNumber={referenceNumber}
            initialSummary={initialSummary}
            onUpdateContext={(outc, prov, refNum, summ) => {
              setSelectedOutcome(outc);
              setProvider(prov);
              setReferenceNumber(refNum);
              setInitialSummary(summ);
              if (prov && !caseTitle) {
                setCaseTitle(`Matter with ${prov}`);
              }
            }}
            onContinue={() => setCurrentStep('evidence')}
            onBack={() => setCurrentStep('landing')}
            isDemoMode={isDemoMode}
            onSwitchToReal={handleStartFreshCase}
          />
        )}

        {currentStep === 'evidence' && (
          <EvidenceCollectionView
            evidenceList={evidenceList}
            onAddEvidence={handleAddEvidence}
            onRemoveEvidence={handleRemoveEvidence}
            onTogglePrivacy={handleToggleEvidencePrivacy}
            onViewSource={(file) => setViewingSource(file)}
            onLoadDemoFiles={() => {
              handlePreloadDemo();
            }}
            onContinue={() => setCurrentStep('reconstruction')}
            onBack={() => setCurrentStep('entry')}
            lowBandwidth={lowBandwidth}
            isDemoMode={isDemoMode}
          />
        )}

        {currentStep === 'reconstruction' && (
          <ReconstructionView
            events={events}
            evidenceList={evidenceList}
            contradictions={contradictions}
            missingInformation={missingInformation}
            caseTitle={caseTitle}
            provider={provider}
            firstReportOutcome={selectedOutcome}
            userDescription={initialSummary}
            referenceNumber={referenceNumber}
            onUpdateReconstruction={handleUpdateReconstruction}
            onAddCustomEvent={handleAddCustomEvent}
            onViewSource={(file) => setViewingSource(file)}
            onContinue={() => setCurrentStep('verification')}
            onBack={() => setCurrentStep('evidence')}
            isDemoMode={isDemoMode}
          />
        )}

        {currentStep === 'verification' && (
          <VerificationView
            events={events}
            evidenceList={evidenceList}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            onAddCustomEvent={handleAddCustomEvent}
            onVerifyAllSourceBacked={handleVerifyAllSourceBacked}
            onContinue={() => setCurrentStep('unresolved')}
            onBack={() => setCurrentStep('reconstruction')}
            isDemoMode={isDemoMode}
          />
        )}

        {currentStep === 'unresolved' && (
          <UnresolvedIssueView
            unresolved={unresolved}
            onUpdateUnresolved={setUnresolved}
            onContinue={() => setCurrentStep('pathway')}
            onBack={() => setCurrentStep('verification')}
            isDemoMode={isDemoMode}
          />
        )}

        {currentStep === 'pathway' && (
          <PathwayGuidanceView
            pathways={pathways}
            selectedPathways={selectedPathways}
            onTogglePathway={handleTogglePathway}
            onContinue={() => setCurrentStep('privacy')}
            onSkip={() => setCurrentStep('privacy')}
            onBack={() => setCurrentStep('unresolved')}
            isDemoMode={isDemoMode}
          />
        )}

        {currentStep === 'privacy' && (
          <PrivacyReviewView
            evidenceList={evidenceList}
            onUpdateEvidencePrivacy={handleUpdateEvidencePrivacy}
            onRemoveEvidence={handleRemoveEvidence}
            onViewSource={(file) => setViewingSource(file)}
            onApproveAndCreateBundle={() => setCurrentStep('bundle')}
            onBack={() => setCurrentStep('pathway')}
          />
        )}

        {currentStep === 'bundle' && (
          <CarryForwardBundleView
            caseData={currentCaseRecord}
            onContinueToExport={() => setCurrentStep('export')}
            onBack={() => setCurrentStep('privacy')}
          />
        )}

        {currentStep === 'export' && (
          <ExportView
            caseData={currentCaseRecord}
            onBackToBundle={() => setCurrentStep('bundle')}
            onStartAnotherCase={handleStartFreshCase}
            onViewCase={() => setCurrentStep('bundle')}
            onPreservePrivately={handlePreservePrivately}
          />
        )}
      </main>

      {/* Source Viewer Modal */}
      {viewingSource && (
        <SourceViewerModal
          file={viewingSource}
          onClose={() => setViewingSource(null)}
          onTogglePrivacy={(id) => handleToggleEvidencePrivacy(id)}
        />
      )}

      {/* Accessible Civic Footer */}
      <footer className="border-t border-[#D9DEE7] bg-white py-6 px-4 text-xs text-[#526071] print:hidden">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#172033]">CaseCarry</span>
            <span>•</span>
            <span>Don’t tell your story again.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Citizen Controlled</span>
            <span>•</span>
            <span>Zero Automated Submissions</span>
            <span>•</span>
            <span>Recipient Neutral</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
