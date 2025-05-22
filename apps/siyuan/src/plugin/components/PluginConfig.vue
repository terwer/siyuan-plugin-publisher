<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { onBeforeMount, ref } from "vue"
import { usePlugin } from "../composables/usePlugin"
import FormGroup from "@components/FormGroup.vue"
import { DynamicConfig } from "@/models/dynamicConfig.ts"
import { PluginLoaderManager } from "@/plugin"
import { useI18n } from "@composables/useI18n.ts"
import { createAppLogger } from "@utils/appLogger.ts"
import { useComputedField } from "@composables/useComputedField.ts"
import Button from "@components/Button.vue"

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
    value: field.readOnly ? config.value[key] : useComputedField(config, key as never),
    placeholder: field.description,
    readonly: field.readOnly || false,
    disabled: field.readOnly || false,
  }
}

const props = defineProps<{
  platformConfig: DynamicConfig
  modelValue: any
  pluginInstance: any
}>()

const emit = defineEmits(["update:modelValue", "error"])

const { getPlugin, getPluginPath } = usePlugin()
const { t } = useI18n(props.pluginInstance)
const logger = createAppLogger("plugin-config-form")

const plugin = ref<any>(null)
const schema = ref<typeof props.modelValue.configSchema | null>(null)
const formGroups = ref<SettingGroup[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// 错误处理
const setError = (errorMsg: string) => {
  error.value = errorMsg
  emit("error", errorMsg)
}

// 初始化表单
const initFormGroups = () => {
  logger.debug("Initializing form groups with schema:", schema.value)
  if (schema.value?.properties) {
    formGroups.value = [
      {
        title: t("account.single.accountSetting"),
        items: Object.entries(schema.value.properties).map(([key, field]) => {
          const item = convertSchemaToFormField(key, field, props.modelValue)
          // 添加默认占位符
          if (!item.placeholder) {
            item.placeholder = t("plugin.config.placeholder", { field: field.title })
          }
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
  loading.value = true
  error.value = null
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
    setError(e.message || t("plugin.config.error.message").replace("{error}", e))
  } finally {
    loading.value = false
  }
}

onBeforeMount(async () => {
  await initPlugin()
})
</script>

<template>
  <div class="plugin-config">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span class="loading-text">{{ t("plugin.config.loading") }}</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">!</div>
      <div class="error-message">{{ error }}</div>
      <Button type="primary" size="sm" @click.stop="initPlugin">
        {{ t("plugin.config.retry") }}
      </Button>
    </div>

    <!-- 表单内容 -->
    <template v-else>
      <form-group
        v-for="(group, index) in formGroups"
        :key="index"
        :plugin-instance="pluginInstance"
        :form-group="group"
      />
    </template>
  </div>
</template>

<style lang="stylus" scoped>
.plugin-config
  position relative
  min-height 200px
  max-width 100%
  word-wrap break-word
  word-break break-word
  overflow-wrap break-word

.loading-container
  display flex
  flex-direction column
  align-items center
  justify-content center
  padding 40px 0
  width 100%

  .loading-spinner
    width 40px
    height 40px
    border 3px solid var(--loading-spinner-border)
    border-top-color var(--loading-spinner-color)
    border-radius 50%
    animation spin 1s linear infinite

  .loading-text
    margin-top 16px
    color var(--text-secondary)
    font-size 14px
    text-align center
    max-width 100%
    word-wrap break-word

.error-container
  display flex
  flex-direction column
  align-items center
  justify-content center
  padding 40px 0
  text-align center
  width 100%

  .error-icon
    width 48px
    height 48px
    line-height 48px
    text-align center
    background var(--error-bg)
    color var(--error-color)
    border-radius 50%
    font-size 24px
    font-weight bold
    margin-bottom 16px

  .error-message
    color var(--text-primary)
    margin-bottom 16px
    max-width 100%
    padding 0 16px
    word-wrap break-word
    white-space normal
    line-height 1.5

  .retry-button
    padding 8px 16px
    background var(--primary-color)
    color white
    border none
    border-radius 4px
    cursor pointer
    transition background 0.3s
    white-space nowrap

    &:hover
      background var(--primary-color-hover)

@keyframes spin
  to
    transform rotate(360deg)

// 主题变量
:root
  --loading-spinner-border: #f3f3f3
  --loading-spinner-color: #1677ff
  --error-bg: #fff2f0
  --error-color: #ff4d4f
  --primary-color: #1677ff
  --primary-color-hover: #4096ff
  --text-primary: rgba(0, 0, 0, 0.88)
  --text-secondary: rgba(0, 0, 0, 0.45)

[data-theme-mode="dark"]
  --loading-spinner-border: #303030
  --loading-spinner-color: #177ddc
  --error-bg: #2a1215
  --error-color: #ff7875
  --primary-color: #177ddc
  --primary-color-hover: #3c9ae8
  --text-primary: rgba(255, 255, 255, 0.85)
  --text-secondary: rgba(255, 255, 255, 0.45)
</style>
