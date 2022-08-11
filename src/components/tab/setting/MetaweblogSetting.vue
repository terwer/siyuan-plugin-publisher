<template>
  <el-form label-width="120px">
    <el-form-item :label="$t('setting.blog.url')">
      <el-input v-model="home"/>
    </el-form-item>

    <el-form-item :label="$t('setting.blog.username')">
      <el-input v-model="username"/>
    </el-form-item>

    <el-form-item :label="$t('setting.blog.password')">
      <el-input type="password" v-model="password" show-password/>
    </el-form-item>

    <el-form-item :label="$t('setting.blog.apiurl')">
      <el-input v-model="apiUrl"/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary">{{ $t('setting.blog.validate') }}</el-button>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="saveConf">{{ $t('setting.blog.save') }}</el-button>
      <el-button>{{ $t('setting.blog.cancel') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import log from "../../../lib/logUtil";
import {getJSONConf, setJSONConf} from "../../../lib/config";
import {ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";
import {IMetaweblogCfg} from "../../../lib/metaweblog/IMetaweblogCfg";
import {MetaweblogCfg} from "../../../lib/metaweblog/MetaweblogCfg";
import {API} from "../../../lib/api";

const {t} = useI18n()

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false
  },
  apiType: {
    type: String,
    default: ""
  }
})

const home = ref("")
const apiUrl = ref("")
const username = ref("")
const password = ref("")

const getCfg = ()=>{
  let cfg = getJSONConf<IMetaweblogCfg>(props.apiType)
  if (!cfg) {
    cfg = new MetaweblogCfg(home.value, apiUrl.value, username.value, password.value)
  }
  return cfg
}

const valiConf = async () => {
  const cfg = getCfg()

  const api = new API(props.apiType)
  const usersBlogs = await api.getUsersBlogs()
  if (usersBlogs && usersBlogs.length > 0) {
    cfg.apiStatus = true
  }
  setJSONConf(props.apiType, cfg)
  log.logInfo("通用Setting验证完毕")
}

const saveConf = () => {
  log.logInfo("通用Setting保存配置")

  const cfg = getCfg()

  // 是否可用
  if(!cfg.apiStatus){
    ElMessage.warning(t('main.opt.success'))
  }
  setJSONConf(props.apiType, cfg)

  ElMessage.success(t('main.opt.success'))
}

const initConf = () => {
  log.logInfo("通用Setting配置初始化")
  const conf = getJSONConf<IMetaweblogCfg>(props.apiType)
  if (conf) {
    log.logInfo("get setting conf=>", conf)

    home.value = conf.home
    apiUrl.value = conf.apiUrl
    username.value = conf.username
    password.value = conf.password
  }
}

onMounted(async () => {
  // 初始化
  initConf()
})

</script>

<script lang="ts">
export default {
  name: "MetaweblogSetting"
}
</script>

<style scoped>

</style>