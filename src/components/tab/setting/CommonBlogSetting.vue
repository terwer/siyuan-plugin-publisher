<template>
  <el-form label-width="120px">
    <el-form-item :label="$t('setting.blog.url')">
      <el-input v-model="home"/>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
export default {
  name: "CommonBlogSetting"
}
</script>

<style scoped>

</style>