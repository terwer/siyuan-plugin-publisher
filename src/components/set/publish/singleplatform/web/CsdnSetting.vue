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
import { CsdnConfig } from "~/src/adaptors/web/csdn/csdnConfig.ts"
import { CsdnPlaceholder } from "~/src/adaptors/web/csdn/csdnPlaceholder.ts"
import { useCsdnWeb } from "~/src/adaptors/web/csdn/useCsdnWeb.ts"

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
const { cfg } = await useCsdnWeb(props.apiType)
const emit = defineEmits(["validated", "saved"])

const csdnCfg = cfg as CsdnConfig
const csdnPlaceholder = new CsdnPlaceholder()
csdnPlaceholder.homePlaceholder = t("setting.csdn.home.tip")
csdnPlaceholder.apiUrlPlaceholder = t("setting.csdn.apiUrl.tip")
csdnPlaceholder.passwordPlaceholder = t("setting.csdn.password.tip")
csdnPlaceholder.previewUrlPlaceholder = t("setting.csdn.previewUrl.tip")
csdnCfg.placeholder = csdnPlaceholder
</script>

<template>
  <custom-web-setting
    :api-type="props.apiType"
    :cfg="csdnCfg"
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
