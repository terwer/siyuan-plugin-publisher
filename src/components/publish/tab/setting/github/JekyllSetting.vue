<template>
  <GithubSetting :api-type="apiType" :cfg="cfg" />
</template>

<script lang="ts" setup>
import GithubSetting from "~/components/publish/tab/setting/GithubSetting.vue"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { ref } from "vue"
import { JekyllCfg } from "~/utils/platform/github/jekyll/jekyllCfg"

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_JEKYLL)
const jekyllCfg = new JekyllCfg()
const cfg = ref(jekyllCfg)
</script>
