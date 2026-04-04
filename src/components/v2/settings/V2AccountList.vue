<template>
  <section class="syp-settings-page">
    <div class="syp-settings-page__header">
      <div>
        <div class="syp-settings-page__eyebrow">{{ t("v2.account.eyebrow") }}</div>
        <h2 class="syp-settings-page__title">{{ t("v2.account.title") }}</h2>
        <p class="syp-settings-page__desc">{{ t("v2.account.desc") }}</p>
      </div>
      <button type="button" class="syp-btn syp-btn-primary" @click="$emit('add')">
        {{ t("v2.account.action.add") }}
      </button>
    </div>

    <div v-if="items.length === 0" class="syp-settings-empty">
      <div class="syp-settings-empty__title">{{ t("v2.account.empty.title") }}</div>
      <div class="syp-settings-empty__desc">{{ t("v2.account.empty.desc") }}</div>
    </div>

    <div v-else class="syp-account-list">
      <article v-for="item in items" :key="item.platformKey" class="syp-account-item">
        <div class="syp-account-item__main">
          <div class="syp-account-item__icon">
            <span v-if="item.platformIcon" v-html="item.platformIcon"></span>
            <span v-else>{{ item.platformName.slice(0, 1) }}</span>
          </div>
          <div class="syp-account-item__info">
            <div class="syp-account-item__name-row">
              <span class="syp-account-item__name">{{ item.platformName }}</span>
              <span
                class="syp-status-badge"
                :class="`is-${item.statusType}`"
                :title="item.statusText"
              >
                <span class="syp-status-badge__dot"></span>
                {{ item.statusLabel }}
              </span>
            </div>
            <div class="syp-account-item__key">{{ item.platformKey }}</div>
            <div class="syp-account-item__summary">{{ item.statusText }}</div>
          </div>
        </div>

        <div class="syp-account-item__actions">
          <button
            type="button"
            class="syp-btn syp-btn-secondary"
            :class="{ 'is-warning': !item.isAuth }"
            @click="$emit('configure', item.platformKey, item.platformName)"
          >
            {{ item.isAuth ? t("v2.account.action.manage") : t("v2.account.action.authorize") }}
          </button>

          <div class="syp-account-item__toggle">
            <span class="syp-account-item__toggle-label">
              {{ item.isEnabled ? t("v2.account.toggle.enabled") : t("v2.account.toggle.disabled") }}
            </span>
            <label class="syp-toggle" :title="item.isEnabled ? t('v2.account.toggle.disableHint') : t('v2.account.toggle.enableHint')">
              <input
                type="checkbox"
                :checked="item.isEnabled"
                :aria-label="item.isEnabled ? t('v2.account.toggle.disable') : t('v2.account.toggle.enable')"
                @change="handleToggle(item.platformKey, $event)"
              />
              <span class="syp-toggle-slider"></span>
            </label>
          </div>

          <button
            type="button"
            class="syp-btn syp-btn-text is-danger"
            disabled
            :title="t('v2.account.action.deletePending')"
          >
            {{ t("v2.account.action.delete") }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { V2AccountItem } from "~/src/composables/v2/useV2Settings.ts"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"

defineProps<{
  items: V2AccountItem[]
}>()
const { t } = useV2I18n()

const emit = defineEmits<{
  (event: "add"): void
  (event: "configure", platformKey: string, platformName: string): void
  (event: "toggle", platformKey: string, nextEnabled: boolean): void
}>()

function handleToggle(platformKey: string, event: Event) {
  const target = event.target as HTMLInputElement | null
  emit("toggle", platformKey, target?.checked === true)
}
</script>

<style scoped lang="stylus">
.syp-account-list
  display flex
  flex-direction column
  gap 12px

.syp-account-item
  display flex
  justify-content space-between
  align-items center
  gap 16px
  padding 18px
  border 1px solid #e6ebf2
  border-radius 16px
  background linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)
  transition border-color 0.2s ease, box-shadow 0.2s ease

  &:hover
    border-color #c8d6ea
    box-shadow 0 2px 8px rgba(15, 23, 42, 0.04)

.syp-account-item__main
  display flex
  align-items center
  gap 14px
  min-width 0
  flex 1

.syp-account-item__icon
  width 44px
  height 44px
  border-radius 12px
  background #f2f5fa
  display flex
  align-items center
  justify-content center
  color #355d90
  flex-shrink 0
  font-size 18px
  font-weight 600

  :deep(svg), :deep(img)
    width 22px
    height 22px

.syp-account-item__info
  min-width 0
  flex 1

.syp-account-item__name-row
  display flex
  align-items center
  gap 8px
  flex-wrap wrap

.syp-account-item__name
  font-size 16px
  font-weight 600
  color #1f2329

.syp-account-item__key
  margin-top 4px
  font-size 12px
  color #7b8490
  font-family monospace

.syp-account-item__summary
  margin-top 6px
  font-size 13px
  color #475467

.syp-status-badge
  display inline-flex
  align-items center
  gap 4px
  padding 2px 8px
  font-size 12px
  font-weight 500
  border-radius 999px
  white-space nowrap

  &__dot
    width 6px
    height 6px
    border-radius 50%

  &.is-success
    background #e8ffea
    color #00b42a
    .syp-status-badge__dot
      background #00b42a

  &.is-warning
    background #fff7e8
    color #ff7d00
    .syp-status-badge__dot
      background #ff7d00

  &.is-error
    background #ffece8
    color #f53f3f
    .syp-status-badge__dot
      background #f53f3f

  &.is-neutral
    background #f2f3f5
    color #86909c
    .syp-status-badge__dot
      background #86909c

.syp-account-item__actions
  display flex
  align-items center
  justify-content flex-end
  flex-wrap wrap
  gap 10px
  flex-shrink 0

.syp-account-item__toggle
  display flex
  align-items center
  gap 8px
  color #7b8490

.syp-account-item__toggle-label
  font-size 12px
  min-width 44px
  text-align right

.syp-btn.syp-btn-secondary
  background #f7f9fc
  color #355d90
  box-shadow none

  &:hover
    background #eef2f7

.syp-btn.is-warning.syp-btn-secondary
  background #fff7e8
  color #ad5b00

  &:hover
    background #ffefcc

.syp-btn.is-danger
  color #b42318

  &:hover
    background #fff1f1
    color #b42318

  &:disabled
    opacity 0.45
    cursor not-allowed
    background transparent

@media (max-width: 960px)
  .syp-account-item
    align-items flex-start
    flex-direction column

  .syp-account-item__actions
    width 100%
    justify-content flex-start
</style>
