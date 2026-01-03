<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { ISingleCategoryConfig } from "~/src/types/ICategoryConfig.ts"
import { computed, onMounted, reactive, ref, toRaw } from "vue"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { CategoryInfo } from "zhi-blog-api"
import Adaptors from "~/src/adaptors"
import { CATE_AUTO_NAME } from "~/src/utils/constants.ts"

const logger = createAppLogger("single-knowledge-space")
const { t } = useVueI18n()

const props = defineProps({
  knowledgeSpaceConfig: {
    type: Object as () => ISingleCategoryConfig,
    default: {},
  },
  cateSlugs: {
    type: Array,
    default: <string[]>[],
  },
})

const singleCateSelect = ref(null)
const formData = reactive({
  knowledgeSpaceConfig: props.knowledgeSpaceConfig,
  cateSlugs: props.cateSlugs,
  cate: {
    categorySelected: "",
    categoryList: [],
  },
  ksKeyword: "",
  isCateLoading: false,

  isInit: false,
})

// emits
const emit = defineEmits(["emitSyncSingleCateSlugs"])

// computes
const cateTitle = computed(() => {
  const title = formData?.knowledgeSpaceConfig?.cfg?.knowledgeSpaceTitle ?? t("main.cat")
  // Translate "发布目录" if it matches
  return title === "发布目录" ? t("common.publish.directory") : title
})

// methods
const handleCatNodeSingleCheck = (val: any) => {
  const value = val
  logger.debug("value=>", value)
  logger.debug("label=>", value)

  const cateSlugs = []
  cateSlugs.push(value)
  formData.cateSlugs = cateSlugs
  logger.debug("cateSlugs=>", formData.cateSlugs)

  emit("emitSyncSingleCateSlugs", cateSlugs)
}

const handleCateSearch = async () => {
  try {
    formData.isCateLoading = true

    logger.debug("reload categories for single category woth search")
    formData.cate.categoryList = []
    formData.cate.categorySelected = undefined
    await initPage(false)
    // 展开下拉框
    singleCateSelect.value.visible = true
  } catch (e) {
    logger.error("知识空间加载失败", e)
  } finally {
    formData.isCateLoading = false
    formData.isInit = true
  }
}

const initPage = async (showInitSelect: boolean) => {
  let categoryInfoList: CategoryInfo[] = []
  // 获取远程分类列表
  const cfg = formData.knowledgeSpaceConfig.cfg
  const api = await Adaptors.getAdaptor(formData.knowledgeSpaceConfig.apiType, cfg)
  categoryInfoList = await api.getCategories(formData.ksKeyword)
  logger.debug("getCategories for single category", categoryInfoList)

  if (categoryInfoList.length > 0) {
    // 分类列表
    formData.cate.categoryList = categoryInfoList.map((item: CategoryInfo) => ({
      value: item.categoryId,
      label: item.categoryName,
    }))

    // 当前选中
    if (showInitSelect) {
      formData.cate.categorySelected = (formData.cateSlugs?.[0] ?? cfg.blogid ?? "") as string
      logger.debug("读取已有知识空间 =>", { cateSlugs: toRaw(formData.cateSlugs) })
    }
  }
}

onMounted(async () => {
  try {
    formData.isCateLoading = true
    await initPage(true)
    // 自动映射分类模式只读
    if (formData?.cate?.categorySelected?.toString().includes(CATE_AUTO_NAME)) {
      formData.knowledgeSpaceConfig.readonlyMode = true
      formData.knowledgeSpaceConfig.readonlyModeTip = t("knowledge.space.auto.map.tip")
    }
  } catch (e) {
    logger.error("知识空间加载失败", e)
  } finally {
    formData.isCateLoading = false
    formData.isInit = true
  }
})
</script>

<template>
  <el-skeleton class="placeholder" v-if="!formData.isInit" :rows="1" animated />
  <div class="single-knowledge-space" v-else>
    <el-form-item
      class="cate-input"
      :label="t('setting.common.search.keyword.label')"
      v-if="!formData.knowledgeSpaceConfig.readonlyMode && formData.knowledgeSpaceConfig?.cfg?.cateSearchEnabled"
    >
      <el-input
        v-model="formData.ksKeyword"
        :placeholder="t('setting.common.search.keyword.placeholder').replace('{knowledgeSpaceTitle}', cateTitle)"
        @change="handleCateSearch"
      />
    </el-form-item>
    <el-form-item :label="cateTitle">
      <el-select
        v-model="formData.cate.categorySelected"
        :placeholder="t('main.opt.select')"
        :no-data-text="t('main.data.empty')"
        class="m-2"
        size="default"
        @change="handleCatNodeSingleCheck"
        :disabled="formData.knowledgeSpaceConfig.readonlyMode"
        :loading="formData.isCateLoading"
        :loading-text="t('setting.common.loading.text')"
        ref="singleCateSelect"
      >
        <el-option
          v-for="item in formData.cate.categoryList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-if="formData.knowledgeSpaceConfig.readonlyMode">
      <el-alert
        :closable="false"
        :title="formData.knowledgeSpaceConfig.readonlyModeTip"
        class="form-item-tip"
        type="warning"
      />
    </el-form-item>
    <div class="form-item-bottom"></div>
  </div>
</template>

<style scoped lang="stylus">
.form-item-tip
  padding 2px 4px
  margin 0 10px 0 0

.form-item-bottom
  margin-bottom 16px

.single-knowledge-space
  :deep(.el-form-item)
    margin-bottom 0

.single-knowledge-space
  :deep(.cate-input)
    margin-bottom 10px

.single-knowledge-space
  :deep(.el-tag.el-tag--info)
    --el-tag-bg-color var(--el-color-primary-light-9)
    --el-tag-border-color var(--el-color-primary-light-8)
    --el-tag-hover-color var(--el-color-primary)
    --el-tag-text-color var(--el-color-primary)
    background-color var(--el-tag-bg-color)
    border-color var(--el-tag-border-color)
    color var(--el-tag-text-color)
    display inline-flex
    justify-content center
    align-items center
    vertical-align middle
    height 24px
    padding 0 9px
    font-size var(--el-tag-font-size)
    line-height 1
    border-width 1px
    border-style solid
    border-radius var(--el-tag-border-radius)
    box-sizing border-box
    white-space nowrap
    --el-icon-size 14px
</style>
