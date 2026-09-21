<template>
  <section class="syp-settings-page">
    <div class="syp-settings-page__header">
      <div>
        <div class="syp-settings-page__eyebrow">{{ t("preference.eyebrow") }}</div>
        <h2 class="syp-settings-page__title">{{ t("preference.title") }}</h2>
        <p class="syp-settings-page__desc">
          {{ t("preference.desc") }}
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
                  :placeholder="t('preference.item.publishSourceNotebooks.placeholder')"
                  :aria-label="item.label"
                  @change="handleNotebooksChange"
                >
                  <el-option v-for="nb in notebookOptions" :key="nb.id" :label="nb.name" :value="nb.id" />
                </el-select>
                <span v-if="saveStateMap['publishSourceNotebooks'] === 'saved'" class="syp-settings-status-text is-saved">✓ {{ t("common.saved") }}</span>
                <span v-else-if="saveStateMap['publishSourceNotebooks'] === 'failed'" class="syp-settings-status-text is-error">{{ t("common.saveFailed") }}</span>
              </template>
              <template v-else>
                <span v-if="saveStateMap[item.key] === 'saved'" class="syp-settings-status-text is-saved">✓ {{ t("common.saved") }}</span>
                <span v-else-if="saveStateMap[item.key] === 'failed'" class="syp-settings-status-text is-error">{{ t("common.saveFailed") }}</span>
                <span v-else-if="saveStateMap[item.key] === 'saving'" class="syp-settings-status-text is-saving">{{ t("common.saving") }}</span>
                <span v-else class="syp-settings-status-text">{{ getBooleanValue(item.key) ? t("common.enabled") : t("common.disabled") }}</span>
                <SypTooltip
                  tag="label"
                  :content="getBooleanValue(item.key) ? t('preference.toggle.disableHint') : t('preference.toggle.enableHint')"
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
import { sypConfirm } from "~/src/ui/components/common/SypMessageBox.ts"
import SypTooltip from "~/src/ui/components/common/SypTooltip.vue"
import { useNotebookOptions } from "~/src/composables/useNotebookOptions.ts"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
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

const { t } = useAppI18n()
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
    title: t("preference.group.content.title"),
    description: t("preference.group.content.desc"),
    items: [
      {
        key: "fixTitle",
        label: t("preference.setting.fixTitle"),
        description: t("preference.item.fixTitle.desc"),
      },
      {
        key: "keepTitle",
        label: t("preference.setting.keepTitle"),
        description: t("preference.item.keepTitle.desc"),
      },
      {
        key: "removeFirstH1",
        label: t("preference.setting.removeH1"),
        description: t("preference.item.removeFirstH1.desc"),
      },
      {
        key: "removeMdWidgetTag",
        label: t("preference.setting.removeWidgetTag"),
        description: t("preference.item.removeMdWidgetTag.desc"),
      },
      {
        key: "ignoreBlockRef",
        label: t("preference.setting.ignoreBlockRef"),
        description: t("preference.item.ignoreBlockRef.desc"),
        pluginOnly: true,
      },
      {
        key: "allowChangeSlug",
        label: t("preference.setting.allowChangeSlug"),
        description: t("preference.item.allowChangeSlug.desc"),
        pluginOnly: true,
      },
    ],
  },
  {
    title: t("preference.group.menu.title"),
    description: t("preference.group.menu.desc"),
    items: [
      {
        key: "showDocQuickMenu",
        label: t("preference.setting.showDocQuickMenu"),
        description: t("preference.item.showDocQuickMenu.desc"),
        pluginOnly: true,
      },
      {
        key: "showQuickMenu",
        label: t("preference.setting.showQuickMenu"),
        description: t("preference.item.showQuickMenu.desc"),
        pluginOnly: true,
      },
      {
        key: "showSingleMenu",
        label: t("preference.setting.showSingleMenu"),
        description: t("preference.item.showSingleMenu.desc"),
        pluginOnly: true,
      },
      {
        key: "showBatchMenu",
        label: t("preference.setting.showBatchMenu"),
        description: t("preference.item.showBatchMenu.desc"),
        pluginOnly: true,
      },
      {
        key: "showAIMenu",
        label: t("preference.setting.showAIMenu"),
        description: t("preference.item.showAIMenu.desc"),
        pluginOnly: true,
      },
      {
        key: "showExtendMenu",
        label: t("preference.setting.showExtendMenu"),
        description: t("preference.item.showExtendMenu.desc"),
        pluginOnly: true,
      },
      {
        key: "showArticleManageMenu",
        label: t("preference.setting.showArticleManageMenu"),
        description: t("preference.item.showArticleManageMenu.desc"),
        pluginOnly: true,
      },
    ],
  },
  {
    title: t("preference.group.notebook.title"),
    description: t("preference.group.notebook.desc"),
    items: [
      {
        key: "publishSourceNotebooks",
        label: t("preference.item.publishSourceNotebooks.label"),
        description: t("preference.item.publishSourceNotebooks.desc"),
        kind: "notebooks",
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
      title: t("preference.confirm.allowChangeSlug.title"),
      message: t("preference.setting.allowChangeSlug.tips"),
      type: "warning",
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
      confirmButtonClass: "syp-message-box__confirm-danger",
    })
  } finally {
    allowChangeSlugConfirming.value = false
  }
}
</script>

<style scoped lang="stylus">
@import "../../assets/variables.styl"

.syp-settings-status-text.is-saved
  color $syp-badge-ready-text

.syp-settings-status-text.is-saving
  color $syp-text-tertiary

.syp-settings-status-text.is-error
  color $syp-action-danger
</style>
