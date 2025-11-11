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
import { useCnblogsApi } from "~/src/adaptors/api/cnblogs/useCnblogsApi.ts"
import MetaweblogSetting from "~/src/components/set/publish/singleplatform/base/impl/MetaweblogSetting.vue"
import { CnblogsPlaceholder } from "~/src/adaptors/api/cnblogs/cnblogsPlaceholder.ts"
import { CnblogsConfig } from "~/src/adaptors/api/cnblogs/cnblogsConfig.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useCnblogsApi(props.apiType)

const cnblogsCfg = cfg as CnblogsConfig
const cnblogsPlaceholder = new CnblogsPlaceholder()
cnblogsPlaceholder.homePlaceholder = t("setting.cnblogs.home.tip")
cnblogsPlaceholder.usernamePlaceholder = t("setting.cnblogs.username.tip")
cnblogsPlaceholder.passwordPlaceholder = t("setting.cnblogs.password.tip")
cnblogsPlaceholder.apiUrlPlaceholder = t("setting.cnblogs.apiUrl.tip")
cnblogsPlaceholder.previewUrlPlaceholder = t("setting.cnblogs.previewUrl.tip")
cnblogsCfg.placeholder = cnblogsPlaceholder
</script>

<template>
  <metaweblog-setting :api-type="props.apiType" :cfg="cnblogsCfg" />
</template>
