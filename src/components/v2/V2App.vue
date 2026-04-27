<template>
  <div
    class="syp-v2"
    @click.stop
    @mousedown.stop
    @mouseup.stop
    @pointerdown.stop
    @touchstart.stop
  >
    <div class="syp-panel">
      <div class="syp-header">
        <div class="syp-header-title-group">
          <div class="syp-header-chip">
            <LucideSend class="syp-header-chip__icon" />
            <span>{{ t("v2.app.brand") }}</span>
          </div>
          <div class="syp-header-title">{{ panelTitle }}</div>
        </div>
        <div class="syp-header-actions">
          <button
            v-if="!isSettingsView"
            class="syp-btn syp-btn-quiet"
            @click.stop="openSettings"
            :title="t('v2.app.action.openSettings')"
            :aria-label="t('v2.app.action.openSettings')"
          >
            <LucideSettings />
          </button>
          <button
            v-else
            class="syp-btn syp-btn-quiet"
            @click.stop="handleSettingsBack"
            :title="settingsBackTitle"
            :aria-label="settingsBackTitle"
          >
            <LucideChevronLeft />
          </button>
          <button
            class="syp-btn syp-btn-text"
            @click.stop="close"
            :title="t('v2.app.action.close')"
            :aria-label="t('v2.app.action.close')"
          >
            <LucideX />
          </button>
        </div>
      </div>

      <UnifiedWorkspaceShell
        :current-view="currentView"
        :active-section="settings.state.section"
        @change-section="changeSettingsSection"
      >
        <section v-if="!isSettingsView" class="syp-quick-shell">
          <div class="syp-quick-shell__eyebrow">{{ t("v2.quickPublish.currentDocument") }}</div>
          <h1 class="syp-quick-shell__title">{{ quickPublish.state.docTitle }}</h1>
          <p class="syp-quick-shell__desc">{{ t("v2.quickPublish.desc") }}</p>

          <div class="syp-publish-status" :class="`is-${publishState.status}`">
            <div class="syp-publish-status__title">{{ publishTitle }}</div>
            <div class="syp-publish-status__desc">{{ publishDescription }}</div>
            <div v-if="publishState.status === 'failed' && publishState.errMsg" class="syp-publish-status__error">
              <div class="syp-publish-status__error-title">{{ t("v2.quickPublish.errorDetails") }}</div>
              <pre class="syp-publish-status__error-text">{{ publishState.errMsg }}</pre>
            </div>
          </div>

          <div v-if="quickPublish.state.isLoading" class="syp-platform-skeleton-grid">
            <div class="syp-platform-skeleton">
              <div class="syp-platform-skeleton__title">{{ t("v2.quickPublish.loading.platforms") }}</div>
              <div class="syp-platform-skeleton__row"></div>
              <div class="syp-platform-skeleton__row short"></div>
              <div class="syp-platform-skeleton__row"></div>
            </div>
            <div class="syp-platform-skeleton">
              <div class="syp-platform-skeleton__title">{{ t("v2.quickPublish.loading.status") }}</div>
              <div class="syp-platform-skeleton__row short"></div>
              <div class="syp-platform-skeleton__row"></div>
            </div>
          </div>

          <div v-else-if="!quickPublish.state.hasDocument" class="syp-empty-state">
            <div class="syp-empty-state__title">{{ t("v2.quickPublish.empty.noDocument.title") }}</div>
            <div class="syp-empty-state__desc">{{ t("v2.quickPublish.empty.noDocument.desc") }}</div>
          </div>

          <div v-else-if="!hasPlatforms" class="syp-empty-state">
            <div class="syp-empty-state__title">{{ t("v2.quickPublish.empty.noPlatforms.title") }}</div>
            <div class="syp-empty-state__desc">{{ t("v2.quickPublish.empty.noPlatforms.desc") }}</div>
          </div>

          <div v-else class="syp-platform-grid">
            <V2PlatformCard
              v-for="item in quickPublish.state.platformItems"
              :key="item.platformKey"
              :platform-name="item.platformName"
              :platform-icon="item.platformIcon"
              :is-authorized="item.isAuthorized"
              :is-published="item.isPublished"
              :tooltip-text="item.tooltipText"
              :is-processing="publishState.isPublishing"
              :preview-link="previewLinkMap[item.platformKey]"
              :is-failed="isFailed(item)"
              @primary="publishToPlatform(item)"
              @preview="previewPlatform(item)"
              @delete="deletePlatform(item)"
            />
          </div>
        </section>

        <V2AccountList
          v-else-if="settings.state.section === 'account' && settings.state.accountView === 'list'"
          :items="settings.state.accountItems"
          @add="settings.openPlatformSelect"
          @configure="settings.openAccountConfig"
          @toggle="handleToggleAccountEnabled"
          @delete="handleDeleteAccount"
        />

        <V2PlatformSelect
          v-else-if="settings.state.section === 'account' && settings.state.accountView === 'select'"
          :items="settings.selectablePlatforms.value"
          @select="settings.createAccountDraft"
        />

        <V2PlatformConfigBridge
          v-else-if="settings.state.section === 'account' && settings.state.accountView === 'config'"
          :platform-key="settings.state.selectedPlatformKey"
          :platform-name="settings.state.selectedPlatformName"
        />

        <V2PicBedSettings v-else-if="settings.state.section === 'picbed'" />

        <V2PreferenceSettings v-else-if="settings.state.section === 'preference'" />

        <V2PreferenceSettings v-else />
      </UnifiedWorkspaceShell>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus"
import { computed, onMounted, ref } from "vue"
import "~/src/assets/v2/base.styl"
import UnifiedWorkspaceShell from "~/src/components/v2/layout/UnifiedWorkspaceShell.vue"
import V2PlatformCard from "~/src/components/v2/publish/V2PlatformCard.vue"
import V2AccountList from "~/src/components/v2/settings/V2AccountList.vue"
import V2PicBedSettings from "~/src/components/v2/settings/V2PicBedSettings.vue"
import V2PlatformSelect from "~/src/components/v2/settings/V2PlatformSelect.vue"
import V2PlatformConfigBridge from "~/src/components/v2/settings/V2PlatformConfigBridge.vue"
import V2PreferenceSettings from "~/src/components/v2/settings/V2PreferenceSettings.vue"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"
import { useV2QuickPublish } from "~/src/composables/v2/useV2QuickPublish.ts"
import { useV2Settings } from "~/src/composables/v2/useV2Settings.ts"
import LucideChevronLeft from "~icons/lucide/chevron-left"
import LucideSend from "~icons/lucide/send"
import LucideSettings from "~icons/lucide/settings"
import LucideX from "~icons/lucide/x"

const props = defineProps<{
  initialView?: "quick_publish" | "settings"
  onClose?: () => void
}>()

const currentView = ref<"quick_publish" | "settings">(props.initialView ?? "quick_publish")
const isSettingsView = computed(() => currentView.value === "settings")
const quickPublish = useV2QuickPublish()
const settings = useV2Settings()
const { t } = useV2I18n()
const hasPlatforms = computed(() => quickPublish.hasPlatforms.value)
const publishState = computed(() => quickPublish.state.publishState)
const previewLinkMap = computed<Record<string, string>>(() => quickPublish.state.previewLinkMap)

const panelTitle = computed(() => {
  return isSettingsView.value ? t("v2.app.panel.settings") : t("v2.app.panel.quickPublish")
})

const settingsBackTitle = computed(() => {
  if (settings.state.section === "account" && settings.state.accountView !== "list") {
    return t("v2.app.back.accountList")
  }
  return t("v2.app.back.quickPublish")
})

const publishTitle = computed(() => {
  const action = publishState.value.lastAction
  if (publishState.value.status === "preparing") {
    return action === "delete" ? t("v2.publish.title.preparingDelete") : t("v2.publish.title.preparing")
  }
  if (publishState.value.status === "publishing") {
    if (action === "update") {
      return t("v2.publish.title.updating")
    }
    if (action === "delete") {
      return t("v2.publish.title.deleting")
    }
    return t("v2.publish.title.publishing")
  }
  if (publishState.value.status === "success") {
    if (action === "update") {
      return t("v2.publish.title.updateSuccess")
    }
    if (action === "delete") {
      return t("v2.publish.title.deleteSuccess")
    }
    return t("v2.publish.title.publishSuccess")
  }
  if (publishState.value.status === "preview_ready") {
    return t("v2.publish.title.previewReady")
  }
  if (publishState.value.status === "failed") {
    if (action === "update") {
      return t("v2.publish.title.updateFailed")
    }
    if (action === "delete") {
      return t("v2.publish.title.deleteFailed")
    }
    return t("v2.publish.title.publishFailed")
  }
  return t("v2.publish.title.idle")
})

const publishDescription = computed(() => {
  const name = publishState.value.platformName
  const action = publishState.value.lastAction
  if (publishState.value.status === "preparing") {
    if (action === "delete") {
      return name
        ? t("v2.publish.desc.preparingDelete.named", { name })
        : t("v2.publish.desc.preparingDelete.default")
    }
    return name ? t("v2.publish.desc.preparing.named", { name }) : t("v2.publish.desc.preparing.default")
  }
  if (publishState.value.status === "publishing") {
    if (action === "update") {
      return name ? t("v2.publish.desc.updating.named", { name }) : t("v2.publish.desc.updating.default")
    }
    if (action === "delete") {
      return name ? t("v2.publish.desc.deleting.named", { name }) : t("v2.publish.desc.deleting.default")
    }
    return name ? t("v2.publish.desc.publishing.named", { name }) : t("v2.publish.desc.publishing.default")
  }
  if (publishState.value.status === "success") {
    if (action === "update") {
      return name ? t("v2.publish.desc.updateSuccess.named", { name }) : t("v2.publish.desc.updateSuccess.default")
    }
    if (action === "delete") {
      return name ? t("v2.publish.desc.deleteSuccess.named", { name }) : t("v2.publish.desc.deleteSuccess.default")
    }
    return name ? t("v2.publish.desc.publishSuccess.named", { name }) : t("v2.publish.desc.publishSuccess.default")
  }
  if (publishState.value.status === "preview_ready") {
    return name ? t("v2.publish.desc.previewReady.named", { name }) : t("v2.publish.desc.previewReady.default")
  }
  if (publishState.value.status === "failed") {
    if (action === "update") {
      return name ? t("v2.publish.desc.updateFailed.named", { name }) : t("v2.publish.desc.updateFailed.default")
    }
    if (action === "delete") {
      return name ? t("v2.publish.desc.deleteFailed.named", { name }) : t("v2.publish.desc.deleteFailed.default")
    }
    return name ? t("v2.publish.desc.publishFailed.named", { name }) : t("v2.publish.desc.publishFailed.default")
  }
  return t("v2.publish.desc.idle")
})

onMounted(async () => {
  await quickPublish.init()
  await settings.loadAccountItems()
})

async function openSettings() {
  await settings.setSection("account")
  currentView.value = "settings"
}

async function backToQuickPublish() {
  currentView.value = "quick_publish"
  await quickPublish.init()
}

async function changeSettingsSection(section: "account" | "picbed" | "preference") {
  await settings.setSection(section)
}

async function handleSettingsBack() {
  if (settings.state.section === "account" && settings.state.accountView !== "list") {
    await settings.backInAccountFlow()
    return
  }
  await backToQuickPublish()
}

function close() {
  props.onClose?.()
}

function publishToPlatform(item: typeof quickPublish.state.platformItems[number]) {
  quickPublish.publishToPlatform(item)
}

function previewPlatform(item: typeof quickPublish.state.platformItems[number]) {
  quickPublish.previewPlatform(item, true)
}

function deletePlatform(item: typeof quickPublish.state.platformItems[number]) {
  quickPublish.deletePlatform(item)
}

function isFailed(item: typeof quickPublish.state.platformItems[number]) {
  return publishState.value.status === "failed" && publishState.value.platformKey === item.platformKey
}

async function handleToggleAccountEnabled(platformKey: string, nextEnabled: boolean) {
  await settings.toggleAccountEnabled(platformKey, nextEnabled)
  await quickPublish.init()
}

async function handleDeleteAccount(platformKey: string) {
  try {
    await settings.phase4DeleteDraft(platformKey)
    await quickPublish.init()
    ElMessage.success(t("main.opt.success"))
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : t("main.opt.failure"))
  }
}
</script>

<style scoped lang="stylus">
.syp-v2
  width 960px
  max-width calc(100vw - 48px)
  max-height calc(100vh - 48px)
  display flex
  flex-direction column

.syp-panel
  min-height 520px
  max-height 100%
  display flex
  flex-direction column

.syp-header-title-group
  display flex
  align-items center
  gap 12px
  min-width 0

.syp-header-chip
  display inline-flex
  align-items center
  gap 8px
  padding 4px 10px
  border-radius 999px
  background #f3f6fa
  color #6a7788
  font-size 12px
  letter-spacing 0.04em

.syp-header-chip__icon
  width 14px
  height 14px

.syp-btn-quiet
  min-width 34px
  height 34px
  padding 0
  background transparent
  color #7b8794
  border-radius 999px

  &:hover
    color #355d90
    background rgba(53, 93, 144, 0.08)

.syp-quick-shell
  display flex
  flex-direction column
  gap 18px

.syp-publish-status
  padding 18px
  border-radius 14px
  border 1px solid #e6ebf2
  background #ffffff
  display flex
  flex-direction column
  gap 10px

  &.is-preparing,
  &.is-publishing
    background linear-gradient(180deg, #ffffff 0%, #f7fbff 100%)
    border-color #d6e4f5

  &.is-success,
  &.is-preview_ready
    background linear-gradient(180deg, #ffffff 0%, #f3fbf5 100%)
    border-color #d7f0df

  &.is-failed
    background linear-gradient(180deg, #ffffff 0%, #fff5f5 100%)
    border-color #f2d6d6

.syp-publish-status__title
  font-size 14px
  font-weight 600
  color #1f2329

.syp-publish-status__desc
  font-size 13px
  color #626a73

.syp-publish-status__error
  border-radius 10px
  background #fff1f1
  padding 12px
  border 1px solid #f0caca

.syp-publish-status__error-title
  font-size 12px
  font-weight 600
  color #b42318
  margin-bottom 6px

.syp-publish-status__error-text
  margin 0
  font-size 12px
  color #8a1c0f
  white-space pre-wrap

.syp-quick-shell__eyebrow
  font-size 12px
  letter-spacing 0.08em
  text-transform uppercase
  color #7b8490

.syp-quick-shell__title
  margin 0
  font-size 42px
  line-height 1
  color #1f2329

.syp-quick-shell__desc
  margin 0
  font-size 16px
  color #646a73

.syp-platform-skeleton-grid,
.syp-platform-grid
  display grid
  grid-template-columns repeat(2, minmax(0, 1fr))
  gap 16px

.syp-platform-skeleton
  padding 20px
  border-radius 14px
  background linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)
  border 1px solid #e6ebf2

.syp-platform-skeleton__title
  font-size 13px
  color #7b8490
  margin-bottom 14px

.syp-platform-skeleton__row
  height 44px
  border-radius 10px
  background linear-gradient(90deg, #eef2f7 0%, #f7f9fc 100%)
  margin-bottom 12px

  &.short
    width 62%

.syp-empty-state
  display flex
  flex-direction column
  gap 10px
  padding 28px
  border-radius 16px
  background linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)
  border 1px solid #e6ebf2

.syp-empty-state__title
  font-size 20px
  font-weight 600
  color #1f2329

.syp-empty-state__desc
  font-size 14px
  color #667085

@media (max-width: 960px)
  .syp-v2
    width auto
    max-width calc(100vw - 24px)

  .syp-header-title-group
    gap 8px

  .syp-platform-skeleton-grid,
  .syp-platform-grid
    grid-template-columns 1fr
</style>
