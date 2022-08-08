<template>
  <publish-service v-if="isAuth"/>
  <no-auth v-else/>
</template>

<script lang="ts" setup>
import {ref, onMounted} from "vue";
import {getEnv} from "./lib/envUtil";
// import {getNotebooks} from "./lib/siyuan/siyuanUtil";
import log from "./lib/logUtil";
import {getQueryString} from "./lib/util";
import {getWidgetId} from "./lib/siyuan/siyuanUtil";

const isAuth = ref(false)

onMounted(async () => {
  // const notebooks = await getNotebooks()
  // log.logWarn("notebooks=>")
  // log.logWarn(notebooks)

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

  log.logWarn("MODE=>", import.meta.env.MODE)
  log.logInfo("App setup")
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