export interface ValidationRule {
  required?: boolean
  message?: string
  min?: number
  max?: number
  pattern?: RegExp
  type?: string
  validator?: (value: any) => boolean | Promise<boolean>
}

export interface Option {
  label: string
  value: any
}

export interface FormItem {
  name: string
  label: string
  type: "input" | "textarea" | "select" | "switch" | "radio" | "checkbox" | "datePicker"
  required?: boolean
  placeholder?: string
  options?: Option[]
  props?: Record<string, any>
  rules?: ValidationRule[]
  error?: string
  width?: number | string
}

export interface FormGroup {
  title?: string
  items: FormItem[]
}

export interface FormConfig {
  layout: "horizontal" | "vertical" | "inline"
  labelCol?: { span: number }
  wrapperCol?: { span: number }
  labelWidth?: number | string
  controlWidth?: string
  groups: FormGroup[]
}

export interface FormInstance {
  validate: () => Promise<Record<string, any>>
  resetFields: () => void
}
