<!--
  - Copyright (c) 2023, Terwer . All rights reserved.
  - DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
  -
  - This code is free software; you can redistribute it and/or modify it
  - under the terms of the GNU General Public License version 2 only, as
  - published by the Free Software Foundation.  Terwer designates this
  - particular file as subject to the "Classpath" exception as provided
  - by Terwer in the LICENSE file that accompanied this code.
  -
  - This code is distributed in the hope that it will be useful, but WITHOUT
  - ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
  - FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
  - version 2 for more details (a copy is included in the LICENSE file that
  - accompanied this code).
  -
  - You should have received a copy of the GNU General Public License version
  - 2 along with this work; if not, write to the Free Software Foundation,
  - Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
  -
  - Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
  - or visit www.terwer.space if you need additional information or have any
  - questions.
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
  <div>
    <el-form>
      <el-form-item>
        <el-input v-model="formData.content" style="width: 75%; margin-right: 16px" type="textarea" :rows="10" />
      </el-form-item>
      <el-form-item>
        <el-button @click="testHandleNotion">测试Notion</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
