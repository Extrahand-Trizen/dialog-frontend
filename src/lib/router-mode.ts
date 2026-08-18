/**
 * Hash routing is required on MinIO / static object hosts (no SPA path fallback).
 * Enable via VITE_ROUTER_MODE=hash at build time, or runtime host/path heuristics.
 */
export function shouldUseHashRouter(): boolean {
  const mode = String(import.meta.env.VITE_ROUTER_MODE || '')
    .trim()
    .toLowerCase();
  if (mode === 'hash') return true;
  if (mode === 'browser' || mode === 'history') return false;

  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  const path = window.location.pathname;
  return (
    host.includes('frontend-builds') ||
    host.includes('minio') ||
    host.endsWith('.apps.extrahand.in') ||
    path.includes('/frontend-builds/') ||
    path.includes('/trizendialog-frontend/')
  );
}
