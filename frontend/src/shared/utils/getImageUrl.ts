export function getImageUrl(path?: string | null) {
  if (!path) return '';

  // already absolute
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const base = import.meta.env.VITE_API_URL || '';
  const p = path.startsWith('/') ? path : `/${path}`;

  // if base missing, keep relative
  return base ? `${base}${p}` : p;
}
