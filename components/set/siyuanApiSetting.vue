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
  <div>
    <el-form
      ref="siyuanApiSettingFormRef"
      :model="siyuanApiChangeForm"
      :rules="siyuanApiChangeRules"
    >
      <el-form-item
        :label="$t('setting.blog.apiurl')"
        :label-width="formLabelWidth"
        prop="apiUrl"
      >
        <el-input
          v-model="siyuanApiChangeForm.apiUrl"
          autocomplete="off"
          :placeholder="$t('setting.blog.siyuan.apiurl')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('setting.blog.password')"
        :label-width="formLabelWidth"
        prop="pwd"
      >
        <el-input
          v-model="siyuanApiChangeForm.pwd"
          type="password"
          autocomplete="off"
          :placeholder="$t('setting.blog.siyuan.password')"
          show-password
        />
      </el-form-item>
      <el-form-item
        :label="$t('setting.blog.middlewareUrl')"
        :label-width="formLabelWidth"
        prop="middlewareUrl"
      >
        <el-input
          v-model="siyuanApiChangeForm.middlewareUrl"
          autocomplete="off"
          :placeholder="$t('setting.blog.middlewareUrl.tip')"
        />
      </el-form-item>
      <el-form-item>
        <el-alert
          class="top-data-tip middleware-tip"
          :title="$t('setting.blog.middlewareUrl.my.tip')"
          type="success"
          :closable="false"
        />
      </el-form-item>

      <!-- 操作 -->
      <div class="dialog-action">
        <el-form-item>
          <el-button @click="handleCancel" v-if="props.showCancel"
            >{{ $t("main.opt.cancel") }}
          </el-button>
          <el-button type="primary" @click="handleOk(siyuanApiSettingFormRef)"
            >{{ $t("main.opt.ok") }}
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, FormRules } from "element-plus"
import {
  getSiyuanCfg,
  SiYuanConfig,
} from "~/utils/platform/siyuan/siYuanConfig"
import { setJSONConf } from "~/utils/configUtil"
import { SIYUAN_CONSTANTS } from "~/utils/constants/siyuanConstants"
import { onBeforeMount, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { LogFactory } from "~/utils/logUtil"
import { reloadPage } from "~/utils/browserUtil"

const logger = LogFactory.getLogger("components/set/siyuanApiSetting.vue")

const { t } = useI18n()

const props = defineProps({
  showCancel: Boolean,
})

const emits = defineEmits(["on-change"])

const formLabelWidth = "140px"

const siyuanApiSettingFormRef = ref()
const siyuanApiChangeForm = reactive({
  apiUrl: "http://127.0.0.1:6806",
  pwd: "",
  middlewareUrl: "",
})
const siyuanApiChangeRules = reactive<FormRules>({
  apiUrl: [
    {
      required: true,
      message: () => t("form.validate.name.required"),
    },
  ],
  pwd: [
    {
      required: false,
      message: () => t("form.validate.name.required"),
    },
  ],
})

const handleCancel = async () => {
  onBack()
}

const handleOk = async (formEl) => {
  if (!formEl) return
  const result = await formEl.validate((valid, fields) => {
    if (valid) {
      logger.debug("校验成功")
    } else {
      logger.error(t("main.opt.failure"), fields)
      ElMessage.error(t("main.opt.failure"))
    }
  })
  if (!result) {
    return
  }

  // 保存思源笔记配置数据
  try {
    const siyuanCfg = new SiYuanConfig(
      siyuanApiChangeForm.apiUrl,
      siyuanApiChangeForm.pwd,
      siyuanApiChangeForm.middlewareUrl
    )
    setJSONConf<SiYuanConfig>(SIYUAN_CONSTANTS.SIYUAN_CFG_KEY, siyuanCfg)
    logger.debug("保存思源配置", siyuanCfg)
    ElMessage.success(t("main.opt.success"))
    onBack()
    reloadPage()
  } catch (e) {
    onBack()

    ElMessage.error(t("main.opt.failure"))
    logger.error(t("main.opt.failure"), e)
  }
}

const onBack = () => {
  emits("on-change")
}

const initPage = () => {
  const siyuanCfg = getSiyuanCfg()

  siyuanApiChangeForm.apiUrl = siyuanCfg.baseUrl
  siyuanApiChangeForm.pwd = siyuanCfg.token
  siyuanApiChangeForm.middlewareUrl = siyuanCfg.middlewareUrl
  logger.debug("初始化思源配置", siyuanCfg)
}

onBeforeMount(() => {
  initPage()
})
</script>

<style scoped></style>
