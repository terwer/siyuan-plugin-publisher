<template>
  <section class="syp-settings-page">
    <div class="syp-settings-page__header">
      <div>
        <div class="syp-settings-page__eyebrow">账号设置</div>
        <h2 class="syp-settings-page__title">{{ platformName || "平台配置" }}</h2>
        <p class="syp-settings-page__desc">
          当前通过真实 DOM 直接桥接已有平台表单，不再依赖 iframe 设置页。
        </p>
      </div>
    </div>

    <div v-if="state.isLoading" class="syp-settings-empty">
      <div class="syp-settings-empty__title">正在加载平台配置</div>
      <div class="syp-settings-empty__desc">正在读取平台元数据和桥接组件。</div>
    </div>

    <div v-else-if="state.errorMessage" class="syp-settings-empty">
      <div class="syp-settings-empty__title">平台配置加载失败</div>
      <div class="syp-settings-empty__desc">{{ state.errorMessage }}</div>
    </div>

    <template v-else>
      <div class="syp-settings-detail-grid">
        <article class="syp-settings-detail-card">
          <div class="syp-settings-detail-card__title">当前桥接</div>
          <div class="syp-settings-detail-list">
            <div class="syp-settings-detail-row">
              <div class="syp-settings-detail-label">平台 key</div>
              <div class="syp-settings-detail-value">{{ platformKey }}</div>
            </div>
            <div class="syp-settings-detail-row">
              <div class="syp-settings-detail-label">平台类型</div>
              <div class="syp-settings-detail-value">{{ bridgeLabel }}</div>
            </div>
          </div>
        </article>

        <article class="syp-settings-detail-card">
          <div class="syp-settings-detail-card__title">当前能力</div>
          <div class="syp-settings-detail-list">
            <div class="syp-settings-detail-row">
              <div class="syp-settings-detail-label">配置保存</div>
              <div class="syp-settings-detail-value">直接复用现有配置读取与保存链路</div>
            </div>
            <div class="syp-settings-detail-row">
              <div class="syp-settings-detail-label">授权校验</div>
              <div class="syp-settings-detail-value">直接复用现有验证逻辑与状态回写</div>
            </div>
          </div>
        </article>
      </div>

      <div v-if="bridgeComponent" class="syp-platform-bridge">
        <Suspense>
          <component :is="bridgeComponent" :api-type="platformKey" />
          <template #fallback>
            <div class="syp-settings-empty">
              <div class="syp-settings-empty__title">正在挂载桥接表单</div>
              <div class="syp-settings-empty__desc">请稍候，正在加载平台配置表单。</div>
            </div>
          </template>
        </Suspense>
      </div>

      <div v-else class="syp-settings-empty">
        <div class="syp-settings-empty__title">当前平台还未纳入 M4 桥接范围</div>
        <div class="syp-settings-empty__desc">
          当前仅桥接 WordPress 和 博客园，后续会逐步扩展更多平台表单。
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, watch, type Component } from "vue"
import CnblogsSetting from "~/src/components/set/publish/singleplatform/metaweblog/CnblogsSetting.vue"
import WordpressSetting from "~/src/components/set/publish/singleplatform/metaweblog/WordpressSetting.vue"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { SubPlatformType } from "~/src/platforms/dynamicConfig.ts"

const props = defineProps<{
  platformKey: string
  platformName?: string
}>()

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
    return "博客园"
  }
  return state.subtype || "未识别"
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
    state.errorMessage = "未提供平台 key"
    state.isLoading = false
    return
  }

  state.isLoading = true
  state.errorMessage = ""

  try {
    const publishCfg = await getPublishCfg(props.platformKey)
    state.subtype = publishCfg.dynCfg?.subPlatformType ?? ""
    if (!publishCfg.dynCfg) {
      state.errorMessage = "未找到对应的平台配置"
    }
  } catch (error) {
    state.errorMessage = error instanceof Error ? error.message : String(error ?? "未知错误")
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
