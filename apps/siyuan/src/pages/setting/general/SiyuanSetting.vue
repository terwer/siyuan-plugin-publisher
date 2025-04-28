<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { reactive, onBeforeMount } from "vue"
import SettingItem from "@components/SettingItem.vue"
import { useSiyuanSettingStore } from "@stores/useSiyuanSettingStore.ts"
import { useComputedField } from "@composables/useComputedField.ts"

const props = defineProps<{
  pluginInstance: any
}>()

const { initSiyuanCfg, siyuanCfg, readonlySiyuanCfg } = useSiyuanSettingStore()

const formGroup = reactive({
  title: "思源设置",
  items: <SettingItem[]>[
    {
      type: "input",
      label: "思源API地址",
      placeholder: "请输入思源API地址",
      value: readonlySiyuanCfg.apiUrl,
      readonly: true,
      // inputType: "url", // 使用HTML5 URL类型
    },
    {
      type: "input",
      label: "思源Token",
      placeholder: "请输入授权Token",
      value: useComputedField(siyuanCfg, "password"),
    },
  ],
})

onBeforeMount(async () => {
  // 延迟初始化，防止阻塞渲染
  void initSiyuanCfg()
})
</script>

<template>
  <div>
    <SettingItem
      :plugin-instance="props.pluginInstance"
      :setting-group="formGroup"
    />
  </div>
</template>

<style scoped lang="stylus"></style>
