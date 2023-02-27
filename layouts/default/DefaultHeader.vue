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

<template>
  <div class="header-default">
    <el-header id="publisher-header">
      <div v-if="!showTitle">
        <!-- 快速发布 -->
        <!--
        <el-tooltip
          :content="$t('siyuan.browser.menu.quick.btn')"
          class="box-item"
          effect="light"
          placement="right"
          popper-class="publish-menu-tooltip"
        >
        </el-tooltip>
        -->
        <!--
        <el-button
          v-if="showOpenBtn"
          class="b3-button--quick"
          type="success"
          @click="handleWinQuick"
        >
          <font-awesome-icon icon="fa-solid fa-bolt" />
        </el-button>
        -->

        <!-- 文章发布 -->
        <!--
        <el-tooltip
          :content="$t('siyuan.browser.menu.publish.btn')"
          class="box-item"
          effect="light"
          placement="right"
          popper-class="publish-menu-tooltip"
        >
        </el-tooltip>
        -->
        <el-tooltip
          :content="$t('siyuan.browser.menu.publish.btn')"
          class="box-item"
          effect="light"
          placement="right"
          popper-class="publish-menu-tooltip"
        >
          <el-button
            v-if="showOpenBtn"
            class="b3-button--open"
            type="success"
            @click="handleWinOpen"
          >
            <font-awesome-icon icon="fa-solid fa-upload" />
          </el-button>
        </el-tooltip>

        <!-- 文章预览 -->
        <el-tooltip
          :content="$t('siyuan.browser.menu.preview.btn')"
          class="box-item"
          effect="light"
          placement="right"
          popper-class="publish-menu-tooltip"
        >
          <el-button
            v-if="showOpenBtn"
            class="b3-button--preview"
            type="success"
            @click="handleWinPreview"
          >
            <font-awesome-icon icon="fa-solid fa-book-open-reader" />
          </el-button>
        </el-tooltip>

        <!-- 文章管理 -->
        <el-tooltip
          :content="$t('siyuan.browser.menu.manage.btn')"
          class="box-item"
          effect="light"
          placement="right"
          popper-class="publish-menu-tooltip"
        >
          <el-button
            v-if="showOpenBtn"
            class="b3-button--preview"
            type="success"
            @click="handleWinManage"
          >
            <font-awesome-icon icon="fa-solid fa-rectangle-list" />
          </el-button>
        </el-tooltip>

        <!-- Anki标记 -->
        <el-tooltip
          :content="$t('siyuan.browser.menu.anki.btn')"
          class="box-item"
          effect="light"
          placement="right"
          popper-class="publish-menu-tooltip"
        >
          <el-button
            v-if="showOpenBtn"
            class="b3-button--anki"
            type="success"
            @click="handleWinAnki"
          >
            <font-awesome-icon icon="fa-solid fa-credit-card" />
          </el-button>
        </el-tooltip>

        <!-- 图床 -->
        <el-tooltip
          :content="$t('siyuan.browser.menu.picture.btn')"
          class="box-item"
          effect="light"
          placement="right"
          popper-class="publish-menu-tooltip"
        >
          <el-button
            v-if="showOpenBtn"
            class="b3-button--picture"
            type="success"
            @click="handleWinPicture"
          >
            <font-awesome-icon icon="fa-solid fa-image" />
          </el-button>
        </el-tooltip>

        <!-- 统一设置 -->
        <el-tooltip
          :content="$t('siyuan.browser.menu.setting.btn')"
          class="box-item"
          effect="light"
          placement="right"
          popper-class="publish-menu-tooltip"
        >
          <el-button
            v-if="showOpenBtn"
            class="b3-button--picture"
            type="success"
            @click="handleWinSet"
          >
            <font-awesome-icon icon="fa-solid fa-gear" />
          </el-button>
        </el-tooltip>

        <!-- 关闭 -->
        <!--
        <el-tooltip
          :content="$t('siyuan.browser.menu.quick.btn')"
          class="box-item"
          effect="light"
          placement="right"
          popper-class="publish-menu-tooltip"
        >
        </el-tooltip>
        -->
        <el-button
          v-if="showCloseBtn"
          class="b3-button--cancel"
          type="danger"
          @click="handleWinClose"
        >
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </el-button>
      </div>

      <h1 v-if="showTitle" class="header-title-default">
        <el-button class="header-title-btn disabled-click">
          思源笔记发布工具
        </el-button>
      </h1>
    </el-header>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { doCloseExportWin, doOpenExportWin, isInSiyuanNewWinBrowser } from "~/utils/otherlib/siyuanBrowserUtil";
import { ElMessage } from "element-plus";
import { getWidgetId, isInSiyuanWidget } from "~/utils/platform/siyuan/siyuanUtil";
import { getPublishCfg } from "~/utils/publishUtil";
import { appendStr } from "~/utils/strUtil";
import { useI18n } from "vue-i18n";
import { LogFactory } from "~/utils/logUtil";
import { isElectron } from "~/utils/browserUtil";
import { isSlot, isWindows } from "~/utils/otherlib/ChromeUtil";
import envUtil from "~/utils/envUtil";

const { t } = useI18n()
const logger = LogFactory.getLogger("layouts/default/DefaultHeader.vue")

const showCloseBtn = ref(false)
const showOpenBtn = ref(false)
const showTitle = ref(false)

// const handleWinQuick = async () => {}

const handleWinOpen = async () => {
  if (showOpenBtn.value) {
    try {
      const widgetResult = getWidgetId()
      await doOpenExportWin(widgetResult.widgetId, "index.html")

      // event
      pageIdChanged()
    } catch (e) {
      // showOpenBtn.value = false
      ElMessage.info(
        "发生异常，已暂时关闭此按钮，如需永久关闭，请前往通用设置关闭=>" + e
      )
    }
  }
}

const handleWinPreview = async () => {
  if (showOpenBtn.value) {
    try {
      const widgetResult = getWidgetId()
      await doOpenExportWin(widgetResult.widgetId, "detail/index.html")

      // event
      pageIdChanged()
    } catch (e) {
      // showOpenBtn.value = false
      ElMessage.info(
        "发生异常，已暂时关闭此按钮，如需永久关闭，请前往通用设置关闭=>" + e
      )
    }
  }
}

const handleWinManage = async () => {
  if (showOpenBtn.value) {
    try {
      await doOpenExportWin(undefined, "blog/index.html")

      // event
      pageIdChanged()
    } catch (e) {
      // showOpenBtn.value = false
      ElMessage.info(
        "发生异常，已暂时关闭此按钮，如需永久关闭，请前往通用设置关闭=>" + e
      )
    }
  }
}

const handleWinAnki = async () => {
  if (showOpenBtn.value) {
    try {
      const widgetResult = getWidgetId()
      await doOpenExportWin(widgetResult.widgetId, "anki/index.html")

      // event
      pageIdChanged()
    } catch (e) {
      // showOpenBtn.value = false
      ElMessage.info(
        "发生异常，已暂时关闭此按钮，如需永久关闭，请前往通用设置关闭=>" + e
      )
    }
  }
}

const handleWinPicture = async () => {
  try {
    const widgetResult = getWidgetId()
    await doOpenExportWin(widgetResult.widgetId, "picgo/index.html")

    // event
    pageIdChanged()
  } catch (e) {
    logger.error(t("main.opt.failure"), "=>", e)
    ElMessage.error(appendStr(t("main.opt.failure"), "=>", e))
  }
}

const handleWinSet = async () => {
  try {
    await doOpenExportWin(undefined, "set/index.html")

    // event
    pageIdChanged()
  } catch (e) {
    logger.error(t("main.opt.failure"), "=>", e)
    ElMessage.error(appendStr(t("main.opt.failure"), "=>", e))
  }
}

const handleWinClose = () => {
  if (showCloseBtn.value) {
    try {
      doCloseExportWin()

      // event
      pageIdChanged()
    } catch (e) {
      // showCloseBtn.value = false
      ElMessage.info(
        "非弹窗点击，已暂时关闭此按钮，如需永久关闭，请前往通用设置关闭=>" + e
      )
    }
  }
}

const pageIdChanged = () => {
  // 思源新窗口
  if (isInSiyuanNewWinBrowser()) {
    showOpenBtn.value = false
    showCloseBtn.value = true

    // 如果是Windows环境，不显示关闭按钮
    if (isWindows && isElectron) {
      showCloseBtn.value = false
    }
  } else {
    // 思源笔记主窗口

    showOpenBtn.value = true
    showCloseBtn.value = false

    // 非插槽不显示按钮
    if (!isSlot) {
      showOpenBtn.value = false
      showCloseBtn.value = false

      showTitle.value = true
    }
  }
}

onMounted(() => {
  // 思源新窗口，或者思源挂件才会有这两个按钮
  if (isInSiyuanNewWinBrowser() || isInSiyuanWidget()) {
    // init
    const publishCfg = getPublishCfg()

    showCloseBtn.value = isInSiyuanNewWinBrowser() || publishCfg.showCloseBtn
    showOpenBtn.value = showCloseBtn.value

    showTitle.value = false;

    // event
    pageIdChanged();
  } else {
    showOpenBtn.value = false;
    showCloseBtn.value = true;

    showTitle.value = true;
  }

  // 开发阶段调试菜单
  if (envUtil.isDev) {
    // showOpenBtn.value = true
    // showCloseBtn.value = true
    // showTitle.value = false
  }
})
</script>

<style scoped>
.header-default {
}

.header-title-default {
  text-align: center;
  margin: 0;
}

.header-title-default .header-title-btn {
  border: none;
  font-size: 32px;
  cursor: default;
}

.header-title-default .header-title-btn:hover {
  background: none;
  color: var(--el-button-text-color);
}

#publisher-header {
  padding: 0 6px;
}

#publisher-header .b3-button--cancel {
  right: 20px;
  position: fixed;
  z-index: 99;
}
</style>
