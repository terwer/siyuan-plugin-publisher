<script setup lang="ts">
import { ref } from "vue"
import TgForm from "@/components/TgForm.vue"

const formRef = ref()
const formData = ref({})

// 自定义校验函数示例
const validatePassword = (value: string) => {
  if (!value) return true
  // 密码必须包含大小写字母和数字
  const hasUpperCase = /[A-Z]/.test(value)
  const hasLowerCase = /[a-z]/.test(value)
  const hasNumber = /[0-9]/.test(value)
  return hasUpperCase && hasLowerCase && hasNumber
}

const validateConfirmPassword = (value: string) => {
  if (!value) return true
  return value === formData.value.password
}

const validateAge = (value: number) => {
  if (!value) return true
  return value >= 18 && value <= 100
}

const formConfig = {
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
            { required: true, message: "请输入用户名" },
            { min: 3, max: 20, message: "长度在 3 到 20 个字符" },
            { pattern: /^[a-zA-Z0-9_]+$/, message: "只能包含字母、数字和下划线" },
          ],
        },
        {
          name: "email",
          label: "邮箱",
          type: "input",
          required: true,
          placeholder: "请输入邮箱",
          rules: [
            { required: true, message: "请输入邮箱" },
            { type: "email", message: "请输入正确的邮箱格式" },
          ],
        },
        {
          name: "age",
          label: "年龄",
          type: "input",
          placeholder: "请输入年龄",
          props: { type: "number" },
          rules: [
            { type: "number", message: "请输入数字" },
            { validator: validateAge, message: "年龄必须在 18-100 岁之间" },
          ],
        },
      ],
    },
    {
      title: "安全设置",
      items: [
        {
          name: "password",
          label: "密码",
          type: "input",
          required: true,
          placeholder: "请输入密码",
          props: { type: "password" },
          rules: [
            { required: true, message: "请输入密码" },
            { min: 8, message: "密码长度不能小于 8 位" },
            { validator: validatePassword, message: "密码必须包含大小写字母和数字" },
          ],
        },
        {
          name: "confirmPassword",
          label: "确认密码",
          type: "input",
          required: true,
          placeholder: "请再次输入密码",
          props: { type: "password" },
          rules: [
            { required: true, message: "请确认密码" },
            { validator: validateConfirmPassword, message: "两次输入的密码不一致" },
          ],
        },
      ],
    },
    {
      title: "其他信息",
      items: [
        {
          name: "role",
          label: "角色",
          type: "select",
          required: true,
          placeholder: "请选择角色",
          options: [
            { label: "管理员", value: "admin" },
            { label: "普通用户", value: "user" },
            { label: "访客", value: "guest" },
          ],
          rules: [{ required: true, message: "请选择角色" }],
        },
        {
          name: "status",
          label: "状态",
          type: "switch",
          defaultValue: true,
        },
        {
          name: "type",
          label: "类型",
          type: "radio",
          required: true,
          options: [
            { label: "类型A", value: "A" },
            { label: "类型B", value: "B" },
            { label: "类型C", value: "C" },
          ],
          rules: [{ required: true, message: "请选择类型" }],
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
          rules: [{ validator: (value: string[]) => value.length <= 2, message: "最多选择 2 个标签" }],
        },
        {
          name: "description",
          label: "描述",
          type: "textarea",
          placeholder: "请输入描述信息",
          rules: [{ max: 200, message: "最多输入200个字符" }],
        },
        {
          name: "date",
          label: "日期",
          type: "datePicker",
          required: true,
          placeholder: "请选择日期",
          rules: [
            { required: true, message: "请选择日期" },
            {
              validator: (value: string) => {
                const date = new Date(value)
                const now = new Date()
                return date <= now
              },
              message: "不能选择未来日期",
            },
          ],
        },
      ],
    },
  ],
}

const handleSubmit = async () => {
  try {
    const values = await formRef.value.validate()
    console.log("表单数据：", values)
  } catch (error) {
    console.error("表单验证失败：", error)
  }
}

const handleReset = () => {
  formRef.value?.resetFields()
}
</script>

<template>
  <div class="tg-test-form">
    <div class="tg-test-header">
      <h2>表单组件测试</h2>
      <div class="tg-test-actions">
        <button class="tg-button tg-button-primary" @click="handleSubmit">提交</button>
        <button class="tg-button" @click="handleReset">重置</button>
      </div>
    </div>

    <div class="tg-test-content">
      <TgForm ref="formRef" :config="formConfig" v-model="formData" />
    </div>

    <div class="tg-test-footer">
      <h3>表单数据：</h3>
      <pre class="tg-test-code">{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.tg-test-form
  padding $tg-spacing-lg
  background-color var(--tg-color-bg-container)
  border-radius $tg-border-radius-lg
  box-shadow $tg-box-shadow

  .tg-test-header
    display flex
    justify-content space-between
    align-items center
    margin-bottom $tg-spacing-lg
    padding-bottom $tg-spacing-md
    border-bottom 1px solid var(--tg-color-border)

    h2
      margin 0
      font-size $tg-font-size-xl
      color var(--tg-color-text)
      font-weight 500

    .tg-test-actions
      display flex
      gap $tg-spacing-md

  .tg-test-content
    margin-bottom $tg-spacing-lg

  .tg-test-footer
    background-color var(--tg-color-bg-layout)
    padding $tg-spacing-md
    border-radius $tg-border-radius-base

    h3
      margin 0 0 $tg-spacing-sm
      font-size $tg-font-size-base
      color var(--tg-color-text)

    .tg-test-code
      margin 0
      font-family monospace
      font-size $tg-font-size-sm
      color var(--tg-color-text)
      white-space pre-wrap
      word-break break-all
</style>
