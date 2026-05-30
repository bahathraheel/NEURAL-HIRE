"use client";

import { motion } from "framer-motion";

export function NeuralHireHeader() {
  return (
    <motion.header
      className="nh-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="nh-header-logo">
        <div className="nh-logo-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" stroke="url(#lg1)" strokeWidth="1.5" />
            <circle cx="16" cy="10" r="3" fill="url(#lg2)" />
            <circle cx="10" cy="22" r="3" fill="url(#lg2)" />
            <circle cx="22" cy="22" r="3" fill="url(#lg2)" />
            <line x1="16" y1="13" x2="10" y2="19" stroke="url(#lg3)" strokeWidth="1.2" strokeOpacity="0.7" />
            <line x1="16" y1="13" x2="22" y2="19" stroke="url(#lg3)" strokeWidth="1.2" strokeOpacity="0.7" />
            <line x1="10" y1="22" x2="22" y2="22" stroke="url(#lg3)" strokeWidth="1.2" strokeOpacity="0.7" />
            <defs>
              <linearGradient id="lg1" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a5b4fc" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="lg3" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c7d2fe" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <h1 className="nh-logo-title">NeuralHire <span className="nh-logo-v2">v2</span></h1>
          <p className="nh-logo-sub">Elite AI Recruitment Intelligence Engine</p>
        </div>
      </div>

      <div className="nh-header-badges">
        <span className="nh-pill nh-pill-violet">6-Phase Analysis</span>
        <span className="nh-pill nh-pill-indigo">Bias Audited</span>
        <span className="nh-pill nh-pill-purple">Adaptive Weights</span>
        <div className="nh-status-dot">
          <span className="nh-status-pulse" />
          <span className="nh-status-text">Engine Ready</span>
        </div>
      </div>
    </motion.header>
  );
}
