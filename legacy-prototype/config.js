window.PTA_CONFIG = {
  domains: window.ASSESSMENT_DATA.domains,
  maturityBands: [
    {min:0,max:47,label:"Baseline"},{min:48,max:61,label:"Enhanced"},
    {min:62,max:75,label:"Above Average"},{min:76,max:89,label:"High Performing"},
    {min:90,max:100,label:"Tech-Led"}
  ],
  packages: window.ASSESSMENT_DATA.packages,
  thresholds: { yellowDomainMax:61, blueDomainMin:90, d5P5Minimum:76, boundaryTolerance:3, outlierGap:20, highMaturity:76 },
  confidence: { moderateMin:70, highMin:85 },
  compliance: { privacyQuestion:"D4-Q5", aiGovernanceQuestion:"D5-Q2", capPackage:"P2" },
  archetypes: {
    nonclinical:{code:"A",title:"Non-Clinical Interaction",examples:"Member services, scheduling, billing, provider services"},
    clinical:{code:"B",title:"Clinical Interaction",examples:"Nurse triage, utilization management, care/case management, telehealth"},
    him:{code:"C",title:"HIM Production",examples:"Coding, CDI, ROI, abstraction, transcription/editing"}
  },
  deepDives: {
    D1:{title:"Workflow & Digitization Deep Dive",scope:["SOP consistency","Workflow variation","Handoffs and escalation","Manual task inventory","Automation opportunities"]},
    D2:{title:"Performance & Quality Intelligence Deep Dive",scope:["QA platform and coverage","Sampling and calibration","Coaching workflow","Metric definitions","Performance analytics"]},
    D3:{title:"Workforce / Capacity Deep Dive",scope:["Forecasting","Scheduling","Work queues","Intraday control","Workload aging and capacity model"]},
    D4:{title:"Data & Integration Deep Dive",scope:["Application architecture","Source systems and manual data movement","API/ETL capability","Data quality and reconciliation","PHI access and security controls"]},
    D5:{title:"Decision Intelligence & AI Readiness Deep Dive",scope:["Analytics maturity","Leading indicators","AI use cases and governance","Validation and explainability","ROI and human-review boundaries"]},
    D6:{title:"Worker Experience & Technology Workflow Deep Dive",scope:["Systems used","Navigation and re-keying","Knowledge access","Documentation effort","AI-assist readiness"]}
  }
};
