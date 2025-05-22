<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { ref, watch, onBeforeMount, computed } from "vue"
import { usePlugin } from "../composables/usePlugin"
import { usePluginStore } from "../stores/usePluginStore"
import FormGroup from "@components/FormGroup.vue"
import { DynamicConfig } from "@/models/dynamicConfig.ts"
import { PluginLoaderManager } from "@/plugin"
import { useI18n } from "@composables/useI18n.ts"
import { createAppLogger } from "@utils/appLogger.ts"
import { alert } from "@components/Alert.ts"

type InputType = "text" | "password" | "number" | "url"

interface SchemaProperty {
  type: string
  title: string
  description?: string
  format?: string
  readOnly?: boolean
  maxLength?: number
  minLength?: number
  items?: {
    enum?: any[]
  }
}

interface Schema {
  properties: Record<string, SchemaProperty>
}

/**
 * 根据 JSON Schema 推断输入类型
 */
const inferInputType = (field: any): InputType => {
  if (field.type === "number") {
    return "number"
  }
  if (field.type === "string") {
    if (field.format === "password") {
      return "password"
    }
    if (field.format === "uri") {
      return "url"
    }
  }
  return "text"
}

/**
 * 根据 JSON Schema 推断控件类型
 */
const inferControlType = (field: any): string => {
  if (field.type === "boolean") {
    return "switch"
  }
  if (field.type === "number") {
    return "number"
  }
  if (field.type === "string") {
    // 长文本使用 textarea
    if (field.maxLength > 100 || field.minLength > 50) {
      return "textarea"
    }
  }
  if (field.type === "array" && field.items?.enum) {
    return "select"
  }
  return "input"
}

/**
 * 将 schema 字段转换为表单字段
 */
const convertSchemaToFormField = (key: string, field: any, config: any): SettingItem => {
  return {
    type: inferControlType(field) as any,
    inputType: inferInputType(field),
    label: field.title,
    value: computed({
      get: () => config[key],
      set: (val) => {
        config[key] = val
      },
    }),
    placeholder: field.description,
    readonly: field.readOnly || false,
    disabled: false,
  }
}

const props = defineProps<{
  platformConfig: DynamicConfig
  modelValue: any
  pluginInstance: any
}>()

const emit = defineEmits(["update:modelValue"])

const { getPlugin, getPluginPath, loadPlugin } = usePlugin()
const pluginStore = usePluginStore()
const { t } = useI18n(props.pluginInstance)
const logger = createAppLogger("plugin-config-form")

const plugin = ref<any>(null)
const schema = ref<typeof props.modelValue.configSchema | null>(null)
const formGroups = ref<SettingGroup[]>([])

// 初始化表单
const initFormGroups = () => {
  logger.debug("Initializing form groups with schema:", schema.value)
  if (schema.value?.properties) {
    formGroups.value = [
      {
        title: t("plugin.config.title"),
        items: Object.entries(schema.value.properties).map(([key, field]) => {
          const item = convertSchemaToFormField(key, field, props.modelValue)
          logger.debug(`Converting field ${key}:`, { field, value: props.modelValue[key], item })
          return item
        }),
      },
    ]
    logger.debug("Form groups initialized:", formGroups.value)
  }
}

// 初始化插件和配置
const initPlugin = async () => {
  try {
    // 尝试获取已加载的插件
    let loadedPlugin = getPlugin(props.platformConfig.platformKey)

    // 如果插件未加载，则加载插件
    if (!loadedPlugin) {
      const pluginLoader = PluginLoaderManager.getInstance()
      const pluginPath = getPluginPath(props.platformConfig)
      const result = await pluginLoader.loadPlugin(pluginPath)
      if (!result.success) {
        throw new Error(`Failed to load plugin from ${pluginPath}: ${result.error}`)
      }
      loadedPlugin = result.instance
      if (!loadedPlugin) {
        throw new Error(`Plugin instance not found: ${pluginPath}`)
      }
    }

    // 更新插件和schema
    plugin.value = loadedPlugin
    schema.value = loadedPlugin.configSchema
    logger.debug("Plugin initialized:", { plugin: plugin.value, schema: schema.value })
    // 初始化表单
    initFormGroups()
  } catch (e: any) {
    logger.error("Failed to initialize plugin:", e)
    void alert({
      title: t("plugin.config.error.title"),
      message: t("plugin.config.error.message").replace("{error}", e),
      type: "error",
      duration: 2000,
    })
  }
}

onBeforeMount(async () => {
  await initPlugin()
})
</script>

<template>
  <div class="plugin-config">
    <form-group
      v-for="(group, index) in formGroups"
      :key="index"
      :plugin-instance="pluginInstance"
      :form-group="group"
    />
  </div>
</template>

<style lang="stylus" scoped>
//.plugin-config
//  padding 16px
//  background var(--b3-theme-background)
//  border-radius 4px
</style>
