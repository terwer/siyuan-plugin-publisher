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
import V2App from "~/src/components/v2/V2App.vue"
import { V2_I18N_FALLBACK_KEY } from "~/src/composables/v2/useV2I18n.ts"

export type V2InitialView = "quick_publish" | "settings"

interface CreateV2AppOptions {
  initialView?: V2InitialView
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
