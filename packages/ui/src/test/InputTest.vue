<script setup lang="ts">
import { ref } from "vue"
import TgInput from "../components/TgInput.vue"

const input1 = ref("")
const input2 = ref("")
const input3 = ref("")
const input4 = ref("")
const input5 = ref("")
const input6 = ref("")
const input7 = ref("")
const input8 = ref("")
const input9 = ref("")
const input10 = ref("")
const input11 = ref("")
const input12 = ref("")
const input13 = ref("")
const input14 = ref("")
const input15 = ref("")
const input16 = ref("")
const input17 = ref("")
const input18 = ref("")
const input19 = ref("")
const input20 = ref("")
</script>

<template>
  <div class="tg-test-container">
    <h2>输入框组件测试</h2>

    <section class="tg-test-section">
      <h3>基础输入框</h3>
      <div class="tg-test-row">
        <TgInput v-model="input1" placeholder="请输入内容" />
      </div>
    </section>

    <section class="tg-test-section">
      <h3>不同尺寸</h3>
      <div class="tg-test-row">
        <TgInput v-model="input2" size="large" placeholder="大型输入框" />
        <TgInput v-model="input3" placeholder="默认输入框" />
        <TgInput v-model="input4" size="small" placeholder="小型输入框" />
      </div>
    </section>

    <section class="tg-test-section">
      <h3>前置/后置内容</h3>
      <div class="tg-test-row">
        <TgInput v-model="input5" prefix="https://" placeholder="请输入网址" />
        <TgInput v-model="input6" suffix=".com" placeholder="请输入域名" />
        <TgInput v-model="input7" prefix="￥" suffix="元" placeholder="请输入金额" />
      </div>
    </section>

    <section class="tg-test-section">
      <h3>状态</h3>
      <div class="tg-test-row">
        <TgInput v-model="input8" disabled placeholder="禁用状态" />
        <TgInput v-model="input9" readonly placeholder="只读状态" />
        <TgInput v-model="input10" clearable placeholder="可清空" />
      </div>
    </section>

    <section class="tg-test-section">
      <h3>验证状态</h3>
      <div class="tg-test-row">
        <TgInput v-model="input11" status="error" placeholder="错误状态" />
        <TgInput v-model="input12" status="warning" placeholder="警告状态" />
        <TgInput v-model="input13" status="success" placeholder="成功状态" />
      </div>
    </section>

    <section class="tg-test-section">
      <h3>密码输入框</h3>
      <div class="tg-test-row">
        <TgInput v-model="input14" type="password" placeholder="请输入密码" />
      </div>
    </section>

    <section class="tg-test-section">
      <h3>文本域</h3>
      <div class="tg-test-row">
        <TgInput v-model="input15" type="textarea" placeholder="基础文本域" />
      </div>
      <div class="tg-test-row">
        <TgInput v-model="input16" type="textarea" placeholder="禁用状态" disabled />
        <TgInput v-model="input17" type="textarea" placeholder="只读状态" readonly />
      </div>
      <div class="tg-test-row">
        <TgInput v-model="input18" type="textarea" placeholder="错误状态" status="error" />
        <TgInput v-model="input19" type="textarea" placeholder="警告状态" status="warning" />
        <TgInput v-model="input20" type="textarea" placeholder="成功状态" status="success" />
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
  margin-bottom: $tg-spacing-md

  .tg-input
    width: 300px
</style>
