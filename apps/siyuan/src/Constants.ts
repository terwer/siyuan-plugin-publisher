/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2022-2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

// @ts-ignore
export const isDev =
  // @ts-ignore
  typeof process === "undefined" ? false : process.env.DEV_MODE === "true"
// @ts-ignore
export const SH_BUILD_TIME =
  // @ts-ignore
  typeof process === "undefined"
    ? new Date().getTime()
    : // @ts-ignore
      process.env.PT_BUILD_TIME
export const DEFAULT_SIYUAN_API_URL = window.location.origin
// @ts-ignore
export const WINDOW_SIYUAN = window?.siyuan
/**
 * 旧的通用 HTTP 代理
 *
 * @since 1.0.0
 * @version 1.20.0
 */
export const LEGENCY_SHARED_PROXT_MIDDLEWARE =
  "https://api.terwer.space/api/middleware"
export const DEFAULT_SIYUAN_LANG = window?.siyuan?.config?.lang ?? "zh_CN"
// 是否英文版
export const IS_ENGLISH = DEFAULT_SIYUAN_LANG === "en_US"
