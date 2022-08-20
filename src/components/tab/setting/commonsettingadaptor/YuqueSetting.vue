<template>
  <common-blog-setting :api-type="apiType" :token-enabled="true" :cfg="cfg"/>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {API_TYPE_CONSTANTS} from "../../../../lib/constants/apiTypeConstants";
import {YuqueCfg} from "../../../../lib/platform/commonblog/yuque/yuqueCfg";

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_YUQUE)
const yuqueCfg = new YuqueCfg()
const cfg = ref(yuqueCfg)

</script>

<script lang="ts">
import CommonBlogSetting from "../CommonBlogSetting.vue";

export default {
  name: "YuqueSetting",
  components: {CommonBlogSetting}
}
</script>

<style scoped>

</style>