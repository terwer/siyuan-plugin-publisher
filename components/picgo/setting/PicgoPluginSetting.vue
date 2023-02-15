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

    <el-row v-loading="loading" :gutter="10" class="plugin-list">
      <el-col
        v-for="item in pluginList"
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
            <div class="plugin-item__name" @click="openHomepage(item.homepage)">
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
                  <template v-if="!item.hasInstall">
                    <span
                      v-if="!item.ing"
                      class="config-button install"
                      @click="installPlugin(item)"
                    >
                      {{ $t("setting.picgo.plugin.install") }}
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
                      <font-awesome-icon icon="fa-solid fa-trash-can" />
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
</template>

<script lang="ts" setup>
import picgoUtil from "~/utils/otherlib/picgoUtil"
import { LogFactory } from "~/utils/logUtil"
import { ElMessage } from "element-plus"
import { onBeforeMount, ref } from "vue"
import { goToPage } from "~/utils/otherlib/ChromeUtil"
import sysUtil from "~/utils/otherlib/sysUtil"

const logger = LogFactory.getLogger(
  "components/picgo/setting/PicgoPluginSetting.vue"
)

// vars
const __static = ""
const loading = ref(false)
const searchText = ref("")
const pluginList = ref<IPicGoPlugin[]>([])
const os = ref("")
const defaultLogo = ref(
  `this.src="file://${__static.replace(/\\/g, "/")}/roundLogo.png"`
)

// handles
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
  alert("installPlugin")
}

async function buildContextMenu(plugin: IPicGoPlugin) {
  // sendToMain(SHOW_PLUGIN_PAGE_MENU, plugin)
  alert("buildContextMenu")
}

// register events
onBeforeMount(() => {
  os.value = sysUtil.getOS()

  picgoUtil.ipcRegisterEvent("pluginList", (evt, data) => {
    logger.info("PicgoPluginSetting接收到pluginList事件,data=>", data)

    const rawArgs = data.rawArgs
    if (rawArgs.success) {
      // const list = rawArgs.list
      // pluginList.value = list
      // pluginNameList.value = list.map(item => item.fullName)

      logger.info("插件已经成功安装.")
    } else {
      ElMessage.error(rawArgs.error)
    }
  })
})
</script>

<style lang="stylus">
$darwinBg = #172426
#plugin-view
  position relative
  padding 0 20px 0

  .el-loading-mask
    background-color rgba(0, 0, 0, 0.8)

  .plugin-list
    align-content flex-start
    height: 339px;
    box-sizing: border-box;
    padding: 8px 15px;
    overflow-y: auto;
    overflow-x: hidden;
    position: absolute;
    top: 70px;
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
      right 0px
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
        right 0px

      &.ing
        right 0px

      &.install
        right 0px

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
