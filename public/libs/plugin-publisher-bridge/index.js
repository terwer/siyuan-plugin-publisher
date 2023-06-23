var st = Object.defineProperty;
var at = (e, r, t) => r in e ? st(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t;
var fe = (e, r, t) => (at(e, typeof r != "symbol" ? r + "" : r, t), t);
var lt = Object.defineProperty, ct = (e, r, t) => r in e ? lt(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, we = (e, r, t) => (ct(e, typeof r != "symbol" ? r + "" : r, t), t), ut = Object.defineProperty, ht = (e, r, t) => r in e ? ut(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, R = (e, r, t) => (ht(e, typeof r != "symbol" ? r + "" : r, t), t);
const H = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return H.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let S = H;
R(S, "isNode", typeof process < "u" && process.versions != null && process.versions.node != null), /**
* 是否在浏览器环境
*/
R(S, "isInBrowser", typeof window < "u" && typeof document < "u"), /**
* 浏览器路径分隔符
*/
R(S, "BrowserSeparator", "/"), /**
* 是否是Electron环境
*/
R(S, "isElectron", () => typeof process < "u" && process.versions != null && process.versions.electron != null), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
R(S, "hasNodeEnv", () => H.isElectron() || H.isNode), /**
* 通用的从 url 中获取获取参数的方法，优先获取查询参数，然后获取 hash 参数与
*
* @param key - 参数
* @author terwer
* @version 0.9.0
* @since 0.0.1
*/
R(S, "getQueryParam", (e) => {
  if (!H.isInBrowser)
    return "";
  const r = window.location.href, t = r.indexOf("?");
  if (t !== -1) {
    const n = r.indexOf("#", t), i = n !== -1 ? r.substring(t + 1, n) : r.substring(t + 1), s = new URLSearchParams(i).get(e);
    if (s)
      return s;
  }
  const o = r.indexOf("#");
  if (o !== -1) {
    const n = r.substring(o + 1), i = new URLSearchParams(n).get(e);
    if (i)
      return i;
  }
  return "";
}), /**
* 替换 URL 的参数
* 思路：
* 1. 使用了 URLSearchParams 对象来解析和构建 URL 查询参数。
*
* 2. 在处理包含 hash 片段的 URL 时使用了 split 函数将 URL 分成两部分：基本 URL 和 hash 片段。
*
* 3. 然后，再次使用 split 函数将基本 URL 分成两部分：路径和查询参数。
*
* 4. 将查询参数转换为 URLSearchParams 对象，然后设置指定的参数名和值。
*
* 5. 最后，使用 toString 函数将查询参数转换为字符串，并将其与路径组合成新的基本 URL。如果 URL 包含 hash 片段，则将其添加到新的基本 URL 中。
*
* @param url - 链接地址
* @param paramName - 参数名
* @param paramValue - 参数值
*/
R(S, "replaceUrlParam", (e, r, t) => {
  t == null && (t = "");
  const o = new RegExp("\\b(" + r + "=).*?(&|#|$)");
  if (e.search(o) >= 0)
    return e.replace(o, "$1" + t + "$2");
  const [n, i] = e.split("#"), [s, c] = n.split("?"), l = new URLSearchParams(c);
  l.set(r, t);
  const u = l.toString(), a = s + (u ? "?" + u : "");
  return i ? a + "#" + i : a;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
R(S, "setUrlParameter", (e, r, t) => {
  if (e.includes(r))
    return H.replaceUrlParam(e, r, t);
  const o = e.split("#");
  let n = o[0];
  const i = o[1];
  return n.includes("?") ? n += `&${r}=${t}` : n += `?${r}=${t}`, i && (n += "#" + i), n;
}), /**
* 重新加载指定tab
*
* @param tabname - tabname
* @param t - 延迟时间
*/
R(S, "reloadTabPage", (e, r) => {
  setTimeout(function() {
    if (H.isInBrowser) {
      const t = window.location.href;
      window.location.href = H.setUrlParameter(t, "tab", e);
    }
  }, r ?? 200);
}), /**
* 刷新当前tab页面
*
* @param t - 延迟时间
*/
R(S, "reloadPage", (e) => {
  setTimeout(function() {
    H.isInBrowser && window.location.reload();
  }, e ?? 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
* @param t - 延迟时间
*/
R(S, "reloadPageWithMessageCallback", (e, r, t) => {
  r && r(e), setTimeout(function() {
    H.isInBrowser && window.location.reload();
  }, t ?? 200);
});
var A = /* @__PURE__ */ ((e) => (e.BasePathType_Appearance = "Appearance", e.BasePathType_Data = "Data", e.BasePathType_Themes = "Themes", e.BasePathType_ZhiTheme = "ZhiTheme", e.BasePathType_None = "None", e))(A || {});
const j = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return S.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : !1;
  }
  /**
   * 思源笔记 window 对象
   */
  static siyuanWindow() {
    let r;
    return this.isInSiyuanWidget() ? r = parent.window : this.isInSiyuanNewWin() || this.isInSiyuanBrowser() || typeof window < "u" ? r = window : r = void 0, r;
  }
  // =========================
  // require end
  // =========================
  // =========================
  // import start
  // =========================
  /**
   * 引入json
   *
   * @param jsPath - js相对路径全路径
   * @param type - 类型
   */
  static async importJs(r, t) {
    let o = r;
    switch (t) {
      case A.BasePathType_Appearance:
        o = this.browserJoinPath(this.siyuanAppearanceRelativePath(), r);
        break;
      case A.BasePathType_Data:
        o = this.browserJoinPath(this.siyuanDataRelativePath(), r);
        break;
      case A.BasePathType_Themes:
        o = this.browserJoinPath(this.siyuanThemeRelativePath(), r);
        break;
      case A.BasePathType_ZhiTheme:
        o = this.browserJoinPath(this.zhiThemeRelativePath(), r);
        break;
      default:
        throw new Error("type must be provided");
    }
    const { default: n } = await import(
      /* @vite-ignore */
      o
    );
    return n;
  }
  /**
   * 引入json
   *
   * @param jsonPath - json相对路径全路径
   * @param type - 类型
   */
  // public static async importJson(jsonPath: string, type: BasePathTypeEnum) {
  //   let fullJsonPath = jsonPath
  //   switch (type) {
  //     case BasePathTypeEnum.BasePathType_Appearance:
  //       fullJsonPath = this.browserJoinPath(this.siyuanAppearanceRelativePath(), jsonPath)
  //       break
  //     case BasePathTypeEnum.BasePathType_Data:
  //       fullJsonPath = this.browserJoinPath(this.siyuanDataRelativePath(), jsonPath)
  //       break
  //     case BasePathTypeEnum.BasePathType_Themes:
  //       fullJsonPath = this.browserJoinPath(this.siyuanThemeRelativePath(), jsonPath)
  //       break
  //     case BasePathTypeEnum.BasePathType_ZhiTheme:
  //       fullJsonPath = this.browserJoinPath(this.zhiThemeRelativePath(), jsonPath)
  //       break
  //     default:
  //       throw new Error("type must be provided")
  //   }
  //
  //   const { default: data } = await import(/* @vite-ignore */ fullJsonPath, { assert: { type: "json" } })
  //   return data
  // }
  /**
   * 引入 json - 以 data 为基本路径
   *
   * @param jsonPath - 相对于 data 的相对路径
   */
  // public static async importDataJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_Data)
  // }
  /**
   * 引入 json - 以 appearance 为基本路径
   *
   * @param jsonPath - 相对于 appearance 的相对路径
   */
  // public static async importAppearanceJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_Appearance)
  // }
  /**
   * 引入 json - 以 themes 为基本路径
   *
   * @param jsonPath - 相对于 themes 的相对路径
   */
  // public static async importThemesJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_Themes)
  // }
  /**
   * 引入 zhi 主题的 json - 以 zhi 主题 的根路径为基本路径
   *
   * @param jsonPath - 相对于 zhi 主题根路径的相对路径
   */
  // public static async importZhiThemeJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_ZhiTheme)
  // }
  /**
   * 引入 zhi 主题的 js - 以 zhi 主题 的根路径为基本路径
   *
   * @param jsPath - 相对于 zhi 主题根路径的相对路径
   */
  static async importZhiThemeJs(r) {
    return await this.importJs(r, A.BasePathType_ZhiTheme);
  }
  // =========================
  // import start
  // =========================
  /**
   * 路径拼接
   *
   * @param paths - 路径数组
   */
  static joinPath(...r) {
    if (S.hasNodeEnv()) {
      const t = this.requireLib("path");
      if (t)
        return t.join(...r);
    }
    return this.browserJoinPath(...r);
  }
  static browserJoinPath(...r) {
    return r.join(S.BrowserSeparator);
  }
  /**
   * 思源笔记 conf 目录
   */
  static siyuanConfPath() {
    const r = this.siyuanWindow();
    if (!r)
      throw new Error("Not in siyuan env");
    return r.siyuan.config.system.confDir;
  }
  /**
   * 思源笔记 data 目录
   */
  static siyuanDataPath() {
    const r = this.siyuanWindow();
    if (!r)
      throw new Error("Not in siyuan env");
    return r.siyuan.config.system.dataDir;
  }
  /**
   * 思源笔记 data 目录-相对路径
   */
  static siyuanDataRelativePath() {
    if (!this.siyuanWindow())
      throw new Error("Not in siyuan env");
    return "";
  }
  /**
   * 思源笔记 appearance 目录
   */
  static siyuanAppearancePath() {
    return this.joinPath(this.siyuanConfPath(), "appearance");
  }
  /**
   * 思源笔记 appearance 目录-相对路径
   */
  static siyuanAppearanceRelativePath() {
    if (!this.siyuanWindow())
      throw new Error("Not in siyuan env");
    return this.browserJoinPath("", "appearance");
  }
  /**
   * 思源笔记 themes 目录-绝对路径
   *
   * 注意: 如果是非 electron 和 Node 环境，这里返回的是浏览器的路径，不是物理路径
   * 如果使用物理路径，请调用 siyuanAppearancePath 或者 siyuanDataPath
   *
   * @author terwer
   * @since 0.1.0
   */
  static siyuanThemePath() {
    if (S.hasNodeEnv())
      return this.joinPath(this.siyuanAppearancePath(), "themes");
    {
      const r = this.siyuanWindow();
      if (!r)
        throw new Error("Not in siyuan env");
      return this.joinPath(r.location.origin, "appearance", "themes");
    }
  }
  /**
   * 思源笔记 themes 目录-相对路径
   */
  static siyuanThemeRelativePath() {
    if (!this.siyuanWindow())
      throw new Error("Not in siyuan env");
    return this.browserJoinPath("", "appearance", "themes");
  }
  /**
   * zhi 主题目录 - 绝对路径
   */
  static zhiThemePath() {
    return this.joinPath(this.siyuanThemePath(), "zhi");
  }
  /**
   * zhi 主题目录 - 相对路径
   */
  static zhiThemeRelativePath() {
    return this.browserJoinPath(this.siyuanThemeRelativePath(), "zhi");
  }
};
let re = j;
R(re, "isInSiyuanWidget", () => S.isInBrowser ? typeof window.parent.process < "u" && window.parent.process.versions != null && window.parent.process.versions.electron != null : !1), /**
* 思源笔记新窗口
*
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
R(re, "isInSiyuanNewWin", () => typeof window < "u" && window.process && window.process.type === "renderer"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
R(re, "requireLib", (e, r = !0, t = A.BasePathType_None) => {
  if (!S.hasNodeEnv())
    throw new Error("require ony works on node env");
  let o = e;
  if (!r)
    switch (t) {
      case A.BasePathType_Appearance:
        o = j.joinPath(j.siyuanAppearancePath(), e);
        break;
      case A.BasePathType_Data:
        o = j.joinPath(j.siyuanDataPath(), e);
        break;
      case A.BasePathType_Themes:
        o = j.joinPath(j.siyuanAppearancePath(), "themes", e);
        break;
      case A.BasePathType_ZhiTheme:
        o = j.joinPath(j.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const n = j.siyuanWindow();
  if (!n)
    return require(o);
  if (typeof n.require < "u")
    return n.require(o);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
R(re, "requireAppearanceLib", (e) => j.requireLib(e, !1, A.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
R(re, "requireDataLib", (e) => j.requireLib(e, !1, A.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
R(re, "requireThemesLib", (e) => j.requireLib(e, !1, A.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
R(re, "requireZhiThemeLib", (e) => j.requireLib(e, !1, A.BasePathType_ZhiTheme));
var pt = Object.defineProperty, gt = (e, r, t) => r in e ? pt(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, ue = (e, r, t) => (gt(e, typeof r != "symbol" ? r + "" : r, t), t);
let ie = class {
};
ue(ie, "NODE_ENV_KEY", "NODE_ENV"), /**
* 开发环境
*/
ue(ie, "NODE_ENV_DEVELOPMENT", "development"), /**
* 生产环境
*/
ue(ie, "NODE_ENV_PRODUCTION", "production"), /**
* 测试环境
*/
ue(ie, "NODE_ENV_TEST", "test"), /**
* 是否处于调试模式
*/
ue(ie, "VITE_DEBUG_MODE_KEY", "VITE_DEBUG_MODE");
class yt {
  /**
   * 环境初始化
   *
   * @param envMeta - 需要传入 {"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":false} 。特别提醒：此参数是静态元数据，取决于最终使用的项目。因此仅仅在最终使用的地方显示传递此值，中间项目请保持参数传递
   * @see {@link https://vitejs.dev/guide/env-and-mode.html#production-replacement}
   */
  constructor(r) {
    ue(this, "envMeta"), this.envMeta = r;
  }
  /**
   * 是否是开发阶段调试
   */
  isNodeDev() {
    return this.getEnv(ie.NODE_ENV_KEY) === ie.NODE_ENV_DEVELOPMENT;
  }
  /**
   * 是否是调试阶段
   */
  isDev() {
    return this.isNodeDev() || this.getBooleanEnv(ie.VITE_DEBUG_MODE_KEY);
  }
  /**
   * 获取环境变量，key不存在返回undefined
   * @param key - key
   */
  getEnv(r) {
    let t;
    try {
      this.envMeta[r] && (t = this.envMeta[r]);
    } catch {
    }
    return t;
  }
  /**
   * 获取String类型的环境变量，key不存在直接返回空值
   * @param key - key
   */
  getStringEnv(r) {
    return this.getEnv(r) ?? "";
  }
  /**
   * 获取Boolean类型的环境变量，key不存在返回false
   * @param key - key
   */
  getBooleanEnv(r) {
    let t = !1;
    return this.getEnv(r) && (t = this.getStringEnv(r).toLowerCase() === "true"), t;
  }
  /**
   * 获取环境变量，如果未定义或者为空值，用指定的默认值代替
   *
   * @param key - key
   * @param defaultValue - 默认值
   * @since 0.1.0
   * @author terwer
   */
  getEnvOrDefault(r, t) {
    const o = this.getStringEnv(r);
    return o.trim().length == 0 ? t : o;
  }
}
var dt = Object.defineProperty, bt = (e, r, t) => r in e ? dt(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, pe = (e, r, t) => (bt(e, typeof r != "symbol" ? r + "" : r, t), t);
class Ee {
}
pe(Ee, "LOG_LEVEL_KEY", "VITE_LOG_LEVEL"), pe(Ee, "LOG_PREFIX_KEY", "VITE_LOG_PREFIX");
var V = /* @__PURE__ */ ((e) => (e.LOG_LEVEL_TRACE = "TRACE", e.LOG_LEVEL_DEBUG = "DEBUG", e.LOG_LEVEL_INFO = "INFO", e.LOG_LEVEL_WARN = "WARN", e.LOG_LEVEL_ERROR = "ERROR", e))(V || {}), qe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function _e(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ve = { exports: {} };
(function(e) {
  (function(r, t) {
    e.exports ? e.exports = t() : r.log = t();
  })(qe, function() {
    var r = function() {
    }, t = "undefined", o = typeof window !== t && typeof window.navigator !== t && /Trident\/|MSIE /.test(window.navigator.userAgent), n = [
      "trace",
      "debug",
      "info",
      "warn",
      "error"
    ];
    function i(h, w) {
      var v = h[w];
      if (typeof v.bind == "function")
        return v.bind(h);
      try {
        return Function.prototype.bind.call(v, h);
      } catch {
        return function() {
          return Function.prototype.apply.apply(v, [h, arguments]);
        };
      }
    }
    function s() {
      console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
    }
    function c(h) {
      return h === "debug" && (h = "log"), typeof console === t ? !1 : h === "trace" && o ? s : console[h] !== void 0 ? i(console, h) : console.log !== void 0 ? i(console, "log") : r;
    }
    function l(h, w) {
      for (var v = 0; v < n.length; v++) {
        var g = n[v];
        this[g] = v < h ? r : this.methodFactory(g, h, w);
      }
      this.log = this.debug;
    }
    function u(h, w, v) {
      return function() {
        typeof console !== t && (l.call(this, w, v), this[h].apply(this, arguments));
      };
    }
    function a(h, w, v) {
      return c(h) || u.apply(this, arguments);
    }
    function y(h, w, v) {
      var g = this, ee;
      w = w ?? "WARN";
      var d = "loglevel";
      typeof h == "string" ? d += ":" + h : typeof h == "symbol" && (d = void 0);
      function se(p) {
        var P = (n[p] || "silent").toUpperCase();
        if (!(typeof window === t || !d)) {
          try {
            window.localStorage[d] = P;
            return;
          } catch {
          }
          try {
            window.document.cookie = encodeURIComponent(d) + "=" + P + ";";
          } catch {
          }
        }
      }
      function te() {
        var p;
        if (!(typeof window === t || !d)) {
          try {
            p = window.localStorage[d];
          } catch {
          }
          if (typeof p === t)
            try {
              var P = window.document.cookie, I = P.indexOf(
                encodeURIComponent(d) + "="
              );
              I !== -1 && (p = /^([^;]+)/.exec(P.slice(I))[1]);
            } catch {
            }
          return g.levels[p] === void 0 && (p = void 0), p;
        }
      }
      function ae() {
        if (!(typeof window === t || !d)) {
          try {
            window.localStorage.removeItem(d);
            return;
          } catch {
          }
          try {
            window.document.cookie = encodeURIComponent(d) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
          } catch {
          }
        }
      }
      g.name = h, g.levels = {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        SILENT: 5
      }, g.methodFactory = v || a, g.getLevel = function() {
        return ee;
      }, g.setLevel = function(p, P) {
        if (typeof p == "string" && g.levels[p.toUpperCase()] !== void 0 && (p = g.levels[p.toUpperCase()]), typeof p == "number" && p >= 0 && p <= g.levels.SILENT) {
          if (ee = p, P !== !1 && se(p), l.call(g, p, h), typeof console === t && p < g.levels.SILENT)
            return "No console available for logging";
        } else
          throw "log.setLevel() called with invalid level: " + p;
      }, g.setDefaultLevel = function(p) {
        w = p, te() || g.setLevel(p, !1);
      }, g.resetLevel = function() {
        g.setLevel(w, !1), ae();
      }, g.enableAll = function(p) {
        g.setLevel(g.levels.TRACE, p);
      }, g.disableAll = function(p) {
        g.setLevel(g.levels.SILENT, p);
      };
      var L = te();
      L == null && (L = w), g.setLevel(L, !1);
    }
    var m = new y(), E = {};
    m.getLogger = function(h) {
      if (typeof h != "symbol" && typeof h != "string" || h === "")
        throw new TypeError("You must supply a name when creating a logger.");
      var w = E[h];
      return w || (w = E[h] = new y(
        h,
        m.getLevel(),
        m.methodFactory
      )), w;
    };
    var Z = typeof window !== t ? window.log : void 0;
    return m.noConflict = function() {
      return typeof window !== t && window.log === m && (window.log = Z), m;
    }, m.getLoggers = function() {
      return E;
    }, m.default = m, m;
  });
})(Ve);
var ft = Ve.exports;
const me = /* @__PURE__ */ _e(ft);
var Ue = { exports: {} };
(function(e) {
  (function(r, t) {
    e.exports ? e.exports = t() : r.prefix = t(r);
  })(qe, function(r) {
    var t = function(a) {
      for (var y = 1, m = arguments.length, E; y < m; y++)
        for (E in arguments[y])
          Object.prototype.hasOwnProperty.call(arguments[y], E) && (a[E] = arguments[y][E]);
      return a;
    }, o = {
      template: "[%t] %l:",
      levelFormatter: function(a) {
        return a.toUpperCase();
      },
      nameFormatter: function(a) {
        return a || "root";
      },
      timestampFormatter: function(a) {
        return a.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
      },
      format: void 0
    }, n, i = {}, s = function(a) {
      if (!a || !a.getLogger)
        throw new TypeError("Argument is not a root logger");
      n = a;
    }, c = function(a, y) {
      if (!a || !a.setLevel)
        throw new TypeError("Argument is not a logger");
      var m = a.methodFactory, E = a.name || "", Z = i[E] || i[""] || o;
      function h(w, v, g) {
        var ee = m(w, v, g), d = i[g] || i[""], se = d.template.indexOf("%t") !== -1, te = d.template.indexOf("%l") !== -1, ae = d.template.indexOf("%n") !== -1;
        return function() {
          for (var L = "", p = arguments.length, P = Array(p), I = 0; I < p; I++)
            P[I] = arguments[I];
          if (E || !i[g]) {
            var ye = d.timestampFormatter(/* @__PURE__ */ new Date()), de = d.levelFormatter(w), be = d.nameFormatter(g);
            d.format ? L += d.format(de, be, ye) : (L += d.template, se && (L = L.replace(/%t/, ye)), te && (L = L.replace(/%l/, de)), ae && (L = L.replace(/%n/, be))), P.length && typeof P[0] == "string" ? P[0] = L + " " + P[0] : P.unshift(L);
          }
          ee.apply(void 0, P);
        };
      }
      return i[E] || (a.methodFactory = h), y = y || {}, y.template && (y.format = void 0), i[E] = t({}, Z, y), a.setLevel(a.getLevel()), n || a.warn(
        "It is necessary to call the function reg() of loglevel-plugin-prefix before calling apply. From the next release, it will throw an error. See more: https://github.com/kutuluk/loglevel-plugin-prefix/blob/master/README.md"
      ), a;
    }, l = {
      reg: s,
      apply: c
    }, u;
    return r && (u = r.prefix, l.noConflict = function() {
      return r.prefix === l && (r.prefix = u), l;
    }), l;
  });
})(Ue);
var wt = Ue.exports;
const De = /* @__PURE__ */ _e(wt);
function mt() {
  const e = Error.prepareStackTrace;
  Error.prepareStackTrace = (t, o) => o;
  const r = new Error().stack.slice(1);
  return Error.prepareStackTrace = e, r;
}
let Se = class Me {
  /**
   * 解析日志级别为枚举
   *
   * @param enumObj - 枚举对象
   * @param value - 配置的值
   */
  static stringToEnumValue(r, t) {
    return r[Object.keys(r).filter((o) => r[o].toString() === t)[0]];
  }
  /**
   * 获取配置的日志级别
   */
  static getEnvLevel(r) {
    if (!r)
      return;
    let t;
    try {
      t = r.getEnvOrDefault(Ee.LOG_LEVEL_KEY, V.LOG_LEVEL_INFO);
    } catch {
      t = V.LOG_LEVEL_INFO;
    }
    const o = Me.stringToEnumValue(V, t.toUpperCase());
    return o || console.warn(
      "[zhi-log] LOG_LEVEL is invalid in you .env file.It must be either debug, info, warn or error, fallback to default info level"
    ), o ?? V.LOG_LEVEL_INFO;
  }
  /**
   * 获取默认日志
   */
  static getEnvLogger(r) {
    return r ? r.getEnv(Ee.LOG_PREFIX_KEY) : void 0;
  }
};
var Oe = { exports: {} }, xe = { exports: {} }, Ie;
function vt() {
  return Ie || (Ie = 1, function(e) {
    const r = typeof process < "u" && process.env.TERM_PROGRAM === "Hyper", t = typeof process < "u" && process.platform === "win32", o = typeof process < "u" && process.platform === "linux", n = {
      ballotDisabled: "☒",
      ballotOff: "☐",
      ballotOn: "☑",
      bullet: "•",
      bulletWhite: "◦",
      fullBlock: "█",
      heart: "❤",
      identicalTo: "≡",
      line: "─",
      mark: "※",
      middot: "·",
      minus: "－",
      multiplication: "×",
      obelus: "÷",
      pencilDownRight: "✎",
      pencilRight: "✏",
      pencilUpRight: "✐",
      percent: "%",
      pilcrow2: "❡",
      pilcrow: "¶",
      plusMinus: "±",
      question: "?",
      section: "§",
      starsOff: "☆",
      starsOn: "★",
      upDownArrow: "↕"
    }, i = Object.assign({}, n, {
      check: "√",
      cross: "×",
      ellipsisLarge: "...",
      ellipsis: "...",
      info: "i",
      questionSmall: "?",
      pointer: ">",
      pointerSmall: "»",
      radioOff: "( )",
      radioOn: "(*)",
      warning: "‼"
    }), s = Object.assign({}, n, {
      ballotCross: "✘",
      check: "✔",
      cross: "✖",
      ellipsisLarge: "⋯",
      ellipsis: "…",
      info: "ℹ",
      questionFull: "？",
      questionSmall: "﹖",
      pointer: o ? "▸" : "❯",
      pointerSmall: o ? "‣" : "›",
      radioOff: "◯",
      radioOn: "◉",
      warning: "⚠"
    });
    e.exports = t && !r ? i : s, Reflect.defineProperty(e.exports, "common", { enumerable: !1, value: n }), Reflect.defineProperty(e.exports, "windows", { enumerable: !1, value: i }), Reflect.defineProperty(e.exports, "other", { enumerable: !1, value: s });
  }(xe)), xe.exports;
}
const Et = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Pt = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g, Lt = () => typeof process < "u" ? process.env.FORCE_COLOR !== "0" : !1, Je = () => {
  const e = {
    enabled: Lt(),
    visible: !0,
    styles: {},
    keys: {}
  }, r = (i) => {
    let s = i.open = `\x1B[${i.codes[0]}m`, c = i.close = `\x1B[${i.codes[1]}m`, l = i.regex = new RegExp(`\\u001b\\[${i.codes[1]}m`, "g");
    return i.wrap = (u, a) => {
      u.includes(c) && (u = u.replace(l, c + s));
      let y = s + u + c;
      return a ? y.replace(/\r*\n/g, `${c}$&${s}`) : y;
    }, i;
  }, t = (i, s, c) => typeof i == "function" ? i(s) : i.wrap(s, c), o = (i, s) => {
    if (i === "" || i == null)
      return "";
    if (e.enabled === !1)
      return i;
    if (e.visible === !1)
      return "";
    let c = "" + i, l = c.includes(`
`), u = s.length;
    for (u > 0 && s.includes("unstyle") && (s = [.../* @__PURE__ */ new Set(["unstyle", ...s])].reverse()); u-- > 0; )
      c = t(e.styles[s[u]], c, l);
    return c;
  }, n = (i, s, c) => {
    e.styles[i] = r({ name: i, codes: s }), (e.keys[c] || (e.keys[c] = [])).push(i), Reflect.defineProperty(e, i, {
      configurable: !0,
      enumerable: !0,
      set(l) {
        e.alias(i, l);
      },
      get() {
        let l = (u) => o(u, l.stack);
        return Reflect.setPrototypeOf(l, e), l.stack = this.stack ? this.stack.concat(i) : [i], l;
      }
    });
  };
  return n("reset", [0, 0], "modifier"), n("bold", [1, 22], "modifier"), n("dim", [2, 22], "modifier"), n("italic", [3, 23], "modifier"), n("underline", [4, 24], "modifier"), n("inverse", [7, 27], "modifier"), n("hidden", [8, 28], "modifier"), n("strikethrough", [9, 29], "modifier"), n("black", [30, 39], "color"), n("red", [31, 39], "color"), n("green", [32, 39], "color"), n("yellow", [33, 39], "color"), n("blue", [34, 39], "color"), n("magenta", [35, 39], "color"), n("cyan", [36, 39], "color"), n("white", [37, 39], "color"), n("gray", [90, 39], "color"), n("grey", [90, 39], "color"), n("bgBlack", [40, 49], "bg"), n("bgRed", [41, 49], "bg"), n("bgGreen", [42, 49], "bg"), n("bgYellow", [43, 49], "bg"), n("bgBlue", [44, 49], "bg"), n("bgMagenta", [45, 49], "bg"), n("bgCyan", [46, 49], "bg"), n("bgWhite", [47, 49], "bg"), n("blackBright", [90, 39], "bright"), n("redBright", [91, 39], "bright"), n("greenBright", [92, 39], "bright"), n("yellowBright", [93, 39], "bright"), n("blueBright", [94, 39], "bright"), n("magentaBright", [95, 39], "bright"), n("cyanBright", [96, 39], "bright"), n("whiteBright", [97, 39], "bright"), n("bgBlackBright", [100, 49], "bgBright"), n("bgRedBright", [101, 49], "bgBright"), n("bgGreenBright", [102, 49], "bgBright"), n("bgYellowBright", [103, 49], "bgBright"), n("bgBlueBright", [104, 49], "bgBright"), n("bgMagentaBright", [105, 49], "bgBright"), n("bgCyanBright", [106, 49], "bgBright"), n("bgWhiteBright", [107, 49], "bgBright"), e.ansiRegex = Pt, e.hasColor = e.hasAnsi = (i) => (e.ansiRegex.lastIndex = 0, typeof i == "string" && i !== "" && e.ansiRegex.test(i)), e.alias = (i, s) => {
    let c = typeof s == "string" ? e[s] : s;
    if (typeof c != "function")
      throw new TypeError("Expected alias to be the name of an existing color (string) or a function");
    c.stack || (Reflect.defineProperty(c, "name", { value: i }), e.styles[i] = c, c.stack = [i]), Reflect.defineProperty(e, i, {
      configurable: !0,
      enumerable: !0,
      set(l) {
        e.alias(i, l);
      },
      get() {
        let l = (u) => o(u, l.stack);
        return Reflect.setPrototypeOf(l, e), l.stack = this.stack ? this.stack.concat(c.stack) : c.stack, l;
      }
    });
  }, e.theme = (i) => {
    if (!Et(i))
      throw new TypeError("Expected theme to be an object");
    for (let s of Object.keys(i))
      e.alias(s, i[s]);
    return e;
  }, e.alias("unstyle", (i) => typeof i == "string" && i !== "" ? (e.ansiRegex.lastIndex = 0, i.replace(e.ansiRegex, "")) : ""), e.alias("noop", (i) => i), e.none = e.clear = e.noop, e.stripColor = e.unstyle, e.symbols = vt(), e.define = n, e;
};
Oe.exports = Je();
Oe.exports.create = Je;
var Tt = Oe.exports;
const M = /* @__PURE__ */ _e(Tt);
let Te, ze, Ye, Ze, He = !0;
typeof process < "u" && ({ FORCE_COLOR: Te, NODE_DISABLE_COLORS: ze, NO_COLOR: Ye, TERM: Ze } = process.env || {}, He = process.stdout && process.stdout.isTTY);
const b = {
  enabled: !ze && Ye == null && Ze !== "dumb" && (Te != null && Te !== "0" || He),
  // modifiers
  reset: _(0, 0),
  bold: _(1, 22),
  dim: _(2, 22),
  italic: _(3, 23),
  underline: _(4, 24),
  inverse: _(7, 27),
  hidden: _(8, 28),
  strikethrough: _(9, 29),
  // colors
  black: _(30, 39),
  red: _(31, 39),
  green: _(32, 39),
  yellow: _(33, 39),
  blue: _(34, 39),
  magenta: _(35, 39),
  cyan: _(36, 39),
  white: _(37, 39),
  gray: _(90, 39),
  grey: _(90, 39),
  // background colors
  bgBlack: _(40, 49),
  bgRed: _(41, 49),
  bgGreen: _(42, 49),
  bgYellow: _(43, 49),
  bgBlue: _(44, 49),
  bgMagenta: _(45, 49),
  bgCyan: _(46, 49),
  bgWhite: _(47, 49)
};
function Ae(e, r) {
  let t = 0, o, n = "", i = "";
  for (; t < e.length; t++)
    o = e[t], n += o.open, i += o.close, ~r.indexOf(o.close) && (r = r.replace(o.rgx, o.close + o.open));
  return n + r + i;
}
function Bt(e, r) {
  let t = { has: e, keys: r };
  return t.reset = b.reset.bind(t), t.bold = b.bold.bind(t), t.dim = b.dim.bind(t), t.italic = b.italic.bind(t), t.underline = b.underline.bind(t), t.inverse = b.inverse.bind(t), t.hidden = b.hidden.bind(t), t.strikethrough = b.strikethrough.bind(t), t.black = b.black.bind(t), t.red = b.red.bind(t), t.green = b.green.bind(t), t.yellow = b.yellow.bind(t), t.blue = b.blue.bind(t), t.magenta = b.magenta.bind(t), t.cyan = b.cyan.bind(t), t.white = b.white.bind(t), t.gray = b.gray.bind(t), t.grey = b.grey.bind(t), t.bgBlack = b.bgBlack.bind(t), t.bgRed = b.bgRed.bind(t), t.bgGreen = b.bgGreen.bind(t), t.bgYellow = b.bgYellow.bind(t), t.bgBlue = b.bgBlue.bind(t), t.bgMagenta = b.bgMagenta.bind(t), t.bgCyan = b.bgCyan.bind(t), t.bgWhite = b.bgWhite.bind(t), t;
}
function _(e, r) {
  let t = {
    open: `\x1B[${e}m`,
    close: `\x1B[${r}m`,
    rgx: new RegExp(`\\x1b\\[${r}m`, "g")
  };
  return function(o) {
    return this !== void 0 && this.has !== void 0 ? (~this.has.indexOf(e) || (this.has.push(e), this.keys.push(t)), o === void 0 ? this : b.enabled ? Ae(this.keys, o + "") : o + "") : o === void 0 ? Bt([e], [t]) : b.enabled ? Ae([t], o + "") : o + "";
  };
}
var _t = Object.defineProperty, Ot = (e, r, t) => r in e ? _t(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, k = (e, r, t) => (Ot(e, typeof r != "symbol" ? r + "" : r, t), t);
const K = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return K.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let T = K;
k(T, "isNode", typeof process < "u" && process.versions != null && process.versions.node != null), /**
* 是否在浏览器环境
*/
k(T, "isInBrowser", typeof window < "u" && typeof document < "u"), /**
* 浏览器路径分隔符
*/
k(T, "BrowserSeparator", "/"), /**
* 是否是Electron环境
*/
k(T, "isElectron", () => typeof process < "u" && process.versions != null && process.versions.electron != null), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
k(T, "hasNodeEnv", () => K.isElectron() || K.isNode), /**
* 通用的从 url 中获取获取参数的方法，优先获取查询参数，然后获取 hash 参数与
*
* @param key - 参数
* @author terwer
* @version 0.9.0
* @since 0.0.1
*/
k(T, "getQueryParam", (e) => {
  if (!K.isInBrowser)
    return "";
  const r = window.location.href, t = r.indexOf("?");
  if (t !== -1) {
    const n = r.indexOf("#", t), i = n !== -1 ? r.substring(t + 1, n) : r.substring(t + 1), s = new URLSearchParams(i).get(e);
    if (s)
      return s;
  }
  const o = r.indexOf("#");
  if (o !== -1) {
    const n = r.substring(o + 1), i = new URLSearchParams(n).get(e);
    if (i)
      return i;
  }
  return "";
}), /**
* 替换 URL 的参数
* 思路：
* 1. 使用了 URLSearchParams 对象来解析和构建 URL 查询参数。
*
* 2. 在处理包含 hash 片段的 URL 时使用了 split 函数将 URL 分成两部分：基本 URL 和 hash 片段。
*
* 3. 然后，再次使用 split 函数将基本 URL 分成两部分：路径和查询参数。
*
* 4. 将查询参数转换为 URLSearchParams 对象，然后设置指定的参数名和值。
*
* 5. 最后，使用 toString 函数将查询参数转换为字符串，并将其与路径组合成新的基本 URL。如果 URL 包含 hash 片段，则将其添加到新的基本 URL 中。
*
* @param url - 链接地址
* @param paramName - 参数名
* @param paramValue - 参数值
*/
k(T, "replaceUrlParam", (e, r, t) => {
  t == null && (t = "");
  const o = new RegExp("\\b(" + r + "=).*?(&|#|$)");
  if (e.search(o) >= 0)
    return e.replace(o, "$1" + t + "$2");
  const [n, i] = e.split("#"), [s, c] = n.split("?"), l = new URLSearchParams(c);
  l.set(r, t);
  const u = l.toString(), a = s + (u ? "?" + u : "");
  return i ? a + "#" + i : a;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
k(T, "setUrlParameter", (e, r, t) => {
  if (e.includes(r))
    return K.replaceUrlParam(e, r, t);
  const o = e.split("#");
  let n = o[0];
  const i = o[1];
  return n.includes("?") ? n += `&${r}=${t}` : n += `?${r}=${t}`, i && (n += "#" + i), n;
}), /**
* 重新加载指定tab
*
* @param tabname - tabname
* @param t - 延迟时间
*/
k(T, "reloadTabPage", (e, r) => {
  setTimeout(function() {
    if (K.isInBrowser) {
      const t = window.location.href;
      window.location.href = K.setUrlParameter(t, "tab", e);
    }
  }, r ?? 200);
}), /**
* 刷新当前tab页面
*
* @param t - 延迟时间
*/
k(T, "reloadPage", (e) => {
  setTimeout(function() {
    K.isInBrowser && window.location.reload();
  }, e ?? 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
* @param t - 延迟时间
*/
k(T, "reloadPageWithMessageCallback", (e, r, t) => {
  r && r(e), setTimeout(function() {
    K.isInBrowser && window.location.reload();
  }, t ?? 200);
});
var C = /* @__PURE__ */ ((e) => (e.BasePathType_Appearance = "Appearance", e.BasePathType_Data = "Data", e.BasePathType_Themes = "Themes", e.BasePathType_ZhiTheme = "ZhiTheme", e.BasePathType_None = "None", e))(C || {});
const G = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return T.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : !1;
  }
  /**
   * 思源笔记 window 对象
   */
  static siyuanWindow() {
    let r;
    return this.isInSiyuanWidget() ? r = parent.window : this.isInSiyuanNewWin() || this.isInSiyuanBrowser() || typeof window < "u" ? r = window : r = void 0, r;
  }
  // =========================
  // require end
  // =========================
  // =========================
  // import start
  // =========================
  /**
   * 引入json
   *
   * @param jsPath - js相对路径全路径
   * @param type - 类型
   */
  static async importJs(r, t) {
    let o = r;
    switch (t) {
      case C.BasePathType_Appearance:
        o = this.browserJoinPath(this.siyuanAppearanceRelativePath(), r);
        break;
      case C.BasePathType_Data:
        o = this.browserJoinPath(this.siyuanDataRelativePath(), r);
        break;
      case C.BasePathType_Themes:
        o = this.browserJoinPath(this.siyuanThemeRelativePath(), r);
        break;
      case C.BasePathType_ZhiTheme:
        o = this.browserJoinPath(this.zhiThemeRelativePath(), r);
        break;
      default:
        throw new Error("type must be provided");
    }
    const { default: n } = await import(
      /* @vite-ignore */
      o
    );
    return n;
  }
  /**
   * 引入json
   *
   * @param jsonPath - json相对路径全路径
   * @param type - 类型
   */
  // public static async importJson(jsonPath: string, type: BasePathTypeEnum) {
  //   let fullJsonPath = jsonPath
  //   switch (type) {
  //     case BasePathTypeEnum.BasePathType_Appearance:
  //       fullJsonPath = this.browserJoinPath(this.siyuanAppearanceRelativePath(), jsonPath)
  //       break
  //     case BasePathTypeEnum.BasePathType_Data:
  //       fullJsonPath = this.browserJoinPath(this.siyuanDataRelativePath(), jsonPath)
  //       break
  //     case BasePathTypeEnum.BasePathType_Themes:
  //       fullJsonPath = this.browserJoinPath(this.siyuanThemeRelativePath(), jsonPath)
  //       break
  //     case BasePathTypeEnum.BasePathType_ZhiTheme:
  //       fullJsonPath = this.browserJoinPath(this.zhiThemeRelativePath(), jsonPath)
  //       break
  //     default:
  //       throw new Error("type must be provided")
  //   }
  //
  //   const { default: data } = await import(/* @vite-ignore */ fullJsonPath, { assert: { type: "json" } })
  //   return data
  // }
  /**
   * 引入 json - 以 data 为基本路径
   *
   * @param jsonPath - 相对于 data 的相对路径
   */
  // public static async importDataJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_Data)
  // }
  /**
   * 引入 json - 以 appearance 为基本路径
   *
   * @param jsonPath - 相对于 appearance 的相对路径
   */
  // public static async importAppearanceJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_Appearance)
  // }
  /**
   * 引入 json - 以 themes 为基本路径
   *
   * @param jsonPath - 相对于 themes 的相对路径
   */
  // public static async importThemesJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_Themes)
  // }
  /**
   * 引入 zhi 主题的 json - 以 zhi 主题 的根路径为基本路径
   *
   * @param jsonPath - 相对于 zhi 主题根路径的相对路径
   */
  // public static async importZhiThemeJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_ZhiTheme)
  // }
  /**
   * 引入 zhi 主题的 js - 以 zhi 主题 的根路径为基本路径
   *
   * @param jsPath - 相对于 zhi 主题根路径的相对路径
   */
  static async importZhiThemeJs(r) {
    return await this.importJs(r, C.BasePathType_ZhiTheme);
  }
  // =========================
  // import start
  // =========================
  /**
   * 路径拼接
   *
   * @param paths - 路径数组
   */
  static joinPath(...r) {
    if (T.hasNodeEnv()) {
      const t = this.requireLib("path");
      if (t)
        return t.join(...r);
    }
    return this.browserJoinPath(...r);
  }
  static browserJoinPath(...r) {
    return r.join(T.BrowserSeparator);
  }
  /**
   * 思源笔记 conf 目录
   */
  static siyuanConfPath() {
    const r = this.siyuanWindow();
    if (!r)
      throw new Error("Not in siyuan env");
    return r.siyuan.config.system.confDir;
  }
  /**
   * 思源笔记 data 目录
   */
  static siyuanDataPath() {
    const r = this.siyuanWindow();
    if (!r)
      throw new Error("Not in siyuan env");
    return r.siyuan.config.system.dataDir;
  }
  /**
   * 思源笔记 data 目录-相对路径
   */
  static siyuanDataRelativePath() {
    if (!this.siyuanWindow())
      throw new Error("Not in siyuan env");
    return "";
  }
  /**
   * 思源笔记 appearance 目录
   */
  static siyuanAppearancePath() {
    return this.joinPath(this.siyuanConfPath(), "appearance");
  }
  /**
   * 思源笔记 appearance 目录-相对路径
   */
  static siyuanAppearanceRelativePath() {
    if (!this.siyuanWindow())
      throw new Error("Not in siyuan env");
    return this.browserJoinPath("", "appearance");
  }
  /**
   * 思源笔记 themes 目录-绝对路径
   *
   * 注意: 如果是非 electron 和 Node 环境，这里返回的是浏览器的路径，不是物理路径
   * 如果使用物理路径，请调用 siyuanAppearancePath 或者 siyuanDataPath
   *
   * @author terwer
   * @since 0.1.0
   */
  static siyuanThemePath() {
    if (T.hasNodeEnv())
      return this.joinPath(this.siyuanAppearancePath(), "themes");
    {
      const r = this.siyuanWindow();
      if (!r)
        throw new Error("Not in siyuan env");
      return this.joinPath(r.location.origin, "appearance", "themes");
    }
  }
  /**
   * 思源笔记 themes 目录-相对路径
   */
  static siyuanThemeRelativePath() {
    if (!this.siyuanWindow())
      throw new Error("Not in siyuan env");
    return this.browserJoinPath("", "appearance", "themes");
  }
  /**
   * zhi 主题目录 - 绝对路径
   */
  static zhiThemePath() {
    return this.joinPath(this.siyuanThemePath(), "zhi");
  }
  /**
   * zhi 主题目录 - 相对路径
   */
  static zhiThemeRelativePath() {
    return this.browserJoinPath(this.siyuanThemeRelativePath(), "zhi");
  }
};
let le = G;
k(le, "isInSiyuanWidget", () => T.isInBrowser ? typeof window.parent.process < "u" && window.parent.process.versions != null && window.parent.process.versions.electron != null : !1), /**
* 思源笔记新窗口
*
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
k(le, "isInSiyuanNewWin", () => typeof window < "u" && window.process && window.process.type === "renderer"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
k(le, "requireLib", (e, r = !0, t = C.BasePathType_None) => {
  if (!T.hasNodeEnv())
    throw new Error("require ony works on node env");
  let o = e;
  if (!r)
    switch (t) {
      case C.BasePathType_Appearance:
        o = G.joinPath(G.siyuanAppearancePath(), e);
        break;
      case C.BasePathType_Data:
        o = G.joinPath(G.siyuanDataPath(), e);
        break;
      case C.BasePathType_Themes:
        o = G.joinPath(G.siyuanAppearancePath(), "themes", e);
        break;
      case C.BasePathType_ZhiTheme:
        o = G.joinPath(G.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const n = G.siyuanWindow();
  if (!n)
    return require(o);
  if (typeof n.require < "u")
    return n.require(o);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
k(le, "requireAppearanceLib", (e) => G.requireLib(e, !1, C.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
k(le, "requireDataLib", (e) => G.requireLib(e, !1, C.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
k(le, "requireThemesLib", (e) => G.requireLib(e, !1, C.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
k(le, "requireZhiThemeLib", (e) => G.requireLib(e, !1, C.BasePathType_ZhiTheme));
const J = {
  white: (e) => T.isElectron() ? M.whiteBright(e) : b.white(e),
  gray: (e) => T.isElectron() ? M.gray(e) : b.gray(e),
  blue: (e) => T.isElectron() ? M.blue(e) : b.blue(e),
  green: (e) => T.isElectron() ? M.green(e) : b.green(e),
  yellow: (e) => T.isElectron() ? M.yellow(e) : b.yellow(e),
  red: (e) => T.isElectron() ? M.red(e) : b.red(e),
  bgWhite: (e) => T.isElectron() ? M.bgWhiteBright(e) : b.bgWhite(e),
  bgGrey: (e) => T.isElectron() ? M.bgCyanBright(e) : b.bgCyan(e),
  bgBlue: (e) => T.isElectron() ? M.bgBlueBright(e) : b.bgBlue(e),
  bgGreen: (e) => T.isElectron() ? M.bgGreenBright(e) : b.bgGreen(e),
  bgYellow: (e) => T.isElectron() ? M.bgYellowBright(e) : b.bgYellow(e),
  bgRed: (e) => T.isElectron() ? M.bgRedBright(e) : b.bgRed(e)
};
class Rt {
  constructor(r, t, o) {
    pe(this, "consoleLogger", "console"), pe(this, "stackSize", 1), pe(this, "getLogger", (s) => {
      let c;
      if (s)
        c = s;
      else {
        const l = this.getCallStack(), u = [], a = [];
        for (let y = 0; y < l.length; y++) {
          const m = l[y], E = m.getFileName() ?? "none";
          if (y > this.stackSize - 1)
            break;
          const Z = E + "-" + m.getLineNumber() + ":" + m.getColumnNumber();
          u.push(Z);
        }
        a.length > 0 && (c = u.join(" -> "));
      }
      return (!c || c.trim().length === 0) && (c = this.consoleLogger), me.getLogger(c);
    }), this.stackSize = 1;
    let n;
    r ? n = r : n = Se.getEnvLevel(o), n = n ?? V.LOG_LEVEL_INFO, me.setLevel(n);
    const i = (s, c, l, u) => {
      const a = [], y = t ?? Se.getEnvLogger(o) ?? "zhi";
      return a.push(J.gray("[") + u(y) + J.gray("]")), a.push(J.gray("[") + J.gray(l.toString()) + J.gray("]")), a.push(u(s.toUpperCase().toString())), a.push(u(c)), a.push(J.gray(":")), a;
    };
    De.reg(me), De.apply(me, {
      format(s, c, l) {
        let u = [];
        const a = c ?? "";
        switch (s) {
          case V.LOG_LEVEL_TRACE:
            u = i(s, a, l, J.gray);
            break;
          case V.LOG_LEVEL_DEBUG:
            u = i(s, a, l, J.blue);
            break;
          case V.LOG_LEVEL_INFO:
            u = i(s, a, l, J.green);
            break;
          case V.LOG_LEVEL_WARN:
            u = i(s, a, l, J.yellow);
            break;
          case V.LOG_LEVEL_ERROR:
            u = i(s, a, l, J.red);
            break;
          default:
            u = i(V.LOG_LEVEL_INFO, a, l, J.green);
            break;
        }
        return u.join(" ");
      }
    });
  }
  /**
   * 设置输出栈的深度，默认1
   *
   * @param stackSize - 栈的深度
   */
  setStackSize(r) {
    this.stackSize = r ?? 1;
  }
  /**
   * 获取调用堆栈，若未获取到直接返回空数组
   *
   * @author terwer
   * @since 1.6.0
   */
  getCallStack() {
    let r;
    try {
      r = mt();
    } catch {
      r = [];
    }
    return r;
  }
}
class kt {
  /**
   * 默认日志级别
   *
   * @param level - 可选，未设置默认INFO
   * @param sign - 可选前缀，默认zhi
   * @param env - 可选环境变量实例
   */
  constructor(r, t, o) {
    pe(this, "logger"), this.logger = new Rt(r, t, o);
  }
  /**
   * 获取日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   * @protected
   */
  getLogger(r, t) {
    return this.logger.setStackSize(t), this.logger.getLogger(r);
  }
}
let Ce = class extends kt {
  constructor(r, t, o) {
    super(r, t, o);
  }
  /**
   * 获取默认的日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   */
  getLogger(r, t) {
    return super.getLogger(r, t);
  }
}, Nt = class Ke {
  /**
   * 默认日志记录器
   *
   * @param stackSize - 栈的深度
   * @param env - 环境变量实例
   */
  static defaultLogger(r, t) {
    return Ke.customLogFactory(void 0, void 0, r).getLogger(void 0, t);
  }
  /**
   * 自定义日志工厂
   *
   * @param level - 级别
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customLogFactory(r, t, o) {
    return new Ce(r, t, o);
  }
  /**
   * 自定义日志工厂，自定义前缀
   *
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customSignLogFactory(r, t) {
    return new Ce(void 0, r, t);
  }
};
class Dt {
  constructor() {
    we(this, "logger"), we(this, "siyuanDevice"), we(this, "initMethods", {
      /**
       * 初始化 sy-post-publisher 配置文件存储，适用于【iframe挂件模式】、【新窗口模式】以及【js片段模式】
       */
      initLocalStorageMethod: (t) => {
        const o = this.siyuanDevice.siyuanWindow(), n = this.siyuanDevice.siyuanDataPath();
        if (o.JsonLocalStorage) {
          this.logger.debug("JsonLocalStorage loaded, ignore.", t);
          return;
        }
        this.siyuanDevice.requireLib(
          `${n}/widgets/sy-post-publisher/lib/json-localstorage/json-localstorage.js`
        ).init("../../../../storage/syp/");
      },
      /**
       * 初始化插槽，仅【iframe挂件模式】、【自定义js片段模式】可用
       */
      initSlotMethod: () => {
        const t = this.siyuanDevice.siyuanDataPath();
        this.siyuanDevice.requireLib(`${t}/widgets/sy-post-publisher/lib/siyuan/silot.js`)();
      },
      /**
       * 初始化主题适配
       * @param entryName 入口名称
       */
      initThemeAdaptor: (t) => {
        const o = this.siyuanDevice.siyuanWindow(), n = this.siyuanDevice.siyuanDataPath();
        if (o.customstyle) {
          this.logger.debug("customstyle loaded, ignore.", t);
          return;
        }
        const i = this.siyuanDevice.requireLib(`${n}/widgets/sy-post-publisher/lib/siyuan/theme.js`);
        setTimeout(i, 3e3);
      },
      /**
       * 初始化初始化发布辅助功能
       * @param entryName 入口名称
       */
      initPublishHelper: (t) => {
        const o = this.siyuanDevice.siyuanWindow(), n = this.siyuanDevice.siyuanDataPath();
        if (o.syp) {
          this.logger.debug("syp已挂载，忽略", t);
          return;
        }
        this.siyuanDevice.requireLib(
          `${n}/widgets/sy-post-publisher/lib/siyuan/publish-helper.js`
        )();
      },
      /**
       * 初始化 PicGO 配置
       * @param entryName 入口名称
       */
      initPicgoExtension: (t) => {
        const o = this.siyuanDevice.siyuanWindow(), n = this.siyuanDevice.siyuanDataPath();
        if (o.SyPicgo) {
          this.logger.debug("SyPicgo loaded, ignore.", t);
          return;
        }
        const i = this.siyuanDevice.requireLib(
          `${n}/widgets/sy-post-publisher/lib/picgo/syPicgo.js`
        ).default, s = i.getCrossPlatformAppDataFolder(), c = `${n}/widgets/sy-post-publisher/lib/picgo/picgo.cfg.json`, l = i.joinPath(s, "sy-picgo"), u = "picgo.cfg.json", a = i.joinPath(l, u);
        i.upgradeCfg(c, l, u), this.logger.debug("PicGO配置文件初始化为=>", a);
        const y = i.initPicgo(a);
        o.SyPicgo = y, this.logger.debug("syPicgo=>", y);
      },
      /**
       * 初始化 SyCmd 配置，适用于【iframe挂件模式】、【新窗口模式】以及【js片段模式】
       * @param entryName 入口名称
       */
      initCmder: (t) => {
        const o = this.siyuanDevice.siyuanWindow(), n = this.siyuanDevice.siyuanDataPath();
        if (o.SyCmd) {
          this.logger.debug("SyCmd已挂载，忽略", t);
          return;
        }
        const i = this.siyuanDevice.requireLib(`${n}/widgets/sy-post-publisher/lib/cmd/syCmd.js`);
        o.SyCmd = i, this.logger.debug("syCmd=>", i);
      }
    }), we(this, "doInit", (t = {}) => {
      const {
        isInitLocalStorage: o = !1,
        isInitSlot: n = !1,
        isInitThemeAdaptor: i = !1,
        isInitPublishHelper: s = !1,
        isInitPicgoExtension: c = !1,
        isInitCmder: l = !1
      } = t;
      o && this.initMethods.initLocalStorageMethod("PublisherHook"), n && this.initMethods.initSlotMethod(), i && this.initMethods.initThemeAdaptor("PublisherHook"), s && this.initMethods.initPublishHelper("PublisherHook"), c && this.initMethods.initPicgoExtension("PublisherHook"), l && this.initMethods.initCmder("PublisherHook");
    });
    const r = new yt({ BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 });
    this.logger = Nt.customLogFactory(V.LOG_LEVEL_INFO, "publish-hook", r).getLogger(), this.siyuanDevice = re;
  }
  async init() {
    this.logger.info("Initiating sy-post-publisher from publish hook ...");
    try {
      this.doInit({
        isInitLocalStorage: !0,
        isInitSlot: !0,
        isInitThemeAdaptor: !0,
        isInitPublishHelper: !0,
        isInitPicgoExtension: !0,
        isInitCmder: !0
      });
    } catch (r) {
      this.logger.warn("Failed to init sy-post-publisher，it may not work in some case.Error=>", r);
    }
  }
}
var St = Object.defineProperty, xt = (e, r, t) => r in e ? St(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, he = (e, r, t) => (xt(e, typeof r != "symbol" ? r + "" : r, t), t);
let oe = class {
};
he(oe, "NODE_ENV_KEY", "NODE_ENV"), /**
* 开发环境
*/
he(oe, "NODE_ENV_DEVELOPMENT", "development"), /**
* 生产环境
*/
he(oe, "NODE_ENV_PRODUCTION", "production"), /**
* 测试环境
*/
he(oe, "NODE_ENV_TEST", "test"), /**
* 是否处于调试模式
*/
he(oe, "VITE_DEBUG_MODE_KEY", "VITE_DEBUG_MODE");
class It {
  /**
   * 环境初始化
   *
   * @param envMeta - 需要传入 {"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":false} 。特别提醒：此参数是静态元数据，取决于最终使用的项目。因此仅仅在最终使用的地方显示传递此值，中间项目请保持参数传递
   * @see {@link https://vitejs.dev/guide/env-and-mode.html#production-replacement}
   */
  constructor(r) {
    he(this, "envMeta"), this.envMeta = r;
  }
  /**
   * 是否是开发阶段调试
   */
  isNodeDev() {
    return this.getEnv(oe.NODE_ENV_KEY) === oe.NODE_ENV_DEVELOPMENT;
  }
  /**
   * 是否是调试阶段
   */
  isDev() {
    return this.isNodeDev() || this.getBooleanEnv(oe.VITE_DEBUG_MODE_KEY);
  }
  /**
   * 获取环境变量，key不存在返回undefined
   * @param key - key
   */
  getEnv(r) {
    let t;
    try {
      this.envMeta[r] && (t = this.envMeta[r]);
    } catch {
    }
    return t;
  }
  /**
   * 获取String类型的环境变量，key不存在直接返回空值
   * @param key - key
   */
  getStringEnv(r) {
    return this.getEnv(r) ?? "";
  }
  /**
   * 获取Boolean类型的环境变量，key不存在返回false
   * @param key - key
   */
  getBooleanEnv(r) {
    let t = !1;
    return this.getEnv(r) && (t = this.getStringEnv(r).toLowerCase() === "true"), t;
  }
  /**
   * 获取环境变量，如果未定义或者为空值，用指定的默认值代替
   *
   * @param key - key
   * @param defaultValue - 默认值
   * @since 0.1.0
   * @author terwer
   */
  getEnvOrDefault(r, t) {
    const o = this.getStringEnv(r);
    return o.trim().length == 0 ? t : o;
  }
}
var At = Object.defineProperty, Ct = (e, r, t) => r in e ? At(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, ge = (e, r, t) => (Ct(e, typeof r != "symbol" ? r + "" : r, t), t);
class Pe {
}
ge(Pe, "LOG_LEVEL_KEY", "VITE_LOG_LEVEL"), ge(Pe, "LOG_PREFIX_KEY", "VITE_LOG_PREFIX");
var U = /* @__PURE__ */ ((e) => (e.LOG_LEVEL_TRACE = "TRACE", e.LOG_LEVEL_DEBUG = "DEBUG", e.LOG_LEVEL_INFO = "INFO", e.LOG_LEVEL_WARN = "WARN", e.LOG_LEVEL_ERROR = "ERROR", e))(U || {}), Xe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Re(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Qe = { exports: {} };
(function(e) {
  (function(r, t) {
    e.exports ? e.exports = t() : r.log = t();
  })(Xe, function() {
    var r = function() {
    }, t = "undefined", o = typeof window !== t && typeof window.navigator !== t && /Trident\/|MSIE /.test(window.navigator.userAgent), n = [
      "trace",
      "debug",
      "info",
      "warn",
      "error"
    ];
    function i(h, w) {
      var v = h[w];
      if (typeof v.bind == "function")
        return v.bind(h);
      try {
        return Function.prototype.bind.call(v, h);
      } catch {
        return function() {
          return Function.prototype.apply.apply(v, [h, arguments]);
        };
      }
    }
    function s() {
      console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
    }
    function c(h) {
      return h === "debug" && (h = "log"), typeof console === t ? !1 : h === "trace" && o ? s : console[h] !== void 0 ? i(console, h) : console.log !== void 0 ? i(console, "log") : r;
    }
    function l(h, w) {
      for (var v = 0; v < n.length; v++) {
        var g = n[v];
        this[g] = v < h ? r : this.methodFactory(g, h, w);
      }
      this.log = this.debug;
    }
    function u(h, w, v) {
      return function() {
        typeof console !== t && (l.call(this, w, v), this[h].apply(this, arguments));
      };
    }
    function a(h, w, v) {
      return c(h) || u.apply(this, arguments);
    }
    function y(h, w, v) {
      var g = this, ee;
      w = w ?? "WARN";
      var d = "loglevel";
      typeof h == "string" ? d += ":" + h : typeof h == "symbol" && (d = void 0);
      function se(p) {
        var P = (n[p] || "silent").toUpperCase();
        if (!(typeof window === t || !d)) {
          try {
            window.localStorage[d] = P;
            return;
          } catch {
          }
          try {
            window.document.cookie = encodeURIComponent(d) + "=" + P + ";";
          } catch {
          }
        }
      }
      function te() {
        var p;
        if (!(typeof window === t || !d)) {
          try {
            p = window.localStorage[d];
          } catch {
          }
          if (typeof p === t)
            try {
              var P = window.document.cookie, I = P.indexOf(
                encodeURIComponent(d) + "="
              );
              I !== -1 && (p = /^([^;]+)/.exec(P.slice(I))[1]);
            } catch {
            }
          return g.levels[p] === void 0 && (p = void 0), p;
        }
      }
      function ae() {
        if (!(typeof window === t || !d)) {
          try {
            window.localStorage.removeItem(d);
            return;
          } catch {
          }
          try {
            window.document.cookie = encodeURIComponent(d) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
          } catch {
          }
        }
      }
      g.name = h, g.levels = {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        SILENT: 5
      }, g.methodFactory = v || a, g.getLevel = function() {
        return ee;
      }, g.setLevel = function(p, P) {
        if (typeof p == "string" && g.levels[p.toUpperCase()] !== void 0 && (p = g.levels[p.toUpperCase()]), typeof p == "number" && p >= 0 && p <= g.levels.SILENT) {
          if (ee = p, P !== !1 && se(p), l.call(g, p, h), typeof console === t && p < g.levels.SILENT)
            return "No console available for logging";
        } else
          throw "log.setLevel() called with invalid level: " + p;
      }, g.setDefaultLevel = function(p) {
        w = p, te() || g.setLevel(p, !1);
      }, g.resetLevel = function() {
        g.setLevel(w, !1), ae();
      }, g.enableAll = function(p) {
        g.setLevel(g.levels.TRACE, p);
      }, g.disableAll = function(p) {
        g.setLevel(g.levels.SILENT, p);
      };
      var L = te();
      L == null && (L = w), g.setLevel(L, !1);
    }
    var m = new y(), E = {};
    m.getLogger = function(h) {
      if (typeof h != "symbol" && typeof h != "string" || h === "")
        throw new TypeError("You must supply a name when creating a logger.");
      var w = E[h];
      return w || (w = E[h] = new y(
        h,
        m.getLevel(),
        m.methodFactory
      )), w;
    };
    var Z = typeof window !== t ? window.log : void 0;
    return m.noConflict = function() {
      return typeof window !== t && window.log === m && (window.log = Z), m;
    }, m.getLoggers = function() {
      return E;
    }, m.default = m, m;
  });
})(Qe);
var $t = Qe.exports;
const ve = /* @__PURE__ */ Re($t);
var et = { exports: {} };
(function(e) {
  (function(r, t) {
    e.exports ? e.exports = t() : r.prefix = t(r);
  })(Xe, function(r) {
    var t = function(a) {
      for (var y = 1, m = arguments.length, E; y < m; y++)
        for (E in arguments[y])
          Object.prototype.hasOwnProperty.call(arguments[y], E) && (a[E] = arguments[y][E]);
      return a;
    }, o = {
      template: "[%t] %l:",
      levelFormatter: function(a) {
        return a.toUpperCase();
      },
      nameFormatter: function(a) {
        return a || "root";
      },
      timestampFormatter: function(a) {
        return a.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
      },
      format: void 0
    }, n, i = {}, s = function(a) {
      if (!a || !a.getLogger)
        throw new TypeError("Argument is not a root logger");
      n = a;
    }, c = function(a, y) {
      if (!a || !a.setLevel)
        throw new TypeError("Argument is not a logger");
      var m = a.methodFactory, E = a.name || "", Z = i[E] || i[""] || o;
      function h(w, v, g) {
        var ee = m(w, v, g), d = i[g] || i[""], se = d.template.indexOf("%t") !== -1, te = d.template.indexOf("%l") !== -1, ae = d.template.indexOf("%n") !== -1;
        return function() {
          for (var L = "", p = arguments.length, P = Array(p), I = 0; I < p; I++)
            P[I] = arguments[I];
          if (E || !i[g]) {
            var ye = d.timestampFormatter(/* @__PURE__ */ new Date()), de = d.levelFormatter(w), be = d.nameFormatter(g);
            d.format ? L += d.format(de, be, ye) : (L += d.template, se && (L = L.replace(/%t/, ye)), te && (L = L.replace(/%l/, de)), ae && (L = L.replace(/%n/, be))), P.length && typeof P[0] == "string" ? P[0] = L + " " + P[0] : P.unshift(L);
          }
          ee.apply(void 0, P);
        };
      }
      return i[E] || (a.methodFactory = h), y = y || {}, y.template && (y.format = void 0), i[E] = t({}, Z, y), a.setLevel(a.getLevel()), n || a.warn(
        "It is necessary to call the function reg() of loglevel-plugin-prefix before calling apply. From the next release, it will throw an error. See more: https://github.com/kutuluk/loglevel-plugin-prefix/blob/master/README.md"
      ), a;
    }, l = {
      reg: s,
      apply: c
    }, u;
    return r && (u = r.prefix, l.noConflict = function() {
      return r.prefix === l && (r.prefix = u), l;
    }), l;
  });
})(et);
var Wt = et.exports;
const $e = /* @__PURE__ */ Re(Wt);
function jt() {
  const e = Error.prepareStackTrace;
  Error.prepareStackTrace = (t, o) => o;
  const r = new Error().stack.slice(1);
  return Error.prepareStackTrace = e, r;
}
class Le {
  /**
   * 解析日志级别为枚举
   *
   * @param enumObj - 枚举对象
   * @param value - 配置的值
   */
  static stringToEnumValue(r, t) {
    return r[Object.keys(r).filter((o) => r[o].toString() === t)[0]];
  }
  /**
   * 获取配置的日志级别
   */
  static getEnvLevel(r) {
    if (!r)
      return;
    let t;
    try {
      t = r.getEnvOrDefault(Pe.LOG_LEVEL_KEY, U.LOG_LEVEL_INFO);
    } catch {
      t = U.LOG_LEVEL_INFO;
    }
    const o = Le.stringToEnumValue(U, t.toUpperCase());
    return o || console.warn(
      "[zhi-log] LOG_LEVEL is invalid in you .env file.It must be either debug, info, warn or error, fallback to default info level"
    ), o ?? U.LOG_LEVEL_INFO;
  }
  /**
   * 获取默认日志
   */
  static getEnvLogger(r) {
    return r ? r.getEnv(Pe.LOG_PREFIX_KEY) : void 0;
  }
}
var ke = { exports: {} }, We = { exports: {} }, je;
function Gt() {
  return je || (je = 1, function(e) {
    const r = typeof process < "u" && process.env.TERM_PROGRAM === "Hyper", t = typeof process < "u" && process.platform === "win32", o = typeof process < "u" && process.platform === "linux", n = {
      ballotDisabled: "☒",
      ballotOff: "☐",
      ballotOn: "☑",
      bullet: "•",
      bulletWhite: "◦",
      fullBlock: "█",
      heart: "❤",
      identicalTo: "≡",
      line: "─",
      mark: "※",
      middot: "·",
      minus: "－",
      multiplication: "×",
      obelus: "÷",
      pencilDownRight: "✎",
      pencilRight: "✏",
      pencilUpRight: "✐",
      percent: "%",
      pilcrow2: "❡",
      pilcrow: "¶",
      plusMinus: "±",
      question: "?",
      section: "§",
      starsOff: "☆",
      starsOn: "★",
      upDownArrow: "↕"
    }, i = Object.assign({}, n, {
      check: "√",
      cross: "×",
      ellipsisLarge: "...",
      ellipsis: "...",
      info: "i",
      questionSmall: "?",
      pointer: ">",
      pointerSmall: "»",
      radioOff: "( )",
      radioOn: "(*)",
      warning: "‼"
    }), s = Object.assign({}, n, {
      ballotCross: "✘",
      check: "✔",
      cross: "✖",
      ellipsisLarge: "⋯",
      ellipsis: "…",
      info: "ℹ",
      questionFull: "？",
      questionSmall: "﹖",
      pointer: o ? "▸" : "❯",
      pointerSmall: o ? "‣" : "›",
      radioOff: "◯",
      radioOn: "◉",
      warning: "⚠"
    });
    e.exports = t && !r ? i : s, Reflect.defineProperty(e.exports, "common", { enumerable: !1, value: n }), Reflect.defineProperty(e.exports, "windows", { enumerable: !1, value: i }), Reflect.defineProperty(e.exports, "other", { enumerable: !1, value: s });
  }(We)), We.exports;
}
const Ft = (e) => e !== null && typeof e == "object" && !Array.isArray(e), qt = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g, Vt = () => typeof process < "u" ? process.env.FORCE_COLOR !== "0" : !1, tt = () => {
  const e = {
    enabled: Vt(),
    visible: !0,
    styles: {},
    keys: {}
  }, r = (i) => {
    let s = i.open = `\x1B[${i.codes[0]}m`, c = i.close = `\x1B[${i.codes[1]}m`, l = i.regex = new RegExp(`\\u001b\\[${i.codes[1]}m`, "g");
    return i.wrap = (u, a) => {
      u.includes(c) && (u = u.replace(l, c + s));
      let y = s + u + c;
      return a ? y.replace(/\r*\n/g, `${c}$&${s}`) : y;
    }, i;
  }, t = (i, s, c) => typeof i == "function" ? i(s) : i.wrap(s, c), o = (i, s) => {
    if (i === "" || i == null)
      return "";
    if (e.enabled === !1)
      return i;
    if (e.visible === !1)
      return "";
    let c = "" + i, l = c.includes(`
`), u = s.length;
    for (u > 0 && s.includes("unstyle") && (s = [.../* @__PURE__ */ new Set(["unstyle", ...s])].reverse()); u-- > 0; )
      c = t(e.styles[s[u]], c, l);
    return c;
  }, n = (i, s, c) => {
    e.styles[i] = r({ name: i, codes: s }), (e.keys[c] || (e.keys[c] = [])).push(i), Reflect.defineProperty(e, i, {
      configurable: !0,
      enumerable: !0,
      set(l) {
        e.alias(i, l);
      },
      get() {
        let l = (u) => o(u, l.stack);
        return Reflect.setPrototypeOf(l, e), l.stack = this.stack ? this.stack.concat(i) : [i], l;
      }
    });
  };
  return n("reset", [0, 0], "modifier"), n("bold", [1, 22], "modifier"), n("dim", [2, 22], "modifier"), n("italic", [3, 23], "modifier"), n("underline", [4, 24], "modifier"), n("inverse", [7, 27], "modifier"), n("hidden", [8, 28], "modifier"), n("strikethrough", [9, 29], "modifier"), n("black", [30, 39], "color"), n("red", [31, 39], "color"), n("green", [32, 39], "color"), n("yellow", [33, 39], "color"), n("blue", [34, 39], "color"), n("magenta", [35, 39], "color"), n("cyan", [36, 39], "color"), n("white", [37, 39], "color"), n("gray", [90, 39], "color"), n("grey", [90, 39], "color"), n("bgBlack", [40, 49], "bg"), n("bgRed", [41, 49], "bg"), n("bgGreen", [42, 49], "bg"), n("bgYellow", [43, 49], "bg"), n("bgBlue", [44, 49], "bg"), n("bgMagenta", [45, 49], "bg"), n("bgCyan", [46, 49], "bg"), n("bgWhite", [47, 49], "bg"), n("blackBright", [90, 39], "bright"), n("redBright", [91, 39], "bright"), n("greenBright", [92, 39], "bright"), n("yellowBright", [93, 39], "bright"), n("blueBright", [94, 39], "bright"), n("magentaBright", [95, 39], "bright"), n("cyanBright", [96, 39], "bright"), n("whiteBright", [97, 39], "bright"), n("bgBlackBright", [100, 49], "bgBright"), n("bgRedBright", [101, 49], "bgBright"), n("bgGreenBright", [102, 49], "bgBright"), n("bgYellowBright", [103, 49], "bgBright"), n("bgBlueBright", [104, 49], "bgBright"), n("bgMagentaBright", [105, 49], "bgBright"), n("bgCyanBright", [106, 49], "bgBright"), n("bgWhiteBright", [107, 49], "bgBright"), e.ansiRegex = qt, e.hasColor = e.hasAnsi = (i) => (e.ansiRegex.lastIndex = 0, typeof i == "string" && i !== "" && e.ansiRegex.test(i)), e.alias = (i, s) => {
    let c = typeof s == "string" ? e[s] : s;
    if (typeof c != "function")
      throw new TypeError("Expected alias to be the name of an existing color (string) or a function");
    c.stack || (Reflect.defineProperty(c, "name", { value: i }), e.styles[i] = c, c.stack = [i]), Reflect.defineProperty(e, i, {
      configurable: !0,
      enumerable: !0,
      set(l) {
        e.alias(i, l);
      },
      get() {
        let l = (u) => o(u, l.stack);
        return Reflect.setPrototypeOf(l, e), l.stack = this.stack ? this.stack.concat(c.stack) : c.stack, l;
      }
    });
  }, e.theme = (i) => {
    if (!Ft(i))
      throw new TypeError("Expected theme to be an object");
    for (let s of Object.keys(i))
      e.alias(s, i[s]);
    return e;
  }, e.alias("unstyle", (i) => typeof i == "string" && i !== "" ? (e.ansiRegex.lastIndex = 0, i.replace(e.ansiRegex, "")) : ""), e.alias("noop", (i) => i), e.none = e.clear = e.noop, e.stripColor = e.unstyle, e.symbols = Gt(), e.define = n, e;
};
ke.exports = tt();
ke.exports.create = tt;
var Ut = ke.exports;
const z = /* @__PURE__ */ Re(Ut);
let Be, rt, nt, it, ot = !0;
typeof process < "u" && ({ FORCE_COLOR: Be, NODE_DISABLE_COLORS: rt, NO_COLOR: nt, TERM: it } = process.env || {}, ot = process.stdout && process.stdout.isTTY);
const f = {
  enabled: !rt && nt == null && it !== "dumb" && (Be != null && Be !== "0" || ot),
  // modifiers
  reset: O(0, 0),
  bold: O(1, 22),
  dim: O(2, 22),
  italic: O(3, 23),
  underline: O(4, 24),
  inverse: O(7, 27),
  hidden: O(8, 28),
  strikethrough: O(9, 29),
  // colors
  black: O(30, 39),
  red: O(31, 39),
  green: O(32, 39),
  yellow: O(33, 39),
  blue: O(34, 39),
  magenta: O(35, 39),
  cyan: O(36, 39),
  white: O(37, 39),
  gray: O(90, 39),
  grey: O(90, 39),
  // background colors
  bgBlack: O(40, 49),
  bgRed: O(41, 49),
  bgGreen: O(42, 49),
  bgYellow: O(43, 49),
  bgBlue: O(44, 49),
  bgMagenta: O(45, 49),
  bgCyan: O(46, 49),
  bgWhite: O(47, 49)
};
function Ge(e, r) {
  let t = 0, o, n = "", i = "";
  for (; t < e.length; t++)
    o = e[t], n += o.open, i += o.close, ~r.indexOf(o.close) && (r = r.replace(o.rgx, o.close + o.open));
  return n + r + i;
}
function Mt(e, r) {
  let t = { has: e, keys: r };
  return t.reset = f.reset.bind(t), t.bold = f.bold.bind(t), t.dim = f.dim.bind(t), t.italic = f.italic.bind(t), t.underline = f.underline.bind(t), t.inverse = f.inverse.bind(t), t.hidden = f.hidden.bind(t), t.strikethrough = f.strikethrough.bind(t), t.black = f.black.bind(t), t.red = f.red.bind(t), t.green = f.green.bind(t), t.yellow = f.yellow.bind(t), t.blue = f.blue.bind(t), t.magenta = f.magenta.bind(t), t.cyan = f.cyan.bind(t), t.white = f.white.bind(t), t.gray = f.gray.bind(t), t.grey = f.grey.bind(t), t.bgBlack = f.bgBlack.bind(t), t.bgRed = f.bgRed.bind(t), t.bgGreen = f.bgGreen.bind(t), t.bgYellow = f.bgYellow.bind(t), t.bgBlue = f.bgBlue.bind(t), t.bgMagenta = f.bgMagenta.bind(t), t.bgCyan = f.bgCyan.bind(t), t.bgWhite = f.bgWhite.bind(t), t;
}
function O(e, r) {
  let t = {
    open: `\x1B[${e}m`,
    close: `\x1B[${r}m`,
    rgx: new RegExp(`\\x1b\\[${r}m`, "g")
  };
  return function(o) {
    return this !== void 0 && this.has !== void 0 ? (~this.has.indexOf(e) || (this.has.push(e), this.keys.push(t)), o === void 0 ? this : f.enabled ? Ge(this.keys, o + "") : o + "") : o === void 0 ? Mt([e], [t]) : f.enabled ? Ge([t], o + "") : o + "";
  };
}
var Jt = Object.defineProperty, zt = (e, r, t) => r in e ? Jt(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, N = (e, r, t) => (zt(e, typeof r != "symbol" ? r + "" : r, t), t);
const X = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return X.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let B = X;
N(B, "isNode", typeof process < "u" && process.versions != null && process.versions.node != null), /**
* 是否在浏览器环境
*/
N(B, "isInBrowser", typeof window < "u" && typeof document < "u"), /**
* 浏览器路径分隔符
*/
N(B, "BrowserSeparator", "/"), /**
* 是否是Electron环境
*/
N(B, "isElectron", () => typeof process < "u" && process.versions != null && process.versions.electron != null), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
N(B, "hasNodeEnv", () => X.isElectron() || X.isNode), /**
* 通用的从 url 中获取获取参数的方法，优先获取查询参数，然后获取 hash 参数与
*
* @param key - 参数
* @author terwer
* @version 0.9.0
* @since 0.0.1
*/
N(B, "getQueryParam", (e) => {
  if (!X.isInBrowser)
    return "";
  const r = window.location.href, t = r.indexOf("?");
  if (t !== -1) {
    const n = r.indexOf("#", t), i = n !== -1 ? r.substring(t + 1, n) : r.substring(t + 1), s = new URLSearchParams(i).get(e);
    if (s)
      return s;
  }
  const o = r.indexOf("#");
  if (o !== -1) {
    const n = r.substring(o + 1), i = new URLSearchParams(n).get(e);
    if (i)
      return i;
  }
  return "";
}), /**
* 替换 URL 的参数
* 思路：
* 1. 使用了 URLSearchParams 对象来解析和构建 URL 查询参数。
*
* 2. 在处理包含 hash 片段的 URL 时使用了 split 函数将 URL 分成两部分：基本 URL 和 hash 片段。
*
* 3. 然后，再次使用 split 函数将基本 URL 分成两部分：路径和查询参数。
*
* 4. 将查询参数转换为 URLSearchParams 对象，然后设置指定的参数名和值。
*
* 5. 最后，使用 toString 函数将查询参数转换为字符串，并将其与路径组合成新的基本 URL。如果 URL 包含 hash 片段，则将其添加到新的基本 URL 中。
*
* @param url - 链接地址
* @param paramName - 参数名
* @param paramValue - 参数值
*/
N(B, "replaceUrlParam", (e, r, t) => {
  t == null && (t = "");
  const o = new RegExp("\\b(" + r + "=).*?(&|#|$)");
  if (e.search(o) >= 0)
    return e.replace(o, "$1" + t + "$2");
  const [n, i] = e.split("#"), [s, c] = n.split("?"), l = new URLSearchParams(c);
  l.set(r, t);
  const u = l.toString(), a = s + (u ? "?" + u : "");
  return i ? a + "#" + i : a;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
N(B, "setUrlParameter", (e, r, t) => {
  if (e.includes(r))
    return X.replaceUrlParam(e, r, t);
  const o = e.split("#");
  let n = o[0];
  const i = o[1];
  return n.includes("?") ? n += `&${r}=${t}` : n += `?${r}=${t}`, i && (n += "#" + i), n;
}), /**
* 重新加载指定tab
*
* @param tabname - tabname
* @param t - 延迟时间
*/
N(B, "reloadTabPage", (e, r) => {
  setTimeout(function() {
    if (X.isInBrowser) {
      const t = window.location.href;
      window.location.href = X.setUrlParameter(t, "tab", e);
    }
  }, r ?? 200);
}), /**
* 刷新当前tab页面
*
* @param t - 延迟时间
*/
N(B, "reloadPage", (e) => {
  setTimeout(function() {
    X.isInBrowser && window.location.reload();
  }, e ?? 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
* @param t - 延迟时间
*/
N(B, "reloadPageWithMessageCallback", (e, r, t) => {
  r && r(e), setTimeout(function() {
    X.isInBrowser && window.location.reload();
  }, t ?? 200);
});
var $ = /* @__PURE__ */ ((e) => (e.BasePathType_Appearance = "Appearance", e.BasePathType_Data = "Data", e.BasePathType_Themes = "Themes", e.BasePathType_ZhiTheme = "ZhiTheme", e.BasePathType_None = "None", e))($ || {});
const F = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return B.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : !1;
  }
  /**
   * 思源笔记 window 对象
   */
  static siyuanWindow() {
    let e;
    return this.isInSiyuanWidget() ? e = parent.window : this.isInSiyuanNewWin() || this.isInSiyuanBrowser() || typeof window < "u" ? e = window : e = void 0, e;
  }
  // =========================
  // require end
  // =========================
  // =========================
  // import start
  // =========================
  /**
   * 引入json
   *
   * @param jsPath - js相对路径全路径
   * @param type - 类型
   */
  static async importJs(e, r) {
    let t = e;
    switch (r) {
      case $.BasePathType_Appearance:
        t = this.browserJoinPath(this.siyuanAppearanceRelativePath(), e);
        break;
      case $.BasePathType_Data:
        t = this.browserJoinPath(this.siyuanDataRelativePath(), e);
        break;
      case $.BasePathType_Themes:
        t = this.browserJoinPath(this.siyuanThemeRelativePath(), e);
        break;
      case $.BasePathType_ZhiTheme:
        t = this.browserJoinPath(this.zhiThemeRelativePath(), e);
        break;
      default:
        throw new Error("type must be provided");
    }
    const { default: o } = await import(
      /* @vite-ignore */
      t
    );
    return o;
  }
  /**
   * 引入json
   *
   * @param jsonPath - json相对路径全路径
   * @param type - 类型
   */
  // public static async importJson(jsonPath: string, type: BasePathTypeEnum) {
  //   let fullJsonPath = jsonPath
  //   switch (type) {
  //     case BasePathTypeEnum.BasePathType_Appearance:
  //       fullJsonPath = this.browserJoinPath(this.siyuanAppearanceRelativePath(), jsonPath)
  //       break
  //     case BasePathTypeEnum.BasePathType_Data:
  //       fullJsonPath = this.browserJoinPath(this.siyuanDataRelativePath(), jsonPath)
  //       break
  //     case BasePathTypeEnum.BasePathType_Themes:
  //       fullJsonPath = this.browserJoinPath(this.siyuanThemeRelativePath(), jsonPath)
  //       break
  //     case BasePathTypeEnum.BasePathType_ZhiTheme:
  //       fullJsonPath = this.browserJoinPath(this.zhiThemeRelativePath(), jsonPath)
  //       break
  //     default:
  //       throw new Error("type must be provided")
  //   }
  //
  //   const { default: data } = await import(/* @vite-ignore */ fullJsonPath, { assert: { type: "json" } })
  //   return data
  // }
  /**
   * 引入 json - 以 data 为基本路径
   *
   * @param jsonPath - 相对于 data 的相对路径
   */
  // public static async importDataJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_Data)
  // }
  /**
   * 引入 json - 以 appearance 为基本路径
   *
   * @param jsonPath - 相对于 appearance 的相对路径
   */
  // public static async importAppearanceJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_Appearance)
  // }
  /**
   * 引入 json - 以 themes 为基本路径
   *
   * @param jsonPath - 相对于 themes 的相对路径
   */
  // public static async importThemesJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_Themes)
  // }
  /**
   * 引入 zhi 主题的 json - 以 zhi 主题 的根路径为基本路径
   *
   * @param jsonPath - 相对于 zhi 主题根路径的相对路径
   */
  // public static async importZhiThemeJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_ZhiTheme)
  // }
  /**
   * 引入 zhi 主题的 js - 以 zhi 主题 的根路径为基本路径
   *
   * @param jsPath - 相对于 zhi 主题根路径的相对路径
   */
  static async importZhiThemeJs(e) {
    return await this.importJs(e, $.BasePathType_ZhiTheme);
  }
  // =========================
  // import start
  // =========================
  /**
   * 路径拼接
   *
   * @param paths - 路径数组
   */
  static joinPath(...e) {
    if (B.hasNodeEnv()) {
      const r = this.requireLib("path");
      if (r)
        return r.join(...e);
    }
    return this.browserJoinPath(...e);
  }
  static browserJoinPath(...e) {
    return e.join(B.BrowserSeparator);
  }
  /**
   * 思源笔记 conf 目录
   */
  static siyuanConfPath() {
    const e = this.siyuanWindow();
    if (!e)
      throw new Error("Not in siyuan env");
    return e.siyuan.config.system.confDir;
  }
  /**
   * 思源笔记 data 目录
   */
  static siyuanDataPath() {
    const e = this.siyuanWindow();
    if (!e)
      throw new Error("Not in siyuan env");
    return e.siyuan.config.system.dataDir;
  }
  /**
   * 思源笔记 data 目录-相对路径
   */
  static siyuanDataRelativePath() {
    if (!this.siyuanWindow())
      throw new Error("Not in siyuan env");
    return "";
  }
  /**
   * 思源笔记 appearance 目录
   */
  static siyuanAppearancePath() {
    return this.joinPath(this.siyuanConfPath(), "appearance");
  }
  /**
   * 思源笔记 appearance 目录-相对路径
   */
  static siyuanAppearanceRelativePath() {
    if (!this.siyuanWindow())
      throw new Error("Not in siyuan env");
    return this.browserJoinPath("", "appearance");
  }
  /**
   * 思源笔记 themes 目录-绝对路径
   *
   * 注意: 如果是非 electron 和 Node 环境，这里返回的是浏览器的路径，不是物理路径
   * 如果使用物理路径，请调用 siyuanAppearancePath 或者 siyuanDataPath
   *
   * @author terwer
   * @since 0.1.0
   */
  static siyuanThemePath() {
    if (B.hasNodeEnv())
      return this.joinPath(this.siyuanAppearancePath(), "themes");
    {
      const e = this.siyuanWindow();
      if (!e)
        throw new Error("Not in siyuan env");
      return this.joinPath(e.location.origin, "appearance", "themes");
    }
  }
  /**
   * 思源笔记 themes 目录-相对路径
   */
  static siyuanThemeRelativePath() {
    if (!this.siyuanWindow())
      throw new Error("Not in siyuan env");
    return this.browserJoinPath("", "appearance", "themes");
  }
  /**
   * zhi 主题目录 - 绝对路径
   */
  static zhiThemePath() {
    return this.joinPath(this.siyuanThemePath(), "zhi");
  }
  /**
   * zhi 主题目录 - 相对路径
   */
  static zhiThemeRelativePath() {
    return this.browserJoinPath(this.siyuanThemeRelativePath(), "zhi");
  }
};
let ce = F;
N(ce, "isInSiyuanWidget", () => B.isInBrowser ? typeof window.parent.process < "u" && window.parent.process.versions != null && window.parent.process.versions.electron != null : !1), /**
* 思源笔记新窗口
*
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
N(ce, "isInSiyuanNewWin", () => typeof window < "u" && window.process && window.process.type === "renderer"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
N(ce, "requireLib", (e, r = !0, t = $.BasePathType_None) => {
  if (!B.hasNodeEnv())
    throw new Error("require ony works on node env");
  let o = e;
  if (!r)
    switch (t) {
      case $.BasePathType_Appearance:
        o = F.joinPath(F.siyuanAppearancePath(), e);
        break;
      case $.BasePathType_Data:
        o = F.joinPath(F.siyuanDataPath(), e);
        break;
      case $.BasePathType_Themes:
        o = F.joinPath(F.siyuanAppearancePath(), "themes", e);
        break;
      case $.BasePathType_ZhiTheme:
        o = F.joinPath(F.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const n = F.siyuanWindow();
  if (!n)
    return require(o);
  if (typeof n.require < "u")
    return n.require(o);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
N(ce, "requireAppearanceLib", (e) => F.requireLib(e, !1, $.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
N(ce, "requireDataLib", (e) => F.requireLib(e, !1, $.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
N(ce, "requireThemesLib", (e) => F.requireLib(e, !1, $.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
N(ce, "requireZhiThemeLib", (e) => F.requireLib(e, !1, $.BasePathType_ZhiTheme));
const Y = {
  white: (e) => B.isElectron() ? z.whiteBright(e) : f.white(e),
  gray: (e) => B.isElectron() ? z.gray(e) : f.gray(e),
  blue: (e) => B.isElectron() ? z.blue(e) : f.blue(e),
  green: (e) => B.isElectron() ? z.green(e) : f.green(e),
  yellow: (e) => B.isElectron() ? z.yellow(e) : f.yellow(e),
  red: (e) => B.isElectron() ? z.red(e) : f.red(e),
  bgWhite: (e) => B.isElectron() ? z.bgWhiteBright(e) : f.bgWhite(e),
  bgGrey: (e) => B.isElectron() ? z.bgCyanBright(e) : f.bgCyan(e),
  bgBlue: (e) => B.isElectron() ? z.bgBlueBright(e) : f.bgBlue(e),
  bgGreen: (e) => B.isElectron() ? z.bgGreenBright(e) : f.bgGreen(e),
  bgYellow: (e) => B.isElectron() ? z.bgYellowBright(e) : f.bgYellow(e),
  bgRed: (e) => B.isElectron() ? z.bgRedBright(e) : f.bgRed(e)
};
class Yt {
  constructor(r, t, o) {
    ge(this, "consoleLogger", "console"), ge(this, "stackSize", 1), ge(this, "getLogger", (s) => {
      let c;
      if (s)
        c = s;
      else {
        const l = this.getCallStack(), u = [], a = [];
        for (let y = 0; y < l.length; y++) {
          const m = l[y], E = m.getFileName() ?? "none";
          if (y > this.stackSize - 1)
            break;
          const Z = E + "-" + m.getLineNumber() + ":" + m.getColumnNumber();
          u.push(Z);
        }
        a.length > 0 && (c = u.join(" -> "));
      }
      return (!c || c.trim().length === 0) && (c = this.consoleLogger), ve.getLogger(c);
    }), this.stackSize = 1;
    let n;
    r ? n = r : n = Le.getEnvLevel(o), n = n ?? U.LOG_LEVEL_INFO, ve.setLevel(n);
    const i = (s, c, l, u) => {
      const a = [], y = t ?? Le.getEnvLogger(o) ?? "zhi";
      return a.push(Y.gray("[") + u(y) + Y.gray("]")), a.push(Y.gray("[") + Y.gray(l.toString()) + Y.gray("]")), a.push(u(s.toUpperCase().toString())), a.push(u(c)), a.push(Y.gray(":")), a;
    };
    $e.reg(ve), $e.apply(ve, {
      format(s, c, l) {
        let u = [];
        const a = c ?? "";
        switch (s) {
          case U.LOG_LEVEL_TRACE:
            u = i(s, a, l, Y.gray);
            break;
          case U.LOG_LEVEL_DEBUG:
            u = i(s, a, l, Y.blue);
            break;
          case U.LOG_LEVEL_INFO:
            u = i(s, a, l, Y.green);
            break;
          case U.LOG_LEVEL_WARN:
            u = i(s, a, l, Y.yellow);
            break;
          case U.LOG_LEVEL_ERROR:
            u = i(s, a, l, Y.red);
            break;
          default:
            u = i(U.LOG_LEVEL_INFO, a, l, Y.green);
            break;
        }
        return u.join(" ");
      }
    });
  }
  /**
   * 设置输出栈的深度，默认1
   *
   * @param stackSize - 栈的深度
   */
  setStackSize(r) {
    this.stackSize = r ?? 1;
  }
  /**
   * 获取调用堆栈，若未获取到直接返回空数组
   *
   * @author terwer
   * @since 1.6.0
   */
  getCallStack() {
    let r;
    try {
      r = jt();
    } catch {
      r = [];
    }
    return r;
  }
}
class Zt {
  /**
   * 默认日志级别
   *
   * @param level - 可选，未设置默认INFO
   * @param sign - 可选前缀，默认zhi
   * @param env - 可选环境变量实例
   */
  constructor(r, t, o) {
    ge(this, "logger"), this.logger = new Yt(r, t, o);
  }
  /**
   * 获取日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   * @protected
   */
  getLogger(r, t) {
    return this.logger.setStackSize(t), this.logger.getLogger(r);
  }
}
class Fe extends Zt {
  constructor(r, t, o) {
    super(r, t, o);
  }
  /**
   * 获取默认的日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   */
  getLogger(r, t) {
    return super.getLogger(r, t);
  }
}
class Ne {
  /**
   * 默认日志记录器
   *
   * @param stackSize - 栈的深度
   * @param env - 环境变量实例
   */
  static defaultLogger(r, t) {
    return Ne.customLogFactory(void 0, void 0, r).getLogger(void 0, t);
  }
  /**
   * 自定义日志工厂
   *
   * @param level - 级别
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customLogFactory(r, t, o) {
    return new Fe(r, t, o);
  }
  /**
   * 自定义日志工厂，自定义前缀
   *
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customSignLogFactory(r, t) {
    return new Fe(void 0, r, t);
  }
}
var Ht = Object.defineProperty, Kt = (e, r, t) => r in e ? Ht(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, D = (e, r, t) => (Kt(e, typeof r != "symbol" ? r + "" : r, t), t);
const Q = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return Q.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let x = Q;
D(x, "isNode", typeof process < "u" && process.versions != null && process.versions.node != null), /**
* 是否在浏览器环境
*/
D(x, "isInBrowser", typeof window < "u" && typeof document < "u"), /**
* 浏览器路径分隔符
*/
D(x, "BrowserSeparator", "/"), /**
* 是否是Electron环境
*/
D(x, "isElectron", () => typeof process < "u" && process.versions != null && process.versions.electron != null), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
D(x, "hasNodeEnv", () => Q.isElectron() || Q.isNode), /**
* 通用的从 url 中获取获取参数的方法，优先获取查询参数，然后获取 hash 参数与
*
* @param key - 参数
* @author terwer
* @version 0.9.0
* @since 0.0.1
*/
D(x, "getQueryParam", (e) => {
  if (!Q.isInBrowser)
    return "";
  const r = window.location.href, t = r.indexOf("?");
  if (t !== -1) {
    const n = r.indexOf("#", t), i = n !== -1 ? r.substring(t + 1, n) : r.substring(t + 1), s = new URLSearchParams(i).get(e);
    if (s)
      return s;
  }
  const o = r.indexOf("#");
  if (o !== -1) {
    const n = r.substring(o + 1), i = new URLSearchParams(n).get(e);
    if (i)
      return i;
  }
  return "";
}), /**
* 替换 URL 的参数
* 思路：
* 1. 使用了 URLSearchParams 对象来解析和构建 URL 查询参数。
*
* 2. 在处理包含 hash 片段的 URL 时使用了 split 函数将 URL 分成两部分：基本 URL 和 hash 片段。
*
* 3. 然后，再次使用 split 函数将基本 URL 分成两部分：路径和查询参数。
*
* 4. 将查询参数转换为 URLSearchParams 对象，然后设置指定的参数名和值。
*
* 5. 最后，使用 toString 函数将查询参数转换为字符串，并将其与路径组合成新的基本 URL。如果 URL 包含 hash 片段，则将其添加到新的基本 URL 中。
*
* @param url - 链接地址
* @param paramName - 参数名
* @param paramValue - 参数值
*/
D(x, "replaceUrlParam", (e, r, t) => {
  t == null && (t = "");
  const o = new RegExp("\\b(" + r + "=).*?(&|#|$)");
  if (e.search(o) >= 0)
    return e.replace(o, "$1" + t + "$2");
  const [n, i] = e.split("#"), [s, c] = n.split("?"), l = new URLSearchParams(c);
  l.set(r, t);
  const u = l.toString(), a = s + (u ? "?" + u : "");
  return i ? a + "#" + i : a;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
D(x, "setUrlParameter", (e, r, t) => {
  if (e.includes(r))
    return Q.replaceUrlParam(e, r, t);
  const o = e.split("#");
  let n = o[0];
  const i = o[1];
  return n.includes("?") ? n += `&${r}=${t}` : n += `?${r}=${t}`, i && (n += "#" + i), n;
}), /**
* 重新加载指定tab
*
* @param tabname - tabname
* @param t - 延迟时间
*/
D(x, "reloadTabPage", (e, r) => {
  setTimeout(function() {
    if (Q.isInBrowser) {
      const t = window.location.href;
      window.location.href = Q.setUrlParameter(t, "tab", e);
    }
  }, r ?? 200);
}), /**
* 刷新当前tab页面
*
* @param t - 延迟时间
*/
D(x, "reloadPage", (e) => {
  setTimeout(function() {
    Q.isInBrowser && window.location.reload();
  }, e ?? 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
* @param t - 延迟时间
*/
D(x, "reloadPageWithMessageCallback", (e, r, t) => {
  r && r(e), setTimeout(function() {
    Q.isInBrowser && window.location.reload();
  }, t ?? 200);
});
var W = /* @__PURE__ */ ((e) => (e.BasePathType_Appearance = "Appearance", e.BasePathType_Data = "Data", e.BasePathType_Themes = "Themes", e.BasePathType_ZhiTheme = "ZhiTheme", e.BasePathType_None = "None", e))(W || {});
const q = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return x.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : !1;
  }
  /**
   * 思源笔记 window 对象
   */
  static siyuanWindow() {
    let e;
    return this.isInSiyuanWidget() ? e = parent.window : this.isInSiyuanNewWin() || this.isInSiyuanBrowser() || typeof window < "u" ? e = window : e = void 0, e;
  }
  // =========================
  // require end
  // =========================
  // =========================
  // import start
  // =========================
  /**
   * 引入json
   *
   * @param jsPath - js相对路径全路径
   * @param type - 类型
   */
  static async importJs(e, r) {
    let t = e;
    switch (r) {
      case W.BasePathType_Appearance:
        t = this.browserJoinPath(this.siyuanAppearanceRelativePath(), e);
        break;
      case W.BasePathType_Data:
        t = this.browserJoinPath(this.siyuanDataRelativePath(), e);
        break;
      case W.BasePathType_Themes:
        t = this.browserJoinPath(this.siyuanThemeRelativePath(), e);
        break;
      case W.BasePathType_ZhiTheme:
        t = this.browserJoinPath(this.zhiThemeRelativePath(), e);
        break;
      default:
        throw new Error("type must be provided");
    }
    const { default: o } = await import(
      /* @vite-ignore */
      t
    );
    return o;
  }
  /**
   * 引入json
   *
   * @param jsonPath - json相对路径全路径
   * @param type - 类型
   */
  // public static async importJson(jsonPath: string, type: BasePathTypeEnum) {
  //   let fullJsonPath = jsonPath
  //   switch (type) {
  //     case BasePathTypeEnum.BasePathType_Appearance:
  //       fullJsonPath = this.browserJoinPath(this.siyuanAppearanceRelativePath(), jsonPath)
  //       break
  //     case BasePathTypeEnum.BasePathType_Data:
  //       fullJsonPath = this.browserJoinPath(this.siyuanDataRelativePath(), jsonPath)
  //       break
  //     case BasePathTypeEnum.BasePathType_Themes:
  //       fullJsonPath = this.browserJoinPath(this.siyuanThemeRelativePath(), jsonPath)
  //       break
  //     case BasePathTypeEnum.BasePathType_ZhiTheme:
  //       fullJsonPath = this.browserJoinPath(this.zhiThemeRelativePath(), jsonPath)
  //       break
  //     default:
  //       throw new Error("type must be provided")
  //   }
  //
  //   const { default: data } = await import(/* @vite-ignore */ fullJsonPath, { assert: { type: "json" } })
  //   return data
  // }
  /**
   * 引入 json - 以 data 为基本路径
   *
   * @param jsonPath - 相对于 data 的相对路径
   */
  // public static async importDataJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_Data)
  // }
  /**
   * 引入 json - 以 appearance 为基本路径
   *
   * @param jsonPath - 相对于 appearance 的相对路径
   */
  // public static async importAppearanceJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_Appearance)
  // }
  /**
   * 引入 json - 以 themes 为基本路径
   *
   * @param jsonPath - 相对于 themes 的相对路径
   */
  // public static async importThemesJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_Themes)
  // }
  /**
   * 引入 zhi 主题的 json - 以 zhi 主题 的根路径为基本路径
   *
   * @param jsonPath - 相对于 zhi 主题根路径的相对路径
   */
  // public static async importZhiThemeJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_ZhiTheme)
  // }
  /**
   * 引入 zhi 主题的 js - 以 zhi 主题 的根路径为基本路径
   *
   * @param jsPath - 相对于 zhi 主题根路径的相对路径
   */
  static async importZhiThemeJs(e) {
    return await this.importJs(e, W.BasePathType_ZhiTheme);
  }
  // =========================
  // import start
  // =========================
  /**
   * 路径拼接
   *
   * @param paths - 路径数组
   */
  static joinPath(...e) {
    if (x.hasNodeEnv()) {
      const r = this.requireLib("path");
      if (r)
        return r.join(...e);
    }
    return this.browserJoinPath(...e);
  }
  static browserJoinPath(...e) {
    return e.join(x.BrowserSeparator);
  }
  /**
   * 思源笔记 conf 目录
   */
  static siyuanConfPath() {
    const e = this.siyuanWindow();
    if (!e)
      throw new Error("Not in siyuan env");
    return e.siyuan.config.system.confDir;
  }
  /**
   * 思源笔记 data 目录
   */
  static siyuanDataPath() {
    const e = this.siyuanWindow();
    if (!e)
      throw new Error("Not in siyuan env");
    return e.siyuan.config.system.dataDir;
  }
  /**
   * 思源笔记 data 目录-相对路径
   */
  static siyuanDataRelativePath() {
    if (!this.siyuanWindow())
      throw new Error("Not in siyuan env");
    return "";
  }
  /**
   * 思源笔记 appearance 目录
   */
  static siyuanAppearancePath() {
    return this.joinPath(this.siyuanConfPath(), "appearance");
  }
  /**
   * 思源笔记 appearance 目录-相对路径
   */
  static siyuanAppearanceRelativePath() {
    if (!this.siyuanWindow())
      throw new Error("Not in siyuan env");
    return this.browserJoinPath("", "appearance");
  }
  /**
   * 思源笔记 themes 目录-绝对路径
   *
   * 注意: 如果是非 electron 和 Node 环境，这里返回的是浏览器的路径，不是物理路径
   * 如果使用物理路径，请调用 siyuanAppearancePath 或者 siyuanDataPath
   *
   * @author terwer
   * @since 0.1.0
   */
  static siyuanThemePath() {
    if (x.hasNodeEnv())
      return this.joinPath(this.siyuanAppearancePath(), "themes");
    {
      const e = this.siyuanWindow();
      if (!e)
        throw new Error("Not in siyuan env");
      return this.joinPath(e.location.origin, "appearance", "themes");
    }
  }
  /**
   * 思源笔记 themes 目录-相对路径
   */
  static siyuanThemeRelativePath() {
    if (!this.siyuanWindow())
      throw new Error("Not in siyuan env");
    return this.browserJoinPath("", "appearance", "themes");
  }
  /**
   * zhi 主题目录 - 绝对路径
   */
  static zhiThemePath() {
    return this.joinPath(this.siyuanThemePath(), "zhi");
  }
  /**
   * zhi 主题目录 - 相对路径
   */
  static zhiThemeRelativePath() {
    return this.browserJoinPath(this.siyuanThemeRelativePath(), "zhi");
  }
};
let ne = q;
D(ne, "isInSiyuanWidget", () => x.isInBrowser ? typeof window.parent.process < "u" && window.parent.process.versions != null && window.parent.process.versions.electron != null : !1), /**
* 思源笔记新窗口
*
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
D(ne, "isInSiyuanNewWin", () => typeof window < "u" && window.process && window.process.type === "renderer"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
D(ne, "requireLib", (e, r = !0, t = W.BasePathType_None) => {
  if (!x.hasNodeEnv())
    throw new Error("require ony works on node env");
  let o = e;
  if (!r)
    switch (t) {
      case W.BasePathType_Appearance:
        o = q.joinPath(q.siyuanAppearancePath(), e);
        break;
      case W.BasePathType_Data:
        o = q.joinPath(q.siyuanDataPath(), e);
        break;
      case W.BasePathType_Themes:
        o = q.joinPath(q.siyuanAppearancePath(), "themes", e);
        break;
      case W.BasePathType_ZhiTheme:
        o = q.joinPath(q.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const n = q.siyuanWindow();
  if (!n)
    return require(o);
  if (typeof n.require < "u")
    return n.require(o);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
D(ne, "requireAppearanceLib", (e) => q.requireLib(e, !1, W.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
D(ne, "requireDataLib", (e) => q.requireLib(e, !1, W.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
D(ne, "requireThemesLib", (e) => q.requireLib(e, !1, W.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
D(ne, "requireZhiThemeLib", (e) => q.requireLib(e, !1, W.BasePathType_ZhiTheme));
const Xt = "c6f0e84b0df40a0c5b9de2b5716fc33f93291f1a";
class sr {
  constructor() {
    fe(this, "repoHash", Xt);
    fe(this, "logger");
    fe(this, "publishHook");
    fe(this, "siyuanDevice");
    const r = new It({ BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 });
    this.logger = Ne.customLogFactory(U.LOG_LEVEL_INFO, "publish-bridge", r).getLogger(), this.siyuanDevice = ne, this.publishHook = new Dt();
  }
  async init() {
    this.logger.info("Initiating sy-post-publisher from publish bridge ...");
    try {
      const t = `${this.siyuanDevice.siyuanDataPath()}/widgets/sy-post-publisher`, o = this.siyuanDevice.requireLib("fs");
      this.logger.info("Widget sy-post-publisher folder=>", t), o.existsSync(t) || (this.logger.info("Widget sy-post-publisher not exist, downloading..."), await this.doDownload(), this.logger.info("Widget sy-post-publisher downloaded")), this.publishHook.doInit({
        isInitLocalStorage: !0,
        // 桥接版禁用菜单插槽
        isInitSlot: !1,
        isInitThemeAdaptor: !0,
        isInitPublishHelper: !0,
        isInitPicgoExtension: !0,
        isInitCmder: !0
      });
    } catch (r) {
      this.logger.error("Failed to init sy-post-publisher，it may not work in some case.Error=>", r);
    }
  }
  async doDownload() {
    this.logger.warn("Downloading sy-post-publisher from bazaar...");
    const r = "/api/bazaar/installBazaarWidget", t = {
      repoURL: "https://github.com/terwer/sy-post-publisher",
      packageName: "sy-post-publisher",
      repoHash: this.repoHash,
      mode: 0
    }, o = {
      body: JSON.stringify(t),
      method: "POST"
    };
    if ((await (await fetch(r, o)).json()).code == 0)
      this.logger.info("Download sy-post-publisher from bazaar success");
    else
      throw new Error("Download sy-post-publisher error, this plugin will not work!");
  }
}
export {
  sr as default
};
