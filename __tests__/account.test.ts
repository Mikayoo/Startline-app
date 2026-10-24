import { describe, expect, it } from '@jest/globals';

import { maskContact } from '@/logic/account';

describe('maskContact', () => {
  it('shows only the area code and last two digits of a phone number', () => {
    expect(maskContact({ kind: 'phone', value: '(519) 555-0142' })).toBe('(519) ••• ••42');
  });

  it('shows only the first letter and domain of an email', () => {
    expect(maskContact({ kind: 'email', value: 'kelvin@example.com' })).toBe('k•••••@example.com');
  });

  it('returns nothing without a contact', () => {
    expect(maskContact(undefined)).toBe('');
  });
});
