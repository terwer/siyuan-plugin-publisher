<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <Tooltip v-if="tooltip" :title="tooltip" :placement="tooltipPlacement">
    <component
      :is="tagName"
      :href="href"
      class="pt-btn"
      :class="buttonClasses"
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
    :class="buttonClasses"
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
  import Tooltip from "./Tooltip.vue"
  import { useButton, type ButtonType } from "../composables"

  type TooltipPlacement = "top" | "bottom" | "left" | "right"

  const props = defineProps({
    type: {
      type: String as () => ButtonType,
      default: "default",
      validator: (v: string) => ["default", "primary", "dashed", "text", "link"].includes(v)
    },
    size: {
      type: String,
      default: "md",
      validator: (v: string) => ["sm", "md", "lg"].includes(v)
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
      validator: (v: string) => ["top", "bottom", "left", "right"].includes(v)
    }
  })

  const emit = defineEmits(["click"])

  const { tagName, buttonClasses, handleClick: baseHandleClick } = useButton(props)

  const handleClick = (e: MouseEvent) => {
    const result = baseHandleClick(e)
    if (result) {
      emit("click", result)
    }
  }
</script>

<style lang="stylus">
  @import '../styles/components/button.styl'
</style>
