<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { CategoryTypeEnum } from "zhi-blog-api"
import { reactive, toRaw, watch } from "vue"
import { ICategoryConfig, IMultiCategoriesConfig } from "~/src/types/ICategoryConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { CategoryAIResult, prompt } from "~/src/ai/prompt.ts"
import { useChatGPT } from "~/src/composables/useChatGPT.ts"
import { normalizeAiCategories, parseAiJson, pickAiField } from "~/src/ai/aiResult.ts"
import { aiErrorI18nKey, aiParseFailureI18nKey, classifyAiError } from "~/src/ai/aiError.ts"
import { StrUtil } from "zhi-common"
import { ElMessage } from "element-plus"

const logger = createAppLogger("publish-categories")
const { t } = useAppI18n()

const props = defineProps({
  useAi: {
    type: Boolean,
    default: false,
  },
  categoryType: {
    type: String as () => CategoryTypeEnum,
    default: CategoryTypeEnum.CategoryType_None,
  },
  categoryConfig: {
    type: Object as () => ICategoryConfig,
    default: {},
  },
  categories: {
    type: Array,
    default: <string[]>[],
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
  useAi: props.useAi,
  categoryType: props.categoryType,
  categoryConfig: props.categoryConfig,
  categories: props.categories,
  isLoading: false,
  recommCates: <string[]>[],
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
  () => props.html,
  (newValue) => {
    formData.html = newValue
  }
)

// emits
const emit = defineEmits(["emitSyncCates"])

// methods
const syncPubCates = (cates: string[]) => {
  formData.categories = cates
  emit("emitSyncCates", cates)
}

const fetchCate = async () => {
  try {
    formData.isLoading = true

    const inputWord = prompt.categoryPrompt.content
    const { chat, getChatInput } = useChatGPT()
    const chatText = await chat(inputWord, {
      name: "categories",
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
    const categories = normalizeAiCategories(pickAiField(parsed.value, "categories", "category"))
    if (categories.length === 0) {
      ElMessage.error(t("ai.error.empty"))
      return
    }
    formData.recommCates = categories
  } catch (e: any) {
    logger.error(t("main.opt.failure") + "=>", e)
    ElMessage.error(t(aiErrorI18nKey(classifyAiError(e))))
  } finally {
    formData.isLoading = false
  }
}
</script>

<template>
  <div class="category-box">
    <div v-if="formData.categoryType === CategoryTypeEnum.CategoryType_Multi">
      <multi-categories
        v-model:category-config="formData.categoryConfig as IMultiCategoriesConfig"
        v-model:categories="formData.categories"
        @emitSyncMultiCates="syncPubCates"
      />
    </div>
    <div v-else></div>
    <div v-if="formData.useAi && formData.categoryConfig.cateEnabled">
      <el-form-item v-if="formData.recommCates.length > 0" class="recomm-show">
        推荐的分类：
        <el-tag class="ml-2 recomm-cate" type="success" v-for="rtag in formData.recommCates">{{ rtag }}</el-tag>
      </el-form-item>
      <el-form-item class="cat-action">
        <el-button size="small" :loading="formData.isLoading" type="primary" @click="fetchCate">
          {{ formData.isLoading ? t("main.opt.loading") : t("main.auto.fetch.cate") }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-alert :closable="false" :title="t('category.ai.hand')" class="form-item-tip" type="warning" />
      </el-form-item>
      <div class="form-item-bottom"></div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.category-box
  :deep(.el-form-item)
    margin-bottom 0

.form-item-tip
  padding 2px 4px
  margin 0 10px 0 0

.form-item-bottom
  margin-bottom 16px

.cat-action
  margin-top 10px
.recomm-show
  margin-top 10px

.recomm-cate
  margin 0 10px
</style>