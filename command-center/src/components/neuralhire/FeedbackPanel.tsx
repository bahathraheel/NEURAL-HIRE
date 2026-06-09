"use client";

import { motion } from "framer-motion";
import type { AnalysisResult, FeedbackState, SignalWeights } from "@/types/neuralhire";

const BASE_WEIGHTS: SignalWeights = { A: 30, B: 22, C: 18, D: 15, E: -10, F: 8, G: 5 };

const SIGNAL_META = [
  { key: "A", label: "Semantic DNA", desc: "Conceptual overlap between candidate career and role intent", color: "#6366f1" },
  { key: "B", label: "Career Trajectory Arc", desc: "Velocity, depth, progression quality and tenure context", color: "#8b5cf6" },
  { key: "C", label: "Behavioral Pulse", desc: "Engagement, activity recency, public contributions", color: "#06b6d4" },
  { key: "D", label: "Hard Criteria Match", desc: "Binary gate check + partial-credit near-matches", color: "#10b981" },
];

interface FeedbackPanelProps {
  result: AnalysisResult | null;
  feedback: FeedbackState;
  onFeedback: (name: string, vote: "👍" | "👎") => void;
}

export function FeedbackPanel({ result, feedback, onFeedback }: FeedbackPanelProps) {
  if (!result) {
    return (
      <div className="nh-empty-results">
        <div className="nh-empty-icon">🔄</div>
        <h2>No Analysis to Re-rank</h2>
        <p>Run an analysis first, then return here to rate candidates and adapt signal weights.</p>
      </div>
    );
  }

  const allCandidates = [...result.shortlist, ...result.nearMisses];
  const { weights, signals } = feedback;

  const feedbackCount = signals.length;
  const showFormula = feedbackCount >= 3;

  return (
    <motion.div
      className="nh-feedback-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="nh-fb-panel-header">
        <div>
          <h2 className="nh-fb-title">Phase 6 — Adaptive Re-Ranking</h2>
          <p className="nh-fb-subtitle">
            Rate candidates to shift signal weights. After 3+ ratings, I&apos;ll restate the updated formula transparently.
          </p>
        </div>
        <div className="nh-fb-count">
          <span className="nh-fb-count-num">{feedbackCount}</span>
          <span>ratings given</span>
        </div>
      </div>

      {/* Weight visualiser */}
      <div className="nh-weight-card">
        <div className="nh-weight-header">
          <span className="nh-weight-title">Live Signal Weights</span>
          {showFormula && (
            <span className="nh-weight-updated">✓ Updated after {feedbackCount} ratings</span>
          )}
        </div>

        {SIGNAL_META.map(({ key, label, desc, color }) => {
          const base = BASE_WEIGHTS[key as keyof SignalWeights] as number;
          const curr = weights[key as keyof SignalWeights] as number;
          const shift = curr - base;
          return (
            <div key={key} className="nh-weight-row">
              <div className="nh-weight-info">
                <span className="nh-weight-label" style={{ color }}>
                  Signal {key} · {label}
                </span>
                <span className="nh-weight-desc">{desc}</span>
              </div>
              <div className="nh-weight-meter">
                <div className="nh-weight-track">
                  <motion.div
                    className="nh-weight-fill"
                    style={{ background: color }}
                    animate={{ width: `${Math.min(curr / 39, 1) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <span className="nh-weight-val">{curr}%</span>
                {shift !== 0 && (
                  <span className={`nh-weight-shift ${shift > 0 ? "nh-shift-up" : "nh-shift-down"}`}>
                    {shift > 0 ? `+${shift}` : shift}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {showFormula && (
          <motion.div
            className="nh-formula-box"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="nh-formula-label">Updated FitScore Formula</span>
            <code className="nh-formula">
              FitScore = (0.{String(weights.A).padStart(2,"0")}×A) + (0.{String(weights.B).padStart(2,"0")}×B) + (0.{String(weights.C).padStart(2,"0")}×C) + (0.{String(weights.D).padStart(2,"0")}×D) + ChurnPenalty + ChemBonus
            </code>
            <p className="nh-formula-note">Max shift per signal: ±9% from baseline. Formula degeneracy protection active.</p>
          </motion.div>
        )}
      </div>

      {/* Feedback history */}
      {feedbackCount > 0 && (
        <div className="nh-fb-history">
          <span className="nh-fb-history-title">Feedback Log</span>
          {signals.map((sig, i) => (
            <div key={i} className="nh-fb-log-item">
              <span className="nh-fb-log-vote">{sig.vote}</span>
              <span className="nh-fb-log-name">{sig.candidateName}</span>
              <span className="nh-fb-log-time">
                {new Date(sig.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Rate candidates */}
      <div className="nh-fb-candidates">
        <span className="nh-fb-cands-title">Rate Candidates</span>
        <div className="nh-fb-cands-grid">
          {allCandidates.map((c) => {
            const myVotes = signals.filter((s) => s.candidateName === c.name);
            const lastVote = myVotes[myVotes.length - 1]?.vote;
            return (
              <div key={c.name} className="nh-fb-cand-row">
                <div className="nh-fb-cand-info">
                  <div className="nh-fb-cand-avatar">
                    {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <span className="nh-fb-cand-name">{c.name}</span>
                    <span className="nh-fb-cand-score">FitScore: {c.fitScore}</span>
                  </div>
                </div>
                <div className="nh-fb-btn-group">
                  <button
                    className={`nh-fb-btn nh-fb-up ${lastVote === "👍" ? "nh-fb-active" : ""}`}
                    onClick={() => onFeedback(c.name, "👍")}
                    id={`rank-up-${c.name.replace(/\s/g, "-")}`}
                  >
                    👍
                  </button>
                  <button
                    className={`nh-fb-btn nh-fb-down ${lastVote === "👎" ? "nh-fb-active" : ""}`}
                    onClick={() => onFeedback(c.name, "👎")}
                    id={`rank-down-${c.name.replace(/\s/g, "-")}`}
                  >
                    👎
                  </button>
                  {lastVote && (
                    <span className="nh-fb-voted">Voted {myVotes.length}×</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="nh-fb-instructions">
        <div className="nh-fb-rule">
          <span>👍 on candidate</span>
          <span>→ strongest signal weight increases by +3%</span>
        </div>
        <div className="nh-fb-rule">
          <span>👎 on candidate</span>
          <span>→ weakest signal weight decreases by −3%</span>
        </div>
        <div className="nh-fb-rule">
          <span>3+ ratings</span>
          <span>→ updated formula stated transparently before rescoring</span>
        </div>
        <div className="nh-fb-rule">
          <span>±9% cap</span>
          <span>→ no single signal shifts more than 9% from baseline</span>
        </div>
      </div>
    </motion.div>
  );
}
