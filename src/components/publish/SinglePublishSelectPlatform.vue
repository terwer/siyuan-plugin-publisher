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
import { reactive } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useRouter } from "vue-router"
import { createAppLogger } from "~/src/utils/appLogger.ts"

const logger = createAppLogger("single-publish-select-platform")

// props
const props = defineProps({
  id: {
    type: String,
    default: "",
  },
})

// uses
const { t } = useVueI18n()
const router = useRouter()

// datas
const formData = reactive({})

// methods
const handleSingleDoPublish = (key: string) => {
  const path = `/publish/singlePublish/doPublish/${key}/${props.id}`
  logger.info("will go to =>", path)
  const query = {
    path: path,
    query: {
      showBack: "true",
    },
  }
  router.push(query)
}
</script>

<template>
  <div @click="handleSingleDoPublish('testkey')">select platform</div>
</template>

<style scoped lang="stylus"></style>