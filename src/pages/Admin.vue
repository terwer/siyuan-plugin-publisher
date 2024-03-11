<!--
  - Copyright (c) 2024, Terwer . All rights reserved.
  - DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
  -
  - This code is free software; you can redistribute it and/or modify it
  - under the terms of the GNU General Public License version 2 only, as
  - published by the Free Software Foundation.  Terwer designates this
  - particular file as subject to the "Classpath" exception as provided
  - by Terwer in the LICENSE file that accompanied this code.
  -
  - This code is distributed in the hope that it will be useful, but WITHOUT
  - ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
  - FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
  - version 2 for more details (a copy is included in the LICENSE file that
  - accompanied this code).
  -
  - You should have received a copy of the GNU General Public License version
  - 2 along with this work; if not, write to the Free Software Foundation,
  - Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
  -
  - Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
  - or visit www.terwer.space if you need additional information or have any
  - questions.
  -->

<script setup lang="ts">
import { onBeforeMount, ref } from "vue"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { ElMessage } from "element-plus"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { getSiyuanPageId } from "~/src/utils/siyuanUtils.ts"
import { DateUtil, HtmlUtil, JsonUtil, StrUtil } from "zhi-common"
import { LuteUtil } from "~/src/utils/luteUtil.ts"
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"
import { appBase, DYNAMIC_CONFIG_KEY, MAX_TITLE_LENGTH } from "~/src/utils/constants.ts"
import MaterialSymbolsDriveFolderUpload from "~icons/material-symbols/drive-folder-upload"
import Fa6SolidBookOpenReader from "~icons/fa6-solid/book-open-reader"
import MaterialSymbolsAddPhotoAlternateOutline from "~icons/material-symbols/add-photo-alternate-outline"
import MaterialSymbolsRocketLaunch from "~icons/material-symbols/rocket-launch"
import MdiMinusBoxMultipleOutline from "~icons/mdi/minus-box-multiple-outline"
import { Utils } from "~/src/utils/utils.ts"
import { useRouter } from "vue-router"
import { PluginUtils } from "~/src/utils/pluginUtils.ts"
import { useSiyuanSettingStore } from "~/src/stores/useSiyuanSettingStore.ts"
import { DynamicJsonCfg, getDynCfgByKey } from "~/src/platforms/dynamicConfig.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import DrawerBoxBridge from "~/src/components/common/DrawerBoxBridge.vue"
import { svgIcons } from "~/src/utils/svgIcons.ts"

// uses
const { t } = useVueI18n()
const { kernelApi, blogApi } = useSiyuanApi()
const { isInSiyuanWidget, isInSiyuanOrSiyuanNewWin } = useSiyuanDevice()
const router = useRouter()
const { getReadOnlyPublishPreferenceSetting } = usePreferenceSettingStore()
const { getReadOnlySiyuanSetting } = useSiyuanSettingStore()
const { getSetting } = usePublishSettingStore()

// vars
const logger = createAppLogger("admin")
const isDataBoxLoading = ref(false)
const dataLayout = ref("prev,pager,next")

const state = ref("")
const links = ref([])
const showPublished = ref(false)

const tableData = []
const MAX_PAGE_SIZE = 8
const num = ref(0)
const total = ref(0)
const currentPage = ref(1)

const isPicgoInstalled = ref(false)
const isBlogInstalled = ref(false)
const dynamicConfigArray = ref([])
const siyuanSetting = getReadOnlySiyuanSetting()

const showDrawer = ref(false)
const drawerTitle = ref("")
const drawerSrc = ref("")

// methods
const querySearch = (queryString: string, cb: any) => {
  const results = queryString ? links.value.filter(createFilter(queryString)) : links.value
  cb(results)
}
const createFilter = (queryString: string) => {
  return (value: any) => {
    return value.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}

const handleSelect = (item: any) => {}

const handleBtnSearch = () => {
  reloadTableData()
}

const onIsPublishedChange = (val: boolean) => {
  reloadTableData()
}

const handlePrevPage = async (curPage: number) => {
  currentPage.value = curPage
  await reloadTableData()
}
const handleNextPage = async (curPage: number) => {
  currentPage.value = curPage
  await reloadTableData()
}
const handleCurrentPage = async (curPage: number) => {
  currentPage.value = curPage
  await reloadTableData()
}

// =====================================================================================================================
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

/**
 * 打开抽屉 - 在线分享内部
 *
 * @param title 标题
 * @param pageUrl 内部地址，包括参数
 */
const goToBlogDrawer = (title: string, pageUrl: string) => {
  const url = `${siyuanSetting.value.apiUrl}/plugins/siyuan-blog/#${pageUrl}`
  logger.debug(`Blog will go to ${url}`)

  goToDrawer(title, url)
}

/**
 * 打开抽屉 - Picgo 内部
 *
 * @param title 标题
 * @param pageUrl 内部地址，包括参数
 */
const goToPicgoDrawer = (title: string, pageUrl: string) => {
  const url = `${siyuanSetting.value.apiUrl}/plugins/siyuan-plugin-picgo/#${pageUrl}`
  logger.debug(`Picgo will go to ${url}`)

  goToDrawer(title, url)
}
const goToPicgoNewWin = (pageUrl: string) => {
  const url = `${siyuanSetting.value.apiUrl}/plugins/siyuan-plugin-picgo/#${pageUrl}`
  logger.debug(`Picgo will go to ${url}`)

  const win = window as any
  win.open(url)
}
// =====================================================================================================================
// 单个平台选择平台，然后极速发布
const handleQuick = (_index: number, row: any) => {
  const pageId = row.postid
  goToPublisherDrawer("极速发布", `/publish/quickSelect?id=${pageId}`)
}

// 单个平台选择平台，然后常规发布
const handleEdit = (index: number, row: any) => {
  const pageId = row.postid
  goToPublisherDrawer("单个发布", `/publish/singlePublish?id=${pageId}`)
}

// 单个平台常规发布
const goToSingleEdit = async (key: string, row: any) => {
  const pageId = row.postid
  goToPublisherDrawer("常规发布", `/publish/singlePublish/doPublish/${key}/${pageId}?method=edit`)
}

// 批量发布
const handleBatch = (_index: number, row: any) => {
  const pageId = row.postid
  goToPublisherDrawer("批量发布", `/publish/batchPublish?id=${pageId}`)
}

// 文章预览 - 在线分享
const handleView = (_index: number, row: any) => {
  const win = window as any

  const pageId = row.postid
  let isShared = row.isShared
  if (!isShared) {
    ElMessage.warning(t("message.publish.notShared"))
    win.event.stopPropagation()
    return
  }
  goToBlogDrawer("文章预览", `/post/${pageId}`)
}

// Picgo- 图床
const handlePicgo = (index: number, row: any) => {
  const pageId = row.postid
  if (isInSiyuanOrSiyuanNewWin()) {
    goToPicgoDrawer("图床", `/?pageId=${pageId}`)
  } else {
    goToPicgoNewWin(`/?pageId=${pageId}`)
  }
}

const handleRowClick = async (row: any, column: any, event: any) => {
  // handleEdit(column.index, row)
}
// =====================================================================================================================
const reloadTableData = async () => {
  isDataBoxLoading.value = true

  let postCount = 1
  let postList = []
  let hasSubdoc = false

  try {
    const pageId = await getSiyuanPageId()
    // 挂件里面才展示子文档
    if (isInSiyuanWidget() && !StrUtil.isEmptyString(pageId)) {
      // 检测子文档
      postCount = await kernelApi.getSubdocCount(pageId, showPublished.value)
      if (postCount > 1) {
        hasSubdoc = true
      }

      if (hasSubdoc) {
        const subdocInfoList = await kernelApi.getSubdocs(
          pageId,
          currentPage.value - 1,
          MAX_PAGE_SIZE,
          state.value,
          showPublished.value
        )
        for (let i = 0; i < subdocInfoList.length; i++) {
          const subdocInfo = subdocInfoList[i]
          const postId = subdocInfo.root_id
          const post = await blogApi.getPost(postId)
          postList.push(post)
        }
        logger.info("挂件模式，有子文档，展示子文档")
      } else {
        logger.info("挂件模式，没有子文档，直接显示发布页面")
        await router.push({
          path: "/publish/singlePublish",
          query: {
            id: pageId,
          },
        })
      }
    } else {
      postCount = await blogApi.getRecentPostsCount(state.value, showPublished.value)
      postList = await blogApi.getRecentPosts(MAX_PAGE_SIZE, currentPage.value - 1, state.value, showPublished.value)
      logger.info("无法获取页面ID，可能是浏览器环境或者浏览器插件展示文档列表")
    }
    logger.debug("postList=>", postList)

    // =======================================================================

    // 总数
    total.value = postCount

    // 渲染table
    tableData.splice(0, tableData.length)
    for (let i = 0; i < postList.length; i++) {
      const item = postList[i]

      let title = item.title
      const pref = getReadOnlyPublishPreferenceSetting()
      if (pref.value.fixTitle) {
        title = HtmlUtil.removeTitleNumber(title).replace(/\.md/g, "")
      }
      const shortTitle = StrUtil.getByLength(title, MAX_TITLE_LENGTH, false)
      const content = LuteUtil.mdToHtml(item.description)
      const shortDesc = item?.shortDesc
      const attrs = JsonUtil.safeParse(item.attrs, {})
      const isPublished = attrs["custom-publish-status"] === "publish"
      const isExpired = attrs["custom-expires"] && attrs["custom-expires"] - Date.now() < 0
      const pageAttrs = await kernelApi.getBlockAttrs(item.postid)
      const yamlAttrs = {}
      const dynCfgs = {}
      for (let key in pageAttrs) {
        if (!key.startsWith("custom-")) {
          continue
        }
        if (!key.endsWith("-yaml")) {
          continue
        }
        const newKey = key.replace("-yaml", "").replace("custom-", "").replace("-", "_")
        yamlAttrs[newKey] = pageAttrs[key]
        dynCfgs[newKey] = getDynCfgByKey(dynamicConfigArray.value, newKey)
      }
      // logger.debug("yamlAttrs=>", yamlAttrs)
      // logger.debug("dynCfgs=>", dynCfgs)

      const tableRow = {
        postid: item.postid,
        title,
        shortTitle,
        dateCreated: DateUtil.formatIsoToZhDate(item.dateCreated.toISOString(), true),
        mt_keywords: item.mt_keywords,
        description: Utils.emptyOrDefault(content, "暂无内容"),
        shortDesc: Utils.emptyOrDefault(shortDesc, "暂无内容"),
        isShared: isPublished && !isExpired,
        yamlCount: Object.keys(yamlAttrs).length,
        yamlAttrs: yamlAttrs,
        dynCfgs: dynCfgs,
      }
      tableData.push(tableRow)
    }
  } catch (e) {
    logger.error(t("main.opt.failure") + "=>", e)
    ElMessage.error(t("main.opt.failure") + "=>" + e)
  } finally {
    isDataBoxLoading.value = false
  }

  // table的key改变才会刷新
  num.value++
}
// =====================================================================================================================

const initPage = async () => {
  isPicgoInstalled.value = await PluginUtils.preCheckPicgoPlugin()
  isBlogInstalled.value = await PluginUtils.preCheckBlogPlugin()

  const setting = await getSetting()
  const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
  dynamicConfigArray.value = dynJsonCfg?.totalCfg || []

  await reloadTableData()
  logger.debug("Post init page=>", tableData)
}

onBeforeMount(async () => {
  await initPage()
})
</script>

<template>
  <div class="admin-box">
    <!-- 文章列表 -->
    <div id="post-list">
      <!-- 搜索 -->
      <div class="search-btn">
        <el-autocomplete
          class="s-input"
          v-model="state"
          :fetch-suggestions="querySearch"
          popper-class="my-autocomplete"
          placeholder="请输入关键字"
          @change="handleBtnSearch"
          @select="handleSelect"
        >
          <template #default="{ item }">
            <div class="value">{{ item.value }}</div>
          </template>
        </el-autocomplete>
        <el-button class="s-btn" type="primary" @click="handleBtnSearch">搜索</el-button>
        <el-checkbox
          class="s-filter-item s-filter-published"
          size="large"
          v-model="showPublished"
          @change="onIsPublishedChange"
          >已发布
        </el-checkbox>
      </div>

      <!-- 表格数据展示 -->
      <div class="data-empty-box" v-if="isDataBoxLoading">
        <el-skeleton :loading="isDataBoxLoading" :rows="5" animated />
      </div>
      <div class="data-box" v-else>
        <el-table
          class="tb-data"
          :data="tableData"
          :key="num"
          border
          stripe
          highlight-current-row
          empty-text="笔记数据为空或者思源笔记未启动！"
          @row-click="handleRowClick"
          style="width: 100%; min-width: 600px"
        >
          <el-table-column type="expand">
            <template #default="props">
              <div m="4" style="padding-left: 10px" class="tb-extend">
                <p m="t-0 b-2">ID: {{ props.row.postid }}</p>
                <p m="t-0 b-2">发布时间: {{ props.row.dateCreated }}</p>
                <p m="t-0 b-2">标题: {{ props.row.title }}</p>
                <p m="t-0 b-2">
                  标签:
                  {{ props.row.mt_keywords === "" ? "暂无标签" : props.row.mt_keywords }}
                </p>
                <p m="t-0 b-2">摘要: {{ props.row.shortDesc }}</p>
                <p m="t-0 b-2">
                  平台:
                  <span v-if="props.row.yamlCount > 0">
                    <span v-for="(value, key) in props.row.yamlAttrs" :key="key" class="box-item">
                      <a @click="goToSingleEdit(key.toString(), props.row)">
                        <el-text>
                          <i class="el-icon">
                            <span v-html="props.row.dynCfgs[key]?.platformIcon ?? svgIcons.iconOTRemove"></span>
                          </i>
                          {{ props.row.dynCfgs[key]?.platformName ?? "[已删除]" }}
                        </el-text>
                      </a>
                    </span>
                  </span>
                  <span v-else>暂无平台</span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="title">
            <template #header>
              <div style="text-align: center">标题</div>
            </template>
            <template #default="scope">
              <el-tooltip
                :content="
                  scope.row.yamlCount > 0 ? '文章已发布到：' + Object.keys(scope.row.yamlAttrs).toString() : '尚未发布'
                "
                class="box-item"
                effect="light"
                placement="right"
                popper-class="publish-menu-tooltip"
              >
                <span>{{ scope.row.title }}</span>
              </el-tooltip>
              <sup class="yaml-count-sign" v-if="scope.row.yamlCount > 0">{{ scope.row.yamlCount }}</sup>
            </template>
          </el-table-column>
          <el-table-column align="center" width="420">
            <template #header>
              <div style="text-align: center">操作</div>
            </template>
            <template #default="scope">
              <!-- 发布 -->
              <el-button size="small" @click="handleQuick(scope.$index, scope.row)">
                <MaterialSymbolsRocketLaunch />
                &nbsp;闪发
              </el-button>

              <!--
              <el-tooltip
                :content="t('siyuan.browser.menu.publish.btn')"
                class="box-item"
                effect="light"
                placement="right"
                popper-class="publish-menu-tooltip"
              >
              </el-tooltip>
              -->
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                <MaterialSymbolsDriveFolderUpload />
                &nbsp;单发
              </el-button>
              <el-button size="small" @click="handleBatch(scope.$index, scope.row)">
                <MdiMinusBoxMultipleOutline />
                &nbsp;批发
              </el-button>

              <!-- 预览 -->
              <!--
              <el-tooltip
                :content="t('siyuan.browser.menu.preview.btn')"
                class="box-item"
                effect="light"
                placement="right"
                popper-class="publish-menu-tooltip"
              >
               </el-tooltip>
               -->
              <el-button
                size="small"
                @click="handleView(scope.$index, scope.row)"
                v-if="isBlogInstalled && scope.row.isShared"
              >
                <Fa6SolidBookOpenReader />
                &nbsp;查看
              </el-button>

              <!-- picgo -->
              <!--
              <el-tooltip
                :content="t('siyuan.browser.menu.picture.btn')"
                class="box-item"
                effect="light"
                placement="right"
                popper-class="publish-menu-tooltip"
              >
              </el-tooltip>
              -->
              <el-button size="small" @click="handlePicgo(scope.$index, scope.row)" v-if="isPicgoInstalled">
                <MaterialSymbolsAddPhotoAlternateOutline />
                &nbsp;图床
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          small
          background
          :layout="dataLayout"
          :total="total"
          class="mt-4"
          :page-size="MAX_PAGE_SIZE"
          @prev-click="handlePrevPage"
          @next-click="handleNextPage"
          :current-page="currentPage"
          @current-change="handleCurrentPage"
        />
      </div>
    </div>

    <!-- 抽屉占位 -->
    <el-drawer v-model="showDrawer" size="85%" :title="drawerTitle" direction="rtl" :destroy-on-close="true">
      <DrawerBoxBridge :src="drawerSrc" />
    </el-drawer>
  </div>
</template>

<style lang="stylus" scoped>
.admin-box
  font-family: var(--g-font-family)
  padding: 0 10px

:deep(.search-btn .s-input)
  min-width: 400px !important

#post-list
  margin-top: 20px

.top-data-tip
  margin-top: 32px !important
  margin-bottom: 10px
  padding-left: 4px

/* search */
.my-autocomplete li
  line-height: normal
  padding: 7px

  &.name
    text-overflow: ellipsis
    overflow: hidden

  &.addr
    font-size: 12px
    color: #b4b4b4

    &.highlighted
      color: #ddd

.s-btn
  margin-left: 20px

.s-filter-item
  padding-left 10px

//.s-filter-published

/* table */
.tb-data
  margin-top: 10px

.el-pagination
  text-align: center
  margin-top: 20px
  justify-content: center

.data-empty-box
  margin: 16px 0

.tb-extend
  .box-item
    margin-right: 10px

    a
      cursor: pointer
      color: var(--el-color-primary)

.yaml-count-sign
  color red
  font-size 12px
  padding-left 2px

:deep(.el-drawer)
  --el-drawer-padding-primary var(--el-dialog-padding-primary, 0)

:deep(.el-drawer__header)
  padding: 20px
  margin-bottom 0
</style>
