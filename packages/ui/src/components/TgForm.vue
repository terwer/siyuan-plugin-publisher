<script setup lang="ts">
import { ref, computed, watch } from "vue"
import type { FormConfig, FormInstance, ValidationRule } from "@/types"
import TgInput from "./TgInput.vue"
import TgSelect from "./TgSelect.vue"
import TgSwitch from "./TgSwitch.vue"
import TgRadio from "./TgRadio.vue"
import TgCheckbox from "./TgCheckbox.vue"
import TgDatePicker from "./TgDatePicker.vue"

const props = defineProps<{
  config: FormConfig
  modelValue: Record<string, any>
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: Record<string, any>): void
  (e: "validate", errors: Record<string, string[]>): void
}>()

const formRef = ref<FormInstance>()

// 表单数据
const formData = ref<Record<string, any>>({})

// 错误信息
const errors = ref<Record<string, string[]>>({})

// 监听表单数据变化
watch(
  () => props.modelValue,
  (newVal) => {
    formData.value = { ...newVal }
  },
  { immediate: true, deep: true }
)

// 监听内部数据变化
watch(
  formData,
  (newVal) => {
    emit("update:modelValue", newVal)
  },
  { deep: true }
)

// 验证单个字段
const validateField = async (name: string, value: any, rules?: ValidationRule[]) => {
  if (!rules || rules.length === 0) return true

  const fieldErrors: string[] = []

  for (const rule of rules) {
    if (rule.required && !value) {
      fieldErrors.push(rule.message || "此字段为必填项")
      continue
    }

    if (value) {
      if (rule.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        fieldErrors.push(rule.message || "请输入正确的邮箱格式")
      }

      if (rule.min !== undefined && value.length < rule.min) {
        fieldErrors.push(rule.message || `长度不能小于 ${rule.min}`)
      }

      if (rule.max !== undefined && value.length > rule.max) {
        fieldErrors.push(rule.message || `长度不能大于 ${rule.max}`)
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        fieldErrors.push(rule.message || "格式不正确")
      }

      if (rule.validator) {
        try {
          const result = await rule.validator(value)
          if (!result) {
            fieldErrors.push(rule.message || "验证失败")
          }
        } catch (error) {
          fieldErrors.push(rule.message || "验证失败")
        }
      }
    }
  }

  if (fieldErrors.length > 0) {
    errors.value[name] = fieldErrors
    return false
  }

  delete errors.value[name]
  return true
}

// 验证整个表单
const validate = async () => {
  const validationPromises: Promise<boolean>[] = []
  const newErrors: Record<string, string[]> = {}

  props.config.groups.forEach((group) => {
    group.items.forEach((item) => {
      if (item.rules) {
        validationPromises.push(
          validateField(item.name, formData.value[item.name], item.rules).then((isValid) => {
            if (!isValid) {
              newErrors[item.name] = errors.value[item.name]
            }
            return isValid
          })
        )
      }
    })
  })

  const results = await Promise.all(validationPromises)
  const isValid = results.every((result) => result)

  errors.value = newErrors
  emit("validate", newErrors)

  return isValid
}

// 重置表单
const resetFields = () => {
  formData.value = {}
  errors.value = {}
}

// 暴露方法
defineExpose({
  validate,
  resetFields,
})

// 计算表单类名
const formClass = computed(() => {
  return {
    "tg-form": true,
    [`tg-form-${props.config.layout}`]: true,
  }
})

// 计算表单项样式
const getItemStyle = (item: any) => {
  const style: Record<string, string> = {}
  if (props.config.layout === "horizontal") {
    if (props.config.labelCol) {
      style["--tg-form-label-width"] = `${(props.config.labelCol.span / 24) * 100}%`
    }
    if (props.config.wrapperCol) {
      style["--tg-form-control-width"] = `${(props.config.wrapperCol.span / 24) * 100}%`
    }
  } else if (props.config.layout === "inline" && props.config.labelWidth) {
    style["--tg-form-label-width"] = typeof props.config.labelWidth === "number" 
      ? `${props.config.labelWidth}px` 
      : props.config.labelWidth
  }

  // 设置控件宽度，优先使用控件级别的配置，如果没有则使用表单级别的默认配置
  style["--tg-form-control-width"] = item.width || props.config.controlWidth || "200px"

  return style
}

// 获取表单项错误信息
const getItemError = (name: string) => {
  return errors.value[name]?.[0]
}
</script>

<template>
  <form ref="formRef" :class="formClass">
    <div v-for="(group, groupIndex) in config.groups" :key="groupIndex" class="tg-form-group">
      <div v-if="group.title" class="tg-form-group-title">{{ group.title }}</div>
      <div
        v-for="(item, itemIndex) in group.items"
        :key="itemIndex"
        class="tg-form-item"
        :class="{ 'tg-form-item-has-error': errors[item.name] }"
        :style="getItemStyle(item)"
      >
        <label
          v-if="item.label"
          class="tg-form-item-label"
          :class="{ 'tg-form-item-required': item.required }"
        >
          {{ item.label }}
        </label>
        <div class="tg-form-item-control">
          <div class="tg-form-item-control-input">
            <div class="tg-form-item-control-input-content">
              <!-- 输入框 -->
              <TgInput
                v-if="item.type === 'input'"
                v-model="formData[item.name]"
                v-bind="item.props || {}"
                :placeholder="item.placeholder"
                @blur="validateField(item.name, formData[item.name], item.rules)"
              />

              <!-- 文本域 -->
              <TgInput
                v-else-if="item.type === 'textarea'"
                v-model="formData[item.name]"
                type="textarea"
                v-bind="item.props || {}"
                :placeholder="item.placeholder"
                @blur="validateField(item.name, formData[item.name], item.rules)"
              />

              <!-- 选择器 -->
              <TgSelect
                v-else-if="item.type === 'select'"
                v-model="formData[item.name]"
                :options="item.options || []"
                v-bind="item.props || {}"
                :placeholder="item.placeholder"
                @change="validateField(item.name, formData[item.name], item.rules)"
              />

              <!-- 开关 -->
              <TgSwitch
                v-else-if="item.type === 'switch'"
                v-model="formData[item.name]"
                v-bind="item.props || {}"
                @change="validateField(item.name, formData[item.name], item.rules)"
              />

              <!-- 单选框 -->
              <TgRadio
                v-else-if="item.type === 'radio'"
                v-model="formData[item.name]"
                :options="item.options || []"
                v-bind="item.props || {}"
                @change="validateField(item.name, formData[item.name], item.rules)"
              />

              <!-- 复选框 -->
              <TgCheckbox
                v-else-if="item.type === 'checkbox'"
                v-model="formData[item.name]"
                :options="item.options || []"
                v-bind="item.props || {}"
                @change="validateField(item.name, formData[item.name], item.rules)"
              />

              <!-- 日期选择器 -->
              <TgDatePicker
                v-else-if="item.type === 'datePicker'"
                v-model="formData[item.name]"
                v-bind="item.props || {}"
                :placeholder="item.placeholder"
                @change="validateField(item.name, formData[item.name], item.rules)"
              />
            </div>
          </div>
          <div v-if="errors[item.name]" class="tg-form-item-explain">{{ getItemError(item.name) }}</div>
        </div>
      </div>
    </div>
  </form>
</template>