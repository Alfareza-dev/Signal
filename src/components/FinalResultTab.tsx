'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Download,
  FileText,
  Loader2,
  Printer,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  FinalReport,
  Project,
  WorkspaceSettings,
} from '@/types/problemhub';
import { buildFinalReport } from '@/data/mockData';
import { SourceBadge } from './SourceBadge';

interface FinalResultTabProps {
  project: Project;
  settings: WorkspaceSettings;
  onUpdateFinalReport: (report: FinalReport) => void;
  onGoToAISynthesis: () => void;
  onOpenSettings: () => void;
}

export function FinalResultTab({
  project,
  settings,
  onUpdateFinalReport,
  onGoToAISynthesis,
  onOpenSettings,
}: FinalResultTabProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);

  const report = project.finalReport || null;
  const hasFindings = project.findings.length > 0;

  const runSmartPipeline = (mode: 'ai' | 'local') => {
    if (mode === 'ai' && settings.strictZeroAI) return;
    setIsGenerating(true);
    setPipelineStep(1);

    if (mode === 'local') {
      setTimeout(() => {
        const compiled = buildFinalReport(project, 'local');
        onUpdateFinalReport(compiled);
        setIsGenerating(false);
        setPipelineStep(0);
      }, 600);
      return;
    }

    setTimeout(() => setPipelineStep(2), 450);
    setTimeout(() => setPipelineStep(3), 950);
    setTimeout(() => {
      const compiled = buildFinalReport(project, 'ai');
      onUpdateFinalReport(compiled);
      setIsGenerating(false);
      setPipelineStep(0);
    }, 1500);
  };

  const handleRegenerate = () => {
    if (settings.strictZeroAI) {
      if (
        window.confirm(
          'Mode Strict 0% AI aktif. Susun ulang laporan lokal (0 Token)?'
        )
      ) {
        runSmartPipeline('local');
      }
      return;
    }

    if (
      window.confirm(
        'Regenerate Final Result menggunakan Smart Pipeline (~450 Token AI)?'
      )
    ) {
      runSmartPipeline('ai');
    }
  };

  const handleExportBrief = () => {
    if (!report) return;
    const slug = project.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const md = [
      `# Final Executive Brief — ${project.name}`,
      ``,
      `- **Status:** ${
        report.mode === 'ai' ? 'Finalized · Cached' : 'Draft Lokal 0% AI'
      }`,
      `- **Diperbarui:** ${report.generatedAt}`,
      `- **Klasifikasi Dominan:** ${report.dominantClassification}`,
      `- **Skor Dampak:** ${report.impactLevel} (${report.impactScore})`,
      ``,
      `## 1. Executive Problem Statement`,
      report.problemStatement,
      ``,
      `## 2. Impact Matrix Summary`,
      `- **Reach:** ${report.impactMatrix.reach}/10`,
      `- **Severity:** ${report.impactMatrix.severity}/10`,
      `- **Virality:** ${report.impactMatrix.virality}/10`,
      ``,
      `## 3. Ringkasan 4 Kuadran Empathy Map`,
      `- **Says:** ${report.empathySummary.says.join(' | ') || 'Belum ada data'}`,
      `- **Thinks:** ${report.empathySummary.thinks.join(' | ') || 'Belum ada data'}`,
      `- **Feels:** ${report.empathySummary.feels.join(' | ') || 'Belum ada data'}`,
      `- **Does:** ${report.empathySummary.does.join(' | ') || 'Belum ada data'}`,
      ``,
      `## 4. Key Traceable Evidence`,
      ...report.evidenceQuotes.map(
        (ev) => `- **[${ev.id} · ${ev.source}]** "${ev.quote}"`
      ),
      ``,
      `## 5. Rekomendasi Aksi Produk`,
      ...report.recommendations.map((rec, idx) => `${idx + 1}. ${rec}`),
      ``,
      `---`,
      `_Diekspor dari Signal (Local-First UXR Research Workspace)_`,
    ].join('\n');

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `signal-final-result-${slug || 'project'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Empty State
  if (!report) {
    return (
      <div className="h-full overflow-y-auto bg-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center space-y-5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-base font-semibold text-gray-900">
              Laporan Akhir Belum Dikompilasi
            </h2>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Susun dokumen eksekutif bebas distraksi untuk{' '}
              <span className="font-medium text-gray-800">{project.name}</span>{' '}
              yang siap dibagikan ke tim Product & Engineering.
            </p>
          </div>

          {isGenerating ? (
            <div className="p-4 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] text-left space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-800">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Mengompilasi Final Result...</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      pipelineStep >= 1 ? 'text-emerald-600' : 'text-gray-300'
                    }`}
                  />
                  <span>1. Filter Noise & Raw secara lokal (0 Token)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      pipelineStep >= 2 ? 'text-emerald-600' : 'text-gray-300'
                    }`}
                  />
                  <span>2. Semantic Clustering MiniLM lokal (0 Token)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      pipelineStep >= 3 ? 'text-emerald-600' : 'text-gray-300'
                    }`}
                  />
                  <span>3. Sintesis Brief Eksekutif AI (~450 Token)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Primary Smart Pipeline Button */}
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={settings.strictZeroAI || !hasFindings}
                  onClick={() => runSmartPipeline('ai')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Auto-Generate Final Result (Smart Pipeline)</span>
                </button>

                {settings.strictZeroAI ? (
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/70 rounded-md px-3 py-2">
                    Mode 0% AI Aktif —{' '}
                    <button
                      type="button"
                      onClick={onOpenSettings}
                      className="underline font-semibold cursor-pointer"
                    >
                      ubah di Settings
                    </button>{' '}
                    untuk menyalakan sintesis AI.
                  </p>
                ) : (
                  <div className="p-2.5 rounded-md bg-[#F8F9FA] border border-[#E5E7EB] text-[11px] text-gray-500">
                    <span className="font-medium text-gray-700">
                      Pipeline Hemat Token:
                    </span>{' '}
                    Filter & Clustering Lokal MiniLM (0 Token) → Sintesis Akhir
                    AI (~450 Token · Cached)
                  </div>
                )}
              </div>

              {/* Local 0% AI Compile Button */}
              <button
                type="button"
                disabled={!hasFindings}
                onClick={() => runSmartPipeline('local')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-gray-50 text-xs font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                <span>Compile Laporan Lokal (0% AI)</span>
              </button>

              <div>
                <button
                  type="button"
                  onClick={onGoToAISynthesis}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span>Susun Manual di AI Synthesis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Executive View
  return (
    <div className="h-full overflow-y-auto bg-[#FAFAFA] p-6 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto bg-white border border-[#E5E7EB] rounded-xl shadow-2xs p-8 space-y-8 print:border-0 print:shadow-none">
        {/* Document Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-[#E5E7EB]">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              {report.mode === 'ai' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Finalized · Cached
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  <ShieldCheck className="w-3 h-3" />
                  Draft Lokal 0% AI
                </span>
              )}
              <span className="text-xs text-gray-400">
                Diperbarui {report.generatedAt}
              </span>
            </div>

            <h1 className="text-xl font-semibold text-gray-900">
              Executive Brief — {project.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#E5E7EB] hover:bg-gray-50 text-xs font-medium text-gray-700 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`}
              />
              <span>Regenerate</span>
            </button>

            <button
              type="button"
              onClick={handleExportBrief}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Brief (.md)</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#E5E7EB] hover:bg-gray-50 text-xs font-medium text-gray-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* 1. Executive Problem Statement */}
        <section className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              1. Executive Problem Statement
            </h2>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                report.dominantClassification ===
                'Workaround — Goldmine Ide Fitur'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              {report.dominantClassification}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-gray-800 bg-[#F8F9FA] p-4 rounded-lg border border-[#E5E7EB]">
            {report.problemStatement}
          </p>
        </section>

        {/* 2. Impact Matrix Summary */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                2. Impact Matrix Summary
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Estimasi skor 1–10 dihitung dari jumlah temuan tervalidasi,
                proporsi Pain Point/Workaround, dan sebaran kanal sosial.
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-700">
              Skor Gabungan: {report.impactScore} ({report.impactLevel})
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg border border-[#E5E7EB] bg-white">
              <span className="text-xs text-gray-500 block">Reach</span>
              <span className="text-lg font-bold text-gray-900 tabular-nums">
                {report.impactMatrix.reach}/10
              </span>
            </div>
            <div className="p-3.5 rounded-lg border border-[#E5E7EB] bg-white">
              <span className="text-xs text-gray-500 block">Severity</span>
              <span className="text-lg font-bold text-gray-900 tabular-nums">
                {report.impactMatrix.severity}/10
              </span>
            </div>
            <div className="p-3.5 rounded-lg border border-[#E5E7EB] bg-white">
              <span className="text-xs text-gray-500 block">Virality</span>
              <span className="text-lg font-bold text-gray-900 tabular-nums">
                {report.impactMatrix.virality}/10
              </span>
            </div>
          </div>
        </section>

        {/* 3. Ringkasan 4 Kuadran Empathy Map */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            3. Ringkasan 4 Kuadran Empathy Map
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                title: 'Says (Diucapkan)',
                items: report.empathySummary.says,
                cls: 'bg-sky-50/50 border-sky-200/70',
              },
              {
                title: 'Thinks (Dipikirkan)',
                items: report.empathySummary.thinks,
                cls: 'bg-violet-50/50 border-violet-200/70',
              },
              {
                title: 'Feels (Dirasakan)',
                items: report.empathySummary.feels,
                cls: 'bg-rose-50/50 border-rose-200/70',
              },
              {
                title: 'Does (Dilakukan)',
                items: report.empathySummary.does,
                cls: 'bg-emerald-50/50 border-emerald-200/70',
              },
            ].map((q) => (
              <div
                key={q.title}
                className={`p-3.5 rounded-lg border ${q.cls} space-y-1.5`}
              >
                <h3 className="text-xs font-semibold text-gray-800">
                  {q.title}
                </h3>
                {q.items.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">
                    Belum ada temuan di kuadran ini.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {q.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-xs text-gray-700 leading-relaxed line-clamp-2"
                      >
                        • {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 4. Key Traceable Evidence */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            4. Key Traceable Evidence
          </h2>
          <div className="space-y-2">
            {report.evidenceQuotes.map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 rounded-lg border border-[#E5E7EB] bg-white flex flex-wrap items-center justify-between gap-3"
              >
                <p className="text-xs text-gray-800 flex-1 min-w-[240px] leading-relaxed">
                  <span className="font-mono font-semibold text-gray-500 mr-2">
                    {ev.id}
                  </span>
                  “{ev.quote}”
                </p>
                <SourceBadge source={ev.source} />
              </div>
            ))}
          </div>
        </section>

        {/* 5. Rekomendasi Aksi Produk */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            5. Rekomendasi Aksi Produk
          </h2>
          <div className="p-4 rounded-lg bg-blue-50/40 border border-blue-200/70 space-y-2">
            {report.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-800">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-semibold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="leading-relaxed pt-0.5">{rec}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
