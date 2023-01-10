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
  <el-form label-width="120px">
    <el-alert
      class="top-version-tip"
      :title="apiTypeInfo + blogName"
      type="info"
      :closable="false"
    />
    <el-form-item :label="$t('setting.common.home')">
      <el-input
        v-model="home"
        :placeholder="props.cfg.placeholder.homePlaceholder"
      />
    </el-form-item>

    <el-form-item
      :label="$t('setting.common.username')"
      v-if="props.usernameEnabled"
    >
      <el-input
        v-model="username"
        :placeholder="props.cfg.placeholder.usernamePlaceholder"
      />
    </el-form-item>

    <el-form-item
      :label="$t('setting.common.password')"
      v-if="props.passwordEnabled"
    >
      <el-input
        type="password"
        v-model="password"
        show-password
        :placeholder="props.cfg.placeholder.passwordPlaceholder"
      />
      <a :href="tokenSettingUrl" target="_blank"
        >{{ $t("setting.common.username.gen") }}：{{ tokenSettingUrl }}</a
      >
    </el-form-item>

    <el-form-item :label="$t('setting.common.token')" v-if="props.tokenEnabled">
      <el-input
        type="password"
        v-model="token"
        show-password
        :placeholder="props.cfg.placeholder.passwordPlaceholder"
      />
      <a :href="tokenSettingUrl" target="_blank"
        >{{ $t("setting.common.token.gen") }}：{{ tokenSettingUrl }}</a
      >
    </el-form-item>

    <el-form-item :label="$t('setting.common.apiurl')">
      <el-input
        v-model="apiUrl"
        :placeholder="props.cfg.placeholder.apiUrlPlaceholder"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="valiConf" :loading="isLoading">
        {{ isLoading ? $t("setting.blog.vali.ing") : $t("setting.blog.vali") }}
      </el-button>
      <el-alert
        :title="$t('setting.blog.vali.tip.metaweblog')"
        type="warning"
        :closable="false"
        v-if="!apiStatus"
      />
      <el-alert
        :title="$t('setting.blog.vali.ok.metaweblog')"
        type="success"
        :closable="false"
        v-if="apiStatus"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="saveConf"
        >{{ $t("setting.blog.save") }}
      </el-button>
      <el-button>{{ $t("setting.blog.cancel") }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {
  CommonblogCfg,
  ICommonblogCfg,
} from "~/utils/platform/commonblog/commonblogCfg"
import { onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { isEmptyObject } from "~/utils/util"
import { API } from "~/utils/api"
import { LogFactory } from "~/utils/logUtil"
import { getJSONConf, setJSONConf } from "~/utils/configUtil"

const logger = LogFactory.getLogger(
  "components/publish/tab/setting/CommonBlogSetting.vue"
)

const { t } = useI18n()

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false,
  },
  apiType: {
    type: String,
    default: "",
  },
  cfg: {
    type: CommonblogCfg,
    default: null,
  },
  usernameEnabled: {
    type: Boolean,
    default: false,
  },
  passwordEnabled: {
    type: Boolean,
    default: false,
  },
  tokenEnabled: {
    type: Boolean,
    default: false,
  },
})

const home = ref("")
const apiUrl = ref("")
const username = ref("")
const password = ref("")
const token = ref("")

const isLoading = ref(false)
const apiStatus = ref(false)
const blogName = ref("")
const blogid = ref("")
const tokenSettingUrl = ref("")

const apiTypeInfo = ref(
  t("setting.blog.platform.support.common") + props.apiType + " "
)

const valiConf = async () => {
  isLoading.value = true

  try {
    // 先保存
    saveConf(true)

    const cfg = getJSONConf<ICommonblogCfg>(props.apiType)
    const api = new API(props.apiType)
    const usersBlogs = await api.getUsersBlogs()
    if (usersBlogs && usersBlogs.length > 0) {
      const userBlog = usersBlogs[0]

      cfg.apiStatus = true
      apiStatus.value = true

      cfg.blogName = userBlog.blogName
      blogName.value = userBlog.blogName
      cfg.blogid = userBlog.blogid
      blogid.value = userBlog.blogid

      // 验证通过刷新状态
      setJSONConf(props.apiType, cfg)
    } else {
      cfg.apiStatus = false
      apiStatus.value = false

      // 验证失败刷新状态
      setJSONConf(props.apiType, cfg)
    }
  } catch (e) {
    console.error(e)
  }

  if (!apiStatus.value) {
    ElMessage.error(t("setting.blog.vali.error"))
  } else {
    ElMessage.success(t("main.opt.success"))
  }

  isLoading.value = false

  logger.debug("通用Setting验证完毕")
}

const saveConf = (hideTip) => {
  logger.debug("Metaweblog通用Setting保存配置")

  const cfg = props.cfg
  cfg.home = home.value
  cfg.username = username.value
  cfg.password = password.value
  cfg.token = token.value
  cfg.apiUrl = apiUrl.value
  cfg.apiStatus = apiStatus.value
  cfg.blogName = blogName.value
  cfg.blogid = blogid.value

  setJSONConf(props.apiType, cfg)

  if (hideTip !== true) {
    ElMessage.success(t("main.opt.success"))
  }
}

const initConf = () => {
  logger.debug("通用Setting配置初始化")
  let conf = getJSONConf<ICommonblogCfg>(props.apiType)
  // 如果没有配置。读取默认配置
  if (isEmptyObject(conf)) {
    conf = props.cfg
  }
  if (conf) {
    logger.debug("get setting conf=>", conf)

    home.value = conf.home || ""
    apiUrl.value = conf.apiUrl || ""
    username.value = conf.username || ""
    password.value = conf.password || ""
    token.value = conf.token || ""
    apiStatus.value = conf.apiStatus || false
    blogName.value = conf.blogName || ""
    blogid.value = conf.blogid || ""
    tokenSettingUrl.value = conf.tokenSettingUrl || ""
  }
}

onMounted(async () => {
  // 初始化
  initConf()
})
</script>
