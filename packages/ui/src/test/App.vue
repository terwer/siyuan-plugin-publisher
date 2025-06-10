<script setup lang="ts">
import { ref } from "vue"
import { TgTabs } from "../index"
import ButtonTest from "./ButtonTest.vue"
import InputTest from "./InputTest.vue"
import FormTest from "./FormTest.vue"
import TabsTest from "./TabsTest.vue"
import CardTest from "./CardTest.vue"
import SpaceTest from "./SpaceTest.vue"
import MessageTest from "./MessageTest.vue"

const tabItems = [
  { key: "button", label: "Button 按钮" },
  { key: "input", label: "Input 输入框" },
  { key: "form", label: "Form 表单" },
  { key: "tabs", label: "Tabs 标签页" },
  { key: "card", label: "Card 卡片" },
  { key: "space", label: "Space 间距" },
  { key: "message", label: "Message 消息提示" },
]

const activeTab = ref(tabItems[0].key)

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

    <main class="tg-test__content">
      <TgTabs v-model="activeTab" :items="tabItems">
        <template #button>
          <ButtonTest />
        </template>
        <template #input>
          <InputTest />
        </template>
        <template #form>
          <FormTest />
        </template>
        <template #tabs>
          <TabsTest />
        </template>
        <template #card>
          <CardTest />
        </template>
        <template #space>
          <SpaceTest />
        </template>
        <template #message>
          <MessageTest />
        </template>
      </TgTabs>
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

  &__content
    padding: $tg-spacing-lg
    border: 1px solid var(--tg-color-border)
    border-radius: $tg-border-radius-base
</style>
