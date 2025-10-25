<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import CommonBlogSetting from "~/src/components/set/publish/singleplatform/base/CommonBlogSetting.vue"
import { useLocalSystemApi } from "~/src/adaptors/fs/LocalSystem/useLocalSystemApi.ts"
import { LocalSystemConfig } from "~/src/adaptors/fs/LocalSystem/LocalSystemConfig.ts"
import { LocalSystemPlaceholder } from "~/src/adaptors/fs/LocalSystem/LocalSystemPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useLocalSystemApi(props.apiType)
const localFsCfg = cfg as LocalSystemConfig
const localFsPlaceholder = new LocalSystemPlaceholder()
localFsCfg.placeholder = localFsPlaceholder
</script>

<template>
  <common-blog-setting :api-type="props.apiType" :cfg="localFsCfg">
    <template #header="header">
      <slot name="header" :cfg="header.cfg" />
    </template>

    <template #main="main">
      <!-- 存储路径 -->
      <el-form-item :label="t('setting.blog.type.fs.store.path')">
        <el-input
          v-model="(main.cfg as LocalSystemConfig).storePath"
          :placeholder="t('setting.blog.type.fs.store.path.tip')"
        />
      </el-form-item>
      <!-- 媒体存储路径 -->
      <el-form-item :label="t('setting.blog.type.fs.media.path')">
        <el-input
          v-model="(main.cfg as LocalSystemConfig).imageStorePath"
          :placeholder="t('setting.blog.type.fs.media.path.tip')"
        />
      </el-form-item>
    </template>

    <template #footer="footer">
      <slot name="footer" :cfg="footer.cfg" />
    </template>
  </common-blog-setting>
</template>
