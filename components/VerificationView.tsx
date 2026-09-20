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
  Sparkles
} from 'lucide-react';
import { CaseEvent, EvidenceFile, ProvenanceType } from '@/types/case';
import { ProvenanceBadge } from './ProvenanceBadge';

interface VerificationViewProps {
  events: CaseEvent[];
  evidenceList: EvidenceFile[];
  onUpdateEvent: (updated: CaseEvent) => void;
  onDeleteEvent: (id: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function VerificationView({
  events,
  evidenceList,
  onUpdateEvent,
  onDeleteEvent,
  onContinue,
  onBack,
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

  const verifiedCount = events.filter((e) => e.verifiedByUser).length;

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
      provenance: 'needs-review',
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
      notes: 'Citizen noted "I don’t know" regarding exact details.',
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033] mb-6 p-1 rounded-md transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Reconstruction</span>
      </button>

      {/* Progress pill */}
      <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2457C5] text-xs font-semibold border border-blue-100">
        <span>Step 4 of 6</span>
        <span>•</span>
        <span>Citizen Verification</span>
      </div>

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
            Check your case record
          </h1>
          <p className="text-sm text-[#526071] mt-1">
            We’ve organized the information. You decide what belongs in your record.
          </p>
        </div>

        {/* Verification Counter */}
        <div className="px-3.5 py-2 bg-white border border-[#D9DEE7] rounded-xl text-xs font-semibold text-[#172033] shrink-0 self-start sm:self-auto flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#18794E]" />
          <span>
            {verifiedCount} of {events.length} Reviewed
          </span>
        </div>
      </div>

      {/* Events Verification List */}
      <div className="space-y-4">
        {events.map((ev) => {
          const isEditing = editingEventId === ev.id;

          if (isEditing) {
            return (
              <div
                key={ev.id}
                className="p-5 bg-white border-2 border-[#2457C5] rounded-xl shadow-md space-y-4 animate-in fade-in"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase text-[#2457C5]">
                    Edit Event Details
                  </span>
                  <button
                    onClick={() => setEditingEventId(null)}
                    className="text-[#526071] hover:text-[#172033]"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="text-xs font-bold text-[#172033] block mb-1">
                      Date / Period
                    </label>
                    <input
                      type="text"
                      value={editForm.displayDate}
                      onChange={(e) => setEditForm({ ...editForm, displayDate: e.target.value })}
                      className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[#172033] block mb-1">
                      Information Provenance
                    </label>
                    <select
                      value={editForm.provenance}
                      onChange={(e) =>
                        setEditForm({ ...editForm, provenance: e.target.value as ProvenanceType })
                      }
                      className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg text-xs bg-white"
                    >
                      <option value="source-backed">Source-backed (Backed by document)</option>
                      <option value="user-reported">You said this (Citizen statement)</option>
                      <option value="inferred">CaseCarry inferred (Analysis)</option>
                      <option value="needs-review">Needs review (Uncertain)</option>
                      <option value="conflict">Sources conflict (Contradiction)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#172033] block mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#172033] block mb-1">
                    Description & Details
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D9DEE7] rounded-lg text-xs resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setEditingEventId(null)}
                    className="px-3 py-1.5 border border-[#D9DEE7] text-xs font-semibold rounded-lg text-[#526071]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveEdit(ev)}
                    className="px-4 py-1.5 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-xs font-semibold rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={ev.id}
              className={`p-4 sm:p-5 bg-white border rounded-xl shadow-xs transition-colors space-y-3 ${
                ev.disputed
                  ? 'border-amber-300 bg-amber-50/30'
                  : ev.verifiedByUser
                  ? 'border-[#D9DEE7] hover:border-slate-300'
                  : 'border-blue-200 bg-blue-50/20'
              }`}
            >
              {/* Top Row: Date + Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#526071]">{ev.displayDate}</span>
                  {ev.verifiedByUser && (
                    <span className="text-[11px] font-semibold text-[#18794E] flex items-center gap-1">
                      <Check size={13} /> Confirmed
                    </span>
                  )}
                  {ev.disputed && (
                    <span className="text-[11px] font-semibold text-[#A15C00] flex items-center gap-1">
                      <AlertTriangle size={13} /> Disputed
                    </span>
                  )}
                </div>

                <ProvenanceBadge type={ev.provenance} size="sm" />
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#172033]">
                  {ev.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#526071] mt-1 leading-relaxed">
                  {ev.description}
                </p>
              </div>

              {/* Source tags */}
              {ev.sourceNames.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap text-xs text-[#526071]">
                  <span className="text-slate-400">Sources:</span>
                  {ev.sourceNames.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] text-[#172033]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Controls Bar (Section 15) */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Confirm button */}
                  <button
                    onClick={() => markConfirmed(ev)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
                      ev.verifiedByUser && !ev.disputed
                        ? 'bg-emerald-50 text-[#18794E] border border-emerald-200'
                        : 'bg-white border border-[#D9DEE7] text-[#172033] hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 size={13} className="text-[#18794E]" />
                    <span>Confirm</span>
                  </button>

                  {/* Edit button */}
                  <button
                    onClick={() => startEdit(ev)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#D9DEE7] text-[#172033] hover:bg-slate-50 inline-flex items-center gap-1 transition-colors"
                  >
                    <Edit3 size={13} className="text-[#2457C5]" />
                    <span>Edit</span>
                  </button>

                  {/* Mark disputed */}
                  <button
                    onClick={() => markDisputed(ev)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
                      ev.disputed
                        ? 'bg-amber-100 text-[#A15C00] border border-amber-300'
                        : 'bg-white border border-[#D9DEE7] text-[#526071] hover:bg-slate-50'
                    }`}
                  >
                    <AlertTriangle size={13} className="text-[#A15C00]" />
                    <span>Mark disputed</span>
                  </button>

                  {/* I don't know */}
                  <button
                    onClick={() => markUncertain(ev)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#D9DEE7] text-[#526071] hover:bg-slate-50 inline-flex items-center gap-1 transition-colors"
                  >
                    <HelpCircle size={13} />
                    <span>I don&apos;t know</span>
                  </button>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => onDeleteEvent(ev.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete event from case record"
                  aria-label={`Delete event ${ev.title}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-8 pt-4 border-t border-[#D9DEE7] flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl border border-[#D9DEE7] text-sm font-semibold text-[#526071] hover:text-[#172033] bg-white hover:bg-slate-50 transition-colors"
        >
          Back
        </button>

        <button
          onClick={onContinue}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#2457C5] hover:bg-[#1D46A0] text-white shadow-xs transition-colors"
        >
          <span>What remains unresolved</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
