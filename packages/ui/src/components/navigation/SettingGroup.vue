<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { computed } from "vue"
import type { SettingItem } from "../../types"
import Input from "../form/Input.vue"
import InputNumber from "../form/InputNumber.vue"
import Select from "../form/Select.vue"
import Switch from "../form/Switch.vue"
import TextArea from "../form/TextArea.vue"

interface Option {
  label: string
  value: any
}

const props = defineProps<{
  settingGroup: {
    title: string
    items: SettingItem[]
  }
  isNested?: boolean
  labelWidth?: number | string
}>()

const getItemLabelStyle = (item: SettingItem) => {
  const width = item.labelWidth ?? props.labelWidth ?? "full"
  return {
    "--label-width": typeof width === "number" ? `${Math.max(80, Math.min(200, width))}px` : width,
  }
}

const getComponent = (type: string) => {
  switch (type) {
    case "input":
      return Input
    case "textarea":
      return TextArea
    case "switch":
      return Switch
    case "select":
      return Select
    case "number":
      return InputNumber
    default:
      return null
  }
}

const getComponentProps = (item: SettingItem) => {
  const baseProps = {
    modelValue: item.value,
    disabled: item.disabled,
    placeholder: item.placeholder
  }

  if (item.type === "select" && item.options) {
    return {
      ...baseProps,
      options: item.options
    }
  }

  return baseProps
}

const handleValueChange = (value: any, item: SettingItem) => {
  item.value = value
}
</script>

<template>
  <div class="pt-setting-group">
    <div class="pt-group-header">
      <h3 class="pt-group-title">{{ settingGroup.title }}</h3>
    </div>
    <div class="pt-group-body">
      <div v-for="(item, index) in settingGroup.items" :key="index" class="pt-setting-item">
        <div class="pt-item-label" :class="{ 'pt-item-label--nested': isNested }" :style="getItemLabelStyle(item)">
          {{ item.label }}
        </div>
        <div class="pt-item-content">
          <component
            :is="getComponent(item.type)"
            v-bind="getComponentProps(item)"
            @update:modelValue="handleValueChange($event, item)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
.pt-setting-group
  margin-bottom 16px

  .pt-group-header
    margin-bottom 16px

    .pt-group-title
      font-size 16px
      font-weight 500
      color var(--b3-theme-on-background)

  .pt-group-body
    .pt-setting-item
      display flex
      align-items flex-start
      margin-bottom 16px

      &:last-child
        margin-bottom 0

      .pt-item-label
        width 120px
        padding-right 16px
        color var(--b3-theme-on-background)

        &--nested
          width 100px
          font-size 14px

      .pt-item-content
        flex 1

/* 主题变量 */
:root
  --group-title-color rgba(0, 0, 0, 0.88)
  --group-bg #ffffff
  --group-shadow rgba(0,0,0,0.06)
  --divider-color #f0f0f0
  --text-primary rgba(0, 0, 0, 0.88)
  --primary-color #1677ff
  --item-hover-bg rgba(0, 0, 0, 0.02)
  --text-secondary rgba(0, 0, 0, 0.45)
  --nested-group-title-color rgba(0, 0, 0, 0.65)
  --nested-group-title-bg #d9d9d9
  --nested-group-bg #fafafa

[data-theme-mode="dark"]
  --group-title-color rgba(255, 255, 255, 0.85)
  --group-bg #1f1f1f
  --group-shadow rgba(0, 0, 0, 0.25)
  --divider-color rgba(255, 255, 255, 0.12)
  --text-primary rgba(255, 255, 255, 0.85)
  --primary-color #1668dc
  --item-hover-bg rgba(255, 255, 255, 0.03)
  --text-secondary rgba(255, 255, 255, 0.45)
  --nested-group-title-color rgba(255, 255, 255, 0.65)
  --nested-group-title-bg #434343
  --nested-group-bg #141414
</style> 