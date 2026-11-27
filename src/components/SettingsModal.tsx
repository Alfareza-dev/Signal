'use client';

import React, { useEffect, useState } from 'react';
import {
  Cpu,
  Database,
  Eye,
  EyeOff,
  Globe,
  RotateCcw,
  Save,
  ShieldCheck,
  Sliders,
  Trash2,
  X,
} from 'lucide-react';
import { WorkspaceSettings } from '@/types/problemhub';
import { DEFAULT_SETTINGS } from '@/data/mockData';

interface SettingsModalProps {
  isOpen: boolean;
  settings: WorkspaceSettings;
  totalTokensUsed: number;
  onClose: () => void;
  onSaveSettings: (newSettings: WorkspaceSettings) => void;
  onClearAICache: () => void;
}

export function SettingsModal({
  isOpen,
  settings,
  totalTokensUsed,
  onClose,
  onSaveSettings,
  onClearAICache,
}: SettingsModalProps) {
  const [draft, setDraft] = useState<WorkspaceSettings>(settings);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDraft(settings);
    }
  }, [isOpen, settings]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cap = Math.max(1000, draft.monthlyTokenCap || 100000);
  const usagePct = Math.min(100, Math.round((totalTokensUsed / cap) * 100));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(draft);
    onClose();
  };

  const handleResetDefaults = () => {
    setDraft(DEFAULT_SETTINGS);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[1px] p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] bg-white rounded-xl border border-[#E5E7EB] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-gray-100 text-gray-700">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Pengaturan Workspace (Signal)
              </h2>
              <p className="text-[11px] text-gray-500">
                Konfigurasi arsitektur 3-Tier Low-AI, batas kuota token, dan sumber
                intake.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: AI Engine & Model Routing */}
          <section className="rounded-lg border border-[#E5E7EB] bg-white p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
              <Cpu className="w-4 h-4 text-[#FF7B7B]" />
              <h3 className="text-[13px] font-semibold text-gray-900">
                1. AI Engine & Model Routing (3-Tier Architecture)
              </h3>
            </div>

            {/* Strict 0% AI Toggle */}
            <div className="flex items-center justify-between gap-4 p-3.5 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-gray-900">
                    Strict 0% AI Mode
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Memblokir seluruh pemanggilan Cloud API. Hanya Triage, Empathy
                  Map, dan Local Clustering yang aktif.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={draft.strictZeroAI}
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    strictZeroAI: !prev.strictZeroAI,
                  }))
                }
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  draft.strictZeroAI ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                    draft.strictZeroAI ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tier 2 Local Clustering */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Local Clustering Model (Tier 2 — Gratis)
                </label>
                <select
                  value={draft.localClusteringModel}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      localClusteringModel: e.target.value as WorkspaceSettings['localClusteringModel'],
                    }))
                  }
                  className="w-full bg-white border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#E9B949]"
                >
                  <option value="minilm-l12-v2">
                    paraphrase-multilingual-MiniLM-L12-v2 (Lokal · 0 Token)
                  </option>
                  <option value="tfidf-fast">
                    TF-IDF Fast Cosine Clustering (Lokal · 0 Token)
                  </option>
                </select>
              </div>

              {/* Tier 3 Synthesis LLM Provider */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Synthesis LLM Provider (Tier 3 — On-Demand)
                </label>
                <select
                  value={draft.llmProvider}
                  disabled={draft.strictZeroAI}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      llmProvider: e.target.value as WorkspaceSettings['llmProvider'],
                    }))
                  }
                  className="w-full bg-white border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#E9B949] disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="gemini-flash-lite">
                    Cloud API (Gemini 2.5 Flash-Lite)
                  </option>
                  <option value="gpt-4o-mini">Cloud API (GPT-4o-mini)</option>
                  <option value="ollama-qwen">
                    Self-Hosted Local (Ollama — Qwen 2.5 7B · 0 Biaya API)
                  </option>
                </select>
              </div>
            </div>

            {/* Dynamic Provider Endpoint / API Key */}
            {draft.llmProvider === 'ollama-qwen' ? (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Ollama Base URL (Self-Hosted)
                </label>
                <input
                  type="text"
                  disabled={draft.strictZeroAI}
                  value={draft.ollamaBaseUrl}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      ollamaBaseUrl: e.target.value,
                    }))
                  }
                  placeholder="http://localhost:11434"
                  className="w-full bg-white border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-gray-800 font-mono focus:outline-none focus:border-[#E9B949] disabled:bg-gray-50"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  API Key (Simulasi Terenkripsi Lokal)
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    disabled={draft.strictZeroAI}
                    value={draft.apiKey}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, apiKey: e.target.value }))
                    }
                    placeholder="Masukkan API Key..."
                    className="w-full bg-white border border-[#E5E7EB] rounded-md pl-3 pr-9 py-2 text-xs text-gray-800 font-mono focus:outline-none focus:border-[#E9B949] disabled:bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey((s) => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    {showApiKey ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Section 2: Kontrol Kuota & Penghematan Token */}
          <section className="rounded-lg border border-[#E5E7EB] bg-white p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
              <Database className="w-4 h-4 text-emerald-600" />
              <h3 className="text-[13px] font-semibold text-gray-900">
                2. Kontrol Kuota & Penghematan Token (Cost Guardrails)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Batas Maksimal Token per Bulan (Hard Cap)
                </label>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={draft.monthlyTokenCap}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      monthlyTokenCap: Number(e.target.value) || 100000,
                    }))
                  }
                  className="w-full bg-white border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-gray-800 tabular-nums focus:outline-none focus:border-[#E9B949]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Maksimal Kutipan per Pemanggilan AI
                </label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={draft.maxQuotesPerCall}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      maxQuotesPerCall: Number(e.target.value) || 20,
                    }))
                  }
                  className="w-full bg-white border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-gray-800 tabular-nums focus:outline-none focus:border-[#E9B949]"
                />
              </div>
            </div>

            {/* Token Usage Progress Bar */}
            <div className="p-3.5 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700">
                  Pemakaian Token Lintas Project Saat Ini
                </span>
                <span className="font-semibold text-gray-900 tabular-nums">
                  {totalTokensUsed.toLocaleString('id-ID')} /{' '}
                  {cap.toLocaleString('id-ID')} token ({usagePct}%)
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    usagePct > 80 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.max(2, usagePct)}%` }}
                />
              </div>
            </div>

            {/* Deduplication & Permanent Cache */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={draft.enableCache}
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      enableCache: !prev.enableCache,
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    draft.enableCache ? 'bg-[#FF7B7B]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                      draft.enableCache ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <div>
                  <p className="text-xs font-medium text-gray-800">
                    Aktifkan Deduplikasi & Cache Permanen (ai_insights)
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Cache telah menghemat{' '}
                    <span className="font-semibold text-emerald-700">
                      {draft.cacheHits}x pemanggilan ulang AI
                    </span>{' '}
                    (~{(draft.cacheHits * 450).toLocaleString('id-ID')} token).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClearAICache}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#E5E7EB] bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-medium text-gray-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Bersihkan AI Cache</span>
              </button>
            </div>
          </section>

          {/* Section 3: Konfigurasi Sumber Scraping & Intake */}
          <section className="rounded-lg border border-[#E5E7EB] bg-white p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
              <Globe className="w-4 h-4 text-orange-600" />
              <h3 className="text-[13px] font-semibold text-gray-900">
                3. Konfigurasi Sumber Scraping & Intake
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(
                [
                  { key: 'twitter', label: 'X / Twitter' },
                  { key: 'instagram', label: 'Instagram' },
                  { key: 'playStore', label: 'Google Play Store' },
                  { key: 'openAlex', label: 'Jurnal OpenAlex' },
                ] as const
              ).map((src) => {
                const enabled = draft.enabledSources[src.key];
                return (
                  <button
                    key={src.key}
                    type="button"
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        enabledSources: {
                          ...prev.enabledSources,
                          [src.key]: !enabled,
                        },
                      }))
                    }
                    className={`px-3 py-2 rounded-md border text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                      enabled
                        ? 'bg-[#FFF0EA]/70 border-[#FF7B7B]/35 text-[#9E3B3B]'
                        : 'bg-gray-50 border-[#E5E7EB] text-gray-400'
                    }`}
                  >
                    <span className="truncate">{src.label}</span>
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        enabled ? 'bg-[#FF7B7B]' : 'bg-gray-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Batas Data per Scrape
                </label>
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={draft.maxItemsPerScrape}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      maxItemsPerScrape: Number(e.target.value) || 50,
                    }))
                  }
                  className="w-full bg-white border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-gray-800 tabular-nums focus:outline-none focus:border-[#E9B949]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Proxy Endpoint (Opsional · Anti-Blokir)
                </label>
                <input
                  type="text"
                  value={draft.proxyEndpoint}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      proxyEndpoint: e.target.value,
                    }))
                  }
                  placeholder="https://proxy-pool.internal:8080"
                  className="w-full bg-white border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-gray-800 font-mono placeholder:text-gray-400 focus:outline-none focus:border-[#E9B949]"
                />
              </div>
            </div>
          </section>

          {/* Section 4: Manajemen Workspace Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#E5E7EB] bg-white hover:bg-gray-50 text-xs font-medium text-gray-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Pengaturan Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-[#E5E7EB] text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#FF7B7B] hover:bg-[#F26666] text-white text-xs font-medium shadow-2xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Pengaturan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
