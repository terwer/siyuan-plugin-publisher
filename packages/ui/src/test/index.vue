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
    <h1>组件测试</h1>
    <nav class="test-nav">
      <router-link to="/test/button" class="test-nav-item">按钮组件</router-link>
      <router-link to="/test/form" class="test-nav-item">表单组件</router-link>
      <router-link to="/test/tab" class="test-nav-item">标签页组件</router-link>
      <router-link to="/test/setting-panel" class="test-nav-item">设置面板组件</router-link>
    </nav>
    <div id="publisherApp" class="test-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import "../styles/global.styl"
</script>

<style lang="stylus">
  .test-container
    padding 20px

  .test-nav
    margin 20px 0
    display flex
    gap 10px

  .test-nav-item
    padding 8px 16px
    border 1px solid #ddd
    border-radius 4px
    text-decoration none
    color #333

    &:hover
      background-color #f5f5f5

    &.router-link-active
      background-color #e6f7ff
      border-color #1890ff
      color #1890ff

  .test-content
    margin-top 20px
    padding 20px
    border 1px solid #eee
    border-radius 4px
</style>
