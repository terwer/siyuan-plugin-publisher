<template>
  <el-container>
    <el-main class="blog-main">
      <el-alert class="top-version-tip" :title="apiTypeInfo + blogName" type="info"
                :closable="false"/>
      <el-form label-width="120px">
        <!-- 强制刷新 -->
        <el-form-item :label="$t('main.force.refresh')">
          <el-switch v-model="forceRefresh"/>
          <el-alert :title="$t('main.force.refresh.tip')" type="warning" :closable="false" v-if="!forceRefresh"/>
        </el-form-item>

        <!-- 文章别名 -->
        <el-form-item :label="$t('main.slug')">
          <el-input v-model="formData.customSlug"/>
        </el-form-item>
        <el-form-item>
          <el-checkbox-group v-model="formData.checkList">
            <el-checkbox label="1">{{ $t('main.use.google.translate') }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="make-slug-btn" @click="makeSlug" :loading="isSlugLoading">
            {{ isSlugLoading ? $t('main.opt.loading') : $t('main.auto.fetch.slug') }}
          </el-button>
        </el-form-item>
        <el-form-item :label="$t('main.use.hash')">
          <el-switch v-model="slugHashEnabled"/>
          <el-alert :title="$t('main.use.hash.tip')" type="warning" :closable="false" v-if="!slugHashEnabled"/>
        </el-form-item>

        <!-- 摘要 -->
        <el-form-item :label="$t('main.desc')">
          <el-input type="textarea" v-model="formData.desc"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="makeDesc" :loading="isDescLoading">
            {{ isDescLoading ? $t('main.opt.loading') : $t('main.auto.fetch.desc') }}
          </el-button>
        </el-form-item>

        <el-form-item :label="$t('main.create.time')">
          <el-date-picker type="datetime" v-model="formData.created" format="YYYY-MM-DD HH:mm:ss"
                          value-format="YYYY-MM-DD HH:mm:ss" :placeholder="$t('main.create.time.placeholder')"/>
        </el-form-item>

        <el-form-item :label="$t('main.tag')">
          <el-tag closable>Tag 1</el-tag> &nbsp;&nbsp;
          <el-tag class="ml-2" type="success">Tag 2</el-tag> &nbsp;&nbsp;
          <el-tag class="ml-2" type="info">Tag 3</el-tag> &nbsp;&nbsp;
          <el-tag class="ml-2" type="warning">Tag 4</el-tag> &nbsp;&nbsp;
          <el-tag class="ml-2" type="danger">Tag 5</el-tag>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">{{ $t('main.auto.fetch.tag') }}</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveAttrToSiyuan">{{ $t('main.save.attr.to.siyuan') }}</el-button>
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
import {onMounted, reactive, ref} from "vue"
import {getPage, getPageAttrs, getPageId, getPageMd, setPageAttrs} from "../../../lib/platform/siyuan/siyuanUtil";
import {ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";
import {SIYUAN_PAGE_ATTR_KEY} from "../../../lib/constants/siyuanPageConstants";
import {formatNumToZhDate, pingyinSlugify, zhSlugify} from "../../../lib/util";
import log from "../../../lib/logUtil";
import {mdToHtml, parseHtml} from "../../../lib/htmlUtil";
import {CONSTANTS} from "../../../lib/constants/constants";
import {getJSONConf} from "../../../lib/config";
import {IMetaweblogCfg} from "../../../lib/platform/metaweblog/IMetaweblogCfg";
import shortHash from "shorthash2";

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

const forceRefresh = ref(false)
const slugHashEnabled = ref(false)

const formData = reactive({
  customSlug: "",
  desc: "",
  created: "",
  checkList: ['1'],
})

const siyuanData = reactive({
  pageId: "",
  meta: {}
})

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

const saveAttrToSiyuan = async () => {
  const customAttr = {
    "custom-slug": formData.customSlug,
    "custom-vuepress-slug": formData.customSlug,
    // [postidKey]: "99999",
  };
  await setPageAttrs(siyuanData.pageId, customAttr)
  console.log("MetaweblogMain保存属性到思源笔记,meta=>", customAttr);

  // 刷新属性数据
  await initPage();

  ElMessage.success(t('main.opt.success'))
}

const publishPage = () => {
  ElMessage.success(t('main.opt.success'))
}
</script>

<script lang="ts">
export default {
  name: "MetaweblogMain"
}
</script>

<style scoped>
.blog-main{
  padding: 0;
}
</style>