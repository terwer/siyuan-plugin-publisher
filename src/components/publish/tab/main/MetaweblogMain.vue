<template>
  <el-container>
    <el-main class="blog-main" v-if="!isInitLoadding">
      <el-alert class="top-version-tip" :title="apiTypeInfo + blogName" type="info"
                :closable="false"/>
      <el-alert class="top-version-tip" :title="$t('setting.blog.vali.tip.metaweblog')" type="error" :closable="false"
                v-if="!apiStatus"/>
      <el-alert class="top-version-tip" :title="$t('setting.conf.tip')" type="info" :closable="false"
                v-if="useAdaptor"/>
      <el-form label-width="120px">
        <!-- 编辑模式 -->
        <el-form-item :label="$t('main.publish.editmode')">
          <el-button-group>
            <el-button :type="editMode?'default':'primary'" @click="simpleMode">{{
                $t('main.publish.editmode.simple')
              }}
            </el-button>
            <el-button :type="editMode?'primary':'default'" @click="complexMode">{{
                $t('main.publish.editmode.complex')
              }}
            </el-button>
          </el-button-group>
        </el-form-item>

        <!-- 强制刷新 -->
        <el-form-item :label="$t('main.force.refresh')" v-if="editMode">
          <el-switch v-model="forceRefresh"/>
          <el-alert :title="$t('main.force.refresh.tip')" type="warning" :closable="false" v-if="!forceRefresh"/>
        </el-form-item>

        <!-- 文章别名 -->
        <el-form-item :label="$t('main.slug')" v-if="editMode">
          <el-input v-model="formData.customSlug"/>
        </el-form-item>
        <el-form-item v-if="editMode">
          <el-checkbox-group v-model="formData.checkList">
            <el-checkbox label="1">{{ $t('main.use.google.translate') }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="editMode">
          <el-button type="primary" class="make-slug-btn" @click="makeSlug" :loading="isSlugLoading">
            {{ isSlugLoading ? $t('main.opt.loading') : $t('main.auto.fetch.slug') }}
          </el-button>
        </el-form-item>
        <el-form-item :label="$t('main.use.hash')" v-if="editMode">
          <el-switch v-model="slugHashEnabled"/>
          <el-alert :title="$t('main.use.hash.tip')" type="warning" :closable="false" v-if="!slugHashEnabled"/>
        </el-form-item>

        <!-- 摘要 -->
        <el-form-item :label="$t('main.desc')" v-if="editMode">
          <el-input type="textarea" v-model="formData.desc"/>
        </el-form-item>
        <el-form-item v-if="editMode">
          <el-button type="primary" @click="makeDesc" :loading="isDescLoading">
            {{ isDescLoading ? $t('main.opt.loading') : $t('main.auto.fetch.desc') }}
          </el-button>
        </el-form-item>

        <!-- 创建时间 -->
        <el-form-item :label="$t('main.create.time')" v-if="editMode">
          <el-date-picker type="datetime" v-model="formData.created" format="YYYY-MM-DD HH:mm:ss"
                          value-format="YYYY-MM-DD HH:mm:ss" :placeholder="$t('main.create.time.placeholder')"/>
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
            {{ $t('main.tag.new') }}
          </el-button>
        </el-form-item>
        <el-form-item v-if="editMode">
          <el-button type="primary" @click="fetchTag" :loading="isTagLoading">
            {{ isTagLoading ? $t('main.opt.loading') : $t('main.auto.fetch.tag') }}
          </el-button>
        </el-form-item>
        <!-- 标签开关 -->
        <el-form-item :label="$t('main.tag.auto.switch')">
          <el-switch v-model="tagSwitch"/>
        </el-form-item>

        <!-- 分类 -->
        <el-form-item :label="$t('main.cat')" style="width: 100%;">
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
        <el-form-item :label="$t('main.opt.quick')">
          <el-button type="primary" @click="oneclickAttr" :loading="isGenLoading">
            {{ isGenLoading ? $t('main.opt.loading') : $t('main.publish.oneclick.attr') }}
          </el-button>
        </el-form-item>

        <!-- 保存属性 -->
        <el-form-item>
          <el-button type="primary" @click="saveAttrToSiyuan">{{ $t('main.save.attr.to.siyuan') }}</el-button>
        </el-form-item>

        <!-- 发布操作 -->
        <el-form-item label="">
          <el-button type="primary" @click="doPublish" :loading="isPublishLoading">{{
              isPublishLoading ? $t('main.publish.loading') :
                  isPublished ? $t('main.update') : $t('main.publish')
            }}
          </el-button>
          <el-button @click="cancelPublish" :loading="isCancelLoading">{{ $t('main.cancel') }}</el-button>
        </el-form-item>

        <!-- 文章状态 -->
        <el-form-item>
          <el-button type="danger" text disabled>
            {{ isPublished ? $t('main.publish.status.published') : $t('main.publish.status.unpublish') }}
          </el-button>
          <a :href="previewUrl" :title="previewUrl" target="_blank"
             v-if="isPublished">{{ $t('main.publish.vuepress.see.preview') }}</a>
        </el-form-item>
      </el-form>
    </el-main>
    <el-skeleton :loading="isInitLoadding" :rows="5" animated/>
  </el-container>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, reactive, ref} from "vue"
import {getPage, getPageAttrs, getPageId, getPageMd, setPageAttrs} from "~/utils/platform/siyuan/siyuanUtil";
import {ElMessage, ElMessageBox} from "element-plus";
import {useI18n} from "vue-i18n";
import {SIYUAN_PAGE_ATTR_KEY} from "~/utils/constants/siyuanPageConstants";
import {
  cutWords,
  formatNumToZhDate,
  getPublishStatus,
  isEmptyObject,
  isEmptyString,
  jiebaToHotWords,
  pingyinSlugify,
  zhSlugify
} from "~/utils/util";
import logUtil from "~/utils/logUtil";
import {
  mdToHtml,
  mdToPlainText,
  parseHtml,
  removeMdWidgetTag,
  removeTitleNumber,
  removeWidgetTag
} from "~/utils/htmlUtil";
import {CONSTANTS} from "~/utils/constants/constants";
import {getJSONConf} from "~/utils/config";
import {IMetaweblogCfg, PageType} from "~/utils/platform/metaweblog/IMetaweblogCfg";
import shortHash from "shorthash2";
import {API} from "~/utils/api";
import {Post} from "~/utils/common/post";
import {API_TYPE_CONSTANTS} from "~/utils/constants/apiTypeConstants";
import {CategoryInfo} from "~/utils/common/categoryInfo";

const {t} = useI18n()

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false
  },
  apiType: {
    type: String,
    default: ""
  },
  useAdaptor: {
    type: Boolean,
    default: false
  },
  pageId: {
    type: String,
    default: undefined
  }
})

const blogName = ref("")
const apiTypeInfo = ref(t('setting.blog.platform.support.metaweblog') + props.apiType + " ")
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

const formData = reactive({
  // 新增时候这个值是空的
  postid: "",
  title: "",
  customSlug: "",
  desc: "",
  created: "",
  checkList: ['1'],
  tag: {
    inputValue: "",
    dynamicTags: <string[]>([]),
    inputVisible: false
  },
  cat: {
    categorySelected: [],
    categoryList: []
  },
  categories: ["默认分类"]
})

const siyuanData = reactive({
  pageId: "",
  meta: {
    tags: ""
  }
})

const simpleMode = () => {
  editMode.value = false
}
const complexMode = () => {
  editMode.value = true
}

const initPage = async () => {
  isInitLoadding.value = true

  const pageId = await getPageId(true, props.pageId);
  if (!pageId || pageId === "") {
    return
  }

  // conf
  let conf = getJSONConf<IMetaweblogCfg>(props.apiType)
  if (!isEmptyObject(conf)) {
    blogName.value = conf.blogName
  }

  // 默认开启hash
  slugHashEnabled.value = true

  // 思源笔记数据
  siyuanData.pageId = pageId;
  siyuanData.meta = await getPageAttrs(pageId)
  const page = await getPage(pageId)
  if (!page) {
    isInitLoadding.value = false
    ElMessage.error(t('config.error.msg') + "_" + props.apiType)
    throw new Error(t('config.error.msg') + "_" + props.apiType)
  }
  logUtil.logInfo("MetaweblogMain初始化页面,meta=>", siyuanData.meta);

  // 表单数据
  formData.title = page.content
  // @ts-ignore
  formData.customSlug = siyuanData.meta[SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY];
  // @ts-ignore
  formData.desc = siyuanData.meta[SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_DESC_KEY];
  formData.created = formatNumToZhDate(page.created)

  // 标签
  formData.tag.dynamicTags = [];
  const tagstr = siyuanData.meta.tags || ""
  const tgarr = tagstr.split(",")
  for (let i = 0; i < tgarr.length; i++) {
    const tg = tgarr[i]
    if (tg != "") {
      formData.tag.dynamicTags.push(tgarr[i])
    }
  }

  // 发布状态
  isPublished.value = getPublishStatus(props.apiType, siyuanData.meta)

  // ============================
  // 依赖于特定平台的数据初始化开始
  // ===========================
  const metaweblogCfg = getJSONConf<IMetaweblogCfg>(props.apiType)
  const api = new API(props.apiType)
  // 选中的分类
  let catData: any = []

  // 更新预览链接
  if (isPublished.value) {
    // 读取postid
    const meta: any = siyuanData.meta
    formData.postid = meta[metaweblogCfg.posidKey]

    // 路径组合
    previewUrl.value = await api.getPreviewUrl(formData.postid.toString())

    try {
      // 如果文章选择了分类，初始化分类
      const post: Post = await api.getPost(formData.postid.toString())
      catData = post.categories

      logUtil.logInfo("postid=>", formData.postid)
      logUtil.logInfo("post=>", post)
      logUtil.logInfo("初始化选择过的分类,catData=>", catData)
    } catch (e) {
      // 强制删除
      ElMessage.error(t('post.delete.by.platform'))

      isInitLoadding.value = false
      logUtil.logError("文章新获取失败", e)
    }
  }

  // 全部文章分类请求
  let catInfo: CategoryInfo[] = []
  try {
    catInfo = await api.getCategories()
  } catch (e) {
    isInitLoadding.value = false
    logUtil.logError("分类获取失败", e)
  }
  logUtil.logInfo("catInfo=>", catInfo)

  // 组装分类
  let catArr: any = []
  if (catInfo && catInfo.length && catInfo.length > 0) {
    catInfo.forEach(item => {
      const cat = {
        value: item.description,
        label: item.description
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
    logUtil.logInfo(t('main.force.refresh.tip'))
    return false
  }

  return true
}

const makeSlug = async (hideTip?: boolean) => {
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
    fmtTitle = fmtTitle.replace(/\d*\./g, "");
  }
  logUtil.logInfo("fmtTitle=>", fmtTitle)
  if (formData.checkList.length > 0) {
    // 调用Google翻译API
    const result = await zhSlugify(fmtTitle);
    logUtil.logInfo("result=>", result)
    if (result) {
      formData.customSlug = result
    } else {
      ElMessage.success(t('main.opt.failure'))
    }
  } else {
    formData.customSlug = await pingyinSlugify(fmtTitle);
  }

  // add hash
  if (slugHashEnabled.value) {
    const newstr = page.content + (new Date().toISOString())
    const hashstr = "-" + shortHash(newstr).toLowerCase()
    formData.customSlug += hashstr
  }

  isSlugLoading.value = false
  if (hideTip != true) {
    ElMessage.success(t('main.opt.success'))
  }
}

const makeDesc = async (hideTip?: boolean) => {
  isDescLoading.value = true
  const data = await getPageMd(siyuanData.pageId);

  const md = data.content
  const plainText = mdToPlainText(md)
  formData.desc = parseHtml(plainText, CONSTANTS.MAX_PREVIEW_LENGTH, true)

  isDescLoading.value = false
  if (hideTip != true) {
    ElMessage.success(t('main.opt.success'))
  }
}

const tagHandleClose = (tag: any) => {
  formData.tag.dynamicTags.splice(formData.tag.dynamicTags.indexOf(tag), 1)
}
// https://stackoverflow.com/questions/64774113/vue-js-3-use-autofocus-on-input-with-ref-inside-a-method
// https://stackoverflow.com/questions/64774113/vue-js-3-use-autofocus-on-input-with-ref-inside-a-method
// https://www.helloworld.net/p/2721375043
const tagRefInput = ref();
const tagShowInput = () => {
  formData.tag.inputVisible = true

  // this.$refs.tagRefInput.focus()
  nextTick(() => {
    tagRefInput.value.focus();
  });
}
const tagHandleInputConfirm = () => {
  if (formData.tag.inputValue) {
    formData.tag.dynamicTags.push(formData.tag.inputValue)
  }
  formData.tag.inputVisible = false
  formData.tag.inputValue = ''
}

async function fetchTag(hideTip?: boolean) {
  if (!tagSwitch.value) {
    ElMessage.warning(t('main.tag.auto.switch.no.tip'))
    return
  }

  isTagLoading.value = true
  const data = await getPageMd(siyuanData.pageId);

  const md = data.content
  const genTags = await cutWords(md)
  logUtil.logInfo("genTags=>", genTags)

  const hotTags = jiebaToHotWords(genTags, 5)
  logUtil.logInfo("hotTags=>", hotTags)

  // 如果标签不存在，保存新标签到表单
  for (let i = 0; i < hotTags.length; i++) {
    if (!formData.tag.dynamicTags.includes(hotTags[i])) {
      formData.tag.dynamicTags.push(hotTags[i])
    }
  }

  isTagLoading.value = false
  if (hideTip != true) {
    ElMessage.success(t('main.opt.success'))
  }
}

const saveAttrToSiyuan = async (hideTip?: boolean) => {
  const customAttr = {
    [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY]: formData.customSlug,
    [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_DESC_KEY]: formData.desc,
    tags: formData.tag.dynamicTags.join(",")
  };
  await setPageAttrs(siyuanData.pageId, customAttr)
  logUtil.logInfo("MetaweblogMain保存属性到思源笔记,meta=>", customAttr);

  // 单独调用才去刷新数据，否则自行刷新数据
  if (hideTip != true) {
    // 刷新属性数据
    await initPage();

    ElMessage.success(t('main.opt.success'))
  }
}

const handleCatNodeClick = (event: any, data: any, node: any, nodeItem: any) => {
  // console.log("data=>", data)
  // console.log("node=>", node)
}

const handleCatNodeCheck = (data: any, status: any) => {
  console.log("data=>", data)
  console.log("status=>", status)

  let cats: any = []
  const values = status.checkedKeys
  values.forEach((item: any) => {
    cats.push(item.toString())
  })
  formData.categories = cats
  logUtil.logInfo(" formData.categories=>", formData.categories)
}


const oneclickAttr = async (hideTip?: boolean) => {
  isGenLoading.value = true
  await makeSlug(true)

  await makeDesc(true)

  await fetchTag(true)

  // 发布属性
  await saveAttrToSiyuan(true)
  logUtil.logInfo("发布属性完成")

  isGenLoading.value = false
  if (hideTip != true) {
    ElMessage.success(t('main.publish.oneclick.attr.finish'))
  }
}

const doPublish = async () => {
  if (!apiStatus.value) {
    ElMessage.error(t('setting.blog.vali.tip.metaweblog'))
    return
  }

  isPublishLoading.value = true

  try {

    // 生成属性
    await oneclickAttr(true)

    // api可用并且开启了发布
    const metaweblogCfg = getJSONConf<IMetaweblogCfg>(props.apiType)

    const api = new API(props.apiType)

    // 组装文章数据
    // ===============================
    // 标题处理
    let fmtTitle = removeTitleNumber(formData.title)
    // 发布内容
    let content
    const data = await getPageMd(siyuanData.pageId);
    const md = data.content
    if (PageType.Html == metaweblogCfg.pageType) {
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
    post.mt_keywords = formData.tag.dynamicTags.join(",")
    // 博客园的Markdown
    if (props.apiType == API_TYPE_CONSTANTS.API_TYPE_CNBLOGS) {
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

      logUtil.logInfo("文章已更新，postid=>", postid)
    } else {
      postid = await api.newPost(post, publish)
      // 这里是发布成功之后
      // 属性获取postidKey
      logUtil.logInfo("当前保存的posidKey=>", metaweblogCfg.posidKey)
      const customAttr = {
        [metaweblogCfg.posidKey]: postid,
      };
      await setPageAttrs(siyuanData.pageId, customAttr)
      logUtil.logInfo("MetaweblogMain发布成功，保存postid,meta=>", customAttr);

      logUtil.logInfo("文章发布成功，postid=>", postid)
    }

    // 刷新属性数据
    await initPage();

    ElMessage.success(t('main.opt.success'))
  } catch (e: any) {
    logUtil.logError("发布异常")
    ElMessage.error(t('main.opt.failure'))
    throw new Error(e)
  }

  isPublishLoading.value = false
}

const cancelPublish = async () => {
  isCancelLoading.value = true;

  ElMessageBox.confirm(
      t('main.opt.warning.tip'),
      t('main.opt.warning'),
      {
        confirmButtonText: t('main.opt.ok'),
        cancelButtonText: t('main.opt.cancel'),
        type: 'warning',
      }
  ).then(async () => {
    await doCancel(true)

    isCancelLoading.value = false;

    ElMessage.warning(t('main.opt.status.cancel'))
  }).catch((e) => {
    ElMessage({
      type: 'error',
      message: t("main.opt.failure"),
    })
    isCancelLoading.value = false;

    throw new Error(e)
  })
}

// 实际删除逻辑
const doCancel = async (isInit: boolean) => {
  const metaweblogCfg = getJSONConf<IMetaweblogCfg>(props.apiType)
  logUtil.logInfo("准备取消发布，postid=>", formData.postid)

  // 先清空ID
  const customAttr = {
    [metaweblogCfg.posidKey]: ""
  };
  await setPageAttrs(siyuanData.pageId, customAttr)
  logUtil.logInfo("MetaweblogMain取消发布,meta=>", customAttr);

  // 在平台强行删除一次
  try {
    const api = new API(props.apiType)
    const flag = await api.deletePost(formData.postid)
    if (!flag) {
      ElMessage.error("文章删除失败")
      // throw new Error("文章删除失败")
    }
  } catch (e) {
    logUtil.logError("强行删除一次", e)
  }

  // 刷新属性数据
  if (isInit) {
    await initPage();
  }
}
</script>

<script lang="ts">
export default {
  name: "MetaweblogMain"
}
</script>

<style scoped>
.blog-main {
  padding: 0;
}
</style>