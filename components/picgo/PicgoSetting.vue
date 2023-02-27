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
    <!-- PicGO配置 -->
    <el-tabs type="border-card" @tab-click="picgoSettingTabChange">
      <el-tab-pane :label="$t('setting.picgo.picbed')">
        <!-- 图床类型 -->
        <picbed-setting :is-reload="isReload" />
      </el-tab-pane>
      <el-tab-pane :label="$t('setting.picgo.picgo')">
        <!-- PicGO配置 -->
        <picgo-config-setting />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('setting.picgo.plugin')"
        v-if="isInSiyuanNewWinBrowser()"
      >
        <!-- PicGO插件配置 -->
        <picgo-plugin-setting />
      </el-tab-pane>
    </el-tabs>

    <blockquote class="picgo-setting-tip">
      <div>
        {{ $t("picgo.siyuan.tip") }} 。 当前系统默认的 PicGO 配置文件为：
        <pre
          style="display: inline-block"
        ><code>{{ picgoUtil.getPicgoCfgPath() }}</code></pre>
        。
        多个图床中，只能有一个图床设置为默认。默认图床会在上传的时候自动生效。从
        0.7.0+
        开始，单个图床支持多份配置切换，每个图床只能有一个选中的配置生效。
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
    <div class="version-tip">
      当前PicGo版本为
      <a href="https://github.com/terwer/Electron-PicGo-Core" target="_blank"
        >electron-picgo</a
      >
      v{{ picgoVersion }} ， 对 Electron 环境进行了更好的适配 ，由
      <a href="https://github.com/terwer" target="_blank">terwer</a> 负责维护
      。感谢原始
      <a href="https://github.com/PicGo/PicGo-Core" target="_blank"
        >PicGo-Core</a
      >
      项目。
      <p>
        特别提示：picgo插件未经过全量测试，不保证所有插件都能运行，目前已经测试可用的插件如下：
      </p>
      <p>
        <a href="https://github.com/terwer/picgo-plugin-watermark-elec"
          >picgo-plugin-watermark-elec</a
        >
        搜索关键词：watermark-elec
      </p>
      <p>
        <a href="https://github.com/wayjam/picgo-plugin-s3">picgo-plugin-s3</a>
        搜索关键词：s3
      </p>
      <p>
        <a href="https://github.com/Herbertzz/picgo-plugin-minio"
          >picgo-plugin-minio</a
        >
        搜索关键词：minio
      </p>
    </div>
  </div>
  <div v-else>
    <div class="picgo-browser-tip">
      <p>{{ $t("picgo.chrome.tip") }} 。</p>
      <p>{{ $t("picgo.pic.setting.no.tip") }} 。</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { isElectron } from "~/utils/browserUtil"
import PicbedSetting from "~/components/picgo/setting/PicbedSetting.vue"
import PicgoConfigSetting from "~/components/picgo/setting/PicgoConfigSetting.vue"
import { onBeforeMount, ref } from "vue"
import picgoUtil from "~/utils/otherlib/picgoUtil"
import PicgoPluginSetting from "~/components/picgo/setting/PicgoPluginSetting.vue"
import { isInSiyuanNewWinBrowser } from "~/utils/otherlib/siyuanBrowserUtil"

const isReload = ref(false)
const picgoVersion = ref("")

const picgoSettingTabChange = () => {
  isReload.value = !isReload.value
}

onBeforeMount(() => {
  picgoVersion.value = picgoUtil.getPicgoVersion()
})
</script>

<style scoped>
.picgo-setting-tip {
  display: block;
  border: solid 1px green;
  border-radius: 4px;
  background: var(--custom-app-bg-color);
  margin-inline-start: 0;
  margin-inline-end: 0;
  margin: 10px 0 10px;
  padding: 16px 16px 16px;
}

.picgo-browser-tip {
  margin-left: 10px;
  margin-right: 10px;
}

.version-tip {
  margin: 10px 0;
}
</style>
