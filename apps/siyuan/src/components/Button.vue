<template>
  <Tooltip v-if="tooltip" :title="tooltip" :placement="tooltipPlacement">
    <component
      :is="tagName"
      :href="href"
      class="pt-btn"
      :class="[
        `pt-btn--${type}`,
        `pt-btn--${size}`,
        shapeClass,
        {
          'pt-btn--icon-only': $slots.icon && !$slots.default && !loading,
          'pt-btn--loading': loading,
          'pt-btn--block': block,
          'pt-btn--danger': danger,
          'pt-btn--ghost': ghost,
          'pt-btn--disabled': disabled || loading,
          'pt-btn--two-chars': hasTwoChineseChars,
        },
      ]"
      :disabled="disabled || loading"
      @click.stop="handleClick"
    >
      <span v-if="loading" class="pt-btn__loading">
        <svg viewBox="0 0 1024 1024" class="pt-btn__spinner">
          <path d="M988..." />
        </svg>
      </span>

      <span v-if="$slots.icon && !loading" class="pt-btn__icon">
        <slot name="icon"></slot>
      </span>

      <span v-if="$slots.default" class="pt-btn__text">
        <slot></slot>
      </span>
    </component>
  </Tooltip>
  <component
    v-else
    :is="tagName"
    :href="href"
    class="pt-btn"
    :class="[
      `pt-btn--${type}`,
      `pt-btn--${size}`,
      shapeClass,
      {
        'pt-btn--icon-only': $slots.icon && !$slots.default && !loading,
        'pt-btn--loading': loading,
        'pt-btn--block': block,
        'pt-btn--danger': danger,
        'pt-btn--ghost': ghost,
        'pt-btn--disabled': disabled || loading,
        'pt-btn--two-chars': hasTwoChineseChars,
      },
    ]"
    :disabled="disabled || loading"
    @click.stop="handleClick"
  >
    <span v-if="loading" class="pt-btn__loading">
      <svg viewBox="0 0 1024 1024" class="pt-btn__spinner">
        <path d="M988..." />
      </svg>
    </span>

    <span v-if="$slots.icon && !loading" class="pt-btn__icon">
      <slot name="icon"></slot>
    </span>

    <span v-if="$slots.default" class="pt-btn__text">
      <slot></slot>
    </span>
  </component>
</template>

<script setup lang="ts">
import Tooltip from "@components/Tooltip.vue"
import { computed, useSlots } from "vue"

type ButtonType = "default" | "primary" | "dashed" | "text" | "link"
type TooltipPlacement = "top" | "bottom" | "left" | "right"

const props = defineProps({
  type: {
    type: String as () => ButtonType,
    default: "default",
    validator: (v: string) =>
      ["default", "primary", "dashed", "text", "link"].includes(v),
  },
  size: {
    type: String,
    default: "md",
    validator: (v: string) => ["sm", "md", "lg"].includes(v),
  },
  shape: String,
  disabled: Boolean,
  loading: Boolean,
  danger: Boolean,
  block: Boolean,
  ghost: Boolean,
  href: String,
  tooltip: String,
  tooltipPlacement: {
    type: String as () => TooltipPlacement,
    default: "top",
    validator: (v: string) => ["top", "bottom", "left", "right"].includes(v),
  },
})

const slots = useSlots()
const emit = defineEmits(["click"])

const tagName = computed(() => (props.href ? "a" : "button"))
const shapeClass = computed(() =>
  props.shape ? `pt-btn--shape-${props.shape}` : "",
)
const hasTwoChineseChars = computed(() => {
  const text = slots.default?.()?.[0]?.children?.toString() || ""
  return text.length === 2 && /^[\u4e00-\u9fa5]{2}$/.test(text)
})

const handleClick = (e: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit("click", e)
}
</script>

<style lang="stylus" scoped>
// 设计变量
$primary = #1677ff
$danger = #ff4d4f
$text = rgba(0, 0, 0, 0.88)
$border = #d9d9d9
$radius = 6px

.pt-btn
  // 基础样式
  position: relative
  display: inline-flex
  align-items: center
  justify-content: center
  height: 32px
  padding: 4px 12px
  min-width: 80px
  border-radius: $radius
  border: 1px solid $border
  background: #fff
  color: $text
  font-size: 14px
  line-height: 1.5715
  cursor: pointer
  transition: color 0.2s, border-color 0.2s, background-color 0.2s
  user-select: none
  white-space: nowrap
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02)

  &:hover:not(.pt-btn--disabled)
    color: $primary
    border-color: $primary
    background: #fff

  &:active:not(.pt-btn--disabled)
    color: darken($primary, 8%)
    border-color: darken($primary, 8%)
    background: #fff

  // 尺寸
  &--sm
    height: 24px
    padding: 0 8px
    font-size: 14px
    min-width: 64px

  &--lg
    height: 40px
    padding: 6.4px 16px
    font-size: 16px
    min-width: 96px

  // 类型
  &--primary
    background: $primary
    border-color: $primary
    color: #fff
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045)
    &:hover:not(.pt-btn--disabled)
      background: lighten($primary, 8%)
      border-color: lighten($primary, 8%)
      color: #fff
    &:active:not(.pt-btn--disabled)
      background: darken($primary, 8%)
      border-color: darken($primary, 8%)
      color: #fff

  &--dashed
    border-style: dashed
    &:hover:not(.pt-btn--disabled)
      color: $primary
      border-color: $primary
      background: #fff

  &--text
    background: transparent
    border-color: transparent
    box-shadow: none
    &:hover:not(.pt-btn--disabled)
      color: $primary
      background: rgba(0, 0, 0, 0.04)

  &--link
    color: $primary
    background: transparent
    border-color: transparent
    box-shadow: none
    text-decoration: underline
    &:hover:not(.pt-btn--disabled)
      color: lighten($primary, 8%)

  // 危险状态
  &--danger
    color: $danger
    border-color: $danger
    &:hover:not(.pt-btn--disabled)
      color: lighten($danger, 8%)
      border-color: lighten($danger, 8%)
      background: #fff
    &.pt-btn--primary
      background: $danger
      border-color: $danger
      color: #fff
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045)
      &:hover:not(.pt-btn--disabled)
        background: lighten($danger, 8%)
        border-color: lighten($danger, 8%)
        color: #fff

  // 幽灵模式
  &--ghost
    background: transparent !important
    border-color: currentColor
    color: inherit
    box-shadow: none
    &:hover:not(.pt-btn--disabled)
      color: $primary
      border-color: $primary
      background: transparent !important

  // 形状
  &--shape-circle
    min-width: @height
    padding: 0
    border-radius: 50%

  &--shape-round
    border-radius: 32px

  // 图标相关
  &__icon
    margin-right: 8px
    font-size: 14px
    line-height: 1

  &__text
    margin: 0
    text-align: center
    width: 100%

  &--icon-only
    width: 32px
    min-width: 32px
    padding: 0
    .pt-btn__icon
      margin: 0
      font-size: 16px

  // 加载状态
  &--loading
    cursor: default
    opacity: 0.85
    .pt-btn__spinner
      animation: pt-spin 1s linear infinite
      width: 14px
      height: 14px
      margin-right: 8px

  // 禁用状态
  &--disabled
    cursor: not-allowed
    opacity: 0.65

  // 块级按钮
  &--block
    width: 100%
    min-width: 100%

  // 双字符
  &--two-chars
    &::first-letter
      letter-spacing: 0.34em
    > *:not(.pt-btn__icon)
      margin-right: -0.34em

@keyframes pt-spin
  from
    transform: rotate(0deg)
  to
    transform: rotate(360deg)
</style>
