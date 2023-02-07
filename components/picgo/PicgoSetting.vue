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
  <div v-if="isElectron" style="padding-right: 20px">
    <blockquote class="picgo-setting-tip">
      <div>
        {{ $t("picgo.siyuan.tip") }} 。 从 0.7.0+
        开始，支持多个配置文件切换，默认的 PicGO 配置文件为：
        <pre
          style="display: inline-block"
        ><code>[思源工作空间]/data/storage/syp/picgo/picgo.cfg.json</code></pre>
        。
        {{ $t("setting.picgo.refer.to") }}
        <a
          target="_blank"
          href="https://docs.publish.terwer.space/post/picgo-diagram-bed-use-zxqqec.html"
          >{{ $t("setting.picgo.refer.to.online.doc") }}</a
        >
        或者
        <a
          href="https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html#%E6%89%8B%E5%8A%A8%E7%94%9F%E6%88%90"
          >PicGO 官方文档</a
        >
        。
      </div>
    </blockquote>

    <!-- PicGO配置 -->
    <el-tabs type="border-card">
      <el-tab-pane :label="$t('setting.picgo.picbed')">
        <!-- 图床类型 -->
        <picbed-setting />
      </el-tab-pane>
      <el-tab-pane :label="$t('setting.picgo.picgo')">
        <picgo-config-setting />
      </el-tab-pane>
    </el-tabs>
  </div>
  <div v-else>
    <p>{{ $t("picgo.chrome.tip") }} 。</p>
    <p>{{ $t("picgo.pic.setting.no.tip") }} 。</p>
  </div>
</template>
<script setup lang="ts">
import { isElectron } from "~/utils/browserUtil"
import PicbedSetting from "~/components/picgo/setting/PicbedSetting.vue"
import PicgoConfigSetting from "~/components/picgo/setting/PicgoConfigSetting.vue"
</script>

<style scoped>
.picgo-setting-tip {
  display: block;
  border: solid 1px green;
  border-radius: 4px;
  background: var(--custom-app-bg-color);
  margin-inline-start: 0;
  margin-inline-end: 0;
  margin: 0 0 10px;
  padding: 16px;
}
</style>
