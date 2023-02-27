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
  <el-form class="switch-form" inline label-width="150px">
    <!-- Github -->
    <el-form-item :label="$t('service.switch.vuepress')">
      <el-switch v-model="vuepressEnabled" @change="vuepressOnChange" />
    </el-form-item>

    <el-form-item :label="$t('service.switch.hugo')">
      <el-switch v-model="hugoEnabled" @change="hugoOnChange" />
    </el-form-item>

    <el-form-item :label="$t('service.switch.hexo')">
      <el-switch v-model="hexoEnabled" @change="hexoOnChange" />
    </el-form-item>

    <el-form-item :label="$t('service.switch.jekyll')">
      <el-switch v-model="jekyllEnabled" @change="jekyllOnChange" />
    </el-form-item>

    <!-- Metaweblog API -->
    <el-form-item :label="$t('service.switch.jvue')">
      <el-switch v-model="jvueEnabled" @change="jvueOnChange" />
    </el-form-item>

    <el-form-item :label="$t('service.switch.conf')" v-if="false">
      <el-switch v-model="confEnabled" @change="confOnChange" />
    </el-form-item>

    <el-form-item :label="$t('service.switch.cnblogs')">
      <el-switch v-model="cnblogsEnabled" @change="cnblogsOnChange" />
    </el-form-item>

    <!-- WordPress -->
    <el-form-item :label="$t('service.switch.wordpress')">
      <el-switch v-model="wordpressEnabled" @change="wordpressOnChange" />
    </el-form-item>

    <!-- Common API -->
    <el-form-item :label="$t('service.switch.liandi')">
      <el-switch v-model="liandiEnabled" @change="liandiOnChange" />
    </el-form-item>

    <el-form-item :label="$t('service.switch.yuque')">
      <el-switch v-model="yuqueEnabled" @change="yuqueOnChange" />
    </el-form-item>

    <el-form-item :label="$t('service.switch.kms')">
      <el-switch v-model="kmsEnabled" @change="kmsOnChange" />
    </el-form-item>

    <!-- 动态配置 -->
    <el-form-item
      v-for="cfg in switchFormData.dynamicConfigArray"
      :key="cfg.posid"
      :label="cfg.platformName"
    >
      <el-switch
        v-model="cfg.modelValue"
        :active-value="getDynSwitchActive(cfg.platformKey)"
        :inactive-value="getDynSwitchInactive(cfg.platformKey)"
        @change="dynamicOnChange"
      />
    </el-form-item>

    <div v-if="showSwitchTip">
      <p>
        <el-alert
          :title="$t('platform.must.select.one')"
          type="error"
          :closable="false"
        />
      </p>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"
import { useTabCount } from "~/composables/publish/tabCountCom"
import { setBooleanConf } from "~/utils/configUtil"
import SWITCH_CONSTANTS from "~/utils/constants/switchConstants"
import {
  getDynSwitchActive,
  getDynSwitchInactive,
  getSwitchItem,
} from "~/utils/platform/dynamicConfig"

// use
const {
  tabCountStore,
  vuepressEnabled,
  hugoEnabled,
  hexoEnabled,
  jekyllEnabled,
  jvueEnabled,
  confEnabled,
  cnblogsEnabled,
  wordpressEnabled,
  liandiEnabled,
  yuqueEnabled,
  kmsEnabled,
  switchFormData,
  doCount,
} = useTabCount()

const showSwitchTip = ref(false)

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false,
  },
})

const vuepressOnChange = (val) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY, val)
  initConf()
}
const hugoOnChange = (val) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_HUGO_KEY, val)
  initConf()
}
const hexoOnChange = (val) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_HEXO_KEY, val)
  initConf()
}
const jekyllOnChange = (val) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_JEKYLL_KEY, val)
  initConf()
}
const jvueOnChange = (val) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_JVUE_KEY, val)
  initConf()
}
const confOnChange = (val) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_CONF_KEY, val)
  initConf()
}
const cnblogsOnChange = (val) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_CNBLOGS_KEY, val)
  initConf()
}
const wordpressOnChange = (val) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_WORDPRESS_KEY, val)
  initConf()
}
const liandiOnChange = (val) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_LIANDI_KEY, val)
  initConf()
}
const yuqueOnChange = (val) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_YUQUE_KEY, val)
  initConf()
}
const kmsOnChange = (val) => {
  setBooleanConf(SWITCH_CONSTANTS.SWITCH_KMS_KEY, val)
  initConf()
}
const dynamicOnChange = (val) => {
  const switchItem = getSwitchItem(val)
  setBooleanConf(switchItem.switchKey, switchItem.switchValue)
  initConf()
}

const initConf = () => {
  doCount()

  // 未启用，跳转设置页面
  if (tabCountStore.tabCount === 0) {
    showSwitchTip.value = true
  } else {
    showSwitchTip.value = false
  }
}

/* 监听props */
watch(
  () => props.isReload,
  async (oldValue, newValue) => {
    // Here you can add your functionality
    // as described in the name you will get old and new value of watched property
    initConf()
  }
)

onMounted(() => {
  // 初始化
  initConf()
})
</script>

<style scoped>
.switch-form {
  margin: 0 10px 16px;
}
</style>
