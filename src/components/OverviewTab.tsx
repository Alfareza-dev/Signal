'use client';

import React from 'react';
import {
  AlertCircle,
  Archive,
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Circle,
  Coins,
  Download,
  FileEdit,
  Folder,
  GitBranch,
  Layers,
  Search,
  Sparkles,
  Wrench,
} from 'lucide-react';
import {
  EmpathyQuadrant,
  FarmingSchedule,
  FinalReport,
  Finding,
  ProblemBrief,
  SourcePlatform,
} from '@/types/problemhub';
import { SourceIcon } from './SourceBadge';

interface OverviewTabProps {
  projectName: string;
  projectDescription: string;
  versionLabel?: string;
  keywordQuery?: string;
  schedule?: FarmingSchedule;
  researchNotes?: string;
  findings: Finding[];
  brief: ProblemBrief | null;
  finalReport: FinalReport | null;
  chatTokensUsed?: number;
  onUpdateResearchNotes?: (notes: string) => void;
  onGoToFindings: (filterTheme?: string) => void;
  onGoToEmpathyMap: () => void;
  onGoToAISynthesis: () => void;
  onGoToFinalResult: () => void;
  onOpenIntakeModal: () => void;
}

const MAIN_SOURCES: { key: SourcePlatform; label: string }[] = [
  { key: 'X / Twitter', label: 'X / Twitter' },
  { key: 'Instagram', label: 'Instagram' },
  { key: 'Play Store', label: 'Google Play Store' },
  { key: 'Jurnal (OpenAlex)', label: 'Jurnal (OpenAlex)' },
];

const QUADRANTS: {
  key: EmpathyQuadrant;
  title: string;
  cardClass: string;
  countClass: string;
}[] = [
  {
    key: 'Says',
    title: 'Says (Diucapkan)',
    cardClass: 'bg-orange-50/70 border-orange-200/70',
    countClass: 'text-orange-700',
  },
  {
    key: 'Thinks',
    title: 'Thinks (Dipikirkan)',
    cardClass: 'bg-violet-50/70 border-violet-200/70',
    countClass: 'text-violet-700',
  },
  {
    key: 'Feels',
    title: 'Feels (Dirasakan)',
    cardClass: 'bg-rose-50/70 border-rose-200/70',
    countClass: 'text-rose-700',
  },
  {
    key: 'Does',
    title: 'Does (Dilakukan)',
    cardClass: 'bg-emerald-50/70 border-emerald-200/70',
    countClass: 'text-emerald-700',
  },
];

function safePct(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 100);
}

export function OverviewTab({
  projectName,
  projectDescription,
  versionLabel = 'v1',
  keywordQuery = '',
  schedule,
  researchNotes = '',
  findings,
  brief,
  finalReport,
  chatTokensUsed = 0,
  onUpdateResearchNotes,
  onGoToFindings,
  onGoToEmpathyMap,
  onGoToAISynthesis,
  onGoToFinalResult,
  onOpenIntakeModal,
}: OverviewTabProps) {
  const totalFindings = findings.length;
  const rawCount = findings.filter((f) => f.status === 'Raw / Perlu Triage').length;
  const painCount = findings.filter((f) => f.status === 'Pain Point').length;
  const workaroundCount = findings.filter((f) => f.status === 'Workaround').length;
  const posCount = findings.filter((f) => f.status === 'Positif / Delighter').length;
  const noiseCount = findings.filter((f) => f.status === 'Noise / Archived').length;
  const triagedCount = totalFindings - rawCount;
  const validFindingsCount = totalFindings - noiseCount;
  const aiReadyCount = painCount + workaroundCount;

  const painPct = safePct(painCount, validFindingsCount);
  const posPct = safePct(posCount, validFindingsCount);
  const noisePct = safePct(noiseCount, totalFindings);
  const tokenSavingPct = safePct(totalFindings - aiReadyCount, totalFindings);

  // Top Tema Masalah (excluding Noise / Archived)
  const themeMap = new Map<
    string,
    { count: number; pain: number; workaround: number }
  >();
  for (const f of findings) {
    if (f.status === 'Noise / Archived') continue;
    for (const lbl of f.labels) {
      const curr = themeMap.get(lbl) || { count: 0, pain: 0, workaround: 0 };
      curr.count += 1;
      if (f.status === 'Pain Point') curr.pain += 1;
      if (f.status === 'Workaround') curr.workaround += 1;
      themeMap.set(lbl, curr);
    }
  }

  const topThemes = Array.from(themeMap.entries())
    .map(([theme, data]) => ({ theme, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const maxThemeCount = topThemes.length > 0 ? topThemes[0].count : 1;

  // Sebaran Folder
  const folderMap = new Map<string, number>();
  for (const f of findings) {
    const folder = f.folder || 'Umum';
    folderMap.set(folder, (folderMap.get(folder) || 0) + 1);
  }
  const folderDistribution = Array.from(folderMap.entries())
    .map(([folder, count]) => ({ folder, count }))
    .sort((a, b) => b.count - a.count);

  // Distribusi Sumber Data
  const openAlexCount = findings.filter(
    (f) => f.source === 'Jurnal (OpenAlex)'
  ).length;
  const csvCount = findings.filter((f) => f.source === 'CSV / Manual').length;

  // Cakupan Empathy Map
  const activeFindings = findings.filter((f) => f.status !== 'Noise / Archived');
  const empathyMapTotal = activeFindings.filter((f) => !!f.quadrant).length;

  // Research Health (4 stages)
  const stages = [
    {
      label: 'Data Terkumpul',
      done: totalFindings > 0,
      detail: `${totalFindings} temuan masuk`,
    },
    {
      label: 'Semua Raw Sudah Di-triage',
      done: totalFindings > 0 && rawCount === 0,
      detail:
        totalFindings === 0
          ? 'Belum ada data'
          : rawCount === 0
          ? 'Semua data sudah di-triage'
          : `Masih ada ${rawCount} temuan Raw yang perlu di-triage`,
    },
    {
      label: 'Minimal 1 Item di Empathy Map',
      done: empathyMapTotal > 0,
      detail: `${empathyMapTotal} item terpetakan`,
    },
    {
      label: 'AI Synthesis / Final Result',
      done: brief !== null || finalReport !== null,
      detail: finalReport
        ? `Final Result (${finalReport.mode === 'ai' ? 'AI' : 'Lokal'}) tersedia`
        : brief
        ? `Brief ${brief.id} tersedia`
        : 'Belum dijalankan',
    },
  ];
  const completedStages = stages.filter((s) => s.done).length;
  const healthPct = Math.round((completedStages / stages.length) * 100);
  const projectTokensUsed =
    (brief?.tokensUsed || 0) + (finalReport?.tokensUsed || 0) + chatTokensUsed;
  const latestProblemStatement =
    finalReport?.problemStatement || brief?.problemStatement || null;

  const handleExportSummary = () => {
    const slug = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const md = [
      `# Ringkasan Project — ${projectName}`,
      ``,
      projectDescription ? `> ${projectDescription}` : '',
      ``,
      `## Statistik Utama`,
      `- **Total Temuan:** ${totalFindings} (${triagedCount} sudah di-triage · ${rawCount} menunggu Raw)`,
      `- **Pain Points:** ${painCount} (${painPct}% dari temuan valid)`,
      `- **Workarounds:** ${workaroundCount}`,
      `- **Noise Dibuang:** ${noiseCount} (${noisePct}%)`,
      `- **Efisiensi Token AI:** ${
        projectTokensUsed > 0
          ? `${projectTokensUsed} Token (Hemat ~${tokenSavingPct}% · Cached)`
          : '0 Token (100% Lokal)'
      }`,
      ``,
      `## Top Tema Masalah`,
      ...(topThemes.length > 0
        ? topThemes.map(
            (t) =>
              `- **${t.theme}:** ${t.count} temuan (${t.pain} Pain Point, ${t.workaround} Workaround)`
          )
        : ['- Belum ada tema masalah.']),
      ``,
      `## Distribusi Sumber Data`,
      ...MAIN_SOURCES.map((s) => {
        const c = findings.filter((f) => f.source === s.key).length;
        return `- **${s.label}:** ${c} (${safePct(c, totalFindings)}%)`;
      }),
      ``,
      `## Cakupan Empathy Map`,
      ...QUADRANTS.map((q) => {
        const c = activeFindings.filter((f) => f.quadrant === q.key).length;
        return `- **${q.title}:** ${c} item`;
      }),
      ...(brief
        ? [
            ``,
            `## Rumusan Masalah Terakhir (${brief.id})`,
            brief.problemStatement,
          ]
        : []),
      ``,
      `---`,
      `_Diekspor dari Signal (Local-First UXR Research Workspace)_`,
    ]
      .filter((line) => line !== undefined)
      .join('\n');

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `signal-ringkasan-${slug || 'project'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-5 overflow-y-auto h-full bg-[#FFF7F5] animate-fade-slide">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#2D213A]">
            Ringkasan Project — {projectName}
          </h2>
          <p className="text-xs text-[#7A6B84] mt-0.5">
            {projectDescription ||
              'Ringkasan progres riset, sebaran tema, sumber data, dan kesiapan sintesis.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportSummary}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#F2E4E0] hover:bg-[#FFF0EA] text-xs font-semibold text-[#2D213A] transition-colors cursor-pointer shrink-0 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-[#7A6B84]" />
          <span>Export Ringkasan (.md)</span>
        </button>
      </div>

      {/* 5 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl border border-[#F2E4E0] bg-white space-y-1.5 shadow-[0_4px_20px_rgba(255,123,123,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6B84]">
              Total Temuan
            </span>
            <Layers className="w-4 h-4 text-[#7A6B84]" />
          </div>
          <p className="text-2xl font-bold text-[#2D213A] tabular-nums">
            {totalFindings}
          </p>
          <p className="text-[11px] text-[#7A6B84]">
            {triagedCount} sudah di-triage · {rawCount} menunggu Raw
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-[#F2E4E0] bg-white space-y-1.5 shadow-[0_4px_20px_rgba(255,123,123,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6B84]">
              Pain Points
            </span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-[#2D213A] tabular-nums">
            {painCount}
          </p>
          <p className="text-[11px] text-[#7A6B84]">
            {painPct}% dari total temuan valid
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-[#F2E4E0] bg-white space-y-1.5 shadow-[0_4px_20px_rgba(255,123,123,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6B84]">
              Workarounds
            </span>
            <Wrench className="w-4 h-4 text-[#E9B949]" />
          </div>
          <p className="text-2xl font-bold text-[#2D213A] tabular-nums">
            {workaroundCount}
          </p>
          <p className="text-[11px] text-[#7A6B84]">
            Solusi manual / akal-akalan pengguna
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-[#F2E4E0] bg-white space-y-1.5 shadow-[0_4px_20px_rgba(255,123,123,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6B84]">
              Noise Dibuang
            </span>
            <Archive className="w-4 h-4 text-[#7A6B84]" />
          </div>
          <p className="text-2xl font-bold text-[#2D213A] tabular-nums">
            {noiseCount}
          </p>
          <p className="text-[11px] text-[#7A6B84]">
            {noisePct}% disaring sebelum AI
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-[#F2E4E0] bg-white space-y-1.5 shadow-[0_4px_20px_rgba(255,123,123,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6B84]">
              Efisiensi Token AI
            </span>
            <Coins className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-[#2D213A] tabular-nums">
            {projectTokensUsed > 0 ? `${projectTokensUsed} Token` : '0 Token'}
          </p>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              {projectTokensUsed > 0
                ? `Hemat ~${tokenSavingPct}% · Cached`
                : '100% Lokal'}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Sentiment Meter (Positif / Netral vs Negatif / Pain) */}
      <div className="rounded-2xl border border-[#F2E4E0] bg-white p-4 shadow-[0_4px_20px_rgba(255,123,123,0.04)] space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-[#2D213A]">
            Sentiment Meter (Visual-First Summary)
          </span>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1.5 text-rose-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185]" />
              Negatif / Pain Point ({painPct}%)
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E9B949]" />
              Workaround ({safePct(workaroundCount, validFindingsCount)}%)
            </span>
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
              Positif / Delighter ({posPct}% · {posCount})
            </span>
          </div>
        </div>
        <div className="w-full h-3 bg-[#F6ECE9] rounded-full overflow-hidden flex">
          <div
            className="h-full bg-[#FB7185] transition-all duration-500"
            style={{ width: `${painPct}%` }}
          />
          <div
            className="h-full bg-[#E9B949] transition-all duration-500"
            style={{ width: `${safePct(workaroundCount, validFindingsCount)}%` }}
          />
          <div
            className="h-full bg-[#34D399] transition-all duration-500"
            style={{ width: `${posPct}%` }}
          />
        </div>
      </div>

      {/* Detail Konfigurasi Versi Aktif + Research Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#F2E4E0] bg-white p-4 shadow-[0_4px_20px_rgba(255,123,123,0.04)] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D213A]">
              <GitBranch className="w-3.5 h-3.5 text-[#9B85D6]" />
              Detail Konfigurasi Versi ({versionLabel})
            </span>
            {schedule?.enabled ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <CalendarClock className="w-3 h-3" />
                Auto: {schedule.frequency} · {schedule.time}
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#FFF7F5] text-[#7A6B84] border border-[#F2E4E0]">
                Manual Scrape
              </span>
            )}
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF7F5] border border-[#F2E4E0]">
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#7A6B84] mb-1">
              <Search className="w-3 h-3 text-[#FF7B7B]" />
              Keyword Query Aktif
            </div>
            <p className="text-xs font-mono text-[#2D213A] break-words">
              {keywordQuery || 'Belum ada query khusus'}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#F2E4E0] bg-white p-4 shadow-[0_4px_20px_rgba(255,123,123,0.04)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D213A]">
              <FileEdit className="w-3.5 h-3.5 text-[#FF7B7B]" />
              Research Notes ({versionLabel})
            </span>
            <span className="text-[10.5px] text-[#7A6B84]">
              Tersimpan otomatis
            </span>
          </div>
          <textarea
            rows={2}
            value={researchNotes}
            onChange={(e) => onUpdateResearchNotes?.(e.target.value)}
            placeholder="Catat hipotesis awal, konteks rilis, atau observasi penting untuk versi ini..."
            className="w-full rounded-xl border border-[#EEDCD7] bg-[#FFFDFC] px-3 py-2 text-xs text-[#2D213A] placeholder:text-[#9A8CA4] focus:outline-none focus:border-[#E9B949] resize-none"
          />
        </div>
      </div>

      {/* 2x2 Analytical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card 1: Top Tema Masalah (Interaktif) + Sebaran Folder */}
        <div className="rounded-2xl border border-[#F2E4E0] bg-white p-5 flex flex-col justify-between space-y-4 shadow-[0_4px_20px_rgba(255,123,123,0.04)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#FF7B7B]" />
                <h3 className="text-[13.5px] font-semibold text-gray-900">
                  Top Tema Masalah
                </h3>
              </div>
              <span className="text-[11px] text-gray-400">
                Klik tema untuk filter di Findings
              </span>
            </div>

            {topThemes.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-400 italic">
                Belum ada label tema kualitatif pada temuan aktif.
              </div>
            ) : (
              <div className="space-y-2.5">
                {topThemes.map((item) => {
                  const widthPct = Math.max(
                    8,
                    Math.round((item.count / maxThemeCount) * 100)
                  );
                  return (
                    <button
                      key={item.theme}
                      type="button"
                      onClick={() => onGoToFindings(item.theme)}
                      className="w-full text-left group p-1.5 -mx-1.5 rounded-md hover:bg-[#FFF0EA]/40 transition-colors cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs gap-2">
                        <span className="font-medium text-gray-800 group-hover:text-[#D9534F] truncate">
                          {item.theme}
                        </span>
                        <span className="text-[11px] text-gray-500 tabular-nums shrink-0">
                          {item.count} temuan · {item.pain} Pain
                          {item.workaround > 0
                            ? ` · ${item.workaround} Work`
                            : ''}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FF7B7B] group-hover:bg-[#F26666] rounded-full transition-all duration-300"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sebaran Folder */}
          <div className="pt-3 border-t border-[#F2E4E0]">
            <div className="flex items-center gap-1.5 mb-2">
              <Folder className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Sebaran Folder
              </span>
            </div>
            {folderDistribution.length === 0 ? (
              <p className="text-xs text-gray-400 italic">Belum ada folder.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {folderDistribution.map((f) => (
                  <span
                    key={f.folder}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F8F9FA] border border-[#F2E4E0] text-xs text-gray-700"
                  >
                    <span>{f.folder}</span>
                    <span className="text-[11px] font-semibold text-gray-400 tabular-nums">
                      {f.count}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Distribusi Sumber Data (Multi-Source) */}
        <div className="rounded-2xl border border-[#F2E4E0] bg-white p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13.5px] font-semibold text-gray-900">
                Distribusi Sumber Data
              </h3>
              <span className="text-[11px] text-gray-400">
                Multi-Source Intake
              </span>
            </div>

            <div className="space-y-3">
              {MAIN_SOURCES.map((src) => {
                const count = findings.filter(
                  (f) => f.source === src.key
                ).length;
                const pct = safePct(count, totalFindings);
                return (
                  <div key={src.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-2 font-medium text-gray-800">
                        <SourceIcon source={src.key} className="w-4 h-4" />
                        <span>{src.label}</span>
                      </span>
                      <span className="text-gray-500 tabular-nums">
                        <span className="font-semibold text-gray-800">
                          {count}
                        </span>{' '}
                        ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-700 rounded-full transition-all duration-300"
                        style={{ width: `${count > 0 ? Math.max(6, pct) : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {csvCount > 0 && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="inline-flex items-center gap-2 font-medium text-gray-700">
                    <SourceIcon source="CSV / Manual" className="w-4 h-4" />
                    <span>CSV / Manual</span>
                  </span>
                  <span className="text-gray-500 tabular-nums">
                    {csvCount} ({safePct(csvCount, totalFindings)}%)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Academic Validation Indicator */}
          <div className="pt-3 border-t border-[#F2E4E0] flex items-center justify-between gap-2">
            {openAlexCount >= 1 ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  Tervalidasi Jurnal ({openAlexCount} referensi OpenAlex)
                </span>
              </span>
            ) : (
              <>
                <span className="text-xs text-amber-700 font-medium">
                  Belum ada referensi Jurnal (OpenAlex)
                </span>
                <button
                  type="button"
                  onClick={onOpenIntakeModal}
                  className="text-xs font-semibold text-[#FF7B7B] hover:text-[#D9534F] hover:underline cursor-pointer"
                >
                  + Ambil Data
                </button>
              </>
            )}
          </div>
        </div>

        {/* Card 3: Cakupan Empathy Map (4 Kuadran) */}
        <div className="rounded-2xl border border-[#F2E4E0] bg-white p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[13.5px] font-semibold text-gray-900">
                Cakupan Empathy Map
              </h3>
              <p className="text-[11px] text-gray-400">
                {empathyMapTotal} temuan aktif terpetakan ke 4 kuadran
              </p>
            </div>

            <button
              type="button"
              onClick={onGoToEmpathyMap}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#FF7B7B] hover:text-[#D9534F] hover:underline cursor-pointer"
            >
              <span>Buka Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {QUADRANTS.map((q) => {
              const count = activeFindings.filter(
                (f) => f.quadrant === q.key
              ).length;
              return (
                <div
                  key={q.key}
                  className={`p-3 rounded-2xl border ${q.cardClass} flex flex-col justify-between min-h-[76px]`}
                >
                  <span className="text-xs font-semibold text-gray-800">
                    {q.title}
                  </span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span
                      className={`text-xl font-bold tabular-nums ${q.countClass}`}
                    >
                      {count}
                    </span>
                    {count === 0 ? (
                      <span className="text-[11px] italic text-gray-500">
                        Perlu digali
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500">kartu</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 4: Kesiapan Riset & Langkah Berikutnya */}
        <div className="rounded-2xl border border-[#F2E4E0] bg-white p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-[13.5px] font-semibold text-gray-900">
                Kesiapan Riset (Research Health)
              </h3>
              <span className="text-xs font-semibold text-[#FF7B7B] tabular-nums">
                {healthPct}% ({completedStages}/4)
              </span>
            </div>

            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF7B7B] rounded-full transition-all duration-300"
                style={{ width: `${healthPct}%` }}
              />
            </div>

            <div className="space-y-2 pt-1">
              {stages.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {s.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                    )}
                    <span
                      className={
                        s.done ? 'text-gray-800 font-medium' : 'text-gray-500'
                      }
                    >
                      {s.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 truncate">
                    {s.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contextual Next Action / Brief Snippet */}
          <div className="pt-3 border-t border-[#F2E4E0] space-y-2.5">
            {rawCount > 0 && (
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-md bg-amber-50/70 border border-amber-200/70">
                <span className="text-xs text-amber-800">
                  Masih ada <span className="font-semibold">{rawCount}</span>{' '}
                  temuan Raw yang perlu di-triage
                </span>
                <button
                  type="button"
                  onClick={() => onGoToFindings()}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 hover:underline shrink-0 cursor-pointer"
                >
                  <span>Triage Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {latestProblemStatement && (
              <div className="p-3 rounded-md bg-[#F8F9FA] border border-[#F2E4E0] space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-700">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF7B7B]" />
                    <span>Rumusan Masalah Terakhir</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {finalReport?.mode === 'local' && !brief
                        ? 'Lokal 0% AI'
                        : 'Cached'}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={
                      finalReport ? onGoToFinalResult : onGoToAISynthesis
                    }
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#FF7B7B] hover:underline cursor-pointer"
                  >
                    <span>
                      {finalReport ? 'Lihat Final Result' : 'Lihat Sintesis'}
                    </span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {latestProblemStatement}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
