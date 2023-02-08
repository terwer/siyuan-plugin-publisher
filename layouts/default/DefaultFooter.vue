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
  <div>
    <div class="footer">
      <div>
        <span class="text"> &copy;2011-{{ nowYear() }} </span>
        <span class="s-dark" @click="goGithub()"> sy-post-publisher </span>

        <span class="text"> v{{ v }} . </span>
        <span class="text s-dark" @click="toggleDark()">{{
          isDark ? $t("theme.mode.light") : $t("theme.mode.dark")
        }}</span>

        <span class="text">.</span>
        <span class="text s-dark" @click="changeSiyuanApi()">
          {{ $t("blog.change.siyuan.api") }}
        </span>

        <span class="text">.</span>
        <span class="text s-dark" @click="exportConfig()">
          {{ $t("setting.conf.export") }}
        </span>

        <span class="text">.</span>
        <span class="text s-dark" @click="importConfig()">
          {{ $t("setting.conf.import") }}
        </span>

        <span class="text">.</span>
        <span class="text s-dark" @click="clearConfig()">
          {{ $t("setting.conf.clear") }}
        </span>

        <span class="text">.</span>
        <span class="text s-dark" @click="newWin()">
          {{ $t("blog.newwin.open") }}
        </span>

        <span class="text">.</span>
        <span class="text s-dark" @click="openGeneralSetting()">
          {{ $t("setting.blog.index") }}
        </span>

        <!--
        -----------------------------------------------------------------------------
        -->
        <!-- 思源地址设置弹窗 -->
        <el-dialog
          v-model="siyuanApiChangeFormVisible"
          :title="$t('blog.change.siyuan.api')"
        >
          <siyuan-api-setting
            @on-change="
              () => {
                siyuanApiChangeFormVisible = false
              }
            "
            :show-cancel="true"
          />
        </el-dialog>

        <!-- 导入选择弹窗 -->
        <el-dialog
          v-model="settingImportFormVisible"
          :title="$t('setting.conf.export')"
        >
          <transport-select />
        </el-dialog>

        <!-- 导出选择弹窗 -->
        <el-dialog
          v-model="settingExportFormVisible"
          :title="$t('setting.conf.import')"
        >
          <transport-select />
        </el-dialog>

        <!-- 通用设置弹窗 -->
        <el-dialog
          v-model="generalSettingFormVisible"
          :title="$t('setting.blog.index')"
        >
          <set-index />
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDark, useToggle } from "@vueuse/core"
import { onMounted, ref } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { useI18n } from "vue-i18n"
import { LogFactory } from "~/utils/logUtil"
import { isInSiyuanWidget } from "~/utils/platform/siyuan/siyuanUtil"
import { goToPage } from "~/utils/otherlib/ChromeUtil"
import { clearConf } from "~/utils/configUtil"
import { version } from "../../package.json"
import { isBrowser, reloadPage } from "~/utils/browserUtil"
import { nowYear } from "~/utils/dateUtil"
import SetIndex from "~/components/set/SetIndex.vue"
import SiyuanApiSetting from "~/components/set/siyuanApiSetting.vue"
import TransportSelect from "~/components/transport/TransportSelect.vue"

const logger = LogFactory.getLogger("layouts/default/DefaultFooter")

const { t } = useI18n()

const isDark = useDark()
const toggleDark = useToggle(isDark)

const v = ref("0.0.3")

const siyuanApiChangeFormVisible = ref(false)
const settingImportFormVisible = ref(false)
const settingExportFormVisible = ref(false)
const generalSettingFormVisible = ref(false)

const goGithub = () => {
  window.open("https://github.com/terwer/src-sy-post-publisher")
}

const newWin = () => {
  goToPage("/blog/index.html")
}

const openGeneralSetting = () => {
  generalSettingFormVisible.value = true
}

const exportConfig = () => {
  settingExportFormVisible.value = true
}

const importConfig = async () => {
  settingImportFormVisible.value = true
}

const clearConfig = () => {
  ElMessageBox.confirm(t("main.opt.warning.tip"), t("main.opt.warning"), {
    confirmButtonText: t("main.opt.ok"),
    cancelButtonText: t("main.opt.cancel"),
    type: "warning",
  })
    .then(async () => {
      clearConf()

      reloadPage()
      ElMessage.success(t("main.opt.success"))
    })
    .catch(() => {
      // ElMessage({
      //   type: 'error',
      //   message: t("main.opt.failure"),
      // })
    })
}

const changeSiyuanApi = () => {
  siyuanApiChangeFormVisible.value = true
}

const initConf = () => {
  v.value = version
}

onMounted(() => {
  if (isInSiyuanWidget()) {
    logger.info("恭喜你，正在以挂件模式运行")
  } else {
    logger.info(
      "正在以非挂件模式运行，部分功能将通过请求代理的方式进行模拟，请知悉"
    )
  }
  initConf()

  // 不是浏览器插件，设置100%
  if (isBrowser()) {
    if (document.body.clientWidth > 660) {
      document.getElementById("app").style.minHeight = "100%"
    }
  }
})
</script>

<style scoped>
.footer {
  font-size: 12px;
  color: #bbb;
  text-align: center;
  padding-bottom: 8px;
}

.footer .text {
  vertical-align: middle;
}

.s-dark {
  color: var(--el-color-primary);
  cursor: pointer;
}

.middleware-tip {
  text-align: left;
}
</style>
