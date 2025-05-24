<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="pt-tooltip" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div ref="triggerRef" class="pt-tooltip__trigger">
      <slot></slot>
    </div>
    <Transition name="pt-fade">
      <div
        v-show="visible"
        ref="tooltipRef"
        class="pt-tooltip__content"
        :class="[`pt-tooltip__content--${placement}`, { 'pt-tooltip__content--arrow': showArrow }]"
        :style="tooltipStyle"
      >
        <div class="pt-tooltip__inner">
          <slot name="title">{{ title }}</slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useTooltip, type Placement } from '../composables'

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  placement: {
    type: String as () => Placement,
    default: "top",
    validator: (v: string) => ["top", "bottom", "left", "right"].includes(v),
  },
  showArrow: {
    type: Boolean,
    default: true,
  },
  mouseEnterDelay: {
    type: Number,
    default: 0.5,
  },
  mouseLeaveDelay: {
    type: Number,
    default: 0.1,
  },
})

const {
  visible,
  triggerRef,
  tooltipRef,
  tooltipStyle,
  handleMouseEnter,
  handleMouseLeave
} = useTooltip(props)
</script>

<style lang="stylus">
@import '../styles/components/tooltip.styl'
</style>
