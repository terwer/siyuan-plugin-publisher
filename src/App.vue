<template>
  <publish-service v-if="isAuth"/>
  <no-auth v-else/>
</template>

<script lang="ts" setup>
import {ref, onMounted} from "vue";
import {getBooleanEnv, getEnv} from "./lib/envUtil";
import log from "./lib/logUtil";
import {getQueryString} from "./lib/util";
import {getWidgetId} from "./lib/platform/siyuan/siyuanUtil";

const isAuth = ref(false)

onMounted(async () => {
  log.logWarn("MODE=>", import.meta.env.MODE)

  // // 调试模式
  // const debugMode = getBooleanEnv("VITE_DEBUG_MODE")
  // if (debugMode) {
  //   log.logWarn("正在开始调试模式，请修改test/test.ts下面的test方法查看效果")
  //   log.logWarn("测试结束")
  //   return
  // }

  // 挂件模式不校验
  const widgetResult = await getWidgetId()
  if (widgetResult.isInSiyuan) {
    isAuth.value = true
    return
  }

  // 非挂件模式需要校验
  const optPwd = getEnv("VITE_OPT_PWD") || ""
  const pwd = getQueryString("pwd") || ""
  if (pwd != "" && pwd == optPwd) {
    isAuth.value = true
  }
})
</script>

<script lang="ts">
import PublishService from "./components/PublishService.vue";
import NoAuth from "./components/NoAuth.vue";

export default {
  name: 'App',
  components: {PublishService, NoAuth}
}
</script>