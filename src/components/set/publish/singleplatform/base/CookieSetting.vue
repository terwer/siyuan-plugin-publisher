<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { reactive, ref, watch } from "vue"
import { ElMessage, FormRules } from "element-plus"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { StrUtil } from "zhi-common"
import { extraPreCfg } from "~/src/platforms/pre.ts"

const logger = createAppLogger("cookie-setting")

const props = defineProps({
  apiType: "" as any,
  setting: {} as any,
  dynCfg: {} as any,
  settingCfg: {} as any,
})

// emits
const emit = defineEmits(["emitHideDlg"])

// uses
const { t } = useVueI18n()
const { updateSetting } = usePublishSettingStore()

// datas
const formRef = ref()
const formData = reactive({
  key: props.apiType,
  settingData: props.setting,
  dynCfgData: props.dynCfg,
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

  if (StrUtil.isEmptyString(formData.key)) {
    ElMessage.error("平台key不能为空，请排查。如有问题，请联系作者")
    return
  }
  formData.settingData[formData.key] = formData.settingCfgData
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
        title="检测到当前为浏览器页面或者受平台技术限制，无法获取Cookie，请手动粘贴平台Cookie。本插件承诺，所有数据仅在您的本地存储，我们不会上传或者分享你的任何数据，请放心使用。如有疑问请查看帮助文档。"
        type="error"
        :closable="false"
      />
      <!-- 设置提示 -->
      <el-form-item>
        特别提示：受平台限制，当前无法自动获取cookie，请在Chrome浏览器手动打开 &nbsp;
        <a :href="extraPreCfg.cookieLimitTipsAuth[formData.dynCfgData.subPlatformType]" target="_blank">
          {{ extraPreCfg.cookieLimitTipsAuth[formData.dynCfgData.subPlatformType] }}
        </a>
        &nbsp;并登录，然后使用开发者工具找到cookie，最后复制粘贴到下方文本框，可参考
        <a :href="extraPreCfg.cookieLimitTipsImg[formData.dynCfgData.subPlatformType]" target="_blank">此图片</a>
        的指引。
      </el-form-item>
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
</style>
