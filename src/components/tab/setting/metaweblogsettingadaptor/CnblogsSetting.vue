<template>
<metaweblog-setting :api-type="apiType" :cfg="cfg"/>
</template>

<script lang="ts" setup>
import {API_TYPE_CONSTANTS} from "../../../../lib/constants/apiTypeConstants";
import {ref} from "vue";
import {CnblogsCfg} from "../../../../lib/platform/metaweblog/config/cnblogsCfg";

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_CNBLOGS)
const cnblogsCfg = new CnblogsCfg()
const cfg = ref(cnblogsCfg)

</script>

<script lang="ts">
import MetaweblogSetting from "../MetaweblogSetting.vue";

export default {
  name: "CnblogsSetting",
  components: {MetaweblogSetting}
}
</script>

<style scoped>

</style>