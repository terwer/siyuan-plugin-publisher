/*
 * Copyright (c) 2023, Terwer . All rights reserved.
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

import { onBeforeMount, ref, Ref, watch } from "vue"

/**
 * 自定义加载计时器
 *
 * @param isTimerInit - 一个 ref，表示计时器是否初始启动
 * @returns loadingTime - 用于跟踪当前加载时间的 ref
 * @author terwer
 * @since 1.17.3
 */
export const useLoadingTimer = (isTimerInit: Ref<boolean>) => {
  const startTime = ref(0)
  const loadingTime = ref(0)

  // 开启计时器
  const startTimer = () => {
    startTime.value = new Date().getTime()
  }

  // 结束计时器
  const stopTimer = () => {
    const currentTime = new Date().getTime()
    loadingTime.value = currentTime - startTime.value
    // const totalLoadingTime = currentTime - startTime.value
    // const loadingTimeInSeconds = (totalLoadingTime / 1000).toFixed(3)
    // loadingTime.value = Number(loadingTimeInSeconds)
  }

  // ====================================

  // 加载前开启计时器
  onBeforeMount(() => {
    startTimer()
  })

  // 有变化停止
  watch(isTimerInit, (newIsInit) => {
    if (isTimerInit.value) {
      stopTimer()
    } else {
      startTimer()
    }
  })

  return { loadingTime }
}
