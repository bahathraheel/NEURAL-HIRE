"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AuthModal from "@/components/neuralhire/AuthModal";
import { NeuralHireEngine } from "@/components/neuralhire/NeuralHireEngine";
import { NeuralHireHeader } from "@/components/neuralhire/NeuralHireHeader";
import { InputPanel } from "@/components/neuralhire/InputPanel";
import { ResultsPanel } from "@/components/neuralhire/ResultsPanel";
import { FeedbackPanel } from "@/components/neuralhire/FeedbackPanel";
import type { AnalysisResult, FeedbackState } from "@/types/neuralhire";

export default function NeuralHirePage() {
  const [jd, setJd] = useState("");
  const [candidates, setCandidates] = useState("");
  const [teamData, setTeamData] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({
    signals: [],
    weights: {
      A: 30, B: 22, C: 18, D: 15, E: -10, F: 8, G: 5,
    },
  });
  const [activeTab, setActiveTab] = useState<"input" | "results" | "feedback">(
    "input"
  );

  const handleAnalyze = async () => {
    if (!jd.trim() || !candidates.trim()) return;
    setIsAnalyzing(true);
    setActiveTab("results");
    try {
      const analysisResult = NeuralHireEngine.analyze({
        jd,
        candidates,
        teamData,
        weights: feedback.weights,
      });
      setResult(analysisResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFeedback = (candidateName: string, vote: "👍" | "👎") => {
    const newSignal = { candidateName, vote, timestamp: Date.now() };
    const newSignals = [...feedback.signals, newSignal];
    const newWeights = NeuralHireEngine.updateWeights(
      feedback.weights,
      newSignals,
      result
    );
    setFeedback({ signals: newSignals, weights: newWeights });

    // Re-score with new weights
    if (result) {
      const reScored = NeuralHireEngine.analyze({
        jd,
        candidates,
        teamData,
        weights: newWeights,
      });
      setResult(reScored);
    }
  };

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="neuralhire-root">
        <div className="nh-bg">
          <div className="nh-bg-orb nh-bg-orb-1" />
          <div className="nh-bg-orb nh-bg-orb-2" />
          <div className="nh-bg-orb nh-bg-orb-3" />
          <div className="nh-bg-grid" />
        </div>
        <div className="nh-analyzing" style={{ height: "100vh" }}>
          <div className="nh-spinner" style={{ width: 40, height: 40, borderTopColor: '#6366f1' }} />
          <h2 className="nh-analyzing-title">Establishing Authentication Session…</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="neuralhire-root">
        <div className="nh-bg">
          <div className="nh-bg-orb nh-bg-orb-1" />
          <div className="nh-bg-orb nh-bg-orb-2" />
          <div className="nh-bg-orb nh-bg-orb-3" />
          <div className="nh-bg-grid" />
        </div>
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="neuralhire-root">
      {/* Animated background */}
      <div className="nh-bg">
        <div className="nh-bg-orb nh-bg-orb-1" />
        <div className="nh-bg-orb nh-bg-orb-2" />
        <div className="nh-bg-orb nh-bg-orb-3" />
        <div className="nh-bg-grid" />
      </div>

      <div className="nh-layout">
        <NeuralHireHeader user={user} />

        {/* Tab bar */}
        <div className="nh-tabs">
          <button
            className={`nh-tab ${activeTab === "input" ? "nh-tab-active" : ""}`}
            onClick={() => setActiveTab("input")}
            id="tab-input"
          >
            <span className="nh-tab-icon">⚙️</span>
            <span>Configure</span>
          </button>
          <button
            className={`nh-tab ${activeTab === "results" ? "nh-tab-active" : ""}`}
            onClick={() => setActiveTab("results")}
            disabled={!result && !isAnalyzing}
            id="tab-results"
          >
            <span className="nh-tab-icon">🧠</span>
            <span>Intelligence Report</span>
            {result && (
              <span className="nh-tab-badge">
                {result.shortlist.length}
              </span>
            )}
          </button>
          <button
            className={`nh-tab ${activeTab === "feedback" ? "nh-tab-active" : ""}`}
            onClick={() => setActiveTab("feedback")}
            disabled={!result}
            id="tab-feedback"
          >
            <span className="nh-tab-icon">🔄</span>
            <span>Adaptive Re-rank</span>
            {feedback.signals.length > 0 && (
              <span className="nh-tab-badge nh-tab-badge-amber">
                {feedback.signals.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="nh-content">
          {activeTab === "input" && (
            <InputPanel
              jd={jd}
              setJd={setJd}
              candidates={candidates}
              setCandidates={setCandidates}
              teamData={teamData}
              setTeamData={setTeamData}
              isAnalyzing={isAnalyzing}
              onAnalyze={handleAnalyze}
            />
          )}
          {activeTab === "results" && (
            <ResultsPanel
              result={result}
              isAnalyzing={isAnalyzing}
              onFeedback={handleFeedback}
              onSwitchFeedback={() => setActiveTab("feedback")}
            />
          )}
          {activeTab === "feedback" && (
            <FeedbackPanel
              result={result}
              feedback={feedback}
              onFeedback={handleFeedback}
            />
          )}
        </div>
      </div>
    </div>
  );
}
