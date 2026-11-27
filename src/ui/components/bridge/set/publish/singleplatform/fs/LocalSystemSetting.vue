<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import CommonBlogSetting from "~/src/ui/components/bridge/set/publish/singleplatform/base/CommonBlogSetting.vue"
import FieldGuide from "~/src/ui/components/bridge/common/help/FieldGuide.vue"
import { useLocalSystemApi } from "~/src/adaptors/fs/LocalSystem/useLocalSystemApi.ts"
import { LocalSystemConfig } from "~/src/adaptors/fs/LocalSystem/LocalSystemConfig.ts"
import { LocalSystemPlaceholder } from "~/src/adaptors/fs/LocalSystem/LocalSystemPlaceholder.ts"
import { FsYamlType } from "~/src/adaptors/fs/LocalSystem/FsYamlType.ts"
import {
  CONTENT_LAYOUT_LEAF_BUNDLE as ContentLayoutLeafBundle,
  CONTENT_LAYOUT_SINGLE as ContentLayoutSingle,
} from "~/src/adaptors/api/base/contentLayout.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useAppI18n()
const { cfg } = await useLocalSystemApi(props.apiType)
const localFsCfg = cfg as LocalSystemConfig
const localFsPlaceholder = new LocalSystemPlaceholder()
localFsCfg.placeholder = localFsPlaceholder
</script>

<template>
  <common-blog-setting :api-type="props.apiType" :cfg="localFsCfg">
    <template #header="header">
      <slot name="header" :cfg="header.cfg" />
    </template>

    <template #main="main">
      <!-- 存储路径 -->
      <el-form-item :label="t('setting.blog.type.fs.store.path')" data-syp-tour="storePath">
        <field-guide field="storePath">
          <el-input
            v-model="(main.cfg as LocalSystemConfig).storePath"
            :placeholder="t('setting.blog.type.fs.store.path.tip')"
          />
        </field-guide>
      </el-form-item>
      <!-- 媒体存储路径（页面目录模式下图片固定在 index.md 同目录） -->
      <el-form-item
        v-if="
          (main.cfg as LocalSystemConfig).fsYamlType !== FsYamlType.Hugo ||
          (main.cfg as LocalSystemConfig).contentLayout !== ContentLayoutLeafBundle
        "
        :label="t('setting.blog.type.fs.media.path')"
        data-syp-tour="imageStorePath"
      >
        <field-guide field="imageStorePath">
          <el-input
            v-model="(main.cfg as LocalSystemConfig).imageStorePath"
            :placeholder="t('setting.blog.type.fs.media.path.tip')"
          />
        </field-guide>
      </el-form-item>

      <!-- YAML类型 -->
      <el-form-item :label="t('setting.blog.type.fs.yaml.type')" data-syp-tour="fsYamlType">
        <field-guide field="fsYamlType" inline>
          <div class="yaml-type-radio-group">
            <el-radio v-model="(main.cfg as LocalSystemConfig).fsYamlType" :label="FsYamlType.Default" size="default">
              {{ t("setting.blog.type.fs.yaml.type.default") }}
            </el-radio>
            <el-radio v-model="(main.cfg as LocalSystemConfig).fsYamlType" :label="FsYamlType.Hexo" size="default">
              {{ t("setting.blog.type.fs.yaml.type.hexo") }}
            </el-radio>
            <el-radio v-model="(main.cfg as LocalSystemConfig).fsYamlType" :label="FsYamlType.Hugo" size="default">
              {{ t("setting.blog.type.fs.yaml.type.hugo") }}
            </el-radio>
            <el-radio v-model="(main.cfg as LocalSystemConfig).fsYamlType" :label="FsYamlType.Jekyll" size="default">
              {{ t("setting.blog.type.fs.yaml.type.jekyll") }}
            </el-radio>
            <el-radio v-model="(main.cfg as LocalSystemConfig).fsYamlType" :label="FsYamlType.Vuepress" size="default">
              {{ t("setting.blog.type.fs.yaml.type.vuepress") }}
            </el-radio>
            <el-radio v-model="(main.cfg as LocalSystemConfig).fsYamlType" :label="FsYamlType.Vuepress2" size="default">
              {{ t("setting.blog.type.fs.yaml.type.vuepress2") }}
            </el-radio>
            <el-radio v-model="(main.cfg as LocalSystemConfig).fsYamlType" :label="FsYamlType.Vitepress" size="default">
              {{ t("setting.blog.type.fs.yaml.type.vitepress") }}
            </el-radio>
            <el-radio v-model="(main.cfg as LocalSystemConfig).fsYamlType" :label="FsYamlType.Quartz" size="default">
              {{ t("setting.blog.type.fs.yaml.type.quartz") }}
            </el-radio>
            <el-radio v-model="(main.cfg as LocalSystemConfig).fsYamlType" :label="FsYamlType.Astro" size="default">
              {{ t("setting.blog.type.fs.yaml.type.astro") }}
            </el-radio>
          </div>
        </field-guide>
      </el-form-item>

      <!-- 内容组织方式：仅 Hugo YAML 类型支持页面目录（Leaf Bundle） -->
      <el-form-item
        v-if="(main.cfg as LocalSystemConfig).fsYamlType === FsYamlType.Hugo"
        :label="t('setting.blog.contentLayout')"
      >
        <field-guide field="contentLayout">
          <el-select v-model="(main.cfg as LocalSystemConfig).contentLayout" style="width: 100%">
            <el-option
              :label="t('setting.blog.contentLayout.single')"
              :value="ContentLayoutSingle"
            />
            <el-option
              :label="t('setting.blog.contentLayout.leafBundle')"
              :value="ContentLayoutLeafBundle"
            />
          </el-select>
        </field-guide>
      </el-form-item>
      <div
        v-if="
          (main.cfg as LocalSystemConfig).fsYamlType === FsYamlType.Hugo &&
          (main.cfg as LocalSystemConfig).contentLayout === ContentLayoutLeafBundle
        "
        class="bundle-image-tip"
      >
        {{ t("setting.blog.contentLayout.bundleImageTip") }}
      </div>
    </template>

    <template #footer="footer">
      <slot name="footer" :cfg="footer.cfg" />
    </template>
  </common-blog-setting>
</template>

<style scoped>
.yaml-type-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  margin-top: 4px;
}

.yaml-type-radio-group .el-radio {
  margin-bottom: 4px;
}

.bundle-image-tip {
  margin: -8px 0 12px;
  font-size: 12px;
  line-height: 18px;
  color: var(--el-text-color-secondary);
}
</style>
