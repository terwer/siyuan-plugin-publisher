var at = Object.defineProperty;
var st = (e, r, t) => r in e ? at(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t;
var be = (e, r, t) => (st(e, typeof r != "symbol" ? r + "" : r, t), t);
var lt = Object.defineProperty, ct = (e, r, t) => r in e ? lt(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, fe = (e, r, t) => (ct(e, typeof r != "symbol" ? r + "" : r, t), t), ut = Object.defineProperty, ht = (e, r, t) => r in e ? ut(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, N = (e, r, t) => (ht(e, typeof r != "symbol" ? r + "" : r, t), t);
const Y = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return Y.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let R = Y;
N(R, "isNode", typeof process < "u"), /**
* 是否在浏览器环境
*/
N(R, "isInBrowser", typeof window < "u"), /**
* 浏览器路径分隔符
*/
N(R, "BrowserSeperator", "/"), /**
* 是否是Electron环境
*/
N(R, "isElectron", () => !Y.isInBrowser || !window.navigator || !window.navigator.userAgent ? !1 : /Electron/.test(window.navigator.userAgent)), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
N(R, "hasNodeEnv", () => Y.isElectron() || Y.isNode), /**
* 获取url参数
*
* @param sParam - 参数
*/
N(R, "getQueryString", (e) => {
  if (!Y.isInBrowser)
    return "";
  const r = window.location.search.substring(1).split("&");
  for (let t = 0; t < r.length; t++) {
    const i = r[t].split("=");
    if (i[0] === e)
      return i[1];
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
N(R, "replaceUrlParam", (e, r, t) => {
  t == null && (t = "");
  const i = new RegExp("\\b(" + r + "=).*?(&|#|$)");
  if (e.search(i) >= 0)
    return e.replace(i, "$1" + t + "$2");
  const [n, o] = e.split("#"), [s, c] = n.split("?"), l = new URLSearchParams(c);
  l.set(r, t);
  const u = l.toString(), a = s + (u ? "?" + u : "");
  return o ? a + "#" + o : a;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
N(R, "setUrlParameter", (e, r, t) => {
  if (e.includes(r))
    return Y.replaceUrlParam(e, r, t);
  const i = e.split("#");
  let n = i[0];
  const o = i[1];
  return n.includes("?") ? n += `&${r}=${t}` : n += `?${r}=${t}`, o && (n += "#" + o), n;
}), /**
* 重新加载指定tab
*
* @param tabname - tabname
* @param t - 延迟时间
*/
N(R, "reloadTabPage", (e, r = 200) => {
  setTimeout(function() {
    if (Y.isInBrowser) {
      const t = window.location.href;
      window.location.href = Y.setUrlParameter(t, "tab", e);
    }
  }, r);
}), /**
* 刷新当前tab页面
*/
N(R, "reloadPage", () => {
  setTimeout(function() {
    Y.isInBrowser && window.location.reload();
  }, 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
*/
N(R, "reloadPageWithMessageCallback", (e, r) => {
  r && r(e), setTimeout(function() {
    Y.isInBrowser && window.location.reload();
  }, 200);
});
var A = /* @__PURE__ */ ((e) => (e.BasePathType_Appearance = "Appearance", e.BasePathType_Data = "Data", e.BasePathType_Themes = "Themes", e.BasePathType_ZhiTheme = "ZhiTheme", e.BasePathType_None = "None", e))(A || {});
const j = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return R.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : !1;
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
    let i = r;
    switch (t) {
      case A.BasePathType_Appearance:
        i = this.browserJoinPath(this.siyuanAppearanceRelativePath(), r);
        break;
      case A.BasePathType_Data:
        i = this.browserJoinPath(this.siyuanDataRelativePath(), r);
        break;
      case A.BasePathType_Themes:
        i = this.browserJoinPath(this.siyuanThemeRelativePath(), r);
        break;
      case A.BasePathType_ZhiTheme:
        i = this.browserJoinPath(this.zhiThemeRelativePath(), r);
        break;
      default:
        throw new Error("type must be provided");
    }
    const { default: n } = await import(
      /* @vite-ignore */
      i
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
    if (R.hasNodeEnv()) {
      const t = this.requireLib("path");
      if (t)
        return t.join(...r);
    }
    return this.browserJoinPath(...r);
  }
  static browserJoinPath(...r) {
    return r.join(R.BrowserSeperator);
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
    if (R.hasNodeEnv())
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
N(re, "isInSiyuanWidget", () => R.isInBrowser ? window.frameElement != null && window.frameElement.parentElement != null && window.frameElement.parentElement.parentElement != null && window.frameElement.parentElement.parentElement.getAttribute("data-node-id") !== "" : !1), /**
* 思源笔记新窗口
*
* @deprecated window.terwer 判断方式已废弃，建议以后打开新窗口注入 window.siyuanNewWin ，这样语义会更容易理解
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
N(re, "isInSiyuanNewWin", () => !R.isInBrowser || !R.isElectron() ? !1 : typeof window.terwer < "u" || typeof window.siyuanNewWin < "u"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
N(re, "requireLib", (e, r = !0, t = A.BasePathType_None) => {
  if (!R.hasNodeEnv())
    throw new Error("require ony works on node env");
  let i = e;
  if (!r)
    switch (t) {
      case A.BasePathType_Appearance:
        i = j.joinPath(j.siyuanAppearancePath(), e);
        break;
      case A.BasePathType_Data:
        i = j.joinPath(j.siyuanDataPath(), e);
        break;
      case A.BasePathType_Themes:
        i = j.joinPath(j.siyuanAppearancePath(), "themes", e);
        break;
      case A.BasePathType_ZhiTheme:
        i = j.joinPath(j.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const n = j.siyuanWindow();
  if (!n)
    return require(i);
  if (typeof n.require < "u")
    return n.require(i);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
N(re, "requireAppearanceLib", (e) => j.requireLib(e, !1, A.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
N(re, "requireDataLib", (e) => j.requireLib(e, !1, A.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
N(re, "requireThemesLib", (e) => j.requireLib(e, !1, A.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
N(re, "requireZhiThemeLib", (e) => j.requireLib(e, !1, A.BasePathType_ZhiTheme));
var gt = Object.defineProperty, pt = (e, r, t) => r in e ? gt(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, ue = (e, r, t) => (pt(e, typeof r != "symbol" ? r + "" : r, t), t);
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
let yt = class {
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
    const i = this.getStringEnv(r);
    return i.trim().length == 0 ? t : i;
  }
};
var dt = Object.defineProperty, wt = (e, r, t) => r in e ? dt(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, ge = (e, r, t) => (wt(e, typeof r != "symbol" ? r + "" : r, t), t);
class ve {
}
ge(ve, "LOG_LEVEL_KEY", "VITE_LOG_LEVEL"), ge(ve, "LOG_PREFIX_KEY", "VITE_LOG_PREFIX");
var X = /* @__PURE__ */ ((e) => (e.LOG_LEVEL_TRACE = "TRACE", e.LOG_LEVEL_DEBUG = "DEBUG", e.LOG_LEVEL_INFO = "INFO", e.LOG_LEVEL_WARN = "WARN", e.LOG_LEVEL_ERROR = "ERROR", e))(X || {}), Fe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function _e(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ve = { exports: {} };
(function(e) {
  (function(r, t) {
    e.exports ? e.exports = t() : r.log = t();
  })(Fe, function() {
    var r = function() {
    }, t = "undefined", i = typeof window !== t && typeof window.navigator !== t && /Trident\/|MSIE /.test(window.navigator.userAgent), n = [
      "trace",
      "debug",
      "info",
      "warn",
      "error"
    ];
    function o(h, f) {
      var E = h[f];
      if (typeof E.bind == "function")
        return E.bind(h);
      try {
        return Function.prototype.bind.call(E, h);
      } catch {
        return function() {
          return Function.prototype.apply.apply(E, [h, arguments]);
        };
      }
    }
    function s() {
      console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
    }
    function c(h) {
      return h === "debug" && (h = "log"), typeof console === t ? !1 : h === "trace" && i ? s : console[h] !== void 0 ? o(console, h) : console.log !== void 0 ? o(console, "log") : r;
    }
    function l(h, f) {
      for (var E = 0; E < n.length; E++) {
        var p = n[E];
        this[p] = E < h ? r : this.methodFactory(p, h, f);
      }
      this.log = this.debug;
    }
    function u(h, f, E) {
      return function() {
        typeof console !== t && (l.call(this, f, E), this[h].apply(this, arguments));
      };
    }
    function a(h, f, E) {
      return c(h) || u.apply(this, arguments);
    }
    function y(h, f, E) {
      var p = this, ee;
      f = f ?? "WARN";
      var d = "loglevel";
      typeof h == "string" ? d += ":" + h : typeof h == "symbol" && (d = void 0);
      function ae(g) {
        var P = (n[g] || "silent").toUpperCase();
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
        var g;
        if (!(typeof window === t || !d)) {
          try {
            g = window.localStorage[d];
          } catch {
          }
          if (typeof g === t)
            try {
              var P = window.document.cookie, x = P.indexOf(
                encodeURIComponent(d) + "="
              );
              x !== -1 && (g = /^([^;]+)/.exec(P.slice(x))[1]);
            } catch {
            }
          return p.levels[g] === void 0 && (g = void 0), g;
        }
      }
      function se() {
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
      p.name = h, p.levels = {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        SILENT: 5
      }, p.methodFactory = E || a, p.getLevel = function() {
        return ee;
      }, p.setLevel = function(g, P) {
        if (typeof g == "string" && p.levels[g.toUpperCase()] !== void 0 && (g = p.levels[g.toUpperCase()]), typeof g == "number" && g >= 0 && g <= p.levels.SILENT) {
          if (ee = g, P !== !1 && ae(g), l.call(p, g, h), typeof console === t && g < p.levels.SILENT)
            return "No console available for logging";
        } else
          throw "log.setLevel() called with invalid level: " + g;
      }, p.setDefaultLevel = function(g) {
        f = g, te() || p.setLevel(g, !1);
      }, p.resetLevel = function() {
        p.setLevel(f, !1), se();
      }, p.enableAll = function(g) {
        p.setLevel(p.levels.TRACE, g);
      }, p.disableAll = function(g) {
        p.setLevel(p.levels.SILENT, g);
      };
      var B = te();
      B == null && (B = f), p.setLevel(B, !1);
    }
    var m = new y(), v = {};
    m.getLogger = function(h) {
      if (typeof h != "symbol" && typeof h != "string" || h === "")
        throw new TypeError("You must supply a name when creating a logger.");
      var f = v[h];
      return f || (f = v[h] = new y(
        h,
        m.getLevel(),
        m.methodFactory
      )), f;
    };
    var z = typeof window !== t ? window.log : void 0;
    return m.noConflict = function() {
      return typeof window !== t && window.log === m && (window.log = z), m;
    }, m.getLoggers = function() {
      return v;
    }, m.default = m, m;
  });
})(Ve);
var bt = Ve.exports;
const me = /* @__PURE__ */ _e(bt);
var Ue = { exports: {} };
(function(e) {
  (function(r, t) {
    e.exports ? e.exports = t() : r.prefix = t(r);
  })(Fe, function(r) {
    var t = function(a) {
      for (var y = 1, m = arguments.length, v; y < m; y++)
        for (v in arguments[y])
          Object.prototype.hasOwnProperty.call(arguments[y], v) && (a[v] = arguments[y][v]);
      return a;
    }, i = {
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
    }, n, o = {}, s = function(a) {
      if (!a || !a.getLogger)
        throw new TypeError("Argument is not a root logger");
      n = a;
    }, c = function(a, y) {
      if (!a || !a.setLevel)
        throw new TypeError("Argument is not a logger");
      var m = a.methodFactory, v = a.name || "", z = o[v] || o[""] || i;
      function h(f, E, p) {
        var ee = m(f, E, p), d = o[p] || o[""], ae = d.template.indexOf("%t") !== -1, te = d.template.indexOf("%l") !== -1, se = d.template.indexOf("%n") !== -1;
        return function() {
          for (var B = "", g = arguments.length, P = Array(g), x = 0; x < g; x++)
            P[x] = arguments[x];
          if (v || !o[p]) {
            var ye = d.timestampFormatter(/* @__PURE__ */ new Date()), de = d.levelFormatter(f), we = d.nameFormatter(p);
            d.format ? B += d.format(de, we, ye) : (B += d.template, ae && (B = B.replace(/%t/, ye)), te && (B = B.replace(/%l/, de)), se && (B = B.replace(/%n/, we))), P.length && typeof P[0] == "string" ? P[0] = B + " " + P[0] : P.unshift(B);
          }
          ee.apply(void 0, P);
        };
      }
      return o[v] || (a.methodFactory = h), y = y || {}, y.template && (y.format = void 0), o[v] = t({}, z, y), a.setLevel(a.getLevel()), n || a.warn(
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
var ft = Ue.exports;
const De = /* @__PURE__ */ _e(ft);
function mt() {
  const e = Error.prepareStackTrace;
  Error.prepareStackTrace = (t, i) => i;
  const r = new Error().stack.slice(1);
  return Error.prepareStackTrace = e, r;
}
let Ie = class Me {
  /**
   * 解析日志级别为枚举
   *
   * @param enumObj - 枚举对象
   * @param value - 配置的值
   */
  static stringToEnumValue(r, t) {
    return r[Object.keys(r).filter((i) => r[i].toString() === t)[0]];
  }
  /**
   * 获取配置的日志级别
   */
  static getEnvLevel(r) {
    if (!r)
      return;
    const t = r.getEnvOrDefault(ve.LOG_LEVEL_KEY, X.LOG_LEVEL_INFO), i = Me.stringToEnumValue(X, t.toUpperCase());
    return i || console.warn(
      "[zhi-log] LOG_LEVEL is invalid in you .env file.It must be either debug, info, warn or error, fallback to default info level"
    ), i;
  }
  /**
   * 获取默认日志
   */
  static getEnvLogger(r) {
    return r ? r.getEnv(ve.LOG_PREFIX_KEY) : void 0;
  }
};
var Oe = { exports: {} }, Se = { exports: {} }, xe;
function Et() {
  return xe || (xe = 1, function(e) {
    const r = typeof process < "u" && process.env.TERM_PROGRAM === "Hyper", t = typeof process < "u" && process.platform === "win32", i = typeof process < "u" && process.platform === "linux", n = {
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
    }, o = Object.assign({}, n, {
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
      pointer: i ? "▸" : "❯",
      pointerSmall: i ? "‣" : "›",
      radioOff: "◯",
      radioOn: "◉",
      warning: "⚠"
    });
    e.exports = t && !r ? o : s, Reflect.defineProperty(e.exports, "common", { enumerable: !1, value: n }), Reflect.defineProperty(e.exports, "windows", { enumerable: !1, value: o }), Reflect.defineProperty(e.exports, "other", { enumerable: !1, value: s });
  }(Se)), Se.exports;
}
const vt = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Pt = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g, Lt = () => typeof process < "u" ? process.env.FORCE_COLOR !== "0" : !1, Je = () => {
  const e = {
    enabled: Lt(),
    visible: !0,
    styles: {},
    keys: {}
  }, r = (o) => {
    let s = o.open = `\x1B[${o.codes[0]}m`, c = o.close = `\x1B[${o.codes[1]}m`, l = o.regex = new RegExp(`\\u001b\\[${o.codes[1]}m`, "g");
    return o.wrap = (u, a) => {
      u.includes(c) && (u = u.replace(l, c + s));
      let y = s + u + c;
      return a ? y.replace(/\r*\n/g, `${c}$&${s}`) : y;
    }, o;
  }, t = (o, s, c) => typeof o == "function" ? o(s) : o.wrap(s, c), i = (o, s) => {
    if (o === "" || o == null)
      return "";
    if (e.enabled === !1)
      return o;
    if (e.visible === !1)
      return "";
    let c = "" + o, l = c.includes(`
`), u = s.length;
    for (u > 0 && s.includes("unstyle") && (s = [.../* @__PURE__ */ new Set(["unstyle", ...s])].reverse()); u-- > 0; )
      c = t(e.styles[s[u]], c, l);
    return c;
  }, n = (o, s, c) => {
    e.styles[o] = r({ name: o, codes: s }), (e.keys[c] || (e.keys[c] = [])).push(o), Reflect.defineProperty(e, o, {
      configurable: !0,
      enumerable: !0,
      set(l) {
        e.alias(o, l);
      },
      get() {
        let l = (u) => i(u, l.stack);
        return Reflect.setPrototypeOf(l, e), l.stack = this.stack ? this.stack.concat(o) : [o], l;
      }
    });
  };
  return n("reset", [0, 0], "modifier"), n("bold", [1, 22], "modifier"), n("dim", [2, 22], "modifier"), n("italic", [3, 23], "modifier"), n("underline", [4, 24], "modifier"), n("inverse", [7, 27], "modifier"), n("hidden", [8, 28], "modifier"), n("strikethrough", [9, 29], "modifier"), n("black", [30, 39], "color"), n("red", [31, 39], "color"), n("green", [32, 39], "color"), n("yellow", [33, 39], "color"), n("blue", [34, 39], "color"), n("magenta", [35, 39], "color"), n("cyan", [36, 39], "color"), n("white", [37, 39], "color"), n("gray", [90, 39], "color"), n("grey", [90, 39], "color"), n("bgBlack", [40, 49], "bg"), n("bgRed", [41, 49], "bg"), n("bgGreen", [42, 49], "bg"), n("bgYellow", [43, 49], "bg"), n("bgBlue", [44, 49], "bg"), n("bgMagenta", [45, 49], "bg"), n("bgCyan", [46, 49], "bg"), n("bgWhite", [47, 49], "bg"), n("blackBright", [90, 39], "bright"), n("redBright", [91, 39], "bright"), n("greenBright", [92, 39], "bright"), n("yellowBright", [93, 39], "bright"), n("blueBright", [94, 39], "bright"), n("magentaBright", [95, 39], "bright"), n("cyanBright", [96, 39], "bright"), n("whiteBright", [97, 39], "bright"), n("bgBlackBright", [100, 49], "bgBright"), n("bgRedBright", [101, 49], "bgBright"), n("bgGreenBright", [102, 49], "bgBright"), n("bgYellowBright", [103, 49], "bgBright"), n("bgBlueBright", [104, 49], "bgBright"), n("bgMagentaBright", [105, 49], "bgBright"), n("bgCyanBright", [106, 49], "bgBright"), n("bgWhiteBright", [107, 49], "bgBright"), e.ansiRegex = Pt, e.hasColor = e.hasAnsi = (o) => (e.ansiRegex.lastIndex = 0, typeof o == "string" && o !== "" && e.ansiRegex.test(o)), e.alias = (o, s) => {
    let c = typeof s == "string" ? e[s] : s;
    if (typeof c != "function")
      throw new TypeError("Expected alias to be the name of an existing color (string) or a function");
    c.stack || (Reflect.defineProperty(c, "name", { value: o }), e.styles[o] = c, c.stack = [o]), Reflect.defineProperty(e, o, {
      configurable: !0,
      enumerable: !0,
      set(l) {
        e.alias(o, l);
      },
      get() {
        let l = (u) => i(u, l.stack);
        return Reflect.setPrototypeOf(l, e), l.stack = this.stack ? this.stack.concat(c.stack) : c.stack, l;
      }
    });
  }, e.theme = (o) => {
    if (!vt(o))
      throw new TypeError("Expected theme to be an object");
    for (let s of Object.keys(o))
      e.alias(s, o[s]);
    return e;
  }, e.alias("unstyle", (o) => typeof o == "string" && o !== "" ? (e.ansiRegex.lastIndex = 0, o.replace(e.ansiRegex, "")) : ""), e.alias("noop", (o) => o), e.none = e.clear = e.noop, e.stripColor = e.unstyle, e.symbols = Et(), e.define = n, e;
};
Oe.exports = Je();
Oe.exports.create = Je;
var Tt = Oe.exports;
const V = /* @__PURE__ */ _e(Tt);
let Te, ze, Ye, Ze, He = !0;
typeof process < "u" && ({ FORCE_COLOR: Te, NODE_DISABLE_COLORS: ze, NO_COLOR: Ye, TERM: Ze } = process.env || {}, He = process.stdout && process.stdout.isTTY);
const w = {
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
  let t = 0, i, n = "", o = "";
  for (; t < e.length; t++)
    i = e[t], n += i.open, o += i.close, ~r.indexOf(i.close) && (r = r.replace(i.rgx, i.close + i.open));
  return n + r + o;
}
function Bt(e, r) {
  let t = { has: e, keys: r };
  return t.reset = w.reset.bind(t), t.bold = w.bold.bind(t), t.dim = w.dim.bind(t), t.italic = w.italic.bind(t), t.underline = w.underline.bind(t), t.inverse = w.inverse.bind(t), t.hidden = w.hidden.bind(t), t.strikethrough = w.strikethrough.bind(t), t.black = w.black.bind(t), t.red = w.red.bind(t), t.green = w.green.bind(t), t.yellow = w.yellow.bind(t), t.blue = w.blue.bind(t), t.magenta = w.magenta.bind(t), t.cyan = w.cyan.bind(t), t.white = w.white.bind(t), t.gray = w.gray.bind(t), t.grey = w.grey.bind(t), t.bgBlack = w.bgBlack.bind(t), t.bgRed = w.bgRed.bind(t), t.bgGreen = w.bgGreen.bind(t), t.bgYellow = w.bgYellow.bind(t), t.bgBlue = w.bgBlue.bind(t), t.bgMagenta = w.bgMagenta.bind(t), t.bgCyan = w.bgCyan.bind(t), t.bgWhite = w.bgWhite.bind(t), t;
}
function _(e, r) {
  let t = {
    open: `\x1B[${e}m`,
    close: `\x1B[${r}m`,
    rgx: new RegExp(`\\x1b\\[${r}m`, "g")
  };
  return function(i) {
    return this !== void 0 && this.has !== void 0 ? (~this.has.indexOf(e) || (this.has.push(e), this.keys.push(t)), i === void 0 ? this : w.enabled ? Ae(this.keys, i + "") : i + "") : i === void 0 ? Bt([e], [t]) : w.enabled ? Ae([t], i + "") : i + "";
  };
}
var _t = Object.defineProperty, Ot = (e, r, t) => r in e ? _t(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, D = (e, r, t) => (Ot(e, typeof r != "symbol" ? r + "" : r, t), t);
const Z = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return Z.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let L = Z;
D(L, "isNode", typeof process < "u"), /**
* 是否在浏览器环境
*/
D(L, "isInBrowser", typeof window < "u"), /**
* 浏览器路径分隔符
*/
D(L, "BrowserSeperator", "/"), /**
* 是否是Electron环境
*/
D(L, "isElectron", () => !Z.isInBrowser || !window.navigator || !window.navigator.userAgent ? !1 : /Electron/.test(window.navigator.userAgent)), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
D(L, "hasNodeEnv", () => Z.isElectron() || Z.isNode), /**
* 获取url参数
*
* @param sParam - 参数
*/
D(L, "getQueryString", (e) => {
  if (!Z.isInBrowser)
    return "";
  const r = window.location.search.substring(1).split("&");
  for (let t = 0; t < r.length; t++) {
    const i = r[t].split("=");
    if (i[0] === e)
      return i[1];
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
D(L, "replaceUrlParam", (e, r, t) => {
  t == null && (t = "");
  const i = new RegExp("\\b(" + r + "=).*?(&|#|$)");
  if (e.search(i) >= 0)
    return e.replace(i, "$1" + t + "$2");
  const [n, o] = e.split("#"), [s, c] = n.split("?"), l = new URLSearchParams(c);
  l.set(r, t);
  const u = l.toString(), a = s + (u ? "?" + u : "");
  return o ? a + "#" + o : a;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
D(L, "setUrlParameter", (e, r, t) => {
  if (e.includes(r))
    return Z.replaceUrlParam(e, r, t);
  const i = e.split("#");
  let n = i[0];
  const o = i[1];
  return n.includes("?") ? n += `&${r}=${t}` : n += `?${r}=${t}`, o && (n += "#" + o), n;
}), /**
* 重新加载指定tab
*
* @param tabname - tabname
* @param t - 延迟时间
*/
D(L, "reloadTabPage", (e, r = 200) => {
  setTimeout(function() {
    if (Z.isInBrowser) {
      const t = window.location.href;
      window.location.href = Z.setUrlParameter(t, "tab", e);
    }
  }, r);
}), /**
* 刷新当前tab页面
*/
D(L, "reloadPage", () => {
  setTimeout(function() {
    Z.isInBrowser && window.location.reload();
  }, 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
*/
D(L, "reloadPageWithMessageCallback", (e, r) => {
  r && r(e), setTimeout(function() {
    Z.isInBrowser && window.location.reload();
  }, 200);
});
var C = /* @__PURE__ */ ((e) => (e.BasePathType_Appearance = "Appearance", e.BasePathType_Data = "Data", e.BasePathType_Themes = "Themes", e.BasePathType_ZhiTheme = "ZhiTheme", e.BasePathType_None = "None", e))(C || {});
const q = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return L.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : !1;
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
    let i = r;
    switch (t) {
      case C.BasePathType_Appearance:
        i = this.browserJoinPath(this.siyuanAppearanceRelativePath(), r);
        break;
      case C.BasePathType_Data:
        i = this.browserJoinPath(this.siyuanDataRelativePath(), r);
        break;
      case C.BasePathType_Themes:
        i = this.browserJoinPath(this.siyuanThemeRelativePath(), r);
        break;
      case C.BasePathType_ZhiTheme:
        i = this.browserJoinPath(this.zhiThemeRelativePath(), r);
        break;
      default:
        throw new Error("type must be provided");
    }
    const { default: n } = await import(
      /* @vite-ignore */
      i
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
    if (L.hasNodeEnv()) {
      const t = this.requireLib("path");
      if (t)
        return t.join(...r);
    }
    return this.browserJoinPath(...r);
  }
  static browserJoinPath(...r) {
    return r.join(L.BrowserSeperator);
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
    if (L.hasNodeEnv())
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
let le = q;
D(le, "isInSiyuanWidget", () => L.isInBrowser ? window.frameElement != null && window.frameElement.parentElement != null && window.frameElement.parentElement.parentElement != null && window.frameElement.parentElement.parentElement.getAttribute("data-node-id") !== "" : !1), /**
* 思源笔记新窗口
*
* @deprecated window.terwer 判断方式已废弃，建议以后打开新窗口注入 window.siyuanNewWin ，这样语义会更容易理解
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
D(le, "isInSiyuanNewWin", () => !L.isInBrowser || !L.isElectron() ? !1 : typeof window.terwer < "u" || typeof window.siyuanNewWin < "u"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
D(le, "requireLib", (e, r = !0, t = C.BasePathType_None) => {
  if (!L.hasNodeEnv())
    throw new Error("require ony works on node env");
  let i = e;
  if (!r)
    switch (t) {
      case C.BasePathType_Appearance:
        i = q.joinPath(q.siyuanAppearancePath(), e);
        break;
      case C.BasePathType_Data:
        i = q.joinPath(q.siyuanDataPath(), e);
        break;
      case C.BasePathType_Themes:
        i = q.joinPath(q.siyuanAppearancePath(), "themes", e);
        break;
      case C.BasePathType_ZhiTheme:
        i = q.joinPath(q.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const n = q.siyuanWindow();
  if (!n)
    return require(i);
  if (typeof n.require < "u")
    return n.require(i);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
D(le, "requireAppearanceLib", (e) => q.requireLib(e, !1, C.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
D(le, "requireDataLib", (e) => q.requireLib(e, !1, C.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
D(le, "requireThemesLib", (e) => q.requireLib(e, !1, C.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
D(le, "requireZhiThemeLib", (e) => q.requireLib(e, !1, C.BasePathType_ZhiTheme));
const U = {
  white: (e) => L.isElectron() ? V.whiteBright(e) : w.white(e),
  gray: (e) => L.isElectron() ? V.gray(e) : w.gray(e),
  blue: (e) => L.isElectron() ? V.blue(e) : w.blue(e),
  green: (e) => L.isElectron() ? V.green(e) : w.green(e),
  yellow: (e) => L.isElectron() ? V.yellow(e) : w.yellow(e),
  red: (e) => L.isElectron() ? V.red(e) : w.red(e),
  bgWhite: (e) => L.isElectron() ? V.bgWhiteBright(e) : w.bgWhite(e),
  bgGrey: (e) => L.isElectron() ? V.bgCyanBright(e) : w.bgCyan(e),
  bgBlue: (e) => L.isElectron() ? V.bgBlueBright(e) : w.bgBlue(e),
  bgGreen: (e) => L.isElectron() ? V.bgGreenBright(e) : w.bgGreen(e),
  bgYellow: (e) => L.isElectron() ? V.bgYellowBright(e) : w.bgYellow(e),
  bgRed: (e) => L.isElectron() ? V.bgRedBright(e) : w.bgRed(e)
};
class Rt {
  constructor(r, t, i) {
    ge(this, "consoleLogger", "console"), ge(this, "stackSize", 1), ge(this, "getLogger", (s) => {
      let c;
      if (s)
        c = s;
      else {
        const l = this.getCallStack(), u = [], a = [];
        for (let y = 0; y < l.length; y++) {
          const m = l[y], v = m.getFileName() ?? "none";
          if (y > this.stackSize - 1)
            break;
          const z = v + "-" + m.getLineNumber() + ":" + m.getColumnNumber();
          u.push(z);
        }
        a.length > 0 && (c = u.join(" -> "));
      }
      return (!c || c.trim().length === 0) && (c = this.consoleLogger), me.getLogger(c);
    }), this.stackSize = 1;
    let n;
    r ? n = r : n = Ie.getEnvLevel(i), n = n ?? X.LOG_LEVEL_INFO, me.setLevel(n);
    const o = (s, c, l, u) => {
      const a = [], y = t ?? Ie.getEnvLogger(i) ?? "zhi";
      return a.push(U.gray("[") + u(y) + U.gray("]")), a.push(U.gray("[") + U.gray(l.toString()) + U.gray("]")), a.push(u(s.toUpperCase().toString())), a.push(u(c)), a.push(U.gray(":")), a;
    };
    De.reg(me), De.apply(me, {
      format(s, c, l) {
        let u = [];
        const a = c ?? "";
        switch (s) {
          case X.LOG_LEVEL_TRACE:
            u = o(s, a, l, U.gray);
            break;
          case X.LOG_LEVEL_DEBUG:
            u = o(s, a, l, U.blue);
            break;
          case X.LOG_LEVEL_INFO:
            u = o(s, a, l, U.green);
            break;
          case X.LOG_LEVEL_WARN:
            u = o(s, a, l, U.yellow);
            break;
          case X.LOG_LEVEL_ERROR:
            u = o(s, a, l, U.red);
            break;
          default:
            u = o(X.LOG_LEVEL_INFO, a, l, U.green);
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
  constructor(r, t, i) {
    ge(this, "logger"), this.logger = new Rt(r, t, i);
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
  constructor(r, t, i) {
    super(r, t, i);
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
  static customLogFactory(r, t, i) {
    return new Ce(r, t, i);
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
    fe(this, "logger"), fe(this, "siyuanDevice"), fe(this, "initMethods", {
      /**
       * 初始化 sy-post-publisher 配置文件存储，适用于【iframe挂件模式】、【新窗口模式】以及【js片段模式】
       */
      initLocalStorageMethod: (t) => {
        const i = this.siyuanDevice.siyuanWindow(), n = this.siyuanDevice.siyuanDataPath();
        if (i.JsonLocalStorage) {
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
        const i = this.siyuanDevice.siyuanWindow(), n = this.siyuanDevice.siyuanDataPath();
        if (i.customstyle) {
          this.logger.debug("customstyle loaded, ignore.", t);
          return;
        }
        const o = this.siyuanDevice.requireLib(`${n}/widgets/sy-post-publisher/lib/siyuan/theme.js`);
        setTimeout(o, 3e3);
      },
      /**
       * 初始化初始化发布辅助功能
       * @param entryName 入口名称
       */
      initPublishHelper: (t) => {
        const i = this.siyuanDevice.siyuanWindow(), n = this.siyuanDevice.siyuanDataPath();
        if (i.syp) {
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
        const i = this.siyuanDevice.siyuanWindow(), n = this.siyuanDevice.siyuanDataPath();
        if (i.SyPicgo) {
          this.logger.debug("SyPicgo loaded, ignore.", t);
          return;
        }
        const o = this.siyuanDevice.requireLib(
          `${n}/widgets/sy-post-publisher/lib/picgo/syPicgo.js`
        ).default, s = o.getCrossPlatformAppDataFolder(), c = `${n}/widgets/sy-post-publisher/lib/picgo/picgo.cfg.json`, l = o.joinPath(s, "sy-picgo"), u = "picgo.cfg.json", a = o.joinPath(l, u);
        o.upgradeCfg(c, l, u), this.logger.debug("PicGO配置文件初始化为=>", a);
        const y = o.initPicgo(a);
        i.SyPicgo = y, this.logger.debug("syPicgo=>", y);
      },
      /**
       * 初始化 SyCmd 配置，适用于【iframe挂件模式】、【新窗口模式】以及【js片段模式】
       * @param entryName 入口名称
       */
      initCmder: (t) => {
        const i = this.siyuanDevice.siyuanWindow(), n = this.siyuanDevice.siyuanDataPath();
        if (i.SyCmd) {
          this.logger.debug("SyCmd已挂载，忽略", t);
          return;
        }
        const o = this.siyuanDevice.requireLib(`${n}/widgets/sy-post-publisher/lib/cmd/syCmd.js`);
        i.SyCmd = o, this.logger.debug("syCmd=>", o);
      }
    }), fe(this, "doInit", (t = {}) => {
      const {
        isInitLocalStorage: i = !1,
        isInitSlot: n = !1,
        isInitThemeAdaptor: o = !1,
        isInitPublishHelper: s = !1,
        isInitPicgoExtension: c = !1,
        isInitCmder: l = !1
      } = t;
      i && this.initMethods.initLocalStorageMethod("PublisherHook"), n && this.initMethods.initSlotMethod(), o && this.initMethods.initThemeAdaptor("PublisherHook"), s && this.initMethods.initPublishHelper("PublisherHook"), c && this.initMethods.initPicgoExtension("PublisherHook"), l && this.initMethods.initCmder("PublisherHook");
    });
    const r = new yt({ BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 });
    this.logger = Nt.customLogFactory(X.LOG_LEVEL_INFO, "publish-hook", r).getLogger(), this.siyuanDevice = re;
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
var It = Object.defineProperty, St = (e, r, t) => r in e ? It(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, he = (e, r, t) => (St(e, typeof r != "symbol" ? r + "" : r, t), t);
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
class xt {
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
    const i = this.getStringEnv(r);
    return i.trim().length == 0 ? t : i;
  }
}
var At = Object.defineProperty, Ct = (e, r, t) => r in e ? At(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, pe = (e, r, t) => (Ct(e, typeof r != "symbol" ? r + "" : r, t), t);
class Pe {
}
pe(Pe, "LOG_LEVEL_KEY", "VITE_LOG_LEVEL"), pe(Pe, "LOG_PREFIX_KEY", "VITE_LOG_PREFIX");
var Q = /* @__PURE__ */ ((e) => (e.LOG_LEVEL_TRACE = "TRACE", e.LOG_LEVEL_DEBUG = "DEBUG", e.LOG_LEVEL_INFO = "INFO", e.LOG_LEVEL_WARN = "WARN", e.LOG_LEVEL_ERROR = "ERROR", e))(Q || {}), Xe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Re(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Qe = { exports: {} };
(function(e) {
  (function(r, t) {
    e.exports ? e.exports = t() : r.log = t();
  })(Xe, function() {
    var r = function() {
    }, t = "undefined", i = typeof window !== t && typeof window.navigator !== t && /Trident\/|MSIE /.test(window.navigator.userAgent), n = [
      "trace",
      "debug",
      "info",
      "warn",
      "error"
    ];
    function o(h, f) {
      var E = h[f];
      if (typeof E.bind == "function")
        return E.bind(h);
      try {
        return Function.prototype.bind.call(E, h);
      } catch {
        return function() {
          return Function.prototype.apply.apply(E, [h, arguments]);
        };
      }
    }
    function s() {
      console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
    }
    function c(h) {
      return h === "debug" && (h = "log"), typeof console === t ? !1 : h === "trace" && i ? s : console[h] !== void 0 ? o(console, h) : console.log !== void 0 ? o(console, "log") : r;
    }
    function l(h, f) {
      for (var E = 0; E < n.length; E++) {
        var p = n[E];
        this[p] = E < h ? r : this.methodFactory(p, h, f);
      }
      this.log = this.debug;
    }
    function u(h, f, E) {
      return function() {
        typeof console !== t && (l.call(this, f, E), this[h].apply(this, arguments));
      };
    }
    function a(h, f, E) {
      return c(h) || u.apply(this, arguments);
    }
    function y(h, f, E) {
      var p = this, ee;
      f = f ?? "WARN";
      var d = "loglevel";
      typeof h == "string" ? d += ":" + h : typeof h == "symbol" && (d = void 0);
      function ae(g) {
        var P = (n[g] || "silent").toUpperCase();
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
        var g;
        if (!(typeof window === t || !d)) {
          try {
            g = window.localStorage[d];
          } catch {
          }
          if (typeof g === t)
            try {
              var P = window.document.cookie, x = P.indexOf(
                encodeURIComponent(d) + "="
              );
              x !== -1 && (g = /^([^;]+)/.exec(P.slice(x))[1]);
            } catch {
            }
          return p.levels[g] === void 0 && (g = void 0), g;
        }
      }
      function se() {
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
      p.name = h, p.levels = {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        SILENT: 5
      }, p.methodFactory = E || a, p.getLevel = function() {
        return ee;
      }, p.setLevel = function(g, P) {
        if (typeof g == "string" && p.levels[g.toUpperCase()] !== void 0 && (g = p.levels[g.toUpperCase()]), typeof g == "number" && g >= 0 && g <= p.levels.SILENT) {
          if (ee = g, P !== !1 && ae(g), l.call(p, g, h), typeof console === t && g < p.levels.SILENT)
            return "No console available for logging";
        } else
          throw "log.setLevel() called with invalid level: " + g;
      }, p.setDefaultLevel = function(g) {
        f = g, te() || p.setLevel(g, !1);
      }, p.resetLevel = function() {
        p.setLevel(f, !1), se();
      }, p.enableAll = function(g) {
        p.setLevel(p.levels.TRACE, g);
      }, p.disableAll = function(g) {
        p.setLevel(p.levels.SILENT, g);
      };
      var B = te();
      B == null && (B = f), p.setLevel(B, !1);
    }
    var m = new y(), v = {};
    m.getLogger = function(h) {
      if (typeof h != "symbol" && typeof h != "string" || h === "")
        throw new TypeError("You must supply a name when creating a logger.");
      var f = v[h];
      return f || (f = v[h] = new y(
        h,
        m.getLevel(),
        m.methodFactory
      )), f;
    };
    var z = typeof window !== t ? window.log : void 0;
    return m.noConflict = function() {
      return typeof window !== t && window.log === m && (window.log = z), m;
    }, m.getLoggers = function() {
      return v;
    }, m.default = m, m;
  });
})(Qe);
var Wt = Qe.exports;
const Ee = /* @__PURE__ */ Re(Wt);
var et = { exports: {} };
(function(e) {
  (function(r, t) {
    e.exports ? e.exports = t() : r.prefix = t(r);
  })(Xe, function(r) {
    var t = function(a) {
      for (var y = 1, m = arguments.length, v; y < m; y++)
        for (v in arguments[y])
          Object.prototype.hasOwnProperty.call(arguments[y], v) && (a[v] = arguments[y][v]);
      return a;
    }, i = {
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
    }, n, o = {}, s = function(a) {
      if (!a || !a.getLogger)
        throw new TypeError("Argument is not a root logger");
      n = a;
    }, c = function(a, y) {
      if (!a || !a.setLevel)
        throw new TypeError("Argument is not a logger");
      var m = a.methodFactory, v = a.name || "", z = o[v] || o[""] || i;
      function h(f, E, p) {
        var ee = m(f, E, p), d = o[p] || o[""], ae = d.template.indexOf("%t") !== -1, te = d.template.indexOf("%l") !== -1, se = d.template.indexOf("%n") !== -1;
        return function() {
          for (var B = "", g = arguments.length, P = Array(g), x = 0; x < g; x++)
            P[x] = arguments[x];
          if (v || !o[p]) {
            var ye = d.timestampFormatter(/* @__PURE__ */ new Date()), de = d.levelFormatter(f), we = d.nameFormatter(p);
            d.format ? B += d.format(de, we, ye) : (B += d.template, ae && (B = B.replace(/%t/, ye)), te && (B = B.replace(/%l/, de)), se && (B = B.replace(/%n/, we))), P.length && typeof P[0] == "string" ? P[0] = B + " " + P[0] : P.unshift(B);
          }
          ee.apply(void 0, P);
        };
      }
      return o[v] || (a.methodFactory = h), y = y || {}, y.template && (y.format = void 0), o[v] = t({}, z, y), a.setLevel(a.getLevel()), n || a.warn(
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
var $t = et.exports;
const We = /* @__PURE__ */ Re($t);
function jt() {
  const e = Error.prepareStackTrace;
  Error.prepareStackTrace = (t, i) => i;
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
    return r[Object.keys(r).filter((i) => r[i].toString() === t)[0]];
  }
  /**
   * 获取配置的日志级别
   */
  static getEnvLevel(r) {
    if (!r)
      return;
    const t = r.getEnvOrDefault(Pe.LOG_LEVEL_KEY, Q.LOG_LEVEL_INFO), i = Le.stringToEnumValue(Q, t.toUpperCase());
    return i || console.warn(
      "[zhi-log] LOG_LEVEL is invalid in you .env file.It must be either debug, info, warn or error, fallback to default info level"
    ), i;
  }
  /**
   * 获取默认日志
   */
  static getEnvLogger(r) {
    return r ? r.getEnv(Pe.LOG_PREFIX_KEY) : void 0;
  }
}
var ke = { exports: {} }, $e = { exports: {} }, je;
function qt() {
  return je || (je = 1, function(e) {
    const r = typeof process < "u" && process.env.TERM_PROGRAM === "Hyper", t = typeof process < "u" && process.platform === "win32", i = typeof process < "u" && process.platform === "linux", n = {
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
    }, o = Object.assign({}, n, {
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
      pointer: i ? "▸" : "❯",
      pointerSmall: i ? "‣" : "›",
      radioOff: "◯",
      radioOn: "◉",
      warning: "⚠"
    });
    e.exports = t && !r ? o : s, Reflect.defineProperty(e.exports, "common", { enumerable: !1, value: n }), Reflect.defineProperty(e.exports, "windows", { enumerable: !1, value: o }), Reflect.defineProperty(e.exports, "other", { enumerable: !1, value: s });
  }($e)), $e.exports;
}
const Gt = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Ft = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g, Vt = () => typeof process < "u" ? process.env.FORCE_COLOR !== "0" : !1, tt = () => {
  const e = {
    enabled: Vt(),
    visible: !0,
    styles: {},
    keys: {}
  }, r = (o) => {
    let s = o.open = `\x1B[${o.codes[0]}m`, c = o.close = `\x1B[${o.codes[1]}m`, l = o.regex = new RegExp(`\\u001b\\[${o.codes[1]}m`, "g");
    return o.wrap = (u, a) => {
      u.includes(c) && (u = u.replace(l, c + s));
      let y = s + u + c;
      return a ? y.replace(/\r*\n/g, `${c}$&${s}`) : y;
    }, o;
  }, t = (o, s, c) => typeof o == "function" ? o(s) : o.wrap(s, c), i = (o, s) => {
    if (o === "" || o == null)
      return "";
    if (e.enabled === !1)
      return o;
    if (e.visible === !1)
      return "";
    let c = "" + o, l = c.includes(`
`), u = s.length;
    for (u > 0 && s.includes("unstyle") && (s = [.../* @__PURE__ */ new Set(["unstyle", ...s])].reverse()); u-- > 0; )
      c = t(e.styles[s[u]], c, l);
    return c;
  }, n = (o, s, c) => {
    e.styles[o] = r({ name: o, codes: s }), (e.keys[c] || (e.keys[c] = [])).push(o), Reflect.defineProperty(e, o, {
      configurable: !0,
      enumerable: !0,
      set(l) {
        e.alias(o, l);
      },
      get() {
        let l = (u) => i(u, l.stack);
        return Reflect.setPrototypeOf(l, e), l.stack = this.stack ? this.stack.concat(o) : [o], l;
      }
    });
  };
  return n("reset", [0, 0], "modifier"), n("bold", [1, 22], "modifier"), n("dim", [2, 22], "modifier"), n("italic", [3, 23], "modifier"), n("underline", [4, 24], "modifier"), n("inverse", [7, 27], "modifier"), n("hidden", [8, 28], "modifier"), n("strikethrough", [9, 29], "modifier"), n("black", [30, 39], "color"), n("red", [31, 39], "color"), n("green", [32, 39], "color"), n("yellow", [33, 39], "color"), n("blue", [34, 39], "color"), n("magenta", [35, 39], "color"), n("cyan", [36, 39], "color"), n("white", [37, 39], "color"), n("gray", [90, 39], "color"), n("grey", [90, 39], "color"), n("bgBlack", [40, 49], "bg"), n("bgRed", [41, 49], "bg"), n("bgGreen", [42, 49], "bg"), n("bgYellow", [43, 49], "bg"), n("bgBlue", [44, 49], "bg"), n("bgMagenta", [45, 49], "bg"), n("bgCyan", [46, 49], "bg"), n("bgWhite", [47, 49], "bg"), n("blackBright", [90, 39], "bright"), n("redBright", [91, 39], "bright"), n("greenBright", [92, 39], "bright"), n("yellowBright", [93, 39], "bright"), n("blueBright", [94, 39], "bright"), n("magentaBright", [95, 39], "bright"), n("cyanBright", [96, 39], "bright"), n("whiteBright", [97, 39], "bright"), n("bgBlackBright", [100, 49], "bgBright"), n("bgRedBright", [101, 49], "bgBright"), n("bgGreenBright", [102, 49], "bgBright"), n("bgYellowBright", [103, 49], "bgBright"), n("bgBlueBright", [104, 49], "bgBright"), n("bgMagentaBright", [105, 49], "bgBright"), n("bgCyanBright", [106, 49], "bgBright"), n("bgWhiteBright", [107, 49], "bgBright"), e.ansiRegex = Ft, e.hasColor = e.hasAnsi = (o) => (e.ansiRegex.lastIndex = 0, typeof o == "string" && o !== "" && e.ansiRegex.test(o)), e.alias = (o, s) => {
    let c = typeof s == "string" ? e[s] : s;
    if (typeof c != "function")
      throw new TypeError("Expected alias to be the name of an existing color (string) or a function");
    c.stack || (Reflect.defineProperty(c, "name", { value: o }), e.styles[o] = c, c.stack = [o]), Reflect.defineProperty(e, o, {
      configurable: !0,
      enumerable: !0,
      set(l) {
        e.alias(o, l);
      },
      get() {
        let l = (u) => i(u, l.stack);
        return Reflect.setPrototypeOf(l, e), l.stack = this.stack ? this.stack.concat(c.stack) : c.stack, l;
      }
    });
  }, e.theme = (o) => {
    if (!Gt(o))
      throw new TypeError("Expected theme to be an object");
    for (let s of Object.keys(o))
      e.alias(s, o[s]);
    return e;
  }, e.alias("unstyle", (o) => typeof o == "string" && o !== "" ? (e.ansiRegex.lastIndex = 0, o.replace(e.ansiRegex, "")) : ""), e.alias("noop", (o) => o), e.none = e.clear = e.noop, e.stripColor = e.unstyle, e.symbols = qt(), e.define = n, e;
};
ke.exports = tt();
ke.exports.create = tt;
var Ut = ke.exports;
const M = /* @__PURE__ */ Re(Ut);
let Be, rt, nt, it, ot = !0;
typeof process < "u" && ({ FORCE_COLOR: Be, NODE_DISABLE_COLORS: rt, NO_COLOR: nt, TERM: it } = process.env || {}, ot = process.stdout && process.stdout.isTTY);
const b = {
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
function qe(e, r) {
  let t = 0, i, n = "", o = "";
  for (; t < e.length; t++)
    i = e[t], n += i.open, o += i.close, ~r.indexOf(i.close) && (r = r.replace(i.rgx, i.close + i.open));
  return n + r + o;
}
function Mt(e, r) {
  let t = { has: e, keys: r };
  return t.reset = b.reset.bind(t), t.bold = b.bold.bind(t), t.dim = b.dim.bind(t), t.italic = b.italic.bind(t), t.underline = b.underline.bind(t), t.inverse = b.inverse.bind(t), t.hidden = b.hidden.bind(t), t.strikethrough = b.strikethrough.bind(t), t.black = b.black.bind(t), t.red = b.red.bind(t), t.green = b.green.bind(t), t.yellow = b.yellow.bind(t), t.blue = b.blue.bind(t), t.magenta = b.magenta.bind(t), t.cyan = b.cyan.bind(t), t.white = b.white.bind(t), t.gray = b.gray.bind(t), t.grey = b.grey.bind(t), t.bgBlack = b.bgBlack.bind(t), t.bgRed = b.bgRed.bind(t), t.bgGreen = b.bgGreen.bind(t), t.bgYellow = b.bgYellow.bind(t), t.bgBlue = b.bgBlue.bind(t), t.bgMagenta = b.bgMagenta.bind(t), t.bgCyan = b.bgCyan.bind(t), t.bgWhite = b.bgWhite.bind(t), t;
}
function O(e, r) {
  let t = {
    open: `\x1B[${e}m`,
    close: `\x1B[${r}m`,
    rgx: new RegExp(`\\x1b\\[${r}m`, "g")
  };
  return function(i) {
    return this !== void 0 && this.has !== void 0 ? (~this.has.indexOf(e) || (this.has.push(e), this.keys.push(t)), i === void 0 ? this : b.enabled ? qe(this.keys, i + "") : i + "") : i === void 0 ? Mt([e], [t]) : b.enabled ? qe([t], i + "") : i + "";
  };
}
var Jt = Object.defineProperty, zt = (e, r, t) => r in e ? Jt(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, I = (e, r, t) => (zt(e, typeof r != "symbol" ? r + "" : r, t), t);
const H = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return H.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let T = H;
I(T, "isNode", typeof process < "u"), /**
* 是否在浏览器环境
*/
I(T, "isInBrowser", typeof window < "u"), /**
* 浏览器路径分隔符
*/
I(T, "BrowserSeperator", "/"), /**
* 是否是Electron环境
*/
I(T, "isElectron", () => !H.isInBrowser || !window.navigator || !window.navigator.userAgent ? !1 : /Electron/.test(window.navigator.userAgent)), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
I(T, "hasNodeEnv", () => H.isElectron() || H.isNode), /**
* 获取url参数
*
* @param sParam - 参数
*/
I(T, "getQueryString", (e) => {
  if (!H.isInBrowser)
    return "";
  const r = window.location.search.substring(1).split("&");
  for (let t = 0; t < r.length; t++) {
    const i = r[t].split("=");
    if (i[0] === e)
      return i[1];
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
I(T, "replaceUrlParam", (e, r, t) => {
  t == null && (t = "");
  const i = new RegExp("\\b(" + r + "=).*?(&|#|$)");
  if (e.search(i) >= 0)
    return e.replace(i, "$1" + t + "$2");
  const [n, o] = e.split("#"), [s, c] = n.split("?"), l = new URLSearchParams(c);
  l.set(r, t);
  const u = l.toString(), a = s + (u ? "?" + u : "");
  return o ? a + "#" + o : a;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
I(T, "setUrlParameter", (e, r, t) => {
  if (e.includes(r))
    return H.replaceUrlParam(e, r, t);
  const i = e.split("#");
  let n = i[0];
  const o = i[1];
  return n.includes("?") ? n += `&${r}=${t}` : n += `?${r}=${t}`, o && (n += "#" + o), n;
}), /**
* 重新加载指定tab
*
* @param tabname - tabname
* @param t - 延迟时间
*/
I(T, "reloadTabPage", (e, r = 200) => {
  setTimeout(function() {
    if (H.isInBrowser) {
      const t = window.location.href;
      window.location.href = H.setUrlParameter(t, "tab", e);
    }
  }, r);
}), /**
* 刷新当前tab页面
*/
I(T, "reloadPage", () => {
  setTimeout(function() {
    H.isInBrowser && window.location.reload();
  }, 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
*/
I(T, "reloadPageWithMessageCallback", (e, r) => {
  r && r(e), setTimeout(function() {
    H.isInBrowser && window.location.reload();
  }, 200);
});
var W = /* @__PURE__ */ ((e) => (e.BasePathType_Appearance = "Appearance", e.BasePathType_Data = "Data", e.BasePathType_Themes = "Themes", e.BasePathType_ZhiTheme = "ZhiTheme", e.BasePathType_None = "None", e))(W || {});
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
    const { default: i } = await import(
      /* @vite-ignore */
      t
    );
    return i;
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
    if (T.hasNodeEnv()) {
      const r = this.requireLib("path");
      if (r)
        return r.join(...e);
    }
    return this.browserJoinPath(...e);
  }
  static browserJoinPath(...e) {
    return e.join(T.BrowserSeperator);
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
    if (T.hasNodeEnv())
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
let ce = G;
I(ce, "isInSiyuanWidget", () => T.isInBrowser ? window.frameElement != null && window.frameElement.parentElement != null && window.frameElement.parentElement.parentElement != null && window.frameElement.parentElement.parentElement.getAttribute("data-node-id") !== "" : !1), /**
* 思源笔记新窗口
*
* @deprecated window.terwer 判断方式已废弃，建议以后打开新窗口注入 window.siyuanNewWin ，这样语义会更容易理解
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
I(ce, "isInSiyuanNewWin", () => !T.isInBrowser || !T.isElectron() ? !1 : typeof window.terwer < "u" || typeof window.siyuanNewWin < "u"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
I(ce, "requireLib", (e, r = !0, t = W.BasePathType_None) => {
  if (!T.hasNodeEnv())
    throw new Error("require ony works on node env");
  let i = e;
  if (!r)
    switch (t) {
      case W.BasePathType_Appearance:
        i = G.joinPath(G.siyuanAppearancePath(), e);
        break;
      case W.BasePathType_Data:
        i = G.joinPath(G.siyuanDataPath(), e);
        break;
      case W.BasePathType_Themes:
        i = G.joinPath(G.siyuanAppearancePath(), "themes", e);
        break;
      case W.BasePathType_ZhiTheme:
        i = G.joinPath(G.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const n = G.siyuanWindow();
  if (!n)
    return require(i);
  if (typeof n.require < "u")
    return n.require(i);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
I(ce, "requireAppearanceLib", (e) => G.requireLib(e, !1, W.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
I(ce, "requireDataLib", (e) => G.requireLib(e, !1, W.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
I(ce, "requireThemesLib", (e) => G.requireLib(e, !1, W.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
I(ce, "requireZhiThemeLib", (e) => G.requireLib(e, !1, W.BasePathType_ZhiTheme));
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
class Yt {
  constructor(r, t, i) {
    pe(this, "consoleLogger", "console"), pe(this, "stackSize", 1), pe(this, "getLogger", (s) => {
      let c;
      if (s)
        c = s;
      else {
        const l = this.getCallStack(), u = [], a = [];
        for (let y = 0; y < l.length; y++) {
          const m = l[y], v = m.getFileName() ?? "none";
          if (y > this.stackSize - 1)
            break;
          const z = v + "-" + m.getLineNumber() + ":" + m.getColumnNumber();
          u.push(z);
        }
        a.length > 0 && (c = u.join(" -> "));
      }
      return (!c || c.trim().length === 0) && (c = this.consoleLogger), Ee.getLogger(c);
    }), this.stackSize = 1;
    let n;
    r ? n = r : n = Le.getEnvLevel(i), n = n ?? Q.LOG_LEVEL_INFO, Ee.setLevel(n);
    const o = (s, c, l, u) => {
      const a = [], y = t ?? Le.getEnvLogger(i) ?? "zhi";
      return a.push(J.gray("[") + u(y) + J.gray("]")), a.push(J.gray("[") + J.gray(l.toString()) + J.gray("]")), a.push(u(s.toUpperCase().toString())), a.push(u(c)), a.push(J.gray(":")), a;
    };
    We.reg(Ee), We.apply(Ee, {
      format(s, c, l) {
        let u = [];
        const a = c ?? "";
        switch (s) {
          case Q.LOG_LEVEL_TRACE:
            u = o(s, a, l, J.gray);
            break;
          case Q.LOG_LEVEL_DEBUG:
            u = o(s, a, l, J.blue);
            break;
          case Q.LOG_LEVEL_INFO:
            u = o(s, a, l, J.green);
            break;
          case Q.LOG_LEVEL_WARN:
            u = o(s, a, l, J.yellow);
            break;
          case Q.LOG_LEVEL_ERROR:
            u = o(s, a, l, J.red);
            break;
          default:
            u = o(Q.LOG_LEVEL_INFO, a, l, J.green);
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
  constructor(r, t, i) {
    pe(this, "logger"), this.logger = new Yt(r, t, i);
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
class Ge extends Zt {
  constructor(r, t, i) {
    super(r, t, i);
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
  static customLogFactory(r, t, i) {
    return new Ge(r, t, i);
  }
  /**
   * 自定义日志工厂，自定义前缀
   *
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customSignLogFactory(r, t) {
    return new Ge(void 0, r, t);
  }
}
var Ht = Object.defineProperty, Kt = (e, r, t) => r in e ? Ht(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, S = (e, r, t) => (Kt(e, typeof r != "symbol" ? r + "" : r, t), t);
const K = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return K.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let k = K;
S(k, "isNode", typeof process < "u"), /**
* 是否在浏览器环境
*/
S(k, "isInBrowser", typeof window < "u"), /**
* 浏览器路径分隔符
*/
S(k, "BrowserSeperator", "/"), /**
* 是否是Electron环境
*/
S(k, "isElectron", () => !K.isInBrowser || !window.navigator || !window.navigator.userAgent ? !1 : /Electron/.test(window.navigator.userAgent)), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
S(k, "hasNodeEnv", () => K.isElectron() || K.isNode), /**
* 获取url参数
*
* @param sParam - 参数
*/
S(k, "getQueryString", (e) => {
  if (!K.isInBrowser)
    return "";
  const r = window.location.search.substring(1).split("&");
  for (let t = 0; t < r.length; t++) {
    const i = r[t].split("=");
    if (i[0] === e)
      return i[1];
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
S(k, "replaceUrlParam", (e, r, t) => {
  t == null && (t = "");
  const i = new RegExp("\\b(" + r + "=).*?(&|#|$)");
  if (e.search(i) >= 0)
    return e.replace(i, "$1" + t + "$2");
  const [n, o] = e.split("#"), [s, c] = n.split("?"), l = new URLSearchParams(c);
  l.set(r, t);
  const u = l.toString(), a = s + (u ? "?" + u : "");
  return o ? a + "#" + o : a;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
S(k, "setUrlParameter", (e, r, t) => {
  if (e.includes(r))
    return K.replaceUrlParam(e, r, t);
  const i = e.split("#");
  let n = i[0];
  const o = i[1];
  return n.includes("?") ? n += `&${r}=${t}` : n += `?${r}=${t}`, o && (n += "#" + o), n;
}), /**
* 重新加载指定tab
*
* @param tabname - tabname
* @param t - 延迟时间
*/
S(k, "reloadTabPage", (e, r = 200) => {
  setTimeout(function() {
    if (K.isInBrowser) {
      const t = window.location.href;
      window.location.href = K.setUrlParameter(t, "tab", e);
    }
  }, r);
}), /**
* 刷新当前tab页面
*/
S(k, "reloadPage", () => {
  setTimeout(function() {
    K.isInBrowser && window.location.reload();
  }, 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
*/
S(k, "reloadPageWithMessageCallback", (e, r) => {
  r && r(e), setTimeout(function() {
    K.isInBrowser && window.location.reload();
  }, 200);
});
var $ = /* @__PURE__ */ ((e) => (e.BasePathType_Appearance = "Appearance", e.BasePathType_Data = "Data", e.BasePathType_Themes = "Themes", e.BasePathType_ZhiTheme = "ZhiTheme", e.BasePathType_None = "None", e))($ || {});
const F = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return k.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : !1;
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
    const { default: i } = await import(
      /* @vite-ignore */
      t
    );
    return i;
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
    if (k.hasNodeEnv()) {
      const r = this.requireLib("path");
      if (r)
        return r.join(...e);
    }
    return this.browserJoinPath(...e);
  }
  static browserJoinPath(...e) {
    return e.join(k.BrowserSeperator);
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
    if (k.hasNodeEnv())
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
let ne = F;
S(ne, "isInSiyuanWidget", () => k.isInBrowser ? window.frameElement != null && window.frameElement.parentElement != null && window.frameElement.parentElement.parentElement != null && window.frameElement.parentElement.parentElement.getAttribute("data-node-id") !== "" : !1), /**
* 思源笔记新窗口
*
* @deprecated window.terwer 判断方式已废弃，建议以后打开新窗口注入 window.siyuanNewWin ，这样语义会更容易理解
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
S(ne, "isInSiyuanNewWin", () => !k.isInBrowser || !k.isElectron() ? !1 : typeof window.terwer < "u" || typeof window.siyuanNewWin < "u"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
S(ne, "requireLib", (e, r = !0, t = $.BasePathType_None) => {
  if (!k.hasNodeEnv())
    throw new Error("require ony works on node env");
  let i = e;
  if (!r)
    switch (t) {
      case $.BasePathType_Appearance:
        i = F.joinPath(F.siyuanAppearancePath(), e);
        break;
      case $.BasePathType_Data:
        i = F.joinPath(F.siyuanDataPath(), e);
        break;
      case $.BasePathType_Themes:
        i = F.joinPath(F.siyuanAppearancePath(), "themes", e);
        break;
      case $.BasePathType_ZhiTheme:
        i = F.joinPath(F.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const n = F.siyuanWindow();
  if (!n)
    return require(i);
  if (typeof n.require < "u")
    return n.require(i);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
S(ne, "requireAppearanceLib", (e) => F.requireLib(e, !1, $.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
S(ne, "requireDataLib", (e) => F.requireLib(e, !1, $.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
S(ne, "requireThemesLib", (e) => F.requireLib(e, !1, $.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
S(ne, "requireZhiThemeLib", (e) => F.requireLib(e, !1, $.BasePathType_ZhiTheme));
const Xt = "c6f0e84b0df40a0c5b9de2b5716fc33f93291f1a";
class ar {
  constructor() {
    be(this, "repoHash", Xt);
    be(this, "logger");
    be(this, "publishHook");
    be(this, "siyuanDevice");
    const r = new xt({ BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 });
    this.logger = Ne.customLogFactory(Q.LOG_LEVEL_INFO, "publish-bridge", r).getLogger(), this.siyuanDevice = ne, this.publishHook = new Dt();
  }
  async init() {
    this.logger.info("Initiating sy-post-publisher from publish bridge ...");
    try {
      const t = `${this.siyuanDevice.siyuanDataPath()}/widgets/sy-post-publisher`, i = this.siyuanDevice.requireLib("fs");
      this.logger.info("Widget sy-post-publisher folder=>", t), i.existsSync(t) || (this.logger.info("Widget sy-post-publisher not exist, downloading..."), await this.doDownload(), this.logger.info("Widget sy-post-publisher downloaded")), this.publishHook.doInit({
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
    }, i = {
      body: JSON.stringify(t),
      method: "POST"
    };
    if ((await (await fetch(r, i)).json()).code == 0)
      this.logger.info("Download sy-post-publisher from bazaar success");
    else
      throw new Error("Download sy-post-publisher error, this plugin will not work!");
  }
}
export {
  ar as default
};
