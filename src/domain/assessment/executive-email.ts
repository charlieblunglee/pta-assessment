import { buildEvidenceNarrative, buildExecutiveRoadmap } from "./roadmap.ts";
import type { AnswerInput, CompletedAssessmentResult, HealthcareArchetype } from "./types.ts";

export interface ExecutiveEmailInput {
  company: string;
  lineOfBusiness: string;
  archetype: HealthcareArchetype;
  assessmentDate: string;
  answers: readonly AnswerInput[];
  result: CompletedAssessmentResult;
}

const TRACK_NAMES: Record<HealthcareArchetype, string> = {
  nonclinical: "Non-Clinical Interaction",
  clinical: "Clinical Interaction",
  him: "Health Information Management (HIM) Production"
};

const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]!));

const list = (items: readonly string[]) => `<ul style="margin:8px 0 0;padding-left:20px">${items.map(item => `<li style="margin:0 0 7px">${escapeHtml(item)}</li>`).join("")}</ul>`;

export function buildExecutiveEmailHtml(input: ExecutiveEmailInput): string {
  const { company, lineOfBusiness, archetype, assessmentDate, answers, result } = input;
  const roadmap = buildExecutiveRoadmap(result, answers, archetype);
  const evidence = buildEvidenceNarrative(result, answers);
  const overrides = result.triggeredOverrides.length
    ? result.triggeredOverrides.map(item => `${item.rule}: ${item.reason}`)
    : ["No domain override changed the base package."];
  const caps = result.healthcareGovernanceCaps.length
    ? result.healthcareGovernanceCaps.map(item => `${item.gate}: ${item.reason}`)
    : ["No healthcare governance cap changed the recommendation."];

  const roadmapHtml = roadmap.map((phase, index) => `<div style="border:1px solid #c9d9df;border-radius:10px;padding:18px;margin:0 0 16px">
    <div style="color:#087f8c;font-size:12px;font-weight:700;text-transform:uppercase">Phase ${index + 1} · ${escapeHtml(phase.horizon)}</div>
    <h3 style="color:#073447;margin:6px 0 8px">${escapeHtml(phase.title)}</h3>
    <p style="margin:0 0 14px">${escapeHtml(phase.objective)}</p>
    <h4 style="margin:10px 0 0;color:#073447">What leadership can do</h4>${list(phase.leadershipActions)}
    <h4 style="margin:14px 0 0;color:#073447">What you need help on</h4>${list(phase.concentrixCapabilities)}
    <h4 style="margin:14px 0 0;color:#073447">Expected outputs</h4>${list(phase.outcomes)}
    <p style="background:#eef7f8;border-left:4px solid #15b8a6;padding:10px 12px;margin:14px 0 0"><strong>Executive decision gate:</strong> ${escapeHtml(phase.decisionGate)}</p>
  </div>`).join("");

  return `<!doctype html><html><body style="margin:0;background:#f2f6f7;color:#17323d;font-family:Arial,sans-serif;line-height:1.5">
  <div style="display:none;max-height:0;overflow:hidden">Your HIMAP executive assessment results and recommended roadmap.</div>
  <div style="max-width:760px;margin:auto;background:#fff">
    <div style="background:#034864;color:#fff;padding:22px 28px"><div style="font-size:24px;font-weight:700">concentrix</div><div style="font-size:12px;margin-top:6px;letter-spacing:.08em">HIMAP PROGRAM TECHNOLOGY PROFILE</div></div>
    <div style="padding:28px">
      <p style="color:#087f8c;font-size:12px;font-weight:700;text-transform:uppercase;margin:0">Executive healthcare technology diagnostic</p>
      <h1 style="color:#073447;font-size:28px;line-height:1.15;margin:6px 0 8px">Program Technology Profile Assessment</h1>
      <p style="margin:0 0 22px"><strong>${escapeHtml(company)}</strong> · ${escapeHtml(lineOfBusiness)}<br>${escapeHtml(TRACK_NAMES[archetype])} · ${escapeHtml(assessmentDate)}</p>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:8px"><tr>
        <td style="background:#073447;color:#fff;padding:18px;border-radius:8px;vertical-align:top"><small>PROFILE SCORE</small><div style="font-size:30px;font-weight:700">${result.programScore} / 100</div><strong>${escapeHtml(result.maturity)}</strong></td>
        <td style="background:#e9f7f5;padding:18px;border-radius:8px;vertical-align:top"><small>RECOMMENDED PACKAGE</small><div style="font-size:25px;font-weight:700;color:#073447">${escapeHtml(result.finalPackage.code)} — ${escapeHtml(result.finalPackage.name)}</div></td>
        <td style="background:#eef3f5;padding:18px;border-radius:8px;vertical-align:top"><small>CONFIDENCE</small><div style="font-size:25px;font-weight:700;color:#073447">${result.confidenceScore}%</div><strong>${escapeHtml(result.confidenceLevel)}</strong></td>
      </tr></table>

      <h2 style="color:#073447;border-bottom:2px solid #15b8a6;padding-bottom:7px">Executive result</h2>
      <p><strong>Primary domain focus:</strong> ${escapeHtml(result.lowestDomain.id)} — ${escapeHtml(result.lowestDomain.name)}<br>
      <strong>Assessment disposition:</strong> ${escapeHtml(result.assessmentDisposition)}<br>
      <strong>Recommended deep dive:</strong> ${escapeHtml(result.recommendedDeepDive)} — ${escapeHtml(result.lowestDomain.name)}</p>

      <h2 style="color:#073447;border-bottom:2px solid #15b8a6;padding-bottom:7px">Why this recommendation</h2>
      <p>${escapeHtml(result.recommendationExplanation.summary)}</p>
      <p><strong>Base package:</strong> ${escapeHtml(result.basePackage.code)} — ${escapeHtml(result.basePackage.name)}</p>
      <h3 style="color:#073447">Triggered overrides</h3>${list(overrides)}
      <h3 style="color:#073447">Healthcare governance review</h3>${list(caps)}

      <h2 style="color:#073447;border-bottom:2px solid #15b8a6;padding-bottom:7px">Six-domain profile</h2>
      <table width="100%" cellspacing="0" cellpadding="9" style="border-collapse:collapse">
        <thead><tr style="background:#073447;color:#fff;text-align:left"><th>Domain</th><th>Score</th><th>Maturity</th></tr></thead>
        <tbody>${result.domainResults.map(domain => `<tr><td style="border-bottom:1px solid #d8e3e7"><strong>${escapeHtml(domain.id)} — ${escapeHtml(domain.name)}</strong>${domain.id === result.lowestDomain.id ? "<br><small>Primary focus</small>" : ""}</td><td style="border-bottom:1px solid #d8e3e7">${domain.normalizedScore}</td><td style="border-bottom:1px solid #d8e3e7">${escapeHtml(domain.maturity)}</td></tr>`).join("")}</tbody>
      </table>
      <p><strong>Strongest domain:</strong> ${escapeHtml(result.strongestDomain.id)} — ${escapeHtml(result.strongestDomain.name)}</p>

      <h2 style="color:#073447;border-bottom:2px solid #15b8a6;padding-bottom:7px">Recommended roadmap</h2>
      ${roadmapHtml}

      <h2 style="color:#073447;border-bottom:2px solid #15b8a6;padding-bottom:7px">Further analysis</h2>
      <p><strong>${escapeHtml(evidence.headline)}</strong></p><p>${escapeHtml(evidence.explanation)}</p>
      <h3 style="color:#073447">Consultant analysis scope</h3>${list(evidence.consultantScope)}
      <div style="background:#e9f7f5;border:1px solid #b8ded8;border-radius:10px;padding:20px;margin-top:28px">
        <p style="margin:0 0 12px"><strong>Please note that this mailbox is not monitored for replies.</strong></p>
        <p style="margin:0 0 12px">To explore the next steps and begin your program’s transformation journey, please reach out to your Concentrix representative. Our team will be happy to discuss your results, identify potential opportunities, and help determine the right path forward for your program.</p>
        <p style="color:#073447;font-size:17px;margin:0"><strong>Your transformation journey starts with a conversation—and Concentrix is here to help you take the next step.</strong></p>
      </div>


      <h2 style="color:#073447;border-bottom:2px solid #15b8a6;padding-bottom:7px">Executive summary</h2>
      <p>${escapeHtml(company)} achieved a Program Technology Profile Score of ${result.programScore}, placing the program in the ${escapeHtml(result.maturity)} maturity range. The recommended direction is ${escapeHtml(result.finalPackage.code)} — ${escapeHtml(result.finalPackage.name)}, with ${escapeHtml(result.lowestDomain.id)} — ${escapeHtml(result.lowestDomain.name)} as the primary technology focus. Assessment confidence is ${escapeHtml(result.confidenceLevel)} at ${result.confidenceScore}%.</p>

      <p style="font-size:12px;color:#61747c;border-top:1px solid #d8e3e7;padding-top:16px;margin-top:28px">This email contains assessment findings only. Uploaded artifacts, evidence files, evidence notes, PHI, and patient information are excluded. Acronyms are expanded when first used.</p>
    </div>
  </div></body></html>`;
}
