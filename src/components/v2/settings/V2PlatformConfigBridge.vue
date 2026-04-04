<template>
  <section class="syp-settings-page">
    <div class="syp-settings-page__header">
      <div>
        <div class="syp-settings-page__eyebrow">{{ t("v2.platformConfig.eyebrow") }}</div>
        <h2 class="syp-settings-page__title">{{ platformName || t("v2.platformConfig.title") }}</h2>
        <p class="syp-settings-page__desc">
          {{ t("v2.platformConfig.desc") }}
        </p>
      </div>
    </div>

    <div v-if="state.isLoading" class="syp-settings-empty">
      <div class="syp-settings-empty__title">{{ t("v2.platformConfig.loading.title") }}</div>
      <div class="syp-settings-empty__desc">{{ t("v2.platformConfig.loading.desc") }}</div>
    </div>

    <div v-else-if="state.errorMessage" class="syp-settings-empty">
      <div class="syp-settings-empty__title">{{ t("v2.platformConfig.error.title") }}</div>
      <div class="syp-settings-empty__desc">{{ state.errorMessage }}</div>
    </div>

    <template v-else>
      <div v-if="bridgeComponent" class="syp-platform-bridge">
        <Suspense>
          <component :is="bridgeComponent" :api-type="platformKey" />
          <template #fallback>
            <div class="syp-settings-empty">
              <div class="syp-settings-empty__title">{{ t("v2.platformConfig.mounting.title") }}</div>
              <div class="syp-settings-empty__desc">{{ t("v2.platformConfig.mounting.desc") }}</div>
            </div>
          </template>
        </Suspense>
      </div>

      <div v-else class="syp-settings-empty">
        <div class="syp-settings-empty__title">{{ t("v2.platformConfig.unsupported.title") }}</div>
        <div class="syp-settings-empty__desc">
          {{ t("v2.platformConfig.unsupported.desc") }}
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, watch, type Component } from "vue"
import CnblogsSetting from "~/src/components/set/publish/singleplatform/metaweblog/CnblogsSetting.vue"
import WordpressSetting from "~/src/components/set/publish/singleplatform/metaweblog/WordpressSetting.vue"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { SubPlatformType } from "~/src/platforms/dynamicConfig.ts"

const props = defineProps<{
  platformKey: string
  platformName?: string
}>()

const { t } = useV2I18n()
const { getPublishCfg } = usePublishConfig()

const state = reactive({
  isLoading: true,
  errorMessage: "",
  subtype: "" as SubPlatformType | "",
})

const bridgeComponent = computed<Component | null>(() => {
  if (state.subtype === SubPlatformType.Wordpress_Wordpress) {
    return WordpressSetting
  }
  if (state.subtype === SubPlatformType.Metaweblog_Cnblogs) {
    return CnblogsSetting
  }
  return null
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
    state.errorMessage = t("v2.platformConfig.error.noPlatformKey")
    state.isLoading = false
    return
  }

  state.isLoading = true
  state.errorMessage = ""

  try {
    const publishCfg = await getPublishCfg(props.platformKey)
    state.subtype = publishCfg.dynCfg?.subPlatformType ?? ""
    if (!publishCfg.dynCfg) {
      state.errorMessage = t("v2.platformConfig.error.notFound")
    }
  } catch (error) {
    state.errorMessage = error instanceof Error ? error.message : String(error ?? t("v2.common.unknownError"))
    state.subtype = ""
  } finally {
    state.isLoading = false
  }
}
</script>

<style scoped lang="stylus">
.syp-platform-bridge
  padding 14px
  border-radius 12px
  border 1px solid #e6ebf2
  background #fff
  overflow visible

  :deep(.el-form)
    width 100%
    max-width 100%
    overflow visible

  :deep(.el-form-item)
    margin-right 0

  :deep(.el-form-item__content)
    min-width 0

  :deep(.el-input),
  :deep(.el-input__wrapper),
  :deep(.el-textarea),
  :deep(.el-select)
    max-width 100%

  :deep(.legacy-setting-form),
  :deep(.legacy-cookie-form)
    font-size 13px

  :deep(.legacy-setting-form .el-form-item),
  :deep(.legacy-cookie-form .el-form-item)
    margin-bottom 8px

  :deep(.legacy-setting-form .el-form-item__label),
  :deep(.legacy-cookie-form .el-form-item__label)
    min-height 30px
    padding-right 10px
    font-size 12px

  :deep(.legacy-setting-form .el-form-item__content),
  :deep(.legacy-cookie-form .el-form-item__content)
    min-height 30px
    gap 6px

  :deep(.legacy-setting-form .el-input__wrapper),
  :deep(.legacy-setting-form .el-select__wrapper),
  :deep(.legacy-cookie-form .el-input__wrapper),
  :deep(.legacy-cookie-form .el-select__wrapper)
    min-height 30px
    padding 0 8px

  :deep(.legacy-setting-form .el-textarea__inner),
  :deep(.legacy-cookie-form .el-textarea__inner)
    padding 6px 8px
    line-height 1.35

  :deep(.legacy-setting-form .el-radio-group),
  :deep(.legacy-cookie-form .el-radio-group)
    gap 4px 12px

  :deep(.legacy-setting-form .el-radio),
  :deep(.legacy-setting-form .el-checkbox),
  :deep(.legacy-cookie-form .el-radio),
  :deep(.legacy-cookie-form .el-checkbox)
    min-height 22px

  :deep(.legacy-setting-form .el-radio__label),
  :deep(.legacy-setting-form .el-checkbox__label),
  :deep(.legacy-cookie-form .el-radio__label),
  :deep(.legacy-cookie-form .el-checkbox__label)
    padding-left 4px
    font-size 12px

  :deep(.legacy-setting-form .el-radio__inner),
  :deep(.legacy-setting-form .el-checkbox__inner),
  :deep(.legacy-cookie-form .el-radio__inner),
  :deep(.legacy-cookie-form .el-checkbox__inner)
    width 13px
    height 13px

  :deep(.legacy-setting-form .el-alert),
  :deep(.legacy-cookie-form .el-alert)
    --el-alert-padding 6px 8px

  :deep(.legacy-setting-form .el-button),
  :deep(.legacy-cookie-form .el-button)
    min-height 30px
    padding 0 12px

  :deep(.el-alert)
    margin-top 8px

  :deep(.el-button + .el-button)
    margin-left 8px
</style>
