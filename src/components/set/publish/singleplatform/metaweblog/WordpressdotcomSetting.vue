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
import { StrUtil } from "zhi-common"
import { WordpressdotcomConfig } from "~/src/adaptors/api/wordpress-dot-com/wordpressdotcomConfig.ts"
import WordpressdotcomUtils from "~/src/adaptors/api/wordpress-dot-com/wordpressdotcomUtils.ts"
import { useWordpressdotcomApi } from "~/src/adaptors/api/wordpress-dot-com/useWordpressdotcomApi.ts"
import { WordpressdotcomPlaceholder } from "~/src/adaptors/api/wordpress-dot-com/wordpressdotcomPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

// 处理事件的方法
const onHomeChange = (value: string, cfg: WordpressdotcomConfig) => {
  const { home, apiUrl } = WordpressdotcomUtils.parseHomeAndUrl(value)
  cfg.home = home
  cfg.apiUrl = apiUrl

  if (StrUtil.isEmptyString(cfg.home)) {
    cfg.apiUrl = ""
  }
}

const { t } = useVueI18n()
const { cfg } = await useWordpressdotcomApi(props.apiType)
const wpCfg = cfg as WordpressdotcomConfig
const wpPlaceholder = new WordpressdotcomPlaceholder()
wpPlaceholder.homePlaceholder = t("setting.wordpressdotcom.home.tip")
wpPlaceholder.usernamePlaceholder = t("setting.wordpressdotcom.username.tip")
wpPlaceholder.passwordPlaceholder = t("setting.wordpressdotcom.password.tip")
wpPlaceholder.apiUrlPlaceholder = t("setting.wordpressdotcom.apiUrl.tip")
wpPlaceholder.previewUrlPlaceholder = t("setting.wordpressdotcom.previewUrl.tip")
wpCfg.placeholder = wpPlaceholder
</script>

<template>
  <metaweblog-setting :api-type="props.apiType" :cfg="wpCfg" @onHomeChange="onHomeChange" />
</template>
