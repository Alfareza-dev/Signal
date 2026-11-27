'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Cpu,
  Download,
  FileEdit,
  FileText,
  Loader2,
  Plus,
  Printer,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  StickyNote as StickyNoteIcon,
  Trash2,
} from 'lucide-react';
import {
  EmpathyQuadrant,
  FinalReport,
  ResearchVersion,
  StickyNote,
  WorkspaceSettings,
} from '@/types/problemhub';
import {
  buildFinalReport,
  getEffectiveActionItems,
  getEffectiveMoscowItems,
} from '@/data/mockData';
import { SiggyMascot } from './SiggyMascot';
import { SourceBadge } from './SourceBadge';

interface FinalResultTabProps {
  projectName: string;
  version: ResearchVersion;
  settings: WorkspaceSettings;
  onUpdateFinalReport: (report: FinalReport) => void;
  onUpdateStickyNotes: (notes: StickyNote[]) => void;
  onUpdateResearchNotes: (notes: string) => void;
  onGoToAISynthesis: () => void;
  onOpenSettings: () => void;
}

const EMPATHY_QUADRANTS: {
  key: EmpathyQuadrant;
  title: string;
  subtitle: string;
  cardCls: string;
  noteColor: StickyNote['color'];
  noteCls: string;
}[] = [
  {
    key: 'Says',
    title: 'Says (Diucapkan)',
    subtitle: 'Kutipan langsung pengguna',
    cardCls: 'bg-orange-50/55 border-orange-200/80',
    noteColor: 'peach',
    noteCls: 'bg-[#FFE8DF] border-[#FFBDAA] text-[#2D213A]',
  },
  {
    key: 'Thinks',
    title: 'Thinks (Dipikirkan)',
    subtitle: 'Asumsi, keraguan & ekspektasi',
    cardCls: 'bg-violet-50/55 border-violet-200/80',
    noteColor: 'lavender',
    noteCls: 'bg-[#EFE9FD] border-[#D4C4FA] text-[#2D213A]',
  },
  {
    key: 'Feels',
    title: 'Feels (Dirasakan)',
    subtitle: 'Emosi, frustrasi & delight',
    cardCls: 'bg-rose-50/55 border-rose-200/80',
    noteColor: 'butter',
    noteCls: 'bg-[#FFF5CC] border-[#F2DC88] text-[#2D213A]',
  },
  {
    key: 'Does',
    title: 'Does (Dilakukan)',
    subtitle: 'Aksi & workaround nyata',
    cardCls: 'bg-emerald-50/55 border-emerald-200/80',
    noteColor: 'mint',
    noteCls: 'bg-[#E2F8EE] border-[#A7E6C9] text-[#2D213A]',
  },
];

export function FinalResultTab({
  projectName,
  version,
  settings,
  onUpdateFinalReport,
  onUpdateStickyNotes,
  onUpdateResearchNotes,
  onGoToAISynthesis,
  onOpenSettings,
}: FinalResultTabProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [addingNoteQuad, setAddingNoteQuad] = useState<EmpathyQuadrant | null>(
    null
  );
  const [stickyDraft, setStickyDraft] = useState('');

  const report = version.finalReport || null;
  const hasFindings = version.findings.length > 0;
  const stickyNotes = version.stickyNotes || [];
  const researchNotes = version.researchNotes || '';
  const moscowItems = getEffectiveMoscowItems(version);
  const actionItems = getEffectiveActionItems(version);

  const activeFindings = version.findings.filter(
    (f) => f.status !== 'Noise / Archived'
  );
  const userVoiceFindings = activeFindings.filter(
    (f) => f.source !== 'Jurnal (OpenAlex)'
  );
  const academicFindings = activeFindings.filter(
    (f) => f.source === 'Jurnal (OpenAlex)'
  );
  const painCount = activeFindings.filter((f) => f.status === 'Pain Point').length;
  const workCount = activeFindings.filter((f) => f.status === 'Workaround').length;
  const posCount = activeFindings.filter(
    (f) => f.status === 'Positif / Delighter'
  ).length;

  const runSmartPipeline = (mode: 'ai' | 'local') => {
    if (mode === 'ai' && settings.strictZeroAI) return;
    setIsGenerating(true);
    setPipelineStep(1);

    if (mode === 'local') {
      setTimeout(() => {
        const compiled = buildFinalReport(projectName, version, 'local');
        onUpdateFinalReport(compiled);
        setIsGenerating(false);
        setPipelineStep(0);
      }, 600);
      return;
    }

    setTimeout(() => setPipelineStep(2), 450);
    setTimeout(() => setPipelineStep(3), 950);
    setTimeout(() => {
      const compiled = buildFinalReport(projectName, version, 'ai');
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
        'Susun ulang Final Result menggunakan data temuan terbaru?'
      )
    ) {
      runSmartPipeline('ai');
    }
  };

  const handleAddStickyNote = (
    quadrant: EmpathyQuadrant,
    color: StickyNote['color']
  ) => {
    if (!stickyDraft.trim()) return;
    const newNote: StickyNote = {
      id: `stk-${Date.now()}`,
      quadrant,
      text: stickyDraft.trim(),
      color,
      createdAt: new Date().toLocaleDateString('id-ID'),
    };
    onUpdateStickyNotes([...stickyNotes, newNote]);
    setStickyDraft('');
    setAddingNoteQuad(null);
  };

  const handleDeleteStickyNote = (noteId: string) => {
    onUpdateStickyNotes(stickyNotes.filter((n) => n.id !== noteId));
  };

  const handleExportBrief = () => {
    const slug = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const md = [
      `# Empathy Map & Final Brief — ${projectName} (${version.label})`,
      ``,
      `- **Keyword Query:** ${version.keywordQuery}`,
      `- **Sentimen:** ${painCount} Pain Point · ${workCount} Workaround · ${posCount} Positif/Delighter`,
      report ? `- **Skor Impact:** ${report.impactScore} (${report.impactLevel})` : '',
      ``,
      report ? `## 1. Executive Problem Statement\n${report.problemStatement}\n` : '',
      `## 2. Prioritas MoSCoW & Rekomendasi Aksi`,
      ...moscowItems.map((m) => `- [${m.category}] ${m.title}`),
      ``,
      ...actionItems.map((a, i) => `${i + 1}. ${a.title}`),
      ``,
      `## 3. Empathy Map & Sticky Notes`,
      ...EMPATHY_QUADRANTS.map((q) => {
        const mapped = userVoiceFindings
          .filter((f) => f.quadrant === q.key)
          .map((f) => `- [${f.id}] "${f.quote}"`);
        const stickies = stickyNotes
          .filter((n) => n.quadrant === q.key)
          .map((n) => `- [Sticky Note] ${n.text}`);
        return `### ${q.title}\n${[...mapped, ...stickies].join('\n') || '- Belum ada item'}`;
      }),
      ...(academicFindings.length > 0
        ? [
            ``,
            `## 4. Validasi Literatur (Sumber Sekunder)`,
            ...academicFindings.map((f) => `- [${f.id}] ${f.quote} (${f.author})`),
          ]
        : []),
      ``,
      `## Catatan Riset (Notes)`,
      researchNotes || '- Tidak ada catatan tambahan.',
    ]
      .filter(Boolean)
      .join('\n');

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

  return (
    <div className="h-full overflow-y-auto bg-white print:overflow-visible">
      <div className="max-w-4xl mx-auto px-6 py-7 space-y-7 print:px-0 print:py-0 print:space-y-5">
        {/* Document Header + Print/Export Actions */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#F2E4E0]">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF0EA] text-[#FF7B7B] border border-[#FF7B7B]/30">
                {version.label}
              </span>
              {report ? (
                report.mode === 'ai' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <Sparkles className="w-3 h-3" />
                    Finalized · {report.tokensUsed} Token
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    <ShieldCheck className="w-3 h-3" />
                    Draft Lokal 0% AI
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F4F0FB] text-[#6953A8] border border-[#DFD5F5]">
                  <FileText className="w-3 h-3" />
                  Empathy Map & Laporan Akhir
                </span>
              )}
            </div>

            <h1 className="text-xl font-bold text-[#2D213A]">
              Empathy Map & Final Report — {projectName} ({version.label})
            </h1>
            <p className="text-xs text-[#7A6B84]">
              Query: <span className="font-mono text-[#2D213A]">{version.keywordQuery}</span>
              {version.schedule?.enabled &&
                ` · Jadwal Otomatis: ${version.schedule.frequency} (${version.schedule.time})`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            {report && (
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EEDCD7] hover:bg-[#FFF7F5] text-xs font-semibold text-[#2D213A] transition-colors cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`}
                />
                <span>Regenerate</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportBrief}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF7F5] border border-[#EEDCD7] hover:bg-[#FFEAE3] text-xs font-semibold text-[#2D213A] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#FF7B7B]" />
              <span>Export (.md)</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FF7B7B] hover:bg-[#F26666] text-white text-xs font-bold border-b-3 border-[#DC5353] active:border-b-0 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Sentiment & Configuration Summary Bar */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 print-avoid-break">
          <div className="p-3 rounded-2xl bg-[#FFF7F5] border border-[#F2E4E0]">
            <span className="text-[11px] font-semibold text-[#7A6B84] block">
              Temuan Aktif
            </span>
            <span className="text-lg font-extrabold text-[#2D213A] tabular-nums">
              {activeFindings.length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80">
            <span className="text-[11px] font-semibold text-rose-700 block">
              Pain Point
            </span>
            <span className="text-lg font-extrabold text-rose-800 tabular-nums">
              {painCount}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <span className="text-[11px] font-semibold text-amber-800 block">
              Workaround
            </span>
            <span className="text-lg font-extrabold text-amber-900 tabular-nums">
              {workCount}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
            <span className="text-[11px] font-semibold text-emerald-700 block">
              Positif / Delighter
            </span>
            <span className="text-lg font-extrabold text-emerald-800 tabular-nums">
              {posCount}
            </span>
          </div>
        </section>

        {/* Auto-Generate Executive Brief Card (when not yet compiled) */}
        {!report ? (
          <section className="rounded-3xl border border-[#F2E4E0] bg-[#FFF7F5] p-5 space-y-3 print:hidden">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <SiggyMascot variant="avatar" size={44} />
                <div>
                  <h2 className="text-sm font-bold text-[#2D213A]">
                    Kompilasi Executive Brief & Impact Matrix
                  </h2>
                  <p className="text-xs text-[#7A6B84]">
                    Opsional: gabungkan seluruh temuan menjadi ringkasan eksekutif otomatis.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={!hasFindings || isGenerating}
                  onClick={() => runSmartPipeline('local')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#EEDCD7] hover:bg-[#FFFDFC] text-xs font-semibold text-[#2D213A] disabled:opacity-50 cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Compile Lokal (0 Token)</span>
                </button>
                <button
                  type="button"
                  disabled={settings.strictZeroAI || !hasFindings || isGenerating}
                  onClick={() => runSmartPipeline('ai')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FF7B7B] hover:bg-[#F26666] text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  {isGenerating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Auto-Generate Final Result</span>
                </button>
              </div>
            </div>

            {isGenerating && (
              <div className="text-xs text-[#5F506B] flex items-center gap-3 pt-1">
                <span className={pipelineStep >= 1 ? 'text-emerald-700 font-semibold' : ''}>
                  1. Filter Lokal
                </span>
                <span>→</span>
                <span className={pipelineStep >= 2 ? 'text-emerald-700 font-semibold' : ''}>
                  2. Clustering MiniLM
                </span>
                <span>→</span>
                <span className={pipelineStep >= 3 ? 'text-emerald-700 font-semibold' : ''}>
                  3. Sintesis Brief
                </span>
              </div>
            )}
            {settings.strictZeroAI && (
              <p className="text-[11px] text-amber-800">
                Mode Strict 0% AI aktif —{' '}
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="underline font-semibold cursor-pointer"
                >
                  ubah di Settings
                </button>{' '}
                atau gunakan Compile Lokal.
              </p>
            )}
          </section>
        ) : (
          <>
            {/* Executive Problem Statement & Impact Matrix */}
            <section className="space-y-3 print-avoid-break">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#7A6B84]">
                  1. Executive Problem Statement & Impact Matrix
                </h2>
                <span className="text-xs font-bold text-[#2D213A]">
                  Impact: {report.impactScore} ({report.impactLevel})
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#2D213A] bg-[#FFF7F5] p-4 rounded-2xl border border-[#F2E4E0]">
                {report.problemStatement}
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl border border-[#F2E4E0] bg-white">
                  <span className="text-[11px] text-[#7A6B84] block">Reach</span>
                  <span className="text-base font-bold text-[#2D213A] tabular-nums">
                    {report.impactMatrix.reach}/10
                  </span>
                </div>
                <div className="p-3 rounded-2xl border border-[#F2E4E0] bg-white">
                  <span className="text-[11px] text-[#7A6B84] block">Severity</span>
                  <span className="text-base font-bold text-[#2D213A] tabular-nums">
                    {report.impactMatrix.severity}/10
                  </span>
                </div>
                <div className="p-3 rounded-2xl border border-[#F2E4E0] bg-white">
                  <span className="text-[11px] text-[#7A6B84] block">Virality</span>
                  <span className="text-base font-bold text-[#2D213A] tabular-nums">
                    {report.impactMatrix.virality}/10
                  </span>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Prioritas MoSCoW & Rekomendasi Aksi Ringkas (ikut tercetak di PDF) */}
        {(moscowItems.length > 0 || actionItems.length > 0 || report) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 print-avoid-break">
            <div className="p-4 rounded-2xl border border-[#F2E4E0] bg-[#FFFDFC] space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A6B84]">
                Prioritas MoSCoW
              </h3>
              {moscowItems.length === 0 ? (
                <p className="text-xs text-[#9A8CA4] italic">
                  Atur item MoSCoW di tab Prioritas & Aksi.
                </p>
              ) : (
                <ul className="space-y-1.5 text-xs">
                  {moscowItems.slice(0, 6).map((item) => (
                    <li key={item.id} className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#FFF0EA] text-[#D9534F] text-[10px] font-bold shrink-0">
                        {item.category}
                      </span>
                      <span className="text-[#2D213A]">{item.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-4 rounded-2xl border border-[#F2E4E0] bg-[#FFFDFC] space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A6B84]">
                Rekomendasi Aksi Produk
              </h3>
              {actionItems.length > 0 ? (
                <ul className="space-y-1.5 text-xs">
                  {actionItems.map((act, idx) => (
                    <li key={act.id} className="flex items-start gap-2">
                      <span className="font-bold text-[#FF7B7B]">{idx + 1}.</span>
                      <span className="text-[#2D213A]">{act.title}</span>
                    </li>
                  ))}
                </ul>
              ) : report ? (
                <ul className="space-y-1.5 text-xs">
                  {report.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-[#FF7B7B]">{idx + 1}.</span>
                      <span className="text-[#2D213A]">{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[#9A8CA4] italic">
                  Rekomendasi aksi dapat ditambahkan di tab Prioritas & Aksi.
                </p>
              )}
            </div>
          </section>
        )}

        {/* Quadrant Empathy Map + Sticky Notes */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#7A6B84]">
                Empathy Map (Says, Thinks, Feels, Does) & Sticky Notes
              </h2>
              <p className="text-[11px] text-[#9A8CA4]">
                Gabungan suara pengguna terpetakan dan sticky notes manual UXR.
              </p>
            </div>
            <button
              type="button"
              onClick={onGoToAISynthesis}
              className="text-xs font-semibold text-[#9B85D6] hover:underline cursor-pointer print:hidden"
            >
              Lihat Clustering & AI →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EMPATHY_QUADRANTS.map((q) => {
              const quadFindings = userVoiceFindings.filter(
                (f) => f.quadrant === q.key
              );
              const quadStickies = stickyNotes.filter(
                (n) => n.quadrant === q.key
              );
              const isAddingHere = addingNoteQuad === q.key;

              return (
                <div
                  key={q.key}
                  className={`p-4 rounded-3xl border ${q.cardCls} space-y-3 print-avoid-break`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-[13px] font-bold text-[#2D213A]">
                        {q.title}
                      </h3>
                      <p className="text-[11px] text-[#7A6B84]">{q.subtitle}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAddingNoteQuad(isAddingHere ? null : q.key);
                        setStickyDraft('');
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-[#FFF7F5] border border-[#EEDCD7] text-[11px] font-bold text-[#2D213A] cursor-pointer print:hidden"
                    >
                      <Plus className="w-3 h-3 text-[#FF7B7B]" />
                      <span>+ Tambah Sticky Note</span>
                    </button>
                  </div>

                  {isAddingHere && (
                    <div className="p-2.5 rounded-2xl bg-white border border-[#EEDCD7] space-y-2 print:hidden">
                      <textarea
                        rows={2}
                        autoFocus
                        value={stickyDraft}
                        onChange={(e) => setStickyDraft(e.target.value)}
                        placeholder={`Tulis sticky note untuk kuadran ${q.key}...`}
                        className="w-full text-xs text-[#2D213A] focus:outline-none resize-none"
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setAddingNoteQuad(null)}
                          className="px-2.5 py-1 rounded-2xl text-[11px] text-[#7A6B84] hover:bg-[#FFF7F5] cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleAddStickyNote(q.key, q.noteColor)
                          }
                          className="px-3 py-1 rounded-2xl bg-[#FF7B7B] text-white text-[11px] font-bold cursor-pointer"
                        >
                          Tempel Note
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sticky Notes */}
                  {quadStickies.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {quadStickies.map((note) => (
                        <div
                          key={note.id}
                          className={`p-2.5 rounded-2xl border shadow-xs text-xs leading-snug relative group ${q.noteCls}`}
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold opacity-70 mb-1">
                              <StickyNoteIcon className="w-3 h-3" />
                              Sticky Note
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteStickyNote(note.id)}
                              title="Hapus sticky note"
                              className="opacity-60 hover:opacity-100 text-rose-600 cursor-pointer print:hidden"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-medium">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Mapped Findings */}
                  {quadFindings.length === 0 && quadStickies.length === 0 ? (
                    <p className="text-xs text-[#9A8CA4] italic">
                      Belum ada temuan atau sticky note di kuadran ini.
                    </p>
                  ) : (
                    <ul className="space-y-1.5">
                      {quadFindings.map((f) => (
                        <li
                          key={f.id}
                          className="p-2.5 rounded-2xl bg-white/90 border border-[#F2E4E0] text-xs text-[#2D213A] leading-relaxed"
                        >
                          <span className="font-mono text-[10.5px] text-[#7A6B84] mr-1.5">
                            {f.id}
                          </span>
                          “{f.quote}”
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Validasi Literatur (Sumber Sekunder OpenAlex) */}
        {academicFindings.length > 0 && (
          <section className="rounded-3xl border border-[#DFD5F5] bg-[#F8F5FF] p-5 space-y-2.5 print-avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6953A8]">
              Validasi Literatur (Sumber Sekunder · OpenAlex)
            </h2>
            <p className="text-[11px] text-[#7A6B84]">
              Dipisahkan dari 4 kuadran Empathy Map agar suara pengguna tetap murni first-party.
            </p>
            <div className="space-y-2">
              {academicFindings.map((af) => (
                <div
                  key={af.id}
                  className="p-3 rounded-2xl bg-white border border-[#E5DCFA] text-xs text-[#2D213A]"
                >
                  <span className="font-mono font-semibold text-[#6953A8] mr-2">
                    {af.id}
                  </span>
                  “{af.quote}”{' '}
                  <span className="text-[#7A6B84]">— {af.author}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Catatan Riset (Notes) */}
        <section className="rounded-3xl border border-[#F2E4E0] bg-[#FFFDFC] p-5 space-y-2.5 print-avoid-break">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7A6B84] flex items-center gap-1.5">
              <FileEdit className="w-3.5 h-3.5 text-[#FF7B7B]" />
              Catatan Riset (Notes) — {version.label}
            </h2>
            <span className="text-[11px] text-[#9A8CA4] print:hidden">
              Tersimpan otomatis per versi
            </span>
          </div>
          <textarea
            rows={4}
            value={researchNotes}
            onChange={(e) => onUpdateResearchNotes(e.target.value)}
            placeholder="Tulis catatan bebas peneliti, kesimpulan rapat tim, atau hal yang perlu dipantau pada versi berikutnya..."
            className="w-full rounded-2xl border border-[#EEDCD7] bg-white p-3.5 text-xs text-[#2D213A] leading-relaxed focus:outline-none focus:border-[#E9B949] print:hidden"
          />
          <div className="hidden print:block text-xs text-[#2D213A] leading-relaxed whitespace-pre-wrap">
            {researchNotes || 'Tidak ada catatan riset tambahan.'}
          </div>
        </section>

        {/* Key Traceable Evidence */}
        {(report?.evidenceQuotes.length || activeFindings.length > 0) && (
          <section className="space-y-3 print-avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7A6B84]">
              Bukti Kutipan Tervalidasi
            </h2>
            <div className="space-y-2">
              {(report
                ? report.evidenceQuotes
                : activeFindings.slice(0, 5).map((f) => ({
                    id: f.id,
                    quote: f.quote,
                    source: f.source,
                  }))
              ).map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-2xl border border-[#F2E4E0] bg-white flex flex-wrap items-center justify-between gap-3"
                >
                  <p className="text-xs text-[#2D213A] flex-1 min-w-[240px] leading-relaxed">
                    <span className="font-mono font-semibold text-[#7A6B84] mr-2">
                      {ev.id}
                    </span>
                    “{ev.quote}”
                  </p>
                  <SourceBadge source={ev.source} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
