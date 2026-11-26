'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Folder,
  Inbox,
  Plus,
  Search,
  Wrench,
  X,
} from 'lucide-react';
import {
  EmpathyQuadrant,
  Finding,
  FindingStatus,
  SourcePlatform,
} from '@/types/problemhub';
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
  'Noise / Archived',
];

const QUADRANTS: EmpathyQuadrant[] = ['Says', 'Thinks', 'Feels', 'Does'];

export function FindingsTab({
  findings,
  newFindingIds,
  empathyMapCount,
  searchQuery,
  onSearchQueryChange,
  onUpdateFinding,
  onSelectFinding,
  onOpenIntakeModal,
  onGoToEmpathyMap,
}: FindingsTabProps) {
  const [sourceFilter, setSourceFilter] = useState<'All' | SourcePlatform>('All');
  const [folderFilter, setFolderFilter] = useState<string>('All');
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

  const filteredFindings = findings.filter((f) => {
    const matchesSource = sourceFilter === 'All' || f.source === sourceFilter;
    const matchesFolder =
      activeFolderFilter === 'All' || f.folder === activeFolderFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      f.quote.toLowerCase().includes(q) ||
      f.id.toLowerCase().includes(q) ||
      f.author.toLowerCase().includes(q) ||
      (f.folder && f.folder.toLowerCase().includes(q)) ||
      f.labels.some((l) => l.toLowerCase().includes(q));
    return matchesSource && matchesFolder && matchesQuery;
  });

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
      <div className="flex-1 h-full flex items-center justify-center p-8 bg-white">
        <div className="max-w-md text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold text-gray-900">
              Project ini masih kosong
            </h3>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Mulai dengan menarik data keluhan pengguna dari media sosial,
              jurnal akademik OpenAlex, atau import CSV untuk memulai triage &
              qualitative coding.
            </p>
          </div>
          <button
            onClick={onOpenIntakeModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Mulai Problem Farming (Ambil Data)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Filter Bar */}
      <div className="px-6 py-3 border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-1 flex-wrap">
          {SOURCE_FILTERS.map((src) => {
            const active = sourceFilter === src;
            return (
              <button
                key={src}
                onClick={() => setSourceFilter(src)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-gray-100 text-gray-900 border border-gray-200/80'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 border border-transparent'
                }`}
              >
                {src !== 'All' && (
                  <SourceIcon source={src} className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{src}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Folder Filter Dropdown */}
          <div className="relative flex items-center">
            <Folder className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none" />
            <select
              value={activeFolderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              aria-label="Filter Folder"
              className="bg-white border border-[#E5E7EB] rounded-md pl-8 pr-6 py-1.5 text-xs text-gray-700 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
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
          <div className="relative w-52">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Filter temuan..."
              className="w-full bg-white border border-[#E5E7EB] rounded-md pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
            />
          </div>

          {empathyMapCount > 0 && (
            <button
              onClick={onGoToEmpathyMap}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100/80 text-blue-700 border border-blue-200/80 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>Lanjut ke Empathy Map ({empathyMapCount} item)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table Column Header */}
      <div className="px-6 py-2.5 border-b border-[#E5E7EB] bg-[#FAFAFA] text-xs font-medium text-gray-400 grid grid-cols-[118px_minmax(260px,1fr)_185px_114px_184px] gap-4 items-center">
        <span>ID & Status</span>
        <span>Temuan / Kutipan Pengguna</span>
        <span>Label / Tema</span>
        <span>Empathy Map</span>
        <span className="text-right">Aksi Cepat</span>
      </div>

      {/* Accordion Groups */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#E5E7EB]">
        {STATUS_GROUPS.map((status) => {
          const groupItems = filteredFindings.filter((f) => f.status === status);
          const isCollapsed = !!collapsedGroups[status];

          return (
            <div key={status} className="bg-white">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(status)}
                className="w-full px-6 py-2.5 flex items-center gap-2.5 bg-[#F9FAFB] hover:bg-gray-100/70 transition-colors text-left border-b border-[#E5E7EB]/60 cursor-pointer"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
                <StatusIcon status={status} className="w-4 h-4" />
                <span className="text-[13px] font-semibold text-gray-800">
                  {status}
                </span>
                <span className="text-xs text-gray-400 font-medium tabular-nums">
                  {groupItems.length}
                </span>
                {status === 'Workaround' && (
                  <span className="text-[11px] text-gray-400 font-normal">
                    · Akal-akalan pengguna (sinyal ide fitur)
                  </span>
                )}
              </button>

              {/* Group Rows */}
              {!isCollapsed && (
                <div className="divide-y divide-[#E5E7EB]/60">
                  {groupItems.length === 0 ? (
                    <div className="px-6 py-4 text-xs text-gray-400 italic">
                      Belum ada temuan pada status ini.
                    </div>
                  ) : (
                    groupItems.map((finding) => {
                      const suggestions = allProjectLabels.filter(
                        (lbl) => !finding.labels.includes(lbl)
                      );
                      return (
                        <div
                          key={finding.id}
                          onClick={() => onSelectFinding(finding)}
                          className="px-6 py-3.5 grid grid-cols-[118px_minmax(260px,1fr)_185px_114px_184px] gap-4 items-start hover:bg-blue-50/25 cursor-pointer transition-colors group"
                        >
                          {/* ID, Status Ring (Interactive Dropdown) & Platform Icon */}
                          <div
                            className="relative flex items-center gap-2 min-w-0 pt-0.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span title={finding.source}>
                              <SourceIcon
                                source={finding.source}
                                className="w-4 h-4 shrink-0"
                              />
                            </span>
                            <span
                              onClick={() => onSelectFinding(finding)}
                              className="text-xs font-mono font-medium text-gray-500 hover:text-gray-900 truncate cursor-pointer"
                            >
                              {finding.id}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setStatusMenuForId(
                                  statusMenuForId === finding.id
                                    ? null
                                    : finding.id
                                );
                              }}
                              title={`Status: ${finding.status} (Klik untuk ubah)`}
                              className="p-0.5 rounded hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                            >
                              <StatusIcon
                                status={finding.status}
                                className="w-4 h-4"
                              />
                            </button>

                            {statusMenuForId === finding.id && (
                              <div className="absolute left-0 top-7 z-30 w-48 bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1 text-xs">
                                <p className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                  Ubah Status
                                </p>
                                {STATUS_GROUPS.map((st) => {
                                  const isCurrent = finding.status === st;
                                  return (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => {
                                        onUpdateFinding(finding.id, {
                                          status: st,
                                        });
                                        setStatusMenuForId(null);
                                      }}
                                      className={`w-full px-2.5 py-1.5 flex items-center justify-between gap-2 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                                        isCurrent
                                          ? 'text-blue-700 font-medium bg-blue-50/40'
                                          : 'text-gray-700'
                                      }`}
                                    >
                                      <span className="flex items-center gap-2 min-w-0">
                                        <StatusIcon
                                          status={st}
                                          className="w-3.5 h-3.5 shrink-0"
                                        />
                                        <span className="truncate">{st}</span>
                                      </span>
                                      {isCurrent && (
                                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Readable Quote + Author & Folder Subline */}
                          <div className="min-w-0 pr-2 space-y-1">
                            <p className="text-[13.5px] leading-relaxed text-gray-800 line-clamp-2 group-hover:text-gray-950">
                              {finding.quote}
                            </p>
                            <div className="flex items-center gap-2">
                              {newFindingIds.has(finding.id) && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-600 text-white animate-pulse">
                                  Baru
                                </span>
                              )}
                              <p className="text-xs text-gray-400 truncate">
                                {finding.author}
                                {finding.folder ? ` · ${finding.folder}` : ''} ·{' '}
                                {finding.createdAt}
                              </p>
                            </div>
                          </div>

                          {/* Editable Labels + Always-Visible Quick Add (+) */}
                          <div
                            className="relative flex items-center gap-1.5 flex-wrap pt-0.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {finding.labels.map((label) => (
                              <span
                                key={label}
                                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium border ${getLabelColorClass(
                                  label
                                )}`}
                              >
                                <span className="truncate max-w-[130px]">
                                  {label}
                                </span>
                                <button
                                  onClick={() => handleRemoveTag(finding, label)}
                                  title="Hapus label"
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
                              title="Tambah atau pilih label tema"
                              className="inline-flex items-center justify-center w-5 h-5 rounded text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-dashed border-gray-300 hover:border-blue-300 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>

                            {addingTagForId === finding.id && (
                              <div className="absolute left-0 top-7 z-30 w-52 bg-white border border-[#E5E7EB] rounded-lg shadow-lg p-2 space-y-2">
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
                                    placeholder="Ketik label baru..."
                                    className="flex-1 min-w-0 px-2 py-1 text-[11px] border border-[#E5E7EB] rounded focus:outline-none focus:border-blue-500"
                                  />
                                  <button
                                    type="submit"
                                    className="px-2 py-1 rounded bg-blue-600 text-white text-[11px] font-medium hover:bg-blue-700 cursor-pointer"
                                  >
                                    Add
                                  </button>
                                </form>

                                {suggestions.length > 0 && (
                                  <div className="border-t border-[#E5E7EB] pt-1.5">
                                    <p className="text-[10px] font-medium text-gray-400 mb-1">
                                      Pilih dari project:
                                    </p>
                                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                                      {suggestions.map((lbl) => (
                                        <button
                                          key={lbl}
                                          type="button"
                                          onClick={() => handleAddTag(finding, lbl)}
                                          className="px-1.5 py-0.5 rounded bg-gray-50 hover:bg-blue-50 text-[11px] text-gray-700 hover:text-blue-700 border border-gray-200 cursor-pointer"
                                        >
                                          + {lbl}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Empathy Map Quadrant Dropdown */}
                          <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={finding.quadrant || ''}
                              onChange={(e) =>
                                onUpdateFinding(finding.id, {
                                  quadrant: (e.target.value || undefined) as
                                    | EmpathyQuadrant
                                    | undefined,
                                })
                              }
                              className={`w-full text-[11px] font-medium rounded-md border px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors ${
                                finding.quadrant
                                  ? getQuadrantBadgeClass(finding.quadrant)
                                  : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <option value="">— Kuadran —</option>
                              {QUADRANTS.map((q) => (
                                <option key={q} value={q}>
                                  {q}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Quick Status Triage Segmented Control (Toggleable to Raw) */}
                          <div
                            className="flex items-center justify-end pt-0.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="inline-flex items-center gap-0.5 rounded-md bg-gray-100/80 p-0.5 border border-gray-200/70">
                              <button
                                onClick={() =>
                                  onUpdateFinding(finding.id, {
                                    status:
                                      finding.status === 'Pain Point'
                                        ? 'Raw / Perlu Triage'
                                        : 'Pain Point',
                                  })
                                }
                                title={
                                  finding.status === 'Pain Point'
                                    ? 'Klik lagi untuk kembalikan ke Raw / Perlu Triage'
                                    : 'Tandai sebagai Pain Point'
                                }
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer border ${
                                  finding.status === 'Pain Point'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
                                    : 'border-transparent text-gray-500 hover:text-gray-800'
                                }`}
                              >
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                <span>Pain</span>
                              </button>

                              <button
                                onClick={() =>
                                  onUpdateFinding(finding.id, {
                                    status:
                                      finding.status === 'Workaround'
                                        ? 'Raw / Perlu Triage'
                                        : 'Workaround',
                                  })
                                }
                                title={
                                  finding.status === 'Workaround'
                                    ? 'Klik lagi untuk kembalikan ke Raw / Perlu Triage'
                                    : 'Tandai sebagai Workaround'
                                }
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer border ${
                                  finding.status === 'Workaround'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-2xs'
                                    : 'border-transparent text-gray-500 hover:text-gray-800'
                                }`}
                              >
                                <Wrench className="w-3 h-3 shrink-0" />
                                <span>Workaround</span>
                              </button>

                              <button
                                onClick={() =>
                                  onUpdateFinding(finding.id, {
                                    status:
                                      finding.status === 'Noise / Archived'
                                        ? 'Raw / Perlu Triage'
                                        : 'Noise / Archived',
                                  })
                                }
                                title={
                                  finding.status === 'Noise / Archived'
                                    ? 'Klik lagi untuk kembalikan ke Raw / Perlu Triage'
                                    : 'Buang ke Noise / Archived'
                                }
                                className={`inline-flex items-center justify-center p-1 rounded text-[11px] font-medium transition-colors cursor-pointer border ${
                                  finding.status === 'Noise / Archived'
                                    ? 'bg-gray-200 text-gray-800 border-gray-300 shadow-2xs'
                                    : 'border-transparent text-gray-400 hover:text-gray-700'
                                }`}
                              >
                                <Archive className="w-3 h-3" />
                              </button>
                            </div>
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
    </div>
  );
}
