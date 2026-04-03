import { createApp } from "vue"
import { createPinia } from "pinia"
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

const V2_TEST_LOCALE_MESSAGES = {
  "v2.i18nTest.probe.localeOnly": "V2 locale-only probe",
}

export const createV2VueApp = (options: CreateV2AppOptions = {}) => {
  const locale = options.locale ?? "plugin"
  const baseMessages = options.messages ?? {
    [locale]: {},
  }
  const messages = {
    ...baseMessages,
    [locale]: {
      ...(baseMessages[locale] ?? {}),
      ...V2_TEST_LOCALE_MESSAGES,
    },
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
