/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 规范化路径
 *
 * @param paths 路径片段
 * @returns 规范化后的路径
 */
export function normalizePath(...paths: string[]): string {
  if (paths.length === 0) return ""

  // 判断是否以 / 开头
  const startsWithSlash = paths[0].startsWith("/")

  const normalized = paths
    .map((path) => path.replace(/^\/+|\/+$/g, "").replace(/\/+/g, "/"))
    .filter(Boolean)
    .join("/")

  // 如果原始第一个路径以 / 开头，则加上开头的 /
  return startsWithSlash ? `/${normalized}` : normalized
}
