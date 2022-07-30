<template>
  <el-form label-width="125px" ref="ruleFormRef" :model="ruleForm" :rules="rules" :size="formSize" status-icon>
    <el-form-item :label="$t('post.bind.vuepress.slug')" prop="vuepressSlug" v-if="vuepressEnabled">
      <el-input v-model="ruleForm.vuepressSlug"/>
    </el-form-item>

    <el-form-item :label="$t('post.bind.jvue.postid')" prop="jvuePostid" v-if="jvueEnabled">
      <el-input v-model="ruleForm.jvuePostid"/>
    </el-form-item>

    <el-form-item :label="$t('post.bind.conf.postid')" prop="confPostid" v-if="confEnabled">
      <el-input v-model="ruleForm.confPostid"/>
    </el-form-item>

    <el-form-item :label="$t('post.bind.cnblogs.postid')" prop="cnblogsPostid" v-if="cnblogsEnabled">
      <el-input v-model="ruleForm.cnblogsPostid"/>
    </el-form-item>

    <el-form-item :label="$t('post.bind.wordpress.postid')" prop="wordpressPostid" v-if="wordpressEnabled">
      <el-input v-model="ruleForm.wordpressPostid"/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">{{ $t('post.bind.conf.save') }}</el-button>
      <el-button @click="resetForm(ruleFormRef)">{{ $t('post.bind.conf.cancel') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {onBeforeMount, onMounted, reactive, ref, watch} from "vue";
import {getBooleanConf, setBooleanConf} from "../../lib/config";
import SWITCH_CONSTANTS from "../../constants/switchConstants";
import log from "../../lib/logUtil";
import type {FormInstance, FormRules} from 'element-plus'
import {useI18n} from "vue-i18n";
import {ElMessage} from "element-plus";
import {SIYUAN_PAGE_ATTR_KEY} from "../../constants/siyuanPageConstants";
import {PUBLISH_POSTID_KEY_CONSTANTS} from "../../lib/publishUtil";
import {getPageAttrs, getPageId, setPageAttrs} from "../../lib/siyuan/siyuanUtil";

const {t} = useI18n()

const vuepressEnabled = ref(true)
const jvueEnabled = ref(false)
const confEnabled = ref(false)
const cnblogsEnabled = ref(false)
const wordpressEnabled = ref(false)

const initConf = () => {
  vuepressEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY)
  jvueEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_JVUE_KEY)
  confEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_CONF_KEY)
  cnblogsEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_CNBLOGS_KEY)
  wordpressEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_WORDPRESS_KEY)
  log.logInfo("平台设置初始化")
}

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false
  }
})
/*监听props*/
watch(() => props.isReload, /**/(oldValue, newValue) => {
  // Here you can add you functionality
  // as described in the name you will get old and new value of watched property
  // 默认选中vuepress
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, true)
  initConf();
  log.logInfo("post-bind初始化")
})

onBeforeMount(async () => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, true)
  initConf();
  log.logInfo("post-bind初始化 onMounted")

  await initPage()
})

onMounted(() => {
})

const siyuanData = {
  pageId: "",
  meta: {}
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  vuepressSlug: '',
  jvuePostid: '',
  cnblogsPostid: '',
  confPostid: '',
  wordpressPostid: ''
})
const rules = reactive<FormRules>({
  vuepressSlug: [
    {
      required: true,
      // https://github.com/ElemeFE/element/issues/18823
      // message: t('form.validate.name.required'),
      message: () => t('form.validate.name.required'),
      trigger: 'blur'
    },
    {
      min: 3,
      max: 200,
      message: () => t('form.validate.name.length').replace('0', '3').replace('1', '200'),
      trigger: 'blur'
    },
  ],
  jvuePostid: [
    {
      required: true,
      message: () => t('form.validate.name.required')
    }
  ],
  cnblogsPostid: [
    {
      required: true,
      message: () => t('form.validate.name.required')
    }
  ],
  confPostid: [
    {
      required: true,
      message: () => t('form.validate.name.required')
    }
  ],
  wordpressPostid: [
    {
      required: true,
      message: () => t('form.validate.name.required')
    }
  ]
});

async function initPage() {
  const pageId = await getPageId(true)
  log.logInfo("PostBind pageId=>", pageId)
  if (!pageId || pageId == "") {
    return
  }
  const meta = await getPageAttrs(pageId)

  // 思源笔记属性
  siyuanData.pageId = pageId;
  siyuanData.meta = meta

  // 表单数据
  ruleForm.vuepressSlug = meta[PUBLISH_POSTID_KEY_CONSTANTS.VUEPRESS_POSTID_KEY]
  ruleForm.jvuePostid = meta[PUBLISH_POSTID_KEY_CONSTANTS.JVUE_POSTID_KEY]
  ruleForm.confPostid = meta[PUBLISH_POSTID_KEY_CONSTANTS.CONFLUENCE_POSTID_KEY]
  ruleForm.cnblogsPostid = meta[PUBLISH_POSTID_KEY_CONSTANTS.CNBLOGS_POSTID_KEY]
  ruleForm.wordpressPostid = meta[PUBLISH_POSTID_KEY_CONSTANTS.WORDPRESS_POSTID_KEY]
}

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

  const customAttr = {};

  // Vuepress
  if (vuepressEnabled.value && ruleForm.vuepressSlug != "") {
    Object.assign(customAttr, {
      [PUBLISH_POSTID_KEY_CONSTANTS.VUEPRESS_POSTID_KEY]: ruleForm.vuepressSlug
    })
  }

  // JVue
  if (jvueEnabled.value && ruleForm.jvuePostid != "") {
    Object.assign(customAttr, {
      [PUBLISH_POSTID_KEY_CONSTANTS.JVUE_POSTID_KEY]: ruleForm.jvuePostid
    })
  }

  // Confluence
  if (confEnabled.value && ruleForm.confPostid != "") {
    Object.assign(customAttr, {
      [PUBLISH_POSTID_KEY_CONSTANTS.CONFLUENCE_POSTID_KEY]: ruleForm.confPostid
    })
  }

  // Cnblogs
  if (cnblogsEnabled.value && ruleForm.cnblogsPostid != "") {
    Object.assign(customAttr, {
      [PUBLISH_POSTID_KEY_CONSTANTS.CNBLOGS_POSTID_KEY]: ruleForm.cnblogsPostid
    })
  }

  // Wordpress
  if (wordpressEnabled.value && ruleForm.wordpressPostid != "") {
    Object.assign(customAttr, {
      [PUBLISH_POSTID_KEY_CONSTANTS.WORDPRESS_POSTID_KEY]: ruleForm.wordpressPostid
    })
  }

  log.logWarn("PostBind保存属性到思源笔记,meta=>", customAttr);

  await setPageAttrs(siyuanData.pageId, customAttr)
  ElMessage.success(t('main.opt.success'))
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<script lang="ts">
export default {
  name: "PostBind"
}
</script>

<style scoped>

</style>