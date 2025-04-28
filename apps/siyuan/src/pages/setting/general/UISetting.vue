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

const props = defineProps<{
  pluginInstance: any
}>()

const formGroup = {
  title: "界面选项",
  items: <SettingItem[]>[
    {
      type: "switch",
      label: "显示文档菜单",
      value: true,
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
}
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
