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
import { onMounted, reactive, ref, toRaw } from "vue"
import { DynamicConfig, DynamicJsonCfg, getDynCfgByKey, setDynamicJsonCfg } from "~/src/platforms/dynamicConfig.ts"
import { SypConfig } from "~/syp.config.ts"
import { CommonblogConfig } from "~/src/adaptors/api/base/CommonblogConfig.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { PageTypeEnum, PasswordType } from "zhi-blog-api"
import Adaptors from "~/src/adaptors"
import { Utils } from "~/src/utils/utils.ts"
import { ElMessage } from "element-plus"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"

const logger = createAppLogger("commonblog-setting")
// appInstance
const appInstance = new AppInstance()

// uses
const { t } = useVueI18n()
const { getSetting, updateSetting } = useSettingStore()
const { isStorageViaSiyuanApi } = useSiyuanApi()

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

// emits
const emit = defineEmits(["onHomeChange"])
const handleHomeChange = (value: string | number): void => {
  if (emit) {
    emit("onHomeChange", value, formData.cfg)
  }
}

// methods
const getSettingTips = (bid?: string) => {
  const apiTypeInfo = t("setting.blog.platform.support.common") + props.apiType + " "
  let blogName = formData.cfg.blogName
  const blogid = bid ?? formData.cfg.blogid
  if (props.cfg?.enableKnowledgeSpace) {
    const kwSpace = formData.kwSpaces.find((item) => item.value === blogid)
    blogName = kwSpace ? kwSpace.label : formData.cfg.blogName
    // 更新名字
    formData.cfg.blogName = blogName
  }
  return apiTypeInfo + blogName
}

// datas
const isLoading = ref(false)
const formData = reactive({
  cfg: {} as CommonblogConfig,
  settingTips: "",
  kwSpaces: [],

  dynCfg: {} as DynamicConfig,
  setting: {} as typeof SypConfig,
  dynamicConfigArray: [] as DynamicConfig[],

  useSiyuanApi: false,
  isInit: false,
})

// methods
const valiConf = async () => {
  isLoading.value = true

  let errMsg: any
  try {
    const commonblogApiAdaptor = await Adaptors.getAdaptor(props.apiType, formData.cfg as any)
    logger.debug("commonblogApiAdaptor=>", commonblogApiAdaptor)
    const api = Utils.blogApi(appInstance, commonblogApiAdaptor)
    const usersBlogs = await api.getUsersBlogs()
    if (usersBlogs && usersBlogs.length > 0) {
      // 首次未保存验证的时候才去更新
      if (StrUtil.isEmptyString(formData.cfg?.blogid)) {
        // 首次验证需要初始化下拉选择
        if (formData.kwSpaces.length == 0) {
          usersBlogs.forEach((item) => {
            const kwItem = {
              label: item.blogName,
              value: item.blogid,
            }
            formData.kwSpaces.push(kwItem)
          })
        }

        // 初始化选中
        const userBlog = usersBlogs[0]
        formData.cfg.blogid = userBlog.blogid
        formData.cfg.blogName = userBlog.blogName

        // 初始化顶部提示
        formData.settingTips = getSettingTips()
      }

      formData.cfg.apiStatus = true
    } else {
      errMsg = "接口返回信息不完整，请检查接口适配器"
      formData.cfg.apiStatus = false
    }
  } catch (e) {
    formData.cfg.apiStatus = false
    errMsg = e
    logger.error(e)
  }

  if (!formData.cfg.apiStatus) {
    logger.error(errMsg.toString(), "")
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
  logger.debug("prepare to store cfg=>", {
    cfg: toRaw(formData.cfg),
  })

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

const handleKeSpaceChange = (val: any) => {
  formData.settingTips = getSettingTips(val)
}

// init methods
const initKwSpaces = async () => {
  try {
    const commonblogApiAdaptor = await Adaptors.getAdaptor(props.apiType, formData.cfg as any)
    logger.debug("commonblogApiAdaptor=>", commonblogApiAdaptor)
    const api = Utils.blogApi(appInstance, commonblogApiAdaptor)
    const usersBlogs = await api.getUsersBlogs()
    if (usersBlogs && usersBlogs.length > 0) {
      usersBlogs.forEach((item) => {
        const kwItem = {
          label: item.blogName,
          value: item.blogid,
        }
        formData.kwSpaces.push(kwItem)
      })
    }
  } catch (e) {
    // ElMessage.error(t("main.opt.failure") + "=>" + e)
    logger.error(t("main.opt.failure"), e)
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

    // 初始化知识空间
    if (props.cfg?.enableKnowledgeSpace) {
      await initKwSpaces()
    }
    formData.settingTips = getSettingTips()
  } else {
    ElMessage.error("Read init config error, your config may not work")
  }
}

// lifecycles
onMounted(async () => {
  // 初始化
  await initConf()
  formData.useSiyuanApi = isStorageViaSiyuanApi()
  formData.isInit = true
})
</script>

<template>
  <el-skeleton class="placeholder" v-if="!formData.isInit" :rows="5" animated />
  <el-form v-else label-width="120px">
    <el-alert :closable="false" :title="formData.settingTips" class="top-tip" type="info" />
    <el-alert
      v-if="props.cfg?.enableKnowledgeSpace"
      :closable="false"
      :title="t('enableKnowledgeSpace.Tips').replace(/\[knowledge-space-title\]/g, props.cfg?.knowledgeSpaceTitle)"
      class="top-tip"
      type="info"
    />
    <slot name="header" :cfg="formData.cfg"></slot>
    <!-- 首页 -->
    <el-form-item :label="t('setting.common.home')">
      <el-input
        v-model="formData.cfg.home"
        :placeholder="props.cfg?.placeholder.homePlaceholder"
        @input="handleHomeChange"
      />
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
      <a v-if="props.cfg.showTokenTip" :href="props.cfg.tokenSettingUrl" target="_blank"
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
      <a v-if="props.cfg.showTokenTip" :href="props.cfg.tokenSettingUrl" target="_blank"
        >{{ t("setting.common.token.gen") }}：{{ props.cfg.tokenSettingUrl }}</a
      >
    </el-form-item>
    <slot name="main" :cfg="formData.cfg" />
    <!-- 预览地址 -->
    <el-form-item :label="t('setting.blog.previewUrl')">
      <el-input
        v-model="formData.cfg.previewUrl"
        :placeholder="props.cfg?.placeholder.previewUrlPlaceholder"
        :disabled="!props.cfg.allowPreviewUrlChange"
      />
    </el-form-item>
    <el-form-item :label="t('setting.blog.pageType')">
      <el-radio-group v-model="formData.cfg.pageType" class="ml-4">
        <el-radio :label="PageTypeEnum.Markdown" size="large">Markdown</el-radio>
        <el-radio :label="PageTypeEnum.Html" size="large">HTML</el-radio>
        <el-radio :label="PageTypeEnum.Kramdown" size="large">Kramdown</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 知识空间 -->
    <el-form-item :label="props.cfg?.knowledgeSpaceTitle" v-if="props.cfg?.enableKnowledgeSpace">
      <el-select
        v-model="formData.cfg.blogid"
        class="m-2"
        :placeholder="t('main.opt.select')"
        :no-data-text="t('main.data.empty')"
        @change="handleKeSpaceChange"
      >
        <el-option v-for="item in formData.kwSpaces" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <!-- 跨域代理地址 -->
    <el-form-item v-if="!formData.useSiyuanApi" :label="t('setting.blog.middlewareUrl')">
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
    <slot name="footer" :cfg="formData.cfg" />
  </el-form>
</template>

<style lang="stylus" scoped>
.placeholder
  margin-top 10px
.top-tip
  margin 10px 0
  padding-left 0
</style>
