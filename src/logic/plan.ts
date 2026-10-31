import { HouseholdMember, Priority, Province, provinceName, STEPS, Status, Step } from '@/content/steps';

// Bump when the rules change, so a saved plan can say which rules made it.
export const RULES_VERSION = '2026-10-23.1';

export interface Profile {
  language: string;
  province: Province | null;
  // null when the city isn't listed or wasn't given
  city: string | null;
  // null until answered; [] means "Just me"
  household: HouseholdMember[] | null;
  status: Status | null;
  priorities: Priority[];
}

export interface PlannedStep {
  step: Step;
  stage: 'now' | 'soon' | 'later';
  reason: string;
}

export interface Plan {
  rulesVersion: string;
  // Sample local agencies only exist for Waterloo Region in the prototype.
  localSamples: boolean;
  steps: PlannedStep[];
}

export const MAX_PRIORITIES = 3;

const SAMPLE_CITIES = ['Kitchener', 'Waterloo', 'Cambridge'];

// Lower number = earlier in the plan. Safety and legal deadlines come first.
const BASE_ORDER: Record<string, number> = {
  'safe-place': 10,
  'legal-help': 20,
  'health-cover': 30,
  'settlement-worker': 40,
  'money-help': 50,
  sin: 60,
  'school-registration': 70,
  'english-classes': 80,
  'know-rights': 90,
};

const PRIORITY_STEPS: Record<Priority, string[]> = {
  housing: ['safe-place'],
  legal: ['legal-help', 'know-rights'],
  health: ['health-cover'],
  money: ['money-help', 'sin'],
  language: ['english-classes'],
  school: ['school-registration'],
  community: ['settlement-worker'],
};

const NOW_COUNT = 3;
const SOON_COUNT = 3;

/**
 * Builds a plan from onboarding answers with fixed rules. No AI is involved,
 * so the same answers always give the same plan and each step can say why
 * it is there.
 */
export function buildPlan(profile: Profile): Plan {
  const reasons = new Map<string, string>();
  const add = (id: string, reason: string) => {
    if (!reasons.has(id)) reasons.set(id, reason);
  };

  const picked = profile.priorities.slice(0, MAX_PRIORITIES);
  for (const priority of picked) {
    for (const id of PRIORITY_STEPS[priority]) add(id, 'You chose this as a priority');
  }

  if (profile.status === 'claimant') {
    add('legal-help', 'Refugee claims have forms and deadlines');
    add('know-rights', 'Useful for everyone with a claim in progress');
  }
  if (profile.household?.includes('children')) {
    add('school-registration', 'You told us you have children with you');
  }
  // Everyone gets these: health coverage and a person to talk to.
  add('health-cover', 'Everyone should know which coverage applies to them');
  add('settlement-worker', 'A settlement worker can help with every other step');

  const pickedSet = new Set(picked.flatMap((p) => PRIORITY_STEPS[p]));
  const ordered = [...reasons.keys()].sort((a, b) => {
    // Chosen priorities move ahead of suggested steps, but housing and legal
    // deadlines keep their place at the front.
    const urgentA = a === 'safe-place' || a === 'legal-help';
    const urgentB = b === 'safe-place' || b === 'legal-help';
    if (urgentA !== urgentB) return urgentA ? -1 : 1;
    const chosenA = pickedSet.has(a);
    const chosenB = pickedSet.has(b);
    if (chosenA !== chosenB) return chosenA ? -1 : 1;
    return BASE_ORDER[a] - BASE_ORDER[b];
  });

  const steps: PlannedStep[] = ordered.map((id, index) => ({
    step: STEPS[id],
    stage: index < NOW_COUNT ? 'now' : index < NOW_COUNT + SOON_COUNT ? 'soon' : 'later',
    reason: reasons.get(id)!,
  }));

  return {
    rulesVersion: RULES_VERSION,
    localSamples: profile.province === 'ON' && profile.city !== null && SAMPLE_CITIES.includes(profile.city),
    steps,
  };
}

// The shortest place name we know: the city, else the province, else Canada.
export function placeLabel(profile: Pick<Profile, 'province' | 'city'>): string {
  return profile.city ?? provinceName(profile.province) ?? 'Canada';
}

export function placeLong(profile: Pick<Profile, 'province' | 'city'>): string {
  const province = provinceName(profile.province);
  if (profile.city && province) return `${profile.city}, ${province}`;
  return province ?? 'Canada';
}
