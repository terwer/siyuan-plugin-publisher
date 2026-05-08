<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import CustomWebSetting from "~/src/components/set/publish/singleplatform/base/impl/CustomWebSetting.vue"
import { YuquewebConfig } from "~/src/adaptors/web/yuqueweb/YuquewebConfig.ts"
import { YuquewebWebPlaceholder } from "~/src/adaptors/web/yuqueweb/YuquewebWebPlaceholder.ts"
import { useYuquewebWeb } from "~/src/adaptors/web/yuqueweb/useYuquewebWeb.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useYuquewebWeb(props.apiType)

const yuquewebCfg = cfg as YuquewebConfig
const yuquewebPlaceholder = new YuquewebWebPlaceholder()
yuquewebPlaceholder.homePlaceholder = t("setting.yuqueweb.home.tip")
yuquewebPlaceholder.apiUrlPlaceholder = t("setting.yuqueweb.apiUrl.tip")
yuquewebPlaceholder.passwordPlaceholder = t("setting.yuqueweb.password.tip")
yuquewebPlaceholder.previewUrlPlaceholder = t("setting.yuqueweb.previewUrl.tip")
yuquewebCfg.placeholder = yuquewebPlaceholder
</script>

<template>
  <custom-web-setting :api-type="props.apiType" :cfg="yuquewebCfg">
    <template #header>
      <el-alert :closable="false" :title="t('setting.yuqueweb.auth.tip')" class="top-tip" type="info" />
    </template>
  </custom-web-setting>
</template>

<style lang="stylus" scoped>
.top-tip
  margin 4px 0
</style>
