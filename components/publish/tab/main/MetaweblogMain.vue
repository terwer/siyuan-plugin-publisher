<!--
  - Copyright (c) 2022-2023, Terwer . All rights reserved.
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

<template>
  <el-container>
    <el-main class="blog-main" v-if="!isInitLoading">
      <el-alert class="top-version-tip" :title="apiTypeInfo + blogName" type="info" :closable="false" />
      <el-alert
        class="top-version-tip"
        :title="$t('setting.blog.vali.tip.metaweblog')"
        type="error"
        :closable="false"
        v-if="!apiStatus"
      />
      <el-alert
        class="top-version-tip"
        :title="$t('setting.conf.tip')"
        type="info"
        :closable="false"
        v-if="useAdaptor"
      />
      <el-form label-width="120px">
        <!-- 文章标题 -->
        <div class="form-post-title">
          <el-form-item :label="$t('main.title')">
            <el-input v-model="formData.title" :disabled="true" />
          </el-form-item>
        </div>

        <!-- 编辑模式 -->
        <el-form-item :label="$t('main.publish.editmode')">
          <el-button-group>
            <el-button :type="editMode ? 'default' : 'primary'" @click="simpleMode"
              >{{ $t("main.publish.editmode.simple") }}
            </el-button>
            <el-button :type="editMode ? 'primary' : 'default'" @click="complexMode"
              >{{ $t("main.publish.editmode.complex") }}
            </el-button>
          </el-button-group>
        </el-form-item>

        <!-- 刷新别名 -->
        <el-form-item :label="$t('main.force.refresh')" v-if="editMode">
          <el-switch v-model="forceRefresh" />
          <el-alert :title="$t('main.force.refresh.tip')" type="warning" :closable="false" v-if="!forceRefresh" />
        </el-form-item>

        <!-- 文章别名 -->
        <el-form-item :label="$t('main.slug')" v-if="editMode">
          <el-input v-model="formData.customSlug" />
        </el-form-item>
        <el-form-item v-if="editMode">
          <el-checkbox-group v-model="formData.checkList">
            <el-checkbox label="1">{{ $t("main.use.google.translate") }} </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="editMode">
          <el-button type="primary" class="make-slug-btn" @click="makeSlug" :loading="isSlugLoading">
            {{ isSlugLoading ? $t("main.opt.loading") : $t("main.auto.fetch.slug") }}
          </el-button>
        </el-form-item>
        <el-form-item :label="$t('main.use.hash')" v-if="editMode">
          <el-switch v-model="slugHashEnabled" />
          <el-alert :title="$t('main.use.hash.tip')" type="warning" :closable="false" v-if="!slugHashEnabled" />
        </el-form-item>

        <!-- 摘要 -->
        <el-form-item :label="$t('main.desc')" v-if="editMode">
          <el-input type="textarea" v-model="formData.desc" />
        </el-form-item>
        <el-form-item v-if="editMode">
          <el-button type="primary" @click="makeDesc" :loading="isDescLoading">
            {{ isDescLoading ? $t("main.opt.loading") : $t("main.auto.fetch.desc") }}
          </el-button>
        </el-form-item>

        <!-- 创建时间 -->
        <el-form-item :label="$t('main.create.time')" v-if="editMode">
          <el-date-picker
            type="datetime"
            v-model="formData.created"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('main.create.time.placeholder')"
          />
        </el-form-item>

        <!-- 标签开关 -->
        <el-form-item v-if="editMode" :label="$t('main.tag.auto.switch')">
          <el-switch v-model="tagSwitch" />
        </el-form-item>

        <!-- 标签  -->
        <el-form-item :label="$t('main.tag')">
          <el-tag
            v-for="tag in formData.tag.dynamicTags"
            :key="tag"
            class="mx-1"
            closable
            :disable-transitions="false"
            @close="tagHandleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="formData.tag.inputVisible"
            ref="tagRefInput"
            v-model="formData.tag.inputValue"
            class="ml-1 w-20"
            size="small"
            @keyup.enter="tagHandleInputConfirm"
            @blur="tagHandleInputConfirm"
          />
          <el-button v-else class="button-new-tag ml-1 el-tag" size="small" @click="tagShowInput">
            {{ $t("main.tag.new") }}
          </el-button>
        </el-form-item>
        <el-form-item v-if="editMode">
          <el-button type="primary" @click="fetchTag" :loading="isTagLoading">
            {{ isTagLoading ? $t("main.opt.loading") : $t("main.auto.fetch.tag") }}
          </el-button>
        </el-form-item>

        <!-- 分类 -->
        <el-form-item :label="$t('main.cat')" style="width: 100%">
          <el-tree-select
            style="width: 100%"
            v-model="formData.cat.categorySelected"
            :data="formData.cat.categoryList"
            multiple
            tag-type="info"
            :check-on-click-node="true"
            :render-after-expand="false"
            show-checkbox
            :placeholder="$t('main.cat.select')"
            :empty-text="$t('main.cat.empty')"
            :no-data-text="$t('main.cat.empty')"
            @node-click="handleCatNodeClick"
            @check="handleCatNodeCheck"
          />
        </el-form-item>

        <!-- 操作 -->
        <!--
        ----------------------------------------------------------------------
        -->

        <!-- 一键生成属性-->
        <el-form-item v-if="editMode" :label="$t('main.opt.quick')">
          <el-button type="primary" @click="oneclickAttr" :loading="isGenLoading">
            {{ isGenLoading ? $t("main.opt.loading") : $t("main.publish.oneclick.attr") }}
          </el-button>
          <el-button type="primary" @click="saveAttrToSiyuan">{{ $t("main.save.attr.to.siyuan") }} </el-button>
        </el-form-item>

        <!-- 使用图床 -->
        <el-form-item :label="$t('github.post.picgo.use')">
          <el-switch v-model="picgoPostData.picgoEnabled" @change="picgoPostMethods.picgoOnChange" />
          <el-tooltip
            v-if="picgoPostData.picgoEnabled && !isInSiyuanNewWinBrowser()"
            :content="$t('siyuan.browser.menu.picture.btn')"
            class="box-item"
            effect="light"
            placement="right"
            popper-class="publish-menu-tooltip"
          >
            <el-button
              class="pic-manage-btn"
              type="success"
              size="small"
              @click="picgoPostMethods.handlePicgoManage(siyuanData.pageId)"
            >
              <font-awesome-icon icon="fa-solid fa-image" />
              {{ $t("setting.picgo.manage") }}
            </el-button>
          </el-tooltip>
          <el-alert
            v-if="picgoPostData.picgoEnabled"
            :closable="false"
            :title="$t('github.post.picgo.use.tip')"
            type="warning"
          />
        </el-form-item>

        <!-- 发布操作 -->
        <el-form-item label="">
          <el-button type="primary" @click="doPublish" :loading="isPublishLoading"
            >{{ isPublishLoading ? $t("main.publish.loading") : isPublished ? $t("main.update") : $t("main.publish") }}
          </el-button>
          <el-button v-if="isPublished" :loading="isCancelLoading" @click="cancelPublish"
            >{{ $t("main.cancel") }}
          </el-button>
        </el-form-item>

        <!-- 文章状态 -->
        <el-form-item>
          <el-button type="danger" text disabled>
            {{ isPublished ? $t("main.publish.status.published") : $t("main.publish.status.unpublish") }}
          </el-button>
          <a :href="previewUrl" :title="previewUrl" target="_blank" v-if="isPublished">{{
            $t("main.publish.see.preview")
          }}</a>
        </el-form-item>
      </el-form>
    </el-main>
    <el-skeleton :loading="isInitLoading" :rows="5" animated />
  </el-container>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref, watch } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { useI18n } from "vue-i18n"
import { SIYUAN_PAGE_ATTR_KEY } from "~/utils/constants/siyuanPageConstants"
import {
  mdToHtml,
  mdToPlainText,
  parseHtml,
  removeH1,
  removeMdH1,
  removeMdWidgetTag,
  removeTitleNumber,
  removeWidgetTag,
} from "~/utils/htmlUtil"
import { IMetaweblogCfg, PageType } from "~/utils/platform/metaweblog/IMetaweblogCfg"
import shortHash from "shorthash2"
import { API } from "~/utils/api"
import { Post } from "~/utils/models/post"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { LogFactory } from "~/utils/logUtil"
import { getPageId } from "~/utils/platform/siyuan/siyuanUtil"
import { getJSONConf } from "~/utils/configUtil"
import { cutWords, isEmptyObject, isEmptyString, jiebaToHotWords, pinyinSlugify, zhSlugify } from "~/utils/util"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { formatNumToZhDate } from "~/utils/dateUtil"
import { getApiParams, getPublishCfg, getPublishStatus } from "~/utils/publishUtil"
import { CONSTANTS } from "~/utils/constants/constants"
import { usePicgoPost } from "~/composables/picgo/import/picgoPostCom"
import { PicgoPostApi } from "~/utils/platform/picgo/picgoPostApi"
import { LinkParser } from "~/utils/parser/LinkParser"
import { isInSiyuanNewWinBrowser } from "~/utils/otherlib/siyuanBrowserUtil"

const logger = LogFactory.getLogger("components/publish/tab/main/MetaweblogMain.vue")
const siyuanApi = new SiYuanApi()

const { t } = useI18n()

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false,
  },
  isMainReload: {
    type: Boolean,
    default: false,
  },
  apiType: {
    type: String,
    default: "",
  },
  useAdaptor: {
    type: Boolean,
    default: false,
  },
  pageId: {
    type: String,
    default: undefined,
  },
})

const blogName = ref("")
const apiTypeInfo = ref(t("setting.blog.platform.support.metaweblog") + props.apiType + " ")
const apiStatus = ref(false)
const picgoPostApi = new PicgoPostApi()
const linkParser = new LinkParser()

// use
const { picgoPostData, picgoPostMethods } = usePicgoPost()

const isSlugLoading = ref(false)
const isDescLoading = ref(false)
const isTagLoading = ref(false)
const isGenLoading = ref(false)
const isPublishLoading = ref(false)
const isCancelLoading = ref(false)
const isInitLoading = ref(false)

const editMode = ref(false)
const forceRefresh = ref(false)
const slugHashEnabled = ref(false)
const isPublished = ref(false)
const previewUrl = ref("")
const tagSwitch = ref(false)

const formData = reactive({
  // 新增时候这个值是空的
  postid: "",
  title: "",
  customSlug: "",
  desc: "",
  created: "",
  checkList: ["1"],
  tag: {
    inputValue: "",
    dynamicTags: [],
    inputVisible: false,
  },
  cat: {
    categorySelected: [],
    categoryList: [],
  },
  categories: ["默认分类"],
})

const siyuanData = reactive({
  pageId: "",
  meta: {
    tags: "",
  },
})

const simpleMode = () => {
  editMode.value = false
}
const complexMode = () => {
  editMode.value = true
}

const initPage = async () => {
  isInitLoading.value = true

  const pageId = await getPageId(true, props.pageId)
  if (!pageId || pageId === "") {
    return
  }

  // conf
  const conf = getJSONConf<IMetaweblogCfg>(props.apiType)
  if (!isEmptyObject(conf)) {
    blogName.value = conf.blogName
  }
  // 读取偏好设置
  const publishCfg = getPublishCfg()

  // 默认开启hash
  slugHashEnabled.value = true

  // 思源笔记数据
  siyuanData.pageId = pageId
  siyuanData.meta = await siyuanApi.getBlockAttrs(pageId)
  const page = await siyuanApi.getBlockByID(pageId)
  if (!page) {
    isInitLoading.value = false
    ElMessage.error(t("config.error.msg") + "_" + props.apiType)
    throw new Error(t("config.error.msg") + "_" + props.apiType)
  }
  logger.debug("MetaweblogMain初始化页面,meta=>", siyuanData.meta)

  // 表单数据
  let fmtTitle = page.content
  if (publishCfg.fixTitle) {
    fmtTitle = removeTitleNumber(page.content)
  }
  formData.title = fmtTitle
  formData.customSlug = siyuanData.meta[SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY]
  formData.desc = siyuanData.meta[SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_DESC_KEY]
  formData.created = formatNumToZhDate(page.created)

  // 标签
  formData.tag.dynamicTags = []
  const tagstr = siyuanData.meta.tags || ""
  const tgarr = tagstr.split(",")
  for (let i = 0; i < tgarr.length; i++) {
    const tg = tgarr[i]
    if (tg !== "") {
      formData.tag.dynamicTags.push(tgarr[i])
    }
  }

  // 自动标签
  if (publishCfg.autoTag && formData.tag.dynamicTags.length === 0) {
    tagSwitch.value = true
  }

  // PicGO开关
  picgoPostData.picgoEnabled = publishCfg.usePicgo

  // 发布状态
  isPublished.value = getPublishStatus(props.apiType, siyuanData.meta)

  // ============================
  // 依赖于特定平台的数据初始化开始
  // ===========================
  const metaweblogCfg = getJSONConf<IMetaweblogCfg>(props.apiType)
  const api = new API(props.apiType)
  // 选中的分类
  let catData = []

  // 更新预览链接
  if (isPublished.value) {
    // 读取postid
    const meta = siyuanData.meta
    formData.postid = meta[metaweblogCfg.posidKey]

    // 路径组合
    previewUrl.value = await api.getPreviewUrl(formData?.postid?.toString())

    try {
      // 如果文章选择了分类，初始化分类
      const post = await api.getPost(formData.postid.toString())
      catData = post.categories

      logger.debug("postid=>", formData.postid)
      logger.debug("post=>", post)
      logger.debug("初始化选择过的分类,catData=>", catData)
    } catch (e) {
      // 强制删除
      ElMessage.error(t("post.delete.by.platform"))

      isInitLoading.value = false
      logger.error("文章新获取失败", e)
    }
  } else {
    logger.warn("检测到之前发布异常，清空文章ID")
    const postidKey = getApiParams<IMetaweblogCfg>(props.apiType).posidKey
    const customAttr = {
      [postidKey]: "",
    }
    await siyuanApi.setBlockAttrs(siyuanData.pageId, customAttr)
  }

  // 全部文章分类请求
  let catInfo = []
  try {
    catInfo = await api.getCategories()
  } catch (e) {
    isInitLoading.value = false
    logger.error(t("main.cat.list.error"), e)
  }
  // logUtil.logInfo("catInfo=>", catInfo)

  // 组装分类
  const catArr = []
  if (catInfo && catInfo.length && catInfo.length > 0) {
    catInfo.forEach((item) => {
      const cat = {
        value: item.description,
        label: item.description,
      }
      catArr.push(cat)
    })
    formData.cat.categoryList = catArr
  }

  formData.cat.categorySelected = catData
  formData.categories = catData
  // ============================
  // 依赖于特定平台的数据初始化结束
  // ===========================

  apiStatus.value = conf.apiStatus

  isInitLoading.value = false
}

onMounted(async () => {
  await initPage()
})

function checkForce() {
  // 空值跳过
  if (isEmptyString(formData.customSlug)) {
    return true
  }

  // 别名不为空，默认不刷新
  if (!forceRefresh.value) {
    // ElMessage.warning(t('main.force.refresh.tip'))
    logger.debug(t("main.force.refresh.tip"))
    return false
  }

  return true
}

const makeSlug = async (hideTip) => {
  if (!checkForce()) {
    return
  }

  isSlugLoading.value = true
  // 获取最新属性
  const page = await siyuanApi.getBlockByID(siyuanData.pageId)
  // BUG：目前attr的title不会即时更新
  // siyuanData.value.meta = await getPageAttrs(siyuanData.value.pageId)
  // logUtil.logInfo("meta=>", siyuanData.value.meta)
  logger.debug("page=>", page)
  // 获取标题
  // const title = siyuanData.value.meta.title;
  let fmtTitle = page.content
  if (fmtTitle.indexOf(".") > -1) {
    fmtTitle = fmtTitle.replace(/\d*\./g, "")
  }
  logger.debug("fmtTitle=>", fmtTitle)
  if (formData.checkList.length > 0) {
    // 调用Google翻译API
    const result = await zhSlugify(fmtTitle)
    logger.debug("result=>", result)
    if (result) {
      formData.customSlug = result
    } else {
      ElMessage.success(t("main.opt.failure"))
    }
  } else {
    formData.customSlug = pinyinSlugify(fmtTitle)
  }

  // add hash
  if (slugHashEnabled.value) {
    const newstr = page.content + new Date().toISOString()
    const hashstr = "-" + shortHash(newstr).toLowerCase()
    formData.customSlug += hashstr
  }

  isSlugLoading.value = false
  if (hideTip !== true) {
    ElMessage.success(t("main.opt.success"))
  }
}

const makeDesc = async (hideTip) => {
  isDescLoading.value = true

  const data = await siyuanApi.exportMdContent(siyuanData.pageId)

  const md = data.content
  const plainText = mdToPlainText(md)
  formData.desc = parseHtml(plainText, CONSTANTS.MAX_PREVIEW_LENGTH, true)

  isDescLoading.value = false
  if (hideTip !== true) {
    ElMessage.success(t("main.opt.success"))
  }
}

const tagHandleClose = (tag) => {
  formData.tag.dynamicTags.splice(formData.tag.dynamicTags.indexOf(tag), 1)
}
// https://stackoverflow.com/questions/64774113/vue-js-3-use-autofocus-on-input-with-ref-inside-a-method
// https://stackoverflow.com/questions/64774113/vue-js-3-use-autofocus-on-input-with-ref-inside-a-method
// https://www.helloworld.net/p/2721375043
const tagRefInput = ref()
const tagShowInput = () => {
  formData.tag.inputVisible = true

  // this.$refs.tagRefInput.focus()
  nextTick(() => {
    tagRefInput.value.focus()
  })
}
const tagHandleInputConfirm = () => {
  if (formData.tag.inputValue) {
    formData.tag.dynamicTags.push(formData.tag.inputValue)
  }
  formData.tag.inputVisible = false
  formData.tag.inputValue = ""
}

async function fetchTag(hideTip) {
  if (!tagSwitch.value) {
    ElMessage.warning(t("main.tag.auto.switch.no.tip"))
    return
  }

  isTagLoading.value = true

  const data = await siyuanApi.exportMdContent(siyuanData.pageId)

  const md = data.content
  const genTags = await cutWords(md)
  logger.debug("genTags=>", genTags)

  const hotTags = jiebaToHotWords(genTags, 5)
  logger.debug("hotTags=>", hotTags)

  // 如果标签不存在，保存新标签到表单
  for (let i = 0; i < hotTags.length; i++) {
    if (!formData.tag.dynamicTags.includes(hotTags[i])) {
      formData.tag.dynamicTags.push(hotTags[i])
    }
  }

  isTagLoading.value = false
  if (hideTip !== true) {
    ElMessage.success(t("main.opt.success"))
  }
}

const saveAttrToSiyuan = async (hideTip) => {
  const customAttr = {
    [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY]: formData.customSlug,
    [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_DESC_KEY]: formData.desc,
    tags: formData.tag.dynamicTags.join(","),
  }
  await siyuanApi.setBlockAttrs(siyuanData.pageId, customAttr)
  logger.debug("MetaweblogMain保存属性到思源笔记,meta=>", customAttr)

  // 单独调用才去刷新数据，否则自行刷新数据
  if (hideTip !== true) {
    // 刷新属性数据
    await initPage()

    ElMessage.success(t("main.opt.success"))
  }
}

const handleCatNodeClick = (event, data, node, nodeItem) => {
  // console.log("data=>", data)
  // console.log("node=>", node)
}

const handleCatNodeCheck = (data, status) => {
  console.log("data=>", data)
  console.log("status=>", status)

  const cats = []
  const values = status.checkedKeys
  values.forEach((item) => {
    cats.push(item.toString())
  })
  formData.categories = cats
  logger.debug(" formData.categories=>", formData.categories)
}

const oneclickAttr = async (hideTip) => {
  isGenLoading.value = true
  await makeSlug(true)

  await makeDesc(true)

  await fetchTag(true)

  // 发布属性
  await saveAttrToSiyuan(true)
  logger.debug("发布属性完成")

  isGenLoading.value = false
  if (hideTip !== true) {
    ElMessage.success(t("main.publish.oneclick.attr.finish"))
  }
}

const doPublish = async () => {
  if (!apiStatus.value) {
    ElMessage.error(t("setting.blog.vali.tip.metaweblog"))
    return
  }

  isPublishLoading.value = true

  try {
    // 生成属性
    await oneclickAttr(true)

    // api可用并且开启了发布
    const metaweblogCfg = getJSONConf<IMetaweblogCfg>(props.apiType)
    const api = new API(props.apiType)
    // 读取偏好设置
    const publishCfg = getPublishCfg()

    // 组装文章数据
    // ===============================
    // 发布内容
    let content
    const data = await siyuanApi.exportMdContent(siyuanData.pageId)
    let md = data.content

    // 引用链接替换
    md = await linkParser.convertSiyuanLinkToPlatformLink(md, api)

    // 处理图床
    if (picgoPostMethods.getPicgoPostData().picgoEnabled) {
      const picgoPostResult = await picgoPostApi.uploadPostImagesToBed(siyuanData.pageId, siyuanData.meta, md)
      // 有图片才上传
      if (picgoPostResult.hasImages) {
        if (picgoPostResult.flag) {
          md = picgoPostResult.mdContent
        } else {
          ElMessage.error(t("github.post.picgo.picbed.error") + "=>" + picgoPostResult.errmsg)
        }
      }
    }

    if (PageType.Html === metaweblogCfg.pageType) {
      const html = mdToHtml(md)
      content = removeWidgetTag(html)
      if (publishCfg.removeH1) {
        content = removeH1(content)
      }
    } else {
      content = removeMdWidgetTag(md)
      if (publishCfg.removeH1) {
        content = removeMdH1(content)
      }
    }

    // ===============================
    const post = new Post()
    post.title = formData.title
    post.wp_slug = formData.customSlug
    post.description = content
    post.categories = formData.categories
    post.mt_keywords = formData.tag.dynamicTags.join(",")
    // 博客园的Markdown
    if (props.apiType === API_TYPE_CONSTANTS.API_TYPE_CNBLOGS) {
      post.categories.push("[Markdown]")
    }
    post.dateCreated = new Date()
    // 默认是已发布，publish字段是博客园接口必备
    // post.post_status = POST_STATUS_CONSTANTS.POST_STATUS_PUBLISH
    const publish = true

    let postid
    if (isPublished.value) {
      postid = formData.postid

      const flag = await api.editPost(postid, post, true)
      if (!flag) {
        ElMessage.error("文章更新失败")
        throw new Error("文章更新失败=>" + postid)
      }

      logger.debug("文章已更新，postid=>", postid)
    } else {
      postid = await api.newPost(post, publish)
      // 这里是发布成功之后
      // 属性获取postidKey
      logger.debug("当前保存的posidKey=>", metaweblogCfg.posidKey)
      const customAttr = {
        [metaweblogCfg.posidKey]: postid,
      }
      await siyuanApi.setBlockAttrs(siyuanData.pageId, customAttr)
      logger.debug("MetaweblogMain发布成功，保存postid,meta=>", customAttr)

      logger.info("文章发布成功，postid=>", postid)
    }

    // 刷新属性数据
    await initPage()

    ElMessage.success(t("main.opt.success"))
  } catch (e) {
    isPublishLoading.value = false
    logger.error("发布异常", e)
    ElMessage.error({
      dangerouslyUseHTMLString: true,
      message: t("main.opt.failure") + "=>" + e,
    })
  }

  isPublishLoading.value = false
}

const cancelPublish = async () => {
  isCancelLoading.value = true

  ElMessageBox.confirm(t("main.opt.warning.tip"), t("main.opt.warning"), {
    confirmButtonText: t("main.opt.ok"),
    cancelButtonText: t("main.opt.cancel"),
    type: "warning",
  })
    .then(async () => {
      await doCancel(true)

      isCancelLoading.value = false

      ElMessage.warning(t("main.opt.status.cancel"))
    })
    .catch((e) => {
      ElMessage({
        type: "error",
        message: t("main.opt.failure"),
      })
      isCancelLoading.value = false

      throw new Error(e)
    })
}

// 实际删除逻辑
const doCancel = async (isInit) => {
  const metaweblogCfg = getJSONConf<IMetaweblogCfg>(props.apiType)
  logger.debug("准备取消发布，postid=>", formData.postid)

  // 先清空ID
  const customAttr = {
    [metaweblogCfg.posidKey]: "",
  }
  await siyuanApi.setBlockAttrs(siyuanData.pageId, customAttr)
  logger.debug("MetaweblogMain取消发布,meta=>", customAttr)

  // 在平台强行删除一次
  try {
    const api = new API(props.apiType)
    const flag = await api.deletePost(formData.postid)
    if (!flag) {
      ElMessage.error("文章删除失败")
      // throw new Error("文章删除失败")
    }
  } catch (e) {
    logger.error("强行删除一次", e)
  }

  // 刷新属性数据
  if (isInit) {
    await initPage()
  }
}

// life cycle
/**
 * 监听props
 */
watch(
  () => props.isReload,
  async () => {
    // 初始化
    await initPage()
    logger.debug(props.apiType + "_Main检测到设置更新操作，刷新页面")
  }
)
watch(
  () => props.isMainReload,
  async () => {
    // 初始化
    await initPage()
    logger.debug(props.apiType + "_Main左右切换tab，刷新页面")
  }
)
</script>

<style scoped>
.blog-main {
  padding: 0;
}
</style>
