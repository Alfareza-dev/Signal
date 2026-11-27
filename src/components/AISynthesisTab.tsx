'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Cpu,
  Download,
  Loader2,
  MessageSquarePlus,
  Plus,
  Send,
  Sparkles,
  Square,
  Trash2,
  X,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import {
  AIChatMessage,
  Finding,
  LocalCluster,
  ProblemBrief,
  ThresholdConfig,
  WorkspaceSettings,
} from '@/types/problemhub';
import {
  buildLocalClusters,
  buildProblemBrief,
  calculateFindingScore,
} from '@/data/mockData';
import { SiggyMascot } from './SiggyMascot';
import { SourceBadge } from './SourceBadge';

interface AISynthesisTabProps {
  projectName: string;
  findings: Finding[];
  clusters: LocalCluster[];
  brief: ProblemBrief | null;
  settings: WorkspaceSettings;
  thresholdConfig: ThresholdConfig;
  aiObjective: string;
  aiExtraContext: string;
  aiChatHistory: AIChatMessage[];
  onUpdateClusters: (clusters: LocalCluster[]) => void;
  onUpdateBrief: (brief: ProblemBrief | null) => void;
  onUpdateAiObjective: (val: string) => void;
  onUpdateAiExtraContext: (val: string) => void;
  onUpdateAiChatHistory: (msgs: AIChatMessage[]) => void;
  onOpenSettings: () => void;
}

const CLUSTER_COLORS: {
  id: NonNullable<LocalCluster['color']>;
  label: string;
  dot: string;
  card: string;
}[] = [
  {
    id: 'coral',
    label: 'Coral',
    dot: 'bg-[#FF7B7B]',
    card: 'border-[#FF7B7B]/60 bg-[#FFF0EA]/45',
  },
  {
    id: 'amber',
    label: 'Honey',
    dot: 'bg-[#E9B949]',
    card: 'border-[#E9B949]/60 bg-[#FFFBEB]/65',
  },
  {
    id: 'lavender',
    label: 'Lavender',
    dot: 'bg-[#9B85D6]',
    card: 'border-[#9B85D6]/60 bg-[#F4F0FB]/70',
  },
  {
    id: 'mint',
    label: 'Mint',
    dot: 'bg-emerald-400',
    card: 'border-emerald-300 bg-emerald-50/50',
  },
  {
    id: 'rose',
    label: 'Rose',
    dot: 'bg-rose-400',
    card: 'border-rose-300 bg-rose-50/50',
  },
];

export function AISynthesisTab({
  projectName,
  findings,
  clusters,
  brief,
  settings,
  thresholdConfig,
  aiObjective,
  aiExtraContext,
  aiChatHistory,
  onUpdateClusters,
  onUpdateBrief,
  onUpdateAiObjective,
  onUpdateAiExtraContext,
  onUpdateAiChatHistory,
  onOpenSettings,
}: AISynthesisTabProps) {
  const [isClustering, setIsClustering] = useState(false);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);

  // Manual cluster creator
  const [isAddingCluster, setIsAddingCluster] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualColor, setManualColor] =
    useState<NonNullable<LocalCluster['color']>>('lavender');
  const [manualFindingIds, setManualFindingIds] = useState<string[]>([]);

  // Siggy AI interactive chat
  const [chatInput, setChatInput] = useState('');
  const [isReplyingChat, setIsReplyingChat] = useState(false);

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
      const manualOnes = clusters.filter((c) => c.isManual);
      onUpdateClusters([...manualOnes, ...generated]);
      setIsClustering(false);
    }, 1000);
  };

  const handleCreateManualCluster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;
    const newCluster: LocalCluster = {
      id: `CLU-M-${Date.now().toString().slice(-4)}`,
      theme: manualTitle.trim(),
      description:
        manualDesc.trim() ||
        'Cluster masalah manual yang disusun peneliti untuk analisis terfokus.',
      findingIds: manualFindingIds,
      frequency: manualFindingIds.length,
      selected: true,
      color: manualColor,
      isManual: true,
    };
    onUpdateClusters([newCluster, ...clusters]);
    setManualTitle('');
    setManualDesc('');
    setManualFindingIds([]);
    setIsAddingCluster(false);
  };

  const handleDeleteManualCluster = (
    e: React.MouseEvent,
    clusterId: string
  ) => {
    e.stopPropagation();
    onUpdateClusters(clusters.filter((c) => c.id !== clusterId));
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
      if (aiObjective.trim()) {
        newBrief.problemStatement = `[Fokus: ${aiObjective.trim()}] ${newBrief.problemStatement}`;
      }
      if (aiExtraContext.trim()) {
        newBrief.problemStatement = `${newBrief.problemStatement} Konteks tambahan peneliti: "${aiExtraContext.trim()}".`;
        newBrief.recommendation = `${newBrief.recommendation} (Mempertimbangkan konteks tambahan: ${aiExtraContext.trim().slice(0, 120)})`;
      }
      onUpdateBrief(newBrief);
      setIsGeneratingBrief(false);
    }, 800);
  };

  const handleSendChat = (promptText?: string) => {
    if (settings.strictZeroAI) return;
    const question = (promptText ?? chatInput).trim();
    if (!question || isReplyingChat) return;

    const nowLabel = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const userMsg: AIChatMessage = {
      id: `msg-u-${Date.now()}`,
      role: 'user',
      text: question,
      timestamp: nowLabel,
    };
    const nextWithUser = [...aiChatHistory, userMsg];
    onUpdateAiChatHistory(nextWithUser);
    if (!promptText) setChatInput('');
    setIsReplyingChat(true);

    setTimeout(() => {
      const topScored = [...findings]
        .filter((f) => f.status !== 'Noise / Archived')
        .map((f) => ({ f, score: calculateFindingScore(f, thresholdConfig) }))
        .sort((a, b) => b.score.totalScore - a.score.totalScore)
        .slice(0, 2);

      const posCount = findings.filter(
        (f) => f.status === 'Positif / Delighter'
      ).length;
      const clusterNames =
        selectedClusters.length > 0
          ? selectedClusters.map((c) => c.theme).join(', ')
          : clusters.map((c) => c.theme).slice(0, 2).join(', ') ||
            'alur utama pengguna';

      const topRef =
        topScored.length > 0
          ? `Temuan prioritas tertinggi saat ini adalah ${topScored[0].f.id} (${topScored[0].score.totalScore} PT, ${topScored[0].score.totalInteractions} interaksi): "${topScored[0].f.quote.slice(0, 95)}...".`
          : 'Belum ada temuan aktif yang diberi skor.';

      const objectiveNote = aiObjective.trim()
        ? ` Mengacu pada objektifmu ("${aiObjective.trim()}"),`
        : '';
      const extraNote = aiExtraContext.trim()
        ? ` Konteks tambahan ("${aiExtraContext.trim().slice(0, 70)}...") sudah aku perhitungkan.`
        : '';

      const replyText = `Hai! Aku Siggy AI.${objectiveNote} dari ${findings.length} temuan pada ${projectName} (termasuk ${posCount} sinyal Positif/Delighter) dengan klaster fokus [${clusterNames}], pola paling kuat mengarah ke kejelasan status & transparansi di titik konfirmasi. ${topRef}${extraNote} Saran cepat: angkat klaster ini ke tab Prioritas & Aksi (MoSCoW) sebagai Must-Have.`;

      const aiMsg: AIChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        tokensUsed: 135,
      };
      onUpdateAiChatHistory([...nextWithUser, aiMsg]);
      setIsReplyingChat(false);
    }, 650);
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
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#FFF7F5] animate-fade-slide">
      {/* Efficiency Indicator Banner */}
      <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 flex flex-wrap items-center justify-between gap-4">
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
              <span className="text-[#FF7B7B]">{cleanCount} Bersih</span>
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
      <section className="rounded-2xl border border-[#F2E4E0] bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F2E4E0] bg-[#FAFAFA] flex flex-wrap items-center justify-between gap-3">
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

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddingCluster((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F4F0FB] hover:bg-[#EAE2F8] border border-[#DFD5F5] text-xs font-bold text-[#6953A8] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Masalah / Cluster Manual</span>
            </button>
            <button
              onClick={handleRunLocalClustering}
              disabled={isClustering || cleanCount === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#F2E4E0] hover:bg-gray-50 text-xs font-medium text-gray-800 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isClustering ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF7B7B]" />
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
        </div>

        <div className="p-5 space-y-4">
          {/* Manual Cluster Form */}
          {isAddingCluster && (
            <form
              onSubmit={handleCreateManualCluster}
              className="p-4 rounded-2xl bg-[#FFF7F5] border border-[#F2E4E0] space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#2D213A]">
                  Buat Cluster Masalah Manual
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingCluster(false)}
                  className="text-[#7A6B84] hover:text-[#2D213A] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Judul masalah / cluster (misal: Keraguan Status QRIS)"
                  className="px-3 py-2 rounded-xl border border-[#EEDCD7] bg-white text-xs text-[#2D213A] focus:outline-none focus:border-[#E9B949]"
                />
                <input
                  type="text"
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  placeholder="Deskripsi singkat pola masalah..."
                  className="px-3 py-2 rounded-xl border border-[#EEDCD7] bg-white text-xs text-[#2D213A] focus:outline-none focus:border-[#E9B949]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-[#7A6B84]">
                  Warna Pastel:
                </span>
                {CLUSTER_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setManualColor(c.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold border cursor-pointer ${
                      manualColor === c.id
                        ? 'bg-white border-[#2D213A] text-[#2D213A]'
                        : 'bg-white/60 border-[#EEDCD7] text-[#7A6B84]'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                    {c.label}
                  </button>
                ))}
              </div>
              {findings.length > 0 && (
                <div>
                  <span className="block text-[11px] font-bold text-[#7A6B84] mb-1.5">
                    Pilih Temuan untuk Dimasukkan ({manualFindingIds.length} dipilih):
                  </span>
                  <div className="max-h-32 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2 rounded-xl bg-white border border-[#EEDCD7]">
                    {findings
                      .filter((f) => f.status !== 'Noise / Archived')
                      .map((f) => {
                        const checked = manualFindingIds.includes(f.id);
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() =>
                              setManualFindingIds((prev) =>
                                checked
                                  ? prev.filter((id) => id !== f.id)
                                  : [...prev, f.id]
                              )
                            }
                            className={`text-left px-2.5 py-1.5 rounded-2xl text-[11px] border truncate cursor-pointer ${
                              checked
                                ? 'bg-[#FFF0EA] border-[#FF7B7B] text-[#2D213A] font-semibold'
                                : 'bg-[#FFFDFC] border-[#F2E4E0] text-[#5F506B]'
                            }`}
                          >
                            <span className="font-mono text-[#9A8CA4] mr-1">
                              {f.id}
                            </span>
                            {f.quote}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#FF7B7B] hover:bg-[#F26666] text-white text-xs font-bold cursor-pointer"
                >
                  Simpan Cluster Manual
                </button>
              </div>
            </form>
          )}

          {cleanCount === 0 && clusters.length === 0 ? (
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
                const colorSpec = CLUSTER_COLORS.find(
                  (c) => c.id === cluster.color
                );
                return (
                  <div
                    key={cluster.id}
                    onClick={() => toggleClusterSelection(cluster.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      cluster.selected
                        ? colorSpec?.card ||
                          'border-[#E9B949] bg-[#FFF0EA]/25 ring-1 ring-[#E9B949]/20'
                        : 'border-[#F2E4E0] bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {cluster.selected ? (
                          <CheckSquare className="w-4 h-4 text-[#FF7B7B] shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-300 shrink-0" />
                        )}
                        <h4 className="text-[13px] font-semibold text-gray-900">
                          {cluster.theme}
                        </h4>
                        {cluster.isManual && (
                          <span className="px-1.5 py-0.5 rounded-full bg-white text-[10px] font-bold text-[#6953A8] border border-[#DFD5F5]">
                            Manual
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 tabular-nums">
                          {cluster.frequency} kutipan
                        </span>
                        {cluster.isManual && (
                          <button
                            type="button"
                            onClick={(e) =>
                              handleDeleteManualCluster(e, cluster.id)
                            }
                            title="Hapus cluster manual"
                            className="p-1 rounded-2xl text-[#7A6B84] hover:text-rose-600 hover:bg-white cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-3 pl-6">
                      {cluster.description}
                    </p>

                    <div className="pl-6 space-y-1.5">
                      {clusterFindings.slice(0, 2).map((cf) => (
                        <div
                          key={cf.id}
                          className="text-[11.5px] text-[#5F506B] bg-[#FFF7F5]/70 border border-[#F2E4E0] rounded-xl px-2.5 py-1.5 line-clamp-2 leading-relaxed"
                        >
                          <span className="font-mono text-[#9A8CA4] mr-1.5">
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
      <section className="rounded-2xl border border-[#F2E4E0] bg-white overflow-hidden shadow-[0_4px_20px_rgba(255,123,123,0.04)]">
        <div className="px-5 py-4 border-b border-[#F2E4E0] bg-[#F5F3FF]/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SiggyMascot variant="avatar" size={38} className="shrink-0" />
            <div>
              <h3 className="text-[13px] font-bold text-[#2D213A]">
                Langkah 2 — On-Demand AI Synthesis (Siggy AI)
              </h3>
              <p className="text-xs text-[#7A6B84]">
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
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#FF7B7B] hover:bg-[#F26666] text-white text-xs font-medium shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
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

        <div className="p-5 space-y-4">
          {/* Arahan Fokus & Data Tambahan untuk AI */}
          <div className="p-4 rounded-2xl bg-[#FFF7F5] border border-[#F2E4E0] grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11.5px] font-bold text-[#2D213A] mb-1">
                Apa yang ingin kita pecahkan dari masalah ini?
              </label>
              <input
                type="text"
                value={aiObjective}
                onChange={(e) => onUpdateAiObjective(e.target.value)}
                placeholder="Misal: Turunkan drop-off saat konfirmasi biaya admin QRIS"
                className="w-full px-3 py-2 rounded-xl border border-[#EEDCD7] bg-white text-xs text-[#2D213A] focus:outline-none focus:border-[#E9B949]"
              />
            </div>
            <div>
              <label className="block text-[11.5px] font-bold text-[#2D213A] mb-1">
                Tambah Data / Konteks Tambahan untuk AI
              </label>
              <textarea
                rows={2}
                value={aiExtraContext}
                onChange={(e) => onUpdateAiExtraContext(e.target.value)}
                placeholder="Tempel catatan interview, metrik funnel, atau instruksi pola yang ingin dicari AI..."
                className="w-full px-3 py-2 rounded-xl border border-[#EEDCD7] bg-white text-xs text-[#2D213A] focus:outline-none focus:border-[#E9B949] resize-none"
              />
            </div>
          </div>

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
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F2E4E0]">
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#F2E4E0] hover:bg-gray-50 text-xs font-medium text-gray-800 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-gray-600" />
                  <span>Export Markdown (.md)</span>
                </button>
              </div>

              {/* Lean Inception Problem Statement & Classification */}
              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#F2E4E0] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Rumusan Masalah (Lean Inception Problem Formulation)
                  </h4>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      brief.dominantClassification ===
                      'Workaround — Goldmine Ide Fitur'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-[#FFF0EA] text-[#D9534F] border-[#FF7B7B]/35'
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
                          : 'bg-[#FFF0EA] text-[#D9534F]'
                      }`}
                    >
                      {brief.impactLevel}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl border border-[#F2E4E0] bg-white">
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

                  <div className="p-3.5 rounded-2xl border border-[#F2E4E0] bg-white">
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

                  <div className="p-3.5 rounded-2xl border border-[#F2E4E0] bg-white">
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
                      className="p-3 rounded-md border border-[#F2E4E0] bg-white flex flex-wrap items-center justify-between gap-2"
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
              <div className="p-4 rounded-2xl bg-[#FFF0EA]/50 border border-[#FF7B7B]/35/70">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#D9534F] mb-1">
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

      {/* Step 3: Interactive AI Co-Pilot Discussion with Siggy */}
      <section className="rounded-2xl border border-[#F2E4E0] bg-white overflow-hidden shadow-[0_4px_20px_rgba(255,123,123,0.04)]">
        <div className="px-5 py-4 border-b border-[#F2E4E0] bg-[#FFF7F5] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SiggyMascot variant="avatar" size={38} className="shrink-0" />
            <div>
              <h3 className="text-[13px] font-bold text-[#2D213A] flex items-center gap-2">
                <span>Diskusi Interaktif dengan Siggy AI</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4F0FB] text-[#6953A8] border border-[#DFD5F5]">
                  Kontekstual
                </span>
              </h3>
              <p className="text-xs text-[#7A6B84]">
                Tanyakan pola tersembunyi, skor poin tertinggi, atau ide solusi berdasarkan data versi aktif.
              </p>
            </div>
          </div>
          <span className="text-[11px] text-[#7A6B84] font-medium">
            {aiChatHistory.reduce((sum, m) => sum + (m.tokensUsed || 0), 0)} token sesi · Santai
          </span>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {[
              'Pola masalah apa yang skor poinnya paling tinggi?',
              'Apa peluang fitur dari komentar positif & workaround?',
              'Bantu rumuskan hipotesis uji coba untuk sprint ini',
            ].map((q) => (
              <button
                key={q}
                type="button"
                disabled={settings.strictZeroAI}
                onClick={() => handleSendChat(q)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FFF7F5] hover:bg-[#FFEAE3] border border-[#F2E4E0] text-[11px] font-semibold text-[#2D213A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <MessageSquarePlus className="w-3 h-3 text-[#FF7B7B]" />
                {q}
              </button>
            ))}
          </div>

          <div className="max-h-72 overflow-y-auto space-y-3 p-3 rounded-2xl bg-[#FFFDFC] border border-[#F2E4E0]">
            {aiChatHistory.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#7A6B84]">
                Belum ada diskusi. Ketik pertanyaan di bawah atau klik salah satu pertanyaan cepat di atas!
              </div>
            ) : (
              aiChatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'ai' && (
                    <SiggyMascot
                      variant="avatar"
                      size={28}
                      className="shrink-0 mt-0.5"
                    />
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#FF7B7B] text-white'
                        : 'bg-[#F4F0FB] text-[#2D213A] border border-[#DFD5F5]'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`mt-1 text-[10px] ${
                        msg.role === 'user'
                          ? 'text-white/80 text-right'
                          : 'text-[#7A6B84]'
                      }`}
                    >
                      {msg.timestamp}
                      {msg.tokensUsed ? ` · ~${msg.tokensUsed} token` : ''}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isReplyingChat && (
              <div className="flex items-center gap-2 text-xs text-[#7A6B84]">
                <SiggyMascot variant="avatar" size={24} />
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9B85D6]" />
                <span>Siggy sedang membaca temuan & skor...</span>
              </div>
            )}
          </div>

          {settings.strictZeroAI ? (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-800 flex items-center justify-between gap-2">
              <span>
                Mode 0% AI Aktif — nonaktifkan Strict Mode di Settings AI untuk mulai berdiskusi dengan Siggy.
              </span>
              <button
                type="button"
                onClick={onOpenSettings}
                className="underline font-bold cursor-pointer shrink-0"
              >
                Buka Settings AI
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tanya Siggy AI tentang temuan, sentimen positif, atau prioritas..."
                className="flex-1 px-3.5 py-2.5 rounded-2xl border border-[#EEDCD7] bg-white text-xs text-[#2D213A] focus:outline-none focus:border-[#E9B949]"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isReplyingChat}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#9B85D6] hover:bg-[#866EC8] text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
