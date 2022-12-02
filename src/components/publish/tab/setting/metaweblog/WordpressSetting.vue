<template>
  <metaweblog-setting :api-type="apiType" :cfg="cfg" />
</template>

<script lang="ts" setup>
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { ref } from "vue"
import { WordpressCfg } from "~/utils/platform/wordpress/wordpressCfg"

import MetaweblogSetting from "../MetaweblogSetting.vue"

// const props = defineProps({
//   isReload: {
//     type: Boolean,
//     default: false
//   },
//   apiType: {
//     type: String,
//     default: ''
//   },
//   cfg: {
//     type: MetaweblogCfg,
//     default: null
//   }
// })

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_WORDPRESS)
const cfg = ref(new WordpressCfg())
</script>
