<template>
  <BlogDetail :page-id="undefined"/>
</template>

<script lang="ts">
import BlogDetail from "./blog/BlogDetail.vue";

export default {
  name: "Detail",
  components: {BlogDetail}
}
</script>

<style scoped>
</style>