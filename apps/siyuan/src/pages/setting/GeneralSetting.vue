<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { useSiyuanSettingStore } from "@stores/useSiyuanSettingStore.ts"
import { usePreferenceSettingStore } from "@stores/usePreferenceSettingStore.ts"
import { reactive } from "vue"
import { useComputedField } from "@composables/useComputedField.ts"
import { useI18n } from "@composables/useI18n.ts"
import { StrUtil } from "zhi-common"
import FormGroup from "@components/FormGroup.vue"

const props = defineProps<{
  pluginInstance: any
}>()

const { t } = useI18n(props.pluginInstance)
const { readonlySiyuanCfg, siyuanCfg } = useSiyuanSettingStore()
const { readonlyPreferenceCfg, preferenceCfg } = usePreferenceSettingStore()

const uiSettingFormGroup = reactive({
  title: t("preference.ui.title"),
  items: <SettingItem[]>[
    {
      type: "switch",
      label: t("preference.ui.showDocQuickMenu"),
      value: useComputedField(preferenceCfg, "showDocQuickMenu"),
    },
  ],
})

const contentSettingFormGroup = reactive({
  title: t("preference.content.title"),
  items: <SettingItem[]>[
    {
      type: "switch",
      label: t("preference.content.fixTitle"),
      value: useComputedField(preferenceCfg, "fixTitle"),
    },
    {
      type: "switch",
      label: t("preference.content.keepTitle"),
      value: useComputedField(preferenceCfg, "keepTitle"),
    },
    {
      type: "switch",
      label: t("preference.content.removeFirstH1"),
      value: useComputedField(preferenceCfg, "removeFirstH1"),
    },
    {
      type: "switch",
      label: t("preference.content.removeMdWidgetTag"),
      value: useComputedField(preferenceCfg, "removeMdWidgetTag"),
    },
  ],
})

const aiSettingFormGroup = reactive({
  title: t("preference.ai.title"),
  items: <SettingItem[]>[
    {
      type: "input",
      label: t("preference.ai.baseUrl"),
      placeholder: t("preference.ai.baseUrlPlaceholder"),
      value: readonlyPreferenceCfg.experimentalAIBaseUrl,
      readonly: true,
      disabled: true,
    },
    {
      type: "input",
      inputType: "password",
      label: t("preference.ai.code"),
      placeholder: t("preference.ai.codePlaceholder"),
      value: readonlyPreferenceCfg.experimentalAICode,
      readonly: true,
      disabled: true,
    },
    {
      type: "select",
      label: t("preference.ai.model"),
      value: readonlyPreferenceCfg.experimentalAIApiModel || "deepseek-r1",
      options: (() => {
        // 先创建基础选项
        const baseOptions = [
          { label: "deepseek-r1", value: "deepseek-r1" },
          { label: "ChatGPT", value: "chatgpt" },
        ]

        // 动态添加自定义选项
        const customModel =
          readonlyPreferenceCfg.experimentalAIApiModel || "deepseek-r1"
        if (
          !StrUtil.isEmptyString(customModel) &&
          !baseOptions.some((option) => option.value === customModel)
        ) {
          baseOptions.push({
            label: customModel,
            value: customModel,
          })
        }

        return baseOptions
      })(),
      disabled: true,
    },
  ],
})

const siyuanSettingFormGroup = reactive({
  title: t("preference.siyuan.title"),
  items: <SettingItem[]>[
    {
      type: "input",
      label: t("preference.siyuan.apiUrl"),
      placeholder: t("preference.siyuan.apiUrlPlaceholder"),
      value: readonlySiyuanCfg.apiUrl,
      readonly: true,
      disabled: true,
      inputType: "url",
    },
    {
      type: "input",
      label: t("preference.siyuan.password"),
      placeholder: t("preference.siyuan.passwordPlaceholder"),
      value: useComputedField(siyuanCfg, "password"),
    },
  ],
})

const dataBindFormGroup = reactive({
  title: t("preference.dataBind.title"),
  items: <SettingItem[]>[],
})

const formGroups = [
  uiSettingFormGroup,
  contentSettingFormGroup,
  aiSettingFormGroup,
  siyuanSettingFormGroup,
  dataBindFormGroup,
]
</script>

<template>
  <div class="settings-wrapper">
    <form-group
      v-for="(group, index) in formGroups"
      :key="index"
      :plugin-instance="props.pluginInstance"
      :form-group="group"
    />
  </div>
</template>

<style lang="stylus">
.settings-wrapper
  padding 0
  height 100%
  display flex
  flex-direction column
</style>
