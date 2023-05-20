var ce = Object.defineProperty;
var ue = (e, r, t) => r in e ? ce(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t;
var C = (e, r, t) => (ue(e, typeof r != "symbol" ? r + "" : r, t), t);
class D {
}
C(D, "LOG_LEVEL_KEY", "VITE_LOG_LEVEL"), C(D, "LOG_PREFIX_KEY", "VITE_LOG_PREFIX");
var S = /* @__PURE__ */ ((e) => (e.LOG_LEVEL_TRACE = "TRACE", e.LOG_LEVEL_DEBUG = "DEBUG", e.LOG_LEVEL_INFO = "INFO", e.LOG_LEVEL_WARN = "WARN", e.LOG_LEVEL_ERROR = "ERROR", e))(S || {}), ee = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Y(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var te = { exports: {} };
(function(e) {
  (function(r, t) {
    e.exports ? e.exports = t() : r.log = t();
  })(ee, function() {
    var r = function() {
    }, t = "undefined", o = typeof window !== t && typeof window.navigator !== t && /Trident\/|MSIE /.test(window.navigator.userAgent), n = [
      "trace",
      "debug",
      "info",
      "warn",
      "error"
    ];
    function i(d, y) {
      var m = d[y];
      if (typeof m.bind == "function")
        return m.bind(d);
      try {
        return Function.prototype.bind.call(m, d);
      } catch {
        return function() {
          return Function.prototype.apply.apply(m, [d, arguments]);
        };
      }
    }
    function s() {
      console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
    }
    function u(d) {
      return d === "debug" && (d = "log"), typeof console === t ? !1 : d === "trace" && o ? s : console[d] !== void 0 ? i(console, d) : console.log !== void 0 ? i(console, "log") : r;
    }
    function g(d, y) {
      for (var m = 0; m < n.length; m++) {
        var f = n[m];
        this[f] = m < d ? r : this.methodFactory(f, d, y);
      }
      this.log = this.debug;
    }
    function c(d, y, m) {
      return function() {
        typeof console !== t && (g.call(this, y, m), this[d].apply(this, arguments));
      };
    }
    function a(d, y, m) {
      return u(d) || c.apply(this, arguments);
    }
    function v(d, y, m) {
      var f = this, F;
      y = y ?? "WARN";
      var w = "loglevel";
      typeof d == "string" ? w += ":" + d : typeof d == "symbol" && (w = void 0);
      function j(h) {
        var L = (n[h] || "silent").toUpperCase();
        if (!(typeof window === t || !w)) {
          try {
            window.localStorage[w] = L;
            return;
          } catch {
          }
          try {
            window.document.cookie = encodeURIComponent(w) + "=" + L + ";";
          } catch {
          }
        }
      }
      function N() {
        var h;
        if (!(typeof window === t || !w)) {
          try {
            h = window.localStorage[w];
          } catch {
          }
          if (typeof h === t)
            try {
              var L = window.document.cookie, I = L.indexOf(
                encodeURIComponent(w) + "="
              );
              I !== -1 && (h = /^([^;]+)/.exec(L.slice(I))[1]);
            } catch {
            }
          return f.levels[h] === void 0 && (h = void 0), h;
        }
      }
      function U() {
        if (!(typeof window === t || !w)) {
          try {
            window.localStorage.removeItem(w);
            return;
          } catch {
          }
          try {
            window.document.cookie = encodeURIComponent(w) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
          } catch {
          }
        }
      }
      f.name = d, f.levels = {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        SILENT: 5
      }, f.methodFactory = m || a, f.getLevel = function() {
        return F;
      }, f.setLevel = function(h, L) {
        if (typeof h == "string" && f.levels[h.toUpperCase()] !== void 0 && (h = f.levels[h.toUpperCase()]), typeof h == "number" && h >= 0 && h <= f.levels.SILENT) {
          if (F = h, L !== !1 && j(h), g.call(f, h, d), typeof console === t && h < f.levels.SILENT)
            return "No console available for logging";
        } else
          throw "log.setLevel() called with invalid level: " + h;
      }, f.setDefaultLevel = function(h) {
        y = h, N() || f.setLevel(h, !1);
      }, f.resetLevel = function() {
        f.setLevel(y, !1), U();
      }, f.enableAll = function(h) {
        f.setLevel(f.levels.TRACE, h);
      }, f.disableAll = function(h) {
        f.setLevel(f.levels.SILENT, h);
      };
      var T = N();
      T == null && (T = y), f.setLevel(T, !1);
    }
    var B = new v(), k = {};
    B.getLogger = function(y) {
      if (typeof y != "symbol" && typeof y != "string" || y === "")
        throw new TypeError("You must supply a name when creating a logger.");
      var m = k[y];
      return m || (m = k[y] = new v(
        y,
        B.getLevel(),
        B.methodFactory
      )), m;
    };
    var q = typeof window !== t ? window.log : void 0;
    return B.noConflict = function() {
      return typeof window !== t && window.log === B && (window.log = q), B;
    }, B.getLoggers = function() {
      return k;
    }, B.default = B, B;
  });
})(te);
var ge = te.exports;
const W = /* @__PURE__ */ Y(ge);
var re = { exports: {} };
(function(e) {
  (function(r, t) {
    e.exports ? e.exports = t() : r.prefix = t(r);
  })(ee, function(r) {
    var t = function(a) {
      for (var v = 1, B = arguments.length, k; v < B; v++)
        for (k in arguments[v])
          Object.prototype.hasOwnProperty.call(arguments[v], k) && (a[k] = arguments[v][k]);
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
    }, u = function(a, v) {
      if (!a || !a.setLevel)
        throw new TypeError("Argument is not a logger");
      var B = a.methodFactory, k = a.name || "", q = i[k] || i[""] || o;
      function d(y, m, f) {
        var F = B(y, m, f), w = i[f] || i[""], j = w.template.indexOf("%t") !== -1, N = w.template.indexOf("%l") !== -1, U = w.template.indexOf("%n") !== -1;
        return function() {
          for (var T = "", h = arguments.length, L = Array(h), I = 0; I < h; I++)
            L[I] = arguments[I];
          if (k || !i[f]) {
            var G = w.timestampFormatter(/* @__PURE__ */ new Date()), J = w.levelFormatter(y), Z = w.nameFormatter(f);
            w.format ? T += w.format(J, Z, G) : (T += w.template, j && (T = T.replace(/%t/, G)), N && (T = T.replace(/%l/, J)), U && (T = T.replace(/%n/, Z))), L.length && typeof L[0] == "string" ? L[0] = T + " " + L[0] : L.unshift(T);
          }
          F.apply(void 0, L);
        };
      }
      return i[k] || (a.methodFactory = d), v = v || {}, v.template && (v.format = void 0), i[k] = t({}, q, v), a.setLevel(a.getLevel()), n || a.warn(
        "It is necessary to call the function reg() of loglevel-plugin-prefix before calling apply. From the next release, it will throw an error. See more: https://github.com/kutuluk/loglevel-plugin-prefix/blob/master/README.md"
      ), a;
    }, g = {
      reg: s,
      apply: u
    }, c;
    return r && (c = r.prefix, g.noConflict = function() {
      return r.prefix === g && (r.prefix = c), g;
    }), g;
  });
})(re);
var he = re.exports;
const K = /* @__PURE__ */ Y(he);
function fe() {
  const e = Error.prepareStackTrace;
  Error.prepareStackTrace = (t, o) => o;
  const r = new Error().stack.slice(1);
  return Error.prepareStackTrace = e, r;
}
class V {
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
    const t = r.getEnvOrDefault(D.LOG_LEVEL_KEY, S.LOG_LEVEL_INFO), o = V.stringToEnumValue(S, t.toUpperCase());
    return o || console.warn(
      "[zhi-log] LOG_LEVEL is invalid in you .env file.It must be either debug, info, warn or error, fallback to default info level"
    ), o;
  }
  /**
   * 获取默认日志
   */
  static getEnvLogger(r) {
    return r ? r.getEnv(D.LOG_PREFIX_KEY) : void 0;
  }
}
var z = { exports: {} }, M = { exports: {} }, X;
function pe() {
  return X || (X = 1, function(e) {
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
  }(M)), M.exports;
}
const de = (e) => e !== null && typeof e == "object" && !Array.isArray(e), be = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g, ye = () => typeof process < "u" ? process.env.FORCE_COLOR !== "0" : !1, ne = () => {
  const e = {
    enabled: ye(),
    visible: !0,
    styles: {},
    keys: {}
  }, r = (i) => {
    let s = i.open = `\x1B[${i.codes[0]}m`, u = i.close = `\x1B[${i.codes[1]}m`, g = i.regex = new RegExp(`\\u001b\\[${i.codes[1]}m`, "g");
    return i.wrap = (c, a) => {
      c.includes(u) && (c = c.replace(g, u + s));
      let v = s + c + u;
      return a ? v.replace(/\r*\n/g, `${u}$&${s}`) : v;
    }, i;
  }, t = (i, s, u) => typeof i == "function" ? i(s) : i.wrap(s, u), o = (i, s) => {
    if (i === "" || i == null)
      return "";
    if (e.enabled === !1)
      return i;
    if (e.visible === !1)
      return "";
    let u = "" + i, g = u.includes(`
`), c = s.length;
    for (c > 0 && s.includes("unstyle") && (s = [.../* @__PURE__ */ new Set(["unstyle", ...s])].reverse()); c-- > 0; )
      u = t(e.styles[s[c]], u, g);
    return u;
  }, n = (i, s, u) => {
    e.styles[i] = r({ name: i, codes: s }), (e.keys[u] || (e.keys[u] = [])).push(i), Reflect.defineProperty(e, i, {
      configurable: !0,
      enumerable: !0,
      set(c) {
        e.alias(i, c);
      },
      get() {
        let c = (a) => o(a, c.stack);
        return Reflect.setPrototypeOf(c, e), c.stack = this.stack ? this.stack.concat(i) : [i], c;
      }
    });
  };
  return n("reset", [0, 0], "modifier"), n("bold", [1, 22], "modifier"), n("dim", [2, 22], "modifier"), n("italic", [3, 23], "modifier"), n("underline", [4, 24], "modifier"), n("inverse", [7, 27], "modifier"), n("hidden", [8, 28], "modifier"), n("strikethrough", [9, 29], "modifier"), n("black", [30, 39], "color"), n("red", [31, 39], "color"), n("green", [32, 39], "color"), n("yellow", [33, 39], "color"), n("blue", [34, 39], "color"), n("magenta", [35, 39], "color"), n("cyan", [36, 39], "color"), n("white", [37, 39], "color"), n("gray", [90, 39], "color"), n("grey", [90, 39], "color"), n("bgBlack", [40, 49], "bg"), n("bgRed", [41, 49], "bg"), n("bgGreen", [42, 49], "bg"), n("bgYellow", [43, 49], "bg"), n("bgBlue", [44, 49], "bg"), n("bgMagenta", [45, 49], "bg"), n("bgCyan", [46, 49], "bg"), n("bgWhite", [47, 49], "bg"), n("blackBright", [90, 39], "bright"), n("redBright", [91, 39], "bright"), n("greenBright", [92, 39], "bright"), n("yellowBright", [93, 39], "bright"), n("blueBright", [94, 39], "bright"), n("magentaBright", [95, 39], "bright"), n("cyanBright", [96, 39], "bright"), n("whiteBright", [97, 39], "bright"), n("bgBlackBright", [100, 49], "bgBright"), n("bgRedBright", [101, 49], "bgBright"), n("bgGreenBright", [102, 49], "bgBright"), n("bgYellowBright", [103, 49], "bgBright"), n("bgBlueBright", [104, 49], "bgBright"), n("bgMagentaBright", [105, 49], "bgBright"), n("bgCyanBright", [106, 49], "bgBright"), n("bgWhiteBright", [107, 49], "bgBright"), e.ansiRegex = be, e.hasColor = e.hasAnsi = (i) => (e.ansiRegex.lastIndex = 0, typeof i == "string" && i !== "" && e.ansiRegex.test(i)), e.alias = (i, s) => {
    let u = typeof s == "string" ? e[s] : s;
    if (typeof u != "function")
      throw new TypeError("Expected alias to be the name of an existing color (string) or a function");
    u.stack || (Reflect.defineProperty(u, "name", { value: i }), e.styles[i] = u, u.stack = [i]), Reflect.defineProperty(e, i, {
      configurable: !0,
      enumerable: !0,
      set(g) {
        e.alias(i, g);
      },
      get() {
        let g = (c) => o(c, g.stack);
        return Reflect.setPrototypeOf(g, e), g.stack = this.stack ? this.stack.concat(u.stack) : u.stack, g;
      }
    });
  }, e.theme = (i) => {
    if (!de(i))
      throw new TypeError("Expected theme to be an object");
    for (let s of Object.keys(i))
      e.alias(s, i[s]);
    return e;
  }, e.alias("unstyle", (i) => typeof i == "string" && i !== "" ? (e.ansiRegex.lastIndex = 0, i.replace(e.ansiRegex, "")) : ""), e.alias("noop", (i) => i), e.none = e.clear = e.noop, e.stripColor = e.unstyle, e.symbols = pe(), e.define = n, e;
};
z.exports = ne();
z.exports.create = ne;
var we = z.exports;
const _ = /* @__PURE__ */ Y(we);
let $, ie, oe, ae, se = !0;
typeof process < "u" && ({ FORCE_COLOR: $, NODE_DISABLE_COLORS: ie, NO_COLOR: oe, TERM: ae } = process.env || {}, se = process.stdout && process.stdout.isTTY);
const l = {
  enabled: !ie && oe == null && ae !== "dumb" && ($ != null && $ !== "0" || se),
  // modifiers
  reset: b(0, 0),
  bold: b(1, 22),
  dim: b(2, 22),
  italic: b(3, 23),
  underline: b(4, 24),
  inverse: b(7, 27),
  hidden: b(8, 28),
  strikethrough: b(9, 29),
  // colors
  black: b(30, 39),
  red: b(31, 39),
  green: b(32, 39),
  yellow: b(33, 39),
  blue: b(34, 39),
  magenta: b(35, 39),
  cyan: b(36, 39),
  white: b(37, 39),
  gray: b(90, 39),
  grey: b(90, 39),
  // background colors
  bgBlack: b(40, 49),
  bgRed: b(41, 49),
  bgGreen: b(42, 49),
  bgYellow: b(43, 49),
  bgBlue: b(44, 49),
  bgMagenta: b(45, 49),
  bgCyan: b(46, 49),
  bgWhite: b(47, 49)
};
function H(e, r) {
  let t = 0, o, n = "", i = "";
  for (; t < e.length; t++)
    o = e[t], n += o.open, i += o.close, ~r.indexOf(o.close) && (r = r.replace(o.rgx, o.close + o.open));
  return n + r + i;
}
function me(e, r) {
  let t = { has: e, keys: r };
  return t.reset = l.reset.bind(t), t.bold = l.bold.bind(t), t.dim = l.dim.bind(t), t.italic = l.italic.bind(t), t.underline = l.underline.bind(t), t.inverse = l.inverse.bind(t), t.hidden = l.hidden.bind(t), t.strikethrough = l.strikethrough.bind(t), t.black = l.black.bind(t), t.red = l.red.bind(t), t.green = l.green.bind(t), t.yellow = l.yellow.bind(t), t.blue = l.blue.bind(t), t.magenta = l.magenta.bind(t), t.cyan = l.cyan.bind(t), t.white = l.white.bind(t), t.gray = l.gray.bind(t), t.grey = l.grey.bind(t), t.bgBlack = l.bgBlack.bind(t), t.bgRed = l.bgRed.bind(t), t.bgGreen = l.bgGreen.bind(t), t.bgYellow = l.bgYellow.bind(t), t.bgBlue = l.bgBlue.bind(t), t.bgMagenta = l.bgMagenta.bind(t), t.bgCyan = l.bgCyan.bind(t), t.bgWhite = l.bgWhite.bind(t), t;
}
function b(e, r) {
  let t = {
    open: `\x1B[${e}m`,
    close: `\x1B[${r}m`,
    rgx: new RegExp(`\\x1b\\[${r}m`, "g")
  };
  return function(o) {
    return this !== void 0 && this.has !== void 0 ? (~this.has.indexOf(e) || (this.has.push(e), this.keys.push(t)), o === void 0 ? this : l.enabled ? H(this.keys, o + "") : o + "") : o === void 0 ? me([e], [t]) : l.enabled ? H([t], o + "") : o + "";
  };
}
var ve = Object.defineProperty, Ee = (e, r, t) => r in e ? ve(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, E = (e, r, t) => (Ee(e, typeof r != "symbol" ? r + "" : r, t), t);
const x = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return x.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let p = x;
E(p, "isNode", typeof process < "u"), /**
* 是否在浏览器环境
*/
E(p, "isInBrowser", typeof window < "u"), /**
* 浏览器路径分隔符
*/
E(p, "BrowserSeperator", "/"), /**
* 是否是Electron环境
*/
E(p, "isElectron", () => !x.isInBrowser || !window.navigator || !window.navigator.userAgent ? !1 : /Electron/.test(window.navigator.userAgent)), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
E(p, "hasNodeEnv", () => x.isElectron() || x.isNode), /**
* 获取url参数
*
* @param sParam - 参数
*/
E(p, "getQueryString", (e) => {
  if (!x.isInBrowser)
    return "";
  const r = window.location.search.substring(1).split("&");
  for (let t = 0; t < r.length; t++) {
    const o = r[t].split("=");
    if (o[0] === e)
      return o[1];
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
E(p, "replaceUrlParam", (e, r, t) => {
  t == null && (t = "");
  const o = new RegExp("\\b(" + r + "=).*?(&|#|$)");
  if (e.search(o) >= 0)
    return e.replace(o, "$1" + t + "$2");
  const [n, i] = e.split("#"), [s, u] = n.split("?"), g = new URLSearchParams(u);
  g.set(r, t);
  const c = g.toString(), a = s + (c ? "?" + c : "");
  return i ? a + "#" + i : a;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
E(p, "setUrlParameter", (e, r, t) => {
  if (e.includes(r))
    return x.replaceUrlParam(e, r, t);
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
E(p, "reloadTabPage", (e, r = 200) => {
  setTimeout(function() {
    if (x.isInBrowser) {
      const t = window.location.href;
      window.location.href = x.setUrlParameter(t, "tab", e);
    }
  }, r);
}), /**
* 刷新当前tab页面
*/
E(p, "reloadPage", () => {
  setTimeout(function() {
    x.isInBrowser && window.location.reload();
  }, 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
*/
E(p, "reloadPageWithMessageCallback", (e, r) => {
  r && r(e), setTimeout(function() {
    x.isInBrowser && window.location.reload();
  }, 200);
});
var P = /* @__PURE__ */ ((e) => (e.BasePathType_Appearance = "Appearance", e.BasePathType_Data = "Data", e.BasePathType_Themes = "Themes", e.BasePathType_ZhiTheme = "ZhiTheme", e.BasePathType_None = "None", e))(P || {});
const R = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return p.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : !1;
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
      case P.BasePathType_Appearance:
        t = this.browserJoinPath(this.siyuanAppearanceRelativePath(), e);
        break;
      case P.BasePathType_Data:
        t = this.browserJoinPath(this.siyuanDataRelativePath(), e);
        break;
      case P.BasePathType_Themes:
        t = this.browserJoinPath(this.siyuanThemeRelativePath(), e);
        break;
      case P.BasePathType_ZhiTheme:
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
    return await this.importJs(e, P.BasePathType_ZhiTheme);
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
    if (p.hasNodeEnv()) {
      const r = this.requireLib("path");
      if (r)
        return r.join(...e);
    }
    return this.browserJoinPath(...e);
  }
  static browserJoinPath(...e) {
    return e.join(p.BrowserSeperator);
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
    if (p.hasNodeEnv())
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
let A = R;
E(A, "isInSiyuanWidget", () => p.isInBrowser ? window.frameElement != null && window.frameElement.parentElement != null && window.frameElement.parentElement.parentElement != null && window.frameElement.parentElement.parentElement.getAttribute("data-node-id") !== "" : !1), /**
* 思源笔记新窗口
*
* @deprecated window.terwer 判断方式已废弃，建议以后打开新窗口注入 window.siyuanNewWin ，这样语义会更容易理解
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
E(A, "isInSiyuanNewWin", () => !p.isInBrowser || !p.isElectron() ? !1 : typeof window.terwer < "u" || typeof window.siyuanNewWin < "u"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
E(A, "requireLib", (e, r = !0, t = P.BasePathType_None) => {
  if (!p.hasNodeEnv())
    throw new Error("require ony works on node env");
  let o = e;
  if (!r)
    switch (t) {
      case P.BasePathType_Appearance:
        o = R.joinPath(R.siyuanAppearancePath(), e);
        break;
      case P.BasePathType_Data:
        o = R.joinPath(R.siyuanDataPath(), e);
        break;
      case P.BasePathType_Themes:
        o = R.joinPath(R.siyuanAppearancePath(), "themes", e);
        break;
      case P.BasePathType_ZhiTheme:
        o = R.joinPath(R.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const n = R.siyuanWindow();
  if (!n)
    return require(o);
  if (typeof n.require < "u")
    return n.require(o);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
E(A, "requireAppearanceLib", (e) => R.requireLib(e, !1, P.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
E(A, "requireDataLib", (e) => R.requireLib(e, !1, P.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
E(A, "requireThemesLib", (e) => R.requireLib(e, !1, P.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
E(A, "requireZhiThemeLib", (e) => R.requireLib(e, !1, P.BasePathType_ZhiTheme));
const O = {
  white: (e) => p.isElectron() ? _.whiteBright(e) : l.white(e),
  gray: (e) => p.isElectron() ? _.gray(e) : l.gray(e),
  blue: (e) => p.isElectron() ? _.blue(e) : l.blue(e),
  green: (e) => p.isElectron() ? _.green(e) : l.green(e),
  yellow: (e) => p.isElectron() ? _.yellow(e) : l.yellow(e),
  red: (e) => p.isElectron() ? _.red(e) : l.red(e),
  bgWhite: (e) => p.isElectron() ? _.bgWhiteBright(e) : l.bgWhite(e),
  bgGrey: (e) => p.isElectron() ? _.bgCyanBright(e) : l.bgCyan(e),
  bgBlue: (e) => p.isElectron() ? _.bgBlueBright(e) : l.bgBlue(e),
  bgGreen: (e) => p.isElectron() ? _.bgGreenBright(e) : l.bgGreen(e),
  bgYellow: (e) => p.isElectron() ? _.bgYellowBright(e) : l.bgYellow(e),
  bgRed: (e) => p.isElectron() ? _.bgRedBright(e) : l.bgRed(e)
};
class Le {
  constructor(r, t, o) {
    C(this, "consoleLogger", "console");
    C(this, "stackSize", 1);
    /**
     * 获取日志记录器
     *
     * @param loggerName - 日志记录器，默认为 console
     * @author terwer
     * @since 1.0.0
     */
    C(this, "getLogger", (r) => {
      let t;
      if (r)
        t = r;
      else {
        const o = this.getCallStack(), n = [], i = [];
        for (let s = 0; s < o.length; s++) {
          const u = o[s], g = u.getFileName() ?? "none";
          if (s > this.stackSize - 1)
            break;
          const c = g + "-" + u.getLineNumber() + ":" + u.getColumnNumber();
          n.push(c);
        }
        i.length > 0 && (t = n.join(" -> "));
      }
      return (!t || t.trim().length === 0) && (t = this.consoleLogger), W.getLogger(t);
    });
    this.stackSize = 1;
    let n;
    r ? n = r : n = V.getEnvLevel(o), n = n ?? S.LOG_LEVEL_INFO, W.setLevel(n);
    const i = (s, u, g, c) => {
      const a = [], v = t ?? V.getEnvLogger(o) ?? "zhi";
      return a.push(O.gray("[") + c(v) + O.gray("]")), a.push(O.gray("[") + O.gray(g.toString()) + O.gray("]")), a.push(c(s.toUpperCase().toString())), a.push(c(u)), a.push(O.gray(":")), a;
    };
    K.reg(W), K.apply(W, {
      format(s, u, g) {
        let c = [];
        const a = u ?? "";
        switch (s) {
          case S.LOG_LEVEL_TRACE:
            c = i(s, a, g, O.gray);
            break;
          case S.LOG_LEVEL_DEBUG:
            c = i(s, a, g, O.blue);
            break;
          case S.LOG_LEVEL_INFO:
            c = i(s, a, g, O.green);
            break;
          case S.LOG_LEVEL_WARN:
            c = i(s, a, g, O.yellow);
            break;
          case S.LOG_LEVEL_ERROR:
            c = i(s, a, g, O.red);
            break;
          default:
            c = i(S.LOG_LEVEL_INFO, a, g, O.green);
            break;
        }
        return c.join(" ");
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
      r = fe();
    } catch {
      r = [];
    }
    return r;
  }
}
class Pe {
  /**
   * 默认日志级别
   *
   * @param level - 可选，未设置默认INFO
   * @param sign - 可选前缀，默认zhi
   * @param env - 可选环境变量实例
   */
  constructor(r, t, o) {
    C(this, "logger");
    this.logger = new Le(r, t, o);
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
class Q extends Pe {
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
class le {
  /**
   * 默认日志记录器
   *
   * @param stackSize - 栈的深度
   * @param env - 环境变量实例
   */
  static defaultLogger(r, t) {
    return le.customLogFactory(void 0, void 0, r).getLogger(void 0, t);
  }
  /**
   * 自定义日志工厂
   *
   * @param level - 级别
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customLogFactory(r, t, o) {
    return new Q(r, t, o);
  }
  /**
   * 自定义日志工厂，自定义前缀
   *
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customSignLogFactory(r, t) {
    return new Q(void 0, r, t);
  }
}
export {
  Pe as AbstractLogFactory,
  Q as CustomLogFactory,
  V as EnvHelper,
  D as LogConstants,
  le as LogFactory,
  S as LogLevelEnum,
  O as crossChalk
};
