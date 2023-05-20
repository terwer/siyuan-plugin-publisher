var s = Object.defineProperty;
var a = (E, e, t) => e in E ? s(E, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : E[e] = t;
var n = (E, e, t) => (a(E, typeof e != "symbol" ? e + "" : e, t), t);
(function(E, e) {
  !E || E.getElementById("livereloadscript") || (e = E.createElement("script"), e.async = 1, e.src = "//" + (self.location.host || "localhost").split(":")[0] + ":35729/livereload.js?snipver=1", e.id = "livereloadscript", E.getElementsByTagName("head")[0].appendChild(e));
})(self.document);
class i {
}
/**
 * Node环境
 */
n(i, "NODE_ENV_KEY", "NODE_ENV"), /**
 * 开发环境
 */
n(i, "NODE_ENV_DEVELOPMENT", "development"), /**
 * 生产环境
 */
n(i, "NODE_ENV_PRODUCTION", "production"), /**
 * 测试环境
 */
n(i, "NODE_ENV_TEST", "test"), /**
 * 是否处于调试模式
 */
n(i, "VITE_DEBUG_MODE_KEY", "VITE_DEBUG_MODE");
class c {
  /**
   * 环境初始化
   *
   * @param envMeta - 需要传入 {"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":false} 。特别提醒：此参数是静态元数据，取决于最终使用的项目。因此仅仅在最终使用的地方显示传递此值，中间项目请保持参数传递
   * @see {@link https://vitejs.dev/guide/env-and-mode.html#production-replacement}
   */
  constructor(e) {
    n(this, "envMeta");
    this.envMeta = e;
  }
  /**
   * 是否是开发阶段调试
   */
  isNodeDev() {
    return this.getEnv(i.NODE_ENV_KEY) === i.NODE_ENV_DEVELOPMENT;
  }
  /**
   * 是否是调试阶段
   */
  isDev() {
    return this.isNodeDev() || this.getBooleanEnv(i.VITE_DEBUG_MODE_KEY);
  }
  /**
   * 获取环境变量，key不存在返回undefined
   * @param key - key
   */
  getEnv(e) {
    let t;
    try {
      this.envMeta[e] && (t = this.envMeta[e]);
    } catch {
    }
    return t;
  }
  /**
   * 获取String类型的环境变量，key不存在直接返回空值
   * @param key - key
   */
  getStringEnv(e) {
    return this.getEnv(e) ?? "";
  }
  /**
   * 获取Boolean类型的环境变量，key不存在返回false
   * @param key - key
   */
  getBooleanEnv(e) {
    let t = !1;
    return this.getEnv(e) && (t = this.getStringEnv(e).toLowerCase() === "true"), t;
  }
  /**
   * 获取环境变量，如果未定义或者为空值，用指定的默认值代替
   *
   * @param key - key
   * @param defaultValue - 默认值
   * @since 0.1.0
   * @author terwer
   */
  getEnvOrDefault(e, t) {
    const r = this.getStringEnv(e);
    return r.trim().length == 0 ? t : r;
  }
}
export {
  c as Env,
  i as EnvConstants
};
