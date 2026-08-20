import type { DomainDefinition, MaturityBand, PackageDefinition } from "./types.ts";

const questions = (domain: string) => Array.from({ length: 7 }, (_, index) => `${domain}-Q${index + 1}`);

export const ASSESSMENT_CONFIG = {
  domains: [
    { id: "D1", name: "Work Execution & Digitization", weight: 10, questionIds: questions("D1") },
    { id: "D2", name: "Performance & Quality Intelligence", weight: 15, questionIds: questions("D2") },
    { id: "D3", name: "Workforce Planning & Optimization", weight: 15, questionIds: questions("D3") },
    { id: "D4", name: "Data Infrastructure & Integration", weight: 25, questionIds: questions("D4") },
    { id: "D5", name: "Decision Intelligence & AI Enablement", weight: 20, questionIds: questions("D5") },
    { id: "D6", name: "Agent Experience & Interaction Execution", weight: 15, questionIds: questions("D6") }
  ] satisfies readonly DomainDefinition[],
  maturityBands: [
    { min: 0, max: 47, label: "Baseline" },
    { min: 48, max: 61, label: "Enhanced" },
    { min: 62, max: 75, label: "Above Average" },
    { min: 76, max: 89, label: "High Performing" },
    { min: 90, max: 100, label: "Tech-Led" }
  ] satisfies readonly { min: number; max: number; label: MaturityBand }[],
  packages: [
    { code: "P1", name: "Foundation Build", min: 0, max: 47 },
    { code: "P2", name: "Operational Digitization", min: 48, max: 61 },
    { code: "P3", name: "Intelligence Activation", min: 62, max: 75 },
    { code: "P4", name: "AI & Automation Scale", min: 76, max: 89 },
    { code: "P5", name: "Tech-Led Optimization", min: 90, max: 100 }
  ] satisfies readonly PackageDefinition[],
  thresholds: {
    underdevelopedDomainMax: 61,
    techLedDomainMin: 90,
    decisionIntelligenceP5Minimum: 76,
    packageBoundaryTolerance: 3,
    outlierGap: 20,
    moderateConfidenceMin: 70,
    highConfidenceMin: 85
  },
  governance: {
    privacyQuestionId: "D4-Q5",
    aiGovernanceQuestionId: "D5-Q2",
    maximumPackage: "P2" as const
  }
} as const;
