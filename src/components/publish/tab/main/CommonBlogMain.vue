<template>
  <el-container>
    <el-main class="common-main" v-if="!isInitLoadding">
      <el-alert
        class="top-version-tip"
        :title="apiTypeInfo + blogName"
        type="info"
        :closable="false"
      />
      <el-alert
        class="top-version-tip"
        title="仅支持新建修改，暂时不支持编辑所属知识库。如果您想移动文档，请先点击取消删除该文档，然后重新选择新的知识库发布。"
        type="warning"
        :closable="false"
        v-if="useCat && isPublished"
      />
      <el-alert
        class="top-version-tip"
        :title="$t('setting.blog.vali.tip.metaweblog')"
        type="error"
        :closable="false"
        v-if="!apiStatus"
      />
      <el-form label-width="120px">
        <!-- 编辑模式 -->
        <el-form-item :label="$t('main.publish.editmode')">
          <el-button-group>
            <el-button
              :type="editMode ? 'default' : 'primary'"
              @click="simpleMode"
              >{{ $t("main.publish.editmode.simple") }}
            </el-button>
            <el-button
              :type="editMode ? 'primary' : 'default'"
              @click="complexMode"
              >{{ $t("main.publish.editmode.complex") }}
            </el-button>
          </el-button-group>
        </el-form-item>

        <!-- 强制刷新 -->
        <el-form-item :label="$t('main.force.refresh')" v-if="editMode">
          <el-switch v-model="forceRefresh" />
          <el-alert
            :title="$t('main.force.refresh.tip')"
            type="warning"
            :closable="false"
            v-if="!forceRefresh"
          />
        </el-form-item>

        <!-- 文章别名 -->
        <el-form-item :label="$t('main.slug')" v-if="editMode">
          <el-input v-model="formData.customSlug" />
        </el-form-item>
        <el-form-item v-if="editMode">
          <el-checkbox-group v-model="formData.checkList">
            <el-checkbox label="1">{{
              $t("main.use.google.translate")
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="editMode">
          <el-button
            type="primary"
            class="make-slug-btn"
            @click="makeSlug"
            :loading="isSlugLoading"
          >
            {{
              isSlugLoading
                ? $t("main.opt.loading")
                : $t("main.auto.fetch.slug")
            }}
          </el-button>
        </el-form-item>
        <el-form-item :label="$t('main.use.hash')" v-if="editMode">
          <el-switch v-model="slugHashEnabled" />
          <el-alert
            :title="$t('main.use.hash.tip')"
            type="warning"
            :closable="false"
            v-if="!slugHashEnabled"
          />
        </el-form-item>

        <!-- 摘要 -->
        <el-form-item :label="$t('main.desc')" v-if="editMode">
          <el-input type="textarea" v-model="formData.desc" />
        </el-form-item>
        <el-form-item v-if="editMode">
          <el-button type="primary" @click="makeDesc" :loading="isDescLoading">
            {{
              isDescLoading
                ? $t("main.opt.loading")
                : $t("main.auto.fetch.desc")
            }}
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
          <el-button
            v-else
            class="button-new-tag ml-1 el-tag"
            size="small"
            @click="tagShowInput"
          >
            {{ $t("main.tag.new") }}
          </el-button>
        </el-form-item>
        <el-form-item v-if="editMode">
          <el-button type="primary" @click="fetchTag" :loading="isTagLoading">
            {{
              isTagLoading ? $t("main.opt.loading") : $t("main.auto.fetch.tag")
            }}
          </el-button>
        </el-form-item>
        <!-- 标签开关 -->
        <el-form-item :label="$t('main.tag.auto.switch')">
          <el-switch v-model="tagSwitch" />
        </el-form-item>

        <!-- 分类 -->
        <el-form-item
          :label="$t('main.cat')"
          style="width: 100%"
          v-if="props.useCat"
        >
          <el-select
            v-if="catEnabled"
            v-model="formData.cat.categorySelected"
            placeholder="请选择"
            no-data-text="暂无数据"
            class="m-2"
            size="default"
            @change="handleCatNodeSingleCheck"
          >
            <el-option
              v-for="item in formData.cat.categoryList"
              :key="item.value"
              :label="item.label"
              :value="item"
            />
          </el-select>
          <el-select
            v-else
            v-model="formData.cat.categorySelected"
            disabled
            placeholder="请选择"
            no-data-text="暂无数据"
            class="m-2"
            size="default"
            @change="handleCatNodeSingleCheck"
          >
            <el-option
              v-for="item in formData.cat.categoryList"
              :key="item.value"
              :label="item.label"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <!--
        ----------------------------------------------------------------------
        -->
        <!-- 一键生成属性-->
        <el-form-item :label="$t('main.opt.quick')">
          <el-button
            type="primary"
            @click="oneclickAttr"
            :loading="isGenLoading"
          >
            {{
              isGenLoading
                ? $t("main.opt.loading")
                : $t("main.publish.oneclick.attr")
            }}
          </el-button>
        </el-form-item>

        <!-- 保存属性 -->
        <el-form-item>
          <el-button type="primary" @click="saveAttrToSiyuan">{{
            $t("main.save.attr.to.siyuan")
          }}</el-button>
        </el-form-item>

        <!-- 发布操作 -->
        <el-form-item label="">
          <el-button
            type="primary"
            @click="publishConfirm"
            :loading="isPublishLoading"
            >{{
              isPublishLoading
                ? $t("main.publish.loading")
                : isPublished
                ? $t("main.update")
                : $t("main.publish")
            }}
          </el-button>
          <el-button @click="cancelPublish" :loading="isCancelLoading">{{
            $t("main.cancel")
          }}</el-button>
        </el-form-item>

        <!-- 文章状态 -->
        <el-form-item>
          <el-button type="danger" text disabled>
            {{
              isPublished
                ? $t("main.publish.status.published")
                : $t("main.publish.status.unpublish")
            }}
          </el-button>
          <a
            :href="previewUrl"
            :title="previewUrl"
            target="_blank"
            v-if="isPublished"
            >{{ $t("main.publish.vuepress.see.preview") }}</a
          >
        </el-form-item>
      </el-form>
    </el-main>
    <el-skeleton :loading="isInitLoadding" :rows="5" animated />
  </el-container>
</template>

<script lang="ts" setup>
import {
  CommonblogCfg,
  ICommonblogCfg,
} from "~/utils/platform/commonblog/commonblogCfg"
import { nextTick, onMounted, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import {
  getPage,
  getPageAttrs,
  getPageId,
  getPageMd,
  setPageAttrs,
} from "~/utils/platform/siyuan/siyuanUtil"
import { getConf, getJSONConf, setConf } from "~/utils/config"
import {
  calcLastSeconds,
  cutWords,
  formatNumToZhDate,
  getPublishStatus,
  isEmptyObject,
  isEmptyString,
  jiebaToHotWords,
  pingyinSlugify,
  zhSlugify,
} from "~/utils/util"
import { SIYUAN_PAGE_ATTR_KEY } from "~/utils/constants/siyuanPageConstants"
import logUtil from "~/utils/logUtil"
import { ElMessage, ElMessageBox } from "element-plus/es"
import shortHash from "shorthash2"
import {
  mdToHtml,
  mdToPlainText,
  parseHtml,
  removeMdWidgetTag,
  removeTitleNumber,
  removeWidgetTag,
} from "~/utils/htmlUtil"
import { CONSTANTS } from "~/utils/constants/constants"
import { API } from "~/utils/api"
import { PageType } from "~/utils/platform/metaweblog/IMetaweblogCfg"
import { Post } from "~/utils/common/post"
import ImageParser from "~/utils/parser/imageParser"

const { t } = useI18n()

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false,
  },
  useCat: {
    type: Boolean,
    default: false,
  },
  apiType: {
    type: String,
    default: "",
  },
  cfg: {
    type: CommonblogCfg,
    default: null,
  },
  pageId: {
    type: String,
    default: undefined,
  },
  /**
   * 是否限制发布频率
   */
  limitRate: {
    type: Boolean,
    default: false,
  },
  /**
   * 限制时间，单位秒
   */
  limitSeconds: {
    type: Number,
    default: 5,
  },
  /**
   * 是否将图片转换成base64
   */
  imageToBase64: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否剔除图片
   */
  removeImage: {
    type: Boolean,
    default: false,
  },
})

const blogName = ref("")
const apiTypeInfo = ref(
  t("setting.blog.platform.support.common") + props.apiType + " "
)
const apiStatus = ref(false)

const isSlugLoading = ref(false)
const isDescLoading = ref(false)
const isTagLoading = ref(false)
const isGenLoading = ref(false)
const isPublishLoading = ref(false)
const isCancelLoading = ref(false)
const isInitLoadding = ref(false)

const editMode = ref(false)
const forceRefresh = ref(false)
const slugHashEnabled = ref(false)
const isPublished = ref(false)
const previewUrl = ref("")
const tagSwitch = ref(false)

const catEnabled = ref(false)

// 图片解析器
const imageParser = new ImageParser()

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
    categorySelected: "",
    categoryList: [],
  },
  categories: ["默认分类"],
  cat_slugs: [],
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
  isInitLoadding.value = true

  const pageId = await getPageId(true, props.pageId)
  if (!pageId || pageId === "") {
    return
  }

  // conf
  const conf = getJSONConf<ICommonblogCfg>(props.apiType)
  if (!isEmptyObject(conf)) {
    blogName.value = conf.blogName || ""
  }

  // 默认开启hash
  slugHashEnabled.value = true

  // 思源笔记数据
  siyuanData.pageId = pageId
  siyuanData.meta = await getPageAttrs(pageId)
  let page
  try {
    page = await getPage(pageId)
  } catch (e) {
    isInitLoadding.value = false
    logUtil.logError("页面信息获取失败", e)
    throw new Error("页面信息获取失败")
  }
  if (!page) {
    isInitLoadding.value = false
    ElMessage.error(t("config.error.msg") + "_" + props.apiType)
    throw new Error(t("config.error.msg") + "_" + props.apiType)
  }
  logUtil.logInfo("CommonblogMain初始化页面,meta=>", siyuanData.meta)

  // 表单数据
  formData.title = page.content
  // @ts-ignore
  formData.customSlug =
    siyuanData.meta[SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY]
  // @ts-ignore
  formData.desc =
    siyuanData.meta[SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_DESC_KEY]
  formData.created = formatNumToZhDate(page.created)

  // 标签
  formData.tag.dynamicTags = []
  const tagstr = siyuanData.meta.tags || ""
  const tgarr = tagstr.split(",")
  for (let i = 0; i < tgarr.length; i++) {
    const tg = tgarr[i]
    if (tg !== "") {
      // @ts-ignore
      formData.tag.dynamicTags.push(tgarr[i])
    }
  }

  // 发布状态
  isPublished.value = getPublishStatus(props.apiType, siyuanData.meta)
  // 只支持新建选择笔记本
  catEnabled.value = !isPublished.value

  // ============================
  // 依赖于特定平台的数据初始化开始
  // ============================
  // 读取postid
  const commonCfg = getJSONConf<ICommonblogCfg>(props.apiType)
  const api = new API(props.apiType)
  // 选中的分类
  // @ts-ignore
  let catData = []
  // @ts-ignore
  let catSlugData = []

  // 更新预览链接
  if (isPublished.value) {
    // @ts-ignore
    const meta = siyuanData.meta
    // @ts-ignore
    formData.postid = meta[commonCfg.posidKey || ""]

    // 替换文章链接
    previewUrl.value = await api.getPreviewUrl(formData.postid.toString())

    if (props.useCat) {
      try {
        // 如果文章选择了分类，初始化分类
        const post = await api.getPost(formData.postid.toString())
        catData = post.categories
        // @ts-ignore
        catSlugData = post.cate_slugs

        logUtil.logInfo("postid=>", formData.postid)
        logUtil.logInfo("post=>", post)
        logUtil.logInfo("初始化选择过的分类,catData=>", catData)
      } catch (e) {
        // 强制删除
        ElMessage.error(t("post.delete.by.platform"))

        isInitLoadding.value = false
        logUtil.logError("平台文章新获取失败", e)
      }
    }
  } else {
    if (props.useCat && !isEmptyString(commonCfg.blogName)) {
      const defaultCats = []
      const defaultCatSlugs = []

      defaultCats.push(commonCfg.blogName)
      catData = defaultCats

      defaultCatSlugs.push(commonCfg.blogid)
      catSlugData = defaultCatSlugs
    }
  }

  // 全部文章分类请求
  if (props.useCat) {
    // @ts-ignore
    let catInfo = []
    try {
      catInfo = await api.getCategories()
    } catch (e) {
      isInitLoadding.value = false
      logUtil.logError("分类获取失败", e)
    }

    // 组装分类
    // @ts-ignore
    const catArr = []
    // @ts-ignore
    if (catInfo && catInfo.length && catInfo.length > 0) {
      // @ts-ignore
      catInfo.forEach((item) => {
        const cat = {
          value: item.categoryId,
          label: item.description,
        }
        catArr.push(cat)
      })
      // @ts-ignore
      formData.cat.categoryList = catArr
    }

    // @ts-ignore
    formData.cat.categorySelected = catData.length > 0 ? catData[0] : ""
    blogName.value = formData.cat.categorySelected
    // @ts-ignore
    formData.categories = catData
    // @ts-ignore
    formData.cat_slugs = catSlugData
  }

  // ============================
  // 依赖于特定平台的数据初始化结束
  // ===========================

  apiStatus.value = conf.apiStatus || false

  isInitLoadding.value = false
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
    logUtil.logInfo(t("main.force.refresh.tip"))
    return false
  }

  return true
}

// @ts-ignore
const makeSlug = async (hideTip) => {
  if (!checkForce()) {
    return
  }

  isSlugLoading.value = true
  // 获取最新属性
  const page = await getPage(siyuanData.pageId)
  // BUG：目前attr的title不会即时更新
  // siyuanData.value.meta = await getPageAttrs(siyuanData.value.pageId)
  // logUtil.logInfo("meta=>", siyuanData.value.meta)
  logUtil.logInfo("page=>", page)
  // 获取标题
  // @ts-ignore
  // const title = siyuanData.value.meta.title;
  // 标题处理
  let fmtTitle = page.content
  if (fmtTitle.indexOf(".") > -1) {
    fmtTitle = fmtTitle.replace(/\d*\./g, "")
  }
  logUtil.logInfo("fmtTitle=>", fmtTitle)
  if (formData.checkList.length > 0) {
    // 调用Google翻译API
    const result = await zhSlugify(fmtTitle)
    logUtil.logInfo("result=>", result)
    if (result) {
      formData.customSlug = result
    } else {
      ElMessage.success(t("main.opt.failure"))
    }
  } else {
    formData.customSlug = await pingyinSlugify(fmtTitle)
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

// @ts-ignore
const makeDesc = async (hideTip) => {
  isDescLoading.value = true
  const data = await getPageMd(siyuanData.pageId)

  const md = data.content
  const html = mdToPlainText(md)
  formData.desc = parseHtml(html, CONSTANTS.MAX_PREVIEW_LENGTH, true)

  isDescLoading.value = false
  if (hideTip !== true) {
    ElMessage.success(t("main.opt.success"))
  }
}

// @ts-ignore
const tagHandleClose = (tag) => {
  // @ts-ignore
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
    // @ts-ignore
    formData.tag.dynamicTags.push(formData.tag.inputValue)
  }
  formData.tag.inputVisible = false
  formData.tag.inputValue = ""
}

// @ts-ignore
async function fetchTag(hideTip) {
  if (!tagSwitch.value) {
    ElMessage.warning(t("main.tag.auto.switch.no.tip"))
    return
  }

  isTagLoading.value = true
  const data = await getPageMd(siyuanData.pageId)

  const md = data.content
  const genTags = await cutWords(md)
  logUtil.logInfo("genTags=>", genTags)

  const hotTags = jiebaToHotWords(genTags, 5)
  logUtil.logInfo("hotTags=>", hotTags)

  // 如果标签不存在，保存新标签到表单
  for (let i = 0; i < hotTags.length; i++) {
    // @ts-ignore
    if (!formData.tag.dynamicTags.includes(hotTags[i])) {
      // @ts-ignore
      formData.tag.dynamicTags.push(hotTags[i])
    }
  }

  isTagLoading.value = false
  if (hideTip !== true) {
    ElMessage.success(t("main.opt.success"))
  }
}

// @ts-ignore
const handleCatNodeSingleCheck = (val) => {
  logUtil.logInfo("val=>", val)
  const conf = getJSONConf<ICommonblogCfg>(props.apiType)

  const cats = []
  const catSlugs = []

  cats.push(val.label)
  formData.categories = cats

  catSlugs.push(conf.username + "/" + val.value)
  // @ts-ignore
  formData.cat_slugs = catSlugs

  blogName.value = val.label

  logUtil.logInfo(" formData.categories=>", formData.categories)
  logUtil.logInfo(" formData.cat_slugs=>", formData.cat_slugs)
}

// @ts-ignore
const saveAttrToSiyuan = async (hideTip) => {
  const customAttr = {
    [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY]:
      formData.customSlug,
    [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_DESC_KEY]: formData.desc,
    tags: formData.tag.dynamicTags.join(","),
  }
  await setPageAttrs(siyuanData.pageId, customAttr)
  logUtil.logInfo("CommonblogMain保存属性到思源笔记,meta=>", customAttr)

  // 单独调用才去刷新数据，否则自行刷新数据
  if (hideTip !== true) {
    // 刷新属性数据
    await initPage()

    ElMessage.success(t("main.opt.success"))
  }
}

// @ts-ignore
const oneclickAttr = async (hideTip) => {
  isGenLoading.value = true
  await makeSlug(true)

  await makeDesc(true)

  await fetchTag(true)

  // 发布属性
  await saveAttrToSiyuan(true)
  logUtil.logInfo("发布属性完成")

  isGenLoading.value = false
  if (hideTip !== true) {
    ElMessage.success(t("main.publish.oneclick.attr.finish"))
  }
}

// @ts-ignore
const cheeckLimit = (lastmodKey) => {
  const flag = false

  const lastmodDate = getConf(lastmodKey)
  // 没发布过，不限制
  if (isEmptyString(lastmodDate)) {
    return false
  }
  logUtil.logInfo("cheeckLimit lastmodKey=>", lastmodKey)
  logUtil.logInfo("cheeckLimit lastmodDate=>", lastmodDate)

  const s = calcLastSeconds(lastmodDate)
  if (s <= props.limitSeconds) {
    ElMessage.error(
      "由于【" +
        props.apiType +
        "】平台的限制，每6分钟之内只能发布或者更新一次文章，距离上一次发布时间为：" +
        s +
        "秒，仍需等待：" +
        (props.limitSeconds - s) +
        "秒"
    )
    return true
  }

  return flag
}

const publishConfirm = async () => {
  // 发布内容
  const data = await getPageMd(siyuanData.pageId)
  const md = data.content
  if (props.removeImage && imageParser.hasExtenalImages(md)) {
    ElMessageBox.confirm(
      "检测到外链图片，由于平台限制，继续发布将剔除这些图片，以纯文本发布，是否继续？",
      t("main.opt.warning"),
      {
        confirmButtonText: t("main.opt.ok"),
        cancelButtonText: t("main.opt.cancel"),
        type: "warning",
      }
    )
      .then(async () => {
        await doPublish()
      })
      .catch(() => {
        logUtil.logInfo("操作已取消")
      })
  } else {
    await doPublish()
  }
}

const doPublish = async () => {
  if (!apiStatus.value) {
    ElMessage.error(t("setting.blog.vali.tip.metaweblog"))
    return
  }

  isPublishLoading.value = true

  try {
    // 检测发布频率
    const lastmodKey = props.apiType + "_PUBLISH_LIMIT"
    if (cheeckLimit(lastmodKey)) {
      isPublishLoading.value = false
      return
    }

    // 发布频率验证通过，更新发布时间
    logUtil.logInfo("验证通过，更新发布时间")
    const lastmodDate = new Date().toISOString()
    setConf(lastmodKey, lastmodDate)

    // 生成属性
    await oneclickAttr(true)

    // api可用并且开启了发布
    const commonblogCfg = getJSONConf<ICommonblogCfg>(props.apiType)

    const api = new API(props.apiType)

    // 组装文章数据
    // ===============================
    // 文章标题
    const fmtTitle = removeTitleNumber(formData.title)
    // 发布内容
    let content
    const data = await getPageMd(siyuanData.pageId)
    let md = data.content

    // 检测是否需要转换成base64
    // 不行
    // if (props.imageToBase64) {
    //   ElMessage.warning("使用base64可能会导致请求体太大请求失败，请知悉")
    //   md = await imageParser.replaceImagesWithBase64(md)
    // }

    if (props.removeImage) {
      md = imageParser.removeImages(md)
    }

    if (PageType.Html === commonblogCfg.pageType) {
      const html = mdToHtml(md)
      content = removeWidgetTag(html)
    } else {
      // logUtil.logWarn("md=>", md)
      content = removeMdWidgetTag(md)
    }
    // ===============================
    const post = new Post()
    post.title = fmtTitle
    post.wp_slug = formData.customSlug
    post.description = content
    post.categories = formData.categories
    post.cate_slugs = formData.cat_slugs
    post.mt_keywords = formData.tag.dynamicTags.join(",")
    post.dateCreated = new Date()
    // 默认是已发布
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

      logUtil.logInfo("文章已更新，postid=>", postid)
    } else {
      postid = await api.newPost(post, publish)
      // 这里是发布成功之后
      if (post.cate_slugs && post.cate_slugs.length > 0) {
        const repo = post.cate_slugs[0]
        // const repoName = post.categories[0]
        // const conf = getJSONConf<ICommonblogCfg>(props.apiType)
        // if (!isEmptyObject(conf)) {
        //   conf.blogid = repo
        //   conf.blogName = repoName
        //   setJSONConf<ICommonblogCfg>(props.apiType, conf)
        // }
        postid = postid + "_" + repo
      }

      // 属性获取postidKey
      logUtil.logInfo("当前保存的posidKey=>", commonblogCfg.posidKey)
      const customAttr = {
        [commonblogCfg.posidKey || ""]: postid,
      }
      await setPageAttrs(siyuanData.pageId, customAttr)
      logUtil.logInfo("CommonblogMain发布成功，保存postid,meta=>", customAttr)

      logUtil.logInfo("文章发布成功，postid=>", postid)
    }

    // 刷新属性数据
    await initPage()

    ElMessage.success(t("main.opt.success"))
  } catch (e) {
    isPublishLoading.value = false

    logUtil.logError("发布异常", e)
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
// @ts-ignore
const doCancel = async (isInit) => {
  const commonblogCfg = getJSONConf<ICommonblogCfg>(props.apiType)
  logUtil.logInfo("准备取消发布，postid=>", formData.postid)

  // 先清空ID
  const customAttr = {
    [commonblogCfg.posidKey || ""]: "",
  }
  await setPageAttrs(siyuanData.pageId, customAttr)
  logUtil.logInfo("MetaweblogMain取消发布,meta=>", customAttr)

  // 强制在平台删除一次
  try {
    const api = new API(props.apiType)
    const flag = await api.deletePost(formData.postid)
    if (!flag) {
      ElMessage.error("文章删除失败")
      throw new Error("文章删除失败")
    }
  } catch (e) {
    logUtil.logError("强行删除一次", e)
  }

  // 刷新属性数据
  if (isInit) {
    await initPage()
  }
}
</script>

<script lang="ts">
export default {
  name: "CommonBlogMain",
}
</script>

<style scoped>
.common-main {
  padding: 0;
}
</style>
