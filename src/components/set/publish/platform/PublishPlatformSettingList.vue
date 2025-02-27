<!--
  - Copyright (c) 2024, Terwer . All rights reserved.
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
import { markRaw, onMounted, reactive } from "vue"
import { SypConfig } from "~/syp.config.ts"
import { usePlatformDefine } from "~/src/composables/usePlatformDefine.ts"
import {
  AuthMode,
  deletePlatformByKey,
  DynamicConfig,
  DynamicJsonCfg,
  replacePlatformByKey,
  setDynamicJsonCfg,
} from "~/src/platforms/dynamicConfig.ts"
import { svgIcons } from "~/src/utils/svgIcons.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { JsonUtil, StrUtil } from "zhi-common"
import { DYNAMIC_CONFIG_KEY, isDev } from "~/src/utils/constants.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useRouter } from "vue-router"
import { ElMessage, ElMessageBox } from "element-plus"
import { Delete, Lock, Tools, Warning, WarningFilled } from "@element-plus/icons-vue"
import { openBrowserWindow } from "~/src/utils/widgetUtils.ts"
import Adaptors from "~/src/adaptors"
import { ElectronCookie, WebConfig } from "zhi-blog-api"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { CommonWebConfig } from "~/src/adaptors/web/base/commonWebConfig.ts"
import { Utils } from "~/src/utils/utils.ts"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import PageUtils from "~/common/pageUtils.ts"
import { extraPreCfg } from "~/src/platforms/pre.ts"

const logger = createAppLogger("publish-platform-setting-list")

// uses
const { t } = useVueI18n()
const router = useRouter()
const { getSetting, updateSetting, deleteKey } = usePublishSettingStore()
const { getPrePlatformKeys } = usePlatformDefine()
const { isInSiyuanOrSiyuanNewWin, isInChromeExtension } = useSiyuanDevice()

// datas
const formData = reactive({
  setting: {} as typeof SypConfig,

  dynamicConfigArray: [] as DynamicConfig[],
  newPlatformCount: 0,
  newPlatformTip: "",

  // web auth
  webAuthLoadingMap: {} as any,
  cookieSettingFormVisible: false,
  dlgCookieTitle: "",
  dlgKey: "",
  dlgDynCfg: {} as DynamicConfig,
  dlgSettingCfg: {} as WebConfig,
})

// methods
const handleChangePlatformDefine = (cfg: DynamicConfig) => {
  router.push({
    path: `/setting/platform/update/${cfg.platformKey}`,
    query: {
      showBack: "true",
    },
  })
}

const handlePlatformEnabled = async (cfg: DynamicConfig) => {
  formData.dynamicConfigArray = replacePlatformByKey(formData.dynamicConfigArray, cfg.platformKey, cfg)
  // 替换删除后的平台配置
  const dynJsonCfg = setDynamicJsonCfg(formData.dynamicConfigArray)
  formData.setting[DYNAMIC_CONFIG_KEY] = dynJsonCfg
  // 更新状态
  await updateSetting(formData.setting)
}

const handleSinglePlatformSetting = async (cfg: DynamicConfig) => {
  const key = cfg.platformKey
  await router.push({
    path: `/setting/platform/single/${key}`,
    query: {
      showBack: "true",
    },
  })
}

const handleSinglePlatformDelete = (cfg: DynamicConfig) => {
  ElMessageBox.confirm(`确认要删除【${cfg.platformName}】吗，所有与此平台相关的配置都将永久删除？`, "温馨提示", {
    type: "error",
    icon: markRaw(Delete),
    confirmButtonText: t("main.opt.ok"),
    cancelButtonText: t("main.opt.cancel"),
  })
    .then(async () => {
      formData.dynamicConfigArray = deletePlatformByKey(formData.dynamicConfigArray, cfg.platformKey)
      // 替换删除后的平台配置
      const dynJsonCfg = setDynamicJsonCfg(formData.dynamicConfigArray)
      formData.setting[DYNAMIC_CONFIG_KEY] = dynJsonCfg
      // 删除配置
      delete formData.setting[cfg.platformKey]
      deleteKey(cfg.platformKey)
      await updateSetting(formData.setting)

      // 重新加载列表
      await initPage()
      ElMessage.success(t("main.opt.success"))
    })
    .catch(() => {})
}

// auth ================================================================================================================

const handleSinglePlatformWebAuth = async (cfg: DynamicConfig) => {
  if (!cfg.cookieLimit) {
    if (isInSiyuanOrSiyuanNewWin()) {
      await _handleOpenBrowserAuth(cfg)
    } else if (isInChromeExtension()) {
      _handleChromeExtensionAuth(cfg)
    } else {
      await _handleSetCookieAuth(cfg)
    }
  } else {
    await _handleSetCookieAuth(cfg)
  }
}

const _handleOpenBrowserAuth = async (cfg: DynamicConfig) => {
  ElMessageBox.confirm(
    `将打开 [${cfg.platformName}] 登录授权页面，您需要在新页面完成登录，然后点击验证查看授权结果，是否继续？`,
    "网页授权",
    {
      type: "warning",
      icon: markRaw(WarningFilled),
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
    } as any
  )
    .then(async () => {
      if (cfg.isAuth) {
        cfg.isAuth = false
        formData.dynamicConfigArray = replacePlatformByKey(formData.dynamicConfigArray, cfg.platformKey, cfg)
        // 替换删除后的平台配置
        const dynJsonCfg = setDynamicJsonCfg(formData.dynamicConfigArray)
        formData.setting[DYNAMIC_CONFIG_KEY] = dynJsonCfg
        // 更新状态
        await updateSetting(formData.setting)
        logger.info("已授权，将清空状态，并重新进行授权，授权完成需要重新验证")
      } else {
        logger.info("未授权，准备开始授权")
      }
      openBrowserWindow(cfg.authUrl)
    })
    .catch(() => {})
}

const _handleChromeExtensionAuth = (cfg: DynamicConfig) => {
  ElMessageBox.confirm(
    `将打开 [${cfg.platformName}] 登录授权页面，您需要在新页面完成登录，然后点击验证查看授权结果，是否继续？`,
    "网页授权",
    {
      type: "warning",
      icon: markRaw(WarningFilled),
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
    } as any
  )
    .then(async () => {
      if (cfg.isAuth) {
        cfg.isAuth = false
        formData.dynamicConfigArray = replacePlatformByKey(formData.dynamicConfigArray, cfg.platformKey, cfg)
        // 替换删除后的平台配置
        const dynJsonCfg = setDynamicJsonCfg(formData.dynamicConfigArray)
        formData.setting[DYNAMIC_CONFIG_KEY] = dynJsonCfg
        // 更新状态
        await updateSetting(formData.setting)
        logger.info("已授权，将清空状态，并重新进行授权，授权完成需要重新验证")
      } else {
        logger.info("未授权，准备开始授权")
      }
      window.open(cfg.authUrl)
    })
    .catch(() => {})
}

const _handleSetCookieAuth = async (cfg: DynamicConfig) => {
  // ElMessageBox.confirm(
  //   "检测到当前环境可使用内置代理自动获取 Cookie，是否使用？点击「确定」可自动设置，点击「取消」在弹出框手动填写？",
  //   "温馨提示",
  //   {
  //     type: "error",
  //     icon: markRaw(Warning),
  //     confirmButtonText: t("main.opt.ok"),
  //     cancelButtonText: t("main.opt.cancel"),
  //   }
  // )
  //   .then(async () => {
  //     await _handleProxyAutoSetCookieAuth(cfg)
  //   })
  //   .catch(async () => {
  await _handleCustomSetCookieAuth(cfg)
  // })
}

// const _handleProxyAutoSetCookieAuth = async (dynCfg: DynamicConfig) => {
//   formData.webAuthLoadingMap[dynCfg.platformKey] = true
//
//   try {
//     if (dynCfg.isAuth) {
//       dynCfg.isAuth = false
//       formData.dynamicConfigArray = replacePlatformByKey(formData.dynamicConfigArray, dynCfg.platformKey, dynCfg)
//       // 替换删除后的平台配置
//       const dynJsonCfg = setDynamicJsonCfg(formData.dynamicConfigArray)
//       formData.setting[DYNAMIC_CONFIG_KEY] = dynJsonCfg
//       // 更新状态
//       await updateSetting(formData.setting)
//       logger.info("已授权，将清空状态，并重新进行授权，授权完成需要重新验证")
//
//       // 授权流程
//       // const appInstance = new PublisherAppInstance()
//       // const cfg = (await Adaptors.getCfg(dynCfg.platformKey)) as CommonWebConfig
//       // const apiAdaptor = await Adaptors.getAdaptor(dynCfg.platformKey, cfg)
//       // const api = Utils.webApi(appInstance, apiAdaptor)
//
//       // 更新 cookie
//       // 登录流程复杂，暂时不做
//     } else {
//       logger.info("未授权，准备开始授权")
//     }
//   } catch (e) {
//     dynCfg.isAuth = false
//     const errMsg = t("main.opt.failure") + "=>" + e
//     logger.error(t("main.opt.failure") + "=>", e)
//     ElMessage.error(errMsg)
//   } finally {
//     formData.webAuthLoadingMap[dynCfg.platformKey] = false
//   }
// }

const _handleCustomSetCookieAuth = async (cfg: DynamicConfig) => {
  if (cfg.isAuth) {
    cfg.isAuth = false
    formData.dynamicConfigArray = replacePlatformByKey(formData.dynamicConfigArray, cfg.platformKey, cfg)
    // 替换删除后的平台配置
    const dynJsonCfg = setDynamicJsonCfg(formData.dynamicConfigArray)
    formData.setting[DYNAMIC_CONFIG_KEY] = dynJsonCfg
    // 更新状态
    await updateSetting(formData.setting)
    logger.info("已授权，将清空状态，并重新进行授权，授权完成需要重新验证")
  } else {
    logger.info("未授权，准备开始授权")
  }

  // 更新cookie
  const storedCfg = JsonUtil.safeParse<any>(formData.setting[cfg.platformKey], {} as any)
  const settingCfg = (await Adaptors.getCfg(cfg.platformKey, storedCfg)) as WebConfig

  formData.dlgKey = cfg.platformKey
  formData.dlgDynCfg = cfg
  formData.dlgSettingCfg = settingCfg
  formData.dlgCookieTitle = `${cfg.platformName} Cookie 设置`
  formData.cookieSettingFormVisible = true
}

const handleValidateWebAuth = async (cfg: DynamicConfig) => {
  if (!cfg.cookieLimit) {
    if (isInSiyuanOrSiyuanNewWin()) {
      _handleValidateOpenBrowserAuth(cfg)
    } else if (isInChromeExtension()) {
      await _handleValidateChromeExtensionAuth(cfg)
    } else {
      await _handleValidateCookieAuth(cfg)
    }
  } else {
    await _handleValidateCookieAuth(cfg)
  }
}

const _handleValidateOpenBrowserAuth = (dynCfg: DynamicConfig) => {
  // 设置将要读取的域名
  const cookieCb = async (dynCfg: DynamicConfig, cookies: ElectronCookie[]) => {
    // ElMessage.info("验证中，请关注状态，没有授权表示不可用，已授权表示该平台可正常使用...")
    logger.debug("get cookie result=>", cookies)
    formData.webAuthLoadingMap[dynCfg.platformKey] = true

    const appInstance = new PublisherAppInstance()
    const cfg = (await Adaptors.getCfg(dynCfg.platformKey)) as CommonWebConfig
    const apiAdaptor = await Adaptors.getAdaptor(dynCfg.platformKey, cfg)
    const api = Utils.webApi(appInstance, apiAdaptor)

    try {
      // 构造对应平台的cookie
      const cookieStr = cookies ? await api.buildCookie(cookies) : ""
      // 更新cookie
      const newSettingCfg = cfg
      newSettingCfg.password = cookieStr
      formData.setting[dynCfg.platformKey] = newSettingCfg
      // 更新cookie
      await updateSetting(formData.setting)

      // 用新cookie发送请求
      api.updateCfg(newSettingCfg)
      const metadata = await api.getMetaData()
      logger.debug("get meta data=>", metadata)
      if (metadata.flag) {
        dynCfg.isAuth = true
        const newSettingCfg2 = JsonUtil.safeParse<WebConfig>(formData.setting[dynCfg.platformKey], {} as WebConfig)
        newSettingCfg2.metadata = metadata
        // newSettingCfg2
        formData.setting[dynCfg.platformKey] = newSettingCfg2
        // 更新metadata
        await updateSetting(formData.setting)
        logger.info("已更新最新的metadata")
        ElMessage.success("验证成功，该平台可正常使用")
      } else {
        dynCfg.isAuth = false
        ElMessage.error("验证失败，该平台将不可用")
      }
    } catch (e) {
      dynCfg.isAuth = false
      const errMsg = t("main.opt.failure") + "=>" + e
      logger.error(t("main.opt.failure") + "=>", e)
      // 过期之后，提醒用户是否需要重新认证
      const logoutUrl = dynCfg.logoutUrl ?? (cfg as any).logoutUrl
      if (!StrUtil.isEmptyString(logoutUrl)) {
        const confurmMsg =
          errMsg +
          "，是否需要退出登录？注意：！！！本窗口只负责退出，登录信息填写无效！！！，需要稍后重新点击授权操作登录？"
        _handleClearAuthConfirm(confurmMsg, logoutUrl)
      } else {
        ElMessage.error(errMsg)
      }
    }

    formData.dynamicConfigArray = replacePlatformByKey(formData.dynamicConfigArray, dynCfg.platformKey, dynCfg)
    // 替换删除后的平台配置
    const dynJsonCfg = setDynamicJsonCfg(formData.dynamicConfigArray)
    formData.setting[DYNAMIC_CONFIG_KEY] = dynJsonCfg
    // 更新状态
    await updateSetting(formData.setting)
    formData.webAuthLoadingMap[dynCfg.platformKey] = false
  }

  const extraScriptCb = () => {}

  openBrowserWindow(dynCfg.authUrl, dynCfg, cookieCb, extraScriptCb)
}

const _handleClearAuthConfirm = (msg, url: string) => {
  ElMessageBox.confirm(msg, "温馨提示", {
    type: "error",
    icon: markRaw(Warning),
    confirmButtonText: t("main.opt.ok"),
    cancelButtonText: t("main.opt.cancel"),
  } as any)
    .then(async () => {
      openBrowserWindow(url)
    })
    .catch(() => {})
}

const _handleValidateChromeExtensionAuth = async (dynCfg: DynamicConfig) => {
  formData.webAuthLoadingMap[dynCfg.platformKey] = true

  try {
    const appInstance = new PublisherAppInstance()
    // 这里会有配置初始化
    const cfg = (await Adaptors.getCfg(dynCfg.platformKey)) as CommonWebConfig
    const apiAdaptor = await Adaptors.getAdaptor(dynCfg.platformKey, cfg)
    const api = Utils.webApi(appInstance, apiAdaptor)
    const metadata = await api.getMetaData()
    // logger.debug("chrome extension get meta data=>", metadata)
    if (metadata.flag) {
      dynCfg.isAuth = true
      const newSettingCfg = cfg
      newSettingCfg.metadata = metadata
      // settingConf
      formData.setting[dynCfg.platformKey] = newSettingCfg
      // 更新metadata
      await updateSetting(formData.setting)
      logger.info("已更新最新的metadata")
      ElMessage.success("验证成功，该平台可正常使用")
    } else {
      dynCfg.isAuth = false
      ElMessage.error("验证失败，该平台将不可用")
    }
  } catch (e) {
    dynCfg.isAuth = false
    ElMessage.error(
      t("main.opt.failure") +
        "=>" +
        e +
        "，如果是登录过期，请在左侧点击「授权」修改新的 cookie 或者参考 https://siyuan.wiki/s/20230810132040-nn4q7vs FAQ4 解决"
    )
    logger.error(t("main.opt.failure") + "=>", e)
  }

  formData.dynamicConfigArray = replacePlatformByKey(formData.dynamicConfigArray, dynCfg.platformKey, dynCfg)
  // 替换删除后的平台配置
  const dynJsonCfg = setDynamicJsonCfg(formData.dynamicConfigArray)
  formData.setting[DYNAMIC_CONFIG_KEY] = dynJsonCfg
  // 更新状态
  await updateSetting(formData.setting)
  formData.webAuthLoadingMap[dynCfg.platformKey] = false
}

const _handleValidateCookieAuth = async (cfg: DynamicConfig) => {
  await _handleValidateChromeExtensionAuth(cfg)
}

const handleHideCookieDlg = () => {
  formData.cookieSettingFormVisible = false
}
// auth ================================================================================================================

// hande extra data ====================================================================================================
const handleExtraData = async (dynamicConfigArray: DynamicConfig[]) => {
  for (const cfg of dynamicConfigArray) {
    // cookie白名单
    if (extraPreCfg.cookieWhiteList.includes(cfg.subPlatformType.toString())) {
      cfg.cookieLimit = false
    }
    // cookie黑名单
    if (extraPreCfg.cookieLimit.includes(cfg.subPlatformType.toString())) {
      cfg.cookieLimit = true
    }
  }
  return dynamicConfigArray
}
// hande extra data ====================================================================================================

// init
const initPage = async () => {
  formData.setting = await getSetting()
  logger.debug("get setting from platform setting", formData.setting)

  const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(formData.setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
  // 默认展示通用平台
  formData.dynamicConfigArray = dynJsonCfg?.totalCfg || []
  // 处理额外数据
  formData.dynamicConfigArray = await handleExtraData(formData.dynamicConfigArray)
  logger.debug("dynamic init page=>", formData.dynamicConfigArray)

  // 检测是否有新平台
  const unImportedKeys = []
  const preKeys = getPrePlatformKeys()
  const dynKeys = formData.dynamicConfigArray.map((p) => p.platformKey)
  formData.newPlatformCount = 0
  for (const preKey of preKeys) {
    if (!dynKeys.includes(preKey)) {
      formData.newPlatformCount++
      unImportedKeys.push(preKey)
    }
  }

  if (formData.newPlatformCount > 0) {
    formData.newPlatformTip = t("platform.new.platform")
      .replace("[count]", formData.newPlatformCount)
      .replace("[platform]", unImportedKeys.join(", "))
    // ElMessage.warning({
    //   message: formData.newPlatformTip,
    //   duration: 10000,
    // })
  }
}

// lifecycles
onMounted(async () => {
  await initPage()
})
</script>

<template>
  <div>
    <div v-if="formData.dynamicConfigArray.length === 0">
      <el-alert class="no-tip" type="error" :title="t('platform.must.select.one')"></el-alert>
    </div>
    <div v-else>
      <div class="publish-right-setting">
        <el-row :gutter="20" class="platform-list">
          <el-col
            v-for="platform in formData.dynamicConfigArray"
            :key="platform.platformKey"
            :span="11"
            class="platform-item-box"
          >
            <div class="platform-item">
              <el-icon class="item-left-icon">
                <span class="item-icon" v-html="platform.platformIcon"></span>
              </el-icon>
              <div class="item-right">
                <div class="text">
                  <el-badge
                    :value="platform.isAuth ? '已授权' : platform.authMode === AuthMode.API ? '设置无效' : '没有授权'"
                    class="badge-item"
                    :type="platform.isAuth ? 'success' : 'danger'"
                  >
                    <span :title="platform.platformName">
                      {{ PageUtils.longPlatformName(platform.platformName, 11) }}
                    </span>
                    <span class="name-edit" @click="handleChangePlatformDefine(platform)">
                      <el-icon> <span v-html="svgIcons.iconIFEdit"></span> </el-icon>
                    </span>
                    <el-text :type="platform.authMode === AuthMode.API ? 'primary' : 'info'" class="auth-mode-text">
                      {{ platform.authMode === AuthMode.API ? "API授权" : "网页授权" }}
                    </el-text>
                  </el-badge>
                </div>
                <div class="actions">
                  <el-switch
                    v-model="platform.isEnabled"
                    inline-prompt
                    size="small"
                    class="action-btn action-switch"
                    active-text="已启用"
                    inactive-text="未启用"
                    @change="handlePlatformEnabled(platform)"
                  ></el-switch>
                  <!-- 通用平台设置 -->
                  <el-text
                    v-if="platform.isEnabled && platform.authMode === AuthMode.API"
                    class="action-btn action-setting"
                    @click="handleSinglePlatformSetting(platform)"
                  >
                    <el-icon>
                      <Tools />
                    </el-icon>
                    设置
                  </el-text>
                  <!-- 通用平台设置 -->
                  <el-text
                    v-if="platform.isEnabled && platform.authMode === AuthMode.WEBSITE && platform.isAuth"
                    class="action-btn action-setting"
                    @click="handleSinglePlatformSetting(platform)"
                  >
                    <el-icon>
                      <Tools />
                    </el-icon>
                    设置
                  </el-text>
                  <!-- 平台授权 -->
                  <el-text
                    v-if="platform.isEnabled && platform.authMode === AuthMode.WEBSITE"
                    class="action-btn action-web-setting"
                    @click="handleSinglePlatformWebAuth(platform)"
                  >
                    <el-icon>
                      <Tools />
                    </el-icon>
                    {{ platform.isAuth ? "再次授权" : "授权" }}
                  </el-text>
                  <!-- 平台验证 -->
                  <el-button
                    v-if="platform.isEnabled && platform.authMode === AuthMode.WEBSITE && !platform.isAuth"
                    class="action-btn action-web-auth"
                    @click="handleValidateWebAuth(platform)"
                    :size="'small'"
                    :loading="formData.webAuthLoadingMap[platform.platformKey] === true"
                  >
                    <el-icon>
                      <Lock />
                    </el-icon>
                    验证
                  </el-button>
                  <el-text
                    v-if="!platform.isEnabled"
                    class="action-btn action-del"
                    @click="handleSinglePlatformDelete(platform)"
                  >
                    <el-icon>
                      <Delete />
                    </el-icon>
                    删除
                  </el-text>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="formData.newPlatformCount > 0">
          <el-alert type="error" :title="formData.newPlatformTip"></el-alert>
        </el-row>
      </div>

      <!--
       -----------------------------------------------------------------------------
       -->
      <!-- cookie设置弹窗 -->

      <!-- 通用设置弹窗 -->
      <el-dialog v-model="formData.cookieSettingFormVisible" :title="formData.dlgCookieTitle">
        <cookie-setting
          v-model:api-type="formData.dlgKey"
          v-model:setting="formData.setting"
          v-model:setting-cfg="formData.dlgSettingCfg"
          v-model:dyn-cfg="formData.dlgDynCfg"
          @emitHideDlg="handleHideCookieDlg"
        />
      </el-dialog>
    </div>
  </div>
</template>

<style scoped lang="stylus">
.publish-right-setting
  margin-top 8px

  .platform-list
    margin-bottom 10px
    margin-left 6px !important
    margin-right 6px !important

    .platform-item-box
      margin-bottom 28px
      text-align left

      .platform-item
        .item-left-icon
          //color var(--el-color-primary)
          width $icon_size
          height $icon_size
          margin-top -14px
          vertical-align middle

          :deep(.item-icon svg)
            width $icon_size
            height $icon_size

        .item-right
          display inline-block
          margin-left 10px
          text-align left

          .text
            color var(--el-button-text-color)
            font-size 12px
            margin-bottom 2px

            .auth-mode-text
              font-size 12px
              margin-left 16px

          .name-edit
            color var(--el-color-primary)
            margin-left 4px
            cursor pointer

          .actions
            .action-btn
              margin-right 10px

            .action-switch
              font-size 12px

            .action-setting
              font-size 12px
              cursor pointer

              &:hover
                color var(--el-color-primary)

            .action-web-setting
              font-size 12px
              cursor pointer
              color var(--el-color-warning)

              &:hover
                color var(--el-color-primary)

            .action-web-auth
              font-size 12px
              cursor pointer
              color var(--el-color-error)

              &:hover
                color var(--el-color-primary)

            .action-del
              color var(--el-color-error)
              font-size 12px
              cursor pointer

              &:hover
                color var(--el-color-primary)
</style>
