<template>
  <section class="syp-settings-page">
    <div class="syp-settings-page__header">
      <div>
        <div class="syp-settings-page__eyebrow">{{ t("v2.picbed.eyebrow") }}</div>
        <h2 class="syp-settings-page__title">{{ t("v2.picbed.title") }}</h2>
        <p class="syp-settings-page__desc">
          {{ t("v2.picbed.desc") }}
        </p>
      </div>
    </div>

    <div v-if="state.loadErrorMessage" class="syp-settings-empty">
      <div class="syp-settings-empty__title">{{ t("v2.picbed.error.title") }}</div>
      <div class="syp-settings-empty__desc">{{ state.loadErrorMessage }}</div>
    </div>

    <div v-else class="syp-settings-group-list">
      <article class="syp-settings-group syp-picgo-uploader-card">
        <div class="syp-settings-group__title">{{ t("v2.picbed.picgoConfig.title") }}</div>
        <div class="syp-settings-group__desc">{{ t("v2.picbed.picgoConfig.desc") }}</div>

        <div v-if="state.picgoRuntimeLoading" class="syp-picgo-inline-loading">
          <div class="syp-picgo-inline-loading__title">{{ t("v2.picbed.picgoConfig.loadingTitle") }}</div>
          <div class="syp-picgo-inline-loading__desc">{{ t("v2.picbed.picgoConfig.loadingDesc") }}</div>
        </div>

        <div v-else-if="!state.picgoRuntime.ok" class="syp-picbed-runtime-error">
          <div>
            <div class="syp-picbed-runtime-error__title">{{ t("v2.picbed.picgoConfig.runtimeError") }}</div>
            <div class="syp-picbed-runtime-error__desc">{{ state.picgoRuntime.summary }}</div>
          </div>
          <button type="button" class="syp-btn" @click="showPicgoRuntimeDetails">
            {{ t("v2.quickPublish.action.viewErrorDetails") }}
          </button>
        </div>

        <template v-else>
          <div class="syp-picgo-uploader-layout">
            <aside class="syp-picgo-uploader-list" :aria-label="t('v2.picbed.picgoConfig.uploaderList')">
              <button
                v-for="uploader in sortedUploaders"
                :key="uploader.id"
                type="button"
                class="syp-picgo-uploader-item"
                :class="{ 'is-active': uploader.id === state.selectedUploaderId }"
                @click="selectUploader(uploader.id)"
              >
                <span class="syp-picgo-uploader-item__name">{{ uploader.name || uploader.id }}</span>
                <span class="syp-picgo-uploader-item__meta">
                  {{ uploader.id }} · {{ uploader.builtin ? t("v2.picbed.picgoConfig.builtin") : t("v2.picbed.picgoConfig.external") }}
                </span>
              </button>
            </aside>

            <div class="syp-picgo-uploader-form">
              <div class="syp-picgo-current">
                <span>{{ t("v2.picbed.picgoConfig.currentUploader") }}</span>
                <strong>{{ state.currentUploaderId || t("v2.common.unknownError") }}</strong>
              </div>

              <div v-if="state.schemaLoadError" class="syp-settings-status-text is-error">
                {{ state.schemaLoadError }}
              </div>

              <template v-else-if="state.selectedSchema">
                <div v-for="field in state.selectedSchema.fields" :key="field.name" class="syp-picgo-field">
                  <label class="syp-picgo-field__label" :for="`picgo-field-${field.name}`">
                    {{ field.label || field.alias || field.name }}
                    <span v-if="field.required" class="syp-picgo-field__required">*</span>
                  </label>

                  <select
                    v-if="field.type === 'list'"
                    :id="`picgo-field-${field.name}`"
                    v-model="state.uploaderForm[field.name]"
                    class="syp-input"
                  >
                    <option value="">{{ t("v2.picbed.picgoConfig.selectPlaceholder") }}</option>
                    <option v-for="choice in field.choices || []" :key="choice.value" :value="choice.value">
                      {{ choice.label }}
                    </option>
                  </select>

                  <label v-else-if="field.type === 'confirm'" class="syp-picgo-field__checkbox">
                    <input :id="`picgo-field-${field.name}`" v-model="state.uploaderForm[field.name]" type="checkbox" />
                    <span>{{ field.message || t("v2.picbed.picgoConfig.booleanEnabled") }}</span>
                  </label>

                  <input
                    v-else
                    :id="`picgo-field-${field.name}`"
                    v-model="state.uploaderForm[field.name]"
                    class="syp-input"
                    :type="field.type === 'password' || field.sensitive ? 'password' : 'text'"
                    :placeholder="field.message || field.alias || field.name"
                    autocomplete="off"
                  />

                  <div v-if="field.message && field.type !== 'confirm'" class="syp-picgo-field__help">
                    {{ field.message }}
                  </div>
                  <div v-if="fieldErrorMap[field.name]" class="syp-picgo-field__error">
                    {{ fieldErrorMap[field.name] }}
                  </div>
                </div>

                <div class="syp-picgo-actions">
                  <button type="button" class="syp-btn" @click="reloadPicgoConfig">
                    {{ t("v2.picbed.picgoConfig.reload") }}
                  </button>
                  <button type="button" class="syp-btn syp-btn-primary" :disabled="state.uploaderSaveState === 'saving'" @click="saveUploaderConfig">
                    {{ state.uploaderSaveState === "saving" ? t("v2.common.saving") : t("v2.picbed.picgoConfig.saveAndUse") }}
                  </button>
                  <span v-if="state.uploaderSaveState === 'saved'" class="syp-settings-status-text">
                    {{ t("v2.common.saved") }}
                  </span>
                  <button
                    v-else-if="state.uploaderSaveState === 'failed'"
                    type="button"
                    class="syp-btn syp-btn-link is-error"
                    @click="showUploaderSaveDetails"
                  >
                    {{ state.uploaderSaveError || t("v2.common.saveFailed") }}
                  </button>
                </div>
              </template>
            </div>
          </div>
        </template>
      </article>

      <article class="syp-settings-group syp-picbed-platform-card">
        <div class="syp-picbed-section-head">
          <div>
            <div class="syp-settings-group__title">{{ t("v2.picbed.platformPreference.title") }}</div>
            <div class="syp-settings-group__desc">{{ t("v2.picbed.platformPreference.desc") }}</div>
          </div>
          <button
            type="button"
            class="syp-btn syp-btn-secondary syp-picbed-platform-toggle"
            :disabled="state.platformPreferenceLoading"
            @click="togglePlatformPreference"
          >
            {{
              state.platformPreferenceExpanded
                ? t("v2.picbed.platformPreference.collapse")
                : t("v2.picbed.platformPreference.expand")
            }}
          </button>
        </div>

        <div v-if="!state.platformPreferenceExpanded" class="syp-picbed-collapsed-note">
          <div class="syp-picbed-collapsed-note__title">
            {{ t("v2.picbed.platformPreference.collapsedTitle") }}
          </div>
          <div class="syp-picbed-collapsed-note__desc">
            {{ t("v2.picbed.platformPreference.collapsedDesc") }}
          </div>
        </div>

        <template v-else>
          <div v-if="state.platformPreferenceLoading" class="syp-settings-empty syp-settings-empty--inline">
            <div class="syp-settings-empty__title">{{ t("v2.picbed.platformPreference.loadingTitle") }}</div>
            <div class="syp-settings-empty__desc">{{ t("v2.picbed.platformPreference.loadingDesc") }}</div>
          </div>

          <template v-else>
            <div v-if="state.platformLoadError" class="syp-picbed-runtime-error syp-picbed-platform-error">
              <div>
                <div class="syp-picbed-runtime-error__title">
                  {{ t("v2.picbed.platformPreference.partialLoadFailedTitle") }}
                </div>
                <div class="syp-picbed-runtime-error__desc">{{ state.platformLoadError }}</div>
              </div>
              <button type="button" class="syp-btn" @click="showPlatformLoadDetails">
                {{ t("v2.quickPublish.action.viewErrorDetails") }}
              </button>
            </div>

            <div v-if="state.rows.length === 0" class="syp-settings-empty syp-settings-empty--inline">
              <div class="syp-settings-empty__title">{{ t("v2.picbed.empty.title") }}</div>
              <div class="syp-settings-empty__desc">{{ t("v2.picbed.empty.desc") }}</div>
            </div>

            <div v-else class="syp-picbed-platform-groups">
              <section v-for="group in groupedRows" :key="group.title" class="syp-picbed-platform-group">
                <div class="syp-picbed-platform-group__head">
                  <div>
                    <div class="syp-picbed-platform-group__title">
                      {{ group.title }}
                      <span>{{ group.items.length }}</span>
                    </div>
                    <div class="syp-picbed-platform-group__desc">{{ group.description }}</div>
                  </div>
                </div>

                <div class="syp-picbed-platform-list">
                  <div
                    v-for="item in group.items"
                    :key="item.platformKey"
                    class="syp-picbed-platform-row"
                    :class="{ 'is-disabled': !item.isEnabled, 'is-error': item.saveState === 'failed' }"
                  >
                    <div class="syp-picbed-platform-main">
                      <div class="syp-picbed-platform-name">{{ item.platformName }}</div>
                      <div class="syp-picbed-platform-meta">
                        <span>{{ item.platformKey }}</span>
                        <span>{{ item.statusText }}</span>
                        <span>{{ item.supportText }}</span>
                      </div>
                    </div>

                    <div class="syp-picbed-control">
                      <select v-model="item.picbedService" class="syp-input syp-picbed-control__select">
                        <option v-for="option in item.options" :key="option.value" :value="option.value" :disabled="option.disabled">
                          {{ option.label }}
                        </option>
                      </select>

                      <button
                        type="button"
                        class="syp-btn syp-btn-primary syp-picbed-save-btn"
                        :disabled="item.saveState === 'saving'"
                        @click="savePicBedService(item.platformKey)"
                      >
                        <span>{{ item.saveState === "saving" ? t("v2.common.saving") : t("save") }}</span>
                      </button>

                      <span v-if="item.saveState === 'saved'" class="syp-settings-status-text">{{ t("v2.common.saved") }}</span>
                      <span v-else-if="item.saveState === 'failed'" class="syp-settings-status-text is-error">
                        {{ item.errorMessage || t("v2.common.saveFailed") }}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </template>
        </template>
      </article>
    </div>

    <SypErrorDetailsPanel
      :visible="state.errorDetails.visible"
      :title="state.errorDetails.title"
      :summary="state.errorDetails.summary"
      :details="state.errorDetails.details"
      :copy-label="t('main.copy')"
      :copy-success-text="t('main.copy.success')"
      :copy-failure-text="t('main.copy.failure')"
      :close-label="t('main.opt.ok')"
      @close="state.errorDetails.visible = false"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue"
import {
  type ISiyuanPicGoHeadlessManager,
  type PicGoUploaderConfigSchema,
  type PicGoUploaderListItem,
  type PicGoValidationFieldError,
} from "zhi-siyuan-picgo"
import { JsonUtil } from "zhi-common"
import { BlogConfig, PicbedServiceTypeEnum as PicBedServiceTypeEnum } from "zhi-blog-api"
import Adaptors from "~/src/adaptors"
import SypErrorDetailsPanel from "~/src/components/v2/common/SypErrorDetailsPanel.vue"
import {
  checkPublisherPicgoRuntime,
  formatPublisherPicgoError,
} from "~/src/composables/usePublisherPicgoManager.ts"
import { usePicgoBridge } from "~/src/composables/usePicgoBridge.ts"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"
import { DynamicConfig, DynamicJsonCfg, PlatformType } from "~/src/platforms/dynamicConfig.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { sanitizeSensitiveForLog } from "~/src/utils/sensitiveLogSanitizer.ts"

interface PicBedOption {
  value: PicBedServiceTypeEnum
  label: string
  disabled?: boolean
}

interface PicBedRow {
  platformKey: string
  platformName: string
  isEnabled: boolean
  statusText: string
  supportText: string
  picbedService: PicBedServiceTypeEnum
  options: PicBedOption[]
  saveState: "idle" | "saving" | "saved" | "failed"
  errorMessage: string
}

interface PicgoRuntimeState {
  ok: boolean
  summary: string
  details: string
  fieldErrors: PicGoValidationFieldError[]
}

const { getSetting, updateSetting } = usePublishSettingStore()
const { getPicbedServiceType: getPicBedServiceType } = usePicgoBridge()
const { t } = useV2I18n()

let picgoManager: ISiyuanPicGoHeadlessManager | null = null

const state = reactive({
  loadErrorMessage: "",
  picgoRuntimeLoading: true,
  rows: [] as PicBedRow[],
  picgoRuntime: {
    ok: false,
    summary: "",
    details: "",
    fieldErrors: [] as PicGoValidationFieldError[],
  } as PicgoRuntimeState,
  uploaders: [] as PicGoUploaderListItem[],
  currentUploaderId: "",
  selectedUploaderId: "",
  selectedSchema: null as PicGoUploaderConfigSchema | null,
  uploaderForm: {} as Record<string, any>,
  validationErrors: [] as PicGoValidationFieldError[],
  schemaLoadError: "",
  platformPreferenceExpanded: false,
  platformPreferenceLoading: false,
  platformPreferenceLoaded: false,
  platformLoadError: "",
  platformLoadDetails: "",
  uploaderSaveState: "idle" as "idle" | "saving" | "saved" | "failed",
  uploaderSaveError: "",
  uploaderSaveDetails: "",
  errorDetails: {
    visible: false,
    title: "",
    summary: "",
    details: "",
  },
})

const sortedUploaders = computed(() => {
  return [...state.uploaders].sort((left, right) => {
    if (left.builtin !== right.builtin) {
      return left.builtin ? -1 : 1
    }
    return (left.name || left.id).localeCompare(right.name || right.id)
  })
})

const fieldErrorMap = computed(() => {
  return state.validationErrors.reduce<Record<string, string>>((acc, error) => {
    if (error.field) {
      acc[error.field] = error.message
    }
    return acc
  }, {})
})

const groupedRows = computed(() => {
  return [
    {
      title: t("v2.picbed.group.enabled.title"),
      description: t("v2.picbed.group.enabled.desc"),
      items: state.rows.filter((item) => item.isEnabled),
    },
    {
      title: t("v2.picbed.group.disabled.title"),
      description: t("v2.picbed.group.disabled.desc"),
      items: state.rows.filter((item) => !item.isEnabled),
    },
  ].filter((group) => group.items.length > 0)
})

onMounted(async () => {
  void loadAll()
})

async function loadAll() {
  state.loadErrorMessage = ""
  await loadPicgoRuntime()
}

async function loadRows() {
  state.platformPreferenceLoading = true
  state.platformLoadError = ""
  state.platformLoadDetails = ""

  try {
    const setting = await getSetting()
    const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
    const dynamicConfigArray = (dynJsonCfg?.totalCfg || []).filter((item) => item.platformType !== PlatformType.System)
    const settledRows = await Promise.allSettled(dynamicConfigArray.map((item) => buildRow(item, setting)))
    const failedRows: Array<{ item: DynamicConfig; reason: unknown }> = []

    state.rows = settledRows.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value
      }

      const item = dynamicConfigArray[index]
      failedRows.push({ item, reason: result.reason })
      return buildFailedRow(item, result.reason)
    })

    if (failedRows.length > 0) {
      state.platformLoadError = t("v2.picbed.platformPreference.partialLoadFailed", { count: failedRows.length })
      state.platformLoadDetails = stringifyDetails(
        failedRows.map(({ item, reason }) => ({
          platformKey: item.platformKey,
          platformName: item.platformName,
          error: formatErrorMessage(reason),
        }))
      )
    }
  } catch (error) {
    state.rows = []
    state.platformLoadError = formatErrorMessage(error)
    state.platformLoadDetails = stringifyDetails(error)
  } finally {
    state.platformPreferenceLoaded = true
    state.platformPreferenceLoading = false
  }
}

async function togglePlatformPreference() {
  state.platformPreferenceExpanded = !state.platformPreferenceExpanded
  if (state.platformPreferenceExpanded && !state.platformPreferenceLoaded) {
    await loadRows()
  }
}

async function loadPicgoRuntime() {
  state.picgoRuntimeLoading = true
  try {
    const runtime = await checkPublisherPicgoRuntime()
    picgoManager = runtime.manager ?? null
    state.picgoRuntime = {
      ok: runtime.ok,
      summary: runtime.summary,
      details: runtime.details,
      fieldErrors: runtime.fieldErrors,
    }

    if (!runtime.ok || !picgoManager) {
      resetPicgoFormState()
      return
    }

    state.uploaders = picgoManager.listUploaders().filter((uploader) => uploader.schemaAvailable)
    state.currentUploaderId = await picgoManager.getCurrentUploader()
    const selectedUploaderId = state.uploaders.some((uploader) => uploader.id === state.currentUploaderId)
      ? state.currentUploaderId
      : state.uploaders[0]?.id || ""

    if (selectedUploaderId) {
      loadUploaderForm(selectedUploaderId)
    }
  } catch (error) {
    const formatted = formatPublisherPicgoError(error)
    picgoManager = null
    state.picgoRuntime = {
      ok: false,
      summary: formatted.summary,
      details: formatted.details,
      fieldErrors: formatted.fieldErrors,
    }
    resetPicgoFormState()
  } finally {
    state.picgoRuntimeLoading = false
  }
}

async function reloadPicgoConfig() {
  state.uploaderSaveState = "idle"
  await loadPicgoRuntime()
}

function loadUploaderForm(uploaderId: string) {
  state.selectedUploaderId = uploaderId
  state.selectedSchema = null
  state.uploaderForm = {}
  state.validationErrors = []
  state.schemaLoadError = ""
  state.uploaderSaveState = "idle"
  state.uploaderSaveError = ""
  state.uploaderSaveDetails = ""

  if (!picgoManager || !uploaderId) {
    return
  }

  try {
    const schema = picgoManager.getUploaderSchema(uploaderId)
    const savedConfig = picgoManager.getUploaderConfig(uploaderId)
    const form = { ...savedConfig } as Record<string, any>
    schema.fields.forEach((field) => {
      if (typeof form[field.name] === "undefined" && typeof field.default !== "undefined") {
        form[field.name] = field.default
      }
      if (field.type === "confirm" && typeof form[field.name] === "undefined") {
        form[field.name] = false
      }
    })

    state.selectedSchema = schema
    state.uploaderForm = form
  } catch (error) {
    const formatted = formatPublisherPicgoError(error)
    state.schemaLoadError = formatted.summary
    state.uploaderSaveDetails = formatted.details
  }
}

function selectUploader(uploaderId: string) {
  loadUploaderForm(uploaderId)
}

async function saveUploaderConfig() {
  if (!picgoManager || !state.selectedUploaderId) {
    return
  }

  state.uploaderSaveState = "saving"
  state.uploaderSaveError = ""
  state.uploaderSaveDetails = ""
  state.validationErrors = []

  try {
    const validation = await picgoManager.saveUploaderConfig(state.selectedUploaderId, state.uploaderForm, { setCurrent: true })
    if (!validation.ok) {
      state.validationErrors = validation.errors
      state.uploaderSaveState = "failed"
      state.uploaderSaveError = validation.errors[0]?.message || t("v2.picbed.picgoConfig.validationFailed")
      state.uploaderSaveDetails = stringifyDetails({ uploaderId: validation.uploaderId, errors: validation.errors })
      return
    }

    state.currentUploaderId = await picgoManager.getCurrentUploader()
    state.uploaderSaveState = "saved"
  } catch (error) {
    const formatted = formatPublisherPicgoError(error)
    state.validationErrors = formatted.fieldErrors
    state.uploaderSaveState = "failed"
    state.uploaderSaveError = formatted.summary
    state.uploaderSaveDetails = formatted.details
  }
}

async function buildRow(item: DynamicConfig, setting: Record<string, any>) {
  const storedCfg = JsonUtil.safeParse<Record<string, any>>(setting[item.platformKey], {} as Record<string, any>)
  const cfg = (await Adaptors.getCfg(item.platformKey, storedCfg)) as BlogConfig
  const resolvedService = (await getPicBedServiceType(cfg)) as PicBedServiceTypeEnum
  const picgoSupported = cfg.picgoPicbedSupported === true
  const bundledSupported = cfg.bundledPicbedSupported === true

  const options: PicBedOption[] = [
    { value: PicBedServiceTypeEnum.None, label: t("publisher.picbed.none") },
    {
      value: PicBedServiceTypeEnum.PicGo,
      label: t("publisher.picbed.picgo"),
      disabled: !picgoSupported || !state.picgoRuntime.ok,
    },
    {
      value: PicBedServiceTypeEnum.Bundled,
      label: t("v2.picbed.option.bundled"),
      disabled: !bundledSupported,
    },
  ].filter((option) => {
    if (option.value === PicBedServiceTypeEnum.PicGo) {
      return picgoSupported
    }
    if (option.value === PicBedServiceTypeEnum.Bundled) {
      return bundledSupported
    }
    return true
  })

  return {
    platformKey: item.platformKey,
    platformName: item.platformName,
    isEnabled: item.isEnabled === true,
    statusText: item.isEnabled ? t("v2.account.toggle.enabled") : t("v2.account.toggle.disabled"),
    supportText: buildSupportText(picgoSupported, bundledSupported),
    picbedService: (cfg.picbedService as PicBedServiceTypeEnum) || resolvedService || PicBedServiceTypeEnum.None,
    options,
    saveState: "idle" as const,
    errorMessage: "",
  }
}

function buildFailedRow(item: DynamicConfig, error: unknown): PicBedRow {
  const message = formatErrorMessage(error)
  return {
    platformKey: item.platformKey,
    platformName: item.platformName || item.platformKey,
    isEnabled: item.isEnabled === true,
    statusText: item.isEnabled ? t("v2.account.toggle.enabled") : t("v2.account.toggle.disabled"),
    supportText: `${t("v2.picbed.platformPreference.rowLoadFailed")}: ${message}`,
    picbedService: PicBedServiceTypeEnum.None,
    options: [{ value: PicBedServiceTypeEnum.None, label: t("publisher.picbed.none") }],
    saveState: "failed",
    errorMessage: message,
  }
}

async function savePicBedService(platformKey: string) {
  const target = state.rows.find((item) => item.platformKey === platformKey)
  if (!target) {
    return
  }

  target.saveState = "saving"
  target.errorMessage = ""

  try {
    const setting = await getSetting()
    const storedCfg = JsonUtil.safeParse<Record<string, any>>(setting[platformKey], {} as Record<string, any>)
    const cfg = (await Adaptors.getCfg(platformKey, storedCfg)) as BlogConfig
    cfg.picbedService = target.picbedService
    setting[platformKey] = cfg
    await updateSetting(setting)
    target.saveState = "saved"
  } catch (error) {
    target.saveState = "failed"
    target.errorMessage = error instanceof Error ? error.message : String(error ?? t("v2.common.unknownError"))
  }
}

function buildSupportText(picgoSupported: boolean, bundledSupported: boolean) {
  const supported: string[] = []
  if (picgoSupported) {
    supported.push(t("publisher.picbed.picgo"))
  }
  if (bundledSupported) {
    supported.push(t("v2.picbed.option.bundled"))
  }

  if (supported.length === 0) {
    return t("v2.picbed.support.none")
  }

  return t("v2.picbed.support.some", { services: supported.join(" / ") })
}

function showPicgoRuntimeDetails() {
  showErrorDetails(
    t("v2.picbed.picgoConfig.runtimeError"),
    state.picgoRuntime.summary,
    state.picgoRuntime.details || stringifyDetails({ errors: state.picgoRuntime.fieldErrors })
  )
}

function showUploaderSaveDetails() {
  showErrorDetails(
    t("v2.picbed.picgoConfig.validationFailed"),
    state.uploaderSaveError,
    state.uploaderSaveDetails || stringifyDetails({ errors: state.validationErrors })
  )
}

function showPlatformLoadDetails() {
  showErrorDetails(
    t("v2.picbed.platformPreference.partialLoadFailedTitle"),
    state.platformLoadError,
    state.platformLoadDetails
  )
}

function showErrorDetails(title: string, summary: string, details: string) {
  state.errorDetails = {
    visible: true,
    title,
    summary,
    details,
  }
}

function resetPicgoFormState() {
  state.uploaders = []
  state.currentUploaderId = ""
  state.selectedUploaderId = ""
  state.selectedSchema = null
  state.uploaderForm = {}
  state.validationErrors = []
  state.schemaLoadError = ""
  state.uploaderSaveState = "idle"
  state.uploaderSaveError = ""
  state.uploaderSaveDetails = ""
}

function formatErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error ?? t("v2.common.unknownError"))
}

function stringifyDetails(input: unknown) {
  const sanitized = sanitizeSensitiveForLog(input)
  if (typeof sanitized === "string") {
    return sanitized
  }
  return JSON.stringify(sanitized, null, 2)
}
</script>

<style scoped lang="stylus">
.syp-settings-page
  position relative
  color #1f2329

:deep(.syp-settings-page__title)
  color #1f2329

:deep(.syp-settings-page__desc),
:deep(.syp-settings-group__desc)
  color #697386

:deep(.syp-settings-group__title)
  color #1f2329
  font-weight 700
  font-size 15px

.syp-settings-empty--inline
  padding 12px 0
  border none
  background transparent

.syp-picbed-control
  display flex
  align-items center
  justify-content flex-end
  gap 8px
  flex 0 0 440px
  min-width 440px

.syp-picbed-control__select
  flex 1 1 auto
  min-width 0

.syp-picbed-save-btn
  flex 0 0 42px
  width 42px
  min-width 42px
  white-space nowrap

  span
    display inline-block
    white-space nowrap

.syp-picgo-uploader-card,
.syp-picbed-platform-card
  border-color #edf1f7
  background linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)
  box-shadow 0 8px 24px rgba(18, 38, 63, 0.04)

.syp-picbed-section-head
  display flex
  align-items flex-start
  justify-content space-between
  gap 16px

.syp-picbed-platform-toggle
  flex-shrink 0
  height 28px
  border-radius 8px
  background #f5f9ff
  color #2563eb
  border 1px solid #d8e7ff

  &:hover
    background #eef6ff
    color #1d4ed8

.syp-picgo-uploader-layout
  display grid
  grid-template-columns minmax(150px, 190px) minmax(0, 1fr)
  gap 16px
  align-items start

.syp-picgo-uploader-list
  display flex
  flex-direction column
  gap 8px
  max-height 460px
  overflow auto

.syp-picgo-uploader-item
  width 100%
  padding 9px 11px
  display flex
  flex-direction column
  gap 4px
  text-align left
  border-radius 9px
  border 1px solid #e8edf5
  background #ffffff
  color #344054
  cursor pointer
  transition all 0.18s ease

  &:hover
    border-color #cfe1ff
    background #f7fbff

  &.is-active
    border-color #7bb0ff
    background linear-gradient(180deg, #f5f9ff 0%, #eef6ff 100%)
    color #1d4ed8
    box-shadow 0 4px 12px rgba(22, 119, 255, 0.12)

    .syp-picgo-uploader-item__name
      color #1d4ed8

    .syp-picgo-uploader-item__meta
      color #4f7fcf

.syp-picgo-uploader-item__name
  font-weight 700
  font-size 13px
  color #1f2937

.syp-picgo-uploader-item__meta
  color #8a94a6
  font-size 12px

.syp-picgo-uploader-form
  display flex
  flex-direction column
  gap 12px

.syp-picgo-current
  display flex
  align-items center
  justify-content space-between
  gap 10px
  padding 9px 12px
  border-radius 10px
  background #f7fbff
  color #667085
  border 1px solid #e6f0ff

  strong
    color #2563eb

.syp-picgo-field
  display flex
  flex-direction column
  gap 6px

.syp-picgo-field__label
  font-size 13px
  font-weight 700
  color #344054

.syp-picgo-field__required,
.syp-picgo-field__error,
.syp-btn-link.is-error
  color #b42318

.syp-picgo-field__help
  font-size 12px
  color #8a94a6

.syp-picgo-field__error
  font-size 12px

.syp-picgo-field__checkbox
  display flex
  align-items center
  gap 8px
  color #344054

.syp-picgo-actions
  display flex
  align-items center
  gap 10px
  flex-wrap wrap

.syp-btn-link
  padding 0
  border none
  background transparent
  cursor pointer

.syp-picbed-runtime-error
  display flex
  align-items center
  justify-content space-between
  gap 14px
  padding 12px 14px
  border-radius 10px
  border 1px solid rgba(180, 35, 24, 0.25)
  background rgba(254, 243, 242, 0.85)

.syp-picbed-runtime-error__title
  font-weight 700
  color #b42318

.syp-picbed-runtime-error__desc
  margin-top 4px
  font-size 13px
  color #475467

.syp-settings-status-text.is-error
  color #b42318

.syp-picgo-inline-loading
  margin-top 14px
  padding 14px
  border-radius 10px
  border 1px solid #d8e7ff
  background linear-gradient(180deg, #fbfdff 0%, #f5f9ff 100%)

.syp-picgo-inline-loading__title
  font-size 13px
  font-weight 700
  color #2563eb

.syp-picgo-inline-loading__desc
  margin-top 4px
  font-size 13px
  color #667085

.syp-picbed-collapsed-note
  margin-top 14px
  padding 12px 14px
  border-radius 10px
  border 1px dashed #d8e7ff
  background #f8fbff

.syp-picbed-collapsed-note__title
  font-size 13px
  font-weight 700
  color #344054

.syp-picbed-collapsed-note__desc
  margin-top 4px
  font-size 13px
  color #667085

.syp-picbed-platform-error
  margin-top 14px

.syp-picbed-platform-groups
  display flex
  flex-direction column
  gap 12px
  margin-top 14px

.syp-picbed-platform-group
  border 1px solid #eef2f7
  border-radius 10px
  background #ffffff
  overflow hidden

.syp-picbed-platform-group__head
  padding 10px 12px
  border-bottom 1px solid #eef2f7
  background #fbfdff

.syp-picbed-platform-group__title
  display flex
  align-items center
  gap 8px
  font-size 13px
  font-weight 700
  color #344054

  span
    display inline-flex
    align-items center
    justify-content center
    min-width 20px
    height 18px
    padding 0 6px
    border-radius 999px
    background #eef6ff
    color #2563eb
    font-size 11px

.syp-picbed-platform-group__desc
  margin-top 4px
  font-size 12px
  color #8a94a6

.syp-picbed-platform-list
  display flex
  flex-direction column

.syp-picbed-platform-row
  display grid
  grid-template-columns minmax(0, 1fr) 440px
  align-items center
  gap 12px
  padding 11px 12px
  border-bottom 1px solid #f1f4f8

  &:last-child
    border-bottom none

  &.is-disabled
    background #fbfbfc

.syp-picbed-platform-main
  min-width 0
  flex 1

.syp-picbed-platform-name
  font-size 13px
  font-weight 700
  color #344054

.syp-picbed-platform-meta
  display flex
  align-items center
  flex-wrap wrap
  gap 6px
  margin-top 5px
  font-size 12px
  color #8a94a6

  span
    display inline-flex
    align-items center

    &:not(:last-child)::after
      content "·"
      margin-left 6px
      color #c4cad4

@media (max-width: 960px)
  .syp-picgo-uploader-layout
    grid-template-columns 1fr

  .syp-picbed-control
    min-width 0
    flex 0 1 auto
    width 100%
    flex-direction column
    align-items stretch

  .syp-picbed-control__select
    width 100%
    min-width 0

  .syp-picbed-section-head,
  .syp-picbed-platform-row
    align-items stretch

  .syp-picbed-platform-row
    grid-template-columns 1fr
</style>
