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
import { useJuejinWeb } from "~/src/adaptors/web/juejin/useJuejinWeb.ts"
import { JuejinConfig } from "~/src/adaptors/web/juejin/juejinConfig.ts"
import { JuejinPlaceholder } from "~/src/adaptors/web/juejin/juejinPlaceholder.ts"

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
const { cfg } = await useJuejinWeb(props.apiType)
const emit = defineEmits(["validated", "saved"])

const juejinCfg = cfg as JuejinConfig
const juejinPlaceholder = new JuejinPlaceholder()
juejinPlaceholder.homePlaceholder = t("setting.juejin.home.tip")
juejinPlaceholder.apiUrlPlaceholder = t("setting.juejin.apiUrl.tip")
juejinPlaceholder.passwordPlaceholder = t("setting.juejin.password.tip")
juejinPlaceholder.previewUrlPlaceholder = t("setting.juejin.previewUrl.tip")
juejinCfg.placeholder = juejinPlaceholder
</script>

<template>
  <custom-web-setting
    :api-type="props.apiType"
    :cfg="juejinCfg"
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
