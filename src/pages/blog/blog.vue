<template>
  <Index/>
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
import logUtil from "../../lib/logUtil";
import Index from "../../components/Index.vue"

onMounted(async () => {
  logUtil.logInfo("MODE=>", import.meta.env.MODE)
})
</script>

<script lang="ts">
export default {
  name: 'blog'
}
</script>