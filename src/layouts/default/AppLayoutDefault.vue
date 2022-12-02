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
import DefaultHeader from "~/layouts/default/DefaultHeader.vue"
import DefaultFooter from "~/layouts/default/DefaultFooter.vue"
</script>

<style scoped>
#app-layout-default {
  padding: 16px;
}
.default-main {
  min-height: 500px;
}
</style>
