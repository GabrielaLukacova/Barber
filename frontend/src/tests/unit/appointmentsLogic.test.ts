import { describe, it, expect } from 'vitest';

type Appt = { start: string };

function sortByStartAsc(list: Appt[]) {
  return [...list].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

function isPast(startIso: string, now = new Date()) {
  return new Date(startIso).getTime() < now.getTime();
}

describe('appointments logic', () => {
  it('sorts by start ascending', () => {
    const input = [{ start: '2026-01-02T10:00:00Z' }, { start: '2026-01-01T10:00:00Z' }];
    expect(sortByStartAsc(input).map((x) => x.start)).toEqual([
      '2026-01-01T10:00:00Z',
      '2026-01-02T10:00:00Z',
    ]);
  });

  it('detects past appointment', () => {
    const now = new Date('2026-01-02T10:00:00Z');
    expect(isPast('2026-01-02T09:59:00Z', now)).toBe(true);
  });

  it('detects future appointment', () => {
    const now = new Date('2026-01-02T10:00:00Z');
    expect(isPast('2026-01-02T10:01:00Z', now)).toBe(false);
  });
});
