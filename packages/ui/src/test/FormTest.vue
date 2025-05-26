<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="form-test-container">
    <h2>表单组件测试</h2>

    <div class="test-section">
      <h3>基础输入框</h3>
      <div class="form-group">
        <FormItem label="用户名">
          <Input v-model="formData.username" placeholder="请输入用户名" />
        </FormItem>
        <FormItem label="密码">
          <Input v-model="formData.password" type="password" placeholder="请输入密码" />
        </FormItem>
      </div>
    </div>

    <div class="test-section">
      <h3>带验证的输入框</h3>
      <div class="form-group">
        <FormItem label="邮箱" required>
          <Input v-model="formData.email" placeholder="请输入邮箱" :error="!!emailError" />
          <FormMessage v-if="emailError">{{ emailError }}</FormMessage>
        </FormItem>
        <FormItem label="手机号" required>
          <Input v-model="formData.phone" placeholder="请输入手机号" :error="!!phoneError" />
          <FormMessage v-if="phoneError">{{ phoneError }}</FormMessage>
        </FormItem>
      </div>
    </div>

    <div class="test-section">
      <h3>数字输入框</h3>
      <div class="form-group">
        <FormItem label="数量">
          <InputNumber v-model="formData.quantity" :min="0" :max="100" :step="1" />
        </FormItem>
        <FormItem label="价格">
          <InputNumber v-model="formData.price" :min="0" :step="0.01" />
        </FormItem>
      </div>
    </div>

    <div class="test-section">
      <h3>文本域</h3>
      <div class="form-group">
        <FormItem label="描述">
          <TextArea v-model="formData.description" placeholder="请输入描述" :rows="4" />
        </FormItem>
        <FormItem label="备注">
          <TextArea v-model="formData.remark" placeholder="请输入备注" :rows="2" showCount :maxlength="100" />
        </FormItem>
      </div>
    </div>

    <div class="test-section">
      <h3>选择器</h3>
      <div class="form-group">
        <FormItem label="城市">
          <Select v-model="formData.city" :options="cityOptions" placeholder="请选择城市" />
        </FormItem>
        <FormItem label="爱好">
          <Select v-model="formData.hobbies" :options="hobbyOptions" multiple placeholder="请选择爱好" />
        </FormItem>
      </div>
    </div>

    <div class="test-section">
      <h3>开关</h3>
      <div class="form-group">
        <FormItem label="自动保存">
          <Switch v-model="formData.autoSave" />
        </FormItem>
        <FormItem label="接收通知">
          <Switch v-model="formData.notifications" />
        </FormItem>
      </div>
    </div>

    <div class="test-section">
      <h3>表单布局</h3>
      <div class="form-group">
        <Form layout="horizontal" :labelWidth="120">
          <FormItem label="用户名">
            <Input v-model="formData.username" placeholder="请输入用户名" />
          </FormItem>
          <FormItem label="密码">
            <Input v-model="formData.password" type="password" placeholder="请输入密码" />
          </FormItem>
        </Form>
      </div>
      <div class="form-group">
        <Form layout="vertical">
          <FormItem label="用户名">
            <Input v-model="formData.username" placeholder="请输入用户名" />
          </FormItem>
          <FormItem label="密码">
            <Input v-model="formData.password" type="password" placeholder="请输入密码" />
          </FormItem>
        </Form>
      </div>
      <div class="form-group">
        <Form layout="inline">
          <FormItem label="用户名">
            <Input v-model="formData.username" placeholder="请输入用户名" />
          </FormItem>
          <FormItem label="密码">
            <Input v-model="formData.password" type="password" placeholder="请输入密码" />
          </FormItem>
        </Form>
      </div>
    </div>

    <div class="test-section">
      <h3>表单数据</h3>
      <div class="form-data">
        <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue"
  import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    Input,
    InputNumber,
    Select,
    Switch,
    TextArea
  } from "../components/form"

  const formData = ref({
    username: "",
    password: "",
    email: "",
    phone: "",
    quantity: 0,
    price: 0,
    description: "",
    remark: "",
    city: "",
    hobbies: [],
    autoSave: false,
    notifications: true
  })

  const cityOptions = [
    { label: "北京", value: "beijing" },
    { label: "上海", value: "shanghai" },
    { label: "广州", value: "guangzhou" },
    { label: "深圳", value: "shenzhen" }
  ]

  const hobbyOptions = [
    { label: "阅读", value: "reading" },
    { label: "音乐", value: "music" },
    { label: "运动", value: "sports" },
    { label: "旅行", value: "travel" }
  ]

  const emailError = computed(() => {
    if (!formData.value.email) return "请输入邮箱"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) return "请输入有效的邮箱地址"
    return ""
  })

  const phoneError = computed(() => {
    if (!formData.value.phone) return "请输入手机号"
    if (!/^1[3-9]\d{9}$/.test(formData.value.phone)) return "请输入有效的手机号"
    return ""
  })
</script>

<style lang="stylus" scoped>
  .form-test-container
    padding: 20px
    max-width: 1200px
    margin: 0 auto

  .test-section
    margin-bottom: 40px
    padding: 20px
    border: 1px solid #eee
    border-radius: 8px
    background-color: #fff

    h3
      margin-bottom: 15px
      color: #333
      font-size: 18px

  .form-group
    display: flex
    flex-direction: column
    gap: 20px

  .form-data
    background-color: #f5f5f5
    padding: 15px
    border-radius: 4px
    overflow-x: auto

    pre
      margin: 0
      font-family: monospace
      font-size: 14px
      line-height: 1.5
      color: #666
</style>
