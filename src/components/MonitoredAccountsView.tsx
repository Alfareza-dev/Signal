'use client';

import React, { useState } from 'react';
import { Plus, Radio, Trash2 } from 'lucide-react';
import { MonitoredAccount, SourcePlatform } from '@/types/problemhub';
import { SourceBadge } from './SourceBadge';

interface MonitoredAccountsViewProps {
  accounts: MonitoredAccount[];
  onUpdateAccounts: (accounts: MonitoredAccount[]) => void;
}

const PLATFORMS: SourcePlatform[] = [
  'X / Twitter',
  'Instagram',
  'Play Store',
  'Jurnal (OpenAlex)',
];

export function MonitoredAccountsView({
  accounts,
  onUpdateAccounts,
}: MonitoredAccountsViewProps) {
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState<SourcePlatform>('X / Twitter');
  const [category, setCategory] = useState('Mention & Keluhan');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;
    const newAcc: MonitoredAccount = {
      id: `acc-${Date.now()}`,
      handle: handle.trim(),
      platform,
      category: category.trim() || 'Umum',
      active: true,
      lastChecked: 'Baru saja',
    };
    onUpdateAccounts([newAcc, ...accounts]);
    setHandle('');
  };

  return (
    <div className="h-full overflow-y-auto bg-[#FFF7F5] p-6 space-y-5 animate-fade-slide">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFF0EA] border border-[#F2E4E0] text-[#FF7B7B] text-[11px] font-semibold mb-1.5">
          <Radio className="w-3 h-3" />
          <span>Konfigurasi</span>
        </div>
        <h1 className="text-lg font-bold text-[#2D213A]">
          Akun & Kanal Pantauan
        </h1>
        <p className="text-xs text-[#7A6B84] mt-0.5">
          Kelola akun resmi, ID aplikasi, dan topik jurnal yang dipantau oleh
          pipeline Signal.
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="p-5 rounded-2xl bg-white border border-[#F2E4E0] shadow-[0_4px_20px_rgba(255,123,123,0.05)] flex flex-wrap items-end gap-3"
      >
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-[#2D213A] mb-1.5">
            Handle Akun / ID Aplikasi / Topik
          </label>
          <input
            type="text"
            required
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="misal: @brand_support atau com.app.id"
            className="w-full bg-[#FFF7F5] border border-[#F2E4E0] rounded-xl px-3 py-2 text-xs text-[#2D213A] focus:outline-none focus:border-[#E9B949] focus:ring-2 focus:ring-[#E9B949]/20"
          />
        </div>

        <div className="w-44">
          <label className="block text-xs font-semibold text-[#2D213A] mb-1.5">
            Platform
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as SourcePlatform)}
            className="w-full bg-[#FFF7F5] border border-[#F2E4E0] rounded-xl px-3 py-2 text-xs text-[#2D213A] focus:outline-none focus:border-[#E9B949]"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="w-48">
          <label className="block text-xs font-semibold text-[#2D213A] mb-1.5">
            Kategori Pantauan
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#FFF7F5] border border-[#F2E4E0] rounded-xl px-3 py-2 text-xs text-[#2D213A] focus:outline-none focus:border-[#E9B949]"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF7B7B] hover:bg-[#F26666] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Pantauan</span>
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="p-4 rounded-2xl bg-white border border-[#F2E4E0] flex items-center justify-between gap-3 shadow-[0_4px_20px_rgba(255,123,123,0.04)]"
          >
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-[#2D213A] truncate">
                  {acc.handle}
                </span>
                <SourceBadge source={acc.platform} />
              </div>
              <p className="text-xs text-[#7A6B84]">
                {acc.category} · Dicek {acc.lastChecked}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  onUpdateAccounts(
                    accounts.map((a) =>
                      a.id === acc.id ? { ...a, active: !a.active } : a
                    )
                  )
                }
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                  acc.active
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-stone-100 text-[#7A6B84] border-stone-200'
                }`}
              >
                {acc.active ? 'Aktif' : 'Dijeda'}
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateAccounts(accounts.filter((a) => a.id !== acc.id))
                }
                title="Hapus akun pantauan"
                className="p-1.5 rounded-lg text-[#7A6B84] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

