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
import { reactive, ref } from "vue"
import {
  AuthMode,
  DynamicConfig,
  DynamicJsonCfg,
  getNewPlatformKey,
  getSubtypeList,
  isDynamicKeyExists,
  PlatformType,
  setDynamicJsonCfg,
  SubPlatformType,
} from "~/src/platforms/dynamicConfig.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useRoute, useRouter } from "vue-router"
import BackPage from "~/src/components/common/BackPage.vue"
import { svgIcons } from "~/src/utils/svgIcons.ts"
import { usePlatformDefine } from "~/src/composables/usePlatformDefine.ts"
import { JsonUtil, StrUtil } from "zhi-common"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { useSettingStore } from "~/src/stores/useSettingStore.ts"
import { ElMessage, FormRules } from "element-plus"
import { SypConfig } from "~/syp.config.ts"

const logger = createAppLogger("platform-add-form")

// uses
const { t } = useVueI18n()
const router = useRouter()
const route = useRoute()
const { query } = useRoute()
const { getPlatformType, getPrePlatform } = usePlatformDefine()
const { getSetting, updateSetting, checkKeyExists } = useSettingStore()

// datas
const params = reactive(route.params)
const ptype = params.type as PlatformType

const formRef = ref()
const formData = reactive({
  setting: {} as typeof SypConfig,

  ptype: ptype,
  subtype: undefined,
  subtypeOptions: [],
  isPre: false,
  dynCfg: new DynamicConfig(ptype, getNewPlatformKey(ptype, undefined), "None-1"),

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
  if (!formData.subtype) {
    ElMessage.error("请选择子平台类型")
    return false
  }

  // 平台key必须唯一
  const pkey = formData.dynCfg.platformKey
  if (checkKeyExists(pkey)) {
    ElMessage.error(t("dynamic.platform.opt.key.exist"))
    return false
  }
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
  formData.dynamicConfigArray.push(newCfg)

  // 转换格式并保存
  const dynJsonCfg = setDynamicJsonCfg(formData.dynamicConfigArray)
  formData.setting[DYNAMIC_CONFIG_KEY] = dynJsonCfg
  // 初始化一个空配置
  formData.setting[newCfg.platformKey] = {}
  await updateSetting(formData.setting)

  // 重新加载列表
  ElMessage.success(t("main.opt.success"))
  // 返回
  await router.push({
    path: `/setting/publish`,
  })
}

const handleSubPlatformTypeChange = async () => {
  await initForm(formData.ptype, formData.subtype)
}

const initForm = async (ptype: PlatformType, subtype: SubPlatformType) => {
  const pkey = query.key as string

  formData.setting = await getSetting()
  const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(formData.setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
  formData.dynamicConfigArray = dynJsonCfg?.totalCfg || []

  if (!formData.ptype) {
    ElMessage.error("平台类型不能为空")
    return
  }
  const platform = getPlatformType(formData.ptype)
  let svgIcon = StrUtil.isEmptyString(platform.img)
    ? svgIcons.iconEPPlus
    : `<img src="${platform.img}" alt="platform-icon" class="img-platform-icon" style="width: 32px;height: 32px;"/>`

  if (pkey && subtype) {
    formData.subtype = subtype

    // 如果pkey对应的配置存在，初始化新的
    const pkeyExist = isDynamicKeyExists(formData.dynamicConfigArray, pkey)
    if (pkeyExist) {
      const preTmpl = getPrePlatform(pkey)
      svgIcon = preTmpl.platformIcon
      const newKey = getNewPlatformKey(ptype, subtype)
      const newCfg = new DynamicConfig(ptype, newKey, newKey, subtype, svgIcon)
      newCfg.authMode = preTmpl.authMode
      newCfg.authUrl = preTmpl.authUrl ?? ""
      newCfg.domain = preTmpl.domain ?? ""
      formData.dynCfg = newCfg
      logger.debug("pkey already exists, initialize the new one")
    } else {
      // 否则查询
      const preTmpl = getPrePlatform(pkey)
      formData.dynCfg = preTmpl
      formData.isPre = true
      logger.debug("Initialized via pkey")
    }
  } else if (subtype) {
    // 子类型初始化
    formData.subtype = subtype
    const newKey = getNewPlatformKey(ptype, subtype)
    formData.dynCfg = new DynamicConfig(ptype, newKey, newKey, subtype, svgIcon)
    logger.debug("Initialized by subtype")
  } else {
    // 需要选择子类型
    formData.subtypeOptions = getSubtypeList(ptype)
    const newKey = getNewPlatformKey(ptype, subtype)
    formData.dynCfg = new DynamicConfig(ptype, newKey, newKey, subtype, svgIcon)
    logger.debug("Initialize by selecting a subtype")
  }
}

const initPage = async () => {
  const ptype = params.type as PlatformType
  const subtype = query.sub as SubPlatformType

  await initForm(ptype, subtype)
}

initPage()
</script>

<template>
  <back-page :title="'新增自定义平台 - ' + ptype">
    <el-form class="add-form" ref="formRef" label-width="100px" :model="formData.dynCfg" :rules="formValidateRules">
      <el-alert
        v-if="formData.isPre"
        class="top-tip"
        title="当前为初次添加，将导入该平台的预定义模板；如果再次添加，将生成可修改的新实例"
        type="error"
        :closable="false"
      />
      <el-alert class="top-tip" :title="'当前平台类型为=>' + ptype" type="info" :closable="false" />
      <!-- 子平台名称 -->
      <el-form-item v-if="formData.subtypeOptions.length > 0" label="子平台类型">
        <el-select v-model="formData.subtype" class="m-2" placeholder="请选择" @change="handleSubPlatformTypeChange">
          <el-option v-for="item in formData.subtypeOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-alert v-else class="top-tip" :title="'子平台类型为=>' + formData.subtype" type="info" :closable="false" />
      <!-- 平台key -->
      <el-form-item :label="t('dynamic.platform.key')" prop="platformKey">
        {{ formData.dynCfg.platformKey }}
      </el-form-item>
      <!-- 平台名称 -->
      <el-form-item label="平台名称" prop="platformName">
        <span v-if="formData.isPre">{{ formData.dynCfg.platformName }}</span>
        <el-input v-else v-model="formData.dynCfg.platformName" />
      </el-form-item>
      <!-- 平台图标 -->
      <el-form-item label="平台图标" prop="platformIcon" class="cfg-icon">
        <el-input
          v-if="!formData.isPre"
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
        <span v-if="formData.isPre">{{ formData.dynCfg.authMode === AuthMode.API ? "API授权" : "网页授权" }}</span>
        <el-select v-else v-model="formData.dynCfg.authMode" placeholder="请选择">
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
        <el-button type="primary" @click="submitForm(formRef)">{{ t("dynamic.platform.opt.add") }} </el-button>
      </el-form-item>
    </el-form>
  </back-page>
</template>

<style scoped lang="stylus">
$icon_size = 32px

.top-tip
  margin 10px 0
  padding-left 0

.add-form
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
