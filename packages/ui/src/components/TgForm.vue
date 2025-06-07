<script setup lang="ts">
import { ref, watch } from "vue"
import type { FormConfig, FormInstance } from "@/types"
import TgInput from "./TgInput.vue"
import TgSelect from "./TgSelect.vue"
import TgRadio from "./TgRadio.vue"
import TgCheckbox from "./TgCheckbox.vue"
import TgSwitch from "./TgSwitch.vue"
import TgDatePicker from "./TgDatePicker.vue"

const props = defineProps<{
  config: FormConfig
  modelValue: Record<string, any>
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: Record<string, any>): void
}>()

const formData = ref<Record<string, any>>({})
const errors = ref<Record<string, string>>({})

// 监听表单数据变化
watch(
  () => props.modelValue,
  (newVal) => {
    formData.value = { ...newVal }
  },
  { immediate: true, deep: true },
)

// 监听内部数据变化
watch(
  formData,
  (newVal) => {
    emit("update:modelValue", { ...newVal })
  },
  { deep: true },
)

// 验证单个字段
const validateField = (name: string) => {
  const item = props.config.groups.flatMap((group) => group.items).find((item) => item.name === name)

  if (!item?.rules) {
    errors.value[name] = ""
    return true
  }

  const value = formData.value[name]
  for (const rule of item.rules) {
    if (rule.required && !value) {
      errors.value[name] = rule.message || "此字段为必填项"
      return false
    }

    if (rule.min && value.length < rule.min) {
      errors.value[name] = rule.message || `最小长度为 ${rule.min}`
      return false
    }

    if (rule.max && value.length > rule.max) {
      errors.value[name] = rule.message || `最大长度为 ${rule.max}`
      return false
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      errors.value[name] = rule.message || "格式不正确"
      return false
    }

    if (rule.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.value[name] = rule.message || "请输入有效的邮箱地址"
      return false
    }

    if (rule.type === "number" && isNaN(Number(value))) {
      errors.value[name] = rule.message || "请输入数字"
      return false
    }

    if (rule.validator && !rule.validator(value)) {
      errors.value[name] = rule.message || "验证失败"
      return false
    }
  }

  errors.value[name] = ""
  return true
}

// 验证整个表单
const validate = async () => {
  const items = props.config.groups.flatMap((group) => group.items)
  const results = await Promise.all(items.map((item) => validateField(item.name)))
  return results.every(Boolean) ? formData.value : Promise.reject(errors.value)
}

// 重置表单
const resetFields = () => {
  formData.value = {}
  errors.value = {}
}

// 设置表单值
const setFieldsValue = (values: Record<string, any>) => {
  formData.value = { ...formData.value, ...values }
}

// 获取表单值
const getFieldsValue = () => {
  return { ...formData.value }
}

// 暴露方法
defineExpose<FormInstance>({
  validate,
  resetFields,
  setFieldsValue,
  getFieldsValue,
})
</script>

<template>
  <form class="tg-form" :class="config.layout">
    <div v-for="group in config.groups" :key="group.title" class="tg-form-group">
      <div v-if="group.title" class="tg-form-group-title">{{ group.title }}</div>
      <div class="tg-form-group-content">
        <div
          v-for="item in group.items"
          :key="item.name"
          class="tg-form-item"
          :class="{ 'tg-form-item--error': errors[item.name] }"
        >
          <div
            class="tg-form-item-label"
            :style="{ width: config.labelCol?.span ? `${config.labelCol.span * 4}%` : '25%' }"
          >
            {{ item.label }}
            <span v-if="item.required" class="tg-form-item-required">*</span>
          </div>
          <div
            class="tg-form-item-control"
            :style="{ width: config.wrapperCol?.span ? `${config.wrapperCol.span * 4}%` : '75%' }"
          >
            <!-- 输入框 -->
            <TgInput
              v-if="item.type === 'input'"
              v-model="formData[item.name]"
              :type="item.props?.type || 'text'"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :status="errors[item.name] ? 'error' : undefined"
            />

            <!-- 下拉选择框 -->
            <TgSelect
              v-else-if="item.type === 'select'"
              v-model="formData[item.name]"
              :options="item.options || []"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :status="errors[item.name] ? 'error' : undefined"
            />

            <!-- 单选框组 -->
            <TgRadio
              v-else-if="item.type === 'radio'"
              v-model="formData[item.name]"
              :options="item.options || []"
              :disabled="item.disabled"
            />

            <!-- 复选框组 -->
            <TgCheckbox
              v-else-if="item.type === 'checkbox'"
              v-model="formData[item.name]"
              :options="item.options || []"
              :disabled="item.disabled"
            />

            <!-- 开关 -->
            <TgSwitch
              v-else-if="item.type === 'switch'"
              v-model="formData[item.name]"
              :disabled="item.disabled"
            />

            <!-- 文本域 -->
            <TgInput
              v-else-if="item.type === 'textarea'"
              v-model="formData[item.name]"
              type="textarea"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :status="errors[item.name] ? 'error' : undefined"
            />

            <!-- 日期选择器 -->
            <TgDatePicker
              v-else-if="item.type === 'datePicker'"
              v-model="formData[item.name]"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :status="errors[item.name] ? 'error' : undefined"
            />

            <!-- 错误提示 -->
            <div v-if="errors[item.name]" class="tg-form-item-error">
              {{ errors[item.name] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>