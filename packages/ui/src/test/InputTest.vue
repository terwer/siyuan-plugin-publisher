<script setup lang="ts">
import { ref } from 'vue'
import TgInput from "@/components/TgInput.vue";

const input1 = ref('')
const input2 = ref('')
const input3 = ref('')
const input4 = ref('')
</script>

<template>
  <div class="tg-input-test">
    <section class="tg-input-test__section">
      <h2>基础输入框</h2>
      <div class="tg-input-test__row">
        <TgInput v-model="input1" placeholder="请输入" />
      </div>
    </section>

    <section class="tg-input-test__section">
      <h2>不同尺寸</h2>
      <div class="tg-input-test__row">
        <TgInput v-model="input2" size="large" placeholder="大型输入框" />
        <TgInput v-model="input2" placeholder="默认输入框" />
        <TgInput v-model="input2" size="small" placeholder="小型输入框" />
      </div>
    </section>

    <section class="tg-input-test__section">
      <h2>前缀和后缀</h2>
      <div class="tg-input-test__row">
        <TgInput v-model="input3" prefix="￥" placeholder="请输入金额" />
        <TgInput v-model="input3" suffix=".com" placeholder="请输入域名" />
      </div>
    </section>

    <section class="tg-input-test__section">
      <h2>禁用状态</h2>
      <div class="tg-input-test__row">
        <TgInput v-model="input4" disabled placeholder="禁用状态" />
      </div>
    </section>
  </div>
</template>

<style lang="stylus">
.tg-input-test
  &__section
    margin-bottom 20px

    h2
      margin-bottom 10px
      font-size 16px
      color $tg-text-color

  &__row
    display flex
    gap 10px

    .tg-input
      width 200px
</style>
