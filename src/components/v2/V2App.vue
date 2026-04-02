<template>
  <div
    class="syp-v2"
    @click.stop
    @mousedown.stop
    @mouseup.stop
    @pointerdown.stop
    @touchstart.stop
  >
    <div class="syp-panel">
      <div class="syp-header">
        <div class="syp-header-title-group">
          <div class="syp-header-chip">
            <LucideSend class="syp-header-chip__icon" />
            <span>发布工具</span>
          </div>
          <div class="syp-header-title">{{ panelTitle }}</div>
        </div>
        <div class="syp-header-actions">
          <button
            v-if="!isSettingsView"
            class="syp-btn syp-btn-quiet"
            @click.stop="openSettings"
            title="设置"
            aria-label="设置"
          >
            <LucideSettings />
          </button>
          <button
            v-else
            class="syp-btn syp-btn-quiet"
            @click.stop="backToQuickPublish"
            title="返回快速发布"
            aria-label="返回快速发布"
          >
            <LucideArrowLeft />
          </button>
          <button class="syp-btn syp-btn-text" @click.stop="close" title="关闭" aria-label="关闭">
            <LucideX />
          </button>
        </div>
      </div>

      <UnifiedWorkspaceShell :current-view="currentView">
        <section v-if="!isSettingsView" class="syp-quick-shell">
          <div class="syp-quick-shell__eyebrow">当前文档</div>
          <h1 class="syp-quick-shell__title">{{ quickPublish.state.docTitle }}</h1>
          <p class="syp-quick-shell__desc">快速发布态只保留主内容区，设置通过右上角低权重入口进入。</p>

          <div v-if="quickPublish.state.isLoading" class="syp-platform-skeleton-grid">
            <div class="syp-platform-skeleton">
              <div class="syp-platform-skeleton__title">平台列表载入中</div>
              <div class="syp-platform-skeleton__row"></div>
              <div class="syp-platform-skeleton__row short"></div>
              <div class="syp-platform-skeleton__row"></div>
            </div>
            <div class="syp-platform-skeleton">
              <div class="syp-platform-skeleton__title">状态载入中</div>
              <div class="syp-platform-skeleton__row short"></div>
              <div class="syp-platform-skeleton__row"></div>
            </div>
          </div>

          <div v-else-if="!quickPublish.state.hasDocument" class="syp-empty-state">
            <div class="syp-empty-state__title">请先打开一个文档</div>
            <div class="syp-empty-state__desc">V2 主界面会读取当前文档上下文，用于展示可发布平台和后续发布状态。</div>
          </div>

          <div v-else-if="!hasPlatforms" class="syp-empty-state">
            <div class="syp-empty-state__title">暂无已启用的平台</div>
            <div class="syp-empty-state__desc">请从右上角进入设置，添加并启用至少一个平台后再使用快速发布。</div>
          </div>

          <div v-else class="syp-platform-grid">
            <V2PlatformCard
              v-for="item in quickPublish.state.platformItems"
              :key="item.platformKey"
              :platform-name="item.platformName"
              :platform-icon="item.platformIcon"
              :is-authorized="item.isAuthorized"
              :is-published="item.isPublished"
              :tooltip-text="item.tooltipText"
            />
          </div>
        </section>

        <section v-else class="syp-settings-shell">
          <div class="syp-settings-shell__eyebrow">发布设置</div>
          <h1 class="syp-settings-shell__title">设置</h1>
          <p class="syp-settings-shell__desc">设置态只采用左导航 + 右内容区。更深一级页面将直接覆盖右侧内容区，并通过返回按钮返回。</p>

          <div class="syp-settings-shell__content-card">
            <div class="syp-settings-shell__section-title">账号设置</div>
            <div class="syp-settings-shell__placeholder"></div>
            <div class="syp-settings-shell__placeholder short"></div>
            <div class="syp-settings-shell__placeholder"></div>
          </div>
        </section>
      </UnifiedWorkspaceShell>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import "~/src/assets/v2/base.styl"
import LucideArrowLeft from "~icons/lucide/arrow-left"
import LucideSettings from "~icons/lucide/settings"
import LucideSend from "~icons/lucide/send"
import LucideX from "~icons/lucide/x"
import UnifiedWorkspaceShell from "~/src/components/v2/layout/UnifiedWorkspaceShell.vue"
import V2PlatformCard from "~/src/components/v2/publish/V2PlatformCard.vue"
import { useV2QuickPublish } from "~/src/composables/v2/useV2QuickPublish.ts"

const props = defineProps<{
  initialView?: "quick_publish" | "settings"
  onClose?: () => void
}>()

const currentView = ref<"quick_publish" | "settings">(props.initialView ?? "quick_publish")
const isSettingsView = computed(() => currentView.value === "settings")
const quickPublish = useV2QuickPublish()
const hasPlatforms = computed(() => quickPublish.hasPlatforms.value)

const panelTitle = computed(() => {
  return isSettingsView.value ? "发布设置" : "快速发布"
})

onMounted(async () => {
  await quickPublish.init()
})

function openSettings() {
  currentView.value = "settings"
}

function backToQuickPublish() {
  currentView.value = "quick_publish"
}

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

.syp-header-title-group
  display flex
  align-items center
  gap 12px
  min-width 0

.syp-header-chip
  display inline-flex
  align-items center
  gap 8px
  padding 4px 10px
  border-radius 999px
  background #f3f6fa
  color #6a7788
  font-size 12px
  letter-spacing 0.04em

.syp-header-chip__icon
  width 14px
  height 14px

.syp-btn-quiet
  min-width 34px
  height 34px
  padding 0
  background transparent
  color #7b8794
  border-radius 999px

  &:hover
    color #355d90
    background rgba(53, 93, 144, 0.08)

.syp-quick-shell
  display flex
  flex-direction column
  gap 18px

.syp-quick-shell__eyebrow,
.syp-settings-shell__eyebrow
  font-size 12px
  letter-spacing 0.08em
  text-transform uppercase
  color #7b8490

.syp-quick-shell__title,
.syp-settings-shell__title
  margin 0
  font-size 42px
  line-height 1
  color #1f2329

.syp-quick-shell__desc,
.syp-settings-shell__desc
  margin 0
  font-size 16px
  color #646a73

.syp-platform-skeleton-grid,
.syp-platform-grid
  display grid
  grid-template-columns repeat(2, minmax(0, 1fr))
  gap 16px

.syp-platform-skeleton,
.syp-settings-shell__content-card
  padding 20px
  border-radius 14px
  background linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)
  border 1px solid #e6ebf2

.syp-platform-skeleton__title,
.syp-settings-shell__section-title
  font-size 13px
  color #7b8490
  margin-bottom 14px

.syp-platform-skeleton__row,
.syp-settings-shell__placeholder
  height 44px
  border-radius 10px
  background linear-gradient(90deg, #eef2f7 0%, #f7f9fc 100%)
  margin-bottom 12px

  &.short
    width 62%

.syp-empty-state
  display flex
  flex-direction column
  gap 10px
  padding 28px
  border-radius 16px
  background linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)
  border 1px solid #e6ebf2

.syp-empty-state__title
  font-size 20px
  font-weight 600
  color #1f2329

.syp-empty-state__desc
  font-size 14px
  color #667085

.syp-settings-shell
  display flex
  flex-direction column
  gap 18px

@media (max-width: 960px)
  .syp-v2
    width auto
    max-width calc(100vw - 24px)

  .syp-header-title-group
    gap 8px

  .syp-platform-skeleton-grid,
  .syp-platform-grid
    grid-template-columns 1fr
</style>
