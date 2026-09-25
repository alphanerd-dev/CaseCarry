'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CaseRecord,
  CaseEvent,
  EvidenceFile,
  UnresolvedIssue,
  Pathway,
  ExtractedCaseFact,
  AppStep,
  PrivacyStatus,
} from '@/types/case';
import {
  SAMPLE_CASE_RECORD,
  SAMPLE_EVIDENCE_FILES,
  SAMPLE_CASE_EVENTS,
  SAMPLE_UNRESOLVED_ISSUE,
  SAMPLE_PATHWAYS,
} from '@/lib/demoData';
import { PathwayDiscoveryInput, PathwayStatus } from '@/lib/pathways/types';
import { saveDraftLocally, saveCaseLocally } from '@/lib/storage';

const INITIAL_UNRESOLVED_STATE: UnresolvedIssue = {
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
};

interface UseCaseManagerOptions {
  currentStep: AppStep;
}

// Custom hook separating complex case state, mutations, and local persistence from the UI layer
export function useCaseManager({ currentStep }: UseCaseManagerOptions) {
  // Case Metadata State
  const [caseId, setCaseId] = useState<string>('case-pending');
  const [caseTitle, setCaseTitle] = useState<string>('Unresolved Matter');
  const [citizenName, setCitizenName] = useState<string>('Citizen Complainant');
  const [provider, setProvider] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [initialSummary, setInitialSummary] = useState<string>('');
  const [selectedOutcome, setSelectedOutcome] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [caseCreatedAt, setCaseCreatedAt] = useState<string>('2026-09-25');
  const [caseUpdatedAt, setCaseUpdatedAt] = useState<string>('2026-09-25');

  // Evidence & Chronology State
  const [evidenceList, setEvidenceList] = useState<EvidenceFile[]>([]);
  const [events, setEvents] = useState<CaseEvent[]>([]);
  const [contradictions, setContradictions] = useState<string[]>([]);
  const [missingInformation, setMissingInformation] = useState<string[]>([]);
  const [verificationReviewed, setVerificationReviewed] = useState<boolean>(false);

  // Unresolved Issue State
  const [unresolved, setUnresolved] = useState<UnresolvedIssue>(INITIAL_UNRESOLVED_STATE);

  // Pathways & Dynamic Discovery State
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

  // Source Inspector Modal State
  const [viewingSource, setViewingSource] = useState<EvidenceFile | null>(null);

  // Find established date from chronology
  const establishedDate = useMemo(() => {
    return events.find(
      (e) => e.date && e.date !== 'Date not established' && e.date !== 'Unspecified date'
    )?.date;
  }, [events]);

  // Derived complete CaseRecord object for bundle/export
  const currentCaseRecord: CaseRecord = useMemo(() => ({
    id: caseId,
    title: caseTitle || (provider ? `Case with ${provider}` : 'Unresolved Case Record'),
    provider: provider || 'Service Provider',
    accountReference: referenceNumber,
    citizenName: citizenName || 'Citizen',
    createdAt: caseCreatedAt,
    dateOpened: establishedDate || undefined,
    updatedAt: caseUpdatedAt,
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
  }), [
    caseId,
    caseTitle,
    provider,
    referenceNumber,
    citizenName,
    caseCreatedAt,
    establishedDate,
    caseUpdatedAt,
    selectedOutcome,
    events,
    evidenceList,
    unresolved,
    pathways,
    selectedPathways,
    extractedFacts,
    safetyAlert,
    discoverySource,
    contradictions,
    missingInformation,
    verificationReviewed,
    isDemoMode,
  ]);

  // Pathway discovery payload constructed from verified facts
  const pathwayDiscoveryInput: PathwayDiscoveryInput = useMemo(() => ({
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
  }), [
    caseTitle,
    provider,
    citizenName,
    referenceNumber,
    selectedOutcome,
    initialSummary,
    events,
    unresolved,
    evidenceList,
    contradictions,
    missingInformation,
  ]);

  // Auto-Save Draft to Local Storage (IndexedDB with debounce)
  useEffect(() => {
    if (currentStep === 'landing' || isDemoMode) return;

    const timer = setTimeout(() => {
      saveDraftLocally(currentCaseRecord, currentStep, isDemoMode).catch((e) =>
        console.warn('Draft save error:', e)
      );
    }, 600);

    return () => clearTimeout(timer);
  }, [currentCaseRecord, currentStep, isDemoMode]);

  // Preload structured fictional demo case
  const preloadDemo = useCallback(() => {
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
    setCaseCreatedAt(SAMPLE_CASE_RECORD.createdAt || '2026-09-25');
  }, []);

  // Initialize a fresh citizen case
  const startFreshCase = useCallback(() => {
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
    setUnresolved(INITIAL_UNRESOLVED_STATE);
    setPathways(SAMPLE_PATHWAYS);
    setSelectedPathways([]);
  }, []);

  // Restore previously saved case from IndexedDB
  const loadSavedCase = useCallback((savedRecord: CaseRecord) => {
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
  }, []);

  // Update context entries
  const updateContext = useCallback(
    (outcome: string, prov: string, refNum: string, summary: string) => {
      setSelectedOutcome(outcome);
      setProvider(prov);
      setReferenceNumber(refNum);
      setInitialSummary(summary);
      if (prov && !caseTitle) {
        setCaseTitle(`Matter with ${prov}`);
      }
    },
    [caseTitle]
  );

  // Evidence list handlers
  const addEvidence = useCallback((file: EvidenceFile) => {
    setEvidenceList((prev) => [file, ...prev]);
  }, []);

  const removeEvidence = useCallback((id: string) => {
    setEvidenceList((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleEvidencePrivacy = useCallback((id: string) => {
    setEvidenceList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next: PrivacyStatus = item.privacyStatus === 'included' ? 'private' : 'included';
          return { ...item, privacyStatus: next };
        }
        return item;
      })
    );
  }, []);

  const updateEvidencePrivacy = useCallback(
    (id: string, status: PrivacyStatus) => {
      setEvidenceList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, privacyStatus: status } : item))
      );
    },
    []
  );

  // Reconstruction & Chronology handlers
  const updateReconstruction = useCallback(
    (
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
    },
    []
  );

  const addCustomEvent = useCallback((ev: CaseEvent) => {
    setEvents((prev) => [...prev, ev]);
  }, []);

  const updateEvent = useCallback((updated: CaseEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const verifyAllSourceBacked = useCallback(() => {
    setEvents((prev) =>
      prev.map((e) => (e.provenance === 'source-backed' ? { ...e, verifiedByUser: true } : e))
    );
  }, []);

  // Pathway selection & guidance handlers
  const togglePathway = useCallback((id: string) => {
    setSelectedPathways((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const updatePathways = useCallback(
    (
      newPathways: Pathway[],
      newFacts?: ExtractedCaseFact[],
      discoveryMeta?: {
        source?: 'live_research' | 'verified_cache' | 'local_fallback';
        safetyAlert?: {
          isHighRisk: boolean;
          riskType?: string;
          advisory: string;
          emergencyResources?: Array<{ name: string; contact: string; note: string }>;
        };
      }
    ) => {
      setPathways(newPathways);
      if (newFacts) setExtractedFacts(newFacts);
      if (discoveryMeta?.source) setDiscoverySource(discoveryMeta.source);
      if (discoveryMeta?.safetyAlert) setSafetyAlert(discoveryMeta.safetyAlert);
    },
    []
  );

  const updatePathwayStatus = useCallback(
    (id: string, status: PathwayStatus, notes?: string) => {
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
    },
    []
  );

  const addCustomPathway = useCallback((custom: Pathway) => {
    setPathways((prev) => [custom, ...prev]);
    setSelectedPathways((prev) => [...prev, custom.id]);
  }, []);

  // Save case explicitly to IndexedDB
  const preservePrivately = useCallback(async () => {
    await saveCaseLocally(currentCaseRecord);
  }, [currentCaseRecord]);

  return {
    // State variables
    caseId,
    caseTitle,
    citizenName,
    provider,
    referenceNumber,
    initialSummary,
    selectedOutcome,
    isDemoMode,
    caseCreatedAt,
    caseUpdatedAt,
    evidenceList,
    events,
    contradictions,
    missingInformation,
    verificationReviewed,
    unresolved,
    pathways,
    selectedPathways,
    extractedFacts,
    safetyAlert,
    discoverySource,
    viewingSource,
    currentCaseRecord,
    pathwayDiscoveryInput,

    // Mutation handlers
    setCaseTitle,
    setUnresolved,
    setVerificationReviewed,
    setViewingSource,
    preloadDemo,
    startFreshCase,
    loadSavedCase,
    updateContext,
    addEvidence,
    removeEvidence,
    toggleEvidencePrivacy,
    updateEvidencePrivacy,
    updateReconstruction,
    addCustomEvent,
    updateEvent,
    deleteEvent,
    verifyAllSourceBacked,
    togglePathway,
    updatePathways,
    updatePathwayStatus,
    addCustomPathway,
    preservePrivately,
  };
}
