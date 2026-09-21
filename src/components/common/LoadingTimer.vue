<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"

// props
const props = defineProps({
  loadingTime: Number,
})

// uses
const { t } = useAppI18n()
</script>

<template>
  <div class="loading-tips">
    <div>
      {{ t("loading.cost") }}: {{ loadingTime }} ms
      <span v-if="loadingTime < 200">😍</span>
      <span v-else-if="loadingTime < 400">😄</span>
      <span v-else-if="loadingTime < 600">😊</span>
      <span v-else-if="loadingTime < 800">🤔</span>
      <span v-else-if="loadingTime < 1000">😒</span>
      <span v-else>😭</span>
    </div>
  </div>
</template>
