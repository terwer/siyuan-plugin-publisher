<script setup lang="ts">
import {Bird, Clock, Rss, Zap} from "lucide-vue-next"

interface Platform {
  name: string
  icon: any
  type: "blog" | "doc"
  actions: {
    icon: any
    label: string
    handler: () => void
  }[]
}

const platforms: Platform[] = [
  {
    name: "博客园",
    icon: Rss,
    type: "blog",
    actions: [
      {icon: Zap, label: "极速发布", handler: () => console.log("fast")},
      {icon: Clock, label: "常规发布", handler: () => console.log("normal")}
    ]
  },
  {
    name: "语雀",
    icon: Bird,
    type: "doc",
    actions: [
      {icon: Zap, label: "极速发布", handler: () => console.log("fast")},
      {icon: Clock, label: "常规发布", handler: () => console.log("normal")}
    ]
  }
]
</script>

<template>
  <div class="platform-list">
    <ul>
      <li v-for="platform in platforms" :key="platform.name" class="platform-item">
        <div class="platform-info">
          <component :is="platform.icon" class="platform-icon"/>
          <span>{{ platform.name }}</span>
        </div>

        <div class="action-buttons">
          <button
              v-for="action in platform.actions"
              :key="action.label"
              @click="action.handler"
              class="action-btn"
          >
            <component :is="action.icon" class="btn-icon"/>
            <span class="tooltip">{{ action.label }}</span>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="stylus" scoped>
.platform-list
  padding 0.25rem
  min-width 400px
  max-width 800px
  margin 0 auto
  position relative  // 新增层级控制
  z-index 1

  ul
    list-style none
    padding 0
    margin 0

.platform-item
  display flex
  align-items center
  justify-content space-between
  height 32px
  padding 0 0.5rem
  margin 0 0 8px
  border-radius 4px
  background #fff
  transition background-color 0.2s

  &:hover
    background-color #f8f9fa  // 新增悬停背景

.platform-info
  display flex
  align-items center
  gap 0.4rem
  font-size 0.7rem
  font-weight 500

  span
    color #4a5568  // 中性灰文字
    transition color 0.2s

  &:hover span
    color #2d3748  // 悬停深灰色

  .platform-icon
    width 16px
    height 16px
    color #718096  // 中性灰图标

.action-buttons
  display flex
  gap 0.4rem
  margin-left auto

.action-btn
  position relative
  padding 0.3rem
  border none
  background none
  cursor pointer
  color #718096  // 中性灰图标
  border-radius 3px
  transition all 0.15s

  &:hover
    background #edf2f7  // 浅灰背景
    color #2d3748      // 深灰图标

    .tooltip
      opacity 1
      visibility visible

.btn-icon
  width 14px
  height 14px

.tooltip
  position absolute
  bottom calc(100% + 8px)  // 固定在按钮上方8px
  left 50%
  transform translateX(-50%)
  z-index 9999
  background #4a5568
  color #f8fafc
  padding 6px 12px
  border-radius 4px
  font-size 0.7rem
  white-space nowrap
  opacity 0
  visibility hidden
  transition all 0.2s
  box-shadow 0 2px 8px rgba(0, 0, 0, 0.1)

  // 添加小三角指示器
  &::after
    content ""
    position absolute
    top 100%
    left 50%
    margin-left -4px
    border-width 4px
    border-style solid
    border-color #4a5568 transparent transparent transparent

// 暗黑模式适配
html[data-theme-mode="dark"]
  .platform-item
    background var(--b3-theme-surface)

    &:hover
      background-color var(--b3-theme-surface-hover)

  .platform-info
    span
      color var(--b3-theme-on-surface)

      &:hover
        color var(--b3-theme-on-surface-hover)

    .platform-icon
      color var(--b3-theme-on-surface-light)

  .action-btn
    color var(--b3-theme-on-surface-light)

    &:hover
      background var(--b3-theme-surface-hover)
      color var(--b3-theme-on-surface)

      .tooltip
        background var(--b3-theme-surface)
        color var(--b3-theme-on-surface)
        box-shadow 0 2px 8px rgba(0, 0, 0, 0.3)

        &::after
          border-color var(--b3-theme-surface) transparent transparent transparent
</style>