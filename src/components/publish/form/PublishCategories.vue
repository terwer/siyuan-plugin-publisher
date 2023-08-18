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
import { CategoryTypeEnum } from "zhi-blog-api"
import { reactive, toRaw, watch } from "vue"
import {
  ICategoryConfig,
  IMultiCategoriesConfig,
  ISingleCategoryConfig,
  ITreeMultiCategoriesConfig,
  ITreeSingleCategoryConfig,
} from "~/src/types/ICategoryConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"

const logger = createAppLogger("publish-categories")

const props = defineProps({
  categoryType: {
    type: String as () => CategoryTypeEnum,
    default: CategoryTypeEnum.CategoryType_None,
  },
  categoryConfig: {
    type: Object as () => ICategoryConfig,
    default: {},
  },
})

const formData = reactive({
  categoryType: props.categoryType,
  categoryConfig: props.categoryConfig,
})

// emits
const emit = defineEmits(["emitSyncCates"])

// methods
const syncPubCates = (cates: string[], cateSlugs: string[]) => {
  logger.debug("sync single cates =>", {
    cates: toRaw(cates),
    cateSlugs: toRaw(cateSlugs),
  })
  emit("emitSyncCates", cates, cateSlugs)
}
</script>

<template>
  <div v-if="formData.categoryType === CategoryTypeEnum.CategoryType_Single">
    <single-category
      v-model:category-config="formData.categoryConfig as ISingleCategoryConfig"
      @emitSyncSingleCates="syncPubCates"
    />
  </div>
  <div v-else-if="formData.categoryType === CategoryTypeEnum.CategoryType_Multi">
    <multi-categories v-model:category-config="formData.categoryConfig as IMultiCategoriesConfig" />
  </div>
  <div v-else-if="formData.categoryType === CategoryTypeEnum.CategoryType_Tree_Single">
    <tree-single-category v-model:category-config="formData.categoryConfig as ITreeSingleCategoryConfig" />
  </div>
  <div v-else></div>
</template>
