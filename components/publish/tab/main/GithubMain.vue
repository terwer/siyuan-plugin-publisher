<!--
  - Copyright (c) 2022, Terwer . All rights reserved.
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
  <div>
    <div>github main=>{{ props.apiType + ":" + props.pageId }}</div>
    <el-container v-if="!isInitLoading">
      <div class="normal-mode">
        <el-alert
          :closable="false"
          :title="$t('main.publish.vuepress.tip')"
          class="top-version-tip"
          type="info"
        />
        <el-alert
          v-if="false"
          :closable="false"
          :title="$t('main.publish.vuepress.error.tip')"
          class="top-version-tip"
          type="error"
        />
        <el-form label-width="100px">
          <!-- 编辑模式 -->
          <el-form-item :label="$t('main.publish.vuepress.editmode')">
            <el-button-group>
              <el-button
                :type="editMode ? 'default' : 'primary'"
                @click="simpleMode"
                >{{ $t("main.publish.vuepress.editmode.simple") }}
              </el-button>
              <el-button
                :type="editMode ? 'primary' : 'default'"
                @click="complexMode"
                >{{ $t("main.publish.vuepress.editmode.complex") }}
              </el-button>
            </el-button-group>
          </el-form-item>

          <!-- 强制刷新 -->
          <el-form-item v-if="editMode" :label="$t('main.force.refresh')">
            <el-switch v-model="forceRefresh" />
            <el-alert
              v-if="!forceRefresh"
              :closable="false"
              :title="$t('main.force.refresh.tip')"
              type="warning"
            />
          </el-form-item>

          <!-- 别名 -->
          <el-form-item v-if="editMode" :label="$t('main.slug')">
            <el-input v-model="formData.customSlug" />
          </el-form-item>
          <el-form-item v-if="editMode">
            <el-checkbox-group v-model="formData.checkList">
              <el-checkbox label="1"
                >{{ $t("main.use.google.translate") }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-if="editMode" :label="$t('main.use.hash')">
            <el-switch v-model="slugHashEnabled" />
            <el-alert
              v-if="!slugHashEnabled"
              :closable="false"
              :title="$t('main.use.hash.tip')"
              type="warning"
            />
          </el-form-item>
          <el-form-item v-if="editMode">
            <el-button
              :loading="isSlugLoading"
              class="make-slug-btn"
              type="primary"
              @click="makeSlug"
            >
              {{
                isSlugLoading
                  ? $t("main.opt.loading")
                  : $t("main.auto.fetch.slug")
              }}
            </el-button>
          </el-form-item>

          <!-- 文章摘要 -->
          <el-form-item v-if="editMode" :label="$t('main.desc')">
            <el-input v-model="formData.desc" type="textarea" />
          </el-form-item>
          <el-form-item v-if="editMode">
            <el-button
              :loading="isDescLoading"
              type="primary"
              @click="makeDesc"
            >
              {{
                isDescLoading
                  ? $t("main.opt.loading")
                  : $t("main.auto.fetch.desc")
              }}
            </el-button>
          </el-form-item>

          <!-- 发布时间 -->
          <el-form-item v-if="editMode" :label="$t('main.create.time')">
            <el-date-picker
              v-model="formData.created"
              :placeholder="$t('main.create.time.placeholder')"
              format="YYYY-MM-DD HH:mm:ss"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              @change="createTimeChanged"
            />
          </el-form-item>

          <!--
          ----------------------------------------------------------------------
          -->

          <!-- 标签  -->
          <el-form-item :label="$t('main.tag')">
            <el-tag
              v-for="tag in formData.tag.dynamicTags"
              :key="tag"
              :disable-transitions="false"
              class="mx-1"
              closable
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
              @blur="tagHandleInputConfirm"
              @keyup.enter="tagHandleInputConfirm"
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
            <el-button :loading="isTagLoading" type="primary" @click="fetchTag">
              {{
                isTagLoading
                  ? $t("main.opt.loading")
                  : $t("main.auto.fetch.tag")
              }}
            </el-button>
          </el-form-item>
          <!-- 标签开关 -->
          <el-form-item :label="$t('main.tag.auto.switch')">
            <el-switch v-model="tagSwitch" />
          </el-form-item>

          <!-- 一键生成属性-->
          <el-form-item :label="$t('main.opt.quick')">
            <el-button
              :loading="isGenLoading"
              type="primary"
              @click="oneclickAttr"
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
            <el-button type="primary" @click="saveAttrToSiyuan"
              >{{ $t("main.save.attr.to.siyuan") }}
            </el-button>
          </el-form-item>

          <!-- 启用Github发布 -->
          <el-form-item :label="$t('main.publish.vuepress.github')">
            <el-switch
              v-model="vuepressGithubEnabled"
              @change="githubOnChange"
            />
            <el-alert
              v-if="vuepressGithubEnabled"
              :closable="false"
              :title="$t('main.publish.vuepress.github.tip')"
              type="info"
            />
            <el-alert
              v-if="!vuepressGithubEnabled"
              :closable="false"
              :title="$t('main.publish.vuepress.github.no.tip')"
              type="warning"
            />
          </el-form-item>
          <!-- 是否使用默认目录 -->
          <el-form-item
            v-if="vuepressGithubEnabled"
            :label="$t('main.publish.vuepress.choose.path.use.default')"
          >
            <el-switch v-model="useDefaultPath" @change="defaultPathOnChange" />
            <el-alert
              v-if="useDefaultPath"
              :closable="false"
              :title="$t('main.publish.vuepress.choose.path.use.default.tip')"
              type="info"
            />
          </el-form-item>
          <!-- 选择目录 -->
          <el-form-item
            v-if="vuepressGithubEnabled && !useDefaultPath"
            :label="$t('main.publish.vuepress.choose.path')"
          >
            <el-tree-select
              v-model="formData.customPath"
              :check-strictly="true"
              :empty-text="$t('main.cat.empty')"
              :load="customLoad"
              :no-data-text="$t('main.cat.empty')"
              :placeholder="$t('main.cat.select')"
              :props="customProps"
              lazy
            />
          </el-form-item>
          <!-- 设置文件名 -->
          <el-form-item
            v-if="vuepressGithubEnabled"
            :label="$t('main.publish.vuepress.choose.title')"
          >
            <el-input v-model="formData.title" />
            <el-alert
              v-if="vuepressGithubEnabled"
              :closable="false"
              :title="$t('main.publish.vuepress.choose.title.tip')"
              type="error"
            />
          </el-form-item>

          <!-- 发布操作 -->
          <el-form-item>
            <el-button
              :loading="isPublishLoading"
              type="primary"
              @click="doPublish"
              >{{
                isPublishLoading
                  ? $t("main.publish.loading")
                  : isPublished
                  ? $t("main.update")
                  : $t("main.publish")
              }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button :loading="isCancelLoading" @click="cancelPublish"
              >{{ $t("main.cancel") }}
            </el-button>
          </el-form-item>

          <!-- 文章状态 -->
          <el-form-item>
            <el-button disabled text type="danger">
              {{
                isPublished
                  ? $t("main.publish.status.published")
                  : $t("main.publish.status.unpublish")
              }}
            </el-button>
            <a
              v-if="isPublished"
              :href="previewUrl"
              :title="previewUrl"
              target="_blank"
              >{{ $t("main.publish.vuepress.see.md.preview") }}</a
            >
          </el-form-item>
          <el-form-item>
            <a
              v-if="isPublished"
              :href="previewRealUrl"
              :title="previewRealUrl"
              target="_blank"
              >{{ $t("main.publish.vuepress.see.real.preview") }}</a
            >
          </el-form-item>
        </el-form>
      </div>

      <div class="source-mode">
        <el-form label-width="75px">
          <el-form-item>
            <el-alert
              :closable="false"
              :title="$t('main.yaml.formatter')"
              class="top-data-tip"
              type="info"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              ref="fmtRefInput"
              v-model="vuepressData.vuepressFullContent"
              :autosize="{ minRows: 5, maxRows: 8 }"
              type="textarea"
              v-on:focus="onYamlContentFocus"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="convertAttrToYAML"
              >{{ $t("main.siyuan.to.yaml") }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="convertYAMLToAttr"
              >{{ $t("main.yaml.to.siyuan") }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="copyToClipboard"
              >{{ $t("main.copy") }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-container>
    <el-skeleton :loading="isInitLoading" :rows="5" animated />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeMount, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { LogFactory } from "~/utils/logUtil"
import {
  mdToPlainText,
  parseHtml,
  removeMdWidgetTag,
  removeTitleNumber,
} from "~/utils/htmlUtil"
import { getApiParams, getPublishStatus } from "~/utils/publishUtil"
import { IGithubCfg } from "~/utils/platform/github/githubCfg"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import {
  cutWords,
  isEmptyString,
  jiebaToHotWords,
  pingyinSlugify,
  zhSlugify,
} from "~/utils/util"
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { ElMessage, ElMessageBox } from "element-plus"
import shortHash from "shorthash2"
import { CONSTANTS } from "~/utils/constants/constants"
import { SIYUAN_PAGE_ATTR_KEY } from "~/utils/constants/siyuanPageConstants"
import {
  covertStringToDate,
  formatIsoToZhDate,
  formatNumToZhDate,
} from "~/utils/dateUtil"
import { obj2Yaml, yaml2Obj } from "~/utils/yamlUtil"
import copy from "copy-to-clipboard"
import { getJSONConf } from "~/utils/configUtil"
import { GithubApi } from "~/utils/platform/github/githubApi"
import { POSTID_KEY_CONSTANTS } from "~/utils/constants/postidKeyConstants"
import { getPageId } from "~/utils/platform/siyuan/siyuanUtil"

const logger = LogFactory.getLogger(
  "components/publish/tab/main/GithubMain.vue"
)
const siyuanApi = new SiYuanApi()

const { t } = useI18n()

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false,
  },
  apiType: {
    type: String,
    default: "",
  },
  pageId: {
    type: String,
    default: undefined,
  },
})

const isSlugLoading = ref(false)
const isDescLoading = ref(false)
const isTagLoading = ref(false)
const isGenLoading = ref(false)
const isPublishLoading = ref(false)
const isCancelLoading = ref(false)
const isInitLoading = ref(false)

const editMode = ref(false)
const slugHashEnabled = ref(false)
const vuepressGithubEnabled = ref(false)
const useDefaultPath = ref(true)
const isPublished = ref(false)
const previewUrl = ref("")
const previewRealUrl = ref("")
const forceRefresh = ref(false)
const tagSwitch = ref(false)

const formData = ref({
  title: "",
  customSlug: "",
  desc: "",
  created: "",
  checkList: [],
  tag: {
    inputValue: "",
    dynamicTags: <string[]>[],
    inputVisible: false,
  },
  customPath: "",
  categories: ["默认分类"],
})
const siyuanData = ref({
  pageId: "",
  meta: {
    tags: "",
  },
})
const vuepressData = ref({
  yamlObj: {
    title: "",
    date: new Date(),
    permalink: "",
    meta: [
      {
        name: "keywords",
        content: "",
      },
      {
        name: "description",
        content: "",
      },
    ],
    categories: <string[]>[],
    tags: <string[]>[],
    author: {
      name: "terwer",
      link: "https://github.com/terwer",
    },
  },
  formatter: "",
  vuepressContent: "",
  vuepressFullContent: "",
})

const simpleMode = () => {
  editMode.value = false
}
const complexMode = () => {
  editMode.value = true
}

// 将文档路径转换为分类
const convertDocPathToCategories = (docPath: string) => {
  // logger.debug("docPath=>", docPath)
  const docPathArray = docPath.split("/")
  if (docPathArray.length > 1) {
    formData.value.categories = []
    for (let i = 1; i < docPathArray.length - 1; i++) {
      const docCat = removeTitleNumber(docPathArray[i])
      formData.value.categories.push(docCat)
    }
  }
}

function getDocPath() {
  const postidKey = getApiParams<IGithubCfg>(
    API_TYPE_CONSTANTS.API_TYPE_VUEPRESS
  ).posidKey
  const meta: any = siyuanData.value.meta
  const docPath = meta[postidKey] || ""
  return docPath
}

function checkForce() {
  // 空值跳过
  if (isEmptyString(formData.value.customSlug)) {
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

async function makeSlug(hideTip?: any) {
  if (!checkForce()) {
    return
  }

  isSlugLoading.value = true
  // 获取最新属性
  const page = await siyuanApi.getBlockByID(siyuanData.value.pageId)
  // BUG：目前attr的title不会即时更新
  // siyuanData.value.meta = await getPageAttrs(siyuanData.value.pageId)
  // logger.debug("meta=>", siyuanData.value.meta)
  logger.debug("page=>", page)
  // 获取标题
  // const title = siyuanData.value.meta.title;
  let fmtTitle = page.content
  fmtTitle = mdFileToTitle(fmtTitle)
  logger.debug("fmtTitle=>", fmtTitle)
  if (formData.value.checkList.length > 0) {
    // 调用Google翻译API
    const result = await zhSlugify(fmtTitle)
    logger.debug("result=>", result)
    if (result) {
      formData.value.customSlug = result
    } else {
      ElMessage.success(t("main.opt.failure"))
    }
  } else {
    formData.value.customSlug = await pingyinSlugify(fmtTitle)
  }
  // add hash
  if (slugHashEnabled.value) {
    const newstr = page.content + new Date().toISOString()
    const hashstr = "-" + shortHash(newstr).toLowerCase()
    formData.value.customSlug += hashstr
  }

  isSlugLoading.value = false
  if (hideTip !== true) {
    ElMessage.success(t("main.opt.success"))
  }
}

async function makeDesc(hideTip?: any) {
  isDescLoading.value = true
  const data = await siyuanApi.exportMdContent(siyuanData.value.pageId)

  const md = data.content
  const html = mdToPlainText(md)
  formData.value.desc = parseHtml(html, CONSTANTS.MAX_PREVIEW_LENGTH, true)

  isDescLoading.value = false
  if (hideTip !== true) {
    ElMessage.success(t("main.opt.success"))
  }
}

const createTimeChanged = (val: any) => {}

const tagHandleClose = (tag: any) => {
  formData.value.tag.dynamicTags.splice(
    formData.value.tag.dynamicTags.indexOf(tag),
    1
  )
}
// https://stackoverflow.com/questions/64774113/vue-js-3-use-autofocus-on-input-with-ref-inside-a-method
// https://stackoverflow.com/questions/64774113/vue-js-3-use-autofocus-on-input-with-ref-inside-a-method
// https://www.helloworld.net/p/2721375043
const tagRefInput = ref()
const tagShowInput = () => {
  formData.value.tag.inputVisible = true

  // this.$refs.tagRefInput.focus()
  nextTick(() => {
    tagRefInput.value.focus()
  })
}
const tagHandleInputConfirm = () => {
  if (formData.value.tag.inputValue) {
    formData.value.tag.dynamicTags.push(formData.value.tag.inputValue)
  }
  formData.value.tag.inputVisible = false
  formData.value.tag.inputValue = ""
}

async function fetchTag(hideTip?: any) {
  if (!tagSwitch.value) {
    ElMessage.warning(t("main.tag.auto.switch.no.tip"))
    return
  }

  isTagLoading.value = true
  const data = await siyuanApi.exportMdContent(siyuanData.value.pageId)

  const md = data.content
  const genTags = await cutWords(md)
  logger.debug("genTags=>", genTags)

  const hotTags = jiebaToHotWords(genTags, 5)
  logger.debug("hotTags=>", hotTags)

  // 如果标签不存在，保存新标签到表单
  for (let i = 0; i < hotTags.length; i++) {
    if (!formData.value.tag.dynamicTags.includes(hotTags[i])) {
      formData.value.tag.dynamicTags.push(hotTags[i])
    }
  }

  isTagLoading.value = false
  if (hideTip !== true) {
    ElMessage.success(t("main.opt.success"))
  }
}

async function saveAttrToSiyuan(hideTip?: any) {
  const customAttr = {
    [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY]:
      formData.value.customSlug,
    [SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_DESC_KEY]:
      formData.value.desc,
    tags: formData.value.tag.dynamicTags.join(","),
  }
  await siyuanApi.setBlockAttrs(siyuanData.value.pageId, customAttr)
  logger.debug("VuepressMain保存属性到思源笔记,meta=>", customAttr)

  // 单独调用才去刷新数据，否则自行刷新数据
  if (hideTip !== true) {
    // 刷新属性数据
    await initPage()

    ElMessage.success(t("main.opt.success"))
  }
}

/**
 * 文件名转title
 * @param fmtTitle
 */
const mdFileToTitle = (fmtTitle: string): string => {
  if (fmtTitle.indexOf(".md") > -1) {
    fmtTitle = fmtTitle.replace(/\.md/g, "")
  }
  if (fmtTitle.indexOf(".") > -1) {
    fmtTitle = fmtTitle.replace(/\d*\./g, "")
  }
  return fmtTitle
}

const convertAttrToYAML = () => {
  // 表单属性转yamlObj
  logger.debug("convertAttrToYAML,formData=>", formData)
  let fmtTitle = formData.value.title
  fmtTitle = mdFileToTitle(fmtTitle)

  vuepressData.value.yamlObj.title = fmtTitle
  vuepressData.value.yamlObj.permalink =
    "/post/" + formData.value.customSlug + ".html"
  vuepressData.value.yamlObj.date = covertStringToDate(formData.value.created)
  const meta = [
    {
      name: "keywords",
      content: formData.value.tag.dynamicTags.join(" "),
    },
    {
      name: "description",
      content: formData.value.desc,
    },
  ]
  vuepressData.value.yamlObj.meta = meta
  vuepressData.value.yamlObj.tags = formData.value.tag.dynamicTags
  vuepressData.value.yamlObj.categories = formData.value.categories

  // formatter
  let yaml = obj2Yaml(vuepressData.value.yamlObj)
  // 修复yaml的ISO日期格式（js-yaml转换的才需要）
  yaml = formatIsoToZhDate(yaml, true)
  vuepressData.value.formatter = yaml
  vuepressData.value.vuepressFullContent = vuepressData.value.formatter
}
const convertYAMLToAttr = () => {
  vuepressData.value.formatter = vuepressData.value.vuepressFullContent
  vuepressData.value.yamlObj = yaml2Obj(vuepressData.value.formatter)

  // yamlObj转表单属性
  logger.debug("convertYAMLToAttr,yamlObj=>", vuepressData.value.yamlObj)
  formData.value.title = vuepressData.value.yamlObj.title + ".md"
  formData.value.customSlug = vuepressData.value.yamlObj.permalink
    .replace("/pages/", "")
    .replace("/post/", "")
    .replace(".html", "")
    .replace("/", "")
  formData.value.created = formatIsoToZhDate(
    vuepressData.value.yamlObj.date.toISOString(),
    false
  )

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
    if (!formData.value.tag.dynamicTags.includes(tag) && tag !== "") {
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
    fmtRefInput.value.focus()

    copy(vuepressData.value.vuepressFullContent)

    ElMessage.success(t("main.opt.success"))
  })
}

const onYamlContentFocus = (event) => {
  const target = event.target as HTMLTextAreaElement
  target.select()
}

const githubOnChange = (val: boolean) => {
  // 开启Github需要开启hash避免重复
  slugHashEnabled.value = val
  // Github开启状态同步给其他地方用
  vuepressGithubEnabled.value = val
}

const defaultPathOnChange = (val: boolean) => {
  useDefaultPath.value = val
}

// 树形目录选择
const customProps = {
  label: "label",
  children: "children",
  isLeaf: "isLeaf",
}
const customLoad = async (node: any, resolve: any) => {
  if (node.isLeaf) return resolve([])

  logger.debug("目前已保存路径=>", formData.value.customPath)
  logger.debug("当前节点=>", node.data)

  const githubCfg = getJSONConf<IGithubCfg>(
    API_TYPE_CONSTANTS.API_TYPE_VUEPRESS
  )
  const api = new GithubApi(githubCfg)

  let docPath
  let parentDocPath = node.data.value || ""
  // 第一次加载并且保存过目录
  if (parentDocPath === "" && formData.value.customPath !== "") {
    docPath = formData.value.customPath
  } else {
    // 非首次加载或者首次加载但是没保存过目录
    if (parentDocPath === "") {
      parentDocPath = "docs/"
    }
    // 子目录加载
    docPath = parentDocPath
  }

  const treeNode = await api.getGithubPageTreeNode(docPath)
  resolve(treeNode)
}

async function doPublish() {
  isPublishLoading.value = true

  // 先删除
  await doCancel(false)

  const fmtTitle = mdFileToTitle(formData.value.title)
  if (/[\s*|\\.]/g.test(fmtTitle)) {
    logger.debug("fmtTitle=>", fmtTitle)
    ElMessage.error("文件名不能包含空格或者特殊字符")
    return
  }

  // 生成属性
  await oneclickAttr(true)

  // 根据选项决定是否发送到Vuepress的Github参考
  const isOk = false // getBooleanConf(API_STATUS_CONSTANTS.API_STATUS_VUEPRESS)
  // api不可用但是开启了发布
  if (!isOk && vuepressGithubEnabled.value) {
    // 未开启也生成数据
    // 刷新属性数据
    await initPage()
    isPublishLoading.value = false
    ElMessage.error(
      "检测到api不可用或者配置错误，无法发布到Github，请自行复制文本"
    )
    return
  } else if (isOk && vuepressGithubEnabled.value) {
    // api可用并且开启了发布
    logger.debug("开始真正调用api发布到Github")

    const mdFile = formData.value.title
    let docPath // = vuepressCfg.defaultPath + mdFile
    if (!useDefaultPath.value) {
      // 如果选择了自定义的目录
      if (formData.value.customPath.indexOf(".md") > -1) {
        docPath = formData.value.customPath
        logger.debug("已经有完整路径，不拼接")
      } else {
        docPath = formData.value.customPath + "/" + mdFile
      }

      logger.debug(formData.value.customPath)
      logger.debug("文章讲发布于以下路径=>", docPath)

      // 目录映射为分类
      convertDocPathToCategories(docPath)
    }

    // 发布内容
    const data = await siyuanApi.exportMdContent(siyuanData.value.pageId)
    // 纯正文
    const md = removeMdWidgetTag(data.content)
    // 包含formatter和正文
    const mdContent = vuepressData.value.formatter + "\n" + md
    vuepressData.value.vuepressContent = md
    vuepressData.value.vuepressFullContent = mdContent

    logger.debug("即将发布的内容，mdContent=>", { mdContent })

    // 发布
    const githubCfg = getJSONConf<IGithubCfg>(
      API_TYPE_CONSTANTS.API_TYPE_VUEPRESS
    )
    const api = new GithubApi(githubCfg)
    const res = await api.publishGithubPage(docPath, mdContent)

    // 成功与失败都提供复制功能
    if (!res) {
      isPublishLoading.value = false

      // 刷新属性数据
      await initPage()
      // 发布失败
      ElMessage.error(t("main.publish.vuepress.failure"))
      return
    }

    // 这里是发布成功之后
    const customAttr = { [POSTID_KEY_CONSTANTS.VUEPRESS_POSTID_KEY]: docPath }
    await siyuanApi.setBlockAttrs(siyuanData.value.pageId, customAttr)
    logger.debug("VuepressMain发布成功，保存路径,meta=>", customAttr)

    // 刷新属性数据
    await initPage()
    logger.debug("文章预览链接=>", previewUrl)
  } else {
    // 刷新属性数据
    await initPage()
  }
  logger.debug("发布内容完成")

  isPublishLoading.value = false
  ElMessage.success(t("main.opt.status.publish"))
}

async function oneclickAttr(hideTip?: any) {
  isGenLoading.value = true
  await makeSlug(true)

  await makeDesc(true)

  await fetchTag(true)

  convertAttrToYAML()

  // 发布属性
  await saveAttrToSiyuan(true)
  logger.debug("发布属性完成")

  isGenLoading.value = false
  if (hideTip !== true) {
    ElMessage.success(t("main.publish.oneclick.attr.finish"))
  }
}

async function cancelPublish() {
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
    .catch(() => {
      // ElMessage({
      //   type: 'error',
      //   message: t("main.opt.failure"),
      // })
      isCancelLoading.value = false
    })
}

// 实际删除逻辑
async function doCancel(isInit: boolean) {
  const githubCfg = getJSONConf<IGithubCfg>(
    API_TYPE_CONSTANTS.API_TYPE_VUEPRESS
  )
  const api = new GithubApi(githubCfg)

  const docPath = getDocPath()
  logger.debug("准备取消发布，docPath=>", docPath)

  await api.deleteGithubPage(docPath)

  const customAttr = {
    [POSTID_KEY_CONSTANTS.VUEPRESS_POSTID_KEY]: "",
  }
  await siyuanApi.setBlockAttrs(siyuanData.value.pageId, customAttr)
  logger.debug("VuepressMain取消发布,meta=>", customAttr)

  // 刷新属性数据
  if (isInit) {
    await initPage()
  }
}

async function initPage() {
  isInitLoading.value = true

  const pageId = await getPageId(true, props.pageId)
  logger.debug("VuepressMain pageId=>", pageId)
  if (!pageId || pageId === "") {
    isInitLoading.value = false
    return
  }
  const page = await siyuanApi.getBlockByID(pageId)
  if (!page) {
    isInitLoading.value = false
    ElMessage.error(t("config.error.msg") + "_vuepress")
    throw new Error(t("config.error.msg") + "_vuepress")
  }
  logger.debug("VuepressMain获取主文档", page)

  // 思源笔记数据
  siyuanData.value.pageId = pageId
  siyuanData.value.meta = await siyuanApi.getBlockAttrs(pageId)

  // 表单数据
  formData.value.title = page.content + ".md"
  formData.value.customSlug =
    siyuanData.value.meta[SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY]
  formData.value.desc =
    siyuanData.value.meta[SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_DESC_KEY]
  formData.value.created = formatNumToZhDate(page.created)

  formData.value.tag.dynamicTags = []
  const tagstr = siyuanData.value.meta.tags || ""
  const tgarr = tagstr.split(",")
  for (let i = 0; i < tgarr.length; i++) {
    const tg = tgarr[i]
    if (tg !== "") {
      formData.value.tag.dynamicTags.push(tgarr[i])
    }
  }

  // api状态
  const cfg = getJSONConf<IGithubCfg>(API_TYPE_CONSTANTS.API_TYPE_VUEPRESS)
  const isOk = cfg.apiStatus
  vuepressGithubEnabled.value = isOk

  // 默认开启hash
  slugHashEnabled.value = true
  // Github默认开启hash
  // slugHashEnabled.value = vuepressGithubEnabled.value;
  logger.info("Vuepress的api状态=>", isOk)

  // 发布状态
  isPublished.value = getPublishStatus(
    API_TYPE_CONSTANTS.API_TYPE_VUEPRESS,
    siyuanData.value.meta
  )

  // 更新预览链接
  if (isPublished.value) {
    const vuepressCfg = getJSONConf<IGithubCfg>(
      API_TYPE_CONSTANTS.API_TYPE_VUEPRESS
    )
    const docPath = getDocPath()

    // 自定义目录
    useDefaultPath.value = false
    formData.value.customPath = docPath
    // 目录映射到分类
    convertDocPathToCategories(docPath)

    // 表单属性转换为YAML
    convertAttrToYAML()

    // "https://terwergreen.com"
    const vdomain = "https://terwer.space/"
    previewUrl.value =
      "https://github.com/" +
      vuepressCfg.githubUser +
      "/" +
      vuepressCfg.githubRepo +
      "/blob/" +
      vuepressCfg.defaultBranch +
      "/" +
      docPath
    previewRealUrl.value = vdomain + vuepressData.value.yamlObj.permalink
  } else {
    // 表单属性转换为YAML
    convertAttrToYAML()
  }

  // 文章内容同步到YAMl
  // 发布内容
  const data = await siyuanApi.exportMdContent(siyuanData.value.pageId)
  const md = data.content
  vuepressData.value.vuepressContent = removeMdWidgetTag(md)
  vuepressData.value.vuepressFullContent =
    vuepressData.value.formatter + "\n" + vuepressData.value.vuepressContent

  isInitLoading.value = false
}

// life cycle
/**
 * 监听props
 */
watch(
  () => props.isReload,
  async (oldValue, newValue) => {
    // Here you can add your functionality
    // as described in the name you will get old and new value of watched property

    // 初始化
    await initPage()
    logger.debug("VuepressMain检测到更新操作，刷新页面")
  }
)

onBeforeMount(async () => {
  await initPage()
})
</script>
