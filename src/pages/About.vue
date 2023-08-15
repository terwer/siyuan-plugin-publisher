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
import { ref } from "vue"
import { version, dependencies } from "../../package.json"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"

const { t } = useVueI18n()
const v = ref(version)
</script>

<template>
  <div id="about-box">
    <div class="logo">
      <img src="../../icon.png" alt="logo" />
    </div>
    <div class="notice">
      <p class="title">发布工具 v{{ v }}</p>

      <div class="param slogan">
        {{ t("slogan.make.written.fun") }}
      </div>
      <div class="space"></div>
      <div class="param">Created by terwer</div>

      <div class="space"></div>
      <div class="third-libs">
        <div class="lib-title">Thanks for third party libraries:</div>
        <div class="lib-item" v-for="(value, key) in dependencies">{{ key }} ({{ value }})</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="stylus">
#about-box
  padding 16px 20px
  .logo
    display inline-block
    vertical-align top
  .notice
    display inline-block
    vertical-align top
    padding-left 20px
    .param
      padding 10px 0
    .space
      padding-bottom 10px
    .slogan
      font-size 24px
    .third-libs
      .lib-title
        font-weight bold
        margin-bottom 4px
      .lib-item
        font-size 14px
        padding 4px 0
        color #bbb
</style>
