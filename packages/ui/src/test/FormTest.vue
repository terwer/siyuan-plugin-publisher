<script setup lang="ts">
import { ref, watch } from "vue"
import type { FormConfig, FormInstance } from "@/types"
import TgForm from "@/components/TgForm.vue"

// 水平布局表单
const horizontalFormRef = ref<FormInstance>()
const horizontalFormData = ref<Record<string, any>>({})
const horizontalFormErrors = ref<Record<string, string[]>>({})

// 垂直布局表单
const verticalFormRef = ref<FormInstance>()
const verticalFormData = ref<Record<string, any>>({})
const verticalFormErrors = ref<Record<string, string[]>>({})

// 行内布局表单
const inlineFormRef = ref<FormInstance>()
const inlineFormData = ref<Record<string, any>>({})
const inlineFormErrors = ref<Record<string, string[]>>({})

// 复杂表单
const complexFormRef = ref<FormInstance>()
const complexFormData = ref<Record<string, any>>({})
const complexFormErrors = ref<Record<string, string[]>>({})

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

// 行内布局表单配置
const inlineFormConfig: FormConfig = {
  layout: "inline",
  labelWidth: 80,
  controlWidth: "200px",
  groups: [
    {
      items: [
        {
          name: "username",
          label: "用户名",
          type: "input",
          width: "200px",
          placeholder: "请输入用户名",
        },
        {
          name: "email",
          label: "邮箱",
          type: "input",
          width: "200px",
          placeholder: "请输入邮箱",
        },
        {
          name: "status",
          label: "状态",
          type: "select",
          width: "120px",
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
      ],
    },
  ],
}

// 复杂表单配置
const complexFormConfig: FormConfig = {
  layout: "horizontal",
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  controlWidth: "200px",
  groups: [
    {
      title: "基础信息",
      items: [
        {
          name: "username",
          label: "用户名",
          type: "input",
          required: true,
          width: "600px",
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
          width: "600px",
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
        {
          name: "description",
          label: "描述",
          type: "textarea",
          width: "600px",
          placeholder: "请输入描述",
          rules: [
            {
              required: true,
              message: "请输入描述",
            },
          ],
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
          width: "300px",
          required: true,
          options: [
            { label: "启用", value: "active" },
            { label: "禁用", value: "inactive" },
          ],
          rules: [
            {
              required: true,
              message: "请选择状态",
            },
          ],
        },
        {
          name: "notify",
          label: "通知",
          type: "switch",
          required: true,
          rules: [
            {
              required: true,
              message: "请选择是否开启通知",
            },
          ],
        },
        {
          name: "type",
          label: "类型",
          type: "radio",
          width: "200px",
          required: true,
          options: [
            { label: "类型A", value: "A" },
            { label: "类型B", value: "B" },
          ],
          rules: [
            {
              required: true,
              message: "请选择类型",
            },
          ],
        },
        {
          name: "tags",
          label: "标签",
          type: "checkbox",
          width: "200px",
          required: true,
          options: [
            { label: "标签1", value: "tag1" },
            { label: "标签2", value: "tag2" },
            { label: "标签3", value: "tag3" },
          ],
          rules: [
            {
              required: true,
              message: "请选择至少一个标签",
            },
          ],
        },
        {
          name: "date",
          label: "日期",
          type: "datePicker",
          width: "200px",
          required: true,
          rules: [
            {
              required: true,
              message: "请选择日期",
            },
          ],
        },
      ],
    },
  ],
}

// 表单提交
const handleSubmit = async () => {
  try {
    const horizontalValid = await horizontalFormRef.value?.validate()
    const verticalValid = await verticalFormRef.value?.validate()
    const inlineValid = await inlineFormRef.value?.validate()
    const complexValid = await complexFormRef.value?.validate()

    if (horizontalValid && verticalValid && inlineValid && complexValid) {
      console.log("水平布局表单数据：", horizontalFormData.value)
      console.log("垂直布局表单数据：", verticalFormData.value)
      console.log("行内布局表单数据：", inlineFormData.value)
      console.log("复杂表单数据：", complexFormData.value)
    }
  } catch (error) {
    console.error("表单验证失败：", error)
  }
}

// 表单重置
const handleReset = () => {
  horizontalFormRef.value?.resetFields()
  verticalFormRef.value?.resetFields()
  inlineFormRef.value?.resetFields()
  complexFormRef.value?.resetFields()

  horizontalFormErrors.value = {}
  verticalFormErrors.value = {}
  inlineFormErrors.value = {}
  complexFormErrors.value = {}
}

// 监听表单数据变化
watch(
  [horizontalFormData, verticalFormData, inlineFormData, complexFormData],
  ([horizontal, vertical, inline, complex]) => {
    console.log("水平布局表单数据变化：", horizontal)
    console.log("垂直布局表单数据变化：", vertical)
    console.log("行内布局表单数据变化：", inline)
    console.log("复杂表单数据变化：", complex)
  },
  { deep: true },
)
</script>

<template>
  <div class="form-test">
    <div class="form-content">
      <h2>水平布局表单</h2>
      <TgForm
        ref="horizontalFormRef"
        v-model="horizontalFormData"
        :config="horizontalFormConfig"
        @validate="(errors) => (horizontalFormErrors = errors)"
      />

      <h2>垂直布局表单</h2>
      <TgForm
        ref="verticalFormRef"
        v-model="verticalFormData"
        :config="verticalFormConfig"
        @validate="(errors) => (verticalFormErrors = errors)"
      />

      <h2>行内布局表单</h2>
      <TgForm
        ref="inlineFormRef"
        v-model="inlineFormData"
        :config="inlineFormConfig"
        @validate="(errors) => (inlineFormErrors = errors)"
      />

      <h2>复杂表单</h2>
      <TgForm
        ref="complexFormRef"
        v-model="complexFormData"
        :config="complexFormConfig"
        @validate="(errors) => (complexFormErrors = errors)"
      />

      <div class="form-actions">
        <button @click="handleSubmit">提交</button>
        <button @click="handleReset">重置</button>
      </div>

      <div class="form-data-preview">
        <h2>表单数据预览</h2>
        <pre>{{
          JSON.stringify(
            {
              horizontal: horizontalFormData,
              vertical: verticalFormData,
              inline: inlineFormData,
              complex: complexFormData,
            },
            null,
            2,
          )
        }}</pre>
      </div>

      <div
        v-if="
          Object.keys(horizontalFormErrors).length > 0 ||
          Object.keys(verticalFormErrors).length > 0 ||
          Object.keys(inlineFormErrors).length > 0 ||
          Object.keys(complexFormErrors).length > 0
        "
        class="form-errors"
      >
        <h2>表单错误信息</h2>
        <pre>{{
          JSON.stringify(
            {
              horizontal: horizontalFormErrors,
              vertical: verticalFormErrors,
              inline: inlineFormErrors,
              complex: complexFormErrors,
            },
            null,
            2,
          )
        }}</pre>
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
