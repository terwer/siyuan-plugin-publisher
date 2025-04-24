<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
// import { ref, computed } from "vue"
// import { useRoute, useRouter } from "vue-router"
// import { ArrowLeft, HelpCircle } from "lucide-vue-next"
// import { useVueI18n } from "~/src/composables/useVueI18n.ts"
// import { help } from "~/src/platforms/help.ts"
// import { createAppLogger } from "@/utils/appLogger"

// const logger = createAppLogger("back-page")
// const { t } = useVueI18n()
// const router = useRouter()
// const { query } = useRoute()

// Props
// const props = defineProps({
//   title: { type: String, default: "" },
//   hasBackEmit: { type: Boolean, default: false },
//   helpKey: { type: String, default: "" },
// })

// Emits
// const emit = defineEmits(["backEmit"])

// Data
// const showBack = ref(query.showBack === "true")
// const showHelpTooltip = ref(false)

// Computed
// const helpUrl = computed(() => {
//   // help[props.helpKey] || "https://siyuan.wiki/s/20230810132040-nn4q7vs"
//   return ""
// })

// Methods
// const handleBack = () => {
//   if (props.hasBackEmit) {
//     logger.info("Triggering backEmit")
//     emit("backEmit")
//   } else {
//     logger.info("Navigating back")
//     router.back()
//   }
// }
//
// const toggleHelpTooltip = (state: boolean) => {
//   showHelpTooltip.value = state
// }
</script>

<template>
  <div>back page</div>
  <!--
  <div class="back-page">
    <div v-if="showBack" class="page-header">
      <button class="back-btn" @click="handleBack">
        <ArrowLeft class="icon" />
        <span class="text">{{ t("common.back") }}</span>
      </button>

      <div class="title-group">
        <h1 class="title">{{ props.title }}</h1>
        <div
          v-if="helpKey"
          class="help-container"
          @mouseenter="toggleHelpTooltip(true)"
          @mouseleave="toggleHelpTooltip(false)"
        >
          <button class="help-btn" @click="window.open(helpUrl, '_blank')">
            <HelpCircle class="icon" />
          </button>
          <div v-show="showHelpTooltip" class="help-tooltip">
            {{ t("common.help") }}
          </div>
        </div>
      </div>
    </div>

    <div class="page-content">
      <slot />
    </div>
  </div>
  -->
</template>

<style lang="stylus" scoped>
// 设计变量
.back-page
  --pt-bg: #fff
  --pt-surface: #f8f9fa
  --pt-text: #212529
  --pt-text-light: #6c757d
  --pt-border: #dee2e6
  --pt-accent: #1971c2
  --pt-shadow: rgba(0, 0, 0, 0.1)

  // 暗黑模式变量覆盖
  html[data-theme-mode="dark"] &
    --pt-bg: #2d2d2d
    --pt-surface: #363636
    --pt-text: #f8f9fa
    --pt-text-light: #adb5bd
    --pt-border: #495057
    --pt-accent: #4dabf7
    --pt-shadow: rgba(0, 0, 0, 0.3)

.page-header
  background var(--pt-bg)
  border-bottom 1px solid var(--pt-border)

.back-btn
  color var(--pt-text-light)
  &:hover
    background var(--pt-surface)
    color var(--pt-accent)

.title
  color var(--pt-text)

.help-btn
  color var(--pt-text-light)
  &:hover
    color var(--pt-accent)

.help-tooltip
  background var(--pt-surface)
  color var(--pt-text)
  box-shadow 0 2px 8px var(--pt-shadow)
  border 1px solid var(--pt-border)
  &::before
    border-color transparent transparent var(--pt-surface) transparent
</style>
