<!--
  - Copyright (c) 2023, Terwer . All rights reserved.
  - DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
  -
  - This code is free software; you can redistribute it and/or modify it
  - under the terms of the GNU General Public License version 2 only, as
  - published by the Free Software Foundation.  Terwer designates this
  - particular file as subject to the "Classpath" exception as provided
  - by Terwer in the LICENSE file that accompanied this code.
  -
  - This code is distributed in the hope that it will be useful, but WITHOUT
  - ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
  - FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
  - version 2 for more details (a copy is included in the LICENSE file that
  - accompanied this code).
  -
  - You should have received a copy of the GNU General Public License version
  - 2 along with this work; if not, write to the Free Software Foundation,
  - Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
  -
  - Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
  - or visit www.terwer.space if you need additional information or have any
  - questions.
  -->

<script setup lang="ts">
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { StrUtil } from "zhi-common"
import { getSiyuanWidgetId } from "~/src/utils/siyuanUtils.ts"

const { t } = useVueI18n()
const { getPublishPreferenceSetting } = usePreferenceSettingStore()
const { isInSiyuanPlugin, isInSiyuanWidget } = useSiyuanDevice()

const publishPreferenceSettingForm = getPublishPreferenceSetting()
const isSiyuanPlugin = isInSiyuanPlugin() || (isInSiyuanWidget() && StrUtil.isEmptyString(getSiyuanWidgetId()))
</script>

<template>
  <el-form inline label-width="125px" class="publish-preference-setting-form">
    <el-form-item :label="t('preference.setting.fixTitle')">
      <el-switch v-model="publishPreferenceSettingForm.fixTitle"></el-switch>
    </el-form-item>
    <el-form-item :label="t('preference.setting.keepTitle')">
      <el-switch v-model="publishPreferenceSettingForm.keepTitle"></el-switch>
    </el-form-item>
    <el-form-item :label="t('preference.setting.removeH1')">
      <el-switch v-model="publishPreferenceSettingForm.removeFirstH1"></el-switch>
    </el-form-item>
    <el-form-item :label="t('preference.setting.removeWidgetTag')">
      <el-switch v-model="publishPreferenceSettingForm.removeMdWidgetTag"></el-switch>
    </el-form-item>

    <div v-if="isSiyuanPlugin">
      <el-divider border-style="dashed" class="psd" />

      <el-form-item :label="t('preference.setting.showDocQuickMenu')">
        <el-switch v-model="publishPreferenceSettingForm.showDocQuickMenu"></el-switch>
      </el-form-item>

      <el-divider border-style="dashed" class="psd" />

      <el-form-item :label="t('preference.setting.showQuickMenu')">
        <el-switch v-model="publishPreferenceSettingForm.showQuickMenu"></el-switch>
      </el-form-item>
      <el-form-item :label="t('preference.setting.showSingleMenu')">
        <el-switch v-model="publishPreferenceSettingForm.showSingleMenu"></el-switch>
      </el-form-item>
      <el-form-item :label="t('preference.setting.showBatchMenu')">
        <el-switch v-model="publishPreferenceSettingForm.showBatchMenu"></el-switch>
      </el-form-item>
      <el-form-item :label="t('preference.setting.showAIMenu')">
        <el-switch v-model="publishPreferenceSettingForm.showAIMenu"></el-switch>
      </el-form-item>
      <el-form-item :label="t('preference.setting.showExtendMenu')">
        <el-switch v-model="publishPreferenceSettingForm.showExtendMenu"></el-switch>
      </el-form-item>
      <el-form-item :label="t('preference.setting.showArticleManageMenu')">
        <el-switch v-model="publishPreferenceSettingForm.showArticleManageMenu"></el-switch>
      </el-form-item>
    </div>
  </el-form>
</template>

<style scoped lang="stylus">
.psd
  margin-bottom 10px
  margin-top 0
</style>
