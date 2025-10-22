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
import CommonBlogSetting from "~/src/components/set/publish/singleplatform/base/CommonBlogSetting.vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useConfluenceApi } from "~/src/adaptors/api/confluence/useConfluenceApi.ts"
import { ConfluenceConfig } from "~/src/adaptors/api/confluence/confluenceConfig.ts"
import { ConfluencePlaceholder } from "~/src/adaptors/api/confluence/confluencePlaceholder.ts"
import { ref, watch } from "vue"
import { ConfluenceApiAdaptor } from "~/src/adaptors/api/confluence/confluenceApiAdaptor.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useConfluenceApi(props.apiType)
const confluenceCfg = cfg as ConfluenceConfig
const confluencePlaceholder = new ConfluencePlaceholder()
confluencePlaceholder.homePlaceholder = t("setting.confluence.home.tip")
confluencePlaceholder.passwordPlaceholder = t("setting.confluence.password.tip")
confluencePlaceholder.apiUrlPlaceholder = t("setting.confluence.apiurl.tip")
confluencePlaceholder.previewUrlPlaceholder = t("setting.confluence.previewUrl.tip")
;(confluencePlaceholder as any).parentPageIdPlaceholder = t("setting.confluence.parentPageId.tip")
confluenceCfg.placeholder = confluencePlaceholder
const parentPageIdPlaceholder = (confluenceCfg.placeholder as any).parentPageIdPlaceholder as string
const parentPageOptions = ref<{ label: string; value: string }[]>([])
const parentPageLoading = ref(false)

const loadParentPages = async () => {
  if (!confluenceCfg.blogid) {
    parentPageOptions.value = []
    return
  }
  parentPageLoading.value = true
  try {
    const { blogApi } = await useConfluenceApi(props.apiType, confluenceCfg)
    const confluenceApi = blogApi as ConfluenceApiAdaptor
    const pages = await confluenceApi.getPagesBySpace(confluenceCfg.blogid)
    parentPageOptions.value = pages.map((page) => ({
      label: `${page.title} (${page.id})`,
      value: page.id,
    }))
  } catch (err) {
    console.error("Failed to load Confluence parent pages", err)
    parentPageOptions.value = []
  } finally {
    parentPageLoading.value = false
  }
}

await loadParentPages()

watch(
    () => confluenceCfg.blogid,
    async (newSpace, oldSpace) => {
      if (newSpace !== oldSpace) {
        confluenceCfg.parentPageId = ""
        await loadParentPages()
      }
    }
)
</script>

<template>
  <common-blog-setting :api-type="props.apiType" :cfg="confluenceCfg">
    <template #main="main">
      <el-form-item :label="t('setting.confluence.parentPageId.label')">
        <el-select
            v-model="(main.cfg as ConfluenceConfig).parentPageId"
            :placeholder="parentPageIdPlaceholder"
            clearable
            filterable
            :loading="parentPageLoading"
            @focus="loadParentPages"
            @change="(value: string) => ((main.cfg as ConfluenceConfig).parentPageId = value)"
        >
          <el-option v-for="item in parentPageOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </template>
  </common-blog-setting>
</template>
