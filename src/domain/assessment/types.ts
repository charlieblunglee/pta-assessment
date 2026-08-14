export type QuestionScore = 1 | 2 | 3;
export type DomainId = "D1" | "D2" | "D3" | "D4" | "D5" | "D6";
export type PackageCode = "P1" | "P2" | "P3" | "P4" | "P5";
export type HealthcareArchetype = "nonclinical" | "clinical" | "him";
export type MaturityBand = "Baseline" | "Enhanced" | "Above Average" | "High Performing" | "Tech-Led";
export type ConfidenceLevel = "Low" | "Moderate" | "High";
export type AssessmentDisposition =
  | "Recommendation Ready"
  | "Targeted Further Analysis Recommended"
  | "Deep-Dive Assessment Required";

export interface AnswerInput {
  questionId: string;
  domainId: DomainId;
  value?: QuestionScore | "yellow" | "green" | "blue" | null;
  hasArtifact?: boolean;
  evidenceNote?: string | null;
}

export interface DomainDefinition {
  id: DomainId;
  name: string;
  weight: number;
  questionIds: readonly string[];
}

export interface PackageDefinition {
  code: PackageCode;
  name: string;
  min: number;
  max: number;
}

export interface ScoredDomain {
  status: "scored";
  id: DomainId;
  name: string;
  weight: number;
  answeredCount: 7;
  rawScore: number;
  preciseScore: number;
  normalizedScore: number;
  maturity: MaturityBand;
}

export interface UnscoredDomain {
  status: "not_scored";
  id: DomainId;
  name: string;
  weight: number;
  answeredCount: number;
  rawScore: null;
  preciseScore: null;
  normalizedScore: null;
  maturity: "Not Scored";
}

export type DomainResult = ScoredDomain | UnscoredDomain;

export interface RuleResult {
  rule: string;
  reason: string;
  package: PackageCode;
}

export interface GovernanceCap {
  gate: string;
  reason: string;
  capPackage: PackageCode;
  changed: boolean;
}

export interface FurtherAnalysisTrigger {
  type: string;
  detail: string;
}

export interface AssessmentInput {
  answers: readonly AnswerInput[];
  archetype: HealthcareArchetype;
  mixedWork?: boolean;
}

export interface RecommendationExplanation {
  basePackage: PackageDefinition;
  basePackageReason: string;
  triggeredOverrides: readonly RuleResult[];
  complianceCaps: readonly GovernanceCap[];
  finalPackage: PackageDefinition;
  lowestDomain: ScoredDomain;
  strongestDomain: ScoredDomain;
  primarySolutionFocus: string;
  confidenceScore: number;
  confidenceLevel: ConfidenceLevel;
  furtherAnalysisTriggers: readonly FurtherAnalysisTrigger[];
  assessmentDisposition: AssessmentDisposition;
  summary: string;
}

export interface CompletedAssessmentResult {
  status: "scored";
  domainResults: readonly ScoredDomain[];
  programPreciseScore: number;
  programScore: number;
  maturity: MaturityBand;
  basePackage: PackageDefinition;
  finalPackage: PackageDefinition;
  triggeredOverrides: readonly RuleResult[];
  healthcareGovernanceCaps: readonly GovernanceCap[];
  lowestDomain: ScoredDomain;
  strongestDomain: ScoredDomain;
  underdevelopedDomainCount: number;
  techLedDomainCount: number;
  confidenceScore: number;
  confidenceLevel: ConfidenceLevel;
  assessmentDisposition: AssessmentDisposition;
  recommendedDeepDive: DomainId;
  furtherAnalysisTriggers: readonly FurtherAnalysisTrigger[];
  recommendationExplanation: RecommendationExplanation;
}

export interface IncompleteAssessmentResult {
  status: "not_scored";
  domainResults: readonly DomainResult[];
  programPreciseScore: null;
  programScore: null;
  maturity: "Not Scored";
  missingDomainIds: readonly DomainId[];
}

export type AssessmentResult = CompletedAssessmentResult | IncompleteAssessmentResult;
