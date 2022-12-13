<!--
  - Copyright (c) 2022, Terwer . All rights reserved.
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
  <el-form
    label-width="120px"
    ref="formRef"
    :model="formData"
    :rules="rules"
    status-icon
  >
    <!-- 编辑模式 -->
    <el-form-item :label="$t('main.publish.editmode')">
      <el-button-group>
        <el-button :type="editMode ? 'default' : 'primary'" @click="simpleMode"
          >{{ $t("main.publish.editmode.simple") }}
        </el-button>
        <el-button :type="editMode ? 'primary' : 'default'" @click="complexMode"
          >{{ $t("main.publish.editmode.complex") }}
        </el-button>
      </el-button-group>
    </el-form-item>

    <div class="github-setting-basic">
      <el-form-item
        :label="$t('setting.blog.type.github.user')"
        prop="githubUser"
      >
        <el-input
          v-model="formData.githubUser"
          :placeholder="$t('setting.blog.type.github.user.tip')"
        />
      </el-form-item>

      <el-form-item
        :label="$t('setting.blog.type.github.repo')"
        prop="githubRepo"
      >
        <el-input
          v-model="formData.githubRepo"
          :placeholder="$t('setting.blog.type.github.repo.tip')"
        />
      </el-form-item>

      <el-form-item
        :label="$t('setting.blog.type.github.default.branch')"
        prop="defaultBranch"
      >
        <el-input
          v-model="formData.defaultBranch"
          :placeholder="$t('setting.blog.type.github.default.branch.tip')"
        />
      </el-form-item>

      <el-form-item
        :label="$t('setting.blog.type.github.token')"
        prop="githubToken"
      >
        <el-input
          type="password"
          v-model="formData.githubToken"
          :placeholder="$t('setting.blog.type.github.token.tip')"
          show-password
        />
        <a href="https://github.com/settings/tokens/new" target="_blank">{{
          $t("setting.blog.type.github.token.gen")
        }}</a>
      </el-form-item>
    </div>

    <div class="github-setting-advanced" v-if="editMode">
      <el-form-item
        :label="$t('setting.blog.type.github.default.path')"
        prop="defaultPath"
      >
        <el-input
          v-model="formData.defaultPath"
          :placeholder="$t('setting.blog.type.github.default.path.tip')"
        />
      </el-form-item>

      <el-form-item :label="$t('setting.blog.type.github.msg')" prop="msg">
        <el-input
          v-model="formData.msg"
          :placeholder="$t('setting.blog.type.github.msg.tip')"
        />
      </el-form-item>

      <el-form-item
        :label="$t('setting.blog.type.github.author')"
        prop="author"
      >
        <el-input
          v-model="formData.author"
          :placeholder="$t('setting.blog.type.github.author.tip')"
        />
      </el-form-item>

      <el-form-item :label="$t('setting.blog.type.github.email')" prop="email">
        <el-input
          v-model="formData.email"
          :placeholder="$t('setting.blog.type.github.email.tip')"
        />
      </el-form-item>

      <el-form-item :label="$t('setting.common.home')">
        <el-input
          v-model="formData.home"
          :placeholder="$t('setting.common.tip')"
        />
      </el-form-item>

      <el-form-item :label="$t('setting.github.baseUrl')">
        <el-input
          v-model="formData.baseUrl"
          :placeholder="$t('setting.github.baseUrl.tip')"
        />
      </el-form-item>

      <el-form-item :label="$t('setting.blog.previewMdUrl')">
        <el-input
          v-model="formData.previewMdUrl"
          :placeholder="$t('setting.blog.previewMdUrl.tip')"
        />
      </el-form-item>

      <el-form-item :label="$t('setting.blog.previewUrl')">
        <el-input
          v-model="formData.previewUrl"
          :placeholder="$t('setting.blog.previewUrl.tip')"
        />
      </el-form-item>

      <el-form-item :label="$t('setting.blog.mdFilenameRule')">
        <el-input
          v-model="formData.mdFilenameRule"
          :placeholder="$t('setting.blog.mdFilenameRule.tip')"
        />
      </el-form-item>
    </div>

    <el-form-item :label="$t('form.validate.github.auto.delete')">
      <el-switch v-model="autoDeleteTest" @change="testOnChange" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="valiConf" :loading="isLoading">
        {{ isLoading ? $t("setting.blog.vali.ing") : $t("setting.blog.vali") }}
      </el-button>
      <el-alert
        :title="$t('setting.blog.vali.tip')"
        type="warning"
        :closable="false"
        v-if="!apiStatus"
      />
      <el-alert
        :title="$t('setting.blog.vali.ok')"
        type="success"
        :closable="false"
        v-if="apiStatus"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)"
        >{{ $t("setting.blog.save") }}
      </el-button>
      <el-button @click="resetForm(formRef)"
        >{{ $t("setting.blog.cancel") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue"
import { ElMessage, FormRules } from "element-plus"
import { useI18n } from "vue-i18n"
import { GithubCfg, IGithubCfg } from "~/utils/platform/github/githubCfg"
import { LogFactory } from "~/utils/logUtil"
import { getJSONConf, setJSONConf } from "~/utils/configUtil"
import { API } from "~/utils/api"
import { Post } from "~/utils/models/post"
import { isEmptyObject } from "~/utils/util"

const logger = LogFactory.getLogger(
  "components/publish/tab/setting/GithubSetting.vue"
)

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
    type: GithubCfg,
    default: null,
  },
})

const { t } = useI18n()

const editMode = ref(false)
const isLoading = ref(false)
const apiStatus = ref(false)

const autoDeleteTest = ref(true)

const formRef = ref()
const formData = reactive({
  githubUser: "",
  githubRepo: "",
  githubToken: "",
  defaultBranch: "main",
  defaultPath: "docs/_posts",
  msg: "auto published by sy-post-publisher",
  author: "terwer",
  email: "youweics@163.com",
  home: "",
  baseUrl: "",
  previewMdUrl: "",
  previewUrl: "",
  mdFilenameRule: "[filename]",
})
const rules = reactive<FormRules>({
  githubUser: [
    {
      required: true,
      message: () => t("form.validate.name.required"),
    },
  ],
  githubRepo: [
    {
      required: true,
      message: () => t("form.validate.name.required"),
    },
  ],
  githubToken: [
    {
      required: true,
      message: () => t("form.validate.name.required"),
    },
  ],
  defaultBranch: [
    {
      required: true,
      message: () => t("form.validate.name.required"),
    },
  ],
  defaultPath: [
    {
      required: true,
      message: () => t("form.validate.name.required"),
    },
  ],
  msg: [
    {
      required: true,
      message: () => t("form.validate.name.required"),
    },
  ],
  author: [
    {
      required: true,
      message: () => t("form.validate.name.required"),
    },
  ],
  email: [
    {
      required: true,
      message: () => t("form.validate.name.required"),
    },
  ],
})

const simpleMode = () => {
  editMode.value = false
}
const complexMode = () => {
  editMode.value = true
}

const testOnChange = (val) => {
  autoDeleteTest.value = val
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}

const submitForm = async (formEl) => {
  if (!formEl) return

  const result = await formEl.validate((valid, fields) => {
    if (valid) {
      logger.debug("校验成功")
    } else {
      logger.error(t("main.opt.failure"), fields)
      // ElMessage.error(t('main.opt.failure'))
    }
  })
  if (!result) {
    return
  }

  // 保存配置
  saveConf(false)
}

const valiConf = async () => {
  isLoading.value = true

  // 先保存
  saveConf(true)

  const cfg = getJSONConf<IGithubCfg>(props.apiType)

  let err
  try {
    const api = new API(props.apiType)
    const commonPost = new Post()
    commonPost.postid = "content/post/test.md"
    commonPost.description = "# Hello world"

    let res

    try {
      res = await api.newPost(commonPost)
    } catch (e) {
      err = e
      cfg.apiStatus = false
      apiStatus.value = false
    }

    if (!res) {
      // 验证不通过，更新验证状态
      cfg.apiStatus = false
      apiStatus.value = false
    } else {
      cfg.apiStatus = true
      apiStatus.value = true
    }

    // 自动删除测试文章
    if (autoDeleteTest.value) {
      await api.deletePost(commonPost.postid)
    }
  } catch (e) {
    cfg.apiStatus = false
    apiStatus.value = false
    logger.error(e)
  }

  // 刷新状态
  setJSONConf(props.apiType, cfg)

  if (!apiStatus.value) {
    if (err) {
      ElMessage.error(t("setting.blog.vali.error") + "=>" + err)
    } else {
      ElMessage.error(t("setting.blog.vali.error"))
    }
  } else {
    ElMessage.success(t("main.opt.success"))
  }

  isLoading.value = false
}

const saveConf = (hideTip) => {
  const cfg = props.cfg
  cfg.githubUser = formData.githubUser
  cfg.githubRepo = formData.githubRepo
  cfg.githubToken = formData.githubToken
  cfg.defaultPath = formData.defaultPath
  cfg.defaultBranch = formData.defaultBranch
  cfg.defaultMsg = formData.msg
  cfg.author = formData.author
  cfg.email = formData.email
  cfg.home = formData.home
  cfg.baseUrl = formData.baseUrl
  cfg.previewMdUrl = formData.previewMdUrl
  cfg.previewUrl = formData.previewUrl
  cfg.mdFilenameRule = formData.mdFilenameRule

  cfg.apiStatus = apiStatus.value

  setJSONConf(props.apiType, cfg)

  if (hideTip !== true) {
    ElMessage.success(t("main.opt.success"))
  }
}

const initConf = () => {
  let conf = getJSONConf<IGithubCfg>(props.apiType)
  // 如果没有配置。读取默认配置
  if (isEmptyObject(conf)) {
    conf = props.cfg
  }

  if (conf) {
    formData.githubUser = conf.githubUser
    formData.githubRepo = conf.githubRepo
    formData.githubToken = conf.githubToken
    formData.defaultPath = conf.defaultPath
    formData.defaultBranch = conf.defaultBranch
    formData.msg = conf.defaultMsg
    formData.author = conf.author
    formData.email = conf.email
    formData.home = conf.home
    formData.baseUrl = conf.baseUrl
    formData.previewMdUrl = conf.previewMdUrl
    formData.previewUrl = conf.previewUrl
    formData.mdFilenameRule = conf.mdFilenameRule

    apiStatus.value = conf.apiStatus
  }
}

onMounted(async () => {
  // 初始化
  initConf()
})
</script>
