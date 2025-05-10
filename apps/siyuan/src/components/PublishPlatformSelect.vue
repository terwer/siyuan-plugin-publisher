<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2022-2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { AbstractPlatform } from "@/types"
import Svg from "@components/Svg.vue"
import { useI18n } from "@composables/useI18n.ts"
import { TabEnum } from "@enums/TabEnum.ts"
import { Inbox } from "lucide-vue-next"

const props = defineProps<{
  pluginInstance: any
  platforms: AbstractPlatform[]
  requestSwitchTab?: (component: any) => void
}>()

const { t } = useI18n(props.pluginInstance)

const gotoAccount = (event: MouseEvent) => {
  if (!props.requestSwitchTab) {
    console.warn("requestSwitchTab is not provided")
    return
  }
  props.requestSwitchTab(TabEnum.ACCOUNT)
  event.stopPropagation()
}
</script>

<template>
  <div class="platform-list">
    <div v-if="platforms.length === 0" class="empty-state">
      <Inbox class="empty-icon" />
      <div class="empty-text">
        <p>{{ t("platformSelect.no") }}</p>
        <p>
          {{ t("platformSelect.noTip1") }}
          <a class="account-link" @click.stop="gotoAccount">
            {{ t("account.account") }}
          </a>
          {{ t("platformSelect.noTip2") }}
        </p>
      </div>
    </div>
    <ul v-else>
      <li
        v-for="platform in platforms"
        :key="platform.name"
        class="platform-item"
      >
        <div class="platform-info">
          <Svg
            :svg="platform.icon"
            class="platform-icon"
            :class="`status-${platform.status || 'default'}`"
          />
          <span :class="`status-${platform.status || 'default'}`">
            {{ platform.name }}
          </span>
        </div>

        <div class="action-buttons">
          <template v-for="(action, index) in platform.actions" :key="index">
            <!-- 按钮类操作 -->
            <button
              v-if="action.type === 'button'"
              @click.stop="
                (event: MouseEvent) => {
                  if (!action.handler) {
                    event.stopPropagation()
                    return
                  }
                  action.handler(event, platform)
                  event.stopPropagation()
                }
              "
              class="action-btn"
            >
              <component :is="action.icon" class="btn-icon" />
              <span
                class="tooltip"
                :class="{
                  left: index === platform.actions.length - 1,
                  right: index === 0,
                  bottom: index === 0 || index === platform.actions.length - 1,
                  top: index !== 0 && index !== platform.actions.length - 1,
                }"
                >{{ action.label }}</span
              >
            </button>

            <!-- 切换类操作 -->
            <button
              v-if="action.type === 'toggle'"
              class="toggle-btn"
              :class="{ enabled: platform.enabled }"
              @click.stop="
                (event) => {
                  if (!action.handler) {
                    event.stopPropagation()
                    return
                  }
                  action.handler(event, platform)
                  event.stopPropagation()
                }
              "
            >
              <div class="toggle-track">
                <div class="toggle-thumb"></div>
              </div>
              <span
                class="tooltip"
                :class="{
                  left: index === platform.actions.length - 1,
                  right: index === 0,
                  bottom: index === 0 || index === platform.actions.length - 1,
                  top: index !== 0 && index !== platform.actions.length - 1,
                }"
                >{{ action.label }}</span
              >
            </button>
          </template>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="stylus" scoped>
// 组件容器内定义设计变量
.platform-list
  // 基础变量
  --pt-platform-bg: #fff
  --pt-platform-surface: #edf2f7
  --pt-platform-text: #4a5568
  --pt-platform-text-hover: #2d3748
  --pt-platform-text-light: #718096
  --pt-platform-border: #cbd5e0
  --pt-platform-accent: #4299e1
  --pt-platform-accent-hover: #3182ce
  --pt-platform-tooltip-bg: #1a202c
  --pt-platform-tooltip-text: #ffffff
  --pt-platform-tooltip-success-bg: #10b981
  --pt-platform-tooltip-error-bg: #ef4444
  --pt-platform-shadow: rgba(0, 0, 0, 0.1)

  // 暗黑模式变量
  html[data-theme-mode="dark"] &
    --pt-platform-bg: #2d2d2d
    --pt-platform-surface: #363636
    --pt-platform-text: #e2e8f0
    --pt-platform-text-hover: #f8fafc
    --pt-platform-text-light: #a0aec0
    --pt-platform-border: #4a5568
    --pt-platform-accent: #63b3ed
    --pt-platform-accent-hover: #4299e1
    --pt-platform-tooltip-bg: #1a202c
    --pt-platform-tooltip-text: #ffffff
    --pt-platform-tooltip-success-bg: #059669
    --pt-platform-tooltip-error-bg: #dc2626
    --pt-platform-shadow: rgba(0, 0, 0, 0.3)

  // 布局样式
  isolation: isolate
  padding: 0.25rem
  min-width: 400px
  max-width: 800px
  margin: 0 auto
  position: relative
  z-index: 66

  // 空状态
  .empty-state
    display: flex
    flex-direction: column
    align-items: center
    padding: 2rem
    text-align: center

    .empty-icon
      width: 64px
      height: 64px
      color: var(--pt-platform-border)
      margin-bottom: 1rem

    .empty-text
      color: var(--pt-platform-text-light)
      font-size: 0.9rem
      line-height: 1.6

      p:first-child
        font-weight: 500
        color: var(--pt-platform-text)

      .account-link
        color: var(--pt-platform-accent)
        cursor: pointer
        text-decoration: underline
        transition: color 0.2s

        &:hover
          color: var(--pt-platform-accent-hover)

  // 平台列表
  ul
    list-style: none
    padding: 0
    margin: 0

  .platform-item
    display: flex
    align-items: center
    justify-content: space-between
    height: 32px
    padding: 0 0.5rem
    margin: 0 0 8px
    border-radius: 4px
    background: var(--pt-platform-bg)
    transition: background-color 0.2s

    &:hover
      background-color: var(--pt-platform-surface)

  .platform-info
    display: flex
    align-items: center
    gap: 0.4rem
    font-size: 0.7rem
    font-weight: 500

    span
      color: var(--pt-platform-text)
      transition: color 0.2s
      position: relative

      // 状态颜色
      &.status-success
        color: #10b981
        &:hover
          color: #059669
      &.status-warning
        color: #f59e0b
        &:hover
          color: #d97706
      &.status-error
        color: #ef4444
        &:hover
          color: #dc2626
      &.status-default
        color: var(--pt-platform-text)
        &:hover
          color: var(--pt-platform-text-hover)

    &:hover > span
      &.status-success
        color: #059669
      &.status-warning
        color: #d97706
      &.status-error
        color: #dc2626
      &.status-default
        color: var(--pt-platform-text-hover)

    .platform-icon
      width: 16px
      height: 16px
      color: var(--pt-platform-text-light)
      transition: color 0.2s

      &.status-success
        color: #10b981
        &:hover
          color: #059669
      &.status-warning
        color: #f59e0b
        &:hover
          color: #d97706
      &.status-error
        color: #ef4444
        &:hover
          color: #dc2626
      &.status-default
        color: var(--pt-platform-text-light)
        &:hover
          color: var(--pt-platform-text)

  // 工具提示
  .tooltip
    position: absolute
    top: -28px
    left: 50%
    transform: translateX(-50%)
    z-index: 99999
    background: var(--pt-platform-tooltip-bg)
    color: var(--pt-platform-tooltip-text) !important
    padding: 6px 8px
    border-radius: 3px
    font-size: 0.7rem
    white-space: nowrap
    opacity: 0
    visibility: hidden
    transition: opacity 0.2s ease, visibility 0.2s ease
    box-shadow: 0 2px 4px var(--pt-platform-shadow)
    pointer-events: none
    font-weight: 500
    display: inline-block
    line-height: 1
    text-align: center

    // 添加不同状态下的样式
    &.status-success
      background: var(--pt-platform-tooltip-success-bg)
      color: #ffffff !important
    &.status-error
      background: var(--pt-platform-tooltip-error-bg)
      color: #ffffff !important
    &.status-default
      background: var(--pt-platform-tooltip-bg)
      color: var(--pt-platform-tooltip-text) !important

    &.left
      left: auto
      right: 0
      transform: none

    &.right
      left: 0
      transform: none

    // 添加底部定位
    &.bottom
      top: auto
      bottom: -28px

    // 添加顶部定位
    &.top
      top: -28px

  // 操作按钮
  .action-buttons
    display: flex
    gap: 0.4rem
    margin-left: auto
    position: relative
    overflow: visible

  .action-btn
    position: relative
    padding: 0.3rem
    border: none
    background: none
    cursor: pointer
    color: var(--pt-platform-text-light)
    border-radius: 3px
    transition: all 0.15s
    overflow: visible

    svg
      fill none

    &:hover
      background: var(--pt-platform-surface)
      color: var(--pt-platform-text)

      .tooltip
        opacity: 1
        visibility: visible
        transition-delay: 0.1s

    .btn-icon
      width: 14px
      height: 14px

  // 开关按钮
  .toggle-btn
    position: relative
    padding: 0
    border: none
    background: transparent
    cursor: pointer
    width: 32px
    height: 24px
    display: flex
    align-items: center
    justify-content: center

    &:hover
      .tooltip
        opacity: 1
        visibility: visible
        transition-delay: 0.1s

    &.enabled
      .toggle-track
        background-color: var(--pt-platform-accent)
      .toggle-thumb
        transform: translate(16px, -50%) !important

    .toggle-track
      position: relative
      width: 28px
      height: 14px
      border-radius: 7px
      background-color: var(--pt-platform-border)
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

    .toggle-thumb
      position: absolute
      left: 2px
      top: 50%
      transform: translateY(-50%)
      width: 10px
      height: 10px
      background-color: #fff
      border-radius: 50%
      box-shadow: 0 1px 2px var(--pt-platform-shadow)
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)
</style>
