<template>
  <github-setting :api-type="apiType" :cfg="cfg"/>
</template>
<script lang="ts" setup>
import GithubSetting from "~/components/publish/tab/setting/GithubSetting.vue";
import {API_TYPE_CONSTANTS} from "~/utils/constants/apiTypeConstants";
import {ref} from "vue";
import {VuepressCfg} from "~/utils/platform/github/vuepress/VuepressCfg";

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_VUEPRESS)
const vuepressCfg = new VuepressCfg()
const cfg = ref(vuepressCfg)
</script>