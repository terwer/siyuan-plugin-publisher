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

import { PageEditMode } from "~/utils/common/pageEditMode"
import { SourceContentShowType } from "~/utils/common/sourceContentShowType"

/**
 * 发布偏好设置
 */
export class PublishPreference {
  /**
   * 精简模式、源码模式
   */
  editMode: PageEditMode

  /**
   * 默认展示形式，HTML、MD、YAML等
   */
  contentShowType: SourceContentShowType

  /**
   * 是否处理标题（包括去除.md等后缀，去除数字编号）
   */
  fixTitle: boolean
  /**
   * 是否使用谷歌翻译，不使用将直接用拼音代替
   */
  useGoogleTranslate: boolean
  /**
   * 是否删除H1标签
   */
  removeH1: boolean
  /**
   * 是否自动生成标签
   */
  autoTag: boolean
  /**
   * 是否将siyuan虚拟链接转换为真实预览链接
   */
  renderSiyuanVirtualLink: boolean
  /**
   * 是否在第一次加载页面时自动生成属性（api验证通过才会执行）
   */
  makeAttrOnFirstLoad: boolean
  /**
   * 是否开启新窗口
   */
  newWin: boolean
  /**
   * 是否显示关闭按钮（思源笔记挂载菜单模式可以用）
   */
  showCloseBtn: boolean
  /**
   * 是否使用PicGO
   */
  usePicgo: boolean
  /**
   * 挂件背景色
   */
  mainBg: string
}
