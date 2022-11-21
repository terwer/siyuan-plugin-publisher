<template>
  <common-blog-setting :api-type="apiType" :username-enabled="true" :token-enabled="true" :cfg="cfg"/>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {API_TYPE_CONSTANTS} from "../../../../../utils/constants/apiTypeConstants";
import {LiandiCfg} from "../../../../../utils/platform/commonblog/liandi/liandiCfg";

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_LIANDI)
const liandiCfg = new LiandiCfg()
const cfg = ref(liandiCfg)

</script>

<script lang="ts">
import CommonBlogSetting from "../CommonBlogSetting.vue";

export default {
  name: "LiandiSetting",
  components: {CommonBlogSetting}
}
</script>

<style scoped>

</style>