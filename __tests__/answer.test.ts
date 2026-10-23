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
});
