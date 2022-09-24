<template>
  <metaweblog-main :api-type="apiType" :page-id="props.pageId"/>
</template>

<script lang="ts" setup>
import {API_TYPE_CONSTANTS} from "../../../../lib/constants/apiTypeConstants";
import {ref} from "vue";

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_WORDPRESS)

const props = defineProps({
  pageId: {
    type: String,
    default: undefined
  }
})
</script>

<script lang="ts">
import MetaweblogMain from "../MetaweblogMain.vue";

export default {
  name: "WordpressMain",
  components:{MetaweblogMain}
}
</script>

<style scoped>

</style>