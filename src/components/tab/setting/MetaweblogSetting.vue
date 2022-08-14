<template>
  <el-form label-width="120px">
    <el-alert class="top-version-tip" :title="apiTypeInfo + blogName" type="info"
              :closable="false"/>
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
      <el-button type="primary" @click="valiConf" :loading="isLoading">
        {{ isLoading ? $t('setting.blog.vali.ing') : $t('setting.blog.vali') }}
      </el-button>
      <el-alert :title="$t('setting.blog.vali.tip.metaweblog')" type="warning" :closable="false" v-if="!apiStatus"/>
      <el-alert :title="$t('setting.blog.vali.ok')" type="success" :closable="false" v-if="apiStatus"/>
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
import {UserBlog} from "../../../lib/common/userBlog";

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

const getCfg = () => {
  let cfg = getJSONConf<IMetaweblogCfg>(props.apiType)
  if (!cfg) {
    cfg = new MetaweblogCfg(home.value, apiUrl.value, username.value, password.value)
  }
  return cfg
}

const isLoading = ref(false)
const apiStatus = ref(false)
const blogName = ref("")

const apiTypeInfo = ref(t('setting.blog.platform.support.metaweblog') + props.apiType + " ")

const valiConf = async () => {
  isLoading.value = true;

  try {
    const cfg = new MetaweblogCfg(home.value, apiUrl.value, username.value, password.value)
    setJSONConf(props.apiType, cfg)

    const api = new API(props.apiType)
    const usersBlogs:Array<UserBlog> = await api.getUsersBlogs()
    if (usersBlogs && usersBlogs.length > 0) {
      const userBlog = usersBlogs[0]

      cfg.apiStatus = true
      apiStatus.value = true

      cfg.blogName = userBlog.blogName
      blogName.value = userBlog.blogName

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
    ElMessage.error(t('setting.blog.vali.error'))
  } else {
    ElMessage.success(t('main.opt.success'))
  }

  isLoading.value = false

  log.logInfo("通用Setting验证完毕")
}

const saveConf = () => {
  log.logInfo("通用Setting保存配置")

  const cfg = getCfg()
  cfg.home = home.value
  cfg.username = username.value
  cfg.password = password.value
  cfg.apiUrl = apiUrl.value
  cfg.apiStatus = apiStatus.value
  cfg.blogName = blogName.value

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
    apiStatus.value = conf.apiStatus
    blogName.value = conf.blogName
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