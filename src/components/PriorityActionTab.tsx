'use client';

import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ListChecks,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  ActionComment,
  ActionRecommendation,
  MoscowCategory,
  MoscowItem,
  ResearchVersion,
  WorkspaceSettings,
} from '@/types/problemhub';
import {
  getEffectiveActionItems,
  getEffectiveMoscowItems,
} from '@/data/mockData';
import { SiggyMascot } from './SiggyMascot';

interface PriorityActionTabProps {
  projectName: string;
  version: ResearchVersion;
  settings: WorkspaceSettings;
  onUpdateMoscowItems: (items: MoscowItem[]) => void;
  onUpdateActionItems: (items: ActionRecommendation[]) => void;
  onOpenSettings: () => void;
}

const MOSCOW_COLUMNS: {
  category: MoscowCategory;
  title: string;
  subtitle: string;
  bgClass: string;
  badgeClass: string;
}[] = [
  {
    category: 'Must-Have',
    title: 'Must-Have',
    subtitle: 'Wajib rilis sprint ini',
    bgClass: 'bg-rose-50/70 border-rose-200',
    badgeClass: 'bg-[#FF7B7B] text-white',
  },
  {
    category: 'Should-Have',
    title: 'Should-Have',
    subtitle: 'Prioritas tinggi berikutnya',
    bgClass: 'bg-amber-50/70 border-amber-200',
    badgeClass: 'bg-[#E9B949] text-white',
  },
  {
    category: 'Could-Have',
    title: 'Could-Have (Nice-to-Have)',
    subtitle: 'Nilai tambah jika ada kapasitas',
    bgClass: 'bg-emerald-50/70 border-emerald-200',
    badgeClass: 'bg-emerald-500 text-white',
  },
  {
    category: "Won't-Have",
    title: "Won't-Have",
    subtitle: 'Ditunda di luar cakupan',
    bgClass: 'bg-[#F4F0FB]/70 border-[#DFD5F5]',
    badgeClass: 'bg-[#9B85D6] text-white',
  },
];

export function PriorityActionTab({
  projectName,
  version,
  settings,
  onUpdateMoscowItems,
  onUpdateActionItems,
  onOpenSettings,
}: PriorityActionTabProps) {
  const [newMoscowTitle, setNewMoscowTitle] = useState('');
  const [newMoscowCat, setNewMoscowCat] = useState<MoscowCategory>('Must-Have');

  const [newActionTitle, setNewActionTitle] = useState('');
  const [openThreadId, setOpenThreadId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const effectiveMoscow = useMemo<MoscowItem[]>(
    () => getEffectiveMoscowItems(version),
    [version]
  );

  const effectiveActions = useMemo<ActionRecommendation[]>(
    () => getEffectiveActionItems(version),
    [version]
  );

  const handleAddMoscow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMoscowTitle.trim()) return;
    const nextItem: MoscowItem = {
      id: `msc-${Date.now()}`,
      title: newMoscowTitle.trim(),
      sourceType: 'Manual',
      category: newMoscowCat,
    };
    onUpdateMoscowItems([nextItem, ...effectiveMoscow]);
    setNewMoscowTitle('');
  };

  const handleMoveMoscow = (id: string, category: MoscowCategory) => {
    onUpdateMoscowItems(
      effectiveMoscow.map((item) =>
        item.id === id ? { ...item, category } : item
      )
    );
  };

  const handleDeleteMoscow = (id: string) => {
    onUpdateMoscowItems(effectiveMoscow.filter((item) => item.id !== id));
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle.trim()) return;
    const nextAction: ActionRecommendation = {
      id: `act-${Date.now()}`,
      title: newActionTitle.trim(),
      impact: 'Tinggi',
      effort: 'Sedang',
      comments: [],
    };
    onUpdateActionItems([nextAction, ...effectiveActions]);
    setNewActionTitle('');
  };

  const handleSendActionComment = (actionId: string) => {
    if (settings.strictZeroAI) return;
    const text = (commentInputs[actionId] || '').trim();
    if (!text) return;

    const targetAction = effectiveActions.find((a) => a.id === actionId);
    if (!targetAction) return;

    const now = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userComment: ActionComment = {
      id: `cmt-u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: now,
    };

    const aiReply: ActionComment = {
      id: `cmt-ai-${Date.now() + 1}`,
      role: 'ai',
      text: `Siggy AI (${projectName} · ${version.label}): Untuk aksi "${targetAction.title.slice(0, 60)}...", pendekatan terbaik terkait "${text}" adalah memulai dari quick-win UI microcopy & validasi prototipe ke 5 pengguna sebelum full engineering sprint.`,
      timestamp: now,
      tokensUsed: 95,
    };

    onUpdateActionItems(
      effectiveActions.map((act) =>
        act.id === actionId
          ? { ...act, comments: [...act.comments, userComment, aiReply] }
          : act
      )
    );
    setCommentInputs((prev) => ({ ...prev, [actionId]: '' }));
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 bg-[#FFF7F5]/50">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#2D213A] flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-[#FF7B7B]" />
            <span>Prioritas & Aksi Produk ({version.label})</span>
          </h2>
          <p className="text-xs text-[#7A6B84]">
            Kelompokkan masalah dengan framework MoSCoW manual dan diskusikan tiap rekomendasi aksi bersama Siggy AI.
          </p>
        </div>
      </div>

      {/* Section 1: Papan MoSCoW Manual */}
      <section className="rounded-3xl border border-[#F2E4E0] bg-white p-5 space-y-4 shadow-[0_4px_20px_rgba(255,123,123,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#2D213A]">
              Papan Prioritas MoSCoW Manual
            </h3>
            <p className="text-xs text-[#7A6B84]">
              Pindahkan item antar kategori menggunakan dropdown di setiap kartu.
            </p>
          </div>

          <form onSubmit={handleAddMoscow} className="flex flex-wrap gap-2">
            <input
              type="text"
              value={newMoscowTitle}
              onChange={(e) => setNewMoscowTitle(e.target.value)}
              placeholder="Tambah item prioritas baru..."
              className="px-3 py-1.5 rounded-xl border border-[#EEDCD7] bg-[#FFFDFC] text-xs text-[#2D213A] focus:outline-none focus:border-[#E9B949] w-56"
            />
            <select
              value={newMoscowCat}
              onChange={(e) =>
                setNewMoscowCat(e.target.value as MoscowCategory)
              }
              className="px-2.5 py-1.5 rounded-xl border border-[#EEDCD7] bg-white text-xs font-semibold text-[#2D213A]"
            >
              {MOSCOW_COLUMNS.map((col) => (
                <option key={col.category} value={col.category}>
                  {col.category}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FF7B7B] hover:bg-[#F26666] text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {MOSCOW_COLUMNS.map((col) => {
            const colItems = effectiveMoscow.filter(
              (item) => item.category === col.category
            );
            return (
              <div
                key={col.category}
                className={`rounded-2xl border p-3.5 space-y-3 ${col.bgClass}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${col.badgeClass}`}
                    >
                      {col.title}
                    </span>
                    <p className="text-[10.5px] text-[#7A6B84] mt-1">
                      {col.subtitle}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-[#2D213A] tabular-nums">
                    {colItems.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {colItems.length === 0 ? (
                    <p className="text-[11px] text-[#9A8CA4] italic py-4 text-center">
                      Belum ada item di kolom ini
                    </p>
                  ) : (
                    colItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-white border border-[#F2E4E0] shadow-2xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-[#2D213A] leading-snug">
                            {item.title}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleDeleteMoscow(item.id)}
                            className="text-[#9A8CA4] hover:text-rose-600 cursor-pointer shrink-0"
                            title="Hapus item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.notes && (
                          <p className="text-[10.5px] text-[#7A6B84]">
                            {item.notes}
                          </p>
                        )}
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#F6ECE9]">
                          <span className="text-[10px] font-bold text-[#7A6B84]">
                            {item.sourceType}
                          </span>
                          <select
                            value={item.category}
                            onChange={(e) =>
                              handleMoveMoscow(
                                item.id,
                                e.target.value as MoscowCategory
                              )
                            }
                            className="px-2 py-0.5 rounded-2xl border border-[#EEDCD7] bg-[#FFF7F5] text-[10.5px] font-semibold text-[#2D213A] cursor-pointer"
                          >
                            {MOSCOW_COLUMNS.map((c) => (
                              <option key={c.category} value={c.category}>
                                → {c.category}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Rekomendasi Aksi Produk + Diskusi AI Inline */}
      <section className="rounded-3xl border border-[#F2E4E0] bg-white p-5 space-y-4 shadow-[0_4px_20px_rgba(255,123,123,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#2D213A] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9B85D6]" />
              Rekomendasi Aksi Produk & Diskusi AI Inline
            </h3>
            <p className="text-xs text-[#7A6B84]">
              Klik “Diskusi / Komentar dengan AI” pada kartu untuk menanyakan detail implementasi.
            </p>
          </div>

          <form onSubmit={handleAddAction} className="flex gap-2">
            <input
              type="text"
              value={newActionTitle}
              onChange={(e) => setNewActionTitle(e.target.value)}
              placeholder="Tambah rekomendasi aksi produk..."
              className="px-3 py-1.5 rounded-xl border border-[#EEDCD7] bg-[#FFFDFC] text-xs text-[#2D213A] focus:outline-none focus:border-[#E9B949] w-64"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#9B85D6] hover:bg-[#866EC8] text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Aksi
            </button>
          </form>
        </div>

        <div className="space-y-3">
          {effectiveActions.map((act, index) => {
            const isOpen = openThreadId === act.id;
            return (
              <div
                key={act.id}
                className="rounded-2xl border border-[#F2E4E0] bg-[#FFFDFC] p-4 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 flex-1 min-w-[240px]">
                    <span className="w-6 h-6 rounded-xl bg-[#FFF0EA] text-[#FF7B7B] text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-[#2D213A] leading-relaxed">
                        {act.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Impact: {act.impact}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Effort: {act.effort}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setOpenThreadId(isOpen ? null : act.id)
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                      isOpen
                        ? 'bg-[#9B85D6] text-white border-[#7D66BD]'
                        : 'bg-[#F4F0FB] hover:bg-[#EAE2F8] text-[#6953A8] border-[#DFD5F5]'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>
                      Diskusi / Komentar dengan AI ({act.comments.length})
                    </span>
                  </button>
                </div>

                {isOpen && (
                  <div className="pt-3 border-t border-[#F2E4E0] space-y-2.5">
                    {act.comments.length > 0 && (
                      <div className="space-y-2">
                        {act.comments.map((cmt) => (
                          <div
                            key={cmt.id}
                            className={`flex gap-2 ${
                              cmt.role === 'user'
                                ? 'justify-end'
                                : 'justify-start'
                            }`}
                          >
                            {cmt.role === 'ai' && (
                              <SiggyMascot
                                variant="avatar"
                                size={24}
                                className="shrink-0 mt-0.5"
                              />
                            )}
                            <div
                              className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${
                                cmt.role === 'user'
                                  ? 'bg-[#FF7B7B] text-white'
                                  : 'bg-[#F4F0FB] text-[#2D213A] border border-[#DFD5F5]'
                              }`}
                            >
                              <p>{cmt.text}</p>
                              <span
                                className={`block text-[10px] mt-0.5 ${
                                  cmt.role === 'user'
                                    ? 'text-white/80'
                                    : 'text-[#7A6B84]'
                                }`}
                              >
                                {cmt.timestamp}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {settings.strictZeroAI ? (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11.5px] text-amber-800 flex items-center justify-between gap-2">
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
                          handleSendActionComment(act.id);
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={commentInputs[act.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [act.id]: e.target.value,
                            }))
                          }
                          placeholder="Ketik catatan atau tanya AI soal aksi ini..."
                          className="flex-1 px-3 py-1.5 rounded-xl border border-[#EEDCD7] bg-white text-xs text-[#2D213A] focus:outline-none focus:border-[#E9B949]"
                        />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#9B85D6] hover:bg-[#866EC8] text-white text-xs font-bold cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          Tanya AI
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
