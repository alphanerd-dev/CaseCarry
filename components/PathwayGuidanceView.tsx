'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  Building2,
  Scale,
  FileCheck2,
  Calendar,
  Check,
  SkipForward,
  Info,
  RefreshCw,
  Sparkles,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  HelpCircle,
  Clock,
  History,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Pathway, ExtractedCaseFact, ProvenanceType } from '@/types/case';
import { ProvenanceBadge } from './ProvenanceBadge';
import { PathwayCandidate, PathwayDiscoveryInput, PathwayDiscoveryResult, PathwayStatus } from '@/lib/pathways/types';
import { SupportedLanguage, TRANSLATIONS } from '@/lib/i18n';

interface PathwayGuidanceViewProps {
  pathways: Pathway[];
  selectedPathways: string[];
  extractedFacts?: ExtractedCaseFact[];
  safetyAlert?: {
    isHighRisk: boolean;
    riskType?: string;
    advisory: string;
    emergencyResources?: Array<{ name: string; contact: string; note: string }>;
  };
  discoverySource?: 'live_research' | 'verified_cache' | 'local_fallback';
  caseInput?: PathwayDiscoveryInput;
  onUpdatePathways: (newPathways: Pathway[], extractedFacts?: ExtractedCaseFact[], discoveryMeta?: any) => void;
  onTogglePathway: (id: string) => void;
  onUpdatePathwayStatus?: (id: string, status: PathwayStatus, notes?: string) => void;
  onAddCustomPathway?: (custom: Pathway) => void;
  onContinue: () => void;
  onSkip: () => void;
  onBack: () => void;
  isDemoMode?: boolean;
  currentLanguage?: SupportedLanguage;
}

export function PathwayGuidanceView({
  pathways,
  selectedPathways,
  extractedFacts,
  safetyAlert,
  discoverySource = 'verified_cache',
  caseInput,
  onUpdatePathways,
  onTogglePathway,
  onUpdatePathwayStatus,
  onAddCustomPathway,
  onContinue,
  onSkip,
  onBack,
  isDemoMode,
  currentLanguage = 'en',
}: PathwayGuidanceViewProps) {
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryStage, setDiscoveryStage] = useState<string>('');
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);
  const [showFactsDrawer, setShowFactsDrawer] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [activeAttemptNotesId, setActiveAttemptNotesId] = useState<string | null>(null);
  const [attemptNotesText, setAttemptNotesText] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Custom Pathway Form State
  const [customName, setCustomName] = useState('');
  const [customOrg, setCustomOrg] = useState('');
  const [customJurisdiction, setCustomJurisdiction] = useState('');
  const [customWhy, setCustomWhy] = useState('');
  const [customSource, setCustomSource] = useState('');
  const [customSourceUrl, setCustomSourceUrl] = useState('');

  // Missing info quick fill state
  const [missingProvider, setMissingProvider] = useState('');
  const [missingJurisdiction, setMissingJurisdiction] = useState('');

  // Function to run dynamic discovery
  const runDiscovery = async (overrideInput?: Partial<PathwayDiscoveryInput>) => {
    if (!caseInput) return;
    setIsDiscovering(true);
    setDiscoveryError(null);
    setDiscoveryStage('1. Extracting verified case facts & checking safety...');

    try {
      await new Promise((r) => setTimeout(r, 400));
      setDiscoveryStage('2. Analyzing territorial jurisdiction and previous failure outcome...');

      const payload: PathwayDiscoveryInput = {
        ...caseInput,
        provider: overrideInput?.provider || caseInput.provider || missingProvider,
        ...overrideInput,
      };

      await new Promise((r) => setTimeout(r, 400));
      setDiscoveryStage('3. Researching official regulatory & ombudsman procedures...');

      const res = await fetch('/api/pathways/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Discovery service returned ${res.status}`);
      }

      const result: PathwayDiscoveryResult = await res.json();
      setDiscoveryStage('4. Validating official sources & confidence criteria...');
      await new Promise((r) => setTimeout(r, 300));

      // Map candidates to application Pathway format
      const convertedPathways: Pathway[] = (result.candidatePathways || []).map((cand) => ({
        id: cand.id,
        name: cand.name,
        organization: cand.organization,
        jurisdiction: cand.jurisdiction,
        pathwayType: cand.pathwayType,
        whyRelevant: cand.whyRelevant,
        relevanceReason: cand.relevanceReason,
        supportingCaseFacts: cand.supportingCaseFacts || [],
        eligibility: cand.eligibility,
        requiredDocuments: cand.requiredDocuments || [],
        steps: cand.steps || [],
        officialSource: cand.officialSourceTitle,
        sourceUrl: cand.officialSourceUrl,
        lastCheckedDate: cand.sourceCheckedAt,
        warning: cand.warnings?.[0] || 'Confirm current requirements before relying on this guidance.',
        warnings: cand.warnings || [],
        uncertainties: cand.uncertainties || [],
        whatWeDontKnow: cand.uncertainties?.join('. ') || '',
        confidence: cand.confidence || 'medium',
        confidenceExplanation: cand.confidenceExplanation || '',
        status: cand.status || 'POTENTIAL',
        isStale: cand.isStale,
        staleNotice: cand.staleNotice,
      }));

      const convertedFacts: ExtractedCaseFact[] = (result.extractedFacts || []).map((f) => ({
        field: f.field,
        label: f.label,
        value: f.value,
        provenance: f.provenance,
        sourceIds: f.sourceIds,
        sourceNames: f.sourceNames,
      }));

      onUpdatePathways(convertedPathways, convertedFacts, {
        source: result.discoverySource,
        safetyAlert: result.safetyAlert,
        providerUsed: result.providerUsed,
        modelUsed: result.modelUsed,
      });
    } catch (err: any) {
      console.warn('Dynamic pathway discovery failed:', err);
      setDiscoveryError(
        'We could not complete live procedural verification right now. CaseCarry will continue using verified procedural records.'
      );
    } finally {
      setIsDiscovering(false);
      setDiscoveryStage('');
    }
  };

  const handleMarkAttempted = (id: string) => {
    setActiveAttemptNotesId(id);
    const existing = pathways.find((p) => p.id === id);
    setAttemptNotesText(existing?.previousAttemptNotes || '');
  };

  const handleSaveAttemptNotes = (id: string) => {
    if (onUpdatePathwayStatus) {
      onUpdatePathwayStatus(id, 'PREVIOUSLY_ATTEMPTED', attemptNotesText);
    } else {
      const updated = pathways.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'PREVIOUSLY_ATTEMPTED' as PathwayStatus,
              previousAttemptNotes: attemptNotesText,
            }
          : p
      );
      onUpdatePathways(updated, extractedFacts);
    }
    setActiveAttemptNotesId(null);
  };

  const handleUpdateStatus = (id: string, newStatus: PathwayStatus) => {
    if (onUpdatePathwayStatus) {
      onUpdatePathwayStatus(id, newStatus);
    } else {
      const updated = pathways.map((p) => (p.id === id ? { ...p, status: newStatus } : p));
      onUpdatePathways(updated, extractedFacts);
    }
  };

  const handleCreateCustomPathway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customOrg.trim()) return;

    const newPathway: Pathway = {
      id: `custom-pw-${Date.now()}`,
      name: customName.trim(),
      organization: customOrg.trim(),
      jurisdiction: customJurisdiction.trim() || 'Citizen Specified Jurisdiction',
      whyRelevant: customWhy.trim() || 'User-identified specific next pathway for case continuity.',
      eligibility: 'Self-determined by citizen.',
      requiredDocuments: ['Carry-forward case summary', 'Original supporting evidence index'],
      officialSource: customSource.trim() || customOrg.trim(),
      sourceUrl: customSourceUrl.trim() || undefined,
      lastCheckedDate: new Date().toISOString().slice(0, 10),
      warning: 'Citizen-added custom pathway.',
      confidence: 'high',
      confidenceExplanation: 'Directly provided by citizen.',
      status: 'RELEVANCE_CONFIRMED',
    };

    if (onAddCustomPathway) {
      onAddCustomPathway(newPathway);
    } else {
      onUpdatePathways([newPathway, ...pathways], extractedFacts);
      onTogglePathway(newPathway.id);
    }

    setCustomName('');
    setCustomOrg('');
    setCustomJurisdiction('');
    setCustomWhy('');
    setCustomSource('');
    setCustomSourceUrl('');
    setShowCustomModal(false);
  };

  const visiblePathways = pathways.filter((p) => {
    if (filterType === 'active') return p.status !== 'NOT_RELEVANT' && p.status !== 'PREVIOUSLY_ATTEMPTED';
    if (filterType === 'attempted') return p.status === 'PREVIOUSLY_ATTEMPTED';
    if (filterType === 'selected') return selectedPathways.includes(p.id);
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Back button */}
      <button
        id="back-to-unresolved-btn"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033] mb-6 p-1 rounded-md transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>{t.back}</span>
      </button>

      {/* Progress pill & Discovery Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2457C5] text-xs font-semibold border border-blue-100">
          <span>Step 6 of 8 ({t.optional})</span>
          <span>•</span>
          <span>{t.stepPathways}</span>
        </div>

        {caseInput && (
          <button
            id="rerun-discovery-btn"
            onClick={() => runDiscovery()}
            disabled={isDiscovering}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-[#D9DEE7] text-[#2457C5] hover:bg-blue-50/50 hover:border-blue-200 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={13} className={isDiscovering ? 'animate-spin' : ''} />
            <span>{isDiscovering ? 'Researching...' : 'Re-discover from Case Evidence'}</span>
          </button>
        )}
      </div>

      {/* Main Heading & Core Principle */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
            {t.pathwayTitle}
          </h1>
          <p className="text-sm sm:text-base text-[#526071] mt-2 leading-relaxed">
            {t.pathwaySubtitle}
          </p>
        </div>

        {/* Skip button */}
        <button
          id="skip-pathways-top-btn"
          onClick={onSkip}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033] hover:bg-slate-100 rounded-lg border border-[#D9DEE7] shrink-0 self-start cursor-pointer"
        >
          <SkipForward size={14} />
          <span>{t.skipStep}</span>
        </button>
      </div>

      {/* HIGH-RISK SAFETY BANNER (Rule 20) */}
      {safetyAlert?.isHighRisk && (
        <div className="mt-6 p-5 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs text-rose-950 space-y-3 shadow-xs">
          <div className="flex items-start gap-3">
            <ShieldAlert size={20} className="shrink-0 text-rose-700 mt-0.5" />
            <div>
              <strong className="text-sm font-bold text-rose-900 block">
                Urgent Safety & Emergency Notice
              </strong>
              <p className="mt-1 leading-relaxed text-rose-900">{safetyAlert.advisory}</p>
            </div>
          </div>

          {safetyAlert.emergencyResources && safetyAlert.emergencyResources.length > 0 && (
            <div className="pt-3 border-t border-rose-200 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {safetyAlert.emergencyResources.map((res, i) => (
                <div key={i} className="p-3 bg-white/80 rounded-lg border border-rose-200 space-y-1">
                  <div className="font-bold text-rose-950">{res.name}</div>
                  <div className="text-xs font-mono font-bold text-rose-700">{res.contact}</div>
                  <div className="text-[11px] text-rose-800">{res.note}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Discovery Loading State */}
      {isDiscovering && (
        <div className="mt-6 p-5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3 text-xs text-[#2457C5] animate-pulse">
          <div className="flex items-center gap-2.5 font-bold text-sm text-[#1D46A0]">
            <Sparkles size={16} className="animate-spin" />
            <span>Discovering case-specific pathways...</span>
          </div>
          <p className="font-mono text-xs">{discoveryStage}</p>
        </div>
      )}

      {/* Error / Stale Notice */}
      {discoveryError && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle size={16} className="shrink-0 text-amber-700 mt-0.5" />
          <div>
            <span className="font-bold block">Procedural Notice:</span>
            {discoveryError}
          </div>
        </div>
      )}

      {/* Non-Authoritative Guidance Card (Rule 6, 19) */}
      <div className="mt-6 p-4 bg-[#F8F7F3] border border-[#D9DEE7] rounded-xl flex items-start gap-3 text-xs text-[#526071] leading-relaxed">
        <Scale size={18} className="shrink-0 text-[#526071] mt-0.5" />
        <div>
          <strong className="text-[#172033]">Citizen Control & Informational Attribution:</strong> CaseCarry identifies potentially relevant pathways based on the information available at the time of review. CaseCarry is not an autonomous legal decision-maker, does not provide binding legal counsel, guarantees no outcome, and submits nothing automatically. You decide what to pursue.
        </div>
      </div>

      {/* EXTRACTED CASE FACTS ACCORDION (Rule 3, 11) */}
      {extractedFacts && extractedFacts.length > 0 && (
        <div className="mt-5 border border-[#D9DEE7] rounded-xl bg-white overflow-hidden text-xs">
          <button
            id="toggle-facts-drawer-btn"
            onClick={() => setShowFactsDrawer(!showFactsDrawer)}
            className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-semibold text-[#172033] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-[#2457C5]" />
              <span>Evidence-Backed Case Facts Used for Discovery ({extractedFacts.length})</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#526071]">
              <span>{showFactsDrawer ? 'Hide Details' : 'Show Provenance'}</span>
              {showFactsDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </button>

          {showFactsDrawer && (
            <div className="p-4 border-t border-[#D9DEE7] divide-y divide-slate-100">
              {extractedFacts.map((fact, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-[#526071] block uppercase tracking-wider">
                      {fact.label}
                    </span>
                    <span className="text-xs font-medium text-[#172033]">{fact.value}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {fact.sourceNames && fact.sourceNames.length > 0 && (
                      <span className="text-[11px] text-[#526071] font-mono">
                        {fact.sourceNames.join(', ')}
                      </span>
                    )}
                    <ProvenanceBadge type={fact.provenance} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Controls Bar: Filter tabs & Add Custom Pathway */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
              filterType === 'all' ? 'bg-white text-[#172033] shadow-2xs' : 'text-[#526071] hover:text-[#172033]'
            }`}
          >
            All Candidate Pathways ({pathways.length})
          </button>
          <button
            onClick={() => setFilterType('selected')}
            className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
              filterType === 'selected' ? 'bg-white text-[#172033] shadow-2xs' : 'text-[#526071] hover:text-[#172033]'
            }`}
          >
            Selected in Bundle ({selectedPathways.length})
          </button>
          <button
            onClick={() => setFilterType('attempted')}
            className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
              filterType === 'attempted' ? 'bg-white text-[#172033] shadow-2xs' : 'text-[#526071] hover:text-[#172033]'
            }`}
          >
            Already Tried
          </button>
        </div>

        <button
          id="add-custom-pathway-btn"
          onClick={() => setShowCustomModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#172033] bg-white border border-[#D9DEE7] hover:bg-slate-50 rounded-lg shadow-2xs transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus size={14} className="text-[#2457C5]" />
          <span>Add Custom Pathway</span>
        </button>
      </div>

      {/* PATHWAYS LIST */}
      <div className="mt-5 space-y-6">
        {visiblePathways.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#D9DEE7] rounded-xl text-xs text-[#526071] space-y-3">
            <HelpCircle size={28} className="mx-auto text-slate-400" />
            <div className="font-bold text-[#172033] text-sm">No pathways match this filter</div>
            <p>You can adjust the filter above or manually add a custom pathway to your case.</p>
          </div>
        ) : (
          visiblePathways.map((path) => {
            const isSelected = selectedPathways.includes(path.id);
            const isAttempted = path.status === 'PREVIOUSLY_ATTEMPTED';
            const isNotRelevant = path.status === 'NOT_RELEVANT';
            const isNeedsVerification = path.status === 'NEEDS_VERIFICATION';

            return (
              <div
                key={path.id}
                id={`pathway-card-${path.id}`}
                className={`p-5 sm:p-6 bg-white border rounded-xl shadow-xs transition-all space-y-4 ${
                  isSelected
                    ? 'border-[#2457C5] ring-1.5 ring-[#2457C5]'
                    : isAttempted
                    ? 'border-slate-300 bg-slate-50/50 opacity-90'
                    : isNotRelevant
                    ? 'border-slate-200 bg-slate-50/40 opacity-70'
                    : 'border-[#D9DEE7] hover:border-slate-300'
                }`}
              >
                {/* Header: Name, Org, Jurisdiction, Match Relevance */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2457C5] text-[11px] font-bold">
                        <span>Candidate Pathway</span>
                      </span>

                      {/* Match Relevance Badge (Rule 17) */}
                      {path.confidence && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            path.confidence === 'high'
                              ? 'bg-emerald-50 text-[#18794E] border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                          title="Confidence describes relevance to the case record, not a prediction of legal outcome."
                        >
                          <span>
                            Relevance: {path.confidence === 'high' ? 'Strong match' : 'Plausible match'}
                          </span>
                        </span>
                      )}

                      {/* Status Badge if not default */}
                      {isAttempted && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200 text-[#526071] text-[11px] font-bold">
                          <History size={11} />
                          <span>Previously Attempted</span>
                        </span>
                      )}
                      {isNeedsVerification && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                          <AlertCircle size={11} />
                          <span>Needs User Verification</span>
                        </span>
                      )}
                      {isNotRelevant && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
                          <XCircle size={11} />
                          <span>Marked Not Relevant</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#172033] pt-0.5">{path.name}</h3>

                    <div className="text-xs text-[#526071] flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#172033]">{path.organization}</span>
                      <span>•</span>
                      <span>{path.jurisdiction}</span>
                      {path.statusNotes && (
                        <>
                          <span>•</span>
                          <span className="text-[#18794E] font-medium">{path.statusNotes}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Top-Right: Add to Bundle Toggle Button */}
                  <button
                    id={`toggle-pathway-${path.id}-btn`}
                    onClick={() => onTogglePathway(path.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shrink-0 self-start cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'bg-[#2457C5] hover:bg-[#1D46A0] text-white'
                        : 'bg-slate-100 text-[#526071] hover:bg-slate-200 hover:text-[#172033]'
                    }`}
                  >
                    <Check size={14} className={isSelected ? 'text-white' : 'text-slate-400'} />
                    <span>{isSelected ? 'Referenced in Case Bundle' : 'Add to My Case'}</span>
                  </button>
                </div>

                {/* Section: Why This May Be Relevant (Rule 10) */}
                <div className="text-xs sm:text-sm text-[#172033] bg-[#F8F7F3] p-4 rounded-xl border border-[#D9DEE7] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-[#526071] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#2457C5]" />
                      Why this may be relevant to your case
                    </strong>
                  </div>
                  <p className="leading-relaxed">{path.whyRelevant}</p>
                  {path.relevanceReason && (
                    <div className="text-[11px] text-[#526071] font-medium pt-1 border-t border-slate-200/60">
                      Factor match: {path.relevanceReason}
                    </div>
                  )}
                </div>

                {/* Section: Supporting Case Facts & Evidence Behind the Pathway (Rule 11) */}
                {path.supportingCaseFacts && path.supportingCaseFacts.length > 0 && (
                  <div className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-xl text-xs space-y-2">
                    <strong className="text-[11px] font-bold text-[#2457C5] uppercase tracking-wider block">
                      Supporting Evidence from Your Case Record
                    </strong>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {path.supportingCaseFacts.map((factItem, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-white rounded-lg border border-blue-100 flex items-start justify-between gap-2"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-[#526071] block">{factItem.label}</span>
                            <span className="text-xs text-[#172033] font-medium">{factItem.fact}</span>
                            {factItem.sourceNames && factItem.sourceNames.length > 0 && (
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                Source: {factItem.sourceNames.join(', ')}
                              </span>
                            )}
                          </div>
                          <ProvenanceBadge type={factItem.provenance} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Eligibility & Required Documents */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs pt-1">
                  <div className="p-3 bg-white border border-[#D9DEE7] rounded-xl space-y-1">
                    <span className="font-bold text-[#526071] block flex items-center gap-1.5">
                      <FileCheck2 size={13} className="text-[#2457C5]" />
                      Eligibility Preconditions
                    </span>
                    <p className="text-[#172033] leading-relaxed">{path.eligibility}</p>
                  </div>

                  <div className="p-3 bg-white border border-[#D9DEE7] rounded-xl space-y-1">
                    <span className="font-bold text-[#526071] block flex items-center gap-1.5">
                      <FileText size={13} className="text-[#2457C5]" />
                      Documents to Carry
                    </span>
                    <ul className="list-disc list-inside text-[#172033] space-y-0.5">
                      {(path.requiredDocuments || []).map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Steps if present */}
                {path.steps && path.steps.length > 0 && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-[#526071] block">Procedural Steps</span>
                    <ol className="list-decimal list-inside text-[#172033] space-y-0.5">
                      {path.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* What CaseCarry Does NOT Know / Uncertainties (Rule 18, 22) */}
                {(path.uncertainties && path.uncertainties.length > 0) || path.whatWeDontKnow ? (
                  <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                    <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                      <Info size={13} />
                      What Still Requires Verification:
                    </span>
                    {path.uncertainties && path.uncertainties.length > 0 ? (
                      <ul className="list-disc list-inside space-y-0.5 text-amber-950">
                        {path.uncertainties.map((u, i) => (
                          <li key={i}>{u}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-amber-950 leading-relaxed">{path.whatWeDontKnow}</p>
                    )}
                  </div>
                ) : null}

                {/* User Previous Attempt Notes if marked attempted */}
                {path.previousAttemptNotes && (
                  <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-[#172033] block">Your Notes on Previous Attempt:</span>
                    <p className="text-[#526071] italic">{path.previousAttemptNotes}</p>
                  </div>
                )}

                {/* Interactive Attempt Note Input Drawer */}
                {activeAttemptNotesId === path.id && (
                  <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl space-y-2 text-xs">
                    <label className="font-bold text-[#172033] block">
                      What happened when you tried this pathway previously?
                    </label>
                    <textarea
                      value={attemptNotesText}
                      onChange={(e) => setAttemptNotesText(e.target.value)}
                      placeholder="e.g., Submitted complaint ticket on July 14, received closure response with no refund on August 2..."
                      rows={2}
                      className="w-full p-2 border border-[#D9DEE7] rounded-lg text-xs bg-white text-[#172033]"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setActiveAttemptNotesId(null)}
                        className="px-3 py-1 rounded text-[#526071] hover:text-[#172033] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveAttemptNotes(path.id)}
                        className="px-3 py-1 bg-[#172033] text-white font-semibold rounded hover:bg-black cursor-pointer"
                      >
                        Save Attempt Status
                      </button>
                    </div>
                  </div>
                )}

                {/* Citizen Status Actions (Rule 16, 21) */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => handleMarkAttempted(path.id)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#526071] hover:text-[#172033] hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                    >
                      I already tried this
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          path.id,
                          path.status === 'NEEDS_VERIFICATION' ? 'POTENTIAL' : 'NEEDS_VERIFICATION'
                        )
                      }
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#526071] hover:text-[#172033] hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                    >
                      {path.status === 'NEEDS_VERIFICATION' ? 'Mark Verified' : 'I need to verify this'}
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          path.id,
                          path.status === 'NOT_RELEVANT' ? 'POTENTIAL' : 'NOT_RELEVANT'
                        )
                      }
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#526071] hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                    >
                      {path.status === 'NOT_RELEVANT' ? 'Restore Pathway' : 'Not relevant'}
                    </button>
                  </div>

                  {/* Official Source & Checked Date Attribution (Rule 9, 24) */}
                  <div className="flex items-center gap-3 shrink-0 text-slate-500">
                    <span className="text-[11px] flex items-center gap-1">
                      <Clock size={11} /> Checked: {path.lastCheckedDate}
                    </span>
                    {path.sourceUrl && (
                      <a
                        href={path.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2457C5] hover:underline"
                      >
                        <span>Official Source</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: ADD CUSTOM PATHWAY (Rule 23) */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#D9DEE7]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#172033]">Add Custom Next Pathway</h2>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomPathway} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#526071] mb-1">
                  Pathway / Procedure Name *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. State Small Claims Commercial Tribunal"
                  className="w-full p-2 border border-[#D9DEE7] rounded-lg bg-white text-[#172033]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#526071] mb-1">
                    Authority / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={customOrg}
                    onChange={(e) => setCustomOrg(e.target.value)}
                    placeholder="e.g. Ogun State Judiciary"
                    className="w-full p-2 border border-[#D9DEE7] rounded-lg bg-white text-[#172033]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#526071] mb-1">
                    Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={customJurisdiction}
                    onChange={(e) => setCustomJurisdiction(e.target.value)}
                    placeholder="e.g. Ogun State, Nigeria"
                    className="w-full p-2 border border-[#D9DEE7] rounded-lg bg-white text-[#172033]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#526071] mb-1">
                  Why is this pathway relevant to your case?
                </label>
                <textarea
                  rows={2}
                  value={customWhy}
                  onChange={(e) => setCustomWhy(e.target.value)}
                  placeholder="Explain why this route is appropriate for your unresolved issue..."
                  className="w-full p-2 border border-[#D9DEE7] rounded-lg bg-white text-[#172033]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#526071] mb-1">
                    Official Source / Guidance Title
                  </label>
                  <input
                    type="text"
                    value={customSource}
                    onChange={(e) => setCustomSource(e.target.value)}
                    placeholder="e.g. Small Claims Practice Directions"
                    className="w-full p-2 border border-[#D9DEE7] rounded-lg bg-white text-[#172033]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#526071] mb-1">
                    Official URL (optional)
                  </label>
                  <input
                    type="url"
                    value={customSourceUrl}
                    onChange={(e) => setCustomSourceUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 border border-[#D9DEE7] rounded-lg bg-white text-[#172033]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#526071] hover:text-[#172033] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Add to My Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-10 pt-6 border-t border-[#D9DEE7] flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          id="back-to-unresolved-bottom-btn"
          onClick={onBack}
          className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#526071] hover:text-[#172033] cursor-pointer"
        >
          {t.back}
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            id="skip-pathways-bottom-btn"
            onClick={onSkip}
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-[#526071] hover:text-[#172033] cursor-pointer"
          >
            {t.skipStep}
          </button>

          <button
            id="continue-to-privacy-btn"
            onClick={onContinue}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <span>{t.continue}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
