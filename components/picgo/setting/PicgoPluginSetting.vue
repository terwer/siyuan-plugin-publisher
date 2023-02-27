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

<template>
  <div id="plugin-view">
    <div class="view-title">
      {{ $t("setting.picgo.plugin") }} -
      <el-tooltip :content="$t('setting.picgo.plugin.list')" placement="right">
        <el-button class="el-icon-goods" @click="goAwesomeList">
          <font-awesome-icon icon="fa-solid fa-cart-shopping" />
        </el-button>
      </el-tooltip>
      <el-tooltip
        :content="$t('setting.picgo.plugin.import.local')"
        placement="left"
      >
        <el-button class="el-icon-download" @click="handleImportLocalPlugin">
          <font-awesome-icon icon="fa-solid fa-download" />
        </el-button>
      </el-tooltip>
    </div>

    <div class="plugin-list-box" v-if="!showPluginConfigForm">
      <div class="plugin-search-box">
        <el-row
          class="handle-bar"
          :class="{ 'cut-width': pluginData.pluginList.length > 6 }"
        >
          <el-input
            v-model="searchText"
            :placeholder="$t('setting.picgo.plugin.search.placeholder')"
          >
            <template #suffix>
              <el-icon
                class="el-input__icon"
                style="cursor: pointer"
                @click="cleanSearch"
              >
                <font-awesome-icon icon="fa-solid fa-xmark" />
              </el-icon>
            </template>
          </el-input>
        </el-row>
      </div>
      <div class="plugin-list-tip">
        {{ "当前共有" + pluginData.pluginList.length + "个插件。" }}
      </div>
      <div>
        <el-row v-loading="loading" :gutter="10" class="plugin-list">
          <el-col
            v-for="item in pluginData.pluginList"
            :key="item.fullName"
            class="plugin-item__container"
            :span="12"
          >
            <div class="plugin-item" :class="{ darwin: os === 'darwin' }">
              <div v-if="!item.gui" class="cli-only-badge" title="CLI only">
                CLI
              </div>
              <img
                class="plugin-item__logo"
                :src="item.logo"
                :onerror="defaultLogo"
                alt="img"
              />
              <div
                class="plugin-item__content"
                :class="{ disabled: !item.enabled }"
              >
                <div
                  class="plugin-item__name"
                  @click="openHomepage(item.homepage)"
                >
                  {{ item.name }} <small>{{ " " + item.version }}</small>
                </div>
                <div class="plugin-item__desc" :title="item.description">
                  {{ item.description }}
                </div>
                <div class="plugin-item__info-bar">
                  <span class="plugin-item__author">
                    {{ item.author }}
                  </span>
                  <span class="plugin-item__config">
                    <template v-if="searchText">
                      <span class="config-button work" v-if="checkWork(item)">
                        {{ $t("setting.picgo.plugin.work") }}
                      </span>
                      <span class="config-button nowork" v-else>
                        {{ $t("setting.picgo.plugin.nowork") }}
                      </span>
                      <template v-if="!item.hasInstall">
                        <span
                          v-if="!item.ing && checkWork(item)"
                          class="config-button install"
                          @click="installPlugin(item)"
                        >
                          {{ $t("setting.picgo.plugin.install") }}
                        </span>
                        <span
                          v-else-if="!item.ing && !checkWork(item)"
                          class="config-button ing"
                        >
                          {{ $t("setting.picgo.plugin.nouse") }}
                        </span>
                        <span v-else-if="item.ing" class="config-button ing">
                          {{ $t("setting.picgo.plugin.installing") }}
                        </span>
                      </template>
                      <span v-else class="config-button ing">
                        {{ $t("setting.picgo.plugin.installed") }}
                      </span>
                    </template>
                    <template v-else>
                      <span v-if="item.ing" class="config-button ing">
                        {{ $t("setting.picgo.plugin.doing.something") }}
                      </span>
                      <template v-else>
                        <el-icon
                          v-if="item.enabled"
                          class="el-icon-setting"
                          @click="buildContextMenu(item)"
                        >
                          <font-awesome-icon icon="fa-solid fa-gear" />
                        </el-icon>
                        <el-icon
                          v-else
                          class="el-icon-remove-outline"
                          @click="buildContextMenu(item)"
                        >
                          <font-awesome-icon icon="fa-solid fa-bell-slash" />
                        </el-icon>
                      </template>
                    </template>
                  </span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 插件自定义配置表单 -->
    <div class="plugin-config-form" v-else>
      <config-form
        :config-type="pluginConfigData.currentType"
        :id="pluginConfigData.currentType"
        :config-id="pluginConfigData.configName"
        :config="pluginConfigData.config"
        :is-new-form="false"
        @on-change="emitBackFn"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import picgoUtil from "~/utils/otherlib/picgoUtil"
import { LogFactory } from "~/utils/logUtil"
import { ElMessage, ElMessageBox } from "element-plus"
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  reactive,
  ref,
  watch,
} from "vue"
import { goToPage } from "~/utils/otherlib/ChromeUtil"
import sysUtil from "~/utils/otherlib/sysUtil"
import { debounce, DebouncedFunc } from "lodash"
import { useI18n } from "vue-i18n"
import { PicgoPageMenuType } from "~/utils/platform/picgo/picgoPlugin"
import ConfigForm from "~/components/picgo/common/ConfigForm.vue"
import { reloadPage } from "~/utils/browserUtil"

const logger = LogFactory.getLogger(
  "components/picgo/setting/PicgoPluginSetting.vue"
)

const { t } = useI18n()

// vars
const loading = ref(false)
const searchText = ref("")
const pluginData = reactive({
  pluginList: <IPicGoPlugin[]>[],
  pluginNameList: <string[]>[],
})
const os = ref("")
const defaultLogo = ref(
  `this.src="/widgets/sy-post-publisher/lib/picgo/picgo-logo.png"`
)
const npmSearchText = computed(() => {
  return searchText.value.match("picgo-plugin-")
    ? searchText.value
    : searchText.value !== ""
    ? `picgo-plugin-${searchText.value}`
    : searchText.value
})
let getSearchResult: DebouncedFunc<(val: string) => void>
const showPluginConfigForm = ref(false)
const pluginConfigData = reactive({
  currentType: "plugin",
  configName: "",
  config: {},
})

watch(npmSearchText, (val: string) => {
  if (val) {
    loading.value = true
    pluginData.pluginList = []
    getSearchResult(val)
  } else {
    getPluginList()
  }
})

function emitBackFn() {
  showPluginConfigForm.value = false
}

// handles
function getPluginList() {
  picgoUtil.ipcHandleEvent("getPluginList")
}

const checkWork = (item) => {
  console.log("checkWork item=>", item)
  const WORKED_PLUGINS = ["watermark-elec", "s3", "minio"]
  return WORKED_PLUGINS.includes(item.name)
}

function openHomepage(url: string) {
  if (url) {
    goToPage(url)
  }
}

function goAwesomeList() {
  goToPage("https://github.com/PicGo/Awesome-PicGo")
}

function handleImportLocalPlugin() {
  picgoUtil.ipcHandleEvent("importLocalPlugin")
}

function installPlugin(item: IPicGoPlugin) {
  if (!item.gui) {
    ElMessageBox.confirm(
      t("setting.picgo.plugin.gui.not.implemented"),
      t("main.opt.tip"),
      {
        confirmButtonText: t("main.opt.ok"),
        cancelButtonText: t("main.opt.cancel"),
        type: "warning",
      }
    )
      .then(() => {
        item.ing = true
        picgoUtil.ipcHandleEvent("installPlugin", item.fullName)
      })
      .catch(() => {
        logger.warn("Install canceled")
      })
  } else {
    item.ing = true
    picgoUtil.ipcHandleEvent("installPlugin", item.fullName)
  }
}

async function buildContextMenu(plugin: IPicGoPlugin) {
  picgoUtil.buildPluginMenu(plugin, _getI18nMessage)
}

function _getI18nMessage(key: PicgoPageMenuType) {
  const retArr = []
  switch (key) {
    case PicgoPageMenuType.PicgoPageMenuType_Uninstall:
      retArr["setting.picgo.plugin.uninstall"] = t(
        "setting.picgo.plugin.uninstall"
      )
      break
    case PicgoPageMenuType.PicgoPageMenuType_Enable:
      retArr["setting.picgo.plugin.enable"] = t("setting.picgo.plugin.enable")
      break
    case PicgoPageMenuType.PicgoPageMenuType_Disable:
      retArr["setting.picgo.plugin.disable"] = t("setting.picgo.plugin.disable")
      break
    case PicgoPageMenuType.PicgoPageMenuType_Update:
      retArr["setting.picgo.plugin.update"] = t("setting.picgo.plugin.update")
      break
    case PicgoPageMenuType.PicgoPageMenuType_ConfigThing:
      break
    case PicgoPageMenuType.PicgoPageMenuType_Transfer:
      retArr["setting.picgo.plugin.enable"] = t("setting.picgo.plugin.enable")
      retArr["setting.picgo.plugin.disable"] = t("setting.picgo.plugin.disable")
      break
    case PicgoPageMenuType.PicgoPageMenuType_Plugin:
      retArr["setting.picgo.plugin.config.setting"] = t(
        "setting.picgo.plugin.config.setting"
      )
      break
    default:
      break
  }

  return retArr
}

function _getSearchResult(val: string) {
  const fetchUrl = `https://registry.npmjs.com/-/v1/search?text=${val}`
  logger.info("npmjs请求fetchUrl=>", fetchUrl)
  fetch(fetchUrl)
    .then(async (response) => {
      const json = await response.json() // 返回的json
      const list: INPMSearchResultObject[] = json?.objects ?? []
      logger.info("npmjs返回的package列表list=>", list)

      pluginData.pluginList = list
        .filter((item: INPMSearchResultObject) => {
          return item.package.name.includes("picgo-plugin-")
        })
        .map((item: INPMSearchResultObject) => {
          return handleSearchResult(item)
        })
      loading.value = false
    })
    .catch((err) => {
      console.log(err)
      loading.value = false
    })
}

/**
 * streamline the full plugin name to a simple one
 * for example:
 * 1. picgo-plugin-xxx -> xxx
 * 2. @xxx/picgo-plugin-yyy -> yyy
 * @param name pluginFullName
 */
const handleStreamlinePluginName = (name: string) => {
  if (/^@[^/]+\/picgo-plugin-/.test(name)) {
    return name.replace(/^@[^/]+\/picgo-plugin-/, "")
  } else {
    return name.replace(/picgo-plugin-/, "")
  }
}

function handleSearchResult(item: INPMSearchResultObject) {
  const name = handleStreamlinePluginName(item.package.name)
  let gui = false
  if (item.package.keywords && item.package.keywords.length > 0) {
    if (item.package.keywords.includes("picgo-gui-plugin")) {
      gui = true
    }
  }

  return {
    name,
    fullName: item.package.name,
    author: item.package.author.name,
    description: item.package.description,
    logo: `https://cdn.jsdelivr.net/npm/${item.package.name}/logo.png`,
    config: {},
    homepage: item.package.links ? item.package.links.homepage : "",
    hasInstall: pluginData.pluginNameList.some(
      (plugin) => plugin === item.package.name
    ),
    version: item.package.version,
    gui,
    ing: false, // installing or uninstalling
  }
}

function cleanSearch() {
  searchText.value = ""
}

// register events
onBeforeMount(() => {
  os.value = sysUtil.getOS()

  picgoUtil.ipcRegisterEvent("pluginList", (evt, data) => {
    logger.info("PicgoPluginSetting接收到pluginList事件,data=>", data)

    const rawArgs = data.rawArgs
    if (rawArgs.success) {
      const list = rawArgs.data
      pluginData.pluginList = list
      pluginData.pluginNameList = list.map((item) => item.fullName)

      logger.info("插件列表已经成功加载.", list)
    } else {
      ElMessage.error(rawArgs.error)
    }
  })

  picgoUtil.ipcRegisterEvent("installPluginFinished", (evt, data) => {
    loading.value = false
    logger.info(
      "PicgoPluginSetting接收到installPluginFinished事件,data=>",
      data
    )

    const body = data.rawArgs.body
    const success = data.rawArgs.success
    const errMsg = data.rawArgs.errMsg

    pluginData.pluginList.forEach((item) => {
      if (item.fullName === body) {
        item.ing = false
        item.hasInstall = success
      }
    })

    if (success) {
      picgoUtil.ipcHandleEvent("getPicBeds")
      ElMessage.success(t("setting.picgo.plugin.install.success"))
    } else {
      ElMessage.error(errMsg)
    }

    reloadPage()
  })

  picgoUtil.ipcRegisterEvent("picgoHandlePluginIng", (evt, data) => {
    const fullName: string = data.rawArgs

    pluginData.pluginList.forEach((item) => {
      if (item.fullName === fullName || item.name === fullName) {
        item.ing = true
      }
    })
    loading.value = true
  })

  picgoUtil.ipcRegisterEvent("uninstallSuccess", (evt, data) => {
    loading.value = false
    logger.info(
      "PicgoPluginSetting接收到installPluginFinished事件,data=>",
      data
    )

    const fullName = data.rawArgs.body
    const success = data.rawArgs.success
    const errMsg = data.rawArgs.errMsg

    if (success) {
      pluginData.pluginList = pluginData.pluginList.filter((item) => {
        if (item.fullName === fullName) {
          // restore Uploader & Transformer after uninstalling
          if (item.config.transformer.name) {
            picgoUtil.handleRestoreState(
              "transformer",
              item.config.transformer.name
            )
          }
          if (item.config.uploader.name) {
            picgoUtil.handleRestoreState("uploader", item.config.uploader.name)
          }

          picgoUtil.ipcHandleEvent("getPicBeds")
        }
        return item.fullName !== fullName
      })
      pluginData.pluginNameList = pluginData.pluginNameList.filter(
        (item) => item !== fullName
      )

      ElMessage.success(t("setting.picgo.plugin.uninstall.success"))
    } else {
      ElMessage.error(errMsg)
    }

    loading.value = false
  })

  picgoUtil.ipcRegisterEvent("updateSuccess", (evt, data) => {
    loading.value = false
    logger.info("PicgoPluginSetting接收到updateSuccess事件,data=>", data)

    const body = data.rawArgs.body
    const success = data.rawArgs.success
    const errMsg = data.rawArgs.errMsg

    pluginData.pluginList.forEach((item) => {
      if (item.fullName === body) {
        item.ing = false
      }
    })

    if (success) {
      ElMessage.success(t("setting.picgo.plugin.update.success"))
    } else {
      ElMessage.error(errMsg)
    }

    showPluginConfigForm.value = false
    loading.value = false

    reloadPage()
  })

  picgoUtil.ipcRegisterEvent("picgoConfigPlugin", (evt, data) => {
    loading.value = false
    logger.info("PicgoPluginSetting接收到picgoConfigPlugin事件,data=>", data)

    // 'plugin' | 'transformer' | 'uploader'
    const _currentType: "plugin" | "transformer" | "uploader" =
      data.rawArgs.currentType
    const _configName: string = data.rawArgs.configName
    const _config: any = data.rawArgs.config

    logger.info("_currentType=>", _currentType)
    logger.info("_configName=>", _configName)
    logger.info("_config=>", _config)

    pluginConfigData.currentType = _currentType
    pluginConfigData.configName = _configName
    pluginConfigData.config = _config
    showPluginConfigForm.value = true
  })

  getPluginList()
  getSearchResult = debounce(_getSearchResult, 50)
})

// remove events
onBeforeUnmount(() => {
  picgoUtil.ipcRemoveEvent("pluginList")
  picgoUtil.ipcRemoveEvent("installPluginFinished")
  picgoUtil.ipcRemoveEvent("picgoHandlePluginIng")
  picgoUtil.ipcRemoveEvent("uninstallSuccess")
  picgoUtil.ipcRemoveEvent("updateSuccess")
  picgoUtil.ipcRemoveEvent("picgoConfigPlugin")
})
</script>

<style lang="stylus">
$darwinBg = #172426
#plugin-view
  position relative
  padding 0 20px 0

  .el-loading-mask
    background-color rgba(0, 0, 0, 0.8)

  .plugin-list-tip
    padding: 8px 15px;

  .plugin-list
    align-content flex-start
    box-sizing: border-box;
    padding: 8px 15px;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    top: 10px;
    left: 5px;
    transition: all 0.2s ease-in-out 0.1s;
    width: 100%

    .el-loading-mask
      left: 20px
      width: calc(100% - 40px)

  .view-title
    color var(--custom-app-color)
    font-size 20px
    text-align center
    margin 10px auto
    position relative

    button
      height 24px
      margin-top -4px
      border none
      padding-left 12px
      width 24px

    button:hover, button:focus
      background transparent

    button.el-icon-goods
      margin-left 4px
      font-size 20px
      vertical-align middle
      cursor pointer
      transition color .2s ease-in-out

      &:hover
        color #49B1F5

    button.el-icon-download
      position absolute
      right 0
      top 8px
      font-size 20px
      vertical-align middle
      cursor pointer
      transition color .2s ease-in-out

      &:hover
        color #49B1F5

  .handle-bar
    margin-bottom 20px

    &.cut-width
      padding-right: 8px

  .el-input__inner
    border-radius 0

  .plugin-item
    box-sizing border-box
    height 80px
    background #444
    padding 8px
    user-select text
    transition all .2s ease-in-out
    position relative

    &__container
      height 80px
      margin-bottom 10px

    .cli-only-badge
      position absolute
      right 0
      top 0
      font-size 12px
      padding 3px 8px
      background #49B1F5
      color #eee

    &.darwin
      background transparentify($darwinBg, #000, 0.75)

      &:hover
        background transparentify($darwinBg, #000, 0.85)

    &:hover
      background #333

    &__logo
      width 64px
      height 64px
      float left

    &__content
      float left
      width calc(100% - 72px)
      height 64px
      color #ddd
      margin-left 8px
      display flex
      flex-direction column
      justify-content space-between

      &.disabled
        color #aaa

    &__name
      font-size 16px
      height 22px
      line-height 22px
      // font-weight 600
      font-weight 600
      cursor pointer
      transition all .2s ease-in-out

      &:hover
        color: #1B9EF3

    &__desc
      font-size 14px
      height 21px
      line-height 21px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap

    &__info-bar
      font-size 14px
      height 21px
      line-height 28px
      position relative

    &__author
      overflow hidden
      text-overflow ellipsis
      white-space nowrap

    &__config
      float right
      font-size 16px
      cursor pointer
      transition all .2s ease-in-out

      &:hover
        color: #1B9EF3

    .config-button
      font-size 12px
      color #ddd
      background #222
      padding 1px 8px
      height 18px
      line-height 18px
      text-align center
      position absolute
      top 4px
      right 20px
      transition all .2s ease-in-out

      &.reload
        right 0

      &.ing
        right 0

      &.install
        right 0
        width 36px

      &.work
        background: #3c8833
        margin-right: 32px
        cursor: default

      &.nowork
        background: #843333
        margin-right: 32px;
        cursor: default

        &:hover
          background: #1B9EF3
          color #fff

  .reload-mask
    position absolute
    width calc(100% - 40px)
    bottom -320px
    text-align center
    background rgba(0, 0, 0, 0.4)
    padding 10px 0

    &.cut-width
      width calc(100% - 48px)
</style>
