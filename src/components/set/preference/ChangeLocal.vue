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
