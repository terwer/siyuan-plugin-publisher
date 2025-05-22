export default {
  pluginName: "WordPress 发布器",
  config: {
    endpoint: {
      title: "WordPress XMLRPC API 端点",
      description: "您的 WordPress 站点的 REST API 端点（例如：https://your-site.com/xmlrpc.php）",
    },
    username: {
      title: "用户名",
      description: "WordPress 用户名",
    },
    password: {
      title: "应用密码",
      description: "WordPress 密码",
    },
  },
  messages: {
    publishSuccess: "文章发布成功",
    publishFailed: "发布到 WordPress 失败",
    platformAvailable: "WordPress 平台连接成功",
    platformUnavailable: "WordPress 平台连接失败",
  },
}
