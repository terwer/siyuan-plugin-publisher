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

const props = defineProps<{
  pluginInstance: any
}>()
</script>

<template>
  <div class="settings-wrapper">
    <u-i-setting :plugin-instance="props.pluginInstance" />
    <siyuan-setting :plugin-instance="props.pluginInstance" />
  </div>
</template>

<style lang="stylus">
.settings-wrapper
  padding 0
  height 100%
  overflow-y auto
</style>
