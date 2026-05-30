# 🧠 NeuralHire v2 — Elite AI Recruitment Intelligence Engine

<div align="center">

![NeuralHire v2](https://img.shields.io/badge/NeuralHire-v2.0-6366f1?style=for-the-badge&logo=brain&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-ff69b4?style=for-the-badge&logo=framer&logoColor=white)

**An elite AI-powered recruitment intelligence platform that doesn't just rank candidates — it understands careers, predicts futures, and protects against bias.**

### 🌐 Live Demo → 
---

## ✨ What is NeuralHire v2?

NeuralHire v2 combines the judgment of a **top-tier executive search partner**, a **behavioural psychologist**, and a **data scientist** into a single intelligent recruitment engine. It processes Job Descriptions and candidate profiles through a rigorous **6-phase analysis pipeline** to deliver ranked, bias-free hiring intelligence.

---

## 🚀 Features

### Phase 0 — Bias Audit
- 🔍 Detects **proxy bias** (credential inflation, prestige proxies)
- 🚫 Flags **gender-coded language** ("rockstar", "ninja", "crushing it")
- 📅 Catches **age proxy** language ("digital native", "recent graduate")
- 📋 Identifies **scope creep** (>12 requirements for mid-level roles)
- 🛡️ Removes candidate name, school, and address from scoring context
- 📊 **Self-Correction** — If bias is detected, candidate data is auto-redacted andJD is flagged before the analysis engine runs.

### Phase 1 — Job Deconstruction
- 🎯 **Role Intent** — What problem does this hire solve?
- 📊 **True Seniority** — Inferred from scope, not inflated title
- 🔒 **Hard Gates** — Non-negotiable qualifications listed explicitly
- 🌊 **Soft Texture** — Culture, pace, autonomy level
- 🔍 **Tacit Skills** — What the JD doesn't say but clearly needs
- 🏆 **Success Archetype** — Ideal candidate's career shape in 2 sentences

### Phase 2 — 7-Signal Extraction

| Signal | Weight | Description |
|--------|--------|-------------|
| **A** — Semantic DNA | 30% | Conceptual overlap between career corpus and role intent |
| **B** — Career Trajectory Arc | 22% | Velocity, pivot quality, progression depth, tenure context |
| **C** — Behavioral Pulse | 18% | Activity recency, engagement depth, open-to-work signals |
| **D** — Hard Criteria Match | 15% | Binary gate check + partial credit for near-matches |
| **E** — Predictive Churn Score | −10 if HIGH | 18-month retention probability estimate |
| **F** — Team Chemistry Index | +8 if ≥8/10 | Skill gap fill + cognitive diversity + friction risk |
| **G** — Explainability Confidence | Modulates band | Data completeness rating (1–5 stars) |

### Phase 3 — Composite FitScore
```
FitScore = (0.30×A) + (0.22×B) + (0.18×C) + (0.15×D) + ChurnPenalty + ChemBonus
```
- Scale: 0–100
- Confidence band derived from data completeness
- Hard fail on gates = candidate removed with reason stated clearly

### Phase 4 — Ranked Shortlist + Hire Briefs
Each shortlisted candidate receives a full **Hire Brief**:
- 📝 One-line thesis a CEO would remember
- 💪 Top 3 signal strengths with evidence citations
- ⚠️ Primary risk — direct, not diplomatic
- 🔎 Second opinion flag (if confidence band >±8pts)
- 📬 Personalised outreach angle
- 🎯 Hypothesis-testing interview probe
- 🔢 Plain-English explainability trail

### Phase 5 — Counterfactual Pipeline
For every candidate scoring 50–65 ("near-misses"):
- **Current Gap** — The single biggest reason they didn't shortlist
- **One Change Away** — Specific experience or signal that would move them to top tier
- **Pipeline Action** → Keep warm / Refer to alternate role / Close the gap first

### Phase 6 — Adaptive Re-Ranking
- Rate candidates 👍 / 👎 to shift signal weights in real time
- 👍 → strongest signal weight +3%
- 👎 → weakest signal weight −3%
- After 3+ ratings → updated formula stated transparently before rescoring
- ±9% cap — no single signal shifts more than 9% from baseline

---

## 🖥️ Screenshots

> **Configure** — Paste your JD and candidate profiles, load sample data instantly

> **Intelligence Report** — Bias audit, JD deconstruction, ranked shortlist with expandable Hire Briefs

> **Adaptive Re-rank** — Live weight visualizer, feedback log, formula display

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + Custom CSS (white theme) |
| Animation | Framer Motion |
| Icons | Lucide React |
| State | React useState (client components) |
| Fonts | Inter + JetBrains Mono (Google Fonts) |

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/bahathraheel/NEURAL-HIRE.git

# Navigate to the project directory
cd NEURAL-HIRE/command-center

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Open in Browser
```
http://localhost:3000/neuralhire
```

---

## 📁 Project Structure

```
NEURAL-HIRE/
├── command-center/
│   ├── src/
│   │   ├── app/
│   │   │   ├── neuralhire/
│   │   │   │   ├── page.tsx          # Main NeuralHire page
│   │   │   │   ├── layout.tsx        # Route layout + SEO metadata
│   │   │   │   └── neuralhire.css    # Premium white theme styles
│   │   │   ├── globals.css           # Global design tokens
│   │   │   └── layout.tsx            # Root layout
│   │   ├── components/
│   │   │   └── neuralhire/
│   │   │       ├── NeuralHireEngine.ts   # 6-phase analysis engine
│   │   │       ├── NeuralHireHeader.tsx  # Animated header
│   │   │       ├── InputPanel.tsx        # JD + candidate inputs
│   │   │       ├── ResultsPanel.tsx      # Full results display
│   │   │       └── FeedbackPanel.tsx     # Adaptive re-ranking UI
│   │   └── types/
│   │       └── neuralhire.ts         # TypeScript type definitions
│   ├── package.json
│   └── README.md
├── README.md                             # Main repository README
└── .gitignore                            # Repository .gitignore
```

---

## 🎯 Usage Guide

### 1. Configure
- Paste your **Job Description** in the left panel
- Paste **candidate profiles** in the right panel, separated by `---`
- Optionally add **team composition data** for chemistry scoring
- Click **"Load Sample Data"** to instantly see a demo with a Senior PM role + 4 candidates

### 2. Run Analysis
Click **⚡ Run NeuralHire Analysis** — the 6-phase engine runs immediately.

### 3. Review Intelligence Report
- **Bias Audit** — Green pass or flagged issues
- **JD Deconstruction** — Role intent, seniority, gates, tacit skills, archetype
- **Ranked Shortlist** — Click any card to expand the full Hire Brief
- **Near-Miss Pipeline** — Counterfactual briefs for 50–65 scorers

### 4. Adaptive Re-Ranking
Switch to the **🔄 Adaptive Re-rank** tab to:
- Rate candidates with 👍 / 👎
- Watch signal weights update in real time
- See the updated formula after 3+ ratings

---

## 🔑 Ranking Principles

- ✅ **Never rank by prestige proxies** — brand names and school tiers don't score
- 📈 **Trajectory beats snapshot** — 78 with upward arc outranks 80 at plateau
- 🕐 **Recency matters** — 5-year-old achievements worth ~60% of equivalent recent ones
- 🏗️ **Context multiplier** — same achievement in resource-constrained env scores 1.2×
- ⚠️ **Churn risk is first-class** — not a footnote
- 🌍 **Diversity flag** — homogeneous top-5 shortlists trigger an alert

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👤 Author

**Bahath Raheel**
- GitHub: [@bahathraheel](https://github.com/bahathraheel)
- Repository: [NEURAL-HIRE](https://github.com/bahathraheel/NEURAL-HIRE)

---

<div align="center">

Built with ❤️ as part of the **Anti Gravity Datathon**

⭐ Star this repo if NeuralHire v2 helped you hire smarter!

</div>
