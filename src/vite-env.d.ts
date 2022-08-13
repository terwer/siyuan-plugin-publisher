/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_LOG_INFO_ENABLED: string
  readonly VITE_SIYUAN_API_URL: string
  readonly VITE_SIYUAN_CONFIG_TOKEN: string
  readonly VITE_SIYUAN_DEV_PAGE_ID: string
  readonly VITE_OPT_PWD: string
  readonly VITE_DEBUG_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}