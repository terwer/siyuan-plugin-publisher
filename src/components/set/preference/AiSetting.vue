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
    <!-- API Key -->
    <el-form-item :label="t('pref.setting.aicode')">
      <el-input
        v-model="publishPreferenceSettingForm.experimentalAICode"
        type="password"
        autocomplete="off"
        :placeholder="t('pref.setting.aicode.tip')"
        :disabled="publishPreferenceSettingForm.experimentalUseSiyuanNoteAIConfig"
      />
    </el-form-item>

    <!-- API Base URL -->
    <el-form-item :label="t('pref.setting.ai.baseurl')">
      <el-input
        v-model="publishPreferenceSettingForm.experimentalAIBaseUrl"
        autocomplete="off"
        :placeholder="t('pref.setting.ai.baseurl.tip')"
        :disabled="publishPreferenceSettingForm.experimentalUseSiyuanNoteAIConfig"
      />
    </el-form-item>

    <!-- Proxy URL -->
    <el-form-item :label="t('pref.setting.ai.proxy.url')">
      <el-input
        v-model="publishPreferenceSettingForm.experimentalAIProxyUrl"
        autocomplete="off"
        :placeholder="t('pref.setting.ai.proxy.url.tip')"
        :disabled="publishPreferenceSettingForm.experimentalUseSiyuanNoteAIConfig"
      />
    </el-form-item>

    <!-- AI Model -->
    <el-form-item :label="t('pref.setting.ai.model')">
      <el-input
        v-model="publishPreferenceSettingForm.experimentalAIApiModel"
        autocomplete="off"
        :placeholder="t('pref.setting.ai.model.tip')"
        :disabled="publishPreferenceSettingForm.experimentalUseSiyuanNoteAIConfig"
      />
    </el-form-item>

    <!-- Max Tokens -->
    <el-form-item :label="t('pref.setting.ai.max.tokens')">
      <el-input-number
        v-model="publishPreferenceSettingForm.experimentalAIApiMaxTokens"
        :min="0"
        :max="32768"
        :controls="false"
        :placeholder="t('pref.setting.ai.max.tokens.tip')"
        :disabled="publishPreferenceSettingForm.experimentalUseSiyuanNoteAIConfig"
      />
    </el-form-item>

    <!-- Temperature -->
    <el-form-item :label="t('pref.setting.ai.temperature')">
      <div class="temperature-container">
        <el-slider
          v-model="publishPreferenceSettingForm.experimentalAIApiTemperature"
          :min="0"
          :max="2"
          :step="0.1"
          :disabled="publishPreferenceSettingForm.experimentalUseSiyuanNoteAIConfig"
        />
        <span class="temperature-value">{{
          publishPreferenceSettingForm.experimentalAIApiTemperature?.toFixed(1) || "0.0"
        }}</span>
      </div>
    </el-form-item>

    <!-- Siyuan Note AI Config Warning -->
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

.temperature-container
  display flex
  align-items center
  width 100%

.temperature-value
  display inline-block
  margin-left 12px
  min-width 30px
  color #606266
  font-size 12px
  text-align right
</style>
