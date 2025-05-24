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
    <h2>标签页组件测试</h2>

    <div>
      <h3>基础标签页</h3>
      <div>
        <div>
          <button>标签页 1</button>
          <button>标签页 2</button>
          <button>标签页 3</button>
        </div>
        <div>
          <div>标签页 1 内容</div>
          <div>标签页 2 内容</div>
          <div>标签页 3 内容</div>
        </div>
      </div>
    </div>

    <div>
      <h3>禁用标签页</h3>
      <div>
        <div>
          <button>标签页 1</button>
          <button disabled>标签页 2</button>
          <button>标签页 3</button>
        </div>
        <div>
          <div>标签页 1 内容</div>
          <div>标签页 2 内容（禁用）</div>
          <div>标签页 3 内容</div>
        </div>
      </div>
    </div>

    <div>
      <h3>不同样式</h3>
      <div>
        <div>
          <button>默认样式</button>
          <button>卡片样式</button>
          <button>边框样式</button>
        </div>
        <div>
          <div>默认样式内容</div>
          <div>卡片样式内容</div>
          <div>边框样式内容</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 无需额外逻辑
</script>
