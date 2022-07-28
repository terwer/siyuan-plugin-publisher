<template>
  <publish-service/>
</template>

<script lang="ts">
import PublishService from "./components/PublishService.vue";
import log from "./lib/logUtil";

export default {
  name: 'App',
  components: {PublishService},
  setup() {
    console.log("MODE=>", import.meta.env.MODE)
    log.logInfo("App setup")
    return {}
  }
}
</script>