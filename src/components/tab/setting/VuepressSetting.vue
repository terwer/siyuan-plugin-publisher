<template>
  <el-form label-width="120px" ref="formRef" :model="formData" :rules="rules" :size="formSize" status-icon>
    <el-form-item :label="$t('setting.blog.type.vuepress.github.user')" prop="githubUser">
      <el-input v-model="formData.githubUser" :placeholder="$t('setting.blog.type.vuepress.github.user.tip')"/>
    </el-form-item>

    <el-form-item :label="$t('setting.blog.type.vuepress.github.repo')" prop="githubRepo">
      <el-input v-model="formData.githubRepo" :placeholder="$t('setting.blog.type.vuepress.github.repo.tip')"/>
    </el-form-item>

    <el-form-item :label="$t('setting.blog.type.vuepress.github.token')" prop="githubToken">
      <el-input type="password" v-model="formData.githubToken"
                :placeholder="$t('setting.blog.type.vuepress.github.token.tip')" show-password/>
      <a href="https://github.com/settings/tokens/new"
         target="_blank">{{ $t('setting.blog.type.vuepress.github.token.gen') }}</a>
    </el-form-item>

    <el-form-item :label="$t('setting.blog.type.vuepress.github.default.path')" prop="defaultPath">
      <el-input v-model="formData.defaultPath" :placeholder="$t('setting.blog.type.vuepress.github.default.path.tip')"/>
    </el-form-item>
    <el-form-item :label="$t('setting.blog.type.vuepress.github.msg')" prop="msg">
      <el-input v-model="formData.msg" :placeholder="$t('setting.blog.type.vuepress.github.msg.tip')"/>
    </el-form-item>

    <el-form-item :label="$t('setting.blog.type.vuepress.github.author')" prop="author">
      <el-input v-model="formData.author" :placeholder="$t('setting.blog.type.vuepress.github.author.tip')"/>
    </el-form-item>

    <el-form-item :label="$t('setting.blog.type.vuepress.github.email')" prop="email">
      <el-input v-model="formData.email" :placeholder="$t('setting.blog.type.vuepress.github.email.tip')"/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)">{{ $t('setting.blog.save') }}</el-button>
      <el-button type="primary" @click="valiConf">{{ $t('setting.blog.vali') }}</el-button>
      <el-button @click="resetForm(formRef)">{{ $t('setting.blog.cancel') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {onBeforeMount, reactive, ref} from "vue";
import {FormInstance, FormRules} from "element-plus";
import {useI18n} from "vue-i18n";
import log from "../../../lib/logUtil";
import {getJSONConf, setJSONConf} from "../../../lib/config";
import {API_TYPE_CONSTANTS} from "../../../lib/constants/apiTypeConstants";
import {IVuepressCfg} from "../../../lib/vuepress/IVuepressCfg";
import {publishPage} from "../../../lib/vuepress/v1";
import {VuepressCfg} from "../../../lib/vuepress/VuepressCfg";
import {formatNumToZhDate} from "../../../lib/util";

const {t} = useI18n()
import {ElMessage} from "element-plus";

const formSize = ref('default')
const formRef = ref<FormInstance>()
const formData = reactive({
  githubUser: "",
  githubRepo: "",
  githubToken: "",
  defaultPath: "docs/_posts/",
  msg: "auto published by sy-post-publisher",
  author: "terwer",
  email: "youweics@163.com"
})
const rules = reactive<FormRules>({
  githubUser: [
    {
      required: true,
      message: () => t('form.validate.name.required')
    }
  ],
  githubRepo: [
    {
      required: true,
      message: () => t('form.validate.name.required')
    }
  ],
  githubToken: [
    {
      required: true,
      message: () => t('form.validate.name.required')
    }
  ],
  defaultPath: [
    {
      required: true,
      message: () => t('form.validate.name.required')
    }
  ],
  msg: [
    {
      required: true,
      message: () => t('form.validate.name.required')
    }
  ],
  author: [
    {
      required: true,
      message: () => t('form.validate.name.required')
    }
  ],
  email: [
    {
      required: true,
      message: () => t('form.validate.name.required')
    }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const result = await formEl.validate((valid, fields) => {
    if (valid) {
      log.logInfo("校验成功")
    } else {
      log.logError(t('main.opt.failure'), fields)
      // ElMessage.error(t('main.opt.failure'))
      return
    }
  })
  if (!result) {
    return
  }

  // 保存配置
  const vuepressCfg = new VuepressCfg(formData.githubUser, formData.githubRepo, formData.githubToken, formData.defaultPath,
      formData.msg, formData.author, formData.email);
  setJSONConf<IVuepressCfg>(API_TYPE_CONSTANTS.API_TYPE_VUEPRESS, vuepressCfg)
  ElMessage.success(t('main.opt.success'))
}
const valiConf = async () => {
  const vuepressCfg = new VuepressCfg(formData.githubUser, formData.githubRepo, formData.githubToken, formData.defaultPath,
      formData.msg, formData.author, formData.email);
  // const vuepressCfg = getJSONConf<IVuepressCfg>(API_TYPE_CONSTANTS.API_TYPE_VUEPRESS)
  const docPath = formData.defaultPath + "test.md"
  const mdContent = "Hello World!" + formatNumToZhDate(new Date().toISOString())
  const res = await publishPage(vuepressCfg, docPath, mdContent)
  if (!res) {
    ElMessage.error(t('main.opt.failure'))
  }
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const initConf = () => {
  log.logInfo("Vuepress配置初始化")
  const conf = getJSONConf<IVuepressCfg>(API_TYPE_CONSTANTS.API_TYPE_VUEPRESS)
  if (conf) {
    log.logInfo("vuepress conf=>", conf)
    formData.githubUser = conf.githubUser
    formData.githubRepo = conf.githubRepo
    formData.githubToken = conf.githubToken
    formData.defaultPath = conf.defaultPath
    formData.msg = conf.defaultMsg
    formData.author = conf.author
    formData.email = conf.email
  }
}
onBeforeMount(async () => {
  initConf();
})

</script>

<script lang="ts">
export default {
  name: "VuepressSetting"
}
</script>

<style scoped>

</style>