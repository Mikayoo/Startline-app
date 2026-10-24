// Masks a phone number or email so only enough shows to recognize it.
export function maskContact(contact?: { kind: 'phone' | 'email'; value: string }) {
  if (!contact) return '';
  if (contact.kind === 'email') {
    const [user, domain] = contact.value.split('@');
    return `${user.slice(0, 1)}•••••@${domain ?? ''}`;
  }
  const digits = contact.value.replace(/\D/g, '');
  return `(${digits.slice(0, 3)}) ••• ••${digits.slice(-2)}`;
}

// Phone numbers sit after a fixed "CA +1", so they are exactly 10 digits:
// a 3-digit area code (not starting with 0 or 1) and a 7-digit number.
export function phoneDigits(input: string) {
  return input.replace(/\D/g, '').slice(0, 10);
}

export function formatPhone(input: string) {
  const d = phoneDigits(input);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function isValidPhone(input: string) {
  const all = input.replace(/\D/g, '');
  return all.length === 10 && /^[2-9]\d{2}[2-9]/.test(all);
}

export function isValidEmail(input: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.trim());
}
