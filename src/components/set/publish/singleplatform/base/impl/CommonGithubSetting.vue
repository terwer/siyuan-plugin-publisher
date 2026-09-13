<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
// props
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { onBeforeMount, reactive, toRaw } from "vue"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { PicbedServiceTypeEnum } from "zhi-blog-api"
import FieldGuide from "~/src/components/common/help/FieldGuide.vue"

const logger = createAppLogger("common-blog-setting")

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
  cfg: {
    // 必须继承CommonGithubConfig
    type: Object,
    default: null,
  },
})

const { t } = useVueI18n()

const formData = reactive({
  showAdvancedConfig: false,
  advanceBtnText: "显示更多配置",
})

const toggleAdvance = () => {
  if (formData.showAdvancedConfig) {
    formData.showAdvancedConfig = !formData.showAdvancedConfig
    formData.advanceBtnText = "显示更多配置"
  } else {
    formData.showAdvancedConfig = !formData.showAdvancedConfig
    formData.advanceBtnText = "隐藏更多配置"
  }
}

const syncDefaultPath = (cfg: any) => {
  cfg.blogid = cfg.defaultPath
  logger.debug("sync defaultPath to blogid", { cfg: toRaw(cfg) })
}
</script>

<template>
  <common-blog-setting :api-type="props.apiType" :cfg="props.cfg">
    <template #header="header">
      <slot name="header" :cfg="header.cfg" />
    </template>

    <template #main="main">
      <!-- Github仓库名 -->
      <el-form-item :label="t('setting.blog.type.github.repo')">
        <field-guide field="githubRepo">
          <el-input v-model="(main.cfg as any).githubRepo" :placeholder="t('setting.blog.type.github.repo.tip')" />
        </field-guide>
      </el-form-item>
      <!-- YAML永久链接：仅在转换器会写入 permalink 的平台展示 -->
      <el-form-item v-if="(main.cfg as any).yamlLinkSupported != false" :label="t('setting.blog.yamlLinkEnabled')">
        <field-guide field="yamlLinkEnabled" inline>
          <el-switch v-model="(main.cfg as any).yamlLinkEnabled" />
        </field-guide>
      </el-form-item>
      <!-- Github分支名 -->
      <el-form-item :label="t('setting.blog.type.github.default.branch')">
        <field-guide field="githubBranch">
          <el-input
            v-model="(main.cfg as any).githubBranch"
            :placeholder="t('setting.blog.type.github.default.branch.tip')"
          />
        </field-guide>
      </el-form-item>
      <!-- 存储路径 -->
      <el-form-item :label="t('setting.blog.type.github.default.path')">
        <field-guide field="defaultPath">
          <el-input
            v-model="(main.cfg as any).defaultPath"
            @input="syncDefaultPath(main.cfg)"
            :placeholder="t('setting.blog.type.github.default.path.tip')"
          />
        </field-guide>
      </el-form-item>

      <!-- 文件规则 -->
      <el-form-item :label="t('setting.blog.mdFilenameRule')">
        <field-guide field="mdFilenameRule">
          <el-input v-model="(main.cfg as any).mdFilenameRule" :placeholder="t('setting.blog.mdFilenameRule.tip')" />
        </field-guide>
      </el-form-item>
      <!-- 文章预览规则 -->
      <el-form-item :label="t('setting.blog.previewPostUrl')">
        <field-guide field="previewPostUrl">
          <el-input v-model="(main.cfg as any).previewPostUrl" :placeholder="t('setting.blog.previewPostUrl.tip')" />
        </field-guide>
      </el-form-item>
      <el-form-item>
        <a href="javascript:;" @click="toggleAdvance">{{ formData.advanceBtnText }}</a>
      </el-form-item>
      <div v-if="formData.showAdvancedConfig">
        <!-- 提交信息 -->
        <el-form-item :label="t('setting.blog.type.github.msg')">
          <field-guide field="defaultMsg">
            <el-input v-model="(main.cfg as any).defaultMsg" :placeholder="t('setting.blog.type.github.msg.tip')" />
          </field-guide>
        </el-form-item>
        <!-- 作者 -->
        <el-form-item :label="t('setting.blog.type.github.author')">
          <field-guide field="author">
            <el-input v-model="(main.cfg as any).author" :placeholder="t('setting.blog.type.github.author')" />
          </field-guide>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item :label="t('setting.blog.type.github.email')">
          <field-guide field="email">
            <el-input v-model="(main.cfg as any).email" :placeholder="t('setting.blog.type.github.email.tip')" />
          </field-guide>
        </el-form-item>
        <!-- 作者主页 -->
        <el-form-item :label="t('setting.blog.type.github.site')">
          <field-guide field="site">
            <el-input v-model="(main.cfg as any).site" :placeholder="t('setting.blog.type.github.site.tip')" />
          </field-guide>
        </el-form-item>
      </div>
      <!-- YAML预设配置 -->
      <el-form-item :label="t('setting.blog.type.github.dyn.yaml')">
        <field-guide field="dynYamlCfg" tall>
          <el-input
            :autosize="{ minRows: 4, maxRows: 16 }"
            type="textarea"
            v-model="(main.cfg as any).dynYamlCfg"
            :placeholder="t('setting.blog.type.github.dyn.yaml.tip')"
          />
        </field-guide>
      </el-form-item>
      <!-- 图片存储路径 -->
      <el-form-item
        v-if="(main.cfg as any).picbedService === PicbedServiceTypeEnum.Bundled"
        :label="t('setting.blog.type.github.images.path')"
      >
        <field-guide field="imageStorePath">
          <el-input
            v-model="(main.cfg as any).imageStorePath"
            :placeholder="t('setting.blog.type.github.images.path.tip')"
          />
        </field-guide>
      </el-form-item>
      <!-- 图片访问链接 -->
      <el-form-item
        v-if="(main.cfg as any).picbedService === PicbedServiceTypeEnum.Bundled"
        :label="t('setting.blog.type.github.image.link.path')"
      >
        <field-guide field="imageLinkPath">
          <el-input
            v-model="(main.cfg as any).imageLinkPath"
            :placeholder="t('setting.blog.type.github.mage.link.path.tip')"
          />
        </field-guide>
      </el-form-item>
      <slot name="main" :cfg="main.cfg" />
    </template>

    <template #footer="footer">
      <slot name="footer" :cfg="footer.cfg" />
    </template>
  </common-blog-setting>
</template>

<style scoped lang="stylus">
.top-tip
  margin 4px 0
</style>
