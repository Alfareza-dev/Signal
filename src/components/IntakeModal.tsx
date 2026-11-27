'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  BookmarkPlus,
  CalendarClock,
  CheckCircle2,
  Folder,
  Layers,
  Loader2,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import {
  FarmingPreset,
  FarmingSchedule,
  Finding,
  SourcePlatform,
  WorkspaceSettings,
} from '@/types/problemhub';
import { generateMockIntakeFindings } from '@/data/mockData';
import { SourceIcon } from './SourceBadge';

interface IntakeModalProps {
  isOpen: boolean;
  projectName: string;
  existingFolders: string[];
  nextCodeStart: number;
  enabledSources: WorkspaceSettings['enabledSources'];
  farmingPresets: FarmingPreset[];
  defaultSchedule?: FarmingSchedule;
  onClose: () => void;
  onAddFindings: (
    newFindings: Finding[],
    meta?: { keywordQuery: string; schedule?: FarmingSchedule }
  ) => void;
  onSavePreset: (preset: FarmingPreset) => void;
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
  farmingPresets,
  defaultSchedule,
  onClose,
  onAddFindings,
  onSavePreset,
}: IntakeModalProps) {
  const [sourceTab, setSourceTab] = useState<IntakeSourceTab>('all');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywordTerms, setKeywordTerms] = useState<string[]>([]);
  const [operator, setOperator] = useState<'AND' | 'OR'>('OR');
  const [secondaryTerms, setSecondaryTerms] = useState<string[]>([]);
  const [secondaryInput, setSecondaryInput] = useState('');

  const [folderName, setFolderName] = useState('Inbox / Riset Baru');
  const [rawCsvText, setRawCsvText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  // Jadwal Otomatis state
  const [scheduleEnabled, setScheduleEnabled] = useState(
    defaultSchedule?.enabled ?? false
  );
  const [scheduleDate, setScheduleDate] = useState(
    defaultSchedule?.date ?? new Date().toISOString().slice(0, 10)
  );
  const [scheduleTime, setScheduleTime] = useState(
    defaultSchedule?.time ?? '09:00'
  );
  const [scheduleFreq, setScheduleFreq] = useState<
    'Sekali' | 'Harian' | 'Mingguan'
  >(defaultSchedule?.frequency ?? 'Harian');

  const [presetSavedToast, setPresetSavedToast] = useState(false);

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
      setPresetSavedToast(false);
    }
  }, [isOpen]);

  const builtQuery = useMemo(() => {
    const primaryList = [...keywordTerms];
    if (keywordInput.trim() && !primaryList.includes(keywordInput.trim())) {
      primaryList.push(keywordInput.trim());
    }
    const secList = [...secondaryTerms];
    if (secondaryInput.trim() && !secList.includes(secondaryInput.trim())) {
      secList.push(secondaryInput.trim());
    }

    if (primaryList.length === 0 && secList.length === 0) return '';

    const formatGroup = (items: string[], op: 'AND' | 'OR') => {
      if (items.length === 0) return '';
      if (items.length === 1) return `"${items[0]}"`;
      return `(${items.map((t) => `"${t}"`).join(` ${op} `)})`;
    };

    const g1 = formatGroup(primaryList, operator);
    const g2 = formatGroup(secList, 'OR');

    if (g1 && g2) return `${g1} AND ${g2}`;
    return g1 || g2;
  }, [keywordTerms, keywordInput, operator, secondaryTerms, secondaryInput]);

  const effectiveSingleKeyword = useMemo(() => {
    if (keywordTerms.length > 0) return keywordTerms[0];
    return keywordInput.trim();
  }, [keywordTerms, keywordInput]);

  if (!isOpen) return null;

  const addPrimaryTerm = () => {
    const clean = keywordInput.trim();
    if (!clean) return;
    if (!keywordTerms.includes(clean)) {
      setKeywordTerms((prev) => [...prev, clean]);
    }
    setKeywordInput('');
  };

  const addSecondaryTerm = () => {
    const clean = secondaryInput.trim();
    if (!clean) return;
    if (!secondaryTerms.includes(clean)) {
      setSecondaryTerms((prev) => [...prev, clean]);
    }
    setSecondaryInput('');
  };

  const handleLoadPreset = (preset: FarmingPreset) => {
    setKeywordTerms(preset.keywords);
    setKeywordInput('');
    setOperator(preset.operator);
    setFolderName(preset.folder);
    setScheduleEnabled(preset.schedule.enabled);
    setScheduleDate(preset.schedule.date);
    setScheduleTime(preset.schedule.time);
    setScheduleFreq(preset.schedule.frequency);
  };

  const handleSaveToPreset = () => {
    const allTerms = [
      ...keywordTerms,
      ...(keywordInput.trim() ? [keywordInput.trim()] : []),
    ];
    if (allTerms.length === 0) return;

    const newPreset: FarmingPreset = {
      id: `preset-${Date.now()}`,
      name: allTerms.slice(0, 2).join(` ${operator} `),
      keywords: allTerms,
      operator,
      queryPreview: builtQuery || allTerms.join(` ${operator} `),
      folder: folderName.trim() || 'Inbox / Riset Baru',
      savedAt: new Date().toISOString().slice(0, 10),
      schedule: {
        enabled: scheduleEnabled,
        date: scheduleDate,
        time: scheduleTime,
        frequency: scheduleFreq,
      },
    };
    onSavePreset(newPreset);
    setPresetSavedToast(true);
    setTimeout(() => setPresetSavedToast(false), 2200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceTab === 'all' && activeScrapeSources.length === 0) return;
    if (sourceTab !== 'csv' && !builtQuery && !effectiveSingleKeyword) return;
    if (sourceTab === 'csv' && !rawCsvText.trim() && !effectiveSingleKeyword) return;

    const kwForMock = effectiveSingleKeyword || builtQuery || 'aplikasi';
    const schedulePayload: FarmingSchedule | undefined = scheduleEnabled
      ? {
          enabled: true,
          date: scheduleDate,
          time: scheduleTime,
          frequency: scheduleFreq,
        }
      : undefined;

    setIsLoading(true);
    setProgressStep(1);

    if (sourceTab === 'all') {
      const t1 = setTimeout(() => setProgressStep(2), 350);
      const t2 = setTimeout(() => setProgressStep(3), 750);
      const t3 = setTimeout(() => setProgressStep(4), 1100);
      const t4 = setTimeout(() => {
        const generated = generateMockIntakeFindings(
          'all',
          kwForMock,
          folderName,
          rawCsvText,
          nextCodeStart,
          enabledSources
        );
        onAddFindings(generated, {
          keywordQuery: builtQuery || kwForMock,
          schedule: schedulePayload,
        });
        setIsLoading(false);
        setProgressStep(0);
        setKeywordInput('');
        setKeywordTerms([]);
        setSecondaryInput('');
        setSecondaryTerms([]);
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
        kwForMock,
        folderName,
        rawCsvText,
        nextCodeStart
      );
      onAddFindings(generated, {
        keywordQuery: builtQuery || kwForMock,
        schedule: schedulePayload,
      });
      setIsLoading(false);
      setProgressStep(0);
      setKeywordInput('');
      setKeywordTerms([]);
      setSecondaryInput('');
      setSecondaryTerms([]);
      setRawCsvText('');
      onClose();
    }, 1000);
  };

  return (
    <div
      onClick={() => !isLoading && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D213A]/35 backdrop-blur-[2px] p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl border border-[#F2E4E0] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F2E4E0] bg-[#FFF7F5] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-[15px] font-bold text-[#2D213A] flex items-center gap-2">
              <span>Smart Problem Farming</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0EA] text-[#FF7B7B] border border-[#FF7B7B]/30">
                AND / OR + Schedule
              </span>
            </h2>
            <p className="text-[12px] text-[#7A6B84]">
              Target Project:{' '}
              <span className="font-semibold text-[#2D213A]">{projectName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-xl text-[#7A6B84] hover:text-[#2D213A] hover:bg-white disabled:opacity-40 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source Tabs */}
        <div className="px-6 pt-3 border-b border-[#F2E4E0] flex gap-1.5 overflow-x-auto bg-[#FFFDFC] shrink-0">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setSourceTab('all')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              sourceTab === 'all'
                ? 'border-[#FF7B7B] text-[#FF7B7B] bg-[#FFF7F5] rounded-t-xl'
                : 'border-transparent text-[#7A6B84] hover:text-[#2D213A]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Semua Sumber (All)</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => setSourceTab('social')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              sourceTab === 'social'
                ? 'border-[#FF7B7B] text-[#FF7B7B] bg-[#FFF7F5] rounded-t-xl'
                : 'border-transparent text-[#7A6B84] hover:text-[#2D213A]'
            }`}
          >
            <SourceIcon source="X / Twitter" className="w-3.5 h-3.5" />
            <span>Media Sosial</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => setSourceTab('openalex')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              sourceTab === 'openalex'
                ? 'border-[#FF7B7B] text-[#FF7B7B] bg-[#FFF7F5] rounded-t-xl'
                : 'border-transparent text-[#7A6B84] hover:text-[#2D213A]'
            }`}
          >
            <SourceIcon source="Jurnal (OpenAlex)" className="w-3.5 h-3.5" />
            <span>Jurnal OpenAlex</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => setSourceTab('csv')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              sourceTab === 'csv'
                ? 'border-[#FF7B7B] text-[#FF7B7B] bg-[#FFF7F5] rounded-t-xl'
                : 'border-transparent text-[#7A6B84] hover:text-[#2D213A]'
            }`}
          >
            <SourceIcon source="CSV / Manual" className="w-3.5 h-3.5" />
            <span>Import CSV / Paste</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Koleksi Farming Presets */}
          {farmingPresets.length > 0 && !isLoading && (
            <div className="p-3 rounded-2xl bg-[#F8F5FF] border border-[#E5DCFA]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6953A8] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Koleksi Farming Tersimpan ({farmingPresets.length})
                </span>
                <span className="text-[11px] text-[#7A6B84]">
                  Klik untuk muat query & jadwal
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {farmingPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleLoadPreset(preset)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white hover:bg-[#EFE9FD] border border-[#DFD5F5] text-[11.5px] font-semibold text-[#2D213A] transition-colors cursor-pointer"
                  >
                    <span>{preset.name}</span>
                    {preset.schedule.enabled && (
                      <CalendarClock className="w-3 h-3 text-[#7D66BD]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sourceTab === 'all' && !isLoading && (
            activeScrapeSources.length === 0 ? (
              <div className="px-3.5 py-2.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-[11.5px] text-amber-800">
                Semua sumber scraping dinonaktifkan di Settings. Aktifkan minimal
                1 sumber untuk menarik data.
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-2xl bg-[#FFF0EA]/70 border border-[#FF7B7B]/30">
                <span className="text-[11.5px] font-semibold text-[#9E3B3B]">
                  1-Klik Scraping Sumber Aktif ({activeScrapeSources.length}):
                </span>
                <div className="flex items-center gap-2.5">
                  {activeScrapeSources.map((src) => (
                    <span
                      key={src}
                      title={src}
                      className="inline-flex items-center gap-1 text-[11px] text-[#2D213A]"
                    >
                      <SourceIcon source={src} className="w-3.5 h-3.5" />
                    </span>
                  ))}
                </div>
              </div>
            )
          )}

          {/* AND / OR Keyword Builder */}
          {sourceTab !== 'csv' ? (
            <div className="p-4 rounded-2xl bg-[#FFF7F5] border border-[#F2E4E0] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold text-[#2D213A]">
                  Kombinasi Keyword (AND / OR Builder)
                </label>
                <div className="inline-flex rounded-xl bg-white border border-[#EEDCD7] p-0.5">
                  <button
                    type="button"
                    onClick={() => setOperator('OR')}
                    className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                      operator === 'OR'
                        ? 'bg-[#FF7B7B] text-white'
                        : 'text-[#7A6B84] hover:text-[#2D213A]'
                    }`}
                  >
                    OR
                  </button>
                  <button
                    type="button"
                    onClick={() => setOperator('AND')}
                    className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                      operator === 'AND'
                        ? 'bg-[#9B85D6] text-white'
                        : 'text-[#7A6B84] hover:text-[#2D213A]'
                    }`}
                  >
                    AND
                  </button>
                </div>
              </div>

              {/* Group 1 */}
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keywordInput}
                    disabled={isLoading}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && keywordInput.trim()) {
                        e.preventDefault();
                        addPrimaryTerm();
                      }
                    }}
                    placeholder="Ketik kata kunci (misal: biaya admin) lalu tekan + atau Enter"
                    className="flex-1 bg-white border border-[#EEDCD7] rounded-xl px-3 py-2 text-xs text-[#2D213A] placeholder:text-[#9A8CA4] focus:outline-none focus:border-[#E9B949] focus:ring-2 focus:ring-[#E9B949]/30"
                  />
                  <button
                    type="button"
                    onClick={addPrimaryTerm}
                    disabled={!keywordInput.trim() || isLoading}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-[#FFF0EA] border border-[#EEDCD7] text-xs font-bold text-[#2D213A] disabled:opacity-40 cursor-pointer inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah
                  </button>
                </div>

                {keywordTerms.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {keywordTerms.map((term, idx) => (
                      <React.Fragment key={term}>
                        {idx > 0 && (
                          <span className="text-[10px] font-extrabold text-[#9B85D6] px-1">
                            {operator}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-[#EEDCD7] text-[11.5px] font-semibold text-[#2D213A]">
                          {term}
                          <button
                            type="button"
                            onClick={() =>
                              setKeywordTerms((prev) =>
                                prev.filter((t) => t !== term)
                              )
                            }
                            className="text-[#9A8CA4] hover:text-rose-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>

              {/* Group 2 (AND filter context) */}
              <div className="pt-2 border-t border-[#F2E4E0]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-[#9B85D6]/15 text-[#7D66BD] text-[10px] font-extrabold">
                    AND
                  </span>
                  <span className="text-[11px] font-semibold text-[#5F506B]">
                    Kombinasi Konteks Fitur / Topik (Opsional)
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={secondaryInput}
                    disabled={isLoading}
                    onChange={(e) => setSecondaryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && secondaryInput.trim()) {
                        e.preventDefault();
                        addSecondaryTerm();
                      }
                    }}
                    placeholder="Misal: qris, transfer, top up"
                    className="flex-1 bg-white border border-[#EEDCD7] rounded-xl px-3 py-1.5 text-xs text-[#2D213A] placeholder:text-[#9A8CA4] focus:outline-none focus:border-[#E9B949]"
                  />
                  <button
                    type="button"
                    onClick={addSecondaryTerm}
                    disabled={!secondaryInput.trim() || isLoading}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF0EA] border border-[#EEDCD7] text-xs font-bold text-[#2D213A] disabled:opacity-40 cursor-pointer"
                  >
                    + AND
                  </button>
                </div>
                {secondaryTerms.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {secondaryTerms.map((term, idx) => (
                      <React.Fragment key={term}>
                        {idx > 0 && (
                          <span className="text-[10px] font-extrabold text-[#FF7B7B] px-1">
                            OR
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-[#DFD5F5] text-[11.5px] font-semibold text-[#2D213A]">
                          {term}
                          <button
                            type="button"
                            onClick={() =>
                              setSecondaryTerms((prev) =>
                                prev.filter((t) => t !== term)
                              )
                            }
                            className="text-[#9A8CA4] hover:text-rose-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>

              {/* Live Query Preview */}
              {builtQuery && (
                <div className="px-3 py-2 rounded-xl bg-white border border-[#EEDCD7] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#7A6B84]">
                      Preview Query Aktif
                    </span>
                    <code className="text-[11.5px] text-[#2D213A] font-mono break-all">
                      {builtQuery}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveToPreset}
                    className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#F4F0FB] hover:bg-[#EAE2F8] text-[#6953A8] text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    {presetSavedToast ? 'Tersimpan!' : 'Simpan ke Koleksi Farming'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-[#2D213A] mb-1.5">
                Topik / Catatan Singkat
              </label>
              <input
                type="text"
                value={keywordInput}
                disabled={isLoading}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="misal: Transkrip Interview / Keluhan CS"
                className="w-full bg-white border border-[#EEDCD7] rounded-xl px-3 py-2 text-xs text-[#2D213A] placeholder:text-[#9A8CA4] focus:outline-none focus:border-[#E9B949] focus:ring-2 focus:ring-[#E9B949]/25"
              />
            </div>
          )}

          {/* Target Folder Input */}
          <div>
            <label className="block text-xs font-bold text-[#2D213A] mb-1.5">
              Folder Tujuan
            </label>
            <div className="relative">
              <Folder className="w-3.5 h-3.5 text-[#7A6B84] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={folderName}
                disabled={isLoading}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="misal: Pembayaran & QRIS"
                className="w-full bg-white border border-[#EEDCD7] rounded-xl pl-8.5 pr-3 py-2 text-xs text-[#2D213A] placeholder:text-[#9A8CA4] focus:outline-none focus:border-[#E9B949] focus:ring-2 focus:ring-[#E9B949]/25"
              />
            </div>
            {existingFolders.length > 0 && !isLoading && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {existingFolders.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFolderName(f)}
                    className={`px-2.5 py-0.5 rounded-xl text-[11px] border transition-colors cursor-pointer ${
                      folderName === f
                        ? 'bg-[#FFF0EA] text-[#D9534F] border-[#FF7B7B]/40 font-semibold'
                        : 'bg-[#FFFDFC] text-[#5F506B] border-[#EEDCD7] hover:bg-[#FFF7F5]'
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
              <label className="block text-xs font-bold text-[#2D213A] mb-1.5">
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
                className="w-full bg-white border border-[#EEDCD7] rounded-xl px-3 py-2 text-xs text-[#2D213A] placeholder:text-[#9A8CA4] focus:outline-none focus:border-[#E9B949] focus:ring-2 focus:ring-[#E9B949]/25"
              />
            </div>
          )}

          {/* Jadwal Otomatis Section */}
          {sourceTab !== 'csv' && !isLoading && (
            <div className="p-3.5 rounded-2xl bg-[#FFFDFC] border border-[#F2E4E0] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-[#9B85D6]" />
                  <div>
                    <span className="block text-xs font-bold text-[#2D213A]">
                      Jadwal Otomatis (Auto-Farming)
                    </span>
                    <span className="block text-[11px] text-[#7A6B84]">
                      Tarik data ulang secara berkala tanpa input manual
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setScheduleEnabled((v) => !v)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                    scheduleEnabled ? 'bg-[#FF7B7B]' : 'bg-[#E5D5D0]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      scheduleEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {scheduleEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#F6ECE9]">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#7A6B84] mb-1">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-[#EEDCD7] bg-white text-xs text-[#2D213A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#7A6B84] mb-1">
                      Jam Eksekusi
                    </label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-[#EEDCD7] bg-white text-xs text-[#2D213A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#7A6B84] mb-1">
                      Frekuensi
                    </label>
                    <select
                      value={scheduleFreq}
                      onChange={(e) =>
                        setScheduleFreq(
                          e.target.value as 'Sekali' | 'Harian' | 'Mingguan'
                        )
                      }
                      className="w-full px-2.5 py-1.5 rounded-xl border border-[#EEDCD7] bg-white text-xs text-[#2D213A]"
                    >
                      <option value="Sekali">Sekali</option>
                      <option value="Harian">Harian</option>
                      <option value="Mingguan">Mingguan</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Animated Scraping Progress for All Sources */}
          {isLoading && sourceTab === 'all' ? (
            <div className="p-3.5 rounded-2xl bg-[#FFF7F5] border border-[#F2E4E0] space-y-2">
              <p className="text-xs font-semibold text-[#2D213A]">
                Menarik data mentah untuk query{' '}
                <span className="font-bold text-[#FF7B7B]">
                  “{builtQuery || effectiveSingleKeyword}”
                </span>
                ...
              </p>
              <div className="grid grid-cols-2 gap-2">
                {activeScrapeSources.map((src, idx) => {
                  const done = progressStep > idx + 1;
                  const active = progressStep === idx + 1;
                  return (
                    <div
                      key={src}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white border border-[#F2E4E0] text-[11px]"
                    >
                      <span className="flex items-center gap-1.5 text-[#2D213A] font-medium">
                        <SourceIcon source={src} className="w-3.5 h-3.5" />
                        <span>{src}</span>
                      </span>
                      {done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : active ? (
                        <Loader2 className="w-3.5 h-3.5 text-[#FF7B7B] animate-spin" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-200" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-[#FFF7F5] border border-[#F2E4E0] text-[11px] text-[#7A6B84]">
              Hasil scraping masuk ke grup{' '}
              <span className="font-bold text-[#2D213A]">
                Raw / Perlu Triage
              </span>{' '}
              dan otomatis dihitung skor poin + interaksi & mention collection.
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-2xl border border-[#EEDCD7] text-xs font-semibold text-[#5F506B] hover:bg-[#FFF7F5] disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={
                isLoading ||
                (sourceTab === 'all' && activeScrapeSources.length === 0)
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FF7B7B] hover:bg-[#F26666] text-white text-xs font-bold border-b-4 border-[#DC5353] active:border-b-0 active:translate-y-[2px] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-all"
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
