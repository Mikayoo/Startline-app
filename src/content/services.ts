import { PHOTO } from './photos';
import { Priority } from './steps';

// Local services shown in Resources. Sample content: names are real
// organizations in Waterloo Region, but details have not been reviewed with
// them yet. Every service is labelled "Sample" in the app until it is.
export interface Service {
  id: string;
  name: string;
  short: string;
  subtitle: string;
  summary: string;
  topics: (Priority | 'work')[];
  tags: string[];
  modes: ('phone' | 'online' | 'in-person')[];
  free: boolean;
  url?: string;
  sourceId?: string;
  photo: number;
  howItHelps: string;
  goodToKnow: { title: string; text: string }[];
}

export const SERVICES: Service[] = [
  {
    id: '211-ontario',
    name: '211 Ontario',
    short: '211',
    subtitle: 'Community services and referrals',
    summary: 'A starting point for housing, food and everyday support. Check language, cost and access before you travel.',
    topics: ['housing', 'health', 'money', 'community'],
    tags: ['Free', 'Phone & online'],
    modes: ['phone', 'online'],
    free: true,
    url: 'https://211ontario.ca/',
    sourceId: '211-ontario',
    photo: PHOTO.library,
    howItHelps: 'Talk through housing, food or other community support needs, and find programs near you.',
    goodToKnow: [
      { title: 'When to contact', text: 'Check current hours on the website before you call.' },
      { title: "Who it's for", text: 'Anyone in Ontario looking for community or social services.' },
      { title: 'Where', text: 'No visit needed. Call 2-1-1 or use the website.' },
    ],
  },
  {
    id: 'kpl',
    name: 'Kitchener Public Library',
    short: 'KPL',
    subtitle: 'Settlement workers · Free',
    summary: 'Check locations and languages before you go.',
    topics: ['language', 'community'],
    tags: ['In person', 'Free'],
    modes: ['in-person'],
    free: true,
    url: 'https://www.kpl.org/',
    photo: PHOTO.library,
    howItHelps: 'Ask about settlement workers, language programs and free computer and internet access.',
    goodToKnow: [
      { title: 'When to go', text: 'Check branch hours and which days a settlement worker is in.' },
      { title: "Who it's for", text: 'Anyone can visit. Ask at the front desk about getting a library card.' },
    ],
  },
  {
    id: 'legal-aid',
    name: 'Legal Aid Ontario',
    short: 'LAO',
    subtitle: 'Refugee and immigration law',
    summary: 'Free legal help for people who qualify, including help with refugee claims.',
    topics: ['legal'],
    tags: ['Check eligibility'],
    modes: ['phone', 'online'],
    free: true,
    url: 'https://www.legalaid.on.ca/',
    photo: PHOTO.dropin,
    howItHelps: 'Find out if you qualify for a legal aid certificate or other free legal help.',
    goodToKnow: [
      { title: 'Before you call', text: 'Have your claim documents and any dates from letters ready.' },
      { title: "Who it's for", text: 'People with low income who need legal help. Eligibility applies.' },
    ],
  },
  {
    id: 'kwmc',
    name: 'KW Multicultural Centre',
    short: 'KWMC',
    subtitle: 'Settlement and interpretation',
    summary: 'Check services and languages before you visit.',
    topics: ['community', 'language', 'money'],
    tags: ['In person'],
    modes: ['in-person', 'phone'],
    free: true,
    url: 'https://kwmulticultural.ca/',
    sourceId: 'kwmc',
    photo: PHOTO.circle,
    howItHelps: 'Settlement support, interpretation and help connecting with programs in Waterloo Region.',
    goodToKnow: [{ title: 'Before you go', text: 'Call ahead to ask which services and languages are available that day.' }],
  },
  {
    id: 'reception-house',
    name: 'Reception House Waterloo Region',
    short: 'RH',
    subtitle: 'Support for refugees',
    summary: 'Contact them to confirm which services are open to you.',
    topics: ['housing', 'community'],
    tags: ['In person'],
    modes: ['in-person', 'phone'],
    free: true,
    url: 'https://www.receptionhouse.ca/',
    sourceId: 'reception-house',
    photo: PHOTO.family,
    howItHelps: 'Support for refugees settling in Waterloo Region.',
    goodToKnow: [{ title: 'Before you go', text: 'Services differ by status. Ask what is open to you before you visit.' }],
  },
];

export const SERVICE_TOPICS: { id: Service['topics'][number] | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'housing', label: 'Housing' },
  { id: 'legal', label: 'Legal' },
  { id: 'health', label: 'Health' },
  { id: 'money', label: 'Work & money' },
  { id: 'language', label: 'Language' },
  { id: 'community', label: 'Community' },
];

export function getService(id: string) {
  return SERVICES.find((s) => s.id === id);
}
