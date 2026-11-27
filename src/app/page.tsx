'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  GitBranch,
  History,
  LayoutGrid,
  Plus,
  PanelLeft,
  RefreshCw,
} from 'lucide-react';
import {
  DEFAULT_SETTINGS,
  DEFAULT_THRESHOLD_CONFIG,
  INITIAL_MONITORED_ACCOUNTS,
  INITIAL_PROJECTS,
  generateMockIntakeFindings,
} from '@/data/mockData';
import {
  ActiveTab,
  AIChatMessage,
  ActionRecommendation,
  FarmingPreset,
  FarmingSchedule,
  FinalReport,
  Finding,
  LocalCluster,
  MonitoredAccount,
  MoscowItem,
  ProblemBrief,
  Project,
  ResearchVersion,
  StickyNote,
  ThresholdConfig,
  WorkspaceSettings,
} from '@/types/problemhub';
import { AdminView, Sidebar } from '@/components/Sidebar';
import { FindingsTab } from '@/components/FindingsTab';
import { AISynthesisTab } from '@/components/AISynthesisTab';
import { PriorityActionTab } from '@/components/PriorityActionTab';
import { FinalResultTab } from '@/components/FinalResultTab';
import { OverviewTab } from '@/components/OverviewTab';
import { ThresholdPage } from '@/components/ThresholdPage';
import { MonitoredAccountsView } from '@/components/MonitoredAccountsView';
import { SiggyMascot } from '@/components/SiggyMascot';
import { FindingDrawer } from '@/components/FindingDrawer';
import { IntakeModal } from '@/components/IntakeModal';
import { NewProjectModal } from '@/components/NewProjectModal';
import { NewVersionModal } from '@/components/NewVersionModal';
import { VersionHistoryDrawer } from '@/components/VersionHistoryDrawer';
import { SettingsModal } from '@/components/SettingsModal';
import { LoginScreen } from '@/components/LoginScreen';

const STORAGE_KEY_PROJECTS = 'signal_uxr_workspace_v3';
const STORAGE_KEY_ACTIVE_ID = 'signal_uxr_active_project_v1';
const STORAGE_KEY_AUTH = 'signal_uxr_auth_v2';
const STORAGE_KEY_SETTINGS = 'signal_uxr_settings_v1';
const STORAGE_KEY_THRESHOLD = 'signal_uxr_threshold_v1';
const STORAGE_KEY_ACCOUNTS = 'signal_uxr_accounts_v1';

const TABS: ActiveTab[] = [
  'Overview',
  'Findings',
  'Clustering & AI',
  'Prioritas & Aksi',
  'Empathy Map & Final',
];

export default function SignalWorkspace() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(
    INITIAL_PROJECTS[0].id
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>('Overview');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [findingsSearchQuery, setFindingsSearchQuery] = useState('');
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(
    null
  );
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isNewVersionOpen, setIsNewVersionOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<WorkspaceSettings>(DEFAULT_SETTINGS);
  const [thresholdConfig, setThresholdConfig] = useState<ThresholdConfig>(
    DEFAULT_THRESHOLD_CONFIG
  );
  const [monitoredAccounts, setMonitoredAccounts] = useState<
    MonitoredAccount[]
  >(INITIAL_MONITORED_ACCOUNTS);
  const [activeAdminView, setActiveAdminView] = useState<AdminView>(null);
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

      const savedThreshold = localStorage.getItem(STORAGE_KEY_THRESHOLD);
      if (savedThreshold) {
        setThresholdConfig(JSON.parse(savedThreshold) as ThresholdConfig);
      }

      const savedAccounts = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      if (savedAccounts) {
        setMonitoredAccounts(JSON.parse(savedAccounts) as MonitoredAccount[]);
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
        STORAGE_KEY_THRESHOLD,
        JSON.stringify(thresholdConfig)
      );
      localStorage.setItem(
        STORAGE_KEY_ACCOUNTS,
        JSON.stringify(monitoredAccounts)
      );
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
    thresholdConfig,
    monitoredAccounts,
    isAuthenticated,
    userName,
    userEmail,
    isHydrated,
  ]);

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) || projects[0],
    [projects, activeProjectId]
  );

  const activeVersion = useMemo(
    () =>
      activeProject.versions.find(
        (v) => v.id === activeProject.activeVersionId
      ) || activeProject.versions[0],
    [activeProject]
  );

  const selectedFinding = useMemo(
    () =>
      activeVersion.findings.find((f) => f.id === selectedFindingId) || null,
    [activeVersion, selectedFindingId]
  );

  const allProjectLabels = useMemo(() => {
    const set = new Set<string>();
    for (const f of activeVersion.findings) {
      for (const l of f.labels) {
        set.add(l);
      }
    }
    return Array.from(set);
  }, [activeVersion]);

  const existingFolders = useMemo(() => {
    const set = new Set<string>();
    for (const f of activeVersion.findings) {
      if (f.folder) set.add(f.folder);
    }
    return Array.from(set);
  }, [activeVersion]);

  const findingsCount = activeVersion.findings.length;
  const empathyMapCount = useMemo(
    () =>
      activeVersion.findings.filter(
        (f) => f.quadrant && f.status !== 'Noise / Archived'
      ).length,
    [activeVersion]
  );
  const aiReadyCount = useMemo(
    () =>
      activeVersion.findings.filter(
        (f) => f.status === 'Pain Point' || f.status === 'Workaround'
      ).length,
    [activeVersion]
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
      for (const v of p.versions) {
        for (const f of v.findings) {
          const match = f.id.match(/FND-(\d+)/);
          if (match) {
            const n = parseInt(match[1], 10);
            if (n > maxNum) maxNum = n;
          }
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

  const updateActiveVersion = (
    updater: (ver: ResearchVersion) => ResearchVersion
  ) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          versions: proj.versions.map((v) =>
            v.id === activeVersion.id ? updater(v) : v
          ),
        };
      })
    );
  };

  const handleUpdateFinding = (
    findingId: string,
    updates: Partial<Finding>
  ) => {
    updateActiveVersion((ver) => ({
      ...ver,
      findings: ver.findings.map((f) =>
        f.id === findingId ? { ...f, ...updates } : f
      ),
    }));

    if (updates.quadrant && activeTab === 'Findings') {
      showToast(
        `${findingId} dipetakan ke Kuadran ${updates.quadrant}`,
        'Lihat Empathy Map →',
        () => {
          setActiveTab('Empathy Map & Final');
          setToast(null);
        }
      );
    } else if (updates.status === 'Raw / Perlu Triage') {
      showToast(`${findingId} dikembalikan ke Raw / Perlu Triage`);
    }
  };

  const handleAddFindings = (
    newFindings: Finding[],
    meta?: { keywordQuery: string; schedule?: FarmingSchedule }
  ) => {
    updateActiveVersion((ver) => ({
      ...ver,
      keywordQuery: meta?.keywordQuery || ver.keywordQuery,
      schedule: meta?.schedule ?? ver.schedule,
      findings: [...newFindings, ...ver.findings],
    }));
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
    showToast(
      `Berhasil menarik ${newFindings.length} temuan baru ke ${activeVersion.label}`
    );
  };

  const handleReScrape = () => {
    const cleanKeyword =
      activeVersion.keywordQuery.replace(/["()]/g, '').split(/\s+(?:AND|OR)\s+/i)[0] ||
      activeProject.name;
    const generated = generateMockIntakeFindings(
      'all',
      cleanKeyword.trim(),
      existingFolders[0] || 'Inbox / Riset Baru',
      '',
      nextCodeStart,
      settings.enabledSources
    );
    handleAddFindings(generated);
  };

  const handleSelectVersion = (versionId: string) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProject.id
          ? { ...proj, activeVersionId: versionId }
          : proj
      )
    );
    setSelectedFindingId(null);
    setFindingsSearchQuery('');
    const target = activeProject.versions.find((v) => v.id === versionId);
    if (target) {
      showToast(`Beralih ke versi ${target.label}`);
    }
  };

  const handleCreateVersion = ({
    keywordQuery,
    notes,
    copyFindings,
  }: {
    keywordQuery: string;
    notes: string;
    copyFindings: boolean;
  }) => {
    const nextNum = activeProject.versions.length + 1;
    const newVersion: ResearchVersion = {
      id: `v${nextNum}-${Date.now().toString().slice(-4)}`,
      label: `v${nextNum}`,
      keywordQuery,
      createdAt: new Date().toISOString().slice(0, 10),
      notes,
      findings: copyFindings
        ? activeVersion.findings.map((f) => ({ ...f }))
        : [],
      clusters: [],
      brief: null,
      finalReport: null,
    };

    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProject.id
          ? {
              ...proj,
              activeVersionId: newVersion.id,
              versions: [...proj.versions, newVersion],
            }
          : proj
      )
    );
    setSelectedFindingId(null);
    setActiveTab('Findings');
    showToast(`Versi ${newVersion.label} berhasil dibuat & diaktifkan`);
  };

  const handleSavePreset = (preset: FarmingPreset) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProject.id
          ? {
              ...proj,
              farmingPresets: [preset, ...(proj.farmingPresets || [])],
            }
          : proj
      )
    );
    showToast(`Preset "${preset.name}" disimpan ke Koleksi Farming`);
  };

  const handleUpdateClusters = (clusters: LocalCluster[]) => {
    updateActiveVersion((ver) => ({ ...ver, clusters }));
  };

  const handleUpdateBrief = (brief: ProblemBrief | null) => {
    updateActiveVersion((ver) => ({ ...ver, brief }));
  };

  const handleUpdateFinalReport = (finalReport: FinalReport | null) => {
    updateActiveVersion((ver) => ({ ...ver, finalReport }));
  };

  const handleSaveSettings = (newSettings: WorkspaceSettings) => {
    setSettings(newSettings);
    showToast('Pengaturan workspace berhasil disimpan');
  };

  const handleClearAICache = () => {
    setProjects((prev) =>
      prev.map((proj) => ({
        ...proj,
        versions: proj.versions.map((v) => ({
          ...v,
          brief: null,
          finalReport: null,
        })),
      }))
    );
    setSettings((prev) => ({ ...prev, cacheHits: 0 }));
    showToast('Cache AI lintas project berhasil dibersihkan');
  };

  const totalTokensUsed = useMemo(
    () =>
      projects.reduce(
        (sum, p) =>
          sum +
          p.versions.reduce((vSum, v) => {
            const chatTokens = (v.aiChatHistory || []).reduce(
              (cSum, m) => cSum + (m.tokensUsed || 0),
              0
            );
            const actionCommentTokens = (v.actionItems || []).reduce(
              (aSum, act) =>
                aSum +
                act.comments.reduce(
                  (cmSum, c) => cmSum + (c.tokensUsed || 0),
                  0
                ),
              0
            );
            return (
              vSum +
              (v.brief?.tokensUsed || 0) +
              (v.finalReport?.tokensUsed || 0) +
              chatTokens +
              actionCommentTokens
            );
          }, 0),
        0
      ),
    [projects]
  );

  const handleCreateProject = (name: string, description: string) => {
    const initialVersionId = `v1-${Date.now().toString().slice(-4)}`;
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name,
      description,
      createdAt: new Date().toISOString().slice(0, 10),
      activeVersionId: initialVersionId,
      farmingPresets: [],
      versions: [
        {
          id: initialVersionId,
          label: 'v1',
          keywordQuery: name,
          createdAt: new Date().toISOString().slice(0, 10),
          notes: description || 'Versi awal riset',
          findings: [],
          clusters: [],
          brief: null,
          finalReport: null,
        },
      ],
    };
    setProjects((prev) => [...prev, newProj]);
    setActiveProjectId(newProj.id);
    setActiveTab('Findings');
    setSelectedFindingId(null);
  };

  const handleLogin = (name: string, email: string) => {
    setUserName(name);
    setUserEmail(email);
    setActiveAdminView(null);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setSelectedFindingId(null);
    setActiveAdminView(null);
    setIsAuthenticated(false);
  };

  const handleResetDemoData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_PROJECTS);
      localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
      localStorage.removeItem(STORAGE_KEY_THRESHOLD);
      localStorage.removeItem(STORAGE_KEY_ACCOUNTS);
    } catch {
      // Ignore storage errors
    }
    setProjects(INITIAL_PROJECTS);
    setActiveProjectId(INITIAL_PROJECTS[0].id);
    setSettings(DEFAULT_SETTINGS);
    setThresholdConfig(DEFAULT_THRESHOLD_CONFIG);
    setMonitoredAccounts(INITIAL_MONITORED_ACCOUNTS);
    setActiveAdminView(null);
    setActiveTab('Overview');
    setSelectedFindingId(null);
    setFindingsSearchQuery('');
    showToast('Workspace berhasil dikembalikan ke data demo awal');
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
    <div className="flex h-screen w-screen overflow-hidden bg-[#FDECE8]/60 p-3 gap-3 text-[#2D213A] print-reset-shell">
      {/* Left Floating Sidebar */}
      <Sidebar
        projects={projects}
        activeProjectId={activeProject.id}
        activeAdminView={activeAdminView}
        sidebarSearch={sidebarSearch}
        userName={userName}
        userEmail={userEmail}
        settings={settings}
        onSidebarSearchChange={setSidebarSearch}
        onSelectProject={handleSelectProject}
        onSelectAdminView={setActiveAdminView}
        onOpenNewProjectModal={() => setIsNewProjectOpen(true)}
        onDeleteProject={handleDeleteProject}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
        onResetDemoData={handleResetDemoData}
      />

      {/* Main Floating Canvas */}
      <main className="flex-1 flex flex-col min-w-0 rounded-3xl bg-white border border-[#F4DFDA] shadow-[0_8px_30px_rgb(180,110,100,0.08)] overflow-hidden print-reset-main">
        {/* Top Header */}
        <header className="border-b border-[#F2E4E0] bg-white shrink-0 print:hidden">
          {/* Breadcrumb, Siggy Welcome Pill & Primary Action */}
          <div className="h-14 px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm min-w-0">
              <PanelLeft className="w-4 h-4 text-[#7A6B84] shrink-0" />
              <span className="text-[#7A6B84] font-medium">
                {activeAdminView ? 'Konfigurasi' : 'Projects'}
              </span>
              <ChevronRight className="w-4 h-4 text-[#CBBFB0] shrink-0" />
              <span className="font-bold text-[#2D213A] truncate flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-[#FF7B7B] shrink-0" />
                <span className="truncate">
                  {activeAdminView === 'threshold'
                    ? 'Threshold & Parameter'
                    : activeAdminView === 'accounts'
                    ? 'Akun Pantauan'
                    : activeProject.name}
                </span>
              </span>

              {/* Version Switcher & Schedule Indicator */}
              {activeAdminView === null && (
                <div className="hidden md:flex items-center gap-1.5 ml-2 pl-2.5 border-l border-[#F2E4E0]">
                  <div className="inline-flex items-center rounded-xl bg-[#FFF7F5] border border-[#F2E4E0] p-0.5">
                    {activeProject.versions.map((ver) => {
                      const isCurr = ver.id === activeVersion.id;
                      return (
                        <button
                          key={ver.id}
                          type="button"
                          onClick={() => handleSelectVersion(ver.id)}
                          title={`${ver.label}: ${ver.keywordQuery}`}
                          className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            isCurr
                              ? 'bg-[#9B85D6] text-white shadow-2xs'
                              : 'text-[#7A6B84] hover:text-[#2D213A]'
                          }`}
                        >
                          {ver.label}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNewVersionOpen(true)}
                    title="Simpan Versi Baru"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-[#F4F0FB] hover:bg-[#EAE2F8] text-[#6953A8] text-[11px] font-bold border border-[#DFD5F5] transition-colors cursor-pointer"
                  >
                    <GitBranch className="w-3 h-3" />
                    <span className="hidden lg:inline">+ Versi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsVersionHistoryOpen(true)}
                    title="Riwayat Versi"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-white hover:bg-[#FFF7F5] text-[#5F506B] text-[11px] font-semibold border border-[#F2E4E0] transition-colors cursor-pointer"
                  >
                    <History className="w-3 h-3" />
                    <span className="hidden xl:inline">Riwayat</span>
                  </button>
                  {activeVersion.schedule?.enabled && (
                    <span
                      title={`Auto-Farming ${activeVersion.schedule.frequency} pukul ${activeVersion.schedule.time}`}
                      className="hidden 2xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10.5px] font-semibold"
                    >
                      <CalendarClock className="w-3 h-3" />
                      {activeVersion.schedule.frequency} · {activeVersion.schedule.time}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="hidden 2xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0EA] border border-[#F2E4E0]">
                <SiggyMascot variant="avatar" size={24} />
                <span className="text-[11px] font-semibold text-[#2D213A]">
                  Siggy siap bantu riset!
                </span>
              </div>

              {activeAdminView === null && (
                <>
                  <button
                    type="button"
                    onClick={handleReScrape}
                    title={`Ambil ulang data untuk ${activeVersion.keywordQuery}`}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#FFF7F5] hover:bg-[#FFEAE3] border border-[#F2E4E0] border-b-3 border-b-[#E5CFC9] active:border-b-0 active:translate-y-0.5 text-[#2D213A] text-[12px] font-bold transition-all cursor-pointer shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#9B85D6]" />
                    <span>Ambil Ulang</span>
                  </button>
                  <button
                    onClick={() => setIsIntakeOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FF7B7B] hover:bg-[#F26666] border-b-4 border-[#DF5656] active:border-b-0 active:translate-y-1 text-white text-[13px] font-bold shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ambil Data</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 5 Navigation Tabs (hidden when viewing Admin pages) */}
          {activeAdminView === null && (
            <div className="px-6 flex items-center gap-6">
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                const badgeCount =
                  tab === 'Findings'
                    ? findingsCount
                    : tab === 'Clustering & AI'
                    ? aiReadyCount
                    : tab === 'Prioritas & Aksi'
                    ? (activeVersion.moscowItems?.length ?? 0) || null
                    : tab === 'Empathy Map & Final'
                    ? empathyMapCount
                    : null;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2.5 pt-1 text-[13.5px] border-b-2 transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                      isActive
                        ? 'border-[#FF7B7B] text-[#2D213A] font-bold'
                        : 'border-transparent text-[#7A6B84] hover:text-[#2D213A]'
                    }`}
                  >
                    <span>{tab}</span>
                    {badgeCount !== null && (
                      <span
                        className={`text-[11px] px-1.5 py-0.5 rounded-full tabular-nums leading-none ${
                          isActive
                            ? 'bg-[#FFF0EA] text-[#FF7B7B] font-bold'
                            : 'bg-[#FFF7F5] text-[#7A6B84] font-medium'
                        }`}
                      >
                        {badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </header>

        {/* Tab / Admin View Body */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {activeAdminView === 'threshold' ? (
            <ThresholdPage
              config={thresholdConfig}
              onUpdateConfig={setThresholdConfig}
            />
          ) : activeAdminView === 'accounts' ? (
            <MonitoredAccountsView
              accounts={monitoredAccounts}
              onUpdateAccounts={setMonitoredAccounts}
            />
          ) : (
            <>
              {activeTab === 'Overview' && (
                <OverviewTab
                  projectName={`${activeProject.name} · ${activeVersion.label}`}
                  projectDescription={activeProject.description}
                  versionLabel={activeVersion.label}
                  keywordQuery={activeVersion.keywordQuery}
                  schedule={activeVersion.schedule}
                  researchNotes={activeVersion.researchNotes || ''}
                  findings={activeVersion.findings}
                  brief={activeVersion.brief}
                  finalReport={activeVersion.finalReport || null}
                  chatTokensUsed={
                    (activeVersion.aiChatHistory || []).reduce(
                      (s, m) => s + (m.tokensUsed || 0),
                      0
                    ) +
                    (activeVersion.actionItems || []).reduce(
                      (s, a) =>
                        s +
                        a.comments.reduce(
                          (cs, c) => cs + (c.tokensUsed || 0),
                          0
                        ),
                      0
                    )
                  }
                  onUpdateResearchNotes={(notes: string) =>
                    updateActiveVersion((ver) => ({
                      ...ver,
                      researchNotes: notes,
                    }))
                  }
                  onGoToFindings={(filterTheme) => {
                    setFindingsSearchQuery(filterTheme || '');
                    setActiveTab('Findings');
                  }}
                  onGoToEmpathyMap={() => setActiveTab('Empathy Map & Final')}
                  onGoToAISynthesis={() => setActiveTab('Clustering & AI')}
                  onGoToFinalResult={() => setActiveTab('Empathy Map & Final')}
                  onOpenIntakeModal={() => setIsIntakeOpen(true)}
                />
              )}

              {activeTab === 'Findings' && (
                <FindingsTab
                  findings={activeVersion.findings}
                  newFindingIds={newFindingIds}
                  empathyMapCount={empathyMapCount}
                  searchQuery={findingsSearchQuery}
                  thresholdConfig={thresholdConfig}
                  monitoredAccounts={monitoredAccounts}
                  onSearchQueryChange={setFindingsSearchQuery}
                  onUpdateFinding={handleUpdateFinding}
                  onSelectFinding={(f) => setSelectedFindingId(f.id)}
                  onOpenIntakeModal={() => setIsIntakeOpen(true)}
                  onGoToEmpathyMap={() => setActiveTab('Empathy Map & Final')}
                />
              )}

              {activeTab === 'Clustering & AI' && (
                <AISynthesisTab
                  projectName={`${activeProject.name} (${activeVersion.label})`}
                  findings={activeVersion.findings}
                  clusters={activeVersion.clusters}
                  brief={activeVersion.brief}
                  settings={settings}
                  thresholdConfig={thresholdConfig}
                  aiObjective={activeVersion.aiObjective || ''}
                  aiExtraContext={activeVersion.aiExtraContext || ''}
                  aiChatHistory={activeVersion.aiChatHistory || []}
                  onUpdateClusters={handleUpdateClusters}
                  onUpdateBrief={handleUpdateBrief}
                  onUpdateAiObjective={(val: string) =>
                    updateActiveVersion((ver) => ({ ...ver, aiObjective: val }))
                  }
                  onUpdateAiExtraContext={(val: string) =>
                    updateActiveVersion((ver) => ({
                      ...ver,
                      aiExtraContext: val,
                    }))
                  }
                  onUpdateAiChatHistory={(msgs: AIChatMessage[]) =>
                    updateActiveVersion((ver) => ({
                      ...ver,
                      aiChatHistory: msgs,
                    }))
                  }
                  onOpenSettings={() => setIsSettingsOpen(true)}
                />
              )}

              {activeTab === 'Prioritas & Aksi' && (
                <PriorityActionTab
                  projectName={activeProject.name}
                  version={activeVersion}
                  settings={settings}
                  onUpdateMoscowItems={(items: MoscowItem[]) =>
                    updateActiveVersion((ver) => ({
                      ...ver,
                      moscowItems: items,
                    }))
                  }
                  onUpdateActionItems={(items: ActionRecommendation[]) =>
                    updateActiveVersion((ver) => ({
                      ...ver,
                      actionItems: items,
                    }))
                  }
                  onOpenSettings={() => setIsSettingsOpen(true)}
                />
              )}

              {activeTab === 'Empathy Map & Final' && (
                <FinalResultTab
                  projectName={activeProject.name}
                  version={activeVersion}
                  settings={settings}
                  onUpdateFinalReport={handleUpdateFinalReport}
                  onUpdateStickyNotes={(notes: StickyNote[]) =>
                    updateActiveVersion((ver) => ({
                      ...ver,
                      stickyNotes: notes,
                    }))
                  }
                  onUpdateResearchNotes={(notes: string) =>
                    updateActiveVersion((ver) => ({
                      ...ver,
                      researchNotes: notes,
                    }))
                  }
                  onGoToAISynthesis={() => setActiveTab('Clustering & AI')}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                />
              )}
            </>
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
        projectName={`${activeProject.name} (${activeVersion.label})`}
        existingFolders={existingFolders}
        nextCodeStart={nextCodeStart}
        enabledSources={settings.enabledSources}
        farmingPresets={activeProject.farmingPresets || []}
        defaultSchedule={activeVersion.schedule}
        onClose={() => setIsIntakeOpen(false)}
        onAddFindings={handleAddFindings}
        onSavePreset={handleSavePreset}
      />

      <NewVersionModal
        isOpen={isNewVersionOpen}
        onClose={() => setIsNewVersionOpen(false)}
        nextLabel={`v${activeProject.versions.length + 1}`}
        projectName={activeProject.name}
        defaultKeyword={activeVersion.keywordQuery}
        onCreateVersion={handleCreateVersion}
      />

      <VersionHistoryDrawer
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
        projectName={activeProject.name}
        versions={activeProject.versions}
        activeVersionId={activeVersion.id}
        onSelectVersion={handleSelectVersion}
        onOpenNewVersionModal={() => setIsNewVersionOpen(true)}
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
              className="text-[#FF9E9E] hover:text-[#FFD0D0] font-semibold underline-offset-2 hover:underline cursor-pointer shrink-0"
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
