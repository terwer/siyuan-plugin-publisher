<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
defineProps<{
  svg: string
}>()
</script>

<template>
  <div v-html="svg"></div>
</template>

<style scoped>
div {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
