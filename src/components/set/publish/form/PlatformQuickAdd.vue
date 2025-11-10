<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { DynamicConfig, PlatformType } from "~/src/platforms/dynamicConfig.ts"
import { useRoute, useRouter } from "vue-router"
import { onMounted, reactive, ref, watch } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { usePlatformDefine } from "~/src/composables/usePlatformDefine.ts"
import PageUtils from "~/common/pageUtils.ts"
import DrawerBoxBridge from "~/src/components/common/DrawerBoxBridge.vue"
import { appBase } from "~/src/utils/constants.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"

const logger = createAppLogger("platform-quick-add")

const props = defineProps({
  apiType: {
    type: String,
    default: "",
  },
})

// uses
const { t } = useVueI18n()
const router = useRouter()
const route = useRoute()
const { getPlatformType, getPrePlatformList, getAllPrePlatformList } = usePlatformDefine()

// vars
const params = reactive(route.params)
const type = ref((props.apiType ?? params.type) as PlatformType | "all")

const showDrawer = ref(false)
const drawerTitle = ref("")
const drawerSrc = ref("")

watch(
  () => props.apiType,
  (val: any) => {
    type.value = val

    initPage()
  }
)

// datas
const formData = reactive({
  platformGroup: {} as { type: string; title: string; img: string; description: string },
  pre: <DynamicConfig[]>[],
})

// methods
/**
 * 打开抽屉 - 通用
 *
 * @param title 标题
 * @param url 地址
 */
const goToDrawer = (title: string, url: string) => {
  drawerTitle.value = title
  drawerSrc.value = url
  showDrawer.value = true
}

/**
 * 打开抽屉 - 发布工具内部
 *
 * @param title 标题
 * @param pageUrl 内部地址，包括参数
 */
const goToPublisherDrawer = (title: string, pageUrl: string) => {
  const win = window as any
  const url = `${win.origin}${appBase}#${pageUrl}`
  logger.debug(`Publisher will go to ${url}`)

  goToDrawer(title, url)
}

const handleAddPlatform = (cfg?: DynamicConfig) => {
  // const query = {
  //   path: `/setting/platform/add/${cfg?.platformType}`,
  //   query: {
  //     showBack: "true",
  //     key: cfg?.platformKey,
  //     sub: cfg?.subPlatformType,
  //   },
  // }
  //
  // router.push(query)

  const platformGroup = cfg?.platformType ?? ""
  const platformKey = cfg?.platformKey ?? ""
  const subPlatformType = cfg?.subPlatformType ?? ""
  const url = `/setting/platform/add/${platformGroup}?showBack=trye&key=${platformKey}&sub=${subPlatformType}`
  const title = PageUtils.longPlatformName(cfg?.platformName ?? cfg?.platformType ?? "")
  goToPublisherDrawer(`添加 ${title} 平台`, url)
}

const initPage = () => {
  if (type.value === "all") {
    formData.platformGroup = { type: "all", title: "全部", img: "", description: "全部平台列表" }
    formData.pre = getAllPrePlatformList()
  } else {
    formData.platformGroup = getPlatformType(type.value)
    formData.pre = getPrePlatformList(type.value)
  }
}

// lifecycles
onMounted(() => {
  initPage()
})
</script>

<template>
  <div>
    <el-card class="platform-add-card">
      <div class="platform-title">{{ type === "all" ? "全部" : formData.platformGroup?.title ?? type }}</div>
      <div class="platform-desc">
        <div class="text-desc">{{ formData.platformGroup?.description ?? "" }}</div>
        <p>
          <el-alert class="desc-tip" type="info" title="点击图标快速添加，或者点击下方按钮自定义添加"></el-alert>
        </p>
      </div>
      <div class="icon-list">
        <div class="platform-box">
          <el-text
            class="define-item"
            v-for="preItem in formData.pre"
            @click="handleAddPlatform(preItem)"
            :title="preItem.platformName"
          >
            <i class="el-icon">
              <span v-html="preItem?.platformIcon"></span>
            </i>
            {{ PageUtils.shortPlatformName(preItem.platformName, 6) }}
          </el-text>
        </div>
      </div>
      <div class="add-action" v-if="type !== 'all'">
        <el-button type="primary" size="large" @click="handleAddPlatform({ platformType: type } as any)">
          添加自定义 {{ formData.platformGroup?.title ?? type }} 对接
        </el-button>
      </div>
    </el-card>

    <!-- 抽屉占位 -->
    <el-drawer v-model="showDrawer" size="85%" :title="drawerTitle" direction="rtl" :destroy-on-close="true">
      <DrawerBoxBridge :src="drawerSrc" />
    </el-drawer>
  </div>
</template>

<style scoped lang="stylus">
$icon_size = 32px
.platform-add-card
  margin-top 0
  height 100%

  .platform-title
    font-size 24px
    font-weight 600
    margin-bottom 12px

  .platform-desc
    font-size 14px
    margin-bottom 12px
    min-height 60px

  .icon-list
    // text-align center
    margin 10px 0
    margin-bottom 24px
    min-height 180px

    .platform-box
      // 子元素水平排列
      display flex
      // 开头对齐
      justify-content flex-start
      // 垂直居中对齐
      align-items center
      flex-wrap wrap

    .define-item
      // 让每个子元素占据24%的宽度，减去间距
      //width calc(24% - 10px)
      width calc(24% - 26px)
      color var(--el-color-primary)
      //color var(--el-button-bg-color)
      cursor pointer
      font-size $icon_size
      padding 10px
      border: 1px solid var(--el-card-border-color)
      border-radius var(--el-card-border-radius)
      margin: 8px 6px

      &:hover
        color var(--el-color-primary-light-3)

      :deep(.el-icon)
        //color var(--el-color-primary)
        width $icon_size
        height $icon_size
        margin-right -4px
        vertical-align middle

      :deep(.el-icon svg)
        width $icon_size
        height $icon_size

  .add-action
    text-align center

:deep(.el-drawer)
  --el-drawer-padding-primary var(--el-dialog-padding-primary, 0)

:deep(.el-drawer__header)
  padding: 20px
  margin-bottom 0
</style>
