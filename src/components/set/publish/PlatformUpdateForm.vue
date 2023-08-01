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
import BackPage from "~/src/components/common/BackPage.vue"
import { reactive, ref } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useRoute, useRouter } from "vue-router"
import {
  AuthMode,
  DynamicConfig,
  DynamicJsonCfg,
  getDynCfgByKey,
  getNewPlatformKey,
  PlatformType,
  replacePlatformByKey,
  setDynamicJsonCfg,
} from "~/src/components/set/publish/platform/dynamicConfig.ts"
import { JsonUtil } from "zhi-common"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { SypConfig } from "~/syp.config.ts"
import { useSettingStore } from "~/src/stores/useSettingStore.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { ElMessage, FormRules } from "element-plus"

const logger = createAppLogger("platform-update-form")

// uses
const { t } = useVueI18n()
const router = useRouter()
const route = useRoute()
const { getSetting, updateSetting } = useSettingStore()

// datas
const params = reactive(route.params)
const key = params.key as string

const formRef = ref()
const formData = reactive({
  key: key,

  dynCfg: new DynamicConfig(PlatformType.Common, getNewPlatformKey(PlatformType.Common, undefined), "None-1"),

  setting: {} as typeof SypConfig,
  dynamicConfigArray: [] as DynamicConfig[],
})

const formValidateRules = reactive<FormRules>({
  platformName: [
    {
      required: true,
      message: () => t("form.validate.name.required"),
    },
  ],
  authMode: [
    {
      required: true,
      message: () => t("form.validate.name.required"),
    },
  ],
  platformIcon: [
    {
      required: true,
      message: () => t("form.validate.name.required"),
    },
  ],
})
const validateForm = (formEl) => {
  return true
}

const submitForm = async (formEl) => {
  if (!formEl) return
  if (!validateForm(formEl)) {
    return
  }

  const result = await formEl.validate((valid, fields) => {
    if (valid) {
      logger.debug("校验成功")
    } else {
      logger.error(t("main.opt.failure"), fields)
      // ElMessage.error(t('main.opt.failure'))
    }
  })
  if (!result) {
    return
  }

  const newCfg = formData.dynCfg
  replacePlatformByKey(formData.dynamicConfigArray, key, newCfg)

  // 转换格式并保存
  const dynJsonCfg = setDynamicJsonCfg(formData.dynamicConfigArray)
  formData.setting[DYNAMIC_CONFIG_KEY] = dynJsonCfg
  // 更新配置
  await updateSetting(formData.setting)

  // 重新加载列表
  ElMessage.success(t("main.opt.success"))
  // 返回
  await router.push({
    path: `/setting/publish`,
  })
}

const initForm = async (key: string) => {
  formData.setting = await getSetting()
  const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(formData.setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
  formData.dynamicConfigArray = dynJsonCfg?.totalCfg || []

  formData.dynCfg = getDynCfgByKey(formData.dynamicConfigArray, key)
}
const initPage = async () => {
  await initForm(formData.key)
}

initPage()
</script>

<template>
  <back-page :title="'修改平台定义 - ' + key">
    <el-form class="update-form" ref="formRef" label-width="100px" :model="formData.dynCfg" :rules="formValidateRules">
      <el-alert
        class="top-tip"
        :title="'当前平台类型为=>' + formData.dynCfg.platformKey"
        type="warning"
        :closable="false"
      />
      <el-alert
        class="top-tip"
        :title="'子平台类型为=>' + formData.dynCfg.subPlatformType"
        type="warning"
        :closable="false"
      />
      <!-- 平台key -->
      <el-form-item :label="t('dynamic.platform.key')" prop="platformKey">
        {{ formData.dynCfg.platformKey }}
      </el-form-item>
      <!-- 平台名称 -->
      <el-form-item label="平台名称" prop="platformName">
        <el-input v-model="formData.dynCfg.platformName" />
      </el-form-item>
      <!-- 平台图标 -->
      <el-form-item label="平台图标" prop="platformIcon" class="cfg-icon">
        <el-input
          v-model="formData.dynCfg.platformIcon"
          style="width: 75%; margin-right: 16px"
          placeholder="直接粘贴svg代码或者img标签代码"
          type="textarea"
          :rows="10"
        />
        <el-icon>
          <span v-html="formData.dynCfg.platformIcon"></span>
        </el-icon>
      </el-form-item>
      <!-- 授权方式 -->
      <el-form-item label="授权方式" prop="authMode">
        <el-select v-model="formData.dynCfg.authMode" placeholder="请选择">
          <el-option :value="AuthMode.API" label="API授权" />
          <el-option :value="AuthMode.WEBSITE" label="网页授权" />
        </el-select>
      </el-form-item>
      <!-- 登录地址 -->
      <el-form-item v-if="formData.dynCfg.authMode === AuthMode.WEBSITE" label="登录地址" prop="authUrl">
        <el-input v-model="formData.dynCfg.authUrl" placeholder="请输入该平台的网页登录地址" />
      </el-form-item>
      <!-- 主域名 -->
      <el-form-item v-if="formData.dynCfg.authMode === AuthMode.WEBSITE" label="主域名" prop="domain">
        <el-input v-model="formData.dynCfg.domain" placeholder="请输入该平台的主域名" />
      </el-form-item>
      <!-- 是否启用 -->
      <el-form-item label="是否启用">
        <el-switch v-model="formData.dynCfg.isEnabled" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">{{ t("dynamic.platform.opt.add") }}</el-button>
      </el-form-item>
    </el-form>
  </back-page>
</template>

<style scoped lang="stylus">
$icon_size = 32px

.top-tip
  margin 10px 0
  padding-left 0

.update-form
  .cfg-icon
    :deep(.el-icon)
      //color var(--el-color-primary)
      width $icon_size
      height $icon_size
      margin-right -4px
      vertical-align middle
    :deep(.el-icon svg)
      width $icon_size
      height $icon_size
</style>
