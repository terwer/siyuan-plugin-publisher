<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { help } from "@/presets/help.ts"
import { createAppLogger } from "@/utils/appLogger"
import { alert } from "@components/Alert.ts"
import { useI18n } from "@composables/useI18n.ts"
import { ArrowLeft, Copy, HelpCircle, Mail, X } from "lucide-vue-next"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { BrowserUtil } from "zhi-device"
import pkg from "../../package.json"

// Props
const props = defineProps<{
  pluginInstance: any
  title: string
  hasBackEmit: boolean
  helpKey: string
  error?: string
  extra?: Array<{
    component: any
    props?: Record<string, any>
    onClick?: () => void
    text?: string
  }>
}>()

const logger = createAppLogger("back-page")
const { t } = useI18n(props.pluginInstance)
const router = useRouter()
const { query } = useRoute()

// Emits
const emit = defineEmits(["backEmit"])

// Data
const showBack = ref(query.showBack === "true")
const showHelpTooltip = ref(false)

// 错误处理相关
const showError = ref(false)
const copySuccess = ref(false)

// Computed
const helpUrl = computed(() => {
  return (
    (help as any)[props.helpKey] ||
    "https://siyuan.wiki/s/20230810132040-nn4q7vs"
  )
})

// Methods
const handleBack = () => {
  if (props.hasBackEmit) {
    logger.info("Triggering backEmit")
    emit("backEmit")
  } else {
    logger.info("Navigating back")
    router.back()
  }
}

const goToHelp = (url: string) => {
  window.open(url, "_blank")
}

const toggleHelpTooltip = (state: boolean) => {
  showHelpTooltip.value = state
}

const copyError = async () => {
  try {
    await navigator.clipboard.writeText(props.error || "")
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (e) {
    console.error(t("common.copyFailed"), e)
  }
}

const closeError = () => {
  showError.value = false
}

const reportError = () => {
  const errTitle = t("common.reportEmailTitle")
  const errContent = `
  ${t("common.emailBody.errorTitle")}: ${errTitle}
  ${t("common.emailBody.errorInfo")}: ${props.error}
  ${t("common.emailBody.errorTime")}: ${new Date().toISOString()}
  ${t("common.emailBody.errorLocation")}: ${window.location.href}
  ${t("common.emailBody.deviceInfo")}：
    ${t("common.emailBody.isBrowserEnv")}：${BrowserUtil.isInBrowser}
    ${t("common.emailBody.isElectronEnv")}：${BrowserUtil.isElectron()}
    ${t("common.emailBody.isNodeEnv")}：${BrowserUtil.isNode}
    ${t("common.emailBody.isBrowserPlugin")}：${BrowserUtil.isInChromeExtension()}
    ${t("common.emailBody.isNodeEnvEnhanced")}：${BrowserUtil.hasNodeEnv()}
  ${t("common.pluginVersion")}: ${pkg.version}
  `
  // 发送邮件到作者邮箱
  const email = pkg.author
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    alert({
      title: t("common.error"),
      message: t("common.reportEmailError"),
    })
    return
  }
  window.open(
    `mailto:${email}?subject=${encodeURIComponent(errTitle)}&body=${encodeURIComponent(errContent)}`,
    "_blank",
  )
  console.log(t("common.reportError"))
}

// 监听错误变化
watch(
  () => props.error,
  (newError) => {
    if (newError) {
      showError.value = true
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="back-page">
    <div v-if="error && showError" class="error-container">
      <div class="error-content">
        <div class="error-message">{{ error }}</div>
        <div class="error-actions">
          <button class="copy-btn" @click.stop="copyError">
            <Copy class="icon" />
            <span>
              {{ copySuccess ? t("common.copied") : t("common.copy") }}
            </span>
          </button>
          <button class="report-btn" @click.stop="reportError">
            <Mail class="icon" />
            <span>{{ t("common.reportError") }}</span>
          </button>
          <button class="close-btn" @click.stop="closeError">
            <X class="icon" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="showBack" class="page-header">
      <div class="header-left">
        <button class="back-btn" @click.stop="handleBack">
          <ArrowLeft class="icon" />
          <span class="text">{{ t("common.back") }}</span>
        </button>

        <div class="title-group">
          <h1 class="title">{{ props.title }}</h1>
          <div
            v-if="helpKey"
            class="help-container"
            @mouseenter="toggleHelpTooltip(true)"
            @mouseleave="toggleHelpTooltip(false)"
          >
            <button class="help-btn" @click.stop="goToHelp(helpUrl)">
              <HelpCircle class="icon" />
            </button>
            <div v-show="showHelpTooltip" class="help-tooltip">
              {{ t("common.help") }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="extra && extra.length > 0" class="header-extra">
        <slot name="extra">
          <template v-for="(item, _index) in extra" :key="_index">
            <component
              :is="item.component"
              v-bind="item.props || {}"
              @click.stop="item.onClick"
            >
              {{ item.text }}
            </component>
          </template>
        </slot>
      </div>
    </div>

    <div class="page-content">
      <slot />
    </div>
  </div>
</template>

<style lang="stylus" scoped>
// 设计变量
.back-page
  --pt-bg: #fff
  --pt-surface: #f8f9fa
  --pt-text: #212529
  --pt-text-light: #6c757d
  --pt-border: #dee2e6
  --pt-accent: #1971c2
  --pt-shadow: rgba(0, 0, 0, 0.1)
  width 100%
  min-width 800px
  position relative
  height 100%
  display flex
  flex-direction column

  // 暗黑模式变量覆盖
  html[data-theme-mode="dark"] &
    --pt-bg: #2d2d2d
    --pt-surface: #363636
    --pt-text: #f8f9fa
    --pt-text-light: #adb5bd
    --pt-border: #495057
    --pt-accent: #4dabf7
    --pt-shadow: rgba(0, 0, 0, 0.3)

  .page-header
    position sticky
    top 0
    z-index 1000
    display flex
    align-items center
    justify-content space-between
    padding 12px 16px
    background var(--pt-bg)
    border-bottom 1px solid var(--pt-border)
    box-shadow 0 1px 2px 0 var(--pt-shadow)
    transition all 0.3s ease
    flex-shrink 0 // 防止头部被压缩

    .header-left
      display flex
      align-items center

    .header-extra
      display flex
      align-items center
      gap 8px

    .back-btn
      display flex
      align-items center
      gap 6px
      padding 4px 8px
      border none
      background transparent
      border-radius 6px
      cursor pointer
      transition all 0.3s ease
      color var(--pt-text-light)
      font-size 14px

      &:hover
        background var(--pt-surface)
        color var(--pt-accent)

      .icon
        width 16px
        height 16px

    .title-group
      display flex
      align-items center
      gap 8px
      margin-left 12px

      .title
        margin 0
        font-size 18px
        font-weight 500
        color var(--pt-text)
        line-height 1.4

      .help-container
        position relative

        .help-btn
          display flex
          align-items center
          justify-content center
          width 28px
          height 28px
          padding 0
          border none
          background transparent
          border-radius 6px
          cursor pointer
          transition all 0.3s ease
          color var(--pt-text-light)

          &:hover
            background var(--pt-surface)
            color var(--pt-accent)

          .icon
            width 16px
            height 16px

        .help-tooltip
          position absolute
          top calc(100% + 2px)
          left 50%
          transform translateX(-50%)
          padding 2px 12px
          background var(--pt-surface)
          color var(--pt-text)
          font-size 12px
          border-radius 4px
          box-shadow 0 2px 8px var(--pt-shadow)
          border 1px solid var(--pt-border)
          white-space nowrap
          z-index 1000
          transition all 0.3s ease
          text-align center

          &::before
            content ''
            position absolute
            top -4px
            left 50%
            transform translateX(-50%)
            border-width 0 4px 4px
            border-style solid
            border-color transparent transparent var(--pt-border) transparent

          &::after
            content ''
            position absolute
            top -3px
            left 50%
            transform translateX(-50%)
            border-width 0 4px 4px
            border-style solid
            border-color transparent transparent var(--pt-surface) transparent

  .page-content
    padding 16px
    background var(--pt-bg)
    flex 1 // 占据剩余空间
    overflow-y auto // 内容区域可滚动
    min-height 600px // 设置最小高度

.error-container
  background #fee2e2
  border-bottom 1px solid #fecaca
  padding 12px 16px
  color #dc2626
  font-size 14px
  line-height 1.5

  html[data-theme-mode="dark"] &
    background #7f1d1d
    border-bottom-color #991b1b
    color #fecaca

  .error-content
    display flex
    justify-content space-between
    align-items flex-start
    gap 12px

    .error-message
      flex 1
      word-break break-word
      white-space pre-wrap

    .error-actions
      display flex
      gap 8px
      flex-shrink 0

      button
        display flex
        align-items center
        gap 4px
        padding 4px 8px
        border none
        background transparent
        border-radius 4px
        cursor pointer
        transition all 0.2s ease
        color inherit
        font-size 12px

        &:hover
          background rgba(0, 0, 0, 0.1)

        html[data-theme-mode="dark"] &
          &:hover
            background rgba(255, 255, 255, 0.1)

        .icon
          width 14px
          height 14px
</style>
