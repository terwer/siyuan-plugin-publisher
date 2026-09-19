<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { reactive, watch } from "vue"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { ElMessage } from "element-plus"
import { HtmlUtil, JsonUtil, StrUtil } from "zhi-common"
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
  const isStream = true
  try {
    if (isStream) {
      const inputWord = prompt.shortDescPromptStream.content
      const { chat, getChatInput } = useChatGPT()
      formData.desc = ""
      await chat(inputWord, {
        name: "desc",
        systemMessage: getChatInput(formData?.md, formData.html),
        stream: true,
        onProgress: (partialResponse) => {
          const text = partialResponse?.text
          if (!StrUtil.isEmptyString(text)) {
            formData.desc = text
          }
          logger.debug("partialResponse=>", text)
        },
        timeoutMs: 2 * 60 * 1000,
        silent: true,
      })
    } else {
      const inputWord = prompt.shortDescPrompt.content
      const { chat, getChatInput } = useChatGPT()
      const chatText = await chat(inputWord, {
        name: "desc",
        systemMessage: getChatInput(formData?.md, formData.html),
        silent: true,
      })
      const resJson = JsonUtil.safeParse<ShortDescAIResult>(chatText, {} as ShortDescAIResult)
      if (!StrUtil.isEmptyString(resJson?.desc)) {
        formData.desc = resJson.desc
        logger.info("使用AI智能生成的摘要结果 =>", {
          inputWord: inputWord,
          chatText: chatText,
        })
      }
    }

    // AI 未产生有效摘要（未配置 / 请求失败 / 正文过少）时，回退为本地截取摘要，避免空摘要与误导性报错
    if (StrUtil.isEmptyString(formData.desc)) {
      const fallback = !StrUtil.isEmptyString(formData.html)
        ? HtmlUtil.parseHtml(formData.html, MAX_PREVIEW_LENGTH, true)
        : HtmlUtil.parseHtml(formData.md || "", MAX_PREVIEW_LENGTH, true)
      if (StrUtil.isEmptyString(fallback)) {
        throw new Error("文档信息量太少，未能抽取有效信息")
      }
      formData.desc = fallback
    }

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
