<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { reactive, watch } from "vue"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { ElMessage } from "element-plus"
import { HtmlUtil, StrUtil } from "zhi-common"
import { prompt } from "~/src/ai/prompt.ts"
import { useChatGPT } from "~/src/composables/useChatGPT.ts"
import { normalizeAiDescription } from "~/src/ai/aiResult.ts"
import { aiErrorI18nKey, classifyAiError } from "~/src/ai/aiError.ts"

const logger = createAppLogger("publish-description")
const { t } = useAppI18n()

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

const fallbackDesc = (): string => {
  const source = !StrUtil.isEmptyString(formData.html) ? formData.html : formData.md || ""
  return HtmlUtil.parseHtml(source, MAX_PREVIEW_LENGTH, true)
}

const applyDescFallback = (messageKey: string) => {
  // 有原摘要时优先保留，不用本地截取覆盖用户的既有内容
  if (!StrUtil.isEmptyString(formData.desc)) {
    ElMessage.error(t(messageKey))
    return
  }

  const fallback = fallbackDesc()
  if (StrUtil.isEmptyString(fallback)) {
    ElMessage.error(t(messageKey))
    return
  }

  formData.desc = fallback
  emit("emitSyncDesc", formData.desc)
  ElMessage.warning(t("ai.fallback.descLocal"))
}

const handleMakeDesc = async () => {
  formData.isDescLoading = true
  try {
    const { chat, getChatInput } = useChatGPT()
    const inputWord = prompt.shortDescPromptStream.content
    // 流式输出先写入局部变量，成功收尾后才提交到表单；失败时不会残留半截摘要
    let streamedText = ""
    const result = await chat(inputWord, {
      name: "desc",
      systemMessage: getChatInput(formData?.md, formData.html),
      stream: true,
      onProgress: (partialResponse) => {
        const text = partialResponse?.text
        if (!StrUtil.isEmptyString(text)) {
          streamedText = text
        }
      },
      timeoutMs: 2 * 60 * 1000,
      silent: true,
      throwOnError: true,
    })
    const aiText = normalizeAiDescription(streamedText || result?.text)

    if (!StrUtil.isEmptyString(aiText)) {
      formData.desc = aiText
      emit("emitSyncDesc", formData.desc)
      ElMessage.success("使用人工智能提取摘要成功")
      return
    }

    applyDescFallback("ai.error.empty")
  } catch (e) {
    logger.error(t("main.opt.failure") + "=>", e)
    applyDescFallback(aiErrorI18nKey(classifyAiError(e)))
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
