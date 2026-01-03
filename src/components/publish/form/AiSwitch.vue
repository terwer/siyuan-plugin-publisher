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
      t("publish.ai.beta.warning"),
      t("main.opt.tip"),
      {
        type: "error",
        icon: markRaw(Warning),
        confirmButtonText: t("main.opt.ok"),
        cancelButtonText: t("main.opt.cancel"),
      }
    )
      .then(async () => {
        emit("emitSyncAiSwitch", formData.useAi)
        ElMessage.success(t("publish.ai.beta.enabled"))
      })
      .catch(() => {
        formData.useAi = false
        emit("emitSyncAiSwitch", formData.useAi)
      })
  } else {
    ElMessageBox.confirm(t("publish.ai.beta.close.confirm"), t("main.opt.tip"), {
      type: "error",
      icon: markRaw(Warning),
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
    })
      .then(async () => {
        emit("emitSyncAiSwitch", formData.useAi)
        ElMessage.warning(t("publish.ai.beta.disabled"))
      })
      .catch(() => {})
  }
}
</script>

<template>
  <div class="ai-switch">
    <el-form-item :label="t('publish.ai.use.label')">
      <el-switch v-model="formData.useAi" @change="onAiSwitchChange"></el-switch>
    </el-form-item>
  </div>
</template>

<style scoped lang="stylus"></style>
