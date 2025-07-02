/// <reference types="vite/client" />

// It is to define types for environment variables in a Vite project.
interface ImportMetaEnv {
  readonly VITE_EXPLORER_BASE_URL: string
  // add more env vars here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}


