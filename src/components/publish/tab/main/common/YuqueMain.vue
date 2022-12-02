<template>
  <CommonBlogMain :api-type="apiType" :page-id="props.pageId" :use-cat="true" />
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import CommonBlogMain from "~/components/publish/tab/main/CommonBlogMain.vue"

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_YUQUE)

const props = defineProps({
  pageId: {
    type: String,
    default: undefined,
  },
})
</script>

<script lang="ts">
export default {
  name: "YuqueMain",
}
</script>

<style scoped></style>
