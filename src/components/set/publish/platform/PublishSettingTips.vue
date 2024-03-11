<!--
  - Copyright (c) 2024, Terwer . All rights reserved.
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
import { useVueI18n } from "~/src/composables/useVueI18n.ts"

// uses
const { t } = useVueI18n()
</script>

<template>
  <div class="right-setting-tips">
    <div class="el-alert el-alert--warning is-light" role="alert">
      <div class="el-alert__content">
        <div class="el-alert__title">
          <div>{{ t("setting.platform.right.tips0") }}</div>
          <div>{{ t("setting.platform.right.tips1") }}</div>
          <div>{{ t("setting.platform.right.tips2") }}</div>
          <div>{{ t("setting.platform.right.tips3") }}</div>
          <div>{{ t("setting.platform.right.tips4") }}</div>
        </div>
      </div>
    </div>

    <h2>FAQ:</h2>
    <div class="setting-help">
      不会配置，或者配置遇到问题？ 请加QQ群
      <span style="font-weight: bold; color: red">
        <a
          href="https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=1Q1-wOLkBaG-iD0MBnNhNL25tbLSCwZx&authKey=tBdJDGuWuXK%2B77hHlwwT6y8UAp9AGZTwQq6RzUa%2ByX81HCSHu4XVGqY0gbsBUcW0&noverify=0&group_code=895063267"
          target="_blank"
        >
          895063267
        </a>
      </span>
      讨论。
    </div>

    <div class="setting-help">
      需要详细的配置指导？请查看在线文档
      <a href="https://blog.terwer.space/s/20230810132040-nn4q7vs" target="_blank">平台配置指南</a>
    </div>

    <div class="tips-form">
      我想要的平台这里没有？<a
        href="https://terwergreen.feishu.cn/share/base/form/shrcnGRdThUiqnhBg15xgclMM0c"
        target="_blank"
      >
        点击这里提交发布工具平台适配跟踪表
      </a>
    </div>

    <div class="tips-form">
      我还有其他问题或者想私下沟通作者？<a href="mailto:youweics@163.com"> 直接发邮件到：youweics@163.com </a>
    </div>
  </div>
</template>

<style scoped lang="stylus">
.right-setting-tips
  text-align left
  //padding-left 10px
  //padding-right 10px

  .setting-help
    font-size 12px
    margin-top 14px

  .tips-form
    font-size 12px
    margin-top 14px
</style>
