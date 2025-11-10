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
import PreferenceSetting from "~/src/components/set/preference/PreferenceSetting.vue"

const { t } = useVueI18n()
</script>

<template>
  <back-page :title="t('service.tab.change.local')">
    <el-tabs tab-position="left" class="general-setting-box">
      <el-tab-pane :label="t('service.tab.change.local')">
        <preference-setting />
      </el-tab-pane>
      <el-tab-pane :label="t('sys.config.ai')">
        <ai-setting />
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
