<template>
  <el-container>
    <el-aside width="45%">
      <el-form label-width="75px">
        <el-form-item :label="$t('main.slug')">
          <el-input v-model="formData.customSlug"/>
        </el-form-item>

        <el-form-item>
          <el-checkbox-group v-model="formData.checkList">
            <el-checkbox label="1">{{ $t('main.use.google.translate') }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="make-slug-btn" @click="makeSlug">{{ $t('main.auto.fetch.slug') }}</el-button>
        </el-form-item>

        <el-form-item :label="$t('main.desc')">
          <el-input type="textarea" v-model="formData.desc"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="makeDesc">{{ $t('main.auto.fetch.desc') }}</el-button>
        </el-form-item>

        <el-form-item :label="$t('main.create.time')">
          <el-date-picker
              type="datetime"
              v-model="formData.created"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              @change="createTimeChanged"
              :placeholder="$t('main.create.time.placeholder')"
          />
        </el-form-item>

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

        <el-form-item>
          <el-button type="primary" @click="fetchTag">{{ $t('main.auto.fetch.tag') }}</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveAttrToSiyuan">{{ $t('main.save.attr.to.siyuan') }}</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="publishPage">{{
              isPublished ? $t('main.update') : $t('main.publish')
            }}
          </el-button>
          <el-button>{{ $t('main.cancel') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" text>
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
          <el-input v-model="vuepressData.vuepressFullContent" :autosize="{ minRows: 12, maxRows: 15 }"
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
import {getPage, getPageAttrs, getPageId} from "../../lib/siyuan/siyuanUtil";
import log from "../../lib/logUtil"
import {SIYUAN_PAGE_ATTR_KEY} from "../../constants/siyuanPageConstants"

const isPublished = ref(false)
const formData = ref({
  title: "",
  customSlug: "",
  desc: "",
  created: new Date(),
  checkList: [],
  tag: {
    inputValue: "",
    dynamicTags: [],
    inputVisible: false
  },
  categories: ["默认分类"]
})
const siyuanData = {
  pageId: "",
  meta: {}
}
const vuepressData = {
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
    categories: [],
    tags: [],
    author: {
      name: "terwer",
      link: "https://github.com/terwer"
    }
  },
  formatter: "",
  vuepressContent: "",
  vuepressFullContent: ""
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
  siyuanData.pageId = pageId;
  siyuanData.meta = await getPageAttrs(pageId)

  // 表单数据
  formData.value.title = page.content;
  // @ts-ignore
  formData.value.customSlug = siyuanData.meta[SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_SLUG_KEY];
  // @ts-ignore
  formData.value.desc = siyuanData.meta[SIYUAN_PAGE_ATTR_KEY.SIYUAN_PAGE_ATTR_CUSTOM_DESC_KEY];
}

const makeSlug = () => {

}
const makeDesc = () => {

}
const createTimeChanged = (val: any) => {

}
const tagHandleClose = (tag: any) => {

}
const tagShowInput = () => {

}
const tagHandleInputConfirm = () => {

}
const fetchTag = () => {

}
const saveAttrToSiyuan = () => {

}
const convertAttrToYAML = () => {

}
const convertYAMLToAttr = () => {

}
const copyToClipboard = () => {

}
const publishPage = () => {

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
</style>