<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
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
        <span class="text s-dark" @click="handleGoHome">
          {{ t("service.tab.manage") }}
        </span>

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
import { pkg } from "~/src/utils/utils.ts"
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

const v = ref(pkg.version)
const nowYear = DateUtil.nowYear()
const router = useRouter()

const goGithub = () => {
  window.open("https://github.com/terwer/siyuan-plugin-publisher")
}

const handleGoHome = async () => {
  await router.push({
    path: "/",
  })
}
const goAbout = async () => {
  // window.open("https://blog.terwergreen.com/guestbook.html")
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
