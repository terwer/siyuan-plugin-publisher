<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import SiyuanSetting from "@pages/setting/general/SiyuanSetting.vue"
import UISetting from "@pages/setting/general/UISetting.vue"
import { useSiyuanSettingStore } from "@stores/useSiyuanSettingStore.ts"
import { reactive } from "vue"
import { useComputedField } from "@composables/useComputedField.ts"

const props = defineProps<{
  pluginInstance: any
}>()

const { readonlySiyuanCfg, siyuanCfg } = useSiyuanSettingStore()

const uiSettingFormGroup = reactive({
  title: "界面选项",
  items: <SettingItem[]>[
    {
      type: "switch",
      label: "去除标题编号",
      value: useComputedField(siyuanCfg, "preferenceConfig.fixTitle" as any),
    },
    {
      type: "select",
      label: "模型选择",
      value: "deepseek-r1",
      options: [
        { label: "deepseek-r1", value: "deepseek-r1" },
        { label: "ChatGPT", value: "chatgpt" },
      ],
    },
  ],
})

const siyuanSettingFormGroup = reactive({
  title: "思源设置",
  items: <SettingItem[]>[
    {
      type: "input",
      label: "思源API地址",
      placeholder: "请输入思源API地址",
      value: readonlySiyuanCfg.apiUrl,
      readonly: true,
      disabled: true,
      inputType: "url",
    },
    {
      type: "input",
      label: "思源Token",
      placeholder: "请输入授权Token",
      value: useComputedField(siyuanCfg, "password"),
    },
  ],
})
</script>

<template>
  <div class="settings-wrapper">
    <u-i-setting
      :plugin-instance="props.pluginInstance"
      :form-group="uiSettingFormGroup"
    />
    <siyuan-setting
      :plugin-instance="props.pluginInstance"
      :form-group="siyuanSettingFormGroup"
    />
  </div>
</template>

<style lang="stylus">
.settings-wrapper
  padding 0
  height 100%
  overflow-y auto
</style>
