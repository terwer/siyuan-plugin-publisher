<script setup lang="ts">
import { ref } from 'vue'
import TgButton from "@/components/TgButton.vue";

const loading = ref(false)

const handleClick = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <div class="tg-button-test">
    <section class="tg-button-test__section">
      <h2>基础按钮</h2>
      <div class="tg-button-test__row">
        <TgButton>默认按钮</TgButton>
        <TgButton type="primary">主要按钮</TgButton>
        <TgButton type="text">文本按钮</TgButton>
      </div>
    </section>

    <section class="tg-button-test__section">
      <h2>不同尺寸</h2>
      <div class="tg-button-test__row">
        <TgButton size="large">大型按钮</TgButton>
        <TgButton>默认按钮</TgButton>
        <TgButton size="small">小型按钮</TgButton>
      </div>
    </section>

    <section class="tg-button-test__section">
      <h2>禁用状态</h2>
      <div class="tg-button-test__row">
        <TgButton disabled>禁用按钮</TgButton>
        <TgButton type="primary" disabled>禁用主要按钮</TgButton>
        <TgButton type="text" disabled>禁用文本按钮</TgButton>
      </div>
    </section>

    <section class="tg-button-test__section">
      <h2>加载状态</h2>
      <div class="tg-button-test__row">
        <TgButton type="primary" :loading="loading" @click="handleClick">
          点击加载
        </TgButton>
      </div>
    </section>
  </div>
</template>

<style lang="stylus">
.tg-button-test
  &__section
    margin-bottom 20px

    h2
      margin-bottom 10px
      font-size 16px
      color $tg-text-color

  &__row
    display flex
    gap 10px
</style>
