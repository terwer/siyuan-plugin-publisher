<template>
  <metaweblog-main :api-type="apiType"/>
</template>

<script lang="ts" setup>
import {API_TYPE_CONSTANTS} from "../../../../lib/constants/apiTypeConstants";
import {ref} from "vue";

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_JVUE)

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