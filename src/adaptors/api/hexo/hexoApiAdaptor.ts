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

import { CommonGithubApiAdaptor } from "~/src/adaptors/api/base/github/commonGithubApiAdaptor.ts"
import { Post } from "zhi-blog-api"
import { CommonGithubConfig } from "~/src/adaptors/api/base/github/commonGithubConfig.ts"
import { YamlConvertAdaptor } from "~/src/platforms/yamlConvertAdaptor.ts"
import { YamlFormatObj } from "~/src/models/yamlFormatObj.ts"
import { HexoYamlConverterAdaptor } from "~/src/adaptors/api/hexo/hexoYamlConverterAdaptor.ts"

/**
 * Hexo API 适配器
 *
 * @author terwer
 * @version 1.3.2
 * @since 0.8.1
 */
class HexoApiAdaptor extends CommonGithubApiAdaptor {
  public async preEditPost(post: Post, id?: string, publishCfg?: any): Promise<Post> {
    // 调用父类预处理
    await super.preEditPost(post, id, publishCfg)
    this.logger.info("handled preEditPost with parent")

    // 处理 YAML
    const cfg = this.cfg as CommonGithubConfig
    const yamlApi: YamlConvertAdaptor = new HexoYamlConverterAdaptor()
    const yamlObj: YamlFormatObj = yamlApi.convertToYaml(post, cfg)
    post.description = yamlObj.mdFullContent
    this.logger.info("handled yaml using HexoYamlConverterAdaptor")
    return post
  }
}

export { HexoApiAdaptor }
