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
import { reactive, watch } from "vue"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { ElMessage } from "element-plus"
import { JsonUtil, StrUtil } from "zhi-common"
import { prompt, ShortDescAIResult } from "~/src/ai/prompt.ts"
import { useChatGPT } from "~/src/composables/useChatGPT.ts"

const logger = createAppLogger("publish-description")
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
  desc: {
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

const MAX_PREVIEW_LENGTH = 255
const formData = reactive({
  isDescLoading: false,
  useAi: props.useAi,
  pageId: props.pageId,
  desc: props.desc,
  md: props.md,
  html: props.html,
})

// 对于未强制刷新组件的情况下需要watch或者computed
watch(
  () => props.useAi,
  (newValue) => {
    formData.useAi = newValue
  }
)

// watch(
//   () => props.md,
//   (newValue) => {
//     formData.md = newValue
//   }
// )

watch(
  () => props.html,
  (newValue) => {
    formData.html = newValue
  }
)

const emit = defineEmits(["emitSyncDesc"])

const handleMakeDesc = async () => {
  formData.isDescLoading = true
  try {
    // if (formData.useAi) {
    const inputWord = prompt.shortDescPrompt.content
    const { chat, getChatInput } = useChatGPT()
    const chatText = await chat(inputWord, {
      name: "desc",
      systemMessage: getChatInput(formData?.md, formData.html),
    })
    if (StrUtil.isEmptyString(chatText)) {
      ElMessage.error("请求错误，请在偏好设置配置请求地址和ChatGPT key！")
      return
    }
    const resJson = JsonUtil.safeParse<ShortDescAIResult>(chatText, {} as ShortDescAIResult)
    if (StrUtil.isEmptyString(resJson?.desc)) {
      throw new Error("文档信息量太少，未能抽取有效信息")
    }
    formData.desc = resJson.desc
    logger.info("使用AI智能生成的摘要结果 =>", {
      inputWord: inputWord,
      chatText: chatText,
    })

    // 自部署无监督摘要
    // if (StrUtil.isEmptyString(formData.html)) {
    //   throw new Error("正文为空，无法生成摘要")
    // }
    // logger.debug("使用人工智能提取摘要", { q: formData.html })
    // const result = await SmartUtil.autoSummary(formData.html)
    // logger.debug("auto summary reault =>", result)
    // if (!StrUtil.isEmptyString(result.errMsg)) {
    //   throw new Error(result.errMsg)
    // } else {
    //   formData.desc = result.result
    // }
    // } else {
    //   formData.desc = HtmlUtil.parseHtml(formData.html, MAX_PREVIEW_LENGTH, true)
    //   ElMessage.success(`操作成功，未开启人工智能，直接截取文章前${MAX_PREVIEW_LENGTH}个字符作为摘要`)
    // }
    emit("emitSyncDesc", formData.desc)
    ElMessage.success("使用人工智能提取摘要成功")
  } catch (e) {
    logger.error(t("main.opt.failure") + "=>", e)
    ElMessage.error(t("main.opt.failure") + "=>" + e)
  } finally {
    formData.isDescLoading = false
  }
}

const onDescChange = () => {
  emit("emitSyncDesc", formData.desc)
}
</script>

<template>
  <div class="form-desc">
    <el-form-item :label="t('main.desc')">
      <el-input
        v-model="formData.desc"
        :autosize="{ minRows: 3, maxRows: 16 }"
        type="textarea"
        placeholder="请输入文章摘要"
        @input="onDescChange"
      />
    </el-form-item>
    <el-form-item v-if="formData.useAi">
      <el-button size="small" :loading="formData.isDescLoading" type="primary" @click="handleMakeDesc">
        {{ formData.isDescLoading ? t("main.opt.loading") : t("main.auto.fetch.desc") }}
      </el-button>
    </el-form-item>
  </div>
</template>

<style scoped lang="stylus"></style>
