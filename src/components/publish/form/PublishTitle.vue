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
import { watch } from "vue"

const { t } = useVueI18n()

const props = defineProps({
  useAi: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: "",
  },
  md: {
    type: String,
    default: "",
  },
  html: {
    type: String,
    default: "",
  },
})

const TITLE_AI_PROPMTS = ""
const formData = reactive({
  postTitle: props.modelValue,
  isLoading: false,
  useAi: props.useAi,
})

watch(
  () => props.useAi,
  (newValue) => {
    formData.useAi = newValue
  }
)

const emit = defineEmits(["emitSyncPublishTitle"])

const handleTitleChange = () => {
  emit("emitSyncPublishTitle", formData.postTitle)
}

const handleMakeTitle = () => {}
</script>

<template>
  <div class="form-post-title" v-if="formData.useAi">
    <el-form-item :label="t('main.title')">
      <el-input v-model="formData.postTitle" @input="handleTitleChange" />
    </el-form-item>
    <el-form-item>
      <el-button size="small" :loading="formData.isLoading" type="primary" @click="handleMakeTitle">
        {{ formData.isLoading ? t("main.opt.loading") : t("main.auto.fetch.title") }}
      </el-button>
    </el-form-item>
  </div>
</template>

<style scoped lang="stylus"></style>
