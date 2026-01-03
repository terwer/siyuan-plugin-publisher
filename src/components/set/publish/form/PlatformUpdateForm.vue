<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
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
} from "~/src/platforms/dynamicConfig.ts"
import { JsonUtil } from "zhi-common"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { SypConfig } from "~/syp.config.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { ElMessage, FormRules } from "element-plus"

const logger = createAppLogger("platform-update-form")

// uses
const { t } = useVueI18n()
const router = useRouter()
const route = useRoute()
const { getSetting, updateSetting } = usePublishSettingStore()

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
  <back-page :title="t('setting.platform.update.title') + key">
    <el-form class="update-form" ref="formRef" label-width="100px" :model="formData.dynCfg" :rules="formValidateRules">
      <el-alert
        class="top-tip"
        :title="t('setting.platform.update.current.type') + formData.dynCfg.platformKey"
        type="info"
        :closable="false"
      />
      <el-alert
        class="top-tip"
        :title="t('setting.platform.update.sub.type') + formData.dynCfg.subPlatformType"
        type="info"
        :closable="false"
      />
      <el-alert class="top-tip" :title="t('setting.platform.update.auth.warning')" type="warning" :closable="false" />
      <!-- 平台key -->
      <el-form-item :label="t('dynamic.platform.key')" prop="platformKey">
        {{ formData.dynCfg.platformKey }}
      </el-form-item>
      <!-- 平台名称 -->
      <el-form-item :label="t('setting.platform.update.name.label')" prop="platformName">
        <el-input v-model="formData.dynCfg.platformName" />
      </el-form-item>
      <!-- 平台图标 -->
      <el-form-item :label="t('setting.platform.update.icon.label')" prop="platformIcon" class="cfg-icon">
        <el-input
          v-model="formData.dynCfg.platformIcon"
          style="width: 75%; margin-right: 16px"
          :placeholder="t('setting.platform.update.icon.placeholder')"
          type="textarea"
          :rows="10"
        />
        <el-icon>
          <span v-html="formData.dynCfg.platformIcon"></span>
        </el-icon>
      </el-form-item>
      <!-- 授权方式 -->
      <el-form-item :label="t('setting.platform.update.auth.mode.label')" prop="authMode">
        <el-select v-model="formData.dynCfg.authMode" :placeholder="t('main.opt.select')" :disabled="true">
          <el-option :value="AuthMode.API" :label="t('setting.platform.update.auth.mode.api')" />
          <el-option :value="AuthMode.WEBSITE" :label="t('setting.platform.update.auth.mode.web')" />
        </el-select>
      </el-form-item>
      <!-- 登录地址 -->
      <el-form-item v-if="formData.dynCfg.authMode === AuthMode.WEBSITE" :label="t('setting.platform.update.auth.url.label')" prop="authUrl" required>
        <el-input v-model="formData.dynCfg.authUrl" :placeholder="t('setting.platform.update.auth.url.placeholder')" />
      </el-form-item>
      <!-- 主域名 -->
      <el-form-item v-if="formData.dynCfg.authMode === AuthMode.WEBSITE" :label="t('setting.platform.update.domain.label')" prop="domain" required>
        <el-input v-model="formData.dynCfg.domain" :placeholder="t('setting.platform.update.domain.placeholder')" />
      </el-form-item>
      <!-- 是否启用 -->
      <el-form-item :label="t('setting.platform.update.enabled.label')">
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
