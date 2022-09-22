<template>
  <div>
    <div class="footer"> &copy;2011-2022 sy-post-publisher v0.0.3
      . <span class="s-dark" @click="toggleDark()">{{ isDark ? $t('theme.mode.light') : $t('theme.mode.dark') }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useDark, useToggle} from "@vueuse/core";

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<script lang="ts">
export default {
  name: "DefaultFooter"
}
</script>

<style scoped>
.footer {
  font-size: 12px;
  color: #bbb;
  text-align: center;
}

.s-dark{
  color: var(--el-color-primary);
  cursor: pointer;
}
</style>