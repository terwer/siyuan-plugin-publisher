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
import { useJuejinWeb } from "~/src/adaptors/web/juejin/useJuejinWeb.ts"
import { JuejinConfig } from "~/src/adaptors/web/juejin/juejinConfig.ts"
import { JuejinPlaceholder } from "~/src/adaptors/web/juejin/juejinPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useJuejinWeb(props.apiType)

const juejinCfg = cfg as JuejinConfig
const juejinPlaceholder = new JuejinPlaceholder()
juejinPlaceholder.homePlaceholder = t("setting.juejin.home.tip")
juejinPlaceholder.apiUrlPlaceholder = t("setting.juejin.apiUrl.tip")
juejinPlaceholder.passwordPlaceholder = t("setting.juejin.password.tip")
juejinPlaceholder.previewUrlPlaceholder = t("setting.juejin.previewUrl.tip")
juejinCfg.placeholder = juejinPlaceholder
</script>

<template>
  <custom-web-setting :api-type="props.apiType" :cfg="juejinCfg" />
</template>
