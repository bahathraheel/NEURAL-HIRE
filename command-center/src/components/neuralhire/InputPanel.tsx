"use client";

import { motion } from "framer-motion";
import TextType from "./TextType";
import { NeuralCore3D } from "./NeuralCore3D";

const SAMPLE_JD = `Senior Product Manager – AI Platform

We are looking for a Senior Product Manager to own the roadmap for our AI Platform team. You will work closely with engineering, design, and data science to ship products that serve 5M+ users globally.

Must have:
- 5+ years of product management experience
- Experience shipping ML/AI features to production
- Strong analytical skills and comfort with SQL
- Proven ability to drive cross-functional roadmaps

Nice to have:
- Prior experience at a Series B or later stage startup
- Background in B2B SaaS
- Familiarity with LLMs and prompt engineering

You are an autonomous self-starter who thrives in a fast-paced, data-driven environment. You communicate crisply and can influence without authority. You'll own your roadmap end-to-end — no hand-holding.`;

const SAMPLE_CANDIDATES = `Candidate 1: Priya Sharma
Senior PM at FinTech startup (2021–present). Led AI-powered fraud detection product from 0 to 1, serving 2M users. Promoted after 18 months. SQL proficient; ran weekly analytics reviews with data science team. Previous: Associate PM at e-commerce platform (2018–2021). Computer Science, University of Delhi.
GitHub: active. Published 2 articles on product strategy. Open to work.

---

Candidate 2: Marcus Chen
Product Manager at enterprise SaaS (2019–present). Managed integrations roadmap for 500-seat B2B clients. MBA. Worked with ML team on recommendation engine but did not own the roadmap. Tenure at 3 companies in 4 years. Currently looking for growth opportunities.

---

Candidate 3: Aiko Watanabe
Director of Product at Series C startup (2020–present). Managed 4 PMs, owned 3 product lines. Led LLM-powered search feature that increased engagement 40%. Prior: PM at mid-stage startup. Speaker at ProductCon 2023. Strong stakeholder management background.

---

Candidate 4: James Okafor
Associate PM at consulting firm (2023–present, 10 months). Intern at tech company (8 months). Recent graduate. Enthusiastic about AI. No production ML experience. Strong academic record.`;

const SAMPLE_TEAM = `Existing team: 2 backend engineers, 1 data scientist (strong ML background), 1 designer. Team lacks a strong product strategist. No current PM. Team tends toward over-engineering — needs someone who can bring customer focus and business thinking.`;

interface InputPanelProps {
  jd: string;
  setJd: (v: string) => void;
  candidates: string;
  setCandidates: (v: string) => void;
  teamData: string;
  setTeamData: (v: string) => void;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

export function InputPanel({
  jd, setJd, candidates, setCandidates,
  teamData, setTeamData, isAnalyzing, onAnalyze,
}: InputPanelProps) {

  const loadSample = () => {
    setJd(SAMPLE_JD);
    setCandidates(SAMPLE_CANDIDATES);
    setTeamData(SAMPLE_TEAM);
  };

  const canAnalyze = jd.trim().length > 50 && candidates.trim().length > 50;

  return (
    <motion.div
      className="nh-input-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Premium Hero Section with Typing Animation and Interactive 3D Core */}
      <div className="nh-hero-banner">
        <div className="nh-hero-content">
          <div className="nh-hero-badge">
            <span className="nh-hero-badge-dot" />
            Next-Gen Recruitment Intelligence
          </div>
          
          <h1 className="nh-hero-title">
            <TextType 
              text={["Elite-hire", "Deep Talent Analysis", "Bias-Free Evaluation"]}
              typingSpeed={75}
              pauseDuration={2000}
              showCursor={true}
              cursorCharacter="▊"
              cursorClassName="nh-hero-cursor"
            />
          </h1>

          <p className="nh-hero-desc">
            An elite AI-powered recruitment engine combining executive search judgment, 
            behavioural science, and deep analytics into a rigorous 6-phase scoring pipeline. 
            Paste your requirements and profiles below to begin.
          </p>

          <div className="nh-hero-actions">
            <button className="nh-sample-btn-hero" onClick={loadSample} id="btn-load-sample">
              ⚡ Load Sample Intelligence Profile
            </button>
          </div>
        </div>

        <div className="nh-hero-visual">
          <NeuralCore3D />
          <div className="nh-hero-visual-label">
            <span>Core Evaluation Matrix</span>
            <span className="nh-hero-visual-sub">Hover to interact in 3D</span>
          </div>
        </div>
      </div>

      <div className="nh-input-grid">
        {/* JD Panel */}
        <div className="nh-input-block">
          <label className="nh-label" htmlFor="jd-input">
            <span className="nh-label-badge nh-badge-violet">Phase 0–1</span>
            Job Description
          </label>
          <p className="nh-label-hint">Paste the full JD. Elite-hire will audit for bias before analysis.</p>
          <textarea
            id="jd-input"
            className="nh-textarea"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste your Job Description here…&#10;&#10;Include requirements, responsibilities, must-haves, nice-to-haves, and any team / culture context."
            rows={16}
          />
          <div className="nh-char-count">{jd.length.toLocaleString()} chars</div>
        </div>

        {/* Candidates Panel */}
        <div className="nh-input-block">
          <label className="nh-label" htmlFor="candidates-input">
            <span className="nh-label-badge nh-badge-indigo">Phase 2–4</span>
            Candidate Profiles
          </label>
          <p className="nh-label-hint">Paste profiles separated by <code>---</code> on its own line. Include name, experience, skills, and any available context.</p>
          <textarea
            id="candidates-input"
            className="nh-textarea"
            value={candidates}
            onChange={(e) => setCandidates(e.target.value)}
            placeholder="Candidate 1: Jane Doe&#10;Senior Engineer at Acme Corp (2020–present)…&#10;&#10;---&#10;&#10;Candidate 2: John Smith&#10;…"
            rows={16}
          />
          <div className="nh-char-count">{candidates.length.toLocaleString()} chars</div>
        </div>
      </div>

      {/* Team Data */}
      <div className="nh-input-block">
        <label className="nh-label" htmlFor="team-input">
          <span className="nh-label-badge nh-badge-purple">Signal F — Optional</span>
          Team Composition Data
        </label>
        <p className="nh-label-hint">Describe existing team skills, gaps, and working styles. Enables Team Chemistry Index scoring (+8 bonus).</p>
        <textarea
          id="team-input"
          className="nh-textarea nh-textarea-sm"
          value={teamData}
          onChange={(e) => setTeamData(e.target.value)}
          placeholder="e.g. Existing team: 2 backend engineers, 1 designer. Team lacks data/analytics skills. Tends to be introverted — needs an outward-facing communicator…"
          rows={4}
        />
      </div>

      {/* CTA */}
      <div className="nh-cta-row">
        <div className="nh-cta-info">
          {!canAnalyze && (
            <span className="nh-cta-hint">Add a Job Description and at least one candidate to begin.</span>
          )}
        </div>
        <button
          className={`nh-analyze-btn ${canAnalyze ? "nh-analyze-btn-ready" : "nh-analyze-btn-disabled"}`}
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          id="btn-analyze"
        >
          {isAnalyzing ? (
            <>
              <span className="nh-spinner" />
              Running 6-Phase Analysis…
            </>
          ) : (
            <>
              <span>⚡</span>
              Run Elite-hire Analysis
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
