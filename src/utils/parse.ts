export function parseAmount(value: string): number | null {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (!Number.isInteger(n)) return null;
  return n;
}
