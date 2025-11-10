<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div id="app-layout-default">
    <DefaultHeader />
    <div class="default-main">
      <slot />
    </div>
    <DefaultFooter />
  </div>
</template>

<script setup lang="ts">
import DefaultHeader from "~/src/layouts/default/DefaultHeader.vue"
import DefaultFooter from "~/src/layouts/default/DefaultFooter.vue"
</script>

<style scoped>
#app-layout-default {
  padding: 0;
}
.default-main {
  min-height: 500px;
}
</style>
