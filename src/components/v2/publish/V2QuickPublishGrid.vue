<template>
  <section class="syp-quick-grid" role="region" :aria-label="t('v2.panel.quickPublish')">
    <div class="syp-quick-grid__loading" v-if="quickPublish.state.isLoading">
      <span class="syp-quick-grid__loading-dot"></span>
      <span>{{ t("main.loading") }}</span>
    </div>

    <div v-else-if="!hasPlatforms" class="syp-quick-grid__empty">
      <p class="syp-quick-grid__empty-text">{{ t("v2.singlePublish.empty.noPlatform") }}</p>
    </div>

    <div v-else class="syp-quick-grid__grid">
      <V2PlatformCard
        v-for="item in quickPublish.state.platformItems"
        :key="item.platformKey"
        :platform-name="item.platformName"
        :platform-icon="item.platformIcon"
        :is-authorized="item.isAuthorized"
        :is-published="item.isPublished"
        :tooltip-text="item.tooltipText"
        :is-processing="quickPublish.state.publishState.isPublishing"
        :preview-link="previewLinkMap[item.platformKey]"
        :is-failed="isFailed(item)"
        @primary="quickPublish.publishToPlatform(item)"
        @preview="quickPublish.previewPlatform(item, true)"
        @delete="quickPublish.deletePlatform(item)"
        @configure="onConfigure(item)"
      />
    </div>

    <div class="syp-quick-grid__hint">{{ t("v2.singlePublish.status.previewHint") }}</div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useV2QuickPublish } from "~/src/composables/v2/useV2QuickPublish.ts"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"
import V2PlatformCard from "~/src/components/v2/publish/V2PlatformCard.vue"

const props = defineProps<{
  pageId: string
}>()

defineEmits<{
  (event: "back"): void
}>()

const { t } = useV2I18n()
const quickPublish = useV2QuickPublish()

const hasPlatforms = computed(() => quickPublish.hasPlatforms.value)
const previewLinkMap = computed<Record<string, string>>(() => quickPublish.state.previewLinkMap)

function isFailed(item: (typeof quickPublish.state.platformItems)[number]) {
  return quickPublish.state.publishState.status === "failed" && quickPublish.state.publishState.platformKey === item.platformKey
}

function onConfigure(_item: (typeof quickPublish.state.platformItems)[number]) {
  // 闪发快捷面板暂不支持跳转配置；留待后续接入设置
}

onMounted(async () => {
  await quickPublish.init(props.pageId)
})
</script>

<style scoped lang="stylus">
@import "../../../assets/v2/variables.styl"

.syp-quick-grid
  display flex
  flex-direction column
  gap 10px

  &__loading
    display inline-flex
    align-items center
    gap 6px
    padding 12px
    color var(--b3-theme-on-surface-light, $syp-text-secondary)

  &__loading-dot
    width 7px
    height 7px
    border-radius 999px
    background var(--b3-theme-primary, $syp-accent)
    animation syp-quick-grid-pulse 0.9s ease-in-out infinite alternate

  &__empty
    padding 16px
    border-radius $syp-sm-card-radius
    background $syp-card-bg-gradient
    border 1px solid var(--b3-border-color, $syp-border-primary)

  &__empty-text
    margin 0
    font-size 13px
    color var(--b3-theme-on-surface-light, $syp-text-secondary)

  &__grid
    display grid
    grid-template-columns repeat(2, minmax(0, 1fr))
    gap 10px

  &__hint
    font-size 12px
    color var(--b3-theme-on-surface-light, $syp-text-tertiary)
    text-align center
    padding 8px 0 0
</style>
