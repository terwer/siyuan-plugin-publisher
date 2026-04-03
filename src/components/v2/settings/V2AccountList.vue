<template>
  <section class="syp-settings-page">
    <div class="syp-settings-page__header">
      <div>
        <div class="syp-settings-page__eyebrow">账号设置</div>
        <h2 class="syp-settings-page__title">账号列表</h2>
      </div>
      <button type="button" class="b3-button" @click="$emit('add')">添加账号</button>
    </div>

    <div v-if="items.length === 0" class="syp-settings-empty">
      <div class="syp-settings-empty__title">暂无已配置账号</div>
      <div class="syp-settings-empty__desc">点击右上角“添加账号”开始创建平台配置。</div>
    </div>

    <div v-else class="syp-account-list">
      <article v-for="item in items" :key="item.platformKey" class="syp-account-item">
        <div class="syp-account-item__main">
          <div class="syp-account-item__icon">
            <span v-if="item.platformIcon" v-html="item.platformIcon"></span>
            <span v-else>{{ item.platformName.slice(0, 1) }}</span>
          </div>
          <div class="syp-account-item__info">
            <div class="syp-account-item__name">{{ item.platformName }}</div>
            <div class="syp-account-item__key">{{ item.platformKey }}</div>
            <div class="syp-account-item__status">{{ item.statusText }}</div>
          </div>
        </div>

        <div class="syp-account-item__actions">
          <button
            type="button"
            class="b3-button b3-button--outline"
            @click="$emit('configure', item.platformKey, item.platformName)"
          >
            授权入口
          </button>
          <button
            type="button"
            class="b3-button b3-button--outline"
            @click="$emit('toggle', item.platformKey, !item.isEnabled)"
          >
            {{ item.isEnabled ? "禁用" : "启用" }}
          </button>
          <button
            type="button"
            class="b3-button b3-button--outline"
            title="删除清理将在 Phase 4 完整接入"
            disabled
          >
            删除
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { V2AccountItem } from "~/src/composables/v2/useV2Settings.ts"

defineProps<{
  items: V2AccountItem[]
}>()

defineEmits<{
  (event: "add"): void
  (event: "configure", platformKey: string, platformName: string): void
  (event: "toggle", platformKey: string, nextEnabled: boolean): void
}>()
</script>

<style scoped lang="stylus">
.syp-settings-page
  display flex
  flex-direction column
  gap 18px
  height 100%
  min-height 0
  overflow hidden

.syp-settings-page__header
  display flex
  justify-content space-between
  align-items center
  gap 12px
  flex-shrink 0
  padding-bottom 16px
  border-bottom 1px solid #e8eaed

.syp-settings-page__eyebrow
  font-size 12px
  color #7b8490
  letter-spacing 0.08em
  text-transform uppercase

.syp-settings-page__title
  margin 6px 0 0 0
  font-size 28px
  color #1f2329

.syp-settings-empty
  padding 20px
  border 1px solid #e6ebf2
  border-radius 14px
  background #fff

.syp-settings-empty__title
  font-size 18px
  font-weight 600
  color #1f2329

.syp-settings-empty__desc
  margin-top 8px
  font-size 14px
  color #667085

.syp-account-list
  display flex
  flex-direction column
  flex 1
  gap 12px
  min-height 0
  overflow-y auto
  padding-right 6px

.syp-account-item
  display flex
  justify-content space-between
  gap 16px
  padding 18px
  border 1px solid #e6ebf2
  border-radius 16px
  background linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)

.syp-account-item__main
  display flex
  gap 14px
  min-width 0

.syp-account-item__icon
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

.syp-account-item__info
  min-width 0

.syp-account-item__name
  font-size 16px
  font-weight 600
  color #1f2329

.syp-account-item__key
  margin-top 4px
  font-size 12px
  color #7b8490

.syp-account-item__status
  margin-top 8px
  font-size 13px
  color #475467

.syp-account-item__actions
  display flex
  flex-wrap wrap
  gap 8px
  align-items flex-start
  justify-content flex-end
</style>
