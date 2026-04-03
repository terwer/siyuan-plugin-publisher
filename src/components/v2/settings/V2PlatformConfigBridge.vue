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
      <div class="syp-settings-detail-grid">
        <article class="syp-settings-detail-card">
          <div class="syp-settings-detail-card__title">{{ t("v2.platformConfig.card.bridgeTitle") }}</div>
          <div class="syp-settings-detail-list">
            <div class="syp-settings-detail-row">
              <div class="syp-settings-detail-label">{{ t("v2.platformConfig.field.platformKey") }}</div>
              <div class="syp-settings-detail-value">{{ platformKey }}</div>
            </div>
            <div class="syp-settings-detail-row">
              <div class="syp-settings-detail-label">{{ t("v2.platformConfig.field.platformType") }}</div>
              <div class="syp-settings-detail-value">{{ bridgeLabel }}</div>
            </div>
          </div>
        </article>

        <article class="syp-settings-detail-card">
          <div class="syp-settings-detail-card__title">{{ t("v2.platformConfig.card.capabilityTitle") }}</div>
          <div class="syp-settings-detail-list">
            <div class="syp-settings-detail-row">
              <div class="syp-settings-detail-label">{{ t("v2.platformConfig.field.save") }}</div>
              <div class="syp-settings-detail-value">{{ t("v2.platformConfig.value.save") }}</div>
            </div>
            <div class="syp-settings-detail-row">
              <div class="syp-settings-detail-label">{{ t("v2.platformConfig.field.validate") }}</div>
              <div class="syp-settings-detail-value">{{ t("v2.platformConfig.value.validate") }}</div>
            </div>
          </div>
        </article>
      </div>

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

const bridgeLabel = computed(() => {
  if (state.subtype === SubPlatformType.Wordpress_Wordpress) {
    return "WordPress"
  }
  if (state.subtype === SubPlatformType.Metaweblog_Cnblogs) {
    return t("v2.platform.cnblogs")
  }
  return state.subtype || t("v2.common.unknown")
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
  padding 20px
  border-radius 14px
  border 1px solid #e6ebf2
  background #fff
  overflow auto

  :deep(.el-form)
    width 100%

  :deep(.el-form-item)
    margin-right 0

  :deep(.el-alert)
    margin-top 8px

  :deep(.el-button + .el-button)
    margin-left 8px
</style>
