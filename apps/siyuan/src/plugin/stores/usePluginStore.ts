/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { defineStore } from "pinia"
import { IPlugin, IPluginConfig } from "siyuan-plugin-publisher-types"

export const usePluginStore = defineStore("plugin", {
  state: () => ({
    plugins: [] as IPlugin[],
    activePlugin: null as string | null,
    pluginConfigs: {} as Record<string, IPluginConfig>,
  }),

  actions: {
    addPlugin(plugin: IPlugin) {
      this.plugins.push(plugin)
    },

    setActivePlugin(id: string) {
      this.activePlugin = id
    },

    updatePluginConfig(id: string, config: IPluginConfig) {
      this.pluginConfigs[id] = config
    },
  },
})
