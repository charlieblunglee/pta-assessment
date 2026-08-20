import { ASSESSMENT_CONFIG as CONFIG } from "./config.ts";
import type {
  AnswerInput, AssessmentDisposition, AssessmentInput, AssessmentResult, ConfidenceLevel,
  DomainDefinition, DomainResult, FurtherAnalysisTrigger, GovernanceCap, MaturityBand,
  PackageCode, PackageDefinition, QuestionScore, RecommendationExplanation, RuleResult, ScoredDomain
} from "./types.ts";

export function calculateQuestionScore(value: AnswerInput["value"]): QuestionScore | null {
  if (value === 1 || value === "yellow") return 1;
  if (value === 2 || value === "green") return 2;
  if (value === 3 || value === "blue") return 3;
  return null;
}

export function calculateDomainRawScore(scores: readonly (QuestionScore | null)[]): number | null {
  if (scores.length !== 7 || scores.some((score) => score === null)) return null;
  return (scores as readonly QuestionScore[]).reduce<number>((total, score) => total + score, 0);
}

export function normalizeDomainScore(rawScore: number | null): number | null {
  if (rawScore === null) return null;
  if (!Number.isInteger(rawScore) || rawScore < 7 || rawScore > 21) {
    throw new RangeError("A completed domain raw score must be an integer from 7 through 21.");
  }
  return 20 + ((rawScore - 7) / 14) * 80;
}

export function getMaturityBand(score: number | null): MaturityBand | "Not Scored" {
  if (score === null) return "Not Scored";
  return CONFIG.maturityBands.find((band) => score >= band.min && score <= band.max)?.label ?? "Baseline";
}

export function getBasePackage(score: number): PackageDefinition {
  const selected = CONFIG.packages.find((item) => score >= item.min && score <= item.max);
  if (!selected) throw new RangeError("Program score must be between 0 and 100.");
  return selected;
}

export function calculateProgramScore(domains: readonly DomainResult[]): number | null {
  if (domains.length !== 6 || domains.some((domain) => domain.status !== "scored")) return null;
  return (domains as readonly ScoredDomain[]).reduce((total, domain) => total + domain.preciseScore * domain.weight / 100, 0);
}

function packageByCode(code: PackageCode): PackageDefinition {
  return CONFIG.packages.find((item) => item.code === code)!;
}

function capPackage(current: PackageDefinition, maximum: PackageCode): PackageDefinition {
  return Number(current.code.slice(1)) > Number(maximum.slice(1)) ? packageByCode(maximum) : current;
}

export function evaluateDomainOverrides(domains: readonly ScoredDomain[], basePackage: PackageDefinition): {
  package: PackageDefinition; overrides: RuleResult[];
} {
  const byId = (id: string) => domains.find((domain) => domain.id === id)!;
  const underdeveloped = domains.filter((domain) => domain.preciseScore <= CONFIG.thresholds.underdevelopedDomainMax);
  const techLed = domains.filter((domain) => domain.preciseScore >= CONFIG.thresholds.techLedDomainMin);
  const overrides: RuleResult[] = [];
  let selected = basePackage;

  if (byId("D4").preciseScore <= CONFIG.thresholds.underdevelopedDomainMax) {
    selected = packageByCode("P1");
    overrides.push({ rule: "Data Infrastructure Foundation Override", reason: "Data infrastructure is foundational to all downstream automation, intelligence, and AI.", package: "P1" });
  } else if (underdeveloped.length >= 3) {
    selected = packageByCode("P1");
    overrides.push({ rule: "Broad Foundation Gap", reason: "The program has broad foundational gaps that need stabilization before advanced technology investment.", package: "P1" });
  } else if (byId("D1").preciseScore <= CONFIG.thresholds.underdevelopedDomainMax || byId("D3").preciseScore <= CONFIG.thresholds.underdevelopedDomainMax) {
    const capped = capPackage(selected, "P2");
    if (capped.code !== selected.code) {
      selected = capped;
      overrides.push({ rule: "Work Execution / Workforce Override", reason: "Core workflow execution or workforce management remains substantially manual.", package: "P2" });
    }
  }

  if (!overrides.length && techLed.length >= 4 && byId("D4").preciseScore >= 90 && byId("D5").preciseScore >= 90) {
    selected = packageByCode("P5");
    overrides.push({ rule: "Tech-Led Qualification", reason: "At least four domains are Tech-Led, including Data Infrastructure and Decision Intelligence.", package: "P5" });
  }

  if (selected.code === "P5" && byId("D5").preciseScore < CONFIG.thresholds.decisionIntelligenceP5Minimum) {
    selected = packageByCode("P4");
    overrides.push({ rule: "Decision Intelligence Constraint", reason: "Decision Intelligence is below the configured P5 qualification threshold.", package: "P4" });
  }
  return { package: selected, overrides };
}

export function evaluateHealthcareGovernanceCaps(
  current: PackageDefinition, input: AssessmentInput
): { package: PackageDefinition; caps: GovernanceCap[] } {
  const answer = (questionId: string) => calculateQuestionScore(input.answers.find((item) => item.questionId === questionId)?.value);
  const caps: GovernanceCap[] = [];
  let selected = current;
  if (answer(CONFIG.governance.privacyQuestionId) === 1) {
    const before = selected;
    selected = capPackage(selected, CONFIG.governance.maximumPackage);
    caps.push({ gate: "Privacy, Security & PHI Controls", reason: "Privacy, security, and PHI controls require remediation before advanced intelligence or AI solutions should be scaled.", capPackage: "P2", changed: before.code !== selected.code });
  }
  if ((input.archetype === "clinical" || input.archetype === "him") && answer(CONFIG.governance.aiGovernanceQuestionId) === 1) {
    const before = selected;
    selected = capPackage(selected, CONFIG.governance.maximumPackage);
    caps.push({ gate: "Clinical / HIM AI Governance", reason: "Clinical or coding AI governance requires further development before advanced AI-enabled solutions should be recommended.", capPackage: "P2", changed: before.code !== selected.code });
  }
  return { package: selected, caps };
}

export function determineFinalPackage(basePackage: PackageDefinition, domains: readonly ScoredDomain[], input: AssessmentInput) {
  const domainDecision = evaluateDomainOverrides(domains, basePackage);
  const governanceDecision = evaluateHealthcareGovernanceCaps(domainDecision.package, input);
  return { finalPackage: governanceDecision.package, triggeredOverrides: domainDecision.overrides, healthcareGovernanceCaps: governanceDecision.caps };
}

export function determineLowestDomain(domains: readonly ScoredDomain[]): ScoredDomain {
  return [...domains].sort((a, b) => a.preciseScore - b.preciseScore || a.id.localeCompare(b.id))[0];
}

export function determineStrongestDomain(domains: readonly ScoredDomain[]): ScoredDomain {
  return [...domains].sort((a, b) => b.preciseScore - a.preciseScore || a.id.localeCompare(b.id))[0];
}

export function calculateAssessmentConfidence(answers: readonly AnswerInput[]): { score: number; level: ConfidenceLevel } {
  const evidenced = answers.filter((answer) => answer.hasArtifact || Boolean(answer.evidenceNote?.trim())).length;
  const score = Math.round(evidenced / 42 * 100);
  const level: ConfidenceLevel = score >= CONFIG.thresholds.highConfidenceMin ? "High" : score >= CONFIG.thresholds.moderateConfidenceMin ? "Moderate" : "Low";
  return { score, level };
}

export function evaluateFurtherAnalysis(
  domains: readonly ScoredDomain[], programScore: number, confidence: { score: number; level: ConfidenceLevel },
  caps: readonly GovernanceCap[], input: AssessmentInput
): { triggers: FurtherAnalysisTrigger[]; disposition: AssessmentDisposition } {
  const triggers: FurtherAnalysisTrigger[] = [];
  const lowest = determineLowestDomain(domains);
  const underdeveloped = domains.filter((domain) => domain.preciseScore <= 61);
  const techLed = domains.filter((domain) => domain.preciseScore >= 90);
  if (confidence.score < 70) triggers.push({ type: "Low Evidence", detail: "Most responses were submitted without an evidence note or artifact. The recommendation is directional until a consultant validates how the priority workflow operates in practice." });
  else if (confidence.score < 85) triggers.push({ type: "Targeted Validation", detail: "Selected findings should be validated before final solution design." });
  if ([48, 62, 76, 90].some((boundary) => Math.abs(programScore - boundary) <= CONFIG.thresholds.packageBoundaryTolerance)) triggers.push({ type: "Package Boundary Validation", detail: "A small scoring difference could change the maturity tier." });
  const otherMean = domains.filter((domain) => domain.id !== lowest.id).reduce((sum, domain) => sum + domain.preciseScore, 0) / 5;
  if (otherMean - lowest.preciseScore >= CONFIG.thresholds.outlierGap) triggers.push({ type: "Domain Deep Dive Recommended", detail: `${lowest.id} — ${lowest.name} is materially below the remaining domain profile.` });
  if (techLed.length >= 2 && underdeveloped.length >= 1) triggers.push({ type: "Mixed Maturity Profile", detail: "Highly mature capabilities coexist with one or more under-developed domains." });
  if (caps.length) {
    const gateIds = [CONFIG.governance.privacyQuestionId, CONFIG.governance.aiGovernanceQuestionId];
    const weakEvidence = gateIds.some((id) => { const a = input.answers.find((item) => item.questionId === id); return calculateQuestionScore(a?.value) === 1 && !a?.hasArtifact && !a?.evidenceNote?.trim(); });
    if (weakEvidence) triggers.push({ type: "Governance Deep Dive", detail: "A healthcare governance gate has limited supporting evidence." });
  }
  if (input.mixedWork) triggers.push({ type: "Mixed Healthcare Archetype", detail: "Assess each materially different line of business or archetype separately." });
  const disposition: AssessmentDisposition = confidence.score < 70 || triggers.some((item) => item.type === "Governance Deep Dive")
    ? "Deep-Dive Assessment Required"
    : triggers.length ? "Targeted Further Analysis Recommended" : "Recommendation Ready";
  return { triggers, disposition };
}

export function buildRecommendationExplanation(args: Omit<RecommendationExplanation, "summary">): RecommendationExplanation {
  const overrideText = args.triggeredOverrides.length ? args.triggeredOverrides.map((item) => item.reason).join(" ") : "No foundational package override was triggered.";
  const capText = args.complianceCaps.length ? args.complianceCaps.map((item) => item.reason).join(" ") : "No healthcare governance cap was triggered.";
  return { ...args, summary: `The weighted program score supports ${args.basePackage.code} — ${args.basePackage.name}. ${overrideText} ${capText} ${args.lowestDomain.id} — ${args.lowestDomain.name} is the primary focus of the ${args.finalPackage.code} — ${args.finalPackage.name} roadmap.` };
}

function scoreDomain(definition: DomainDefinition, answers: readonly AnswerInput[]): DomainResult {
  const scores = definition.questionIds.map((questionId) => calculateQuestionScore(answers.find((answer) => answer.questionId === questionId)?.value));
  const answeredCount = scores.filter((score) => score !== null).length;
  const rawScore = calculateDomainRawScore(scores);
  const preciseScore = normalizeDomainScore(rawScore);
  if (rawScore === null || preciseScore === null) return { status: "not_scored", id: definition.id, name: definition.name, weight: definition.weight, answeredCount, rawScore: null, preciseScore: null, normalizedScore: null, maturity: "Not Scored" };
  return { status: "scored", id: definition.id, name: definition.name, weight: definition.weight, answeredCount: 7, rawScore, preciseScore, normalizedScore: Math.round(preciseScore), maturity: getMaturityBand(Math.round(preciseScore)) as MaturityBand };
}

export function evaluateAssessment(input: AssessmentInput): AssessmentResult {
  const domainResults = CONFIG.domains.map((domain) => scoreDomain(domain, input.answers));
  const missingDomainIds = domainResults.filter((domain) => domain.status === "not_scored").map((domain) => domain.id);
  if (missingDomainIds.length) return { status: "not_scored", domainResults, programPreciseScore: null, programScore: null, maturity: "Not Scored", missingDomainIds };
  const scoredDomains = domainResults as ScoredDomain[];
  const programPreciseScore = calculateProgramScore(scoredDomains)!;
  const programScore = Math.round(programPreciseScore);
  const basePackage = getBasePackage(programScore);
  const decision = determineFinalPackage(basePackage, scoredDomains, input);
  const lowestDomain = determineLowestDomain(scoredDomains);
  const strongestDomain = determineStrongestDomain(scoredDomains);
  const confidence = calculateAssessmentConfidence(input.answers);
  const further = evaluateFurtherAnalysis(scoredDomains, programPreciseScore, confidence, decision.healthcareGovernanceCaps, input);
  const explanation = buildRecommendationExplanation({ basePackage, basePackageReason: `Weighted score ${programScore} falls in the ${basePackage.min}-${basePackage.max} band.`, triggeredOverrides: decision.triggeredOverrides, complianceCaps: decision.healthcareGovernanceCaps, finalPackage: decision.finalPackage, lowestDomain, strongestDomain, primarySolutionFocus: `${lowestDomain.id} - ${lowestDomain.name}`, confidenceScore: confidence.score, confidenceLevel: confidence.level, furtherAnalysisTriggers: further.triggers, assessmentDisposition: further.disposition });
  return { status: "scored", domainResults: scoredDomains, programPreciseScore, programScore, maturity: getMaturityBand(programScore) as MaturityBand, basePackage, finalPackage: decision.finalPackage, triggeredOverrides: decision.triggeredOverrides, healthcareGovernanceCaps: decision.healthcareGovernanceCaps, lowestDomain, strongestDomain, underdevelopedDomainCount: scoredDomains.filter((domain) => domain.preciseScore <= 61).length, techLedDomainCount: scoredDomains.filter((domain) => domain.preciseScore >= 90).length, confidenceScore: confidence.score, confidenceLevel: confidence.level, assessmentDisposition: further.disposition, recommendedDeepDive: lowestDomain.id, furtherAnalysisTriggers: further.triggers, recommendationExplanation: explanation };
}
