'use client';

import React, { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('CaseCarry application error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F8F7F3] text-[#172033]">
      <div className="max-w-md p-8 bg-white rounded-2xl border border-[#D9DEE7] shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-[#172033]">Something went wrong</h2>
        <p className="text-xs text-[#526071] leading-relaxed">
          CaseCarry encountered an unexpected issue. Your local case data remains preserved.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2457C5] hover:bg-[#1D46A0] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>Reload Case</span>
        </button>
      </div>
    </div>
  );
}
