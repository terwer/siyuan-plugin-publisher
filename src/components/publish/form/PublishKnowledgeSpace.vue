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
import { reactive, toRaw } from "vue"
import { ICategoryConfig } from "~/src/types/ICategoryConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"

const logger = createAppLogger("publish-categories")

const props = defineProps({
  knowledgeSpaceType: {
    type: String as () => CategoryTypeEnum,
    default: CategoryTypeEnum.CategoryType_None,
  },
  knowledgeSpaceConfig: {
    type: Object as () => ICategoryConfig,
    default: {},
  },
  cateSlugs: {
    type: Array,
    default: <string[]>[],
  },
})

const formData = reactive({
  knowledgeSpaceType: props.knowledgeSpaceType,
  knowledgeSpaceConfig: props.knowledgeSpaceConfig,
  cateSlugs: props.cateSlugs,
})

// emits
const emit = defineEmits(["emitSyncCateSlugs"])

// methods
const syncPubCateSlugs = (cateSlugs: string[]) => {
  logger.debug("sync single cateSlugs =>", {
    cateSlugs: toRaw(cateSlugs),
  })
  emit("emitSyncCateSlugs", cateSlugs)
}
</script>

<template>
  <div v-if="formData.knowledgeSpaceType === CategoryTypeEnum.CategoryType_Single">
    <single-knowledge-space
      v-model:knowledge-space-config="formData.knowledgeSpaceConfig"
      v-model:cate-slugs="formData.cateSlugs"
      @emitSyncSingleCateSlugs="syncPubCateSlugs"
    />
  </div>
  <div v-else-if="formData.knowledgeSpaceType === CategoryTypeEnum.CategoryType_Tree_Single">
    <tree-single-knowledge-space
      v-model:knowledge-space-config="formData.knowledgeSpaceConfig"
      v-model:cate-slugs="formData.cateSlugs"
      @emitSyncTreeSingleCateSlugs="syncPubCateSlugs"
    />
  </div>
  <div v-else></div>
</template>
