export type ToolCategory = "writing" | "design" | "dev" | "research" | "pm-crm";

export type Niche =
  | "writer"
  | "designer"
  | "developer"
  | "marketer"
  | "researcher"
  | "pm";

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  niches: Niche[];
  skills: string[];
  roiScore: number;
  pricing: "free" | "freemium" | "paid";
  oneLiner: string;
  whyTemplates: Record<string, string> & { default: string };
  url: string;
}

export interface ToolsDataset {
  version: string;
  tools: Tool[];
}

export interface RadarInput {
  niche: Niche;
  skills: string[];
  alreadyUsing: string[];
}

export interface ScoreBreakdown {
  nicheMatch: number;
  skillOverlap: number;
  roi: number;
  noveltyBonus: number;
}

export interface RadarRecommendation {
  rank: number;
  tool: Tool;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  why: string;
}

export interface RadarResponse {
  input: RadarInput;
  retrievedCount: number;
  recommendations: RadarRecommendation[];
  cached: boolean;
}

export const NICHES: { value: Niche; label: string }[] = [
  { value: "writer", label: "Writer" },
  { value: "designer", label: "Designer" },
  { value: "developer", label: "Developer" },
  { value: "marketer", label: "Marketer" },
  { value: "researcher", label: "Researcher" },
  { value: "pm", label: "Project Manager" },
];

// --- Simulator types ---

export type ScenarioDifficulty = "easy" | "medium" | "hard";

export type AdaptationState = "escalated" | "held" | "neutral";

export interface Scenario {
  id: string;
  title: string;
  difficulty: ScenarioDifficulty;
  clientName: string;
  openingMessage: string;
  hiddenAgenda: string;
  pressureTriggers: string[];
  boundarySignals: string[];
  rubric: string[];
  systemPromptTemplate: string;
}

export interface ScenariosDataset {
  version: string;
  scenarios: Scenario[];
}

export interface ChatMessage {
  role: "user" | "client";
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  scenarioId: string;
  messages: ChatMessage[];
  userMessage: string;
}

export interface ChatResponse {
  clientReply: string;
  adaptationNote: AdaptationState;
  turnCount: number;
}

export interface FeedbackRequest {
  scenarioId: string;
  messages: ChatMessage[];
}

export interface FeedbackResponse {
  overall: "needs-work" | "solid" | "excellent";
  whatWorked: string[];
  improve: string[];
  experiencedAlternative: string;
}

// --- Profile (Phase 4) ---

export interface FreelancerProfile {
  niche: Niche;
  skills: string[];
  alreadyUsing: string[];
  lastRadarAt?: string;
  lastScenarioId?: string;
  resumeFileName?: string;
  resumeText?: string;
  resumeParsedAt?: string;
}

export interface ParsedResumeResponse {
  niche: Niche;
  skills: string[];
  alreadyUsing: string[];
  summary: string;
}

export const DEFAULT_PROFILE: FreelancerProfile = {
  niche: "writer",
  skills: ["seo", "blogging", "email-copy"],
  alreadyUsing: ["grammarly", "notion"],
};

export const PROFILE_STORAGE_KEY = "edgedesk-profile";
