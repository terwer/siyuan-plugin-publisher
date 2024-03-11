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
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { onMounted, reactive, ref, toRaw, watch } from "vue"
import { DynamicConfig, DynamicJsonCfg, getDynCfgByKey, setDynamicJsonCfg } from "~/src/platforms/dynamicConfig.ts"
import { SypConfig } from "~/syp.config.ts"
import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"
import { JsonUtil, ObjectUtil } from "zhi-common"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { BlogAdaptor, PageTypeEnum, PasswordType, UserBlog } from "zhi-blog-api"
import Adaptors from "~/src/adaptors"
import { Utils } from "~/src/utils/utils.ts"
import { ElMessage } from "element-plus"

const logger = createAppLogger("commonblog-setting")
// appInstance
const appInstance = new PublisherAppInstance()

// uses
const { t } = useVueI18n()
const { getSetting, updateSetting } = usePublishSettingStore()

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
const emit = defineEmits(["onHomeChange", "onApiUrlChange", "onUsernameChange"])
const handleHomeChange = (value: string | number): void => {
  if (emit) {
    emit("onHomeChange", value, formData.cfg)
  }
}
const handleUsernameChange = (value: string | number): void => {
  if (emit) {
    emit("onUsernameChange", value, formData.cfg)
  }
}

// datas
const isLoading = ref(false)
const singleCateSelect = ref(null)
const formData = reactive({
  cfg: {} as CommonBlogConfig,
  ksKeyword: "",
  isCateLoading: false,
  kwSpaces: [],
  settingTips: "",

  dynCfg: {} as DynamicConfig,
  setting: {} as typeof SypConfig,
  dynamicConfigArray: [] as DynamicConfig[],

  isInit: false,
})

// watch
watch(
  () => formData.cfg.blogid,
  (newBlogId, oldBlogId) => {
    if (newBlogId !== oldBlogId) {
      // 只在实际数据变化时执行逻辑
      forceWatchBlogId(newBlogId)
      logger.debug("Watch logic triggered:", newBlogId)
    }
  },
  { immediate: true }
)

const forceWatchBlogId = (newBlogId: string) => {
  const apiTypeInfo = t("setting.blog.platform.support.common") + props.apiType + " "
  let blogName = formData.cfg.blogName

  if (props.cfg?.knowledgeSpaceEnabled) {
    const kwSpace = formData.kwSpaces.find((item) => item.value === newBlogId)
    console.log(kwSpace)
    blogName = kwSpace ? kwSpace.label : formData.cfg.blogid ?? formData.cfg.blogName
    formData.cfg.blogName = blogName
  }

  formData.settingTips = apiTypeInfo + blogName
}

// methods
const valiConf = async () => {
  isLoading.value = true

  let errMsg: any
  const commonblogApiAdaptor = await Adaptors.getAdaptor(props.apiType, formData.cfg as any)
  const api = Utils.blogApi(appInstance, commonblogApiAdaptor) as BlogAdaptor
  try {
    await api.checkAuth()
    try {
      await afterValid(api)
      formData.cfg.apiStatus = true
    } catch (e2) {
      formData.cfg.apiStatus = false
      errMsg = e2.toString()
    }
    logger.info("======校验正常结束======")
  } catch (e) {
    if (typeof e === "boolean") {
      if (e === true) {
        try {
          await afterValid(api)
          formData.cfg.apiStatus = true
        } catch (e2) {
          formData.cfg.apiStatus = false
          errMsg = e2.toString()
        }
      } else {
        formData.cfg.apiStatus = false
        errMsg = "校验失败，请检查平台配置"
      }

      logger.info("======校验修正结束======")
    } else {
      formData.cfg.apiStatus = false
      errMsg = e.toString()
      logger.error(t("main.opt.failure") + "=>", e)
    }
  }

  if (!formData.cfg.apiStatus) {
    const errMsg2 = t("setting.blog.vali.error") + `=>${errMsg.toString()}`
    logger.error(errMsg2)
    ElMessage.error(errMsg2)
  } else {
    ElMessage.success(t("main.opt.success"))
  }

  // isAuth和apiStatus同步
  if (formData.dynCfg) {
    formData.dynCfg.isAuth = formData.cfg.apiStatus
  }
  // 刷新状态
  await saveConf(true)

  isLoading.value = false
  logger.debug("Commonblog通用Setting验证完毕")
}

const afterValid = async (api: any) => {
  // 验证成功就去初始化知识空间
  const usersBlogs = await api.getUsersBlogs(formData.ksKeyword)
  if (usersBlogs && usersBlogs.length > 0) {
    // 更新知识空间
    if (formData.kwSpaces.length == 0) {
      usersBlogs.forEach((item: any) => {
        const kwItem = {
          label: item.blogName,
          value: item.blogid,
        }
        formData.kwSpaces.push(kwItem)
      })
    }

    // 更新博客信息
    const userBlog = usersBlogs[0] as UserBlog
    formData.cfg.blogid = userBlog.blogid
    formData.cfg.blogName = userBlog.blogName

    // 元数据映射，字词验证需更新
    // @since 1.20.0
    for (const key in userBlog.metadataMap) {
      // 这里不用校验，因为可能是继承的属性
      // if (ObjectUtil.hasKey(formData.cfg, key)) {
      formData.cfg[key] = userBlog.metadataMap[key]
      // }
    }
  }
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

// init methods
const initKwSpaces = async (keyword?: string) => {
  try {
    const commonblogApiAdaptor = await Adaptors.getAdaptor(props.apiType, formData.cfg as any)
    logger.debug("commonblogApiAdaptor=>", commonblogApiAdaptor)
    const api = Utils.blogApi(appInstance, commonblogApiAdaptor)
    const usersBlogs = await api.getUsersBlogs(keyword)
    if (usersBlogs && usersBlogs.length > 0) {
      usersBlogs.forEach((item) => {
        const kwItem = {
          label: item.blogName,
          value: item.blogid,
        }
        formData.kwSpaces.push(kwItem)
      })

      forceWatchBlogId(formData.cfg.blogid)
      logger.debug("已强制刷新")
    }
  } catch (e) {
    // ElMessage.error(t("main.opt.failure") + "=>" + e)
    logger.error(t("main.opt.failure"), e)
  }
}

const handleCateSearch = async () => {
  try {
    formData.isCateLoading = true

    logger.debug("reload categories for single category woth search")
    formData.kwSpaces = []
    formData.cfg.blogid = undefined
    // 初始化知识空间
    if (props.cfg?.knowledgeSpaceEnabled) {
      await initKwSpaces(formData.ksKeyword)
    }
    // 展开下拉框
    singleCateSelect.value.visible = true
  } catch (e) {
    logger.error("知识空间加载失败", e)
  } finally {
    formData.isCateLoading = false
    formData.isInit = true
  }
}

const initConf = async () => {
  formData.setting = await getSetting()
  const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(formData.setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
  formData.dynamicConfigArray = dynJsonCfg?.totalCfg || []
  formData.dynCfg = getDynCfgByKey(formData.dynamicConfigArray, props.apiType)

  logger.debug("Commonblog通用Setting配置初始化")
  let conf = props.cfg as CommonBlogConfig
  // 如果没有配置。读取默认配置
  if (ObjectUtil.isEmptyObject(conf)) {
    const apiConf = formData.setting[props.apiType]
    conf = JsonUtil.safeParse<CommonBlogConfig>(apiConf, {} as CommonBlogConfig)
  }

  if (conf) {
    logger.debug("get setting conf=>", conf)
    formData.cfg = conf

    // 初始化知识空间
    if (props.cfg?.knowledgeSpaceEnabled) {
      await initKwSpaces(formData.ksKeyword)
    }
  } else {
    ElMessage.error("Read init config error, your config may not work")
  }
}

// lifecycles
onMounted(async () => {
  // 初始化
  await initConf()
  formData.isInit = true
})
</script>

<template>
  <el-skeleton class="placeholder" v-if="!formData.isInit" :rows="5" animated />
  <el-form v-else label-width="120px">
    <el-alert :closable="false" :title="formData.settingTips" class="top-tip" type="info" />
    <el-alert
      v-if="props.cfg?.knowledgeSpaceEnabled"
      :closable="false"
      :title="t('knowledgeSpaceEnabled.Tips').replace(/\[knowledge-space-title\]/g, props.cfg?.knowledgeSpaceTitle)"
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
      <el-input
        v-model="formData.cfg.username"
        :placeholder="props.cfg?.placeholder.usernamePlaceholder"
        @input="handleUsernameChange"
      />
    </el-form-item>
    <!-- 密码 -->
    <el-form-item
      :label="t('setting.common.password')"
      v-if="formData.cfg.passwordType === PasswordType.PasswordType_Password"
    >
      <el-input
        type="password"
        v-model="formData.cfg.password"
        show-password
        :placeholder="props.cfg.placeholder.passwordPlaceholder"
      />
      <a v-if="formData.cfg.showTokenTip" :href="formData.cfg.tokenSettingUrl" target="_blank"
        >{{ t("setting.common.username.gen") }}：{{ formData.cfg.tokenSettingUrl }}</a
      >
    </el-form-item>
    <!-- token -->
    <el-form-item
      v-else-if="formData.cfg.passwordType === PasswordType.PasswordType_Token"
      :label="t('setting.common.token')"
    >
      <el-input
        type="password"
        v-model="formData.cfg.password"
        show-password
        :placeholder="props.cfg.placeholder.passwordPlaceholder"
      />
      <a v-if="formData.cfg.showTokenTip" :href="formData.cfg.tokenSettingUrl" target="_blank"
        >{{ t("setting.common.token.gen") }}：{{ formData.cfg.tokenSettingUrl }}</a
      >
    </el-form-item>
    <!-- 平台cookie -->
    <el-form-item v-else label="平台Cookie">
      <el-input
        v-model="formData.cfg.password"
        style="width: 75%; margin-right: 16px"
        placeholder="请直接粘贴平台cookie，为了您的隐私安全，请勿泄露cookie给任何人"
        type="textarea"
        :rows="10"
        :disabled="true"
      />
      <el-alert
        :closable="false"
        title="此处数据为网页授权自动生成，仅在您本地浏览器存储，不支持修改。为了您的安全，请勿泄露此处信息给任何人。"
        class="inline-tip"
        type="error"
      />
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
        <el-radio :value="PageTypeEnum.Markdown" size="large">Markdown</el-radio>
        <el-radio :value="PageTypeEnum.Html" size="large">HTML</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 知识空间 -->
    <el-form-item class="cate-input" label="搜索关键词" v-if="props.cfg?.cateSearchEnabled">
      <el-input
        v-model="formData.ksKeyword"
        :placeholder="'请输入[' + props.cfg?.knowledgeSpaceTitle + ']搜索关键词，输入完成后请按Enter键或者移走光标'"
        @change="handleCateSearch"
      />
    </el-form-item>
    <el-form-item :label="props.cfg?.knowledgeSpaceTitle" v-if="props.cfg?.knowledgeSpaceEnabled">
      <el-select
        v-model="formData.cfg.blogid"
        class="m-2"
        :placeholder="t('main.opt.select')"
        :no-data-text="t('main.data.empty')"
        :loading="formData.isCateLoading"
        loading-text="加载中..."
        ref="singleCateSelect"
      >
        <el-option v-for="item in formData.kwSpaces" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
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
    <!-- 新 CORS 代理 -->
    <el-form-item :label="t('setting.blog.middlewareUrl.new')">
      <el-input v-model="formData.cfg.corsAnywhereUrl" :placeholder="t('setting.blog.corsAnywhereUrl.tip')" />
      <el-alert
        :closable="false"
        :title="t('setting.blog.middlewareUrl.my.new.tip')"
        class="top-tip"
        type="warning"
      ></el-alert>
    </el-form-item>
    <el-form-item>
      <el-alert
        :closable="false"
        :title="t('setting.blog.middlewareUrl.my.warn.tip')"
        class="top-tip"
        type="error"
      ></el-alert>
      <el-alert
        :closable="false"
        :title="t('setting.blog.middlewareUrl.my.fee.tip')"
        class="top-tip"
        type="error"
      ></el-alert>
      <a target="_blank" href="https://gitee.com/terwer/siyuan-plugin-publisher#%E6%8D%90%E8%B5%A0">
        {{ t("setting.blog.middlewareUrl.my.coffee") }}
      </a>
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

.inline-tip
  margin 0
  padding-left 0
</style>
