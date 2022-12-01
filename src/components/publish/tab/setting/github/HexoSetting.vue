<template>
  <github-setting :api-type="apiType" :cfg="hexoCfg"/>
</template>

<script lang="ts" setup>
import GithubSetting from "~/components/publish/tab/setting/GithubSetting.vue";
import {API_TYPE_CONSTANTS} from "~/utils/constants/apiTypeConstants";
import {ref} from "vue";
import {HexoCfg} from "~/utils/platform/github/hexo/hexoCfg";

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_HEXO)
const hexoCfg = new HexoCfg()
const cfg = ref(hexoCfg)
</script>

<style scoped>

</style>