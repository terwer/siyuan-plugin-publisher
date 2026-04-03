<template>
  <section class="syp-settings-page">
    <div class="syp-settings-page__header">
      <div>
        <div class="syp-settings-page__eyebrow">图床设置</div>
        <h2 class="syp-settings-page__title">图床设置</h2>
        <p class="syp-settings-page__desc">
          图床服务按平台保存。这里不会再跳到外部设置页，所有修改都直接写入当前平台配置。
        </p>
      </div>
    </div>

    <div v-if="state.isLoading" class="syp-settings-empty">
      <div class="syp-settings-empty__title">正在加载图床配置</div>
      <div class="syp-settings-empty__desc">正在读取平台配置与图床能力。</div>
    </div>

    <div v-else-if="state.loadErrorMessage" class="syp-settings-empty">
      <div class="syp-settings-empty__title">图床配置加载失败</div>
      <div class="syp-settings-empty__desc">{{ state.loadErrorMessage }}</div>
    </div>

    <div v-else-if="state.rows.length === 0" class="syp-settings-empty">
      <div class="syp-settings-empty__title">暂无可配置的平台</div>
      <div class="syp-settings-empty__desc">请先在账号设置中新增至少一个平台账号。</div>
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

              <button
                type="button"
                class="syp-btn syp-btn-primary"
                :disabled="item.saveState === 'saving'"
                @click="savePicBedService(item.platformKey)"
              >
                {{ item.saveState === "saving" ? "保存中" : "保存" }}
              </button>

              <span v-if="item.saveState === 'saved'" class="syp-settings-status-text">已保存</span>
              <span v-else-if="item.saveState === 'failed'" class="syp-settings-status-text is-error">
                {{ item.errorMessage || "保存失败" }}
              </span>
            </div>
          </div>
        </div>
      </article>

      <div class="syp-picbed-note">
        <div class="syp-picbed-note__title">当前环境</div>
        <div class="syp-picbed-note__desc">
          PicGo 插件{{ state.isPicgoInstalled ? "已检测到，可作为可选图床服务。" : "未检测到，相关选项会保持禁用。" }}
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

const state = reactive({
  isLoading: true,
  isPicgoInstalled: false,
  loadErrorMessage: "",
  rows: [] as PicBedRow[],
})

const groupedRows = computed(() => {
  return [
    {
      title: "已启用平台",
      description: "这些平台当前已经可以参与发布，修改后会影响后续图片上传策略。",
      items: state.rows.filter((item) => item.isEnabled),
    },
    {
      title: "未启用平台",
      description: "这些平台的图床策略会在账号启用后生效。",
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
    state.loadErrorMessage = error instanceof Error ? error.message : String(error ?? "未知错误")
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
    { value: PicBedServiceTypeEnum.None, label: "不使用图床" },
    {
      value: PicBedServiceTypeEnum.PicGo,
      label: state.isPicgoInstalled ? "PicGo 插件" : "PicGo 插件（未安装）",
      disabled: !picgoSupported || !state.isPicgoInstalled,
    },
    {
      value: PicBedServiceTypeEnum.Bundled,
      label: "内置图床",
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
    statusText: item.isEnabled ? "账号已启用" : "账号未启用",
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
    target.errorMessage = error instanceof Error ? error.message : String(error ?? "未知错误")
  }
}

function buildSupportText(picgoSupported: boolean, bundledSupported: boolean) {
  const supported: string[] = []
  if (picgoSupported) {
    supported.push("PicGo")
  }
  if (bundledSupported) {
    supported.push("内置图床")
  }

  if (supported.length === 0) {
    return "当前平台不支持额外图床服务"
  }

  return `支持 ${supported.join(" / ")}`
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
