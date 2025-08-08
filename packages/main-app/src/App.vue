<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div id="tg-app">
    <TgAppShell
      :nav-items="navItems"
      :collapsed="isCollapsed"
      :current-route="currentRoute"
      @nav-change="handleNavChange"
      @collapse-change="handleCollapseChange"
    >
      <template #nav-header>
        <div class="tg-app-shell__logo">
          <span v-if="!isCollapsed" class="tg-app-shell__logo-text">思源发布</span>
          <span v-else class="tg-app-shell__logo-icon">📝</span>
        </div>
      </template>
      <template #header>
        <div class="tg-app-shell__header">
          <TgSpace>
            <TgButton @click="toggleTheme">
              {{ theme === "light" ? "🌙" : "☀️" }} {{ theme === "light" ? "暗色模式" : "亮色模式" }}
            </TgButton>
          </TgSpace>
        </div>
      </template>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </TgAppShell>
  </div>
</template>

<script setup lang="ts">
// ================ 类型定义 ================
import type { AppShellNavItem } from "@terwer/ui"

// ================ 组件引入 ================
import { TgAppShell, TgButton, TgSpace } from "@terwer/ui"

// ================ 组合式函数调用 ================
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useTheme } from "./composables/useTheme"

// ================ 响应式数据 ================
const { theme, toggleTheme } = useTheme()
const isCollapsed = ref(false)
const router = useRouter()
const route = useRoute()
const currentRoute = ref(route.path)

// ================ 计算属性 ================

// ================ 方法 ================
const handleNavChange = (route: string) => {
  router.push(route)
}

const handleCollapseChange = (collapsed: boolean) => {
  isCollapsed.value = collapsed
  console.log("折叠状态:", collapsed)
}

// ================ 生命周期钩子 ================
watch(
  () => route.path,
  (newPath) => {
    currentRoute.value = newPath
  },
)

// ================ 导航项配置 ================
const navItems: AppShellNavItem[] = [
  { label: "首页", route: "/", icon: "🏠" },
  { label: "发布", route: "/publish", icon: "📝" },
  { label: "设置", route: "/settings", icon: "⚙️" },
  { label: "UI测试", route: "/ui-test", icon: "🧪" },
]
</script>

<style lang="stylus">
@import "@terwer/ui/src/styles/index.styl"

#tg-app
  height 100%
  background-color var(--tg-color-bg)
  color var(--tg-color-text)
  overflow hidden
  display flex
  flex-direction column

.tg-app-shell__logo
  height 64px
  display flex
  align-items center
  justify-content center
  font-size $tg-font-size-lg
  font-weight 500
  color var(--tg-color-text-1)

  .tg-app-shell__logo-text
    font-size $tg-font-size-lg
    font-weight 500

  .tg-app-shell__logo-icon
    font-size 24px
</style>
