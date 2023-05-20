var oo = Object.defineProperty;
var so = (e, t, n) => t in e ? oo(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var X = (e, t, n) => (so(e, typeof t != "symbol" ? t + "" : t, n), n);
var io = /* @__PURE__ */ ((e) => (e[e.Markdown = 0] = "Markdown", e[e.Html = 1] = "Html", e[e.Formatter = 2] = "Formatter", e[e.Markdown_And_Formatter = 3] = "Markdown_And_Formatter", e[e.MDX = 4] = "MDX", e))(io || {}), co = /* @__PURE__ */ ((e) => (e[e.PasswordType_Password = 0] = "PasswordType_Password", e[e.PasswordType_Token = 1] = "PasswordType_Token", e))(co || {});
class nl {
  constructor() {
    /**
     * 首页
     */
    X(this, "home");
    /**
     * API地址
     */
    X(this, "apiUrl");
    /**
     * 用户名
     */
    X(this, "username");
    /**
     * 密码类型
     */
    X(this, "passwordType");
    /**
     * 密码
     */
    X(this, "password");
    /**
     * 是否发布
     */
    X(this, "apiStatus");
    /**
     * 博客名（API获取）
     */
    X(this, "blogName");
    /**
     * 文章别名key
     */
    X(this, "posidKey");
    /**
     * 文章预览链接
     */
    X(this, "previewUrl");
    /**
     * 文章类型
     */
    X(this, "pageType");
    /**
     * 操作提示
     */
    X(this, "placeholder");
    /**
     * 是否处理标题
     *
     * @protected
     */
    X(this, "fixTitle");
    this.home = "", this.apiUrl = "", this.username = "", this.passwordType = 0, this.password = "", this.apiStatus = !1, this.blogName = "", this.posidKey = "", this.previewUrl = "", this.pageType = 0, this.placeholder = void 0, this.fixTitle = !1;
  }
}
class ol {
  constructor() {
    /**
     * 首页操作提示
     */
    X(this, "homePlaceholder");
    /**
     * API 地址操作提示
     */
    X(this, "apiUrlPlaceholder");
    /**
     * 用户名操作提示
     */
    X(this, "usernamePlaceholder");
    /**
     * 密码类型操作提示
     */
    X(this, "passwordTypePlaceholder");
    /**
     * 密码操作提示
     */
    X(this, "passwordPlaceholder");
    /**
     * API状态是否正常操作提示
     */
    X(this, "apiStatusPlaceholder");
    /**
     * 博客名（API获取）操作提示
     */
    X(this, "blogNamePlaceholder");
    /**
     * 文章别名key操作提示
     */
    X(this, "posidKeyPlaceholder");
    /**
     * 文章预览链接操作提示
     */
    X(this, "previewUrlPlaceholder");
    /**
     * 文章类型操作提示
     */
    X(this, "pageTypePlaceholder");
    this.homePlaceholder = "", this.apiUrlPlaceholder = "", this.usernamePlaceholder = "", this.passwordTypePlaceholder = "", this.passwordPlaceholder = "", this.apiStatusPlaceholder = !1, this.blogNamePlaceholder = "", this.posidKeyPlaceholder = "", this.previewUrlPlaceholder = "", this.pageTypePlaceholder = "";
  }
}
var mn = /* @__PURE__ */ ((e) => (e.PostStatusEnum_Publish = "publish", e.PostStatusEnum_Draft = "draft", e.PostStatusEnum_Inherit = "inherit", e))(mn || {});
class lo {
  constructor() {
    /**
     * 文章ID
     */
    X(this, "postid");
    /**
     * 标题
     */
    X(this, "title");
    /**
     * 逗号分隔的标签
     */
    X(this, "mt_keywords");
    /**
     * 链接
     */
    X(this, "link");
    /**
     * 永久链接
     */
    X(this, "permalink");
    /**
     * 摘要
     */
    X(this, "shortDesc");
    /**
     * 描述
     */
    X(this, "description");
    /**
     * 短评
     */
    X(this, "mt_excerpt");
    /**
     * 别名
     */
    X(this, "wp_slug");
    /**
     * 创建时间
     */
    X(this, "dateCreated");
    /**
     * 分类
     */
    X(this, "categories");
    /**
     * 更多
     */
    X(this, "mt_text_more");
    /**
     * 发布状态
     */
    X(this, "post_status");
    /**
     * 是否发布
     */
    X(this, "isPublished");
    /**
     * 发布密码
     */
    X(this, "wp_password");
    this.postid = "", this.title = "", this.mt_keywords = "", this.permalink = "", this.description = "", this.wp_slug = "", this.dateCreated = /* @__PURE__ */ new Date(), this.categories = [], this.isPublished = !0, this.post_status = mn.PostStatusEnum_Publish, this.wp_password = "";
  }
}
var uo = Object.defineProperty, ho = (e, t, n) => t in e ? uo(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, xe = (e, t, n) => (ho(e, typeof t != "symbol" ? t + "" : t, n), n), gn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function _n(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Or = { exports: {} }, bn = {}, rt = {}, gt = {}, Jt = {}, ue = {}, Gt = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class n extends t {
    constructor(A) {
      if (super(), !e.IDENTIFIER.test(A))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = A;
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
  e.Name = n;
  class a extends t {
    constructor(A) {
      super(), this._items = typeof A == "string" ? [A] : A;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const A = this._items[0];
      return A === "" || A === '""';
    }
    get str() {
      var A;
      return (A = this._str) !== null && A !== void 0 ? A : this._str = this._items.reduce((L, r) => `${L}${r}`, "");
    }
    get names() {
      var A;
      return (A = this._names) !== null && A !== void 0 ? A : this._names = this._items.reduce((L, r) => (r instanceof n && (L[r.str] = (L[r.str] || 0) + 1), L), {});
    }
  }
  e._Code = a, e.nil = new a("");
  function i(k, ...A) {
    const L = [k[0]];
    let r = 0;
    for (; r < A.length; )
      p(L, A[r]), L.push(k[++r]);
    return new a(L);
  }
  e._ = i;
  const l = new a("+");
  function m(k, ...A) {
    const L = [M(k[0])];
    let r = 0;
    for (; r < A.length; )
      L.push(l), p(L, A[r]), L.push(l, M(k[++r]));
    return g(L), new a(L);
  }
  e.str = m;
  function p(k, A) {
    A instanceof a ? k.push(...A._items) : A instanceof n ? k.push(A) : k.push(S(A));
  }
  e.addCodeArg = p;
  function g(k) {
    let A = 1;
    for (; A < k.length - 1; ) {
      if (k[A] === l) {
        const L = v(k[A - 1], k[A + 1]);
        if (L !== void 0) {
          k.splice(A - 1, 3, L);
          continue;
        }
        k[A++] = "+";
      }
      A++;
    }
  }
  function v(k, A) {
    if (A === '""')
      return k;
    if (k === '""')
      return A;
    if (typeof k == "string")
      return A instanceof n || k[k.length - 1] !== '"' ? void 0 : typeof A != "string" ? `${k.slice(0, -1)}${A}"` : A[0] === '"' ? k.slice(0, -1) + A.slice(1) : void 0;
    if (typeof A == "string" && A[0] === '"' && !(k instanceof n))
      return `"${k}${A.slice(1)}`;
  }
  function b(k, A) {
    return A.emptyStr() ? k : k.emptyStr() ? A : m`${k}${A}`;
  }
  e.strConcat = b;
  function S(k) {
    return typeof k == "number" || typeof k == "boolean" || k === null ? k : M(Array.isArray(k) ? k.join(",") : k);
  }
  function I(k) {
    return new a(M(k));
  }
  e.stringify = I;
  function M(k) {
    return JSON.stringify(k).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = M;
  function O(k) {
    return typeof k == "string" && e.IDENTIFIER.test(k) ? new a(`.${k}`) : i`[${k}]`;
  }
  e.getProperty = O;
  function x(k) {
    if (typeof k == "string" && e.IDENTIFIER.test(k))
      return new a(`${k}`);
    throw new Error(`CodeGen: invalid export name: ${k}, use explicit $id name mapping`);
  }
  e.getEsmExportName = x;
  function T(k) {
    return new a(k.toString());
  }
  e.regexpCode = T;
})(Gt);
var Ar = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = Gt;
  class n extends Error {
    constructor(v) {
      super(`CodeGen: "code" for ${v} not defined`), this.value = v.value;
    }
  }
  var a;
  (function(g) {
    g[g.Started = 0] = "Started", g[g.Completed = 1] = "Completed";
  })(a = e.UsedValueState || (e.UsedValueState = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class i {
    constructor({ prefixes: v, parent: b } = {}) {
      this._names = {}, this._prefixes = v, this._parent = b;
    }
    toName(v) {
      return v instanceof t.Name ? v : this.name(v);
    }
    name(v) {
      return new t.Name(this._newName(v));
    }
    _newName(v) {
      const b = this._names[v] || this._nameGroup(v);
      return `${v}${b.index++}`;
    }
    _nameGroup(v) {
      var b, S;
      if (!((S = (b = this._parent) === null || b === void 0 ? void 0 : b._prefixes) === null || S === void 0) && S.has(v) || this._prefixes && !this._prefixes.has(v))
        throw new Error(`CodeGen: prefix "${v}" is not allowed in this scope`);
      return this._names[v] = { prefix: v, index: 0 };
    }
  }
  e.Scope = i;
  class l extends t.Name {
    constructor(v, b) {
      super(b), this.prefix = v;
    }
    setValue(v, { property: b, itemIndex: S }) {
      this.value = v, this.scopePath = (0, t._)`.${new t.Name(b)}[${S}]`;
    }
  }
  e.ValueScopeName = l;
  const m = (0, t._)`\n`;
  class p extends i {
    constructor(v) {
      super(v), this._values = {}, this._scope = v.scope, this.opts = { ...v, _n: v.lines ? m : t.nil };
    }
    get() {
      return this._scope;
    }
    name(v) {
      return new l(v, this._newName(v));
    }
    value(v, b) {
      var S;
      if (b.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const I = this.toName(v), { prefix: M } = I, O = (S = b.key) !== null && S !== void 0 ? S : b.ref;
      let x = this._values[M];
      if (x) {
        const A = x.get(O);
        if (A)
          return A;
      } else
        x = this._values[M] = /* @__PURE__ */ new Map();
      x.set(O, I);
      const T = this._scope[M] || (this._scope[M] = []), k = T.length;
      return T[k] = b.ref, I.setValue(b, { property: M, itemIndex: k }), I;
    }
    getValue(v, b) {
      const S = this._values[v];
      if (S)
        return S.get(b);
    }
    scopeRefs(v, b = this._values) {
      return this._reduceValues(b, (S) => {
        if (S.scopePath === void 0)
          throw new Error(`CodeGen: name "${S}" has no value`);
        return (0, t._)`${v}${S.scopePath}`;
      });
    }
    scopeCode(v = this._values, b, S) {
      return this._reduceValues(v, (I) => {
        if (I.value === void 0)
          throw new Error(`CodeGen: name "${I}" has no value`);
        return I.value.code;
      }, b, S);
    }
    _reduceValues(v, b, S = {}, I) {
      let M = t.nil;
      for (const O in v) {
        const x = v[O];
        if (!x)
          continue;
        const T = S[O] = S[O] || /* @__PURE__ */ new Map();
        x.forEach((k) => {
          if (T.has(k))
            return;
          T.set(k, a.Started);
          let A = b(k);
          if (A) {
            const L = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            M = (0, t._)`${M}${L} ${k} = ${A};${this.opts._n}`;
          } else if (A = I == null ? void 0 : I(k))
            M = (0, t._)`${M}${A}${this.opts._n}`;
          else
            throw new n(k);
          T.set(k, a.Completed);
        });
      }
      return M;
    }
  }
  e.ValueScope = p;
})(Ar);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Gt, n = Ar;
  var a = Gt;
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
  var i = Ar;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return i.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return i.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return i.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return i.varKinds;
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
    optimizeNames(d, y) {
      return this;
    }
  }
  class m extends l {
    constructor(d, y, z) {
      super(), this.varKind = d, this.name = y, this.rhs = z;
    }
    render({ es5: d, _n: y }) {
      const z = d ? n.varKinds.var : this.varKind, J = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${z} ${this.name}${J};` + y;
    }
    optimizeNames(d, y) {
      if (d[this.name.str])
        return this.rhs && (this.rhs = D(this.rhs, d, y)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class p extends l {
    constructor(d, y, z) {
      super(), this.lhs = d, this.rhs = y, this.sideEffects = z;
    }
    render({ _n: d }) {
      return `${this.lhs} = ${this.rhs};` + d;
    }
    optimizeNames(d, y) {
      if (!(this.lhs instanceof t.Name && !d[this.lhs.str] && !this.sideEffects))
        return this.rhs = D(this.rhs, d, y), this;
    }
    get names() {
      const d = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return U(d, this.rhs);
    }
  }
  class g extends p {
    constructor(d, y, z, J) {
      super(d, z, J), this.op = y;
    }
    render({ _n: d }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + d;
    }
  }
  class v extends l {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `${this.label}:` + d;
    }
  }
  class b extends l {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `break${this.label ? ` ${this.label}` : ""};` + d;
    }
  }
  class S extends l {
    constructor(d) {
      super(), this.error = d;
    }
    render({ _n: d }) {
      return `throw ${this.error};` + d;
    }
    get names() {
      return this.error.names;
    }
  }
  class I extends l {
    constructor(d) {
      super(), this.code = d;
    }
    render({ _n: d }) {
      return `${this.code};` + d;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(d, y) {
      return this.code = D(this.code, d, y), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class M extends l {
    constructor(d = []) {
      super(), this.nodes = d;
    }
    render(d) {
      return this.nodes.reduce((y, z) => y + z.render(d), "");
    }
    optimizeNodes() {
      const { nodes: d } = this;
      let y = d.length;
      for (; y--; ) {
        const z = d[y].optimizeNodes();
        Array.isArray(z) ? d.splice(y, 1, ...z) : z ? d[y] = z : d.splice(y, 1);
      }
      return d.length > 0 ? this : void 0;
    }
    optimizeNames(d, y) {
      const { nodes: z } = this;
      let J = z.length;
      for (; J--; ) {
        const Y = z[J];
        Y.optimizeNames(d, y) || (W(d, Y.names), z.splice(J, 1));
      }
      return z.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((d, y) => F(d, y.names), {});
    }
  }
  class O extends M {
    render(d) {
      return "{" + d._n + super.render(d) + "}" + d._n;
    }
  }
  class x extends M {
  }
  class T extends O {
  }
  T.kind = "else";
  class k extends O {
    constructor(d, y) {
      super(y), this.condition = d;
    }
    render(d) {
      let y = `if(${this.condition})` + super.render(d);
      return this.else && (y += "else " + this.else.render(d)), y;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const d = this.condition;
      if (d === !0)
        return this.nodes;
      let y = this.else;
      if (y) {
        const z = y.optimizeNodes();
        y = this.else = Array.isArray(z) ? new T(z) : z;
      }
      if (y)
        return d === !1 ? y instanceof k ? y : y.nodes : this.nodes.length ? this : new k(w(d), y instanceof k ? [y] : y.nodes);
      if (!(d === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(d, y) {
      var z;
      if (this.else = (z = this.else) === null || z === void 0 ? void 0 : z.optimizeNames(d, y), !!(super.optimizeNames(d, y) || this.else))
        return this.condition = D(this.condition, d, y), this;
    }
    get names() {
      const d = super.names;
      return U(d, this.condition), this.else && F(d, this.else.names), d;
    }
  }
  k.kind = "if";
  class A extends O {
  }
  A.kind = "for";
  class L extends A {
    constructor(d) {
      super(), this.iteration = d;
    }
    render(d) {
      return `for(${this.iteration})` + super.render(d);
    }
    optimizeNames(d, y) {
      if (super.optimizeNames(d, y))
        return this.iteration = D(this.iteration, d, y), this;
    }
    get names() {
      return F(super.names, this.iteration.names);
    }
  }
  class r extends A {
    constructor(d, y, z, J) {
      super(), this.varKind = d, this.name = y, this.from = z, this.to = J;
    }
    render(d) {
      const y = d.es5 ? n.varKinds.var : this.varKind, { name: z, from: J, to: Y } = this;
      return `for(${y} ${z}=${J}; ${z}<${Y}; ${z}++)` + super.render(d);
    }
    get names() {
      const d = U(super.names, this.from);
      return U(d, this.to);
    }
  }
  class s extends A {
    constructor(d, y, z, J) {
      super(), this.loop = d, this.varKind = y, this.name = z, this.iterable = J;
    }
    render(d) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(d);
    }
    optimizeNames(d, y) {
      if (super.optimizeNames(d, y))
        return this.iterable = D(this.iterable, d, y), this;
    }
    get names() {
      return F(super.names, this.iterable.names);
    }
  }
  class o extends O {
    constructor(d, y, z) {
      super(), this.name = d, this.args = y, this.async = z;
    }
    render(d) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(d);
    }
  }
  o.kind = "func";
  class c extends M {
    render(d) {
      return "return " + super.render(d);
    }
  }
  c.kind = "return";
  class u extends O {
    render(d) {
      let y = "try" + super.render(d);
      return this.catch && (y += this.catch.render(d)), this.finally && (y += this.finally.render(d)), y;
    }
    optimizeNodes() {
      var d, y;
      return super.optimizeNodes(), (d = this.catch) === null || d === void 0 || d.optimizeNodes(), (y = this.finally) === null || y === void 0 || y.optimizeNodes(), this;
    }
    optimizeNames(d, y) {
      var z, J;
      return super.optimizeNames(d, y), (z = this.catch) === null || z === void 0 || z.optimizeNames(d, y), (J = this.finally) === null || J === void 0 || J.optimizeNames(d, y), this;
    }
    get names() {
      const d = super.names;
      return this.catch && F(d, this.catch.names), this.finally && F(d, this.finally.names), d;
    }
  }
  class _ extends O {
    constructor(d) {
      super(), this.error = d;
    }
    render(d) {
      return `catch(${this.error})` + super.render(d);
    }
  }
  _.kind = "catch";
  class f extends O {
    render(d) {
      return "finally" + super.render(d);
    }
  }
  f.kind = "finally";
  class j {
    constructor(d, y = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...y, _n: y.lines ? `
` : "" }, this._extScope = d, this._scope = new n.Scope({ parent: d }), this._nodes = [new x()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(d) {
      return this._scope.name(d);
    }
    // reserves unique name in the external scope
    scopeName(d) {
      return this._extScope.name(d);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(d, y) {
      const z = this._extScope.value(d, y);
      return (this._values[z.prefix] || (this._values[z.prefix] = /* @__PURE__ */ new Set())).add(z), z;
    }
    getScopeValue(d, y) {
      return this._extScope.getValue(d, y);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(d) {
      return this._extScope.scopeRefs(d, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(d, y, z, J) {
      const Y = this._scope.toName(y);
      return z !== void 0 && J && (this._constants[Y.str] = z), this._leafNode(new m(d, Y, z)), Y;
    }
    // `const` declaration (`var` in es5 mode)
    const(d, y, z) {
      return this._def(n.varKinds.const, d, y, z);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(d, y, z) {
      return this._def(n.varKinds.let, d, y, z);
    }
    // `var` declaration with optional assignment
    var(d, y, z) {
      return this._def(n.varKinds.var, d, y, z);
    }
    // assignment code
    assign(d, y, z) {
      return this._leafNode(new p(d, y, z));
    }
    // `+=` code
    add(d, y) {
      return this._leafNode(new g(d, e.operators.ADD, y));
    }
    // appends passed SafeExpr to code or executes Block
    code(d) {
      return typeof d == "function" ? d() : d !== t.nil && this._leafNode(new I(d)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...d) {
      const y = ["{"];
      for (const [z, J] of d)
        y.length > 1 && y.push(","), y.push(z), (z !== J || this.opts.es5) && (y.push(":"), (0, t.addCodeArg)(y, J));
      return y.push("}"), new t._Code(y);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(d, y, z) {
      if (this._blockNode(new k(d)), y && z)
        this.code(y).else().code(z).endIf();
      else if (y)
        this.code(y).endIf();
      else if (z)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(d) {
      return this._elseNode(new k(d));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new T());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(k, T);
    }
    _for(d, y) {
      return this._blockNode(d), y && this.code(y).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(d, y) {
      return this._for(new L(d), y);
    }
    // `for` statement for a range of values
    forRange(d, y, z, J, Y = this.opts.es5 ? n.varKinds.var : n.varKinds.let) {
      const se = this._scope.toName(d);
      return this._for(new r(Y, se, y, z), () => J(se));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(d, y, z, J = n.varKinds.const) {
      const Y = this._scope.toName(d);
      if (this.opts.es5) {
        const se = y instanceof t.Name ? y : this.var("_arr", y);
        return this.forRange("_i", 0, (0, t._)`${se}.length`, (ie) => {
          this.var(Y, (0, t._)`${se}[${ie}]`), z(Y);
        });
      }
      return this._for(new s("of", J, Y, y), () => z(Y));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(d, y, z, J = this.opts.es5 ? n.varKinds.var : n.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(d, (0, t._)`Object.keys(${y})`, z);
      const Y = this._scope.toName(d);
      return this._for(new s("in", J, Y, y), () => z(Y));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(A);
    }
    // `label` statement
    label(d) {
      return this._leafNode(new v(d));
    }
    // `break` statement
    break(d) {
      return this._leafNode(new b(d));
    }
    // `return` statement
    return(d) {
      const y = new c();
      if (this._blockNode(y), this.code(d), y.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(c);
    }
    // `try` statement
    try(d, y, z) {
      if (!y && !z)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const J = new u();
      if (this._blockNode(J), this.code(d), y) {
        const Y = this.name("e");
        this._currNode = J.catch = new _(Y), y(Y);
      }
      return z && (this._currNode = J.finally = new f(), this.code(z)), this._endBlockNode(_, f);
    }
    // `throw` statement
    throw(d) {
      return this._leafNode(new S(d));
    }
    // start self-balancing block
    block(d, y) {
      return this._blockStarts.push(this._nodes.length), d && this.code(d).endBlock(y), this;
    }
    // end the current self-balancing block
    endBlock(d) {
      const y = this._blockStarts.pop();
      if (y === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const z = this._nodes.length - y;
      if (z < 0 || d !== void 0 && z !== d)
        throw new Error(`CodeGen: wrong number of nodes: ${z} vs ${d} expected`);
      return this._nodes.length = y, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(d, y = t.nil, z, J) {
      return this._blockNode(new o(d, y, z)), J && this.code(J).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(o);
    }
    optimize(d = 1) {
      for (; d-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(d) {
      return this._currNode.nodes.push(d), this;
    }
    _blockNode(d) {
      this._currNode.nodes.push(d), this._nodes.push(d);
    }
    _endBlockNode(d, y) {
      const z = this._currNode;
      if (z instanceof d || y && z instanceof y)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${y ? `${d.kind}/${y.kind}` : d.kind}"`);
    }
    _elseNode(d) {
      const y = this._currNode;
      if (!(y instanceof k))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = y.else = d, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const d = this._nodes;
      return d[d.length - 1];
    }
    set _currNode(d) {
      const y = this._nodes;
      y[y.length - 1] = d;
    }
  }
  e.CodeGen = j;
  function F(N, d) {
    for (const y in d)
      N[y] = (N[y] || 0) + (d[y] || 0);
    return N;
  }
  function U(N, d) {
    return d instanceof t._CodeOrName ? F(N, d.names) : N;
  }
  function D(N, d, y) {
    if (N instanceof t.Name)
      return z(N);
    if (!J(N))
      return N;
    return new t._Code(N._items.reduce((Y, se) => (se instanceof t.Name && (se = z(se)), se instanceof t._Code ? Y.push(...se._items) : Y.push(se), Y), []));
    function z(Y) {
      const se = y[Y.str];
      return se === void 0 || d[Y.str] !== 1 ? Y : (delete d[Y.str], se);
    }
    function J(Y) {
      return Y instanceof t._Code && Y._items.some((se) => se instanceof t.Name && d[se.str] === 1 && y[se.str] !== void 0);
    }
  }
  function W(N, d) {
    for (const y in d)
      N[y] = (N[y] || 0) - (d[y] || 0);
  }
  function w(N) {
    return typeof N == "boolean" || typeof N == "number" || N === null ? !N : (0, t._)`!${H(N)}`;
  }
  e.not = w;
  const G = P(e.operators.AND);
  function Q(...N) {
    return N.reduce(G);
  }
  e.and = Q;
  const ee = P(e.operators.OR);
  function q(...N) {
    return N.reduce(ee);
  }
  e.or = q;
  function P(N) {
    return (d, y) => d === t.nil ? y : y === t.nil ? d : (0, t._)`${H(d)} ${N} ${H(y)}`;
  }
  function H(N) {
    return N instanceof t.Name ? N : (0, t._)`(${N})`;
  }
})(ue);
var he = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.checkStrictMode = e.getErrorPath = e.Type = e.useFunc = e.setEvaluated = e.evaluatedPropsToName = e.mergeEvaluated = e.eachItem = e.unescapeJsonPointer = e.escapeJsonPointer = e.escapeFragment = e.unescapeFragment = e.schemaRefOrVal = e.schemaHasRulesButRef = e.schemaHasRules = e.checkUnknownRules = e.alwaysValidSchema = e.toHash = void 0;
  const t = ue, n = Gt;
  function a(o) {
    const c = {};
    for (const u of o)
      c[u] = !0;
    return c;
  }
  e.toHash = a;
  function i(o, c) {
    return typeof c == "boolean" ? c : Object.keys(c).length === 0 ? !0 : (l(o, c), !m(c, o.self.RULES.all));
  }
  e.alwaysValidSchema = i;
  function l(o, c = o.schema) {
    const { opts: u, self: _ } = o;
    if (!u.strictSchema || typeof c == "boolean")
      return;
    const f = _.RULES.keywords;
    for (const j in c)
      f[j] || s(o, `unknown keyword: "${j}"`);
  }
  e.checkUnknownRules = l;
  function m(o, c) {
    if (typeof o == "boolean")
      return !o;
    for (const u in o)
      if (c[u])
        return !0;
    return !1;
  }
  e.schemaHasRules = m;
  function p(o, c) {
    if (typeof o == "boolean")
      return !o;
    for (const u in o)
      if (u !== "$ref" && c.all[u])
        return !0;
    return !1;
  }
  e.schemaHasRulesButRef = p;
  function g({ topSchemaRef: o, schemaPath: c }, u, _, f) {
    if (!f) {
      if (typeof u == "number" || typeof u == "boolean")
        return u;
      if (typeof u == "string")
        return (0, t._)`${u}`;
    }
    return (0, t._)`${o}${c}${(0, t.getProperty)(_)}`;
  }
  e.schemaRefOrVal = g;
  function v(o) {
    return I(decodeURIComponent(o));
  }
  e.unescapeFragment = v;
  function b(o) {
    return encodeURIComponent(S(o));
  }
  e.escapeFragment = b;
  function S(o) {
    return typeof o == "number" ? `${o}` : o.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  e.escapeJsonPointer = S;
  function I(o) {
    return o.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  e.unescapeJsonPointer = I;
  function M(o, c) {
    if (Array.isArray(o))
      for (const u of o)
        c(u);
    else
      c(o);
  }
  e.eachItem = M;
  function O({ mergeNames: o, mergeToName: c, mergeValues: u, resultToName: _ }) {
    return (f, j, F, U) => {
      const D = F === void 0 ? j : F instanceof t.Name ? (j instanceof t.Name ? o(f, j, F) : c(f, j, F), F) : j instanceof t.Name ? (c(f, F, j), j) : u(j, F);
      return U === t.Name && !(D instanceof t.Name) ? _(f, D) : D;
    };
  }
  e.mergeEvaluated = {
    props: O({
      mergeNames: (o, c, u) => o.if((0, t._)`${u} !== true && ${c} !== undefined`, () => {
        o.if((0, t._)`${c} === true`, () => o.assign(u, !0), () => o.assign(u, (0, t._)`${u} || {}`).code((0, t._)`Object.assign(${u}, ${c})`));
      }),
      mergeToName: (o, c, u) => o.if((0, t._)`${u} !== true`, () => {
        c === !0 ? o.assign(u, !0) : (o.assign(u, (0, t._)`${u} || {}`), T(o, u, c));
      }),
      mergeValues: (o, c) => o === !0 ? !0 : { ...o, ...c },
      resultToName: x
    }),
    items: O({
      mergeNames: (o, c, u) => o.if((0, t._)`${u} !== true && ${c} !== undefined`, () => o.assign(u, (0, t._)`${c} === true ? true : ${u} > ${c} ? ${u} : ${c}`)),
      mergeToName: (o, c, u) => o.if((0, t._)`${u} !== true`, () => o.assign(u, c === !0 ? !0 : (0, t._)`${u} > ${c} ? ${u} : ${c}`)),
      mergeValues: (o, c) => o === !0 ? !0 : Math.max(o, c),
      resultToName: (o, c) => o.var("items", c)
    })
  };
  function x(o, c) {
    if (c === !0)
      return o.var("props", !0);
    const u = o.var("props", (0, t._)`{}`);
    return c !== void 0 && T(o, u, c), u;
  }
  e.evaluatedPropsToName = x;
  function T(o, c, u) {
    Object.keys(u).forEach((_) => o.assign((0, t._)`${c}${(0, t.getProperty)(_)}`, !0));
  }
  e.setEvaluated = T;
  const k = {};
  function A(o, c) {
    return o.scopeValue("func", {
      ref: c,
      code: k[c.code] || (k[c.code] = new n._Code(c.code))
    });
  }
  e.useFunc = A;
  var L;
  (function(o) {
    o[o.Num = 0] = "Num", o[o.Str = 1] = "Str";
  })(L = e.Type || (e.Type = {}));
  function r(o, c, u) {
    if (o instanceof t.Name) {
      const _ = c === L.Num;
      return u ? _ ? (0, t._)`"[" + ${o} + "]"` : (0, t._)`"['" + ${o} + "']"` : _ ? (0, t._)`"/" + ${o}` : (0, t._)`"/" + ${o}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return u ? (0, t.getProperty)(o).toString() : "/" + S(o);
  }
  e.getErrorPath = r;
  function s(o, c, u = o.opts.strictSchema) {
    if (u) {
      if (c = `strict mode: ${c}`, u === !0)
        throw new Error(c);
      o.self.logger.warn(c);
    }
  }
  e.checkStrictMode = s;
})(he);
var nr = {}, Ra;
function ut() {
  if (Ra)
    return nr;
  Ra = 1, Object.defineProperty(nr, "__esModule", { value: !0 });
  const e = ue, t = {
    // validation function arguments
    data: new e.Name("data"),
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    errors: new e.Name("errors"),
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return nr.default = t, nr;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = ue, n = he, a = ut();
  e.keywordError = {
    message: ({ keyword: T }) => (0, t.str)`must pass "${T}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: T, schemaType: k }) => k ? (0, t.str)`"${T}" keyword must be ${k} ($data)` : (0, t.str)`"${T}" keyword is invalid ($data)`
  };
  function i(T, k = e.keywordError, A, L) {
    const { it: r } = T, { gen: s, compositeRule: o, allErrors: c } = r, u = S(T, k, A);
    L ?? (o || c) ? g(s, u) : v(r, (0, t._)`[${u}]`);
  }
  e.reportError = i;
  function l(T, k = e.keywordError, A) {
    const { it: L } = T, { gen: r, compositeRule: s, allErrors: o } = L, c = S(T, k, A);
    g(r, c), s || o || v(L, a.default.vErrors);
  }
  e.reportExtraError = l;
  function m(T, k) {
    T.assign(a.default.errors, k), T.if((0, t._)`${a.default.vErrors} !== null`, () => T.if(k, () => T.assign((0, t._)`${a.default.vErrors}.length`, k), () => T.assign(a.default.vErrors, null)));
  }
  e.resetErrorsCount = m;
  function p({ gen: T, keyword: k, schemaValue: A, data: L, errsCount: r, it: s }) {
    if (r === void 0)
      throw new Error("ajv implementation error");
    const o = T.name("err");
    T.forRange("i", r, a.default.errors, (c) => {
      T.const(o, (0, t._)`${a.default.vErrors}[${c}]`), T.if((0, t._)`${o}.instancePath === undefined`, () => T.assign((0, t._)`${o}.instancePath`, (0, t.strConcat)(a.default.instancePath, s.errorPath))), T.assign((0, t._)`${o}.schemaPath`, (0, t.str)`${s.errSchemaPath}/${k}`), s.opts.verbose && (T.assign((0, t._)`${o}.schema`, A), T.assign((0, t._)`${o}.data`, L));
    });
  }
  e.extendErrors = p;
  function g(T, k) {
    const A = T.const("err", k);
    T.if((0, t._)`${a.default.vErrors} === null`, () => T.assign(a.default.vErrors, (0, t._)`[${A}]`), (0, t._)`${a.default.vErrors}.push(${A})`), T.code((0, t._)`${a.default.errors}++`);
  }
  function v(T, k) {
    const { gen: A, validateName: L, schemaEnv: r } = T;
    r.$async ? A.throw((0, t._)`new ${T.ValidationError}(${k})`) : (A.assign((0, t._)`${L}.errors`, k), A.return(!1));
  }
  const b = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function S(T, k, A) {
    const { createErrors: L } = T.it;
    return L === !1 ? (0, t._)`{}` : I(T, k, A);
  }
  function I(T, k, A = {}) {
    const { gen: L, it: r } = T, s = [
      M(r, A),
      O(T, A)
    ];
    return x(T, k, s), L.object(...s);
  }
  function M({ errorPath: T }, { instancePath: k }) {
    const A = k ? (0, t.str)`${T}${(0, n.getErrorPath)(k, n.Type.Str)}` : T;
    return [a.default.instancePath, (0, t.strConcat)(a.default.instancePath, A)];
  }
  function O({ keyword: T, it: { errSchemaPath: k } }, { schemaPath: A, parentSchema: L }) {
    let r = L ? k : (0, t.str)`${k}/${T}`;
    return A && (r = (0, t.str)`${r}${(0, n.getErrorPath)(A, n.Type.Str)}`), [b.schemaPath, r];
  }
  function x(T, { params: k, message: A }, L) {
    const { keyword: r, data: s, schemaValue: o, it: c } = T, { opts: u, propertyName: _, topSchemaRef: f, schemaPath: j } = c;
    L.push([b.keyword, r], [b.params, typeof k == "function" ? k(T) : k || (0, t._)`{}`]), u.messages && L.push([b.message, typeof A == "function" ? A(T) : A]), u.verbose && L.push([b.schema, o], [b.parentSchema, (0, t._)`${f}${j}`], [a.default.data, s]), _ && L.push([b.propertyName, _]);
  }
})(Jt);
var La;
function po() {
  if (La)
    return gt;
  La = 1, Object.defineProperty(gt, "__esModule", { value: !0 }), gt.boolOrEmptySchema = gt.topBoolOrEmptySchema = void 0;
  const e = Jt, t = ue, n = ut(), a = {
    message: "boolean schema is false"
  };
  function i(p) {
    const { gen: g, schema: v, validateName: b } = p;
    v === !1 ? m(p, !1) : typeof v == "object" && v.$async === !0 ? g.return(n.default.data) : (g.assign((0, t._)`${b}.errors`, null), g.return(!0));
  }
  gt.topBoolOrEmptySchema = i;
  function l(p, g) {
    const { gen: v, schema: b } = p;
    b === !1 ? (v.var(g, !1), m(p)) : v.var(g, !0);
  }
  gt.boolOrEmptySchema = l;
  function m(p, g) {
    const { gen: v, data: b } = p, S = {
      gen: v,
      keyword: "false schema",
      data: b,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: p
    };
    (0, e.reportError)(S, a, void 0, g);
  }
  return gt;
}
var Wt = {}, yt = {};
Object.defineProperty(yt, "__esModule", { value: !0 });
yt.getRules = yt.isJSONType = void 0;
const fo = ["string", "number", "integer", "boolean", "null", "object", "array"], mo = new Set(fo);
function go(e) {
  return typeof e == "string" && mo.has(e);
}
yt.isJSONType = go;
function _o() {
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
yt.getRules = _o;
var at = {}, za;
function wn() {
  if (za)
    return at;
  za = 1, Object.defineProperty(at, "__esModule", { value: !0 }), at.shouldUseRule = at.shouldUseGroup = at.schemaHasRulesForType = void 0;
  function e({ schema: a, self: i }, l) {
    const m = i.RULES.types[l];
    return m && m !== !0 && t(a, m);
  }
  at.schemaHasRulesForType = e;
  function t(a, i) {
    return i.rules.some((l) => n(a, l));
  }
  at.shouldUseGroup = t;
  function n(a, i) {
    var l;
    return a[i.keyword] !== void 0 || ((l = i.definition.implements) === null || l === void 0 ? void 0 : l.some((m) => a[m] !== void 0));
  }
  return at.shouldUseRule = n, at;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.reportTypeError = e.checkDataTypes = e.checkDataType = e.coerceAndCheckDataType = e.getJSONTypes = e.getSchemaTypes = e.DataType = void 0;
  const t = yt, n = wn(), a = Jt, i = ue, l = he;
  var m;
  (function(L) {
    L[L.Correct = 0] = "Correct", L[L.Wrong = 1] = "Wrong";
  })(m = e.DataType || (e.DataType = {}));
  function p(L) {
    const r = g(L.type);
    if (r.includes("null")) {
      if (L.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!r.length && L.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      L.nullable === !0 && r.push("null");
    }
    return r;
  }
  e.getSchemaTypes = p;
  function g(L) {
    const r = Array.isArray(L) ? L : L ? [L] : [];
    if (r.every(t.isJSONType))
      return r;
    throw new Error("type must be JSONType or JSONType[]: " + r.join(","));
  }
  e.getJSONTypes = g;
  function v(L, r) {
    const { gen: s, data: o, opts: c } = L, u = S(r, c.coerceTypes), _ = r.length > 0 && !(u.length === 0 && r.length === 1 && (0, n.schemaHasRulesForType)(L, r[0]));
    if (_) {
      const f = x(r, o, c.strictNumbers, m.Wrong);
      s.if(f, () => {
        u.length ? I(L, r, u) : k(L);
      });
    }
    return _;
  }
  e.coerceAndCheckDataType = v;
  const b = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function S(L, r) {
    return r ? L.filter((s) => b.has(s) || r === "array" && s === "array") : [];
  }
  function I(L, r, s) {
    const { gen: o, data: c, opts: u } = L, _ = o.let("dataType", (0, i._)`typeof ${c}`), f = o.let("coerced", (0, i._)`undefined`);
    u.coerceTypes === "array" && o.if((0, i._)`${_} == 'object' && Array.isArray(${c}) && ${c}.length == 1`, () => o.assign(c, (0, i._)`${c}[0]`).assign(_, (0, i._)`typeof ${c}`).if(x(r, c, u.strictNumbers), () => o.assign(f, c))), o.if((0, i._)`${f} !== undefined`);
    for (const F of s)
      (b.has(F) || F === "array" && u.coerceTypes === "array") && j(F);
    o.else(), k(L), o.endIf(), o.if((0, i._)`${f} !== undefined`, () => {
      o.assign(c, f), M(L, f);
    });
    function j(F) {
      switch (F) {
        case "string":
          o.elseIf((0, i._)`${_} == "number" || ${_} == "boolean"`).assign(f, (0, i._)`"" + ${c}`).elseIf((0, i._)`${c} === null`).assign(f, (0, i._)`""`);
          return;
        case "number":
          o.elseIf((0, i._)`${_} == "boolean" || ${c} === null
              || (${_} == "string" && ${c} && ${c} == +${c})`).assign(f, (0, i._)`+${c}`);
          return;
        case "integer":
          o.elseIf((0, i._)`${_} === "boolean" || ${c} === null
              || (${_} === "string" && ${c} && ${c} == +${c} && !(${c} % 1))`).assign(f, (0, i._)`+${c}`);
          return;
        case "boolean":
          o.elseIf((0, i._)`${c} === "false" || ${c} === 0 || ${c} === null`).assign(f, !1).elseIf((0, i._)`${c} === "true" || ${c} === 1`).assign(f, !0);
          return;
        case "null":
          o.elseIf((0, i._)`${c} === "" || ${c} === 0 || ${c} === false`), o.assign(f, null);
          return;
        case "array":
          o.elseIf((0, i._)`${_} === "string" || ${_} === "number"
              || ${_} === "boolean" || ${c} === null`).assign(f, (0, i._)`[${c}]`);
      }
    }
  }
  function M({ gen: L, parentData: r, parentDataProperty: s }, o) {
    L.if((0, i._)`${r} !== undefined`, () => L.assign((0, i._)`${r}[${s}]`, o));
  }
  function O(L, r, s, o = m.Correct) {
    const c = o === m.Correct ? i.operators.EQ : i.operators.NEQ;
    let u;
    switch (L) {
      case "null":
        return (0, i._)`${r} ${c} null`;
      case "array":
        u = (0, i._)`Array.isArray(${r})`;
        break;
      case "object":
        u = (0, i._)`${r} && typeof ${r} == "object" && !Array.isArray(${r})`;
        break;
      case "integer":
        u = _((0, i._)`!(${r} % 1) && !isNaN(${r})`);
        break;
      case "number":
        u = _();
        break;
      default:
        return (0, i._)`typeof ${r} ${c} ${L}`;
    }
    return o === m.Correct ? u : (0, i.not)(u);
    function _(f = i.nil) {
      return (0, i.and)((0, i._)`typeof ${r} == "number"`, f, s ? (0, i._)`isFinite(${r})` : i.nil);
    }
  }
  e.checkDataType = O;
  function x(L, r, s, o) {
    if (L.length === 1)
      return O(L[0], r, s, o);
    let c;
    const u = (0, l.toHash)(L);
    if (u.array && u.object) {
      const _ = (0, i._)`typeof ${r} != "object"`;
      c = u.null ? _ : (0, i._)`!${r} || ${_}`, delete u.null, delete u.array, delete u.object;
    } else
      c = i.nil;
    u.number && delete u.integer;
    for (const _ in u)
      c = (0, i.and)(c, O(_, r, s, o));
    return c;
  }
  e.checkDataTypes = x;
  const T = {
    message: ({ schema: L }) => `must be ${L}`,
    params: ({ schema: L, schemaValue: r }) => typeof L == "string" ? (0, i._)`{type: ${L}}` : (0, i._)`{type: ${r}}`
  };
  function k(L) {
    const r = A(L);
    (0, a.reportError)(r, T);
  }
  e.reportTypeError = k;
  function A(L) {
    const { gen: r, data: s, schema: o } = L, c = (0, l.schemaRefOrVal)(L, o, "type");
    return {
      gen: r,
      keyword: "type",
      data: s,
      schema: o.type,
      schemaCode: c,
      schemaValue: c,
      parentSchema: o,
      params: {},
      it: L
    };
  }
})(Wt);
var Dt = {}, Da;
function bo() {
  if (Da)
    return Dt;
  Da = 1, Object.defineProperty(Dt, "__esModule", { value: !0 }), Dt.assignDefaults = void 0;
  const e = ue, t = he;
  function n(i, l) {
    const { properties: m, items: p } = i.schema;
    if (l === "object" && m)
      for (const g in m)
        a(i, g, m[g].default);
    else
      l === "array" && Array.isArray(p) && p.forEach((g, v) => a(i, v, g.default));
  }
  Dt.assignDefaults = n;
  function a(i, l, m) {
    const { gen: p, compositeRule: g, data: v, opts: b } = i;
    if (m === void 0)
      return;
    const S = (0, e._)`${v}${(0, e.getProperty)(l)}`;
    if (g) {
      (0, t.checkStrictMode)(i, `default is ignored for: ${S}`);
      return;
    }
    let I = (0, e._)`${S} === undefined`;
    b.useDefaults === "empty" && (I = (0, e._)`${I} || ${S} === null || ${S} === ""`), p.if(I, (0, e._)`${S} = ${(0, e.stringify)(m)}`);
  }
  return Dt;
}
var Ke = {}, le = {};
Object.defineProperty(le, "__esModule", { value: !0 });
le.validateUnion = le.validateArray = le.usePattern = le.callValidateCode = le.schemaProperties = le.allSchemaProperties = le.noPropertyInData = le.propertyInData = le.isOwnProperty = le.hasPropFunc = le.reportMissingProp = le.checkMissingProp = le.checkReportMissingProp = void 0;
const we = ue, Dr = he, ot = ut(), wo = he;
function vo(e, t) {
  const { gen: n, data: a, it: i } = e;
  n.if(Br(n, a, t, i.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, we._)`${t}` }, !0), e.error();
  });
}
le.checkReportMissingProp = vo;
function yo({ gen: e, data: t, it: { opts: n } }, a, i) {
  return (0, we.or)(...a.map((l) => (0, we.and)(Br(e, t, l, n.ownProperties), (0, we._)`${i} = ${l}`)));
}
le.checkMissingProp = yo;
function $o(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
le.reportMissingProp = $o;
function vn(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, we._)`Object.prototype.hasOwnProperty`
  });
}
le.hasPropFunc = vn;
function Vr(e, t, n) {
  return (0, we._)`${vn(e)}.call(${t}, ${n})`;
}
le.isOwnProperty = Vr;
function ko(e, t, n, a) {
  const i = (0, we._)`${t}${(0, we.getProperty)(n)} !== undefined`;
  return a ? (0, we._)`${i} && ${Vr(e, t, n)}` : i;
}
le.propertyInData = ko;
function Br(e, t, n, a) {
  const i = (0, we._)`${t}${(0, we.getProperty)(n)} === undefined`;
  return a ? (0, we.or)(i, (0, we.not)(Vr(e, t, n))) : i;
}
le.noPropertyInData = Br;
function yn(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
le.allSchemaProperties = yn;
function Po(e, t) {
  return yn(t).filter((n) => !(0, Dr.alwaysValidSchema)(e, t[n]));
}
le.schemaProperties = Po;
function Eo({ schemaCode: e, data: t, it: { gen: n, topSchemaRef: a, schemaPath: i, errorPath: l }, it: m }, p, g, v) {
  const b = v ? (0, we._)`${e}, ${t}, ${a}${i}` : t, S = [
    [ot.default.instancePath, (0, we.strConcat)(ot.default.instancePath, l)],
    [ot.default.parentData, m.parentData],
    [ot.default.parentDataProperty, m.parentDataProperty],
    [ot.default.rootData, ot.default.rootData]
  ];
  m.opts.dynamicRef && S.push([ot.default.dynamicAnchors, ot.default.dynamicAnchors]);
  const I = (0, we._)`${b}, ${n.object(...S)}`;
  return g !== we.nil ? (0, we._)`${p}.call(${g}, ${I})` : (0, we._)`${p}(${I})`;
}
le.callValidateCode = Eo;
const So = (0, we._)`new RegExp`;
function jo({ gen: e, it: { opts: t } }, n) {
  const a = t.unicodeRegExp ? "u" : "", { regExp: i } = t.code, l = i(n, a);
  return e.scopeValue("pattern", {
    key: l.toString(),
    ref: l,
    code: (0, we._)`${i.code === "new RegExp" ? So : (0, wo.useFunc)(e, i)}(${n}, ${a})`
  });
}
le.usePattern = jo;
function xo(e) {
  const { gen: t, data: n, keyword: a, it: i } = e, l = t.name("valid");
  if (i.allErrors) {
    const p = t.let("valid", !0);
    return m(() => t.assign(p, !1)), p;
  }
  return t.var(l, !0), m(() => t.break()), l;
  function m(p) {
    const g = t.const("len", (0, we._)`${n}.length`);
    t.forRange("i", 0, g, (v) => {
      e.subschema({
        keyword: a,
        dataProp: v,
        dataPropType: Dr.Type.Num
      }, l), t.if((0, we.not)(l), p);
    });
  }
}
le.validateArray = xo;
function To(e) {
  const { gen: t, schema: n, keyword: a, it: i } = e;
  if (!Array.isArray(n))
    throw new Error("ajv implementation error");
  if (n.some((p) => (0, Dr.alwaysValidSchema)(i, p)) && !i.opts.unevaluated)
    return;
  const l = t.let("valid", !1), m = t.name("_valid");
  t.block(() => n.forEach((p, g) => {
    const v = e.subschema({
      keyword: a,
      schemaProp: g,
      compositeRule: !0
    }, m);
    t.assign(l, (0, we._)`${l} || ${m}`), e.mergeValidEvaluated(v, m) || t.if((0, we.not)(l));
  })), e.result(l, () => e.reset(), () => e.error(!0));
}
le.validateUnion = To;
var Va;
function Co() {
  if (Va)
    return Ke;
  Va = 1, Object.defineProperty(Ke, "__esModule", { value: !0 }), Ke.validateKeywordUsage = Ke.validSchemaType = Ke.funcKeywordCode = Ke.macroKeywordCode = void 0;
  const e = ue, t = ut(), n = le, a = Jt;
  function i(I, M) {
    const { gen: O, keyword: x, schema: T, parentSchema: k, it: A } = I, L = M.macro.call(A.self, T, k, A), r = v(O, x, L);
    A.opts.validateSchema !== !1 && A.self.validateSchema(L, !0);
    const s = O.name("valid");
    I.subschema({
      schema: L,
      schemaPath: e.nil,
      errSchemaPath: `${A.errSchemaPath}/${x}`,
      topSchemaRef: r,
      compositeRule: !0
    }, s), I.pass(s, () => I.error(!0));
  }
  Ke.macroKeywordCode = i;
  function l(I, M) {
    var O;
    const { gen: x, keyword: T, schema: k, parentSchema: A, $data: L, it: r } = I;
    g(r, M);
    const s = !L && M.compile ? M.compile.call(r.self, k, A, r) : M.validate, o = v(x, T, s), c = x.let("valid");
    I.block$data(c, u), I.ok((O = M.valid) !== null && O !== void 0 ? O : c);
    function u() {
      if (M.errors === !1)
        j(), M.modifying && m(I), F(() => I.error());
      else {
        const U = M.async ? _() : f();
        M.modifying && m(I), F(() => p(I, U));
      }
    }
    function _() {
      const U = x.let("ruleErrs", null);
      return x.try(() => j((0, e._)`await `), (D) => x.assign(c, !1).if((0, e._)`${D} instanceof ${r.ValidationError}`, () => x.assign(U, (0, e._)`${D}.errors`), () => x.throw(D))), U;
    }
    function f() {
      const U = (0, e._)`${o}.errors`;
      return x.assign(U, null), j(e.nil), U;
    }
    function j(U = M.async ? (0, e._)`await ` : e.nil) {
      const D = r.opts.passContext ? t.default.this : t.default.self, W = !("compile" in M && !L || M.schema === !1);
      x.assign(c, (0, e._)`${U}${(0, n.callValidateCode)(I, o, D, W)}`, M.modifying);
    }
    function F(U) {
      var D;
      x.if((0, e.not)((D = M.valid) !== null && D !== void 0 ? D : c), U);
    }
  }
  Ke.funcKeywordCode = l;
  function m(I) {
    const { gen: M, data: O, it: x } = I;
    M.if(x.parentData, () => M.assign(O, (0, e._)`${x.parentData}[${x.parentDataProperty}]`));
  }
  function p(I, M) {
    const { gen: O } = I;
    O.if((0, e._)`Array.isArray(${M})`, () => {
      O.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${M} : ${t.default.vErrors}.concat(${M})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, a.extendErrors)(I);
    }, () => I.error());
  }
  function g({ schemaEnv: I }, M) {
    if (M.async && !I.$async)
      throw new Error("async keyword in sync schema");
  }
  function v(I, M, O) {
    if (O === void 0)
      throw new Error(`keyword "${M}" failed to compile`);
    return I.scopeValue("keyword", typeof O == "function" ? { ref: O } : { ref: O, code: (0, e.stringify)(O) });
  }
  function b(I, M, O = !1) {
    return !M.length || M.some((x) => x === "array" ? Array.isArray(I) : x === "object" ? I && typeof I == "object" && !Array.isArray(I) : typeof I == x || O && typeof I > "u");
  }
  Ke.validSchemaType = b;
  function S({ schema: I, opts: M, self: O, errSchemaPath: x }, T, k) {
    if (Array.isArray(T.keyword) ? !T.keyword.includes(k) : T.keyword !== k)
      throw new Error("ajv implementation error");
    const A = T.dependencies;
    if (A != null && A.some((L) => !Object.prototype.hasOwnProperty.call(I, L)))
      throw new Error(`parent schema must have dependencies of ${k}: ${A.join(",")}`);
    if (T.validateSchema && !T.validateSchema(I[k])) {
      const L = `keyword "${k}" value is invalid at path "${x}": ` + O.errorsText(T.validateSchema.errors);
      if (M.validateSchema === "log")
        O.logger.error(L);
      else
        throw new Error(L);
    }
  }
  return Ke.validateKeywordUsage = S, Ke;
}
var nt = {}, Ba;
function Oo() {
  if (Ba)
    return nt;
  Ba = 1, Object.defineProperty(nt, "__esModule", { value: !0 }), nt.extendSubschemaMode = nt.extendSubschemaData = nt.getSubschema = void 0;
  const e = ue, t = he;
  function n(l, { keyword: m, schemaProp: p, schema: g, schemaPath: v, errSchemaPath: b, topSchemaRef: S }) {
    if (m !== void 0 && g !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (m !== void 0) {
      const I = l.schema[m];
      return p === void 0 ? {
        schema: I,
        schemaPath: (0, e._)`${l.schemaPath}${(0, e.getProperty)(m)}`,
        errSchemaPath: `${l.errSchemaPath}/${m}`
      } : {
        schema: I[p],
        schemaPath: (0, e._)`${l.schemaPath}${(0, e.getProperty)(m)}${(0, e.getProperty)(p)}`,
        errSchemaPath: `${l.errSchemaPath}/${m}/${(0, t.escapeFragment)(p)}`
      };
    }
    if (g !== void 0) {
      if (v === void 0 || b === void 0 || S === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: g,
        schemaPath: v,
        topSchemaRef: S,
        errSchemaPath: b
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  nt.getSubschema = n;
  function a(l, m, { dataProp: p, dataPropType: g, data: v, dataTypes: b, propertyName: S }) {
    if (v !== void 0 && p !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: I } = m;
    if (p !== void 0) {
      const { errorPath: O, dataPathArr: x, opts: T } = m, k = I.let("data", (0, e._)`${m.data}${(0, e.getProperty)(p)}`, !0);
      M(k), l.errorPath = (0, e.str)`${O}${(0, t.getErrorPath)(p, g, T.jsPropertySyntax)}`, l.parentDataProperty = (0, e._)`${p}`, l.dataPathArr = [...x, l.parentDataProperty];
    }
    if (v !== void 0) {
      const O = v instanceof e.Name ? v : I.let("data", v, !0);
      M(O), S !== void 0 && (l.propertyName = S);
    }
    b && (l.dataTypes = b);
    function M(O) {
      l.data = O, l.dataLevel = m.dataLevel + 1, l.dataTypes = [], m.definedProperties = /* @__PURE__ */ new Set(), l.parentData = m.data, l.dataNames = [...m.dataNames, O];
    }
  }
  nt.extendSubschemaData = a;
  function i(l, { jtdDiscriminator: m, jtdMetadata: p, compositeRule: g, createErrors: v, allErrors: b }) {
    g !== void 0 && (l.compositeRule = g), v !== void 0 && (l.createErrors = v), b !== void 0 && (l.allErrors = b), l.jtdDiscriminator = m, l.jtdMetadata = p;
  }
  return nt.extendSubschemaMode = i, nt;
}
var Ae = {}, $n = function e(t, n) {
  if (t === n)
    return !0;
  if (t && n && typeof t == "object" && typeof n == "object") {
    if (t.constructor !== n.constructor)
      return !1;
    var a, i, l;
    if (Array.isArray(t)) {
      if (a = t.length, a != n.length)
        return !1;
      for (i = a; i-- !== 0; )
        if (!e(t[i], n[i]))
          return !1;
      return !0;
    }
    if (t.constructor === RegExp)
      return t.source === n.source && t.flags === n.flags;
    if (t.valueOf !== Object.prototype.valueOf)
      return t.valueOf() === n.valueOf();
    if (t.toString !== Object.prototype.toString)
      return t.toString() === n.toString();
    if (l = Object.keys(t), a = l.length, a !== Object.keys(n).length)
      return !1;
    for (i = a; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(n, l[i]))
        return !1;
    for (i = a; i-- !== 0; ) {
      var m = l[i];
      if (!e(t[m], n[m]))
        return !1;
    }
    return !0;
  }
  return t !== t && n !== n;
}, kn = { exports: {} }, lt = kn.exports = function(e, t, n) {
  typeof t == "function" && (n = t, t = {}), n = t.cb || n;
  var a = typeof n == "function" ? n : n.pre || function() {
  }, i = n.post || function() {
  };
  dr(t, a, i, e, "", e);
};
lt.keywords = {
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
lt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
lt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
lt.skipKeywords = {
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
function dr(e, t, n, a, i, l, m, p, g, v) {
  if (a && typeof a == "object" && !Array.isArray(a)) {
    t(a, i, l, m, p, g, v);
    for (var b in a) {
      var S = a[b];
      if (Array.isArray(S)) {
        if (b in lt.arrayKeywords)
          for (var I = 0; I < S.length; I++)
            dr(e, t, n, S[I], i + "/" + b + "/" + I, l, i, b, a, I);
      } else if (b in lt.propsKeywords) {
        if (S && typeof S == "object")
          for (var M in S)
            dr(e, t, n, S[M], i + "/" + b + "/" + Ao(M), l, i, b, a, M);
      } else
        (b in lt.keywords || e.allKeys && !(b in lt.skipKeywords)) && dr(e, t, n, S, i + "/" + b, l, i, b, a);
    }
    n(a, i, l, m, p, g, v);
  }
}
function Ao(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Io = kn.exports;
Object.defineProperty(Ae, "__esModule", { value: !0 });
Ae.getSchemaRefs = Ae.resolveUrl = Ae.normalizeId = Ae._getFullPath = Ae.getFullPath = Ae.inlineRef = void 0;
const No = he, Mo = $n, Ro = Io, Lo = /* @__PURE__ */ new Set([
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
function zo(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Ir(e) : t ? Pn(e) <= t : !1;
}
Ae.inlineRef = zo;
const Do = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Ir(e) {
  for (const t in e) {
    if (Do.has(t))
      return !0;
    const n = e[t];
    if (Array.isArray(n) && n.some(Ir) || typeof n == "object" && Ir(n))
      return !0;
  }
  return !1;
}
function Pn(e) {
  let t = 0;
  for (const n in e)
    if (n === "$ref" || (t++, !Lo.has(n) && (typeof e[n] == "object" && (0, No.eachItem)(e[n], (a) => t += Pn(a)), t === 1 / 0)))
      return 1 / 0;
  return t;
}
function En(e, t = "", n) {
  n !== !1 && (t = Ct(t));
  const a = e.parse(t);
  return Sn(e, a);
}
Ae.getFullPath = En;
function Sn(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ae._getFullPath = Sn;
const Vo = /#\/?$/;
function Ct(e) {
  return e ? e.replace(Vo, "") : "";
}
Ae.normalizeId = Ct;
function Bo(e, t, n) {
  return n = Ct(n), e.resolve(t, n);
}
Ae.resolveUrl = Bo;
const Fo = /^[a-z_][-a-z0-9._]*$/i;
function Uo(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: n, uriResolver: a } = this.opts, i = Ct(e[n] || t), l = { "": i }, m = En(a, i, !1), p = {}, g = /* @__PURE__ */ new Set();
  return Ro(e, { allKeys: !0 }, (S, I, M, O) => {
    if (O === void 0)
      return;
    const x = m + I;
    let T = l[O];
    typeof S[n] == "string" && (T = k.call(this, S[n])), A.call(this, S.$anchor), A.call(this, S.$dynamicAnchor), l[I] = T;
    function k(L) {
      const r = this.opts.uriResolver.resolve;
      if (L = Ct(T ? r(T, L) : L), g.has(L))
        throw b(L);
      g.add(L);
      let s = this.refs[L];
      return typeof s == "string" && (s = this.refs[s]), typeof s == "object" ? v(S, s.schema, L) : L !== Ct(x) && (L[0] === "#" ? (v(S, p[L], L), p[L] = S) : this.refs[L] = x), L;
    }
    function A(L) {
      if (typeof L == "string") {
        if (!Fo.test(L))
          throw new Error(`invalid anchor "${L}"`);
        k.call(this, `#${L}`);
      }
    }
  }), p;
  function v(S, I, M) {
    if (I !== void 0 && !Mo(S, I))
      throw b(M);
  }
  function b(S) {
    return new Error(`reference "${S}" resolves to more than one schema`);
  }
}
Ae.getSchemaRefs = Uo;
var Fa;
function yr() {
  if (Fa)
    return rt;
  Fa = 1, Object.defineProperty(rt, "__esModule", { value: !0 }), rt.getData = rt.KeywordCxt = rt.validateFunctionCode = void 0;
  const e = po(), t = Wt, n = wn(), a = Wt, i = bo(), l = Co(), m = Oo(), p = ue, g = ut(), v = Ae, b = he, S = Jt;
  function I(C) {
    if (s(C) && (c(C), r(C))) {
      T(C);
      return;
    }
    M(C, () => (0, e.topBoolOrEmptySchema)(C));
  }
  rt.validateFunctionCode = I;
  function M({ gen: C, validateName: R, schema: K, schemaEnv: Z, opts: te }, ne) {
    te.code.es5 ? C.func(R, (0, p._)`${g.default.data}, ${g.default.valCxt}`, Z.$async, () => {
      C.code((0, p._)`"use strict"; ${A(K, te)}`), x(C, te), C.code(ne);
    }) : C.func(R, (0, p._)`${g.default.data}, ${O(te)}`, Z.$async, () => C.code(A(K, te)).code(ne));
  }
  function O(C) {
    return (0, p._)`{${g.default.instancePath}="", ${g.default.parentData}, ${g.default.parentDataProperty}, ${g.default.rootData}=${g.default.data}${C.dynamicRef ? (0, p._)`, ${g.default.dynamicAnchors}={}` : p.nil}}={}`;
  }
  function x(C, R) {
    C.if(g.default.valCxt, () => {
      C.var(g.default.instancePath, (0, p._)`${g.default.valCxt}.${g.default.instancePath}`), C.var(g.default.parentData, (0, p._)`${g.default.valCxt}.${g.default.parentData}`), C.var(g.default.parentDataProperty, (0, p._)`${g.default.valCxt}.${g.default.parentDataProperty}`), C.var(g.default.rootData, (0, p._)`${g.default.valCxt}.${g.default.rootData}`), R.dynamicRef && C.var(g.default.dynamicAnchors, (0, p._)`${g.default.valCxt}.${g.default.dynamicAnchors}`);
    }, () => {
      C.var(g.default.instancePath, (0, p._)`""`), C.var(g.default.parentData, (0, p._)`undefined`), C.var(g.default.parentDataProperty, (0, p._)`undefined`), C.var(g.default.rootData, g.default.data), R.dynamicRef && C.var(g.default.dynamicAnchors, (0, p._)`{}`);
    });
  }
  function T(C) {
    const { schema: R, opts: K, gen: Z } = C;
    M(C, () => {
      K.$comment && R.$comment && U(C), f(C), Z.let(g.default.vErrors, null), Z.let(g.default.errors, 0), K.unevaluated && k(C), u(C), D(C);
    });
  }
  function k(C) {
    const { gen: R, validateName: K } = C;
    C.evaluated = R.const("evaluated", (0, p._)`${K}.evaluated`), R.if((0, p._)`${C.evaluated}.dynamicProps`, () => R.assign((0, p._)`${C.evaluated}.props`, (0, p._)`undefined`)), R.if((0, p._)`${C.evaluated}.dynamicItems`, () => R.assign((0, p._)`${C.evaluated}.items`, (0, p._)`undefined`));
  }
  function A(C, R) {
    const K = typeof C == "object" && C[R.schemaId];
    return K && (R.code.source || R.code.process) ? (0, p._)`/*# sourceURL=${K} */` : p.nil;
  }
  function L(C, R) {
    if (s(C) && (c(C), r(C))) {
      o(C, R);
      return;
    }
    (0, e.boolOrEmptySchema)(C, R);
  }
  function r({ schema: C, self: R }) {
    if (typeof C == "boolean")
      return !C;
    for (const K in C)
      if (R.RULES.all[K])
        return !0;
    return !1;
  }
  function s(C) {
    return typeof C.schema != "boolean";
  }
  function o(C, R) {
    const { schema: K, gen: Z, opts: te } = C;
    te.$comment && K.$comment && U(C), j(C), F(C);
    const ne = Z.const("_errs", g.default.errors);
    u(C, ne), Z.var(R, (0, p._)`${ne} === ${g.default.errors}`);
  }
  function c(C) {
    (0, b.checkUnknownRules)(C), _(C);
  }
  function u(C, R) {
    if (C.opts.jtd)
      return w(C, [], !1, R);
    const K = (0, t.getSchemaTypes)(C.schema), Z = (0, t.coerceAndCheckDataType)(C, K);
    w(C, K, !Z, R);
  }
  function _(C) {
    const { schema: R, errSchemaPath: K, opts: Z, self: te } = C;
    R.$ref && Z.ignoreKeywordsWithRef && (0, b.schemaHasRulesButRef)(R, te.RULES) && te.logger.warn(`$ref: keywords ignored in schema at path "${K}"`);
  }
  function f(C) {
    const { schema: R, opts: K } = C;
    R.default !== void 0 && K.useDefaults && K.strictSchema && (0, b.checkStrictMode)(C, "default is ignored in the schema root");
  }
  function j(C) {
    const R = C.schema[C.opts.schemaId];
    R && (C.baseId = (0, v.resolveUrl)(C.opts.uriResolver, C.baseId, R));
  }
  function F(C) {
    if (C.schema.$async && !C.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function U({ gen: C, schemaEnv: R, schema: K, errSchemaPath: Z, opts: te }) {
    const ne = K.$comment;
    if (te.$comment === !0)
      C.code((0, p._)`${g.default.self}.logger.log(${ne})`);
    else if (typeof te.$comment == "function") {
      const Ee = (0, p.str)`${Z}/$comment`, Ne = C.scopeValue("root", { ref: R.root });
      C.code((0, p._)`${g.default.self}.opts.$comment(${ne}, ${Ee}, ${Ne}.schema)`);
    }
  }
  function D(C) {
    const { gen: R, schemaEnv: K, validateName: Z, ValidationError: te, opts: ne } = C;
    K.$async ? R.if((0, p._)`${g.default.errors} === 0`, () => R.return(g.default.data), () => R.throw((0, p._)`new ${te}(${g.default.vErrors})`)) : (R.assign((0, p._)`${Z}.errors`, g.default.vErrors), ne.unevaluated && W(C), R.return((0, p._)`${g.default.errors} === 0`));
  }
  function W({ gen: C, evaluated: R, props: K, items: Z }) {
    K instanceof p.Name && C.assign((0, p._)`${R}.props`, K), Z instanceof p.Name && C.assign((0, p._)`${R}.items`, Z);
  }
  function w(C, R, K, Z) {
    const { gen: te, schema: ne, data: Ee, allErrors: Ne, opts: Te, self: Ce } = C, { RULES: Se } = Ce;
    if (ne.$ref && (Te.ignoreKeywordsWithRef || !(0, b.schemaHasRulesButRef)(ne, Se))) {
      te.block(() => J(C, "$ref", Se.all.$ref.definition));
      return;
    }
    Te.jtd || Q(C, R), te.block(() => {
      for (const ve of Se.rules)
        ze(ve);
      ze(Se.post);
    });
    function ze(ve) {
      (0, n.shouldUseGroup)(ne, ve) && (ve.type ? (te.if((0, a.checkDataType)(ve.type, Ee, Te.strictNumbers)), G(C, ve), R.length === 1 && R[0] === ve.type && K && (te.else(), (0, a.reportTypeError)(C)), te.endIf()) : G(C, ve), Ne || te.if((0, p._)`${g.default.errors} === ${Z || 0}`));
    }
  }
  function G(C, R) {
    const { gen: K, schema: Z, opts: { useDefaults: te } } = C;
    te && (0, i.assignDefaults)(C, R.type), K.block(() => {
      for (const ne of R.rules)
        (0, n.shouldUseRule)(Z, ne) && J(C, ne.keyword, ne.definition, R.type);
    });
  }
  function Q(C, R) {
    C.schemaEnv.meta || !C.opts.strictTypes || (ee(C, R), C.opts.allowUnionTypes || q(C, R), P(C, C.dataTypes));
  }
  function ee(C, R) {
    if (R.length) {
      if (!C.dataTypes.length) {
        C.dataTypes = R;
        return;
      }
      R.forEach((K) => {
        N(C.dataTypes, K) || y(C, `type "${K}" not allowed by context "${C.dataTypes.join(",")}"`);
      }), d(C, R);
    }
  }
  function q(C, R) {
    R.length > 1 && !(R.length === 2 && R.includes("null")) && y(C, "use allowUnionTypes to allow union type keyword");
  }
  function P(C, R) {
    const K = C.self.RULES.all;
    for (const Z in K) {
      const te = K[Z];
      if (typeof te == "object" && (0, n.shouldUseRule)(C.schema, te)) {
        const { type: ne } = te.definition;
        ne.length && !ne.some((Ee) => H(R, Ee)) && y(C, `missing type "${ne.join(",")}" for keyword "${Z}"`);
      }
    }
  }
  function H(C, R) {
    return C.includes(R) || R === "number" && C.includes("integer");
  }
  function N(C, R) {
    return C.includes(R) || R === "integer" && C.includes("number");
  }
  function d(C, R) {
    const K = [];
    for (const Z of C.dataTypes)
      N(R, Z) ? K.push(Z) : R.includes("integer") && Z === "number" && K.push("integer");
    C.dataTypes = K;
  }
  function y(C, R) {
    const K = C.schemaEnv.baseId + C.errSchemaPath;
    R += ` at "${K}" (strictTypes)`, (0, b.checkStrictMode)(C, R, C.opts.strictTypes);
  }
  class z {
    constructor(R, K, Z) {
      if ((0, l.validateKeywordUsage)(R, K, Z), this.gen = R.gen, this.allErrors = R.allErrors, this.keyword = Z, this.data = R.data, this.schema = R.schema[Z], this.$data = K.$data && R.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, b.schemaRefOrVal)(R, this.schema, Z, this.$data), this.schemaType = K.schemaType, this.parentSchema = R.schema, this.params = {}, this.it = R, this.def = K, this.$data)
        this.schemaCode = R.gen.const("vSchema", ie(this.$data, R));
      else if (this.schemaCode = this.schemaValue, !(0, l.validSchemaType)(this.schema, K.schemaType, K.allowUndefined))
        throw new Error(`${Z} value must be ${JSON.stringify(K.schemaType)}`);
      ("code" in K ? K.trackErrors : K.errors !== !1) && (this.errsCount = R.gen.const("_errs", g.default.errors));
    }
    result(R, K, Z) {
      this.failResult((0, p.not)(R), K, Z);
    }
    failResult(R, K, Z) {
      this.gen.if(R), Z ? Z() : this.error(), K ? (this.gen.else(), K(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(R, K) {
      this.failResult((0, p.not)(R), void 0, K);
    }
    fail(R) {
      if (R === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(R), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(R) {
      if (!this.$data)
        return this.fail(R);
      const { schemaCode: K } = this;
      this.fail((0, p._)`${K} !== undefined && (${(0, p.or)(this.invalid$data(), R)})`);
    }
    error(R, K, Z) {
      if (K) {
        this.setParams(K), this._error(R, Z), this.setParams({});
        return;
      }
      this._error(R, Z);
    }
    _error(R, K) {
      (R ? S.reportExtraError : S.reportError)(this, this.def.error, K);
    }
    $dataError() {
      (0, S.reportError)(this, this.def.$dataError || S.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, S.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(R) {
      this.allErrors || this.gen.if(R);
    }
    setParams(R, K) {
      K ? Object.assign(this.params, R) : this.params = R;
    }
    block$data(R, K, Z = p.nil) {
      this.gen.block(() => {
        this.check$data(R, Z), K();
      });
    }
    check$data(R = p.nil, K = p.nil) {
      if (!this.$data)
        return;
      const { gen: Z, schemaCode: te, schemaType: ne, def: Ee } = this;
      Z.if((0, p.or)((0, p._)`${te} === undefined`, K)), R !== p.nil && Z.assign(R, !0), (ne.length || Ee.validateSchema) && (Z.elseIf(this.invalid$data()), this.$dataError(), R !== p.nil && Z.assign(R, !1)), Z.else();
    }
    invalid$data() {
      const { gen: R, schemaCode: K, schemaType: Z, def: te, it: ne } = this;
      return (0, p.or)(Ee(), Ne());
      function Ee() {
        if (Z.length) {
          if (!(K instanceof p.Name))
            throw new Error("ajv implementation error");
          const Te = Array.isArray(Z) ? Z : [Z];
          return (0, p._)`${(0, a.checkDataTypes)(Te, K, ne.opts.strictNumbers, a.DataType.Wrong)}`;
        }
        return p.nil;
      }
      function Ne() {
        if (te.validateSchema) {
          const Te = R.scopeValue("validate$data", { ref: te.validateSchema });
          return (0, p._)`!${Te}(${K})`;
        }
        return p.nil;
      }
    }
    subschema(R, K) {
      const Z = (0, m.getSubschema)(this.it, R);
      (0, m.extendSubschemaData)(Z, this.it, R), (0, m.extendSubschemaMode)(Z, R);
      const te = { ...this.it, ...Z, items: void 0, props: void 0 };
      return L(te, K), te;
    }
    mergeEvaluated(R, K) {
      const { it: Z, gen: te } = this;
      Z.opts.unevaluated && (Z.props !== !0 && R.props !== void 0 && (Z.props = b.mergeEvaluated.props(te, R.props, Z.props, K)), Z.items !== !0 && R.items !== void 0 && (Z.items = b.mergeEvaluated.items(te, R.items, Z.items, K)));
    }
    mergeValidEvaluated(R, K) {
      const { it: Z, gen: te } = this;
      if (Z.opts.unevaluated && (Z.props !== !0 || Z.items !== !0))
        return te.if(K, () => this.mergeEvaluated(R, p.Name)), !0;
    }
  }
  rt.KeywordCxt = z;
  function J(C, R, K, Z) {
    const te = new z(C, K, R);
    "code" in K ? K.code(te, Z) : te.$data && K.validate ? (0, l.funcKeywordCode)(te, K) : "macro" in K ? (0, l.macroKeywordCode)(te, K) : (K.compile || K.validate) && (0, l.funcKeywordCode)(te, K);
  }
  const Y = /^\/(?:[^~]|~0|~1)*$/, se = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function ie(C, { dataLevel: R, dataNames: K, dataPathArr: Z }) {
    let te, ne;
    if (C === "")
      return g.default.rootData;
    if (C[0] === "/") {
      if (!Y.test(C))
        throw new Error(`Invalid JSON-pointer: ${C}`);
      te = C, ne = g.default.rootData;
    } else {
      const Ce = se.exec(C);
      if (!Ce)
        throw new Error(`Invalid JSON-pointer: ${C}`);
      const Se = +Ce[1];
      if (te = Ce[2], te === "#") {
        if (Se >= R)
          throw new Error(Te("property/index", Se));
        return Z[R - Se];
      }
      if (Se > R)
        throw new Error(Te("data", Se));
      if (ne = K[R - Se], !te)
        return ne;
    }
    let Ee = ne;
    const Ne = te.split("/");
    for (const Ce of Ne)
      Ce && (ne = (0, p._)`${ne}${(0, p.getProperty)((0, b.unescapeJsonPointer)(Ce))}`, Ee = (0, p._)`${Ee} && ${ne}`);
    return Ee;
    function Te(Ce, Se) {
      return `Cannot access ${Ce} ${Se} levels up, current level is ${R}`;
    }
  }
  return rt.getData = ie, rt;
}
var Zt = {};
Object.defineProperty(Zt, "__esModule", { value: !0 });
class qo extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
Zt.default = qo;
var Yt = {};
Object.defineProperty(Yt, "__esModule", { value: !0 });
const Sr = Ae;
class Ho extends Error {
  constructor(t, n, a, i) {
    super(i || `can't resolve reference ${a} from id ${n}`), this.missingRef = (0, Sr.resolveUrl)(t, n, a), this.missingSchema = (0, Sr.normalizeId)((0, Sr.getFullPath)(t, this.missingRef));
  }
}
Yt.default = Ho;
var Le = {};
Object.defineProperty(Le, "__esModule", { value: !0 });
Le.resolveSchema = Le.getCompilingSchema = Le.resolveRef = Le.compileSchema = Le.SchemaEnv = void 0;
const Ge = ue, Ko = Zt, _t = ut(), Ze = Ae, Ua = he, Go = yr();
class $r {
  constructor(t) {
    var n;
    this.refs = {}, this.dynamicAnchors = {};
    let a;
    typeof t.schema == "object" && (a = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (n = t.baseId) !== null && n !== void 0 ? n : (0, Ze.normalizeId)(a == null ? void 0 : a[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = a == null ? void 0 : a.$async, this.refs = {};
  }
}
Le.SchemaEnv = $r;
function Fr(e) {
  const t = jn.call(this, e);
  if (t)
    return t;
  const n = (0, Ze.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: a, lines: i } = this.opts.code, { ownProperties: l } = this.opts, m = new Ge.CodeGen(this.scope, { es5: a, lines: i, ownProperties: l });
  let p;
  e.$async && (p = m.scopeValue("Error", {
    ref: Ko.default,
    code: (0, Ge._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const g = m.scopeName("validate");
  e.validateName = g;
  const v = {
    gen: m,
    allErrors: this.opts.allErrors,
    data: _t.default.data,
    parentData: _t.default.parentData,
    parentDataProperty: _t.default.parentDataProperty,
    dataNames: [_t.default.data],
    dataPathArr: [Ge.nil],
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: m.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ge.stringify)(e.schema) } : { ref: e.schema }),
    validateName: g,
    ValidationError: p,
    schema: e.schema,
    schemaEnv: e,
    rootId: n,
    baseId: e.baseId || n,
    schemaPath: Ge.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Ge._)`""`,
    opts: this.opts,
    self: this
  };
  let b;
  try {
    this._compilations.add(e), (0, Go.validateFunctionCode)(v), m.optimize(this.opts.code.optimize);
    const S = m.toString();
    b = `${m.scopeRefs(_t.default.scope)}return ${S}`, this.opts.code.process && (b = this.opts.code.process(b, e));
    const I = new Function(`${_t.default.self}`, `${_t.default.scope}`, b)(this, this.scope.get());
    if (this.scope.value(g, { ref: I }), I.errors = null, I.schema = e.schema, I.schemaEnv = e, e.$async && (I.$async = !0), this.opts.code.source === !0 && (I.source = { validateName: g, validateCode: S, scopeValues: m._values }), this.opts.unevaluated) {
      const { props: M, items: O } = v;
      I.evaluated = {
        props: M instanceof Ge.Name ? void 0 : M,
        items: O instanceof Ge.Name ? void 0 : O,
        dynamicProps: M instanceof Ge.Name,
        dynamicItems: O instanceof Ge.Name
      }, I.source && (I.source.evaluated = (0, Ge.stringify)(I.evaluated));
    }
    return e.validate = I, e;
  } catch (S) {
    throw delete e.validate, delete e.validateName, b && this.logger.error("Error compiling schema, function code:", b), S;
  } finally {
    this._compilations.delete(e);
  }
}
Le.compileSchema = Fr;
function Wo(e, t, n) {
  var a;
  n = (0, Ze.resolveUrl)(this.opts.uriResolver, t, n);
  const i = e.refs[n];
  if (i)
    return i;
  let l = Yo.call(this, e, n);
  if (l === void 0) {
    const m = (a = e.localRefs) === null || a === void 0 ? void 0 : a[n], { schemaId: p } = this.opts;
    m && (l = new $r({ schema: m, schemaId: p, root: e, baseId: t }));
  }
  if (l !== void 0)
    return e.refs[n] = Jo.call(this, l);
}
Le.resolveRef = Wo;
function Jo(e) {
  return (0, Ze.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Fr.call(this, e);
}
function jn(e) {
  for (const t of this._compilations)
    if (Zo(t, e))
      return t;
}
Le.getCompilingSchema = jn;
function Zo(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Yo(e, t) {
  let n;
  for (; typeof (n = this.refs[t]) == "string"; )
    t = n;
  return n || this.schemas[t] || kr.call(this, e, t);
}
function kr(e, t) {
  const n = this.opts.uriResolver.parse(t), a = (0, Ze._getFullPath)(this.opts.uriResolver, n);
  let i = (0, Ze.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && a === i)
    return jr.call(this, n, e);
  const l = (0, Ze.normalizeId)(a), m = this.refs[l] || this.schemas[l];
  if (typeof m == "string") {
    const p = kr.call(this, e, m);
    return typeof (p == null ? void 0 : p.schema) != "object" ? void 0 : jr.call(this, n, p);
  }
  if (typeof (m == null ? void 0 : m.schema) == "object") {
    if (m.validate || Fr.call(this, m), l === (0, Ze.normalizeId)(t)) {
      const { schema: p } = m, { schemaId: g } = this.opts, v = p[g];
      return v && (i = (0, Ze.resolveUrl)(this.opts.uriResolver, i, v)), new $r({ schema: p, schemaId: g, root: e, baseId: i });
    }
    return jr.call(this, n, m);
  }
}
Le.resolveSchema = kr;
const Qo = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function jr(e, { baseId: t, schema: n, root: a }) {
  var i;
  if (((i = e.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const p of e.fragment.slice(1).split("/")) {
    if (typeof n == "boolean")
      return;
    const g = n[(0, Ua.unescapeFragment)(p)];
    if (g === void 0)
      return;
    n = g;
    const v = typeof n == "object" && n[this.opts.schemaId];
    !Qo.has(p) && v && (t = (0, Ze.resolveUrl)(this.opts.uriResolver, t, v));
  }
  let l;
  if (typeof n != "boolean" && n.$ref && !(0, Ua.schemaHasRulesButRef)(n, this.RULES)) {
    const p = (0, Ze.resolveUrl)(this.opts.uriResolver, t, n.$ref);
    l = kr.call(this, a, p);
  }
  const { schemaId: m } = this.opts;
  if (l = l || new $r({ schema: n, schemaId: m, root: a, baseId: t }), l.schema !== l.root.schema)
    return l;
}
const Xo = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", es = "Meta-schema for $data reference (JSON AnySchema extension proposal)", ts = "object", rs = [
  "$data"
], as = {
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
}, ns = !1, os = {
  $id: Xo,
  description: es,
  type: ts,
  required: rs,
  properties: as,
  additionalProperties: ns
};
var Ur = {}, Nr = { exports: {} };
/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
(function(e, t) {
  (function(n, a) {
    a(t);
  })(gn, function(n) {
    function a() {
      for (var h = arguments.length, $ = Array(h), E = 0; E < h; E++)
        $[E] = arguments[E];
      if ($.length > 1) {
        $[0] = $[0].slice(0, -1);
        for (var V = $.length - 1, B = 1; B < V; ++B)
          $[B] = $[B].slice(1, -1);
        return $[V] = $[V].slice(1), $.join("");
      } else
        return $[0];
    }
    function i(h) {
      return "(?:" + h + ")";
    }
    function l(h) {
      return h === void 0 ? "undefined" : h === null ? "null" : Object.prototype.toString.call(h).split(" ").pop().split("]").shift().toLowerCase();
    }
    function m(h) {
      return h.toUpperCase();
    }
    function p(h) {
      return h != null ? h instanceof Array ? h : typeof h.length != "number" || h.split || h.setInterval || h.call ? [h] : Array.prototype.slice.call(h) : [];
    }
    function g(h, $) {
      var E = h;
      if ($)
        for (var V in $)
          E[V] = $[V];
      return E;
    }
    function v(h) {
      var $ = "[A-Za-z]", E = "[0-9]", V = a(E, "[A-Fa-f]"), B = i(i("%[EFef]" + V + "%" + V + V + "%" + V + V) + "|" + i("%[89A-Fa-f]" + V + "%" + V + V) + "|" + i("%" + V + V)), ae = "[\\:\\/\\?\\#\\[\\]\\@]", re = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", pe = a(ae, re), ke = h ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]", me = h ? "[\\uE000-\\uF8FF]" : "[]", de = a($, E, "[\\-\\.\\_\\~]", ke);
      i($ + a($, E, "[\\+\\-\\.]") + "*"), i(i(B + "|" + a(de, re, "[\\:]")) + "*");
      var be = i(i("25[0-5]") + "|" + i("2[0-4]" + E) + "|" + i("1" + E + E) + "|" + i("0?[1-9]" + E) + "|0?0?" + E), ye = i(be + "\\." + be + "\\." + be + "\\." + be), oe = i(V + "{1,4}"), Pe = i(i(oe + "\\:" + oe) + "|" + ye), ge = i(i(oe + "\\:") + "{6}" + Pe), Ve = i("\\:\\:" + i(oe + "\\:") + "{5}" + Pe), Et = i(i(oe) + "?\\:\\:" + i(oe + "\\:") + "{4}" + Pe), He = i(i(i(oe + "\\:") + "{0,1}" + oe) + "?\\:\\:" + i(oe + "\\:") + "{3}" + Pe), et = i(i(i(oe + "\\:") + "{0,2}" + oe) + "?\\:\\:" + i(oe + "\\:") + "{2}" + Pe), pt = i(i(i(oe + "\\:") + "{0,3}" + oe) + "?\\:\\:" + oe + "\\:" + Pe), ft = i(i(i(oe + "\\:") + "{0,4}" + oe) + "?\\:\\:" + Pe), Be = i(i(i(oe + "\\:") + "{0,5}" + oe) + "?\\:\\:" + oe), tt = i(i(i(oe + "\\:") + "{0,6}" + oe) + "?\\:\\:"), mt = i([ge, Ve, Et, He, et, pt, ft, Be, tt].join("|")), Qe = i(i(de + "|" + B) + "+");
      i("[vV]" + V + "+\\." + a(de, re, "[\\:]") + "+"), i(i(B + "|" + a(de, re)) + "*");
      var er = i(B + "|" + a(de, re, "[\\:\\@]"));
      return i(i(B + "|" + a(de, re, "[\\@]")) + "+"), i(i(er + "|" + a("[\\/\\?]", me)) + "*"), {
        NOT_SCHEME: new RegExp(a("[^]", $, E, "[\\+\\-\\.]"), "g"),
        NOT_USERINFO: new RegExp(a("[^\\%\\:]", de, re), "g"),
        NOT_HOST: new RegExp(a("[^\\%\\[\\]\\:]", de, re), "g"),
        NOT_PATH: new RegExp(a("[^\\%\\/\\:\\@]", de, re), "g"),
        NOT_PATH_NOSCHEME: new RegExp(a("[^\\%\\/\\@]", de, re), "g"),
        NOT_QUERY: new RegExp(a("[^\\%]", de, re, "[\\:\\@\\/\\?]", me), "g"),
        NOT_FRAGMENT: new RegExp(a("[^\\%]", de, re, "[\\:\\@\\/\\?]"), "g"),
        ESCAPE: new RegExp(a("[^]", de, re), "g"),
        UNRESERVED: new RegExp(de, "g"),
        OTHER_CHARS: new RegExp(a("[^\\%]", de, pe), "g"),
        PCT_ENCODED: new RegExp(B, "g"),
        IPV4ADDRESS: new RegExp("^(" + ye + ")$"),
        IPV6ADDRESS: new RegExp("^\\[?(" + mt + ")" + i(i("\\%25|\\%(?!" + V + "{2})") + "(" + Qe + ")") + "?\\]?$")
        //RFC 6874, with relaxed parsing rules
      };
    }
    var b = v(!1), S = v(!0), I = function() {
      function h($, E) {
        var V = [], B = !0, ae = !1, re = void 0;
        try {
          for (var pe = $[Symbol.iterator](), ke; !(B = (ke = pe.next()).done) && (V.push(ke.value), !(E && V.length === E)); B = !0)
            ;
        } catch (me) {
          ae = !0, re = me;
        } finally {
          try {
            !B && pe.return && pe.return();
          } finally {
            if (ae)
              throw re;
          }
        }
        return V;
      }
      return function($, E) {
        if (Array.isArray($))
          return $;
        if (Symbol.iterator in Object($))
          return h($, E);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      };
    }(), M = function(h) {
      if (Array.isArray(h)) {
        for (var $ = 0, E = Array(h.length); $ < h.length; $++)
          E[$] = h[$];
        return E;
      } else
        return Array.from(h);
    }, O = 2147483647, x = 36, T = 1, k = 26, A = 38, L = 700, r = 72, s = 128, o = "-", c = /^xn--/, u = /[^\0-\x7E]/, _ = /[\x2E\u3002\uFF0E\uFF61]/g, f = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    }, j = x - T, F = Math.floor, U = String.fromCharCode;
    function D(h) {
      throw new RangeError(f[h]);
    }
    function W(h, $) {
      for (var E = [], V = h.length; V--; )
        E[V] = $(h[V]);
      return E;
    }
    function w(h, $) {
      var E = h.split("@"), V = "";
      E.length > 1 && (V = E[0] + "@", h = E[1]), h = h.replace(_, ".");
      var B = h.split("."), ae = W(B, $).join(".");
      return V + ae;
    }
    function G(h) {
      for (var $ = [], E = 0, V = h.length; E < V; ) {
        var B = h.charCodeAt(E++);
        if (B >= 55296 && B <= 56319 && E < V) {
          var ae = h.charCodeAt(E++);
          (ae & 64512) == 56320 ? $.push(((B & 1023) << 10) + (ae & 1023) + 65536) : ($.push(B), E--);
        } else
          $.push(B);
      }
      return $;
    }
    var Q = function(h) {
      return String.fromCodePoint.apply(String, M(h));
    }, ee = function(h) {
      return h - 48 < 10 ? h - 22 : h - 65 < 26 ? h - 65 : h - 97 < 26 ? h - 97 : x;
    }, q = function(h, $) {
      return h + 22 + 75 * (h < 26) - (($ != 0) << 5);
    }, P = function(h, $, E) {
      var V = 0;
      for (
        h = E ? F(h / L) : h >> 1, h += F(h / $);
        /* no initialization */
        h > j * k >> 1;
        V += x
      )
        h = F(h / j);
      return F(V + (j + 1) * h / (h + A));
    }, H = function(h) {
      var $ = [], E = h.length, V = 0, B = s, ae = r, re = h.lastIndexOf(o);
      re < 0 && (re = 0);
      for (var pe = 0; pe < re; ++pe)
        h.charCodeAt(pe) >= 128 && D("not-basic"), $.push(h.charCodeAt(pe));
      for (var ke = re > 0 ? re + 1 : 0; ke < E; ) {
        for (
          var me = V, de = 1, be = x;
          ;
          /* no condition */
          be += x
        ) {
          ke >= E && D("invalid-input");
          var ye = ee(h.charCodeAt(ke++));
          (ye >= x || ye > F((O - V) / de)) && D("overflow"), V += ye * de;
          var oe = be <= ae ? T : be >= ae + k ? k : be - ae;
          if (ye < oe)
            break;
          var Pe = x - oe;
          de > F(O / Pe) && D("overflow"), de *= Pe;
        }
        var ge = $.length + 1;
        ae = P(V - me, ge, me == 0), F(V / ge) > O - B && D("overflow"), B += F(V / ge), V %= ge, $.splice(V++, 0, B);
      }
      return String.fromCodePoint.apply(String, $);
    }, N = function(h) {
      var $ = [];
      h = G(h);
      var E = h.length, V = s, B = 0, ae = r, re = !0, pe = !1, ke = void 0;
      try {
        for (var me = h[Symbol.iterator](), de; !(re = (de = me.next()).done); re = !0) {
          var be = de.value;
          be < 128 && $.push(U(be));
        }
      } catch (zt) {
        pe = !0, ke = zt;
      } finally {
        try {
          !re && me.return && me.return();
        } finally {
          if (pe)
            throw ke;
        }
      }
      var ye = $.length, oe = ye;
      for (ye && $.push(o); oe < E; ) {
        var Pe = O, ge = !0, Ve = !1, Et = void 0;
        try {
          for (var He = h[Symbol.iterator](), et; !(ge = (et = He.next()).done); ge = !0) {
            var pt = et.value;
            pt >= V && pt < Pe && (Pe = pt);
          }
        } catch (zt) {
          Ve = !0, Et = zt;
        } finally {
          try {
            !ge && He.return && He.return();
          } finally {
            if (Ve)
              throw Et;
          }
        }
        var ft = oe + 1;
        Pe - V > F((O - B) / ft) && D("overflow"), B += (Pe - V) * ft, V = Pe;
        var Be = !0, tt = !1, mt = void 0;
        try {
          for (var Qe = h[Symbol.iterator](), er; !(Be = (er = Qe.next()).done); Be = !0) {
            var Ia = er.value;
            if (Ia < V && ++B > O && D("overflow"), Ia == V) {
              for (
                var tr = B, rr = x;
                ;
                /* no condition */
                rr += x
              ) {
                var ar = rr <= ae ? T : rr >= ae + k ? k : rr - ae;
                if (tr < ar)
                  break;
                var Na = tr - ar, Ma = x - ar;
                $.push(U(q(ar + Na % Ma, 0))), tr = F(Na / Ma);
              }
              $.push(U(q(tr, 0))), ae = P(B, ft, oe == ye), B = 0, ++oe;
            }
          }
        } catch (zt) {
          tt = !0, mt = zt;
        } finally {
          try {
            !Be && Qe.return && Qe.return();
          } finally {
            if (tt)
              throw mt;
          }
        }
        ++B, ++V;
      }
      return $.join("");
    }, d = function(h) {
      return w(h, function($) {
        return c.test($) ? H($.slice(4).toLowerCase()) : $;
      });
    }, y = function(h) {
      return w(h, function($) {
        return u.test($) ? "xn--" + N($) : $;
      });
    }, z = {
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
        decode: G,
        encode: Q
      },
      decode: H,
      encode: N,
      toASCII: y,
      toUnicode: d
    }, J = {};
    function Y(h) {
      var $ = h.charCodeAt(0), E = void 0;
      return $ < 16 ? E = "%0" + $.toString(16).toUpperCase() : $ < 128 ? E = "%" + $.toString(16).toUpperCase() : $ < 2048 ? E = "%" + ($ >> 6 | 192).toString(16).toUpperCase() + "%" + ($ & 63 | 128).toString(16).toUpperCase() : E = "%" + ($ >> 12 | 224).toString(16).toUpperCase() + "%" + ($ >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + ($ & 63 | 128).toString(16).toUpperCase(), E;
    }
    function se(h) {
      for (var $ = "", E = 0, V = h.length; E < V; ) {
        var B = parseInt(h.substr(E + 1, 2), 16);
        if (B < 128)
          $ += String.fromCharCode(B), E += 3;
        else if (B >= 194 && B < 224) {
          if (V - E >= 6) {
            var ae = parseInt(h.substr(E + 4, 2), 16);
            $ += String.fromCharCode((B & 31) << 6 | ae & 63);
          } else
            $ += h.substr(E, 6);
          E += 6;
        } else if (B >= 224) {
          if (V - E >= 9) {
            var re = parseInt(h.substr(E + 4, 2), 16), pe = parseInt(h.substr(E + 7, 2), 16);
            $ += String.fromCharCode((B & 15) << 12 | (re & 63) << 6 | pe & 63);
          } else
            $ += h.substr(E, 9);
          E += 9;
        } else
          $ += h.substr(E, 3), E += 3;
      }
      return $;
    }
    function ie(h, $) {
      function E(V) {
        var B = se(V);
        return B.match($.UNRESERVED) ? B : V;
      }
      return h.scheme && (h.scheme = String(h.scheme).replace($.PCT_ENCODED, E).toLowerCase().replace($.NOT_SCHEME, "")), h.userinfo !== void 0 && (h.userinfo = String(h.userinfo).replace($.PCT_ENCODED, E).replace($.NOT_USERINFO, Y).replace($.PCT_ENCODED, m)), h.host !== void 0 && (h.host = String(h.host).replace($.PCT_ENCODED, E).toLowerCase().replace($.NOT_HOST, Y).replace($.PCT_ENCODED, m)), h.path !== void 0 && (h.path = String(h.path).replace($.PCT_ENCODED, E).replace(h.scheme ? $.NOT_PATH : $.NOT_PATH_NOSCHEME, Y).replace($.PCT_ENCODED, m)), h.query !== void 0 && (h.query = String(h.query).replace($.PCT_ENCODED, E).replace($.NOT_QUERY, Y).replace($.PCT_ENCODED, m)), h.fragment !== void 0 && (h.fragment = String(h.fragment).replace($.PCT_ENCODED, E).replace($.NOT_FRAGMENT, Y).replace($.PCT_ENCODED, m)), h;
    }
    function C(h) {
      return h.replace(/^0*(.*)/, "$1") || "0";
    }
    function R(h, $) {
      var E = h.match($.IPV4ADDRESS) || [], V = I(E, 2), B = V[1];
      return B ? B.split(".").map(C).join(".") : h;
    }
    function K(h, $) {
      var E = h.match($.IPV6ADDRESS) || [], V = I(E, 3), B = V[1], ae = V[2];
      if (B) {
        for (var re = B.toLowerCase().split("::").reverse(), pe = I(re, 2), ke = pe[0], me = pe[1], de = me ? me.split(":").map(C) : [], be = ke.split(":").map(C), ye = $.IPV4ADDRESS.test(be[be.length - 1]), oe = ye ? 7 : 8, Pe = be.length - oe, ge = Array(oe), Ve = 0; Ve < oe; ++Ve)
          ge[Ve] = de[Ve] || be[Pe + Ve] || "";
        ye && (ge[oe - 1] = R(ge[oe - 1], $));
        var Et = ge.reduce(function(Be, tt, mt) {
          if (!tt || tt === "0") {
            var Qe = Be[Be.length - 1];
            Qe && Qe.index + Qe.length === mt ? Qe.length++ : Be.push({ index: mt, length: 1 });
          }
          return Be;
        }, []), He = Et.sort(function(Be, tt) {
          return tt.length - Be.length;
        })[0], et = void 0;
        if (He && He.length > 1) {
          var pt = ge.slice(0, He.index), ft = ge.slice(He.index + He.length);
          et = pt.join(":") + "::" + ft.join(":");
        } else
          et = ge.join(":");
        return ae && (et += "%" + ae), et;
      } else
        return h;
    }
    var Z = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i, te = "".match(/(){0}/)[1] === void 0;
    function ne(h) {
      var $ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, E = {}, V = $.iri !== !1 ? S : b;
      $.reference === "suffix" && (h = ($.scheme ? $.scheme + ":" : "") + "//" + h);
      var B = h.match(Z);
      if (B) {
        te ? (E.scheme = B[1], E.userinfo = B[3], E.host = B[4], E.port = parseInt(B[5], 10), E.path = B[6] || "", E.query = B[7], E.fragment = B[8], isNaN(E.port) && (E.port = B[5])) : (E.scheme = B[1] || void 0, E.userinfo = h.indexOf("@") !== -1 ? B[3] : void 0, E.host = h.indexOf("//") !== -1 ? B[4] : void 0, E.port = parseInt(B[5], 10), E.path = B[6] || "", E.query = h.indexOf("?") !== -1 ? B[7] : void 0, E.fragment = h.indexOf("#") !== -1 ? B[8] : void 0, isNaN(E.port) && (E.port = h.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? B[4] : void 0)), E.host && (E.host = K(R(E.host, V), V)), E.scheme === void 0 && E.userinfo === void 0 && E.host === void 0 && E.port === void 0 && !E.path && E.query === void 0 ? E.reference = "same-document" : E.scheme === void 0 ? E.reference = "relative" : E.fragment === void 0 ? E.reference = "absolute" : E.reference = "uri", $.reference && $.reference !== "suffix" && $.reference !== E.reference && (E.error = E.error || "URI is not a " + $.reference + " reference.");
        var ae = J[($.scheme || E.scheme || "").toLowerCase()];
        if (!$.unicodeSupport && (!ae || !ae.unicodeSupport)) {
          if (E.host && ($.domainHost || ae && ae.domainHost))
            try {
              E.host = z.toASCII(E.host.replace(V.PCT_ENCODED, se).toLowerCase());
            } catch (re) {
              E.error = E.error || "Host's domain name can not be converted to ASCII via punycode: " + re;
            }
          ie(E, b);
        } else
          ie(E, V);
        ae && ae.parse && ae.parse(E, $);
      } else
        E.error = E.error || "URI can not be parsed.";
      return E;
    }
    function Ee(h, $) {
      var E = $.iri !== !1 ? S : b, V = [];
      return h.userinfo !== void 0 && (V.push(h.userinfo), V.push("@")), h.host !== void 0 && V.push(K(R(String(h.host), E), E).replace(E.IPV6ADDRESS, function(B, ae, re) {
        return "[" + ae + (re ? "%25" + re : "") + "]";
      })), (typeof h.port == "number" || typeof h.port == "string") && (V.push(":"), V.push(String(h.port))), V.length ? V.join("") : void 0;
    }
    var Ne = /^\.\.?\//, Te = /^\/\.(\/|$)/, Ce = /^\/\.\.(\/|$)/, Se = /^\/?(?:.|\n)*?(?=\/|$)/;
    function ze(h) {
      for (var $ = []; h.length; )
        if (h.match(Ne))
          h = h.replace(Ne, "");
        else if (h.match(Te))
          h = h.replace(Te, "/");
        else if (h.match(Ce))
          h = h.replace(Ce, "/"), $.pop();
        else if (h === "." || h === "..")
          h = "";
        else {
          var E = h.match(Se);
          if (E) {
            var V = E[0];
            h = h.slice(V.length), $.push(V);
          } else
            throw new Error("Unexpected dot segment condition");
        }
      return $.join("");
    }
    function ve(h) {
      var $ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, E = $.iri ? S : b, V = [], B = J[($.scheme || h.scheme || "").toLowerCase()];
      if (B && B.serialize && B.serialize(h, $), h.host && !E.IPV6ADDRESS.test(h.host) && ($.domainHost || B && B.domainHost))
        try {
          h.host = $.iri ? z.toUnicode(h.host) : z.toASCII(h.host.replace(E.PCT_ENCODED, se).toLowerCase());
        } catch (pe) {
          h.error = h.error || "Host's domain name can not be converted to " + ($.iri ? "Unicode" : "ASCII") + " via punycode: " + pe;
        }
      ie(h, E), $.reference !== "suffix" && h.scheme && (V.push(h.scheme), V.push(":"));
      var ae = Ee(h, $);
      if (ae !== void 0 && ($.reference !== "suffix" && V.push("//"), V.push(ae), h.path && h.path.charAt(0) !== "/" && V.push("/")), h.path !== void 0) {
        var re = h.path;
        !$.absolutePath && (!B || !B.absolutePath) && (re = ze(re)), ae === void 0 && (re = re.replace(/^\/\//, "/%2F")), V.push(re);
      }
      return h.query !== void 0 && (V.push("?"), V.push(h.query)), h.fragment !== void 0 && (V.push("#"), V.push(h.fragment)), V.join("");
    }
    function kt(h, $) {
      var E = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, V = arguments[3], B = {};
      return V || (h = ne(ve(h, E), E), $ = ne(ve($, E), E)), E = E || {}, !E.tolerant && $.scheme ? (B.scheme = $.scheme, B.userinfo = $.userinfo, B.host = $.host, B.port = $.port, B.path = ze($.path || ""), B.query = $.query) : ($.userinfo !== void 0 || $.host !== void 0 || $.port !== void 0 ? (B.userinfo = $.userinfo, B.host = $.host, B.port = $.port, B.path = ze($.path || ""), B.query = $.query) : ($.path ? ($.path.charAt(0) === "/" ? B.path = ze($.path) : ((h.userinfo !== void 0 || h.host !== void 0 || h.port !== void 0) && !h.path ? B.path = "/" + $.path : h.path ? B.path = h.path.slice(0, h.path.lastIndexOf("/") + 1) + $.path : B.path = $.path, B.path = ze(B.path)), B.query = $.query) : (B.path = h.path, $.query !== void 0 ? B.query = $.query : B.query = h.query), B.userinfo = h.userinfo, B.host = h.host, B.port = h.port), B.scheme = h.scheme), B.fragment = $.fragment, B;
    }
    function Mt(h, $, E) {
      var V = g({ scheme: "null" }, E);
      return ve(kt(ne(h, V), ne($, V), V, !0), V);
    }
    function dt(h, $) {
      return typeof h == "string" ? h = ve(ne(h, $), $) : l(h) === "object" && (h = ne(ve(h, $), $)), h;
    }
    function Rt(h, $, E) {
      return typeof h == "string" ? h = ve(ne(h, E), E) : l(h) === "object" && (h = ve(h, E)), typeof $ == "string" ? $ = ve(ne($, E), E) : l($) === "object" && ($ = ve($, E)), h === $;
    }
    function Xt(h, $) {
      return h && h.toString().replace(!$ || !$.iri ? b.ESCAPE : S.ESCAPE, Y);
    }
    function De(h, $) {
      return h && h.toString().replace(!$ || !$.iri ? b.PCT_ENCODED : S.PCT_ENCODED, se);
    }
    var ht = {
      scheme: "http",
      domainHost: !0,
      parse: function(h, $) {
        return h.host || (h.error = h.error || "HTTP URIs must have a host."), h;
      },
      serialize: function(h, $) {
        var E = String(h.scheme).toLowerCase() === "https";
        return (h.port === (E ? 443 : 80) || h.port === "") && (h.port = void 0), h.path || (h.path = "/"), h;
      }
    }, Ea = {
      scheme: "https",
      domainHost: ht.domainHost,
      parse: ht.parse,
      serialize: ht.serialize
    };
    function Sa(h) {
      return typeof h.secure == "boolean" ? h.secure : String(h.scheme).toLowerCase() === "wss";
    }
    var Lt = {
      scheme: "ws",
      domainHost: !0,
      parse: function(h, $) {
        var E = h;
        return E.secure = Sa(E), E.resourceName = (E.path || "/") + (E.query ? "?" + E.query : ""), E.path = void 0, E.query = void 0, E;
      },
      serialize: function(h, $) {
        if ((h.port === (Sa(h) ? 443 : 80) || h.port === "") && (h.port = void 0), typeof h.secure == "boolean" && (h.scheme = h.secure ? "wss" : "ws", h.secure = void 0), h.resourceName) {
          var E = h.resourceName.split("?"), V = I(E, 2), B = V[0], ae = V[1];
          h.path = B && B !== "/" ? B : void 0, h.query = ae, h.resourceName = void 0;
        }
        return h.fragment = void 0, h;
      }
    }, ja = {
      scheme: "wss",
      domainHost: Lt.domainHost,
      parse: Lt.parse,
      serialize: Lt.serialize
    }, Wn = {}, xa = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]", Ye = "[0-9A-Fa-f]", Jn = i(i("%[EFef]" + Ye + "%" + Ye + Ye + "%" + Ye + Ye) + "|" + i("%[89A-Fa-f]" + Ye + "%" + Ye + Ye) + "|" + i("%" + Ye + Ye)), Zn = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", Yn = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", Qn = a(Yn, '[\\"\\\\]'), Xn = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]", eo = new RegExp(xa, "g"), Pt = new RegExp(Jn, "g"), to = new RegExp(a("[^]", Zn, "[\\.]", '[\\"]', Qn), "g"), Ta = new RegExp(a("[^]", xa, Xn), "g"), ro = Ta;
    function Er(h) {
      var $ = se(h);
      return $.match(eo) ? $ : h;
    }
    var Ca = {
      scheme: "mailto",
      parse: function(h, $) {
        var E = h, V = E.to = E.path ? E.path.split(",") : [];
        if (E.path = void 0, E.query) {
          for (var B = !1, ae = {}, re = E.query.split("&"), pe = 0, ke = re.length; pe < ke; ++pe) {
            var me = re[pe].split("=");
            switch (me[0]) {
              case "to":
                for (var de = me[1].split(","), be = 0, ye = de.length; be < ye; ++be)
                  V.push(de[be]);
                break;
              case "subject":
                E.subject = De(me[1], $);
                break;
              case "body":
                E.body = De(me[1], $);
                break;
              default:
                B = !0, ae[De(me[0], $)] = De(me[1], $);
                break;
            }
          }
          B && (E.headers = ae);
        }
        E.query = void 0;
        for (var oe = 0, Pe = V.length; oe < Pe; ++oe) {
          var ge = V[oe].split("@");
          if (ge[0] = De(ge[0]), $.unicodeSupport)
            ge[1] = De(ge[1], $).toLowerCase();
          else
            try {
              ge[1] = z.toASCII(De(ge[1], $).toLowerCase());
            } catch (Ve) {
              E.error = E.error || "Email address's domain name can not be converted to ASCII via punycode: " + Ve;
            }
          V[oe] = ge.join("@");
        }
        return E;
      },
      serialize: function(h, $) {
        var E = h, V = p(h.to);
        if (V) {
          for (var B = 0, ae = V.length; B < ae; ++B) {
            var re = String(V[B]), pe = re.lastIndexOf("@"), ke = re.slice(0, pe).replace(Pt, Er).replace(Pt, m).replace(to, Y), me = re.slice(pe + 1);
            try {
              me = $.iri ? z.toUnicode(me) : z.toASCII(De(me, $).toLowerCase());
            } catch (oe) {
              E.error = E.error || "Email address's domain name can not be converted to " + ($.iri ? "Unicode" : "ASCII") + " via punycode: " + oe;
            }
            V[B] = ke + "@" + me;
          }
          E.path = V.join(",");
        }
        var de = h.headers = h.headers || {};
        h.subject && (de.subject = h.subject), h.body && (de.body = h.body);
        var be = [];
        for (var ye in de)
          de[ye] !== Wn[ye] && be.push(ye.replace(Pt, Er).replace(Pt, m).replace(Ta, Y) + "=" + de[ye].replace(Pt, Er).replace(Pt, m).replace(ro, Y));
        return be.length && (E.query = be.join("&")), E;
      }
    }, ao = /^([^\:]+)\:(.*)/, Oa = {
      scheme: "urn",
      parse: function(h, $) {
        var E = h.path && h.path.match(ao), V = h;
        if (E) {
          var B = $.scheme || V.scheme || "urn", ae = E[1].toLowerCase(), re = E[2], pe = B + ":" + ($.nid || ae), ke = J[pe];
          V.nid = ae, V.nss = re, V.path = void 0, ke && (V = ke.parse(V, $));
        } else
          V.error = V.error || "URN can not be parsed.";
        return V;
      },
      serialize: function(h, $) {
        var E = $.scheme || h.scheme || "urn", V = h.nid, B = E + ":" + ($.nid || V), ae = J[B];
        ae && (h = ae.serialize(h, $));
        var re = h, pe = h.nss;
        return re.path = (V || $.nid) + ":" + pe, re;
      }
    }, no = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/, Aa = {
      scheme: "urn:uuid",
      parse: function(h, $) {
        var E = h;
        return E.uuid = E.nss, E.nss = void 0, !$.tolerant && (!E.uuid || !E.uuid.match(no)) && (E.error = E.error || "UUID is not valid."), E;
      },
      serialize: function(h, $) {
        var E = h;
        return E.nss = (h.uuid || "").toLowerCase(), E;
      }
    };
    J[ht.scheme] = ht, J[Ea.scheme] = Ea, J[Lt.scheme] = Lt, J[ja.scheme] = ja, J[Ca.scheme] = Ca, J[Oa.scheme] = Oa, J[Aa.scheme] = Aa, n.SCHEMES = J, n.pctEncChar = Y, n.pctDecChars = se, n.parse = ne, n.removeDotSegments = ze, n.serialize = ve, n.resolveComponents = kt, n.resolve = Mt, n.normalize = dt, n.equal = Rt, n.escapeComponent = Xt, n.unescapeComponent = De, Object.defineProperty(n, "__esModule", { value: !0 });
  });
})(Nr, Nr.exports);
var ss = Nr.exports;
Object.defineProperty(Ur, "__esModule", { value: !0 });
const xn = ss;
xn.code = 'require("ajv/dist/runtime/uri").default';
Ur.default = xn;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = yr();
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var n = ue;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return n.CodeGen;
  } });
  const a = Zt, i = Yt, l = yt, m = Le, p = ue, g = Ae, v = Wt, b = he, S = os, I = Ur, M = (q, P) => new RegExp(q, P);
  M.code = "new RegExp";
  const O = ["removeAdditional", "useDefaults", "coerceTypes"], x = /* @__PURE__ */ new Set([
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
  ]), T = {
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
  }, k = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, A = 200;
  function L(q) {
    var P, H, N, d, y, z, J, Y, se, ie, C, R, K, Z, te, ne, Ee, Ne, Te, Ce, Se, ze, ve, kt, Mt;
    const dt = q.strict, Rt = (P = q.code) === null || P === void 0 ? void 0 : P.optimize, Xt = Rt === !0 || Rt === void 0 ? 1 : Rt || 0, De = (N = (H = q.code) === null || H === void 0 ? void 0 : H.regExp) !== null && N !== void 0 ? N : M, ht = (d = q.uriResolver) !== null && d !== void 0 ? d : I.default;
    return {
      strictSchema: (z = (y = q.strictSchema) !== null && y !== void 0 ? y : dt) !== null && z !== void 0 ? z : !0,
      strictNumbers: (Y = (J = q.strictNumbers) !== null && J !== void 0 ? J : dt) !== null && Y !== void 0 ? Y : !0,
      strictTypes: (ie = (se = q.strictTypes) !== null && se !== void 0 ? se : dt) !== null && ie !== void 0 ? ie : "log",
      strictTuples: (R = (C = q.strictTuples) !== null && C !== void 0 ? C : dt) !== null && R !== void 0 ? R : "log",
      strictRequired: (Z = (K = q.strictRequired) !== null && K !== void 0 ? K : dt) !== null && Z !== void 0 ? Z : !1,
      code: q.code ? { ...q.code, optimize: Xt, regExp: De } : { optimize: Xt, regExp: De },
      loopRequired: (te = q.loopRequired) !== null && te !== void 0 ? te : A,
      loopEnum: (ne = q.loopEnum) !== null && ne !== void 0 ? ne : A,
      meta: (Ee = q.meta) !== null && Ee !== void 0 ? Ee : !0,
      messages: (Ne = q.messages) !== null && Ne !== void 0 ? Ne : !0,
      inlineRefs: (Te = q.inlineRefs) !== null && Te !== void 0 ? Te : !0,
      schemaId: (Ce = q.schemaId) !== null && Ce !== void 0 ? Ce : "$id",
      addUsedSchema: (Se = q.addUsedSchema) !== null && Se !== void 0 ? Se : !0,
      validateSchema: (ze = q.validateSchema) !== null && ze !== void 0 ? ze : !0,
      validateFormats: (ve = q.validateFormats) !== null && ve !== void 0 ? ve : !0,
      unicodeRegExp: (kt = q.unicodeRegExp) !== null && kt !== void 0 ? kt : !0,
      int32range: (Mt = q.int32range) !== null && Mt !== void 0 ? Mt : !0,
      uriResolver: ht
    };
  }
  class r {
    constructor(P = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), P = this.opts = { ...P, ...L(P) };
      const { es5: H, lines: N } = this.opts.code;
      this.scope = new p.ValueScope({ scope: {}, prefixes: x, es5: H, lines: N }), this.logger = F(P.logger);
      const d = P.validateFormats;
      P.validateFormats = !1, this.RULES = (0, l.getRules)(), s.call(this, T, P, "NOT SUPPORTED"), s.call(this, k, P, "DEPRECATED", "warn"), this._metaOpts = f.call(this), P.formats && u.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), P.keywords && _.call(this, P.keywords), typeof P.meta == "object" && this.addMetaSchema(P.meta), c.call(this), P.validateFormats = d;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: P, meta: H, schemaId: N } = this.opts;
      let d = S;
      N === "id" && (d = { ...S }, d.id = d.$id, delete d.$id), H && P && this.addMetaSchema(d, d[N], !1);
    }
    defaultMeta() {
      const { meta: P, schemaId: H } = this.opts;
      return this.opts.defaultMeta = typeof P == "object" ? P[H] || P : void 0;
    }
    validate(P, H) {
      let N;
      if (typeof P == "string") {
        if (N = this.getSchema(P), !N)
          throw new Error(`no schema with key or ref "${P}"`);
      } else
        N = this.compile(P);
      const d = N(H);
      return "$async" in N || (this.errors = N.errors), d;
    }
    compile(P, H) {
      const N = this._addSchema(P, H);
      return N.validate || this._compileSchemaEnv(N);
    }
    compileAsync(P, H) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: N } = this.opts;
      return d.call(this, P, H);
      async function d(ie, C) {
        await y.call(this, ie.$schema);
        const R = this._addSchema(ie, C);
        return R.validate || z.call(this, R);
      }
      async function y(ie) {
        ie && !this.getSchema(ie) && await d.call(this, { $ref: ie }, !0);
      }
      async function z(ie) {
        try {
          return this._compileSchemaEnv(ie);
        } catch (C) {
          if (!(C instanceof i.default))
            throw C;
          return J.call(this, C), await Y.call(this, C.missingSchema), z.call(this, ie);
        }
      }
      function J({ missingSchema: ie, missingRef: C }) {
        if (this.refs[ie])
          throw new Error(`AnySchema ${ie} is loaded but ${C} cannot be resolved`);
      }
      async function Y(ie) {
        const C = await se.call(this, ie);
        this.refs[ie] || await y.call(this, C.$schema), this.refs[ie] || this.addSchema(C, ie, H);
      }
      async function se(ie) {
        const C = this._loading[ie];
        if (C)
          return C;
        try {
          return await (this._loading[ie] = N(ie));
        } finally {
          delete this._loading[ie];
        }
      }
    }
    // Adds schema to the instance
    addSchema(P, H, N, d = this.opts.validateSchema) {
      if (Array.isArray(P)) {
        for (const z of P)
          this.addSchema(z, void 0, N, d);
        return this;
      }
      let y;
      if (typeof P == "object") {
        const { schemaId: z } = this.opts;
        if (y = P[z], y !== void 0 && typeof y != "string")
          throw new Error(`schema ${z} must be string`);
      }
      return H = (0, g.normalizeId)(H || y), this._checkUnique(H), this.schemas[H] = this._addSchema(P, N, H, d, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(P, H, N = this.opts.validateSchema) {
      return this.addSchema(P, H, !0, N), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(P, H) {
      if (typeof P == "boolean")
        return !0;
      let N;
      if (N = P.$schema, N !== void 0 && typeof N != "string")
        throw new Error("$schema must be a string");
      if (N = N || this.opts.defaultMeta || this.defaultMeta(), !N)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const d = this.validate(N, P);
      if (!d && H) {
        const y = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(y);
        else
          throw new Error(y);
      }
      return d;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(P) {
      let H;
      for (; typeof (H = o.call(this, P)) == "string"; )
        P = H;
      if (H === void 0) {
        const { schemaId: N } = this.opts, d = new m.SchemaEnv({ schema: {}, schemaId: N });
        if (H = m.resolveSchema.call(this, d, P), !H)
          return;
        this.refs[P] = H;
      }
      return H.validate || this._compileSchemaEnv(H);
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
          const H = o.call(this, P);
          return typeof H == "object" && this._cache.delete(H.schema), delete this.schemas[P], delete this.refs[P], this;
        }
        case "object": {
          const H = P;
          this._cache.delete(H);
          let N = P[this.opts.schemaId];
          return N && (N = (0, g.normalizeId)(N), delete this.schemas[N], delete this.refs[N]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(P) {
      for (const H of P)
        this.addKeyword(H);
      return this;
    }
    addKeyword(P, H) {
      let N;
      if (typeof P == "string")
        N = P, typeof H == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), H.keyword = N);
      else if (typeof P == "object" && H === void 0) {
        if (H = P, N = H.keyword, Array.isArray(N) && !N.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (D.call(this, N, H), !H)
        return (0, b.eachItem)(N, (y) => W.call(this, y)), this;
      G.call(this, H);
      const d = {
        ...H,
        type: (0, v.getJSONTypes)(H.type),
        schemaType: (0, v.getJSONTypes)(H.schemaType)
      };
      return (0, b.eachItem)(N, d.type.length === 0 ? (y) => W.call(this, y, d) : (y) => d.type.forEach((z) => W.call(this, y, d, z))), this;
    }
    getKeyword(P) {
      const H = this.RULES.all[P];
      return typeof H == "object" ? H.definition : !!H;
    }
    // Remove keyword
    removeKeyword(P) {
      const { RULES: H } = this;
      delete H.keywords[P], delete H.all[P];
      for (const N of H.rules) {
        const d = N.rules.findIndex((y) => y.keyword === P);
        d >= 0 && N.rules.splice(d, 1);
      }
      return this;
    }
    // Add format
    addFormat(P, H) {
      return typeof H == "string" && (H = new RegExp(H)), this.formats[P] = H, this;
    }
    errorsText(P = this.errors, { separator: H = ", ", dataVar: N = "data" } = {}) {
      return !P || P.length === 0 ? "No errors" : P.map((d) => `${N}${d.instancePath} ${d.message}`).reduce((d, y) => d + H + y);
    }
    $dataMetaSchema(P, H) {
      const N = this.RULES.all;
      P = JSON.parse(JSON.stringify(P));
      for (const d of H) {
        const y = d.split("/").slice(1);
        let z = P;
        for (const J of y)
          z = z[J];
        for (const J in N) {
          const Y = N[J];
          if (typeof Y != "object")
            continue;
          const { $data: se } = Y.definition, ie = z[J];
          se && ie && (z[J] = ee(ie));
        }
      }
      return P;
    }
    _removeAllSchemas(P, H) {
      for (const N in P) {
        const d = P[N];
        (!H || H.test(N)) && (typeof d == "string" ? delete P[N] : d && !d.meta && (this._cache.delete(d.schema), delete P[N]));
      }
    }
    _addSchema(P, H, N, d = this.opts.validateSchema, y = this.opts.addUsedSchema) {
      let z;
      const { schemaId: J } = this.opts;
      if (typeof P == "object")
        z = P[J];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof P != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let Y = this._cache.get(P);
      if (Y !== void 0)
        return Y;
      N = (0, g.normalizeId)(z || N);
      const se = g.getSchemaRefs.call(this, P, N);
      return Y = new m.SchemaEnv({ schema: P, schemaId: J, meta: H, baseId: N, localRefs: se }), this._cache.set(Y.schema, Y), y && !N.startsWith("#") && (N && this._checkUnique(N), this.refs[N] = Y), d && this.validateSchema(P, !0), Y;
    }
    _checkUnique(P) {
      if (this.schemas[P] || this.refs[P])
        throw new Error(`schema with key or id "${P}" already exists`);
    }
    _compileSchemaEnv(P) {
      if (P.meta ? this._compileMetaSchema(P) : m.compileSchema.call(this, P), !P.validate)
        throw new Error("ajv implementation error");
      return P.validate;
    }
    _compileMetaSchema(P) {
      const H = this.opts;
      this.opts = this._metaOpts;
      try {
        m.compileSchema.call(this, P);
      } finally {
        this.opts = H;
      }
    }
  }
  e.default = r, r.ValidationError = a.default, r.MissingRefError = i.default;
  function s(q, P, H, N = "error") {
    for (const d in q) {
      const y = d;
      y in P && this.logger[N](`${H}: option ${d}. ${q[y]}`);
    }
  }
  function o(q) {
    return q = (0, g.normalizeId)(q), this.schemas[q] || this.refs[q];
  }
  function c() {
    const q = this.opts.schemas;
    if (q)
      if (Array.isArray(q))
        this.addSchema(q);
      else
        for (const P in q)
          this.addSchema(q[P], P);
  }
  function u() {
    for (const q in this.opts.formats) {
      const P = this.opts.formats[q];
      P && this.addFormat(q, P);
    }
  }
  function _(q) {
    if (Array.isArray(q)) {
      this.addVocabulary(q);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const P in q) {
      const H = q[P];
      H.keyword || (H.keyword = P), this.addKeyword(H);
    }
  }
  function f() {
    const q = { ...this.opts };
    for (const P of O)
      delete q[P];
    return q;
  }
  const j = { log() {
  }, warn() {
  }, error() {
  } };
  function F(q) {
    if (q === !1)
      return j;
    if (q === void 0)
      return console;
    if (q.log && q.warn && q.error)
      return q;
    throw new Error("logger must implement log, warn and error methods");
  }
  const U = /^[a-z_$][a-z0-9_$:-]*$/i;
  function D(q, P) {
    const { RULES: H } = this;
    if ((0, b.eachItem)(q, (N) => {
      if (H.keywords[N])
        throw new Error(`Keyword ${N} is already defined`);
      if (!U.test(N))
        throw new Error(`Keyword ${N} has invalid name`);
    }), !!P && P.$data && !("code" in P || "validate" in P))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function W(q, P, H) {
    var N;
    const d = P == null ? void 0 : P.post;
    if (H && d)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: y } = this;
    let z = d ? y.post : y.rules.find(({ type: Y }) => Y === H);
    if (z || (z = { type: H, rules: [] }, y.rules.push(z)), y.keywords[q] = !0, !P)
      return;
    const J = {
      keyword: q,
      definition: {
        ...P,
        type: (0, v.getJSONTypes)(P.type),
        schemaType: (0, v.getJSONTypes)(P.schemaType)
      }
    };
    P.before ? w.call(this, z, J, P.before) : z.rules.push(J), y.all[q] = J, (N = P.implements) === null || N === void 0 || N.forEach((Y) => this.addKeyword(Y));
  }
  function w(q, P, H) {
    const N = q.rules.findIndex((d) => d.keyword === H);
    N >= 0 ? q.rules.splice(N, 0, P) : (q.rules.push(P), this.logger.warn(`rule ${H} is not defined`));
  }
  function G(q) {
    let { metaSchema: P } = q;
    P !== void 0 && (q.$data && this.opts.$data && (P = ee(P)), q.validateSchema = this.compile(P, !0));
  }
  const Q = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function ee(q) {
    return { anyOf: [q, Q] };
  }
})(bn);
var qr = {}, Hr = {}, Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
const is = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Kr.default = is;
var $t = {};
Object.defineProperty($t, "__esModule", { value: !0 });
$t.callRef = $t.getValidate = void 0;
const cs = Yt, qa = le, Re = ue, St = ut(), Ha = Le, or = he, ls = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: n, it: a } = e, { baseId: i, schemaEnv: l, validateName: m, opts: p, self: g } = a, { root: v } = l;
    if ((n === "#" || n === "#/") && i === v.baseId)
      return S();
    const b = Ha.resolveRef.call(g, v, i, n);
    if (b === void 0)
      throw new cs.default(a.opts.uriResolver, i, n);
    if (b instanceof Ha.SchemaEnv)
      return I(b);
    return M(b);
    function S() {
      if (l === v)
        return hr(e, m, l, l.$async);
      const O = t.scopeValue("root", { ref: v });
      return hr(e, (0, Re._)`${O}.validate`, v, v.$async);
    }
    function I(O) {
      const x = Tn(e, O);
      hr(e, x, O, O.$async);
    }
    function M(O) {
      const x = t.scopeValue("schema", p.code.source === !0 ? { ref: O, code: (0, Re.stringify)(O) } : { ref: O }), T = t.name("valid"), k = e.subschema({
        schema: O,
        dataTypes: [],
        schemaPath: Re.nil,
        topSchemaRef: x,
        errSchemaPath: n
      }, T);
      e.mergeEvaluated(k), e.ok(T);
    }
  }
};
function Tn(e, t) {
  const { gen: n } = e;
  return t.validate ? n.scopeValue("validate", { ref: t.validate }) : (0, Re._)`${n.scopeValue("wrapper", { ref: t })}.validate`;
}
$t.getValidate = Tn;
function hr(e, t, n, a) {
  const { gen: i, it: l } = e, { allErrors: m, schemaEnv: p, opts: g } = l, v = g.passContext ? St.default.this : Re.nil;
  a ? b() : S();
  function b() {
    if (!p.$async)
      throw new Error("async schema referenced by sync schema");
    const O = i.let("valid");
    i.try(() => {
      i.code((0, Re._)`await ${(0, qa.callValidateCode)(e, t, v)}`), M(t), m || i.assign(O, !0);
    }, (x) => {
      i.if((0, Re._)`!(${x} instanceof ${l.ValidationError})`, () => i.throw(x)), I(x), m || i.assign(O, !1);
    }), e.ok(O);
  }
  function S() {
    e.result((0, qa.callValidateCode)(e, t, v), () => M(t), () => I(t));
  }
  function I(O) {
    const x = (0, Re._)`${O}.errors`;
    i.assign(St.default.vErrors, (0, Re._)`${St.default.vErrors} === null ? ${x} : ${St.default.vErrors}.concat(${x})`), i.assign(St.default.errors, (0, Re._)`${St.default.vErrors}.length`);
  }
  function M(O) {
    var x;
    if (!l.opts.unevaluated)
      return;
    const T = (x = n == null ? void 0 : n.validate) === null || x === void 0 ? void 0 : x.evaluated;
    if (l.props !== !0)
      if (T && !T.dynamicProps)
        T.props !== void 0 && (l.props = or.mergeEvaluated.props(i, T.props, l.props));
      else {
        const k = i.var("props", (0, Re._)`${O}.evaluated.props`);
        l.props = or.mergeEvaluated.props(i, k, l.props, Re.Name);
      }
    if (l.items !== !0)
      if (T && !T.dynamicItems)
        T.items !== void 0 && (l.items = or.mergeEvaluated.items(i, T.items, l.items));
      else {
        const k = i.var("items", (0, Re._)`${O}.evaluated.items`);
        l.items = or.mergeEvaluated.items(i, k, l.items, Re.Name);
      }
  }
}
$t.callRef = hr;
$t.default = ls;
Object.defineProperty(Hr, "__esModule", { value: !0 });
const us = Kr, ds = $t, hs = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  us.default,
  ds.default
];
Hr.default = hs;
var Gr = {}, Wr = {};
Object.defineProperty(Wr, "__esModule", { value: !0 });
const mr = ue, st = mr.operators, gr = {
  maximum: { okStr: "<=", ok: st.LTE, fail: st.GT },
  minimum: { okStr: ">=", ok: st.GTE, fail: st.LT },
  exclusiveMaximum: { okStr: "<", ok: st.LT, fail: st.GTE },
  exclusiveMinimum: { okStr: ">", ok: st.GT, fail: st.LTE }
}, ps = {
  message: ({ keyword: e, schemaCode: t }) => (0, mr.str)`must be ${gr[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, mr._)`{comparison: ${gr[e].okStr}, limit: ${t}}`
}, fs = {
  keyword: Object.keys(gr),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: ps,
  code(e) {
    const { keyword: t, data: n, schemaCode: a } = e;
    e.fail$data((0, mr._)`${n} ${gr[t].fail} ${a} || isNaN(${n})`);
  }
};
Wr.default = fs;
var Jr = {};
Object.defineProperty(Jr, "__esModule", { value: !0 });
const Ft = ue, ms = {
  message: ({ schemaCode: e }) => (0, Ft.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Ft._)`{multipleOf: ${e}}`
}, gs = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: ms,
  code(e) {
    const { gen: t, data: n, schemaCode: a, it: i } = e, l = i.opts.multipleOfPrecision, m = t.let("res"), p = l ? (0, Ft._)`Math.abs(Math.round(${m}) - ${m}) > 1e-${l}` : (0, Ft._)`${m} !== parseInt(${m})`;
    e.fail$data((0, Ft._)`(${a} === 0 || (${m} = ${n}/${a}, ${p}))`);
  }
};
Jr.default = gs;
var Zr = {}, Yr = {};
Object.defineProperty(Yr, "__esModule", { value: !0 });
function Cn(e) {
  const t = e.length;
  let n = 0, a = 0, i;
  for (; a < t; )
    n++, i = e.charCodeAt(a++), i >= 55296 && i <= 56319 && a < t && (i = e.charCodeAt(a), (i & 64512) === 56320 && a++);
  return n;
}
Yr.default = Cn;
Cn.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Zr, "__esModule", { value: !0 });
const wt = ue, _s = he, bs = Yr, ws = {
  message({ keyword: e, schemaCode: t }) {
    const n = e === "maxLength" ? "more" : "fewer";
    return (0, wt.str)`must NOT have ${n} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, wt._)`{limit: ${e}}`
}, vs = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: ws,
  code(e) {
    const { keyword: t, data: n, schemaCode: a, it: i } = e, l = t === "maxLength" ? wt.operators.GT : wt.operators.LT, m = i.opts.unicode === !1 ? (0, wt._)`${n}.length` : (0, wt._)`${(0, _s.useFunc)(e.gen, bs.default)}(${n})`;
    e.fail$data((0, wt._)`${m} ${l} ${a}`);
  }
};
Zr.default = vs;
var Qr = {};
Object.defineProperty(Qr, "__esModule", { value: !0 });
const ys = le, _r = ue, $s = {
  message: ({ schemaCode: e }) => (0, _r.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, _r._)`{pattern: ${e}}`
}, ks = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: $s,
  code(e) {
    const { data: t, $data: n, schema: a, schemaCode: i, it: l } = e, m = l.opts.unicodeRegExp ? "u" : "", p = n ? (0, _r._)`(new RegExp(${i}, ${m}))` : (0, ys.usePattern)(e, a);
    e.fail$data((0, _r._)`!${p}.test(${t})`);
  }
};
Qr.default = ks;
var Xr = {};
Object.defineProperty(Xr, "__esModule", { value: !0 });
const Ut = ue, Ps = {
  message({ keyword: e, schemaCode: t }) {
    const n = e === "maxProperties" ? "more" : "fewer";
    return (0, Ut.str)`must NOT have ${n} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Ut._)`{limit: ${e}}`
}, Es = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Ps,
  code(e) {
    const { keyword: t, data: n, schemaCode: a } = e, i = t === "maxProperties" ? Ut.operators.GT : Ut.operators.LT;
    e.fail$data((0, Ut._)`Object.keys(${n}).length ${i} ${a}`);
  }
};
Xr.default = Es;
var ea = {};
Object.defineProperty(ea, "__esModule", { value: !0 });
const Vt = le, qt = ue, Ss = he, js = {
  message: ({ params: { missingProperty: e } }) => (0, qt.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, qt._)`{missingProperty: ${e}}`
}, xs = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: js,
  code(e) {
    const { gen: t, schema: n, schemaCode: a, data: i, $data: l, it: m } = e, { opts: p } = m;
    if (!l && n.length === 0)
      return;
    const g = n.length >= p.loopRequired;
    if (m.allErrors ? v() : b(), p.strictRequired) {
      const M = e.parentSchema.properties, { definedProperties: O } = e.it;
      for (const x of n)
        if ((M == null ? void 0 : M[x]) === void 0 && !O.has(x)) {
          const T = m.schemaEnv.baseId + m.errSchemaPath, k = `required property "${x}" is not defined at "${T}" (strictRequired)`;
          (0, Ss.checkStrictMode)(m, k, m.opts.strictRequired);
        }
    }
    function v() {
      if (g || l)
        e.block$data(qt.nil, S);
      else
        for (const M of n)
          (0, Vt.checkReportMissingProp)(e, M);
    }
    function b() {
      const M = t.let("missing");
      if (g || l) {
        const O = t.let("valid", !0);
        e.block$data(O, () => I(M, O)), e.ok(O);
      } else
        t.if((0, Vt.checkMissingProp)(e, n, M)), (0, Vt.reportMissingProp)(e, M), t.else();
    }
    function S() {
      t.forOf("prop", a, (M) => {
        e.setParams({ missingProperty: M }), t.if((0, Vt.noPropertyInData)(t, i, M, p.ownProperties), () => e.error());
      });
    }
    function I(M, O) {
      e.setParams({ missingProperty: M }), t.forOf(M, a, () => {
        t.assign(O, (0, Vt.propertyInData)(t, i, M, p.ownProperties)), t.if((0, qt.not)(O), () => {
          e.error(), t.break();
        });
      }, qt.nil);
    }
  }
};
ea.default = xs;
var ta = {};
Object.defineProperty(ta, "__esModule", { value: !0 });
const Ht = ue, Ts = {
  message({ keyword: e, schemaCode: t }) {
    const n = e === "maxItems" ? "more" : "fewer";
    return (0, Ht.str)`must NOT have ${n} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Ht._)`{limit: ${e}}`
}, Cs = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Ts,
  code(e) {
    const { keyword: t, data: n, schemaCode: a } = e, i = t === "maxItems" ? Ht.operators.GT : Ht.operators.LT;
    e.fail$data((0, Ht._)`${n}.length ${i} ${a}`);
  }
};
ta.default = Cs;
var ra = {}, Qt = {};
Object.defineProperty(Qt, "__esModule", { value: !0 });
const On = $n;
On.code = 'require("ajv/dist/runtime/equal").default';
Qt.default = On;
Object.defineProperty(ra, "__esModule", { value: !0 });
const xr = Wt, Oe = ue, Os = he, As = Qt, Is = {
  message: ({ params: { i: e, j: t } }) => (0, Oe.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Oe._)`{i: ${e}, j: ${t}}`
}, Ns = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Is,
  code(e) {
    const { gen: t, data: n, $data: a, schema: i, parentSchema: l, schemaCode: m, it: p } = e;
    if (!a && !i)
      return;
    const g = t.let("valid"), v = l.items ? (0, xr.getSchemaTypes)(l.items) : [];
    e.block$data(g, b, (0, Oe._)`${m} === false`), e.ok(g);
    function b() {
      const O = t.let("i", (0, Oe._)`${n}.length`), x = t.let("j");
      e.setParams({ i: O, j: x }), t.assign(g, !0), t.if((0, Oe._)`${O} > 1`, () => (S() ? I : M)(O, x));
    }
    function S() {
      return v.length > 0 && !v.some((O) => O === "object" || O === "array");
    }
    function I(O, x) {
      const T = t.name("item"), k = (0, xr.checkDataTypes)(v, T, p.opts.strictNumbers, xr.DataType.Wrong), A = t.const("indices", (0, Oe._)`{}`);
      t.for((0, Oe._)`;${O}--;`, () => {
        t.let(T, (0, Oe._)`${n}[${O}]`), t.if(k, (0, Oe._)`continue`), v.length > 1 && t.if((0, Oe._)`typeof ${T} == "string"`, (0, Oe._)`${T} += "_"`), t.if((0, Oe._)`typeof ${A}[${T}] == "number"`, () => {
          t.assign(x, (0, Oe._)`${A}[${T}]`), e.error(), t.assign(g, !1).break();
        }).code((0, Oe._)`${A}[${T}] = ${O}`);
      });
    }
    function M(O, x) {
      const T = (0, Os.useFunc)(t, As.default), k = t.name("outer");
      t.label(k).for((0, Oe._)`;${O}--;`, () => t.for((0, Oe._)`${x} = ${O}; ${x}--;`, () => t.if((0, Oe._)`${T}(${n}[${O}], ${n}[${x}])`, () => {
        e.error(), t.assign(g, !1).break(k);
      })));
    }
  }
};
ra.default = Ns;
var aa = {};
Object.defineProperty(aa, "__esModule", { value: !0 });
const Mr = ue, Ms = he, Rs = Qt, Ls = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Mr._)`{allowedValue: ${e}}`
}, zs = {
  keyword: "const",
  $data: !0,
  error: Ls,
  code(e) {
    const { gen: t, data: n, $data: a, schemaCode: i, schema: l } = e;
    a || l && typeof l == "object" ? e.fail$data((0, Mr._)`!${(0, Ms.useFunc)(t, Rs.default)}(${n}, ${i})`) : e.fail((0, Mr._)`${l} !== ${n}`);
  }
};
aa.default = zs;
var na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
const Bt = ue, Ds = he, Vs = Qt, Bs = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Bt._)`{allowedValues: ${e}}`
}, Fs = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Bs,
  code(e) {
    const { gen: t, data: n, $data: a, schema: i, schemaCode: l, it: m } = e;
    if (!a && i.length === 0)
      throw new Error("enum must have non-empty array");
    const p = i.length >= m.opts.loopEnum;
    let g;
    const v = () => g ?? (g = (0, Ds.useFunc)(t, Vs.default));
    let b;
    if (p || a)
      b = t.let("valid"), e.block$data(b, S);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const M = t.const("vSchema", l);
      b = (0, Bt.or)(...i.map((O, x) => I(M, x)));
    }
    e.pass(b);
    function S() {
      t.assign(b, !1), t.forOf("v", l, (M) => t.if((0, Bt._)`${v()}(${n}, ${M})`, () => t.assign(b, !0).break()));
    }
    function I(M, O) {
      const x = i[O];
      return typeof x == "object" && x !== null ? (0, Bt._)`${v()}(${n}, ${M}[${O}])` : (0, Bt._)`${n} === ${x}`;
    }
  }
};
na.default = Fs;
Object.defineProperty(Gr, "__esModule", { value: !0 });
const Us = Wr, qs = Jr, Hs = Zr, Ks = Qr, Gs = Xr, Ws = ea, Js = ta, Zs = ra, Ys = aa, Qs = na, Xs = [
  // number
  Us.default,
  qs.default,
  // string
  Hs.default,
  Ks.default,
  // object
  Gs.default,
  Ws.default,
  // array
  Js.default,
  Zs.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Ys.default,
  Qs.default
];
Gr.default = Xs;
var oa = {}, It = {};
Object.defineProperty(It, "__esModule", { value: !0 });
It.validateAdditionalItems = void 0;
const vt = ue, Rr = he, ei = {
  message: ({ params: { len: e } }) => (0, vt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, vt._)`{limit: ${e}}`
}, ti = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: ei,
  code(e) {
    const { parentSchema: t, it: n } = e, { items: a } = t;
    if (!Array.isArray(a)) {
      (0, Rr.checkStrictMode)(n, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    An(e, a);
  }
};
function An(e, t) {
  const { gen: n, schema: a, data: i, keyword: l, it: m } = e;
  m.items = !0;
  const p = n.const("len", (0, vt._)`${i}.length`);
  if (a === !1)
    e.setParams({ len: t.length }), e.pass((0, vt._)`${p} <= ${t.length}`);
  else if (typeof a == "object" && !(0, Rr.alwaysValidSchema)(m, a)) {
    const v = n.var("valid", (0, vt._)`${p} <= ${t.length}`);
    n.if((0, vt.not)(v), () => g(v)), e.ok(v);
  }
  function g(v) {
    n.forRange("i", t.length, p, (b) => {
      e.subschema({ keyword: l, dataProp: b, dataPropType: Rr.Type.Num }, v), m.allErrors || n.if((0, vt.not)(v), () => n.break());
    });
  }
}
It.validateAdditionalItems = An;
It.default = ti;
var sa = {}, Nt = {};
Object.defineProperty(Nt, "__esModule", { value: !0 });
Nt.validateTuple = void 0;
const Ka = ue, pr = he, ri = le, ai = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: n } = e;
    if (Array.isArray(t))
      return In(e, "additionalItems", t);
    n.items = !0, !(0, pr.alwaysValidSchema)(n, t) && e.ok((0, ri.validateArray)(e));
  }
};
function In(e, t, n = e.schema) {
  const { gen: a, parentSchema: i, data: l, keyword: m, it: p } = e;
  b(i), p.opts.unevaluated && n.length && p.items !== !0 && (p.items = pr.mergeEvaluated.items(a, n.length, p.items));
  const g = a.name("valid"), v = a.const("len", (0, Ka._)`${l}.length`);
  n.forEach((S, I) => {
    (0, pr.alwaysValidSchema)(p, S) || (a.if((0, Ka._)`${v} > ${I}`, () => e.subschema({
      keyword: m,
      schemaProp: I,
      dataProp: I
    }, g)), e.ok(g));
  });
  function b(S) {
    const { opts: I, errSchemaPath: M } = p, O = n.length, x = O === S.minItems && (O === S.maxItems || S[t] === !1);
    if (I.strictTuples && !x) {
      const T = `"${m}" is ${O}-tuple, but minItems or maxItems/${t} are not specified or different at path "${M}"`;
      (0, pr.checkStrictMode)(p, T, I.strictTuples);
    }
  }
}
Nt.validateTuple = In;
Nt.default = ai;
Object.defineProperty(sa, "__esModule", { value: !0 });
const ni = Nt, oi = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, ni.validateTuple)(e, "items")
};
sa.default = oi;
var ia = {};
Object.defineProperty(ia, "__esModule", { value: !0 });
const Ga = ue, si = he, ii = le, ci = It, li = {
  message: ({ params: { len: e } }) => (0, Ga.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Ga._)`{limit: ${e}}`
}, ui = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: li,
  code(e) {
    const { schema: t, parentSchema: n, it: a } = e, { prefixItems: i } = n;
    a.items = !0, !(0, si.alwaysValidSchema)(a, t) && (i ? (0, ci.validateAdditionalItems)(e, i) : e.ok((0, ii.validateArray)(e)));
  }
};
ia.default = ui;
var ca = {};
Object.defineProperty(ca, "__esModule", { value: !0 });
const qe = ue, sr = he, di = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, qe.str)`must contain at least ${e} valid item(s)` : (0, qe.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, qe._)`{minContains: ${e}}` : (0, qe._)`{minContains: ${e}, maxContains: ${t}}`
}, hi = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: di,
  code(e) {
    const { gen: t, schema: n, parentSchema: a, data: i, it: l } = e;
    let m, p;
    const { minContains: g, maxContains: v } = a;
    l.opts.next ? (m = g === void 0 ? 1 : g, p = v) : m = 1;
    const b = t.const("len", (0, qe._)`${i}.length`);
    if (e.setParams({ min: m, max: p }), p === void 0 && m === 0) {
      (0, sr.checkStrictMode)(l, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (p !== void 0 && m > p) {
      (0, sr.checkStrictMode)(l, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, sr.alwaysValidSchema)(l, n)) {
      let x = (0, qe._)`${b} >= ${m}`;
      p !== void 0 && (x = (0, qe._)`${x} && ${b} <= ${p}`), e.pass(x);
      return;
    }
    l.items = !0;
    const S = t.name("valid");
    p === void 0 && m === 1 ? M(S, () => t.if(S, () => t.break())) : m === 0 ? (t.let(S, !0), p !== void 0 && t.if((0, qe._)`${i}.length > 0`, I)) : (t.let(S, !1), I()), e.result(S, () => e.reset());
    function I() {
      const x = t.name("_valid"), T = t.let("count", 0);
      M(x, () => t.if(x, () => O(T)));
    }
    function M(x, T) {
      t.forRange("i", 0, b, (k) => {
        e.subschema({
          keyword: "contains",
          dataProp: k,
          dataPropType: sr.Type.Num,
          compositeRule: !0
        }, x), T();
      });
    }
    function O(x) {
      t.code((0, qe._)`${x}++`), p === void 0 ? t.if((0, qe._)`${x} >= ${m}`, () => t.assign(S, !0).break()) : (t.if((0, qe._)`${x} > ${p}`, () => t.assign(S, !1).break()), m === 1 ? t.assign(S, !0) : t.if((0, qe._)`${x} >= ${m}`, () => t.assign(S, !0)));
    }
  }
};
ca.default = hi;
var Nn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = ue, n = he, a = le;
  e.error = {
    message: ({ params: { property: g, depsCount: v, deps: b } }) => {
      const S = v === 1 ? "property" : "properties";
      return (0, t.str)`must have ${S} ${b} when property ${g} is present`;
    },
    params: ({ params: { property: g, depsCount: v, deps: b, missingProperty: S } }) => (0, t._)`{property: ${g},
    missingProperty: ${S},
    depsCount: ${v},
    deps: ${b}}`
    // TODO change to reference
  };
  const i = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(g) {
      const [v, b] = l(g);
      m(g, v), p(g, b);
    }
  };
  function l({ schema: g }) {
    const v = {}, b = {};
    for (const S in g) {
      if (S === "__proto__")
        continue;
      const I = Array.isArray(g[S]) ? v : b;
      I[S] = g[S];
    }
    return [v, b];
  }
  function m(g, v = g.schema) {
    const { gen: b, data: S, it: I } = g;
    if (Object.keys(v).length === 0)
      return;
    const M = b.let("missing");
    for (const O in v) {
      const x = v[O];
      if (x.length === 0)
        continue;
      const T = (0, a.propertyInData)(b, S, O, I.opts.ownProperties);
      g.setParams({
        property: O,
        depsCount: x.length,
        deps: x.join(", ")
      }), I.allErrors ? b.if(T, () => {
        for (const k of x)
          (0, a.checkReportMissingProp)(g, k);
      }) : (b.if((0, t._)`${T} && (${(0, a.checkMissingProp)(g, x, M)})`), (0, a.reportMissingProp)(g, M), b.else());
    }
  }
  e.validatePropertyDeps = m;
  function p(g, v = g.schema) {
    const { gen: b, data: S, keyword: I, it: M } = g, O = b.name("valid");
    for (const x in v)
      (0, n.alwaysValidSchema)(M, v[x]) || (b.if(
        (0, a.propertyInData)(b, S, x, M.opts.ownProperties),
        () => {
          const T = g.subschema({ keyword: I, schemaProp: x }, O);
          g.mergeValidEvaluated(T, O);
        },
        () => b.var(O, !0)
        // TODO var
      ), g.ok(O));
  }
  e.validateSchemaDeps = p, e.default = i;
})(Nn);
var la = {};
Object.defineProperty(la, "__esModule", { value: !0 });
const Mn = ue, pi = he, fi = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Mn._)`{propertyName: ${e.propertyName}}`
}, mi = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: fi,
  code(e) {
    const { gen: t, schema: n, data: a, it: i } = e;
    if ((0, pi.alwaysValidSchema)(i, n))
      return;
    const l = t.name("valid");
    t.forIn("key", a, (m) => {
      e.setParams({ propertyName: m }), e.subschema({
        keyword: "propertyNames",
        data: m,
        dataTypes: ["string"],
        propertyName: m,
        compositeRule: !0
      }, l), t.if((0, Mn.not)(l), () => {
        e.error(!0), i.allErrors || t.break();
      });
    }), e.ok(l);
  }
};
la.default = mi;
var Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
const ir = le, We = ue, gi = ut(), cr = he, _i = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, We._)`{additionalProperty: ${e.additionalProperty}}`
}, bi = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: _i,
  code(e) {
    const { gen: t, schema: n, parentSchema: a, data: i, errsCount: l, it: m } = e;
    if (!l)
      throw new Error("ajv implementation error");
    const { allErrors: p, opts: g } = m;
    if (m.props = !0, g.removeAdditional !== "all" && (0, cr.alwaysValidSchema)(m, n))
      return;
    const v = (0, ir.allSchemaProperties)(a.properties), b = (0, ir.allSchemaProperties)(a.patternProperties);
    S(), e.ok((0, We._)`${l} === ${gi.default.errors}`);
    function S() {
      t.forIn("key", i, (T) => {
        !v.length && !b.length ? O(T) : t.if(I(T), () => O(T));
      });
    }
    function I(T) {
      let k;
      if (v.length > 8) {
        const A = (0, cr.schemaRefOrVal)(m, a.properties, "properties");
        k = (0, ir.isOwnProperty)(t, A, T);
      } else
        v.length ? k = (0, We.or)(...v.map((A) => (0, We._)`${T} === ${A}`)) : k = We.nil;
      return b.length && (k = (0, We.or)(k, ...b.map((A) => (0, We._)`${(0, ir.usePattern)(e, A)}.test(${T})`))), (0, We.not)(k);
    }
    function M(T) {
      t.code((0, We._)`delete ${i}[${T}]`);
    }
    function O(T) {
      if (g.removeAdditional === "all" || g.removeAdditional && n === !1) {
        M(T);
        return;
      }
      if (n === !1) {
        e.setParams({ additionalProperty: T }), e.error(), p || t.break();
        return;
      }
      if (typeof n == "object" && !(0, cr.alwaysValidSchema)(m, n)) {
        const k = t.name("valid");
        g.removeAdditional === "failing" ? (x(T, k, !1), t.if((0, We.not)(k), () => {
          e.reset(), M(T);
        })) : (x(T, k), p || t.if((0, We.not)(k), () => t.break()));
      }
    }
    function x(T, k, A) {
      const L = {
        keyword: "additionalProperties",
        dataProp: T,
        dataPropType: cr.Type.Str
      };
      A === !1 && Object.assign(L, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(L, k);
    }
  }
};
Pr.default = bi;
var ua = {};
Object.defineProperty(ua, "__esModule", { value: !0 });
const wi = yr(), Wa = le, Tr = he, Ja = Pr, vi = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: n, parentSchema: a, data: i, it: l } = e;
    l.opts.removeAdditional === "all" && a.additionalProperties === void 0 && Ja.default.code(new wi.KeywordCxt(l, Ja.default, "additionalProperties"));
    const m = (0, Wa.allSchemaProperties)(n);
    for (const S of m)
      l.definedProperties.add(S);
    l.opts.unevaluated && m.length && l.props !== !0 && (l.props = Tr.mergeEvaluated.props(t, (0, Tr.toHash)(m), l.props));
    const p = m.filter((S) => !(0, Tr.alwaysValidSchema)(l, n[S]));
    if (p.length === 0)
      return;
    const g = t.name("valid");
    for (const S of p)
      v(S) ? b(S) : (t.if((0, Wa.propertyInData)(t, i, S, l.opts.ownProperties)), b(S), l.allErrors || t.else().var(g, !0), t.endIf()), e.it.definedProperties.add(S), e.ok(g);
    function v(S) {
      return l.opts.useDefaults && !l.compositeRule && n[S].default !== void 0;
    }
    function b(S) {
      e.subschema({
        keyword: "properties",
        schemaProp: S,
        dataProp: S
      }, g);
    }
  }
};
ua.default = vi;
var da = {};
Object.defineProperty(da, "__esModule", { value: !0 });
const Za = le, lr = ue, Ya = he, Qa = he, yi = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: n, data: a, parentSchema: i, it: l } = e, { opts: m } = l, p = (0, Za.allSchemaProperties)(n), g = p.filter((x) => (0, Ya.alwaysValidSchema)(l, n[x]));
    if (p.length === 0 || g.length === p.length && (!l.opts.unevaluated || l.props === !0))
      return;
    const v = m.strictSchema && !m.allowMatchingProperties && i.properties, b = t.name("valid");
    l.props !== !0 && !(l.props instanceof lr.Name) && (l.props = (0, Qa.evaluatedPropsToName)(t, l.props));
    const { props: S } = l;
    I();
    function I() {
      for (const x of p)
        v && M(x), l.allErrors ? O(x) : (t.var(b, !0), O(x), t.if(b));
    }
    function M(x) {
      for (const T in v)
        new RegExp(x).test(T) && (0, Ya.checkStrictMode)(l, `property ${T} matches pattern ${x} (use allowMatchingProperties)`);
    }
    function O(x) {
      t.forIn("key", a, (T) => {
        t.if((0, lr._)`${(0, Za.usePattern)(e, x)}.test(${T})`, () => {
          const k = g.includes(x);
          k || e.subschema({
            keyword: "patternProperties",
            schemaProp: x,
            dataProp: T,
            dataPropType: Qa.Type.Str
          }, b), l.opts.unevaluated && S !== !0 ? t.assign((0, lr._)`${S}[${T}]`, !0) : !k && !l.allErrors && t.if((0, lr.not)(b), () => t.break());
        });
      });
    }
  }
};
da.default = yi;
var ha = {};
Object.defineProperty(ha, "__esModule", { value: !0 });
const $i = he, ki = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: n, it: a } = e;
    if ((0, $i.alwaysValidSchema)(a, n)) {
      e.fail();
      return;
    }
    const i = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, i), e.failResult(i, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
ha.default = ki;
var pa = {};
Object.defineProperty(pa, "__esModule", { value: !0 });
const Pi = le, Ei = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Pi.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
pa.default = Ei;
var fa = {};
Object.defineProperty(fa, "__esModule", { value: !0 });
const fr = ue, Si = he, ji = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, fr._)`{passingSchemas: ${e.passing}}`
}, xi = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: ji,
  code(e) {
    const { gen: t, schema: n, parentSchema: a, it: i } = e;
    if (!Array.isArray(n))
      throw new Error("ajv implementation error");
    if (i.opts.discriminator && a.discriminator)
      return;
    const l = n, m = t.let("valid", !1), p = t.let("passing", null), g = t.name("_valid");
    e.setParams({ passing: p }), t.block(v), e.result(m, () => e.reset(), () => e.error(!0));
    function v() {
      l.forEach((b, S) => {
        let I;
        (0, Si.alwaysValidSchema)(i, b) ? t.var(g, !0) : I = e.subschema({
          keyword: "oneOf",
          schemaProp: S,
          compositeRule: !0
        }, g), S > 0 && t.if((0, fr._)`${g} && ${m}`).assign(m, !1).assign(p, (0, fr._)`[${p}, ${S}]`).else(), t.if(g, () => {
          t.assign(m, !0), t.assign(p, S), I && e.mergeEvaluated(I, fr.Name);
        });
      });
    }
  }
};
fa.default = xi;
var ma = {};
Object.defineProperty(ma, "__esModule", { value: !0 });
const Ti = he, Ci = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: n, it: a } = e;
    if (!Array.isArray(n))
      throw new Error("ajv implementation error");
    const i = t.name("valid");
    n.forEach((l, m) => {
      if ((0, Ti.alwaysValidSchema)(a, l))
        return;
      const p = e.subschema({ keyword: "allOf", schemaProp: m }, i);
      e.ok(i), e.mergeEvaluated(p);
    });
  }
};
ma.default = Ci;
var ga = {};
Object.defineProperty(ga, "__esModule", { value: !0 });
const br = ue, Rn = he, Oi = {
  message: ({ params: e }) => (0, br.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, br._)`{failingKeyword: ${e.ifClause}}`
}, Ai = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Oi,
  code(e) {
    const { gen: t, parentSchema: n, it: a } = e;
    n.then === void 0 && n.else === void 0 && (0, Rn.checkStrictMode)(a, '"if" without "then" and "else" is ignored');
    const i = Xa(a, "then"), l = Xa(a, "else");
    if (!i && !l)
      return;
    const m = t.let("valid", !0), p = t.name("_valid");
    if (g(), e.reset(), i && l) {
      const b = t.let("ifClause");
      e.setParams({ ifClause: b }), t.if(p, v("then", b), v("else", b));
    } else
      i ? t.if(p, v("then")) : t.if((0, br.not)(p), v("else"));
    e.pass(m, () => e.error(!0));
    function g() {
      const b = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, p);
      e.mergeEvaluated(b);
    }
    function v(b, S) {
      return () => {
        const I = e.subschema({ keyword: b }, p);
        t.assign(m, p), e.mergeValidEvaluated(I, m), S ? t.assign(S, (0, br._)`${b}`) : e.setParams({ ifClause: b });
      };
    }
  }
};
function Xa(e, t) {
  const n = e.schema[t];
  return n !== void 0 && !(0, Rn.alwaysValidSchema)(e, n);
}
ga.default = Ai;
var _a = {};
Object.defineProperty(_a, "__esModule", { value: !0 });
const Ii = he, Ni = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: n }) {
    t.if === void 0 && (0, Ii.checkStrictMode)(n, `"${e}" without "if" is ignored`);
  }
};
_a.default = Ni;
Object.defineProperty(oa, "__esModule", { value: !0 });
const Mi = It, Ri = sa, Li = Nt, zi = ia, Di = ca, Vi = Nn, Bi = la, Fi = Pr, Ui = ua, qi = da, Hi = ha, Ki = pa, Gi = fa, Wi = ma, Ji = ga, Zi = _a;
function Yi(e = !1) {
  const t = [
    // any
    Hi.default,
    Ki.default,
    Gi.default,
    Wi.default,
    Ji.default,
    Zi.default,
    // object
    Bi.default,
    Fi.default,
    Vi.default,
    Ui.default,
    qi.default
  ];
  return e ? t.push(Ri.default, zi.default) : t.push(Mi.default, Li.default), t.push(Di.default), t;
}
oa.default = Yi;
var ba = {}, wa = {};
Object.defineProperty(wa, "__esModule", { value: !0 });
const $e = ue, Qi = {
  message: ({ schemaCode: e }) => (0, $e.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, $e._)`{format: ${e}}`
}, Xi = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Qi,
  code(e, t) {
    const { gen: n, data: a, $data: i, schema: l, schemaCode: m, it: p } = e, { opts: g, errSchemaPath: v, schemaEnv: b, self: S } = p;
    if (!g.validateFormats)
      return;
    i ? I() : M();
    function I() {
      const O = n.scopeValue("formats", {
        ref: S.formats,
        code: g.code.formats
      }), x = n.const("fDef", (0, $e._)`${O}[${m}]`), T = n.let("fType"), k = n.let("format");
      n.if((0, $e._)`typeof ${x} == "object" && !(${x} instanceof RegExp)`, () => n.assign(T, (0, $e._)`${x}.type || "string"`).assign(k, (0, $e._)`${x}.validate`), () => n.assign(T, (0, $e._)`"string"`).assign(k, x)), e.fail$data((0, $e.or)(A(), L()));
      function A() {
        return g.strictSchema === !1 ? $e.nil : (0, $e._)`${m} && !${k}`;
      }
      function L() {
        const r = b.$async ? (0, $e._)`(${x}.async ? await ${k}(${a}) : ${k}(${a}))` : (0, $e._)`${k}(${a})`, s = (0, $e._)`(typeof ${k} == "function" ? ${r} : ${k}.test(${a}))`;
        return (0, $e._)`${k} && ${k} !== true && ${T} === ${t} && !${s}`;
      }
    }
    function M() {
      const O = S.formats[l];
      if (!O) {
        A();
        return;
      }
      if (O === !0)
        return;
      const [x, T, k] = L(O);
      x === t && e.pass(r());
      function A() {
        if (g.strictSchema === !1) {
          S.logger.warn(s());
          return;
        }
        throw new Error(s());
        function s() {
          return `unknown format "${l}" ignored in schema at path "${v}"`;
        }
      }
      function L(s) {
        const o = s instanceof RegExp ? (0, $e.regexpCode)(s) : g.code.formats ? (0, $e._)`${g.code.formats}${(0, $e.getProperty)(l)}` : void 0, c = n.scopeValue("formats", { key: l, ref: s, code: o });
        return typeof s == "object" && !(s instanceof RegExp) ? [s.type || "string", s.validate, (0, $e._)`${c}.validate`] : ["string", s, c];
      }
      function r() {
        if (typeof O == "object" && !(O instanceof RegExp) && O.async) {
          if (!b.$async)
            throw new Error("async format in sync schema");
          return (0, $e._)`await ${k}(${a})`;
        }
        return typeof T == "function" ? (0, $e._)`${k}(${a})` : (0, $e._)`${k}.test(${a})`;
      }
    }
  }
};
wa.default = Xi;
Object.defineProperty(ba, "__esModule", { value: !0 });
const ec = wa, tc = [ec.default];
ba.default = tc;
var At = {};
Object.defineProperty(At, "__esModule", { value: !0 });
At.contentVocabulary = At.metadataVocabulary = void 0;
At.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
At.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(qr, "__esModule", { value: !0 });
const rc = Hr, ac = Gr, nc = oa, oc = ba, en = At, sc = [
  rc.default,
  ac.default,
  (0, nc.default)(),
  oc.default,
  en.metadataVocabulary,
  en.contentVocabulary
];
qr.default = sc;
var va = {}, Ln = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.DiscrError = void 0, function(t) {
    t.Tag = "tag", t.Mapping = "mapping";
  }(e.DiscrError || (e.DiscrError = {}));
})(Ln);
Object.defineProperty(va, "__esModule", { value: !0 });
const jt = ue, Lr = Ln, tn = Le, ic = he, cc = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Lr.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: n } }) => (0, jt._)`{error: ${e}, tag: ${n}, tagValue: ${t}}`
}, lc = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: cc,
  code(e) {
    const { gen: t, data: n, schema: a, parentSchema: i, it: l } = e, { oneOf: m } = i;
    if (!l.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const p = a.propertyName;
    if (typeof p != "string")
      throw new Error("discriminator: requires propertyName");
    if (a.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!m)
      throw new Error("discriminator: requires oneOf keyword");
    const g = t.let("valid", !1), v = t.const("tag", (0, jt._)`${n}${(0, jt.getProperty)(p)}`);
    t.if((0, jt._)`typeof ${v} == "string"`, () => b(), () => e.error(!1, { discrError: Lr.DiscrError.Tag, tag: v, tagName: p })), e.ok(g);
    function b() {
      const M = I();
      t.if(!1);
      for (const O in M)
        t.elseIf((0, jt._)`${v} === ${O}`), t.assign(g, S(M[O]));
      t.else(), e.error(!1, { discrError: Lr.DiscrError.Mapping, tag: v, tagName: p }), t.endIf();
    }
    function S(M) {
      const O = t.name("valid"), x = e.subschema({ keyword: "oneOf", schemaProp: M }, O);
      return e.mergeEvaluated(x, jt.Name), O;
    }
    function I() {
      var M;
      const O = {}, x = k(i);
      let T = !0;
      for (let r = 0; r < m.length; r++) {
        let s = m[r];
        s != null && s.$ref && !(0, ic.schemaHasRulesButRef)(s, l.self.RULES) && (s = tn.resolveRef.call(l.self, l.schemaEnv.root, l.baseId, s == null ? void 0 : s.$ref), s instanceof tn.SchemaEnv && (s = s.schema));
        const o = (M = s == null ? void 0 : s.properties) === null || M === void 0 ? void 0 : M[p];
        if (typeof o != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${p}"`);
        T = T && (x || k(s)), A(o, r);
      }
      if (!T)
        throw new Error(`discriminator: "${p}" must be required`);
      return O;
      function k({ required: r }) {
        return Array.isArray(r) && r.includes(p);
      }
      function A(r, s) {
        if (r.const)
          L(r.const, s);
        else if (r.enum)
          for (const o of r.enum)
            L(o, s);
        else
          throw new Error(`discriminator: "properties/${p}" must have "const" or "enum"`);
      }
      function L(r, s) {
        if (typeof r != "string" || r in O)
          throw new Error(`discriminator: "${p}" values must be unique strings`);
        O[r] = s;
      }
    }
  }
};
va.default = lc;
const uc = "http://json-schema.org/draft-07/schema#", dc = "http://json-schema.org/draft-07/schema#", hc = "Core schema meta-schema", pc = {
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
}, fc = [
  "object",
  "boolean"
], mc = {
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
}, gc = {
  $schema: uc,
  $id: dc,
  title: hc,
  definitions: pc,
  type: fc,
  properties: mc,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = void 0;
  const n = bn, a = qr, i = va, l = gc, m = ["/properties"], p = "http://json-schema.org/draft-07/schema";
  class g extends n.default {
    _addVocabularies() {
      super._addVocabularies(), a.default.forEach((O) => this.addVocabulary(O)), this.opts.discriminator && this.addKeyword(i.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const O = this.opts.$data ? this.$dataMetaSchema(l, m) : l;
      this.addMetaSchema(O, p, !1), this.refs["http://json-schema.org/schema"] = p;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(p) ? p : void 0);
    }
  }
  e.exports = t = g, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = g;
  var v = yr();
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return v.KeywordCxt;
  } });
  var b = ue;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return b._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return b.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return b.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return b.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return b.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return b.CodeGen;
  } });
  var S = Zt;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return S.default;
  } });
  var I = Yt;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return I.default;
  } });
})(Or, Or.exports);
var _c = Or.exports;
const bc = /* @__PURE__ */ _n(_c);
class wc {
  constructor() {
    xe(this, "ajv"), this.ajv = new bc();
  }
  validateJson(t, n) {
    const a = this.ajv.validate(t, n);
    return a ? { valid: a } : { valid: a, error: this.ajv.errorsText() };
  }
  validateObjectSchema(t, n) {
    const a = this.ajv.validate(t, n);
    return a ? { valid: a } : { valid: a, error: this.ajv.errorsText() };
  }
}
class vc {
  constructor() {
    xe(this, "TIME_SPLIT", " ");
  }
  /**
   * 给日期添加小时
   *
   * @param date - Date
   * @param numOfHours - 数字
   * @author terwer
   * @since 1.0.0
   */
  addHoursToDate(t, n) {
    return t.setTime(t.getTime() + n * 60 * 60 * 1e3), t;
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
  formatIsoToZhDateFormat(t, n, a) {
    if (!t)
      return "";
    let i = t;
    const l = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(.\d{3})Z$/gm, m = i.match(l);
    if (m == null)
      return t;
    for (let p = 0; p < m.length; p++) {
      const g = m[p];
      let v = g;
      n && (v = this.addHoursToDate(new Date(g), 8).toISOString());
      const b = v.split("T"), S = b[0], I = b[1].split(".")[0];
      let M = S + this.TIME_SPLIT + I;
      a && (M = S), i = i.replace(g, M);
    }
    return i;
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
class yc {
  /**
   * 格式化字符串
   *
   * @param str - 字符串，可用占位符，例如：test \{0\} str
   * @param args - 按占位符顺序排列的参数
   * @author terwer
   * @since 0.0.1
   */
  f(t, ...n) {
    let a = t;
    for (let i = 0; i < n.length; i++) {
      const l = n[i];
      typeof l == "string" ? a = a.replace(`{${i}}`, l) : a = a.replace(`{${i}}`, l.toString());
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
  includeInArray(t, n) {
    let a = !1;
    for (let i = 0; i < n.length; i++) {
      const l = n[i];
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
  getByLength(t, n, a) {
    const i = t;
    return i.length < n ? i : a ? i.substring(0, n) : i.substring(0, n) + "...";
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
  pathJoin(t, n) {
    let a = t;
    const i = t.lastIndexOf("/");
    return i + 1 === t.length && (a = t.substring(0, i)), n.indexOf("/") > 0 ? a = a + "/" + n : a = a + n, a;
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
const Cr = (e, t) => {
  const n = rn(e), a = rn(t), i = n.pop(), l = a.pop(), m = on(n, a);
  return m !== 0 ? m : i && l ? on(i.split("."), l.split(".")) : i || l ? i ? -1 : 1 : 0;
}, $c = /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i, rn = (e) => {
  if (typeof e != "string")
    throw new TypeError("Invalid argument expected string");
  const t = e.match($c);
  if (!t)
    throw new Error(`Invalid argument not valid semver ('${e}' received)`);
  return t.shift(), t;
}, an = (e) => e === "*" || e === "x" || e === "X", nn = (e) => {
  const t = parseInt(e, 10);
  return isNaN(t) ? e : t;
}, kc = (e, t) => typeof e != typeof t ? [String(e), String(t)] : [e, t], Pc = (e, t) => {
  if (an(e) || an(t))
    return 0;
  const [n, a] = kc(nn(e), nn(t));
  return n > a ? 1 : n < a ? -1 : 0;
}, on = (e, t) => {
  for (let n = 0; n < Math.max(e.length, t.length); n++) {
    const a = Pc(e[n] || "0", t[n] || "0");
    if (a !== 0)
      return a;
  }
  return 0;
};
class Ec {
  /**
   * Compare [semver](https://semver.org/) version strings
   * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
   *
   * @param v1 - First version to compare
   * @param v2 - Second version to compare
   * @returns boolean true if v1 is higher than v2
   */
  greater(t, n) {
    return Cr(t, n) > 0;
  }
  /**
   * Compare [semver](https://semver.org/) version strings
   * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
   *
   * @param v1 - First version to compare
   * @param v2 - Second version to compare
   * @returns boolean true if v1 is equal to v2
   */
  equal(t, n) {
    return Cr(t, n) === 0;
  }
  /**
   * Compare [semver](https://semver.org/) version strings
   * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
   *
   * @param v1 - First version to compare
   * @param v2 - Second version to compare
   * @returns boolean true if v1 is lesser than v2
   */
  lesser(t, n) {
    return Cr(t, n) < 0;
  }
}
var Sc = Object.defineProperty, jc = (e, t, n) => t in e ? Sc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, xt = (e, t, n) => (jc(e, typeof t != "symbol" ? t + "" : t, n), n);
let it = class {
};
xt(it, "NODE_ENV_KEY", "NODE_ENV"), /**
* 开发环境
*/
xt(it, "NODE_ENV_DEVELOPMENT", "development"), /**
* 生产环境
*/
xt(it, "NODE_ENV_PRODUCTION", "production"), /**
* 测试环境
*/
xt(it, "NODE_ENV_TEST", "test"), /**
* 是否处于调试模式
*/
xt(it, "VITE_DEBUG_MODE_KEY", "VITE_DEBUG_MODE");
class xc {
  /**
   * 环境初始化
   *
   * @param envMeta - 需要传入 {"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":false} 。特别提醒：此参数是静态元数据，取决于最终使用的项目。因此仅仅在最终使用的地方显示传递此值，中间项目请保持参数传递
   * @see {@link https://vitejs.dev/guide/env-and-mode.html#production-replacement}
   */
  constructor(t) {
    xt(this, "envMeta"), this.envMeta = t;
  }
  /**
   * 是否是开发阶段调试
   */
  isNodeDev() {
    return this.getEnv(it.NODE_ENV_KEY) === it.NODE_ENV_DEVELOPMENT;
  }
  /**
   * 是否是调试阶段
   */
  isDev() {
    return this.isNodeDev() || this.getBooleanEnv(it.VITE_DEBUG_MODE_KEY);
  }
  /**
   * 获取环境变量，key不存在返回undefined
   * @param key - key
   */
  getEnv(t) {
    let n;
    try {
      this.envMeta[t] && (n = this.envMeta[t]);
    } catch {
    }
    return n;
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
    let n = !1;
    return this.getEnv(t) && (n = this.getStringEnv(t).toLowerCase() === "true"), n;
  }
  /**
   * 获取环境变量，如果未定义或者为空值，用指定的默认值代替
   *
   * @param key - key
   * @param defaultValue - 默认值
   * @since 0.1.0
   * @author terwer
   */
  getEnvOrDefault(t, n) {
    const a = this.getStringEnv(t);
    return a.trim().length == 0 ? n : a;
  }
}
var Tc = Object.defineProperty, Cc = (e, t, n) => t in e ? Tc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Ot = (e, t, n) => (Cc(e, typeof t != "symbol" ? t + "" : t, n), n);
class wr {
}
Ot(wr, "LOG_LEVEL_KEY", "VITE_LOG_LEVEL"), Ot(wr, "LOG_PREFIX_KEY", "VITE_LOG_PREFIX");
var Xe = /* @__PURE__ */ ((e) => (e.LOG_LEVEL_TRACE = "TRACE", e.LOG_LEVEL_DEBUG = "DEBUG", e.LOG_LEVEL_INFO = "INFO", e.LOG_LEVEL_WARN = "WARN", e.LOG_LEVEL_ERROR = "ERROR", e))(Xe || {}), zn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ya(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Dn = { exports: {} };
(function(e) {
  (function(t, n) {
    e.exports ? e.exports = n() : t.log = n();
  })(zn, function() {
    var t = function() {
    }, n = "undefined", a = typeof window !== n && typeof window.navigator !== n && /Trident\/|MSIE /.test(window.navigator.userAgent), i = [
      "trace",
      "debug",
      "info",
      "warn",
      "error"
    ];
    function l(x, T) {
      var k = x[T];
      if (typeof k.bind == "function")
        return k.bind(x);
      try {
        return Function.prototype.bind.call(k, x);
      } catch {
        return function() {
          return Function.prototype.apply.apply(k, [x, arguments]);
        };
      }
    }
    function m() {
      console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
    }
    function p(x) {
      return x === "debug" && (x = "log"), typeof console === n ? !1 : x === "trace" && a ? m : console[x] !== void 0 ? l(console, x) : console.log !== void 0 ? l(console, "log") : t;
    }
    function g(x, T) {
      for (var k = 0; k < i.length; k++) {
        var A = i[k];
        this[A] = k < x ? t : this.methodFactory(A, x, T);
      }
      this.log = this.debug;
    }
    function v(x, T, k) {
      return function() {
        typeof console !== n && (g.call(this, T, k), this[x].apply(this, arguments));
      };
    }
    function b(x, T, k) {
      return p(x) || v.apply(this, arguments);
    }
    function S(x, T, k) {
      var A = this, L;
      T = T ?? "WARN";
      var r = "loglevel";
      typeof x == "string" ? r += ":" + x : typeof x == "symbol" && (r = void 0);
      function s(_) {
        var f = (i[_] || "silent").toUpperCase();
        if (!(typeof window === n || !r)) {
          try {
            window.localStorage[r] = f;
            return;
          } catch {
          }
          try {
            window.document.cookie = encodeURIComponent(r) + "=" + f + ";";
          } catch {
          }
        }
      }
      function o() {
        var _;
        if (!(typeof window === n || !r)) {
          try {
            _ = window.localStorage[r];
          } catch {
          }
          if (typeof _ === n)
            try {
              var f = window.document.cookie, j = f.indexOf(
                encodeURIComponent(r) + "="
              );
              j !== -1 && (_ = /^([^;]+)/.exec(f.slice(j))[1]);
            } catch {
            }
          return A.levels[_] === void 0 && (_ = void 0), _;
        }
      }
      function c() {
        if (!(typeof window === n || !r)) {
          try {
            window.localStorage.removeItem(r);
            return;
          } catch {
          }
          try {
            window.document.cookie = encodeURIComponent(r) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
          } catch {
          }
        }
      }
      A.name = x, A.levels = {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        SILENT: 5
      }, A.methodFactory = k || b, A.getLevel = function() {
        return L;
      }, A.setLevel = function(_, f) {
        if (typeof _ == "string" && A.levels[_.toUpperCase()] !== void 0 && (_ = A.levels[_.toUpperCase()]), typeof _ == "number" && _ >= 0 && _ <= A.levels.SILENT) {
          if (L = _, f !== !1 && s(_), g.call(A, _, x), typeof console === n && _ < A.levels.SILENT)
            return "No console available for logging";
        } else
          throw "log.setLevel() called with invalid level: " + _;
      }, A.setDefaultLevel = function(_) {
        T = _, o() || A.setLevel(_, !1);
      }, A.resetLevel = function() {
        A.setLevel(T, !1), c();
      }, A.enableAll = function(_) {
        A.setLevel(A.levels.TRACE, _);
      }, A.disableAll = function(_) {
        A.setLevel(A.levels.SILENT, _);
      };
      var u = o();
      u == null && (u = T), A.setLevel(u, !1);
    }
    var I = new S(), M = {};
    I.getLogger = function(x) {
      if (typeof x != "symbol" && typeof x != "string" || x === "")
        throw new TypeError("You must supply a name when creating a logger.");
      var T = M[x];
      return T || (T = M[x] = new S(
        x,
        I.getLevel(),
        I.methodFactory
      )), T;
    };
    var O = typeof window !== n ? window.log : void 0;
    return I.noConflict = function() {
      return typeof window !== n && window.log === I && (window.log = O), I;
    }, I.getLoggers = function() {
      return M;
    }, I.default = I, I;
  });
})(Dn);
var Oc = Dn.exports;
const ur = /* @__PURE__ */ ya(Oc);
var Vn = { exports: {} };
(function(e) {
  (function(t, n) {
    e.exports ? e.exports = n() : t.prefix = n(t);
  })(zn, function(t) {
    var n = function(b) {
      for (var S = 1, I = arguments.length, M; S < I; S++)
        for (M in arguments[S])
          Object.prototype.hasOwnProperty.call(arguments[S], M) && (b[M] = arguments[S][M]);
      return b;
    }, a = {
      template: "[%t] %l:",
      levelFormatter: function(b) {
        return b.toUpperCase();
      },
      nameFormatter: function(b) {
        return b || "root";
      },
      timestampFormatter: function(b) {
        return b.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
      },
      format: void 0
    }, i, l = {}, m = function(b) {
      if (!b || !b.getLogger)
        throw new TypeError("Argument is not a root logger");
      i = b;
    }, p = function(b, S) {
      if (!b || !b.setLevel)
        throw new TypeError("Argument is not a logger");
      var I = b.methodFactory, M = b.name || "", O = l[M] || l[""] || a;
      function x(T, k, A) {
        var L = I(T, k, A), r = l[A] || l[""], s = r.template.indexOf("%t") !== -1, o = r.template.indexOf("%l") !== -1, c = r.template.indexOf("%n") !== -1;
        return function() {
          for (var u = "", _ = arguments.length, f = Array(_), j = 0; j < _; j++)
            f[j] = arguments[j];
          if (M || !l[A]) {
            var F = r.timestampFormatter(/* @__PURE__ */ new Date()), U = r.levelFormatter(T), D = r.nameFormatter(A);
            r.format ? u += r.format(U, D, F) : (u += r.template, s && (u = u.replace(/%t/, F)), o && (u = u.replace(/%l/, U)), c && (u = u.replace(/%n/, D))), f.length && typeof f[0] == "string" ? f[0] = u + " " + f[0] : f.unshift(u);
          }
          L.apply(void 0, f);
        };
      }
      return l[M] || (b.methodFactory = x), S = S || {}, S.template && (S.format = void 0), l[M] = n({}, O, S), b.setLevel(b.getLevel()), i || b.warn(
        "It is necessary to call the function reg() of loglevel-plugin-prefix before calling apply. From the next release, it will throw an error. See more: https://github.com/kutuluk/loglevel-plugin-prefix/blob/master/README.md"
      ), b;
    }, g = {
      reg: m,
      apply: p
    }, v;
    return t && (v = t.prefix, g.noConflict = function() {
      return t.prefix === g && (t.prefix = v), g;
    }), g;
  });
})(Vn);
var Ac = Vn.exports;
const sn = /* @__PURE__ */ ya(Ac);
function Ic() {
  const e = Error.prepareStackTrace;
  Error.prepareStackTrace = (n, a) => a;
  const t = new Error().stack.slice(1);
  return Error.prepareStackTrace = e, t;
}
class vr {
  /**
   * 解析日志级别为枚举
   *
   * @param enumObj - 枚举对象
   * @param value - 配置的值
   */
  static stringToEnumValue(t, n) {
    return t[Object.keys(t).filter((a) => t[a].toString() === n)[0]];
  }
  /**
   * 获取配置的日志级别
   */
  static getEnvLevel(t) {
    if (!t)
      return;
    const n = t.getEnvOrDefault(wr.LOG_LEVEL_KEY, Xe.LOG_LEVEL_INFO), a = vr.stringToEnumValue(Xe, n.toUpperCase());
    return a || console.warn(
      "[zhi-log] LOG_LEVEL is invalid in you .env file.It must be either debug, info, warn or error, fallback to default info level"
    ), a;
  }
  /**
   * 获取默认日志
   */
  static getEnvLogger(t) {
    return t ? t.getEnv(wr.LOG_PREFIX_KEY) : void 0;
  }
}
var $a = { exports: {} }, cn = { exports: {} }, ln;
function Nc() {
  return ln || (ln = 1, function(e) {
    const t = typeof process < "u" && process.env.TERM_PROGRAM === "Hyper", n = typeof process < "u" && process.platform === "win32", a = typeof process < "u" && process.platform === "linux", i = {
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
    }, l = Object.assign({}, i, {
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
    }), m = Object.assign({}, i, {
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
    e.exports = n && !t ? l : m, Reflect.defineProperty(e.exports, "common", { enumerable: !1, value: i }), Reflect.defineProperty(e.exports, "windows", { enumerable: !1, value: l }), Reflect.defineProperty(e.exports, "other", { enumerable: !1, value: m });
  }(cn)), cn.exports;
}
const Mc = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Rc = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g, Lc = () => typeof process < "u" ? process.env.FORCE_COLOR !== "0" : !1, Bn = () => {
  const e = {
    enabled: Lc(),
    visible: !0,
    styles: {},
    keys: {}
  }, t = (l) => {
    let m = l.open = `\x1B[${l.codes[0]}m`, p = l.close = `\x1B[${l.codes[1]}m`, g = l.regex = new RegExp(`\\u001b\\[${l.codes[1]}m`, "g");
    return l.wrap = (v, b) => {
      v.includes(p) && (v = v.replace(g, p + m));
      let S = m + v + p;
      return b ? S.replace(/\r*\n/g, `${p}$&${m}`) : S;
    }, l;
  }, n = (l, m, p) => typeof l == "function" ? l(m) : l.wrap(m, p), a = (l, m) => {
    if (l === "" || l == null)
      return "";
    if (e.enabled === !1)
      return l;
    if (e.visible === !1)
      return "";
    let p = "" + l, g = p.includes(`
`), v = m.length;
    for (v > 0 && m.includes("unstyle") && (m = [.../* @__PURE__ */ new Set(["unstyle", ...m])].reverse()); v-- > 0; )
      p = n(e.styles[m[v]], p, g);
    return p;
  }, i = (l, m, p) => {
    e.styles[l] = t({ name: l, codes: m }), (e.keys[p] || (e.keys[p] = [])).push(l), Reflect.defineProperty(e, l, {
      configurable: !0,
      enumerable: !0,
      set(g) {
        e.alias(l, g);
      },
      get() {
        let g = (v) => a(v, g.stack);
        return Reflect.setPrototypeOf(g, e), g.stack = this.stack ? this.stack.concat(l) : [l], g;
      }
    });
  };
  return i("reset", [0, 0], "modifier"), i("bold", [1, 22], "modifier"), i("dim", [2, 22], "modifier"), i("italic", [3, 23], "modifier"), i("underline", [4, 24], "modifier"), i("inverse", [7, 27], "modifier"), i("hidden", [8, 28], "modifier"), i("strikethrough", [9, 29], "modifier"), i("black", [30, 39], "color"), i("red", [31, 39], "color"), i("green", [32, 39], "color"), i("yellow", [33, 39], "color"), i("blue", [34, 39], "color"), i("magenta", [35, 39], "color"), i("cyan", [36, 39], "color"), i("white", [37, 39], "color"), i("gray", [90, 39], "color"), i("grey", [90, 39], "color"), i("bgBlack", [40, 49], "bg"), i("bgRed", [41, 49], "bg"), i("bgGreen", [42, 49], "bg"), i("bgYellow", [43, 49], "bg"), i("bgBlue", [44, 49], "bg"), i("bgMagenta", [45, 49], "bg"), i("bgCyan", [46, 49], "bg"), i("bgWhite", [47, 49], "bg"), i("blackBright", [90, 39], "bright"), i("redBright", [91, 39], "bright"), i("greenBright", [92, 39], "bright"), i("yellowBright", [93, 39], "bright"), i("blueBright", [94, 39], "bright"), i("magentaBright", [95, 39], "bright"), i("cyanBright", [96, 39], "bright"), i("whiteBright", [97, 39], "bright"), i("bgBlackBright", [100, 49], "bgBright"), i("bgRedBright", [101, 49], "bgBright"), i("bgGreenBright", [102, 49], "bgBright"), i("bgYellowBright", [103, 49], "bgBright"), i("bgBlueBright", [104, 49], "bgBright"), i("bgMagentaBright", [105, 49], "bgBright"), i("bgCyanBright", [106, 49], "bgBright"), i("bgWhiteBright", [107, 49], "bgBright"), e.ansiRegex = Rc, e.hasColor = e.hasAnsi = (l) => (e.ansiRegex.lastIndex = 0, typeof l == "string" && l !== "" && e.ansiRegex.test(l)), e.alias = (l, m) => {
    let p = typeof m == "string" ? e[m] : m;
    if (typeof p != "function")
      throw new TypeError("Expected alias to be the name of an existing color (string) or a function");
    p.stack || (Reflect.defineProperty(p, "name", { value: l }), e.styles[l] = p, p.stack = [l]), Reflect.defineProperty(e, l, {
      configurable: !0,
      enumerable: !0,
      set(g) {
        e.alias(l, g);
      },
      get() {
        let g = (v) => a(v, g.stack);
        return Reflect.setPrototypeOf(g, e), g.stack = this.stack ? this.stack.concat(p.stack) : p.stack, g;
      }
    });
  }, e.theme = (l) => {
    if (!Mc(l))
      throw new TypeError("Expected theme to be an object");
    for (let m of Object.keys(l))
      e.alias(m, l[m]);
    return e;
  }, e.alias("unstyle", (l) => typeof l == "string" && l !== "" ? (e.ansiRegex.lastIndex = 0, l.replace(e.ansiRegex, "")) : ""), e.alias("noop", (l) => l), e.none = e.clear = e.noop, e.stripColor = e.unstyle, e.symbols = Nc(), e.define = i, e;
};
$a.exports = Bn();
$a.exports.create = Bn;
var zc = $a.exports;
const Fe = /* @__PURE__ */ ya(zc);
let zr, Fn, Un, qn, Hn = !0;
typeof process < "u" && ({ FORCE_COLOR: zr, NODE_DISABLE_COLORS: Fn, NO_COLOR: Un, TERM: qn } = process.env || {}, Hn = process.stdout && process.stdout.isTTY);
const ce = {
  enabled: !Fn && Un == null && qn !== "dumb" && (zr != null && zr !== "0" || Hn),
  // modifiers
  reset: _e(0, 0),
  bold: _e(1, 22),
  dim: _e(2, 22),
  italic: _e(3, 23),
  underline: _e(4, 24),
  inverse: _e(7, 27),
  hidden: _e(8, 28),
  strikethrough: _e(9, 29),
  // colors
  black: _e(30, 39),
  red: _e(31, 39),
  green: _e(32, 39),
  yellow: _e(33, 39),
  blue: _e(34, 39),
  magenta: _e(35, 39),
  cyan: _e(36, 39),
  white: _e(37, 39),
  gray: _e(90, 39),
  grey: _e(90, 39),
  // background colors
  bgBlack: _e(40, 49),
  bgRed: _e(41, 49),
  bgGreen: _e(42, 49),
  bgYellow: _e(43, 49),
  bgBlue: _e(44, 49),
  bgMagenta: _e(45, 49),
  bgCyan: _e(46, 49),
  bgWhite: _e(47, 49)
};
function un(e, t) {
  let n = 0, a, i = "", l = "";
  for (; n < e.length; n++)
    a = e[n], i += a.open, l += a.close, ~t.indexOf(a.close) && (t = t.replace(a.rgx, a.close + a.open));
  return i + t + l;
}
function Dc(e, t) {
  let n = { has: e, keys: t };
  return n.reset = ce.reset.bind(n), n.bold = ce.bold.bind(n), n.dim = ce.dim.bind(n), n.italic = ce.italic.bind(n), n.underline = ce.underline.bind(n), n.inverse = ce.inverse.bind(n), n.hidden = ce.hidden.bind(n), n.strikethrough = ce.strikethrough.bind(n), n.black = ce.black.bind(n), n.red = ce.red.bind(n), n.green = ce.green.bind(n), n.yellow = ce.yellow.bind(n), n.blue = ce.blue.bind(n), n.magenta = ce.magenta.bind(n), n.cyan = ce.cyan.bind(n), n.white = ce.white.bind(n), n.gray = ce.gray.bind(n), n.grey = ce.grey.bind(n), n.bgBlack = ce.bgBlack.bind(n), n.bgRed = ce.bgRed.bind(n), n.bgGreen = ce.bgGreen.bind(n), n.bgYellow = ce.bgYellow.bind(n), n.bgBlue = ce.bgBlue.bind(n), n.bgMagenta = ce.bgMagenta.bind(n), n.bgCyan = ce.bgCyan.bind(n), n.bgWhite = ce.bgWhite.bind(n), n;
}
function _e(e, t) {
  let n = {
    open: `\x1B[${e}m`,
    close: `\x1B[${t}m`,
    rgx: new RegExp(`\\x1b\\[${t}m`, "g")
  };
  return function(a) {
    return this !== void 0 && this.has !== void 0 ? (~this.has.indexOf(e) || (this.has.push(e), this.keys.push(n)), a === void 0 ? this : ce.enabled ? un(this.keys, a + "") : a + "") : a === void 0 ? Dc([e], [n]) : ce.enabled ? un([n], a + "") : a + "";
  };
}
var Vc = Object.defineProperty, Bc = (e, t, n) => t in e ? Vc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, je = (e, t, n) => (Bc(e, typeof t != "symbol" ? t + "" : t, n), n);
const Je = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return Je.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let fe = Je;
je(fe, "isNode", typeof process < "u"), /**
* 是否在浏览器环境
*/
je(fe, "isInBrowser", typeof window < "u"), /**
* 浏览器路径分隔符
*/
je(fe, "BrowserSeperator", "/"), /**
* 是否是Electron环境
*/
je(fe, "isElectron", () => !Je.isInBrowser || !window.navigator || !window.navigator.userAgent ? !1 : /Electron/.test(window.navigator.userAgent)), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
je(fe, "hasNodeEnv", () => Je.isElectron() || Je.isNode), /**
* 获取url参数
*
* @param sParam - 参数
*/
je(fe, "getQueryString", (e) => {
  if (!Je.isInBrowser)
    return "";
  const t = window.location.search.substring(1).split("&");
  for (let n = 0; n < t.length; n++) {
    const a = t[n].split("=");
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
je(fe, "replaceUrlParam", (e, t, n) => {
  n == null && (n = "");
  const a = new RegExp("\\b(" + t + "=).*?(&|#|$)");
  if (e.search(a) >= 0)
    return e.replace(a, "$1" + n + "$2");
  const [i, l] = e.split("#"), [m, p] = i.split("?"), g = new URLSearchParams(p);
  g.set(t, n);
  const v = g.toString(), b = m + (v ? "?" + v : "");
  return l ? b + "#" + l : b;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
je(fe, "setUrlParameter", (e, t, n) => {
  if (e.includes(t))
    return Je.replaceUrlParam(e, t, n);
  const a = e.split("#");
  let i = a[0];
  const l = a[1];
  return i.includes("?") ? i += `&${t}=${n}` : i += `?${t}=${n}`, l && (i += "#" + l), i;
}), /**
* 重新加载指定tab
*
* @param tabname - tabname
* @param t - 延迟时间
*/
je(fe, "reloadTabPage", (e, t = 200) => {
  setTimeout(function() {
    if (Je.isInBrowser) {
      const n = window.location.href;
      window.location.href = Je.setUrlParameter(n, "tab", e);
    }
  }, t);
}), /**
* 刷新当前tab页面
*/
je(fe, "reloadPage", () => {
  setTimeout(function() {
    Je.isInBrowser && window.location.reload();
  }, 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
*/
je(fe, "reloadPageWithMessageCallback", (e, t) => {
  t && t(e), setTimeout(function() {
    Je.isInBrowser && window.location.reload();
  }, 200);
});
var Ie = /* @__PURE__ */ ((e) => (e.BasePathType_Appearance = "Appearance", e.BasePathType_Data = "Data", e.BasePathType_Themes = "Themes", e.BasePathType_ZhiTheme = "ZhiTheme", e.BasePathType_None = "None", e))(Ie || {});
const Me = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return fe.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : !1;
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
      case Ie.BasePathType_Appearance:
        n = this.browserJoinPath(this.siyuanAppearanceRelativePath(), e);
        break;
      case Ie.BasePathType_Data:
        n = this.browserJoinPath(this.siyuanDataRelativePath(), e);
        break;
      case Ie.BasePathType_Themes:
        n = this.browserJoinPath(this.siyuanThemeRelativePath(), e);
        break;
      case Ie.BasePathType_ZhiTheme:
        n = this.browserJoinPath(this.zhiThemeRelativePath(), e);
        break;
      default:
        throw new Error("type must be provided");
    }
    const { default: a } = await import(
      /* @vite-ignore */
      n
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
    return await this.importJs(e, Ie.BasePathType_ZhiTheme);
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
    if (fe.hasNodeEnv()) {
      const t = this.requireLib("path");
      if (t)
        return t.join(...e);
    }
    return this.browserJoinPath(...e);
  }
  static browserJoinPath(...e) {
    return e.join(fe.BrowserSeperator);
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
    if (fe.hasNodeEnv())
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
let bt = Me;
je(bt, "isInSiyuanWidget", () => fe.isInBrowser ? window.frameElement != null && window.frameElement.parentElement != null && window.frameElement.parentElement.parentElement != null && window.frameElement.parentElement.parentElement.getAttribute("data-node-id") !== "" : !1), /**
* 思源笔记新窗口
*
* @deprecated window.terwer 判断方式已废弃，建议以后打开新窗口注入 window.siyuanNewWin ，这样语义会更容易理解
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
je(bt, "isInSiyuanNewWin", () => !fe.isInBrowser || !fe.isElectron() ? !1 : typeof window.terwer < "u" || typeof window.siyuanNewWin < "u"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
je(bt, "requireLib", (e, t = !0, n = Ie.BasePathType_None) => {
  if (!fe.hasNodeEnv())
    throw new Error("require ony works on node env");
  let a = e;
  if (!t)
    switch (n) {
      case Ie.BasePathType_Appearance:
        a = Me.joinPath(Me.siyuanAppearancePath(), e);
        break;
      case Ie.BasePathType_Data:
        a = Me.joinPath(Me.siyuanDataPath(), e);
        break;
      case Ie.BasePathType_Themes:
        a = Me.joinPath(Me.siyuanAppearancePath(), "themes", e);
        break;
      case Ie.BasePathType_ZhiTheme:
        a = Me.joinPath(Me.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const i = Me.siyuanWindow();
  if (!i)
    return require(a);
  if (typeof i.require < "u")
    return i.require(a);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
je(bt, "requireAppearanceLib", (e) => Me.requireLib(e, !1, Ie.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
je(bt, "requireDataLib", (e) => Me.requireLib(e, !1, Ie.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
je(bt, "requireThemesLib", (e) => Me.requireLib(e, !1, Ie.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
je(bt, "requireZhiThemeLib", (e) => Me.requireLib(e, !1, Ie.BasePathType_ZhiTheme));
const Ue = {
  white: (e) => fe.isElectron() ? Fe.whiteBright(e) : ce.white(e),
  gray: (e) => fe.isElectron() ? Fe.gray(e) : ce.gray(e),
  blue: (e) => fe.isElectron() ? Fe.blue(e) : ce.blue(e),
  green: (e) => fe.isElectron() ? Fe.green(e) : ce.green(e),
  yellow: (e) => fe.isElectron() ? Fe.yellow(e) : ce.yellow(e),
  red: (e) => fe.isElectron() ? Fe.red(e) : ce.red(e),
  bgWhite: (e) => fe.isElectron() ? Fe.bgWhiteBright(e) : ce.bgWhite(e),
  bgGrey: (e) => fe.isElectron() ? Fe.bgCyanBright(e) : ce.bgCyan(e),
  bgBlue: (e) => fe.isElectron() ? Fe.bgBlueBright(e) : ce.bgBlue(e),
  bgGreen: (e) => fe.isElectron() ? Fe.bgGreenBright(e) : ce.bgGreen(e),
  bgYellow: (e) => fe.isElectron() ? Fe.bgYellowBright(e) : ce.bgYellow(e),
  bgRed: (e) => fe.isElectron() ? Fe.bgRedBright(e) : ce.bgRed(e)
};
class Fc {
  constructor(t, n, a) {
    Ot(this, "consoleLogger", "console"), Ot(this, "stackSize", 1), Ot(this, "getLogger", (m) => {
      let p;
      if (m)
        p = m;
      else {
        const g = this.getCallStack(), v = [], b = [];
        for (let S = 0; S < g.length; S++) {
          const I = g[S], M = I.getFileName() ?? "none";
          if (S > this.stackSize - 1)
            break;
          const O = M + "-" + I.getLineNumber() + ":" + I.getColumnNumber();
          v.push(O);
        }
        b.length > 0 && (p = v.join(" -> "));
      }
      return (!p || p.trim().length === 0) && (p = this.consoleLogger), ur.getLogger(p);
    }), this.stackSize = 1;
    let i;
    t ? i = t : i = vr.getEnvLevel(a), i = i ?? Xe.LOG_LEVEL_INFO, ur.setLevel(i);
    const l = (m, p, g, v) => {
      const b = [], S = n ?? vr.getEnvLogger(a) ?? "zhi";
      return b.push(Ue.gray("[") + v(S) + Ue.gray("]")), b.push(Ue.gray("[") + Ue.gray(g.toString()) + Ue.gray("]")), b.push(v(m.toUpperCase().toString())), b.push(v(p)), b.push(Ue.gray(":")), b;
    };
    sn.reg(ur), sn.apply(ur, {
      format(m, p, g) {
        let v = [];
        const b = p ?? "";
        switch (m) {
          case Xe.LOG_LEVEL_TRACE:
            v = l(m, b, g, Ue.gray);
            break;
          case Xe.LOG_LEVEL_DEBUG:
            v = l(m, b, g, Ue.blue);
            break;
          case Xe.LOG_LEVEL_INFO:
            v = l(m, b, g, Ue.green);
            break;
          case Xe.LOG_LEVEL_WARN:
            v = l(m, b, g, Ue.yellow);
            break;
          case Xe.LOG_LEVEL_ERROR:
            v = l(m, b, g, Ue.red);
            break;
          default:
            v = l(Xe.LOG_LEVEL_INFO, b, g, Ue.green);
            break;
        }
        return v.join(" ");
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
      t = Ic();
    } catch {
      t = [];
    }
    return t;
  }
}
class Uc {
  /**
   * 默认日志级别
   *
   * @param level - 可选，未设置默认INFO
   * @param sign - 可选前缀，默认zhi
   * @param env - 可选环境变量实例
   */
  constructor(t, n, a) {
    Ot(this, "logger"), this.logger = new Fc(t, n, a);
  }
  /**
   * 获取日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   * @protected
   */
  getLogger(t, n) {
    return this.logger.setStackSize(n), this.logger.getLogger(t);
  }
}
class dn extends Uc {
  constructor(t, n, a) {
    super(t, n, a);
  }
  /**
   * 获取默认的日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   */
  getLogger(t, n) {
    return super.getLogger(t, n);
  }
}
class ka {
  /**
   * 默认日志记录器
   *
   * @param stackSize - 栈的深度
   * @param env - 环境变量实例
   */
  static defaultLogger(t, n) {
    return ka.customLogFactory(void 0, void 0, t).getLogger(void 0, n);
  }
  /**
   * 自定义日志工厂
   *
   * @param level - 级别
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customLogFactory(t, n, a) {
    return new dn(t, n, a);
  }
  /**
   * 自定义日志工厂，自定义前缀
   *
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customSignLogFactory(t, n) {
    return new dn(void 0, t, n);
  }
}
const qc = "zhi";
class Kt {
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
  static zhiLogWithSign(t, n) {
    if (this.loggerMap[n])
      return this.loggerMap[n].debug("Zhi-log use cache"), this.loggerMap[n];
    const a = this.env, i = ka.customSignLogFactory(t, a).getLogger(n);
    return this.loggerMap[n] = i, i.debug("Zhi-log add new logger"), i;
  }
  /**
   * 获取 zhi-log 实例
   *
   * @param loggerName - 日志名称
   */
  static zhiLog(t) {
    return this.zhiLogWithSign(qc, t);
  }
  /**
   * 获取 zhi-common 实例
   */
  static zhiCommon() {
    return this.common || (this.common = new Jc()), this.common;
  }
}
xe(Kt, "env"), /**
* zhi-util 的日志器缓存
*/
xe(Kt, "loggerMap", {}), /**
* zhi-util 的通用工具类
*/
xe(Kt, "common");
class Pa extends Kt {
  static zhiEnv() {
    return this.env || (this.env = new xc({ BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 })), this.env;
  }
}
class hn {
  constructor() {
    xe(this, "logger"), this.logger = Pa.zhiLog("lute-adaptor"), Lute ? this.logger.debug("Detected Lute is bundled, will use!") : this.logger.debug("Lute is not available!");
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
    const n = new RegExp("(?<=^|[\\s\\S])==([^\\n]+?)==(?=($|[\\s\\S]))", "g");
    return t.replace(n, '<span class="mark">$1</span>');
  }
  /**
   * 渲染Markdown
   *
   * @param md - Markdown
   */
  async renderMarkdownStr(t) {
    if (!this.isAvailable())
      return this.logger.error("Lute is not available, will return original md"), t;
    const n = Lute, a = n.New(), i = {
      renderText: (l, m) => m ? [this.highlightWords(l.Text()), n.WalkContinue] : ["", n.WalkContinue]
      // renderStrong: (node: any, entering: any) => {
      //     return ["", luteObj.WalkContinue]
      // },
      // renderParagraph: (node: any, entering: any) => {
      //     return ["", luteObj.WalkContinue]
      // }
    };
    return a.SetJSRenderers({
      renderers: {
        Md2HTML: i
      }
    }), this.logger.info("Lute is rendering md to HTML..."), a.MarkdownStr("", t);
  }
}
var Kn = { exports: {} };
(function(e) {
  (function() {
    function t(r) {
      var s = {
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
      if (r === !1)
        return JSON.parse(JSON.stringify(s));
      var o = {};
      for (var c in s)
        s.hasOwnProperty(c) && (o[c] = s[c].defaultValue);
      return o;
    }
    function n() {
      var r = t(!0), s = {};
      for (var o in r)
        r.hasOwnProperty(o) && (s[o] = !0);
      return s;
    }
    var a = {}, i = {}, l = {}, m = t(!0), p = "vanilla", g = {
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
      allOn: n()
    };
    a.helper = {}, a.extensions = {}, a.setOption = function(r, s) {
      return m[r] = s, this;
    }, a.getOption = function(r) {
      return m[r];
    }, a.getOptions = function() {
      return m;
    }, a.resetOptions = function() {
      m = t(!0);
    }, a.setFlavor = function(r) {
      if (!g.hasOwnProperty(r))
        throw Error(r + " flavor was not found");
      a.resetOptions();
      var s = g[r];
      p = r;
      for (var o in s)
        s.hasOwnProperty(o) && (m[o] = s[o]);
    }, a.getFlavor = function() {
      return p;
    }, a.getFlavorOptions = function(r) {
      if (g.hasOwnProperty(r))
        return g[r];
    }, a.getDefaultOptions = function(r) {
      return t(r);
    }, a.subParser = function(r, s) {
      if (a.helper.isString(r))
        if (typeof s < "u")
          i[r] = s;
        else {
          if (i.hasOwnProperty(r))
            return i[r];
          throw Error("SubParser named " + r + " not registered!");
        }
    }, a.extension = function(r, s) {
      if (!a.helper.isString(r))
        throw Error("Extension 'name' must be a string");
      if (r = a.helper.stdExtName(r), a.helper.isUndefined(s)) {
        if (!l.hasOwnProperty(r))
          throw Error("Extension named " + r + " is not registered!");
        return l[r];
      } else {
        typeof s == "function" && (s = s()), a.helper.isArray(s) || (s = [s]);
        var o = v(s, r);
        if (o.valid)
          l[r] = s;
        else
          throw Error(o.error);
      }
    }, a.getAllExtensions = function() {
      return l;
    }, a.removeExtension = function(r) {
      delete l[r];
    }, a.resetExtensions = function() {
      l = {};
    };
    function v(r, s) {
      var o = s ? "Error in " + s + " extension->" : "Error in unnamed extension", c = {
        valid: !0,
        error: ""
      };
      a.helper.isArray(r) || (r = [r]);
      for (var u = 0; u < r.length; ++u) {
        var _ = o + " sub-extension " + u + ": ", f = r[u];
        if (typeof f != "object")
          return c.valid = !1, c.error = _ + "must be an object, but " + typeof f + " given", c;
        if (!a.helper.isString(f.type))
          return c.valid = !1, c.error = _ + 'property "type" must be a string, but ' + typeof f.type + " given", c;
        var j = f.type = f.type.toLowerCase();
        if (j === "language" && (j = f.type = "lang"), j === "html" && (j = f.type = "output"), j !== "lang" && j !== "output" && j !== "listener")
          return c.valid = !1, c.error = _ + "type " + j + ' is not recognized. Valid values: "lang/language", "output/html" or "listener"', c;
        if (j === "listener") {
          if (a.helper.isUndefined(f.listeners))
            return c.valid = !1, c.error = _ + '. Extensions of type "listener" must have a property called "listeners"', c;
        } else if (a.helper.isUndefined(f.filter) && a.helper.isUndefined(f.regex))
          return c.valid = !1, c.error = _ + j + ' extensions must define either a "regex" property or a "filter" method', c;
        if (f.listeners) {
          if (typeof f.listeners != "object")
            return c.valid = !1, c.error = _ + '"listeners" property must be an object but ' + typeof f.listeners + " given", c;
          for (var F in f.listeners)
            if (f.listeners.hasOwnProperty(F) && typeof f.listeners[F] != "function")
              return c.valid = !1, c.error = _ + '"listeners" property must be an hash of [event name]: [callback]. listeners.' + F + " must be a function but " + typeof f.listeners[F] + " given", c;
        }
        if (f.filter) {
          if (typeof f.filter != "function")
            return c.valid = !1, c.error = _ + '"filter" must be a function, but ' + typeof f.filter + " given", c;
        } else if (f.regex) {
          if (a.helper.isString(f.regex) && (f.regex = new RegExp(f.regex, "g")), !(f.regex instanceof RegExp))
            return c.valid = !1, c.error = _ + '"regex" property must either be a string or a RegExp object, but ' + typeof f.regex + " given", c;
          if (a.helper.isUndefined(f.replace))
            return c.valid = !1, c.error = _ + '"regex" extensions must implement a replace string or function', c;
        }
      }
      return c;
    }
    a.validateExtension = function(r) {
      var s = v(r, null);
      return s.valid ? !0 : (console.warn(s.error), !1);
    }, a.hasOwnProperty("helper") || (a.helper = {}), a.helper.isString = function(r) {
      return typeof r == "string" || r instanceof String;
    }, a.helper.isFunction = function(r) {
      var s = {};
      return r && s.toString.call(r) === "[object Function]";
    }, a.helper.isArray = function(r) {
      return Array.isArray(r);
    }, a.helper.isUndefined = function(r) {
      return typeof r > "u";
    }, a.helper.forEach = function(r, s) {
      if (a.helper.isUndefined(r))
        throw new Error("obj param is required");
      if (a.helper.isUndefined(s))
        throw new Error("callback param is required");
      if (!a.helper.isFunction(s))
        throw new Error("callback param must be a function/closure");
      if (typeof r.forEach == "function")
        r.forEach(s);
      else if (a.helper.isArray(r))
        for (var o = 0; o < r.length; o++)
          s(r[o], o, r);
      else if (typeof r == "object")
        for (var c in r)
          r.hasOwnProperty(c) && s(r[c], c, r);
      else
        throw new Error("obj does not seem to be an array or an iterable object");
    }, a.helper.stdExtName = function(r) {
      return r.replace(/[_?*+\/\\.^-]/g, "").replace(/\s/g, "").toLowerCase();
    };
    function b(r, s) {
      var o = s.charCodeAt(0);
      return "¨E" + o + "E";
    }
    a.helper.escapeCharactersCallback = b, a.helper.escapeCharacters = function(r, s, o) {
      var c = "([" + s.replace(/([\[\]\\])/g, "\\$1") + "])";
      o && (c = "\\\\" + c);
      var u = new RegExp(c, "g");
      return r = r.replace(u, b), r;
    }, a.helper.unescapeHTMLEntities = function(r) {
      return r.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    var S = function(r, s, o, c) {
      var u = c || "", _ = u.indexOf("g") > -1, f = new RegExp(s + "|" + o, "g" + u.replace(/g/g, "")), j = new RegExp(s, u.replace(/g/g, "")), F = [], U, D, W, w, G;
      do
        for (U = 0; W = f.exec(r); )
          if (j.test(W[0]))
            U++ || (D = f.lastIndex, w = D - W[0].length);
          else if (U && !--U) {
            G = W.index + W[0].length;
            var Q = {
              left: { start: w, end: D },
              match: { start: D, end: W.index },
              right: { start: W.index, end: G },
              wholeMatch: { start: w, end: G }
            };
            if (F.push(Q), !_)
              return F;
          }
      while (U && (f.lastIndex = D));
      return F;
    };
    a.helper.matchRecursiveRegExp = function(r, s, o, c) {
      for (var u = S(r, s, o, c), _ = [], f = 0; f < u.length; ++f)
        _.push([
          r.slice(u[f].wholeMatch.start, u[f].wholeMatch.end),
          r.slice(u[f].match.start, u[f].match.end),
          r.slice(u[f].left.start, u[f].left.end),
          r.slice(u[f].right.start, u[f].right.end)
        ]);
      return _;
    }, a.helper.replaceRecursiveRegExp = function(r, s, o, c, u) {
      if (!a.helper.isFunction(s)) {
        var _ = s;
        s = function() {
          return _;
        };
      }
      var f = S(r, o, c, u), j = r, F = f.length;
      if (F > 0) {
        var U = [];
        f[0].wholeMatch.start !== 0 && U.push(r.slice(0, f[0].wholeMatch.start));
        for (var D = 0; D < F; ++D)
          U.push(
            s(
              r.slice(f[D].wholeMatch.start, f[D].wholeMatch.end),
              r.slice(f[D].match.start, f[D].match.end),
              r.slice(f[D].left.start, f[D].left.end),
              r.slice(f[D].right.start, f[D].right.end)
            )
          ), D < F - 1 && U.push(r.slice(f[D].wholeMatch.end, f[D + 1].wholeMatch.start));
        f[F - 1].wholeMatch.end < r.length && U.push(r.slice(f[F - 1].wholeMatch.end)), j = U.join("");
      }
      return j;
    }, a.helper.regexIndexOf = function(r, s, o) {
      if (!a.helper.isString(r))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      if (!(s instanceof RegExp))
        throw "InvalidArgumentError: second parameter of showdown.helper.regexIndexOf function must be an instance of RegExp";
      var c = r.substring(o || 0).search(s);
      return c >= 0 ? c + (o || 0) : c;
    }, a.helper.splitAtIndex = function(r, s) {
      if (!a.helper.isString(r))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      return [r.substring(0, s), r.substring(s)];
    }, a.helper.encodeEmailAddress = function(r) {
      var s = [
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
      return r = r.replace(/./g, function(o) {
        if (o === "@")
          o = s[Math.floor(Math.random() * 2)](o);
        else {
          var c = Math.random();
          o = c > 0.9 ? s[2](o) : c > 0.45 ? s[1](o) : s[0](o);
        }
        return o;
      }), r;
    }, a.helper.padEnd = function(r, s, o) {
      return s = s >> 0, o = String(o || " "), r.length > s ? String(r) : (s = s - r.length, s > o.length && (o += o.repeat(s / o.length)), String(r) + o.slice(0, s));
    }, typeof console > "u" && (console = {
      warn: function(r) {
        alert(r);
      },
      log: function(r) {
        alert(r);
      },
      error: function(r) {
        throw r;
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
    }, a.Converter = function(r) {
      var s = {}, o = [], c = [], u = {}, _ = p, f = {
        parsed: {},
        raw: "",
        format: ""
      };
      j();
      function j() {
        r = r || {};
        for (var w in m)
          m.hasOwnProperty(w) && (s[w] = m[w]);
        if (typeof r == "object")
          for (var G in r)
            r.hasOwnProperty(G) && (s[G] = r[G]);
        else
          throw Error("Converter expects the passed parameter to be an object, but " + typeof r + " was passed instead.");
        s.extensions && a.helper.forEach(s.extensions, F);
      }
      function F(w, G) {
        if (G = G || null, a.helper.isString(w))
          if (w = a.helper.stdExtName(w), G = w, a.extensions[w]) {
            console.warn("DEPRECATION WARNING: " + w + " is an old extension that uses a deprecated loading method.Please inform the developer that the extension should be updated!"), U(a.extensions[w], w);
            return;
          } else if (!a.helper.isUndefined(l[w]))
            w = l[w];
          else
            throw Error('Extension "' + w + '" could not be loaded. It was either not found or is not a valid extension.');
        typeof w == "function" && (w = w()), a.helper.isArray(w) || (w = [w]);
        var Q = v(w, G);
        if (!Q.valid)
          throw Error(Q.error);
        for (var ee = 0; ee < w.length; ++ee) {
          switch (w[ee].type) {
            case "lang":
              o.push(w[ee]);
              break;
            case "output":
              c.push(w[ee]);
              break;
          }
          if (w[ee].hasOwnProperty("listeners"))
            for (var q in w[ee].listeners)
              w[ee].listeners.hasOwnProperty(q) && D(q, w[ee].listeners[q]);
        }
      }
      function U(w, G) {
        typeof w == "function" && (w = w(new a.Converter())), a.helper.isArray(w) || (w = [w]);
        var Q = v(w, G);
        if (!Q.valid)
          throw Error(Q.error);
        for (var ee = 0; ee < w.length; ++ee)
          switch (w[ee].type) {
            case "lang":
              o.push(w[ee]);
              break;
            case "output":
              c.push(w[ee]);
              break;
            default:
              throw Error("Extension loader error: Type unrecognized!!!");
          }
      }
      function D(w, G) {
        if (!a.helper.isString(w))
          throw Error("Invalid argument in converter.listen() method: name must be a string, but " + typeof w + " given");
        if (typeof G != "function")
          throw Error("Invalid argument in converter.listen() method: callback must be a function, but " + typeof G + " given");
        u.hasOwnProperty(w) || (u[w] = []), u[w].push(G);
      }
      function W(w) {
        var G = w.match(/^\s*/)[0].length, Q = new RegExp("^\\s{0," + G + "}", "gm");
        return w.replace(Q, "");
      }
      this._dispatch = function(w, G, Q, ee) {
        if (u.hasOwnProperty(w))
          for (var q = 0; q < u[w].length; ++q) {
            var P = u[w][q](w, G, this, Q, ee);
            P && typeof P < "u" && (G = P);
          }
        return G;
      }, this.listen = function(w, G) {
        return D(w, G), this;
      }, this.makeHtml = function(w) {
        if (!w)
          return w;
        var G = {
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
`), w = w.replace(/\u00A0/g, "&nbsp;"), s.smartIndentationFix && (w = W(w)), w = `

` + w + `

`, w = a.subParser("detab")(w, s, G), w = w.replace(/^[ \t]+$/mg, ""), a.helper.forEach(o, function(Q) {
          w = a.subParser("runExtension")(Q, w, s, G);
        }), w = a.subParser("metadata")(w, s, G), w = a.subParser("hashPreCodeTags")(w, s, G), w = a.subParser("githubCodeBlocks")(w, s, G), w = a.subParser("hashHTMLBlocks")(w, s, G), w = a.subParser("hashCodeTags")(w, s, G), w = a.subParser("stripLinkDefinitions")(w, s, G), w = a.subParser("blockGamut")(w, s, G), w = a.subParser("unhashHTMLSpans")(w, s, G), w = a.subParser("unescapeSpecialChars")(w, s, G), w = w.replace(/¨D/g, "$$"), w = w.replace(/¨T/g, "¨"), w = a.subParser("completeHTMLDocument")(w, s, G), a.helper.forEach(c, function(Q) {
          w = a.subParser("runExtension")(Q, w, s, G);
        }), f = G.metadata, w;
      }, this.makeMarkdown = this.makeMd = function(w, G) {
        if (w = w.replace(/\r\n/g, `
`), w = w.replace(/\r/g, `
`), w = w.replace(/>[ \t]+</, ">¨NBSP;<"), !G)
          if (window && window.document)
            G = window.document;
          else
            throw new Error("HTMLParser is undefined. If in a webworker or nodejs environment, you need to provide a WHATWG DOM and HTML such as JSDOM");
        var Q = G.createElement("div");
        Q.innerHTML = w;
        var ee = {
          preList: d(Q)
        };
        N(Q);
        for (var q = Q.childNodes, P = "", H = 0; H < q.length; H++)
          P += a.subParser("makeMarkdown.node")(q[H], ee);
        function N(y) {
          for (var z = 0; z < y.childNodes.length; ++z) {
            var J = y.childNodes[z];
            J.nodeType === 3 ? !/\S/.test(J.nodeValue) && !/^[ ]+$/.test(J.nodeValue) ? (y.removeChild(J), --z) : (J.nodeValue = J.nodeValue.split(`
`).join(" "), J.nodeValue = J.nodeValue.replace(/(\s)+/g, "$1")) : J.nodeType === 1 && N(J);
          }
        }
        function d(y) {
          for (var z = y.querySelectorAll("pre"), J = [], Y = 0; Y < z.length; ++Y)
            if (z[Y].childElementCount === 1 && z[Y].firstChild.tagName.toLowerCase() === "code") {
              var se = z[Y].firstChild.innerHTML.trim(), ie = z[Y].firstChild.getAttribute("data-language") || "";
              if (ie === "")
                for (var C = z[Y].firstChild.className.split(" "), R = 0; R < C.length; ++R) {
                  var K = C[R].match(/^language-(.+)$/);
                  if (K !== null) {
                    ie = K[1];
                    break;
                  }
                }
              se = a.helper.unescapeHTMLEntities(se), J.push(se), z[Y].outerHTML = '<precode language="' + ie + '" precodenum="' + Y.toString() + '"></precode>';
            } else
              J.push(z[Y].innerHTML), z[Y].innerHTML = "", z[Y].setAttribute("prenum", Y.toString());
          return J;
        }
        return P;
      }, this.setOption = function(w, G) {
        s[w] = G;
      }, this.getOption = function(w) {
        return s[w];
      }, this.getOptions = function() {
        return s;
      }, this.addExtension = function(w, G) {
        G = G || null, F(w, G);
      }, this.useExtension = function(w) {
        F(w);
      }, this.setFlavor = function(w) {
        if (!g.hasOwnProperty(w))
          throw Error(w + " flavor was not found");
        var G = g[w];
        _ = w;
        for (var Q in G)
          G.hasOwnProperty(Q) && (s[Q] = G[Q]);
      }, this.getFlavor = function() {
        return _;
      }, this.removeExtension = function(w) {
        a.helper.isArray(w) || (w = [w]);
        for (var G = 0; G < w.length; ++G) {
          for (var Q = w[G], ee = 0; ee < o.length; ++ee)
            o[ee] === Q && o.splice(ee, 1);
          for (var q = 0; q < c.length; ++q)
            c[q] === Q && c.splice(q, 1);
        }
      }, this.getAllExtensions = function() {
        return {
          language: o,
          output: c
        };
      }, this.getMetadata = function(w) {
        return w ? f.raw : f.parsed;
      }, this.getMetadataFormat = function() {
        return f.format;
      }, this._setMetadataPair = function(w, G) {
        f.parsed[w] = G;
      }, this._setMetadataFormat = function(w) {
        f.format = w;
      }, this._setMetadataRaw = function(w) {
        f.raw = w;
      };
    }, a.subParser("anchors", function(r, s, o) {
      r = o.converter._dispatch("anchors.before", r, s, o);
      var c = function(u, _, f, j, F, U, D) {
        if (a.helper.isUndefined(D) && (D = ""), f = f.toLowerCase(), u.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          j = "";
        else if (!j)
          if (f || (f = _.toLowerCase().replace(/ ?\n/g, " ")), j = "#" + f, !a.helper.isUndefined(o.gUrls[f]))
            j = o.gUrls[f], a.helper.isUndefined(o.gTitles[f]) || (D = o.gTitles[f]);
          else
            return u;
        j = j.replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback);
        var W = '<a href="' + j + '"';
        return D !== "" && D !== null && (D = D.replace(/"/g, "&quot;"), D = D.replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback), W += ' title="' + D + '"'), s.openLinksInNewWindow && !/^#/.test(j) && (W += ' rel="noopener noreferrer" target="¨E95Eblank"'), W += ">" + _ + "</a>", W;
      };
      return r = r.replace(/\[((?:\[[^\]]*]|[^\[\]])*)] ?(?:\n *)?\[(.*?)]()()()()/g, c), r = r.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<([^>]*)>(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        c
      ), r = r.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        c
      ), r = r.replace(/\[([^\[\]]+)]()()()()()/g, c), s.ghMentions && (r = r.replace(/(^|\s)(\\)?(@([a-z\d]+(?:[a-z\d.-]+?[a-z\d]+)*))/gmi, function(u, _, f, j, F) {
        if (f === "\\")
          return _ + j;
        if (!a.helper.isString(s.ghMentionsLink))
          throw new Error("ghMentionsLink option must be a string");
        var U = s.ghMentionsLink.replace(/\{u}/g, F), D = "";
        return s.openLinksInNewWindow && (D = ' rel="noopener noreferrer" target="¨E95Eblank"'), _ + '<a href="' + U + '"' + D + ">" + j + "</a>";
      })), r = o.converter._dispatch("anchors.after", r, s, o), r;
    });
    var I = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+?\.[^'">\s]+?)()(\1)?(?=\s|$)(?!["<>])/gi, M = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+?)([.!?,()\[\]])?(\1)?(?=\s|$)(?!["<>])/gi, O = /()<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)()>()/gi, x = /(^|\s)(?:mailto:)?([A-Za-z0-9!#$%&'*+-/=?^_`{|}~.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?=$|\s)/gmi, T = /<()(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi, k = function(r) {
      return function(s, o, c, u, _, f, j) {
        c = c.replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback);
        var F = c, U = "", D = "", W = o || "", w = j || "";
        return /^www\./i.test(c) && (c = c.replace(/^www\./i, "http://www.")), r.excludeTrailingPunctuationFromURLs && f && (U = f), r.openLinksInNewWindow && (D = ' rel="noopener noreferrer" target="¨E95Eblank"'), W + '<a href="' + c + '"' + D + ">" + F + "</a>" + U + w;
      };
    }, A = function(r, s) {
      return function(o, c, u) {
        var _ = "mailto:";
        return c = c || "", u = a.subParser("unescapeSpecialChars")(u, r, s), r.encodeEmails ? (_ = a.helper.encodeEmailAddress(_ + u), u = a.helper.encodeEmailAddress(u)) : _ = _ + u, c + '<a href="' + _ + '">' + u + "</a>";
      };
    };
    a.subParser("autoLinks", function(r, s, o) {
      return r = o.converter._dispatch("autoLinks.before", r, s, o), r = r.replace(O, k(s)), r = r.replace(T, A(s, o)), r = o.converter._dispatch("autoLinks.after", r, s, o), r;
    }), a.subParser("simplifiedAutoLinks", function(r, s, o) {
      return s.simplifiedAutoLink && (r = o.converter._dispatch("simplifiedAutoLinks.before", r, s, o), s.excludeTrailingPunctuationFromURLs ? r = r.replace(M, k(s)) : r = r.replace(I, k(s)), r = r.replace(x, A(s, o)), r = o.converter._dispatch("simplifiedAutoLinks.after", r, s, o)), r;
    }), a.subParser("blockGamut", function(r, s, o) {
      return r = o.converter._dispatch("blockGamut.before", r, s, o), r = a.subParser("blockQuotes")(r, s, o), r = a.subParser("headers")(r, s, o), r = a.subParser("horizontalRule")(r, s, o), r = a.subParser("lists")(r, s, o), r = a.subParser("codeBlocks")(r, s, o), r = a.subParser("tables")(r, s, o), r = a.subParser("hashHTMLBlocks")(r, s, o), r = a.subParser("paragraphs")(r, s, o), r = o.converter._dispatch("blockGamut.after", r, s, o), r;
    }), a.subParser("blockQuotes", function(r, s, o) {
      r = o.converter._dispatch("blockQuotes.before", r, s, o), r = r + `

`;
      var c = /(^ {0,3}>[ \t]?.+\n(.+\n)*\n*)+/gm;
      return s.splitAdjacentBlockquotes && (c = /^ {0,3}>[\s\S]*?(?:\n\n)/gm), r = r.replace(c, function(u) {
        return u = u.replace(/^[ \t]*>[ \t]?/gm, ""), u = u.replace(/¨0/g, ""), u = u.replace(/^[ \t]+$/gm, ""), u = a.subParser("githubCodeBlocks")(u, s, o), u = a.subParser("blockGamut")(u, s, o), u = u.replace(/(^|\n)/g, "$1  "), u = u.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(_, f) {
          var j = f;
          return j = j.replace(/^  /mg, "¨0"), j = j.replace(/¨0/g, ""), j;
        }), a.subParser("hashBlock")(`<blockquote>
` + u + `
</blockquote>`, s, o);
      }), r = o.converter._dispatch("blockQuotes.after", r, s, o), r;
    }), a.subParser("codeBlocks", function(r, s, o) {
      r = o.converter._dispatch("codeBlocks.before", r, s, o), r += "¨0";
      var c = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=¨0))/g;
      return r = r.replace(c, function(u, _, f) {
        var j = _, F = f, U = `
`;
        return j = a.subParser("outdent")(j, s, o), j = a.subParser("encodeCode")(j, s, o), j = a.subParser("detab")(j, s, o), j = j.replace(/^\n+/g, ""), j = j.replace(/\n+$/g, ""), s.omitExtraWLInCodeBlocks && (U = ""), j = "<pre><code>" + j + U + "</code></pre>", a.subParser("hashBlock")(j, s, o) + F;
      }), r = r.replace(/¨0/, ""), r = o.converter._dispatch("codeBlocks.after", r, s, o), r;
    }), a.subParser("codeSpans", function(r, s, o) {
      return r = o.converter._dispatch("codeSpans.before", r, s, o), typeof r > "u" && (r = ""), r = r.replace(
        /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
        function(c, u, _, f) {
          var j = f;
          return j = j.replace(/^([ \t]*)/g, ""), j = j.replace(/[ \t]*$/g, ""), j = a.subParser("encodeCode")(j, s, o), j = u + "<code>" + j + "</code>", j = a.subParser("hashHTMLSpans")(j, s, o), j;
        }
      ), r = o.converter._dispatch("codeSpans.after", r, s, o), r;
    }), a.subParser("completeHTMLDocument", function(r, s, o) {
      if (!s.completeHTMLDocument)
        return r;
      r = o.converter._dispatch("completeHTMLDocument.before", r, s, o);
      var c = "html", u = `<!DOCTYPE HTML>
`, _ = "", f = `<meta charset="utf-8">
`, j = "", F = "";
      typeof o.metadata.parsed.doctype < "u" && (u = "<!DOCTYPE " + o.metadata.parsed.doctype + `>
`, c = o.metadata.parsed.doctype.toString().toLowerCase(), (c === "html" || c === "html5") && (f = '<meta charset="utf-8">'));
      for (var U in o.metadata.parsed)
        if (o.metadata.parsed.hasOwnProperty(U))
          switch (U.toLowerCase()) {
            case "doctype":
              break;
            case "title":
              _ = "<title>" + o.metadata.parsed.title + `</title>
`;
              break;
            case "charset":
              c === "html" || c === "html5" ? f = '<meta charset="' + o.metadata.parsed.charset + `">
` : f = '<meta name="charset" content="' + o.metadata.parsed.charset + `">
`;
              break;
            case "language":
            case "lang":
              j = ' lang="' + o.metadata.parsed[U] + '"', F += '<meta name="' + U + '" content="' + o.metadata.parsed[U] + `">
`;
              break;
            default:
              F += '<meta name="' + U + '" content="' + o.metadata.parsed[U] + `">
`;
          }
      return r = u + "<html" + j + `>
<head>
` + _ + f + F + `</head>
<body>
` + r.trim() + `
</body>
</html>`, r = o.converter._dispatch("completeHTMLDocument.after", r, s, o), r;
    }), a.subParser("detab", function(r, s, o) {
      return r = o.converter._dispatch("detab.before", r, s, o), r = r.replace(/\t(?=\t)/g, "    "), r = r.replace(/\t/g, "¨A¨B"), r = r.replace(/¨B(.+?)¨A/g, function(c, u) {
        for (var _ = u, f = 4 - _.length % 4, j = 0; j < f; j++)
          _ += " ";
        return _;
      }), r = r.replace(/¨A/g, "    "), r = r.replace(/¨B/g, ""), r = o.converter._dispatch("detab.after", r, s, o), r;
    }), a.subParser("ellipsis", function(r, s, o) {
      return s.ellipsis && (r = o.converter._dispatch("ellipsis.before", r, s, o), r = r.replace(/\.\.\./g, "…"), r = o.converter._dispatch("ellipsis.after", r, s, o)), r;
    }), a.subParser("emoji", function(r, s, o) {
      if (!s.emoji)
        return r;
      r = o.converter._dispatch("emoji.before", r, s, o);
      var c = /:([\S]+?):/g;
      return r = r.replace(c, function(u, _) {
        return a.helper.emojis.hasOwnProperty(_) ? a.helper.emojis[_] : u;
      }), r = o.converter._dispatch("emoji.after", r, s, o), r;
    }), a.subParser("encodeAmpsAndAngles", function(r, s, o) {
      return r = o.converter._dispatch("encodeAmpsAndAngles.before", r, s, o), r = r.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;"), r = r.replace(/<(?![a-z\/?$!])/gi, "&lt;"), r = r.replace(/</g, "&lt;"), r = r.replace(/>/g, "&gt;"), r = o.converter._dispatch("encodeAmpsAndAngles.after", r, s, o), r;
    }), a.subParser("encodeBackslashEscapes", function(r, s, o) {
      return r = o.converter._dispatch("encodeBackslashEscapes.before", r, s, o), r = r.replace(/\\(\\)/g, a.helper.escapeCharactersCallback), r = r.replace(/\\([`*_{}\[\]()>#+.!~=|:-])/g, a.helper.escapeCharactersCallback), r = o.converter._dispatch("encodeBackslashEscapes.after", r, s, o), r;
    }), a.subParser("encodeCode", function(r, s, o) {
      return r = o.converter._dispatch("encodeCode.before", r, s, o), r = r.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/([*_{}\[\]\\=~-])/g, a.helper.escapeCharactersCallback), r = o.converter._dispatch("encodeCode.after", r, s, o), r;
    }), a.subParser("escapeSpecialCharsWithinTagAttributes", function(r, s, o) {
      r = o.converter._dispatch("escapeSpecialCharsWithinTagAttributes.before", r, s, o);
      var c = /<\/?[a-z\d_:-]+(?:[\s]+[\s\S]+?)?>/gi, u = /<!(--(?:(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>/gi;
      return r = r.replace(c, function(_) {
        return _.replace(/(.)<\/?code>(?=.)/g, "$1`").replace(/([\\`*_~=|])/g, a.helper.escapeCharactersCallback);
      }), r = r.replace(u, function(_) {
        return _.replace(/([\\`*_~=|])/g, a.helper.escapeCharactersCallback);
      }), r = o.converter._dispatch("escapeSpecialCharsWithinTagAttributes.after", r, s, o), r;
    }), a.subParser("githubCodeBlocks", function(r, s, o) {
      return s.ghCodeBlocks ? (r = o.converter._dispatch("githubCodeBlocks.before", r, s, o), r += "¨0", r = r.replace(/(?:^|\n)(?: {0,3})(```+|~~~+)(?: *)([^\s`~]*)\n([\s\S]*?)\n(?: {0,3})\1/g, function(c, u, _, f) {
        var j = s.omitExtraWLInCodeBlocks ? "" : `
`;
        return f = a.subParser("encodeCode")(f, s, o), f = a.subParser("detab")(f, s, o), f = f.replace(/^\n+/g, ""), f = f.replace(/\n+$/g, ""), f = "<pre><code" + (_ ? ' class="' + _ + " language-" + _ + '"' : "") + ">" + f + j + "</code></pre>", f = a.subParser("hashBlock")(f, s, o), `

¨G` + (o.ghCodeBlocks.push({ text: c, codeblock: f }) - 1) + `G

`;
      }), r = r.replace(/¨0/, ""), o.converter._dispatch("githubCodeBlocks.after", r, s, o)) : r;
    }), a.subParser("hashBlock", function(r, s, o) {
      return r = o.converter._dispatch("hashBlock.before", r, s, o), r = r.replace(/(^\n+|\n+$)/g, ""), r = `

¨K` + (o.gHtmlBlocks.push(r) - 1) + `K

`, r = o.converter._dispatch("hashBlock.after", r, s, o), r;
    }), a.subParser("hashCodeTags", function(r, s, o) {
      r = o.converter._dispatch("hashCodeTags.before", r, s, o);
      var c = function(u, _, f, j) {
        var F = f + a.subParser("encodeCode")(_, s, o) + j;
        return "¨C" + (o.gHtmlSpans.push(F) - 1) + "C";
      };
      return r = a.helper.replaceRecursiveRegExp(r, c, "<code\\b[^>]*>", "</code>", "gim"), r = o.converter._dispatch("hashCodeTags.after", r, s, o), r;
    }), a.subParser("hashElement", function(r, s, o) {
      return function(c, u) {
        var _ = u;
        return _ = _.replace(/\n\n/g, `
`), _ = _.replace(/^\n/, ""), _ = _.replace(/\n+$/g, ""), _ = `

¨K` + (o.gHtmlBlocks.push(_) - 1) + `K

`, _;
      };
    }), a.subParser("hashHTMLBlocks", function(r, s, o) {
      r = o.converter._dispatch("hashHTMLBlocks.before", r, s, o);
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
      ], u = function(w, G, Q, ee) {
        var q = w;
        return Q.search(/\bmarkdown\b/) !== -1 && (q = Q + o.converter.makeHtml(G) + ee), `

¨K` + (o.gHtmlBlocks.push(q) - 1) + `K

`;
      };
      s.backslashEscapesHTMLTags && (r = r.replace(/\\<(\/?[^>]+?)>/g, function(w, G) {
        return "&lt;" + G + "&gt;";
      }));
      for (var _ = 0; _ < c.length; ++_)
        for (var f, j = new RegExp("^ {0,3}(<" + c[_] + "\\b[^>]*>)", "im"), F = "<" + c[_] + "\\b[^>]*>", U = "</" + c[_] + ">"; (f = a.helper.regexIndexOf(r, j)) !== -1; ) {
          var D = a.helper.splitAtIndex(r, f), W = a.helper.replaceRecursiveRegExp(D[1], u, F, U, "im");
          if (W === D[1])
            break;
          r = D[0].concat(W);
        }
      return r = r.replace(
        /(\n {0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
        a.subParser("hashElement")(r, s, o)
      ), r = a.helper.replaceRecursiveRegExp(r, function(w) {
        return `

¨K` + (o.gHtmlBlocks.push(w) - 1) + `K

`;
      }, "^ {0,3}<!--", "-->", "gm"), r = r.replace(
        /(?:\n\n)( {0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
        a.subParser("hashElement")(r, s, o)
      ), r = o.converter._dispatch("hashHTMLBlocks.after", r, s, o), r;
    }), a.subParser("hashHTMLSpans", function(r, s, o) {
      r = o.converter._dispatch("hashHTMLSpans.before", r, s, o);
      function c(u) {
        return "¨C" + (o.gHtmlSpans.push(u) - 1) + "C";
      }
      return r = r.replace(/<[^>]+?\/>/gi, function(u) {
        return c(u);
      }), r = r.replace(/<([^>]+?)>[\s\S]*?<\/\1>/g, function(u) {
        return c(u);
      }), r = r.replace(/<([^>]+?)\s[^>]+?>[\s\S]*?<\/\1>/g, function(u) {
        return c(u);
      }), r = r.replace(/<[^>]+?>/gi, function(u) {
        return c(u);
      }), r = o.converter._dispatch("hashHTMLSpans.after", r, s, o), r;
    }), a.subParser("unhashHTMLSpans", function(r, s, o) {
      r = o.converter._dispatch("unhashHTMLSpans.before", r, s, o);
      for (var c = 0; c < o.gHtmlSpans.length; ++c) {
        for (var u = o.gHtmlSpans[c], _ = 0; /¨C(\d+)C/.test(u); ) {
          var f = RegExp.$1;
          if (u = u.replace("¨C" + f + "C", o.gHtmlSpans[f]), _ === 10) {
            console.error("maximum nesting of 10 spans reached!!!");
            break;
          }
          ++_;
        }
        r = r.replace("¨C" + c + "C", u);
      }
      return r = o.converter._dispatch("unhashHTMLSpans.after", r, s, o), r;
    }), a.subParser("hashPreCodeTags", function(r, s, o) {
      r = o.converter._dispatch("hashPreCodeTags.before", r, s, o);
      var c = function(u, _, f, j) {
        var F = f + a.subParser("encodeCode")(_, s, o) + j;
        return `

¨G` + (o.ghCodeBlocks.push({ text: u, codeblock: F }) - 1) + `G

`;
      };
      return r = a.helper.replaceRecursiveRegExp(r, c, "^ {0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>", "^ {0,3}</code>\\s*</pre>", "gim"), r = o.converter._dispatch("hashPreCodeTags.after", r, s, o), r;
    }), a.subParser("headers", function(r, s, o) {
      r = o.converter._dispatch("headers.before", r, s, o);
      var c = isNaN(parseInt(s.headerLevelStart)) ? 1 : parseInt(s.headerLevelStart), u = s.smoothLivePreview ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm, _ = s.smoothLivePreview ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;
      r = r.replace(u, function(F, U) {
        var D = a.subParser("spanGamut")(U, s, o), W = s.noHeaderId ? "" : ' id="' + j(U) + '"', w = c, G = "<h" + w + W + ">" + D + "</h" + w + ">";
        return a.subParser("hashBlock")(G, s, o);
      }), r = r.replace(_, function(F, U) {
        var D = a.subParser("spanGamut")(U, s, o), W = s.noHeaderId ? "" : ' id="' + j(U) + '"', w = c + 1, G = "<h" + w + W + ">" + D + "</h" + w + ">";
        return a.subParser("hashBlock")(G, s, o);
      });
      var f = s.requireSpaceBeforeHeadingText ? /^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm : /^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm;
      r = r.replace(f, function(F, U, D) {
        var W = D;
        s.customizedHeaderId && (W = D.replace(/\s?\{([^{]+?)}\s*$/, ""));
        var w = a.subParser("spanGamut")(W, s, o), G = s.noHeaderId ? "" : ' id="' + j(D) + '"', Q = c - 1 + U.length, ee = "<h" + Q + G + ">" + w + "</h" + Q + ">";
        return a.subParser("hashBlock")(ee, s, o);
      });
      function j(F) {
        var U, D;
        if (s.customizedHeaderId) {
          var W = F.match(/\{([^{]+?)}\s*$/);
          W && W[1] && (F = W[1]);
        }
        return U = F, a.helper.isString(s.prefixHeaderId) ? D = s.prefixHeaderId : s.prefixHeaderId === !0 ? D = "section-" : D = "", s.rawPrefixHeaderId || (U = D + U), s.ghCompatibleHeaderId ? U = U.replace(/ /g, "-").replace(/&amp;/g, "").replace(/¨T/g, "").replace(/¨D/g, "").replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g, "").toLowerCase() : s.rawHeaderId ? U = U.replace(/ /g, "-").replace(/&amp;/g, "&").replace(/¨T/g, "¨").replace(/¨D/g, "$").replace(/["']/g, "-").toLowerCase() : U = U.replace(/[^\w]/g, "").toLowerCase(), s.rawPrefixHeaderId && (U = D + U), o.hashLinkCounts[U] ? U = U + "-" + o.hashLinkCounts[U]++ : o.hashLinkCounts[U] = 1, U;
      }
      return r = o.converter._dispatch("headers.after", r, s, o), r;
    }), a.subParser("horizontalRule", function(r, s, o) {
      r = o.converter._dispatch("horizontalRule.before", r, s, o);
      var c = a.subParser("hashBlock")("<hr />", s, o);
      return r = r.replace(/^ {0,2}( ?-){3,}[ \t]*$/gm, c), r = r.replace(/^ {0,2}( ?\*){3,}[ \t]*$/gm, c), r = r.replace(/^ {0,2}( ?_){3,}[ \t]*$/gm, c), r = o.converter._dispatch("horizontalRule.after", r, s, o), r;
    }), a.subParser("images", function(r, s, o) {
      r = o.converter._dispatch("images.before", r, s, o);
      var c = /!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, u = /!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)/g, _ = /!\[([^\]]*?)][ \t]*()\([ \t]?<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, f = /!\[([^\]]*?)] ?(?:\n *)?\[([\s\S]*?)]()()()()()/g, j = /!\[([^\[\]]+)]()()()()()/g;
      function F(D, W, w, G, Q, ee, q, P) {
        return G = G.replace(/\s/g, ""), U(D, W, w, G, Q, ee, q, P);
      }
      function U(D, W, w, G, Q, ee, q, P) {
        var H = o.gUrls, N = o.gTitles, d = o.gDimensions;
        if (w = w.toLowerCase(), P || (P = ""), D.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          G = "";
        else if (G === "" || G === null)
          if ((w === "" || w === null) && (w = W.toLowerCase().replace(/ ?\n/g, " ")), G = "#" + w, !a.helper.isUndefined(H[w]))
            G = H[w], a.helper.isUndefined(N[w]) || (P = N[w]), a.helper.isUndefined(d[w]) || (Q = d[w].width, ee = d[w].height);
          else
            return D;
        W = W.replace(/"/g, "&quot;").replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback), G = G.replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback);
        var y = '<img src="' + G + '" alt="' + W + '"';
        return P && a.helper.isString(P) && (P = P.replace(/"/g, "&quot;").replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback), y += ' title="' + P + '"'), Q && ee && (Q = Q === "*" ? "auto" : Q, ee = ee === "*" ? "auto" : ee, y += ' width="' + Q + '"', y += ' height="' + ee + '"'), y += " />", y;
      }
      return r = r.replace(f, U), r = r.replace(_, F), r = r.replace(u, U), r = r.replace(c, U), r = r.replace(j, U), r = o.converter._dispatch("images.after", r, s, o), r;
    }), a.subParser("italicsAndBold", function(r, s, o) {
      r = o.converter._dispatch("italicsAndBold.before", r, s, o);
      function c(u, _, f) {
        return _ + u + f;
      }
      return s.literalMidWordUnderscores ? (r = r.replace(/\b___(\S[\s\S]*?)___\b/g, function(u, _) {
        return c(_, "<strong><em>", "</em></strong>");
      }), r = r.replace(/\b__(\S[\s\S]*?)__\b/g, function(u, _) {
        return c(_, "<strong>", "</strong>");
      }), r = r.replace(/\b_(\S[\s\S]*?)_\b/g, function(u, _) {
        return c(_, "<em>", "</em>");
      })) : (r = r.replace(/___(\S[\s\S]*?)___/g, function(u, _) {
        return /\S$/.test(_) ? c(_, "<strong><em>", "</em></strong>") : u;
      }), r = r.replace(/__(\S[\s\S]*?)__/g, function(u, _) {
        return /\S$/.test(_) ? c(_, "<strong>", "</strong>") : u;
      }), r = r.replace(/_([^\s_][\s\S]*?)_/g, function(u, _) {
        return /\S$/.test(_) ? c(_, "<em>", "</em>") : u;
      })), s.literalMidWordAsterisks ? (r = r.replace(/([^*]|^)\B\*\*\*(\S[\s\S]*?)\*\*\*\B(?!\*)/g, function(u, _, f) {
        return c(f, _ + "<strong><em>", "</em></strong>");
      }), r = r.replace(/([^*]|^)\B\*\*(\S[\s\S]*?)\*\*\B(?!\*)/g, function(u, _, f) {
        return c(f, _ + "<strong>", "</strong>");
      }), r = r.replace(/([^*]|^)\B\*(\S[\s\S]*?)\*\B(?!\*)/g, function(u, _, f) {
        return c(f, _ + "<em>", "</em>");
      })) : (r = r.replace(/\*\*\*(\S[\s\S]*?)\*\*\*/g, function(u, _) {
        return /\S$/.test(_) ? c(_, "<strong><em>", "</em></strong>") : u;
      }), r = r.replace(/\*\*(\S[\s\S]*?)\*\*/g, function(u, _) {
        return /\S$/.test(_) ? c(_, "<strong>", "</strong>") : u;
      }), r = r.replace(/\*([^\s*][\s\S]*?)\*/g, function(u, _) {
        return /\S$/.test(_) ? c(_, "<em>", "</em>") : u;
      })), r = o.converter._dispatch("italicsAndBold.after", r, s, o), r;
    }), a.subParser("lists", function(r, s, o) {
      function c(f, j) {
        o.gListLevel++, f = f.replace(/\n{2,}$/, `
`), f += "¨0";
        var F = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0| {0,3}([*+-]|\d+[.])[ \t]+))/gm, U = /\n[ \t]*\n(?!¨0)/.test(f);
        return s.disableForced4SpacesIndentedSublists && (F = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0|\2([*+-]|\d+[.])[ \t]+))/gm), f = f.replace(F, function(D, W, w, G, Q, ee, q) {
          q = q && q.trim() !== "";
          var P = a.subParser("outdent")(Q, s, o), H = "";
          return ee && s.tasklists && (H = ' class="task-list-item" style="list-style-type: none;"', P = P.replace(/^[ \t]*\[(x|X| )?]/m, function() {
            var N = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
            return q && (N += " checked"), N += ">", N;
          })), P = P.replace(/^([-*+]|\d\.)[ \t]+[\S\n ]*/g, function(N) {
            return "¨A" + N;
          }), W || P.search(/\n{2,}/) > -1 ? (P = a.subParser("githubCodeBlocks")(P, s, o), P = a.subParser("blockGamut")(P, s, o)) : (P = a.subParser("lists")(P, s, o), P = P.replace(/\n$/, ""), P = a.subParser("hashHTMLBlocks")(P, s, o), P = P.replace(/\n\n+/g, `

`), U ? P = a.subParser("paragraphs")(P, s, o) : P = a.subParser("spanGamut")(P, s, o)), P = P.replace("¨A", ""), P = "<li" + H + ">" + P + `</li>
`, P;
        }), f = f.replace(/¨0/g, ""), o.gListLevel--, j && (f = f.replace(/\s+$/, "")), f;
      }
      function u(f, j) {
        if (j === "ol") {
          var F = f.match(/^ *(\d+)\./);
          if (F && F[1] !== "1")
            return ' start="' + F[1] + '"';
        }
        return "";
      }
      function _(f, j, F) {
        var U = s.disableForced4SpacesIndentedSublists ? /^ ?\d+\.[ \t]/gm : /^ {0,3}\d+\.[ \t]/gm, D = s.disableForced4SpacesIndentedSublists ? /^ ?[*+-][ \t]/gm : /^ {0,3}[*+-][ \t]/gm, W = j === "ul" ? U : D, w = "";
        if (f.search(W) !== -1)
          (function Q(ee) {
            var q = ee.search(W), P = u(f, j);
            q !== -1 ? (w += `

<` + j + P + `>
` + c(ee.slice(0, q), !!F) + "</" + j + `>
`, j = j === "ul" ? "ol" : "ul", W = j === "ul" ? U : D, Q(ee.slice(q))) : w += `

<` + j + P + `>
` + c(ee, !!F) + "</" + j + `>
`;
          })(f);
        else {
          var G = u(f, j);
          w = `

<` + j + G + `>
` + c(f, !!F) + "</" + j + `>
`;
        }
        return w;
      }
      return r = o.converter._dispatch("lists.before", r, s, o), r += "¨0", o.gListLevel ? r = r.replace(
        /^(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(f, j, F) {
          var U = F.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return _(j, U, !0);
        }
      ) : r = r.replace(
        /(\n\n|^\n?)(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(f, j, F, U) {
          var D = U.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return _(F, D, !1);
        }
      ), r = r.replace(/¨0/, ""), r = o.converter._dispatch("lists.after", r, s, o), r;
    }), a.subParser("metadata", function(r, s, o) {
      if (!s.metadata)
        return r;
      r = o.converter._dispatch("metadata.before", r, s, o);
      function c(u) {
        o.metadata.raw = u, u = u.replace(/&/g, "&amp;").replace(/"/g, "&quot;"), u = u.replace(/\n {4}/g, " "), u.replace(/^([\S ]+): +([\s\S]+?)$/gm, function(_, f, j) {
          return o.metadata.parsed[f] = j, "";
        });
      }
      return r = r.replace(/^\s*«««+(\S*?)\n([\s\S]+?)\n»»»+\n/, function(u, _, f) {
        return c(f), "¨M";
      }), r = r.replace(/^\s*---+(\S*?)\n([\s\S]+?)\n---+\n/, function(u, _, f) {
        return _ && (o.metadata.format = _), c(f), "¨M";
      }), r = r.replace(/¨M/g, ""), r = o.converter._dispatch("metadata.after", r, s, o), r;
    }), a.subParser("outdent", function(r, s, o) {
      return r = o.converter._dispatch("outdent.before", r, s, o), r = r.replace(/^(\t|[ ]{1,4})/gm, "¨0"), r = r.replace(/¨0/g, ""), r = o.converter._dispatch("outdent.after", r, s, o), r;
    }), a.subParser("paragraphs", function(r, s, o) {
      r = o.converter._dispatch("paragraphs.before", r, s, o), r = r.replace(/^\n+/g, ""), r = r.replace(/\n+$/g, "");
      for (var c = r.split(/\n{2,}/g), u = [], _ = c.length, f = 0; f < _; f++) {
        var j = c[f];
        j.search(/¨(K|G)(\d+)\1/g) >= 0 ? u.push(j) : j.search(/\S/) >= 0 && (j = a.subParser("spanGamut")(j, s, o), j = j.replace(/^([ \t]*)/g, "<p>"), j += "</p>", u.push(j));
      }
      for (_ = u.length, f = 0; f < _; f++) {
        for (var F = "", U = u[f], D = !1; /¨(K|G)(\d+)\1/.test(U); ) {
          var W = RegExp.$1, w = RegExp.$2;
          W === "K" ? F = o.gHtmlBlocks[w] : D ? F = a.subParser("encodeCode")(o.ghCodeBlocks[w].text, s, o) : F = o.ghCodeBlocks[w].codeblock, F = F.replace(/\$/g, "$$$$"), U = U.replace(/(\n\n)?¨(K|G)\d+\2(\n\n)?/, F), /^<pre\b[^>]*>\s*<code\b[^>]*>/.test(U) && (D = !0);
        }
        u[f] = U;
      }
      return r = u.join(`
`), r = r.replace(/^\n+/g, ""), r = r.replace(/\n+$/g, ""), o.converter._dispatch("paragraphs.after", r, s, o);
    }), a.subParser("runExtension", function(r, s, o, c) {
      if (r.filter)
        s = r.filter(s, c.converter, o);
      else if (r.regex) {
        var u = r.regex;
        u instanceof RegExp || (u = new RegExp(u, "g")), s = s.replace(u, r.replace);
      }
      return s;
    }), a.subParser("spanGamut", function(r, s, o) {
      return r = o.converter._dispatch("spanGamut.before", r, s, o), r = a.subParser("codeSpans")(r, s, o), r = a.subParser("escapeSpecialCharsWithinTagAttributes")(r, s, o), r = a.subParser("encodeBackslashEscapes")(r, s, o), r = a.subParser("images")(r, s, o), r = a.subParser("anchors")(r, s, o), r = a.subParser("autoLinks")(r, s, o), r = a.subParser("simplifiedAutoLinks")(r, s, o), r = a.subParser("emoji")(r, s, o), r = a.subParser("underline")(r, s, o), r = a.subParser("italicsAndBold")(r, s, o), r = a.subParser("strikethrough")(r, s, o), r = a.subParser("ellipsis")(r, s, o), r = a.subParser("hashHTMLSpans")(r, s, o), r = a.subParser("encodeAmpsAndAngles")(r, s, o), s.simpleLineBreaks ? /\n\n¨K/.test(r) || (r = r.replace(/\n+/g, `<br />
`)) : r = r.replace(/  +\n/g, `<br />
`), r = o.converter._dispatch("spanGamut.after", r, s, o), r;
    }), a.subParser("strikethrough", function(r, s, o) {
      function c(u) {
        return s.simplifiedAutoLink && (u = a.subParser("simplifiedAutoLinks")(u, s, o)), "<del>" + u + "</del>";
      }
      return s.strikethrough && (r = o.converter._dispatch("strikethrough.before", r, s, o), r = r.replace(/(?:~){2}([\s\S]+?)(?:~){2}/g, function(u, _) {
        return c(_);
      }), r = o.converter._dispatch("strikethrough.after", r, s, o)), r;
    }), a.subParser("stripLinkDefinitions", function(r, s, o) {
      var c = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?([^>\s]+)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=¨0))/gm, u = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n\n|(?=¨0)|(?=\n\[))/gm;
      r += "¨0";
      var _ = function(f, j, F, U, D, W, w) {
        return j = j.toLowerCase(), r.toLowerCase().split(j).length - 1 < 2 ? f : (F.match(/^data:.+?\/.+?;base64,/) ? o.gUrls[j] = F.replace(/\s/g, "") : o.gUrls[j] = a.subParser("encodeAmpsAndAngles")(F, s, o), W ? W + w : (w && (o.gTitles[j] = w.replace(/"|'/g, "&quot;")), s.parseImgDimensions && U && D && (o.gDimensions[j] = {
          width: U,
          height: D
        }), ""));
      };
      return r = r.replace(u, _), r = r.replace(c, _), r = r.replace(/¨0/, ""), r;
    }), a.subParser("tables", function(r, s, o) {
      if (!s.tables)
        return r;
      var c = /^ {0,3}\|?.+\|.+\n {0,3}\|?[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:[-=]){2,}[\s\S]+?(?:\n\n|¨0)/gm, u = /^ {0,3}\|.+\|[ \t]*\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n( {0,3}\|.+\|[ \t]*\n)*(?:\n|¨0)/gm;
      function _(D) {
        return /^:[ \t]*--*$/.test(D) ? ' style="text-align:left;"' : /^--*[ \t]*:[ \t]*$/.test(D) ? ' style="text-align:right;"' : /^:[ \t]*--*[ \t]*:$/.test(D) ? ' style="text-align:center;"' : "";
      }
      function f(D, W) {
        var w = "";
        return D = D.trim(), (s.tablesHeaderId || s.tableHeaderId) && (w = ' id="' + D.replace(/ /g, "_").toLowerCase() + '"'), D = a.subParser("spanGamut")(D, s, o), "<th" + w + W + ">" + D + `</th>
`;
      }
      function j(D, W) {
        var w = a.subParser("spanGamut")(D, s, o);
        return "<td" + W + ">" + w + `</td>
`;
      }
      function F(D, W) {
        for (var w = `<table>
<thead>
<tr>
`, G = D.length, Q = 0; Q < G; ++Q)
          w += D[Q];
        for (w += `</tr>
</thead>
<tbody>
`, Q = 0; Q < W.length; ++Q) {
          w += `<tr>
`;
          for (var ee = 0; ee < G; ++ee)
            w += W[Q][ee];
          w += `</tr>
`;
        }
        return w += `</tbody>
</table>
`, w;
      }
      function U(D) {
        var W, w = D.split(`
`);
        for (W = 0; W < w.length; ++W)
          /^ {0,3}\|/.test(w[W]) && (w[W] = w[W].replace(/^ {0,3}\|/, "")), /\|[ \t]*$/.test(w[W]) && (w[W] = w[W].replace(/\|[ \t]*$/, "")), w[W] = a.subParser("codeSpans")(w[W], s, o);
        var G = w[0].split("|").map(function(y) {
          return y.trim();
        }), Q = w[1].split("|").map(function(y) {
          return y.trim();
        }), ee = [], q = [], P = [], H = [];
        for (w.shift(), w.shift(), W = 0; W < w.length; ++W)
          w[W].trim() !== "" && ee.push(
            w[W].split("|").map(function(y) {
              return y.trim();
            })
          );
        if (G.length < Q.length)
          return D;
        for (W = 0; W < Q.length; ++W)
          P.push(_(Q[W]));
        for (W = 0; W < G.length; ++W)
          a.helper.isUndefined(P[W]) && (P[W] = ""), q.push(f(G[W], P[W]));
        for (W = 0; W < ee.length; ++W) {
          for (var N = [], d = 0; d < q.length; ++d)
            a.helper.isUndefined(ee[W][d]), N.push(j(ee[W][d], P[d]));
          H.push(N);
        }
        return F(q, H);
      }
      return r = o.converter._dispatch("tables.before", r, s, o), r = r.replace(/\\(\|)/g, a.helper.escapeCharactersCallback), r = r.replace(c, U), r = r.replace(u, U), r = o.converter._dispatch("tables.after", r, s, o), r;
    }), a.subParser("underline", function(r, s, o) {
      return s.underline && (r = o.converter._dispatch("underline.before", r, s, o), s.literalMidWordUnderscores ? (r = r.replace(/\b___(\S[\s\S]*?)___\b/g, function(c, u) {
        return "<u>" + u + "</u>";
      }), r = r.replace(/\b__(\S[\s\S]*?)__\b/g, function(c, u) {
        return "<u>" + u + "</u>";
      })) : (r = r.replace(/___(\S[\s\S]*?)___/g, function(c, u) {
        return /\S$/.test(u) ? "<u>" + u + "</u>" : c;
      }), r = r.replace(/__(\S[\s\S]*?)__/g, function(c, u) {
        return /\S$/.test(u) ? "<u>" + u + "</u>" : c;
      })), r = r.replace(/(_)/g, a.helper.escapeCharactersCallback), r = o.converter._dispatch("underline.after", r, s, o)), r;
    }), a.subParser("unescapeSpecialChars", function(r, s, o) {
      return r = o.converter._dispatch("unescapeSpecialChars.before", r, s, o), r = r.replace(/¨E(\d+)E/g, function(c, u) {
        var _ = parseInt(u);
        return String.fromCharCode(_);
      }), r = o.converter._dispatch("unescapeSpecialChars.after", r, s, o), r;
    }), a.subParser("makeMarkdown.blockquote", function(r, s) {
      var o = "";
      if (r.hasChildNodes())
        for (var c = r.childNodes, u = c.length, _ = 0; _ < u; ++_) {
          var f = a.subParser("makeMarkdown.node")(c[_], s);
          f !== "" && (o += f);
        }
      return o = o.trim(), o = "> " + o.split(`
`).join(`
> `), o;
    }), a.subParser("makeMarkdown.codeBlock", function(r, s) {
      var o = r.getAttribute("language"), c = r.getAttribute("precodenum");
      return "```" + o + `
` + s.preList[c] + "\n```";
    }), a.subParser("makeMarkdown.codeSpan", function(r) {
      return "`" + r.innerHTML + "`";
    }), a.subParser("makeMarkdown.emphasis", function(r, s) {
      var o = "";
      if (r.hasChildNodes()) {
        o += "*";
        for (var c = r.childNodes, u = c.length, _ = 0; _ < u; ++_)
          o += a.subParser("makeMarkdown.node")(c[_], s);
        o += "*";
      }
      return o;
    }), a.subParser("makeMarkdown.header", function(r, s, o) {
      var c = new Array(o + 1).join("#"), u = "";
      if (r.hasChildNodes()) {
        u = c + " ";
        for (var _ = r.childNodes, f = _.length, j = 0; j < f; ++j)
          u += a.subParser("makeMarkdown.node")(_[j], s);
      }
      return u;
    }), a.subParser("makeMarkdown.hr", function() {
      return "---";
    }), a.subParser("makeMarkdown.image", function(r) {
      var s = "";
      return r.hasAttribute("src") && (s += "![" + r.getAttribute("alt") + "](", s += "<" + r.getAttribute("src") + ">", r.hasAttribute("width") && r.hasAttribute("height") && (s += " =" + r.getAttribute("width") + "x" + r.getAttribute("height")), r.hasAttribute("title") && (s += ' "' + r.getAttribute("title") + '"'), s += ")"), s;
    }), a.subParser("makeMarkdown.links", function(r, s) {
      var o = "";
      if (r.hasChildNodes() && r.hasAttribute("href")) {
        var c = r.childNodes, u = c.length;
        o = "[";
        for (var _ = 0; _ < u; ++_)
          o += a.subParser("makeMarkdown.node")(c[_], s);
        o += "](", o += "<" + r.getAttribute("href") + ">", r.hasAttribute("title") && (o += ' "' + r.getAttribute("title") + '"'), o += ")";
      }
      return o;
    }), a.subParser("makeMarkdown.list", function(r, s, o) {
      var c = "";
      if (!r.hasChildNodes())
        return "";
      for (var u = r.childNodes, _ = u.length, f = r.getAttribute("start") || 1, j = 0; j < _; ++j)
        if (!(typeof u[j].tagName > "u" || u[j].tagName.toLowerCase() !== "li")) {
          var F = "";
          o === "ol" ? F = f.toString() + ". " : F = "- ", c += F + a.subParser("makeMarkdown.listItem")(u[j], s), ++f;
        }
      return c += `
<!-- -->
`, c.trim();
    }), a.subParser("makeMarkdown.listItem", function(r, s) {
      for (var o = "", c = r.childNodes, u = c.length, _ = 0; _ < u; ++_)
        o += a.subParser("makeMarkdown.node")(c[_], s);
      return /\n$/.test(o) ? o = o.split(`
`).join(`
    `).replace(/^ {4}$/gm, "").replace(/\n\n+/g, `

`) : o += `
`, o;
    }), a.subParser("makeMarkdown.node", function(r, s, o) {
      o = o || !1;
      var c = "";
      if (r.nodeType === 3)
        return a.subParser("makeMarkdown.txt")(r, s);
      if (r.nodeType === 8)
        return "<!--" + r.data + `-->

`;
      if (r.nodeType !== 1)
        return "";
      var u = r.tagName.toLowerCase();
      switch (u) {
        case "h1":
          o || (c = a.subParser("makeMarkdown.header")(r, s, 1) + `

`);
          break;
        case "h2":
          o || (c = a.subParser("makeMarkdown.header")(r, s, 2) + `

`);
          break;
        case "h3":
          o || (c = a.subParser("makeMarkdown.header")(r, s, 3) + `

`);
          break;
        case "h4":
          o || (c = a.subParser("makeMarkdown.header")(r, s, 4) + `

`);
          break;
        case "h5":
          o || (c = a.subParser("makeMarkdown.header")(r, s, 5) + `

`);
          break;
        case "h6":
          o || (c = a.subParser("makeMarkdown.header")(r, s, 6) + `

`);
          break;
        case "p":
          o || (c = a.subParser("makeMarkdown.paragraph")(r, s) + `

`);
          break;
        case "blockquote":
          o || (c = a.subParser("makeMarkdown.blockquote")(r, s) + `

`);
          break;
        case "hr":
          o || (c = a.subParser("makeMarkdown.hr")(r, s) + `

`);
          break;
        case "ol":
          o || (c = a.subParser("makeMarkdown.list")(r, s, "ol") + `

`);
          break;
        case "ul":
          o || (c = a.subParser("makeMarkdown.list")(r, s, "ul") + `

`);
          break;
        case "precode":
          o || (c = a.subParser("makeMarkdown.codeBlock")(r, s) + `

`);
          break;
        case "pre":
          o || (c = a.subParser("makeMarkdown.pre")(r, s) + `

`);
          break;
        case "table":
          o || (c = a.subParser("makeMarkdown.table")(r, s) + `

`);
          break;
        case "code":
          c = a.subParser("makeMarkdown.codeSpan")(r, s);
          break;
        case "em":
        case "i":
          c = a.subParser("makeMarkdown.emphasis")(r, s);
          break;
        case "strong":
        case "b":
          c = a.subParser("makeMarkdown.strong")(r, s);
          break;
        case "del":
          c = a.subParser("makeMarkdown.strikethrough")(r, s);
          break;
        case "a":
          c = a.subParser("makeMarkdown.links")(r, s);
          break;
        case "img":
          c = a.subParser("makeMarkdown.image")(r, s);
          break;
        default:
          c = r.outerHTML + `

`;
      }
      return c;
    }), a.subParser("makeMarkdown.paragraph", function(r, s) {
      var o = "";
      if (r.hasChildNodes())
        for (var c = r.childNodes, u = c.length, _ = 0; _ < u; ++_)
          o += a.subParser("makeMarkdown.node")(c[_], s);
      return o = o.trim(), o;
    }), a.subParser("makeMarkdown.pre", function(r, s) {
      var o = r.getAttribute("prenum");
      return "<pre>" + s.preList[o] + "</pre>";
    }), a.subParser("makeMarkdown.strikethrough", function(r, s) {
      var o = "";
      if (r.hasChildNodes()) {
        o += "~~";
        for (var c = r.childNodes, u = c.length, _ = 0; _ < u; ++_)
          o += a.subParser("makeMarkdown.node")(c[_], s);
        o += "~~";
      }
      return o;
    }), a.subParser("makeMarkdown.strong", function(r, s) {
      var o = "";
      if (r.hasChildNodes()) {
        o += "**";
        for (var c = r.childNodes, u = c.length, _ = 0; _ < u; ++_)
          o += a.subParser("makeMarkdown.node")(c[_], s);
        o += "**";
      }
      return o;
    }), a.subParser("makeMarkdown.table", function(r, s) {
      var o = "", c = [[], []], u = r.querySelectorAll("thead>tr>th"), _ = r.querySelectorAll("tbody>tr"), f, j;
      for (f = 0; f < u.length; ++f) {
        var F = a.subParser("makeMarkdown.tableCell")(u[f], s), U = "---";
        if (u[f].hasAttribute("style")) {
          var D = u[f].getAttribute("style").toLowerCase().replace(/\s/g, "");
          switch (D) {
            case "text-align:left;":
              U = ":---";
              break;
            case "text-align:right;":
              U = "---:";
              break;
            case "text-align:center;":
              U = ":---:";
              break;
          }
        }
        c[0][f] = F.trim(), c[1][f] = U;
      }
      for (f = 0; f < _.length; ++f) {
        var W = c.push([]) - 1, w = _[f].getElementsByTagName("td");
        for (j = 0; j < u.length; ++j) {
          var G = " ";
          typeof w[j] < "u" && (G = a.subParser("makeMarkdown.tableCell")(w[j], s)), c[W].push(G);
        }
      }
      var Q = 3;
      for (f = 0; f < c.length; ++f)
        for (j = 0; j < c[f].length; ++j) {
          var ee = c[f][j].length;
          ee > Q && (Q = ee);
        }
      for (f = 0; f < c.length; ++f) {
        for (j = 0; j < c[f].length; ++j)
          f === 1 ? c[f][j].slice(-1) === ":" ? c[f][j] = a.helper.padEnd(c[f][j].slice(-1), Q - 1, "-") + ":" : c[f][j] = a.helper.padEnd(c[f][j], Q, "-") : c[f][j] = a.helper.padEnd(c[f][j], Q);
        o += "| " + c[f].join(" | ") + ` |
`;
      }
      return o.trim();
    }), a.subParser("makeMarkdown.tableCell", function(r, s) {
      var o = "";
      if (!r.hasChildNodes())
        return "";
      for (var c = r.childNodes, u = c.length, _ = 0; _ < u; ++_)
        o += a.subParser("makeMarkdown.node")(c[_], s, !0);
      return o.trim();
    }), a.subParser("makeMarkdown.txt", function(r) {
      var s = r.nodeValue;
      return s = s.replace(/ +/g, " "), s = s.replace(/¨NBSP;/g, " "), s = a.helper.unescapeHTMLEntities(s), s = s.replace(/([*_~|`])/g, "\\$1"), s = s.replace(/^(\s*)>/g, "\\$1>"), s = s.replace(/^#/gm, "\\#"), s = s.replace(/^(\s*)([-=]{3,})(\s*)$/, "$1\\$2$3"), s = s.replace(/^( {0,3}\d+)\./gm, "$1\\."), s = s.replace(/^( {0,3})([+-])/gm, "$1\\$2"), s = s.replace(/]([\s]*)\(/g, "\\]$1\\("), s = s.replace(/^ {0,3}\[([\S \t]*?)]:/gm, "\\[$1]:"), s;
    });
    var L = this;
    e.exports ? e.exports = a : L.showdown = a;
  }).call(gn);
})(Kn);
var Hc = Kn.exports;
const pn = /* @__PURE__ */ _n(Hc);
class fn {
  constructor() {
    xe(this, "logger"), xe(this, "converter"), this.logger = Pa.zhiLog("showdown-adaptor"), this.converter = new pn.Converter();
  }
  isAvailable() {
    return typeof pn < "u";
  }
  renderMarkdownStr(t) {
    if (!this.isAvailable())
      throw new Error("Showdown is not available");
    return this.logger.info("Showdown is rendering md to HTML..."), Promise.resolve(this.converter.makeHtml(t));
  }
}
class Gn {
  constructor() {
    xe(this, "logger"), xe(this, "mdAdaptor", new fn()), this.logger = Pa.zhiLog("markdown-util");
  }
  /**
   * 获取当前 MD 解析器名称
   */
  getCurrentAdaptorName() {
    return this.mdAdaptor instanceof hn ? "Lute" : this.mdAdaptor instanceof fn ? "Showdown" : "None";
  }
  /**
   * 渲染Markdown
   *
   * @param md - Markdown文本
   */
  async renderHTML(t) {
    const n = new hn();
    return this.logger.debug("Lute status =>", n.isAvailable()), n.isAvailable() && (this.mdAdaptor = n), this.logger.info(`Using ${this.getCurrentAdaptorName()} as markdown renderer`), await this.mdAdaptor.renderMarkdownStr(t);
  }
}
class Kc {
  constructor() {
    xe(this, "mdUtil"), this.mdUtil = new Gn();
  }
  /**
   * 移除标题数字
   *
   * @param str - 字符串
   */
  removeTitleNumber(t) {
    let n = t;
    const a = /([0-9]*)\./;
    return n = n.replace(a, ""), n;
  }
  /**
   * 删除挂件的HTML
   *
   * @param str - 原字符
   */
  removeWidgetTag(t) {
    let n = t.toString();
    const a = /<iframe.*src="\/widgets\/publisher.*<\/iframe>/g;
    n = n.replace(a, "");
    const i = /<iframe.*src="\/widgets\/sy-post-publisher.*<\/iframe>/g;
    n = n.replace(i, "");
    const l = /<iframe.*\/widgets\/Note*\sAttrs.*\/iframe>/g;
    return n = n.replace(l, ""), n;
  }
  /**
   * 删除Markdown文本的挂件的HTML
   *
   * @param str - 原字符
   */
  removeMdWidgetTag(t) {
    let n = t.toString();
    return n = this.removeWidgetTag(n), n;
  }
  /**
   * 去除html标签，残缺不全也可以
   *
   * @param str - 字符串
   */
  filterHtml(t) {
    t = t.replace(/<style((.|\n|\r)*?)<\/style>/g, ""), t = t.replace(/<script((.|\n|\r)*?)<\/script>/g, ""), t = t.replace(/<[^>]*>/g, ""), t = t.replace(/&.*;/g, ""), t = t.replace(/(^\s*)|(\s*$)/g, ""), t = t.replace(/</g, "").replace(/>/g, ""), t = t.replace(/"/g, "").replace(/'/g, ""), t = t.replace(/\*/g, ""), t = t.replace(/\$/g, ""), t = t.replace(/\./g, ""), t = t.replace(/\+/g, ""), t = t.replace(/\s+/g, ""), t = t.replace(/[:|：]/g, "_"), t = t.replace(/[;|；]/g, "_"), t = t.replace(/\^/g, "_"), t = t.replace(/!/g, "_"), t = t.replace(/@/g, "at_");
    const n = ["\\d*/\\d/\\d*", "[、|\\\\]", "[，|,]", "\\d", "/", "-"];
    for (let a = 0; a < n.length; a++) {
      const i = new RegExp(n[a], "g");
      t = t.replace(i, "");
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
  parseHtml(t, n, a) {
    const i = this.filterHtml(t);
    return i.length < n ? i : a === !0 ? i.substring(0, n) : i.substring(0, n) + "...";
  }
  /**
   * 将Markdown转换为HTML
   *
   * @param md - Markdown
   */
  async mdToHtml(t) {
    const n = await this.mdUtil.renderHTML(t);
    return this.removeWidgetTag(n);
  }
  /**
   * 将Markdown转换为纯文本
   *
   * @param md - Markdown
   */
  async mdToPlainText(t) {
    const n = await this.mdToHtml(t);
    return this.filterHtml(n);
  }
  /**
   * 移除H1标签
   *
   * @param html - html
   */
  removeH1(t) {
    let n = t;
    const a = /<h1.*\/h1>/g;
    return n = n.replace(a, ""), n;
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
    let n = t;
    const a = /^# .*$/gm;
    return n = n.replace(a, ""), n;
  }
}
class Gc {
  /**
   * 检测是否是空对象
   *
   * @param obj - 对象
   */
  isEmptyObject(t) {
    return t ? Object.getPrototypeOf(t) === Object.prototype && Object.getOwnPropertyNames(t).length === 0 && Object.getOwnPropertySymbols(t).length === 0 : !0;
  }
}
class Wc {
  constructor() {
    xe(this, "dateUtil"), xe(this, "strUtil"), xe(this, "versionUtil"), xe(this, "htmlUtil"), xe(this, "markdownUtil"), xe(this, "jsonUtil"), xe(this, "objectUtil"), this.dateUtil = new vc(), this.strUtil = new yc(), this.versionUtil = new Ec(), this.htmlUtil = new Kc(), this.markdownUtil = new Gn(), this.jsonUtil = new wc(), this.objectUtil = new Gc();
  }
}
const Jc = Wc;
var Zc = Object.defineProperty, Yc = (e, t, n) => t in e ? Zc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Tt = (e, t, n) => (Yc(e, typeof t != "symbol" ? t + "" : t, n), n);
class ct {
}
Tt(ct, "NODE_ENV_KEY", "NODE_ENV"), /**
* 开发环境
*/
Tt(ct, "NODE_ENV_DEVELOPMENT", "development"), /**
* 生产环境
*/
Tt(ct, "NODE_ENV_PRODUCTION", "production"), /**
* 测试环境
*/
Tt(ct, "NODE_ENV_TEST", "test"), /**
* 是否处于调试模式
*/
Tt(ct, "VITE_DEBUG_MODE_KEY", "VITE_DEBUG_MODE");
class Qc {
  /**
   * 环境初始化
   *
   * @param envMeta - 需要传入 {"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":false} 。特别提醒：此参数是静态元数据，取决于最终使用的项目。因此仅仅在最终使用的地方显示传递此值，中间项目请保持参数传递
   * @see {@link https://vitejs.dev/guide/env-and-mode.html#production-replacement}
   */
  constructor(t) {
    Tt(this, "envMeta"), this.envMeta = t;
  }
  /**
   * 是否是开发阶段调试
   */
  isNodeDev() {
    return this.getEnv(ct.NODE_ENV_KEY) === ct.NODE_ENV_DEVELOPMENT;
  }
  /**
   * 是否是调试阶段
   */
  isDev() {
    return this.isNodeDev() || this.getBooleanEnv(ct.VITE_DEBUG_MODE_KEY);
  }
  /**
   * 获取环境变量，key不存在返回undefined
   * @param key - key
   */
  getEnv(t) {
    let n;
    try {
      this.envMeta[t] && (n = this.envMeta[t]);
    } catch {
    }
    return n;
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
    let n = !1;
    return this.getEnv(t) && (n = this.getStringEnv(t).toLowerCase() === "true"), n;
  }
  /**
   * 获取环境变量，如果未定义或者为空值，用指定的默认值代替
   *
   * @param key - key
   * @param defaultValue - 默认值
   * @since 0.1.0
   * @author terwer
   */
  getEnvOrDefault(t, n) {
    const a = this.getStringEnv(t);
    return a.trim().length == 0 ? n : a;
  }
}
class Xc extends Kt {
  static zhiEnv() {
    return this.env || (this.env = new Qc({ BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 })), this.env;
  }
}
class sl {
  /**
   * 初始化博客 API
   *
   * @param apiAdaptor - 对应博客的适配器，例如：SiYuanApiAdaptor
   */
  constructor(t) {
    X(this, "logger");
    X(this, "apiAdaptor");
    /**
     * 博客API版本号
     */
    X(this, "VERSION");
    this.logger = Xc.zhiLog("zhi-blog-api"), this.VERSION = "1.0.0", this.apiAdaptor = t;
  }
  /**
   * 博客配置列表
   */
  async getUsersBlogs() {
    return await this.apiAdaptor.getUsersBlogs();
  }
  /**
   * 最新文章数目
   *
   * @param keyword - 关键字（可选，部分平台不支持搜索）
   */
  async getRecentPostsCount(t) {
    return await this.apiAdaptor.getRecentPostsCount(t);
  }
  /**
   * 最新文章
   *
   * @param numOfPosts - 文章数目
   * @param page - 页码（可选，从0开始，部分平台不支持分页）
   * @param keyword - 关键字（可选，部分平台不支持搜索）
   */
  async getRecentPosts(t, n, a) {
    try {
      return await this.apiAdaptor.getRecentPosts(t, n, a);
    } catch (i) {
      return this.logger.error("getRecentPosts fetch posts failed", i), Promise.resolve([]);
    }
  }
  /**
   * 发布文章
   *
   * @param post - 文章
   * @param publish - 可选，是否发布
   */
  async newPost(t, n) {
    return await this.apiAdaptor.newPost(t, n);
  }
  /**
   * 文章详情
   * @param postid - postid
   * @param useSlug - 是否使用的是别名（可选，部分平台不支持）
   */
  async getPost(t, n) {
    try {
      return await this.apiAdaptor.getPost(t, n);
    } catch (a) {
      return this.logger.error(`getPost fetch posts failed => ${t},`, a), Promise.resolve(new lo());
    }
  }
  /**
   * 更新文章
   *
   * @param postid - 文章id
   * @param post - 文章
   * @param publish - 可选，是否发布
   */
  async editPost(t, n, a) {
    return await this.apiAdaptor.editPost(t, n, a);
  }
  /**
   * 删除文章
   *
   * @param postid - 文章ID
   */
  async deletePost(t) {
    return await this.apiAdaptor.deletePost(t);
  }
  /**
   * 获取分类列表
   */
  async getCategories() {
    return await this.apiAdaptor.getCategories();
  }
  /**
   * 获取预览链接
   *
   * @param postid - 文章ID
   */
  async getPreviewUrl(t) {
    return await this.apiAdaptor.getPreviewUrl(t);
  }
  /**
   * 上传附件
   *
   * @param mediaObject
   */
  async newMediaObject(t) {
    return await this.apiAdaptor.newMediaObject(t);
  }
}
class el {
  constructor() {
    /**
     * 博客ID
     */
    X(this, "blogid");
    /**
     * 博客地址
     */
    X(this, "url");
    /**
     * 博客名称
     */
    X(this, "blogName");
    /**
     * 是否是管理员
     */
    X(this, "isAdmin");
    /**
     * xmlrpc地址
     */
    X(this, "xmlrpc");
    this.blogid = "", this.url = "", this.blogName = "";
  }
}
class il {
  constructor() {
    /**
     * 博客信息
     */
    X(this, "userBlog");
    /**
     * 域名
     */
    X(this, "domain");
    /**
     * 站点链接
     */
    X(this, "weburl");
    /**
     * 站点主题
     */
    X(this, "webtheme");
    /**
     * 站点名称
     */
    X(this, "webname");
    /**
     * 站点口号
     */
    X(this, "webslogen");
    /**
     * 关键字
     */
    X(this, "keywords");
    /**
     * 描述
     */
    X(this, "description");
    /**
     * 备案信息
     */
    X(this, "beianinfo");
    this.userBlog = new el(), this.domain = "", this.weburl = "", this.webtheme = "default", this.webname = "浅海拾贝", this.webslogen = "寻找未知的技术拼图", this.keywords = "软件架构、服务端开发、Java、Spring、Dubbo、Zookeeper、微服务", this.description = "浅海拾贝致力于Java后端开发及服务端技术、软件架构、微服务技术分享的个人博客", this.beianinfo = "粤ICP备18023717号-1";
  }
}
class cl {
  constructor() {
    /**
     * 分类ID
     */
    X(this, "categoryId");
    /**
     * 父分类ID
     */
    X(this, "parentId");
    /**
     * 分类名称
     */
    X(this, "description");
    /**
     * 分类英文名
     */
    X(this, "categoryName");
    /**
     * 分类详情
     */
    X(this, "categoryDescription");
    /**
     * 分类地址
     */
    X(this, "htmlUrl");
    /**
     * 分类订阅地址
     */
    X(this, "rssUrl");
    this.categoryId = "-1", this.parentId = "0", this.description = "分类1", this.categoryDescription = "这是测试分类1", this.categoryName = "cate1", this.htmlUrl = "", this.rssUrl = "";
  }
}
class ll {
  constructor(t, n, a) {
    X(this, "name");
    X(this, "type");
    X(this, "bits");
    this.name = t, this.type = n, this.bits = a;
  }
}
class tl {
}
/**
 * 博客类型
 */
X(tl, "DEFAULT_BLOG_TYPE_KEY", "VITE_DEFAULT_TYPE");
var rl = /* @__PURE__ */ ((e) => (e.BlogTypeEnum_Siyuan = "siyuan", e.BlogTypeEnum_Metaweblog = "metaweblog", e.BlogTypeEnum_Wordpress = "wordpress", e))(rl || {});
export {
  sl as BlogApi,
  nl as BlogConfig,
  tl as BlogConstants,
  ol as BlogPlaceholder,
  rl as BlogTypeEnum,
  cl as CategoryInfo,
  ll as MediaObject,
  io as PageType,
  co as PasswordType,
  lo as Post,
  mn as PostStatusEnum,
  il as SiteConfig,
  el as UserBlog
};
