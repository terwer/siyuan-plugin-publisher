<template>
  <back-page title="AI聊天">
    <!-- Prompt 管理 -->
    <el-card class="prompt-management" v-show="formData.showPromptManagement">
      <div class="prompt-actions">
        <!-- 新增 Prompt 按钮 -->
        <el-button type="primary" @click="toggleNewPrompt">新增 Prompt</el-button>
      </div>

      <!-- 新增 Prompt 输入框 -->
      <el-form v-if="formData.showNewPromptInput" class="new-prompt-form">
        <el-form-item>
          <el-input
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            v-model="formData.newPrompt.value"
            placeholder="输入新的 Prompt，注意：假如 prompt 包含 「当前上下文」 这个文本，会自动使用当前文档正文作为上下文进行提问"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addPrompt" class="save-button">保存</el-button>
        </el-form-item>
      </el-form>

      <!-- Prompt 列表 -->
      <el-table v-if="formData.prompts.length" :data="formData.prompts" border style="width: 100%" class="prompt-table">
        <el-table-column label="Prompt 内容" prop="value" align="left">
          <template #default="scope">
            <el-input
              v-if="formData.editingIndex === scope.$index"
              v-model="scope.row.value"
              placeholder="编辑 Prompt"
              :disabled="scope.row.isSys"
            />
            <span v-else>{{ scope.row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template #default="scope">
            <el-button
              v-if="!scope.row.isSys && formData.editingIndex !== scope.$index"
              size="small"
              type="primary"
              @click="editPrompt(scope.$index)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="updatePrompt(scope.$index, scope.row.value)"
              v-if="formData.editingIndex === scope.$index"
            >
              保存
            </el-button>
            <el-button size="small" type="danger" @click="deletePrompt(scope.$index)" v-if="!scope.row.isSys">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 聊天功能 -->
    <el-form class="chatgpt-form">
      <el-form-item>
        <el-input
          v-model="formData.inputText"
          :autosize="{ minRows: 4, maxRows: 16 }"
          type="textarea"
          class="chat-input"
          placeholder="请输入文本..."
        />
      </el-form-item>
      <el-form-item>
        <div v-if="formData.showPage && formData.siyuanPost.markdown">
          <el-switch v-model="formData.usePage" class="use-context" /> &nbsp; 使用当前文档作为上下文
        </div>
      </el-form-item>
      <!-- Prompt 选择 -->
      <el-form-item>
        <el-select
          v-model="formData.selectedPrompt"
          v-if="formData.prompts.length"
          placeholder="选择一个 Prompt"
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
        <el-button type="primary" @click="sendMessage" :loading="formData.isLoading">发送消息</el-button>
        <el-button type="danger" @click="clearChatOutput">清屏</el-button>
        <el-button type="warning" @click="togglePromptManagement">显示/隐藏 Prompt 管理</el-button>
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

const logger = createAppLogger("chatgpt-ai")

// uses
const { t } = useVueI18n()
const { query } = useRoute()
const { blogApi } = useSiyuanApi()

// datas
const id = (query.id ?? getWidgetId()) as string
const CURRENT_CONTEXT = "当前上下文"
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
  usePage: false,
  siyuanPost: {} as Post,
})

// 切换新增 Prompt 输入框
const toggleNewPrompt = () => {
  formData.showNewPromptInput = !formData.showNewPromptInput
}

// 添加新 Prompt
const addPrompt = () => {
  if (!formData.newPrompt.value.trim()) {
    ElMessage.error("Prompt 不能为空")
    return
  }

  formData.newPrompt.key = uuidv4()
  formData.prompts.push({ ...formData.newPrompt, isSys: false })
  localStorage.setItem("prompts", JSON.stringify(formData.prompts))

  formData.newPrompt = { key: "", value: "" }
  formData.showNewPromptInput = false
  formData.showPromptManagement = false
  ElMessage.success("Prompt 已添加")
}

// 删除 Prompt
const deletePrompt = (index: number) => {
  formData.prompts.splice(index, 1)
  localStorage.setItem("prompts", JSON.stringify(formData.prompts))
  ElMessage.success("Prompt 已删除")
}

// 编辑 Prompt
const editPrompt = (index: number) => {
  formData.editingIndex = index
}

// 更新 Prompt
const updatePrompt = (index: number, newValue: string) => {
  if (!newValue.trim()) {
    ElMessage.error("Prompt 不能为空")
    return
  }

  formData.prompts[index].value = newValue
  localStorage.setItem("prompts", JSON.stringify(formData.prompts))
  formData.editingIndex = -1
  ElMessage.success("Prompt 已更新")
}

// 将 Prompt 插入到聊天输入框
const insertPromptToChat = (prompt: string) => {
  if (!prompt) return
  if (prompt.includes(CURRENT_CONTEXT)) {
    formData.usePage = true
  }
  formData.inputText = `${formData.inputText.trim()}\n${prompt}`.trim()
  // ElMessage.info(`已插入 Prompt：${prompt}`)
}

// 发送聊天消息
const sendMessage = async () => {
  if (formData.inputText.trim() === "") {
    ElMessage.error("请输入文本")
    return
  }

  formData.isLoading = true

  try {
    const { chat } = useChatGPT()
    const inputWord =
      formData.usePage && formData.siyuanPost.markdown
        ? `${formData.siyuanPost.markdown}\n${formData.inputText}`
        : formData.inputText

    const chatText = await chat(inputWord)
    if (StrUtil.isEmptyString(chatText)) {
      ElMessage.error("请求错误，请在偏好设置配置请求地址和 ChatGPT key！")
      return
    }

    formData.chatOutput += `> ${formData.inputText}\n${chatText}\n\n`
    formData.inputText = ""
  } catch (e) {
    logger.error("发送消息失败", e)
    ElMessage.error("发送消息失败：" + e)
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
