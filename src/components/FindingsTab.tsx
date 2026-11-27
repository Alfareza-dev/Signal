'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Archive,
  AlertCircle,
  ArrowRight,
  ArrowUpDown,
  AtSign,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Flame,
  Folder,
  Heart,
  LayoutGrid,
  List,
  MessageCircle,
  Plus,
  Search,
  Share2,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import {
  EmpathyQuadrant,
  Finding,
  FindingStatus,
  MonitoredAccount,
  SourcePlatform,
  ThresholdConfig,
} from '@/types/problemhub';
import { calculateFindingScore } from '@/data/mockData';
import { getActiveKeywords, HighlightQuote } from './HighlightQuote';
import { QuickTriageModal } from './QuickTriageModal';
import { SiggyMascot } from './SiggyMascot';
import {
  getLabelColorClass,
  getQuadrantBadgeClass,
  SourceIcon,
  StatusIcon,
} from './SourceBadge';

interface FindingsTabProps {
  findings: Finding[];
  newFindingIds: Set<string>;
  empathyMapCount: number;
  searchQuery: string;
  thresholdConfig: ThresholdConfig;
  monitoredAccounts?: MonitoredAccount[];
  onSearchQueryChange: (val: string) => void;
  onUpdateFinding: (findingId: string, updates: Partial<Finding>) => void;
  onSelectFinding: (finding: Finding) => void;
  onOpenIntakeModal: () => void;
  onGoToEmpathyMap: () => void;
}

const SOURCE_FILTERS: ('All' | SourcePlatform)[] = [
  'All',
  'X / Twitter',
  'Instagram',
  'Play Store',
  'Jurnal (OpenAlex)',
];

const STATUS_GROUPS: FindingStatus[] = [
  'Raw / Perlu Triage',
  'Pain Point',
  'Workaround',
  'Positif / Delighter',
  'Noise / Archived',
];

const QUADRANTS: EmpathyQuadrant[] = ['Says', 'Thinks', 'Feels', 'Does'];

function getStatusStripColor(status: FindingStatus): string {
  switch (status) {
    case 'Pain Point':
      return 'border-l-4 border-l-[#FF7B7B]';
    case 'Workaround':
      return 'border-l-4 border-l-[#E9B949]';
    case 'Positif / Delighter':
      return 'border-l-4 border-l-emerald-400';
    case 'Raw / Perlu Triage':
      return 'border-l-4 border-l-[#9B85D6]';
    case 'Noise / Archived':
      return 'border-l-4 border-l-stone-300';
  }
}

export function FindingsTab({
  findings,
  newFindingIds,
  empathyMapCount,
  searchQuery,
  thresholdConfig,
  monitoredAccounts = [],
  onSearchQueryChange,
  onUpdateFinding,
  onSelectFinding,
  onOpenIntakeModal,
  onGoToEmpathyMap,
}: FindingsTabProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [sourceFilter, setSourceFilter] = useState<'All' | SourcePlatform>('All');
  const [folderFilter, setFolderFilter] = useState<string>('All');
  const [hotOnly, setHotOnly] = useState(false);
  const [mentionCollectionOnly, setMentionCollectionOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'score' | 'likes' | 'interactions'>('newest');
  const [isQuickTriageOpen, setIsQuickTriageOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    'Noise / Archived': false,
  });
  const [addingTagForId, setAddingTagForId] = useState<string | null>(null);
  const [newTagText, setNewTagText] = useState('');
  const [statusMenuForId, setStatusMenuForId] = useState<string | null>(null);

  useEffect(() => {
    if (!statusMenuForId) return;
    const closeMenu = () => setStatusMenuForId(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [statusMenuForId]);

  const keywords = useMemo(
    () => getActiveKeywords(thresholdConfig),
    [thresholdConfig]
  );

  const availableFolders = useMemo(() => {
    const set = new Set<string>();
    for (const f of findings) {
      if (f.folder) set.add(f.folder);
    }
    return Array.from(set);
  }, [findings]);

  const allProjectLabels = useMemo(() => {
    const set = new Set<string>();
    for (const f of findings) {
      for (const l of f.labels) {
        set.add(l);
      }
    }
    return Array.from(set);
  }, [findings]);

  const activeFolderFilter =
    folderFilter === 'All' || availableFolders.includes(folderFilter)
      ? folderFilter
      : 'All';

  const toggleGroup = (status: FindingStatus) => {
    setCollapsedGroups((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  // Pulse Strip Stats
  const rawFindings = findings.filter((f) => f.status === 'Raw / Perlu Triage');
  const rawCount = rawFindings.length;
  const painCount = findings.filter((f) => f.status === 'Pain Point').length;
  const workCount = findings.filter((f) => f.status === 'Workaround').length;
  const posCount = findings.filter((f) => f.status === 'Positif / Delighter').length;
  const totalCount = Math.max(1, findings.length);

  const monitoredHandles = useMemo(
    () => monitoredAccounts.map((a) => a.handle),
    [monitoredAccounts]
  );

  const hotSignalsCount = useMemo(
    () =>
      findings.filter(
        (f) =>
          f.status !== 'Noise / Archived' &&
          calculateFindingScore(f, thresholdConfig, monitoredHandles).passedThreshold
      ).length,
    [findings, thresholdConfig, monitoredHandles]
  );

  const mentionCollectionCount = useMemo(
    () =>
      findings.filter(
        (f) =>
          f.status !== 'Noise / Archived' &&
          calculateFindingScore(f, thresholdConfig, monitoredHandles).isMentionCollection
      ).length,
    [findings, thresholdConfig, monitoredHandles]
  );

  const filteredFindings = useMemo(() => {
    const base = findings.filter((f) => {
      const matchesSource = sourceFilter === 'All' || f.source === sourceFilter;
      const matchesFolder =
        activeFolderFilter === 'All' || f.folder === activeFolderFilter;
      const scoreInfo = calculateFindingScore(f, thresholdConfig, monitoredHandles);
      const matchesHot =
        !hotOnly ||
        (f.status !== 'Noise / Archived' && scoreInfo.passedThreshold);
      const matchesMention =
        !mentionCollectionOnly ||
        (f.status !== 'Noise / Archived' && scoreInfo.isMentionCollection);
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        f.quote.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q) ||
        f.author.toLowerCase().includes(q) ||
        (f.mentionedAccount && f.mentionedAccount.toLowerCase().includes(q)) ||
        (f.folder && f.folder.toLowerCase().includes(q)) ||
        f.labels.some((l) => l.toLowerCase().includes(q));
      return (
        matchesSource &&
        matchesFolder &&
        matchesHot &&
        matchesMention &&
        matchesQuery
      );
    });

    if (sortBy === 'newest') return base;

    return [...base].sort((a, b) => {
      if (sortBy === 'score') {
        return (
          calculateFindingScore(b, thresholdConfig, monitoredHandles).totalScore -
          calculateFindingScore(a, thresholdConfig, monitoredHandles).totalScore
        );
      }
      if (sortBy === 'likes') {
        return (b.likes ?? b.interactions ?? 0) - (a.likes ?? a.interactions ?? 0);
      }
      return (
        calculateFindingScore(b, thresholdConfig, monitoredHandles).totalInteractions -
        calculateFindingScore(a, thresholdConfig, monitoredHandles).totalInteractions
      );
    });
  }, [
    findings,
    sourceFilter,
    activeFolderFilter,
    thresholdConfig,
    monitoredHandles,
    hotOnly,
    mentionCollectionOnly,
    searchQuery,
    sortBy,
  ]);

  const handleAddTag = (finding: Finding, tagValue?: string) => {
    const trimmed = (tagValue ?? newTagText).trim();
    if (trimmed && !finding.labels.includes(trimmed)) {
      onUpdateFinding(finding.id, { labels: [...finding.labels, trimmed] });
    }
    setNewTagText('');
    setAddingTagForId(null);
  };

  const handleRemoveTag = (finding: Finding, tagToRemove: string) => {
    onUpdateFinding(finding.id, {
      labels: finding.labels.filter((l) => l !== tagToRemove),
    });
  };

  if (findings.length === 0) {
    return (
      <div className="flex-1 h-full flex items-center justify-center p-8 bg-[#FFF7F5]">
        <div className="max-w-md text-center space-y-4 bg-white border border-[#F4DFDA] rounded-3xl p-8 shadow-[0_8px_30px_rgb(180,110,100,0.08)]">
          <div className="flex justify-center">
            <SiggyMascot variant="avatar" size={88} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-[#2D213A]">
              Project ini masih kosong
            </h3>
            <p className="text-[13px] text-[#7A6B84] leading-relaxed">
              Siggy siap membantumu menarik data keluhan pengguna dari media
              sosial, jurnal OpenAlex, atau CSV untuk memulai triage &
              qualitative coding.
            </p>
          </div>
          <button
            onClick={onOpenIntakeModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF7B7B] hover:bg-[#F26666] border-b-4 border-[#DF5656] active:border-b-0 active:translate-y-1 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Mulai Problem Farming (Ambil Data)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FFF7F5]/60">
      {/* A. Visual Pulse Strip (3-Second Visual Summary) */}
      <div className="px-6 pt-4 pb-3 border-b border-[#F4DFDA] bg-white grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-3 items-center">
        {/* 1. Animated Stacked Bar */}
        <div className="p-3 rounded-2xl bg-[#FFF7F5] border border-[#F4DFDA] space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="font-bold text-[#2D213A]">
              Pulse Status ({findings.length} Temuan)
            </span>
            <div className="flex flex-wrap items-center gap-3 font-semibold">
              <span className="text-[#9B85D6]">Raw: {rawCount}</span>
              <span className="text-[#FF7B7B]">Pain: {painCount}</span>
              <span className="text-[#B7791F]">Work: {workCount}</span>
              <span className="text-emerald-600">Positif: {posCount}</span>
            </div>
          </div>
          <div className="w-full h-2.5 bg-stone-200/70 rounded-full overflow-hidden flex">
            <motion.div
              className="h-full bg-[#9B85D6]"
              animate={{ width: `${(rawCount / totalCount) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            />
            <motion.div
              className="h-full bg-[#FF7B7B]"
              animate={{ width: `${(painCount / totalCount) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            />
            <motion.div
              className="h-full bg-[#E9B949]"
              animate={{ width: `${(workCount / totalCount) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            />
            <motion.div
              className="h-full bg-emerald-400"
              animate={{ width: `${(posCount / totalCount) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            />
          </div>
        </div>

        {/* 2. Mini "Hot Signals" Card */}
        <button
          type="button"
          onClick={() => setHotOnly((prev) => !prev)}
          className={`px-4 py-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            hotOnly
              ? 'bg-rose-50 border-[#FF7B7B] border-b-3 shadow-xs'
              : 'bg-white border-[#F4DFDA] hover:border-[#FF7B7B]/60'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#7A6B84]">
              Hot Signals (≥ {thresholdConfig.scoreThreshold} pt)
            </p>
            <p className="text-sm font-extrabold text-[#2D213A] tabular-nums">
              {hotSignalsCount} Temuan{' '}
              {hotOnly && (
                <span className="text-[10px] text-[#FF7B7B] font-bold ml-1">
                  (Aktif)
                </span>
              )}
            </p>
          </div>
        </button>

        {/* 3. Tactile Mode Triage Cepat Button */}
        {rawCount > 0 ? (
          <button
            type="button"
            onClick={() => setIsQuickTriageOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#FF7B7B] hover:bg-[#F26666] border-b-4 border-[#DF5656] active:border-b-0 active:translate-y-1 text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Zap className="w-4 h-4" />
            <span>Mode Triage Cepat ({rawCount} Raw)</span>
          </button>
        ) : (
          empathyMapCount > 0 && (
            <button
              type="button"
              onClick={onGoToEmpathyMap}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-[#FFF0EA] hover:bg-[#FFE4DA] border border-[#F4DFDA] border-b-3 border-b-[#FF7B7B] active:border-b-0 active:translate-y-1 text-[#D9534F] text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              <span>Lanjut ke Empathy Map ({empathyMapCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </div>

      {/* Filter Bar + View Mode Toggle (Kartu | Daftar) */}
      <div className="px-6 py-2.5 border-b border-[#F4DFDA] flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-1 flex-wrap">
          {SOURCE_FILTERS.map((src) => {
            const active = sourceFilter === src;
            return (
              <button
                key={src}
                onClick={() => setSourceFilter(src)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#FFF0EA] text-[#2D213A] border border-[#FF7B7B]/40'
                    : 'text-[#7A6B84] hover:text-[#2D213A] hover:bg-[#FFF7F5] border border-transparent'
                }`}
              >
                {src !== 'All' && (
                  <SourceIcon source={src} className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{src}</span>
              </button>
            );
          })}
          {/* Mention Collection Prominent Pill */}
          <button
            type="button"
            onClick={() => setMentionCollectionOnly((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              mentionCollectionOnly
                ? 'bg-[#9B85D6] text-white border-[#7D66BD] shadow-xs'
                : 'bg-[#F4F0FB] text-[#6953A8] border-[#DFD5F5] hover:bg-[#EAE2F8]'
            }`}
          >
            <AtSign className="w-3.5 h-3.5" />
            <span>Mention Collection</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold tabular-nums ${
                mentionCollectionOnly
                  ? 'bg-white/25 text-white'
                  : 'bg-white text-[#6953A8]'
              }`}
            >
              {mentionCollectionCount}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#7A6B84] absolute left-2.5 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as 'newest' | 'score' | 'likes' | 'interactions'
                )
              }
              aria-label="Urutkan Temuan"
              className="bg-[#FFF7F5] border border-[#F4DFDA] rounded-xl pl-8 pr-6 py-1.5 text-xs text-[#2D213A] font-semibold focus:outline-none focus:border-[#E9B949] cursor-pointer"
            >
              <option value="newest">Urut: Terbaru</option>
              <option value="score">Urut: Skor Poin Tertinggi</option>
              <option value="likes">Urut: Likes Terbanyak</option>
              <option value="interactions">Urut: Total Interaksi Tertinggi</option>
            </select>
          </div>

          {/* Folder Filter */}
          <div className="relative flex items-center">
            <Folder className="w-3.5 h-3.5 text-[#7A6B84] absolute left-2.5 pointer-events-none" />
            <select
              value={activeFolderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              aria-label="Filter Folder"
              className="bg-[#FFF7F5] border border-[#F4DFDA] rounded-xl pl-8 pr-6 py-1.5 text-xs text-[#2D213A] font-semibold focus:outline-none focus:border-[#E9B949] cursor-pointer"
            >
              <option value="All">Folder: Semua</option>
              {availableFolders.map((folder) => (
                <option key={folder} value={folder}>
                  Folder: {folder}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 text-[#7A6B84] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Filter temuan..."
              className="w-full bg-[#FFF7F5] border border-[#F4DFDA] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#2D213A] placeholder:text-[#B5A7BE] focus:outline-none focus:border-[#E9B949] focus:ring-2 focus:ring-[#E9B949]/20"
            />
          </div>

          {/* Kartu | Daftar Toggle */}
          <div className="inline-flex items-center rounded-xl bg-[#FFF7F5] p-0.5 border border-[#F4DFDA]">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-[#2D213A] shadow-2xs'
                  : 'text-[#7A6B84] hover:text-[#2D213A]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kartu</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[#2D213A] shadow-2xs'
                  : 'text-[#7A6B84] hover:text-[#2D213A]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Daftar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Cards (Default) OR List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {filteredFindings.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#7A6B84] italic bg-white rounded-2xl border border-[#F4DFDA]">
            Tidak ada temuan yang cocok dengan filter saat ini.
          </div>
        ) : viewMode === 'cards' ? (
          /* B. Visual Signal Cards (2-Column Grid) */
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredFindings.map((finding) => {
              const scoreEval = calculateFindingScore(
                finding,
                thresholdConfig,
                monitoredHandles
              );
              const suggestions = allProjectLabels.filter(
                (lbl) => !finding.labels.includes(lbl)
              );
              const urgencyBarPct = Math.min(
                100,
                Math.max(
                  15,
                  Math.round(
                    (scoreEval.totalScore /
                      Math.max(1, thresholdConfig.scoreThreshold + 4)) *
                      100
                  )
                )
              );

              return (
                <motion.div
                  key={finding.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => onSelectFinding(finding)}
                  className={`rounded-2xl bg-white border border-[#F4DFDA] ${getStatusStripColor(
                    finding.status
                  )} p-4 shadow-[0_4px_16px_rgb(180,110,100,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_24px_rgb(180,110,100,0.12)] transition-all cursor-pointer flex flex-col justify-between gap-3.5 group`}
                >
                  {/* Card Header: Brand Logo + ID + Status + 3D Score Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="relative flex items-center gap-2 flex-wrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SourceIcon source={finding.source} className="w-4 h-4 shrink-0" />
                      <span
                        onClick={() => onSelectFinding(finding)}
                        className="text-xs font-mono font-bold text-[#7A6B84] hover:text-[#2D213A]"
                      >
                        {finding.id}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatusMenuForId(
                            statusMenuForId === finding.id ? null : finding.id
                          );
                        }}
                        title={`Status: ${finding.status}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF7F5] border border-[#F4DFDA] text-[11px] font-semibold text-[#2D213A] hover:border-[#FF7B7B] cursor-pointer"
                      >
                        <StatusIcon status={finding.status} className="w-3.5 h-3.5" />
                        <span>{finding.status}</span>
                      </button>

                      {newFindingIds.has(finding.id) && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF7B7B] text-white animate-pulse">
                          Baru
                        </span>
                      )}

                      {statusMenuForId === finding.id && (
                        <div className="absolute left-0 top-7 z-30 w-48 bg-white border border-[#F4DFDA] rounded-xl shadow-lg py-1 text-xs">
                          {STATUS_GROUPS.map((st) => {
                            const isCurrent = finding.status === st;
                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() => {
                                  onUpdateFinding(finding.id, { status: st });
                                  setStatusMenuForId(null);
                                }}
                                className={`w-full px-3 py-1.5 flex items-center justify-between gap-2 text-left hover:bg-[#FFF7F5] cursor-pointer ${
                                  isCurrent
                                    ? 'text-[#FF7B7B] font-bold bg-[#FFF0EA]/60'
                                    : 'text-[#2D213A]'
                                }`}
                              >
                                <span className="flex items-center gap-2 min-w-0">
                                  <StatusIcon status={st} className="w-3.5 h-3.5" />
                                  <span className="truncate">{st}</span>
                                </span>
                                {isCurrent && <Check className="w-3.5 h-3.5" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* 3D Score Badge */}
                    <div
                      title={
                        scoreEval.breakdown
                          .map((b) => `${b.label} (+${b.points})`)
                          .join(', ') || 'Belum ada poin'
                      }
                      className={`px-2.5 py-1 rounded-2xl border border-b-3 shrink-0 min-w-[78px] ${
                        scoreEval.urgency === 'Tinggi'
                          ? 'bg-rose-50 border-rose-200 border-b-rose-400 text-rose-700'
                          : scoreEval.urgency === 'Sedang'
                          ? 'bg-[#FFFBEB] border-[#E9B949]/40 border-b-[#E9B949] text-[#9A6B16]'
                          : 'bg-emerald-50 border-emerald-200 border-b-emerald-400 text-emerald-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <Flame className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs font-extrabold tabular-nums">
                          {scoreEval.totalScore} PT
                        </span>
                      </div>
                      <div className="w-full h-1 bg-white/80 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#34D399] via-[#E9B949] to-[#FF7B7B]"
                          style={{ width: `${urgencyBarPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Body: Quote with Auto-Highlight Pastel Stabilo */}
                  <div className="space-y-1.5">
                    <p className="text-[13.5px] leading-relaxed text-[#2D213A]">
                      “<HighlightQuote text={finding.quote} keywords={keywords} />”
                    </p>
                    <p className="text-[11px] text-[#7A6B84]">
                      {finding.author} · {finding.folder} · {finding.createdAt}
                    </p>
                  </div>

                  {/* Card Footer: Metrics, Labels, Quadrant & Tactile Quick Actions */}
                  <div
                    className="pt-2.5 border-t border-[#F4DFDA]/70 space-y-2.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {/* Interaction Metrics + Mention Badge + Labels */}
                      <div className="relative flex flex-wrap items-center gap-1.5">
                        <span
                          title="Likes"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7A6B84] mr-1"
                        >
                          <Heart className="w-3 h-3 text-[#FF7B7B]" />
                          {(finding.likes ?? finding.interactions ?? 18).toLocaleString('id-ID')}
                        </span>
                        <span
                          title="Shares / Reposts"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7A6B84] mr-1"
                        >
                          <Share2 className="w-3 h-3 text-[#E9B949]" />
                          {(finding.shares ?? Math.max(1, Math.round((finding.interactions ?? 18) * 0.1))).toLocaleString('id-ID')}
                        </span>
                        <span
                          title="Comments"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7A6B84] mr-1.5"
                        >
                          <MessageCircle className="w-3 h-3 text-[#9B85D6]" />
                          {(finding.comments ?? Math.max(2, Math.round((finding.interactions ?? 18) * 0.15))).toLocaleString('id-ID')}
                        </span>
                        {finding.mentionedAccount && (
                          <span className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10.5px] font-bold bg-[#F4F0FB] text-[#6953A8] border border-[#DFD5F5]">
                            <AtSign className="w-2.5 h-2.5" />
                            {finding.mentionedAccount.replace(/^@/, '')}
                          </span>
                        )}

                        {finding.labels.map((label) => (
                          <span
                            key={label}
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border ${getLabelColorClass(
                              label
                            )}`}
                          >
                            <span>{label}</span>
                            <button
                              onClick={() => handleRemoveTag(finding, label)}
                              className="opacity-60 hover:opacity-100 cursor-pointer"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ))}

                        <button
                          onClick={() => {
                            setAddingTagForId(
                              addingTagForId === finding.id ? null : finding.id
                            );
                            setNewTagText('');
                          }}
                          title="Tambah label tema"
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[#7A6B84] hover:text-[#FF7B7B] hover:bg-[#FFF0EA] border border-dashed border-[#E0C9C2] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>

                        {addingTagForId === finding.id && (
                          <div className="absolute left-0 top-7 z-30 w-52 bg-white border border-[#F4DFDA] rounded-xl shadow-lg p-2 space-y-2">
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleAddTag(finding);
                              }}
                              className="flex gap-1"
                            >
                              <input
                                type="text"
                                autoFocus
                                value={newTagText}
                                onChange={(e) => setNewTagText(e.target.value)}
                                placeholder="Ketik label..."
                                className="flex-1 min-w-0 px-2 py-1 text-[11px] border border-[#F4DFDA] rounded-lg focus:outline-none focus:border-[#E9B949]"
                              />
                              <button
                                type="submit"
                                className="px-2 py-1 rounded-lg bg-[#FF7B7B] text-white text-[11px] font-bold cursor-pointer"
                              >
                                Add
                              </button>
                            </form>
                            {suggestions.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1 border-t border-[#F4DFDA]">
                                {suggestions.map((lbl) => (
                                  <button
                                    key={lbl}
                                    type="button"
                                    onClick={() => handleAddTag(finding, lbl)}
                                    className="px-1.5 py-0.5 rounded-full bg-[#FFF7F5] hover:bg-[#FFF0EA] text-[10.5px] text-[#2D213A] border border-[#F4DFDA] cursor-pointer"
                                  >
                                    + {lbl}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quadrant Select (disabled for secondary academic literature) */}
                      {finding.source === 'Jurnal (OpenAlex)' ? (
                        <span
                          title="Literatur sekunder dipisahkan dari 4 kuadran suara pengguna"
                          className="inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-[#F4F0FB] text-[#6953A8] border border-[#DFD5F5]"
                        >
                          Validasi Akademik
                        </span>
                      ) : (
                        <select
                          value={finding.quadrant || ''}
                          onChange={(e) =>
                            onUpdateFinding(finding.id, {
                              quadrant: (e.target.value || undefined) as
                                | EmpathyQuadrant
                                | undefined,
                            })
                          }
                          className={`text-[11px] font-semibold rounded-xl border px-2.5 py-1 focus:outline-none focus:border-[#E9B949] cursor-pointer ${
                            finding.quadrant
                              ? getQuadrantBadgeClass(finding.quadrant)
                              : 'bg-[#FFF7F5] text-[#7A6B84] border-[#F4DFDA]'
                          }`}
                        >
                          <option value="">— Kuadran —</option>
                          {QUADRANTS.map((q) => (
                            <option key={q} value={q}>
                              {q}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Tactile 1-Click Triage Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateFinding(finding.id, {
                            status:
                              finding.status === 'Pain Point'
                                ? 'Raw / Perlu Triage'
                                : 'Pain Point',
                          })
                        }
                        className={`flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          finding.status === 'Pain Point'
                            ? 'bg-[#FF7B7B] text-white border-[#DF5656] border-b-3'
                            : 'bg-[#FFF0EA]/70 text-[#D9534F] border-[#F4DFDA] border-b-2 hover:bg-[#FFF0EA]'
                        }`}
                      >
                        <AlertCircle className="w-3 h-3" />
                        <span>Pain</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateFinding(finding.id, {
                            status:
                              finding.status === 'Workaround'
                                ? 'Raw / Perlu Triage'
                                : 'Workaround',
                          })
                        }
                        className={`flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          finding.status === 'Workaround'
                            ? 'bg-[#E9B949] text-white border-[#B7881E] border-b-3'
                            : 'bg-[#FFFBEB] text-[#9A6B16] border-[#E9B949]/40 border-b-2 hover:bg-[#FEF3C7]/70'
                        }`}
                      >
                        <Wrench className="w-3 h-3" />
                        <span>Workaround</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateFinding(finding.id, {
                            status:
                              finding.status === 'Positif / Delighter'
                                ? 'Raw / Perlu Triage'
                                : 'Positif / Delighter',
                          })
                        }
                        className={`flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          finding.status === 'Positif / Delighter'
                            ? 'bg-emerald-500 text-white border-emerald-700 border-b-3'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 border-b-2 hover:bg-emerald-100/70'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Positif</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateFinding(finding.id, {
                            status:
                              finding.status === 'Noise / Archived'
                                ? 'Raw / Perlu Triage'
                                : 'Noise / Archived',
                          })
                        }
                        title="Buang ke Noise / Archived"
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          finding.status === 'Noise / Archived'
                            ? 'bg-stone-600 text-white border-stone-800 border-b-3'
                            : 'bg-stone-100 text-[#7A6B84] border-stone-200 border-b-2 hover:bg-stone-200'
                        }`}
                      >
                        <Archive className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Compact Accordion List View */
          <div className="rounded-2xl border border-[#F4DFDA] bg-white overflow-hidden divide-y divide-[#F4DFDA]">
            {STATUS_GROUPS.map((status) => {
              const groupItems = filteredFindings.filter(
                (f) => f.status === status
              );
              const isCollapsed = !!collapsedGroups[status];

              return (
                <div key={status}>
                  <button
                    onClick={() => toggleGroup(status)}
                    className="w-full px-5 py-2.5 flex items-center gap-2.5 bg-[#FFF7F5] hover:bg-[#FFF0EA]/70 transition-colors text-left cursor-pointer"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-[#7A6B84]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#7A6B84]" />
                    )}
                    <StatusIcon status={status} className="w-4 h-4" />
                    <span className="text-[13px] font-bold text-[#2D213A]">
                      {status}
                    </span>
                    <span className="text-xs text-[#7A6B84] font-semibold tabular-nums">
                      {groupItems.length}
                    </span>
                    {status === 'Workaround' && (
                      <span className="text-[11px] text-[#7A6B84]">
                        · Akal-akalan pengguna (sinyal ide fitur)
                      </span>
                    )}
                  </button>

                  {!isCollapsed && (
                    <div className="divide-y divide-[#F4DFDA]/70">
                      {groupItems.length === 0 ? (
                        <div className="px-5 py-4 text-xs text-[#7A6B84] italic">
                          Belum ada temuan pada status ini.
                        </div>
                      ) : (
                        groupItems.map((finding) => {
                          const scoreEval = calculateFindingScore(
                            finding,
                            thresholdConfig,
                            monitoredHandles
                          );
                          return (
                            <div
                              key={finding.id}
                              onClick={() => onSelectFinding(finding)}
                              className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-[#FFF7F5] cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <SourceIcon
                                  source={finding.source}
                                  className="w-4 h-4 shrink-0"
                                />
                                <span className="text-xs font-mono font-bold text-[#7A6B84] shrink-0">
                                  {finding.id}
                                </span>
                                <p className="text-[13px] text-[#2D213A] truncate">
                                  <HighlightQuote
                                    text={finding.quote}
                                    keywords={keywords}
                                  />
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                                    scoreEval.urgency === 'Tinggi'
                                      ? 'bg-rose-50 text-rose-700'
                                      : scoreEval.urgency === 'Sedang'
                                      ? 'bg-[#FFFBEB] text-[#9A6B16]'
                                      : 'bg-emerald-50 text-emerald-700'
                                  }`}
                                >
                                  {scoreEval.totalScore} PT
                                </span>
                                {finding.source === 'Jurnal (OpenAlex)' ? (
                                  <span
                                    title="Literatur sekunder dipisahkan dari 4 kuadran suara pengguna"
                                    className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#F4F0FB] text-[#6953A8] border border-[#DFD5F5]"
                                  >
                                    Validasi Akademik
                                  </span>
                                ) : (
                                  <span className="text-xs text-[#7A6B84]">
                                    {finding.quadrant || '—'}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* C. Mode Triage Cepat Modal */}
      <QuickTriageModal
        isOpen={isQuickTriageOpen}
        rawFindings={rawFindings}
        thresholdConfig={thresholdConfig}
        onClose={() => setIsQuickTriageOpen(false)}
        onTriageItem={(id, status) => onUpdateFinding(id, { status })}
      />
    </div>
  );
}
