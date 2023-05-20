var r = Object.defineProperty;
var g = (n, t, s) => t in n ? r(n, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : n[t] = s;
var i = (n, t, s) => (g(n, typeof t != "symbol" ? t + "" : t, s), s);
(function(n, t) {
  !n || n.getElementById("livereloadscript") || (t = n.createElement("script"), t.async = 1, t.src = "//" + (self.location.host || "localhost").split(":")[0] + ":35729/livereload.js?snipver=1", t.id = "livereloadscript", n.getElementsByTagName("head")[0].appendChild(t));
})(self.document);
class a {
  static init(t) {
    this.appInstance = t.appInstance, this.Env = t.Env, this.BlogConstants = t.BlogConstants, this.BlogTypeEnum = t.BlogTypeEnum, this.SiyuanConstants = t.SiyuanConstants, this.SiyuanConfig = t.SiyuanConfig, this.SiYuanApiAdaptor = t.SiYuanApiAdaptor, this.BlogApi = t.BlogApi;
  }
  /**
   * 获取 siyuan-kernel-api 实例
   *
   * @param type - Env | BlogTypeEnum
   * @param cfg - BlogConfig
   * @return BlogApi
   */
  static blogApi(t, s) {
    if (!this.bApi) {
      let e, o;
      switch (t instanceof this.Env && (o = t.getEnv(this.BlogConstants.DEFAULT_BLOG_TYPE_KEY)), o) {
        case this.BlogTypeEnum.BlogTypeEnum_Wordpress:
          break;
        default: {
          if (t instanceof this.Env) {
            const c = t.getEnvOrDefault(this.SiyuanConstants.VITE_SIYUAN_API_URL_KEY, "http://127.0.0.1:6806"), l = t.getStringEnv(this.SiyuanConstants.VITE_SIYUAN_AUTH_TOKEN_KEY), p = new this.SiyuanConfig(c, l);
            p.fixTitle = !0, e = new this.SiYuanApiAdaptor(p);
          } else
            e = new this.SiYuanApiAdaptor(s), e.init(this.appInstance);
          break;
        }
      }
      if (!e)
        throw new Error("ApiAdaptor cannot be null");
      this.bApi = new this.BlogApi(e);
    }
    return this.bApi;
  }
}
/**
 * BlogApi
 * @private
 */
i(a, "appInstance"), i(a, "bApi"), i(a, "Env"), i(a, "BlogConstants"), i(a, "BlogTypeEnum"), i(a, "SiyuanConstants"), i(a, "SiyuanConfig"), i(a, "SiYuanApiAdaptor"), i(a, "BlogApi");
export {
  a as PublishSdk
};
