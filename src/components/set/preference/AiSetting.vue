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
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"

const { t } = useVueI18n()
const { getPublishPreferenceSetting } = usePreferenceSettingStore()

const publishPreferenceSettingForm = getPublishPreferenceSetting()
</script>

<template>
  <el-form label-width="135px" class="ai-setting-form">
    <el-form-item :label="t('pref.setting.aicode')">
      <el-input
        v-model="publishPreferenceSettingForm.experimentalAICode"
        type="password"
        autocomplete="off"
        :placeholder="t('pref.setting.aicode.tip')"
        :disabled="publishPreferenceSettingForm.experimentalUseSiyuanNoteAIConfig"
      />
    </el-form-item>
    <el-form-item :label="t('pref.setting.ai.baseurl')">
      <el-input
        v-model="publishPreferenceSettingForm.experimentalAIBaseUrl"
        autocomplete="off"
        :placeholder="t('pref.setting.ai.baseurl.tip')"
        :disabled="publishPreferenceSettingForm.experimentalUseSiyuanNoteAIConfig"
      />
    </el-form-item>
    <el-form-item :label="t('pref.setting.ai.proxy.url')">
      <el-input
        v-model="publishPreferenceSettingForm.experimentalAIProxyUrl"
        autocomplete="off"
        :placeholder="t('pref.setting.ai.proxy.url.tip')"
        :disabled="publishPreferenceSettingForm.experimentalUseSiyuanNoteAIConfig"
      />
    </el-form-item>
    <el-form-item v-if="publishPreferenceSettingForm.experimentalUseSiyuanNoteAIConfig">
      <el-alert :closable="false" :title="t('config.ai.use.siyuan')" class="form-item-tip" type="warning" />
    </el-form-item>
    <div class="form-item-bottom"></div>
  </el-form>
</template>

<style lang="stylus" scoped>
.form-item-tip
  padding 2px 4px
  margin 0 10px 0 0

.form-item-bottom
  margin-bottom 16px
</style>
