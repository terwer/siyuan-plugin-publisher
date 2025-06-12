/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2023-2024 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

// @ts-ignore
export const isDev = typeof process === "undefined" ? false : process?.dev
// export const isDev = import.meta.dev
// https://github.com/nuxt/nuxt/discussions/18779#discussioncomment-5082909
// typeof process === "undefined" ? false : process?.env?.DEV_MODE === "true"
export const DEFAULT_SIYUAN_API_URL =
  typeof window === "undefined" ? "http://127.0.0.1:6806" : (window?.location?.origin ?? "http://127.0.0.1:6806")
/**
 * 旧的通用 HTTP 代理
 *
 * @since 1.0.0
 * @version 1.20.0
 */
export const LEGENCY_SHARED_PROXY_MIDDLEWARE = "https://api.terwer.space/api/middleware"
export const DEFAULT_SIYUAN_LANG = typeof window === "undefined" ? "zh_CN" : (window?.siyuan?.config?.lang ?? "zh_CN")
// 是否英文版
export const IS_ENGLISH = DEFAULT_SIYUAN_LANG === "en_US"
