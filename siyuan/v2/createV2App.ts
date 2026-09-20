/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createPinia } from "pinia"
import { createApp } from "vue"
import { createI18n } from "vue-i18n"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "~/src/assets/v2/base.styl"
import V2App from "~/src/components/v2/V2App.vue"
import type { V2CurrentView } from "~/src/components/v2/layout/UnifiedWorkspaceShell.vue"
import { V2_I18N_FALLBACK_KEY } from "~/src/composables/v2/useV2I18n.ts"
import type { V2SettingsSection } from "~/src/composables/v2/useV2Settings.ts"

export type V2InitialView = V2CurrentView

interface CreateV2AppOptions {
  initialView?: V2InitialView
  /** 初始设置分区，缺省「账号设置」 */
  initialSection?: V2SettingsSection
  /** 指定当前文档 id；缺省由 V2 自行取活动文档 */
  docId?: string
  /** 进入快速发布后立即对该平台执行发布（文档块菜单「快速发布 → 平台」的一键入口） */
  autoPublishPlatformKey?: string
  locale?: string
  messages?: Record<string, any>
  fallbackResolve?: (key: string) => string | undefined
  onClose?: () => void
}

export const createV2VueApp = (options: CreateV2AppOptions = {}) => {
  const locale = options.locale ?? "plugin"
  const messages = options.messages ?? {
    [locale]: {},
  }

  const app = createApp(V2App, {
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
  app.provide(V2_I18N_FALLBACK_KEY, {
    resolve: options.fallbackResolve ?? (() => undefined),
  })

  return app
}
