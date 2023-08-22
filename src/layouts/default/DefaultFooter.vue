<!--
  - Copyright (c) 2022-2023, Terwer . All rights reserved.
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
  <div>
    <div class="footer">
      <div>
        <span class="text"> &copy;2011-{{ nowYear }} </span>
        <span class="text s-dark" @click="goGithub()">&nbsp;siyuan-plugin-publisher&nbsp;</span>

        <span class="text" @click="goToApiTest">v{{ v }}&nbsp;</span>

        <span class="text s-dark" @click="goAbout()">{{ t("syp.about") }}</span>

        <span class="text">.</span>
        <span class="text s-dark" @click="toggleDark()">{{
          isDark ? t("theme.mode.light") : t("theme.mode.dark")
        }}</span>

        <span class="text">.</span>
        <span class="text s-dark" @click="handlePublishSetting">
          {{ t("service.tab.publish.setting") }}
        </span>

        <span class="text">.</span>
        <span class="text s-dark" @click="handlePrefenceSetting">
          {{ t("service.tab.change.local") }}
        </span>

        <span v-if="isDev" class="text">.</span>
        <span v-if="isDev" class="text s-dark" @click="handleTest"> 组件测试 </span>

        <span v-if="isChromeExtension" class="text">.</span>
        <span v-if="isChromeExtension" class="text s-dark" @click="newWin()">
          {{ t("blog.newwin.open") }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDark, useToggle } from "@vueuse/core"
import { ref } from "vue"
import { version } from "../../../package.json"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { DateUtil } from "zhi-common"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { useRouter } from "vue-router"
import { isDev } from "~/src/utils/constants.ts"

const logger = createAppLogger("default-footer")
const { t } = useVueI18n()

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { isInChromeExtension } = useSiyuanDevice()
const isChromeExtension = isInChromeExtension()

const v = ref(version)
const nowYear = DateUtil.nowYear()
const router = useRouter()

const goGithub = () => {
  window.open("https://github.com/terwer/siyuan-plugin-publisher")
}

const goAbout = async () => {
  // window.open("https://blog.terwer.space/about")
  await router.push({
    path: "/about",
    query: { showBack: "true" },
  })
}

const goToApiTest = () => {
  router.push({ path: "/test" })
}

const newWin = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const rt = chrome.runtime as any
  const url = rt.getURL("/index.html#/")
  window.open(url)
}

const handlePublishSetting = async () => {
  await router.push({
    path: "/setting/publish",
    query: { showBack: "true" },
  })
}

const handlePrefenceSetting = async () => {
  await router.push({
    path: "/setting/general",
    query: { showBack: "true" },
  })
}

const handleTest = async () => {
  await router.push({
    path: "/test",
    query: { showBack: "true" },
  })
}
</script>

<style scoped>
.footer {
  font-size: 12px;
  color: #bbb;
  text-align: center;
  padding-bottom: 8px;
}

.footer .text {
  vertical-align: middle;
}

.s-dark {
  color: var(--el-color-primary);
  cursor: pointer;
}

.middleware-tip {
  text-align: left;
}
</style>
