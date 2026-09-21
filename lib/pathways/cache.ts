import { CachedPathwayRecord } from './types';

export const VERIFIED_PATHWAYS_CACHE: CachedPathwayRecord[] = [
  // 1. Electricity / Utilities (Nigeria / Ogun State & Federal)
  {
    id: 'cache-ogserc-dispute',
    name: 'Ogun State Electricity Regulatory Commission (OGSERC) Dispute Mechanism',
    organization: 'Ogun State Electricity Regulatory Commission (OGSERC)',
    jurisdiction: 'Ogun State, Nigeria',
    country: 'Nigeria',
    sector: 'electricity',
    pathwayType: 'sector_regulator',
    eligibility: 'Consumers within Ogun State who have submitted a formal complaint to the licensed distribution company (e.g. IBEDC / EKEDC) and received an unsatisfactory resolution or no response within statutory timelines.',
    requiredDocuments: [
      'Original complaint submission proof or ticket number',
      'Disputed electricity bills showing meter reading or estimated billing calculations',
      'Proof of payment receipts or transaction slips (if charges were paid)',
      'Provider formal closure or deadlock letter (if issued)',
    ],
    steps: [
      'Confirm provider internal complaint was submitted and statutory window has passed',
      'Prepare copies of disputed bills, payment receipts, and provider responses',
      'Submit dispute petition to OGSERC Consumer Affairs Directorate citing account reference and unresolved problem',
      'Attend mediation or regulatory review hearing if convened',
    ],
    officialSourceTitle: 'OGSERC Customer Complaints and Dispute Resolution Regulations',
    officialSourceUrl: 'https://ogserc.og.gov.ng/regulations/consumer-dispute-resolution',
    lastCheckedDate: '2026-09-21',
    freshnessThresholdDays: 90,
    generalUncertainties: [
      'Whether the specific distribution asset is under state-level OGSERC or federal NERC transition guidelines',
      'Specific tariff band dispute thresholds applicable to commercial versus residential meters',
    ],
  },
  {
    id: 'cache-nerc-forum-office',
    name: 'Nigerian Electricity Regulatory Commission (NERC) Forum Office Escalation',
    organization: 'Nigerian Electricity Regulatory Commission (NERC)',
    jurisdiction: 'Nigeria (Federal / State Forum Offices)',
    country: 'Nigeria',
    sector: 'electricity',
    pathwayType: 'sector_regulator',
    eligibility: 'Electricity consumers nationwide who have exhausted the Customer Complaints Unit (CCU) of their respective DisCo and obtained a deadlock or passed the 15-day resolution window.',
    requiredDocuments: [
      'DisCo CCU complaint reference number',
      'DisCo response or proof of 15 days non-response',
      'Account statements and meter reading verification',
    ],
    steps: [
      'Obtain DisCo CCU formal closure note or document the 15-day lapse',
      'File NERC Forum Appeal Form with local Forum Office',
      'Forum Secretariat serves notice on DisCo for response within 14 days',
      'Hearing scheduled for binding Forum ruling',
    ],
    officialSourceTitle: 'NERC Customer Complaints Handling Standards & Procedures',
    officialSourceUrl: 'https://nerc.gov.ng/index.php/home/consumers/consumer-complaints',
    lastCheckedDate: '2026-09-21',
    freshnessThresholdDays: 90,
    generalUncertainties: [
      'Current physical sitting schedule for the zonal Forum Office',
      'Applicable capping order limits for specific estimated billing classes',
    ],
  },

  // 2. Consumer Protection (Federal & State)
  {
    id: 'cache-fccpc-consumer-protection',
    name: 'Federal Competition & Consumer Protection Commission (FCCPC) Dispute Resolution',
    organization: 'Federal Competition & Consumer Protection Commission (FCCPC)',
    jurisdiction: 'Nigeria (Federal)',
    country: 'Nigeria',
    sector: 'consumer_general',
    pathwayType: 'consumer_protection',
    eligibility: 'Any consumer subjected to unfair billing, deceptive practices, non-delivery of service, or arbitrary charges by commercial service providers across Nigeria.',
    requiredDocuments: [
      'Chronological summary of transaction and dispute',
      'Invoices, receipts, or contracts',
      'Written communications with provider showing failure to resolve',
    ],
    steps: [
      'File complaint online via FCCPC Consumer Portal or zonal office',
      'Provide merchant/provider contact details and evidence bundle',
      'FCCPC Consumer Protection Department initiates investigation and summons provider',
      'Mediation session or administrative order issued',
    ],
    officialSourceTitle: 'FCCPC Consumer Complaint Redress Framework',
    officialSourceUrl: 'https://fccpc.gov.ng/complaints/',
    lastCheckedDate: '2026-09-21',
    freshnessThresholdDays: 90,
    generalUncertainties: [
      'Case load turnaround time for administrative investigations',
      'Concurrent jurisdiction when a sector-specific regulator is also actively seized of the matter',
    ],
  },

  // 3. Banking & Financial Services
  {
    id: 'cache-cbn-cpd-complaint',
    name: 'Central Bank of Nigeria (CBN) Consumer Protection Department Escalation',
    organization: 'Central Bank of Nigeria (CBN) Consumer Protection Department',
    jurisdiction: 'Nigeria (Federal)',
    country: 'Nigeria',
    sector: 'banking_finance',
    pathwayType: 'sector_regulator',
    eligibility: 'Bank and financial institution customers whose formal complaints on excess charges, unauthorized deductions, or failed transactions remain unresolved after the bank’s mandatory 30-day resolution window.',
    requiredDocuments: [
      'Bank complaint tracking / ticket ID',
      'Account statement showing disputed deductions',
      'Bank response letter or proof of lapse of 30 days',
      'Valid citizen identification',
    ],
    steps: [
      'Log complaint with bank and obtain tracking number',
      'Wait mandatory 30 days for internal resolution',
      'If unresolved, forward petition with tracking number to cpd@cbn.gov.ng',
      'CBN reviews and mandates refund/reversal with statutory penalties where applicable',
    ],
    officialSourceTitle: 'CBN Consumer Protection Regulations & Redress Mechanism',
    officialSourceUrl: 'https://www.cbn.gov.ng/devfin/cpd.asp',
    lastCheckedDate: '2026-09-21',
    freshnessThresholdDays: 90,
    generalUncertainties: [
      'Applicability to non-bank fintech apps or microfinance operators without direct CBN clearing membership',
    ],
  },

  // 4. Telecommunications
  {
    id: 'cache-ncc-consumer-affairs',
    name: 'Nigerian Communications Commission (NCC) Consumer Affairs Bureau',
    organization: 'Nigerian Communications Commission (NCC)',
    jurisdiction: 'Nigeria (Federal)',
    country: 'Nigeria',
    sector: 'telecommunications',
    pathwayType: 'sector_regulator',
    eligibility: 'Subscribers of telecom networks (MTN, Airtel, Glo, 9mobile, ISPs) who have lodged an unresolved complaint with their service provider and waited over standard resolution SLAs.',
    requiredDocuments: [
      'Telecom provider complaint ticket number',
      'Phone number / Account ID affected',
      'Recharge / airtime / data deduction logs or bill receipts',
    ],
    steps: [
      'Submit complaint to service provider customer care and request ticket number',
      'If unresolved after provider SLA, call NCC toll-free line 622 or lodge on NCC Consumer Portal',
      'NCC Consumer Affairs Bureau mandates provider resolution within regulated timeframe',
    ],
    officialSourceTitle: 'NCC Consumer Protection Regulations & 622 Escalation Protocol',
    officialSourceUrl: 'https://consumer.ncc.gov.ng/complaints',
    lastCheckedDate: '2026-09-21',
    freshnessThresholdDays: 90,
    generalUncertainties: [
      'Whether issue falls under network quality of service or commercial third-party VAS subscription billing',
    ],
  },

  // 5. Public Institutions / Administrative Injustice Ombudsman
  {
    id: 'cache-pcc-ombudsman',
    name: 'Public Complaints Commission (The Nigerian Ombudsman)',
    organization: 'Public Complaints Commission (PCC)',
    jurisdiction: 'Nigeria (Federal & State Offices)',
    country: 'Nigeria',
    sector: 'public_administrative',
    pathwayType: 'ombudsman',
    eligibility: 'Any individual aggrieved by administrative injustice, abuse of office, bureaucratic delay, or arbitrary action by government ministries, agencies, or private corporations.',
    requiredDocuments: [
      'Written petition detailing administrative grievance',
      'Copies of correspondence sent to the offending agency',
      'Identity document of complainant',
    ],
    steps: [
      'Draft formal complaint letter addressed to the Honourable Commissioner of the State PCC Office',
      'Attach all previous correspondence and evidence',
      'PCC investigates, summons parties, and issues recommendations for redress',
    ],
    officialSourceTitle: 'Public Complaints Commission Act (Cap P37 LFN 2004)',
    officialSourceUrl: 'https://pcc.gov.ng/complaint-procedure',
    lastCheckedDate: '2026-09-21',
    freshnessThresholdDays: 90,
    generalUncertainties: [
      'PCC statutory limitations regarding matters already pending before a court of competent jurisdiction',
    ],
  },

  // 6. International / UK Ombudsman (Energy, Financial, Legal Aid)
  {
    id: 'cache-uk-energy-ombudsman',
    name: 'Energy Ombudsman Dispute Resolution',
    organization: 'Energy Ombudsman',
    jurisdiction: 'United Kingdom (Great Britain)',
    country: 'United Kingdom',
    sector: 'electricity',
    pathwayType: 'ombudsman',
    eligibility: 'Domestic or microbusiness energy consumers whose supplier complaint has reached deadlock or 8 weeks have elapsed since first submission.',
    requiredDocuments: [
      'Deadlock letter from energy supplier OR evidence that 8 weeks have elapsed',
      'Energy bills and meter readings',
      'Written log of customer service calls and emails',
    ],
    steps: [
      'Verify 8 weeks have passed or obtain Deadlock Letter',
      'Submit dispute online to Energy Ombudsman',
      'Ombudsman gathers evidence from supplier and consumer',
      'Binding decision issued requiring supplier compliance',
    ],
    officialSourceTitle: 'Energy Ombudsman Scheme Rules & Guidance',
    officialSourceUrl: 'https://www.energyombudsman.org/how-it-works',
    lastCheckedDate: '2026-09-21',
    freshnessThresholdDays: 90,
    generalUncertainties: [
      'Strict 12-month time limit from receipt of deadlock letter to file claim',
    ],
  },
  {
    id: 'cache-uk-financial-ombudsman',
    name: 'Financial Ombudsman Service (FOS) Dispute Review',
    organization: 'Financial Ombudsman Service (FOS)',
    jurisdiction: 'United Kingdom',
    country: 'United Kingdom',
    sector: 'banking_finance',
    pathwayType: 'ombudsman',
    eligibility: 'Consumers with unresolved disputes against UK regulated financial businesses (banks, insurers, lenders) who have received a final response letter or waited 8 weeks.',
    requiredDocuments: [
      'Bank/Lender Final Response Letter or 8-week complaint date proof',
      'Account statements and transaction documentation',
    ],
    steps: [
      'Obtain bank Final Response letter',
      'Submit complaint online to FOS within 6 months of final response',
      'Investigator evaluates case and proposes resolution',
      'Ombudsman issues final legally binding decision if either party appeals investigator finding',
    ],
    officialSourceTitle: 'Financial Ombudsman Service Complaint Procedure',
    officialSourceUrl: 'https://www.financial-ombudsman.org.uk/consumers/how-to-complain',
    lastCheckedDate: '2026-09-21',
    freshnessThresholdDays: 90,
    generalUncertainties: [
      '6-month filing deadline from date of bank Final Response letter',
    ],
  },
];

export function findCachedPathways(sector: string, country?: string, jurisdiction?: string): CachedPathwayRecord[] {
  const normSector = (sector || '').toLowerCase();
  const normCountry = (country || '').toLowerCase();
  const normJurisdiction = (jurisdiction || '').toLowerCase();

  return VERIFIED_PATHWAYS_CACHE.filter((item) => {
    const sectorMatch =
      !normSector ||
      item.sector.toLowerCase().includes(normSector) ||
      normSector.includes(item.sector.toLowerCase()) ||
      item.sector === 'consumer_general';

    const countryMatch =
      !normCountry ||
      item.country.toLowerCase().includes(normCountry) ||
      normCountry.includes(item.country.toLowerCase());

    const jurisMatch =
      !normJurisdiction ||
      item.jurisdiction.toLowerCase().includes(normJurisdiction) ||
      normJurisdiction.includes(item.jurisdiction.toLowerCase()) ||
      item.jurisdiction.toLowerCase().includes('federal') ||
      item.jurisdiction.toLowerCase().includes('state forum');

    return sectorMatch && (countryMatch || jurisMatch);
  });
}
