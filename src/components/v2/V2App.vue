<template>
  <div class="syp-v2">
    <div class="syp-panel">
      <div class="syp-header">
        <div class="syp-header-title">{{ panelTitle }}</div>
        <div class="syp-header-actions">
          <button class="syp-btn syp-btn-text" @click="close">✕</button>
        </div>
      </div>
      <div class="syp-content">
        <div class="syp-hello">
          <h1>Hello V2</h1>
          <p>{{ panelDesc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

// 里程碑 0：只显示 Hello V2
const props = defineProps<{
  initialView?: "quick_publish" | "settings"
  onClose?: () => void
}>()

const panelTitle = computed(() => {
  return props.initialView === "settings" ? "发布工具 V2 · 设置" : "发布工具 V2 · 快速发布"
})

const panelDesc = computed(() => {
  return props.initialView === "settings" ? "新版设置工作壳正在接入中..." : "新版主界面工作壳正在接入中..."
})

function close() {
  props.onClose?.()
}
</script>

<style scoped lang="stylus">
.syp-v2
  width 420px
  max-width calc(100vw - 48px)

.syp-panel
  background #fff
  border-radius 8px
  display flex
  flex-direction column
  box-shadow 0 4px 20px rgba(0, 0, 0, 0.15)

.syp-header
  display flex
  align-items center
  justify-content space-between
  padding 16px 20px
  border-bottom 1px solid #e8e8e8

.syp-header-title
  font-size 16px
  font-weight 600
  color #1f2329

.syp-header-actions
  display flex
  gap 8px

.syp-content
  padding 40px
  text-align center

.syp-hello
  h1
    font-size 24px
    color #3370ff
    margin-bottom 16px
  p
    font-size 14px
    color #646a73

.syp-btn
  padding 6px 16px
  border-radius 4px
  font-size 13px
  cursor pointer
  border none
  transition all 0.2s

.syp-btn-text
  background transparent
  color #646a73
  &:hover
    background #f5f6f7
</style>
