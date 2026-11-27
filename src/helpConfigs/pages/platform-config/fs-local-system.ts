/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"
import { platformDocUrl } from "~/src/utils/site"

export const localSystemHelpConfig: PageHelpConfig = {
  pageId: "platform-config/fs_LocalSystem",
  helpUrl: platformDocUrl("fs-local-system"),
  summary: "发布到本地文件系统，把文档导出为 Markdown，并写入静态站点所需的 Front Matter；图片保存到配置的媒体目录。选择 Hugo YAML 类型时还支持页面目录（Leaf Bundle）。仅在桌面端（Electron）环境可用。",
  fields: {
    storePath: {
      tip: "文章输出目录（系统绝对路径），默认是下载目录下的 syp；路径里可写 [auto]，发布时按文章分类自动替换成分类名。",
      placeholder: "/Users/you/Downloads/syp",
    },
    imageStorePath: { tip: "单文件模式下图片、附件相对文章目录的保存位置，默认 assets；正文里的图片按该目录写成相对链接。Hugo 页面目录模式不使用该设置，图片固定写入 index.md 同目录。", placeholder: "assets" },
    fsYamlType: {
      tip:
        "Front Matter/YAML 风格：默认 / Hexo / Hugo / Jekyll / Vuepress / Vuepress2 / Vitepress / Quartz / Astro；" +
        "选具体框架时走该框架的适配链路，Front Matter 字段与该站点一致。",
        placeholder: "default",
    },
    contentLayout: {
      tip: "内容组织方式（仅 Hugo YAML 类型）：单文件写入「输出目录/<文件名>.md」，图片按媒体存储路径保存；页面目录（Leaf Bundle）写入「输出目录/<目录名>/index.md」，图片与 index.md 同目录并使用相对链接。默认单文件；切换只影响之后新发布的文章，已发布文章更新时保持原路径与图片方式。",
    },
    pageType: { tip: "输出格式，默认 Markdown；只有目标流程要求 HTML 时才改。" },
    picbedService: {
      tip:
        "图片处理方式：默认「当前平台」把图片写入配置的媒体目录；「PicGo 强烈推荐」改用你配置的 PicGo 图床；" +
        "「不使用」跳过图片处理，按原图地址引用。",
    },
  },
  faq: [
    { q: "为什么只有桌面环境可用？", a: "本地系统需要访问本机文件路径，仅在桌面端（Electron）环境启用该平台。" },
    { q: "图片会保存在哪里？", a: "单文件模式图片保存到媒体存储路径（默认文章目录下的 assets）；Hugo 页面目录模式图片写入 index.md 同目录，最终路径会随输出目录与 [auto] 解析结果变化。" },
    { q: "怎么导出 Hugo Leaf Bundle？", a: "把「YAML 类型」选为 Hugo，再在「内容组织方式」选择「页面目录（Leaf Bundle）」；文章会写成 <输出目录>/<目录名>/index.md，图片同目录。已有文章不会自动搬迁。" },
    { q: "YAML 类型该选哪个？", a: "根据后续消费这些 Markdown 文件的静态站点框架选择；不确定就保持「默认」，普通 Markdown 用它即可。" },
    { q: "按分类分文件夹怎么写路径？", a: "在输出目录里写 [auto]，例如 Downloads/syp/[auto]，发布时会被替换成该文章的分类名。" },
  ],
  tour: [
    {
      target: "[data-syp-tour='storePath']",
      title: "文章输出目录",
      content: "设置 Markdown 文件写入的位置，默认是下载目录下的 syp；确认目录存在且当前应用有写入权限。",
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
