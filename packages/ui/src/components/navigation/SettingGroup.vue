<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
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
  labelWidth?: number | string
}>()

const getItemLabelStyle = (item: SettingItem) => {
  const width = item.labelWidth ?? props.labelWidth ?? "full"
  return {
    "--label-width": typeof width === "number" ? `${Math.max(80, Math.min(200, width))}px` : width,
  }
}
</script>

<template>
  <section class="pt-setting-group">
    <!-- 分组标题 -->
    <h2 class="pt-group-title">{{ props.settingGroup.title }}</h2>

    <!-- 配置项列表 -->
    <div class="pt-group-items">
      <div v-if="props.settingGroup.items.length === 0" class="pt-empty-state">
        <span class="pt-empty-text">暂无设置项</span>
      </div>
      <template v-else>
        <div v-for="(item, index) in props.settingGroup.items" :key="index">
          <!-- 嵌套分组 -->
          <div v-if="item.type === 'group'" class="pt-nested-group">
            <h3 class="pt-nested-title">{{ item.label }}</h3>
            <div class="pt-nested-items">
              <div v-for="(nestedItem, nestedIndex) in item.items" :key="nestedIndex" class="pt-setting-item">
                <!-- 标签区域 -->
                <div class="pt-item-label" :style="getItemLabelStyle(nestedItem)">
                  {{ nestedItem.label }}
                </div>

                <!-- 控件区域 -->
                <div class="pt-item-control">
                  <!-- Input类型 -->
                  <Input
                    v-if="nestedItem.type === 'input'"
                    v-model="nestedItem.value"
                    :placeholder="nestedItem.placeholder"
                    :readonly="nestedItem.readonly"
                    :disabled="nestedItem.disabled"
                    :type="nestedItem.inputType"
                  />

                  <!-- Switch 类型 -->
                  <Switch v-if="nestedItem.type === 'switch'" v-model="nestedItem.value" :disabled="nestedItem.disabled" />

                  <!-- Select 类型 -->
                  <Select
                    v-else-if="nestedItem.type === 'select'"
                    v-model="nestedItem.value"
                    :options="(nestedItem.options ?? []) as Option[]"
                    :disabled="nestedItem.disabled"
                    @change="(value: any) => nestedItem.onChange?.(value)"
                  />

                  <!-- Number 类型 -->
                  <InputNumber
                    v-else-if="nestedItem.type === 'number'"
                    v-model="nestedItem.value"
                    :placeholder="nestedItem.placeholder"
                    :disabled="nestedItem.disabled"
                  />

                  <!-- Textarea 类型 -->
                  <TextArea
                    v-else-if="nestedItem.type === 'textarea'"
                    v-model="nestedItem.value"
                    :placeholder="nestedItem.placeholder"
                    :readonly="nestedItem.readonly"
                    :disabled="nestedItem.disabled"
                    :auto-resize="true"
                    :rows="4"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 普通设置项 -->
          <div v-else class="pt-setting-item">
            <!-- 标签区域 -->
            <div class="pt-item-label" :style="getItemLabelStyle(item)">
              {{ item.label }}
            </div>

            <!-- 控件区域 -->
            <div class="pt-item-control">
              <!-- Input类型 -->
              <Input
                v-if="item.type === 'input'"
                v-model="item.value"
                :placeholder="item.placeholder"
                :readonly="item.readonly"
                :disabled="item.disabled"
                :type="item.inputType"
              />

              <!-- Switch 类型 -->
              <Switch v-if="item.type === 'switch'" v-model="item.value" :disabled="item.disabled" />

              <!-- Select 类型 -->
              <Select
                v-else-if="item.type === 'select'"
                v-model="item.value"
                :options="(item.options ?? []) as Option[]"
                :disabled="item.disabled"
                @change="(value: any) => item.onChange?.(value)"
              />

              <!-- Number 类型 -->
              <InputNumber
                v-else-if="item.type === 'number'"
                v-model="item.value"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
              />

              <!-- Textarea 类型 -->
              <TextArea
                v-else-if="item.type === 'textarea'"
                v-model="item.value"
                :placeholder="item.placeholder"
                :readonly="item.readonly"
                :disabled="item.disabled"
                :auto-resize="true"
                :rows="4"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped lang="stylus">
.pt-setting-group
  margin-bottom 12px

.pt-group-title
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

.pt-group-items
  background var(--group-bg)
  border-radius 6px
  padding 8px
  box-shadow 0 1px 2px 0 var(--group-shadow)

.pt-nested-group
  margin-bottom 16px

  &:last-child
    margin-bottom 0

.pt-nested-title
  font-size 13px
  font-weight 500
  color var(--nested-group-title-color)
  margin 0 0 8px
  padding-left 8px
  position relative
  line-height 1.3

  &::before
    content ""
    position absolute
    left 0
    top 2px
    bottom 2px
    width 2px
    background var(--nested-group-title-bg)
    border-radius 1px

.pt-nested-items
  background var(--nested-group-bg)
  border-radius 4px
  padding 8px

.pt-setting-item
  min-width 400px
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

.pt-item-label
  flex 0 0 var(--label-width, 120px)
  min-width 80px
  max-width 200px
  font-size 13px
  color var(--text-primary)
  padding-right 24px
  display flex
  align-items center
  line-height 1.4
  height 100%

.pt-item-control
  flex 0 0 auto
  margin-left auto
  display flex
  align-items center
  height 100%

/* 核心对齐修正 */
.pt-setting-item
  position relative

  .pt-item-control
    margin-left auto !important
    min-width 0
    max-width 100%

/* 控件自然宽度保护 */
.pt-item-control > *
  max-width 100%

.pt-empty-state
  display flex
  justify-content center
  align-items center
  min-height 100px
  color var(--text-secondary)
  font-size 14px

.pt-empty-text
  color var(--text-secondary)

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