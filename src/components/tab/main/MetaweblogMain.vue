<template>
  <el-container>
    <el-main class="blog-main">
      <el-alert class="top-version-tip" :title="apiTypeInfo + blogName" type="info"
                :closable="false"/>
      <el-form label-width="120px">
        <!-- 强制刷新 -->
        <el-form-item :label="$t('main.force.refresh')" v-if="editMode">
          <el-switch v-model="forceRefresh"/>
          <el-alert :title="$t('main.force.refresh.tip')" type="warning" :closable="false" v-if="!forceRefresh"/>
        </el-form-item>

        <!-- 编辑模式 -->
        <el-form-item :label="$t('main.publish.vuepress.editmode')">
          <el-button :type="editMode?'default':'primary'" @click="simpleMode">{{
              $t('main.publish.vuepress.editmode.simple')
            }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button :type="editMode?'primary':'default'" @click="complexMode">{{
              $t('main.publish.vuepress.editmode.complex')
            }}
          </el-button>
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
        <el-form-item :label="$t('main.tag')" v-if="editMode">
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

        <!-- 操作 -->
        <el-form-item v-if="editMode">
          <el-button type="primary" @click="saveAttrToSiyuan">{{ $t('main.save.attr.to.siyuan') }}</el-button>
        </el-form-item>

        <!--
        ----------------------------------------------------------------------
        -->

        <!-- 一键生成属性-->
        <el-form-item :label="$t('main.opt.quick')">
          <el-button type="primary" @click="oneclickAttr" :loading="isGenLoading">
            {{ isGenLoading ? $t('main.opt.loading') : $t('main.publish.oneclick.attr') }}
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="publishPage">{{ $t('main.publish') }}</el-button>
          <el-button>{{ $t('main.cancel') }}</el-button>
          <el-button type="danger" text>{{ $t('main.publish.status.unpublish') }}</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, reactive, ref} from "vue"
import {getPage, getPageAttrs, getPageId, getPageMd, setPageAttrs} from "../../../lib/platform/siyuan/siyuanUtil";
import {ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";
import {SIYUAN_PAGE_ATTR_KEY} from "../../../lib/constants/siyuanPageConstants";
import {cutWords, formatNumToZhDate, jiebaToHotWords, pingyinSlugify, zhSlugify} from "../../../lib/util";
import log from "../../../lib/logUtil";
import {mdToHtml, parseHtml} from "../../../lib/htmlUtil";
import {CONSTANTS} from "../../../lib/constants/constants";
import {getJSONConf} from "../../../lib/config";
import {IMetaweblogCfg} from "../../../lib/platform/metaweblog/IMetaweblogCfg";
import shortHash from "shorthash2";
import {API} from "../../../lib/api";
import {Post} from "../../../lib/common/post";

const {t} = useI18n()

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false
  },
  apiType: {
    type: String,
    default: ""
  }
})

const blogName = ref("")
const apiTypeInfo = ref(t('setting.blog.platform.support.metaweblog') + props.apiType + " ")

const isSlugLoading = ref(false)
const isDescLoading = ref(false)
const isTagLoading = ref(false)
const isGenLoading = ref(false)
const isPublishLoading = ref(false)

const editMode = ref(false)
const forceRefresh = ref(false)
const slugHashEnabled = ref(false)

const formData = reactive({
  customSlug: "",
  desc: "",
  created: "",
  checkList: ['1'],
  tag: {
    inputValue: "",
    dynamicTags: <string[]>([]),
    inputVisible: false
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
  const pageId = await getPageId(true);
  if (!pageId || pageId === "") {
    return
  }

  // conf
  const conf = getJSONConf<IMetaweblogCfg>(props.apiType)
  if (conf) {
    blogName.value = conf.blogName
  }

  // 默认开启hash
  slugHashEnabled.value = true

  // 思源笔记数据
  siyuanData.pageId = pageId;
  siyuanData.meta = await getPageAttrs(pageId)
  const page = await getPage(pageId)
  console.log("MetaweblogMain初始化页面,meta=>", siyuanData.meta);

  // 表单数据
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
}

onMounted(async () => {
  await initPage()
})

function checkForce() {
  // 别名不为空，默认不刷新
  if (formData.customSlug != "" && !forceRefresh.value) {
    // ElMessage.warning(t('main.force.refresh.tip'))
    log.logWarn(t('main.force.refresh.tip'))
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
  // log.logInfo("meta=>", siyuanData.value.meta)
  log.logInfo("page=>", page)
  // 获取标题
  // @ts-ignore
  // const title = siyuanData.value.meta.title;
  const title = page.content;
  log.logInfo("title=>", title)
  if (formData.checkList.length > 0) {
    // 调用Google翻译API
    const result = await zhSlugify(title);
    log.logInfo("result=>", result)
    if (result) {
      formData.customSlug = result
    } else {
      ElMessage.success(t('main.opt.failure'))
    }
  } else {
    formData.customSlug = await pingyinSlugify(title);
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
  if (!checkForce()) {
    return
  }

  isDescLoading.value = true
  const data = await getPageMd(siyuanData.pageId);

  const md = data.content
  let html = mdToHtml(md)
  // formData.value.desc = html;
  formData.desc = parseHtml(html, CONSTANTS.MAX_PREVIEW_LENGTH, true)

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
  if (!checkForce()) {
    return
  }

  isTagLoading.value = true
  const data = await getPageMd(siyuanData.pageId);

  const md = data.content
  const genTags = await cutWords(md)
  log.logInfo("genTags=>", genTags)

  const hotTags = jiebaToHotWords(genTags, 5)
  log.logInfo("hotTags=>", hotTags)

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
  console.log("MetaweblogMain保存属性到思源笔记,meta=>", customAttr);

  // 单独调用才去刷新数据，否则自行刷新数据
  if (hideTip != true) {
    // 刷新属性数据
    await initPage();

    ElMessage.success(t('main.opt.success'))
  }
}

const oneclickAttr = async (hideTip?: boolean) => {
  isGenLoading.value = true
  await makeSlug(true)

  await makeDesc(true)

  await fetchTag(true)

  // 发布属性
  await saveAttrToSiyuan(true)
  log.logWarn("发布属性完成")

  isGenLoading.value = false
  if (hideTip != true) {
    ElMessage.success(t('main.publish.oneclick.attr.finish'))
  }
}

const publishPage = async () => {
  isPublishLoading.value = true

  // 生成属性
  await oneclickAttr(true)

  // api可用并且开启了发布
  // TODO
  const api = new API(props.apiType)

  // 组装文章数据
  const post = new Post()
  post.title = "自动发布测试"
  post.description = "自动发布的测试内容"
  post.categories = ["标签1", "标签2"]
  post.dateCreated = new Date()
  // post.link = ""
  // post.permalink = ""
  // post.postid = ""

  const postid = await api.newPost(post)
  log.logWarn("文章发布成功，postid=>", postid)

  // 这里是发布成功之后
  // 属性获取postidKey
  const metaweblogCfg = getJSONConf<IMetaweblogCfg>(props.apiType)
  log.logWarn("当前保存的posidKey=>", metaweblogCfg.posidKey)
  const customAttr = {
    [metaweblogCfg.posidKey]: postid,
  };
  // await setPageAttrs(siyuanData.pageId, customAttr)
  log.logInfo("MetaweblogMain发布成功，保存postid,meta=>", customAttr);

  // 刷新属性数据
  //  initPage();

  isPublishLoading.value = false
  ElMessage.success(t('main.opt.success'))
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