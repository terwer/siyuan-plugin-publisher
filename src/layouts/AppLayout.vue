<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <suspense>
    <component :is="layout">
      <slot />
    </component>
  </suspense>
</template>

<script lang="ts" setup>
import { shallowRef } from "vue"
import AppLayoutDefault from "~/src/layouts/default/AppLayoutDefault.vue"

const layout = shallowRef(AppLayoutDefault)
</script>
