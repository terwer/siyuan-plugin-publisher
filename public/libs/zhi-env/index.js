var _ = Object.defineProperty;
var D = (i, t, e) => t in i ? _(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var r = (i, t, e) => (D(i, typeof t != "symbol" ? t + "" : t, e), e);
class E {
}
/**
 * Node环境
 */
r(E, "NODE_ENV_KEY", "NODE_ENV"), /**
 * 开发环境
 */
r(E, "NODE_ENV_DEVELOPMENT", "development"), /**
 * 生产环境
 */
r(E, "NODE_ENV_PRODUCTION", "production"), /**
 * 测试环境
 */
r(E, "NODE_ENV_TEST", "test"), /**
 * 是否处于调试模式
 */
r(E, "VITE_DEBUG_MODE_KEY", "VITE_DEBUG_MODE");
class N {
  /**
   * 环境初始化
   *
   * @param envMeta - 需要传入 {"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":false} 。特别提醒：此参数是静态元数据，取决于最终使用的项目。因此仅仅在最终使用的地方显示传递此值，中间项目请保持参数传递
   * @see {@link https://vitejs.dev/guide/env-and-mode.html#production-replacement}
   */
  constructor(t) {
    r(this, "envMeta");
    this.envMeta = t;
  }
  /**
   * 是否是开发阶段调试
   */
  isNodeDev() {
    return this.getEnv(E.NODE_ENV_KEY) === E.NODE_ENV_DEVELOPMENT;
  }
  /**
   * 是否是调试阶段
   */
  isDev() {
    return this.isNodeDev() || this.getBooleanEnv(E.VITE_DEBUG_MODE_KEY);
  }
  /**
   * 获取环境变量，key不存在返回undefined
   * @param key - key
   */
  getEnv(t) {
    let e;
    try {
      this.envMeta[t] && (e = this.envMeta[t]);
    } catch {
    }
    return e;
  }
  /**
   * 获取String类型的环境变量，key不存在直接返回空值
   * @param key - key
   */
  getStringEnv(t) {
    return this.getEnv(t) ?? "";
  }
  /**
   * 获取Boolean类型的环境变量，key不存在返回false
   * @param key - key
   */
  getBooleanEnv(t) {
    let e = !1;
    return this.getEnv(t) && (e = this.getStringEnv(t).toLowerCase() === "true"), e;
  }
  /**
   * 获取环境变量，如果未定义或者为空值，用指定的默认值代替
   *
   * @param key - key
   * @param defaultValue - 默认值
   * @since 0.1.0
   * @author terwer
   */
  getEnvOrDefault(t, e) {
    const n = this.getStringEnv(t);
    return n.trim().length == 0 ? e : n;
  }
}
export {
  N as Env,
  E as EnvConstants
};
