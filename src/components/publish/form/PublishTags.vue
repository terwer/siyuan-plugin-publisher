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
import { useVueI18n } from "~/src/composables/useVueI18n.ts"

const { t } = useVueI18n()
</script>

<template>
  <div class="form-tags">
    <el-form-item :label="t('main.tag')">
      <el-tag v-for="tag in []" :key="tag" :disable-transitions="false" class="mx-1" closable>
        {{ tag }}
      </el-tag>
      <el-input class="ml-1 w-20" />
      <el-button class="button-new-tag ml-1 el-tag pub-tags">
        {{ t("main.tag.new") }}
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">
        {{ t("main.auto.fetch.tag") }}
      </el-button>
    </el-form-item>
  </div>
</template>

<style lang="stylus" scoped>
:deep(.pub-tags)
  margin-top 10px
</style>
