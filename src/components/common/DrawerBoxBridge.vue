<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<!--suppress ALL -->
<script setup lang="ts">
import { useVueI18n } from "~/src/composables/useVueI18n.ts"

const props = defineProps({
  src: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
</script>

<template>
  <div>
    <iframe
      v-resize="{
        loadText: t('page.loading'),
      }"
      width="100%"
      :src="src"
      frameborder="0"
    ></iframe>
  </div>
</template>