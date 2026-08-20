import { describe, expect, it } from "vitest";
import { ASSESSMENT_CONFIG as CONFIG } from "./config.ts";
import { buildEvidenceNarrative, buildExecutiveRoadmap } from "./roadmap.ts";
import { evaluateAssessment } from "./scoring.ts";
import type { AnswerInput, QuestionScore } from "./types.ts";

function assessment(score: QuestionScore, evidenced: number) {
  const answers: AnswerInput[] = CONFIG.domains.flatMap(domain => domain.questionIds.map((questionId, index) => ({
    questionId,
    domainId: domain.id,
    value: score,
    evidenceNote: answersCount(domain.id, index) < evidenced ? "validated" : ""
  })));
  const result = evaluateAssessment({ answers, archetype: "nonclinical" });
  if (result.status !== "scored") throw new Error("Expected scored assessment");
  return { result, answers };
}

function answersCount(domainId: string, index: number) {
  return (Number(domainId.slice(1)) - 1) * 7 + index;
}

describe("executive roadmap", () => {
  it("personalizes the priority narrative using Human-Led responses", () => {
    const { result, answers } = assessment(1, 0);
    const roadmap = buildExecutiveRoadmap(result, answers, "nonclinical");
    expect(roadmap).toHaveLength(3);
    expect(roadmap[0].objective).toContain("7 of 7 capabilities in D1 — Work Execution & Digitization as Human-Led");
    expect(roadmap[0].leadershipActions.length).toBeGreaterThanOrEqual(3);
    expect(roadmap[0].concentrixCapabilities).toContain("Business Transformation");
  });

  it("explains that low evidence requires consultant workflow validation", () => {
    const { result, answers } = assessment(1, 0);
    const narrative = buildEvidenceNarrative(result, answers);
    expect(narrative.explanation).toContain("0 of 42 responses");
    expect(narrative.explanation).toContain("does not mean the responses are incorrect");
    expect(narrative.consultantScope.join(" ")).toContain("Observe and map the priority workflow");
  });
});
