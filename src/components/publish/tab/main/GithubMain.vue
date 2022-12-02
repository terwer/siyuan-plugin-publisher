<template>
  <div>github main=>{{ props.apiType + ":" + props.pageId }}</div>
</template>

<script lang="ts" setup>
const props = defineProps({
  pageId: {
    type: String,
    default: undefined
  },
  apiType: {
    type: String,
    default: ""
  },
})
</script>