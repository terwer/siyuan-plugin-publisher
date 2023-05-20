var bs = Object.defineProperty;
var ys = (e, t, r) => t in e ? bs(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var $e = (e, t, r) => (ys(e, typeof t != "symbol" ? t + "" : t, r), r);
(function(e, t) {
  !e || e.getElementById("livereloadscript") || (t = e.createElement("script"), t.async = 1, t.src = "//" + (self.location.host || "localhost").split(":")[0] + ":35729/livereload.js?snipver=1", t.id = "livereloadscript", e.getElementsByTagName("head")[0].appendChild(t));
})(self.document);
var _s = Object.defineProperty, ws = (e, t, r) => t in e ? _s(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, oe = (e, t, r) => (ws(e, typeof t != "symbol" ? t + "" : t, r), r), ao = /* @__PURE__ */ ((e) => (e[e.PasswordType_Password = 0] = "PasswordType_Password", e[e.PasswordType_Token = 1] = "PasswordType_Token", e))(ao || {});
class vs {
  constructor() {
    oe(this, "home"), oe(this, "apiUrl"), oe(this, "username"), oe(this, "passwordType"), oe(this, "password"), oe(this, "apiStatus"), oe(this, "blogName"), oe(this, "posidKey"), oe(this, "previewUrl"), oe(this, "pageType"), oe(this, "placeholder"), oe(this, "fixTitle"), this.home = "", this.apiUrl = "", this.username = "", this.passwordType = 0, this.password = "", this.apiStatus = !1, this.blogName = "", this.posidKey = "", this.previewUrl = "", this.pageType = 0, this.placeholder = void 0, this.fixTitle = !1;
  }
}
class ks {
  constructor() {
    oe(this, "homePlaceholder"), oe(this, "apiUrlPlaceholder"), oe(this, "usernamePlaceholder"), oe(this, "passwordTypePlaceholder"), oe(this, "passwordPlaceholder"), oe(this, "apiStatusPlaceholder"), oe(this, "blogNamePlaceholder"), oe(this, "posidKeyPlaceholder"), oe(this, "previewUrlPlaceholder"), oe(this, "pageTypePlaceholder"), this.homePlaceholder = "", this.apiUrlPlaceholder = "", this.usernamePlaceholder = "", this.passwordTypePlaceholder = "", this.passwordPlaceholder = "", this.apiStatusPlaceholder = !1, this.blogNamePlaceholder = "", this.posidKeyPlaceholder = "", this.previewUrlPlaceholder = "", this.pageTypePlaceholder = "";
  }
}
var Br = /* @__PURE__ */ ((e) => (e.PostStatusEnum_Publish = "publish", e.PostStatusEnum_Draft = "draft", e.PostStatusEnum_Inherit = "inherit", e))(Br || {});
class _n {
  constructor() {
    oe(this, "postid"), oe(this, "title"), oe(this, "mt_keywords"), oe(this, "link"), oe(this, "permalink"), oe(this, "shortDesc"), oe(this, "description"), oe(this, "mt_excerpt"), oe(this, "wp_slug"), oe(this, "dateCreated"), oe(this, "categories"), oe(this, "mt_text_more"), oe(this, "post_status"), oe(this, "isPublished"), oe(this, "wp_password"), this.postid = "", this.title = "", this.mt_keywords = "", this.permalink = "", this.description = "", this.wp_slug = "", this.dateCreated = /* @__PURE__ */ new Date(), this.categories = [], this.isPublished = !0, this.post_status = Br.PostStatusEnum_Publish, this.wp_password = "";
  }
}
var Es = Object.defineProperty, $s = (e, t, r) => t in e ? Es(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, Te = (e, t, r) => ($s(e, typeof t != "symbol" ? t + "" : t, r), r), no = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function oo(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var la = { exports: {} }, so = {}, rt = {}, Ht = {}, br = {}, ie = {}, fr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(T) {
      if (super(), !e.IDENTIFIER.test(T))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = T;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class a extends t {
    constructor(T) {
      super(), this._items = typeof T == "string" ? [T] : T;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const T = this._items[0];
      return T === "" || T === '""';
    }
    get str() {
      var T;
      return (T = this._str) !== null && T !== void 0 ? T : this._str = this._items.reduce((R, n) => `${R}${n}`, "");
    }
    get names() {
      var T;
      return (T = this._names) !== null && T !== void 0 ? T : this._names = this._items.reduce((R, n) => (n instanceof r && (R[n.str] = (R[n.str] || 0) + 1), R), {});
    }
  }
  e._Code = a, e.nil = new a("");
  function s(v, ...T) {
    const R = [v[0]];
    let n = 0;
    for (; n < T.length; )
      b(R, T[n]), R.push(v[++n]);
    return new a(R);
  }
  e._ = s;
  const l = new a("+");
  function d(v, ...T) {
    const R = [A(v[0])];
    let n = 0;
    for (; n < T.length; )
      R.push(l), b(R, T[n]), R.push(l, A(v[++n]));
    return _(R), new a(R);
  }
  e.str = d;
  function b(v, T) {
    T instanceof a ? v.push(...T._items) : T instanceof r ? v.push(T) : v.push(k(T));
  }
  e.addCodeArg = b;
  function _(v) {
    let T = 1;
    for (; T < v.length - 1; ) {
      if (v[T] === l) {
        const R = y(v[T - 1], v[T + 1]);
        if (R !== void 0) {
          v.splice(T - 1, 3, R);
          continue;
        }
        v[T++] = "+";
      }
      T++;
    }
  }
  function y(v, T) {
    if (T === '""')
      return v;
    if (v === '""')
      return T;
    if (typeof v == "string")
      return T instanceof r || v[v.length - 1] !== '"' ? void 0 : typeof T != "string" ? `${v.slice(0, -1)}${T}"` : T[0] === '"' ? v.slice(0, -1) + T.slice(1) : void 0;
    if (typeof T == "string" && T[0] === '"' && !(v instanceof r))
      return `"${v}${T.slice(1)}`;
  }
  function m(v, T) {
    return T.emptyStr() ? v : v.emptyStr() ? T : d`${v}${T}`;
  }
  e.strConcat = m;
  function k(v) {
    return typeof v == "number" || typeof v == "boolean" || v === null ? v : A(Array.isArray(v) ? v.join(",") : v);
  }
  function N(v) {
    return new a(A(v));
  }
  e.stringify = N;
  function A(v) {
    return JSON.stringify(v).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = A;
  function j(v) {
    return typeof v == "string" && e.IDENTIFIER.test(v) ? new a(`.${v}`) : s`[${v}]`;
  }
  e.getProperty = j;
  function C(v) {
    if (typeof v == "string" && e.IDENTIFIER.test(v))
      return new a(`${v}`);
    throw new Error(`CodeGen: invalid export name: ${v}, use explicit $id name mapping`);
  }
  e.getEsmExportName = C;
  function x(v) {
    return new a(v.toString());
  }
  e.regexpCode = x;
})(fr);
var ca = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = fr;
  class r extends Error {
    constructor(y) {
      super(`CodeGen: "code" for ${y} not defined`), this.value = y.value;
    }
  }
  var a;
  (function(_) {
    _[_.Started = 0] = "Started", _[_.Completed = 1] = "Completed";
  })(a = e.UsedValueState || (e.UsedValueState = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: y, parent: m } = {}) {
      this._names = {}, this._prefixes = y, this._parent = m;
    }
    toName(y) {
      return y instanceof t.Name ? y : this.name(y);
    }
    name(y) {
      return new t.Name(this._newName(y));
    }
    _newName(y) {
      const m = this._names[y] || this._nameGroup(y);
      return `${y}${m.index++}`;
    }
    _nameGroup(y) {
      var m, k;
      if (!((k = (m = this._parent) === null || m === void 0 ? void 0 : m._prefixes) === null || k === void 0) && k.has(y) || this._prefixes && !this._prefixes.has(y))
        throw new Error(`CodeGen: prefix "${y}" is not allowed in this scope`);
      return this._names[y] = { prefix: y, index: 0 };
    }
  }
  e.Scope = s;
  class l extends t.Name {
    constructor(y, m) {
      super(m), this.prefix = y;
    }
    setValue(y, { property: m, itemIndex: k }) {
      this.value = y, this.scopePath = (0, t._)`.${new t.Name(m)}[${k}]`;
    }
  }
  e.ValueScopeName = l;
  const d = (0, t._)`\n`;
  class b extends s {
    constructor(y) {
      super(y), this._values = {}, this._scope = y.scope, this.opts = { ...y, _n: y.lines ? d : t.nil };
    }
    get() {
      return this._scope;
    }
    name(y) {
      return new l(y, this._newName(y));
    }
    value(y, m) {
      var k;
      if (m.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const N = this.toName(y), { prefix: A } = N, j = (k = m.key) !== null && k !== void 0 ? k : m.ref;
      let C = this._values[A];
      if (C) {
        const T = C.get(j);
        if (T)
          return T;
      } else
        C = this._values[A] = /* @__PURE__ */ new Map();
      C.set(j, N);
      const x = this._scope[A] || (this._scope[A] = []), v = x.length;
      return x[v] = m.ref, N.setValue(m, { property: A, itemIndex: v }), N;
    }
    getValue(y, m) {
      const k = this._values[y];
      if (k)
        return k.get(m);
    }
    scopeRefs(y, m = this._values) {
      return this._reduceValues(m, (k) => {
        if (k.scopePath === void 0)
          throw new Error(`CodeGen: name "${k}" has no value`);
        return (0, t._)`${y}${k.scopePath}`;
      });
    }
    scopeCode(y = this._values, m, k) {
      return this._reduceValues(y, (N) => {
        if (N.value === void 0)
          throw new Error(`CodeGen: name "${N}" has no value`);
        return N.value.code;
      }, m, k);
    }
    _reduceValues(y, m, k = {}, N) {
      let A = t.nil;
      for (const j in y) {
        const C = y[j];
        if (!C)
          continue;
        const x = k[j] = k[j] || /* @__PURE__ */ new Map();
        C.forEach((v) => {
          if (x.has(v))
            return;
          x.set(v, a.Started);
          let T = m(v);
          if (T) {
            const R = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            A = (0, t._)`${A}${R} ${v} = ${T};${this.opts._n}`;
          } else if (T = N == null ? void 0 : N(v))
            A = (0, t._)`${A}${T}${this.opts._n}`;
          else
            throw new r(v);
          x.set(v, a.Completed);
        });
      }
      return A;
    }
  }
  e.ValueScope = b;
})(ca);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = fr, r = ca;
  var a = fr;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return a._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return a.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return a.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return a.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return a.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return a.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return a.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return a.Name;
  } });
  var s = ca;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class l {
    optimizeNodes() {
      return this;
    }
    optimizeNames(h, $) {
      return this;
    }
  }
  class d extends l {
    constructor(h, $, I) {
      super(), this.varKind = h, this.name = $, this.rhs = I;
    }
    render({ es5: h, _n: $ }) {
      const I = h ? r.varKinds.var : this.varKind, H = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${I} ${this.name}${H};` + $;
    }
    optimizeNames(h, $) {
      if (h[this.name.str])
        return this.rhs && (this.rhs = B(this.rhs, h, $)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class b extends l {
    constructor(h, $, I) {
      super(), this.lhs = h, this.rhs = $, this.sideEffects = I;
    }
    render({ _n: h }) {
      return `${this.lhs} = ${this.rhs};` + h;
    }
    optimizeNames(h, $) {
      if (!(this.lhs instanceof t.Name && !h[this.lhs.str] && !this.sideEffects))
        return this.rhs = B(this.rhs, h, $), this;
    }
    get names() {
      const h = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return q(h, this.rhs);
    }
  }
  class _ extends b {
    constructor(h, $, I, H) {
      super(h, I, H), this.op = $;
    }
    render({ _n: h }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + h;
    }
  }
  class y extends l {
    constructor(h) {
      super(), this.label = h, this.names = {};
    }
    render({ _n: h }) {
      return `${this.label}:` + h;
    }
  }
  class m extends l {
    constructor(h) {
      super(), this.label = h, this.names = {};
    }
    render({ _n: h }) {
      return `break${this.label ? ` ${this.label}` : ""};` + h;
    }
  }
  class k extends l {
    constructor(h) {
      super(), this.error = h;
    }
    render({ _n: h }) {
      return `throw ${this.error};` + h;
    }
    get names() {
      return this.error.names;
    }
  }
  class N extends l {
    constructor(h) {
      super(), this.code = h;
    }
    render({ _n: h }) {
      return `${this.code};` + h;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(h, $) {
      return this.code = B(this.code, h, $), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class A extends l {
    constructor(h = []) {
      super(), this.nodes = h;
    }
    render(h) {
      return this.nodes.reduce(($, I) => $ + I.render(h), "");
    }
    optimizeNodes() {
      const { nodes: h } = this;
      let $ = h.length;
      for (; $--; ) {
        const I = h[$].optimizeNodes();
        Array.isArray(I) ? h.splice($, 1, ...I) : I ? h[$] = I : h.splice($, 1);
      }
      return h.length > 0 ? this : void 0;
    }
    optimizeNames(h, $) {
      const { nodes: I } = this;
      let H = I.length;
      for (; H--; ) {
        const K = I[H];
        K.optimizeNames(h, $) || (G(h, K.names), I.splice(H, 1));
      }
      return I.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((h, $) => z(h, $.names), {});
    }
  }
  class j extends A {
    render(h) {
      return "{" + h._n + super.render(h) + "}" + h._n;
    }
  }
  class C extends A {
  }
  class x extends j {
  }
  x.kind = "else";
  class v extends j {
    constructor(h, $) {
      super($), this.condition = h;
    }
    render(h) {
      let $ = `if(${this.condition})` + super.render(h);
      return this.else && ($ += "else " + this.else.render(h)), $;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const h = this.condition;
      if (h === !0)
        return this.nodes;
      let $ = this.else;
      if ($) {
        const I = $.optimizeNodes();
        $ = this.else = Array.isArray(I) ? new x(I) : I;
      }
      if ($)
        return h === !1 ? $ instanceof v ? $ : $.nodes : this.nodes.length ? this : new v(w(h), $ instanceof v ? [$] : $.nodes);
      if (!(h === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(h, $) {
      var I;
      if (this.else = (I = this.else) === null || I === void 0 ? void 0 : I.optimizeNames(h, $), !!(super.optimizeNames(h, $) || this.else))
        return this.condition = B(this.condition, h, $), this;
    }
    get names() {
      const h = super.names;
      return q(h, this.condition), this.else && z(h, this.else.names), h;
    }
  }
  v.kind = "if";
  class T extends j {
  }
  T.kind = "for";
  class R extends T {
    constructor(h) {
      super(), this.iteration = h;
    }
    render(h) {
      return `for(${this.iteration})` + super.render(h);
    }
    optimizeNames(h, $) {
      if (super.optimizeNames(h, $))
        return this.iteration = B(this.iteration, h, $), this;
    }
    get names() {
      return z(super.names, this.iteration.names);
    }
  }
  class n extends T {
    constructor(h, $, I, H) {
      super(), this.varKind = h, this.name = $, this.from = I, this.to = H;
    }
    render(h) {
      const $ = h.es5 ? r.varKinds.var : this.varKind, { name: I, from: H, to: K } = this;
      return `for(${$} ${I}=${H}; ${I}<${K}; ${I}++)` + super.render(h);
    }
    get names() {
      const h = q(super.names, this.from);
      return q(h, this.to);
    }
  }
  class i extends T {
    constructor(h, $, I, H) {
      super(), this.loop = h, this.varKind = $, this.name = I, this.iterable = H;
    }
    render(h) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(h);
    }
    optimizeNames(h, $) {
      if (super.optimizeNames(h, $))
        return this.iterable = B(this.iterable, h, $), this;
    }
    get names() {
      return z(super.names, this.iterable.names);
    }
  }
  class o extends j {
    constructor(h, $, I) {
      super(), this.name = h, this.args = $, this.async = I;
    }
    render(h) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(h);
    }
  }
  o.kind = "func";
  class c extends A {
    render(h) {
      return "return " + super.render(h);
    }
  }
  c.kind = "return";
  class u extends j {
    render(h) {
      let $ = "try" + super.render(h);
      return this.catch && ($ += this.catch.render(h)), this.finally && ($ += this.finally.render(h)), $;
    }
    optimizeNodes() {
      var h, $;
      return super.optimizeNodes(), (h = this.catch) === null || h === void 0 || h.optimizeNodes(), ($ = this.finally) === null || $ === void 0 || $.optimizeNodes(), this;
    }
    optimizeNames(h, $) {
      var I, H;
      return super.optimizeNames(h, $), (I = this.catch) === null || I === void 0 || I.optimizeNames(h, $), (H = this.finally) === null || H === void 0 || H.optimizeNames(h, $), this;
    }
    get names() {
      const h = super.names;
      return this.catch && z(h, this.catch.names), this.finally && z(h, this.finally.names), h;
    }
  }
  class f extends j {
    constructor(h) {
      super(), this.error = h;
    }
    render(h) {
      return `catch(${this.error})` + super.render(h);
    }
  }
  f.kind = "catch";
  class g extends j {
    render(h) {
      return "finally" + super.render(h);
    }
  }
  g.kind = "finally";
  class O {
    constructor(h, $ = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...$, _n: $.lines ? `
` : "" }, this._extScope = h, this._scope = new r.Scope({ parent: h }), this._nodes = [new C()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(h) {
      return this._scope.name(h);
    }
    // reserves unique name in the external scope
    scopeName(h) {
      return this._extScope.name(h);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(h, $) {
      const I = this._extScope.value(h, $);
      return (this._values[I.prefix] || (this._values[I.prefix] = /* @__PURE__ */ new Set())).add(I), I;
    }
    getScopeValue(h, $) {
      return this._extScope.getValue(h, $);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(h) {
      return this._extScope.scopeRefs(h, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(h, $, I, H) {
      const K = this._scope.toName($);
      return I !== void 0 && H && (this._constants[K.str] = I), this._leafNode(new d(h, K, I)), K;
    }
    // `const` declaration (`var` in es5 mode)
    const(h, $, I) {
      return this._def(r.varKinds.const, h, $, I);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(h, $, I) {
      return this._def(r.varKinds.let, h, $, I);
    }
    // `var` declaration with optional assignment
    var(h, $, I) {
      return this._def(r.varKinds.var, h, $, I);
    }
    // assignment code
    assign(h, $, I) {
      return this._leafNode(new b(h, $, I));
    }
    // `+=` code
    add(h, $) {
      return this._leafNode(new _(h, e.operators.ADD, $));
    }
    // appends passed SafeExpr to code or executes Block
    code(h) {
      return typeof h == "function" ? h() : h !== t.nil && this._leafNode(new N(h)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...h) {
      const $ = ["{"];
      for (const [I, H] of h)
        $.length > 1 && $.push(","), $.push(I), (I !== H || this.opts.es5) && ($.push(":"), (0, t.addCodeArg)($, H));
      return $.push("}"), new t._Code($);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(h, $, I) {
      if (this._blockNode(new v(h)), $ && I)
        this.code($).else().code(I).endIf();
      else if ($)
        this.code($).endIf();
      else if (I)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(h) {
      return this._elseNode(new v(h));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new x());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(v, x);
    }
    _for(h, $) {
      return this._blockNode(h), $ && this.code($).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(h, $) {
      return this._for(new R(h), $);
    }
    // `for` statement for a range of values
    forRange(h, $, I, H, K = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const te = this._scope.toName(h);
      return this._for(new n(K, te, $, I), () => H(te));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(h, $, I, H = r.varKinds.const) {
      const K = this._scope.toName(h);
      if (this.opts.es5) {
        const te = $ instanceof t.Name ? $ : this.var("_arr", $);
        return this.forRange("_i", 0, (0, t._)`${te}.length`, (ne) => {
          this.var(K, (0, t._)`${te}[${ne}]`), I(K);
        });
      }
      return this._for(new i("of", H, K, $), () => I(K));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(h, $, I, H = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(h, (0, t._)`Object.keys(${$})`, I);
      const K = this._scope.toName(h);
      return this._for(new i("in", H, K, $), () => I(K));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(T);
    }
    // `label` statement
    label(h) {
      return this._leafNode(new y(h));
    }
    // `break` statement
    break(h) {
      return this._leafNode(new m(h));
    }
    // `return` statement
    return(h) {
      const $ = new c();
      if (this._blockNode($), this.code(h), $.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(c);
    }
    // `try` statement
    try(h, $, I) {
      if (!$ && !I)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const H = new u();
      if (this._blockNode(H), this.code(h), $) {
        const K = this.name("e");
        this._currNode = H.catch = new f(K), $(K);
      }
      return I && (this._currNode = H.finally = new g(), this.code(I)), this._endBlockNode(f, g);
    }
    // `throw` statement
    throw(h) {
      return this._leafNode(new k(h));
    }
    // start self-balancing block
    block(h, $) {
      return this._blockStarts.push(this._nodes.length), h && this.code(h).endBlock($), this;
    }
    // end the current self-balancing block
    endBlock(h) {
      const $ = this._blockStarts.pop();
      if ($ === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const I = this._nodes.length - $;
      if (I < 0 || h !== void 0 && I !== h)
        throw new Error(`CodeGen: wrong number of nodes: ${I} vs ${h} expected`);
      return this._nodes.length = $, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(h, $ = t.nil, I, H) {
      return this._blockNode(new o(h, $, I)), H && this.code(H).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(o);
    }
    optimize(h = 1) {
      for (; h-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(h) {
      return this._currNode.nodes.push(h), this;
    }
    _blockNode(h) {
      this._currNode.nodes.push(h), this._nodes.push(h);
    }
    _endBlockNode(h, $) {
      const I = this._currNode;
      if (I instanceof h || $ && I instanceof $)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${$ ? `${h.kind}/${$.kind}` : h.kind}"`);
    }
    _elseNode(h) {
      const $ = this._currNode;
      if (!($ instanceof v))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = $.else = h, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const h = this._nodes;
      return h[h.length - 1];
    }
    set _currNode(h) {
      const $ = this._nodes;
      $[$.length - 1] = h;
    }
  }
  e.CodeGen = O;
  function z(L, h) {
    for (const $ in h)
      L[$] = (L[$] || 0) + (h[$] || 0);
    return L;
  }
  function q(L, h) {
    return h instanceof t._CodeOrName ? z(L, h.names) : L;
  }
  function B(L, h, $) {
    if (L instanceof t.Name)
      return I(L);
    if (!H(L))
      return L;
    return new t._Code(L._items.reduce((K, te) => (te instanceof t.Name && (te = I(te)), te instanceof t._Code ? K.push(...te._items) : K.push(te), K), []));
    function I(K) {
      const te = $[K.str];
      return te === void 0 || h[K.str] !== 1 ? K : (delete h[K.str], te);
    }
    function H(K) {
      return K instanceof t._Code && K._items.some((te) => te instanceof t.Name && h[te.str] === 1 && $[te.str] !== void 0);
    }
  }
  function G(L, h) {
    for (const $ in h)
      L[$] = (L[$] || 0) - (h[$] || 0);
  }
  function w(L) {
    return typeof L == "boolean" || typeof L == "number" || L === null ? !L : (0, t._)`!${F(L)}`;
  }
  e.not = w;
  const U = P(e.operators.AND);
  function W(...L) {
    return L.reduce(U);
  }
  e.and = W;
  const J = P(e.operators.OR);
  function V(...L) {
    return L.reduce(J);
  }
  e.or = V;
  function P(L) {
    return (h, $) => h === t.nil ? $ : $ === t.nil ? h : (0, t._)`${F(h)} ${L} ${F($)}`;
  }
  function F(L) {
    return L instanceof t.Name ? L : (0, t._)`(${L})`;
  }
})(ie);
var ce = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.checkStrictMode = e.getErrorPath = e.Type = e.useFunc = e.setEvaluated = e.evaluatedPropsToName = e.mergeEvaluated = e.eachItem = e.unescapeJsonPointer = e.escapeJsonPointer = e.escapeFragment = e.unescapeFragment = e.schemaRefOrVal = e.schemaHasRulesButRef = e.schemaHasRules = e.checkUnknownRules = e.alwaysValidSchema = e.toHash = void 0;
  const t = ie, r = fr;
  function a(o) {
    const c = {};
    for (const u of o)
      c[u] = !0;
    return c;
  }
  e.toHash = a;
  function s(o, c) {
    return typeof c == "boolean" ? c : Object.keys(c).length === 0 ? !0 : (l(o, c), !d(c, o.self.RULES.all));
  }
  e.alwaysValidSchema = s;
  function l(o, c = o.schema) {
    const { opts: u, self: f } = o;
    if (!u.strictSchema || typeof c == "boolean")
      return;
    const g = f.RULES.keywords;
    for (const O in c)
      g[O] || i(o, `unknown keyword: "${O}"`);
  }
  e.checkUnknownRules = l;
  function d(o, c) {
    if (typeof o == "boolean")
      return !o;
    for (const u in o)
      if (c[u])
        return !0;
    return !1;
  }
  e.schemaHasRules = d;
  function b(o, c) {
    if (typeof o == "boolean")
      return !o;
    for (const u in o)
      if (u !== "$ref" && c.all[u])
        return !0;
    return !1;
  }
  e.schemaHasRulesButRef = b;
  function _({ topSchemaRef: o, schemaPath: c }, u, f, g) {
    if (!g) {
      if (typeof u == "number" || typeof u == "boolean")
        return u;
      if (typeof u == "string")
        return (0, t._)`${u}`;
    }
    return (0, t._)`${o}${c}${(0, t.getProperty)(f)}`;
  }
  e.schemaRefOrVal = _;
  function y(o) {
    return N(decodeURIComponent(o));
  }
  e.unescapeFragment = y;
  function m(o) {
    return encodeURIComponent(k(o));
  }
  e.escapeFragment = m;
  function k(o) {
    return typeof o == "number" ? `${o}` : o.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  e.escapeJsonPointer = k;
  function N(o) {
    return o.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  e.unescapeJsonPointer = N;
  function A(o, c) {
    if (Array.isArray(o))
      for (const u of o)
        c(u);
    else
      c(o);
  }
  e.eachItem = A;
  function j({ mergeNames: o, mergeToName: c, mergeValues: u, resultToName: f }) {
    return (g, O, z, q) => {
      const B = z === void 0 ? O : z instanceof t.Name ? (O instanceof t.Name ? o(g, O, z) : c(g, O, z), z) : O instanceof t.Name ? (c(g, z, O), O) : u(O, z);
      return q === t.Name && !(B instanceof t.Name) ? f(g, B) : B;
    };
  }
  e.mergeEvaluated = {
    props: j({
      mergeNames: (o, c, u) => o.if((0, t._)`${u} !== true && ${c} !== undefined`, () => {
        o.if((0, t._)`${c} === true`, () => o.assign(u, !0), () => o.assign(u, (0, t._)`${u} || {}`).code((0, t._)`Object.assign(${u}, ${c})`));
      }),
      mergeToName: (o, c, u) => o.if((0, t._)`${u} !== true`, () => {
        c === !0 ? o.assign(u, !0) : (o.assign(u, (0, t._)`${u} || {}`), x(o, u, c));
      }),
      mergeValues: (o, c) => o === !0 ? !0 : { ...o, ...c },
      resultToName: C
    }),
    items: j({
      mergeNames: (o, c, u) => o.if((0, t._)`${u} !== true && ${c} !== undefined`, () => o.assign(u, (0, t._)`${c} === true ? true : ${u} > ${c} ? ${u} : ${c}`)),
      mergeToName: (o, c, u) => o.if((0, t._)`${u} !== true`, () => o.assign(u, c === !0 ? !0 : (0, t._)`${u} > ${c} ? ${u} : ${c}`)),
      mergeValues: (o, c) => o === !0 ? !0 : Math.max(o, c),
      resultToName: (o, c) => o.var("items", c)
    })
  };
  function C(o, c) {
    if (c === !0)
      return o.var("props", !0);
    const u = o.var("props", (0, t._)`{}`);
    return c !== void 0 && x(o, u, c), u;
  }
  e.evaluatedPropsToName = C;
  function x(o, c, u) {
    Object.keys(u).forEach((f) => o.assign((0, t._)`${c}${(0, t.getProperty)(f)}`, !0));
  }
  e.setEvaluated = x;
  const v = {};
  function T(o, c) {
    return o.scopeValue("func", {
      ref: c,
      code: v[c.code] || (v[c.code] = new r._Code(c.code))
    });
  }
  e.useFunc = T;
  var R;
  (function(o) {
    o[o.Num = 0] = "Num", o[o.Str = 1] = "Str";
  })(R = e.Type || (e.Type = {}));
  function n(o, c, u) {
    if (o instanceof t.Name) {
      const f = c === R.Num;
      return u ? f ? (0, t._)`"[" + ${o} + "]"` : (0, t._)`"['" + ${o} + "']"` : f ? (0, t._)`"/" + ${o}` : (0, t._)`"/" + ${o}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return u ? (0, t.getProperty)(o).toString() : "/" + k(o);
  }
  e.getErrorPath = n;
  function i(o, c, u = o.opts.strictSchema) {
    if (u) {
      if (c = `strict mode: ${c}`, u === !0)
        throw new Error(c);
      o.self.logger.warn(c);
    }
  }
  e.checkStrictMode = i;
})(ce);
var ct = {};
Object.defineProperty(ct, "__esModule", { value: !0 });
const Oe = ie, Ps = {
  // validation function arguments
  data: new Oe.Name("data"),
  // args passed from referencing schema
  valCxt: new Oe.Name("valCxt"),
  instancePath: new Oe.Name("instancePath"),
  parentData: new Oe.Name("parentData"),
  parentDataProperty: new Oe.Name("parentDataProperty"),
  rootData: new Oe.Name("rootData"),
  dynamicAnchors: new Oe.Name("dynamicAnchors"),
  // function scoped variables
  vErrors: new Oe.Name("vErrors"),
  errors: new Oe.Name("errors"),
  this: new Oe.Name("this"),
  // "globals"
  self: new Oe.Name("self"),
  scope: new Oe.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Oe.Name("json"),
  jsonPos: new Oe.Name("jsonPos"),
  jsonLen: new Oe.Name("jsonLen"),
  jsonPart: new Oe.Name("jsonPart")
};
ct.default = Ps;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = ie, r = ce, a = ct;
  e.keywordError = {
    message: ({ keyword: x }) => (0, t.str)`must pass "${x}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: x, schemaType: v }) => v ? (0, t.str)`"${x}" keyword must be ${v} ($data)` : (0, t.str)`"${x}" keyword is invalid ($data)`
  };
  function s(x, v = e.keywordError, T, R) {
    const { it: n } = x, { gen: i, compositeRule: o, allErrors: c } = n, u = k(x, v, T);
    R ?? (o || c) ? _(i, u) : y(n, (0, t._)`[${u}]`);
  }
  e.reportError = s;
  function l(x, v = e.keywordError, T) {
    const { it: R } = x, { gen: n, compositeRule: i, allErrors: o } = R, c = k(x, v, T);
    _(n, c), i || o || y(R, a.default.vErrors);
  }
  e.reportExtraError = l;
  function d(x, v) {
    x.assign(a.default.errors, v), x.if((0, t._)`${a.default.vErrors} !== null`, () => x.if(v, () => x.assign((0, t._)`${a.default.vErrors}.length`, v), () => x.assign(a.default.vErrors, null)));
  }
  e.resetErrorsCount = d;
  function b({ gen: x, keyword: v, schemaValue: T, data: R, errsCount: n, it: i }) {
    if (n === void 0)
      throw new Error("ajv implementation error");
    const o = x.name("err");
    x.forRange("i", n, a.default.errors, (c) => {
      x.const(o, (0, t._)`${a.default.vErrors}[${c}]`), x.if((0, t._)`${o}.instancePath === undefined`, () => x.assign((0, t._)`${o}.instancePath`, (0, t.strConcat)(a.default.instancePath, i.errorPath))), x.assign((0, t._)`${o}.schemaPath`, (0, t.str)`${i.errSchemaPath}/${v}`), i.opts.verbose && (x.assign((0, t._)`${o}.schema`, T), x.assign((0, t._)`${o}.data`, R));
    });
  }
  e.extendErrors = b;
  function _(x, v) {
    const T = x.const("err", v);
    x.if((0, t._)`${a.default.vErrors} === null`, () => x.assign(a.default.vErrors, (0, t._)`[${T}]`), (0, t._)`${a.default.vErrors}.push(${T})`), x.code((0, t._)`${a.default.errors}++`);
  }
  function y(x, v) {
    const { gen: T, validateName: R, schemaEnv: n } = x;
    n.$async ? T.throw((0, t._)`new ${x.ValidationError}(${v})`) : (T.assign((0, t._)`${R}.errors`, v), T.return(!1));
  }
  const m = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function k(x, v, T) {
    const { createErrors: R } = x.it;
    return R === !1 ? (0, t._)`{}` : N(x, v, T);
  }
  function N(x, v, T = {}) {
    const { gen: R, it: n } = x, i = [
      A(n, T),
      j(x, T)
    ];
    return C(x, v, i), R.object(...i);
  }
  function A({ errorPath: x }, { instancePath: v }) {
    const T = v ? (0, t.str)`${x}${(0, r.getErrorPath)(v, r.Type.Str)}` : x;
    return [a.default.instancePath, (0, t.strConcat)(a.default.instancePath, T)];
  }
  function j({ keyword: x, it: { errSchemaPath: v } }, { schemaPath: T, parentSchema: R }) {
    let n = R ? v : (0, t.str)`${v}/${x}`;
    return T && (n = (0, t.str)`${n}${(0, r.getErrorPath)(T, r.Type.Str)}`), [m.schemaPath, n];
  }
  function C(x, { params: v, message: T }, R) {
    const { keyword: n, data: i, schemaValue: o, it: c } = x, { opts: u, propertyName: f, topSchemaRef: g, schemaPath: O } = c;
    R.push([m.keyword, n], [m.params, typeof v == "function" ? v(x) : v || (0, t._)`{}`]), u.messages && R.push([m.message, typeof T == "function" ? T(x) : T]), u.verbose && R.push([m.schema, o], [m.parentSchema, (0, t._)`${g}${O}`], [a.default.data, i]), f && R.push([m.propertyName, f]);
  }
})(br);
Object.defineProperty(Ht, "__esModule", { value: !0 });
Ht.boolOrEmptySchema = Ht.topBoolOrEmptySchema = void 0;
const Ss = br, Ts = ie, Cs = ct, xs = {
  message: "boolean schema is false"
};
function Os(e) {
  const { gen: t, schema: r, validateName: a } = e;
  r === !1 ? io(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Cs.default.data) : (t.assign((0, Ts._)`${a}.errors`, null), t.return(!0));
}
Ht.topBoolOrEmptySchema = Os;
function Ns(e, t) {
  const { gen: r, schema: a } = e;
  a === !1 ? (r.var(t, !1), io(e)) : r.var(t, !0);
}
Ht.boolOrEmptySchema = Ns;
function io(e, t) {
  const { gen: r, data: a } = e, s = {
    gen: r,
    keyword: "false schema",
    data: a,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, Ss.reportError)(s, xs, void 0, t);
}
var yr = {}, Nt = {};
Object.defineProperty(Nt, "__esModule", { value: !0 });
Nt.getRules = Nt.isJSONType = void 0;
const js = ["string", "number", "integer", "boolean", "null", "object", "array"], Ls = new Set(js);
function As(e) {
  return typeof e == "string" && Ls.has(e);
}
Nt.isJSONType = As;
function Rs() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
Nt.getRules = Rs;
var pt = {};
Object.defineProperty(pt, "__esModule", { value: !0 });
pt.shouldUseRule = pt.shouldUseGroup = pt.schemaHasRulesForType = void 0;
function Is({ schema: e, self: t }, r) {
  const a = t.RULES.types[r];
  return a && a !== !0 && lo(e, a);
}
pt.schemaHasRulesForType = Is;
function lo(e, t) {
  return t.rules.some((r) => co(e, r));
}
pt.shouldUseGroup = lo;
function co(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((a) => e[a] !== void 0));
}
pt.shouldUseRule = co;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.reportTypeError = e.checkDataTypes = e.checkDataType = e.coerceAndCheckDataType = e.getJSONTypes = e.getSchemaTypes = e.DataType = void 0;
  const t = Nt, r = pt, a = br, s = ie, l = ce;
  var d;
  (function(R) {
    R[R.Correct = 0] = "Correct", R[R.Wrong = 1] = "Wrong";
  })(d = e.DataType || (e.DataType = {}));
  function b(R) {
    const n = _(R.type);
    if (n.includes("null")) {
      if (R.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!n.length && R.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      R.nullable === !0 && n.push("null");
    }
    return n;
  }
  e.getSchemaTypes = b;
  function _(R) {
    const n = Array.isArray(R) ? R : R ? [R] : [];
    if (n.every(t.isJSONType))
      return n;
    throw new Error("type must be JSONType or JSONType[]: " + n.join(","));
  }
  e.getJSONTypes = _;
  function y(R, n) {
    const { gen: i, data: o, opts: c } = R, u = k(n, c.coerceTypes), f = n.length > 0 && !(u.length === 0 && n.length === 1 && (0, r.schemaHasRulesForType)(R, n[0]));
    if (f) {
      const g = C(n, o, c.strictNumbers, d.Wrong);
      i.if(g, () => {
        u.length ? N(R, n, u) : v(R);
      });
    }
    return f;
  }
  e.coerceAndCheckDataType = y;
  const m = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function k(R, n) {
    return n ? R.filter((i) => m.has(i) || n === "array" && i === "array") : [];
  }
  function N(R, n, i) {
    const { gen: o, data: c, opts: u } = R, f = o.let("dataType", (0, s._)`typeof ${c}`), g = o.let("coerced", (0, s._)`undefined`);
    u.coerceTypes === "array" && o.if((0, s._)`${f} == 'object' && Array.isArray(${c}) && ${c}.length == 1`, () => o.assign(c, (0, s._)`${c}[0]`).assign(f, (0, s._)`typeof ${c}`).if(C(n, c, u.strictNumbers), () => o.assign(g, c))), o.if((0, s._)`${g} !== undefined`);
    for (const z of i)
      (m.has(z) || z === "array" && u.coerceTypes === "array") && O(z);
    o.else(), v(R), o.endIf(), o.if((0, s._)`${g} !== undefined`, () => {
      o.assign(c, g), A(R, g);
    });
    function O(z) {
      switch (z) {
        case "string":
          o.elseIf((0, s._)`${f} == "number" || ${f} == "boolean"`).assign(g, (0, s._)`"" + ${c}`).elseIf((0, s._)`${c} === null`).assign(g, (0, s._)`""`);
          return;
        case "number":
          o.elseIf((0, s._)`${f} == "boolean" || ${c} === null
              || (${f} == "string" && ${c} && ${c} == +${c})`).assign(g, (0, s._)`+${c}`);
          return;
        case "integer":
          o.elseIf((0, s._)`${f} === "boolean" || ${c} === null
              || (${f} === "string" && ${c} && ${c} == +${c} && !(${c} % 1))`).assign(g, (0, s._)`+${c}`);
          return;
        case "boolean":
          o.elseIf((0, s._)`${c} === "false" || ${c} === 0 || ${c} === null`).assign(g, !1).elseIf((0, s._)`${c} === "true" || ${c} === 1`).assign(g, !0);
          return;
        case "null":
          o.elseIf((0, s._)`${c} === "" || ${c} === 0 || ${c} === false`), o.assign(g, null);
          return;
        case "array":
          o.elseIf((0, s._)`${f} === "string" || ${f} === "number"
              || ${f} === "boolean" || ${c} === null`).assign(g, (0, s._)`[${c}]`);
      }
    }
  }
  function A({ gen: R, parentData: n, parentDataProperty: i }, o) {
    R.if((0, s._)`${n} !== undefined`, () => R.assign((0, s._)`${n}[${i}]`, o));
  }
  function j(R, n, i, o = d.Correct) {
    const c = o === d.Correct ? s.operators.EQ : s.operators.NEQ;
    let u;
    switch (R) {
      case "null":
        return (0, s._)`${n} ${c} null`;
      case "array":
        u = (0, s._)`Array.isArray(${n})`;
        break;
      case "object":
        u = (0, s._)`${n} && typeof ${n} == "object" && !Array.isArray(${n})`;
        break;
      case "integer":
        u = f((0, s._)`!(${n} % 1) && !isNaN(${n})`);
        break;
      case "number":
        u = f();
        break;
      default:
        return (0, s._)`typeof ${n} ${c} ${R}`;
    }
    return o === d.Correct ? u : (0, s.not)(u);
    function f(g = s.nil) {
      return (0, s.and)((0, s._)`typeof ${n} == "number"`, g, i ? (0, s._)`isFinite(${n})` : s.nil);
    }
  }
  e.checkDataType = j;
  function C(R, n, i, o) {
    if (R.length === 1)
      return j(R[0], n, i, o);
    let c;
    const u = (0, l.toHash)(R);
    if (u.array && u.object) {
      const f = (0, s._)`typeof ${n} != "object"`;
      c = u.null ? f : (0, s._)`!${n} || ${f}`, delete u.null, delete u.array, delete u.object;
    } else
      c = s.nil;
    u.number && delete u.integer;
    for (const f in u)
      c = (0, s.and)(c, j(f, n, i, o));
    return c;
  }
  e.checkDataTypes = C;
  const x = {
    message: ({ schema: R }) => `must be ${R}`,
    params: ({ schema: R, schemaValue: n }) => typeof R == "string" ? (0, s._)`{type: ${R}}` : (0, s._)`{type: ${n}}`
  };
  function v(R) {
    const n = T(R);
    (0, a.reportError)(n, x);
  }
  e.reportTypeError = v;
  function T(R) {
    const { gen: n, data: i, schema: o } = R, c = (0, l.schemaRefOrVal)(R, o, "type");
    return {
      gen: n,
      keyword: "type",
      data: i,
      schema: o.type,
      schemaCode: c,
      schemaValue: c,
      parentSchema: o,
      params: {},
      it: R
    };
  }
})(yr);
var Zr = {};
Object.defineProperty(Zr, "__esModule", { value: !0 });
Zr.assignDefaults = void 0;
const Bt = ie, Ms = ce;
function Ds(e, t) {
  const { properties: r, items: a } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      wn(e, s, r[s].default);
  else
    t === "array" && Array.isArray(a) && a.forEach((s, l) => wn(e, l, s.default));
}
Zr.assignDefaults = Ds;
function wn(e, t, r) {
  const { gen: a, compositeRule: s, data: l, opts: d } = e;
  if (r === void 0)
    return;
  const b = (0, Bt._)`${l}${(0, Bt.getProperty)(t)}`;
  if (s) {
    (0, Ms.checkStrictMode)(e, `default is ignored for: ${b}`);
    return;
  }
  let _ = (0, Bt._)`${b} === undefined`;
  d.useDefaults === "empty" && (_ = (0, Bt._)`${_} || ${b} === null || ${b} === ""`), a.if(_, (0, Bt._)`${b} = ${(0, Bt.stringify)(r)}`);
}
var lt = {}, se = {};
Object.defineProperty(se, "__esModule", { value: !0 });
se.validateUnion = se.validateArray = se.usePattern = se.callValidateCode = se.schemaProperties = se.allSchemaProperties = se.noPropertyInData = se.propertyInData = se.isOwnProperty = se.hasPropFunc = se.reportMissingProp = se.checkMissingProp = se.checkReportMissingProp = void 0;
const _e = ie, ba = ce, mt = ct, Bs = ce;
function zs(e, t) {
  const { gen: r, data: a, it: s } = e;
  r.if(_a(r, a, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, _e._)`${t}` }, !0), e.error();
  });
}
se.checkReportMissingProp = zs;
function Vs({ gen: e, data: t, it: { opts: r } }, a, s) {
  return (0, _e.or)(...a.map((l) => (0, _e.and)(_a(e, t, l, r.ownProperties), (0, _e._)`${s} = ${l}`)));
}
se.checkMissingProp = Vs;
function Fs(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
se.reportMissingProp = Fs;
function uo(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, _e._)`Object.prototype.hasOwnProperty`
  });
}
se.hasPropFunc = uo;
function ya(e, t, r) {
  return (0, _e._)`${uo(e)}.call(${t}, ${r})`;
}
se.isOwnProperty = ya;
function qs(e, t, r, a) {
  const s = (0, _e._)`${t}${(0, _e.getProperty)(r)} !== undefined`;
  return a ? (0, _e._)`${s} && ${ya(e, t, r)}` : s;
}
se.propertyInData = qs;
function _a(e, t, r, a) {
  const s = (0, _e._)`${t}${(0, _e.getProperty)(r)} === undefined`;
  return a ? (0, _e.or)(s, (0, _e.not)(ya(e, t, r))) : s;
}
se.noPropertyInData = _a;
function ho(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
se.allSchemaProperties = ho;
function Us(e, t) {
  return ho(t).filter((r) => !(0, ba.alwaysValidSchema)(e, t[r]));
}
se.schemaProperties = Us;
function Gs({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: a, schemaPath: s, errorPath: l }, it: d }, b, _, y) {
  const m = y ? (0, _e._)`${e}, ${t}, ${a}${s}` : t, k = [
    [mt.default.instancePath, (0, _e.strConcat)(mt.default.instancePath, l)],
    [mt.default.parentData, d.parentData],
    [mt.default.parentDataProperty, d.parentDataProperty],
    [mt.default.rootData, mt.default.rootData]
  ];
  d.opts.dynamicRef && k.push([mt.default.dynamicAnchors, mt.default.dynamicAnchors]);
  const N = (0, _e._)`${m}, ${r.object(...k)}`;
  return _ !== _e.nil ? (0, _e._)`${b}.call(${_}, ${N})` : (0, _e._)`${b}(${N})`;
}
se.callValidateCode = Gs;
const Hs = (0, _e._)`new RegExp`;
function Ks({ gen: e, it: { opts: t } }, r) {
  const a = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, l = s(r, a);
  return e.scopeValue("pattern", {
    key: l.toString(),
    ref: l,
    code: (0, _e._)`${s.code === "new RegExp" ? Hs : (0, Bs.useFunc)(e, s)}(${r}, ${a})`
  });
}
se.usePattern = Ks;
function Ws(e) {
  const { gen: t, data: r, keyword: a, it: s } = e, l = t.name("valid");
  if (s.allErrors) {
    const b = t.let("valid", !0);
    return d(() => t.assign(b, !1)), b;
  }
  return t.var(l, !0), d(() => t.break()), l;
  function d(b) {
    const _ = t.const("len", (0, _e._)`${r}.length`);
    t.forRange("i", 0, _, (y) => {
      e.subschema({
        keyword: a,
        dataProp: y,
        dataPropType: ba.Type.Num
      }, l), t.if((0, _e.not)(l), b);
    });
  }
}
se.validateArray = Ws;
function Js(e) {
  const { gen: t, schema: r, keyword: a, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((b) => (0, ba.alwaysValidSchema)(s, b)) && !s.opts.unevaluated)
    return;
  const l = t.let("valid", !1), d = t.name("_valid");
  t.block(() => r.forEach((b, _) => {
    const y = e.subschema({
      keyword: a,
      schemaProp: _,
      compositeRule: !0
    }, d);
    t.assign(l, (0, _e._)`${l} || ${d}`), e.mergeValidEvaluated(y, d) || t.if((0, _e.not)(l));
  })), e.result(l, () => e.reset(), () => e.error(!0));
}
se.validateUnion = Js;
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.validateKeywordUsage = lt.validSchemaType = lt.funcKeywordCode = lt.macroKeywordCode = void 0;
const Ne = ie, Ct = ct, Zs = se, Ys = br;
function Qs(e, t) {
  const { gen: r, keyword: a, schema: s, parentSchema: l, it: d } = e, b = t.macro.call(d.self, s, l, d), _ = po(r, a, b);
  d.opts.validateSchema !== !1 && d.self.validateSchema(b, !0);
  const y = r.name("valid");
  e.subschema({
    schema: b,
    schemaPath: Ne.nil,
    errSchemaPath: `${d.errSchemaPath}/${a}`,
    topSchemaRef: _,
    compositeRule: !0
  }, y), e.pass(y, () => e.error(!0));
}
lt.macroKeywordCode = Qs;
function Xs(e, t) {
  var r;
  const { gen: a, keyword: s, schema: l, parentSchema: d, $data: b, it: _ } = e;
  ti(_, t);
  const y = !b && t.compile ? t.compile.call(_.self, l, d, _) : t.validate, m = po(a, s, y), k = a.let("valid");
  e.block$data(k, N), e.ok((r = t.valid) !== null && r !== void 0 ? r : k);
  function N() {
    if (t.errors === !1)
      C(), t.modifying && vn(e), x(() => e.error());
    else {
      const v = t.async ? A() : j();
      t.modifying && vn(e), x(() => ei(e, v));
    }
  }
  function A() {
    const v = a.let("ruleErrs", null);
    return a.try(() => C((0, Ne._)`await `), (T) => a.assign(k, !1).if((0, Ne._)`${T} instanceof ${_.ValidationError}`, () => a.assign(v, (0, Ne._)`${T}.errors`), () => a.throw(T))), v;
  }
  function j() {
    const v = (0, Ne._)`${m}.errors`;
    return a.assign(v, null), C(Ne.nil), v;
  }
  function C(v = t.async ? (0, Ne._)`await ` : Ne.nil) {
    const T = _.opts.passContext ? Ct.default.this : Ct.default.self, R = !("compile" in t && !b || t.schema === !1);
    a.assign(k, (0, Ne._)`${v}${(0, Zs.callValidateCode)(e, m, T, R)}`, t.modifying);
  }
  function x(v) {
    var T;
    a.if((0, Ne.not)((T = t.valid) !== null && T !== void 0 ? T : k), v);
  }
}
lt.funcKeywordCode = Xs;
function vn(e) {
  const { gen: t, data: r, it: a } = e;
  t.if(a.parentData, () => t.assign(r, (0, Ne._)`${a.parentData}[${a.parentDataProperty}]`));
}
function ei(e, t) {
  const { gen: r } = e;
  r.if((0, Ne._)`Array.isArray(${t})`, () => {
    r.assign(Ct.default.vErrors, (0, Ne._)`${Ct.default.vErrors} === null ? ${t} : ${Ct.default.vErrors}.concat(${t})`).assign(Ct.default.errors, (0, Ne._)`${Ct.default.vErrors}.length`), (0, Ys.extendErrors)(e);
  }, () => e.error());
}
function ti({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function po(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Ne.stringify)(r) });
}
function ri(e, t, r = !1) {
  return !t.length || t.some((a) => a === "array" ? Array.isArray(e) : a === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == a || r && typeof e > "u");
}
lt.validSchemaType = ri;
function ai({ schema: e, opts: t, self: r, errSchemaPath: a }, s, l) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(l) : s.keyword !== l)
    throw new Error("ajv implementation error");
  const d = s.dependencies;
  if (d != null && d.some((b) => !Object.prototype.hasOwnProperty.call(e, b)))
    throw new Error(`parent schema must have dependencies of ${l}: ${d.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[l])) {
    const b = `keyword "${l}" value is invalid at path "${a}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(b);
    else
      throw new Error(b);
  }
}
lt.validateKeywordUsage = ai;
var _t = {};
Object.defineProperty(_t, "__esModule", { value: !0 });
_t.extendSubschemaMode = _t.extendSubschemaData = _t.getSubschema = void 0;
const it = ie, fo = ce;
function ni(e, { keyword: t, schemaProp: r, schema: a, schemaPath: s, errSchemaPath: l, topSchemaRef: d }) {
  if (t !== void 0 && a !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const b = e.schema[t];
    return r === void 0 ? {
      schema: b,
      schemaPath: (0, it._)`${e.schemaPath}${(0, it.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: b[r],
      schemaPath: (0, it._)`${e.schemaPath}${(0, it.getProperty)(t)}${(0, it.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, fo.escapeFragment)(r)}`
    };
  }
  if (a !== void 0) {
    if (s === void 0 || l === void 0 || d === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: a,
      schemaPath: s,
      topSchemaRef: d,
      errSchemaPath: l
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
_t.getSubschema = ni;
function oi(e, t, { dataProp: r, dataPropType: a, data: s, dataTypes: l, propertyName: d }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: b } = t;
  if (r !== void 0) {
    const { errorPath: y, dataPathArr: m, opts: k } = t, N = b.let("data", (0, it._)`${t.data}${(0, it.getProperty)(r)}`, !0);
    _(N), e.errorPath = (0, it.str)`${y}${(0, fo.getErrorPath)(r, a, k.jsPropertySyntax)}`, e.parentDataProperty = (0, it._)`${r}`, e.dataPathArr = [...m, e.parentDataProperty];
  }
  if (s !== void 0) {
    const y = s instanceof it.Name ? s : b.let("data", s, !0);
    _(y), d !== void 0 && (e.propertyName = d);
  }
  l && (e.dataTypes = l);
  function _(y) {
    e.data = y, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, y];
  }
}
_t.extendSubschemaData = oi;
function si(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: a, createErrors: s, allErrors: l }) {
  a !== void 0 && (e.compositeRule = a), s !== void 0 && (e.createErrors = s), l !== void 0 && (e.allErrors = l), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
_t.extendSubschemaMode = si;
var xe = {}, mo = function e(t, r) {
  if (t === r)
    return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor)
      return !1;
    var a, s, l;
    if (Array.isArray(t)) {
      if (a = t.length, a != r.length)
        return !1;
      for (s = a; s-- !== 0; )
        if (!e(t[s], r[s]))
          return !1;
      return !0;
    }
    if (t.constructor === RegExp)
      return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf)
      return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString)
      return t.toString() === r.toString();
    if (l = Object.keys(t), a = l.length, a !== Object.keys(r).length)
      return !1;
    for (s = a; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, l[s]))
        return !1;
    for (s = a; s-- !== 0; ) {
      var d = l[s];
      if (!e(t[d], r[d]))
        return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, go = { exports: {} }, yt = go.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var a = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Ar(t, a, s, e, "", e);
};
yt.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
yt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
yt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
yt.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Ar(e, t, r, a, s, l, d, b, _, y) {
  if (a && typeof a == "object" && !Array.isArray(a)) {
    t(a, s, l, d, b, _, y);
    for (var m in a) {
      var k = a[m];
      if (Array.isArray(k)) {
        if (m in yt.arrayKeywords)
          for (var N = 0; N < k.length; N++)
            Ar(e, t, r, k[N], s + "/" + m + "/" + N, l, s, m, a, N);
      } else if (m in yt.propsKeywords) {
        if (k && typeof k == "object")
          for (var A in k)
            Ar(e, t, r, k[A], s + "/" + m + "/" + ii(A), l, s, m, a, A);
      } else
        (m in yt.keywords || e.allKeys && !(m in yt.skipKeywords)) && Ar(e, t, r, k, s + "/" + m, l, s, m, a);
    }
    r(a, s, l, d, b, _, y);
  }
}
function ii(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var li = go.exports;
Object.defineProperty(xe, "__esModule", { value: !0 });
xe.getSchemaRefs = xe.resolveUrl = xe.normalizeId = xe._getFullPath = xe.getFullPath = xe.inlineRef = void 0;
const ci = ce, ui = mo, di = li, hi = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function pi(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !ua(e) : t ? bo(e) <= t : !1;
}
xe.inlineRef = pi;
const fi = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function ua(e) {
  for (const t in e) {
    if (fi.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(ua) || typeof r == "object" && ua(r))
      return !0;
  }
  return !1;
}
function bo(e) {
  let t = 0;
  for (const r in e)
    if (r === "$ref" || (t++, !hi.has(r) && (typeof e[r] == "object" && (0, ci.eachItem)(e[r], (a) => t += bo(a)), t === 1 / 0)))
      return 1 / 0;
  return t;
}
function yo(e, t = "", r) {
  r !== !1 && (t = qt(t));
  const a = e.parse(t);
  return _o(e, a);
}
xe.getFullPath = yo;
function _o(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
xe._getFullPath = _o;
const mi = /#\/?$/;
function qt(e) {
  return e ? e.replace(mi, "") : "";
}
xe.normalizeId = qt;
function gi(e, t, r) {
  return r = qt(r), e.resolve(t, r);
}
xe.resolveUrl = gi;
const bi = /^[a-z_][-a-z0-9._]*$/i;
function yi(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: a } = this.opts, s = qt(e[r] || t), l = { "": s }, d = yo(a, s, !1), b = {}, _ = /* @__PURE__ */ new Set();
  return di(e, { allKeys: !0 }, (k, N, A, j) => {
    if (j === void 0)
      return;
    const C = d + N;
    let x = l[j];
    typeof k[r] == "string" && (x = v.call(this, k[r])), T.call(this, k.$anchor), T.call(this, k.$dynamicAnchor), l[N] = x;
    function v(R) {
      const n = this.opts.uriResolver.resolve;
      if (R = qt(x ? n(x, R) : R), _.has(R))
        throw m(R);
      _.add(R);
      let i = this.refs[R];
      return typeof i == "string" && (i = this.refs[i]), typeof i == "object" ? y(k, i.schema, R) : R !== qt(C) && (R[0] === "#" ? (y(k, b[R], R), b[R] = k) : this.refs[R] = C), R;
    }
    function T(R) {
      if (typeof R == "string") {
        if (!bi.test(R))
          throw new Error(`invalid anchor "${R}"`);
        v.call(this, `#${R}`);
      }
    }
  }), b;
  function y(k, N, A) {
    if (N !== void 0 && !ui(k, N))
      throw m(A);
  }
  function m(k) {
    return new Error(`reference "${k}" resolves to more than one schema`);
  }
}
xe.getSchemaRefs = yi;
Object.defineProperty(rt, "__esModule", { value: !0 });
rt.getData = rt.KeywordCxt = rt.validateFunctionCode = void 0;
const wo = Ht, kn = yr, wa = pt, zr = yr, _i = Zr, cr = lt, ra = _t, Z = ie, X = ct, wi = xe, ft = ce, nr = br;
function vi(e) {
  if (Eo(e) && ($o(e), ko(e))) {
    $i(e);
    return;
  }
  vo(e, () => (0, wo.topBoolOrEmptySchema)(e));
}
rt.validateFunctionCode = vi;
function vo({ gen: e, validateName: t, schema: r, schemaEnv: a, opts: s }, l) {
  s.code.es5 ? e.func(t, (0, Z._)`${X.default.data}, ${X.default.valCxt}`, a.$async, () => {
    e.code((0, Z._)`"use strict"; ${En(r, s)}`), Ei(e, s), e.code(l);
  }) : e.func(t, (0, Z._)`${X.default.data}, ${ki(s)}`, a.$async, () => e.code(En(r, s)).code(l));
}
function ki(e) {
  return (0, Z._)`{${X.default.instancePath}="", ${X.default.parentData}, ${X.default.parentDataProperty}, ${X.default.rootData}=${X.default.data}${e.dynamicRef ? (0, Z._)`, ${X.default.dynamicAnchors}={}` : Z.nil}}={}`;
}
function Ei(e, t) {
  e.if(X.default.valCxt, () => {
    e.var(X.default.instancePath, (0, Z._)`${X.default.valCxt}.${X.default.instancePath}`), e.var(X.default.parentData, (0, Z._)`${X.default.valCxt}.${X.default.parentData}`), e.var(X.default.parentDataProperty, (0, Z._)`${X.default.valCxt}.${X.default.parentDataProperty}`), e.var(X.default.rootData, (0, Z._)`${X.default.valCxt}.${X.default.rootData}`), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, Z._)`${X.default.valCxt}.${X.default.dynamicAnchors}`);
  }, () => {
    e.var(X.default.instancePath, (0, Z._)`""`), e.var(X.default.parentData, (0, Z._)`undefined`), e.var(X.default.parentDataProperty, (0, Z._)`undefined`), e.var(X.default.rootData, X.default.data), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, Z._)`{}`);
  });
}
function $i(e) {
  const { schema: t, opts: r, gen: a } = e;
  vo(e, () => {
    r.$comment && t.$comment && So(e), xi(e), a.let(X.default.vErrors, null), a.let(X.default.errors, 0), r.unevaluated && Pi(e), Po(e), ji(e);
  });
}
function Pi(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, Z._)`${r}.evaluated`), t.if((0, Z._)`${e.evaluated}.dynamicProps`, () => t.assign((0, Z._)`${e.evaluated}.props`, (0, Z._)`undefined`)), t.if((0, Z._)`${e.evaluated}.dynamicItems`, () => t.assign((0, Z._)`${e.evaluated}.items`, (0, Z._)`undefined`));
}
function En(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, Z._)`/*# sourceURL=${r} */` : Z.nil;
}
function Si(e, t) {
  if (Eo(e) && ($o(e), ko(e))) {
    Ti(e, t);
    return;
  }
  (0, wo.boolOrEmptySchema)(e, t);
}
function ko({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Eo(e) {
  return typeof e.schema != "boolean";
}
function Ti(e, t) {
  const { schema: r, gen: a, opts: s } = e;
  s.$comment && r.$comment && So(e), Oi(e), Ni(e);
  const l = a.const("_errs", X.default.errors);
  Po(e, l), a.var(t, (0, Z._)`${l} === ${X.default.errors}`);
}
function $o(e) {
  (0, ft.checkUnknownRules)(e), Ci(e);
}
function Po(e, t) {
  if (e.opts.jtd)
    return $n(e, [], !1, t);
  const r = (0, kn.getSchemaTypes)(e.schema), a = (0, kn.coerceAndCheckDataType)(e, r);
  $n(e, r, !a, t);
}
function Ci(e) {
  const { schema: t, errSchemaPath: r, opts: a, self: s } = e;
  t.$ref && a.ignoreKeywordsWithRef && (0, ft.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function xi(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, ft.checkStrictMode)(e, "default is ignored in the schema root");
}
function Oi(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, wi.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function Ni(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function So({ gen: e, schemaEnv: t, schema: r, errSchemaPath: a, opts: s }) {
  const l = r.$comment;
  if (s.$comment === !0)
    e.code((0, Z._)`${X.default.self}.logger.log(${l})`);
  else if (typeof s.$comment == "function") {
    const d = (0, Z.str)`${a}/$comment`, b = e.scopeValue("root", { ref: t.root });
    e.code((0, Z._)`${X.default.self}.opts.$comment(${l}, ${d}, ${b}.schema)`);
  }
}
function ji(e) {
  const { gen: t, schemaEnv: r, validateName: a, ValidationError: s, opts: l } = e;
  r.$async ? t.if((0, Z._)`${X.default.errors} === 0`, () => t.return(X.default.data), () => t.throw((0, Z._)`new ${s}(${X.default.vErrors})`)) : (t.assign((0, Z._)`${a}.errors`, X.default.vErrors), l.unevaluated && Li(e), t.return((0, Z._)`${X.default.errors} === 0`));
}
function Li({ gen: e, evaluated: t, props: r, items: a }) {
  r instanceof Z.Name && e.assign((0, Z._)`${t}.props`, r), a instanceof Z.Name && e.assign((0, Z._)`${t}.items`, a);
}
function $n(e, t, r, a) {
  const { gen: s, schema: l, data: d, allErrors: b, opts: _, self: y } = e, { RULES: m } = y;
  if (l.$ref && (_.ignoreKeywordsWithRef || !(0, ft.schemaHasRulesButRef)(l, m))) {
    s.block(() => xo(e, "$ref", m.all.$ref.definition));
    return;
  }
  _.jtd || Ai(e, t), s.block(() => {
    for (const N of m.rules)
      k(N);
    k(m.post);
  });
  function k(N) {
    (0, wa.shouldUseGroup)(l, N) && (N.type ? (s.if((0, zr.checkDataType)(N.type, d, _.strictNumbers)), Pn(e, N), t.length === 1 && t[0] === N.type && r && (s.else(), (0, zr.reportTypeError)(e)), s.endIf()) : Pn(e, N), b || s.if((0, Z._)`${X.default.errors} === ${a || 0}`));
  }
}
function Pn(e, t) {
  const { gen: r, schema: a, opts: { useDefaults: s } } = e;
  s && (0, _i.assignDefaults)(e, t.type), r.block(() => {
    for (const l of t.rules)
      (0, wa.shouldUseRule)(a, l) && xo(e, l.keyword, l.definition, t.type);
  });
}
function Ai(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (Ri(e, t), e.opts.allowUnionTypes || Ii(e, t), Mi(e, e.dataTypes));
}
function Ri(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      To(e.dataTypes, r) || va(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), Bi(e, t);
  }
}
function Ii(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && va(e, "use allowUnionTypes to allow union type keyword");
}
function Mi(e, t) {
  const r = e.self.RULES.all;
  for (const a in r) {
    const s = r[a];
    if (typeof s == "object" && (0, wa.shouldUseRule)(e.schema, s)) {
      const { type: l } = s.definition;
      l.length && !l.some((d) => Di(t, d)) && va(e, `missing type "${l.join(",")}" for keyword "${a}"`);
    }
  }
}
function Di(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function To(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function Bi(e, t) {
  const r = [];
  for (const a of e.dataTypes)
    To(t, a) ? r.push(a) : t.includes("integer") && a === "number" && r.push("integer");
  e.dataTypes = r;
}
function va(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, ft.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Co {
  constructor(t, r, a) {
    if ((0, cr.validateKeywordUsage)(t, r, a), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = a, this.data = t.data, this.schema = t.schema[a], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, ft.schemaRefOrVal)(t, this.schema, a, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Oo(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, cr.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${a} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", X.default.errors));
  }
  result(t, r, a) {
    this.failResult((0, Z.not)(t), r, a);
  }
  failResult(t, r, a) {
    this.gen.if(t), a ? a() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, Z.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, Z._)`${r} !== undefined && (${(0, Z.or)(this.invalid$data(), t)})`);
  }
  error(t, r, a) {
    if (r) {
      this.setParams(r), this._error(t, a), this.setParams({});
      return;
    }
    this._error(t, a);
  }
  _error(t, r) {
    (t ? nr.reportExtraError : nr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, nr.reportError)(this, this.def.$dataError || nr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, nr.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, a = Z.nil) {
    this.gen.block(() => {
      this.check$data(t, a), r();
    });
  }
  check$data(t = Z.nil, r = Z.nil) {
    if (!this.$data)
      return;
    const { gen: a, schemaCode: s, schemaType: l, def: d } = this;
    a.if((0, Z.or)((0, Z._)`${s} === undefined`, r)), t !== Z.nil && a.assign(t, !0), (l.length || d.validateSchema) && (a.elseIf(this.invalid$data()), this.$dataError(), t !== Z.nil && a.assign(t, !1)), a.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: a, def: s, it: l } = this;
    return (0, Z.or)(d(), b());
    function d() {
      if (a.length) {
        if (!(r instanceof Z.Name))
          throw new Error("ajv implementation error");
        const _ = Array.isArray(a) ? a : [a];
        return (0, Z._)`${(0, zr.checkDataTypes)(_, r, l.opts.strictNumbers, zr.DataType.Wrong)}`;
      }
      return Z.nil;
    }
    function b() {
      if (s.validateSchema) {
        const _ = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, Z._)`!${_}(${r})`;
      }
      return Z.nil;
    }
  }
  subschema(t, r) {
    const a = (0, ra.getSubschema)(this.it, t);
    (0, ra.extendSubschemaData)(a, this.it, t), (0, ra.extendSubschemaMode)(a, t);
    const s = { ...this.it, ...a, items: void 0, props: void 0 };
    return Si(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: a, gen: s } = this;
    a.opts.unevaluated && (a.props !== !0 && t.props !== void 0 && (a.props = ft.mergeEvaluated.props(s, t.props, a.props, r)), a.items !== !0 && t.items !== void 0 && (a.items = ft.mergeEvaluated.items(s, t.items, a.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: a, gen: s } = this;
    if (a.opts.unevaluated && (a.props !== !0 || a.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, Z.Name)), !0;
  }
}
rt.KeywordCxt = Co;
function xo(e, t, r, a) {
  const s = new Co(e, r, t);
  "code" in r ? r.code(s, a) : s.$data && r.validate ? (0, cr.funcKeywordCode)(s, r) : "macro" in r ? (0, cr.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, cr.funcKeywordCode)(s, r);
}
const zi = /^\/(?:[^~]|~0|~1)*$/, Vi = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Oo(e, { dataLevel: t, dataNames: r, dataPathArr: a }) {
  let s, l;
  if (e === "")
    return X.default.rootData;
  if (e[0] === "/") {
    if (!zi.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, l = X.default.rootData;
  } else {
    const y = Vi.exec(e);
    if (!y)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const m = +y[1];
    if (s = y[2], s === "#") {
      if (m >= t)
        throw new Error(_("property/index", m));
      return a[t - m];
    }
    if (m > t)
      throw new Error(_("data", m));
    if (l = r[t - m], !s)
      return l;
  }
  let d = l;
  const b = s.split("/");
  for (const y of b)
    y && (l = (0, Z._)`${l}${(0, Z.getProperty)((0, ft.unescapeJsonPointer)(y))}`, d = (0, Z._)`${d} && ${l}`);
  return d;
  function _(y, m) {
    return `Cannot access ${y} ${m} levels up, current level is ${t}`;
  }
}
rt.getData = Oo;
var _r = {};
Object.defineProperty(_r, "__esModule", { value: !0 });
class Fi extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
_r.default = Fi;
var wr = {};
Object.defineProperty(wr, "__esModule", { value: !0 });
const aa = xe;
class qi extends Error {
  constructor(t, r, a, s) {
    super(s || `can't resolve reference ${a} from id ${r}`), this.missingRef = (0, aa.resolveUrl)(t, r, a), this.missingSchema = (0, aa.normalizeId)((0, aa.getFullPath)(t, this.missingRef));
  }
}
wr.default = qi;
var Be = {};
Object.defineProperty(Be, "__esModule", { value: !0 });
Be.resolveSchema = Be.getCompilingSchema = Be.resolveRef = Be.compileSchema = Be.SchemaEnv = void 0;
const Ze = ie, Ui = _r, Pt = ct, tt = xe, Sn = ce, Gi = rt;
class Yr {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let a;
    typeof t.schema == "object" && (a = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, tt.normalizeId)(a == null ? void 0 : a[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = a == null ? void 0 : a.$async, this.refs = {};
  }
}
Be.SchemaEnv = Yr;
function ka(e) {
  const t = No.call(this, e);
  if (t)
    return t;
  const r = (0, tt.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: a, lines: s } = this.opts.code, { ownProperties: l } = this.opts, d = new Ze.CodeGen(this.scope, { es5: a, lines: s, ownProperties: l });
  let b;
  e.$async && (b = d.scopeValue("Error", {
    ref: Ui.default,
    code: (0, Ze._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const _ = d.scopeName("validate");
  e.validateName = _;
  const y = {
    gen: d,
    allErrors: this.opts.allErrors,
    data: Pt.default.data,
    parentData: Pt.default.parentData,
    parentDataProperty: Pt.default.parentDataProperty,
    dataNames: [Pt.default.data],
    dataPathArr: [Ze.nil],
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: d.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ze.stringify)(e.schema) } : { ref: e.schema }),
    validateName: _,
    ValidationError: b,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Ze.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Ze._)`""`,
    opts: this.opts,
    self: this
  };
  let m;
  try {
    this._compilations.add(e), (0, Gi.validateFunctionCode)(y), d.optimize(this.opts.code.optimize);
    const k = d.toString();
    m = `${d.scopeRefs(Pt.default.scope)}return ${k}`, this.opts.code.process && (m = this.opts.code.process(m, e));
    const N = new Function(`${Pt.default.self}`, `${Pt.default.scope}`, m)(this, this.scope.get());
    if (this.scope.value(_, { ref: N }), N.errors = null, N.schema = e.schema, N.schemaEnv = e, e.$async && (N.$async = !0), this.opts.code.source === !0 && (N.source = { validateName: _, validateCode: k, scopeValues: d._values }), this.opts.unevaluated) {
      const { props: A, items: j } = y;
      N.evaluated = {
        props: A instanceof Ze.Name ? void 0 : A,
        items: j instanceof Ze.Name ? void 0 : j,
        dynamicProps: A instanceof Ze.Name,
        dynamicItems: j instanceof Ze.Name
      }, N.source && (N.source.evaluated = (0, Ze.stringify)(N.evaluated));
    }
    return e.validate = N, e;
  } catch (k) {
    throw delete e.validate, delete e.validateName, m && this.logger.error("Error compiling schema, function code:", m), k;
  } finally {
    this._compilations.delete(e);
  }
}
Be.compileSchema = ka;
function Hi(e, t, r) {
  var a;
  r = (0, tt.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let l = Ji.call(this, e, r);
  if (l === void 0) {
    const d = (a = e.localRefs) === null || a === void 0 ? void 0 : a[r], { schemaId: b } = this.opts;
    d && (l = new Yr({ schema: d, schemaId: b, root: e, baseId: t }));
  }
  if (l !== void 0)
    return e.refs[r] = Ki.call(this, l);
}
Be.resolveRef = Hi;
function Ki(e) {
  return (0, tt.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : ka.call(this, e);
}
function No(e) {
  for (const t of this._compilations)
    if (Wi(t, e))
      return t;
}
Be.getCompilingSchema = No;
function Wi(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Ji(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Qr.call(this, e, t);
}
function Qr(e, t) {
  const r = this.opts.uriResolver.parse(t), a = (0, tt._getFullPath)(this.opts.uriResolver, r);
  let s = (0, tt.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && a === s)
    return na.call(this, r, e);
  const l = (0, tt.normalizeId)(a), d = this.refs[l] || this.schemas[l];
  if (typeof d == "string") {
    const b = Qr.call(this, e, d);
    return typeof (b == null ? void 0 : b.schema) != "object" ? void 0 : na.call(this, r, b);
  }
  if (typeof (d == null ? void 0 : d.schema) == "object") {
    if (d.validate || ka.call(this, d), l === (0, tt.normalizeId)(t)) {
      const { schema: b } = d, { schemaId: _ } = this.opts, y = b[_];
      return y && (s = (0, tt.resolveUrl)(this.opts.uriResolver, s, y)), new Yr({ schema: b, schemaId: _, root: e, baseId: s });
    }
    return na.call(this, r, d);
  }
}
Be.resolveSchema = Qr;
const Zi = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function na(e, { baseId: t, schema: r, root: a }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const b of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const _ = r[(0, Sn.unescapeFragment)(b)];
    if (_ === void 0)
      return;
    r = _;
    const y = typeof r == "object" && r[this.opts.schemaId];
    !Zi.has(b) && y && (t = (0, tt.resolveUrl)(this.opts.uriResolver, t, y));
  }
  let l;
  if (typeof r != "boolean" && r.$ref && !(0, Sn.schemaHasRulesButRef)(r, this.RULES)) {
    const b = (0, tt.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    l = Qr.call(this, a, b);
  }
  const { schemaId: d } = this.opts;
  if (l = l || new Yr({ schema: r, schemaId: d, root: a, baseId: t }), l.schema !== l.root.schema)
    return l;
}
const Yi = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Qi = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Xi = "object", el = [
  "$data"
], tl = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, rl = !1, al = {
  $id: Yi,
  description: Qi,
  type: Xi,
  required: el,
  properties: tl,
  additionalProperties: rl
};
var Ea = {}, da = { exports: {} };
/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
(function(e, t) {
  (function(r, a) {
    a(t);
  })(no, function(r) {
    function a() {
      for (var p = arguments.length, E = Array(p), S = 0; S < p; S++)
        E[S] = arguments[S];
      if (E.length > 1) {
        E[0] = E[0].slice(0, -1);
        for (var M = E.length - 1, D = 1; D < M; ++D)
          E[D] = E[D].slice(1, -1);
        return E[M] = E[M].slice(1), E.join("");
      } else
        return E[0];
    }
    function s(p) {
      return "(?:" + p + ")";
    }
    function l(p) {
      return p === void 0 ? "undefined" : p === null ? "null" : Object.prototype.toString.call(p).split(" ").pop().split("]").shift().toLowerCase();
    }
    function d(p) {
      return p.toUpperCase();
    }
    function b(p) {
      return p != null ? p instanceof Array ? p : typeof p.length != "number" || p.split || p.setInterval || p.call ? [p] : Array.prototype.slice.call(p) : [];
    }
    function _(p, E) {
      var S = p;
      if (E)
        for (var M in E)
          S[M] = E[M];
      return S;
    }
    function y(p) {
      var E = "[A-Za-z]", S = "[0-9]", M = a(S, "[A-Fa-f]"), D = s(s("%[EFef]" + M + "%" + M + M + "%" + M + M) + "|" + s("%[89A-Fa-f]" + M + "%" + M + M) + "|" + s("%" + M + M)), Q = "[\\:\\/\\?\\#\\[\\]\\@]", Y = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", ue = a(Q, Y), ke = p ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]", pe = p ? "[\\uE000-\\uF8FF]" : "[]", le = a(E, S, "[\\-\\.\\_\\~]", ke);
      s(E + a(E, S, "[\\+\\-\\.]") + "*"), s(s(D + "|" + a(le, Y, "[\\:]")) + "*");
      var ye = s(s("25[0-5]") + "|" + s("2[0-4]" + S) + "|" + s("1" + S + S) + "|" + s("0?[1-9]" + S) + "|0?0?" + S), we = s(ye + "\\." + ye + "\\." + ye + "\\." + ye), ee = s(M + "{1,4}"), Ee = s(s(ee + "\\:" + ee) + "|" + we), fe = s(s(ee + "\\:") + "{6}" + Ee), Fe = s("\\:\\:" + s(ee + "\\:") + "{5}" + Ee), Dt = s(s(ee) + "?\\:\\:" + s(ee + "\\:") + "{4}" + Ee), Je = s(s(s(ee + "\\:") + "{0,1}" + ee) + "?\\:\\:" + s(ee + "\\:") + "{3}" + Ee), dt = s(s(s(ee + "\\:") + "{0,2}" + ee) + "?\\:\\:" + s(ee + "\\:") + "{2}" + Ee), kt = s(s(s(ee + "\\:") + "{0,3}" + ee) + "?\\:\\:" + ee + "\\:" + Ee), Et = s(s(s(ee + "\\:") + "{0,4}" + ee) + "?\\:\\:" + Ee), qe = s(s(s(ee + "\\:") + "{0,5}" + ee) + "?\\:\\:" + ee), ht = s(s(s(ee + "\\:") + "{0,6}" + ee) + "?\\:\\:"), $t = s([fe, Fe, Dt, Je, dt, kt, Et, qe, ht].join("|")), ot = s(s(le + "|" + D) + "+");
      s("[vV]" + M + "+\\." + a(le, Y, "[\\:]") + "+"), s(s(D + "|" + a(le, Y)) + "*");
      var Er = s(D + "|" + a(le, Y, "[\\:\\@]"));
      return s(s(D + "|" + a(le, Y, "[\\@]")) + "+"), s(s(Er + "|" + a("[\\/\\?]", pe)) + "*"), {
        NOT_SCHEME: new RegExp(a("[^]", E, S, "[\\+\\-\\.]"), "g"),
        NOT_USERINFO: new RegExp(a("[^\\%\\:]", le, Y), "g"),
        NOT_HOST: new RegExp(a("[^\\%\\[\\]\\:]", le, Y), "g"),
        NOT_PATH: new RegExp(a("[^\\%\\/\\:\\@]", le, Y), "g"),
        NOT_PATH_NOSCHEME: new RegExp(a("[^\\%\\/\\@]", le, Y), "g"),
        NOT_QUERY: new RegExp(a("[^\\%]", le, Y, "[\\:\\@\\/\\?]", pe), "g"),
        NOT_FRAGMENT: new RegExp(a("[^\\%]", le, Y, "[\\:\\@\\/\\?]"), "g"),
        ESCAPE: new RegExp(a("[^]", le, Y), "g"),
        UNRESERVED: new RegExp(le, "g"),
        OTHER_CHARS: new RegExp(a("[^\\%]", le, ue), "g"),
        PCT_ENCODED: new RegExp(D, "g"),
        IPV4ADDRESS: new RegExp("^(" + we + ")$"),
        IPV6ADDRESS: new RegExp("^\\[?(" + $t + ")" + s(s("\\%25|\\%(?!" + M + "{2})") + "(" + ot + ")") + "?\\]?$")
        //RFC 6874, with relaxed parsing rules
      };
    }
    var m = y(!1), k = y(!0), N = function() {
      function p(E, S) {
        var M = [], D = !0, Q = !1, Y = void 0;
        try {
          for (var ue = E[Symbol.iterator](), ke; !(D = (ke = ue.next()).done) && (M.push(ke.value), !(S && M.length === S)); D = !0)
            ;
        } catch (pe) {
          Q = !0, Y = pe;
        } finally {
          try {
            !D && ue.return && ue.return();
          } finally {
            if (Q)
              throw Y;
          }
        }
        return M;
      }
      return function(E, S) {
        if (Array.isArray(E))
          return E;
        if (Symbol.iterator in Object(E))
          return p(E, S);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      };
    }(), A = function(p) {
      if (Array.isArray(p)) {
        for (var E = 0, S = Array(p.length); E < p.length; E++)
          S[E] = p[E];
        return S;
      } else
        return Array.from(p);
    }, j = 2147483647, C = 36, x = 1, v = 26, T = 38, R = 700, n = 72, i = 128, o = "-", c = /^xn--/, u = /[^\0-\x7E]/, f = /[\x2E\u3002\uFF0E\uFF61]/g, g = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    }, O = C - x, z = Math.floor, q = String.fromCharCode;
    function B(p) {
      throw new RangeError(g[p]);
    }
    function G(p, E) {
      for (var S = [], M = p.length; M--; )
        S[M] = E(p[M]);
      return S;
    }
    function w(p, E) {
      var S = p.split("@"), M = "";
      S.length > 1 && (M = S[0] + "@", p = S[1]), p = p.replace(f, ".");
      var D = p.split("."), Q = G(D, E).join(".");
      return M + Q;
    }
    function U(p) {
      for (var E = [], S = 0, M = p.length; S < M; ) {
        var D = p.charCodeAt(S++);
        if (D >= 55296 && D <= 56319 && S < M) {
          var Q = p.charCodeAt(S++);
          (Q & 64512) == 56320 ? E.push(((D & 1023) << 10) + (Q & 1023) + 65536) : (E.push(D), S--);
        } else
          E.push(D);
      }
      return E;
    }
    var W = function(p) {
      return String.fromCodePoint.apply(String, A(p));
    }, J = function(p) {
      return p - 48 < 10 ? p - 22 : p - 65 < 26 ? p - 65 : p - 97 < 26 ? p - 97 : C;
    }, V = function(p, E) {
      return p + 22 + 75 * (p < 26) - ((E != 0) << 5);
    }, P = function(p, E, S) {
      var M = 0;
      for (
        p = S ? z(p / R) : p >> 1, p += z(p / E);
        /* no initialization */
        p > O * v >> 1;
        M += C
      )
        p = z(p / O);
      return z(M + (O + 1) * p / (p + T));
    }, F = function(p) {
      var E = [], S = p.length, M = 0, D = i, Q = n, Y = p.lastIndexOf(o);
      Y < 0 && (Y = 0);
      for (var ue = 0; ue < Y; ++ue)
        p.charCodeAt(ue) >= 128 && B("not-basic"), E.push(p.charCodeAt(ue));
      for (var ke = Y > 0 ? Y + 1 : 0; ke < S; ) {
        for (
          var pe = M, le = 1, ye = C;
          ;
          /* no condition */
          ye += C
        ) {
          ke >= S && B("invalid-input");
          var we = J(p.charCodeAt(ke++));
          (we >= C || we > z((j - M) / le)) && B("overflow"), M += we * le;
          var ee = ye <= Q ? x : ye >= Q + v ? v : ye - Q;
          if (we < ee)
            break;
          var Ee = C - ee;
          le > z(j / Ee) && B("overflow"), le *= Ee;
        }
        var fe = E.length + 1;
        Q = P(M - pe, fe, pe == 0), z(M / fe) > j - D && B("overflow"), D += z(M / fe), M %= fe, E.splice(M++, 0, D);
      }
      return String.fromCodePoint.apply(String, E);
    }, L = function(p) {
      var E = [];
      p = U(p);
      var S = p.length, M = i, D = 0, Q = n, Y = !0, ue = !1, ke = void 0;
      try {
        for (var pe = p[Symbol.iterator](), le; !(Y = (le = pe.next()).done); Y = !0) {
          var ye = le.value;
          ye < 128 && E.push(q(ye));
        }
      } catch (ar) {
        ue = !0, ke = ar;
      } finally {
        try {
          !Y && pe.return && pe.return();
        } finally {
          if (ue)
            throw ke;
        }
      }
      var we = E.length, ee = we;
      for (we && E.push(o); ee < S; ) {
        var Ee = j, fe = !0, Fe = !1, Dt = void 0;
        try {
          for (var Je = p[Symbol.iterator](), dt; !(fe = (dt = Je.next()).done); fe = !0) {
            var kt = dt.value;
            kt >= M && kt < Ee && (Ee = kt);
          }
        } catch (ar) {
          Fe = !0, Dt = ar;
        } finally {
          try {
            !fe && Je.return && Je.return();
          } finally {
            if (Fe)
              throw Dt;
          }
        }
        var Et = ee + 1;
        Ee - M > z((j - D) / Et) && B("overflow"), D += (Ee - M) * Et, M = Ee;
        var qe = !0, ht = !1, $t = void 0;
        try {
          for (var ot = p[Symbol.iterator](), Er; !(qe = (Er = ot.next()).done); qe = !0) {
            var gn = Er.value;
            if (gn < M && ++D > j && B("overflow"), gn == M) {
              for (
                var $r = D, Pr = C;
                ;
                /* no condition */
                Pr += C
              ) {
                var Sr = Pr <= Q ? x : Pr >= Q + v ? v : Pr - Q;
                if ($r < Sr)
                  break;
                var bn = $r - Sr, yn = C - Sr;
                E.push(q(V(Sr + bn % yn, 0))), $r = z(bn / yn);
              }
              E.push(q(V($r, 0))), Q = P(D, Et, ee == we), D = 0, ++ee;
            }
          }
        } catch (ar) {
          ht = !0, $t = ar;
        } finally {
          try {
            !qe && ot.return && ot.return();
          } finally {
            if (ht)
              throw $t;
          }
        }
        ++D, ++M;
      }
      return E.join("");
    }, h = function(p) {
      return w(p, function(E) {
        return c.test(E) ? F(E.slice(4).toLowerCase()) : E;
      });
    }, $ = function(p) {
      return w(p, function(E) {
        return u.test(E) ? "xn--" + L(E) : E;
      });
    }, I = {
      /**
       * A string representing the current Punycode.js version number.
       * @memberOf punycode
       * @type String
       */
      version: "2.1.0",
      /**
       * An object of methods to convert from JavaScript's internal character
       * representation (UCS-2) to Unicode code points, and back.
       * @see <https://mathiasbynens.be/notes/javascript-encoding>
       * @memberOf punycode
       * @type Object
       */
      ucs2: {
        decode: U,
        encode: W
      },
      decode: F,
      encode: L,
      toASCII: $,
      toUnicode: h
    }, H = {};
    function K(p) {
      var E = p.charCodeAt(0), S = void 0;
      return E < 16 ? S = "%0" + E.toString(16).toUpperCase() : E < 128 ? S = "%" + E.toString(16).toUpperCase() : E < 2048 ? S = "%" + (E >> 6 | 192).toString(16).toUpperCase() + "%" + (E & 63 | 128).toString(16).toUpperCase() : S = "%" + (E >> 12 | 224).toString(16).toUpperCase() + "%" + (E >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (E & 63 | 128).toString(16).toUpperCase(), S;
    }
    function te(p) {
      for (var E = "", S = 0, M = p.length; S < M; ) {
        var D = parseInt(p.substr(S + 1, 2), 16);
        if (D < 128)
          E += String.fromCharCode(D), S += 3;
        else if (D >= 194 && D < 224) {
          if (M - S >= 6) {
            var Q = parseInt(p.substr(S + 4, 2), 16);
            E += String.fromCharCode((D & 31) << 6 | Q & 63);
          } else
            E += p.substr(S, 6);
          S += 6;
        } else if (D >= 224) {
          if (M - S >= 9) {
            var Y = parseInt(p.substr(S + 4, 2), 16), ue = parseInt(p.substr(S + 7, 2), 16);
            E += String.fromCharCode((D & 15) << 12 | (Y & 63) << 6 | ue & 63);
          } else
            E += p.substr(S, 9);
          S += 9;
        } else
          E += p.substr(S, 3), S += 3;
      }
      return E;
    }
    function ne(p, E) {
      function S(M) {
        var D = te(M);
        return D.match(E.UNRESERVED) ? D : M;
      }
      return p.scheme && (p.scheme = String(p.scheme).replace(E.PCT_ENCODED, S).toLowerCase().replace(E.NOT_SCHEME, "")), p.userinfo !== void 0 && (p.userinfo = String(p.userinfo).replace(E.PCT_ENCODED, S).replace(E.NOT_USERINFO, K).replace(E.PCT_ENCODED, d)), p.host !== void 0 && (p.host = String(p.host).replace(E.PCT_ENCODED, S).toLowerCase().replace(E.NOT_HOST, K).replace(E.PCT_ENCODED, d)), p.path !== void 0 && (p.path = String(p.path).replace(E.PCT_ENCODED, S).replace(p.scheme ? E.NOT_PATH : E.NOT_PATH_NOSCHEME, K).replace(E.PCT_ENCODED, d)), p.query !== void 0 && (p.query = String(p.query).replace(E.PCT_ENCODED, S).replace(E.NOT_QUERY, K).replace(E.PCT_ENCODED, d)), p.fragment !== void 0 && (p.fragment = String(p.fragment).replace(E.PCT_ENCODED, S).replace(E.NOT_FRAGMENT, K).replace(E.PCT_ENCODED, d)), p;
    }
    function be(p) {
      return p.replace(/^0*(.*)/, "$1") || "0";
    }
    function Ae(p, E) {
      var S = p.match(E.IPV4ADDRESS) || [], M = N(S, 2), D = M[1];
      return D ? D.split(".").map(be).join(".") : p;
    }
    function ut(p, E) {
      var S = p.match(E.IPV6ADDRESS) || [], M = N(S, 3), D = M[1], Q = M[2];
      if (D) {
        for (var Y = D.toLowerCase().split("::").reverse(), ue = N(Y, 2), ke = ue[0], pe = ue[1], le = pe ? pe.split(":").map(be) : [], ye = ke.split(":").map(be), we = E.IPV4ADDRESS.test(ye[ye.length - 1]), ee = we ? 7 : 8, Ee = ye.length - ee, fe = Array(ee), Fe = 0; Fe < ee; ++Fe)
          fe[Fe] = le[Fe] || ye[Ee + Fe] || "";
        we && (fe[ee - 1] = Ae(fe[ee - 1], E));
        var Dt = fe.reduce(function(qe, ht, $t) {
          if (!ht || ht === "0") {
            var ot = qe[qe.length - 1];
            ot && ot.index + ot.length === $t ? ot.length++ : qe.push({ index: $t, length: 1 });
          }
          return qe;
        }, []), Je = Dt.sort(function(qe, ht) {
          return ht.length - qe.length;
        })[0], dt = void 0;
        if (Je && Je.length > 1) {
          var kt = fe.slice(0, Je.index), Et = fe.slice(Je.index + Je.length);
          dt = kt.join(":") + "::" + Et.join(":");
        } else
          dt = fe.join(":");
        return Q && (dt += "%" + Q), dt;
      } else
        return p;
    }
    var Zt = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i, Yt = "".match(/(){0}/)[1] === void 0;
    function ze(p) {
      var E = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, S = {}, M = E.iri !== !1 ? k : m;
      E.reference === "suffix" && (p = (E.scheme ? E.scheme + ":" : "") + "//" + p);
      var D = p.match(Zt);
      if (D) {
        Yt ? (S.scheme = D[1], S.userinfo = D[3], S.host = D[4], S.port = parseInt(D[5], 10), S.path = D[6] || "", S.query = D[7], S.fragment = D[8], isNaN(S.port) && (S.port = D[5])) : (S.scheme = D[1] || void 0, S.userinfo = p.indexOf("@") !== -1 ? D[3] : void 0, S.host = p.indexOf("//") !== -1 ? D[4] : void 0, S.port = parseInt(D[5], 10), S.path = D[6] || "", S.query = p.indexOf("?") !== -1 ? D[7] : void 0, S.fragment = p.indexOf("#") !== -1 ? D[8] : void 0, isNaN(S.port) && (S.port = p.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? D[4] : void 0)), S.host && (S.host = ut(Ae(S.host, M), M)), S.scheme === void 0 && S.userinfo === void 0 && S.host === void 0 && S.port === void 0 && !S.path && S.query === void 0 ? S.reference = "same-document" : S.scheme === void 0 ? S.reference = "relative" : S.fragment === void 0 ? S.reference = "absolute" : S.reference = "uri", E.reference && E.reference !== "suffix" && E.reference !== S.reference && (S.error = S.error || "URI is not a " + E.reference + " reference.");
        var Q = H[(E.scheme || S.scheme || "").toLowerCase()];
        if (!E.unicodeSupport && (!Q || !Q.unicodeSupport)) {
          if (S.host && (E.domainHost || Q && Q.domainHost))
            try {
              S.host = I.toASCII(S.host.replace(M.PCT_ENCODED, te).toLowerCase());
            } catch (Y) {
              S.error = S.error || "Host's domain name can not be converted to ASCII via punycode: " + Y;
            }
          ne(S, m);
        } else
          ne(S, M);
        Q && Q.parse && Q.parse(S, E);
      } else
        S.error = S.error || "URI can not be parsed.";
      return S;
    }
    function Qt(p, E) {
      var S = E.iri !== !1 ? k : m, M = [];
      return p.userinfo !== void 0 && (M.push(p.userinfo), M.push("@")), p.host !== void 0 && M.push(ut(Ae(String(p.host), S), S).replace(S.IPV6ADDRESS, function(D, Q, Y) {
        return "[" + Q + (Y ? "%25" + Y : "") + "]";
      })), (typeof p.port == "number" || typeof p.port == "string") && (M.push(":"), M.push(String(p.port))), M.length ? M.join("") : void 0;
    }
    var Lt = /^\.\.?\//, At = /^\/\.(\/|$)/, Rt = /^\/\.\.(\/|$)/, Xt = /^\/?(?:.|\n)*?(?=\/|$)/;
    function at(p) {
      for (var E = []; p.length; )
        if (p.match(Lt))
          p = p.replace(Lt, "");
        else if (p.match(At))
          p = p.replace(At, "/");
        else if (p.match(Rt))
          p = p.replace(Rt, "/"), E.pop();
        else if (p === "." || p === "..")
          p = "";
        else {
          var S = p.match(Xt);
          if (S) {
            var M = S[0];
            p = p.slice(M.length), E.push(M);
          } else
            throw new Error("Unexpected dot segment condition");
        }
      return E.join("");
    }
    function Re(p) {
      var E = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, S = E.iri ? k : m, M = [], D = H[(E.scheme || p.scheme || "").toLowerCase()];
      if (D && D.serialize && D.serialize(p, E), p.host && !S.IPV6ADDRESS.test(p.host) && (E.domainHost || D && D.domainHost))
        try {
          p.host = E.iri ? I.toUnicode(p.host) : I.toASCII(p.host.replace(S.PCT_ENCODED, te).toLowerCase());
        } catch (ue) {
          p.error = p.error || "Host's domain name can not be converted to " + (E.iri ? "Unicode" : "ASCII") + " via punycode: " + ue;
        }
      ne(p, S), E.reference !== "suffix" && p.scheme && (M.push(p.scheme), M.push(":"));
      var Q = Qt(p, E);
      if (Q !== void 0 && (E.reference !== "suffix" && M.push("//"), M.push(Q), p.path && p.path.charAt(0) !== "/" && M.push("/")), p.path !== void 0) {
        var Y = p.path;
        !E.absolutePath && (!D || !D.absolutePath) && (Y = at(Y)), Q === void 0 && (Y = Y.replace(/^\/\//, "/%2F")), M.push(Y);
      }
      return p.query !== void 0 && (M.push("?"), M.push(p.query)), p.fragment !== void 0 && (M.push("#"), M.push(p.fragment)), M.join("");
    }
    function It(p, E) {
      var S = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, M = arguments[3], D = {};
      return M || (p = ze(Re(p, S), S), E = ze(Re(E, S), S)), S = S || {}, !S.tolerant && E.scheme ? (D.scheme = E.scheme, D.userinfo = E.userinfo, D.host = E.host, D.port = E.port, D.path = at(E.path || ""), D.query = E.query) : (E.userinfo !== void 0 || E.host !== void 0 || E.port !== void 0 ? (D.userinfo = E.userinfo, D.host = E.host, D.port = E.port, D.path = at(E.path || ""), D.query = E.query) : (E.path ? (E.path.charAt(0) === "/" ? D.path = at(E.path) : ((p.userinfo !== void 0 || p.host !== void 0 || p.port !== void 0) && !p.path ? D.path = "/" + E.path : p.path ? D.path = p.path.slice(0, p.path.lastIndexOf("/") + 1) + E.path : D.path = E.path, D.path = at(D.path)), D.query = E.query) : (D.path = p.path, E.query !== void 0 ? D.query = E.query : D.query = p.query), D.userinfo = p.userinfo, D.host = p.host, D.port = p.port), D.scheme = p.scheme), D.fragment = E.fragment, D;
    }
    function er(p, E, S) {
      var M = _({ scheme: "null" }, S);
      return Re(It(ze(p, M), ze(E, M), M, !0), M);
    }
    function wt(p, E) {
      return typeof p == "string" ? p = Re(ze(p, E), E) : l(p) === "object" && (p = ze(Re(p, E), E)), p;
    }
    function tr(p, E, S) {
      return typeof p == "string" ? p = Re(ze(p, S), S) : l(p) === "object" && (p = Re(p, S)), typeof E == "string" ? E = Re(ze(E, S), S) : l(E) === "object" && (E = Re(E, S)), p === E;
    }
    function kr(p, E) {
      return p && p.toString().replace(!E || !E.iri ? m.ESCAPE : k.ESCAPE, K);
    }
    function Ve(p, E) {
      return p && p.toString().replace(!E || !E.iri ? m.PCT_ENCODED : k.PCT_ENCODED, te);
    }
    var vt = {
      scheme: "http",
      domainHost: !0,
      parse: function(p, E) {
        return p.host || (p.error = p.error || "HTTP URIs must have a host."), p;
      },
      serialize: function(p, E) {
        var S = String(p.scheme).toLowerCase() === "https";
        return (p.port === (S ? 443 : 80) || p.port === "") && (p.port = void 0), p.path || (p.path = "/"), p;
      }
    }, ln = {
      scheme: "https",
      domainHost: vt.domainHost,
      parse: vt.parse,
      serialize: vt.serialize
    };
    function cn(p) {
      return typeof p.secure == "boolean" ? p.secure : String(p.scheme).toLowerCase() === "wss";
    }
    var rr = {
      scheme: "ws",
      domainHost: !0,
      parse: function(p, E) {
        var S = p;
        return S.secure = cn(S), S.resourceName = (S.path || "/") + (S.query ? "?" + S.query : ""), S.path = void 0, S.query = void 0, S;
      },
      serialize: function(p, E) {
        if ((p.port === (cn(p) ? 443 : 80) || p.port === "") && (p.port = void 0), typeof p.secure == "boolean" && (p.scheme = p.secure ? "wss" : "ws", p.secure = void 0), p.resourceName) {
          var S = p.resourceName.split("?"), M = N(S, 2), D = M[0], Q = M[1];
          p.path = D && D !== "/" ? D : void 0, p.query = Q, p.resourceName = void 0;
        }
        return p.fragment = void 0, p;
      }
    }, un = {
      scheme: "wss",
      domainHost: rr.domainHost,
      parse: rr.parse,
      serialize: rr.serialize
    }, ss = {}, dn = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]", nt = "[0-9A-Fa-f]", is = s(s("%[EFef]" + nt + "%" + nt + nt + "%" + nt + nt) + "|" + s("%[89A-Fa-f]" + nt + "%" + nt + nt) + "|" + s("%" + nt + nt)), ls = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", cs = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", us = a(cs, '[\\"\\\\]'), ds = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]", hs = new RegExp(dn, "g"), Mt = new RegExp(is, "g"), ps = new RegExp(a("[^]", ls, "[\\.]", '[\\"]', us), "g"), hn = new RegExp(a("[^]", dn, ds), "g"), fs = hn;
    function ta(p) {
      var E = te(p);
      return E.match(hs) ? E : p;
    }
    var pn = {
      scheme: "mailto",
      parse: function(p, E) {
        var S = p, M = S.to = S.path ? S.path.split(",") : [];
        if (S.path = void 0, S.query) {
          for (var D = !1, Q = {}, Y = S.query.split("&"), ue = 0, ke = Y.length; ue < ke; ++ue) {
            var pe = Y[ue].split("=");
            switch (pe[0]) {
              case "to":
                for (var le = pe[1].split(","), ye = 0, we = le.length; ye < we; ++ye)
                  M.push(le[ye]);
                break;
              case "subject":
                S.subject = Ve(pe[1], E);
                break;
              case "body":
                S.body = Ve(pe[1], E);
                break;
              default:
                D = !0, Q[Ve(pe[0], E)] = Ve(pe[1], E);
                break;
            }
          }
          D && (S.headers = Q);
        }
        S.query = void 0;
        for (var ee = 0, Ee = M.length; ee < Ee; ++ee) {
          var fe = M[ee].split("@");
          if (fe[0] = Ve(fe[0]), E.unicodeSupport)
            fe[1] = Ve(fe[1], E).toLowerCase();
          else
            try {
              fe[1] = I.toASCII(Ve(fe[1], E).toLowerCase());
            } catch (Fe) {
              S.error = S.error || "Email address's domain name can not be converted to ASCII via punycode: " + Fe;
            }
          M[ee] = fe.join("@");
        }
        return S;
      },
      serialize: function(p, E) {
        var S = p, M = b(p.to);
        if (M) {
          for (var D = 0, Q = M.length; D < Q; ++D) {
            var Y = String(M[D]), ue = Y.lastIndexOf("@"), ke = Y.slice(0, ue).replace(Mt, ta).replace(Mt, d).replace(ps, K), pe = Y.slice(ue + 1);
            try {
              pe = E.iri ? I.toUnicode(pe) : I.toASCII(Ve(pe, E).toLowerCase());
            } catch (ee) {
              S.error = S.error || "Email address's domain name can not be converted to " + (E.iri ? "Unicode" : "ASCII") + " via punycode: " + ee;
            }
            M[D] = ke + "@" + pe;
          }
          S.path = M.join(",");
        }
        var le = p.headers = p.headers || {};
        p.subject && (le.subject = p.subject), p.body && (le.body = p.body);
        var ye = [];
        for (var we in le)
          le[we] !== ss[we] && ye.push(we.replace(Mt, ta).replace(Mt, d).replace(hn, K) + "=" + le[we].replace(Mt, ta).replace(Mt, d).replace(fs, K));
        return ye.length && (S.query = ye.join("&")), S;
      }
    }, ms = /^([^\:]+)\:(.*)/, fn = {
      scheme: "urn",
      parse: function(p, E) {
        var S = p.path && p.path.match(ms), M = p;
        if (S) {
          var D = E.scheme || M.scheme || "urn", Q = S[1].toLowerCase(), Y = S[2], ue = D + ":" + (E.nid || Q), ke = H[ue];
          M.nid = Q, M.nss = Y, M.path = void 0, ke && (M = ke.parse(M, E));
        } else
          M.error = M.error || "URN can not be parsed.";
        return M;
      },
      serialize: function(p, E) {
        var S = E.scheme || p.scheme || "urn", M = p.nid, D = S + ":" + (E.nid || M), Q = H[D];
        Q && (p = Q.serialize(p, E));
        var Y = p, ue = p.nss;
        return Y.path = (M || E.nid) + ":" + ue, Y;
      }
    }, gs = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/, mn = {
      scheme: "urn:uuid",
      parse: function(p, E) {
        var S = p;
        return S.uuid = S.nss, S.nss = void 0, !E.tolerant && (!S.uuid || !S.uuid.match(gs)) && (S.error = S.error || "UUID is not valid."), S;
      },
      serialize: function(p, E) {
        var S = p;
        return S.nss = (p.uuid || "").toLowerCase(), S;
      }
    };
    H[vt.scheme] = vt, H[ln.scheme] = ln, H[rr.scheme] = rr, H[un.scheme] = un, H[pn.scheme] = pn, H[fn.scheme] = fn, H[mn.scheme] = mn, r.SCHEMES = H, r.pctEncChar = K, r.pctDecChars = te, r.parse = ze, r.removeDotSegments = at, r.serialize = Re, r.resolveComponents = It, r.resolve = er, r.normalize = wt, r.equal = tr, r.escapeComponent = kr, r.unescapeComponent = Ve, Object.defineProperty(r, "__esModule", { value: !0 });
  });
})(da, da.exports);
var nl = da.exports;
Object.defineProperty(Ea, "__esModule", { value: !0 });
const jo = nl;
jo.code = 'require("ajv/dist/runtime/uri").default';
Ea.default = jo;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = rt;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = ie;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const a = _r, s = wr, l = Nt, d = Be, b = ie, _ = xe, y = yr, m = ce, k = al, N = Ea, A = (V, P) => new RegExp(V, P);
  A.code = "new RegExp";
  const j = ["removeAdditional", "useDefaults", "coerceTypes"], C = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), x = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, v = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, T = 200;
  function R(V) {
    var P, F, L, h, $, I, H, K, te, ne, be, Ae, ut, Zt, Yt, ze, Qt, Lt, At, Rt, Xt, at, Re, It, er;
    const wt = V.strict, tr = (P = V.code) === null || P === void 0 ? void 0 : P.optimize, kr = tr === !0 || tr === void 0 ? 1 : tr || 0, Ve = (L = (F = V.code) === null || F === void 0 ? void 0 : F.regExp) !== null && L !== void 0 ? L : A, vt = (h = V.uriResolver) !== null && h !== void 0 ? h : N.default;
    return {
      strictSchema: (I = ($ = V.strictSchema) !== null && $ !== void 0 ? $ : wt) !== null && I !== void 0 ? I : !0,
      strictNumbers: (K = (H = V.strictNumbers) !== null && H !== void 0 ? H : wt) !== null && K !== void 0 ? K : !0,
      strictTypes: (ne = (te = V.strictTypes) !== null && te !== void 0 ? te : wt) !== null && ne !== void 0 ? ne : "log",
      strictTuples: (Ae = (be = V.strictTuples) !== null && be !== void 0 ? be : wt) !== null && Ae !== void 0 ? Ae : "log",
      strictRequired: (Zt = (ut = V.strictRequired) !== null && ut !== void 0 ? ut : wt) !== null && Zt !== void 0 ? Zt : !1,
      code: V.code ? { ...V.code, optimize: kr, regExp: Ve } : { optimize: kr, regExp: Ve },
      loopRequired: (Yt = V.loopRequired) !== null && Yt !== void 0 ? Yt : T,
      loopEnum: (ze = V.loopEnum) !== null && ze !== void 0 ? ze : T,
      meta: (Qt = V.meta) !== null && Qt !== void 0 ? Qt : !0,
      messages: (Lt = V.messages) !== null && Lt !== void 0 ? Lt : !0,
      inlineRefs: (At = V.inlineRefs) !== null && At !== void 0 ? At : !0,
      schemaId: (Rt = V.schemaId) !== null && Rt !== void 0 ? Rt : "$id",
      addUsedSchema: (Xt = V.addUsedSchema) !== null && Xt !== void 0 ? Xt : !0,
      validateSchema: (at = V.validateSchema) !== null && at !== void 0 ? at : !0,
      validateFormats: (Re = V.validateFormats) !== null && Re !== void 0 ? Re : !0,
      unicodeRegExp: (It = V.unicodeRegExp) !== null && It !== void 0 ? It : !0,
      int32range: (er = V.int32range) !== null && er !== void 0 ? er : !0,
      uriResolver: vt
    };
  }
  class n {
    constructor(P = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), P = this.opts = { ...P, ...R(P) };
      const { es5: F, lines: L } = this.opts.code;
      this.scope = new b.ValueScope({ scope: {}, prefixes: C, es5: F, lines: L }), this.logger = z(P.logger);
      const h = P.validateFormats;
      P.validateFormats = !1, this.RULES = (0, l.getRules)(), i.call(this, x, P, "NOT SUPPORTED"), i.call(this, v, P, "DEPRECATED", "warn"), this._metaOpts = g.call(this), P.formats && u.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), P.keywords && f.call(this, P.keywords), typeof P.meta == "object" && this.addMetaSchema(P.meta), c.call(this), P.validateFormats = h;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: P, meta: F, schemaId: L } = this.opts;
      let h = k;
      L === "id" && (h = { ...k }, h.id = h.$id, delete h.$id), F && P && this.addMetaSchema(h, h[L], !1);
    }
    defaultMeta() {
      const { meta: P, schemaId: F } = this.opts;
      return this.opts.defaultMeta = typeof P == "object" ? P[F] || P : void 0;
    }
    validate(P, F) {
      let L;
      if (typeof P == "string") {
        if (L = this.getSchema(P), !L)
          throw new Error(`no schema with key or ref "${P}"`);
      } else
        L = this.compile(P);
      const h = L(F);
      return "$async" in L || (this.errors = L.errors), h;
    }
    compile(P, F) {
      const L = this._addSchema(P, F);
      return L.validate || this._compileSchemaEnv(L);
    }
    compileAsync(P, F) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: L } = this.opts;
      return h.call(this, P, F);
      async function h(ne, be) {
        await $.call(this, ne.$schema);
        const Ae = this._addSchema(ne, be);
        return Ae.validate || I.call(this, Ae);
      }
      async function $(ne) {
        ne && !this.getSchema(ne) && await h.call(this, { $ref: ne }, !0);
      }
      async function I(ne) {
        try {
          return this._compileSchemaEnv(ne);
        } catch (be) {
          if (!(be instanceof s.default))
            throw be;
          return H.call(this, be), await K.call(this, be.missingSchema), I.call(this, ne);
        }
      }
      function H({ missingSchema: ne, missingRef: be }) {
        if (this.refs[ne])
          throw new Error(`AnySchema ${ne} is loaded but ${be} cannot be resolved`);
      }
      async function K(ne) {
        const be = await te.call(this, ne);
        this.refs[ne] || await $.call(this, be.$schema), this.refs[ne] || this.addSchema(be, ne, F);
      }
      async function te(ne) {
        const be = this._loading[ne];
        if (be)
          return be;
        try {
          return await (this._loading[ne] = L(ne));
        } finally {
          delete this._loading[ne];
        }
      }
    }
    // Adds schema to the instance
    addSchema(P, F, L, h = this.opts.validateSchema) {
      if (Array.isArray(P)) {
        for (const I of P)
          this.addSchema(I, void 0, L, h);
        return this;
      }
      let $;
      if (typeof P == "object") {
        const { schemaId: I } = this.opts;
        if ($ = P[I], $ !== void 0 && typeof $ != "string")
          throw new Error(`schema ${I} must be string`);
      }
      return F = (0, _.normalizeId)(F || $), this._checkUnique(F), this.schemas[F] = this._addSchema(P, L, F, h, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(P, F, L = this.opts.validateSchema) {
      return this.addSchema(P, F, !0, L), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(P, F) {
      if (typeof P == "boolean")
        return !0;
      let L;
      if (L = P.$schema, L !== void 0 && typeof L != "string")
        throw new Error("$schema must be a string");
      if (L = L || this.opts.defaultMeta || this.defaultMeta(), !L)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const h = this.validate(L, P);
      if (!h && F) {
        const $ = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error($);
        else
          throw new Error($);
      }
      return h;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(P) {
      let F;
      for (; typeof (F = o.call(this, P)) == "string"; )
        P = F;
      if (F === void 0) {
        const { schemaId: L } = this.opts, h = new d.SchemaEnv({ schema: {}, schemaId: L });
        if (F = d.resolveSchema.call(this, h, P), !F)
          return;
        this.refs[P] = F;
      }
      return F.validate || this._compileSchemaEnv(F);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(P) {
      if (P instanceof RegExp)
        return this._removeAllSchemas(this.schemas, P), this._removeAllSchemas(this.refs, P), this;
      switch (typeof P) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const F = o.call(this, P);
          return typeof F == "object" && this._cache.delete(F.schema), delete this.schemas[P], delete this.refs[P], this;
        }
        case "object": {
          const F = P;
          this._cache.delete(F);
          let L = P[this.opts.schemaId];
          return L && (L = (0, _.normalizeId)(L), delete this.schemas[L], delete this.refs[L]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(P) {
      for (const F of P)
        this.addKeyword(F);
      return this;
    }
    addKeyword(P, F) {
      let L;
      if (typeof P == "string")
        L = P, typeof F == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), F.keyword = L);
      else if (typeof P == "object" && F === void 0) {
        if (F = P, L = F.keyword, Array.isArray(L) && !L.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (B.call(this, L, F), !F)
        return (0, m.eachItem)(L, ($) => G.call(this, $)), this;
      U.call(this, F);
      const h = {
        ...F,
        type: (0, y.getJSONTypes)(F.type),
        schemaType: (0, y.getJSONTypes)(F.schemaType)
      };
      return (0, m.eachItem)(L, h.type.length === 0 ? ($) => G.call(this, $, h) : ($) => h.type.forEach((I) => G.call(this, $, h, I))), this;
    }
    getKeyword(P) {
      const F = this.RULES.all[P];
      return typeof F == "object" ? F.definition : !!F;
    }
    // Remove keyword
    removeKeyword(P) {
      const { RULES: F } = this;
      delete F.keywords[P], delete F.all[P];
      for (const L of F.rules) {
        const h = L.rules.findIndex(($) => $.keyword === P);
        h >= 0 && L.rules.splice(h, 1);
      }
      return this;
    }
    // Add format
    addFormat(P, F) {
      return typeof F == "string" && (F = new RegExp(F)), this.formats[P] = F, this;
    }
    errorsText(P = this.errors, { separator: F = ", ", dataVar: L = "data" } = {}) {
      return !P || P.length === 0 ? "No errors" : P.map((h) => `${L}${h.instancePath} ${h.message}`).reduce((h, $) => h + F + $);
    }
    $dataMetaSchema(P, F) {
      const L = this.RULES.all;
      P = JSON.parse(JSON.stringify(P));
      for (const h of F) {
        const $ = h.split("/").slice(1);
        let I = P;
        for (const H of $)
          I = I[H];
        for (const H in L) {
          const K = L[H];
          if (typeof K != "object")
            continue;
          const { $data: te } = K.definition, ne = I[H];
          te && ne && (I[H] = J(ne));
        }
      }
      return P;
    }
    _removeAllSchemas(P, F) {
      for (const L in P) {
        const h = P[L];
        (!F || F.test(L)) && (typeof h == "string" ? delete P[L] : h && !h.meta && (this._cache.delete(h.schema), delete P[L]));
      }
    }
    _addSchema(P, F, L, h = this.opts.validateSchema, $ = this.opts.addUsedSchema) {
      let I;
      const { schemaId: H } = this.opts;
      if (typeof P == "object")
        I = P[H];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof P != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let K = this._cache.get(P);
      if (K !== void 0)
        return K;
      L = (0, _.normalizeId)(I || L);
      const te = _.getSchemaRefs.call(this, P, L);
      return K = new d.SchemaEnv({ schema: P, schemaId: H, meta: F, baseId: L, localRefs: te }), this._cache.set(K.schema, K), $ && !L.startsWith("#") && (L && this._checkUnique(L), this.refs[L] = K), h && this.validateSchema(P, !0), K;
    }
    _checkUnique(P) {
      if (this.schemas[P] || this.refs[P])
        throw new Error(`schema with key or id "${P}" already exists`);
    }
    _compileSchemaEnv(P) {
      if (P.meta ? this._compileMetaSchema(P) : d.compileSchema.call(this, P), !P.validate)
        throw new Error("ajv implementation error");
      return P.validate;
    }
    _compileMetaSchema(P) {
      const F = this.opts;
      this.opts = this._metaOpts;
      try {
        d.compileSchema.call(this, P);
      } finally {
        this.opts = F;
      }
    }
  }
  e.default = n, n.ValidationError = a.default, n.MissingRefError = s.default;
  function i(V, P, F, L = "error") {
    for (const h in V) {
      const $ = h;
      $ in P && this.logger[L](`${F}: option ${h}. ${V[$]}`);
    }
  }
  function o(V) {
    return V = (0, _.normalizeId)(V), this.schemas[V] || this.refs[V];
  }
  function c() {
    const V = this.opts.schemas;
    if (V)
      if (Array.isArray(V))
        this.addSchema(V);
      else
        for (const P in V)
          this.addSchema(V[P], P);
  }
  function u() {
    for (const V in this.opts.formats) {
      const P = this.opts.formats[V];
      P && this.addFormat(V, P);
    }
  }
  function f(V) {
    if (Array.isArray(V)) {
      this.addVocabulary(V);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const P in V) {
      const F = V[P];
      F.keyword || (F.keyword = P), this.addKeyword(F);
    }
  }
  function g() {
    const V = { ...this.opts };
    for (const P of j)
      delete V[P];
    return V;
  }
  const O = { log() {
  }, warn() {
  }, error() {
  } };
  function z(V) {
    if (V === !1)
      return O;
    if (V === void 0)
      return console;
    if (V.log && V.warn && V.error)
      return V;
    throw new Error("logger must implement log, warn and error methods");
  }
  const q = /^[a-z_$][a-z0-9_$:-]*$/i;
  function B(V, P) {
    const { RULES: F } = this;
    if ((0, m.eachItem)(V, (L) => {
      if (F.keywords[L])
        throw new Error(`Keyword ${L} is already defined`);
      if (!q.test(L))
        throw new Error(`Keyword ${L} has invalid name`);
    }), !!P && P.$data && !("code" in P || "validate" in P))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function G(V, P, F) {
    var L;
    const h = P == null ? void 0 : P.post;
    if (F && h)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: $ } = this;
    let I = h ? $.post : $.rules.find(({ type: K }) => K === F);
    if (I || (I = { type: F, rules: [] }, $.rules.push(I)), $.keywords[V] = !0, !P)
      return;
    const H = {
      keyword: V,
      definition: {
        ...P,
        type: (0, y.getJSONTypes)(P.type),
        schemaType: (0, y.getJSONTypes)(P.schemaType)
      }
    };
    P.before ? w.call(this, I, H, P.before) : I.rules.push(H), $.all[V] = H, (L = P.implements) === null || L === void 0 || L.forEach((K) => this.addKeyword(K));
  }
  function w(V, P, F) {
    const L = V.rules.findIndex((h) => h.keyword === F);
    L >= 0 ? V.rules.splice(L, 0, P) : (V.rules.push(P), this.logger.warn(`rule ${F} is not defined`));
  }
  function U(V) {
    let { metaSchema: P } = V;
    P !== void 0 && (V.$data && this.opts.$data && (P = J(P)), V.validateSchema = this.compile(P, !0));
  }
  const W = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function J(V) {
    return { anyOf: [V, W] };
  }
})(so);
var $a = {}, Pa = {}, Sa = {};
Object.defineProperty(Sa, "__esModule", { value: !0 });
const ol = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Sa.default = ol;
var jt = {};
Object.defineProperty(jt, "__esModule", { value: !0 });
jt.callRef = jt.getValidate = void 0;
const sl = wr, Tn = se, De = ie, zt = ct, Cn = Be, Tr = ce, il = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: a } = e, { baseId: s, schemaEnv: l, validateName: d, opts: b, self: _ } = a, { root: y } = l;
    if ((r === "#" || r === "#/") && s === y.baseId)
      return k();
    const m = Cn.resolveRef.call(_, y, s, r);
    if (m === void 0)
      throw new sl.default(a.opts.uriResolver, s, r);
    if (m instanceof Cn.SchemaEnv)
      return N(m);
    return A(m);
    function k() {
      if (l === y)
        return Rr(e, d, l, l.$async);
      const j = t.scopeValue("root", { ref: y });
      return Rr(e, (0, De._)`${j}.validate`, y, y.$async);
    }
    function N(j) {
      const C = Lo(e, j);
      Rr(e, C, j, j.$async);
    }
    function A(j) {
      const C = t.scopeValue("schema", b.code.source === !0 ? { ref: j, code: (0, De.stringify)(j) } : { ref: j }), x = t.name("valid"), v = e.subschema({
        schema: j,
        dataTypes: [],
        schemaPath: De.nil,
        topSchemaRef: C,
        errSchemaPath: r
      }, x);
      e.mergeEvaluated(v), e.ok(x);
    }
  }
};
function Lo(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, De._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
jt.getValidate = Lo;
function Rr(e, t, r, a) {
  const { gen: s, it: l } = e, { allErrors: d, schemaEnv: b, opts: _ } = l, y = _.passContext ? zt.default.this : De.nil;
  a ? m() : k();
  function m() {
    if (!b.$async)
      throw new Error("async schema referenced by sync schema");
    const j = s.let("valid");
    s.try(() => {
      s.code((0, De._)`await ${(0, Tn.callValidateCode)(e, t, y)}`), A(t), d || s.assign(j, !0);
    }, (C) => {
      s.if((0, De._)`!(${C} instanceof ${l.ValidationError})`, () => s.throw(C)), N(C), d || s.assign(j, !1);
    }), e.ok(j);
  }
  function k() {
    e.result((0, Tn.callValidateCode)(e, t, y), () => A(t), () => N(t));
  }
  function N(j) {
    const C = (0, De._)`${j}.errors`;
    s.assign(zt.default.vErrors, (0, De._)`${zt.default.vErrors} === null ? ${C} : ${zt.default.vErrors}.concat(${C})`), s.assign(zt.default.errors, (0, De._)`${zt.default.vErrors}.length`);
  }
  function A(j) {
    var C;
    if (!l.opts.unevaluated)
      return;
    const x = (C = r == null ? void 0 : r.validate) === null || C === void 0 ? void 0 : C.evaluated;
    if (l.props !== !0)
      if (x && !x.dynamicProps)
        x.props !== void 0 && (l.props = Tr.mergeEvaluated.props(s, x.props, l.props));
      else {
        const v = s.var("props", (0, De._)`${j}.evaluated.props`);
        l.props = Tr.mergeEvaluated.props(s, v, l.props, De.Name);
      }
    if (l.items !== !0)
      if (x && !x.dynamicItems)
        x.items !== void 0 && (l.items = Tr.mergeEvaluated.items(s, x.items, l.items));
      else {
        const v = s.var("items", (0, De._)`${j}.evaluated.items`);
        l.items = Tr.mergeEvaluated.items(s, v, l.items, De.Name);
      }
  }
}
jt.callRef = Rr;
jt.default = il;
Object.defineProperty(Pa, "__esModule", { value: !0 });
const ll = Sa, cl = jt, ul = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  ll.default,
  cl.default
];
Pa.default = ul;
var Ta = {}, Ca = {};
Object.defineProperty(Ca, "__esModule", { value: !0 });
const Vr = ie, gt = Vr.operators, Fr = {
  maximum: { okStr: "<=", ok: gt.LTE, fail: gt.GT },
  minimum: { okStr: ">=", ok: gt.GTE, fail: gt.LT },
  exclusiveMaximum: { okStr: "<", ok: gt.LT, fail: gt.GTE },
  exclusiveMinimum: { okStr: ">", ok: gt.GT, fail: gt.LTE }
}, dl = {
  message: ({ keyword: e, schemaCode: t }) => (0, Vr.str)`must be ${Fr[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Vr._)`{comparison: ${Fr[e].okStr}, limit: ${t}}`
}, hl = {
  keyword: Object.keys(Fr),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: dl,
  code(e) {
    const { keyword: t, data: r, schemaCode: a } = e;
    e.fail$data((0, Vr._)`${r} ${Fr[t].fail} ${a} || isNaN(${r})`);
  }
};
Ca.default = hl;
var xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const ur = ie, pl = {
  message: ({ schemaCode: e }) => (0, ur.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, ur._)`{multipleOf: ${e}}`
}, fl = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: pl,
  code(e) {
    const { gen: t, data: r, schemaCode: a, it: s } = e, l = s.opts.multipleOfPrecision, d = t.let("res"), b = l ? (0, ur._)`Math.abs(Math.round(${d}) - ${d}) > 1e-${l}` : (0, ur._)`${d} !== parseInt(${d})`;
    e.fail$data((0, ur._)`(${a} === 0 || (${d} = ${r}/${a}, ${b}))`);
  }
};
xa.default = fl;
var Oa = {}, Na = {};
Object.defineProperty(Na, "__esModule", { value: !0 });
function Ao(e) {
  const t = e.length;
  let r = 0, a = 0, s;
  for (; a < t; )
    r++, s = e.charCodeAt(a++), s >= 55296 && s <= 56319 && a < t && (s = e.charCodeAt(a), (s & 64512) === 56320 && a++);
  return r;
}
Na.default = Ao;
Ao.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Oa, "__esModule", { value: !0 });
const xt = ie, ml = ce, gl = Na, bl = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, xt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, xt._)`{limit: ${e}}`
}, yl = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: bl,
  code(e) {
    const { keyword: t, data: r, schemaCode: a, it: s } = e, l = t === "maxLength" ? xt.operators.GT : xt.operators.LT, d = s.opts.unicode === !1 ? (0, xt._)`${r}.length` : (0, xt._)`${(0, ml.useFunc)(e.gen, gl.default)}(${r})`;
    e.fail$data((0, xt._)`${d} ${l} ${a}`);
  }
};
Oa.default = yl;
var ja = {};
Object.defineProperty(ja, "__esModule", { value: !0 });
const _l = se, qr = ie, wl = {
  message: ({ schemaCode: e }) => (0, qr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, qr._)`{pattern: ${e}}`
}, vl = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: wl,
  code(e) {
    const { data: t, $data: r, schema: a, schemaCode: s, it: l } = e, d = l.opts.unicodeRegExp ? "u" : "", b = r ? (0, qr._)`(new RegExp(${s}, ${d}))` : (0, _l.usePattern)(e, a);
    e.fail$data((0, qr._)`!${b}.test(${t})`);
  }
};
ja.default = vl;
var La = {};
Object.defineProperty(La, "__esModule", { value: !0 });
const dr = ie, kl = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, dr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, dr._)`{limit: ${e}}`
}, El = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: kl,
  code(e) {
    const { keyword: t, data: r, schemaCode: a } = e, s = t === "maxProperties" ? dr.operators.GT : dr.operators.LT;
    e.fail$data((0, dr._)`Object.keys(${r}).length ${s} ${a}`);
  }
};
La.default = El;
var Aa = {};
Object.defineProperty(Aa, "__esModule", { value: !0 });
const or = se, hr = ie, $l = ce, Pl = {
  message: ({ params: { missingProperty: e } }) => (0, hr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, hr._)`{missingProperty: ${e}}`
}, Sl = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Pl,
  code(e) {
    const { gen: t, schema: r, schemaCode: a, data: s, $data: l, it: d } = e, { opts: b } = d;
    if (!l && r.length === 0)
      return;
    const _ = r.length >= b.loopRequired;
    if (d.allErrors ? y() : m(), b.strictRequired) {
      const A = e.parentSchema.properties, { definedProperties: j } = e.it;
      for (const C of r)
        if ((A == null ? void 0 : A[C]) === void 0 && !j.has(C)) {
          const x = d.schemaEnv.baseId + d.errSchemaPath, v = `required property "${C}" is not defined at "${x}" (strictRequired)`;
          (0, $l.checkStrictMode)(d, v, d.opts.strictRequired);
        }
    }
    function y() {
      if (_ || l)
        e.block$data(hr.nil, k);
      else
        for (const A of r)
          (0, or.checkReportMissingProp)(e, A);
    }
    function m() {
      const A = t.let("missing");
      if (_ || l) {
        const j = t.let("valid", !0);
        e.block$data(j, () => N(A, j)), e.ok(j);
      } else
        t.if((0, or.checkMissingProp)(e, r, A)), (0, or.reportMissingProp)(e, A), t.else();
    }
    function k() {
      t.forOf("prop", a, (A) => {
        e.setParams({ missingProperty: A }), t.if((0, or.noPropertyInData)(t, s, A, b.ownProperties), () => e.error());
      });
    }
    function N(A, j) {
      e.setParams({ missingProperty: A }), t.forOf(A, a, () => {
        t.assign(j, (0, or.propertyInData)(t, s, A, b.ownProperties)), t.if((0, hr.not)(j), () => {
          e.error(), t.break();
        });
      }, hr.nil);
    }
  }
};
Aa.default = Sl;
var Ra = {};
Object.defineProperty(Ra, "__esModule", { value: !0 });
const pr = ie, Tl = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, pr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, pr._)`{limit: ${e}}`
}, Cl = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Tl,
  code(e) {
    const { keyword: t, data: r, schemaCode: a } = e, s = t === "maxItems" ? pr.operators.GT : pr.operators.LT;
    e.fail$data((0, pr._)`${r}.length ${s} ${a}`);
  }
};
Ra.default = Cl;
var Ia = {}, vr = {};
Object.defineProperty(vr, "__esModule", { value: !0 });
const Ro = mo;
Ro.code = 'require("ajv/dist/runtime/equal").default';
vr.default = Ro;
Object.defineProperty(Ia, "__esModule", { value: !0 });
const oa = yr, Ce = ie, xl = ce, Ol = vr, Nl = {
  message: ({ params: { i: e, j: t } }) => (0, Ce.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Ce._)`{i: ${e}, j: ${t}}`
}, jl = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Nl,
  code(e) {
    const { gen: t, data: r, $data: a, schema: s, parentSchema: l, schemaCode: d, it: b } = e;
    if (!a && !s)
      return;
    const _ = t.let("valid"), y = l.items ? (0, oa.getSchemaTypes)(l.items) : [];
    e.block$data(_, m, (0, Ce._)`${d} === false`), e.ok(_);
    function m() {
      const j = t.let("i", (0, Ce._)`${r}.length`), C = t.let("j");
      e.setParams({ i: j, j: C }), t.assign(_, !0), t.if((0, Ce._)`${j} > 1`, () => (k() ? N : A)(j, C));
    }
    function k() {
      return y.length > 0 && !y.some((j) => j === "object" || j === "array");
    }
    function N(j, C) {
      const x = t.name("item"), v = (0, oa.checkDataTypes)(y, x, b.opts.strictNumbers, oa.DataType.Wrong), T = t.const("indices", (0, Ce._)`{}`);
      t.for((0, Ce._)`;${j}--;`, () => {
        t.let(x, (0, Ce._)`${r}[${j}]`), t.if(v, (0, Ce._)`continue`), y.length > 1 && t.if((0, Ce._)`typeof ${x} == "string"`, (0, Ce._)`${x} += "_"`), t.if((0, Ce._)`typeof ${T}[${x}] == "number"`, () => {
          t.assign(C, (0, Ce._)`${T}[${x}]`), e.error(), t.assign(_, !1).break();
        }).code((0, Ce._)`${T}[${x}] = ${j}`);
      });
    }
    function A(j, C) {
      const x = (0, xl.useFunc)(t, Ol.default), v = t.name("outer");
      t.label(v).for((0, Ce._)`;${j}--;`, () => t.for((0, Ce._)`${C} = ${j}; ${C}--;`, () => t.if((0, Ce._)`${x}(${r}[${j}], ${r}[${C}])`, () => {
        e.error(), t.assign(_, !1).break(v);
      })));
    }
  }
};
Ia.default = jl;
var Ma = {};
Object.defineProperty(Ma, "__esModule", { value: !0 });
const ha = ie, Ll = ce, Al = vr, Rl = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, ha._)`{allowedValue: ${e}}`
}, Il = {
  keyword: "const",
  $data: !0,
  error: Rl,
  code(e) {
    const { gen: t, data: r, $data: a, schemaCode: s, schema: l } = e;
    a || l && typeof l == "object" ? e.fail$data((0, ha._)`!${(0, Ll.useFunc)(t, Al.default)}(${r}, ${s})`) : e.fail((0, ha._)`${l} !== ${r}`);
  }
};
Ma.default = Il;
var Da = {};
Object.defineProperty(Da, "__esModule", { value: !0 });
const lr = ie, Ml = ce, Dl = vr, Bl = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, lr._)`{allowedValues: ${e}}`
}, zl = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Bl,
  code(e) {
    const { gen: t, data: r, $data: a, schema: s, schemaCode: l, it: d } = e;
    if (!a && s.length === 0)
      throw new Error("enum must have non-empty array");
    const b = s.length >= d.opts.loopEnum;
    let _;
    const y = () => _ ?? (_ = (0, Ml.useFunc)(t, Dl.default));
    let m;
    if (b || a)
      m = t.let("valid"), e.block$data(m, k);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const A = t.const("vSchema", l);
      m = (0, lr.or)(...s.map((j, C) => N(A, C)));
    }
    e.pass(m);
    function k() {
      t.assign(m, !1), t.forOf("v", l, (A) => t.if((0, lr._)`${y()}(${r}, ${A})`, () => t.assign(m, !0).break()));
    }
    function N(A, j) {
      const C = s[j];
      return typeof C == "object" && C !== null ? (0, lr._)`${y()}(${r}, ${A}[${j}])` : (0, lr._)`${r} === ${C}`;
    }
  }
};
Da.default = zl;
Object.defineProperty(Ta, "__esModule", { value: !0 });
const Vl = Ca, Fl = xa, ql = Oa, Ul = ja, Gl = La, Hl = Aa, Kl = Ra, Wl = Ia, Jl = Ma, Zl = Da, Yl = [
  // number
  Vl.default,
  Fl.default,
  // string
  ql.default,
  Ul.default,
  // object
  Gl.default,
  Hl.default,
  // array
  Kl.default,
  Wl.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Jl.default,
  Zl.default
];
Ta.default = Yl;
var Ba = {}, Wt = {};
Object.defineProperty(Wt, "__esModule", { value: !0 });
Wt.validateAdditionalItems = void 0;
const Ot = ie, pa = ce, Ql = {
  message: ({ params: { len: e } }) => (0, Ot.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Ot._)`{limit: ${e}}`
}, Xl = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Ql,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: a } = t;
    if (!Array.isArray(a)) {
      (0, pa.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Io(e, a);
  }
};
function Io(e, t) {
  const { gen: r, schema: a, data: s, keyword: l, it: d } = e;
  d.items = !0;
  const b = r.const("len", (0, Ot._)`${s}.length`);
  if (a === !1)
    e.setParams({ len: t.length }), e.pass((0, Ot._)`${b} <= ${t.length}`);
  else if (typeof a == "object" && !(0, pa.alwaysValidSchema)(d, a)) {
    const y = r.var("valid", (0, Ot._)`${b} <= ${t.length}`);
    r.if((0, Ot.not)(y), () => _(y)), e.ok(y);
  }
  function _(y) {
    r.forRange("i", t.length, b, (m) => {
      e.subschema({ keyword: l, dataProp: m, dataPropType: pa.Type.Num }, y), d.allErrors || r.if((0, Ot.not)(y), () => r.break());
    });
  }
}
Wt.validateAdditionalItems = Io;
Wt.default = Xl;
var za = {}, Jt = {};
Object.defineProperty(Jt, "__esModule", { value: !0 });
Jt.validateTuple = void 0;
const xn = ie, Ir = ce, ec = se, tc = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Mo(e, "additionalItems", t);
    r.items = !0, !(0, Ir.alwaysValidSchema)(r, t) && e.ok((0, ec.validateArray)(e));
  }
};
function Mo(e, t, r = e.schema) {
  const { gen: a, parentSchema: s, data: l, keyword: d, it: b } = e;
  m(s), b.opts.unevaluated && r.length && b.items !== !0 && (b.items = Ir.mergeEvaluated.items(a, r.length, b.items));
  const _ = a.name("valid"), y = a.const("len", (0, xn._)`${l}.length`);
  r.forEach((k, N) => {
    (0, Ir.alwaysValidSchema)(b, k) || (a.if((0, xn._)`${y} > ${N}`, () => e.subschema({
      keyword: d,
      schemaProp: N,
      dataProp: N
    }, _)), e.ok(_));
  });
  function m(k) {
    const { opts: N, errSchemaPath: A } = b, j = r.length, C = j === k.minItems && (j === k.maxItems || k[t] === !1);
    if (N.strictTuples && !C) {
      const x = `"${d}" is ${j}-tuple, but minItems or maxItems/${t} are not specified or different at path "${A}"`;
      (0, Ir.checkStrictMode)(b, x, N.strictTuples);
    }
  }
}
Jt.validateTuple = Mo;
Jt.default = tc;
Object.defineProperty(za, "__esModule", { value: !0 });
const rc = Jt, ac = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, rc.validateTuple)(e, "items")
};
za.default = ac;
var Va = {};
Object.defineProperty(Va, "__esModule", { value: !0 });
const On = ie, nc = ce, oc = se, sc = Wt, ic = {
  message: ({ params: { len: e } }) => (0, On.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, On._)`{limit: ${e}}`
}, lc = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: ic,
  code(e) {
    const { schema: t, parentSchema: r, it: a } = e, { prefixItems: s } = r;
    a.items = !0, !(0, nc.alwaysValidSchema)(a, t) && (s ? (0, sc.validateAdditionalItems)(e, s) : e.ok((0, oc.validateArray)(e)));
  }
};
Va.default = lc;
var Fa = {};
Object.defineProperty(Fa, "__esModule", { value: !0 });
const We = ie, Cr = ce, cc = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, We.str)`must contain at least ${e} valid item(s)` : (0, We.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, We._)`{minContains: ${e}}` : (0, We._)`{minContains: ${e}, maxContains: ${t}}`
}, uc = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: cc,
  code(e) {
    const { gen: t, schema: r, parentSchema: a, data: s, it: l } = e;
    let d, b;
    const { minContains: _, maxContains: y } = a;
    l.opts.next ? (d = _ === void 0 ? 1 : _, b = y) : d = 1;
    const m = t.const("len", (0, We._)`${s}.length`);
    if (e.setParams({ min: d, max: b }), b === void 0 && d === 0) {
      (0, Cr.checkStrictMode)(l, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (b !== void 0 && d > b) {
      (0, Cr.checkStrictMode)(l, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Cr.alwaysValidSchema)(l, r)) {
      let C = (0, We._)`${m} >= ${d}`;
      b !== void 0 && (C = (0, We._)`${C} && ${m} <= ${b}`), e.pass(C);
      return;
    }
    l.items = !0;
    const k = t.name("valid");
    b === void 0 && d === 1 ? A(k, () => t.if(k, () => t.break())) : d === 0 ? (t.let(k, !0), b !== void 0 && t.if((0, We._)`${s}.length > 0`, N)) : (t.let(k, !1), N()), e.result(k, () => e.reset());
    function N() {
      const C = t.name("_valid"), x = t.let("count", 0);
      A(C, () => t.if(C, () => j(x)));
    }
    function A(C, x) {
      t.forRange("i", 0, m, (v) => {
        e.subschema({
          keyword: "contains",
          dataProp: v,
          dataPropType: Cr.Type.Num,
          compositeRule: !0
        }, C), x();
      });
    }
    function j(C) {
      t.code((0, We._)`${C}++`), b === void 0 ? t.if((0, We._)`${C} >= ${d}`, () => t.assign(k, !0).break()) : (t.if((0, We._)`${C} > ${b}`, () => t.assign(k, !1).break()), d === 1 ? t.assign(k, !0) : t.if((0, We._)`${C} >= ${d}`, () => t.assign(k, !0)));
    }
  }
};
Fa.default = uc;
var Do = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = ie, r = ce, a = se;
  e.error = {
    message: ({ params: { property: _, depsCount: y, deps: m } }) => {
      const k = y === 1 ? "property" : "properties";
      return (0, t.str)`must have ${k} ${m} when property ${_} is present`;
    },
    params: ({ params: { property: _, depsCount: y, deps: m, missingProperty: k } }) => (0, t._)`{property: ${_},
    missingProperty: ${k},
    depsCount: ${y},
    deps: ${m}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(_) {
      const [y, m] = l(_);
      d(_, y), b(_, m);
    }
  };
  function l({ schema: _ }) {
    const y = {}, m = {};
    for (const k in _) {
      if (k === "__proto__")
        continue;
      const N = Array.isArray(_[k]) ? y : m;
      N[k] = _[k];
    }
    return [y, m];
  }
  function d(_, y = _.schema) {
    const { gen: m, data: k, it: N } = _;
    if (Object.keys(y).length === 0)
      return;
    const A = m.let("missing");
    for (const j in y) {
      const C = y[j];
      if (C.length === 0)
        continue;
      const x = (0, a.propertyInData)(m, k, j, N.opts.ownProperties);
      _.setParams({
        property: j,
        depsCount: C.length,
        deps: C.join(", ")
      }), N.allErrors ? m.if(x, () => {
        for (const v of C)
          (0, a.checkReportMissingProp)(_, v);
      }) : (m.if((0, t._)`${x} && (${(0, a.checkMissingProp)(_, C, A)})`), (0, a.reportMissingProp)(_, A), m.else());
    }
  }
  e.validatePropertyDeps = d;
  function b(_, y = _.schema) {
    const { gen: m, data: k, keyword: N, it: A } = _, j = m.name("valid");
    for (const C in y)
      (0, r.alwaysValidSchema)(A, y[C]) || (m.if(
        (0, a.propertyInData)(m, k, C, A.opts.ownProperties),
        () => {
          const x = _.subschema({ keyword: N, schemaProp: C }, j);
          _.mergeValidEvaluated(x, j);
        },
        () => m.var(j, !0)
        // TODO var
      ), _.ok(j));
  }
  e.validateSchemaDeps = b, e.default = s;
})(Do);
var qa = {};
Object.defineProperty(qa, "__esModule", { value: !0 });
const Bo = ie, dc = ce, hc = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Bo._)`{propertyName: ${e.propertyName}}`
}, pc = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: hc,
  code(e) {
    const { gen: t, schema: r, data: a, it: s } = e;
    if ((0, dc.alwaysValidSchema)(s, r))
      return;
    const l = t.name("valid");
    t.forIn("key", a, (d) => {
      e.setParams({ propertyName: d }), e.subschema({
        keyword: "propertyNames",
        data: d,
        dataTypes: ["string"],
        propertyName: d,
        compositeRule: !0
      }, l), t.if((0, Bo.not)(l), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(l);
  }
};
qa.default = pc;
var Xr = {};
Object.defineProperty(Xr, "__esModule", { value: !0 });
const xr = se, Ye = ie, fc = ct, Or = ce, mc = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Ye._)`{additionalProperty: ${e.additionalProperty}}`
}, gc = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: mc,
  code(e) {
    const { gen: t, schema: r, parentSchema: a, data: s, errsCount: l, it: d } = e;
    if (!l)
      throw new Error("ajv implementation error");
    const { allErrors: b, opts: _ } = d;
    if (d.props = !0, _.removeAdditional !== "all" && (0, Or.alwaysValidSchema)(d, r))
      return;
    const y = (0, xr.allSchemaProperties)(a.properties), m = (0, xr.allSchemaProperties)(a.patternProperties);
    k(), e.ok((0, Ye._)`${l} === ${fc.default.errors}`);
    function k() {
      t.forIn("key", s, (x) => {
        !y.length && !m.length ? j(x) : t.if(N(x), () => j(x));
      });
    }
    function N(x) {
      let v;
      if (y.length > 8) {
        const T = (0, Or.schemaRefOrVal)(d, a.properties, "properties");
        v = (0, xr.isOwnProperty)(t, T, x);
      } else
        y.length ? v = (0, Ye.or)(...y.map((T) => (0, Ye._)`${x} === ${T}`)) : v = Ye.nil;
      return m.length && (v = (0, Ye.or)(v, ...m.map((T) => (0, Ye._)`${(0, xr.usePattern)(e, T)}.test(${x})`))), (0, Ye.not)(v);
    }
    function A(x) {
      t.code((0, Ye._)`delete ${s}[${x}]`);
    }
    function j(x) {
      if (_.removeAdditional === "all" || _.removeAdditional && r === !1) {
        A(x);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: x }), e.error(), b || t.break();
        return;
      }
      if (typeof r == "object" && !(0, Or.alwaysValidSchema)(d, r)) {
        const v = t.name("valid");
        _.removeAdditional === "failing" ? (C(x, v, !1), t.if((0, Ye.not)(v), () => {
          e.reset(), A(x);
        })) : (C(x, v), b || t.if((0, Ye.not)(v), () => t.break()));
      }
    }
    function C(x, v, T) {
      const R = {
        keyword: "additionalProperties",
        dataProp: x,
        dataPropType: Or.Type.Str
      };
      T === !1 && Object.assign(R, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(R, v);
    }
  }
};
Xr.default = gc;
var Ua = {};
Object.defineProperty(Ua, "__esModule", { value: !0 });
const bc = rt, Nn = se, sa = ce, jn = Xr, yc = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: a, data: s, it: l } = e;
    l.opts.removeAdditional === "all" && a.additionalProperties === void 0 && jn.default.code(new bc.KeywordCxt(l, jn.default, "additionalProperties"));
    const d = (0, Nn.allSchemaProperties)(r);
    for (const k of d)
      l.definedProperties.add(k);
    l.opts.unevaluated && d.length && l.props !== !0 && (l.props = sa.mergeEvaluated.props(t, (0, sa.toHash)(d), l.props));
    const b = d.filter((k) => !(0, sa.alwaysValidSchema)(l, r[k]));
    if (b.length === 0)
      return;
    const _ = t.name("valid");
    for (const k of b)
      y(k) ? m(k) : (t.if((0, Nn.propertyInData)(t, s, k, l.opts.ownProperties)), m(k), l.allErrors || t.else().var(_, !0), t.endIf()), e.it.definedProperties.add(k), e.ok(_);
    function y(k) {
      return l.opts.useDefaults && !l.compositeRule && r[k].default !== void 0;
    }
    function m(k) {
      e.subschema({
        keyword: "properties",
        schemaProp: k,
        dataProp: k
      }, _);
    }
  }
};
Ua.default = yc;
var Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
const Ln = se, Nr = ie, An = ce, Rn = ce, _c = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: a, parentSchema: s, it: l } = e, { opts: d } = l, b = (0, Ln.allSchemaProperties)(r), _ = b.filter((C) => (0, An.alwaysValidSchema)(l, r[C]));
    if (b.length === 0 || _.length === b.length && (!l.opts.unevaluated || l.props === !0))
      return;
    const y = d.strictSchema && !d.allowMatchingProperties && s.properties, m = t.name("valid");
    l.props !== !0 && !(l.props instanceof Nr.Name) && (l.props = (0, Rn.evaluatedPropsToName)(t, l.props));
    const { props: k } = l;
    N();
    function N() {
      for (const C of b)
        y && A(C), l.allErrors ? j(C) : (t.var(m, !0), j(C), t.if(m));
    }
    function A(C) {
      for (const x in y)
        new RegExp(C).test(x) && (0, An.checkStrictMode)(l, `property ${x} matches pattern ${C} (use allowMatchingProperties)`);
    }
    function j(C) {
      t.forIn("key", a, (x) => {
        t.if((0, Nr._)`${(0, Ln.usePattern)(e, C)}.test(${x})`, () => {
          const v = _.includes(C);
          v || e.subschema({
            keyword: "patternProperties",
            schemaProp: C,
            dataProp: x,
            dataPropType: Rn.Type.Str
          }, m), l.opts.unevaluated && k !== !0 ? t.assign((0, Nr._)`${k}[${x}]`, !0) : !v && !l.allErrors && t.if((0, Nr.not)(m), () => t.break());
        });
      });
    }
  }
};
Ga.default = _c;
var Ha = {};
Object.defineProperty(Ha, "__esModule", { value: !0 });
const wc = ce, vc = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: a } = e;
    if ((0, wc.alwaysValidSchema)(a, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
Ha.default = vc;
var Ka = {};
Object.defineProperty(Ka, "__esModule", { value: !0 });
const kc = se, Ec = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: kc.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Ka.default = Ec;
var Wa = {};
Object.defineProperty(Wa, "__esModule", { value: !0 });
const Mr = ie, $c = ce, Pc = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Mr._)`{passingSchemas: ${e.passing}}`
}, Sc = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Pc,
  code(e) {
    const { gen: t, schema: r, parentSchema: a, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && a.discriminator)
      return;
    const l = r, d = t.let("valid", !1), b = t.let("passing", null), _ = t.name("_valid");
    e.setParams({ passing: b }), t.block(y), e.result(d, () => e.reset(), () => e.error(!0));
    function y() {
      l.forEach((m, k) => {
        let N;
        (0, $c.alwaysValidSchema)(s, m) ? t.var(_, !0) : N = e.subschema({
          keyword: "oneOf",
          schemaProp: k,
          compositeRule: !0
        }, _), k > 0 && t.if((0, Mr._)`${_} && ${d}`).assign(d, !1).assign(b, (0, Mr._)`[${b}, ${k}]`).else(), t.if(_, () => {
          t.assign(d, !0), t.assign(b, k), N && e.mergeEvaluated(N, Mr.Name);
        });
      });
    }
  }
};
Wa.default = Sc;
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
const Tc = ce, Cc = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: a } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((l, d) => {
      if ((0, Tc.alwaysValidSchema)(a, l))
        return;
      const b = e.subschema({ keyword: "allOf", schemaProp: d }, s);
      e.ok(s), e.mergeEvaluated(b);
    });
  }
};
Ja.default = Cc;
var Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
const Ur = ie, zo = ce, xc = {
  message: ({ params: e }) => (0, Ur.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Ur._)`{failingKeyword: ${e.ifClause}}`
}, Oc = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: xc,
  code(e) {
    const { gen: t, parentSchema: r, it: a } = e;
    r.then === void 0 && r.else === void 0 && (0, zo.checkStrictMode)(a, '"if" without "then" and "else" is ignored');
    const s = In(a, "then"), l = In(a, "else");
    if (!s && !l)
      return;
    const d = t.let("valid", !0), b = t.name("_valid");
    if (_(), e.reset(), s && l) {
      const m = t.let("ifClause");
      e.setParams({ ifClause: m }), t.if(b, y("then", m), y("else", m));
    } else
      s ? t.if(b, y("then")) : t.if((0, Ur.not)(b), y("else"));
    e.pass(d, () => e.error(!0));
    function _() {
      const m = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, b);
      e.mergeEvaluated(m);
    }
    function y(m, k) {
      return () => {
        const N = e.subschema({ keyword: m }, b);
        t.assign(d, b), e.mergeValidEvaluated(N, d), k ? t.assign(k, (0, Ur._)`${m}`) : e.setParams({ ifClause: m });
      };
    }
  }
};
function In(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, zo.alwaysValidSchema)(e, r);
}
Za.default = Oc;
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const Nc = ce, jc = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Nc.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Ya.default = jc;
Object.defineProperty(Ba, "__esModule", { value: !0 });
const Lc = Wt, Ac = za, Rc = Jt, Ic = Va, Mc = Fa, Dc = Do, Bc = qa, zc = Xr, Vc = Ua, Fc = Ga, qc = Ha, Uc = Ka, Gc = Wa, Hc = Ja, Kc = Za, Wc = Ya;
function Jc(e = !1) {
  const t = [
    // any
    qc.default,
    Uc.default,
    Gc.default,
    Hc.default,
    Kc.default,
    Wc.default,
    // object
    Bc.default,
    zc.default,
    Dc.default,
    Vc.default,
    Fc.default
  ];
  return e ? t.push(Ac.default, Ic.default) : t.push(Lc.default, Rc.default), t.push(Mc.default), t;
}
Ba.default = Jc;
var Qa = {}, Xa = {};
Object.defineProperty(Xa, "__esModule", { value: !0 });
const ve = ie, Zc = {
  message: ({ schemaCode: e }) => (0, ve.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, ve._)`{format: ${e}}`
}, Yc = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Zc,
  code(e, t) {
    const { gen: r, data: a, $data: s, schema: l, schemaCode: d, it: b } = e, { opts: _, errSchemaPath: y, schemaEnv: m, self: k } = b;
    if (!_.validateFormats)
      return;
    s ? N() : A();
    function N() {
      const j = r.scopeValue("formats", {
        ref: k.formats,
        code: _.code.formats
      }), C = r.const("fDef", (0, ve._)`${j}[${d}]`), x = r.let("fType"), v = r.let("format");
      r.if((0, ve._)`typeof ${C} == "object" && !(${C} instanceof RegExp)`, () => r.assign(x, (0, ve._)`${C}.type || "string"`).assign(v, (0, ve._)`${C}.validate`), () => r.assign(x, (0, ve._)`"string"`).assign(v, C)), e.fail$data((0, ve.or)(T(), R()));
      function T() {
        return _.strictSchema === !1 ? ve.nil : (0, ve._)`${d} && !${v}`;
      }
      function R() {
        const n = m.$async ? (0, ve._)`(${C}.async ? await ${v}(${a}) : ${v}(${a}))` : (0, ve._)`${v}(${a})`, i = (0, ve._)`(typeof ${v} == "function" ? ${n} : ${v}.test(${a}))`;
        return (0, ve._)`${v} && ${v} !== true && ${x} === ${t} && !${i}`;
      }
    }
    function A() {
      const j = k.formats[l];
      if (!j) {
        T();
        return;
      }
      if (j === !0)
        return;
      const [C, x, v] = R(j);
      C === t && e.pass(n());
      function T() {
        if (_.strictSchema === !1) {
          k.logger.warn(i());
          return;
        }
        throw new Error(i());
        function i() {
          return `unknown format "${l}" ignored in schema at path "${y}"`;
        }
      }
      function R(i) {
        const o = i instanceof RegExp ? (0, ve.regexpCode)(i) : _.code.formats ? (0, ve._)`${_.code.formats}${(0, ve.getProperty)(l)}` : void 0, c = r.scopeValue("formats", { key: l, ref: i, code: o });
        return typeof i == "object" && !(i instanceof RegExp) ? [i.type || "string", i.validate, (0, ve._)`${c}.validate`] : ["string", i, c];
      }
      function n() {
        if (typeof j == "object" && !(j instanceof RegExp) && j.async) {
          if (!m.$async)
            throw new Error("async format in sync schema");
          return (0, ve._)`await ${v}(${a})`;
        }
        return typeof x == "function" ? (0, ve._)`${v}(${a})` : (0, ve._)`${v}.test(${a})`;
      }
    }
  }
};
Xa.default = Yc;
Object.defineProperty(Qa, "__esModule", { value: !0 });
const Qc = Xa, Xc = [Qc.default];
Qa.default = Xc;
var Kt = {};
Object.defineProperty(Kt, "__esModule", { value: !0 });
Kt.contentVocabulary = Kt.metadataVocabulary = void 0;
Kt.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Kt.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty($a, "__esModule", { value: !0 });
const eu = Pa, tu = Ta, ru = Ba, au = Qa, Mn = Kt, nu = [
  eu.default,
  tu.default,
  (0, ru.default)(),
  au.default,
  Mn.metadataVocabulary,
  Mn.contentVocabulary
];
$a.default = nu;
var en = {}, Vo = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.DiscrError = void 0, function(t) {
    t.Tag = "tag", t.Mapping = "mapping";
  }(e.DiscrError || (e.DiscrError = {}));
})(Vo);
Object.defineProperty(en, "__esModule", { value: !0 });
const Vt = ie, fa = Vo, Dn = Be, ou = ce, su = {
  message: ({ params: { discrError: e, tagName: t } }) => e === fa.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, Vt._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, iu = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: su,
  code(e) {
    const { gen: t, data: r, schema: a, parentSchema: s, it: l } = e, { oneOf: d } = s;
    if (!l.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const b = a.propertyName;
    if (typeof b != "string")
      throw new Error("discriminator: requires propertyName");
    if (a.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!d)
      throw new Error("discriminator: requires oneOf keyword");
    const _ = t.let("valid", !1), y = t.const("tag", (0, Vt._)`${r}${(0, Vt.getProperty)(b)}`);
    t.if((0, Vt._)`typeof ${y} == "string"`, () => m(), () => e.error(!1, { discrError: fa.DiscrError.Tag, tag: y, tagName: b })), e.ok(_);
    function m() {
      const A = N();
      t.if(!1);
      for (const j in A)
        t.elseIf((0, Vt._)`${y} === ${j}`), t.assign(_, k(A[j]));
      t.else(), e.error(!1, { discrError: fa.DiscrError.Mapping, tag: y, tagName: b }), t.endIf();
    }
    function k(A) {
      const j = t.name("valid"), C = e.subschema({ keyword: "oneOf", schemaProp: A }, j);
      return e.mergeEvaluated(C, Vt.Name), j;
    }
    function N() {
      var A;
      const j = {}, C = v(s);
      let x = !0;
      for (let n = 0; n < d.length; n++) {
        let i = d[n];
        i != null && i.$ref && !(0, ou.schemaHasRulesButRef)(i, l.self.RULES) && (i = Dn.resolveRef.call(l.self, l.schemaEnv.root, l.baseId, i == null ? void 0 : i.$ref), i instanceof Dn.SchemaEnv && (i = i.schema));
        const o = (A = i == null ? void 0 : i.properties) === null || A === void 0 ? void 0 : A[b];
        if (typeof o != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${b}"`);
        x = x && (C || v(i)), T(o, n);
      }
      if (!x)
        throw new Error(`discriminator: "${b}" must be required`);
      return j;
      function v({ required: n }) {
        return Array.isArray(n) && n.includes(b);
      }
      function T(n, i) {
        if (n.const)
          R(n.const, i);
        else if (n.enum)
          for (const o of n.enum)
            R(o, i);
        else
          throw new Error(`discriminator: "properties/${b}" must have "const" or "enum"`);
      }
      function R(n, i) {
        if (typeof n != "string" || n in j)
          throw new Error(`discriminator: "${b}" values must be unique strings`);
        j[n] = i;
      }
    }
  }
};
en.default = iu;
const lu = "http://json-schema.org/draft-07/schema#", cu = "http://json-schema.org/draft-07/schema#", uu = "Core schema meta-schema", du = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, hu = [
  "object",
  "boolean"
], pu = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, fu = {
  $schema: lu,
  $id: cu,
  title: uu,
  definitions: du,
  type: hu,
  properties: pu,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = void 0;
  const r = so, a = $a, s = en, l = fu, d = ["/properties"], b = "http://json-schema.org/draft-07/schema";
  class _ extends r.default {
    _addVocabularies() {
      super._addVocabularies(), a.default.forEach((j) => this.addVocabulary(j)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const j = this.opts.$data ? this.$dataMetaSchema(l, d) : l;
      this.addMetaSchema(j, b, !1), this.refs["http://json-schema.org/schema"] = b;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(b) ? b : void 0);
    }
  }
  e.exports = t = _, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = _;
  var y = rt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return y.KeywordCxt;
  } });
  var m = ie;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return m._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return m.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return m.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return m.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return m.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return m.CodeGen;
  } });
  var k = _r;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return k.default;
  } });
  var N = wr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return N.default;
  } });
})(la, la.exports);
var mu = la.exports;
const gu = /* @__PURE__ */ oo(mu);
class bu {
  constructor() {
    Te(this, "ajv"), this.ajv = new gu();
  }
  validateJson(t, r) {
    const a = this.ajv.validate(t, r);
    return a ? { valid: a } : { valid: a, error: this.ajv.errorsText() };
  }
  validateObjectSchema(t, r) {
    const a = this.ajv.validate(t, r);
    return a ? { valid: a } : { valid: a, error: this.ajv.errorsText() };
  }
}
class yu {
  constructor() {
    Te(this, "TIME_SPLIT", " ");
  }
  /**
   * 给日期添加小时
   *
   * @param date - Date
   * @param numOfHours - 数字
   * @author terwer
   * @since 1.0.0
   */
  addHoursToDate(t, r) {
    return t.setTime(t.getTime() + r * 60 * 60 * 1e3), t;
  }
  /**
   * 转换ISO日期为中文日期的通用转换方法
   *
   * @param str - '2022-07-18T06:25:48.000Z
   * @param isAddTimeZone - 是否增加时区（默认不增加）
   * @param isShort - 是否只返回日期
   * @author terwer
   * @since 1.0.0
   */
  formatIsoToZhDateFormat(t, r, a) {
    if (!t)
      return "";
    let s = t;
    const l = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(.\d{3})Z$/gm, d = s.match(l);
    if (d == null)
      return t;
    for (let b = 0; b < d.length; b++) {
      const _ = d[b];
      let y = _;
      r && (y = this.addHoursToDate(new Date(_), 8).toISOString());
      const m = y.split("T"), k = m[0], N = m[1].split(".")[0];
      let A = k + this.TIME_SPLIT + N;
      a && (A = k), s = s.replace(_, A);
    }
    return s;
  }
  /**
   * 转换ISO日期为中文完整时间
   *
   * @param str - '2022-07-18T06:25:48.000Z
   */
  formatIsoToZh(t) {
    return this.formatIsoToZhDateFormat(t, !1, !1);
  }
  /**
   * 转换ISO日期为中文日期
   *
   * @param str - '2022-07-18T06:25:48.000Z
   */
  formatIsoToZhDate(t) {
    return this.formatIsoToZhDateFormat(t, !1, !0);
  }
  /**
   * 转换ISO日期为中文时间
   *
   * @param str - '2022-07-18T06:25:48.000Z
   */
  formatIsoToZhTime(t) {
    return this.formatIsoToZhDateFormat(t, !1).split(this.TIME_SPLIT)[1];
  }
  /**
   * 当前日期时间完整格式，格式：2023-03-10 02:03:43
   */
  nowZh() {
    return this.formatIsoToZhDateFormat((/* @__PURE__ */ new Date()).toISOString(), !0);
  }
  /**
   * 当前日期，格式：2023-03-10
   */
  nowDateZh() {
    return this.formatIsoToZhDateFormat((/* @__PURE__ */ new Date()).toISOString(), !0, !0);
  }
  /**
   * 当前时间，格式：02:03:43
   */
  nowTimeZh() {
    return this.formatIsoToZhDateFormat((/* @__PURE__ */ new Date()).toISOString(), !0).split(this.TIME_SPLIT)[1];
  }
}
class _u {
  /**
   * 格式化字符串
   *
   * @param str - 字符串，可用占位符，例如：test \{0\} str
   * @param args - 按占位符顺序排列的参数
   * @author terwer
   * @since 0.0.1
   */
  f(t, ...r) {
    let a = t;
    for (let s = 0; s < r.length; s++) {
      const l = r[s];
      typeof l == "string" ? a = a.replace(`{${s}}`, l) : a = a.replace(`{${s}}`, l.toString());
    }
    return a;
  }
  /**
   * 字符串拼接
   *
   * @param str - 字符串数组
   */
  appendStr(...t) {
    return t.join("");
  }
  /**
   * 判断字符串中，是否包含数组中任何一个元素
   *
   * @param str - 字符串
   * @param arr - 字符串数组
   */
  includeInArray(t, r) {
    let a = !1;
    for (let s = 0; s < r.length; s++) {
      const l = r[s];
      t.includes(l) && (a = !0);
    }
    return a;
  }
  /**
   * 截取指定长度的字符串
   *
   * @param str - str
   * @param length - 长度
   * @param ignore - 不要结尾省略号
   */
  getByLength(t, r, a) {
    const s = t;
    return s.length < r ? s : a ? s.substring(0, r) : s.substring(0, r) + "...";
  }
  /**
   * 字符串空值检测
   *
   * @param str - 待检测的字符串
   */
  isEmptyString(t) {
    return !t || typeof t != "string" ? !0 : t.trim().length === 0;
  }
  /**
   * 路径组合，解决多出来/的问题
   *
   * @param path1 - 路径1
   * @param path2 - 路径2
   */
  pathJoin(t, r) {
    let a = t;
    const s = t.lastIndexOf("/");
    return s + 1 === t.length && (a = t.substring(0, s)), r.indexOf("/") > 0 ? a = a + "/" + r : a = a + r, a;
  }
  /**
   * 强转boolean
   *
   * @param val - val
   */
  parseBoolean(t) {
    return t || (t = "false"), t.toString().toLowerCase() === "true";
  }
}
const ia = (e, t) => {
  const r = Bn(e), a = Bn(t), s = r.pop(), l = a.pop(), d = Fn(r, a);
  return d !== 0 ? d : s && l ? Fn(s.split("."), l.split(".")) : s || l ? s ? -1 : 1 : 0;
}, wu = /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i, Bn = (e) => {
  if (typeof e != "string")
    throw new TypeError("Invalid argument expected string");
  const t = e.match(wu);
  if (!t)
    throw new Error(`Invalid argument not valid semver ('${e}' received)`);
  return t.shift(), t;
}, zn = (e) => e === "*" || e === "x" || e === "X", Vn = (e) => {
  const t = parseInt(e, 10);
  return isNaN(t) ? e : t;
}, vu = (e, t) => typeof e != typeof t ? [String(e), String(t)] : [e, t], ku = (e, t) => {
  if (zn(e) || zn(t))
    return 0;
  const [r, a] = vu(Vn(e), Vn(t));
  return r > a ? 1 : r < a ? -1 : 0;
}, Fn = (e, t) => {
  for (let r = 0; r < Math.max(e.length, t.length); r++) {
    const a = ku(e[r] || "0", t[r] || "0");
    if (a !== 0)
      return a;
  }
  return 0;
};
class Eu {
  /**
   * Compare [semver](https://semver.org/) version strings
   * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
   *
   * @param v1 - First version to compare
   * @param v2 - Second version to compare
   * @returns boolean true if v1 is higher than v2
   */
  greater(t, r) {
    return ia(t, r) > 0;
  }
  /**
   * Compare [semver](https://semver.org/) version strings
   * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
   *
   * @param v1 - First version to compare
   * @param v2 - Second version to compare
   * @returns boolean true if v1 is equal to v2
   */
  equal(t, r) {
    return ia(t, r) === 0;
  }
  /**
   * Compare [semver](https://semver.org/) version strings
   * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
   *
   * @param v1 - First version to compare
   * @param v2 - Second version to compare
   * @returns boolean true if v1 is lesser than v2
   */
  lesser(t, r) {
    return ia(t, r) < 0;
  }
}
var $u = Object.defineProperty, Pu = (e, t, r) => t in e ? $u(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, Ft = (e, t, r) => (Pu(e, typeof t != "symbol" ? t + "" : t, r), r);
let bt = class {
};
Ft(bt, "NODE_ENV_KEY", "NODE_ENV"), /**
* 开发环境
*/
Ft(bt, "NODE_ENV_DEVELOPMENT", "development"), /**
* 生产环境
*/
Ft(bt, "NODE_ENV_PRODUCTION", "production"), /**
* 测试环境
*/
Ft(bt, "NODE_ENV_TEST", "test"), /**
* 是否处于调试模式
*/
Ft(bt, "VITE_DEBUG_MODE_KEY", "VITE_DEBUG_MODE");
class Su {
  /**
   * 环境初始化
   *
   * @param envMeta - 需要传入 {"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":false} 。特别提醒：此参数是静态元数据，取决于最终使用的项目。因此仅仅在最终使用的地方显示传递此值，中间项目请保持参数传递
   * @see {@link https://vitejs.dev/guide/env-and-mode.html#production-replacement}
   */
  constructor(t) {
    Ft(this, "envMeta"), this.envMeta = t;
  }
  /**
   * 是否是开发阶段调试
   */
  isNodeDev() {
    return this.getEnv(bt.NODE_ENV_KEY) === bt.NODE_ENV_DEVELOPMENT;
  }
  /**
   * 是否是调试阶段
   */
  isDev() {
    return this.isNodeDev() || this.getBooleanEnv(bt.VITE_DEBUG_MODE_KEY);
  }
  /**
   * 获取环境变量，key不存在返回undefined
   * @param key - key
   */
  getEnv(t) {
    let r;
    try {
      this.envMeta[t] && (r = this.envMeta[t]);
    } catch {
    }
    return r;
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
    let r = !1;
    return this.getEnv(t) && (r = this.getStringEnv(t).toLowerCase() === "true"), r;
  }
  /**
   * 获取环境变量，如果未定义或者为空值，用指定的默认值代替
   *
   * @param key - key
   * @param defaultValue - 默认值
   * @since 0.1.0
   * @author terwer
   */
  getEnvOrDefault(t, r) {
    const a = this.getStringEnv(t);
    return a.trim().length == 0 ? r : a;
  }
}
var Tu = Object.defineProperty, Cu = (e, t, r) => t in e ? Tu(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, Ut = (e, t, r) => (Cu(e, typeof t != "symbol" ? t + "" : t, r), r);
class Gr {
}
Ut(Gr, "LOG_LEVEL_KEY", "VITE_LOG_LEVEL"), Ut(Gr, "LOG_PREFIX_KEY", "VITE_LOG_PREFIX");
var st = /* @__PURE__ */ ((e) => (e.LOG_LEVEL_TRACE = "TRACE", e.LOG_LEVEL_DEBUG = "DEBUG", e.LOG_LEVEL_INFO = "INFO", e.LOG_LEVEL_WARN = "WARN", e.LOG_LEVEL_ERROR = "ERROR", e))(st || {}), Fo = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function tn(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var qo = { exports: {} };
(function(e) {
  (function(t, r) {
    e.exports ? e.exports = r() : t.log = r();
  })(Fo, function() {
    var t = function() {
    }, r = "undefined", a = typeof window !== r && typeof window.navigator !== r && /Trident\/|MSIE /.test(window.navigator.userAgent), s = [
      "trace",
      "debug",
      "info",
      "warn",
      "error"
    ];
    function l(C, x) {
      var v = C[x];
      if (typeof v.bind == "function")
        return v.bind(C);
      try {
        return Function.prototype.bind.call(v, C);
      } catch {
        return function() {
          return Function.prototype.apply.apply(v, [C, arguments]);
        };
      }
    }
    function d() {
      console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
    }
    function b(C) {
      return C === "debug" && (C = "log"), typeof console === r ? !1 : C === "trace" && a ? d : console[C] !== void 0 ? l(console, C) : console.log !== void 0 ? l(console, "log") : t;
    }
    function _(C, x) {
      for (var v = 0; v < s.length; v++) {
        var T = s[v];
        this[T] = v < C ? t : this.methodFactory(T, C, x);
      }
      this.log = this.debug;
    }
    function y(C, x, v) {
      return function() {
        typeof console !== r && (_.call(this, x, v), this[C].apply(this, arguments));
      };
    }
    function m(C, x, v) {
      return b(C) || y.apply(this, arguments);
    }
    function k(C, x, v) {
      var T = this, R;
      x = x ?? "WARN";
      var n = "loglevel";
      typeof C == "string" ? n += ":" + C : typeof C == "symbol" && (n = void 0);
      function i(f) {
        var g = (s[f] || "silent").toUpperCase();
        if (!(typeof window === r || !n)) {
          try {
            window.localStorage[n] = g;
            return;
          } catch {
          }
          try {
            window.document.cookie = encodeURIComponent(n) + "=" + g + ";";
          } catch {
          }
        }
      }
      function o() {
        var f;
        if (!(typeof window === r || !n)) {
          try {
            f = window.localStorage[n];
          } catch {
          }
          if (typeof f === r)
            try {
              var g = window.document.cookie, O = g.indexOf(
                encodeURIComponent(n) + "="
              );
              O !== -1 && (f = /^([^;]+)/.exec(g.slice(O))[1]);
            } catch {
            }
          return T.levels[f] === void 0 && (f = void 0), f;
        }
      }
      function c() {
        if (!(typeof window === r || !n)) {
          try {
            window.localStorage.removeItem(n);
            return;
          } catch {
          }
          try {
            window.document.cookie = encodeURIComponent(n) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
          } catch {
          }
        }
      }
      T.name = C, T.levels = {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        SILENT: 5
      }, T.methodFactory = v || m, T.getLevel = function() {
        return R;
      }, T.setLevel = function(f, g) {
        if (typeof f == "string" && T.levels[f.toUpperCase()] !== void 0 && (f = T.levels[f.toUpperCase()]), typeof f == "number" && f >= 0 && f <= T.levels.SILENT) {
          if (R = f, g !== !1 && i(f), _.call(T, f, C), typeof console === r && f < T.levels.SILENT)
            return "No console available for logging";
        } else
          throw "log.setLevel() called with invalid level: " + f;
      }, T.setDefaultLevel = function(f) {
        x = f, o() || T.setLevel(f, !1);
      }, T.resetLevel = function() {
        T.setLevel(x, !1), c();
      }, T.enableAll = function(f) {
        T.setLevel(T.levels.TRACE, f);
      }, T.disableAll = function(f) {
        T.setLevel(T.levels.SILENT, f);
      };
      var u = o();
      u == null && (u = x), T.setLevel(u, !1);
    }
    var N = new k(), A = {};
    N.getLogger = function(C) {
      if (typeof C != "symbol" && typeof C != "string" || C === "")
        throw new TypeError("You must supply a name when creating a logger.");
      var x = A[C];
      return x || (x = A[C] = new k(
        C,
        N.getLevel(),
        N.methodFactory
      )), x;
    };
    var j = typeof window !== r ? window.log : void 0;
    return N.noConflict = function() {
      return typeof window !== r && window.log === N && (window.log = j), N;
    }, N.getLoggers = function() {
      return A;
    }, N.default = N, N;
  });
})(qo);
var xu = qo.exports;
const jr = /* @__PURE__ */ tn(xu);
var Uo = { exports: {} };
(function(e) {
  (function(t, r) {
    e.exports ? e.exports = r() : t.prefix = r(t);
  })(Fo, function(t) {
    var r = function(m) {
      for (var k = 1, N = arguments.length, A; k < N; k++)
        for (A in arguments[k])
          Object.prototype.hasOwnProperty.call(arguments[k], A) && (m[A] = arguments[k][A]);
      return m;
    }, a = {
      template: "[%t] %l:",
      levelFormatter: function(m) {
        return m.toUpperCase();
      },
      nameFormatter: function(m) {
        return m || "root";
      },
      timestampFormatter: function(m) {
        return m.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
      },
      format: void 0
    }, s, l = {}, d = function(m) {
      if (!m || !m.getLogger)
        throw new TypeError("Argument is not a root logger");
      s = m;
    }, b = function(m, k) {
      if (!m || !m.setLevel)
        throw new TypeError("Argument is not a logger");
      var N = m.methodFactory, A = m.name || "", j = l[A] || l[""] || a;
      function C(x, v, T) {
        var R = N(x, v, T), n = l[T] || l[""], i = n.template.indexOf("%t") !== -1, o = n.template.indexOf("%l") !== -1, c = n.template.indexOf("%n") !== -1;
        return function() {
          for (var u = "", f = arguments.length, g = Array(f), O = 0; O < f; O++)
            g[O] = arguments[O];
          if (A || !l[T]) {
            var z = n.timestampFormatter(/* @__PURE__ */ new Date()), q = n.levelFormatter(x), B = n.nameFormatter(T);
            n.format ? u += n.format(q, B, z) : (u += n.template, i && (u = u.replace(/%t/, z)), o && (u = u.replace(/%l/, q)), c && (u = u.replace(/%n/, B))), g.length && typeof g[0] == "string" ? g[0] = u + " " + g[0] : g.unshift(u);
          }
          R.apply(void 0, g);
        };
      }
      return l[A] || (m.methodFactory = C), k = k || {}, k.template && (k.format = void 0), l[A] = r({}, j, k), m.setLevel(m.getLevel()), s || m.warn(
        "It is necessary to call the function reg() of loglevel-plugin-prefix before calling apply. From the next release, it will throw an error. See more: https://github.com/kutuluk/loglevel-plugin-prefix/blob/master/README.md"
      ), m;
    }, _ = {
      reg: d,
      apply: b
    }, y;
    return t && (y = t.prefix, _.noConflict = function() {
      return t.prefix === _ && (t.prefix = y), _;
    }), _;
  });
})(Uo);
var Ou = Uo.exports;
const qn = /* @__PURE__ */ tn(Ou);
function Nu() {
  const e = Error.prepareStackTrace;
  Error.prepareStackTrace = (r, a) => a;
  const t = new Error().stack.slice(1);
  return Error.prepareStackTrace = e, t;
}
class Hr {
  /**
   * 解析日志级别为枚举
   *
   * @param enumObj - 枚举对象
   * @param value - 配置的值
   */
  static stringToEnumValue(t, r) {
    return t[Object.keys(t).filter((a) => t[a].toString() === r)[0]];
  }
  /**
   * 获取配置的日志级别
   */
  static getEnvLevel(t) {
    if (!t)
      return;
    const r = t.getEnvOrDefault(Gr.LOG_LEVEL_KEY, st.LOG_LEVEL_INFO), a = Hr.stringToEnumValue(st, r.toUpperCase());
    return a || console.warn(
      "[zhi-log] LOG_LEVEL is invalid in you .env file.It must be either debug, info, warn or error, fallback to default info level"
    ), a;
  }
  /**
   * 获取默认日志
   */
  static getEnvLogger(t) {
    return t ? t.getEnv(Gr.LOG_PREFIX_KEY) : void 0;
  }
}
var rn = { exports: {} }, Un = { exports: {} }, Gn;
function ju() {
  return Gn || (Gn = 1, function(e) {
    const t = typeof process < "u" && process.env.TERM_PROGRAM === "Hyper", r = typeof process < "u" && process.platform === "win32", a = typeof process < "u" && process.platform === "linux", s = {
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
    }, l = Object.assign({}, s, {
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
    }), d = Object.assign({}, s, {
      ballotCross: "✘",
      check: "✔",
      cross: "✖",
      ellipsisLarge: "⋯",
      ellipsis: "…",
      info: "ℹ",
      questionFull: "？",
      questionSmall: "﹖",
      pointer: a ? "▸" : "❯",
      pointerSmall: a ? "‣" : "›",
      radioOff: "◯",
      radioOn: "◉",
      warning: "⚠"
    });
    e.exports = r && !t ? l : d, Reflect.defineProperty(e.exports, "common", { enumerable: !1, value: s }), Reflect.defineProperty(e.exports, "windows", { enumerable: !1, value: l }), Reflect.defineProperty(e.exports, "other", { enumerable: !1, value: d });
  }(Un)), Un.exports;
}
const Lu = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Au = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g, Ru = () => typeof process < "u" ? process.env.FORCE_COLOR !== "0" : !1, Go = () => {
  const e = {
    enabled: Ru(),
    visible: !0,
    styles: {},
    keys: {}
  }, t = (l) => {
    let d = l.open = `\x1B[${l.codes[0]}m`, b = l.close = `\x1B[${l.codes[1]}m`, _ = l.regex = new RegExp(`\\u001b\\[${l.codes[1]}m`, "g");
    return l.wrap = (y, m) => {
      y.includes(b) && (y = y.replace(_, b + d));
      let k = d + y + b;
      return m ? k.replace(/\r*\n/g, `${b}$&${d}`) : k;
    }, l;
  }, r = (l, d, b) => typeof l == "function" ? l(d) : l.wrap(d, b), a = (l, d) => {
    if (l === "" || l == null)
      return "";
    if (e.enabled === !1)
      return l;
    if (e.visible === !1)
      return "";
    let b = "" + l, _ = b.includes(`
`), y = d.length;
    for (y > 0 && d.includes("unstyle") && (d = [.../* @__PURE__ */ new Set(["unstyle", ...d])].reverse()); y-- > 0; )
      b = r(e.styles[d[y]], b, _);
    return b;
  }, s = (l, d, b) => {
    e.styles[l] = t({ name: l, codes: d }), (e.keys[b] || (e.keys[b] = [])).push(l), Reflect.defineProperty(e, l, {
      configurable: !0,
      enumerable: !0,
      set(_) {
        e.alias(l, _);
      },
      get() {
        let _ = (y) => a(y, _.stack);
        return Reflect.setPrototypeOf(_, e), _.stack = this.stack ? this.stack.concat(l) : [l], _;
      }
    });
  };
  return s("reset", [0, 0], "modifier"), s("bold", [1, 22], "modifier"), s("dim", [2, 22], "modifier"), s("italic", [3, 23], "modifier"), s("underline", [4, 24], "modifier"), s("inverse", [7, 27], "modifier"), s("hidden", [8, 28], "modifier"), s("strikethrough", [9, 29], "modifier"), s("black", [30, 39], "color"), s("red", [31, 39], "color"), s("green", [32, 39], "color"), s("yellow", [33, 39], "color"), s("blue", [34, 39], "color"), s("magenta", [35, 39], "color"), s("cyan", [36, 39], "color"), s("white", [37, 39], "color"), s("gray", [90, 39], "color"), s("grey", [90, 39], "color"), s("bgBlack", [40, 49], "bg"), s("bgRed", [41, 49], "bg"), s("bgGreen", [42, 49], "bg"), s("bgYellow", [43, 49], "bg"), s("bgBlue", [44, 49], "bg"), s("bgMagenta", [45, 49], "bg"), s("bgCyan", [46, 49], "bg"), s("bgWhite", [47, 49], "bg"), s("blackBright", [90, 39], "bright"), s("redBright", [91, 39], "bright"), s("greenBright", [92, 39], "bright"), s("yellowBright", [93, 39], "bright"), s("blueBright", [94, 39], "bright"), s("magentaBright", [95, 39], "bright"), s("cyanBright", [96, 39], "bright"), s("whiteBright", [97, 39], "bright"), s("bgBlackBright", [100, 49], "bgBright"), s("bgRedBright", [101, 49], "bgBright"), s("bgGreenBright", [102, 49], "bgBright"), s("bgYellowBright", [103, 49], "bgBright"), s("bgBlueBright", [104, 49], "bgBright"), s("bgMagentaBright", [105, 49], "bgBright"), s("bgCyanBright", [106, 49], "bgBright"), s("bgWhiteBright", [107, 49], "bgBright"), e.ansiRegex = Au, e.hasColor = e.hasAnsi = (l) => (e.ansiRegex.lastIndex = 0, typeof l == "string" && l !== "" && e.ansiRegex.test(l)), e.alias = (l, d) => {
    let b = typeof d == "string" ? e[d] : d;
    if (typeof b != "function")
      throw new TypeError("Expected alias to be the name of an existing color (string) or a function");
    b.stack || (Reflect.defineProperty(b, "name", { value: l }), e.styles[l] = b, b.stack = [l]), Reflect.defineProperty(e, l, {
      configurable: !0,
      enumerable: !0,
      set(_) {
        e.alias(l, _);
      },
      get() {
        let _ = (y) => a(y, _.stack);
        return Reflect.setPrototypeOf(_, e), _.stack = this.stack ? this.stack.concat(b.stack) : b.stack, _;
      }
    });
  }, e.theme = (l) => {
    if (!Lu(l))
      throw new TypeError("Expected theme to be an object");
    for (let d of Object.keys(l))
      e.alias(d, l[d]);
    return e;
  }, e.alias("unstyle", (l) => typeof l == "string" && l !== "" ? (e.ansiRegex.lastIndex = 0, l.replace(e.ansiRegex, "")) : ""), e.alias("noop", (l) => l), e.none = e.clear = e.noop, e.stripColor = e.unstyle, e.symbols = ju(), e.define = s, e;
};
rn.exports = Go();
rn.exports.create = Go;
var Iu = rn.exports;
const Ue = /* @__PURE__ */ tn(Iu);
let ma, Ho, Ko, Wo, Jo = !0;
typeof process < "u" && ({ FORCE_COLOR: ma, NODE_DISABLE_COLORS: Ho, NO_COLOR: Ko, TERM: Wo } = process.env || {}, Jo = process.stdout && process.stdout.isTTY);
const re = {
  enabled: !Ho && Ko == null && Wo !== "dumb" && (ma != null && ma !== "0" || Jo),
  // modifiers
  reset: me(0, 0),
  bold: me(1, 22),
  dim: me(2, 22),
  italic: me(3, 23),
  underline: me(4, 24),
  inverse: me(7, 27),
  hidden: me(8, 28),
  strikethrough: me(9, 29),
  // colors
  black: me(30, 39),
  red: me(31, 39),
  green: me(32, 39),
  yellow: me(33, 39),
  blue: me(34, 39),
  magenta: me(35, 39),
  cyan: me(36, 39),
  white: me(37, 39),
  gray: me(90, 39),
  grey: me(90, 39),
  // background colors
  bgBlack: me(40, 49),
  bgRed: me(41, 49),
  bgGreen: me(42, 49),
  bgYellow: me(43, 49),
  bgBlue: me(44, 49),
  bgMagenta: me(45, 49),
  bgCyan: me(46, 49),
  bgWhite: me(47, 49)
};
function Hn(e, t) {
  let r = 0, a, s = "", l = "";
  for (; r < e.length; r++)
    a = e[r], s += a.open, l += a.close, ~t.indexOf(a.close) && (t = t.replace(a.rgx, a.close + a.open));
  return s + t + l;
}
function Mu(e, t) {
  let r = { has: e, keys: t };
  return r.reset = re.reset.bind(r), r.bold = re.bold.bind(r), r.dim = re.dim.bind(r), r.italic = re.italic.bind(r), r.underline = re.underline.bind(r), r.inverse = re.inverse.bind(r), r.hidden = re.hidden.bind(r), r.strikethrough = re.strikethrough.bind(r), r.black = re.black.bind(r), r.red = re.red.bind(r), r.green = re.green.bind(r), r.yellow = re.yellow.bind(r), r.blue = re.blue.bind(r), r.magenta = re.magenta.bind(r), r.cyan = re.cyan.bind(r), r.white = re.white.bind(r), r.gray = re.gray.bind(r), r.grey = re.grey.bind(r), r.bgBlack = re.bgBlack.bind(r), r.bgRed = re.bgRed.bind(r), r.bgGreen = re.bgGreen.bind(r), r.bgYellow = re.bgYellow.bind(r), r.bgBlue = re.bgBlue.bind(r), r.bgMagenta = re.bgMagenta.bind(r), r.bgCyan = re.bgCyan.bind(r), r.bgWhite = re.bgWhite.bind(r), r;
}
function me(e, t) {
  let r = {
    open: `\x1B[${e}m`,
    close: `\x1B[${t}m`,
    rgx: new RegExp(`\\x1b\\[${t}m`, "g")
  };
  return function(a) {
    return this !== void 0 && this.has !== void 0 ? (~this.has.indexOf(e) || (this.has.push(e), this.keys.push(r)), a === void 0 ? this : re.enabled ? Hn(this.keys, a + "") : a + "") : a === void 0 ? Mu([e], [r]) : re.enabled ? Hn([r], a + "") : a + "";
  };
}
var Du = Object.defineProperty, Bu = (e, t, r) => t in e ? Du(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, Pe = (e, t, r) => (Bu(e, typeof t != "symbol" ? t + "" : t, r), r);
const Qe = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return Qe.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let de = Qe;
Pe(de, "isNode", typeof process < "u"), /**
* 是否在浏览器环境
*/
Pe(de, "isInBrowser", typeof window < "u"), /**
* 浏览器路径分隔符
*/
Pe(de, "BrowserSeperator", "/"), /**
* 是否是Electron环境
*/
Pe(de, "isElectron", () => !Qe.isInBrowser || !window.navigator || !window.navigator.userAgent ? !1 : /Electron/.test(window.navigator.userAgent)), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
Pe(de, "hasNodeEnv", () => Qe.isElectron() || Qe.isNode), /**
* 获取url参数
*
* @param sParam - 参数
*/
Pe(de, "getQueryString", (e) => {
  if (!Qe.isInBrowser)
    return "";
  const t = window.location.search.substring(1).split("&");
  for (let r = 0; r < t.length; r++) {
    const a = t[r].split("=");
    if (a[0] === e)
      return a[1];
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
Pe(de, "replaceUrlParam", (e, t, r) => {
  r == null && (r = "");
  const a = new RegExp("\\b(" + t + "=).*?(&|#|$)");
  if (e.search(a) >= 0)
    return e.replace(a, "$1" + r + "$2");
  const [s, l] = e.split("#"), [d, b] = s.split("?"), _ = new URLSearchParams(b);
  _.set(t, r);
  const y = _.toString(), m = d + (y ? "?" + y : "");
  return l ? m + "#" + l : m;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
Pe(de, "setUrlParameter", (e, t, r) => {
  if (e.includes(t))
    return Qe.replaceUrlParam(e, t, r);
  const a = e.split("#");
  let s = a[0];
  const l = a[1];
  return s.includes("?") ? s += `&${t}=${r}` : s += `?${t}=${r}`, l && (s += "#" + l), s;
}), /**
* 重新加载指定tab
*
* @param tabname - tabname
* @param t - 延迟时间
*/
Pe(de, "reloadTabPage", (e, t = 200) => {
  setTimeout(function() {
    if (Qe.isInBrowser) {
      const r = window.location.href;
      window.location.href = Qe.setUrlParameter(r, "tab", e);
    }
  }, t);
}), /**
* 刷新当前tab页面
*/
Pe(de, "reloadPage", () => {
  setTimeout(function() {
    Qe.isInBrowser && window.location.reload();
  }, 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
*/
Pe(de, "reloadPageWithMessageCallback", (e, t) => {
  t && t(e), setTimeout(function() {
    Qe.isInBrowser && window.location.reload();
  }, 200);
});
var je = /* @__PURE__ */ ((e) => (e.BasePathType_Appearance = "Appearance", e.BasePathType_Data = "Data", e.BasePathType_Themes = "Themes", e.BasePathType_ZhiTheme = "ZhiTheme", e.BasePathType_None = "None", e))(je || {});
const Ie = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return de.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : !1;
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
    let r = e;
    switch (t) {
      case je.BasePathType_Appearance:
        r = this.browserJoinPath(this.siyuanAppearanceRelativePath(), e);
        break;
      case je.BasePathType_Data:
        r = this.browserJoinPath(this.siyuanDataRelativePath(), e);
        break;
      case je.BasePathType_Themes:
        r = this.browserJoinPath(this.siyuanThemeRelativePath(), e);
        break;
      case je.BasePathType_ZhiTheme:
        r = this.browserJoinPath(this.zhiThemeRelativePath(), e);
        break;
      default:
        throw new Error("type must be provided");
    }
    const { default: a } = await import(
      /* @vite-ignore */
      r
    );
    return a;
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
    return await this.importJs(e, je.BasePathType_ZhiTheme);
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
    if (de.hasNodeEnv()) {
      const t = this.requireLib("path");
      if (t)
        return t.join(...e);
    }
    return this.browserJoinPath(...e);
  }
  static browserJoinPath(...e) {
    return e.join(de.BrowserSeperator);
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
    if (de.hasNodeEnv())
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
let St = Ie;
Pe(St, "isInSiyuanWidget", () => de.isInBrowser ? window.frameElement != null && window.frameElement.parentElement != null && window.frameElement.parentElement.parentElement != null && window.frameElement.parentElement.parentElement.getAttribute("data-node-id") !== "" : !1), /**
* 思源笔记新窗口
*
* @deprecated window.terwer 判断方式已废弃，建议以后打开新窗口注入 window.siyuanNewWin ，这样语义会更容易理解
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
Pe(St, "isInSiyuanNewWin", () => !de.isInBrowser || !de.isElectron() ? !1 : typeof window.terwer < "u" || typeof window.siyuanNewWin < "u"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
Pe(St, "requireLib", (e, t = !0, r = je.BasePathType_None) => {
  if (!de.hasNodeEnv())
    throw new Error("require ony works on node env");
  let a = e;
  if (!t)
    switch (r) {
      case je.BasePathType_Appearance:
        a = Ie.joinPath(Ie.siyuanAppearancePath(), e);
        break;
      case je.BasePathType_Data:
        a = Ie.joinPath(Ie.siyuanDataPath(), e);
        break;
      case je.BasePathType_Themes:
        a = Ie.joinPath(Ie.siyuanAppearancePath(), "themes", e);
        break;
      case je.BasePathType_ZhiTheme:
        a = Ie.joinPath(Ie.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const s = Ie.siyuanWindow();
  if (!s)
    return require(a);
  if (typeof s.require < "u")
    return s.require(a);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
Pe(St, "requireAppearanceLib", (e) => Ie.requireLib(e, !1, je.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
Pe(St, "requireDataLib", (e) => Ie.requireLib(e, !1, je.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
Pe(St, "requireThemesLib", (e) => Ie.requireLib(e, !1, je.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
Pe(St, "requireZhiThemeLib", (e) => Ie.requireLib(e, !1, je.BasePathType_ZhiTheme));
const Ge = {
  white: (e) => de.isElectron() ? Ue.whiteBright(e) : re.white(e),
  gray: (e) => de.isElectron() ? Ue.gray(e) : re.gray(e),
  blue: (e) => de.isElectron() ? Ue.blue(e) : re.blue(e),
  green: (e) => de.isElectron() ? Ue.green(e) : re.green(e),
  yellow: (e) => de.isElectron() ? Ue.yellow(e) : re.yellow(e),
  red: (e) => de.isElectron() ? Ue.red(e) : re.red(e),
  bgWhite: (e) => de.isElectron() ? Ue.bgWhiteBright(e) : re.bgWhite(e),
  bgGrey: (e) => de.isElectron() ? Ue.bgCyanBright(e) : re.bgCyan(e),
  bgBlue: (e) => de.isElectron() ? Ue.bgBlueBright(e) : re.bgBlue(e),
  bgGreen: (e) => de.isElectron() ? Ue.bgGreenBright(e) : re.bgGreen(e),
  bgYellow: (e) => de.isElectron() ? Ue.bgYellowBright(e) : re.bgYellow(e),
  bgRed: (e) => de.isElectron() ? Ue.bgRedBright(e) : re.bgRed(e)
};
class zu {
  constructor(t, r, a) {
    Ut(this, "consoleLogger", "console"), Ut(this, "stackSize", 1), Ut(this, "getLogger", (d) => {
      let b;
      if (d)
        b = d;
      else {
        const _ = this.getCallStack(), y = [], m = [];
        for (let k = 0; k < _.length; k++) {
          const N = _[k], A = N.getFileName() ?? "none";
          if (k > this.stackSize - 1)
            break;
          const j = A + "-" + N.getLineNumber() + ":" + N.getColumnNumber();
          y.push(j);
        }
        m.length > 0 && (b = y.join(" -> "));
      }
      return (!b || b.trim().length === 0) && (b = this.consoleLogger), jr.getLogger(b);
    }), this.stackSize = 1;
    let s;
    t ? s = t : s = Hr.getEnvLevel(a), s = s ?? st.LOG_LEVEL_INFO, jr.setLevel(s);
    const l = (d, b, _, y) => {
      const m = [], k = r ?? Hr.getEnvLogger(a) ?? "zhi";
      return m.push(Ge.gray("[") + y(k) + Ge.gray("]")), m.push(Ge.gray("[") + Ge.gray(_.toString()) + Ge.gray("]")), m.push(y(d.toUpperCase().toString())), m.push(y(b)), m.push(Ge.gray(":")), m;
    };
    qn.reg(jr), qn.apply(jr, {
      format(d, b, _) {
        let y = [];
        const m = b ?? "";
        switch (d) {
          case st.LOG_LEVEL_TRACE:
            y = l(d, m, _, Ge.gray);
            break;
          case st.LOG_LEVEL_DEBUG:
            y = l(d, m, _, Ge.blue);
            break;
          case st.LOG_LEVEL_INFO:
            y = l(d, m, _, Ge.green);
            break;
          case st.LOG_LEVEL_WARN:
            y = l(d, m, _, Ge.yellow);
            break;
          case st.LOG_LEVEL_ERROR:
            y = l(d, m, _, Ge.red);
            break;
          default:
            y = l(st.LOG_LEVEL_INFO, m, _, Ge.green);
            break;
        }
        return y.join(" ");
      }
    });
  }
  /**
   * 设置输出栈的深度，默认1
   *
   * @param stackSize - 栈的深度
   */
  setStackSize(t) {
    this.stackSize = t ?? 1;
  }
  /**
   * 获取调用堆栈，若未获取到直接返回空数组
   *
   * @author terwer
   * @since 1.6.0
   */
  getCallStack() {
    let t;
    try {
      t = Nu();
    } catch {
      t = [];
    }
    return t;
  }
}
class Vu {
  /**
   * 默认日志级别
   *
   * @param level - 可选，未设置默认INFO
   * @param sign - 可选前缀，默认zhi
   * @param env - 可选环境变量实例
   */
  constructor(t, r, a) {
    Ut(this, "logger"), this.logger = new zu(t, r, a);
  }
  /**
   * 获取日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   * @protected
   */
  getLogger(t, r) {
    return this.logger.setStackSize(r), this.logger.getLogger(t);
  }
}
class Kn extends Vu {
  constructor(t, r, a) {
    super(t, r, a);
  }
  /**
   * 获取默认的日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   */
  getLogger(t, r) {
    return super.getLogger(t, r);
  }
}
class an {
  /**
   * 默认日志记录器
   *
   * @param stackSize - 栈的深度
   * @param env - 环境变量实例
   */
  static defaultLogger(t, r) {
    return an.customLogFactory(void 0, void 0, t).getLogger(void 0, r);
  }
  /**
   * 自定义日志工厂
   *
   * @param level - 级别
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customLogFactory(t, r, a) {
    return new Kn(t, r, a);
  }
  /**
   * 自定义日志工厂，自定义前缀
   *
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customSignLogFactory(t, r) {
    return new Kn(void 0, t, r);
  }
}
const Fu = "zhi";
class Dr {
  /**
   * 某些情况下，可能需要手动 init 之后才能用
   */
  static initEnv(t) {
    this.env = t;
  }
  /**
   * 获取 zhi-env 实例 - 必须在使用的时候重写此方法
   *
   * ```
   * if (!this.env) {
   *   this.env = new Env({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":false})
   * }
   * return this.env
   * ```
   *
   * @see {@link https://github.com/terwer/zhi/tree/main/apps/zhi-env#usage docs for zhi-env usage}
   */
  static zhiEnv() {
    throw new Error("Method 'zhiEnv' must be implemented");
  }
  /**
   * 获取 zhi-log 实例
   *
   * @param sign - 标志
   * @param loggerName - 日志名称
   */
  static zhiLogWithSign(t, r) {
    if (this.loggerMap[r])
      return this.loggerMap[r].debug("Zhi-log use cache"), this.loggerMap[r];
    const a = this.env, s = an.customSignLogFactory(t, a).getLogger(r);
    return this.loggerMap[r] = s, s.debug("Zhi-log add new logger"), s;
  }
  /**
   * 获取 zhi-log 实例
   *
   * @param loggerName - 日志名称
   */
  static zhiLog(t) {
    return this.zhiLogWithSign(Fu, t);
  }
  /**
   * 获取 zhi-common 实例
   */
  static zhiCommon() {
    return this.common || (this.common = new Ku()), this.common;
  }
}
Te(Dr, "env"), /**
* zhi-util 的日志器缓存
*/
Te(Dr, "loggerMap", {}), /**
* zhi-util 的通用工具类
*/
Te(Dr, "common");
class nn extends Dr {
  static zhiEnv() {
    return this.env || (this.env = new Su({ BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 })), this.env;
  }
}
class Wn {
  constructor() {
    Te(this, "logger"), this.logger = nn.zhiLog("lute-adaptor"), Lute ? this.logger.debug("Detected Lute is bundled, will use!") : this.logger.debug("Lute is not available!");
  }
  isAvailable() {
    return typeof Lute < "u";
  }
  /**
   * 高亮关键字
   *
   * @param str - 字符串
   * @private
   */
  highlightWords(t) {
    const r = new RegExp("(?<=^|[\\s\\S])==([^\\n]+?)==(?=($|[\\s\\S]))", "g");
    return t.replace(r, '<span class="mark">$1</span>');
  }
  /**
   * 渲染Markdown
   *
   * @param md - Markdown
   */
  async renderMarkdownStr(t) {
    if (!this.isAvailable())
      return this.logger.error("Lute is not available, will return original md"), t;
    const r = Lute, a = r.New(), s = {
      renderText: (l, d) => d ? [this.highlightWords(l.Text()), r.WalkContinue] : ["", r.WalkContinue]
      // renderStrong: (node: any, entering: any) => {
      //     return ["", luteObj.WalkContinue]
      // },
      // renderParagraph: (node: any, entering: any) => {
      //     return ["", luteObj.WalkContinue]
      // }
    };
    return a.SetJSRenderers({
      renderers: {
        Md2HTML: s
      }
    }), this.logger.info("Lute is rendering md to HTML..."), a.MarkdownStr("", t);
  }
}
var Zo = { exports: {} };
(function(e) {
  (function() {
    function t(n) {
      var i = {
        omitExtraWLInCodeBlocks: {
          defaultValue: !1,
          describe: "Omit the default extra whiteline added to code blocks",
          type: "boolean"
        },
        noHeaderId: {
          defaultValue: !1,
          describe: "Turn on/off generated header id",
          type: "boolean"
        },
        prefixHeaderId: {
          defaultValue: !1,
          describe: "Add a prefix to the generated header ids. Passing a string will prefix that string to the header id. Setting to true will add a generic 'section-' prefix",
          type: "string"
        },
        rawPrefixHeaderId: {
          defaultValue: !1,
          describe: 'Setting this option to true will prevent showdown from modifying the prefix. This might result in malformed IDs (if, for instance, the " char is used in the prefix)',
          type: "boolean"
        },
        ghCompatibleHeaderId: {
          defaultValue: !1,
          describe: "Generate header ids compatible with github style (spaces are replaced with dashes, a bunch of non alphanumeric chars are removed)",
          type: "boolean"
        },
        rawHeaderId: {
          defaultValue: !1,
          describe: `Remove only spaces, ' and " from generated header ids (including prefixes), replacing them with dashes (-). WARNING: This might result in malformed ids`,
          type: "boolean"
        },
        headerLevelStart: {
          defaultValue: !1,
          describe: "The header blocks level start",
          type: "integer"
        },
        parseImgDimensions: {
          defaultValue: !1,
          describe: "Turn on/off image dimension parsing",
          type: "boolean"
        },
        simplifiedAutoLink: {
          defaultValue: !1,
          describe: "Turn on/off GFM autolink style",
          type: "boolean"
        },
        excludeTrailingPunctuationFromURLs: {
          defaultValue: !1,
          describe: "Excludes trailing punctuation from links generated with autoLinking",
          type: "boolean"
        },
        literalMidWordUnderscores: {
          defaultValue: !1,
          describe: "Parse midword underscores as literal underscores",
          type: "boolean"
        },
        literalMidWordAsterisks: {
          defaultValue: !1,
          describe: "Parse midword asterisks as literal asterisks",
          type: "boolean"
        },
        strikethrough: {
          defaultValue: !1,
          describe: "Turn on/off strikethrough support",
          type: "boolean"
        },
        tables: {
          defaultValue: !1,
          describe: "Turn on/off tables support",
          type: "boolean"
        },
        tablesHeaderId: {
          defaultValue: !1,
          describe: "Add an id to table headers",
          type: "boolean"
        },
        ghCodeBlocks: {
          defaultValue: !0,
          describe: "Turn on/off GFM fenced code blocks support",
          type: "boolean"
        },
        tasklists: {
          defaultValue: !1,
          describe: "Turn on/off GFM tasklist support",
          type: "boolean"
        },
        smoothLivePreview: {
          defaultValue: !1,
          describe: "Prevents weird effects in live previews due to incomplete input",
          type: "boolean"
        },
        smartIndentationFix: {
          defaultValue: !1,
          describe: "Tries to smartly fix indentation in es6 strings",
          type: "boolean"
        },
        disableForced4SpacesIndentedSublists: {
          defaultValue: !1,
          describe: "Disables the requirement of indenting nested sublists by 4 spaces",
          type: "boolean"
        },
        simpleLineBreaks: {
          defaultValue: !1,
          describe: "Parses simple line breaks as <br> (GFM Style)",
          type: "boolean"
        },
        requireSpaceBeforeHeadingText: {
          defaultValue: !1,
          describe: "Makes adding a space between `#` and the header text mandatory (GFM Style)",
          type: "boolean"
        },
        ghMentions: {
          defaultValue: !1,
          describe: "Enables github @mentions",
          type: "boolean"
        },
        ghMentionsLink: {
          defaultValue: "https://github.com/{u}",
          describe: "Changes the link generated by @mentions. Only applies if ghMentions option is enabled.",
          type: "string"
        },
        encodeEmails: {
          defaultValue: !0,
          describe: "Encode e-mail addresses through the use of Character Entities, transforming ASCII e-mail addresses into its equivalent decimal entities",
          type: "boolean"
        },
        openLinksInNewWindow: {
          defaultValue: !1,
          describe: "Open all links in new windows",
          type: "boolean"
        },
        backslashEscapesHTMLTags: {
          defaultValue: !1,
          describe: "Support for HTML Tag escaping. ex: <div>foo</div>",
          type: "boolean"
        },
        emoji: {
          defaultValue: !1,
          describe: "Enable emoji support. Ex: `this is a :smile: emoji`",
          type: "boolean"
        },
        underline: {
          defaultValue: !1,
          describe: "Enable support for underline. Syntax is double or triple underscores: `__underline word__`. With this option enabled, underscores no longer parses into `<em>` and `<strong>`",
          type: "boolean"
        },
        ellipsis: {
          defaultValue: !0,
          describe: "Replaces three dots with the ellipsis unicode character",
          type: "boolean"
        },
        completeHTMLDocument: {
          defaultValue: !1,
          describe: "Outputs a complete html document, including `<html>`, `<head>` and `<body>` tags",
          type: "boolean"
        },
        metadata: {
          defaultValue: !1,
          describe: "Enable support for document metadata (defined at the top of the document between `«««` and `»»»` or between `---` and `---`).",
          type: "boolean"
        },
        splitAdjacentBlockquotes: {
          defaultValue: !1,
          describe: "Split adjacent blockquote blocks",
          type: "boolean"
        }
      };
      if (n === !1)
        return JSON.parse(JSON.stringify(i));
      var o = {};
      for (var c in i)
        i.hasOwnProperty(c) && (o[c] = i[c].defaultValue);
      return o;
    }
    function r() {
      var n = t(!0), i = {};
      for (var o in n)
        n.hasOwnProperty(o) && (i[o] = !0);
      return i;
    }
    var a = {}, s = {}, l = {}, d = t(!0), b = "vanilla", _ = {
      github: {
        omitExtraWLInCodeBlocks: !0,
        simplifiedAutoLink: !0,
        excludeTrailingPunctuationFromURLs: !0,
        literalMidWordUnderscores: !0,
        strikethrough: !0,
        tables: !0,
        tablesHeaderId: !0,
        ghCodeBlocks: !0,
        tasklists: !0,
        disableForced4SpacesIndentedSublists: !0,
        simpleLineBreaks: !0,
        requireSpaceBeforeHeadingText: !0,
        ghCompatibleHeaderId: !0,
        ghMentions: !0,
        backslashEscapesHTMLTags: !0,
        emoji: !0,
        splitAdjacentBlockquotes: !0
      },
      original: {
        noHeaderId: !0,
        ghCodeBlocks: !1
      },
      ghost: {
        omitExtraWLInCodeBlocks: !0,
        parseImgDimensions: !0,
        simplifiedAutoLink: !0,
        excludeTrailingPunctuationFromURLs: !0,
        literalMidWordUnderscores: !0,
        strikethrough: !0,
        tables: !0,
        tablesHeaderId: !0,
        ghCodeBlocks: !0,
        tasklists: !0,
        smoothLivePreview: !0,
        simpleLineBreaks: !0,
        requireSpaceBeforeHeadingText: !0,
        ghMentions: !1,
        encodeEmails: !0
      },
      vanilla: t(!0),
      allOn: r()
    };
    a.helper = {}, a.extensions = {}, a.setOption = function(n, i) {
      return d[n] = i, this;
    }, a.getOption = function(n) {
      return d[n];
    }, a.getOptions = function() {
      return d;
    }, a.resetOptions = function() {
      d = t(!0);
    }, a.setFlavor = function(n) {
      if (!_.hasOwnProperty(n))
        throw Error(n + " flavor was not found");
      a.resetOptions();
      var i = _[n];
      b = n;
      for (var o in i)
        i.hasOwnProperty(o) && (d[o] = i[o]);
    }, a.getFlavor = function() {
      return b;
    }, a.getFlavorOptions = function(n) {
      if (_.hasOwnProperty(n))
        return _[n];
    }, a.getDefaultOptions = function(n) {
      return t(n);
    }, a.subParser = function(n, i) {
      if (a.helper.isString(n))
        if (typeof i < "u")
          s[n] = i;
        else {
          if (s.hasOwnProperty(n))
            return s[n];
          throw Error("SubParser named " + n + " not registered!");
        }
    }, a.extension = function(n, i) {
      if (!a.helper.isString(n))
        throw Error("Extension 'name' must be a string");
      if (n = a.helper.stdExtName(n), a.helper.isUndefined(i)) {
        if (!l.hasOwnProperty(n))
          throw Error("Extension named " + n + " is not registered!");
        return l[n];
      } else {
        typeof i == "function" && (i = i()), a.helper.isArray(i) || (i = [i]);
        var o = y(i, n);
        if (o.valid)
          l[n] = i;
        else
          throw Error(o.error);
      }
    }, a.getAllExtensions = function() {
      return l;
    }, a.removeExtension = function(n) {
      delete l[n];
    }, a.resetExtensions = function() {
      l = {};
    };
    function y(n, i) {
      var o = i ? "Error in " + i + " extension->" : "Error in unnamed extension", c = {
        valid: !0,
        error: ""
      };
      a.helper.isArray(n) || (n = [n]);
      for (var u = 0; u < n.length; ++u) {
        var f = o + " sub-extension " + u + ": ", g = n[u];
        if (typeof g != "object")
          return c.valid = !1, c.error = f + "must be an object, but " + typeof g + " given", c;
        if (!a.helper.isString(g.type))
          return c.valid = !1, c.error = f + 'property "type" must be a string, but ' + typeof g.type + " given", c;
        var O = g.type = g.type.toLowerCase();
        if (O === "language" && (O = g.type = "lang"), O === "html" && (O = g.type = "output"), O !== "lang" && O !== "output" && O !== "listener")
          return c.valid = !1, c.error = f + "type " + O + ' is not recognized. Valid values: "lang/language", "output/html" or "listener"', c;
        if (O === "listener") {
          if (a.helper.isUndefined(g.listeners))
            return c.valid = !1, c.error = f + '. Extensions of type "listener" must have a property called "listeners"', c;
        } else if (a.helper.isUndefined(g.filter) && a.helper.isUndefined(g.regex))
          return c.valid = !1, c.error = f + O + ' extensions must define either a "regex" property or a "filter" method', c;
        if (g.listeners) {
          if (typeof g.listeners != "object")
            return c.valid = !1, c.error = f + '"listeners" property must be an object but ' + typeof g.listeners + " given", c;
          for (var z in g.listeners)
            if (g.listeners.hasOwnProperty(z) && typeof g.listeners[z] != "function")
              return c.valid = !1, c.error = f + '"listeners" property must be an hash of [event name]: [callback]. listeners.' + z + " must be a function but " + typeof g.listeners[z] + " given", c;
        }
        if (g.filter) {
          if (typeof g.filter != "function")
            return c.valid = !1, c.error = f + '"filter" must be a function, but ' + typeof g.filter + " given", c;
        } else if (g.regex) {
          if (a.helper.isString(g.regex) && (g.regex = new RegExp(g.regex, "g")), !(g.regex instanceof RegExp))
            return c.valid = !1, c.error = f + '"regex" property must either be a string or a RegExp object, but ' + typeof g.regex + " given", c;
          if (a.helper.isUndefined(g.replace))
            return c.valid = !1, c.error = f + '"regex" extensions must implement a replace string or function', c;
        }
      }
      return c;
    }
    a.validateExtension = function(n) {
      var i = y(n, null);
      return i.valid ? !0 : (console.warn(i.error), !1);
    }, a.hasOwnProperty("helper") || (a.helper = {}), a.helper.isString = function(n) {
      return typeof n == "string" || n instanceof String;
    }, a.helper.isFunction = function(n) {
      var i = {};
      return n && i.toString.call(n) === "[object Function]";
    }, a.helper.isArray = function(n) {
      return Array.isArray(n);
    }, a.helper.isUndefined = function(n) {
      return typeof n > "u";
    }, a.helper.forEach = function(n, i) {
      if (a.helper.isUndefined(n))
        throw new Error("obj param is required");
      if (a.helper.isUndefined(i))
        throw new Error("callback param is required");
      if (!a.helper.isFunction(i))
        throw new Error("callback param must be a function/closure");
      if (typeof n.forEach == "function")
        n.forEach(i);
      else if (a.helper.isArray(n))
        for (var o = 0; o < n.length; o++)
          i(n[o], o, n);
      else if (typeof n == "object")
        for (var c in n)
          n.hasOwnProperty(c) && i(n[c], c, n);
      else
        throw new Error("obj does not seem to be an array or an iterable object");
    }, a.helper.stdExtName = function(n) {
      return n.replace(/[_?*+\/\\.^-]/g, "").replace(/\s/g, "").toLowerCase();
    };
    function m(n, i) {
      var o = i.charCodeAt(0);
      return "¨E" + o + "E";
    }
    a.helper.escapeCharactersCallback = m, a.helper.escapeCharacters = function(n, i, o) {
      var c = "([" + i.replace(/([\[\]\\])/g, "\\$1") + "])";
      o && (c = "\\\\" + c);
      var u = new RegExp(c, "g");
      return n = n.replace(u, m), n;
    }, a.helper.unescapeHTMLEntities = function(n) {
      return n.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    var k = function(n, i, o, c) {
      var u = c || "", f = u.indexOf("g") > -1, g = new RegExp(i + "|" + o, "g" + u.replace(/g/g, "")), O = new RegExp(i, u.replace(/g/g, "")), z = [], q, B, G, w, U;
      do
        for (q = 0; G = g.exec(n); )
          if (O.test(G[0]))
            q++ || (B = g.lastIndex, w = B - G[0].length);
          else if (q && !--q) {
            U = G.index + G[0].length;
            var W = {
              left: { start: w, end: B },
              match: { start: B, end: G.index },
              right: { start: G.index, end: U },
              wholeMatch: { start: w, end: U }
            };
            if (z.push(W), !f)
              return z;
          }
      while (q && (g.lastIndex = B));
      return z;
    };
    a.helper.matchRecursiveRegExp = function(n, i, o, c) {
      for (var u = k(n, i, o, c), f = [], g = 0; g < u.length; ++g)
        f.push([
          n.slice(u[g].wholeMatch.start, u[g].wholeMatch.end),
          n.slice(u[g].match.start, u[g].match.end),
          n.slice(u[g].left.start, u[g].left.end),
          n.slice(u[g].right.start, u[g].right.end)
        ]);
      return f;
    }, a.helper.replaceRecursiveRegExp = function(n, i, o, c, u) {
      if (!a.helper.isFunction(i)) {
        var f = i;
        i = function() {
          return f;
        };
      }
      var g = k(n, o, c, u), O = n, z = g.length;
      if (z > 0) {
        var q = [];
        g[0].wholeMatch.start !== 0 && q.push(n.slice(0, g[0].wholeMatch.start));
        for (var B = 0; B < z; ++B)
          q.push(
            i(
              n.slice(g[B].wholeMatch.start, g[B].wholeMatch.end),
              n.slice(g[B].match.start, g[B].match.end),
              n.slice(g[B].left.start, g[B].left.end),
              n.slice(g[B].right.start, g[B].right.end)
            )
          ), B < z - 1 && q.push(n.slice(g[B].wholeMatch.end, g[B + 1].wholeMatch.start));
        g[z - 1].wholeMatch.end < n.length && q.push(n.slice(g[z - 1].wholeMatch.end)), O = q.join("");
      }
      return O;
    }, a.helper.regexIndexOf = function(n, i, o) {
      if (!a.helper.isString(n))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      if (!(i instanceof RegExp))
        throw "InvalidArgumentError: second parameter of showdown.helper.regexIndexOf function must be an instance of RegExp";
      var c = n.substring(o || 0).search(i);
      return c >= 0 ? c + (o || 0) : c;
    }, a.helper.splitAtIndex = function(n, i) {
      if (!a.helper.isString(n))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      return [n.substring(0, i), n.substring(i)];
    }, a.helper.encodeEmailAddress = function(n) {
      var i = [
        function(o) {
          return "&#" + o.charCodeAt(0) + ";";
        },
        function(o) {
          return "&#x" + o.charCodeAt(0).toString(16) + ";";
        },
        function(o) {
          return o;
        }
      ];
      return n = n.replace(/./g, function(o) {
        if (o === "@")
          o = i[Math.floor(Math.random() * 2)](o);
        else {
          var c = Math.random();
          o = c > 0.9 ? i[2](o) : c > 0.45 ? i[1](o) : i[0](o);
        }
        return o;
      }), n;
    }, a.helper.padEnd = function(n, i, o) {
      return i = i >> 0, o = String(o || " "), n.length > i ? String(n) : (i = i - n.length, i > o.length && (o += o.repeat(i / o.length)), String(n) + o.slice(0, i));
    }, typeof console > "u" && (console = {
      warn: function(n) {
        alert(n);
      },
      log: function(n) {
        alert(n);
      },
      error: function(n) {
        throw n;
      }
    }), a.helper.regexes = {
      asteriskDashAndColon: /([*_:~])/g
    }, a.helper.emojis = {
      "+1": "👍",
      "-1": "👎",
      100: "💯",
      1234: "🔢",
      "1st_place_medal": "🥇",
      "2nd_place_medal": "🥈",
      "3rd_place_medal": "🥉",
      "8ball": "🎱",
      a: "🅰️",
      ab: "🆎",
      abc: "🔤",
      abcd: "🔡",
      accept: "🉑",
      aerial_tramway: "🚡",
      airplane: "✈️",
      alarm_clock: "⏰",
      alembic: "⚗️",
      alien: "👽",
      ambulance: "🚑",
      amphora: "🏺",
      anchor: "⚓️",
      angel: "👼",
      anger: "💢",
      angry: "😠",
      anguished: "😧",
      ant: "🐜",
      apple: "🍎",
      aquarius: "♒️",
      aries: "♈️",
      arrow_backward: "◀️",
      arrow_double_down: "⏬",
      arrow_double_up: "⏫",
      arrow_down: "⬇️",
      arrow_down_small: "🔽",
      arrow_forward: "▶️",
      arrow_heading_down: "⤵️",
      arrow_heading_up: "⤴️",
      arrow_left: "⬅️",
      arrow_lower_left: "↙️",
      arrow_lower_right: "↘️",
      arrow_right: "➡️",
      arrow_right_hook: "↪️",
      arrow_up: "⬆️",
      arrow_up_down: "↕️",
      arrow_up_small: "🔼",
      arrow_upper_left: "↖️",
      arrow_upper_right: "↗️",
      arrows_clockwise: "🔃",
      arrows_counterclockwise: "🔄",
      art: "🎨",
      articulated_lorry: "🚛",
      artificial_satellite: "🛰",
      astonished: "😲",
      athletic_shoe: "👟",
      atm: "🏧",
      atom_symbol: "⚛️",
      avocado: "🥑",
      b: "🅱️",
      baby: "👶",
      baby_bottle: "🍼",
      baby_chick: "🐤",
      baby_symbol: "🚼",
      back: "🔙",
      bacon: "🥓",
      badminton: "🏸",
      baggage_claim: "🛄",
      baguette_bread: "🥖",
      balance_scale: "⚖️",
      balloon: "🎈",
      ballot_box: "🗳",
      ballot_box_with_check: "☑️",
      bamboo: "🎍",
      banana: "🍌",
      bangbang: "‼️",
      bank: "🏦",
      bar_chart: "📊",
      barber: "💈",
      baseball: "⚾️",
      basketball: "🏀",
      basketball_man: "⛹️",
      basketball_woman: "⛹️&zwj;♀️",
      bat: "🦇",
      bath: "🛀",
      bathtub: "🛁",
      battery: "🔋",
      beach_umbrella: "🏖",
      bear: "🐻",
      bed: "🛏",
      bee: "🐝",
      beer: "🍺",
      beers: "🍻",
      beetle: "🐞",
      beginner: "🔰",
      bell: "🔔",
      bellhop_bell: "🛎",
      bento: "🍱",
      biking_man: "🚴",
      bike: "🚲",
      biking_woman: "🚴&zwj;♀️",
      bikini: "👙",
      biohazard: "☣️",
      bird: "🐦",
      birthday: "🎂",
      black_circle: "⚫️",
      black_flag: "🏴",
      black_heart: "🖤",
      black_joker: "🃏",
      black_large_square: "⬛️",
      black_medium_small_square: "◾️",
      black_medium_square: "◼️",
      black_nib: "✒️",
      black_small_square: "▪️",
      black_square_button: "🔲",
      blonde_man: "👱",
      blonde_woman: "👱&zwj;♀️",
      blossom: "🌼",
      blowfish: "🐡",
      blue_book: "📘",
      blue_car: "🚙",
      blue_heart: "💙",
      blush: "😊",
      boar: "🐗",
      boat: "⛵️",
      bomb: "💣",
      book: "📖",
      bookmark: "🔖",
      bookmark_tabs: "📑",
      books: "📚",
      boom: "💥",
      boot: "👢",
      bouquet: "💐",
      bowing_man: "🙇",
      bow_and_arrow: "🏹",
      bowing_woman: "🙇&zwj;♀️",
      bowling: "🎳",
      boxing_glove: "🥊",
      boy: "👦",
      bread: "🍞",
      bride_with_veil: "👰",
      bridge_at_night: "🌉",
      briefcase: "💼",
      broken_heart: "💔",
      bug: "🐛",
      building_construction: "🏗",
      bulb: "💡",
      bullettrain_front: "🚅",
      bullettrain_side: "🚄",
      burrito: "🌯",
      bus: "🚌",
      business_suit_levitating: "🕴",
      busstop: "🚏",
      bust_in_silhouette: "👤",
      busts_in_silhouette: "👥",
      butterfly: "🦋",
      cactus: "🌵",
      cake: "🍰",
      calendar: "📆",
      call_me_hand: "🤙",
      calling: "📲",
      camel: "🐫",
      camera: "📷",
      camera_flash: "📸",
      camping: "🏕",
      cancer: "♋️",
      candle: "🕯",
      candy: "🍬",
      canoe: "🛶",
      capital_abcd: "🔠",
      capricorn: "♑️",
      car: "🚗",
      card_file_box: "🗃",
      card_index: "📇",
      card_index_dividers: "🗂",
      carousel_horse: "🎠",
      carrot: "🥕",
      cat: "🐱",
      cat2: "🐈",
      cd: "💿",
      chains: "⛓",
      champagne: "🍾",
      chart: "💹",
      chart_with_downwards_trend: "📉",
      chart_with_upwards_trend: "📈",
      checkered_flag: "🏁",
      cheese: "🧀",
      cherries: "🍒",
      cherry_blossom: "🌸",
      chestnut: "🌰",
      chicken: "🐔",
      children_crossing: "🚸",
      chipmunk: "🐿",
      chocolate_bar: "🍫",
      christmas_tree: "🎄",
      church: "⛪️",
      cinema: "🎦",
      circus_tent: "🎪",
      city_sunrise: "🌇",
      city_sunset: "🌆",
      cityscape: "🏙",
      cl: "🆑",
      clamp: "🗜",
      clap: "👏",
      clapper: "🎬",
      classical_building: "🏛",
      clinking_glasses: "🥂",
      clipboard: "📋",
      clock1: "🕐",
      clock10: "🕙",
      clock1030: "🕥",
      clock11: "🕚",
      clock1130: "🕦",
      clock12: "🕛",
      clock1230: "🕧",
      clock130: "🕜",
      clock2: "🕑",
      clock230: "🕝",
      clock3: "🕒",
      clock330: "🕞",
      clock4: "🕓",
      clock430: "🕟",
      clock5: "🕔",
      clock530: "🕠",
      clock6: "🕕",
      clock630: "🕡",
      clock7: "🕖",
      clock730: "🕢",
      clock8: "🕗",
      clock830: "🕣",
      clock9: "🕘",
      clock930: "🕤",
      closed_book: "📕",
      closed_lock_with_key: "🔐",
      closed_umbrella: "🌂",
      cloud: "☁️",
      cloud_with_lightning: "🌩",
      cloud_with_lightning_and_rain: "⛈",
      cloud_with_rain: "🌧",
      cloud_with_snow: "🌨",
      clown_face: "🤡",
      clubs: "♣️",
      cocktail: "🍸",
      coffee: "☕️",
      coffin: "⚰️",
      cold_sweat: "😰",
      comet: "☄️",
      computer: "💻",
      computer_mouse: "🖱",
      confetti_ball: "🎊",
      confounded: "😖",
      confused: "😕",
      congratulations: "㊗️",
      construction: "🚧",
      construction_worker_man: "👷",
      construction_worker_woman: "👷&zwj;♀️",
      control_knobs: "🎛",
      convenience_store: "🏪",
      cookie: "🍪",
      cool: "🆒",
      policeman: "👮",
      copyright: "©️",
      corn: "🌽",
      couch_and_lamp: "🛋",
      couple: "👫",
      couple_with_heart_woman_man: "💑",
      couple_with_heart_man_man: "👨&zwj;❤️&zwj;👨",
      couple_with_heart_woman_woman: "👩&zwj;❤️&zwj;👩",
      couplekiss_man_man: "👨&zwj;❤️&zwj;💋&zwj;👨",
      couplekiss_man_woman: "💏",
      couplekiss_woman_woman: "👩&zwj;❤️&zwj;💋&zwj;👩",
      cow: "🐮",
      cow2: "🐄",
      cowboy_hat_face: "🤠",
      crab: "🦀",
      crayon: "🖍",
      credit_card: "💳",
      crescent_moon: "🌙",
      cricket: "🏏",
      crocodile: "🐊",
      croissant: "🥐",
      crossed_fingers: "🤞",
      crossed_flags: "🎌",
      crossed_swords: "⚔️",
      crown: "👑",
      cry: "😢",
      crying_cat_face: "😿",
      crystal_ball: "🔮",
      cucumber: "🥒",
      cupid: "💘",
      curly_loop: "➰",
      currency_exchange: "💱",
      curry: "🍛",
      custard: "🍮",
      customs: "🛃",
      cyclone: "🌀",
      dagger: "🗡",
      dancer: "💃",
      dancing_women: "👯",
      dancing_men: "👯&zwj;♂️",
      dango: "🍡",
      dark_sunglasses: "🕶",
      dart: "🎯",
      dash: "💨",
      date: "📅",
      deciduous_tree: "🌳",
      deer: "🦌",
      department_store: "🏬",
      derelict_house: "🏚",
      desert: "🏜",
      desert_island: "🏝",
      desktop_computer: "🖥",
      male_detective: "🕵️",
      diamond_shape_with_a_dot_inside: "💠",
      diamonds: "♦️",
      disappointed: "😞",
      disappointed_relieved: "😥",
      dizzy: "💫",
      dizzy_face: "😵",
      do_not_litter: "🚯",
      dog: "🐶",
      dog2: "🐕",
      dollar: "💵",
      dolls: "🎎",
      dolphin: "🐬",
      door: "🚪",
      doughnut: "🍩",
      dove: "🕊",
      dragon: "🐉",
      dragon_face: "🐲",
      dress: "👗",
      dromedary_camel: "🐪",
      drooling_face: "🤤",
      droplet: "💧",
      drum: "🥁",
      duck: "🦆",
      dvd: "📀",
      "e-mail": "📧",
      eagle: "🦅",
      ear: "👂",
      ear_of_rice: "🌾",
      earth_africa: "🌍",
      earth_americas: "🌎",
      earth_asia: "🌏",
      egg: "🥚",
      eggplant: "🍆",
      eight_pointed_black_star: "✴️",
      eight_spoked_asterisk: "✳️",
      electric_plug: "🔌",
      elephant: "🐘",
      email: "✉️",
      end: "🔚",
      envelope_with_arrow: "📩",
      euro: "💶",
      european_castle: "🏰",
      european_post_office: "🏤",
      evergreen_tree: "🌲",
      exclamation: "❗️",
      expressionless: "😑",
      eye: "👁",
      eye_speech_bubble: "👁&zwj;🗨",
      eyeglasses: "👓",
      eyes: "👀",
      face_with_head_bandage: "🤕",
      face_with_thermometer: "🤒",
      fist_oncoming: "👊",
      factory: "🏭",
      fallen_leaf: "🍂",
      family_man_woman_boy: "👪",
      family_man_boy: "👨&zwj;👦",
      family_man_boy_boy: "👨&zwj;👦&zwj;👦",
      family_man_girl: "👨&zwj;👧",
      family_man_girl_boy: "👨&zwj;👧&zwj;👦",
      family_man_girl_girl: "👨&zwj;👧&zwj;👧",
      family_man_man_boy: "👨&zwj;👨&zwj;👦",
      family_man_man_boy_boy: "👨&zwj;👨&zwj;👦&zwj;👦",
      family_man_man_girl: "👨&zwj;👨&zwj;👧",
      family_man_man_girl_boy: "👨&zwj;👨&zwj;👧&zwj;👦",
      family_man_man_girl_girl: "👨&zwj;👨&zwj;👧&zwj;👧",
      family_man_woman_boy_boy: "👨&zwj;👩&zwj;👦&zwj;👦",
      family_man_woman_girl: "👨&zwj;👩&zwj;👧",
      family_man_woman_girl_boy: "👨&zwj;👩&zwj;👧&zwj;👦",
      family_man_woman_girl_girl: "👨&zwj;👩&zwj;👧&zwj;👧",
      family_woman_boy: "👩&zwj;👦",
      family_woman_boy_boy: "👩&zwj;👦&zwj;👦",
      family_woman_girl: "👩&zwj;👧",
      family_woman_girl_boy: "👩&zwj;👧&zwj;👦",
      family_woman_girl_girl: "👩&zwj;👧&zwj;👧",
      family_woman_woman_boy: "👩&zwj;👩&zwj;👦",
      family_woman_woman_boy_boy: "👩&zwj;👩&zwj;👦&zwj;👦",
      family_woman_woman_girl: "👩&zwj;👩&zwj;👧",
      family_woman_woman_girl_boy: "👩&zwj;👩&zwj;👧&zwj;👦",
      family_woman_woman_girl_girl: "👩&zwj;👩&zwj;👧&zwj;👧",
      fast_forward: "⏩",
      fax: "📠",
      fearful: "😨",
      feet: "🐾",
      female_detective: "🕵️&zwj;♀️",
      ferris_wheel: "🎡",
      ferry: "⛴",
      field_hockey: "🏑",
      file_cabinet: "🗄",
      file_folder: "📁",
      film_projector: "📽",
      film_strip: "🎞",
      fire: "🔥",
      fire_engine: "🚒",
      fireworks: "🎆",
      first_quarter_moon: "🌓",
      first_quarter_moon_with_face: "🌛",
      fish: "🐟",
      fish_cake: "🍥",
      fishing_pole_and_fish: "🎣",
      fist_raised: "✊",
      fist_left: "🤛",
      fist_right: "🤜",
      flags: "🎏",
      flashlight: "🔦",
      fleur_de_lis: "⚜️",
      flight_arrival: "🛬",
      flight_departure: "🛫",
      floppy_disk: "💾",
      flower_playing_cards: "🎴",
      flushed: "😳",
      fog: "🌫",
      foggy: "🌁",
      football: "🏈",
      footprints: "👣",
      fork_and_knife: "🍴",
      fountain: "⛲️",
      fountain_pen: "🖋",
      four_leaf_clover: "🍀",
      fox_face: "🦊",
      framed_picture: "🖼",
      free: "🆓",
      fried_egg: "🍳",
      fried_shrimp: "🍤",
      fries: "🍟",
      frog: "🐸",
      frowning: "😦",
      frowning_face: "☹️",
      frowning_man: "🙍&zwj;♂️",
      frowning_woman: "🙍",
      middle_finger: "🖕",
      fuelpump: "⛽️",
      full_moon: "🌕",
      full_moon_with_face: "🌝",
      funeral_urn: "⚱️",
      game_die: "🎲",
      gear: "⚙️",
      gem: "💎",
      gemini: "♊️",
      ghost: "👻",
      gift: "🎁",
      gift_heart: "💝",
      girl: "👧",
      globe_with_meridians: "🌐",
      goal_net: "🥅",
      goat: "🐐",
      golf: "⛳️",
      golfing_man: "🏌️",
      golfing_woman: "🏌️&zwj;♀️",
      gorilla: "🦍",
      grapes: "🍇",
      green_apple: "🍏",
      green_book: "📗",
      green_heart: "💚",
      green_salad: "🥗",
      grey_exclamation: "❕",
      grey_question: "❔",
      grimacing: "😬",
      grin: "😁",
      grinning: "😀",
      guardsman: "💂",
      guardswoman: "💂&zwj;♀️",
      guitar: "🎸",
      gun: "🔫",
      haircut_woman: "💇",
      haircut_man: "💇&zwj;♂️",
      hamburger: "🍔",
      hammer: "🔨",
      hammer_and_pick: "⚒",
      hammer_and_wrench: "🛠",
      hamster: "🐹",
      hand: "✋",
      handbag: "👜",
      handshake: "🤝",
      hankey: "💩",
      hatched_chick: "🐥",
      hatching_chick: "🐣",
      headphones: "🎧",
      hear_no_evil: "🙉",
      heart: "❤️",
      heart_decoration: "💟",
      heart_eyes: "😍",
      heart_eyes_cat: "😻",
      heartbeat: "💓",
      heartpulse: "💗",
      hearts: "♥️",
      heavy_check_mark: "✔️",
      heavy_division_sign: "➗",
      heavy_dollar_sign: "💲",
      heavy_heart_exclamation: "❣️",
      heavy_minus_sign: "➖",
      heavy_multiplication_x: "✖️",
      heavy_plus_sign: "➕",
      helicopter: "🚁",
      herb: "🌿",
      hibiscus: "🌺",
      high_brightness: "🔆",
      high_heel: "👠",
      hocho: "🔪",
      hole: "🕳",
      honey_pot: "🍯",
      horse: "🐴",
      horse_racing: "🏇",
      hospital: "🏥",
      hot_pepper: "🌶",
      hotdog: "🌭",
      hotel: "🏨",
      hotsprings: "♨️",
      hourglass: "⌛️",
      hourglass_flowing_sand: "⏳",
      house: "🏠",
      house_with_garden: "🏡",
      houses: "🏘",
      hugs: "🤗",
      hushed: "😯",
      ice_cream: "🍨",
      ice_hockey: "🏒",
      ice_skate: "⛸",
      icecream: "🍦",
      id: "🆔",
      ideograph_advantage: "🉐",
      imp: "👿",
      inbox_tray: "📥",
      incoming_envelope: "📨",
      tipping_hand_woman: "💁",
      information_source: "ℹ️",
      innocent: "😇",
      interrobang: "⁉️",
      iphone: "📱",
      izakaya_lantern: "🏮",
      jack_o_lantern: "🎃",
      japan: "🗾",
      japanese_castle: "🏯",
      japanese_goblin: "👺",
      japanese_ogre: "👹",
      jeans: "👖",
      joy: "😂",
      joy_cat: "😹",
      joystick: "🕹",
      kaaba: "🕋",
      key: "🔑",
      keyboard: "⌨️",
      keycap_ten: "🔟",
      kick_scooter: "🛴",
      kimono: "👘",
      kiss: "💋",
      kissing: "😗",
      kissing_cat: "😽",
      kissing_closed_eyes: "😚",
      kissing_heart: "😘",
      kissing_smiling_eyes: "😙",
      kiwi_fruit: "🥝",
      koala: "🐨",
      koko: "🈁",
      label: "🏷",
      large_blue_circle: "🔵",
      large_blue_diamond: "🔷",
      large_orange_diamond: "🔶",
      last_quarter_moon: "🌗",
      last_quarter_moon_with_face: "🌜",
      latin_cross: "✝️",
      laughing: "😆",
      leaves: "🍃",
      ledger: "📒",
      left_luggage: "🛅",
      left_right_arrow: "↔️",
      leftwards_arrow_with_hook: "↩️",
      lemon: "🍋",
      leo: "♌️",
      leopard: "🐆",
      level_slider: "🎚",
      libra: "♎️",
      light_rail: "🚈",
      link: "🔗",
      lion: "🦁",
      lips: "👄",
      lipstick: "💄",
      lizard: "🦎",
      lock: "🔒",
      lock_with_ink_pen: "🔏",
      lollipop: "🍭",
      loop: "➿",
      loud_sound: "🔊",
      loudspeaker: "📢",
      love_hotel: "🏩",
      love_letter: "💌",
      low_brightness: "🔅",
      lying_face: "🤥",
      m: "Ⓜ️",
      mag: "🔍",
      mag_right: "🔎",
      mahjong: "🀄️",
      mailbox: "📫",
      mailbox_closed: "📪",
      mailbox_with_mail: "📬",
      mailbox_with_no_mail: "📭",
      man: "👨",
      man_artist: "👨&zwj;🎨",
      man_astronaut: "👨&zwj;🚀",
      man_cartwheeling: "🤸&zwj;♂️",
      man_cook: "👨&zwj;🍳",
      man_dancing: "🕺",
      man_facepalming: "🤦&zwj;♂️",
      man_factory_worker: "👨&zwj;🏭",
      man_farmer: "👨&zwj;🌾",
      man_firefighter: "👨&zwj;🚒",
      man_health_worker: "👨&zwj;⚕️",
      man_in_tuxedo: "🤵",
      man_judge: "👨&zwj;⚖️",
      man_juggling: "🤹&zwj;♂️",
      man_mechanic: "👨&zwj;🔧",
      man_office_worker: "👨&zwj;💼",
      man_pilot: "👨&zwj;✈️",
      man_playing_handball: "🤾&zwj;♂️",
      man_playing_water_polo: "🤽&zwj;♂️",
      man_scientist: "👨&zwj;🔬",
      man_shrugging: "🤷&zwj;♂️",
      man_singer: "👨&zwj;🎤",
      man_student: "👨&zwj;🎓",
      man_teacher: "👨&zwj;🏫",
      man_technologist: "👨&zwj;💻",
      man_with_gua_pi_mao: "👲",
      man_with_turban: "👳",
      tangerine: "🍊",
      mans_shoe: "👞",
      mantelpiece_clock: "🕰",
      maple_leaf: "🍁",
      martial_arts_uniform: "🥋",
      mask: "😷",
      massage_woman: "💆",
      massage_man: "💆&zwj;♂️",
      meat_on_bone: "🍖",
      medal_military: "🎖",
      medal_sports: "🏅",
      mega: "📣",
      melon: "🍈",
      memo: "📝",
      men_wrestling: "🤼&zwj;♂️",
      menorah: "🕎",
      mens: "🚹",
      metal: "🤘",
      metro: "🚇",
      microphone: "🎤",
      microscope: "🔬",
      milk_glass: "🥛",
      milky_way: "🌌",
      minibus: "🚐",
      minidisc: "💽",
      mobile_phone_off: "📴",
      money_mouth_face: "🤑",
      money_with_wings: "💸",
      moneybag: "💰",
      monkey: "🐒",
      monkey_face: "🐵",
      monorail: "🚝",
      moon: "🌔",
      mortar_board: "🎓",
      mosque: "🕌",
      motor_boat: "🛥",
      motor_scooter: "🛵",
      motorcycle: "🏍",
      motorway: "🛣",
      mount_fuji: "🗻",
      mountain: "⛰",
      mountain_biking_man: "🚵",
      mountain_biking_woman: "🚵&zwj;♀️",
      mountain_cableway: "🚠",
      mountain_railway: "🚞",
      mountain_snow: "🏔",
      mouse: "🐭",
      mouse2: "🐁",
      movie_camera: "🎥",
      moyai: "🗿",
      mrs_claus: "🤶",
      muscle: "💪",
      mushroom: "🍄",
      musical_keyboard: "🎹",
      musical_note: "🎵",
      musical_score: "🎼",
      mute: "🔇",
      nail_care: "💅",
      name_badge: "📛",
      national_park: "🏞",
      nauseated_face: "🤢",
      necktie: "👔",
      negative_squared_cross_mark: "❎",
      nerd_face: "🤓",
      neutral_face: "😐",
      new: "🆕",
      new_moon: "🌑",
      new_moon_with_face: "🌚",
      newspaper: "📰",
      newspaper_roll: "🗞",
      next_track_button: "⏭",
      ng: "🆖",
      no_good_man: "🙅&zwj;♂️",
      no_good_woman: "🙅",
      night_with_stars: "🌃",
      no_bell: "🔕",
      no_bicycles: "🚳",
      no_entry: "⛔️",
      no_entry_sign: "🚫",
      no_mobile_phones: "📵",
      no_mouth: "😶",
      no_pedestrians: "🚷",
      no_smoking: "🚭",
      "non-potable_water": "🚱",
      nose: "👃",
      notebook: "📓",
      notebook_with_decorative_cover: "📔",
      notes: "🎶",
      nut_and_bolt: "🔩",
      o: "⭕️",
      o2: "🅾️",
      ocean: "🌊",
      octopus: "🐙",
      oden: "🍢",
      office: "🏢",
      oil_drum: "🛢",
      ok: "🆗",
      ok_hand: "👌",
      ok_man: "🙆&zwj;♂️",
      ok_woman: "🙆",
      old_key: "🗝",
      older_man: "👴",
      older_woman: "👵",
      om: "🕉",
      on: "🔛",
      oncoming_automobile: "🚘",
      oncoming_bus: "🚍",
      oncoming_police_car: "🚔",
      oncoming_taxi: "🚖",
      open_file_folder: "📂",
      open_hands: "👐",
      open_mouth: "😮",
      open_umbrella: "☂️",
      ophiuchus: "⛎",
      orange_book: "📙",
      orthodox_cross: "☦️",
      outbox_tray: "📤",
      owl: "🦉",
      ox: "🐂",
      package: "📦",
      page_facing_up: "📄",
      page_with_curl: "📃",
      pager: "📟",
      paintbrush: "🖌",
      palm_tree: "🌴",
      pancakes: "🥞",
      panda_face: "🐼",
      paperclip: "📎",
      paperclips: "🖇",
      parasol_on_ground: "⛱",
      parking: "🅿️",
      part_alternation_mark: "〽️",
      partly_sunny: "⛅️",
      passenger_ship: "🛳",
      passport_control: "🛂",
      pause_button: "⏸",
      peace_symbol: "☮️",
      peach: "🍑",
      peanuts: "🥜",
      pear: "🍐",
      pen: "🖊",
      pencil2: "✏️",
      penguin: "🐧",
      pensive: "😔",
      performing_arts: "🎭",
      persevere: "😣",
      person_fencing: "🤺",
      pouting_woman: "🙎",
      phone: "☎️",
      pick: "⛏",
      pig: "🐷",
      pig2: "🐖",
      pig_nose: "🐽",
      pill: "💊",
      pineapple: "🍍",
      ping_pong: "🏓",
      pisces: "♓️",
      pizza: "🍕",
      place_of_worship: "🛐",
      plate_with_cutlery: "🍽",
      play_or_pause_button: "⏯",
      point_down: "👇",
      point_left: "👈",
      point_right: "👉",
      point_up: "☝️",
      point_up_2: "👆",
      police_car: "🚓",
      policewoman: "👮&zwj;♀️",
      poodle: "🐩",
      popcorn: "🍿",
      post_office: "🏣",
      postal_horn: "📯",
      postbox: "📮",
      potable_water: "🚰",
      potato: "🥔",
      pouch: "👝",
      poultry_leg: "🍗",
      pound: "💷",
      rage: "😡",
      pouting_cat: "😾",
      pouting_man: "🙎&zwj;♂️",
      pray: "🙏",
      prayer_beads: "📿",
      pregnant_woman: "🤰",
      previous_track_button: "⏮",
      prince: "🤴",
      princess: "👸",
      printer: "🖨",
      purple_heart: "💜",
      purse: "👛",
      pushpin: "📌",
      put_litter_in_its_place: "🚮",
      question: "❓",
      rabbit: "🐰",
      rabbit2: "🐇",
      racehorse: "🐎",
      racing_car: "🏎",
      radio: "📻",
      radio_button: "🔘",
      radioactive: "☢️",
      railway_car: "🚃",
      railway_track: "🛤",
      rainbow: "🌈",
      rainbow_flag: "🏳️&zwj;🌈",
      raised_back_of_hand: "🤚",
      raised_hand_with_fingers_splayed: "🖐",
      raised_hands: "🙌",
      raising_hand_woman: "🙋",
      raising_hand_man: "🙋&zwj;♂️",
      ram: "🐏",
      ramen: "🍜",
      rat: "🐀",
      record_button: "⏺",
      recycle: "♻️",
      red_circle: "🔴",
      registered: "®️",
      relaxed: "☺️",
      relieved: "😌",
      reminder_ribbon: "🎗",
      repeat: "🔁",
      repeat_one: "🔂",
      rescue_worker_helmet: "⛑",
      restroom: "🚻",
      revolving_hearts: "💞",
      rewind: "⏪",
      rhinoceros: "🦏",
      ribbon: "🎀",
      rice: "🍚",
      rice_ball: "🍙",
      rice_cracker: "🍘",
      rice_scene: "🎑",
      right_anger_bubble: "🗯",
      ring: "💍",
      robot: "🤖",
      rocket: "🚀",
      rofl: "🤣",
      roll_eyes: "🙄",
      roller_coaster: "🎢",
      rooster: "🐓",
      rose: "🌹",
      rosette: "🏵",
      rotating_light: "🚨",
      round_pushpin: "📍",
      rowing_man: "🚣",
      rowing_woman: "🚣&zwj;♀️",
      rugby_football: "🏉",
      running_man: "🏃",
      running_shirt_with_sash: "🎽",
      running_woman: "🏃&zwj;♀️",
      sa: "🈂️",
      sagittarius: "♐️",
      sake: "🍶",
      sandal: "👡",
      santa: "🎅",
      satellite: "📡",
      saxophone: "🎷",
      school: "🏫",
      school_satchel: "🎒",
      scissors: "✂️",
      scorpion: "🦂",
      scorpius: "♏️",
      scream: "😱",
      scream_cat: "🙀",
      scroll: "📜",
      seat: "💺",
      secret: "㊙️",
      see_no_evil: "🙈",
      seedling: "🌱",
      selfie: "🤳",
      shallow_pan_of_food: "🥘",
      shamrock: "☘️",
      shark: "🦈",
      shaved_ice: "🍧",
      sheep: "🐑",
      shell: "🐚",
      shield: "🛡",
      shinto_shrine: "⛩",
      ship: "🚢",
      shirt: "👕",
      shopping: "🛍",
      shopping_cart: "🛒",
      shower: "🚿",
      shrimp: "🦐",
      signal_strength: "📶",
      six_pointed_star: "🔯",
      ski: "🎿",
      skier: "⛷",
      skull: "💀",
      skull_and_crossbones: "☠️",
      sleeping: "😴",
      sleeping_bed: "🛌",
      sleepy: "😪",
      slightly_frowning_face: "🙁",
      slightly_smiling_face: "🙂",
      slot_machine: "🎰",
      small_airplane: "🛩",
      small_blue_diamond: "🔹",
      small_orange_diamond: "🔸",
      small_red_triangle: "🔺",
      small_red_triangle_down: "🔻",
      smile: "😄",
      smile_cat: "😸",
      smiley: "😃",
      smiley_cat: "😺",
      smiling_imp: "😈",
      smirk: "😏",
      smirk_cat: "😼",
      smoking: "🚬",
      snail: "🐌",
      snake: "🐍",
      sneezing_face: "🤧",
      snowboarder: "🏂",
      snowflake: "❄️",
      snowman: "⛄️",
      snowman_with_snow: "☃️",
      sob: "😭",
      soccer: "⚽️",
      soon: "🔜",
      sos: "🆘",
      sound: "🔉",
      space_invader: "👾",
      spades: "♠️",
      spaghetti: "🍝",
      sparkle: "❇️",
      sparkler: "🎇",
      sparkles: "✨",
      sparkling_heart: "💖",
      speak_no_evil: "🙊",
      speaker: "🔈",
      speaking_head: "🗣",
      speech_balloon: "💬",
      speedboat: "🚤",
      spider: "🕷",
      spider_web: "🕸",
      spiral_calendar: "🗓",
      spiral_notepad: "🗒",
      spoon: "🥄",
      squid: "🦑",
      stadium: "🏟",
      star: "⭐️",
      star2: "🌟",
      star_and_crescent: "☪️",
      star_of_david: "✡️",
      stars: "🌠",
      station: "🚉",
      statue_of_liberty: "🗽",
      steam_locomotive: "🚂",
      stew: "🍲",
      stop_button: "⏹",
      stop_sign: "🛑",
      stopwatch: "⏱",
      straight_ruler: "📏",
      strawberry: "🍓",
      stuck_out_tongue: "😛",
      stuck_out_tongue_closed_eyes: "😝",
      stuck_out_tongue_winking_eye: "😜",
      studio_microphone: "🎙",
      stuffed_flatbread: "🥙",
      sun_behind_large_cloud: "🌥",
      sun_behind_rain_cloud: "🌦",
      sun_behind_small_cloud: "🌤",
      sun_with_face: "🌞",
      sunflower: "🌻",
      sunglasses: "😎",
      sunny: "☀️",
      sunrise: "🌅",
      sunrise_over_mountains: "🌄",
      surfing_man: "🏄",
      surfing_woman: "🏄&zwj;♀️",
      sushi: "🍣",
      suspension_railway: "🚟",
      sweat: "😓",
      sweat_drops: "💦",
      sweat_smile: "😅",
      sweet_potato: "🍠",
      swimming_man: "🏊",
      swimming_woman: "🏊&zwj;♀️",
      symbols: "🔣",
      synagogue: "🕍",
      syringe: "💉",
      taco: "🌮",
      tada: "🎉",
      tanabata_tree: "🎋",
      taurus: "♉️",
      taxi: "🚕",
      tea: "🍵",
      telephone_receiver: "📞",
      telescope: "🔭",
      tennis: "🎾",
      tent: "⛺️",
      thermometer: "🌡",
      thinking: "🤔",
      thought_balloon: "💭",
      ticket: "🎫",
      tickets: "🎟",
      tiger: "🐯",
      tiger2: "🐅",
      timer_clock: "⏲",
      tipping_hand_man: "💁&zwj;♂️",
      tired_face: "😫",
      tm: "™️",
      toilet: "🚽",
      tokyo_tower: "🗼",
      tomato: "🍅",
      tongue: "👅",
      top: "🔝",
      tophat: "🎩",
      tornado: "🌪",
      trackball: "🖲",
      tractor: "🚜",
      traffic_light: "🚥",
      train: "🚋",
      train2: "🚆",
      tram: "🚊",
      triangular_flag_on_post: "🚩",
      triangular_ruler: "📐",
      trident: "🔱",
      triumph: "😤",
      trolleybus: "🚎",
      trophy: "🏆",
      tropical_drink: "🍹",
      tropical_fish: "🐠",
      truck: "🚚",
      trumpet: "🎺",
      tulip: "🌷",
      tumbler_glass: "🥃",
      turkey: "🦃",
      turtle: "🐢",
      tv: "📺",
      twisted_rightwards_arrows: "🔀",
      two_hearts: "💕",
      two_men_holding_hands: "👬",
      two_women_holding_hands: "👭",
      u5272: "🈹",
      u5408: "🈴",
      u55b6: "🈺",
      u6307: "🈯️",
      u6708: "🈷️",
      u6709: "🈶",
      u6e80: "🈵",
      u7121: "🈚️",
      u7533: "🈸",
      u7981: "🈲",
      u7a7a: "🈳",
      umbrella: "☔️",
      unamused: "😒",
      underage: "🔞",
      unicorn: "🦄",
      unlock: "🔓",
      up: "🆙",
      upside_down_face: "🙃",
      v: "✌️",
      vertical_traffic_light: "🚦",
      vhs: "📼",
      vibration_mode: "📳",
      video_camera: "📹",
      video_game: "🎮",
      violin: "🎻",
      virgo: "♍️",
      volcano: "🌋",
      volleyball: "🏐",
      vs: "🆚",
      vulcan_salute: "🖖",
      walking_man: "🚶",
      walking_woman: "🚶&zwj;♀️",
      waning_crescent_moon: "🌘",
      waning_gibbous_moon: "🌖",
      warning: "⚠️",
      wastebasket: "🗑",
      watch: "⌚️",
      water_buffalo: "🐃",
      watermelon: "🍉",
      wave: "👋",
      wavy_dash: "〰️",
      waxing_crescent_moon: "🌒",
      wc: "🚾",
      weary: "😩",
      wedding: "💒",
      weight_lifting_man: "🏋️",
      weight_lifting_woman: "🏋️&zwj;♀️",
      whale: "🐳",
      whale2: "🐋",
      wheel_of_dharma: "☸️",
      wheelchair: "♿️",
      white_check_mark: "✅",
      white_circle: "⚪️",
      white_flag: "🏳️",
      white_flower: "💮",
      white_large_square: "⬜️",
      white_medium_small_square: "◽️",
      white_medium_square: "◻️",
      white_small_square: "▫️",
      white_square_button: "🔳",
      wilted_flower: "🥀",
      wind_chime: "🎐",
      wind_face: "🌬",
      wine_glass: "🍷",
      wink: "😉",
      wolf: "🐺",
      woman: "👩",
      woman_artist: "👩&zwj;🎨",
      woman_astronaut: "👩&zwj;🚀",
      woman_cartwheeling: "🤸&zwj;♀️",
      woman_cook: "👩&zwj;🍳",
      woman_facepalming: "🤦&zwj;♀️",
      woman_factory_worker: "👩&zwj;🏭",
      woman_farmer: "👩&zwj;🌾",
      woman_firefighter: "👩&zwj;🚒",
      woman_health_worker: "👩&zwj;⚕️",
      woman_judge: "👩&zwj;⚖️",
      woman_juggling: "🤹&zwj;♀️",
      woman_mechanic: "👩&zwj;🔧",
      woman_office_worker: "👩&zwj;💼",
      woman_pilot: "👩&zwj;✈️",
      woman_playing_handball: "🤾&zwj;♀️",
      woman_playing_water_polo: "🤽&zwj;♀️",
      woman_scientist: "👩&zwj;🔬",
      woman_shrugging: "🤷&zwj;♀️",
      woman_singer: "👩&zwj;🎤",
      woman_student: "👩&zwj;🎓",
      woman_teacher: "👩&zwj;🏫",
      woman_technologist: "👩&zwj;💻",
      woman_with_turban: "👳&zwj;♀️",
      womans_clothes: "👚",
      womans_hat: "👒",
      women_wrestling: "🤼&zwj;♀️",
      womens: "🚺",
      world_map: "🗺",
      worried: "😟",
      wrench: "🔧",
      writing_hand: "✍️",
      x: "❌",
      yellow_heart: "💛",
      yen: "💴",
      yin_yang: "☯️",
      yum: "😋",
      zap: "⚡️",
      zipper_mouth_face: "🤐",
      zzz: "💤",
      /* special emojis :P */
      octocat: '<img alt=":octocat:" height="20" width="20" align="absmiddle" src="https://assets-cdn.github.com/images/icons/emoji/octocat.png">',
      showdown: `<span style="font-family: 'Anonymous Pro', monospace; text-decoration: underline; text-decoration-style: dashed; text-decoration-color: #3e8b8a;text-underline-position: under;">S</span>`
    }, a.Converter = function(n) {
      var i = {}, o = [], c = [], u = {}, f = b, g = {
        parsed: {},
        raw: "",
        format: ""
      };
      O();
      function O() {
        n = n || {};
        for (var w in d)
          d.hasOwnProperty(w) && (i[w] = d[w]);
        if (typeof n == "object")
          for (var U in n)
            n.hasOwnProperty(U) && (i[U] = n[U]);
        else
          throw Error("Converter expects the passed parameter to be an object, but " + typeof n + " was passed instead.");
        i.extensions && a.helper.forEach(i.extensions, z);
      }
      function z(w, U) {
        if (U = U || null, a.helper.isString(w))
          if (w = a.helper.stdExtName(w), U = w, a.extensions[w]) {
            console.warn("DEPRECATION WARNING: " + w + " is an old extension that uses a deprecated loading method.Please inform the developer that the extension should be updated!"), q(a.extensions[w], w);
            return;
          } else if (!a.helper.isUndefined(l[w]))
            w = l[w];
          else
            throw Error('Extension "' + w + '" could not be loaded. It was either not found or is not a valid extension.');
        typeof w == "function" && (w = w()), a.helper.isArray(w) || (w = [w]);
        var W = y(w, U);
        if (!W.valid)
          throw Error(W.error);
        for (var J = 0; J < w.length; ++J) {
          switch (w[J].type) {
            case "lang":
              o.push(w[J]);
              break;
            case "output":
              c.push(w[J]);
              break;
          }
          if (w[J].hasOwnProperty("listeners"))
            for (var V in w[J].listeners)
              w[J].listeners.hasOwnProperty(V) && B(V, w[J].listeners[V]);
        }
      }
      function q(w, U) {
        typeof w == "function" && (w = w(new a.Converter())), a.helper.isArray(w) || (w = [w]);
        var W = y(w, U);
        if (!W.valid)
          throw Error(W.error);
        for (var J = 0; J < w.length; ++J)
          switch (w[J].type) {
            case "lang":
              o.push(w[J]);
              break;
            case "output":
              c.push(w[J]);
              break;
            default:
              throw Error("Extension loader error: Type unrecognized!!!");
          }
      }
      function B(w, U) {
        if (!a.helper.isString(w))
          throw Error("Invalid argument in converter.listen() method: name must be a string, but " + typeof w + " given");
        if (typeof U != "function")
          throw Error("Invalid argument in converter.listen() method: callback must be a function, but " + typeof U + " given");
        u.hasOwnProperty(w) || (u[w] = []), u[w].push(U);
      }
      function G(w) {
        var U = w.match(/^\s*/)[0].length, W = new RegExp("^\\s{0," + U + "}", "gm");
        return w.replace(W, "");
      }
      this._dispatch = function(w, U, W, J) {
        if (u.hasOwnProperty(w))
          for (var V = 0; V < u[w].length; ++V) {
            var P = u[w][V](w, U, this, W, J);
            P && typeof P < "u" && (U = P);
          }
        return U;
      }, this.listen = function(w, U) {
        return B(w, U), this;
      }, this.makeHtml = function(w) {
        if (!w)
          return w;
        var U = {
          gHtmlBlocks: [],
          gHtmlMdBlocks: [],
          gHtmlSpans: [],
          gUrls: {},
          gTitles: {},
          gDimensions: {},
          gListLevel: 0,
          hashLinkCounts: {},
          langExtensions: o,
          outputModifiers: c,
          converter: this,
          ghCodeBlocks: [],
          metadata: {
            parsed: {},
            raw: "",
            format: ""
          }
        };
        return w = w.replace(/¨/g, "¨T"), w = w.replace(/\$/g, "¨D"), w = w.replace(/\r\n/g, `
`), w = w.replace(/\r/g, `
`), w = w.replace(/\u00A0/g, "&nbsp;"), i.smartIndentationFix && (w = G(w)), w = `

` + w + `

`, w = a.subParser("detab")(w, i, U), w = w.replace(/^[ \t]+$/mg, ""), a.helper.forEach(o, function(W) {
          w = a.subParser("runExtension")(W, w, i, U);
        }), w = a.subParser("metadata")(w, i, U), w = a.subParser("hashPreCodeTags")(w, i, U), w = a.subParser("githubCodeBlocks")(w, i, U), w = a.subParser("hashHTMLBlocks")(w, i, U), w = a.subParser("hashCodeTags")(w, i, U), w = a.subParser("stripLinkDefinitions")(w, i, U), w = a.subParser("blockGamut")(w, i, U), w = a.subParser("unhashHTMLSpans")(w, i, U), w = a.subParser("unescapeSpecialChars")(w, i, U), w = w.replace(/¨D/g, "$$"), w = w.replace(/¨T/g, "¨"), w = a.subParser("completeHTMLDocument")(w, i, U), a.helper.forEach(c, function(W) {
          w = a.subParser("runExtension")(W, w, i, U);
        }), g = U.metadata, w;
      }, this.makeMarkdown = this.makeMd = function(w, U) {
        if (w = w.replace(/\r\n/g, `
`), w = w.replace(/\r/g, `
`), w = w.replace(/>[ \t]+</, ">¨NBSP;<"), !U)
          if (window && window.document)
            U = window.document;
          else
            throw new Error("HTMLParser is undefined. If in a webworker or nodejs environment, you need to provide a WHATWG DOM and HTML such as JSDOM");
        var W = U.createElement("div");
        W.innerHTML = w;
        var J = {
          preList: h(W)
        };
        L(W);
        for (var V = W.childNodes, P = "", F = 0; F < V.length; F++)
          P += a.subParser("makeMarkdown.node")(V[F], J);
        function L($) {
          for (var I = 0; I < $.childNodes.length; ++I) {
            var H = $.childNodes[I];
            H.nodeType === 3 ? !/\S/.test(H.nodeValue) && !/^[ ]+$/.test(H.nodeValue) ? ($.removeChild(H), --I) : (H.nodeValue = H.nodeValue.split(`
`).join(" "), H.nodeValue = H.nodeValue.replace(/(\s)+/g, "$1")) : H.nodeType === 1 && L(H);
          }
        }
        function h($) {
          for (var I = $.querySelectorAll("pre"), H = [], K = 0; K < I.length; ++K)
            if (I[K].childElementCount === 1 && I[K].firstChild.tagName.toLowerCase() === "code") {
              var te = I[K].firstChild.innerHTML.trim(), ne = I[K].firstChild.getAttribute("data-language") || "";
              if (ne === "")
                for (var be = I[K].firstChild.className.split(" "), Ae = 0; Ae < be.length; ++Ae) {
                  var ut = be[Ae].match(/^language-(.+)$/);
                  if (ut !== null) {
                    ne = ut[1];
                    break;
                  }
                }
              te = a.helper.unescapeHTMLEntities(te), H.push(te), I[K].outerHTML = '<precode language="' + ne + '" precodenum="' + K.toString() + '"></precode>';
            } else
              H.push(I[K].innerHTML), I[K].innerHTML = "", I[K].setAttribute("prenum", K.toString());
          return H;
        }
        return P;
      }, this.setOption = function(w, U) {
        i[w] = U;
      }, this.getOption = function(w) {
        return i[w];
      }, this.getOptions = function() {
        return i;
      }, this.addExtension = function(w, U) {
        U = U || null, z(w, U);
      }, this.useExtension = function(w) {
        z(w);
      }, this.setFlavor = function(w) {
        if (!_.hasOwnProperty(w))
          throw Error(w + " flavor was not found");
        var U = _[w];
        f = w;
        for (var W in U)
          U.hasOwnProperty(W) && (i[W] = U[W]);
      }, this.getFlavor = function() {
        return f;
      }, this.removeExtension = function(w) {
        a.helper.isArray(w) || (w = [w]);
        for (var U = 0; U < w.length; ++U) {
          for (var W = w[U], J = 0; J < o.length; ++J)
            o[J] === W && o.splice(J, 1);
          for (var V = 0; V < c.length; ++V)
            c[V] === W && c.splice(V, 1);
        }
      }, this.getAllExtensions = function() {
        return {
          language: o,
          output: c
        };
      }, this.getMetadata = function(w) {
        return w ? g.raw : g.parsed;
      }, this.getMetadataFormat = function() {
        return g.format;
      }, this._setMetadataPair = function(w, U) {
        g.parsed[w] = U;
      }, this._setMetadataFormat = function(w) {
        g.format = w;
      }, this._setMetadataRaw = function(w) {
        g.raw = w;
      };
    }, a.subParser("anchors", function(n, i, o) {
      n = o.converter._dispatch("anchors.before", n, i, o);
      var c = function(u, f, g, O, z, q, B) {
        if (a.helper.isUndefined(B) && (B = ""), g = g.toLowerCase(), u.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          O = "";
        else if (!O)
          if (g || (g = f.toLowerCase().replace(/ ?\n/g, " ")), O = "#" + g, !a.helper.isUndefined(o.gUrls[g]))
            O = o.gUrls[g], a.helper.isUndefined(o.gTitles[g]) || (B = o.gTitles[g]);
          else
            return u;
        O = O.replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback);
        var G = '<a href="' + O + '"';
        return B !== "" && B !== null && (B = B.replace(/"/g, "&quot;"), B = B.replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback), G += ' title="' + B + '"'), i.openLinksInNewWindow && !/^#/.test(O) && (G += ' rel="noopener noreferrer" target="¨E95Eblank"'), G += ">" + f + "</a>", G;
      };
      return n = n.replace(/\[((?:\[[^\]]*]|[^\[\]])*)] ?(?:\n *)?\[(.*?)]()()()()/g, c), n = n.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<([^>]*)>(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        c
      ), n = n.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        c
      ), n = n.replace(/\[([^\[\]]+)]()()()()()/g, c), i.ghMentions && (n = n.replace(/(^|\s)(\\)?(@([a-z\d]+(?:[a-z\d.-]+?[a-z\d]+)*))/gmi, function(u, f, g, O, z) {
        if (g === "\\")
          return f + O;
        if (!a.helper.isString(i.ghMentionsLink))
          throw new Error("ghMentionsLink option must be a string");
        var q = i.ghMentionsLink.replace(/\{u}/g, z), B = "";
        return i.openLinksInNewWindow && (B = ' rel="noopener noreferrer" target="¨E95Eblank"'), f + '<a href="' + q + '"' + B + ">" + O + "</a>";
      })), n = o.converter._dispatch("anchors.after", n, i, o), n;
    });
    var N = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+?\.[^'">\s]+?)()(\1)?(?=\s|$)(?!["<>])/gi, A = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+?)([.!?,()\[\]])?(\1)?(?=\s|$)(?!["<>])/gi, j = /()<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)()>()/gi, C = /(^|\s)(?:mailto:)?([A-Za-z0-9!#$%&'*+-/=?^_`{|}~.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?=$|\s)/gmi, x = /<()(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi, v = function(n) {
      return function(i, o, c, u, f, g, O) {
        c = c.replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback);
        var z = c, q = "", B = "", G = o || "", w = O || "";
        return /^www\./i.test(c) && (c = c.replace(/^www\./i, "http://www.")), n.excludeTrailingPunctuationFromURLs && g && (q = g), n.openLinksInNewWindow && (B = ' rel="noopener noreferrer" target="¨E95Eblank"'), G + '<a href="' + c + '"' + B + ">" + z + "</a>" + q + w;
      };
    }, T = function(n, i) {
      return function(o, c, u) {
        var f = "mailto:";
        return c = c || "", u = a.subParser("unescapeSpecialChars")(u, n, i), n.encodeEmails ? (f = a.helper.encodeEmailAddress(f + u), u = a.helper.encodeEmailAddress(u)) : f = f + u, c + '<a href="' + f + '">' + u + "</a>";
      };
    };
    a.subParser("autoLinks", function(n, i, o) {
      return n = o.converter._dispatch("autoLinks.before", n, i, o), n = n.replace(j, v(i)), n = n.replace(x, T(i, o)), n = o.converter._dispatch("autoLinks.after", n, i, o), n;
    }), a.subParser("simplifiedAutoLinks", function(n, i, o) {
      return i.simplifiedAutoLink && (n = o.converter._dispatch("simplifiedAutoLinks.before", n, i, o), i.excludeTrailingPunctuationFromURLs ? n = n.replace(A, v(i)) : n = n.replace(N, v(i)), n = n.replace(C, T(i, o)), n = o.converter._dispatch("simplifiedAutoLinks.after", n, i, o)), n;
    }), a.subParser("blockGamut", function(n, i, o) {
      return n = o.converter._dispatch("blockGamut.before", n, i, o), n = a.subParser("blockQuotes")(n, i, o), n = a.subParser("headers")(n, i, o), n = a.subParser("horizontalRule")(n, i, o), n = a.subParser("lists")(n, i, o), n = a.subParser("codeBlocks")(n, i, o), n = a.subParser("tables")(n, i, o), n = a.subParser("hashHTMLBlocks")(n, i, o), n = a.subParser("paragraphs")(n, i, o), n = o.converter._dispatch("blockGamut.after", n, i, o), n;
    }), a.subParser("blockQuotes", function(n, i, o) {
      n = o.converter._dispatch("blockQuotes.before", n, i, o), n = n + `

`;
      var c = /(^ {0,3}>[ \t]?.+\n(.+\n)*\n*)+/gm;
      return i.splitAdjacentBlockquotes && (c = /^ {0,3}>[\s\S]*?(?:\n\n)/gm), n = n.replace(c, function(u) {
        return u = u.replace(/^[ \t]*>[ \t]?/gm, ""), u = u.replace(/¨0/g, ""), u = u.replace(/^[ \t]+$/gm, ""), u = a.subParser("githubCodeBlocks")(u, i, o), u = a.subParser("blockGamut")(u, i, o), u = u.replace(/(^|\n)/g, "$1  "), u = u.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(f, g) {
          var O = g;
          return O = O.replace(/^  /mg, "¨0"), O = O.replace(/¨0/g, ""), O;
        }), a.subParser("hashBlock")(`<blockquote>
` + u + `
</blockquote>`, i, o);
      }), n = o.converter._dispatch("blockQuotes.after", n, i, o), n;
    }), a.subParser("codeBlocks", function(n, i, o) {
      n = o.converter._dispatch("codeBlocks.before", n, i, o), n += "¨0";
      var c = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=¨0))/g;
      return n = n.replace(c, function(u, f, g) {
        var O = f, z = g, q = `
`;
        return O = a.subParser("outdent")(O, i, o), O = a.subParser("encodeCode")(O, i, o), O = a.subParser("detab")(O, i, o), O = O.replace(/^\n+/g, ""), O = O.replace(/\n+$/g, ""), i.omitExtraWLInCodeBlocks && (q = ""), O = "<pre><code>" + O + q + "</code></pre>", a.subParser("hashBlock")(O, i, o) + z;
      }), n = n.replace(/¨0/, ""), n = o.converter._dispatch("codeBlocks.after", n, i, o), n;
    }), a.subParser("codeSpans", function(n, i, o) {
      return n = o.converter._dispatch("codeSpans.before", n, i, o), typeof n > "u" && (n = ""), n = n.replace(
        /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
        function(c, u, f, g) {
          var O = g;
          return O = O.replace(/^([ \t]*)/g, ""), O = O.replace(/[ \t]*$/g, ""), O = a.subParser("encodeCode")(O, i, o), O = u + "<code>" + O + "</code>", O = a.subParser("hashHTMLSpans")(O, i, o), O;
        }
      ), n = o.converter._dispatch("codeSpans.after", n, i, o), n;
    }), a.subParser("completeHTMLDocument", function(n, i, o) {
      if (!i.completeHTMLDocument)
        return n;
      n = o.converter._dispatch("completeHTMLDocument.before", n, i, o);
      var c = "html", u = `<!DOCTYPE HTML>
`, f = "", g = `<meta charset="utf-8">
`, O = "", z = "";
      typeof o.metadata.parsed.doctype < "u" && (u = "<!DOCTYPE " + o.metadata.parsed.doctype + `>
`, c = o.metadata.parsed.doctype.toString().toLowerCase(), (c === "html" || c === "html5") && (g = '<meta charset="utf-8">'));
      for (var q in o.metadata.parsed)
        if (o.metadata.parsed.hasOwnProperty(q))
          switch (q.toLowerCase()) {
            case "doctype":
              break;
            case "title":
              f = "<title>" + o.metadata.parsed.title + `</title>
`;
              break;
            case "charset":
              c === "html" || c === "html5" ? g = '<meta charset="' + o.metadata.parsed.charset + `">
` : g = '<meta name="charset" content="' + o.metadata.parsed.charset + `">
`;
              break;
            case "language":
            case "lang":
              O = ' lang="' + o.metadata.parsed[q] + '"', z += '<meta name="' + q + '" content="' + o.metadata.parsed[q] + `">
`;
              break;
            default:
              z += '<meta name="' + q + '" content="' + o.metadata.parsed[q] + `">
`;
          }
      return n = u + "<html" + O + `>
<head>
` + f + g + z + `</head>
<body>
` + n.trim() + `
</body>
</html>`, n = o.converter._dispatch("completeHTMLDocument.after", n, i, o), n;
    }), a.subParser("detab", function(n, i, o) {
      return n = o.converter._dispatch("detab.before", n, i, o), n = n.replace(/\t(?=\t)/g, "    "), n = n.replace(/\t/g, "¨A¨B"), n = n.replace(/¨B(.+?)¨A/g, function(c, u) {
        for (var f = u, g = 4 - f.length % 4, O = 0; O < g; O++)
          f += " ";
        return f;
      }), n = n.replace(/¨A/g, "    "), n = n.replace(/¨B/g, ""), n = o.converter._dispatch("detab.after", n, i, o), n;
    }), a.subParser("ellipsis", function(n, i, o) {
      return i.ellipsis && (n = o.converter._dispatch("ellipsis.before", n, i, o), n = n.replace(/\.\.\./g, "…"), n = o.converter._dispatch("ellipsis.after", n, i, o)), n;
    }), a.subParser("emoji", function(n, i, o) {
      if (!i.emoji)
        return n;
      n = o.converter._dispatch("emoji.before", n, i, o);
      var c = /:([\S]+?):/g;
      return n = n.replace(c, function(u, f) {
        return a.helper.emojis.hasOwnProperty(f) ? a.helper.emojis[f] : u;
      }), n = o.converter._dispatch("emoji.after", n, i, o), n;
    }), a.subParser("encodeAmpsAndAngles", function(n, i, o) {
      return n = o.converter._dispatch("encodeAmpsAndAngles.before", n, i, o), n = n.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;"), n = n.replace(/<(?![a-z\/?$!])/gi, "&lt;"), n = n.replace(/</g, "&lt;"), n = n.replace(/>/g, "&gt;"), n = o.converter._dispatch("encodeAmpsAndAngles.after", n, i, o), n;
    }), a.subParser("encodeBackslashEscapes", function(n, i, o) {
      return n = o.converter._dispatch("encodeBackslashEscapes.before", n, i, o), n = n.replace(/\\(\\)/g, a.helper.escapeCharactersCallback), n = n.replace(/\\([`*_{}\[\]()>#+.!~=|:-])/g, a.helper.escapeCharactersCallback), n = o.converter._dispatch("encodeBackslashEscapes.after", n, i, o), n;
    }), a.subParser("encodeCode", function(n, i, o) {
      return n = o.converter._dispatch("encodeCode.before", n, i, o), n = n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/([*_{}\[\]\\=~-])/g, a.helper.escapeCharactersCallback), n = o.converter._dispatch("encodeCode.after", n, i, o), n;
    }), a.subParser("escapeSpecialCharsWithinTagAttributes", function(n, i, o) {
      n = o.converter._dispatch("escapeSpecialCharsWithinTagAttributes.before", n, i, o);
      var c = /<\/?[a-z\d_:-]+(?:[\s]+[\s\S]+?)?>/gi, u = /<!(--(?:(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>/gi;
      return n = n.replace(c, function(f) {
        return f.replace(/(.)<\/?code>(?=.)/g, "$1`").replace(/([\\`*_~=|])/g, a.helper.escapeCharactersCallback);
      }), n = n.replace(u, function(f) {
        return f.replace(/([\\`*_~=|])/g, a.helper.escapeCharactersCallback);
      }), n = o.converter._dispatch("escapeSpecialCharsWithinTagAttributes.after", n, i, o), n;
    }), a.subParser("githubCodeBlocks", function(n, i, o) {
      return i.ghCodeBlocks ? (n = o.converter._dispatch("githubCodeBlocks.before", n, i, o), n += "¨0", n = n.replace(/(?:^|\n)(?: {0,3})(```+|~~~+)(?: *)([^\s`~]*)\n([\s\S]*?)\n(?: {0,3})\1/g, function(c, u, f, g) {
        var O = i.omitExtraWLInCodeBlocks ? "" : `
`;
        return g = a.subParser("encodeCode")(g, i, o), g = a.subParser("detab")(g, i, o), g = g.replace(/^\n+/g, ""), g = g.replace(/\n+$/g, ""), g = "<pre><code" + (f ? ' class="' + f + " language-" + f + '"' : "") + ">" + g + O + "</code></pre>", g = a.subParser("hashBlock")(g, i, o), `

¨G` + (o.ghCodeBlocks.push({ text: c, codeblock: g }) - 1) + `G

`;
      }), n = n.replace(/¨0/, ""), o.converter._dispatch("githubCodeBlocks.after", n, i, o)) : n;
    }), a.subParser("hashBlock", function(n, i, o) {
      return n = o.converter._dispatch("hashBlock.before", n, i, o), n = n.replace(/(^\n+|\n+$)/g, ""), n = `

¨K` + (o.gHtmlBlocks.push(n) - 1) + `K

`, n = o.converter._dispatch("hashBlock.after", n, i, o), n;
    }), a.subParser("hashCodeTags", function(n, i, o) {
      n = o.converter._dispatch("hashCodeTags.before", n, i, o);
      var c = function(u, f, g, O) {
        var z = g + a.subParser("encodeCode")(f, i, o) + O;
        return "¨C" + (o.gHtmlSpans.push(z) - 1) + "C";
      };
      return n = a.helper.replaceRecursiveRegExp(n, c, "<code\\b[^>]*>", "</code>", "gim"), n = o.converter._dispatch("hashCodeTags.after", n, i, o), n;
    }), a.subParser("hashElement", function(n, i, o) {
      return function(c, u) {
        var f = u;
        return f = f.replace(/\n\n/g, `
`), f = f.replace(/^\n/, ""), f = f.replace(/\n+$/g, ""), f = `

¨K` + (o.gHtmlBlocks.push(f) - 1) + `K

`, f;
      };
    }), a.subParser("hashHTMLBlocks", function(n, i, o) {
      n = o.converter._dispatch("hashHTMLBlocks.before", n, i, o);
      var c = [
        "pre",
        "div",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "blockquote",
        "table",
        "dl",
        "ol",
        "ul",
        "script",
        "noscript",
        "form",
        "fieldset",
        "iframe",
        "math",
        "style",
        "section",
        "header",
        "footer",
        "nav",
        "article",
        "aside",
        "address",
        "audio",
        "canvas",
        "figure",
        "hgroup",
        "output",
        "video",
        "p"
      ], u = function(w, U, W, J) {
        var V = w;
        return W.search(/\bmarkdown\b/) !== -1 && (V = W + o.converter.makeHtml(U) + J), `

¨K` + (o.gHtmlBlocks.push(V) - 1) + `K

`;
      };
      i.backslashEscapesHTMLTags && (n = n.replace(/\\<(\/?[^>]+?)>/g, function(w, U) {
        return "&lt;" + U + "&gt;";
      }));
      for (var f = 0; f < c.length; ++f)
        for (var g, O = new RegExp("^ {0,3}(<" + c[f] + "\\b[^>]*>)", "im"), z = "<" + c[f] + "\\b[^>]*>", q = "</" + c[f] + ">"; (g = a.helper.regexIndexOf(n, O)) !== -1; ) {
          var B = a.helper.splitAtIndex(n, g), G = a.helper.replaceRecursiveRegExp(B[1], u, z, q, "im");
          if (G === B[1])
            break;
          n = B[0].concat(G);
        }
      return n = n.replace(
        /(\n {0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
        a.subParser("hashElement")(n, i, o)
      ), n = a.helper.replaceRecursiveRegExp(n, function(w) {
        return `

¨K` + (o.gHtmlBlocks.push(w) - 1) + `K

`;
      }, "^ {0,3}<!--", "-->", "gm"), n = n.replace(
        /(?:\n\n)( {0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
        a.subParser("hashElement")(n, i, o)
      ), n = o.converter._dispatch("hashHTMLBlocks.after", n, i, o), n;
    }), a.subParser("hashHTMLSpans", function(n, i, o) {
      n = o.converter._dispatch("hashHTMLSpans.before", n, i, o);
      function c(u) {
        return "¨C" + (o.gHtmlSpans.push(u) - 1) + "C";
      }
      return n = n.replace(/<[^>]+?\/>/gi, function(u) {
        return c(u);
      }), n = n.replace(/<([^>]+?)>[\s\S]*?<\/\1>/g, function(u) {
        return c(u);
      }), n = n.replace(/<([^>]+?)\s[^>]+?>[\s\S]*?<\/\1>/g, function(u) {
        return c(u);
      }), n = n.replace(/<[^>]+?>/gi, function(u) {
        return c(u);
      }), n = o.converter._dispatch("hashHTMLSpans.after", n, i, o), n;
    }), a.subParser("unhashHTMLSpans", function(n, i, o) {
      n = o.converter._dispatch("unhashHTMLSpans.before", n, i, o);
      for (var c = 0; c < o.gHtmlSpans.length; ++c) {
        for (var u = o.gHtmlSpans[c], f = 0; /¨C(\d+)C/.test(u); ) {
          var g = RegExp.$1;
          if (u = u.replace("¨C" + g + "C", o.gHtmlSpans[g]), f === 10) {
            console.error("maximum nesting of 10 spans reached!!!");
            break;
          }
          ++f;
        }
        n = n.replace("¨C" + c + "C", u);
      }
      return n = o.converter._dispatch("unhashHTMLSpans.after", n, i, o), n;
    }), a.subParser("hashPreCodeTags", function(n, i, o) {
      n = o.converter._dispatch("hashPreCodeTags.before", n, i, o);
      var c = function(u, f, g, O) {
        var z = g + a.subParser("encodeCode")(f, i, o) + O;
        return `

¨G` + (o.ghCodeBlocks.push({ text: u, codeblock: z }) - 1) + `G

`;
      };
      return n = a.helper.replaceRecursiveRegExp(n, c, "^ {0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>", "^ {0,3}</code>\\s*</pre>", "gim"), n = o.converter._dispatch("hashPreCodeTags.after", n, i, o), n;
    }), a.subParser("headers", function(n, i, o) {
      n = o.converter._dispatch("headers.before", n, i, o);
      var c = isNaN(parseInt(i.headerLevelStart)) ? 1 : parseInt(i.headerLevelStart), u = i.smoothLivePreview ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm, f = i.smoothLivePreview ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;
      n = n.replace(u, function(z, q) {
        var B = a.subParser("spanGamut")(q, i, o), G = i.noHeaderId ? "" : ' id="' + O(q) + '"', w = c, U = "<h" + w + G + ">" + B + "</h" + w + ">";
        return a.subParser("hashBlock")(U, i, o);
      }), n = n.replace(f, function(z, q) {
        var B = a.subParser("spanGamut")(q, i, o), G = i.noHeaderId ? "" : ' id="' + O(q) + '"', w = c + 1, U = "<h" + w + G + ">" + B + "</h" + w + ">";
        return a.subParser("hashBlock")(U, i, o);
      });
      var g = i.requireSpaceBeforeHeadingText ? /^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm : /^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm;
      n = n.replace(g, function(z, q, B) {
        var G = B;
        i.customizedHeaderId && (G = B.replace(/\s?\{([^{]+?)}\s*$/, ""));
        var w = a.subParser("spanGamut")(G, i, o), U = i.noHeaderId ? "" : ' id="' + O(B) + '"', W = c - 1 + q.length, J = "<h" + W + U + ">" + w + "</h" + W + ">";
        return a.subParser("hashBlock")(J, i, o);
      });
      function O(z) {
        var q, B;
        if (i.customizedHeaderId) {
          var G = z.match(/\{([^{]+?)}\s*$/);
          G && G[1] && (z = G[1]);
        }
        return q = z, a.helper.isString(i.prefixHeaderId) ? B = i.prefixHeaderId : i.prefixHeaderId === !0 ? B = "section-" : B = "", i.rawPrefixHeaderId || (q = B + q), i.ghCompatibleHeaderId ? q = q.replace(/ /g, "-").replace(/&amp;/g, "").replace(/¨T/g, "").replace(/¨D/g, "").replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g, "").toLowerCase() : i.rawHeaderId ? q = q.replace(/ /g, "-").replace(/&amp;/g, "&").replace(/¨T/g, "¨").replace(/¨D/g, "$").replace(/["']/g, "-").toLowerCase() : q = q.replace(/[^\w]/g, "").toLowerCase(), i.rawPrefixHeaderId && (q = B + q), o.hashLinkCounts[q] ? q = q + "-" + o.hashLinkCounts[q]++ : o.hashLinkCounts[q] = 1, q;
      }
      return n = o.converter._dispatch("headers.after", n, i, o), n;
    }), a.subParser("horizontalRule", function(n, i, o) {
      n = o.converter._dispatch("horizontalRule.before", n, i, o);
      var c = a.subParser("hashBlock")("<hr />", i, o);
      return n = n.replace(/^ {0,2}( ?-){3,}[ \t]*$/gm, c), n = n.replace(/^ {0,2}( ?\*){3,}[ \t]*$/gm, c), n = n.replace(/^ {0,2}( ?_){3,}[ \t]*$/gm, c), n = o.converter._dispatch("horizontalRule.after", n, i, o), n;
    }), a.subParser("images", function(n, i, o) {
      n = o.converter._dispatch("images.before", n, i, o);
      var c = /!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, u = /!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)/g, f = /!\[([^\]]*?)][ \t]*()\([ \t]?<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, g = /!\[([^\]]*?)] ?(?:\n *)?\[([\s\S]*?)]()()()()()/g, O = /!\[([^\[\]]+)]()()()()()/g;
      function z(B, G, w, U, W, J, V, P) {
        return U = U.replace(/\s/g, ""), q(B, G, w, U, W, J, V, P);
      }
      function q(B, G, w, U, W, J, V, P) {
        var F = o.gUrls, L = o.gTitles, h = o.gDimensions;
        if (w = w.toLowerCase(), P || (P = ""), B.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          U = "";
        else if (U === "" || U === null)
          if ((w === "" || w === null) && (w = G.toLowerCase().replace(/ ?\n/g, " ")), U = "#" + w, !a.helper.isUndefined(F[w]))
            U = F[w], a.helper.isUndefined(L[w]) || (P = L[w]), a.helper.isUndefined(h[w]) || (W = h[w].width, J = h[w].height);
          else
            return B;
        G = G.replace(/"/g, "&quot;").replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback), U = U.replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback);
        var $ = '<img src="' + U + '" alt="' + G + '"';
        return P && a.helper.isString(P) && (P = P.replace(/"/g, "&quot;").replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback), $ += ' title="' + P + '"'), W && J && (W = W === "*" ? "auto" : W, J = J === "*" ? "auto" : J, $ += ' width="' + W + '"', $ += ' height="' + J + '"'), $ += " />", $;
      }
      return n = n.replace(g, q), n = n.replace(f, z), n = n.replace(u, q), n = n.replace(c, q), n = n.replace(O, q), n = o.converter._dispatch("images.after", n, i, o), n;
    }), a.subParser("italicsAndBold", function(n, i, o) {
      n = o.converter._dispatch("italicsAndBold.before", n, i, o);
      function c(u, f, g) {
        return f + u + g;
      }
      return i.literalMidWordUnderscores ? (n = n.replace(/\b___(\S[\s\S]*?)___\b/g, function(u, f) {
        return c(f, "<strong><em>", "</em></strong>");
      }), n = n.replace(/\b__(\S[\s\S]*?)__\b/g, function(u, f) {
        return c(f, "<strong>", "</strong>");
      }), n = n.replace(/\b_(\S[\s\S]*?)_\b/g, function(u, f) {
        return c(f, "<em>", "</em>");
      })) : (n = n.replace(/___(\S[\s\S]*?)___/g, function(u, f) {
        return /\S$/.test(f) ? c(f, "<strong><em>", "</em></strong>") : u;
      }), n = n.replace(/__(\S[\s\S]*?)__/g, function(u, f) {
        return /\S$/.test(f) ? c(f, "<strong>", "</strong>") : u;
      }), n = n.replace(/_([^\s_][\s\S]*?)_/g, function(u, f) {
        return /\S$/.test(f) ? c(f, "<em>", "</em>") : u;
      })), i.literalMidWordAsterisks ? (n = n.replace(/([^*]|^)\B\*\*\*(\S[\s\S]*?)\*\*\*\B(?!\*)/g, function(u, f, g) {
        return c(g, f + "<strong><em>", "</em></strong>");
      }), n = n.replace(/([^*]|^)\B\*\*(\S[\s\S]*?)\*\*\B(?!\*)/g, function(u, f, g) {
        return c(g, f + "<strong>", "</strong>");
      }), n = n.replace(/([^*]|^)\B\*(\S[\s\S]*?)\*\B(?!\*)/g, function(u, f, g) {
        return c(g, f + "<em>", "</em>");
      })) : (n = n.replace(/\*\*\*(\S[\s\S]*?)\*\*\*/g, function(u, f) {
        return /\S$/.test(f) ? c(f, "<strong><em>", "</em></strong>") : u;
      }), n = n.replace(/\*\*(\S[\s\S]*?)\*\*/g, function(u, f) {
        return /\S$/.test(f) ? c(f, "<strong>", "</strong>") : u;
      }), n = n.replace(/\*([^\s*][\s\S]*?)\*/g, function(u, f) {
        return /\S$/.test(f) ? c(f, "<em>", "</em>") : u;
      })), n = o.converter._dispatch("italicsAndBold.after", n, i, o), n;
    }), a.subParser("lists", function(n, i, o) {
      function c(g, O) {
        o.gListLevel++, g = g.replace(/\n{2,}$/, `
`), g += "¨0";
        var z = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0| {0,3}([*+-]|\d+[.])[ \t]+))/gm, q = /\n[ \t]*\n(?!¨0)/.test(g);
        return i.disableForced4SpacesIndentedSublists && (z = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0|\2([*+-]|\d+[.])[ \t]+))/gm), g = g.replace(z, function(B, G, w, U, W, J, V) {
          V = V && V.trim() !== "";
          var P = a.subParser("outdent")(W, i, o), F = "";
          return J && i.tasklists && (F = ' class="task-list-item" style="list-style-type: none;"', P = P.replace(/^[ \t]*\[(x|X| )?]/m, function() {
            var L = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
            return V && (L += " checked"), L += ">", L;
          })), P = P.replace(/^([-*+]|\d\.)[ \t]+[\S\n ]*/g, function(L) {
            return "¨A" + L;
          }), G || P.search(/\n{2,}/) > -1 ? (P = a.subParser("githubCodeBlocks")(P, i, o), P = a.subParser("blockGamut")(P, i, o)) : (P = a.subParser("lists")(P, i, o), P = P.replace(/\n$/, ""), P = a.subParser("hashHTMLBlocks")(P, i, o), P = P.replace(/\n\n+/g, `

`), q ? P = a.subParser("paragraphs")(P, i, o) : P = a.subParser("spanGamut")(P, i, o)), P = P.replace("¨A", ""), P = "<li" + F + ">" + P + `</li>
`, P;
        }), g = g.replace(/¨0/g, ""), o.gListLevel--, O && (g = g.replace(/\s+$/, "")), g;
      }
      function u(g, O) {
        if (O === "ol") {
          var z = g.match(/^ *(\d+)\./);
          if (z && z[1] !== "1")
            return ' start="' + z[1] + '"';
        }
        return "";
      }
      function f(g, O, z) {
        var q = i.disableForced4SpacesIndentedSublists ? /^ ?\d+\.[ \t]/gm : /^ {0,3}\d+\.[ \t]/gm, B = i.disableForced4SpacesIndentedSublists ? /^ ?[*+-][ \t]/gm : /^ {0,3}[*+-][ \t]/gm, G = O === "ul" ? q : B, w = "";
        if (g.search(G) !== -1)
          (function W(J) {
            var V = J.search(G), P = u(g, O);
            V !== -1 ? (w += `

<` + O + P + `>
` + c(J.slice(0, V), !!z) + "</" + O + `>
`, O = O === "ul" ? "ol" : "ul", G = O === "ul" ? q : B, W(J.slice(V))) : w += `

<` + O + P + `>
` + c(J, !!z) + "</" + O + `>
`;
          })(g);
        else {
          var U = u(g, O);
          w = `

<` + O + U + `>
` + c(g, !!z) + "</" + O + `>
`;
        }
        return w;
      }
      return n = o.converter._dispatch("lists.before", n, i, o), n += "¨0", o.gListLevel ? n = n.replace(
        /^(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(g, O, z) {
          var q = z.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return f(O, q, !0);
        }
      ) : n = n.replace(
        /(\n\n|^\n?)(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(g, O, z, q) {
          var B = q.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return f(z, B, !1);
        }
      ), n = n.replace(/¨0/, ""), n = o.converter._dispatch("lists.after", n, i, o), n;
    }), a.subParser("metadata", function(n, i, o) {
      if (!i.metadata)
        return n;
      n = o.converter._dispatch("metadata.before", n, i, o);
      function c(u) {
        o.metadata.raw = u, u = u.replace(/&/g, "&amp;").replace(/"/g, "&quot;"), u = u.replace(/\n {4}/g, " "), u.replace(/^([\S ]+): +([\s\S]+?)$/gm, function(f, g, O) {
          return o.metadata.parsed[g] = O, "";
        });
      }
      return n = n.replace(/^\s*«««+(\S*?)\n([\s\S]+?)\n»»»+\n/, function(u, f, g) {
        return c(g), "¨M";
      }), n = n.replace(/^\s*---+(\S*?)\n([\s\S]+?)\n---+\n/, function(u, f, g) {
        return f && (o.metadata.format = f), c(g), "¨M";
      }), n = n.replace(/¨M/g, ""), n = o.converter._dispatch("metadata.after", n, i, o), n;
    }), a.subParser("outdent", function(n, i, o) {
      return n = o.converter._dispatch("outdent.before", n, i, o), n = n.replace(/^(\t|[ ]{1,4})/gm, "¨0"), n = n.replace(/¨0/g, ""), n = o.converter._dispatch("outdent.after", n, i, o), n;
    }), a.subParser("paragraphs", function(n, i, o) {
      n = o.converter._dispatch("paragraphs.before", n, i, o), n = n.replace(/^\n+/g, ""), n = n.replace(/\n+$/g, "");
      for (var c = n.split(/\n{2,}/g), u = [], f = c.length, g = 0; g < f; g++) {
        var O = c[g];
        O.search(/¨(K|G)(\d+)\1/g) >= 0 ? u.push(O) : O.search(/\S/) >= 0 && (O = a.subParser("spanGamut")(O, i, o), O = O.replace(/^([ \t]*)/g, "<p>"), O += "</p>", u.push(O));
      }
      for (f = u.length, g = 0; g < f; g++) {
        for (var z = "", q = u[g], B = !1; /¨(K|G)(\d+)\1/.test(q); ) {
          var G = RegExp.$1, w = RegExp.$2;
          G === "K" ? z = o.gHtmlBlocks[w] : B ? z = a.subParser("encodeCode")(o.ghCodeBlocks[w].text, i, o) : z = o.ghCodeBlocks[w].codeblock, z = z.replace(/\$/g, "$$$$"), q = q.replace(/(\n\n)?¨(K|G)\d+\2(\n\n)?/, z), /^<pre\b[^>]*>\s*<code\b[^>]*>/.test(q) && (B = !0);
        }
        u[g] = q;
      }
      return n = u.join(`
`), n = n.replace(/^\n+/g, ""), n = n.replace(/\n+$/g, ""), o.converter._dispatch("paragraphs.after", n, i, o);
    }), a.subParser("runExtension", function(n, i, o, c) {
      if (n.filter)
        i = n.filter(i, c.converter, o);
      else if (n.regex) {
        var u = n.regex;
        u instanceof RegExp || (u = new RegExp(u, "g")), i = i.replace(u, n.replace);
      }
      return i;
    }), a.subParser("spanGamut", function(n, i, o) {
      return n = o.converter._dispatch("spanGamut.before", n, i, o), n = a.subParser("codeSpans")(n, i, o), n = a.subParser("escapeSpecialCharsWithinTagAttributes")(n, i, o), n = a.subParser("encodeBackslashEscapes")(n, i, o), n = a.subParser("images")(n, i, o), n = a.subParser("anchors")(n, i, o), n = a.subParser("autoLinks")(n, i, o), n = a.subParser("simplifiedAutoLinks")(n, i, o), n = a.subParser("emoji")(n, i, o), n = a.subParser("underline")(n, i, o), n = a.subParser("italicsAndBold")(n, i, o), n = a.subParser("strikethrough")(n, i, o), n = a.subParser("ellipsis")(n, i, o), n = a.subParser("hashHTMLSpans")(n, i, o), n = a.subParser("encodeAmpsAndAngles")(n, i, o), i.simpleLineBreaks ? /\n\n¨K/.test(n) || (n = n.replace(/\n+/g, `<br />
`)) : n = n.replace(/  +\n/g, `<br />
`), n = o.converter._dispatch("spanGamut.after", n, i, o), n;
    }), a.subParser("strikethrough", function(n, i, o) {
      function c(u) {
        return i.simplifiedAutoLink && (u = a.subParser("simplifiedAutoLinks")(u, i, o)), "<del>" + u + "</del>";
      }
      return i.strikethrough && (n = o.converter._dispatch("strikethrough.before", n, i, o), n = n.replace(/(?:~){2}([\s\S]+?)(?:~){2}/g, function(u, f) {
        return c(f);
      }), n = o.converter._dispatch("strikethrough.after", n, i, o)), n;
    }), a.subParser("stripLinkDefinitions", function(n, i, o) {
      var c = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?([^>\s]+)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=¨0))/gm, u = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n\n|(?=¨0)|(?=\n\[))/gm;
      n += "¨0";
      var f = function(g, O, z, q, B, G, w) {
        return O = O.toLowerCase(), n.toLowerCase().split(O).length - 1 < 2 ? g : (z.match(/^data:.+?\/.+?;base64,/) ? o.gUrls[O] = z.replace(/\s/g, "") : o.gUrls[O] = a.subParser("encodeAmpsAndAngles")(z, i, o), G ? G + w : (w && (o.gTitles[O] = w.replace(/"|'/g, "&quot;")), i.parseImgDimensions && q && B && (o.gDimensions[O] = {
          width: q,
          height: B
        }), ""));
      };
      return n = n.replace(u, f), n = n.replace(c, f), n = n.replace(/¨0/, ""), n;
    }), a.subParser("tables", function(n, i, o) {
      if (!i.tables)
        return n;
      var c = /^ {0,3}\|?.+\|.+\n {0,3}\|?[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:[-=]){2,}[\s\S]+?(?:\n\n|¨0)/gm, u = /^ {0,3}\|.+\|[ \t]*\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n( {0,3}\|.+\|[ \t]*\n)*(?:\n|¨0)/gm;
      function f(B) {
        return /^:[ \t]*--*$/.test(B) ? ' style="text-align:left;"' : /^--*[ \t]*:[ \t]*$/.test(B) ? ' style="text-align:right;"' : /^:[ \t]*--*[ \t]*:$/.test(B) ? ' style="text-align:center;"' : "";
      }
      function g(B, G) {
        var w = "";
        return B = B.trim(), (i.tablesHeaderId || i.tableHeaderId) && (w = ' id="' + B.replace(/ /g, "_").toLowerCase() + '"'), B = a.subParser("spanGamut")(B, i, o), "<th" + w + G + ">" + B + `</th>
`;
      }
      function O(B, G) {
        var w = a.subParser("spanGamut")(B, i, o);
        return "<td" + G + ">" + w + `</td>
`;
      }
      function z(B, G) {
        for (var w = `<table>
<thead>
<tr>
`, U = B.length, W = 0; W < U; ++W)
          w += B[W];
        for (w += `</tr>
</thead>
<tbody>
`, W = 0; W < G.length; ++W) {
          w += `<tr>
`;
          for (var J = 0; J < U; ++J)
            w += G[W][J];
          w += `</tr>
`;
        }
        return w += `</tbody>
</table>
`, w;
      }
      function q(B) {
        var G, w = B.split(`
`);
        for (G = 0; G < w.length; ++G)
          /^ {0,3}\|/.test(w[G]) && (w[G] = w[G].replace(/^ {0,3}\|/, "")), /\|[ \t]*$/.test(w[G]) && (w[G] = w[G].replace(/\|[ \t]*$/, "")), w[G] = a.subParser("codeSpans")(w[G], i, o);
        var U = w[0].split("|").map(function($) {
          return $.trim();
        }), W = w[1].split("|").map(function($) {
          return $.trim();
        }), J = [], V = [], P = [], F = [];
        for (w.shift(), w.shift(), G = 0; G < w.length; ++G)
          w[G].trim() !== "" && J.push(
            w[G].split("|").map(function($) {
              return $.trim();
            })
          );
        if (U.length < W.length)
          return B;
        for (G = 0; G < W.length; ++G)
          P.push(f(W[G]));
        for (G = 0; G < U.length; ++G)
          a.helper.isUndefined(P[G]) && (P[G] = ""), V.push(g(U[G], P[G]));
        for (G = 0; G < J.length; ++G) {
          for (var L = [], h = 0; h < V.length; ++h)
            a.helper.isUndefined(J[G][h]), L.push(O(J[G][h], P[h]));
          F.push(L);
        }
        return z(V, F);
      }
      return n = o.converter._dispatch("tables.before", n, i, o), n = n.replace(/\\(\|)/g, a.helper.escapeCharactersCallback), n = n.replace(c, q), n = n.replace(u, q), n = o.converter._dispatch("tables.after", n, i, o), n;
    }), a.subParser("underline", function(n, i, o) {
      return i.underline && (n = o.converter._dispatch("underline.before", n, i, o), i.literalMidWordUnderscores ? (n = n.replace(/\b___(\S[\s\S]*?)___\b/g, function(c, u) {
        return "<u>" + u + "</u>";
      }), n = n.replace(/\b__(\S[\s\S]*?)__\b/g, function(c, u) {
        return "<u>" + u + "</u>";
      })) : (n = n.replace(/___(\S[\s\S]*?)___/g, function(c, u) {
        return /\S$/.test(u) ? "<u>" + u + "</u>" : c;
      }), n = n.replace(/__(\S[\s\S]*?)__/g, function(c, u) {
        return /\S$/.test(u) ? "<u>" + u + "</u>" : c;
      })), n = n.replace(/(_)/g, a.helper.escapeCharactersCallback), n = o.converter._dispatch("underline.after", n, i, o)), n;
    }), a.subParser("unescapeSpecialChars", function(n, i, o) {
      return n = o.converter._dispatch("unescapeSpecialChars.before", n, i, o), n = n.replace(/¨E(\d+)E/g, function(c, u) {
        var f = parseInt(u);
        return String.fromCharCode(f);
      }), n = o.converter._dispatch("unescapeSpecialChars.after", n, i, o), n;
    }), a.subParser("makeMarkdown.blockquote", function(n, i) {
      var o = "";
      if (n.hasChildNodes())
        for (var c = n.childNodes, u = c.length, f = 0; f < u; ++f) {
          var g = a.subParser("makeMarkdown.node")(c[f], i);
          g !== "" && (o += g);
        }
      return o = o.trim(), o = "> " + o.split(`
`).join(`
> `), o;
    }), a.subParser("makeMarkdown.codeBlock", function(n, i) {
      var o = n.getAttribute("language"), c = n.getAttribute("precodenum");
      return "```" + o + `
` + i.preList[c] + "\n```";
    }), a.subParser("makeMarkdown.codeSpan", function(n) {
      return "`" + n.innerHTML + "`";
    }), a.subParser("makeMarkdown.emphasis", function(n, i) {
      var o = "";
      if (n.hasChildNodes()) {
        o += "*";
        for (var c = n.childNodes, u = c.length, f = 0; f < u; ++f)
          o += a.subParser("makeMarkdown.node")(c[f], i);
        o += "*";
      }
      return o;
    }), a.subParser("makeMarkdown.header", function(n, i, o) {
      var c = new Array(o + 1).join("#"), u = "";
      if (n.hasChildNodes()) {
        u = c + " ";
        for (var f = n.childNodes, g = f.length, O = 0; O < g; ++O)
          u += a.subParser("makeMarkdown.node")(f[O], i);
      }
      return u;
    }), a.subParser("makeMarkdown.hr", function() {
      return "---";
    }), a.subParser("makeMarkdown.image", function(n) {
      var i = "";
      return n.hasAttribute("src") && (i += "![" + n.getAttribute("alt") + "](", i += "<" + n.getAttribute("src") + ">", n.hasAttribute("width") && n.hasAttribute("height") && (i += " =" + n.getAttribute("width") + "x" + n.getAttribute("height")), n.hasAttribute("title") && (i += ' "' + n.getAttribute("title") + '"'), i += ")"), i;
    }), a.subParser("makeMarkdown.links", function(n, i) {
      var o = "";
      if (n.hasChildNodes() && n.hasAttribute("href")) {
        var c = n.childNodes, u = c.length;
        o = "[";
        for (var f = 0; f < u; ++f)
          o += a.subParser("makeMarkdown.node")(c[f], i);
        o += "](", o += "<" + n.getAttribute("href") + ">", n.hasAttribute("title") && (o += ' "' + n.getAttribute("title") + '"'), o += ")";
      }
      return o;
    }), a.subParser("makeMarkdown.list", function(n, i, o) {
      var c = "";
      if (!n.hasChildNodes())
        return "";
      for (var u = n.childNodes, f = u.length, g = n.getAttribute("start") || 1, O = 0; O < f; ++O)
        if (!(typeof u[O].tagName > "u" || u[O].tagName.toLowerCase() !== "li")) {
          var z = "";
          o === "ol" ? z = g.toString() + ". " : z = "- ", c += z + a.subParser("makeMarkdown.listItem")(u[O], i), ++g;
        }
      return c += `
<!-- -->
`, c.trim();
    }), a.subParser("makeMarkdown.listItem", function(n, i) {
      for (var o = "", c = n.childNodes, u = c.length, f = 0; f < u; ++f)
        o += a.subParser("makeMarkdown.node")(c[f], i);
      return /\n$/.test(o) ? o = o.split(`
`).join(`
    `).replace(/^ {4}$/gm, "").replace(/\n\n+/g, `

`) : o += `
`, o;
    }), a.subParser("makeMarkdown.node", function(n, i, o) {
      o = o || !1;
      var c = "";
      if (n.nodeType === 3)
        return a.subParser("makeMarkdown.txt")(n, i);
      if (n.nodeType === 8)
        return "<!--" + n.data + `-->

`;
      if (n.nodeType !== 1)
        return "";
      var u = n.tagName.toLowerCase();
      switch (u) {
        case "h1":
          o || (c = a.subParser("makeMarkdown.header")(n, i, 1) + `

`);
          break;
        case "h2":
          o || (c = a.subParser("makeMarkdown.header")(n, i, 2) + `

`);
          break;
        case "h3":
          o || (c = a.subParser("makeMarkdown.header")(n, i, 3) + `

`);
          break;
        case "h4":
          o || (c = a.subParser("makeMarkdown.header")(n, i, 4) + `

`);
          break;
        case "h5":
          o || (c = a.subParser("makeMarkdown.header")(n, i, 5) + `

`);
          break;
        case "h6":
          o || (c = a.subParser("makeMarkdown.header")(n, i, 6) + `

`);
          break;
        case "p":
          o || (c = a.subParser("makeMarkdown.paragraph")(n, i) + `

`);
          break;
        case "blockquote":
          o || (c = a.subParser("makeMarkdown.blockquote")(n, i) + `

`);
          break;
        case "hr":
          o || (c = a.subParser("makeMarkdown.hr")(n, i) + `

`);
          break;
        case "ol":
          o || (c = a.subParser("makeMarkdown.list")(n, i, "ol") + `

`);
          break;
        case "ul":
          o || (c = a.subParser("makeMarkdown.list")(n, i, "ul") + `

`);
          break;
        case "precode":
          o || (c = a.subParser("makeMarkdown.codeBlock")(n, i) + `

`);
          break;
        case "pre":
          o || (c = a.subParser("makeMarkdown.pre")(n, i) + `

`);
          break;
        case "table":
          o || (c = a.subParser("makeMarkdown.table")(n, i) + `

`);
          break;
        case "code":
          c = a.subParser("makeMarkdown.codeSpan")(n, i);
          break;
        case "em":
        case "i":
          c = a.subParser("makeMarkdown.emphasis")(n, i);
          break;
        case "strong":
        case "b":
          c = a.subParser("makeMarkdown.strong")(n, i);
          break;
        case "del":
          c = a.subParser("makeMarkdown.strikethrough")(n, i);
          break;
        case "a":
          c = a.subParser("makeMarkdown.links")(n, i);
          break;
        case "img":
          c = a.subParser("makeMarkdown.image")(n, i);
          break;
        default:
          c = n.outerHTML + `

`;
      }
      return c;
    }), a.subParser("makeMarkdown.paragraph", function(n, i) {
      var o = "";
      if (n.hasChildNodes())
        for (var c = n.childNodes, u = c.length, f = 0; f < u; ++f)
          o += a.subParser("makeMarkdown.node")(c[f], i);
      return o = o.trim(), o;
    }), a.subParser("makeMarkdown.pre", function(n, i) {
      var o = n.getAttribute("prenum");
      return "<pre>" + i.preList[o] + "</pre>";
    }), a.subParser("makeMarkdown.strikethrough", function(n, i) {
      var o = "";
      if (n.hasChildNodes()) {
        o += "~~";
        for (var c = n.childNodes, u = c.length, f = 0; f < u; ++f)
          o += a.subParser("makeMarkdown.node")(c[f], i);
        o += "~~";
      }
      return o;
    }), a.subParser("makeMarkdown.strong", function(n, i) {
      var o = "";
      if (n.hasChildNodes()) {
        o += "**";
        for (var c = n.childNodes, u = c.length, f = 0; f < u; ++f)
          o += a.subParser("makeMarkdown.node")(c[f], i);
        o += "**";
      }
      return o;
    }), a.subParser("makeMarkdown.table", function(n, i) {
      var o = "", c = [[], []], u = n.querySelectorAll("thead>tr>th"), f = n.querySelectorAll("tbody>tr"), g, O;
      for (g = 0; g < u.length; ++g) {
        var z = a.subParser("makeMarkdown.tableCell")(u[g], i), q = "---";
        if (u[g].hasAttribute("style")) {
          var B = u[g].getAttribute("style").toLowerCase().replace(/\s/g, "");
          switch (B) {
            case "text-align:left;":
              q = ":---";
              break;
            case "text-align:right;":
              q = "---:";
              break;
            case "text-align:center;":
              q = ":---:";
              break;
          }
        }
        c[0][g] = z.trim(), c[1][g] = q;
      }
      for (g = 0; g < f.length; ++g) {
        var G = c.push([]) - 1, w = f[g].getElementsByTagName("td");
        for (O = 0; O < u.length; ++O) {
          var U = " ";
          typeof w[O] < "u" && (U = a.subParser("makeMarkdown.tableCell")(w[O], i)), c[G].push(U);
        }
      }
      var W = 3;
      for (g = 0; g < c.length; ++g)
        for (O = 0; O < c[g].length; ++O) {
          var J = c[g][O].length;
          J > W && (W = J);
        }
      for (g = 0; g < c.length; ++g) {
        for (O = 0; O < c[g].length; ++O)
          g === 1 ? c[g][O].slice(-1) === ":" ? c[g][O] = a.helper.padEnd(c[g][O].slice(-1), W - 1, "-") + ":" : c[g][O] = a.helper.padEnd(c[g][O], W, "-") : c[g][O] = a.helper.padEnd(c[g][O], W);
        o += "| " + c[g].join(" | ") + ` |
`;
      }
      return o.trim();
    }), a.subParser("makeMarkdown.tableCell", function(n, i) {
      var o = "";
      if (!n.hasChildNodes())
        return "";
      for (var c = n.childNodes, u = c.length, f = 0; f < u; ++f)
        o += a.subParser("makeMarkdown.node")(c[f], i, !0);
      return o.trim();
    }), a.subParser("makeMarkdown.txt", function(n) {
      var i = n.nodeValue;
      return i = i.replace(/ +/g, " "), i = i.replace(/¨NBSP;/g, " "), i = a.helper.unescapeHTMLEntities(i), i = i.replace(/([*_~|`])/g, "\\$1"), i = i.replace(/^(\s*)>/g, "\\$1>"), i = i.replace(/^#/gm, "\\#"), i = i.replace(/^(\s*)([-=]{3,})(\s*)$/, "$1\\$2$3"), i = i.replace(/^( {0,3}\d+)\./gm, "$1\\."), i = i.replace(/^( {0,3})([+-])/gm, "$1\\$2"), i = i.replace(/]([\s]*)\(/g, "\\]$1\\("), i = i.replace(/^ {0,3}\[([\S \t]*?)]:/gm, "\\[$1]:"), i;
    });
    var R = this;
    e.exports ? e.exports = a : R.showdown = a;
  }).call(no);
})(Zo);
var qu = Zo.exports;
const Jn = /* @__PURE__ */ oo(qu);
class Zn {
  constructor() {
    Te(this, "logger"), Te(this, "converter"), this.logger = nn.zhiLog("showdown-adaptor"), this.converter = new Jn.Converter();
  }
  isAvailable() {
    return typeof Jn < "u";
  }
  renderMarkdownStr(t) {
    if (!this.isAvailable())
      throw new Error("Showdown is not available");
    return this.logger.info("Showdown is rendering md to HTML..."), Promise.resolve(this.converter.makeHtml(t));
  }
}
class Yo {
  constructor() {
    Te(this, "logger"), Te(this, "mdAdaptor", new Zn()), this.logger = nn.zhiLog("markdown-util");
  }
  /**
   * 获取当前 MD 解析器名称
   */
  getCurrentAdaptorName() {
    return this.mdAdaptor instanceof Wn ? "Lute" : this.mdAdaptor instanceof Zn ? "Showdown" : "None";
  }
  /**
   * 渲染Markdown
   *
   * @param md - Markdown文本
   */
  async renderHTML(t) {
    const r = new Wn();
    return this.logger.debug("Lute status =>", r.isAvailable()), r.isAvailable() && (this.mdAdaptor = r), this.logger.info(`Using ${this.getCurrentAdaptorName()} as markdown renderer`), await this.mdAdaptor.renderMarkdownStr(t);
  }
}
class Uu {
  constructor() {
    Te(this, "mdUtil"), this.mdUtil = new Yo();
  }
  /**
   * 移除标题数字
   *
   * @param str - 字符串
   */
  removeTitleNumber(t) {
    let r = t;
    const a = /([0-9]*)\./;
    return r = r.replace(a, ""), r;
  }
  /**
   * 删除挂件的HTML
   *
   * @param str - 原字符
   */
  removeWidgetTag(t) {
    let r = t.toString();
    const a = /<iframe.*src="\/widgets\/publisher.*<\/iframe>/g;
    r = r.replace(a, "");
    const s = /<iframe.*src="\/widgets\/sy-post-publisher.*<\/iframe>/g;
    r = r.replace(s, "");
    const l = /<iframe.*\/widgets\/Note*\sAttrs.*\/iframe>/g;
    return r = r.replace(l, ""), r;
  }
  /**
   * 删除Markdown文本的挂件的HTML
   *
   * @param str - 原字符
   */
  removeMdWidgetTag(t) {
    let r = t.toString();
    return r = this.removeWidgetTag(r), r;
  }
  /**
   * 去除html标签，残缺不全也可以
   *
   * @param str - 字符串
   */
  filterHtml(t) {
    t = t.replace(/<style((.|\n|\r)*?)<\/style>/g, ""), t = t.replace(/<script((.|\n|\r)*?)<\/script>/g, ""), t = t.replace(/<[^>]*>/g, ""), t = t.replace(/&.*;/g, ""), t = t.replace(/(^\s*)|(\s*$)/g, ""), t = t.replace(/</g, "").replace(/>/g, ""), t = t.replace(/"/g, "").replace(/'/g, ""), t = t.replace(/\*/g, ""), t = t.replace(/\$/g, ""), t = t.replace(/\./g, ""), t = t.replace(/\+/g, ""), t = t.replace(/\s+/g, ""), t = t.replace(/[:|：]/g, "_"), t = t.replace(/[;|；]/g, "_"), t = t.replace(/\^/g, "_"), t = t.replace(/!/g, "_"), t = t.replace(/@/g, "at_");
    const r = ["\\d*/\\d/\\d*", "[、|\\\\]", "[，|,]", "\\d", "/", "-"];
    for (let a = 0; a < r.length; a++) {
      const s = new RegExp(r[a], "g");
      t = t.replace(s, "");
    }
    return t = t.toLowerCase(), t;
  }
  /**
   * 截取指定长度html
   *
   * @param html - html
   * @param length - 长度
   * @param ignore - 不要结尾省略号
   */
  parseHtml(t, r, a) {
    const s = this.filterHtml(t);
    return s.length < r ? s : a === !0 ? s.substring(0, r) : s.substring(0, r) + "...";
  }
  /**
   * 将Markdown转换为HTML
   *
   * @param md - Markdown
   */
  async mdToHtml(t) {
    const r = await this.mdUtil.renderHTML(t);
    return this.removeWidgetTag(r);
  }
  /**
   * 将Markdown转换为纯文本
   *
   * @param md - Markdown
   */
  async mdToPlainText(t) {
    const r = await this.mdToHtml(t);
    return this.filterHtml(r);
  }
  /**
   * 移除H1标签
   *
   * @param html - html
   */
  removeH1(t) {
    let r = t;
    const a = /<h1.*\/h1>/g;
    return r = r.replace(a, ""), r;
  }
  /**
   * 移除Markdown里面的H1标签
   *
   * JavaScript 正则表达式可以用来删除所有 Markdown 中的 h1 标签。下面是一个示例代码：
   *
   * const str = "# This is an H1\n## This is an H2\n### This is an H3";
   *
   * const regex = /^# .*$/gm;
   * const result = str.replace(regex, '');
   *
   * console.log(result);
   * 在这个例子中，我们使用正则表达式 /^# .*$/gm 来匹配所有的 h1 标签。
   * 在 JavaScript 中，^ 匹配行首，# 匹配 # 字符，.* 匹配任意字符，$ 匹配行尾，m 标记表示多行模式。
   */
  removeMdH1(t) {
    let r = t;
    const a = /^# .*$/gm;
    return r = r.replace(a, ""), r;
  }
}
class Gu {
  /**
   * 检测是否是空对象
   *
   * @param obj - 对象
   */
  isEmptyObject(t) {
    return t ? Object.getPrototypeOf(t) === Object.prototype && Object.getOwnPropertyNames(t).length === 0 && Object.getOwnPropertySymbols(t).length === 0 : !0;
  }
}
class Hu {
  constructor() {
    Te(this, "dateUtil"), Te(this, "strUtil"), Te(this, "versionUtil"), Te(this, "htmlUtil"), Te(this, "markdownUtil"), Te(this, "jsonUtil"), Te(this, "objectUtil"), this.dateUtil = new yu(), this.strUtil = new _u(), this.versionUtil = new Eu(), this.htmlUtil = new Uu(), this.markdownUtil = new Yo(), this.jsonUtil = new bu(), this.objectUtil = new Gu();
  }
}
const Ku = Hu;
var Wu = Object.defineProperty, Ju = (e, t, r) => t in e ? Wu(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, sr = (e, t, r) => (Ju(e, typeof t != "symbol" ? t + "" : t, r), r);
class ir {
}
sr(ir, "NODE_ENV_KEY", "NODE_ENV"), /**
* 开发环境
*/
sr(ir, "NODE_ENV_DEVELOPMENT", "development"), /**
* 生产环境
*/
sr(ir, "NODE_ENV_PRODUCTION", "production"), /**
* 测试环境
*/
sr(ir, "NODE_ENV_TEST", "test"), /**
* 是否处于调试模式
*/
sr(ir, "VITE_DEBUG_MODE_KEY", "VITE_DEBUG_MODE");
class Zu {
}
oe(Zu, "DEFAULT_BLOG_TYPE_KEY", "VITE_DEFAULT_TYPE");
class Yu extends ks {
}
class Yn extends vs {
  constructor(r, a) {
    super();
    /**
     * 思源笔记伺服地址
     */
    $e(this, "apiUrl");
    /**
     * 思源笔记 API token
     */
    $e(this, "password");
    /**
     * 思源笔记操作提示
     *
     * @protected
     */
    $e(this, "placeholder");
    /**
     * 是否修复标题
     *
     * @protected
     */
    $e(this, "fixTitle");
    this.apiUrl = r ?? "http://127.0.0.1:6806", this.passwordType = ao.PasswordType_Token, this.password = a ?? "", this.placeholder = new Yu(), this.fixTitle = !0;
  }
}
var Qu = Object.defineProperty, Xu = (e, t, r) => t in e ? Qu(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, Gt = (e, t, r) => (Xu(e, typeof t != "symbol" ? t + "" : t, r), r);
class Kr {
}
Gt(Kr, "LOG_LEVEL_KEY", "VITE_LOG_LEVEL"), Gt(Kr, "LOG_PREFIX_KEY", "VITE_LOG_PREFIX");
var et = /* @__PURE__ */ ((e) => (e.LOG_LEVEL_TRACE = "TRACE", e.LOG_LEVEL_DEBUG = "DEBUG", e.LOG_LEVEL_INFO = "INFO", e.LOG_LEVEL_WARN = "WARN", e.LOG_LEVEL_ERROR = "ERROR", e))(et || {}), Qo = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function on(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Xo = { exports: {} };
(function(e) {
  (function(t, r) {
    e.exports ? e.exports = r() : t.log = r();
  })(Qo, function() {
    var t = function() {
    }, r = "undefined", a = typeof window !== r && typeof window.navigator !== r && /Trident\/|MSIE /.test(window.navigator.userAgent), s = [
      "trace",
      "debug",
      "info",
      "warn",
      "error"
    ];
    function l(C, x) {
      var v = C[x];
      if (typeof v.bind == "function")
        return v.bind(C);
      try {
        return Function.prototype.bind.call(v, C);
      } catch {
        return function() {
          return Function.prototype.apply.apply(v, [C, arguments]);
        };
      }
    }
    function d() {
      console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
    }
    function b(C) {
      return C === "debug" && (C = "log"), typeof console === r ? !1 : C === "trace" && a ? d : console[C] !== void 0 ? l(console, C) : console.log !== void 0 ? l(console, "log") : t;
    }
    function _(C, x) {
      for (var v = 0; v < s.length; v++) {
        var T = s[v];
        this[T] = v < C ? t : this.methodFactory(T, C, x);
      }
      this.log = this.debug;
    }
    function y(C, x, v) {
      return function() {
        typeof console !== r && (_.call(this, x, v), this[C].apply(this, arguments));
      };
    }
    function m(C, x, v) {
      return b(C) || y.apply(this, arguments);
    }
    function k(C, x, v) {
      var T = this, R;
      x = x ?? "WARN";
      var n = "loglevel";
      typeof C == "string" ? n += ":" + C : typeof C == "symbol" && (n = void 0);
      function i(f) {
        var g = (s[f] || "silent").toUpperCase();
        if (!(typeof window === r || !n)) {
          try {
            window.localStorage[n] = g;
            return;
          } catch {
          }
          try {
            window.document.cookie = encodeURIComponent(n) + "=" + g + ";";
          } catch {
          }
        }
      }
      function o() {
        var f;
        if (!(typeof window === r || !n)) {
          try {
            f = window.localStorage[n];
          } catch {
          }
          if (typeof f === r)
            try {
              var g = window.document.cookie, O = g.indexOf(
                encodeURIComponent(n) + "="
              );
              O !== -1 && (f = /^([^;]+)/.exec(g.slice(O))[1]);
            } catch {
            }
          return T.levels[f] === void 0 && (f = void 0), f;
        }
      }
      function c() {
        if (!(typeof window === r || !n)) {
          try {
            window.localStorage.removeItem(n);
            return;
          } catch {
          }
          try {
            window.document.cookie = encodeURIComponent(n) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
          } catch {
          }
        }
      }
      T.name = C, T.levels = {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        SILENT: 5
      }, T.methodFactory = v || m, T.getLevel = function() {
        return R;
      }, T.setLevel = function(f, g) {
        if (typeof f == "string" && T.levels[f.toUpperCase()] !== void 0 && (f = T.levels[f.toUpperCase()]), typeof f == "number" && f >= 0 && f <= T.levels.SILENT) {
          if (R = f, g !== !1 && i(f), _.call(T, f, C), typeof console === r && f < T.levels.SILENT)
            return "No console available for logging";
        } else
          throw "log.setLevel() called with invalid level: " + f;
      }, T.setDefaultLevel = function(f) {
        x = f, o() || T.setLevel(f, !1);
      }, T.resetLevel = function() {
        T.setLevel(x, !1), c();
      }, T.enableAll = function(f) {
        T.setLevel(T.levels.TRACE, f);
      }, T.disableAll = function(f) {
        T.setLevel(T.levels.SILENT, f);
      };
      var u = o();
      u == null && (u = x), T.setLevel(u, !1);
    }
    var N = new k(), A = {};
    N.getLogger = function(C) {
      if (typeof C != "symbol" && typeof C != "string" || C === "")
        throw new TypeError("You must supply a name when creating a logger.");
      var x = A[C];
      return x || (x = A[C] = new k(
        C,
        N.getLevel(),
        N.methodFactory
      )), x;
    };
    var j = typeof window !== r ? window.log : void 0;
    return N.noConflict = function() {
      return typeof window !== r && window.log === N && (window.log = j), N;
    }, N.getLoggers = function() {
      return A;
    }, N.default = N, N;
  });
})(Xo);
var ed = Xo.exports;
const Lr = /* @__PURE__ */ on(ed);
var es = { exports: {} };
(function(e) {
  (function(t, r) {
    e.exports ? e.exports = r() : t.prefix = r(t);
  })(Qo, function(t) {
    var r = function(m) {
      for (var k = 1, N = arguments.length, A; k < N; k++)
        for (A in arguments[k])
          Object.prototype.hasOwnProperty.call(arguments[k], A) && (m[A] = arguments[k][A]);
      return m;
    }, a = {
      template: "[%t] %l:",
      levelFormatter: function(m) {
        return m.toUpperCase();
      },
      nameFormatter: function(m) {
        return m || "root";
      },
      timestampFormatter: function(m) {
        return m.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
      },
      format: void 0
    }, s, l = {}, d = function(m) {
      if (!m || !m.getLogger)
        throw new TypeError("Argument is not a root logger");
      s = m;
    }, b = function(m, k) {
      if (!m || !m.setLevel)
        throw new TypeError("Argument is not a logger");
      var N = m.methodFactory, A = m.name || "", j = l[A] || l[""] || a;
      function C(x, v, T) {
        var R = N(x, v, T), n = l[T] || l[""], i = n.template.indexOf("%t") !== -1, o = n.template.indexOf("%l") !== -1, c = n.template.indexOf("%n") !== -1;
        return function() {
          for (var u = "", f = arguments.length, g = Array(f), O = 0; O < f; O++)
            g[O] = arguments[O];
          if (A || !l[T]) {
            var z = n.timestampFormatter(/* @__PURE__ */ new Date()), q = n.levelFormatter(x), B = n.nameFormatter(T);
            n.format ? u += n.format(q, B, z) : (u += n.template, i && (u = u.replace(/%t/, z)), o && (u = u.replace(/%l/, q)), c && (u = u.replace(/%n/, B))), g.length && typeof g[0] == "string" ? g[0] = u + " " + g[0] : g.unshift(u);
          }
          R.apply(void 0, g);
        };
      }
      return l[A] || (m.methodFactory = C), k = k || {}, k.template && (k.format = void 0), l[A] = r({}, j, k), m.setLevel(m.getLevel()), s || m.warn(
        "It is necessary to call the function reg() of loglevel-plugin-prefix before calling apply. From the next release, it will throw an error. See more: https://github.com/kutuluk/loglevel-plugin-prefix/blob/master/README.md"
      ), m;
    }, _ = {
      reg: d,
      apply: b
    }, y;
    return t && (y = t.prefix, _.noConflict = function() {
      return t.prefix === _ && (t.prefix = y), _;
    }), _;
  });
})(es);
var td = es.exports;
const Qn = /* @__PURE__ */ on(td);
function rd() {
  const e = Error.prepareStackTrace;
  Error.prepareStackTrace = (r, a) => a;
  const t = new Error().stack.slice(1);
  return Error.prepareStackTrace = e, t;
}
class mr {
  /**
   * 解析日志级别为枚举
   *
   * @param enumObj - 枚举对象
   * @param value - 配置的值
   */
  static stringToEnumValue(t, r) {
    return t[Object.keys(t).filter((a) => t[a].toString() === r)[0]];
  }
  /**
   * 获取配置的日志级别
   */
  static getEnvLevel(t) {
    if (!t)
      return;
    const r = t.getEnvOrDefault(Kr.LOG_LEVEL_KEY, et.LOG_LEVEL_INFO), a = mr.stringToEnumValue(et, r.toUpperCase());
    return a || console.warn(
      "[zhi-log] LOG_LEVEL is invalid in you .env file.It must be either debug, info, warn or error, fallback to default info level"
    ), a;
  }
  /**
   * 获取默认日志
   */
  static getEnvLogger(t) {
    return t ? t.getEnv(Kr.LOG_PREFIX_KEY) : void 0;
  }
}
var sn = { exports: {} }, Xn = { exports: {} }, eo;
function ad() {
  return eo || (eo = 1, function(e) {
    const t = typeof process < "u" && process.env.TERM_PROGRAM === "Hyper", r = typeof process < "u" && process.platform === "win32", a = typeof process < "u" && process.platform === "linux", s = {
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
    }, l = Object.assign({}, s, {
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
    }), d = Object.assign({}, s, {
      ballotCross: "✘",
      check: "✔",
      cross: "✖",
      ellipsisLarge: "⋯",
      ellipsis: "…",
      info: "ℹ",
      questionFull: "？",
      questionSmall: "﹖",
      pointer: a ? "▸" : "❯",
      pointerSmall: a ? "‣" : "›",
      radioOff: "◯",
      radioOn: "◉",
      warning: "⚠"
    });
    e.exports = r && !t ? l : d, Reflect.defineProperty(e.exports, "common", { enumerable: !1, value: s }), Reflect.defineProperty(e.exports, "windows", { enumerable: !1, value: l }), Reflect.defineProperty(e.exports, "other", { enumerable: !1, value: d });
  }(Xn)), Xn.exports;
}
const nd = (e) => e !== null && typeof e == "object" && !Array.isArray(e), od = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g, sd = () => typeof process < "u" ? process.env.FORCE_COLOR !== "0" : !1, ts = () => {
  const e = {
    enabled: sd(),
    visible: !0,
    styles: {},
    keys: {}
  }, t = (l) => {
    let d = l.open = `\x1B[${l.codes[0]}m`, b = l.close = `\x1B[${l.codes[1]}m`, _ = l.regex = new RegExp(`\\u001b\\[${l.codes[1]}m`, "g");
    return l.wrap = (y, m) => {
      y.includes(b) && (y = y.replace(_, b + d));
      let k = d + y + b;
      return m ? k.replace(/\r*\n/g, `${b}$&${d}`) : k;
    }, l;
  }, r = (l, d, b) => typeof l == "function" ? l(d) : l.wrap(d, b), a = (l, d) => {
    if (l === "" || l == null)
      return "";
    if (e.enabled === !1)
      return l;
    if (e.visible === !1)
      return "";
    let b = "" + l, _ = b.includes(`
`), y = d.length;
    for (y > 0 && d.includes("unstyle") && (d = [.../* @__PURE__ */ new Set(["unstyle", ...d])].reverse()); y-- > 0; )
      b = r(e.styles[d[y]], b, _);
    return b;
  }, s = (l, d, b) => {
    e.styles[l] = t({ name: l, codes: d }), (e.keys[b] || (e.keys[b] = [])).push(l), Reflect.defineProperty(e, l, {
      configurable: !0,
      enumerable: !0,
      set(_) {
        e.alias(l, _);
      },
      get() {
        let _ = (y) => a(y, _.stack);
        return Reflect.setPrototypeOf(_, e), _.stack = this.stack ? this.stack.concat(l) : [l], _;
      }
    });
  };
  return s("reset", [0, 0], "modifier"), s("bold", [1, 22], "modifier"), s("dim", [2, 22], "modifier"), s("italic", [3, 23], "modifier"), s("underline", [4, 24], "modifier"), s("inverse", [7, 27], "modifier"), s("hidden", [8, 28], "modifier"), s("strikethrough", [9, 29], "modifier"), s("black", [30, 39], "color"), s("red", [31, 39], "color"), s("green", [32, 39], "color"), s("yellow", [33, 39], "color"), s("blue", [34, 39], "color"), s("magenta", [35, 39], "color"), s("cyan", [36, 39], "color"), s("white", [37, 39], "color"), s("gray", [90, 39], "color"), s("grey", [90, 39], "color"), s("bgBlack", [40, 49], "bg"), s("bgRed", [41, 49], "bg"), s("bgGreen", [42, 49], "bg"), s("bgYellow", [43, 49], "bg"), s("bgBlue", [44, 49], "bg"), s("bgMagenta", [45, 49], "bg"), s("bgCyan", [46, 49], "bg"), s("bgWhite", [47, 49], "bg"), s("blackBright", [90, 39], "bright"), s("redBright", [91, 39], "bright"), s("greenBright", [92, 39], "bright"), s("yellowBright", [93, 39], "bright"), s("blueBright", [94, 39], "bright"), s("magentaBright", [95, 39], "bright"), s("cyanBright", [96, 39], "bright"), s("whiteBright", [97, 39], "bright"), s("bgBlackBright", [100, 49], "bgBright"), s("bgRedBright", [101, 49], "bgBright"), s("bgGreenBright", [102, 49], "bgBright"), s("bgYellowBright", [103, 49], "bgBright"), s("bgBlueBright", [104, 49], "bgBright"), s("bgMagentaBright", [105, 49], "bgBright"), s("bgCyanBright", [106, 49], "bgBright"), s("bgWhiteBright", [107, 49], "bgBright"), e.ansiRegex = od, e.hasColor = e.hasAnsi = (l) => (e.ansiRegex.lastIndex = 0, typeof l == "string" && l !== "" && e.ansiRegex.test(l)), e.alias = (l, d) => {
    let b = typeof d == "string" ? e[d] : d;
    if (typeof b != "function")
      throw new TypeError("Expected alias to be the name of an existing color (string) or a function");
    b.stack || (Reflect.defineProperty(b, "name", { value: l }), e.styles[l] = b, b.stack = [l]), Reflect.defineProperty(e, l, {
      configurable: !0,
      enumerable: !0,
      set(_) {
        e.alias(l, _);
      },
      get() {
        let _ = (y) => a(y, _.stack);
        return Reflect.setPrototypeOf(_, e), _.stack = this.stack ? this.stack.concat(b.stack) : b.stack, _;
      }
    });
  }, e.theme = (l) => {
    if (!nd(l))
      throw new TypeError("Expected theme to be an object");
    for (let d of Object.keys(l))
      e.alias(d, l[d]);
    return e;
  }, e.alias("unstyle", (l) => typeof l == "string" && l !== "" ? (e.ansiRegex.lastIndex = 0, l.replace(e.ansiRegex, "")) : ""), e.alias("noop", (l) => l), e.none = e.clear = e.noop, e.stripColor = e.unstyle, e.symbols = ad(), e.define = s, e;
};
sn.exports = ts();
sn.exports.create = ts;
var id = sn.exports;
const He = /* @__PURE__ */ on(id);
let ga, rs, as, ns, os = !0;
typeof process < "u" && ({ FORCE_COLOR: ga, NODE_DISABLE_COLORS: rs, NO_COLOR: as, TERM: ns } = process.env || {}, os = process.stdout && process.stdout.isTTY);
const ae = {
  enabled: !rs && as == null && ns !== "dumb" && (ga != null && ga !== "0" || os),
  // modifiers
  reset: ge(0, 0),
  bold: ge(1, 22),
  dim: ge(2, 22),
  italic: ge(3, 23),
  underline: ge(4, 24),
  inverse: ge(7, 27),
  hidden: ge(8, 28),
  strikethrough: ge(9, 29),
  // colors
  black: ge(30, 39),
  red: ge(31, 39),
  green: ge(32, 39),
  yellow: ge(33, 39),
  blue: ge(34, 39),
  magenta: ge(35, 39),
  cyan: ge(36, 39),
  white: ge(37, 39),
  gray: ge(90, 39),
  grey: ge(90, 39),
  // background colors
  bgBlack: ge(40, 49),
  bgRed: ge(41, 49),
  bgGreen: ge(42, 49),
  bgYellow: ge(43, 49),
  bgBlue: ge(44, 49),
  bgMagenta: ge(45, 49),
  bgCyan: ge(46, 49),
  bgWhite: ge(47, 49)
};
function to(e, t) {
  let r = 0, a, s = "", l = "";
  for (; r < e.length; r++)
    a = e[r], s += a.open, l += a.close, ~t.indexOf(a.close) && (t = t.replace(a.rgx, a.close + a.open));
  return s + t + l;
}
function ld(e, t) {
  let r = { has: e, keys: t };
  return r.reset = ae.reset.bind(r), r.bold = ae.bold.bind(r), r.dim = ae.dim.bind(r), r.italic = ae.italic.bind(r), r.underline = ae.underline.bind(r), r.inverse = ae.inverse.bind(r), r.hidden = ae.hidden.bind(r), r.strikethrough = ae.strikethrough.bind(r), r.black = ae.black.bind(r), r.red = ae.red.bind(r), r.green = ae.green.bind(r), r.yellow = ae.yellow.bind(r), r.blue = ae.blue.bind(r), r.magenta = ae.magenta.bind(r), r.cyan = ae.cyan.bind(r), r.white = ae.white.bind(r), r.gray = ae.gray.bind(r), r.grey = ae.grey.bind(r), r.bgBlack = ae.bgBlack.bind(r), r.bgRed = ae.bgRed.bind(r), r.bgGreen = ae.bgGreen.bind(r), r.bgYellow = ae.bgYellow.bind(r), r.bgBlue = ae.bgBlue.bind(r), r.bgMagenta = ae.bgMagenta.bind(r), r.bgCyan = ae.bgCyan.bind(r), r.bgWhite = ae.bgWhite.bind(r), r;
}
function ge(e, t) {
  let r = {
    open: `\x1B[${e}m`,
    close: `\x1B[${t}m`,
    rgx: new RegExp(`\\x1b\\[${t}m`, "g")
  };
  return function(a) {
    return this !== void 0 && this.has !== void 0 ? (~this.has.indexOf(e) || (this.has.push(e), this.keys.push(r)), a === void 0 ? this : ae.enabled ? to(this.keys, a + "") : a + "") : a === void 0 ? ld([e], [r]) : ae.enabled ? to([r], a + "") : a + "";
  };
}
var cd = Object.defineProperty, ud = (e, t, r) => t in e ? cd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, Se = (e, t, r) => (ud(e, typeof t != "symbol" ? t + "" : t, r), r);
const Xe = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return Xe.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let he = Xe;
Se(he, "isNode", typeof process < "u"), /**
* 是否在浏览器环境
*/
Se(he, "isInBrowser", typeof window < "u"), /**
* 浏览器路径分隔符
*/
Se(he, "BrowserSeperator", "/"), /**
* 是否是Electron环境
*/
Se(he, "isElectron", () => !Xe.isInBrowser || !window.navigator || !window.navigator.userAgent ? !1 : /Electron/.test(window.navigator.userAgent)), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
Se(he, "hasNodeEnv", () => Xe.isElectron() || Xe.isNode), /**
* 获取url参数
*
* @param sParam - 参数
*/
Se(he, "getQueryString", (e) => {
  if (!Xe.isInBrowser)
    return "";
  const t = window.location.search.substring(1).split("&");
  for (let r = 0; r < t.length; r++) {
    const a = t[r].split("=");
    if (a[0] === e)
      return a[1];
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
Se(he, "replaceUrlParam", (e, t, r) => {
  r == null && (r = "");
  const a = new RegExp("\\b(" + t + "=).*?(&|#|$)");
  if (e.search(a) >= 0)
    return e.replace(a, "$1" + r + "$2");
  const [s, l] = e.split("#"), [d, b] = s.split("?"), _ = new URLSearchParams(b);
  _.set(t, r);
  const y = _.toString(), m = d + (y ? "?" + y : "");
  return l ? m + "#" + l : m;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
Se(he, "setUrlParameter", (e, t, r) => {
  if (e.includes(t))
    return Xe.replaceUrlParam(e, t, r);
  const a = e.split("#");
  let s = a[0];
  const l = a[1];
  return s.includes("?") ? s += `&${t}=${r}` : s += `?${t}=${r}`, l && (s += "#" + l), s;
}), /**
* 重新加载指定tab
*
* @param tabname - tabname
* @param t - 延迟时间
*/
Se(he, "reloadTabPage", (e, t = 200) => {
  setTimeout(function() {
    if (Xe.isInBrowser) {
      const r = window.location.href;
      window.location.href = Xe.setUrlParameter(r, "tab", e);
    }
  }, t);
}), /**
* 刷新当前tab页面
*/
Se(he, "reloadPage", () => {
  setTimeout(function() {
    Xe.isInBrowser && window.location.reload();
  }, 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
*/
Se(he, "reloadPageWithMessageCallback", (e, t) => {
  t && t(e), setTimeout(function() {
    Xe.isInBrowser && window.location.reload();
  }, 200);
});
var Le = /* @__PURE__ */ ((e) => (e.BasePathType_Appearance = "Appearance", e.BasePathType_Data = "Data", e.BasePathType_Themes = "Themes", e.BasePathType_ZhiTheme = "ZhiTheme", e.BasePathType_None = "None", e))(Le || {});
const Me = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return he.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : !1;
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
    let r = e;
    switch (t) {
      case Le.BasePathType_Appearance:
        r = this.browserJoinPath(this.siyuanAppearanceRelativePath(), e);
        break;
      case Le.BasePathType_Data:
        r = this.browserJoinPath(this.siyuanDataRelativePath(), e);
        break;
      case Le.BasePathType_Themes:
        r = this.browserJoinPath(this.siyuanThemeRelativePath(), e);
        break;
      case Le.BasePathType_ZhiTheme:
        r = this.browserJoinPath(this.zhiThemeRelativePath(), e);
        break;
      default:
        throw new Error("type must be provided");
    }
    const { default: a } = await import(
      /* @vite-ignore */
      r
    );
    return a;
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
    return await this.importJs(e, Le.BasePathType_ZhiTheme);
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
    if (he.hasNodeEnv()) {
      const t = this.requireLib("path");
      if (t)
        return t.join(...e);
    }
    return this.browserJoinPath(...e);
  }
  static browserJoinPath(...e) {
    return e.join(he.BrowserSeperator);
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
    if (he.hasNodeEnv())
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
let Tt = Me;
Se(Tt, "isInSiyuanWidget", () => he.isInBrowser ? window.frameElement != null && window.frameElement.parentElement != null && window.frameElement.parentElement.parentElement != null && window.frameElement.parentElement.parentElement.getAttribute("data-node-id") !== "" : !1), /**
* 思源笔记新窗口
*
* @deprecated window.terwer 判断方式已废弃，建议以后打开新窗口注入 window.siyuanNewWin ，这样语义会更容易理解
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
Se(Tt, "isInSiyuanNewWin", () => !he.isInBrowser || !he.isElectron() ? !1 : typeof window.terwer < "u" || typeof window.siyuanNewWin < "u"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
Se(Tt, "requireLib", (e, t = !0, r = Le.BasePathType_None) => {
  if (!he.hasNodeEnv())
    throw new Error("require ony works on node env");
  let a = e;
  if (!t)
    switch (r) {
      case Le.BasePathType_Appearance:
        a = Me.joinPath(Me.siyuanAppearancePath(), e);
        break;
      case Le.BasePathType_Data:
        a = Me.joinPath(Me.siyuanDataPath(), e);
        break;
      case Le.BasePathType_Themes:
        a = Me.joinPath(Me.siyuanAppearancePath(), "themes", e);
        break;
      case Le.BasePathType_ZhiTheme:
        a = Me.joinPath(Me.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const s = Me.siyuanWindow();
  if (!s)
    return require(a);
  if (typeof s.require < "u")
    return s.require(a);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
Se(Tt, "requireAppearanceLib", (e) => Me.requireLib(e, !1, Le.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
Se(Tt, "requireDataLib", (e) => Me.requireLib(e, !1, Le.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
Se(Tt, "requireThemesLib", (e) => Me.requireLib(e, !1, Le.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
Se(Tt, "requireZhiThemeLib", (e) => Me.requireLib(e, !1, Le.BasePathType_ZhiTheme));
const Ke = {
  white: (e) => he.isElectron() ? He.whiteBright(e) : ae.white(e),
  gray: (e) => he.isElectron() ? He.gray(e) : ae.gray(e),
  blue: (e) => he.isElectron() ? He.blue(e) : ae.blue(e),
  green: (e) => he.isElectron() ? He.green(e) : ae.green(e),
  yellow: (e) => he.isElectron() ? He.yellow(e) : ae.yellow(e),
  red: (e) => he.isElectron() ? He.red(e) : ae.red(e),
  bgWhite: (e) => he.isElectron() ? He.bgWhiteBright(e) : ae.bgWhite(e),
  bgGrey: (e) => he.isElectron() ? He.bgCyanBright(e) : ae.bgCyan(e),
  bgBlue: (e) => he.isElectron() ? He.bgBlueBright(e) : ae.bgBlue(e),
  bgGreen: (e) => he.isElectron() ? He.bgGreenBright(e) : ae.bgGreen(e),
  bgYellow: (e) => he.isElectron() ? He.bgYellowBright(e) : ae.bgYellow(e),
  bgRed: (e) => he.isElectron() ? He.bgRedBright(e) : ae.bgRed(e)
};
class dd {
  constructor(t, r, a) {
    Gt(this, "consoleLogger", "console"), Gt(this, "stackSize", 1), Gt(this, "getLogger", (d) => {
      let b;
      if (d)
        b = d;
      else {
        const _ = this.getCallStack(), y = [], m = [];
        for (let k = 0; k < _.length; k++) {
          const N = _[k], A = N.getFileName() ?? "none";
          if (k > this.stackSize - 1)
            break;
          const j = A + "-" + N.getLineNumber() + ":" + N.getColumnNumber();
          y.push(j);
        }
        m.length > 0 && (b = y.join(" -> "));
      }
      return (!b || b.trim().length === 0) && (b = this.consoleLogger), Lr.getLogger(b);
    }), this.stackSize = 1;
    let s;
    t ? s = t : s = mr.getEnvLevel(a), s = s ?? et.LOG_LEVEL_INFO, Lr.setLevel(s);
    const l = (d, b, _, y) => {
      const m = [], k = r ?? mr.getEnvLogger(a) ?? "zhi";
      return m.push(Ke.gray("[") + y(k) + Ke.gray("]")), m.push(Ke.gray("[") + Ke.gray(_.toString()) + Ke.gray("]")), m.push(y(d.toUpperCase().toString())), m.push(y(b)), m.push(Ke.gray(":")), m;
    };
    Qn.reg(Lr), Qn.apply(Lr, {
      format(d, b, _) {
        let y = [];
        const m = b ?? "";
        switch (d) {
          case et.LOG_LEVEL_TRACE:
            y = l(d, m, _, Ke.gray);
            break;
          case et.LOG_LEVEL_DEBUG:
            y = l(d, m, _, Ke.blue);
            break;
          case et.LOG_LEVEL_INFO:
            y = l(d, m, _, Ke.green);
            break;
          case et.LOG_LEVEL_WARN:
            y = l(d, m, _, Ke.yellow);
            break;
          case et.LOG_LEVEL_ERROR:
            y = l(d, m, _, Ke.red);
            break;
          default:
            y = l(et.LOG_LEVEL_INFO, m, _, Ke.green);
            break;
        }
        return y.join(" ");
      }
    });
  }
  /**
   * 设置输出栈的深度，默认1
   *
   * @param stackSize - 栈的深度
   */
  setStackSize(t) {
    this.stackSize = t ?? 1;
  }
  /**
   * 获取调用堆栈，若未获取到直接返回空数组
   *
   * @author terwer
   * @since 1.6.0
   */
  getCallStack() {
    let t;
    try {
      t = rd();
    } catch {
      t = [];
    }
    return t;
  }
}
class hd {
  /**
   * 默认日志级别
   *
   * @param level - 可选，未设置默认INFO
   * @param sign - 可选前缀，默认zhi
   * @param env - 可选环境变量实例
   */
  constructor(t, r, a) {
    Gt(this, "logger"), this.logger = new dd(t, r, a);
  }
  /**
   * 获取日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   * @protected
   */
  getLogger(t, r) {
    return this.logger.setStackSize(r), this.logger.getLogger(t);
  }
}
class ro extends hd {
  constructor(t, r, a) {
    super(t, r, a);
  }
  /**
   * 获取默认的日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   */
  getLogger(t, r) {
    return super.getLogger(t, r);
  }
}
class Wr {
  /**
   * 默认日志记录器
   *
   * @param stackSize - 栈的深度
   * @param env - 环境变量实例
   */
  static defaultLogger(t, r) {
    return Wr.customLogFactory(void 0, void 0, t).getLogger(void 0, r);
  }
  /**
   * 自定义日志工厂
   *
   * @param level - 级别
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customLogFactory(t, r, a) {
    return new ro(t, r, a);
  }
  /**
   * 自定义日志工厂，自定义前缀
   *
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customSignLogFactory(t, r) {
    return new ro(void 0, t, r);
  }
}
class Jr {
}
/**
 * 思源 API 伺服地址
 */
$e(Jr, "VITE_SIYUAN_API_URL_KEY", "VITE_SIYUAN_API_URL"), /**
 * 思源 token
 */
$e(Jr, "VITE_SIYUAN_AUTH_TOKEN_KEY", "VITE_SIYUAN_AUTH_TOKEN");
class gr {
  /**
   * 通用环境变量
   *
   * @param appInstance - 插件实例
   */
  static zhiEnv(t) {
    return this.env || (this.env = new t.zhiEnv.Env({ BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 })), this.env;
  }
  /**
   * 通用日志
   *
   * @param appInstance - 应用实例
   * @param loggerName - 日志名称
   */
  static zhiLog(t, r) {
    const a = this.zhiEnv(t);
    return t.zhiCommon.ZhiUtil.initEnv(a), t.zhiCommon.ZhiUtil.zhiLogWithSign("publisher", r);
  }
  /**
   * 通用工具入口
   *
   * @param appInstance - 应用实例
   */
  static zhiCommon(t) {
    return t.zhiCommon.ZhiUtil.zhiCommon();
  }
}
$e(gr, "env");
class ea {
  /**
   * 初始化思源服务端 API
   *
   * @param cfg - 环境变量 或者 配置项
   */
  constructor(t) {
    /**
     * 思源笔记服务端API版本号
     */
    $e(this, "VERSION");
    $e(this, "logger");
    $e(this, "env");
    $e(this, "common");
    $e(this, "siyuanConfig");
    if (this.VERSION = "1.0.0", t instanceof Yn)
      this.siyuanConfig = t, this.logger = Wr.customLogFactory(et.LOG_LEVEL_DEBUG, "zhi").getLogger("siyuan-kernel-api");
    else {
      const r = t, a = mr.getEnvLevel(r), s = r.getStringEnv(Jr.VITE_SIYUAN_API_URL_KEY), l = r.getStringEnv(Jr.VITE_SIYUAN_AUTH_TOKEN_KEY);
      this.siyuanConfig = new Yn(s, l), this.logger = Wr.customLogFactory(a, "siyuan-kernel-api", r).getLogger(ea.name);
    }
  }
  init(t) {
    this.env = gr.zhiEnv(t), this.common = gr.zhiCommon(t);
  }
  /**
   * 分页获取根文档
   *
   * @param keyword - 关键字
   */
  async getRootBlocksCount(t) {
    const r = `SELECT COUNT(DISTINCT b1.root_id) as count
        FROM blocks b1
        WHERE 1 = 1
        AND (b1.root_id ='${t}' OR (b1.content LIKE '%${t}%') OR (b1.tag LIKE '%${t}%')
    )`, a = await this.sql(r);
    return this.logger.debug("getRootBlocksCount data=>", a[0].count), a[0].count;
  }
  /**
       * 分页获取根文档
  
       * ```sql
       * select DISTINCT b2.root_id,b2.parent_id,b2.content from blocks b2
       *        WHERE 1==1
       * AND b2.id IN (
       *     SELECT DISTINCT b1.root_id
       *        FROM blocks b1
       *        WHERE 1 = 1
       *        AND ((b1.content LIKE '%github%') OR (b1.tag LIKE '%github%'))
       *        ORDER BY b1.updated DESC,b1.created DESC LIMIT 0,10
       * )
       * ORDER BY b2.updated DESC,b2.created DESC
       * ```
       *
       * @param page 页码
       * @param pagesize 数目
       * @param keyword 可选，搜索关键字
       */
  async getRootBlocks(t, r, a) {
    const s = `select DISTINCT b2.root_id,b2.parent_id,b2.content from blocks b2
        WHERE 1==1
        AND b2.id IN (
             SELECT DISTINCT b1.root_id
                FROM blocks b1
                WHERE 1 = 1
                AND (b1.root_id ='${a}' OR (b1.content LIKE '%${a}%') OR (b1.tag LIKE '%${a}%'))
                ORDER BY b1.updated DESC,b1.created DESC LIMIT ${t * r},${r}
        )
        ORDER BY b2.updated DESC,b2.created DESC`;
    return await this.sql(s);
  }
  /**
   * 获取该文档下面的子文档个数
   *
   * ```sql
   * SELECT COUNT(DISTINCT b1.root_id) AS count
   * FROM blocks b1
   * WHERE b1.path LIKE '%/20220927094918-1d85uyp%';
   * ```
   *
   * @param docId 文档ID
   */
  async getSubdocCount(t) {
    const r = `SELECT COUNT(DISTINCT b1.root_id) AS count
        FROM blocks b1
        WHERE b1.root_id='${t}' OR b1.path LIKE '%/${t}%'`;
    return (await this.sql(r))[0].count;
  }
  /**
   * 分页获取子文档
   *
   * ```sql
   * SELECT DISTINCT b2.root_id,b2.content,b2.path FROM blocks b2
   * WHERE b2.id IN (
   *   SELECT DISTINCT b1.root_id
   *      FROM blocks b1
   *      WHERE b1.path like '%/20220927094918-1d85uyp%'
   *      AND ((b1.content LIKE '%文档%') OR (b1.tag LIKE '%文档%'))
   *      ORDER BY b1.updated DESC,b1.created DESC LIMIT 0,10
   * )
   * ORDER BY b2.updated DESC,b2.created DESC
   * ```
   *
   * @param docId 文档ID
   * @param page 页码
   * @param pagesize 数目
   * @param keyword 关键字
   */
  async getSubdocs(t, r, a, s) {
    const l = `SELECT DISTINCT b2.root_id,b2.content,b2.path FROM blocks b2
        WHERE b2.id IN (
          SELECT DISTINCT b1.root_id
             FROM blocks b1
             WHERE b1.root_id='${t}' OR b1.path like '%/${t}%'
             AND ((b1.content LIKE '%${s}%') OR (b1.tag LIKE '%${s}%'))
             ORDER BY b1.updated DESC,b1.created DESC LIMIT ${r * a},${a}
        )
        ORDER BY b2.content,b2.updated DESC,b2.created DESC,id`;
    return this.logger.debug("siyuanApi getSubdocs sql=>", l), await this.sql(l);
  }
  /**
   * 以id获取思源块信息
   * @param blockId 块ID
   */
  async getBlockByID(t) {
    const r = `select *
                from blocks
                where id = '${t}'`, a = await this.sql(r);
    if (!a || a.length === 0)
      throw new Error("通过ID查询块信息失败");
    return a[0];
  }
  /**
   * 以slug获取思源块信息
   * @param slug 内容快别名
   */
  async getRootBlockBySlug(t) {
    const r = `select root_id from attributes where name='custom-slug' and value='${t}' limit 1`;
    return (await this.sql(r))[0];
  }
  /**
   * 以内容块ID获取根块
   *
   * @param blockID 内容块ID
   */
  async getRootBlock(t) {
    const r = `select root_id from blocks where id='${t}' limit 1`;
    return (await this.sql(r))[0];
  }
  /**
   * 导出markdown文本
   * @param docId 文档id
   */
  async exportMdContent(t) {
    const r = {
      id: t
    }, a = "/api/export/exportMdContent";
    return await this.siyuanRequest(a, r);
  }
  /**
   * 以sql发送请求
   *
   * @param sql - sql
   */
  async sql(t) {
    const r = {
      stmt: t
    }, a = "/api/query/sql";
    return this.env.isDev() && this.logger.trace("sql=>", t), await this.siyuanRequest(a, r);
  }
  /**
   * 向思源请求数据
   *
   * @param url - url
   * @param data - 数据
   */
  async siyuanRequest(t, r) {
    const a = `${this.siyuanConfig.apiUrl}${t}`, s = {
      body: JSON.stringify(r),
      method: "POST"
    };
    this.common.strUtil.isEmptyString(this.siyuanConfig.password) || Object.assign(s, {
      headers: {
        Authorization: `Token ${this.siyuanConfig.password}`
      }
    }), this.env.isDev() && (this.logger.trace("开始向思源请求数据，reqUrl=>", a), this.logger.trace("开始向思源请求数据，fetchOps=>", s));
    const d = await (await fetch(a, s)).json();
    if (this.env.isDev() && this.logger.trace("思源请求数据返回，resJson=>", d), d.code === -1)
      throw new Error(d.msg);
    return d.code === 0 ? d.data : null;
  }
  /**
   * 列出笔记本
   */
  async lsNotebooks() {
    return await this.siyuanRequest("/api/notebook/lsNotebooks", {});
  }
  /**
   * 打开笔记本
   *
   * @param notebookId - 笔记本ID
   */
  async openNotebook(t) {
    return await this.siyuanRequest("/api/notebook/openNotebook", {
      notebook: t
    });
  }
  /**
   * 关闭笔记本
   *
   * @param notebookId - 笔记本ID
   */
  async closeNotebook(t) {
    return await this.siyuanRequest("/api/notebook/closeNotebook", {
      notebook: t
    });
  }
  /**
   * 重命名笔记本
   *
   * @param notebookId - 笔记本ID
   * @param name - 新笔记本名称
   */
  async renameNotebook(t, r) {
    return await this.siyuanRequest("/api/notebook/renameNotebook", {
      notebook: t,
      name: r
    });
  }
  /**
   * 创建笔记本
   *
   * @param name - 新笔记本名称
   */
  async createNotebook(t) {
    return await this.siyuanRequest("/api/notebook/createNotebook", {
      name: t
    });
  }
  /**
   * 删除笔记本
   *
   * @param notebookId - 笔记本ID
   */
  async removeNotebook(t) {
    return await this.siyuanRequest("/api/notebook/removeNotebook", {
      notebook: t
    });
  }
  /**
   * 获取笔记本配置
   *
   * @param notebookId - 笔记本ID
   */
  async getNotebookConf(t) {
    return await this.siyuanRequest("/api/notebook/getNotebookConf", {
      notebook: t
    });
  }
  /**
   * 保存笔记本配置
   *
   * ```json
   * {
   *   "notebook": "20210817205410-2kvfpfn",
   *   "conf": {
   *       "name": "测试笔记本",
   *       "closed": false,
   *       "refCreateSavePath": "",
   *       "createDocNameTemplate": "",
   *       "dailyNoteSavePath": "/daily note/{{now | date \"2006/01\"}}/{{now | date \"2006-01-02\"}}",
   *       "dailyNoteTemplatePath": ""
   *     }
   * }
   * ```
   * @param notebookConf - 笔记本配置
   */
  async setNotebookConf(t) {
    return await this.siyuanRequest("/api/notebook/setNotebookConf", t);
  }
  /**
   * 推送消息
   *
   * 参数
   *
   * ```json
   * {
   *   "msg": "test",
   *   "timeout": 7000
   * }
   * ```
   *
   * timeout：消息持续显示时间，单位为毫秒。可以不传入该字段，默认为 7000 毫秒
   *
   * 返回值
   *
   * ```
   * {
   *   "code": 0,
   *   "msg": "",
   *   "data": {
   *       "id": "62jtmqi"
   *   }
   * }
   *
   * id：消息 ID
   * ```
   *
   * @param msgObj 消息体
   */
  async pushMsg(t) {
    return await this.siyuanRequest("/api/notification/pushMsg", t);
  }
  /**
   * 推送报错消息
   *
   * 参数
   *
   * ```
   * {
   *   "msg": "test",
   *   "timeout": 7000
   * }
   * ```
   *
   * timeout：消息持续显示时间，单位为毫秒。可以不传入该字段，默认为 7000 毫秒
   *
   * 返回值
   *
   * ```
   * {
   *   "code": 0,
   *   "msg": "",
   *   "data": {
   *       "id": "qc9znut"
   *   }
   * }
   *
   * id：消息 ID
   * ```
   *
   * @param msgObj
   */
  async pushErrMsg(t) {
    return await this.siyuanRequest("/api/notification/pushErrMsg", t);
  }
  /**
   * 获取块属性
   * @param blockId
   */
  async getBlockAttrs(t) {
    const r = {
      id: t
    }, a = "/api/attr/getBlockAttrs";
    return await this.siyuanRequest(a, r);
  }
  /**
   * 设置块属性
   * @param blockId
   * @param attrs
   */
  async setBlockAttrs(t, r) {
    const a = "/api/attr/setBlockAttrs";
    return await this.siyuanRequest(a, {
      id: t,
      attrs: r
    });
  }
}
class pd {
}
class md {
  /**
   * 构造思源 API对象
   *
   * @param cfg - 环境变量 或者 配置项
   */
  constructor(t) {
    /**
     * 思源笔记内核API
     */
    $e(this, "kernelApi");
    /**
     * 思源笔记客户端API
     */
    $e(this, "clientApi");
    this.kernelApi = new ea(t), this.clientApi = new pd();
  }
}
class gd {
  /**
   * 初始化思源 API 适配器
   *
   * @param cfg - 环境变量 或者 配置项
   */
  constructor(t) {
    $e(this, "logger");
    $e(this, "common");
    $e(this, "siyuanKernelApi");
    $e(this, "cfg");
    this.siyuanKernelApi = new ea(t), this.cfg = this.siyuanKernelApi.siyuanConfig;
  }
  init(t) {
    this.logger = gr.zhiLog(t, "siyuan-api-adaptor"), this.common = gr.zhiCommon(t), this.siyuanKernelApi.init(t);
  }
  async deletePost(t) {
    return console.log(t), Promise.resolve(!1);
  }
  async editPost(t, r, a) {
    return console.log(`${t} ${r} ${a}`), Promise.resolve(!1);
  }
  async getCategories() {
    return Promise.resolve([]);
  }
  async getPost(t, r, a) {
    let s = t;
    if (r) {
      const j = await this.siyuanKernelApi.getRootBlockBySlug(t);
      j && (s = j.root_id);
    }
    const l = await this.siyuanKernelApi.getBlockByID(s);
    if (!l)
      throw new Error("文章不存存在，postid=>" + s);
    const d = await this.siyuanKernelApi.getBlockAttrs(s);
    let b = !0;
    (d["custom-publish-status"] || "draft") === "secret" && (b = !1);
    const y = d["custom-post-password"] || "", m = d["custom-desc"] || "";
    let k = l.content ?? "";
    this.cfg.fixTitle && (k = this.common.htmlUtil.removeTitleNumber(k));
    let N;
    if (!a) {
      const j = await this.siyuanKernelApi.exportMdContent(s);
      N = await this.common.markdownUtil.renderHTML(j.content), N = this.common.htmlUtil.removeWidgetTag(N), this.cfg.fixTitle && (N = this.common.htmlUtil.removeH1(N));
    }
    const A = new _n();
    return A.postid = l.root_id || "", A.title = k || "", A.description = N || "", A.shortDesc = m || "", A.mt_keywords = d.tags || "", A.post_status = b ? Br.PostStatusEnum_Publish : Br.PostStatusEnum_Draft, A.wp_password = y, A;
  }
  async getPreviewUrl(t) {
    return console.log(t), Promise.resolve("");
  }
  async getRecentPosts(t, r, a) {
    const s = [];
    let l = 0;
    r && (l = r);
    const d = a ?? "", b = await this.siyuanKernelApi.getRootBlocks(l, t, d);
    this.logger.debug("getRecentPosts from siyuan, get counts =>", b.length);
    for (let _ = 0; _ < b.length; _++) {
      const y = b[_], m = await this.siyuanKernelApi.getBlockAttrs(y.root_id), k = await this.getPost(y.root_id, !1, !0), N = m["custom-slug"] || "";
      let A = y.content ?? "";
      this.cfg.fixTitle && (A = this.common.htmlUtil.removeTitleNumber(A));
      const j = new _n();
      j.postid = y.root_id, j.title = A, j.permalink = N === "" ? this.common.strUtil.appendStr("/post/", y.root_id) : this.common.strUtil.appendStr("/post/", N, ".html"), j.mt_keywords = k.mt_keywords, j.description = k.description, s.push(j);
    }
    return s;
  }
  async getRecentPostsCount(t) {
    return await this.siyuanKernelApi.getRootBlocksCount(t ?? "");
  }
  async getUsersBlogs() {
    return Promise.resolve([]);
  }
  newMediaObject(t) {
    return console.log(t), Promise.resolve({});
  }
  async newPost(t, r) {
    return console.log(`${t} ${r}`), Promise.resolve("");
  }
}
export {
  gd as SiYuanApiAdaptor,
  md as SiyuanApi,
  Yn as SiyuanConfig,
  Jr as SiyuanConstants,
  ea as SiyuanKernelApi
};
