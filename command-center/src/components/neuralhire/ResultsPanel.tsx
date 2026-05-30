"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnalysisResult, CandidateProfile } from "@/types/neuralhire";

// ─── Sub-components ──────────────────────────────────────────────────────────

function BiasAuditCard({ result }: { result: AnalysisResult }) {
  const { biasAudit } = result;
  return (
    <div className={`nh-audit-card ${biasAudit.passed ? "nh-audit-pass" : "nh-audit-fail"}`}>
      <div className="nh-audit-header">
        <span className="nh-audit-icon">{biasAudit.passed ? "✅" : "⚠️"}</span>
        <div>
          <h3 className="nh-audit-title">Phase 0 — Bias Audit</h3>
          <p className="nh-audit-status">
            {biasAudit.passed
              ? "JD passed bias audit — no proxy bias, scope creep, or signal contamination detected."
              : `${biasAudit.issues.length} issue${biasAudit.issues.length > 1 ? "s" : ""} flagged and removed from scoring context.`}
          </p>
        </div>
      </div>
      {!biasAudit.passed && (
        <ul className="nh-audit-issues">
          {biasAudit.issues.map((issue, i) => (
            <li key={i} className={`nh-audit-issue nh-issue-${issue.severity}`}>
              <span className="nh-issue-type">{issue.type.replace(/_/g, " ")}</span>
              <span>{issue.detail}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function JDDeconCard({ result }: { result: AnalysisResult }) {
  const { jdDeconstruction: d } = result;
  return (
    <div className="nh-decon-card">
      <div className="nh-section-label">
        <span className="nh-phase-tag">Phase 1</span>
        JD Deconstruction
      </div>
      <div className="nh-decon-grid">
        <div className="nh-decon-item">
          <span className="nh-decon-key">🎯 Role Intent</span>
          <span className="nh-decon-val">{d.roleIntent}</span>
        </div>
        <div className="nh-decon-item">
          <span className="nh-decon-key">📊 True Seniority</span>
          <span className="nh-decon-val">{d.trueSeniority}</span>
        </div>
        <div className="nh-decon-item">
          <span className="nh-decon-key">🔒 Hard Gates</span>
          <ul className="nh-decon-list">
            {d.hardGates.map((g, i) => <li key={i}>{g}</li>)}
          </ul>
        </div>
        <div className="nh-decon-item">
          <span className="nh-decon-key">🌊 Soft Texture</span>
          <span className="nh-decon-val">{d.softTexture}</span>
        </div>
        <div className="nh-decon-item nh-decon-full">
          <span className="nh-decon-key">🔍 Tacit Skills Required</span>
          <ul className="nh-decon-list">
            {d.tacitSkills.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div className="nh-decon-item nh-decon-full nh-archetype-block">
          <span className="nh-decon-key">🏆 Success Archetype</span>
          <blockquote className="nh-archetype">{d.successArchetype}</blockquote>
        </div>
      </div>
    </div>
  );
}

function TeamGapCard({ result }: { result: AnalysisResult }) {
  if (!result.teamGapMap) return null;
  const { gaps, complementNeeds } = result.teamGapMap;
  return (
    <div className="nh-team-card">
      <div className="nh-section-label">
        <span className="nh-phase-tag">Phase 1+</span>
        Team Gap Map
      </div>
      <div className="nh-team-grid">
        <div>
          <p className="nh-team-sub">Identified Gaps</p>
          <ul className="nh-team-list">
            {gaps.map((g, i) => <li key={i}>⚡ {g}</li>)}
          </ul>
        </div>
        <div>
          <p className="nh-team-sub">Complement Needs</p>
          <ul className="nh-team-list">
            {complementNeeds.map((n, i) => <li key={i}>✦ {n}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SignalBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="nh-signal-row">
      <span className="nh-signal-label">{label}</span>
      <div className="nh-signal-track">
        <motion.div
          className="nh-signal-fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="nh-signal-val">{value}</span>
    </div>
  );
}

function ChurnBadge({ risk }: { risk: "LOW" | "MEDIUM" | "HIGH" }) {
  const map = {
    LOW: { cls: "nh-churn-low", label: "🟢 LOW" },
    MEDIUM: { cls: "nh-churn-med", label: "🟡 MEDIUM" },
    HIGH: { cls: "nh-churn-high", label: "🔴 HIGH −10pts" },
  };
  return <span className={`nh-churn-badge ${map[risk].cls}`}>{map[risk].label}</span>;
}

function StarRating({ stars }: { stars: number }) {
  return (
    <span className="nh-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ opacity: i <= stars ? 1 : 0.2 }}>★</span>
      ))}
    </span>
  );
}

function CandidateCard({
  candidate,
  rank,
  onFeedback,
}: {
  candidate: CandidateProfile;
  rank?: number;
  onFeedback?: (name: string, vote: "👍" | "👎") => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { signals, fitScore, confidenceBand, hireBrief, counterfactual } = candidate;

  const scoreColor =
    fitScore >= 80
      ? "#10b981"
      : fitScore >= 65
      ? "#6366f1"
      : fitScore >= 50
      ? "#f59e0b"
      : "#ef4444";

  return (
    <motion.div
      className="nh-candidate-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: (rank || 0) * 0.08 }}
      layout
    >
      {/* Card header */}
      <div className="nh-cand-header" onClick={() => setExpanded((e) => !e)}>
        {rank !== undefined && (
          <div className="nh-rank-badge">#{rank}</div>
        )}
        <div className="nh-cand-avatar">
          {candidate.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div className="nh-cand-info">
          <h3 className="nh-cand-name">{candidate.name}</h3>
          <div className="nh-cand-meta">
            <ChurnBadge risk={signals.churnRisk} />
            <span className="nh-cand-chem">
              🧪 Chemistry {signals.chemistryScore}/10
              {signals.chemistryScore >= 8 && <span className="nh-bonus-tag">+8</span>}
            </span>
            <StarRating stars={signals.explainabilityStars} />
          </div>
        </div>

        <div className="nh-cand-score-block">
          <div
            className="nh-fit-score"
            style={{ color: scoreColor, borderColor: scoreColor + "44" }}
          >
            {fitScore}
          </div>
          <div className="nh-conf-band">
            {confidenceBand[0]}–{confidenceBand[1]}
          </div>
          <span className="nh-expand-arrow">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Signal bars */}
      <div className="nh-signal-bars">
        <SignalBar label="A · Semantic DNA" value={signals.A} color="#6366f1" />
        <SignalBar label="B · Career Arc" value={signals.B} color="#8b5cf6" />
        <SignalBar label="C · Behavioral" value={signals.C} color="#06b6d4" />
        <SignalBar label="D · Hard Criteria" value={signals.D} color="#10b981" />
      </div>

      {/* Expanded Hire Brief */}
      <AnimatePresence>
        {expanded && hireBrief && (
          <motion.div
            className="nh-hire-brief"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="nh-brief-thesis">
              <span className="nh-brief-label">One-line Thesis</span>
              <p>"{hireBrief.thesis}"</p>
            </div>

            <div className="nh-brief-strengths">
              <span className="nh-brief-label">Top Signal Strengths</span>
              {hireBrief.strengths.map((s, i) => (
                <div key={i} className="nh-strength-item">
                  <span className="nh-strength-signal">{s.signal}</span>
                  <span className="nh-strength-evidence">{s.evidence}</span>
                </div>
              ))}
            </div>

            <div className="nh-brief-risk">
              <span className="nh-brief-label nh-risk-label">⚠ Primary Risk</span>
              <p>{hireBrief.primaryRisk}</p>
            </div>

            {hireBrief.secondOpinionFlag && (
              <div className="nh-brief-2nd">
                <span className="nh-brief-label">🔎 Second Opinion Flag</span>
                <p>{hireBrief.secondOpinionFlag}</p>
              </div>
            )}

            <div className="nh-brief-outreach">
              <span className="nh-brief-label">📬 Outreach Angle</span>
              <p>{hireBrief.outreachAngle}</p>
            </div>

            <div className="nh-brief-probe">
              <span className="nh-brief-label">🎯 Interview Probe</span>
              <p className="nh-probe-q">{hireBrief.interviewProbe}</p>
            </div>

            <div className="nh-brief-trail">
              <span className="nh-brief-label">🔢 Explainability Trail</span>
              <p>{hireBrief.explainabilityTrail}</p>
            </div>

            <div className="nh-chem-detail">
              <span className="nh-brief-label">🧪 Chemistry Rationale</span>
              <p>{signals.chemistryRationale}</p>
            </div>

            <div className="nh-churn-detail">
              <span className="nh-brief-label">⏱ Churn Signal</span>
              <p>{signals.churnReason}</p>
            </div>
          </motion.div>
        )}

        {expanded && counterfactual && (
          <motion.div
            className="nh-counterfactual"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="nh-cf-header">
              <span className="nh-cf-tag">Phase 5 — Counterfactual</span>
            </div>
            <div className="nh-cf-gap">
              <span className="nh-brief-label">Current Gap</span>
              <p>{counterfactual.currentGap}</p>
            </div>
            <div className="nh-cf-change">
              <span className="nh-brief-label">One Change Away</span>
              <p>{counterfactual.oneChangeAway}</p>
            </div>
            <div className={`nh-cf-action nh-cf-${counterfactual.pipelineAction}`}>
              <span className="nh-cf-action-icon">
                {counterfactual.pipelineAction === "keep_warm"
                  ? "🌡️ Keep Warm"
                  : counterfactual.pipelineAction === "refer_alternate"
                  ? "↗ Refer to Alternate Role"
                  : "📚 Close the Gap First"}
              </span>
              <p>{counterfactual.pipelineDetail}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback buttons */}
      {onFeedback && !candidate.hardFailed && (
        <div className="nh-feedback-row">
          <span className="nh-feedback-label">Rate this candidate:</span>
          <button
            className="nh-fb-btn nh-fb-up"
            onClick={() => onFeedback(candidate.name, "👍")}
            id={`fb-up-${candidate.name.replace(/\s/g, "-")}`}
          >
            👍 Good fit
          </button>
          <button
            className="nh-fb-btn nh-fb-down"
            onClick={() => onFeedback(candidate.name, "👎")}
            id={`fb-down-${candidate.name.replace(/\s/g, "-")}`}
          >
            👎 Not right
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Results Panel ───────────────────────────────────────────────────────

interface ResultsPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  onFeedback: (name: string, vote: "👍" | "👎") => void;
  onSwitchFeedback: () => void;
}

export function ResultsPanel({ result, isAnalyzing, onFeedback, onSwitchFeedback }: ResultsPanelProps) {
  if (isAnalyzing) {
    return (
      <div className="nh-analyzing">
        <div className="nh-analyzing-anim">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="nh-pulse-dot"
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
        <h2 className="nh-analyzing-title">Running 6-Phase NeuralHire Analysis…</h2>
        <div className="nh-phase-list">
          {[
            "Phase 0: Bias Audit",
            "Phase 1: JD Deconstruction",
            "Phase 2: Signal Extraction",
            "Phase 3: Composite FitScore",
            "Phase 4: Hire Briefs",
            "Phase 5: Counterfactual Pipeline",
          ].map((phase, i) => (
            <motion.p
              key={i}
              className="nh-phase-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.2 }}
            >
              ✓ {phase}
            </motion.p>
          ))}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="nh-empty-results">
        <div className="nh-empty-icon">🧠</div>
        <h2>No Analysis Yet</h2>
        <p>Configure your JD and candidate profiles, then run the analysis.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="nh-results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Summary strip */}
      <div className="nh-summary-strip">
        <div className="nh-summary-stat">
          <span className="nh-summary-num nh-num-green">{result.shortlist.length}</span>
          <span>Shortlisted</span>
        </div>
        <div className="nh-summary-stat">
          <span className="nh-summary-num nh-num-amber">{result.nearMisses.length}</span>
          <span>Near-Misses</span>
        </div>
        <div className="nh-summary-stat">
          <span className="nh-summary-num nh-num-red">{result.eliminated.length}</span>
          <span>Eliminated</span>
        </div>
        {result.shortlist.length > 0 && (
          <div className="nh-summary-stat">
            <span className="nh-summary-num nh-num-violet">
              {result.shortlist[0].fitScore}
            </span>
            <span>Top Score</span>
          </div>
        )}
      </div>

      {/* Bias Audit */}
      <BiasAuditCard result={result} />

      {/* JD Deconstruction */}
      <JDDeconCard result={result} />

      {/* Team Gap */}
      {result.teamGapMap && <TeamGapCard result={result} />}

      {/* Diversity flag */}
      {result.diversityFlag && (
        <div className="nh-diversity-flag">
          {result.diversityFlag}
        </div>
      )}

      {/* Shortlist */}
      {result.shortlist.length > 0 && (
        <section>
          <div className="nh-section-header">
            <div className="nh-section-label">
              <span className="nh-phase-tag">Phase 4</span>
              Ranked Shortlist — Full Hire Briefs
            </div>
            <span className="nh-section-hint">Click a card to expand the full Hire Brief ▼</span>
          </div>
          {result.shortlist.map((c, i) => (
            <CandidateCard
              key={c.name}
              candidate={c}
              rank={i + 1}
              onFeedback={onFeedback}
            />
          ))}
        </section>
      )}

      {/* Near-misses */}
      {result.nearMisses.length > 0 && (
        <section>
          <div className="nh-section-header">
            <div className="nh-section-label">
              <span className="nh-phase-tag nh-tag-amber">Phase 5</span>
              Near-Miss Pipeline (50–65)
            </div>
          </div>
          {result.nearMisses.map((c) => (
            <CandidateCard key={c.name} candidate={c} onFeedback={onFeedback} />
          ))}
        </section>
      )}

      {/* Eliminated */}
      {result.eliminated.length > 0 && (
        <section>
          <div className="nh-section-label">
            <span className="nh-phase-tag nh-tag-red">Eliminated</span>
            Hard-Fail / Below Threshold
          </div>
          {result.eliminated.map((c) => (
            <div key={c.name} className="nh-eliminated-card">
              <div className="nh-elim-avatar">
                {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </div>
              <div>
                <span className="nh-elim-name">{c.name}</span>
                <span className="nh-elim-reason">
                  {c.hardFailed ? c.hardFailReason : `FitScore ${c.fitScore} — below minimum threshold.`}
                </span>
              </div>
              <span className="nh-elim-score">{c.hardFailed ? "FAIL" : c.fitScore}</span>
            </div>
          ))}
        </section>
      )}

      {/* Feedback prompt */}
      <div className="nh-feedback-prompt">
        <span className="nh-feedback-prompt-icon">🔄</span>
        <div>
          <strong>Phase 6 — Adaptive Re-Ranking</strong>
          <p>Rate any candidate (👍 / 👎) using the buttons above, or switch to the Adaptive Re-rank tab for the full feedback console. I will update signal weights and rescore accordingly.</p>
        </div>
        <button className="nh-switch-btn" onClick={onSwitchFeedback} id="btn-switch-feedback">
          Open Re-rank Console →
        </button>
      </div>
    </motion.div>
  );
}
