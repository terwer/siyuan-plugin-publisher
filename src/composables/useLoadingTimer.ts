/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
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
