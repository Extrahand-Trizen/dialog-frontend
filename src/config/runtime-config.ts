export type RuntimeConfig = {
  /** Preferred key in runtime-config.js (CapRover / MinIO). */
  NEXT_PUBLIC_API_URL?: string;
  /** Legacy key — still supported. */
  VITE_API_URL?: string;
};

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

const DEFAULT_API_URL = 'http://localhost:4010/api/v1';

export function getRuntimeConfig(): Readonly<RuntimeConfig> {
  return window.__RUNTIME_CONFIG__ ?? {};
}

/**
 * API base URL resolution (first match wins):
 * 1. runtime-config.js (container / ops override)
 * 2. process.env.NEXT_PUBLIC_API_URL (baked at build from CI Variable)
 * 3. import.meta.env.VITE_API_URL / NEXT_PUBLIC_API_URL (Vite)
 * 4. localhost default for local-only fallback
 */
export function getApiBaseUrl(): string {
  const runtime = getRuntimeConfig();
  const runtimeUrl = (runtime.NEXT_PUBLIC_API_URL || runtime.VITE_API_URL)?.trim();
  if (runtimeUrl) {
    return runtimeUrl;
  }

  const nextPublic = String(process.env.NEXT_PUBLIC_API_URL ?? '').trim();
  if (nextPublic) {
    return nextPublic;
  }

  const viteUrl =
    import.meta.env.NEXT_PUBLIC_API_URL?.trim() ||
    import.meta.env.VITE_API_URL?.trim();
  if (viteUrl) {
    return viteUrl;
  }

  return DEFAULT_API_URL;
}
