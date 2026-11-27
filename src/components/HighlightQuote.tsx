'use client';

import React from 'react';
import { ThresholdConfig } from '@/types/problemhub';

export function getActiveKeywords(config: ThresholdConfig): string[] {
  const kwParam = config.parameters.find(
    (p) => p.active && p.type === 'keyword'
  );
  return kwParam?.keywords || [];
}

export function HighlightQuote({
  text,
  keywords,
  className = '',
}: {
  text: string;
  keywords: string[];
  className?: string;
}) {
  if (!keywords || keywords.length === 0) {
    return <span className={className}>{text}</span>;
  }

  const escaped = keywords
    .filter((k) => k.trim().length > 0)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (escaped.length === 0) {
    return <span className={className}>{text}</span>;
  }

  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        const isMatch = keywords.some(
          (kw) => kw.toLowerCase() === part.toLowerCase()
        );
        return isMatch ? (
          <mark
            key={idx}
            className="bg-amber-100 text-[#2D213A] font-semibold px-1 rounded mx-0.5"
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={idx}>{part}</React.Fragment>
        );
      })}
    </span>
  );
}
