<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useBilibiliWeb } from "~/src/adaptors/web/bilibili/useBilibiliWeb.ts"
import { BilibiliConfig } from "~/src/adaptors/web/bilibili/bilibiliConfig.ts"
import { BilibiliPlaceholder } from "~/src/adaptors/web/bilibili/bilibiliPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useBilibiliWeb(props.apiType)

const bilibiliCfg = cfg as BilibiliConfig
const bilibiliPlaceholder = new BilibiliPlaceholder()
bilibiliPlaceholder.homePlaceholder = t("setting.bilibili.home.tip")
bilibiliPlaceholder.apiUrlPlaceholder = t("setting.bilibili.apiUrl.tip")
bilibiliPlaceholder.passwordPlaceholder = t("setting.bilibili.password.tip")
bilibiliPlaceholder.previewUrlPlaceholder = t("setting.bilibili.previewUrl.tip")
bilibiliCfg.placeholder = bilibiliPlaceholder
</script>

<template>
  <custom-web-setting :api-type="props.apiType" :cfg="bilibiliCfg" />
</template>
