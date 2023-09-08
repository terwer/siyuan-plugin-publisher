<!--
  - Copyright (c) 2023, Terwer . All rights reserved.
  - DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
  -
  - This code is free software; you can redistribute it and/or modify it
  - under the terms of the GNU General Public License version 2 only, as
  - published by the Free Software Foundation.  Terwer designates this
  - particular file as subject to the "Classpath" exception as provided
  - by Terwer in the LICENSE file that accompanied this code.
  -
  - This code is distributed in the hope that it will be useful, but WITHOUT
  - ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
  - FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
  - version 2 for more details (a copy is included in the LICENSE file that
  - accompanied this code).
  -
  - You should have received a copy of the GNU General Public License version
  - 2 along with this work; if not, write to the Free Software Foundation,
  - Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
  -
  - Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
  - or visit www.terwer.space if you need additional information or have any
  - questions.
  -->

<script setup lang="ts">
import { ISingleCategoryConfig } from "~/src/types/ICategoryConfig.ts"
import { computed, onMounted, reactive, toRaw } from "vue"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { CategoryInfo } from "zhi-blog-api"
import Adaptors from "~/src/adaptors"

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

const formData = reactive({
  knowledgeSpaceConfig: props.knowledgeSpaceConfig,
  cateSlugs: props.cateSlugs,
  cate: {
    categorySelected: "",
    categoryList: [],
  },

  isInit: false
})

// emits
const emit = defineEmits(["emitSyncSingleCateSlugs"])

// computes
const cateTitle = computed(() => {
  const cateTitle = formData?.knowledgeSpaceConfig?.cfg.knowledgeSpaceTitle ?? t("main.cat")
  return cateTitle
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

const initPage = async () => {
  let categoryInfoList: CategoryInfo[] = []
  // 获取远程分类列表
  const cfg = formData.knowledgeSpaceConfig.cfg
  const api = await Adaptors.getAdaptor(formData.knowledgeSpaceConfig.apiType, cfg)
  categoryInfoList = await api.getCategories()
  logger.debug("getCategories for single category", categoryInfoList)

  if (categoryInfoList.length > 0) {
    // 分类列表
    formData.cate.categoryList = categoryInfoList.map((item: CategoryInfo) => ({
      value: item.categoryId,
      label: item.categoryName,
    }))

    // 当前选中
    formData.cate.categorySelected = (formData.cateSlugs?.[0] ?? cfg.blogid ?? "") as string
    logger.debug("读取已有知识空间 =>", { cateSlugs: toRaw(formData.cateSlugs) })
  }
}

onMounted(async () => {
  try {
    await initPage()
  } catch (e) {
    logger.error("知识空间加载失败", e)
  } finally {
    formData.isInit = true
  }
})
</script>

<template>
  <el-skeleton class="placeholder" v-if="!formData.isInit" :rows="1" animated />
  <div class="single-knowledge-space" v-else>
    <el-form-item :label="cateTitle">
      <el-select
        v-model="formData.cate.categorySelected"
        placeholder="请选择"
        no-data-text="暂无数据"
        class="m-2"
        size="default"
        @change="handleCatNodeSingleCheck"
        :disabled="formData.knowledgeSpaceConfig.readonlyMode"
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
        :title="props.knowledgeSpaceConfig.readonlyModeTip"
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
