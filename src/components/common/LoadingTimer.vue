<script setup lang="ts">
import { useVueI18n } from "~/src/composables/useVueI18n.ts"

// props
const props = defineProps({
  loadingTime: Number,
})

// uses
const { t } = useVueI18n()
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
