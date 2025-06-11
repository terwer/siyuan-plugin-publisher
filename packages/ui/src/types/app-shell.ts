/**
 * AppShell 导航项类型定义
 */
export interface AppShellNavItem {
  /** 导航项标签 */
  label: string
  /** 导航项路由 */
  route: string
  /** 导航项图标 */
  icon: string
  /** 导航项是否禁用（可选） */
  disabled?: boolean
}

/**
 * AppShell 组件 Props 类型定义
 */
export interface AppShellProps {
  /** 导航项列表 */
  navItems?: AppShellNavItem[]
  /** 是否折叠导航栏 */
  collapsed?: boolean
  /** 导航栏宽度（可选） */
  navWidth?: number
  /** 是否显示折叠按钮（可选） */
  showCollapseButton?: boolean
  /** 是否固定在顶部（可选） */
  fixed?: boolean
  /** 是否显示导航栏（可选） */
  showNav?: boolean
}

/**
 * AppShell 组件事件类型定义
 */
export interface AppShellEmits {
  /** 导航变更事件 */
  (e: "navChange", route: string): void
  /** 折叠状态变更事件 */
  (e: "collapseChange", collapsed: boolean): void
} 