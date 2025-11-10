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
import { ZhihuConfig } from "~/src/adaptors/web/zhihu/zhihuConfig.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useZhihuWeb } from "~/src/adaptors/web/zhihu/useZhihuWeb.ts"
import { ZhihuPlaceholder } from "~/src/adaptors/web/zhihu/zhihuPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useZhihuWeb(props.apiType)

const zhihuCfg = cfg as ZhihuConfig
const zhihuPlaceholder = new ZhihuPlaceholder()
zhihuPlaceholder.homePlaceholder = t("setting.zhihu.home.tip")
zhihuPlaceholder.apiUrlPlaceholder = t("setting.zhihu.apiUrl.tip")
zhihuPlaceholder.usernamePlaceholder = t("setting.zhihu.username.tip")
zhihuPlaceholder.passwordPlaceholder = t("setting.zhihu.password.tip")
zhihuPlaceholder.previewUrlPlaceholder = t("setting.zhihu.previewUrl.tip")
zhihuCfg.placeholder = zhihuPlaceholder
</script>

<template>
  <custom-web-setting :api-type="props.apiType" :cfg="zhihuCfg" />
</template>