import { describe, expect, it } from '@jest/globals';

import { formatPhone, isValidEmail, isValidPhone, maskContact } from '@/logic/account';

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

describe('phone numbers', () => {
  it('accepts exactly 10 digits', () => {
    expect(isValidPhone('(519) 555-0142')).toBe(true);
  });

  it('rejects more or fewer than 10 digits', () => {
    expect(isValidPhone('51955501420')).toBe(false);
    expect(isValidPhone('519555014')).toBe(false);
  });

  it('rejects area codes and exchanges starting with 0 or 1', () => {
    expect(isValidPhone('1195550142')).toBe(false);
    expect(isValidPhone('5191550142')).toBe(false);
  });

  it('stops typing at 10 digits and formats as you type', () => {
    expect(formatPhone('519555014299')).toBe('(519) 555-0142');
    expect(formatPhone('5195')).toBe('(519) 5');
  });
});

describe('email', () => {
  it('needs a name, an @ and a domain', () => {
    expect(isValidEmail('kelvin@example.com')).toBe(true);
    expect(isValidEmail('kelvin@example')).toBe(false);
    expect(isValidEmail('kelvin example.com')).toBe(false);
  });
});
