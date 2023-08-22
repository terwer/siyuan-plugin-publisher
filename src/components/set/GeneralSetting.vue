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
import PreferenceSetting from "~/src/components/set/preference/PreferenceSetting.vue"

const { t } = useVueI18n()
</script>

<template>
  <back-page :title="t('service.tab.change.local')">
    <el-tabs tab-position="left" class="general-setting-box">
      <el-tab-pane :label="t('service.tab.change.local')">
        <preference-setting />
      </el-tab-pane>
      <el-tab-pane :label="t('siyuan.config.setting')">
        <siyuan-setting />
      </el-tab-pane>
      <el-tab-pane :label="t('lang.choose')">
        <change-local />
      </el-tab-pane>
      <el-tab-pane :label="t('service.tab.post.bind')">
        <post-bind />
      </el-tab-pane>
    </el-tabs>
  </back-page>
</template>

<style lang="stylus" scoped>
.general-setting-box
  margin-top 20px
</style>
