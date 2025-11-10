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
import { useTelegraphApi } from "~/src/adaptors/api/telegraph/useTelegraphApi.ts"
import { TelegraphConfig, TelegraphPostType } from "~/src/adaptors/api/telegraph/telegraphConfig.ts"
import { TelegraphPlaceholder } from "~/src/adaptors/api/telegraph/telegraphPlaceholder.ts"
import { UnwrapRef } from "vue"

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
              handlePostTypeChange(header.cfg as any)
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
