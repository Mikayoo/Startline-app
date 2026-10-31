// Plan step library. Each step is written to explain, not to decide
// eligibility: `appliesTo` says who the step is usually for and every step
// links to the sources a reviewer must approve before the pilot.

export type Priority = 'housing' | 'legal' | 'health' | 'money' | 'language' | 'school' | 'community';

export type Status = 'claimant' | 'protected' | 'resettled' | 'other' | 'unsure';

// Who is settling with the person. An empty list means "Just me".
export type HouseholdMember = 'partner' | 'children' | 'other';

export type Province = 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'NT' | 'NU' | 'ON' | 'PE' | 'QC' | 'SK' | 'YT';

// Every province and territory, with its larger cities. People elsewhere
// pick "Another city or town" and get their province's steps.
export const PROVINCES: { id: Province; name: string; cities: string[] }[] = [
  { id: 'AB', name: 'Alberta', cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge'] },
  { id: 'BC', name: 'British Columbia', cities: ['Vancouver', 'Surrey', 'Burnaby', 'Victoria', 'Kelowna'] },
  { id: 'MB', name: 'Manitoba', cities: ['Winnipeg', 'Brandon'] },
  { id: 'NB', name: 'New Brunswick', cities: ['Moncton', 'Saint John', 'Fredericton'] },
  { id: 'NL', name: 'Newfoundland and Labrador', cities: ["St. John's"] },
  { id: 'NS', name: 'Nova Scotia', cities: ['Halifax', 'Sydney'] },
  { id: 'NT', name: 'Northwest Territories', cities: ['Yellowknife'] },
  { id: 'NU', name: 'Nunavut', cities: ['Iqaluit'] },
  { id: 'ON', name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London', 'Kitchener', 'Waterloo', 'Cambridge', 'Windsor'] },
  { id: 'PE', name: 'Prince Edward Island', cities: ['Charlottetown'] },
  { id: 'QC', name: 'Quebec', cities: ['Montréal', 'Québec City', 'Laval', 'Gatineau', 'Sherbrooke'] },
  { id: 'SK', name: 'Saskatchewan', cities: ['Saskatoon', 'Regina'] },
  { id: 'YT', name: 'Yukon', cities: ['Whitehorse'] },
];

export function provinceName(id: Province | null): string | undefined {
  return PROVINCES.find((p) => p.id === id)?.name;
}

export interface Step {
  id: string;
  title: string;
  category: Priority | 'documents';
  categoryLabel: string;
  summary: string;
  appliesTo: string;
  prepare: string[];
  actions: string[];
  minutes: number;
  sourceIds: string[];
  // Shown when the step depends on things the app cannot check.
  caution?: string;
}

export const STEPS: Record<string, Step> = {
  'safe-place': {
    id: 'safe-place',
    title: 'Find a safe place to stay',
    category: 'housing',
    categoryLabel: 'Housing',
    summary: 'If you have nowhere safe to sleep tonight, start here. 211 can point you to shelters and housing help where you live.',
    appliesTo: 'Anyone who needs somewhere to stay, whatever their status.',
    prepare: ['Any ID or immigration papers you have', 'A phone number where you can be reached'],
    actions: ['Call 2-1-1 or search 211.ca for shelters near you', 'Ask your city or region about housing help', 'Tell a settlement worker if you are staying somewhere unsafe'],
    minutes: 20,
    sourceIds: ['211-canada', '211-ontario', 'region-waterloo'],
    caution: 'If you are in danger right now, call 911.',
  },
  'legal-help': {
    id: 'legal-help',
    title: 'Get help with your refugee claim',
    category: 'legal',
    categoryLabel: 'Legal help',
    summary: 'Refugee claims have forms and deadlines. A lawyer or legal clinic can help you prepare. A settlement worker can help you find one.',
    appliesTo: 'People who have made or plan to make a refugee claim.',
    prepare: ['Your claim documents', 'Any letters from IRCC or the IRB, with dates'],
    actions: ['Read the IRB claimant guides', 'Ask a settlement worker about free legal help near you', 'Keep copies of every document you send or receive'],
    minutes: 30,
    sourceIds: ['irb', 'ircc-claimants'],
    caution: 'Startline cannot give legal advice. Questions about your own claim need a lawyer or legal clinic.',
  },
  'health-cover': {
    id: 'health-cover',
    title: 'Check your health coverage',
    category: 'health',
    categoryLabel: 'Health care',
    summary: 'Which health coverage you have depends on your status. Some refugee claimants are covered by the Interim Federal Health Program. Others may qualify for their province\'s health plan, such as OHIP in Ontario.',
    appliesTo: 'Everyone. What applies to you depends on your status.',
    prepare: ['Your immigration documents', 'Any health coverage papers you were given'],
    actions: ['Read what the Interim Federal Health Program covers', 'Check whether you can apply for your province\'s health plan', 'Ask a settlement worker if you are not sure which applies'],
    minutes: 10,
    sourceIds: ['ircc-claimants', '211-canada', 'ontario-ohip'],
    caution: 'Coverage depends on your status. Startline cannot tell you which program you qualify for.',
  },
  sin: {
    id: 'sin',
    title: 'Apply for a Social Insurance Number',
    category: 'documents',
    categoryLabel: 'Documents',
    summary: 'You need a Social Insurance Number to work in Canada. Service Canada explains how to apply and which documents to bring.',
    appliesTo: 'People who are allowed to work in Canada.',
    prepare: ['Your immigration documents', 'A work permit if you have one'],
    actions: ['Check which documents Service Canada accepts for your situation', 'Apply online or at a Service Canada office'],
    minutes: 15,
    sourceIds: ['service-canada-sin'],
  },
  'money-help': {
    id: 'money-help',
    title: 'Ask about financial support',
    category: 'money',
    categoryLabel: 'Money',
    summary: 'Each province runs its own financial assistance program, such as Ontario Works. A caseworker decides who qualifies.',
    appliesTo: 'People who need help paying for food and housing.',
    prepare: ['Your immigration documents', 'Your address, if you have one', 'Details of any income you have'],
    actions: ["Read how your province's program decides eligibility", 'Contact your local social assistance office', 'Ask a settlement worker to help with the application'],
    minutes: 25,
    sourceIds: ['211-canada', 'ontario-works', 'region-waterloo'],
    caution: 'Only a caseworker can tell you whether you qualify.',
  },
  'settlement-worker': {
    id: 'settlement-worker',
    title: 'Meet a settlement worker',
    category: 'community',
    categoryLabel: 'Support',
    summary: 'A settlement worker can help with forms, housing, school and finding services. Local agencies offer this for free.',
    appliesTo: 'Newcomers anywhere in Canada. Each agency has its own eligibility rules.',
    prepare: ['A list of your questions', 'Your immigration documents'],
    actions: ['Search the IRCC services finder for free agencies near you', 'Contact a local agency to book a first meeting'],
    minutes: 15,
    sourceIds: ['ircc-services', 'kitchener-settlement', 'reception-house', 'kwmc'],
  },
  'english-classes': {
    id: 'english-classes',
    title: 'Find English or French classes',
    category: 'language',
    categoryLabel: 'Language',
    summary: 'Free English and French classes are offered across Canada. Some are only for certain immigration statuses, so check before you sign up.',
    appliesTo: 'Anyone who wants to learn English or French. Eligibility varies by class.',
    prepare: ['Your immigration documents'],
    actions: ['Search the IRCC services finder for classes near you', 'Ask a settlement worker which classes are open to you'],
    minutes: 10,
    sourceIds: ['ircc-services', 'kwmc'],
  },
  'school-registration': {
    id: 'school-registration',
    title: 'Register your children for school',
    category: 'school',
    categoryLabel: 'School',
    summary: 'School is free for children in Canada. 211 and a settlement worker can help you find your local school board and register.',
    appliesTo: 'Families with school-age children.',
    prepare: ['Your children\'s birth dates', 'Any school records you have', 'Your address'],
    actions: ['Find your local school board through 211', 'Ask a settlement worker to help with registration'],
    minutes: 20,
    sourceIds: ['211-canada', '211-ontario', 'kitchener-settlement'],
  },
  'know-rights': {
    id: 'know-rights',
    title: 'Know your rights as a claimant',
    category: 'legal',
    categoryLabel: 'Legal help',
    summary: 'IRCC lists the rights refugee claimants have while their claim is processed, and where to get help.',
    appliesTo: 'Refugee claimants.',
    prepare: [],
    actions: ['Read the IRCC rights page', 'Save the contacts it lists'],
    minutes: 10,
    sourceIds: ['ircc-rights'],
  },
};

// Labels and icons follow the v3.1 onboarding frames (OB03 to OB06).
export const PRIORITY_OPTIONS: { id: Priority; label: string; icon: string }[] = [
  { id: 'housing', label: 'Housing', icon: 'home' },
  { id: 'legal', label: 'Legal help', icon: 'file-text' },
  { id: 'health', label: 'Health care', icon: 'heart' },
  { id: 'money', label: 'Work & money', icon: 'briefcase' },
  { id: 'language', label: 'Language classes', icon: 'message-square' },
  { id: 'school', label: 'School & childcare', icon: 'book-open' },
  { id: 'community', label: 'Community', icon: 'users' },
];

export const STATUS_OPTIONS: { id: Status; label: string; helper: string; icon: string }[] = [
  { id: 'claimant', label: 'Refugee claimant', helper: 'Waiting for a decision on your claim', icon: 'file-text' },
  { id: 'protected', label: 'Protected person', helper: 'Your claim was accepted', icon: 'shield' },
  { id: 'resettled', label: 'Resettled refugee', helper: 'You came through resettlement', icon: 'globe' },
  { id: 'other', label: 'Another status', helper: 'Work, study, sponsorship or other', icon: 'briefcase' },
  { id: 'unsure', label: 'Not sure, or rather not say', helper: "You'll still get a general plan", icon: 'help-circle' },
];

export const HOUSEHOLD_OPTIONS: { id: HouseholdMember; label: string; helper: string; icon: string }[] = [
  { id: 'partner', label: 'Partner or spouse', helper: 'Married or common-law', icon: 'users' },
  { id: 'children', label: 'Children', helper: 'Under 18 and living with you', icon: 'user-plus' },
  { id: 'other', label: 'Other family or dependants', helper: 'Parents, relatives or others you support', icon: 'heart' },
];

