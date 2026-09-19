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
import { HalowebConfig } from "~/src/adaptors/web/haloweb/HalowebConfig.ts"
import { HalowebWebPlaceholder } from "~/src/adaptors/web/haloweb/HalowebWebPlaceholder.ts"
import { useHalowebWeb } from "~/src/adaptors/web/haloweb/useHalowebWeb.ts"
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
const { cfg } = await useHalowebWeb(props.apiType)
const emit = defineEmits(["validated", "saved"])

const halowebCfg = cfg as HalowebConfig
const halowebPlaceholder = new HalowebWebPlaceholder()
halowebPlaceholder.homePlaceholder = t("setting.haloweb.home.tip")
halowebPlaceholder.apiUrlPlaceholder = t("setting.haloweb.apiUrl.tip")
halowebPlaceholder.passwordPlaceholder = t("setting.haloweb.password.tip")
halowebPlaceholder.previewUrlPlaceholder = t("setting.haloweb.previewUrl.tip")
halowebCfg.placeholder = halowebPlaceholder
</script>

<template>
  <custom-web-setting
    :api-type="props.apiType"
    :cfg="halowebCfg"
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
