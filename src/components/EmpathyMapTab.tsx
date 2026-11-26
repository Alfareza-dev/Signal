'use client';

import React from 'react';
import {
  ArrowRight,
  Brain,
  Heart,
  MessageSquareQuote,
  MousePointerClick,
} from 'lucide-react';
import { EmpathyQuadrant, Finding } from '@/types/problemhub';
import { getLabelColorClass, SourceBadge } from './SourceBadge';

interface EmpathyMapTabProps {
  findings: Finding[];
  aiReadyCount: number;
  onUpdateFinding: (findingId: string, updates: Partial<Finding>) => void;
  onSelectFinding: (finding: Finding) => void;
  onGoToFindings: () => void;
  onGoToAISynthesis: () => void;
}

const QUADRANT_CONFIG: {
  key: EmpathyQuadrant;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  headerBg: string;
  badgeText: string;
}[] = [
  {
    key: 'Says',
    title: 'Says (Diucapkan)',
    subtitle: 'Apa yang pengguna katakan secara eksplisit di ulasan atau media sosial',
    icon: <MessageSquareQuote className="w-4 h-4 text-sky-600" />,
    headerBg: 'bg-sky-50/60 border-sky-200/60',
    badgeText: 'text-sky-700 bg-sky-100/80',
  },
  {
    key: 'Thinks',
    title: 'Thinks (Dipikirkan)',
    subtitle: 'Asumsi, keraguan, atau ekspektasi mental pengguna',
    icon: <Brain className="w-4 h-4 text-violet-600" />,
    headerBg: 'bg-violet-50/60 border-violet-200/60',
    badgeText: 'text-violet-700 bg-violet-100/80',
  },
  {
    key: 'Feels',
    title: 'Feels (Dirasakan)',
    subtitle: 'Emosi, frustrasi, cemas, atau kepuasan yang dialami pengguna',
    icon: <Heart className="w-4 h-4 text-rose-600" />,
    headerBg: 'bg-rose-50/60 border-rose-200/60',
    badgeText: 'text-rose-700 bg-rose-100/80',
  },
  {
    key: 'Does',
    title: 'Does (Dilakukan)',
    subtitle: 'Tindakan nyata atau workaround yang dilakukan pengguna',
    icon: <MousePointerClick className="w-4 h-4 text-emerald-600" />,
    headerBg: 'bg-emerald-50/60 border-emerald-200/60',
    badgeText: 'text-emerald-700 bg-emerald-100/80',
  },
];

export function EmpathyMapTab({
  findings,
  aiReadyCount,
  onUpdateFinding,
  onSelectFinding,
  onGoToFindings,
  onGoToAISynthesis,
}: EmpathyMapTabProps) {
  const activeFindings = findings.filter((f) => f.status !== 'Noise / Archived');
  const unassignedCodedCount = activeFindings.filter(
    (f) =>
      (f.status === 'Pain Point' || f.status === 'Workaround') && !f.quadrant
  ).length;

  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Quadrant Empathy Mapping (0% AI · Sinkronisasi Otomatis)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Menampilkan temuan aktif yang sudah dipetakan ke kuadran. Data berstatus{' '}
            <span className="font-medium text-gray-700">Noise / Archived</span>{' '}
            otomatis disembunyikan.
          </p>
          {unassignedCodedCount > 0 && (
            <p className="mt-1.5 text-xs text-amber-700 flex items-center gap-1.5">
              <span>
                Ada <span className="font-semibold">{unassignedCodedCount}</span>{' '}
                temuan Pain Point / Workaround belum masuk kuadran —
              </span>
              <button
                type="button"
                onClick={onGoToFindings}
                className="font-semibold underline hover:text-amber-900 cursor-pointer"
              >
                Lengkapi di Findings
              </button>
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onGoToAISynthesis}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100/80 text-blue-700 border border-blue-200/80 text-xs font-medium transition-colors cursor-pointer shrink-0"
        >
          <span>
            Lanjut ke AI Synthesis{aiReadyCount > 0 ? ` (${aiReadyCount} siap)` : ''}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {QUADRANT_CONFIG.map((q) => {
          const cards = activeFindings.filter((f) => f.quadrant === q.key);

          return (
            <div
              key={q.key}
              className="rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] flex flex-col min-h-[280px]"
            >
              {/* Quadrant Header */}
              <div
                className={`px-4 py-3 border-b flex items-start justify-between gap-2 rounded-t-lg ${q.headerBg}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">{q.icon}</div>
                  <div>
                    <h3 className="text-[13px] font-semibold text-gray-900">
                      {q.title}
                    </h3>
                    <p className="text-[11px] text-gray-500">{q.subtitle}</p>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full tabular-nums ${q.badgeText}`}
                >
                  {cards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="p-3 space-y-2.5 flex-1">
                {cards.length === 0 ? (
                  <div className="h-full min-h-[160px] flex items-center justify-center text-xs text-gray-400 italic text-center px-4">
                    Belum ada temuan di kuadran {q.key}. Pilih kuadran pada tab
                    Findings untuk memasukkannya ke sini.
                  </div>
                ) : (
                  cards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => onSelectFinding(card)}
                      className="p-3.5 rounded-md bg-white border border-[#E5E7EB] hover:border-blue-300 transition-colors cursor-pointer space-y-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                    >
                      <p className="text-[12.5px] leading-relaxed text-gray-800">
                        “{card.quote}”
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-mono text-gray-400">
                            {card.id}
                          </span>
                          <SourceBadge source={card.source} />
                          {card.labels.map((lbl) => (
                            <span
                              key={lbl}
                              className={`px-1.5 py-0.5 rounded text-[10.5px] font-medium border ${getLabelColorClass(
                                lbl
                              )}`}
                            >
                              {lbl}
                            </span>
                          ))}
                        </div>

                        <div onClick={(e) => e.stopPropagation()}>
                          <select
                            value={card.quadrant || ''}
                            onChange={(e) =>
                              onUpdateFinding(card.id, {
                                quadrant: (e.target.value || undefined) as
                                  | EmpathyQuadrant
                                  | undefined,
                              })
                            }
                            aria-label="Pindah kuadran"
                            className="text-[11px] text-gray-600 bg-gray-50 border border-gray-200 rounded px-2 py-0.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="Says">Says</option>
                            <option value="Thinks">Thinks</option>
                            <option value="Feels">Feels</option>
                            <option value="Does">Does</option>
                            <option value="">Lepas Kuadran</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
