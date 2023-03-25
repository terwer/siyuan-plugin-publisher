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

import { PostForm } from "~/utils/models/postForm"
import { IGithubCfg } from "~/utils/platform/github/githubCfg"
import { YamlFormatObj } from "~/utils/models/yamlFormatObj"

export interface IYamlConvertAdaptor {
  convertToYaml(postForm: PostForm, githubCfg?: IGithubCfg): YamlFormatObj

  convertToAttr(yamlObj: YamlFormatObj, githubCfg?: IGithubCfg): PostForm
}

/**
 * YAML转换适配器
 */
export class YamlConvertAdaptor implements IYamlConvertAdaptor {
  convertToYaml(postForm: PostForm, githubCfg?: IGithubCfg): YamlFormatObj {
    throw new Error("YamlConvertAdaptor.convertToYaml: 该功能未实现，请在子类重写该方法")
  }

  convertToAttr(yamlFormatObj: YamlFormatObj, githubCfg?: IGithubCfg): PostForm {
    throw new Error("YamlConvertAdaptor.convertToAttr: 该功能未实现，请在子类重写该方法")
  }
}
