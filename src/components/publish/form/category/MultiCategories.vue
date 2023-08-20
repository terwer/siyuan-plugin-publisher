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
import { IMultiCategoriesConfig } from "~/src/types/ICategoryConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { onMounted, reactive, toRaw } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { CategoryInfo } from "zhi-blog-api"
import { StrUtil } from "zhi-common"
import Adaptors from "~/src/adaptors"

const logger = createAppLogger("multi-categories")
const { t } = useVueI18n()

const props = defineProps({
  categoryConfig: {
    type: Object as () => IMultiCategoriesConfig,
    default: {},
  },
  categories: {
    type: Array,
    default: <string[]>[],
  },
})

const formData = reactive({
  categoryConfig: props.categoryConfig,
  categories: <string[]>props.categories,
  useRemoteData: !StrUtil.isEmptyString(props.categoryConfig.apiType),
  cate: {
    categorySelected: <string[]>[],
    categoryList: [],
  },
})

// emits
const emit = defineEmits(["emitSyncMultiCates"])

// methods
const handleCatNodeClick = (event: any, data: any[], node: any, nodeItem: any) => {
  // console.log("data=>", data)
  // console.log("node=>", node)
}

const handleCatNodeCheck = (data: any[], status: any) => {
  logger.debug("checked item=>", {
    data: toRaw(data),
    status: toRaw(status),
  })

  const cates = []
  const values = status.checkedKeys
  values.forEach((item: any) => {
    cates.push(item.toString())
  })
  formData.categories = cates
  logger.debug(" formData.categories=>", {
    categories: toRaw(formData.categories),
  })

  emit("emitSyncMultiCates", cates)
}

const handleRemoveTag = (val: string) => {
  const value = val
  logger.debug("准备删除 =>", value)

  const cates = formData.categories.filter((cate) => cate !== value)
  formData.categories = cates
  logger.debug("formData.categories=>", {
    categories: toRaw(formData.categories),
  })

  emit("emitSyncMultiCates", cates)
}

const onCatChange = (val: string) => {
  const value = val
  logger.debug("选中项已改变 =>", value)

  const cates = value
  emit("emitSyncMultiCates", cates)
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
      // 未提供分类列表的，读取选择的
      if (categoryInfoList.length === 0) {
        categoryInfoList = formData.categories.map((x: string) => {
          const cateInfo = new CategoryInfo()
          cateInfo.categoryId = x
          cateInfo.categoryName = x
          return cateInfo
        })
      }
      logger.debug("getCategories for multi categories", categoryInfoList)

      if (categoryInfoList.length > 0) {
        // 分类列表
        formData.cate.categoryList = categoryInfoList.map((item: CategoryInfo) => ({
          value: item.categoryName,
          label: item.categoryName,
        }))
        logger.debug("get multi categoryList =>", {
          categoryList: toRaw(formData.cate.categoryList),
        })

        // 当前选中
        const cates = formData.categories
        // 先读取保存的，否则使用默认
        formData.cate.categorySelected = cates
        // 默认未设置，获取第一个
        emit("emitSyncMultiCates", cates)
        logger.debug("muti cates is syncing =>", {
          cates: toRaw(cates),
        })
      }
    } else {
      // 直接读取已有分类
      const cates = formData.categories ?? []
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
        formData.cate.categorySelected = cates
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
  <div class="multi-categories" v-if="formData.categoryConfig.cateEnabled">
    <el-form-item :label="t('main.cat')">
      <el-tree-select
        style="width: 100%"
        v-model="formData.cate.categorySelected"
        :data="formData.cate.categoryList"
        filterable
        allow-create
        multiple
        :check-on-click-node="true"
        :render-after-expand="false"
        show-checkbox
        :placeholder="t('main.cat.select')"
        :empty-text="t('main.cat.empty')"
        :no-data-text="t('main.cat.empty')"
        :disabled="formData.categoryConfig.readonlyMode"
        @node-click="handleCatNodeClick"
        @check="handleCatNodeCheck"
        @remove-tag="handleRemoveTag"
        @change="onCatChange"
      />
    </el-form-item>
  </div>
</template>

<style lang="stylus" scoped>
.multi-categories
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
