<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import Input from "@components/form/Input.vue"
import InputNumber from "@components/form/InputNumber.vue"
import Select from "@components/form/Select.vue"
import Switch from "@components/form/Switch.vue"
import { IS_ENGLISH } from "@/Constants.ts"

const props = defineProps<{
  pluginInstance: any
  settingGroup: SettingGroup
}>()

const getItemLabelStyle = (item: any) => {
  // 优先使用item的labelWidth，其次使用组件默认值，也可设置auto
  let width = item.labelWidth ?? 120
  if (IS_ENGLISH) {
    width = item.labelWidth ?? "auto"
  }
  return {
    "--label-width":
      typeof width === "number"
        ? `${Math.max(80, Math.min(200, width))}px` // 限制安全范围
        : width,
  }
}
</script>

<template>
  <section class="setting-group">
    <!-- 分组标题 -->
    <h2 class="group-title">
      {{ props.settingGroup.title }}
    </h2>

    <!-- 配置项列表 -->
    <div class="group-items">
      <div
        v-for="(item, itemIndex) in props.settingGroup.items"
        :key="itemIndex"
        class="setting-item"
      >
        <!-- 标签区域 -->
        <div class="item-label" :style="getItemLabelStyle(item)">
          {{ item.label }}
        </div>

        <!-- 控件区域 -->
        <div class="item-control">
          <!-- Input类型 -->
          <Input
            v-if="item.type === 'input'"
            v-model="item.value"
            :placeholder="item.placeholder"
            :readonly="item.readonly"
            :disabled="item.disabled"
            :type="item.type"
            :input-type="item.inputType"
          />

          <!-- Switch 类型 -->
          <Switch
            v-if="item.type === 'switch'"
            v-model="item.value"
            :disabled="item.disabled"
          />

          <!-- Select 类型 -->
          <Select
            v-else-if="item.type === 'select'"
            v-model="item.value"
            :options="item.options"
            :disabled="item.disabled"
          />

          <!-- Number 类型 -->
          <InputNumber
            v-else-if="item.type === 'number'"
            v-model="item.value"
            :placeholder="item.placeholder"
            :disabled="item.disabled"
          />

          <!-- 其他类型扩展 -->
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="stylus">
.setting-group
  margin-bottom 12px
  &:last-child
    margin-bottom 0

.group-title
  font-size 14px
  font-weight 500
  color var(--group-title-color)
  margin 0 0 0 6px
  padding-left 6px
  position relative
  line-height 1.3

  &::before
    content ""
    position absolute
    left -6px
    top 2px
    bottom 2px
    width 2px
    background var(--primary-color)
    border-radius 1px

.group-items
  background var(--group-bg)
  border-radius 6px
  padding 8px
  box-shadow 0 1px 2px 0 var(--group-shadow)

.setting-item
  min-width 500px
  max-width 800px
  display flex
  align-items center
  padding 8px 12px
  min-height 40px
  transition background-color 0.2s
  &:not(:last-child)
    border-bottom 1px solid var(--divider-color)
  &:hover
    background-color var(--item-hover-bg)

.item-label
  flex 0 0 var(--label-width, auto)  // 核心控制逻辑
  min-width 80px  // 安全宽度下限
  max-width 200px  // 防止过长文本
  font-size 13px
  color var(--text-primary)
  padding-right 24px
  display flex
  align-items center
  justify-content flex-end  // 右对齐关键属性
  line-height 1.4
  height 100%

.item-control
  flex 1
  min-width 0
  display flex
  align-items center  // 垂直居中关键属性
  height 100%

  // 统一控件基础样式
  :deep(.input-base)
  :deep(.select-wrapper)
  :deep(.input-number)
    width 100%
    max-width 400px
    min-height 32px  // 统一高度

  // Switch特殊处理
  :deep(.switch-container)
    margin-top 2px  // 视觉微调

// 主题变量保持原样
:root
  --group-title-color rgba(0, 0, 0, 0.88)
  --group-bg #ffffff
  --group-shadow rgba(0, 0, 0, 0.06)
  --divider-color #f0f0f0
  --text-primary rgba(0, 0, 0, 0.88)
  --primary-color #1677ff
  --item-hover-bg rgba(0, 0, 0, 0.02)

[data-theme-mode="dark"]
  --group-title-color rgba(255, 255, 255, 0.85)
  --group-bg #1f1f1f
  --group-shadow rgba(0, 0, 0, 0.25)
  --divider-color rgba(255, 255, 255, 0.12)
  --text-primary rgba(255, 255, 255, 0.85)
  --primary-color #1668dc
  --item-hover-bg rgba(255, 255, 255, 0.03)
</style>
