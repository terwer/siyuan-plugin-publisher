<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import PublishPlatformSelect from "@components/PublishPlatformSelect.vue"
import { Settings, Trash2, Rss, Zap } from "lucide-vue-next"
import { ref } from "vue"

const props = defineProps<{
  pluginInstance: any
}>()

const platforms = ref<Platform[]>([
  {
    name: "博客园账号1",
    icon: Rss,
    type: "blog",
    enabled: false,
    actions: [
      {
        type: "button",
        icon: Settings,
        label: "设置",
        handler: (platform: Platform) => console.log("设置", platform.name),
      },
      {
        type: "button",
        icon: Trash2,
        label: "删除",
        handler: (platform: Platform) => console.log("删除", platform.name),
      },
      {
        type: "toggle",
        label: "启用",
        value: false,
        handler: (platform: Platform) => {
          platform.enabled = !platform.enabled
        },
      },
    ],
  },
  {
    name: "博客园账号2",
    icon: Zap,
    type: "blog",
    enabled: false,
    actions: [
      {
        type: "button",
        icon: Settings,
        label: "设置",
        handler: (platform: Platform) => console.log("设置", platform.name),
      },
      {
        type: "button",
        icon: Trash2,
        label: "删除",
        handler: (platform: Platform) => console.log("删除", platform.name),
      },
      {
        type: "toggle",
        label: "启用",
        value: false,
        handler: (platform: Platform) => {
          platform.enabled = !platform.enabled
        },
      },
    ],
  },
])
</script>

<template>
  <publish-platform-select
    :plugin-instance="props.pluginInstance"
    :platforms="platforms"
  >
  </publish-platform-select>
</template>

<style lang="stylus" scoped></style>
