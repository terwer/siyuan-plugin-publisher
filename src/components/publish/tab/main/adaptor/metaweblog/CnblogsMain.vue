<template>
  <metaweblog-main :api-type="apiType" :page-id="props.pageId"/>
</template>

<script lang="ts" setup>
import {API_TYPE_CONSTANTS} from "~/utils/constants/apiTypeConstants";
import {ref} from "vue";
import MetaweblogMain from "~/components/publish/tab/main/MetaweblogMain.vue";

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_CNBLOGS)

const props = defineProps({
  pageId: {
    type: String,
    default: undefined
  }
})
</script>

<script lang="ts">
export default {
  name: "CnblogsMain"
}
</script>

<style scoped>

</style>