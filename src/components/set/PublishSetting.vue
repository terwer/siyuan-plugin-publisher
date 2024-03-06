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
import { ref } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import MaterialSymbolsFormatListBulleted from "~icons/material-symbols/format-list-bulleted"
import MdiImport from "~icons/mdi/import"
import MaterialSymbolsLightStorefront from "~icons/material-symbols-light/storefront"
import PublishSettingTips from "~/src/components/set/publish/platform/PublishSettingTips.vue"

// uses
const { t } = useVueI18n()

// vars
const activeMenu = ref("publish")
</script>

<template>
  <back-page :title="t('service.tab.publish.setting')">
    <div class="publish-setting-body">
      <el-tabs v-model="activeMenu" class="setting-tabs" :key="activeMenu">
        <el-tab-pane name="publish">
          <template #label>
            <span>
              <i class="el-icon"><MaterialSymbolsFormatListBulleted /></i> {{ t("service.tab.publish.setting") }}
            </span>
          </template>
          <publish-platform-setting-list />
        </el-tab-pane>
        <el-tab-pane name="import">
          <template #label>
            <span>
              <i class="el-icon"> <MdiImport /></i> {{ t("setting.platform.import") }}
            </span>
          </template>
          <publish-platform-import />
        </el-tab-pane>
        <el-tab-pane name="store">
          <template #label>
            <span>
              <i class="el-icon"> <MaterialSymbolsLightStorefront /></i> {{ t("setting.platform.store") }}
            </span>
          </template>
          <publish-platform-store />
        </el-tab-pane>
      </el-tabs>

      <!--
      -----------------------------------------------------------------------------
      -->

      <publish-setting-tips />
    </div>
  </back-page>
</template>

<style scoped lang="stylus">
.publish-setting-body
  .setting-tabs
    margin-top 20px
    margin-bottom 20px
</style>
