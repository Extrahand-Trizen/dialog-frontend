export type RuntimeConfig = {
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

/** API base URL — runtime config (Docker/CapRover) overrides Vite build-time .env. */
export function getApiBaseUrl(): string {
  const runtimeUrl = getRuntimeConfig().VITE_API_URL?.trim();
  if (runtimeUrl) {
    return runtimeUrl;
  }

  const viteUrl = import.meta.env.VITE_API_URL?.trim();
  if (viteUrl) {
    return viteUrl;
  }

  return DEFAULT_API_URL;
}
