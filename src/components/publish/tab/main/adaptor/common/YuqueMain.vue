<template>
  <CommonBlogMain :api-type="apiType" :page-id="props.pageId" :use-cat="true"/>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {API_TYPE_CONSTANTS} from "../../../../../../utils/constants/apiTypeConstants";

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_YUQUE)

const props = defineProps({
  pageId: {
    type: String,
    default: undefined
  }
})
</script>

<script lang="ts">
import CommonBlogMain from "../../CommonBlogMain.vue";

export default {
  name: "YuqueMain",
  components: {CommonBlogMain}
}
</script>

<style scoped>

</style>