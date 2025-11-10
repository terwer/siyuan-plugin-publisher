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
import { useNotionApi } from "~/src/adaptors/api/notion/useNotionApi.ts"
import { NotionConfig } from "~/src/adaptors/api/notion/notionConfig.ts"
import { NotionPlaceholder } from "~/src/adaptors/api/notion/notionPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useNotionApi(props.apiType)
const notionCfg = cfg as NotionConfig
const notionPlaceholder = new NotionPlaceholder()
notionPlaceholder.homePlaceholder = t("setting.notion.home.tip")
notionPlaceholder.passwordPlaceholder = t("setting.notion.password.tip")
notionPlaceholder.apiUrlPlaceholder = t("setting.notion.apiurl.tip")
notionPlaceholder.previewUrlPlaceholder = t("setting.notion.previewUrl.tip")
notionCfg.placeholder = notionPlaceholder
</script>

<template>
  <common-blog-setting :api-type="props.apiType" :cfg="notionCfg" />
</template>
