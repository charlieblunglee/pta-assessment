window.ASSESSMENT_DATA = {
  "version": 1,
  "industry": "Healthcare",
  "domains": [
    {
      "id": "D1",
      "name": "Work Execution & Digitization",
      "weight": 10,
      "questions": [
        {
          "id": "D1-Q1",
          "question": "How are daily operational tasks (status updates, handovers, shift reports) executed and shared?",
          "artifactHint": "EOD reports, shift handover templates, Teams/Planner screenshots, huddle notes",
          "anchors": {
            "nonclinical": {
              "1": "Handovers/shift reports shared verbally or by email; person-dependent and inconsistent across shifts.",
              "2": "Structured templates or shared tools (Teams, Planner) used, but completion depends on individual discipline.",
              "3": "Handovers, shift reports and status updates auto-generated/system-triggered from ops systems; no manual assembly."
            },
            "clinical": {
              "1": "Clinical handovers (pending cases, at-risk patients, open authorizations) passed verbally/email; no standard SBAR template; continuity depends on who is on shift.",
              "2": "Standardized clinical handover templates (e.g., SBAR) in a shared tool; PHI shared over approved channels; completion depends on discipline.",
              "3": "Clinical handovers auto-compiled from the case/UM system (open cases, due reviews, risk flags) into a governed, access-controlled handover; no manual re-keying of PHI."
            },
            "him": {
              "1": "Production status (pending charts, DNFB, coding backlog, held queries) tracked in personal spreadsheets/email; inconsistent across coders and shifts.",
              "2": "Shared production tracker/dashboard (inventory, aging, hold reasons) updated by the team; refresh depends on manual entry.",
              "3": "Production status auto-generated from the coding/CDI/workflow platform (inventory, DNFB, TAT, hold aging); leaders see live status with no manual assembly."
            }
          }
        },
        {
          "id": "D1-Q2",
          "question": "How are escalations and service issues identified and routed?",
          "artifactHint": "Escalation SOPs, ticket routing configs, alert-rule screenshots, on-call matrix",
          "anchors": {
            "nonclinical": {
              "1": "Escalations raised verbally or via chat; routing depends on who is available or who knows the right contact.",
              "2": "Escalation paths documented; ticketing/shared queues used, but routing is still manual.",
              "3": "Escalations auto-detected, routed and tracked by system/AI rules with minimal human initiation."
            },
            "clinical": {
              "1": "Clinical escalations (adverse events, urgent triage dispositions, denial-of-care risk, behavioral-health/safeguarding flags) raised verbally; routing depends on who knows the on-call clinician.",
              "2": "Documented clinical escalation pathways with defined timeframes and urgency tiers; ticketing/queues used; routing manual.",
              "3": "System/AI detects clinical-urgency and compliance-risk signals and auto-routes to the right licensed role within required timeframes — with GUARANTEED clinician review of any safety-critical escalation."
            },
            "him": {
              "1": "Coding/documentation issues (unclear docs, missing signatures, coding conflicts) raised informally to a lead; routing ad hoc.",
              "2": "Documented physician-query/escalation workflow tracked in a tool; routing manual.",
              "3": "System flags documentation gaps/coding conflicts and auto-routes physician queries or compliance reviews with turnaround SLAs — high-risk coding decisions always routed for human validation."
            }
          }
        },
        {
          "id": "D1-Q3",
          "question": "How are action items from meetings or operational reviews assigned, tracked, and closed?",
          "artifactHint": "Meeting notes, Planner/Jira board, action-closure logs",
          "anchors": {
            "nonclinical": {
              "1": "Action items noted in email, chat or memory; follow-through depends on individual accountability.",
              "2": "Logged in shared tools (Planner, Jira, Excel) and reviewed periodically.",
              "3": "Auto-generated from meeting outputs, system-assigned, tracked with reminders, and closed with evidence."
            },
            "clinical": {
              "1": "Clinical governance/huddle actions (protocol updates, audit follow-ups) noted informally; follow-through individual.",
              "2": "Actions logged in a shared tool and reviewed on a clinical-governance cadence.",
              "3": "Actions auto-captured from clinical reviews, assigned and tracked to closure with evidence; overdue safety/compliance actions flagged."
            },
            "him": {
              "1": "Actions from coding audits / QA calibration noted in email; follow-through individual.",
              "2": "Logged in a tracker and reviewed in coding-quality meetings.",
              "3": "Audit/calibration actions auto-generated and tracked to closure with evidence; recurring error patterns flagged for targeted education."
            }
          }
        },
        {
          "id": "D1-Q4",
          "question": "How are operational SOPs, playbooks and job aids maintained and accessed?",
          "artifactHint": "SOP repository, version history, access logs",
          "anchors": {
            "nonclinical": {
              "1": "SOPs in local files, email attachments or print; versions vary across individuals.",
              "2": "Stored in a shared repository (SharePoint, Drive), reasonably current; access is consistent.",
              "3": "Digitized, version-controlled, searchable and linked directly into workflows or desktop tools."
            },
            "clinical": {
              "1": "Clinical protocols/criteria (triage guidelines, UM criteria, care pathways) in local or printed copies; version drift risks out-of-date clinical guidance.",
              "2": "Protocols in a controlled shared repository, reasonably current; basic version control.",
              "3": "Clinical protocols/criteria version-controlled, searchable and linked into the clinical workspace; updates pushed with acknowledgment tracked (evidence of current-version use)."
            },
            "him": {
              "1": "Coding guidelines, client-specific rules and ROI procedures in local files; versions vary; risk of outdated coding rules.",
              "2": "Guidelines in a shared repository, reasonably current; consistent access.",
              "3": "Coding rules/guidelines version-controlled, searchable and linked into the encoder/workflow; regulatory & coding updates tracked with acknowledgment."
            }
          }
        },
        {
          "id": "D1-Q5",
          "question": "How are operational risks, trends or recurring issues captured and made visible to leadership?",
          "artifactHint": "Risk logs, issue trackers, dashboard screenshots, alert config",
          "anchors": {
            "nonclinical": {
              "1": "Issues raised in meetings or by individual observation; no structured capture.",
              "2": "Logged in a shared tracker; leadership reviews periodically but not in real time.",
              "3": "Risk/issue data auto-aggregated, flagged and surfaced to leadership via live dashboards or alerts."
            },
            "clinical": {
              "1": "Clinical risks (guideline non-adherence, urgent-case turnaround breaches, adverse trends) surface anecdotally.",
              "2": "Logged in a clinical risk/issue tracker; reviewed in governance periodically.",
              "3": "Clinical risk and compliance signals auto-aggregated and surfaced live (e.g., overdue urgent reviews, criteria-override spikes) with alerts."
            },
            "him": {
              "1": "Quality/production risks (accuracy dips, DNFB spikes, denial trends) noticed individually.",
              "2": "Logged in a tracker; leadership reviews periodically.",
              "3": "Accuracy, productivity, DNFB and denial-risk trends auto-aggregated and surfaced live with alerts."
            }
          }
        },
        {
          "id": "D1-Q6",
          "question": "How does the program identify and prioritize operational improvement opportunities?",
          "artifactHint": "Improvement logs, retrospective notes, governance decks, AI recommendation outputs",
          "anchors": {
            "nonclinical": {
              "1": "Improvements raised informally, based on supervisor experience or reactive problem-solving.",
              "2": "Structured reviews (retrospectives, governance) where data informs priorities.",
              "3": "Systems continuously surface opportunities through trend/anomaly detection or AI-generated recommendations."
            },
            "clinical": {
              "1": "Clinical process improvements raised reactively, usually after incidents.",
              "2": "Structured clinical-governance reviews use data to prioritize.",
              "3": "Systems surface clinical improvement opportunities (variation, outcome/turnaround patterns) continuously; clinical leaders prioritize with human oversight."
            },
            "him": {
              "1": "Improvements raised reactively when errors or denials spike.",
              "2": "Structured quality reviews use audit data to prioritize.",
              "3": "Systems surface improvement opportunities (error clustering, denial root-cause, automation candidates) continuously."
            }
          }
        },
        {
          "id": "D1-Q7",
          "question": "How are technology tools evaluated, adopted or replaced within the program?",
          "artifactHint": "Tool evaluation records, adoption dashboards, IT governance docs, license utilization",
          "anchors": {
            "nonclinical": {
              "1": "Tool decisions are ad hoc, driven by individual preference; no formal process.",
              "2": "A defined process exists for evaluating and onboarding tools; decisions involve ops and IT.",
              "3": "Tool performance measured continuously; adoption, usage and ROI inform upgrade/replacement."
            },
            "clinical": {
              "1": "Clinical-tool decisions ad hoc; clinical validation and compliance not formally assessed.",
              "2": "Defined process; clinical, ops, IT and privacy/security review new tools before adoption.",
              "3": "Continuous measurement of clinical-tool performance, adoption and outcome/ROI; clinical validation and PHI-governance checks are part of every decision."
            },
            "him": {
              "1": "Encoder / CAC / transcription-tool decisions ad hoc.",
              "2": "Defined process; ops, IT and coding-compliance review before adoption.",
              "3": "Continuous measurement of accuracy lift, productivity, adoption and ROI; coding-compliance and data-governance checks embedded in every decision."
            }
          }
        }
      ]
    },
    {
      "id": "D2",
      "name": "Performance & Quality Intelligence",
      "weight": 15,
      "questions": [
        {
          "id": "D2-Q1",
          "question": "How are individual and team performance metrics collected and made available to supervisors?",
          "artifactHint": "Dashboard screenshots, BI access logs, data-pull SOPs, Excel trackers",
          "anchors": {
            "nonclinical": {
              "1": "Metrics pulled manually from source systems (ACD, CRM, WFM) and compiled in Excel/PowerPoint by an analyst.",
              "2": "System dashboards available; supervisors self-serve but some manual extraction remains.",
              "3": "All metrics feed automatically into a unified performance view; no manual pulls."
            },
            "clinical": {
              "1": "Clinical metrics (case turnaround, guideline adherence, review volumes) pulled manually and compiled by an analyst.",
              "2": "Clinical dashboards available within role-based access; supervisors self-serve; some manual extraction.",
              "3": "Clinical performance feeds automatically into a unified, access-controlled view; no manual pulls."
            },
            "him": {
              "1": "Production/quality metrics (records/hour, accuracy, DNFB, TAT) pulled manually into spreadsheets.",
              "2": "Production dashboards available; leads self-serve; some manual extraction remains.",
              "3": "Coding/production metrics feed automatically into a unified view; no manual pulls."
            }
          }
        },
        {
          "id": "D2-Q2",
          "question": "How are quality evaluations conducted?",
          "artifactHint": "QA scorecard samples, QA platform screenshots, AI scoring output, calibration records",
          "anchors": {
            "nonclinical": {
              "1": "QA performed manually via random sampling; evaluators listen/read and score manually.",
              "2": "QA tools assist with structured scorecards, auto-sampling and digital logging.",
              "3": "AI scores 100% of interactions; evaluators focus on calibration, disputes and edge cases."
            },
            "clinical": {
              "1": "Manual clinical case review; no structured clinical-documentation or medical-necessity scoring.",
              "2": "Structured clinical QA (documentation completeness, protocol adherence, compliance scorecards) with auto-sampling.",
              "3": "AI pre-scores clinical documentation/compliance risk across 100% of cases; a licensed reviewer validates every medically-significant finding, with an audit trail."
            },
            "him": {
              "1": "Coding accuracy checked by manual audit of small samples; scoring in spreadsheets.",
              "2": "Structured coding-QA platform with digital scorecards and auto-sampling; accuracy tracked by coder/DRG.",
              "3": "Automated coding-quality/edit checks scan 100% of records; auditors focus on high-risk DRGs, disputes and calibration, with a full audit trail."
            }
          }
        },
        {
          "id": "D2-Q3",
          "question": "How are coaching / development needs identified?",
          "artifactHint": "Coaching logs, QA gap reports, AI coaching-trigger screenshots, supervisor workflow docs",
          "anchors": {
            "nonclinical": {
              "1": "Coaching triggered by observation, escalations or scheduled check-ins; no data-driven identification.",
              "2": "QA/performance dashboards highlight gaps; supervisors prioritise coaching from them.",
              "3": "AI continuously identifies coaching opportunities per person from interaction patterns and performance trends."
            },
            "clinical": {
              "1": "Clinical coaching triggered by observation or incidents; no data-driven identification.",
              "2": "Clinical QA gaps and performance data highlight development needs; supervisors prioritise from them.",
              "3": "System continuously flags clinical-competency/documentation coaching needs from case patterns; clinical leaders decide the intervention."
            },
            "him": {
              "1": "Education triggered only when errors surface (denials, audit fails); no systematic identification.",
              "2": "Coding-QA error reports highlight patterns; leads prioritise education from them.",
              "3": "System continuously flags per-coder error patterns and education needs from audit and edit data."
            }
          }
        },
        {
          "id": "D2-Q4",
          "question": "How consistent and reliable is performance data across reports used by different teams?",
          "artifactHint": "Reconciliation logs, data-governance docs, single-source confirmation, QA calibration",
          "anchors": {
            "nonclinical": {
              "1": "Different teams produce different numbers; reconciliation required before meetings; disputes common.",
              "2": "A primary reporting source exists and is mostly trusted; minor discrepancies manually resolved.",
              "3": "A single authoritative source across all teams with automated quality checks; disputes rare, resolved systematically."
            },
            "clinical": {
              "1": "Clinical numbers differ across teams; reconciliation before reviews; disputes common.",
              "2": "A primary clinical reporting source mostly trusted; minor discrepancies resolved manually.",
              "3": "Single authoritative clinical source with automated quality checks; disputes rare."
            },
            "him": {
              "1": "Accuracy/productivity numbers differ across teams; reconciliation before meetings.",
              "2": "A primary production source mostly trusted; minor discrepancies resolved manually.",
              "3": "Single authoritative production/quality source with automated checks; disputes rare."
            }
          }
        },
        {
          "id": "D2-Q5",
          "question": "How are coaching outcomes tracked and validated over time?",
          "artifactHint": "Coaching logs, QA records, pre/post performance comparisons, closed-loop screenshots",
          "anchors": {
            "nonclinical": {
              "1": "Coaching stored informally (email, Word, spreadsheet); no closed-loop tracking of behaviour change.",
              "2": "Coaching logged in a tool; pre/post metrics tech-assisted but reviewed manually.",
              "3": "Coaching outcomes auto-linked to performance data; behaviour change tracked and measured without manual analysis."
            },
            "clinical": {
              "1": "Clinical coaching recorded informally; no closed-loop tracking of competency change.",
              "2": "Coaching logged; pre/post clinical metrics reviewed manually.",
              "3": "Clinical coaching outcomes auto-linked to competency/quality data; change tracked automatically."
            },
            "him": {
              "1": "Coder education recorded informally; no closed-loop tracking of accuracy change.",
              "2": "Education logged; pre/post accuracy reviewed manually.",
              "3": "Education outcomes auto-linked to accuracy data; change tracked automatically."
            }
          }
        },
        {
          "id": "D2-Q6",
          "question": "How are performance insights translated into operational decisions or interventions?",
          "artifactHint": "Decision logs, alert config, automated coaching-assignment records, review-cadence docs",
          "anchors": {
            "nonclinical": {
              "1": "Leaders rely on experience/observation; data referenced after decisions are made.",
              "2": "Performance data informs decisions in daily/weekly reviews; leaders interpret and act manually.",
              "3": "System thresholds auto-trigger actions (alerts, coaching assignments, schedule adjustments) without waiting for review."
            },
            "clinical": {
              "1": "Clinical leaders act on experience; data referenced after the fact.",
              "2": "Clinical data informs decisions in structured reviews; leaders act manually.",
              "3": "System thresholds trigger clinical actions (alerts, targeted review, reallocation); clinicians govern exceptions and any care-affecting action."
            },
            "him": {
              "1": "Leads act on experience; data referenced after the fact.",
              "2": "Production/quality data informs decisions in reviews; leads act manually.",
              "3": "System thresholds auto-trigger actions (rework routing, education assignment, workload rebalancing)."
            }
          }
        },
        {
          "id": "D2-Q7",
          "question": "How are performance improvements measured and attributed?",
          "artifactHint": "Before/after reports, intervention-tracking logs, correlation-analysis outputs",
          "anchors": {
            "nonclinical": {
              "1": "Improvements observed informally; no method to attribute change to specific interventions.",
              "2": "Improvement initiatives tracked and compared to baseline in structured reviews.",
              "3": "Systems auto-correlate interventions (coaching, automation, process changes) with performance outcomes."
            },
            "clinical": {
              "1": "Clinical improvements observed informally; no attribution method.",
              "2": "Initiatives tracked versus baseline in reviews.",
              "3": "Systems auto-correlate interventions with clinical quality/outcome measures."
            },
            "him": {
              "1": "Improvements observed informally; no attribution.",
              "2": "Initiatives tracked versus accuracy/productivity baseline.",
              "3": "Systems auto-correlate interventions with accuracy/denial/productivity outcomes."
            }
          }
        }
      ]
    },
    {
      "id": "D3",
      "name": "Workforce Planning & Optimization",
      "weight": 15,
      "questions": [
        {
          "id": "D3-Q1",
          "question": "How are volume forecasts generated?",
          "artifactHint": "Forecast spreadsheets, WFM tool screenshots, AI forecast config, accuracy reports",
          "anchors": {
            "nonclinical": {
              "1": "Forecasts built manually in Excel from history and planner judgment; no dedicated WFM tool.",
              "2": "A WFM system generates forecasts; planners review, adjust and approve.",
              "3": "AI models generate and continuously update forecasts from real-time signals; human review is exception-based."
            },
            "clinical": {
              "1": "Case/contact volume forecast manually; clinical staffing planned on judgment.",
              "2": "A planning tool forecasts clinical demand; planners adjust for skill/licensure mix.",
              "3": "AI forecasts clinical demand continuously; planners handle exceptions."
            },
            "him": {
              "1": "Record/chart volume forecast manually from history; no capacity tool.",
              "2": "A capacity/planning tool forecasts inventory inflow; planners review and adjust.",
              "3": "AI forecasts record inflow and backlog continuously from source-system signals; review is exception-based."
            }
          }
        },
        {
          "id": "D3-Q2",
          "question": "How are schedules / work allocation created and adjusted?",
          "artifactHint": "Schedule samples, WFM scheduling screenshots, intraday adjustment logs, auto-reoptimization config",
          "anchors": {
            "nonclinical": {
              "1": "Schedules built manually in Excel/basic tools; intraday changes via chat/calls.",
              "2": "WFM generates schedules; planners make frequent manual adjustments for exceptions.",
              "3": "Scheduling automated end-to-end; intraday re-optimisation automatic from adherence/volume signals."
            },
            "clinical": {
              "1": "Clinical rosters built manually while juggling licensure/skill coverage; changes via chat.",
              "2": "WFM generates clinical schedules honouring skill/licensure; planners adjust exceptions.",
              "3": "Clinical scheduling automated within skill/licensure constraints; intraday re-optimisation automatic within coverage rules."
            },
            "him": {
              "1": "Work allocated to coders manually (assign charts/queues); changes ad hoc.",
              "2": "Workflow tool assigns/queues work by skill; leads adjust exceptions.",
              "3": "Work allocation automated end-to-end (skill-based routing, priority/aging); rebalancing automatic from inventory signals."
            }
          }
        },
        {
          "id": "D3-Q3",
          "question": "How is intraday management handled when volume deviates from forecast?",
          "artifactHint": "Intraday SOPs, RTA workflow docs, adherence dashboards, auto-action config",
          "anchors": {
            "nonclinical": {
              "1": "RTAs/supervisors monitor manually and make ad hoc adjustments.",
              "2": "Real-time adherence dashboards in use; intraday actions triggered by human review.",
              "3": "Deviations trigger automated responses (rerouting, break/overtime triggers) with human oversight for exceptions."
            },
            "clinical": {
              "1": "Clinical supervisors monitor manually; reallocation ad hoc and constrained by licensure.",
              "2": "Real-time dashboards in use; intraday clinical reallocation triggered by human review within coverage rules.",
              "3": "Deviations trigger automated reallocation within licensure/skill rules; clinicians oversee exceptions."
            },
            "him": {
              "1": "Backlog/aging monitored manually; reallocation of coders ad hoc.",
              "2": "Inventory/aging dashboards in use; reallocation triggered by human review.",
              "3": "Backlog and TAT-risk deviations trigger automated work rerouting/priority changes; leads handle exceptions."
            }
          }
        },
        {
          "id": "D3-Q4",
          "question": "How integrated are planning tools with other operational systems (ACD, CRM, HR, EHR, billing)?",
          "artifactHint": "Integration architecture diagrams, API configs, manual import logs",
          "anchors": {
            "nonclinical": {
              "1": "WFM operates in isolation; ACD/CRM/HR data manually imported or cross-referenced.",
              "2": "WFM integrated with key systems for core flows; some manual steps for edge cases.",
              "3": "Full integration across WFM, ACD, CRM, HR; data flows automatically for real-time decisioning."
            },
            "clinical": {
              "1": "Clinical planning isolated; case/EHR/HR data manually imported.",
              "2": "Planning integrated with key clinical/case systems; some manual steps.",
              "3": "Full integration across planning, case, EHR, HR with automatic flow for real-time decisioning (PHI minimum-necessary)."
            },
            "him": {
              "1": "Capacity tool isolated; inflow/inventory data manually imported from EHR/billing.",
              "2": "Integrated with key source systems for inventory flow; some manual steps.",
              "3": "Full integration across capacity, EHR, workflow and billing; automatic inventory/TAT decisioning."
            }
          }
        },
        {
          "id": "D3-Q5",
          "question": "How is forecast accuracy tracked and used to improve future planning?",
          "artifactHint": "Forecast accuracy reports, variance analysis, model tuning logs, planner notes",
          "anchors": {
            "nonclinical": {
              "1": "Forecast accuracy not consistently measured; errors noticed but not reviewed.",
              "2": "Accuracy tracked and reviewed in planning meetings; learnings inform manual adjustments.",
              "3": "Accuracy auto-measured and fed back into the model; improvement is continuous and system-driven."
            },
            "clinical": {
              "1": "Clinical demand accuracy not consistently measured.",
              "2": "Accuracy tracked/reviewed; learnings inform manual adjustments.",
              "3": "Accuracy auto-measured and fed back into the model continuously."
            },
            "him": {
              "1": "Inflow/capacity forecast accuracy not consistently measured.",
              "2": "Accuracy tracked/reviewed; learnings inform manual adjustments.",
              "3": "Accuracy auto-measured and fed back into the model continuously."
            }
          }
        },
        {
          "id": "D3-Q6",
          "question": "How are staffing risks (understaffing, absenteeism, attrition impact) anticipated and addressed?",
          "artifactHint": "Contingency plans, scenario-modeling outputs, predictive risk alerts, absenteeism trends",
          "anchors": {
            "nonclinical": {
              "1": "Staffing risks identified reactively when they materialise; responses ad hoc.",
              "2": "Known risk patterns planned for; WFM supports scenario modeling.",
              "3": "Predictive models identify staffing risks before they occur and trigger contingency actions automatically."
            },
            "clinical": {
              "1": "Clinical staffing/licensure-coverage risks handled reactively.",
              "2": "Known patterns planned for; scenario modeling supports coverage decisions.",
              "3": "Predictive models flag coverage/attrition risk early and trigger contingency within licensure rules."
            },
            "him": {
              "1": "Backlog/attrition risks handled reactively.",
              "2": "Known peaks (month-end, coding deadlines) planned for; scenario modeling supports.",
              "3": "Predictive models flag backlog/TAT-breach and attrition risk early and trigger contingency automatically."
            }
          }
        },
        {
          "id": "D3-Q7",
          "question": "How are planning recommendations communicated to and followed by operational teams?",
          "artifactHint": "Compliance reports, WFM-to-ops comms logs, push-notification configs, adherence dashboards",
          "anchors": {
            "nonclinical": {
              "1": "Recommendations communicated informally; adherence depends on supervisor compliance.",
              "2": "Recommendations formally communicated via structured channels; compliance tracked manually.",
              "3": "Recommendations pushed directly to supervisors/agents via ops tools; adherence measured automatically."
            },
            "clinical": {
              "1": "Clinical staffing/coverage guidance communicated informally; adherence individual.",
              "2": "Guidance formally communicated; compliance tracked manually.",
              "3": "Guidance pushed via ops tools; adherence measured automatically."
            },
            "him": {
              "1": "Work priorities communicated informally; adherence individual.",
              "2": "Priorities formally communicated; queue compliance tracked manually.",
              "3": "Priorities/assignments pushed via workflow tools; adherence to queue/priority measured automatically."
            }
          }
        }
      ]
    },
    {
      "id": "D4",
      "name": "Data Infrastructure & Integration",
      "weight": 25,
      "questions": [
        {
          "id": "D4-Q1",
          "question": "How is data moved between operational systems (ACD, CRM, WFM, QA, BI, EHR)?",
          "artifactHint": "Integration architecture diagrams, ETL/API configs, manual-export SOPs, batch logs",
          "anchors": {
            "nonclinical": {
              "1": "Data manually exported from source systems and consolidated in Excel; movement is person-dependent.",
              "2": "Integration tools or scheduled batches automate most movement; some manual steps for edge cases.",
              "3": "Automated API/ETL pipelines move data in real time across all systems; no manual intervention."
            },
            "clinical": {
              "1": "Clinical/case data (EHR, criteria tool, case system) manually exported or re-keyed; PHI moved via spreadsheets/email.",
              "2": "Integrations automate most clinical data movement; PHI transfers over approved, encrypted channels; some manual steps remain.",
              "3": "Automated, encrypted pipelines move clinical data in real time with minimum-necessary scoping and full transfer logging; no manual PHI handling."
            },
            "him": {
              "1": "Chart/coding data manually exported and reconciled; PHI in spreadsheets.",
              "2": "Integrations (EHR ↔ encoder ↔ billing) automate most movement; PHI over encrypted channels; some manual steps.",
              "3": "Automated, encrypted, logged pipelines move chart/coding/billing data in real time under minimum-necessary access; no manual PHI handling."
            }
          }
        },
        {
          "id": "D4-Q2",
          "question": "How is data quality validated and monitored?",
          "artifactHint": "DQ check scripts, alert configs, anomaly-detection logs, reconciliation records",
          "anchors": {
            "nonclinical": {
              "1": "Data-quality issues discovered manually, usually when discrepancies surface in reports.",
              "2": "DQ checks run periodically; exceptions flagged for manual review.",
              "3": "Automated continuous DQ monitoring; anomalies detected and alerted before they reach reporting layers."
            },
            "clinical": {
              "1": "Clinical-data errors caught manually when cases or decisions go wrong.",
              "2": "Periodic clinical-data-quality checks; exceptions flagged for review.",
              "3": "Continuous monitoring of clinical data integrity (missing/contradictory clinical fields, authorization mismatches) with pre-report alerting."
            },
            "him": {
              "1": "Coding/abstraction data errors caught manually downstream (denials, rejections).",
              "2": "Periodic DQ and coding-accuracy checks; exceptions flagged.",
              "3": "Continuous monitoring of coding/abstraction data integrity with anomaly alerts before claims or records are released."
            }
          }
        },
        {
          "id": "D4-Q3",
          "question": "Is there a single trusted source of operational truth used consistently across the program?",
          "artifactHint": "BI platform screenshots, data-governance docs, user access logs",
          "anchors": {
            "nonclinical": {
              "1": "Multiple reports show different numbers; teams keep their own versions; manual reconciliation precedes every decision.",
              "2": "A primary BI platform is broadly used; minor discrepancies occasionally require validation.",
              "3": "One authoritative platform used across all teams and levels; data disputes do not occur and reconciliation is not needed."
            },
            "clinical": {
              "1": "Case/clinical numbers differ across trackers; reconciliation required before reviews.",
              "2": "A primary clinical dashboard is mostly trusted; minor discrepancies validated.",
              "3": "One authoritative clinical/case-data source across all roles; no reconciliation needed."
            },
            "him": {
              "1": "Production/accuracy numbers differ across trackers; reconciliation before meetings.",
              "2": "A primary production dashboard mostly trusted; minor discrepancies validated.",
              "3": "One authoritative production/quality source used across all teams; no reconciliation needed."
            }
          }
        },
        {
          "id": "D4-Q4",
          "question": "How accessible is operational data to frontline leaders without analyst support?",
          "artifactHint": "BI access logs, self-service training records, analyst request volume",
          "anchors": {
            "nonclinical": {
              "1": "Leaders request data from analysts; self-service limited to basic tools.",
              "2": "Leaders access most dashboards independently; complex/ad hoc analysis still needs specialists.",
              "3": "Leaders fully self-serve all operational data, slice by dimension and build ad hoc views without specialists."
            },
            "clinical": {
              "1": "Clinical leaders rely on analysts for case/clinical data.",
              "2": "Clinical leaders self-serve most dashboards within role-based access; complex analysis needs specialists.",
              "3": "Clinical leaders fully self-serve within minimum-necessary access controls; ad hoc views without specialists."
            },
            "him": {
              "1": "Coding/QA leaders request data pulls from analysts.",
              "2": "Leaders self-serve most production/quality dashboards; complex analysis needs specialists.",
              "3": "Full self-serve within role-based access; ad hoc views without specialists."
            }
          }
        },
        {
          "id": "D4-Q5",
          "question": "How are access, privacy and security controls managed for operational data (PHI)?  ⚑ COMPLIANCE FLOOR QUESTION",
          "artifactHint": "Access-control policy, RBAC configs, audit logs, BAA/DPA records, security-review records",
          "anchors": {
            "nonclinical": {
              "1": "Access controls informal or inconsistently applied; access based on trust rather than policy.",
              "2": "Role-based access on core systems; reviews happen periodically.",
              "3": "Automated, policy-driven, continuously audited access; minimum-necessary enforced; exceptions alert and resolve; aligned to HIPAA and PH Data Privacy Act (RA 10173)."
            },
            "clinical": {
              "1": "PHI access informal; staff can see more than minimum-necessary; no consistent audit.",
              "2": "Role-based PHI access on core clinical systems; periodic access reviews; BAAs in place.",
              "3": "Automated minimum-necessary PHI access, continuously audited; consent/authorization enforced; breach-risk exceptions alert and resolve; HIPAA + RA 10173 aligned with evidence."
            },
            "him": {
              "1": "Chart/PHI access broad; ROI authorization checks manual/inconsistent; audit spotty.",
              "2": "Role-based access to charts/coding systems; ROI authorization verified; periodic audits; BAAs in place.",
              "3": "Automated minimum-necessary access to PHI and coding data, continuously audited; ROI release governed by verified authorization; HIPAA + RA 10173 aligned with evidence."
            }
          }
        },
        {
          "id": "D4-Q6",
          "question": "How advanced are the analytics capabilities available to the program?",
          "artifactHint": "Dashboard samples, BI feature inventory, predictive-model outputs, analytics roadmap",
          "anchors": {
            "nonclinical": {
              "1": "Analytics primarily descriptive (what happened); historical reports with limited drill-down.",
              "2": "Diagnostic analytics available (why it happened); trend analysis and comparison.",
              "3": "Predictive and prescriptive analytics in use (what will happen / what to do); AI generates forward-looking insight."
            },
            "clinical": {
              "1": "Descriptive clinical reporting (volumes, turnaround).",
              "2": "Diagnostic (why cases breach; variation analysis).",
              "3": "Predictive/prescriptive (risk stratification, case-surge forecasting, next-best clinical action) — clinician-governed."
            },
            "him": {
              "1": "Descriptive (productivity, accuracy history).",
              "2": "Diagnostic (denial root-cause, error-trend analysis).",
              "3": "Predictive/prescriptive (denial prediction, CMI/coding-risk forecasting, automation targeting)."
            }
          }
        },
        {
          "id": "D4-Q7",
          "question": "How are data-infrastructure gaps identified and addressed over time?",
          "artifactHint": "Infrastructure gap logs, IT-governance notes, platform roadmap, monitoring dashboards",
          "anchors": {
            "nonclinical": {
              "1": "Gaps identified reactively when data is missing or wrong; no formal improvement process.",
              "2": "Infrastructure issues tracked and prioritized in IT/analytics governance reviews.",
              "3": "Continuous monitoring surfaces gaps proactively; improvement managed through a structured platform roadmap."
            },
            "clinical": {
              "1": "Clinical-data and compliance gaps found reactively.",
              "2": "Tracked in governance including privacy/security review.",
              "3": "Continuous monitoring surfaces infrastructure and PHI-governance gaps proactively; managed via roadmap."
            },
            "him": {
              "1": "Coding-data and integration gaps found reactively.",
              "2": "Tracked in IT/coding governance.",
              "3": "Continuous monitoring surfaces gaps (integration, data integrity, compliance) proactively; roadmap-managed."
            }
          }
        }
      ]
    },
    {
      "id": "D5",
      "name": "Decision Intelligence & AI Enablement",
      "weight": 20,
      "questions": [
        {
          "id": "D5-Q1",
          "question": "How is AI currently used in day-to-day operations?",
          "artifactHint": "AI tool inventory, usage logs, workflow-integration screenshots, AI output samples",
          "anchors": {
            "nonclinical": {
              "1": "AI not in use, or limited to basic tools (spell-check, FAQ bots) with no operational integration.",
              "2": "AI used for specific tasks (summaries, transcript analysis, report generation) but standalone and manually triggered.",
              "3": "AI embedded across workflows; continuously processes data, generates recommendations and initiates actions without prompting."
            },
            "clinical": {
              "1": "AI not used clinically, or only basic non-clinical helpers.",
              "2": "AI assists specific clinical tasks (documentation drafting, summarisation) but standalone, manually triggered, clinician-reviewed.",
              "3": "AI embedded across clinical workflows generating recommendations continuously; clinicians retain decision authority and care-affecting actions are never auto-executed."
            },
            "him": {
              "1": "AI/CAC not in use, or basic assist only.",
              "2": "NLP/CAC assists coding on specific work types; suggestions manually accepted.",
              "3": "AI/autonomous coding embedded across workflows, auto-coding low-risk records and pre-coding the rest; humans validate high-impact codes and nothing high-risk auto-finalises."
            }
          }
        },
        {
          "id": "D5-Q2",
          "question": "How are AI-generated outputs reviewed, validated and governed?",
          "artifactHint": "AI governance policy, review-workflow docs, audit-trail screenshots, override logs",
          "anchors": {
            "nonclinical": {
              "1": "No formal process; AI outputs used without review or not used at all.",
              "2": "A review process exists; humans validate before acting on recommendations.",
              "3": "A governance framework defines when AI can act autonomously versus when human review is required; audit trails maintained."
            },
            "clinical": {
              "1": "No clinical AI governance; outputs used without structured review or avoided.",
              "2": "A clinical review process exists; clinicians validate before acting.",
              "3": "A clinical-AI governance framework defines autonomy boundaries (never for care decisions), with mandatory clinician sign-off on medically-significant outputs and full audit trails."
            },
            "him": {
              "1": "No coding-AI governance; CAC output accepted or ignored without control.",
              "2": "A review process exists; coders validate AI-suggested codes before finalising.",
              "3": "A coding-AI governance framework defines which code types may auto-finalise versus require human validation; override logs and audit trails maintained."
            }
          }
        },
        {
          "id": "D5-Q3",
          "question": "How capable are frontline leaders and staff in using AI and analytics tools?",
          "artifactHint": "Training records, skills assessments, tool usage by role, self-service adoption metrics",
          "anchors": {
            "nonclinical": {
              "1": "AI/analytics use concentrated in a few specialists; most leaders rely on others.",
              "2": "Most leaders use BI and basic AI tools independently; advanced configuration remains specialised.",
              "3": "Teams across roles can configure, interpret and improve AI tools; enablement is continuous and embedded in role expectations."
            },
            "clinical": {
              "1": "Clinical AI/analytics use concentrated in specialists; most clinicians rely on others.",
              "2": "Most clinical leaders use BI and basic AI tools independently; advanced work remains specialised.",
              "3": "Clinical teams across roles can interpret and improve AI tools; enablement is embedded in role expectations."
            },
            "him": {
              "1": "AI/analytics use concentrated in specialists; most coders rely on others.",
              "2": "Most coding leaders use BI and CAC tools independently; advanced config remains specialised.",
              "3": "Coding teams across roles can configure, interpret and improve AI tools; enablement is embedded in role expectations."
            }
          }
        },
        {
          "id": "D5-Q4",
          "question": "How are operational decisions currently made at the leadership level?",
          "artifactHint": "Decision logs, meeting decks, AI recommendation outputs, governance frameworks",
          "anchors": {
            "nonclinical": {
              "1": "Decisions primarily experience-driven; data referenced selectively or after the fact.",
              "2": "Decisions informed by dashboards/reports in structured meetings; humans drive all interpretation.",
              "3": "Decisions guided by system recommendations and predictive insight; human judgment applied at exception/strategy level."
            },
            "clinical": {
              "1": "Clinical-operational decisions experience-driven; data referenced selectively.",
              "2": "Decisions informed by clinical dashboards in structured reviews; clinicians interpret.",
              "3": "Decisions guided by predictive insight and recommendations; clinical judgment applied at exception/strategy level and for all care-affecting calls."
            },
            "him": {
              "1": "Decisions experience-driven; data referenced selectively.",
              "2": "Decisions informed by production/quality dashboards in reviews.",
              "3": "Decisions guided by predictive insight (denial risk, capacity); human judgment applied at exception/strategy level."
            }
          }
        },
        {
          "id": "D5-Q5",
          "question": "How is trust in AI and data outputs built and maintained across the program?",
          "artifactHint": "Explainability docs, confidence-scoring outputs, training on AI limitations, user feedback",
          "anchors": {
            "nonclinical": {
              "1": "Trust low or absent; teams prefer manual methods and are sceptical of system outputs.",
              "2": "Trust exists for established reports/tools; new AI outputs need validation before adoption.",
              "3": "Trust built systematically through transparency, explainability and track record; teams understand model confidence levels."
            },
            "clinical": {
              "1": "Clinical trust low; clinicians prefer manual methods.",
              "2": "Trust exists for established tools; new clinical AI validated before adoption.",
              "3": "Trust built through explainability, confidence scoring and a clinical-validation track record; clinicians understand model limits."
            },
            "him": {
              "1": "Coders sceptical of CAC/AI; prefer manual coding.",
              "2": "Trust exists for established tools; new AI validated before adoption.",
              "3": "Trust built through explainability and an accuracy track record; coders understand model confidence and limits."
            }
          }
        },
        {
          "id": "D5-Q6",
          "question": "How far in advance can the program anticipate operational problems?",
          "artifactHint": "Leading-indicator dashboards, predictive-alert logs, early-warning screenshots, post-mortems",
          "anchors": {
            "nonclinical": {
              "1": "Problems identified when they occur or after performance declines; response is reactive.",
              "2": "Known patterns planned for; some leading indicators monitored for early warning.",
              "3": "Predictive models identify risks hours or days in advance; the program shifts resources before problems materialise."
            },
            "clinical": {
              "1": "Clinical-operational problems identified reactively.",
              "2": "Some leading indicators (turnaround risk, volume surge) monitored.",
              "3": "Predictive models flag clinical-operational risk days ahead; the program acts pre-emptively, clinician-governed."
            },
            "him": {
              "1": "Backlog/denial problems noticed after they occur.",
              "2": "Some leading indicators (aging, inflow spikes) monitored.",
              "3": "Predictive models flag backlog/TAT/denial risk days ahead; the program reallocates pre-emptively."
            }
          }
        },
        {
          "id": "D5-Q7",
          "question": "How are AI investments and use cases evaluated for business impact?",
          "artifactHint": "AI use-case register, ROI templates, post-implementation reviews, tool-retirement records",
          "anchors": {
            "nonclinical": {
              "1": "AI tools adopted without structured evaluation; impact anecdotal or unmeasured.",
              "2": "Use cases tracked and reviewed periodically; ROI assessed informally.",
              "3": "A formal AI value framework scores use cases on impact, adoption and ROI; underperformers are retrained or retired."
            },
            "clinical": {
              "1": "Clinical AI adopted without structured evaluation.",
              "2": "Use cases tracked and reviewed periodically; ROI assessed informally.",
              "3": "A formal value framework scores clinical use cases on impact, adoption, ROI and outcome/compliance effect; underperformers retrained or retired."
            },
            "him": {
              "1": "Coding AI adopted without structured evaluation.",
              "2": "Use cases tracked and reviewed periodically; ROI assessed informally.",
              "3": "A formal value framework scores use cases on accuracy lift, denial reduction, productivity and ROI; underperformers retrained or retired."
            }
          }
        }
      ]
    },
    {
      "id": "D6",
      "name": "Agent Experience & Interaction Execution",
      "weight": 15,
      "questions": [
        {
          "id": "D6-Q1",
          "question": "How many systems does a worker interact with to complete one unit of work (a contact / a case / a chart)?",
          "artifactHint": "Desktop screenshots, per-interaction system inventory, AHT or records-per-hour by tool complexity",
          "anchors": {
            "nonclinical": {
              "1": "Agent navigates 4+ disconnected systems during a live contact; manual switching adds handle time.",
              "2": "Core systems consolidated in a unified desktop; some switching for specialised tasks.",
              "3": "One desktop integrates all systems; context carries automatically; no manual switching."
            },
            "clinical": {
              "1": "Clinician toggles across 4+ systems mid-interaction (clinical platform, criteria tool e.g. InterQual/MCG, EHR, documentation); PHI re-keyed.",
              "2": "Clinical desktop consolidates criteria, history and documentation; some switching; PHI access role-based.",
              "3": "Unified clinical workspace assembles guidelines, history and documentation under minimum-necessary access; clinician keeps decision authority; every AI-surfaced item auditable."
            },
            "him": {
              "1": "Coder/CDI/editor works a chart across disconnected tools (document viewer, encoder, references, query tracker), moving manually per record.",
              "2": "Production workstation consolidates chart + encoder + references; CAC suggests codes; some manual lookup remains.",
              "3": "Integrated governed HIM platform auto-assembles the chart and pre-populates suggested codes (CAC/autonomous), routing only exceptions; high-impact codes never auto-finalised without validation; full audit trail."
            }
          }
        },
        {
          "id": "D6-Q2",
          "question": "How is post-work finalisation (wrap-up, notes, record closure) handled?",
          "artifactHint": "Wrap-up time / ACW reports, note templates, AI-summarisation screenshots",
          "anchors": {
            "nonclinical": {
              "1": "Agents manually type notes, update multiple systems and select dispositions after each contact; wrap-up is significant.",
              "2": "Templates/structured forms reduce free-text; some fields auto-populate from interaction data.",
              "3": "AI generates summaries and case notes; agents review and confirm rather than compose; wrap-up is minimal."
            },
            "clinical": {
              "1": "Clinicians manually document the encounter, disposition and care-plan/authorization updates across systems.",
              "2": "Structured clinical templates; some fields auto-populate; documentation partly guided.",
              "3": "AI drafts the clinical summary/documentation; the clinician reviews, edits and signs off (attestation required); documentation time is minimal."
            },
            "him": {
              "1": "Coder manually documents code assignment and query rationale and routes the record to billing.",
              "2": "Structured finalisation templates; some fields (codes, DRG) auto-populate; partly guided.",
              "3": "AI drafts finalisation (codes, DRG, query documentation); the coder validates and attests; handoff to billing is automatic."
            }
          }
        },
        {
          "id": "D6-Q3",
          "question": "How are repetitive or rules-based tasks handled (transfers, lookups, status updates)?",
          "artifactHint": "Automation workflow configs, macro logs, RPA task inventory, handle-time breakdown",
          "anchors": {
            "nonclinical": {
              "1": "Agents perform all lookups, transfers and updates manually during live work.",
              "2": "Common tasks supported by shortcuts, macros or pre-built workflows.",
              "3": "Repetitive tasks automated or one-click; bots/RPA handle background steps while the agent stays with the customer."
            },
            "clinical": {
              "1": "Clinicians perform eligibility checks, authorization lookups and standard documentation manually.",
              "2": "Shortcuts/macros/pre-built workflows reduce steps.",
              "3": "Rules-based clinical-admin tasks automated (eligibility, authorization status, standard notes); clinician stays focused on the case; clinical judgment is never automated."
            },
            "him": {
              "1": "Coders perform all code lookups, standard assignments and record routing manually.",
              "2": "Shortcuts, encoder logic and pre-built rules reduce steps.",
              "3": "Rules-based coding tasks automated (standard/low-risk code assignment, routing); RPA handles background steps; the coder validates."
            }
          }
        },
        {
          "id": "D6-Q4",
          "question": "How do workers access knowledge, policies and procedures while working?",
          "artifactHint": "Knowledge-base platform screenshots, search logs, article-usage reports, desktop integration configs",
          "anchors": {
            "nonclinical": {
              "1": "Agents search separate knowledge bases, ask colleagues or use printed material; searches are manual and slow.",
              "2": "A centralised knowledge base is accessible during work; agents retrieve articles with reasonable speed.",
              "3": "Knowledge is surfaced contextually to the interaction; relevant articles/scripts/next steps appear automatically without searching."
            },
            "clinical": {
              "1": "Clinicians search separate protocol/criteria/drug references or ask colleagues; manual and slow.",
              "2": "Centralised clinical knowledge is accessible during the interaction; retrieval is reasonably fast.",
              "3": "Clinical guidance (protocols, criteria, drug info) is surfaced contextually to the case; the clinician validates applicability."
            },
            "him": {
              "1": "Coders search separate coding references, guidelines and client rules; manual and slow.",
              "2": "Centralised coding knowledge is accessible while working the chart; retrieval is reasonably fast.",
              "3": "Relevant coding guidance, edits and client rules are surfaced contextually to the record automatically."
            }
          }
        },
        {
          "id": "D6-Q5",
          "question": "How much context is available to the worker at the start of the unit of work?",
          "artifactHint": "Screen-pop config, CTI integration docs, context-panel examples, chart-assembly configs",
          "anchors": {
            "nonclinical": {
              "1": "Agents start with minimal context; ask customers to re-explain and look up history manually.",
              "2": "Basic screen pop provides name/account; agents still navigate for full history.",
              "3": "Full history, prior case context, sentiment and predicted intent are presented at the moment of connection."
            },
            "clinical": {
              "1": "Clinicians start with minimal context; re-collect history and look up prior cases/authorizations manually.",
              "2": "Basic context (member/patient, plan) provided; the clinician navigates for full clinical history.",
              "3": "Full clinical history, prior authorizations, care plan and risk flags are assembled and presented at the start (within minimum-necessary access)."
            },
            "him": {
              "1": "Coder opens a record with incomplete context and manually gathers documentation, prior coding and encounter data.",
              "2": "Basic record context is assembled; the coder navigates for full documentation.",
              "3": "Complete chart context (all documentation, prior coding, encounter/patient data) is auto-assembled when the work item opens."
            }
          }
        },
        {
          "id": "D6-Q6",
          "question": "How are workers guided or prompted during the work?",
          "artifactHint": "Real-time assist screenshots, script/decision-tree configs, AI prompt logs, whisper/barge data",
          "anchors": {
            "nonclinical": {
              "1": "Agents rely on memorised scripts, experience and ad hoc supervisor help; no real-time guidance.",
              "2": "Scripting/decision trees are available and followed; supervisors can whisper/barge.",
              "3": "AI gives real-time guidance - suggested responses, compliance alerts, sentiment, next-best-action - updated dynamically."
            },
            "clinical": {
              "1": "Clinicians rely on training/experience and ad hoc supervisor help; no real-time support.",
              "2": "Protocols/decision trees are available and followed; supervisors assist in complex cases.",
              "3": "AI provides real-time clinical decision support (protocol prompts, compliance/safety alerts, next-best-action) - advisory only; the clinician decides and documents the rationale."
            },
            "him": {
              "1": "Coders rely on knowledge/experience and ad hoc lead help; no real-time support.",
              "2": "Encoder logic and edit checks guide coding as it happens.",
              "3": "AI provides real-time coding guidance (suggested codes, edit/compliance alerts, documentation-gap prompts, NLP); the coder validates and finalises."
            }
          }
        },
        {
          "id": "D6-Q7",
          "question": "How is performance feedback delivered relative to when the work occurs?",
          "artifactHint": "QA turnaround reports, real-time coaching screenshots, feedback-workflow docs, self-service QA portal",
          "anchors": {
            "nonclinical": {
              "1": "Feedback delivered in scheduled sessions days or weeks later; little connection to specific behaviours.",
              "2": "QA/performance shared within days; agents review scored interactions and link feedback to examples.",
              "3": "Feedback near real-time or immediately post-interaction; automated nudges, sentiment scores and behaviour alerts while context is fresh."
            },
            "clinical": {
              "1": "Clinical feedback delivered in sessions days or weeks later.",
              "2": "Clinical QA shared within days; clinicians review scored cases.",
              "3": "Feedback near real-time or immediately post-case; automated documentation/quality nudges while context is fresh, clinician-reviewed."
            },
            "him": {
              "1": "Coding feedback delivered days or weeks later, often via denials.",
              "2": "Coding-QA results shared within days; coders review scored records.",
              "3": "Feedback near real-time or at finalisation; automated accuracy/edit nudges while the record is fresh."
            }
          }
        }
      ]
    }
  ],
  "packages": [
    {
      "min": 0,
      "max": 47,
      "code": "P1",
      "name": "Foundation Build"
    },
    {
      "min": 48,
      "max": 61,
      "code": "P2",
      "name": "Operational Digitization"
    },
    {
      "min": 62,
      "max": 75,
      "code": "P3",
      "name": "Intelligence Activation"
    },
    {
      "min": 76,
      "max": 89,
      "code": "P4",
      "name": "AI & Automation Scale"
    },
    {
      "min": 90,
      "max": 100,
      "code": "P5",
      "name": "Tech-Led Optimization"
    }
  ]
};
