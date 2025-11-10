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
import { useHaloApi } from "~/src/adaptors/api/halo/useHaloApi.ts"
import { HaloConfig } from "~/src/adaptors/api/halo/HaloConfig.ts"
import { HaloPlaceholder } from "~/src/adaptors/api/halo/HaloPlaceholder.ts"
import { StrUtil } from "zhi-common"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useHaloApi(props.apiType)
const haloCfg = cfg as HaloConfig
const haloPlaceholder = new HaloPlaceholder()
haloPlaceholder.homePlaceholder = t("setting.halo.home.tip")
haloPlaceholder.usernamePlaceholder = t("setting.halo.username.tip")
haloPlaceholder.passwordPlaceholder = t("setting.halo.password.tip")
haloPlaceholder.apiUrlPlaceholder = t("setting.halo.apiUrl.tip")
haloPlaceholder.previewUrlPlaceholder = t("setting.halo.previewUrl.tip")
haloCfg.placeholder = haloPlaceholder

// 处理事件的方法
const onHomeChange = (value: string, cfg: HaloConfig) => {
  if (StrUtil.isEmptyString(cfg.home)) {
    cfg.apiUrl = ""
  } else {
    cfg.apiUrl = cfg.home
  }
}
</script>

<template>
  <common-blog-setting :api-type="props.apiType" :cfg="haloCfg" @onHomeChange="onHomeChange">
    <template #header="header">
      <el-alert :title="t('setting.platform.halo.v29.only')" type="error" class="form-item-tip" :closable="false" />
    </template>
  </common-blog-setting>
</template>

<style scoped lang="stylus">
.form-item-tip
  margin-bottom 10px
</style>
