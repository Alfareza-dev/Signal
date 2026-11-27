'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  Flame,
  Heart,
  MessageCircle,
  Sparkles,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import {
  Finding,
  FindingStatus,
  ThresholdConfig,
} from '@/types/problemhub';
import { calculateFindingScore } from '@/data/mockData';
import { getActiveKeywords, HighlightQuote } from './HighlightQuote';
import { SiggyMascot } from './SiggyMascot';
import { SourceBadge } from './SourceBadge';

interface QuickTriageModalProps {
  isOpen: boolean;
  rawFindings: Finding[];
  thresholdConfig: ThresholdConfig;
  onClose: () => void;
  onTriageItem: (findingId: string, status: FindingStatus) => void;
}

export function QuickTriageModal({
  isOpen,
  rawFindings,
  thresholdConfig,
  onClose,
  onTriageItem,
}: QuickTriageModalProps) {
  const [initialTotal, setInitialTotal] = useState(rawFindings.length);
  const [triagedCount, setTriagedCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setInitialTotal(rawFindings.length);
      setTriagedCount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const currentItem = rawFindings[0] || null;
  const keywords = getActiveKeywords(thresholdConfig);

  const handleClassify = (status: FindingStatus) => {
    if (!currentItem) return;
    onTriageItem(currentItem.id, status);
    setTriagedCount((c) => c + 1);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (!currentItem) return;
      if (e.key === '1') handleClassify('Pain Point');
      if (e.key === '2') handleClassify('Workaround');
      if (e.key === '3') handleClassify('Positif / Delighter');
      if (e.key === '4') handleClassify('Noise / Archived');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentItem]);

  if (!isOpen) return null;

  const totalForProgress = Math.max(initialTotal, triagedCount + rawFindings.length, 1);
  const currentStep = Math.min(totalForProgress, triagedCount + 1);
  const progressPct =
    rawFindings.length === 0
      ? 100
      : Math.round((triagedCount / totalForProgress) * 100);

  const scoreEval = currentItem
    ? calculateFindingScore(currentItem, thresholdConfig)
    : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D213A]/35 backdrop-blur-xs p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#FFF7F5] rounded-3xl border border-[#F4DFDA] shadow-[0_24px_60px_rgba(45,33,58,0.22)] overflow-hidden p-6 space-y-5"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF7B7B] text-white flex items-center justify-center shadow-xs">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#2D213A]">
                Mode Triage Cepat
              </h2>
              <p className="text-[11px] text-[#7A6B84]">
                {rawFindings.length > 0
                  ? `${currentStep} dari ${totalForProgress} · Tekan tombol 1–4 di keyboard`
                  : 'Semua temuan Raw selesai diklasifikasi!'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white border border-[#F4DFDA] text-[#7A6B84] hover:text-[#2D213A] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-2.5 bg-white rounded-full border border-[#F4DFDA] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#E9B949] to-[#FF7B7B] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>

        {/* Card Stack Area */}
        {currentItem && scoreEval ? (
          <div className="pt-2 pb-1 space-y-7">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id}
                  initial={{ opacity: 0, x: 40, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -60, scale: 0.95 }}
                  transition={{ duration: 0.22 }}
                  className={`relative z-10 bg-white rounded-3xl border border-[#F4DFDA] p-6 space-y-5 ${
                    rawFindings.length > 1
                      ? 'shadow-[0_10px_0_-4px_#FFFFFF,0_11px_0_-4px_#F4DFDA,0_16px_32px_rgba(180,110,100,0.12)]'
                      : 'shadow-[0_12px_32px_rgba(180,110,100,0.12)]'
                  }`}
                >
                {/* Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-[#7A6B84] bg-[#FFF7F5] border border-[#F4DFDA] px-2.5 py-1 rounded-xl">
                      {currentItem.id}
                    </span>
                    <SourceBadge source={currentItem.source} />
                    <span className="text-xs text-[#7A6B84]">
                      {currentItem.author}
                    </span>
                  </div>

                  {/* 3D Score Badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-2xl border-b-2 text-xs font-extrabold tabular-nums ${
                      scoreEval.urgency === 'Tinggi'
                        ? 'bg-rose-50 text-rose-700 border-rose-200 border-b-rose-400'
                        : scoreEval.urgency === 'Sedang'
                        ? 'bg-[#FFFBEB] text-[#9A6B16] border-[#E9B949]/40 border-b-[#E9B949]'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 border-b-emerald-400'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>{scoreEval.totalScore} PT</span>
                  </div>
                </div>

                {/* Big Quote with Auto-Highlighted Keywords */}
                <div className="text-base sm:text-lg leading-relaxed text-[#2D213A] font-medium py-2">
                  “<HighlightQuote text={currentItem.quote} keywords={keywords} />”
                </div>

                {/* Interaction Metrics */}
                <div className="flex items-center gap-4 text-xs text-[#7A6B84] pt-1 border-t border-[#F2E4E0]">
                  <span className="inline-flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-[#FF7B7B]" />
                    <span>{currentItem.interactions ?? 18}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-[#9B85D6]" />
                    <span>
                      {Math.max(2, Math.round((currentItem.interactions ?? 18) * 0.15))}
                    </span>
                  </span>
                  <span className="text-[11px]">
                    Folder: <span className="font-semibold">{currentItem.folder}</span>
                  </span>
                </div>
              </motion.div>
              </AnimatePresence>
            </div>

            {/* 4 Big Tactile 3D Action Buttons */}
            <div className="relative z-20 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => handleClassify('Pain Point')}
                className="flex flex-col items-center justify-center gap-1 py-3 px-3 rounded-2xl bg-[#FF7B7B] hover:bg-[#F26666] border-b-4 border-[#DF5656] active:border-b-0 active:translate-y-1 text-white font-bold text-xs transition-all cursor-pointer"
              >
                <AlertCircle className="w-4 h-4" />
                <span>1 · Pain Point</span>
              </button>

              <button
                type="button"
                onClick={() => handleClassify('Workaround')}
                className="flex flex-col items-center justify-center gap-1 py-3 px-3 rounded-2xl bg-[#E9B949] hover:bg-[#DDA832] border-b-4 border-[#B7881E] active:border-b-0 active:translate-y-1 text-white font-bold text-xs transition-all cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                <span>2 · Workaround</span>
              </button>

              <button
                type="button"
                onClick={() => handleClassify('Positif / Delighter')}
                className="flex flex-col items-center justify-center gap-1 py-3 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 text-white font-bold text-xs transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>3 · Positif / Delighter</span>
              </button>

              <button
                type="button"
                onClick={() => handleClassify('Noise / Archived')}
                className="flex flex-col items-center justify-center gap-1 py-3 px-3 rounded-2xl bg-stone-200 hover:bg-stone-300 border-b-4 border-stone-400 active:border-b-0 active:translate-y-1 text-[#2D213A] font-bold text-xs transition-all cursor-pointer"
              >
                <Archive className="w-4 h-4" />
                <span>4 · Noise</span>
              </button>
            </div>
          </div>
        ) : (
          /* Celebration Screen with 3D Siggy */
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-[#F4DFDA] p-8 text-center space-y-4 shadow-xs"
          >
            <div className="flex justify-center">
              <SiggyMascot variant="avatar" size={96} />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inbox Triage Bersih!</span>
              </div>
              <h3 className="text-lg font-bold text-[#2D213A] pt-1">
                Keren! Semua temuan Raw sudah selesai di-triage
              </h3>
              <p className="text-xs text-[#7A6B84] max-w-sm mx-auto">
                Data sudah siap untuk dipetakan ke Empathy Map atau langsung
                dikelompokkan di AI Synthesis.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-[#FF7B7B] hover:bg-[#F26666] border-b-4 border-[#DF5656] active:border-b-0 active:translate-y-1 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Selesai & Kembali ke Findings
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
