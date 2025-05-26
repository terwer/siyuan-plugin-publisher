<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="pt-test-container">
    <div class="pt-test-header">
      <div class="pt-header-left">
        <h1>组件测试</h1>
        <p class="pt-subtitle">测试各种组件的展示效果和交互</p>
      </div>
      <div class="pt-theme-switch" @click="toggleTheme">
        <span class="pt-icon">{{ isDark ? '☀️' : '🌙' }}</span>
        <span class="pt-text">{{ isDark ? '浅色模式' : '暗色模式' }}</span>
      </div>
    </div>

    <nav class="pt-test-nav">
      <router-link to="/test/button" class="pt-test-nav-item">
        <span class="pt-nav-icon">🔘</span>
        <span class="pt-nav-text">按钮组件</span>
      </router-link>
      <router-link to="/test/form" class="pt-test-nav-item">
        <span class="pt-nav-icon">📝</span>
        <span class="pt-nav-text">表单组件</span>
      </router-link>
      <router-link to="/test/tab" class="pt-test-nav-item">
        <span class="pt-nav-icon">📑</span>
        <span class="pt-nav-text">标签页组件</span>
      </router-link>
      <router-link to="/test/setting-panel" class="pt-test-nav-item">
        <span class="pt-nav-icon">⚙️</span>
        <span class="pt-nav-text">设置面板组件</span>
      </router-link>
    </nav>

    <div class="pt-test-content">
      <router-view v-slot="{ Component }">
        <transition name="pt-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from "vue"

  const isDark = ref(false)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.setAttribute('data-theme-mode', isDark.value ? 'dark' : 'light')
  }

  onMounted(() => {
    // 初始化主题
    const currentTheme = document.documentElement.getAttribute('data-theme-mode')
    isDark.value = currentTheme === 'dark'
  })
</script>

<style lang="stylus">
// 主题变量
$primary-color = #1890ff
$border-color = #d9d9d9
$text-color = rgba(0, 0, 0, 0.85)
$text-color-secondary = rgba(0, 0, 0, 0.45)
$background-color = #f0f2f5
$component-background = #fff
$hover-color = #e6f7ff
$active-color = #1890ff

[data-theme-mode="dark"]
  $primary-color = #177ddc
  $border-color = #434343
  $text-color = rgba(255, 255, 255, 0.85)
  $text-color-secondary = rgba(255, 255, 255, 0.45)
  $background-color = #141414
  $component-background = #1f1f1f
  $hover-color = #111b26
  $active-color = #177ddc

.pt-test-container
  padding 24px
  background-color var(--b3-theme-background)
  min-height 100vh
  transition all 0.3s ease

.pt-test-header
  display flex
  justify-content space-between
  align-items center
  margin-bottom 24px
  padding-bottom 16px
  border-bottom 1px solid var(--b3-border-color)

  .pt-header-left
    h1
      color var(--b3-theme-on-background)
      margin 0
      font-size 24px
      font-weight 500

    .pt-subtitle
      color var(--b3-theme-on-background-secondary)
      margin 8px 0 0
      font-size 14px

.pt-theme-switch
  display flex
  align-items center
  gap 8px
  padding 4px 12px
  border-radius 4px
  background-color var(--b3-theme-background)
  border 1px solid var(--b3-border-color)
  color var(--b3-theme-on-background)
  cursor pointer
  transition all 0.3s ease
  user-select none

  &:hover
    color var(--b3-theme-primary)
    border-color var(--b3-theme-primary)

  .pt-icon
    font-size 16px

  .pt-text
    font-size 14px

.pt-test-nav
  margin 0 0 24px
  display flex
  gap 8px
  padding 4px
  background-color var(--b3-theme-background)
  border-radius 4px
  border 1px solid var(--b3-border-color)

.pt-test-nav-item
  padding 8px 16px
  border-radius 2px
  text-decoration none
  color var(--b3-theme-on-background)
  transition all 0.3s ease
  display flex
  align-items center
  gap 8px
  cursor pointer

  .pt-nav-icon
    font-size 16px

  .pt-nav-text
    font-size 14px

  &:hover
    color var(--b3-theme-primary)
    background-color var(--b3-theme-hover)

  &.router-link-active
    color var(--b3-theme-primary)
    background-color var(--b3-theme-hover)
    font-weight 500

.pt-test-content
  padding 24px
  background-color var(--b3-theme-background)
  border-radius 4px
  border 1px solid var(--b3-border-color)
  transition all 0.3s ease
  min-height 500px

// 路由切换动画
.pt-fade-enter-active,
.pt-fade-leave-active
  transition opacity 0.2s ease

.pt-fade-enter-from,
.pt-fade-leave-to
  opacity 0
</style>
