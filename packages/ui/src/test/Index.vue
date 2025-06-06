<script setup lang="ts">
import { ref } from 'vue'
import ButtonTest from './ButtonTest.vue'
import InputTest from './InputTest.vue'

const activeTab = ref('button')

const tabs = [
  { key: 'button', label: '按钮' },
  { key: 'input', label: '输入框' }
]

const toggleTheme = () => {
  const html = document.documentElement
  const currentTheme = html.getAttribute('data-theme-mode')
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  html.setAttribute('data-theme-mode', newTheme)
}

const getSize = () => {
  return window.innerWidth + ' x ' + window.innerHeight
}

const size = ref(getSize())
window.addEventListener('resize', () => {
  size.value = getSize()
})
</script>

<template>
  <div class="tg-test">
    <header class="tg-test__header">
      <h1>Terwer UI 组件库测试</h1>
      <button class="tg-button tg-button--primary" @click="toggleTheme">
        切换主题
      </button>
      <span class="tg-test__size">窗口尺寸：{{ size }}</span>
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
.tg-test
  padding 20px

  &__header
    display flex
    justify-content space-between
    align-items center
    margin-bottom 20px

  &__size
    margin-left 20px
    color $tg-text-color-secondary
    font-size 12px

  &__nav
    margin-bottom 20px

    .tg-button
      margin-right 10px

  &__content
    padding 20px
    border 1px solid $tg-border-color
    border-radius $tg-border-radius
</style>