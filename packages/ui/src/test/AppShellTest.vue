<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="tg-test-app-shell">
    <h2>AppShell 组件测试</h2>

    <div class="tg-test-grid">
      <div class="tg-test-section">
        <h3>基础用法</h3>
        <div class="tg-test-demo">
          <div class="tg-test-demo-container">
            <TgAppShell
              :nav-items="basicNavItems"
              @nav-change="handleNavChange"
              @collapse-change="handleCollapseChange"
            >
              <template #nav-header>
                <div class="tg-app-shell__logo">Logo</div>
              </template>
              <template #header>
                <div class="tg-app-shell__header">Header</div>
              </template>
              <div class="tg-test-content">
                <h4>内容区域</h4>
                <p>当前选中的路由: {{ currentRoute }}</p>
                <p>导航栏是否折叠: {{ isCollapsed }}</p>
              </div>
            </TgAppShell>
          </div>
        </div>
      </div>

      <div class="tg-test-section">
        <h3>自定义宽度</h3>
        <div class="tg-test-demo">
          <div class="tg-test-demo-container">
            <TgAppShell
              :nav-items="basicNavItems"
              :nav-width="240"
              @nav-change="handleNavChange"
              @collapse-change="handleCollapseChange"
            >
              <template #nav-header>
                <div class="tg-app-shell__logo">Logo</div>
              </template>
              <template #header>
                <div class="tg-app-shell__header">Header</div>
              </template>
              <div class="tg-test-content">
                <h4>内容区域</h4>
                <p>导航栏宽度: 240px</p>
              </div>
            </TgAppShell>
          </div>
        </div>
      </div>

      <div class="tg-test-section">
        <h3>带图标的导航项</h3>
        <div class="tg-test-demo">
          <div class="tg-test-demo-container">
            <TgAppShell :nav-items="iconNavItems" @nav-change="handleNavChange" @collapse-change="handleCollapseChange">
              <template #nav-header>
                <div class="tg-app-shell__logo">Logo</div>
              </template>
              <template #header>
                <div class="tg-app-shell__header">Header</div>
              </template>
              <div class="tg-test-content">
                <h4>内容区域</h4>
                <p>导航项包含图标</p>
                <p>折叠时只显示图标</p>
                <p>展开时显示图标和文字</p>
              </div>
            </TgAppShell>
          </div>
        </div>
      </div>

      <div class="tg-test-section">
        <h3>禁用导航项</h3>
        <div class="tg-test-demo">
          <div class="tg-test-demo-container">
            <TgAppShell
              :nav-items="disabledNavItems"
              @nav-change="handleNavChange"
              @collapse-change="handleCollapseChange"
            >
              <template #nav-header>
                <div class="tg-app-shell__logo">Logo</div>
              </template>
              <template #header>
                <div class="tg-app-shell__header">Header</div>
              </template>
              <div class="tg-test-content">
                <h4>内容区域</h4>
                <p>包含禁用的导航项</p>
              </div>
            </TgAppShell>
          </div>
        </div>
      </div>

      <div class="tg-test-section">
        <h3>隐藏导航栏</h3>
        <div class="tg-test-demo">
          <div class="tg-test-demo-container">
            <TgAppShell
              :nav-items="basicNavItems"
              :show-nav="false"
              @nav-change="handleNavChange"
              @collapse-change="handleCollapseChange"
            >
              <template #header>
                <div class="tg-app-shell__header">Header</div>
              </template>
              <div class="tg-test-content">
                <h4>内容区域</h4>
                <p>不显示导航栏</p>
              </div>
            </TgAppShell>
          </div>
        </div>
      </div>

      <div class="tg-test-section">
        <h3>隐藏折叠按钮</h3>
        <div class="tg-test-demo">
          <div class="tg-test-demo-container">
            <TgAppShell
              :nav-items="basicNavItems"
              :show-collapse-button="false"
              @nav-change="handleNavChange"
              @collapse-change="handleCollapseChange"
            >
              <template #nav-header>
                <div class="tg-app-shell__logo">Logo</div>
              </template>
              <template #header>
                <div class="tg-app-shell__header">Header</div>
              </template>
              <div class="tg-test-content">
                <h4>内容区域</h4>
                <p>不显示折叠按钮</p>
              </div>
            </TgAppShell>
          </div>
        </div>
      </div>
    </div>

    <div class="tg-test-code-section">
      <h3>代码示例</h3>
      <div class="tg-test-code">
        <pre><code>// 基础导航项
const basicNavItems = [
  { label: "首页", route: "/" },
  { label: "发布", route: "/publish" },
  { label: "设置", route: "/settings" },
]

// 带图标的导航项
const iconNavItems = [
  { label: "首页", route: "/", icon: "🏠" },
  { label: "发布", route: "/publish", icon: "📝" },
  { label: "设置", route: "/settings", icon: "⚙️" },
  { label: "文档", route: "/docs", icon: "📚" },
  { label: "统计", route: "/stats", icon: "📊" },
  { label: "用户", route: "/user", icon: "👤" },
  { label: "通知", route: "/notifications", icon: "🔔" },
  { label: "帮助", route: "/help", icon: "❓" },
]

// 禁用的导航项
const disabledNavItems = [
  { label: "首页", route: "/" },
  { label: "发布", route: "/publish", disabled: true },
  { label: "设置", route: "/settings" },
]</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { TgAppShell } from "../index"
import type { AppShellNavItem } from "../types"

const currentRoute = ref("")
const isCollapsed = ref(false)

const basicNavItems: AppShellNavItem[] = [
  { label: "首页", route: "/" },
  { label: "发布", route: "/publish" },
  { label: "设置", route: "/settings" },
]

const disabledNavItems: AppShellNavItem[] = [
  { label: "首页", route: "/" },
  { label: "发布", route: "/publish", disabled: true },
  { label: "设置", route: "/settings" },
]

const iconNavItems: AppShellNavItem[] = [
  { label: "首页", route: "/", icon: "🏠" },
  { label: "发布", route: "/publish", icon: "📝" },
  { label: "设置", route: "/settings", icon: "⚙️" },
  { label: "文档", route: "/docs", icon: "📚" },
  { label: "统计", route: "/stats", icon: "📊" },
  { label: "用户", route: "/user", icon: "👤" },
  { label: "通知", route: "/notifications", icon: "🔔" },
  { label: "帮助", route: "/help", icon: "❓" },
]

const handleNavChange = (route: string) => {
  currentRoute.value = route
  console.log("导航到:", route)
}

const handleCollapseChange = (collapsed: boolean) => {
  isCollapsed.value = collapsed
  console.log("折叠状态:", collapsed)
}
</script>

<style lang="stylus">
.tg-test-app-shell
  padding $tg-spacing-lg
  min-height 100vh
  display flex
  flex-direction column
  background-color var(--tg-color-bg)

  h2
    margin-bottom $tg-spacing-xl
    font-size $tg-font-size-xl
    color var(--tg-color-text-1)

  .tg-test-grid
    display grid
    grid-template-columns repeat(auto-fit, minmax(400px, 1fr))
    gap $tg-spacing-lg
    margin-bottom $tg-spacing-xl
    flex 1

  .tg-test-section
    border 1px solid var(--tg-color-border)
    border-radius $tg-border-radius-lg
    overflow hidden
    display flex
    flex-direction column

    h3
      margin 0
      padding $tg-spacing-md
      background-color var(--tg-color-bg-hover)
      border-bottom 1px solid var(--tg-color-border)
      font-size $tg-font-size-lg
      color var(--tg-color-text-1)

  .tg-test-demo
    height 400px
    background var(--tg-color-bg-2)
    border-radius $tg-border-radius-base
    overflow hidden
    flex 1

  .tg-test-demo-container
    height 100%
    width 100%
    position relative

  .tg-test-content
    padding $tg-spacing-lg
    min-height 200px

    h4
      margin 0 0 $tg-spacing-md
      color var(--tg-color-text-1)

    p
      margin $tg-spacing-xs 0
      color var(--tg-color-text-2)

  .tg-test-code-section
    margin-top $tg-spacing-xl
    padding $tg-spacing-lg
    background var(--tg-color-bg-2)
    border-radius $tg-border-radius-lg

    h3
      margin 0 0 $tg-spacing-lg
      font-size $tg-font-size-lg
      color var(--tg-color-text-1)

  .tg-test-code
    pre
      margin 0
      padding $tg-spacing-md
      background var(--tg-color-bg)
      border 1px solid var(--tg-color-border)
      border-radius $tg-border-radius-base
      font-family monospace
      font-size $tg-font-size-sm
      line-height 1.5
      overflow-x auto

      code
        display block
        padding $tg-spacing-sm
        background none
        border none
        white-space pre-wrap
        word-break break-all
        color var(--tg-color-text-1)

.tg-app-shell__logo
  height 64px
  display flex
  align-items center
  justify-content center
  font-size $tg-font-size-lg
  font-weight 500
  color var(--tg-color-text-1)
  border-bottom 1px solid var(--tg-color-border)

.tg-app-shell__header
  height 64px
  display flex
  align-items center
  padding 0 $tg-spacing-lg
  font-size $tg-font-size-lg
  font-weight 500
  color var(--tg-color-text-1)
  border-bottom 1px solid var(--tg-color-border)
</style>
