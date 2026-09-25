'use client';

import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  FileCheck,
  Shield,
  ShieldCheck,
  Lock,
  Smartphone,
  Wifi,
  Globe2,
  Check,
  EyeOff,
  UserCheck,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Zap,
  Clock,
  ArrowDown
} from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '@/lib/i18n';

interface LandingViewProps {
  onStartCase: () => void;
  onLoadDemoCase?: () => void;
  onExploreSampleCase?: () => void;
  onScrollToSection?: (sectionId: string) => void;
  currentLanguage?: SupportedLanguage;
}

export function LandingView({
  onStartCase,
  onLoadDemoCase,
  onExploreSampleCase,
  currentLanguage = 'en',
}: LandingViewProps) {
  const handleLoadDemo = onExploreSampleCase || onLoadDemoCase || onStartCase;
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="pt-8 sm:pt-14 pb-8 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-[#2457C5]/20 text-xs font-semibold text-[#2457C5]">
            <ShieldCheck size={14} />
            <span>{t.citizenCaseContinuity}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#172033] leading-[1.15]">
            {t.tagline}
          </h1>

          {/* Supporting Copy */}
          <p className="text-lg sm:text-xl text-[#526071] leading-relaxed max-w-2xl mx-auto">
            {t.entrySubtitle}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="hero-carry-case-forward-btn"
              type="button"
              onClick={onStartCase}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-base font-semibold rounded-xl shadow-sm transition-all focus:ring-4 focus:ring-[#2457C5]/20 cursor-pointer"
            >
              <span>{t.carryCaseForward}</span>
              <ArrowRight size={18} />
            </button>

            <button
              id="hero-how-it-works-btn"
              type="button"
              onClick={() => {
                try {
                  const el = document.getElementById('how-it-works-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                } catch {
                  try {
                    const el = document.getElementById('how-it-works-section');
                    el?.scrollIntoView();
                  } catch {}
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white hover:bg-slate-50 text-[#172033] text-base font-medium rounded-xl border border-[#D9DEE7] transition-colors cursor-pointer"
            >
              {t.howItWorks}
            </button>
          </div>

          {/* Trust Statement */}
          <div className="pt-2 text-xs sm:text-sm text-[#526071] flex items-center justify-center gap-1.5 max-w-xl mx-auto">
            <Shield size={16} className="text-[#18794E] shrink-0" />
            <span>{t.trustStatement}</span>
          </div>

          {/* Quick Demo Pre-load Pill */}
          <div className="pt-2">
            <button
              id="hero-try-demo-btn"
              type="button"
              onClick={handleLoadDemo}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#A15C00] rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Zap size={14} className="text-[#A15C00]" />
              <span>{t.tryDemoPill}</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Hero Visual — Structured Continuity Pipeline */}
        <div className="mt-12 max-w-4xl mx-auto bg-white border border-[#D9DEE7] rounded-2xl p-5 sm:p-8 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#526071] text-center mb-6">
            Citizen Case Continuity Pipeline
          </div>

          {/* Desktop flow: horizontal sequence */}
          <div className="hidden md:grid grid-cols-5 gap-2 items-center text-center">
            {/* 1. Original Report */}
            <button
              type="button"
              onClick={onStartCase}
              className="p-3.5 rounded-xl border border-[#D9DEE7] bg-slate-50 hover:bg-slate-100/80 hover:border-slate-300 flex flex-col items-center transition-all cursor-pointer text-left w-full"
            >
              <span className="text-xs font-semibold text-[#526071] mb-1">01. First Step</span>
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs mb-2">
                1
              </div>
              <h4 className="text-sm font-bold text-[#172033]">Original Report</h4>
              <p className="text-[11px] text-[#526071] mt-1 text-center">Submitted to provider or agency</p>
            </button>

            <div className="text-center font-bold text-slate-400 text-lg">→</div>

            {/* 2. Response / Silence */}
            <button
              type="button"
              onClick={onStartCase}
              className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 hover:border-amber-300 flex flex-col items-center transition-all cursor-pointer text-left w-full"
            >
              <span className="text-xs font-semibold text-[#A15C00] mb-1">02. The Breakdown</span>
              <div className="w-8 h-8 rounded-full bg-amber-200 text-[#A15C00] font-bold flex items-center justify-center text-xs mb-2">
                2
              </div>
              <h4 className="text-sm font-bold text-[#172033]">Response or Closure</h4>
              <p className="text-[11px] text-[#526071] mt-1 text-center">Closed without fixing the issue</p>
            </button>

            <div className="text-center font-bold text-slate-400 text-lg">→</div>

            {/* 3. CaseCarry & Portable Record */}
            <button
              type="button"
              onClick={onStartCase}
              className="p-3.5 rounded-xl border-2 border-[#2457C5] bg-blue-50/60 hover:bg-blue-100/70 hover:border-[#1D46A0] flex flex-col items-center transition-all cursor-pointer text-left w-full shadow-xs"
            >
              <span className="text-xs font-bold text-[#2457C5] mb-1">03. CaseCarry</span>
              <div className="w-8 h-8 rounded-full bg-[#2457C5] text-white font-bold flex items-center justify-center text-xs mb-2">
                ✓
              </div>
              <h4 className="text-sm font-bold text-[#172033]">Carry-Forward Record</h4>
              <p className="text-[11px] text-[#2457C5] font-medium mt-1 text-center">Verified & portable bundle</p>
            </button>
          </div>

          {/* Mobile flow: stacked cards */}
          <div className="md:hidden space-y-3">
            <button
              type="button"
              onClick={onStartCase}
              className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 border border-[#D9DEE7] rounded-xl flex items-center gap-3 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                1
              </div>
              <div>
                <div className="text-xs font-bold text-[#172033]">Original Report</div>
                <div className="text-[11px] text-[#526071]">Complaint or dispute originally submitted</div>
              </div>
            </button>

            <div className="flex justify-center text-slate-400">
              <ArrowDown size={16} />
            </div>

            <button
              type="button"
              onClick={onStartCase}
              className="w-full text-left p-3 bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200 rounded-xl flex items-center gap-3 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-amber-200 text-[#A15C00] font-bold flex items-center justify-center text-xs shrink-0">
                2
              </div>
              <div>
                <div className="text-xs font-bold text-[#172033]">Response received — Still unresolved</div>
                <div className="text-[11px] text-[#526071]">Ignored, rejected, closed, or contradictory</div>
              </div>
            </button>

            <div className="flex justify-center text-slate-400">
              <ArrowDown size={16} />
            </div>

            <button
              type="button"
              onClick={onStartCase}
              className="w-full text-left p-3.5 bg-blue-50/80 hover:bg-blue-100/90 border-2 border-[#2457C5] rounded-xl flex items-center gap-3 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#2457C5] text-white font-bold flex items-center justify-center text-xs shrink-0">
                ✓
              </div>
              <div>
                <div className="text-xs font-bold text-[#172033]">CaseCarry Carry-Forward Record</div>
                <div className="text-[11px] text-[#2457C5] font-medium">Reconstructed, verified chronology you control</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Section: Is this for you? */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2457C5]">Intended Situation</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] mt-1">
            You may need CaseCarry if...
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <button
            type="button"
            onClick={onStartCase}
            className="text-left bg-white border border-[#D9DEE7] rounded-xl p-6 flex flex-col justify-between shadow-xs hover:border-[#2457C5] hover:shadow-md transition-all cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-[#2457C5] group-hover:text-white text-[#2457C5] font-bold flex items-center justify-center mb-4 transition-colors">
                <FileCheck size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#172033] mb-2 group-hover:text-[#2457C5] transition-colors">Already reported the problem</h3>
              <p className="text-sm text-[#526071] leading-relaxed">
                You have already submitted a complaint, request, report, or case somewhere through a utility, organization, or authority.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-[#2457C5] font-semibold flex items-center justify-between">
              <span>Start case with reference code</span>
              <ArrowRight size={14} />
            </div>
          </button>

          {/* Card 2 */}
          <button
            type="button"
            onClick={onStartCase}
            className="text-left bg-white border border-[#D9DEE7] rounded-xl p-6 flex flex-col justify-between shadow-xs hover:border-[#A15C00] hover:shadow-md transition-all cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 group-hover:bg-[#A15C00] group-hover:text-white text-[#A15C00] font-bold flex items-center justify-center mb-4 transition-colors">
                <Clock size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#172033] mb-2 group-hover:text-[#A15C00] transition-colors">It still isn&apos;t resolved</h3>
              <p className="text-sm text-[#526071] leading-relaxed">
                You received no response, an arbitrary rejection, a transfer, a premature closure, or an answer that did not solve the underlying issue.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-[#A15C00] font-semibold flex items-center justify-between">
              <span>Carry unresolved issue forward</span>
              <ArrowRight size={14} />
            </div>
          </button>

          {/* Card 3 */}
          <button
            type="button"
            onClick={onStartCase}
            className="text-left bg-white border border-[#D9DEE7] rounded-xl p-6 flex flex-col justify-between shadow-xs hover:border-[#18794E] hover:shadow-md transition-all cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 group-hover:bg-[#18794E] group-hover:text-white text-[#18794E] font-bold flex items-center justify-center mb-4 transition-colors">
                <ArrowRight size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#172033] mb-2 group-hover:text-[#18794E] transition-colors">You need to continue</h3>
              <p className="text-sm text-[#526071] leading-relaxed">
                You need to explain what happened to another organization, regulator, advocate, or caseworker without starting from zero.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-[#18794E] font-semibold flex items-center justify-between">
              <span>Create portable evidence bundle</span>
              <ArrowRight size={14} />
            </div>
          </button>
        </div>

        <div className="text-center mt-8">
          <button
            id="mid-how-it-works-btn"
            type="button"
            onClick={() => {
              try {
                const el = document.getElementById('how-it-works-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              } catch {
                try {
                  const el = document.getElementById('how-it-works-section');
                  el?.scrollIntoView();
                } catch {}
              }
            }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2457C5] hover:text-[#1D46A0] cursor-pointer"
          >
            <span>See how it works</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Section: How It Works */}
      <section id="how-it-works-section" className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2457C5]">Simple 4-Step Continuity</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] mt-1">
            How CaseCarry works
          </h2>
          <p className="text-sm text-[#526071] mt-2">
            Scattered information → Verified case record → Carry-forward bundle
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Step 1 */}
          <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 relative">
            <div className="text-xs font-mono font-bold text-[#2457C5] mb-2">01</div>
            <h3 className="text-base font-bold text-[#172033] mb-2">Bring what you have</h3>
            <p className="text-xs sm:text-sm text-[#526071] leading-relaxed">
              Upload reports, letters, screenshots, PDFs, photos, WhatsApp messages, receipts, or paste text. You don’t need everything.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 relative">
            <div className="text-xs font-mono font-bold text-[#2457C5] mb-2">02</div>
            <h3 className="text-base font-bold text-[#172033] mb-2">Reconstruct what happened</h3>
            <p className="text-xs sm:text-sm text-[#526071] leading-relaxed">
              CaseCarry organizes the information into a clear chronology and tracks exactly where every important detail came from.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 relative">
            <div className="text-xs font-mono font-bold text-[#2457C5] mb-2">03</div>
            <h3 className="text-base font-bold text-[#172033] mb-2">Check the record</h3>
            <p className="text-xs sm:text-sm text-[#526071] leading-relaxed">
              You decide what is accurate, what needs correction, and what remains uncertain. You can edit, dispute, or add details.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 relative">
            <div className="text-xs font-mono font-bold text-[#2457C5] mb-2">04</div>
            <h3 className="text-base font-bold text-[#172033] mb-2">Carry it forward</h3>
            <p className="text-xs sm:text-sm text-[#526071] leading-relaxed">
              Create a concise, recipient-neutral case bundle containing history, the unresolved issue, verified evidence, and requested action.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Built around verification, not blind trust */}
      <section id="trust-section" className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-[#D9DEE7] rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#18794E] flex items-center gap-1.5 mb-2">
              <ShieldCheck size={16} />
              Provenance & Source-Awareness
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033]">
              Built around verification, not blind trust.
            </h2>
            <p className="text-sm text-[#526071] mt-2 leading-relaxed">
              CaseCarry never turns an unproven statement into a documented fact. We make provenance clear by combining icons, labels, colors, and plain text.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Source-backed */}
            <div className="p-4 rounded-xl border border-[#18794E]/25 bg-[#18794E]/5 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#18794E]/15 text-[#18794E] text-xs font-bold">
                <CheckCircle2 size={13} />
                <span>Source-backed</span>
              </div>
              <p className="text-xs text-[#172033] leading-relaxed font-medium">
                Information found directly in uploaded documents, letters, bills, or receipts.
              </p>
            </div>

            {/* Card 2: You said this */}
            <div className="p-4 rounded-xl border border-[#A15C00]/25 bg-[#A15C00]/5 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#A15C00]/15 text-[#A15C00] text-xs font-bold">
                <UserCheck size={13} />
                <span>You said this</span>
              </div>
              <p className="text-xs text-[#172033] leading-relaxed font-medium">
                Information provided directly by you that is not yet independently backed by a document.
              </p>
            </div>

            {/* Card 3: CaseCarry inferred */}
            <div className="p-4 rounded-xl border border-[#5B4BB7]/25 bg-[#5B4BB7]/5 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#5B4BB7]/15 text-[#5B4BB7] text-xs font-bold">
                <Sparkles size={13} />
                <span>CaseCarry inferred</span>
              </div>
              <p className="text-xs text-[#172033] leading-relaxed font-medium">
                An analytical interpretation generated while reconstructing the timeline.
              </p>
            </div>

            {/* Card 4: Needs review */}
            <div className="p-4 rounded-xl border border-[#B54708]/25 bg-[#B54708]/5 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#B54708]/15 text-[#B54708] text-xs font-bold">
                <AlertCircle size={13} />
                <span>Needs review</span>
              </div>
              <p className="text-xs text-[#172033] leading-relaxed font-medium">
                Details that are uncertain, incomplete, or where two uploaded sources contradict each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Privacy Section */}
      <section id="privacy-section" className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 text-white rounded-2xl p-6 sm:p-10">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Lock size={15} />
              Citizen Privacy First
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Your case. Your decision.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your documents can contain personal and sensitive information. CaseCarry never assumes that everything you upload should be shared.
            </p>
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-white flex items-center gap-2">
                <Check size={16} className="text-emerald-400" />
                Nothing is sent automatically.
              </div>
              <p>
                You must explicitly approve every document, event, and redacted detail before any bundle is generated or exported.
              </p>
            </div>
          </div>

          {/* Privacy controls illustration */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Control Over Every Document
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Utility Bill & Payment Receipt</div>
                <div className="text-[11px] text-slate-400">Account details visible</div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800">
                ✓ Include
              </span>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Bank Account Statement</div>
                <div className="text-[11px] text-slate-400">Contains salary or balance data</div>
              </div>
              <span className="text-xs font-bold text-amber-300 bg-amber-950/80 px-2 py-1 rounded border border-amber-800 flex items-center gap-1">
                <EyeOff size={12} /> Keep private
              </span>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Complaint Email Header</div>
                <div className="text-[11px] text-slate-400">Personal phone number & NIN</div>
              </div>
              <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded border border-slate-600">
                Redact
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Real-World Design Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2457C5]">Real-World Conditions</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] mt-1">
            Designed for real life.
          </h2>
          <p className="text-sm text-[#526071] mt-2">
            Built for older Android smartphones, intermittent networks, and local public-service contexts across Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2457C5] flex items-center justify-center">
              <Smartphone size={18} />
            </div>
            <h3 className="text-base font-bold text-[#172033]">Mobile-first</h3>
            <p className="text-xs text-[#526071] leading-relaxed">
              Take a photo of paper letters, upload WhatsApp screenshots, or attach PDFs directly from your phone screen.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#18794E] flex items-center justify-center">
              <Wifi size={18} />
            </div>
            <h3 className="text-base font-bold text-[#172033]">Low bandwidth</h3>
            <p className="text-xs text-[#526071] leading-relaxed">
              Lightweight previews, offline-draft preservation, zero unnecessary video, and resumable uploads under unstable connections.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-[#5B4BB7] flex items-center justify-center">
              <Globe2 size={18} />
            </div>
            <h3 className="text-base font-bold text-[#172033]">Multiple languages</h3>
            <p className="text-xs text-[#526071] leading-relaxed">
              Preserves original source language texts (English, Yoruba, Hausa, Igbo) alongside translations without overwriting originals.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#A15C00] flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
            <h3 className="text-base font-bold text-[#172033]">Accessible</h3>
            <p className="text-xs text-[#526071] leading-relaxed">
              High contrast text, 44px+ touch targets, readable font hierarchy, and semantic labels that never rely on color alone.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white border border-[#D9DEE7] rounded-xl p-5 space-y-2.5 sm:col-span-2">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-[#5B4BB7] flex items-center justify-center">
              <FileSpreadsheet size={18} />
            </div>
            <h3 className="text-base font-bold text-[#172033]">Local context</h3>
            <p className="text-xs text-[#526071] leading-relaxed">
              Includes verifiable local institutions and state regulators (such as OGSERC in Ogun State and FCCPC in Nigeria), official legal sources, requirements, and dates checked.
            </p>
          </div>
        </div>
      </section>

      {/* Landing Page Final CTA (Prompt section 38) */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-white border border-[#D9DEE7] rounded-2xl p-8 sm:p-12 space-y-6 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#172033]">
            Still dealing with the same problem?
          </h2>
          <p className="text-base text-[#526071] leading-relaxed max-w-xl mx-auto">
            You shouldn’t have to remember everything or tell the story from the beginning every time you need help.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="cta-carry-case-forward-btn"
              type="button"
              onClick={onStartCase}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2457C5] hover:bg-[#1D46A0] text-white text-base font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Carry my case forward</span>
              <ArrowRight size={18} />
            </button>

            <button
              id="cta-privacy-learn-more-btn"
              type="button"
              onClick={() => {
                try {
                  const el = document.getElementById('privacy-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                } catch {
                  try {
                    const el = document.getElementById('privacy-section');
                    el?.scrollIntoView();
                  } catch {}
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 text-sm font-medium text-[#526071] hover:text-[#172033] rounded-xl border border-[#D9DEE7] bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Learn how CaseCarry protects your information
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
