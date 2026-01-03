<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <back-page :title="t('ai.chat.title')">
    <!-- Prompt 管理 -->
    <el-card class="prompt-management" v-show="formData.showPromptManagement">
      <div class="prompt-actions">
        <!-- 新增 Prompt 按钮 -->
        <el-button type="primary" @click="toggleNewPrompt">{{ t("ai.chat.add.prompt") }}</el-button>
      </div>

      <!-- 新增 Prompt 输入框 -->
      <el-form v-if="formData.showNewPromptInput" class="new-prompt-form">
        <el-form-item>
          <el-input
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            v-model="formData.newPrompt.value"
            :placeholder="t('ai.chat.new.prompt.placeholder')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addPrompt" class="save-button">{{ t("ai.chat.save") }}</el-button>
        </el-form-item>
      </el-form>

      <!-- Prompt 列表 -->
      <el-table v-if="formData.prompts.length" :data="formData.prompts" border style="width: 100%" class="prompt-table">
        <el-table-column :label="t('ai.chat.prompt.content')" prop="value" align="left">
          <template #default="scope">
            <el-input
              v-if="formData.editingIndex === scope.$index"
              v-model="scope.row.value"
              :placeholder="t('ai.chat.edit.prompt.placeholder')"
              :disabled="scope.row.isSys"
            />
            <span v-else>{{ scope.row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('ai.chat.action')" align="center" width="160">
          <template #default="scope">
            <el-button
              v-if="!scope.row.isSys && formData.editingIndex !== scope.$index"
              size="small"
              type="primary"
              @click="editPrompt(scope.$index)"
            >
              {{ t("ai.chat.edit") }}
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="updatePrompt(scope.$index, scope.row.value)"
              v-if="formData.editingIndex === scope.$index"
            >
              {{ t("ai.chat.save") }}
            </el-button>
            <el-button size="small" type="danger" @click="deletePrompt(scope.$index)" v-if="!scope.row.isSys">
              {{ t("ai.chat.delete") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 聊天功能 -->
    <el-alert
      v-if="formData.usePage && formData.showPage && !StrUtil.isEmptyString(formData.siyuanPost.markdown)"
      :closable="false"
      :title="t('ai.chat.context.mode').replace('{title}', formData.siyuanPost.title)"
      class="top-tip"
      type="success"
    />
    <el-alert v-else :closable="false" :title="t('ai.chat.free.mode')" class="top-tip" type="info" />
    <el-form class="chatgpt-form">
      <el-form-item>
        <el-input
          v-model="formData.inputText"
          :autosize="{ minRows: 4, maxRows: 16 }"
          type="textarea"
          class="chat-input"
          :placeholder="t('ai.chat.input.placeholder')"
        />
      </el-form-item>
      <el-form-item>
        <div v-if="formData.showPage && formData.siyuanPost.markdown">
          <el-switch v-model="formData.usePage" class="use-context" /> &nbsp; {{ t("ai.chat.use.context") }}
        </div>
      </el-form-item>
      <!-- Prompt 选择 -->
      <el-form-item>
        <el-select
          v-model="formData.selectedPrompt"
          v-if="formData.prompts.length"
          :placeholder="t('ai.chat.select.prompt')"
          @change="insertPromptToChat"
          class="props-select"
        >
          <el-option
            v-for="prompt in formData.prompts"
            :key="prompt.key"
            :label="prompt.value"
            :value="prompt.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sendMessage" :loading="formData.isLoading">{{ t("ai.chat.send.message") }}</el-button>
        <el-button type="danger" @click="clearChatOutput">{{ t("ai.chat.clear") }}</el-button>
        <el-button type="warning" @click="togglePromptManagement">{{ t("ai.chat.toggle.prompt.management") }}</el-button>
      </el-form-item>
      <el-form-item>
        <div class="chat-output">
          <pre>{{ formData.chatOutput }}</pre>
        </div>
      </el-form-item>
    </el-form>
  </back-page>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue"
import { ElMessage } from "element-plus"
import { useChatGPT } from "~/src/composables/useChatGPT.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { StrUtil } from "zhi-common"
import { v4 as uuidv4 } from "uuid"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useRoute } from "vue-router"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { getWidgetId } from "~/src/utils/widgetUtils.ts"
import { Post } from "zhi-blog-api"

const logger = createAppLogger("chatgpt-ai")

// uses
const { t } = useVueI18n()
const { query } = useRoute()
const { blogApi } = useSiyuanApi()

// datas
const id = (query.id ?? getWidgetId()) as string
// 数据统一存储到 formData
const formData = reactive({
  prompts: (() => {
    const storedPrompts = JSON.parse(localStorage.getItem("prompts") || "[]")
    const predefinedPrompts = [
      {
        key: "sys-1",
        value: "请为当前上下文打标签。要求抽取5个关键词，每个关键词不能超过5个字符，关键词之间用逗号隔开",
        isSys: false,
      },
      { key: "sys-2", value: "请生成当前上下文的摘要。要求不超过255个字", isSys: false },
      {
        key: "sys-3",
        value: "请对当前上下文进行智能分类。要求抽取5个分类。每个分类不能超过5个字符",
        isSys: false,
      },
      { key: "sys-4", value: "帮忙写一篇舔狗日记。要求100字以内", isSys: false },
    ]

    const prompts = [...storedPrompts]
    predefinedPrompts.forEach((prePrompt) => {
      if (!prompts.some((p) => p.key === prePrompt.key)) {
        prompts.push(prePrompt)
      }
    })

    return prompts
  })(),
  newPrompt: { key: "", value: "" },
  showNewPromptInput: false,
  showPromptManagement: false,
  editingIndex: -1,
  selectedPrompt: "",
  inputText: "",
  chatOutput: "",
  isLoading: false,
  showPage: !StrUtil.isEmptyString(id),
  usePage: !StrUtil.isEmptyString(id),
  siyuanPost: {} as Post,
})

// 切换新增 Prompt 输入框
const toggleNewPrompt = () => {
  formData.showNewPromptInput = !formData.showNewPromptInput
}

// 添加新 Prompt
const addPrompt = () => {
  if (!formData.newPrompt.value.trim()) {
    ElMessage.error(t("ai.chat.prompt.empty"))
    return
  }

  formData.newPrompt.key = uuidv4()
  formData.prompts.push({ ...formData.newPrompt, isSys: false })
  localStorage.setItem("prompts", JSON.stringify(formData.prompts))

  formData.newPrompt = { key: "", value: "" }
  formData.showNewPromptInput = false
  formData.showPromptManagement = false
  ElMessage.success(t("ai.chat.prompt.added"))
}

// 删除 Prompt
const deletePrompt = (index: number) => {
  formData.prompts.splice(index, 1)
  localStorage.setItem("prompts", JSON.stringify(formData.prompts))
  ElMessage.success(t("ai.chat.prompt.deleted"))
}

// 编辑 Prompt
const editPrompt = (index: number) => {
  formData.editingIndex = index
}

// 更新 Prompt
const updatePrompt = (index: number, newValue: string) => {
  if (!newValue.trim()) {
    ElMessage.error(t("ai.chat.prompt.empty"))
    return
  }

  formData.prompts[index].value = newValue
  localStorage.setItem("prompts", JSON.stringify(formData.prompts))
  formData.editingIndex = -1
  ElMessage.success(t("ai.chat.prompt.updated"))
}

// 将 Prompt 插入到聊天输入框
const insertPromptToChat = (prompt: string) => {
  if (!prompt) return
  const currentContext = t("ai.chat.current.context")
  if (prompt.includes(currentContext)) {
    formData.usePage = true
  } else {
    formData.usePage = false
  }
  formData.inputText = prompt
  // ElMessage.info(`已插入 Prompt：${prompt}`)
}

// 发送聊天消息
const sendMessage = async () => {
  if (formData.inputText.trim() === "") {
    ElMessage.error(t("ai.chat.input.empty"))
    return
  }

  formData.isLoading = true

  try {
    const { chat, getChatInput } = useChatGPT()
    const inputWord = formData.inputText

    let chatText = ""
    if (formData.usePage) {
      chatText = await chat(inputWord, {
        name: "system",
        systemMessage: getChatInput(formData.siyuanPost.markdown, formData.siyuanPost.html),
      })
    } else {
      chatText = await chat(inputWord)
    }

    if (StrUtil.isEmptyString(chatText)) {
      ElMessage.error(t("ai.chat.error.config"))
      return
    }

    formData.chatOutput = `> ${formData.inputText}\n${chatText}\n\n` + formData.chatOutput
  } catch (e) {
    logger.error("发送消息失败", e)
    ElMessage.error(t("ai.chat.error.send.failed") + e)
  } finally {
    formData.isLoading = false
  }
}

// 清屏
const clearChatOutput = () => {
  formData.inputText = ""
  formData.chatOutput = ""
}

// 切换 Prompt 管理显示/隐藏
const togglePromptManagement = () => {
  formData.showPromptManagement = !formData.showPromptManagement
}

onMounted(async () => {
  if (formData.showPage) {
    const siyuanPost = await blogApi.getPost(id)
    formData.siyuanPost = siyuanPost
  }
})
</script>

<style scoped lang="stylus">
.prompt-management
  margin-top 20px

  .prompt-table
    margin-top 10px

.new-prompt-form
  margin-top 10px
  align-items center

  .save-button
    margin-left 10px

.chatgpt-form
  margin-top 20px

.use-context
  margin-left 10px
</style>
