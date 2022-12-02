<template>
  <github-main :api-type="apiType" :page-id="pageId" />
</template>
<script lang="ts" setup>
import GithubMain from "~/components/publish/tab/main/GithubMain.vue"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { ref } from "vue"

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_VUEPRESS)

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  pageId: {
    type: String,
    default: undefined,
  },
})
</script>
