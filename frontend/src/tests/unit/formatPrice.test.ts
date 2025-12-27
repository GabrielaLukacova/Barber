import { describe, it, expect } from 'vitest';

function formatPrice(price: number) {
  return `${price} kr`;
}

describe('formatPrice', () => {
  it('formats integer', () => {
    expect(formatPrice(100)).toBe('100 kr');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('0 kr');
  });

  it('formats decimal', () => {
    expect(formatPrice(99.5)).toBe('99.5 kr');
  });
});
