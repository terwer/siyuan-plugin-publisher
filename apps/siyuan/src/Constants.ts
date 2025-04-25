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
