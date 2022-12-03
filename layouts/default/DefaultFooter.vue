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
  - Please contact Terwer, Shenzhen, Guangdong, 518000 China
  - or visit www.terwer.space if you need additional information or have any
  - questions.
  -->

<template>
  <div>
    <div class="footer">
      <div>
        <span class="text"> &copy;2011-2022 </span>
        <span class="s-dark" @click="goGithub()"> sy-post-publisher </span>
        <span class="text"> v0.1.0. </span>
        <span class="text s-dark" @click="toggleDark()">{{
          isDark ? $t("theme.mode.light") : $t("theme.mode.dark")
        }}</span>
        <span class="text">.</span>
        <span class="text s-dark" @click="changeSuyuanApi()">
          {{ $t("blog.change.siyuan.api") }}
        </span>
        <span class="text">.</span>
        <span class="text s-dark" @click="newWin()">
          {{ $t("blog.newwin.open") }}
        </span>

        <el-dialog
          v-model="siyuanApiChangeFormVisible"
          :title="$t('blog.change.siyuan.api')"
        >
          <el-form
            ref="siyuanApiSettingFormRef"
            :model="siyuanApiChangeForm"
            :rules="siyuanApiChangeRules"
          >
            <el-form-item
              :label="$t('setting.blog.apiurl')"
              :label-width="formLabelWidth"
              prop="apiUrl"
            >
              <el-input
                v-model="siyuanApiChangeForm.apiUrl"
                autocomplete="off"
                :placeholder="$t('setting.blog.siyuan.apiurl')"
              />
            </el-form-item>
            <el-form-item
              :label="$t('setting.blog.password')"
              :label-width="formLabelWidth"
              prop="pwd"
            >
              <el-input
                v-model="siyuanApiChangeForm.pwd"
                type="password"
                autocomplete="off"
                :placeholder="$t('setting.blog.siyuan.password')"
                show-password
              />
            </el-form-item>
            <el-form-item
              :label="$t('setting.blog.middlewareUrl')"
              :label-width="formLabelWidth"
              prop="middlewareUrl"
            >
              <el-input
                v-model="siyuanApiChangeForm.middlewareUrl"
                autocomplete="off"
                :placeholder="$t('setting.blog.middlewareUrl.tip')"
              />
            </el-form-item>
            <el-form-item>
              <el-alert
                class="top-data-tip middleware-tip"
                :title="$t('setting.blog.middlewareUrl.my.tip')"
                type="success"
                :closable="false"
              />
            </el-form-item>
          </el-form>

          <template #footer>
            <span class="dialog-footer">
              <el-button @click="siyuanApiChangeFormVisible = false">{{
                $t("main.opt.cancel")
              }}</el-button>
              <el-button
                type="primary"
                @click="handleSiyuanApiSetting(siyuanApiSettingFormRef)"
                >{{ $t("main.opt.ok") }}</el-button
              >
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDark, useToggle } from "@vueuse/core"
import { onMounted, reactive, ref } from "vue"
import { FormRules } from "element-plus"
import { useI18n } from "vue-i18n"
import { LogFactory } from "~/utils/logUtil"

const logger = LogFactory.getLogger("layouts/default/DefaultFooter")

const { t } = useI18n()

const isDark = useDark()
const toggleDark = useToggle(isDark)

const isInSiyuan = ref(false)

const formLabelWidth = "140px"
const siyuanApiChangeFormVisible = ref(false)
const siyuanApiSettingFormRef = ref()
const siyuanApiChangeForm = reactive({
  apiUrl: "http://127.0.0.1:6806",
  pwd: "",
  middlewareUrl: "",
})
const siyuanApiChangeRules = reactive<FormRules>({
  apiUrl: [
    {
      required: true,
      message: () => t("form.validate.name.required"),
    },
  ],
  pwd: [
    {
      required: false,
      message: () => t("form.validate.name.required"),
    },
  ],
})

const goGithub = () => {
  window.open("https://github.com/terwer/src-sy-post-publisher")
}
const newWin = () => {
  // goToPage("/blog/index.html")
}

const changeSuyuanApi = () => {
  siyuanApiChangeFormVisible.value = true
}

// @ts-ignore
const handleSiyuanApiSetting = async (formEl) => {
  if (!formEl) return
  // @ts-ignore
  const result = await formEl.validate((valid, fields) => {
    if (valid) {
      logUtil.logInfo("校验成功")
    } else {
      logUtil.logError(t("main.opt.failure"), fields)
      // ElMessage.error(t('main.opt.failure'))
    }
  })
  if (!result) {
    return
  }

  // 保存思源笔记配置数据
  // try {
  //   const siyuanCfg = new SiYuanConfig(
  //     siyuanApiChangeForm.apiUrl,
  //     siyuanApiChangeForm.pwd,
  //     siyuanApiChangeForm.middlewareUrl
  //   )
  //   setJSONConf<SiYuanConfig>(SIYUAN_CONSTANTS.SIYUAN_CFG_KEY, siyuanCfg)
  //   logUtil.logInfo("保存思源配置", siyuanCfg)
  //   ElMessage.success(t("main.opt.success"))
  //   setTimeout(function() {
  //     // 关闭对话框
  //     siyuanApiChangeFormVisible.value = false
  //     goToPageWithTarget("/blog/index.html", "_self")
  //   }, 500)
  // } catch (e) {
  //   siyuanApiChangeFormVisible.value = false
  //
  //   ElMessage.error(t("main.opt.failure"))
  //   logUtil.logError(t("main.opt.failure"), e)
  // }
}

const initConf = () => {
  // const siyuanCfg = getSiyuanCfg()
  //
  // siyuanApiChangeForm.apiUrl = siyuanCfg.baseUrl
  // siyuanApiChangeForm.pwd = siyuanCfg.token
  // siyuanApiChangeForm.middlewareUrl = siyuanCfg.middlewareUrl
  // logUtil.logInfo("初始化思源配置", siyuanCfg)
}

onMounted(async () => {
  logger.warn("测试", "123abc")
  initConf()

  // isInSiyuan.value = await inSiyuan()
})
</script>

<script lang="ts">
export default {
  name: "DefaultFooter",
}
</script>

<style scoped>
.footer {
  font-size: 12px;
  color: #bbb;
  text-align: center;
}

.footer .text {
  vertical-align: middle;
}

.s-dark {
  color: var(--el-color-primary);
  cursor: pointer;
}

.middleware-tip {
  text-align: left;
}
</style>
