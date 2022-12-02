<template>
  <metaweblog-setting :api-type="apiType" :cfg="cfg" />
</template>

<script lang="ts" setup>
import { API_TYPE_CONSTANTS } from "../../../../../utils/constants/apiTypeConstants"
import { ref } from "vue"
import { JVueCfg } from "../../../../../utils/platform/metaweblog/jvue/jvueCfg"
</script>

<script lang="ts">
import MetaweblogSetting from "../MetaweblogSetting.vue"

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_JVUE)
const cfg = ref(new JVueCfg())

export default {
  name: "JVueSetting",
  components: { MetaweblogSetting },
}
</script>

<style scoped></style>
