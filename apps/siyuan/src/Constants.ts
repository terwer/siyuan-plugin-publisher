/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2022-2024 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

export const DEFAULT_SIYUAN_LANG = window?.siyuan?.config?.lang ?? "zh_CN"
// @ts-ignore
export const isDev = typeof process === "undefined" ? false : process.env.DEV_MODE === "true"
// @ts-ignore
export const SH_BUILD_TIME = typeof process === "undefined" ? new Date().getTime() : process.env.SH_BUILD_TIME
export const DEFAULT_SIYUAN_API_URL = window.location.origin
