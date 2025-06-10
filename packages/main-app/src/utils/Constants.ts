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
