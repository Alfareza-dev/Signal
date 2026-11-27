'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  FolderKanban,
  LogOut,
  Plus,
  Radio,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Sliders,
  Sparkles,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { Project, WorkspaceSettings } from '@/types/problemhub';

export type AdminView = 'threshold' | 'accounts' | null;

interface SidebarProps {
  projects: Project[];
  activeProjectId: string;
  activeAdminView: AdminView;
  sidebarSearch: string;
  userName: string;
  userEmail: string;
  settings: WorkspaceSettings;
  onSidebarSearchChange: (val: string) => void;
  onSelectProject: (id: string) => void;
  onSelectAdminView: (view: AdminView) => void;
  onOpenNewProjectModal: () => void;
  onDeleteProject: (id: string) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onResetDemoData: () => void;
}

export function Sidebar({
  projects,
  activeProjectId,
  activeAdminView,
  sidebarSearch,
  userName,
  userEmail,
  settings,
  onSidebarSearchChange,
  onSelectProject,
  onSelectAdminView,
  onOpenNewProjectModal,
  onDeleteProject,
  onOpenSettings,
  onLogout,
  onResetDemoData,
}: SidebarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(sidebarSearch.toLowerCase().trim())
  );

  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="w-[264px] shrink-0 rounded-3xl bg-white/95 border border-[#F4DFDA] shadow-[0_8px_30px_rgb(180,110,100,0.08)] flex flex-col h-full select-none overflow-hidden print:hidden">
      {/* Interactive Workspace Header with Dropdown */}
      <div className="relative px-3 pt-2.5 pb-1.5" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="w-full px-2 py-1.5 rounded-xl flex items-center justify-between hover:bg-white/70 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-[#FF7B7B] text-white flex items-center justify-center shadow-xs shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-extrabold text-[#2D213A] leading-tight truncate">
                Signal<span className="text-[#FF7B7B]">.</span>
              </span>
              <span className="text-[11px] text-[#7A6B84] leading-tight truncate">
                Research Workspace
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#7A6B84] shrink-0 transition-transform ${
              menuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {menuOpen && (
          <div className="absolute left-3 right-3 top-14 z-50 rounded-2xl bg-white border border-[#F2E4E0] shadow-lg py-1.5 text-xs">
            <div className="px-3 py-2 border-b border-[#F2E4E0]">
              <div className="flex items-center justify-between gap-1">
                <p className="font-bold text-[#2D213A] truncate">{userName}</p>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#FFF0EA] text-[#FF7B7B]">
                  Workspace
                </span>
              </div>
              <p className="text-[11px] text-[#7A6B84] truncate">{userEmail}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onResetDemoData();
              }}
              className="w-full px-3 py-2 flex items-center gap-2 text-[#2D213A] hover:bg-[#FFF7F5] transition-colors cursor-pointer text-left"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#7A6B84]" />
              <span>Reset Data Demo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
              className="w-full px-3 py-2 flex items-center gap-2 text-rose-600 hover:bg-rose-50/70 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Search */}
      <div className="px-3.5 pt-1.5 pb-3.5">
        <div className="relative">
          <Search className="w-4 h-4 text-[#7A6B84] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={sidebarSearch}
            onChange={(e) => onSidebarSearchChange(e.target.value)}
            placeholder="Search"
            className="w-full bg-white border border-[#F2E4E0] rounded-xl pl-8.5 pr-3 py-1.5 text-[13px] text-[#2D213A] placeholder:text-[#B5A7BE] focus:outline-none focus:border-[#E9B949] focus:ring-2 focus:ring-[#E9B949]/20 transition-colors"
          />
        </div>
      </div>

      {/* Projects & Admin Section */}
      <div className="flex-1 overflow-y-auto px-3 space-y-5">
        <div>
          <div className="flex items-center justify-between px-1.5 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A6B84]">
              Projects
            </span>
            <button
              onClick={onOpenNewProjectModal}
              title="Buat Project Baru"
              className="text-[#7A6B84] hover:text-[#FF7B7B] p-1 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1">
            {filteredProjects.map((project) => {
              const isActive =
                activeAdminView === null && project.id === activeProjectId;
              const activeVersion =
                project.versions.find((v) => v.id === project.activeVersionId) ||
                project.versions[0];
              const findingsCount = activeVersion?.findings.length ?? 0;
              return (
                <div
                  key={project.id}
                  onClick={() => {
                    onSelectAdminView(null);
                    onSelectProject(project.id);
                  }}
                  className={`group w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-[13.5px] transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#2D213A] font-semibold border border-[#F2E4E0] shadow-2xs'
                      : 'text-[#5F506B] hover:bg-white/60 hover:text-[#2D213A] border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <FolderKanban
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#FF7B7B]' : 'text-[#7A6B84]'
                      }`}
                    />
                    <span className="truncate">{project.name}</span>
                  </span>
                  <span className="flex items-center gap-1 ml-2 shrink-0">
                    {projects.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              `Hapus project "${project.name}" beserta seluruh temuannya?`
                            )
                          ) {
                            onDeleteProject(project.id);
                          }
                        }}
                        title={`Hapus ${project.name}`}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-[#7A6B84] hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <span
                      className={`text-xs tabular-nums ${
                        isActive ? 'text-[#FF7B7B] font-bold' : 'text-[#7A6B84]'
                      }`}
                    >
                      {findingsCount}
                    </span>
                  </span>
                </div>
              );
            })}

            {filteredProjects.length === 0 && (
              <p className="px-2.5 py-2 text-xs text-[#7A6B84]">
                Project tidak ditemukan.
              </p>
            )}
          </nav>

          <button
            onClick={onOpenNewProjectModal}
            className="mt-2 w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-[#7A6B84] hover:text-[#FF7B7B] hover:bg-white/60 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Project Baru</span>
          </button>
        </div>

        {/* Konfigurasi Group (Always visible for all users) */}
        <div className="pt-3 border-t border-[#F2E4E0]">
          <div className="flex items-center gap-1.5 px-1.5 mb-2">
            <Settings className="w-3.5 h-3.5 text-[#FF7B7B]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A6B84]">
              Konfigurasi
            </span>
          </div>

          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => onSelectAdminView('threshold')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] transition-colors text-left cursor-pointer ${
                activeAdminView === 'threshold'
                  ? 'bg-white text-[#2D213A] font-semibold border border-[#F2E4E0] shadow-2xs'
                  : 'text-[#5F506B] hover:bg-white/60 hover:text-[#2D213A] border border-transparent'
              }`}
            >
              <Sliders
                className={`w-4 h-4 shrink-0 ${
                  activeAdminView === 'threshold'
                    ? 'text-[#FF7B7B]'
                    : 'text-[#7A6B84]'
                }`}
              />
              <span className="truncate">Threshold & Parameter</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectAdminView('accounts')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] transition-colors text-left cursor-pointer ${
                activeAdminView === 'accounts'
                  ? 'bg-white text-[#2D213A] font-semibold border border-[#F2E4E0] shadow-2xs'
                  : 'text-[#5F506B] hover:bg-white/60 hover:text-[#2D213A] border border-transparent'
              }`}
            >
              <UserCheck
                className={`w-4 h-4 shrink-0 ${
                  activeAdminView === 'accounts'
                    ? 'text-[#FF7B7B]'
                    : 'text-[#7A6B84]'
                }`}
              />
              <span className="truncate">Akun Pantauan</span>
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] text-[#5F506B] hover:bg-white/60 hover:text-[#2D213A] border border-transparent transition-colors text-left cursor-pointer"
            >
              <Settings className="w-4 h-4 shrink-0 text-[#7A6B84]" />
              <span className="truncate">Settings AI</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="p-3.5 border-t border-[#F2E4E0] space-y-2.5 bg-[#FFF0EA]/50">

        {/* AI Mode Status Badge & Reset Demo */}
        <div className="flex items-center justify-between gap-1.5">
          {settings.strictZeroAI ? (
            <div
              title="Strict 0% AI Mode Aktif"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 min-w-0"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span className="text-[11px] font-medium truncate">
                Local · 0% AI Active
              </span>
            </div>
          ) : (
            <div
              title="Mode Hybrid / On-Demand AI"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border min-w-0 ${
                settings.llmProvider === 'ollama-qwen'
                  ? 'bg-emerald-50 border-emerald-200/80 text-emerald-700'
                  : 'bg-[#F5F3FF] border-[#9B85D6]/35 text-[#5B459E]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] font-medium truncate">
                {settings.llmProvider === 'ollama-qwen'
                  ? 'Self-Hosted · Ollama'
                  : settings.llmProvider === 'gpt-4o-mini'
                  ? 'Hybrid · GPT-4o-mini'
                  : 'Hybrid · Gemini Flash'}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Kembalikan semua data project ke data demo awal?'
                )
              ) {
                onResetDemoData();
              }
            }}
            title="Reset semua data ke kondisi demo awal"
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white border border-[#F2E4E0] hover:bg-[#FFF7F5] text-[11px] font-medium text-[#5F506B] hover:text-[#2D213A] transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3 h-3 text-[#7A6B84]" />
            <span>Reset</span>
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#FF7B7B]/20 text-[#D9534F] flex items-center justify-center text-xs font-bold shrink-0">
              {initials || 'UX'}
            </div>
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-[#2D213A] truncate">
                {userName} · Workspace
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Logout dari Workspace"
            className="p-1.5 rounded-lg text-[#7A6B84] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
