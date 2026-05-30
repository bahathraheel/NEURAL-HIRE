import type { Metadata } from "next";
import "./neuralhire.css";

export const metadata: Metadata = {
  title: "NeuralHire v2 | Elite AI Recruitment Intelligence Engine",
  description:
    "NeuralHire v2 — 6-phase AI recruitment intelligence. Bias auditing, semantic candidate scoring, churn prediction, team chemistry analysis, and adaptive re-ranking. Built for elite hiring teams.",
  keywords: [
    "AI recruitment",
    "candidate scoring",
    "bias audit",
    "FitScore",
    "NeuralHire",
    "hiring intelligence",
    "talent acquisition",
  ],
};

export default function NeuralHireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
