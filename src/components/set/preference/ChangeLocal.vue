<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { onBeforeMount } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"

const logger = createAppLogger("change-local")
const { getSetting, updateSetting } = usePublishSettingStore()
const { t, locale } = useVueI18n()
const langs = [
  {
    value: "zh_CN",
    label: "简体中文",
  },
  {
    value: "en_US",
    label: "English",
  },
]

const setting = await getSetting()

const langChanged = async (lang) => {
  locale.value = lang
  setting.lang = lang
  await updateSetting(setting)
  logger.info("lang changed to", lang)
}

// lifecycles
onBeforeMount(() => {
  // 设置默认语言
  if (setting?.lang) {
    locale.value = setting?.lang
  }
})
</script>

<template>
  <div class="locale-changer">
    <el-form label-width="85px">
      <!-- 语言选项 -->
      <el-form-item :label="t('lang.choose')">
        <el-select v-model="locale" :placeholder="t('lang.choose.placeholder')" @change="langChanged">
          <el-option v-for="(lang, i) in langs" :key="i" :label="lang.label" :value="lang.value" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
