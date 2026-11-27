<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { reactive, watch } from "vue"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { Post } from "zhi-blog-api"
import { DateUtil } from "zhi-common"
import { formatLocalDateTime } from "~/src/utils/dateUtils.ts"

const { t } = useAppI18n()

const props = defineProps({
  modelValue: {
    type: Object,
    default: {} as Post,
  },
})

const formatForPicker = (date?: Date) => (date ? formatLocalDateTime(date) : "")

const formData = reactive({
  dateCreatedString: formatForPicker(props.modelValue?.dateCreated),
  dateUpdatedString: formatLocalDateTime(props.modelValue?.dateUpdated ?? new Date()),
})

const emit = defineEmits(["emitSyncPublishTime"])

// 切换平台或重新打开表单时，父级会替换 modelValue；把最新时间同步到选择器。
watch(
  () => [props.modelValue?.dateCreated, props.modelValue?.dateUpdated] as const,
  ([dateCreated, dateUpdated]) => {
    const createdString = formatForPicker(dateCreated)
    const updatedString = formatLocalDateTime(dateUpdated ?? new Date())
    if (createdString !== formData.dateCreatedString) {
      formData.dateCreatedString = createdString
    }
    if (updatedString !== formData.dateUpdatedString) {
      formData.dateUpdatedString = updatedString
    }
  }
)

const emitTime = (changedField: "created" | "updated") => {
  const dt1 = DateUtil.convertStringToDate(formData.dateCreatedString)
  const dt2 = DateUtil.convertStringToDate(formData.dateUpdatedString)
  emit("emitSyncPublishTime", dt1, dt2, changedField)
}
</script>

<template>
  <div class="form-publish-time">
    <el-form-item :label="t('main.create.time')">
      <el-date-picker
        v-model="formData.dateCreatedString"
        :placeholder="t('main.create.time.placeholder')"
        format="YYYY-MM-DD HH:mm:ss"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        @change="emitTime('created')"
      />
    </el-form-item>
    <el-form-item :label="t('main.update.time')">
      <el-date-picker
        v-model="formData.dateUpdatedString"
        :placeholder="t('main.update.time.placeholder')"
        format="YYYY-MM-DD HH:mm:ss"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        @change="emitTime('updated')"
      />
    </el-form-item>
  </div>
</template>

<style scoped lang="stylus"></style>
