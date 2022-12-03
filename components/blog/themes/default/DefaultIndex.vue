<template>
  <div class="common-layout">
    <el-container>
      <DefaultHeader />
      <el-main>
        <DefaultMain />
      </el-main>
      <el-footer>
        <DefaultFooter />
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import DefaultHeader from "./DefaultHeader.vue"
import DefaultFooter from "./DefaultFooter.vue"
import DefaultMain from "./DefaultMain.vue"
</script>

<script lang="ts">
export default {
  name: "DefaultIndex",
}
</script>

<style scoped></style>
