<template>
  <section class="syp-settings-page">
    <div class="syp-settings-page__header">
      <div class="syp-settings-page__head">
        <button
          type="button"
          class="syp-settings-page__back"
          :aria-label="t('app.back.accountList')"
          @click="emit('back')"
        >
          <LucideChevronLeft />
        </button>
        <div>
          <div class="syp-settings-page__eyebrow">{{ t("platformConfig.eyebrow") }}</div>
          <h2 class="syp-settings-page__title">
            {{ platformName || t("platformConfig.title") }}
            <HelpButton :page-id="helpPageId" :page-title="platformName" />
          </h2>
          <p class="syp-settings-page__desc">
            {{ t("platformConfig.desc") }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="state.isLoading" class="syp-settings-empty">
      <div class="syp-settings-empty__title">{{ t("platformConfig.loading.title") }}</div>
      <div class="syp-settings-empty__desc">{{ t("platformConfig.loading.desc") }}</div>
    </div>

    <div v-else-if="state.errorMessage" class="syp-settings-empty">
      <div class="syp-settings-empty__title">{{ t("platformConfig.error.title") }}</div>
      <div class="syp-settings-empty__desc">{{ state.errorMessage }}</div>
    </div>

    <template v-else>
      <div v-if="bridgeComponent" class="syp-platform-bridge">
        <Suspense>
          <component
            :is="bridgeComponent"
            :api-type="platformKey"
            @validated="handleValidationResult"
            @saved="handleFormSaved"
          >
            <template #cookie-actions="cookieActions">
              <WebCookieAuthPanel
                :platform-key="platformKey"
                :cfg="cookieActions.cfg"
                :dyn-cfg="cookieActions.dynCfg"
                :setting="cookieActions.setting"
                :dynamic-config-array="cookieActions.dynamicConfigArray"
                :is-manual-expanded="cookieActions.isManualExpanded"
                :toggle-manual-editor="cookieActions.toggleManualEditor"
                :expand-manual-editor="cookieActions.expandManualEditor"
                @authorized="handleCookieAuthorized"
              />
            </template>
          </component>
          <template #fallback>
            <div class="syp-settings-empty">
              <div class="syp-settings-empty__title">{{ t("platformConfig.mounting.title") }}</div>
              <div class="syp-settings-empty__desc">{{ t("platformConfig.mounting.desc") }}</div>
            </div>
          </template>
        </Suspense>

        <!-- Inline validation failure bar -->
        <div v-if="validationError" class="syp-validation-error-bar" data-testid="syp-validation-error-bar">
          <span class="syp-validation-error-bar__text">{{ validationError }}</span>
          <button
            type="button"
            class="syp-validation-error-bar__action"
            data-testid="syp-validation-error-view-details"
            @click="emit('show-error-details')"
          >
            {{ t("platformConfig.validation.viewDetails") }}
          </button>
        </div>
      </div>

      <div v-else class="syp-settings-empty">
        <div class="syp-settings-empty__title">{{ t("platformConfig.unsupported.title") }}</div>
        <div class="syp-settings-empty__desc">
          {{ t("platformConfig.unsupported.desc") }}
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, provide, reactive, ref, watch, type Component } from "vue"
import { getBridgeComponent } from "~/src/ui/components/settings/bridge/bridgeRegistry.ts"
import {
    PLATFORM_CONFIG_ACTION_BRIDGE_KEY,
    type PlatformConfigValidationResult,
} from "~/src/ui/components/settings/bridge/platformConfigActionBridge.ts"
import WebCookieAuthPanel from "~/src/ui/components/settings/WebCookieAuthPanel.vue"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import type { WebCookieAuthEventStatus } from "~/src/composables/useWebCookieAuthorization.ts"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { SubPlatformType } from "~/src/platforms/dynamicConfig.ts"
import { EnvUtil } from "~/src/utils/EnvUtil.ts"
import { sanitizeSensitiveForLog } from "~/src/utils/sensitiveLogSanitizer.ts"
import HelpButton from "~/src/ui/components/bridge/common/help/HelpButton.vue"
import { SYP_HELP_PAGE_ID_KEY } from "~/src/ui/components/bridge/common/help/helpPageIdKey.ts"
import LucideChevronLeft from "~icons/lucide/chevron-left"

// 确保 page configs 已注册
import "~/src/helpConfigs/pages/index"

const props = defineProps<{
  platformKey: string
  platformName?: string
}>()

const emit = defineEmits<{
  (event: "cookie-authorized", result: { status: WebCookieAuthEventStatus; ok: boolean }): void
  (event: "validated", result: PlatformConfigValidationResult): void
  (event: "saved", result: { ok: boolean }): void
  (event: "show-error-details"): void
  (event: "back"): void
}>()

const { t } = useAppI18n()
const { getPublishCfg } = usePublishConfig()

// 配置页帮助上下文的唯一来源：页面帮助入口与字段级指引共用同一个 pageId，不在子组件里另拼一份
const helpPageId = computed(() => `platform-config/${props.platformKey}`)
provide(SYP_HELP_PAGE_ID_KEY, helpPageId)

provide(PLATFORM_CONFIG_ACTION_BRIDGE_KEY, {
  onValidated: handleValidationResult,
  onSaved: (result) => emit("saved", result),
})

const state = reactive({
  isLoading: true,
  errorMessage: "",
  subtype: "" as SubPlatformType | "",
})

const validationError = ref<string>("")

watch(validationError, async (nextError) => {
  if (nextError) {
    await nextTick()
    const el = document.querySelector(".syp-validation-error-bar") as HTMLElement | null
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }
})

const bridgeComponent = computed<Component | null>(() => {
  return getBridgeComponent(state.subtype, {
    electron: EnvUtil.isSiyuanElectron(),
  })
})

watch(
  () => props.platformKey,
  async () => {
    await loadBridgeMeta()
  }
)

onMounted(async () => {
  await loadBridgeMeta()
})

async function loadBridgeMeta() {
  if (!props.platformKey) {
    state.subtype = ""
    state.errorMessage = t("platformConfig.error.noPlatformKey")
    state.isLoading = false
    return
  }

  state.isLoading = true
  state.errorMessage = ""

  try {
    const publishCfg = await getPublishCfg(props.platformKey)
    state.subtype = publishCfg.dynCfg?.subPlatformType ?? ""
    if (!publishCfg.dynCfg) {
      state.errorMessage = t("platformConfig.error.notFound")
    }
  } catch (error) {
    state.errorMessage = error instanceof Error ? error.message : String(error ?? t("common.unknownError"))
    state.subtype = ""
  } finally {
    state.isLoading = false
  }
}

function handleCookieAuthorized(result: { status: WebCookieAuthEventStatus; ok: boolean }) {
  emit("cookie-authorized", result)
}

function handleValidationResult(result: PlatformConfigValidationResult) {
  if (!result.ok) {
    const raw = result.errorMessage || t("platformConfig.validation.failedGeneric")
    validationError.value = sanitizeSensitiveForLog(raw)
  } else {
    validationError.value = ""
  }
  emit("validated", result)
}

function handleFormSaved(result: { ok: boolean }) {
  emit("saved", result)
}
</script>

<style scoped lang="stylus">
@import "../../assets/variables.styl"
@import "../../assets/bridge.styl"

.syp-platform-bridge
  padding 10px
  border-radius $syp-sm-card-radius
  border 1px solid var(--b3-border-color, $syp-border-primary)
  overflow visible

  // 平台配置表单是复用组件，尺寸统一由共用 mixin 压到统一口径
  syp-compact-bridge()

  // 表单容器自身的字号（mixin 只管表单控件）
  :deep(.bridge-setting-form),
  :deep(.bridge-cookie-form)
    font-size 12px

.syp-validation-error-bar
  display flex
  align-items center
  justify-content space-between
  gap 8px
  margin-top 8px
  padding 6px 10px
  border-radius $syp-radius-sm
  background-color var(--b3-card-error-background, #fdecea)
  color var(--b3-theme-error, #d32f2f)
  font-size 12px
  line-height 1.5

  &__text
    flex 1 1 0
    min-width 0
    word-break break-word

  &__action
    flex 0 0 auto
    padding 2px 8px
    border none
    border-radius $syp-radius-sm
    background-color var(--b3-theme-error, #d32f2f)
    color #fff
    font-size 12px
    cursor pointer
    white-space nowrap

    &:hover
      opacity 0.85
</style>
