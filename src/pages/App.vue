<template>
  <div>
    <publish-service :page-id="undefined"/>
  </div>
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
import logUtil from "../lib/logUtil";
import PublishService from "../components/PublishService.vue";

onMounted(async () => {
  logUtil.logInfo("MODE=>", import.meta.env.MODE)
})
</script>

<script lang="ts">
export default {
  name: 'App'
}
</script>