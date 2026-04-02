<template>
  <div class="syp-v2">
    <div class="syp-panel">
      <div class="syp-header">
        <div class="syp-header-title">{{ panelTitle }}</div>
        <div class="syp-header-actions">
          <button class="syp-btn syp-btn-text" @click="close">✕</button>
        </div>
      </div>

      <UnifiedWorkspaceShell :initial-view="props.initialView">
        <template #main>
          <section class="syp-stage-card">
            <div class="syp-stage-card__eyebrow">
              {{ props.initialView === "settings" ? "Milestone 1 / Settings Shell" : "Milestone 1 / Quick Publish Shell" }}
            </div>
            <h1 class="syp-stage-card__title">{{ heroTitle }}</h1>
            <p class="syp-stage-card__desc">{{ panelDesc }}</p>

            <div class="syp-stage-card__grid">
              <div class="syp-mini-card">
                <div class="syp-mini-card__label">品牌区</div>
                <div class="syp-mini-card__value">已接入骨架</div>
              </div>
              <div class="syp-mini-card">
                <div class="syp-mini-card__label">导航区</div>
                <div class="syp-mini-card__value">
                  {{ props.initialView === "settings" ? "设置展开态可见" : "主界面态隐藏" }}
                </div>
              </div>
              <div class="syp-mini-card">
                <div class="syp-mini-card__label">详情区</div>
                <div class="syp-mini-card__value">
                  {{ props.initialView === "settings" ? "骨架已就位" : "等待后续阶段" }}
                </div>
              </div>
            </div>
          </section>
        </template>

        <template #detail>
          <section class="syp-detail-card">
            <div class="syp-detail-card__eyebrow">Detail Skeleton</div>
            <h2 class="syp-detail-card__title">配置详情区</h2>
            <p class="syp-detail-card__desc">Milestone 1 仅建立布局骨架，真实表单将在后续里程碑接入。</p>
            <div class="syp-detail-card__placeholder"></div>
            <div class="syp-detail-card__placeholder short"></div>
            <div class="syp-detail-card__placeholder"></div>
          </section>
        </template>
      </UnifiedWorkspaceShell>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import "~/src/assets/v2/base.styl";
import UnifiedWorkspaceShell from "~/src/components/v2/layout/UnifiedWorkspaceShell.vue";

const props = defineProps<{
  initialView?: "quick_publish" | "settings"
  onClose?: () => void
}>()

const panelTitle = computed(() => {
  return props.initialView === "settings" ? "发布工具 V2 · 设置" : "发布工具 V2 · 快速发布"
})

const panelDesc = computed(() => {
  return props.initialView === "settings" ? "新版设置工作壳骨架已经接入，真实配置流程将在后续里程碑补齐。" : "新版主界面工作壳骨架已经接入，真实平台数据将在后续里程碑补齐。"
})

const heroTitle = computed(() => {
  return props.initialView === "settings" ? "Unified Workspace Shell" : "Quick Publish Workspace"
})

function close() {
  props.onClose?.()
}
</script>

<style scoped lang="stylus">
.syp-v2
  width 860px
  max-width calc(100vw - 48px)

.syp-panel
  min-height 520px

.syp-stage-card
  display flex
  flex-direction column
  gap 16px

.syp-stage-card__eyebrow
  font-size 12px
  letter-spacing 0.08em
  text-transform uppercase
  color #7b8490

.syp-stage-card__title
  margin 0
  font-size 42px
  line-height 1
  color #1f2329

.syp-stage-card__desc
  margin 0
  font-size 16px
  color #646a73

.syp-stage-card__grid
  display grid
  grid-template-columns repeat(3, minmax(0, 1fr))
  gap 12px

.syp-mini-card
  padding 16px
  border-radius 12px
  background linear-gradient(180deg, #ffffff 0%, #f6f8fb 100%)
  border 1px solid #e9edf3

.syp-mini-card__label
  font-size 12px
  color #7b8490
  margin-bottom 8px

.syp-mini-card__value
  font-size 15px
  font-weight 600
  color #1f2329

.syp-detail-card
  display flex
  flex-direction column
  gap 14px

.syp-detail-card__eyebrow
  font-size 12px
  text-transform uppercase
  letter-spacing 0.08em
  color #7b8490

.syp-detail-card__title
  margin 0
  font-size 24px
  color #1f2329

.syp-detail-card__desc
  margin 0
  font-size 14px
  color #646a73

.syp-detail-card__placeholder
  height 44px
  border-radius 10px
  background linear-gradient(90deg, #eef2f7 0%, #f7f9fc 100%)

  &.short
    width 62%

@media (max-width: 960px)
  .syp-v2
    width auto
    max-width calc(100vw - 24px)

  .syp-stage-card__grid
    grid-template-columns 1fr
</style>
