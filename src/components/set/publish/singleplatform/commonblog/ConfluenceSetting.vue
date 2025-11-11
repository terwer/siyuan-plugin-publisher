<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import CommonBlogSetting from "~/src/components/set/publish/singleplatform/base/CommonBlogSetting.vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useConfluenceApi } from "~/src/adaptors/api/confluence/useConfluenceApi.ts"
import { ConfluenceConfig } from "~/src/adaptors/api/confluence/confluenceConfig.ts"
import { ConfluencePlaceholder } from "~/src/adaptors/api/confluence/confluencePlaceholder.ts"
import { ref, watch } from "vue"
import { ConfluenceApiAdaptor } from "~/src/adaptors/api/confluence/confluenceApiAdaptor.ts"
import { StrUtil } from "zhi-common"
import { CONFLUENCE_CONSTANTS } from "~/src/adaptors/api/confluence/confluenceConstants.ts"

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

const onHomeChange = (value: string, cfg: ConfluenceConfig) => {
  if (StrUtil.isEmptyString(cfg.home)) {
    cfg.apiUrl = ""
  } else {
    cfg.apiUrl = cfg.home
    cfg.tokenSettingUrl = StrUtil.pathJoin(cfg.home, CONFLUENCE_CONSTANTS.TOKEN_SETTING_URL)
  }
}

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
  <common-blog-setting :api-type="props.apiType" :cfg="confluenceCfg" @onHomeChange="onHomeChange">
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


<style scoped>
/* 隐藏 Confluence 的 Markdown 选项，因为 Markdown 格式会导致 XHTML 解析错误 */
:deep(.el-radio-group .el-radio:first-child) {
  display: none !important;
}
</style>
