<template>
  <metaweblog-setting :api-type="apiType" :cfg="cfg"/>
</template>

<script lang="ts" setup>
import {API_TYPE_CONSTANTS} from "../../../lib/constants/apiTypeConstants";
import {ref} from "vue";
import {WordpressCfg} from "../../../lib/platform/wordpress/wordpressCfg";

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_WORDPRESS)
const cfg = ref(new WordpressCfg())

</script>

<script lang="ts">
import MetaweblogSetting from "./MetaweblogSetting.vue";

export default {
  name: "WordpressSetting",
  components: {MetaweblogSetting}
}
</script>

<style scoped>

</style>