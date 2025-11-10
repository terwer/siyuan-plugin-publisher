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
import {useHalowebWeb} from "~/src/adaptors/web/haloweb/useHalowebWeb.ts";
import {HalowebConfig} from "~/src/adaptors/web/haloweb/HalowebConfig.ts";
import {HalowebWebPlaceholder} from "~/src/adaptors/web/haloweb/HalowebWebPlaceholder.ts";

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useHalowebWeb(props.apiType)

const halowebCfg = cfg as HalowebConfig
const halowebPlaceholder = new HalowebWebPlaceholder()
halowebPlaceholder.homePlaceholder = t("setting.haloweb.home.tip")
halowebPlaceholder.apiUrlPlaceholder = t("setting.haloweb.apiUrl.tip")
halowebPlaceholder.passwordPlaceholder = t("setting.haloweb.password.tip")
halowebPlaceholder.previewUrlPlaceholder = t("setting.haloweb.previewUrl.tip")
halowebCfg.placeholder = halowebPlaceholder
</script>

<template>
  <custom-web-setting :api-type="props.apiType" :cfg="halowebCfg" />
</template>
