<script setup lang="ts">
import { ref } from "vue"
import TgButton from "../components/TgButton.vue"

const loading = ref(false)
const handleClick = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <div class="tg-test-container">
    <h2>按钮组件测试</h2>

    <section class="tg-test-section">
      <h3>基础按钮</h3>
      <div class="tg-test-row">
        <TgButton>默认按钮</TgButton>
        <TgButton type="primary">主要按钮</TgButton>
        <TgButton type="secondary">次要按钮</TgButton>
        <TgButton type="text">文本按钮</TgButton>
      </div>
    </section>

    <section class="tg-test-section">
      <h3>状态按钮</h3>
      <div class="tg-test-row">
        <TgButton type="success">成功按钮</TgButton>
        <TgButton type="warning">警告按钮</TgButton>
        <TgButton type="danger">危险按钮</TgButton>
        <TgButton disabled>禁用按钮</TgButton>
      </div>
    </section>

    <section class="tg-test-section">
      <h3>尺寸按钮</h3>
      <div class="tg-test-row">
        <TgButton size="large">大型按钮</TgButton>
        <TgButton>默认按钮</TgButton>
        <TgButton size="small">小型按钮</TgButton>
      </div>
    </section>

    <section class="tg-test-section">
      <h3>形状按钮</h3>
      <div class="tg-test-row">
        <TgButton>默认按钮</TgButton>
        <TgButton shape="round">圆角按钮</TgButton>
        <TgButton shape="circle" icon="tg-icon-plus"></TgButton>
      </div>
    </section>

    <section class="tg-test-section">
      <h3>加载状态</h3>
      <div class="tg-test-row">
        <TgButton :loading="loading" @click="handleClick">
          {{ loading ? "加载中" : "点击加载" }}
        </TgButton>
        <TgButton type="primary" :loading="loading" @click="handleClick">
          {{ loading ? "加载中" : "点击加载" }}
        </TgButton>
      </div>
    </section>

    <section class="tg-test-section">
      <h3>块级按钮</h3>
      <div class="tg-test-row">
        <TgButton block>块级按钮</TgButton>
      </div>
    </section>

    <section class="tg-test-section">
      <h3>图标按钮</h3>
      <div class="tg-test-row">
        <TgButton icon="tg-icon-search">搜索</TgButton>
        <TgButton type="primary" icon="tg-icon-download">下载</TgButton>
        <TgButton type="danger" icon="tg-icon-delete">删除</TgButton>
      </div>
    </section>
  </div>
</template>

<style lang="stylus" scoped>
.tg-test-container
  padding: $tg-spacing-lg

.tg-test-section
  margin-bottom: $tg-spacing-xl

  h3
    margin-bottom: $tg-spacing-md
    font-size: $tg-font-size-lg
    color: var(--tg-color-text)

.tg-test-row
  display: flex
  gap: $tg-spacing-md
  flex-wrap: wrap
  align-items: center
</style>
