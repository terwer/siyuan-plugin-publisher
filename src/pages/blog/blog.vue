<template>
  <BlogIndex/>
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
import logUtil from "../../utils/logUtil";
import BlogIndex from "../../components/blog/BlogIndex.vue";

onMounted(async () => {
  logUtil.logInfo("MODE=>", import.meta.env.MODE)
})
</script>

<script lang="ts">
export default {
  name: 'blog'
}
</script>