<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->
<script lang="ts" setup>
const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
  cfg: {
    // 必须继承MetaweblogConfig
    type: Object,
    default: null,
  },
})
</script>

<template>
  <common-blog-setting :api-type="props.apiType" :cfg="props.cfg" />
</template>
