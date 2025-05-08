<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { getSubPlatformTypeByKey } from "@/models/dynamicConfig.ts"
import { reactive } from "vue"
import { useRoute } from "vue-router"
import BackPage from "@components/BackPage.vue"

// Props
const props = defineProps<{
  pluginInstance: any
}>()

const route = useRoute()

// datas
const params = reactive(route.params)
const apiType = params.key as string
const subtype = getSubPlatformTypeByKey(apiType)
</script>

<template>
  <back-page
    :title="apiType"
    :plugin-instance="props.pluginInstance"
    :has-back-emit="false"
    :help-key="subtype"
  >
    <div>single set index:{{ apiType }}=>{{ subtype }}</div>
  </back-page>
</template>

<style scoped lang="stylus"></style>
