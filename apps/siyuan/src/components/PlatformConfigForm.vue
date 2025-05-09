<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { DynamicConfig } from "@/models/dynamicConfig.ts"
import SettingItem from "@components/SettingItem.vue"
import { useI18n } from "@composables/useI18n.ts"
import { computed, reactive } from "vue"
import { BlogConfig } from "zhi-blog-api"

const props = defineProps<{
  pluginInstance: any
  // 平台配置
  platformConfig: DynamicConfig
  // 平台特定配置
  blogConfig: BlogConfig
}>()

const { t } = useI18n(props.pluginInstance)

// 表单状态
const formState = reactive({
  // 平台配置
  platformConfig: props.platformConfig,

  // 平台特定配置（从 props 获取）
  blogConfig: props.blogConfig || {},
})

// 定义事件
const emit = defineEmits<{
  (e: "save", formData: DynamicConfig, blogConfig: BlogConfig): void
  (e: "cancel"): void
}>()

// 提交表单
const handleSubmit = () => {
  // 保存基础配置
  emit("save", formState.platformConfig, formState.blogConfig)
}

// 重置表单
const handleReset = () => {
  // 重置基础配置
  Object.assign(formState, props.platformConfig)
  // 重置平台特定配置
  formState.blogConfig = props.blogConfig || {}
}

// 构建表单配置
const formGroups = computed(() => {
  const groups = [
    {
      title: t("platform.config.basic.title"),
      items: <SettingItem[]>[
        {
          type: "input",
          label: t("platform.config.basic.name"),
          value: formState.platformConfig.platformName,
          placeholder: t("platform.config.basic.namePlaceholder"),
        },
        {
          type: "input",
          label: t("platform.config.basic.domain"),
          value: formState.platformConfig.domain,
          placeholder: t("platform.config.basic.domainPlaceholder"),
          inputType: "url",
        },
      ],
    },
    {
      title: t("platform.config.auth.title"),
      items: <SettingItem[]>[
        {
          type: "select",
          label: t("platform.config.auth.mode"),
          value: formState.platformConfig.authMode,
          options: [
            {
              label: t("platform.config.auth.mode.api"),
              value: "API",
            },
            {
              label: t("platform.config.auth.mode.website"),
              value: "WEBSITE",
            },
          ],
        },
      ],
    },
  ]

  // 平台特定配置
  if (formState.blogConfig) {
    // API 配置
    if (formState.blogConfig.apiUrl) {
      groups.push({
        title: t("platform.config.api.title"),
        items: <SettingItem[]>[
          {
            type: "input",
            label: t("platform.config.api.url"),
            value: formState.blogConfig.apiUrl,
            placeholder: t("platform.config.api.urlPlaceholder"),
          },
          {
            type: "select",
            label: t("platform.config.api.passwordType"),
            value: formState.blogConfig.passwordType,
            options: [
              {
                label: t("platform.config.api.passwordType.password"),
                value: "PasswordType_Password",
              },
              {
                label: t("platform.config.api.passwordType.token"),
                value: "PasswordType_Token",
              },
              {
                label: t("platform.config.api.passwordType.cookie"),
                value: "PasswordType_Cookie",
              },
            ],
          },
          {
            type: "input",
            label: t("platform.config.api.password"),
            value: formState.blogConfig.password,
            placeholder: t("platform.config.api.passwordPlaceholder"),
            inputType: "password",
          },
        ],
      })
    }

    // 内容配置
    if (formState.blogConfig.pageType !== undefined) {
      groups.push({
        title: t("platform.config.content.title"),
        items: <SettingItem[]>[
          {
            type: "select",
            label: t("platform.config.content.pageType"),
            value: formState.blogConfig.pageType,
            options: [
              {
                label: t("platform.config.content.pageType.markdown"),
                value: "Markdown",
              },
              {
                label: t("platform.config.content.pageType.html"),
                value: "Html",
              },
              {
                label: t("platform.config.content.pageType.formatter"),
                value: "Formatter",
              },
              {
                label: t(
                  "platform.config.content.pageType.markdownAndFormatter",
                ),
                value: "Markdown_And_Formatter",
              },
              {
                label: t("platform.config.content.pageType.mdx"),
                value: "MDX",
              },
            ],
          },
        ],
      })
    }
  }

  // 自定义平台额外配置
  if (props.platformConfig.platformType === "Custom") {
    groups.push({
      title: t("platform.config.custom.title"),
      items: <SettingItem[]>[
        {
          type: "textarea",
          label: t("platform.config.custom.script"),
          value: formState.platformConfig.extraScript,
          placeholder: t("platform.config.custom.scriptPlaceholder"),
        },
      ],
    })
  }

  return groups
})
</script>

<template>
  <div class="platform-config-form">
    <SettingItem
      v-for="(group, index) in formGroups"
      :key="index"
      :plugin-instance="pluginInstance"
      :setting-group="group"
    />

    <!-- 表单操作按钮 -->
    <div class="form-actions">
      <button class="btn btn-default" @click="handleReset">
        {{ t("common.reset") }}
      </button>
      <button class="btn btn-primary" @click="handleSubmit">
        {{ t("common.save") }}
      </button>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.platform-config-form
  max-width 800px
  margin 0 auto
  padding 24px

  .form-actions
    margin-top 24px
    display flex
    justify-content flex-end
    gap 12px

    .btn
      padding 8px 16px
      border-radius 4px
      font-size 14px
      cursor pointer
      transition all 0.3s

      &.btn-default
        background var(--bg-color)
        border 1px solid var(--border-color)
        color var(--text-color)

        &:hover
          background var(--hover-color)

      &.btn-primary
        background var(--primary-color)
        border 1px solid var(--primary-color)
        color #fff

        &:hover
          background var(--primary-hover-color)
</style>
