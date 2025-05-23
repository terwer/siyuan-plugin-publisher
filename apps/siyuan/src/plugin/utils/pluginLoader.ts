/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createAppLogger } from "@utils/appLogger.ts"
import { IPlugin, IPluginTemplate } from "siyuan-plugin-publisher-types"

const logger = createAppLogger("plugin-loader")

export class PluginLoader {
  private static instance: PluginLoader
  private loadedTemplates: Map<string, IPlugin> = new Map()

  private constructor() {}

  static getInstance() {
    if (!PluginLoader.instance) {
      PluginLoader.instance = new PluginLoader()
    }
    return PluginLoader.instance
  }

  async loadTemplate(templatePath: string): Promise<IPluginTemplate> {
    try {
      const template = await import(templatePath)
      this.validateTemplate(template.default)
      this.loadedTemplates.set(template.default.id, template.default)
      return template.default
    } catch (error) {
      logger.error(`Failed to load template from ${templatePath}:`, error)
      throw error
    }
  }

  private validateTemplate(template: IPluginTemplate) {
    if (!template) {
      throw new Error("Invalid template: template object is null or undefined")
    }
    const requiredFields = ["id", "name", "version", "entry"]
    for (const field of requiredFields) {
      if (!(field in template)) {
        throw new Error(`Invalid template: missing required field "${field}"`)
      }
      // @ts-ignore
      if (!template[field]) {
        throw new Error(`Invalid template: field "${field}" cannot be empty`)
      }
    }
  }
}
