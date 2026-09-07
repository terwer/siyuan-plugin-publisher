/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const localSystemHelpConfig: PageHelpConfig = {
  pageId: "platform-config/fs_LocalSystem",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary: "发布到本地文件系统，把文档导出为 Markdown，并写入静态站点所需的 Front Matter；图片保存到配置的媒体目录。仅在桌面端（Electron）环境可用。",
  fields: {
    storePath: { tip: "文章输出目录。默认是当前用户 Downloads/syp，可使用插件支持的占位符生成实际目录。" },
    imageStorePath: { tip: "图片资源相对文章目录的保存位置，默认 assets。" },
    fsYamlType: { tip: "选择 Front Matter/YAML 风格，匹配 Hexo、Hugo、Jekyll、VuePress、VitePress 等目标站点。" },
    pageType: { tip: "本地系统通常输出 Markdown，除非目标流程要求 HTML。" },
    picbedService: { tip: "本地系统默认使用内置图片保存，图片写入配置的媒体目录。" },
  },
  faq: [
    { q: "为什么只有桌面环境可用？", a: "本地系统需要访问本机文件路径，仅在桌面端（Electron）环境启用该平台。" },
    { q: "图片会保存在哪里？", a: "图片保存到媒体存储路径，默认是文章目录下的 assets。最终路径会随 storePath 和占位符解析结果变化。" },
    { q: "YAML 类型该选哪个？", a: "根据后续消费这些 Markdown 文件的静态站点框架选择。普通 Markdown 可用默认类型。" },
  ],
  tour: [
    {
      target: "[data-syp-tour='storePath']",
      title: "文章输出目录",
      content: "设置 Markdown 文件写入的位置。确认目录存在且当前应用有写入权限。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='imageStorePath']",
      title: "媒体目录",
      content: "设置图片相对保存目录。默认 assets 适合多数静态站点。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='fsYamlType']",
      title: "YAML 类型",
      content: "选择目标站点需要的 Front Matter 格式。不同框架对标题、日期和标签字段要求不同。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片处理",
      content: "本地系统使用内置图片保存链路。没有外部图床需求时保持默认。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='validate']",
      title: "验证并保存",
      content: "验证路径和配置后再保存，随后即可执行本地文件发布。",
      placement: "top",
    },
  ],
}
