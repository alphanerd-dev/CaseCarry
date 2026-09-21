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
import { CaseRecord, CaseEvent, EvidenceFile, UnresolvedIssue, Pathway, ExtractedCaseFact } from '@/types/case';
import { PathwayDiscoveryInput, PathwayStatus } from '@/lib/pathways/types';
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
  const [verificationReviewed, setVerificationReviewed] = useState<boolean>(false);
  const [caseCreatedAt, setCaseCreatedAt] = useState<string>(() => new Date().toISOString().slice(0, 10));

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

  // Pathways & Dynamic Discovery
  const [pathways, setPathways] = useState<Pathway[]>(SAMPLE_PATHWAYS);
  const [selectedPathways, setSelectedPathways] = useState<string[]>([]);
  const [extractedFacts, setExtractedFacts] = useState<ExtractedCaseFact[]>([]);
  const [safetyAlert, setSafetyAlert] = useState<{
    isHighRisk: boolean;
    riskType?: string;
    advisory: string;
    emergencyResources?: Array<{ name: string; contact: string; note: string }>;
  } | undefined>(undefined);
  const [discoverySource, setDiscoverySource] = useState<'live_research' | 'verified_cache' | 'local_fallback'>('verified_cache');

  // Modal State for Source Inspector
  const [viewingSource, setViewingSource] = useState<EvidenceFile | null>(null);

  // Highest unlocked step index reached by user to prevent premature skips while allowing backwards navigation
  const [maxUnlockedStepIndex, setMaxUnlockedStepIndex] = useState<number>(0);

  const goToStep = useCallback((step: AppStep) => {
    const idx = STEP_LABELS.findIndex((item) => item.key === step);
    if (idx >= 0) {
      setMaxUnlockedStepIndex((prev) => Math.max(prev, idx));
    }
    setCurrentStep(step);
  }, []);

  // Auto-Save Draft to Local Storage (IndexedDB with debounce)
  useEffect(() => {
    if (currentStep === 'landing' || isDemoMode) return;

    const establishedDate = events.find(
      (e) => e.date && e.date !== 'Date not established' && e.date !== 'Unspecified date'
    )?.date;

    const currentRecord: CaseRecord = {
      id: caseId,
      title: caseTitle || 'Unresolved Case Record',
      provider: provider || 'Service Provider',
      accountReference: referenceNumber,
      citizenName: citizenName || 'Citizen',
      createdAt: caseCreatedAt,
      dateOpened: establishedDate || undefined,
      updatedAt: new Date().toISOString().slice(0, 10),
      firstReportOutcome: selectedOutcome as any,
      events,
      evidence: evidenceList,
      unresolved,
      pathways,
      selectedPathways,
      contradictions,
      missingInformation,
      verificationReviewed,
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
    verificationReviewed,
    caseCreatedAt,
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
    setSelectedPathways(['ogserc-consumer-dispute', 'fccpc-consumer-protection']);
    setVerificationReviewed(true);
    setCaseCreatedAt(SAMPLE_CASE_RECORD.createdAt || new Date().toISOString().slice(0, 10));
    setMaxUnlockedStepIndex(STEP_LABELS.length - 1);
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
    setVerificationReviewed(false);
    setCaseCreatedAt(new Date().toISOString().slice(0, 10));
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
    setMaxUnlockedStepIndex(0);
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
    setVerificationReviewed(Boolean(savedRecord.verificationReviewed));
    setCaseCreatedAt(savedRecord.createdAt || new Date().toISOString().slice(0, 10));
    setUnresolved(savedRecord.unresolved);
    setPathways(savedRecord.pathways || SAMPLE_PATHWAYS);
    setSelectedPathways(savedRecord.selectedPathways || []);
    setMaxUnlockedStepIndex(STEP_LABELS.length - 1);
    setCurrentStep('bundle');
  };

  const establishedDate = events.find(
    (e) => e.date && e.date !== 'Date not established' && e.date !== 'Unspecified date'
  )?.date;

  // Full current case record
  const currentCaseRecord: CaseRecord = {
    id: caseId,
    title: caseTitle || (provider ? `Case with ${provider}` : 'Unresolved Case Record'),
    provider: provider || 'Service Provider',
    accountReference: referenceNumber,
    citizenName: citizenName || 'Citizen',
    createdAt: caseCreatedAt,
    dateOpened: establishedDate || undefined,
    updatedAt: new Date().toISOString().slice(0, 10),
    firstReportOutcome: selectedOutcome as any,
    events,
    evidence: evidenceList,
    unresolved,
    pathways,
    selectedPathways,
    extractedFacts,
    safetyAlert,
    pathwayDiscoverySource: discoverySource,
    contradictions,
    missingInformation,
    verificationReviewed,
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

  // Pathway handlers
  const handleTogglePathway = (id: string) => {
    setSelectedPathways((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleUpdatePathways = (
    newPathways: Pathway[],
    newFacts?: ExtractedCaseFact[],
    discoveryMeta?: any
  ) => {
    setPathways(newPathways);
    if (newFacts) setExtractedFacts(newFacts);
    if (discoveryMeta?.source) setDiscoverySource(discoveryMeta.source);
    if (discoveryMeta?.safetyAlert) setSafetyAlert(discoveryMeta.safetyAlert);
  };

  const handleUpdatePathwayStatus = (
    id: string,
    status: PathwayStatus,
    notes?: string
  ) => {
    setPathways((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              ...(notes !== undefined ? { previousAttemptNotes: notes } : {}),
            }
          : p
      )
    );
  };

  const handleAddCustomPathway = (custom: Pathway) => {
    setPathways((prev) => [custom, ...prev]);
    setSelectedPathways((prev) => [...prev, custom.id]);
  };

  // Construct pathway discovery input from complete verified case record
  const pathwayDiscoveryInput: PathwayDiscoveryInput = {
    caseTitle: caseTitle || (provider ? `Case with ${provider}` : 'Unresolved Case Record'),
    citizenName,
    provider,
    referenceNumber,
    firstReportOutcome: selectedOutcome,
    userDescription: initialSummary,
    events,
    unresolved,
    evidenceSources: evidenceList.map((e) => ({
      id: e.id,
      title: e.title,
      filename: e.filename,
      type: e.type,
      textSnippet: e.extractedText || e.fullSnippet || e.contentSummary,
    })),
    contradictions,
    missingInformation,
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
        <div className="bg-white border-b border-[#D9DEE7] py-2.5 px-3 sm:px-6 overflow-x-auto print:hidden">
          <div className="max-w-5xl mx-auto flex items-center justify-start sm:justify-between min-w-max gap-1.5 sm:gap-2 text-xs">
            {STEP_LABELS.map((s, idx) => {
              const isCurrent = currentStep === s.key;
              const currentIndex = STEP_LABELS.findIndex((item) => item.key === currentStep);
              const isPassed = idx < currentIndex;

              // Allow navigation to any unlocked step reached by the citizen
              const canNavigate = idx <= maxUnlockedStepIndex;

              return (
                <div key={s.key} className="flex items-center gap-1.5 shrink-0">
                  <button
                    disabled={!canNavigate}
                    onClick={() => goToStep(s.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[34px] ${
                      isCurrent
                        ? 'bg-[#2457C5] text-white shadow-xs'
                        : isPassed
                        ? 'text-[#18794E] hover:bg-emerald-50'
                        : canNavigate
                        ? 'text-[#526071] hover:text-[#172033] hover:bg-slate-50'
                        : 'text-slate-300 cursor-not-allowed opacity-60'
                    }`}
                  >
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
                  {idx < STEP_LABELS.length - 1 && (
                    <span className="text-slate-300 select-none">›</span>
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
              goToStep('reconstruction');
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
            onContinue={() => goToStep('evidence')}
            onBack={() => goToStep('landing')}
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
            onContinue={() => goToStep('reconstruction')}
            onBack={() => goToStep('entry')}
            lowBandwidth={lowBandwidth}
            isDemoMode={isDemoMode}
            currentLanguage={currentLanguage}
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
            onContinue={() => goToStep('verification')}
            onBack={() => goToStep('evidence')}
            isDemoMode={isDemoMode}
            currentLanguage={currentLanguage}
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
            onContinue={() => goToStep('unresolved')}
            onBack={() => goToStep('reconstruction')}
            isDemoMode={isDemoMode}
            verificationReviewed={verificationReviewed}
            onToggleVerificationReviewed={(val) => setVerificationReviewed(val)}
            currentLanguage={currentLanguage}
          />
        )}

        {currentStep === 'unresolved' && (
          <UnresolvedIssueView
            unresolved={unresolved}
            onUpdateUnresolved={setUnresolved}
            onContinue={() => goToStep('pathway')}
            onBack={() => goToStep('verification')}
            isDemoMode={isDemoMode}
            currentLanguage={currentLanguage}
          />
        )}

        {currentStep === 'pathway' && (
          <PathwayGuidanceView
            pathways={pathways}
            selectedPathways={selectedPathways}
            extractedFacts={extractedFacts}
            safetyAlert={safetyAlert}
            discoverySource={discoverySource}
            caseInput={pathwayDiscoveryInput}
            onUpdatePathways={handleUpdatePathways}
            onTogglePathway={handleTogglePathway}
            onUpdatePathwayStatus={handleUpdatePathwayStatus}
            onAddCustomPathway={handleAddCustomPathway}
            onContinue={() => goToStep('privacy')}
            onSkip={() => goToStep('privacy')}
            onBack={() => goToStep('unresolved')}
            isDemoMode={isDemoMode}
            currentLanguage={currentLanguage}
          />
        )}

        {currentStep === 'privacy' && (
          <PrivacyReviewView
            evidenceList={evidenceList}
            onUpdateEvidencePrivacy={handleUpdateEvidencePrivacy}
            onRemoveEvidence={handleRemoveEvidence}
            onViewSource={(file) => setViewingSource(file)}
            onApproveAndCreateBundle={() => goToStep('bundle')}
            onBack={() => goToStep('pathway')}
            currentLanguage={currentLanguage}
          />
        )}

        {currentStep === 'bundle' && (
          <CarryForwardBundleView
            caseData={currentCaseRecord}
            onContinueToExport={() => goToStep('export')}
            onBack={() => goToStep('privacy')}
            currentLanguage={currentLanguage}
          />
        )}

        {currentStep === 'export' && (
          <ExportView
            caseData={currentCaseRecord}
            onBackToBundle={() => goToStep('bundle')}
            onStartAnotherCase={handleStartFreshCase}
            onViewCase={() => goToStep('bundle')}
            onPreservePrivately={handlePreservePrivately}
            onGoToVerification={() => goToStep('verification')}
            currentLanguage={currentLanguage}
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
