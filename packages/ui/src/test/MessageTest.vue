<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="tg-test-message">
    <h2>Message 消息提示</h2>

    <!-- 基础用法 -->
    <div class="tg-test-section">
      <h3>基础用法</h3>
      <div class="tg-test-demo">
        <TgSpace>
          <TgButton @click="showMessage('success', '这是一条成功消息')">成功</TgButton>
          <TgButton @click="showMessage('error', '这是一条错误消息')">错误</TgButton>
          <TgButton @click="showMessage('warning', '这是一条警告消息')">警告</TgButton>
          <TgButton @click="showMessage('info', '这是一条信息消息')">信息</TgButton>
        </TgSpace>
      </div>
      <div class="tg-test-code">
        <pre><code>&lt;TgMessage
  :type="message.type"
  :message="message.content"
  :duration="3000"
  @close="message.visible = false"
/&gt;

&lt;TgButton @click="showMessage('success', '这是一条成功消息')"&gt;成功&lt;/TgButton&gt;
&lt;TgButton @click="showMessage('error', '这是一条错误消息')"&gt;错误&lt;/TgButton&gt;
&lt;TgButton @click="showMessage('warning', '这是一条警告消息')"&gt;警告&lt;/TgButton&gt;
&lt;TgButton @click="showMessage('info', '这是一条信息消息')"&gt;信息&lt;/TgButton&gt;</code></pre>
      </div>
    </div>

    <!-- 自定义持续时间 -->
    <div class="tg-test-section">
      <h3>自定义持续时间</h3>
      <div class="tg-test-demo">
        <TgSpace>
          <TgButton @click="showMessageWithDuration('success', '这条消息会显示 5 秒', 5000)">5秒</TgButton>
          <TgButton @click="showMessageWithDuration('info', '这条消息会显示 10 秒', 10000)">10秒</TgButton>
          <TgButton @click="showMessageWithDuration('warning', '这条消息不会自动关闭', 0)">不自动关闭</TgButton>
        </TgSpace>
      </div>
      <div class="tg-test-code">
        <pre><code>&lt;TgMessage
  :type="message.type"
  :message="message.content"
  :duration="message.duration"
  @close="message.visible = false"
/&gt;

&lt;TgButton @click="showMessageWithDuration('success', '这条消息会显示 5 秒', 5000)"&gt;5秒&lt;/TgButton&gt;
&lt;TgButton @click="showMessageWithDuration('info', '这条消息会显示 10 秒', 10000)"&gt;10秒&lt;/TgButton&gt;
&lt;TgButton @click="showMessageWithDuration('warning', '这条消息不会自动关闭', 0)"&gt;不自动关闭&lt;/TgButton&gt;</code></pre>
      </div>
    </div>

    <!-- 消息提示 -->
    <Teleport to="body">
      <TgMessage
        v-if="message.visible"
        :type="message.type"
        :message="message.content"
        :duration="message.duration"
        :onClose="() => message.visible = false"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import TgMessage from "../components/TgMessage.vue"
import TgButton from "../components/TgButton.vue"
import TgSpace from "../components/TgSpace.vue"

interface MessageState {
  visible: boolean
  type: "success" | "error" | "warning" | "info"
  content: string
  duration: number
}

const message = ref<MessageState>({
  visible: false,
  type: "info",
  content: "",
  duration: 3000,
})

const showMessage = (type: MessageState["type"], content: string) => {
  message.value = {
    visible: true,
    type,
    content,
    duration: 3000,
  }
}

const showMessageWithDuration = (type: MessageState["type"], content: string, duration: number) => {
  message.value = {
    visible: true,
    type,
    content,
    duration,
  }
}
</script>

<style lang="stylus">
.tg-test-message
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
</style> 