/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

// 通用属性（所有组件均支持）
interface BaseProps {
  modelValue: string | number // 必须的v-model绑定
  disabled?: boolean // 禁用状态
  error?: boolean // 错误状态
  showCount?: boolean // 显示字数统计
}

// Input特殊属性
interface InputProps extends BaseProps {
  type?: "text" | "password" // 输入类型
  prefixIcon?: string // 前缀图标
  suffixIcon?: string // 后缀图标
}

// Textarea特殊属性
interface TextareaProps extends BaseProps {
  autoResize?: boolean // 自动调整高度
  rows?: number // 初始行数
}

interface Option {
  label: string
  value: any
}

type ControlType = "switch" | "input" | "select" | "number"
type InputType = "text" | "password" | "number" | "url"

interface SettingItem {
  type: ControlType
  label: string
  labelWidth?: "auto" | "full" | number
  value: any
  options?: Option[]
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  inputType?: inputType
}

interface SettingGroup {
  title: string
  items: SettingItem[]
}
