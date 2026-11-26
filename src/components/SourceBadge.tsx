'use client';

import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { EmpathyQuadrant, FindingStatus, SourcePlatform } from '@/types/problemhub';

export function SourceIcon({
  source,
  className = 'w-4 h-4',
}: {
  source: SourcePlatform;
  className?: string;
}) {
  switch (source) {
    case 'X / Twitter':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="#0F1419"
          className={className}
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );

    case 'Instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="ig-brand-grad" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F58529" />
              <stop offset="35%" stopColor="#DD2A7B" />
              <stop offset="70%" stopColor="#8134AF" />
              <stop offset="100%" stopColor="#515BD4" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#ig-brand-grad)" />
          <rect
            x="6.2"
            y="6.2"
            width="11.6"
            height="11.6"
            rx="3.5"
            stroke="#FFFFFF"
            strokeWidth="1.6"
          />
          <circle cx="12" cy="12" r="2.7" stroke="#FFFFFF" strokeWidth="1.6" />
          <circle cx="15.8" cy="8.2" r="0.9" fill="#FFFFFF" />
        </svg>
      );

    case 'Play Store':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M3.6 2.3C3.2 2.7 3 3.3 3 4.1V19.9C3 20.7 3.2 21.3 3.6 21.7L3.8 21.9L12.7 13V12.8V12.6L3.8 3.7L3.6 2.3Z"
            fill="#00D2FF"
          />
          <path
            d="M15.7 16L12.7 13V12.8V12.6L15.7 9.6L15.9 9.7L19.4 11.7C20.4 12.3 20.4 13.2 19.4 13.8L15.9 15.8L15.7 16Z"
            fill="#FFC900"
          />
          <path
            d="M15.9 15.8L12.7 12.8L3.6 21.7C4 22.1 4.6 22.1 5.4 21.7L15.9 15.8Z"
            fill="#FF3A44"
          />
          <path
            d="M15.9 9.7L5.4 3.8C4.6 3.4 4 3.4 3.6 3.8L12.7 12.8L15.9 9.7Z"
            fill="#00F076"
          />
        </svg>
      );

    case 'Jurnal (OpenAlex)':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="4" fill="#B91C1C" />
          <path
            d="M7.5 7.5H11.5C12.3 7.5 13 8.1 13 9V16.5C12.4 16.1 11.7 15.9 11 15.9H7.5V7.5Z"
            fill="#FFFFFF"
            fillOpacity="0.95"
          />
          <path
            d="M16.5 7.5H12.5C11.7 7.5 11 8.1 11 9V16.5C11.6 16.1 12.3 15.9 13 15.9H16.5V7.5Z"
            fill="#FEE2E2"
          />
        </svg>
      );

    case 'CSV / Manual':
      return <FileSpreadsheet className={`${className} text-amber-600`} />;
  }
}

export function SourceBadge({ source }: { source: SourcePlatform }) {
  const styles: Record<SourcePlatform, string> = {
    'X / Twitter': 'bg-slate-100 text-slate-800 border-slate-200/80',
    Instagram: 'bg-pink-50 text-pink-700 border-pink-200/70',
    'Play Store': 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    'Jurnal (OpenAlex)': 'bg-red-50 text-red-800 border-red-200/70',
    'CSV / Manual': 'bg-amber-50 text-amber-700 border-amber-200/70',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium ${styles[source]}`}
    >
      <SourceIcon source={source} className="w-3.5 h-3.5 shrink-0" />
      <span>{source}</span>
    </span>
  );
}

export function StatusIcon({
  status,
  className = 'w-4 h-4',
}: {
  status: FindingStatus;
  className?: string;
}) {
  switch (status) {
    case 'Raw / Perlu Triage':
      return (
        <svg viewBox="0 0 16 16" fill="none" className={`${className} text-gray-400`} aria-hidden="true">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2.5 2" />
        </svg>
      );
    case 'Pain Point':
      return (
        <svg viewBox="0 0 16 16" fill="none" className={`${className} text-blue-600`} aria-hidden="true">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 2 A6 6 0 0 1 8 14 Z" fill="currentColor" />
        </svg>
      );
    case 'Workaround':
      return (
        <svg viewBox="0 0 16 16" fill="none" className={`${className} text-purple-600`} aria-hidden="true">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 2 A6 6 0 1 1 2 8 L8 8 Z" fill="currentColor" />
        </svg>
      );
    case 'Noise / Archived':
      return (
        <svg viewBox="0 0 16 16" fill="none" className={`${className} text-gray-400`} aria-hidden="true">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5.2 5.2L10.8 10.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}

export function getLabelColorClass(label: string): string {
  const palette = [
    'bg-blue-50 text-blue-700 border-blue-200/60',
    'bg-amber-50 text-amber-700 border-amber-200/60',
    'bg-purple-50 text-purple-700 border-purple-200/60',
    'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    'bg-rose-50 text-rose-700 border-rose-200/60',
    'bg-cyan-50 text-cyan-700 border-cyan-200/60',
  ];
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export function getQuadrantBadgeClass(quadrant: EmpathyQuadrant): string {
  switch (quadrant) {
    case 'Says':
      return 'bg-sky-50 text-sky-700 border-sky-200/70';
    case 'Thinks':
      return 'bg-violet-50 text-violet-700 border-violet-200/70';
    case 'Feels':
      return 'bg-rose-50 text-rose-700 border-rose-200/70';
    case 'Does':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/70';
  }
}
