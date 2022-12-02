<template>
  <metaweblog-main :api-type="apiType" :page-id="props.pageId" />
</template>

<script lang="ts" setup>
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { ref } from "vue"
import MetaweblogMain from "../MetaweblogMain.vue"

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_JVUE)

// const props = defineProps({
//   pageId: {
//     type: String,
//     default: undefined
//   }
// })
</script>

<style scoped></style>
