'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Cpu,
  Download,
  Loader2,
  Sparkles,
  Square,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import {
  Finding,
  LocalCluster,
  ProblemBrief,
  WorkspaceSettings,
} from '@/types/problemhub';
import { buildLocalClusters, buildProblemBrief } from '@/data/mockData';
import { SourceBadge } from './SourceBadge';

interface AISynthesisTabProps {
  projectName: string;
  findings: Finding[];
  clusters: LocalCluster[];
  brief: ProblemBrief | null;
  settings: WorkspaceSettings;
  onUpdateClusters: (clusters: LocalCluster[]) => void;
  onUpdateBrief: (brief: ProblemBrief | null) => void;
  onOpenSettings: () => void;
}

export function AISynthesisTab({
  projectName,
  findings,
  clusters,
  brief,
  settings,
  onUpdateClusters,
  onUpdateBrief,
  onOpenSettings,
}: AISynthesisTabProps) {
  const [isClustering, setIsClustering] = useState(false);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);

  const totalRaw = findings.length;
  const cleanFindings = findings.filter(
    (f) => f.status === 'Pain Point' || f.status === 'Workaround'
  );
  const cleanCount = cleanFindings.length;
  const excludedCount = totalRaw - cleanCount;
  const tokenSavingPct =
    totalRaw > 0 ? Math.max(0, Math.round((excludedCount / totalRaw) * 100)) : 0;

  const isClusterStale =
    clusters.length > 0 &&
    clusters.flatMap((c) => c.findingIds).sort().join(',') !==
      cleanFindings
        .map((f) => f.id)
        .sort()
        .join(',');

  const handleRunLocalClustering = () => {
    setIsClustering(true);
    setTimeout(() => {
      const generated = buildLocalClusters(findings);
      onUpdateClusters(generated);
      setIsClustering(false);
    }, 1000);
  };

  const toggleClusterSelection = (clusterId: string) => {
    const updated = clusters.map((c) =>
      c.id === clusterId ? { ...c, selected: !c.selected } : c
    );
    onUpdateClusters(updated);
  };

  const selectedClusters = clusters.filter((c) => c.selected);

  const handleGenerateBrief = () => {
    if (selectedClusters.length === 0) return;
    setIsGeneratingBrief(true);
    setTimeout(() => {
      const newBrief = buildProblemBrief(projectName, selectedClusters, findings);
      onUpdateBrief(newBrief);
      setIsGeneratingBrief(false);
    }, 800);
  };

  const handleExportMarkdown = () => {
    if (!brief) return;
    const slug = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const reach = brief.impactMatrix?.reach ?? 8;
    const severity = brief.impactMatrix?.severity ?? 8;
    const virality = brief.impactMatrix?.virality ?? 7;
    const dominant = brief.dominantClassification || 'Pain Point';

    const mdContent = [
      `# Lean Inception Problem Formulation Brief — ${projectName}`,
      ``,
      `- **ID Brief:** ${brief.id}`,
      `- **Dibuat:** ${brief.generatedAt}`,
      `- **Klasifikasi Dominan:** ${dominant}`,
      `- **Skor Dampak Keseluruhan:** ${brief.impactLevel} (${brief.impactScore})`,
      `- **Tema Cluster:** ${brief.clusterThemes.join(', ')}`,
      `- **Status Cache:** Cached · 0 Token pada akses ulang`,
      ``,
      `## Rumusan Masalah (Problem Statement)`,
      `${brief.problemStatement}`,
      ``,
      `## Impact Matrix (Skor 1–10)`,
      `- **Reach (Jangkauan Keluhan):** ${reach}/10`,
      `- **Severity (Tingkat Keparahan Hambatan):** ${severity}/10`,
      `- **Virality (Potensi Eskalasi Medsos):** ${virality}/10`,
      ``,
      `## Bukti Kutipan Terkait (Traceable Evidence)`,
      ...brief.evidenceQuotes.map(
        (q) => `- **[${q.id} · ${q.source}]** "${q.quote}"`
      ),
      ``,
      `## Rekomendasi Tindak Lanjut`,
      `${brief.recommendation}`,
      ``,
      `---`,
      `_Diekspor dari Signal (Local-First UXR Research Workspace)_`,
    ].join('\n');

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `signal-problem-brief-${slug || 'project'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-white">
      {/* Efficiency Indicator Banner */}
      <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/50 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-emerald-100 text-emerald-700 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[13px] font-semibold text-gray-900">
              Arsitektur Hemat Token (Low-AI Pipeline)
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              Hanya temuan berstatus <span className="font-medium">Pain Point</span>{' '}
              & <span className="font-medium">Workaround</span> yang diproses.{' '}
              <span className="font-medium">Raw</span> &{' '}
              <span className="font-medium">Noise</span> disaring secara lokal (0
              Token).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[11px] text-gray-500">Data Mentah vs Siap Analisis</p>
            <p className="text-sm font-semibold text-gray-900 tabular-nums">
              {totalRaw} Mentah{' '}
              <span className="text-gray-400 font-normal">→</span>{' '}
              <span className="text-blue-600">{cleanCount} Bersih</span>
            </p>
          </div>
          <div className="h-8 w-px bg-emerald-200" />
          <div className="text-right">
            <p className="text-[11px] text-gray-500">Estimasi Penghematan Token</p>
            <p className="text-sm font-semibold text-emerald-700 tabular-nums">
              ~{tokenSavingPct}% Hemat Token
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Local Clustering */}
      <section className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] bg-[#FAFAFA] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-semibold flex items-center justify-center">
              1
            </span>
            <div>
              <h3 className="text-[13px] font-semibold text-gray-900">
                Langkah 1 — Local Clustering (Gratis · 0 Token API)
              </h3>
              <p className="text-xs text-gray-500">
                Semantic Clustering Lokal (MiniLM) · Deteksi masalah baru
                (unknown problems) dengan 0 token API
              </p>
            </div>
          </div>

          <button
            onClick={handleRunLocalClustering}
            disabled={isClustering || cleanCount === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-white border border-[#E5E7EB] hover:bg-gray-50 text-xs font-medium text-gray-800 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isClustering ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Mengelompokkan (MiniLM)...</span>
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                <span>Jalankan Clustering Lokal (MiniLM)</span>
              </>
            )}
          </button>
        </div>

        <div className="p-5">
          {cleanCount === 0 ? (
            <p className="text-xs text-gray-500 italic">
              Belum ada temuan berstatus Pain Point atau Workaround. Lakukan triage di
              tab Findings terlebih dahulu.
            </p>
          ) : clusters.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              Klik tombol{' '}
              <span className="font-medium text-gray-600">
                “Jalankan Clustering Lokal (MiniLM)”
              </span>{' '}
              untuk mengelompokkan tema masalah tanpa menggunakan kuota token AI.
            </div>
          ) : (
            <div className="space-y-3">
              {isClusterStale && (
                <div className="p-3 rounded-md bg-amber-50 border border-amber-200/80 text-xs text-amber-800 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    Data temuan berubah sejak clustering terakhir — klik{' '}
                    <span className="font-semibold">
                      Jalankan Ulang Clustering Lokal (0 Token)
                    </span>{' '}
                    untuk menyegarkan hasil.
                  </span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {clusters.map((cluster) => {
                const clusterFindings = findings.filter((f) =>
                  cluster.findingIds.includes(f.id)
                );
                return (
                  <div
                    key={cluster.id}
                    onClick={() => toggleClusterSelection(cluster.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      cluster.selected
                        ? 'border-blue-500 bg-blue-50/25 ring-1 ring-blue-500/20'
                        : 'border-[#E5E7EB] bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {cluster.selected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-300 shrink-0" />
                        )}
                        <h4 className="text-[13px] font-semibold text-gray-900">
                          {cluster.theme}
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 tabular-nums">
                        {cluster.frequency} kutipan
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-3 pl-6">
                      {cluster.description}
                    </p>

                    <div className="pl-6 space-y-1.5">
                      {clusterFindings.slice(0, 2).map((cf) => (
                        <div
                          key={cf.id}
                          className="text-[11.5px] text-gray-600 bg-[#F8F9FA] border border-[#E5E7EB]/70 rounded px-2.5 py-1.5 truncate"
                        >
                          <span className="font-mono text-gray-400 mr-1.5">
                            {cf.id}
                          </span>
                          {cf.quote}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Step 2: On-Demand AI Synthesis */}
      <section className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] bg-[#FAFAFA] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
              2
            </span>
            <div>
              <h3 className="text-[13px] font-semibold text-gray-900">
                Langkah 2 — On-Demand AI Synthesis
              </h3>
              <p className="text-xs text-gray-500">
                Centang cluster yang ingin dianalisis, lalu sintesis menjadi Problem
                Formulation Brief.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateBrief}
            disabled={
              settings.strictZeroAI ||
              isGeneratingBrief ||
              selectedClusters.length === 0
            }
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isGeneratingBrief ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menyusun Rumusan Masalah...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  Buat Rumusan Masalah (On-Demand AI)
                  {selectedClusters.length > 0
                    ? ` · ${selectedClusters.length} Cluster`
                    : ''}
                </span>
              </>
            )}
          </button>
        </div>

        <div className="p-5">
          {settings.strictZeroAI && (
            <div className="mb-4 p-3 rounded-md bg-amber-50 border border-amber-200/80 text-xs text-amber-800 flex items-center justify-between gap-2">
              <span>
                Mode <span className="font-semibold">Strict 0% AI</span> aktif —
                pemanggilan LLM Cloud/On-Demand dinonaktifkan.
              </span>
              <button
                type="button"
                onClick={onOpenSettings}
                className="font-semibold underline hover:text-amber-950 shrink-0 cursor-pointer"
              >
                Ubah di Settings
              </button>
            </div>
          )}
          {!brief ? (
            <div className="py-8 text-center text-xs text-gray-400">
              Pilih minimal 1 cluster dari Langkah 1, lalu klik{' '}
              <span className="font-medium text-gray-600">
                “Buat Rumusan Masalah (On-Demand AI)”
              </span>
              .
            </div>
          ) : (
            <div className="space-y-5">
              {/* Brief Top Meta & Export */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {brief.id}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <CheckCircle2 className="w-3 h-3" />
                    Cached · 0 Token pada akses ulang
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Dibuat {brief.generatedAt}
                  </span>
                </div>

                <button
                  onClick={handleExportMarkdown}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#E5E7EB] hover:bg-gray-50 text-xs font-medium text-gray-800 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-gray-600" />
                  <span>Export Markdown (.md)</span>
                </button>
              </div>

              {/* Lean Inception Problem Statement & Classification */}
              <div className="p-4 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Rumusan Masalah (Lean Inception Problem Formulation)
                  </h4>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      brief.dominantClassification ===
                      'Workaround — Goldmine Ide Fitur'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    Klasifikasi Dominan:{' '}
                    {brief.dominantClassification || 'Pain Point'}
                  </span>
                </div>
                <p className="text-[13.5px] leading-relaxed text-gray-800">
                  {brief.problemStatement}
                </p>
                <p className="text-[11px] text-gray-500">
                  Tema Cluster: {brief.clusterThemes.join(', ')}
                </p>
              </div>

              {/* Impact Matrix (Skor 1-10): Reach, Severity, Virality */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Impact Matrix (Skor 1–10)
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Estimasi skor 1–10 dihitung dari jumlah temuan
                      tervalidasi, proporsi Pain Point/Workaround, dan sebaran
                      kanal sosial.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-gray-500">Skor Gabungan:</span>
                    <span className="font-bold text-gray-900 tabular-nums">
                      {brief.impactScore}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        brief.impactLevel === 'Critical'
                          ? 'bg-rose-50 text-rose-700'
                          : brief.impactLevel === 'High'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {brief.impactLevel}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-lg border border-[#E5E7EB] bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">
                        Reach
                      </span>
                      <span className="text-base font-bold text-gray-900 tabular-nums">
                        {brief.impactMatrix?.reach ?? 8}/10
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Jangkauan keluhan pengguna
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-[#E5E7EB] bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">
                        Severity
                      </span>
                      <span className="text-base font-bold text-gray-900 tabular-nums">
                        {brief.impactMatrix?.severity ?? 8}/10
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Tingkat keparahan hambatan
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-[#E5E7EB] bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">
                        Virality
                      </span>
                      <span className="text-base font-bold text-gray-900 tabular-nums">
                        {brief.impactMatrix?.virality ?? 7}/10
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Potensi eskalasi di medsos
                    </p>
                  </div>
                </div>
              </div>

              {/* Supporting Quotes */}
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Bukti Kutipan Terkait · Traceable Evidence (
                  {brief.evidenceQuotes.length})
                </h4>
                <div className="space-y-2">
                  {brief.evidenceQuotes.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-md border border-[#E5E7EB] bg-white flex flex-wrap items-center justify-between gap-2"
                    >
                      <p className="text-xs text-gray-800 flex-1 min-w-[240px]">
                        <span className="font-mono text-gray-400 mr-2">
                          {ev.id}
                        </span>
                        “{ev.quote}”
                      </p>
                      <SourceBadge source={ev.source} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200/70">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 mb-1">
                  Rekomendasi Tindak Lanjut
                </h4>
                <p className="text-xs leading-relaxed text-gray-700">
                  {brief.recommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
