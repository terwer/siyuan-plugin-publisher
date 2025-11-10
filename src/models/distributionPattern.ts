/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 枚举，表示不同的分发模式
 */
enum DistributionPattern {
  /**
   * 表示 "覆盖" 模式
   */
  Override = "Override",

  /**
   * 表示 "合并" 模式
   */
  Merge = "Merge",
}

export { DistributionPattern }
