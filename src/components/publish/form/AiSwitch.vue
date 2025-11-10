<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { markRaw, reactive } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { Warning } from "@element-plus/icons-vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"

const { t } = useVueI18n()

const props = defineProps({
  useAi: {
    type: Boolean,
    default: false,
  },
})

const formData = reactive({
  useAi: props.useAi,
})

const emit = defineEmits(["emitSyncAiSwitch"])

const onAiSwitchChange = (val: boolean) => {
  if (val) {
    ElMessageBox.confirm(
      `由于运营成本关系，人工智能服务[内测版]相关服务会在内测结束后收费，是否仍然开启，不开启仍然可以使用基础功能？`,
      "温馨提示",
      {
        type: "error",
        icon: markRaw(Warning),
        confirmButtonText: t("main.opt.ok"),
        cancelButtonText: t("main.opt.cancel"),
      }
    )
      .then(async () => {
        emit("emitSyncAiSwitch", formData.useAi)
        ElMessage.success("人工智能服务[内测版]已开启，目前可智能生成摘要和标签，感谢您的支持！")
      })
      .catch(() => {
        formData.useAi = false
        emit("emitSyncAiSwitch", formData.useAi)
      })
  } else {
    ElMessageBox.confirm(`人工智能服务关闭之后将使用基础功能，是否继续？`, "温馨提示", {
      type: "error",
      icon: markRaw(Warning),
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
    })
      .then(async () => {
        emit("emitSyncAiSwitch", formData.useAi)
        ElMessage.warning("人工智能服务[内测版]已关闭，将使用基础功能！")
      })
      .catch(() => {})
  }
}
</script>

<template>
  <div class="ai-switch">
    <el-form-item label="使用人工智能">
      <el-switch v-model="formData.useAi" @change="onAiSwitchChange"></el-switch>
    </el-form-item>
  </div>
</template>

<style scoped lang="stylus"></style>
