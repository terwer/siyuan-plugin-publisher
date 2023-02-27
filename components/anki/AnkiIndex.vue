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
  <div class="anki-body">
    <el-alert
      class="top-version-tip"
      v-if="hasEncodedChar"
      title="检测到Anki标记已被转义，可能是使用了优化排版导致，请点击保存自动修复。若无法自动修复，请删除重新修改保存。注意：可能有缓存，保存之后可间隔一段时间再来看。"
      type="error"
      :closable="false"
    />
    <el-button
      type="primary"
      @click="updateCard"
      :loading="isAnkiLoading"
      v-if="isInSiyuanNewWinBrowser()"
      >更新卡片
    </el-button>
    <el-row :gutter="12">
      <el-col
        v-for="(o, index) in formData.ankiInfo"
        :key="o.id"
        :span="8"
        class="anki-card-col"
      >
        <el-card shadow="always">
          <div class="block-title">
            {{ index }}.{{ o.content }} - {{ o.id }}
          </div>
          <div class="anki-option">
            <!--
            <div class="anki-name">
              <el-input v-model="o.name" readonly />
            </div>
            -->
            <div class="anki-deck">
              <el-form-item :label="$t('anki.siyuan.deck')">
                <el-tag
                  v-for="deck in formData.deckMap[o.id].dynamicTags ?? []"
                  :key="deck"
                  class="mx-1"
                  closable
                  :disable-transitions="false"
                  @close="deckHandleClose(o.id, deck)"
                >
                  {{ deck }}
                </el-tag>
                <el-input
                  v-if="formData.deckMap[o.id].inputVisible"
                  ref="deckRefInput"
                  v-model="formData.deckMap[o.id].inputValue"
                  class="ml-1 w-20"
                  size="small"
                  @keyup.enter="deckHandleInputConfirm(o.id)"
                  @blur="deckHandleInputConfirm(o.id)"
                />
                <el-button
                  v-else
                  class="button-new-tag ml-1 el-tag"
                  size="small"
                  @click="deckShowInput(o.id)"
                >
                  {{ $t("anki.siyuan.deck.new") }}
                </el-button>
              </el-form-item>
            </div>
            <div class="anki-tags">
              <el-form-item :label="$t('anki.siyuan.tag')">
                <el-tag
                  v-for="tag in formData.tagMap[o.id].dynamicTags"
                  :key="tag"
                  class="mx-1"
                  closable
                  :disable-transitions="false"
                  @close="tagHandleClose(o.id, tag)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  v-if="formData.tagMap[o.id].inputVisible"
                  ref="tagRefInput"
                  v-model="formData.tagMap[o.id].inputValue"
                  class="ml-1 w-20"
                  size="small"
                  @keyup.enter="tagHandleInputConfirm(o.id)"
                  @blur="tagHandleInputConfirm(o.id)"
                />
                <el-button
                  v-else
                  class="button-new-tag ml-1 el-tag"
                  size="small"
                  @click="tagShowInput(o.id)"
                >
                  {{ $t("anki.siyuan.tag.new") }}
                </el-button>
              </el-form-item>
            </div>
            <!--
            <div class="anki-value">
              <el-input
                type="textarea"
                :autosize="{ minRows: 5, maxRows: 10 }"
                v-model="o.value"
              />
            </div>
            -->
            <el-button
              type="primary"
              class="button"
              :data-block-id="o.id"
              @click="saveAnkiInfo(o.id)"
              >保存Anki标记
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { onMounted, reactive, ref, watch } from "vue"
import { getPageId } from "~/utils/platform/siyuan/siyuanUtil"
import { ElMessage, ElMessageBox } from "element-plus"
import { useI18n } from "vue-i18n"
import { LogFactory } from "~/utils/logUtil"
import { isEmptyString } from "~/utils/util"
import strUtil, { appendStr } from "~/utils/strUtil"
import {
  getSiyuanNewWinDataDir,
  isInSiyuanNewWinBrowser,
} from "~/utils/otherlib/siyuanBrowserUtil"
import scriptUtil from "~/utils/otherlib/scriptUtil"
import browserUtil from "~/utils/browserUtil"

const logger = LogFactory.getLogger("components/anki/AnkiIndex.vue")
const { t } = useI18n()

const siyuanApi = new SiYuanApi()
const formData = reactive({
  ankiInfo: null,
  ankiMap: {},
  deckMap: {},
  tagMap: {},
})

const isAnkiLoading = ref(false)
// 已知问题1
const unexpectedCharArray = ["&quot;", "&amp;", "amp;", "quot;"]
const hasEncodedChar = ref(false)

// props
const props = defineProps({
  pageId: {
    type: String,
    default: undefined,
  },
})

const updateCard = async () => {
  ElMessageBox.confirm("准备同步Anki卡片，是否继续？", t("main.opt.warning"), {
    confirmButtonText: t("main.opt.ok"),
    cancelButtonText: t("main.opt.cancel"),
    type: "warning",
  })
    .then(async () => {
      isAnkiLoading.value = true

      const dataDir: string = getSiyuanNewWinDataDir()
      const workDir = `${dataDir}/widgets/sy-post-publisher/lib/cmd`
      const ankisiyuanPath = `${dataDir}/widgets/sy-post-publisher/lib/cmd/ankisiyuan.bin`
      logger.info("ankisiyuanPath=>", ankisiyuanPath)
      const result = await scriptUtil.customCmd(ankisiyuanPath, [], workDir)
      if (result.code === 0) {
        ElMessage.success(
          "操作成功，执行结果=>" + result.data.split("\n").slice(-2).join(" ")
        )
      } else {
        ElMessage.error("操作异常，错误消息=>" + result.data)
      }

      isAnkiLoading.value = false
    })
    .catch((e) => {
      isAnkiLoading.value = false

      if (e.toString().indexOf("cancel") <= -1) {
        ElMessage({
          type: "error",
          message:
            t("main.opt.failure") +
            "，请将 ankisiyuan.bin 或者 ankisiyuan.exe 复制到 data/widgets/sy-post-publisher/lib/cmd 目录=>" +
            e,
        })
        logger.error(t("main.opt.failure") + "=>" + e)
      }
    })
}

// deck methods
const deckHandleClose = (blockId, tag) => {
  formData.deckMap[blockId].dynamicTags.splice(
    formData.deckMap[blockId].dynamicTags.indexOf(tag),
    1
  )
}
const deckShowInput = (blockId) => {
  formData.deckMap[blockId].inputVisible = true
}
const deckHandleInputConfirm = (blockId) => {
  if (formData.deckMap[blockId].inputValue) {
    formData.deckMap[blockId].dynamicTags.push(
      formData.deckMap[blockId].inputValue
    )
  }
  formData.deckMap[blockId].inputVisible = false
  formData.deckMap[blockId].inputValue = ""
}

// tag methods
const tagHandleClose = (blockId, tag) => {
  formData.tagMap[blockId].dynamicTags.splice(
    formData.tagMap[blockId].dynamicTags.indexOf(tag),
    1
  )
}
// https://stackoverflow.com/questions/64774113/vue-js-3-use-autofocus-on-input-with-ref-inside-a-method
// https://stackoverflow.com/questions/64774113/vue-js-3-use-autofocus-on-input-with-ref-inside-a-method
// https://www.helloworld.net/p/2721375043
const tagShowInput = (blockId) => {
  formData.tagMap[blockId].inputVisible = true
}
const tagHandleInputConfirm = (blockId) => {
  if (formData.tagMap[blockId].inputValue) {
    formData.tagMap[blockId].dynamicTags.push(
      formData.tagMap[blockId].inputValue
    )
  }
  formData.tagMap[blockId].inputVisible = false
  formData.tagMap[blockId].inputValue = ""
}

// init
const initPage = async () => {
  const pageId = await getPageId(true, props.pageId)
  formData.ankiInfo = await siyuanApi.getAnkilinkInfo(pageId)
  logger.debug("ankiInfo=>", formData.ankiInfo)

  formData.ankiInfo.forEach((item) => {
    formData.ankiMap[item.id] = item

    logger.debug("item.value=>", item.value)
    let deckArr = []
    let tagArr = []
    if (!isEmptyString(item.value)) {
      const valueArr = item.value?.split("\n")
      const deckStr = valueArr[0]?.replace(/"/g, "").replace(/deck_name=/g, "")
      deckArr = deckStr?.split("::")
      if (strUtil.includeInArray(deckStr, unexpectedCharArray)) {
        hasEncodedChar.value = true
      }

      if (valueArr.length > 1) {
        const tagStr = valueArr[1]
          ?.replace(/"/g, "")
          .replace(/tags=\[/g, "")
          .replace(/]/g, "")
        tagArr = tagStr.split(",")
        if (strUtil.includeInArray(tagStr, unexpectedCharArray)) {
          hasEncodedChar.value = true
        }
      }
    }

    deckArr = deckArr.filter(function (str) {
      return str !== ""
    })
    tagArr = tagArr.filter(function (str) {
      return str !== ""
    })
    logger.debug("deckArr=>", deckArr)
    logger.debug("tagArr=>", tagArr)

    formData.deckMap[item.id] = {
      inputValue: "",
      dynamicTags: deckArr,
      inputVisible: false,
    }
    formData.tagMap[item.id] = {
      inputValue: "",
      dynamicTags: tagArr,
      inputVisible: false,
    }
  })
}

const saveAnkiInfo = async (blockId: string) => {
  logger.debug("blockId=>", blockId)
  const ankiInfo = formData.ankiMap[blockId]
  const deckInfo = formData.deckMap[blockId]
  const tagInfo = formData.tagMap[blockId]

  logger.debug("deckInfo=>", deckInfo)
  logger.debug("tagInfo=>", tagInfo)

  // deck_name="用户手册::快速配置"
  // tags=["思源笔记","笔记","配置"]
  let ankiValue
  ankiValue = appendStr('deck_name="', deckInfo.dynamicTags.join("::"), '"')
  ankiValue = appendStr(
    ankiValue,
    "\n",
    "tags=",
    JSON.stringify(tagInfo.dynamicTags)
  )

  // 处理错误转义的字符
  for (let k = 0; k < unexpectedCharArray.length; k++) {
    const ch = unexpectedCharArray[k]
    ankiValue = ankiValue.replace(new RegExp(ch, "g"), "")
  }

  ankiInfo.value = ankiValue
  logger.info("准备保存anki标记，ankiInfo=>", ankiInfo.value)

  const customAttr = {
    [ankiInfo.name]: ankiInfo.value,
  }
  await siyuanApi.setBlockAttrs(blockId, customAttr)

  if (hasEncodedChar.value) {
    browserUtil.reloadPageWithMessage(t("main.opt.success"))
  } else {
    ElMessage.success(t("main.opt.success"))
  }
}

/* 监听props */
watch(
  () => props.pageId,
  /**/ async (oldValue, newValue) => {
    // Here you can add you functionality
    // as described in the name you will get old and new value of watched property
    // 默认选中vuepress
    // setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, true)
    await initPage()
    logger.debug("Anki初始化")
  }
)

onMounted(async () => {
  await initPage()
})
</script>

<style>
.anki-deck .el-form-item__label {
  margin-top: -4px !important;
}

.anki-tags .el-form-item__label {
  margin-top: -4px !important;
}
</style>
<style scoped>
.anki-body {
  padding: 16px;
}

.block-title {
  margin-bottom: 16px;
}

.anki-card-col {
  margin: 8px 0;
}

.anki-value {
  margin: 16px 0;
}
</style>
