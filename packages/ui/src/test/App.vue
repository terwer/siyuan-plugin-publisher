<script setup lang="ts">
import { ref } from "vue"
import ButtonTest from "./ButtonTest.vue"
import InputTest from "./InputTest.vue"

const activeTab = ref("button")

const tabs = [
  { key: "button", label: "按钮" },
  { key: "input", label: "输入框" },
]

const toggleTheme = () => {
  const html = document.documentElement
  const currentTheme = html.getAttribute("data-theme-mode")
  const newTheme = currentTheme === "dark" ? "light" : "dark"
  html.setAttribute("data-theme-mode", newTheme)
}
</script>

<template>
  <div id="tg-app">
    <header class="tg-test__header">
      <h1>Terwer UI 组件库测试</h1>
      <button class="tg-button tg-button--primary" @click="toggleTheme">切换主题</button>
    </header>

    <nav class="tg-test__nav">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tg-button"
        :class="{ 'tg-button--primary': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </nav>

    <main class="tg-test__content">
      <ButtonTest v-if="activeTab === 'button'" />
      <InputTest v-if="activeTab === 'input'" />
    </main>
  </div>
</template>

<style lang="stylus">
#tg-app
  min-height: 100vh
  background-color: var(--tg-color-bg)
  color: var(--tg-color-text)
  padding: $tg-spacing-lg

.tg-test
  padding: $tg-spacing-lg

  &__header
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: $tg-spacing-lg

  &__nav
    margin-bottom: $tg-spacing-lg

    .tg-button
      margin-right: $tg-spacing-sm

  &__content
    padding: $tg-spacing-lg
    border: 1px solid var(--tg-color-border)
    border-radius: $tg-border-radius

// 重置浏览器默认样式
*
  margin: 0
  padding: 0
  box-sizing: border-box

html, body
  margin: 0
  padding: 0
  height: 100%
</style>
