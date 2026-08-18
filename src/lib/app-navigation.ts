import { shouldUseHashRouter } from '@/lib/router-mode';

function normalizeAppPath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return '/';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function hashPathFor(path: string): string {
  const normalized = normalizeAppPath(path);
  return normalized === '/' ? '#/' : `#${normalized}`;
}

export function isOnAppPath(path: string): boolean {
  const normalized = normalizeAppPath(path);
  if (shouldUseHashRouter()) {
    const hash = window.location.hash || '#/';
    const current = hash.startsWith('#') ? hash.slice(1) : hash;
    const currentPath = current.split('?')[0] || '/';
    return currentPath === normalized;
  }
  return window.location.pathname === normalized;
}

/** Full-page navigation that works on MinIO (hash) and CapRover/nginx (browser history). */
export function redirectToAppPath(path: string): void {
  const normalized = normalizeAppPath(path);
  if (shouldUseHashRouter()) {
    window.location.hash = hashPathFor(normalized);
    return;
  }
  window.location.assign(normalized);
}
