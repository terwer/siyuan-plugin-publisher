<script setup lang="ts">
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useMetaweblogApi } from "~/src/adaptors/api/metaweblog/useMetaweblogApi.ts"
import MetaweblogSetting from "~/src/components/set/publish/singleplatform/base/impl/MetaweblogSetting.vue"
import { MetaweblogConfig } from "~/src/adaptors/api/base/metaweblog/MetaweblogConfig.ts"
import { MetaweblogPlaceholder } from "~/src/adaptors/api/base/metaweblog/MetaweblogPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useMetaweblogApi(props.apiType)

const metaweblogCfg = cfg as MetaweblogConfig
const metaweblogPlaceholder = new MetaweblogPlaceholder()
metaweblogPlaceholder.homePlaceholder = t("setting.metaweblog.home.tip")
metaweblogPlaceholder.usernamePlaceholder = t("setting.metaweblog.username.tip")
metaweblogPlaceholder.passwordPlaceholder = t("setting.metaweblog.password.tip")
metaweblogPlaceholder.apiUrlPlaceholder = t("setting.metaweblog.apiUrl.tip")
metaweblogPlaceholder.previewUrlPlaceholder = t("setting.metaweblog.previewUrl.tip")
metaweblogCfg.placeholder = metaweblogPlaceholder
</script>

<template>
  <metaweblog-setting :api-type="props.apiType" :cfg="metaweblogCfg" />
</template>
