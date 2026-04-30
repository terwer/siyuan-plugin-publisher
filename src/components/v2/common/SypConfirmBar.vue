<template>
  <Transition name="syp-confirm-bar">
    <div v-if="visible" class="syp-confirm-bar" @click.stop>
      <div class="syp-confirm-bar__text">
        <slot>{{ message }}</slot>
      </div>
      <div class="syp-confirm-bar__actions">
        <button
          type="button"
          class="syp-confirm-bar__btn"
          :disabled="loading"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </button>
        <button
          type="button"
          class="syp-confirm-bar__btn is-ghost"
          @click="$emit('cancel')"
        >
          {{ cancelText }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  message?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}>()

defineEmits<{
  (event: "confirm"): void
  (event: "cancel"): void
}>()
</script>

<style scoped lang="stylus">
@import "../../../assets/v2/variables.styl"

.syp-confirm-bar
  margin-top 6px
  padding 8px
  border-radius $syp-radius-sm
  border 1px solid $syp-status-error-border
  background $syp-status-error-bg
  display flex
  flex-direction column
  gap 6px

.syp-confirm-bar__text
  font-size 12px
  color $syp-action-danger-hover

.syp-confirm-bar__actions
  display flex
  gap 6px

.syp-confirm-bar__btn
  padding 2px 8px
  border-radius $syp-radius-sm
  border 1px solid $syp-action-danger
  background $syp-action-danger
  color #fff
  font-size 12px
  line-height 1.4
  cursor pointer
  transition background 0.15s ease, border-color 0.15s ease

  &:hover
    background $syp-action-danger-hover
    border-color $syp-action-danger-hover

  &.is-ghost
    background transparent
    color $syp-action-danger

    &:hover
      background rgba(217, 45, 32, 0.08)
      border-color $syp-action-danger-hover

  &:disabled
    opacity 0.6
    cursor not-allowed

// Transition
.syp-confirm-bar-enter-active,
.syp-confirm-bar-leave-active
  transition all 0.2s ease

.syp-confirm-bar-enter-from,
.syp-confirm-bar-leave-to
  opacity 0
  transform translateY(-4px)
</style>
