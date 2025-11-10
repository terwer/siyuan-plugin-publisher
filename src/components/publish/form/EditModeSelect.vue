<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { PageEditMode } from "zhi-blog-api"
import { reactive, watch } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"

const { t } = useVueI18n()

const props = defineProps({
  editType: {
    type: Number,
    default: PageEditMode.EditMode_simple,
  },
})

const formData = reactive({
  etype: props.editType,
})

watch(
  () => props.editType,
  (newValue) => {
    formData.etype = newValue
  }
)

const emit = defineEmits(["emitSyncEditMode"])

// methods
const onEditModeChange = (val: PageEditMode) => {
  formData.etype = val
  emit("emitSyncEditMode", val)
}
</script>

<template>
  <!-- 编辑模式 -->
  <div class="form-edit-mode">
    <el-form-item :label="t('main.publish.editmode')">
      <el-button-group>
        <el-button
          :type="formData.etype === PageEditMode.EditMode_simple ? 'primary' : 'default'"
          @click="onEditModeChange(PageEditMode.EditMode_simple)"
          >{{ t("main.publish.editmode.simple") }}
        </el-button>
        <el-button
          :type="formData.etype === PageEditMode.EditMode_complex ? 'primary' : 'default'"
          @click="onEditModeChange(PageEditMode.EditMode_complex)"
          >{{ t("main.publish.editmode.complex") }}
        </el-button>
        <el-button
          :type="formData.etype === PageEditMode.EditMode_source ? 'primary' : 'default'"
          @click="onEditModeChange(PageEditMode.EditMode_source)"
          >{{ t("main.publish.editmode.source") }}
        </el-button>
      </el-button-group>
    </el-form-item>
  </div>
</template>

<style scoped lang="stylus"></style>
