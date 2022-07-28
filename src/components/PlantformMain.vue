<template>
  <div class="publisher-collapse">
    <el-collapse model-value="1" accordion>
      <el-collapse-item :title="$t('main.publish.to.vuepress')" name="1">
        Vuepress
      </el-collapse-item>
      <el-collapse-item :title="$t('main.publish.to.jvue')" name="2">
        JVue
      </el-collapse-item>
      <el-collapse-item :title="$t('main.publish.to.conf')" name="3">
        Confluence
      </el-collapse-item>
      <el-collapse-item :title="$t('main.publish.to.cnblogs')" name="4">
        Cnblogs
      </el-collapse-item>
      <el-collapse-item :title="$t('main.publish.to.wordpress')" name="5">
        Wordpress
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts">
export default {
  name: "PlantformMain",
  components: {},
  data() {
    return {}
  }
}
</script>

<style scoped>

</style>