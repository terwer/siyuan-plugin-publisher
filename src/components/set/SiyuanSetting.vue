<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script lang="ts" setup>
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useSiyuanSettingStore } from "~/src/stores/useSiyuanSettingStore.ts"

const { t } = useVueI18n()
const { getSiyuanSetting } = useSiyuanSettingStore()

const siyuanSettingForm = getSiyuanSetting()
</script>

<template>
  <el-form label-width="125px" class="siyuan-setting-form">
    <el-form-item :label="t('setting.blog.siyuan.apiurl')" prop="apiUrl">
      <el-input
        v-model="siyuanSettingForm.apiUrl"
        autocomplete="off"
        :placeholder="t('setting.blog.siyuan.apiurl.tip')"
      />
    </el-form-item>
    <el-form-item :label="t('setting.blog.siyuan.password')" prop="pwd">
      <el-input
        v-model="siyuanSettingForm.password"
        type="password"
        autocomplete="off"
        :placeholder="t('setting.blog.siyuan.password.tip')"
        show-password
      />
    </el-form-item>
  </el-form>
</template>
