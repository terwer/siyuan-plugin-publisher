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

/**
 * 获取 OSS 客户端
 *
 * @param endpoint - OSS服务的访问域名
 * @param bucket - 存储空间名称
 * @param token - 访问令牌
 * @returns - 返回一个OSS客户端对象
 *
 * @see [简单上传 | 阿里云 OSS](https://help.aliyun.com/zh/oss/developer-reference/simple-upload-8?spm=a2c4g.11186623.0.0.7e531769TAYbAL#concept-2161572)
 */
const getAliOssClient = (endpoint: string, bucket: string, token: any) => {
  //   new OSS({
  //   endpoint: "https://zhihu-pics-upload.zhimg.com",
  //   accessKeyId: token.access_id,
  //   accessKeySecret: token.access_key,
  //   stsToken: token.access_token,
  //   cname: true,
  //   bucket: "zhihu-pics",
  // })
  // @ts-expect-error
  return new OSS({
    endpoint: endpoint,
    accessKeyId: token.access_id,
    accessKeySecret: token.access_key,
    stsToken: token.access_token,
    cname: true,
    bucket: bucket,
  })
}

export { getAliOssClient }
