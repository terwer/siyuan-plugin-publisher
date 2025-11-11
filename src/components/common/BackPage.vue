<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
// uses
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useRoute, useRouter } from "vue-router"
import { ref, computed } from "vue"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { ArrowLeft, QuestionFilled } from "@element-plus/icons-vue"
import { help } from "~/src/platforms/help.ts"
import { StrUtil } from "zhi-common"

const logger = createAppLogger("back-page")
const { t } = useVueI18n()
const router = useRouter()
const route = useRoute()
const { query } = useRoute()

// props
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  hasBackEmit: {
    type: Boolean,
    default: false,
  },
  helpKey: {
    type: String,
    default: "",
  },
})

// datas
const showBack = ref(query.showBack === "true")

// emits
const emit = defineEmits(["backEmit"])

const onBack = () => {
  if (emit && props.hasBackEmit) {
    logger.info("using backEmit do back")
    emit("backEmit")
  } else {
    logger.warn("no backEmit, using router handle back")
    router.back()
  }
}

const onHelp = () => {
  const helpUrl = help[props.helpKey]
  if (!StrUtil.isEmptyString(helpUrl)) {
    window.open(helpUrl, "_blank")
  } else {
    const helpIndexUrl = "https://siyuan.wiki/s/20230810132040-nn4q7vs"
    window.open(helpIndexUrl, "_blank")
  }
}

const getTooltipContent = computed(() => {
  return t("common.help")
})
</script>

<template>
  <div id="page-body">
    <div v-if="showBack" class="page-head">
      <el-page-header :icon="ArrowLeft as any" title="返回" @click="onBack">
        <template #content>
          <div class="flex items-center">
            <span class="text-large font-600 mr-3">{{ props.title }}</span>
            <el-tooltip v-if="helpKey" effect="light" :content="getTooltipContent" placement="top">
              <el-button
                v-if="helpKey"
                :icon="QuestionFilled as any"
                circle
                size="small"
                type="info"
                class="ml-2 help-btn"
                @click.stop="onHelp"
              />
            </el-tooltip>
          </div>
        </template>
      </el-page-header>
    </div>
    <div class="page-content-box">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="stylus">
#page-body
  margin 10px 20px
.help-btn
  border none
  color var(--el-color-info-light-3)
  background-color transparent
  transition: all 0.3s var(--el-transition-function-ease-in-out-bezier)
  &:hover
    color var(--el-color-primary)
    background-color var(--el-color-primary-light-9)
    transform: scale(1.1)
</style>
