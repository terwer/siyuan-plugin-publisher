<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { computed } from "vue"
import { helpRegistry } from "~/src/helpConfigs/registry"

defineOptions({ name: "FieldGuide" })

const props = defineProps({
  pageId: { type: String, required: true },
  field: { type: String, required: true },
})

const fieldConfig = computed(() => helpRegistry.getField(props.pageId, props.field))

const hasTip = computed(() => !!fieldConfig.value?.tip || !!fieldConfig.value?.link)
</script>

<template>
  <div class="syp-field-guide">
    <slot />
    <el-tooltip
      v-if="hasTip"
      effect="light"
      placement="top"
    >
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
      <el-icon class="syp-field-guide__icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64m0 708c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40m62.9-219.5a48.3 48.3 0 0 0-30.9 44.8V620c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8v-21.5c0-23.1 6.7-45.9 19.9-64.9 12.9-18.6 30.9-32.8 52.1-40.9 34-13.1 56-41.6 56-72.7 0-44.1-43.1-80-96-80s-96 35.9-96 80v7.6c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V420c0-58.3 44.7-108.1 102.4-124.4C442.2 281.2 512 335.3 512 420c0 57.2-22.6 100.9-62.9 132.5"/></svg>
      </el-icon>
    </el-tooltip>
  </div>
</template>

<style scoped lang="stylus">
.syp-field-guide
  display inline-flex
  align-items center
  gap 4px

  &__icon
    font-size 15px
    color var(--el-color-info-light-3)
    cursor pointer
    transition color 0.2s
    &:hover
      color var(--el-color-primary)

  &__tip
    max-width 240px

  &__tip-text
    margin 0 0 6px 0
    font-size 13px
    line-height 1.5
    color var(--el-text-color-primary)

  &__tip-link
    font-size 12px
    color var(--el-color-primary)
    text-decoration none
    &:hover
      text-decoration underline
</style>