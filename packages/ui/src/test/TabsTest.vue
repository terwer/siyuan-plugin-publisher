<script setup lang="ts">
import { ref } from "vue"
import TgTabs from "@/components/TgTabs.vue"
import type { TabItem } from "@/types"

const activeKey = ref("1")

const tabs: TabItem[] = [
  { key: "1", label: "标签页1" },
  { key: "2", label: "标签页2" },
  { key: "3", label: "标签页3", disabled: true },
]

const cardTabs: TabItem[] = [
  { key: "1", label: "卡片标签1" },
  { key: "2", label: "卡片标签2" },
  { key: "3", label: "卡片标签3" },
]

const buttonGroupTabs: TabItem[] = [
  { key: "1", label: "按钮组1" },
  { key: "2", label: "按钮组2" },
  { key: "3", label: "按钮组3" },
]

const handleChange = (key: string | number) => {
  console.log("当前选中的标签：", key)
}
</script>

<template>
  <div class="tg-test-container">
    <div class="tg-test-section">
      <h2 class="tg-test-title">基础用法</h2>
      <div class="tg-test-row">
        <TgTabs v-model="activeKey" :items="tabs" @change="handleChange">
          <template #1>
            <div class="tg-test-content">标签页1的内容</div>
          </template>
          <template #2>
            <div class="tg-test-content">标签页2的内容</div>
          </template>
          <template #3>
            <div class="tg-test-content">标签页3的内容</div>
          </template>
        </TgTabs>
      </div>
    </div>

    <div class="tg-test-section">
      <h2 class="tg-test-title">卡片样式</h2>
      <div class="tg-test-row">
        <TgTabs v-model="activeKey" :items="cardTabs" type="card">
          <template #1>
            <div class="tg-test-content">卡片标签1的内容</div>
          </template>
          <template #2>
            <div class="tg-test-content">卡片标签2的内容</div>
          </template>
          <template #3>
            <div class="tg-test-content">卡片标签3的内容</div>
          </template>
        </TgTabs>
      </div>
    </div>

    <div class="tg-test-section">
      <h2 class="tg-test-title">按钮组样式</h2>
      <div class="tg-test-row">
        <TgTabs v-model="activeKey" size="small" :items="buttonGroupTabs" type="button-group">
          <template #1>
            <div class="tg-test-content">按钮组1的内容</div>
          </template>
          <template #2>
            <div class="tg-test-content">按钮组2的内容</div>
          </template>
          <template #3>
            <div class="tg-test-content">按钮组3的内容</div>
          </template>
        </TgTabs>
      </div>
    </div>

    <div class="tg-test-section">
      <h2 class="tg-test-title">尺寸</h2>
      <div class="tg-test-row">
        <TgTabs v-model="activeKey" :items="tabs" size="small">
          <template #1>
            <div class="tg-test-content">小尺寸标签页1的内容</div>
          </template>
          <template #2>
            <div class="tg-test-content">小尺寸标签页2的内容</div>
          </template>
          <template #3>
            <div class="tg-test-content">小尺寸标签页3的内容</div>
          </template>
        </TgTabs>
      </div>
      <div class="tg-test-row">
        <TgTabs v-model="activeKey" :items="tabs" size="large">
          <template #1>
            <div class="tg-test-content">大尺寸标签页1的内容</div>
          </template>
          <template #2>
            <div class="tg-test-content">大尺寸标签页2的内容</div>
          </template>
          <template #3>
            <div class="tg-test-content">大尺寸标签页3的内容</div>
          </template>
        </TgTabs>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.tg-test
  &-container
    padding $tg-spacing-lg

  &-section
    margin-bottom $tg-spacing-xl

  &-title
    font-size $tg-font-size-lg
    color var(--tg-color-text-primary)
    margin-bottom $tg-spacing-md

  &-row
    margin-bottom $tg-spacing-lg
    padding $tg-spacing-md
    border 1px solid var(--tg-color-border)
    border-radius $tg-border-radius-base

  &-content
    padding $tg-spacing-lg
    background-color var(--tg-color-bg-container)
    border-radius $tg-border-radius-base
    min-height 100px

.tg-tabs
  display flex
  flex-direction column
  width 100%

  &-nav
    display flex
    border-bottom 1px solid var(--tg-color-border)
    margin-bottom $tg-spacing-md
    position relative

  &-tab
    padding 0 $tg-spacing-md
    cursor pointer
    transition all 0.3s
    font-size $tg-font-size-base
    color var(--tg-color-text-secondary)
    position relative
    height 40px
    line-height 40px
    margin-right 32px
    border 0
    background none

    &:hover
      color var(--tg-color-primary)

    &-active
      color var(--tg-color-primary)
      font-weight 500

      &::after
        content ''
        position absolute
        bottom -1px
        left 0
        width 100%
        height 2px
        background-color var(--tg-color-primary)

  &-content
    position relative

  &-pane
    display none

    &-active
      display block

  // 卡片样式
  &-card
    .tg-tabs-nav
      border-bottom none
      margin-bottom 0

    .tg-tabs-tab
      border 1px solid var(--tg-color-border)
      border-radius $tg-border-radius-base
      margin-right 2px
      color var(--tg-color-text-primary)
      height 40px
      line-height 40px
      padding 0 16px
      background var(--tg-color-bg-container)
      display flex
      align-items center

      &:hover
        color var(--tg-color-primary)

      &-active
        background-color var(--tg-color-primary)
        color var(--tg-color-white)
        border-color var(--tg-color-primary)

        &:hover
          color var(--tg-color-white)

        &::after
          display none

    .tg-tabs-content
      margin-top $tg-spacing-xs
      padding $tg-spacing-sm
      background var(--tg-color-bg-container)
      border-radius $tg-border-radius-base

  // 按钮组样式
  &-button-group
    .tg-tabs-nav
      border-bottom none
      margin-bottom 0
      display inline-flex
      background var(--tg-color-bg-container)
      border 1px solid var(--tg-color-border)
      border-radius $tg-border-radius-base
      padding 2px

    .tg-tabs-tab
      border none
      border-radius $tg-border-radius-sm
      margin 0
      color var(--tg-color-text-primary)
      height 32px
      line-height 32px
      padding 0 16px
      background none
      display flex
      align-items center
      transition all 0.2s

      &:hover
        color var(--tg-color-primary)

      &-active
        background-color var(--tg-color-primary)
        color var(--tg-color-white)
        border none

        &:hover
          color var(--tg-color-white)

        &::after
          display none

    .tg-tabs-content
      margin-top $tg-spacing-xs
      padding $tg-spacing-sm
      background var(--tg-color-bg-container)
      border-radius $tg-border-radius-base

  // 尺寸变体
  &-small
    .tg-tabs-tab
      height 32px
      line-height 32px
      font-size $tg-font-size-sm
      padding 0 $tg-spacing-md

  &-large
    .tg-tabs-tab
      height 48px
      line-height 48px
      font-size $tg-font-size-lg
      padding 0 $tg-spacing-lg

// 暗黑模式适配
html[data-theme-mode="dark"]
  .tg-tabs
    &-tab
      color var(--tg-color-text-secondary-dark)

      &:hover
        color var(--tg-color-primary-dark)

      &-active
        color var(--tg-color-primary-dark)

        &::after
          background-color var(--tg-color-primary-dark)

    &-card
      .tg-tabs-tab
        border-color var(--tg-color-border-dark)
        color var(--tg-color-text-primary-dark)
        background var(--tg-color-bg-container-dark)

        &:hover
          color var(--tg-color-primary-dark)

        &-active
          background-color var(--tg-color-primary-dark)
          border-color var(--tg-color-primary-dark)
          color var(--tg-color-white)

          &:hover
            color var(--tg-color-white)

      .tg-tabs-content
        background var(--tg-color-bg-container-dark)

    &-button-group
      .tg-tabs-nav
        border-color var(--tg-color-border-dark)
        background var(--tg-color-bg-container-dark)

      .tg-tabs-tab
        color var(--tg-color-text-primary-dark)

        &:hover
          color var(--tg-color-primary-dark)

        &-active
          background-color var(--tg-color-primary-dark)
          color var(--tg-color-white)

          &:hover
            color var(--tg-color-white)

      .tg-tabs-content
        background var(--tg-color-bg-container-dark)
</style>
