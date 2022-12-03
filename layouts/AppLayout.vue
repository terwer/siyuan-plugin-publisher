<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { shallowRef } from "vue"
import AppLayoutDefault from "~/layouts/default/AppLayoutDefault.vue"

const layout = shallowRef(AppLayoutDefault)
</script>
