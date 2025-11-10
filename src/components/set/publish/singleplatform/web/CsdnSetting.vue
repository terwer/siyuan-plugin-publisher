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
import { CsdnConfig } from "~/src/adaptors/web/csdn/csdnConfig.ts"
import { CsdnPlaceholder } from "~/src/adaptors/web/csdn/csdnPlaceholder.ts"
import { useCsdnWeb } from "~/src/adaptors/web/csdn/useCsdnWeb.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useCsdnWeb(props.apiType)

const csdnCfg = cfg as CsdnConfig
const csdnPlaceholder = new CsdnPlaceholder()
csdnPlaceholder.homePlaceholder = t("setting.csdn.home.tip")
csdnPlaceholder.apiUrlPlaceholder = t("setting.csdn.apiUrl.tip")
csdnPlaceholder.passwordPlaceholder = t("setting.csdn.password.tip")
csdnPlaceholder.previewUrlPlaceholder = t("setting.csdn.previewUrl.tip")
csdnCfg.placeholder = csdnPlaceholder
</script>

<template>
  <custom-web-setting :api-type="props.apiType" :cfg="csdnCfg" />
</template>
