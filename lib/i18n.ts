export type SupportedLanguage = 'en' | 'yo';

export interface TranslationDict {
  appName: string;
  tagline: string;
  carryCaseForward: string;
  exploreDemo: string;
  howItWorks: string;
  trustStatement: string;
  whatHappened: string;
  evidenceCollection: string;
  reconstruct: string;
  verify: string;
  unresolvedIssue: string;
  pathways: string;
  privacy: string;
  carryForwardBundle: string;
  export: string;
  back: string;
  continue: string;
  saveDraft: string;
  savedLocally: string;
  sourceBacked: string;
  userReported: string;
  inferred: string;
  needsReview: string;
  conflict: string;
  demoNotice: string;
  switchToRealCase: string;
  myCases: string;
  lowBandwidth: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDict> = {
  en: {
    appName: 'CaseCarry',
    tagline: 'Don’t tell your story again.',
    carryCaseForward: 'Carry my case forward',
    exploreDemo: 'Explore fictional demo case',
    howItWorks: 'How it works',
    trustStatement: 'You stay in control. CaseCarry organizes your information; you review and approve what gets included.',
    whatHappened: 'What happened after you first reported it?',
    evidenceCollection: 'Add your evidence & statements',
    reconstruct: 'Reconstruct timeline',
    verify: 'Verify facts & provenance',
    unresolvedIssue: 'What remains unresolved?',
    pathways: 'Relevant next pathways (Optional)',
    privacy: 'Review what you’re sharing',
    carryForwardBundle: 'Your case is ready to carry forward',
    export: 'Download & export record',
    back: 'Back',
    continue: 'Continue',
    saveDraft: 'Save draft',
    savedLocally: 'Saved locally in browser',
    sourceBacked: 'Source-backed',
    userReported: 'You reported this',
    inferred: 'CaseCarry inferred',
    needsReview: 'Needs review',
    conflict: 'Sources conflict',
    demoNotice: 'Sample case — fictional data for demonstration.',
    switchToRealCase: 'Start a real case (blank)',
    myCases: 'My Cases (Local)',
    lowBandwidth: 'Low Bandwidth',
  },
  yo: {
    appName: 'CaseCarry',
    tagline: 'Mase bẹrẹ itan rẹ lati ibẹrẹ mọ.',
    carryCaseForward: 'Gbe ọrọ mi lọ siwaju',
    exploreDemo: 'Wo apẹẹrẹ afihan ọrọ',
    howItWorks: 'Bi o ṣe n ṣiṣẹ',
    trustStatement: 'Iwọ lo ni iṣakoso. CaseCarry n ṣeto alaye rẹ; iwọ ni yoo yẹwo ati fọwọsi ohun ti o wọle.',
    whatHappened: 'Kini o ṣẹlẹ lẹhin igba akọkọ ti o fi ẹsun kan?',
    evidenceCollection: 'Fi ẹri ati alaye rẹ kun',
    reconstruct: 'Ṣeto asiko ati itan ohun to ṣẹlẹ',
    verify: 'Daju awọn otitọ ati orisun',
    unresolvedIssue: 'Kini ohun ti ko tii yanju?',
    pathways: 'Awọn ọna ti o le tẹle (Aṣayan)',
    privacy: 'Yẹwo alaye ti o n pin',
    carryForwardBundle: 'Akọsilẹ ọrọ rẹ ti ṣetan lati gbe lọ siwaju',
    export: 'Gba akọsilẹ rẹ jade',
    back: 'Pada sẹhin',
    continue: 'Tẹsiwaju',
    saveDraft: 'Fi pamọ',
    savedLocally: 'O wa ni ipamọ lori ẹrọ rẹ',
    sourceBacked: 'Ẹri fọwọsi i',
    userReported: 'O sọ eyi',
    inferred: 'CaseCarry ro pe',
    needsReview: 'Nilo atunyẹwo',
    conflict: 'Awọn orisun tako ara wọn',
    demoNotice: 'Ọrọ apẹẹrẹ — alaye atọwọda fun afihan.',
    switchToRealCase: 'Bẹrẹ ọrọ gidi titun (ofo)',
    myCases: 'Awọn ọrọ mi (Lori ẹrọ)',
    lowBandwidth: 'Ipo data kekere',
  },
};
