<template>
  <section class="syp-settings-page">
    <div class="syp-settings-page__header">
      <div>
        <div class="syp-settings-page__eyebrow">账号设置</div>
        <h2 class="syp-settings-page__title">账号列表</h2>
      </div>
      <button type="button" class="syp-btn syp-btn-primary" @click="$emit('add')">
        <span class="syp-btn__icon">+</span>
        添加账号
      </button>
    </div>

    <div v-if="items.length === 0" class="syp-settings-empty">
      <div class="syp-settings-empty__icon">📭</div>
      <div class="syp-settings-empty__title">暂无已配置账号</div>
      <div class="syp-settings-empty__desc">点击右上角"添加账号"开始创建平台配置。</div>
    </div>

    <div v-else class="syp-account-list">
      <article
        v-for="item in items"
        :key="item.platformKey"
        class="syp-account-item"
        :class="`is-${item.statusType}`"
      >
        <div class="syp-account-item__main">
          <div class="syp-account-item__icon">
            <span v-if="item.platformIcon" v-html="item.platformIcon"></span>
            <span v-else>{{ item.platformName.slice(0, 1) }}</span>
          </div>
          <div class="syp-account-item__info">
            <div class="syp-account-item__name-row">
              <span class="syp-account-item__name">{{ item.platformName }}</span>
              <span
                class="syp-status-badge"
                :class="`is-${item.statusType}`"
                :title="item.statusText"
              >
                <span class="syp-status-badge__dot"></span>
                {{ item.statusLabel }}
              </span>
            </div>
            <div class="syp-account-item__key">{{ item.platformKey }}</div>
          </div>
        </div>

        <div class="syp-account-item__actions">
          <!-- 已禁用状态：始终显示删除（与授权状态无关） -->
          <button
            v-if="!item.isEnabled"
            type="button"
            class="syp-btn syp-btn-text is-danger"
            @click="$emit('delete', item.platformKey, item.platformName)"
          >
            删除
          </button>
          <!-- 已启用 + 已授权：显示管理 -->
          <button
            v-else-if="item.isAuth"
            type="button"
            class="syp-btn syp-btn-text"
            @click="$emit('configure', item.platformKey, item.platformName)"
          >
            管理
          </button>
          <!-- 已启用 + 未授权：显示去授权 -->
          <button
            v-else
            type="button"
            class="syp-btn syp-btn-text is-warning"
            @click="$emit('configure', item.platformKey, item.platformName)"
          >
            去授权
          </button>

          <!-- Toggle Switch - 纯图形化，无文字标签 -->
          <button
            type="button"
            class="syp-switch"
            :class="{ 'is-on': item.isEnabled }"
            @click="$emit('toggle', item.platformKey, !item.isEnabled)"
            :title="item.isEnabled ? '点击禁用' : '点击启用'"
            aria-label="item.isEnabled ? '禁用' : '启用'"
          >
            <span class="syp-switch__track">
              <span class="syp-switch__thumb"></span>
            </span>
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
  (event: "delete", platformKey: string, platformName: string): void
}>()
</script>

<style scoped lang="stylus">
// ============================================
// 飞书/字节设计令牌
// ============================================
// 状态颜色
$color-success = #00B42A
$color-success-bg = #E8FFEA
$color-warning = #FF7D00
$color-warning-bg = #FFF7E8
$color-error = #F53F3F
$color-error-bg = #FFECE8
$color-neutral = #86909C
$color-neutral-bg = #F2F3F5

// 文字颜色
$text-primary = #1D2129
$text-secondary = #4E5969
$text-tertiary = #86909C

// 边框和背景
$border-color = #E5E6EB
$bg-hover = #F7F8FA
$bg-card = #FFFFFF

// 圆角和间距
$radius-sm = 6px
$radius-md = 8px
$radius-lg = 12px
$gap-sm = 8px
$gap-md = 12px
$gap-lg = 16px

// ============================================
// 页面布局
// ============================================
.syp-settings-page
  display flex
  flex-direction column
  gap $gap-lg
  height 100%
  min-height 0
  overflow hidden

// 统一头部样式 - 与发布态保持一致
.syp-settings-page__header
  display flex
  justify-content space-between
  align-items flex-start
  gap $gap-md
  flex-shrink 0
  padding-bottom $gap-lg
  border-bottom none

.syp-settings-page__eyebrow
  font-size 12px
  color #7b8490
  letter-spacing 0.08em
  text-transform uppercase

.syp-settings-page__title
  margin 6px 0 0 0
  font-size 28px
  font-weight 600
  color #1f2329

// ============================================
// 按钮组件
// ============================================
.syp-btn
  display inline-flex
  align-items center
  gap 6px
  padding 8px 16px
  font-size 14px
  font-weight 500
  border-radius $radius-md
  border none
  cursor pointer
  transition all 0.2s ease

.syp-btn-primary
  background $text-primary
  color white
  &:hover
    background lighten($text-primary, 10%)

.syp-btn__icon
  font-size 16px
  font-weight 300

.syp-btn-text
  background transparent
  color $text-secondary
  padding 6px 12px
  &:hover
    background $bg-hover
    color $text-primary
  &.is-warning
    color $color-warning
    &:hover
      background $color-warning-bg
  &.is-danger
    color $color-error
    &:hover
      background $color-error-bg

// ============================================
// 空状态
// ============================================
.syp-settings-empty
  display flex
  flex-direction column
  align-items center
  padding 48px 24px
  text-align center

.syp-settings-empty__icon
  font-size 48px
  margin-bottom $gap-md

.syp-settings-empty__title
  font-size 18px
  font-weight 600
  color $text-primary

.syp-settings-empty__desc
  margin-top 8px
  font-size 14px
  color $text-tertiary

// ============================================
// 账号列表
// ============================================
.syp-account-list
  display flex
  flex-direction column
  flex 1
  gap $gap-md
  min-height 0
  overflow-y auto
  padding-right 4px

.syp-account-item
  display flex
  justify-content space-between
  align-items center
  gap $gap-lg
  padding $gap-md $gap-lg
  border 1px solid $border-color
  border-radius $radius-lg
  background $bg-card
  transition all 0.2s ease
  
  &:hover
    border-color darken($border-color, 10%)
    box-shadow 0 2px 8px rgba(0, 0, 0, 0.04)
  
  // 状态通过徽章展示，不使用边框

.syp-account-item__main
  display flex
  align-items center
  gap $gap-md
  min-width 0
  flex 1

.syp-account-item__icon
  width 40px
  height 40px
  border-radius $radius-md
  background linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)
  display flex
  align-items center
  justify-content center
  color #355d90
  flex-shrink 0
  font-size 18px
  font-weight 600

  :deep(svg), :deep(img)
    width 20px
    height 20px

.syp-account-item__info
  min-width 0
  flex 1

.syp-account-item__name-row
  display flex
  align-items center
  gap $gap-sm
  flex-wrap wrap

.syp-account-item__name
  font-size 15px
  font-weight 600
  color $text-primary

.syp-account-item__key
  margin-top 2px
  font-size 12px
  color $text-tertiary
  font-family monospace

// ============================================
// 状态徽章
// ============================================
.syp-status-badge
  display inline-flex
  align-items center
  gap 4px
  padding 2px 8px
  font-size 12px
  font-weight 500
  border-radius 999px
  white-space nowrap
  
  &__dot
    width 6px
    height 6px
    border-radius 50%
  
  &.is-success
    background $color-success-bg
    color $color-success
    .syp-status-badge__dot
      background $color-success
  
  &.is-warning
    background $color-warning-bg
    color $color-warning
    .syp-status-badge__dot
      background $color-warning
  
  &.is-error
    background $color-error-bg
    color $color-error
    .syp-status-badge__dot
      background $color-error
  
  &.is-neutral
    background $color-neutral-bg
    color $color-neutral
    .syp-status-badge__dot
      background $color-neutral

// ============================================
// 操作区
// ============================================
.syp-account-item__actions
  display flex
  align-items center
  gap $gap-sm
  flex-shrink 0
  white-space nowrap

// ============================================
// Toggle Switch - 纯图形化 iOS 风格
// ============================================
.syp-switch
  display inline-flex
  align-items center
  justify-content center
  padding 4px
  background transparent
  border none
  cursor pointer
  user-select none
  flex-shrink 0
  outline none
  -webkit-tap-highlight-color transparent

  &:focus-visible
    .syp-switch__track
      box-shadow 0 0 0 2px rgba($color-success, 0.3)

.syp-switch__track
  position relative
  width 44px
  height 24px
  background $color-neutral-bg
  border-radius 999px
  transition background 0.25s cubic-bezier(0.4, 0, 0.2, 1)
  flex-shrink 0

.syp-switch__thumb
  position absolute
  top 2px
  left 2px
  width 20px
  height 20px
  background white
  border-radius 50%
  box-shadow 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1)
  transition transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)

// Switch 开启状态
.syp-switch.is-on
  .syp-switch__track
    background $color-success

  .syp-switch__thumb
    transform translateX(20px)

// 悬停效果
.syp-switch:hover
  .syp-switch__track
    background darken($color-neutral-bg, 5%)

  &.is-on .syp-switch__track
    background darken($color-success, 5%)

// 点击效果
.syp-switch:active
  .syp-switch__thumb
    width 22px

  &.is-on .syp-switch__thumb
    transform translateX(18px)
</style>
