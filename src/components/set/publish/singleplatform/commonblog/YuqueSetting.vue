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
import { YUQUE_PRICE_URL } from "~/src/adaptors/api/yuque/yuqueApiError.ts"
import { showYuqueValidateFeedback, type YuqueValidateResult } from "~/src/adaptors/api/yuque/useYuqueValidateFeedback.ts"

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
const membershipTip = t("setting.yuque.membership.tip")

const onValidated = (result: YuqueValidateResult) => {
  showYuqueValidateFeedback(result)
}
</script>

<template>
  <el-alert class="yuque-api-membership-hint" type="error" :closable="false" show-icon>
    <template #title>{{ t("setting.yuque.membership.bannerTitle") }}</template>
    <p class="yuque-api-membership-hint__body">{{ membershipTip }}</p>
    <a class="yuque-api-membership-hint__link" :href="YUQUE_PRICE_URL" target="_blank" rel="noopener noreferrer">
      {{ t("setting.yuque.membership.bannerLink") }}
    </a>
  </el-alert>
  <common-blog-setting :api-type="props.apiType" :cfg="yuqueCfg" @validated="onValidated" />
</template>

<style scoped>
.yuque-api-membership-hint {
  margin-bottom: 10px;
}
.yuque-api-membership-hint__body {
  margin: 4px 0 6px;
  font-size: 13px;
  line-height: 1.5;
}
.yuque-api-membership-hint__link {
  font-size: 13px;
  font-weight: 600;
}
</style>
