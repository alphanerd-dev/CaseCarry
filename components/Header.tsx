'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Menu,
  X,
  Wifi,
  WifiOff,
  Globe,
  FolderArchive,
  Layers,
  Plus,
  Trash2,
  Clock,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { CaseRecord } from '@/types/case';
import { listLocalCases, deleteLocalCase } from '@/lib/storage';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS } from '@/lib/i18n';

interface HeaderProps {
  currentView?: string;
  activeStep?: string;
  onNavigate?: (view: string) => void;
  onGoHome?: () => void;
  onStartCase: () => void;
  onLoadSavedCase?: (record: CaseRecord) => void;
  onSelectCase?: (record: CaseRecord) => void;
  onLoadSampleCase?: () => void;
  lowBandwidth: boolean;
  onToggleLowBandwidth: () => void;
  currentLanguage?: SupportedLanguage;
  onChangeLanguage?: (lang: SupportedLanguage) => void;
  saveStatusText?: string;
}

export function Header({
  currentView,
  activeStep,
  onNavigate,
  onGoHome,
  onStartCase,
  onLoadSavedCase,
  onSelectCase,
  onLoadSampleCase,
  lowBandwidth,
  onToggleLowBandwidth,
  currentLanguage = 'en',
  onChangeLanguage,
  saveStatusText,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langNoticeOpen, setLangNoticeOpen] = useState(false);
  const [myCasesModalOpen, setMyCasesModalOpen] = useState(false);
  const [savedCases, setSavedCases] = useState<CaseRecord[]>([]);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const refreshSavedCases = async () => {
    try {
      const cases = await listLocalCases();
      setSavedCases(cases);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    if (!myCasesModalOpen) return;
    let isMounted = true;
    listLocalCases()
      .then((cases) => {
        if (isMounted) setSavedCases(cases);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [myCasesModalOpen]);

  const handleNav = (view: string) => {
    if (view === 'landing' && onGoHome) {
      onGoHome();
    } else if (onNavigate) {
      onNavigate(view);
    } else if (onGoHome) {
      onGoHome();
    }
  };

  const handleDeleteCase = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this case from your local browser storage?')) {
      await deleteLocalCase(id);
      refreshSavedCases();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#D9DEE7] transition-all">
        {/* Top Status & Integrity Bar */}
        <div className="bg-[#F8F7F3] border-b border-[#D9DEE7]/70 px-4 py-1.5 text-xs text-[#526071] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#18794E]" />
            <span className="font-semibold text-[#172033]">CaseCarry</span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-[#526071]">
              Citizen-controlled case continuity
            </span>
            {saveStatusText && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] text-[#18794E] font-medium flex items-center gap-1">
                  <CheckCircle2 size={11} /> {saveStatusText}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Low Bandwidth Mode Toggle */}
            <button
              onClick={onToggleLowBandwidth}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-medium transition-colors ${
                lowBandwidth
                  ? 'bg-emerald-50 text-[#18794E] border-[#18794E]/40 font-semibold'
                  : 'bg-white text-[#526071] border-[#D9DEE7] hover:bg-slate-50'
              }`}
              title="Low Bandwidth Mode disables heavy animations and compresses previews for 2G/3G connections"
            >
              {lowBandwidth ? <WifiOff size={11} /> : <Wifi size={11} />}
              <span>{lowBandwidth ? 'Low Bandwidth: ON' : 'Low Bandwidth'}</span>
            </button>

            {/* Multilingual Switcher */}
            <div className="relative">
              <button
                id="language-switcher-btn"
                onClick={() => setLangNoticeOpen(!langNoticeOpen)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#D9DEE7] bg-white text-[11px] text-[#526071] hover:text-[#172033] cursor-pointer transition-colors shadow-2xs"
                title="Select language / Zabi harshe / Yan asusu / Yan èdè / Select language"
                aria-label="Language Selector"
                aria-expanded={langNoticeOpen}
              >
                <Globe size={11} className="text-[#2457C5]" />
                <span className="font-semibold text-[#172033]">
                  {SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.name || 'Language'}
                </span>
                <span className="text-[9px] text-slate-400">▼</span>
              </button>

              {langNoticeOpen && (
                <div className="absolute right-0 mt-1 w-64 p-3 bg-white border border-[#D9DEE7] rounded-xl shadow-xl text-xs z-50 animate-in fade-in">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                    <div className="font-bold text-[#172033] text-xs flex items-center gap-1.5">
                      <Globe size={13} className="text-[#2457C5]" />
                      <span>Language Accessibility</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">5 languages</span>
                  </div>

                  <p className="text-[#526071] text-[11px] leading-relaxed mb-2.5">
                    Original source evidence and official references are always preserved verbatim in their original text.
                  </p>

                  <div className="space-y-1">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected = currentLanguage === lang.code;
                      return (
                        <button
                          key={lang.code}
                          id={`lang-select-${lang.code}`}
                          onClick={() => {
                            onChangeLanguage?.(lang.code);
                            setLangNoticeOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex justify-between items-center transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 text-[#2457C5] font-bold border border-[#2457C5]/30'
                              : 'text-[#172033] hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <span className="flex flex-col">
                            <span className="font-semibold">{lang.displayName}</span>
                          </span>
                          {isSelected && <span className="text-[#2457C5] font-bold text-xs">✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setLangNoticeOpen(false)}
                    className="w-full mt-2.5 pt-2 border-t border-slate-100 text-center text-[11px] text-[#526071] hover:text-[#172033] font-medium cursor-pointer"
                  >
                    {t.close || 'Close'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNav('landing')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-[#2457C5] text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-[#1D46A0] transition-colors">
                CC
              </div>
              <div>
                <span className="font-bold text-base text-[#172033] tracking-tight block leading-tight">
                  CaseCarry
                </span>
                <span className="text-[11px] text-[#526071] hidden sm:block leading-none">
                  {t.tagline}
                </span>
              </div>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* My Cases button */}
            <button
              onClick={() => setMyCasesModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033] hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-[#D9DEE7]"
            >
              <FolderArchive size={14} />
              <span>{t.myCases}</span>
              {savedCases.length > 0 && (
                <span className="bg-[#2457C5] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {savedCases.length}
                </span>
              )}
            </button>

            {/* Start Fresh Real Case button */}
            <button
              onClick={onStartCase}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2457C5] hover:bg-[#1D46A0] rounded-xl shadow-xs transition-colors"
            >
              <Plus size={14} />
              <span>{t.carryCaseForward}</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMyCasesModalOpen(true)}
              className="p-1.5 text-[#526071] hover:text-[#172033] rounded-lg border border-[#D9DEE7]"
              title="My Cases"
            >
              <FolderArchive size={18} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#526071] hover:text-[#172033]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#D9DEE7] bg-white px-4 py-3 space-y-2 text-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleNav('landing');
              }}
              className="w-full text-left py-2 font-semibold text-[#172033] border-b border-slate-100"
            >
              Home
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setMyCasesModalOpen(true);
              }}
              className="w-full text-left py-2 font-semibold text-[#172033] flex items-center justify-between border-b border-slate-100"
            >
              <span className="flex items-center gap-2">
                <FolderArchive size={15} />
                {t.myCases}
              </span>
              <span className="bg-slate-100 text-[#526071] px-2 py-0.5 rounded text-[11px]">
                {savedCases.length}
              </span>
            </button>
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartCase();
                }}
                className="w-full py-2.5 text-center font-bold text-white bg-[#2457C5] rounded-xl"
              >
                {t.carryCaseForward}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Real "My Cases" Modal */}
      {myCasesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#D9DEE7] shadow-xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[85vh] flex flex-col">
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
                onClick={() => setMyCasesModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto grow space-y-2.5 pr-1">
              {savedCases.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <FolderArchive size={32} className="mx-auto text-slate-300" />
                  <p className="text-xs text-[#526071]">No local cases saved yet.</p>
                  <p className="text-[11px] text-slate-400">
                    When you create or edit a case, drafts and completed records are stored here automatically.
                  </p>
                  <button
                    onClick={() => {
                      setMyCasesModalOpen(false);
                      onStartCase();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2457C5] text-white text-xs font-semibold rounded-xl"
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
                      const handler = onSelectCase || onLoadSavedCase;
                      if (handler) {
                        handler(c);
                        setMyCasesModalOpen(false);
                      }
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
                        onClick={(e) => handleDeleteCase(e, c.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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

            <div className="pt-3 border-t border-[#D9DEE7] flex items-center justify-between">
              <button
                onClick={() => {
                  setMyCasesModalOpen(false);
                  onStartCase();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2457C5] hover:underline"
              >
                <Plus size={14} />
                <span>Start another fresh case</span>
              </button>
              <button
                onClick={() => setMyCasesModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-[#526071] hover:text-[#172033] border border-[#D9DEE7] rounded-lg bg-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
