/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { PLUGIN_BASE_PATH } from "@/constants/pluginConstants"

/**
 * 路径解析器
 */
export class PluginPathResolver {
  private static instance: PluginPathResolver
  private readonly pluginBasePath: string
  private pluginCache: Map<string, string> = new Map()

  private constructor() {
    this.pluginBasePath = PLUGIN_BASE_PATH
  }

  static getInstance() {
    if (!PluginPathResolver.instance) {
      PluginPathResolver.instance = new PluginPathResolver()
    }
    return PluginPathResolver.instance
  }

  getTemplatePath(templateId: string, type: "root" | "package" | "entry" = "root"): string {
    const cacheKey = `${templateId}:${type}`
    if (this.pluginCache.has(cacheKey)) {
      return this.pluginCache.get(cacheKey)!
    }

    let path: string
    switch (type) {
      case "root":
        path = `${this.pluginBasePath}/${templateId}`
        break
      case "package":
        path = `${this.pluginBasePath}/${templateId}/package.json`
        break
      case "entry":
        path = `${this.pluginBasePath}/${templateId}/index.js`
        break
      default:
        path = `${this.pluginBasePath}/${templateId}`
    }

    this.pluginCache.set(cacheKey, path)
    return path
  }

  resolvePluginId(path: string): string | null {
    const match = path.match(new RegExp(`${this.pluginBasePath}/([^/]+)`))
    return match ? match[1] : null
  }
}
