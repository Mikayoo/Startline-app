import { describe, expect, it } from '@jest/globals';

import { servicesHere } from '@/content/services';
import { appliesHere, getSource } from '@/content/sources';

describe('where things apply', () => {
  it('shows Waterloo Region services only to people there', () => {
    const kw = servicesHere('ON', 'Kitchener').map((s) => s.id);
    const vancouver = servicesHere('BC', 'Vancouver').map((s) => s.id);
    expect(kw).toEqual(expect.arrayContaining(['211-canada', '211-ontario', 'kpl', 'kwmc']));
    expect(vancouver).toEqual(['211-canada']);
  });

  it('shows Ontario-wide services anywhere in Ontario', () => {
    expect(servicesHere('ON', 'Ottawa').map((s) => s.id)).toEqual(expect.arrayContaining(['211-ontario', 'legal-aid']));
    expect(servicesHere('ON', 'Ottawa').map((s) => s.id)).not.toContain('kpl');
  });

  it('filters sources the same way', () => {
    const ohip = getSource('ontario-ohip')!;
    expect(appliesHere(ohip, 'ON', 'Toronto')).toBe(true);
    expect(appliesHere(ohip, 'QC', 'Montréal')).toBe(false);
    expect(appliesHere(ohip, null, null)).toBe(true);
  });
});
