'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  ExternalLink,
  Plus,
  Tag,
  User,
  X,
} from 'lucide-react';
import {
  EmpathyQuadrant,
  Finding,
  FindingStatus,
} from '@/types/problemhub';
import {
  getLabelColorClass,
  getQuadrantBadgeClass,
  SourceBadge,
  StatusIcon,
} from './SourceBadge';

interface FindingDrawerProps {
  finding: Finding | null;
  allProjectLabels: string[];
  onClose: () => void;
  onUpdateFinding: (findingId: string, updates: Partial<Finding>) => void;
}

const STATUSES: FindingStatus[] = [
  'Raw / Perlu Triage',
  'Pain Point',
  'Workaround',
  'Noise / Archived',
];

const QUADRANTS: { value: EmpathyQuadrant; label: string }[] = [
  { value: 'Says', label: 'Says (Diucapkan)' },
  { value: 'Thinks', label: 'Thinks (Dipikirkan)' },
  { value: 'Feels', label: 'Feels (Dirasakan)' },
  { value: 'Does', label: 'Does (Dilakukan)' },
];

export function FindingDrawer({
  finding,
  allProjectLabels,
  onClose,
  onUpdateFinding,
}: FindingDrawerProps) {
  const [newLabel, setNewLabel] = useState('');

  useEffect(() => {
    if (!finding) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [finding, onClose]);

  if (!finding) return null;

  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newLabel.trim();
    if (trimmed && !finding.labels.includes(trimmed)) {
      onUpdateFinding(finding.id, {
        labels: [...finding.labels, trimmed],
      });
    }
    setNewLabel('');
  };

  const toggleSuggestedLabel = (label: string) => {
    if (finding.labels.includes(label)) {
      onUpdateFinding(finding.id, {
        labels: finding.labels.filter((l) => l !== label),
      });
    } else {
      onUpdateFinding(finding.id, {
        labels: [...finding.labels, label],
      });
    }
  };

  const suggestedLabels = allProjectLabels.filter(
    (l) => !finding.labels.includes(l)
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 flex justify-end bg-black/15 backdrop-blur-[1px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full border-l border-[#E5E7EB] shadow-xl flex flex-col animate-in slide-in-from-right duration-150"
      >
        {/* Drawer Header */}
        <div className="px-5 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {finding.id}
            </span>
            <SourceBadge source={finding.source} />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Full Quote */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-2">
              Kutipan Lengkap Pengguna
            </label>
            <div className="p-4 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] text-[13.5px] leading-relaxed text-gray-800">
              “{finding.quote}”
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-[#E5E7EB] bg-white">
              <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                <User className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Penulis / Sumber</span>
              </div>
              <p className="font-medium text-gray-800 truncate">{finding.author}</p>
            </div>

            <div className="p-3 rounded-lg border border-[#E5E7EB] bg-white">
              <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Tanggal Diambil</span>
              </div>
              <p className="font-medium text-gray-800">{finding.createdAt}</p>
            </div>
          </div>

          {/* Reference Link */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Link Referensi
            </label>
            <a
              href={finding.referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:underline break-all"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span>{finding.referenceUrl}</span>
            </a>
          </div>

          {/* Status Triage */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-2">
              Status Triage
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map((status) => {
                const active = finding.status === status;
                return (
                  <button
                    key={status}
                    onClick={() => onUpdateFinding(finding.id, { status })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-medium text-left transition-colors ${
                      active
                        ? 'border-blue-500 bg-blue-50/70 text-blue-800'
                        : 'border-[#E5E7EB] bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <StatusIcon status={status} className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{status}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Empathy Map Quadrant */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-2">
              Kuadran Empathy Map
            </label>
            <div className="grid grid-cols-2 gap-2">
              {QUADRANTS.map((q) => {
                const active = finding.quadrant === q.value;
                return (
                  <button
                    key={q.value}
                    onClick={() =>
                      onUpdateFinding(finding.id, {
                        quadrant: active ? undefined : q.value,
                      })
                    }
                    className={`px-3 py-2 rounded-md border text-xs font-medium text-left transition-colors ${
                      active
                        ? getQuadrantBadgeClass(q.value)
                        : 'border-[#E5E7EB] bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {q.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tag / Label Editor */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Label / Tema Kualitatif
              </label>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {finding.labels.length === 0 ? (
                <span className="text-xs text-gray-400 italic">
                  Belum ada label tema.
                </span>
              ) : (
                finding.labels.map((label) => (
                  <span
                    key={label}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium border ${getLabelColorClass(
                      label
                    )}`}
                  >
                    <span>{label}</span>
                    <button
                      onClick={() =>
                        onUpdateFinding(finding.id, {
                          labels: finding.labels.filter((l) => l !== label),
                        })
                      }
                      className="hover:opacity-75"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            <form onSubmit={handleAddLabel} className="flex gap-2">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Tambah label baru..."
                className="flex-1 bg-white border border-[#E5E7EB] rounded-md px-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </form>

            {suggestedLabels.length > 0 && (
              <div className="mt-3">
                <p className="text-[11px] text-gray-400 mb-1.5">
                  Tema lain di project ini:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedLabels.map((lbl) => (
                    <button
                      key={lbl}
                      onClick={() => toggleSuggestedLabel(lbl)}
                      className="px-2 py-0.5 rounded border border-dashed border-gray-300 text-[11px] text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                    >
                      + {lbl}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
