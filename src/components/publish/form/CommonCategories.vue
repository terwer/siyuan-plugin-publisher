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
import { nextTick, reactive, ref, watch } from "vue"
import { CategoryAIResult, prompt } from "~/src/ai/prompt.ts"
import { useChatGPT } from "~/src/composables/useChatGPT.ts"
import { JsonUtil, StrUtil } from "zhi-common"
import { ElMessage } from "element-plus"

const logger = createAppLogger("common-categories")
const { t } = useVueI18n()

const props = defineProps({
  useAi: {
    type: Boolean,
    default: false,
  },
  cates: {
    type: Array,
    default: [],
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

// datas
const tagRefInput = ref()
const formData = reactive({
  isLoading: false,
  useAi: props.useAi,
  cate: {
    inputValue: "",
    dynamicCates: <string[]>(props.cates.length == 0 ? [] : props.cates),
    inputVisible: false,
  },
  recommCates: <string[]>[],
  md: props.md,
  html: props.html,
})

watch(
  () => props.useAi,
  (newValue) => {
    formData.useAi = newValue
  }
)

watch(
  () => props.html,
  (newValue) => {
    formData.html = newValue
  }
)

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
  fetchCate: async () => {
    try {
      formData.isLoading = true

      const inputWord = prompt.categoryPrompt.content
      const { chat, getChatInput } = useChatGPT()
      const chatText = await chat(inputWord, {
        name: "categories",
        systemMessage: getChatInput(formData?.md, formData.html),
      })
      if (StrUtil.isEmptyString(chatText)) {
        ElMessage.error("请求错误，请在偏好设置配置请求地址和ChatGPT key！")
        return
      }
      const resJson = JsonUtil.safeParse<CategoryAIResult>(chatText, {} as CategoryAIResult)
      if (!resJson?.categories || resJson?.categories.length == 0) {
        throw new Error("文档信息量太少，未能抽取有效信息")
      }
      formData.recommCates = resJson.categories
      logger.info("使用AI智能生成的分类结果 =>", {
        inputWord: inputWord,
        chatText: chatText,
      })
    } catch (e: any) {
      logger.error(t("main.opt.failure") + "=>", e)
      ElMessage.error(t("main.opt.failure") + "=>" + e)
    } finally {
      formData.isLoading = false
    }
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
    <div v-if="formData.useAi">
      <el-form-item v-if="formData.recommCates.length > 0" class="recomm-show">
        推荐的分类：
        <el-tag class="ml-2 recomm-cate" type="success" v-for="rtag in formData.recommCates">{{ rtag }}</el-tag>
      </el-form-item>
      <el-form-item class="cat-action">
        <el-button size="small" :loading="formData.isLoading" type="primary" @click="cateMethods.fetchCate">
          {{ formData.isLoading ? t("main.opt.loading") : t("main.auto.fetch.cate") }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-alert :closable="false" :title="t('category.ai.hand')" class="form-item-tip" type="warning" />
      </el-form-item>
    </div>
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

.cat-action
  margin-top 10px
.recomm-show
  margin-top 10px

.recomm-cate
  margin 0 10px
</style>