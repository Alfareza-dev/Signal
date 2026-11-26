'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Folder,
  Layers,
  Loader2,
  X,
} from 'lucide-react';
import { Finding, SourcePlatform, WorkspaceSettings } from '@/types/problemhub';
import { generateMockIntakeFindings } from '@/data/mockData';
import { SourceIcon } from './SourceBadge';

interface IntakeModalProps {
  isOpen: boolean;
  projectName: string;
  existingFolders: string[];
  nextCodeStart: number;
  enabledSources: WorkspaceSettings['enabledSources'];
  onClose: () => void;
  onAddFindings: (newFindings: Finding[]) => void;
}

type IntakeSourceTab = 'all' | 'social' | 'openalex' | 'csv';

const ALL_SCRAPE_SOURCES: SourcePlatform[] = [
  'X / Twitter',
  'Instagram',
  'Play Store',
  'Jurnal (OpenAlex)',
];

export function IntakeModal({
  isOpen,
  projectName,
  existingFolders,
  nextCodeStart,
  enabledSources,
  onClose,
  onAddFindings,
}: IntakeModalProps) {
  const [sourceTab, setSourceTab] = useState<IntakeSourceTab>('all');
  const [keyword, setKeyword] = useState('');
  const [folderName, setFolderName] = useState('Inbox / Riset Baru');
  const [rawCsvText, setRawCsvText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  const activeScrapeSources = ALL_SCRAPE_SOURCES.filter((src) => {
    if (src === 'X / Twitter') return enabledSources.twitter;
    if (src === 'Instagram') return enabledSources.instagram;
    if (src === 'Play Store') return enabledSources.playStore;
    if (src === 'Jurnal (OpenAlex)') return enabledSources.openAlex;
    return false;
  });

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setProgressStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceTab === 'all' && activeScrapeSources.length === 0) return;
    if (sourceTab !== 'csv' && !keyword.trim()) return;
    if (sourceTab === 'csv' && !rawCsvText.trim() && !keyword.trim()) return;

    setIsLoading(true);
    setProgressStep(1);

    if (sourceTab === 'all') {
      const t1 = setTimeout(() => setProgressStep(2), 350);
      const t2 = setTimeout(() => setProgressStep(3), 750);
      const t3 = setTimeout(() => setProgressStep(4), 1100);
      const t4 = setTimeout(() => {
        const generated = generateMockIntakeFindings(
          'all',
          keyword,
          folderName,
          rawCsvText,
          nextCodeStart,
          enabledSources
        );
        onAddFindings(generated);
        setIsLoading(false);
        setProgressStep(0);
        setKeyword('');
        setRawCsvText('');
        onClose();
      }, 1500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }

    setTimeout(() => {
      const generated = generateMockIntakeFindings(
        sourceTab,
        keyword,
        folderName,
        rawCsvText,
        nextCodeStart
      );
      onAddFindings(generated);
      setIsLoading(false);
      setProgressStep(0);
      setKeyword('');
      setRawCsvText('');
      onClose();
    }, 1000);
  };

  return (
    <div
      onClick={() => !isLoading && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[1px] p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white rounded-xl border border-[#E5E7EB] shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Ambil Data Baru (Problem Farming)
            </h2>
            <p className="text-[11px] text-gray-500">
              Target Project:{' '}
              <span className="font-medium text-gray-700">{projectName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source Tabs */}
        <div className="px-5 pt-3 border-b border-[#E5E7EB] flex gap-1 overflow-x-auto bg-[#FAFAFA]">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setSourceTab('all')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              sourceTab === 'all'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-md'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Semua Sumber (All)</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => setSourceTab('social')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              sourceTab === 'social'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-md'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <SourceIcon source="X / Twitter" className="w-3.5 h-3.5" />
            <span>Media Sosial</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => setSourceTab('openalex')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              sourceTab === 'openalex'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-md'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <SourceIcon source="Jurnal (OpenAlex)" className="w-3.5 h-3.5" />
            <span>Jurnal OpenAlex</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => setSourceTab('csv')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              sourceTab === 'csv'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-md'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <SourceIcon source="CSV / Manual" className="w-3.5 h-3.5" />
            <span>Import CSV / Paste</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {sourceTab === 'all' && !isLoading && (
            activeScrapeSources.length === 0 ? (
              <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800">
                Semua sumber scraping dinonaktifkan di Settings. Aktifkan minimal
                1 sumber untuk menarik data.
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-blue-50/60 border border-blue-200/70">
                <span className="text-[11px] font-medium text-blue-800">
                  1-Klik Scraping Sumber Aktif ({activeScrapeSources.length}):
                </span>
                <div className="flex items-center gap-2.5">
                  {activeScrapeSources.map((src) => (
                    <span
                      key={src}
                      title={src}
                      className="inline-flex items-center gap-1 text-[11px] text-gray-700"
                    >
                      <SourceIcon source={src} className="w-3.5 h-3.5" />
                    </span>
                  ))}
                </div>
              </div>
            )
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              {sourceTab === 'csv'
                ? 'Topik / Catatan Singkat'
                : 'Keyword Riset'}
            </label>
            <input
              type="text"
              value={keyword}
              disabled={isLoading}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={
                sourceTab === 'all'
                  ? 'misal: biaya admin, gagal login, ongkir mahal'
                  : sourceTab === 'social'
                  ? 'misal: biaya admin transfer, gagal OTP, QRIS error'
                  : sourceTab === 'openalex'
                  ? 'misal: e-wallet adoption Gen-Z, checkout abandonment'
                  : 'misal: Transkrip Interview / Keluhan CS'
              }
              required={sourceTab !== 'csv'}
              className="w-full bg-white border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
            />
          </div>

          {/* Target Folder Input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Folder Tujuan
            </label>
            <div className="relative">
              <Folder className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={folderName}
                disabled={isLoading}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="misal: Pembayaran & QRIS"
                className="w-full bg-white border border-[#E5E7EB] rounded-md pl-8.5 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              />
            </div>
            {existingFolders.length > 0 && !isLoading && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {existingFolders.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFolderName(f)}
                    className={`px-2 py-0.5 rounded text-[11px] border transition-colors cursor-pointer ${
                      folderName === f
                        ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {sourceTab === 'csv' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Tempel Baris Kutipan / CSV (1 baris = 1 temuan)
              </label>
              <textarea
                rows={4}
                value={rawCsvText}
                disabled={isLoading}
                onChange={(e) => setRawCsvText(e.target.value)}
                placeholder={
                  'Top up saldo lewat minimarket sering antri lama.\nNotifikasi transfer masuk suka telat 5 menit.'
                }
                className="w-full bg-white border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              />
            </div>
          )}

          {/* Animated Scraping Progress for All Sources */}
          {isLoading && sourceTab === 'all' ? (
            <div className="p-3.5 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] space-y-2">
              <p className="text-xs font-medium text-gray-700">
                Menarik data mentah untuk keyword{' '}
                <span className="font-semibold text-blue-600">“{keyword}”</span>...
              </p>
              <div className="grid grid-cols-2 gap-2">
                {activeScrapeSources.map((src, idx) => {
                  const done = progressStep > idx + 1;
                  const active = progressStep === idx + 1;
                  return (
                    <div
                      key={src}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded bg-white border border-[#E5E7EB] text-[11px]"
                    >
                      <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                        <SourceIcon source={src} className="w-3.5 h-3.5" />
                        <span>{src}</span>
                      </span>
                      {done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : active ? (
                        <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-200" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-md bg-[#F8F9FA] border border-[#E5E7EB] text-[11px] text-gray-500">
              Hasil scraping masuk ke grup{' '}
              <span className="font-semibold text-gray-700">
                Raw / Perlu Triage
              </span>{' '}
              dalam keadaan mentah (label & kuadran kosong, 0% AI).
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-md border border-[#E5E7EB] text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={
                isLoading ||
                (sourceTab === 'all' && activeScrapeSources.length === 0)
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menarik Data...</span>
                </>
              ) : sourceTab === 'all' ? (
                <span>Scrape Semua (Medsos + Jurnal)</span>
              ) : (
                <span>Tarik Data ke Project Ini</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
