/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createPinia } from "pinia"
import { createApp as createVueApp } from "vue"
import { createI18n } from "vue-i18n"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "~/src/ui/assets/base.styl"
import App from "~/src/ui/components/App.vue"
import type { AppView } from "~/src/ui/components/layout/UnifiedWorkspaceShell.vue"
import { I18N_FALLBACK_KEY } from "~/src/ui/composables/useAppI18n.ts"
import type { SettingsSection } from "~/src/ui/composables/useSettings.ts"

export type InitialView = AppView

interface CreateAppOptions {
  initialView?: InitialView
  /** 初始设置分区，缺省「账号设置」 */
  initialSection?: SettingsSection
  /** 指定当前文档 id；缺省自行取活动文档 */
  docId?: string
  /** 进入快速发布后立即对该平台执行发布（文档块菜单「快速发布 → 平台」的一键入口） */
  autoPublishPlatformKey?: string
  locale?: string
  messages?: Record<string, any>
  fallbackResolve?: (key: string) => string | undefined
  onClose?: () => void
}

export const createApp = (options: CreateAppOptions = {}) => {
  const locale = options.locale ?? "plugin"
  const messages = options.messages ?? {
    [locale]: {},
  }

  const app = createVueApp(App, {
    initialView: options.initialView ?? "quick_publish",
    initialSection: options.initialSection,
    docId: options.docId,
    autoPublishPlatformKey: options.autoPublishPlatformKey,
    onClose: options.onClose,
  })

  app.use(
    createI18n({
      legacy: false,
      locale,
      messages,
    })
  )
  app.use(createPinia())
  app.provide(I18N_FALLBACK_KEY, {
    resolve: options.fallbackResolve ?? (() => undefined),
  })

  return app
}
