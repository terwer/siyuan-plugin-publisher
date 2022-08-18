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

    <el-form-item :label="$t('post.bind.liandi.postid')" prop="liandiPostid" v-if="liandiEnabled">
      <el-input v-model="ruleForm.liandiPostid"/>
    </el-form-item>

    <el-form-item :label="$t('post.bind.yuque.postid')" prop="yuquePostid" v-if="yuqueEnabled">
      <el-input v-model="ruleForm.yuquePostid"/>
    </el-form-item>

    <el-form-item :label="$t('post.bind.kms.postid')" prop="kmsPostid" v-if="kmsEnabled">
      <el-input v-model="ruleForm.kmsPostid"/>
    </el-form-item>

    <!-- 动态配置 -->
    <el-form-item v-for="cfg in formData.dynamicConfigArray" :label="cfg.plantformName+' ID'" v-show="cfg.modelValue">
      <el-input v-model="cfg.posid"/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">{{ $t('post.bind.conf.save') }}</el-button>
      <el-button @click="resetForm(ruleFormRef)">{{ $t('post.bind.conf.cancel') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {onBeforeMount, onMounted, reactive, ref, watch} from "vue";
import {getArrayJSONConf, getBooleanConf, getConf, setBooleanConf} from "../../lib/config";
import SWITCH_CONSTANTS from "../../lib/constants/switchConstants";
import log from "../../lib/logUtil";
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";
import {getPageAttrs, getPageId, setPageAttrs} from "../../lib/platform/siyuan/siyuanUtil";
import {POSTID_KEY_CONSTANTS} from "../../lib/constants/postidKeyConstants";
import {isEmptyString} from "../../lib/util";
import {DynamicConfig} from "../../lib/dynamicConfig";
import {CONSTANTS} from "../../lib/constants/constants";

const {t} = useI18n()

const vuepressEnabled = ref(true)
const jvueEnabled = ref(false)
const confEnabled = ref(false)
const cnblogsEnabled = ref(false)
const wordpressEnabled = ref(false)
const liandiEnabled = ref(false)
const yuqueEnabled = ref(false)
const kmsEnabled = ref(false)

let formData = reactive({
  dynamicConfigArray: <Array<DynamicConfig>>[]
})

const initConf = () => {
  vuepressEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY)
  jvueEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_JVUE_KEY)
  confEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_CONF_KEY)
  cnblogsEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_CNBLOGS_KEY)
  wordpressEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_WORDPRESS_KEY)
  liandiEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_LIANDI_KEY)
  yuqueEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_YUQUE_KEY)
  kmsEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_KMS_KEY)

  // formData.dynamicConfigArray = getArrayJSONConf<Array<DynamicConfig>>(CONSTANTS.DYNAMIC_CONFIG_KEY)
  const results = getArrayJSONConf<Array<DynamicConfig>>(CONSTANTS.DYNAMIC_CONFIG_KEY)
  formData.dynamicConfigArray = []
  results.forEach(item => {

    const switchKey = "switch-" + item.plantformKey
    const switchValue = getBooleanConf(switchKey)
    item.modelValue = switchValue
    formData.dynamicConfigArray.push(item)
  });
  log.logInfo(formData.dynamicConfigArray)

  log.logInfo("平台设置初始化")
}

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false
  }
})
/*监听props*/
watch(() => props.isReload, /**/async (oldValue, newValue) => {
  // Here you can add you functionality
  // as described in the name you will get old and new value of watched property
  // 默认选中vuepress
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, true)
  initConf();
  await initPage()

  log.logInfo("post-bind初始化")
})

onBeforeMount(async () => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, true)
  initConf();
  await initPage()

  log.logInfo("post-bind初始化 onMounted")
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
  wordpressPostid: '',
  liandiPostid: '',
  yuquePostid: '',
  kmsPostid: ''
})
const rules = reactive<FormRules>({
  // vuepressSlug: [
  //   {
  //     required: true,
  //     // https://github.com/ElemeFE/element/issues/18823
  //     // message: t('form.validate.name.required'),
  //     message: () => t('form.validate.name.required'),
  //     trigger: 'blur'
  //   },
  //   {
  //     min: 3,
  //     max: 200,
  //     message: () => t('form.validate.name.length').replace('0', '3').replace('1', '200'),
  //     trigger: 'blur'
  //   },
  // ],
  // jvuePostid: [
  //   {
  //     required: true,
  //     message: () => t('form.validate.name.required')
  //   }
  // ],
  // cnblogsPostid: [
  //   {
  //     required: true,
  //     message: () => t('form.validate.name.required')
  //   }
  // ],
  // confPostid: [
  //   {
  //     required: true,
  //     message: () => t('form.validate.name.required')
  //   }
  // ],
  // wordpressPostid: [
  //   {
  //     required: true,
  //     message: () => t('form.validate.name.required')
  //   }
  // ],
  // liandiPostid: [
  //   {
  //     required: true,
  //     message: () => t('form.validate.name.required')
  //   }
  // ],
  // yuquePostid: [
  //   {
  //     required: true,
  //     message: () => t('form.validate.name.required')
  //   }
  // ],
  // kmsPostid: [
  //   {
  //     required: true,
  //     message: () => t('form.validate.name.required')
  //   }
  // ]
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
  ruleForm.vuepressSlug = meta[POSTID_KEY_CONSTANTS.VUEPRESS_POSTID_KEY]
  ruleForm.jvuePostid = meta[POSTID_KEY_CONSTANTS.JVUE_POSTID_KEY]
  ruleForm.confPostid = meta[POSTID_KEY_CONSTANTS.CONFLUENCE_POSTID_KEY]
  ruleForm.cnblogsPostid = meta[POSTID_KEY_CONSTANTS.CNBLOGS_POSTID_KEY]
  ruleForm.wordpressPostid = meta[POSTID_KEY_CONSTANTS.WORDPRESS_POSTID_KEY]
  ruleForm.liandiPostid = meta[POSTID_KEY_CONSTANTS.LIANDI_POSTID_KEY]
  ruleForm.yuquePostid = meta[POSTID_KEY_CONSTANTS.YUQUE_POSTID_KEY]
  ruleForm.kmsPostid = meta[POSTID_KEY_CONSTANTS.KMS_POSTID_KEY]

  // 组装动态文章ID
  const results = formData.dynamicConfigArray
  formData.dynamicConfigArray = []
  results.forEach(item => {
    const posidKey = "custom-" + item.plantformKey + "-post-id"
    item.posid = meta[posidKey] || ""
    formData.dynamicConfigArray.push(item)
  });
}

/**
 * 禁用模块或者未填写清空文章绑定
 * @param enabled
 * @param customAttr
 * @param key
 * @param value
 */
const assignPostid = (enabled: boolean, customAttr: object, key: any, value: string) => {
  if (enabled && !isEmptyString(value)) {
    Object.assign(customAttr, {
      [key]: value
    })
  } else {
    Object.assign(customAttr, {
      [key]: ""
    })
  }
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
  assignPostid(vuepressEnabled.value, customAttr, POSTID_KEY_CONSTANTS.VUEPRESS_POSTID_KEY, ruleForm.vuepressSlug)
  // JVue
  assignPostid(jvueEnabled.value, customAttr, POSTID_KEY_CONSTANTS.JVUE_POSTID_KEY, ruleForm.jvuePostid)
  // Confluence
  assignPostid(confEnabled.value, customAttr, POSTID_KEY_CONSTANTS.CONFLUENCE_POSTID_KEY, ruleForm.confPostid)
  // Cnblogs
  assignPostid(cnblogsEnabled.value, customAttr, POSTID_KEY_CONSTANTS.CNBLOGS_POSTID_KEY, ruleForm.cnblogsPostid)
  // Wordpress
  assignPostid(wordpressEnabled.value, customAttr, POSTID_KEY_CONSTANTS.WORDPRESS_POSTID_KEY, ruleForm.wordpressPostid)
  // Liandi
  assignPostid(liandiEnabled.value, customAttr, POSTID_KEY_CONSTANTS.LIANDI_POSTID_KEY, ruleForm.liandiPostid)
  // Yuque
  assignPostid(yuqueEnabled.value, customAttr, POSTID_KEY_CONSTANTS.YUQUE_POSTID_KEY, ruleForm.yuquePostid)
  // Kms
  assignPostid(kmsEnabled.value, customAttr, POSTID_KEY_CONSTANTS.KMS_POSTID_KEY, ruleForm.kmsPostid)

  // 动态绑定文章
  formData.dynamicConfigArray.forEach(item => {
    const posidKey = "custom-" + item.plantformKey + "-post-id"
    assignPostid(item.modelValue, customAttr, posidKey, item.posid)
  });

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