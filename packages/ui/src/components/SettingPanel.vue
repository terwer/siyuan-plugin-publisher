<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
  import Input from "./form/Input.vue"
  import InputNumber from "./form/InputNumber.vue"
  import Select from "./form/Select.vue"
  import Switch from "./form/Switch.vue"
  import TextArea from "./form/TextArea.vue"
  import type { SettingItem } from "../types"

  const props = defineProps<{
    settingGroup: {
      title: string
      items: SettingItem[]
    }
  }>()

  const getItemLabelStyle = (item: SettingItem) => {
    const width = item.labelWidth ?? 120
    return {
      "--label-width": typeof width === "number" ? `${Math.max(80, Math.min(200, width))}px` : width
    }
  }
</script>

<template>
  <div id="publisherApp">
    <section class="pt-setting-group">
      <!-- 分组标题 -->
      <h2 class="pt-group-title">{{ props.settingGroup.title }}</h2>

      <!-- 配置项列表 -->
      <div class="pt-group-items">
        <div v-if="props.settingGroup.items.length === 0" class="pt-empty-state">
          <span class="pt-empty-text">{{ "setting.empty" }}</span>
        </div>
        <div v-else v-for="(item, index) in props.settingGroup.items" :key="index" class="pt-setting-item">
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
              :type="item.type"
              :input-type="item.inputType"
            />

            <!-- Switch 类型 -->
            <Switch v-if="item.type === 'switch'" v-model="item.value" :disabled="item.disabled" />

            <!-- Select 类型 -->
            <Select
              v-else-if="item.type === 'select'"
              v-model="item.value"
              :options="item.options ?? []"
              :disabled="item.disabled"
              :on-change="value => item.onChange?.(value)"
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
    </section>
  </div>
</template>

<style lang="stylus">
  @import '../styles/components/setting-panel.styl'
</style>
