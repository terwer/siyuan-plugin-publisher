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

import { YamlFormatObj } from "~/src/models/yamlFormatObj.ts"
import { CommonGithubConfig } from "~/src/adaptors/api/base/github/commonGithubConfig.ts"
import { Post } from "zhi-blog-api"
import { CommonBlogConfig } from "~/src/adaptors/api/base/commonBlogConfig.ts"

export interface IYamlConvertAdaptor {
  convertToYaml(post: Post, githubCfg?: CommonGithubConfig): YamlFormatObj

  convertToAttr(yamlObj: YamlFormatObj, githubCfg?: CommonGithubConfig): Post
}

/**
 * YAML转换适配器
 */
export class YamlConvertAdaptor implements IYamlConvertAdaptor {
  convertToYaml(post: Post, cfg?: CommonBlogConfig): YamlFormatObj {
    throw new Error("YamlConvertAdaptor.convertToYaml: 该功能未实现，请在子类重写该方法")
  }

  convertToAttr(yamlFormatObj: YamlFormatObj, cfg?: CommonBlogConfig): Post {
    throw new Error("YamlConvertAdaptor.convertToAttr: 该功能未实现，请在子类重写该方法")
  }
}
