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
import { onMounted, reactive, ref } from "vue"
import { ElMessage } from "element-plus"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { StrUtil } from "zhi-common"
import { useChatGPT } from "~/src/composables/useChatGPT.ts"
import { getWidgetId } from "~/src/utils/widgetUtils.ts"
import { useRoute } from "vue-router"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { Post } from "zhi-blog-api"

const logger = createAppLogger("chatgpt-test")

// uses
const { t } = useVueI18n()
const { query } = useRoute()
const { blogApi } = useSiyuanApi()

// datas
const id = (query.id ?? getWidgetId()) as string
const inputText = ref("")
const chatOutput = ref<string>("")
const formData = reactive({
  isLoading: false,
  showPage: !StrUtil.isEmptyString(id),
  usePage: false,
  siyuanPost: {} as Post,
})

const sendMessage = async () => {
  if (inputText.value.trim() === "") {
    ElMessage.error("请输入文本")
    return
  }

  formData.isLoading = true

  try {
    const { chat } = useChatGPT()
    let inputWord = inputText.value
    if (formData.usePage) {
      if (!StrUtil.isEmptyString(formData.siyuanPost.markdown)) {
        inputWord = `${formData.siyuanPost.markdown}\n${inputWord}`
        logger.info("使用当前文档作为上下文")
      }
    }
    const chatText = await chat(inputWord)
    if (StrUtil.isEmptyString(chatText)) {
      ElMessage.error("请求错误，请在偏好设置配置请求地址和ChatGPT key！")
      return
    }

    chatOutput.value += `> ${inputText.value}\n${chatText}\n\n`
    inputText.value = ""
  } catch (e) {
    logger.error(t("main.opt.failure") + "=>", e)
    ElMessage.error(t("main.opt.failure") + "=>" + e)
  } finally {
    formData.isLoading = false
  }
}

const clearChatOutput = () => {
  chatOutput.value = ""
}

onMounted(async () => {
  if (formData.showPage) {
    const siyuanPost = await blogApi.getPost(id)
    formData.siyuanPost = siyuanPost
  }
})
</script>

<template>
  <back-page title="AI聊天">
    <el-alert
      v-if="formData.usePage && formData.showPage && !StrUtil.isEmptyString(formData.siyuanPost.markdown)"
      :closable="false"
      :title="`当前为上下文模式，文档上下文为《${formData.siyuanPost.title}》`"
      class="top-tip"
      type="success"
    />
    <el-alert v-else :closable="false" :title="`当前为自由聊天模式`" class="top-tip" type="info" />
    <el-form class="chatgpt-form">
      <el-form-item>
        <el-input
          v-model="inputText"
          :autosize="{ minRows: 4, maxRows: 16 }"
          type="textarea"
          class="chat-input"
          placeholder="请输入文本..."
        />
      </el-form-item>
      <el-form-item>
        <div v-if="formData.showPage && !StrUtil.isEmptyString(formData.siyuanPost.markdown)">
          <el-switch v-model="formData.usePage" class="use-context" /> &nbsp; 使用当前文档作为上下文
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sendMessage" :loading="formData.isLoading">发送消息</el-button>
        <el-button type="danger" @click="clearChatOutput">清屏</el-button>
      </el-form-item>
      <el-form-item>
        <div class="chat-output">
          <pre>{{ chatOutput }}</pre>
        </div>
      </el-form-item>
    </el-form>
  </back-page>
</template>

<style scoped lang="stylus">
.top-tip
  margin 10px 0
  padding-left 0
.chatgpt-form
  margin-top 20px
.use-context
  margin-left 10px
</style>
