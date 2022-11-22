<template>
  <metaweblog-setting :api-type="apiType" :cfg="cfg"/>
</template>

<script lang="ts" setup>
import {API_TYPE_CONSTANTS} from "../../../../../../utils/constants/apiTypeConstants";
import {ref} from "vue";
import {WordpressCfg} from "../../../../../../utils/platform/metaweblog/config/wordpressCfg";
import {MetaweblogCfg} from "../../../../../../utils/platform/metaweblog/MetaweblogCfg";

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false
  },
  apiType: {
    type: String,
    default: ""
  },
  cfg: {
    type: MetaweblogCfg,
    default: null
  }
})

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_WORDPRESS)
const cfg = ref(new WordpressCfg())

// 如果传递了值使用传递后的
if (props.apiType) {
  apiType.value = props.apiType
}
if (props.cfg) {
  cfg.value = props.cfg
}

</script>

<script lang="ts">
import MetaweblogSetting from "../../MetaweblogSetting.vue";

export default {
  name: "WordpressSetting",
  components: {MetaweblogSetting}
}
</script>

<style scoped>

</style>