<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { Inbox, ToggleLeft, ToggleRight } from "lucide-vue-next"
import { TabEnum } from "../constants/TabEnum"

const props = defineProps<{
  pluginInstance: any
  platforms: Platform[]
  requestSwitchTab?: (component: any) => void
}>()

const gotoAccount = (event: MouseEvent) => {
  // 通过组件类型请求切换
  props.requestSwitchTab?.(TabEnum.ACCOUNT)
  event.stopPropagation()
}
</script>

<template>
  <div class="platform-list">
    <div v-if="platforms.length === 0" class="empty-state">
      <Inbox class="empty-icon" />
      <div class="empty-text">
        <p>暂时没有可用平台</p>
        <p>
          请先去<a class="account-link" @click="gotoAccount">账号管理</a
          >添加账号吧
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
          <component :is="platform.icon" class="platform-icon" />
          <span>{{ platform.name }}</span>
        </div>

        <div class="action-buttons">
          <template v-for="(action, index) in platform.actions" :key="index">
            <!-- 按钮类操作 -->
            <button
              v-if="action.type === 'button'"
              @click="
                (event: MouseEvent) => {
                  action.handler(platform)
                  event.stopPropagation()
                }
              "
              class="action-btn"
            >
              <component :is="action.icon" class="btn-icon" />
              <span class="tooltip">{{ action.label }}</span>
            </button>

            <!-- 切换类操作 -->
            <button
              v-if="action.type === 'toggle'"
              class="toggle-btn"
              @click="
                (event) => {
                  action.handler(platform)
                  event.stopPropagation()
                }
              "
            >
              <div class="toggle-track" :class="{ enabled: platform.enabled }">
                <div class="toggle-thumb"></div>
              </div>
              <span class="tooltip">{{ action.label }}</span>
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
  --pt-platform-tooltip-bg: #4a5568
  --pt-platform-tooltip-text: #f8fafc
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
    --pt-platform-tooltip-bg: #3a3a3a
    --pt-platform-tooltip-text: #f8fafc
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

    &:hover span
      color: var(--pt-platform-text-hover)

    .platform-icon
      width: 16px
      height: 16px
      color: var(--pt-platform-text-light)

  // 操作按钮
  .action-buttons
    display: flex
    gap: 0.4rem
    margin-left: auto

  .action-btn
    position: relative
    padding: 0.3rem
    border: none
    background: none
    cursor: pointer
    color: var(--pt-platform-text-light)
    border-radius: 3px
    transition: all 0.15s

    &:hover
      background: var(--pt-platform-surface)
      color: var(--pt-platform-text)

      .tooltip
        opacity: 1
        visibility: visible

    .btn-icon
      width: 14px
      height: 14px

  // 优化后的开关按钮
  .toggle-btn
    position: relative
    padding: 0
    border: none
    background: transparent
    cursor: pointer
    width: 32px  // 优化点击区域
    height: 24px
    display: flex
    align-items: center
    justify-content: center

    .toggle-track
      margin-top: 0
      position: relative
      width: 28px  // 调小轨道尺寸
      height: 14px  // 降低轨道高度
      border-radius: 7px  // 圆角匹配高度
      background-color: var(--pt-platform-border)
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)  // 添加弹性动画

      &.enabled
        background-color: var(--pt-platform-accent)

    .toggle-thumb
      position: absolute
      left: 2px
      top: 50%
      transform: translateY(-50%)
      width: 10px  // 缩小滑块尺寸
      height: 10px
      background-color: #fff
      border-radius: 50%
      box-shadow: 0 1px 2px var(--pt-platform-shadow)  // 更柔和的阴影
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)  // 同步弹性动画

      .enabled &
        transform: translate(14px, -50%)  // 保持垂直居中同时水平移动

    // 调整工具提示位置
    .tooltip
      top: calc(100% + 8px)
      left: 50%

  // 工具提示
  .tooltip
    position: absolute
    top: calc(100% + 6px)
    left: 50%
    transform: translateX(-50%)
    z-index: 9999
    background: var(--pt-platform-tooltip-bg)
    color: var(--pt-platform-tooltip-text)
    padding: 6px 12px
    border-radius: 4px
    font-size: 0.7rem
    white-space: nowrap
    opacity: 0
    visibility: hidden
    transition: all 0.2s
    box-shadow: 0 2px 4px var(--pt-platform-shadow)
    word-break: keep-all

    &::after
      content: ""
      position: absolute
      top: -8px
      left: 50%
      transform: translateX(-50%)
      border-width: 4px
      border-style: solid
      border-color: transparent transparent var(--pt-platform-tooltip-bg) transparent
</style>
