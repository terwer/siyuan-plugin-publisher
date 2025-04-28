/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

// import { computed, WritableComputedRef } from "vue"
//
// /**
//  * 类型安全的字段绑定工具
//  *
//  * @param source 响应式对象（必须包含 .value）
//  * @param field 字段名（自动类型推断）
//  */
// export const useComputedField = <T, K extends keyof T>(
//   source: WritableComputedRef<T>,
//   field: K,
// ): WritableComputedRef<T[K]> => {
//   return computed({
//     get: () => source.value[field],
//     set: (v) => {
//       source.value = { ...source.value, [field]: v }
//     },
//   })
// }

// 进阶版

import { computed, type WritableComputedRef } from "vue"

type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never

type Path<T> = PathImpl<T, keyof T>

type PathValue<T, P extends Path<T>> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? R extends Path<T[K]>
      ? PathValue<T[K], R>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never

/**
 * 类型安全的响应式字段绑定
 *
 * ```
 *  value = useComputedField(siyuanCfg, "password"),
 *
 *  相当于
 *
 *  value = computed({
 *     get: () => siyuanCfg.value.password,
 *     set: (v) => {
 *       siyuanCfg.value = {
 *         ...siyuanCfg.value,
 *         password: v,
 *       }
 *     },
 *   }),
 * ```
 *
 * @param source 响应式对象
 * @param path 字段路径（支持多级嵌套，形如 'a.b.c' 的字符串））
 * @param defaultValue 默认值
 * @author terwer
 * @since 2.0.0
 */
export const useComputedField = function <T, P extends Path<T>, D>(
  source: WritableComputedRef<T>,
  path: P,
  defaultValue?: Partial<T>,
): WritableComputedRef<PathValue<T, P> | D> {
  const keys = path.split(".") as Array<keyof any>
  // 检查是否传入了默认值参数
  const hasDefault = defaultValue && arguments.length >= 3

  return computed({
    get: () => {
      const value = keys.reduce((obj, key) => obj?.[key], source.value as any)
      return hasDefault ? (value !== undefined ? value : defaultValue) : value
    },
    set: (value) => {
      const newValue = { ...source.value }
      let current: any = newValue

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        current[key] = current[key] ? { ...current[key] } : {}
        current = current[key]
      }

      current[keys[keys.length - 1]] = value
      source.value = newValue
    },
  })
}
