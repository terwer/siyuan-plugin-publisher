<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="tg-test-card">
    <h2>Card 卡片</h2>

    <!-- 基础卡片 -->
    <div class="tg-test-section">
      <h3>基础卡片</h3>
      <div class="tg-test-demo">
        <TgCard title="基础卡片">
          <p>这是一个基础卡片的内容。</p>
        </TgCard>
      </div>
      <div class="tg-test-code">
        <pre><code>&lt;TgCard title="基础卡片"&gt;
  &lt;p&gt;这是一个基础卡片的内容。&lt;/p&gt;
&lt;/TgCard&gt;</code></pre>
      </div>
    </div>

    <!-- 无边框卡片 -->
    <div class="tg-test-section">
      <h3>无边框卡片</h3>
      <div class="tg-test-demo">
        <TgCard title="无边框卡片" :bordered="false">
          <p>这是一个无边框卡片的内容。</p>
        </TgCard>
      </div>
      <div class="tg-test-code">
        <pre><code>&lt;TgCard title="无边框卡片" :bordered="false"&gt;
  &lt;p&gt;这是一个无边框卡片的内容。&lt;/p&gt;
&lt;/TgCard&gt;</code></pre>
      </div>
    </div>

    <!-- 自定义头部 -->
    <div class="tg-test-section">
      <h3>自定义头部</h3>
      <div class="tg-test-demo">
        <TgCard>
          <template #header>
            <div class="tg-test-card-header">
              <span>自定义头部</span>
              <TgButton type="text" size="small">更多</TgButton>
            </div>
          </template>
          <p>这是一个带有自定义头部的卡片内容。</p>
        </TgCard>
      </div>
      <div class="tg-test-code">
        <pre><code>&lt;TgCard&gt;
  &lt;template #header&gt;
    &lt;div class="tg-test-card-header"&gt;
      &lt;span&gt;自定义头部&lt;/span&gt;
      &lt;TgButton type="text" size="small"&gt;更多&lt;/TgButton&gt;
    &lt;/div&gt;
  &lt;/template&gt;
  &lt;p&gt;这是一个带有自定义头部的卡片内容。&lt;/p&gt;
&lt;/TgCard&gt;</code></pre>
      </div>
    </div>

    <!-- 带底部卡片 -->
    <div class="tg-test-section">
      <h3>带底部卡片</h3>
      <div class="tg-test-demo">
        <TgCard title="带底部卡片">
          <p>这是一个带底部的卡片内容。</p>
          <template #footer>
            <div class="tg-test-card-footer">
              <TgButton type="primary" size="small">确定</TgButton>
            </div>
          </template>
        </TgCard>
      </div>
      <div class="tg-test-code">
        <pre><code>&lt;TgCard title="带底部卡片"&gt;
  &lt;p&gt;这是一个带底部的卡片内容。&lt;/p&gt;
  &lt;template #footer&gt;
    &lt;div class="tg-test-card-footer"&gt;
      &lt;TgButton type="primary" size="small"&gt;确定&lt;/TgButton&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/TgCard&gt;</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TgCard from "../components/TgCard.vue"
import TgButton from "../components/TgButton.vue"
</script>

<style lang="stylus">
.tg-test-card
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

  .tg-test-card-header
    display flex
    justify-content space-between
    align-items center

  .tg-test-card-footer
    display flex
    justify-content flex-end
</style>
