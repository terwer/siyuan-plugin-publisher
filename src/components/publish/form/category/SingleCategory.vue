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
import { computed, onMounted, reactive, toRaw } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { CategoryInfo } from "zhi-blog-api"
import Adaptors from "~/src/adaptors"
import { StrUtil } from "zhi-common"
import { ISingleCategoryConfig } from "~/src/types/ICategoryConfig.ts"

const logger = createAppLogger("single-category")
const { t } = useVueI18n()

const props = defineProps({
  categoryConfig: {
    type: Object as () => ISingleCategoryConfig,
    default: {},
  },
  categories: {
    type: Array,
    default: <string[]>[],
  }
})

const formData = reactive({
  categoryConfig: props.categoryConfig,
  useRemoteData: !StrUtil.isEmptyString(props.categoryConfig.apiType),
  cate: {
    categorySelected: "",
    categoryList: [],
  },
})

// emits
const emit = defineEmits(["emitSyncSingleCates"])

// computes
const cateTitle = computed(() => {
  let cateTitle = t("main.cat")
  if (formData.useRemoteData && formData?.categoryConfig?.cfg.knowledgeSpaceEnabled) {
    cateTitle = formData?.categoryConfig?.cfg.knowledgeSpaceTitle
  }
  return cateTitle
})

// methods
const handleCatNodeSingleCheck = (val: any) => {
  const value = val
  const label = formData.cate.categoryList.find((x) => x.value === value)?.label ?? ""
  logger.debug("value=>", value)
  logger.debug("label=>", value)
  const cfg = formData.categoryConfig.cfg
  const cates = []
  const cateSlugs = []

  if (cfg.knowledgeSpaceEnabled) {
    cates.push(label)
    cateSlugs.push(value)
  } else {
    const cates = []
    cates.push(label)
  }

  formData.categoryConfig.categories = cates
  formData.categoryConfig.cateSlugs = cateSlugs
  logger.debug("categories=>", formData.categoryConfig.categories)
  logger.debug("cat_slugs=>", formData.categoryConfig.cateSlugs)

  emit("emitSyncSingleCates", cates, cateSlugs)
}

const initPage = async () => {
  if (formData.categoryConfig.cateEnabled) {
    let categoryInfoList: CategoryInfo[] = []
    logger.debug(`useRemoteData => ${formData.useRemoteData}`)
    if (formData.useRemoteData) {
      // 获取远程分类列表
      const cfg = formData.categoryConfig.cfg
      const api = await Adaptors.getAdaptor(formData.categoryConfig.apiType, cfg)
      categoryInfoList = await api.getCategories()
      logger.debug("getCategories for single category", categoryInfoList)

      if (categoryInfoList.length > 0) {
        // 分类列表
        formData.cate.categoryList = categoryInfoList.map((item: CategoryInfo) => ({
          value: item.categoryId,
          label: item.categoryName,
        }))
        logger.debug("get single categoryList =>", {
          categoryList: toRaw(formData.cate.categoryList),
        })

        // 当前选中
        if (cfg.knowledgeSpaceEnabled) {
          const cateSlugs = formData.categoryConfig.cateSlugs
          // 先读取保存的，否则使用默认
          formData.cate.categorySelected = cateSlugs.length > 0 ? cateSlugs[0] : cfg.blogid
          // 默认未设置，获取第一个
          if (StrUtil.isEmptyString(formData.cate.categorySelected)) {
            formData.cate.categorySelected = categoryInfoList[0].categoryId
          }
          const cates = []
          const cate = formData.cate.categoryList.find((x) => x.value === formData.cate.categorySelected)?.label ?? ""
          cates.push(cate)
          emit("emitSyncSingleCates", cates, cateSlugs)
          logger.debug("knowledgeSpace is enabled =>", {
            cateSlugs: toRaw(cateSlugs),
          })
        } else {
          const cates = formData.categoryConfig.categories
          // 先读取保存的，否则使用默认
          formData.cate.categorySelected = cates.length > 0 ? cates[0] : cfg.blogid
          // 默认未设置，获取第一个
          if (StrUtil.isEmptyString(formData.cate.categorySelected)) {
            formData.cate.categorySelected = categoryInfoList[0].categoryId
          }
          emit("emitSyncSingleCates", cates, [])
          logger.debug("knowledgeSpace is disabled =>", {
            cateSlugs: toRaw(cates),
          })
        }
      }
    } else {
      // 直接读取已有分类
      const cates = formData.categoryConfig.categories ?? []
      categoryInfoList = cates.map((x: string) => {
        const categoryInfo = new CategoryInfo()
        categoryInfo.categoryId = x
        categoryInfo.categoryName = x
        categoryInfo.categoryDescription = x
        return categoryInfo
      })

      if (categoryInfoList.length > 0) {
        // 分类列表
        formData.cate.categoryList = categoryInfoList.map((item: CategoryInfo) => ({
          value: item.categoryId,
          label: item.categoryName,
        }))

        // 当前选中
        formData.cate.categorySelected = categoryInfoList[0].categoryId
      }

      logger.debug("读取已有分类 =>", { cates: toRaw(cates) })
    }
  }
}

onMounted(async () => {
  await initPage()
})
</script>

<template>
  <div class="single-category" v-if="formData.cate.categoryList.length > 0">
    <el-form-item :label="cateTitle">
      <el-select
        v-model="formData.cate.categorySelected"
        placeholder="请选择"
        no-data-text="暂无数据"
        class="m-2"
        size="default"
        @change="handleCatNodeSingleCheck"
        :disabled="formData.categoryConfig.readonlyMode"
      >
        <el-option
          v-for="item in formData.cate.categoryList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-if="!StrUtil.isEmptyString(props.categoryConfig.readonlyModeTip)">
      <el-alert :closable="false" :title="props.categoryConfig.readonlyModeTip" class="form-item-tip" type="warning" />
    </el-form-item>
  </div>
</template>

<style scoped lang="stylus">
.form-item-tip
  padding 2px 4px
  margin 0 10px 0 0

.single-category
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
