<script setup lang="ts">
import { Bird, Clock, Rss, Zap, Inbox } from "lucide-vue-next"

interface Platform {
  name: string;
  icon: any;
  type: "blog" | "doc";
  actions: {
    icon: any;
    label: string;
    handler: () => void;
  }[];
}

const platforms: Platform[] = [
  {
    name: "博客园",
    icon: Rss,
    type: "blog",
    actions: [
      { icon: Zap, label: "极速发布", handler: () => console.log("fast") },
      { icon: Clock, label: "常规发布", handler: () => console.log("normal") },
    ],
  },
  {
    name: "语雀",
    icon: Bird,
    type: "doc",
    actions: [
      { icon: Zap, label: "极速发布", handler: () => console.log("fast") },
      { icon: Clock, label: "常规发布", handler: () => console.log("normal") },
    ],
  },
]

const gotoAccount = () => {
  window.open("https://publisher.siyuan.build/account")
}
</script>

<template>
  <div class="platform-list">
    <div v-if="platforms.length === 0" class="empty-state">
      <Inbox class="empty-icon" />
      <div class="empty-text">
        <p>暂时没有可用平台</p>
        <p>
          请先去<a class="account-link" @click="gotoAccount">账号管理</a
          >添加账号吧
        </p>
      </div>
    </div>
    <ul v-else>
      <li
        v-for="platform in platforms"
        :key="platform.name"
        class="platform-item"
      >
        <div class="platform-info">
          <component :is="platform.icon" class="platform-icon" />
          <span>{{ platform.name }}</span>
        </div>

        <div class="action-buttons">
          <button
            v-for="action in platform.actions"
            :key="action.label"
            @click="action.handler"
            class="action-btn"
          >
            <component :is="action.icon" class="btn-icon" />
            <span class="tooltip">{{ action.label }}</span>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="stylus" scoped>
  .empty-state
    display flex
    flex-direction column
    align-items center
    padding 2rem
    text-align center

  .empty-icon
    width 64px
    height 64px
    color #cbd5e0
    margin-bottom 1rem

  .empty-text
    color #718096
    font-size 0.9rem
    line-height 1.6

    p:first-child
      font-weight 500
      color #4a5568

    .account-link
      color #4299e1
      cursor pointer
      text-decoration underline
      transition color 0.2s

      &:hover
        color #3182ce

.platform-list
  isolation: isolate
  padding 0.25rem
  min-width 400px
  max-width 800px
  margin 0 auto
  position relative  // 新增层级控制
  z-index 66

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
    background-color #edf2f7  // 新增悬停背景

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
  top: calc(100% + 6px) // 更精确的定位
  margin-top: 0 // 移除额外间距
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
  box-shadow 0 2px 4px rgba(0, 0, 0, 0.1) // 减小阴影扩散
  //  max-width: 200px
  word-break: keep-all
  &::after
    content ""
    position absolute
    top: -8px  // 统一三角位置
    left: 50%
    transform: translateX(-50%)
    border-width: 4px
    border-style: solid
    border-color: transparent transparent #4a5568 transparent
  // 自动调整左右位置
  left: auto
  right: 0
  transform: translateX(-50%)

  // 右侧越界保护
  &[style*="left"]
    right: auto
    left: 0
    transform: translateX(-20%)

// 暗黑模式适配
html[data-theme-mode="dark"]
  .empty-state
    .empty-icon
      color #4a5568

    .empty-text
      color #a0aec0
      p:first-child
        color #e2e8f0

    .account-link
      color #63b3ed
      &:hover
        color #4299e1

  .platform-item
    background-color #3a3a3a

    &:hover
      background var(--b3-theme-surface)


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
    background var(--b3-theme-surface)  // 使用主题背景色
    color var(--b3-theme-on-surface)    // 使用主题文字色
    box-shadow 0 2px 8px rgba(0, 0, 0, 0.3)
    // 添加尺寸控制（与普通模式保持一致）
    line-height 1.2
    padding 6px 12px
    font-size 0.7rem

    &::after
      border-color var(--b3-theme-surface) transparent transparent transparent  // 三角颜色同步
      top -8px  // 保持位置一致
</style>
