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
import { ITreeSingleCategoryConfig } from "~/src/types/ICategoryConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { reactive } from "vue"
import { StrUtil } from "zhi-common"
import { ElMessage } from "element-plus"
import Adaptors from "~/src/adaptors"

const logger = createAppLogger("tree-single-category")
const { t } = useVueI18n()

const props = defineProps({
  categoryConfig: {
    type: Object as () => ITreeSingleCategoryConfig,
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
  path: {
    // 当前选中
    customPath: "",
    // 树形目录选择
    customProps: {
      label: "label",
      children: "children",
      isLeaf: "isLeaf",
    },
  },
})

// emits
const emit = defineEmits(["emitSyncTreeSingleCates"])

// methods
const customLoad = async (node: any, resolve: any) => {
  if (node.isLeaf) return resolve([])

  logger.debug("目前已保存路径=>", formData.path.customPath)
  logger.debug("当前节点=>", node.data)

  // 获取远程分类列表
  const cfg = formData.categoryConfig.cfg
  const api = await Adaptors.getAdaptor(formData.categoryConfig.apiType, cfg)

  let docPath: string
  let parentDocPath = node.data.value || ""
  // 第一次加载并且保存过目录
  if (parentDocPath === "" && formData.path.customPath !== "") {
    docPath = ""
  } else {
    // 非首次加载或者首次加载但是没保存过目录
    if (parentDocPath === "") {
      parentDocPath = ""
    }
    // 子目录加载
    docPath = parentDocPath
  }

  const treeNode = await api.getCategoryTreeNodes(docPath)
  resolve(treeNode)
}

const onSelectChange = (val: any) => {
  logger.debug("onSelectChange=>", val)

  if (val.isLeaf) {
    ElMessage.error("您当前选择的是页面，请注意，页面必须发布在目录下")
    return
  }
}
</script>

<template>
  <div class="tree-single-category">
    <el-form-item :label="t('main.publish.github.choose.path')">
      <el-tree-select
        v-model="formData.path.customPath"
        :check-strictly="true"
        :empty-text="t('main.cat.empty')"
        :load="customLoad"
        :no-data-text="t('main.cat.empty')"
        :placeholder="t('main.cat.select')"
        :props="formData.path.customProps"
        lazy
        @node-click="onSelectChange"
      />
    </el-form-item>
  </div>
</template>

<style scoped lang="stylus"></style>
