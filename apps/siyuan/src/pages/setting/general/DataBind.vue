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
  formGroup: any
}>()
</script>

<template>
  <SettingItem
    :plugin-instance="props.pluginInstance"
    :setting-group="formGroup"
  />
</template>

<style scoped lang="stylus"></style>
