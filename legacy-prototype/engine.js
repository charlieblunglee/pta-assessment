(function(g){
  const C=g.PTA_CONFIG;
  const pkg=(code)=>C.packages.find(p=>p.code===code);
  const maturity=(score)=>C.maturityBands.find(b=>score>=b.min&&score<=b.max)?.label||"Baseline";
  const packageByScore=(score)=>C.packages.find(p=>score>=p.min&&score<=p.max)||C.packages[0];
  const cap=(current,maxCode)=>Number(current.code.slice(1))>Number(maxCode.slice(1))?pkg(maxCode):current;
  function evaluate(input){
    const domainResults=C.domains.map(d=>{
      const answered=d.questions.filter(q=>Number(input.answers[q.id]?.score)>=1).length;
      const raw=d.questions.reduce((s,q)=>s+Number(input.answers[q.id]?.score||0),0);
      const precise=answered===d.questions.length?Math.max(0,20+((raw-7)/14)*80):0;
      return {id:d.id,name:d.name,weight:d.weight,raw,precise,score:Math.round(precise),maturity:maturity(Math.round(precise))};
    });
    const programPrecise=domainResults.reduce((s,d)=>s+d.precise*(d.weight/100),0);
    const programScore=Math.round(programPrecise), basePackage=packageByScore(programScore);
    const ranked=[...domainResults].sort((a,b)=>a.precise-b.precise);
    const lowestDomain=ranked[0], strongestDomain=ranked.at(-1);
    const yellowDomains=domainResults.filter(d=>d.precise<=C.thresholds.yellowDomainMax);
    const blueDomains=domainResults.filter(d=>d.precise>=C.thresholds.blueDomainMin);
    let finalPackage=basePackage;
    const triggeredOverrides=[],complianceCaps=[];
    const d=(id)=>domainResults.find(x=>x.id===id);
    if(d("D4").precise<=C.thresholds.yellowDomainMax){finalPackage=pkg("P1");triggeredOverrides.push({rule:"Data Infrastructure Foundation Override",reason:"Data Infrastructure & Integration is under-developed and is foundational to downstream automation, intelligence, and AI."});}
    else if(yellowDomains.length>=3){finalPackage=pkg("P1");triggeredOverrides.push({rule:"Broad Foundation Gap",reason:`${yellowDomains.length} domains are under-developed and require stabilization before advanced investment.`});}
    else if(d("D1").precise<=C.thresholds.yellowDomainMax||d("D3").precise<=C.thresholds.yellowDomainMax){const before=finalPackage;finalPackage=cap(finalPackage,"P2");if(before.code!==finalPackage.code)triggeredOverrides.push({rule:"Work Execution / Workforce Override",reason:"Core workflow execution or workforce management remains substantially manual, so the direction is capped at Operational Digitization."});}
    if(blueDomains.length>=4&&d("D4").precise>=C.thresholds.blueDomainMin&&d("D5").precise>=C.thresholds.blueDomainMin&&!triggeredOverrides.length){finalPackage=pkg("P5");triggeredOverrides.push({rule:"Tech-Led Qualification",reason:"At least four domains are Tech-Led, including Data Infrastructure and Decision Intelligence."});}
    if(finalPackage.code==="P5"&&d("D5").precise<C.thresholds.d5P5Minimum){finalPackage=pkg("P4");triggeredOverrides.push({rule:"Decision Intelligence Constraint",reason:"Decision Intelligence & AI Enablement is below the configured P5 qualification threshold."});}
    if(Number(input.answers[C.compliance.privacyQuestion]?.score)===1){const before=finalPackage;finalPackage=cap(finalPackage,C.compliance.capPackage);complianceCaps.push({gate:"Privacy, Security & PHI Controls",reason:"Privacy, security, and PHI controls require remediation before advanced intelligence or AI solutions should be scaled.",changed:before.code!==finalPackage.code});}
    if(["clinical","him"].includes(input.archetype)&&Number(input.answers[C.compliance.aiGovernanceQuestion]?.score)===1){const before=finalPackage;finalPackage=cap(finalPackage,C.compliance.capPackage);complianceCaps.push({gate:"Clinical / HIM AI Governance",reason:"Clinical or coding AI governance requires further development before advanced AI-enabled solutions should be recommended.",changed:before.code!==finalPackage.code});}
    const evidenced=Object.values(input.answers).filter(a=>String(a.note||"").trim()||a.artifactName).length;
    const confidenceScore=Math.round((evidenced/42)*100);
    const confidenceLevel=confidenceScore>=C.confidence.highMin?"High":confidenceScore>=C.confidence.moderateMin?"Moderate":"Low";
    const triggers=[];
    if(confidenceScore<C.confidence.moderateMin)triggers.push({type:"Low Evidence",detail:"Supporting evidence is below the configured recommendation threshold."});
    else if(confidenceScore<C.confidence.highMin)triggers.push({type:"Targeted Validation",detail:"Evidence supports a directional recommendation, but selected findings should be validated."});
    const boundaries=[48,62,76,90]; if(boundaries.some(x=>Math.abs(programPrecise-x)<=C.thresholds.boundaryTolerance))triggers.push({type:"Package Boundary Validation",detail:"A small scoring difference could change the maturity tier."});
    const otherMean=domainResults.filter(x=>x.id!==lowestDomain.id).reduce((s,x)=>s+x.precise,0)/5;
    if(otherMean-lowestDomain.precise>=C.thresholds.outlierGap)triggers.push({type:"Domain Deep Dive Recommended",detail:`${lowestDomain.id} is materially below the remaining domain profile.`});
    if(blueDomains.length>=2&&yellowDomains.length>=1)triggers.push({type:"Mixed Maturity Profile",detail:"Highly mature capabilities coexist with one or more under-developed domains."});
    if(complianceCaps.length&&(!input.answers[C.compliance.privacyQuestion]?.note&&!input.answers[C.compliance.privacyQuestion]?.artifactName))triggers.push({type:"Governance Deep Dive",detail:"A healthcare governance gate has limited supporting evidence."});
    if(input.mixedWork)triggers.push({type:"Mixed Healthcare Archetype",detail:"Assess each materially different line of business or archetype separately rather than blending operating models."});
    let assessmentDisposition="Recommendation Ready";
    if(confidenceScore<C.confidence.moderateMin||triggers.some(t=>t.type==="Governance Deep Dive"))assessmentDisposition="Deep-Dive Assessment Required";
    else if(triggers.length)assessmentDisposition="Targeted Further Analysis Recommended";
    const track=C.archetypes[input.archetype];
    const noOverride=!triggeredOverrides.some(x=>x.rule!=="Tech-Led Qualification");
    const explanation=`The program's overall technology maturity supports ${basePackage.name}. ${noOverride?"No foundational package override was triggered.":triggeredOverrides[0].reason} ${complianceCaps.length?complianceCaps.map(x=>x.reason).join(" "):"No healthcare governance cap was triggered."} ${lowestDomain.name} is the lowest-scoring domain and becomes the primary focus of the ${finalPackage.code} solution roadmap.`;
    const deepDive=C.deepDives[lowestDomain.id];
    return {programScore,programPrecise,programMaturity:maturity(programScore),domainResults,strongestDomain,lowestDomain,yellowCount:yellowDomains.length,blueCount:blueDomains.length,basePackage,basePackageReason:`Weighted score ${programScore} falls in the ${basePackage.min}–${basePackage.max} band.`,triggeredOverrides,complianceCaps,finalPackage,primarySolutionFocus:`${lowestDomain.id} — ${lowestDomain.name}`,confidenceScore,confidenceLevel,evidenceCount:evidenced,furtherAnalysisTriggers:triggers,assessmentDisposition,recommendedDeepDive:deepDive,healthcareTrack:track.title,recommendationExplanation:explanation};
  }
  g.PTA_ENGINE={evaluate,maturity,packageByScore};
})(window);
