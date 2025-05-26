<template>
  <div class="pt-button-test-container">
    <h1 class="pt-page-title">按钮测试</h1>

    <div class="pt-test-section">
      <h2 class="pt-section-title">基础按钮</h2>
      <div class="pt-button-group">
        <Button>默认按钮</Button>
        <Button type="primary">主要按钮</Button>
        <Button type="success">成功按钮</Button>
        <Button type="warning">警告按钮</Button>
        <Button type="danger">危险按钮</Button>
      </div>
    </div>

    <div class="pt-test-section">
      <h2 class="pt-section-title">不同尺寸</h2>
      <div class="pt-button-group">
        <Button size="small">小按钮</Button>
        <Button>默认按钮</Button>
        <Button size="large">大按钮</Button>
      </div>
    </div>

    <div class="pt-test-section">
      <h2 class="pt-section-title">禁用状态</h2>
      <div class="pt-button-group">
        <Button disabled>禁用按钮</Button>
        <Button type="primary" disabled>禁用主要按钮</Button>
        <Button type="success" disabled>禁用成功按钮</Button>
        <Button type="warning" disabled>禁用警告按钮</Button>
        <Button type="danger" disabled>禁用危险按钮</Button>
      </div>
    </div>

    <div class="pt-test-section">
      <h2 class="pt-section-title">加载状态</h2>
      <div class="pt-button-group">
        <Button loading>加载中</Button>
        <Button type="primary" loading>加载中</Button>
        <Button type="success" loading>加载中</Button>
        <Button type="warning" loading>加载中</Button>
        <Button type="danger" loading>加载中</Button>
      </div>
    </div>

    <div class="pt-test-section">
      <h2 class="pt-section-title">幽灵按钮</h2>
      <div class="pt-ghost-demo">
        <div class="pt-ghost-content">
          <div class="pt-ghost-text">
            <h3>深色背景上的幽灵按钮</h3>
            <p>不同状态的幽灵按钮展示</p>
          </div>
          <div class="pt-button-group">
            <Button ghost>默认幽灵</Button>
            <Button type="primary" ghost>主要幽灵</Button>
            <Button type="success" ghost>成功幽灵</Button>
            <Button type="warning" ghost>警告幽灵</Button>
            <Button type="danger" ghost>危险幽灵</Button>
          </div>
          <div class="pt-ghost-text">
            <p>幽灵按钮在深色背景上提供清晰的视觉层次</p>
          </div>
        </div>
      </div>
    </div>

    <div class="pt-test-section">
      <h2 class="pt-section-title">图标按钮</h2>
      <div class="pt-button-group">
        <Button>
          <span class="pt-icon">📝</span>
          编辑
        </Button>
        <Button type="primary">
          <span class="pt-icon">➕</span>
          添加
        </Button>
        <Button type="danger">
          <span class="pt-icon">🗑️</span>
          删除
        </Button>
        <Button type="warning">
          <span class="pt-icon">⚠️</span>
          警告
        </Button>
      </div>
    </div>

    <div class="pt-test-section">
      <h2 class="pt-section-title">按钮组</h2>
      <div class="pt-button-group pt-button-group--vertical">
        <Button>按钮1</Button>
        <Button>按钮2</Button>
        <Button>按钮3</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue"
  import { Button, ButtonGroup } from "../components/form"

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

<style lang="stylus">
.pt-button-test-container
  padding 20px

  h1
    margin-bottom 20px
    font-size 24px
    color #333

  .pt-test-section
    margin-bottom 30px

    h2
      margin-bottom 16px
      font-size 18px
      color #333

  .pt-button-group
    display flex
    gap 8px
    margin-bottom 16px

    &--vertical
      flex-direction column
      width 200px

  .pt-ghost-demo
    padding 20px
    background #333
    border 1px solid #444
    border-radius 4px

    .pt-ghost-content
      display flex
      flex-direction column
      justify-content center
      align-items center
      min-height 200px
      background #333
      border-radius 4px
      gap 20px

      .pt-ghost-text
        text-align center
        color #fff

        h3
          font-size 18px
          margin-bottom 8px
          color #fff

        p
          font-size 14px
          color #ccc
          margin 0

  .pt-icon
    margin-right 4px
</style>
