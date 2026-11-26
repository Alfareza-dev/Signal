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
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Project, WorkspaceSettings } from '@/types/problemhub';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string;
  sidebarSearch: string;
  userName: string;
  userEmail: string;
  settings: WorkspaceSettings;
  onSidebarSearchChange: (val: string) => void;
  onSelectProject: (id: string) => void;
  onOpenNewProjectModal: () => void;
  onDeleteProject: (id: string) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onResetDemoData: () => void;
}

export function Sidebar({
  projects,
  activeProjectId,
  sidebarSearch,
  userName,
  userEmail,
  settings,
  onSidebarSearchChange,
  onSelectProject,
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
    <aside className="w-[264px] shrink-0 bg-[#F8F9FA] border-r border-[#E5E7EB] flex flex-col h-screen select-none">
      {/* Interactive Workspace Header with Dropdown */}
      <div className="relative px-3 pt-2.5 pb-1.5" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="w-full px-2 py-1.5 rounded-lg flex items-center justify-between hover:bg-gray-200/60 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-gray-900 leading-tight truncate">
                Signal
              </span>
              <span className="text-[11px] text-gray-500 leading-tight truncate">
                Research Workspace
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
              menuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {menuOpen && (
          <div className="absolute left-3 right-3 top-14 z-50 rounded-lg bg-white border border-[#E5E7EB] shadow-lg py-1.5 text-xs">
            <div className="px-3 py-2 border-b border-[#E5E7EB]">
              <p className="font-semibold text-gray-900 truncate">{userName}</p>
              <p className="text-[11px] text-gray-500 truncate">{userEmail}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onResetDemoData();
              }}
              className="w-full px-3 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-left"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
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
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Search */}
      <div className="px-3.5 pt-1.5 pb-3.5">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={sidebarSearch}
            onChange={(e) => onSidebarSearchChange(e.target.value)}
            placeholder="Search"
            className="w-full bg-white border border-[#E5E7EB] rounded-md pl-8.5 pr-3 py-1.5 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
          />
        </div>
      </div>

      {/* Projects Section */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="flex items-center justify-between px-1.5 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Projects
          </span>
          <button
            onClick={onOpenNewProjectModal}
            title="Buat Project Baru"
            className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <nav className="space-y-1">
          {filteredProjects.map((project) => {
            const isActive = project.id === activeProjectId;
            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className={`group w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[13.5px] transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-gray-200/75 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-200/40 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <FolderKanban
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-blue-600' : 'text-gray-400'
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
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <span
                    className={`text-xs tabular-nums ${
                      isActive ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    {project.findings.length}
                  </span>
                </span>
              </div>
            );
          })}

          {filteredProjects.length === 0 && (
            <p className="px-2.5 py-2 text-xs text-gray-400">
              Project tidak ditemukan.
            </p>
          )}
        </nav>

        <button
          onClick={onOpenNewProjectModal}
          className="mt-2.5 w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-200/40 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-gray-400" />
          <span>Project Baru</span>
        </button>
      </div>

      {/* Bottom Footer */}
      <div className="p-3.5 border-t border-[#E5E7EB] space-y-2.5 bg-[#F8F9FA]">
        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Settings className="w-3.5 h-3.5 text-gray-500" />
            <span>Settings</span>
          </span>
          <span className="text-[10px] text-gray-400">3-Tier AI</span>
        </button>

        {/* AI Mode Status Badge & Reset Demo */}
        <div className="flex items-center justify-between gap-1.5">
          {settings.strictZeroAI ? (
            <div
              title="Strict 0% AI Mode Aktif"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-700 min-w-0"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span className="text-[11px] font-medium truncate">
                Local · 0% AI Active
              </span>
            </div>
          ) : (
            <div
              title="Mode Hybrid / On-Demand AI"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border min-w-0 ${
                settings.llmProvider === 'ollama-qwen'
                  ? 'bg-emerald-50 border-emerald-200/80 text-emerald-700'
                  : 'bg-blue-50 border-blue-200/80 text-blue-700'
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
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md bg-white border border-[#E5E7EB] hover:bg-gray-100 text-[11px] font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3 h-3 text-gray-400" />
            <span>Reset</span>
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold shrink-0">
              {initials || 'UX'}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-gray-800 truncate">
                {userName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Logout dari Workspace"
            className="p-1.5 rounded-md text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
