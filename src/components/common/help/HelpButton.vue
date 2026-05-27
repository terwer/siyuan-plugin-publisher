<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { ref } from "vue"
import { QuestionFilled } from "@element-plus/icons-vue"
import HelpPanel from "~/src/components/common/help/HelpPanel.vue"
import TourGuide from "~/src/components/common/help/TourGuide.vue"

defineOptions({ name: "HelpButton" })

const props = defineProps({
  pageId: { type: String, required: true },
  pageTitle: { type: String, default: "" },
})

const showPanel = ref(false)
const showTour = ref(false)
const triggerRef = ref<HTMLElement | null>(null)

const togglePanel = () => {
  showPanel.value = !showPanel.value
}

const onStartTour = () => {
  showPanel.value = false
  showTour.value = true
}

const onTourClose = () => {
  showTour.value = false
}
</script>

<template>
  <span ref="triggerRef" class="syp-help-button" @click.stop>
    <el-tooltip effect="light" content="帮助" placement="top">
      <el-button :icon="QuestionFilled as any" circle size="small" type="info" class="help-btn" @click="togglePanel" />
    </el-tooltip>
    <HelpPanel
      v-if="showPanel"
      :page-id="pageId"
      :page-title="pageTitle"
      :trigger-el="triggerRef"
      @close="showPanel = false"
      @start-tour="onStartTour"
    />
    <TourGuide
      v-if="showTour"
      :page-id="pageId"
      :trigger-el="triggerRef"
      @close="onTourClose"
    />
  </span>
</template>

<style scoped lang="stylus">
.syp-help-button
  display inline-block
  vertical-align middle

.help-btn
  border none
  color var(--el-color-info-light-3)
  background-color transparent
  transition all 0.3s var(--el-transition-function-ease-in-out-bezier)
  &:hover
    color var(--el-color-primary)
    background-color var(--el-color-primary-light-9)
    transform scale(1.1)
</style>