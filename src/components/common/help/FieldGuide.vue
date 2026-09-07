<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { computed, inject } from "vue"
import { InfoFilled } from "@element-plus/icons-vue"
import { SYP_HELP_PAGE_ID_KEY } from "~/src/components/common/help/helpPageIdKey.ts"
import { helpRegistry } from "~/src/helpConfigs/registry"

defineOptions({ name: "FieldGuide" })

const props = defineProps({
  /** 显式指定时优先；常规用法由配置页下发，不必逐层透传 */
  pageId: { type: String, default: "" },
  /** 指引键：该行绑定的配置属性名（与引导锚点是两套命名空间） */
  field: { type: String, required: true },
  /** 控件本身不撑满整行时（开关、单选组）用 inline，让指引紧贴控件而不是行尾 */
  inline: { type: Boolean, default: false },
  /** 多行控件（文本域）用 tall，让指引贴第一行而不是垂直居中 */
  tall: { type: Boolean, default: false },
})

const injectedPageId = inject(SYP_HELP_PAGE_ID_KEY, undefined)
const resolvedPageId = computed(() => props.pageId || injectedPageId?.value || "")

const fieldConfig = computed(() => {
  if (!resolvedPageId.value) {
    return undefined
  }
  return helpRegistry.getField(resolvedPageId.value, props.field)
})

const hasTip = computed(() => !!fieldConfig.value?.tip || !!fieldConfig.value?.link)
</script>

<template>
  <div class="syp-field-guide" :class="{ 'syp-field-guide--inline': props.inline, 'syp-field-guide--tall': props.tall }">
    <div class="syp-field-guide__control">
      <slot />
    </div>
    <el-tooltip v-if="hasTip" effect="light" placement="top" :teleported="false">
      <template #content>
        <div class="syp-field-guide__tip">
          <p v-if="fieldConfig?.tip" class="syp-field-guide__tip-text">{{ fieldConfig.tip }}</p>
          <a
            v-if="fieldConfig?.link"
            :href="fieldConfig.link"
            target="_blank"
            class="syp-field-guide__tip-link"
            @click.stop
          >{{ fieldConfig.linkText || "查看详情" }}</a>
        </div>
      </template>
      <el-icon class="syp-field-guide__icon" :data-syp-field-guide="props.field">
        <InfoFilled />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<style scoped lang="stylus">
// 控件与指引同一行：表单内容列默认 flex-wrap: wrap，控件撑满整行会把指引挤到下一行，
// 所以由本组件把控件包进一行内布局。
.syp-field-guide
  display flex
  align-items center
  gap 4px
  width 100%
  min-width 0

  &__control
    flex 1 1 auto
    min-width 0

  &--inline
    width auto
    flex 0 0 auto

    .syp-field-guide__control
      flex 0 0 auto

  &--tall
    align-items flex-start

    .syp-field-guide__icon
      margin-top 7px

  &__icon
    flex 0 0 auto
    font-size 16px
    color var(--el-text-color-regular)
    cursor help
    transition color 0.2s
    &:hover
      color var(--el-color-primary)

  &__tip
    max-width 260px

  &__tip-text
    margin 0
    font-size 12px
    line-height 1.5
    color var(--el-text-color-primary)

  &__tip-link
    display block
    margin-top 6px
    font-size 12px
    color var(--el-color-primary)
    text-decoration none
    &:hover
      text-decoration underline
</style>
