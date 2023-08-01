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
// uses
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useRoute, useRouter } from "vue-router"
import { reactive, ref } from "vue"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { ArrowLeft } from "@element-plus/icons-vue"

const logger = createAppLogger("back-page")
const { t } = useVueI18n()
const router = useRouter()
const route = useRoute()
const { query } = useRoute()

// props
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
})

// datas
const params = reactive(route.params)
const showBack = ref(query.showBack === "true")

const onBack = () => {
  router.back()
}
</script>

<template>
  <div id="page-body">
    <div v-if="showBack" class="page-head">
      <el-page-header :icon="ArrowLeft" title="返回" @click="onBack">
        <template #content>
          <div class="flex items-center">
            <span class="text-large font-600 mr-3">{{ props.title }}</span>
          </div>
        </template>
      </el-page-header>
    </div>
    <div class="page-content-box">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="stylus">
#page-body
  margin 10px 20px
</style>
