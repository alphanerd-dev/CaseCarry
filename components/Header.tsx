'use client';

import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Menu, X, Wifi, WifiOff, Globe, FolderArchive, Layers } from 'lucide-react';

interface HeaderProps {
  currentView?: string;
  activeStep?: string;
  onNavigate?: (view: string) => void;
  onGoHome?: () => void;
  onStartCase: () => void;
  lowBandwidth: boolean;
  onToggleLowBandwidth: () => void;
  currentLanguage?: string;
  onChangeLanguage?: (lang: string) => void;
  savedCasesCount?: number;
}

export function Header({
  currentView,
  activeStep,
  onNavigate,
  onGoHome,
  onStartCase,
  lowBandwidth,
  onToggleLowBandwidth,
  currentLanguage = 'en',
  onChangeLanguage,
  savedCasesCount = 1,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langNoticeOpen, setLangNoticeOpen] = useState(false);

  const handleNav = (view: string) => {
    if (view === 'landing' && onGoHome) {
      onGoHome();
    } else if (onNavigate) {
      onNavigate(view);
    } else if (onGoHome) {
      onGoHome();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#D9DEE7] transition-all">
      {/* Top Banner for Low-Bandwidth / Trust Mode */}
      <div className="bg-[#F8F7F3] border-b border-[#D9DEE7]/70 px-4 py-1.5 text-xs text-[#526071] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#18794E] animate-pulse" />
          <span className="font-medium text-[#172033]">Citizen-Controlled Case Continuity</span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline">Offline-ready local draft storage</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Low Bandwidth Toggle */}
          <button
            onClick={onToggleLowBandwidth}
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-medium transition-colors ${
              lowBandwidth
                ? 'bg-emerald-50 text-[#18794E] border-[#18794E]/40'
                : 'bg-white text-[#526071] border-[#D9DEE7] hover:bg-slate-50'
            }`}
            title="Low Bandwidth Mode compresses previews and saves data on 2G/3G connections"
          >
            {lowBandwidth ? <WifiOff size={11} /> : <Wifi size={11} />}
            <span>Low Bandwidth: {lowBandwidth ? 'ON' : 'Standard'}</span>
          </button>

          {/* Multilingual button / indicator */}
          <div className="relative">
            <button
              onClick={() => setLangNoticeOpen(!langNoticeOpen)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#D9DEE7] bg-white text-[11px] text-[#526071] hover:text-[#172033]"
              title="Language settings"
            >
              <Globe size={11} />
              <span>EN</span>
              <span className="text-[10px] text-slate-400">▼</span>
            </button>

            {langNoticeOpen && (
              <div className="absolute right-0 mt-1 w-56 p-2.5 bg-white border border-[#D9DEE7] rounded-lg shadow-lg text-xs z-50 animate-in fade-in">
                <div className="font-semibold text-[#172033] mb-1">Language Preservation</div>
                <p className="text-[#526071] text-[11px] leading-relaxed mb-2">
                  CaseCarry preserves original source languages (English, Yoruba, Hausa, Igbo) without destructive auto-translation.
                </p>
                <div className="space-y-1">
                  <div className="px-2 py-1 bg-blue-50 text-[#2457C5] font-semibold rounded text-[11px] flex justify-between">
                    <span>English (Current)</span>
                    <span>✓</span>
                  </div>
                  <div className="px-2 py-1 text-slate-400 rounded text-[11px] flex justify-between">
                    <span>Yorùbá</span>
                    <span className="text-[9px] bg-slate-100 px-1 py-0.5 rounded">Architecture Ready</span>
                  </div>
                  <div className="px-2 py-1 text-slate-400 rounded text-[11px] flex justify-between">
                    <span>Hausa</span>
                    <span className="text-[9px] bg-slate-100 px-1 py-0.5 rounded">Architecture Ready</span>
                  </div>
                  <div className="px-2 py-1 text-slate-400 rounded text-[11px] flex justify-between">
                    <span>Asụsụ Igbo</span>
                    <span className="text-[9px] bg-slate-100 px-1 py-0.5 rounded">Architecture Ready</span>
                  </div>
                </div>
                <button
                  onClick={() => setLangNoticeOpen(false)}
                  className="w-full mt-2 text-center text-[10px] text-[#2457C5] hover:underline"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => handleNav('landing')}
          className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          aria-label="CaseCarry Home"
        >
          <div className="w-9 h-9 rounded-xl bg-[#2457C5] text-white flex items-center justify-center font-bold text-lg shadow-xs group-hover:bg-[#1D46A0] transition-colors">
            <Layers size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-[#172033]">CaseCarry</span>
              <span className="hidden xs:inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-[#526071] border border-[#D9DEE7]">
                Civic Continuity
              </span>
            </div>
            <p className="text-[11px] text-[#526071] hidden sm:block">
              Don’t start your story again
            </p>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#526071]">
          <button
            onClick={() => handleNav('landing')}
            className={`hover:text-[#172033] transition-colors ${currentView === 'landing' ? 'text-[#2457C5] font-semibold' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('how-it-works')}
            className="hover:text-[#172033] transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => handleNav('trust-privacy')}
            className="hover:text-[#172033] transition-colors flex items-center gap-1"
          >
            <ShieldCheck size={15} className="text-[#18794E]" />
            <span>Verification & Privacy</span>
          </button>
          <button
            onClick={() => handleNav('my-cases')}
            className={`hover:text-[#172033] transition-colors flex items-center gap-1.5 ${
              currentView === 'my-cases' ? 'text-[#2457C5] font-semibold' : ''
            }`}
          >
            <FolderArchive size={15} />
            <span>My Cases</span>
            {savedCasesCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-slate-100 text-[#172033] text-[11px] font-bold inline-flex items-center justify-center border border-[#D9DEE7]">
                {savedCasesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentView !== 'entry' && currentView !== 'evidence' && currentView !== 'bundle' ? (
            <button
              onClick={onStartCase}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors focus:ring-2 focus:ring-[#2457C5]/30 focus:outline-hidden"
            >
              <span>Carry my case forward</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => handleNav('landing')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#526071] hover:text-[#172033] border border-[#D9DEE7] rounded-xl bg-white hover:bg-slate-50 transition-colors"
            >
              Exit to Home
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#526071] hover:text-[#172033] border border-[#D9DEE7] hover:bg-slate-50"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#D9DEE7] bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <button
            onClick={() => {
              handleNav('landing');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-semibold text-[#172033] hover:text-[#2457C5]"
          >
            Home
          </button>
          <button
            onClick={() => {
              handleNav('how-it-works');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-[#526071] hover:text-[#172033]"
          >
            How it works
          </button>
          <button
            onClick={() => {
              handleNav('trust-privacy');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-[#526071] hover:text-[#172033] flex items-center gap-1.5"
          >
            <ShieldCheck size={16} className="text-[#18794E]" />
            Verification & Privacy
          </button>
          <button
            onClick={() => {
              handleNav('my-cases');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-[#526071] hover:text-[#172033] flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <FolderArchive size={16} />
              My Cases
            </span>
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-bold">1 active</span>
          </button>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onStartCase();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-sm font-semibold rounded-xl text-center shadow-xs"
            >
              Carry my case forward →
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
