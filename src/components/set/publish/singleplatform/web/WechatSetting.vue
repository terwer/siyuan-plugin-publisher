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
import {useWechatWeb} from "~/src/adaptors/web/wechat/useWechatWeb.ts";
import {WechatConfig} from "~/src/adaptors/web/wechat/wechatConfig.ts";
import {WechatPlaceholder} from "~/src/adaptors/web/wechat/wechatPlaceholder.ts";

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useWechatWeb(props.apiType)

const wechatCfg = cfg as WechatConfig
const wechatPlaceholder = new WechatPlaceholder()
wechatPlaceholder.homePlaceholder = t("setting.wechat.home.tip")
wechatPlaceholder.apiUrlPlaceholder = t("setting.wechat.apiUrl.tip")
wechatPlaceholder.passwordPlaceholder = t("setting.wechat.password.tip")
wechatPlaceholder.previewUrlPlaceholder = t("setting.wechat.previewUrl.tip")
wechatCfg.placeholder = wechatPlaceholder
</script>

<template>
  <custom-web-setting :api-type="props.apiType" :cfg="wechatCfg" />
</template>
