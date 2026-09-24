<template>
  <div class="syp-app" @click.stop @mousedown.stop @mouseup.stop @pointerdown.stop @touchstart.stop>
    <div class="syp-panel">
      <div class="syp-header">
        <div class="syp-header-title-group">
          <div class="syp-header-chip">
            <LucideSend class="syp-header-chip__icon" />
            <span>{{ t("app.brand") }}</span>
          </div>
          <div class="syp-header-title">{{ panelTitle }}</div>
        </div>
        <div class="syp-header-actions">
          <!-- 常驻主导航：入口集合与顺序恒定，任何点击都不隐藏、不替换入口。
               当前所在项以蓝色高亮表示；「返回上一层」由内容区自己承担，不占用入口。 -->
          <AppHeaderNav :entries="headerNavEntries" @select="selectHeaderNav" />
          <SypTooltip
            :content="t('app.action.close')"
            ellipsis
            inline-flex
            tag="button"
            class="syp-btn syp-btn-text"
            type="button"
            :aria-label="t('app.action.close')"
            @click.stop="close"
          >
            <LucideX />
          </SypTooltip>
        </div>
      </div>

      <UnifiedWorkspaceShell
        :current-view="currentView"
        :active-section="settings.state.section"
        @change-section="changeSettingsSection"
      >
        <div v-if="settingsSwitchLoading" class="syp-settings-switch-loading" role="status" aria-live="polite">
          <span class="syp-settings-switch-loading__dot"></span>
          <span>{{ t("main.loading") }}</span>
        </div>

        <div v-if="initError && !isSettingsView && !isManageView" class="syp-publish-status is-failed">
          <div class="syp-publish-status__title">{{ t("quickPublish.error.initFailed") }}</div>
          <div class="syp-publish-status__desc">{{ initError }}</div>
          <button type="button" class="syp-btn syp-btn-primary" @click="retryInit">{{ t("common.retry") }}</button>
        </div>

        <div v-else-if="isManageView" class="syp-manage-wrap">
          <ArticleManage
            @open-single="openManageSingle"
            @open-batch="openManageBatch"
            @open-flash="openManageFlash"
          />

          <!-- 管理页右侧滑入面板：列表仍在背后可见 -->
          <div v-if="managePanel" class="syp-manage-panel-mask" @click="closeManagePanelOnMask"></div>
          <aside
            v-if="managePanel"
            class="syp-manage-panel"
            role="dialog"
            :aria-label="panelTitle"
            @keydown.esc="closeManagePanel"
          >
            <div class="syp-manage-panel__head">
              <button
                type="button"
                class="syp-manage-panel__back"
                :aria-label="t('app.back.manage')"
                @click="closeManagePanel"
              >
                <LucideChevronLeft />
              </button>
              <span class="syp-manage-panel__title">{{ panelTitle }}</span>
            </div>
            <div class="syp-manage-panel__body">
              <SinglePublish
                v-if="managePanel === 'single'"
                :page-id="managePanelPageId"
                :preset-platform-key="managePanelPlatformKey || undefined"
                embedded
                @back="closeManagePanel"
              />
              <BatchPublish
                v-else-if="managePanel === 'batch'"
                :page-id="managePanelPageId"
                embedded
                @back="closeManagePanel"
              />
              <template v-else>
                <div class="syp-manage-panel__flashhint">{{ t("singlePublish.status.previewHint") }}</div>
                <QuickPublishGrid
                  :page-id="managePanelPageId"
                  @back="closeManagePanel"
                />
              </template>
            </div>
          </aside>
        </div>

        <SinglePublish
          v-else-if="isSinglePublishView"
          :page-id="quickPublish.state.pageId"
          @back="onSinglePublishBack"
        />

        <BatchPublish
          v-else-if="isBatchPublishView"
          :page-id="quickPublish.state.pageId"
          @back="onBatchPublishBack"
        />

        <AiChat v-else-if="isAiChatView" :page-id="quickPublish.state.pageId" @back="backToQuickPublish" />

        <section v-else-if="!isSettingsView" class="syp-quick-shell">
          <div class="syp-quick-shell__eyebrow">{{ t("quickPublish.currentDocument") }}</div>
          <h1 class="syp-quick-shell__title">{{ quickPublish.state.docTitle }}</h1>
          <p class="syp-quick-shell__desc">{{ t("quickPublish.desc") }}</p>

          <div
            class="syp-publish-status"
            :class="`is-${publishState.status}`"
            role="status"
            aria-live="polite"
            :aria-busy="publishState.isPublishing"
          >
            <div class="syp-publish-status__title">{{ publishTitle }}</div>
            <div class="syp-publish-status__desc">{{ publishDescription }}</div>
            <div
              v-if="publishState.status === 'success_with_warnings' && publishState.errMsg"
              class="syp-publish-status__warning"
            >
              <div class="syp-publish-status__warning-head">
                <div class="syp-publish-status__warning-title">
                  {{ t("quickPublish.warning.imageUploadFailed") }}
                </div>
                <button type="button" class="syp-publish-status__detail-btn" @click="showPublishErrorDetails">
                  {{ t("quickPublish.action.viewErrorDetails") }}
                </button>
              </div>
            </div>
            <div v-if="publishState.status === 'failed' && publishState.errMsg" class="syp-publish-status__error">
              <div class="syp-publish-status__error-head">
                <div class="syp-publish-status__error-title">{{ publishState.errMsg }}</div>
                <button type="button" class="syp-publish-status__detail-btn is-error" @click="showPublishErrorDetails">
                  {{ t("quickPublish.action.viewErrorDetails") }}
                </button>
              </div>
            </div>
          </div>

          <!-- 加载中：只用一行轻量提示给出确定性，不做满屏占位块。
               提示本身不承载信息，故保持最小；而留白会让用户无法判断是在加载还是出了问题 -->
          <div
            v-if="quickPublish.state.isLoading"
            class="syp-platform-loading"
            role="status"
            aria-live="polite"
          >
            <span class="syp-platform-loading__dot"></span>
            <span>{{ t("main.loading") }}</span>
          </div>

          <template v-else>
            <div v-if="!quickPublish.state.hasDocument" class="syp-empty-state">
              <div class="syp-empty-state__title">{{ t("quickPublish.empty.noDocument.title") }}</div>
              <div class="syp-empty-state__desc">{{ t("quickPublish.empty.noDocument.desc") }}</div>
            </div>

            <div v-else-if="!hasPlatforms" class="syp-empty-state">
              <div class="syp-empty-state__title">{{ t("quickPublish.empty.noPlatforms.title") }}</div>
              <div class="syp-empty-state__desc">{{ t("quickPublish.empty.noPlatforms.desc") }}</div>
            </div>

            <div v-else class="syp-platform-grid">
            <PlatformCard
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
              :can-force-delete="canForceDelete(item)"
              @primary="publishToPlatform(item)"
              @preview="previewPlatform(item)"
              @delete="deletePlatform(item)"
              @force-delete="forceDeletePlatform(item)"
              @configure="configurePlatform(item)"
            />
            </div>
          </template>
        </section>

        <AccountList
          v-else-if="settings.state.section === 'account' && settings.state.accountView === 'list'"
          :items="settings.state.accountItems"
          @add="settings.openPlatformSelect"
          @configure="settings.openAccountConfig"
          @toggle="handleToggleAccountEnabled"
          @delete="handleDeleteAccount"
          @reorder="handleReorderAccounts"
        />

        <PlatformSelect
          v-else-if="settings.state.section === 'account' && settings.state.accountView === 'select'"
          :items="settings.selectablePlatforms.value"
          @select="settings.createAccountDraft"
          @back="handleAccountFlowBack"
        />

        <PlatformConfigBridge
          v-else-if="settings.state.section === 'account' && settings.state.accountView === 'config'"
          :platform-key="settings.state.selectedPlatformKey"
          :platform-name="settings.state.selectedPlatformName"
          @cookie-authorized="handleCookieAuthorized"
          @validated="handleConfigValidated"
          @saved="handleConfigSaved"
          @show-error-details="showLastConfigValidationError"
          @back="handleAccountFlowBack"
        />

        <PicBedSettings v-else-if="settings.state.section === 'picbed'" />

        <PreferenceSettings v-else-if="settings.state.section === 'preference'" />

        <RepairPublishRecords v-else-if="settings.state.section === 'repair'" :doc-id="props.docId" />

        <section v-else-if="settings.state.section === 'ai'" class="syp-settings-page syp-settings-ai">
          <div class="syp-settings-page__header">
            <div>
              <div class="syp-settings-page__eyebrow">{{ t("ai.eyebrow") }}</div>
              <h2 class="syp-settings-page__title">{{ t("ai.title") }}</h2>
              <p class="syp-settings-page__desc">{{ t("ai.desc") }}</p>
            </div>
          </div>
          <AiSetting />
        </section>

        <About v-else-if="settings.state.section === 'about'" />

        <PreferenceSettings v-else />
      </UnifiedWorkspaceShell>

      <SypErrorDetailsPanel
        :visible="errorDetailsState.visible"
        :title="errorDetailsState.title"
        :summary="errorDetailsState.summary"
        :details="errorDetailsState.details"
        :copy-label="t('main.copy')"
        :copy-success-text="t('main.copy.success')"
        :copy-failure-text="t('main.copy.failure')"
        :close-label="t('main.opt.ok')"
        @close="hideErrorDetails"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref } from "vue"
import "~/src/ui/assets/base.styl"
import SypErrorDetailsPanel from "~/src/ui/components/common/SypErrorDetailsPanel.vue"
import SypTooltip from "~/src/ui/components/common/SypTooltip.vue"
import AppHeaderNav from "~/src/ui/components/layout/AppHeaderNav.vue"
import { type AppView } from "~/src/ui/components/layout/UnifiedWorkspaceShell.vue"
import UnifiedWorkspaceShell from "~/src/ui/components/layout/UnifiedWorkspaceShell.vue"
import {
  buildHeaderNavEntries,
  resolveHeaderNavAction,
  type HeaderNavKey,
} from "~/src/ui/composables/useHeaderNav.ts"
import PlatformCard from "~/src/ui/components/publish/PlatformCard.vue"
import SinglePublish from "~/src/ui/components/publish/SinglePublish.vue"
import BatchPublish from "~/src/ui/components/publish/BatchPublish.vue"
import QuickPublishGrid from "~/src/ui/components/publish/QuickPublishGrid.vue"
import ArticleManage from "~/src/ui/components/ArticleManage.vue"
import AiChat from "~/src/ui/components/AiChat.vue"
import { type PlatformConfigValidationResult } from "~/src/ui/components/settings/bridge/platformConfigActionBridge.ts"
import AccountList from "~/src/ui/components/settings/AccountList.vue"
import About from "~/src/ui/components/settings/About.vue"
import PicBedSettings from "~/src/ui/components/settings/PicBedSettings.vue"
import PlatformConfigBridge from "~/src/ui/components/settings/PlatformConfigBridge.vue"
import PlatformSelect from "~/src/ui/components/settings/PlatformSelect.vue"
import PreferenceSettings from "~/src/ui/components/settings/PreferenceSettings.vue"
import RepairPublishRecords from "~/src/ui/components/settings/RepairPublishRecords.vue"
import AiSetting from "~/src/ui/components/bridge/set/preference/AiSetting.vue"
import { useErrorDetails } from "~/src/ui/composables/useErrorDetails.ts"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { usePublishValidation } from "~/src/ui/composables/usePublishValidation.ts"
import { useQuickPublish } from "~/src/ui/composables/useQuickPublish.ts"
import { useSettings, type SettingsSection } from "~/src/ui/composables/useSettings.ts"
import { MessageError, MessageSuccess, MessageWarning } from "~/src/ui/composables/floatingUi.ts"
import LucideChevronLeft from "~icons/lucide/chevron-left"
import LucideSend from "~icons/lucide/send"
import LucideX from "~icons/lucide/x"

const props = defineProps<{
  /** 宿主指定的初始视图，缺省「快速发布」 */
  initialView?: AppView
  /** 宿主指定的初始设置分区，缺省为「账号设置」 */
  initialSection?: SettingsSection
  /** 宿主指定的当前文档 id；缺省取活动文档（`WidgetPageUtils.getPageId()`） */
  docId?: string
  /** 进入快速发布后立即对该平台执行发布（文档块菜单的一键入口） */
  autoPublishPlatformKey?: string
  onClose?: () => void
}>()

const currentView = ref<AppView>(props.initialView ?? "quick_publish")
const isSettingsView = computed(() => currentView.value === "settings")
const isManageView = computed(() => currentView.value === "manage")
const isSinglePublishView = computed(() => currentView.value === "single_publish")
const isBatchPublishView = computed(() => currentView.value === "batch_publish")
const isAiChatView = computed(() => currentView.value === "ai_chat")
const isQuickPublishView = computed(() => currentView.value === "quick_publish")

// 管理页「单发/批发/闪发」的右侧滑入面板（列表仍在背后可见）
type ManagePanel = "single" | "batch" | "flash"
const managePanel = ref<ManagePanel | null>(null)
const managePanelPageId = ref("")
const managePanelPlatformKey = ref("")
const managePanelTitle = ref("")
const initError = ref("")
const quickPublish = useQuickPublish()
const settings = useSettings()
const publishValidation = usePublishValidation()
const { t } = useAppI18n()
const hasPlatforms = computed(() => quickPublish.hasPlatforms.value)
const publishState = computed(() => quickPublish.state.publishState)
const previewLinkMap = computed<Record<string, string>>(() => quickPublish.state.previewLinkMap)
const { errorDetailsState, showErrorDetails, storeErrorDetails, hideErrorDetails, clearErrorDetails, reopenErrorDetails } =
  useErrorDetails()
provide("show-error-details", showErrorDetails)
const settingsSwitchLoading = ref(false)
let settingsSwitchLoadingTimer: number | undefined

/** 入口集合与顺序由 useHeaderNav 唯一决定，不随视图增删 */
const headerNavEntries = computed(() =>
  buildHeaderNavEntries({ currentView: currentView.value, hasDocument: quickPublish.state.hasDocument })
)

/**
 * 顶部导航点击。
 *
 * 入口本身永远是入口：这里只负责「去哪」，绝不把入口换成「返回」。
 * 动作解析见 resolveHeaderNavAction（不可用→不动；不在该视图→前往；已在该入口→回到根状态）。
 */
async function selectHeaderNav(key: HeaderNavKey, disabled: boolean) {
  const action = resolveHeaderNavAction({ key, disabled, currentView: currentView.value })
  if (action === "none") {
    return
  }

  if (action === "reset") {
    if (key === "manage") {
      closeManagePanel()
      return
    }
    await settings.setSection("account")
    return
  }

  await navigateToHeaderView(key)
}

async function navigateToHeaderView(key: HeaderNavKey) {
  if (key !== "manage") {
    // 离开文章管理时收起滑入面板，避免面板状态残留到其他视图
    closeManagePanel()
  }

  switch (key) {
    case "quick_publish":
      await backToQuickPublish()
      return
    case "single_publish":
      await openSinglePublishForCurrent()
      return
    case "batch_publish":
      await openBatchPublishForCurrent()
      return
    case "manage":
      openManage()
      return
    case "settings":
      await openSettings()
      return
  }
}

const panelTitle = computed(() => {
  if (isManageView.value) {
    if (managePanel.value === "single") {
      return managePanelTitle.value || t("panel.singlePublish")
    }
    if (managePanel.value === "batch") {
      return t("panel.batchPublish")
    }
    if (managePanel.value === "flash") {
      return t("panel.quickPublish")
    }
    return t("app.panel.manage")
  }
  if (isSinglePublishView.value) {
    return t("panel.singlePublish")
  }
  if (isBatchPublishView.value) {
    return t("panel.batchPublish")
  }
  if (isAiChatView.value) {
    return t("panel.aiChat")
  }
  return isSettingsView.value ? t("app.panel.settings") : t("app.panel.quickPublish")
})

const publishTitle = computed(() => {
  const action = publishState.value.lastAction
  if (publishState.value.status === "preparing") {
    return action === "delete" ? t("publish.title.preparingDelete") : t("publish.title.preparing")
  }
  if (publishState.value.status === "publishing") {
    if (action === "update") {
      return t("publish.title.updating")
    }
    if (action === "delete") {
      return t("publish.title.deleting")
    }
    return t("publish.title.publishing")
  }
  if (publishState.value.status === "success") {
    if (action === "update") {
      return t("publish.title.updateSuccess")
    }
    if (action === "delete") {
      return t("publish.title.deleteSuccess")
    }
    return t("publish.title.publishSuccess")
  }
  if (publishState.value.status === "success_with_warnings") {
    if (action === "update") {
      return t("publish.title.updateSuccessWithWarnings")
    }
    return t("publish.title.publishSuccessWithWarnings")
  }
  if (publishState.value.status === "preview_ready") {
    return t("publish.title.previewReady")
  }
  if (publishState.value.status === "failed") {
    if (action === "update") {
      return t("publish.title.updateFailed")
    }
    if (action === "delete") {
      return t("publish.title.deleteFailed")
    }
    return t("publish.title.publishFailed")
  }
  return t("publish.title.idle")
})

const publishDescription = computed(() => {
  const name = publishState.value.platformName
  const action = publishState.value.lastAction
  if (publishState.value.status === "preparing") {
    if (action === "delete") {
      return name ? t("publish.desc.preparingDelete.named", { name }) : t("publish.desc.preparingDelete.default")
    }
    return name ? t("publish.desc.preparing.named", { name }) : t("publish.desc.preparing.default")
  }
  if (publishState.value.status === "publishing") {
    if (action === "update") {
      return name ? t("publish.desc.updating.named", { name }) : t("publish.desc.updating.default")
    }
    if (action === "delete") {
      return name ? t("publish.desc.deleting.named", { name }) : t("publish.desc.deleting.default")
    }
    return name ? t("publish.desc.publishing.named", { name }) : t("publish.desc.publishing.default")
  }
  if (publishState.value.status === "success") {
    if (action === "update") {
      return name ? t("publish.desc.updateSuccess.named", { name }) : t("publish.desc.updateSuccess.default")
    }
    if (action === "delete") {
      return name ? t("publish.desc.deleteSuccess.named", { name }) : t("publish.desc.deleteSuccess.default")
    }
    return name ? t("publish.desc.publishSuccess.named", { name }) : t("publish.desc.publishSuccess.default")
  }
  if (publishState.value.status === "success_with_warnings") {
    if (action === "update") {
      return name
        ? t("publish.desc.updateSuccessWithWarnings.named", { name })
        : t("publish.desc.updateSuccessWithWarnings.default")
    }
    return name
      ? t("publish.desc.publishSuccessWithWarnings.named", { name })
      : t("publish.desc.publishSuccessWithWarnings.default")
  }
  if (publishState.value.status === "preview_ready") {
    return name ? t("publish.desc.previewReady.named", { name }) : t("publish.desc.previewReady.default")
  }
  if (publishState.value.status === "failed") {
    if (publishState.value.errMsg) {
      if (action === "update") {
        return name
          ? t("publish.desc.updateFailedWithReason.named", { name, reason: publishState.value.errMsg })
          : t("publish.desc.updateFailedWithReason.default", { reason: publishState.value.errMsg })
      }
      if (action === "delete") {
        return name
          ? t("publish.desc.deleteFailedWithReason.named", { name, reason: publishState.value.errMsg })
          : t("publish.desc.deleteFailedWithReason.default", { reason: publishState.value.errMsg })
      }
      return name
        ? t("publish.desc.publishFailedWithReason.named", { name, reason: publishState.value.errMsg })
        : t("publish.desc.publishFailedWithReason.default", { reason: publishState.value.errMsg })
    }
    if (action === "update") {
      return name ? t("publish.desc.updateFailed.named", { name }) : t("publish.desc.updateFailed.default")
    }
    if (action === "delete") {
      return name ? t("publish.desc.deleteFailed.named", { name }) : t("publish.desc.deleteFailed.default")
    }
    return name ? t("publish.desc.publishFailed.named", { name }) : t("publish.desc.publishFailed.default")
  }
  return t("publish.desc.idle")
})

onMounted(async () => {
  window.addEventListener("keydown", handleWindowKeydown)
  // 宿主可指定初始分区（例如顶栏「关于作者」直接落到关于页）
  if (props.initialSection && props.initialSection !== "account") {
    await settings.setSection(props.initialSection)
  }
  try {
    await quickPublish.init(props.docId)
  } catch (e) {
    initError.value = e instanceof Error ? e.message : String(e ?? t("common.unknownError"))
  }
  try {
    await settings.loadAccountItems()
  } catch {
    // Settings error is handled internally by the component
  }
  // 文档块菜单的一键入口：面板打开后直接对指定平台执行发布
  const autoKey = props.autoPublishPlatformKey
  if (autoKey) {
    const target = quickPublish.state.platformItems.find((item) => item.platformKey === autoKey)
    if (target) {
      publishToPlatform(target)
    }
  }
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleWindowKeydown)
})

function handleWindowKeydown(event: KeyboardEvent) {
  if (event.key !== "Escape") {
    return
  }
  if (managePanel.value) {
    closeManagePanel()
  }
}

async function openSettings() {
  closeManagePanel()
  await settings.setSection("account")
  currentView.value = "settings"
}

async function backToQuickPublish() {
  currentView.value = "quick_publish"
  await quickPublish.init(props.docId)
}

async function openManage() {
  currentView.value = "manage"
}

function openManagePanel(panel: ManagePanel, pageId: string, platformKey = "") {
  if (!pageId) {
    return
  }
  managePanel.value = panel
  managePanelPageId.value = pageId
  managePanelPlatformKey.value = platformKey
}

function closeManagePanel() {
  managePanel.value = null
  managePanelPageId.value = ""
  managePanelPlatformKey.value = ""
}

function closeManagePanelOnMask() {
  if (managePanel.value !== null) {
    closeManagePanel()
  }
}

function openManageSingle(pageId: string, platformKey = "", title = "") {
  managePanelTitle.value = title
  openManagePanel("single", pageId, platformKey)
}

function openManageBatch(pageId: string, title = "") {
  managePanelTitle.value = title
  openManagePanel("batch", pageId)
}

function openManageFlash(pageId: string, title = "") {
  managePanelTitle.value = title
  openManagePanel("flash", pageId)
}

async function backFromSinglePublish() {
  await backToQuickPublish()
}

async function backFromBatchPublish() {
  await backToQuickPublish()
}

/**
 * quick_publish 卡片「详细发布」：以当前文档进入详细发布视图。
 */
async function openSinglePublishForCurrent() {
  currentView.value = "single_publish"
}

/**
 * quick_publish 卡片「批量分发」：直接进入批量发布视图。
 *
 * 与文章管理内的批量入口同一视图，这里只是把入口也放到顶部动作条，
 * 从快速发布页即可直接进入，无需先绕到文章管理。
 */
async function openBatchPublishForCurrent() {
  currentView.value = "batch_publish"
}

function onSinglePublishBack() {
  if (managePanel.value === "single") {
    closeManagePanel()
    return
  }
  void backFromSinglePublish()
}

function onBatchPublishBack() {
  if (managePanel.value === "batch") {
    closeManagePanel()
    return
  }
  void backFromBatchPublish()
}

async function changeSettingsSection(section: "account" | "picbed" | "preference" | "repair" | "ai" | "about") {
  if (settings.state.section === section && settings.state.accountView === "list") {
    return
  }

  clearSettingsSwitchLoadingTimer()
  settingsSwitchLoadingTimer = window.setTimeout(() => {
    settingsSwitchLoading.value = true
  }, 50)

  try {
    await settings.setSection(section)
  } finally {
    clearSettingsSwitchLoadingTimer()
    settingsSwitchLoading.value = false
  }
}

function clearSettingsSwitchLoadingTimer() {
  if (settingsSwitchLoadingTimer) {
    window.clearTimeout(settingsSwitchLoadingTimer)
    settingsSwitchLoadingTimer = undefined
  }
}

/**
 * 账号子流程（选平台 / 平台配置）的内容区返回。
 *
 * 返回顶部导航不承担「返回上一层」：入口恒为入口，退出由所在内容区提供。
 * 从快速发布卡片「配置」进来的配置页，返回时回到快速发布，与来路一致。
 */
async function handleAccountFlowBack() {
  if (settings.state.section === "account" && settings.state.accountView === "config") {
    const returnTarget = settings.getConfigReturnTarget()
    if (returnTarget === "quick_publish") {
      await backToQuickPublish()
      return
    }
  }

  if (settings.state.section === "account" && settings.state.accountView !== "list") {
    await settings.backInAccountFlow()
    return
  }

  await backToQuickPublish()
}

function close() {
  props.onClose?.()
}

function publishToPlatform(item: (typeof quickPublish.state.platformItems)[number]) {
  quickPublish.publishToPlatform(item)
}

function previewPlatform(item: (typeof quickPublish.state.platformItems)[number]) {
  quickPublish.previewPlatform(item, true)
}

function deletePlatform(item: (typeof quickPublish.state.platformItems)[number]) {
  quickPublish.deletePlatform(item)
}

async function configurePlatform(item: (typeof quickPublish.state.platformItems)[number]) {
  currentView.value = "settings"
  await settings.setSection("account")
  await settings.openAccountConfig(item.platformKey, item.platformName, "quick_publish")
}

function isFailed(item: (typeof quickPublish.state.platformItems)[number]) {
  return publishState.value.status === "failed" && publishState.value.platformKey === item.platformKey
}

// 仅当该平台「删除失败」时才允许「强制删除」，正常状态下始终为 false，避免误导/误操作。
function canForceDelete(item: (typeof quickPublish.state.platformItems)[number]) {
  return (
    publishState.value.status === "failed" &&
    publishState.value.platformKey === item.platformKey &&
    publishState.value.canForceDelete === true
  )
}

function forceDeletePlatform(item: (typeof quickPublish.state.platformItems)[number]) {
  quickPublish.forceDeletePlatform(item)
}

function showPublishErrorDetails() {
  showErrorDetails(
    t("quickPublish.errorDetails"),
    publishState.value.errMsg || t("common.unknownError"),
    publishState.value.errDetails || publishState.value.errMsg || t("common.unknownError")
  )
}

function showLastConfigValidationError() {
  reopenErrorDetails()
}

async function handleToggleAccountEnabled(platformKey: string, nextEnabled: boolean) {
  await settings.toggleAccountEnabled(platformKey, nextEnabled)
  await quickPublish.init()
}

async function handleDeleteAccount(platformKey: string) {
  try {
    await settings.phase4DeleteDraft(platformKey)
    await quickPublish.init()
    MessageSuccess(t("main.opt.success"))
  } catch (error) {
    MessageError(error instanceof Error ? error.message : t("main.opt.failure"))
  }
}

async function handleReorderAccounts(orderedPlatformKeys: string[]) {
  try {
    await settings.reorderAccounts(orderedPlatformKeys)
    await quickPublish.init()
  } catch (error) {
    await settings.loadAccountItems()
    MessageError(error instanceof Error ? error.message : t("account.order.saveFailed"))
  }
}

async function handleCookieAuthorized(_result: { ok: boolean }) {
  await settings.loadAccountItems()
  await quickPublish.init()
}

async function completeConfigIfPublishReady() {
  const platformKey = settings.state.selectedPlatformKey
  if (!platformKey) {
    return
  }

  const validation = await publishValidation.validatePlatformPublish(platformKey)
  if (validation.isAuth === true && validation.canPublish === true && validation.dynCfg) {
    await publishValidation.enableAccountAfterPublishValidation(platformKey, validation.dynCfg)
    const returnTarget = settings.getConfigReturnTarget()
    await settings.finishAccountConfig()
    await quickPublish.init()
    if (returnTarget === "quick_publish") {
      currentView.value = "quick_publish"
    }
    return
  }

  await settings.loadAccountItems()
  await quickPublish.init()
  MessageWarning(validation.reason || t("publishValidation.incomplete"))
}

async function handleConfigValidated(result: PlatformConfigValidationResult) {
  await settings.loadAccountItems()
  await quickPublish.init()
  if (result.ok) {
    hideErrorDetails()
    clearErrorDetails()
    await completeConfigIfPublishReady()
  } else {
    const summary = result.errorMessage || t("platformConfig.validation.failedGeneric")
    storeErrorDetails(
      t("platformConfig.validation.errorTitle"),
      summary,
      result.errorDetails || result.errorMessage || summary
    )
  }
}

async function handleConfigSaved(result: { ok: boolean }) {
  await settings.loadAccountItems()
  await quickPublish.init()
  if (result.ok) {
    await completeConfigIfPublishReady()
  }
}

async function retryInit() {
  initError.value = ""
  try {
    await quickPublish.init()
  } catch (e) {
    initError.value = e instanceof Error ? e.message : String(e ?? t("common.unknownError"))
  }
}
</script>

<style scoped lang="stylus">
@import "../assets/variables.styl"
@import "../assets/bridge.styl"

// AI 设置页内嵌的是复用组件 AiSetting，尺寸统一由共用 mixin 压到统一口径
.syp-settings-ai
  syp-compact-bridge()

  :deep(.ai-setting-form)
    font-size 12px

.syp-app
  position relative
  width 960px
  max-width calc(100vw - 48px)
  max-height calc(100vh - 180px)
  display flex
  flex-direction column

.syp-panel
  position relative
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
  background var(--b3-theme-surface-light, $syp-chip-bg)
  color var(--b3-theme-on-surface-light, $syp-chip-text)
  font-size 12px
  letter-spacing 0.04em

.syp-header-chip__icon
  width 14px
  height 14px

.syp-header-actions
  display flex
  align-items center
  gap 8px
  flex-shrink 0

// 标题只做位置提示，窄面板下让位给常驻导航：截断而不是挤压导航
.syp-header-title
  min-width 0
  overflow hidden
  text-overflow ellipsis
  white-space nowrap

.syp-settings-switch-loading
  position sticky
  top 0
  z-index 20
  display inline-flex
  align-self flex-end
  align-items center
  gap 6px
  margin-bottom 8px
  padding 6px 10px
  border-radius 999px
  border 1px solid $syp-border-primary
  background rgba(64, 128, 255, 0.10)
  color $syp-primary
  font-size 12px
  font-weight 600
  box-shadow 0 4px 14px rgba(22, 119, 255, 0.10)

.syp-settings-switch-loading__dot
  width 7px
  height 7px
  border-radius 999px
  background $syp-primary
  animation syp-settings-loading-pulse 0.9s ease-in-out infinite alternate

@keyframes syp-settings-loading-pulse
  from
    opacity 0.35
    transform scale(0.82)
  to
    opacity 1
    transform scale(1)

.syp-quick-shell
  display flex
  flex-direction column
  gap 12px

// 发布状态条：思源语义色（--b3-theme-*），明/暗由宿主变量驱动
.syp-publish-status
  padding 8px 12px
  border-radius $syp-radius-md
  border 1px solid var(--b3-border-color, $syp-border-primary)
  background var(--b3-theme-surface, $syp-bg-primary)
  display flex
  flex-direction column
  gap 4px
  transition background 0.2s ease, border-color 0.2s ease

  &.is-idle
    background var(--b3-theme-surface-light, $syp-bg-secondary)
    border 1px dashed var(--b3-border-color, $syp-border-primary)

    .syp-publish-status__title
      font-weight 500
      color var(--b3-theme-on-surface-light, $syp-text-secondary)

    .syp-publish-status__desc
      color var(--b3-theme-on-surface-light, $syp-text-tertiary)

  &.is-preparing,
  &.is-publishing
    background var(--b3-theme-primary-lightest, $syp-status-info-bg)
    border 1px solid var(--b3-theme-primary, $syp-primary)

    .syp-publish-status__title
      color var(--b3-theme-primary, $syp-primary)

    .syp-publish-status__desc
      color var(--b3-theme-on-surface, $syp-text-secondary)

  &.is-success,
  &.is-preview_ready
    background var(--b3-theme-surface-light, $syp-status-success-bg)
    border 1px solid var(--b3-theme-success, $syp-success)

    .syp-publish-status__title
      color var(--b3-theme-success, $syp-success)

    .syp-publish-status__desc
      color var(--b3-theme-on-surface, $syp-text-secondary)

  &.is-success_with_warnings
    background var(--b3-theme-surface-light, $syp-status-warning-bg)
    border 1px solid var(--b3-theme-warning, $syp-warning)

    .syp-publish-status__title
      color var(--b3-theme-warning, $syp-warning)

    .syp-publish-status__desc
      color var(--b3-theme-on-surface, $syp-text-secondary)

  &.is-failed
    background var(--b3-theme-surface-light, $syp-status-error-bg)
    border 1px solid var(--b3-theme-error, $syp-error)

    .syp-publish-status__title
      color var(--b3-theme-error, $syp-error)

    .syp-publish-status__desc
      color var(--b3-theme-on-surface, $syp-text-secondary)

.syp-publish-status__title
  font-size 14px
  font-weight 600
  line-height 1.5
  color var(--b3-theme-on-background, $syp-text-primary)

.syp-publish-status__desc
  font-size 13px
  color var(--b3-theme-on-surface-light, $syp-text-secondary)
  line-height 1.5

.syp-publish-status__warning
  border-radius 10px
  background var(--b3-theme-surface-light, $syp-status-warning-deep-bg)
  padding 10px 12px
  border 1px solid var(--b3-border-color, $syp-status-warning-border)

.syp-publish-status__warning-head,
.syp-publish-status__error-head
  display flex
  align-items center
  justify-content space-between
  gap 10px

.syp-publish-status__warning-title
  font-size 12px
  font-weight 600
  color var(--b3-theme-warning, $syp-warning)
  margin-bottom 0

.syp-publish-status__detail-btn
  min-height 24px
  padding 0 8px
  border-radius 7px
  border 1px solid var(--b3-border-color, $syp-status-warning-border)
  background var(--b3-theme-surface, $syp-bg-primary)
  color var(--b3-theme-warning, $syp-warning)
  font-size 12px
  font-weight 600
  cursor pointer

  &:hover
    background var(--b3-theme-surface-light, $syp-bg-secondary)
    border-color var(--b3-theme-warning, $syp-warning)

  &.is-error
    border-color var(--b3-border-color, $syp-status-error-border)
    color var(--b3-theme-error, $syp-error)

    &:hover
      border-color var(--b3-theme-error, $syp-error)

.syp-publish-status__error
  border-radius 10px
  background var(--b3-theme-surface-light, $syp-status-error-deep-bg)
  padding 10px 12px
  border 1px solid var(--b3-border-color, $syp-status-error-border)

.syp-publish-status__error-title
  font-size 12px
  font-weight 600
  color var(--b3-theme-error, $syp-error)
  margin-bottom 0

.syp-quick-shell__eyebrow
  font-size 12px
  letter-spacing 0.08em
  text-transform uppercase
  color var(--b3-theme-on-surface-light, $syp-text-tertiary)

.syp-quick-shell__title
  margin 0
  font-size 20px
  line-height 1.3
  color var(--b3-theme-on-background, $syp-text-primary)

.syp-quick-shell__desc
  margin 0
  font-size 13px
  color var(--b3-theme-on-surface-light, $syp-text-secondary)

.syp-platform-grid
  display grid
  grid-template-columns repeat(2, minmax(0, 1fr))
  gap 10px

// 加载提示：一行小圆点 + 文案。宽度按内容收缩（不占满区域），只提供"正在加载"这一定性信息
.syp-platform-loading
  display inline-flex
  align-items center
  gap 6px
  padding 12px
  width fit-content
  color var(--b3-theme-on-surface-light, $syp-text-secondary)

.syp-platform-loading__dot
  width 7px
  height 7px
  border-radius 999px
  background var(--b3-theme-primary, $syp-text-primary)
  animation syp-platform-loading-pulse 0.9s ease-in-out infinite alternate

@keyframes syp-platform-loading-pulse
  from
    opacity 0.35
  to
    opacity 1

.syp-empty-state
  display flex
  flex-direction column
  gap 6px
  padding 16px
  border-radius $syp-sm-card-radius
  background $syp-card-bg-gradient
  border 1px solid var(--b3-border-color, $syp-border-primary)

.syp-empty-state__title
  font-size 16px
  font-weight 600
  color var(--b3-theme-on-background, $syp-text-primary)

.syp-empty-state__desc
  font-size 13px
  color var(--b3-theme-on-surface-light, $syp-text-secondary)

.syp-manage-wrap
  position relative
  display flex
  flex-direction column

.syp-manage-panel-mask
  position absolute
  inset 0
  background rgba(48, 49, 51, 0.28)
  z-index 20
  border-radius $syp-sm-card-radius

.syp-manage-panel
  position absolute
  top 0
  right 0
  bottom 0
  width min(94%, 460px)
  z-index 30
  display flex
  flex-direction column
  background var(--b3-theme-surface, $syp-bg-primary)
  border-left 1px solid var(--b3-border-color, $syp-border-primary)
  border-radius 0 $syp-sm-card-radius $syp-sm-card-radius 0
  box-shadow -8px 0 24px rgba(0, 0, 0, 0.12)

.syp-manage-panel__head
  display flex
  align-items center
  gap 8px
  padding 10px 14px
  border-bottom 1px solid var(--b3-border-color, $syp-border-primary)

.syp-manage-panel__back
  width 26px
  height 26px
  border-radius 6px
  border 1px solid var(--b3-border-color, $syp-border-primary)
  background var(--b3-theme-surface, $syp-bg-primary)
  color var(--b3-theme-on-surface-light, $syp-text-tertiary)
  cursor pointer
  display inline-flex
  align-items center
  justify-content center

  &:hover
    color var(--b3-theme-primary, $syp-accent)
    border-color var(--b3-theme-primary, $syp-accent)

.syp-manage-panel__title
  font-weight 600
  font-size 14px
  color var(--b3-theme-on-background, $syp-text-primary)

.syp-manage-panel__body
  flex 1
  overflow-y auto
  padding 14px

.syp-manage-panel__flashhint
  font-size 12px
  color var(--b3-theme-on-surface-light, $syp-text-tertiary)
  text-align center
  padding 0 0 8px

@media (max-width: 960px)
  .syp-app
    width auto
    max-width calc(100vw - 24px)

  .syp-header-title-group
    gap 8px

  .syp-platform-grid
    grid-template-columns 1fr
</style>
