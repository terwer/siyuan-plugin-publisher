<!--
  - Copyright (c) 2022, Terwer . All rights reserved.
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
      <el-button
        v-if="showOpenBtn"
        class="b3-button--open"
        type="success"
        @click="handleWinOpen"
        >[]
      </el-button>
      <el-button
        v-if="showCloseBtn"
        class="b3-button--cancel"
        type="danger"
        @click="handleWinClose"
        >X
      </el-button>
      <!--
      <h1 class="header-title-default">
        <el-button class="header-title-btn disabled-click">
          思源笔记发布工具
        </el-button>
      </h1>
      -->
    </el-header>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import {
  doCloseExportWin,
  doOpenExportWin,
  isInSiyuanBrowser,
} from "~/utils/otherlib/siyuanBrowserUtil"
import { getPublishCfg } from "~/utils/publishUtil"
import { ElMessage } from "element-plus"

const showCloseBtn = ref(false)
const showOpenBtn = ref(false)

const handleWinOpen = async () => {
  if (showOpenBtn.value) {
    try {
      await doOpenExportWin()
    } catch (e) {
      showOpenBtn.value = false
      ElMessage.info(
        "发生异常，已暂时关闭此按钮，如需永久关闭，请前往通用设置关闭=>" + e
      )
    }
  }
}

const handleWinClose = () => {
  if (showCloseBtn.value) {
    try {
      doCloseExportWin()
    } catch (e) {
      showCloseBtn.value = false
      ElMessage.info(
        "非弹窗点击，已暂时关闭此按钮，如需永久关闭，请前往通用设置关闭=>" + e
      )
    }
  }
}

onMounted(() => {
  const publishCfg = getPublishCfg()
  showCloseBtn.value = isInSiyuanBrowser() || publishCfg.showCloseBtn
  showOpenBtn.value = showCloseBtn.value
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

#publisher-header .b3-button--cancel {
  float: right;
}
</style>
