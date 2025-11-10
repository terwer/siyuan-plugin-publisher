/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
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
