/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
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

/**
 * 标题最大长度
 */
const MAX_TITLE_LENGTH = 10

/**
 * 文章简介最大长度
 */
const MAX_PREVIEW_LENGTH = 255

/**
 * 动态配置key，全系统唯一，请勿更改
 */
const DYNAMIC_CONFIG_KEY = "dynamic-config"

/**
 * 发布偏好设置，全系统唯一，请勿更改
 */
const PUBLISH_PREFERENCE_CONFIG_KEY = "publish-preference"

/**
 * 自动生成的文件名占位符
 */
const PUBLISH_DYNAMIC_SLUG = "[dynamic-generated-on-publish]"

/**
 * 文章PicGO图片信息Key
 */
const PICGO_FILE_MAP_KEY = "custom-picgo-file-map-key"

/**
 * 分词最大数目
 */
const DEFAULT_JIEBA_WORD_LENGTH = 5

export const CONSTANTS = {
  MAX_TITLE_LENGTH,
  MAX_PREVIEW_LENGTH,
  DYNAMIC_CONFIG_KEY,
  DEFAULT_JIEBA_WORD_LENGTH,
  PUBLISH_PREFERENCE_CONFIG_KEY,
  PUBLISH_DYNAMIC_SLUG,
  PICGO_FILE_MAP_KEY,
}
