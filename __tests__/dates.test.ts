import { describe, expect, it } from '@jest/globals';

import { formatDate, toIsoDate, whenLabel } from '@/logic/dates';

describe('dates', () => {
  it('builds a real date', () => {
    expect(toIsoDate('5', 10, '2026')).toBe('2026-11-05');
  });

  it('rejects dates that do not exist', () => {
    expect(toIsoDate('31', 1, '2026')).toBeNull();
    expect(toIsoDate('', 1, '2026')).toBeNull();
    expect(toIsoDate('3', null, '2026')).toBeNull();
    expect(toIsoDate('3', 1, '26')).toBeNull();
  });

  it('formats and describes dates', () => {
    expect(formatDate('2026-11-05')).toBe('Nov 5, 2026');
    const today = new Date(2026, 10, 4);
    expect(whenLabel('2026-11-05', today)).toBe('Tomorrow');
    expect(whenLabel('2026-11-10', today)).toBe('In 6 days');
  });
});
