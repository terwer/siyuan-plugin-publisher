<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="tg-card" :class="{ 'tg-card--bordered': bordered }">
    <div v-if="$slots.header || title" class="tg-card__header">
      <slot name="header">
        <div class="tg-card__title">{{ title }}</div>
      </slot>
    </div>
    <div class="tg-card__body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="tg-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
  bordered: {
    type: Boolean,
    default: true,
  },
})
</script>
