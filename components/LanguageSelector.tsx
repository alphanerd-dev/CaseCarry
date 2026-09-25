'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS } from '@/lib/i18n';

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onChangeLanguage?: (lang: SupportedLanguage) => void;
}

// Multilingual switcher with accessible information disclaimer
export function LanguageSelector({
  currentLanguage,
  onChangeLanguage,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage);

  return (
    <div className="relative" ref={containerRef}>
      {/* Toggle button */}
      <button
        id="language-switcher-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#D9DEE7] bg-white text-[11px] text-[#526071] hover:text-[#172033] cursor-pointer transition-colors shadow-2xs"
        title="Select language / Zabi harshe / Yan asusu / Yan èdè"
        aria-label="Language Selector"
        aria-expanded={isOpen}
      >
        <Globe size={11} className="text-[#2457C5]" />
        <span className="font-semibold text-[#172033]">
          {currentLangObj?.name || 'Language'}
        </span>
        <span className="text-[9px] text-slate-400">▼</span>
      </button>

      {/* Language menu modal dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-64 p-3 bg-white border border-[#D9DEE7] rounded-xl shadow-xl text-xs z-50 animate-in fade-in">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
            <div className="font-bold text-[#172033] text-xs flex items-center gap-1.5">
              <Globe size={13} className="text-[#2457C5]" />
              <span>Language Accessibility</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {SUPPORTED_LANGUAGES.length} languages
            </span>
          </div>

          <p className="text-[#526071] text-[11px] leading-relaxed mb-2.5">
            Original source evidence and official references are always preserved verbatim in their original text.
          </p>

          {/* List of supported regional languages */}
          <div className="space-y-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  id={`lang-select-${lang.code}`}
                  type="button"
                  onClick={() => {
                    onChangeLanguage?.(lang.code);
                    setIsOpen(false);
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

          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full mt-2.5 pt-2 border-t border-slate-100 text-center text-[11px] text-[#526071] hover:text-[#172033] font-medium cursor-pointer"
          >
            {t.close || 'Close'}
          </button>
        </div>
      )}
    </div>
  );
}
