<template>
  <el-container>
    <el-aside width="45%">
      <el-alert class="top-version-tip" :title="$t('main.publish.vuepress.tip')" type="success" :closable="false"/>
      <el-form label-width="100px">
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

        <!-- 别名 -->
        <el-form-item :label="$t('main.slug')" v-if="editMode">
          <el-input v-model="formData.customSlug"/>
        </el-form-item>
        <el-form-item v-if="editMode">
          <el-checkbox-group v-model="formData.checkList">
            <el-checkbox label="1">{{ $t('main.use.google.translate') }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('main.use.hash')" v-if="editMode">
          <el-switch v-model="slugHashEnabled"/>
          <el-alert :title="$t('main.use.hash.tip')" type="warning" :closable="false" v-if="!slugHashEnabled"/>
        </el-form-item>
        <el-form-item v-if="editMode">
          <el-button type="primary" class="make-slug-btn" @click="makeSlug" :loading="isSlugLoading">
            {{ isSlugLoading ? $t('main.opt.loading') : $t('main.auto.fetch.slug') }}
          </el-button>
        </el-form-item>

        <!-- 文章摘要 -->
        <el-form-item :label="$t('main.desc')" v-if="editMode">
          <el-input type="textarea" v-model="formData.desc"/>
        </el-form-item>
        <el-form-item v-if="editMode">
          <el-button type="primary" @click="makeDesc" :loading="isDescLoading">
            {{ isDescLoading ? $t('main.opt.loading') : $t('main.auto.fetch.desc') }}
          </el-button>
        </el-form-item>

        <!-- 发布时间 -->
        <el-form-item :label="$t('main.create.time')" v-if="editMode">
          <el-date-picker
              type="datetime"
              v-model="formData.created"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              @change="createTimeChanged"
              :placeholder="$t('main.create.time.placeholder')"
          />
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

        <!-- 保存属性 -->
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

        <!-- 启用Github发布 -->
        <el-form-item :label="$t('main.publish.vuepress.github')">
          <el-switch v-model="vuepressGithubEnabled" @change="githubOnChange"/>
          <el-alert :title="$t('main.publish.vuepress.github.tip')" type="info" :closable="false"
                    v-if="vuepressGithubEnabled"/>
        </el-form-item>
        <!-- 选择目录 -->
        <el-form-item :label="$t('main.publish.vuepress.choose.path')" v-if="vuepressGithubEnabled">
          menu
        </el-form-item>
        <!-- 设置文件名 -->
        <el-form-item :label="$t('main.publish.vuepress.choose.title')" v-if="vuepressGithubEnabled">
          <el-input v-model="formData.title"/>
          <el-alert :title="$t('main.publish.vuepress.choose.title.tip')" type="error" :closable="false"
                    v-if="vuepressGithubEnabled"/>
        </el-form-item>
        <!-- 发布操作 -->
        <el-form-item label="">
          <el-button type="primary" @click="publishPage" :loading="isPublishLoading">{{
              isPublishLoading ? $t('main.publish.loading') :
                  isPublished ? $t('main.update') : $t('main.publish')
            }}
          </el-button>
          <el-button @click="cancelPublish">{{ $t('main.cancel') }}</el-button>
        </el-form-item>
        <!-- 文章状态 -->
        <el-form-item>
          <el-button type="danger" text disabled>
            {{ isPublished ? $t('main.publish.status.published') : $t('main.publish.status.unpublish') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-aside>
    <el-main>
      <el-form label-width="75px">
        <el-form-item>
          {{ $t('main.yaml.formatter') }}
        </el-form-item>
        <el-form-item>
          <el-input v-model="vuepressData.vuepressFullContent" :autosize="{ minRows: 5, maxRows: 8 }"
                    v-on:focus="$event.target.select()" ref="fmtRefInput"
                    type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="convertAttrToYAML">{{ $t('main.siyuan.to.yaml') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="convertYAMLToAttr">{{ $t('main.yaml.to.siyuan') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="copyToClipboard">{{ $t('main.copy') }}</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import {onBeforeMount, ref} from "vue";
import {getPage, getPageAttrs, setPageAttrs, getPageId, getPageMd} from "../../../lib/siyuan/siyuanUtil";
import log from "../../../lib/logUtil"
import {SIYUAN_PAGE_ATTR_KEY} from "../../../lib/constants/siyuanPageConstants"
import {
  pingyinSlugify,
  zhSlugify,
  formatNumToZhDate,
  cutWords,
  jiebaToHotWords,
  covertStringToDate,
  formatIsoToZhDate,
  obj2yaml,
  yaml2Obj,
  getPublishStatus
} from "../../../lib/util";
import {useI18n} from "vue-i18n";
import {ElMessage} from "element-plus";
import {CONSTANTS} from "../../../lib/constants/constants";
import {mdToHtml, parseHtml, removeWidgetTag} from "../../../lib/htmlUtil";
import {nextTick} from 'vue'
import {API_TYPE_CONSTANTS} from "../../../lib/constants/apiTypeConstants";
import {PUBLISH_POSTID_KEY_CONSTANTS} from "../../../lib/publishUtil";
import copy from "copy-to-clipboard"
import shortHash from "shorthash2";

const {t} = useI18n()

const isSlugLoading = ref(false)
const isDescLoading = ref(false)
const isTagLoading = ref(false)
const isGenLoading = ref(false)
const isPublishLoading = ref(false)

let editMode = ref(false)
const slugHashEnabled = ref(false)
const vuepressGithubEnabled = ref(false)
let isPublished = ref(false)

const formData = ref({
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
  categories: ["默认分类"]
})
const siyuanData = ref({
  pageId: "",
  meta: {
    tags: ""
  }
})
const vuepressData = ref({
  yamlObj: {
    title: "",
    date: new Date(),
    permalink: "/post/convert-npm-dependencies-to-local.html",
    meta: [
      {
        name: "keywords",
        content: ""
      },
      {
        name: "description",
        content: ""
      }
    ],
    categories: <string[]>([]),
    tags: <string[]>([]),
    author: {
      name: "terwer",
      link: "https://github.com/terwer"
    }
  },
  formatter: "",
  vuepressContent: "",
  vuepressFullContent: ""
})

const simpleMode = () => {
  editMode.value = false
}
const complexMode = () => {
  editMode.value = true
}

async function initPage() {
  const pageId = await getPageId(true)
  log.logInfo("VuepressMain pageId=>", pageId)
  if (!pageId || pageId == "") {
    return
  }
  const page = await getPage(pageId)
  log.logWarn("VuepressMain获取主文档", page)

  // 思源笔记数据
  siyuanData.value.pageId = pageId;
  siyuanData.value.meta = await getPageAttrs(pageId)

  // 表单数据
  formData.value.title = page.content + ".md";
  // @ts-ignore
  formData.value.customSlug = siyuanData.value.meta[SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY];
  // @ts-ignore
  formData.value.desc = siyuanData.value.meta[SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_DESC_KEY];
  formData.value.created = formatNumToZhDate(page.created)

  formData.value.tag.dynamicTags = [];
  const tagstr = siyuanData.value.meta.tags || ""
  const tgarr = tagstr.split(",")
  for (let i = 0; i < tgarr.length; i++) {
    const tg = tgarr[i]
    if (tg != "") {
      formData.value.tag.dynamicTags.push(tgarr[i])
    }
  }

  // 表单属性转换为HTML
  convertAttrToYAML()

  // 发布状态
  isPublished.value = getPublishStatus(API_TYPE_CONSTANTS.API_TYPE_VUEPRESS, siyuanData.value.meta)
}

async function makeSlug(hideTip?: boolean) {
  isSlugLoading.value = true
  // 获取最新属性
  const page = await getPage(siyuanData.value.pageId)
  // BUG：目前attr的title不会即时更新
  // siyuanData.value.meta = await getPageAttrs(siyuanData.value.pageId)
  // log.logInfo("meta=>", siyuanData.value.meta)
  log.logInfo("page=>", page)
  // 获取标题
  // @ts-ignore
  // const title = siyuanData.value.meta.title;
  const title = page.content;
  log.logInfo("title=>", title)
  if (formData.value.checkList.length > 0) {
    // 调用Google翻译API
    const result = await zhSlugify(title);
    log.logInfo("result=>", result)
    if (result) {
      formData.value.customSlug = result
    } else {
      ElMessage.success(t('main.opt.failure'))
    }
  } else {
    formData.value.customSlug = await pingyinSlugify(title);
  }
  // add hash
  if (slugHashEnabled.value) {
    const newstr = page.content + (new Date().toISOString())
    const hashstr = "-" + shortHash(newstr).toLowerCase()
    formData.value.customSlug += hashstr
  }

  isSlugLoading.value = false
  if (hideTip != true) {
    ElMessage.success(t('main.opt.success'))
  }
}

async function makeDesc(hideTip?: boolean) {
  isDescLoading.value = true
  const data = await getPageMd(siyuanData.value.pageId);

  const md = data.content
  let html = mdToHtml(md)
  // formData.value.desc = html;
  formData.value.desc = parseHtml(html, CONSTANTS.MAX_PREVIEW_LENGTH, true)

  isDescLoading.value = false
  if (hideTip != true) {
    ElMessage.success(t('main.opt.success'))
  }
}

const createTimeChanged = (val: any) => {
  log.logInfo("createTimeChanged=>", val)
}

const tagHandleClose = (tag: any) => {
  formData.value.tag.dynamicTags.splice(formData.value.tag.dynamicTags.indexOf(tag), 1)
}
// https://stackoverflow.com/questions/64774113/vue-js-3-use-autofocus-on-input-with-ref-inside-a-method
// https://stackoverflow.com/questions/64774113/vue-js-3-use-autofocus-on-input-with-ref-inside-a-method
// https://www.helloworld.net/p/2721375043
const tagRefInput = ref();
const tagShowInput = () => {
  formData.value.tag.inputVisible = true

  // this.$refs.tagRefInput.focus()
  nextTick(() => {
    tagRefInput.value.focus();
  });
}
const tagHandleInputConfirm = () => {
  if (formData.value.tag.inputValue) {
    formData.value.tag.dynamicTags.push(formData.value.tag.inputValue)
  }
  formData.value.tag.inputVisible = false
  formData.value.tag.inputValue = ''
}

async function fetchTag(hideTip?: boolean) {
  isTagLoading.value = true
  const data = await getPageMd(siyuanData.value.pageId);

  const md = data.content
  const genTags = await cutWords(md)
  log.logInfo("genTags=>", genTags)

  const hotTags = jiebaToHotWords(genTags, 5)
  log.logInfo("hotTags=>", hotTags)

  // 如果标签不存在，保存新标签到表单
  for (let i = 0; i < hotTags.length; i++) {
    if (!formData.value.tag.dynamicTags.includes(hotTags[i])) {
      formData.value.tag.dynamicTags.push(hotTags[i])
    }
  }

  isTagLoading.value = false
  if (hideTip != true) {
    ElMessage.success(t('main.opt.success'))
  }
}

async function saveAttrToSiyuan(hideTip?: boolean) {
  const customAttr = {
    [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY]: formData.value.customSlug,
    [PUBLISH_POSTID_KEY_CONSTANTS.VUEPRESS_POSTID_KEY]: formData.value.customSlug,
    [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_DESC_KEY]: formData.value.desc,
    tags: formData.value.tag.dynamicTags.join(",")
  };
  await setPageAttrs(siyuanData.value.pageId, customAttr)
  log.logWarn("VuepressMain保存属性到思源笔记,meta=>", customAttr);

  // 刷新属性数据
  await initPage();

  if (hideTip != true) {
    ElMessage.success(t('main.opt.success'))
  }
}

const convertAttrToYAML = () => {
  // 表单属性转yamlObj
  log.logInfo("convertAttrToYAML,formData=>", formData)
  vuepressData.value.yamlObj.title = formData.value.title.replace(".md", "");
  vuepressData.value.yamlObj.permalink = "/post/" + formData.value.customSlug + ".html";
  vuepressData.value.yamlObj.date = covertStringToDate(formData.value.created)
  const meta = [
    {
      name: "keywords",
      content: formData.value.tag.dynamicTags.join(" ")
    },
    {
      name: "description",
      content: formData.value.desc
    }
  ];
  vuepressData.value.yamlObj.meta = meta;
  vuepressData.value.yamlObj.tags = formData.value.tag.dynamicTags;
  vuepressData.value.yamlObj.categories = formData.value.categories;

  // formatter
  let yaml = obj2yaml(vuepressData.value.yamlObj);
  // 修复yaml的ISO日期格式（js-yaml转换的才需要）
  yaml = formatIsoToZhDate(yaml, true)
  vuepressData.value.formatter = yaml
  vuepressData.value.vuepressFullContent = vuepressData.value.formatter;
}
const convertYAMLToAttr = () => {
  vuepressData.value.formatter = vuepressData.value.vuepressFullContent
  vuepressData.value.yamlObj = yaml2Obj(vuepressData.value.formatter)

  // yamlObj转表单属性
  log.logInfo("convertYAMLToAttr,yamlObj=>", vuepressData.value.yamlObj)
  formData.value.title = vuepressData.value.yamlObj.title + ".md"
  formData.value.customSlug = vuepressData.value.yamlObj.permalink.replace("/pages/", "")
      .replace("/post/", "").replace(".html", "")
      .replace("/", "")
  formData.value.created = formatIsoToZhDate(vuepressData.value.yamlObj.date.toISOString(), false)

  const yamlMeta = vuepressData.value.yamlObj.meta
  for (let i = 0; i < yamlMeta.length; i++) {
    const m = yamlMeta[i]
    if (m.name === "description") {
      formData.value.desc = m.content
      break
    }
  }

  for (let j = 0; j < vuepressData.value.yamlObj.tags.length; j++) {
    const tag = vuepressData.value.yamlObj.tags[j]
    if (!formData.value.tag.dynamicTags.includes(tag) && tag != "") {
      formData.value.tag.dynamicTags.push(tag)
    }
  }

  formData.value.categories = vuepressData.value.yamlObj.categories
}
const fmtRefInput = ref()
const copyToClipboard = () => {
  // this.$refs.fmtRefInput.focus();
  // document.execCommand('copy');

  nextTick(() => {
    fmtRefInput.value.focus();

    copy(vuepressData.value.vuepressFullContent)

    ElMessage.success(t('main.opt.success'))
  });
}

const githubOnChange = (val: boolean) => {
  if (val) {
    slugHashEnabled.value = true
  } else {
    slugHashEnabled.value = false
  }
}

async function publishPage() {
  isPublishLoading.value = true

  // 生成属性
  await oneclickAttr(true)
  // 发布属性
  await saveAttrToSiyuan(true)
  log.logWarn("发布属性完成")

  // 发布内容
  const data = await getPageMd(siyuanData.value.pageId);
  const md = removeWidgetTag(data.content)

  vuepressData.value.vuepressContent = md;
  vuepressData.value.vuepressFullContent = vuepressData.value.formatter + "\n" + vuepressData.value.vuepressContent;

  // 根据选项决定是否发送到Vuepress的Github参考
  log.logWarn("发布内容完成")

  isPublishLoading.value = false
  ElMessage.success(t('main.opt.status.publish'))
}

async function oneclickAttr(hideTip?: boolean) {
  isGenLoading.value = true
  await makeSlug(true)

  await makeDesc(true)

  await fetchTag(true)

  convertAttrToYAML()

  isGenLoading.value = false
  if (hideTip != true) {
    ElMessage.success(t('main.publish.oneclick.attr.finish'))
  }
}

async function cancelPublish() {
  const customAttr = {
    [PUBLISH_POSTID_KEY_CONSTANTS.VUEPRESS_POSTID_KEY]: ""
  };
  await setPageAttrs(siyuanData.value.pageId, customAttr)
  log.logWarn("VuepressMain取消发布,meta=>", customAttr);

  // 刷新属性数据
  await initPage();

  ElMessage.warning(t('main.opt.status.cancel'))
}

onBeforeMount(async () => {
  await initPage()
})
</script>

<script lang="ts">
export default {
  name: "VuepressMain",
}
</script>

<style scoped>
.top-version-tip {
  margin: 10px 0;
}

.el-alert {
  margin-top: 10px;
}
</style>