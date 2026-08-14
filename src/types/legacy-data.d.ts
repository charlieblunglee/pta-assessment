interface LegacyQuestion { id:string; question:string; artifactHint:string; anchors:Record<string,Record<"1"|"2"|"3",string>> }
interface LegacyDomain { id:"D1"|"D2"|"D3"|"D4"|"D5"|"D6"; name:string; weight:number; questions:LegacyQuestion[] }
interface LegacyAssessmentData { domains:LegacyDomain[] }
interface Window { ASSESSMENT_DATA?: LegacyAssessmentData }
