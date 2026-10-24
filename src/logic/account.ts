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
