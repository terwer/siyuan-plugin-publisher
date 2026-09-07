<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { computed } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"
import type { SiyuanAiProvider } from "~/src/models/publishPreferenceCfg.ts"

const { t } = useVueI18n()
const { getPublishPreferenceSetting, getSisyuanAiProviders, selectSisyuanAiModel } = usePreferenceSettingStore()

const publishPreferenceSettingForm = getPublishPreferenceSetting()

/**
 * 思源笔记 AI providers（启用且含可用模型）。V1/V2 共用，V2 亦复用本组件。
 */
const siyuanProviders = computed<SiyuanAiProvider[]>(() => getSisyuanAiProviders())

/**
 * 判断是否正在使用思源笔记 AI 配置：进入该模式时启用模型选择器并禁用其它手填项
 */
const useSiyuanCfg = computed(
  () => publishPreferenceSettingForm.value.experimentalUseSiyuanNoteAIConfig && siyuanProviders.value.length > 0
)

const handleModelChange = (modelId: string) => {
  if (modelId) {
    selectSisyuanAiModel(modelId)
  }
}
</script>

<template>
  <el-form label-width="135px" class="ai-setting-form">
    <!-- 思源笔记 AI 模型选择（V1/V2 共用组件核心交互） -->
    <el-form-item v-if="useSiyuanCfg" :label="t('pref.setting.ai.model')">
      <div class="ai-model-group">
        <el-select
          v-model="publishPreferenceSettingForm.experimentalSisyuanAiActiveModelId"
          class="ai-model-select"
          :placeholder="t('pref.setting.ai.model.tip')"
          :aria-label="t('pref.setting.ai.model')"
          @change="handleModelChange"
        >
          <el-option-group v-for="p in siyuanProviders" :key="p.id" :label="p.displayName">
            <el-option v-for="m in p.models" :key="m.id" :label="m.name" :value="m.id" />
          </el-option-group>
        </el-select>
        <span class="ai-model-baseurl">{{ publishPreferenceSettingForm.experimentalAIBaseUrl }}</span>
      </div>
    </el-form-item>

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

    <!-- AI Model（使用思源配置时由上方的模型选择器替代） -->
    <el-form-item v-if="!useSiyuanCfg" :label="t('pref.setting.ai.model')">
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

.ai-model-group
  display flex
  align-items center
  width 100%

.ai-model-select
  width 100%

.ai-model-baseurl
  margin-left 12px
  color #909399
  font-size 12px
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  max-width 40%
</style>
