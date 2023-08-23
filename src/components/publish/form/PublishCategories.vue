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
import { ICategoryConfig, IMultiCategoriesConfig } from "~/src/types/ICategoryConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { watch } from "vue"

const logger = createAppLogger("publish-categories")
const { t } = useVueI18n()

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
  categoryType: props.categoryType,
  categoryConfig: props.categoryConfig,
  categories: props.categories,
  isLoading: false,
  useAi: props.useAi,
  md: props.md,
  html: props.html,
})

watch(
  () => props.useAi,
  (newValue) => {
    formData.useAi = newValue
  }
)

// emits
const emit = defineEmits(["emitSyncCates"])

// methods
const syncPubCates = (cates: string[]) => {
  logger.debug("sync single cates =>", {
    cates: toRaw(cates),
  })
  formData.categories = cates
  emit("emitSyncCates", cates)
}

const fetchCate = () => {}
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
    <div v-if="formData.useAi">
      推荐的分类
      <el-form-item>
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
.form-item-tip
  padding 2px 4px
  margin 0 10px 0 0

.form-item-bottom
  margin-bottom 16px
</style>
