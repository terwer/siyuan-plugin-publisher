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
      :logo="logo"
      @nav-change="handleNavChange"
      @collapse-change="handleCollapseChange"
    >
      <template #header>
        <button
          class="theme-toggle"
          @click="toggleTheme"
          :title="theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'"
        >
          {{ theme === "light" ? "🌙" : "☀️" }}
        </button>
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
import { TgAppShell } from "@terwer/ui"

// ================ 组合式函数调用 ================
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useTheme } from "./composables/useTheme"
import { useAppInstance } from "@/composables/useAppInstance.ts"
const { getAppContext } = useAppInstance()

// ================ 响应式数据 ================
const { theme, toggleTheme } = useTheme()
const isCollapsed = ref(false)
const router = useRouter()
const route = useRoute()
const currentRoute = ref(route.path)
const ctx = getAppContext()
console.log("ctx", ctx)

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

// ================ Logo 配置 ================
const logo = {
  icon: "📝",
  text: "发布工具",
}
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
</style>
