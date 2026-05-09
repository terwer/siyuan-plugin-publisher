<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->
<script lang="ts" setup>
const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
  cfg: {
    // 必须继承MetaweblogConfig
    type: Object,
    default: null,
  },
})

</script>

<template>
  <common-blog-setting :api-type="props.apiType" :cfg="props.cfg">
    <template #header="header">
      <slot name="header" :cfg="header.cfg" />
    </template>
    <template #cookie-actions="cookieActions">
      <slot
        name="cookie-actions"
        :cfg="cookieActions.cfg"
        :dyn-cfg="cookieActions.dynCfg"
        :setting="cookieActions.setting"
        :dynamic-config-array="cookieActions.dynamicConfigArray"
      />
    </template>
    <template #main="main">
      <slot name="main" :cfg="main.cfg" />
    </template>
    <template #footer="footer">
      <slot name="footer" :cfg="footer.cfg" />
    </template>
  </common-blog-setting>
</template>
