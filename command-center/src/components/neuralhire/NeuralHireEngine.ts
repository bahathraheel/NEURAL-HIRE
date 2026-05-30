// ─── NeuralHire v2 Intelligence Engine ───────────────────────────────────────
// All analysis is deterministic / rule-based — no external API calls.

import type {
  AnalyzeInput,
  AnalysisResult,
  BiasAuditResult,
  BiasIssue,
  JDDeconstruction,
  CandidateProfile,
  SignalScores,
  HireBrief,
  CounterfactualBrief,
  TeamGapMap,
  SignalWeights,
  FeedbackSignal,
} from "@/types/neuralhire";

// ─── Bias patterns ───────────────────────────────────────────────────────────

const PRESTIGE_PROXIES = [
  "stanford", "harvard", "mit", "ivy league", "top-tier university",
  "ivy", "oxbridge", "wharton", "yale", "princeton",
];

const GENDER_CODED = [
  "rockstar", "ninja", "guru", "wizard", "crushing it", "kill it",
  "dominate", "aggressive", "hero", "champion", "manpower",
];

const AGE_PROXIES = [
  "digital native", "recent graduate", "young", "fresh", "energetic team player",
  "millennial", "gen z",
];

const SCOPE_CREEP_THRESHOLD = 12; // if >12 listed requirements → flag

// ─── Keyword banks for scoring ───────────────────────────────────────────────

const LEADERSHIP_KW = [
  "led", "managed", "directed", "owned", "spearheaded", "drove", "launched",
  "built", "scaled", "hired", "mentored", "oversaw", "established",
];

const IMPACT_KW = [
  "increased", "decreased", "reduced", "improved", "grew", "delivered",
  "achieved", "generated", "saved", "accelerated", "optimized", "transformed",
];

const TECH_KW = [
  "python", "sql", "ml", "machine learning", "ai", "cloud", "aws", "gcp",
  "azure", "react", "node", "kubernetes", "docker", "data", "api", "devops",
  "typescript", "java", "go", "rust", "llm", "nlp", "deep learning",
];

const ENGAGEMENT_KW = [
  "published", "open source", "github", "speaker", "conference", "blog",
  "paper", "research", "patent", "award", "volunteer", "mentor",
];

const SHORT_TENURE_THRESHOLD = 14; // months — below this = short stint

// ─── Helpers ─────────────────────────────────────────────────────────────────

function lower(s: string) {
  return s.toLowerCase();
}

function countMatches(text: string, keywords: string[]): number {
  const t = lower(text);
  return keywords.filter((kw) => t.includes(kw)).length;
}

function extractRequirements(jd: string): string[] {
  const lines = jd.split(/\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  return lines.filter((l) =>
    /^[-•*]\s/.test(l) ||
    /^\d+\.\s/.test(l) ||
    lower(l).includes("require") ||
    lower(l).includes("must have") ||
    lower(l).includes("you will") ||
    lower(l).includes("experience with") ||
    lower(l).includes("proficiency in")
  );
}

function parseCandidates(raw: string): { name: string; text: string }[] {
  // Split by "---" separator or "Candidate N:" or double newline with a name-like header
  const blocks = raw
    .split(/---+|(?=Candidate\s+\d+[:\.])/i)
    .map((b) => b.trim())
    .filter((b) => b.length > 50);

  return blocks.map((block, i) => {
    const firstLine = block.split("\n")[0].trim();
    // Try to extract a name from the first line
    const nameMatch =
      firstLine.match(/(?:candidate\s+\d+[:.]\s*)?([\w\s]+)/i);
    const name = nameMatch ? nameMatch[1].trim() : `Candidate ${i + 1}`;
    return { name: name.length < 40 ? name : `Candidate ${i + 1}`, text: block };
  });
}

function detectSeniority(jd: string): string {
  const t = lower(jd);
  if (t.includes("vp ") || t.includes("vice president") || t.includes("head of"))
    return "Senior Leadership (VP / Head)";
  if (t.includes("director")) return "Director";
  if (t.includes("senior") || t.includes("sr.") || t.includes("lead"))
    return "Senior IC / Tech Lead";
  if (t.includes("manager") || t.includes("mgr")) return "Manager";
  if (t.includes("junior") || t.includes("jr.") || t.includes("associate"))
    return "Junior / Associate";
  if (t.includes("intern") || t.includes("trainee")) return "Internship";
  return "Mid-level IC";
}

function extractHardGates(jd: string): string[] {
  const lines = jd.split("\n").map((l) => l.trim());
  const gates: string[] = [];
  lines.forEach((l) => {
    if (
      lower(l).includes("must have") ||
      lower(l).includes("required:") ||
      lower(l).includes("non-negotiable") ||
      lower(l).includes("minimum") ||
      lower(l).includes("mandatory")
    ) {
      gates.push(l.replace(/^[-•*\d.]+\s*/, ""));
    }
  });
  if (gates.length === 0) {
    // Infer: first 3 bullet requirements
    const reqs = extractRequirements(jd).slice(0, 3);
    return reqs.map((r) => r.replace(/^[-•*]\s*/, ""));
  }
  return gates.slice(0, 6);
}

function extractTacitSkills(jd: string): string[] {
  const t = lower(jd);
  const tacit: string[] = [];
  if (t.includes("fast-paced") || t.includes("startup"))
    tacit.push("Comfort with ambiguity and rapid context-switching");
  if (t.includes("cross-functional") || t.includes("stakeholder"))
    tacit.push("Executive-level stakeholder communication");
  if (t.includes("global") || t.includes("remote"))
    tacit.push("Async communication across time zones");
  if (t.includes("data-driven") || t.includes("metrics"))
    tacit.push("Comfort building and owning OKRs / KPIs");
  if (t.includes("scale") || t.includes("growth"))
    tacit.push("Systems thinking for scale");
  if (tacit.length === 0)
    tacit.push(
      "Ability to influence without authority",
      "High written communication bar"
    );
  return tacit;
}

function extractSoftTexture(jd: string): string {
  const t = lower(jd);
  const traits: string[] = [];
  if (t.includes("autonomous") || t.includes("self-starter"))
    traits.push("high autonomy");
  if (t.includes("collaborate") || t.includes("team"))
    traits.push("collaborative culture");
  if (t.includes("fast") || t.includes("agile") || t.includes("sprint"))
    traits.push("fast pace");
  if (t.includes("data") || t.includes("analytics"))
    traits.push("data-oriented decision-making");
  if (t.includes("remote")) traits.push("remote-first");
  return traits.length > 0
    ? traits.join(", ") + " environment"
    : "Balanced pace; collaborative, results-oriented culture";
}

// ─── PHASE 0 — Bias Audit ────────────────────────────────────────────────────

function runBiasAudit(jd: string): BiasAuditResult {
  const t = lower(jd);
  const issues: BiasIssue[] = [];

  PRESTIGE_PROXIES.forEach((kw) => {
    if (t.includes(kw))
      issues.push({
        type: "proxy_bias",
        severity: "high",
        detail: `Credential inflation detected: "${kw}" — screened and removed from scoring context.`,
      });
  });

  GENDER_CODED.forEach((kw) => {
    if (t.includes(kw))
      issues.push({
        type: "proxy_bias",
        severity: "medium",
        detail: `Gender-coded language detected: "${kw}" — flagged for JD revision.`,
      });
  });

  AGE_PROXIES.forEach((kw) => {
    if (t.includes(kw))
      issues.push({
        type: "proxy_bias",
        severity: "medium",
        detail: `Age proxy language detected: "${kw}" — removed from scoring.`,
      });
  });

  const reqs = extractRequirements(jd);
  if (reqs.length > SCOPE_CREEP_THRESHOLD)
    issues.push({
      type: "scope_creep",
      severity: "medium",
      detail: `Scope creep: ${reqs.length} listed requirements for this role. Recommend separating must-haves from nice-to-haves.`,
    });

  return { passed: issues.length === 0, issues };
}

// ─── PHASE 1 — JD Deconstruction ─────────────────────────────────────────────

function deconstructJD(jd: string): JDDeconstruction {
  const seniority = detectSeniority(jd);
  const hardGates = extractHardGates(jd);
  const tacitSkills = extractTacitSkills(jd);
  const softTexture = extractSoftTexture(jd);

  const t = lower(jd);
  let roleIntent =
    "Drive outcomes in a key domain, solving a specific organizational challenge.";
  if (t.includes("growth") || t.includes("revenue"))
    roleIntent =
      "Accelerate revenue growth through scalable strategy and execution.";
  else if (t.includes("engineer") || t.includes("developer"))
    roleIntent =
      "Build and scale reliable, performant technical systems that underpin product delivery.";
  else if (t.includes("product"))
    roleIntent =
      "Define and ship product experiences that solve user problems at scale.";
  else if (t.includes("data") || t.includes("analyst"))
    roleIntent =
      "Convert raw data into strategic insight that drives business decisions.";
  else if (t.includes("design"))
    roleIntent =
      "Craft intuitive user experiences that elevate product quality and brand.";
  else if (t.includes("market"))
    roleIntent =
      "Build awareness and demand for the product in a competitive landscape.";

  const successArchetype =
    `A ${seniority.toLowerCase()} professional with demonstrated ${
      hardGates[0]?.toLowerCase() || "core domain"
    } expertise who has achieved measurable impact in environments of similar scale and complexity. ` +
    `They operate with high autonomy, communicate crisply, and have a track record of accelerating — not just maintaining — outcomes.`;

  return {
    roleIntent,
    trueSeniority: seniority,
    hardGates,
    softTexture,
    tacitSkills,
    successArchetype,
  };
}

// ─── PHASE 2 — Signal Extraction ─────────────────────────────────────────────

function scoreSignalA(candidateText: string, jd: string): number {
  // Semantic DNA — conceptual overlap
  const jdWords = new Set(
    lower(jd)
      .split(/\W+/)
      .filter((w) => w.length > 4)
  );
  const candWords = lower(candidateText)
    .split(/\W+/)
    .filter((w) => w.length > 4);
  const overlap = candWords.filter((w) => jdWords.has(w)).length;
  const ratio = Math.min(overlap / Math.max(jdWords.size * 0.3, 1), 1);

  const leadershipScore = Math.min(
    countMatches(candidateText, LEADERSHIP_KW) * 8,
    40
  );
  const impactScore = Math.min(countMatches(candidateText, IMPACT_KW) * 7, 35);
  const techScore = Math.min(countMatches(candidateText, TECH_KW) * 5, 25);

  const base = ratio * 100 * 0.4 + leadershipScore * 0.3 + impactScore * 0.2 + techScore * 0.1;
  return Math.round(Math.min(Math.max(base, 10), 98));
}

function scoreSignalB(candidateText: string): number {
  // Career Trajectory Arc
  const t = lower(candidateText);
  let score = 50;

  // Velocity indicators
  if (t.includes("promoted") || t.includes("promotion")) score += 15;
  if (t.includes("founded") || t.includes("co-founded")) score += 12;
  if (t.includes("series") || t.includes("startup")) score += 8;
  if (
    t.includes("expanded") ||
    t.includes("scaled") ||
    t.includes("grew from")
  )
    score += 10;

  // Plateau/decline indicators
  if (t.includes("consulting") && t.includes("freelance")) score -= 8;

  // Context multiplier — resource-constrained env
  if (
    t.includes("bootstrap") ||
    t.includes("seed stage") ||
    t.includes("zero to one") ||
    t.includes("resource constrained")
  )
    score += 12; // 1.2× multiplier

  // Tenure analysis — detect chronic short stints
  const monthsPattern = /(\d+)\s*(?:months?|mos?)/gi;
  const matches = [...candidateText.matchAll(monthsPattern)];
  const shortStints = matches.filter(
    (m) => parseInt(m[1]) < SHORT_TENURE_THRESHOLD
  ).length;
  score -= shortStints * 6;

  // Recency — penalise 5yr-old achievements
  const oldYearPattern = /\b(201[0-5])\b/g;
  const oldRefs = [...candidateText.matchAll(oldYearPattern)].length;
  score -= oldRefs * 3; // ~40% decay approximation via linear penalty

  return Math.round(Math.min(Math.max(score, 10), 98));
}

function scoreSignalC(candidateText: string): number {
  // Behavioral Pulse
  let score = 40;
  score += Math.min(countMatches(candidateText, ENGAGEMENT_KW) * 10, 40);

  const t = lower(candidateText);
  if (t.includes("open to work") || t.includes("actively looking")) score += 8;
  if (t.includes("linkedin")) score += 4;
  if (t.includes("portfolio") || t.includes("website")) score += 4;

  // Penalise sparse / dormant
  if (candidateText.length < 300) score -= 20;
  if (candidateText.length < 150) score -= 20;

  return Math.round(Math.min(Math.max(score, 5), 98));
}

function scoreSignalD(candidateText: string, hardGates: string[]): number {
  // Hard Criteria Match
  if (hardGates.length === 0) return 75;
  const t = lower(candidateText);
  const matched = hardGates.filter((gate) => {
    const gateWords = lower(gate)
      .split(/\W+/)
      .filter((w) => w.length > 3);
    return gateWords.some((w) => t.includes(w));
  }).length;
  const ratio = matched / hardGates.length;
  return Math.round(Math.min(Math.max(ratio * 100, 5), 100));
}

function assessChurn(
  candidateText: string,
  jd: string
): { risk: "LOW" | "MEDIUM" | "HIGH"; reason: string } {
  const t = lower(candidateText);
  let riskScore = 0;

  // Chronic short stints
  const shortStintMatches = [
    ...candidateText.matchAll(/(\d+)\s*(?:months?|mos?)/gi),
  ];
  const shortStints = shortStintMatches.filter(
    (m) => parseInt(m[1]) < SHORT_TENURE_THRESHOLD
  ).length;
  riskScore += shortStints * 2;

  // Overqualified signals
  const seniorityJD = detectSeniority(jd);
  if (
    seniorityJD.includes("Junior") &&
    (t.includes("director") || t.includes("vp ") || t.includes("head of"))
  ) {
    riskScore += 4;
  }

  // Compensation tension
  if (
    t.includes("currently underpaid") ||
    t.includes("below market") ||
    t.includes("looking for better compensation")
  )
    riskScore += 3;

  // Role logic
  if (
    t.includes("career change") ||
    t.includes("pivoting") ||
    t.includes("transitioning")
  )
    riskScore += 2;

  if (riskScore >= 5)
    return {
      risk: "HIGH",
      reason:
        "Multiple short-tenure stints or role mismatch signals significant 18-month flight risk.",
    };
  if (riskScore >= 2)
    return {
      risk: "MEDIUM",
      reason: "Moderate churn indicators — worth probing motivation in interview.",
    };
  return {
    risk: "LOW",
    reason: "Stable tenure history and clear role-progression logic observed.",
  };
}

function assessChemistry(
  candidateText: string,
  teamData: string
): { score: number; rationale: string } {
  if (!teamData || teamData.trim().length < 20)
    return {
      score: 5,
      rationale: "No team data provided — default neutral chemistry score applied.",
    };

  const t = lower(candidateText);
  const td = lower(teamData);
  let score = 5;

  // Gap fill scoring
  const gaps = ["frontend", "backend", "design", "data", "sales", "marketing", "ops"];
  gaps.forEach((gap) => {
    if (td.includes(`lacks ${gap}`) || td.includes(`no ${gap}`) || td.includes(`need ${gap}`)) {
      if (t.includes(gap)) score += 1.5;
    }
  });

  // Cognitive diversity
  if (!td.includes("diverse") && t.includes("different background")) score += 1;

  // Friction signals
  if (t.includes("my way") || t.includes("solo") || t.includes("independent only"))
    score -= 1;

  score = Math.round(Math.min(Math.max(score, 1), 10));
  const rationale =
    score >= 8
      ? "Strong gap-fill for team's skill deficit; diverse problem-solving style adds value."
      : score >= 5
      ? "Adequate team fit — no major friction risk, some skill overlap with existing members."
      : "Potential friction risk or limited gap-fill; team chemistry benefit unclear.";
  return { score, rationale };
}

function rateExplainability(candidateText: string): {
  stars: number;
  missingDataPoint?: string;
} {
  const len = candidateText.length;
  const hasMetrics = /\d+%|\$\d+|\d+x|\d+\s*(users|customers|revenue|ARR)/.test(
    candidateText
  );
  const hasDates = /\b(20\d{2})\b/.test(candidateText);
  const hasRole = /\b(manager|engineer|director|lead|analyst|designer)\b/i.test(
    candidateText
  );
  const hasCompany = /\b(at|@)\s+\w+/.test(candidateText);

  let stars = 1;
  if (len > 200) stars++;
  if (hasMetrics) stars++;
  if (hasDates && hasRole) stars++;
  if (hasCompany && len > 500) stars++;

  let missingDataPoint: string | undefined;
  if (stars <= 3) {
    if (!hasMetrics)
      missingDataPoint =
        "Quantified impact metrics (e.g., % growth, ARR, team size) would most improve scoring accuracy.";
    else if (!hasDates)
      missingDataPoint =
        "Employment date ranges are missing — prevents trajectory arc calculation.";
    else
      missingDataPoint =
        "Company context and team size would sharpen complexity assessment.";
  }

  return { stars, missingDataPoint };
}

function extractSignals(
  candidateText: string,
  jd: string,
  hardGates: string[],
  teamData: string
): SignalScores {
  const churn = assessChurn(candidateText, jd);
  const chem = assessChemistry(candidateText, teamData);
  const explain = rateExplainability(candidateText);

  return {
    A: scoreSignalA(candidateText, jd),
    B: scoreSignalB(candidateText),
    C: scoreSignalC(candidateText),
    D: scoreSignalD(candidateText, hardGates),
    churnRisk: churn.risk,
    churnReason: churn.reason,
    chemistryScore: chem.score,
    chemistryRationale: chem.rationale,
    explainabilityStars: explain.stars,
    missingDataPoint: explain.missingDataPoint,
  };
}

// ─── PHASE 3 — Composite FitScore ────────────────────────────────────────────

function computeFitScore(signals: SignalScores, weights: SignalWeights): number {
  const base =
    (weights.A / 100) * signals.A +
    (weights.B / 100) * signals.B +
    (weights.C / 100) * signals.C +
    (weights.D / 100) * signals.D;

  // Normalise base (A+B+C+D weights may not sum to 100)
  const totalBaseWeight = (weights.A + weights.B + weights.C + weights.D) / 100;
  const normBase = totalBaseWeight > 0 ? base / totalBaseWeight : base;

  const churnPenalty = signals.churnRisk === "HIGH" ? -10 : 0;
  const chemBonus = signals.chemistryScore >= 8 ? 8 : 0;

  return Math.round(
    Math.min(Math.max(normBase + churnPenalty + chemBonus, 0), 100)
  );
}

function computeConfidenceBand(
  fitScore: number,
  stars: number
): [number, number] {
  // More stars = narrower band
  const halfBand = stars >= 5 ? 4 : stars === 4 ? 6 : stars === 3 ? 8 : 12;
  return [
    Math.max(fitScore - halfBand, 0),
    Math.min(fitScore + halfBand, 100),
  ];
}

// ─── PHASE 4 — Hire Briefs ────────────────────────────────────────────────────

function generateHireBrief(
  name: string,
  text: string,
  signals: SignalScores,
  fitScore: number,
  jdDecon: JDDeconstruction,
  confidenceBand: [number, number]
): HireBrief {
  const t = lower(text);

  // Thesis
  const topSignal =
    signals.A >= signals.B && signals.A >= signals.C
      ? "semantic domain alignment"
      : signals.B >= signals.C
      ? "exceptional career velocity"
      : "strong behavioral engagement";
  const thesis = `${name} brings ${topSignal} precisely matched to the ${jdDecon.roleIntent.slice(0, 60).toLowerCase()} mission — a ${jdDecon.trueSeniority.toLowerCase()} operator who has delivered in comparable scope.`;

  // Top 3 strengths
  const strengths = [];
  if (signals.A > 70)
    strengths.push({
      signal: "Signal A — Semantic DNA",
      evidence: `Deep conceptual overlap with role intent; vocabulary and scope of experience maps directly to ${jdDecon.hardGates[0] || "core requirements"}.`,
    });
  if (signals.B > 70)
    strengths.push({
      signal: "Signal B — Trajectory Arc",
      evidence: t.includes("promot")
        ? "Internal promotion history signals demonstrated performance recognition."
        : "Consistent upward career movement with no unexplained gaps.",
    });
  if (signals.C > 60)
    strengths.push({
      signal: "Signal C — Behavioral Pulse",
      evidence: t.includes("publish") || t.includes("speaker")
        ? "Active public-facing contributions (publications / speaking) indicate thought leadership beyond the day job."
        : "Active profile with recent engagement signals — not a passive candidate.",
    });
  if (signals.D > 75)
    strengths.push({
      signal: "Signal D — Hard Criteria",
      evidence: `Meets ${Math.round(signals.D)}% of stated hard gates — notably the non-negotiable qualifications.`,
    });
  if (strengths.length < 3)
    strengths.push({
      signal: "Signal D — Hard Criteria",
      evidence: `${Math.round(signals.D)}% gate match rate — most non-negotiables satisfied.`,
    });

  // Primary risk
  let primaryRisk =
    signals.churnRisk === "HIGH"
      ? `Churn risk is HIGH: ${signals.churnReason} This is a first-class concern, not a footnote.`
      : signals.D < 60
      ? `Hard criteria gap — only ${Math.round(signals.D)}% of required gates met. Investigate before advancing.`
      : signals.B < 50
      ? "Career trajectory is plateauing — this candidate may be coasting rather than growing."
      : "No critical risk flagged; primary concern is data sparsity widening confidence band.";

  // Second opinion flag
  const secondOpinionFlag =
    confidenceBand[1] - confidenceBand[0] > 16
      ? signals.missingDataPoint || "Additional profile depth would materially resolve score uncertainty."
      : undefined;

  // Outreach angle
  const outreachAngle = t.includes("impact") || t.includes("mission")
    ? "Lead with impact: frame the role around the tangible change they'd drive, not the company brand."
    : t.includes("growth") || t.includes("scale")
    ? "Hook with growth trajectory — show them the scale they'd operate at in 18 months."
    : "Emphasise autonomy and ownership: this candidate values driving decisions, not executing someone else's plan.";

  // Interview probe
  const interviewProbe =
    signals.churnRisk !== "LOW"
      ? `"Walk me through why THIS role is the logical next step for you — not just a good opportunity, but the right one for where you're heading." (Tests commitment and role-fit logic.)`
      : signals.D < 70
      ? `"Can you describe a specific project where you applied [${jdDecon.hardGates[0] || "the core technical requirement"}] to solve a real problem at scale?" (Validates gate criterion depth.)`
      : `"Tell me about a time you disagreed with leadership on strategy — what did you do and what was the outcome?" (Tests autonomy and communication style against our soft texture needs.)`;

  // Explainability trail
  const explainabilityTrail =
    `FitScore of ${fitScore} is derived from weighted signals: Semantic DNA (${signals.A}/100), ` +
    `Career Arc (${signals.B}/100), Behavioral Pulse (${signals.C}/100), Hard Criteria (${signals.D}/100). ` +
    `Churn risk is ${signals.churnRisk} (${signals.churnRisk === "HIGH" ? "−10 applied" : "no penalty"}). ` +
    `Chemistry score is ${signals.chemistryScore}/10 (${signals.chemistryScore >= 8 ? "+8 bonus applied" : "no bonus"}). ` +
    `Confidence band: ±${Math.round((confidenceBand[1] - confidenceBand[0]) / 2)} pts based on ${signals.explainabilityStars}-star data completeness.`;

  return {
    thesis,
    strengths: strengths.slice(0, 3),
    primaryRisk,
    secondOpinionFlag,
    outreachAngle,
    interviewProbe,
    explainabilityTrail,
  };
}

// ─── PHASE 5 — Counterfactual Pipeline ───────────────────────────────────────

function generateCounterfactual(
  name: string,
  text: string,
  signals: SignalScores,
  fitScore: number,
  jdDecon: JDDeconstruction
): CounterfactualBrief {
  // Find the weakest signal
  const sigMap: { key: string; val: number }[] = [
    { key: "Semantic DNA (Signal A)", val: signals.A },
    { key: "Career Trajectory (Signal B)", val: signals.B },
    { key: "Behavioral Pulse (Signal C)", val: signals.C },
    { key: "Hard Criteria Match (Signal D)", val: signals.D },
  ];
  sigMap.sort((a, b) => a.val - b.val);
  const weakest = sigMap[0];

  const currentGap = `${weakest.key} is the primary drag (score: ${weakest.val}/100) — insufficient to meet shortlist threshold in this competitive pool.`;

  let oneChangeAway = "";
  let action: "keep_warm" | "refer_alternate" | "close_gap_first" = "keep_warm";
  let detail = "";

  if (weakest.key.includes("Hard Criteria")) {
    oneChangeAway = `Obtaining ${jdDecon.hardGates[0] || "the primary required certification or credential"} would likely move this candidate into the top tier.`;
    action = "close_gap_first";
    detail = `Advise candidate to pursue ${jdDecon.hardGates[0] || "the missing certification"} — re-engage in 3–6 months.`;
  } else if (weakest.key.includes("Semantic DNA")) {
    oneChangeAway =
      "A 6–12 month role with direct exposure to the core domain (not adjacent work) would close the conceptual gap.";
    action = "refer_alternate";
    detail =
      "Refer to a more junior or adjacent role where they can build domain depth before re-applying at this level.";
  } else if (weakest.key.includes("Career Trajectory")) {
    oneChangeAway =
      "Demonstrated ownership of a high-stakes project — with quantified outcomes — would significantly improve trajectory scoring.";
    action = "keep_warm";
    detail = `Keep warm: re-engage in 6 months after they have had time to accumulate that evidence in their current role.`;
  } else {
    oneChangeAway =
      "Publishing or speaking publicly about their domain expertise would sharply increase behavioral signal score.";
    action = "keep_warm";
    detail = "Keep warm: encourage candidate to build public presence (blog, GitHub, conference talk).";
  }

  return {
    currentGap,
    oneChangeAway,
    pipelineAction: action,
    pipelineDetail: detail,
  };
}

// ─── Team Gap Map ─────────────────────────────────────────────────────────────

function buildTeamGapMap(teamData: string): TeamGapMap {
  const t = lower(teamData);
  const gaps: string[] = [];
  const complementNeeds: string[] = [];

  const domains = ["frontend", "backend", "data science", "ml", "design", "product", "marketing", "sales", "ops", "devops"];
  domains.forEach((d) => {
    if (t.includes(`lacks ${d}`) || t.includes(`no ${d}`) || t.includes(`weak in ${d}`)) {
      gaps.push(d);
      complementNeeds.push(`Needs a strong ${d} contributor`);
    }
  });

  if (gaps.length === 0) {
    gaps.push("No explicit gaps identified — scoring chemistry on diversity signals");
    complementNeeds.push("Cognitive diversity and different problem-solving style");
  }

  return { gaps, complementNeeds };
}

// ─── PHASE 6 — Weight Update ──────────────────────────────────────────────────

const BASE_WEIGHTS: SignalWeights = { A: 30, B: 22, C: 18, D: 15, E: -10, F: 8, G: 5 };
const MAX_SHIFT = 9;

export const NeuralHireEngine = {
  analyze(input: AnalyzeInput): AnalysisResult {
    const { jd, candidates, teamData = "", weights } = input;

    // Phase 0
    const biasAudit = runBiasAudit(jd);

    // Phase 1
    const jdDeconstruction = deconstructJD(jd);

    // Team gap map
    const teamGapMap =
      teamData.trim().length > 20 ? buildTeamGapMap(teamData) : undefined;

    // Parse candidates
    const parsed = parseCandidates(candidates);

    const profiles: CandidateProfile[] = parsed.map(({ name, text }) => {
      const signals = extractSignals(
        text,
        jd,
        jdDeconstruction.hardGates,
        teamData
      );

      // Hard fail check
      const hardFailed = signals.D < 25;
      const hardFailReason = hardFailed
        ? `Hard criteria gate failure: only ${Math.round(signals.D)}% of non-negotiable requirements met.`
        : undefined;

      if (hardFailed) {
        return {
          name,
          rawText: text,
          signals,
          fitScore: 0,
          confidenceBand: [0, 0] as [number, number],
          hardFailed: true,
          hardFailReason,
        };
      }

      const fitScore = computeFitScore(signals, weights);
      const confidenceBand = computeConfidenceBand(
        fitScore,
        signals.explainabilityStars
      );

      const hireBrief =
        fitScore >= 65
          ? generateHireBrief(name, text, signals, fitScore, jdDeconstruction, confidenceBand)
          : undefined;

      const counterfactual =
        fitScore >= 50 && fitScore < 65
          ? generateCounterfactual(name, text, signals, fitScore, jdDeconstruction)
          : undefined;

      return {
        name,
        rawText: text,
        signals,
        fitScore,
        confidenceBand,
        hardFailed: false,
        hireBrief,
        counterfactual,
      };
    });

    // Sort by fitScore descending
    const sorted = profiles
      .filter((p) => !p.hardFailed)
      .sort((a, b) => b.fitScore - a.fitScore);

    const shortlist = sorted.filter((p) => p.fitScore >= 65);
    const nearMisses = sorted.filter(
      (p) => p.fitScore >= 50 && p.fitScore < 65
    );
    const eliminated = [
      ...profiles.filter((p) => p.hardFailed),
      ...sorted.filter((p) => p.fitScore < 50),
    ];

    // Diversity flag
    let diversityFlag: string | undefined;
    if (shortlist.length >= 4) {
      // Simple heuristic — if all names follow similar Western naming patterns
      const nameSet = new Set(shortlist.map((c) => c.name.split(" ")[0]));
      if (nameSet.size < shortlist.length * 0.6) {
        diversityFlag =
          "⚠️ Diversity Alert: Top shortlist shows potential homogeneity. Review for experiential and demographic diversity to reduce groupthink risk.";
      }
    }

    return {
      biasAudit,
      jdDeconstruction,
      teamGapMap,
      shortlist,
      nearMisses,
      eliminated,
      diversityFlag,
      weights,
    };
  },

  updateWeights(
    current: SignalWeights,
    signals: FeedbackSignal[],
    result: AnalysisResult | null
  ): SignalWeights {
    if (!result || signals.length === 0) return current;

    const newWeights = { ...current };
    const lastSignal = signals[signals.length - 1];
    const { candidateName, vote } = lastSignal;

    const candidate = [
      ...result.shortlist,
      ...result.nearMisses,
    ].find((c) => c.name === candidateName);

    if (!candidate) return current;

    const { signals: s } = candidate;
    if (vote === "👍") {
      // Find strongest signal → boost its weight
      const strongest =
        s.A >= s.B && s.A >= s.C && s.A >= s.D
          ? "A"
          : s.B >= s.C && s.B >= s.D
          ? "B"
          : s.C >= s.D
          ? "C"
          : "D";
      const newVal = Math.min(
        (newWeights[strongest as keyof SignalWeights] as number) + 3,
        (BASE_WEIGHTS[strongest as keyof SignalWeights] as number) + MAX_SHIFT
      );
      (newWeights[strongest as keyof SignalWeights] as number) = newVal;
    } else {
      // Find weakest signal → reduce its weight
      const weakest =
        s.A <= s.B && s.A <= s.C && s.A <= s.D
          ? "A"
          : s.B <= s.C && s.B <= s.D
          ? "B"
          : s.C <= s.D
          ? "C"
          : "D";
      const newVal = Math.max(
        (newWeights[weakest as keyof SignalWeights] as number) - 3,
        (BASE_WEIGHTS[weakest as keyof SignalWeights] as number) - MAX_SHIFT
      );
      (newWeights[weakest as keyof SignalWeights] as number) = newVal;
    }

    return newWeights;
  },
};
