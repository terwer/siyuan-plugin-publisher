<template>
  <metaweblog-main :api-type="apiType" :page-id="props.pageId"/>
</template>

<script lang="ts" setup>
import {API_TYPE_CONSTANTS} from "../../../../../utils/constants/apiTypeConstants";
import {ref} from "vue";

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_JVUE)

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
  name: "JVueMain",
  components: {MetaweblogMain}
}
</script>

<style scoped>

</style>