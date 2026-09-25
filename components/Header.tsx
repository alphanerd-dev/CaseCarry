'use client';

import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Wifi,
  WifiOff,
  FolderArchive,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { CaseRecord } from '@/types/case';
import { listLocalCases } from '@/lib/storage';
import { SupportedLanguage, TRANSLATIONS } from '@/lib/i18n';
import { LanguageSelector } from '@/components/LanguageSelector';
import { MyCasesModal } from '@/components/MyCasesModal';

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

// Universal Header containing navigation, bandwidth toggles, language switcher, and saved case access
export function Header({
  onNavigate,
  onGoHome,
  onStartCase,
  onLoadSavedCase,
  onSelectCase,
  lowBandwidth,
  onToggleLowBandwidth,
  currentLanguage = 'en',
  onChangeLanguage,
  saveStatusText,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [myCasesModalOpen, setMyCasesModalOpen] = useState(false);
  const [savedCasesCount, setSavedCasesCount] = useState<number>(0);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Track saved case count for the badge
  useEffect(() => {
    let isMounted = true;
    listLocalCases()
      .then((cases) => {
        if (isMounted) setSavedCasesCount(cases.length);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [myCasesModalOpen]);

  // Navigate to specified view or home
  const handleNav = (view: string) => {
    if (view === 'landing' && onGoHome) {
      onGoHome();
    } else if (onNavigate) {
      onNavigate(view);
    } else if (onGoHome) {
      onGoHome();
    }
  };

  const handleCaseSelect = (record: CaseRecord) => {
    const handler = onSelectCase || onLoadSavedCase;
    if (handler) {
      handler(record);
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
              id="low-bandwidth-toggle-btn"
              type="button"
              onClick={onToggleLowBandwidth}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-medium transition-colors cursor-pointer ${
                lowBandwidth
                  ? 'bg-emerald-50 text-[#18794E] border-[#18794E]/40 font-semibold'
                  : 'bg-white text-[#526071] border-[#D9DEE7] hover:bg-slate-50'
              }`}
              title="Low Bandwidth Mode disables heavy animations and compresses previews for 2G/3G connections"
            >
              {lowBandwidth ? <WifiOff size={11} /> : <Wifi size={11} />}
              <span>{lowBandwidth ? 'Low Bandwidth: ON' : 'Low Bandwidth'}</span>
            </button>

            {/* Isolated Multilingual Switcher */}
            <LanguageSelector
              currentLanguage={currentLanguage}
              onChangeLanguage={onChangeLanguage}
            />
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              id="header-home-btn"
              type="button"
              onClick={() => handleNav('landing')}
              className="flex items-center gap-2 group text-left cursor-pointer"
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
              id="header-my-cases-btn"
              type="button"
              onClick={() => setMyCasesModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#526071] hover:text-[#172033] hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-[#D9DEE7] cursor-pointer"
            >
              <FolderArchive size={14} />
              <span>{t.myCases}</span>
              {savedCasesCount > 0 && (
                <span className="bg-[#2457C5] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {savedCasesCount}
                </span>
              )}
            </button>

            {/* Start Fresh Real Case button */}
            <button
              id="header-start-case-btn"
              type="button"
              onClick={onStartCase}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2457C5] hover:bg-[#1D46A0] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>{t.carryCaseForward}</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMyCasesModalOpen(true)}
              className="p-1.5 text-[#526071] hover:text-[#172033] rounded-lg border border-[#D9DEE7] cursor-pointer"
              title="My Cases"
            >
              <FolderArchive size={18} />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#526071] hover:text-[#172033] cursor-pointer"
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
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleNav('landing');
              }}
              className="w-full text-left py-2 font-semibold text-[#172033] border-b border-slate-100 cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setMyCasesModalOpen(true);
              }}
              className="w-full text-left py-2 font-semibold text-[#172033] flex items-center justify-between border-b border-slate-100 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FolderArchive size={15} />
                {t.myCases}
              </span>
              <span className="bg-slate-100 text-[#526071] px-2 py-0.5 rounded text-[11px]">
                {savedCasesCount}
              </span>
            </button>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartCase();
                }}
                className="w-full py-2.5 text-center font-bold text-white bg-[#2457C5] rounded-xl cursor-pointer"
              >
                {t.carryCaseForward}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Isolated "My Cases" Modal */}
      <MyCasesModal
        isOpen={myCasesModalOpen}
        onClose={() => setMyCasesModalOpen(false)}
        onSelectCase={handleCaseSelect}
        onStartFreshCase={onStartCase}
      />
    </>
  );
}
