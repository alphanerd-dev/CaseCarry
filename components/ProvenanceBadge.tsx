'use client';

import React from 'react';
import { CheckCircle2, UserCheck, Sparkles, AlertCircle, AlertTriangle, EyeOff } from 'lucide-react';
import { ProvenanceType } from '@/types/case';

interface ProvenanceBadgeProps {
  type: ProvenanceType | 'sensitive' | 'private' | 'redacted';
  className?: string;
  size?: 'sm' | 'md';
}

export function ProvenanceBadge({ type, className = '', size = 'md' }: ProvenanceBadgeProps) {
  const isSm = size === 'sm';
  const sizeClasses = isSm ? 'text-xs px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5 font-medium';
  const iconSize = isSm ? 12 : 14;

  switch (type) {
    case 'source-backed':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-[#18794E]/10 text-[#18794E] border border-[#18794E]/25 ${sizeClasses} ${className}`}
          title="Information found directly in uploaded material"
        >
          <CheckCircle2 size={iconSize} aria-hidden="true" className="shrink-0" />
          <span className="font-semibold">Source-backed</span>
        </span>
      );
    case 'user-reported':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-[#A15C00]/10 text-[#A15C00] border border-[#A15C00]/25 ${sizeClasses} ${className}`}
          title="Information provided by the user that is not independently supported by a document"
        >
          <UserCheck size={iconSize} aria-hidden="true" className="shrink-0" />
          <span className="font-semibold">You said this</span>
        </span>
      );
    case 'inferred':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-[#5B4BB7]/10 text-[#5B4BB7] border border-[#5B4BB7]/25 ${sizeClasses} ${className}`}
          title="An interpretation generated while organizing the record"
        >
          <Sparkles size={iconSize} aria-hidden="true" className="shrink-0" />
          <span className="font-semibold">CaseCarry inferred</span>
        </span>
      );
    case 'needs-review':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-[#B54708]/10 text-[#B54708] border border-[#B54708]/25 ${sizeClasses} ${className}`}
          title="Information that is uncertain, incomplete, or contradictory"
        >
          <AlertCircle size={iconSize} aria-hidden="true" className="shrink-0" />
          <span className="font-semibold">Needs review</span>
        </span>
      );
    case 'conflict':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-[#A33A3A]/10 text-[#A33A3A] border border-[#A33A3A]/30 ${sizeClasses} ${className}`}
          title="Two or more uploaded sources contradict each other"
        >
          <AlertTriangle size={iconSize} aria-hidden="true" className="shrink-0" />
          <span className="font-semibold">Sources conflict</span>
        </span>
      );
    case 'private':
    case 'sensitive':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-[#A33A3A]/10 text-[#A33A3A] border border-[#A33A3A]/25 ${sizeClasses} ${className}`}
          title="Marked as private — will not be included in shared bundle"
        >
          <EyeOff size={iconSize} aria-hidden="true" className="shrink-0" />
          <span className="font-semibold">Private & confidential</span>
        </span>
      );
    case 'redacted':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses} ${className}`}
          title="Sensitive details have been redacted"
        >
          <span className="w-2.5 h-1.5 bg-slate-600 rounded-xs inline-block shrink-0" />
          <span className="font-semibold">Redacted</span>
        </span>
      );
    default:
      return null;
  }
}
