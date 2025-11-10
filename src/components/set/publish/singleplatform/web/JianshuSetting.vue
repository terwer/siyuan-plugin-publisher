<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import CustomWebSetting from "~/src/components/set/publish/singleplatform/base/impl/CustomWebSetting.vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import {useJianshuWeb} from "~/src/adaptors/web/jianshu/useJianshuWeb.ts";
import {JianshuConfig} from "~/src/adaptors/web/jianshu/jianshuConfig.ts";
import {JianshuPlaceholder} from "~/src/adaptors/web/jianshu/jianshuPlaceholder.ts";

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useJianshuWeb(props.apiType)

const jianshuCfg = cfg as JianshuConfig
const jianshuPlaceholder = new JianshuPlaceholder()
jianshuPlaceholder.homePlaceholder = t("setting.jianshu.home.tip")
jianshuPlaceholder.apiUrlPlaceholder = t("setting.jianshu.apiUrl.tip")
jianshuPlaceholder.passwordPlaceholder = t("setting.jianshu.password.tip")
jianshuPlaceholder.previewUrlPlaceholder = t("setting.jianshu.previewUrl.tip")
jianshuCfg.placeholder = jianshuPlaceholder
</script>

<template>
  <custom-web-setting :api-type="props.apiType" :cfg="jianshuCfg" />
</template>