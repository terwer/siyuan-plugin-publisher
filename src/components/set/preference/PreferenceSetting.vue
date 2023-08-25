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
  </el-form>
</template>
