<!--
  - Copyright (c) 2022-2023, Terwer . All rights reserved.
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

<template>
  <div>
    <div>isSlugLoading: {{ slugData.isSlugLoading }}</div>
    <el-form>
      <el-switch id="forceRefreshST" v-model="slugData.forceRefresh" />
      <el-switch id="slugHashEnabledST" v-model="slugData.slugHashEnabled" />
      <el-input id="customSlugTxt" v-model="slugData.customSlug" />
      <el-button
        id="makeSlugBtn"
        :loading="slugData.isSlugLoading"
        class="make-slug-btn"
        type="primary"
        @click="slugMethods.makeSlug"
      >
        {{ slugData.isSlugLoading ? $t("main.opt.loading") : $t("main.auto.fetch.slug") }}
      </el-button>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { useSlug } from "~/composables/publish/makeSlugCom"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"

const { slugData, slugMethods } = useSlug("20220831131637-zdnmp2m", new SiYuanApi())
</script>
