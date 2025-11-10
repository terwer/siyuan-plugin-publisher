<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { reactive } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { Post } from "zhi-blog-api"
import { DateUtil } from "zhi-common"

const { t } = useVueI18n()

const props = defineProps({
  modelValue: {
    type: Object,
    default: {} as Post,
  },
})

const formData = reactive({
  dateCreatedString: DateUtil.formatIsoToZh(props.modelValue?.dateCreated?.toISOString(), true),
  dateUpdatedString: DateUtil.formatIsoToZh((props.modelValue?.dateUpdated ?? new Date()).toISOString(), true),
})

const emit = defineEmits(["emitSyncPublishTime"])

const handleDateChange = () => {
  const dt1 = DateUtil.convertStringToDate(formData.dateCreatedString)
  const dt2 = DateUtil.convertStringToDate(formData.dateUpdatedString)
  emit("emitSyncPublishTime", dt1, dt2)
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
        @change="handleDateChange"
      />
    </el-form-item>
    <el-form-item :label="t('main.update.time')">
      <el-date-picker
        v-model="formData.dateUpdatedString"
        :placeholder="t('main.update.time.placeholder')"
        format="YYYY-MM-DD HH:mm:ss"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        @change="handleDateChange"
      />
    </el-form-item>
  </div>
</template>

<style scoped lang="stylus"></style>
