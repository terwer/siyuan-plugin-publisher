<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { reactive } from "vue"
import { useRoute } from "vue-router"
import { getSubPlatformTypeByKey } from "@/models/dynamicConfig.ts"

const route = useRoute()

// datas
const params = reactive(route.params)
const apiType = params.key as string
const subtype = getSubPlatformTypeByKey(apiType)
</script>

<template>
  <div>single set index:{{ apiType }}=>{{ subtype }}</div>
</template>

<style scoped lang="stylus"></style>
