import type { AnswerInput, CompletedAssessmentResult, DomainId, HealthcareArchetype } from "./types.ts";

export interface RoadmapPhase {
  horizon: string;
  title: string;
  objective: string;
  leadershipActions: readonly string[];
  concentrixCapabilities: readonly string[];
  outcomes: readonly string[];
  decisionGate: string;
}

type DomainRoadmap = {
  phases: readonly [
    Omit<RoadmapPhase, "horizon" | "decisionGate">,
    Omit<RoadmapPhase, "horizon" | "decisionGate">,
    Omit<RoadmapPhase, "horizon" | "decisionGate">
  ];
};

const ROADMAPS: Record<DomainId, DomainRoadmap> = {
  D1: { phases: [
    { title: "Map and stabilize priority workflows", objective: "Create a fact base for the highest-volume journeys, handoffs, exceptions, and control points before selecting technology.", leadershipActions: ["Name an executive process owner and prioritize 2–3 workflows by customer impact, cost, risk, and volume.", "Document current roles, systems, wait time, rework, exceptions, and regulatory controls.", "Approve baseline measures for cycle time, quality, effort, leakage, and customer outcomes."], concentrixCapabilities: ["Business Transformation", "Experience Design", "Digital Operations", "Operational Insight"], outcomes: ["Validated current-state workflow", "Prioritized value cases", "Baseline KPI and control set"] },
    { title: "Design digital handoffs and automation", objective: "Redesign work around clean handoffs, orchestration, and human-in-the-loop controls rather than automating existing friction.", leadershipActions: ["Approve the future-state operating model and escalation rules.", "Confirm integration, privacy, security, and change-readiness requirements.", "Fund a bounded pilot with a named business outcome and adoption target."], concentrixCapabilities: ["Enterprise Automation", "Technology Transformation", "Application Services", "Experience Platforms"], outcomes: ["Future-state service blueprint", "Automation and integration backlog", "Pilot business case"] },
    { title: "Pilot, measure, and scale", objective: "Prove value in a controlled workflow, then scale only when performance, controls, and workforce adoption meet agreed thresholds.", leadershipActions: ["Review pilot results against the approved baseline and risk controls.", "Decide whether to stop, refine, or scale based on measurable value.", "Establish product ownership, governance, and continuous-improvement cadence."], concentrixCapabilities: ["Enterprise Automation", "Testing Services", "CX Technology", "Digital Operations"], outcomes: ["Measured pilot results", "Scale decision and investment roadmap", "Sustainable governance model"] }
  ] },
  D2: { phases: [
    { title: "Align quality and performance measures", objective: "Define the outcomes leaders need to manage and establish trusted definitions across operational, customer, quality, and compliance measures.", leadershipActions: ["Agree the critical outcomes and leading indicators for each workflow.", "Resolve conflicting metric definitions and assign data owners.", "Set review thresholds and management actions for each indicator."], concentrixCapabilities: ["Operational Insight", "Voice of the Customer", "Advanced Analytics", "Business Transformation"], outcomes: ["Executive measurement framework", "Metric ownership and definitions", "Quality-data gap assessment"] },
    { title: "Build actionable insight", objective: "Connect quality, interaction, workforce, and customer signals so managers can move from retrospective reporting to timely intervention.", leadershipActions: ["Prioritize high-value insight use cases and user groups.", "Approve access, privacy, explainability, and bias controls.", "Define how insight changes coaching and operational decisions."], concentrixCapabilities: ["Data Engineering", "Advanced Analytics", "Enterprise Intelligence", "CX Technology"], outcomes: ["Leading-indicator dashboard", "Root-cause views", "Manager action playbooks"] },
    { title: "Operationalize intelligent performance", objective: "Embed insight into coaching, quality, and improvement routines with clear accountability for outcomes.", leadershipActions: ["Sponsor adoption and manager capability-building.", "Monitor model and metric drift alongside business results.", "Scale proven use cases across eligible workflows."], concentrixCapabilities: ["AI Models & Model Ops", "Generative AI", "Operational Insight", "Digital Operations"], outcomes: ["Closed-loop performance management", "AI-assisted quality workflow", "Measured quality and efficiency uplift"] }
  ] },
  D3: { phases: [
    { title: "Create a trusted demand and capacity baseline", objective: "Establish one operational view of demand, skills, capacity, backlog, service risk, and planning assumptions.", leadershipActions: ["Confirm service, cost, workload, and workforce constraints.", "Assign owners for forecast inputs and exception decisions.", "Select priority queues or journeys for intervention."], concentrixCapabilities: ["Operational Insight", "Advanced Analytics", "Digital Operations", "Business Transformation"], outcomes: ["Demand-capacity baseline", "Planning assumption register", "Priority constraint map"] },
    { title: "Introduce predictive planning", objective: "Use scenario modelling to anticipate workload, staffing, and service risk while preserving accountable human decisions.", leadershipActions: ["Approve forecast horizons and acceptable error bands.", "Define intervention rules for capacity and work allocation.", "Validate workforce, labor, and fairness implications."], concentrixCapabilities: ["Data Engineering", "Advanced Analytics", "Enterprise Intelligence", "AI Models & Model Ops"], outcomes: ["Predictive forecast pilot", "Capacity scenarios", "Work-allocation decision rules"] },
    { title: "Optimize across operations", objective: "Connect forecasting, work routing, scheduling, and performance signals into a governed optimization cycle.", leadershipActions: ["Review value and workforce impact before scaling.", "Establish monitoring for forecast drift and unintended outcomes.", "Fund integrations required for real-time decisions."], concentrixCapabilities: ["Enterprise Automation", "Technology Transformation", "Digital Operations", "Operational Insight"], outcomes: ["Integrated planning cadence", "Reduced backlog and service volatility", "Scalable optimization roadmap"] }
  ] },
  D4: { phases: [
    { title: "Establish the data foundation", objective: "Identify authoritative sources, critical data elements, ownership, quality risks, and healthcare data-handling constraints.", leadershipActions: ["Appoint business and technical data owners.", "Prioritize data needed for the highest-value workflows and decisions.", "Approve privacy, security, retention, access, and PHI boundaries."], concentrixCapabilities: ["Data Modernization", "Data Engineering", "Data Governance", "Data Security"], outcomes: ["Source-to-outcome data map", "Critical data inventory", "Data risk and ownership register"] },
    { title: "Connect and govern priority data", objective: "Build reliable integration and quality controls for a bounded set of operational use cases.", leadershipActions: ["Approve target architecture and interoperability standards.", "Fund remediation of high-impact quality and lineage gaps.", "Define service levels for data availability and issue resolution."], concentrixCapabilities: ["Data Engineering", "Application Services", "Cybersecurity", "Technology Transformation"], outcomes: ["Integration blueprint", "Data-quality controls", "Governed priority data product"] },
    { title: "Scale reusable data products", objective: "Move from project-specific extracts to secure, reusable data products that support analytics, automation, and AI.", leadershipActions: ["Review adoption, reliability, cost, and control performance.", "Approve reusable platform patterns and product ownership.", "Sequence downstream analytics and AI use cases based on readiness."], concentrixCapabilities: ["Data & Analytics Transformation", "Data Modernization", "Enterprise Intelligence", "AI Transformation"], outcomes: ["Reusable data-product roadmap", "Production monitoring model", "AI-ready foundation"] }
  ] },
  D5: { phases: [
    { title: "Set decision and AI governance", objective: "Define which decisions may be supported or automated, who remains accountable, and what healthcare safeguards are mandatory.", leadershipActions: ["Establish executive AI ownership and risk classification.", "Approve privacy, safety, bias, explainability, validation, and human-oversight requirements.", "Select use cases based on value, feasibility, data readiness, and consequence."], concentrixCapabilities: ["AI Transformation", "AI Models & Model Ops", "Data Governance", "Cybersecurity"], outcomes: ["AI governance charter", "Prioritized use-case portfolio", "Risk and control requirements"] },
    { title: "Validate a bounded intelligence use case", objective: "Test decision support in a controlled workflow using representative data, defined controls, and measurable human outcomes.", leadershipActions: ["Approve success, safety, and stop criteria before launch.", "Ensure clinical, HIM, privacy, legal, and operational review where applicable.", "Require transparent comparison with the current decision process."], concentrixCapabilities: ["Advanced Analytics", "Generative AI", "Agentic AI", "Testing Services"], outcomes: ["Validated prototype", "Human-in-the-loop operating design", "Value and risk evidence"] },
    { title: "Industrialize responsible intelligence", objective: "Scale proven models with lifecycle governance, monitoring, adoption, and accountable operational ownership.", leadershipActions: ["Review value, risk, drift, and workforce impact at defined gates.", "Fund model operations, monitoring, and change management.", "Retire or retrain solutions that no longer meet thresholds."], concentrixCapabilities: ["AI Models & Model Ops", "Technology & Engineering", "Digital Operations", "Enterprise Intelligence"], outcomes: ["Production AI operating model", "Model monitoring and controls", "Responsible scale roadmap"] }
  ] },
  D6: { phases: [
    { title: "Understand the employee journey", objective: "Identify where fragmented tools, knowledge, context switching, and unclear guidance create avoidable effort or risk.", leadershipActions: ["Prioritize employee journeys using effort, customer impact, quality, and risk.", "Validate pain points directly with frontline teams and managers.", "Set experience, adoption, quality, and productivity baselines."], concentrixCapabilities: ["Experience Design", "CX Technology", "Voice of the Customer", "Digital Operations"], outcomes: ["Employee journey map", "Friction and knowledge-gap backlog", "Experience baseline"] },
    { title: "Design a connected workspace", objective: "Bring the right context, knowledge, workflow, and guidance into the employee moment of need.", leadershipActions: ["Approve the target employee experience and system-of-record boundaries.", "Set content ownership, access, privacy, and escalation rules.", "Select a workflow for a real-time assistance pilot."], concentrixCapabilities: ["Experience Platforms", "Application Services", "Enterprise Automation", "Generative AI"], outcomes: ["Connected-workspace design", "Knowledge governance model", "Assist pilot plan"] },
    { title: "Prove adoption and scale", objective: "Measure whether the workspace improves employee and customer outcomes before expanding capabilities or populations.", leadershipActions: ["Review adoption, accuracy, effort, quality, and customer outcomes together.", "Act on frontline feedback and control exceptions.", "Scale only where the solution improves both experience and performance."], concentrixCapabilities: ["CX Technology", "Testing Services", "Digital Operations", "Operational Insight"], outcomes: ["Measured employee-assist pilot", "Adoption and change plan", "Enterprise scale roadmap"] }
  ] }
};

const TRACK_CONTEXT: Record<HealthcareArchetype, string> = {
  nonclinical: "member, patient, provider, billing, or service operations",
  clinical: "clinician-supported workflows with explicit clinical accountability and safety review",
  him: "HIM, coding, CDI, release-of-information, and documentation workflows"
};

export function buildExecutiveRoadmap(result: CompletedAssessmentResult, answers: readonly AnswerInput[], archetype: HealthcareArchetype): RoadmapPhase[] {
  const focus = result.lowestDomain.id;
  const humanLed = answers.filter(answer => answer.domainId === focus && answer.value === 1).length;
  const context = TRACK_CONTEXT[archetype];
  const gates = [
    `Confirm the baseline and executive sponsorship before committing to solution design.`,
    `Proceed only if the pilot design addresses ${context}, governance, integration, and adoption requirements.`,
    `Scale only after measurable value and control performance are demonstrated.`
  ];
  return ROADMAPS[focus].phases.map((phase, index) => ({
    ...phase,
    horizon: index === 0 ? "0–30 days · Diagnose" : index === 1 ? "30–90 days · Design & Pilot" : "90–180+ days · Prove & Scale",
    objective: index === 0 && humanLed > 0
      ? `${phase.objective} The assessment identified ${humanLed} of 7 capabilities in ${focus} — ${result.lowestDomain.name} as Human-Led, so workflow validation should precede technology selection.`
      : phase.objective,
    decisionGate: gates[index]
  }));
}

export function buildEvidenceNarrative(result: CompletedAssessmentResult, answers: readonly AnswerInput[]): {
  headline: string; explanation: string; consultantScope: readonly string[];
} {
  const evidenced = answers.filter(answer => answer.hasArtifact || Boolean(answer.evidenceNote?.trim())).length;
  const missing = 42 - evidenced;
  if (result.confidenceLevel === "Low") return {
    headline: "The recommendation is directional and requires workflow validation",
    explanation: `Evidence was provided for ${evidenced} of 42 responses; ${missing} responses were not supported by an evidence note or artifact. Low evidence does not mean the responses are incorrect. It means the assessment cannot yet confirm how the workflow operates in practice, where exceptions occur, or whether controls are consistently followed.`,
    consultantScope: ["Observe and map the priority workflow, including handoffs, exceptions, systems, roles, controls, and rework.", "Validate selected responses with process owners, frontline teams, performance data, and appropriately redacted documentation.", "Quantify the baseline and refine the solution package, investment case, sequencing, and implementation risks."]
  };
  if (result.confidenceLevel === "Moderate") return {
    headline: "Targeted validation will strengthen the investment decision",
    explanation: `Evidence was provided for ${evidenced} of 42 responses. The overall direction is usable, but selected workflow, governance, and value assumptions should be validated before final solution design.`,
    consultantScope: ["Validate the lowest-scoring domain and any healthcare governance gates.", "Confirm baseline outcomes and priority use cases with accountable leaders.", "Refine scope, sequencing, controls, and expected value before pilot approval."]
  };
  return {
    headline: "Evidence supports solution validation and planning",
    explanation: `Evidence was provided for ${evidenced} of 42 responses. The recommendation is sufficiently supported to move into solution validation, business-case refinement, and implementation planning.`,
    consultantScope: ["Confirm the priority workflow and target outcomes.", "Complete solution, control, integration, and adoption design.", "Establish pilot success criteria and executive decision gates."]
  };
}
