<template>
  <section class="syp-settings-page">
    <div class="syp-settings-page__header">
      <div>
        <div class="syp-settings-page__eyebrow">账号设置</div>
        <h2 class="syp-settings-page__title">选择平台</h2>
      </div>
    </div>

    <div class="syp-platform-select-list">
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        class="syp-platform-select-item"
        @click="$emit('select', item)"
      >
        <div class="syp-platform-select-item__icon">
          <span v-if="item.platformIcon" v-html="item.platformIcon"></span>
          <span v-else>{{ item.platformName.slice(0, 1) }}</span>
        </div>
        <div class="syp-platform-select-item__info">
          <div class="syp-platform-select-item__name">{{ item.platformName }}</div>
          <div class="syp-platform-select-item__desc">第一次优先使用预设 key，已有预设时自动生成新 key。</div>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { V2SelectablePlatform } from "~/src/composables/v2/useV2Settings.ts"

defineProps<{
  items: V2SelectablePlatform[]
}>()

defineEmits<{
  (event: "select", item: V2SelectablePlatform): void
}>()
</script>

<style scoped lang="stylus">
.syp-settings-page
  display flex
  flex-direction column
  gap 18px
  height 100%
  min-height 0

.syp-settings-page__header
  display flex
  justify-content space-between
  align-items flex-start
  gap 12px
  flex-shrink 0

.syp-settings-page__eyebrow
  font-size 12px
  color #7b8490
  letter-spacing 0.08em
  text-transform uppercase

.syp-settings-page__title
  margin 6px 0 0 0
  font-size 28px
  color #1f2329

.syp-platform-select-list
  display flex
  flex-direction column
  flex 1
  gap 12px
  min-height 0
  overflow-y auto
  padding-right 6px

.syp-platform-select-item
  width 100%
  display flex
  gap 14px
  align-items center
  padding 18px
  border 1px solid #e6ebf2
  border-radius 16px
  background linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)
  cursor pointer
  text-align left

  &:hover
    border-color #c8d6ea
    background #fff

.syp-platform-select-item__icon
  width 44px
  height 44px
  border-radius 12px
  background #f2f5fa
  display flex
  align-items center
  justify-content center
  color #355d90
  flex-shrink 0

  :deep(svg), :deep(img)
    width 22px
    height 22px

.syp-platform-select-item__name
  font-size 16px
  font-weight 600
  color #1f2329

.syp-platform-select-item__desc
  margin-top 4px
  font-size 13px
  color #667085
</style>
