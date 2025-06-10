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

      <!-- 卡片测试 -->
      <div class="pt-component-demo">
        <h3>Card 卡片</h3>
        <div class="pt-component-demo__content">
          <div class="pt-component-demo__item">
            <h4>基础卡片</h4>
            <div class="pt-component-demo__row">
              <TgCard title="基础卡片">
                <p>这是一个基础卡片的内容。</p>
              </TgCard>
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgCard title="基础卡片"&gt;
  &lt;p&gt;这是一个基础卡片的内容。&lt;/p&gt;
&lt;/TgCard&gt;</code></pre>
            </div>
          </div>

          <div class="pt-component-demo__item">
            <h4>无边框卡片</h4>
            <div class="pt-component-demo__row">
              <TgCard title="无边框卡片" :bordered="false">
                <p>这是一个无边框卡片的内容。</p>
              </TgCard>
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgCard title="无边框卡片" :bordered="false"&gt;
  &lt;p&gt;这是一个无边框卡片的内容。&lt;/p&gt;
&lt;/TgCard&gt;</code></pre>
            </div>
          </div>

          <div class="pt-component-demo__item">
            <h4>自定义头部</h4>
            <div class="pt-component-demo__row">
              <TgCard>
                <template #header>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>自定义头部</span>
                    <TgButton type="text" size="small">更多</TgButton>
                  </div>
                </template>
                <p>这是一个带有自定义头部的卡片内容。</p>
              </TgCard>
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgCard&gt;
  &lt;template #header&gt;
    &lt;div style="display: flex; justify-content: space-between; align-items: center;"&gt;
      &lt;span&gt;自定义头部&lt;/span&gt;
      &lt;TgButton type="text" size="small"&gt;更多&lt;/TgButton&gt;
    &lt;/div&gt;
  &lt;/template&gt;
  &lt;p&gt;这是一个带有自定义头部的卡片内容。&lt;/p&gt;
&lt;/TgCard&gt;</code></pre>
            </div>
          </div>

          <div class="pt-component-demo__item">
            <h4>带底部卡片</h4>
            <div class="pt-component-demo__row">
              <TgCard title="带底部卡片">
                <p>这是一个带底部的卡片内容。</p>
                <template #footer>
                  <div style="display: flex; justify-content: flex-end;">
                    <TgButton type="primary" size="small">确定</TgButton>
                  </div>
                </template>
              </TgCard>
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgCard title="带底部卡片"&gt;
  &lt;p&gt;这是一个带底部的卡片内容。&lt;/p&gt;
  &lt;template #footer&gt;
    &lt;div style="display: flex; justify-content: flex-end;"&gt;
      &lt;TgButton type="primary" size="small"&gt;确定&lt;/TgButton&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/TgCard&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- 按钮测试 -->
      <div class="pt-component-demo">
        <h3>Button 按钮</h3>
        <div class="pt-component-demo__content">
          <div class="pt-component-demo__item">
            <h4>基础按钮</h4>
            <div class="pt-component-demo__row">
              <TgButton>默认按钮</TgButton>
              <TgButton type="primary">主要按钮</TgButton>
              <TgButton type="secondary">次要按钮</TgButton>
              <TgButton type="text">文本按钮</TgButton>
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgButton&gt;默认按钮&lt;/TgButton&gt;
&lt;TgButton type="primary"&gt;主要按钮&lt;/TgButton&gt;
&lt;TgButton type="secondary"&gt;次要按钮&lt;/TgButton&gt;
&lt;TgButton type="text"&gt;文本按钮&lt;/TgButton&gt;</code></pre>
            </div>
          </div>

          <div class="pt-component-demo__item">
            <h4>按钮尺寸</h4>
            <div class="pt-component-demo__row">
              <TgButton size="small">小按钮</TgButton>
              <TgButton>中按钮</TgButton>
              <TgButton size="large">大按钮</TgButton>
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgButton size="small"&gt;小按钮&lt;/TgButton&gt;
&lt;TgButton&gt;中按钮&lt;/TgButton&gt;
&lt;TgButton size="large"&gt;大按钮&lt;/TgButton&gt;</code></pre>
            </div>
          </div>

          <div class="pt-component-demo__item">
            <h4>按钮形状</h4>
            <div class="pt-component-demo__row">
              <TgButton>默认形状</TgButton>
              <TgButton shape="round">圆角按钮</TgButton>
              <TgButton shape="circle" icon="tg-icon-plus"></TgButton>
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgButton&gt;默认形状&lt;/TgButton&gt;
&lt;TgButton shape="round"&gt;圆角按钮&lt;/TgButton&gt;
&lt;TgButton shape="circle" icon="tg-icon-plus"&gt;&lt;/TgButton&gt;</code></pre>
            </div>
          </div>

          <div class="pt-component-demo__item">
            <h4>按钮状态</h4>
            <div class="pt-component-demo__row">
              <TgButton disabled>禁用按钮</TgButton>
              <TgButton :loading="loading" @click="handleLoading">加载按钮</TgButton>
              <TgButton type="danger">危险按钮</TgButton>
              <TgButton type="success">成功按钮</TgButton>
              <TgButton type="warning">警告按钮</TgButton>
              <TgButton block>块级按钮</TgButton>
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgButton disabled&gt;禁用按钮&lt;/TgButton&gt;
&lt;TgButton :loading="loading" @click="handleLoading"&gt;加载按钮&lt;/TgButton&gt;
&lt;TgButton type="danger"&gt;危险按钮&lt;/TgButton&gt;
&lt;TgButton type="success"&gt;成功按钮&lt;/TgButton&gt;
&lt;TgButton type="warning"&gt;警告按钮&lt;/TgButton&gt;
&lt;TgButton block&gt;块级按钮&lt;/TgButton&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入框测试 -->
      <div class="pt-component-demo">
        <h3>Input 输入框</h3>
        <div class="pt-component-demo__content">
          <div class="pt-component-demo__item">
            <h4>基础用法</h4>
            <div class="pt-component-demo__row">
              <TgInput v-model="inputValue" placeholder="请输入内容" />
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgInput v-model="inputValue" placeholder="请输入内容" /&gt;</code></pre>
            </div>
          </div>

          <div class="pt-component-demo__item">
            <h4>输入框尺寸</h4>
            <div class="pt-component-demo__row">
              <TgInput v-model="inputValue" size="small" placeholder="小尺寸" />
              <TgInput v-model="inputValue" placeholder="默认尺寸" />
              <TgInput v-model="inputValue" size="large" placeholder="大尺寸" />
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgInput v-model="inputValue" size="small" placeholder="小尺寸" /&gt;
&lt;TgInput v-model="inputValue" placeholder="默认尺寸" /&gt;
&lt;TgInput v-model="inputValue" size="large" placeholder="大尺寸" /&gt;</code></pre>
            </div>
          </div>

          <div class="pt-component-demo__item">
            <h4>输入框状态</h4>
            <div class="pt-component-demo__row">
              <TgInput v-model="inputValue" disabled placeholder="禁用状态" />
              <TgInput v-model="inputValue" readonly placeholder="只读状态" />
              <TgInput v-model="inputValue" type="password" placeholder="密码输入" />
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgInput v-model="inputValue" disabled placeholder="禁用状态" /&gt;
&lt;TgInput v-model="inputValue" readonly placeholder="只读状态" /&gt;
&lt;TgInput v-model="inputValue" type="password" placeholder="密码输入" /&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- 开关测试 -->
      <div class="pt-component-demo">
        <h3>Switch 开关</h3>
        <div class="pt-component-demo__content">
          <div class="pt-component-demo__item">
            <h4>基础用法</h4>
            <div class="pt-component-demo__row">
              <TgSwitch v-model="switchValue" />
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgSwitch v-model="switchValue" /&gt;</code></pre>
            </div>
          </div>

          <div class="pt-component-demo__item">
            <h4>开关尺寸</h4>
            <div class="pt-component-demo__row">
              <TgSwitch v-model="switchValue" size="small" />
              <TgSwitch v-model="switchValue" />
              <TgSwitch v-model="switchValue" size="large" />
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgSwitch v-model="switchValue" size="small" /&gt;
&lt;TgSwitch v-model="switchValue" /&gt;
&lt;TgSwitch v-model="switchValue" size="large" /&gt;</code></pre>
            </div>
          </div>

          <div class="pt-component-demo__item">
            <h4>开关状态</h4>
            <div class="pt-component-demo__row">
              <TgSwitch v-model="switchValue" disabled />
              <TgSwitch v-model="switchValue" :loading="true" />
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgSwitch v-model="switchValue" disabled /&gt;
&lt;TgSwitch v-model="switchValue" :loading="true" /&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 表单组件 -->
    <section class="pt-component-section">
      <h2>表单组件</h2>

      <!-- 单选框测试 -->
      <div class="pt-component-demo">
        <h3>Radio 单选框</h3>
        <div class="pt-component-demo__content">
          <div class="pt-component-demo__item">
            <h4>基础用法</h4>
            <div class="pt-component-demo__row">
              <TgRadio
                v-model="radioValue"
                :options="[
                  { label: '选项1', value: '1' },
                  { label: '选项2', value: '2' },
                  { label: '选项3', value: '3' },
                ]"
              />
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgRadio
  v-model="radioValue"
  :options="[
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
  ]"
/&gt;</code></pre>
            </div>
          </div>

          <div class="pt-component-demo__item">
            <h4>按钮样式</h4>
            <div class="pt-component-demo__row">
              <TgRadio
                v-model="radioValue"
                :options="[
                  { label: '选项1', value: '1' },
                  { label: '选项2', value: '2' },
                  { label: '选项3', value: '3' },
                ]"
                button-style
              />
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgRadio
  v-model="radioValue"
  :options="[
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
  ]"
  button-style
/&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- 复选框测试 -->
      <div class="pt-component-demo">
        <h3>Checkbox 复选框</h3>
        <div class="pt-component-demo__content">
          <div class="pt-component-demo__item">
            <h4>基础用法</h4>
            <div class="pt-component-demo__row">
              <TgCheckbox
                v-model="checkboxValue"
                :options="[
                  { label: '选项1', value: '1' },
                  { label: '选项2', value: '2' },
                  { label: '选项3', value: '3' },
                ]"
              />
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgCheckbox
  v-model="checkboxValue"
  :options="[
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
  ]"
/&gt;</code></pre>
            </div>
          </div>

          <div class="pt-component-demo__item">
            <h4>按钮样式</h4>
            <div class="pt-component-demo__row">
              <TgCheckbox
                v-model="checkboxValue"
                :options="[
                  { label: '选项1', value: '1' },
                  { label: '选项2', value: '2' },
                  { label: '选项3', value: '3' },
                ]"
                button-style
              />
            </div>
            <div class="pt-component-demo__code">
              <pre><code>&lt;TgCheckbox
  v-model="checkboxValue"
  :options="[
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
  ]"
  button-style
/&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { TgButton, TgInput, TgSwitch, TgRadio, TgCheckbox, TgCard } from "@siyuan-publisher/ui"

const loading = ref(false)
const inputValue = ref("")
const switchValue = ref(false)
const radioValue = ref("1")
const checkboxValue = ref(["1"])

const handleLoading = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<style lang="stylus">
@import "@terwer/ui/src/styles/base/index.styl"

.pt-component-test
  padding $tg-spacing-lg
  background-color var(--tg-color-bg)
  min-height 100vh

  h1
    margin-bottom $tg-spacing-xl
    text-align center
    color var(--tg-color-text-1)

  .pt-component-section
    margin-bottom $tg-spacing-xl
    background var(--tg-color-bg-2)
    border-radius $tg-border-radius-base
    box-shadow 0 2px 8px rgba(0, 0, 0, 0.08)
    overflow hidden

    h2
      margin 0
      padding $tg-spacing-lg
      border-bottom 1px solid var(--tg-color-border)
      background var(--tg-color-bg)
      color var(--tg-color-text-1)

  .pt-component-demo
    padding $tg-spacing-lg

    h3
      margin-bottom $tg-spacing-lg
      padding-bottom $tg-spacing-sm
      border-bottom 1px solid var(--tg-color-border)
      color var(--tg-color-text-1)

    &__content
      padding $tg-spacing-lg
      background var(--tg-color-bg)
      border-radius $tg-border-radius-base
      border 1px solid var(--tg-color-border)

    &__item
      margin-bottom $tg-spacing-xl

      &:last-child
        margin-bottom 0

      h4
        margin-bottom $tg-spacing-md
        color var(--tg-color-text-2)
        font-size $tg-font-size-base

    &__row
      display flex
      flex-wrap wrap
      gap $tg-spacing-md
      align-items center
      margin-bottom $tg-spacing-md

    &__code
      margin-top $tg-spacing-md
      padding $tg-spacing-md 0
      background var(--tg-color-bg-2)
      border-radius $tg-border-radius-base
      font-family monospace
      font-size $tg-font-size-sm
      line-height 1.5
      overflow-x auto

      pre
        margin 0
        padding $tg-spacing-sm
        background var(--tg-color-bg)
        border 1px solid var(--tg-color-border)
        border-radius $tg-border-radius-base

      code
        display block
        padding $tg-spacing-sm
        background none
        border none
        white-space pre-wrap
        word-break break-all
        color var(--tg-color-text-1)
</style>
