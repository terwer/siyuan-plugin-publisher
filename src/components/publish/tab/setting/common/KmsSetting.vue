<template>
  <common-blog-setting
    :api-type="apiType"
    :username-enabled="true"
    :password-enabled="true"
    :cfg="cfg"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { API_TYPE_CONSTANTS } from "../../../../../utils/constants/apiTypeConstants"
import { KmsCfg } from "../../../../../utils/platform/commonblog/kms/kmsCfg"
</script>

<script lang="ts">
import CommonBlogSetting from "../CommonBlogSetting.vue"

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_KMS)
const kmsCfg = new KmsCfg()
const cfg = ref(kmsCfg)

export default {
  name: "KmsSetting",
  components: { CommonBlogSetting },
}
</script>

<style scoped></style>
