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
import TypechoUtils from "~/src/adaptors/api/typecho/typechoUtils.ts"
import { TypechoConfig } from "~/src/adaptors/api/typecho/typechoConfig.ts"
import { TypechoPlaceholder } from "~/src/adaptors/api/typecho/typechoPlaceholder.ts"
import { useTypechoApi } from "~/src/adaptors/api/typecho/useTypechoApi.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

// 处理事件的方法
const onHomeChange = (value: string, cfg: TypechoConfig) => {
  const { home, apiUrl } = TypechoUtils.parseHomeAndUrl(value)
  cfg.home = home
  cfg.apiUrl = apiUrl

  if (StrUtil.isEmptyString(cfg.home)) {
    cfg.apiUrl = ""
  }
}

const { t } = useVueI18n()
const { cfg } = await useTypechoApi(props.apiType)
const tcCfg = cfg as TypechoConfig
const tcPlaceholder = new TypechoPlaceholder()
tcPlaceholder.homePlaceholder = t("setting.typecho.home.tip")
tcPlaceholder.usernamePlaceholder = t("setting.typecho.username.tip")
tcPlaceholder.passwordPlaceholder = t("setting.typecho.password.tip")
tcPlaceholder.apiUrlPlaceholder = t("setting.typecho.apiUrl.tip")
tcPlaceholder.previewUrlPlaceholder = t("setting.typecho.previewUrl.tip")
tcCfg.placeholder = tcPlaceholder
</script>

<template>
  <metaweblog-setting :api-type="props.apiType" :cfg="tcCfg" @onHomeChange="onHomeChange" />
</template>
