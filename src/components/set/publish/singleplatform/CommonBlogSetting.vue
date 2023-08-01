<!--
  - Copyright (c) 2022-2023, Terwer . All rights reserved.
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

<script lang="ts" setup>
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { AppInstance } from "~/src/appInstance.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useSettingStore } from "~/src/stores/useSettingStore.ts"
import { reactive, ref } from "vue"
import {
  DynamicConfig,
  DynamicJsonCfg,
  getDynCfgByKey,
  setDynamicJsonCfg,
} from "~/src/components/set/publish/platform/dynamicConfig.ts"
import { SypConfig } from "~/syp.config.ts"
import { CommonblogConfig } from "~/src/adaptors/api/base/commonblog/config/CommonblogConfig.ts"
import { onMounted } from "vue"
import { JsonUtil, ObjectUtil } from "zhi-common"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { PageTypeEnum, PasswordType } from "zhi-blog-api"
import Adaptors from "~/src/adaptors"
import { Utils } from "~/src/utils/utils.ts"
import { ElMessage } from "element-plus"

const logger = createAppLogger("commonblog-setting")
// appInstance
const appInstance = new AppInstance()

const { t } = useVueI18n()
const { getSetting, updateSetting } = useSettingStore()

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
  cfg: {
    // 必须继承BlogConfig
    type: Object,
    default: null,
  },
})

const apiTypeInfo = ref(t("setting.blog.platform.support.common") + props.apiType + " ")

const isLoading = ref(false)
const formData = reactive({
  cfg: {} as CommonblogConfig,

  dynCfg: {} as DynamicConfig,
  setting: {} as typeof SypConfig,
  dynamicConfigArray: [] as DynamicConfig[],
})

const valiConf = async () => {
  isLoading.value = true

  let errMsg: any
  try {
    const commonblogApiAdaptor = await Adaptors.getAdaptor(props.apiType, formData.cfg as any)
    logger.debug("commonblogApiAdaptor=>", commonblogApiAdaptor)
    const api = Utils.blogApi(appInstance, commonblogApiAdaptor)
    const usersBlogs = await api.getUsersBlogs()
    if (usersBlogs && usersBlogs.length > 0) {
      const userBlog = usersBlogs[0]

      formData.cfg.blogid = userBlog.blogid
      formData.cfg.blogName = userBlog.blogName
      formData.cfg.apiStatus = true
      formData.dynCfg.isAuth = true
    } else {
      formData.cfg.apiStatus = false
    }
  } catch (e) {
    formData.cfg.apiStatus = false
    errMsg = e
    console.error(e)
  }

  if (!formData.cfg.apiStatus) {
    ElMessage.error(t("setting.blog.vali.error") + "=>" + errMsg)
  } else {
    ElMessage.success(t("main.opt.success"))
  }

  // isAuth和apiStatus同步
  formData.dynCfg.isAuth = formData.cfg.apiStatus
  // 刷新状态
  await saveConf(true)

  isLoading.value = false
  logger.debug("Commonblog通用Setting验证完毕")
}

const saveConf = async (hideTip?: any) => {
  logger.debug("Commonblog通用Setting保存配置")
  // 平台使用配置
  formData.setting[props.apiType] = formData.cfg
  // 平台基本配置
  const dynJsonCfg = setDynamicJsonCfg(formData.dynamicConfigArray)
  formData.setting[DYNAMIC_CONFIG_KEY] = dynJsonCfg
  await updateSetting(formData.setting)

  if (hideTip !== true) {
    ElMessage.success(t("main.opt.success"))
  }
}

const initConf = async () => {
  formData.setting = await getSetting()
  const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(formData.setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
  formData.dynamicConfigArray = dynJsonCfg?.totalCfg || []
  formData.dynCfg = getDynCfgByKey(formData.dynamicConfigArray, props.apiType)

  logger.debug("Commonblog通用Setting配置初始化")
  let conf = props.cfg as CommonblogConfig
  // 如果没有配置。读取默认配置
  if (ObjectUtil.isEmptyObject(conf)) {
    const apiConf = formData.setting[props.apiType]
    conf = JsonUtil.safeParse<CommonblogConfig>(apiConf, {} as CommonblogConfig)
  }

  if (conf) {
    logger.debug("get setting conf=>", conf)
    formData.cfg = conf
  }
}

onMounted(async () => {
  // 初始化
  await initConf()
})
</script>

<template>
  <el-form label-width="120px">
    <el-alert :closable="false" :title="apiTypeInfo + formData.cfg.blogName" class="top-tip" type="info" />
    <!-- 首页 -->
    <el-form-item :label="t('setting.common.home')">
      <el-input v-model="formData.cfg.home" :placeholder="props.cfg?.placeholder.homePlaceholder" />
    </el-form-item>
    <!-- API 地址 -->
    <el-form-item :label="t('setting.common.apiurl')">
      <el-input v-model="formData.cfg.apiUrl" :placeholder="props.cfg?.placeholder.apiUrlPlaceholder" />
    </el-form-item>
    <!-- 登录名 -->
    <el-form-item :label="t('setting.common.username')" v-if="props.cfg.usernameEnabled">
      <el-input v-model="formData.cfg.username" :placeholder="props.cfg?.placeholder.usernamePlaceholder" />
    </el-form-item>
    <!-- 密码 -->
    <el-form-item
      :label="t('setting.common.password')"
      v-if="props.cfg.passwordType === PasswordType.PasswordType_Password"
    >
      <el-input
        type="password"
        v-model="formData.cfg.password"
        show-password
        :placeholder="props.cfg.placeholder.passwordPlaceholder"
      />
      <a :href="props.cfg.tokenSettingUrl" target="_blank"
        >{{ t("setting.common.username.gen") }}：{{ props.cfg.tokenSettingUrl }}</a
      >
    </el-form-item>
    <!-- token -->
    <el-form-item v-else :label="t('setting.common.token')">
      <el-input
        type="password"
        v-model="formData.cfg.password"
        show-password
        :placeholder="props.cfg.placeholder.passwordPlaceholder"
      />
      <a :href="props.cfg.tokenSettingUrl" target="_blank"
        >{{ t("setting.common.token.gen") }}：{{ props.cfg.tokenSettingUrl }}</a
      >
    </el-form-item>
    <!-- 预览地址 -->
    <el-form-item :label="t('setting.blog.previewUrl')">
      <el-input v-model="formData.cfg.previewUrl" :placeholder="props.cfg?.placeholder.previewUrlPlaceholder" />
    </el-form-item>
    <el-form-item :label="t('setting.blog.pageType')">
      <el-radio-group v-model="formData.cfg.pageType" class="ml-4">
        <el-radio :label="PageTypeEnum.Markdown" size="large">Markdown</el-radio>
        <el-radio :label="PageTypeEnum.Html" size="large">HTML</el-radio>
        <el-radio :label="PageTypeEnum.Kramdown" size="large">Kramdown</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 跨域代理地址 -->
    <el-form-item :label="t('setting.blog.middlewareUrl')">
      <el-input v-model="formData.cfg.middlewareUrl" :placeholder="t('setting.blog.middlewareUrl.tip')" />
      <el-alert
        :closable="false"
        :title="t('setting.blog.middlewareUrl.my.tip')"
        class="top-tip"
        type="info"
      ></el-alert>
    </el-form-item>
    <!-- 校验 -->
    <el-form-item>
      <el-button type="primary" :loading="isLoading" @click="valiConf">
        {{ isLoading ? t("setting.blog.vali.ing") : t("setting.blog.vali") }}
      </el-button>
      <el-alert
        :title="t('setting.blog.vali.tip.metaweblog')"
        type="warning"
        :closable="false"
        v-if="!formData.cfg.apiStatus"
      />
      <el-alert
        :title="t('setting.blog.vali.ok.metaweblog')"
        type="success"
        :closable="false"
        v-if="formData.cfg.apiStatus"
      />
    </el-form-item>
    <!-- 保存 -->
    <el-form-item>
      <el-button type="primary" @click="saveConf">{{ t("setting.blog.save") }}</el-button>
      <el-button>{{ t("setting.blog.cancel") }}</el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="stylus" scoped>
.top-tip
  margin 10px 0
  padding-left 0
</style>
