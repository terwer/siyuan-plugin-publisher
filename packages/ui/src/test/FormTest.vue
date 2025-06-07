<script setup lang="ts">
import { ref, watch } from "vue"
import type { FormConfig, FormInstance } from "@/types"
import TgForm from "@/components/TgForm.vue"

// 表单引用
const formRef = ref<FormInstance>()

// 基础表单数据
const formData = ref<Record<string, any>>({})

// 表单错误信息
const formErrors = ref<Record<string, string[]>>({})

// 水平布局表单配置
const horizontalFormConfig: FormConfig = {
  layout: "horizontal",
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  groups: [
    {
      title: "基础信息",
      items: [
        {
          name: "username",
          label: "用户名",
          type: "input",
          required: true,
          placeholder: "请输入用户名",
          rules: [
            {
              required: true,
              message: "请输入用户名",
            },
          ],
        },
        {
          name: "email",
          label: "邮箱",
          type: "input",
          required: true,
          placeholder: "请输入邮箱",
          rules: [
            {
              required: true,
              message: "请输入邮箱",
            },
            {
              type: "email",
              message: "请输入正确的邮箱格式",
            },
          ],
        },
      ],
    },
  ],
}

// 垂直布局表单配置
const verticalFormConfig: FormConfig = {
  layout: "vertical",
  groups: [
    {
      title: "垂直布局",
      items: [
        {
          name: "username",
          label: "用户名",
          type: "input",
          required: true,
          placeholder: "请输入用户名",
        },
        {
          name: "email",
          label: "邮箱",
          type: "input",
          required: true,
          placeholder: "请输入邮箱",
        },
      ],
    },
  ],
}

// 行内布局表单配置
const inlineFormConfig: FormConfig = {
  layout: "inline",
  groups: [
    {
      items: [
        {
          name: "username",
          label: "用户名",
          type: "input",
          placeholder: "请输入用户名",
        },
        {
          name: "email",
          label: "邮箱",
          type: "input",
          placeholder: "请输入邮箱",
        },
        {
          name: "status",
          label: "状态",
          type: "select",
          options: [
            { label: "启用", value: "active" },
            { label: "禁用", value: "inactive" },
          ],
        },
      ],
    },
  ],
}

// 复杂表单配置
const complexFormConfig: FormConfig = {
  layout: "horizontal",
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  groups: [
    {
      title: "基础信息",
      items: [
        {
          name: "username",
          label: "用户名",
          type: "input",
          required: true,
          placeholder: "请输入用户名",
        },
        {
          name: "email",
          label: "邮箱",
          type: "input",
          required: true,
          placeholder: "请输入邮箱",
        },
        {
          name: "description",
          label: "描述",
          type: "textarea",
          placeholder: "请输入描述",
        },
      ],
    },
    {
      title: "高级设置",
      items: [
        {
          name: "status",
          label: "状态",
          type: "select",
          options: [
            { label: "启用", value: "active" },
            { label: "禁用", value: "inactive" },
          ],
        },
        {
          name: "notify",
          label: "通知",
          type: "switch",
        },
        {
          name: "type",
          label: "类型",
          type: "radio",
          options: [
            { label: "类型A", value: "A" },
            { label: "类型B", value: "B" },
          ],
        },
        {
          name: "tags",
          label: "标签",
          type: "checkbox",
          options: [
            { label: "标签1", value: "tag1" },
            { label: "标签2", value: "tag2" },
            { label: "标签3", value: "tag3" },
          ],
        },
        {
          name: "date",
          label: "日期",
          type: "datePicker",
        },
      ],
    },
  ],
}

// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const isValid = await formRef.value.validate()
    if (isValid) {
      console.log("表单数据：", formData.value)
      // 这里可以添加提交成功的处理逻辑
    }
  } catch (error) {
    console.error("表单验证失败：", error)
    formErrors.value = error as Record<string, string[]>
  }
}

// 表单重置
const handleReset = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  formErrors.value = {}
}

// 监听表单数据变化
watch(
  formData,
  (newVal) => {
    console.log("表单数据变化：", newVal)
  },
  { deep: true },
)
</script>

<template>
  <div class="form-test">
    <div class="form-content">
      <h2>水平布局表单</h2>
      <TgForm
        ref="formRef"
        v-model="formData"
        :config="horizontalFormConfig"
        @validate="(errors) => (formErrors = errors)"
      />

      <h2>垂直布局表单</h2>
      <TgForm v-model="formData" :config="verticalFormConfig" @validate="(errors) => (formErrors = errors)" />

      <h2>行内布局表单</h2>
      <TgForm v-model="formData" :config="inlineFormConfig" @validate="(errors) => (formErrors = errors)" />

      <h2>复杂表单</h2>
      <TgForm v-model="formData" :config="complexFormConfig" @validate="(errors) => (formErrors = errors)" />

      <div class="form-actions">
        <button @click="handleSubmit">提交</button>
        <button @click="handleReset">重置</button>
      </div>

      <div class="form-data-preview">
        <h2>表单数据预览</h2>
        <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
      </div>

      <div v-if="Object.keys(formErrors).length > 0" class="form-errors">
        <h2>表单错误信息</h2>
        <pre>{{ JSON.stringify(formErrors, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
.form-test
  padding 20px

  .form-content
    max-width 800px
    margin 0 auto

  .form-data-preview,
  .form-errors
    margin-top 40px
    padding 20px
    background var(--tg-color-bg-secondary)
    border-radius 8px
    border 1px solid var(--tg-color-border)

    h2
      margin 0 0 16px
      font-size 16px
      color var(--tg-color-text)

    pre
      margin 0
      padding 16px
      background var(--tg-color-bg)
      border-radius 4px
      border 1px solid var(--tg-color-border)
      font-size 14px
      line-height 1.5
      color var(--tg-color-text)
      white-space pre-wrap
      word-break break-all
      max-height 300px
      overflow-y auto

  .form-errors
    border-color var(--tg-color-error)
    background var(--tg-color-error-bg)

    h2
      color var(--tg-color-error)

    pre
      color var(--tg-color-error)

  h2
    margin 20px 0
    font-size 18px
    color var(--tg-color-text)

  .form-actions
    margin-top 20px
    display flex
    gap 10px

    button
      padding 8px 16px
      border-radius 4px
      border 1px solid var(--tg-color-border)
      background var(--tg-color-bg)
      color var(--tg-color-text)
      cursor pointer

      &:hover
        background var(--tg-color-bg-hover)
</style>
