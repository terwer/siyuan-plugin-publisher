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
import { usePublishPreferenceSetting } from "~/src/stores/usePublishPreferenceSetting.ts"

const { t } = useVueI18n()
const { getPublishPreferenceSetting } = usePublishPreferenceSetting()

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
