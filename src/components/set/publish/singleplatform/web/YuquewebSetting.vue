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
  enableOnValidated: {
    type: Boolean,
    default: false,
  },
})

const { t } = useVueI18n()
const { cfg } = await useYuquewebWeb(props.apiType)
const emit = defineEmits(["validated"])

const yuquewebCfg = cfg as YuquewebConfig
const yuquewebPlaceholder = new YuquewebWebPlaceholder()
yuquewebPlaceholder.homePlaceholder = t("setting.yuqueweb.home.tip")
yuquewebPlaceholder.apiUrlPlaceholder = t("setting.yuqueweb.apiUrl.tip")
yuquewebPlaceholder.passwordPlaceholder = t("setting.yuqueweb.password.tip")
yuquewebPlaceholder.previewUrlPlaceholder = t("setting.yuqueweb.previewUrl.tip")
yuquewebCfg.placeholder = yuquewebPlaceholder
</script>

<template>
  <custom-web-setting
    :api-type="props.apiType"
    :cfg="yuquewebCfg"
    :enable-on-validated="props.enableOnValidated"
    @validated="(result) => emit('validated', result)"
  >
    <template #header>
      <el-alert :closable="false" :title="t('setting.yuqueweb.auth.tip')" class="top-tip" type="info" />
    </template>
    <template v-if="$slots['cookie-actions']" #cookie-actions="cookieActions">
      <slot
        name="cookie-actions"
        :cfg="cookieActions.cfg"
        :dyn-cfg="cookieActions.dynCfg"
        :setting="cookieActions.setting"
        :dynamic-config-array="cookieActions.dynamicConfigArray"
        :is-manual-expanded="cookieActions.isManualExpanded"
        :toggle-manual-editor="cookieActions.toggleManualEditor"
        :expand-manual-editor="cookieActions.expandManualEditor"
      />
    </template>
  </custom-web-setting>
</template>

<style lang="stylus" scoped>
.top-tip
  margin 4px 0
</style>
