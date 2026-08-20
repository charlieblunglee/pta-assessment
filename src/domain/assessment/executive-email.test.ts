import { describe, expect, it } from "vitest";
import { buildExecutiveEmailHtml } from "./executive-email.ts";
import { evaluateAssessment } from "./scoring.ts";
import type { AnswerInput } from "./types.ts";

const answers: AnswerInput[] = Array.from({ length: 6 }, (_, domain) =>
  Array.from({ length: 7 }, (_, question) => ({
    questionId: `D${domain + 1}-Q${question + 1}`,
    domainId: `D${domain + 1}` as AnswerInput["domainId"],
    value: domain === 0 ? 1 as const : 2 as const,
    evidenceNote: "CONFIDENTIAL NOTE MUST NOT APPEAR",
    hasArtifact: false
  }))
).flat();

describe("executive assessment email", () => {
  it("contains the browser result hierarchy and domain-specific roadmap", () => {
    const result = evaluateAssessment({ answers, archetype: "nonclinical" });
    if (result.status !== "scored") throw new Error("Expected scored result");
    const html = buildExecutiveEmailHtml({ company: "Example Health", lineOfBusiness: "Member Services", archetype: "nonclinical", assessmentDate: "2026-08-21", answers, result });
    expect(html).toContain("Program Technology Profile Assessment");
    expect(html).toContain("Why this recommendation");
    expect(html).toContain("Six-domain profile");
    expect(html).toContain("Recommended roadmap");
    expect(html).toContain("Map and stabilize priority workflows");
    expect(html).toContain("What leadership can do");
    expect(html).toContain("How Concentrix can help");
    expect(html).toContain("Further analysis");
    expect(html).toContain("Executive summary");
  });

  it("never includes evidence notes or artifact content", () => {
    const result = evaluateAssessment({ answers, archetype: "nonclinical" });
    if (result.status !== "scored") throw new Error("Expected scored result");
    const html = buildExecutiveEmailHtml({ company: "Example Health", lineOfBusiness: "Member Services", archetype: "nonclinical", assessmentDate: "2026-08-21", answers, result });
    expect(html).not.toContain("CONFIDENTIAL NOTE MUST NOT APPEAR");
    expect(html).toContain("evidence notes, PHI, and patient information are excluded");
  });
});
