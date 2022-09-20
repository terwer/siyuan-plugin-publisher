<template>
  <div>
    <Index/>
    <button @click="createPage">服务</button>
  </div>
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
import logUtil from "../../lib/logUtil";
import Index from "../../components/Index.vue"

function createPage() {
  // While we could have used `let url = "index.html"`, using runtime.getURL is a bit more robust as
  // it returns a full URL rather than just a path that Chrome needs to be resolved contextually at
  // runtime.
  // let url = chrome.runtime.getURL("index/index.html");
  let url = "/service/index.html?pwd=123456";
  // @ts-ignore
  if (typeof chrome.runtime != "undefined") {
    // @ts-ignore
    url = chrome.runtime.getURL("/service/index.html?pwd=123456");
  }
  window.open(url)
  console.log(`Created tab`);
}

onMounted(async () => {
  logUtil.logWarn("MODE=>", import.meta.env.MODE)
})
</script>

<script lang="ts">
export default {
  name: 'App'
}
</script>