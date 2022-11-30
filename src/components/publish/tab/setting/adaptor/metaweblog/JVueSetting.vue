<template>
  <metaweblog-setting :api-type="apiType" :cfg="cfg"/>
</template>

<script lang="ts" setup>
import {API_TYPE_CONSTANTS} from "../../../../../../utils/constants/apiTypeConstants";
import {ref} from "vue";
import {JVueCfg} from "../../../../../../utils/platform/metaweblog/jvue/jvueCfg";

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_JVUE)
const cfg = ref(new JVueCfg())

</script>

<script lang="ts">
import MetaweblogSetting from "../../MetaweblogSetting.vue";

export default {
  name: "JVueSetting",
  components: {MetaweblogSetting}
}
</script>

<style scoped>

</style>