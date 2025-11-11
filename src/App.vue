<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import AppLayout from "~/src/layouts/AppLayout.vue"

// global style
import "~/src/assets/style.css"
import "~/src/assets/style.dark.css"
</script>

<template>
  <app-layout>
    <router-view></router-view>
  </app-layout>
</template>

<style scoped></style>
