import { describe, expect, it } from "vitest";
import { ASSESSMENT_CONFIG as CONFIG } from "./config.ts";
import {
  calculateAssessmentConfidence, calculateDomainRawScore, calculateQuestionScore,
  evaluateAssessment, getBasePackage, normalizeDomainScore
} from "./scoring.ts";
import type { AnswerInput, DomainId, HealthcareArchetype, QuestionScore } from "./types.ts";

function answers(score: QuestionScore = 3, evidenceCount = 42): AnswerInput[] {
  return CONFIG.domains.flatMap((domain) => domain.questionIds.map((questionId, index) => ({
    questionId, domainId: domain.id, value: score, evidenceNote: index + Number(domain.id.slice(1)) * 7 - 7 < evidenceCount ? "validated" : ""
  })));
}

function setDomain(input: AnswerInput[], domainId: DomainId, score: QuestionScore) {
  input.filter((answer) => answer.domainId === domainId).forEach((answer) => { answer.value = score; });
}

function run(input: AnswerInput[], archetype: HealthcareArchetype = "nonclinical", mixedWork = false) {
  return evaluateAssessment({ answers: input, archetype, mixedWork });
}

describe("authoritative scoring primitives", () => {
  it.each([["yellow", 1], ["green", 2], ["blue", 3], [1, 1], [2, 2], [3, 3], [null, null]])("maps %s to %s", (input, expected) => expect(calculateQuestionScore(input as never)).toBe(expected));
  it("requires exactly seven complete answers for a raw score", () => {
    expect(calculateDomainRawScore([1, 1, 1, 1, 1, 1, 1])).toBe(7);
    expect(calculateDomainRawScore([1, 1, 1, 1, 1, 1, null])).toBeNull();
  });
  it.each([[7, 20], [14, 60], [21, 100]])("normalizes raw %i to %i", (raw, expected) => expect(normalizeDomainScore(raw)).toBe(expected));
  it("returns Not Scored rather than zero for an incomplete assessment", () => {
    const input = answers(); input[0].value = null;
    const result = run(input);
    expect(result.status).toBe("not_scored");
    expect(result.programScore).toBeNull();
    expect(result.domainResults[0].normalizedScore).toBeNull();
    expect(result.domainResults[0].maturity).toBe("Not Scored");
  });
  it("never returns zero for a completed domain or assessment", () => {
    const result = run(answers(1));
    expect(result.status).toBe("scored");
    if (result.status === "scored") {
      expect(result.programScore).toBe(20);
      expect(result.domainResults.every((domain) => domain.normalizedScore >= 20)).toBe(true);
    }
  });
});

describe("package boundaries", () => {
  it.each([[0, "P1"], [47, "P1"], [48, "P2"], [61, "P2"], [62, "P3"], [75, "P3"], [76, "P4"], [89, "P4"], [90, "P5"], [100, "P5"]])("maps %i to %s", (score, code) => expect(getBasePackage(score).code).toBe(code));
});

describe("ordered overrides and governance caps", () => {
  it("assigns P1 when D4 is under-developed", () => { const input = answers(); setDomain(input, "D4", 1); const r = run(input); expect(r.status === "scored" && r.finalPackage.code).toBe("P1"); });
  it("assigns P1 when three domains are under-developed", () => { const input = answers(); setDomain(input, "D1", 1); setDomain(input, "D2", 1); setDomain(input, "D3", 1); const r = run(input); expect(r.status === "scored" && r.finalPackage.code).toBe("P1"); });
  it("caps at P2 when D1 is under-developed but D4 is healthy", () => { const input = answers(); setDomain(input, "D1", 1); const r = run(input); expect(r.status === "scored" && r.finalPackage.code).toBe("P2"); });
  it("qualifies for P5 with four Tech-Led domains including D4 and D5", () => { const r = run(answers()); expect(r.status === "scored" && r.finalPackage.code).toBe("P5"); });
  it("caps D4-Q5 Yellow at P2", () => { const input = answers(); input.find((a) => a.questionId === "D4-Q5")!.value = 1; const r = run(input); expect(r.status === "scored" && r.finalPackage.code).toBe("P2"); });
  it.each(["clinical", "him"] as const)("caps %s D5-Q2 Yellow at P2", (track) => { const input = answers(); input.find((a) => a.questionId === "D5-Q2")!.value = 1; const r = run(input, track); expect(r.status === "scored" && r.finalPackage.code).toBe("P2"); });
  it("does not apply the clinical/HIM gate to non-clinical", () => { const input = answers(); input.find((a) => a.questionId === "D5-Q2")!.value = 1; const r = run(input); expect(r.status === "scored" && r.finalPackage.code).toBe("P5"); });
});

describe("confidence and disposition", () => {
  it.each([[29, 69, "Low"], [30, 71, "Moderate"], [35, 83, "Moderate"], [36, 86, "High"], [42, 100, "High"]] as const)("maps %i evidence items to %i%% %s", (count, score, level) => expect(calculateAssessmentConfidence(answers(3, count))).toEqual({ score, level }));
  it("requires a deep dive below 70% evidence", () => { const r = run(answers(3, 0)); expect(r.status === "scored" && r.assessmentDisposition).toBe("Deep-Dive Assessment Required"); });
  it("recommends targeted analysis at moderate confidence", () => { const r = run(answers(3, 30)); expect(r.status === "scored" && r.assessmentDisposition).toBe("Targeted Further Analysis Recommended"); });
  it("is recommendation ready at high confidence with no other trigger", () => { const r = run(answers()); expect(r.status === "scored" && r.assessmentDisposition).toBe("Recommendation Ready"); });
});
