<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { reactive } from "vue"
import { NotionMarkdownConverter } from "zhi-notion-markdown"

const md = `

​​![image](https://img1.terwer.space/api/public/202308142037187.png)​​

dfgvdfgfd

地方GV发的

​![image](https://img1.terwer.space/api/public/202308142036226.png)​

‍

​![](https://img1.terwer.space/202308142041443.png)​
`

const formData = reactive({
  content: md,
})

const testHandleNotion = () => {
  const markdownText = formData.content
  const notionObject = NotionMarkdownConverter.markdownToNotion(markdownText)
  console.log("notionObject =>", notionObject)
}
</script>

<template>
  <back-page title="其他测试">
    <div id="other-test">
      <el-form>
        <el-form-item>
          <el-input v-model="formData.content" style="width: 75%; margin-right: 16px" type="textarea" :rows="10" />
        </el-form-item>
        <el-form-item>
          <el-button @click="testHandleNotion">测试Notion</el-button>
        </el-form-item>
      </el-form>
    </div>
  </back-page>
</template>

<style scoped lang="stylus">
#other-test
  margin 16px 20px
</style>
