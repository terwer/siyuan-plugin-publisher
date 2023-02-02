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

<template>
  <div v-if="isElectron">
    <div>{{ $t("picgo.siyuan.tip") }} 。</div>
    <p></p>
    <p>
      详情请参考：<a
        target="_blank"
        href="https://docs.publish.terwer.space/post/picgo-diagram-bed-use-zxqqec.html"
        >PicoGO配置在线文档</a
      >
    </p>
    <h1>预计0.7.0会新增比较友好的图形化配置页面，敬请期待。</h1>
  </div>
  <div v-else>
    <p>{{ $t("picgo.chrome.tip") }} 。</p>
    <p>{{ $t("picgo.pic.setting.no.tip") }} 。</p>
  </div>
</template>
<script setup lang="ts">
import { isElectron } from "~/utils/browserUtil"

console.log("pico test")
</script>
