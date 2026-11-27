'use client';

import React, { useState } from 'react';
import { GitBranch, Sparkles, X } from 'lucide-react';

interface NewVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  nextLabel: string;
  projectName: string;
  defaultKeyword: string;
  onCreateVersion: (payload: {
    keywordQuery: string;
    notes: string;
    copyFindings: boolean;
  }) => void;
}

export function NewVersionModal({
  isOpen,
  onClose,
  nextLabel,
  projectName,
  defaultKeyword,
  onCreateVersion,
}: NewVersionModalProps) {
  const [keywordQuery, setKeywordQuery] = useState(defaultKeyword);
  const [notes, setNotes] = useState('');
  const [copyFindings, setCopyFindings] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywordQuery.trim()) return;
    onCreateVersion({
      keywordQuery: keywordQuery.trim(),
      notes: notes.trim() || `Iterasi riset ${nextLabel} untuk ${projectName}`,
      copyFindings,
    });
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D213A]/35 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-3xl border border-[#F2E4E0] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-[#F2E4E0] bg-[#FFF7F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#9B85D6]/15 border border-[#9B85D6]/30 flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-[#7D66BD]" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#2D213A]">
                Simpan Versi Baru ({nextLabel})
              </h3>
              <p className="text-[12px] text-[#7A6B84] truncate max-w-[260px]">
                {projectName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#7A6B84] hover:text-[#2D213A] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#2D213A] mb-1.5">
              Keyword / Query Pencarian ({nextLabel})
            </label>
            <input
              type="text"
              value={keywordQuery}
              onChange={(e) => setKeywordQuery(e.target.value)}
              placeholder='Contoh: ("qris" OR "transfer") AND ("gagal" OR "pending")'
              className="w-full px-3.5 py-2.5 text-[13px] rounded-2xl border border-[#EEDCD7] bg-[#FFFDFC] text-[#2D213A] focus:outline-none focus:ring-2 focus:ring-[#E9B949]/60 focus:border-[#E9B949]"
              required
            />
            <p className="text-[11.5px] text-[#7A6B84] mt-1">
              Gunakan operator <code className="px-1 py-0.5 rounded bg-[#FFF0EA] text-[#2D213A]">AND</code> / <code className="px-1 py-0.5 rounded bg-[#FFF0EA] text-[#2D213A]">OR</code> untuk iterasi keyword baru.
            </p>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#2D213A] mb-1.5">
              Catatan Fokus Versi
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Misal: Fokus validasi pasca-rilis fitur transparansi biaya admin..."
              className="w-full px-3.5 py-2.5 text-[13px] rounded-2xl border border-[#EEDCD7] bg-[#FFFDFC] text-[#2D213A] focus:outline-none focus:ring-2 focus:ring-[#E9B949]/60 focus:border-[#E9B949] resize-none"
            />
          </div>

          <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FFF7F5] border border-[#F2E4E0] cursor-pointer">
            <input
              type="checkbox"
              checked={copyFindings}
              onChange={(e) => setCopyFindings(e.target.checked)}
              className="mt-0.5 rounded border-[#EEDCD7] text-[#FF7B7B] focus:ring-[#FF7B7B]"
            />
            <div>
              <span className="block text-[12.5px] font-semibold text-[#2D213A]">
                Bawa temuan dari versi aktif sebelumnya
              </span>
              <span className="block text-[11.5px] text-[#7A6B84]">
                Nonaktifkan jika ingin memulai {nextLabel} dengan kanvas temuan bersih.
              </span>
            </div>
          </label>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-semibold text-[#5F506B] hover:text-[#2D213A] rounded-2xl hover:bg-[#FFF7F5] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-bold text-white bg-[#FF7B7B] hover:bg-[#F26666] rounded-2xl border-b-4 border-[#DC5353] active:border-b-0 active:translate-y-[2px] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Buat Versi {nextLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
