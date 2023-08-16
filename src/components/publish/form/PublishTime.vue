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
