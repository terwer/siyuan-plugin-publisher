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
import { JvueConfig } from "~/src/adaptors/api/jvue/jvueConfig.ts"
import { useJvueApi } from "~/src/adaptors/api/jvue/useJvueApi.ts"
import { JvuePlaceHolder } from "~/src/adaptors/api/jvue/jvuePlaceHolder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useJvueApi(props.apiType)
const tcCfg = cfg as JvueConfig
const tcPlaceholder = new JvuePlaceHolder()
tcPlaceholder.homePlaceholder = t("setting.jvue.home.tip")
tcPlaceholder.usernamePlaceholder = t("setting.jvue.username.tip")
tcPlaceholder.passwordPlaceholder = t("setting.jvue.password.tip")
tcPlaceholder.apiUrlPlaceholder = t("setting.jvue.apiUrl.tip")
tcPlaceholder.previewUrlPlaceholder = t("setting.jvue.previewUrl.tip")
tcCfg.placeholder = tcPlaceholder
</script>

<template>
  <metaweblog-setting :api-type="props.apiType" :cfg="tcCfg" />
</template>
