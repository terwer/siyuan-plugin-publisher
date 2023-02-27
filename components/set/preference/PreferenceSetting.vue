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
  <div class="preference-setting">
    <el-form label-width="150px" inline>
      <el-form-item :label="$t('preference.setting.fixTitle')">
        <el-switch
          v-model="formData.fixTitle"
          @change="formMethods.onTitleChange"
        />
      </el-form-item>
      <el-form-item :label="$t('preference.setting.removeH1')">
        <el-switch
          v-model="formData.removeH1"
          @change="formMethods.onH1Change"
        />
      </el-form-item>
      <el-form-item :label="$t('preference.setting.newWin')">
        <el-switch
          v-model="formData.newWin"
          @change="formMethods.onNewWinChange"
        />
      </el-form-item>
      <el-form-item :label="$t('main.auto.fetch.tag')">
        <el-switch
          v-model="formData.autoTag"
          @change="formMethods.onAutoTagChange"
        />
      </el-form-item>
      <el-form-item v-if="false" :label="$t('siyuan.browser.show.close.btn')">
        <el-switch
          v-model="formData.showCloseBtn"
          @change="formMethods.onShowCloseBtnChange"
        />
      </el-form-item>
      <el-form-item :label="$t('github.post.picgo.use')">
        <el-switch
          v-model="formData.usePicgo"
          @change="formMethods.onUsePicgoBtnChange"
        />
      </el-form-item>
    </el-form>

    <el-form label-width="150px" v-if="false">
      <el-divider />

      <el-form-item :label="$t('setting.main.background')">
        <el-color-picker v-model="formData.mainBg" />
        <el-alert
          :title="$t('setting.main.background.tip')"
          type="warning"
          :closable="false"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="formMethods.handleSavePreference"
          >{{ $t("main.opt.ok") }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch } from "vue"
import { getPublishCfg } from "~/utils/publishUtil"
import { PublishPreference } from "~/utils/models/publishPreference"
import { setJSONConf } from "~/utils/configUtil"
import { CONSTANTS } from "~/utils/constants/constants"
import { LogFactory } from "~/utils/logUtil"
import { reloadPage } from "~/utils/browserUtil"
import { parseBoolean } from "~/utils/util"
import { ElMessageBox } from "element-plus"
import { useI18n } from "vue-i18n"

const logger = LogFactory.getLogger(
  "components/publish/tab/preference/PreferenceSetting.vue"
)
const { t } = useI18n()

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false,
  },
})

const formData = reactive({
  fixTitle: false,
  removeH1: false,
  newWin: true,
  autoTag: false,
  showCloseBtn: false,
  usePicgo: false,
  mainBg: "",
})

const formMethods = {
  onTitleChange: (val: boolean) => {
    logger.debug("onTitleChange=>", val)
    formData.fixTitle = val

    saveConf()
  },
  onH1Change: (val: boolean) => {
    logger.debug("onH1Change=>", val)
    const isTrue = parseBoolean(val)
    if (isTrue === true) {
      ElMessageBox.confirm(
        t("preference.setting.removeH1.tip"),
        t("main.opt.warning"),
        {
          confirmButtonText: t("main.opt.ok"),
          cancelButtonText: t("main.opt.cancel"),
          type: "warning",
        }
      )
        .then(async () => {
          formData.removeH1 = val

          saveConf()
        })
        .catch(() => {
          formData.removeH1 = !isTrue

          // ElMessage({
          //   type: 'error',
          //   message: t("main.opt.failure"),
          // })
        })
    }
  },
  onNewWinChange: (val: boolean) => {
    logger.debug("onNewWinChange=>", val)
    formData.newWin = val

    saveConf()
  },
  onAutoTagChange: (val: boolean) => {
    logger.debug("onAutoTagChange=>", val)
    formData.autoTag = val

    saveConf()
  },
  onShowCloseBtnChange: (val: boolean) => {
    logger.debug("onShowCloseBtnChange=>", val)
    formData.showCloseBtn = val

    saveConf()
  },
  onUsePicgoBtnChange: (val: boolean) => {
    logger.debug("onUsePicgoBtnChange=>", val)
    formData.usePicgo = val

    saveConf()
  },
  handleSavePreference: () => {
    saveConf()
  },
}

const saveConf = () => {
  const publishCfg = getPublishCfg()
  publishCfg.fixTitle = parseBoolean(formData.fixTitle)
  publishCfg.removeH1 = parseBoolean(formData.removeH1)
  publishCfg.newWin = parseBoolean(formData.newWin)
  publishCfg.autoTag = parseBoolean(formData.autoTag)
  publishCfg.showCloseBtn = parseBoolean(formData.showCloseBtn)
  publishCfg.usePicgo = parseBoolean(formData.usePicgo)
  publishCfg.mainBg = formData.mainBg

  setJSONConf<PublishPreference>(
    CONSTANTS.PUBLISH_PREFERENCE_CONFIG_KEY,
    publishCfg
  )
  logger.debug("偏好设置已保存")

  reloadPage()
}

const initConf = () => {
  const publishCfg = getPublishCfg()

  formData.fixTitle = parseBoolean(publishCfg.fixTitle)
  formData.removeH1 = parseBoolean(publishCfg.removeH1)
  formData.newWin = parseBoolean(publishCfg.newWin)
  formData.autoTag = parseBoolean(publishCfg.autoTag)
  formData.showCloseBtn = parseBoolean(publishCfg.showCloseBtn)
  formData.usePicgo = parseBoolean(publishCfg.usePicgo)
  formData.mainBg = publishCfg.mainBg
}

onMounted(() => {
  initConf()
})

watch(
  () => props.isReload,
  async () => {
    // 初始化
    initConf()
    logger.debug("preference-setting刷新")
  }
)
</script>
