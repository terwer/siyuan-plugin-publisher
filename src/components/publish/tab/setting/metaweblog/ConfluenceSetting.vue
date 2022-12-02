<template>
  <metaweblog-setting :api-type="apiType" :cfg="cfg" />
</template>

<script lang="ts" setup>
import { API_TYPE_CONSTANTS } from "../../../../../utils/constants/apiTypeConstants"
import { ref } from "vue"
import MetaweblogSetting from "../MetaweblogSetting.vue"
import { ConfCfg } from "../../../../../utils/platform/metaweblog/conf/confCfg"

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_CONFLUENCE)
const cfg = ref(new ConfCfg())
</script>

<script lang="ts">
export default {
  name: "ConfluenceSetting",
}
</script>

<style scoped></style>
