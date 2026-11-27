<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { reactive, watch } from "vue"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { StrUtil } from "zhi-common"
import { ElMessage } from "element-plus"
import { useChatGPT } from "~/src/composables/useChatGPT.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { prompt } from "~/src/ai/prompt.ts"
import { normalizeAiTitle, parseAiJson, pickAiField } from "~/src/ai/aiResult.ts"
import { aiErrorI18nKey, aiParseFailureI18nKey, classifyAiError } from "~/src/ai/aiError.ts"

const logger = createAppLogger("publish-title")
const { t } = useAppI18n()

const props = defineProps({
  useAi: {
    type: Boolean,
    default: false,
  },
  modelValue: {
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

const formData = reactive({
  postTitle: props.modelValue,
  isLoading: false,
  useAi: props.useAi,
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
  () => props.modelValue,
  (newValue) => {
    formData.postTitle = newValue
  }
)

watch(
  () => props.md,
  (newValue) => {
    formData.md = newValue
  }
)

watch(
  () => props.html,
  (newValue) => {
    formData.html = newValue
  }
)

const emit = defineEmits(["emitSyncPublishTitle"])

const handleTitleChange = () => {
  emit("emitSyncPublishTitle", formData.postTitle)
}

const handleMakeTitle = async () => {
  try {
    formData.isLoading = true
    const inputWord = prompt.titlePrompt.content
    const { chat, getChatInput } = useChatGPT()

    const chatText = await chat(inputWord, {
      name: "title",
      systemMessage: getChatInput(formData?.md, formData.html),
      timeoutMs: 2 * 60 * 1000,
      silent: true,
      throwOnError: true,
    })
    const parsed = parseAiJson(chatText)
    if (!parsed.ok) {
      ElMessage.error(t(aiParseFailureI18nKey(parsed.reason ?? "invalid-json")))
      return
    }

    const title = normalizeAiTitle(pickAiField(parsed.value, "title"))
    if (StrUtil.isEmptyString(title)) {
      ElMessage.error(t("ai.error.empty"))
      return
    }

    // 失败时保留原标题；只有解析出有效标题才覆盖
    formData.postTitle = title
    emit("emitSyncPublishTitle", formData.postTitle)
    ElMessage.success("使用人工智能提取标题成功")
  } catch (e) {
    logger.error(t("main.opt.failure") + "=>", e)
    ElMessage.error(t(aiErrorI18nKey(classifyAiError(e))))
  } finally {
    formData.isLoading = false
  }
}
</script>

<template>
  <div class="form-post-title">
    <el-form-item :label="t('main.title')">
      <el-input v-model="formData.postTitle" @input="handleTitleChange" />
    </el-form-item>
    <el-form-item v-if="formData.useAi">
      <el-button size="small" :loading="formData.isLoading" type="primary" @click="handleMakeTitle">
        {{ formData.isLoading ? t("main.opt.loading") : t("main.auto.fetch.title") }}
      </el-button>
    </el-form-item>
  </div>
</template>

<style scoped lang="stylus"></style>
