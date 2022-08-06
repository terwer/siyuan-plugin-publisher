<template>
  <publish-service/>
</template>

<script lang="ts" setup>
// import {onMounted} from "vue";
// import {getNotebooks} from "./lib/siyuan/siyuanUtil";
// import log from "./lib/logUtil";

// 测试代码，移除
// onMounted(async () => {
//   const notebooks = await getNotebooks()
//   log.logWarn("notebooks=>")
//   log.logWarn(notebooks)
//
//   log.logWarn("MODE=>", import.meta.env.MODE)
//   log.logInfo("App setup")
// })
</script>

<script lang="ts">
import PublishService from "./components/PublishService.vue";

export default {
  name: 'App',
  components: {PublishService}
}
</script>