import { Passage, Source, SOURCES } from '@/content/sources';

// Ask Startline, demo mode. Answers are built only from passages in the
// source register; nothing is generated. The production answer service will
// run on a server, use the same retrieval step to pick passages and the same
// safety checks below, and only then ask a model to phrase the answer.

export interface Citation {
  sourceId: string;
  title: string;
  publisher: string;
  url: string;
  lastChecked: string | null;
  reviewed: boolean;
}

export type AnswerResult =
  | { kind: 'answer'; text: string; citations: Citation[] }
  | { kind: 'urgent'; text: string }
  | { kind: 'personal'; text: string }
  | { kind: 'unsupported'; text: string };

const URGENT = [
  /\b911\b/,
  /\bemergency\b/,
  /\bin danger\b/,
  /\b(hurt|kill|harm)(ing)? (my ?self|me)\b/,
  /\bsuicid/,
  /\bnot safe\b/,
  /\bunsafe\b/,
  /\bviolence\b/,
  /\babuse/,
];

// Questions about one person's own case: the app explains, a person decides.
const PERSONAL = [
  /\b(am i|will i|can i still|do i) (eligible|qualify|get accepted|be accepted|be deported)\b/,
  /\bmy (claim|case|hearing) (was|got|is) (refused|rejected|denied)\b/,
  /\b(refused|rejected|denied)\b.*\b(claim|case)\b/,
  /\bdeport/,
  /\bremoval order\b/,
  /\bappeal\b/,
  /\bshould i\b/,
];

const STOP = new Set(
  'a an and are as at be can do does for from get have how i if in is it me my of on or the to what when where which who why will with you your'.split(' '),
);

export function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

const MIN_SCORE = 2;

function score(passage: Passage, words: string[]): number {
  const keys = new Set(passage.keywords);
  let total = 0;
  for (const w of words) {
    if (keys.has(w)) total += 2;
    else if (w.length > 4 && passage.keywords.some((k) => k.startsWith(w.slice(0, 5)))) total += 1;
  }
  return total;
}

function cite(source: Source): Citation {
  return {
    sourceId: source.id,
    title: source.title,
    publisher: source.publisher,
    url: source.url,
    lastChecked: source.lastChecked,
    reviewed: source.reviewStatus === 'approved',
  };
}

export function ask(question: string, sources: Source[] = SOURCES): AnswerResult {
  const q = question.toLowerCase();

  if (URGENT.some((re) => re.test(q))) {
    return {
      kind: 'urgent',
      text: 'If you or someone else is in danger right now, call 911. For other urgent help, you can call 2-1-1 at any time. Startline is not an emergency service.',
    };
  }

  if (PERSONAL.some((re) => re.test(q))) {
    return {
      kind: 'personal',
      text: 'This depends on your own situation, so a person needs to look at it. Startline can explain general steps, but it cannot decide your case. A settlement worker can help you find free legal help.',
    };
  }

  const words = tokens(question);
  const ranked = sources
    .filter((s) => s.reviewStatus !== 'withdrawn')
    .flatMap((s) => s.passages.map((p) => ({ source: s, passage: p, score: score(p, words) })))
    .filter((r) => r.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    return {
      kind: 'unsupported',
      text: 'I can\'t answer that from the sources Startline has checked. A settlement worker can help, or you can call 2-1-1.',
    };
  }

  // Use the best passage, plus a second one only if it is nearly as good and
  // comes from a different source.
  const best = ranked[0];
  const picked = [best];
  const second = ranked.find((r) => r.source.id !== best.source.id);
  if (second && second.score >= best.score - 1) picked.push(second);

  return {
    kind: 'answer',
    text: picked.map((r) => r.passage.text).join('\n\n'),
    citations: picked.map((r) => cite(r.source)),
  };
}
