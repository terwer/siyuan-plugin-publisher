/*
 * Copyright (c) 2022, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { reactive, ref } from "vue"
import { useTabCountStore } from "~/stores/tabCountStore"
import {
  DynamicConfig,
  getDynamicJsonCfg,
  getDynSwitchKey,
  getDynSwitchModelValue,
} from "~/utils/platform/dynamicConfig"
import { getBooleanConf } from "~/utils/configUtil"
import SWITCH_CONSTANTS from "~/utils/constants/switchConstants"

/**
 * 计算使用的平台数
 */
export const useTabCount = (): any => {
  const tabCountStore = useTabCountStore()

  // Github
  const vuepressEnabled = ref(false)
  const hugoEnabled = ref(false)
  const hexoEnabled = ref(false)
  const jekyllEnabled = ref(false)

  // Metaweblog API
  const jvueEnabled = ref(false)
  const confEnabled = ref(false)
  const cnblogsEnabled = ref(false)

  // WordPress
  const wordpressEnabled = ref(false)

  // Common API
  const liandiEnabled = ref(false)
  const yuqueEnabled = ref(false)
  const kmsEnabled = ref(false)

  const switchFormData = reactive({
    dynamicConfigArray: [] as DynamicConfig[],
  })

  function doCount(): void {
    // 重新计数
    tabCountStore.resetCount()

    vuepressEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY)
    tabCountStore.incrementIf(vuepressEnabled.value)

    hugoEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_HUGO_KEY)
    tabCountStore.incrementIf(hugoEnabled.value)

    hexoEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_HEXO_KEY)
    tabCountStore.incrementIf(hexoEnabled.value)

    jekyllEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_JEKYLL_KEY)
    tabCountStore.incrementIf(jekyllEnabled.value)

    jvueEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_JVUE_KEY)
    tabCountStore.incrementIf(jvueEnabled.value)

    confEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_CONF_KEY)
    tabCountStore.incrementIf(confEnabled.value)

    cnblogsEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_CNBLOGS_KEY)
    tabCountStore.incrementIf(cnblogsEnabled.value)

    wordpressEnabled.value = getBooleanConf(
      SWITCH_CONSTANTS.SWITCH_WORDPRESS_KEY
    )
    tabCountStore.incrementIf(wordpressEnabled.value)

    liandiEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_LIANDI_KEY)
    tabCountStore.incrementIf(liandiEnabled.value)

    yuqueEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_YUQUE_KEY)
    tabCountStore.incrementIf(yuqueEnabled.value)

    kmsEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_KMS_KEY)
    tabCountStore.incrementIf(kmsEnabled.value)

    const dynamicJsonCfg = getDynamicJsonCfg()
    const results = dynamicJsonCfg.totalCfg || []
    switchFormData.dynamicConfigArray = []
    results.forEach((item) => {
      const switchKey = getDynSwitchKey(item.platformKey)
      const switchValue = getBooleanConf(switchKey)
      item.modelValue = getDynSwitchModelValue({
        switchKey: item.platformKey,
        switchValue,
      })
      tabCountStore.incrementIf(switchValue)

      switchFormData.dynamicConfigArray.push(item)
    })
  }

  return {
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
  }
}
