/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2022-2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

// 思源笔记相关
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
export const DEFAULT_SIYUAN_API_URL =
  typeof window === "undefined"
    ? "http://127.0.0.1:6806"
    : (window?.location?.origin ?? "http://127.0.0.1:6806")
// @ts-ignore
export const WINDOW_SIYUAN = (
  typeof window === "undefined" ? {} : window?.siyuan
) as any
/**
 * 旧的通用 HTTP 代理
 *
 * @since 1.0.0
 * @version 1.20.0
 */
export const LEGENCY_SHARED_PROXT_MIDDLEWARE =
  "https://api.terwer.space/api/middleware"
export const DEFAULT_SIYUAN_LANG =
  typeof window === "undefined"
    ? "zh_CN"
    : (window?.siyuan?.config?.lang ?? "zh_CN")
// 是否英文版
export const IS_ENGLISH = DEFAULT_SIYUAN_LANG === "en_US"

// 发布相关
/**
 * 动态配置key，全系统唯一，请勿更改
 */
export const DYNAMIC_CONFIG_KEY = "dynamic-config"
/**
 * 根节点id
 */
export const PUBLISHER_ROOT_ID = "publisher-root"
