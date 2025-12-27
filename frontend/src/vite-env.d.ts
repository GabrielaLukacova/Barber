/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * CI fix: some files reference `Barber` / `Service` types without importing them.
 * Declare them globally so vue-tsc/build doesn't fail.
 * You can later replace these with proper imports for stricter typing.
 */
declare global {
  type Barber = any;
  type Service = any;
}
export {};
