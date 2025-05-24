<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div>
    <h2>按钮组件测试</h2>

    <div class="test-section">
      <h3>基础按钮</h3>
      <div class="button-group">
        <Button>默认按钮</Button>
        <Button type="primary">主要按钮</Button>
        <Button type="dashed">虚线按钮</Button>
        <Button type="text">文本按钮</Button>
        <Button type="link">链接按钮</Button>
      </div>
    </div>

    <div class="test-section">
      <h3>不同尺寸</h3>
      <div class="button-group">
        <Button size="small">小型按钮</Button>
        <Button>默认按钮</Button>
        <Button size="large">大型按钮</Button>
      </div>
    </div>

    <div class="test-section">
      <h3>禁用状态</h3>
      <div class="button-group">
        <Button disabled>禁用按钮</Button>
        <Button type="primary" disabled>禁用主要按钮</Button>
        <Button type="dashed" disabled>禁用虚线按钮</Button>
        <Button type="text" disabled>禁用文本按钮</Button>
        <Button type="link" disabled>禁用链接按钮</Button>
      </div>
    </div>

    <div class="test-section">
      <h3>加载状态</h3>
      <div class="button-group">
        <Button loading>加载中</Button>
        <Button type="primary" loading>加载中</Button>
        <Button type="dashed" loading>加载中</Button>
      </div>
    </div>

    <div class="test-section">
      <h3>危险按钮</h3>
      <div class="button-group">
        <Button danger>危险按钮</Button>
        <Button type="primary" danger>危险主要按钮</Button>
        <Button type="dashed" danger>危险虚线按钮</Button>
        <Button type="text" danger>危险文本按钮</Button>
        <Button type="link" danger>危险链接按钮</Button>
      </div>
    </div>

    <div class="test-section">
      <h3>幽灵按钮</h3>
      <div class="button-group dark-bg">
        <Button ghost>幽灵按钮</Button>
        <Button type="primary" ghost>幽灵主要按钮</Button>
        <Button type="dashed" ghost>幽灵虚线按钮</Button>
        <Button type="text" ghost>幽灵文本按钮</Button>
        <Button type="link" ghost>幽灵链接按钮</Button>
      </div>
    </div>

    <div class="test-section">
      <h3>块级按钮</h3>
      <div class="button-group">
        <Button block>块级按钮</Button>
        <Button type="primary" block>块级主要按钮</Button>
      </div>
    </div>

    <div class="test-section">
      <h3>带图标的按钮</h3>
      <div class="button-group">
        <Button>
          <template #icon>
            <span class="icon">📝</span>
          </template>
          编辑
        </Button>
        <Button type="primary">
          <template #icon>
            <span class="icon">➕</span>
          </template>
          新建
        </Button>
        <Button type="dashed">
          <template #icon>
            <span class="icon">🗑️</span>
          </template>
          删除
        </Button>
      </div>
    </div>

    <div class="test-section">
      <h3>带提示的按钮</h3>
      <div class="button-group">
        <Button tooltip="这是一个提示">带提示的按钮</Button>
        <Button type="primary" tooltip="这是一个提示" tooltipPlacement="bottom">底部提示</Button>
        <Button type="dashed" tooltip="这是一个提示" tooltipPlacement="left">左侧提示</Button>
        <Button type="text" tooltip="这是一个提示" tooltipPlacement="right">右侧提示</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Button } from "../index"
</script>

<style lang="stylus" scoped></style>
