<template>
  <section class="syp-single-view" role="region" :aria-label="t('v2.panel.singlePublish')">
    <div class="syp-single-view__head">
      <button
        v-if="!embedded"
        type="button"
        class="syp-single-view__back"
        :aria-label="t('v2.singlePublish.back')"
        @click="goBack"
      >
        <LucideChevronLeft />
      </button>
      <div>
        <div class="syp-single-view__eyebrow">{{ t("v2.panel.singlePublish") }}</div>
        <h2 class="syp-single-view__title">{{ headTitle }}</h2>
      </div>
    </div>

    <div class="syp-single-view__body">
      <!-- 第一步：选择平台（复用 V1 SinglePublishSelectPlatform） -->
      <SinglePublishSelectPlatform
        v-if="!selectedKey"
        :id="pageId"
        @open="onSelectPlatform"
      />

      <!-- 第二步：详细发布表单（复用 V1 SinglePublishDoPublish） -->
      <SinglePublishDoPublish
        v-else
        :platform-key="selectedKey"
        :id="pageId"
        :method="selectedMethod"
        @back="onPublishBack"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import LucideChevronLeft from "~icons/lucide/chevron-left"
import SinglePublishSelectPlatform from "~/src/components/publish/SinglePublishSelectPlatform.vue"
import SinglePublishDoPublish from "~/src/components/publish/SinglePublishDoPublish.vue"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { StrUtil } from "zhi-common"

const props = defineProps<{
  pageId: string
  presetPlatformKey?: string
  presetMethod?: string
  embedded?: boolean
}>()

const emit = defineEmits<{
  (event: "back"): void
}>()

const { t } = useV2I18n()
const { getSetting } = usePublishSettingStore()

// 复用 V1 两步流程：预设平台 → 直接详表单；否则先选平台。
const selectedKey = ref(props.presetPlatformKey ?? "")
const selectedMethod = ref<string>(props.presetMethod ?? "")

const headTitle = computed(() => {
  return selectedKey.value ? t("v2.panel.singlePublish") : t("v2.singlePublish.selectPlatform.title")
})

const resolveMethod = async (key: string): Promise<string> => {
  if (props.presetMethod) {
    return props.presetMethod
  }
  try {
    const setting = await getSetting()
    const postMeta = (setting as any)?.[props.pageId] ?? {}
    const posidKey = getDynPostidKey(key)
    const postId = posidKey ? postMeta?.[posidKey] : ""
    return StrUtil.isEmptyString(postId) ? "add" : "edit"
  } catch {
    return "add"
  }
}

const onSelectPlatform = async (key: string, _pageId: string, method: string) => {
  selectedKey.value = key
  selectedMethod.value = method || (await resolveMethod(key))
}

const onPublishBack = () => {
  // 从详表单返回时：若有预设平台则回退到选平台（保留语义），否则回退到父级。
  // 这里统一回到选平台步骤；更符合 V1 手风琴返回语义。
  selectedKey.value = ""
  selectedMethod.value = ""
}

const goBack = () => {
  if (selectedKey.value) {
    onPublishBack()
    return
  }
  emit("back")
}

// 初始化：若带预设平台，先解析 method（add/edit），避免按钮文案错误。
if (props.presetPlatformKey) {
  void (async () => {
    selectedMethod.value = await resolveMethod(props.presetPlatformKey!)
  })()
}
</script>

<style scoped lang="stylus">
@import "../../../assets/v2/variables.styl"

.syp-single-view
  display flex
  flex-direction column
  gap 12px

  &__head
    display flex
    align-items flex-start
    gap 10px

  &__back
    display inline-flex
    align-items center
    justify-content center
    width 28px
    height 28px
    border-radius 999px
    border 1px solid var(--b3-border-color, $syp-border-primary)
    background var(--b3-theme-surface, $syp-bg-primary)
    color var(--b3-theme-on-surface-light, $syp-text-tertiary)
    cursor pointer
    flex-shrink 0

    &:hover
      color var(--b3-theme-primary, $syp-accent)
      border-color var(--b3-theme-primary, $syp-accent)

  &__eyebrow
    font-size 12px
    letter-spacing 0.08em
    text-transform uppercase
    color var(--b3-theme-on-surface-light, $syp-text-tertiary)

  &__title
    margin 0
    font-size 18px
    line-height 1.3
    color var(--b3-theme-on-background, $syp-text-primary)

  &__body
    display flex
    flex-direction column
</style>
