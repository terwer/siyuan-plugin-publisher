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

            <div class="syp-settings-form-control" :class="{ 'is-notebooks': item.kind === 'notebooks' }">
              <template v-if="item.kind === 'notebooks'">
                <el-select
                  v-model="preferenceForm.publishSourceNotebooks"
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  clearable
                  class="syp-settings-notebooks-select"
                  :placeholder="t('v2.preference.item.publishSourceNotebooks.placeholder')"
                  :aria-label="item.label"
                  @change="handleNotebooksChange"
                >
                  <el-option v-for="nb in notebookOptions" :key="nb.id" :label="nb.name" :value="nb.id" />
                </el-select>
                <span v-if="saveStateMap['publishSourceNotebooks'] === 'saved'" class="syp-settings-status-text is-saved">✓ {{ t("v2.common.saved") }}</span>
                <span v-else-if="saveStateMap['publishSourceNotebooks'] === 'failed'" class="syp-settings-status-text is-error">{{ t("v2.common.saveFailed") }}</span>
                <span v-else class="syp-settings-status-text">{{ getNotebooksText() }}</span>
              </template>
              <template v-else>
                <span v-if="saveStateMap[item.key] === 'saved'" class="syp-settings-status-text is-saved">✓ {{ t("v2.common.saved") }}</span>
                <span v-else-if="saveStateMap[item.key] === 'failed'" class="syp-settings-status-text is-error">{{ t("v2.common.saveFailed") }}</span>
                <span v-else-if="saveStateMap[item.key] === 'saving'" class="syp-settings-status-text is-saving">{{ t("v2.common.saving") }}</span>
                <span v-else class="syp-settings-status-text">{{ getBooleanValue(item.key) ? t("v2.common.enabled") : t("v2.common.disabled") }}</span>
                <SypTooltip
                  tag="label"
                  :content="getBooleanValue(item.key) ? t('v2.preference.toggle.disableHint') : t('v2.preference.toggle.enableHint')"
                  inline-flex
                  trigger-class="syp-toggle"
                >
                  <input
                    type="checkbox"
                    :checked="getBooleanValue(item.key)"
                    :aria-label="item.label"
                    @change="handleToggle(item.key, $event)"
                  />
                  <span class="syp-toggle-slider"></span>
                </SypTooltip>
              </template>
            </div>
          </div>
        </div>
      </article>

    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue"
import { StrUtil } from "zhi-common"
import { sypConfirm } from "~/src/components/v2/common/SypMessageBox.ts"
import SypTooltip from "~/src/components/v2/common/SypTooltip.vue"
import { useNotebookOptions } from "~/src/composables/useNotebookOptions.ts"
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
  | "publishSourceNotebooks"

interface PreferenceItem {
  key: PreferenceKey
  label: string
  description: string
  pluginOnly?: boolean
  kind?: "toggle" | "notebooks"
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
const allowChangeSlugConfirming = ref(false)
const { options: notebookOptions, load: loadNotebookOptions } = useNotebookOptions()

onMounted(() => {
  void loadNotebookOptions()
})

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
    title: t("v2.preference.group.notebook.title"),
    description: t("v2.preference.group.notebook.desc"),
    items: [
      {
        key: "publishSourceNotebooks",
        label: t("v2.preference.item.publishSourceNotebooks.label"),
        description: t("v2.preference.item.publishSourceNotebooks.desc"),
        kind: "notebooks",
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

function getNotebooksText() {
  const ids = preferenceForm.value.publishSourceNotebooks ?? []
  if (ids.length === 0) {
    return t("v2.preference.item.publishSourceNotebooks.unrestricted")
  }
  return notebookOptions.value
    .filter((nb) => ids.includes(nb.id))
    .map((nb) => nb.name)
    .join(", ")
}

async function handleNotebooksChange(ids: string[]) {
  saveStateMap["publishSourceNotebooks"] = "saving"
  try {
    preferenceForm.value.publishSourceNotebooks = Array.isArray(ids) ? [...ids] : []
    saveStateMap["publishSourceNotebooks"] = "saved"
    setTimeout(() => {
      if (saveStateMap["publishSourceNotebooks"] === "saved") {
        saveStateMap["publishSourceNotebooks"] = "idle"
      }
    }, 2000)
  } catch {
    saveStateMap["publishSourceNotebooks"] = "failed"
  }
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
  if (allowChangeSlugConfirming.value) {
    return false
  }

  allowChangeSlugConfirming.value = true
  try {
    return await sypConfirm({
      title: t("v2.preference.confirm.allowChangeSlug.title"),
      message: t("preference.setting.allowChangeSlug.tips"),
      type: "warning",
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
      confirmButtonClass: "syp-v2-message-box__confirm-danger",
    })
  } finally {
    allowChangeSlugConfirming.value = false
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
