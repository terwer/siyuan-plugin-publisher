<template>
  <el-form label-width="120px" ref="formRef" :model="formData" :rules="rules" status-icon>
    <!-- 编辑模式 -->
    <el-form-item :label="$t('main.publish.vuepress.editmode')">
      <el-button-group>
        <el-button :type="editMode?'default':'primary'" @click="simpleMode">{{
            $t('main.publish.vuepress.editmode.simple')
          }}
        </el-button>
        <el-button :type="editMode?'primary':'default'" @click="complexMode">{{
            $t('main.publish.vuepress.editmode.complex')
          }}
        </el-button>
      </el-button-group>
    </el-form-item>
    <div class="github-setting-basic">
      <el-form-item>
        <div>github setting=> {{ props.apiType }}</div>
      </el-form-item>

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
    </div>

    <div class="github-setting-advanced" v-if="editMode">
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
    </div>

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
import {reactive, ref} from "vue";
import {FormInstance, FormRules} from "element-plus";
import {useI18n} from "vue-i18n";
import {GithubCfg} from "~/utils/platform/github/githubCfg";

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false
  },
  apiType: {
    type: String,
    default: ""
  },
  cfg: {
    type: GithubCfg,
    default: null
  }
})

const {t} = useI18n()

const editMode = ref(false)
const isLoading = ref(false)
const apiStatus = ref(false)

const autoDeleteTest = ref(true)

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

const simpleMode = () => {
  editMode.value = false
}
const complexMode = () => {
  editMode.value = true
}

const testOnChange = (val: any) => {
  autoDeleteTest.value = val
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
}
const valiConf = async () => {
}
</script>

<script lang="ts">
export default {
  name: "GithubSetting"
}
</script>

<style scoped>

</style>