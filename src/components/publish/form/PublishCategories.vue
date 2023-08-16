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
import { reactive } from "vue"

const props = defineProps({
  categoryType: {
    type: String,
    default: CategoryTypeEnum.CategoryType_None,
  },
})

const formData = reactive({
  categoryType: props.categoryType,
})
</script>

<template>
  <div v-if="formData.categoryType === CategoryTypeEnum.CategoryType_Single">
    <single-category />
  </div>
  <div v-else-if="formData.categoryType === CategoryTypeEnum.CategoryType_Multi">
    <multi-categories />
  </div>
  <div v-else-if="formData.categoryType === CategoryTypeEnum.CategoryType_Tree_Single">
    <tree-single-category />
  </div>
  <div v-else-if="formData.categoryType === CategoryTypeEnum.CategoryType_Tree_Multi">
    <tree-multi-categories />
  </div>
  <div v-else></div>
</template>

<style scoped lang="stylus"></style>
