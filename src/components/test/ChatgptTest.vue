<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
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
    const { chat } = useChatGPT()
    const chatText = await chat(inputText.value)
    if (StrUtil.isEmptyString(chatText)) {
      ElMessage.error("请求错误，请在底部偏好设置修改请求地址和ChatGPT key！")
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
