<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script lang="ts" setup>
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import MetaweblogSetting from "~/src/components/set/publish/singleplatform/base/impl/MetaweblogSetting.vue"
import { useWordpressApi } from "~/src/adaptors/api/wordpress/useWordpressApi.ts"
import { WordpressConfig } from "~/src/adaptors/api/wordpress/wordpressConfig.ts"
import { WordpressPlaceholder } from "~/src/adaptors/api/wordpress/wordpressPlaceholder.ts"
import WordpressUtils from "~/src/adaptors/api/wordpress/wordpressUtils.ts"
import { StrUtil } from "zhi-common"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

// 处理事件的方法
const onHomeChange = (value: string, cfg: WordpressConfig) => {
  const { home, apiUrl } = WordpressUtils.parseHomeAndUrl(value)
  cfg.home = home
  cfg.apiUrl = apiUrl

  if (StrUtil.isEmptyString(cfg.home)) {
    cfg.apiUrl = ""
  }
}

const { t } = useVueI18n()
const { cfg } = await useWordpressApi(props.apiType)
const wpCfg = cfg as WordpressConfig
const wpPlaceholder = new WordpressPlaceholder()
wpPlaceholder.homePlaceholder = t("setting.wordpress.home.tip")
wpPlaceholder.usernamePlaceholder = t("setting.wordpress.username.tip")
wpPlaceholder.passwordPlaceholder = t("setting.wordpress.password.tip")
wpPlaceholder.apiUrlPlaceholder = t("setting.wordpress.apiUrl.tip")
wpPlaceholder.previewUrlPlaceholder = t("setting.wordpress.previewUrl.tip")
wpCfg.placeholder = wpPlaceholder
</script>

<template>
  <metaweblog-setting :api-type="props.apiType" :cfg="wpCfg" @onHomeChange="onHomeChange" />
</template>
