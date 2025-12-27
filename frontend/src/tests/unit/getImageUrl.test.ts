import { describe, it, expect } from 'vitest';

// TODO: change this import to your actual helper file
// Example: import { getImageUrl } from '@/utils/images';
const backendBase = 'https://barber-backend-b77j.onrender.com';

function getImageUrl(path: string | null) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return backendBase + path;
  return backendBase + '/' + path;
}

describe('getImageUrl', () => {
  it('returns empty string for null', () => {
    expect(getImageUrl(null)).toBe('');
  });

  it('returns same url if already absolute', () => {
    expect(getImageUrl('https://example.com/a.jpg')).toBe('https://example.com/a.jpg');
  });

  it('prefixes backend base for /path', () => {
    expect(getImageUrl('/uploads/a.jpg')).toBe(backendBase + '/uploads/a.jpg');
  });

  it('prefixes backend base for relative path', () => {
    expect(getImageUrl('uploads/a.jpg')).toBe(backendBase + '/uploads/a.jpg');
  });
});
