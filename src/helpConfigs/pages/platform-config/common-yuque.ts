/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const yuqueHelpConfig: PageHelpConfig = {
  pageId: "platform-config/common_Yuque",
  helpUrl: "https://siyuan.wiki/s/20230908183639-btcnnmj",
  summary: "发布到语雀知识库；语雀 API 发布需要专业会员，这是平台策略限制。",
  fields: {
    home: { tip: "你的语雀主页地址，如 https://www.yuque.com/yourname" },
    apiUrl: { tip: "默认使用语雀 v2 API 地址。除非语雀官方接口变更，一般不需要修改。" },
    username: { tip: "语雀用户名或登录名，用于和 Token 对应的账号保持一致。" },
    token: {
      tip: "语雀 API Token，在语雀设置 → 访问令牌中生成",
      link: "https://www.yuque.com/settings/tokens",
      linkText: "前往生成 Token",
    },
    knowledgeSpace: { tip: "验证通过后会读取账号可写知识库。语雀 API 模式暂不支持编辑已发布文档所属知识库。" },
    picbedService: { tip: "语雀使用内置图片链路。若使用外部图床，请确认目标知识库允许外链图片。" },
  },
  faq: [
    { q: "提示「权限不足」？", a: "语雀 API 发布需要专业会员。免费版可改用语雀网页版（Cookie 模式），不要把这类失败当作插件配置损坏。" },
    { q: "知识库选择为空？", a: "确认 Token 正确生成，账号下存在可写知识库，并先点击验证让插件拉取知识库列表。" },
    { q: "为什么不能修改已发布文档所属知识库？", a: "这是语雀 API 模式当前限制；需要移动文档时，先删除原绑定后重新选择知识库发布。" },
  ],
  tour: [
    {
      target: "[data-syp-tour='home']",
      title: "语雀主页",
      content: "填写语雀个人或团队主页地址，用于生成发布后的预览链接。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='apiUrl']",
      title: "API 地址",
      content: "默认是语雀 v2 API，一般保持不变。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='username']",
      title: "语雀账号",
      content: "填写和 Token 对应的语雀账号信息，便于后续校验和排查。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='token']",
      title: "API Token",
      content: "在语雀设置里生成访问令牌后填入。API 发布需要语雀专业会员。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='knowledgeSpace']",
      title: "选择知识库",
      content: "验证通过后选择要写入的知识库。若列表为空，优先检查 Token 权限和会员状态。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='validate']",
      title: "验证配置",
      content: "点击验证，确认 Token、会员权限和知识库读取都可用后再发布。",
      placement: "top",
    },
  ],
}