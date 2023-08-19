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
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { nextTick, reactive, ref, watch } from "vue"
import { ElMessage } from "element-plus"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { SmartUtil, StrUtil } from "zhi-common"

const logger = createAppLogger("publish-tags")
const { t } = useVueI18n()

const props = defineProps({
  useAi: {
    type: Boolean,
    default: false,
  },
  pageId: {
    type: String,
    default: "",
  },
  tags: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
})

// datas
const tagRefInput = ref()
const formData = reactive({
  isTagLoading: false,
  useAi: props.useAi,
  pageId: props.pageId,
  tag: {
    inputValue: "",
    dynamicTags: <string[]>(StrUtil.isEmptyString(props.tags) ? [] : props.tags.split(",")),
    inputVisible: false,
  },
  html: props.content,
})

watch(
  () => props.useAi,
  (newValue) => {
    formData.useAi = newValue
  }
)

const emit = defineEmits(["emitSyncTags"])

const tagMethods = {
  handleTagClose: (tag: any) => {
    formData.tag.dynamicTags.splice(formData.tag.dynamicTags.indexOf(tag), 1)

    emit("emitSyncTags", formData.tag.dynamicTags)
  },
  tagShowInput: () => {
    formData.tag.inputVisible = true
    nextTick(() => {
      tagRefInput.value!.input!.focus()
    })
  },
  handleTagInputConfirm: () => {
    if (formData.tag.inputValue) {
      formData.tag.dynamicTags.push(formData.tag.inputValue)

      emit("emitSyncTags", formData.tag.dynamicTags)
    }
    formData.tag.inputVisible = false
    formData.tag.inputValue = ""
  },
  fetchTag: async () => {
    try {
      formData.isTagLoading = true

      const hotTags = await SmartUtil.autoTags(formData.html, 5)
      for (let i = 0; i < hotTags.length; i++) {
        if (!formData.tag.dynamicTags.includes(hotTags[i])) {
          formData.tag.dynamicTags.push(hotTags[i])
        }
      }
      emit("emitSyncTags", formData.tag.dynamicTags)

      ElMessage.success("使用人工智能智能提取标签成功")
    } catch (e: any) {
      logger.error(t("main.opt.failure") + "=>", e)
      ElMessage.error(t("main.opt.failure") + "=>" + e)
    }

    formData.isTagLoading = false
  },
}
</script>

<template>
  <div class="form-tags">
    <el-form-item :label="t('main.tag')">
      <el-tag
        v-for="tag in formData.tag.dynamicTags"
        :key="tag"
        :disable-transitions="false"
        class="mx-1 pub-tag"
        closable
        @close="tagMethods.handleTagClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        v-if="formData.tag.inputVisible"
        ref="tagRefInput"
        v-model="formData.tag.inputValue"
        class="ml-1 w-20 pub-tag-input"
        size="small"
        @blur="tagMethods.handleTagInputConfirm"
        @keyup.enter="tagMethods.handleTagInputConfirm"
      />
      <el-button v-else class="button-new-tag ml-1 el-tag" size="small" @click="tagMethods.tagShowInput">
        {{ t("main.tag.new") }}
      </el-button>
    </el-form-item>
    <el-form-item v-if="formData.useAi">
      <el-button size="small" :loading="formData.isTagLoading" type="primary" @click="tagMethods.fetchTag">
        {{ formData.isTagLoading ? t("main.opt.loading") : t("main.auto.fetch.tag") }}
      </el-button>
    </el-form-item>
  </div>
</template>

<style lang="stylus" scoped>
.form-tags
  :deep(.pub-tag)
    margin-right 10px

  :deep(.pub-tag-input)
    max-width 120px
</style>
