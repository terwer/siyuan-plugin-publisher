/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import * as _ from "lodash-es"
import { reactive, toRaw, computed, WritableComputedRef } from "vue"

/**
 * 创建一个可读写计算属性，用于处理响应式对象
 *
 * @example
 *
 * const formState = {
 *   platformConfig: useClonedForm(platformConfig.value),
 * }
 *
 * 等价于
 *
 * const clonedPlatformConfig = reactive(_.cloneDeep(toRaw(platformConfig.value)))
 * const formState = {
 *   platformConfig: computed<DynamicConfig, DynamicConfig>({
 *     get: () => clonedPlatformConfig,
 *     set: (newValue) => {
 *       Object.assign(clonedPlatformConfig, newValue)
 *     },
 *   }),
 * }
 *
 * @param source 响应式对象
 * @author terwer
 * @version 2.0.0
 * @since 2.0.0
 */
export function useClonedForm<T extends object>(source: T) {
  // 创建深拷贝的响应式对象
  const clonedConfig = reactive(_.cloneDeep(toRaw(source)))

  // 创建可读写计算属性
  return computed({
    get: () => clonedConfig,
    set: (newValue: T) => {
      return Object.assign(clonedConfig, newValue)
    },
  }) as WritableComputedRef<T, T>
}
