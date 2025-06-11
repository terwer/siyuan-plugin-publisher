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

    <div class="tg-test-section">
      <h3>基础用法</h3>
      <TgAppShell
        :nav-items="basicNavItems"
        @nav-change="handleNavChange"
        @collapse-change="handleCollapseChange"
      >
        <div class="tg-test-content">
          <h4>内容区域</h4>
          <p>当前选中的路由: {{ currentRoute }}</p>
          <p>导航栏是否折叠: {{ isCollapsed }}</p>
        </div>
      </TgAppShell>
    </div>

    <div class="tg-test-section">
      <h3>自定义宽度</h3>
      <TgAppShell
        :nav-items="basicNavItems"
        :nav-width="240"
        @nav-change="handleNavChange"
        @collapse-change="handleCollapseChange"
      >
        <div class="tg-test-content">
          <h4>内容区域</h4>
          <p>导航栏宽度: 240px</p>
        </div>
      </TgAppShell>
    </div>

    <div class="tg-test-section">
      <h3>禁用导航项</h3>
      <TgAppShell
        :nav-items="disabledNavItems"
        @nav-change="handleNavChange"
        @collapse-change="handleCollapseChange"
      >
        <div class="tg-test-content">
          <h4>内容区域</h4>
          <p>包含禁用的导航项</p>
        </div>
      </TgAppShell>
    </div>

    <div class="tg-test-section">
      <h3>带图标的导航项</h3>
      <TgAppShell
        :nav-items="iconNavItems"
        @nav-change="handleNavChange"
        @collapse-change="handleCollapseChange"
      >
        <div class="tg-test-content">
          <h4>内容区域</h4>
          <p>导航项包含图标</p>
        </div>
      </TgAppShell>
    </div>

    <div class="tg-test-section">
      <h3>固定定位</h3>
      <TgAppShell
        :nav-items="basicNavItems"
        :fixed="true"
        @nav-change="handleNavChange"
        @collapse-change="handleCollapseChange"
      >
        <div class="tg-test-content">
          <h4>内容区域</h4>
          <p>固定在视口</p>
        </div>
      </TgAppShell>
    </div>

    <div class="tg-test-section">
      <h3>隐藏导航栏</h3>
      <TgAppShell
        :nav-items="basicNavItems"
        :show-nav="false"
        @nav-change="handleNavChange"
        @collapse-change="handleCollapseChange"
      >
        <div class="tg-test-content">
          <h4>内容区域</h4>
          <p>不显示导航栏</p>
        </div>
      </TgAppShell>
    </div>

    <div class="tg-test-section">
      <h3>隐藏折叠按钮</h3>
      <TgAppShell
        :nav-items="basicNavItems"
        :show-collapse-button="false"
        @nav-change="handleNavChange"
        @collapse-change="handleCollapseChange"
      >
        <div class="tg-test-content">
          <h4>内容区域</h4>
          <p>不显示折叠按钮</p>
        </div>
      </TgAppShell>
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

  .tg-test-section
    margin-bottom $tg-spacing-xl
    border 1px solid var(--tg-color-border)
    border-radius $tg-border-radius-lg
    overflow hidden

    h3
      margin 0
      padding $tg-spacing-md
      background-color var(--tg-color-bg-hover)
      border-bottom 1px solid var(--tg-color-border)
      font-size $tg-font-size-lg
      color var(--tg-color-text-1)

  .tg-test-content
    padding $tg-spacing-lg
    min-height 200px

    h4
      margin 0 0 $tg-spacing-md
      color var(--tg-color-text-1)

    p
      margin $tg-spacing-xs 0
      color var(--tg-color-text-2)
</style> 