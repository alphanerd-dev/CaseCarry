export type SupportedLanguage = 'en' | 'yo' | 'ha' | 'ig' | 'pcm';

export interface TranslationDict {
  // Brand & Common
  appName: string;
  tagline: string;
  citizenCaseContinuity: string;
  carryCaseForward: string;
  exploreDemo: string;
  howItWorks: string;
  trustStatement: string;
  startCaseNow: string;
  startAnotherCase: string;
  back: string;
  continue: string;
  skip: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  remove: string;
  verify: string;
  export: string;
  print: string;
  download: string;
  copy: string;
  copied: string;
  copiedNotice: string;
  close: string;
  all: string;
  status: string;
  jurisdiction: string;
  authority: string;
  requiredDocuments: string;
  officialSource: string;
  lastChecked: string;
  uncertainties: string;
  viewSource: string;
  lowBandwidth: string;
  lowBandwidthOn: string;
  myCases: string;
  myCasesTitle: string;
  myCasesDesc: string;
  noSavedCases: string;
  saveDraft: string;
  savedLocally: string;
  saving: string;
  demoNotice: string;
  fictionalDemo: string;
  switchToRealCase: string;
  tryDemoPill: string;

  // Provenance badges
  sourceBacked: string;
  userReported: string;
  inferred: string;
  needsReview: string;
  conflict: string;
  privateDoc: string;

  // Stepper Labels
  stepContext: string;
  stepEvidence: string;
  stepReconstruction: string;
  stepVerification: string;
  stepUnresolved: string;
  stepPathways: string;
  stepPrivacy: string;
  stepBundle: string;

  // Step 1: Case Entry View
  entryTitle: string;
  entrySubtitle: string;
  outcomeQuestion: string;
  outcomeNoResponse: string;
  outcomeNoResponseDesc: string;
  outcomeDidntResolve: string;
  outcomeDidntResolveDesc: string;
  outcomeClosedWithoutReason: string;
  outcomeClosedWithoutReasonDesc: string;
  outcomeReferredLoop: string;
  outcomeReferredLoopDesc: string;
  outcomeOther: string;
  outcomeOtherDesc: string;
  providerQuestion: string;
  providerPlaceholder: string;
  refNumberQuestion: string;
  refNumberPlaceholder: string;
  summaryQuestion: string;
  summaryPlaceholder: string;

  // Step 2: Evidence Collection View
  evidenceTitle: string;
  evidenceSubtitle: string;
  dropzoneTitle: string;
  dropzoneSubtitle: string;
  browseFiles: string;
  fileSupportText: string;
  collectedEvidence: string;
  noEvidenceYet: string;
  manualTextEntry: string;
  addManualSnippet: string;

  // Step 3: Reconstruction View
  reconstructTitle: string;
  reconstructSubtitle: string;
  reconstructProcessing: string;
  timelineTitle: string;
  addEventManually: string;
  contradictionsDetected: string;
  missingInfoNoted: string;

  // Step 4: Verification View
  verifyTitle: string;
  verifySubtitle: string;
  verifyInstructions: string;
  verifyAllSourceBacked: string;
  allVerifiedConfirmation: string;
  provenanceExplainer: string;

  // Step 5: Unresolved Issue View
  unresolvedTitle: string;
  unresolvedSubtitle: string;
  unresolvedProblemLabel: string;
  unresolvedProblemPlaceholder: string;
  whatWasRequestedLabel: string;
  whatWasRequestedPlaceholder: string;
  whatHappenedLabel: string;
  whatHappenedPlaceholder: string;
  whatWasResolvedLabel: string;
  whatWasNotResolvedLabel: string;
  resolutionVisionLabel: string;
  alreadyTriedLabel: string;

  // Step 6: Pathway Guidance View
  pathwayTitle: string;
  pathwaySubtitle: string;
  pathwayStandardAttribution: string;
  inspectFactsBtn: string;
  addCustomPathwayBtn: string;
  tabAllPathways: string;
  tabPotential: string;
  tabAlreadyTried: string;
  tabExcluded: string;
  markAsPotential: string;
  markAsAlreadyTried: string;
  markAsExcluded: string;
  includeInBundle: string;
  whyRelevantLabel: string;

  // Step 7: Privacy Review View
  privacyTitle: string;
  privacySubtitle: string;
  privacyExplanation: string;
  includeInTransmission: string;
  retainPrivately: string;
  approveAndCreateBundle: string;

  // Step 8: Carry Forward Bundle View
  bundleTitle: string;
  bundleSubtitle: string;
  sec1Summary: string;
  sec2Problem: string;
  sec3ResolvedVsUnresolved: string;
  sec4DesiredResolution: string;
  sec5PriorSteps: string;
  sec6Chronology: string;
  sec7Contradictions: string;
  sec8Pathways: string;
  neutralityAttestation: string;

  // Step 9: Export View
  exportTitle: string;
  exportSubtitle: string;
  downloadText: string;
  downloadJson: string;
  printOrPdf: string;
  printPaperCopy: string;
  exportBundle: string;
  copySummary: string;
  optional: string;
  skipStep: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDict> = {
  en: {
    appName: 'CaseCarry',
    tagline: 'Don’t tell your story again.',
    citizenCaseContinuity: 'Citizen-controlled case continuity',
    carryCaseForward: 'Carry my case forward',
    exploreDemo: 'Explore fictional demo case',
    howItWorks: 'How it works',
    trustStatement: 'You stay in control. CaseCarry organizes your information; you review and approve what gets included.',
    startCaseNow: 'Start a case now',
    startAnotherCase: 'Start another case',
    back: 'Back',
    continue: 'Continue',
    skip: 'Skip',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    remove: 'Remove',
    verify: 'Verify',
    export: 'Export & Share',
    print: 'Print / Save PDF',
    download: 'Download',
    copy: 'Copy',
    copied: 'Copied',
    copiedNotice: 'Case summary copied to clipboard',
    close: 'Close',
    all: 'All',
    status: 'Status',
    jurisdiction: 'Jurisdiction',
    authority: 'Authority',
    requiredDocuments: 'Required Documents',
    officialSource: 'Official Procedural Source',
    lastChecked: 'Last Checked',
    uncertainties: 'Uncertainties & Requirements for Verification',
    viewSource: 'View Evidence Source',
    lowBandwidth: 'Low Bandwidth',
    lowBandwidthOn: 'Low Bandwidth: ON',
    myCases: 'My Cases (Local)',
    myCasesTitle: 'My Saved Cases (Local Storage)',
    myCasesDesc: 'Stored privately in this browser using IndexedDB. Never sent to cloud accounts.',
    noSavedCases: 'No local cases saved yet.',
    saveDraft: 'Save draft',
    savedLocally: 'Saved locally in browser',
    saving: 'Saving...',
    demoNotice: 'Sample case — fictional data for demonstration.',
    fictionalDemo: 'Fictional Demo',
    switchToRealCase: 'Start a real case (blank)',
    tryDemoPill: 'Try with realistic demo: Adebayo Olatunji vs. IBEDC Electricity Dispute',

    sourceBacked: 'Source-backed',
    userReported: 'Citizen-stated',
    inferred: 'CaseCarry inferred',
    needsReview: 'Needs review',
    conflict: 'Sources conflict',
    privateDoc: 'Kept private on device',

    stepContext: 'Context',
    stepEvidence: 'Evidence',
    stepReconstruction: 'Reconstruction',
    stepVerification: 'Verification',
    stepUnresolved: 'Unresolved Issue',
    stepPathways: 'Pathways',
    stepPrivacy: 'Privacy',
    stepBundle: 'Bundle',

    entryTitle: 'What happened after you first reported it?',
    entrySubtitle: 'CaseCarry starts from the unresolved outcome of your previous attempt.',
    outcomeQuestion: '1. What was the outcome of your first report or complaint?',
    outcomeNoResponse: 'No response at all',
    outcomeNoResponseDesc: 'Submitted a formal report or complaint, but the statutory window passed with zero reply.',
    outcomeDidntResolve: 'Response didn’t resolve the issue',
    outcomeDidntResolveDesc: 'Received a reply, denial, or closure letter that failed to address the core problem.',
    outcomeClosedWithoutReason: 'Case closed without explanation',
    outcomeClosedWithoutReasonDesc: 'Ticket was marked resolved or closed, but the dispute remains active in reality.',
    outcomeReferredLoop: 'Referred elsewhere / in a loop',
    outcomeReferredLoopDesc: 'Passed between departments or told to start over at another desk.',
    outcomeOther: 'Other unresolved outcome',
    outcomeOtherDesc: 'Experienced a different administrative breakdown or delayed resolution.',
    providerQuestion: '2. Who was this reported to?',
    providerPlaceholder: 'e.g. IBEDC, Access Bank, National Hospital, Land Registry',
    refNumberQuestion: '3. Account or tracking reference (if any)',
    refNumberPlaceholder: 'e.g. CCU-12345, Account 0456-789123',
    summaryQuestion: '4. Briefly describe the unresolved dispute',
    summaryPlaceholder: 'Summarize what was reported, what happened, and what remains unresolved...',

    evidenceTitle: 'Add your evidence & statements',
    evidenceSubtitle: 'Add receipts, letters, emails, bills, screenshots, or chat transcripts.',
    dropzoneTitle: 'Drop evidence documents here',
    dropzoneSubtitle: 'or click to browse from device',
    browseFiles: 'Browse Files',
    fileSupportText: 'Supports PDF, PNG, JPG, TXT, CSV, Email transcripts up to 25MB',
    collectedEvidence: 'Collected Evidence & Records',
    noEvidenceYet: 'No evidence uploaded yet. Add documents above or write a statement.',
    manualTextEntry: 'Or enter text statement manually',
    addManualSnippet: 'Add Written Statement',

    reconstructTitle: 'Reconstruct Case Chronology',
    reconstructSubtitle: 'Events are ordered chronologically and strictly linked to evidence.',
    reconstructProcessing: 'Reconstructing verifiable timeline from your evidence...',
    timelineTitle: 'Case Chronology & Timeline',
    addEventManually: 'Add Event Manually',
    contradictionsDetected: 'Contradictions Detected in Institutional Records',
    missingInfoNoted: 'Missing Records & Noted Uncertainties',

    verifyTitle: 'Verify Facts & Provenance',
    verifySubtitle: 'Review each fact to ensure every statement is accurate and backed by evidence.',
    verifyInstructions: 'Check every chronological event. Confirm dates, institutions, and quotes.',
    verifyAllSourceBacked: 'Mark all source-backed events as verified',
    allVerifiedConfirmation: 'I have verified that this timeline accurately reflects my evidence records.',
    provenanceExplainer: 'Provenance standard: Evidence is the authority. AI never invents facts.',

    unresolvedTitle: 'What Remains Unresolved?',
    unresolvedSubtitle: 'Define exactly what remains broken, what was resolved, and what remedy is needed.',
    unresolvedProblemLabel: '1. What is the core unresolved problem?',
    unresolvedProblemPlaceholder: 'State clearly what remains broken or disputed right now...',
    whatWasRequestedLabel: '2. What did you originally request?',
    whatWasRequestedPlaceholder: 'e.g. Account reconciliation, refund of uncredited payment, meter inspection...',
    whatHappenedLabel: '3. What happened after you requested it?',
    whatHappenedPlaceholder: 'e.g. Provider issued closure letter claiming resolution without crediting payment...',
    whatWasResolvedLabel: '4. What part (if any) was resolved?',
    whatWasNotResolvedLabel: '5. What part remains unresolved?',
    resolutionVisionLabel: '6. What specific remedy or outcome are you seeking now?',
    alreadyTriedLabel: '7. What steps have you already tried?',

    pathwayTitle: 'Explore Next Pathways',
    pathwaySubtitle: 'Evidence-aware potential escalations, regulators, and dispute authorities.',
    pathwayStandardAttribution: 'CaseCarry identified these as potentially relevant pathways based on the case information available at the time of review. CaseCarry did not determine legal rights conclusively or guarantee eligibility.',
    inspectFactsBtn: 'Inspect Case Facts Used for Discovery',
    addCustomPathwayBtn: 'Add Custom Pathway',
    tabAllPathways: 'All Pathways',
    tabPotential: 'Potential Next Pathways',
    tabAlreadyTried: 'Already Tried',
    tabExcluded: 'Excluded',
    markAsPotential: 'Mark as Potential Next Pathway',
    markAsAlreadyTried: 'Mark as Already Tried',
    markAsExcluded: 'Mark as Excluded',
    includeInBundle: 'Include in Carry-Forward Bundle',
    whyRelevantLabel: 'Why This May Be Relevant:',

    privacyTitle: 'Review What You’re Sharing',
    privacySubtitle: 'You control what is included in the transmission bundle.',
    privacyExplanation: 'Choose which documents will accompany your carry-forward record. Private files stay on your device.',
    includeInTransmission: 'Include in transmission bundle',
    retainPrivately: 'Retain privately on device only',
    approveAndCreateBundle: 'Approve & Generate Carry-Forward Bundle',

    bundleTitle: 'Carry-Forward Case Record',
    bundleSubtitle: 'Complete, structured, evidence-backed dossier ready to carry forward.',
    sec1Summary: '1. Executive Case Summary',
    sec2Problem: '2. Core Unresolved Problem',
    sec3ResolvedVsUnresolved: '3. What Was Resolved vs. Unresolved',
    sec4DesiredResolution: '4. Desired Outcome & Requested Remedy',
    sec5PriorSteps: '5. Prior Steps & What Was Already Tried',
    sec6Chronology: '6. Verified Case Chronology & Evidence Index',
    sec7Contradictions: '7. Surfaced Contradictions & Missing Records',
    sec8Pathways: '8. Potential Next Pathways',
    neutralityAttestation: 'This record was prepared and verified directly by the citizen using CaseCarry. All supporting evidence is indexed for verification.',

    exportTitle: 'Export & Share Case Record',
    exportSubtitle: 'Download, print, or copy your complete case dossier.',
    downloadText: 'Download Plain Text (.txt)',
    downloadJson: 'Download Case Bundle (.json)',
    printOrPdf: 'Print / Save as PDF',
    printPaperCopy: 'Print Paper Copy',
    exportBundle: 'Export & Save Bundle',
    copySummary: 'Copy Formatted Summary',
    optional: 'Optional',
    skipStep: 'Skip this step',
  },

  yo: {
    appName: 'CaseCarry',
    tagline: 'Mase bẹrẹ itan rẹ lati ibẹrẹ mọ.',
    citizenCaseContinuity: 'Iṣakoso ara ilu fun itẹsiwaju ọrọ ẹsun',
    carryCaseForward: 'Gbe ọrọ mi lọ siwaju',
    exploreDemo: 'Wo apẹẹrẹ afihan ọrọ',
    howItWorks: 'Bi o ṣe n ṣiṣẹ',
    trustStatement: 'Iwọ lo ni iṣakoso. CaseCarry n ṣeto alaye rẹ; iwọ ni yoo yẹwo ati fọwọsi ohun ti o wọle.',
    startCaseNow: 'Bẹrẹ ọrọ rẹ bayi',
    startAnotherCase: 'Bẹrẹ ọrọ titun miiran',
    back: 'Pada sẹhin',
    continue: 'Tẹsiwaju',
    skip: 'Foju fo',
    cancel: 'Fagilee',
    save: 'Fi pamọ',
    edit: 'Ṣatunkọ',
    delete: 'Paarẹ',
    remove: 'Yọ kuro',
    verify: 'Daju rẹ',
    export: 'Gba jade & Pin',
    print: 'Tẹ sita / Fi pamọ bi PDF',
    download: 'Gba wọle',
    copy: 'Daakọ',
    copied: 'Ti daakọ',
    copiedNotice: 'A ti daakọ akopọ ọrọ rẹ',
    close: 'Paade',
    all: 'Gbogbo rẹ',
    status: 'Ipo',
    jurisdiction: 'Agbegbe Ofin',
    authority: 'Aṣẹ / Ile-iṣẹ',
    requiredDocuments: 'Awọn Iwe Ẹri Ti A Nilo',
    officialSource: 'Orisun Ilana Ijọba',
    lastChecked: 'Igba Ti A Yẹwo Gbẹhin',
    uncertainties: 'Awọn Ohun Ti Ko Tii Daju & Atunyẹwo',
    viewSource: 'Wo Orisun Ẹri',
    lowBandwidth: 'Ipo Data Kekere',
    lowBandwidthOn: 'Ipo Data Kekere: ON',
    myCases: 'Awọn Ọrọ Mi (Lori Ẹrọ)',
    myCasesTitle: 'Awọn Ọrọ Mi Ti Mo Fi Pamọ (Lori Ẹrọ)',
    myCasesDesc: 'O wa ni ipamọ lori aṣawakiri ẹrọ rẹ nipasẹ IndexedDB. A ko fi ranṣẹ si awọsanma.',
    noSavedCases: 'Ko tii si ọrọ kankan ti a fi pamọ sibẹ.',
    saveDraft: 'Fi iṣẹ pamọ',
    savedLocally: 'O wa ni ipamọ lori ẹrọ rẹ',
    saving: 'N fi pamọ...',
    demoNotice: 'Ọrọ apẹẹrẹ — alaye atọwọda fun afihan.',
    fictionalDemo: 'Apẹẹrẹ Afihan',
    switchToRealCase: 'Bẹrẹ ọrọ gidi titun (ofo)',
    tryDemoPill: 'Dán wo pẹlu apẹẹrẹ gidi: Adebayo Olatunji vs IBEDC Ẹsun Ina Mọnamọna',

    sourceBacked: 'Ẹri fọwọsi i',
    userReported: 'Ara ilu lo sọ eyi',
    inferred: 'CaseCarry ro pe',
    needsReview: 'Nilo atunyẹwo',
    conflict: 'Awọn orisun tako ara wọn',
    privateDoc: 'Ti wa ni ipamọ lori ẹrọ nikan',

    stepContext: 'Ipilẹ',
    stepEvidence: 'Awọn Ẹri',
    stepReconstruction: 'Atunkọ Asiko',
    stepVerification: 'Ijẹrisi Otitọ',
    stepUnresolved: 'Ohun Ti Ko Yanju',
    stepPathways: 'Awọn Ọna',
    stepPrivacy: 'Aṣiri',
    stepBundle: 'Akọsilẹ Pari',

    entryTitle: 'Kini o ṣẹlẹ lẹhin igba akọkọ ti o fi ẹsun kan?',
    entrySubtitle: 'CaseCarry bẹrẹ lati abajade ti ko yanju ninu igbiyanju rẹ ti tẹlẹ.',
    outcomeQuestion: '1. Kini abajade ẹsun tabi iroyin akọkọ rẹ?',
    outcomeNoResponse: 'Ko si esi kankan rara',
    outcomeNoResponseDesc: 'O fi ẹsun ofin silẹ, ṣugbọn asiko ti a gbe kalẹ kọja laisi idahun kankan.',
    outcomeDidntResolve: 'Idahun ti a fun ọ ko yan iṣoro naa',
    outcomeDidntResolveDesc: 'O gba esi tabi lẹta ti ko yan koko ọrọ tabi ti o kọ lati gbọ.',
    outcomeClosedWithoutReason: 'A ti tii ọrọ naa laisi alaye',
    outcomeClosedWithoutReasonDesc: 'Wọn sọ pe a ti yanju ọrọ naa, ṣugbọn iṣoro naa ṣi wa ni gbangba.',
    outcomeReferredLoop: 'A dari rẹ si ibomiiran / a n yi ọ kaakiri',
    outcomeReferredLoopDesc: 'Wọn n fi ọ ranṣẹ lati ẹka kan si ekeji laisi ipinnu.',
    outcomeOther: 'Abajade miiran ti ko yanju',
    outcomeOtherDesc: 'Idilọwọ tabi idaduro miiran waye ninu iṣakoso.',
    providerQuestion: '2. Tani a fi ẹsun naa kan?',
    providerPlaceholder: 'apẹẹrẹ: IBEDC, Access Bank, Ile-iwosan, Ile-iṣẹ Ilẹ',
    refNumberQuestion: '3. Nọmba akọọlẹ tabi nọmba ẹsun (ti o ba wa)',
    refNumberPlaceholder: 'apẹẹrẹ: CCU-12345, Account 0456-789123',
    summaryQuestion: '4. Ṣapejuwe ọrọ ti ko yanju ni kukuru',
    summaryPlaceholder: 'Ṣalaye ohun ti o sọ, ohun to ṣẹlẹ, ati ohun ti ko tii yanju...',

    evidenceTitle: 'Fi awọn ẹri ati alaye rẹ kun',
    evidenceSubtitle: 'Fi iwe sisanwo, lẹta, imeeli, risiti, tabi aworan ibaraẹnisọrọ kun.',
    dropzoneTitle: 'Ju awọn iwe ẹri rẹ si ibi',
    dropzoneSubtitle: 'tabi tẹ lati yan lati inu ẹrọ rẹ',
    browseFiles: 'Wa Awọn Faili',
    fileSupportText: 'Gba PDF, PNG, JPG, TXT, CSV, Imeeli titi de 25MB',
    collectedEvidence: 'Awọn Ẹri & Akọsilẹ Ti A Kójọ',
    noEvidenceYet: 'A ko tii fi ẹri kankan kun. Fi iwe kun loke tabi kọ alaye.',
    manualTextEntry: 'Tabi kọ alaye ẹnu rẹ silẹ',
    addManualSnippet: 'Fi Alaye Kíkọ Kun',

    reconstructTitle: 'Ṣeto Asiko ati Itan Ohun To Ṣẹlẹ',
    reconstructSubtitle: 'A tò gbogbo iṣẹlẹ lẹsẹsẹ pẹlu asopọ taara si ẹri.',
    reconstructProcessing: 'N ṣeto itan iṣẹlẹ ti o daju lati inu awọn ẹri rẹ...',
    timelineTitle: 'Itòlẹsẹsẹ Iṣẹlẹ Ọrọ Ẹsun',
    addEventManually: 'Fi Iṣẹlẹ Kun Pẹlu Ọwọ',
    contradictionsDetected: 'Awọn Idakeji Ti A Rí Ninu Akọsilẹ Ile-iṣẹ',
    missingInfoNoted: 'Awọn Akọsilẹ Ti O Sọnu & Awọn Ohun Ti A Ṣiyemeji',

    verifyTitle: 'Daju Awọn Otitọ ati Orisun',
    verifySubtitle: 'Yẹwo gbogbo alaye lati rii daju pe o tọ ati pe ẹri ṣe atilẹyin rẹ.',
    verifyInstructions: 'Yẹwo iṣẹlẹ kọọkan. Rii daju pe ọjọ, orukọ, ati ọrọ ti a fa jade jẹ otitọ.',
    verifyAllSourceBacked: 'Ṣe afihan gbogbo awọn iṣẹlẹ ti ẹri fọwọsi bi otitọ',
    allVerifiedConfirmation: 'Mo ti yẹwo ati fọwọsi pe itan asiko yii ṣe afihan awọn ẹri mi ni pipe.',
    provenanceExplainer: 'Ilana idaniloju: Ẹri gidi ni aṣẹ. CaseCarry ko ni ṣẹda alaye ti ko si.',

    unresolvedTitle: 'Kini Ohun Ti Ko Tii Yanju?',
    unresolvedSubtitle: 'Ṣalaye ohun ti o ku, ohun ti a yanju, ati iranlọwọ ti o n wa.',
    unresolvedProblemLabel: '1. Kini koko iṣoro ti ko tii yanju?',
    unresolvedProblemPlaceholder: 'Sọ ohun ti o ku ti ko tii ṣe atunṣe rẹ...',
    whatWasRequestedLabel: '2. Kini o beere fun ni ibẹrẹ?',
    whatWasRequestedPlaceholder: 'apẹẹrẹ: Atunṣe owo ti mo san, atunyẹwo mita ina...',
    whatHappenedLabel: '3. Kini o ṣẹlẹ lẹhin ti o beere?',
    whatHappenedPlaceholder: 'apẹẹrẹ: Wọn fi lẹta ranṣẹ pe a ti yanju rẹ ṣugbọn wọn kò dinku owo...',
    whatWasResolvedLabel: '4. Apa wo ni a yanju (ti o ba wa)?',
    whatWasNotResolvedLabel: '5. Apa wo ni ko tii yanju?',
    resolutionVisionLabel: '6. Kini ipinnu pato ti o n wa bayi?',
    alreadyTriedLabel: '7. Awọn igbesẹ wo ni o ti gbe tẹlẹ?',

    pathwayTitle: 'Awọn Ọna Ti O Le Tẹle',
    pathwaySubtitle: 'Awọn aṣẹ ofin, ile-iṣẹ ijọba, ati awọn igbimọ idajọ ti o le gbọ ẹsun rẹ.',
    pathwayStandardAttribution: 'CaseCarry ṣe afihan awọn ọna wọnyi da lori alaye ti o wa ni akoko ayẹwo. CaseCarry ko pinnu ẹtọ labẹ ofin tabi ṣe oniduro.',
    inspectFactsBtn: 'Wo Awọn Otitọ Ọrọ Ti A Lo Fun Awari',
    addCustomPathwayBtn: 'Fi Ọna Ti Rẹ Kun',
    tabAllPathways: 'Gbogbo Ọna',
    tabPotential: 'Awọn Ọna Ti O Le Tẹle',
    tabAlreadyTried: 'Ti Mo Ti Gbiyanju',
    tabExcluded: 'Ti A Yọ Kuro',
    markAsPotential: 'Fi han bi Ọna Ti O Le Tẹle',
    markAsAlreadyTried: 'Fi han bi Ohun Ti Mo Ti Gbiyanju',
    markAsExcluded: 'Fi han bi Ohun Ti A Yọ Kuro',
    includeInBundle: 'Fi sinu Akọsilẹ Ti A O Gbe Lọ Siwaju',
    whyRelevantLabel: 'Idi Ti O Fi Ṣe Pataki:',

    privacyTitle: 'Yẹwo Alaye Ti O N Pin',
    privacySubtitle: 'Iwọ lo n dari iwe ati alaye ti o n ranṣẹ jade.',
    privacyExplanation: 'Yan awọn iwe ti yoo ba akọsilẹ rẹ lọ. Awọn iwe aṣiri yoo duro lori ẹrọ rẹ nikan.',
    includeInTransmission: 'Fi sinu akọsilẹ ti a n pin',
    retainPrivately: 'Duro lori ẹrọ nikan (aṣiri)',
    approveAndCreateBundle: 'Fọwọsi & Ṣẹda Akọsilẹ Lati Gbe Lọ Siwaju',

    bundleTitle: 'Akọsilẹ Ọrọ Lati Gbe Lọ Siwaju',
    bundleSubtitle: 'Iwe akọsilẹ pipe ti ẹri fọwọsi ti o ṣetan lati fi ranṣẹ siwaju.',
    sec1Summary: '1. Akopọ Koko Ọrọ Ẹsun',
    sec2Problem: '2. Koko Iṣoro Ti Ko Tii Yanju',
    sec3ResolvedVsUnresolved: '3. Ohun Ti A Yanju vs Ohun Ti Ko Yanju',
    sec4DesiredResolution: '4. Ipinnu Ti A N Fẹ & Iranlọwọ Ti A Beere',
    sec5PriorSteps: '5. Awọn Igbesẹ Ti A Ti Gbe Tẹlẹ',
    sec6Chronology: '6. Itòlẹsẹsẹ Iṣẹlẹ Ti A Fọwọsi & Atọka Ẹri',
    sec7Contradictions: '7. Awọn Idakeji Ti A Rí & Awọn Akọsilẹ Ti O Ku',
    sec8Pathways: '8. Awọn Ọna Ti O Le Tẹle Ti Ara Ilu Yan',
    neutralityAttestation: 'Iwe akọsilẹ yii ni a pese ati fọwọsi taara nipasẹ ara ilu lilo CaseCarry. Gbogbo ẹri atilẹyin ni a ṣe atọka rẹ fun ijẹrisi.',

    exportTitle: 'Gba Jade & Pin Akọsilẹ Rẹ',
    exportSubtitle: 'Gba wọle, tẹ sita, tabi daakọ gbogbo akọsilẹ ọrọ rẹ.',
    downloadText: 'Gba Faili Ọrọ (.txt)',
    downloadJson: 'Gba Akọsilẹ (.json)',
    printOrPdf: 'Tẹ Sita / Fi Pamọ bi PDF',
    printPaperCopy: 'Tẹ Iwe Sita (Print)',
    exportBundle: 'Gba Jade & Fi Pamọ',
    copySummary: 'Daakọ Akopọ Ọrọ',
    optional: 'Aṣayan',
    skipStep: 'Foju fo igbesẹ yii',
  },

  ha: {
    appName: 'CaseCarry',
    tagline: 'Kada ka sake ba da labarinka daga farko.',
    citizenCaseContinuity: 'Ikon ɗan ƙasa don ci gaba da shari’a',
    carryCaseForward: 'Ci gaba da shari’ata',
    exploreDemo: 'Duba misalin gwaji',
    howItWorks: 'Yadda yake aiki',
    trustStatement: 'Kana da cikakken iko. CaseCarry na tsara bayananka; kana bita da amincewa da abin da za a saka.',
    startCaseNow: 'Fara shari’a yanzu',
    startAnotherCase: 'Fara wata sabuwar shari’a',
    back: 'Koma baya',
    continue: 'Ci gaba',
    skip: 'Tsallake',
    cancel: 'Soke',
    save: 'Ajiye',
    edit: 'Gyara',
    delete: 'Goge',
    remove: 'Cire',
    verify: 'Tabbatar',
    export: 'Fitar & Raba',
    print: 'Buga / Ajiye azaman PDF',
    download: 'Sauke',
    copy: 'Kwafa',
    copied: 'An kwafa',
    copiedNotice: 'An kwafi taƙaitaccen bayanin shari’ar',
    close: 'Rufe',
    all: 'Duka',
    status: 'Matsayi',
    jurisdiction: 'Hukumar Shari’a',
    authority: 'Hukuma / Ofishi',
    requiredDocuments: 'Takardun Shaida Da Ake Buƙata',
    officialSource: 'Tushen Dokar Hukuma',
    lastChecked: 'Binciken Ƙarshe',
    uncertainties: 'Abubuwan Da Ba A Tabbatar Ba & Bita',
    viewSource: 'Duba Tushen Shaida',
    lowBandwidth: 'Yanayin Ƙarancin Bayanai',
    lowBandwidthOn: 'Yanayin Ƙarancin Bayanai: ON',
    myCases: 'Shari’o’ina (A Na’ura)',
    myCasesTitle: 'Shari’o’in Da Na Ajiye (A Cikin Na’ura)',
    myCasesDesc: 'An ajiye su a cikin wannan burauzar ta amfani da IndexedDB. Ba a tura su zuwa gajimare ba.',
    noSavedCases: 'Babu wata shari’a da aka ajiye a nan tukuna.',
    saveDraft: 'Ajiye daftarin aiki',
    savedLocally: 'An ajiye a cikin na’urarka',
    saving: 'Ana ajiye...',
    demoNotice: 'Ƙirar misali — bayanan gwaji don nunawa kawai.',
    fictionalDemo: 'Misalin Gwaji',
    switchToRealCase: 'Fara sabuwar shari’a ta gaske',
    tryDemoPill: 'Gwada tare da misali na gaske: Adebayo Olatunji vs IBEDC Rikicin Wutar Lantarki',

    sourceBacked: 'Shaida ta tabbatar',
    userReported: 'Ɗan ƙasa ya bayyana',
    inferred: 'CaseCarry ya gano',
    needsReview: 'Yana buƙatar bita',
    conflict: 'Shaidu sun ci karo da juna',
    privateDoc: 'An ajiye a na’ura kawai',

    stepContext: 'Fage',
    stepEvidence: 'Shaidu',
    stepReconstruction: 'Sake Tsara Lokaci',
    stepVerification: 'Tabbatar Da Gaskiya',
    stepUnresolved: 'Abin Da Ba A Warware Ba',
    stepPathways: 'Hanyoyi',
    stepPrivacy: 'Sirri',
    stepBundle: 'Fayil Ɗin Ƙarshe',

    entryTitle: 'Me ya faru bayan ka fara kai ƙara?',
    entrySubtitle: 'CaseCarry na farawa ne daga sakamakon da ba a warware ba na ƙoƙarinka na baya.',
    outcomeQuestion: '1. Menene sakamakon ƙararka ta farko?',
    outcomeNoResponse: 'Babu wani martani ko kaɗan',
    outcomeNoResponseDesc: 'An gabatar da ƙara a hukumance, amma lokacin doka ya wuce ba tare da an bayar da amsa ba.',
    outcomeDidntResolve: 'Martanin da aka bayar bai warware matsalar ba',
    outcomeDidntResolveDesc: 'An karɓi amsa ko wasiƙar da ba ta magance ainihin matsalar ba.',
    outcomeClosedWithoutReason: 'An rufe ƙara ba tare da bayani ba',
    outcomeClosedWithoutReasonDesc: 'An sanya alamar an warware ko an rufe ƙarar, amma a zahiri matsalar na nan.',
    outcomeReferredLoop: 'An tura wani wuri / ana kewayawa',
    outcomeReferredLoopDesc: 'Ana tura ka daga wannan sashe zuwa wancan ba tare da an yanke shawara ba.',
    outcomeOther: 'Wani sakamako daban da ba a warware ba',
    outcomeOtherDesc: 'Wata matsalar gudanarwa daban ta faru.',
    providerQuestion: '2. Ga wa aka kai wannan ƙarar?',
    providerPlaceholder: 'misali: IBEDC, Access Bank, Asibitin Kasa, Ofishin Filaye',
    refNumberQuestion: '3. Lambar asusu ko lambar bin diddigi (idan akwai)',
    refNumberPlaceholder: 'misali: CCU-12345, Account 0456-789123',
    summaryQuestion: '4. Taƙaita ainihin abin da ba a warware ba',
    summaryPlaceholder: 'Bayyana abin da ka kai ƙara akai, abin da ya faru, da abin da ya rage...',

    evidenceTitle: 'Ƙara shaidu da bayananka',
    evidenceSubtitle: 'Sanya rasit, wasiƙu, imel, takardun kuɗi, hotuna, ko tattaunawa.',
    dropzoneTitle: 'Sanya takardun shaida a nan',
    dropzoneSubtitle: 'ko danna don zaɓa daga na’urarka',
    browseFiles: 'Zaɓi Fayiloli',
    fileSupportText: 'Yana goyon bayan PDF, PNG, JPG, TXT, CSV, Imel har zuwa 25MB',
    collectedEvidence: 'Shaidun Da Aka Tattara',
    noEvidenceYet: 'Babu shaidar da aka saka tukuna. Ƙara takarda a sama ko rubuta bayani.',
    manualTextEntry: 'Ko rubuta bayanin baki da hannu',
    addManualSnippet: 'Ƙara Rubutaccen Bayani',

    reconstructTitle: 'Sake Gina Tsarin Lokaci Na Shari’a',
    reconstructSubtitle: 'An tsara abubuwan da suka faru bisa tsarin lokaci kuma an haɗa su da shaida.',
    reconstructProcessing: 'Ana tsara jerin abubuwan da suka faru daga shaidunka...',
    timelineTitle: 'Jerin Abubuwan Da Suka Faru',
    addEventManually: 'Ƙara Abu Da Hannu',
    contradictionsDetected: 'Sabani Da Aka Gano A Cikin Bayanan Hukuma',
    missingInfoNoted: 'Takardun Da Suka Bace & Abubuwan Da Ba A Tabbatar Ba',

    verifyTitle: 'Tabbatar Da Gaskiyar Lamari Da Tushe',
    verifySubtitle: 'Duba kowane bayani don tabbatar da cewa gaskiya ne kuma yana da shaida.',
    verifyInstructions: 'Duba kowane abu da ya faru. Tabbatar da kwanakin wata, sunaye, da maganganu.',
    verifyAllSourceBacked: 'Tabbatar da duk abubuwan da shaida ta goyi baya',
    allVerifiedConfirmation: 'Na tabbatar da cewa wannan tsarin lokaci yana nuna ainihin shaiduna.',
    provenanceExplainer: 'Ma’aunin shaida: Takardar shaida ita ce hukuma. CaseCarry ba ya ƙirƙirar ƙarya.',

    unresolvedTitle: 'Menene Har Yanzu Ba A Warware Ba?',
    unresolvedSubtitle: 'Bayyana ainihin abin da ya rage, abin da aka warware, da kuma gyaran da kake buƙata.',
    unresolvedProblemLabel: '1. Menene babban abin da ba a warware ba?',
    unresolvedProblemPlaceholder: 'Bayyana a sarari abin da ya rage ba a gyara ba a yanzu...',
    whatWasRequestedLabel: '2. Menene ka nema a farko?',
    whatWasRequestedPlaceholder: 'misali: Daidaita asusu, maido da kuɗin da aka biya, duba mita...',
    whatHappenedLabel: '3. Me ya faru bayan ka nema?',
    whatHappenedPlaceholder: 'misali: Hukuma ta aiko da wasiƙar an gama amma ba a saka kuɗin ba...',
    whatWasResolvedLabel: '4. Wane ɓangare ne aka warware (idan akwai)?',
    whatWasNotResolvedLabel: '5. Wane ɓangare ne ba a warware ba?',
    resolutionVisionLabel: '6. Wane takamaiman sakamako kake nema a yanzu?',
    alreadyTriedLabel: '7. Waɗanne matakai ka riga ka ɗauka?',

    pathwayTitle: 'Bincika Hanyoyin Da Suka Dace Na Gaba',
    pathwaySubtitle: 'Hukumomin daidaita doka, masu kare hakki, da ofisoshin shari’a.',
    pathwayStandardAttribution: 'CaseCarry ya gano waɗannan hanyoyi ne bisa bayanan da aka samu a lokacin bita. CaseCarry ba ya yanke hukunci kan haƙƙin doka ko bayar da tabbaci.',
    inspectFactsBtn: 'Duba Bayanan Shari’ar Da Aka Yi Amfani Da Su',
    addCustomPathwayBtn: 'Ƙara Hanyarka Ta Musamman',
    tabAllPathways: 'Duk Hanyoyi',
    tabPotential: 'Hanyoyin Da Suka Dace Na Gaba',
    tabAlreadyTried: 'Wanda Na Riga Na Gwada',
    tabExcluded: 'Wanda Aka Cire',
    markAsPotential: 'Sanya a matsayin Hanyar Gaba',
    markAsAlreadyTried: 'Sanya a matsayin Wanda Na Riga Na Gwada',
    markAsExcluded: 'Sanya a matsayin Wanda Aka Cire',
    includeInBundle: 'Saka a cikin Fayil ɗin da za a ɗauka gaba',
    whyRelevantLabel: 'Dalilin Da Ya Sa Wannan Ya Dace:',

    privacyTitle: 'Yi Bita Kan Abin Da Kake Rabawa',
    privacySubtitle: 'Kana da cikakken ikon sarrafa takardun da za a tura.',
    privacyExplanation: 'Zaɓi takardun da za su tafi tare da fayil ɗinka. Takardun sirri za su zauna a na’urarka kawai.',
    includeInTransmission: 'Saka a cikin fayil ɗin da za a aika',
    retainPrivately: 'Ajiye a na’ura kawai (sirri)',
    approveAndCreateBundle: 'Amince & Ƙirƙiri Fayil Ɗin Ci Gaba',

    bundleTitle: 'Fayil Ɗin Shari’a Don Ci Gaba',
    bundleSubtitle: 'Cikakken tsarin bayanan shari’a mai goyon bayan shaida a shirye don ci gaba.',
    sec1Summary: '1. Taƙaitaccen Bayanin Shari’a',
    sec2Problem: '2. Ainihin Matsalar Da Ba A Warware Ba',
    sec3ResolvedVsUnresolved: '3. Abin Da Aka Warware vs Abin Da Ba A Warware Ba',
    sec4DesiredResolution: '4. Sakamakon Da Ake So & Gyaran Da Ake Nema',
    sec5PriorSteps: '5. Matakan Da Aka Ɗauka A Baya',
    sec6Chronology: '6. Tabbattaccen Tsarin Lokaci & Jerin Shaidu',
    sec7Contradictions: '7. Sabani Da Aka Gano & Takardun Da Suka Rage',
    sec8Pathways: '8. Hanyoyin Da Ɗan Ƙasa Ya Zaɓa',
    neutralityAttestation: 'Ɗan ƙasa ne ya shirya kuma ya tabbatar da wannan bayanin ta amfani da CaseCarry. An tsara duk shaidu don sauƙaƙa bincike.',

    exportTitle: 'Fitar & Raba Bayanan Shari’a',
    exportSubtitle: 'Sauke, buga, ko kwafi cikakken fayil ɗin shari’arka.',
    downloadText: 'Sauke Rubutu (.txt)',
    downloadJson: 'Sauke Fayil (.json)',
    printOrPdf: 'Buga / Ajiye azaman PDF',
    printPaperCopy: 'Buga Kwafin Takarda (Print)',
    exportBundle: 'Fitar & Ajiye Fayil',
    copySummary: 'Kwafi Taƙaitaccen Bayani',
    optional: 'Zabi ne',
    skipStep: 'Tsallake wannan matakin',
  },

  ig: {
    appName: 'CaseCarry',
    tagline: 'Akọkwala akụkọ gị ọzọ site na mmalite.',
    citizenCaseContinuity: 'Nchịkwa nwa amaala maka ịga n’ihu nke okwu',
    carryCaseForward: 'Wepụta okwu m gaa n’ihu',
    exploreDemo: 'Nyochaa okwu ngosi',
    howItWorks: 'Otu o si arụ ọrụ',
    trustStatement: 'Ị nọ na njikwa. CaseCarry na-ahazi ozi gị; ị na-enyocha ma kwado ihe a ga-etinye.',
    startCaseNow: 'Malite okwu ugbua',
    startAnotherCase: 'Malite okwu ọzọ',
    back: 'Gaa azụ',
    continue: 'Gaa n’ihu',
    skip: 'Mafere',
    cancel: 'Kagbuo',
    save: 'Chekwaa',
    edit: 'Dezie',
    delete: 'Hichapụ',
    remove: 'Wepụ',
    verify: 'Nyochaa ma Kwenye',
    export: 'Mbupụ & Kekọrịta',
    print: 'Bipụta / Chekwaa dịka PDF',
    download: 'Budata',
    copy: 'Detuo',
    copied: 'Edeturu',
    copiedNotice: 'Edeturu nchịkọta okwu gị',
    close: 'Mechie',
    all: 'Ha niile',
    status: 'Ọnọdụ',
    jurisdiction: 'Ikike Iwu',
    authority: 'Ndị Ikike / Ụlọ Ọrụ',
    requiredDocuments: 'Akwụkwọ Akaebe Dị Mkpa',
    officialSource: 'Ebe Iwu Gọọmentị Si',
    lastChecked: 'Nlele Ikpeazụ',
    uncertainties: 'Ihe Ndị Na-edoghị Anya & Nyocha',
    viewSource: 'Lee Ebe Akaebe Si',
    lowBandwidth: 'Ụdị Data Dị Ala',
    lowBandwidthOn: 'Data Dị Ala: ON',
    myCases: 'Okwu Ndị nke M (Na Ngwaọrụ)',
    myCasesTitle: 'Okwu M Ndị Echekwara (Na Ngwaọrụ)',
    myCasesDesc: 'Echekwara ha na braụza a site na IndexedDB. E zighị ha na igwe ojii.',
    noSavedCases: 'Ọ nweghị okwu echekwara ebe a.',
    saveDraft: 'Chekwaa ihe emere',
    savedLocally: 'Echekwara na ngwaọrụ gị',
    saving: 'Na-echekwa...',
    demoNotice: 'Okwu ngosi — ozi e mere maka ngosipụta.',
    fictionalDemo: 'Ngosi Nlele',
    switchToRealCase: 'Malite ezigbo okwu ọhụrụ',
    tryDemoPill: 'Nwaa ya na ngosi dị adị: Adebayo Olatunji vs IBEDC Esemokwu Ọkụ',

    sourceBacked: 'Akaebe kwadoro ya',
    userReported: 'Nwa amaala kwuru nke a',
    inferred: 'CaseCarry chọpụtara',
    needsReview: 'Chọrọ nyocha',
    conflict: 'Akaebe na-emegide onwe ha',
    privateDoc: 'E debere na ngwaọrụ naanị',

    stepContext: 'Mmalite',
    stepEvidence: 'Akaebe',
    stepReconstruction: 'Nhazi Usoro Oge',
    stepVerification: 'Nkwenye Eziokwu',
    stepUnresolved: 'Ihe Na-edozighị',
    stepPathways: 'Ụzọ Ndị Dị',
    stepPrivacy: 'Nzuzo',
    stepBundle: 'Nchịkọta Ikpeazụ',

    entryTitle: 'Gịnị mere mgbe mbụ ị kpesara mkpesa gị?',
    entrySubtitle: 'CaseCarry na-amalite site na nsonaazụ na-edozighị nke mgbalị gị gara aga.',
    outcomeQuestion: '1. Gịnị bụ nsonaazụ mkpesa mbụ gị?',
    outcomeNoResponse: 'Ọ nweghị nzaghachi ma ọlị',
    outcomeNoResponseDesc: 'I tinyere mkpesa n’usoro, mana oge iwu gafere na-enweghị azịza.',
    outcomeDidntResolve: 'Nzaghachi ahụ edozighị nsogbu ahụ',
    outcomeDidntResolveDesc: 'I nwetara akwụkwọ ma ọ bụ azịza nke na-elebaraghị isi okwu ahụ anya.',
    outcomeClosedWithoutReason: 'E mechiri okwu ahụ na-enweghị nkọwa',
    outcomeClosedWithoutReasonDesc: 'E debere akara na edozila okwu ahụ, mana nsogbu ka dị.',
    outcomeReferredLoop: 'E zigara n’ebe ọzọ / na-agbagharị',
    outcomeReferredLoopDesc: 'A na-eziga gị site n’otu ngalaba gaa na nke ọzọ na-enweghị mkpebi.',
    outcomeOther: 'Nsonaazụ ọzọ na-edozighị',
    outcomeOtherDesc: 'Nsogbu nchịkwa ọzọ mere.',
    providerQuestion: '2. Ònye ka e kpesara okwu a?',
    providerPlaceholder: 'dịka: IBEDC, Access Bank, Ụlọ Ọgwụ, Ụlọ Ọrụ Ala',
    refNumberQuestion: '3. Nọmba akaụntụ ma ọ bụ nọmba mkpesa (ọ bụrụ na ọ dị)',
    refNumberPlaceholder: 'dịka: CCU-12345, Account 0456-789123',
    summaryQuestion: '4. Kọwaa nkenke ihe na-edozighị',
    summaryPlaceholder: 'Kọwaa ihe ị kpesara, ihe mere, na ihe fọdụrụ na-edozighị...',

    evidenceTitle: 'Tinye akaebe na nkwupụta gị',
    evidenceSubtitle: 'Tinye risiti, akwụkwọ ozi, ozi-e, akwụkwọ ụgwọ, foto, ma ọ bụ mkparịta ụka.',
    dropzoneTitle: 'Tụba akwụkwọ akaebe gị ebe a',
    dropzoneSubtitle: 'ma ọ bụ pịa ka ị họrọ na ngwaọrụ gị',
    browseFiles: 'Chọgharịa Faịlụ',
    fileSupportText: 'Na-akwado PDF, PNG, JPG, TXT, CSV, Ozi-e ruo 25MB',
    collectedEvidence: 'Akaebe Ndị Achịkọtara',
    noEvidenceYet: 'Ọ nweghị akaebe etinyere ugbu a. Tinye akwụkwọ n’elu ma ọ bụ dee okwu.',
    manualTextEntry: 'Ma ọ bụ jiri aka dee nkwupụta gị',
    addManualSnippet: 'Tinye Nkwupụta E Dere Ede',

    reconstructTitle: 'Hazi Usoro Oge nke Ihe Mere',
    reconstructSubtitle: 'A haziri ihe ndị mere n’usoro oge ma jikọta ha na akaebe.',
    reconstructProcessing: 'Na-ahazi usoro oge ziri ezi site na akaebe gị...',
    timelineTitle: 'Usoro Oge Okwu Ahụ',
    addEventManually: 'Jiri Aka Tinye Ihe Mere',
    contradictionsDetected: 'Ihe Ndị Na-emegiderịta Onwe Ha Na Ndekọ Ụlọ Ọrụ',
    missingInfoNoted: 'Ndekọ Ndị Na-efu & Ihe Ndị Na-edoghị Anya',

    verifyTitle: 'Nyochaa Eziokwu na Ebe Ha Si',
    verifySubtitle: 'Nyochaa ihe ọ bụla iji hụ na ọ bụ eziokwu ma nwee akaebe.',
    verifyInstructions: 'Lelee ihe ọ bụla mere. Kwenye ụbọchị, aha, na okwu ndị e hotara.',
    verifyAllSourceBacked: 'Kwenye ihe niile akaebe kwadoro',
    allVerifiedConfirmation: 'Ekwenyere m na usoro oge a na-egosi ezi akaebe m.',
    provenanceExplainer: 'Ụkpụrụ akaebe: Akwụkwọ akaebe bụ ikike. CaseCarry anaghị emepụta ụgha.',

    unresolvedTitle: 'Gịnị Ka Na-edozighị?',
    unresolvedSubtitle: 'Kọwaa kpọmkwem ihe fọdụrụ, ihe edoziri, na enyemaka ị chọrọ.',
    unresolvedProblemLabel: '1. Gịnị bụ isi nsogbu na-edozighị?',
    unresolvedProblemPlaceholder: 'Kwuo nke ọma ihe fọdụrụ na-edozighị ugbua...',
    whatWasRequestedLabel: '2. Gịnị ka ị rịọrọ na mbụ?',
    whatWasRequestedPlaceholder: 'dịka: Ndozi akaụntụ, nkwụghachi ụgwọ, nyocha mita...',
    whatHappenedLabel: '3. Gịnị mere mgbe ị rịọrọ ya?',
    whatHappenedPlaceholder: 'dịka: Ha zitere akwụkwọ ozi na edozila ya mana ha agbanweghị ụgwọ...',
    whatWasResolvedLabel: '4. Kedu akụkụ edoziri (ọ bụrụ na ọ dị)?',
    whatWasNotResolvedLabel: '5. Kedu akụkụ na-edozighị?',
    resolutionVisionLabel: '6. Kedu nsonaazụ pụrụ iche ị na-achọ ugbua?',
    alreadyTriedLabel: '7. Kedu ihe ndị ị gbalịrịla ime?',

    pathwayTitle: 'Nyochaa Ụzọ Ndị Dị Maka Ịga n’Ihu',
    pathwaySubtitle: 'Ndị nlekọta iwu, ndị nchekwa ndị ahịa, na ụlọ ikpe kwesịrị ekwesị.',
    pathwayStandardAttribution: 'CaseCarry chọpụtara ụzọ ndị a dabere na ozi dị n’oge nyocha. CaseCarry ekpeghị ikpe ikike iwu ma ọ bụ kwe nkwa nsonaazụ.',
    inspectFactsBtn: 'Lelee Eziokwu Okwu Ahụ E Jiri Chọpụta',
    addCustomPathwayBtn: 'Tinye Ụzọ nke Gị',
    tabAllPathways: 'Ụzọ Niile',
    tabPotential: 'Ụzọ Ndị Nwere Ike Ịdị',
    tabAlreadyTried: 'Ihe M Nwalere',
    tabExcluded: 'Ndị Ewepụrụ',
    markAsPotential: 'Kaa akara dịka Ụzọ Ịga n’Ihu',
    markAsAlreadyTried: 'Kaa akara dịka Ihe Agbalịrịla',
    markAsExcluded: 'Kaa akara dịka Nke Ewepụrụ',
    includeInBundle: 'Tinye na Nchịkọta A Ga-ebuga n’Ihu',
    whyRelevantLabel: 'Ihe Mere O Ji Dị Mkpa:',

    privacyTitle: 'Nyochaa Ihe Ị Na-ekekọrịta',
    privacySubtitle: 'Ị nwere ikike zuru oke n’elu akwụkwọ ndị ị ga-eziga.',
    privacyExplanation: 'Họrọ akwụkwọ ga-eso nchịkọta gị. Akwụkwọ nzuzo ga-anọ naanị na ngwaọrụ gị.',
    includeInTransmission: 'Tinye na nchịkọta a ga-eziga',
    retainPrivately: 'Debe na ngwaọrụ naanị (nzuzo)',
    approveAndCreateBundle: 'Kwado & Mepụta Nchịkọta Maka Ịga n’Ihu',

    bundleTitle: 'Nchịkọta Okwu Maka Ịga n’Ihu',
    bundleSubtitle: 'Nchịkọta zuru oke nke nwere akaebe dị njikere ibuga n’ihu.',
    sec1Summary: '1. Nchịkọta Isi Okwu',
    sec2Problem: '2. Isi Nsogbu Na-edozighị',
    sec3ResolvedVsUnresolved: '3. Ihe Edoziri vs Ihe Na-edozighị',
    sec4DesiredResolution: '4. Nsonaazụ A Na-achọ & Ndozi A Rịọrọ',
    sec5PriorSteps: '5. Ihe Ndị Agbalịrịla Na Mbụ',
    sec6Chronology: '6. Usoro Oge E Kwenyere & Ndepụta Akaebe',
    sec7Contradictions: '7. Esemokwu Ndị A Hụrụ & Ndekọ Ndị Na-efu',
    sec8Pathways: '8. Ụzọ Ndị Nwa Amaala Họọrọ',
    neutralityAttestation: 'Ọ bụ nwa amaala ji CaseCarry kwadebe ma kwado akwụkwọ a n’onwe ya. E depụtara akaebe niile maka nkwenye.',

    exportTitle: 'Mbupụ & Kekọrịta Ndekọ Okwu',
    exportSubtitle: 'Budata, bipụta, ma ọ bụ detuo nchịkọta okwu gị.',
    downloadText: 'Budata Ederede (.txt)',
    downloadJson: 'Budata Faịlụ (.json)',
    printOrPdf: 'Bipụta / Chekwaa dịka PDF',
    printPaperCopy: 'Bipụta Akwụkwọ (Print)',
    exportBundle: 'Bupụ & Chekwaa',
    copySummary: 'Detuo Nchịkọta Ederede',
    optional: 'Nhọrọ',
    skipStep: 'Mafere usoro a',
  },

  pcm: {
    appName: 'CaseCarry',
    tagline: 'No tell your story from start again.',
    citizenCaseContinuity: 'Citizen hand dey on top case matter',
    carryCaseForward: 'Carry my case go front',
    exploreDemo: 'Look demo example',
    howItWorks: 'How e dey work',
    trustStatement: 'Na you get full control. CaseCarry dey arrange your matter; na you go check and approve wetin enter am.',
    startCaseNow: 'Start case now',
    startAnotherCase: 'Start another case',
    back: 'Go back',
    continue: 'Continue',
    skip: 'Skip am',
    cancel: 'Cancel',
    save: 'Save am',
    edit: 'Edit am',
    delete: 'Delete am',
    remove: 'Comot am',
    verify: 'Check say na true',
    export: 'Export & Share',
    print: 'Print / Save as PDF',
    download: 'Download am',
    copy: 'Copy am',
    copied: 'Don copy',
    copiedNotice: 'Case summary don copy to clipboard',
    close: 'Close am',
    all: 'All of dem',
    status: 'Level / Status',
    jurisdiction: 'Area / Jurisdiction',
    authority: 'Office / Authority',
    requiredDocuments: 'Documents Wey You Need',
    officialSource: 'Govment Rule Source',
    lastChecked: 'Last Time We Check',
    uncertainties: 'Wetin Still Dey Doubt & Review',
    viewSource: 'Look Evidence Source',
    lowBandwidth: 'Low Data Mode',
    lowBandwidthOn: 'Low Data Mode: ON',
    myCases: 'My Cases (For Device)',
    myCasesTitle: 'Cases Wey I Save (For Device Storage)',
    myCasesDesc: 'E dey save private for this browser with IndexedDB. E no dey go cloud account.',
    noSavedCases: 'You never save any case here yet.',
    saveDraft: 'Save draft',
    savedLocally: 'E don save for your device',
    saving: 'De save am...',
    demoNotice: 'Sample case — fake data just to show how e work.',
    fictionalDemo: 'Demo Sample',
    switchToRealCase: 'Start fresh real case (blank)',
    tryDemoPill: 'Try realistic demo: Adebayo Olatunji vs IBEDC Light Dispute',

    sourceBacked: 'Evidence confirm am',
    userReported: 'You talk this one',
    inferred: 'CaseCarry guess am',
    needsReview: 'Need checking',
    conflict: 'Evidence dey fight each other',
    privateDoc: 'Keep private for device',

    stepContext: 'Background',
    stepEvidence: 'Evidence',
    stepReconstruction: 'Arrange Timeline',
    stepVerification: 'Check Truth',
    stepUnresolved: 'Wetin Remain',
    stepPathways: 'Next Roads',
    stepPrivacy: 'Privacy',
    stepBundle: 'Final Record',

    entryTitle: 'Wetin happen after you first report am?',
    entrySubtitle: 'CaseCarry dey start from wetin remain after your first trial.',
    outcomeQuestion: '1. Wetin be the result of your first report or complaint?',
    outcomeNoResponse: 'Dem no answer at all',
    outcomeNoResponseDesc: 'You submit proper report, but the time pass and nobody answer you.',
    outcomeDidntResolve: 'Their answer no solve the problem',
    outcomeDidntResolveDesc: 'Dem reply or send letter wey no touch the real issue at all.',
    outcomeClosedWithoutReason: 'Dem close case without explanation',
    outcomeClosedWithoutReasonDesc: 'Dem put resolved mark for their book, but the wahala still dey.',
    outcomeReferredLoop: 'Dem push you go another place / long leg',
    outcomeReferredLoopDesc: 'Dem dey send you from one table to another without solution.',
    outcomeOther: 'Other result wey no solve am',
    outcomeOtherDesc: 'Another kind office delay or breakdown happen.',
    providerQuestion: '2. Which office or company you report to?',
    providerPlaceholder: 'e.g. IBEDC, Access Bank, National Hospital, Land Office',
    refNumberQuestion: '3. Account or reference number (if e dey)',
    refNumberPlaceholder: 'e.g. CCU-12345, Account 0456-789123',
    summaryQuestion: '4. Briefly talk the matter wey never finish',
    summaryPlaceholder: 'Talk wetin you report, wetin happen, and wetin remain now...',

    evidenceTitle: 'Put your evidence and statement',
    evidenceSubtitle: 'Add receipts, letters, emails, bills, screenshots, or chat message.',
    dropzoneTitle: 'Drop evidence documents here',
    dropzoneSubtitle: 'or click to choose from your phone or laptop',
    browseFiles: 'Browse Files',
    fileSupportText: 'Support PDF, PNG, JPG, TXT, CSV, Email up to 25MB',
    collectedEvidence: 'Evidence Wey You Don Gather',
    noEvidenceYet: 'You never put any evidence yet. Add file for up or write statement.',
    manualTextEntry: 'Or write your statement by hand',
    addManualSnippet: 'Add Written Statement',

    reconstructTitle: 'Arrange the Case Timeline',
    reconstructSubtitle: 'Everything arrange by date and tight join to your evidence.',
    reconstructProcessing: 'De arrange verified timeline from your evidence...',
    timelineTitle: 'Case Story & Timeline',
    addEventManually: 'Add Event By Hand',
    contradictionsDetected: 'Where Company Talk Against Themselves',
    missingInfoNoted: 'Documents Wey Miss & Things Wey No Clear',

    verifyTitle: 'Check Facts & Where E From Come',
    verifySubtitle: 'Check everything to make sure say true true your evidence support am.',
    verifyInstructions: 'Check each event. Confirm the dates, names, and words.',
    verifyAllSourceBacked: 'Mark all evidence-backed events as true',
    allVerifiedConfirmation: 'I confirm say this timeline follow my real evidence records.',
    provenanceExplainer: 'Evidence standard: Your real document na king. CaseCarry no dey cook story.',

    unresolvedTitle: 'Wetin Still Remain Wey Never Finish?',
    unresolvedSubtitle: 'Talk wetin remain broken, wetin dem solve, and wetin you want dem do now.',
    unresolvedProblemLabel: '1. Wetin be the main problem wey still dey?',
    unresolvedProblemPlaceholder: 'Talk clear clear wetin remain broken right now...',
    whatWasRequestedLabel: '2. Wetin you ask dem to do at first?',
    whatWasRequestedPlaceholder: 'e.g. Fix my account, refund my payment, come check my light meter...',
    whatHappenedLabel: '3. Wetin happen after you ask dem?',
    whatHappenedPlaceholder: 'e.g. Dem send letter say dem don fix am but light bill still high...',
    whatWasResolvedLabel: '4. Which part dem fix (if e dey)?',
    whatWasNotResolvedLabel: '5. Which part dem never fix at all?',
    resolutionVisionLabel: '6. Wetin be the exact solution wey you want now?',
    alreadyTriedLabel: '7. Which steps you don try before?',

    pathwayTitle: 'Explore Next Roads Wey You Fit Take',
    pathwaySubtitle: 'Regulators, consumer protection offices, and dispute commissions.',
    pathwayStandardAttribution: 'CaseCarry find these roads based on your case details wey we review. CaseCarry no be judge or lawyer and no dey promise final result.',
    inspectFactsBtn: 'Check Case Facts Wey We Use Find Roads',
    addCustomPathwayBtn: 'Add Your Own Road',
    tabAllPathways: 'All Roads',
    tabPotential: 'Next Roads Wey Fit Work',
    tabAlreadyTried: 'Wetin I Don Try',
    tabExcluded: 'Wetin I Comot',
    markAsPotential: 'Mark as Next Road',
    markAsAlreadyTried: 'Mark as Wetin I Don Try',
    markAsExcluded: 'Mark as Comot',
    includeInBundle: 'Put inside final file wey I go carry go front',
    whyRelevantLabel: 'Why This Fit Help You:',

    privacyTitle: 'Check Wetin You Dey Share',
    privacySubtitle: 'Na you decide which document go follow the file go out.',
    privacyExplanation: 'Choose which document follow your case. Secret files go remain inside your device.',
    includeInTransmission: 'Follow inside the package',
    retainPrivately: 'Stay inside my device only (private)',
    approveAndCreateBundle: 'Approve & Form Final Case Dossier',

    bundleTitle: 'Final Dossier To Carry Go Front',
    bundleSubtitle: 'Complete evidence-backed case record ready to carry go front.',
    sec1Summary: '1. Executive Case Summary',
    sec2Problem: '2. Main Unresolved Problem',
    sec3ResolvedVsUnresolved: '3. Wetin Dem Fix vs Wetin Still Remain',
    sec4DesiredResolution: '4. Solution Wey You Want',
    sec5PriorSteps: '5. Things Wey You Don Try Before',
    sec6Chronology: '6. Verified Timeline & Evidence Index',
    sec7Contradictions: '7. Where Company Record No Match & Missing Papers',
    sec8Pathways: '8. Next Roads Wey Citizen Pick',
    neutralityAttestation: 'Na citizen prepare and confirm this record with CaseCarry. All evidence dey indexed so anybody fit check am.',

    exportTitle: 'Export & Share Your Case Record',
    exportSubtitle: 'Download, print, or copy your complete case dossier.',
    downloadText: 'Download Plain Text (.txt)',
    downloadJson: 'Download Case File (.json)',
    printOrPdf: 'Print / Save as PDF',
    printPaperCopy: 'Print Paper Copy (Print)',
    exportBundle: 'Export & Save File',
    copySummary: 'Copy Formatted Summary',
    optional: 'Optional',
    skipStep: 'Skip this step',
  },
};
