/** Presentation-independent boundary rules shared by component controls. */
export function normalizeProgress(value: number, maximum: number) {
  const max = Number.isFinite(maximum) && maximum > 0 ? maximum : 100;
  const bounded = Number.isFinite(value) ? Math.max(0, Math.min(value, max)) : 0;
  return { value: bounded, max, percent: Math.round((bounded / max) * 100) };
}
export function tabDestination(key: string, selected: number, count: number): number | null {
  if (count < 1) return null;
  if (key === 'ArrowRight') return (selected + 1) % count;
  if (key === 'ArrowLeft') return (selected - 1 + count) % count;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return null;
}
