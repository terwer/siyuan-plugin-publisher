export interface SettingItem {
  type: "input" | "switch" | "select" | "number" | "textarea" | "group"
  label: string
  value?: any
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  labelWidth?: number
  inputType?: string
  options?: Array<{
    label: string
    value: any
  }>
  onChange?: (value: any) => void
  items?: SettingItem[]
}
