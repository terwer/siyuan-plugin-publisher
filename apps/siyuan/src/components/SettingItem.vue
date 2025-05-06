<script setup lang="ts">
import { defineProps } from "vue"
import Input from "@components/form/Input.vue"
import InputNumber from "@components/form/InputNumber.vue"
import Select from "@components/form/Select.vue"
import Switch from "@components/form/Switch.vue"
import { IS_ENGLISH } from "@/Constants.ts"

const props = defineProps<{
  pluginInstance: any
  settingGroup: {
    title: string
    items: SettingItem[]
  }
}>()

const getItemLabelStyle = (item: SettingItem) => {
  const width = item.labelWidth ?? (IS_ENGLISH ? 120 : "full")
  return {
    "--label-width":
      typeof width === "number"
        ? `${Math.max(80, Math.min(200, width))}px`
        : width,
  }
}
</script>

<template>
  <section class="setting-group">
    <!-- 分组标题 -->
    <h2 class="group-title">{{ props.settingGroup.title }}</h2>

    <!-- 配置项列表 -->
    <div class="group-items">
      <div
        v-for="(item, index) in props.settingGroup.items"
        :key="index"
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

.item-control
  flex 0 0 auto
  margin-left auto
  display flex
  align-items center
  height 100%

/* 核心对齐修正 */
.setting-item
  position relative

  .item-control
    margin-left auto !important
    min-width 0
    max-width 100%

/* 控件自然宽度保护 */
.item-control > *
  max-width 100%

/* 主题变量 */
:root
  --group-title-color rgba(0, 0, 0, 0.88)
  --group-bg #ffffff
  --group-shadow rgba(0,0,0,0.06)
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
