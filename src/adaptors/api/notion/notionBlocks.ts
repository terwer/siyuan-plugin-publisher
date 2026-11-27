/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { markdownToBlocks } from "@tryfabric/martian"

/**
 * Notion 单次创建页面 / 追加子块允许的最大块数量。
 *
 * 创建页面（POST /pages）与追加子块（PATCH /blocks/{id}/children）的 children
 * 都限制为 100，超过会返回 400 validation_error。
 *
 * @see https://developers.notion.com/reference/post-page
 * @see https://developers.notion.com/reference/patch-block-children
 */
export const NOTION_MAX_BLOCKS_PER_REQUEST = 100

type NotionBlock = ReturnType<typeof markdownToBlocks>[number]

/**
 * 把 Markdown 转换成 Notion blocks。
 *
 * martian 默认会按 Notion 请求体上限截断转换结果（当前为 1000 块），
 * 长文会被静默丢弃；这里显式关闭截断，交给调用方分批写入。
 */
export function markdownToNotionBlocks(markdownText: string): NotionBlock[] {
  return markdownToBlocks(markdownText, { notionLimits: { truncate: false } })
}

/**
 * 按 Notion 单次请求上限把 blocks 切成有序批次。
 *
 * 保持原始顺序，且任何批次都不会超过 NOTION_MAX_BLOCKS_PER_REQUEST。
 */
export function chunkNotionBlocks(
  blocks: NotionBlock[],
  batchSize: number = NOTION_MAX_BLOCKS_PER_REQUEST
): NotionBlock[][] {
  if (batchSize <= 0) {
    throw new Error("Notion block batch size must be greater than 0")
  }

  const batches: NotionBlock[][] = []
  for (let index = 0; index < blocks.length; index += batchSize) {
    batches.push(blocks.slice(index, index + batchSize))
  }
  return batches
}
