var r = Object.defineProperty;
var g = (i, t, s) => t in i ? r(i, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : i[t] = s;
var n = (i, t, s) => (g(i, typeof t != "symbol" ? t + "" : t, s), s);
(function(i, t) {
  !i || i.getElementById("livereloadscript") || (t = i.createElement("script"), t.async = 1, t.src = "//" + (self.location.host || "localhost").split(":")[0] + ":35730/livereload.js?snipver=1", t.id = "livereloadscript", i.getElementsByTagName("head")[0].appendChild(t));
})(self.document);
class a {
  static init(t) {
    this.Env = t.Env, this.BlogConstants = t.BlogConstants, this.BlogTypeEnum = t.BlogTypeEnum, this.SiyuanConstants = t.SiyuanConstants, this.SiyuanConfig = t.SiyuanConfig, this.SiYuanApiAdaptor = t.SiYuanApiAdaptor, this.BlogApi = t.BlogApi;
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
            const p = t.getEnvOrDefault(this.SiyuanConstants.VITE_SIYUAN_API_URL_KEY, "http://127.0.0.1:6806"), c = t.getStringEnv(this.SiyuanConstants.VITE_SIYUAN_AUTH_TOKEN_KEY), l = new this.SiyuanConfig(p, c);
            l.fixTitle = !0, e = new this.SiYuanApiAdaptor(l);
          } else
            e = new this.SiYuanApiAdaptor(s);
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
n(a, "bApi"), n(a, "Env"), n(a, "BlogConstants"), n(a, "BlogTypeEnum"), n(a, "SiyuanConstants"), n(a, "SiyuanConfig"), n(a, "SiYuanApiAdaptor"), n(a, "BlogApi");
export {
  a as PublishSdk
};
