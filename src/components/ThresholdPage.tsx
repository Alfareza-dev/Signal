'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  FlaskConical,
  Minus,
  Plus,
  RotateCcw,
  Sliders,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react';
import { ScoringParameter, ThresholdConfig } from '@/types/problemhub';
import {
  calculateFindingScore,
  DEFAULT_THRESHOLD_CONFIG,
} from '@/data/mockData';

interface ThresholdPageProps {
  config: ThresholdConfig;
  onUpdateConfig: (nextConfig: ThresholdConfig) => void;
}

export function ThresholdPage({ config, onUpdateConfig }: ThresholdPageProps) {
  const [newKeywordMap, setNewKeywordMap] = useState<Record<string, string>>(
    {}
  );

  // Live Mention Simulation State
  const [simText, setSimText] = useState(
    'Min @ewallet_care tolong dong ini gagal OTP terus pas mau bayar QRIS, padahal saldo cukup!'
  );
  const [simInteractions, setSimInteractions] = useState<number>(620);
  const [simVerified, setSimVerified] = useState<boolean>(true);
  const [simHasMedia, setSimHasMedia] = useState<boolean>(true);
  const [simDirectTag, setSimDirectTag] = useState<boolean>(true);

  const availableParams = config.parameters.filter((p) => !p.active);
  const activeParams = config.parameters.filter((p) => p.active);
  const maxActiveScore = activeParams.reduce((sum, p) => sum + p.points, 0);

  const simResult = calculateFindingScore(
    {
      quote: simText,
      interactions: simInteractions,
      isVerified: simVerified,
      hasMedia: simHasMedia,
      isDirectTag: simDirectTag,
    },
    config
  );

  const updateParameter = (
    id: string,
    updates: Partial<ScoringParameter>
  ) => {
    onUpdateConfig({
      ...config,
      parameters: config.parameters.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    });
  };

  const handleAddKeyword = (param: ScoringParameter) => {
    const raw = (newKeywordMap[param.id] || '').trim().toLowerCase();
    if (!raw) return;
    const current = param.keywords || [];
    if (!current.includes(raw)) {
      updateParameter(param.id, { keywords: [...current, raw] });
    }
    setNewKeywordMap((prev) => ({ ...prev, [param.id]: '' }));
  };

  const handleRemoveKeyword = (param: ScoringParameter, kw: string) => {
    updateParameter(param.id, {
      keywords: (param.keywords || []).filter((k) => k !== kw),
    });
  };

  const lowMax = Math.max(1, Math.floor(config.scoreThreshold * 0.5) - 1);
  const medMin = Math.max(1, Math.floor(config.scoreThreshold * 0.5));
  const medMax = Math.max(medMin, config.scoreThreshold - 1);
  const highMin = config.scoreThreshold;

  return (
    <div className="h-full overflow-y-auto bg-[#FFF7F5] p-6 space-y-5 animate-fade-slide">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFF0EA] border border-[#F2E4E0] text-[#FF7B7B] text-[11px] font-semibold mb-1.5">
            <Sliders className="w-3 h-3" />
            <span>Sistem Poin & Prioritas Otomatis</span>
          </div>
          <h1 className="text-lg font-bold text-[#2D213A]">
            Threshold & Parameter Penilaian
          </h1>
          <p className="text-xs text-[#7A6B84] mt-0.5">
            Atur bobot poin tiap sinyal keluhan. Perubahan langsung menghitung ulang
            skor seluruh temuan di tab Findings secara real-time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onUpdateConfig(DEFAULT_THRESHOLD_CONFIG)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#F2E4E0] hover:bg-[#FFF0EA] text-xs font-semibold text-[#2D213A] shadow-2xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#7A6B84]" />
          <span>Reset Default</span>
        </button>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Column 1: Daftar Parameter Tersedia */}
        <section className="rounded-2xl border border-[#F2E4E0] bg-white p-5 space-y-4 shadow-[0_4px_20px_rgba(255,123,123,0.05)]">
          <div className="flex items-center justify-between border-b border-[#F2E4E0] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#2D213A]">
                1. Parameter Tersedia
              </h2>
              <p className="text-[11px] text-[#7A6B84]">
                Kriteria tambahan yang siap diaktifkan
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFF0EA] text-[#2D213A] tabular-nums">
              {availableParams.length}
            </span>
          </div>

          {availableParams.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#7A6B84] italic">
              Semua parameter sudah aktif di kolom tengah.
            </div>
          ) : (
            <div className="space-y-3">
              {availableParams.map((param) => (
                <div
                  key={param.id}
                  className="p-4 rounded-2xl border border-[#F2E4E0] bg-[#FFF7F5] space-y-2.5 hover:border-[#FF7B7B]/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-[#2D213A]">
                        {param.title}
                      </h3>
                      <p className="text-[11px] text-[#7A6B84] mt-0.5 leading-relaxed">
                        {param.description}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#FF7B7B] bg-white border border-[#F2E4E0] px-2 py-0.5 rounded-full shrink-0 tabular-nums">
                      +{param.points} poin
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => updateParameter(param.id, { active: true })}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#FF7B7B]/50 text-[#FF7B7B] hover:bg-[#FF7B7B] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Aktifkan</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Column 2: Parameter Aktif (Editable) */}
        <section className="rounded-2xl border border-[#F2E4E0] bg-white p-5 space-y-4 shadow-[0_4px_20px_rgba(255,123,123,0.05)]">
          <div className="flex items-center justify-between border-b border-[#F2E4E0] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#2D213A]">
                2. Parameter Aktif
              </h2>
              <p className="text-[11px] text-[#7A6B84]">
                Atur bobot poin & aturan tiap kriteria
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 tabular-nums">
              {activeParams.length} Aktif
            </span>
          </div>

          {activeParams.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#7A6B84] italic">
              Belum ada parameter aktif. Aktifkan dari Kolom 1.
            </div>
          ) : (
            <div className="space-y-3">
              {activeParams.map((param) => (
                <div
                  key={param.id}
                  className="p-4 rounded-2xl border border-[#F2E4E0] bg-white space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-[#2D213A]">
                        {param.title}
                      </h3>
                      <p className="text-[11px] text-[#7A6B84] mt-0.5">
                        {param.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateParameter(param.id, { active: false })
                      }
                      title="Nonaktifkan parameter"
                      className="p-1 rounded-lg text-[#7A6B84] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Keyword Tags Editor */}
                  {param.type === 'keyword' && (
                    <div className="p-2.5 rounded-xl bg-[#FFF7F5] border border-[#F2E4E0] space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {(param.keywords || []).map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#9A6B16] border border-[#E9B949]/50 text-[11px] font-medium"
                          >
                            <span>{kw}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveKeyword(param, kw)}
                              className="hover:text-rose-600 cursor-pointer"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={newKeywordMap[param.id] || ''}
                          onChange={(e) =>
                            setNewKeywordMap((prev) => ({
                              ...prev,
                              [param.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddKeyword(param);
                            }
                          }}
                          placeholder="Tambah kata kunci..."
                          className="flex-1 min-w-0 bg-white border border-[#F2E4E0] rounded-lg px-2.5 py-1 text-[11px] text-[#2D213A] focus:outline-none focus:border-[#E9B949] focus:ring-2 focus:ring-[#E9B949]/20"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddKeyword(param)}
                          className="px-2.5 py-1 rounded-lg bg-[#FF7B7B] hover:bg-[#F26666] text-white text-[11px] font-semibold cursor-pointer"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Min Interactions Input */}
                  {param.type === 'interactions' && (
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#FFF7F5] border border-[#F2E4E0]">
                      <span className="text-[11px] font-medium text-[#2D213A]">
                        Minimal interaksi:
                      </span>
                      <input
                        type="number"
                        min={1}
                        step={50}
                        value={param.minInteractions ?? 500}
                        onChange={(e) =>
                          updateParameter(param.id, {
                            minInteractions: Math.max(
                              1,
                              Number(e.target.value) || 1
                            ),
                          })
                        }
                        className="w-24 bg-white border border-[#F2E4E0] rounded-lg px-2.5 py-1 text-xs font-bold text-[#2D213A] text-right tabular-nums focus:outline-none focus:border-[#E9B949] focus:ring-2 focus:ring-[#E9B949]/20"
                      />
                    </div>
                  )}

                  {/* Point Stepper */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-[#F2E4E0]">
                    <span className="text-[11px] font-medium text-[#7A6B84]">
                      Bobot Poin
                    </span>
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateParameter(param.id, {
                            points: Math.max(1, param.points - 1),
                          })
                        }
                        className="w-7 h-7 rounded-xl border border-[#F2E4E0] border-b-2 bg-[#FFF7F5] hover:bg-[#FFF0EA] active:border-b-0 active:translate-y-0.5 flex items-center justify-center text-[#2D213A] transition-all cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#FF7B7B] tabular-nums w-14 text-center">
                        +{param.points} poin
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateParameter(param.id, {
                            points: Math.min(20, param.points + 1),
                          })
                        }
                        className="w-7 h-7 rounded-xl border border-[#F2E4E0] border-b-2 bg-[#FFF7F5] hover:bg-[#FFF0EA] active:border-b-0 active:translate-y-0.5 flex items-center justify-center text-[#2D213A] transition-all cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Column 3: Batas Skor, Level Urgensi & Simulasi Mention Live */}
        <section className="rounded-2xl border border-[#F2E4E0] bg-white p-5 space-y-5 shadow-[0_4px_20px_rgba(255,123,123,0.05)]">
          <div className="border-b border-[#F2E4E0] pb-3">
            <h2 className="text-sm font-bold text-[#2D213A]">
              3. Batas Skor & Simulasi Live
            </h2>
            <p className="text-[11px] text-[#7A6B84]">
              Kalibrasi ambang batas & uji kelayakan postingan
            </p>
          </div>

          {/* Batas Skor Input + Max Active Score */}
          <div className="p-4 rounded-2xl bg-[#FFF0EA] border border-[#FF7B7B]/30 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-[#2D213A] block">
                  Batas Skor
                </label>
                <span className="text-[11px] text-[#7A6B84]">
                  Maks. skor aktif:{' '}
                  <span className="font-semibold text-[#2D213A] tabular-nums">
                    {maxActiveScore} poin
                  </span>
                </span>
              </div>
              <input
                type="number"
                min={1}
                max={50}
                value={config.scoreThreshold}
                onChange={(e) =>
                  onUpdateConfig({
                    ...config,
                    scoreThreshold: Math.max(1, Number(e.target.value) || 1),
                  })
                }
                className="w-20 bg-white border border-[#E9B949] rounded-xl px-2.5 py-1.5 text-sm font-bold text-[#2D213A] text-center tabular-nums focus:outline-none focus:ring-2 focus:ring-[#E9B949]/30"
              />
            </div>
            <p className="text-[11px] text-[#5F506B] leading-relaxed">
              Temuan dengan skor{' '}
              <span className="font-bold text-[#2D213A]">
                ≥ {config.scoreThreshold}
              </span>{' '}
              otomatis masuk ke{' '}
              <span className="font-bold text-[#FF7B7B]">
                Mention Collection
              </span>
              .
            </p>
          </div>

          {/* Rentang Level Urgensi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#2D213A]">
                Rentang Level Urgensi
              </span>
              <span className="text-[11px] text-[#7A6B84]">
                Mint · Honey · Coral
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-gradient-to-r from-[#34D399] via-[#E9B949] to-[#FF7B7B] shadow-inner" />
            <div className="grid grid-cols-3 text-[11px] pt-0.5">
              <div className="text-left">
                <span className="font-bold text-emerald-700 block">Rendah</span>
                <span className="text-[#7A6B84] tabular-nums">0–{lowMax} pt</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-amber-700 block">Sedang</span>
                <span className="text-[#7A6B84] tabular-nums">
                  {medMin}–{medMax} pt
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-rose-600 block">Tinggi</span>
                <span className="text-[#7A6B84] tabular-nums">≥ {highMin} pt</span>
              </div>
            </div>
          </div>

          {/* Kotak Simulasi Mention Live */}
          <div className="p-4 rounded-2xl border border-[#F2E4E0] bg-[#FFF7F5] space-y-3">
            <div className="flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-[#9B85D6]" />
              <h3 className="text-xs font-bold text-[#2D213A]">
                Simulasi Mention Live
              </h3>
            </div>

            <textarea
              rows={2}
              value={simText}
              onChange={(e) => setSimText(e.target.value)}
              placeholder="Ketik contoh postingan pengguna..."
              className="w-full bg-white border border-[#F2E4E0] rounded-xl px-3 py-2 text-xs text-[#2D213A] focus:outline-none focus:border-[#E9B949] focus:ring-2 focus:ring-[#E9B949]/20"
            />

            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#2D213A] font-medium">
                Angka Interaksi:
              </span>
              <input
                type="number"
                min={0}
                step={50}
                value={simInteractions}
                onChange={(e) =>
                  setSimInteractions(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-24 bg-white border border-[#F2E4E0] rounded-xl px-2.5 py-1 text-xs font-bold text-[#2D213A] text-right tabular-nums focus:outline-none focus:border-[#E9B949]"
              />
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#F2E4E0] cursor-pointer text-[#2D213A]">
                <input
                  type="checkbox"
                  checked={simVerified}
                  onChange={(e) => setSimVerified(e.target.checked)}
                  className="accent-[#FF7B7B]"
                />
                <span>Akun terverifikasi</span>
              </label>

              <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#F2E4E0] cursor-pointer text-[#2D213A]">
                <input
                  type="checkbox"
                  checked={simHasMedia}
                  onChange={(e) => setSimHasMedia(e.target.checked)}
                  className="accent-[#FF7B7B]"
                />
                <span>Ada media</span>
              </label>

              <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#F2E4E0] cursor-pointer text-[#2D213A]">
                <input
                  type="checkbox"
                  checked={simDirectTag}
                  onChange={(e) => setSimDirectTag(e.target.checked)}
                  className="accent-[#FF7B7B]"
                />
                <span>Tag langsung</span>
              </label>
            </div>

            {/* Live Result Box with Animated Score Gauge */}
            <div className="p-3.5 rounded-xl bg-white border border-[#F2E4E0] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF7B7B]" />
                  <span className="text-xs font-bold text-[#2D213A]">
                    Total Skor: {simResult.totalScore} Poin
                  </span>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    simResult.urgency === 'Tinggi'
                      ? 'bg-rose-50 text-rose-700'
                      : simResult.urgency === 'Sedang'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  Urgensi {simResult.urgency}
                </span>
              </div>

              {/* Animated Score Gauge toward Threshold Marker */}
              <div className="space-y-1">
                <div className="relative w-full h-3 bg-[#FFF7F5] border border-[#F2E4E0] rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      simResult.passedThreshold
                        ? 'bg-gradient-to-r from-[#34D399] via-[#E9B949] to-[#FF7B7B]'
                        : 'bg-gradient-to-r from-[#34D399] to-[#E9B949]'
                    }`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (simResult.totalScore /
                            Math.max(1, maxActiveScore, config.scoreThreshold)) *
                            100
                        )
                      )}%`,
                    }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  />
                  {/* Threshold Marker Line */}
                  <div
                    title={`Garis Batas Skor: ${config.scoreThreshold}`}
                    style={{
                      left: `${Math.min(
                        96,
                        Math.round(
                          (config.scoreThreshold /
                            Math.max(1, maxActiveScore, config.scoreThreshold)) *
                            100
                        )
                      )}%`,
                    }}
                    className="absolute top-0 bottom-0 w-0.5 bg-[#2D213A]/70"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#7A6B84] tabular-nums">
                  <span>0 pt</span>
                  <span>Batas: {config.scoreThreshold} pt</span>
                  <span>Maks: {Math.max(maxActiveScore, config.scoreThreshold)} pt</span>
                </div>
              </div>

              {simResult.breakdown.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {simResult.breakdown.map((b, i) => (
                    <span
                      key={i}
                      className="text-[10.5px] px-2 py-0.5 rounded-full bg-[#F5F3FF] border border-[#9B85D6]/30 text-[#5B459E] font-medium"
                    >
                      +{b.points} · {b.label}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[#7A6B84] italic">
                  Tidak ada parameter aktif yang terpenuhi.
                </p>
              )}

              <div
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold ${
                  simResult.passedThreshold
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                    : 'bg-amber-50 text-amber-800 border border-amber-200/70'
                }`}
              >
                {simResult.passedThreshold ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Lolos (≥ {config.scoreThreshold}) · Masuk ke Mention
                      Collection
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Belum Lolos (&lt; {config.scoreThreshold}) · Tetap di Raw
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

