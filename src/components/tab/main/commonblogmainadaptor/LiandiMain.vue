<template>
  <CommonBlogMain :api-type="apiType"/>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {API_TYPE_CONSTANTS} from "../../../../lib/constants/apiTypeConstants";

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_LIANDI)
</script>

<script lang="ts">
import CommonBlogMain from "../CommonBlogMain.vue";

export default {
  name: "LiandiMain",
  components: {CommonBlogMain}
}
</script>

<style scoped>

</style>