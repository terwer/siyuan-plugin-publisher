/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const preferencePicbedHelpConfig: PageHelpConfig = {
  pageId: "preference-picbed",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary: "配置默认图床和分平台图床偏好。支持 PicGo 内置图床、平台自有图床，或不使用图床。",
  fields: {
    defaultPicbed: {
      tip: "发布时默认使用的图床服务。平台可单独覆盖此设置。",
      link: "https://siyuan.wiki/s/20230908183031-3jdj3kh",
    },
  },
  faq: [
    { q: "PicGo 图床配置不生效？", a: "确认 PicGo 服务已安装且正常运行，检查端口和密钥配置。" },
    { q: "图片上传失败？", a: "检查目标图床的认证信息（API Key/Token）是否过期或错误。" },
  ],
}