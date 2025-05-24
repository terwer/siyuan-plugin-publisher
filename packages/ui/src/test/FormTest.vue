<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div>
    <h2>表单组件测试</h2>

    <div>
      <h3>基础表单</h3>
      <form>
        <div>
          <label>用户名</label>
          <input type="text" placeholder="请输入用户名" />
        </div>
        <div>
          <label>密码</label>
          <input type="password" placeholder="请输入密码" />
        </div>
        <div>
          <label>邮箱</label>
          <input type="email" placeholder="请输入邮箱" />
        </div>
        <div>
          <label>描述</label>
          <textarea placeholder="请输入描述"></textarea>
        </div>
      </form>
    </div>

    <div>
      <h3>表单验证</h3>
      <form>
        <div>
          <label>必填项</label>
          <input type="text" required placeholder="此项必填" />
        </div>
        <div>
          <label>邮箱验证</label>
          <input type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" placeholder="请输入有效的邮箱地址" />
        </div>
      </form>
    </div>

    <div>
      <h3>禁用状态</h3>
      <form>
        <div>
          <label>禁用输入框</label>
          <input type="text" disabled value="禁用状态" />
        </div>
        <div>
          <label>禁用文本域</label>
          <textarea disabled>禁用状态</textarea>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// 无需额外逻辑
</script>
