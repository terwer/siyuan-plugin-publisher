/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { computed, type WritableComputedRef } from "vue"

/**
 * 类型安全的响应式对象绑定，合并默认值和源对象
 *
 * 在获取时返回合并后的对象（源对象属性覆盖默认值），在设置时将新值合并到源对象中。
 *
 * ```
 *
 * const newSiyuanCfg = useComputedObject(state, {
 *    home: DEFAULT_SIYUAN_API_URL,
 *    apiUrl: DEFAULT_SIYUAN_API_URL,
 * })
 *
 * 相当于
 *
 * const newSiyuanCfg = computed({
 *   get: () => ({
 *     ...state.value,
 *     home: DEFAULT_SIYUAN_API_URL,
 *     apiUrl: DEFAULT_SIYUAN_API_URL,
 *   }),
 *   set: (value: SiyuanConfig) => {
 *     // 保留默认值逻辑，只允许修改 token
 *     update({ token: value.token })
 *     logger.debug("Update siyuan-cfg", value)
 *   },
 * })
 * ```
 *
 * @param source 响应式对象
 * @param defaultValue 默认值对象
 * @returns 合并后的响应式对象
 * @author terwer
 * @since 2.0.0
 */
export const useComputedObject = <T>(
  source: WritableComputedRef<T>,
  defaultValue?: Partial<T>,
): WritableComputedRef<T> => {
  return computed({
    get: () =>
      ({
        ...source.value,
        ...(defaultValue || {}),
      }) as T,
    set: (value: Partial<T>) => {
      // 将新值合并到源对象中
      source.value = {
        ...source.value,
        ...value,
      }
    },
  }) as WritableComputedRef<T>
}
