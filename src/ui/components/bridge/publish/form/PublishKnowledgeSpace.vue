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
