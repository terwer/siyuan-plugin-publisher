import { defineStore } from "pinia"
import { PluginLoader } from "@/plugin/utils/pluginLoader"
import { PluginPathResolver } from "@/plugin/utils/pluginPathResolver.ts"
import { createAppLogger } from "@utils/appLogger.ts"
import { IPlugin, IPluginConfig, IPluginTemplate } from "siyuan-plugin-publisher-types"
import { HookManager } from "@/plugin/hooks/manager.ts"
import { HookStage } from "@/plugin"

const logger = createAppLogger("plugin-store")

export const usePluginStore = defineStore("plugin", {
  state: () => ({
    pluginTemplates: {} as Record<string, IPluginTemplate>,
    plugins: {} as Record<string, IPlugin>,
    activePlugin: null as string | null,
    pluginLoader: PluginLoader.getInstance(),
    pathResolver: PluginPathResolver.getInstance(),
    hookManager: HookManager.getInstance(),
  }),

  getters: {
    getTemplate: (state) => (templateId: string) => {
      return state.pluginTemplates[templateId]
    },

    getPlugin: (state) => (pluginId: string) => {
      return state.plugins[pluginId]
    },

    getPlugins: (state) => (templateId: string) => {
      return Object.values(state.plugins).filter((p) => p.templateId === templateId)
    },

    getPluginPath:
      (state) =>
      (pluginId: string, type: "root" | "package" | "entry" = "root") => {
        return state.pathResolver.getTemplatePath(pluginId, type)
      },
  },

  actions: {
    async loadPluginTemplate(templateId: string) {
      try {
        const templatePath = this.pathResolver.getTemplatePath(templateId, "entry")
        const template = await this.pluginLoader.loadTemplate(templatePath)
        this.pluginTemplates[templateId] = template
        return template
      } catch (error) {
        logger.error(`Failed to load plugin template ${templateId}:`, error)
        throw error
      }
    },

    createPluginInstance(templateId: string, instanceId?: string, config: Partial<IPluginConfig> = {}) {
      const template = this.pluginTemplates[templateId]
      if (!template) {
        throw new Error(`Template ${templateId} not found`)
      }

      const finalInstanceId = instanceId || `${templateId}_${Date.now()}`
      const instance: IPlugin = {
        id: finalInstanceId,
        templateId,
        name: `${template.name} Instance`,
        config: {
          ...template.defaultConfig,
          ...config,
        },
      } as IPlugin

      this.plugins[finalInstanceId] = instance
      return instance
    },

    updatePluginConfig(instanceId: string, config: Partial<IPluginConfig>) {
      const instance = this.plugins[instanceId]
      if (!instance) {
        throw new Error(`Instance ${instanceId} not found`)
      }

      instance.config = {
        ...instance.config,
        ...config,
      }
    },

    deletePlugin(instanceId: string) {
      if (!this.plugins[instanceId]) {
        throw new Error(`Instance ${instanceId} not found`)
      }
      this.hookManager.clearPluginHooks(instanceId)
      delete this.plugins[instanceId]
    },

    setActiveInstance(instanceId: string) {
      if (!this.plugins[instanceId]) {
        throw new Error(`Instance ${instanceId} not found`)
      }
      this.activePlugin = instanceId
    },

    async scanAndLoadTemplates() {
      const templateDirs = await this.scanPluginDirectories()
      for (const dir of templateDirs) {
        const templateId = this.pathResolver.resolvePluginId(dir)
        if (templateId) {
          try {
            await this.loadPluginTemplate(templateId)
          } catch (error) {
            logger.error(`Failed to load template ${templateId}:`, error)
          }
        }
      }
    },

    async scanPluginDirectories() {
      // 实现扫描插件目录的逻辑
      // 返回插件目录路径数组
      return []
    },

    registerGlobalHook(stage: HookStage, hook: any) {
      this.hookManager.registerGlobalHook(stage, hook)
    },

    registerPluginHook(pluginId: string, stage: HookStage, hook: any) {
      this.hookManager.registerPluginHook(pluginId, stage, hook)
    },

    async executeHooks(stage: HookStage, context: any) {
      return await this.hookManager.executeHooks(stage, context)
    },
  },
})
