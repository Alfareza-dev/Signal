'use client';

import React from 'react';
import {
  CalendarClock,
  CheckCircle2,
  FileText,
  GitBranch,
  History,
  Layers,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { ResearchVersion } from '@/types/problemhub';

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  versions: ResearchVersion[];
  activeVersionId: string;
  onSelectVersion: (versionId: string) => void;
  onOpenNewVersionModal: () => void;
}

export function VersionHistoryDrawer({
  isOpen,
  onClose,
  projectName,
  versions,
  activeVersionId,
  onSelectVersion,
  onOpenNewVersionModal,
}: VersionHistoryDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#2D213A]/30 backdrop-blur-[2px]">
      <div className="w-full max-w-lg bg-[#FFFDFC] h-full shadow-2xl border-l border-[#F2E4E0] flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F2E4E0] bg-[#FFF7F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#9B85D6]/15 border border-[#9B85D6]/30 flex items-center justify-center">
              <History className="w-5 h-5 text-[#7D66BD]" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#2D213A]">
                Riwayat Versi Riset
              </h2>
              <p className="text-[12px] text-[#7A6B84] truncate max-w-[300px]">
                {projectName} · {versions.length} versi tersimpan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A6B84] hover:text-[#2D213A] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Version List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {versions
            .slice()
            .reverse()
            .map((version) => {
              const isActive = version.id === activeVersionId;
              const totalFindings = version.findings.length;
              const painCount = version.findings.filter(
                (f) => f.status === 'Pain Point'
              ).length;
              const workaroundCount = version.findings.filter(
                (f) => f.status === 'Workaround'
              ).length;
              const positiveCount = version.findings.filter(
                (f) => f.status === 'Positif / Delighter'
              ).length;
              const empathyCount = version.findings.filter(
                (f) => Boolean(f.quadrant) && f.status !== 'Noise / Archived'
              ).length;

              return (
                <div
                  key={version.id}
                  className={`rounded-3xl border p-4 transition-all ${
                    isActive
                      ? 'bg-white border-[#FF7B7B] shadow-md ring-2 ring-[#FF7B7B]/15'
                      : 'bg-white border-[#F2E4E0] hover:border-[#E5CFC9]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[12px] font-bold ${
                          isActive
                            ? 'bg-[#FF7B7B] text-white'
                            : 'bg-[#FFF0EA] text-[#2D213A]'
                        }`}
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        {version.label}
                      </span>
                      <span className="text-[12px] text-[#7A6B84] font-medium">
                        {version.createdAt}
                      </span>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Aktif
                        </span>
                      )}
                    </div>

                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectVersion(version.id);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl text-[12px] font-bold text-[#2D213A] bg-[#FFF7F5] hover:bg-[#FFEAE3] border border-[#F2E4E0] transition-colors cursor-pointer shrink-0"
                      >
                        Buka Versi
                      </button>
                    )}
                  </div>

                  {/* Keyword Query */}
                  <div className="mb-2.5 p-2.5 rounded-2xl bg-[#FFF7F5] border border-[#F2E4E0]">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7A6B84] mb-1">
                      <Search className="w-3 h-3 text-[#FF7B7B]" />
                      Keyword Query
                    </div>
                    <p className="text-[12.5px] font-mono text-[#2D213A] break-words">
                      {version.keywordQuery}
                    </p>
                  </div>

                  {version.notes && (
                    <p className="text-[12.5px] text-[#5F506B] mb-3 leading-relaxed">
                      {version.notes}
                    </p>
                  )}

                  {/* Summary of what was created */}
                  <div className="border-t border-[#F6ECE9] pt-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A6B84] mb-2">
                      Ringkasan Yang Dibuat di {version.label}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11.5px]">
                      <div className="px-2.5 py-1.5 rounded-xl bg-[#FFFDFC] border border-[#F2E4E0] flex items-center justify-between">
                        <span className="text-[#7A6B84]">Total Temuan</span>
                        <span className="font-bold text-[#2D213A] tabular-nums">
                          {totalFindings}
                        </span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-xl bg-rose-50/70 border border-rose-200/70 flex items-center justify-between">
                        <span className="text-rose-700">Pain Point</span>
                        <span className="font-bold text-rose-800 tabular-nums">
                          {painCount}
                        </span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between">
                        <span className="text-amber-800">Workaround</span>
                        <span className="font-bold text-amber-900 tabular-nums">
                          {workaroundCount}
                        </span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 flex items-center justify-between">
                        <span className="text-emerald-700">Positif</span>
                        <span className="font-bold text-emerald-800 tabular-nums">
                          {positiveCount}
                        </span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-xl bg-[#F4F0FB] border border-[#DFD5F5] flex items-center justify-between">
                        <span className="text-[#6953A8]">Empathy Map</span>
                        <span className="font-bold text-[#2D213A] tabular-nums">
                          {empathyCount}
                        </span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-xl bg-[#FFFDFC] border border-[#F2E4E0] flex items-center justify-between">
                        <span className="text-[#7A6B84] flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          Cluster
                        </span>
                        <span className="font-bold text-[#2D213A] tabular-nums">
                          {version.clusters.length}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${
                          version.brief
                            ? 'bg-violet-50 text-violet-700 border border-violet-200'
                            : 'bg-slate-50 text-[#7A6B84] border border-[#EEDCD7]'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        {version.brief ? 'AI Brief Tersedia' : 'Belum Ada Brief'}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${
                          version.finalReport
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-50 text-[#7A6B84] border border-[#EEDCD7]'
                        }`}
                      >
                        <FileText className="w-3 h-3" />
                        {version.finalReport
                          ? 'Final Result Selesai'
                          : 'Belum Ada Final Result'}
                      </span>
                      {version.schedule?.enabled && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <CalendarClock className="w-3 h-3" />
                          Jadwal: {version.schedule.frequency} ({version.schedule.time})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F2E4E0] bg-[#FFF7F5] flex items-center justify-between">
          <span className="text-[12px] text-[#7A6B84]">
            Simpan iterasi untuk melacak dampak perbaikan produk.
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenNewVersionModal();
            }}
            className="px-4 py-2 rounded-2xl text-[12.5px] font-bold text-white bg-[#FF7B7B] hover:bg-[#F26666] border-b-4 border-[#DC5353] active:border-b-0 active:translate-y-[2px] transition-all cursor-pointer"
          >
            + Simpan Versi Baru
          </button>
        </div>
      </div>
    </div>
  );
}
