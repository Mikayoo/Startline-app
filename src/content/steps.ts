// Plan step library. Each step is written to explain, not to decide
// eligibility: `appliesTo` says who the step is usually for and every step
// links to the sources a reviewer must approve before the pilot.

export type Priority = 'housing' | 'legal' | 'health' | 'money' | 'language' | 'school' | 'community';

export type Status = 'claimant' | 'protected' | 'resettled' | 'unsure';

export type Household = 'alone' | 'partner' | 'children';

export type Municipality = 'kitchener' | 'waterloo' | 'cambridge' | 'elsewhere';

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
    summary: 'If you have nowhere safe to sleep tonight, start here. Regional services and 211 can point you to shelters and housing help in Waterloo Region.',
    appliesTo: 'Anyone who needs somewhere to stay, whatever their status.',
    prepare: ['Any ID or immigration papers you have', 'A phone number where you can be reached'],
    actions: ['Call 2-1-1 or search 211 Ontario for shelters near you', 'Ask the Region of Waterloo about housing help', 'Tell a settlement worker if you are staying somewhere unsafe'],
    minutes: 20,
    sourceIds: ['211-ontario', 'region-waterloo'],
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
    summary: 'Which health coverage you have depends on your status. Some refugee claimants are covered by the Interim Federal Health Program. Others may qualify for OHIP.',
    appliesTo: 'Everyone. What applies to you depends on your status.',
    prepare: ['Your immigration documents', 'Any health coverage papers you were given'],
    actions: ['Read what the Interim Federal Health Program covers', 'Check whether you can apply for OHIP', 'Ask a settlement worker if you are not sure which applies'],
    minutes: 10,
    sourceIds: ['ircc-claimants', 'ontario-ohip'],
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
    summary: 'Ontario Works is the province\'s financial assistance program. A caseworker decides who qualifies.',
    appliesTo: 'People who need help paying for food and housing.',
    prepare: ['Your immigration documents', 'Your address, if you have one', 'Details of any income you have'],
    actions: ['Read how Ontario Works decides eligibility', 'Contact the Region of Waterloo social assistance office', 'Ask a settlement worker to help with the application'],
    minutes: 25,
    sourceIds: ['ontario-works', 'region-waterloo'],
    caution: 'Only a caseworker can tell you whether you qualify.',
  },
  'settlement-worker': {
    id: 'settlement-worker',
    title: 'Meet a settlement worker',
    category: 'community',
    categoryLabel: 'Support',
    summary: 'A settlement worker can help with forms, housing, school and finding services. Local agencies offer this for free.',
    appliesTo: 'Newcomers in Waterloo Region. Each agency has its own eligibility rules.',
    prepare: ['A list of your questions', 'Your immigration documents'],
    actions: ['Look at the City of Kitchener settlement directory', 'Contact a local agency to book a first meeting'],
    minutes: 15,
    sourceIds: ['kitchener-settlement', 'reception-house', 'kwmc'],
  },
  'english-classes': {
    id: 'english-classes',
    title: 'Find English classes',
    category: 'language',
    categoryLabel: 'Language',
    summary: 'Free English classes are offered in Waterloo Region. Some are only for certain immigration statuses, so check before you sign up.',
    appliesTo: 'Anyone who wants to improve their English. Eligibility varies by class.',
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
    summary: 'Children in Ontario go to school. 211 Ontario and a settlement worker can help you find your local school board and register.',
    appliesTo: 'Families with school-age children.',
    prepare: ['Your children\'s birth dates', 'Any school records you have', 'Your address'],
    actions: ['Find your local school board through 211 Ontario', 'Ask a settlement worker to help with registration'],
    minutes: 20,
    sourceIds: ['211-ontario', 'kitchener-settlement'],
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

export const PRIORITY_OPTIONS: { id: Priority; label: string; helper: string; icon: string }[] = [
  { id: 'housing', label: 'A safe place to stay', helper: 'Shelter and housing help', icon: 'home' },
  { id: 'legal', label: 'My refugee claim', helper: 'Forms, deadlines, legal help', icon: 'file-text' },
  { id: 'health', label: 'Health care', helper: 'Coverage and seeing a doctor', icon: 'heart' },
  { id: 'money', label: 'Money and work', helper: 'Financial support, SIN, jobs', icon: 'briefcase' },
  { id: 'language', label: 'Learning English', helper: 'Free classes near you', icon: 'message-circle' },
  { id: 'school', label: 'School for my children', helper: 'Finding and registering', icon: 'book-open' },
  { id: 'community', label: 'Meeting people', helper: 'Support and community', icon: 'users' },
];

export const STATUS_OPTIONS: { id: Status; label: string; helper: string }[] = [
  { id: 'claimant', label: 'I made a refugee claim in Canada', helper: 'Or I plan to make one' },
  { id: 'protected', label: 'I was accepted as a refugee', helper: 'Protected person' },
  { id: 'resettled', label: 'I came as a resettled refugee', helper: 'Government or privately sponsored' },
  { id: 'unsure', label: 'I am not sure or prefer not to say', helper: 'You will see general steps' },
];

export const HOUSEHOLD_OPTIONS: { id: Household; label: string; icon: string }[] = [
  { id: 'alone', label: 'Just me', icon: 'user' },
  { id: 'partner', label: 'Me and a partner or adult family', icon: 'users' },
  { id: 'children', label: 'Me with children', icon: 'smile' },
];

export const MUNICIPALITY_OPTIONS: { id: Municipality; label: string }[] = [
  { id: 'kitchener', label: 'Kitchener' },
  { id: 'waterloo', label: 'Waterloo' },
  { id: 'cambridge', label: 'Cambridge' },
  { id: 'elsewhere', label: 'Somewhere else in Ontario' },
];
