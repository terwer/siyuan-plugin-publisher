<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <section class="syp-ai-chat" role="region" :aria-label="t('v2.aiChat.ariaLabel')">
    <div class="syp-ai-chat__head">
      <button
        type="button"
        class="syp-ai-chat__back"
        :aria-label="t('v2.aiChat.action.back')"
        @click="emit('back')"
      >
        <LucideChevronLeft />
      </button>
      <div>
        <div class="syp-ai-chat__eyebrow">{{ t("v2.aiChat.eyebrow") }}</div>
        <h2 class="syp-ai-chat__title">{{ t("v2.aiChat.title") }}</h2>
      </div>
    </div>

    <!-- Prompt 管理：默认隐藏，由下方「显示/隐藏 Prompt 管理」切换 -->
    <div v-show="formData.showPromptManagement" class="syp-ai-chat__panel">
      <div class="syp-ai-chat__panel-actions">
        <button type="button" class="syp-btn syp-btn-primary syp-ai-chat__prompt-new-button" @click="toggleNewPrompt">
          {{ t("v2.aiChat.prompt.new") }}
        </button>
      </div>

      <div v-if="formData.showNewPromptInput" class="syp-ai-chat__prompt-form">
        <textarea
          v-model="formData.newPrompt.value"
          class="syp-input syp-ai-chat__prompt-new"
          rows="2"
          :aria-label="t('v2.aiChat.prompt.new')"
          :placeholder="t('v2.aiChat.prompt.newPlaceholder')"
          @input="handleTextareaInput"
        />
        <button type="button" class="syp-btn syp-btn-primary syp-ai-chat__prompt-new-save" @click="addPrompt">
          {{ t("v2.aiChat.prompt.save") }}
        </button>
      </div>

      <table v-if="formData.prompts.length" class="syp-ai-chat__table">
        <thead>
          <tr>
            <th scope="col">{{ t("v2.aiChat.prompt.colContent") }}</th>
            <th scope="col" class="syp-ai-chat__table-actions-col">{{ t("v2.aiChat.prompt.colAction") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(prompt, index) in formData.prompts" :key="prompt.key">
            <td>
              <input
                v-if="formData.editingIndex === index"
                v-model="prompt.value"
                class="syp-input syp-ai-chat__prompt-edit"
                :disabled="isSysPrompt(prompt)"
                :aria-label="t('v2.aiChat.prompt.edit')"
                :placeholder="t('v2.aiChat.prompt.editPlaceholder')"
              />
              <span v-else class="syp-ai-chat__prompt-value">{{ prompt.value }}</span>
            </td>
            <td class="syp-ai-chat__table-actions-col">
              <div class="syp-ai-chat__row-actions">
                <button
                  v-if="!isSysPrompt(prompt) && formData.editingIndex !== index"
                  type="button"
                  class="syp-btn syp-btn-secondary syp-ai-chat__prompt-edit-button"
                  @click="editPrompt(index)"
                >
                  {{ t("v2.aiChat.prompt.edit") }}
                </button>
                <button
                  v-if="formData.editingIndex === index"
                  type="button"
                  class="syp-btn syp-btn-primary syp-ai-chat__prompt-save"
                  @click="updatePrompt(index, prompt.value)"
                >
                  {{ t("v2.aiChat.prompt.save") }}
                </button>
                <button
                  v-if="!isSysPrompt(prompt)"
                  type="button"
                  class="syp-btn syp-btn-text is-danger syp-ai-chat__prompt-delete"
                  @click="deletePrompt(index)"
                >
                  {{ t("v2.aiChat.prompt.delete") }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 当前模式提示：上下文模式（拿到文档正文）或自由聊天模式 -->
    <div class="syp-ai-chat__tip" :class="isContextMode ? 'is-success' : 'is-info'" role="status">
      {{ tipText }}
    </div>

    <div class="syp-ai-chat__form">
      <textarea
        ref="chatInputRef"
        v-model="formData.inputText"
        class="syp-input syp-ai-chat__chat-input"
        rows="4"
        :aria-label="t('v2.aiChat.input.label')"
        :placeholder="t('v2.aiChat.input.placeholder')"
        @input="handleTextareaInput"
      />

      <div v-if="hasDocumentContext" class="syp-ai-chat__context-row">
        <label class="syp-toggle">
          <input
            type="checkbox"
            :checked="formData.usePage"
            :aria-label="t('v2.aiChat.useContext')"
            @change="handleUsePageChange"
          />
          <span class="syp-toggle-slider"></span>
        </label>
        <span class="syp-ai-chat__context-label">{{ t("v2.aiChat.useContext") }}</span>
      </div>

      <div v-if="formData.prompts.length" class="syp-ai-chat__prompt-row">
        <select
          class="syp-input syp-ai-chat__prompt-select"
          :value="formData.selectedPrompt"
          :aria-label="t('v2.aiChat.prompt.selectPlaceholder')"
          @change="onPromptSelect"
        >
          <option value="">{{ t("v2.aiChat.prompt.selectPlaceholder") }}</option>
          <option v-for="prompt in formData.prompts" :key="prompt.key" :value="prompt.value">
            {{ prompt.value }}
          </option>
        </select>
      </div>

      <div class="syp-ai-chat__actions">
        <button
          type="button"
          class="syp-btn syp-btn-primary syp-ai-chat__send"
          :disabled="formData.isLoading"
          :aria-busy="formData.isLoading"
          @click="sendMessage"
        >
          {{ formData.isLoading ? t("v2.aiChat.action.sending") : t("v2.aiChat.action.send") }}
        </button>
        <button type="button" class="syp-btn syp-btn-secondary syp-ai-chat__clear" @click="clearChatOutput">
          {{ t("v2.aiChat.action.clear") }}
        </button>
        <button
          type="button"
          class="syp-btn syp-btn-text syp-ai-chat__prompt-manage"
          :aria-expanded="formData.showPromptManagement"
          @click="togglePromptManagement"
        >
          {{ t("v2.aiChat.action.promptManage") }}
        </button>
      </div>

      <div class="syp-ai-chat__output">
        <pre>{{ formData.chatOutput }}</pre>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue"
import { StrUtil } from "zhi-common"
import type { Post } from "zhi-blog-api"
import { v2MessageError, v2MessageSuccess } from "~/src/composables/v2/v2FloatingUi.ts"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"
import { useChatGPT } from "~/src/composables/useChatGPT.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import sypIdUtil from "~/src/utils/sypIdUtil.ts"
import LucideChevronLeft from "~icons/lucide/chevron-left"

const props = defineProps<{
  /** 当前文档 id，由父组件传入；为空表示自由聊天模式 */
  pageId?: string
}>()

const emit = defineEmits<{
  (event: "back"): void
}>()

interface ChatPrompt {
  key: string
  value: string
  /** 是否系统内置：与 V1 一致，内置项也是 false（可编辑、可删除） */
  isSys: boolean
}

const logger = createAppLogger("v2-ai-chat")

/** localStorage 键名与存储结构沿用 V1，保证老用户已有 Prompt 不丢 */
const PROMPTS_STORAGE_KEY = "prompts"
/** 触发「当前上下文」的文本标记：与 V1 保持一致，用于匹配已存数据 */
const CURRENT_CONTEXT = "当前上下文"

/**
 * 系统内置 Prompt：key 与 V1 一致，老数据按 key 去重合并
 *
 * 文案为持久化数据（会写入 localStorage 并与老数据比对），不随界面语言翻译。
 * `isSys` 与 V1 保持一致（内置项也是 false，因此可编辑、可删除）——
 * V1 的 `v-if="!row.isSys"` 分支从未被内置项命中，此处不改动既有能力。
 */
const SYS_PROMPT_TEMPLATES: ChatPrompt[] = [
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

const { t } = useV2I18n()
const { blogApi } = useSiyuanApi()

const chatInputRef = ref<HTMLTextAreaElement | null>(null)

// 数据统一存储到 formData（结构与 V1 对齐）
const formData = reactive({
  prompts: loadPrompts(),
  newPrompt: { key: "", value: "" },
  showNewPromptInput: false,
  showPromptManagement: false,
  editingIndex: -1,
  selectedPrompt: "",
  inputText: "",
  chatOutput: "",
  isLoading: false,
  showPage: false,
  usePage: false,
  siyuanPost: {} as Post,
})

const hasDocumentContext = computed(() => {
  return formData.showPage && !StrUtil.isEmptyString(formData.siyuanPost.markdown)
})

const isContextMode = computed(() => formData.usePage && hasDocumentContext.value)

const tipText = computed(() => {
  return isContextMode.value
    ? t("v2.aiChat.tip.context", { title: formData.siyuanPost.title })
    : t("v2.aiChat.tip.free")
})

/**
 * 读取 Prompt 列表：先取本地数据，再按 key 补齐系统内置项
 */
function loadPrompts(): ChatPrompt[] {
  let stored: any[] = []
  try {
    const parsed = JSON.parse(localStorage.getItem(PROMPTS_STORAGE_KEY) || "[]")
    stored = Array.isArray(parsed) ? parsed : []
  } catch (e) {
    logger.error("读取本地 Prompt 失败，已回退为内置 Prompt", e)
  }

  const prompts: ChatPrompt[] = stored
    .filter((item) => item && typeof item.key === "string")
    .map((item) => ({
      key: item.key,
      value: item.value === undefined || item.value === null ? "" : String(item.value),
      isSys: item.isSys === true,
    }))

  SYS_PROMPT_TEMPLATES.forEach((template) => {
    if (!prompts.some((item) => item.key === template.key)) {
      prompts.push({ ...template })
    }
  })

  return prompts
}

function isSysPrompt(prompt: ChatPrompt) {
  return prompt.isSys === true
}

function persistPrompts() {
  localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(formData.prompts))
}

/** 原生 textarea 无 autosize：按内容撑高，4~16 行（聊天）/ 2~4 行（Prompt）由 CSS 上下限约束 */
function autosizeTextarea(el: HTMLTextAreaElement | null) {
  if (!el) return
  el.style.height = "auto"
  el.style.height = `${el.scrollHeight}px`
}

function handleTextareaInput(event: Event) {
  autosizeTextarea(event.target as HTMLTextAreaElement | null)
}

function syncChatInputHeight() {
  autosizeTextarea(chatInputRef.value)
}

function handleUsePageChange(event: Event) {
  formData.usePage = (event.target as HTMLInputElement | null)?.checked === true
}

/** 加载当前文档上下文（pageId 为空即自由聊天模式） */
async function syncDocumentContext() {
  const pageId = props.pageId ?? ""
  formData.showPage = !StrUtil.isEmptyString(pageId)
  formData.usePage = formData.showPage
  formData.siyuanPost = {} as Post

  if (!formData.showPage) {
    return
  }

  try {
    formData.siyuanPost = await blogApi.getPost(pageId)
  } catch (e) {
    logger.error("加载文档上下文失败", e)
  }
}

// 切换新增 Prompt 输入框
function toggleNewPrompt() {
  formData.showNewPromptInput = !formData.showNewPromptInput
}

// 添加新 Prompt
function addPrompt() {
  if (!formData.newPrompt.value.trim()) {
    v2MessageError(t("v2.aiChat.message.promptRequired"))
    return
  }

  formData.newPrompt.key = sypIdUtil.newUuid()
  formData.prompts.push({ ...formData.newPrompt, isSys: false })
  persistPrompts()

  formData.newPrompt = { key: "", value: "" }
  formData.showNewPromptInput = false
  formData.showPromptManagement = false
  v2MessageSuccess(t("v2.aiChat.message.promptAdded"))
}

// 删除 Prompt
function deletePrompt(index: number) {
  formData.prompts.splice(index, 1)
  persistPrompts()
  v2MessageSuccess(t("v2.aiChat.message.promptDeleted"))
}

// 编辑 Prompt
function editPrompt(index: number) {
  formData.editingIndex = index
}

// 更新 Prompt
function updatePrompt(index: number, newValue: string) {
  if (!newValue.trim()) {
    v2MessageError(t("v2.aiChat.message.promptRequired"))
    return
  }

  formData.prompts[index].value = newValue
  persistPrompts()
  formData.editingIndex = -1
  v2MessageSuccess(t("v2.aiChat.message.promptUpdated"))
}

// Prompt 下拉选择
function onPromptSelect(event: Event) {
  const value = (event.target as HTMLSelectElement | null)?.value ?? ""
  formData.selectedPrompt = value
  insertPromptToChat(value)
}

// 将 Prompt 插入到聊天输入框
function insertPromptToChat(prompt: string) {
  if (!prompt) return
  formData.usePage = prompt.includes(CURRENT_CONTEXT)
  formData.inputText = prompt
  void nextTick(syncChatInputHeight)
}

// 发送聊天消息
async function sendMessage() {
  if (formData.inputText.trim() === "") {
    v2MessageError(t("v2.aiChat.message.inputRequired"))
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
      v2MessageError(t("v2.aiChat.message.requestFailed"))
      return
    }

    formData.chatOutput = `> ${formData.inputText}\n${chatText}\n\n` + formData.chatOutput
  } catch (e) {
    logger.error("发送消息失败", e)
    v2MessageError(t("v2.aiChat.message.sendFailed", { reason: String(e) }))
  } finally {
    formData.isLoading = false
  }
}

// 清屏
function clearChatOutput() {
  formData.inputText = ""
  formData.chatOutput = ""
  void nextTick(syncChatInputHeight)
}

// 切换 Prompt 管理显示/隐藏
function togglePromptManagement() {
  formData.showPromptManagement = !formData.showPromptManagement
}

onMounted(() => {
  void syncDocumentContext()
})

// 宿主复用同一实例切换文档时，重新加载上下文
watch(
  () => props.pageId ?? "",
  () => {
    void syncDocumentContext()
  }
)
</script>

<style scoped lang="stylus">
@import "../../assets/v2/variables.styl"

.syp-ai-chat
  display flex
  flex-direction column
  gap 10px
  min-width 0
  font-size 12px
  line-height 1.5
  color var(--b3-theme-on-background, $syp-text-primary)

  // 页头与其它 V2 子视图保持一致（自带返回，向父组件抛 back）
  &__head
    display flex
    align-items flex-start
    gap 10px

  &__back
    display inline-flex
    align-items center
    justify-content center
    width 28px
    height 28px
    border-radius 999px
    border 1px solid var(--b3-border-color, $syp-border-primary)
    background var(--b3-theme-surface, $syp-bg-primary)
    color var(--b3-theme-on-surface-light, $syp-text-tertiary)
    cursor pointer
    flex-shrink 0

    &:hover
      color var(--b3-theme-primary, $syp-accent)
      border-color var(--b3-theme-primary, $syp-accent)

  &__eyebrow
    font-size 12px
    letter-spacing 0.08em
    text-transform uppercase
    color var(--b3-theme-on-surface-light, $syp-text-tertiary)

  &__title
    margin 0
    font-size 20px
    line-height 1.3
    font-weight 600
    color var(--b3-theme-on-background, $syp-text-primary)

  // 单行控件统一 30px、正文 12px（V2 紧凑口径）
  select.syp-input
    width 100%
    min-height 30px
    height 30px
    padding 0 8px
    font-size 12px
    line-height 18px
    color var(--b3-theme-on-surface, $syp-text-primary)
    background var(--b3-theme-surface, $syp-bg-primary)

  textarea.syp-input
    width 100%
    padding 4px 8px
    font-family inherit
    font-size 12px
    line-height 18px
    color var(--b3-theme-on-surface, $syp-text-primary)
    background var(--b3-theme-surface, $syp-bg-primary)
    resize none
    overflow-y auto

  input.syp-input
    width 100%
    min-height 30px
    padding 0 8px
    font-size 12px
    line-height 18px

  .syp-btn.is-danger
    color $syp-action-danger-hover

    &:hover
      background $syp-status-error-bg
      color $syp-action-danger-hover

  &__tip
    padding 6px 10px
    border 1px solid var(--b3-border-color, $syp-border-primary)
    border-radius $syp-radius-sm
    font-size 12px

    &.is-success
      border-color var(--b3-theme-success, $syp-status-success-border)
      background var(--b3-theme-surface-light, $syp-status-success-bg)
      color var(--b3-theme-success, $syp-success)

    &.is-info
      border-color var(--b3-border-color, $syp-status-info-border)
      background var(--b3-theme-primary-lightest, $syp-status-info-bg)
      color var(--b3-theme-primary, $syp-accent)

  &__panel
    display flex
    flex-direction column
    padding 10px
    border 1px solid var(--b3-border-color, $syp-border-primary)
    border-radius $syp-radius-sm
    background $syp-card-bg-gradient

  &__panel-actions
    display flex
    align-items center

  &__prompt-form
    display flex
    flex-direction column
    align-items flex-start
    gap 6px
    margin-top 8px

  &__prompt-new
    // 2~4 行：18px 行高 × 行数 + 上下内边距 8px + 边框 2px
    min-height 46px
    max-height 82px

  &__chat-input
    // 4~16 行：18px 行高 × 行数 + 上下内边距 8px + 边框 2px
    min-height 82px
    max-height 298px

  &__table
    width 100%
    margin-top 8px
    border-collapse collapse
    font-size 12px

    th,
    td
      padding 6px 8px
      border 1px solid var(--b3-border-color, $syp-border-primary)
      text-align left
      vertical-align middle

    th
      background var(--b3-theme-surface-light, $syp-bg-secondary)
      color var(--b3-theme-on-surface-light, $syp-text-secondary)
      font-weight 600

    tr:hover td
      background var(--b3-theme-surface-light, $syp-bg-secondary)

  &__table-actions-col
    width 160px
    text-align center

  &__row-actions
    display inline-flex
    align-items center
    gap 6px

  &__prompt-value
    display inline-block
    word-break break-word

  &__context-row
    display flex
    align-items center
    gap 6px
    color var(--b3-theme-on-surface-light, $syp-text-secondary)

  &__context-label
    font-size 12px

  &__prompt-row
    display flex
    align-items center

  &__actions
    display flex
    align-items center
    flex-wrap wrap
    gap 6px

  &__output
    min-height 72px
    max-height 260px
    padding 8px 10px
    overflow auto
    border 1px solid var(--b3-border-color, $syp-border-primary)
    border-radius $syp-radius-sm
    background var(--b3-theme-surface-light, $syp-bg-secondary)

    pre
      margin 0
      font-size 12px
      line-height 1.6
      white-space pre-wrap
      word-break break-word
      color var(--b3-theme-on-surface, $syp-text-primary)
</style>
