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
import GeneralSetting from "~/src/components/set/GeneralSetting.vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import PublishSetting from "~/src/components/set/PublishSetting.vue"

const { t } = useVueI18n()
</script>

<template>
  <el-tabs tab-position="left">
    <el-tab-pane :label="t('service.tab.publish.setting')">
      <publish-setting />
    </el-tab-pane>
    <el-tab-pane :label="t('service.tab.change.local')">
      <general-setting />
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped></style>
