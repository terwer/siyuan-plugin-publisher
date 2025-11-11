<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import CommonBlogSetting from "~/src/components/set/publish/singleplatform/base/CommonBlogSetting.vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useYuqueApi } from "~/src/adaptors/api/yuque/useYuqueApi.ts"
import { YuqueConfig } from "~/src/adaptors/api/yuque/yuqueConfig.ts"
import { YuquePlaceholder } from "~/src/adaptors/api/yuque/yuquePlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useYuqueApi(props.apiType)
const yuqueCfg = cfg as YuqueConfig
const yuquePlaceholder = new YuquePlaceholder()
yuquePlaceholder.homePlaceholder = t("setting.yuque.home.tip")
yuquePlaceholder.usernamePlaceholder = t("setting.yuque.username.tip")
yuquePlaceholder.passwordPlaceholder = t("setting.yuque.password.tip")
yuquePlaceholder.apiUrlPlaceholder = t("setting.yuque.apiurl.tip")
yuquePlaceholder.previewUrlPlaceholder = t("setting.yuque.previewUrl.tip")
yuqueCfg.placeholder = yuquePlaceholder
</script>

<template>
  <common-blog-setting :api-type="props.apiType" :cfg="yuqueCfg" />
</template>
