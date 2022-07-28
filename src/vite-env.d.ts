/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_LOG_INFO_ENABLED: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}