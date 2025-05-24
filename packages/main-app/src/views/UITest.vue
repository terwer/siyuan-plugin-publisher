<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="pt-component-test">
    <h1>UI 组件测试</h1>

    <!-- 基础组件 -->
    <section class="pt-component-section">
      <h2>基础组件</h2>
      <!-- 按钮测试 -->
      <div class="pt-component-demo">
        <h3>Button 按钮</h3>
        <div class="pt-component-demo__content">
          <div class="pt-component-demo__item">
            <h4>基础按钮</h4>
            <div class="pt-component-demo__row">
              <Button>默认按钮</Button>
              <Button type="primary">主要按钮</Button>
              <Button type="dashed">虚线按钮</Button>
              <Button type="text">文本按钮</Button>
              <Button type="link">链接按钮</Button>
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;Button&gt;默认按钮&lt;/Button&gt;
&lt;Button type="primary"&gt;主要按钮&lt;/Button&gt;
&lt;Button type="dashed"&gt;虚线按钮&lt;/Button&gt;
&lt;Button type="text"&gt;文本按钮&lt;/Button&gt;
&lt;Button type="link"&gt;链接按钮&lt;/Button&gt;</code></pre>
            </div>
          </div>

          <div class="pt-component-demo__item">
            <h4>按钮尺寸</h4>
            <div class="pt-component-demo__row">
              <Button size="small">小按钮</Button>
              <Button size="middle">中按钮</Button>
              <Button size="large">大按钮</Button>
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;Button size="small"&gt;小按钮&lt;/Button&gt;
&lt;Button size="middle"&gt;中按钮&lt;/Button&gt;
&lt;Button size="large"&gt;大按钮&lt;/Button&gt;</code></pre>
            </div>
          </div>

          <div class="pt-component-demo__item">
            <h4>按钮形状</h4>
            <div class="pt-component-demo__row">
              <Button shape="default">默认形状</Button>
              <Button shape="circle">圆形按钮</Button>
              <Button shape="round">圆角按钮</Button>
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;Button shape="default"&gt;默认形状&lt;/Button&gt;
&lt;Button shape="circle"&gt;圆形按钮&lt;/Button&gt;
&lt;Button shape="round"&gt;圆角按钮&lt;/Button&gt;</code></pre>
            </div>
          </div>

          <div class="pt-component-demo__item">
            <h4>按钮状态</h4>
            <div class="pt-component-demo__row">
              <Button disabled>禁用按钮</Button>
              <Button loading>加载按钮</Button>
              <Button danger>危险按钮</Button>
              <Button ghost>幽灵按钮</Button>
              <Button block>块级按钮</Button>
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;Button disabled&gt;禁用按钮&lt;/Button&gt;
&lt;Button loading&gt;加载按钮&lt;/Button&gt;
&lt;Button danger&gt;危险按钮&lt;/Button&gt;
&lt;Button ghost&gt;幽灵按钮&lt;/Button&gt;
&lt;Button block&gt;块级按钮&lt;/Button&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Tooltip 测试 -->
      <div class="pt-component-demo">
        <h3>Tooltip 文字提示</h3>
        <div class="pt-component-demo__content">
          <div class="pt-component-demo__item">
            <h4>基础用法</h4>
            <div class="pt-component-demo__row">
              <Tooltip title="这是一个提示">
                <Button>悬停提示</Button>
              </Tooltip>
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;Tooltip title="这是一个提示"&gt;
  &lt;Button&gt;悬停提示&lt;/Button&gt;
&lt;/Tooltip&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 布局组件 -->
    <section class="pt-component-section">
      <h2>布局组件</h2>

      <!-- FormGroup 测试 -->
      <div class="pt-component-demo">
        <h3>FormGroup 表单项组</h3>
        <div class="pt-component-demo__content">
          <div class="pt-component-demo__item">
            <h4>基础用法</h4>
            <div class="pt-component-demo__row">
              <FormGroup label="用户名">
                <input type="text" placeholder="请输入用户名" />
              </FormGroup>
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;FormGroup label="用户名"&gt;
  &lt;input type="text" placeholder="请输入用户名" /&gt;
&lt;/FormGroup&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据展示组件 -->
    <section class="pt-component-section">
      <h2>数据展示组件</h2>

      <!-- Tab 测试 -->
      <div class="pt-component-demo">
        <h3>Tab 标签页</h3>
        <div class="pt-component-demo__content">
          <div class="pt-component-demo__item">
            <h4>基础用法</h4>
            <div class="pt-component-demo__row">
              <Tab
                :tabs="[
                  { key: '1', title: '标签页1' },
                  { key: '2', title: '标签页2' },
                  { key: '3', title: '标签页3' },
                ]"
              />
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;Tab
  :tabs="[
    { key: '1', title: '标签页1' },
    { key: '2', title: '标签页2' },
    { key: '3', title: '标签页3' },
  ]"
/&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- SettingItem 测试 -->
      <div class="pt-component-demo">
        <h3>SettingItem 设置项</h3>
        <div class="pt-component-demo__content">
          <div class="pt-component-demo__item">
            <h4>基础用法</h4>
            <div class="pt-component-demo__row">
              <SettingItem title="自动保存" description="开启后会自动保存编辑内容">
                <input type="checkbox" />
              </SettingItem>
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;SettingItem
  title="自动保存"
  description="开启后会自动保存编辑内容"
&gt;
  &lt;input type="checkbox" /&gt;
&lt;/SettingItem&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Button, Tooltip, FormGroup, Tab, SettingItem } from "@siyuan-publisher/ui"
</script>

<style lang="stylus">
.pt-component-test
  padding: $spacing-lg
  background-color: #f5f5f5
  min-height: 100vh

  h1
    margin-bottom: $spacing-xl
    text-align: center

  .pt-component-section
    margin-bottom: $spacing-xl
    background: #fff
    border-radius: $border-radius-base
    box-shadow: $box-shadow-base
    overflow: hidden

    h2
      margin: 0
      padding: $spacing-lg
      border-bottom: 1px solid $border-color-split
      background: #fafafa

  .pt-component-demo
    padding: $spacing-lg

    h3
      margin-bottom: $spacing-lg
      padding-bottom: $spacing-sm
      border-bottom: 1px solid $border-color-split
      color: $heading-color

    &__content
      padding: $spacing-lg
      background: #fff
      border-radius: $border-radius-base
      border: 1px solid $border-color-split

    &__item
      margin-bottom: $spacing-xl

      &:last-child
        margin-bottom: 0

      h4
        margin-bottom: $spacing-md
        color: $text-color-secondary
        font-size: $font-size-base

    &__row
      display: flex
      flex-wrap: wrap
      gap: $spacing-md
      align-items: center

      .pt-btn
        margin-bottom: $spacing-sm

    &__code
      margin-top: $spacing-md
      padding: $spacing-md
      background: #f5f5f5
      border-radius: $border-radius-base
      font-family: monospace
      font-size: $font-size-sm
      line-height: 1.5
      overflow-x: auto

      pre
        margin: 0
        padding: 0

      code
        display: block
        padding: $spacing-sm
        background: none
        border: none
        white-space: pre-wrap
        word-break: break-all

    &__description
      margin-top: $spacing-sm
      color: $text-color-secondary
      font-size: $font-size-sm
      line-height: 1.5
</style>
