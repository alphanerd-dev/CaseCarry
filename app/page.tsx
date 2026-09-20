'use client';

import React, { useState, useEffect } from 'react';
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
import { Check, Clock, ChevronRight } from 'lucide-react';

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
  { key: 'reconstruction', label: 'Reconstruct', number: 3 },
  { key: 'verification', label: 'Verify', number: 4 },
  { key: 'unresolved', label: 'Unresolved Issue', number: 5 },
  { key: 'pathway', label: 'Pathways', number: 6 },
  { key: 'privacy', label: 'Privacy', number: 7 },
  { key: 'bundle', label: 'Bundle', number: 8 },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [lowBandwidth, setLowBandwidth] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  // Case State
  const [selectedOutcome, setSelectedOutcome] = useState<string>('response-didnt-resolve');
  const [evidenceList, setEvidenceList] = useState<EvidenceFile[]>(SAMPLE_EVIDENCE_FILES);
  const [events, setEvents] = useState<CaseEvent[]>(SAMPLE_CASE_EVENTS);
  const [unresolved, setUnresolved] = useState<UnresolvedIssue>(SAMPLE_UNRESOLVED_ISSUE);
  const [selectedPathways, setSelectedPathways] = useState<string[]>([
    'nerc-forum-office',
    'fccpc-nigeria',
  ]);

  // Modal State for Source Inspector
  const [viewingSource, setViewingSource] = useState<EvidenceFile | null>(null);

  // Load sample case into memory
  const handlePreloadDemo = () => {
    setSelectedOutcome('response-didnt-resolve');
    setEvidenceList(SAMPLE_EVIDENCE_FILES);
    setEvents(SAMPLE_CASE_EVENTS);
    setUnresolved(SAMPLE_UNRESOLVED_ISSUE);
    setSelectedPathways(['nerc-forum-office', 'fccpc-nigeria']);
  };

  const handleStartFreshCase = () => {
    setSelectedOutcome('');
    setEvidenceList([]);
    setEvents([]);
    setUnresolved({
      problem: '',
      alreadyTried: '',
      responseReceived: '',
      resolutionVision: '',
      requestedAction: '',
    });
    setSelectedPathways([]);
    setCurrentStep('entry');
  };

  // Full Case Data Object
  const currentCaseRecord: CaseRecord = {
    ...SAMPLE_CASE_RECORD,
    events,
    evidence: evidenceList,
    unresolved,
    pathways: SAMPLE_PATHWAYS,
  };

  // Evidence handlers
  const handleAddEvidence = (file: EvidenceFile) => {
    setEvidenceList((prev) => [file, ...prev]);

    // Automatically generate a source-backed draft event
    const newEvent: CaseEvent = {
      id: `ev-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      title: `Submitted: ${file.title}`,
      displayDate: file.uploadDate,
      description: `Artifact "${file.filename}" attached by citizen.`,
      provenance: 'source-backed',
      provenanceLabel: 'Source-backed',
      sourceIds: [file.id],
      sourceNames: [file.filename],
      verifiedByUser: false,
    };
    setEvents((prev) => [newEvent, ...prev]);
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

  // Event handlers
  const handleUpdateEvent = (updated: CaseEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Pathway toggle
  const handleTogglePathway = (id: string) => {
    setSelectedPathways((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
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
      {/* Universal Accessible Header */}
      <Header
        lowBandwidth={lowBandwidth}
        onToggleLowBandwidth={() => setLowBandwidth(!lowBandwidth)}
        currentLanguage={currentLanguage}
        onChangeLanguage={setCurrentLanguage}
        onGoHome={() => setCurrentStep('landing')}
        onStartCase={() => {
          if (evidenceList.length === 0) {
            handlePreloadDemo();
          }
          setCurrentStep('entry');
        }}
        activeStep={currentStep}
      />

      {/* Stepper Progress Bar (for workflow steps) */}
      {showWorkflowStepper && (
        <div className="bg-white border-b border-[#D9DEE7] py-2 px-4 sm:px-6 overflow-x-auto print:hidden">
          <div className="max-w-5xl mx-auto flex items-center justify-between min-w-[580px] gap-2 text-xs">
            {STEP_LABELS.map((s, idx) => {
              const isCurrent = currentStep === s.key;
              const currentIndex = STEP_LABELS.findIndex((item) => item.key === currentStep);
              const isPassed = idx < currentIndex;

              return (
                <div key={s.key} className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setCurrentStep(s.key)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-[#2457C5] text-white'
                        : isPassed
                        ? 'text-[#18794E] hover:bg-emerald-50'
                        : 'text-[#526071] hover:text-[#172033]'
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
            onStartCase={() => {
              if (evidenceList.length === 0) {
                handlePreloadDemo();
              }
              setCurrentStep('entry');
            }}
            onExploreSampleCase={() => {
              handlePreloadDemo();
              setCurrentStep('reconstruction');
            }}
          />
        )}

        {currentStep === 'entry' && (
          <CaseEntryView
            selectedOutcome={selectedOutcome}
            onSelectOutcome={setSelectedOutcome}
            onContinue={() => setCurrentStep('evidence')}
            onBack={() => setCurrentStep('landing')}
            onPreloadDemo={() => {
              handlePreloadDemo();
              setSelectedOutcome('response-didnt-resolve');
            }}
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
              setEvidenceList(SAMPLE_EVIDENCE_FILES);
              setEvents(SAMPLE_CASE_EVENTS);
            }}
            onContinue={() => setCurrentStep('reconstruction')}
            onBack={() => setCurrentStep('entry')}
            lowBandwidth={lowBandwidth}
          />
        )}

        {currentStep === 'reconstruction' && (
          <ReconstructionView
            events={events}
            evidenceList={evidenceList}
            onViewSource={(file) => setViewingSource(file)}
            onContinue={() => setCurrentStep('verification')}
            onBack={() => setCurrentStep('evidence')}
          />
        )}

        {currentStep === 'verification' && (
          <VerificationView
            events={events}
            evidenceList={evidenceList}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            onContinue={() => setCurrentStep('unresolved')}
            onBack={() => setCurrentStep('reconstruction')}
          />
        )}

        {currentStep === 'unresolved' && (
          <UnresolvedIssueView
            unresolved={unresolved}
            onUpdateUnresolved={setUnresolved}
            onContinue={() => setCurrentStep('pathway')}
            onBack={() => setCurrentStep('verification')}
          />
        )}

        {currentStep === 'pathway' && (
          <PathwayGuidanceView
            pathways={SAMPLE_PATHWAYS}
            selectedPathways={selectedPathways}
            onTogglePathway={handleTogglePathway}
            onContinue={() => setCurrentStep('privacy')}
            onBack={() => setCurrentStep('unresolved')}
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

      {/* Footer */}
      <footer className="border-t border-[#D9DEE7] bg-white py-6 px-4 text-xs text-[#526071] print:hidden">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#172033]">CaseCarry</span>
            <span>•</span>
            <span>Don’t start your story again.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Citizen Controlled</span>
            <span>•</span>
            <span>Zero Unsolicited Submissions</span>
            <span>•</span>
            <span>No Account Required for Recipients</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
