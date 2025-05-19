/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { IPlugin } from "@/plugin"

export interface PluginLoaderOptions {
  basePath?: string
  autoLoad?: boolean
}

export interface PluginLoader {
  registerPlugin(plugin: IPlugin): void
  getPlugin(id: string): IPlugin | undefined
  getAllPlugins(): IPlugin[]
  loadPlugin(pluginPath: string): Promise<{ success: boolean; error?: Error }>
}
