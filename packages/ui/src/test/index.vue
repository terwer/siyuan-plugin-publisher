<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="test-container">
    <div class="test-header">
      <div class="header-left">
        <h1>组件测试</h1>
        <p class="subtitle">测试各种组件的展示效果和交互</p>
      </div>
      <div class="theme-switch" @click="toggleTheme">
        <span class="icon">{{ isDark ? '☀️' : '🌙' }}</span>
        <span class="text">{{ isDark ? '浅色模式' : '暗色模式' }}</span>
      </div>
    </div>

    <nav class="test-nav">
      <router-link to="/test/button" class="test-nav-item">
        <span class="nav-icon">🔘</span>
        <span class="nav-text">按钮组件</span>
      </router-link>
      <router-link to="/test/form" class="test-nav-item">
        <span class="nav-icon">📝</span>
        <span class="nav-text">表单组件</span>
      </router-link>
      <router-link to="/test/tab" class="test-nav-item">
        <span class="nav-icon">📑</span>
        <span class="nav-text">标签页组件</span>
      </router-link>
      <router-link to="/test/setting-panel" class="test-nav-item">
        <span class="nav-icon">⚙️</span>
        <span class="nav-text">设置面板组件</span>
      </router-link>
    </nav>
    <div id="publisherApp" class="test-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from "vue"
  import Button from "../components/form/Button.vue"
  import "../styles/global.styl"

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
  // Ant Design 主题变量
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

  .test-container
    padding 24px
    background-color $background-color
    min-height 100vh
    transition all 0.3s ease

  .test-header
    display flex
    justify-content space-between
    align-items center
    margin-bottom 24px
    padding-bottom 16px
    border-bottom 1px solid $border-color

    .header-left
      h1
        color $text-color
        margin 0
        font-size 24px
        font-weight 500

      .subtitle
        color $text-color-secondary
        margin 8px 0 0
        font-size 14px

  .theme-switch
    display flex
    align-items center
    gap 8px
    padding 4px 12px
    border-radius 4px
    background-color $component-background
    border 1px solid $border-color
    color $text-color
    cursor pointer
    transition all 0.3s ease
    user-select none

    &:hover
      color $primary-color
      border-color $primary-color

    .icon
      font-size 16px

    .text
      font-size 14px

  .test-nav
    margin 0 0 24px
    display flex
    gap 8px
    padding 4px
    background-color $component-background
    border-radius 4px
    border 1px solid $border-color

  .test-nav-item
    padding 8px 16px
    border-radius 2px
    text-decoration none
    color $text-color
    transition all 0.3s ease
    display flex
    align-items center
    gap 8px
    cursor pointer

    .nav-icon
      font-size 16px

    .nav-text
      font-size 14px

    &:hover
      color $primary-color
      background-color $hover-color

    &.router-link-active
      color $primary-color
      background-color $hover-color
      font-weight 500

  .test-content
    padding 24px
    background-color $component-background
    border-radius 4px
    border 1px solid $border-color
    transition all 0.3s ease
    min-height 500px

  // 路由切换动画
  .fade-enter-active,
  .fade-leave-active
    transition opacity 0.2s ease

  .fade-enter-from,
  .fade-leave-to
    opacity 0
</style>
