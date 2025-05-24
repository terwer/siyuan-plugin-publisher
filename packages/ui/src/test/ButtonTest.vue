<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="button-test-container">
    <h2>按钮组件测试</h2>

    <div class="test-section">
      <h3>基础按钮</h3>
      <div class="button-group">
        <Button @click="handleClick('default')">默认按钮</Button>
        <Button type="primary" @click="handleClick('primary')">主要按钮</Button>
        <Button type="dashed" @click="handleClick('dashed')">虚线按钮</Button>
        <Button type="text" @click="handleClick('text')">文本按钮</Button>
        <Button type="link" @click="handleClick('link')">链接按钮</Button>
      </div>
    </div>

    <div class="test-section">
      <h3>不同尺寸</h3>
      <div class="button-group">
        <Button size="small" @click="handleClick('small')">小型按钮</Button>
        <Button @click="handleClick('default')">默认按钮</Button>
        <Button size="large" @click="handleClick('large')">大型按钮</Button>
      </div>
    </div>

    <div class="test-section">
      <h3>禁用状态</h3>
      <div class="button-group">
        <Button disabled @click="handleClick('disabled')">禁用按钮</Button>
        <Button type="primary" disabled @click="handleClick('disabled-primary')">禁用主要按钮</Button>
        <Button type="dashed" disabled @click="handleClick('disabled-dashed')">禁用虚线按钮</Button>
        <Button type="text" disabled @click="handleClick('disabled-text')">禁用文本按钮</Button>
        <Button type="link" disabled @click="handleClick('disabled-link')">禁用链接按钮</Button>
      </div>
    </div>

    <div class="test-section">
      <h3>加载状态</h3>
      <div class="button-group">
        <Button :loading="loading" @click="handleAsyncClick">异步加载按钮</Button>
        <Button type="primary" :loading="loading" @click="handleAsyncClick">异步主要按钮</Button>
        <Button type="dashed" :loading="loading" @click="handleAsyncClick">异步虚线按钮</Button>
      </div>
    </div>

    <div class="test-section">
      <h3>危险按钮</h3>
      <div class="button-group">
        <Button danger @click="handleClick('danger')">危险按钮</Button>
        <Button type="primary" danger @click="handleClick('danger-primary')">危险主要按钮</Button>
        <Button type="dashed" danger @click="handleClick('danger-dashed')">危险虚线按钮</Button>
        <Button type="text" danger @click="handleClick('danger-text')">危险文本按钮</Button>
        <Button type="link" danger @click="handleClick('danger-link')">危险链接按钮</Button>
      </div>
    </div>

    <div class="test-section">
      <h3>幽灵按钮</h3>
      <div class="ghost-demo">
        <div class="ghost-content">
          <p>在深色背景上，幽灵按钮可以保持界面简洁的同时提供良好的可点击性</p>
          <div class="button-group">
            <Button ghost @click="handleClick('ghost')">幽灵按钮</Button>
            <Button type="primary" ghost @click="handleClick('ghost-primary')">幽灵主要按钮</Button>
            <Button type="dashed" ghost @click="handleClick('ghost-dashed')">幽灵虚线按钮</Button>
            <Button type="text" ghost @click="handleClick('ghost-text')">幽灵文本按钮</Button>
            <Button type="link" ghost @click="handleClick('ghost-link')">幽灵链接按钮</Button>
          </div>
        </div>
      </div>
    </div>

    <div class="test-section">
      <h3>块级按钮</h3>
      <div class="button-group">
        <Button block @click="handleClick('block')">块级按钮</Button>
        <Button type="primary" block @click="handleClick('block-primary')">块级主要按钮</Button>
      </div>
    </div>

    <div class="test-section">
      <h3>带图标的按钮</h3>
      <div class="button-group">
        <Button @click="handleClick('icon-left')">
          <template #icon>
            <span class="icon">📝</span>
          </template>
          编辑
        </Button>
        <Button type="primary" @click="handleClick('icon-right')">
          新建
          <template #suffixIcon>
            <span class="icon">➕</span>
          </template>
        </Button>
        <Button type="dashed" @click="handleClick('icon-both')">
          <template #icon>
            <span class="icon">🗑️</span>
          </template>
          删除
          <template #suffixIcon>
            <span class="icon">⚠️</span>
          </template>
        </Button>
      </div>
    </div>

    <div class="test-section">
      <h3>带提示的按钮</h3>
      <div class="button-group">
        <Button tooltip="这是一个提示" @click="handleClick('tooltip')">带提示的按钮</Button>
        <Button type="primary" tooltip="这是一个提示" tooltipPlacement="bottom" @click="handleClick('tooltip-bottom')"
          >底部提示</Button
        >
        <Button type="dashed" tooltip="这是一个提示" tooltipPlacement="left" @click="handleClick('tooltip-left')"
          >左侧提示</Button
        >
        <Button type="text" tooltip="这是一个提示" tooltipPlacement="right" @click="handleClick('tooltip-right')"
          >右侧提示</Button
        >
      </div>
    </div>

    <div class="test-section">
      <h3>按钮组合</h3>
      <div class="button-group">
        <Button.Group>
          <Button type="primary" @click="handleClick('group-1')">按钮1</Button>
          <Button @click="handleClick('group-2')">按钮2</Button>
          <Button type="primary" @click="handleClick('group-3')">按钮3</Button>
        </Button.Group>
      </div>
    </div>

    <div class="test-section">
      <h3>事件测试结果</h3>
      <div class="event-log">
        <p v-for="(log, index) in eventLogs" :key="index">{{ log }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue"
  import Button from "../components/form/Button.vue"

  const loading = ref(false)
  const eventLogs = ref<string[]>([])

  const handleClick = (type: string) => {
    eventLogs.value.push(`点击了 ${type} 按钮`)
  }

  const handleAsyncClick = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      eventLogs.value.push("异步操作完成")
    } finally {
      loading.value = false
    }
  }
</script>

<style lang="stylus" scoped>
  .button-test-container
    padding: 20px
    max-width: 1200px
    margin: 0 auto

  .button-test-container .test-section
    margin-bottom: 40px !important
    padding: 20px !important
    border: 1px solid #eee
    border-radius: 8px
    background-color: #fff

    h3
      margin-bottom: 15px
      color: #333
      font-size: 18px

  .button-group
    display: flex
    flex-wrap: wrap
    gap: 10px
    margin-bottom: 10px

  .ghost-demo
    margin: 0
    padding: 0
    background-color: #001529
    border-radius: 4px
    color: #fff
    overflow: hidden

    .ghost-content
      padding: 24px !important

      p
        margin: 0 0 16px
        color: rgba(255, 255, 255, 0.65)
        font-size: 14px

  .icon
    margin: 0 4px
    font-size: 16px

  .event-log
    background-color: #f5f5f5
    padding: 15px !important
    border-radius: 4px
    max-height: 200px
    overflow-y: auto

    p
      margin: 5px 0
      color: #666
      font-size: 14px
</style>
