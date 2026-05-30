// ─── NeuralHire v2 Type Definitions ──────────────────────────────────────────

export interface SignalWeights {
  A: number; // Semantic DNA - 30%
  B: number; // Career Trajectory - 22%
  C: number; // Behavioral Pulse - 18%
  D: number; // Hard Criteria - 15%
  E: number; // Churn penalty base (-10 if HIGH)
  F: number; // Team Chemistry bonus (+8 if ≥8)
  G: number; // Explainability confidence (modulates band)
}

export interface SignalScores {
  A: number; // 0-100
  B: number; // 0-100
  C: number; // 0-100
  D: number; // 0-100
  churnRisk: "LOW" | "MEDIUM" | "HIGH";
  churnReason: string;
  chemistryScore: number; // 0-10
  chemistryRationale: string;
  explainabilityStars: number; // 1-5
  missingDataPoint?: string;
}

export interface BiasAuditResult {
  passed: boolean;
  issues: BiasIssue[];
}

export interface BiasIssue {
  type: "proxy_bias" | "scope_creep" | "signal_contamination";
  severity: "low" | "medium" | "high";
  detail: string;
}

export interface JDDeconstruction {
  roleIntent: string;
  trueSeniority: string;
  hardGates: string[];
  softTexture: string;
  tacitSkills: string[];
  successArchetype: string;
  teamContext?: string;
}

export interface CandidateProfile {
  name: string;
  rawText: string;
  signals: SignalScores;
  fitScore: number;
  confidenceBand: [number, number]; // [min, max]
  hardFailed: boolean;
  hardFailReason?: string;
  hireBrief?: HireBrief;
  counterfactual?: CounterfactualBrief;
}

export interface HireBrief {
  thesis: string;
  strengths: SignalStrength[];
  primaryRisk: string;
  secondOpinionFlag?: string;
  outreachAngle: string;
  interviewProbe: string;
  explainabilityTrail: string;
}

export interface SignalStrength {
  signal: string;
  evidence: string;
}

export interface CounterfactualBrief {
  currentGap: string;
  oneChangeAway: string;
  pipelineAction: "keep_warm" | "refer_alternate" | "close_gap_first";
  pipelineDetail: string;
}

export interface TeamGapMap {
  gaps: string[];
  complementNeeds: string[];
}

export interface AnalysisResult {
  biasAudit: BiasAuditResult;
  jdDeconstruction: JDDeconstruction;
  teamGapMap?: TeamGapMap;
  shortlist: CandidateProfile[];
  nearMisses: CandidateProfile[];
  eliminated: CandidateProfile[];
  diversityFlag?: string;
  weights: SignalWeights;
}

export interface FeedbackSignal {
  candidateName: string;
  vote: "👍" | "👎";
  timestamp: number;
}

export interface FeedbackState {
  signals: FeedbackSignal[];
  weights: SignalWeights;
}

export interface AnalyzeInput {
  jd: string;
  candidates: string;
  teamData?: string;
  weights: SignalWeights;
}
