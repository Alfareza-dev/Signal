export type SourcePlatform =
  | 'X / Twitter'
  | 'Instagram'
  | 'Play Store'
  | 'Jurnal (OpenAlex)'
  | 'CSV / Manual';

export type FindingStatus =
  | 'Raw / Perlu Triage'
  | 'Pain Point'
  | 'Workaround'
  | 'Positif / Delighter'
  | 'Noise / Archived';

export type EmpathyQuadrant = 'Says' | 'Thinks' | 'Feels' | 'Does';

export type ScoringParameterType =
  | 'keyword'
  | 'interactions'
  | 'verified'
  | 'media'
  | 'direct_tag'
  | 'repeat_reporter';

export interface ScoringParameter {
  id: string;
  type: ScoringParameterType;
  title: string;
  description: string;
  points: number;
  active: boolean;
  keywords?: string[];
  minInteractions?: number;
}

export interface ThresholdConfig {
  scoreThreshold: number;
  parameters: ScoringParameter[];
}

export interface MonitoredAccount {
  id: string;
  handle: string;
  platform: SourcePlatform;
  category: string;
  active: boolean;
  lastChecked: string;
}

export interface Finding {
  id: string; // e.g., "FND-101"
  quote: string;
  author: string;
  source: SourcePlatform;
  referenceUrl: string;
  createdAt: string;
  status: FindingStatus;
  folder: string;
  labels: string[];
  quadrant?: EmpathyQuadrant;
  interactions?: number;
  likes?: number;
  shares?: number;
  comments?: number;
  isVerified?: boolean;
  hasMedia?: boolean;
  isDirectTag?: boolean;
  mentionedAccount?: string;
}

export interface LocalCluster {
  id: string;
  theme: string;
  description: string;
  findingIds: string[];
  frequency: number;
  selected: boolean;
  color?: 'coral' | 'amber' | 'lavender' | 'mint' | 'rose';
  isManual?: boolean;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
  tokensUsed?: number;
}

export type MoscowCategory =
  | 'Must-Have'
  | 'Should-Have'
  | 'Could-Have'
  | "Won't-Have";

export interface MoscowItem {
  id: string;
  title: string;
  sourceType: 'Cluster' | 'Rekomendasi' | 'Manual';
  category: MoscowCategory;
  notes?: string;
}

export interface ActionComment {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
  tokensUsed?: number;
}

export interface ActionRecommendation {
  id: string;
  title: string;
  impact: 'Tinggi' | 'Sedang' | 'Rendah';
  effort: 'Rendah' | 'Sedang' | 'Tinggi';
  comments: ActionComment[];
}

export interface StickyNote {
  id: string;
  quadrant: EmpathyQuadrant;
  text: string;
  color: 'peach' | 'butter' | 'lavender' | 'mint';
  createdAt: string;
}

export interface ProblemBrief {
  id: string;
  generatedAt: string;
  clusterThemes: string[];
  problemStatement: string;
  dominantClassification: 'Pain Point' | 'Workaround — Goldmine Ide Fitur';
  impactMatrix: {
    reach: number;
    severity: number;
    virality: number;
  };
  impactScore: string;
  impactLevel: 'Critical' | 'High' | 'Medium';
  evidenceQuotes: {
    id: string;
    quote: string;
    source: SourcePlatform;
  }[];
  recommendation: string;
  tokensUsed: number;
  cached: boolean;
}

export interface FinalReport {
  id: string;
  generatedAt: string;
  mode: 'ai' | 'local';
  problemStatement: string;
  dominantClassification: 'Pain Point' | 'Workaround — Goldmine Ide Fitur';
  impactMatrix: {
    reach: number;
    severity: number;
    virality: number;
  };
  impactScore: string;
  impactLevel: 'Critical' | 'High' | 'Medium';
  empathySummary: {
    says: string[];
    thinks: string[];
    feels: string[];
    does: string[];
  };
  evidenceQuotes: {
    id: string;
    quote: string;
    source: SourcePlatform;
  }[];
  recommendations: string[];
  tokensUsed: number;
}

export interface WorkspaceSettings {
  strictZeroAI: boolean;
  localClusteringModel: 'minilm-l12-v2' | 'tfidf-fast';
  llmProvider: 'gemini-flash-lite' | 'gpt-4o-mini' | 'ollama-qwen';
  apiKey: string;
  ollamaBaseUrl: string;
  monthlyTokenCap: number;
  maxQuotesPerCall: number;
  enableCache: boolean;
  cacheHits: number;
  enabledSources: {
    twitter: boolean;
    instagram: boolean;
    playStore: boolean;
    openAlex: boolean;
  };
  maxItemsPerScrape: number;
  proxyEndpoint: string;
}

export interface FarmingSchedule {
  enabled: boolean;
  date: string;
  time: string;
  frequency: 'Sekali' | 'Harian' | 'Mingguan';
}

export interface FarmingPreset {
  id: string;
  name: string;
  queryPreview: string;
  keywords: string[];
  operator: 'AND' | 'OR';
  folder: string;
  schedule: FarmingSchedule;
  savedAt: string;
}

export interface ResearchVersion {
  id: string;
  label: string;
  keywordQuery: string;
  createdAt: string;
  notes: string;
  schedule?: FarmingSchedule;
  findings: Finding[];
  clusters: LocalCluster[];
  brief: ProblemBrief | null;
  finalReport?: FinalReport | null;
  aiObjective?: string;
  aiExtraContext?: string;
  aiChatHistory?: AIChatMessage[];
  moscowItems?: MoscowItem[];
  actionItems?: ActionRecommendation[];
  stickyNotes?: StickyNote[];
  researchNotes?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  activeVersionId: string;
  versions: ResearchVersion[];
  farmingPresets?: FarmingPreset[];
}

export type ActiveTab =
  | 'Overview'
  | 'Findings'
  | 'Clustering & AI'
  | 'Prioritas & Aksi'
  | 'Empathy Map & Final';
