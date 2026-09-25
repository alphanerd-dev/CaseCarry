'use client';

import React from 'react';

// Standardized civic footer reinforcing citizen sovereignty and recipient neutrality
export function CivicFooter() {
  return (
    <footer className="border-t border-[#D9DEE7] bg-white py-6 px-4 text-xs text-[#526071] print:hidden">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#172033]">CaseCarry</span>
          <span>•</span>
          <span>Don’t tell your story again.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Citizen Controlled</span>
          <span>•</span>
          <span>Zero Automated Submissions</span>
          <span>•</span>
          <span>Recipient Neutral</span>
        </div>
      </div>
    </footer>
  );
}
