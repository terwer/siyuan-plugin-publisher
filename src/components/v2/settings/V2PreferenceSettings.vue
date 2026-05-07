<template>
  <section class="syp-settings-page">
    <div class="syp-settings-page__header">
      <div>
        <div class="syp-settings-page__eyebrow">{{ t("v2.preference.eyebrow") }}</div>
        <h2 class="syp-settings-page__title">{{ t("v2.preference.title") }}</h2>
        <p class="syp-settings-page__desc">
          {{ t("v2.preference.desc") }}
        </p>
      </div>
    </div>

    <div class="syp-settings-group-list">
      <article v-for="group in visibleGroups" :key="group.title" class="syp-settings-group">
        <div class="syp-settings-group__title">{{ group.title }}</div>
        <div class="syp-settings-group__desc">{{ group.description }}</div>

        <div class="syp-settings-form-list">
          <div v-for="item in group.items" :key="item.key" class="syp-settings-form-row">
            <div class="syp-settings-form-main">
              <div class="syp-settings-form-label">{{ item.label }}</div>
              <div class="syp-settings-form-desc">{{ item.description }}</div>
            </div>

            <div class="syp-settings-form-control">
              <span v-if="saveStateMap[item.key] === 'saved'" class="syp-settings-status-text is-saved">✓ {{ t("v2.common.saved") }}</span>
              <span v-else-if="saveStateMap[item.key] === 'failed'" class="syp-settings-status-text is-error">{{ t("v2.common.saveFailed") }}</span>
              <span v-else-if="saveStateMap[item.key] === 'saving'" class="syp-settings-status-text is-saving">{{ t("v2.common.saving") }}</span>
              <span v-else class="syp-settings-status-text">{{ getBooleanValue(item.key) ? t("v2.common.enabled") : t("v2.common.disabled") }}</span>
              <label class="syp-toggle" :title="getBooleanValue(item.key) ? t('v2.preference.toggle.disableHint') : t('v2.preference.toggle.enableHint')">
                <input
                  type="checkbox"
                  :checked="getBooleanValue(item.key)"
                  :aria-label="item.label"
                  @change="handleToggle(item.key, $event)"
                />
                <span class="syp-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </article>

    </div>
  </section>
</template>

<script setup lang="ts">
import { WarnTriangleFilled } from "@element-plus/icons-vue"
import { ElMessageBox } from "element-plus"
import { computed, markRaw, reactive } from "vue"
import { StrUtil } from "zhi-common"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"
import { getSiyuanWidgetId } from "~/src/utils/siyuanUtils.ts"

type PreferenceKey =
  | "fixTitle"
  | "keepTitle"
  | "removeFirstH1"
  | "removeMdWidgetTag"
  | "showDocQuickMenu"
  | "showQuickMenu"
  | "showSingleMenu"
  | "showBatchMenu"
  | "showAIMenu"
  | "showExtendMenu"
  | "showArticleManageMenu"
  | "ignoreBlockRef"
  | "allowChangeSlug"
  | "useV2UI"

interface PreferenceItem {
  key: PreferenceKey
  label: string
  description: string
  pluginOnly?: boolean
}

interface PreferenceGroup {
  title: string
  description: string
  items: PreferenceItem[]
}

const { t } = useV2I18n()
const { getPublishPreferenceSetting } = usePreferenceSettingStore()
const { isInSiyuanWin, isInSiyuanWidget } = useSiyuanDevice()
const preferenceForm = getPublishPreferenceSetting()

const saveStateMap = reactive<Record<PreferenceKey, "idle" | "saving" | "saved" | "failed">>({} as any)

const isSiyuanPlugin = computed(() => {
  return isInSiyuanWin() || (isInSiyuanWidget() && StrUtil.isEmptyString(getSiyuanWidgetId()))
})

const groups: PreferenceGroup[] = [
  {
    title: t("v2.preference.group.content.title"),
    description: t("v2.preference.group.content.desc"),
    items: [
      {
        key: "fixTitle",
        label: t("preference.setting.fixTitle"),
        description: t("v2.preference.item.fixTitle.desc"),
      },
      {
        key: "keepTitle",
        label: t("preference.setting.keepTitle"),
        description: t("v2.preference.item.keepTitle.desc"),
      },
      {
        key: "removeFirstH1",
        label: t("preference.setting.removeH1"),
        description: t("v2.preference.item.removeFirstH1.desc"),
      },
      {
        key: "removeMdWidgetTag",
        label: t("preference.setting.removeWidgetTag"),
        description: t("v2.preference.item.removeMdWidgetTag.desc"),
      },
      {
        key: "ignoreBlockRef",
        label: t("preference.setting.ignoreBlockRef"),
        description: t("v2.preference.item.ignoreBlockRef.desc"),
        pluginOnly: true,
      },
      {
        key: "allowChangeSlug",
        label: t("preference.setting.allowChangeSlug"),
        description: t("v2.preference.item.allowChangeSlug.desc"),
        pluginOnly: true,
      },
    ],
  },
  {
    title: t("v2.preference.group.menu.title"),
    description: t("v2.preference.group.menu.desc"),
    items: [
      {
        key: "showDocQuickMenu",
        label: t("preference.setting.showDocQuickMenu"),
        description: t("v2.preference.item.showDocQuickMenu.desc"),
        pluginOnly: true,
      },
      {
        key: "showQuickMenu",
        label: t("preference.setting.showQuickMenu"),
        description: t("v2.preference.item.showQuickMenu.desc"),
        pluginOnly: true,
      },
      {
        key: "showSingleMenu",
        label: t("preference.setting.showSingleMenu"),
        description: t("v2.preference.item.showSingleMenu.desc"),
        pluginOnly: true,
      },
      {
        key: "showBatchMenu",
        label: t("preference.setting.showBatchMenu"),
        description: t("v2.preference.item.showBatchMenu.desc"),
        pluginOnly: true,
      },
      {
        key: "showAIMenu",
        label: t("preference.setting.showAIMenu"),
        description: t("v2.preference.item.showAIMenu.desc"),
        pluginOnly: true,
      },
      {
        key: "showExtendMenu",
        label: t("preference.setting.showExtendMenu"),
        description: t("v2.preference.item.showExtendMenu.desc"),
        pluginOnly: true,
      },
      {
        key: "showArticleManageMenu",
        label: t("preference.setting.showArticleManageMenu"),
        description: t("v2.preference.item.showArticleManageMenu.desc"),
        pluginOnly: true,
      },
    ],
  },
  {
    title: t("v2.preference.group.experimental.title"),
    description: t("v2.preference.group.experimental.desc"),
    items: [
      {
        key: "useV2UI",
        label: t("v2.preference.item.useV2UI.label"),
        description: t("v2.preference.item.useV2UI.desc"),
        pluginOnly: true,
      },
    ],
  },
]

const visibleGroups = computed(() => {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.pluginOnly || isSiyuanPlugin.value),
    }))
    .filter((group) => group.items.length > 0)
})

function getBooleanValue(key: PreferenceKey) {
  return preferenceForm.value[key] === true
}

async function handleToggle(key: PreferenceKey, event: Event) {
  const target = event.target as HTMLInputElement | null
  const nextValue = target?.checked === true

  if (key === "allowChangeSlug" && nextValue && preferenceForm.value.allowChangeSlug !== true) {
    const confirmed = await confirmAllowChangeSlug()
    if (!confirmed) {
      if (target) {
        target.checked = false
      }
      return
    }
  }

  saveStateMap[key] = "saving"
  try {
    preferenceForm.value[key] = nextValue as never
    saveStateMap[key] = "saved"
    setTimeout(() => {
      if (saveStateMap[key] === "saved") {
        saveStateMap[key] = "idle"
      }
    }, 2000)
  } catch {
    saveStateMap[key] = "failed"
  }
}

async function confirmAllowChangeSlug() {
  try {
    const result = await ElMessageBox.confirm(t("preference.setting.allowChangeSlug.tips"), {
      type: "error",
      icon: markRaw(WarnTriangleFilled),
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
    } as any)

    return result === "confirm"
  } catch {
    return false
  }
}
</script>

<style scoped lang="stylus">
@import "../../../assets/v2/variables.styl"

.syp-settings-status-text.is-saved
  color $syp-badge-ready-text

.syp-settings-status-text.is-saving
  color $syp-text-tertiary

.syp-settings-status-text.is-error
  color $syp-action-danger
</style>
