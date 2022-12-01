<template>
  <github-setting :api-type="apiType" :cfg="hugoCfg"/>
</template>

<script lang="ts" setup>
import GithubSetting from "~/components/publish/tab/setting/GithubSetting.vue";
import {API_TYPE_CONSTANTS} from "~/utils/constants/apiTypeConstants";
import {ref} from "vue";
import {HugoCfg} from "~/utils/platform/github/hugo/hugoCfg";

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_HUGO)
const hugoCfg = new HugoCfg()
const cfg = ref(hugoCfg)

</script>

<script lang="ts">
export default {
  name: "HugoSetting"
}
</script>

<style scoped>

</style>