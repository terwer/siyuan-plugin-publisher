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
import { useFlowusWeb } from "~/src/adaptors/web/flowus/useFlowusWeb.ts"
import { FlowusConfig } from "~/src/adaptors/web/flowus/flowusConfig.ts"
import { FlowusPlaceholder } from "~/src/adaptors/web/flowus/flowusPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useFlowusWeb(props.apiType)

const flowusCfg = cfg as FlowusConfig
const flowusPlaceholder = new FlowusPlaceholder()
flowusPlaceholder.homePlaceholder = t("setting.flowus.home.tip")
flowusPlaceholder.apiUrlPlaceholder = t("setting.flowus.apiUrl.tip")
flowusPlaceholder.passwordPlaceholder = t("setting.flowus.password.tip")
flowusPlaceholder.previewUrlPlaceholder = t("setting.flowus.previewUrl.tip")
flowusCfg.placeholder = flowusPlaceholder
</script>

<template>
  <custom-web-setting :api-type="props.apiType" :cfg="flowusCfg" />
</template>
