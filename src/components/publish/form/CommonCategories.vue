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
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { nextTick, reactive, ref } from "vue"

const logger = createAppLogger("common-categories")
const { t } = useVueI18n()

const props = defineProps({
  cates: {
    type: Array,
    default: [],
  },
})

// datas
const tagRefInput = ref()
const formData = reactive({
  cate: {
    inputValue: "",
    dynamicCates: <string[]>(props.cates.length == 0 ? [] : props.cates),
    inputVisible: false,
  },
})

const emit = defineEmits(["emitSyncCates"])

const cateMethods = {
  handleTagClose: (tag: any) => {
    formData.cate.dynamicCates.splice(formData.cate.dynamicCates.indexOf(tag), 1)

    emit("emitSyncCates", formData.cate.dynamicCates)
  },
  tagShowInput: () => {
    formData.cate.inputVisible = true
    nextTick(() => {
      tagRefInput.value!.input!.focus()
    })
  },
  handleTagInputConfirm: () => {
    if (formData.cate.inputValue) {
      formData.cate.dynamicCates.push(formData.cate.inputValue)

      emit("emitSyncCates", formData.cate.dynamicCates)
    }
    formData.cate.inputVisible = false
    formData.cate.inputValue = ""
  },
}
</script>

<template>
  <div class="form-tag-cates">
    <el-form-item :label="t('main.commonn.cate.title')">
      <el-tag
        v-for="tag in formData.cate.dynamicCates"
        :key="tag"
        :disable-transitions="false"
        class="mx-1 pub-tag"
        closable
        @close="cateMethods.handleTagClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        v-if="formData.cate.inputVisible"
        ref="tagRefInput"
        v-model="formData.cate.inputValue"
        class="ml-1 w-20 pub-tag-input"
        size="small"
        @blur="cateMethods.handleTagInputConfirm"
        @keyup.enter="cateMethods.handleTagInputConfirm"
      />
      <el-button v-else class="button-new-tag ml-1 el-tag" size="small" @click="cateMethods.tagShowInput">
        {{ t("main.cate.new") }}
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-alert :closable="false" :title="t('category.batch.not.supported')" class="form-item-tip" type="warning" />
    </el-form-item>
    <div class="form-item-bottom"></div>
  </div>
</template>

<style lang="stylus" scoped>
.form-item-tip
  padding 2px 4px
  margin 0 10px 0 0

.form-item-bottom
  margin-bottom 16px

.form-tag-cates
  :deep(.el-form-item)
    margin-bottom 0

  :deep(.pub-tag)
    margin-right 10px

  :deep(.pub-tag-input)
    max-width 120px
</style>
