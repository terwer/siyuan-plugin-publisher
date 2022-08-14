<template>
  <div>
    <h1>对不起，您没有该操作的权限</h1>
    <el-form>
      <el-form-item>
        <el-input v-model="pwd"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="conformPwd">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {inBrowser} from "../lib/util";

const pwd = ref("")

const conformPwd = () => {
  if (inBrowser()) {
    const newUrl = "/?pwd=" + pwd.value;
    window.location.href = newUrl
  }
}

</script>

<script lang="ts">
export default {
  name: "NoAuth"
}
</script>

<style scoped>

</style>