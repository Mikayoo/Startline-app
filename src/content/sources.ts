import type { Province } from './steps';

// Source register. Every answer and plan step must point at a record here.
//
// PROTOTYPE STATUS: these records come from the starter pack in the
// development handoff. None has been checked by the partner agency yet, so
// every record is `reviewStatus: 'not-reviewed'` and `lastChecked: null`.
// The summaries are short drafts written for the demo. They describe what a
// page covers, not who qualifies. A reviewer must approve each summary and
// set `lastChecked` before real participants rely on it.

export type Jurisdiction = 'federal' | 'ontario' | 'region' | 'city' | 'agency' | 'privacy';

export type ReviewStatus = 'not-reviewed' | 'approved' | 'needs-recheck' | 'withdrawn';

export interface Passage {
  id: string;
  text: string;
  // Words a question has to touch for this passage to be a candidate answer.
  keywords: string[];
}

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  jurisdiction: Jurisdiction;
  topics: string[];
  reviewStatus: ReviewStatus;
  lastChecked: string | null;
  reviewer: string | null;
  limitations: string;
  passages: Passage[];
  // Only shown to people who live here. No area means it applies across Canada.
  area?: { province: Province; cities?: string[] };
}

const WATERLOO_REGION = ['Kitchener', 'Waterloo', 'Cambridge'];

export const SOURCES: Source[] = [
  {
    id: '211-canada',
    title: '211: find community and social services',
    publisher: '211 Canada',
    url: 'https://211.ca/',
    jurisdiction: 'federal',
    topics: ['housing', 'community', 'settlement', 'education', 'health', 'money'],
    reviewStatus: 'not-reviewed',
    lastChecked: null,
    reviewer: null,
    limitations: 'Navigation service. Listings are maintained by 211, not by Startline.',
    passages: [
      {
        id: '211-canada-navigation',
        text: '211 is a free, confidential helpline and website that connects people across Canada to community, social, health and government services near them. You can call or text 2-1-1.',
        keywords: ['211', 'helpline', 'call', 'find', 'services', 'shelter', 'food', 'school', 'help', 'community', 'near'],
      },
    ],
  },
  {
    id: 'ircc-claimants',
    title: 'Information for refugee claimants',
    publisher: 'Immigration, Refugees and Citizenship Canada',
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/information-refugee-claimants.html',
    jurisdiction: 'federal',
    topics: ['legal', 'health', 'documents'],
    reviewStatus: 'not-reviewed',
    lastChecked: null,
    reviewer: null,
    limitations: 'Federal guidance. Individual claims depend on personal circumstances.',
    passages: [
      {
        id: 'ircc-claimants-process',
        text: 'This IRCC guide explains the steps of a refugee claim in Canada, the documents you receive, and what happens before your hearing.',
        keywords: ['claim', 'refugee', 'claimant', 'hearing', 'process', 'documents', 'steps', 'next'],
      },
      {
        id: 'ircc-claimants-health',
        text: 'The same guide describes the Interim Federal Health Program, which can cover some health care for refugee claimants. Check the guide for what it covers and how to use it.',
        keywords: ['health', 'doctor', 'ifhp', 'interim', 'federal', 'coverage', 'medical', 'hospital', 'care'],
      },
    ],
  },
  {
    id: 'ircc-rights',
    title: 'Refugee claimants: know your rights',
    publisher: 'Immigration, Refugees and Citizenship Canada',
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/refugees/help-within-canada/rights.html',
    jurisdiction: 'federal',
    topics: ['legal'],
    reviewStatus: 'not-reviewed',
    lastChecked: null,
    reviewer: null,
    limitations: 'General rights information, not legal advice.',
    passages: [
      {
        id: 'ircc-rights-overview',
        text: 'IRCC lists the rights refugee claimants have while their claim is processed, and where to get help if you think your rights are not respected.',
        keywords: ['rights', 'right', 'treated', 'fair', 'protect', 'protection'],
      },
    ],
  },
  {
    id: 'ircc-services',
    title: 'Find free newcomer services near you',
    publisher: 'Immigration, Refugees and Citizenship Canada',
    url: 'https://ircc.canada.ca/english/newcomers/services/',
    jurisdiction: 'federal',
    topics: ['settlement', 'language', 'work'],
    reviewStatus: 'not-reviewed',
    lastChecked: null,
    reviewer: null,
    limitations: 'Many IRCC-funded services have eligibility rules. Not every service is open to refugee claimants.',
    passages: [
      {
        id: 'ircc-services-finder',
        text: 'IRCC has a finder for free newcomer services such as settlement help, language classes and job support. Eligibility depends on your immigration status, so check each service before you go.',
        keywords: ['services', 'settlement', 'language', 'english', 'class', 'classes', 'job', 'work', 'free', 'near'],
      },
    ],
  },
  {
    id: 'service-canada-sin',
    title: 'Social Insurance Number',
    publisher: 'Service Canada',
    url: 'https://www.canada.ca/en/employment-social-development/services/sin.html',
    jurisdiction: 'federal',
    topics: ['work', 'documents'],
    reviewStatus: 'not-reviewed',
    lastChecked: null,
    reviewer: null,
    limitations: 'Which documents you need depends on your status and the documents you hold.',
    passages: [
      {
        id: 'sin-apply',
        text: 'Service Canada explains how to apply for a Social Insurance Number (SIN), which you need to work in Canada and to use some government programs. The documents you need depend on your status.',
        keywords: ['sin', 'social', 'insurance', 'number', 'work', 'job', 'apply', 'employer'],
      },
    ],
  },
  {
    id: 'irb',
    title: 'Immigration and Refugee Board of Canada',
    publisher: 'Immigration and Refugee Board of Canada',
    url: 'https://www.irb-cisr.gc.ca/',
    jurisdiction: 'federal',
    topics: ['legal'],
    reviewStatus: 'not-reviewed',
    lastChecked: null,
    reviewer: null,
    limitations: 'Tribunal information. Questions about a specific claim need a lawyer or legal clinic.',
    passages: [
      {
        id: 'irb-hearing',
        text: 'The IRB is the tribunal that decides refugee claims. Its site has claimant guides about forms, deadlines and how hearings work.',
        keywords: ['irb', 'hearing', 'tribunal', 'board', 'basis', 'form', 'boc', 'deadline', 'decision', 'lawyer', 'legal'],
      },
    ],
  },
  {
    id: 'ontario-works',
    title: 'Ontario Works policy directives: residency requirements',
    publisher: 'Government of Ontario',
    url: 'https://www.ontario.ca/document/ontario-works-policy-directives/31-residency-requirements',
    area: { province: 'ON' },
    jurisdiction: 'ontario',
    topics: ['money'],
    reviewStatus: 'not-reviewed',
    lastChecked: null,
    reviewer: null,
    limitations: 'Policy text for caseworkers. A caseworker must confirm what applies to you.',
    passages: [
      {
        id: 'ow-residency',
        text: 'Ontario Works is the province\'s financial assistance program. Its policy directives set out who can apply based on residency and status. A caseworker decides eligibility.',
        keywords: ['money', 'financial', 'assistance', 'ontario', 'works', 'welfare', 'income', 'rent', 'support', 'pay'],
      },
    ],
  },
  {
    id: 'ontario-ohip',
    title: 'Apply for OHIP and get a health card',
    publisher: 'Government of Ontario',
    url: 'https://www.ontario.ca/page/apply-ohip-and-get-health-card',
    area: { province: 'ON' },
    jurisdiction: 'ontario',
    topics: ['health'],
    reviewStatus: 'not-reviewed',
    lastChecked: null,
    reviewer: null,
    limitations: 'OHIP eligibility depends on status. Not everyone qualifies.',
    passages: [
      {
        id: 'ohip-apply',
        text: 'Ontario explains who can get OHIP, the provincial health plan, and how to apply for a health card. Eligibility depends on your immigration status.',
        keywords: ['ohip', 'health', 'card', 'doctor', 'coverage', 'ontario', 'medical'],
      },
    ],
  },
  {
    id: 'kitchener-settlement',
    title: 'Settlement and community services',
    publisher: 'City of Kitchener',
    url: 'https://www.kitchener.ca/welcome-to-kitchener/settlement-and-community-services/',
    area: { province: 'ON', cities: WATERLOO_REGION },
    jurisdiction: 'city',
    topics: ['settlement', 'housing', 'community'],
    reviewStatus: 'not-reviewed',
    lastChecked: null,
    reviewer: null,
    limitations: 'A directory. Each listed service sets its own eligibility and hours.',
    passages: [
      {
        id: 'kitchener-directory',
        text: 'The City of Kitchener lists local settlement and community services, grouped by type of help.',
        keywords: ['kitchener', 'local', 'settlement', 'community', 'services', 'help', 'near', 'waterloo'],
      },
    ],
  },
  {
    id: 'region-waterloo',
    title: 'Region of Waterloo',
    publisher: 'Region of Waterloo',
    url: 'https://www.regionofwaterloo.ca/',
    area: { province: 'ON', cities: WATERLOO_REGION },
    jurisdiction: 'region',
    topics: ['housing', 'money', 'community'],
    reviewStatus: 'not-reviewed',
    lastChecked: null,
    reviewer: null,
    limitations: 'Exact service pages still to be chosen during content review.',
    passages: [
      {
        id: 'region-services',
        text: 'The Region of Waterloo runs regional services including housing help and social assistance offices for Kitchener, Waterloo and Cambridge.',
        keywords: ['region', 'housing', 'shelter', 'stay', 'home', 'apartment', 'waterloo', 'cambridge', 'social'],
      },
    ],
  },
  {
    id: '211-ontario',
    title: '211 Ontario',
    publisher: '211 Ontario',
    url: 'https://211ontario.ca/',
    area: { province: 'ON' },
    jurisdiction: 'ontario',
    topics: ['housing', 'community', 'settlement', 'education'],
    reviewStatus: 'not-reviewed',
    lastChecked: null,
    reviewer: null,
    limitations: 'Navigation service. Listings are maintained by 211, not by Startline.',
    passages: [
      {
        id: '211-navigation',
        text: '211 Ontario is a free helpline and website that connects you to community, social, health and government services. You can call 2-1-1 or search online.',
        keywords: ['211', 'helpline', 'call', 'find', 'services', 'shelter', 'food', 'school', 'help', 'community'],
      },
    ],
  },
  {
    id: 'kwmc',
    title: 'Kitchener-Waterloo Multicultural Centre',
    publisher: 'KW Multicultural Centre',
    url: 'https://kwmulticultural.ca/',
    area: { province: 'ON', cities: WATERLOO_REGION },
    jurisdiction: 'agency',
    topics: ['settlement', 'community', 'language'],
    reviewStatus: 'not-reviewed',
    lastChecked: null,
    reviewer: null,
    limitations: 'Possible partner. Services and referral arrangements not yet confirmed.',
    passages: [
      {
        id: 'kwmc-overview',
        text: 'The KW Multicultural Centre offers settlement and community programs for newcomers in Waterloo Region. Contact them to confirm which programs fit you.',
        keywords: ['settlement', 'worker', 'community', 'newcomer', 'program', 'multicultural'],
      },
    ],
  },
  {
    id: 'reception-house',
    title: 'Reception House Waterloo Region',
    publisher: 'Reception House Waterloo Region',
    url: 'https://www.receptionhouse.ca/',
    area: { province: 'ON', cities: WATERLOO_REGION },
    jurisdiction: 'agency',
    topics: ['settlement', 'housing'],
    reviewStatus: 'not-reviewed',
    lastChecked: null,
    reviewer: null,
    limitations: 'Possible partner. Services and referral arrangements not yet confirmed.',
    passages: [
      {
        id: 'reception-overview',
        text: 'Reception House supports refugees in Waterloo Region. Contact them to confirm which services are open to you.',
        keywords: ['refugee', 'settlement', 'support', 'reception', 'house', 'worker'],
      },
    ],
  },
];

export function getSource(id: string): Source | undefined {
  return SOURCES.find((s) => s.id === id);
}

// Whether a source applies where the person lives. Before they answer the
// location question every source is shown.
export function appliesHere(source: Source, province: Province | null, city: string | null): boolean {
  if (!source.area || !province) return true;
  if (source.area.province !== province) return false;
  return !source.area.cities || (city !== null && source.area.cities.includes(city));
}

export function sourcesFor(ids: string[], province: Province | null, city: string | null): Source[] {
  return ids.map(getSource).filter((s): s is Source => !!s && appliesHere(s, province, city));
}
