<!--
  - Copyright (c) 2024, Terwer . All rights reserved.
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
import { Post, PostStatusEnum } from "zhi-blog-api"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { reactive } from "vue"
import { DateUtil } from "zhi-common"

const { t } = useVueI18n()

const props = defineProps({
  modelValue: {
    type: Object,
    default: {} as Post,
  },
})

const formData = reactive({
  status: props.modelValue?.post_status,
  password: props.modelValue?.wp_password,
})

const emit = defineEmits(["emitSyncPublishStatus"])

const handleStatusChange = () => {
  const status = formData.status
  const password = formData.password
  emit("emitSyncPublishStatus", status, password)
}
</script>

<template>
  <div>
    <!-- 发布状态 -->
    <el-form-item :label="t('publisher.post.status')">
      <el-radio-group v-model="formData.status" class="ml-4" @change="handleStatusChange">
        <el-radio :value="PostStatusEnum.PostStatusEnum_Publish" size="large">
          {{ t("publisher.post.status.pubish") }}
        </el-radio>
        <el-radio :value="PostStatusEnum.PostStatusEnum_Draft" size="large">
          {{ t("publisher.post.status.draft") }}
        </el-radio>
        <el-radio :value="PostStatusEnum.PostStatusEnum_Private" size="large">
          {{ t("publisher.post.status.private") }}
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="t('publisher.post.password')">
      <el-input
        type="password"
        v-model="formData.password"
        :placeholder="t('publisher.post.password.tip')"
        @input="handleStatusChange"
      />
    </el-form-item>
  </div>
</template>

<style scoped lang="stylus"></style>
