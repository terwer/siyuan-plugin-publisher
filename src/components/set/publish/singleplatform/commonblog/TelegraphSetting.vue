<!--
  - Copyright (c) 2024, Terwer . All rights reserved.
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
import { useTelegraphApi } from "~/src/adaptors/api/telegraph/useTelegraphApi.ts"
import { TelegraphConfig, TelegraphPostType } from "~/src/adaptors/api/telegraph/telegraphConfig.ts"
import { TelegraphPlaceholder } from "~/src/adaptors/api/telegraph/telegraphPlaceholder.ts"

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

const { t } = useVueI18n()
const { cfg } = await useTelegraphApi(props.apiType)
const telegraphCfg = cfg as TelegraphConfig
telegraphCfg.usernameLabel = t("setting.telegraph.username.label")
telegraphCfg.passwordLabel = t("setting.telegraph.password.label")
const telegraphPlaceholder = new TelegraphPlaceholder()
telegraphPlaceholder.homePlaceholder = t("setting.telegraph.home.tip")
telegraphPlaceholder.usernamePlaceholder = t("setting.telegraph.username.tip")
telegraphPlaceholder.passwordPlaceholder = t("setting.telegraph.password.tip")
telegraphPlaceholder.apiUrlPlaceholder = t("setting.telegraph.apiurl.tip")
telegraphPlaceholder.previewUrlPlaceholder = t("setting.telegraph.previewUrl.tip")
telegraphCfg.placeholder = telegraphPlaceholder

const handlePostTypeChange = (val: UnwrapRef<TelegraphConfig>) => {
  val.password = ""
  val.accessToken = ""
  val.saveHash = ""
}
</script>

<template>
  <common-blog-setting :api-type="props.apiType" :cfg="telegraphCfg">
    <template #header="header">
      <el-form-item label="登录模式" required>
        <el-radio-group
          v-model="(header.cfg as TelegraphConfig).postType"
          class="ml-4"
          @change="
            () => {
              handlePostTypeChange(header.cfg)
            }
          "
        >
          <el-radio :value="TelegraphPostType.ANONYMOUS" size="large">
            {{ t("setting.telegraph.login.anonymous") }}
          </el-radio>
          <el-radio :value="TelegraphPostType.LOGIN_USER" size="large">
            {{ t("setting.telegraph.login.user") }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </template>
    <template #main="main">
      <!-- Access Token -->
      <el-form-item
        v-if="(main.cfg as TelegraphConfig).postType === TelegraphPostType.LOGIN_USER"
        label="Access Token"
        required
      >
        <el-input
          v-model="(main.cfg as TelegraphConfig).accessToken"
          :placeholder="t('setting.telegraph.accessToken.tip')"
          type="password"
          show-password
        />
      </el-form-item>
      <!-- save hash -->
      <el-form-item label="Hash" required>
        <el-input
          v-model="(main.cfg as TelegraphConfig).saveHash"
          :placeholder="t('setting.telegraph.saveHash.tip')"
          type="password"
          show-password
        />
      </el-form-item>
      <el-form-item label="刷新授权">
        <el-switch
          v-model="(main.cfg as TelegraphConfig).forceReAuth"
          :placeholder="t('setting.telegraph.forceReAuth.tip')"
        />
      </el-form-item>
    </template>
    <template #footer="footer"></template>
  </common-blog-setting>
</template>
