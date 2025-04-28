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

const props = defineProps<{
  pluginInstance: any
  settingGroup: SettingGroup
}>()
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
        <div class="item-label">
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
            :input-type="item.inputType"
          />

          <!-- Switch 类型 -->
          <Switch v-if="item.type === 'switch'" v-model="item.value" />

          <!-- Select 类型 -->
          <Select
            v-else-if="item.type === 'select'"
            v-model="item.value"
            :options="item.options"
          />

          <!-- Number 类型 -->
          <InputNumber
            v-else-if="item.type === 'number'"
            v-model="item.value"
            :placeholder="item.placeholder"
          />

          <!-- 其他类型扩展 -->
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="stylus">
.setting-group
  margin-bottom 32px
  &:last-child
    margin-bottom 0

.group-title
  font-size 18px
  font-weight 600
  color var(--group-title-color)
  margin-bottom 16px
  padding-left 8px
  position relative

  &::before
    content ""
    position absolute
    left 0
    top 50%
    transform translateY(-50%)
    width 3px
    height 60%
    background var(--primary-color)
    border-radius 2px

.group-items
  background var(--group-bg)
  border-radius 12px
  padding 16px
  box-shadow 0 2px 8px var(--group-shadow)

.setting-item
  display flex
  justify-content space-between
  align-items center
  padding 12px
  &:not(:last-child)
    border-bottom 1px solid var(--divider-color)

.item-label
  font-size 14px
  color var(--text-primary)
  flex 1

.item-control
  width 240px

// 主题变量
:root
  --group-title-color #2c3e50
  --group-bg #ffffff
  --group-shadow rgba(0,0,0,0.05)
  --divider-color #e0e0e0
  --text-primary #2c3e50
  --primary-color #1971c2

[data-theme-mode="dark"]
  --group-title-color rgba(255,255,255,0.85)
  --group-bg #2d2d2d
  --group-shadow rgba(0,0,0,0.3)
  --divider-color rgba(255,255,255,0.12)
  --text-primary rgba(255,255,255,0.8)
  --primary-color #90caf9
</style>
