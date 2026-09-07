import { inject, type InjectionKey } from "vue"
import { useI18n } from "vue-i18n"

type V2I18nValue = string | number | boolean | null | undefined

interface V2I18nFallback {
  resolve: (key: string) => string | undefined
}

export const V2_I18N_FALLBACK_KEY: InjectionKey<V2I18nFallback> = Symbol("publisher-v2-i18n-fallback")

export const useV2I18n = () => {
  const { locale, messages } = useI18n()
  const fallback = inject(V2_I18N_FALLBACK_KEY, undefined)

  const resolveFromObject = (source: Record<string, any> | undefined, key: string) => {
    if (!source || !key) {
      return undefined
    }

    if (Object.prototype.hasOwnProperty.call(source, key) && typeof source[key] === "string") {
      return source[key]
    }

    if (!key.includes(".")) {
      return undefined
    }

    const nestedValue = key.split(".").reduce<any>((current, part) => {
      if (current && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, part)) {
        return current[part]
      }
      return undefined
    }, source)

    return typeof nestedValue === "string" ? nestedValue : undefined
  }

  const resolve = (key: string, params?: Record<string, V2I18nValue>) => {
    const localeMessages = messages.value?.[locale.value] as Record<string, any> | undefined
    const localeText = resolveFromObject(localeMessages, key)
    const fallbackText = fallback?.resolve(key)

    let text = localeText
    let source: "locale" | "fallback" | "missing" = "locale"

    if (typeof text !== "string") {
      text = fallbackText
      source = typeof text === "string" ? "fallback" : "missing"
    }

    if (typeof text !== "string") {
      text = key
    }

    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        text = text.split(`{${paramKey}}`).join(String(paramValue ?? ""))
      }
    }

    const applyParams = (value?: string) => {
      if (typeof value !== "string") {
        return undefined
      }

      let nextValue = value
      if (params) {
        for (const [paramKey, paramValue] of Object.entries(params)) {
          nextValue = nextValue.split(`{${paramKey}}`).join(String(paramValue ?? ""))
        }
      }
      return nextValue
    }

    return {
      text,
      source,
      localeText: applyParams(localeText),
      fallbackText: applyParams(fallbackText),
    }
  }

  return {
    t: (key: string, params?: Record<string, V2I18nValue>) => resolve(key, params).text,
    inspect: resolve,
    locale,
  }
}
