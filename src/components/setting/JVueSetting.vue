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
import {ref} from "vue";
import log from "../../lib/logUtil";
import {getJSONConf, setJSONConf} from "../../lib/config";
import {
  PUBLISH_TYPE_CONSTANTS,
  PUBLISH_HOME_KEY_CONSTANTS,
  PUBLISH_API_URL_KEY_CONSTANTS,
  PUBLISH_USERNAME_KEY_CONSTANTS,
  PUBLISH_PASSWORD_KEY_CONSTANTS
} from "../../lib/publishUtil"
import {ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";

const {t} = useI18n()

const home = ref("")
const apiUrl = ref("")
const username = ref("")
const password = ref("")

const saveConf = () => {
  log.logInfo("Jvue保存配置")
  setJSONConf(PUBLISH_TYPE_CONSTANTS.API_TYPE_JVUE, {
        [PUBLISH_HOME_KEY_CONSTANTS.JVUE_HOME_KEY]: home.value,
        [PUBLISH_API_URL_KEY_CONSTANTS.JVUE_API_URL_KEY]: apiUrl.value,
        [PUBLISH_USERNAME_KEY_CONSTANTS.JVUE_USERNAME_KEY]: username.value,
        [PUBLISH_PASSWORD_KEY_CONSTANTS.JVUE_PASSWORD_KEY]: password.value
      }
  )
  ElMessage.success(t('main.opt.success'))
}

const initConf = () => {
  log.logInfo("Jvue配置初始化")
  const conf = getJSONConf(PUBLISH_TYPE_CONSTANTS.API_TYPE_JVUE)
  if (conf) {
    console.log("jvue conf=>", conf)

    // @ts-ignore
    home.value = conf[PUBLISH_HOME_KEY_CONSTANTS.JVUE_HOME_KEY]
    // @ts-ignore
    apiUrl.value = conf[PUBLISH_API_URL_KEY_CONSTANTS.JVUE_API_URL_KEY]
    // @ts-ignore
    username.value = conf[PUBLISH_USERNAME_KEY_CONSTANTS.JVUE_USERNAME_KEY]
    // @ts-ignore
    password.value = conf[PUBLISH_PASSWORD_KEY_CONSTANTS.JVUE_PASSWORD_KEY]
  }
}

// 初始化
initConf()

</script>

<script lang="ts">
export default {
  name: "JVueSetting"
}
</script>

<style scoped>

</style>