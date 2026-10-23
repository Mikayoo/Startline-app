import { describe, expect, it } from '@jest/globals';
import { STEPS } from '@/content/steps';
import { getSource } from '@/content/sources';
import { buildPlan, MAX_PRIORITIES, Profile, RULES_VERSION } from '@/logic/plan';

const base: Profile = { language: 'en', municipality: 'kitchener', household: null, status: null, priorities: [] };

describe('buildPlan', () => {
  it('gives the same plan for the same answers', () => {
    const profile: Profile = { ...base, status: 'claimant', priorities: ['health', 'housing'] };
    expect(buildPlan(profile)).toEqual(buildPlan({ ...profile }));
  });

  it('always includes health coverage and a settlement worker', () => {
    const ids = buildPlan(base).steps.map((s) => s.step.id);
    expect(ids).toEqual(expect.arrayContaining(['health-cover', 'settlement-worker']));
  });

  it('puts housing first when it is a priority', () => {
    const plan = buildPlan({ ...base, priorities: ['language', 'housing'] });
    expect(plan.steps[0].step.id).toBe('safe-place');
    expect(plan.steps[0].stage).toBe('now');
  });

  it('adds legal help for refugee claimants even without the legal priority', () => {
    const plan = buildPlan({ ...base, status: 'claimant', priorities: ['health'] });
    const legal = plan.steps.find((s) => s.step.id === 'legal-help');
    expect(legal?.reason).toMatch(/deadlines/);
    expect(legal?.stage).toBe('now');
  });

  it('does not add claimant steps when status is skipped', () => {
    const ids = buildPlan({ ...base, priorities: ['health'] }).steps.map((s) => s.step.id);
    expect(ids).not.toContain('know-rights');
  });

  it('adds school registration for families with children', () => {
    const ids = buildPlan({ ...base, household: 'children' }).steps.map((s) => s.step.id);
    expect(ids).toContain('school-registration');
  });

  it('puts chosen priorities ahead of suggested steps', () => {
    const plan = buildPlan({ ...base, priorities: ['language'] });
    const ids = plan.steps.map((s) => s.step.id);
    expect(ids.indexOf('english-classes')).toBeLessThan(ids.indexOf('settlement-worker'));
  });

  it('only uses the first priorities up to the limit', () => {
    const plan = buildPlan({ ...base, priorities: ['housing', 'health', 'money', 'language'] });
    expect(plan.steps.map((s) => s.step.id)).not.toContain('english-classes');
    expect(MAX_PRIORITIES).toBe(3);
  });

  it('has no duplicate steps and groups them as now, soon, later', () => {
    const plan = buildPlan({ ...base, status: 'claimant', household: 'children', priorities: ['housing', 'legal', 'money'] });
    const ids = plan.steps.map((s) => s.step.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(plan.steps.filter((s) => s.stage === 'now')).toHaveLength(3);
    const order = { now: 0, soon: 1, later: 2 };
    const stages = plan.steps.map((s) => order[s.stage]);
    expect([...stages].sort()).toEqual(stages);
  });

  it('flags people outside the pilot area', () => {
    expect(buildPlan({ ...base, municipality: 'elsewhere' }).inPilotArea).toBe(false);
    expect(buildPlan({ ...base, municipality: 'cambridge' }).inPilotArea).toBe(true);
  });

  it('records the rules version', () => {
    expect(buildPlan(base).rulesVersion).toBe(RULES_VERSION);
  });
});

describe('content', () => {
  it('links every step to sources that exist', () => {
    for (const step of Object.values(STEPS)) {
      expect(step.sourceIds.length).toBeGreaterThan(0);
      for (const id of step.sourceIds) expect(getSource(id)).toBeDefined();
    }
  });
});
