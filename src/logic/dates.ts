export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Builds YYYY-MM-DD from separate parts, or null if the date doesn't exist.
export function toIsoDate(day: string, month: number | null, year: string): string | null {
  const d = Number(day);
  const y = Number(year);
  if (month === null || !Number.isInteger(d) || !/^\d{4}$/.test(year) || d < 1) return null;
  const date = new Date(Date.UTC(y, month, d));
  if (date.getUTCMonth() !== month || date.getUTCDate() !== d) return null;
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1].slice(0, 3)} ${d}, ${y}`;
}

export function daysUntil(iso: string, today = new Date()): number {
  const [y, m, d] = iso.split('-').map(Number);
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((Date.UTC(y, m - 1, d) - start) / 86400000);
}

export function whenLabel(iso: string, today = new Date()): string {
  const n = daysUntil(iso, today);
  if (n === 0) return 'Today';
  if (n === 1) return 'Tomorrow';
  if (n > 1) return `In ${n} days`;
  return n === -1 ? 'Yesterday' : `${-n} days ago`;
}
