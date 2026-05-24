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
import { useJianshuWeb } from "~/src/adaptors/web/jianshu/useJianshuWeb.ts"
import { JianshuConfig } from "~/src/adaptors/web/jianshu/jianshuConfig.ts"
import { JianshuPlaceholder } from "~/src/adaptors/web/jianshu/jianshuPlaceholder.ts"

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
const { cfg } = await useJianshuWeb(props.apiType)
const emit = defineEmits(["validated", "saved"])

const jianshuCfg = cfg as JianshuConfig
const jianshuPlaceholder = new JianshuPlaceholder()
jianshuPlaceholder.homePlaceholder = t("setting.jianshu.home.tip")
jianshuPlaceholder.apiUrlPlaceholder = t("setting.jianshu.apiUrl.tip")
jianshuPlaceholder.passwordPlaceholder = t("setting.jianshu.password.tip")
jianshuPlaceholder.previewUrlPlaceholder = t("setting.jianshu.previewUrl.tip")
jianshuCfg.placeholder = jianshuPlaceholder
</script>

<template>
  <custom-web-setting
    :api-type="props.apiType"
    :cfg="jianshuCfg"
    :enable-on-validated="props.enableOnValidated"
    @validated="(result) => emit('validated', result)"
    @saved="(result) => emit('saved', result)"
  >
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
