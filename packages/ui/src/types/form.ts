export interface ValidationRule {
  required?: boolean
  message?: string
  min?: number
  max?: number
  type?: "email" | "url" | "number"
  pattern?: RegExp
  validator?: (value: any) => boolean | Promise<boolean>
}

export interface FormItem {
  name: string
  label: string
  type: "input" | "select" | "radio" | "checkbox" | "switch" | "textarea" | "datePicker"
  required?: boolean
  rules?: ValidationRule[]
  options?: Array<{
    label: string
    value: any
  }>
  placeholder?: string
  disabled?: boolean
  defaultValue?: any
  props?: Record<string, any>
}

export interface FormGroup {
  title: string
  items: FormItem[]
}

export interface FormConfig {
  groups: FormGroup[]
  layout?: "horizontal" | "vertical" | "inline"
  labelCol?: { span: number }
  wrapperCol?: { span: number }
}

export interface FormInstance {
  validate: () => Promise<any>
  resetFields: () => void
  setFieldsValue: (values: Record<string, any>) => void
  getFieldsValue: () => Record<string, any>
}
