<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { ref, watch, onBeforeMount } from "vue"
import { usePlugin } from "../composables/usePlugin"
import { usePluginStore } from "../stores/usePluginStore"
import FormGroup from "@components/FormGroup.vue"
import { DynamicConfig } from "@/models/dynamicConfig.ts"
import { PluginLoaderManager } from "@/plugin"
import { useI18n } from "@composables/useI18n.ts"

type InputType = "text" | "password" | "number" | "url"

interface FormField {
  type: string
  inputType: InputType
  label: string
  value: any
  placeholder?: string
  readonly: boolean
  disabled: boolean
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
const convertSchemaToFormField = (key: string, field: any, config: any): FormField => {
  return {
    type: inferControlType(field),
    inputType: inferInputType(field),
    label: field.title,
    value: config[key],
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

let plugin = getPlugin(props.platformConfig.platformKey)
const schema = ref(plugin?.configSchema)
const config = ref(props.modelValue)

// 将 schema 转换为 FormGroup 格式
const formGroups = ref([
  {
    title: t("plugin.config.title"),
    items: Object.entries(schema.value?.properties || {}).map(([key, field]) =>
      convertSchemaToFormField(key, field, config.value),
    ),
  },
])

// 监听配置变化
watch(
  config,
  (newVal) => {
    emit("update:modelValue", newVal)
    pluginStore.updatePluginConfig(props.platformConfig.platformKey, newVal)
  },
  { deep: true },
)

const handleChange = (group: any, item: any, value: any) => {
  const key = Object.keys(schema.value?.properties || {}).find((k) => schema.value?.properties[k].title === item.label)
  if (key) {
    config.value[key] = value
  }
}

onBeforeMount(async () => {
  // 初始化配置
  if (!plugin) {
    // 加载插件
    const pluginLoader = PluginLoaderManager.getInstance()
    const pluginPath = getPluginPath(props.platformConfig)
    const result = await pluginLoader.loadPlugin(pluginPath)
    if (!result.success) {
      throw new Error(`Failed to load plugin from ${pluginPath}: ${result.error}`)
    }
    const instance = result.instance
    if (!instance) {
      throw new Error(`Plugin instance not found: ${pluginPath}`)
    }
    plugin = instance
  }
})
</script>

<template>
  <div class="plugin-config">
    <form-group
      v-for="(group, index) in formGroups"
      :key="index"
      :plugin-instance="pluginInstance"
      :form-group="group"
      @change="handleChange"
    />
  </div>
</template>

<style lang="stylus" scoped>
.plugin-config
  padding 16px
  background var(--b3-theme-background)
  border-radius 4px
</style>
