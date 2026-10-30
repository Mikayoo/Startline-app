import { describe, expect, it } from '@jest/globals';
import { SOURCES } from '@/content/sources';
import { ask } from '@/logic/answer';

describe('ask', () => {
  it('answers from the source register and cites the source', () => {
    const r = ask('How do I apply for a SIN?');
    expect(r.kind).toBe('answer');
    if (r.kind !== 'answer') return;
    expect(r.citations[0].sourceId).toBe('service-canada-sin');
    expect(r.citations[0].url).toMatch(/^https:\/\/www\.canada\.ca\//);
  });

  it('marks citations as not reviewed while sources are drafts', () => {
    const r = ask('Where can I get a health card?');
    expect(r.kind).toBe('answer');
    if (r.kind === 'answer') expect(r.citations.every((c) => !c.reviewed)).toBe(true);
  });

  it('only returns text that exists in a source passage', () => {
    const r = ask('Where can I find a shelter tonight?');
    expect(r.kind).toBe('answer');
    if (r.kind !== 'answer') return;
    const passages = SOURCES.flatMap((s) => s.passages.map((p) => p.text));
    for (const part of r.text.split('\n\n')) expect(passages).toContain(part);
  });

  it('says it cannot verify questions outside the library', () => {
    expect(ask('What is the best restaurant in town?').kind).toBe('unsupported');
  });

  it('sends urgent questions to emergency help first', () => {
    const r = ask('I am in danger, what do I do');
    expect(r.kind).toBe('urgent');
    expect(r.text).toMatch(/911/);
  });

  it('hands personal case questions to a person', () => {
    expect(ask('Am I eligible for Ontario Works?').kind).toBe('personal');
    expect(ask('My claim was refused, what now?').kind).toBe('personal');
  });

  it('never answers from a withdrawn source', () => {
    const withdrawn = SOURCES.map((s) => (s.id === 'service-canada-sin' ? { ...s, reviewStatus: 'withdrawn' as const } : s));
    const r = ask('How do I apply for a SIN?', withdrawn);
    if (r.kind === 'answer') expect(r.citations.map((c) => c.sourceId)).not.toContain('service-canada-sin');
  });

  it('treats having nowhere safe to sleep as urgent', () => {
    expect(ask('I am being evicted tomorrow and have nowhere to sleep').kind).toBe('urgent');
    expect(ask('I have nowhere to sleep tonight').kind).toBe('urgent');
    expect(ask('We are sleeping in the car').kind).toBe('urgent');
    expect(ask('my husband hits me').kind).toBe('urgent');
  });

  it('never predicts the outcome of a claim', () => {
    expect(ask('Will my refugee claim be accepted?').kind).toBe('personal');
    expect(ask('Is my claim going to be approved?').kind).toBe('personal');
    expect(ask('What are my chances at the hearing?').kind).toBe('personal');
    expect(ask('My landlord is evicting me').kind).toBe('personal');
  });

  it('still answers ordinary questions', () => {
    expect(ask('How do I get a health card?').kind).toBe('answer');
    expect(ask('Where can I find a shelter?').kind).not.toBe('personal');
  });

  it('does not answer off-topic questions just because they name a city', () => {
    expect(ask('Best pizza in Waterloo?').kind).toBe('unsupported');
    expect(ask('Settlement services in Waterloo').kind).toBe('answer');
  });
});
