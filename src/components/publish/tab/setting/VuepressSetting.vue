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

    <el-form-item :label="$t('setting.blog.type.vuepress.github.default.branch')" prop="defaultBranch">
      <el-input v-model="formData.defaultBranch"
                :placeholder="$t('setting.blog.type.vuepress.github.default.branch.tip')"/>
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

    <el-form-item :label="$t('form.validate.vuepress.auto.delete')">
      <el-switch v-model="autoDeleteTest" @change="testOnChange"/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="valiConf" :loading="isLoading">
        {{ isLoading ? $t('setting.blog.vali.ing') : $t('setting.blog.vali') }}
      </el-button>
      <el-alert :title="$t('setting.blog.vali.tip')" type="warning" :closable="false" v-if="!apiStatus"/>
      <el-alert :title="$t('setting.blog.vali.ok')" type="success" :closable="false" v-if="apiStatus"/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)">{{ $t('setting.blog.save') }}</el-button>
      <el-button @click="resetForm(formRef)">{{ $t('setting.blog.cancel') }}</el-button>
    </el-form-item>
    <el-form-item>
      <a :href="formData.previewUrl" target="_blank">{{ formData.previewUrl }}</a>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {onBeforeMount, reactive, ref} from "vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {useI18n} from "vue-i18n";
import logUtil from "../../../../utils/logUtil";
import {getBooleanConf, getJSONConf, setBooleanConf, setJSONConf} from "../../../../utils/config";
import {API_TYPE_CONSTANTS} from "../../../../utils/constants/apiTypeConstants";
import {IVuepressCfg} from "../../../../utils/platform/vuepress/IVuepressCfg";
import {deletePage, publishPage} from "../../../../utils/platform/vuepress/v1";
import {VuepressCfg} from "../../../../utils/platform/vuepress/VuepressCfg";
import {formatIsoToZhDate} from "../../../../utils/util";
import {API_STATUS_CONSTANTS} from "../../../../utils/constants/apiStatusConstants";

const {t} = useI18n()

const isLoading = ref(false)
const apiStatus = ref(false)

const autoDeleteTest = ref(true)

const formSize = ref('default')
const formRef = ref<FormInstance>()
const formData = reactive({
  githubUser: "",
  githubRepo: "",
  githubToken: "",
  defaultBranch: "main",
  defaultPath: "docs/_posts/",
  msg: "auto published by sy-post-publisher",
  author: "terwer",
  email: "youweics@163.com",
  previewUrl: "#preview"
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
  defaultBranch: [
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

const testOnChange = (val: any) => {
  autoDeleteTest.value = val
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const result = await formEl.validate((valid, fields) => {
    if (valid) {
      logUtil.logInfo("校验成功")
    } else {
      logUtil.logError(t('main.opt.failure'), fields)
      // ElMessage.error(t('main.opt.failure'))
      return
    }
  })
  if (!result) {
    return
  }

  // 保存配置
  const vuepressCfg = new VuepressCfg(formData.githubUser, formData.githubRepo, formData.githubToken,
      formData.defaultBranch, formData.defaultPath, formData.msg, formData.author, formData.email);
  setJSONConf<IVuepressCfg>(API_TYPE_CONSTANTS.API_TYPE_VUEPRESS, vuepressCfg)
  ElMessage.success(t('main.opt.success'))
}

const valiConf = async () => {
  isLoading.value = true;

  const vuepressCfg = new VuepressCfg(formData.githubUser, formData.githubRepo, formData.githubToken,
      formData.defaultBranch, formData.defaultPath, formData.msg, formData.author, formData.email);
  // const vuepressCfg = getJSONConf<IVuepressCfg>(API_TYPE_CONSTANTS.API_TYPE_VUEPRESS)
  const testFile = "test.md"

  const docPath = formData.defaultPath + testFile
  const mdContent = "Hello World!" + formatIsoToZhDate(new Date().toISOString(), true)
  const res = await publishPage(vuepressCfg, docPath, mdContent)

  isLoading.value = false

  if (!res) {
    // 验证不通过，更新验证状态
    apiStatus.value = false
    setBooleanConf(API_STATUS_CONSTANTS.API_STATUS_VUEPRESS, apiStatus.value)
    ElMessage.error(t('main.opt.failure'))
    return
  }

  // 自动删除测试文章
  if(autoDeleteTest.value){
    await deletePage(vuepressCfg,docPath)
  }

  // 验证通过，更新验证状态
  apiStatus.value = true
  setBooleanConf(API_STATUS_CONSTANTS.API_STATUS_VUEPRESS, apiStatus.value)

  // 预览
  formData.previewUrl = "https://github.com/" + formData.githubUser + "/" + formData.githubRepo
      + "/blob/" + formData.defaultBranch + "/" + formData.defaultPath + testFile
  ElMessage.success(t('main.opt.success'))
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const initConf = () => {
  logUtil.logInfo("Vuepress配置初始化")
  const conf = getJSONConf<IVuepressCfg>(API_TYPE_CONSTANTS.API_TYPE_VUEPRESS)
  if (conf) {
    logUtil.logInfo("vuepress conf=>", conf)
    formData.githubUser = conf.githubUser
    formData.githubRepo = conf.githubRepo
    formData.githubToken = conf.githubToken
    formData.defaultBranch = conf.defaultBranch
    formData.defaultPath = conf.defaultPath
    formData.msg = conf.defaultMsg
    formData.author = conf.author
    formData.email = conf.email
  }

  // api状态
  apiStatus.value = getBooleanConf(API_STATUS_CONSTANTS.API_STATUS_VUEPRESS);
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
.el-alert {
  margin-top: 10px;
}
</style>