/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 */

import { translateNonVueI18n } from "~/src/utils/nonVueI18n.ts"

const YUQUE_PRICE_URL = "https://www.yuque.com/about/price#personal"

/**
 * 语雀 Open API 响应错误映射（common_Yuque）。
 * 429 在实测中多为会员/配额限制，而非插件请求频率问题。
 */
const isTooManyRequests = (status: number, message: string) =>
  status === 429 || /too many requests/i.test(message) || message.includes("请求过于频繁")

export const isYuqueApiPlatformKey = (apiType?: string) => Boolean(apiType?.startsWith("common_Yuque"))

export const isYuqueQuotaOrMembershipError = (message?: string) => {
  const text = String(message ?? "")
  return (
    isTooManyRequests(Number.NaN, text) ||
    /专业会员|超级会员|配额|yuque.com\/about\/price|语雀 API 受限|语雀 API 不可用/i.test(text)
  )
}

/** 验证失败红字提示：429 时不用「API验证失败=>Error」包裹，直接给可执行说明 */
export const formatYuqueValidateError = (raw: unknown): string => {
  const text = raw instanceof Error ? raw.message : String(raw ?? "")
  if (isYuqueQuotaOrMembershipError(text)) {
    return translateNonVueI18n("setting.yuque.vali.error429", { priceUrl: YUQUE_PRICE_URL })
  }
  return text
}

export const toYuqueApiUserError = (error: unknown): Error => {
  if (!(error instanceof Error)) {
    return new Error(translateNonVueI18n("setting.yuque.error.generic"))
  }

  const status = Number((error as any)?.status ?? (error as any)?.diagnostic?.status)
  const message = error.message || ""

  if (status === 401) {
    return new Error(translateNonVueI18n("setting.yuque.error.auth", { priceUrl: YUQUE_PRICE_URL }))
  }
  if (status === 403) {
    return new Error(translateNonVueI18n("setting.yuque.error.membershipRequired", { priceUrl: YUQUE_PRICE_URL }))
  }
  if (isTooManyRequests(status, message)) {
    return new Error(translateNonVueI18n("setting.yuque.vali.error429", { priceUrl: YUQUE_PRICE_URL }))
  }
  if (status === 404) {
    return new Error(translateNonVueI18n("setting.yuque.error.notfound"))
  }

  return error
}

export const assertYuqueApiResponse = (resJson: any): void => {
  const status = Number(resJson?.status)
  if (!Number.isFinite(status) || status < 400) {
    return
  }

  if (status === 401) {
    throw new Error(
      resJson?.message || translateNonVueI18n("setting.yuque.error.auth", { priceUrl: YUQUE_PRICE_URL })
    )
  }
  if (status === 403) {
    throw new Error(translateNonVueI18n("setting.yuque.error.membershipRequired", { priceUrl: YUQUE_PRICE_URL }))
  }
  if (isTooManyRequests(status, String(resJson?.message ?? ""))) {
    throw new Error(translateNonVueI18n("setting.yuque.vali.error429", { priceUrl: YUQUE_PRICE_URL }))
  }
  if (status === 404) {
    throw new Error(translateNonVueI18n("setting.yuque.error.notfound"))
  }

  const fallback = resJson?.message ? String(resJson.message) : translateNonVueI18n("setting.yuque.error.generic")
  throw new Error(fallback)
}

export { YUQUE_PRICE_URL }
