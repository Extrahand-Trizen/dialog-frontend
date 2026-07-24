/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly NEXT_PUBLIC_API_URL?: string;
  readonly VITE_DEV_MOCK_AUTH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Provided at build time via Vite `define` (from CI NEXT_PUBLIC_API_URL). */
declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
  };
};
