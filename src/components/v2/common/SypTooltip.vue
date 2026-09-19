<template>
  <ElTooltip
    :content="tooltipContent"
    :disabled="isDisabled"
    effect="dark"
    :placement="placement"
    :show-after="showAfter"
    :hide-after="hideAfter"
    :teleported="teleported"
    :popper-class="popperClass"
  >
    <component
      :is="tag"
      v-bind="attrs"
      :class="[
        'syp-v2-tooltip-trigger',
        triggerClass,
        attrs.class,
        {
          'is-ellipsis': ellipsis,
          'is-block': block,
          'is-inline-flex': inlineFlex,
        },
      ]"
    >
      <slot>{{ displayText }}</slot>
    </component>
  </ElTooltip>
</template>

<script setup lang="ts">
import { ElTooltip } from "element-plus"
import { computed, useAttrs } from "vue"
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    content?: string
    disabled?: boolean
    ellipsis?: boolean
    ellipsisWhen?: "always" | "overflow"
    block?: boolean
    inlineFlex?: boolean
    tag?: string
    triggerClass?: string
    placement?: string
    showAfter?: number
    hideAfter?: number
    teleported?: boolean
    popperClass?: string
  }>(),
  {
    content: "",
    disabled: false,
    ellipsis: false,
    ellipsisWhen: "always",
    block: false,
    inlineFlex: false,
    tag: "span",
    triggerClass: "",
    placement: "top",
    showAfter: 300,
    hideAfter: 100,
    teleported: true,
    popperClass: "syp-v2-tooltip-popper",
  }
)

const attrs = useAttrs()
const tooltipContent = computed(() => props.content.trim())
const displayText = computed(() => tooltipContent.value || props.content)
const isDisabled = computed(
  () => props.disabled || tooltipContent.value.length === 0 || (props.ellipsis && props.ellipsisWhen === "overflow")
)

</script>

<style scoped lang="stylus">
.syp-v2-tooltip-trigger
  min-width 0

  &.is-block
    display block

  &.is-inline-flex
    display inline-flex
    align-items center

  &.is-ellipsis
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
</style>
