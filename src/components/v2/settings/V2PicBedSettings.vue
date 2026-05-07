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

    <div v-if="state.isLoading" class="syp-settings-empty">
      <div class="syp-settings-empty__title">{{ t("v2.picbed.loading.title") }}</div>
      <div class="syp-settings-empty__desc">{{ t("v2.picbed.loading.desc") }}</div>
    </div>

    <div v-else-if="state.loadErrorMessage" class="syp-settings-empty">
      <div class="syp-settings-empty__title">{{ t("v2.picbed.error.title") }}</div>
      <div class="syp-settings-empty__desc">{{ state.loadErrorMessage }}</div>
    </div>

    <div v-else-if="state.rows.length === 0" class="syp-settings-empty">
      <div class="syp-settings-empty__title">{{ t("v2.picbed.empty.title") }}</div>
      <div class="syp-settings-empty__desc">{{ t("v2.picbed.empty.desc") }}</div>
    </div>

    <div v-else class="syp-settings-group-list">
      <article v-for="group in groupedRows" :key="group.title" class="syp-settings-group">
        <div class="syp-settings-group__title">{{ group.title }}</div>
        <div class="syp-settings-group__desc">{{ group.description }}</div>

        <div class="syp-settings-form-list">
          <div v-for="item in group.items" :key="item.platformKey" class="syp-settings-form-row">
            <div class="syp-settings-form-main">
              <div class="syp-settings-form-label">{{ item.platformName }}</div>
              <div class="syp-settings-form-desc">
                {{ item.platformKey }} · {{ item.statusText }} · {{ item.supportText }}
              </div>
            </div>

            <div class="syp-settings-form-control syp-picbed-control">
              <select v-model="item.picbedService" class="syp-input syp-picbed-control__select">
                <option v-for="option in item.options" :key="option.value" :value="option.value" :disabled="option.disabled">
                  {{ option.label }}
                </option>
              </select>

              <button type="button" class="syp-btn syp-btn-primary" :disabled="item.saveState === 'saving'" @click="savePicBedService(item.platformKey)">
                {{ item.saveState === "saving" ? t("v2.common.saving") : t("save") }}
              </button>

              <span v-if="item.saveState === 'saved'" class="syp-settings-status-text">{{ t("v2.common.saved") }}</span>
              <span v-else-if="item.saveState === 'failed'" class="syp-settings-status-text is-error">
                {{ item.errorMessage || t("v2.common.saveFailed") }}
              </span>
            </div>
          </div>
        </div>
      </article>

      <div class="syp-picbed-note">
        <div class="syp-picbed-note__title">{{ t("v2.picbed.environment.title") }}</div>
        <div class="syp-picbed-note__desc">
          {{
            state.isPicgoInstalled
              ? t("v2.picbed.environment.picgoAvailable")
              : t("v2.picbed.environment.picgoUnavailable")
          }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue"
import { JsonUtil } from "zhi-common"
import { BlogConfig, PicbedServiceTypeEnum as PicBedServiceTypeEnum } from "zhi-blog-api"
import Adaptors from "~/src/adaptors"
import { usePicgoBridge } from "~/src/composables/usePicgoBridge.ts"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"
import { DynamicConfig, DynamicJsonCfg, PlatformType } from "~/src/platforms/dynamicConfig.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"

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

const { getSetting, updateSetting } = usePublishSettingStore()
const { checkPicgoInstalled, getPicbedServiceType: getPicBedServiceType } = usePicgoBridge()
const { t } = useV2I18n()

const state = reactive({
  isLoading: true,
  isPicgoInstalled: false,
  loadErrorMessage: "",
  rows: [] as PicBedRow[],
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
  await loadRows()
})

async function loadRows() {
  state.isLoading = true
  state.loadErrorMessage = ""

  try {
    const setting = await getSetting()
    const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
    const dynamicConfigArray = (dynJsonCfg?.totalCfg || []).filter((item) => item.platformType !== PlatformType.System)

    state.isPicgoInstalled = await checkPicgoInstalled()

    state.rows = await Promise.all(dynamicConfigArray.map((item) => buildRow(item, setting)))
  } catch (error) {
    state.loadErrorMessage = error instanceof Error ? error.message : String(error ?? t("v2.common.unknownError"))
  } finally {
    state.isLoading = false
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
      label: state.isPicgoInstalled ? t("publisher.picbed.picgo") : t("v2.picbed.option.picgoUnavailable"),
      disabled: !picgoSupported || !state.isPicgoInstalled,
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
    supported.push("PicGo")
  }
  if (bundledSupported) {
    supported.push(t("v2.picbed.option.bundled"))
  }

  if (supported.length === 0) {
    return t("v2.picbed.support.none")
  }

  return t("v2.picbed.support.some", { services: supported.join(" / ") })
}
</script>

<style scoped lang="stylus">
.syp-picbed-control
  min-width 320px

.syp-picbed-control__select
  min-width 180px

.syp-picbed-note
  padding 16px 18px
  border-radius 12px
  border 1px solid #e6ebf2
  background #fff

.syp-picbed-note__title
  font-size 13px
  color #7b8490

.syp-picbed-note__desc
  margin-top 6px
  font-size 14px
  color #475467

.syp-settings-status-text.is-error
  color #b42318

@media (max-width: 960px)
  .syp-picbed-control
    min-width 0
    width 100%
    flex-direction column
    align-items stretch

  .syp-picbed-control__select
    width 100%
    min-width 0
</style>
