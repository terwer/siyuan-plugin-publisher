var g = Object.defineProperty;
var P = (a, e, t) => e in a ? g(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var r = (a, e, t) => (P(a, typeof e != "symbol" ? e + "" : e, t), t);
const u = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return u.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let i = u;
/**
 * 是否在浏览器环境
 */
r(i, "isNode", typeof process < "u"), /**
 * 是否在浏览器环境
 */
r(i, "isInBrowser", typeof window < "u"), /**
 * 浏览器路径分隔符
 */
r(i, "BrowserSeperator", "/"), /**
 * 是否是Electron环境
 */
r(i, "isElectron", () => !u.isInBrowser || !window.navigator || !window.navigator.userAgent ? !1 : /Electron/.test(window.navigator.userAgent)), /**
 * 是否有Node环境，目前包括 Electron 和 Node
 */
r(i, "hasNodeEnv", () => u.isElectron() || u.isNode), /**
 * 获取url参数
 *
 * @param sParam - 参数
 */
r(i, "getQueryString", (e) => {
  if (!u.isInBrowser)
    return "";
  const n = window.location.search.substring(1).split("&");
  for (let s = 0; s < n.length; s++) {
    const c = n[s].split("=");
    if (c[0] === e)
      return c[1];
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
r(i, "replaceUrlParam", (e, t, n) => {
  n == null && (n = "");
  const s = new RegExp("\\b(" + t + "=).*?(&|#|$)");
  if (e.search(s) >= 0)
    return e.replace(s, "$1" + n + "$2");
  const [c, d] = e.split("#"), [y, b] = c.split("?"), l = new URLSearchParams(b);
  l.set(t, n);
  const m = l.toString(), f = y + (m ? "?" + m : "");
  return d ? f + "#" + d : f;
}), /**
 * 设置url参数
 *
 * @param urlstring - url
 * @param key - key
 * @param value - value
 */
r(i, "setUrlParameter", (e, t, n) => {
  if (e.includes(t))
    return u.replaceUrlParam(e, t, n);
  const s = e.split("#");
  let c = s[0];
  const d = s[1];
  return c.includes("?") ? c += `&${t}=${n}` : c += `?${t}=${n}`, d && (c += "#" + d), c;
}), /**
 * 重新加载指定tab
 *
 * @param tabname - tabname
 * @param t - 延迟时间
 */
r(i, "reloadTabPage", (e, t = 200) => {
  setTimeout(function() {
    if (u.isInBrowser) {
      const n = window.location.href;
      window.location.href = u.setUrlParameter(n, "tab", e);
    }
  }, t);
}), /**
 * 刷新当前tab页面
 */
r(i, "reloadPage", () => {
  setTimeout(function() {
    u.isInBrowser && window.location.reload();
  }, 200);
}), /**
 * 刷新当前tab页面
 *
 * @param msg - 消息提示
 * @param cb - 回调
 */
r(i, "reloadPageWithMessageCallback", (e, t) => {
  t && t(e), setTimeout(function() {
    u.isInBrowser && window.location.reload();
  }, 200);
});
var o = /* @__PURE__ */ ((a) => (a.BasePathType_Appearance = "Appearance", a.BasePathType_Data = "Data", a.BasePathType_Themes = "Themes", a.BasePathType_ZhiTheme = "ZhiTheme", a.BasePathType_None = "None", a))(o || {});
const h = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return i.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : !1;
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
  static async importJs(e, t) {
    let n = e;
    switch (t) {
      case o.BasePathType_Appearance:
        n = this.browserJoinPath(this.siyuanAppearanceRelativePath(), e);
        break;
      case o.BasePathType_Data:
        n = this.browserJoinPath(this.siyuanDataRelativePath(), e);
        break;
      case o.BasePathType_Themes:
        n = this.browserJoinPath(this.siyuanThemeRelativePath(), e);
        break;
      case o.BasePathType_ZhiTheme:
        n = this.browserJoinPath(this.zhiThemeRelativePath(), e);
        break;
      default:
        throw new Error("type must be provided");
    }
    const { default: s } = await import(
      /* @vite-ignore */
      n
    );
    return s;
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
    return await this.importJs(e, o.BasePathType_ZhiTheme);
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
    if (i.hasNodeEnv()) {
      const t = this.requireLib("path");
      if (t)
        return t.join(...e);
    }
    return this.browserJoinPath(...e);
  }
  static browserJoinPath(...e) {
    return e.join(i.BrowserSeperator);
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
    if (i.hasNodeEnv())
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
let w = h;
/**
 * 思源笔记iframe挂件环境
 */
r(w, "isInSiyuanWidget", () => i.isInBrowser ? window.frameElement != null && window.frameElement.parentElement != null && window.frameElement.parentElement.parentElement != null && window.frameElement.parentElement.parentElement.getAttribute("data-node-id") !== "" : !1), /**
 * 思源笔记新窗口
 *
 * @deprecated window.terwer 判断方式已废弃，建议以后打开新窗口注入 window.siyuanNewWin ，这样语义会更容易理解
 * @author terwer
 * @version 0.1.0
 * @since 0.0.1
 */
r(w, "isInSiyuanNewWin", () => !i.isInBrowser || !i.isElectron() ? !1 : typeof window.terwer < "u" || typeof window.siyuanNewWin < "u"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
r(w, "requireLib", (e, t = !0, n = o.BasePathType_None) => {
  if (!i.hasNodeEnv())
    throw new Error("require ony works on node env");
  let s = e;
  if (!t)
    switch (n) {
      case o.BasePathType_Appearance:
        s = h.joinPath(h.siyuanAppearancePath(), e);
        break;
      case o.BasePathType_Data:
        s = h.joinPath(h.siyuanDataPath(), e);
        break;
      case o.BasePathType_Themes:
        s = h.joinPath(h.siyuanAppearancePath(), "themes", e);
        break;
      case o.BasePathType_ZhiTheme:
        s = h.joinPath(h.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const c = h.siyuanWindow();
  if (!c)
    return require(s);
  if (typeof c.require < "u")
    return c.require(s);
}), /**
 * 引入依赖，以 data 的基本路径为准
 *
 * @param libpath - 相对于 appearance 的相对路径
 */
r(w, "requireAppearanceLib", (e) => h.requireLib(e, !1, o.BasePathType_Appearance)), /**
 * 引入依赖，以 data 的基本路径为准
 *
 * @param libpath - 相对于 data 的相对路径
 */
r(w, "requireDataLib", (e) => h.requireLib(e, !1, o.BasePathType_Data)), /**
 * 引入依赖，以 theme 的基本路径为准
 *
 * @param libpath - 相对于 theme 的相对路径
 */
r(w, "requireThemesLib", (e) => h.requireLib(e, !1, o.BasePathType_Themes)), /**
 * 引入依赖，以 ZhiTheme 的基本路径为准
 *
 * @param libpath - 相对于 ZhiTheme 的相对路径
 */
r(w, "requireZhiThemeLib", (e) => h.requireLib(e, !1, o.BasePathType_ZhiTheme));
var p = /* @__PURE__ */ ((a) => (a.DeviceType_Mobile_Device = "Mobile", a.DeviceType_Siyuan_Widget = "Siyuan_Widget", a.DeviceType_Siyuan_NewWin = "Siyuan_NewWindow", a.DeviceType_Siyuan_MainWin = "Siyuan_MainWindow", a.DeviceType_Siyuan_Browser = "Siyuan_Browser", a.DeviceType_Chrome_Extension = "Chrome_Extension", a.DeviceType_Chrome_Browser = "Chrome_Browser", a.DeviceType_Node = "Node", a))(p || {});
class v {
  /**
   * 获取当前设备
   */
  static getDevice() {
    return this.detectMobileDevice() ? p.DeviceType_Mobile_Device : w.isInSiyuanWidget() ? p.DeviceType_Siyuan_Widget : w.isInSiyuanNewWin() ? p.DeviceType_Siyuan_NewWin : i.isElectron() ? p.DeviceType_Siyuan_MainWin : w.isInSiyuanBrowser() ? p.DeviceType_Siyuan_Browser : i.isInChromeExtension() ? p.DeviceType_Chrome_Extension : i.isNode ? p.DeviceType_Node : p.DeviceType_Chrome_Browser;
  }
  /**
   * 检测移动端
   * @private
   */
  static detectMobileDevice() {
    let e = !1;
    return i.isInBrowser && function(t) {
      (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        t
      ) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
        t.substr(0, 4)
      )) && (e = !0);
    }(navigator.userAgent || navigator.vendor || window.opera), e;
  }
}
export {
  o as BasePathTypeEnum,
  i as BrowserUtil,
  v as DeviceDetection,
  p as DeviceTypeEnum,
  w as SiyuanDevice
};
