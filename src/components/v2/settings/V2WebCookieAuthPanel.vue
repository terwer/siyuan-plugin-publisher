<template>
  <div v-if="isCookieWebPlatform" class="syp-web-cookie-auth" :class="`is-${statusType}`">
    <div class="syp-web-cookie-auth__header">
      <div class="syp-web-cookie-auth__identity">
        <span class="syp-web-cookie-auth__title">{{ t("v2.webCookieAuth.title") }}</span>
        <span class="syp-web-cookie-auth__badge" :class="`is-${statusType}`">{{ statusLabel }}</span>
      </div>
      <SypTooltip
        tag="span"
        :content="manualTooltip"
        inline-flex
        trigger-class="syp-web-cookie-auth__manual"
      >
        <button
          type="button"
          class="syp-web-cookie-auth__manual-button"
          :class="{ 'is-expanded': props.isManualExpanded === true }"
          :aria-expanded="props.isManualExpanded === true"
          @click="handleToggleManual"
        >
          <span class="syp-web-cookie-auth__manual-icon">i</span>
          {{ manualLabel }}
        </button>
      </SypTooltip>
    </div>

    <div class="syp-web-cookie-auth__body">
      <div class="syp-web-cookie-auth__desc">{{ statusDescription }}</div>
      <div class="syp-web-cookie-auth__actions">
        <SypTooltip
          v-if="canOpenLogin"
          tag="button"
          type="button"
          class="syp-web-cookie-auth__action is-login"
          :content="t('v2.webCookieAuth.tooltip.openLogin')"
          inline-flex
          @click="handleOpenLogin"
        >
          <span class="syp-web-cookie-auth__step">1</span>
          {{ t("v2.webCookieAuth.action.openLogin") }}
        </SypTooltip>
        <SypTooltip
          v-if="canAutoCapture"
          tag="button"
          type="button"
          class="syp-web-cookie-auth__action is-primary"
          :class="{ 'is-disabled': isLoading }"
          :content="autoCaptureTooltip"
          inline-flex
          :aria-disabled="isLoading"
          @click="handleAutoCapture"
        >
          <span class="syp-web-cookie-auth__step">2</span>
          {{ isLoading ? t("v2.webCookieAuth.action.reading") : t("v2.webCookieAuth.action.autoRead") }}
        </SypTooltip>
        <SypTooltip
          v-else
          tag="span"
          class="syp-web-cookie-auth__action is-disabled is-static"
          :content="autoCaptureTooltip"
          inline-flex
        >
          {{ t("v2.webCookieAuth.action.autoRead") }}
        </SypTooltip>
        <SypTooltip
          v-if="canLogout"
          tag="button"
          type="button"
          class="syp-web-cookie-auth__action is-logout"
          :class="{ 'is-disabled': isLogoutLoading }"
          :content="logoutTooltip"
          inline-flex
          :aria-disabled="isLogoutLoading"
          @click="handleLogout"
        >
          {{ isLogoutLoading ? t("v2.webCookieAuth.action.loggingOut") : t("v2.webCookieAuth.action.logout") }}
        </SypTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import SypTooltip from "~/src/components/v2/common/SypTooltip.vue"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"
import {
  useWebCookieAuthorization,
  type WebCookieAuthEventStatus,
  type WebCookieAuthorizationStatus,
  type WebCookieLogoutStatus,
} from "~/src/composables/useWebCookieAuthorization.ts"
import { AuthMode, DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { openBrowserWindow } from "~/src/utils/widgetUtils.ts"
import { PasswordType, WebConfig } from "zhi-blog-api"
import type { ISypConfig } from "~/syp.config.ts"

const props = defineProps<{
  platformKey: string
  cfg: WebConfig
  dynCfg?: DynamicConfig
  setting?: Partial<ISypConfig>
  dynamicConfigArray?: DynamicConfig[]
  isManualExpanded?: boolean
  toggleManualEditor?: () => void
  expandManualEditor?: () => void
}>()

const emit = defineEmits<{
  (event: "authorized", result: { status: WebCookieAuthEventStatus; ok: boolean }): void
}>()

const { t } = useV2I18n()
const webCookieAuthorization = useWebCookieAuthorization()
const isLoading = ref(false)
const isLogoutLoading = ref(false)
const lastStatus = ref<WebCookieAuthorizationStatus | "idle">("idle")

const isCookieWebPlatform = computed(() => {
  return props.dynCfg?.authMode === AuthMode.WEBSITE && props.cfg?.passwordType === PasswordType.PasswordType_Cookie
})
const canAutoCapture = computed(() => isCookieWebPlatform.value && webCookieAuthorization.isAutoCaptureSupported())
const canOpenLogin = computed(() => canAutoCapture.value && !!props.dynCfg?.authUrl)
const canLogout = computed(() => isCookieWebPlatform.value && (props.dynCfg?.isAuth === true || !!props.cfg?.password))

const statusType = computed(() => {
  if (lastStatus.value === "success") {
    return "success"
  }
  if (!canAutoCapture.value) {
    return "neutral"
  }
  if (["no_cookie", "validation_failed", "error"].includes(lastStatus.value)) {
    return "warning"
  }
  return props.dynCfg?.isAuth ? "success" : "ready"
})

const statusLabel = computed(() => {
  if (lastStatus.value === "success") {
    return t("v2.webCookieAuth.status.success")
  }
  if (!canAutoCapture.value) {
    return t("v2.webCookieAuth.status.manual")
  }
  if (["no_cookie", "validation_failed", "error"].includes(lastStatus.value)) {
    return t("v2.webCookieAuth.status.retry")
  }
  return props.dynCfg?.isAuth ? t("v2.webCookieAuth.status.authorized") : t("v2.webCookieAuth.status.ready")
})

const statusDescription = computed(() => {
  if (!canAutoCapture.value) {
    return t("v2.webCookieAuth.desc.unsupported")
  }
  if (lastStatus.value === "success") {
    return t("v2.webCookieAuth.desc.success")
  }
  if (lastStatus.value === "no_cookie") {
    return t("v2.webCookieAuth.desc.noCookie")
  }
  if (lastStatus.value === "validation_failed") {
    return t("v2.webCookieAuth.desc.validationFailed")
  }
  if (lastStatus.value === "error") {
    return t("v2.webCookieAuth.desc.error")
  }
  return t("v2.webCookieAuth.desc.ready")
})

const autoCaptureTooltip = computed(() => {
  if (canAutoCapture.value) {
    return t("v2.webCookieAuth.tooltip.autoRead")
  }
  return t("v2.webCookieAuth.tooltip.unsupported")
})
const manualLabel = computed(() => {
  return props.isManualExpanded ? t("v2.webCookieAuth.manual.expanded") : t("v2.webCookieAuth.manual.collapsed")
})
const manualTooltip = computed(() => {
  return props.isManualExpanded ? t("v2.webCookieAuth.tooltip.manualExpanded") : t("v2.webCookieAuth.tooltip.manual")
})
const logoutTooltip = computed(() => {
  return t("v2.webCookieAuth.tooltip.logout")
})

const messageByStatus = (status: WebCookieAuthorizationStatus) => {
  switch (status) {
    case "success":
      return t("v2.webCookieAuth.message.success")
    case "no_cookie":
      return t("v2.webCookieAuth.message.noCookie")
    case "validation_failed":
      return t("v2.webCookieAuth.message.validationFailed")
    case "unsupported":
      return t("v2.webCookieAuth.message.unsupported")
    case "not_cookie_platform":
      return t("v2.webCookieAuth.message.notCookiePlatform")
    case "platform_not_found":
      return t("v2.webCookieAuth.message.platformNotFound")
    default:
      return t("v2.webCookieAuth.message.error")
  }
}

const logoutMessageByStatus = (status: WebCookieLogoutStatus) => {
  switch (status) {
    case "logout_success":
      return t("v2.webCookieAuth.message.logoutSuccess")
    case "url_fallback":
      return t("v2.webCookieAuth.message.logoutFallback")
    case "platform_not_found":
      return t("v2.webCookieAuth.message.platformNotFound")
    case "not_cookie_platform":
      return t("v2.webCookieAuth.message.notCookiePlatform")
    case "no_logout_method":
      return t("v2.webCookieAuth.message.noLogoutMethod")
    case "persist_failed":
      return t("v2.webCookieAuth.message.logoutPersistFailed")
    case "logout_failed":
      return t("v2.webCookieAuth.message.logoutFailed")
    default:
      return t("v2.webCookieAuth.message.logoutFailed")
  }
}

async function handleAutoCapture() {
  if (!canAutoCapture.value || isLoading.value) {
    if (!canAutoCapture.value) {
      lastStatus.value = "unsupported"
      ElMessage.warning(messageByStatus("unsupported"))
      emit("authorized", { status: "unsupported", ok: false })
    }
    return
  }

  isLoading.value = true
  try {
    const result = await webCookieAuthorization.authorize({
      platformKey: props.platformKey,
      currentCfg: props.cfg,
      dynCfg: props.dynCfg,
      setting: props.setting,
      dynamicConfigArray: props.dynamicConfigArray,
      onCookieChange: (cookie) => {
        props.cfg.password = cookie
      },
    })
    lastStatus.value = result.status
    if (result.ok) {
      ElMessage.success(messageByStatus(result.status))
    } else {
      ElMessage.warning(messageByStatus(result.status))
    }
    emit("authorized", { status: result.status, ok: result.ok })
  } catch {
    lastStatus.value = "error"
    ElMessage.error(messageByStatus("error"))
    emit("authorized", { status: "error", ok: false })
  } finally {
    isLoading.value = false
  }
}

async function handleLogout() {
  if (!canLogout.value || isLogoutLoading.value) {
    return
  }

  try {
    await ElMessageBox.confirm(t("v2.webCookieAuth.confirm.logout.message"), t("v2.webCookieAuth.confirm.logout.title"), {
      type: "warning",
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
    } as any)
  } catch {
    return
  }

  isLogoutLoading.value = true
  try {
    const result = await webCookieAuthorization.logout({
      platformKey: props.platformKey,
      currentCfg: props.cfg,
      dynCfg: props.dynCfg,
      setting: props.setting,
      dynamicConfigArray: props.dynamicConfigArray,
    })

    if (result.status === "logout_success") {
      props.cfg.password = ""
      if (props.dynCfg) {
        props.dynCfg.isAuth = false
      }
      ElMessage.success(logoutMessageByStatus(result.status))
    } else if (result.status === "url_fallback") {
      ElMessage.warning(logoutMessageByStatus(result.status))
    } else {
      ElMessage.error(logoutMessageByStatus(result.status))
    }
    emit("authorized", { status: result.status, ok: result.ok })
  } catch {
    ElMessage.error(logoutMessageByStatus("logout_failed"))
    emit("authorized", { status: "logout_failed", ok: false })
  } finally {
    isLogoutLoading.value = false
  }
}

function handleOpenLogin() {
  if (!canOpenLogin.value || !props.dynCfg?.authUrl) {
    return
  }

  openBrowserWindow(props.dynCfg.authUrl, props.dynCfg, undefined, undefined, false, true)
}

function handleToggleManual() {
  if (props.toggleManualEditor) {
    props.toggleManualEditor()
    return
  }
  props.expandManualEditor?.()
}
</script>

<style scoped lang="stylus">
@import "../../../assets/v2/variables.styl"

.syp-web-cookie-auth
  width 100%
  display flex
  flex-direction column
  gap 6px
  margin-top 6px
  padding 9px 10px
  border 1px solid #d8e4f5
  border-radius 10px
  background linear-gradient(180deg, #fbfdff 0%, #f6f9ff 100%)
  box-shadow 0 1px 2px rgba(15, 23, 42, 0.04)

  &.is-success
    border-color #bfecc8
    background linear-gradient(180deg, #fbfffc 0%, #f2fbf4 100%)

  &.is-warning
    border-color #ffd8a8
    background linear-gradient(180deg, #fffdf8 0%, #fff8ec 100%)

  &.is-neutral
    border-color #e1e5eb
    background linear-gradient(180deg, #ffffff 0%, #f7f8fa 100%)

.syp-web-cookie-auth__header
  display flex
  align-items center
  justify-content space-between
  gap 8px
  min-width 0

.syp-web-cookie-auth__identity
  display flex
  align-items center
  gap 6px
  min-width 0

.syp-web-cookie-auth__title
  font-size 12px
  font-weight 700
  color $syp-text-primary
  white-space nowrap

.syp-web-cookie-auth__badge
  display inline-flex
  align-items center
  padding 1px 7px
  border-radius 999px
  font-size 11px
  font-weight 700
  line-height 18px
  white-space nowrap

  &.is-success
    color #008a22
    background #e8ffea
    border 1px solid #a9efb2

  &.is-warning
    color #d25f00
    background #fff7e8
    border 1px solid #ffd59a

  &.is-ready
    color #1d5fd6
    background #eef5ff
    border 1px solid #cfe0ff

  &.is-neutral
    color #5f6b7a
    background #f2f3f5
    border 1px solid #d9dde4

:deep(.syp-web-cookie-auth__manual)
  display inline-flex
  align-items center
  min-width 0

.syp-web-cookie-auth__manual-button
  display inline-flex
  align-items center
  gap 4px
  padding 1px 7px
  border 0
  border-radius 999px
  background #f2f5fa
  color #64748b
  font-size 11px
  font-weight 600
  line-height 18px
  white-space nowrap
  cursor pointer

  &:hover
    background #e8edf5
    color #334155

  &.is-expanded
    background #eef5ff
    color #1d5fd6

.syp-web-cookie-auth__manual-icon
  width 13px
  height 13px
  display inline-flex
  align-items center
  justify-content center
  border-radius 50%
  background #ffffff
  color #4080ff
  font-size 10px
  font-weight 800
  font-family serif

.syp-web-cookie-auth__body
  display flex
  align-items center
  justify-content space-between
  gap 10px
  min-width 0

.syp-web-cookie-auth__desc
  min-width 140px
  color $syp-text-secondary
  font-size 11px
  line-height 1.45
  word-break break-word

.syp-web-cookie-auth__actions
  display flex
  align-items center
  justify-content flex-end
  gap 6px
  flex-shrink 0

:deep(.syp-web-cookie-auth__action)
  display inline-flex
  align-items center
  justify-content center
  gap 5px
  min-height 26px
  padding 0 10px
  border-radius 7px
  border 1px solid transparent
  font-size 12px
  font-weight 600
  line-height 24px
  white-space nowrap
  cursor pointer
  transition all 0.18s ease

:deep(.syp-web-cookie-auth__action.is-login)
  color #1d5fd6
  background #eef5ff
  border-color #cfe0ff

:deep(.syp-web-cookie-auth__action.is-login:hover)
  background #e3eeff
  border-color #a9c6ff

:deep(.syp-web-cookie-auth__action.is-logout)
  color #d25f00
  background #fff7e8
  border-color #ffd59a

:deep(.syp-web-cookie-auth__action.is-logout:hover)
  background #ffefcf
  border-color #ffc46f

:deep(.syp-web-cookie-auth__action.is-primary)
  color #ffffff
  background #4080ff
  border-color #4080ff
  box-shadow 0 2px 6px rgba(64, 128, 255, 0.22)

:deep(.syp-web-cookie-auth__action.is-primary:hover)
  background #2f6ff0
  border-color #2f6ff0

:deep(.syp-web-cookie-auth__action.is-disabled)
  opacity 0.55
  cursor not-allowed
  box-shadow none

:deep(.syp-web-cookie-auth__action.is-static:hover),
:deep(.syp-web-cookie-auth__action.is-static:active)
  opacity 0.55

:deep(.syp-web-cookie-auth__step)
  width 16px
  height 16px
  display inline-flex
  align-items center
  justify-content center
  border-radius 50%
  background rgba(255, 255, 255, 0.9)
  color inherit
  font-size 10px
  font-weight 800
  line-height 16px

:deep(.syp-web-cookie-auth__action.is-primary .syp-web-cookie-auth__step)
  color #4080ff
  background #ffffff

:deep(.syp-web-cookie-auth__action.is-login .syp-web-cookie-auth__step)
  color #1d5fd6
  background #ffffff

@media (max-width: 720px)
  .syp-web-cookie-auth__header,
  .syp-web-cookie-auth__body
    align-items flex-start
    flex-direction column

  .syp-web-cookie-auth__actions
    width 100%
    justify-content flex-start
    flex-wrap wrap
</style>
