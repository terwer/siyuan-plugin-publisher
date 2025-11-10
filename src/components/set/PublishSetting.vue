<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
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
