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
  | 'Noise / Archived';

export type EmpathyQuadrant = 'Says' | 'Thinks' | 'Feels' | 'Does';

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
}

export interface LocalCluster {
  id: string;
  theme: string;
  description: string;
  findingIds: string[];
  frequency: number;
  selected: boolean;
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

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  findings: Finding[];
  clusters: LocalCluster[];
  brief: ProblemBrief | null;
  finalReport?: FinalReport | null;
}

export type ActiveTab =
  | 'Findings'
  | 'Empathy Map'
  | 'AI Synthesis'
  | 'Final Result'
  | 'Overview';
