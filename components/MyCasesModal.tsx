'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, FolderArchive, Plus, Trash2, Clock, ChevronRight } from 'lucide-react';
import { CaseRecord } from '@/types/case';
import { listLocalCases, deleteLocalCase } from '@/lib/storage';

interface MyCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCase: (record: CaseRecord) => void;
  onStartFreshCase: () => void;
}

// Modal dialog for viewing, opening, and deleting locally stored cases from IndexedDB
export function MyCasesModal({
  isOpen,
  onClose,
  onSelectCase,
  onStartFreshCase,
}: MyCasesModalProps) {
  const [savedCases, setSavedCases] = useState<CaseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch saved cases from local IndexedDB storage
  const loadCases = useCallback(async () => {
    try {
      const cases = await listLocalCases();
      setSavedCases(cases);
    } catch (err) {
      console.warn('Failed to load local cases:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Re-fetch cases whenever modal opens
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    listLocalCases()
      .then((cases) => {
        if (isMounted) {
          setSavedCases(cases);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to load local cases:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle case deletion from IndexedDB
  const handleDeleteCase = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this case from your local browser storage?')) {
      await deleteLocalCase(id);
      await loadCases();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#D9DEE7] shadow-xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[85vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9DEE7]">
          <div>
            <h3 className="text-base font-bold text-[#172033]">
              My Saved Cases (Local Storage)
            </h3>
            <p className="text-xs text-[#526071]">
              Stored privately in this browser using IndexedDB. Never sent to cloud accounts.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: List of saved cases */}
        <div className="overflow-y-auto grow space-y-2.5 pr-1">
          {isLoading ? (
            <div className="text-center py-8 text-xs text-[#526071]">
              Loading saved cases...
            </div>
          ) : savedCases.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <FolderArchive size={32} className="mx-auto text-slate-300" />
              <p className="text-xs text-[#526071]">No local cases saved yet.</p>
              <p className="text-[11px] text-slate-400">
                When you create or edit a case, drafts and completed records are stored here automatically.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartFreshCase();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                <Plus size={14} />
                <span>Start a case now</span>
              </button>
            </div>
          ) : (
            savedCases.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  onSelectCase(c);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-[#D9DEE7] hover:border-[#2457C5] bg-[#F8F7F3] hover:bg-blue-50/40 cursor-pointer transition-all flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#172033] line-clamp-1">
                      {c.title || 'Untitled Case'}
                    </span>
                    {c.isDemo && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                        Fictional Demo
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#526071] line-clamp-1">
                    Provider: {c.provider || 'Not specified'} • {c.evidence?.length || 0} files • {c.events?.length || 0} events
                  </p>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock size={10} />
                    <span>Updated: {c.updatedAt || c.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleDeleteCase(e, c.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete from local storage"
                  >
                    <Trash2 size={14} />
                  </button>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-[#D9DEE7] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartFreshCase();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2457C5] hover:underline cursor-pointer"
          >
            <Plus size={14} />
            <span>Start another fresh case</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-[#526071] hover:text-[#172033] border border-[#D9DEE7] rounded-lg bg-white cursor-pointer hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
