<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<!--suppress ALL -->
<script setup lang="ts">
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { StrUtil } from "zhi-common"
import { getSiyuanWidgetId } from "~/src/utils/siyuanUtils.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { ElMessageBox, type MessageBoxData } from "element-plus"
import { markRaw } from "vue"
import { WarnTriangleFilled } from "@element-plus/icons-vue"

const logger = createAppLogger("preference-setting")
const { t } = useVueI18n()
const { getPublishPreferenceSetting } = usePreferenceSettingStore()
const { isInSiyuanWin, isInSiyuanWidget } = useSiyuanDevice()

const publishPreferenceSettingForm = getPublishPreferenceSetting()
const isSiyuanPlugin = isInSiyuanWin() || (isInSiyuanWidget() && StrUtil.isEmptyString(getSiyuanWidgetId()))

const onBeforeChangeForAllowChangeSlug = (): boolean | Promise<boolean> => {
  return doBeforeChangeForAllowChangeSlug()
}

const doBeforeChangeForAllowChangeSlug = async (): Promise<boolean> => {
  const val = publishPreferenceSettingForm.value
  logger.debug(`val=>${val.allowChangeSlug}`)
  if (val.allowChangeSlug !== true) {
    const result = await ElMessageBox.confirm(t("preference.setting.allowChangeSlug.tips"), {
      type: "error",
      icon: markRaw(WarnTriangleFilled),
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
    } as any)
    logger.debug("confirm result=>", result)
    return result === "confirm"
  }
  return true
}
</script>

<template>
  <el-form inline label-width="125px" class="publish-preference-setting-form">
    <el-form-item :label="t('preference.setting.fixTitle')">
      <el-switch v-model="publishPreferenceSettingForm.fixTitle"></el-switch>
    </el-form-item>
    <el-form-item :label="t('preference.setting.keepTitle')">
      <el-switch v-model="publishPreferenceSettingForm.keepTitle"></el-switch>
    </el-form-item>
    <el-form-item :label="t('preference.setting.removeH1')">
      <el-switch v-model="publishPreferenceSettingForm.removeFirstH1"></el-switch>
    </el-form-item>
    <el-form-item :label="t('preference.setting.removeWidgetTag')">
      <el-switch v-model="publishPreferenceSettingForm.removeMdWidgetTag"></el-switch>
    </el-form-item>

    <div v-if="isSiyuanPlugin">
      <el-divider border-style="dashed" class="psd" />

      <el-form-item :label="t('preference.setting.showDocQuickMenu')">
        <el-switch v-model="publishPreferenceSettingForm.showDocQuickMenu"></el-switch>
      </el-form-item>
      <el-form-item :label="t('preference.setting.showQuickMenu')">
        <el-switch v-model="publishPreferenceSettingForm.showQuickMenu"></el-switch>
      </el-form-item>
      <el-form-item :label="t('preference.setting.showSingleMenu')">
        <el-switch v-model="publishPreferenceSettingForm.showSingleMenu"></el-switch>
      </el-form-item>
      <el-form-item :label="t('preference.setting.showBatchMenu')">
        <el-switch v-model="publishPreferenceSettingForm.showBatchMenu"></el-switch>
      </el-form-item>

      <el-divider border-style="dashed" class="psd" />

      <el-form-item :label="t('preference.setting.showAIMenu')">
        <el-switch v-model="publishPreferenceSettingForm.showAIMenu"></el-switch>
      </el-form-item>
      <el-form-item :label="t('preference.setting.showExtendMenu')">
        <el-switch v-model="publishPreferenceSettingForm.showExtendMenu"></el-switch>
      </el-form-item>
      <el-form-item :label="t('preference.setting.showArticleManageMenu')">
        <el-switch v-model="publishPreferenceSettingForm.showArticleManageMenu"></el-switch>
      </el-form-item>
      <el-form-item :label="t('preference.setting.ignoreBlockRef')">
        <el-switch v-model="publishPreferenceSettingForm.ignoreBlockRef"></el-switch>
      </el-form-item>

      <el-divider border-style="dashed" class="psd" />

      <el-form-item :label="t('preference.setting.allowChangeSlug')">
        <el-switch
          v-model="publishPreferenceSettingForm.allowChangeSlug"
          :before-change="onBeforeChangeForAllowChangeSlug"
        ></el-switch>
      </el-form-item>
    </div>
  </el-form>
</template>

<style scoped lang="stylus">
.psd
  margin-bottom 10px
  margin-top 0
</style>
