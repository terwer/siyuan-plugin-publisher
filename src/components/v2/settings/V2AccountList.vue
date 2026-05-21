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
      <article
        v-for="(item, index) in orderedItems"
        :key="item.platformKey"
        class="syp-account-item"
        :class="{ 'is-dragging': draggingPlatformKey === item.platformKey, 'is-drag-over': dragOverPlatformKey === item.platformKey }"
        @dragover.prevent="handleDragOver(item.platformKey)"
        @drop.prevent="handleDrop(item.platformKey)"
        @dragend="handleDragEnd"
      >
        <div class="syp-account-item__order">
          <SypTooltip
            tag="button"
            :content="t('v2.account.order.dragHandle')"
            inline-flex
            type="button"
            class="syp-account-item__drag-handle"
            draggable="true"
            :aria-label="t('v2.account.order.dragHandle')"
            @dragstart="handleDragStart(item.platformKey, $event)"
          >
            <span aria-hidden="true">⋮⋮</span>
          </SypTooltip>
          <div class="syp-account-item__order-buttons">
            <SypTooltip
              tag="button"
              :content="t('v2.account.order.moveUp')"
              inline-flex
              type="button"
              class="syp-account-item__order-button"
              :disabled="index === 0"
              :aria-label="t('v2.account.order.moveUp')"
              @click="moveItem(item.platformKey, -1)"
            >
              ↑
            </SypTooltip>
            <SypTooltip
              tag="button"
              :content="t('v2.account.order.moveDown')"
              inline-flex
              type="button"
              class="syp-account-item__order-button"
              :disabled="index === orderedItems.length - 1"
              :aria-label="t('v2.account.order.moveDown')"
              @click="moveItem(item.platformKey, 1)"
            >
              ↓
            </SypTooltip>
          </div>
        </div>
        <div class="syp-account-item__main">
          <div class="syp-account-item__icon">
            <span v-if="item.platformIcon" v-html="item.platformIcon"></span>
            <span v-else>{{ item.platformName.slice(0, 1) }}</span>
          </div>
          <div class="syp-account-item__info">
            <div class="syp-account-item__name-row">
              <SypTooltip
                :content="item.platformName"
                ellipsis
                inline-flex
                trigger-class="syp-account-item__name"
              />
              <SypTooltip
                tag="span"
                :content="item.statusText"
                inline-flex
                :trigger-class="`syp-status-badge is-${item.statusType}`"
              >
                <span class="syp-status-badge__dot"></span>
                {{ item.statusLabel }}
              </SypTooltip>
            </div>
            <SypTooltip
              :content="item.platformKey"
              ellipsis
              block
              trigger-class="syp-account-item__key"
            />
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
            <SypTooltip
              tag="label"
              :content="item.isEnabled ? t('v2.account.toggle.disableHint') : t('v2.account.toggle.enableHint')"
              inline-flex
              trigger-class="syp-toggle"
            >
              <input
                type="checkbox"
                :checked="item.isEnabled"
                :aria-label="item.isEnabled ? t('v2.account.toggle.disable') : t('v2.account.toggle.enable')"
                @change="handleToggle(item.platformKey, $event)"
              />
              <span class="syp-toggle-slider"></span>
            </SypTooltip>
          </div>

          <SypTooltip
            v-if="confirmDeleteKey !== item.platformKey"
            tag="button"
            :content="t('v2.account.action.delete')"
            inline-flex
            type="button"
            class="syp-btn syp-btn-text is-danger"
            @click.stop="requestDelete(item.platformKey)"
          >
            {{ t("v2.account.action.delete") }}
          </SypTooltip>
        </div>

        <SypConfirmBar
          v-if="confirmDeleteKey === item.platformKey"
          :visible="true"
          class="syp-account-item__delete-confirm"
          :message="deleteConfirmMessage(item.platformName, item.platformKey)"
          :confirm-text="t('main.opt.ok')"
          :cancel-text="t('main.opt.cancel')"
          @confirm="confirmDelete(item.platformKey)"
          @cancel="cancelDelete"
        />
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import SypConfirmBar from "~/src/components/v2/common/SypConfirmBar.vue"
import SypTooltip from "~/src/components/v2/common/SypTooltip.vue"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"
import type { V2AccountItem } from "~/src/composables/v2/useV2Settings.ts"

const props = defineProps<{
  items: V2AccountItem[]
}>()
const { t } = useV2I18n()

const emit = defineEmits<{
  (event: "add"): void
  (event: "configure", platformKey: string, platformName: string): void
  (event: "toggle", platformKey: string, nextEnabled: boolean): void
  (event: "delete", platformKey: string): void
  (event: "reorder", orderedPlatformKeys: string[]): void
}>()

const localPlatformKeys = ref<string[]>([])
const draggingPlatformKey = ref("")
const dragOverPlatformKey = ref("")
const confirmDeleteKey = ref("")

const orderedItems = computed(() => {
  const itemMap = new Map(props.items.map((item) => [item.platformKey, item]))
  const knownItems = localPlatformKeys.value.map((key) => itemMap.get(key)).filter(Boolean) as V2AccountItem[]
  const knownKeySet = new Set(knownItems.map((item) => item.platformKey))
  const newItems = props.items.filter((item) => !knownKeySet.has(item.platformKey))

  return [...knownItems, ...newItems]
})

watch(
  () => props.items.map((item) => item.platformKey).join("\u0000"),
  () => {
    localPlatformKeys.value = props.items.map((item) => item.platformKey)
  },
  { immediate: true }
)

function handleToggle(platformKey: string, event: Event) {
  const target = event.target as HTMLInputElement | null
  emit("toggle", platformKey, target?.checked === true)
}

function deleteConfirmMessage(platformName: string, platformKey: string) {
  const name = platformName || platformKey
  return `${t("v2.account.action.deleteConfirmTitle")} ${t("v2.account.action.deleteConfirmText", { name })}`
}

function requestDelete(platformKey: string) {
  confirmDeleteKey.value = platformKey
}

function cancelDelete() {
  confirmDeleteKey.value = ""
}

function confirmDelete(platformKey: string) {
  emit("delete", platformKey)
  confirmDeleteKey.value = ""
}

function moveKeyToDropTarget(keys: string[], sourceKey: string, targetKey: string) {
  if (sourceKey === targetKey) {
    return keys
  }

  const sourceIndex = keys.indexOf(sourceKey)
  const targetIndex = keys.indexOf(targetKey)
  if (sourceIndex < 0 || targetIndex < 0) {
    return keys
  }

  const nextKeys = keys.filter((key) => key !== sourceKey)
  const nextTargetIndex = nextKeys.indexOf(targetKey)
  const insertIndex = sourceIndex < targetIndex ? nextTargetIndex + 1 : nextTargetIndex
  nextKeys.splice(insertIndex, 0, sourceKey)
  return nextKeys
}

function emitReorder(nextKeys = localPlatformKeys.value) {
  localPlatformKeys.value = [...nextKeys]
  emit("reorder", [...nextKeys])
}

function handleDragStart(platformKey: string, event: DragEvent) {
  draggingPlatformKey.value = platformKey
  dragOverPlatformKey.value = ""
  event.dataTransfer?.setData("text/plain", platformKey)
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move"
  }
}

function handleDragOver(platformKey: string) {
  if (!draggingPlatformKey.value || draggingPlatformKey.value === platformKey) {
    return
  }
  dragOverPlatformKey.value = platformKey
}

function handleDrop(targetPlatformKey: string) {
  const sourcePlatformKey = draggingPlatformKey.value
  if (!sourcePlatformKey) {
    return
  }

  const nextKeys = moveKeyToDropTarget(localPlatformKeys.value, sourcePlatformKey, targetPlatformKey)
  draggingPlatformKey.value = ""
  dragOverPlatformKey.value = ""
  emitReorder(nextKeys)
}

function handleDragEnd() {
  draggingPlatformKey.value = ""
  dragOverPlatformKey.value = ""
}

function moveItem(platformKey: string, direction: -1 | 1) {
  const currentIndex = localPlatformKeys.value.indexOf(platformKey)
  const targetIndex = currentIndex + direction
  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= localPlatformKeys.value.length) {
    return
  }

  const nextKeys = [...localPlatformKeys.value]
  const [target] = nextKeys.splice(currentIndex, 1)
  nextKeys.splice(targetIndex, 0, target)
  emitReorder(nextKeys)
}
</script>

<style scoped lang="stylus">
@import "../../../assets/v2/variables.styl"

.syp-account-list
  display flex
  flex-direction column
  gap 8px

.syp-account-item
  display flex
  flex-wrap wrap
  justify-content space-between
  align-items center
  gap 10px
  padding $syp-sm-card-padding
  border 1px solid var(--b3-border-color, $syp-border-primary)
  border-radius $syp-sm-card-radius
  background $syp-card-bg-gradient
  transition border-color 0.2s ease, box-shadow 0.2s ease

  &:hover
    border-color var(--b3-theme-primary, #c8d6ea)
    box-shadow $syp-shadow-card-hover

  &.is-dragging
    opacity 0.72

  &.is-drag-over
    border-color $syp-action-primary
    box-shadow 0 0 0 2px rgba(64, 128, 255, 0.14)

.syp-account-item__order
  display flex
  align-items center
  gap 3px
  flex-shrink 0

:deep(.syp-account-item__drag-handle)
  width 22px
  height 32px
  padding 0
  border 0
  border-radius 7px
  background transparent
  color #9aa4b2
  cursor grab
  font-size 13px
  line-height 1
  justify-content center

  &:hover
    background #eef3fb
    color #4f6f9f

  &:active
    cursor grabbing

.syp-account-item__order-buttons
  display flex
  flex-direction column
  gap 2px

:deep(.syp-account-item__order-button)
  width 18px
  height 15px
  padding 0
  border 0
  border-radius 5px
  background transparent
  color #9aa4b2
  font-size 10px
  line-height 1
  justify-content center

  &:hover:not(:disabled)
    background #eef3fb
    color #4f6f9f

  &:disabled
    opacity 0.26
    cursor not-allowed

.syp-account-item__main
  display flex
  align-items center
  gap 10px
  min-width 0
  flex 1

.syp-account-item__icon
  width $syp-sm-icon-size
  height $syp-sm-icon-size
  border-radius $syp-sm-icon-radius
  background $syp-icon-bg
  display flex
  align-items center
  justify-content center
  color $syp-icon-color
  flex-shrink 0
  font-size 14px
  font-weight 600

  :deep(svg), :deep(img)
    width $syp-sm-icon-inner
    height $syp-sm-icon-inner

.syp-account-item__info
  min-width 0
  flex 1

.syp-account-item__name-row
  display flex
  align-items center
  gap 8px
  flex-wrap wrap

.syp-account-item__name
  max-width 180px
  font-size $syp-sm-name-size
  font-weight 600
  color var(--b3-theme-on-surface, $syp-text-primary)

.syp-account-item__key
  max-width 240px
  margin-top 2px
  font-size 11px
  color var(--b3-theme-on-surface-light, $syp-text-tertiary)
  font-family monospace

:deep(.syp-status-badge)
  display inline-flex
  align-items center
  justify-content center
  gap 4px
  min-height 20px
  padding 2px 8px
  font-size $syp-sm-badge-font
  font-weight 700
  line-height 16px
  border-radius 999px
  white-space nowrap
  border 1px solid transparent
  box-shadow inset 0 0 0 1px rgba(255, 255, 255, 0.46)

:deep(.syp-status-badge__dot)
  width 6px
  height 6px
  border-radius 50%
  box-shadow 0 0 0 2px rgba(255, 255, 255, 0.7)

:deep(.syp-status-badge.is-success)
  background var(--b3-theme-primary-lightest, $syp-badge-ready-bg)
  border-color var(--b3-theme-success, $syp-success)
  color var(--b3-theme-success, $syp-success)

:deep(.syp-status-badge.is-success .syp-status-badge__dot)
  background var(--b3-theme-success, $syp-success)

:deep(.syp-status-badge.is-warning)
  background var(--b3-theme-surface-light, $syp-status-warning-bg)
  border-color var(--b3-theme-warning, $syp-warning)
  color var(--b3-theme-warning, $syp-warning)

:deep(.syp-status-badge.is-warning .syp-status-badge__dot)
  background var(--b3-theme-warning, $syp-warning)

:deep(.syp-status-badge.is-error)
  background var(--b3-theme-surface-light, $syp-status-error-bg)
  border-color var(--b3-theme-error, $syp-error)
  color var(--b3-theme-error, $syp-error)

:deep(.syp-status-badge.is-error .syp-status-badge__dot)
  background var(--b3-theme-error, $syp-error)

:deep(.syp-status-badge.is-neutral)
  background var(--b3-theme-surface-light, $syp-bg-secondary)
  border-color var(--b3-border-color, $syp-border-primary)
  color var(--b3-theme-on-surface-light, $syp-text-secondary)

:deep(.syp-status-badge.is-neutral .syp-status-badge__dot)
  background var(--b3-theme-on-surface-light, #86909c)

.syp-account-item__actions
  display flex
  align-items center
  justify-content flex-end
  flex-wrap wrap
  gap 6px
  flex-shrink 0

.syp-account-item__delete-confirm
  width 100%
  flex-basis 100%

.syp-account-item__toggle
  display flex
  align-items center
  gap 4px
  color $syp-text-tertiary

.syp-account-item__toggle-label
  font-size 11px
  min-width 32px
  text-align right

.syp-btn.syp-btn-secondary
  background var(--b3-theme-surface-light, $syp-bg-secondary)
  color var(--b3-theme-primary, $syp-accent)
  box-shadow none

  &:hover
    background var(--b3-theme-surface-light, #eef2f7)

.syp-btn.is-warning.syp-btn-secondary
  background var(--b3-theme-surface-light, $syp-status-warning-bg)
  color var(--b3-theme-warning, $syp-warning)

  &:hover
    background var(--b3-theme-surface, $syp-bg-primary)

.syp-btn.is-danger
  color $syp-action-danger-hover

  &:hover
    background $syp-status-error-bg
    color $syp-action-danger-hover

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
