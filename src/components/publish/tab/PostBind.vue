<template>
  <el-form label-width="125px" ref="ruleFormRef" :model="ruleForm" :rules="rules" :size="formSize" status-icon v-if="tabCountStore.tabCount>0">
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
    <el-form-item v-for="cfg in formData.dynamicConfigArray"
                  :label="cfg.plantformName+'_'+cfg.plantformType.toUpperCase().substring(0,1)+' ID'"
                  v-show="cfg.modelValue">
      <el-input v-model="cfg.posid"/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">{{ $t('post.bind.conf.save') }}</el-button>
      <el-button @click="resetForm(ruleFormRef)">{{ $t('post.bind.conf.cancel') }}</el-button>
    </el-form-item>
  </el-form>
  <div v-else>
    <el-alert class="top-version-tip" :title="$t('config.platform.none')" type="error" :closable="false"/>
  </div>
</template>

<script lang="ts" setup>
import {onBeforeMount, onMounted, reactive, ref, watch} from "vue";
import {getBooleanConf} from "../../../utils/config";
import logUtil from "../../../utils/logUtil";
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";
import {getPageAttrs, getPageId, setPageAttrs} from "../../../utils/platform/siyuan/siyuanUtil";
import {POSTID_KEY_CONSTANTS} from "../../../utils/constants/postidKeyConstants";
import {isEmptyString} from "../../../utils/util";
import {DynamicConfig, getDynamicJsonCfg} from "../../../utils/dynamicConfig";
import {useTabCount} from "../../../composables/tabCountCom";

// use
const {t} = useI18n()
const {
  tabCountStore,
  vuepressEnabled,
  jvueEnabled,
  confEnabled,
  cnblogsEnabled,
  wordpressEnabled,
  liandiEnabled,
  yuqueEnabled,
  kmsEnabled,
  doCount
} = useTabCount()

let formData = reactive({
  dynamicConfigArray: <Array<DynamicConfig>>[]
})

const initConf = () => {
  doCount()

  const dynamicJsonCfg = getDynamicJsonCfg()
  const results = dynamicJsonCfg.totalCfg || []
  formData.dynamicConfigArray = []
  results.forEach(item => {
    const switchKey = "switch-" + item.plantformKey
    const switchValue = getBooleanConf(switchKey)
    item.modelValue = switchValue
    formData.dynamicConfigArray.push(item)
  });
  logUtil.logInfo(formData.dynamicConfigArray)

  logUtil.logInfo("平台设置初始化")
}

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false
  },
  pageId: {
    type: String,
    default: undefined
  }
})

/*监听props*/
watch(() => props.isReload, /**/async (oldValue, newValue) => {
  // Here you can add you functionality
  // as described in the name you will get old and new value of watched property
  initConf();
  await initPage()

  // logUtil.logInfo("post-bind初始化")
})

onBeforeMount(async () => {
  initConf();
  await initPage()

  // logUtil.logInfo("post-bind初始化 onMounted")
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
  const pageId = await getPageId(true, props.pageId)
  logUtil.logInfo("PostBind pageId=>", pageId)
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

  logUtil.logInfo("PostBind保存属性到思源笔记,meta=>", customAttr);

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