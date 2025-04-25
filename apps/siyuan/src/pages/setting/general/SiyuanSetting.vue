<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import SettingItem from "@components/SettingItem.vue"
import { useSiyuanSettingStore } from "@stores/useSiyuanSettingStore.ts"
import { reactive, ref } from "vue"

const props = defineProps<{
  pluginInstance: any
}>()

const { siyuanCfg } = useSiyuanSettingStore()

const aa = ref("123")

const formGroup = reactive({
  title: "思源设置",
  items: <SettingItem[]>[
    {
      type: "input",
      label: "API地址",
      value: siyuanCfg.apiUrl,
      // value: aa,
      placeholder: "请输入思源API地址",
      // inputType: "url", // 使用HTML5 URL类型
      // readonly: true,
    },
    {
      type: "input",
      label: "思源Token",
      value: "",
      placeholder: "请输入授权Token",
      inputType: "password", // 密码输入类型
    },
  ],
})
</script>

<template>
  <div>
    siyuanCfg.apiUrl: {{ siyuanCfg.apiUrl }}
    <SettingItem
      :plugin-instance="props.pluginInstance"
      :setting-group="formGroup"
    />
  </div>
</template>

<style scoped lang="stylus"></style>
