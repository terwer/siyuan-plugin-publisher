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
import { Bird, Clock, Rss, Zap } from "lucide-vue-next"

const props = defineProps<{
  pluginInstance: any
}>()

const platforms: Platform[] = [
  // {
  //   name: "博客园",
  //   icon: Rss,
  //   type: "blog",
  //   enabled: true,
  //   actions: [
  //     {
  //       type: "button",
  //       icon: Zap,
  //       label: "极速发布",
  //       handler: () => console.log("fast"),
  //     },
  //     {
  //       type: "button",
  //       icon: Clock,
  //       label: "常规发布",
  //       handler: () => console.log("normal"),
  //     },
  //   ],
  // },
  // {
  //   name: "语雀",
  //   icon: Bird,
  //   type: "doc",
  //   enabled: true,
  //   actions: [
  //     {
  //       type: "button",
  //       icon: Zap,
  //       label: "极速发布",
  //       handler: () => console.log("fast"),
  //     },
  //     {
  //       type: "button",
  //       icon: Clock,
  //       label: "常规发布",
  //       handler: () => console.log("normal"),
  //     },
  //   ],
  // },
]
</script>

<template>
  <publish-platform-select
    :plugin-instance="props.pluginInstance"
    :platforms="platforms"
  />
</template>

<style scoped></style>
