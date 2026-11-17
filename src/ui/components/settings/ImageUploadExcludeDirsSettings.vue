<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue"
import { ElMessage } from "element-plus"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { useNotebookOptions } from "~/src/composables/useNotebookOptions.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import {
  normalizeImageUploadRulePath,
  type ImageUploadExcludeDirRule,
} from "~/src/utils/imageUploadPolicy.ts"

interface DirectoryOption {
  id: string
  path: string
  hpath: string
  title: string
}

const WHOLE_NOTEBOOK = "__whole_notebook__"

const logger = createAppLogger("image-upload-exclude-dirs")
const { t } = useAppI18n()
const { kernelApi } = useSiyuanApi()
const { getPublishPreferenceSetting } = usePreferenceSettingStore()
const { options: notebookOptions, load: loadNotebooks } = useNotebookOptions()
const preferenceForm = getPublishPreferenceSetting()

const state = reactive({
  notebookId: "",
  docPath: WHOLE_NOTEBOOK,
  docs: [] as DirectoryOption[],
  docsLoading: false,
  loadError: "",
})

const rules = computed<ImageUploadExcludeDirRule[]>(() => {
  const value = preferenceForm.value.imageUploadExcludeDirs
  return Array.isArray(value) ? value : []
})

const selectedNotebook = computed(() => notebookOptions.value.find((item) => item.id === state.notebookId))

const notebookName = (rule: ImageUploadExcludeDirRule): string => {
  return notebookOptions.value.find((item) => item.id === rule.notebookId)?.name || rule.notebookName || rule.notebookId
}

const ruleLabel = (rule: ImageUploadExcludeDirRule): string => {
  if (!rule.path) {
    return t("picbed.excludeDirs.wholeNotebook")
  }
  return rule.hpath || rule.path
}

const canAdd = computed(() => Boolean(state.notebookId) && !state.docsLoading)

const persistRules = (nextRules: ImageUploadExcludeDirRule[]) => {
  preferenceForm.value.imageUploadExcludeDirs = nextRules
}

const safeNotebookId = (id: string): string => {
  return /^[A-Za-z0-9_-]+$/.test(id) ? id : ""
}

const loadDirectories = async () => {
  state.docPath = WHOLE_NOTEBOOK
  state.docs = []
  state.loadError = ""
  const notebookId = safeNotebookId(state.notebookId)
  if (!notebookId) {
    return
  }

  state.docsLoading = true
  try {
    const rows = (await kernelApi.sql(
      `select id, content, hpath, path from blocks where type = 'd' and box = '${notebookId}' order by hpath asc`
    )) as any[]
    state.docs = (Array.isArray(rows) ? rows : [])
      .map((row) => {
        const path = String(row?.path ?? "")
        const hpath = String(row?.hpath ?? "")
        const title = String(row?.content ?? "") || hpath || path
        return {
          id: String(row?.id ?? ""),
          path,
          hpath,
          title,
        }
      })
      .filter((item) => item.path)
  } catch (e: any) {
    state.loadError = t("picbed.excludeDirs.loadFailed", { message: e?.message || String(e) })
    logger.error("load directories failed", e)
  } finally {
    state.docsLoading = false
  }
}

const addRule = () => {
  if (!state.notebookId) {
    ElMessage.warning(t("picbed.excludeDirs.noNotebook"))
    return
  }

  const wholeNotebook = state.docPath === WHOLE_NOTEBOOK
  const doc = wholeNotebook ? undefined : state.docs.find((item) => item.path === state.docPath)
  const path = wholeNotebook ? "" : normalizeImageUploadRulePath(doc?.path ?? state.docPath)
  const nextRule: ImageUploadExcludeDirRule = {
    notebookId: state.notebookId,
    path,
    notebookName: selectedNotebook.value?.name || state.notebookId,
    hpath: path ? doc?.hpath || "" : "",
  }

  const exists = rules.value.some((item) => item.notebookId === nextRule.notebookId && item.path === nextRule.path)
  if (exists) {
    ElMessage.info(t("picbed.excludeDirs.duplicate"))
    return
  }

  persistRules([...rules.value, nextRule])
  state.docPath = WHOLE_NOTEBOOK
  ElMessage.success(t("picbed.excludeDirs.added"))
}

const removeRule = (rule: ImageUploadExcludeDirRule) => {
  persistRules(rules.value.filter((item) => !(item.notebookId === rule.notebookId && item.path === rule.path)))
  ElMessage.success(t("picbed.excludeDirs.removed"))
}

onMounted(async () => {
  await loadNotebooks()
  if (!state.notebookId && notebookOptions.value.length > 0) {
    state.notebookId = notebookOptions.value[0].id
    await loadDirectories()
  }
})
</script>

<template>
  <article class="syp-settings-group syp-image-exclude-dirs">
    <div class="syp-settings-group__title">{{ t("picbed.excludeDirs.title") }}</div>
    <div class="syp-settings-group__desc">{{ t("picbed.excludeDirs.desc") }}</div>

    <div class="syp-image-exclude-dirs__form">
      <div class="syp-image-exclude-dirs__field">
        <label class="syp-image-exclude-dirs__label" for="syp-image-exclude-notebook">
          {{ t("picbed.excludeDirs.notebook") }}
        </label>
        <el-select
          id="syp-image-exclude-notebook"
          v-model="state.notebookId"
          class="syp-image-exclude-dirs__select"
          :placeholder="t('picbed.excludeDirs.notebookPlaceholder')"
          filterable
          @change="loadDirectories"
        >
          <el-option v-for="item in notebookOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>

      <div class="syp-image-exclude-dirs__field">
        <label class="syp-image-exclude-dirs__label" for="syp-image-exclude-directory">
          {{ t("picbed.excludeDirs.directory") }}
        </label>
        <el-select
          id="syp-image-exclude-directory"
          v-model="state.docPath"
          class="syp-image-exclude-dirs__select"
          :placeholder="t('picbed.excludeDirs.directoryPlaceholder')"
          :loading="state.docsLoading"
          filterable
        >
          <el-option :label="t('picbed.excludeDirs.wholeNotebook')" :value="WHOLE_NOTEBOOK" />
          <el-option
            v-for="item in state.docs"
            :key="item.path"
            :label="item.hpath || item.title"
            :value="item.path"
          />
        </el-select>
      </div>

      <button type="button" class="syp-btn syp-btn-primary" :disabled="!canAdd" @click="addRule">
        {{ t("picbed.excludeDirs.add") }}
      </button>
    </div>

    <div v-if="state.loadError" class="syp-settings-status-text is-error">{{ state.loadError }}</div>

    <div v-if="state.docsLoading" class="syp-image-exclude-dirs__loading">
      {{ t("picbed.excludeDirs.loading") }}
    </div>

    <div v-if="rules.length === 0" class="syp-image-exclude-dirs__empty">
      {{ t("picbed.excludeDirs.empty") }}
    </div>
    <ul v-else class="syp-image-exclude-dirs__list">
      <li v-for="rule in rules" :key="`${rule.notebookId}:${rule.path}`" class="syp-image-exclude-dirs__item">
        <span class="syp-image-exclude-dirs__notebook">{{ notebookName(rule) }}</span>
        <span class="syp-image-exclude-dirs__path">{{ ruleLabel(rule) }}</span>
        <button type="button" class="syp-btn syp-btn-link is-error" @click="removeRule(rule)">
          {{ t("picbed.excludeDirs.remove") }}
        </button>
      </li>
    </ul>
  </article>
</template>

<style scoped lang="stylus">
@import "../../assets/variables.styl"

.syp-image-exclude-dirs__form
  display flex
  flex-wrap wrap
  align-items flex-end
  gap 10px
  margin-top 12px

.syp-image-exclude-dirs__field
  display flex
  flex-direction column
  gap 4px
  min-width 200px

.syp-image-exclude-dirs__label
  font-size 12px
  color $syp-text-secondary

.syp-image-exclude-dirs__select
  min-width 220px

.syp-image-exclude-dirs__loading,
.syp-image-exclude-dirs__empty
  margin-top 10px
  font-size 13px
  color $syp-text-secondary

.syp-image-exclude-dirs__list
  margin 12px 0 0
  padding 0
  list-style none

.syp-image-exclude-dirs__item
  display flex
  align-items center
  gap 8px
  padding 8px 10px
  border-radius 6px
  background $syp-bg-tertiary
  margin-bottom 6px
  font-size 13px

.syp-image-exclude-dirs__notebook
  font-weight 600
  color $syp-text-primary

.syp-image-exclude-dirs__path
  flex 1
  min-width 0
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
  color $syp-text-secondary
</style>
