<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { onMounted, reactive, toRaw } from "vue"
import { StrUtil } from "zhi-common"
import { TagInfo } from "zhi-blog-api"
import Adaptors from "~/src/adaptors"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"

const logger = createAppLogger("single-tag-slugs")
const { t } = useVueI18n()

const props = defineProps({
  cfg: {
    type: Object,
    default: {},
  },
  apiType: {
    type: String,
    default: "",
  },
  tagSlugs: {
    type: String,
    default: "",
  },
})

const formData = reactive({
  cfg: props.cfg,
  apiType: props.apiType,
  tagSlugs: <string[]>(StrUtil.isEmptyString(props.tagSlugs) ? [] : props.tagSlugs.split(",")),
  tag: {
    tagSelected: "",
    tagList: [],
  },

  isInit: false,
})

// emits
const emit = defineEmits(["emitSyncTagSlugs"])

// methods
const handleCatNodeSingleCheck = (val: any) => {
  const value = val
  logger.debug("value=>", value)
  logger.debug("label=>", value)

  const tagSlugs = []
  tagSlugs.push(value)
  formData.tagSlugs = tagSlugs
  logger.debug("tagSlugs=>", formData.tagSlugs)

  emit("emitSyncTagSlugs", tagSlugs)
}

const initPage = async () => {
  let tagInfoList: TagInfo[] = []
  // 获取远程分类列表
  const cfg = formData.cfg
  const api = await Adaptors.getAdaptor(formData.apiType, cfg)
  tagInfoList = await api.getTags()
  logger.debug("getTags for single slug tag", tagInfoList)

  if (tagInfoList.length > 0) {
    // 分类列表
    formData.tag.tagList = tagInfoList.map((item: TagInfo) => ({
      value: item.tagId,
      label: item.tagName,
    }))

    // 当前选中
    formData.tag.tagSelected = (formData.tagSlugs?.[0] ?? "") as string
    logger.debug("读取已有别名标签 =>", { tagSlugs: toRaw(formData.tagSlugs) })
  }
}

onMounted(async () => {
  try {
    await initPage()
  } catch (e) {
    logger.error("别名标签加载失败", e)
  } finally {
    formData.isInit = true
  }
})
</script>

<template>
  <el-skeleton class="placeholder" v-if="!formData.isInit" :rows="1" animated />
  <div v-else class="single-tag-slug">
    <el-form-item label="标签">
      <el-select
        v-model="formData.tag.tagSelected"
        placeholder="请选择"
        no-data-text="暂无数据"
        class="m-2"
        size="default"
        @change="handleCatNodeSingleCheck"
      >
        <el-option v-for="item in formData.tag.tagList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
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

.single-tag-slug
  :deep(.el-form-item)
    margin-bottom 0

.single-tag-slug
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