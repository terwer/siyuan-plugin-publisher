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
  <div class="anki-body">
    <el-button type="primary" @click="updateCard">更新卡片</el-button>
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
                  v-for="tag in formData.tag.dynamicTags"
                  :key="tag"
                  class="mx-1"
                  closable
                  :disable-transitions="false"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  v-if="formData.tag.inputVisible"
                  ref="tagRefInput"
                  v-model="formData.tag.inputValue"
                  class="ml-1 w-20"
                  size="small"
                />
                <el-button
                  v-else
                  class="button-new-tag ml-1 el-tag"
                  size="small"
                >
                  {{ $t("anki.siyuan.deck.new") }}
                </el-button>
              </el-form-item>
            </div>
            <div class="anki-tags">
              <el-form-item :label="$t('anki.siyuan.tag')">
                <el-tag
                  v-for="tag in formData.tag.dynamicTags"
                  :key="tag"
                  class="mx-1"
                  closable
                  :disable-transitions="false"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  v-if="formData.tag.inputVisible"
                  ref="tagRefInput"
                  v-model="formData.tag.inputValue"
                  class="ml-1 w-20"
                  size="small"
                />
                <el-button
                  v-else
                  class="button-new-tag ml-1 el-tag"
                  size="small"
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
              >保存Anki标记</el-button
            >
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { SiYuanApi } from "~/utils/platform/siyuan/siYuanApi"
import { onMounted, reactive } from "vue"
import { getPageId } from "~/utils/platform/siyuan/siyuanUtil"
import { ElMessage, ElMessageBox } from "element-plus"
import { useI18n } from "vue-i18n"
import { LogFactory } from "~/utils/logUtil"
import { goToPage } from "~/utils/otherlib/ChromeUtil"

const logger = LogFactory.getLogger("components/anki/AnkiIndex.vue")
const { t } = useI18n()
const siyuanApi = new SiYuanApi()
const formData = reactive({
  ankiInfo: null,
  ankiMap: {},
  tag: {
    inputValue: "",
    dynamicTags: [],
    inputVisible: false,
  },
})

const updateCard = async () => {
  ElMessageBox.confirm(
    "请确保复制 ankisiyuan.bin 到 /data/widgets/ 目录，是否继续？",
    t("main.opt.warning"),
    {
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
      type: "warning",
    }
  )
    .then(async () => {})
    .catch((e) => {
      if (e.toString().indexOf("cancel") <= -1) {
        ElMessage({
          type: "error",
          message: t("main.opt.failure") + "=>" + e,
        })
        logger.error(t("main.opt.failure") + "=>" + e)
      }
    })
}

const initPage = async () => {
  const pageId = await getPageId()
  formData.ankiInfo = await siyuanApi.getAnkilinkInfo(pageId)

  formData.ankiInfo.forEach((item) => {
    formData.ankiMap[item.id] = item
  })
}

const saveAnkiInfo = (blockId: string) => {
  logger.debug("blockId=>", blockId)
  const ankiInfo = formData.ankiMap[blockId]

  const customAttr = {
    [ankiInfo.name]: ankiInfo.value,
  }
  siyuanApi.setBlockAttrs(blockId, customAttr)
  logger.debug("ankiInfo=>", ankiInfo)
  ElMessage.success(t("main.opt.success"))
}

onMounted(async () => {
  await initPage()
})
</script>

<style scoped>
.anki-body {
  padding: 10px;
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
