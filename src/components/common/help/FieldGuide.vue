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
import { SYP_HELP_PAGE_ID_KEY } from "~/src/components/common/help/helpPageIdKey.ts"
import { helpRegistry } from "~/src/helpConfigs/registry"

defineOptions({ name: "FieldGuide" })

const props = defineProps({
  /** 显式指定时优先；常规用法由配置页下发，不必逐层透传 */
  pageId: { type: String, default: "" },
  /** 指引键：该行绑定的配置属性名（与引导锚点是两套命名空间） */
  field: { type: String, required: true },
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
  <slot />
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64m0 708c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40m62.9-219.5a48.3 48.3 0 0 0-30.9 44.8V620c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8v-21.5c0-23.1 6.7-45.9 19.9-64.9 12.9-18.6 30.9-32.8 52.1-40.9 34-13.1 56-41.6 56-72.7 0-44.1-43.1-80-96-80s-96 35.9-96 80v7.6c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V420c0-58.3 44.7-108.1 102.4-124.4C442.2 281.2 512 335.3 512 420c0 57.2-22.6 100.9-62.9 132.5"/></svg>
    </el-icon>
  </el-tooltip>
</template>

<style scoped lang="stylus">
.syp-field-guide__icon
  font-size 15px
  color var(--el-color-info-light-3)
  cursor pointer
  flex 0 0 auto
  transition color 0.2s
  &:hover
    color var(--el-color-primary)

.syp-field-guide__tip
  max-width 260px

.syp-field-guide__tip-text
  margin 0
  font-size 12px
  line-height 1.5
  color var(--el-text-color-primary)

  & + .syp-field-guide__tip-link
    margin-top 6px

.syp-field-guide__tip-link
  display block
  margin-top 6px
  font-size 12px
  color var(--el-color-primary)
  text-decoration none
  &:hover
    text-decoration underline
</style>
