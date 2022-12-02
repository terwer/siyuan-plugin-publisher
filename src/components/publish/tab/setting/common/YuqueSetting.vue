<template>
  <common-blog-setting
    :api-type="apiType"
    :username-enabled="true"
    :token-enabled="true"
    :cfg="cfg"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { YuqueCfg } from "~/utils/platform/commonblog/yuque/yuqueCfg"

import CommonBlogSetting from "../CommonBlogSetting.vue"

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_YUQUE)
const yuqueCfg = new YuqueCfg()
const cfg = ref(yuqueCfg)
</script>

<script lang="ts">
export default {
  name: "YuqueSetting",
}
</script>

<style scoped></style>
