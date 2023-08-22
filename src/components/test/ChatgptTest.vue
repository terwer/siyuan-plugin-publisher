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
import { reactive, ref } from "vue"
import { useChatGPT } from "~/src/composables/useChatGPT.ts"
import { ElMessage } from "element-plus"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { StrUtil } from "zhi-common"

const logger = createAppLogger("chatgpt-test")

// uses
const { t } = useVueI18n()
const { chat } = useChatGPT()

// datas
const inputText = ref("")
const chatOutput = ref<string>("")
const formData = reactive({
  isLoading: false,
})

const sendMessage = async () => {
  if (inputText.value.trim() === "") {
    ElMessage.error("请输入文本")
    return
  }

  formData.isLoading = true
  try {
    const chatText = await chat(inputText.value)
    if (StrUtil.isEmptyString(chatText)) {
      ElMessage.error("请求错误，请在底部偏好设置修改请求地址和ChatGPT key！")
      return
    }

    chatOutput.value += `> ${inputText.value}\n${chatText}\n\n`
    inputText.value = ""
  } catch (e) {
    logger.error(t("main.opt.failure") + "=>", e)
    ElMessage.error(t("main.opt.failure") + "=>", e)
  } finally {
    formData.isLoading = false
  }
}

const clearChatOutput = () => {
  chatOutput.value = ""
}
</script>

<template>
  <back-page title="AI聊天">
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
.chatgpt-form
  margin-top 20px
</style>
