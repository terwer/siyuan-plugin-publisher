<template>
  <div class="header-default">
    <el-header>
      <h1 class="header-title-default">
        <el-button class="header-title-btn disabled-click">
          思源笔记发布工具
        </el-button>
      </h1>
    </el-header>
  </div>
</template>

<style scoped>
.header-default {
}

.header-title-default {
  text-align: center;
  margin: 0;
}
.header-title-default .header-title-btn {
  border: none;
  font-size: 32px;
  cursor: default;
}
.header-title-default .header-title-btn:hover {
  background: none;
  color: var(--el-button-text-color);
}
</style>
