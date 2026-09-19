/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { DynamicConfig } from "~/src/platforms/dynamicConfig.ts"

export interface V2OrderablePlatform {
  platformKey: string
  displayOrder?: number
}

export interface V2OrderableAccountPlatform extends V2OrderablePlatform {
  isEnabled?: boolean
}

export interface V2OrderableQuickPublishPlatform extends V2OrderablePlatform {
  isPublishReady?: boolean
}

const hasValidDisplayOrder = (value: unknown): value is number => {
  return typeof value === "number" && Number.isFinite(value)
}

export const resolveDisplayOrder = (item: V2OrderablePlatform, fallbackIndex: number): number => {
  return hasValidDisplayOrder(item.displayOrder) ? item.displayOrder : fallbackIndex
}

const withOriginalIndex = <T extends V2OrderablePlatform>(items: T[]) => {
  return items.map((item, originalIndex) => ({
    item,
    originalIndex,
    effectiveOrder: resolveDisplayOrder(item, originalIndex),
  }))
}

export const sortV2Accounts = <T extends V2OrderableAccountPlatform>(items: T[]): T[] => {
  return withOriginalIndex(items)
    .sort((left, right) => {
      const leftEnabledGroup = left.item.isEnabled === true ? 0 : 1
      const rightEnabledGroup = right.item.isEnabled === true ? 0 : 1

      return (
        leftEnabledGroup - rightEnabledGroup ||
        left.effectiveOrder - right.effectiveOrder ||
        left.originalIndex - right.originalIndex
      )
    })
    .map(({ item }) => item)
}

export const sortV2QuickPublish = <T extends V2OrderableQuickPublishPlatform>(items: T[]): T[] => {
  return withOriginalIndex(items)
    .sort((left, right) => {
      const leftReadyGroup = left.item.isPublishReady === true ? 0 : 1
      const rightReadyGroup = right.item.isPublishReady === true ? 0 : 1

      return (
        leftReadyGroup - rightReadyGroup ||
        left.effectiveOrder - right.effectiveOrder ||
        left.originalIndex - right.originalIndex
      )
    })
    .map(({ item }) => item)
}

export const getNextDisplayOrder = (items: V2OrderablePlatform[]): number => {
  const maxOrder = items.reduce((max, item, index) => {
    return Math.max(max, resolveDisplayOrder(item, index))
  }, -1)

  return maxOrder + 1
}

export const assignDisplayOrders = <T extends DynamicConfig>(dynamicConfigArray: T[], orderedPlatformKeys: string[]): T[] => {
  const orderKeySet = new Set(orderedPlatformKeys)
  const orderedItems: T[] = []
  const remainingItems: T[] = []

  for (const platformKey of orderedPlatformKeys) {
    const target = dynamicConfigArray.find((item) => item.platformKey === platformKey)
    if (target && !orderedItems.includes(target)) {
      orderedItems.push(target)
    }
  }

  for (const item of dynamicConfigArray) {
    if (!orderKeySet.has(item.platformKey)) {
      remainingItems.push(item)
    }
  }

  const nextArray = [...orderedItems, ...remainingItems]
  nextArray.forEach((item, index) => {
    item.displayOrder = index
  })

  return nextArray
}
