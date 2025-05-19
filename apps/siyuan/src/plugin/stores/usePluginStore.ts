/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { defineStore } from "pinia"
import { IPlugin } from "@/plugin"

export const usePluginStore = defineStore("plugin", {
  state: () => ({
    plugins: [] as IPlugin[],
    activePlugin: null as string | null,
    pluginConfigs: {} as Record<string, any>,
  }),

  actions: {
    addPlugin(plugin: IPlugin) {
      this.plugins.push(plugin)
    },

    setActivePlugin(platform: string) {
      this.activePlugin = platform
    },

    updatePluginConfig(platform: string, config: any) {
      this.pluginConfigs[platform] = config
    },
  },
})
