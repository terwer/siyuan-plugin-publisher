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

<script setup lang="ts">
import { reactive, ref } from "vue"
import { ElMessage, FormRules } from "element-plus"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useSettingStore } from "~/src/stores/useSettingStore.ts"

const logger = createAppLogger("cookie-setting")

const props = defineProps({
  key: "" as any,
  setting: {} as any,
  settingCfg: {} as any,
})

// emits
const emit = defineEmits(["emitHideDlg"])

// uses
const { t } = useVueI18n()
const { updateSetting } = useSettingStore()

// datas
const formRef = ref()
const formData = reactive({
  settingData: props.setting,
  settingCfgData: props.settingCfg,
})

const formValidateRules = reactive<FormRules>({})

const validateForm = (formEl) => {
  return true
}

const submitForm = async (formEl) => {
  if (!formEl) return
  if (!validateForm(formEl)) {
    return
  }

  const result = await formEl.validate((valid, fields) => {
    if (valid) {
      logger.debug("校验成功")
    } else {
      logger.error(t("main.opt.failure"), fields)
      // ElMessage.error(t('main.opt.failure'))
    }
  })
  if (!result) {
    return
  }

  formData.settingData[props.key] = formData.settingCfgData
  await updateSetting(formData.settingData)

  if (emit) {
    emit("emitHideDlg")
  }
  // 重新加载列表
  ElMessage.success(t("main.opt.success"))
}
</script>

<template>
  <div>
    <el-form
      class="add-form"
      ref="formRef"
      label-width="100px"
      :model="formData.settingCfgData"
      :rules="formValidateRules"
    >
      <el-alert
        class="top-tip"
        title="检测到当前为浏览器页面，受技术限制无法获取Cookie，请手动粘贴平台Cookie。本插件承诺，所有数据仅在您的本地存储，我们不会上传或者分享你的任何数据，请放心使用。如有疑问请查看帮助文档。"
        type="error"
        :closable="false"
      />
      <!-- 平台cookie -->
      <el-form-item label="平台Cookie">
        <el-input
          v-model="formData.settingCfgData.password"
          style="width: 75%; margin-right: 16px"
          placeholder="请直接粘贴平台cookie，为了您的隐私安全，请勿泄露cookie给任何人"
          type="textarea"
          :rows="10"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">{{ t("setting.blog.save") }} </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="stylus">
.top-tip
  margin 10px 0
  padding-left 0
</style>
