import { IconName } from '@/components/ui';

// Documents a step may need. Sample content: requirements depend on the
// person's situation and the service, so every item must be confirmed with
// the provider before launch (see LAUNCH_CHECKLIST.md).
export type DocumentLevel = 'Required' | 'Recommended' | 'Helpful';

export interface DocumentGuide {
  id: string;
  title: string;
  helper: string;
  why: string;
  ifMissing: string;
  level: DocumentLevel;
  icon: IconName;
}

export const DOCUMENT_GUIDES: DocumentGuide[] = [
  {
    id: 'claimant',
    title: 'Refugee Protection Claimant Document',
    helper: 'Often called the brown paper',
    why: 'Some services ask to see it.',
    ifMissing: 'If you don’t have it yet, ask the service what to bring instead.',
    level: 'Recommended',
    icon: 'file-text',
  },
  {
    id: 'photo-id',
    title: 'Photo ID',
    helper: 'Passport or other ID, if you have one',
    why: 'Helps a service know who they’re helping.',
    ifMissing: 'If you don’t have one, ask what they accept.',
    level: 'Recommended',
    icon: 'user',
  },
  {
    id: 'letters',
    title: 'Letters about your claim or housing',
    helper: 'Any you already have',
    why: 'Keeps names, dates and reference details in one place when you talk to someone.',
    ifMissing: 'You can still go without them.',
    level: 'Helpful',
    icon: 'file-text',
  },
];

// Details read from a document photo, or typed in. Used once to tailor the
// step, then dropped. Never written to storage, logs or an account.
export interface DocumentDetails {
  name: string;
  uci: string;
  expiry: string;
}

export const SAMPLE_READ: DocumentDetails & { unsure: (keyof DocumentDetails)[] } = {
  name: 'Kelvin Mwangi',
  uci: '0000-4821',
  expiry: '14 March 2028',
  unsure: ['expiry'],
};

export function maskId(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 4) return value;
  return `•••• ${digits.slice(-4)}`;
}
