'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  LayoutGrid,
  Plus,
  PanelLeft,
} from 'lucide-react';
import { DEFAULT_SETTINGS, INITIAL_PROJECTS } from '@/data/mockData';
import {
  ActiveTab,
  FinalReport,
  Finding,
  LocalCluster,
  ProblemBrief,
  Project,
  WorkspaceSettings,
} from '@/types/problemhub';
import { Sidebar } from '@/components/Sidebar';
import { FindingsTab } from '@/components/FindingsTab';
import { EmpathyMapTab } from '@/components/EmpathyMapTab';
import { AISynthesisTab } from '@/components/AISynthesisTab';
import { FinalResultTab } from '@/components/FinalResultTab';
import { OverviewTab } from '@/components/OverviewTab';
import { FindingDrawer } from '@/components/FindingDrawer';
import { IntakeModal } from '@/components/IntakeModal';
import { NewProjectModal } from '@/components/NewProjectModal';
import { SettingsModal } from '@/components/SettingsModal';
import { LoginScreen } from '@/components/LoginScreen';

const STORAGE_KEY_PROJECTS = 'signal_uxr_workspace_v1';
const STORAGE_KEY_ACTIVE_ID = 'signal_uxr_active_project_v1';
const STORAGE_KEY_AUTH = 'signal_uxr_auth_v1';
const STORAGE_KEY_SETTINGS = 'signal_uxr_settings_v1';

const TABS: ActiveTab[] = [
  'Findings',
  'Empathy Map',
  'AI Synthesis',
  'Final Result',
  'Overview',
];

export default function SignalWorkspace() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(
    INITIAL_PROJECTS[0].id
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>('Findings');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [findingsSearchQuery, setFindingsSearchQuery] = useState('');
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(
    null
  );
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<WorkspaceSettings>(DEFAULT_SETTINGS);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userName, setUserName] = useState('UX Researcher');
  const [userEmail, setUserEmail] = useState('researcher@signal.local');
  const [isHydrated, setIsHydrated] = useState(false);
  const [newFindingIds, setNewFindingIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted state from localStorage on mount
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);
      const savedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      const savedAuth = localStorage.getItem(STORAGE_KEY_AUTH);

      if (savedProjects) {
        const parsed = JSON.parse(savedProjects) as Project[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
          if (savedActiveId && parsed.some((p) => p.id === savedActiveId)) {
            setActiveProjectId(savedActiveId);
          } else {
            setActiveProjectId(parsed[0].id);
          }
        }
      }

      if (savedAuth) {
        const parsedAuth = JSON.parse(savedAuth) as {
          isAuthenticated: boolean;
          userName?: string;
          userEmail?: string;
        };
        setIsAuthenticated(parsedAuth.isAuthenticated);
        if (parsedAuth.userName) setUserName(parsedAuth.userName);
        if (parsedAuth.userEmail) setUserEmail(parsedAuth.userEmail);
      }

      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedSettings) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...(JSON.parse(savedSettings) as Partial<WorkspaceSettings>),
        });
      }
    } catch {
      // Fallback to INITIAL_PROJECTS if localStorage is unavailable or malformed
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeProjectId);
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
      localStorage.setItem(
        STORAGE_KEY_AUTH,
        JSON.stringify({ isAuthenticated, userName, userEmail })
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [
    projects,
    activeProjectId,
    settings,
    isAuthenticated,
    userName,
    userEmail,
    isHydrated,
  ]);

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) || projects[0],
    [projects, activeProjectId]
  );

  const selectedFinding = useMemo(
    () =>
      activeProject.findings.find((f) => f.id === selectedFindingId) || null,
    [activeProject, selectedFindingId]
  );

  const allProjectLabels = useMemo(() => {
    const set = new Set<string>();
    for (const f of activeProject.findings) {
      for (const l of f.labels) {
        set.add(l);
      }
    }
    return Array.from(set);
  }, [activeProject]);

  const existingFolders = useMemo(() => {
    const set = new Set<string>();
    for (const f of activeProject.findings) {
      if (f.folder) set.add(f.folder);
    }
    return Array.from(set);
  }, [activeProject]);

  const findingsCount = activeProject.findings.length;
  const empathyMapCount = useMemo(
    () =>
      activeProject.findings.filter(
        (f) => f.quadrant && f.status !== 'Noise / Archived'
      ).length,
    [activeProject]
  );
  const aiReadyCount = useMemo(
    () =>
      activeProject.findings.filter(
        (f) => f.status === 'Pain Point' || f.status === 'Workaround'
      ).length,
    [activeProject]
  );

  const showToast = (
    message: string,
    actionLabel?: string,
    onAction?: () => void
  ) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, actionLabel, onAction });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const nextCodeStart = useMemo(() => {
    let maxNum = 100;
    for (const p of projects) {
      for (const f of p.findings) {
        const match = f.id.match(/FND-(\d+)/);
        if (match) {
          const n = parseInt(match[1], 10);
          if (n > maxNum) maxNum = n;
        }
      }
    }
    return maxNum + 1;
  }, [projects]);

  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setSelectedFindingId(null);
    setFindingsSearchQuery('');
  };

  const handleUpdateFinding = (
    findingId: string,
    updates: Partial<Finding>
  ) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          findings: proj.findings.map((f) =>
            f.id === findingId ? { ...f, ...updates } : f
          ),
        };
      })
    );

    if (updates.quadrant && activeTab === 'Findings') {
      showToast(
        `${findingId} dipetakan ke Kuadran ${updates.quadrant}`,
        'Lihat Empathy Map →',
        () => {
          setActiveTab('Empathy Map');
          setToast(null);
        }
      );
    } else if (updates.status === 'Raw / Perlu Triage') {
      showToast(`${findingId} dikembalikan ke Raw / Perlu Triage`);
    }
  };

  const handleAddFindings = (newFindings: Finding[]) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          findings: [...newFindings, ...proj.findings],
        };
      })
    );
    const addedIds = new Set(newFindings.map((f) => f.id));
    setNewFindingIds(addedIds);
    setTimeout(() => {
      setNewFindingIds((prev) => {
        const next = new Set(prev);
        for (const id of addedIds) next.delete(id);
        return next;
      });
    }, 8000);
    setActiveTab('Findings');
  };

  const handleUpdateClusters = (clusters: LocalCluster[]) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProject.id ? { ...proj, clusters } : proj
      )
    );
  };

  const handleUpdateBrief = (brief: ProblemBrief | null) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProject.id ? { ...proj, brief } : proj
      )
    );
  };

  const handleUpdateFinalReport = (finalReport: FinalReport | null) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProject.id ? { ...proj, finalReport } : proj
      )
    );
  };

  const handleSaveSettings = (newSettings: WorkspaceSettings) => {
    setSettings(newSettings);
    showToast('Pengaturan workspace berhasil disimpan');
  };

  const handleClearAICache = () => {
    setProjects((prev) =>
      prev.map((proj) => ({ ...proj, brief: null, finalReport: null }))
    );
    setSettings((prev) => ({ ...prev, cacheHits: 0 }));
    showToast('Cache AI lintas project berhasil dibersihkan');
  };

  const totalTokensUsed = useMemo(
    () =>
      projects.reduce(
        (sum, p) =>
          sum + (p.brief?.tokensUsed || 0) + (p.finalReport?.tokensUsed || 0),
        0
      ),
    [projects]
  );

  const handleCreateProject = (name: string, description: string) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name,
      description,
      createdAt: new Date().toISOString().slice(0, 10),
      findings: [],
      clusters: [],
      brief: null,
    };
    setProjects((prev) => [...prev, newProj]);
    setActiveProjectId(newProj.id);
    setActiveTab('Findings');
    setSelectedFindingId(null);
  };

  const handleLogin = (name: string, email: string) => {
    setUserName(name);
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setSelectedFindingId(null);
    setIsAuthenticated(false);
  };

  const handleResetDemoData = () => {
    setProjects(INITIAL_PROJECTS);
    setActiveProjectId(INITIAL_PROJECTS[0].id);
    setActiveTab('Findings');
    setSelectedFindingId(null);
    setFindingsSearchQuery('');
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => {
      if (prev.length <= 1) return prev;
      const remaining = prev.filter((p) => p.id !== projectId);
      if (activeProjectId === projectId && remaining.length > 0) {
        setActiveProjectId(remaining[0].id);
        setSelectedFindingId(null);
        setFindingsSearchQuery('');
      }
      return remaining;
    });
  };

  if (!isHydrated) {
    return <div className="min-h-screen w-screen bg-white" />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-gray-900">
      {/* Left Sidebar */}
      <Sidebar
        projects={projects}
        activeProjectId={activeProject.id}
        sidebarSearch={sidebarSearch}
        userName={userName}
        userEmail={userEmail}
        settings={settings}
        onSidebarSearchChange={setSidebarSearch}
        onSelectProject={handleSelectProject}
        onOpenNewProjectModal={() => setIsNewProjectOpen(true)}
        onDeleteProject={handleDeleteProject}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
        onResetDemoData={handleResetDemoData}
      />

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col min-w-0 bg-white h-screen overflow-hidden">
        {/* Top Header */}
        <header className="border-b border-[#E5E7EB] bg-white shrink-0">
          {/* Breadcrumb & Primary Action */}
          <div className="h-13 px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm min-w-0">
              <PanelLeft className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-400 font-medium">Projects</span>
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              <span className="font-semibold text-gray-900 truncate flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate">{activeProject.name}</span>
              </span>
            </div>

            <button
              onClick={() => setIsIntakeOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Ambil Data</span>
            </button>
          </div>

          {/* 4 Navigation Tabs */}
          <div className="px-6 flex items-center gap-6">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              const badgeCount =
                tab === 'Findings'
                  ? findingsCount
                  : tab === 'Empathy Map'
                  ? empathyMapCount
                  : tab === 'AI Synthesis'
                  ? aiReadyCount
                  : null;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2.5 pt-1 text-[13.5px] border-b-2 transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                    isActive
                      ? 'border-blue-600 text-gray-900 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <span>{tab}</span>
                  {badgeCount !== null && (
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full tabular-nums leading-none ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'bg-gray-100 text-gray-500 font-medium'
                      }`}
                    >
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </header>

        {/* Tab Body */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {activeTab === 'Findings' && (
            <FindingsTab
              findings={activeProject.findings}
              newFindingIds={newFindingIds}
              empathyMapCount={empathyMapCount}
              searchQuery={findingsSearchQuery}
              onSearchQueryChange={setFindingsSearchQuery}
              onUpdateFinding={handleUpdateFinding}
              onSelectFinding={(f) => setSelectedFindingId(f.id)}
              onOpenIntakeModal={() => setIsIntakeOpen(true)}
              onGoToEmpathyMap={() => setActiveTab('Empathy Map')}
            />
          )}

          {activeTab === 'Empathy Map' && (
            <EmpathyMapTab
              findings={activeProject.findings}
              aiReadyCount={aiReadyCount}
              onUpdateFinding={handleUpdateFinding}
              onSelectFinding={(f) => setSelectedFindingId(f.id)}
              onGoToFindings={() => setActiveTab('Findings')}
              onGoToAISynthesis={() => setActiveTab('AI Synthesis')}
            />
          )}

          {activeTab === 'AI Synthesis' && (
            <AISynthesisTab
              projectName={activeProject.name}
              findings={activeProject.findings}
              clusters={activeProject.clusters}
              brief={activeProject.brief}
              settings={settings}
              onUpdateClusters={handleUpdateClusters}
              onUpdateBrief={handleUpdateBrief}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {activeTab === 'Final Result' && (
            <FinalResultTab
              project={activeProject}
              settings={settings}
              onUpdateFinalReport={handleUpdateFinalReport}
              onGoToAISynthesis={() => setActiveTab('AI Synthesis')}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {activeTab === 'Overview' && (
            <OverviewTab
              projectName={activeProject.name}
              projectDescription={activeProject.description}
              findings={activeProject.findings}
              brief={activeProject.brief}
              finalReport={activeProject.finalReport || null}
              onGoToFindings={(filterTheme) => {
                setFindingsSearchQuery(filterTheme || '');
                setActiveTab('Findings');
              }}
              onGoToEmpathyMap={() => setActiveTab('Empathy Map')}
              onGoToAISynthesis={() => setActiveTab('AI Synthesis')}
              onGoToFinalResult={() => setActiveTab('Final Result')}
              onOpenIntakeModal={() => setIsIntakeOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Right Side Drawer */}
      <FindingDrawer
        finding={selectedFinding}
        allProjectLabels={allProjectLabels}
        onClose={() => setSelectedFindingId(null)}
        onUpdateFinding={handleUpdateFinding}
      />

      {/* Modals */}
      <IntakeModal
        isOpen={isIntakeOpen}
        projectName={activeProject.name}
        existingFolders={existingFolders}
        nextCodeStart={nextCodeStart}
        enabledSources={settings.enabledSources}
        onClose={() => setIsIntakeOpen(false)}
        onAddFindings={handleAddFindings}
      />

      {/* Bottom-Right Instant Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gray-900 text-white text-xs shadow-lg border border-gray-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
          {toast.actionLabel && toast.onAction && (
            <button
              type="button"
              onClick={toast.onAction}
              className="text-blue-300 hover:text-blue-200 font-semibold underline-offset-2 hover:underline cursor-pointer shrink-0"
            >
              {toast.actionLabel}
            </button>
          )}
        </div>
      )}

      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        totalTokensUsed={totalTokensUsed}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSettings={handleSaveSettings}
        onClearAICache={handleClearAICache}
      />
    </div>
  );
}
