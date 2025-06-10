<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="tg-test-space">
    <h2>Space 间距</h2>

    <!-- 基础用法 -->
    <div class="tg-test-section">
      <h3>基础用法</h3>
      <div class="tg-test-demo">
        <TgSpace>
          <TgButton>按钮1</TgButton>
          <TgButton>按钮2</TgButton>
          <TgButton>按钮3</TgButton>
        </TgSpace>
      </div>
      <div class="tg-test-code">
        <pre><code>&lt;TgSpace&gt;
  &lt;TgButton&gt;按钮1&lt;/TgButton&gt;
  &lt;TgButton&gt;按钮2&lt;/TgButton&gt;
  &lt;TgButton&gt;按钮3&lt;/TgButton&gt;
&lt;/TgSpace&gt;</code></pre>
      </div>
    </div>

    <!-- 垂直间距 -->
    <div class="tg-test-section">
      <h3>垂直间距</h3>
      <div class="tg-test-demo">
        <TgSpace direction="vertical">
          <TgButton>按钮1</TgButton>
          <TgButton>按钮2</TgButton>
          <TgButton>按钮3</TgButton>
        </TgSpace>
      </div>
      <div class="tg-test-code">
        <pre><code>&lt;TgSpace direction="vertical"&gt;
  &lt;TgButton&gt;按钮1&lt;/TgButton&gt;
  &lt;TgButton&gt;按钮2&lt;/TgButton&gt;
  &lt;TgButton&gt;按钮3&lt;/TgButton&gt;
&lt;/TgSpace&gt;</code></pre>
      </div>
    </div>

    <!-- 间距大小 -->
    <div class="tg-test-section">
      <h3>间距大小</h3>
      <div class="tg-test-demo">
        <TgSpace direction="vertical" size="large">
          <TgSpace size="small">
            <TgButton>小间距</TgButton>
            <TgButton>小间距</TgButton>
          </TgSpace>
          <TgSpace size="medium">
            <TgButton>中间距</TgButton>
            <TgButton>中间距</TgButton>
          </TgSpace>
          <TgSpace size="large">
            <TgButton>大间距</TgButton>
            <TgButton>大间距</TgButton>
          </TgSpace>
        </TgSpace>
      </div>
      <div class="tg-test-code">
        <pre><code>&lt;TgSpace direction="vertical" size="large"&gt;
  &lt;TgSpace size="small"&gt;
    &lt;TgButton&gt;小间距&lt;/TgButton&gt;
    &lt;TgButton&gt;小间距&lt;/TgButton&gt;
  &lt;/TgSpace&gt;
  &lt;TgSpace size="medium"&gt;
    &lt;TgButton&gt;中间距&lt;/TgButton&gt;
    &lt;TgButton&gt;中间距&lt;/TgButton&gt;
  &lt;/TgSpace&gt;
  &lt;TgSpace size="large"&gt;
    &lt;TgButton&gt;大间距&lt;/TgButton&gt;
    &lt;TgButton&gt;大间距&lt;/TgButton&gt;
  &lt;/TgSpace&gt;
&lt;/TgSpace&gt;</code></pre>
      </div>
    </div>

    <!-- 对齐方式 -->
    <div class="tg-test-section">
      <h3>对齐方式</h3>
      <div class="tg-test-demo">
        <TgSpace direction="vertical" size="large">
          <TgSpace align="start">
            <TgButton>Start</TgButton>
            <TgButton>Start</TgButton>
          </TgSpace>
          <TgSpace align="center">
            <TgButton>Center</TgButton>
            <TgButton>Center</TgButton>
          </TgSpace>
          <TgSpace align="end">
            <TgButton>End</TgButton>
            <TgButton>End</TgButton>
          </TgSpace>
        </TgSpace>
      </div>
      <div class="tg-test-code">
        <pre><code>&lt;TgSpace direction="vertical" size="large"&gt;
  &lt;TgSpace align="start"&gt;
    &lt;TgButton&gt;Start&lt;/TgButton&gt;
    &lt;TgButton&gt;Start&lt;/TgButton&gt;
  &lt;/TgSpace&gt;
  &lt;TgSpace align="center"&gt;
    &lt;TgButton&gt;Center&lt;/TgButton&gt;
    &lt;TgButton&gt;Center&lt;/TgButton&gt;
  &lt;/TgSpace&gt;
  &lt;TgSpace align="end"&gt;
    &lt;TgButton&gt;End&lt;/TgButton&gt;
    &lt;TgButton&gt;End&lt;/TgButton&gt;
  &lt;/TgSpace&gt;
&lt;/TgSpace&gt;</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TgSpace from "../components/TgSpace.vue"
import TgButton from "../components/TgButton.vue"
</script>

<style lang="stylus">
.tg-test-space
  padding $tg-spacing-lg

  h2
    margin-bottom $tg-spacing-xl
    font-size $tg-font-size-xl
    color var(--tg-color-text-1)

  .tg-test-section
    margin-bottom $tg-spacing-xl

    h3
      margin-bottom $tg-spacing-lg
      font-size $tg-font-size-lg
      color var(--tg-color-text-1)

  .tg-test-demo
    margin-bottom $tg-spacing-lg
    padding $tg-spacing-lg
    background var(--tg-color-bg-2)
    border-radius $tg-border-radius-base

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
</style> 