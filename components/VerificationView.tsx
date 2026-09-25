'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Edit3,
  Trash2,
  AlertTriangle,
  HelpCircle,
  PlusCircle,
  X,
  Check,
  Calendar,
  FileText,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { CaseEvent, EvidenceFile, ProvenanceType } from '@/types/case';
import { ProvenanceBadge } from './ProvenanceBadge';
import { SupportedLanguage, TRANSLATIONS } from '@/lib/i18n';

interface VerificationViewProps {
  events: CaseEvent[];
  evidenceList: EvidenceFile[];
  onUpdateEvent: (updated: CaseEvent) => void;
  onDeleteEvent: (id: string) => void;
  onAddCustomEvent?: (event: CaseEvent) => void;
  onVerifyAllSourceBacked?: () => void;
  onContinue: () => void;
  onBack: () => void;
  isDemoMode?: boolean;
  verificationReviewed?: boolean;
  onToggleVerificationReviewed?: (reviewed: boolean) => void;
  currentLanguage?: SupportedLanguage;
}

export function VerificationView({
  events,
  evidenceList,
  onUpdateEvent,
  onDeleteEvent,
  onAddCustomEvent,
  onVerifyAllSourceBacked,
  onContinue,
  onBack,
  isDemoMode,
  verificationReviewed = false,
  onToggleVerificationReviewed,
  currentLanguage = 'en',
}: VerificationViewProps) {
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    description: string;
    displayDate: string;
    provenance: ProvenanceType;
    conflictDetails?: string;
  }>({
    title: '',
    description: '',
    displayDate: '',
    provenance: 'source-backed',
  });

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newProv, setNewProv] = useState<ProvenanceType>('user-reported');

  const verifiedCount = events.filter((e) => e.verifiedByUser).length;
  const progressPercent = events.length > 0 ? Math.round((verifiedCount / events.length) * 100) : 0;

  const startEdit = (ev: CaseEvent) => {
    setEditingEventId(ev.id);
    setEditForm({
      title: ev.title,
      description: ev.description,
      displayDate: ev.displayDate,
      provenance: ev.provenance,
      conflictDetails: ev.conflictDetails || '',
    });
  };

  const saveEdit = (ev: CaseEvent) => {
    onUpdateEvent({
      ...ev,
      title: editForm.title,
      description: editForm.description,
      displayDate: editForm.displayDate,
      provenance: editForm.provenance,
      conflictDetails: editForm.conflictDetails || undefined,
      verifiedByUser: true,
    });
    setEditingEventId(null);
  };

  const markConfirmed = (ev: CaseEvent) => {
    onUpdateEvent({
      ...ev,
      verifiedByUser: true,
      disputed: false,
    });
  };

  const markDisputed = (ev: CaseEvent) => {
    onUpdateEvent({
      ...ev,
      disputed: true,
      provenance: 'conflict',
      provenanceLabel: 'Disputed claim',
      verifiedByUser: true,
      notes: 'Marked as disputed by citizen during case verification.',
    });
  };

  const markUncertain = (ev: CaseEvent) => {
    onUpdateEvent({
      ...ev,
      provenance: 'needs-review',
      provenanceLabel: 'Needs review (Uncertain)',
      verifiedByUser: false,
      notes: 'Citizen indicated uncertainty regarding exact details.',
    });
  };

  const handleCreateNewEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEv: CaseEvent = {
      id: `ev-manual-${Date.now()}`,
      date: newDate.trim() || 'Date not established',
      displayDate: newDate.trim() || 'Date not established',
      datePrecision: newDate.trim() ? 'exact' : 'not-established',
      title: newTitle,
      description: newDesc || newTitle,
      provenance: newProv,
      provenanceLabel:
        newProv === 'USER_REPORTED' || newProv === 'user-reported'
          ? 'You reported this'
          : 'Source-backed',
      sourceIds: [],
      sourceNames: ['Citizen Statement'],
      verifiedByUser: true,
      category: 'complaint',
    };

    if (onAddCustomEvent) {
      onAddCustomEvent(newEv);
    }
    setNewTitle('');
    setNewDate('');
    setNewDesc('');
    setAddModalOpen(false);
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
        <span>Step 4 of 8</span>
        <span>•</span>
        <span>{t.stepVerification}</span>
      </div>

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
            {t.verifyTitle}
          </h1>
          <p className="text-sm sm:text-base text-[#526071] mt-1">
            {t.verifySubtitle}
          </p>
        </div>
      </div>

      {/* Verification Status Banner */}
      <div className="p-4 bg-white border border-[#D9DEE7] rounded-xl shadow-xs space-y-3 mb-6">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[#172033] flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-[#18794E]" />
            Verification Status: {verifiedCount} of {events.length} confirmed
          </span>
          <span className="text-[#2457C5]">{progressPercent}% verified</span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#18794E] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <p className="text-[11px] text-[#526071]">
            You have the final say on what is included, reworded, or marked as disputed.
          </p>
          <div className="flex items-center gap-2">
            {onVerifyAllSourceBacked && (
              <button
                onClick={onVerifyAllSourceBacked}
                className="text-xs font-semibold text-[#18794E] hover:underline"
              >
                Confirm all source-backed events
              </button>
            )}
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setAddModalOpen(true)}
              className="text-xs font-semibold text-[#2457C5] hover:underline flex items-center gap-1"
            >
              <PlusCircle size={12} />
              <span>Add missing event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Events List for Verification */}
      <div className="space-y-4">
        {events.length === 0 && (
          <div className="p-8 text-center bg-white border border-[#D9DEE7] rounded-2xl shadow-xs space-y-3">
            <p className="text-sm font-semibold text-[#172033]">No chronological events to verify yet.</p>
            <p className="text-xs text-[#526071]">
              You can add an event manually or proceed directly to defining the unresolved issue.
            </p>
            <div className="pt-2">
              <button
                type="button"
                id="verification-add-empty-btn"
                onClick={() => setAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <PlusCircle size={14} />
                <span>Add Missing Event Manually</span>
              </button>
            </div>
          </div>
        )}

        {events.map((ev, idx) => {
          const isEditing = editingEventId === ev.id;

          return (
            <div
              key={ev.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                ev.verifiedByUser
                  ? 'bg-white border-emerald-200 ring-1 ring-emerald-200/50'
                  : 'bg-white border-[#D9DEE7] shadow-xs'
              }`}
            >
              {isEditing ? (
                /* Inline Edit Form */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-[#172033]">
                      Editing Event #{idx + 1}
                    </span>
                    <button
                      onClick={() => setEditingEventId(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#526071] mb-1">
                      Event Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-1.5 border border-[#D9DEE7] rounded-lg text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#526071] mb-1">
                        Date or Timeframe
                      </label>
                      <input
                        type="text"
                        value={editForm.displayDate}
                        onChange={(e) =>
                          setEditForm({ ...editForm, displayDate: e.target.value })
                        }
                        className="w-full px-3 py-1.5 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#526071] mb-1">
                        Provenance
                      </label>
                      <select
                        value={editForm.provenance}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            provenance: e.target.value as ProvenanceType,
                          })
                        }
                        className="w-full px-3 py-1.5 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden bg-white"
                      >
                        <option value="SOURCE_BACKED">Source-backed (from document/receipt)</option>
                        <option value="USER_REPORTED">You reported this (personal statement)</option>
                        <option value="AI_INFERRED">CaseCarry inferred (deduced from evidence)</option>
                        <option value="NEEDS_REVIEW">Needs review (uncertain date or fact)</option>
                        <option value="SOURCE_CONFLICT">Sources conflict (contradiction between records)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#526071] mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      className="w-full p-2.5 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingEventId(null)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => saveEdit(ev)}
                      className="px-4 py-1.5 bg-[#2457C5] text-white text-xs font-semibold rounded-lg hover:bg-[#1D46A0]"
                    >
                      Save Changes & Verify
                    </button>
                  </div>
                </div>
              ) : (
                /* View & Action Mode */
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#526071] flex items-center gap-1">
                        <Calendar size={12} />
                        {ev.displayDate}
                      </span>
                      <ProvenanceBadge type={ev.provenance} size="sm" />
                    </div>

                    {ev.verifiedByUser ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#18794E] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Check size={11} /> Verified by you
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Needs your confirmation
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#172033]">
                      {ev.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#526071] mt-1 leading-relaxed">
                      {ev.description}
                    </p>
                  </div>

                  {ev.conflictDetails && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 leading-relaxed">
                      <strong className="text-rose-800">Contradiction:</strong> {ev.conflictDetails}
                    </div>
                  )}

                  {/* Verification Control Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Confirm button */}
                      <button
                        onClick={() => markConfirmed(ev)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
                          ev.verifiedByUser && !ev.disputed
                            ? 'bg-[#18794E] text-white'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-[#18794E] border border-emerald-200'
                        }`}
                      >
                        <Check size={13} />
                        <span>Confirm as accurate</span>
                      </button>

                      {/* Edit button */}
                      <button
                        onClick={() => startEdit(ev)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#D9DEE7] text-xs font-semibold text-[#526071] hover:text-[#172033] hover:bg-slate-50 inline-flex items-center gap-1"
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>

                      {/* Disputed button */}
                      <button
                        onClick={() => markDisputed(ev)}
                        className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 inline-flex items-center gap-1"
                        title="Mark this event as disputed by one or both parties"
                      >
                        <AlertTriangle size={13} />
                        <span>Mark disputed</span>
                      </button>

                      {/* I don't know button */}
                      <button
                        onClick={() => markUncertain(ev)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#526071] hover:bg-slate-50 inline-flex items-center gap-1"
                        title="Mark date or detail as uncertain"
                      >
                        <HelpCircle size={13} />
                        <span>I don’t know</span>
                      </button>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => onDeleteEvent(ev.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove event from chronology"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Explicit Citizen Verification Gate Acknowledgment */}
      <div
        className={`mt-8 p-5 rounded-2xl border transition-all ${
          verificationReviewed
            ? 'bg-emerald-50/70 border-emerald-300'
            : 'bg-white border-[#D9DEE7] shadow-xs'
        }`}
      >
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={verificationReviewed}
            onChange={(e) => onToggleVerificationReviewed?.(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-[#2457C5] focus:ring-[#2457C5]"
          />
          <div>
            <span className="text-sm font-bold text-[#172033] block">
              I have reviewed this case record and confirmed the facts within my knowledge.
            </span>
            <p className="text-xs text-[#526071] mt-1 leading-relaxed">
              Every important claim in this record will be preserved with its audit source. Exporting or carrying this bundle forward requires explicit review by you as the citizen complainant.
            </p>
          </div>
        </label>
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 pt-6 border-t border-[#D9DEE7] flex items-center justify-between">
        <button
          id="verification-back-btn"
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#526071] hover:text-[#172033] cursor-pointer"
        >
          {t.back}
        </button>

        <button
          id="verification-continue-btn"
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <span>{t.continue}</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Add Missing Event Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#D9DEE7] shadow-xl max-w-lg w-full p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9DEE7]">
              <h3 className="text-base font-bold text-[#172033]">
                Add Missing Event to Chronology
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#526071] mb-1">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Visited customer service hub in person"
                  className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#526071] mb-1">
                  Date or Approximate Date
                </label>
                <input
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  placeholder="e.g. 24 August 2026 or 'Late August'"
                  className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#526071] mb-1">
                  Description of What Happened
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Details of the interaction, what was promised, who you met..."
                  className="w-full p-2.5 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#526071] mb-1">
                  Provenance Type
                </label>
                <select
                  value={newProv}
                  onChange={(e) => setNewProv(e.target.value as ProvenanceType)}
                  className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg text-xs sm:text-sm text-[#172033] focus:border-[#2457C5] focus:outline-hidden bg-white"
                >
                  <option value="user-reported">You reported this (personal statement)</option>
                  <option value="source-backed">Source-backed (has document)</option>
                  <option value="needs-review">Needs review (uncertain)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#526071] hover:text-[#172033]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2457C5] text-white text-xs font-semibold rounded-xl hover:bg-[#1D46A0]"
                >
                  Save & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
