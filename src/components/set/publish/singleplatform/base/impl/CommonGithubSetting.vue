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
// props
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { reactive, toRaw } from "vue"
import { createAppLogger } from "~/src/utils/appLogger.ts"

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
        <el-input v-model="(main.cfg as any).githubRepo" :placeholder="t('setting.blog.type.github.repo.tip')" />
      </el-form-item>
      <el-form-item :label="t('setting.blog.yamlLinkEnabled')">
        <el-switch v-model="(main.cfg as any).yamlLinkEnabled" />
      </el-form-item>
      <el-form-item>
        <a href="javascript:;" @click="toggleAdvance">{{ formData.advanceBtnText }}</a>
      </el-form-item>
      <!-- Github分支名 -->
      <el-form-item :label="t('setting.blog.type.github.default.branch')">
        <el-input
          v-model="(main.cfg as any).githubBranch"
          :placeholder="t('setting.blog.type.github.default.branch.tip')"
        />
      </el-form-item>
      <!-- 存储路径 -->
      <el-form-item :label="t('setting.blog.type.github.default.path')">
        <el-input
          v-model="(main.cfg as any).defaultPath"
          @input="syncDefaultPath(main.cfg)"
          :placeholder="t('setting.blog.type.github.default.path.tip')"
        />
      </el-form-item>
      <div v-if="formData.showAdvancedConfig">
        <!-- 提交信息 -->
        <el-form-item :label="t('setting.blog.type.github.msg')">
          <el-input v-model="(main.cfg as any).defaultMsg" :placeholder="t('setting.blog.type.github.msg.tip')" />
        </el-form-item>
        <!-- 作者 -->
        <el-form-item :label="t('setting.blog.type.github.author')">
          <el-input v-model="(main.cfg as any).author" :placeholder="t('setting.blog.type.github.author')" />
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item :label="t('setting.blog.type.github.email')">
          <el-input v-model="(main.cfg as any).email" :placeholder="t('setting.blog.type.github.email.tip')" />
        </el-form-item>
        <!-- 文件规则 -->
        <el-form-item :label="t('setting.blog.mdFilenameRule')">
          <el-input
            v-model="(main.cfg as any).mdFilenameRule"
            :placeholder="t('setting.blog.mdFilenameRule.tip')"
            :disabled="true"
          />
        </el-form-item>
        <!-- 文章预览规则 -->
        <el-form-item :label="t('setting.blog.previewPostUrl')">
          <el-input v-model="(main.cfg as any).previewPostUrl" :placeholder="t('setting.blog.previewPostUrl.tip')" />
        </el-form-item>
      </div>
      <slot name="main" :cfg="main.cfg" />
    </template>

    <template #footer="footer">
      <slot name="footer" :cfg="footer.cfg" />
    </template>
  </common-blog-setting>
</template>

<style scoped lang="stylus">
.top-tip
  margin 10px 0
  padding-left 0
</style>
