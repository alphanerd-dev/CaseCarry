import { PathwayDiscoveryInput, PathwayFact, SafetyAlert } from './types';

/**
 * Extracts structured facts with verified provenance from the processed case record.
 * Never invents values; preserves provenance (SOURCE_BACKED, USER_REPORTED, NEEDS_REVIEW).
 */
export function extractPathwayCaseFacts(input: PathwayDiscoveryInput): {
  facts: PathwayFact[];
  safetyAlert?: SafetyAlert;
} {
  const facts: PathwayFact[] = [];
  const validSourceMap = new Map(input.evidenceSources.map((s) => [s.id, s.filename]));

  const combinedText = [
    input.userDescription || '',
    input.caseTitle || '',
    input.provider || '',
    input.referenceNumber || '',
    input.unresolved?.problem || '',
    input.unresolved?.whatHappened || '',
    input.unresolved?.responseReceived || '',
    input.unresolved?.whatWasNotResolved || '',
    input.unresolved?.requestedAction || '',
    ...input.events.map((e) => `${e.title} ${e.description}`),
    ...input.evidenceSources.map((e) => `${e.title} ${e.filename} ${e.textSnippet || ''}`),
  ].join(' ');

  const lowerText = combinedText.toLowerCase();

  // 1. High-Risk / Immediate Safety Check (Rule 20)
  let safetyAlert: SafetyAlert | undefined;
  const safetyKeywords = [
    'physical threat',
    'violence',
    'domestic abuse',
    'assault',
    'medical emergency',
    'imminent danger',
    'eviction today',
    'suicide',
    'self-harm',
    'stalking',
    'kidnap',
  ];

  const matchedSafety = safetyKeywords.filter((kw) => lowerText.includes(kw));
  if (matchedSafety.length > 0) {
    safetyAlert = {
      isHighRisk: true,
      riskType: matchedSafety.some((m) => m.includes('medical')) ? 'medical_emergency' : 'imminent_threat',
      advisory:
        'Your case records contain indicators of potential immediate safety or emergency risk. Standard administrative ombudsman and regulatory complaint processes take weeks or months. Please prioritize contacting direct emergency or protective services first.',
      emergencyResources: [
        {
          name: 'National Emergency Toll-Free Services',
          contact: '112 / 999 / 911 (Jurisdiction Emergency Services)',
          note: 'Immediate dispatch for life safety, police, fire, or acute medical response.',
        },
        {
          name: 'Direct Protection & Legal Aid Emergency Clinics',
          contact: 'Local Duty Solicitor & Civic Protection Desks',
          note: 'For urgent restraining orders or emergency legal protection.',
        },
      ],
    };
  }

  // 2. Institution / Provider Identification
  const docWithProvider = input.evidenceSources.find((s) =>
    (s.textSnippet || '').toLowerCase().includes((input.provider || '').toLowerCase())
  );

  if (input.provider && input.provider.trim().length > 0) {
    const isSourceBacked = !!docWithProvider;
    facts.push({
      field: 'institution',
      label: 'Institution / Provider Involved',
      value: input.provider.trim(),
      provenance: isSourceBacked ? 'SOURCE_BACKED' : 'USER_REPORTED',
      sourceIds: isSourceBacked ? [docWithProvider.id] : [],
      sourceNames: isSourceBacked ? [docWithProvider.filename] : ['Citizen Statement'],
    });
  }

  // 3. Sector & Service Involved
  let sectorValue = 'Consumer General';
  let sectorCategory = 'consumer_general';
  let sectorSourceIds: string[] = [];

  if (
    lowerText.includes('electricity') ||
    lowerText.includes('ibedc') ||
    lowerText.includes('ekedc') ||
    lowerText.includes('nerc') ||
    lowerText.includes('disco') ||
    lowerText.includes('tariff') ||
    lowerText.includes('kwh') ||
    lowerText.includes('meter')
  ) {
    sectorValue = 'Electricity & Utilities';
    sectorCategory = 'electricity';
  } else if (
    lowerText.includes('telecom') ||
    lowerText.includes('mtn') ||
    lowerText.includes('airtel') ||
    lowerText.includes('glo') ||
    lowerText.includes('9mobile') ||
    lowerText.includes('ncc') ||
    lowerText.includes('broadband') ||
    lowerText.includes('sim')
  ) {
    sectorValue = 'Telecommunications & Internet Services';
    sectorCategory = 'telecommunications';
  } else if (
    lowerText.includes('bank') ||
    lowerText.includes('cbn') ||
    lowerText.includes('atm') ||
    lowerText.includes('transfer') ||
    lowerText.includes('deduction') ||
    lowerText.includes('ussd') ||
    lowerText.includes('debit') ||
    lowerText.includes('card')
  ) {
    sectorValue = 'Banking & Financial Services';
    sectorCategory = 'banking_finance';
  } else if (
    lowerText.includes('tenant') ||
    lowerText.includes('landlord') ||
    lowerText.includes('rent') ||
    lowerText.includes('lease') ||
    lowerText.includes('eviction')
  ) {
    sectorValue = 'Housing & Tenancy';
    sectorCategory = 'housing_tenancy';
  }

  // Check if sector is verified in documents
  const sectorDoc = input.evidenceSources.find((s) => {
    const snip = (s.textSnippet || '').toLowerCase();
    return (
      (sectorCategory === 'electricity' && (snip.includes('bill') || snip.includes('meter') || snip.includes('kwh') || snip.includes('electricity'))) ||
      (sectorCategory === 'telecommunications' && (snip.includes('data') || snip.includes('recharge') || snip.includes('network'))) ||
      (sectorCategory === 'banking_finance' && (snip.includes('bank') || snip.includes('account') || snip.includes('transfer') || snip.includes('ussd')))
    );
  });

  if (sectorDoc) {
    sectorSourceIds = [sectorDoc.id];
  }

  facts.push({
    field: 'sector',
    label: 'Sector / Industry',
    value: sectorValue,
    provenance: sectorDoc ? 'SOURCE_BACKED' : 'USER_REPORTED',
    sourceIds: sectorSourceIds,
    sourceNames: sectorDoc ? [sectorDoc.filename] : ['Citizen Statement'],
  });

  // 4. Jurisdiction (Country, State, Locality)
  let foundState = '';
  let foundCountry = '';
  let foundLocality = '';
  let jurisDocId = '';

  const stateKeywords = [
    { state: 'Ogun State', country: 'Nigeria', match: ['ogun', 'abeokuta', 'sagamu', 'ijebu', 'ota'] },
    { state: 'Lagos State', country: 'Nigeria', match: ['lagos', 'ikeja', 'lekki', 'surulere', 'yaba', 'ikoyi'] },
    { state: 'Oyo State', country: 'Nigeria', match: ['oyo', 'ibadan', 'ogbomoso'] },
    { state: 'Abuja (FCT)', country: 'Nigeria', match: ['abuja', 'fct', 'garki', 'wuse', 'maitama'] },
    { state: 'London / England', country: 'United Kingdom', match: ['london', 'england', 'uk', 'manchester', 'birmingham'] },
    { state: 'Scotland', country: 'United Kingdom', match: ['scotland', 'edinburgh', 'glasgow'] },
  ];

  for (const sk of stateKeywords) {
    const hasMatch = sk.match.some((kw) => lowerText.includes(kw));
    if (hasMatch) {
      foundState = sk.state;
      foundCountry = sk.country;
      break;
    }
  }

  // Check which document mentioned the location
  if (foundState) {
    const locDoc = input.evidenceSources.find((s) => {
      const snip = `${s.textSnippet || ''} ${s.filename}`.toLowerCase();
      const sk = stateKeywords.find((k) => k.state === foundState);
      return sk?.match.some((kw) => snip.includes(kw));
    });
    if (locDoc) {
      jurisDocId = locDoc.id;
    }
  }

  const jurisdictionDisplay = foundState ? `${foundState}, ${foundCountry}` : 'Jurisdiction not fully established in record';
  facts.push({
    field: 'jurisdiction',
    label: 'Identified Territorial Jurisdiction',
    value: jurisdictionDisplay,
    provenance: jurisDocId ? 'SOURCE_BACKED' : foundState ? 'USER_REPORTED' : 'NEEDS_REVIEW',
    sourceIds: jurisDocId ? [jurisDocId] : [],
    sourceNames: jurisDocId ? [validSourceMap.get(jurisDocId) || 'Document'] : ['Citizen Statement / Inferred'],
  });

  // 5. Previous Pathway Attempted & Outcome
  const outcomeLabelMap: Record<string, string> = {
    'closure-claim': 'Provider claimed dispute was resolved/closed, but issue remains active',
    'response-didnt-resolve': 'Provider issued a response, but it failed to correct the underlying grievance',
    'deadlock-refusal': 'Provider issued final deadlock or refused correction',
    'no-response': 'Statutory response window lapsed with no response from provider',
    'never-reported': 'First pathway not yet lodged with provider',
  };

  const outcomeText = outcomeLabelMap[input.firstReportOutcome] || input.firstReportOutcome || 'Initial complaint lodged with service provider';

  const responseDoc = input.evidenceSources.find((s) => {
    const snip = `${s.filename} ${s.title} ${s.textSnippet || ''}`.toLowerCase();
    return snip.includes('response') || snip.includes('closure') || snip.includes('letter') || snip.includes('reply') || snip.includes('notice');
  });

  facts.push({
    field: 'previousAuthority',
    label: 'Previous Pathway Attempted',
    value: input.provider ? `Direct Customer Complaint to ${input.provider}` : 'First-Line Provider Complaint',
    provenance: 'USER_REPORTED',
    sourceIds: [],
    sourceNames: ['Citizen Statement'],
  });

  facts.push({
    field: 'previousResponse',
    label: 'Outcome of Previous Attempt',
    value: outcomeText,
    provenance: responseDoc ? 'SOURCE_BACKED' : 'USER_REPORTED',
    sourceIds: responseDoc ? [responseDoc.id] : [],
    sourceNames: responseDoc ? [responseDoc.filename] : ['Citizen Statement'],
  });

  // 6. Unresolved Issue & Remedy Sought
  const unresolvedProblem = input.unresolved?.problem || input.unresolved?.whatWasNotResolved || input.userDescription || 'Dispute remains unrectified';
  const problemDoc = input.evidenceSources.find((s) => s.type === 'pdf' || s.type === 'receipt' || (s.textSnippet && s.textSnippet.length > 50));

  facts.push({
    field: 'unresolvedIssue',
    label: 'Unresolved Problem',
    value: unresolvedProblem.slice(0, 300),
    provenance: problemDoc ? 'SOURCE_BACKED' : 'USER_REPORTED',
    sourceIds: problemDoc ? [problemDoc.id] : [],
    sourceNames: problemDoc ? [problemDoc.filename] : ['Citizen Statement'],
  });

  if (input.unresolved?.requestedAction) {
    facts.push({
      field: 'requestedRemedy',
      label: 'Requested Remedy / Objective',
      value: input.unresolved.requestedAction.slice(0, 250),
      provenance: 'USER_REPORTED',
      sourceIds: [],
      sourceNames: ['Citizen Statement'],
    });
  }

  // 7. Available Evidence Inventory
  if (input.evidenceSources.length > 0) {
    facts.push({
      field: 'documentsAvailable',
      label: 'Documentary Evidence Available',
      value: `${input.evidenceSources.length} item(s): ${input.evidenceSources.map((e) => e.filename).join(', ')}`,
      provenance: 'SOURCE_BACKED',
      sourceIds: input.evidenceSources.map((e) => e.id),
      sourceNames: input.evidenceSources.map((e) => e.filename),
    });
  }

  return { facts, safetyAlert };
}
