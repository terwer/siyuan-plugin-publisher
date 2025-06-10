<template>
  <div id="tg-app">
    <nav class="nav">
      <router-link to="/" class="nav-item">首页</router-link>
      <router-link to="/publish" class="nav-item">发布</router-link>
      <router-link to="/settings" class="nav-item">设置</router-link>
      <router-link to="/ui-test" class="nav-item">UI测试</router-link>
    </nav>
    <main class="main">
      <router-view></router-view>
    </main>
    <button class="theme-btn" @click="toggleTheme">
      {{ theme === "light" ? "🌙" : "☀️" }} {{ theme === "light" ? "暗色模式" : "亮色模式" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from "./composables/useTheme"

const { theme, toggleTheme } = useTheme()
</script>

<style lang="stylus">
@import "@terwer/ui/src/styles/index.styl"

#tg-app
  min-height 100vh
  display flex
  flex-direction column
  background-color var(--tg-color-bg)
  color var(--tg-color-text)
  position relative

.nav
  background-color var(--tg-color-bg)
  padding $tg-spacing-md
  display flex
  gap $tg-spacing-md
  border-bottom 1px solid var(--tg-color-border)
  position sticky
  top 0
  z-index 100

.nav-item
  text-decoration none
  color var(--tg-color-text-2)
  padding $tg-spacing-xs $tg-spacing-md
  border-radius $tg-border-radius-base
  transition all 0.3s ease-in-out

  &:hover
    background-color var(--tg-color-bg-hover)
    color var(--tg-color-text-1)

  &.router-link-active
    background-color var(--tg-color-bg-hover)
    color var(--tg-color-primary)
    font-weight 500

.main
  flex 1
  overflow-y auto
  padding $tg-spacing-md

.theme-btn
  position fixed
  right $tg-spacing-md
  bottom $tg-spacing-md
  z-index 1000
  background-color var(--tg-color-bg)
  border 1px solid var(--tg-color-border)
  border-radius $tg-border-radius-lg
  padding $tg-spacing-xs $tg-spacing-md
  color var(--tg-color-text)
  cursor pointer
  box-shadow 0 2px 8px rgba(0, 0, 0, 0.15)
  transition all 0.3s ease-in-out
  font-size $tg-font-size-base
  line-height $tg-line-height-base

  &:hover
    transform translateY(-2px)
    box-shadow 0 4px 12px rgba(0, 0, 0, 0.2)
</style>
