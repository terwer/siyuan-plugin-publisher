var Nu = Object.defineProperty;
var Lu = (e, t, a) => t in e ? Nu(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var Ke = (e, t, a) => (Lu(e, typeof t != "symbol" ? t + "" : t, a), a);
var Ru = Object.defineProperty, Iu = (e, t, a) => t in e ? Ru(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, ye = (e, t, a) => (Iu(e, typeof t != "symbol" ? t + "" : t, a), a), Lc = /* @__PURE__ */ ((e) => (e[e.PasswordType_Password = 0] = "PasswordType_Password", e[e.PasswordType_Token = 1] = "PasswordType_Token", e))(Lc || {});
let Au = class {
  constructor() {
    ye(this, "home"), ye(this, "apiUrl"), ye(this, "username"), ye(this, "passwordType"), ye(this, "password"), ye(this, "apiStatus"), ye(this, "blogName"), ye(this, "posidKey"), ye(this, "previewUrl"), ye(this, "pageType"), ye(this, "placeholder"), ye(this, "fixTitle"), this.home = "", this.apiUrl = "", this.username = "", this.passwordType = 0, this.password = "", this.apiStatus = !1, this.blogName = "", this.posidKey = "", this.previewUrl = "", this.pageType = 0, this.placeholder = void 0, this.fixTitle = !1;
  }
}, Mu = class {
  constructor() {
    ye(this, "homePlaceholder"), ye(this, "apiUrlPlaceholder"), ye(this, "usernamePlaceholder"), ye(this, "passwordTypePlaceholder"), ye(this, "passwordPlaceholder"), ye(this, "apiStatusPlaceholder"), ye(this, "blogNamePlaceholder"), ye(this, "posidKeyPlaceholder"), ye(this, "previewUrlPlaceholder"), ye(this, "pageTypePlaceholder"), this.homePlaceholder = "", this.apiUrlPlaceholder = "", this.usernamePlaceholder = "", this.passwordTypePlaceholder = "", this.passwordPlaceholder = "", this.apiStatusPlaceholder = !1, this.blogNamePlaceholder = "", this.posidKeyPlaceholder = "", this.previewUrlPlaceholder = "", this.pageTypePlaceholder = "";
  }
};
var Sn = /* @__PURE__ */ ((e) => (e.PostStatusEnum_Publish = "publish", e.PostStatusEnum_Draft = "draft", e.PostStatusEnum_Inherit = "inherit", e))(Sn || {});
let gi = class {
  constructor() {
    ye(this, "postid"), ye(this, "title"), ye(this, "mt_keywords"), ye(this, "link"), ye(this, "permalink"), ye(this, "shortDesc"), ye(this, "description"), ye(this, "mt_excerpt"), ye(this, "wp_slug"), ye(this, "dateCreated"), ye(this, "categories"), ye(this, "mt_text_more"), ye(this, "post_status"), ye(this, "isPublished"), ye(this, "wp_password"), this.postid = "", this.title = "", this.mt_keywords = "", this.permalink = "", this.description = "", this.wp_slug = "", this.dateCreated = /* @__PURE__ */ new Date(), this.categories = [], this.isPublished = !0, this.post_status = Sn.PostStatusEnum_Publish, this.wp_password = "";
  }
};
var Du = Object.defineProperty, zu = (e, t, a) => t in e ? Du(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, Ye = (e, t, a) => (zu(e, typeof t != "symbol" ? t + "" : t, a), a), Rc = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ic(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var vo = { exports: {} }, Ac = {}, er = {}, sa = {}, Ka = {}, we = {}, qa = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class a extends t {
    constructor(j) {
      if (super(), !e.IDENTIFIER.test(j))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = j;
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
  e.Name = a;
  class n extends t {
    constructor(j) {
      super(), this._items = typeof j == "string" ? [j] : j;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const j = this._items[0];
      return j === "" || j === '""';
    }
    get str() {
      var j;
      return (j = this._str) !== null && j !== void 0 ? j : this._str = this._items.reduce((I, r) => `${I}${r}`, "");
    }
    get names() {
      var j;
      return (j = this._names) !== null && j !== void 0 ? j : this._names = this._items.reduce((I, r) => (r instanceof a && (I[r.str] = (I[r.str] || 0) + 1), I), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(v, ...j) {
    const I = [v[0]];
    let r = 0;
    for (; r < j.length; )
      b(I, j[r]), I.push(v[++r]);
    return new n(I);
  }
  e._ = s;
  const c = new n("+");
  function p(v, ...j) {
    const I = [A(v[0])];
    let r = 0;
    for (; r < j.length; )
      I.push(c), b(I, j[r]), I.push(c, A(v[++r]));
    return _(I), new n(I);
  }
  e.str = p;
  function b(v, j) {
    j instanceof n ? v.push(...j._items) : j instanceof a ? v.push(j) : v.push(S(j));
  }
  e.addCodeArg = b;
  function _(v) {
    let j = 1;
    for (; j < v.length - 1; ) {
      if (v[j] === c) {
        const I = y(v[j - 1], v[j + 1]);
        if (I !== void 0) {
          v.splice(j - 1, 3, I);
          continue;
        }
        v[j++] = "+";
      }
      j++;
    }
  }
  function y(v, j) {
    if (j === '""')
      return v;
    if (v === '""')
      return j;
    if (typeof v == "string")
      return j instanceof a || v[v.length - 1] !== '"' ? void 0 : typeof j != "string" ? `${v.slice(0, -1)}${j}"` : j[0] === '"' ? v.slice(0, -1) + j.slice(1) : void 0;
    if (typeof j == "string" && j[0] === '"' && !(v instanceof a))
      return `"${v}${j.slice(1)}`;
  }
  function g(v, j) {
    return j.emptyStr() ? v : v.emptyStr() ? j : p`${v}${j}`;
  }
  e.strConcat = g;
  function S(v) {
    return typeof v == "number" || typeof v == "boolean" || v === null ? v : A(Array.isArray(v) ? v.join(",") : v);
  }
  function L(v) {
    return new n(A(v));
  }
  e.stringify = L;
  function A(v) {
    return JSON.stringify(v).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = A;
  function N(v) {
    return typeof v == "string" && e.IDENTIFIER.test(v) ? new n(`.${v}`) : s`[${v}]`;
  }
  e.getProperty = N;
  function C(v) {
    if (typeof v == "string" && e.IDENTIFIER.test(v))
      return new n(`${v}`);
    throw new Error(`CodeGen: invalid export name: ${v}, use explicit $id name mapping`);
  }
  e.getEsmExportName = C;
  function T(v) {
    return new n(v.toString());
  }
  e.regexpCode = T;
})(qa);
var $o = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = qa;
  class a extends Error {
    constructor(y) {
      super(`CodeGen: "code" for ${y} not defined`), this.value = y.value;
    }
  }
  var n;
  (function(_) {
    _[_.Started = 0] = "Started", _[_.Completed = 1] = "Completed";
  })(n = e.UsedValueState || (e.UsedValueState = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: y, parent: g } = {}) {
      this._names = {}, this._prefixes = y, this._parent = g;
    }
    toName(y) {
      return y instanceof t.Name ? y : this.name(y);
    }
    name(y) {
      return new t.Name(this._newName(y));
    }
    _newName(y) {
      const g = this._names[y] || this._nameGroup(y);
      return `${y}${g.index++}`;
    }
    _nameGroup(y) {
      var g, S;
      if (!((S = (g = this._parent) === null || g === void 0 ? void 0 : g._prefixes) === null || S === void 0) && S.has(y) || this._prefixes && !this._prefixes.has(y))
        throw new Error(`CodeGen: prefix "${y}" is not allowed in this scope`);
      return this._names[y] = { prefix: y, index: 0 };
    }
  }
  e.Scope = s;
  class c extends t.Name {
    constructor(y, g) {
      super(g), this.prefix = y;
    }
    setValue(y, { property: g, itemIndex: S }) {
      this.value = y, this.scopePath = (0, t._)`.${new t.Name(g)}[${S}]`;
    }
  }
  e.ValueScopeName = c;
  const p = (0, t._)`\n`;
  class b extends s {
    constructor(y) {
      super(y), this._values = {}, this._scope = y.scope, this.opts = { ...y, _n: y.lines ? p : t.nil };
    }
    get() {
      return this._scope;
    }
    name(y) {
      return new c(y, this._newName(y));
    }
    value(y, g) {
      var S;
      if (g.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const L = this.toName(y), { prefix: A } = L, N = (S = g.key) !== null && S !== void 0 ? S : g.ref;
      let C = this._values[A];
      if (C) {
        const j = C.get(N);
        if (j)
          return j;
      } else
        C = this._values[A] = /* @__PURE__ */ new Map();
      C.set(N, L);
      const T = this._scope[A] || (this._scope[A] = []), v = T.length;
      return T[v] = g.ref, L.setValue(g, { property: A, itemIndex: v }), L;
    }
    getValue(y, g) {
      const S = this._values[y];
      if (S)
        return S.get(g);
    }
    scopeRefs(y, g = this._values) {
      return this._reduceValues(g, (S) => {
        if (S.scopePath === void 0)
          throw new Error(`CodeGen: name "${S}" has no value`);
        return (0, t._)`${y}${S.scopePath}`;
      });
    }
    scopeCode(y = this._values, g, S) {
      return this._reduceValues(y, (L) => {
        if (L.value === void 0)
          throw new Error(`CodeGen: name "${L}" has no value`);
        return L.value.code;
      }, g, S);
    }
    _reduceValues(y, g, S = {}, L) {
      let A = t.nil;
      for (const N in y) {
        const C = y[N];
        if (!C)
          continue;
        const T = S[N] = S[N] || /* @__PURE__ */ new Map();
        C.forEach((v) => {
          if (T.has(v))
            return;
          T.set(v, n.Started);
          let j = g(v);
          if (j) {
            const I = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            A = (0, t._)`${A}${I} ${v} = ${j};${this.opts._n}`;
          } else if (j = L == null ? void 0 : L(v))
            A = (0, t._)`${A}${j}${this.opts._n}`;
          else
            throw new a(v);
          T.set(v, n.Completed);
        });
      }
      return A;
    }
  }
  e.ValueScope = b;
})($o);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = qa, a = $o;
  var n = qa;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = $o;
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
  class c {
    optimizeNodes() {
      return this;
    }
    optimizeNames(d, k) {
      return this;
    }
  }
  class p extends c {
    constructor(d, k, R) {
      super(), this.varKind = d, this.name = k, this.rhs = R;
    }
    render({ es5: d, _n: k }) {
      const R = d ? a.varKinds.var : this.varKind, G = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${R} ${this.name}${G};` + k;
    }
    optimizeNames(d, k) {
      if (d[this.name.str])
        return this.rhs && (this.rhs = z(this.rhs, d, k)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class b extends c {
    constructor(d, k, R) {
      super(), this.lhs = d, this.rhs = k, this.sideEffects = R;
    }
    render({ _n: d }) {
      return `${this.lhs} = ${this.rhs};` + d;
    }
    optimizeNames(d, k) {
      if (!(this.lhs instanceof t.Name && !d[this.lhs.str] && !this.sideEffects))
        return this.rhs = z(this.rhs, d, k), this;
    }
    get names() {
      const d = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return U(d, this.rhs);
    }
  }
  class _ extends b {
    constructor(d, k, R, G) {
      super(d, R, G), this.op = k;
    }
    render({ _n: d }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + d;
    }
  }
  class y extends c {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `${this.label}:` + d;
    }
  }
  class g extends c {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `break${this.label ? ` ${this.label}` : ""};` + d;
    }
  }
  class S extends c {
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
  class L extends c {
    constructor(d) {
      super(), this.code = d;
    }
    render({ _n: d }) {
      return `${this.code};` + d;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(d, k) {
      return this.code = z(this.code, d, k), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class A extends c {
    constructor(d = []) {
      super(), this.nodes = d;
    }
    render(d) {
      return this.nodes.reduce((k, R) => k + R.render(d), "");
    }
    optimizeNodes() {
      const { nodes: d } = this;
      let k = d.length;
      for (; k--; ) {
        const R = d[k].optimizeNodes();
        Array.isArray(R) ? d.splice(k, 1, ...R) : R ? d[k] = R : d.splice(k, 1);
      }
      return d.length > 0 ? this : void 0;
    }
    optimizeNames(d, k) {
      const { nodes: R } = this;
      let G = R.length;
      for (; G--; ) {
        const K = R[G];
        K.optimizeNames(d, k) || (H(d, K.names), R.splice(G, 1));
      }
      return R.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((d, k) => B(d, k.names), {});
    }
  }
  class N extends A {
    render(d) {
      return "{" + d._n + super.render(d) + "}" + d._n;
    }
  }
  class C extends A {
  }
  class T extends N {
  }
  T.kind = "else";
  class v extends N {
    constructor(d, k) {
      super(k), this.condition = d;
    }
    render(d) {
      let k = `if(${this.condition})` + super.render(d);
      return this.else && (k += "else " + this.else.render(d)), k;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const d = this.condition;
      if (d === !0)
        return this.nodes;
      let k = this.else;
      if (k) {
        const R = k.optimizeNodes();
        k = this.else = Array.isArray(R) ? new T(R) : R;
      }
      if (k)
        return d === !1 ? k instanceof v ? k : k.nodes : this.nodes.length ? this : new v(w(d), k instanceof v ? [k] : k.nodes);
      if (!(d === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(d, k) {
      var R;
      if (this.else = (R = this.else) === null || R === void 0 ? void 0 : R.optimizeNames(d, k), !!(super.optimizeNames(d, k) || this.else))
        return this.condition = z(this.condition, d, k), this;
    }
    get names() {
      const d = super.names;
      return U(d, this.condition), this.else && B(d, this.else.names), d;
    }
  }
  v.kind = "if";
  class j extends N {
  }
  j.kind = "for";
  class I extends j {
    constructor(d) {
      super(), this.iteration = d;
    }
    render(d) {
      return `for(${this.iteration})` + super.render(d);
    }
    optimizeNames(d, k) {
      if (super.optimizeNames(d, k))
        return this.iteration = z(this.iteration, d, k), this;
    }
    get names() {
      return B(super.names, this.iteration.names);
    }
  }
  class r extends j {
    constructor(d, k, R, G) {
      super(), this.varKind = d, this.name = k, this.from = R, this.to = G;
    }
    render(d) {
      const k = d.es5 ? a.varKinds.var : this.varKind, { name: R, from: G, to: K } = this;
      return `for(${k} ${R}=${G}; ${R}<${K}; ${R}++)` + super.render(d);
    }
    get names() {
      const d = U(super.names, this.from);
      return U(d, this.to);
    }
  }
  class i extends j {
    constructor(d, k, R, G) {
      super(), this.loop = d, this.varKind = k, this.name = R, this.iterable = G;
    }
    render(d) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(d);
    }
    optimizeNames(d, k) {
      if (super.optimizeNames(d, k))
        return this.iterable = z(this.iterable, d, k), this;
    }
    get names() {
      return B(super.names, this.iterable.names);
    }
  }
  class o extends N {
    constructor(d, k, R) {
      super(), this.name = d, this.args = k, this.async = R;
    }
    render(d) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(d);
    }
  }
  o.kind = "func";
  class l extends A {
    render(d) {
      return "return " + super.render(d);
    }
  }
  l.kind = "return";
  class u extends N {
    render(d) {
      let k = "try" + super.render(d);
      return this.catch && (k += this.catch.render(d)), this.finally && (k += this.finally.render(d)), k;
    }
    optimizeNodes() {
      var d, k;
      return super.optimizeNodes(), (d = this.catch) === null || d === void 0 || d.optimizeNodes(), (k = this.finally) === null || k === void 0 || k.optimizeNodes(), this;
    }
    optimizeNames(d, k) {
      var R, G;
      return super.optimizeNames(d, k), (R = this.catch) === null || R === void 0 || R.optimizeNames(d, k), (G = this.finally) === null || G === void 0 || G.optimizeNames(d, k), this;
    }
    get names() {
      const d = super.names;
      return this.catch && B(d, this.catch.names), this.finally && B(d, this.finally.names), d;
    }
  }
  class m extends N {
    constructor(d) {
      super(), this.error = d;
    }
    render(d) {
      return `catch(${this.error})` + super.render(d);
    }
  }
  m.kind = "catch";
  class f extends N {
    render(d) {
      return "finally" + super.render(d);
    }
  }
  f.kind = "finally";
  class x {
    constructor(d, k = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...k, _n: k.lines ? `
` : "" }, this._extScope = d, this._scope = new a.Scope({ parent: d }), this._nodes = [new C()];
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
    scopeValue(d, k) {
      const R = this._extScope.value(d, k);
      return (this._values[R.prefix] || (this._values[R.prefix] = /* @__PURE__ */ new Set())).add(R), R;
    }
    getScopeValue(d, k) {
      return this._extScope.getValue(d, k);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(d) {
      return this._extScope.scopeRefs(d, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(d, k, R, G) {
      const K = this._scope.toName(k);
      return R !== void 0 && G && (this._constants[K.str] = R), this._leafNode(new p(d, K, R)), K;
    }
    // `const` declaration (`var` in es5 mode)
    const(d, k, R) {
      return this._def(a.varKinds.const, d, k, R);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(d, k, R) {
      return this._def(a.varKinds.let, d, k, R);
    }
    // `var` declaration with optional assignment
    var(d, k, R) {
      return this._def(a.varKinds.var, d, k, R);
    }
    // assignment code
    assign(d, k, R) {
      return this._leafNode(new b(d, k, R));
    }
    // `+=` code
    add(d, k) {
      return this._leafNode(new _(d, e.operators.ADD, k));
    }
    // appends passed SafeExpr to code or executes Block
    code(d) {
      return typeof d == "function" ? d() : d !== t.nil && this._leafNode(new L(d)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...d) {
      const k = ["{"];
      for (const [R, G] of d)
        k.length > 1 && k.push(","), k.push(R), (R !== G || this.opts.es5) && (k.push(":"), (0, t.addCodeArg)(k, G));
      return k.push("}"), new t._Code(k);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(d, k, R) {
      if (this._blockNode(new v(d)), k && R)
        this.code(k).else().code(R).endIf();
      else if (k)
        this.code(k).endIf();
      else if (R)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(d) {
      return this._elseNode(new v(d));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new T());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(v, T);
    }
    _for(d, k) {
      return this._blockNode(d), k && this.code(k).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(d, k) {
      return this._for(new I(d), k);
    }
    // `for` statement for a range of values
    forRange(d, k, R, G, K = this.opts.es5 ? a.varKinds.var : a.varKinds.let) {
      const X = this._scope.toName(d);
      return this._for(new r(K, X, k, R), () => G(X));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(d, k, R, G = a.varKinds.const) {
      const K = this._scope.toName(d);
      if (this.opts.es5) {
        const X = k instanceof t.Name ? k : this.var("_arr", k);
        return this.forRange("_i", 0, (0, t._)`${X}.length`, (ee) => {
          this.var(K, (0, t._)`${X}[${ee}]`), R(K);
        });
      }
      return this._for(new i("of", G, K, k), () => R(K));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(d, k, R, G = this.opts.es5 ? a.varKinds.var : a.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(d, (0, t._)`Object.keys(${k})`, R);
      const K = this._scope.toName(d);
      return this._for(new i("in", G, K, k), () => R(K));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(j);
    }
    // `label` statement
    label(d) {
      return this._leafNode(new y(d));
    }
    // `break` statement
    break(d) {
      return this._leafNode(new g(d));
    }
    // `return` statement
    return(d) {
      const k = new l();
      if (this._blockNode(k), this.code(d), k.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(l);
    }
    // `try` statement
    try(d, k, R) {
      if (!k && !R)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const G = new u();
      if (this._blockNode(G), this.code(d), k) {
        const K = this.name("e");
        this._currNode = G.catch = new m(K), k(K);
      }
      return R && (this._currNode = G.finally = new f(), this.code(R)), this._endBlockNode(m, f);
    }
    // `throw` statement
    throw(d) {
      return this._leafNode(new S(d));
    }
    // start self-balancing block
    block(d, k) {
      return this._blockStarts.push(this._nodes.length), d && this.code(d).endBlock(k), this;
    }
    // end the current self-balancing block
    endBlock(d) {
      const k = this._blockStarts.pop();
      if (k === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const R = this._nodes.length - k;
      if (R < 0 || d !== void 0 && R !== d)
        throw new Error(`CodeGen: wrong number of nodes: ${R} vs ${d} expected`);
      return this._nodes.length = k, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(d, k = t.nil, R, G) {
      return this._blockNode(new o(d, k, R)), G && this.code(G).endFunc(), this;
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
    _endBlockNode(d, k) {
      const R = this._currNode;
      if (R instanceof d || k && R instanceof k)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${k ? `${d.kind}/${k.kind}` : d.kind}"`);
    }
    _elseNode(d) {
      const k = this._currNode;
      if (!(k instanceof v))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = k.else = d, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const d = this._nodes;
      return d[d.length - 1];
    }
    set _currNode(d) {
      const k = this._nodes;
      k[k.length - 1] = d;
    }
  }
  e.CodeGen = x;
  function B(O, d) {
    for (const k in d)
      O[k] = (O[k] || 0) + (d[k] || 0);
    return O;
  }
  function U(O, d) {
    return d instanceof t._CodeOrName ? B(O, d.names) : O;
  }
  function z(O, d, k) {
    if (O instanceof t.Name)
      return R(O);
    if (!G(O))
      return O;
    return new t._Code(O._items.reduce((K, X) => (X instanceof t.Name && (X = R(X)), X instanceof t._Code ? K.push(...X._items) : K.push(X), K), []));
    function R(K) {
      const X = k[K.str];
      return X === void 0 || d[K.str] !== 1 ? K : (delete d[K.str], X);
    }
    function G(K) {
      return K instanceof t._Code && K._items.some((X) => X instanceof t.Name && d[X.str] === 1 && k[X.str] !== void 0);
    }
  }
  function H(O, d) {
    for (const k in d)
      O[k] = (O[k] || 0) - (d[k] || 0);
  }
  function w(O) {
    return typeof O == "boolean" || typeof O == "number" || O === null ? !O : (0, t._)`!${F(O)}`;
  }
  e.not = w;
  const q = E(e.operators.AND);
  function W(...O) {
    return O.reduce(q);
  }
  e.and = W;
  const J = E(e.operators.OR);
  function V(...O) {
    return O.reduce(J);
  }
  e.or = V;
  function E(O) {
    return (d, k) => d === t.nil ? k : k === t.nil ? d : (0, t._)`${F(d)} ${O} ${F(k)}`;
  }
  function F(O) {
    return O instanceof t.Name ? O : (0, t._)`(${O})`;
  }
})(we);
var $e = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.checkStrictMode = e.getErrorPath = e.Type = e.useFunc = e.setEvaluated = e.evaluatedPropsToName = e.mergeEvaluated = e.eachItem = e.unescapeJsonPointer = e.escapeJsonPointer = e.escapeFragment = e.unescapeFragment = e.schemaRefOrVal = e.schemaHasRulesButRef = e.schemaHasRules = e.checkUnknownRules = e.alwaysValidSchema = e.toHash = void 0;
  const t = we, a = qa;
  function n(o) {
    const l = {};
    for (const u of o)
      l[u] = !0;
    return l;
  }
  e.toHash = n;
  function s(o, l) {
    return typeof l == "boolean" ? l : Object.keys(l).length === 0 ? !0 : (c(o, l), !p(l, o.self.RULES.all));
  }
  e.alwaysValidSchema = s;
  function c(o, l = o.schema) {
    const { opts: u, self: m } = o;
    if (!u.strictSchema || typeof l == "boolean")
      return;
    const f = m.RULES.keywords;
    for (const x in l)
      f[x] || i(o, `unknown keyword: "${x}"`);
  }
  e.checkUnknownRules = c;
  function p(o, l) {
    if (typeof o == "boolean")
      return !o;
    for (const u in o)
      if (l[u])
        return !0;
    return !1;
  }
  e.schemaHasRules = p;
  function b(o, l) {
    if (typeof o == "boolean")
      return !o;
    for (const u in o)
      if (u !== "$ref" && l.all[u])
        return !0;
    return !1;
  }
  e.schemaHasRulesButRef = b;
  function _({ topSchemaRef: o, schemaPath: l }, u, m, f) {
    if (!f) {
      if (typeof u == "number" || typeof u == "boolean")
        return u;
      if (typeof u == "string")
        return (0, t._)`${u}`;
    }
    return (0, t._)`${o}${l}${(0, t.getProperty)(m)}`;
  }
  e.schemaRefOrVal = _;
  function y(o) {
    return L(decodeURIComponent(o));
  }
  e.unescapeFragment = y;
  function g(o) {
    return encodeURIComponent(S(o));
  }
  e.escapeFragment = g;
  function S(o) {
    return typeof o == "number" ? `${o}` : o.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  e.escapeJsonPointer = S;
  function L(o) {
    return o.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  e.unescapeJsonPointer = L;
  function A(o, l) {
    if (Array.isArray(o))
      for (const u of o)
        l(u);
    else
      l(o);
  }
  e.eachItem = A;
  function N({ mergeNames: o, mergeToName: l, mergeValues: u, resultToName: m }) {
    return (f, x, B, U) => {
      const z = B === void 0 ? x : B instanceof t.Name ? (x instanceof t.Name ? o(f, x, B) : l(f, x, B), B) : x instanceof t.Name ? (l(f, B, x), x) : u(x, B);
      return U === t.Name && !(z instanceof t.Name) ? m(f, z) : z;
    };
  }
  e.mergeEvaluated = {
    props: N({
      mergeNames: (o, l, u) => o.if((0, t._)`${u} !== true && ${l} !== undefined`, () => {
        o.if((0, t._)`${l} === true`, () => o.assign(u, !0), () => o.assign(u, (0, t._)`${u} || {}`).code((0, t._)`Object.assign(${u}, ${l})`));
      }),
      mergeToName: (o, l, u) => o.if((0, t._)`${u} !== true`, () => {
        l === !0 ? o.assign(u, !0) : (o.assign(u, (0, t._)`${u} || {}`), T(o, u, l));
      }),
      mergeValues: (o, l) => o === !0 ? !0 : { ...o, ...l },
      resultToName: C
    }),
    items: N({
      mergeNames: (o, l, u) => o.if((0, t._)`${u} !== true && ${l} !== undefined`, () => o.assign(u, (0, t._)`${l} === true ? true : ${u} > ${l} ? ${u} : ${l}`)),
      mergeToName: (o, l, u) => o.if((0, t._)`${u} !== true`, () => o.assign(u, l === !0 ? !0 : (0, t._)`${u} > ${l} ? ${u} : ${l}`)),
      mergeValues: (o, l) => o === !0 ? !0 : Math.max(o, l),
      resultToName: (o, l) => o.var("items", l)
    })
  };
  function C(o, l) {
    if (l === !0)
      return o.var("props", !0);
    const u = o.var("props", (0, t._)`{}`);
    return l !== void 0 && T(o, u, l), u;
  }
  e.evaluatedPropsToName = C;
  function T(o, l, u) {
    Object.keys(u).forEach((m) => o.assign((0, t._)`${l}${(0, t.getProperty)(m)}`, !0));
  }
  e.setEvaluated = T;
  const v = {};
  function j(o, l) {
    return o.scopeValue("func", {
      ref: l,
      code: v[l.code] || (v[l.code] = new a._Code(l.code))
    });
  }
  e.useFunc = j;
  var I;
  (function(o) {
    o[o.Num = 0] = "Num", o[o.Str = 1] = "Str";
  })(I = e.Type || (e.Type = {}));
  function r(o, l, u) {
    if (o instanceof t.Name) {
      const m = l === I.Num;
      return u ? m ? (0, t._)`"[" + ${o} + "]"` : (0, t._)`"['" + ${o} + "']"` : m ? (0, t._)`"/" + ${o}` : (0, t._)`"/" + ${o}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return u ? (0, t.getProperty)(o).toString() : "/" + S(o);
  }
  e.getErrorPath = r;
  function i(o, l, u = o.opts.strictSchema) {
    if (u) {
      if (l = `strict mode: ${l}`, u === !0)
        throw new Error(l);
      o.self.logger.warn(l);
    }
  }
  e.checkStrictMode = i;
})($e);
var cr = {};
Object.defineProperty(cr, "__esModule", { value: !0 });
const at = we, Bu = {
  // validation function arguments
  data: new at.Name("data"),
  // args passed from referencing schema
  valCxt: new at.Name("valCxt"),
  instancePath: new at.Name("instancePath"),
  parentData: new at.Name("parentData"),
  parentDataProperty: new at.Name("parentDataProperty"),
  rootData: new at.Name("rootData"),
  dynamicAnchors: new at.Name("dynamicAnchors"),
  // function scoped variables
  vErrors: new at.Name("vErrors"),
  errors: new at.Name("errors"),
  this: new at.Name("this"),
  // "globals"
  self: new at.Name("self"),
  scope: new at.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new at.Name("json"),
  jsonPos: new at.Name("jsonPos"),
  jsonLen: new at.Name("jsonLen"),
  jsonPart: new at.Name("jsonPart")
};
cr.default = Bu;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = we, a = $e, n = cr;
  e.keywordError = {
    message: ({ keyword: T }) => (0, t.str)`must pass "${T}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: T, schemaType: v }) => v ? (0, t.str)`"${T}" keyword must be ${v} ($data)` : (0, t.str)`"${T}" keyword is invalid ($data)`
  };
  function s(T, v = e.keywordError, j, I) {
    const { it: r } = T, { gen: i, compositeRule: o, allErrors: l } = r, u = S(T, v, j);
    I ?? (o || l) ? _(i, u) : y(r, (0, t._)`[${u}]`);
  }
  e.reportError = s;
  function c(T, v = e.keywordError, j) {
    const { it: I } = T, { gen: r, compositeRule: i, allErrors: o } = I, l = S(T, v, j);
    _(r, l), i || o || y(I, n.default.vErrors);
  }
  e.reportExtraError = c;
  function p(T, v) {
    T.assign(n.default.errors, v), T.if((0, t._)`${n.default.vErrors} !== null`, () => T.if(v, () => T.assign((0, t._)`${n.default.vErrors}.length`, v), () => T.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = p;
  function b({ gen: T, keyword: v, schemaValue: j, data: I, errsCount: r, it: i }) {
    if (r === void 0)
      throw new Error("ajv implementation error");
    const o = T.name("err");
    T.forRange("i", r, n.default.errors, (l) => {
      T.const(o, (0, t._)`${n.default.vErrors}[${l}]`), T.if((0, t._)`${o}.instancePath === undefined`, () => T.assign((0, t._)`${o}.instancePath`, (0, t.strConcat)(n.default.instancePath, i.errorPath))), T.assign((0, t._)`${o}.schemaPath`, (0, t.str)`${i.errSchemaPath}/${v}`), i.opts.verbose && (T.assign((0, t._)`${o}.schema`, j), T.assign((0, t._)`${o}.data`, I));
    });
  }
  e.extendErrors = b;
  function _(T, v) {
    const j = T.const("err", v);
    T.if((0, t._)`${n.default.vErrors} === null`, () => T.assign(n.default.vErrors, (0, t._)`[${j}]`), (0, t._)`${n.default.vErrors}.push(${j})`), T.code((0, t._)`${n.default.errors}++`);
  }
  function y(T, v) {
    const { gen: j, validateName: I, schemaEnv: r } = T;
    r.$async ? j.throw((0, t._)`new ${T.ValidationError}(${v})`) : (j.assign((0, t._)`${I}.errors`, v), j.return(!1));
  }
  const g = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function S(T, v, j) {
    const { createErrors: I } = T.it;
    return I === !1 ? (0, t._)`{}` : L(T, v, j);
  }
  function L(T, v, j = {}) {
    const { gen: I, it: r } = T, i = [
      A(r, j),
      N(T, j)
    ];
    return C(T, v, i), I.object(...i);
  }
  function A({ errorPath: T }, { instancePath: v }) {
    const j = v ? (0, t.str)`${T}${(0, a.getErrorPath)(v, a.Type.Str)}` : T;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, j)];
  }
  function N({ keyword: T, it: { errSchemaPath: v } }, { schemaPath: j, parentSchema: I }) {
    let r = I ? v : (0, t.str)`${v}/${T}`;
    return j && (r = (0, t.str)`${r}${(0, a.getErrorPath)(j, a.Type.Str)}`), [g.schemaPath, r];
  }
  function C(T, { params: v, message: j }, I) {
    const { keyword: r, data: i, schemaValue: o, it: l } = T, { opts: u, propertyName: m, topSchemaRef: f, schemaPath: x } = l;
    I.push([g.keyword, r], [g.params, typeof v == "function" ? v(T) : v || (0, t._)`{}`]), u.messages && I.push([g.message, typeof j == "function" ? j(T) : j]), u.verbose && I.push([g.schema, o], [g.parentSchema, (0, t._)`${f}${x}`], [n.default.data, i]), m && I.push([g.propertyName, m]);
  }
})(Ka);
Object.defineProperty(sa, "__esModule", { value: !0 });
sa.boolOrEmptySchema = sa.topBoolOrEmptySchema = void 0;
const Vu = Ka, Fu = we, Uu = cr, qu = {
  message: "boolean schema is false"
};
function Hu(e) {
  const { gen: t, schema: a, validateName: n } = e;
  a === !1 ? Mc(e, !1) : typeof a == "object" && a.$async === !0 ? t.return(Uu.default.data) : (t.assign((0, Fu._)`${n}.errors`, null), t.return(!0));
}
sa.topBoolOrEmptySchema = Hu;
function Gu(e, t) {
  const { gen: a, schema: n } = e;
  n === !1 ? (a.var(t, !1), Mc(e)) : a.var(t, !0);
}
sa.boolOrEmptySchema = Gu;
function Mc(e, t) {
  const { gen: a, data: n } = e, s = {
    gen: a,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, Vu.reportError)(s, qu, void 0, t);
}
var Wa = {}, Fr = {};
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.getRules = Fr.isJSONType = void 0;
const Ku = ["string", "number", "integer", "boolean", "null", "object", "array"], Wu = new Set(Ku);
function Ju(e) {
  return typeof e == "string" && Wu.has(e);
}
Fr.isJSONType = Ju;
function Zu() {
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
Fr.getRules = Zu;
var mr = {};
Object.defineProperty(mr, "__esModule", { value: !0 });
mr.shouldUseRule = mr.shouldUseGroup = mr.schemaHasRulesForType = void 0;
function Yu({ schema: e, self: t }, a) {
  const n = t.RULES.types[a];
  return n && n !== !0 && Dc(e, n);
}
mr.schemaHasRulesForType = Yu;
function Dc(e, t) {
  return t.rules.some((a) => zc(e, a));
}
mr.shouldUseGroup = Dc;
function zc(e, t) {
  var a;
  return e[t.keyword] !== void 0 || ((a = t.definition.implements) === null || a === void 0 ? void 0 : a.some((n) => e[n] !== void 0));
}
mr.shouldUseRule = zc;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.reportTypeError = e.checkDataTypes = e.checkDataType = e.coerceAndCheckDataType = e.getJSONTypes = e.getSchemaTypes = e.DataType = void 0;
  const t = Fr, a = mr, n = Ka, s = we, c = $e;
  var p;
  (function(I) {
    I[I.Correct = 0] = "Correct", I[I.Wrong = 1] = "Wrong";
  })(p = e.DataType || (e.DataType = {}));
  function b(I) {
    const r = _(I.type);
    if (r.includes("null")) {
      if (I.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!r.length && I.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      I.nullable === !0 && r.push("null");
    }
    return r;
  }
  e.getSchemaTypes = b;
  function _(I) {
    const r = Array.isArray(I) ? I : I ? [I] : [];
    if (r.every(t.isJSONType))
      return r;
    throw new Error("type must be JSONType or JSONType[]: " + r.join(","));
  }
  e.getJSONTypes = _;
  function y(I, r) {
    const { gen: i, data: o, opts: l } = I, u = S(r, l.coerceTypes), m = r.length > 0 && !(u.length === 0 && r.length === 1 && (0, a.schemaHasRulesForType)(I, r[0]));
    if (m) {
      const f = C(r, o, l.strictNumbers, p.Wrong);
      i.if(f, () => {
        u.length ? L(I, r, u) : v(I);
      });
    }
    return m;
  }
  e.coerceAndCheckDataType = y;
  const g = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function S(I, r) {
    return r ? I.filter((i) => g.has(i) || r === "array" && i === "array") : [];
  }
  function L(I, r, i) {
    const { gen: o, data: l, opts: u } = I, m = o.let("dataType", (0, s._)`typeof ${l}`), f = o.let("coerced", (0, s._)`undefined`);
    u.coerceTypes === "array" && o.if((0, s._)`${m} == 'object' && Array.isArray(${l}) && ${l}.length == 1`, () => o.assign(l, (0, s._)`${l}[0]`).assign(m, (0, s._)`typeof ${l}`).if(C(r, l, u.strictNumbers), () => o.assign(f, l))), o.if((0, s._)`${f} !== undefined`);
    for (const B of i)
      (g.has(B) || B === "array" && u.coerceTypes === "array") && x(B);
    o.else(), v(I), o.endIf(), o.if((0, s._)`${f} !== undefined`, () => {
      o.assign(l, f), A(I, f);
    });
    function x(B) {
      switch (B) {
        case "string":
          o.elseIf((0, s._)`${m} == "number" || ${m} == "boolean"`).assign(f, (0, s._)`"" + ${l}`).elseIf((0, s._)`${l} === null`).assign(f, (0, s._)`""`);
          return;
        case "number":
          o.elseIf((0, s._)`${m} == "boolean" || ${l} === null
              || (${m} == "string" && ${l} && ${l} == +${l})`).assign(f, (0, s._)`+${l}`);
          return;
        case "integer":
          o.elseIf((0, s._)`${m} === "boolean" || ${l} === null
              || (${m} === "string" && ${l} && ${l} == +${l} && !(${l} % 1))`).assign(f, (0, s._)`+${l}`);
          return;
        case "boolean":
          o.elseIf((0, s._)`${l} === "false" || ${l} === 0 || ${l} === null`).assign(f, !1).elseIf((0, s._)`${l} === "true" || ${l} === 1`).assign(f, !0);
          return;
        case "null":
          o.elseIf((0, s._)`${l} === "" || ${l} === 0 || ${l} === false`), o.assign(f, null);
          return;
        case "array":
          o.elseIf((0, s._)`${m} === "string" || ${m} === "number"
              || ${m} === "boolean" || ${l} === null`).assign(f, (0, s._)`[${l}]`);
      }
    }
  }
  function A({ gen: I, parentData: r, parentDataProperty: i }, o) {
    I.if((0, s._)`${r} !== undefined`, () => I.assign((0, s._)`${r}[${i}]`, o));
  }
  function N(I, r, i, o = p.Correct) {
    const l = o === p.Correct ? s.operators.EQ : s.operators.NEQ;
    let u;
    switch (I) {
      case "null":
        return (0, s._)`${r} ${l} null`;
      case "array":
        u = (0, s._)`Array.isArray(${r})`;
        break;
      case "object":
        u = (0, s._)`${r} && typeof ${r} == "object" && !Array.isArray(${r})`;
        break;
      case "integer":
        u = m((0, s._)`!(${r} % 1) && !isNaN(${r})`);
        break;
      case "number":
        u = m();
        break;
      default:
        return (0, s._)`typeof ${r} ${l} ${I}`;
    }
    return o === p.Correct ? u : (0, s.not)(u);
    function m(f = s.nil) {
      return (0, s.and)((0, s._)`typeof ${r} == "number"`, f, i ? (0, s._)`isFinite(${r})` : s.nil);
    }
  }
  e.checkDataType = N;
  function C(I, r, i, o) {
    if (I.length === 1)
      return N(I[0], r, i, o);
    let l;
    const u = (0, c.toHash)(I);
    if (u.array && u.object) {
      const m = (0, s._)`typeof ${r} != "object"`;
      l = u.null ? m : (0, s._)`!${r} || ${m}`, delete u.null, delete u.array, delete u.object;
    } else
      l = s.nil;
    u.number && delete u.integer;
    for (const m in u)
      l = (0, s.and)(l, N(m, r, i, o));
    return l;
  }
  e.checkDataTypes = C;
  const T = {
    message: ({ schema: I }) => `must be ${I}`,
    params: ({ schema: I, schemaValue: r }) => typeof I == "string" ? (0, s._)`{type: ${I}}` : (0, s._)`{type: ${r}}`
  };
  function v(I) {
    const r = j(I);
    (0, n.reportError)(r, T);
  }
  e.reportTypeError = v;
  function j(I) {
    const { gen: r, data: i, schema: o } = I, l = (0, c.schemaRefOrVal)(I, o, "type");
    return {
      gen: r,
      keyword: "type",
      data: i,
      schema: o.type,
      schemaCode: l,
      schemaValue: l,
      parentSchema: o,
      params: {},
      it: I
    };
  }
})(Wa);
var Fn = {};
Object.defineProperty(Fn, "__esModule", { value: !0 });
Fn.assignDefaults = void 0;
const Gr = we, Qu = $e;
function Xu(e, t) {
  const { properties: a, items: n } = e.schema;
  if (t === "object" && a)
    for (const s in a)
      yi(e, s, a[s].default);
  else
    t === "array" && Array.isArray(n) && n.forEach((s, c) => yi(e, c, s.default));
}
Fn.assignDefaults = Xu;
function yi(e, t, a) {
  const { gen: n, compositeRule: s, data: c, opts: p } = e;
  if (a === void 0)
    return;
  const b = (0, Gr._)`${c}${(0, Gr.getProperty)(t)}`;
  if (s) {
    (0, Qu.checkStrictMode)(e, `default is ignored for: ${b}`);
    return;
  }
  let _ = (0, Gr._)`${b} === undefined`;
  p.useDefaults === "empty" && (_ = (0, Gr._)`${_} || ${b} === null || ${b} === ""`), n.if(_, (0, Gr._)`${b} = ${(0, Gr.stringify)(a)}`);
}
var sr = {}, be = {};
Object.defineProperty(be, "__esModule", { value: !0 });
be.validateUnion = be.validateArray = be.usePattern = be.callValidateCode = be.schemaProperties = be.allSchemaProperties = be.noPropertyInData = be.propertyInData = be.isOwnProperty = be.hasPropFunc = be.reportMissingProp = be.checkMissingProp = be.checkReportMissingProp = void 0;
const Ae = we, zo = $e, _r = cr, ed = $e;
function td(e, t) {
  const { gen: a, data: n, it: s } = e;
  a.if(Vo(a, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Ae._)`${t}` }, !0), e.error();
  });
}
be.checkReportMissingProp = td;
function rd({ gen: e, data: t, it: { opts: a } }, n, s) {
  return (0, Ae.or)(...n.map((c) => (0, Ae.and)(Vo(e, t, c, a.ownProperties), (0, Ae._)`${s} = ${c}`)));
}
be.checkMissingProp = rd;
function ad(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
be.reportMissingProp = ad;
function Bc(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Ae._)`Object.prototype.hasOwnProperty`
  });
}
be.hasPropFunc = Bc;
function Bo(e, t, a) {
  return (0, Ae._)`${Bc(e)}.call(${t}, ${a})`;
}
be.isOwnProperty = Bo;
function nd(e, t, a, n) {
  const s = (0, Ae._)`${t}${(0, Ae.getProperty)(a)} !== undefined`;
  return n ? (0, Ae._)`${s} && ${Bo(e, t, a)}` : s;
}
be.propertyInData = nd;
function Vo(e, t, a, n) {
  const s = (0, Ae._)`${t}${(0, Ae.getProperty)(a)} === undefined`;
  return n ? (0, Ae.or)(s, (0, Ae.not)(Bo(e, t, a))) : s;
}
be.noPropertyInData = Vo;
function Vc(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
be.allSchemaProperties = Vc;
function od(e, t) {
  return Vc(t).filter((a) => !(0, zo.alwaysValidSchema)(e, t[a]));
}
be.schemaProperties = od;
function sd({ schemaCode: e, data: t, it: { gen: a, topSchemaRef: n, schemaPath: s, errorPath: c }, it: p }, b, _, y) {
  const g = y ? (0, Ae._)`${e}, ${t}, ${n}${s}` : t, S = [
    [_r.default.instancePath, (0, Ae.strConcat)(_r.default.instancePath, c)],
    [_r.default.parentData, p.parentData],
    [_r.default.parentDataProperty, p.parentDataProperty],
    [_r.default.rootData, _r.default.rootData]
  ];
  p.opts.dynamicRef && S.push([_r.default.dynamicAnchors, _r.default.dynamicAnchors]);
  const L = (0, Ae._)`${g}, ${a.object(...S)}`;
  return _ !== Ae.nil ? (0, Ae._)`${b}.call(${_}, ${L})` : (0, Ae._)`${b}(${L})`;
}
be.callValidateCode = sd;
const id = (0, Ae._)`new RegExp`;
function cd({ gen: e, it: { opts: t } }, a) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, c = s(a, n);
  return e.scopeValue("pattern", {
    key: c.toString(),
    ref: c,
    code: (0, Ae._)`${s.code === "new RegExp" ? id : (0, ed.useFunc)(e, s)}(${a}, ${n})`
  });
}
be.usePattern = cd;
function ld(e) {
  const { gen: t, data: a, keyword: n, it: s } = e, c = t.name("valid");
  if (s.allErrors) {
    const b = t.let("valid", !0);
    return p(() => t.assign(b, !1)), b;
  }
  return t.var(c, !0), p(() => t.break()), c;
  function p(b) {
    const _ = t.const("len", (0, Ae._)`${a}.length`);
    t.forRange("i", 0, _, (y) => {
      e.subschema({
        keyword: n,
        dataProp: y,
        dataPropType: zo.Type.Num
      }, c), t.if((0, Ae.not)(c), b);
    });
  }
}
be.validateArray = ld;
function ud(e) {
  const { gen: t, schema: a, keyword: n, it: s } = e;
  if (!Array.isArray(a))
    throw new Error("ajv implementation error");
  if (a.some((b) => (0, zo.alwaysValidSchema)(s, b)) && !s.opts.unevaluated)
    return;
  const c = t.let("valid", !1), p = t.name("_valid");
  t.block(() => a.forEach((b, _) => {
    const y = e.subschema({
      keyword: n,
      schemaProp: _,
      compositeRule: !0
    }, p);
    t.assign(c, (0, Ae._)`${c} || ${p}`), e.mergeValidEvaluated(y, p) || t.if((0, Ae.not)(c));
  })), e.result(c, () => e.reset(), () => e.error(!0));
}
be.validateUnion = ud;
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.validateKeywordUsage = sr.validSchemaType = sr.funcKeywordCode = sr.macroKeywordCode = void 0;
const ut = we, Ar = cr, dd = be, hd = Ka;
function pd(e, t) {
  const { gen: a, keyword: n, schema: s, parentSchema: c, it: p } = e, b = t.macro.call(p.self, s, c, p), _ = Fc(a, n, b);
  p.opts.validateSchema !== !1 && p.self.validateSchema(b, !0);
  const y = a.name("valid");
  e.subschema({
    schema: b,
    schemaPath: ut.nil,
    errSchemaPath: `${p.errSchemaPath}/${n}`,
    topSchemaRef: _,
    compositeRule: !0
  }, y), e.pass(y, () => e.error(!0));
}
sr.macroKeywordCode = pd;
function fd(e, t) {
  var a;
  const { gen: n, keyword: s, schema: c, parentSchema: p, $data: b, it: _ } = e;
  gd(_, t);
  const y = !b && t.compile ? t.compile.call(_.self, c, p, _) : t.validate, g = Fc(n, s, y), S = n.let("valid");
  e.block$data(S, L), e.ok((a = t.valid) !== null && a !== void 0 ? a : S);
  function L() {
    if (t.errors === !1)
      C(), t.modifying && bi(e), T(() => e.error());
    else {
      const v = t.async ? A() : N();
      t.modifying && bi(e), T(() => md(e, v));
    }
  }
  function A() {
    const v = n.let("ruleErrs", null);
    return n.try(() => C((0, ut._)`await `), (j) => n.assign(S, !1).if((0, ut._)`${j} instanceof ${_.ValidationError}`, () => n.assign(v, (0, ut._)`${j}.errors`), () => n.throw(j))), v;
  }
  function N() {
    const v = (0, ut._)`${g}.errors`;
    return n.assign(v, null), C(ut.nil), v;
  }
  function C(v = t.async ? (0, ut._)`await ` : ut.nil) {
    const j = _.opts.passContext ? Ar.default.this : Ar.default.self, I = !("compile" in t && !b || t.schema === !1);
    n.assign(S, (0, ut._)`${v}${(0, dd.callValidateCode)(e, g, j, I)}`, t.modifying);
  }
  function T(v) {
    var j;
    n.if((0, ut.not)((j = t.valid) !== null && j !== void 0 ? j : S), v);
  }
}
sr.funcKeywordCode = fd;
function bi(e) {
  const { gen: t, data: a, it: n } = e;
  t.if(n.parentData, () => t.assign(a, (0, ut._)`${n.parentData}[${n.parentDataProperty}]`));
}
function md(e, t) {
  const { gen: a } = e;
  a.if((0, ut._)`Array.isArray(${t})`, () => {
    a.assign(Ar.default.vErrors, (0, ut._)`${Ar.default.vErrors} === null ? ${t} : ${Ar.default.vErrors}.concat(${t})`).assign(Ar.default.errors, (0, ut._)`${Ar.default.vErrors}.length`), (0, hd.extendErrors)(e);
  }, () => e.error());
}
function gd({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Fc(e, t, a) {
  if (a === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof a == "function" ? { ref: a } : { ref: a, code: (0, ut.stringify)(a) });
}
function yd(e, t, a = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || a && typeof e > "u");
}
sr.validSchemaType = yd;
function bd({ schema: e, opts: t, self: a, errSchemaPath: n }, s, c) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(c) : s.keyword !== c)
    throw new Error("ajv implementation error");
  const p = s.dependencies;
  if (p != null && p.some((b) => !Object.prototype.hasOwnProperty.call(e, b)))
    throw new Error(`parent schema must have dependencies of ${c}: ${p.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[c])) {
    const b = `keyword "${c}" value is invalid at path "${n}": ` + a.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      a.logger.error(b);
    else
      throw new Error(b);
  }
}
sr.validateKeywordUsage = bd;
var Tr = {};
Object.defineProperty(Tr, "__esModule", { value: !0 });
Tr.extendSubschemaMode = Tr.extendSubschemaData = Tr.getSubschema = void 0;
const nr = we, Uc = $e;
function _d(e, { keyword: t, schemaProp: a, schema: n, schemaPath: s, errSchemaPath: c, topSchemaRef: p }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const b = e.schema[t];
    return a === void 0 ? {
      schema: b,
      schemaPath: (0, nr._)`${e.schemaPath}${(0, nr.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: b[a],
      schemaPath: (0, nr._)`${e.schemaPath}${(0, nr.getProperty)(t)}${(0, nr.getProperty)(a)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Uc.escapeFragment)(a)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || c === void 0 || p === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: p,
      errSchemaPath: c
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Tr.getSubschema = _d;
function wd(e, t, { dataProp: a, dataPropType: n, data: s, dataTypes: c, propertyName: p }) {
  if (s !== void 0 && a !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: b } = t;
  if (a !== void 0) {
    const { errorPath: y, dataPathArr: g, opts: S } = t, L = b.let("data", (0, nr._)`${t.data}${(0, nr.getProperty)(a)}`, !0);
    _(L), e.errorPath = (0, nr.str)`${y}${(0, Uc.getErrorPath)(a, n, S.jsPropertySyntax)}`, e.parentDataProperty = (0, nr._)`${a}`, e.dataPathArr = [...g, e.parentDataProperty];
  }
  if (s !== void 0) {
    const y = s instanceof nr.Name ? s : b.let("data", s, !0);
    _(y), p !== void 0 && (e.propertyName = p);
  }
  c && (e.dataTypes = c);
  function _(y) {
    e.data = y, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, y];
  }
}
Tr.extendSubschemaData = wd;
function vd(e, { jtdDiscriminator: t, jtdMetadata: a, compositeRule: n, createErrors: s, allErrors: c }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), c !== void 0 && (e.allErrors = c), e.jtdDiscriminator = t, e.jtdMetadata = a;
}
Tr.extendSubschemaMode = vd;
var tt = {}, qc = function e(t, a) {
  if (t === a)
    return !0;
  if (t && a && typeof t == "object" && typeof a == "object") {
    if (t.constructor !== a.constructor)
      return !1;
    var n, s, c;
    if (Array.isArray(t)) {
      if (n = t.length, n != a.length)
        return !1;
      for (s = n; s-- !== 0; )
        if (!e(t[s], a[s]))
          return !1;
      return !0;
    }
    if (t.constructor === RegExp)
      return t.source === a.source && t.flags === a.flags;
    if (t.valueOf !== Object.prototype.valueOf)
      return t.valueOf() === a.valueOf();
    if (t.toString !== Object.prototype.toString)
      return t.toString() === a.toString();
    if (c = Object.keys(t), n = c.length, n !== Object.keys(a).length)
      return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(a, c[s]))
        return !1;
    for (s = n; s-- !== 0; ) {
      var p = c[s];
      if (!e(t[p], a[p]))
        return !1;
    }
    return !0;
  }
  return t !== t && a !== a;
}, Hc = { exports: {} }, Sr = Hc.exports = function(e, t, a) {
  typeof t == "function" && (a = t, t = {}), a = t.cb || a;
  var n = typeof a == "function" ? a : a.pre || function() {
  }, s = a.post || function() {
  };
  yn(t, n, s, e, "", e);
};
Sr.keywords = {
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
Sr.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Sr.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Sr.skipKeywords = {
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
function yn(e, t, a, n, s, c, p, b, _, y) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, c, p, b, _, y);
    for (var g in n) {
      var S = n[g];
      if (Array.isArray(S)) {
        if (g in Sr.arrayKeywords)
          for (var L = 0; L < S.length; L++)
            yn(e, t, a, S[L], s + "/" + g + "/" + L, c, s, g, n, L);
      } else if (g in Sr.propsKeywords) {
        if (S && typeof S == "object")
          for (var A in S)
            yn(e, t, a, S[A], s + "/" + g + "/" + $d(A), c, s, g, n, A);
      } else
        (g in Sr.keywords || e.allKeys && !(g in Sr.skipKeywords)) && yn(e, t, a, S, s + "/" + g, c, s, g, n);
    }
    a(n, s, c, p, b, _, y);
  }
}
function $d(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var kd = Hc.exports;
Object.defineProperty(tt, "__esModule", { value: !0 });
tt.getSchemaRefs = tt.resolveUrl = tt.normalizeId = tt._getFullPath = tt.getFullPath = tt.inlineRef = void 0;
const Ed = $e, Pd = qc, Sd = kd, xd = /* @__PURE__ */ new Set([
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
function Td(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !ko(e) : t ? Gc(e) <= t : !1;
}
tt.inlineRef = Td;
const jd = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function ko(e) {
  for (const t in e) {
    if (jd.has(t))
      return !0;
    const a = e[t];
    if (Array.isArray(a) && a.some(ko) || typeof a == "object" && ko(a))
      return !0;
  }
  return !1;
}
function Gc(e) {
  let t = 0;
  for (const a in e)
    if (a === "$ref" || (t++, !xd.has(a) && (typeof e[a] == "object" && (0, Ed.eachItem)(e[a], (n) => t += Gc(n)), t === 1 / 0)))
      return 1 / 0;
  return t;
}
function Kc(e, t = "", a) {
  a !== !1 && (t = ta(t));
  const n = e.parse(t);
  return Wc(e, n);
}
tt.getFullPath = Kc;
function Wc(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
tt._getFullPath = Wc;
const Cd = /#\/?$/;
function ta(e) {
  return e ? e.replace(Cd, "") : "";
}
tt.normalizeId = ta;
function Od(e, t, a) {
  return a = ta(a), e.resolve(t, a);
}
tt.resolveUrl = Od;
const Nd = /^[a-z_][-a-z0-9._]*$/i;
function Ld(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: a, uriResolver: n } = this.opts, s = ta(e[a] || t), c = { "": s }, p = Kc(n, s, !1), b = {}, _ = /* @__PURE__ */ new Set();
  return Sd(e, { allKeys: !0 }, (S, L, A, N) => {
    if (N === void 0)
      return;
    const C = p + L;
    let T = c[N];
    typeof S[a] == "string" && (T = v.call(this, S[a])), j.call(this, S.$anchor), j.call(this, S.$dynamicAnchor), c[L] = T;
    function v(I) {
      const r = this.opts.uriResolver.resolve;
      if (I = ta(T ? r(T, I) : I), _.has(I))
        throw g(I);
      _.add(I);
      let i = this.refs[I];
      return typeof i == "string" && (i = this.refs[i]), typeof i == "object" ? y(S, i.schema, I) : I !== ta(C) && (I[0] === "#" ? (y(S, b[I], I), b[I] = S) : this.refs[I] = C), I;
    }
    function j(I) {
      if (typeof I == "string") {
        if (!Nd.test(I))
          throw new Error(`invalid anchor "${I}"`);
        v.call(this, `#${I}`);
      }
    }
  }), b;
  function y(S, L, A) {
    if (L !== void 0 && !Pd(S, L))
      throw g(A);
  }
  function g(S) {
    return new Error(`reference "${S}" resolves to more than one schema`);
  }
}
tt.getSchemaRefs = Ld;
Object.defineProperty(er, "__esModule", { value: !0 });
er.getData = er.KeywordCxt = er.validateFunctionCode = void 0;
const Jc = sa, _i = Wa, Fo = mr, xn = Wa, Rd = Fn, La = sr, co = Tr, ae = we, le = cr, Id = tt, gr = $e, Pa = Ka;
function Ad(e) {
  if (Qc(e) && (Xc(e), Yc(e))) {
    zd(e);
    return;
  }
  Zc(e, () => (0, Jc.topBoolOrEmptySchema)(e));
}
er.validateFunctionCode = Ad;
function Zc({ gen: e, validateName: t, schema: a, schemaEnv: n, opts: s }, c) {
  s.code.es5 ? e.func(t, (0, ae._)`${le.default.data}, ${le.default.valCxt}`, n.$async, () => {
    e.code((0, ae._)`"use strict"; ${wi(a, s)}`), Dd(e, s), e.code(c);
  }) : e.func(t, (0, ae._)`${le.default.data}, ${Md(s)}`, n.$async, () => e.code(wi(a, s)).code(c));
}
function Md(e) {
  return (0, ae._)`{${le.default.instancePath}="", ${le.default.parentData}, ${le.default.parentDataProperty}, ${le.default.rootData}=${le.default.data}${e.dynamicRef ? (0, ae._)`, ${le.default.dynamicAnchors}={}` : ae.nil}}={}`;
}
function Dd(e, t) {
  e.if(le.default.valCxt, () => {
    e.var(le.default.instancePath, (0, ae._)`${le.default.valCxt}.${le.default.instancePath}`), e.var(le.default.parentData, (0, ae._)`${le.default.valCxt}.${le.default.parentData}`), e.var(le.default.parentDataProperty, (0, ae._)`${le.default.valCxt}.${le.default.parentDataProperty}`), e.var(le.default.rootData, (0, ae._)`${le.default.valCxt}.${le.default.rootData}`), t.dynamicRef && e.var(le.default.dynamicAnchors, (0, ae._)`${le.default.valCxt}.${le.default.dynamicAnchors}`);
  }, () => {
    e.var(le.default.instancePath, (0, ae._)`""`), e.var(le.default.parentData, (0, ae._)`undefined`), e.var(le.default.parentDataProperty, (0, ae._)`undefined`), e.var(le.default.rootData, le.default.data), t.dynamicRef && e.var(le.default.dynamicAnchors, (0, ae._)`{}`);
  });
}
function zd(e) {
  const { schema: t, opts: a, gen: n } = e;
  Zc(e, () => {
    a.$comment && t.$comment && tl(e), qd(e), n.let(le.default.vErrors, null), n.let(le.default.errors, 0), a.unevaluated && Bd(e), el(e), Kd(e);
  });
}
function Bd(e) {
  const { gen: t, validateName: a } = e;
  e.evaluated = t.const("evaluated", (0, ae._)`${a}.evaluated`), t.if((0, ae._)`${e.evaluated}.dynamicProps`, () => t.assign((0, ae._)`${e.evaluated}.props`, (0, ae._)`undefined`)), t.if((0, ae._)`${e.evaluated}.dynamicItems`, () => t.assign((0, ae._)`${e.evaluated}.items`, (0, ae._)`undefined`));
}
function wi(e, t) {
  const a = typeof e == "object" && e[t.schemaId];
  return a && (t.code.source || t.code.process) ? (0, ae._)`/*# sourceURL=${a} */` : ae.nil;
}
function Vd(e, t) {
  if (Qc(e) && (Xc(e), Yc(e))) {
    Fd(e, t);
    return;
  }
  (0, Jc.boolOrEmptySchema)(e, t);
}
function Yc({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const a in e)
    if (t.RULES.all[a])
      return !0;
  return !1;
}
function Qc(e) {
  return typeof e.schema != "boolean";
}
function Fd(e, t) {
  const { schema: a, gen: n, opts: s } = e;
  s.$comment && a.$comment && tl(e), Hd(e), Gd(e);
  const c = n.const("_errs", le.default.errors);
  el(e, c), n.var(t, (0, ae._)`${c} === ${le.default.errors}`);
}
function Xc(e) {
  (0, gr.checkUnknownRules)(e), Ud(e);
}
function el(e, t) {
  if (e.opts.jtd)
    return vi(e, [], !1, t);
  const a = (0, _i.getSchemaTypes)(e.schema), n = (0, _i.coerceAndCheckDataType)(e, a);
  vi(e, a, !n, t);
}
function Ud(e) {
  const { schema: t, errSchemaPath: a, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, gr.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${a}"`);
}
function qd(e) {
  const { schema: t, opts: a } = e;
  t.default !== void 0 && a.useDefaults && a.strictSchema && (0, gr.checkStrictMode)(e, "default is ignored in the schema root");
}
function Hd(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Id.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function Gd(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function tl({ gen: e, schemaEnv: t, schema: a, errSchemaPath: n, opts: s }) {
  const c = a.$comment;
  if (s.$comment === !0)
    e.code((0, ae._)`${le.default.self}.logger.log(${c})`);
  else if (typeof s.$comment == "function") {
    const p = (0, ae.str)`${n}/$comment`, b = e.scopeValue("root", { ref: t.root });
    e.code((0, ae._)`${le.default.self}.opts.$comment(${c}, ${p}, ${b}.schema)`);
  }
}
function Kd(e) {
  const { gen: t, schemaEnv: a, validateName: n, ValidationError: s, opts: c } = e;
  a.$async ? t.if((0, ae._)`${le.default.errors} === 0`, () => t.return(le.default.data), () => t.throw((0, ae._)`new ${s}(${le.default.vErrors})`)) : (t.assign((0, ae._)`${n}.errors`, le.default.vErrors), c.unevaluated && Wd(e), t.return((0, ae._)`${le.default.errors} === 0`));
}
function Wd({ gen: e, evaluated: t, props: a, items: n }) {
  a instanceof ae.Name && e.assign((0, ae._)`${t}.props`, a), n instanceof ae.Name && e.assign((0, ae._)`${t}.items`, n);
}
function vi(e, t, a, n) {
  const { gen: s, schema: c, data: p, allErrors: b, opts: _, self: y } = e, { RULES: g } = y;
  if (c.$ref && (_.ignoreKeywordsWithRef || !(0, gr.schemaHasRulesButRef)(c, g))) {
    s.block(() => nl(e, "$ref", g.all.$ref.definition));
    return;
  }
  _.jtd || Jd(e, t), s.block(() => {
    for (const L of g.rules)
      S(L);
    S(g.post);
  });
  function S(L) {
    (0, Fo.shouldUseGroup)(c, L) && (L.type ? (s.if((0, xn.checkDataType)(L.type, p, _.strictNumbers)), $i(e, L), t.length === 1 && t[0] === L.type && a && (s.else(), (0, xn.reportTypeError)(e)), s.endIf()) : $i(e, L), b || s.if((0, ae._)`${le.default.errors} === ${n || 0}`));
  }
}
function $i(e, t) {
  const { gen: a, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Rd.assignDefaults)(e, t.type), a.block(() => {
    for (const c of t.rules)
      (0, Fo.shouldUseRule)(n, c) && nl(e, c.keyword, c.definition, t.type);
  });
}
function Jd(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (Zd(e, t), e.opts.allowUnionTypes || Yd(e, t), Qd(e, e.dataTypes));
}
function Zd(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((a) => {
      rl(e.dataTypes, a) || Uo(e, `type "${a}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), eh(e, t);
  }
}
function Yd(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Uo(e, "use allowUnionTypes to allow union type keyword");
}
function Qd(e, t) {
  const a = e.self.RULES.all;
  for (const n in a) {
    const s = a[n];
    if (typeof s == "object" && (0, Fo.shouldUseRule)(e.schema, s)) {
      const { type: c } = s.definition;
      c.length && !c.some((p) => Xd(t, p)) && Uo(e, `missing type "${c.join(",")}" for keyword "${n}"`);
    }
  }
}
function Xd(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function rl(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function eh(e, t) {
  const a = [];
  for (const n of e.dataTypes)
    rl(t, n) ? a.push(n) : t.includes("integer") && n === "number" && a.push("integer");
  e.dataTypes = a;
}
function Uo(e, t) {
  const a = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${a}" (strictTypes)`, (0, gr.checkStrictMode)(e, t, e.opts.strictTypes);
}
let al = class {
  constructor(t, a, n) {
    if ((0, La.validateKeywordUsage)(t, a, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = a.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, gr.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = a.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = a, this.$data)
      this.schemaCode = t.gen.const("vSchema", ol(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, La.validSchemaType)(this.schema, a.schemaType, a.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(a.schemaType)}`);
    ("code" in a ? a.trackErrors : a.errors !== !1) && (this.errsCount = t.gen.const("_errs", le.default.errors));
  }
  result(t, a, n) {
    this.failResult((0, ae.not)(t), a, n);
  }
  failResult(t, a, n) {
    this.gen.if(t), n ? n() : this.error(), a ? (this.gen.else(), a(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, a) {
    this.failResult((0, ae.not)(t), void 0, a);
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
    const { schemaCode: a } = this;
    this.fail((0, ae._)`${a} !== undefined && (${(0, ae.or)(this.invalid$data(), t)})`);
  }
  error(t, a, n) {
    if (a) {
      this.setParams(a), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, a) {
    (t ? Pa.reportExtraError : Pa.reportError)(this, this.def.error, a);
  }
  $dataError() {
    (0, Pa.reportError)(this, this.def.$dataError || Pa.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Pa.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, a) {
    a ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, a, n = ae.nil) {
    this.gen.block(() => {
      this.check$data(t, n), a();
    });
  }
  check$data(t = ae.nil, a = ae.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: c, def: p } = this;
    n.if((0, ae.or)((0, ae._)`${s} === undefined`, a)), t !== ae.nil && n.assign(t, !0), (c.length || p.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== ae.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: a, schemaType: n, def: s, it: c } = this;
    return (0, ae.or)(p(), b());
    function p() {
      if (n.length) {
        if (!(a instanceof ae.Name))
          throw new Error("ajv implementation error");
        const _ = Array.isArray(n) ? n : [n];
        return (0, ae._)`${(0, xn.checkDataTypes)(_, a, c.opts.strictNumbers, xn.DataType.Wrong)}`;
      }
      return ae.nil;
    }
    function b() {
      if (s.validateSchema) {
        const _ = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, ae._)`!${_}(${a})`;
      }
      return ae.nil;
    }
  }
  subschema(t, a) {
    const n = (0, co.getSubschema)(this.it, t);
    (0, co.extendSubschemaData)(n, this.it, t), (0, co.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Vd(s, a), s;
  }
  mergeEvaluated(t, a) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = gr.mergeEvaluated.props(s, t.props, n.props, a)), n.items !== !0 && t.items !== void 0 && (n.items = gr.mergeEvaluated.items(s, t.items, n.items, a)));
  }
  mergeValidEvaluated(t, a) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(a, () => this.mergeEvaluated(t, ae.Name)), !0;
  }
};
er.KeywordCxt = al;
function nl(e, t, a, n) {
  const s = new al(e, a, t);
  "code" in a ? a.code(s, n) : s.$data && a.validate ? (0, La.funcKeywordCode)(s, a) : "macro" in a ? (0, La.macroKeywordCode)(s, a) : (a.compile || a.validate) && (0, La.funcKeywordCode)(s, a);
}
const th = /^\/(?:[^~]|~0|~1)*$/, rh = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function ol(e, { dataLevel: t, dataNames: a, dataPathArr: n }) {
  let s, c;
  if (e === "")
    return le.default.rootData;
  if (e[0] === "/") {
    if (!th.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, c = le.default.rootData;
  } else {
    const y = rh.exec(e);
    if (!y)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const g = +y[1];
    if (s = y[2], s === "#") {
      if (g >= t)
        throw new Error(_("property/index", g));
      return n[t - g];
    }
    if (g > t)
      throw new Error(_("data", g));
    if (c = a[t - g], !s)
      return c;
  }
  let p = c;
  const b = s.split("/");
  for (const y of b)
    y && (c = (0, ae._)`${c}${(0, ae.getProperty)((0, gr.unescapeJsonPointer)(y))}`, p = (0, ae._)`${p} && ${c}`);
  return p;
  function _(y, g) {
    return `Cannot access ${y} ${g} levels up, current level is ${t}`;
  }
}
er.getData = ol;
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
let ah = class extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
};
Ja.default = ah;
var Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
const lo = tt;
let nh = class extends Error {
  constructor(t, a, n, s) {
    super(s || `can't resolve reference ${n} from id ${a}`), this.missingRef = (0, lo.resolveUrl)(t, a, n), this.missingSchema = (0, lo.normalizeId)((0, lo.getFullPath)(t, this.missingRef));
  }
};
Za.default = nh;
var wt = {};
Object.defineProperty(wt, "__esModule", { value: !0 });
wt.resolveSchema = wt.getCompilingSchema = wt.resolveRef = wt.compileSchema = wt.SchemaEnv = void 0;
const qt = we, oh = Ja, Or = cr, Qt = tt, ki = $e, sh = er;
let Un = class {
  constructor(t) {
    var a;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (a = t.baseId) !== null && a !== void 0 ? a : (0, Qt.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
wt.SchemaEnv = Un;
function qo(e) {
  const t = sl.call(this, e);
  if (t)
    return t;
  const a = (0, Qt.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: c } = this.opts, p = new qt.CodeGen(this.scope, { es5: n, lines: s, ownProperties: c });
  let b;
  e.$async && (b = p.scopeValue("Error", {
    ref: oh.default,
    code: (0, qt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const _ = p.scopeName("validate");
  e.validateName = _;
  const y = {
    gen: p,
    allErrors: this.opts.allErrors,
    data: Or.default.data,
    parentData: Or.default.parentData,
    parentDataProperty: Or.default.parentDataProperty,
    dataNames: [Or.default.data],
    dataPathArr: [qt.nil],
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: p.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, qt.stringify)(e.schema) } : { ref: e.schema }),
    validateName: _,
    ValidationError: b,
    schema: e.schema,
    schemaEnv: e,
    rootId: a,
    baseId: e.baseId || a,
    schemaPath: qt.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, qt._)`""`,
    opts: this.opts,
    self: this
  };
  let g;
  try {
    this._compilations.add(e), (0, sh.validateFunctionCode)(y), p.optimize(this.opts.code.optimize);
    const S = p.toString();
    g = `${p.scopeRefs(Or.default.scope)}return ${S}`, this.opts.code.process && (g = this.opts.code.process(g, e));
    const L = new Function(`${Or.default.self}`, `${Or.default.scope}`, g)(this, this.scope.get());
    if (this.scope.value(_, { ref: L }), L.errors = null, L.schema = e.schema, L.schemaEnv = e, e.$async && (L.$async = !0), this.opts.code.source === !0 && (L.source = { validateName: _, validateCode: S, scopeValues: p._values }), this.opts.unevaluated) {
      const { props: A, items: N } = y;
      L.evaluated = {
        props: A instanceof qt.Name ? void 0 : A,
        items: N instanceof qt.Name ? void 0 : N,
        dynamicProps: A instanceof qt.Name,
        dynamicItems: N instanceof qt.Name
      }, L.source && (L.source.evaluated = (0, qt.stringify)(L.evaluated));
    }
    return e.validate = L, e;
  } catch (S) {
    throw delete e.validate, delete e.validateName, g && this.logger.error("Error compiling schema, function code:", g), S;
  } finally {
    this._compilations.delete(e);
  }
}
wt.compileSchema = qo;
function ih(e, t, a) {
  var n;
  a = (0, Qt.resolveUrl)(this.opts.uriResolver, t, a);
  const s = e.refs[a];
  if (s)
    return s;
  let c = uh.call(this, e, a);
  if (c === void 0) {
    const p = (n = e.localRefs) === null || n === void 0 ? void 0 : n[a], { schemaId: b } = this.opts;
    p && (c = new Un({ schema: p, schemaId: b, root: e, baseId: t }));
  }
  if (c !== void 0)
    return e.refs[a] = ch.call(this, c);
}
wt.resolveRef = ih;
function ch(e) {
  return (0, Qt.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : qo.call(this, e);
}
function sl(e) {
  for (const t of this._compilations)
    if (lh(t, e))
      return t;
}
wt.getCompilingSchema = sl;
function lh(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function uh(e, t) {
  let a;
  for (; typeof (a = this.refs[t]) == "string"; )
    t = a;
  return a || this.schemas[t] || qn.call(this, e, t);
}
function qn(e, t) {
  const a = this.opts.uriResolver.parse(t), n = (0, Qt._getFullPath)(this.opts.uriResolver, a);
  let s = (0, Qt.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return uo.call(this, a, e);
  const c = (0, Qt.normalizeId)(n), p = this.refs[c] || this.schemas[c];
  if (typeof p == "string") {
    const b = qn.call(this, e, p);
    return typeof (b == null ? void 0 : b.schema) != "object" ? void 0 : uo.call(this, a, b);
  }
  if (typeof (p == null ? void 0 : p.schema) == "object") {
    if (p.validate || qo.call(this, p), c === (0, Qt.normalizeId)(t)) {
      const { schema: b } = p, { schemaId: _ } = this.opts, y = b[_];
      return y && (s = (0, Qt.resolveUrl)(this.opts.uriResolver, s, y)), new Un({ schema: b, schemaId: _, root: e, baseId: s });
    }
    return uo.call(this, a, p);
  }
}
wt.resolveSchema = qn;
const dh = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function uo(e, { baseId: t, schema: a, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const b of e.fragment.slice(1).split("/")) {
    if (typeof a == "boolean")
      return;
    const _ = a[(0, ki.unescapeFragment)(b)];
    if (_ === void 0)
      return;
    a = _;
    const y = typeof a == "object" && a[this.opts.schemaId];
    !dh.has(b) && y && (t = (0, Qt.resolveUrl)(this.opts.uriResolver, t, y));
  }
  let c;
  if (typeof a != "boolean" && a.$ref && !(0, ki.schemaHasRulesButRef)(a, this.RULES)) {
    const b = (0, Qt.resolveUrl)(this.opts.uriResolver, t, a.$ref);
    c = qn.call(this, n, b);
  }
  const { schemaId: p } = this.opts;
  if (c = c || new Un({ schema: a, schemaId: p, root: n, baseId: t }), c.schema !== c.root.schema)
    return c;
}
const hh = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", ph = "Meta-schema for $data reference (JSON AnySchema extension proposal)", fh = "object", mh = [
  "$data"
], gh = {
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
}, yh = !1, bh = {
  $id: hh,
  description: ph,
  type: fh,
  required: mh,
  properties: gh,
  additionalProperties: yh
};
var Ho = {}, Eo = { exports: {} };
/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
(function(e, t) {
  (function(a, n) {
    n(t);
  })(Rc, function(a) {
    function n() {
      for (var h = arguments.length, $ = Array(h), P = 0; P < h; P++)
        $[P] = arguments[P];
      if ($.length > 1) {
        $[0] = $[0].slice(0, -1);
        for (var M = $.length - 1, D = 1; D < M; ++D)
          $[D] = $[D].slice(1, -1);
        return $[M] = $[M].slice(1), $.join("");
      } else
        return $[0];
    }
    function s(h) {
      return "(?:" + h + ")";
    }
    function c(h) {
      return h === void 0 ? "undefined" : h === null ? "null" : Object.prototype.toString.call(h).split(" ").pop().split("]").shift().toLowerCase();
    }
    function p(h) {
      return h.toUpperCase();
    }
    function b(h) {
      return h != null ? h instanceof Array ? h : typeof h.length != "number" || h.split || h.setInterval || h.call ? [h] : Array.prototype.slice.call(h) : [];
    }
    function _(h, $) {
      var P = h;
      if ($)
        for (var M in $)
          P[M] = $[M];
      return P;
    }
    function y(h) {
      var $ = "[A-Za-z]", P = "[0-9]", M = n(P, "[A-Fa-f]"), D = s(s("%[EFef]" + M + "%" + M + M + "%" + M + M) + "|" + s("%[89A-Fa-f]" + M + "%" + M + M) + "|" + s("%" + M + M)), Y = "[\\:\\/\\?\\#\\[\\]\\@]", Z = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", re = n(Y, Z), he = h ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]", oe = h ? "[\\uE000-\\uF8FF]" : "[]", te = n($, P, "[\\-\\.\\_\\~]", he);
      s($ + n($, P, "[\\+\\-\\.]") + "*"), s(s(D + "|" + n(te, Z, "[\\:]")) + "*");
      var ce = s(s("25[0-5]") + "|" + s("2[0-4]" + P) + "|" + s("1" + P + P) + "|" + s("0?[1-9]" + P) + "|0?0?" + P), de = s(ce + "\\." + ce + "\\." + ce + "\\." + ce), Q = s(M + "{1,4}"), pe = s(s(Q + "\\:" + Q) + "|" + de), se = s(s(Q + "\\:") + "{6}" + pe), Re = s("\\:\\:" + s(Q + "\\:") + "{5}" + pe), xt = s(s(Q) + "?\\:\\:" + s(Q + "\\:") + "{4}" + pe), De = s(s(s(Q + "\\:") + "{0,1}" + Q) + "?\\:\\:" + s(Q + "\\:") + "{3}" + pe), He = s(s(s(Q + "\\:") + "{0,2}" + Q) + "?\\:\\:" + s(Q + "\\:") + "{2}" + pe), it = s(s(s(Q + "\\:") + "{0,3}" + Q) + "?\\:\\:" + Q + "\\:" + pe), ct = s(s(s(Q + "\\:") + "{0,4}" + Q) + "?\\:\\:" + pe), Ie = s(s(s(Q + "\\:") + "{0,5}" + Q) + "?\\:\\:" + Q), Ge = s(s(s(Q + "\\:") + "{0,6}" + Q) + "?\\:\\:"), lt = s([se, Re, xt, De, He, it, ct, Ie, Ge].join("|")), Ve = s(s(te + "|" + D) + "+");
      s("[vV]" + M + "+\\." + n(te, Z, "[\\:]") + "+"), s(s(D + "|" + n(te, Z)) + "*");
      var dr = s(D + "|" + n(te, Z, "[\\:\\@]"));
      return s(s(D + "|" + n(te, Z, "[\\@]")) + "+"), s(s(dr + "|" + n("[\\/\\?]", oe)) + "*"), {
        NOT_SCHEME: new RegExp(n("[^]", $, P, "[\\+\\-\\.]"), "g"),
        NOT_USERINFO: new RegExp(n("[^\\%\\:]", te, Z), "g"),
        NOT_HOST: new RegExp(n("[^\\%\\[\\]\\:]", te, Z), "g"),
        NOT_PATH: new RegExp(n("[^\\%\\/\\:\\@]", te, Z), "g"),
        NOT_PATH_NOSCHEME: new RegExp(n("[^\\%\\/\\@]", te, Z), "g"),
        NOT_QUERY: new RegExp(n("[^\\%]", te, Z, "[\\:\\@\\/\\?]", oe), "g"),
        NOT_FRAGMENT: new RegExp(n("[^\\%]", te, Z, "[\\:\\@\\/\\?]"), "g"),
        ESCAPE: new RegExp(n("[^]", te, Z), "g"),
        UNRESERVED: new RegExp(te, "g"),
        OTHER_CHARS: new RegExp(n("[^\\%]", te, re), "g"),
        PCT_ENCODED: new RegExp(D, "g"),
        IPV4ADDRESS: new RegExp("^(" + de + ")$"),
        IPV6ADDRESS: new RegExp("^\\[?(" + lt + ")" + s(s("\\%25|\\%(?!" + M + "{2})") + "(" + Ve + ")") + "?\\]?$")
        //RFC 6874, with relaxed parsing rules
      };
    }
    var g = y(!1), S = y(!0), L = function() {
      function h($, P) {
        var M = [], D = !0, Y = !1, Z = void 0;
        try {
          for (var re = $[Symbol.iterator](), he; !(D = (he = re.next()).done) && (M.push(he.value), !(P && M.length === P)); D = !0)
            ;
        } catch (oe) {
          Y = !0, Z = oe;
        } finally {
          try {
            !D && re.return && re.return();
          } finally {
            if (Y)
              throw Z;
          }
        }
        return M;
      }
      return function($, P) {
        if (Array.isArray($))
          return $;
        if (Symbol.iterator in Object($))
          return h($, P);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      };
    }(), A = function(h) {
      if (Array.isArray(h)) {
        for (var $ = 0, P = Array(h.length); $ < h.length; $++)
          P[$] = h[$];
        return P;
      } else
        return Array.from(h);
    }, N = 2147483647, C = 36, T = 1, v = 26, j = 38, I = 700, r = 72, i = 128, o = "-", l = /^xn--/, u = /[^\0-\x7E]/, m = /[\x2E\u3002\uFF0E\uFF61]/g, f = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    }, x = C - T, B = Math.floor, U = String.fromCharCode;
    function z(h) {
      throw new RangeError(f[h]);
    }
    function H(h, $) {
      for (var P = [], M = h.length; M--; )
        P[M] = $(h[M]);
      return P;
    }
    function w(h, $) {
      var P = h.split("@"), M = "";
      P.length > 1 && (M = P[0] + "@", h = P[1]), h = h.replace(m, ".");
      var D = h.split("."), Y = H(D, $).join(".");
      return M + Y;
    }
    function q(h) {
      for (var $ = [], P = 0, M = h.length; P < M; ) {
        var D = h.charCodeAt(P++);
        if (D >= 55296 && D <= 56319 && P < M) {
          var Y = h.charCodeAt(P++);
          (Y & 64512) == 56320 ? $.push(((D & 1023) << 10) + (Y & 1023) + 65536) : ($.push(D), P--);
        } else
          $.push(D);
      }
      return $;
    }
    var W = function(h) {
      return String.fromCodePoint.apply(String, A(h));
    }, J = function(h) {
      return h - 48 < 10 ? h - 22 : h - 65 < 26 ? h - 65 : h - 97 < 26 ? h - 97 : C;
    }, V = function(h, $) {
      return h + 22 + 75 * (h < 26) - (($ != 0) << 5);
    }, E = function(h, $, P) {
      var M = 0;
      for (
        h = P ? B(h / I) : h >> 1, h += B(h / $);
        /* no initialization */
        h > x * v >> 1;
        M += C
      )
        h = B(h / x);
      return B(M + (x + 1) * h / (h + j));
    }, F = function(h) {
      var $ = [], P = h.length, M = 0, D = i, Y = r, Z = h.lastIndexOf(o);
      Z < 0 && (Z = 0);
      for (var re = 0; re < Z; ++re)
        h.charCodeAt(re) >= 128 && z("not-basic"), $.push(h.charCodeAt(re));
      for (var he = Z > 0 ? Z + 1 : 0; he < P; ) {
        for (
          var oe = M, te = 1, ce = C;
          ;
          /* no condition */
          ce += C
        ) {
          he >= P && z("invalid-input");
          var de = J(h.charCodeAt(he++));
          (de >= C || de > B((N - M) / te)) && z("overflow"), M += de * te;
          var Q = ce <= Y ? T : ce >= Y + v ? v : ce - Y;
          if (de < Q)
            break;
          var pe = C - Q;
          te > B(N / pe) && z("overflow"), te *= pe;
        }
        var se = $.length + 1;
        Y = E(M - oe, se, oe == 0), B(M / se) > N - D && z("overflow"), D += B(M / se), M %= se, $.splice(M++, 0, D);
      }
      return String.fromCodePoint.apply(String, $);
    }, O = function(h) {
      var $ = [];
      h = q(h);
      var P = h.length, M = i, D = 0, Y = r, Z = !0, re = !1, he = void 0;
      try {
        for (var oe = h[Symbol.iterator](), te; !(Z = (te = oe.next()).done); Z = !0) {
          var ce = te.value;
          ce < 128 && $.push(U(ce));
        }
      } catch (Ut) {
        re = !0, he = Ut;
      } finally {
        try {
          !Z && oe.return && oe.return();
        } finally {
          if (re)
            throw he;
        }
      }
      var de = $.length, Q = de;
      for (de && $.push(o); Q < P; ) {
        var pe = N, se = !0, Re = !1, xt = void 0;
        try {
          for (var De = h[Symbol.iterator](), He; !(se = (He = De.next()).done); se = !0) {
            var it = He.value;
            it >= M && it < pe && (pe = it);
          }
        } catch (Ut) {
          Re = !0, xt = Ut;
        } finally {
          try {
            !se && De.return && De.return();
          } finally {
            if (Re)
              throw xt;
          }
        }
        var ct = Q + 1;
        pe - M > B((N - D) / ct) && z("overflow"), D += (pe - M) * ct, M = pe;
        var Ie = !0, Ge = !1, lt = void 0;
        try {
          for (var Ve = h[Symbol.iterator](), dr; !(Ie = (dr = Ve.next()).done); Ie = !0) {
            var $a = dr.value;
            if ($a < M && ++D > N && z("overflow"), $a == M) {
              for (
                var hr = D, pr = C;
                ;
                /* no condition */
                pr += C
              ) {
                var fr = pr <= Y ? T : pr >= Y + v ? v : pr - Y;
                if (hr < fr)
                  break;
                var ka = hr - fr, Ea = C - fr;
                $.push(U(V(fr + ka % Ea, 0))), hr = B(ka / Ea);
              }
              $.push(U(V(hr, 0))), Y = E(D, ct, Q == de), D = 0, ++Q;
            }
          }
        } catch (Ut) {
          Ge = !0, lt = Ut;
        } finally {
          try {
            !Ie && Ve.return && Ve.return();
          } finally {
            if (Ge)
              throw lt;
          }
        }
        ++D, ++M;
      }
      return $.join("");
    }, d = function(h) {
      return w(h, function($) {
        return l.test($) ? F($.slice(4).toLowerCase()) : $;
      });
    }, k = function(h) {
      return w(h, function($) {
        return u.test($) ? "xn--" + O($) : $;
      });
    }, R = {
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
        decode: q,
        encode: W
      },
      decode: F,
      encode: O,
      toASCII: k,
      toUnicode: d
    }, G = {};
    function K(h) {
      var $ = h.charCodeAt(0), P = void 0;
      return $ < 16 ? P = "%0" + $.toString(16).toUpperCase() : $ < 128 ? P = "%" + $.toString(16).toUpperCase() : $ < 2048 ? P = "%" + ($ >> 6 | 192).toString(16).toUpperCase() + "%" + ($ & 63 | 128).toString(16).toUpperCase() : P = "%" + ($ >> 12 | 224).toString(16).toUpperCase() + "%" + ($ >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + ($ & 63 | 128).toString(16).toUpperCase(), P;
    }
    function X(h) {
      for (var $ = "", P = 0, M = h.length; P < M; ) {
        var D = parseInt(h.substr(P + 1, 2), 16);
        if (D < 128)
          $ += String.fromCharCode(D), P += 3;
        else if (D >= 194 && D < 224) {
          if (M - P >= 6) {
            var Y = parseInt(h.substr(P + 4, 2), 16);
            $ += String.fromCharCode((D & 31) << 6 | Y & 63);
          } else
            $ += h.substr(P, 6);
          P += 6;
        } else if (D >= 224) {
          if (M - P >= 9) {
            var Z = parseInt(h.substr(P + 4, 2), 16), re = parseInt(h.substr(P + 7, 2), 16);
            $ += String.fromCharCode((D & 15) << 12 | (Z & 63) << 6 | re & 63);
          } else
            $ += h.substr(P, 9);
          P += 9;
        } else
          $ += h.substr(P, 3), P += 3;
      }
      return $;
    }
    function ee(h, $) {
      function P(M) {
        var D = X(M);
        return D.match($.UNRESERVED) ? D : M;
      }
      return h.scheme && (h.scheme = String(h.scheme).replace($.PCT_ENCODED, P).toLowerCase().replace($.NOT_SCHEME, "")), h.userinfo !== void 0 && (h.userinfo = String(h.userinfo).replace($.PCT_ENCODED, P).replace($.NOT_USERINFO, K).replace($.PCT_ENCODED, p)), h.host !== void 0 && (h.host = String(h.host).replace($.PCT_ENCODED, P).toLowerCase().replace($.NOT_HOST, K).replace($.PCT_ENCODED, p)), h.path !== void 0 && (h.path = String(h.path).replace($.PCT_ENCODED, P).replace(h.scheme ? $.NOT_PATH : $.NOT_PATH_NOSCHEME, K).replace($.PCT_ENCODED, p)), h.query !== void 0 && (h.query = String(h.query).replace($.PCT_ENCODED, P).replace($.NOT_QUERY, K).replace($.PCT_ENCODED, p)), h.fragment !== void 0 && (h.fragment = String(h.fragment).replace($.PCT_ENCODED, P).replace($.NOT_FRAGMENT, K).replace($.PCT_ENCODED, p)), h;
    }
    function ie(h) {
      return h.replace(/^0*(.*)/, "$1") || "0";
    }
    function xe(h, $) {
      var P = h.match($.IPV4ADDRESS) || [], M = L(P, 2), D = M[1];
      return D ? D.split(".").map(ie).join(".") : h;
    }
    function qe(h, $) {
      var P = h.match($.IPV6ADDRESS) || [], M = L(P, 3), D = M[1], Y = M[2];
      if (D) {
        for (var Z = D.toLowerCase().split("::").reverse(), re = L(Z, 2), he = re[0], oe = re[1], te = oe ? oe.split(":").map(ie) : [], ce = he.split(":").map(ie), de = $.IPV4ADDRESS.test(ce[ce.length - 1]), Q = de ? 7 : 8, pe = ce.length - Q, se = Array(Q), Re = 0; Re < Q; ++Re)
          se[Re] = te[Re] || ce[pe + Re] || "";
        de && (se[Q - 1] = xe(se[Q - 1], $));
        var xt = se.reduce(function(Ie, Ge, lt) {
          if (!Ge || Ge === "0") {
            var Ve = Ie[Ie.length - 1];
            Ve && Ve.index + Ve.length === lt ? Ve.length++ : Ie.push({ index: lt, length: 1 });
          }
          return Ie;
        }, []), De = xt.sort(function(Ie, Ge) {
          return Ge.length - Ie.length;
        })[0], He = void 0;
        if (De && De.length > 1) {
          var it = se.slice(0, De.index), ct = se.slice(De.index + De.length);
          He = it.join(":") + "::" + ct.join(":");
        } else
          He = se.join(":");
        return Y && (He += "%" + Y), He;
      } else
        return h;
    }
    var At = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i, Mt = "".match(/(){0}/)[1] === void 0;
    function je(h) {
      var $ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, P = {}, M = $.iri !== !1 ? S : g;
      $.reference === "suffix" && (h = ($.scheme ? $.scheme + ":" : "") + "//" + h);
      var D = h.match(At);
      if (D) {
        Mt ? (P.scheme = D[1], P.userinfo = D[3], P.host = D[4], P.port = parseInt(D[5], 10), P.path = D[6] || "", P.query = D[7], P.fragment = D[8], isNaN(P.port) && (P.port = D[5])) : (P.scheme = D[1] || void 0, P.userinfo = h.indexOf("@") !== -1 ? D[3] : void 0, P.host = h.indexOf("//") !== -1 ? D[4] : void 0, P.port = parseInt(D[5], 10), P.path = D[6] || "", P.query = h.indexOf("?") !== -1 ? D[7] : void 0, P.fragment = h.indexOf("#") !== -1 ? D[8] : void 0, isNaN(P.port) && (P.port = h.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? D[4] : void 0)), P.host && (P.host = qe(xe(P.host, M), M)), P.scheme === void 0 && P.userinfo === void 0 && P.host === void 0 && P.port === void 0 && !P.path && P.query === void 0 ? P.reference = "same-document" : P.scheme === void 0 ? P.reference = "relative" : P.fragment === void 0 ? P.reference = "absolute" : P.reference = "uri", $.reference && $.reference !== "suffix" && $.reference !== P.reference && (P.error = P.error || "URI is not a " + $.reference + " reference.");
        var Y = G[($.scheme || P.scheme || "").toLowerCase()];
        if (!$.unicodeSupport && (!Y || !Y.unicodeSupport)) {
          if (P.host && ($.domainHost || Y && Y.domainHost))
            try {
              P.host = R.toASCII(P.host.replace(M.PCT_ENCODED, X).toLowerCase());
            } catch (Z) {
              P.error = P.error || "Host's domain name can not be converted to ASCII via punycode: " + Z;
            }
          ee(P, g);
        } else
          ee(P, M);
        Y && Y.parse && Y.parse(P, $);
      } else
        P.error = P.error || "URI can not be parsed.";
      return P;
    }
    function Dt(h, $) {
      var P = $.iri !== !1 ? S : g, M = [];
      return h.userinfo !== void 0 && (M.push(h.userinfo), M.push("@")), h.host !== void 0 && M.push(qe(xe(String(h.host), P), P).replace(P.IPV6ADDRESS, function(D, Y, Z) {
        return "[" + Y + (Z ? "%25" + Z : "") + "]";
      })), (typeof h.port == "number" || typeof h.port == "string") && (M.push(":"), M.push(String(h.port))), M.length ? M.join("") : void 0;
    }
    var $t = /^\.\.?\//, kt = /^\/\.(\/|$)/, Et = /^\/\.\.(\/|$)/, zt = /^\/?(?:.|\n)*?(?=\/|$)/;
    function ze(h) {
      for (var $ = []; h.length; )
        if (h.match($t))
          h = h.replace($t, "");
        else if (h.match(kt))
          h = h.replace(kt, "/");
        else if (h.match(Et))
          h = h.replace(Et, "/"), $.pop();
        else if (h === "." || h === "..")
          h = "";
        else {
          var P = h.match(zt);
          if (P) {
            var M = P[0];
            h = h.slice(M.length), $.push(M);
          } else
            throw new Error("Unexpected dot segment condition");
        }
      return $.join("");
    }
    function Te(h) {
      var $ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, P = $.iri ? S : g, M = [], D = G[($.scheme || h.scheme || "").toLowerCase()];
      if (D && D.serialize && D.serialize(h, $), h.host && !P.IPV6ADDRESS.test(h.host) && ($.domainHost || D && D.domainHost))
        try {
          h.host = $.iri ? R.toUnicode(h.host) : R.toASCII(h.host.replace(P.PCT_ENCODED, X).toLowerCase());
        } catch (re) {
          h.error = h.error || "Host's domain name can not be converted to " + ($.iri ? "Unicode" : "ASCII") + " via punycode: " + re;
        }
      ee(h, P), $.reference !== "suffix" && h.scheme && (M.push(h.scheme), M.push(":"));
      var Y = Dt(h, $);
      if (Y !== void 0 && ($.reference !== "suffix" && M.push("//"), M.push(Y), h.path && h.path.charAt(0) !== "/" && M.push("/")), h.path !== void 0) {
        var Z = h.path;
        !$.absolutePath && (!D || !D.absolutePath) && (Z = ze(Z)), Y === void 0 && (Z = Z.replace(/^\/\//, "/%2F")), M.push(Z);
      }
      return h.query !== void 0 && (M.push("?"), M.push(h.query)), h.fragment !== void 0 && (M.push("#"), M.push(h.fragment)), M.join("");
    }
    function Pt(h, $) {
      var P = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, M = arguments[3], D = {};
      return M || (h = je(Te(h, P), P), $ = je(Te($, P), P)), P = P || {}, !P.tolerant && $.scheme ? (D.scheme = $.scheme, D.userinfo = $.userinfo, D.host = $.host, D.port = $.port, D.path = ze($.path || ""), D.query = $.query) : ($.userinfo !== void 0 || $.host !== void 0 || $.port !== void 0 ? (D.userinfo = $.userinfo, D.host = $.host, D.port = $.port, D.path = ze($.path || ""), D.query = $.query) : ($.path ? ($.path.charAt(0) === "/" ? D.path = ze($.path) : ((h.userinfo !== void 0 || h.host !== void 0 || h.port !== void 0) && !h.path ? D.path = "/" + $.path : h.path ? D.path = h.path.slice(0, h.path.lastIndexOf("/") + 1) + $.path : D.path = $.path, D.path = ze(D.path)), D.query = $.query) : (D.path = h.path, $.query !== void 0 ? D.query = $.query : D.query = h.query), D.userinfo = h.userinfo, D.host = h.host, D.port = h.port), D.scheme = h.scheme), D.fragment = $.fragment, D;
    }
    function Bt(h, $, P) {
      var M = _({ scheme: "null" }, P);
      return Te(Pt(je(h, M), je($, M), M, !0), M);
    }
    function ot(h, $) {
      return typeof h == "string" ? h = Te(je(h, $), $) : c(h) === "object" && (h = je(Te(h, $), $)), h;
    }
    function Vt(h, $, P) {
      return typeof h == "string" ? h = Te(je(h, P), P) : c(h) === "object" && (h = Te(h, P)), typeof $ == "string" ? $ = Te(je($, P), P) : c($) === "object" && ($ = Te($, P)), h === $;
    }
    function ur(h, $) {
      return h && h.toString().replace(!$ || !$.iri ? g.ESCAPE : S.ESCAPE, K);
    }
    function Le(h, $) {
      return h && h.toString().replace(!$ || !$.iri ? g.PCT_ENCODED : S.PCT_ENCODED, X);
    }
    var st = {
      scheme: "http",
      domainHost: !0,
      parse: function(h, $) {
        return h.host || (h.error = h.error || "HTTP URIs must have a host."), h;
      },
      serialize: function(h, $) {
        var P = String(h.scheme).toLowerCase() === "https";
        return (h.port === (P ? 443 : 80) || h.port === "") && (h.port = void 0), h.path || (h.path = "/"), h;
      }
    }, fa = {
      scheme: "https",
      domainHost: st.domainHost,
      parse: st.parse,
      serialize: st.serialize
    };
    function ma(h) {
      return typeof h.secure == "boolean" ? h.secure : String(h.scheme).toLowerCase() === "wss";
    }
    var Ft = {
      scheme: "ws",
      domainHost: !0,
      parse: function(h, $) {
        var P = h;
        return P.secure = ma(P), P.resourceName = (P.path || "/") + (P.query ? "?" + P.query : ""), P.path = void 0, P.query = void 0, P;
      },
      serialize: function(h, $) {
        if ((h.port === (ma(h) ? 443 : 80) || h.port === "") && (h.port = void 0), typeof h.secure == "boolean" && (h.scheme = h.secure ? "wss" : "ws", h.secure = void 0), h.resourceName) {
          var P = h.resourceName.split("?"), M = L(P, 2), D = M[0], Y = M[1];
          h.path = D && D !== "/" ? D : void 0, h.query = Y, h.resourceName = void 0;
        }
        return h.fragment = void 0, h;
      }
    }, ga = {
      scheme: "wss",
      domainHost: Ft.domainHost,
      parse: Ft.parse,
      serialize: Ft.serialize
    }, Yn = {}, ya = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]", Be = "[0-9A-Fa-f]", Qn = s(s("%[EFef]" + Be + "%" + Be + Be + "%" + Be + Be) + "|" + s("%[89A-Fa-f]" + Be + "%" + Be + Be) + "|" + s("%" + Be + Be)), Xn = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", eo = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", to = n(eo, '[\\"\\\\]'), ro = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]", ao = new RegExp(ya, "g"), St = new RegExp(Qn, "g"), no = new RegExp(n("[^]", Xn, "[\\.]", '[\\"]', to), "g"), ba = new RegExp(n("[^]", ya, ro), "g"), oo = ba;
    function Cr(h) {
      var $ = X(h);
      return $.match(ao) ? $ : h;
    }
    var _a = {
      scheme: "mailto",
      parse: function(h, $) {
        var P = h, M = P.to = P.path ? P.path.split(",") : [];
        if (P.path = void 0, P.query) {
          for (var D = !1, Y = {}, Z = P.query.split("&"), re = 0, he = Z.length; re < he; ++re) {
            var oe = Z[re].split("=");
            switch (oe[0]) {
              case "to":
                for (var te = oe[1].split(","), ce = 0, de = te.length; ce < de; ++ce)
                  M.push(te[ce]);
                break;
              case "subject":
                P.subject = Le(oe[1], $);
                break;
              case "body":
                P.body = Le(oe[1], $);
                break;
              default:
                D = !0, Y[Le(oe[0], $)] = Le(oe[1], $);
                break;
            }
          }
          D && (P.headers = Y);
        }
        P.query = void 0;
        for (var Q = 0, pe = M.length; Q < pe; ++Q) {
          var se = M[Q].split("@");
          if (se[0] = Le(se[0]), $.unicodeSupport)
            se[1] = Le(se[1], $).toLowerCase();
          else
            try {
              se[1] = R.toASCII(Le(se[1], $).toLowerCase());
            } catch (Re) {
              P.error = P.error || "Email address's domain name can not be converted to ASCII via punycode: " + Re;
            }
          M[Q] = se.join("@");
        }
        return P;
      },
      serialize: function(h, $) {
        var P = h, M = b(h.to);
        if (M) {
          for (var D = 0, Y = M.length; D < Y; ++D) {
            var Z = String(M[D]), re = Z.lastIndexOf("@"), he = Z.slice(0, re).replace(St, Cr).replace(St, p).replace(no, K), oe = Z.slice(re + 1);
            try {
              oe = $.iri ? R.toUnicode(oe) : R.toASCII(Le(oe, $).toLowerCase());
            } catch (Q) {
              P.error = P.error || "Email address's domain name can not be converted to " + ($.iri ? "Unicode" : "ASCII") + " via punycode: " + Q;
            }
            M[D] = he + "@" + oe;
          }
          P.path = M.join(",");
        }
        var te = h.headers = h.headers || {};
        h.subject && (te.subject = h.subject), h.body && (te.body = h.body);
        var ce = [];
        for (var de in te)
          te[de] !== Yn[de] && ce.push(de.replace(St, Cr).replace(St, p).replace(ba, K) + "=" + te[de].replace(St, Cr).replace(St, p).replace(oo, K));
        return ce.length && (P.query = ce.join("&")), P;
      }
    }, so = /^([^\:]+)\:(.*)/, wa = {
      scheme: "urn",
      parse: function(h, $) {
        var P = h.path && h.path.match(so), M = h;
        if (P) {
          var D = $.scheme || M.scheme || "urn", Y = P[1].toLowerCase(), Z = P[2], re = D + ":" + ($.nid || Y), he = G[re];
          M.nid = Y, M.nss = Z, M.path = void 0, he && (M = he.parse(M, $));
        } else
          M.error = M.error || "URN can not be parsed.";
        return M;
      },
      serialize: function(h, $) {
        var P = $.scheme || h.scheme || "urn", M = h.nid, D = P + ":" + ($.nid || M), Y = G[D];
        Y && (h = Y.serialize(h, $));
        var Z = h, re = h.nss;
        return Z.path = (M || $.nid) + ":" + re, Z;
      }
    }, io = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/, va = {
      scheme: "urn:uuid",
      parse: function(h, $) {
        var P = h;
        return P.uuid = P.nss, P.nss = void 0, !$.tolerant && (!P.uuid || !P.uuid.match(io)) && (P.error = P.error || "UUID is not valid."), P;
      },
      serialize: function(h, $) {
        var P = h;
        return P.nss = (h.uuid || "").toLowerCase(), P;
      }
    };
    G[st.scheme] = st, G[fa.scheme] = fa, G[Ft.scheme] = Ft, G[ga.scheme] = ga, G[_a.scheme] = _a, G[wa.scheme] = wa, G[va.scheme] = va, a.SCHEMES = G, a.pctEncChar = K, a.pctDecChars = X, a.parse = je, a.removeDotSegments = ze, a.serialize = Te, a.resolveComponents = Pt, a.resolve = Bt, a.normalize = ot, a.equal = Vt, a.escapeComponent = ur, a.unescapeComponent = Le, Object.defineProperty(a, "__esModule", { value: !0 });
  });
})(Eo, Eo.exports);
var _h = Eo.exports;
Object.defineProperty(Ho, "__esModule", { value: !0 });
const il = _h;
il.code = 'require("ajv/dist/runtime/uri").default';
Ho.default = il;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = er;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var a = we;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return a._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return a.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return a.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return a.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return a.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return a.CodeGen;
  } });
  const n = Ja, s = Za, c = Fr, p = wt, b = we, _ = tt, y = Wa, g = $e, S = bh, L = Ho, A = (V, E) => new RegExp(V, E);
  A.code = "new RegExp";
  const N = ["removeAdditional", "useDefaults", "coerceTypes"], C = /* @__PURE__ */ new Set([
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
  }, v = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, j = 200;
  function I(V) {
    var E, F, O, d, k, R, G, K, X, ee, ie, xe, qe, At, Mt, je, Dt, $t, kt, Et, zt, ze, Te, Pt, Bt;
    const ot = V.strict, Vt = (E = V.code) === null || E === void 0 ? void 0 : E.optimize, ur = Vt === !0 || Vt === void 0 ? 1 : Vt || 0, Le = (O = (F = V.code) === null || F === void 0 ? void 0 : F.regExp) !== null && O !== void 0 ? O : A, st = (d = V.uriResolver) !== null && d !== void 0 ? d : L.default;
    return {
      strictSchema: (R = (k = V.strictSchema) !== null && k !== void 0 ? k : ot) !== null && R !== void 0 ? R : !0,
      strictNumbers: (K = (G = V.strictNumbers) !== null && G !== void 0 ? G : ot) !== null && K !== void 0 ? K : !0,
      strictTypes: (ee = (X = V.strictTypes) !== null && X !== void 0 ? X : ot) !== null && ee !== void 0 ? ee : "log",
      strictTuples: (xe = (ie = V.strictTuples) !== null && ie !== void 0 ? ie : ot) !== null && xe !== void 0 ? xe : "log",
      strictRequired: (At = (qe = V.strictRequired) !== null && qe !== void 0 ? qe : ot) !== null && At !== void 0 ? At : !1,
      code: V.code ? { ...V.code, optimize: ur, regExp: Le } : { optimize: ur, regExp: Le },
      loopRequired: (Mt = V.loopRequired) !== null && Mt !== void 0 ? Mt : j,
      loopEnum: (je = V.loopEnum) !== null && je !== void 0 ? je : j,
      meta: (Dt = V.meta) !== null && Dt !== void 0 ? Dt : !0,
      messages: ($t = V.messages) !== null && $t !== void 0 ? $t : !0,
      inlineRefs: (kt = V.inlineRefs) !== null && kt !== void 0 ? kt : !0,
      schemaId: (Et = V.schemaId) !== null && Et !== void 0 ? Et : "$id",
      addUsedSchema: (zt = V.addUsedSchema) !== null && zt !== void 0 ? zt : !0,
      validateSchema: (ze = V.validateSchema) !== null && ze !== void 0 ? ze : !0,
      validateFormats: (Te = V.validateFormats) !== null && Te !== void 0 ? Te : !0,
      unicodeRegExp: (Pt = V.unicodeRegExp) !== null && Pt !== void 0 ? Pt : !0,
      int32range: (Bt = V.int32range) !== null && Bt !== void 0 ? Bt : !0,
      uriResolver: st
    };
  }
  class r {
    constructor(E = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), E = this.opts = { ...E, ...I(E) };
      const { es5: F, lines: O } = this.opts.code;
      this.scope = new b.ValueScope({ scope: {}, prefixes: C, es5: F, lines: O }), this.logger = B(E.logger);
      const d = E.validateFormats;
      E.validateFormats = !1, this.RULES = (0, c.getRules)(), i.call(this, T, E, "NOT SUPPORTED"), i.call(this, v, E, "DEPRECATED", "warn"), this._metaOpts = f.call(this), E.formats && u.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), E.keywords && m.call(this, E.keywords), typeof E.meta == "object" && this.addMetaSchema(E.meta), l.call(this), E.validateFormats = d;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: E, meta: F, schemaId: O } = this.opts;
      let d = S;
      O === "id" && (d = { ...S }, d.id = d.$id, delete d.$id), F && E && this.addMetaSchema(d, d[O], !1);
    }
    defaultMeta() {
      const { meta: E, schemaId: F } = this.opts;
      return this.opts.defaultMeta = typeof E == "object" ? E[F] || E : void 0;
    }
    validate(E, F) {
      let O;
      if (typeof E == "string") {
        if (O = this.getSchema(E), !O)
          throw new Error(`no schema with key or ref "${E}"`);
      } else
        O = this.compile(E);
      const d = O(F);
      return "$async" in O || (this.errors = O.errors), d;
    }
    compile(E, F) {
      const O = this._addSchema(E, F);
      return O.validate || this._compileSchemaEnv(O);
    }
    compileAsync(E, F) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: O } = this.opts;
      return d.call(this, E, F);
      async function d(ee, ie) {
        await k.call(this, ee.$schema);
        const xe = this._addSchema(ee, ie);
        return xe.validate || R.call(this, xe);
      }
      async function k(ee) {
        ee && !this.getSchema(ee) && await d.call(this, { $ref: ee }, !0);
      }
      async function R(ee) {
        try {
          return this._compileSchemaEnv(ee);
        } catch (ie) {
          if (!(ie instanceof s.default))
            throw ie;
          return G.call(this, ie), await K.call(this, ie.missingSchema), R.call(this, ee);
        }
      }
      function G({ missingSchema: ee, missingRef: ie }) {
        if (this.refs[ee])
          throw new Error(`AnySchema ${ee} is loaded but ${ie} cannot be resolved`);
      }
      async function K(ee) {
        const ie = await X.call(this, ee);
        this.refs[ee] || await k.call(this, ie.$schema), this.refs[ee] || this.addSchema(ie, ee, F);
      }
      async function X(ee) {
        const ie = this._loading[ee];
        if (ie)
          return ie;
        try {
          return await (this._loading[ee] = O(ee));
        } finally {
          delete this._loading[ee];
        }
      }
    }
    // Adds schema to the instance
    addSchema(E, F, O, d = this.opts.validateSchema) {
      if (Array.isArray(E)) {
        for (const R of E)
          this.addSchema(R, void 0, O, d);
        return this;
      }
      let k;
      if (typeof E == "object") {
        const { schemaId: R } = this.opts;
        if (k = E[R], k !== void 0 && typeof k != "string")
          throw new Error(`schema ${R} must be string`);
      }
      return F = (0, _.normalizeId)(F || k), this._checkUnique(F), this.schemas[F] = this._addSchema(E, O, F, d, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(E, F, O = this.opts.validateSchema) {
      return this.addSchema(E, F, !0, O), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(E, F) {
      if (typeof E == "boolean")
        return !0;
      let O;
      if (O = E.$schema, O !== void 0 && typeof O != "string")
        throw new Error("$schema must be a string");
      if (O = O || this.opts.defaultMeta || this.defaultMeta(), !O)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const d = this.validate(O, E);
      if (!d && F) {
        const k = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(k);
        else
          throw new Error(k);
      }
      return d;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(E) {
      let F;
      for (; typeof (F = o.call(this, E)) == "string"; )
        E = F;
      if (F === void 0) {
        const { schemaId: O } = this.opts, d = new p.SchemaEnv({ schema: {}, schemaId: O });
        if (F = p.resolveSchema.call(this, d, E), !F)
          return;
        this.refs[E] = F;
      }
      return F.validate || this._compileSchemaEnv(F);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(E) {
      if (E instanceof RegExp)
        return this._removeAllSchemas(this.schemas, E), this._removeAllSchemas(this.refs, E), this;
      switch (typeof E) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const F = o.call(this, E);
          return typeof F == "object" && this._cache.delete(F.schema), delete this.schemas[E], delete this.refs[E], this;
        }
        case "object": {
          const F = E;
          this._cache.delete(F);
          let O = E[this.opts.schemaId];
          return O && (O = (0, _.normalizeId)(O), delete this.schemas[O], delete this.refs[O]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(E) {
      for (const F of E)
        this.addKeyword(F);
      return this;
    }
    addKeyword(E, F) {
      let O;
      if (typeof E == "string")
        O = E, typeof F == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), F.keyword = O);
      else if (typeof E == "object" && F === void 0) {
        if (F = E, O = F.keyword, Array.isArray(O) && !O.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (z.call(this, O, F), !F)
        return (0, g.eachItem)(O, (k) => H.call(this, k)), this;
      q.call(this, F);
      const d = {
        ...F,
        type: (0, y.getJSONTypes)(F.type),
        schemaType: (0, y.getJSONTypes)(F.schemaType)
      };
      return (0, g.eachItem)(O, d.type.length === 0 ? (k) => H.call(this, k, d) : (k) => d.type.forEach((R) => H.call(this, k, d, R))), this;
    }
    getKeyword(E) {
      const F = this.RULES.all[E];
      return typeof F == "object" ? F.definition : !!F;
    }
    // Remove keyword
    removeKeyword(E) {
      const { RULES: F } = this;
      delete F.keywords[E], delete F.all[E];
      for (const O of F.rules) {
        const d = O.rules.findIndex((k) => k.keyword === E);
        d >= 0 && O.rules.splice(d, 1);
      }
      return this;
    }
    // Add format
    addFormat(E, F) {
      return typeof F == "string" && (F = new RegExp(F)), this.formats[E] = F, this;
    }
    errorsText(E = this.errors, { separator: F = ", ", dataVar: O = "data" } = {}) {
      return !E || E.length === 0 ? "No errors" : E.map((d) => `${O}${d.instancePath} ${d.message}`).reduce((d, k) => d + F + k);
    }
    $dataMetaSchema(E, F) {
      const O = this.RULES.all;
      E = JSON.parse(JSON.stringify(E));
      for (const d of F) {
        const k = d.split("/").slice(1);
        let R = E;
        for (const G of k)
          R = R[G];
        for (const G in O) {
          const K = O[G];
          if (typeof K != "object")
            continue;
          const { $data: X } = K.definition, ee = R[G];
          X && ee && (R[G] = J(ee));
        }
      }
      return E;
    }
    _removeAllSchemas(E, F) {
      for (const O in E) {
        const d = E[O];
        (!F || F.test(O)) && (typeof d == "string" ? delete E[O] : d && !d.meta && (this._cache.delete(d.schema), delete E[O]));
      }
    }
    _addSchema(E, F, O, d = this.opts.validateSchema, k = this.opts.addUsedSchema) {
      let R;
      const { schemaId: G } = this.opts;
      if (typeof E == "object")
        R = E[G];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof E != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let K = this._cache.get(E);
      if (K !== void 0)
        return K;
      O = (0, _.normalizeId)(R || O);
      const X = _.getSchemaRefs.call(this, E, O);
      return K = new p.SchemaEnv({ schema: E, schemaId: G, meta: F, baseId: O, localRefs: X }), this._cache.set(K.schema, K), k && !O.startsWith("#") && (O && this._checkUnique(O), this.refs[O] = K), d && this.validateSchema(E, !0), K;
    }
    _checkUnique(E) {
      if (this.schemas[E] || this.refs[E])
        throw new Error(`schema with key or id "${E}" already exists`);
    }
    _compileSchemaEnv(E) {
      if (E.meta ? this._compileMetaSchema(E) : p.compileSchema.call(this, E), !E.validate)
        throw new Error("ajv implementation error");
      return E.validate;
    }
    _compileMetaSchema(E) {
      const F = this.opts;
      this.opts = this._metaOpts;
      try {
        p.compileSchema.call(this, E);
      } finally {
        this.opts = F;
      }
    }
  }
  e.default = r, r.ValidationError = n.default, r.MissingRefError = s.default;
  function i(V, E, F, O = "error") {
    for (const d in V) {
      const k = d;
      k in E && this.logger[O](`${F}: option ${d}. ${V[k]}`);
    }
  }
  function o(V) {
    return V = (0, _.normalizeId)(V), this.schemas[V] || this.refs[V];
  }
  function l() {
    const V = this.opts.schemas;
    if (V)
      if (Array.isArray(V))
        this.addSchema(V);
      else
        for (const E in V)
          this.addSchema(V[E], E);
  }
  function u() {
    for (const V in this.opts.formats) {
      const E = this.opts.formats[V];
      E && this.addFormat(V, E);
    }
  }
  function m(V) {
    if (Array.isArray(V)) {
      this.addVocabulary(V);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const E in V) {
      const F = V[E];
      F.keyword || (F.keyword = E), this.addKeyword(F);
    }
  }
  function f() {
    const V = { ...this.opts };
    for (const E of N)
      delete V[E];
    return V;
  }
  const x = { log() {
  }, warn() {
  }, error() {
  } };
  function B(V) {
    if (V === !1)
      return x;
    if (V === void 0)
      return console;
    if (V.log && V.warn && V.error)
      return V;
    throw new Error("logger must implement log, warn and error methods");
  }
  const U = /^[a-z_$][a-z0-9_$:-]*$/i;
  function z(V, E) {
    const { RULES: F } = this;
    if ((0, g.eachItem)(V, (O) => {
      if (F.keywords[O])
        throw new Error(`Keyword ${O} is already defined`);
      if (!U.test(O))
        throw new Error(`Keyword ${O} has invalid name`);
    }), !!E && E.$data && !("code" in E || "validate" in E))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function H(V, E, F) {
    var O;
    const d = E == null ? void 0 : E.post;
    if (F && d)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: k } = this;
    let R = d ? k.post : k.rules.find(({ type: K }) => K === F);
    if (R || (R = { type: F, rules: [] }, k.rules.push(R)), k.keywords[V] = !0, !E)
      return;
    const G = {
      keyword: V,
      definition: {
        ...E,
        type: (0, y.getJSONTypes)(E.type),
        schemaType: (0, y.getJSONTypes)(E.schemaType)
      }
    };
    E.before ? w.call(this, R, G, E.before) : R.rules.push(G), k.all[V] = G, (O = E.implements) === null || O === void 0 || O.forEach((K) => this.addKeyword(K));
  }
  function w(V, E, F) {
    const O = V.rules.findIndex((d) => d.keyword === F);
    O >= 0 ? V.rules.splice(O, 0, E) : (V.rules.push(E), this.logger.warn(`rule ${F} is not defined`));
  }
  function q(V) {
    let { metaSchema: E } = V;
    E !== void 0 && (V.$data && this.opts.$data && (E = J(E)), V.validateSchema = this.compile(E, !0));
  }
  const W = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function J(V) {
    return { anyOf: [V, W] };
  }
})(Ac);
var Go = {}, Ko = {}, Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
const wh = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Wo.default = wh;
var Ur = {};
Object.defineProperty(Ur, "__esModule", { value: !0 });
Ur.callRef = Ur.getValidate = void 0;
const vh = Za, Ei = be, bt = we, Kr = cr, Pi = wt, an = $e, $h = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: a, it: n } = e, { baseId: s, schemaEnv: c, validateName: p, opts: b, self: _ } = n, { root: y } = c;
    if ((a === "#" || a === "#/") && s === y.baseId)
      return S();
    const g = Pi.resolveRef.call(_, y, s, a);
    if (g === void 0)
      throw new vh.default(n.opts.uriResolver, s, a);
    if (g instanceof Pi.SchemaEnv)
      return L(g);
    return A(g);
    function S() {
      if (c === y)
        return bn(e, p, c, c.$async);
      const N = t.scopeValue("root", { ref: y });
      return bn(e, (0, bt._)`${N}.validate`, y, y.$async);
    }
    function L(N) {
      const C = cl(e, N);
      bn(e, C, N, N.$async);
    }
    function A(N) {
      const C = t.scopeValue("schema", b.code.source === !0 ? { ref: N, code: (0, bt.stringify)(N) } : { ref: N }), T = t.name("valid"), v = e.subschema({
        schema: N,
        dataTypes: [],
        schemaPath: bt.nil,
        topSchemaRef: C,
        errSchemaPath: a
      }, T);
      e.mergeEvaluated(v), e.ok(T);
    }
  }
};
function cl(e, t) {
  const { gen: a } = e;
  return t.validate ? a.scopeValue("validate", { ref: t.validate }) : (0, bt._)`${a.scopeValue("wrapper", { ref: t })}.validate`;
}
Ur.getValidate = cl;
function bn(e, t, a, n) {
  const { gen: s, it: c } = e, { allErrors: p, schemaEnv: b, opts: _ } = c, y = _.passContext ? Kr.default.this : bt.nil;
  n ? g() : S();
  function g() {
    if (!b.$async)
      throw new Error("async schema referenced by sync schema");
    const N = s.let("valid");
    s.try(() => {
      s.code((0, bt._)`await ${(0, Ei.callValidateCode)(e, t, y)}`), A(t), p || s.assign(N, !0);
    }, (C) => {
      s.if((0, bt._)`!(${C} instanceof ${c.ValidationError})`, () => s.throw(C)), L(C), p || s.assign(N, !1);
    }), e.ok(N);
  }
  function S() {
    e.result((0, Ei.callValidateCode)(e, t, y), () => A(t), () => L(t));
  }
  function L(N) {
    const C = (0, bt._)`${N}.errors`;
    s.assign(Kr.default.vErrors, (0, bt._)`${Kr.default.vErrors} === null ? ${C} : ${Kr.default.vErrors}.concat(${C})`), s.assign(Kr.default.errors, (0, bt._)`${Kr.default.vErrors}.length`);
  }
  function A(N) {
    var C;
    if (!c.opts.unevaluated)
      return;
    const T = (C = a == null ? void 0 : a.validate) === null || C === void 0 ? void 0 : C.evaluated;
    if (c.props !== !0)
      if (T && !T.dynamicProps)
        T.props !== void 0 && (c.props = an.mergeEvaluated.props(s, T.props, c.props));
      else {
        const v = s.var("props", (0, bt._)`${N}.evaluated.props`);
        c.props = an.mergeEvaluated.props(s, v, c.props, bt.Name);
      }
    if (c.items !== !0)
      if (T && !T.dynamicItems)
        T.items !== void 0 && (c.items = an.mergeEvaluated.items(s, T.items, c.items));
      else {
        const v = s.var("items", (0, bt._)`${N}.evaluated.items`);
        c.items = an.mergeEvaluated.items(s, v, c.items, bt.Name);
      }
  }
}
Ur.callRef = bn;
Ur.default = $h;
Object.defineProperty(Ko, "__esModule", { value: !0 });
const kh = Wo, Eh = Ur, Ph = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  kh.default,
  Eh.default
];
Ko.default = Ph;
var Jo = {}, Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
const Tn = we, wr = Tn.operators, jn = {
  maximum: { okStr: "<=", ok: wr.LTE, fail: wr.GT },
  minimum: { okStr: ">=", ok: wr.GTE, fail: wr.LT },
  exclusiveMaximum: { okStr: "<", ok: wr.LT, fail: wr.GTE },
  exclusiveMinimum: { okStr: ">", ok: wr.GT, fail: wr.LTE }
}, Sh = {
  message: ({ keyword: e, schemaCode: t }) => (0, Tn.str)`must be ${jn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Tn._)`{comparison: ${jn[e].okStr}, limit: ${t}}`
}, xh = {
  keyword: Object.keys(jn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Sh,
  code(e) {
    const { keyword: t, data: a, schemaCode: n } = e;
    e.fail$data((0, Tn._)`${a} ${jn[t].fail} ${n} || isNaN(${a})`);
  }
};
Zo.default = xh;
var Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
const Ra = we, Th = {
  message: ({ schemaCode: e }) => (0, Ra.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Ra._)`{multipleOf: ${e}}`
}, jh = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Th,
  code(e) {
    const { gen: t, data: a, schemaCode: n, it: s } = e, c = s.opts.multipleOfPrecision, p = t.let("res"), b = c ? (0, Ra._)`Math.abs(Math.round(${p}) - ${p}) > 1e-${c}` : (0, Ra._)`${p} !== parseInt(${p})`;
    e.fail$data((0, Ra._)`(${n} === 0 || (${p} = ${a}/${n}, ${b}))`);
  }
};
Yo.default = jh;
var Qo = {}, Xo = {};
Object.defineProperty(Xo, "__esModule", { value: !0 });
function ll(e) {
  const t = e.length;
  let a = 0, n = 0, s;
  for (; n < t; )
    a++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return a;
}
Xo.default = ll;
ll.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Qo, "__esModule", { value: !0 });
const Mr = we, Ch = $e, Oh = Xo, Nh = {
  message({ keyword: e, schemaCode: t }) {
    const a = e === "maxLength" ? "more" : "fewer";
    return (0, Mr.str)`must NOT have ${a} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Mr._)`{limit: ${e}}`
}, Lh = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Nh,
  code(e) {
    const { keyword: t, data: a, schemaCode: n, it: s } = e, c = t === "maxLength" ? Mr.operators.GT : Mr.operators.LT, p = s.opts.unicode === !1 ? (0, Mr._)`${a}.length` : (0, Mr._)`${(0, Ch.useFunc)(e.gen, Oh.default)}(${a})`;
    e.fail$data((0, Mr._)`${p} ${c} ${n}`);
  }
};
Qo.default = Lh;
var es = {};
Object.defineProperty(es, "__esModule", { value: !0 });
const Rh = be, Cn = we, Ih = {
  message: ({ schemaCode: e }) => (0, Cn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Cn._)`{pattern: ${e}}`
}, Ah = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Ih,
  code(e) {
    const { data: t, $data: a, schema: n, schemaCode: s, it: c } = e, p = c.opts.unicodeRegExp ? "u" : "", b = a ? (0, Cn._)`(new RegExp(${s}, ${p}))` : (0, Rh.usePattern)(e, n);
    e.fail$data((0, Cn._)`!${b}.test(${t})`);
  }
};
es.default = Ah;
var ts = {};
Object.defineProperty(ts, "__esModule", { value: !0 });
const Ia = we, Mh = {
  message({ keyword: e, schemaCode: t }) {
    const a = e === "maxProperties" ? "more" : "fewer";
    return (0, Ia.str)`must NOT have ${a} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Ia._)`{limit: ${e}}`
}, Dh = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Mh,
  code(e) {
    const { keyword: t, data: a, schemaCode: n } = e, s = t === "maxProperties" ? Ia.operators.GT : Ia.operators.LT;
    e.fail$data((0, Ia._)`Object.keys(${a}).length ${s} ${n}`);
  }
};
ts.default = Dh;
var rs = {};
Object.defineProperty(rs, "__esModule", { value: !0 });
const Sa = be, Aa = we, zh = $e, Bh = {
  message: ({ params: { missingProperty: e } }) => (0, Aa.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Aa._)`{missingProperty: ${e}}`
}, Vh = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Bh,
  code(e) {
    const { gen: t, schema: a, schemaCode: n, data: s, $data: c, it: p } = e, { opts: b } = p;
    if (!c && a.length === 0)
      return;
    const _ = a.length >= b.loopRequired;
    if (p.allErrors ? y() : g(), b.strictRequired) {
      const A = e.parentSchema.properties, { definedProperties: N } = e.it;
      for (const C of a)
        if ((A == null ? void 0 : A[C]) === void 0 && !N.has(C)) {
          const T = p.schemaEnv.baseId + p.errSchemaPath, v = `required property "${C}" is not defined at "${T}" (strictRequired)`;
          (0, zh.checkStrictMode)(p, v, p.opts.strictRequired);
        }
    }
    function y() {
      if (_ || c)
        e.block$data(Aa.nil, S);
      else
        for (const A of a)
          (0, Sa.checkReportMissingProp)(e, A);
    }
    function g() {
      const A = t.let("missing");
      if (_ || c) {
        const N = t.let("valid", !0);
        e.block$data(N, () => L(A, N)), e.ok(N);
      } else
        t.if((0, Sa.checkMissingProp)(e, a, A)), (0, Sa.reportMissingProp)(e, A), t.else();
    }
    function S() {
      t.forOf("prop", n, (A) => {
        e.setParams({ missingProperty: A }), t.if((0, Sa.noPropertyInData)(t, s, A, b.ownProperties), () => e.error());
      });
    }
    function L(A, N) {
      e.setParams({ missingProperty: A }), t.forOf(A, n, () => {
        t.assign(N, (0, Sa.propertyInData)(t, s, A, b.ownProperties)), t.if((0, Aa.not)(N), () => {
          e.error(), t.break();
        });
      }, Aa.nil);
    }
  }
};
rs.default = Vh;
var as = {};
Object.defineProperty(as, "__esModule", { value: !0 });
const Ma = we, Fh = {
  message({ keyword: e, schemaCode: t }) {
    const a = e === "maxItems" ? "more" : "fewer";
    return (0, Ma.str)`must NOT have ${a} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Ma._)`{limit: ${e}}`
}, Uh = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Fh,
  code(e) {
    const { keyword: t, data: a, schemaCode: n } = e, s = t === "maxItems" ? Ma.operators.GT : Ma.operators.LT;
    e.fail$data((0, Ma._)`${a}.length ${s} ${n}`);
  }
};
as.default = Uh;
var ns = {}, Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const ul = qc;
ul.code = 'require("ajv/dist/runtime/equal").default';
Ya.default = ul;
Object.defineProperty(ns, "__esModule", { value: !0 });
const ho = Wa, Xe = we, qh = $e, Hh = Ya, Gh = {
  message: ({ params: { i: e, j: t } }) => (0, Xe.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Xe._)`{i: ${e}, j: ${t}}`
}, Kh = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Gh,
  code(e) {
    const { gen: t, data: a, $data: n, schema: s, parentSchema: c, schemaCode: p, it: b } = e;
    if (!n && !s)
      return;
    const _ = t.let("valid"), y = c.items ? (0, ho.getSchemaTypes)(c.items) : [];
    e.block$data(_, g, (0, Xe._)`${p} === false`), e.ok(_);
    function g() {
      const N = t.let("i", (0, Xe._)`${a}.length`), C = t.let("j");
      e.setParams({ i: N, j: C }), t.assign(_, !0), t.if((0, Xe._)`${N} > 1`, () => (S() ? L : A)(N, C));
    }
    function S() {
      return y.length > 0 && !y.some((N) => N === "object" || N === "array");
    }
    function L(N, C) {
      const T = t.name("item"), v = (0, ho.checkDataTypes)(y, T, b.opts.strictNumbers, ho.DataType.Wrong), j = t.const("indices", (0, Xe._)`{}`);
      t.for((0, Xe._)`;${N}--;`, () => {
        t.let(T, (0, Xe._)`${a}[${N}]`), t.if(v, (0, Xe._)`continue`), y.length > 1 && t.if((0, Xe._)`typeof ${T} == "string"`, (0, Xe._)`${T} += "_"`), t.if((0, Xe._)`typeof ${j}[${T}] == "number"`, () => {
          t.assign(C, (0, Xe._)`${j}[${T}]`), e.error(), t.assign(_, !1).break();
        }).code((0, Xe._)`${j}[${T}] = ${N}`);
      });
    }
    function A(N, C) {
      const T = (0, qh.useFunc)(t, Hh.default), v = t.name("outer");
      t.label(v).for((0, Xe._)`;${N}--;`, () => t.for((0, Xe._)`${C} = ${N}; ${C}--;`, () => t.if((0, Xe._)`${T}(${a}[${N}], ${a}[${C}])`, () => {
        e.error(), t.assign(_, !1).break(v);
      })));
    }
  }
};
ns.default = Kh;
var os = {};
Object.defineProperty(os, "__esModule", { value: !0 });
const Po = we, Wh = $e, Jh = Ya, Zh = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Po._)`{allowedValue: ${e}}`
}, Yh = {
  keyword: "const",
  $data: !0,
  error: Zh,
  code(e) {
    const { gen: t, data: a, $data: n, schemaCode: s, schema: c } = e;
    n || c && typeof c == "object" ? e.fail$data((0, Po._)`!${(0, Wh.useFunc)(t, Jh.default)}(${a}, ${s})`) : e.fail((0, Po._)`${c} !== ${a}`);
  }
};
os.default = Yh;
var ss = {};
Object.defineProperty(ss, "__esModule", { value: !0 });
const Oa = we, Qh = $e, Xh = Ya, ep = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Oa._)`{allowedValues: ${e}}`
}, tp = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: ep,
  code(e) {
    const { gen: t, data: a, $data: n, schema: s, schemaCode: c, it: p } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const b = s.length >= p.opts.loopEnum;
    let _;
    const y = () => _ ?? (_ = (0, Qh.useFunc)(t, Xh.default));
    let g;
    if (b || n)
      g = t.let("valid"), e.block$data(g, S);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const A = t.const("vSchema", c);
      g = (0, Oa.or)(...s.map((N, C) => L(A, C)));
    }
    e.pass(g);
    function S() {
      t.assign(g, !1), t.forOf("v", c, (A) => t.if((0, Oa._)`${y()}(${a}, ${A})`, () => t.assign(g, !0).break()));
    }
    function L(A, N) {
      const C = s[N];
      return typeof C == "object" && C !== null ? (0, Oa._)`${y()}(${a}, ${A}[${N}])` : (0, Oa._)`${a} === ${C}`;
    }
  }
};
ss.default = tp;
Object.defineProperty(Jo, "__esModule", { value: !0 });
const rp = Zo, ap = Yo, np = Qo, op = es, sp = ts, ip = rs, cp = as, lp = ns, up = os, dp = ss, hp = [
  // number
  rp.default,
  ap.default,
  // string
  np.default,
  op.default,
  // object
  sp.default,
  ip.default,
  // array
  cp.default,
  lp.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  up.default,
  dp.default
];
Jo.default = hp;
var is = {}, ua = {};
Object.defineProperty(ua, "__esModule", { value: !0 });
ua.validateAdditionalItems = void 0;
const Dr = we, So = $e, pp = {
  message: ({ params: { len: e } }) => (0, Dr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Dr._)`{limit: ${e}}`
}, fp = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: pp,
  code(e) {
    const { parentSchema: t, it: a } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, So.checkStrictMode)(a, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    dl(e, n);
  }
};
function dl(e, t) {
  const { gen: a, schema: n, data: s, keyword: c, it: p } = e;
  p.items = !0;
  const b = a.const("len", (0, Dr._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Dr._)`${b} <= ${t.length}`);
  else if (typeof n == "object" && !(0, So.alwaysValidSchema)(p, n)) {
    const y = a.var("valid", (0, Dr._)`${b} <= ${t.length}`);
    a.if((0, Dr.not)(y), () => _(y)), e.ok(y);
  }
  function _(y) {
    a.forRange("i", t.length, b, (g) => {
      e.subschema({ keyword: c, dataProp: g, dataPropType: So.Type.Num }, y), p.allErrors || a.if((0, Dr.not)(y), () => a.break());
    });
  }
}
ua.validateAdditionalItems = dl;
ua.default = fp;
var cs = {}, da = {};
Object.defineProperty(da, "__esModule", { value: !0 });
da.validateTuple = void 0;
const Si = we, _n = $e, mp = be, gp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: a } = e;
    if (Array.isArray(t))
      return hl(e, "additionalItems", t);
    a.items = !0, !(0, _n.alwaysValidSchema)(a, t) && e.ok((0, mp.validateArray)(e));
  }
};
function hl(e, t, a = e.schema) {
  const { gen: n, parentSchema: s, data: c, keyword: p, it: b } = e;
  g(s), b.opts.unevaluated && a.length && b.items !== !0 && (b.items = _n.mergeEvaluated.items(n, a.length, b.items));
  const _ = n.name("valid"), y = n.const("len", (0, Si._)`${c}.length`);
  a.forEach((S, L) => {
    (0, _n.alwaysValidSchema)(b, S) || (n.if((0, Si._)`${y} > ${L}`, () => e.subschema({
      keyword: p,
      schemaProp: L,
      dataProp: L
    }, _)), e.ok(_));
  });
  function g(S) {
    const { opts: L, errSchemaPath: A } = b, N = a.length, C = N === S.minItems && (N === S.maxItems || S[t] === !1);
    if (L.strictTuples && !C) {
      const T = `"${p}" is ${N}-tuple, but minItems or maxItems/${t} are not specified or different at path "${A}"`;
      (0, _n.checkStrictMode)(b, T, L.strictTuples);
    }
  }
}
da.validateTuple = hl;
da.default = gp;
Object.defineProperty(cs, "__esModule", { value: !0 });
const yp = da, bp = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, yp.validateTuple)(e, "items")
};
cs.default = bp;
var ls = {};
Object.defineProperty(ls, "__esModule", { value: !0 });
const xi = we, _p = $e, wp = be, vp = ua, $p = {
  message: ({ params: { len: e } }) => (0, xi.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, xi._)`{limit: ${e}}`
}, kp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: $p,
  code(e) {
    const { schema: t, parentSchema: a, it: n } = e, { prefixItems: s } = a;
    n.items = !0, !(0, _p.alwaysValidSchema)(n, t) && (s ? (0, vp.validateAdditionalItems)(e, s) : e.ok((0, wp.validateArray)(e)));
  }
};
ls.default = kp;
var us = {};
Object.defineProperty(us, "__esModule", { value: !0 });
const Rt = we, nn = $e, Ep = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Rt.str)`must contain at least ${e} valid item(s)` : (0, Rt.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Rt._)`{minContains: ${e}}` : (0, Rt._)`{minContains: ${e}, maxContains: ${t}}`
}, Pp = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Ep,
  code(e) {
    const { gen: t, schema: a, parentSchema: n, data: s, it: c } = e;
    let p, b;
    const { minContains: _, maxContains: y } = n;
    c.opts.next ? (p = _ === void 0 ? 1 : _, b = y) : p = 1;
    const g = t.const("len", (0, Rt._)`${s}.length`);
    if (e.setParams({ min: p, max: b }), b === void 0 && p === 0) {
      (0, nn.checkStrictMode)(c, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (b !== void 0 && p > b) {
      (0, nn.checkStrictMode)(c, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, nn.alwaysValidSchema)(c, a)) {
      let C = (0, Rt._)`${g} >= ${p}`;
      b !== void 0 && (C = (0, Rt._)`${C} && ${g} <= ${b}`), e.pass(C);
      return;
    }
    c.items = !0;
    const S = t.name("valid");
    b === void 0 && p === 1 ? A(S, () => t.if(S, () => t.break())) : p === 0 ? (t.let(S, !0), b !== void 0 && t.if((0, Rt._)`${s}.length > 0`, L)) : (t.let(S, !1), L()), e.result(S, () => e.reset());
    function L() {
      const C = t.name("_valid"), T = t.let("count", 0);
      A(C, () => t.if(C, () => N(T)));
    }
    function A(C, T) {
      t.forRange("i", 0, g, (v) => {
        e.subschema({
          keyword: "contains",
          dataProp: v,
          dataPropType: nn.Type.Num,
          compositeRule: !0
        }, C), T();
      });
    }
    function N(C) {
      t.code((0, Rt._)`${C}++`), b === void 0 ? t.if((0, Rt._)`${C} >= ${p}`, () => t.assign(S, !0).break()) : (t.if((0, Rt._)`${C} > ${b}`, () => t.assign(S, !1).break()), p === 1 ? t.assign(S, !0) : t.if((0, Rt._)`${C} >= ${p}`, () => t.assign(S, !0)));
    }
  }
};
us.default = Pp;
var pl = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = we, a = $e, n = be;
  e.error = {
    message: ({ params: { property: _, depsCount: y, deps: g } }) => {
      const S = y === 1 ? "property" : "properties";
      return (0, t.str)`must have ${S} ${g} when property ${_} is present`;
    },
    params: ({ params: { property: _, depsCount: y, deps: g, missingProperty: S } }) => (0, t._)`{property: ${_},
    missingProperty: ${S},
    depsCount: ${y},
    deps: ${g}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(_) {
      const [y, g] = c(_);
      p(_, y), b(_, g);
    }
  };
  function c({ schema: _ }) {
    const y = {}, g = {};
    for (const S in _) {
      if (S === "__proto__")
        continue;
      const L = Array.isArray(_[S]) ? y : g;
      L[S] = _[S];
    }
    return [y, g];
  }
  function p(_, y = _.schema) {
    const { gen: g, data: S, it: L } = _;
    if (Object.keys(y).length === 0)
      return;
    const A = g.let("missing");
    for (const N in y) {
      const C = y[N];
      if (C.length === 0)
        continue;
      const T = (0, n.propertyInData)(g, S, N, L.opts.ownProperties);
      _.setParams({
        property: N,
        depsCount: C.length,
        deps: C.join(", ")
      }), L.allErrors ? g.if(T, () => {
        for (const v of C)
          (0, n.checkReportMissingProp)(_, v);
      }) : (g.if((0, t._)`${T} && (${(0, n.checkMissingProp)(_, C, A)})`), (0, n.reportMissingProp)(_, A), g.else());
    }
  }
  e.validatePropertyDeps = p;
  function b(_, y = _.schema) {
    const { gen: g, data: S, keyword: L, it: A } = _, N = g.name("valid");
    for (const C in y)
      (0, a.alwaysValidSchema)(A, y[C]) || (g.if(
        (0, n.propertyInData)(g, S, C, A.opts.ownProperties),
        () => {
          const T = _.subschema({ keyword: L, schemaProp: C }, N);
          _.mergeValidEvaluated(T, N);
        },
        () => g.var(N, !0)
        // TODO var
      ), _.ok(N));
  }
  e.validateSchemaDeps = b, e.default = s;
})(pl);
var ds = {};
Object.defineProperty(ds, "__esModule", { value: !0 });
const fl = we, Sp = $e, xp = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, fl._)`{propertyName: ${e.propertyName}}`
}, Tp = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: xp,
  code(e) {
    const { gen: t, schema: a, data: n, it: s } = e;
    if ((0, Sp.alwaysValidSchema)(s, a))
      return;
    const c = t.name("valid");
    t.forIn("key", n, (p) => {
      e.setParams({ propertyName: p }), e.subschema({
        keyword: "propertyNames",
        data: p,
        dataTypes: ["string"],
        propertyName: p,
        compositeRule: !0
      }, c), t.if((0, fl.not)(c), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(c);
  }
};
ds.default = Tp;
var Hn = {};
Object.defineProperty(Hn, "__esModule", { value: !0 });
const on = be, Gt = we, jp = cr, sn = $e, Cp = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Gt._)`{additionalProperty: ${e.additionalProperty}}`
}, Op = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Cp,
  code(e) {
    const { gen: t, schema: a, parentSchema: n, data: s, errsCount: c, it: p } = e;
    if (!c)
      throw new Error("ajv implementation error");
    const { allErrors: b, opts: _ } = p;
    if (p.props = !0, _.removeAdditional !== "all" && (0, sn.alwaysValidSchema)(p, a))
      return;
    const y = (0, on.allSchemaProperties)(n.properties), g = (0, on.allSchemaProperties)(n.patternProperties);
    S(), e.ok((0, Gt._)`${c} === ${jp.default.errors}`);
    function S() {
      t.forIn("key", s, (T) => {
        !y.length && !g.length ? N(T) : t.if(L(T), () => N(T));
      });
    }
    function L(T) {
      let v;
      if (y.length > 8) {
        const j = (0, sn.schemaRefOrVal)(p, n.properties, "properties");
        v = (0, on.isOwnProperty)(t, j, T);
      } else
        y.length ? v = (0, Gt.or)(...y.map((j) => (0, Gt._)`${T} === ${j}`)) : v = Gt.nil;
      return g.length && (v = (0, Gt.or)(v, ...g.map((j) => (0, Gt._)`${(0, on.usePattern)(e, j)}.test(${T})`))), (0, Gt.not)(v);
    }
    function A(T) {
      t.code((0, Gt._)`delete ${s}[${T}]`);
    }
    function N(T) {
      if (_.removeAdditional === "all" || _.removeAdditional && a === !1) {
        A(T);
        return;
      }
      if (a === !1) {
        e.setParams({ additionalProperty: T }), e.error(), b || t.break();
        return;
      }
      if (typeof a == "object" && !(0, sn.alwaysValidSchema)(p, a)) {
        const v = t.name("valid");
        _.removeAdditional === "failing" ? (C(T, v, !1), t.if((0, Gt.not)(v), () => {
          e.reset(), A(T);
        })) : (C(T, v), b || t.if((0, Gt.not)(v), () => t.break()));
      }
    }
    function C(T, v, j) {
      const I = {
        keyword: "additionalProperties",
        dataProp: T,
        dataPropType: sn.Type.Str
      };
      j === !1 && Object.assign(I, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(I, v);
    }
  }
};
Hn.default = Op;
var hs = {};
Object.defineProperty(hs, "__esModule", { value: !0 });
const Np = er, Ti = be, po = $e, ji = Hn, Lp = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: a, parentSchema: n, data: s, it: c } = e;
    c.opts.removeAdditional === "all" && n.additionalProperties === void 0 && ji.default.code(new Np.KeywordCxt(c, ji.default, "additionalProperties"));
    const p = (0, Ti.allSchemaProperties)(a);
    for (const S of p)
      c.definedProperties.add(S);
    c.opts.unevaluated && p.length && c.props !== !0 && (c.props = po.mergeEvaluated.props(t, (0, po.toHash)(p), c.props));
    const b = p.filter((S) => !(0, po.alwaysValidSchema)(c, a[S]));
    if (b.length === 0)
      return;
    const _ = t.name("valid");
    for (const S of b)
      y(S) ? g(S) : (t.if((0, Ti.propertyInData)(t, s, S, c.opts.ownProperties)), g(S), c.allErrors || t.else().var(_, !0), t.endIf()), e.it.definedProperties.add(S), e.ok(_);
    function y(S) {
      return c.opts.useDefaults && !c.compositeRule && a[S].default !== void 0;
    }
    function g(S) {
      e.subschema({
        keyword: "properties",
        schemaProp: S,
        dataProp: S
      }, _);
    }
  }
};
hs.default = Lp;
var ps = {};
Object.defineProperty(ps, "__esModule", { value: !0 });
const Ci = be, cn = we, Oi = $e, Ni = $e, Rp = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: a, data: n, parentSchema: s, it: c } = e, { opts: p } = c, b = (0, Ci.allSchemaProperties)(a), _ = b.filter((C) => (0, Oi.alwaysValidSchema)(c, a[C]));
    if (b.length === 0 || _.length === b.length && (!c.opts.unevaluated || c.props === !0))
      return;
    const y = p.strictSchema && !p.allowMatchingProperties && s.properties, g = t.name("valid");
    c.props !== !0 && !(c.props instanceof cn.Name) && (c.props = (0, Ni.evaluatedPropsToName)(t, c.props));
    const { props: S } = c;
    L();
    function L() {
      for (const C of b)
        y && A(C), c.allErrors ? N(C) : (t.var(g, !0), N(C), t.if(g));
    }
    function A(C) {
      for (const T in y)
        new RegExp(C).test(T) && (0, Oi.checkStrictMode)(c, `property ${T} matches pattern ${C} (use allowMatchingProperties)`);
    }
    function N(C) {
      t.forIn("key", n, (T) => {
        t.if((0, cn._)`${(0, Ci.usePattern)(e, C)}.test(${T})`, () => {
          const v = _.includes(C);
          v || e.subschema({
            keyword: "patternProperties",
            schemaProp: C,
            dataProp: T,
            dataPropType: Ni.Type.Str
          }, g), c.opts.unevaluated && S !== !0 ? t.assign((0, cn._)`${S}[${T}]`, !0) : !v && !c.allErrors && t.if((0, cn.not)(g), () => t.break());
        });
      });
    }
  }
};
ps.default = Rp;
var fs = {};
Object.defineProperty(fs, "__esModule", { value: !0 });
const Ip = $e, Ap = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: a, it: n } = e;
    if ((0, Ip.alwaysValidSchema)(n, a)) {
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
fs.default = Ap;
var ms = {};
Object.defineProperty(ms, "__esModule", { value: !0 });
const Mp = be, Dp = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Mp.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
ms.default = Dp;
var gs = {};
Object.defineProperty(gs, "__esModule", { value: !0 });
const wn = we, zp = $e, Bp = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, wn._)`{passingSchemas: ${e.passing}}`
}, Vp = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Bp,
  code(e) {
    const { gen: t, schema: a, parentSchema: n, it: s } = e;
    if (!Array.isArray(a))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const c = a, p = t.let("valid", !1), b = t.let("passing", null), _ = t.name("_valid");
    e.setParams({ passing: b }), t.block(y), e.result(p, () => e.reset(), () => e.error(!0));
    function y() {
      c.forEach((g, S) => {
        let L;
        (0, zp.alwaysValidSchema)(s, g) ? t.var(_, !0) : L = e.subschema({
          keyword: "oneOf",
          schemaProp: S,
          compositeRule: !0
        }, _), S > 0 && t.if((0, wn._)`${_} && ${p}`).assign(p, !1).assign(b, (0, wn._)`[${b}, ${S}]`).else(), t.if(_, () => {
          t.assign(p, !0), t.assign(b, S), L && e.mergeEvaluated(L, wn.Name);
        });
      });
    }
  }
};
gs.default = Vp;
var ys = {};
Object.defineProperty(ys, "__esModule", { value: !0 });
const Fp = $e, Up = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: a, it: n } = e;
    if (!Array.isArray(a))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    a.forEach((c, p) => {
      if ((0, Fp.alwaysValidSchema)(n, c))
        return;
      const b = e.subschema({ keyword: "allOf", schemaProp: p }, s);
      e.ok(s), e.mergeEvaluated(b);
    });
  }
};
ys.default = Up;
var bs = {};
Object.defineProperty(bs, "__esModule", { value: !0 });
const On = we, ml = $e, qp = {
  message: ({ params: e }) => (0, On.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, On._)`{failingKeyword: ${e.ifClause}}`
}, Hp = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: qp,
  code(e) {
    const { gen: t, parentSchema: a, it: n } = e;
    a.then === void 0 && a.else === void 0 && (0, ml.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Li(n, "then"), c = Li(n, "else");
    if (!s && !c)
      return;
    const p = t.let("valid", !0), b = t.name("_valid");
    if (_(), e.reset(), s && c) {
      const g = t.let("ifClause");
      e.setParams({ ifClause: g }), t.if(b, y("then", g), y("else", g));
    } else
      s ? t.if(b, y("then")) : t.if((0, On.not)(b), y("else"));
    e.pass(p, () => e.error(!0));
    function _() {
      const g = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, b);
      e.mergeEvaluated(g);
    }
    function y(g, S) {
      return () => {
        const L = e.subschema({ keyword: g }, b);
        t.assign(p, b), e.mergeValidEvaluated(L, p), S ? t.assign(S, (0, On._)`${g}`) : e.setParams({ ifClause: g });
      };
    }
  }
};
function Li(e, t) {
  const a = e.schema[t];
  return a !== void 0 && !(0, ml.alwaysValidSchema)(e, a);
}
bs.default = Hp;
var _s = {};
Object.defineProperty(_s, "__esModule", { value: !0 });
const Gp = $e, Kp = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: a }) {
    t.if === void 0 && (0, Gp.checkStrictMode)(a, `"${e}" without "if" is ignored`);
  }
};
_s.default = Kp;
Object.defineProperty(is, "__esModule", { value: !0 });
const Wp = ua, Jp = cs, Zp = da, Yp = ls, Qp = us, Xp = pl, ef = ds, tf = Hn, rf = hs, af = ps, nf = fs, of = ms, sf = gs, cf = ys, lf = bs, uf = _s;
function df(e = !1) {
  const t = [
    // any
    nf.default,
    of.default,
    sf.default,
    cf.default,
    lf.default,
    uf.default,
    // object
    ef.default,
    tf.default,
    Xp.default,
    rf.default,
    af.default
  ];
  return e ? t.push(Jp.default, Yp.default) : t.push(Wp.default, Zp.default), t.push(Qp.default), t;
}
is.default = df;
var ws = {}, vs = {};
Object.defineProperty(vs, "__esModule", { value: !0 });
const Fe = we, hf = {
  message: ({ schemaCode: e }) => (0, Fe.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, Fe._)`{format: ${e}}`
}, pf = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: hf,
  code(e, t) {
    const { gen: a, data: n, $data: s, schema: c, schemaCode: p, it: b } = e, { opts: _, errSchemaPath: y, schemaEnv: g, self: S } = b;
    if (!_.validateFormats)
      return;
    s ? L() : A();
    function L() {
      const N = a.scopeValue("formats", {
        ref: S.formats,
        code: _.code.formats
      }), C = a.const("fDef", (0, Fe._)`${N}[${p}]`), T = a.let("fType"), v = a.let("format");
      a.if((0, Fe._)`typeof ${C} == "object" && !(${C} instanceof RegExp)`, () => a.assign(T, (0, Fe._)`${C}.type || "string"`).assign(v, (0, Fe._)`${C}.validate`), () => a.assign(T, (0, Fe._)`"string"`).assign(v, C)), e.fail$data((0, Fe.or)(j(), I()));
      function j() {
        return _.strictSchema === !1 ? Fe.nil : (0, Fe._)`${p} && !${v}`;
      }
      function I() {
        const r = g.$async ? (0, Fe._)`(${C}.async ? await ${v}(${n}) : ${v}(${n}))` : (0, Fe._)`${v}(${n})`, i = (0, Fe._)`(typeof ${v} == "function" ? ${r} : ${v}.test(${n}))`;
        return (0, Fe._)`${v} && ${v} !== true && ${T} === ${t} && !${i}`;
      }
    }
    function A() {
      const N = S.formats[c];
      if (!N) {
        j();
        return;
      }
      if (N === !0)
        return;
      const [C, T, v] = I(N);
      C === t && e.pass(r());
      function j() {
        if (_.strictSchema === !1) {
          S.logger.warn(i());
          return;
        }
        throw new Error(i());
        function i() {
          return `unknown format "${c}" ignored in schema at path "${y}"`;
        }
      }
      function I(i) {
        const o = i instanceof RegExp ? (0, Fe.regexpCode)(i) : _.code.formats ? (0, Fe._)`${_.code.formats}${(0, Fe.getProperty)(c)}` : void 0, l = a.scopeValue("formats", { key: c, ref: i, code: o });
        return typeof i == "object" && !(i instanceof RegExp) ? [i.type || "string", i.validate, (0, Fe._)`${l}.validate`] : ["string", i, l];
      }
      function r() {
        if (typeof N == "object" && !(N instanceof RegExp) && N.async) {
          if (!g.$async)
            throw new Error("async format in sync schema");
          return (0, Fe._)`await ${v}(${n})`;
        }
        return typeof T == "function" ? (0, Fe._)`${v}(${n})` : (0, Fe._)`${v}.test(${n})`;
      }
    }
  }
};
vs.default = pf;
Object.defineProperty(ws, "__esModule", { value: !0 });
const ff = vs, mf = [ff.default];
ws.default = mf;
var ia = {};
Object.defineProperty(ia, "__esModule", { value: !0 });
ia.contentVocabulary = ia.metadataVocabulary = void 0;
ia.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
ia.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Go, "__esModule", { value: !0 });
const gf = Ko, yf = Jo, bf = is, _f = ws, Ri = ia, wf = [
  gf.default,
  yf.default,
  (0, bf.default)(),
  _f.default,
  Ri.metadataVocabulary,
  Ri.contentVocabulary
];
Go.default = wf;
var $s = {}, gl = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.DiscrError = void 0, function(t) {
    t.Tag = "tag", t.Mapping = "mapping";
  }(e.DiscrError || (e.DiscrError = {}));
})(gl);
Object.defineProperty($s, "__esModule", { value: !0 });
const Zr = we, xo = gl, Ii = wt, vf = $e, $f = {
  message: ({ params: { discrError: e, tagName: t } }) => e === xo.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: a } }) => (0, Zr._)`{error: ${e}, tag: ${a}, tagValue: ${t}}`
}, kf = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: $f,
  code(e) {
    const { gen: t, data: a, schema: n, parentSchema: s, it: c } = e, { oneOf: p } = s;
    if (!c.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const b = n.propertyName;
    if (typeof b != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!p)
      throw new Error("discriminator: requires oneOf keyword");
    const _ = t.let("valid", !1), y = t.const("tag", (0, Zr._)`${a}${(0, Zr.getProperty)(b)}`);
    t.if((0, Zr._)`typeof ${y} == "string"`, () => g(), () => e.error(!1, { discrError: xo.DiscrError.Tag, tag: y, tagName: b })), e.ok(_);
    function g() {
      const A = L();
      t.if(!1);
      for (const N in A)
        t.elseIf((0, Zr._)`${y} === ${N}`), t.assign(_, S(A[N]));
      t.else(), e.error(!1, { discrError: xo.DiscrError.Mapping, tag: y, tagName: b }), t.endIf();
    }
    function S(A) {
      const N = t.name("valid"), C = e.subschema({ keyword: "oneOf", schemaProp: A }, N);
      return e.mergeEvaluated(C, Zr.Name), N;
    }
    function L() {
      var A;
      const N = {}, C = v(s);
      let T = !0;
      for (let r = 0; r < p.length; r++) {
        let i = p[r];
        i != null && i.$ref && !(0, vf.schemaHasRulesButRef)(i, c.self.RULES) && (i = Ii.resolveRef.call(c.self, c.schemaEnv.root, c.baseId, i == null ? void 0 : i.$ref), i instanceof Ii.SchemaEnv && (i = i.schema));
        const o = (A = i == null ? void 0 : i.properties) === null || A === void 0 ? void 0 : A[b];
        if (typeof o != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${b}"`);
        T = T && (C || v(i)), j(o, r);
      }
      if (!T)
        throw new Error(`discriminator: "${b}" must be required`);
      return N;
      function v({ required: r }) {
        return Array.isArray(r) && r.includes(b);
      }
      function j(r, i) {
        if (r.const)
          I(r.const, i);
        else if (r.enum)
          for (const o of r.enum)
            I(o, i);
        else
          throw new Error(`discriminator: "properties/${b}" must have "const" or "enum"`);
      }
      function I(r, i) {
        if (typeof r != "string" || r in N)
          throw new Error(`discriminator: "${b}" values must be unique strings`);
        N[r] = i;
      }
    }
  }
};
$s.default = kf;
const Ef = "http://json-schema.org/draft-07/schema#", Pf = "http://json-schema.org/draft-07/schema#", Sf = "Core schema meta-schema", xf = {
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
}, Tf = [
  "object",
  "boolean"
], jf = {
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
}, Cf = {
  $schema: Ef,
  $id: Pf,
  title: Sf,
  definitions: xf,
  type: Tf,
  properties: jf,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = void 0;
  const a = Ac, n = Go, s = $s, c = Cf, p = ["/properties"], b = "http://json-schema.org/draft-07/schema";
  class _ extends a.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((N) => this.addVocabulary(N)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const N = this.opts.$data ? this.$dataMetaSchema(c, p) : c;
      this.addMetaSchema(N, b, !1), this.refs["http://json-schema.org/schema"] = b;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(b) ? b : void 0);
    }
  }
  e.exports = t = _, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = _;
  var y = er;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return y.KeywordCxt;
  } });
  var g = we;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return g._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return g.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return g.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return g.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return g.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return g.CodeGen;
  } });
  var S = Ja;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return S.default;
  } });
  var L = Za;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return L.default;
  } });
})(vo, vo.exports);
var Of = vo.exports;
const Nf = /* @__PURE__ */ Ic(Of);
class Lf {
  constructor() {
    Ye(this, "ajv"), this.ajv = new Nf();
  }
  validateJson(t, a) {
    const n = this.ajv.validate(t, a);
    return n ? { valid: n } : { valid: n, error: this.ajv.errorsText() };
  }
  validateObjectSchema(t, a) {
    const n = this.ajv.validate(t, a);
    return n ? { valid: n } : { valid: n, error: this.ajv.errorsText() };
  }
}
class Rf {
  constructor() {
    Ye(this, "TIME_SPLIT", " ");
  }
  /**
   * 给日期添加小时
   *
   * @param date - Date
   * @param numOfHours - 数字
   * @author terwer
   * @since 1.0.0
   */
  addHoursToDate(t, a) {
    return t.setTime(t.getTime() + a * 60 * 60 * 1e3), t;
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
  formatIsoToZhDateFormat(t, a, n) {
    if (!t)
      return "";
    let s = t;
    const c = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(.\d{3})Z$/gm, p = s.match(c);
    if (p == null)
      return t;
    for (let b = 0; b < p.length; b++) {
      const _ = p[b];
      let y = _;
      a && (y = this.addHoursToDate(new Date(_), 8).toISOString());
      const g = y.split("T"), S = g[0], L = g[1].split(".")[0];
      let A = S + this.TIME_SPLIT + L;
      n && (A = S), s = s.replace(_, A);
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
class If {
  /**
   * 格式化字符串
   *
   * @param str - 字符串，可用占位符，例如：test \{0\} str
   * @param args - 按占位符顺序排列的参数
   * @author terwer
   * @since 0.0.1
   */
  f(t, ...a) {
    let n = t;
    for (let s = 0; s < a.length; s++) {
      const c = a[s];
      typeof c == "string" ? n = n.replace(`{${s}}`, c) : n = n.replace(`{${s}}`, c.toString());
    }
    return n;
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
  includeInArray(t, a) {
    let n = !1;
    for (let s = 0; s < a.length; s++) {
      const c = a[s];
      t.includes(c) && (n = !0);
    }
    return n;
  }
  /**
   * 截取指定长度的字符串
   *
   * @param str - str
   * @param length - 长度
   * @param ignore - 不要结尾省略号
   */
  getByLength(t, a, n) {
    const s = t;
    return s.length < a ? s : n ? s.substring(0, a) : s.substring(0, a) + "...";
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
  pathJoin(t, a) {
    let n = t;
    const s = t.lastIndexOf("/");
    return s + 1 === t.length && (n = t.substring(0, s)), a.indexOf("/") > 0 ? n = n + "/" + a : n = n + a, n;
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
const fo = (e, t) => {
  const a = Ai(e), n = Ai(t), s = a.pop(), c = n.pop(), p = zi(a, n);
  return p !== 0 ? p : s && c ? zi(s.split("."), c.split(".")) : s || c ? s ? -1 : 1 : 0;
}, Af = /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i, Ai = (e) => {
  if (typeof e != "string")
    throw new TypeError("Invalid argument expected string");
  const t = e.match(Af);
  if (!t)
    throw new Error(`Invalid argument not valid semver ('${e}' received)`);
  return t.shift(), t;
}, Mi = (e) => e === "*" || e === "x" || e === "X", Di = (e) => {
  const t = parseInt(e, 10);
  return isNaN(t) ? e : t;
}, Mf = (e, t) => typeof e != typeof t ? [String(e), String(t)] : [e, t], Df = (e, t) => {
  if (Mi(e) || Mi(t))
    return 0;
  const [a, n] = Mf(Di(e), Di(t));
  return a > n ? 1 : a < n ? -1 : 0;
}, zi = (e, t) => {
  for (let a = 0; a < Math.max(e.length, t.length); a++) {
    const n = Df(e[a] || "0", t[a] || "0");
    if (n !== 0)
      return n;
  }
  return 0;
};
class zf {
  /**
   * Compare [semver](https://semver.org/) version strings
   * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
   *
   * @param v1 - First version to compare
   * @param v2 - Second version to compare
   * @returns boolean true if v1 is higher than v2
   */
  greater(t, a) {
    return fo(t, a) > 0;
  }
  /**
   * Compare [semver](https://semver.org/) version strings
   * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
   *
   * @param v1 - First version to compare
   * @param v2 - Second version to compare
   * @returns boolean true if v1 is equal to v2
   */
  equal(t, a) {
    return fo(t, a) === 0;
  }
  /**
   * Compare [semver](https://semver.org/) version strings
   * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
   *
   * @param v1 - First version to compare
   * @param v2 - Second version to compare
   * @returns boolean true if v1 is lesser than v2
   */
  lesser(t, a) {
    return fo(t, a) < 0;
  }
}
var Bf = Object.defineProperty, Vf = (e, t, a) => t in e ? Bf(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, Yr = (e, t, a) => (Vf(e, typeof t != "symbol" ? t + "" : t, a), a);
let kr = class {
};
Yr(kr, "NODE_ENV_KEY", "NODE_ENV"), /**
* 开发环境
*/
Yr(kr, "NODE_ENV_DEVELOPMENT", "development"), /**
* 生产环境
*/
Yr(kr, "NODE_ENV_PRODUCTION", "production"), /**
* 测试环境
*/
Yr(kr, "NODE_ENV_TEST", "test"), /**
* 是否处于调试模式
*/
Yr(kr, "VITE_DEBUG_MODE_KEY", "VITE_DEBUG_MODE");
class Ff {
  /**
   * 环境初始化
   *
   * @param envMeta - 需要传入 {"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":false} 。特别提醒：此参数是静态元数据，取决于最终使用的项目。因此仅仅在最终使用的地方显示传递此值，中间项目请保持参数传递
   * @see {@link https://vitejs.dev/guide/env-and-mode.html#production-replacement}
   */
  constructor(t) {
    Yr(this, "envMeta"), this.envMeta = t;
  }
  /**
   * 是否是开发阶段调试
   */
  isNodeDev() {
    return this.getEnv(kr.NODE_ENV_KEY) === kr.NODE_ENV_DEVELOPMENT;
  }
  /**
   * 是否是调试阶段
   */
  isDev() {
    return this.isNodeDev() || this.getBooleanEnv(kr.VITE_DEBUG_MODE_KEY);
  }
  /**
   * 获取环境变量，key不存在返回undefined
   * @param key - key
   */
  getEnv(t) {
    let a;
    try {
      this.envMeta[t] && (a = this.envMeta[t]);
    } catch {
    }
    return a;
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
    let a = !1;
    return this.getEnv(t) && (a = this.getStringEnv(t).toLowerCase() === "true"), a;
  }
  /**
   * 获取环境变量，如果未定义或者为空值，用指定的默认值代替
   *
   * @param key - key
   * @param defaultValue - 默认值
   * @since 0.1.0
   * @author terwer
   */
  getEnvOrDefault(t, a) {
    const n = this.getStringEnv(t);
    return n.trim().length == 0 ? a : n;
  }
}
var Uf = Object.defineProperty, qf = (e, t, a) => t in e ? Uf(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, ra = (e, t, a) => (qf(e, typeof t != "symbol" ? t + "" : t, a), a);
let Nn = class {
};
ra(Nn, "LOG_LEVEL_KEY", "VITE_LOG_LEVEL"), ra(Nn, "LOG_PREFIX_KEY", "VITE_LOG_PREFIX");
var rr = /* @__PURE__ */ ((e) => (e.LOG_LEVEL_TRACE = "TRACE", e.LOG_LEVEL_DEBUG = "DEBUG", e.LOG_LEVEL_INFO = "INFO", e.LOG_LEVEL_WARN = "WARN", e.LOG_LEVEL_ERROR = "ERROR", e))(rr || {}), yl = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ks(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var bl = { exports: {} };
(function(e) {
  (function(t, a) {
    e.exports ? e.exports = a() : t.log = a();
  })(yl, function() {
    var t = function() {
    }, a = "undefined", n = typeof window !== a && typeof window.navigator !== a && /Trident\/|MSIE /.test(window.navigator.userAgent), s = [
      "trace",
      "debug",
      "info",
      "warn",
      "error"
    ];
    function c(C, T) {
      var v = C[T];
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
    function p() {
      console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
    }
    function b(C) {
      return C === "debug" && (C = "log"), typeof console === a ? !1 : C === "trace" && n ? p : console[C] !== void 0 ? c(console, C) : console.log !== void 0 ? c(console, "log") : t;
    }
    function _(C, T) {
      for (var v = 0; v < s.length; v++) {
        var j = s[v];
        this[j] = v < C ? t : this.methodFactory(j, C, T);
      }
      this.log = this.debug;
    }
    function y(C, T, v) {
      return function() {
        typeof console !== a && (_.call(this, T, v), this[C].apply(this, arguments));
      };
    }
    function g(C, T, v) {
      return b(C) || y.apply(this, arguments);
    }
    function S(C, T, v) {
      var j = this, I;
      T = T ?? "WARN";
      var r = "loglevel";
      typeof C == "string" ? r += ":" + C : typeof C == "symbol" && (r = void 0);
      function i(m) {
        var f = (s[m] || "silent").toUpperCase();
        if (!(typeof window === a || !r)) {
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
        var m;
        if (!(typeof window === a || !r)) {
          try {
            m = window.localStorage[r];
          } catch {
          }
          if (typeof m === a)
            try {
              var f = window.document.cookie, x = f.indexOf(
                encodeURIComponent(r) + "="
              );
              x !== -1 && (m = /^([^;]+)/.exec(f.slice(x))[1]);
            } catch {
            }
          return j.levels[m] === void 0 && (m = void 0), m;
        }
      }
      function l() {
        if (!(typeof window === a || !r)) {
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
      j.name = C, j.levels = {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        SILENT: 5
      }, j.methodFactory = v || g, j.getLevel = function() {
        return I;
      }, j.setLevel = function(m, f) {
        if (typeof m == "string" && j.levels[m.toUpperCase()] !== void 0 && (m = j.levels[m.toUpperCase()]), typeof m == "number" && m >= 0 && m <= j.levels.SILENT) {
          if (I = m, f !== !1 && i(m), _.call(j, m, C), typeof console === a && m < j.levels.SILENT)
            return "No console available for logging";
        } else
          throw "log.setLevel() called with invalid level: " + m;
      }, j.setDefaultLevel = function(m) {
        T = m, o() || j.setLevel(m, !1);
      }, j.resetLevel = function() {
        j.setLevel(T, !1), l();
      }, j.enableAll = function(m) {
        j.setLevel(j.levels.TRACE, m);
      }, j.disableAll = function(m) {
        j.setLevel(j.levels.SILENT, m);
      };
      var u = o();
      u == null && (u = T), j.setLevel(u, !1);
    }
    var L = new S(), A = {};
    L.getLogger = function(C) {
      if (typeof C != "symbol" && typeof C != "string" || C === "")
        throw new TypeError("You must supply a name when creating a logger.");
      var T = A[C];
      return T || (T = A[C] = new S(
        C,
        L.getLevel(),
        L.methodFactory
      )), T;
    };
    var N = typeof window !== a ? window.log : void 0;
    return L.noConflict = function() {
      return typeof window !== a && window.log === L && (window.log = N), L;
    }, L.getLoggers = function() {
      return A;
    }, L.default = L, L;
  });
})(bl);
var Hf = bl.exports;
const ln = /* @__PURE__ */ ks(Hf);
var _l = { exports: {} };
(function(e) {
  (function(t, a) {
    e.exports ? e.exports = a() : t.prefix = a(t);
  })(yl, function(t) {
    var a = function(g) {
      for (var S = 1, L = arguments.length, A; S < L; S++)
        for (A in arguments[S])
          Object.prototype.hasOwnProperty.call(arguments[S], A) && (g[A] = arguments[S][A]);
      return g;
    }, n = {
      template: "[%t] %l:",
      levelFormatter: function(g) {
        return g.toUpperCase();
      },
      nameFormatter: function(g) {
        return g || "root";
      },
      timestampFormatter: function(g) {
        return g.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
      },
      format: void 0
    }, s, c = {}, p = function(g) {
      if (!g || !g.getLogger)
        throw new TypeError("Argument is not a root logger");
      s = g;
    }, b = function(g, S) {
      if (!g || !g.setLevel)
        throw new TypeError("Argument is not a logger");
      var L = g.methodFactory, A = g.name || "", N = c[A] || c[""] || n;
      function C(T, v, j) {
        var I = L(T, v, j), r = c[j] || c[""], i = r.template.indexOf("%t") !== -1, o = r.template.indexOf("%l") !== -1, l = r.template.indexOf("%n") !== -1;
        return function() {
          for (var u = "", m = arguments.length, f = Array(m), x = 0; x < m; x++)
            f[x] = arguments[x];
          if (A || !c[j]) {
            var B = r.timestampFormatter(/* @__PURE__ */ new Date()), U = r.levelFormatter(T), z = r.nameFormatter(j);
            r.format ? u += r.format(U, z, B) : (u += r.template, i && (u = u.replace(/%t/, B)), o && (u = u.replace(/%l/, U)), l && (u = u.replace(/%n/, z))), f.length && typeof f[0] == "string" ? f[0] = u + " " + f[0] : f.unshift(u);
          }
          I.apply(void 0, f);
        };
      }
      return c[A] || (g.methodFactory = C), S = S || {}, S.template && (S.format = void 0), c[A] = a({}, N, S), g.setLevel(g.getLevel()), s || g.warn(
        "It is necessary to call the function reg() of loglevel-plugin-prefix before calling apply. From the next release, it will throw an error. See more: https://github.com/kutuluk/loglevel-plugin-prefix/blob/master/README.md"
      ), g;
    }, _ = {
      reg: p,
      apply: b
    }, y;
    return t && (y = t.prefix, _.noConflict = function() {
      return t.prefix === _ && (t.prefix = y), _;
    }), _;
  });
})(_l);
var Gf = _l.exports;
const Bi = /* @__PURE__ */ ks(Gf);
function Kf() {
  const e = Error.prepareStackTrace;
  Error.prepareStackTrace = (a, n) => n;
  const t = new Error().stack.slice(1);
  return Error.prepareStackTrace = e, t;
}
let Vi = class wl {
  /**
   * 解析日志级别为枚举
   *
   * @param enumObj - 枚举对象
   * @param value - 配置的值
   */
  static stringToEnumValue(t, a) {
    return t[Object.keys(t).filter((n) => t[n].toString() === a)[0]];
  }
  /**
   * 获取配置的日志级别
   */
  static getEnvLevel(t) {
    if (!t)
      return;
    const a = t.getEnvOrDefault(Nn.LOG_LEVEL_KEY, rr.LOG_LEVEL_INFO), n = wl.stringToEnumValue(rr, a.toUpperCase());
    return n || console.warn(
      "[zhi-log] LOG_LEVEL is invalid in you .env file.It must be either debug, info, warn or error, fallback to default info level"
    ), n;
  }
  /**
   * 获取默认日志
   */
  static getEnvLogger(t) {
    return t ? t.getEnv(Nn.LOG_PREFIX_KEY) : void 0;
  }
};
var Es = { exports: {} }, Fi = { exports: {} }, Ui;
function Wf() {
  return Ui || (Ui = 1, function(e) {
    const t = typeof process < "u" && process.env.TERM_PROGRAM === "Hyper", a = typeof process < "u" && process.platform === "win32", n = typeof process < "u" && process.platform === "linux", s = {
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
    }, c = Object.assign({}, s, {
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
    }), p = Object.assign({}, s, {
      ballotCross: "✘",
      check: "✔",
      cross: "✖",
      ellipsisLarge: "⋯",
      ellipsis: "…",
      info: "ℹ",
      questionFull: "？",
      questionSmall: "﹖",
      pointer: n ? "▸" : "❯",
      pointerSmall: n ? "‣" : "›",
      radioOff: "◯",
      radioOn: "◉",
      warning: "⚠"
    });
    e.exports = a && !t ? c : p, Reflect.defineProperty(e.exports, "common", { enumerable: !1, value: s }), Reflect.defineProperty(e.exports, "windows", { enumerable: !1, value: c }), Reflect.defineProperty(e.exports, "other", { enumerable: !1, value: p });
  }(Fi)), Fi.exports;
}
const Jf = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Zf = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g, Yf = () => typeof process < "u" ? process.env.FORCE_COLOR !== "0" : !1, vl = () => {
  const e = {
    enabled: Yf(),
    visible: !0,
    styles: {},
    keys: {}
  }, t = (c) => {
    let p = c.open = `\x1B[${c.codes[0]}m`, b = c.close = `\x1B[${c.codes[1]}m`, _ = c.regex = new RegExp(`\\u001b\\[${c.codes[1]}m`, "g");
    return c.wrap = (y, g) => {
      y.includes(b) && (y = y.replace(_, b + p));
      let S = p + y + b;
      return g ? S.replace(/\r*\n/g, `${b}$&${p}`) : S;
    }, c;
  }, a = (c, p, b) => typeof c == "function" ? c(p) : c.wrap(p, b), n = (c, p) => {
    if (c === "" || c == null)
      return "";
    if (e.enabled === !1)
      return c;
    if (e.visible === !1)
      return "";
    let b = "" + c, _ = b.includes(`
`), y = p.length;
    for (y > 0 && p.includes("unstyle") && (p = [.../* @__PURE__ */ new Set(["unstyle", ...p])].reverse()); y-- > 0; )
      b = a(e.styles[p[y]], b, _);
    return b;
  }, s = (c, p, b) => {
    e.styles[c] = t({ name: c, codes: p }), (e.keys[b] || (e.keys[b] = [])).push(c), Reflect.defineProperty(e, c, {
      configurable: !0,
      enumerable: !0,
      set(_) {
        e.alias(c, _);
      },
      get() {
        let _ = (y) => n(y, _.stack);
        return Reflect.setPrototypeOf(_, e), _.stack = this.stack ? this.stack.concat(c) : [c], _;
      }
    });
  };
  return s("reset", [0, 0], "modifier"), s("bold", [1, 22], "modifier"), s("dim", [2, 22], "modifier"), s("italic", [3, 23], "modifier"), s("underline", [4, 24], "modifier"), s("inverse", [7, 27], "modifier"), s("hidden", [8, 28], "modifier"), s("strikethrough", [9, 29], "modifier"), s("black", [30, 39], "color"), s("red", [31, 39], "color"), s("green", [32, 39], "color"), s("yellow", [33, 39], "color"), s("blue", [34, 39], "color"), s("magenta", [35, 39], "color"), s("cyan", [36, 39], "color"), s("white", [37, 39], "color"), s("gray", [90, 39], "color"), s("grey", [90, 39], "color"), s("bgBlack", [40, 49], "bg"), s("bgRed", [41, 49], "bg"), s("bgGreen", [42, 49], "bg"), s("bgYellow", [43, 49], "bg"), s("bgBlue", [44, 49], "bg"), s("bgMagenta", [45, 49], "bg"), s("bgCyan", [46, 49], "bg"), s("bgWhite", [47, 49], "bg"), s("blackBright", [90, 39], "bright"), s("redBright", [91, 39], "bright"), s("greenBright", [92, 39], "bright"), s("yellowBright", [93, 39], "bright"), s("blueBright", [94, 39], "bright"), s("magentaBright", [95, 39], "bright"), s("cyanBright", [96, 39], "bright"), s("whiteBright", [97, 39], "bright"), s("bgBlackBright", [100, 49], "bgBright"), s("bgRedBright", [101, 49], "bgBright"), s("bgGreenBright", [102, 49], "bgBright"), s("bgYellowBright", [103, 49], "bgBright"), s("bgBlueBright", [104, 49], "bgBright"), s("bgMagentaBright", [105, 49], "bgBright"), s("bgCyanBright", [106, 49], "bgBright"), s("bgWhiteBright", [107, 49], "bgBright"), e.ansiRegex = Zf, e.hasColor = e.hasAnsi = (c) => (e.ansiRegex.lastIndex = 0, typeof c == "string" && c !== "" && e.ansiRegex.test(c)), e.alias = (c, p) => {
    let b = typeof p == "string" ? e[p] : p;
    if (typeof b != "function")
      throw new TypeError("Expected alias to be the name of an existing color (string) or a function");
    b.stack || (Reflect.defineProperty(b, "name", { value: c }), e.styles[c] = b, b.stack = [c]), Reflect.defineProperty(e, c, {
      configurable: !0,
      enumerable: !0,
      set(_) {
        e.alias(c, _);
      },
      get() {
        let _ = (y) => n(y, _.stack);
        return Reflect.setPrototypeOf(_, e), _.stack = this.stack ? this.stack.concat(b.stack) : b.stack, _;
      }
    });
  }, e.theme = (c) => {
    if (!Jf(c))
      throw new TypeError("Expected theme to be an object");
    for (let p of Object.keys(c))
      e.alias(p, c[p]);
    return e;
  }, e.alias("unstyle", (c) => typeof c == "string" && c !== "" ? (e.ansiRegex.lastIndex = 0, c.replace(e.ansiRegex, "")) : ""), e.alias("noop", (c) => c), e.none = e.clear = e.noop, e.stripColor = e.unstyle, e.symbols = Wf(), e.define = s, e;
};
Es.exports = vl();
Es.exports.create = vl;
var Qf = Es.exports;
const Tt = /* @__PURE__ */ ks(Qf);
let To, $l, kl, El, Pl = !0;
typeof process < "u" && ({ FORCE_COLOR: To, NODE_DISABLE_COLORS: $l, NO_COLOR: kl, TERM: El } = process.env || {}, Pl = process.stdout && process.stdout.isTTY);
const fe = {
  enabled: !$l && kl == null && El !== "dumb" && (To != null && To !== "0" || Pl),
  // modifiers
  reset: Ce(0, 0),
  bold: Ce(1, 22),
  dim: Ce(2, 22),
  italic: Ce(3, 23),
  underline: Ce(4, 24),
  inverse: Ce(7, 27),
  hidden: Ce(8, 28),
  strikethrough: Ce(9, 29),
  // colors
  black: Ce(30, 39),
  red: Ce(31, 39),
  green: Ce(32, 39),
  yellow: Ce(33, 39),
  blue: Ce(34, 39),
  magenta: Ce(35, 39),
  cyan: Ce(36, 39),
  white: Ce(37, 39),
  gray: Ce(90, 39),
  grey: Ce(90, 39),
  // background colors
  bgBlack: Ce(40, 49),
  bgRed: Ce(41, 49),
  bgGreen: Ce(42, 49),
  bgYellow: Ce(43, 49),
  bgBlue: Ce(44, 49),
  bgMagenta: Ce(45, 49),
  bgCyan: Ce(46, 49),
  bgWhite: Ce(47, 49)
};
function qi(e, t) {
  let a = 0, n, s = "", c = "";
  for (; a < e.length; a++)
    n = e[a], s += n.open, c += n.close, ~t.indexOf(n.close) && (t = t.replace(n.rgx, n.close + n.open));
  return s + t + c;
}
function Xf(e, t) {
  let a = { has: e, keys: t };
  return a.reset = fe.reset.bind(a), a.bold = fe.bold.bind(a), a.dim = fe.dim.bind(a), a.italic = fe.italic.bind(a), a.underline = fe.underline.bind(a), a.inverse = fe.inverse.bind(a), a.hidden = fe.hidden.bind(a), a.strikethrough = fe.strikethrough.bind(a), a.black = fe.black.bind(a), a.red = fe.red.bind(a), a.green = fe.green.bind(a), a.yellow = fe.yellow.bind(a), a.blue = fe.blue.bind(a), a.magenta = fe.magenta.bind(a), a.cyan = fe.cyan.bind(a), a.white = fe.white.bind(a), a.gray = fe.gray.bind(a), a.grey = fe.grey.bind(a), a.bgBlack = fe.bgBlack.bind(a), a.bgRed = fe.bgRed.bind(a), a.bgGreen = fe.bgGreen.bind(a), a.bgYellow = fe.bgYellow.bind(a), a.bgBlue = fe.bgBlue.bind(a), a.bgMagenta = fe.bgMagenta.bind(a), a.bgCyan = fe.bgCyan.bind(a), a.bgWhite = fe.bgWhite.bind(a), a;
}
function Ce(e, t) {
  let a = {
    open: `\x1B[${e}m`,
    close: `\x1B[${t}m`,
    rgx: new RegExp(`\\x1b\\[${t}m`, "g")
  };
  return function(n) {
    return this !== void 0 && this.has !== void 0 ? (~this.has.indexOf(e) || (this.has.push(e), this.keys.push(a)), n === void 0 ? this : fe.enabled ? qi(this.keys, n + "") : n + "") : n === void 0 ? Xf([e], [a]) : fe.enabled ? qi([a], n + "") : n + "";
  };
}
var em = Object.defineProperty, tm = (e, t, a) => t in e ? em(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, We = (e, t, a) => (tm(e, typeof t != "symbol" ? t + "" : t, a), a);
const Wt = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return Wt.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let Ee = Wt;
We(Ee, "isNode", typeof process < "u"), /**
* 是否在浏览器环境
*/
We(Ee, "isInBrowser", typeof window < "u"), /**
* 浏览器路径分隔符
*/
We(Ee, "BrowserSeperator", "/"), /**
* 是否是Electron环境
*/
We(Ee, "isElectron", () => !Wt.isInBrowser || !window.navigator || !window.navigator.userAgent ? !1 : /Electron/.test(window.navigator.userAgent)), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
We(Ee, "hasNodeEnv", () => Wt.isElectron() || Wt.isNode), /**
* 获取url参数
*
* @param sParam - 参数
*/
We(Ee, "getQueryString", (e) => {
  if (!Wt.isInBrowser)
    return "";
  const t = window.location.search.substring(1).split("&");
  for (let a = 0; a < t.length; a++) {
    const n = t[a].split("=");
    if (n[0] === e)
      return n[1];
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
We(Ee, "replaceUrlParam", (e, t, a) => {
  a == null && (a = "");
  const n = new RegExp("\\b(" + t + "=).*?(&|#|$)");
  if (e.search(n) >= 0)
    return e.replace(n, "$1" + a + "$2");
  const [s, c] = e.split("#"), [p, b] = s.split("?"), _ = new URLSearchParams(b);
  _.set(t, a);
  const y = _.toString(), g = p + (y ? "?" + y : "");
  return c ? g + "#" + c : g;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
We(Ee, "setUrlParameter", (e, t, a) => {
  if (e.includes(t))
    return Wt.replaceUrlParam(e, t, a);
  const n = e.split("#");
  let s = n[0];
  const c = n[1];
  return s.includes("?") ? s += `&${t}=${a}` : s += `?${t}=${a}`, c && (s += "#" + c), s;
}), /**
* 重新加载指定tab
*
* @param tabname - tabname
* @param t - 延迟时间
*/
We(Ee, "reloadTabPage", (e, t = 200) => {
  setTimeout(function() {
    if (Wt.isInBrowser) {
      const a = window.location.href;
      window.location.href = Wt.setUrlParameter(a, "tab", e);
    }
  }, t);
}), /**
* 刷新当前tab页面
*/
We(Ee, "reloadPage", () => {
  setTimeout(function() {
    Wt.isInBrowser && window.location.reload();
  }, 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
*/
We(Ee, "reloadPageWithMessageCallback", (e, t) => {
  t && t(e), setTimeout(function() {
    Wt.isInBrowser && window.location.reload();
  }, 200);
});
var dt = /* @__PURE__ */ ((e) => (e.BasePathType_Appearance = "Appearance", e.BasePathType_Data = "Data", e.BasePathType_Themes = "Themes", e.BasePathType_ZhiTheme = "ZhiTheme", e.BasePathType_None = "None", e))(dt || {});
const mt = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return Ee.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : !1;
  }
  /**
   * 思源笔记 window 对象
   */
  static siyuanWindow() {
    let t;
    return this.isInSiyuanWidget() ? t = parent.window : this.isInSiyuanNewWin() || this.isInSiyuanBrowser() || typeof window < "u" ? t = window : t = void 0, t;
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
  static async importJs(t, a) {
    let n = t;
    switch (a) {
      case dt.BasePathType_Appearance:
        n = this.browserJoinPath(this.siyuanAppearanceRelativePath(), t);
        break;
      case dt.BasePathType_Data:
        n = this.browserJoinPath(this.siyuanDataRelativePath(), t);
        break;
      case dt.BasePathType_Themes:
        n = this.browserJoinPath(this.siyuanThemeRelativePath(), t);
        break;
      case dt.BasePathType_ZhiTheme:
        n = this.browserJoinPath(this.zhiThemeRelativePath(), t);
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
  static async importZhiThemeJs(t) {
    return await this.importJs(t, dt.BasePathType_ZhiTheme);
  }
  // =========================
  // import start
  // =========================
  /**
   * 路径拼接
   *
   * @param paths - 路径数组
   */
  static joinPath(...t) {
    if (Ee.hasNodeEnv()) {
      const a = this.requireLib("path");
      if (a)
        return a.join(...t);
    }
    return this.browserJoinPath(...t);
  }
  static browserJoinPath(...t) {
    return t.join(Ee.BrowserSeperator);
  }
  /**
   * 思源笔记 conf 目录
   */
  static siyuanConfPath() {
    const t = this.siyuanWindow();
    if (!t)
      throw new Error("Not in siyuan env");
    return t.siyuan.config.system.confDir;
  }
  /**
   * 思源笔记 data 目录
   */
  static siyuanDataPath() {
    const t = this.siyuanWindow();
    if (!t)
      throw new Error("Not in siyuan env");
    return t.siyuan.config.system.dataDir;
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
    if (Ee.hasNodeEnv())
      return this.joinPath(this.siyuanAppearancePath(), "themes");
    {
      const t = this.siyuanWindow();
      if (!t)
        throw new Error("Not in siyuan env");
      return this.joinPath(t.location.origin, "appearance", "themes");
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
let Nr = mt;
We(Nr, "isInSiyuanWidget", () => Ee.isInBrowser ? window.frameElement != null && window.frameElement.parentElement != null && window.frameElement.parentElement.parentElement != null && window.frameElement.parentElement.parentElement.getAttribute("data-node-id") !== "" : !1), /**
* 思源笔记新窗口
*
* @deprecated window.terwer 判断方式已废弃，建议以后打开新窗口注入 window.siyuanNewWin ，这样语义会更容易理解
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
We(Nr, "isInSiyuanNewWin", () => !Ee.isInBrowser || !Ee.isElectron() ? !1 : typeof window.terwer < "u" || typeof window.siyuanNewWin < "u"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
We(Nr, "requireLib", (e, t = !0, a = dt.BasePathType_None) => {
  if (!Ee.hasNodeEnv())
    throw new Error("require ony works on node env");
  let n = e;
  if (!t)
    switch (a) {
      case dt.BasePathType_Appearance:
        n = mt.joinPath(mt.siyuanAppearancePath(), e);
        break;
      case dt.BasePathType_Data:
        n = mt.joinPath(mt.siyuanDataPath(), e);
        break;
      case dt.BasePathType_Themes:
        n = mt.joinPath(mt.siyuanAppearancePath(), "themes", e);
        break;
      case dt.BasePathType_ZhiTheme:
        n = mt.joinPath(mt.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const s = mt.siyuanWindow();
  if (!s)
    return require(n);
  if (typeof s.require < "u")
    return s.require(n);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
We(Nr, "requireAppearanceLib", (e) => mt.requireLib(e, !1, dt.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
We(Nr, "requireDataLib", (e) => mt.requireLib(e, !1, dt.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
We(Nr, "requireThemesLib", (e) => mt.requireLib(e, !1, dt.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
We(Nr, "requireZhiThemeLib", (e) => mt.requireLib(e, !1, dt.BasePathType_ZhiTheme));
const jt = {
  white: (e) => Ee.isElectron() ? Tt.whiteBright(e) : fe.white(e),
  gray: (e) => Ee.isElectron() ? Tt.gray(e) : fe.gray(e),
  blue: (e) => Ee.isElectron() ? Tt.blue(e) : fe.blue(e),
  green: (e) => Ee.isElectron() ? Tt.green(e) : fe.green(e),
  yellow: (e) => Ee.isElectron() ? Tt.yellow(e) : fe.yellow(e),
  red: (e) => Ee.isElectron() ? Tt.red(e) : fe.red(e),
  bgWhite: (e) => Ee.isElectron() ? Tt.bgWhiteBright(e) : fe.bgWhite(e),
  bgGrey: (e) => Ee.isElectron() ? Tt.bgCyanBright(e) : fe.bgCyan(e),
  bgBlue: (e) => Ee.isElectron() ? Tt.bgBlueBright(e) : fe.bgBlue(e),
  bgGreen: (e) => Ee.isElectron() ? Tt.bgGreenBright(e) : fe.bgGreen(e),
  bgYellow: (e) => Ee.isElectron() ? Tt.bgYellowBright(e) : fe.bgYellow(e),
  bgRed: (e) => Ee.isElectron() ? Tt.bgRedBright(e) : fe.bgRed(e)
};
let rm = class {
  constructor(t, a, n) {
    ra(this, "consoleLogger", "console"), ra(this, "stackSize", 1), ra(this, "getLogger", (p) => {
      let b;
      if (p)
        b = p;
      else {
        const _ = this.getCallStack(), y = [], g = [];
        for (let S = 0; S < _.length; S++) {
          const L = _[S], A = L.getFileName() ?? "none";
          if (S > this.stackSize - 1)
            break;
          const N = A + "-" + L.getLineNumber() + ":" + L.getColumnNumber();
          y.push(N);
        }
        g.length > 0 && (b = y.join(" -> "));
      }
      return (!b || b.trim().length === 0) && (b = this.consoleLogger), ln.getLogger(b);
    }), this.stackSize = 1;
    let s;
    t ? s = t : s = Vi.getEnvLevel(n), s = s ?? rr.LOG_LEVEL_INFO, ln.setLevel(s);
    const c = (p, b, _, y) => {
      const g = [], S = a ?? Vi.getEnvLogger(n) ?? "zhi";
      return g.push(jt.gray("[") + y(S) + jt.gray("]")), g.push(jt.gray("[") + jt.gray(_.toString()) + jt.gray("]")), g.push(y(p.toUpperCase().toString())), g.push(y(b)), g.push(jt.gray(":")), g;
    };
    Bi.reg(ln), Bi.apply(ln, {
      format(p, b, _) {
        let y = [];
        const g = b ?? "";
        switch (p) {
          case rr.LOG_LEVEL_TRACE:
            y = c(p, g, _, jt.gray);
            break;
          case rr.LOG_LEVEL_DEBUG:
            y = c(p, g, _, jt.blue);
            break;
          case rr.LOG_LEVEL_INFO:
            y = c(p, g, _, jt.green);
            break;
          case rr.LOG_LEVEL_WARN:
            y = c(p, g, _, jt.yellow);
            break;
          case rr.LOG_LEVEL_ERROR:
            y = c(p, g, _, jt.red);
            break;
          default:
            y = c(rr.LOG_LEVEL_INFO, g, _, jt.green);
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
      t = Kf();
    } catch {
      t = [];
    }
    return t;
  }
}, am = class {
  /**
   * 默认日志级别
   *
   * @param level - 可选，未设置默认INFO
   * @param sign - 可选前缀，默认zhi
   * @param env - 可选环境变量实例
   */
  constructor(t, a, n) {
    ra(this, "logger"), this.logger = new rm(t, a, n);
  }
  /**
   * 获取日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   * @protected
   */
  getLogger(t, a) {
    return this.logger.setStackSize(a), this.logger.getLogger(t);
  }
}, Hi = class extends am {
  constructor(t, a, n) {
    super(t, a, n);
  }
  /**
   * 获取默认的日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   */
  getLogger(t, a) {
    return super.getLogger(t, a);
  }
}, nm = class Sl {
  /**
   * 默认日志记录器
   *
   * @param stackSize - 栈的深度
   * @param env - 环境变量实例
   */
  static defaultLogger(t, a) {
    return Sl.customLogFactory(void 0, void 0, t).getLogger(void 0, a);
  }
  /**
   * 自定义日志工厂
   *
   * @param level - 级别
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customLogFactory(t, a, n) {
    return new Hi(t, a, n);
  }
  /**
   * 自定义日志工厂，自定义前缀
   *
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customSignLogFactory(t, a) {
    return new Hi(void 0, t, a);
  }
};
const om = "zhi";
let vn = class {
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
  static zhiLogWithSign(t, a) {
    if (this.loggerMap[a])
      return this.loggerMap[a].debug("Zhi-log use cache"), this.loggerMap[a];
    const n = this.env, s = nm.customSignLogFactory(t, n).getLogger(a);
    return this.loggerMap[a] = s, s.debug("Zhi-log add new logger"), s;
  }
  /**
   * 获取 zhi-log 实例
   *
   * @param loggerName - 日志名称
   */
  static zhiLog(t) {
    return this.zhiLogWithSign(om, t);
  }
  /**
   * 获取 zhi-common 实例
   */
  static zhiCommon() {
    return this.common || (this.common = new um()), this.common;
  }
};
Ye(vn, "env"), /**
* zhi-util 的日志器缓存
*/
Ye(vn, "loggerMap", {}), /**
* zhi-util 的通用工具类
*/
Ye(vn, "common");
class Ps extends vn {
  static zhiEnv() {
    return this.env || (this.env = new Ff({ BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 })), this.env;
  }
}
let Gi = class {
  constructor() {
    Ye(this, "logger"), this.logger = Ps.zhiLog("lute-adaptor"), Lute ? this.logger.debug("Detected Lute is bundled, will use!") : this.logger.debug("Lute is not available!");
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
    const a = new RegExp("(?<=^|[\\s\\S])==([^\\n]+?)==(?=($|[\\s\\S]))", "g");
    return t.replace(a, '<span class="mark">$1</span>');
  }
  /**
   * 渲染Markdown
   *
   * @param md - Markdown
   */
  async renderMarkdownStr(t) {
    if (!this.isAvailable())
      return this.logger.error("Lute is not available, will return original md"), t;
    const a = Lute, n = a.New(), s = {
      renderText: (c, p) => p ? [this.highlightWords(c.Text()), a.WalkContinue] : ["", a.WalkContinue]
      // renderStrong: (node: any, entering: any) => {
      //     return ["", luteObj.WalkContinue]
      // },
      // renderParagraph: (node: any, entering: any) => {
      //     return ["", luteObj.WalkContinue]
      // }
    };
    return n.SetJSRenderers({
      renderers: {
        Md2HTML: s
      }
    }), this.logger.info("Lute is rendering md to HTML..."), n.MarkdownStr("", t);
  }
};
var xl = { exports: {} };
(function(e) {
  (function() {
    function t(r) {
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
      if (r === !1)
        return JSON.parse(JSON.stringify(i));
      var o = {};
      for (var l in i)
        i.hasOwnProperty(l) && (o[l] = i[l].defaultValue);
      return o;
    }
    function a() {
      var r = t(!0), i = {};
      for (var o in r)
        r.hasOwnProperty(o) && (i[o] = !0);
      return i;
    }
    var n = {}, s = {}, c = {}, p = t(!0), b = "vanilla", _ = {
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
      allOn: a()
    };
    n.helper = {}, n.extensions = {}, n.setOption = function(r, i) {
      return p[r] = i, this;
    }, n.getOption = function(r) {
      return p[r];
    }, n.getOptions = function() {
      return p;
    }, n.resetOptions = function() {
      p = t(!0);
    }, n.setFlavor = function(r) {
      if (!_.hasOwnProperty(r))
        throw Error(r + " flavor was not found");
      n.resetOptions();
      var i = _[r];
      b = r;
      for (var o in i)
        i.hasOwnProperty(o) && (p[o] = i[o]);
    }, n.getFlavor = function() {
      return b;
    }, n.getFlavorOptions = function(r) {
      if (_.hasOwnProperty(r))
        return _[r];
    }, n.getDefaultOptions = function(r) {
      return t(r);
    }, n.subParser = function(r, i) {
      if (n.helper.isString(r))
        if (typeof i < "u")
          s[r] = i;
        else {
          if (s.hasOwnProperty(r))
            return s[r];
          throw Error("SubParser named " + r + " not registered!");
        }
    }, n.extension = function(r, i) {
      if (!n.helper.isString(r))
        throw Error("Extension 'name' must be a string");
      if (r = n.helper.stdExtName(r), n.helper.isUndefined(i)) {
        if (!c.hasOwnProperty(r))
          throw Error("Extension named " + r + " is not registered!");
        return c[r];
      } else {
        typeof i == "function" && (i = i()), n.helper.isArray(i) || (i = [i]);
        var o = y(i, r);
        if (o.valid)
          c[r] = i;
        else
          throw Error(o.error);
      }
    }, n.getAllExtensions = function() {
      return c;
    }, n.removeExtension = function(r) {
      delete c[r];
    }, n.resetExtensions = function() {
      c = {};
    };
    function y(r, i) {
      var o = i ? "Error in " + i + " extension->" : "Error in unnamed extension", l = {
        valid: !0,
        error: ""
      };
      n.helper.isArray(r) || (r = [r]);
      for (var u = 0; u < r.length; ++u) {
        var m = o + " sub-extension " + u + ": ", f = r[u];
        if (typeof f != "object")
          return l.valid = !1, l.error = m + "must be an object, but " + typeof f + " given", l;
        if (!n.helper.isString(f.type))
          return l.valid = !1, l.error = m + 'property "type" must be a string, but ' + typeof f.type + " given", l;
        var x = f.type = f.type.toLowerCase();
        if (x === "language" && (x = f.type = "lang"), x === "html" && (x = f.type = "output"), x !== "lang" && x !== "output" && x !== "listener")
          return l.valid = !1, l.error = m + "type " + x + ' is not recognized. Valid values: "lang/language", "output/html" or "listener"', l;
        if (x === "listener") {
          if (n.helper.isUndefined(f.listeners))
            return l.valid = !1, l.error = m + '. Extensions of type "listener" must have a property called "listeners"', l;
        } else if (n.helper.isUndefined(f.filter) && n.helper.isUndefined(f.regex))
          return l.valid = !1, l.error = m + x + ' extensions must define either a "regex" property or a "filter" method', l;
        if (f.listeners) {
          if (typeof f.listeners != "object")
            return l.valid = !1, l.error = m + '"listeners" property must be an object but ' + typeof f.listeners + " given", l;
          for (var B in f.listeners)
            if (f.listeners.hasOwnProperty(B) && typeof f.listeners[B] != "function")
              return l.valid = !1, l.error = m + '"listeners" property must be an hash of [event name]: [callback]. listeners.' + B + " must be a function but " + typeof f.listeners[B] + " given", l;
        }
        if (f.filter) {
          if (typeof f.filter != "function")
            return l.valid = !1, l.error = m + '"filter" must be a function, but ' + typeof f.filter + " given", l;
        } else if (f.regex) {
          if (n.helper.isString(f.regex) && (f.regex = new RegExp(f.regex, "g")), !(f.regex instanceof RegExp))
            return l.valid = !1, l.error = m + '"regex" property must either be a string or a RegExp object, but ' + typeof f.regex + " given", l;
          if (n.helper.isUndefined(f.replace))
            return l.valid = !1, l.error = m + '"regex" extensions must implement a replace string or function', l;
        }
      }
      return l;
    }
    n.validateExtension = function(r) {
      var i = y(r, null);
      return i.valid ? !0 : (console.warn(i.error), !1);
    }, n.hasOwnProperty("helper") || (n.helper = {}), n.helper.isString = function(r) {
      return typeof r == "string" || r instanceof String;
    }, n.helper.isFunction = function(r) {
      var i = {};
      return r && i.toString.call(r) === "[object Function]";
    }, n.helper.isArray = function(r) {
      return Array.isArray(r);
    }, n.helper.isUndefined = function(r) {
      return typeof r > "u";
    }, n.helper.forEach = function(r, i) {
      if (n.helper.isUndefined(r))
        throw new Error("obj param is required");
      if (n.helper.isUndefined(i))
        throw new Error("callback param is required");
      if (!n.helper.isFunction(i))
        throw new Error("callback param must be a function/closure");
      if (typeof r.forEach == "function")
        r.forEach(i);
      else if (n.helper.isArray(r))
        for (var o = 0; o < r.length; o++)
          i(r[o], o, r);
      else if (typeof r == "object")
        for (var l in r)
          r.hasOwnProperty(l) && i(r[l], l, r);
      else
        throw new Error("obj does not seem to be an array or an iterable object");
    }, n.helper.stdExtName = function(r) {
      return r.replace(/[_?*+\/\\.^-]/g, "").replace(/\s/g, "").toLowerCase();
    };
    function g(r, i) {
      var o = i.charCodeAt(0);
      return "¨E" + o + "E";
    }
    n.helper.escapeCharactersCallback = g, n.helper.escapeCharacters = function(r, i, o) {
      var l = "([" + i.replace(/([\[\]\\])/g, "\\$1") + "])";
      o && (l = "\\\\" + l);
      var u = new RegExp(l, "g");
      return r = r.replace(u, g), r;
    }, n.helper.unescapeHTMLEntities = function(r) {
      return r.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    var S = function(r, i, o, l) {
      var u = l || "", m = u.indexOf("g") > -1, f = new RegExp(i + "|" + o, "g" + u.replace(/g/g, "")), x = new RegExp(i, u.replace(/g/g, "")), B = [], U, z, H, w, q;
      do
        for (U = 0; H = f.exec(r); )
          if (x.test(H[0]))
            U++ || (z = f.lastIndex, w = z - H[0].length);
          else if (U && !--U) {
            q = H.index + H[0].length;
            var W = {
              left: { start: w, end: z },
              match: { start: z, end: H.index },
              right: { start: H.index, end: q },
              wholeMatch: { start: w, end: q }
            };
            if (B.push(W), !m)
              return B;
          }
      while (U && (f.lastIndex = z));
      return B;
    };
    n.helper.matchRecursiveRegExp = function(r, i, o, l) {
      for (var u = S(r, i, o, l), m = [], f = 0; f < u.length; ++f)
        m.push([
          r.slice(u[f].wholeMatch.start, u[f].wholeMatch.end),
          r.slice(u[f].match.start, u[f].match.end),
          r.slice(u[f].left.start, u[f].left.end),
          r.slice(u[f].right.start, u[f].right.end)
        ]);
      return m;
    }, n.helper.replaceRecursiveRegExp = function(r, i, o, l, u) {
      if (!n.helper.isFunction(i)) {
        var m = i;
        i = function() {
          return m;
        };
      }
      var f = S(r, o, l, u), x = r, B = f.length;
      if (B > 0) {
        var U = [];
        f[0].wholeMatch.start !== 0 && U.push(r.slice(0, f[0].wholeMatch.start));
        for (var z = 0; z < B; ++z)
          U.push(
            i(
              r.slice(f[z].wholeMatch.start, f[z].wholeMatch.end),
              r.slice(f[z].match.start, f[z].match.end),
              r.slice(f[z].left.start, f[z].left.end),
              r.slice(f[z].right.start, f[z].right.end)
            )
          ), z < B - 1 && U.push(r.slice(f[z].wholeMatch.end, f[z + 1].wholeMatch.start));
        f[B - 1].wholeMatch.end < r.length && U.push(r.slice(f[B - 1].wholeMatch.end)), x = U.join("");
      }
      return x;
    }, n.helper.regexIndexOf = function(r, i, o) {
      if (!n.helper.isString(r))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      if (!(i instanceof RegExp))
        throw "InvalidArgumentError: second parameter of showdown.helper.regexIndexOf function must be an instance of RegExp";
      var l = r.substring(o || 0).search(i);
      return l >= 0 ? l + (o || 0) : l;
    }, n.helper.splitAtIndex = function(r, i) {
      if (!n.helper.isString(r))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      return [r.substring(0, i), r.substring(i)];
    }, n.helper.encodeEmailAddress = function(r) {
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
      return r = r.replace(/./g, function(o) {
        if (o === "@")
          o = i[Math.floor(Math.random() * 2)](o);
        else {
          var l = Math.random();
          o = l > 0.9 ? i[2](o) : l > 0.45 ? i[1](o) : i[0](o);
        }
        return o;
      }), r;
    }, n.helper.padEnd = function(r, i, o) {
      return i = i >> 0, o = String(o || " "), r.length > i ? String(r) : (i = i - r.length, i > o.length && (o += o.repeat(i / o.length)), String(r) + o.slice(0, i));
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
    }), n.helper.regexes = {
      asteriskDashAndColon: /([*_:~])/g
    }, n.helper.emojis = {
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
    }, n.Converter = function(r) {
      var i = {}, o = [], l = [], u = {}, m = b, f = {
        parsed: {},
        raw: "",
        format: ""
      };
      x();
      function x() {
        r = r || {};
        for (var w in p)
          p.hasOwnProperty(w) && (i[w] = p[w]);
        if (typeof r == "object")
          for (var q in r)
            r.hasOwnProperty(q) && (i[q] = r[q]);
        else
          throw Error("Converter expects the passed parameter to be an object, but " + typeof r + " was passed instead.");
        i.extensions && n.helper.forEach(i.extensions, B);
      }
      function B(w, q) {
        if (q = q || null, n.helper.isString(w))
          if (w = n.helper.stdExtName(w), q = w, n.extensions[w]) {
            console.warn("DEPRECATION WARNING: " + w + " is an old extension that uses a deprecated loading method.Please inform the developer that the extension should be updated!"), U(n.extensions[w], w);
            return;
          } else if (!n.helper.isUndefined(c[w]))
            w = c[w];
          else
            throw Error('Extension "' + w + '" could not be loaded. It was either not found or is not a valid extension.');
        typeof w == "function" && (w = w()), n.helper.isArray(w) || (w = [w]);
        var W = y(w, q);
        if (!W.valid)
          throw Error(W.error);
        for (var J = 0; J < w.length; ++J) {
          switch (w[J].type) {
            case "lang":
              o.push(w[J]);
              break;
            case "output":
              l.push(w[J]);
              break;
          }
          if (w[J].hasOwnProperty("listeners"))
            for (var V in w[J].listeners)
              w[J].listeners.hasOwnProperty(V) && z(V, w[J].listeners[V]);
        }
      }
      function U(w, q) {
        typeof w == "function" && (w = w(new n.Converter())), n.helper.isArray(w) || (w = [w]);
        var W = y(w, q);
        if (!W.valid)
          throw Error(W.error);
        for (var J = 0; J < w.length; ++J)
          switch (w[J].type) {
            case "lang":
              o.push(w[J]);
              break;
            case "output":
              l.push(w[J]);
              break;
            default:
              throw Error("Extension loader error: Type unrecognized!!!");
          }
      }
      function z(w, q) {
        if (!n.helper.isString(w))
          throw Error("Invalid argument in converter.listen() method: name must be a string, but " + typeof w + " given");
        if (typeof q != "function")
          throw Error("Invalid argument in converter.listen() method: callback must be a function, but " + typeof q + " given");
        u.hasOwnProperty(w) || (u[w] = []), u[w].push(q);
      }
      function H(w) {
        var q = w.match(/^\s*/)[0].length, W = new RegExp("^\\s{0," + q + "}", "gm");
        return w.replace(W, "");
      }
      this._dispatch = function(w, q, W, J) {
        if (u.hasOwnProperty(w))
          for (var V = 0; V < u[w].length; ++V) {
            var E = u[w][V](w, q, this, W, J);
            E && typeof E < "u" && (q = E);
          }
        return q;
      }, this.listen = function(w, q) {
        return z(w, q), this;
      }, this.makeHtml = function(w) {
        if (!w)
          return w;
        var q = {
          gHtmlBlocks: [],
          gHtmlMdBlocks: [],
          gHtmlSpans: [],
          gUrls: {},
          gTitles: {},
          gDimensions: {},
          gListLevel: 0,
          hashLinkCounts: {},
          langExtensions: o,
          outputModifiers: l,
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
`), w = w.replace(/\u00A0/g, "&nbsp;"), i.smartIndentationFix && (w = H(w)), w = `

` + w + `

`, w = n.subParser("detab")(w, i, q), w = w.replace(/^[ \t]+$/mg, ""), n.helper.forEach(o, function(W) {
          w = n.subParser("runExtension")(W, w, i, q);
        }), w = n.subParser("metadata")(w, i, q), w = n.subParser("hashPreCodeTags")(w, i, q), w = n.subParser("githubCodeBlocks")(w, i, q), w = n.subParser("hashHTMLBlocks")(w, i, q), w = n.subParser("hashCodeTags")(w, i, q), w = n.subParser("stripLinkDefinitions")(w, i, q), w = n.subParser("blockGamut")(w, i, q), w = n.subParser("unhashHTMLSpans")(w, i, q), w = n.subParser("unescapeSpecialChars")(w, i, q), w = w.replace(/¨D/g, "$$"), w = w.replace(/¨T/g, "¨"), w = n.subParser("completeHTMLDocument")(w, i, q), n.helper.forEach(l, function(W) {
          w = n.subParser("runExtension")(W, w, i, q);
        }), f = q.metadata, w;
      }, this.makeMarkdown = this.makeMd = function(w, q) {
        if (w = w.replace(/\r\n/g, `
`), w = w.replace(/\r/g, `
`), w = w.replace(/>[ \t]+</, ">¨NBSP;<"), !q)
          if (window && window.document)
            q = window.document;
          else
            throw new Error("HTMLParser is undefined. If in a webworker or nodejs environment, you need to provide a WHATWG DOM and HTML such as JSDOM");
        var W = q.createElement("div");
        W.innerHTML = w;
        var J = {
          preList: d(W)
        };
        O(W);
        for (var V = W.childNodes, E = "", F = 0; F < V.length; F++)
          E += n.subParser("makeMarkdown.node")(V[F], J);
        function O(k) {
          for (var R = 0; R < k.childNodes.length; ++R) {
            var G = k.childNodes[R];
            G.nodeType === 3 ? !/\S/.test(G.nodeValue) && !/^[ ]+$/.test(G.nodeValue) ? (k.removeChild(G), --R) : (G.nodeValue = G.nodeValue.split(`
`).join(" "), G.nodeValue = G.nodeValue.replace(/(\s)+/g, "$1")) : G.nodeType === 1 && O(G);
          }
        }
        function d(k) {
          for (var R = k.querySelectorAll("pre"), G = [], K = 0; K < R.length; ++K)
            if (R[K].childElementCount === 1 && R[K].firstChild.tagName.toLowerCase() === "code") {
              var X = R[K].firstChild.innerHTML.trim(), ee = R[K].firstChild.getAttribute("data-language") || "";
              if (ee === "")
                for (var ie = R[K].firstChild.className.split(" "), xe = 0; xe < ie.length; ++xe) {
                  var qe = ie[xe].match(/^language-(.+)$/);
                  if (qe !== null) {
                    ee = qe[1];
                    break;
                  }
                }
              X = n.helper.unescapeHTMLEntities(X), G.push(X), R[K].outerHTML = '<precode language="' + ee + '" precodenum="' + K.toString() + '"></precode>';
            } else
              G.push(R[K].innerHTML), R[K].innerHTML = "", R[K].setAttribute("prenum", K.toString());
          return G;
        }
        return E;
      }, this.setOption = function(w, q) {
        i[w] = q;
      }, this.getOption = function(w) {
        return i[w];
      }, this.getOptions = function() {
        return i;
      }, this.addExtension = function(w, q) {
        q = q || null, B(w, q);
      }, this.useExtension = function(w) {
        B(w);
      }, this.setFlavor = function(w) {
        if (!_.hasOwnProperty(w))
          throw Error(w + " flavor was not found");
        var q = _[w];
        m = w;
        for (var W in q)
          q.hasOwnProperty(W) && (i[W] = q[W]);
      }, this.getFlavor = function() {
        return m;
      }, this.removeExtension = function(w) {
        n.helper.isArray(w) || (w = [w]);
        for (var q = 0; q < w.length; ++q) {
          for (var W = w[q], J = 0; J < o.length; ++J)
            o[J] === W && o.splice(J, 1);
          for (var V = 0; V < l.length; ++V)
            l[V] === W && l.splice(V, 1);
        }
      }, this.getAllExtensions = function() {
        return {
          language: o,
          output: l
        };
      }, this.getMetadata = function(w) {
        return w ? f.raw : f.parsed;
      }, this.getMetadataFormat = function() {
        return f.format;
      }, this._setMetadataPair = function(w, q) {
        f.parsed[w] = q;
      }, this._setMetadataFormat = function(w) {
        f.format = w;
      }, this._setMetadataRaw = function(w) {
        f.raw = w;
      };
    }, n.subParser("anchors", function(r, i, o) {
      r = o.converter._dispatch("anchors.before", r, i, o);
      var l = function(u, m, f, x, B, U, z) {
        if (n.helper.isUndefined(z) && (z = ""), f = f.toLowerCase(), u.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          x = "";
        else if (!x)
          if (f || (f = m.toLowerCase().replace(/ ?\n/g, " ")), x = "#" + f, !n.helper.isUndefined(o.gUrls[f]))
            x = o.gUrls[f], n.helper.isUndefined(o.gTitles[f]) || (z = o.gTitles[f]);
          else
            return u;
        x = x.replace(n.helper.regexes.asteriskDashAndColon, n.helper.escapeCharactersCallback);
        var H = '<a href="' + x + '"';
        return z !== "" && z !== null && (z = z.replace(/"/g, "&quot;"), z = z.replace(n.helper.regexes.asteriskDashAndColon, n.helper.escapeCharactersCallback), H += ' title="' + z + '"'), i.openLinksInNewWindow && !/^#/.test(x) && (H += ' rel="noopener noreferrer" target="¨E95Eblank"'), H += ">" + m + "</a>", H;
      };
      return r = r.replace(/\[((?:\[[^\]]*]|[^\[\]])*)] ?(?:\n *)?\[(.*?)]()()()()/g, l), r = r.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<([^>]*)>(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        l
      ), r = r.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        l
      ), r = r.replace(/\[([^\[\]]+)]()()()()()/g, l), i.ghMentions && (r = r.replace(/(^|\s)(\\)?(@([a-z\d]+(?:[a-z\d.-]+?[a-z\d]+)*))/gmi, function(u, m, f, x, B) {
        if (f === "\\")
          return m + x;
        if (!n.helper.isString(i.ghMentionsLink))
          throw new Error("ghMentionsLink option must be a string");
        var U = i.ghMentionsLink.replace(/\{u}/g, B), z = "";
        return i.openLinksInNewWindow && (z = ' rel="noopener noreferrer" target="¨E95Eblank"'), m + '<a href="' + U + '"' + z + ">" + x + "</a>";
      })), r = o.converter._dispatch("anchors.after", r, i, o), r;
    });
    var L = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+?\.[^'">\s]+?)()(\1)?(?=\s|$)(?!["<>])/gi, A = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+?)([.!?,()\[\]])?(\1)?(?=\s|$)(?!["<>])/gi, N = /()<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)()>()/gi, C = /(^|\s)(?:mailto:)?([A-Za-z0-9!#$%&'*+-/=?^_`{|}~.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?=$|\s)/gmi, T = /<()(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi, v = function(r) {
      return function(i, o, l, u, m, f, x) {
        l = l.replace(n.helper.regexes.asteriskDashAndColon, n.helper.escapeCharactersCallback);
        var B = l, U = "", z = "", H = o || "", w = x || "";
        return /^www\./i.test(l) && (l = l.replace(/^www\./i, "http://www.")), r.excludeTrailingPunctuationFromURLs && f && (U = f), r.openLinksInNewWindow && (z = ' rel="noopener noreferrer" target="¨E95Eblank"'), H + '<a href="' + l + '"' + z + ">" + B + "</a>" + U + w;
      };
    }, j = function(r, i) {
      return function(o, l, u) {
        var m = "mailto:";
        return l = l || "", u = n.subParser("unescapeSpecialChars")(u, r, i), r.encodeEmails ? (m = n.helper.encodeEmailAddress(m + u), u = n.helper.encodeEmailAddress(u)) : m = m + u, l + '<a href="' + m + '">' + u + "</a>";
      };
    };
    n.subParser("autoLinks", function(r, i, o) {
      return r = o.converter._dispatch("autoLinks.before", r, i, o), r = r.replace(N, v(i)), r = r.replace(T, j(i, o)), r = o.converter._dispatch("autoLinks.after", r, i, o), r;
    }), n.subParser("simplifiedAutoLinks", function(r, i, o) {
      return i.simplifiedAutoLink && (r = o.converter._dispatch("simplifiedAutoLinks.before", r, i, o), i.excludeTrailingPunctuationFromURLs ? r = r.replace(A, v(i)) : r = r.replace(L, v(i)), r = r.replace(C, j(i, o)), r = o.converter._dispatch("simplifiedAutoLinks.after", r, i, o)), r;
    }), n.subParser("blockGamut", function(r, i, o) {
      return r = o.converter._dispatch("blockGamut.before", r, i, o), r = n.subParser("blockQuotes")(r, i, o), r = n.subParser("headers")(r, i, o), r = n.subParser("horizontalRule")(r, i, o), r = n.subParser("lists")(r, i, o), r = n.subParser("codeBlocks")(r, i, o), r = n.subParser("tables")(r, i, o), r = n.subParser("hashHTMLBlocks")(r, i, o), r = n.subParser("paragraphs")(r, i, o), r = o.converter._dispatch("blockGamut.after", r, i, o), r;
    }), n.subParser("blockQuotes", function(r, i, o) {
      r = o.converter._dispatch("blockQuotes.before", r, i, o), r = r + `

`;
      var l = /(^ {0,3}>[ \t]?.+\n(.+\n)*\n*)+/gm;
      return i.splitAdjacentBlockquotes && (l = /^ {0,3}>[\s\S]*?(?:\n\n)/gm), r = r.replace(l, function(u) {
        return u = u.replace(/^[ \t]*>[ \t]?/gm, ""), u = u.replace(/¨0/g, ""), u = u.replace(/^[ \t]+$/gm, ""), u = n.subParser("githubCodeBlocks")(u, i, o), u = n.subParser("blockGamut")(u, i, o), u = u.replace(/(^|\n)/g, "$1  "), u = u.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(m, f) {
          var x = f;
          return x = x.replace(/^  /mg, "¨0"), x = x.replace(/¨0/g, ""), x;
        }), n.subParser("hashBlock")(`<blockquote>
` + u + `
</blockquote>`, i, o);
      }), r = o.converter._dispatch("blockQuotes.after", r, i, o), r;
    }), n.subParser("codeBlocks", function(r, i, o) {
      r = o.converter._dispatch("codeBlocks.before", r, i, o), r += "¨0";
      var l = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=¨0))/g;
      return r = r.replace(l, function(u, m, f) {
        var x = m, B = f, U = `
`;
        return x = n.subParser("outdent")(x, i, o), x = n.subParser("encodeCode")(x, i, o), x = n.subParser("detab")(x, i, o), x = x.replace(/^\n+/g, ""), x = x.replace(/\n+$/g, ""), i.omitExtraWLInCodeBlocks && (U = ""), x = "<pre><code>" + x + U + "</code></pre>", n.subParser("hashBlock")(x, i, o) + B;
      }), r = r.replace(/¨0/, ""), r = o.converter._dispatch("codeBlocks.after", r, i, o), r;
    }), n.subParser("codeSpans", function(r, i, o) {
      return r = o.converter._dispatch("codeSpans.before", r, i, o), typeof r > "u" && (r = ""), r = r.replace(
        /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
        function(l, u, m, f) {
          var x = f;
          return x = x.replace(/^([ \t]*)/g, ""), x = x.replace(/[ \t]*$/g, ""), x = n.subParser("encodeCode")(x, i, o), x = u + "<code>" + x + "</code>", x = n.subParser("hashHTMLSpans")(x, i, o), x;
        }
      ), r = o.converter._dispatch("codeSpans.after", r, i, o), r;
    }), n.subParser("completeHTMLDocument", function(r, i, o) {
      if (!i.completeHTMLDocument)
        return r;
      r = o.converter._dispatch("completeHTMLDocument.before", r, i, o);
      var l = "html", u = `<!DOCTYPE HTML>
`, m = "", f = `<meta charset="utf-8">
`, x = "", B = "";
      typeof o.metadata.parsed.doctype < "u" && (u = "<!DOCTYPE " + o.metadata.parsed.doctype + `>
`, l = o.metadata.parsed.doctype.toString().toLowerCase(), (l === "html" || l === "html5") && (f = '<meta charset="utf-8">'));
      for (var U in o.metadata.parsed)
        if (o.metadata.parsed.hasOwnProperty(U))
          switch (U.toLowerCase()) {
            case "doctype":
              break;
            case "title":
              m = "<title>" + o.metadata.parsed.title + `</title>
`;
              break;
            case "charset":
              l === "html" || l === "html5" ? f = '<meta charset="' + o.metadata.parsed.charset + `">
` : f = '<meta name="charset" content="' + o.metadata.parsed.charset + `">
`;
              break;
            case "language":
            case "lang":
              x = ' lang="' + o.metadata.parsed[U] + '"', B += '<meta name="' + U + '" content="' + o.metadata.parsed[U] + `">
`;
              break;
            default:
              B += '<meta name="' + U + '" content="' + o.metadata.parsed[U] + `">
`;
          }
      return r = u + "<html" + x + `>
<head>
` + m + f + B + `</head>
<body>
` + r.trim() + `
</body>
</html>`, r = o.converter._dispatch("completeHTMLDocument.after", r, i, o), r;
    }), n.subParser("detab", function(r, i, o) {
      return r = o.converter._dispatch("detab.before", r, i, o), r = r.replace(/\t(?=\t)/g, "    "), r = r.replace(/\t/g, "¨A¨B"), r = r.replace(/¨B(.+?)¨A/g, function(l, u) {
        for (var m = u, f = 4 - m.length % 4, x = 0; x < f; x++)
          m += " ";
        return m;
      }), r = r.replace(/¨A/g, "    "), r = r.replace(/¨B/g, ""), r = o.converter._dispatch("detab.after", r, i, o), r;
    }), n.subParser("ellipsis", function(r, i, o) {
      return i.ellipsis && (r = o.converter._dispatch("ellipsis.before", r, i, o), r = r.replace(/\.\.\./g, "…"), r = o.converter._dispatch("ellipsis.after", r, i, o)), r;
    }), n.subParser("emoji", function(r, i, o) {
      if (!i.emoji)
        return r;
      r = o.converter._dispatch("emoji.before", r, i, o);
      var l = /:([\S]+?):/g;
      return r = r.replace(l, function(u, m) {
        return n.helper.emojis.hasOwnProperty(m) ? n.helper.emojis[m] : u;
      }), r = o.converter._dispatch("emoji.after", r, i, o), r;
    }), n.subParser("encodeAmpsAndAngles", function(r, i, o) {
      return r = o.converter._dispatch("encodeAmpsAndAngles.before", r, i, o), r = r.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;"), r = r.replace(/<(?![a-z\/?$!])/gi, "&lt;"), r = r.replace(/</g, "&lt;"), r = r.replace(/>/g, "&gt;"), r = o.converter._dispatch("encodeAmpsAndAngles.after", r, i, o), r;
    }), n.subParser("encodeBackslashEscapes", function(r, i, o) {
      return r = o.converter._dispatch("encodeBackslashEscapes.before", r, i, o), r = r.replace(/\\(\\)/g, n.helper.escapeCharactersCallback), r = r.replace(/\\([`*_{}\[\]()>#+.!~=|:-])/g, n.helper.escapeCharactersCallback), r = o.converter._dispatch("encodeBackslashEscapes.after", r, i, o), r;
    }), n.subParser("encodeCode", function(r, i, o) {
      return r = o.converter._dispatch("encodeCode.before", r, i, o), r = r.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/([*_{}\[\]\\=~-])/g, n.helper.escapeCharactersCallback), r = o.converter._dispatch("encodeCode.after", r, i, o), r;
    }), n.subParser("escapeSpecialCharsWithinTagAttributes", function(r, i, o) {
      r = o.converter._dispatch("escapeSpecialCharsWithinTagAttributes.before", r, i, o);
      var l = /<\/?[a-z\d_:-]+(?:[\s]+[\s\S]+?)?>/gi, u = /<!(--(?:(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>/gi;
      return r = r.replace(l, function(m) {
        return m.replace(/(.)<\/?code>(?=.)/g, "$1`").replace(/([\\`*_~=|])/g, n.helper.escapeCharactersCallback);
      }), r = r.replace(u, function(m) {
        return m.replace(/([\\`*_~=|])/g, n.helper.escapeCharactersCallback);
      }), r = o.converter._dispatch("escapeSpecialCharsWithinTagAttributes.after", r, i, o), r;
    }), n.subParser("githubCodeBlocks", function(r, i, o) {
      return i.ghCodeBlocks ? (r = o.converter._dispatch("githubCodeBlocks.before", r, i, o), r += "¨0", r = r.replace(/(?:^|\n)(?: {0,3})(```+|~~~+)(?: *)([^\s`~]*)\n([\s\S]*?)\n(?: {0,3})\1/g, function(l, u, m, f) {
        var x = i.omitExtraWLInCodeBlocks ? "" : `
`;
        return f = n.subParser("encodeCode")(f, i, o), f = n.subParser("detab")(f, i, o), f = f.replace(/^\n+/g, ""), f = f.replace(/\n+$/g, ""), f = "<pre><code" + (m ? ' class="' + m + " language-" + m + '"' : "") + ">" + f + x + "</code></pre>", f = n.subParser("hashBlock")(f, i, o), `

¨G` + (o.ghCodeBlocks.push({ text: l, codeblock: f }) - 1) + `G

`;
      }), r = r.replace(/¨0/, ""), o.converter._dispatch("githubCodeBlocks.after", r, i, o)) : r;
    }), n.subParser("hashBlock", function(r, i, o) {
      return r = o.converter._dispatch("hashBlock.before", r, i, o), r = r.replace(/(^\n+|\n+$)/g, ""), r = `

¨K` + (o.gHtmlBlocks.push(r) - 1) + `K

`, r = o.converter._dispatch("hashBlock.after", r, i, o), r;
    }), n.subParser("hashCodeTags", function(r, i, o) {
      r = o.converter._dispatch("hashCodeTags.before", r, i, o);
      var l = function(u, m, f, x) {
        var B = f + n.subParser("encodeCode")(m, i, o) + x;
        return "¨C" + (o.gHtmlSpans.push(B) - 1) + "C";
      };
      return r = n.helper.replaceRecursiveRegExp(r, l, "<code\\b[^>]*>", "</code>", "gim"), r = o.converter._dispatch("hashCodeTags.after", r, i, o), r;
    }), n.subParser("hashElement", function(r, i, o) {
      return function(l, u) {
        var m = u;
        return m = m.replace(/\n\n/g, `
`), m = m.replace(/^\n/, ""), m = m.replace(/\n+$/g, ""), m = `

¨K` + (o.gHtmlBlocks.push(m) - 1) + `K

`, m;
      };
    }), n.subParser("hashHTMLBlocks", function(r, i, o) {
      r = o.converter._dispatch("hashHTMLBlocks.before", r, i, o);
      var l = [
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
      ], u = function(w, q, W, J) {
        var V = w;
        return W.search(/\bmarkdown\b/) !== -1 && (V = W + o.converter.makeHtml(q) + J), `

¨K` + (o.gHtmlBlocks.push(V) - 1) + `K

`;
      };
      i.backslashEscapesHTMLTags && (r = r.replace(/\\<(\/?[^>]+?)>/g, function(w, q) {
        return "&lt;" + q + "&gt;";
      }));
      for (var m = 0; m < l.length; ++m)
        for (var f, x = new RegExp("^ {0,3}(<" + l[m] + "\\b[^>]*>)", "im"), B = "<" + l[m] + "\\b[^>]*>", U = "</" + l[m] + ">"; (f = n.helper.regexIndexOf(r, x)) !== -1; ) {
          var z = n.helper.splitAtIndex(r, f), H = n.helper.replaceRecursiveRegExp(z[1], u, B, U, "im");
          if (H === z[1])
            break;
          r = z[0].concat(H);
        }
      return r = r.replace(
        /(\n {0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
        n.subParser("hashElement")(r, i, o)
      ), r = n.helper.replaceRecursiveRegExp(r, function(w) {
        return `

¨K` + (o.gHtmlBlocks.push(w) - 1) + `K

`;
      }, "^ {0,3}<!--", "-->", "gm"), r = r.replace(
        /(?:\n\n)( {0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
        n.subParser("hashElement")(r, i, o)
      ), r = o.converter._dispatch("hashHTMLBlocks.after", r, i, o), r;
    }), n.subParser("hashHTMLSpans", function(r, i, o) {
      r = o.converter._dispatch("hashHTMLSpans.before", r, i, o);
      function l(u) {
        return "¨C" + (o.gHtmlSpans.push(u) - 1) + "C";
      }
      return r = r.replace(/<[^>]+?\/>/gi, function(u) {
        return l(u);
      }), r = r.replace(/<([^>]+?)>[\s\S]*?<\/\1>/g, function(u) {
        return l(u);
      }), r = r.replace(/<([^>]+?)\s[^>]+?>[\s\S]*?<\/\1>/g, function(u) {
        return l(u);
      }), r = r.replace(/<[^>]+?>/gi, function(u) {
        return l(u);
      }), r = o.converter._dispatch("hashHTMLSpans.after", r, i, o), r;
    }), n.subParser("unhashHTMLSpans", function(r, i, o) {
      r = o.converter._dispatch("unhashHTMLSpans.before", r, i, o);
      for (var l = 0; l < o.gHtmlSpans.length; ++l) {
        for (var u = o.gHtmlSpans[l], m = 0; /¨C(\d+)C/.test(u); ) {
          var f = RegExp.$1;
          if (u = u.replace("¨C" + f + "C", o.gHtmlSpans[f]), m === 10) {
            console.error("maximum nesting of 10 spans reached!!!");
            break;
          }
          ++m;
        }
        r = r.replace("¨C" + l + "C", u);
      }
      return r = o.converter._dispatch("unhashHTMLSpans.after", r, i, o), r;
    }), n.subParser("hashPreCodeTags", function(r, i, o) {
      r = o.converter._dispatch("hashPreCodeTags.before", r, i, o);
      var l = function(u, m, f, x) {
        var B = f + n.subParser("encodeCode")(m, i, o) + x;
        return `

¨G` + (o.ghCodeBlocks.push({ text: u, codeblock: B }) - 1) + `G

`;
      };
      return r = n.helper.replaceRecursiveRegExp(r, l, "^ {0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>", "^ {0,3}</code>\\s*</pre>", "gim"), r = o.converter._dispatch("hashPreCodeTags.after", r, i, o), r;
    }), n.subParser("headers", function(r, i, o) {
      r = o.converter._dispatch("headers.before", r, i, o);
      var l = isNaN(parseInt(i.headerLevelStart)) ? 1 : parseInt(i.headerLevelStart), u = i.smoothLivePreview ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm, m = i.smoothLivePreview ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;
      r = r.replace(u, function(B, U) {
        var z = n.subParser("spanGamut")(U, i, o), H = i.noHeaderId ? "" : ' id="' + x(U) + '"', w = l, q = "<h" + w + H + ">" + z + "</h" + w + ">";
        return n.subParser("hashBlock")(q, i, o);
      }), r = r.replace(m, function(B, U) {
        var z = n.subParser("spanGamut")(U, i, o), H = i.noHeaderId ? "" : ' id="' + x(U) + '"', w = l + 1, q = "<h" + w + H + ">" + z + "</h" + w + ">";
        return n.subParser("hashBlock")(q, i, o);
      });
      var f = i.requireSpaceBeforeHeadingText ? /^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm : /^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm;
      r = r.replace(f, function(B, U, z) {
        var H = z;
        i.customizedHeaderId && (H = z.replace(/\s?\{([^{]+?)}\s*$/, ""));
        var w = n.subParser("spanGamut")(H, i, o), q = i.noHeaderId ? "" : ' id="' + x(z) + '"', W = l - 1 + U.length, J = "<h" + W + q + ">" + w + "</h" + W + ">";
        return n.subParser("hashBlock")(J, i, o);
      });
      function x(B) {
        var U, z;
        if (i.customizedHeaderId) {
          var H = B.match(/\{([^{]+?)}\s*$/);
          H && H[1] && (B = H[1]);
        }
        return U = B, n.helper.isString(i.prefixHeaderId) ? z = i.prefixHeaderId : i.prefixHeaderId === !0 ? z = "section-" : z = "", i.rawPrefixHeaderId || (U = z + U), i.ghCompatibleHeaderId ? U = U.replace(/ /g, "-").replace(/&amp;/g, "").replace(/¨T/g, "").replace(/¨D/g, "").replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g, "").toLowerCase() : i.rawHeaderId ? U = U.replace(/ /g, "-").replace(/&amp;/g, "&").replace(/¨T/g, "¨").replace(/¨D/g, "$").replace(/["']/g, "-").toLowerCase() : U = U.replace(/[^\w]/g, "").toLowerCase(), i.rawPrefixHeaderId && (U = z + U), o.hashLinkCounts[U] ? U = U + "-" + o.hashLinkCounts[U]++ : o.hashLinkCounts[U] = 1, U;
      }
      return r = o.converter._dispatch("headers.after", r, i, o), r;
    }), n.subParser("horizontalRule", function(r, i, o) {
      r = o.converter._dispatch("horizontalRule.before", r, i, o);
      var l = n.subParser("hashBlock")("<hr />", i, o);
      return r = r.replace(/^ {0,2}( ?-){3,}[ \t]*$/gm, l), r = r.replace(/^ {0,2}( ?\*){3,}[ \t]*$/gm, l), r = r.replace(/^ {0,2}( ?_){3,}[ \t]*$/gm, l), r = o.converter._dispatch("horizontalRule.after", r, i, o), r;
    }), n.subParser("images", function(r, i, o) {
      r = o.converter._dispatch("images.before", r, i, o);
      var l = /!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, u = /!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)/g, m = /!\[([^\]]*?)][ \t]*()\([ \t]?<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, f = /!\[([^\]]*?)] ?(?:\n *)?\[([\s\S]*?)]()()()()()/g, x = /!\[([^\[\]]+)]()()()()()/g;
      function B(z, H, w, q, W, J, V, E) {
        return q = q.replace(/\s/g, ""), U(z, H, w, q, W, J, V, E);
      }
      function U(z, H, w, q, W, J, V, E) {
        var F = o.gUrls, O = o.gTitles, d = o.gDimensions;
        if (w = w.toLowerCase(), E || (E = ""), z.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          q = "";
        else if (q === "" || q === null)
          if ((w === "" || w === null) && (w = H.toLowerCase().replace(/ ?\n/g, " ")), q = "#" + w, !n.helper.isUndefined(F[w]))
            q = F[w], n.helper.isUndefined(O[w]) || (E = O[w]), n.helper.isUndefined(d[w]) || (W = d[w].width, J = d[w].height);
          else
            return z;
        H = H.replace(/"/g, "&quot;").replace(n.helper.regexes.asteriskDashAndColon, n.helper.escapeCharactersCallback), q = q.replace(n.helper.regexes.asteriskDashAndColon, n.helper.escapeCharactersCallback);
        var k = '<img src="' + q + '" alt="' + H + '"';
        return E && n.helper.isString(E) && (E = E.replace(/"/g, "&quot;").replace(n.helper.regexes.asteriskDashAndColon, n.helper.escapeCharactersCallback), k += ' title="' + E + '"'), W && J && (W = W === "*" ? "auto" : W, J = J === "*" ? "auto" : J, k += ' width="' + W + '"', k += ' height="' + J + '"'), k += " />", k;
      }
      return r = r.replace(f, U), r = r.replace(m, B), r = r.replace(u, U), r = r.replace(l, U), r = r.replace(x, U), r = o.converter._dispatch("images.after", r, i, o), r;
    }), n.subParser("italicsAndBold", function(r, i, o) {
      r = o.converter._dispatch("italicsAndBold.before", r, i, o);
      function l(u, m, f) {
        return m + u + f;
      }
      return i.literalMidWordUnderscores ? (r = r.replace(/\b___(\S[\s\S]*?)___\b/g, function(u, m) {
        return l(m, "<strong><em>", "</em></strong>");
      }), r = r.replace(/\b__(\S[\s\S]*?)__\b/g, function(u, m) {
        return l(m, "<strong>", "</strong>");
      }), r = r.replace(/\b_(\S[\s\S]*?)_\b/g, function(u, m) {
        return l(m, "<em>", "</em>");
      })) : (r = r.replace(/___(\S[\s\S]*?)___/g, function(u, m) {
        return /\S$/.test(m) ? l(m, "<strong><em>", "</em></strong>") : u;
      }), r = r.replace(/__(\S[\s\S]*?)__/g, function(u, m) {
        return /\S$/.test(m) ? l(m, "<strong>", "</strong>") : u;
      }), r = r.replace(/_([^\s_][\s\S]*?)_/g, function(u, m) {
        return /\S$/.test(m) ? l(m, "<em>", "</em>") : u;
      })), i.literalMidWordAsterisks ? (r = r.replace(/([^*]|^)\B\*\*\*(\S[\s\S]*?)\*\*\*\B(?!\*)/g, function(u, m, f) {
        return l(f, m + "<strong><em>", "</em></strong>");
      }), r = r.replace(/([^*]|^)\B\*\*(\S[\s\S]*?)\*\*\B(?!\*)/g, function(u, m, f) {
        return l(f, m + "<strong>", "</strong>");
      }), r = r.replace(/([^*]|^)\B\*(\S[\s\S]*?)\*\B(?!\*)/g, function(u, m, f) {
        return l(f, m + "<em>", "</em>");
      })) : (r = r.replace(/\*\*\*(\S[\s\S]*?)\*\*\*/g, function(u, m) {
        return /\S$/.test(m) ? l(m, "<strong><em>", "</em></strong>") : u;
      }), r = r.replace(/\*\*(\S[\s\S]*?)\*\*/g, function(u, m) {
        return /\S$/.test(m) ? l(m, "<strong>", "</strong>") : u;
      }), r = r.replace(/\*([^\s*][\s\S]*?)\*/g, function(u, m) {
        return /\S$/.test(m) ? l(m, "<em>", "</em>") : u;
      })), r = o.converter._dispatch("italicsAndBold.after", r, i, o), r;
    }), n.subParser("lists", function(r, i, o) {
      function l(f, x) {
        o.gListLevel++, f = f.replace(/\n{2,}$/, `
`), f += "¨0";
        var B = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0| {0,3}([*+-]|\d+[.])[ \t]+))/gm, U = /\n[ \t]*\n(?!¨0)/.test(f);
        return i.disableForced4SpacesIndentedSublists && (B = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0|\2([*+-]|\d+[.])[ \t]+))/gm), f = f.replace(B, function(z, H, w, q, W, J, V) {
          V = V && V.trim() !== "";
          var E = n.subParser("outdent")(W, i, o), F = "";
          return J && i.tasklists && (F = ' class="task-list-item" style="list-style-type: none;"', E = E.replace(/^[ \t]*\[(x|X| )?]/m, function() {
            var O = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
            return V && (O += " checked"), O += ">", O;
          })), E = E.replace(/^([-*+]|\d\.)[ \t]+[\S\n ]*/g, function(O) {
            return "¨A" + O;
          }), H || E.search(/\n{2,}/) > -1 ? (E = n.subParser("githubCodeBlocks")(E, i, o), E = n.subParser("blockGamut")(E, i, o)) : (E = n.subParser("lists")(E, i, o), E = E.replace(/\n$/, ""), E = n.subParser("hashHTMLBlocks")(E, i, o), E = E.replace(/\n\n+/g, `

`), U ? E = n.subParser("paragraphs")(E, i, o) : E = n.subParser("spanGamut")(E, i, o)), E = E.replace("¨A", ""), E = "<li" + F + ">" + E + `</li>
`, E;
        }), f = f.replace(/¨0/g, ""), o.gListLevel--, x && (f = f.replace(/\s+$/, "")), f;
      }
      function u(f, x) {
        if (x === "ol") {
          var B = f.match(/^ *(\d+)\./);
          if (B && B[1] !== "1")
            return ' start="' + B[1] + '"';
        }
        return "";
      }
      function m(f, x, B) {
        var U = i.disableForced4SpacesIndentedSublists ? /^ ?\d+\.[ \t]/gm : /^ {0,3}\d+\.[ \t]/gm, z = i.disableForced4SpacesIndentedSublists ? /^ ?[*+-][ \t]/gm : /^ {0,3}[*+-][ \t]/gm, H = x === "ul" ? U : z, w = "";
        if (f.search(H) !== -1)
          (function W(J) {
            var V = J.search(H), E = u(f, x);
            V !== -1 ? (w += `

<` + x + E + `>
` + l(J.slice(0, V), !!B) + "</" + x + `>
`, x = x === "ul" ? "ol" : "ul", H = x === "ul" ? U : z, W(J.slice(V))) : w += `

<` + x + E + `>
` + l(J, !!B) + "</" + x + `>
`;
          })(f);
        else {
          var q = u(f, x);
          w = `

<` + x + q + `>
` + l(f, !!B) + "</" + x + `>
`;
        }
        return w;
      }
      return r = o.converter._dispatch("lists.before", r, i, o), r += "¨0", o.gListLevel ? r = r.replace(
        /^(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(f, x, B) {
          var U = B.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return m(x, U, !0);
        }
      ) : r = r.replace(
        /(\n\n|^\n?)(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(f, x, B, U) {
          var z = U.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return m(B, z, !1);
        }
      ), r = r.replace(/¨0/, ""), r = o.converter._dispatch("lists.after", r, i, o), r;
    }), n.subParser("metadata", function(r, i, o) {
      if (!i.metadata)
        return r;
      r = o.converter._dispatch("metadata.before", r, i, o);
      function l(u) {
        o.metadata.raw = u, u = u.replace(/&/g, "&amp;").replace(/"/g, "&quot;"), u = u.replace(/\n {4}/g, " "), u.replace(/^([\S ]+): +([\s\S]+?)$/gm, function(m, f, x) {
          return o.metadata.parsed[f] = x, "";
        });
      }
      return r = r.replace(/^\s*«««+(\S*?)\n([\s\S]+?)\n»»»+\n/, function(u, m, f) {
        return l(f), "¨M";
      }), r = r.replace(/^\s*---+(\S*?)\n([\s\S]+?)\n---+\n/, function(u, m, f) {
        return m && (o.metadata.format = m), l(f), "¨M";
      }), r = r.replace(/¨M/g, ""), r = o.converter._dispatch("metadata.after", r, i, o), r;
    }), n.subParser("outdent", function(r, i, o) {
      return r = o.converter._dispatch("outdent.before", r, i, o), r = r.replace(/^(\t|[ ]{1,4})/gm, "¨0"), r = r.replace(/¨0/g, ""), r = o.converter._dispatch("outdent.after", r, i, o), r;
    }), n.subParser("paragraphs", function(r, i, o) {
      r = o.converter._dispatch("paragraphs.before", r, i, o), r = r.replace(/^\n+/g, ""), r = r.replace(/\n+$/g, "");
      for (var l = r.split(/\n{2,}/g), u = [], m = l.length, f = 0; f < m; f++) {
        var x = l[f];
        x.search(/¨(K|G)(\d+)\1/g) >= 0 ? u.push(x) : x.search(/\S/) >= 0 && (x = n.subParser("spanGamut")(x, i, o), x = x.replace(/^([ \t]*)/g, "<p>"), x += "</p>", u.push(x));
      }
      for (m = u.length, f = 0; f < m; f++) {
        for (var B = "", U = u[f], z = !1; /¨(K|G)(\d+)\1/.test(U); ) {
          var H = RegExp.$1, w = RegExp.$2;
          H === "K" ? B = o.gHtmlBlocks[w] : z ? B = n.subParser("encodeCode")(o.ghCodeBlocks[w].text, i, o) : B = o.ghCodeBlocks[w].codeblock, B = B.replace(/\$/g, "$$$$"), U = U.replace(/(\n\n)?¨(K|G)\d+\2(\n\n)?/, B), /^<pre\b[^>]*>\s*<code\b[^>]*>/.test(U) && (z = !0);
        }
        u[f] = U;
      }
      return r = u.join(`
`), r = r.replace(/^\n+/g, ""), r = r.replace(/\n+$/g, ""), o.converter._dispatch("paragraphs.after", r, i, o);
    }), n.subParser("runExtension", function(r, i, o, l) {
      if (r.filter)
        i = r.filter(i, l.converter, o);
      else if (r.regex) {
        var u = r.regex;
        u instanceof RegExp || (u = new RegExp(u, "g")), i = i.replace(u, r.replace);
      }
      return i;
    }), n.subParser("spanGamut", function(r, i, o) {
      return r = o.converter._dispatch("spanGamut.before", r, i, o), r = n.subParser("codeSpans")(r, i, o), r = n.subParser("escapeSpecialCharsWithinTagAttributes")(r, i, o), r = n.subParser("encodeBackslashEscapes")(r, i, o), r = n.subParser("images")(r, i, o), r = n.subParser("anchors")(r, i, o), r = n.subParser("autoLinks")(r, i, o), r = n.subParser("simplifiedAutoLinks")(r, i, o), r = n.subParser("emoji")(r, i, o), r = n.subParser("underline")(r, i, o), r = n.subParser("italicsAndBold")(r, i, o), r = n.subParser("strikethrough")(r, i, o), r = n.subParser("ellipsis")(r, i, o), r = n.subParser("hashHTMLSpans")(r, i, o), r = n.subParser("encodeAmpsAndAngles")(r, i, o), i.simpleLineBreaks ? /\n\n¨K/.test(r) || (r = r.replace(/\n+/g, `<br />
`)) : r = r.replace(/  +\n/g, `<br />
`), r = o.converter._dispatch("spanGamut.after", r, i, o), r;
    }), n.subParser("strikethrough", function(r, i, o) {
      function l(u) {
        return i.simplifiedAutoLink && (u = n.subParser("simplifiedAutoLinks")(u, i, o)), "<del>" + u + "</del>";
      }
      return i.strikethrough && (r = o.converter._dispatch("strikethrough.before", r, i, o), r = r.replace(/(?:~){2}([\s\S]+?)(?:~){2}/g, function(u, m) {
        return l(m);
      }), r = o.converter._dispatch("strikethrough.after", r, i, o)), r;
    }), n.subParser("stripLinkDefinitions", function(r, i, o) {
      var l = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?([^>\s]+)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=¨0))/gm, u = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n\n|(?=¨0)|(?=\n\[))/gm;
      r += "¨0";
      var m = function(f, x, B, U, z, H, w) {
        return x = x.toLowerCase(), r.toLowerCase().split(x).length - 1 < 2 ? f : (B.match(/^data:.+?\/.+?;base64,/) ? o.gUrls[x] = B.replace(/\s/g, "") : o.gUrls[x] = n.subParser("encodeAmpsAndAngles")(B, i, o), H ? H + w : (w && (o.gTitles[x] = w.replace(/"|'/g, "&quot;")), i.parseImgDimensions && U && z && (o.gDimensions[x] = {
          width: U,
          height: z
        }), ""));
      };
      return r = r.replace(u, m), r = r.replace(l, m), r = r.replace(/¨0/, ""), r;
    }), n.subParser("tables", function(r, i, o) {
      if (!i.tables)
        return r;
      var l = /^ {0,3}\|?.+\|.+\n {0,3}\|?[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:[-=]){2,}[\s\S]+?(?:\n\n|¨0)/gm, u = /^ {0,3}\|.+\|[ \t]*\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n( {0,3}\|.+\|[ \t]*\n)*(?:\n|¨0)/gm;
      function m(z) {
        return /^:[ \t]*--*$/.test(z) ? ' style="text-align:left;"' : /^--*[ \t]*:[ \t]*$/.test(z) ? ' style="text-align:right;"' : /^:[ \t]*--*[ \t]*:$/.test(z) ? ' style="text-align:center;"' : "";
      }
      function f(z, H) {
        var w = "";
        return z = z.trim(), (i.tablesHeaderId || i.tableHeaderId) && (w = ' id="' + z.replace(/ /g, "_").toLowerCase() + '"'), z = n.subParser("spanGamut")(z, i, o), "<th" + w + H + ">" + z + `</th>
`;
      }
      function x(z, H) {
        var w = n.subParser("spanGamut")(z, i, o);
        return "<td" + H + ">" + w + `</td>
`;
      }
      function B(z, H) {
        for (var w = `<table>
<thead>
<tr>
`, q = z.length, W = 0; W < q; ++W)
          w += z[W];
        for (w += `</tr>
</thead>
<tbody>
`, W = 0; W < H.length; ++W) {
          w += `<tr>
`;
          for (var J = 0; J < q; ++J)
            w += H[W][J];
          w += `</tr>
`;
        }
        return w += `</tbody>
</table>
`, w;
      }
      function U(z) {
        var H, w = z.split(`
`);
        for (H = 0; H < w.length; ++H)
          /^ {0,3}\|/.test(w[H]) && (w[H] = w[H].replace(/^ {0,3}\|/, "")), /\|[ \t]*$/.test(w[H]) && (w[H] = w[H].replace(/\|[ \t]*$/, "")), w[H] = n.subParser("codeSpans")(w[H], i, o);
        var q = w[0].split("|").map(function(k) {
          return k.trim();
        }), W = w[1].split("|").map(function(k) {
          return k.trim();
        }), J = [], V = [], E = [], F = [];
        for (w.shift(), w.shift(), H = 0; H < w.length; ++H)
          w[H].trim() !== "" && J.push(
            w[H].split("|").map(function(k) {
              return k.trim();
            })
          );
        if (q.length < W.length)
          return z;
        for (H = 0; H < W.length; ++H)
          E.push(m(W[H]));
        for (H = 0; H < q.length; ++H)
          n.helper.isUndefined(E[H]) && (E[H] = ""), V.push(f(q[H], E[H]));
        for (H = 0; H < J.length; ++H) {
          for (var O = [], d = 0; d < V.length; ++d)
            n.helper.isUndefined(J[H][d]), O.push(x(J[H][d], E[d]));
          F.push(O);
        }
        return B(V, F);
      }
      return r = o.converter._dispatch("tables.before", r, i, o), r = r.replace(/\\(\|)/g, n.helper.escapeCharactersCallback), r = r.replace(l, U), r = r.replace(u, U), r = o.converter._dispatch("tables.after", r, i, o), r;
    }), n.subParser("underline", function(r, i, o) {
      return i.underline && (r = o.converter._dispatch("underline.before", r, i, o), i.literalMidWordUnderscores ? (r = r.replace(/\b___(\S[\s\S]*?)___\b/g, function(l, u) {
        return "<u>" + u + "</u>";
      }), r = r.replace(/\b__(\S[\s\S]*?)__\b/g, function(l, u) {
        return "<u>" + u + "</u>";
      })) : (r = r.replace(/___(\S[\s\S]*?)___/g, function(l, u) {
        return /\S$/.test(u) ? "<u>" + u + "</u>" : l;
      }), r = r.replace(/__(\S[\s\S]*?)__/g, function(l, u) {
        return /\S$/.test(u) ? "<u>" + u + "</u>" : l;
      })), r = r.replace(/(_)/g, n.helper.escapeCharactersCallback), r = o.converter._dispatch("underline.after", r, i, o)), r;
    }), n.subParser("unescapeSpecialChars", function(r, i, o) {
      return r = o.converter._dispatch("unescapeSpecialChars.before", r, i, o), r = r.replace(/¨E(\d+)E/g, function(l, u) {
        var m = parseInt(u);
        return String.fromCharCode(m);
      }), r = o.converter._dispatch("unescapeSpecialChars.after", r, i, o), r;
    }), n.subParser("makeMarkdown.blockquote", function(r, i) {
      var o = "";
      if (r.hasChildNodes())
        for (var l = r.childNodes, u = l.length, m = 0; m < u; ++m) {
          var f = n.subParser("makeMarkdown.node")(l[m], i);
          f !== "" && (o += f);
        }
      return o = o.trim(), o = "> " + o.split(`
`).join(`
> `), o;
    }), n.subParser("makeMarkdown.codeBlock", function(r, i) {
      var o = r.getAttribute("language"), l = r.getAttribute("precodenum");
      return "```" + o + `
` + i.preList[l] + "\n```";
    }), n.subParser("makeMarkdown.codeSpan", function(r) {
      return "`" + r.innerHTML + "`";
    }), n.subParser("makeMarkdown.emphasis", function(r, i) {
      var o = "";
      if (r.hasChildNodes()) {
        o += "*";
        for (var l = r.childNodes, u = l.length, m = 0; m < u; ++m)
          o += n.subParser("makeMarkdown.node")(l[m], i);
        o += "*";
      }
      return o;
    }), n.subParser("makeMarkdown.header", function(r, i, o) {
      var l = new Array(o + 1).join("#"), u = "";
      if (r.hasChildNodes()) {
        u = l + " ";
        for (var m = r.childNodes, f = m.length, x = 0; x < f; ++x)
          u += n.subParser("makeMarkdown.node")(m[x], i);
      }
      return u;
    }), n.subParser("makeMarkdown.hr", function() {
      return "---";
    }), n.subParser("makeMarkdown.image", function(r) {
      var i = "";
      return r.hasAttribute("src") && (i += "![" + r.getAttribute("alt") + "](", i += "<" + r.getAttribute("src") + ">", r.hasAttribute("width") && r.hasAttribute("height") && (i += " =" + r.getAttribute("width") + "x" + r.getAttribute("height")), r.hasAttribute("title") && (i += ' "' + r.getAttribute("title") + '"'), i += ")"), i;
    }), n.subParser("makeMarkdown.links", function(r, i) {
      var o = "";
      if (r.hasChildNodes() && r.hasAttribute("href")) {
        var l = r.childNodes, u = l.length;
        o = "[";
        for (var m = 0; m < u; ++m)
          o += n.subParser("makeMarkdown.node")(l[m], i);
        o += "](", o += "<" + r.getAttribute("href") + ">", r.hasAttribute("title") && (o += ' "' + r.getAttribute("title") + '"'), o += ")";
      }
      return o;
    }), n.subParser("makeMarkdown.list", function(r, i, o) {
      var l = "";
      if (!r.hasChildNodes())
        return "";
      for (var u = r.childNodes, m = u.length, f = r.getAttribute("start") || 1, x = 0; x < m; ++x)
        if (!(typeof u[x].tagName > "u" || u[x].tagName.toLowerCase() !== "li")) {
          var B = "";
          o === "ol" ? B = f.toString() + ". " : B = "- ", l += B + n.subParser("makeMarkdown.listItem")(u[x], i), ++f;
        }
      return l += `
<!-- -->
`, l.trim();
    }), n.subParser("makeMarkdown.listItem", function(r, i) {
      for (var o = "", l = r.childNodes, u = l.length, m = 0; m < u; ++m)
        o += n.subParser("makeMarkdown.node")(l[m], i);
      return /\n$/.test(o) ? o = o.split(`
`).join(`
    `).replace(/^ {4}$/gm, "").replace(/\n\n+/g, `

`) : o += `
`, o;
    }), n.subParser("makeMarkdown.node", function(r, i, o) {
      o = o || !1;
      var l = "";
      if (r.nodeType === 3)
        return n.subParser("makeMarkdown.txt")(r, i);
      if (r.nodeType === 8)
        return "<!--" + r.data + `-->

`;
      if (r.nodeType !== 1)
        return "";
      var u = r.tagName.toLowerCase();
      switch (u) {
        case "h1":
          o || (l = n.subParser("makeMarkdown.header")(r, i, 1) + `

`);
          break;
        case "h2":
          o || (l = n.subParser("makeMarkdown.header")(r, i, 2) + `

`);
          break;
        case "h3":
          o || (l = n.subParser("makeMarkdown.header")(r, i, 3) + `

`);
          break;
        case "h4":
          o || (l = n.subParser("makeMarkdown.header")(r, i, 4) + `

`);
          break;
        case "h5":
          o || (l = n.subParser("makeMarkdown.header")(r, i, 5) + `

`);
          break;
        case "h6":
          o || (l = n.subParser("makeMarkdown.header")(r, i, 6) + `

`);
          break;
        case "p":
          o || (l = n.subParser("makeMarkdown.paragraph")(r, i) + `

`);
          break;
        case "blockquote":
          o || (l = n.subParser("makeMarkdown.blockquote")(r, i) + `

`);
          break;
        case "hr":
          o || (l = n.subParser("makeMarkdown.hr")(r, i) + `

`);
          break;
        case "ol":
          o || (l = n.subParser("makeMarkdown.list")(r, i, "ol") + `

`);
          break;
        case "ul":
          o || (l = n.subParser("makeMarkdown.list")(r, i, "ul") + `

`);
          break;
        case "precode":
          o || (l = n.subParser("makeMarkdown.codeBlock")(r, i) + `

`);
          break;
        case "pre":
          o || (l = n.subParser("makeMarkdown.pre")(r, i) + `

`);
          break;
        case "table":
          o || (l = n.subParser("makeMarkdown.table")(r, i) + `

`);
          break;
        case "code":
          l = n.subParser("makeMarkdown.codeSpan")(r, i);
          break;
        case "em":
        case "i":
          l = n.subParser("makeMarkdown.emphasis")(r, i);
          break;
        case "strong":
        case "b":
          l = n.subParser("makeMarkdown.strong")(r, i);
          break;
        case "del":
          l = n.subParser("makeMarkdown.strikethrough")(r, i);
          break;
        case "a":
          l = n.subParser("makeMarkdown.links")(r, i);
          break;
        case "img":
          l = n.subParser("makeMarkdown.image")(r, i);
          break;
        default:
          l = r.outerHTML + `

`;
      }
      return l;
    }), n.subParser("makeMarkdown.paragraph", function(r, i) {
      var o = "";
      if (r.hasChildNodes())
        for (var l = r.childNodes, u = l.length, m = 0; m < u; ++m)
          o += n.subParser("makeMarkdown.node")(l[m], i);
      return o = o.trim(), o;
    }), n.subParser("makeMarkdown.pre", function(r, i) {
      var o = r.getAttribute("prenum");
      return "<pre>" + i.preList[o] + "</pre>";
    }), n.subParser("makeMarkdown.strikethrough", function(r, i) {
      var o = "";
      if (r.hasChildNodes()) {
        o += "~~";
        for (var l = r.childNodes, u = l.length, m = 0; m < u; ++m)
          o += n.subParser("makeMarkdown.node")(l[m], i);
        o += "~~";
      }
      return o;
    }), n.subParser("makeMarkdown.strong", function(r, i) {
      var o = "";
      if (r.hasChildNodes()) {
        o += "**";
        for (var l = r.childNodes, u = l.length, m = 0; m < u; ++m)
          o += n.subParser("makeMarkdown.node")(l[m], i);
        o += "**";
      }
      return o;
    }), n.subParser("makeMarkdown.table", function(r, i) {
      var o = "", l = [[], []], u = r.querySelectorAll("thead>tr>th"), m = r.querySelectorAll("tbody>tr"), f, x;
      for (f = 0; f < u.length; ++f) {
        var B = n.subParser("makeMarkdown.tableCell")(u[f], i), U = "---";
        if (u[f].hasAttribute("style")) {
          var z = u[f].getAttribute("style").toLowerCase().replace(/\s/g, "");
          switch (z) {
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
        l[0][f] = B.trim(), l[1][f] = U;
      }
      for (f = 0; f < m.length; ++f) {
        var H = l.push([]) - 1, w = m[f].getElementsByTagName("td");
        for (x = 0; x < u.length; ++x) {
          var q = " ";
          typeof w[x] < "u" && (q = n.subParser("makeMarkdown.tableCell")(w[x], i)), l[H].push(q);
        }
      }
      var W = 3;
      for (f = 0; f < l.length; ++f)
        for (x = 0; x < l[f].length; ++x) {
          var J = l[f][x].length;
          J > W && (W = J);
        }
      for (f = 0; f < l.length; ++f) {
        for (x = 0; x < l[f].length; ++x)
          f === 1 ? l[f][x].slice(-1) === ":" ? l[f][x] = n.helper.padEnd(l[f][x].slice(-1), W - 1, "-") + ":" : l[f][x] = n.helper.padEnd(l[f][x], W, "-") : l[f][x] = n.helper.padEnd(l[f][x], W);
        o += "| " + l[f].join(" | ") + ` |
`;
      }
      return o.trim();
    }), n.subParser("makeMarkdown.tableCell", function(r, i) {
      var o = "";
      if (!r.hasChildNodes())
        return "";
      for (var l = r.childNodes, u = l.length, m = 0; m < u; ++m)
        o += n.subParser("makeMarkdown.node")(l[m], i, !0);
      return o.trim();
    }), n.subParser("makeMarkdown.txt", function(r) {
      var i = r.nodeValue;
      return i = i.replace(/ +/g, " "), i = i.replace(/¨NBSP;/g, " "), i = n.helper.unescapeHTMLEntities(i), i = i.replace(/([*_~|`])/g, "\\$1"), i = i.replace(/^(\s*)>/g, "\\$1>"), i = i.replace(/^#/gm, "\\#"), i = i.replace(/^(\s*)([-=]{3,})(\s*)$/, "$1\\$2$3"), i = i.replace(/^( {0,3}\d+)\./gm, "$1\\."), i = i.replace(/^( {0,3})([+-])/gm, "$1\\$2"), i = i.replace(/]([\s]*)\(/g, "\\]$1\\("), i = i.replace(/^ {0,3}\[([\S \t]*?)]:/gm, "\\[$1]:"), i;
    });
    var I = this;
    e.exports ? e.exports = n : I.showdown = n;
  }).call(Rc);
})(xl);
var sm = xl.exports;
const Ki = /* @__PURE__ */ Ic(sm);
let Wi = class {
  constructor() {
    Ye(this, "logger"), Ye(this, "converter"), this.logger = Ps.zhiLog("showdown-adaptor"), this.converter = new Ki.Converter();
  }
  isAvailable() {
    return typeof Ki < "u";
  }
  renderMarkdownStr(t) {
    if (!this.isAvailable())
      throw new Error("Showdown is not available");
    return this.logger.info("Showdown is rendering md to HTML..."), Promise.resolve(this.converter.makeHtml(t));
  }
}, Tl = class {
  constructor() {
    Ye(this, "logger"), Ye(this, "mdAdaptor", new Wi()), this.logger = Ps.zhiLog("markdown-util");
  }
  /**
   * 获取当前 MD 解析器名称
   */
  getCurrentAdaptorName() {
    return this.mdAdaptor instanceof Gi ? "Lute" : this.mdAdaptor instanceof Wi ? "Showdown" : "None";
  }
  /**
   * 渲染Markdown
   *
   * @param md - Markdown文本
   */
  async renderHTML(t) {
    const a = new Gi();
    return this.logger.debug("Lute status =>", a.isAvailable()), a.isAvailable() && (this.mdAdaptor = a), this.logger.info(`Using ${this.getCurrentAdaptorName()} as markdown renderer`), await this.mdAdaptor.renderMarkdownStr(t);
  }
}, im = class {
  constructor() {
    Ye(this, "mdUtil"), this.mdUtil = new Tl();
  }
  /**
   * 移除标题数字
   *
   * @param str - 字符串
   */
  removeTitleNumber(t) {
    let a = t;
    const n = /([0-9]*)\./;
    return a = a.replace(n, ""), a;
  }
  /**
   * 删除挂件的HTML
   *
   * @param str - 原字符
   */
  removeWidgetTag(t) {
    let a = t.toString();
    const n = /<iframe.*src="\/widgets\/publisher.*<\/iframe>/g;
    a = a.replace(n, "");
    const s = /<iframe.*src="\/widgets\/sy-post-publisher.*<\/iframe>/g;
    a = a.replace(s, "");
    const c = /<iframe.*\/widgets\/Note*\sAttrs.*\/iframe>/g;
    return a = a.replace(c, ""), a;
  }
  /**
   * 删除Markdown文本的挂件的HTML
   *
   * @param str - 原字符
   */
  removeMdWidgetTag(t) {
    let a = t.toString();
    return a = this.removeWidgetTag(a), a;
  }
  /**
   * 去除html标签，残缺不全也可以
   *
   * @param str - 字符串
   */
  filterHtml(t) {
    t = t.replace(/<style((.|\n|\r)*?)<\/style>/g, ""), t = t.replace(/<script((.|\n|\r)*?)<\/script>/g, ""), t = t.replace(/<[^>]*>/g, ""), t = t.replace(/&.*;/g, ""), t = t.replace(/(^\s*)|(\s*$)/g, ""), t = t.replace(/</g, "").replace(/>/g, ""), t = t.replace(/"/g, "").replace(/'/g, ""), t = t.replace(/\*/g, ""), t = t.replace(/\$/g, ""), t = t.replace(/\./g, ""), t = t.replace(/\+/g, ""), t = t.replace(/\s+/g, ""), t = t.replace(/[:|：]/g, "_"), t = t.replace(/[;|；]/g, "_"), t = t.replace(/\^/g, "_"), t = t.replace(/!/g, "_"), t = t.replace(/@/g, "at_");
    const a = ["\\d*/\\d/\\d*", "[、|\\\\]", "[，|,]", "\\d", "/", "-"];
    for (let n = 0; n < a.length; n++) {
      const s = new RegExp(a[n], "g");
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
  parseHtml(t, a, n) {
    const s = this.filterHtml(t);
    return s.length < a ? s : n === !0 ? s.substring(0, a) : s.substring(0, a) + "...";
  }
  /**
   * 将Markdown转换为HTML
   *
   * @param md - Markdown
   */
  async mdToHtml(t) {
    const a = await this.mdUtil.renderHTML(t);
    return this.removeWidgetTag(a);
  }
  /**
   * 将Markdown转换为纯文本
   *
   * @param md - Markdown
   */
  async mdToPlainText(t) {
    const a = await this.mdToHtml(t);
    return this.filterHtml(a);
  }
  /**
   * 移除H1标签
   *
   * @param html - html
   */
  removeH1(t) {
    let a = t;
    const n = /<h1.*\/h1>/g;
    return a = a.replace(n, ""), a;
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
    let a = t;
    const n = /^# .*$/gm;
    return a = a.replace(n, ""), a;
  }
}, cm = class {
  /**
   * 检测是否是空对象
   *
   * @param obj - 对象
   */
  isEmptyObject(t) {
    return t ? Object.getPrototypeOf(t) === Object.prototype && Object.getOwnPropertyNames(t).length === 0 && Object.getOwnPropertySymbols(t).length === 0 : !0;
  }
}, lm = class {
  constructor() {
    Ye(this, "dateUtil"), Ye(this, "strUtil"), Ye(this, "versionUtil"), Ye(this, "htmlUtil"), Ye(this, "markdownUtil"), Ye(this, "jsonUtil"), Ye(this, "objectUtil"), this.dateUtil = new Rf(), this.strUtil = new If(), this.versionUtil = new zf(), this.htmlUtil = new im(), this.markdownUtil = new Tl(), this.jsonUtil = new Lf(), this.objectUtil = new cm();
  }
};
const um = lm;
var dm = Object.defineProperty, hm = (e, t, a) => t in e ? dm(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, xa = (e, t, a) => (hm(e, typeof t != "symbol" ? t + "" : t, a), a);
class Ta {
}
xa(Ta, "NODE_ENV_KEY", "NODE_ENV"), /**
* 开发环境
*/
xa(Ta, "NODE_ENV_DEVELOPMENT", "development"), /**
* 生产环境
*/
xa(Ta, "NODE_ENV_PRODUCTION", "production"), /**
* 测试环境
*/
xa(Ta, "NODE_ENV_TEST", "test"), /**
* 是否处于调试模式
*/
xa(Ta, "VITE_DEBUG_MODE_KEY", "VITE_DEBUG_MODE");
let pm = class {
};
ye(pm, "DEFAULT_BLOG_TYPE_KEY", "VITE_DEFAULT_TYPE");
class fm extends Mu {
}
class Ji extends Au {
  constructor(a, n) {
    super();
    /**
     * 思源笔记伺服地址
     */
    Ke(this, "apiUrl");
    /**
     * 思源笔记 API token
     */
    Ke(this, "password");
    /**
     * 思源笔记操作提示
     *
     * @protected
     */
    Ke(this, "placeholder");
    /**
     * 是否修复标题
     *
     * @protected
     */
    Ke(this, "fixTitle");
    this.apiUrl = a ?? "http://127.0.0.1:6806", this.passwordType = Lc.PasswordType_Token, this.password = n ?? "", this.placeholder = new fm(), this.fixTitle = !0;
  }
}
var mm = Object.defineProperty, gm = (e, t, a) => t in e ? mm(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, aa = (e, t, a) => (gm(e, typeof t != "symbol" ? t + "" : t, a), a);
let Ln = class {
};
aa(Ln, "LOG_LEVEL_KEY", "VITE_LOG_LEVEL"), aa(Ln, "LOG_PREFIX_KEY", "VITE_LOG_PREFIX");
var Yt = /* @__PURE__ */ ((e) => (e.LOG_LEVEL_TRACE = "TRACE", e.LOG_LEVEL_DEBUG = "DEBUG", e.LOG_LEVEL_INFO = "INFO", e.LOG_LEVEL_WARN = "WARN", e.LOG_LEVEL_ERROR = "ERROR", e))(Yt || {}), jl = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ss(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Cl = { exports: {} };
(function(e) {
  (function(t, a) {
    e.exports ? e.exports = a() : t.log = a();
  })(jl, function() {
    var t = function() {
    }, a = "undefined", n = typeof window !== a && typeof window.navigator !== a && /Trident\/|MSIE /.test(window.navigator.userAgent), s = [
      "trace",
      "debug",
      "info",
      "warn",
      "error"
    ];
    function c(C, T) {
      var v = C[T];
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
    function p() {
      console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
    }
    function b(C) {
      return C === "debug" && (C = "log"), typeof console === a ? !1 : C === "trace" && n ? p : console[C] !== void 0 ? c(console, C) : console.log !== void 0 ? c(console, "log") : t;
    }
    function _(C, T) {
      for (var v = 0; v < s.length; v++) {
        var j = s[v];
        this[j] = v < C ? t : this.methodFactory(j, C, T);
      }
      this.log = this.debug;
    }
    function y(C, T, v) {
      return function() {
        typeof console !== a && (_.call(this, T, v), this[C].apply(this, arguments));
      };
    }
    function g(C, T, v) {
      return b(C) || y.apply(this, arguments);
    }
    function S(C, T, v) {
      var j = this, I;
      T = T ?? "WARN";
      var r = "loglevel";
      typeof C == "string" ? r += ":" + C : typeof C == "symbol" && (r = void 0);
      function i(m) {
        var f = (s[m] || "silent").toUpperCase();
        if (!(typeof window === a || !r)) {
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
        var m;
        if (!(typeof window === a || !r)) {
          try {
            m = window.localStorage[r];
          } catch {
          }
          if (typeof m === a)
            try {
              var f = window.document.cookie, x = f.indexOf(
                encodeURIComponent(r) + "="
              );
              x !== -1 && (m = /^([^;]+)/.exec(f.slice(x))[1]);
            } catch {
            }
          return j.levels[m] === void 0 && (m = void 0), m;
        }
      }
      function l() {
        if (!(typeof window === a || !r)) {
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
      j.name = C, j.levels = {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        SILENT: 5
      }, j.methodFactory = v || g, j.getLevel = function() {
        return I;
      }, j.setLevel = function(m, f) {
        if (typeof m == "string" && j.levels[m.toUpperCase()] !== void 0 && (m = j.levels[m.toUpperCase()]), typeof m == "number" && m >= 0 && m <= j.levels.SILENT) {
          if (I = m, f !== !1 && i(m), _.call(j, m, C), typeof console === a && m < j.levels.SILENT)
            return "No console available for logging";
        } else
          throw "log.setLevel() called with invalid level: " + m;
      }, j.setDefaultLevel = function(m) {
        T = m, o() || j.setLevel(m, !1);
      }, j.resetLevel = function() {
        j.setLevel(T, !1), l();
      }, j.enableAll = function(m) {
        j.setLevel(j.levels.TRACE, m);
      }, j.disableAll = function(m) {
        j.setLevel(j.levels.SILENT, m);
      };
      var u = o();
      u == null && (u = T), j.setLevel(u, !1);
    }
    var L = new S(), A = {};
    L.getLogger = function(C) {
      if (typeof C != "symbol" && typeof C != "string" || C === "")
        throw new TypeError("You must supply a name when creating a logger.");
      var T = A[C];
      return T || (T = A[C] = new S(
        C,
        L.getLevel(),
        L.methodFactory
      )), T;
    };
    var N = typeof window !== a ? window.log : void 0;
    return L.noConflict = function() {
      return typeof window !== a && window.log === L && (window.log = N), L;
    }, L.getLoggers = function() {
      return A;
    }, L.default = L, L;
  });
})(Cl);
var ym = Cl.exports;
const un = /* @__PURE__ */ Ss(ym);
var Ol = { exports: {} };
(function(e) {
  (function(t, a) {
    e.exports ? e.exports = a() : t.prefix = a(t);
  })(jl, function(t) {
    var a = function(g) {
      for (var S = 1, L = arguments.length, A; S < L; S++)
        for (A in arguments[S])
          Object.prototype.hasOwnProperty.call(arguments[S], A) && (g[A] = arguments[S][A]);
      return g;
    }, n = {
      template: "[%t] %l:",
      levelFormatter: function(g) {
        return g.toUpperCase();
      },
      nameFormatter: function(g) {
        return g || "root";
      },
      timestampFormatter: function(g) {
        return g.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
      },
      format: void 0
    }, s, c = {}, p = function(g) {
      if (!g || !g.getLogger)
        throw new TypeError("Argument is not a root logger");
      s = g;
    }, b = function(g, S) {
      if (!g || !g.setLevel)
        throw new TypeError("Argument is not a logger");
      var L = g.methodFactory, A = g.name || "", N = c[A] || c[""] || n;
      function C(T, v, j) {
        var I = L(T, v, j), r = c[j] || c[""], i = r.template.indexOf("%t") !== -1, o = r.template.indexOf("%l") !== -1, l = r.template.indexOf("%n") !== -1;
        return function() {
          for (var u = "", m = arguments.length, f = Array(m), x = 0; x < m; x++)
            f[x] = arguments[x];
          if (A || !c[j]) {
            var B = r.timestampFormatter(/* @__PURE__ */ new Date()), U = r.levelFormatter(T), z = r.nameFormatter(j);
            r.format ? u += r.format(U, z, B) : (u += r.template, i && (u = u.replace(/%t/, B)), o && (u = u.replace(/%l/, U)), l && (u = u.replace(/%n/, z))), f.length && typeof f[0] == "string" ? f[0] = u + " " + f[0] : f.unshift(u);
          }
          I.apply(void 0, f);
        };
      }
      return c[A] || (g.methodFactory = C), S = S || {}, S.template && (S.format = void 0), c[A] = a({}, N, S), g.setLevel(g.getLevel()), s || g.warn(
        "It is necessary to call the function reg() of loglevel-plugin-prefix before calling apply. From the next release, it will throw an error. See more: https://github.com/kutuluk/loglevel-plugin-prefix/blob/master/README.md"
      ), g;
    }, _ = {
      reg: p,
      apply: b
    }, y;
    return t && (y = t.prefix, _.noConflict = function() {
      return t.prefix === _ && (t.prefix = y), _;
    }), _;
  });
})(Ol);
var bm = Ol.exports;
const Zi = /* @__PURE__ */ Ss(bm);
function _m() {
  const e = Error.prepareStackTrace;
  Error.prepareStackTrace = (a, n) => n;
  const t = new Error().stack.slice(1);
  return Error.prepareStackTrace = e, t;
}
class Ha {
  /**
   * 解析日志级别为枚举
   *
   * @param enumObj - 枚举对象
   * @param value - 配置的值
   */
  static stringToEnumValue(t, a) {
    return t[Object.keys(t).filter((n) => t[n].toString() === a)[0]];
  }
  /**
   * 获取配置的日志级别
   */
  static getEnvLevel(t) {
    if (!t)
      return;
    const a = t.getEnvOrDefault(Ln.LOG_LEVEL_KEY, Yt.LOG_LEVEL_INFO), n = Ha.stringToEnumValue(Yt, a.toUpperCase());
    return n || console.warn(
      "[zhi-log] LOG_LEVEL is invalid in you .env file.It must be either debug, info, warn or error, fallback to default info level"
    ), n;
  }
  /**
   * 获取默认日志
   */
  static getEnvLogger(t) {
    return t ? t.getEnv(Ln.LOG_PREFIX_KEY) : void 0;
  }
}
var xs = { exports: {} }, Yi = { exports: {} }, Qi;
function wm() {
  return Qi || (Qi = 1, function(e) {
    const t = typeof process < "u" && process.env.TERM_PROGRAM === "Hyper", a = typeof process < "u" && process.platform === "win32", n = typeof process < "u" && process.platform === "linux", s = {
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
    }, c = Object.assign({}, s, {
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
    }), p = Object.assign({}, s, {
      ballotCross: "✘",
      check: "✔",
      cross: "✖",
      ellipsisLarge: "⋯",
      ellipsis: "…",
      info: "ℹ",
      questionFull: "？",
      questionSmall: "﹖",
      pointer: n ? "▸" : "❯",
      pointerSmall: n ? "‣" : "›",
      radioOff: "◯",
      radioOn: "◉",
      warning: "⚠"
    });
    e.exports = a && !t ? c : p, Reflect.defineProperty(e.exports, "common", { enumerable: !1, value: s }), Reflect.defineProperty(e.exports, "windows", { enumerable: !1, value: c }), Reflect.defineProperty(e.exports, "other", { enumerable: !1, value: p });
  }(Yi)), Yi.exports;
}
const vm = (e) => e !== null && typeof e == "object" && !Array.isArray(e), $m = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g, km = () => typeof process < "u" ? process.env.FORCE_COLOR !== "0" : !1, Nl = () => {
  const e = {
    enabled: km(),
    visible: !0,
    styles: {},
    keys: {}
  }, t = (c) => {
    let p = c.open = `\x1B[${c.codes[0]}m`, b = c.close = `\x1B[${c.codes[1]}m`, _ = c.regex = new RegExp(`\\u001b\\[${c.codes[1]}m`, "g");
    return c.wrap = (y, g) => {
      y.includes(b) && (y = y.replace(_, b + p));
      let S = p + y + b;
      return g ? S.replace(/\r*\n/g, `${b}$&${p}`) : S;
    }, c;
  }, a = (c, p, b) => typeof c == "function" ? c(p) : c.wrap(p, b), n = (c, p) => {
    if (c === "" || c == null)
      return "";
    if (e.enabled === !1)
      return c;
    if (e.visible === !1)
      return "";
    let b = "" + c, _ = b.includes(`
`), y = p.length;
    for (y > 0 && p.includes("unstyle") && (p = [.../* @__PURE__ */ new Set(["unstyle", ...p])].reverse()); y-- > 0; )
      b = a(e.styles[p[y]], b, _);
    return b;
  }, s = (c, p, b) => {
    e.styles[c] = t({ name: c, codes: p }), (e.keys[b] || (e.keys[b] = [])).push(c), Reflect.defineProperty(e, c, {
      configurable: !0,
      enumerable: !0,
      set(_) {
        e.alias(c, _);
      },
      get() {
        let _ = (y) => n(y, _.stack);
        return Reflect.setPrototypeOf(_, e), _.stack = this.stack ? this.stack.concat(c) : [c], _;
      }
    });
  };
  return s("reset", [0, 0], "modifier"), s("bold", [1, 22], "modifier"), s("dim", [2, 22], "modifier"), s("italic", [3, 23], "modifier"), s("underline", [4, 24], "modifier"), s("inverse", [7, 27], "modifier"), s("hidden", [8, 28], "modifier"), s("strikethrough", [9, 29], "modifier"), s("black", [30, 39], "color"), s("red", [31, 39], "color"), s("green", [32, 39], "color"), s("yellow", [33, 39], "color"), s("blue", [34, 39], "color"), s("magenta", [35, 39], "color"), s("cyan", [36, 39], "color"), s("white", [37, 39], "color"), s("gray", [90, 39], "color"), s("grey", [90, 39], "color"), s("bgBlack", [40, 49], "bg"), s("bgRed", [41, 49], "bg"), s("bgGreen", [42, 49], "bg"), s("bgYellow", [43, 49], "bg"), s("bgBlue", [44, 49], "bg"), s("bgMagenta", [45, 49], "bg"), s("bgCyan", [46, 49], "bg"), s("bgWhite", [47, 49], "bg"), s("blackBright", [90, 39], "bright"), s("redBright", [91, 39], "bright"), s("greenBright", [92, 39], "bright"), s("yellowBright", [93, 39], "bright"), s("blueBright", [94, 39], "bright"), s("magentaBright", [95, 39], "bright"), s("cyanBright", [96, 39], "bright"), s("whiteBright", [97, 39], "bright"), s("bgBlackBright", [100, 49], "bgBright"), s("bgRedBright", [101, 49], "bgBright"), s("bgGreenBright", [102, 49], "bgBright"), s("bgYellowBright", [103, 49], "bgBright"), s("bgBlueBright", [104, 49], "bgBright"), s("bgMagentaBright", [105, 49], "bgBright"), s("bgCyanBright", [106, 49], "bgBright"), s("bgWhiteBright", [107, 49], "bgBright"), e.ansiRegex = $m, e.hasColor = e.hasAnsi = (c) => (e.ansiRegex.lastIndex = 0, typeof c == "string" && c !== "" && e.ansiRegex.test(c)), e.alias = (c, p) => {
    let b = typeof p == "string" ? e[p] : p;
    if (typeof b != "function")
      throw new TypeError("Expected alias to be the name of an existing color (string) or a function");
    b.stack || (Reflect.defineProperty(b, "name", { value: c }), e.styles[c] = b, b.stack = [c]), Reflect.defineProperty(e, c, {
      configurable: !0,
      enumerable: !0,
      set(_) {
        e.alias(c, _);
      },
      get() {
        let _ = (y) => n(y, _.stack);
        return Reflect.setPrototypeOf(_, e), _.stack = this.stack ? this.stack.concat(b.stack) : b.stack, _;
      }
    });
  }, e.theme = (c) => {
    if (!vm(c))
      throw new TypeError("Expected theme to be an object");
    for (let p of Object.keys(c))
      e.alias(p, c[p]);
    return e;
  }, e.alias("unstyle", (c) => typeof c == "string" && c !== "" ? (e.ansiRegex.lastIndex = 0, c.replace(e.ansiRegex, "")) : ""), e.alias("noop", (c) => c), e.none = e.clear = e.noop, e.stripColor = e.unstyle, e.symbols = wm(), e.define = s, e;
};
xs.exports = Nl();
xs.exports.create = Nl;
var Em = xs.exports;
const Ct = /* @__PURE__ */ Ss(Em);
let jo, Ll, Rl, Il, Al = !0;
typeof process < "u" && ({ FORCE_COLOR: jo, NODE_DISABLE_COLORS: Ll, NO_COLOR: Rl, TERM: Il } = process.env || {}, Al = process.stdout && process.stdout.isTTY);
const me = {
  enabled: !Ll && Rl == null && Il !== "dumb" && (jo != null && jo !== "0" || Al),
  // modifiers
  reset: Oe(0, 0),
  bold: Oe(1, 22),
  dim: Oe(2, 22),
  italic: Oe(3, 23),
  underline: Oe(4, 24),
  inverse: Oe(7, 27),
  hidden: Oe(8, 28),
  strikethrough: Oe(9, 29),
  // colors
  black: Oe(30, 39),
  red: Oe(31, 39),
  green: Oe(32, 39),
  yellow: Oe(33, 39),
  blue: Oe(34, 39),
  magenta: Oe(35, 39),
  cyan: Oe(36, 39),
  white: Oe(37, 39),
  gray: Oe(90, 39),
  grey: Oe(90, 39),
  // background colors
  bgBlack: Oe(40, 49),
  bgRed: Oe(41, 49),
  bgGreen: Oe(42, 49),
  bgYellow: Oe(43, 49),
  bgBlue: Oe(44, 49),
  bgMagenta: Oe(45, 49),
  bgCyan: Oe(46, 49),
  bgWhite: Oe(47, 49)
};
function Xi(e, t) {
  let a = 0, n, s = "", c = "";
  for (; a < e.length; a++)
    n = e[a], s += n.open, c += n.close, ~t.indexOf(n.close) && (t = t.replace(n.rgx, n.close + n.open));
  return s + t + c;
}
function Pm(e, t) {
  let a = { has: e, keys: t };
  return a.reset = me.reset.bind(a), a.bold = me.bold.bind(a), a.dim = me.dim.bind(a), a.italic = me.italic.bind(a), a.underline = me.underline.bind(a), a.inverse = me.inverse.bind(a), a.hidden = me.hidden.bind(a), a.strikethrough = me.strikethrough.bind(a), a.black = me.black.bind(a), a.red = me.red.bind(a), a.green = me.green.bind(a), a.yellow = me.yellow.bind(a), a.blue = me.blue.bind(a), a.magenta = me.magenta.bind(a), a.cyan = me.cyan.bind(a), a.white = me.white.bind(a), a.gray = me.gray.bind(a), a.grey = me.grey.bind(a), a.bgBlack = me.bgBlack.bind(a), a.bgRed = me.bgRed.bind(a), a.bgGreen = me.bgGreen.bind(a), a.bgYellow = me.bgYellow.bind(a), a.bgBlue = me.bgBlue.bind(a), a.bgMagenta = me.bgMagenta.bind(a), a.bgCyan = me.bgCyan.bind(a), a.bgWhite = me.bgWhite.bind(a), a;
}
function Oe(e, t) {
  let a = {
    open: `\x1B[${e}m`,
    close: `\x1B[${t}m`,
    rgx: new RegExp(`\\x1b\\[${t}m`, "g")
  };
  return function(n) {
    return this !== void 0 && this.has !== void 0 ? (~this.has.indexOf(e) || (this.has.push(e), this.keys.push(a)), n === void 0 ? this : me.enabled ? Xi(this.keys, n + "") : n + "") : n === void 0 ? Pm([e], [a]) : me.enabled ? Xi([a], n + "") : n + "";
  };
}
var Sm = Object.defineProperty, xm = (e, t, a) => t in e ? Sm(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, Je = (e, t, a) => (xm(e, typeof t != "symbol" ? t + "" : t, a), a);
const Jt = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return Jt.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let Pe = Jt;
Je(Pe, "isNode", typeof process < "u"), /**
* 是否在浏览器环境
*/
Je(Pe, "isInBrowser", typeof window < "u"), /**
* 浏览器路径分隔符
*/
Je(Pe, "BrowserSeperator", "/"), /**
* 是否是Electron环境
*/
Je(Pe, "isElectron", () => !Jt.isInBrowser || !window.navigator || !window.navigator.userAgent ? !1 : /Electron/.test(window.navigator.userAgent)), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
Je(Pe, "hasNodeEnv", () => Jt.isElectron() || Jt.isNode), /**
* 获取url参数
*
* @param sParam - 参数
*/
Je(Pe, "getQueryString", (e) => {
  if (!Jt.isInBrowser)
    return "";
  const t = window.location.search.substring(1).split("&");
  for (let a = 0; a < t.length; a++) {
    const n = t[a].split("=");
    if (n[0] === e)
      return n[1];
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
Je(Pe, "replaceUrlParam", (e, t, a) => {
  a == null && (a = "");
  const n = new RegExp("\\b(" + t + "=).*?(&|#|$)");
  if (e.search(n) >= 0)
    return e.replace(n, "$1" + a + "$2");
  const [s, c] = e.split("#"), [p, b] = s.split("?"), _ = new URLSearchParams(b);
  _.set(t, a);
  const y = _.toString(), g = p + (y ? "?" + y : "");
  return c ? g + "#" + c : g;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
Je(Pe, "setUrlParameter", (e, t, a) => {
  if (e.includes(t))
    return Jt.replaceUrlParam(e, t, a);
  const n = e.split("#");
  let s = n[0];
  const c = n[1];
  return s.includes("?") ? s += `&${t}=${a}` : s += `?${t}=${a}`, c && (s += "#" + c), s;
}), /**
* 重新加载指定tab
*
* @param tabname - tabname
* @param t - 延迟时间
*/
Je(Pe, "reloadTabPage", (e, t = 200) => {
  setTimeout(function() {
    if (Jt.isInBrowser) {
      const a = window.location.href;
      window.location.href = Jt.setUrlParameter(a, "tab", e);
    }
  }, t);
}), /**
* 刷新当前tab页面
*/
Je(Pe, "reloadPage", () => {
  setTimeout(function() {
    Jt.isInBrowser && window.location.reload();
  }, 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
*/
Je(Pe, "reloadPageWithMessageCallback", (e, t) => {
  t && t(e), setTimeout(function() {
    Jt.isInBrowser && window.location.reload();
  }, 200);
});
var ht = /* @__PURE__ */ ((e) => (e.BasePathType_Appearance = "Appearance", e.BasePathType_Data = "Data", e.BasePathType_Themes = "Themes", e.BasePathType_ZhiTheme = "ZhiTheme", e.BasePathType_None = "None", e))(ht || {});
const gt = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return Pe.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : !1;
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
    let a = e;
    switch (t) {
      case ht.BasePathType_Appearance:
        a = this.browserJoinPath(this.siyuanAppearanceRelativePath(), e);
        break;
      case ht.BasePathType_Data:
        a = this.browserJoinPath(this.siyuanDataRelativePath(), e);
        break;
      case ht.BasePathType_Themes:
        a = this.browserJoinPath(this.siyuanThemeRelativePath(), e);
        break;
      case ht.BasePathType_ZhiTheme:
        a = this.browserJoinPath(this.zhiThemeRelativePath(), e);
        break;
      default:
        throw new Error("type must be provided");
    }
    const { default: n } = await import(
      /* @vite-ignore */
      a
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
  static async importZhiThemeJs(e) {
    return await this.importJs(e, ht.BasePathType_ZhiTheme);
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
    if (Pe.hasNodeEnv()) {
      const t = this.requireLib("path");
      if (t)
        return t.join(...e);
    }
    return this.browserJoinPath(...e);
  }
  static browserJoinPath(...e) {
    return e.join(Pe.BrowserSeperator);
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
    if (Pe.hasNodeEnv())
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
let Lr = gt;
Je(Lr, "isInSiyuanWidget", () => Pe.isInBrowser ? window.frameElement != null && window.frameElement.parentElement != null && window.frameElement.parentElement.parentElement != null && window.frameElement.parentElement.parentElement.getAttribute("data-node-id") !== "" : !1), /**
* 思源笔记新窗口
*
* @deprecated window.terwer 判断方式已废弃，建议以后打开新窗口注入 window.siyuanNewWin ，这样语义会更容易理解
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
Je(Lr, "isInSiyuanNewWin", () => !Pe.isInBrowser || !Pe.isElectron() ? !1 : typeof window.terwer < "u" || typeof window.siyuanNewWin < "u"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
Je(Lr, "requireLib", (e, t = !0, a = ht.BasePathType_None) => {
  if (!Pe.hasNodeEnv())
    throw new Error("require ony works on node env");
  let n = e;
  if (!t)
    switch (a) {
      case ht.BasePathType_Appearance:
        n = gt.joinPath(gt.siyuanAppearancePath(), e);
        break;
      case ht.BasePathType_Data:
        n = gt.joinPath(gt.siyuanDataPath(), e);
        break;
      case ht.BasePathType_Themes:
        n = gt.joinPath(gt.siyuanAppearancePath(), "themes", e);
        break;
      case ht.BasePathType_ZhiTheme:
        n = gt.joinPath(gt.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const s = gt.siyuanWindow();
  if (!s)
    return require(n);
  if (typeof s.require < "u")
    return s.require(n);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
Je(Lr, "requireAppearanceLib", (e) => gt.requireLib(e, !1, ht.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
Je(Lr, "requireDataLib", (e) => gt.requireLib(e, !1, ht.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
Je(Lr, "requireThemesLib", (e) => gt.requireLib(e, !1, ht.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
Je(Lr, "requireZhiThemeLib", (e) => gt.requireLib(e, !1, ht.BasePathType_ZhiTheme));
const Ot = {
  white: (e) => Pe.isElectron() ? Ct.whiteBright(e) : me.white(e),
  gray: (e) => Pe.isElectron() ? Ct.gray(e) : me.gray(e),
  blue: (e) => Pe.isElectron() ? Ct.blue(e) : me.blue(e),
  green: (e) => Pe.isElectron() ? Ct.green(e) : me.green(e),
  yellow: (e) => Pe.isElectron() ? Ct.yellow(e) : me.yellow(e),
  red: (e) => Pe.isElectron() ? Ct.red(e) : me.red(e),
  bgWhite: (e) => Pe.isElectron() ? Ct.bgWhiteBright(e) : me.bgWhite(e),
  bgGrey: (e) => Pe.isElectron() ? Ct.bgCyanBright(e) : me.bgCyan(e),
  bgBlue: (e) => Pe.isElectron() ? Ct.bgBlueBright(e) : me.bgBlue(e),
  bgGreen: (e) => Pe.isElectron() ? Ct.bgGreenBright(e) : me.bgGreen(e),
  bgYellow: (e) => Pe.isElectron() ? Ct.bgYellowBright(e) : me.bgYellow(e),
  bgRed: (e) => Pe.isElectron() ? Ct.bgRedBright(e) : me.bgRed(e)
};
let Tm = class {
  constructor(t, a, n) {
    aa(this, "consoleLogger", "console"), aa(this, "stackSize", 1), aa(this, "getLogger", (p) => {
      let b;
      if (p)
        b = p;
      else {
        const _ = this.getCallStack(), y = [], g = [];
        for (let S = 0; S < _.length; S++) {
          const L = _[S], A = L.getFileName() ?? "none";
          if (S > this.stackSize - 1)
            break;
          const N = A + "-" + L.getLineNumber() + ":" + L.getColumnNumber();
          y.push(N);
        }
        g.length > 0 && (b = y.join(" -> "));
      }
      return (!b || b.trim().length === 0) && (b = this.consoleLogger), un.getLogger(b);
    }), this.stackSize = 1;
    let s;
    t ? s = t : s = Ha.getEnvLevel(n), s = s ?? Yt.LOG_LEVEL_INFO, un.setLevel(s);
    const c = (p, b, _, y) => {
      const g = [], S = a ?? Ha.getEnvLogger(n) ?? "zhi";
      return g.push(Ot.gray("[") + y(S) + Ot.gray("]")), g.push(Ot.gray("[") + Ot.gray(_.toString()) + Ot.gray("]")), g.push(y(p.toUpperCase().toString())), g.push(y(b)), g.push(Ot.gray(":")), g;
    };
    Zi.reg(un), Zi.apply(un, {
      format(p, b, _) {
        let y = [];
        const g = b ?? "";
        switch (p) {
          case Yt.LOG_LEVEL_TRACE:
            y = c(p, g, _, Ot.gray);
            break;
          case Yt.LOG_LEVEL_DEBUG:
            y = c(p, g, _, Ot.blue);
            break;
          case Yt.LOG_LEVEL_INFO:
            y = c(p, g, _, Ot.green);
            break;
          case Yt.LOG_LEVEL_WARN:
            y = c(p, g, _, Ot.yellow);
            break;
          case Yt.LOG_LEVEL_ERROR:
            y = c(p, g, _, Ot.red);
            break;
          default:
            y = c(Yt.LOG_LEVEL_INFO, g, _, Ot.green);
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
      t = _m();
    } catch {
      t = [];
    }
    return t;
  }
}, jm = class {
  /**
   * 默认日志级别
   *
   * @param level - 可选，未设置默认INFO
   * @param sign - 可选前缀，默认zhi
   * @param env - 可选环境变量实例
   */
  constructor(t, a, n) {
    aa(this, "logger"), this.logger = new Tm(t, a, n);
  }
  /**
   * 获取日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   * @protected
   */
  getLogger(t, a) {
    return this.logger.setStackSize(a), this.logger.getLogger(t);
  }
};
class ec extends jm {
  constructor(t, a, n) {
    super(t, a, n);
  }
  /**
   * 获取默认的日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   */
  getLogger(t, a) {
    return super.getLogger(t, a);
  }
}
let tc = class Ml {
  /**
   * 默认日志记录器
   *
   * @param stackSize - 栈的深度
   * @param env - 环境变量实例
   */
  static defaultLogger(t, a) {
    return Ml.customLogFactory(void 0, void 0, t).getLogger(void 0, a);
  }
  /**
   * 自定义日志工厂
   *
   * @param level - 级别
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customLogFactory(t, a, n) {
    return new ec(t, a, n);
  }
  /**
   * 自定义日志工厂，自定义前缀
   *
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customSignLogFactory(t, a) {
    return new ec(void 0, t, a);
  }
};
var Cm = Object.defineProperty, Om = (e, t, a) => t in e ? Cm(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, Qe = (e, t, a) => (Om(e, typeof t != "symbol" ? t + "" : t, a), a), Dl = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function zl(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Co = { exports: {} }, Bl = {}, tr = {}, ca = {}, Qa = {}, ve = {}, Ga = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class a extends t {
    constructor(j) {
      if (super(), !e.IDENTIFIER.test(j))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = j;
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
  e.Name = a;
  class n extends t {
    constructor(j) {
      super(), this._items = typeof j == "string" ? [j] : j;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const j = this._items[0];
      return j === "" || j === '""';
    }
    get str() {
      var j;
      return (j = this._str) !== null && j !== void 0 ? j : this._str = this._items.reduce((I, r) => `${I}${r}`, "");
    }
    get names() {
      var j;
      return (j = this._names) !== null && j !== void 0 ? j : this._names = this._items.reduce((I, r) => (r instanceof a && (I[r.str] = (I[r.str] || 0) + 1), I), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(v, ...j) {
    const I = [v[0]];
    let r = 0;
    for (; r < j.length; )
      b(I, j[r]), I.push(v[++r]);
    return new n(I);
  }
  e._ = s;
  const c = new n("+");
  function p(v, ...j) {
    const I = [A(v[0])];
    let r = 0;
    for (; r < j.length; )
      I.push(c), b(I, j[r]), I.push(c, A(v[++r]));
    return _(I), new n(I);
  }
  e.str = p;
  function b(v, j) {
    j instanceof n ? v.push(...j._items) : j instanceof a ? v.push(j) : v.push(S(j));
  }
  e.addCodeArg = b;
  function _(v) {
    let j = 1;
    for (; j < v.length - 1; ) {
      if (v[j] === c) {
        const I = y(v[j - 1], v[j + 1]);
        if (I !== void 0) {
          v.splice(j - 1, 3, I);
          continue;
        }
        v[j++] = "+";
      }
      j++;
    }
  }
  function y(v, j) {
    if (j === '""')
      return v;
    if (v === '""')
      return j;
    if (typeof v == "string")
      return j instanceof a || v[v.length - 1] !== '"' ? void 0 : typeof j != "string" ? `${v.slice(0, -1)}${j}"` : j[0] === '"' ? v.slice(0, -1) + j.slice(1) : void 0;
    if (typeof j == "string" && j[0] === '"' && !(v instanceof a))
      return `"${v}${j.slice(1)}`;
  }
  function g(v, j) {
    return j.emptyStr() ? v : v.emptyStr() ? j : p`${v}${j}`;
  }
  e.strConcat = g;
  function S(v) {
    return typeof v == "number" || typeof v == "boolean" || v === null ? v : A(Array.isArray(v) ? v.join(",") : v);
  }
  function L(v) {
    return new n(A(v));
  }
  e.stringify = L;
  function A(v) {
    return JSON.stringify(v).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = A;
  function N(v) {
    return typeof v == "string" && e.IDENTIFIER.test(v) ? new n(`.${v}`) : s`[${v}]`;
  }
  e.getProperty = N;
  function C(v) {
    if (typeof v == "string" && e.IDENTIFIER.test(v))
      return new n(`${v}`);
    throw new Error(`CodeGen: invalid export name: ${v}, use explicit $id name mapping`);
  }
  e.getEsmExportName = C;
  function T(v) {
    return new n(v.toString());
  }
  e.regexpCode = T;
})(Ga);
var Oo = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = Ga;
  class a extends Error {
    constructor(y) {
      super(`CodeGen: "code" for ${y} not defined`), this.value = y.value;
    }
  }
  var n;
  (function(_) {
    _[_.Started = 0] = "Started", _[_.Completed = 1] = "Completed";
  })(n = e.UsedValueState || (e.UsedValueState = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: y, parent: g } = {}) {
      this._names = {}, this._prefixes = y, this._parent = g;
    }
    toName(y) {
      return y instanceof t.Name ? y : this.name(y);
    }
    name(y) {
      return new t.Name(this._newName(y));
    }
    _newName(y) {
      const g = this._names[y] || this._nameGroup(y);
      return `${y}${g.index++}`;
    }
    _nameGroup(y) {
      var g, S;
      if (!((S = (g = this._parent) === null || g === void 0 ? void 0 : g._prefixes) === null || S === void 0) && S.has(y) || this._prefixes && !this._prefixes.has(y))
        throw new Error(`CodeGen: prefix "${y}" is not allowed in this scope`);
      return this._names[y] = { prefix: y, index: 0 };
    }
  }
  e.Scope = s;
  class c extends t.Name {
    constructor(y, g) {
      super(g), this.prefix = y;
    }
    setValue(y, { property: g, itemIndex: S }) {
      this.value = y, this.scopePath = (0, t._)`.${new t.Name(g)}[${S}]`;
    }
  }
  e.ValueScopeName = c;
  const p = (0, t._)`\n`;
  class b extends s {
    constructor(y) {
      super(y), this._values = {}, this._scope = y.scope, this.opts = { ...y, _n: y.lines ? p : t.nil };
    }
    get() {
      return this._scope;
    }
    name(y) {
      return new c(y, this._newName(y));
    }
    value(y, g) {
      var S;
      if (g.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const L = this.toName(y), { prefix: A } = L, N = (S = g.key) !== null && S !== void 0 ? S : g.ref;
      let C = this._values[A];
      if (C) {
        const j = C.get(N);
        if (j)
          return j;
      } else
        C = this._values[A] = /* @__PURE__ */ new Map();
      C.set(N, L);
      const T = this._scope[A] || (this._scope[A] = []), v = T.length;
      return T[v] = g.ref, L.setValue(g, { property: A, itemIndex: v }), L;
    }
    getValue(y, g) {
      const S = this._values[y];
      if (S)
        return S.get(g);
    }
    scopeRefs(y, g = this._values) {
      return this._reduceValues(g, (S) => {
        if (S.scopePath === void 0)
          throw new Error(`CodeGen: name "${S}" has no value`);
        return (0, t._)`${y}${S.scopePath}`;
      });
    }
    scopeCode(y = this._values, g, S) {
      return this._reduceValues(y, (L) => {
        if (L.value === void 0)
          throw new Error(`CodeGen: name "${L}" has no value`);
        return L.value.code;
      }, g, S);
    }
    _reduceValues(y, g, S = {}, L) {
      let A = t.nil;
      for (const N in y) {
        const C = y[N];
        if (!C)
          continue;
        const T = S[N] = S[N] || /* @__PURE__ */ new Map();
        C.forEach((v) => {
          if (T.has(v))
            return;
          T.set(v, n.Started);
          let j = g(v);
          if (j) {
            const I = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            A = (0, t._)`${A}${I} ${v} = ${j};${this.opts._n}`;
          } else if (j = L == null ? void 0 : L(v))
            A = (0, t._)`${A}${j}${this.opts._n}`;
          else
            throw new a(v);
          T.set(v, n.Completed);
        });
      }
      return A;
    }
  }
  e.ValueScope = b;
})(Oo);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Ga, a = Oo;
  var n = Ga;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = Oo;
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
  class c {
    optimizeNodes() {
      return this;
    }
    optimizeNames(d, k) {
      return this;
    }
  }
  class p extends c {
    constructor(d, k, R) {
      super(), this.varKind = d, this.name = k, this.rhs = R;
    }
    render({ es5: d, _n: k }) {
      const R = d ? a.varKinds.var : this.varKind, G = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${R} ${this.name}${G};` + k;
    }
    optimizeNames(d, k) {
      if (d[this.name.str])
        return this.rhs && (this.rhs = z(this.rhs, d, k)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class b extends c {
    constructor(d, k, R) {
      super(), this.lhs = d, this.rhs = k, this.sideEffects = R;
    }
    render({ _n: d }) {
      return `${this.lhs} = ${this.rhs};` + d;
    }
    optimizeNames(d, k) {
      if (!(this.lhs instanceof t.Name && !d[this.lhs.str] && !this.sideEffects))
        return this.rhs = z(this.rhs, d, k), this;
    }
    get names() {
      const d = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return U(d, this.rhs);
    }
  }
  class _ extends b {
    constructor(d, k, R, G) {
      super(d, R, G), this.op = k;
    }
    render({ _n: d }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + d;
    }
  }
  class y extends c {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `${this.label}:` + d;
    }
  }
  class g extends c {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `break${this.label ? ` ${this.label}` : ""};` + d;
    }
  }
  class S extends c {
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
  class L extends c {
    constructor(d) {
      super(), this.code = d;
    }
    render({ _n: d }) {
      return `${this.code};` + d;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(d, k) {
      return this.code = z(this.code, d, k), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class A extends c {
    constructor(d = []) {
      super(), this.nodes = d;
    }
    render(d) {
      return this.nodes.reduce((k, R) => k + R.render(d), "");
    }
    optimizeNodes() {
      const { nodes: d } = this;
      let k = d.length;
      for (; k--; ) {
        const R = d[k].optimizeNodes();
        Array.isArray(R) ? d.splice(k, 1, ...R) : R ? d[k] = R : d.splice(k, 1);
      }
      return d.length > 0 ? this : void 0;
    }
    optimizeNames(d, k) {
      const { nodes: R } = this;
      let G = R.length;
      for (; G--; ) {
        const K = R[G];
        K.optimizeNames(d, k) || (H(d, K.names), R.splice(G, 1));
      }
      return R.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((d, k) => B(d, k.names), {});
    }
  }
  class N extends A {
    render(d) {
      return "{" + d._n + super.render(d) + "}" + d._n;
    }
  }
  class C extends A {
  }
  class T extends N {
  }
  T.kind = "else";
  class v extends N {
    constructor(d, k) {
      super(k), this.condition = d;
    }
    render(d) {
      let k = `if(${this.condition})` + super.render(d);
      return this.else && (k += "else " + this.else.render(d)), k;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const d = this.condition;
      if (d === !0)
        return this.nodes;
      let k = this.else;
      if (k) {
        const R = k.optimizeNodes();
        k = this.else = Array.isArray(R) ? new T(R) : R;
      }
      if (k)
        return d === !1 ? k instanceof v ? k : k.nodes : this.nodes.length ? this : new v(w(d), k instanceof v ? [k] : k.nodes);
      if (!(d === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(d, k) {
      var R;
      if (this.else = (R = this.else) === null || R === void 0 ? void 0 : R.optimizeNames(d, k), !!(super.optimizeNames(d, k) || this.else))
        return this.condition = z(this.condition, d, k), this;
    }
    get names() {
      const d = super.names;
      return U(d, this.condition), this.else && B(d, this.else.names), d;
    }
  }
  v.kind = "if";
  class j extends N {
  }
  j.kind = "for";
  class I extends j {
    constructor(d) {
      super(), this.iteration = d;
    }
    render(d) {
      return `for(${this.iteration})` + super.render(d);
    }
    optimizeNames(d, k) {
      if (super.optimizeNames(d, k))
        return this.iteration = z(this.iteration, d, k), this;
    }
    get names() {
      return B(super.names, this.iteration.names);
    }
  }
  class r extends j {
    constructor(d, k, R, G) {
      super(), this.varKind = d, this.name = k, this.from = R, this.to = G;
    }
    render(d) {
      const k = d.es5 ? a.varKinds.var : this.varKind, { name: R, from: G, to: K } = this;
      return `for(${k} ${R}=${G}; ${R}<${K}; ${R}++)` + super.render(d);
    }
    get names() {
      const d = U(super.names, this.from);
      return U(d, this.to);
    }
  }
  class i extends j {
    constructor(d, k, R, G) {
      super(), this.loop = d, this.varKind = k, this.name = R, this.iterable = G;
    }
    render(d) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(d);
    }
    optimizeNames(d, k) {
      if (super.optimizeNames(d, k))
        return this.iterable = z(this.iterable, d, k), this;
    }
    get names() {
      return B(super.names, this.iterable.names);
    }
  }
  class o extends N {
    constructor(d, k, R) {
      super(), this.name = d, this.args = k, this.async = R;
    }
    render(d) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(d);
    }
  }
  o.kind = "func";
  class l extends A {
    render(d) {
      return "return " + super.render(d);
    }
  }
  l.kind = "return";
  class u extends N {
    render(d) {
      let k = "try" + super.render(d);
      return this.catch && (k += this.catch.render(d)), this.finally && (k += this.finally.render(d)), k;
    }
    optimizeNodes() {
      var d, k;
      return super.optimizeNodes(), (d = this.catch) === null || d === void 0 || d.optimizeNodes(), (k = this.finally) === null || k === void 0 || k.optimizeNodes(), this;
    }
    optimizeNames(d, k) {
      var R, G;
      return super.optimizeNames(d, k), (R = this.catch) === null || R === void 0 || R.optimizeNames(d, k), (G = this.finally) === null || G === void 0 || G.optimizeNames(d, k), this;
    }
    get names() {
      const d = super.names;
      return this.catch && B(d, this.catch.names), this.finally && B(d, this.finally.names), d;
    }
  }
  class m extends N {
    constructor(d) {
      super(), this.error = d;
    }
    render(d) {
      return `catch(${this.error})` + super.render(d);
    }
  }
  m.kind = "catch";
  class f extends N {
    render(d) {
      return "finally" + super.render(d);
    }
  }
  f.kind = "finally";
  class x {
    constructor(d, k = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...k, _n: k.lines ? `
` : "" }, this._extScope = d, this._scope = new a.Scope({ parent: d }), this._nodes = [new C()];
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
    scopeValue(d, k) {
      const R = this._extScope.value(d, k);
      return (this._values[R.prefix] || (this._values[R.prefix] = /* @__PURE__ */ new Set())).add(R), R;
    }
    getScopeValue(d, k) {
      return this._extScope.getValue(d, k);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(d) {
      return this._extScope.scopeRefs(d, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(d, k, R, G) {
      const K = this._scope.toName(k);
      return R !== void 0 && G && (this._constants[K.str] = R), this._leafNode(new p(d, K, R)), K;
    }
    // `const` declaration (`var` in es5 mode)
    const(d, k, R) {
      return this._def(a.varKinds.const, d, k, R);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(d, k, R) {
      return this._def(a.varKinds.let, d, k, R);
    }
    // `var` declaration with optional assignment
    var(d, k, R) {
      return this._def(a.varKinds.var, d, k, R);
    }
    // assignment code
    assign(d, k, R) {
      return this._leafNode(new b(d, k, R));
    }
    // `+=` code
    add(d, k) {
      return this._leafNode(new _(d, e.operators.ADD, k));
    }
    // appends passed SafeExpr to code or executes Block
    code(d) {
      return typeof d == "function" ? d() : d !== t.nil && this._leafNode(new L(d)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...d) {
      const k = ["{"];
      for (const [R, G] of d)
        k.length > 1 && k.push(","), k.push(R), (R !== G || this.opts.es5) && (k.push(":"), (0, t.addCodeArg)(k, G));
      return k.push("}"), new t._Code(k);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(d, k, R) {
      if (this._blockNode(new v(d)), k && R)
        this.code(k).else().code(R).endIf();
      else if (k)
        this.code(k).endIf();
      else if (R)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(d) {
      return this._elseNode(new v(d));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new T());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(v, T);
    }
    _for(d, k) {
      return this._blockNode(d), k && this.code(k).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(d, k) {
      return this._for(new I(d), k);
    }
    // `for` statement for a range of values
    forRange(d, k, R, G, K = this.opts.es5 ? a.varKinds.var : a.varKinds.let) {
      const X = this._scope.toName(d);
      return this._for(new r(K, X, k, R), () => G(X));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(d, k, R, G = a.varKinds.const) {
      const K = this._scope.toName(d);
      if (this.opts.es5) {
        const X = k instanceof t.Name ? k : this.var("_arr", k);
        return this.forRange("_i", 0, (0, t._)`${X}.length`, (ee) => {
          this.var(K, (0, t._)`${X}[${ee}]`), R(K);
        });
      }
      return this._for(new i("of", G, K, k), () => R(K));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(d, k, R, G = this.opts.es5 ? a.varKinds.var : a.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(d, (0, t._)`Object.keys(${k})`, R);
      const K = this._scope.toName(d);
      return this._for(new i("in", G, K, k), () => R(K));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(j);
    }
    // `label` statement
    label(d) {
      return this._leafNode(new y(d));
    }
    // `break` statement
    break(d) {
      return this._leafNode(new g(d));
    }
    // `return` statement
    return(d) {
      const k = new l();
      if (this._blockNode(k), this.code(d), k.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(l);
    }
    // `try` statement
    try(d, k, R) {
      if (!k && !R)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const G = new u();
      if (this._blockNode(G), this.code(d), k) {
        const K = this.name("e");
        this._currNode = G.catch = new m(K), k(K);
      }
      return R && (this._currNode = G.finally = new f(), this.code(R)), this._endBlockNode(m, f);
    }
    // `throw` statement
    throw(d) {
      return this._leafNode(new S(d));
    }
    // start self-balancing block
    block(d, k) {
      return this._blockStarts.push(this._nodes.length), d && this.code(d).endBlock(k), this;
    }
    // end the current self-balancing block
    endBlock(d) {
      const k = this._blockStarts.pop();
      if (k === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const R = this._nodes.length - k;
      if (R < 0 || d !== void 0 && R !== d)
        throw new Error(`CodeGen: wrong number of nodes: ${R} vs ${d} expected`);
      return this._nodes.length = k, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(d, k = t.nil, R, G) {
      return this._blockNode(new o(d, k, R)), G && this.code(G).endFunc(), this;
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
    _endBlockNode(d, k) {
      const R = this._currNode;
      if (R instanceof d || k && R instanceof k)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${k ? `${d.kind}/${k.kind}` : d.kind}"`);
    }
    _elseNode(d) {
      const k = this._currNode;
      if (!(k instanceof v))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = k.else = d, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const d = this._nodes;
      return d[d.length - 1];
    }
    set _currNode(d) {
      const k = this._nodes;
      k[k.length - 1] = d;
    }
  }
  e.CodeGen = x;
  function B(O, d) {
    for (const k in d)
      O[k] = (O[k] || 0) + (d[k] || 0);
    return O;
  }
  function U(O, d) {
    return d instanceof t._CodeOrName ? B(O, d.names) : O;
  }
  function z(O, d, k) {
    if (O instanceof t.Name)
      return R(O);
    if (!G(O))
      return O;
    return new t._Code(O._items.reduce((K, X) => (X instanceof t.Name && (X = R(X)), X instanceof t._Code ? K.push(...X._items) : K.push(X), K), []));
    function R(K) {
      const X = k[K.str];
      return X === void 0 || d[K.str] !== 1 ? K : (delete d[K.str], X);
    }
    function G(K) {
      return K instanceof t._Code && K._items.some((X) => X instanceof t.Name && d[X.str] === 1 && k[X.str] !== void 0);
    }
  }
  function H(O, d) {
    for (const k in d)
      O[k] = (O[k] || 0) - (d[k] || 0);
  }
  function w(O) {
    return typeof O == "boolean" || typeof O == "number" || O === null ? !O : (0, t._)`!${F(O)}`;
  }
  e.not = w;
  const q = E(e.operators.AND);
  function W(...O) {
    return O.reduce(q);
  }
  e.and = W;
  const J = E(e.operators.OR);
  function V(...O) {
    return O.reduce(J);
  }
  e.or = V;
  function E(O) {
    return (d, k) => d === t.nil ? k : k === t.nil ? d : (0, t._)`${F(d)} ${O} ${F(k)}`;
  }
  function F(O) {
    return O instanceof t.Name ? O : (0, t._)`(${O})`;
  }
})(ve);
var ke = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.checkStrictMode = e.getErrorPath = e.Type = e.useFunc = e.setEvaluated = e.evaluatedPropsToName = e.mergeEvaluated = e.eachItem = e.unescapeJsonPointer = e.escapeJsonPointer = e.escapeFragment = e.unescapeFragment = e.schemaRefOrVal = e.schemaHasRulesButRef = e.schemaHasRules = e.checkUnknownRules = e.alwaysValidSchema = e.toHash = void 0;
  const t = ve, a = Ga;
  function n(o) {
    const l = {};
    for (const u of o)
      l[u] = !0;
    return l;
  }
  e.toHash = n;
  function s(o, l) {
    return typeof l == "boolean" ? l : Object.keys(l).length === 0 ? !0 : (c(o, l), !p(l, o.self.RULES.all));
  }
  e.alwaysValidSchema = s;
  function c(o, l = o.schema) {
    const { opts: u, self: m } = o;
    if (!u.strictSchema || typeof l == "boolean")
      return;
    const f = m.RULES.keywords;
    for (const x in l)
      f[x] || i(o, `unknown keyword: "${x}"`);
  }
  e.checkUnknownRules = c;
  function p(o, l) {
    if (typeof o == "boolean")
      return !o;
    for (const u in o)
      if (l[u])
        return !0;
    return !1;
  }
  e.schemaHasRules = p;
  function b(o, l) {
    if (typeof o == "boolean")
      return !o;
    for (const u in o)
      if (u !== "$ref" && l.all[u])
        return !0;
    return !1;
  }
  e.schemaHasRulesButRef = b;
  function _({ topSchemaRef: o, schemaPath: l }, u, m, f) {
    if (!f) {
      if (typeof u == "number" || typeof u == "boolean")
        return u;
      if (typeof u == "string")
        return (0, t._)`${u}`;
    }
    return (0, t._)`${o}${l}${(0, t.getProperty)(m)}`;
  }
  e.schemaRefOrVal = _;
  function y(o) {
    return L(decodeURIComponent(o));
  }
  e.unescapeFragment = y;
  function g(o) {
    return encodeURIComponent(S(o));
  }
  e.escapeFragment = g;
  function S(o) {
    return typeof o == "number" ? `${o}` : o.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  e.escapeJsonPointer = S;
  function L(o) {
    return o.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  e.unescapeJsonPointer = L;
  function A(o, l) {
    if (Array.isArray(o))
      for (const u of o)
        l(u);
    else
      l(o);
  }
  e.eachItem = A;
  function N({ mergeNames: o, mergeToName: l, mergeValues: u, resultToName: m }) {
    return (f, x, B, U) => {
      const z = B === void 0 ? x : B instanceof t.Name ? (x instanceof t.Name ? o(f, x, B) : l(f, x, B), B) : x instanceof t.Name ? (l(f, B, x), x) : u(x, B);
      return U === t.Name && !(z instanceof t.Name) ? m(f, z) : z;
    };
  }
  e.mergeEvaluated = {
    props: N({
      mergeNames: (o, l, u) => o.if((0, t._)`${u} !== true && ${l} !== undefined`, () => {
        o.if((0, t._)`${l} === true`, () => o.assign(u, !0), () => o.assign(u, (0, t._)`${u} || {}`).code((0, t._)`Object.assign(${u}, ${l})`));
      }),
      mergeToName: (o, l, u) => o.if((0, t._)`${u} !== true`, () => {
        l === !0 ? o.assign(u, !0) : (o.assign(u, (0, t._)`${u} || {}`), T(o, u, l));
      }),
      mergeValues: (o, l) => o === !0 ? !0 : { ...o, ...l },
      resultToName: C
    }),
    items: N({
      mergeNames: (o, l, u) => o.if((0, t._)`${u} !== true && ${l} !== undefined`, () => o.assign(u, (0, t._)`${l} === true ? true : ${u} > ${l} ? ${u} : ${l}`)),
      mergeToName: (o, l, u) => o.if((0, t._)`${u} !== true`, () => o.assign(u, l === !0 ? !0 : (0, t._)`${u} > ${l} ? ${u} : ${l}`)),
      mergeValues: (o, l) => o === !0 ? !0 : Math.max(o, l),
      resultToName: (o, l) => o.var("items", l)
    })
  };
  function C(o, l) {
    if (l === !0)
      return o.var("props", !0);
    const u = o.var("props", (0, t._)`{}`);
    return l !== void 0 && T(o, u, l), u;
  }
  e.evaluatedPropsToName = C;
  function T(o, l, u) {
    Object.keys(u).forEach((m) => o.assign((0, t._)`${l}${(0, t.getProperty)(m)}`, !0));
  }
  e.setEvaluated = T;
  const v = {};
  function j(o, l) {
    return o.scopeValue("func", {
      ref: l,
      code: v[l.code] || (v[l.code] = new a._Code(l.code))
    });
  }
  e.useFunc = j;
  var I;
  (function(o) {
    o[o.Num = 0] = "Num", o[o.Str = 1] = "Str";
  })(I = e.Type || (e.Type = {}));
  function r(o, l, u) {
    if (o instanceof t.Name) {
      const m = l === I.Num;
      return u ? m ? (0, t._)`"[" + ${o} + "]"` : (0, t._)`"['" + ${o} + "']"` : m ? (0, t._)`"/" + ${o}` : (0, t._)`"/" + ${o}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return u ? (0, t.getProperty)(o).toString() : "/" + S(o);
  }
  e.getErrorPath = r;
  function i(o, l, u = o.opts.strictSchema) {
    if (u) {
      if (l = `strict mode: ${l}`, u === !0)
        throw new Error(l);
      o.self.logger.warn(l);
    }
  }
  e.checkStrictMode = i;
})(ke);
var lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
const nt = ve, Nm = {
  // validation function arguments
  data: new nt.Name("data"),
  // args passed from referencing schema
  valCxt: new nt.Name("valCxt"),
  instancePath: new nt.Name("instancePath"),
  parentData: new nt.Name("parentData"),
  parentDataProperty: new nt.Name("parentDataProperty"),
  rootData: new nt.Name("rootData"),
  dynamicAnchors: new nt.Name("dynamicAnchors"),
  // function scoped variables
  vErrors: new nt.Name("vErrors"),
  errors: new nt.Name("errors"),
  this: new nt.Name("this"),
  // "globals"
  self: new nt.Name("self"),
  scope: new nt.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new nt.Name("json"),
  jsonPos: new nt.Name("jsonPos"),
  jsonLen: new nt.Name("jsonLen"),
  jsonPart: new nt.Name("jsonPart")
};
lr.default = Nm;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = ve, a = ke, n = lr;
  e.keywordError = {
    message: ({ keyword: T }) => (0, t.str)`must pass "${T}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: T, schemaType: v }) => v ? (0, t.str)`"${T}" keyword must be ${v} ($data)` : (0, t.str)`"${T}" keyword is invalid ($data)`
  };
  function s(T, v = e.keywordError, j, I) {
    const { it: r } = T, { gen: i, compositeRule: o, allErrors: l } = r, u = S(T, v, j);
    I ?? (o || l) ? _(i, u) : y(r, (0, t._)`[${u}]`);
  }
  e.reportError = s;
  function c(T, v = e.keywordError, j) {
    const { it: I } = T, { gen: r, compositeRule: i, allErrors: o } = I, l = S(T, v, j);
    _(r, l), i || o || y(I, n.default.vErrors);
  }
  e.reportExtraError = c;
  function p(T, v) {
    T.assign(n.default.errors, v), T.if((0, t._)`${n.default.vErrors} !== null`, () => T.if(v, () => T.assign((0, t._)`${n.default.vErrors}.length`, v), () => T.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = p;
  function b({ gen: T, keyword: v, schemaValue: j, data: I, errsCount: r, it: i }) {
    if (r === void 0)
      throw new Error("ajv implementation error");
    const o = T.name("err");
    T.forRange("i", r, n.default.errors, (l) => {
      T.const(o, (0, t._)`${n.default.vErrors}[${l}]`), T.if((0, t._)`${o}.instancePath === undefined`, () => T.assign((0, t._)`${o}.instancePath`, (0, t.strConcat)(n.default.instancePath, i.errorPath))), T.assign((0, t._)`${o}.schemaPath`, (0, t.str)`${i.errSchemaPath}/${v}`), i.opts.verbose && (T.assign((0, t._)`${o}.schema`, j), T.assign((0, t._)`${o}.data`, I));
    });
  }
  e.extendErrors = b;
  function _(T, v) {
    const j = T.const("err", v);
    T.if((0, t._)`${n.default.vErrors} === null`, () => T.assign(n.default.vErrors, (0, t._)`[${j}]`), (0, t._)`${n.default.vErrors}.push(${j})`), T.code((0, t._)`${n.default.errors}++`);
  }
  function y(T, v) {
    const { gen: j, validateName: I, schemaEnv: r } = T;
    r.$async ? j.throw((0, t._)`new ${T.ValidationError}(${v})`) : (j.assign((0, t._)`${I}.errors`, v), j.return(!1));
  }
  const g = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function S(T, v, j) {
    const { createErrors: I } = T.it;
    return I === !1 ? (0, t._)`{}` : L(T, v, j);
  }
  function L(T, v, j = {}) {
    const { gen: I, it: r } = T, i = [
      A(r, j),
      N(T, j)
    ];
    return C(T, v, i), I.object(...i);
  }
  function A({ errorPath: T }, { instancePath: v }) {
    const j = v ? (0, t.str)`${T}${(0, a.getErrorPath)(v, a.Type.Str)}` : T;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, j)];
  }
  function N({ keyword: T, it: { errSchemaPath: v } }, { schemaPath: j, parentSchema: I }) {
    let r = I ? v : (0, t.str)`${v}/${T}`;
    return j && (r = (0, t.str)`${r}${(0, a.getErrorPath)(j, a.Type.Str)}`), [g.schemaPath, r];
  }
  function C(T, { params: v, message: j }, I) {
    const { keyword: r, data: i, schemaValue: o, it: l } = T, { opts: u, propertyName: m, topSchemaRef: f, schemaPath: x } = l;
    I.push([g.keyword, r], [g.params, typeof v == "function" ? v(T) : v || (0, t._)`{}`]), u.messages && I.push([g.message, typeof j == "function" ? j(T) : j]), u.verbose && I.push([g.schema, o], [g.parentSchema, (0, t._)`${f}${x}`], [n.default.data, i]), m && I.push([g.propertyName, m]);
  }
})(Qa);
Object.defineProperty(ca, "__esModule", { value: !0 });
ca.boolOrEmptySchema = ca.topBoolOrEmptySchema = void 0;
const Lm = Qa, Rm = ve, Im = lr, Am = {
  message: "boolean schema is false"
};
function Mm(e) {
  const { gen: t, schema: a, validateName: n } = e;
  a === !1 ? Vl(e, !1) : typeof a == "object" && a.$async === !0 ? t.return(Im.default.data) : (t.assign((0, Rm._)`${n}.errors`, null), t.return(!0));
}
ca.topBoolOrEmptySchema = Mm;
function Dm(e, t) {
  const { gen: a, schema: n } = e;
  n === !1 ? (a.var(t, !1), Vl(e)) : a.var(t, !0);
}
ca.boolOrEmptySchema = Dm;
function Vl(e, t) {
  const { gen: a, data: n } = e, s = {
    gen: a,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, Lm.reportError)(s, Am, void 0, t);
}
var Xa = {}, qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.getRules = qr.isJSONType = void 0;
const zm = ["string", "number", "integer", "boolean", "null", "object", "array"], Bm = new Set(zm);
function Vm(e) {
  return typeof e == "string" && Bm.has(e);
}
qr.isJSONType = Vm;
function Fm() {
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
qr.getRules = Fm;
var yr = {};
Object.defineProperty(yr, "__esModule", { value: !0 });
yr.shouldUseRule = yr.shouldUseGroup = yr.schemaHasRulesForType = void 0;
function Um({ schema: e, self: t }, a) {
  const n = t.RULES.types[a];
  return n && n !== !0 && Fl(e, n);
}
yr.schemaHasRulesForType = Um;
function Fl(e, t) {
  return t.rules.some((a) => Ul(e, a));
}
yr.shouldUseGroup = Fl;
function Ul(e, t) {
  var a;
  return e[t.keyword] !== void 0 || ((a = t.definition.implements) === null || a === void 0 ? void 0 : a.some((n) => e[n] !== void 0));
}
yr.shouldUseRule = Ul;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.reportTypeError = e.checkDataTypes = e.checkDataType = e.coerceAndCheckDataType = e.getJSONTypes = e.getSchemaTypes = e.DataType = void 0;
  const t = qr, a = yr, n = Qa, s = ve, c = ke;
  var p;
  (function(I) {
    I[I.Correct = 0] = "Correct", I[I.Wrong = 1] = "Wrong";
  })(p = e.DataType || (e.DataType = {}));
  function b(I) {
    const r = _(I.type);
    if (r.includes("null")) {
      if (I.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!r.length && I.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      I.nullable === !0 && r.push("null");
    }
    return r;
  }
  e.getSchemaTypes = b;
  function _(I) {
    const r = Array.isArray(I) ? I : I ? [I] : [];
    if (r.every(t.isJSONType))
      return r;
    throw new Error("type must be JSONType or JSONType[]: " + r.join(","));
  }
  e.getJSONTypes = _;
  function y(I, r) {
    const { gen: i, data: o, opts: l } = I, u = S(r, l.coerceTypes), m = r.length > 0 && !(u.length === 0 && r.length === 1 && (0, a.schemaHasRulesForType)(I, r[0]));
    if (m) {
      const f = C(r, o, l.strictNumbers, p.Wrong);
      i.if(f, () => {
        u.length ? L(I, r, u) : v(I);
      });
    }
    return m;
  }
  e.coerceAndCheckDataType = y;
  const g = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function S(I, r) {
    return r ? I.filter((i) => g.has(i) || r === "array" && i === "array") : [];
  }
  function L(I, r, i) {
    const { gen: o, data: l, opts: u } = I, m = o.let("dataType", (0, s._)`typeof ${l}`), f = o.let("coerced", (0, s._)`undefined`);
    u.coerceTypes === "array" && o.if((0, s._)`${m} == 'object' && Array.isArray(${l}) && ${l}.length == 1`, () => o.assign(l, (0, s._)`${l}[0]`).assign(m, (0, s._)`typeof ${l}`).if(C(r, l, u.strictNumbers), () => o.assign(f, l))), o.if((0, s._)`${f} !== undefined`);
    for (const B of i)
      (g.has(B) || B === "array" && u.coerceTypes === "array") && x(B);
    o.else(), v(I), o.endIf(), o.if((0, s._)`${f} !== undefined`, () => {
      o.assign(l, f), A(I, f);
    });
    function x(B) {
      switch (B) {
        case "string":
          o.elseIf((0, s._)`${m} == "number" || ${m} == "boolean"`).assign(f, (0, s._)`"" + ${l}`).elseIf((0, s._)`${l} === null`).assign(f, (0, s._)`""`);
          return;
        case "number":
          o.elseIf((0, s._)`${m} == "boolean" || ${l} === null
              || (${m} == "string" && ${l} && ${l} == +${l})`).assign(f, (0, s._)`+${l}`);
          return;
        case "integer":
          o.elseIf((0, s._)`${m} === "boolean" || ${l} === null
              || (${m} === "string" && ${l} && ${l} == +${l} && !(${l} % 1))`).assign(f, (0, s._)`+${l}`);
          return;
        case "boolean":
          o.elseIf((0, s._)`${l} === "false" || ${l} === 0 || ${l} === null`).assign(f, !1).elseIf((0, s._)`${l} === "true" || ${l} === 1`).assign(f, !0);
          return;
        case "null":
          o.elseIf((0, s._)`${l} === "" || ${l} === 0 || ${l} === false`), o.assign(f, null);
          return;
        case "array":
          o.elseIf((0, s._)`${m} === "string" || ${m} === "number"
              || ${m} === "boolean" || ${l} === null`).assign(f, (0, s._)`[${l}]`);
      }
    }
  }
  function A({ gen: I, parentData: r, parentDataProperty: i }, o) {
    I.if((0, s._)`${r} !== undefined`, () => I.assign((0, s._)`${r}[${i}]`, o));
  }
  function N(I, r, i, o = p.Correct) {
    const l = o === p.Correct ? s.operators.EQ : s.operators.NEQ;
    let u;
    switch (I) {
      case "null":
        return (0, s._)`${r} ${l} null`;
      case "array":
        u = (0, s._)`Array.isArray(${r})`;
        break;
      case "object":
        u = (0, s._)`${r} && typeof ${r} == "object" && !Array.isArray(${r})`;
        break;
      case "integer":
        u = m((0, s._)`!(${r} % 1) && !isNaN(${r})`);
        break;
      case "number":
        u = m();
        break;
      default:
        return (0, s._)`typeof ${r} ${l} ${I}`;
    }
    return o === p.Correct ? u : (0, s.not)(u);
    function m(f = s.nil) {
      return (0, s.and)((0, s._)`typeof ${r} == "number"`, f, i ? (0, s._)`isFinite(${r})` : s.nil);
    }
  }
  e.checkDataType = N;
  function C(I, r, i, o) {
    if (I.length === 1)
      return N(I[0], r, i, o);
    let l;
    const u = (0, c.toHash)(I);
    if (u.array && u.object) {
      const m = (0, s._)`typeof ${r} != "object"`;
      l = u.null ? m : (0, s._)`!${r} || ${m}`, delete u.null, delete u.array, delete u.object;
    } else
      l = s.nil;
    u.number && delete u.integer;
    for (const m in u)
      l = (0, s.and)(l, N(m, r, i, o));
    return l;
  }
  e.checkDataTypes = C;
  const T = {
    message: ({ schema: I }) => `must be ${I}`,
    params: ({ schema: I, schemaValue: r }) => typeof I == "string" ? (0, s._)`{type: ${I}}` : (0, s._)`{type: ${r}}`
  };
  function v(I) {
    const r = j(I);
    (0, n.reportError)(r, T);
  }
  e.reportTypeError = v;
  function j(I) {
    const { gen: r, data: i, schema: o } = I, l = (0, c.schemaRefOrVal)(I, o, "type");
    return {
      gen: r,
      keyword: "type",
      data: i,
      schema: o.type,
      schemaCode: l,
      schemaValue: l,
      parentSchema: o,
      params: {},
      it: I
    };
  }
})(Xa);
var Gn = {};
Object.defineProperty(Gn, "__esModule", { value: !0 });
Gn.assignDefaults = void 0;
const Wr = ve, qm = ke;
function Hm(e, t) {
  const { properties: a, items: n } = e.schema;
  if (t === "object" && a)
    for (const s in a)
      rc(e, s, a[s].default);
  else
    t === "array" && Array.isArray(n) && n.forEach((s, c) => rc(e, c, s.default));
}
Gn.assignDefaults = Hm;
function rc(e, t, a) {
  const { gen: n, compositeRule: s, data: c, opts: p } = e;
  if (a === void 0)
    return;
  const b = (0, Wr._)`${c}${(0, Wr.getProperty)(t)}`;
  if (s) {
    (0, qm.checkStrictMode)(e, `default is ignored for: ${b}`);
    return;
  }
  let _ = (0, Wr._)`${b} === undefined`;
  p.useDefaults === "empty" && (_ = (0, Wr._)`${_} || ${b} === null || ${b} === ""`), n.if(_, (0, Wr._)`${b} = ${(0, Wr.stringify)(a)}`);
}
var ir = {}, _e = {};
Object.defineProperty(_e, "__esModule", { value: !0 });
_e.validateUnion = _e.validateArray = _e.usePattern = _e.callValidateCode = _e.schemaProperties = _e.allSchemaProperties = _e.noPropertyInData = _e.propertyInData = _e.isOwnProperty = _e.hasPropFunc = _e.reportMissingProp = _e.checkMissingProp = _e.checkReportMissingProp = void 0;
const Me = ve, Ts = ke, vr = lr, Gm = ke;
function Km(e, t) {
  const { gen: a, data: n, it: s } = e;
  a.if(Cs(a, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Me._)`${t}` }, !0), e.error();
  });
}
_e.checkReportMissingProp = Km;
function Wm({ gen: e, data: t, it: { opts: a } }, n, s) {
  return (0, Me.or)(...n.map((c) => (0, Me.and)(Cs(e, t, c, a.ownProperties), (0, Me._)`${s} = ${c}`)));
}
_e.checkMissingProp = Wm;
function Jm(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
_e.reportMissingProp = Jm;
function ql(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Me._)`Object.prototype.hasOwnProperty`
  });
}
_e.hasPropFunc = ql;
function js(e, t, a) {
  return (0, Me._)`${ql(e)}.call(${t}, ${a})`;
}
_e.isOwnProperty = js;
function Zm(e, t, a, n) {
  const s = (0, Me._)`${t}${(0, Me.getProperty)(a)} !== undefined`;
  return n ? (0, Me._)`${s} && ${js(e, t, a)}` : s;
}
_e.propertyInData = Zm;
function Cs(e, t, a, n) {
  const s = (0, Me._)`${t}${(0, Me.getProperty)(a)} === undefined`;
  return n ? (0, Me.or)(s, (0, Me.not)(js(e, t, a))) : s;
}
_e.noPropertyInData = Cs;
function Hl(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
_e.allSchemaProperties = Hl;
function Ym(e, t) {
  return Hl(t).filter((a) => !(0, Ts.alwaysValidSchema)(e, t[a]));
}
_e.schemaProperties = Ym;
function Qm({ schemaCode: e, data: t, it: { gen: a, topSchemaRef: n, schemaPath: s, errorPath: c }, it: p }, b, _, y) {
  const g = y ? (0, Me._)`${e}, ${t}, ${n}${s}` : t, S = [
    [vr.default.instancePath, (0, Me.strConcat)(vr.default.instancePath, c)],
    [vr.default.parentData, p.parentData],
    [vr.default.parentDataProperty, p.parentDataProperty],
    [vr.default.rootData, vr.default.rootData]
  ];
  p.opts.dynamicRef && S.push([vr.default.dynamicAnchors, vr.default.dynamicAnchors]);
  const L = (0, Me._)`${g}, ${a.object(...S)}`;
  return _ !== Me.nil ? (0, Me._)`${b}.call(${_}, ${L})` : (0, Me._)`${b}(${L})`;
}
_e.callValidateCode = Qm;
const Xm = (0, Me._)`new RegExp`;
function eg({ gen: e, it: { opts: t } }, a) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, c = s(a, n);
  return e.scopeValue("pattern", {
    key: c.toString(),
    ref: c,
    code: (0, Me._)`${s.code === "new RegExp" ? Xm : (0, Gm.useFunc)(e, s)}(${a}, ${n})`
  });
}
_e.usePattern = eg;
function tg(e) {
  const { gen: t, data: a, keyword: n, it: s } = e, c = t.name("valid");
  if (s.allErrors) {
    const b = t.let("valid", !0);
    return p(() => t.assign(b, !1)), b;
  }
  return t.var(c, !0), p(() => t.break()), c;
  function p(b) {
    const _ = t.const("len", (0, Me._)`${a}.length`);
    t.forRange("i", 0, _, (y) => {
      e.subschema({
        keyword: n,
        dataProp: y,
        dataPropType: Ts.Type.Num
      }, c), t.if((0, Me.not)(c), b);
    });
  }
}
_e.validateArray = tg;
function rg(e) {
  const { gen: t, schema: a, keyword: n, it: s } = e;
  if (!Array.isArray(a))
    throw new Error("ajv implementation error");
  if (a.some((b) => (0, Ts.alwaysValidSchema)(s, b)) && !s.opts.unevaluated)
    return;
  const c = t.let("valid", !1), p = t.name("_valid");
  t.block(() => a.forEach((b, _) => {
    const y = e.subschema({
      keyword: n,
      schemaProp: _,
      compositeRule: !0
    }, p);
    t.assign(c, (0, Me._)`${c} || ${p}`), e.mergeValidEvaluated(y, p) || t.if((0, Me.not)(c));
  })), e.result(c, () => e.reset(), () => e.error(!0));
}
_e.validateUnion = rg;
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.validateKeywordUsage = ir.validSchemaType = ir.funcKeywordCode = ir.macroKeywordCode = void 0;
const pt = ve, zr = lr, ag = _e, ng = Qa;
function og(e, t) {
  const { gen: a, keyword: n, schema: s, parentSchema: c, it: p } = e, b = t.macro.call(p.self, s, c, p), _ = Gl(a, n, b);
  p.opts.validateSchema !== !1 && p.self.validateSchema(b, !0);
  const y = a.name("valid");
  e.subschema({
    schema: b,
    schemaPath: pt.nil,
    errSchemaPath: `${p.errSchemaPath}/${n}`,
    topSchemaRef: _,
    compositeRule: !0
  }, y), e.pass(y, () => e.error(!0));
}
ir.macroKeywordCode = og;
function sg(e, t) {
  var a;
  const { gen: n, keyword: s, schema: c, parentSchema: p, $data: b, it: _ } = e;
  cg(_, t);
  const y = !b && t.compile ? t.compile.call(_.self, c, p, _) : t.validate, g = Gl(n, s, y), S = n.let("valid");
  e.block$data(S, L), e.ok((a = t.valid) !== null && a !== void 0 ? a : S);
  function L() {
    if (t.errors === !1)
      C(), t.modifying && ac(e), T(() => e.error());
    else {
      const v = t.async ? A() : N();
      t.modifying && ac(e), T(() => ig(e, v));
    }
  }
  function A() {
    const v = n.let("ruleErrs", null);
    return n.try(() => C((0, pt._)`await `), (j) => n.assign(S, !1).if((0, pt._)`${j} instanceof ${_.ValidationError}`, () => n.assign(v, (0, pt._)`${j}.errors`), () => n.throw(j))), v;
  }
  function N() {
    const v = (0, pt._)`${g}.errors`;
    return n.assign(v, null), C(pt.nil), v;
  }
  function C(v = t.async ? (0, pt._)`await ` : pt.nil) {
    const j = _.opts.passContext ? zr.default.this : zr.default.self, I = !("compile" in t && !b || t.schema === !1);
    n.assign(S, (0, pt._)`${v}${(0, ag.callValidateCode)(e, g, j, I)}`, t.modifying);
  }
  function T(v) {
    var j;
    n.if((0, pt.not)((j = t.valid) !== null && j !== void 0 ? j : S), v);
  }
}
ir.funcKeywordCode = sg;
function ac(e) {
  const { gen: t, data: a, it: n } = e;
  t.if(n.parentData, () => t.assign(a, (0, pt._)`${n.parentData}[${n.parentDataProperty}]`));
}
function ig(e, t) {
  const { gen: a } = e;
  a.if((0, pt._)`Array.isArray(${t})`, () => {
    a.assign(zr.default.vErrors, (0, pt._)`${zr.default.vErrors} === null ? ${t} : ${zr.default.vErrors}.concat(${t})`).assign(zr.default.errors, (0, pt._)`${zr.default.vErrors}.length`), (0, ng.extendErrors)(e);
  }, () => e.error());
}
function cg({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Gl(e, t, a) {
  if (a === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof a == "function" ? { ref: a } : { ref: a, code: (0, pt.stringify)(a) });
}
function lg(e, t, a = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || a && typeof e > "u");
}
ir.validSchemaType = lg;
function ug({ schema: e, opts: t, self: a, errSchemaPath: n }, s, c) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(c) : s.keyword !== c)
    throw new Error("ajv implementation error");
  const p = s.dependencies;
  if (p != null && p.some((b) => !Object.prototype.hasOwnProperty.call(e, b)))
    throw new Error(`parent schema must have dependencies of ${c}: ${p.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[c])) {
    const b = `keyword "${c}" value is invalid at path "${n}": ` + a.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      a.logger.error(b);
    else
      throw new Error(b);
  }
}
ir.validateKeywordUsage = ug;
var jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.extendSubschemaMode = jr.extendSubschemaData = jr.getSubschema = void 0;
const or = ve, Kl = ke;
function dg(e, { keyword: t, schemaProp: a, schema: n, schemaPath: s, errSchemaPath: c, topSchemaRef: p }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const b = e.schema[t];
    return a === void 0 ? {
      schema: b,
      schemaPath: (0, or._)`${e.schemaPath}${(0, or.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: b[a],
      schemaPath: (0, or._)`${e.schemaPath}${(0, or.getProperty)(t)}${(0, or.getProperty)(a)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Kl.escapeFragment)(a)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || c === void 0 || p === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: p,
      errSchemaPath: c
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
jr.getSubschema = dg;
function hg(e, t, { dataProp: a, dataPropType: n, data: s, dataTypes: c, propertyName: p }) {
  if (s !== void 0 && a !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: b } = t;
  if (a !== void 0) {
    const { errorPath: y, dataPathArr: g, opts: S } = t, L = b.let("data", (0, or._)`${t.data}${(0, or.getProperty)(a)}`, !0);
    _(L), e.errorPath = (0, or.str)`${y}${(0, Kl.getErrorPath)(a, n, S.jsPropertySyntax)}`, e.parentDataProperty = (0, or._)`${a}`, e.dataPathArr = [...g, e.parentDataProperty];
  }
  if (s !== void 0) {
    const y = s instanceof or.Name ? s : b.let("data", s, !0);
    _(y), p !== void 0 && (e.propertyName = p);
  }
  c && (e.dataTypes = c);
  function _(y) {
    e.data = y, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, y];
  }
}
jr.extendSubschemaData = hg;
function pg(e, { jtdDiscriminator: t, jtdMetadata: a, compositeRule: n, createErrors: s, allErrors: c }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), c !== void 0 && (e.allErrors = c), e.jtdDiscriminator = t, e.jtdMetadata = a;
}
jr.extendSubschemaMode = pg;
var rt = {}, Wl = function e(t, a) {
  if (t === a)
    return !0;
  if (t && a && typeof t == "object" && typeof a == "object") {
    if (t.constructor !== a.constructor)
      return !1;
    var n, s, c;
    if (Array.isArray(t)) {
      if (n = t.length, n != a.length)
        return !1;
      for (s = n; s-- !== 0; )
        if (!e(t[s], a[s]))
          return !1;
      return !0;
    }
    if (t.constructor === RegExp)
      return t.source === a.source && t.flags === a.flags;
    if (t.valueOf !== Object.prototype.valueOf)
      return t.valueOf() === a.valueOf();
    if (t.toString !== Object.prototype.toString)
      return t.toString() === a.toString();
    if (c = Object.keys(t), n = c.length, n !== Object.keys(a).length)
      return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(a, c[s]))
        return !1;
    for (s = n; s-- !== 0; ) {
      var p = c[s];
      if (!e(t[p], a[p]))
        return !1;
    }
    return !0;
  }
  return t !== t && a !== a;
}, Jl = { exports: {} }, xr = Jl.exports = function(e, t, a) {
  typeof t == "function" && (a = t, t = {}), a = t.cb || a;
  var n = typeof a == "function" ? a : a.pre || function() {
  }, s = a.post || function() {
  };
  $n(t, n, s, e, "", e);
};
xr.keywords = {
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
xr.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
xr.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
xr.skipKeywords = {
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
function $n(e, t, a, n, s, c, p, b, _, y) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, c, p, b, _, y);
    for (var g in n) {
      var S = n[g];
      if (Array.isArray(S)) {
        if (g in xr.arrayKeywords)
          for (var L = 0; L < S.length; L++)
            $n(e, t, a, S[L], s + "/" + g + "/" + L, c, s, g, n, L);
      } else if (g in xr.propsKeywords) {
        if (S && typeof S == "object")
          for (var A in S)
            $n(e, t, a, S[A], s + "/" + g + "/" + fg(A), c, s, g, n, A);
      } else
        (g in xr.keywords || e.allKeys && !(g in xr.skipKeywords)) && $n(e, t, a, S, s + "/" + g, c, s, g, n);
    }
    a(n, s, c, p, b, _, y);
  }
}
function fg(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var mg = Jl.exports;
Object.defineProperty(rt, "__esModule", { value: !0 });
rt.getSchemaRefs = rt.resolveUrl = rt.normalizeId = rt._getFullPath = rt.getFullPath = rt.inlineRef = void 0;
const gg = ke, yg = Wl, bg = mg, _g = /* @__PURE__ */ new Set([
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
function wg(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !No(e) : t ? Zl(e) <= t : !1;
}
rt.inlineRef = wg;
const vg = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function No(e) {
  for (const t in e) {
    if (vg.has(t))
      return !0;
    const a = e[t];
    if (Array.isArray(a) && a.some(No) || typeof a == "object" && No(a))
      return !0;
  }
  return !1;
}
function Zl(e) {
  let t = 0;
  for (const a in e)
    if (a === "$ref" || (t++, !_g.has(a) && (typeof e[a] == "object" && (0, gg.eachItem)(e[a], (n) => t += Zl(n)), t === 1 / 0)))
      return 1 / 0;
  return t;
}
function Yl(e, t = "", a) {
  a !== !1 && (t = na(t));
  const n = e.parse(t);
  return Ql(e, n);
}
rt.getFullPath = Yl;
function Ql(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
rt._getFullPath = Ql;
const $g = /#\/?$/;
function na(e) {
  return e ? e.replace($g, "") : "";
}
rt.normalizeId = na;
function kg(e, t, a) {
  return a = na(a), e.resolve(t, a);
}
rt.resolveUrl = kg;
const Eg = /^[a-z_][-a-z0-9._]*$/i;
function Pg(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: a, uriResolver: n } = this.opts, s = na(e[a] || t), c = { "": s }, p = Yl(n, s, !1), b = {}, _ = /* @__PURE__ */ new Set();
  return bg(e, { allKeys: !0 }, (S, L, A, N) => {
    if (N === void 0)
      return;
    const C = p + L;
    let T = c[N];
    typeof S[a] == "string" && (T = v.call(this, S[a])), j.call(this, S.$anchor), j.call(this, S.$dynamicAnchor), c[L] = T;
    function v(I) {
      const r = this.opts.uriResolver.resolve;
      if (I = na(T ? r(T, I) : I), _.has(I))
        throw g(I);
      _.add(I);
      let i = this.refs[I];
      return typeof i == "string" && (i = this.refs[i]), typeof i == "object" ? y(S, i.schema, I) : I !== na(C) && (I[0] === "#" ? (y(S, b[I], I), b[I] = S) : this.refs[I] = C), I;
    }
    function j(I) {
      if (typeof I == "string") {
        if (!Eg.test(I))
          throw new Error(`invalid anchor "${I}"`);
        v.call(this, `#${I}`);
      }
    }
  }), b;
  function y(S, L, A) {
    if (L !== void 0 && !yg(S, L))
      throw g(A);
  }
  function g(S) {
    return new Error(`reference "${S}" resolves to more than one schema`);
  }
}
rt.getSchemaRefs = Pg;
Object.defineProperty(tr, "__esModule", { value: !0 });
tr.getData = tr.KeywordCxt = tr.validateFunctionCode = void 0;
const Xl = ca, nc = Xa, Os = yr, Rn = Xa, Sg = Gn, Da = ir, mo = jr, ne = ve, ue = lr, xg = rt, br = ke, ja = Qa;
function Tg(e) {
  if (ru(e) && (au(e), tu(e))) {
    Og(e);
    return;
  }
  eu(e, () => (0, Xl.topBoolOrEmptySchema)(e));
}
tr.validateFunctionCode = Tg;
function eu({ gen: e, validateName: t, schema: a, schemaEnv: n, opts: s }, c) {
  s.code.es5 ? e.func(t, (0, ne._)`${ue.default.data}, ${ue.default.valCxt}`, n.$async, () => {
    e.code((0, ne._)`"use strict"; ${oc(a, s)}`), Cg(e, s), e.code(c);
  }) : e.func(t, (0, ne._)`${ue.default.data}, ${jg(s)}`, n.$async, () => e.code(oc(a, s)).code(c));
}
function jg(e) {
  return (0, ne._)`{${ue.default.instancePath}="", ${ue.default.parentData}, ${ue.default.parentDataProperty}, ${ue.default.rootData}=${ue.default.data}${e.dynamicRef ? (0, ne._)`, ${ue.default.dynamicAnchors}={}` : ne.nil}}={}`;
}
function Cg(e, t) {
  e.if(ue.default.valCxt, () => {
    e.var(ue.default.instancePath, (0, ne._)`${ue.default.valCxt}.${ue.default.instancePath}`), e.var(ue.default.parentData, (0, ne._)`${ue.default.valCxt}.${ue.default.parentData}`), e.var(ue.default.parentDataProperty, (0, ne._)`${ue.default.valCxt}.${ue.default.parentDataProperty}`), e.var(ue.default.rootData, (0, ne._)`${ue.default.valCxt}.${ue.default.rootData}`), t.dynamicRef && e.var(ue.default.dynamicAnchors, (0, ne._)`${ue.default.valCxt}.${ue.default.dynamicAnchors}`);
  }, () => {
    e.var(ue.default.instancePath, (0, ne._)`""`), e.var(ue.default.parentData, (0, ne._)`undefined`), e.var(ue.default.parentDataProperty, (0, ne._)`undefined`), e.var(ue.default.rootData, ue.default.data), t.dynamicRef && e.var(ue.default.dynamicAnchors, (0, ne._)`{}`);
  });
}
function Og(e) {
  const { schema: t, opts: a, gen: n } = e;
  eu(e, () => {
    a.$comment && t.$comment && ou(e), Ag(e), n.let(ue.default.vErrors, null), n.let(ue.default.errors, 0), a.unevaluated && Ng(e), nu(e), zg(e);
  });
}
function Ng(e) {
  const { gen: t, validateName: a } = e;
  e.evaluated = t.const("evaluated", (0, ne._)`${a}.evaluated`), t.if((0, ne._)`${e.evaluated}.dynamicProps`, () => t.assign((0, ne._)`${e.evaluated}.props`, (0, ne._)`undefined`)), t.if((0, ne._)`${e.evaluated}.dynamicItems`, () => t.assign((0, ne._)`${e.evaluated}.items`, (0, ne._)`undefined`));
}
function oc(e, t) {
  const a = typeof e == "object" && e[t.schemaId];
  return a && (t.code.source || t.code.process) ? (0, ne._)`/*# sourceURL=${a} */` : ne.nil;
}
function Lg(e, t) {
  if (ru(e) && (au(e), tu(e))) {
    Rg(e, t);
    return;
  }
  (0, Xl.boolOrEmptySchema)(e, t);
}
function tu({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const a in e)
    if (t.RULES.all[a])
      return !0;
  return !1;
}
function ru(e) {
  return typeof e.schema != "boolean";
}
function Rg(e, t) {
  const { schema: a, gen: n, opts: s } = e;
  s.$comment && a.$comment && ou(e), Mg(e), Dg(e);
  const c = n.const("_errs", ue.default.errors);
  nu(e, c), n.var(t, (0, ne._)`${c} === ${ue.default.errors}`);
}
function au(e) {
  (0, br.checkUnknownRules)(e), Ig(e);
}
function nu(e, t) {
  if (e.opts.jtd)
    return sc(e, [], !1, t);
  const a = (0, nc.getSchemaTypes)(e.schema), n = (0, nc.coerceAndCheckDataType)(e, a);
  sc(e, a, !n, t);
}
function Ig(e) {
  const { schema: t, errSchemaPath: a, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, br.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${a}"`);
}
function Ag(e) {
  const { schema: t, opts: a } = e;
  t.default !== void 0 && a.useDefaults && a.strictSchema && (0, br.checkStrictMode)(e, "default is ignored in the schema root");
}
function Mg(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, xg.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function Dg(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function ou({ gen: e, schemaEnv: t, schema: a, errSchemaPath: n, opts: s }) {
  const c = a.$comment;
  if (s.$comment === !0)
    e.code((0, ne._)`${ue.default.self}.logger.log(${c})`);
  else if (typeof s.$comment == "function") {
    const p = (0, ne.str)`${n}/$comment`, b = e.scopeValue("root", { ref: t.root });
    e.code((0, ne._)`${ue.default.self}.opts.$comment(${c}, ${p}, ${b}.schema)`);
  }
}
function zg(e) {
  const { gen: t, schemaEnv: a, validateName: n, ValidationError: s, opts: c } = e;
  a.$async ? t.if((0, ne._)`${ue.default.errors} === 0`, () => t.return(ue.default.data), () => t.throw((0, ne._)`new ${s}(${ue.default.vErrors})`)) : (t.assign((0, ne._)`${n}.errors`, ue.default.vErrors), c.unevaluated && Bg(e), t.return((0, ne._)`${ue.default.errors} === 0`));
}
function Bg({ gen: e, evaluated: t, props: a, items: n }) {
  a instanceof ne.Name && e.assign((0, ne._)`${t}.props`, a), n instanceof ne.Name && e.assign((0, ne._)`${t}.items`, n);
}
function sc(e, t, a, n) {
  const { gen: s, schema: c, data: p, allErrors: b, opts: _, self: y } = e, { RULES: g } = y;
  if (c.$ref && (_.ignoreKeywordsWithRef || !(0, br.schemaHasRulesButRef)(c, g))) {
    s.block(() => cu(e, "$ref", g.all.$ref.definition));
    return;
  }
  _.jtd || Vg(e, t), s.block(() => {
    for (const L of g.rules)
      S(L);
    S(g.post);
  });
  function S(L) {
    (0, Os.shouldUseGroup)(c, L) && (L.type ? (s.if((0, Rn.checkDataType)(L.type, p, _.strictNumbers)), ic(e, L), t.length === 1 && t[0] === L.type && a && (s.else(), (0, Rn.reportTypeError)(e)), s.endIf()) : ic(e, L), b || s.if((0, ne._)`${ue.default.errors} === ${n || 0}`));
  }
}
function ic(e, t) {
  const { gen: a, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Sg.assignDefaults)(e, t.type), a.block(() => {
    for (const c of t.rules)
      (0, Os.shouldUseRule)(n, c) && cu(e, c.keyword, c.definition, t.type);
  });
}
function Vg(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (Fg(e, t), e.opts.allowUnionTypes || Ug(e, t), qg(e, e.dataTypes));
}
function Fg(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((a) => {
      su(e.dataTypes, a) || Ns(e, `type "${a}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), Gg(e, t);
  }
}
function Ug(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Ns(e, "use allowUnionTypes to allow union type keyword");
}
function qg(e, t) {
  const a = e.self.RULES.all;
  for (const n in a) {
    const s = a[n];
    if (typeof s == "object" && (0, Os.shouldUseRule)(e.schema, s)) {
      const { type: c } = s.definition;
      c.length && !c.some((p) => Hg(t, p)) && Ns(e, `missing type "${c.join(",")}" for keyword "${n}"`);
    }
  }
}
function Hg(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function su(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function Gg(e, t) {
  const a = [];
  for (const n of e.dataTypes)
    su(t, n) ? a.push(n) : t.includes("integer") && n === "number" && a.push("integer");
  e.dataTypes = a;
}
function Ns(e, t) {
  const a = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${a}" (strictTypes)`, (0, br.checkStrictMode)(e, t, e.opts.strictTypes);
}
class iu {
  constructor(t, a, n) {
    if ((0, Da.validateKeywordUsage)(t, a, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = a.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, br.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = a.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = a, this.$data)
      this.schemaCode = t.gen.const("vSchema", lu(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Da.validSchemaType)(this.schema, a.schemaType, a.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(a.schemaType)}`);
    ("code" in a ? a.trackErrors : a.errors !== !1) && (this.errsCount = t.gen.const("_errs", ue.default.errors));
  }
  result(t, a, n) {
    this.failResult((0, ne.not)(t), a, n);
  }
  failResult(t, a, n) {
    this.gen.if(t), n ? n() : this.error(), a ? (this.gen.else(), a(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, a) {
    this.failResult((0, ne.not)(t), void 0, a);
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
    const { schemaCode: a } = this;
    this.fail((0, ne._)`${a} !== undefined && (${(0, ne.or)(this.invalid$data(), t)})`);
  }
  error(t, a, n) {
    if (a) {
      this.setParams(a), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, a) {
    (t ? ja.reportExtraError : ja.reportError)(this, this.def.error, a);
  }
  $dataError() {
    (0, ja.reportError)(this, this.def.$dataError || ja.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, ja.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, a) {
    a ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, a, n = ne.nil) {
    this.gen.block(() => {
      this.check$data(t, n), a();
    });
  }
  check$data(t = ne.nil, a = ne.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: c, def: p } = this;
    n.if((0, ne.or)((0, ne._)`${s} === undefined`, a)), t !== ne.nil && n.assign(t, !0), (c.length || p.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== ne.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: a, schemaType: n, def: s, it: c } = this;
    return (0, ne.or)(p(), b());
    function p() {
      if (n.length) {
        if (!(a instanceof ne.Name))
          throw new Error("ajv implementation error");
        const _ = Array.isArray(n) ? n : [n];
        return (0, ne._)`${(0, Rn.checkDataTypes)(_, a, c.opts.strictNumbers, Rn.DataType.Wrong)}`;
      }
      return ne.nil;
    }
    function b() {
      if (s.validateSchema) {
        const _ = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, ne._)`!${_}(${a})`;
      }
      return ne.nil;
    }
  }
  subschema(t, a) {
    const n = (0, mo.getSubschema)(this.it, t);
    (0, mo.extendSubschemaData)(n, this.it, t), (0, mo.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Lg(s, a), s;
  }
  mergeEvaluated(t, a) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = br.mergeEvaluated.props(s, t.props, n.props, a)), n.items !== !0 && t.items !== void 0 && (n.items = br.mergeEvaluated.items(s, t.items, n.items, a)));
  }
  mergeValidEvaluated(t, a) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(a, () => this.mergeEvaluated(t, ne.Name)), !0;
  }
}
tr.KeywordCxt = iu;
function cu(e, t, a, n) {
  const s = new iu(e, a, t);
  "code" in a ? a.code(s, n) : s.$data && a.validate ? (0, Da.funcKeywordCode)(s, a) : "macro" in a ? (0, Da.macroKeywordCode)(s, a) : (a.compile || a.validate) && (0, Da.funcKeywordCode)(s, a);
}
const Kg = /^\/(?:[^~]|~0|~1)*$/, Wg = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function lu(e, { dataLevel: t, dataNames: a, dataPathArr: n }) {
  let s, c;
  if (e === "")
    return ue.default.rootData;
  if (e[0] === "/") {
    if (!Kg.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, c = ue.default.rootData;
  } else {
    const y = Wg.exec(e);
    if (!y)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const g = +y[1];
    if (s = y[2], s === "#") {
      if (g >= t)
        throw new Error(_("property/index", g));
      return n[t - g];
    }
    if (g > t)
      throw new Error(_("data", g));
    if (c = a[t - g], !s)
      return c;
  }
  let p = c;
  const b = s.split("/");
  for (const y of b)
    y && (c = (0, ne._)`${c}${(0, ne.getProperty)((0, br.unescapeJsonPointer)(y))}`, p = (0, ne._)`${p} && ${c}`);
  return p;
  function _(y, g) {
    return `Cannot access ${y} ${g} levels up, current level is ${t}`;
  }
}
tr.getData = lu;
var en = {};
Object.defineProperty(en, "__esModule", { value: !0 });
class Jg extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
en.default = Jg;
var tn = {};
Object.defineProperty(tn, "__esModule", { value: !0 });
const go = rt;
class Zg extends Error {
  constructor(t, a, n, s) {
    super(s || `can't resolve reference ${n} from id ${a}`), this.missingRef = (0, go.resolveUrl)(t, a, n), this.missingSchema = (0, go.normalizeId)((0, go.getFullPath)(t, this.missingRef));
  }
}
tn.default = Zg;
var vt = {};
Object.defineProperty(vt, "__esModule", { value: !0 });
vt.resolveSchema = vt.getCompilingSchema = vt.resolveRef = vt.compileSchema = vt.SchemaEnv = void 0;
const Ht = ve, Yg = en, Rr = lr, Xt = rt, cc = ke, Qg = tr;
class Kn {
  constructor(t) {
    var a;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (a = t.baseId) !== null && a !== void 0 ? a : (0, Xt.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
vt.SchemaEnv = Kn;
function Ls(e) {
  const t = uu.call(this, e);
  if (t)
    return t;
  const a = (0, Xt.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: c } = this.opts, p = new Ht.CodeGen(this.scope, { es5: n, lines: s, ownProperties: c });
  let b;
  e.$async && (b = p.scopeValue("Error", {
    ref: Yg.default,
    code: (0, Ht._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const _ = p.scopeName("validate");
  e.validateName = _;
  const y = {
    gen: p,
    allErrors: this.opts.allErrors,
    data: Rr.default.data,
    parentData: Rr.default.parentData,
    parentDataProperty: Rr.default.parentDataProperty,
    dataNames: [Rr.default.data],
    dataPathArr: [Ht.nil],
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: p.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ht.stringify)(e.schema) } : { ref: e.schema }),
    validateName: _,
    ValidationError: b,
    schema: e.schema,
    schemaEnv: e,
    rootId: a,
    baseId: e.baseId || a,
    schemaPath: Ht.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Ht._)`""`,
    opts: this.opts,
    self: this
  };
  let g;
  try {
    this._compilations.add(e), (0, Qg.validateFunctionCode)(y), p.optimize(this.opts.code.optimize);
    const S = p.toString();
    g = `${p.scopeRefs(Rr.default.scope)}return ${S}`, this.opts.code.process && (g = this.opts.code.process(g, e));
    const L = new Function(`${Rr.default.self}`, `${Rr.default.scope}`, g)(this, this.scope.get());
    if (this.scope.value(_, { ref: L }), L.errors = null, L.schema = e.schema, L.schemaEnv = e, e.$async && (L.$async = !0), this.opts.code.source === !0 && (L.source = { validateName: _, validateCode: S, scopeValues: p._values }), this.opts.unevaluated) {
      const { props: A, items: N } = y;
      L.evaluated = {
        props: A instanceof Ht.Name ? void 0 : A,
        items: N instanceof Ht.Name ? void 0 : N,
        dynamicProps: A instanceof Ht.Name,
        dynamicItems: N instanceof Ht.Name
      }, L.source && (L.source.evaluated = (0, Ht.stringify)(L.evaluated));
    }
    return e.validate = L, e;
  } catch (S) {
    throw delete e.validate, delete e.validateName, g && this.logger.error("Error compiling schema, function code:", g), S;
  } finally {
    this._compilations.delete(e);
  }
}
vt.compileSchema = Ls;
function Xg(e, t, a) {
  var n;
  a = (0, Xt.resolveUrl)(this.opts.uriResolver, t, a);
  const s = e.refs[a];
  if (s)
    return s;
  let c = ry.call(this, e, a);
  if (c === void 0) {
    const p = (n = e.localRefs) === null || n === void 0 ? void 0 : n[a], { schemaId: b } = this.opts;
    p && (c = new Kn({ schema: p, schemaId: b, root: e, baseId: t }));
  }
  if (c !== void 0)
    return e.refs[a] = ey.call(this, c);
}
vt.resolveRef = Xg;
function ey(e) {
  return (0, Xt.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Ls.call(this, e);
}
function uu(e) {
  for (const t of this._compilations)
    if (ty(t, e))
      return t;
}
vt.getCompilingSchema = uu;
function ty(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function ry(e, t) {
  let a;
  for (; typeof (a = this.refs[t]) == "string"; )
    t = a;
  return a || this.schemas[t] || Wn.call(this, e, t);
}
function Wn(e, t) {
  const a = this.opts.uriResolver.parse(t), n = (0, Xt._getFullPath)(this.opts.uriResolver, a);
  let s = (0, Xt.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return yo.call(this, a, e);
  const c = (0, Xt.normalizeId)(n), p = this.refs[c] || this.schemas[c];
  if (typeof p == "string") {
    const b = Wn.call(this, e, p);
    return typeof (b == null ? void 0 : b.schema) != "object" ? void 0 : yo.call(this, a, b);
  }
  if (typeof (p == null ? void 0 : p.schema) == "object") {
    if (p.validate || Ls.call(this, p), c === (0, Xt.normalizeId)(t)) {
      const { schema: b } = p, { schemaId: _ } = this.opts, y = b[_];
      return y && (s = (0, Xt.resolveUrl)(this.opts.uriResolver, s, y)), new Kn({ schema: b, schemaId: _, root: e, baseId: s });
    }
    return yo.call(this, a, p);
  }
}
vt.resolveSchema = Wn;
const ay = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function yo(e, { baseId: t, schema: a, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const b of e.fragment.slice(1).split("/")) {
    if (typeof a == "boolean")
      return;
    const _ = a[(0, cc.unescapeFragment)(b)];
    if (_ === void 0)
      return;
    a = _;
    const y = typeof a == "object" && a[this.opts.schemaId];
    !ay.has(b) && y && (t = (0, Xt.resolveUrl)(this.opts.uriResolver, t, y));
  }
  let c;
  if (typeof a != "boolean" && a.$ref && !(0, cc.schemaHasRulesButRef)(a, this.RULES)) {
    const b = (0, Xt.resolveUrl)(this.opts.uriResolver, t, a.$ref);
    c = Wn.call(this, n, b);
  }
  const { schemaId: p } = this.opts;
  if (c = c || new Kn({ schema: a, schemaId: p, root: n, baseId: t }), c.schema !== c.root.schema)
    return c;
}
const ny = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", oy = "Meta-schema for $data reference (JSON AnySchema extension proposal)", sy = "object", iy = [
  "$data"
], cy = {
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
}, ly = !1, uy = {
  $id: ny,
  description: oy,
  type: sy,
  required: iy,
  properties: cy,
  additionalProperties: ly
};
var Rs = {}, Lo = { exports: {} };
/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
(function(e, t) {
  (function(a, n) {
    n(t);
  })(Dl, function(a) {
    function n() {
      for (var h = arguments.length, $ = Array(h), P = 0; P < h; P++)
        $[P] = arguments[P];
      if ($.length > 1) {
        $[0] = $[0].slice(0, -1);
        for (var M = $.length - 1, D = 1; D < M; ++D)
          $[D] = $[D].slice(1, -1);
        return $[M] = $[M].slice(1), $.join("");
      } else
        return $[0];
    }
    function s(h) {
      return "(?:" + h + ")";
    }
    function c(h) {
      return h === void 0 ? "undefined" : h === null ? "null" : Object.prototype.toString.call(h).split(" ").pop().split("]").shift().toLowerCase();
    }
    function p(h) {
      return h.toUpperCase();
    }
    function b(h) {
      return h != null ? h instanceof Array ? h : typeof h.length != "number" || h.split || h.setInterval || h.call ? [h] : Array.prototype.slice.call(h) : [];
    }
    function _(h, $) {
      var P = h;
      if ($)
        for (var M in $)
          P[M] = $[M];
      return P;
    }
    function y(h) {
      var $ = "[A-Za-z]", P = "[0-9]", M = n(P, "[A-Fa-f]"), D = s(s("%[EFef]" + M + "%" + M + M + "%" + M + M) + "|" + s("%[89A-Fa-f]" + M + "%" + M + M) + "|" + s("%" + M + M)), Y = "[\\:\\/\\?\\#\\[\\]\\@]", Z = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", re = n(Y, Z), he = h ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]", oe = h ? "[\\uE000-\\uF8FF]" : "[]", te = n($, P, "[\\-\\.\\_\\~]", he);
      s($ + n($, P, "[\\+\\-\\.]") + "*"), s(s(D + "|" + n(te, Z, "[\\:]")) + "*");
      var ce = s(s("25[0-5]") + "|" + s("2[0-4]" + P) + "|" + s("1" + P + P) + "|" + s("0?[1-9]" + P) + "|0?0?" + P), de = s(ce + "\\." + ce + "\\." + ce + "\\." + ce), Q = s(M + "{1,4}"), pe = s(s(Q + "\\:" + Q) + "|" + de), se = s(s(Q + "\\:") + "{6}" + pe), Re = s("\\:\\:" + s(Q + "\\:") + "{5}" + pe), xt = s(s(Q) + "?\\:\\:" + s(Q + "\\:") + "{4}" + pe), De = s(s(s(Q + "\\:") + "{0,1}" + Q) + "?\\:\\:" + s(Q + "\\:") + "{3}" + pe), He = s(s(s(Q + "\\:") + "{0,2}" + Q) + "?\\:\\:" + s(Q + "\\:") + "{2}" + pe), it = s(s(s(Q + "\\:") + "{0,3}" + Q) + "?\\:\\:" + Q + "\\:" + pe), ct = s(s(s(Q + "\\:") + "{0,4}" + Q) + "?\\:\\:" + pe), Ie = s(s(s(Q + "\\:") + "{0,5}" + Q) + "?\\:\\:" + Q), Ge = s(s(s(Q + "\\:") + "{0,6}" + Q) + "?\\:\\:"), lt = s([se, Re, xt, De, He, it, ct, Ie, Ge].join("|")), Ve = s(s(te + "|" + D) + "+");
      s("[vV]" + M + "+\\." + n(te, Z, "[\\:]") + "+"), s(s(D + "|" + n(te, Z)) + "*");
      var dr = s(D + "|" + n(te, Z, "[\\:\\@]"));
      return s(s(D + "|" + n(te, Z, "[\\@]")) + "+"), s(s(dr + "|" + n("[\\/\\?]", oe)) + "*"), {
        NOT_SCHEME: new RegExp(n("[^]", $, P, "[\\+\\-\\.]"), "g"),
        NOT_USERINFO: new RegExp(n("[^\\%\\:]", te, Z), "g"),
        NOT_HOST: new RegExp(n("[^\\%\\[\\]\\:]", te, Z), "g"),
        NOT_PATH: new RegExp(n("[^\\%\\/\\:\\@]", te, Z), "g"),
        NOT_PATH_NOSCHEME: new RegExp(n("[^\\%\\/\\@]", te, Z), "g"),
        NOT_QUERY: new RegExp(n("[^\\%]", te, Z, "[\\:\\@\\/\\?]", oe), "g"),
        NOT_FRAGMENT: new RegExp(n("[^\\%]", te, Z, "[\\:\\@\\/\\?]"), "g"),
        ESCAPE: new RegExp(n("[^]", te, Z), "g"),
        UNRESERVED: new RegExp(te, "g"),
        OTHER_CHARS: new RegExp(n("[^\\%]", te, re), "g"),
        PCT_ENCODED: new RegExp(D, "g"),
        IPV4ADDRESS: new RegExp("^(" + de + ")$"),
        IPV6ADDRESS: new RegExp("^\\[?(" + lt + ")" + s(s("\\%25|\\%(?!" + M + "{2})") + "(" + Ve + ")") + "?\\]?$")
        //RFC 6874, with relaxed parsing rules
      };
    }
    var g = y(!1), S = y(!0), L = function() {
      function h($, P) {
        var M = [], D = !0, Y = !1, Z = void 0;
        try {
          for (var re = $[Symbol.iterator](), he; !(D = (he = re.next()).done) && (M.push(he.value), !(P && M.length === P)); D = !0)
            ;
        } catch (oe) {
          Y = !0, Z = oe;
        } finally {
          try {
            !D && re.return && re.return();
          } finally {
            if (Y)
              throw Z;
          }
        }
        return M;
      }
      return function($, P) {
        if (Array.isArray($))
          return $;
        if (Symbol.iterator in Object($))
          return h($, P);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      };
    }(), A = function(h) {
      if (Array.isArray(h)) {
        for (var $ = 0, P = Array(h.length); $ < h.length; $++)
          P[$] = h[$];
        return P;
      } else
        return Array.from(h);
    }, N = 2147483647, C = 36, T = 1, v = 26, j = 38, I = 700, r = 72, i = 128, o = "-", l = /^xn--/, u = /[^\0-\x7E]/, m = /[\x2E\u3002\uFF0E\uFF61]/g, f = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    }, x = C - T, B = Math.floor, U = String.fromCharCode;
    function z(h) {
      throw new RangeError(f[h]);
    }
    function H(h, $) {
      for (var P = [], M = h.length; M--; )
        P[M] = $(h[M]);
      return P;
    }
    function w(h, $) {
      var P = h.split("@"), M = "";
      P.length > 1 && (M = P[0] + "@", h = P[1]), h = h.replace(m, ".");
      var D = h.split("."), Y = H(D, $).join(".");
      return M + Y;
    }
    function q(h) {
      for (var $ = [], P = 0, M = h.length; P < M; ) {
        var D = h.charCodeAt(P++);
        if (D >= 55296 && D <= 56319 && P < M) {
          var Y = h.charCodeAt(P++);
          (Y & 64512) == 56320 ? $.push(((D & 1023) << 10) + (Y & 1023) + 65536) : ($.push(D), P--);
        } else
          $.push(D);
      }
      return $;
    }
    var W = function(h) {
      return String.fromCodePoint.apply(String, A(h));
    }, J = function(h) {
      return h - 48 < 10 ? h - 22 : h - 65 < 26 ? h - 65 : h - 97 < 26 ? h - 97 : C;
    }, V = function(h, $) {
      return h + 22 + 75 * (h < 26) - (($ != 0) << 5);
    }, E = function(h, $, P) {
      var M = 0;
      for (
        h = P ? B(h / I) : h >> 1, h += B(h / $);
        /* no initialization */
        h > x * v >> 1;
        M += C
      )
        h = B(h / x);
      return B(M + (x + 1) * h / (h + j));
    }, F = function(h) {
      var $ = [], P = h.length, M = 0, D = i, Y = r, Z = h.lastIndexOf(o);
      Z < 0 && (Z = 0);
      for (var re = 0; re < Z; ++re)
        h.charCodeAt(re) >= 128 && z("not-basic"), $.push(h.charCodeAt(re));
      for (var he = Z > 0 ? Z + 1 : 0; he < P; ) {
        for (
          var oe = M, te = 1, ce = C;
          ;
          /* no condition */
          ce += C
        ) {
          he >= P && z("invalid-input");
          var de = J(h.charCodeAt(he++));
          (de >= C || de > B((N - M) / te)) && z("overflow"), M += de * te;
          var Q = ce <= Y ? T : ce >= Y + v ? v : ce - Y;
          if (de < Q)
            break;
          var pe = C - Q;
          te > B(N / pe) && z("overflow"), te *= pe;
        }
        var se = $.length + 1;
        Y = E(M - oe, se, oe == 0), B(M / se) > N - D && z("overflow"), D += B(M / se), M %= se, $.splice(M++, 0, D);
      }
      return String.fromCodePoint.apply(String, $);
    }, O = function(h) {
      var $ = [];
      h = q(h);
      var P = h.length, M = i, D = 0, Y = r, Z = !0, re = !1, he = void 0;
      try {
        for (var oe = h[Symbol.iterator](), te; !(Z = (te = oe.next()).done); Z = !0) {
          var ce = te.value;
          ce < 128 && $.push(U(ce));
        }
      } catch (Ut) {
        re = !0, he = Ut;
      } finally {
        try {
          !Z && oe.return && oe.return();
        } finally {
          if (re)
            throw he;
        }
      }
      var de = $.length, Q = de;
      for (de && $.push(o); Q < P; ) {
        var pe = N, se = !0, Re = !1, xt = void 0;
        try {
          for (var De = h[Symbol.iterator](), He; !(se = (He = De.next()).done); se = !0) {
            var it = He.value;
            it >= M && it < pe && (pe = it);
          }
        } catch (Ut) {
          Re = !0, xt = Ut;
        } finally {
          try {
            !se && De.return && De.return();
          } finally {
            if (Re)
              throw xt;
          }
        }
        var ct = Q + 1;
        pe - M > B((N - D) / ct) && z("overflow"), D += (pe - M) * ct, M = pe;
        var Ie = !0, Ge = !1, lt = void 0;
        try {
          for (var Ve = h[Symbol.iterator](), dr; !(Ie = (dr = Ve.next()).done); Ie = !0) {
            var $a = dr.value;
            if ($a < M && ++D > N && z("overflow"), $a == M) {
              for (
                var hr = D, pr = C;
                ;
                /* no condition */
                pr += C
              ) {
                var fr = pr <= Y ? T : pr >= Y + v ? v : pr - Y;
                if (hr < fr)
                  break;
                var ka = hr - fr, Ea = C - fr;
                $.push(U(V(fr + ka % Ea, 0))), hr = B(ka / Ea);
              }
              $.push(U(V(hr, 0))), Y = E(D, ct, Q == de), D = 0, ++Q;
            }
          }
        } catch (Ut) {
          Ge = !0, lt = Ut;
        } finally {
          try {
            !Ie && Ve.return && Ve.return();
          } finally {
            if (Ge)
              throw lt;
          }
        }
        ++D, ++M;
      }
      return $.join("");
    }, d = function(h) {
      return w(h, function($) {
        return l.test($) ? F($.slice(4).toLowerCase()) : $;
      });
    }, k = function(h) {
      return w(h, function($) {
        return u.test($) ? "xn--" + O($) : $;
      });
    }, R = {
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
        decode: q,
        encode: W
      },
      decode: F,
      encode: O,
      toASCII: k,
      toUnicode: d
    }, G = {};
    function K(h) {
      var $ = h.charCodeAt(0), P = void 0;
      return $ < 16 ? P = "%0" + $.toString(16).toUpperCase() : $ < 128 ? P = "%" + $.toString(16).toUpperCase() : $ < 2048 ? P = "%" + ($ >> 6 | 192).toString(16).toUpperCase() + "%" + ($ & 63 | 128).toString(16).toUpperCase() : P = "%" + ($ >> 12 | 224).toString(16).toUpperCase() + "%" + ($ >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + ($ & 63 | 128).toString(16).toUpperCase(), P;
    }
    function X(h) {
      for (var $ = "", P = 0, M = h.length; P < M; ) {
        var D = parseInt(h.substr(P + 1, 2), 16);
        if (D < 128)
          $ += String.fromCharCode(D), P += 3;
        else if (D >= 194 && D < 224) {
          if (M - P >= 6) {
            var Y = parseInt(h.substr(P + 4, 2), 16);
            $ += String.fromCharCode((D & 31) << 6 | Y & 63);
          } else
            $ += h.substr(P, 6);
          P += 6;
        } else if (D >= 224) {
          if (M - P >= 9) {
            var Z = parseInt(h.substr(P + 4, 2), 16), re = parseInt(h.substr(P + 7, 2), 16);
            $ += String.fromCharCode((D & 15) << 12 | (Z & 63) << 6 | re & 63);
          } else
            $ += h.substr(P, 9);
          P += 9;
        } else
          $ += h.substr(P, 3), P += 3;
      }
      return $;
    }
    function ee(h, $) {
      function P(M) {
        var D = X(M);
        return D.match($.UNRESERVED) ? D : M;
      }
      return h.scheme && (h.scheme = String(h.scheme).replace($.PCT_ENCODED, P).toLowerCase().replace($.NOT_SCHEME, "")), h.userinfo !== void 0 && (h.userinfo = String(h.userinfo).replace($.PCT_ENCODED, P).replace($.NOT_USERINFO, K).replace($.PCT_ENCODED, p)), h.host !== void 0 && (h.host = String(h.host).replace($.PCT_ENCODED, P).toLowerCase().replace($.NOT_HOST, K).replace($.PCT_ENCODED, p)), h.path !== void 0 && (h.path = String(h.path).replace($.PCT_ENCODED, P).replace(h.scheme ? $.NOT_PATH : $.NOT_PATH_NOSCHEME, K).replace($.PCT_ENCODED, p)), h.query !== void 0 && (h.query = String(h.query).replace($.PCT_ENCODED, P).replace($.NOT_QUERY, K).replace($.PCT_ENCODED, p)), h.fragment !== void 0 && (h.fragment = String(h.fragment).replace($.PCT_ENCODED, P).replace($.NOT_FRAGMENT, K).replace($.PCT_ENCODED, p)), h;
    }
    function ie(h) {
      return h.replace(/^0*(.*)/, "$1") || "0";
    }
    function xe(h, $) {
      var P = h.match($.IPV4ADDRESS) || [], M = L(P, 2), D = M[1];
      return D ? D.split(".").map(ie).join(".") : h;
    }
    function qe(h, $) {
      var P = h.match($.IPV6ADDRESS) || [], M = L(P, 3), D = M[1], Y = M[2];
      if (D) {
        for (var Z = D.toLowerCase().split("::").reverse(), re = L(Z, 2), he = re[0], oe = re[1], te = oe ? oe.split(":").map(ie) : [], ce = he.split(":").map(ie), de = $.IPV4ADDRESS.test(ce[ce.length - 1]), Q = de ? 7 : 8, pe = ce.length - Q, se = Array(Q), Re = 0; Re < Q; ++Re)
          se[Re] = te[Re] || ce[pe + Re] || "";
        de && (se[Q - 1] = xe(se[Q - 1], $));
        var xt = se.reduce(function(Ie, Ge, lt) {
          if (!Ge || Ge === "0") {
            var Ve = Ie[Ie.length - 1];
            Ve && Ve.index + Ve.length === lt ? Ve.length++ : Ie.push({ index: lt, length: 1 });
          }
          return Ie;
        }, []), De = xt.sort(function(Ie, Ge) {
          return Ge.length - Ie.length;
        })[0], He = void 0;
        if (De && De.length > 1) {
          var it = se.slice(0, De.index), ct = se.slice(De.index + De.length);
          He = it.join(":") + "::" + ct.join(":");
        } else
          He = se.join(":");
        return Y && (He += "%" + Y), He;
      } else
        return h;
    }
    var At = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i, Mt = "".match(/(){0}/)[1] === void 0;
    function je(h) {
      var $ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, P = {}, M = $.iri !== !1 ? S : g;
      $.reference === "suffix" && (h = ($.scheme ? $.scheme + ":" : "") + "//" + h);
      var D = h.match(At);
      if (D) {
        Mt ? (P.scheme = D[1], P.userinfo = D[3], P.host = D[4], P.port = parseInt(D[5], 10), P.path = D[6] || "", P.query = D[7], P.fragment = D[8], isNaN(P.port) && (P.port = D[5])) : (P.scheme = D[1] || void 0, P.userinfo = h.indexOf("@") !== -1 ? D[3] : void 0, P.host = h.indexOf("//") !== -1 ? D[4] : void 0, P.port = parseInt(D[5], 10), P.path = D[6] || "", P.query = h.indexOf("?") !== -1 ? D[7] : void 0, P.fragment = h.indexOf("#") !== -1 ? D[8] : void 0, isNaN(P.port) && (P.port = h.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? D[4] : void 0)), P.host && (P.host = qe(xe(P.host, M), M)), P.scheme === void 0 && P.userinfo === void 0 && P.host === void 0 && P.port === void 0 && !P.path && P.query === void 0 ? P.reference = "same-document" : P.scheme === void 0 ? P.reference = "relative" : P.fragment === void 0 ? P.reference = "absolute" : P.reference = "uri", $.reference && $.reference !== "suffix" && $.reference !== P.reference && (P.error = P.error || "URI is not a " + $.reference + " reference.");
        var Y = G[($.scheme || P.scheme || "").toLowerCase()];
        if (!$.unicodeSupport && (!Y || !Y.unicodeSupport)) {
          if (P.host && ($.domainHost || Y && Y.domainHost))
            try {
              P.host = R.toASCII(P.host.replace(M.PCT_ENCODED, X).toLowerCase());
            } catch (Z) {
              P.error = P.error || "Host's domain name can not be converted to ASCII via punycode: " + Z;
            }
          ee(P, g);
        } else
          ee(P, M);
        Y && Y.parse && Y.parse(P, $);
      } else
        P.error = P.error || "URI can not be parsed.";
      return P;
    }
    function Dt(h, $) {
      var P = $.iri !== !1 ? S : g, M = [];
      return h.userinfo !== void 0 && (M.push(h.userinfo), M.push("@")), h.host !== void 0 && M.push(qe(xe(String(h.host), P), P).replace(P.IPV6ADDRESS, function(D, Y, Z) {
        return "[" + Y + (Z ? "%25" + Z : "") + "]";
      })), (typeof h.port == "number" || typeof h.port == "string") && (M.push(":"), M.push(String(h.port))), M.length ? M.join("") : void 0;
    }
    var $t = /^\.\.?\//, kt = /^\/\.(\/|$)/, Et = /^\/\.\.(\/|$)/, zt = /^\/?(?:.|\n)*?(?=\/|$)/;
    function ze(h) {
      for (var $ = []; h.length; )
        if (h.match($t))
          h = h.replace($t, "");
        else if (h.match(kt))
          h = h.replace(kt, "/");
        else if (h.match(Et))
          h = h.replace(Et, "/"), $.pop();
        else if (h === "." || h === "..")
          h = "";
        else {
          var P = h.match(zt);
          if (P) {
            var M = P[0];
            h = h.slice(M.length), $.push(M);
          } else
            throw new Error("Unexpected dot segment condition");
        }
      return $.join("");
    }
    function Te(h) {
      var $ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, P = $.iri ? S : g, M = [], D = G[($.scheme || h.scheme || "").toLowerCase()];
      if (D && D.serialize && D.serialize(h, $), h.host && !P.IPV6ADDRESS.test(h.host) && ($.domainHost || D && D.domainHost))
        try {
          h.host = $.iri ? R.toUnicode(h.host) : R.toASCII(h.host.replace(P.PCT_ENCODED, X).toLowerCase());
        } catch (re) {
          h.error = h.error || "Host's domain name can not be converted to " + ($.iri ? "Unicode" : "ASCII") + " via punycode: " + re;
        }
      ee(h, P), $.reference !== "suffix" && h.scheme && (M.push(h.scheme), M.push(":"));
      var Y = Dt(h, $);
      if (Y !== void 0 && ($.reference !== "suffix" && M.push("//"), M.push(Y), h.path && h.path.charAt(0) !== "/" && M.push("/")), h.path !== void 0) {
        var Z = h.path;
        !$.absolutePath && (!D || !D.absolutePath) && (Z = ze(Z)), Y === void 0 && (Z = Z.replace(/^\/\//, "/%2F")), M.push(Z);
      }
      return h.query !== void 0 && (M.push("?"), M.push(h.query)), h.fragment !== void 0 && (M.push("#"), M.push(h.fragment)), M.join("");
    }
    function Pt(h, $) {
      var P = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, M = arguments[3], D = {};
      return M || (h = je(Te(h, P), P), $ = je(Te($, P), P)), P = P || {}, !P.tolerant && $.scheme ? (D.scheme = $.scheme, D.userinfo = $.userinfo, D.host = $.host, D.port = $.port, D.path = ze($.path || ""), D.query = $.query) : ($.userinfo !== void 0 || $.host !== void 0 || $.port !== void 0 ? (D.userinfo = $.userinfo, D.host = $.host, D.port = $.port, D.path = ze($.path || ""), D.query = $.query) : ($.path ? ($.path.charAt(0) === "/" ? D.path = ze($.path) : ((h.userinfo !== void 0 || h.host !== void 0 || h.port !== void 0) && !h.path ? D.path = "/" + $.path : h.path ? D.path = h.path.slice(0, h.path.lastIndexOf("/") + 1) + $.path : D.path = $.path, D.path = ze(D.path)), D.query = $.query) : (D.path = h.path, $.query !== void 0 ? D.query = $.query : D.query = h.query), D.userinfo = h.userinfo, D.host = h.host, D.port = h.port), D.scheme = h.scheme), D.fragment = $.fragment, D;
    }
    function Bt(h, $, P) {
      var M = _({ scheme: "null" }, P);
      return Te(Pt(je(h, M), je($, M), M, !0), M);
    }
    function ot(h, $) {
      return typeof h == "string" ? h = Te(je(h, $), $) : c(h) === "object" && (h = je(Te(h, $), $)), h;
    }
    function Vt(h, $, P) {
      return typeof h == "string" ? h = Te(je(h, P), P) : c(h) === "object" && (h = Te(h, P)), typeof $ == "string" ? $ = Te(je($, P), P) : c($) === "object" && ($ = Te($, P)), h === $;
    }
    function ur(h, $) {
      return h && h.toString().replace(!$ || !$.iri ? g.ESCAPE : S.ESCAPE, K);
    }
    function Le(h, $) {
      return h && h.toString().replace(!$ || !$.iri ? g.PCT_ENCODED : S.PCT_ENCODED, X);
    }
    var st = {
      scheme: "http",
      domainHost: !0,
      parse: function(h, $) {
        return h.host || (h.error = h.error || "HTTP URIs must have a host."), h;
      },
      serialize: function(h, $) {
        var P = String(h.scheme).toLowerCase() === "https";
        return (h.port === (P ? 443 : 80) || h.port === "") && (h.port = void 0), h.path || (h.path = "/"), h;
      }
    }, fa = {
      scheme: "https",
      domainHost: st.domainHost,
      parse: st.parse,
      serialize: st.serialize
    };
    function ma(h) {
      return typeof h.secure == "boolean" ? h.secure : String(h.scheme).toLowerCase() === "wss";
    }
    var Ft = {
      scheme: "ws",
      domainHost: !0,
      parse: function(h, $) {
        var P = h;
        return P.secure = ma(P), P.resourceName = (P.path || "/") + (P.query ? "?" + P.query : ""), P.path = void 0, P.query = void 0, P;
      },
      serialize: function(h, $) {
        if ((h.port === (ma(h) ? 443 : 80) || h.port === "") && (h.port = void 0), typeof h.secure == "boolean" && (h.scheme = h.secure ? "wss" : "ws", h.secure = void 0), h.resourceName) {
          var P = h.resourceName.split("?"), M = L(P, 2), D = M[0], Y = M[1];
          h.path = D && D !== "/" ? D : void 0, h.query = Y, h.resourceName = void 0;
        }
        return h.fragment = void 0, h;
      }
    }, ga = {
      scheme: "wss",
      domainHost: Ft.domainHost,
      parse: Ft.parse,
      serialize: Ft.serialize
    }, Yn = {}, ya = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]", Be = "[0-9A-Fa-f]", Qn = s(s("%[EFef]" + Be + "%" + Be + Be + "%" + Be + Be) + "|" + s("%[89A-Fa-f]" + Be + "%" + Be + Be) + "|" + s("%" + Be + Be)), Xn = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", eo = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", to = n(eo, '[\\"\\\\]'), ro = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]", ao = new RegExp(ya, "g"), St = new RegExp(Qn, "g"), no = new RegExp(n("[^]", Xn, "[\\.]", '[\\"]', to), "g"), ba = new RegExp(n("[^]", ya, ro), "g"), oo = ba;
    function Cr(h) {
      var $ = X(h);
      return $.match(ao) ? $ : h;
    }
    var _a = {
      scheme: "mailto",
      parse: function(h, $) {
        var P = h, M = P.to = P.path ? P.path.split(",") : [];
        if (P.path = void 0, P.query) {
          for (var D = !1, Y = {}, Z = P.query.split("&"), re = 0, he = Z.length; re < he; ++re) {
            var oe = Z[re].split("=");
            switch (oe[0]) {
              case "to":
                for (var te = oe[1].split(","), ce = 0, de = te.length; ce < de; ++ce)
                  M.push(te[ce]);
                break;
              case "subject":
                P.subject = Le(oe[1], $);
                break;
              case "body":
                P.body = Le(oe[1], $);
                break;
              default:
                D = !0, Y[Le(oe[0], $)] = Le(oe[1], $);
                break;
            }
          }
          D && (P.headers = Y);
        }
        P.query = void 0;
        for (var Q = 0, pe = M.length; Q < pe; ++Q) {
          var se = M[Q].split("@");
          if (se[0] = Le(se[0]), $.unicodeSupport)
            se[1] = Le(se[1], $).toLowerCase();
          else
            try {
              se[1] = R.toASCII(Le(se[1], $).toLowerCase());
            } catch (Re) {
              P.error = P.error || "Email address's domain name can not be converted to ASCII via punycode: " + Re;
            }
          M[Q] = se.join("@");
        }
        return P;
      },
      serialize: function(h, $) {
        var P = h, M = b(h.to);
        if (M) {
          for (var D = 0, Y = M.length; D < Y; ++D) {
            var Z = String(M[D]), re = Z.lastIndexOf("@"), he = Z.slice(0, re).replace(St, Cr).replace(St, p).replace(no, K), oe = Z.slice(re + 1);
            try {
              oe = $.iri ? R.toUnicode(oe) : R.toASCII(Le(oe, $).toLowerCase());
            } catch (Q) {
              P.error = P.error || "Email address's domain name can not be converted to " + ($.iri ? "Unicode" : "ASCII") + " via punycode: " + Q;
            }
            M[D] = he + "@" + oe;
          }
          P.path = M.join(",");
        }
        var te = h.headers = h.headers || {};
        h.subject && (te.subject = h.subject), h.body && (te.body = h.body);
        var ce = [];
        for (var de in te)
          te[de] !== Yn[de] && ce.push(de.replace(St, Cr).replace(St, p).replace(ba, K) + "=" + te[de].replace(St, Cr).replace(St, p).replace(oo, K));
        return ce.length && (P.query = ce.join("&")), P;
      }
    }, so = /^([^\:]+)\:(.*)/, wa = {
      scheme: "urn",
      parse: function(h, $) {
        var P = h.path && h.path.match(so), M = h;
        if (P) {
          var D = $.scheme || M.scheme || "urn", Y = P[1].toLowerCase(), Z = P[2], re = D + ":" + ($.nid || Y), he = G[re];
          M.nid = Y, M.nss = Z, M.path = void 0, he && (M = he.parse(M, $));
        } else
          M.error = M.error || "URN can not be parsed.";
        return M;
      },
      serialize: function(h, $) {
        var P = $.scheme || h.scheme || "urn", M = h.nid, D = P + ":" + ($.nid || M), Y = G[D];
        Y && (h = Y.serialize(h, $));
        var Z = h, re = h.nss;
        return Z.path = (M || $.nid) + ":" + re, Z;
      }
    }, io = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/, va = {
      scheme: "urn:uuid",
      parse: function(h, $) {
        var P = h;
        return P.uuid = P.nss, P.nss = void 0, !$.tolerant && (!P.uuid || !P.uuid.match(io)) && (P.error = P.error || "UUID is not valid."), P;
      },
      serialize: function(h, $) {
        var P = h;
        return P.nss = (h.uuid || "").toLowerCase(), P;
      }
    };
    G[st.scheme] = st, G[fa.scheme] = fa, G[Ft.scheme] = Ft, G[ga.scheme] = ga, G[_a.scheme] = _a, G[wa.scheme] = wa, G[va.scheme] = va, a.SCHEMES = G, a.pctEncChar = K, a.pctDecChars = X, a.parse = je, a.removeDotSegments = ze, a.serialize = Te, a.resolveComponents = Pt, a.resolve = Bt, a.normalize = ot, a.equal = Vt, a.escapeComponent = ur, a.unescapeComponent = Le, Object.defineProperty(a, "__esModule", { value: !0 });
  });
})(Lo, Lo.exports);
var dy = Lo.exports;
Object.defineProperty(Rs, "__esModule", { value: !0 });
const du = dy;
du.code = 'require("ajv/dist/runtime/uri").default';
Rs.default = du;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = tr;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var a = ve;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return a._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return a.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return a.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return a.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return a.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return a.CodeGen;
  } });
  const n = en, s = tn, c = qr, p = vt, b = ve, _ = rt, y = Xa, g = ke, S = uy, L = Rs, A = (V, E) => new RegExp(V, E);
  A.code = "new RegExp";
  const N = ["removeAdditional", "useDefaults", "coerceTypes"], C = /* @__PURE__ */ new Set([
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
  }, v = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, j = 200;
  function I(V) {
    var E, F, O, d, k, R, G, K, X, ee, ie, xe, qe, At, Mt, je, Dt, $t, kt, Et, zt, ze, Te, Pt, Bt;
    const ot = V.strict, Vt = (E = V.code) === null || E === void 0 ? void 0 : E.optimize, ur = Vt === !0 || Vt === void 0 ? 1 : Vt || 0, Le = (O = (F = V.code) === null || F === void 0 ? void 0 : F.regExp) !== null && O !== void 0 ? O : A, st = (d = V.uriResolver) !== null && d !== void 0 ? d : L.default;
    return {
      strictSchema: (R = (k = V.strictSchema) !== null && k !== void 0 ? k : ot) !== null && R !== void 0 ? R : !0,
      strictNumbers: (K = (G = V.strictNumbers) !== null && G !== void 0 ? G : ot) !== null && K !== void 0 ? K : !0,
      strictTypes: (ee = (X = V.strictTypes) !== null && X !== void 0 ? X : ot) !== null && ee !== void 0 ? ee : "log",
      strictTuples: (xe = (ie = V.strictTuples) !== null && ie !== void 0 ? ie : ot) !== null && xe !== void 0 ? xe : "log",
      strictRequired: (At = (qe = V.strictRequired) !== null && qe !== void 0 ? qe : ot) !== null && At !== void 0 ? At : !1,
      code: V.code ? { ...V.code, optimize: ur, regExp: Le } : { optimize: ur, regExp: Le },
      loopRequired: (Mt = V.loopRequired) !== null && Mt !== void 0 ? Mt : j,
      loopEnum: (je = V.loopEnum) !== null && je !== void 0 ? je : j,
      meta: (Dt = V.meta) !== null && Dt !== void 0 ? Dt : !0,
      messages: ($t = V.messages) !== null && $t !== void 0 ? $t : !0,
      inlineRefs: (kt = V.inlineRefs) !== null && kt !== void 0 ? kt : !0,
      schemaId: (Et = V.schemaId) !== null && Et !== void 0 ? Et : "$id",
      addUsedSchema: (zt = V.addUsedSchema) !== null && zt !== void 0 ? zt : !0,
      validateSchema: (ze = V.validateSchema) !== null && ze !== void 0 ? ze : !0,
      validateFormats: (Te = V.validateFormats) !== null && Te !== void 0 ? Te : !0,
      unicodeRegExp: (Pt = V.unicodeRegExp) !== null && Pt !== void 0 ? Pt : !0,
      int32range: (Bt = V.int32range) !== null && Bt !== void 0 ? Bt : !0,
      uriResolver: st
    };
  }
  class r {
    constructor(E = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), E = this.opts = { ...E, ...I(E) };
      const { es5: F, lines: O } = this.opts.code;
      this.scope = new b.ValueScope({ scope: {}, prefixes: C, es5: F, lines: O }), this.logger = B(E.logger);
      const d = E.validateFormats;
      E.validateFormats = !1, this.RULES = (0, c.getRules)(), i.call(this, T, E, "NOT SUPPORTED"), i.call(this, v, E, "DEPRECATED", "warn"), this._metaOpts = f.call(this), E.formats && u.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), E.keywords && m.call(this, E.keywords), typeof E.meta == "object" && this.addMetaSchema(E.meta), l.call(this), E.validateFormats = d;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: E, meta: F, schemaId: O } = this.opts;
      let d = S;
      O === "id" && (d = { ...S }, d.id = d.$id, delete d.$id), F && E && this.addMetaSchema(d, d[O], !1);
    }
    defaultMeta() {
      const { meta: E, schemaId: F } = this.opts;
      return this.opts.defaultMeta = typeof E == "object" ? E[F] || E : void 0;
    }
    validate(E, F) {
      let O;
      if (typeof E == "string") {
        if (O = this.getSchema(E), !O)
          throw new Error(`no schema with key or ref "${E}"`);
      } else
        O = this.compile(E);
      const d = O(F);
      return "$async" in O || (this.errors = O.errors), d;
    }
    compile(E, F) {
      const O = this._addSchema(E, F);
      return O.validate || this._compileSchemaEnv(O);
    }
    compileAsync(E, F) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: O } = this.opts;
      return d.call(this, E, F);
      async function d(ee, ie) {
        await k.call(this, ee.$schema);
        const xe = this._addSchema(ee, ie);
        return xe.validate || R.call(this, xe);
      }
      async function k(ee) {
        ee && !this.getSchema(ee) && await d.call(this, { $ref: ee }, !0);
      }
      async function R(ee) {
        try {
          return this._compileSchemaEnv(ee);
        } catch (ie) {
          if (!(ie instanceof s.default))
            throw ie;
          return G.call(this, ie), await K.call(this, ie.missingSchema), R.call(this, ee);
        }
      }
      function G({ missingSchema: ee, missingRef: ie }) {
        if (this.refs[ee])
          throw new Error(`AnySchema ${ee} is loaded but ${ie} cannot be resolved`);
      }
      async function K(ee) {
        const ie = await X.call(this, ee);
        this.refs[ee] || await k.call(this, ie.$schema), this.refs[ee] || this.addSchema(ie, ee, F);
      }
      async function X(ee) {
        const ie = this._loading[ee];
        if (ie)
          return ie;
        try {
          return await (this._loading[ee] = O(ee));
        } finally {
          delete this._loading[ee];
        }
      }
    }
    // Adds schema to the instance
    addSchema(E, F, O, d = this.opts.validateSchema) {
      if (Array.isArray(E)) {
        for (const R of E)
          this.addSchema(R, void 0, O, d);
        return this;
      }
      let k;
      if (typeof E == "object") {
        const { schemaId: R } = this.opts;
        if (k = E[R], k !== void 0 && typeof k != "string")
          throw new Error(`schema ${R} must be string`);
      }
      return F = (0, _.normalizeId)(F || k), this._checkUnique(F), this.schemas[F] = this._addSchema(E, O, F, d, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(E, F, O = this.opts.validateSchema) {
      return this.addSchema(E, F, !0, O), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(E, F) {
      if (typeof E == "boolean")
        return !0;
      let O;
      if (O = E.$schema, O !== void 0 && typeof O != "string")
        throw new Error("$schema must be a string");
      if (O = O || this.opts.defaultMeta || this.defaultMeta(), !O)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const d = this.validate(O, E);
      if (!d && F) {
        const k = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(k);
        else
          throw new Error(k);
      }
      return d;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(E) {
      let F;
      for (; typeof (F = o.call(this, E)) == "string"; )
        E = F;
      if (F === void 0) {
        const { schemaId: O } = this.opts, d = new p.SchemaEnv({ schema: {}, schemaId: O });
        if (F = p.resolveSchema.call(this, d, E), !F)
          return;
        this.refs[E] = F;
      }
      return F.validate || this._compileSchemaEnv(F);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(E) {
      if (E instanceof RegExp)
        return this._removeAllSchemas(this.schemas, E), this._removeAllSchemas(this.refs, E), this;
      switch (typeof E) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const F = o.call(this, E);
          return typeof F == "object" && this._cache.delete(F.schema), delete this.schemas[E], delete this.refs[E], this;
        }
        case "object": {
          const F = E;
          this._cache.delete(F);
          let O = E[this.opts.schemaId];
          return O && (O = (0, _.normalizeId)(O), delete this.schemas[O], delete this.refs[O]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(E) {
      for (const F of E)
        this.addKeyword(F);
      return this;
    }
    addKeyword(E, F) {
      let O;
      if (typeof E == "string")
        O = E, typeof F == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), F.keyword = O);
      else if (typeof E == "object" && F === void 0) {
        if (F = E, O = F.keyword, Array.isArray(O) && !O.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (z.call(this, O, F), !F)
        return (0, g.eachItem)(O, (k) => H.call(this, k)), this;
      q.call(this, F);
      const d = {
        ...F,
        type: (0, y.getJSONTypes)(F.type),
        schemaType: (0, y.getJSONTypes)(F.schemaType)
      };
      return (0, g.eachItem)(O, d.type.length === 0 ? (k) => H.call(this, k, d) : (k) => d.type.forEach((R) => H.call(this, k, d, R))), this;
    }
    getKeyword(E) {
      const F = this.RULES.all[E];
      return typeof F == "object" ? F.definition : !!F;
    }
    // Remove keyword
    removeKeyword(E) {
      const { RULES: F } = this;
      delete F.keywords[E], delete F.all[E];
      for (const O of F.rules) {
        const d = O.rules.findIndex((k) => k.keyword === E);
        d >= 0 && O.rules.splice(d, 1);
      }
      return this;
    }
    // Add format
    addFormat(E, F) {
      return typeof F == "string" && (F = new RegExp(F)), this.formats[E] = F, this;
    }
    errorsText(E = this.errors, { separator: F = ", ", dataVar: O = "data" } = {}) {
      return !E || E.length === 0 ? "No errors" : E.map((d) => `${O}${d.instancePath} ${d.message}`).reduce((d, k) => d + F + k);
    }
    $dataMetaSchema(E, F) {
      const O = this.RULES.all;
      E = JSON.parse(JSON.stringify(E));
      for (const d of F) {
        const k = d.split("/").slice(1);
        let R = E;
        for (const G of k)
          R = R[G];
        for (const G in O) {
          const K = O[G];
          if (typeof K != "object")
            continue;
          const { $data: X } = K.definition, ee = R[G];
          X && ee && (R[G] = J(ee));
        }
      }
      return E;
    }
    _removeAllSchemas(E, F) {
      for (const O in E) {
        const d = E[O];
        (!F || F.test(O)) && (typeof d == "string" ? delete E[O] : d && !d.meta && (this._cache.delete(d.schema), delete E[O]));
      }
    }
    _addSchema(E, F, O, d = this.opts.validateSchema, k = this.opts.addUsedSchema) {
      let R;
      const { schemaId: G } = this.opts;
      if (typeof E == "object")
        R = E[G];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof E != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let K = this._cache.get(E);
      if (K !== void 0)
        return K;
      O = (0, _.normalizeId)(R || O);
      const X = _.getSchemaRefs.call(this, E, O);
      return K = new p.SchemaEnv({ schema: E, schemaId: G, meta: F, baseId: O, localRefs: X }), this._cache.set(K.schema, K), k && !O.startsWith("#") && (O && this._checkUnique(O), this.refs[O] = K), d && this.validateSchema(E, !0), K;
    }
    _checkUnique(E) {
      if (this.schemas[E] || this.refs[E])
        throw new Error(`schema with key or id "${E}" already exists`);
    }
    _compileSchemaEnv(E) {
      if (E.meta ? this._compileMetaSchema(E) : p.compileSchema.call(this, E), !E.validate)
        throw new Error("ajv implementation error");
      return E.validate;
    }
    _compileMetaSchema(E) {
      const F = this.opts;
      this.opts = this._metaOpts;
      try {
        p.compileSchema.call(this, E);
      } finally {
        this.opts = F;
      }
    }
  }
  e.default = r, r.ValidationError = n.default, r.MissingRefError = s.default;
  function i(V, E, F, O = "error") {
    for (const d in V) {
      const k = d;
      k in E && this.logger[O](`${F}: option ${d}. ${V[k]}`);
    }
  }
  function o(V) {
    return V = (0, _.normalizeId)(V), this.schemas[V] || this.refs[V];
  }
  function l() {
    const V = this.opts.schemas;
    if (V)
      if (Array.isArray(V))
        this.addSchema(V);
      else
        for (const E in V)
          this.addSchema(V[E], E);
  }
  function u() {
    for (const V in this.opts.formats) {
      const E = this.opts.formats[V];
      E && this.addFormat(V, E);
    }
  }
  function m(V) {
    if (Array.isArray(V)) {
      this.addVocabulary(V);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const E in V) {
      const F = V[E];
      F.keyword || (F.keyword = E), this.addKeyword(F);
    }
  }
  function f() {
    const V = { ...this.opts };
    for (const E of N)
      delete V[E];
    return V;
  }
  const x = { log() {
  }, warn() {
  }, error() {
  } };
  function B(V) {
    if (V === !1)
      return x;
    if (V === void 0)
      return console;
    if (V.log && V.warn && V.error)
      return V;
    throw new Error("logger must implement log, warn and error methods");
  }
  const U = /^[a-z_$][a-z0-9_$:-]*$/i;
  function z(V, E) {
    const { RULES: F } = this;
    if ((0, g.eachItem)(V, (O) => {
      if (F.keywords[O])
        throw new Error(`Keyword ${O} is already defined`);
      if (!U.test(O))
        throw new Error(`Keyword ${O} has invalid name`);
    }), !!E && E.$data && !("code" in E || "validate" in E))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function H(V, E, F) {
    var O;
    const d = E == null ? void 0 : E.post;
    if (F && d)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: k } = this;
    let R = d ? k.post : k.rules.find(({ type: K }) => K === F);
    if (R || (R = { type: F, rules: [] }, k.rules.push(R)), k.keywords[V] = !0, !E)
      return;
    const G = {
      keyword: V,
      definition: {
        ...E,
        type: (0, y.getJSONTypes)(E.type),
        schemaType: (0, y.getJSONTypes)(E.schemaType)
      }
    };
    E.before ? w.call(this, R, G, E.before) : R.rules.push(G), k.all[V] = G, (O = E.implements) === null || O === void 0 || O.forEach((K) => this.addKeyword(K));
  }
  function w(V, E, F) {
    const O = V.rules.findIndex((d) => d.keyword === F);
    O >= 0 ? V.rules.splice(O, 0, E) : (V.rules.push(E), this.logger.warn(`rule ${F} is not defined`));
  }
  function q(V) {
    let { metaSchema: E } = V;
    E !== void 0 && (V.$data && this.opts.$data && (E = J(E)), V.validateSchema = this.compile(E, !0));
  }
  const W = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function J(V) {
    return { anyOf: [V, W] };
  }
})(Bl);
var Is = {}, As = {}, Ms = {};
Object.defineProperty(Ms, "__esModule", { value: !0 });
const hy = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Ms.default = hy;
var Hr = {};
Object.defineProperty(Hr, "__esModule", { value: !0 });
Hr.callRef = Hr.getValidate = void 0;
const py = tn, lc = _e, _t = ve, Jr = lr, uc = vt, dn = ke, fy = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: a, it: n } = e, { baseId: s, schemaEnv: c, validateName: p, opts: b, self: _ } = n, { root: y } = c;
    if ((a === "#" || a === "#/") && s === y.baseId)
      return S();
    const g = uc.resolveRef.call(_, y, s, a);
    if (g === void 0)
      throw new py.default(n.opts.uriResolver, s, a);
    if (g instanceof uc.SchemaEnv)
      return L(g);
    return A(g);
    function S() {
      if (c === y)
        return kn(e, p, c, c.$async);
      const N = t.scopeValue("root", { ref: y });
      return kn(e, (0, _t._)`${N}.validate`, y, y.$async);
    }
    function L(N) {
      const C = hu(e, N);
      kn(e, C, N, N.$async);
    }
    function A(N) {
      const C = t.scopeValue("schema", b.code.source === !0 ? { ref: N, code: (0, _t.stringify)(N) } : { ref: N }), T = t.name("valid"), v = e.subschema({
        schema: N,
        dataTypes: [],
        schemaPath: _t.nil,
        topSchemaRef: C,
        errSchemaPath: a
      }, T);
      e.mergeEvaluated(v), e.ok(T);
    }
  }
};
function hu(e, t) {
  const { gen: a } = e;
  return t.validate ? a.scopeValue("validate", { ref: t.validate }) : (0, _t._)`${a.scopeValue("wrapper", { ref: t })}.validate`;
}
Hr.getValidate = hu;
function kn(e, t, a, n) {
  const { gen: s, it: c } = e, { allErrors: p, schemaEnv: b, opts: _ } = c, y = _.passContext ? Jr.default.this : _t.nil;
  n ? g() : S();
  function g() {
    if (!b.$async)
      throw new Error("async schema referenced by sync schema");
    const N = s.let("valid");
    s.try(() => {
      s.code((0, _t._)`await ${(0, lc.callValidateCode)(e, t, y)}`), A(t), p || s.assign(N, !0);
    }, (C) => {
      s.if((0, _t._)`!(${C} instanceof ${c.ValidationError})`, () => s.throw(C)), L(C), p || s.assign(N, !1);
    }), e.ok(N);
  }
  function S() {
    e.result((0, lc.callValidateCode)(e, t, y), () => A(t), () => L(t));
  }
  function L(N) {
    const C = (0, _t._)`${N}.errors`;
    s.assign(Jr.default.vErrors, (0, _t._)`${Jr.default.vErrors} === null ? ${C} : ${Jr.default.vErrors}.concat(${C})`), s.assign(Jr.default.errors, (0, _t._)`${Jr.default.vErrors}.length`);
  }
  function A(N) {
    var C;
    if (!c.opts.unevaluated)
      return;
    const T = (C = a == null ? void 0 : a.validate) === null || C === void 0 ? void 0 : C.evaluated;
    if (c.props !== !0)
      if (T && !T.dynamicProps)
        T.props !== void 0 && (c.props = dn.mergeEvaluated.props(s, T.props, c.props));
      else {
        const v = s.var("props", (0, _t._)`${N}.evaluated.props`);
        c.props = dn.mergeEvaluated.props(s, v, c.props, _t.Name);
      }
    if (c.items !== !0)
      if (T && !T.dynamicItems)
        T.items !== void 0 && (c.items = dn.mergeEvaluated.items(s, T.items, c.items));
      else {
        const v = s.var("items", (0, _t._)`${N}.evaluated.items`);
        c.items = dn.mergeEvaluated.items(s, v, c.items, _t.Name);
      }
  }
}
Hr.callRef = kn;
Hr.default = fy;
Object.defineProperty(As, "__esModule", { value: !0 });
const my = Ms, gy = Hr, yy = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  my.default,
  gy.default
];
As.default = yy;
var Ds = {}, zs = {};
Object.defineProperty(zs, "__esModule", { value: !0 });
const In = ve, $r = In.operators, An = {
  maximum: { okStr: "<=", ok: $r.LTE, fail: $r.GT },
  minimum: { okStr: ">=", ok: $r.GTE, fail: $r.LT },
  exclusiveMaximum: { okStr: "<", ok: $r.LT, fail: $r.GTE },
  exclusiveMinimum: { okStr: ">", ok: $r.GT, fail: $r.LTE }
}, by = {
  message: ({ keyword: e, schemaCode: t }) => (0, In.str)`must be ${An[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, In._)`{comparison: ${An[e].okStr}, limit: ${t}}`
}, _y = {
  keyword: Object.keys(An),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: by,
  code(e) {
    const { keyword: t, data: a, schemaCode: n } = e;
    e.fail$data((0, In._)`${a} ${An[t].fail} ${n} || isNaN(${a})`);
  }
};
zs.default = _y;
var Bs = {};
Object.defineProperty(Bs, "__esModule", { value: !0 });
const za = ve, wy = {
  message: ({ schemaCode: e }) => (0, za.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, za._)`{multipleOf: ${e}}`
}, vy = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: wy,
  code(e) {
    const { gen: t, data: a, schemaCode: n, it: s } = e, c = s.opts.multipleOfPrecision, p = t.let("res"), b = c ? (0, za._)`Math.abs(Math.round(${p}) - ${p}) > 1e-${c}` : (0, za._)`${p} !== parseInt(${p})`;
    e.fail$data((0, za._)`(${n} === 0 || (${p} = ${a}/${n}, ${b}))`);
  }
};
Bs.default = vy;
var Vs = {}, Fs = {};
Object.defineProperty(Fs, "__esModule", { value: !0 });
function pu(e) {
  const t = e.length;
  let a = 0, n = 0, s;
  for (; n < t; )
    a++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return a;
}
Fs.default = pu;
pu.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Vs, "__esModule", { value: !0 });
const Br = ve, $y = ke, ky = Fs, Ey = {
  message({ keyword: e, schemaCode: t }) {
    const a = e === "maxLength" ? "more" : "fewer";
    return (0, Br.str)`must NOT have ${a} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Br._)`{limit: ${e}}`
}, Py = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Ey,
  code(e) {
    const { keyword: t, data: a, schemaCode: n, it: s } = e, c = t === "maxLength" ? Br.operators.GT : Br.operators.LT, p = s.opts.unicode === !1 ? (0, Br._)`${a}.length` : (0, Br._)`${(0, $y.useFunc)(e.gen, ky.default)}(${a})`;
    e.fail$data((0, Br._)`${p} ${c} ${n}`);
  }
};
Vs.default = Py;
var Us = {};
Object.defineProperty(Us, "__esModule", { value: !0 });
const Sy = _e, Mn = ve, xy = {
  message: ({ schemaCode: e }) => (0, Mn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Mn._)`{pattern: ${e}}`
}, Ty = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: xy,
  code(e) {
    const { data: t, $data: a, schema: n, schemaCode: s, it: c } = e, p = c.opts.unicodeRegExp ? "u" : "", b = a ? (0, Mn._)`(new RegExp(${s}, ${p}))` : (0, Sy.usePattern)(e, n);
    e.fail$data((0, Mn._)`!${b}.test(${t})`);
  }
};
Us.default = Ty;
var qs = {};
Object.defineProperty(qs, "__esModule", { value: !0 });
const Ba = ve, jy = {
  message({ keyword: e, schemaCode: t }) {
    const a = e === "maxProperties" ? "more" : "fewer";
    return (0, Ba.str)`must NOT have ${a} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Ba._)`{limit: ${e}}`
}, Cy = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: jy,
  code(e) {
    const { keyword: t, data: a, schemaCode: n } = e, s = t === "maxProperties" ? Ba.operators.GT : Ba.operators.LT;
    e.fail$data((0, Ba._)`Object.keys(${a}).length ${s} ${n}`);
  }
};
qs.default = Cy;
var Hs = {};
Object.defineProperty(Hs, "__esModule", { value: !0 });
const Ca = _e, Va = ve, Oy = ke, Ny = {
  message: ({ params: { missingProperty: e } }) => (0, Va.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Va._)`{missingProperty: ${e}}`
}, Ly = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Ny,
  code(e) {
    const { gen: t, schema: a, schemaCode: n, data: s, $data: c, it: p } = e, { opts: b } = p;
    if (!c && a.length === 0)
      return;
    const _ = a.length >= b.loopRequired;
    if (p.allErrors ? y() : g(), b.strictRequired) {
      const A = e.parentSchema.properties, { definedProperties: N } = e.it;
      for (const C of a)
        if ((A == null ? void 0 : A[C]) === void 0 && !N.has(C)) {
          const T = p.schemaEnv.baseId + p.errSchemaPath, v = `required property "${C}" is not defined at "${T}" (strictRequired)`;
          (0, Oy.checkStrictMode)(p, v, p.opts.strictRequired);
        }
    }
    function y() {
      if (_ || c)
        e.block$data(Va.nil, S);
      else
        for (const A of a)
          (0, Ca.checkReportMissingProp)(e, A);
    }
    function g() {
      const A = t.let("missing");
      if (_ || c) {
        const N = t.let("valid", !0);
        e.block$data(N, () => L(A, N)), e.ok(N);
      } else
        t.if((0, Ca.checkMissingProp)(e, a, A)), (0, Ca.reportMissingProp)(e, A), t.else();
    }
    function S() {
      t.forOf("prop", n, (A) => {
        e.setParams({ missingProperty: A }), t.if((0, Ca.noPropertyInData)(t, s, A, b.ownProperties), () => e.error());
      });
    }
    function L(A, N) {
      e.setParams({ missingProperty: A }), t.forOf(A, n, () => {
        t.assign(N, (0, Ca.propertyInData)(t, s, A, b.ownProperties)), t.if((0, Va.not)(N), () => {
          e.error(), t.break();
        });
      }, Va.nil);
    }
  }
};
Hs.default = Ly;
var Gs = {};
Object.defineProperty(Gs, "__esModule", { value: !0 });
const Fa = ve, Ry = {
  message({ keyword: e, schemaCode: t }) {
    const a = e === "maxItems" ? "more" : "fewer";
    return (0, Fa.str)`must NOT have ${a} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Fa._)`{limit: ${e}}`
}, Iy = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Ry,
  code(e) {
    const { keyword: t, data: a, schemaCode: n } = e, s = t === "maxItems" ? Fa.operators.GT : Fa.operators.LT;
    e.fail$data((0, Fa._)`${a}.length ${s} ${n}`);
  }
};
Gs.default = Iy;
var Ks = {}, rn = {};
Object.defineProperty(rn, "__esModule", { value: !0 });
const fu = Wl;
fu.code = 'require("ajv/dist/runtime/equal").default';
rn.default = fu;
Object.defineProperty(Ks, "__esModule", { value: !0 });
const bo = Xa, et = ve, Ay = ke, My = rn, Dy = {
  message: ({ params: { i: e, j: t } }) => (0, et.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, et._)`{i: ${e}, j: ${t}}`
}, zy = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Dy,
  code(e) {
    const { gen: t, data: a, $data: n, schema: s, parentSchema: c, schemaCode: p, it: b } = e;
    if (!n && !s)
      return;
    const _ = t.let("valid"), y = c.items ? (0, bo.getSchemaTypes)(c.items) : [];
    e.block$data(_, g, (0, et._)`${p} === false`), e.ok(_);
    function g() {
      const N = t.let("i", (0, et._)`${a}.length`), C = t.let("j");
      e.setParams({ i: N, j: C }), t.assign(_, !0), t.if((0, et._)`${N} > 1`, () => (S() ? L : A)(N, C));
    }
    function S() {
      return y.length > 0 && !y.some((N) => N === "object" || N === "array");
    }
    function L(N, C) {
      const T = t.name("item"), v = (0, bo.checkDataTypes)(y, T, b.opts.strictNumbers, bo.DataType.Wrong), j = t.const("indices", (0, et._)`{}`);
      t.for((0, et._)`;${N}--;`, () => {
        t.let(T, (0, et._)`${a}[${N}]`), t.if(v, (0, et._)`continue`), y.length > 1 && t.if((0, et._)`typeof ${T} == "string"`, (0, et._)`${T} += "_"`), t.if((0, et._)`typeof ${j}[${T}] == "number"`, () => {
          t.assign(C, (0, et._)`${j}[${T}]`), e.error(), t.assign(_, !1).break();
        }).code((0, et._)`${j}[${T}] = ${N}`);
      });
    }
    function A(N, C) {
      const T = (0, Ay.useFunc)(t, My.default), v = t.name("outer");
      t.label(v).for((0, et._)`;${N}--;`, () => t.for((0, et._)`${C} = ${N}; ${C}--;`, () => t.if((0, et._)`${T}(${a}[${N}], ${a}[${C}])`, () => {
        e.error(), t.assign(_, !1).break(v);
      })));
    }
  }
};
Ks.default = zy;
var Ws = {};
Object.defineProperty(Ws, "__esModule", { value: !0 });
const Ro = ve, By = ke, Vy = rn, Fy = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Ro._)`{allowedValue: ${e}}`
}, Uy = {
  keyword: "const",
  $data: !0,
  error: Fy,
  code(e) {
    const { gen: t, data: a, $data: n, schemaCode: s, schema: c } = e;
    n || c && typeof c == "object" ? e.fail$data((0, Ro._)`!${(0, By.useFunc)(t, Vy.default)}(${a}, ${s})`) : e.fail((0, Ro._)`${c} !== ${a}`);
  }
};
Ws.default = Uy;
var Js = {};
Object.defineProperty(Js, "__esModule", { value: !0 });
const Na = ve, qy = ke, Hy = rn, Gy = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Na._)`{allowedValues: ${e}}`
}, Ky = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Gy,
  code(e) {
    const { gen: t, data: a, $data: n, schema: s, schemaCode: c, it: p } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const b = s.length >= p.opts.loopEnum;
    let _;
    const y = () => _ ?? (_ = (0, qy.useFunc)(t, Hy.default));
    let g;
    if (b || n)
      g = t.let("valid"), e.block$data(g, S);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const A = t.const("vSchema", c);
      g = (0, Na.or)(...s.map((N, C) => L(A, C)));
    }
    e.pass(g);
    function S() {
      t.assign(g, !1), t.forOf("v", c, (A) => t.if((0, Na._)`${y()}(${a}, ${A})`, () => t.assign(g, !0).break()));
    }
    function L(A, N) {
      const C = s[N];
      return typeof C == "object" && C !== null ? (0, Na._)`${y()}(${a}, ${A}[${N}])` : (0, Na._)`${a} === ${C}`;
    }
  }
};
Js.default = Ky;
Object.defineProperty(Ds, "__esModule", { value: !0 });
const Wy = zs, Jy = Bs, Zy = Vs, Yy = Us, Qy = qs, Xy = Hs, eb = Gs, tb = Ks, rb = Ws, ab = Js, nb = [
  // number
  Wy.default,
  Jy.default,
  // string
  Zy.default,
  Yy.default,
  // object
  Qy.default,
  Xy.default,
  // array
  eb.default,
  tb.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  rb.default,
  ab.default
];
Ds.default = nb;
var Zs = {}, ha = {};
Object.defineProperty(ha, "__esModule", { value: !0 });
ha.validateAdditionalItems = void 0;
const Vr = ve, Io = ke, ob = {
  message: ({ params: { len: e } }) => (0, Vr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Vr._)`{limit: ${e}}`
}, sb = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: ob,
  code(e) {
    const { parentSchema: t, it: a } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Io.checkStrictMode)(a, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    mu(e, n);
  }
};
function mu(e, t) {
  const { gen: a, schema: n, data: s, keyword: c, it: p } = e;
  p.items = !0;
  const b = a.const("len", (0, Vr._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Vr._)`${b} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Io.alwaysValidSchema)(p, n)) {
    const y = a.var("valid", (0, Vr._)`${b} <= ${t.length}`);
    a.if((0, Vr.not)(y), () => _(y)), e.ok(y);
  }
  function _(y) {
    a.forRange("i", t.length, b, (g) => {
      e.subschema({ keyword: c, dataProp: g, dataPropType: Io.Type.Num }, y), p.allErrors || a.if((0, Vr.not)(y), () => a.break());
    });
  }
}
ha.validateAdditionalItems = mu;
ha.default = sb;
var Ys = {}, pa = {};
Object.defineProperty(pa, "__esModule", { value: !0 });
pa.validateTuple = void 0;
const dc = ve, En = ke, ib = _e, cb = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: a } = e;
    if (Array.isArray(t))
      return gu(e, "additionalItems", t);
    a.items = !0, !(0, En.alwaysValidSchema)(a, t) && e.ok((0, ib.validateArray)(e));
  }
};
function gu(e, t, a = e.schema) {
  const { gen: n, parentSchema: s, data: c, keyword: p, it: b } = e;
  g(s), b.opts.unevaluated && a.length && b.items !== !0 && (b.items = En.mergeEvaluated.items(n, a.length, b.items));
  const _ = n.name("valid"), y = n.const("len", (0, dc._)`${c}.length`);
  a.forEach((S, L) => {
    (0, En.alwaysValidSchema)(b, S) || (n.if((0, dc._)`${y} > ${L}`, () => e.subschema({
      keyword: p,
      schemaProp: L,
      dataProp: L
    }, _)), e.ok(_));
  });
  function g(S) {
    const { opts: L, errSchemaPath: A } = b, N = a.length, C = N === S.minItems && (N === S.maxItems || S[t] === !1);
    if (L.strictTuples && !C) {
      const T = `"${p}" is ${N}-tuple, but minItems or maxItems/${t} are not specified or different at path "${A}"`;
      (0, En.checkStrictMode)(b, T, L.strictTuples);
    }
  }
}
pa.validateTuple = gu;
pa.default = cb;
Object.defineProperty(Ys, "__esModule", { value: !0 });
const lb = pa, ub = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, lb.validateTuple)(e, "items")
};
Ys.default = ub;
var Qs = {};
Object.defineProperty(Qs, "__esModule", { value: !0 });
const hc = ve, db = ke, hb = _e, pb = ha, fb = {
  message: ({ params: { len: e } }) => (0, hc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, hc._)`{limit: ${e}}`
}, mb = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: fb,
  code(e) {
    const { schema: t, parentSchema: a, it: n } = e, { prefixItems: s } = a;
    n.items = !0, !(0, db.alwaysValidSchema)(n, t) && (s ? (0, pb.validateAdditionalItems)(e, s) : e.ok((0, hb.validateArray)(e)));
  }
};
Qs.default = mb;
var Xs = {};
Object.defineProperty(Xs, "__esModule", { value: !0 });
const It = ve, hn = ke, gb = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, It.str)`must contain at least ${e} valid item(s)` : (0, It.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, It._)`{minContains: ${e}}` : (0, It._)`{minContains: ${e}, maxContains: ${t}}`
}, yb = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: gb,
  code(e) {
    const { gen: t, schema: a, parentSchema: n, data: s, it: c } = e;
    let p, b;
    const { minContains: _, maxContains: y } = n;
    c.opts.next ? (p = _ === void 0 ? 1 : _, b = y) : p = 1;
    const g = t.const("len", (0, It._)`${s}.length`);
    if (e.setParams({ min: p, max: b }), b === void 0 && p === 0) {
      (0, hn.checkStrictMode)(c, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (b !== void 0 && p > b) {
      (0, hn.checkStrictMode)(c, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, hn.alwaysValidSchema)(c, a)) {
      let C = (0, It._)`${g} >= ${p}`;
      b !== void 0 && (C = (0, It._)`${C} && ${g} <= ${b}`), e.pass(C);
      return;
    }
    c.items = !0;
    const S = t.name("valid");
    b === void 0 && p === 1 ? A(S, () => t.if(S, () => t.break())) : p === 0 ? (t.let(S, !0), b !== void 0 && t.if((0, It._)`${s}.length > 0`, L)) : (t.let(S, !1), L()), e.result(S, () => e.reset());
    function L() {
      const C = t.name("_valid"), T = t.let("count", 0);
      A(C, () => t.if(C, () => N(T)));
    }
    function A(C, T) {
      t.forRange("i", 0, g, (v) => {
        e.subschema({
          keyword: "contains",
          dataProp: v,
          dataPropType: hn.Type.Num,
          compositeRule: !0
        }, C), T();
      });
    }
    function N(C) {
      t.code((0, It._)`${C}++`), b === void 0 ? t.if((0, It._)`${C} >= ${p}`, () => t.assign(S, !0).break()) : (t.if((0, It._)`${C} > ${b}`, () => t.assign(S, !1).break()), p === 1 ? t.assign(S, !0) : t.if((0, It._)`${C} >= ${p}`, () => t.assign(S, !0)));
    }
  }
};
Xs.default = yb;
var yu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = ve, a = ke, n = _e;
  e.error = {
    message: ({ params: { property: _, depsCount: y, deps: g } }) => {
      const S = y === 1 ? "property" : "properties";
      return (0, t.str)`must have ${S} ${g} when property ${_} is present`;
    },
    params: ({ params: { property: _, depsCount: y, deps: g, missingProperty: S } }) => (0, t._)`{property: ${_},
    missingProperty: ${S},
    depsCount: ${y},
    deps: ${g}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(_) {
      const [y, g] = c(_);
      p(_, y), b(_, g);
    }
  };
  function c({ schema: _ }) {
    const y = {}, g = {};
    for (const S in _) {
      if (S === "__proto__")
        continue;
      const L = Array.isArray(_[S]) ? y : g;
      L[S] = _[S];
    }
    return [y, g];
  }
  function p(_, y = _.schema) {
    const { gen: g, data: S, it: L } = _;
    if (Object.keys(y).length === 0)
      return;
    const A = g.let("missing");
    for (const N in y) {
      const C = y[N];
      if (C.length === 0)
        continue;
      const T = (0, n.propertyInData)(g, S, N, L.opts.ownProperties);
      _.setParams({
        property: N,
        depsCount: C.length,
        deps: C.join(", ")
      }), L.allErrors ? g.if(T, () => {
        for (const v of C)
          (0, n.checkReportMissingProp)(_, v);
      }) : (g.if((0, t._)`${T} && (${(0, n.checkMissingProp)(_, C, A)})`), (0, n.reportMissingProp)(_, A), g.else());
    }
  }
  e.validatePropertyDeps = p;
  function b(_, y = _.schema) {
    const { gen: g, data: S, keyword: L, it: A } = _, N = g.name("valid");
    for (const C in y)
      (0, a.alwaysValidSchema)(A, y[C]) || (g.if(
        (0, n.propertyInData)(g, S, C, A.opts.ownProperties),
        () => {
          const T = _.subschema({ keyword: L, schemaProp: C }, N);
          _.mergeValidEvaluated(T, N);
        },
        () => g.var(N, !0)
        // TODO var
      ), _.ok(N));
  }
  e.validateSchemaDeps = b, e.default = s;
})(yu);
var ei = {};
Object.defineProperty(ei, "__esModule", { value: !0 });
const bu = ve, bb = ke, _b = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, bu._)`{propertyName: ${e.propertyName}}`
}, wb = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: _b,
  code(e) {
    const { gen: t, schema: a, data: n, it: s } = e;
    if ((0, bb.alwaysValidSchema)(s, a))
      return;
    const c = t.name("valid");
    t.forIn("key", n, (p) => {
      e.setParams({ propertyName: p }), e.subschema({
        keyword: "propertyNames",
        data: p,
        dataTypes: ["string"],
        propertyName: p,
        compositeRule: !0
      }, c), t.if((0, bu.not)(c), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(c);
  }
};
ei.default = wb;
var Jn = {};
Object.defineProperty(Jn, "__esModule", { value: !0 });
const pn = _e, Kt = ve, vb = lr, fn = ke, $b = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Kt._)`{additionalProperty: ${e.additionalProperty}}`
}, kb = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: $b,
  code(e) {
    const { gen: t, schema: a, parentSchema: n, data: s, errsCount: c, it: p } = e;
    if (!c)
      throw new Error("ajv implementation error");
    const { allErrors: b, opts: _ } = p;
    if (p.props = !0, _.removeAdditional !== "all" && (0, fn.alwaysValidSchema)(p, a))
      return;
    const y = (0, pn.allSchemaProperties)(n.properties), g = (0, pn.allSchemaProperties)(n.patternProperties);
    S(), e.ok((0, Kt._)`${c} === ${vb.default.errors}`);
    function S() {
      t.forIn("key", s, (T) => {
        !y.length && !g.length ? N(T) : t.if(L(T), () => N(T));
      });
    }
    function L(T) {
      let v;
      if (y.length > 8) {
        const j = (0, fn.schemaRefOrVal)(p, n.properties, "properties");
        v = (0, pn.isOwnProperty)(t, j, T);
      } else
        y.length ? v = (0, Kt.or)(...y.map((j) => (0, Kt._)`${T} === ${j}`)) : v = Kt.nil;
      return g.length && (v = (0, Kt.or)(v, ...g.map((j) => (0, Kt._)`${(0, pn.usePattern)(e, j)}.test(${T})`))), (0, Kt.not)(v);
    }
    function A(T) {
      t.code((0, Kt._)`delete ${s}[${T}]`);
    }
    function N(T) {
      if (_.removeAdditional === "all" || _.removeAdditional && a === !1) {
        A(T);
        return;
      }
      if (a === !1) {
        e.setParams({ additionalProperty: T }), e.error(), b || t.break();
        return;
      }
      if (typeof a == "object" && !(0, fn.alwaysValidSchema)(p, a)) {
        const v = t.name("valid");
        _.removeAdditional === "failing" ? (C(T, v, !1), t.if((0, Kt.not)(v), () => {
          e.reset(), A(T);
        })) : (C(T, v), b || t.if((0, Kt.not)(v), () => t.break()));
      }
    }
    function C(T, v, j) {
      const I = {
        keyword: "additionalProperties",
        dataProp: T,
        dataPropType: fn.Type.Str
      };
      j === !1 && Object.assign(I, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(I, v);
    }
  }
};
Jn.default = kb;
var ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
const Eb = tr, pc = _e, _o = ke, fc = Jn, Pb = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: a, parentSchema: n, data: s, it: c } = e;
    c.opts.removeAdditional === "all" && n.additionalProperties === void 0 && fc.default.code(new Eb.KeywordCxt(c, fc.default, "additionalProperties"));
    const p = (0, pc.allSchemaProperties)(a);
    for (const S of p)
      c.definedProperties.add(S);
    c.opts.unevaluated && p.length && c.props !== !0 && (c.props = _o.mergeEvaluated.props(t, (0, _o.toHash)(p), c.props));
    const b = p.filter((S) => !(0, _o.alwaysValidSchema)(c, a[S]));
    if (b.length === 0)
      return;
    const _ = t.name("valid");
    for (const S of b)
      y(S) ? g(S) : (t.if((0, pc.propertyInData)(t, s, S, c.opts.ownProperties)), g(S), c.allErrors || t.else().var(_, !0), t.endIf()), e.it.definedProperties.add(S), e.ok(_);
    function y(S) {
      return c.opts.useDefaults && !c.compositeRule && a[S].default !== void 0;
    }
    function g(S) {
      e.subschema({
        keyword: "properties",
        schemaProp: S,
        dataProp: S
      }, _);
    }
  }
};
ti.default = Pb;
var ri = {};
Object.defineProperty(ri, "__esModule", { value: !0 });
const mc = _e, mn = ve, gc = ke, yc = ke, Sb = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: a, data: n, parentSchema: s, it: c } = e, { opts: p } = c, b = (0, mc.allSchemaProperties)(a), _ = b.filter((C) => (0, gc.alwaysValidSchema)(c, a[C]));
    if (b.length === 0 || _.length === b.length && (!c.opts.unevaluated || c.props === !0))
      return;
    const y = p.strictSchema && !p.allowMatchingProperties && s.properties, g = t.name("valid");
    c.props !== !0 && !(c.props instanceof mn.Name) && (c.props = (0, yc.evaluatedPropsToName)(t, c.props));
    const { props: S } = c;
    L();
    function L() {
      for (const C of b)
        y && A(C), c.allErrors ? N(C) : (t.var(g, !0), N(C), t.if(g));
    }
    function A(C) {
      for (const T in y)
        new RegExp(C).test(T) && (0, gc.checkStrictMode)(c, `property ${T} matches pattern ${C} (use allowMatchingProperties)`);
    }
    function N(C) {
      t.forIn("key", n, (T) => {
        t.if((0, mn._)`${(0, mc.usePattern)(e, C)}.test(${T})`, () => {
          const v = _.includes(C);
          v || e.subschema({
            keyword: "patternProperties",
            schemaProp: C,
            dataProp: T,
            dataPropType: yc.Type.Str
          }, g), c.opts.unevaluated && S !== !0 ? t.assign((0, mn._)`${S}[${T}]`, !0) : !v && !c.allErrors && t.if((0, mn.not)(g), () => t.break());
        });
      });
    }
  }
};
ri.default = Sb;
var ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
const xb = ke, Tb = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: a, it: n } = e;
    if ((0, xb.alwaysValidSchema)(n, a)) {
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
ai.default = Tb;
var ni = {};
Object.defineProperty(ni, "__esModule", { value: !0 });
const jb = _e, Cb = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: jb.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
ni.default = Cb;
var oi = {};
Object.defineProperty(oi, "__esModule", { value: !0 });
const Pn = ve, Ob = ke, Nb = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Pn._)`{passingSchemas: ${e.passing}}`
}, Lb = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Nb,
  code(e) {
    const { gen: t, schema: a, parentSchema: n, it: s } = e;
    if (!Array.isArray(a))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const c = a, p = t.let("valid", !1), b = t.let("passing", null), _ = t.name("_valid");
    e.setParams({ passing: b }), t.block(y), e.result(p, () => e.reset(), () => e.error(!0));
    function y() {
      c.forEach((g, S) => {
        let L;
        (0, Ob.alwaysValidSchema)(s, g) ? t.var(_, !0) : L = e.subschema({
          keyword: "oneOf",
          schemaProp: S,
          compositeRule: !0
        }, _), S > 0 && t.if((0, Pn._)`${_} && ${p}`).assign(p, !1).assign(b, (0, Pn._)`[${b}, ${S}]`).else(), t.if(_, () => {
          t.assign(p, !0), t.assign(b, S), L && e.mergeEvaluated(L, Pn.Name);
        });
      });
    }
  }
};
oi.default = Lb;
var si = {};
Object.defineProperty(si, "__esModule", { value: !0 });
const Rb = ke, Ib = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: a, it: n } = e;
    if (!Array.isArray(a))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    a.forEach((c, p) => {
      if ((0, Rb.alwaysValidSchema)(n, c))
        return;
      const b = e.subschema({ keyword: "allOf", schemaProp: p }, s);
      e.ok(s), e.mergeEvaluated(b);
    });
  }
};
si.default = Ib;
var ii = {};
Object.defineProperty(ii, "__esModule", { value: !0 });
const Dn = ve, _u = ke, Ab = {
  message: ({ params: e }) => (0, Dn.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Dn._)`{failingKeyword: ${e.ifClause}}`
}, Mb = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Ab,
  code(e) {
    const { gen: t, parentSchema: a, it: n } = e;
    a.then === void 0 && a.else === void 0 && (0, _u.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = bc(n, "then"), c = bc(n, "else");
    if (!s && !c)
      return;
    const p = t.let("valid", !0), b = t.name("_valid");
    if (_(), e.reset(), s && c) {
      const g = t.let("ifClause");
      e.setParams({ ifClause: g }), t.if(b, y("then", g), y("else", g));
    } else
      s ? t.if(b, y("then")) : t.if((0, Dn.not)(b), y("else"));
    e.pass(p, () => e.error(!0));
    function _() {
      const g = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, b);
      e.mergeEvaluated(g);
    }
    function y(g, S) {
      return () => {
        const L = e.subschema({ keyword: g }, b);
        t.assign(p, b), e.mergeValidEvaluated(L, p), S ? t.assign(S, (0, Dn._)`${g}`) : e.setParams({ ifClause: g });
      };
    }
  }
};
function bc(e, t) {
  const a = e.schema[t];
  return a !== void 0 && !(0, _u.alwaysValidSchema)(e, a);
}
ii.default = Mb;
var ci = {};
Object.defineProperty(ci, "__esModule", { value: !0 });
const Db = ke, zb = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: a }) {
    t.if === void 0 && (0, Db.checkStrictMode)(a, `"${e}" without "if" is ignored`);
  }
};
ci.default = zb;
Object.defineProperty(Zs, "__esModule", { value: !0 });
const Bb = ha, Vb = Ys, Fb = pa, Ub = Qs, qb = Xs, Hb = yu, Gb = ei, Kb = Jn, Wb = ti, Jb = ri, Zb = ai, Yb = ni, Qb = oi, Xb = si, e_ = ii, t_ = ci;
function r_(e = !1) {
  const t = [
    // any
    Zb.default,
    Yb.default,
    Qb.default,
    Xb.default,
    e_.default,
    t_.default,
    // object
    Gb.default,
    Kb.default,
    Hb.default,
    Wb.default,
    Jb.default
  ];
  return e ? t.push(Vb.default, Ub.default) : t.push(Bb.default, Fb.default), t.push(qb.default), t;
}
Zs.default = r_;
var li = {}, ui = {};
Object.defineProperty(ui, "__esModule", { value: !0 });
const Ue = ve, a_ = {
  message: ({ schemaCode: e }) => (0, Ue.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, Ue._)`{format: ${e}}`
}, n_ = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: a_,
  code(e, t) {
    const { gen: a, data: n, $data: s, schema: c, schemaCode: p, it: b } = e, { opts: _, errSchemaPath: y, schemaEnv: g, self: S } = b;
    if (!_.validateFormats)
      return;
    s ? L() : A();
    function L() {
      const N = a.scopeValue("formats", {
        ref: S.formats,
        code: _.code.formats
      }), C = a.const("fDef", (0, Ue._)`${N}[${p}]`), T = a.let("fType"), v = a.let("format");
      a.if((0, Ue._)`typeof ${C} == "object" && !(${C} instanceof RegExp)`, () => a.assign(T, (0, Ue._)`${C}.type || "string"`).assign(v, (0, Ue._)`${C}.validate`), () => a.assign(T, (0, Ue._)`"string"`).assign(v, C)), e.fail$data((0, Ue.or)(j(), I()));
      function j() {
        return _.strictSchema === !1 ? Ue.nil : (0, Ue._)`${p} && !${v}`;
      }
      function I() {
        const r = g.$async ? (0, Ue._)`(${C}.async ? await ${v}(${n}) : ${v}(${n}))` : (0, Ue._)`${v}(${n})`, i = (0, Ue._)`(typeof ${v} == "function" ? ${r} : ${v}.test(${n}))`;
        return (0, Ue._)`${v} && ${v} !== true && ${T} === ${t} && !${i}`;
      }
    }
    function A() {
      const N = S.formats[c];
      if (!N) {
        j();
        return;
      }
      if (N === !0)
        return;
      const [C, T, v] = I(N);
      C === t && e.pass(r());
      function j() {
        if (_.strictSchema === !1) {
          S.logger.warn(i());
          return;
        }
        throw new Error(i());
        function i() {
          return `unknown format "${c}" ignored in schema at path "${y}"`;
        }
      }
      function I(i) {
        const o = i instanceof RegExp ? (0, Ue.regexpCode)(i) : _.code.formats ? (0, Ue._)`${_.code.formats}${(0, Ue.getProperty)(c)}` : void 0, l = a.scopeValue("formats", { key: c, ref: i, code: o });
        return typeof i == "object" && !(i instanceof RegExp) ? [i.type || "string", i.validate, (0, Ue._)`${l}.validate`] : ["string", i, l];
      }
      function r() {
        if (typeof N == "object" && !(N instanceof RegExp) && N.async) {
          if (!g.$async)
            throw new Error("async format in sync schema");
          return (0, Ue._)`await ${v}(${n})`;
        }
        return typeof T == "function" ? (0, Ue._)`${v}(${n})` : (0, Ue._)`${v}.test(${n})`;
      }
    }
  }
};
ui.default = n_;
Object.defineProperty(li, "__esModule", { value: !0 });
const o_ = ui, s_ = [o_.default];
li.default = s_;
var la = {};
Object.defineProperty(la, "__esModule", { value: !0 });
la.contentVocabulary = la.metadataVocabulary = void 0;
la.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
la.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Is, "__esModule", { value: !0 });
const i_ = As, c_ = Ds, l_ = Zs, u_ = li, _c = la, d_ = [
  i_.default,
  c_.default,
  (0, l_.default)(),
  u_.default,
  _c.metadataVocabulary,
  _c.contentVocabulary
];
Is.default = d_;
var di = {}, wu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.DiscrError = void 0, function(t) {
    t.Tag = "tag", t.Mapping = "mapping";
  }(e.DiscrError || (e.DiscrError = {}));
})(wu);
Object.defineProperty(di, "__esModule", { value: !0 });
const Qr = ve, Ao = wu, wc = vt, h_ = ke, p_ = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Ao.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: a } }) => (0, Qr._)`{error: ${e}, tag: ${a}, tagValue: ${t}}`
}, f_ = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: p_,
  code(e) {
    const { gen: t, data: a, schema: n, parentSchema: s, it: c } = e, { oneOf: p } = s;
    if (!c.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const b = n.propertyName;
    if (typeof b != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!p)
      throw new Error("discriminator: requires oneOf keyword");
    const _ = t.let("valid", !1), y = t.const("tag", (0, Qr._)`${a}${(0, Qr.getProperty)(b)}`);
    t.if((0, Qr._)`typeof ${y} == "string"`, () => g(), () => e.error(!1, { discrError: Ao.DiscrError.Tag, tag: y, tagName: b })), e.ok(_);
    function g() {
      const A = L();
      t.if(!1);
      for (const N in A)
        t.elseIf((0, Qr._)`${y} === ${N}`), t.assign(_, S(A[N]));
      t.else(), e.error(!1, { discrError: Ao.DiscrError.Mapping, tag: y, tagName: b }), t.endIf();
    }
    function S(A) {
      const N = t.name("valid"), C = e.subschema({ keyword: "oneOf", schemaProp: A }, N);
      return e.mergeEvaluated(C, Qr.Name), N;
    }
    function L() {
      var A;
      const N = {}, C = v(s);
      let T = !0;
      for (let r = 0; r < p.length; r++) {
        let i = p[r];
        i != null && i.$ref && !(0, h_.schemaHasRulesButRef)(i, c.self.RULES) && (i = wc.resolveRef.call(c.self, c.schemaEnv.root, c.baseId, i == null ? void 0 : i.$ref), i instanceof wc.SchemaEnv && (i = i.schema));
        const o = (A = i == null ? void 0 : i.properties) === null || A === void 0 ? void 0 : A[b];
        if (typeof o != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${b}"`);
        T = T && (C || v(i)), j(o, r);
      }
      if (!T)
        throw new Error(`discriminator: "${b}" must be required`);
      return N;
      function v({ required: r }) {
        return Array.isArray(r) && r.includes(b);
      }
      function j(r, i) {
        if (r.const)
          I(r.const, i);
        else if (r.enum)
          for (const o of r.enum)
            I(o, i);
        else
          throw new Error(`discriminator: "properties/${b}" must have "const" or "enum"`);
      }
      function I(r, i) {
        if (typeof r != "string" || r in N)
          throw new Error(`discriminator: "${b}" values must be unique strings`);
        N[r] = i;
      }
    }
  }
};
di.default = f_;
const m_ = "http://json-schema.org/draft-07/schema#", g_ = "http://json-schema.org/draft-07/schema#", y_ = "Core schema meta-schema", b_ = {
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
}, __ = [
  "object",
  "boolean"
], w_ = {
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
}, v_ = {
  $schema: m_,
  $id: g_,
  title: y_,
  definitions: b_,
  type: __,
  properties: w_,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = void 0;
  const a = Bl, n = Is, s = di, c = v_, p = ["/properties"], b = "http://json-schema.org/draft-07/schema";
  class _ extends a.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((N) => this.addVocabulary(N)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const N = this.opts.$data ? this.$dataMetaSchema(c, p) : c;
      this.addMetaSchema(N, b, !1), this.refs["http://json-schema.org/schema"] = b;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(b) ? b : void 0);
    }
  }
  e.exports = t = _, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = _;
  var y = tr;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return y.KeywordCxt;
  } });
  var g = ve;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return g._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return g.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return g.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return g.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return g.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return g.CodeGen;
  } });
  var S = en;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return S.default;
  } });
  var L = tn;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return L.default;
  } });
})(Co, Co.exports);
var $_ = Co.exports;
const k_ = /* @__PURE__ */ zl($_);
class E_ {
  constructor() {
    Qe(this, "ajv"), this.ajv = new k_();
  }
  validateJson(t, a) {
    const n = this.ajv.validate(t, a);
    return n ? { valid: n } : { valid: n, error: this.ajv.errorsText() };
  }
  validateObjectSchema(t, a) {
    const n = this.ajv.validate(t, a);
    return n ? { valid: n } : { valid: n, error: this.ajv.errorsText() };
  }
}
class P_ {
  constructor() {
    Qe(this, "TIME_SPLIT", " ");
  }
  /**
   * 给日期添加小时
   *
   * @param date - Date
   * @param numOfHours - 数字
   * @author terwer
   * @since 1.0.0
   */
  addHoursToDate(t, a) {
    return t.setTime(t.getTime() + a * 60 * 60 * 1e3), t;
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
  formatIsoToZhDateFormat(t, a, n) {
    if (!t)
      return "";
    let s = t;
    const c = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(.\d{3})Z$/gm, p = s.match(c);
    if (p == null)
      return t;
    for (let b = 0; b < p.length; b++) {
      const _ = p[b];
      let y = _;
      a && (y = this.addHoursToDate(new Date(_), 8).toISOString());
      const g = y.split("T"), S = g[0], L = g[1].split(".")[0];
      let A = S + this.TIME_SPLIT + L;
      n && (A = S), s = s.replace(_, A);
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
class S_ {
  /**
   * 格式化字符串
   *
   * @param str - 字符串，可用占位符，例如：test \{0\} str
   * @param args - 按占位符顺序排列的参数
   * @author terwer
   * @since 0.0.1
   */
  f(t, ...a) {
    let n = t;
    for (let s = 0; s < a.length; s++) {
      const c = a[s];
      typeof c == "string" ? n = n.replace(`{${s}}`, c) : n = n.replace(`{${s}}`, c.toString());
    }
    return n;
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
  includeInArray(t, a) {
    let n = !1;
    for (let s = 0; s < a.length; s++) {
      const c = a[s];
      t.includes(c) && (n = !0);
    }
    return n;
  }
  /**
   * 截取指定长度的字符串
   *
   * @param str - str
   * @param length - 长度
   * @param ignore - 不要结尾省略号
   */
  getByLength(t, a, n) {
    const s = t;
    return s.length < a ? s : n ? s.substring(0, a) : s.substring(0, a) + "...";
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
  pathJoin(t, a) {
    let n = t;
    const s = t.lastIndexOf("/");
    return s + 1 === t.length && (n = t.substring(0, s)), a.indexOf("/") > 0 ? n = n + "/" + a : n = n + a, n;
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
const wo = (e, t) => {
  const a = vc(e), n = vc(t), s = a.pop(), c = n.pop(), p = Ec(a, n);
  return p !== 0 ? p : s && c ? Ec(s.split("."), c.split(".")) : s || c ? s ? -1 : 1 : 0;
}, x_ = /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i, vc = (e) => {
  if (typeof e != "string")
    throw new TypeError("Invalid argument expected string");
  const t = e.match(x_);
  if (!t)
    throw new Error(`Invalid argument not valid semver ('${e}' received)`);
  return t.shift(), t;
}, $c = (e) => e === "*" || e === "x" || e === "X", kc = (e) => {
  const t = parseInt(e, 10);
  return isNaN(t) ? e : t;
}, T_ = (e, t) => typeof e != typeof t ? [String(e), String(t)] : [e, t], j_ = (e, t) => {
  if ($c(e) || $c(t))
    return 0;
  const [a, n] = T_(kc(e), kc(t));
  return a > n ? 1 : a < n ? -1 : 0;
}, Ec = (e, t) => {
  for (let a = 0; a < Math.max(e.length, t.length); a++) {
    const n = j_(e[a] || "0", t[a] || "0");
    if (n !== 0)
      return n;
  }
  return 0;
};
class C_ {
  /**
   * Compare [semver](https://semver.org/) version strings
   * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
   *
   * @param v1 - First version to compare
   * @param v2 - Second version to compare
   * @returns boolean true if v1 is higher than v2
   */
  greater(t, a) {
    return wo(t, a) > 0;
  }
  /**
   * Compare [semver](https://semver.org/) version strings
   * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
   *
   * @param v1 - First version to compare
   * @param v2 - Second version to compare
   * @returns boolean true if v1 is equal to v2
   */
  equal(t, a) {
    return wo(t, a) === 0;
  }
  /**
   * Compare [semver](https://semver.org/) version strings
   * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
   *
   * @param v1 - First version to compare
   * @param v2 - Second version to compare
   * @returns boolean true if v1 is lesser than v2
   */
  lesser(t, a) {
    return wo(t, a) < 0;
  }
}
var O_ = Object.defineProperty, N_ = (e, t, a) => t in e ? O_(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, Xr = (e, t, a) => (N_(e, typeof t != "symbol" ? t + "" : t, a), a);
let Er = class {
};
Xr(Er, "NODE_ENV_KEY", "NODE_ENV"), /**
* 开发环境
*/
Xr(Er, "NODE_ENV_DEVELOPMENT", "development"), /**
* 生产环境
*/
Xr(Er, "NODE_ENV_PRODUCTION", "production"), /**
* 测试环境
*/
Xr(Er, "NODE_ENV_TEST", "test"), /**
* 是否处于调试模式
*/
Xr(Er, "VITE_DEBUG_MODE_KEY", "VITE_DEBUG_MODE");
class L_ {
  /**
   * 环境初始化
   *
   * @param envMeta - 需要传入 {"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":false} 。特别提醒：此参数是静态元数据，取决于最终使用的项目。因此仅仅在最终使用的地方显示传递此值，中间项目请保持参数传递
   * @see {@link https://vitejs.dev/guide/env-and-mode.html#production-replacement}
   */
  constructor(t) {
    Xr(this, "envMeta"), this.envMeta = t;
  }
  /**
   * 是否是开发阶段调试
   */
  isNodeDev() {
    return this.getEnv(Er.NODE_ENV_KEY) === Er.NODE_ENV_DEVELOPMENT;
  }
  /**
   * 是否是调试阶段
   */
  isDev() {
    return this.isNodeDev() || this.getBooleanEnv(Er.VITE_DEBUG_MODE_KEY);
  }
  /**
   * 获取环境变量，key不存在返回undefined
   * @param key - key
   */
  getEnv(t) {
    let a;
    try {
      this.envMeta[t] && (a = this.envMeta[t]);
    } catch {
    }
    return a;
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
    let a = !1;
    return this.getEnv(t) && (a = this.getStringEnv(t).toLowerCase() === "true"), a;
  }
  /**
   * 获取环境变量，如果未定义或者为空值，用指定的默认值代替
   *
   * @param key - key
   * @param defaultValue - 默认值
   * @since 0.1.0
   * @author terwer
   */
  getEnvOrDefault(t, a) {
    const n = this.getStringEnv(t);
    return n.trim().length == 0 ? a : n;
  }
}
var R_ = Object.defineProperty, I_ = (e, t, a) => t in e ? R_(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, oa = (e, t, a) => (I_(e, typeof t != "symbol" ? t + "" : t, a), a);
class zn {
}
oa(zn, "LOG_LEVEL_KEY", "VITE_LOG_LEVEL"), oa(zn, "LOG_PREFIX_KEY", "VITE_LOG_PREFIX");
var ar = /* @__PURE__ */ ((e) => (e.LOG_LEVEL_TRACE = "TRACE", e.LOG_LEVEL_DEBUG = "DEBUG", e.LOG_LEVEL_INFO = "INFO", e.LOG_LEVEL_WARN = "WARN", e.LOG_LEVEL_ERROR = "ERROR", e))(ar || {}), vu = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function hi(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var $u = { exports: {} };
(function(e) {
  (function(t, a) {
    e.exports ? e.exports = a() : t.log = a();
  })(vu, function() {
    var t = function() {
    }, a = "undefined", n = typeof window !== a && typeof window.navigator !== a && /Trident\/|MSIE /.test(window.navigator.userAgent), s = [
      "trace",
      "debug",
      "info",
      "warn",
      "error"
    ];
    function c(C, T) {
      var v = C[T];
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
    function p() {
      console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
    }
    function b(C) {
      return C === "debug" && (C = "log"), typeof console === a ? !1 : C === "trace" && n ? p : console[C] !== void 0 ? c(console, C) : console.log !== void 0 ? c(console, "log") : t;
    }
    function _(C, T) {
      for (var v = 0; v < s.length; v++) {
        var j = s[v];
        this[j] = v < C ? t : this.methodFactory(j, C, T);
      }
      this.log = this.debug;
    }
    function y(C, T, v) {
      return function() {
        typeof console !== a && (_.call(this, T, v), this[C].apply(this, arguments));
      };
    }
    function g(C, T, v) {
      return b(C) || y.apply(this, arguments);
    }
    function S(C, T, v) {
      var j = this, I;
      T = T ?? "WARN";
      var r = "loglevel";
      typeof C == "string" ? r += ":" + C : typeof C == "symbol" && (r = void 0);
      function i(m) {
        var f = (s[m] || "silent").toUpperCase();
        if (!(typeof window === a || !r)) {
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
        var m;
        if (!(typeof window === a || !r)) {
          try {
            m = window.localStorage[r];
          } catch {
          }
          if (typeof m === a)
            try {
              var f = window.document.cookie, x = f.indexOf(
                encodeURIComponent(r) + "="
              );
              x !== -1 && (m = /^([^;]+)/.exec(f.slice(x))[1]);
            } catch {
            }
          return j.levels[m] === void 0 && (m = void 0), m;
        }
      }
      function l() {
        if (!(typeof window === a || !r)) {
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
      j.name = C, j.levels = {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        SILENT: 5
      }, j.methodFactory = v || g, j.getLevel = function() {
        return I;
      }, j.setLevel = function(m, f) {
        if (typeof m == "string" && j.levels[m.toUpperCase()] !== void 0 && (m = j.levels[m.toUpperCase()]), typeof m == "number" && m >= 0 && m <= j.levels.SILENT) {
          if (I = m, f !== !1 && i(m), _.call(j, m, C), typeof console === a && m < j.levels.SILENT)
            return "No console available for logging";
        } else
          throw "log.setLevel() called with invalid level: " + m;
      }, j.setDefaultLevel = function(m) {
        T = m, o() || j.setLevel(m, !1);
      }, j.resetLevel = function() {
        j.setLevel(T, !1), l();
      }, j.enableAll = function(m) {
        j.setLevel(j.levels.TRACE, m);
      }, j.disableAll = function(m) {
        j.setLevel(j.levels.SILENT, m);
      };
      var u = o();
      u == null && (u = T), j.setLevel(u, !1);
    }
    var L = new S(), A = {};
    L.getLogger = function(C) {
      if (typeof C != "symbol" && typeof C != "string" || C === "")
        throw new TypeError("You must supply a name when creating a logger.");
      var T = A[C];
      return T || (T = A[C] = new S(
        C,
        L.getLevel(),
        L.methodFactory
      )), T;
    };
    var N = typeof window !== a ? window.log : void 0;
    return L.noConflict = function() {
      return typeof window !== a && window.log === L && (window.log = N), L;
    }, L.getLoggers = function() {
      return A;
    }, L.default = L, L;
  });
})($u);
var A_ = $u.exports;
const gn = /* @__PURE__ */ hi(A_);
var ku = { exports: {} };
(function(e) {
  (function(t, a) {
    e.exports ? e.exports = a() : t.prefix = a(t);
  })(vu, function(t) {
    var a = function(g) {
      for (var S = 1, L = arguments.length, A; S < L; S++)
        for (A in arguments[S])
          Object.prototype.hasOwnProperty.call(arguments[S], A) && (g[A] = arguments[S][A]);
      return g;
    }, n = {
      template: "[%t] %l:",
      levelFormatter: function(g) {
        return g.toUpperCase();
      },
      nameFormatter: function(g) {
        return g || "root";
      },
      timestampFormatter: function(g) {
        return g.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
      },
      format: void 0
    }, s, c = {}, p = function(g) {
      if (!g || !g.getLogger)
        throw new TypeError("Argument is not a root logger");
      s = g;
    }, b = function(g, S) {
      if (!g || !g.setLevel)
        throw new TypeError("Argument is not a logger");
      var L = g.methodFactory, A = g.name || "", N = c[A] || c[""] || n;
      function C(T, v, j) {
        var I = L(T, v, j), r = c[j] || c[""], i = r.template.indexOf("%t") !== -1, o = r.template.indexOf("%l") !== -1, l = r.template.indexOf("%n") !== -1;
        return function() {
          for (var u = "", m = arguments.length, f = Array(m), x = 0; x < m; x++)
            f[x] = arguments[x];
          if (A || !c[j]) {
            var B = r.timestampFormatter(/* @__PURE__ */ new Date()), U = r.levelFormatter(T), z = r.nameFormatter(j);
            r.format ? u += r.format(U, z, B) : (u += r.template, i && (u = u.replace(/%t/, B)), o && (u = u.replace(/%l/, U)), l && (u = u.replace(/%n/, z))), f.length && typeof f[0] == "string" ? f[0] = u + " " + f[0] : f.unshift(u);
          }
          I.apply(void 0, f);
        };
      }
      return c[A] || (g.methodFactory = C), S = S || {}, S.template && (S.format = void 0), c[A] = a({}, N, S), g.setLevel(g.getLevel()), s || g.warn(
        "It is necessary to call the function reg() of loglevel-plugin-prefix before calling apply. From the next release, it will throw an error. See more: https://github.com/kutuluk/loglevel-plugin-prefix/blob/master/README.md"
      ), g;
    }, _ = {
      reg: p,
      apply: b
    }, y;
    return t && (y = t.prefix, _.noConflict = function() {
      return t.prefix === _ && (t.prefix = y), _;
    }), _;
  });
})(ku);
var M_ = ku.exports;
const Pc = /* @__PURE__ */ hi(M_);
function D_() {
  const e = Error.prepareStackTrace;
  Error.prepareStackTrace = (a, n) => n;
  const t = new Error().stack.slice(1);
  return Error.prepareStackTrace = e, t;
}
class Bn {
  /**
   * 解析日志级别为枚举
   *
   * @param enumObj - 枚举对象
   * @param value - 配置的值
   */
  static stringToEnumValue(t, a) {
    return t[Object.keys(t).filter((n) => t[n].toString() === a)[0]];
  }
  /**
   * 获取配置的日志级别
   */
  static getEnvLevel(t) {
    if (!t)
      return;
    const a = t.getEnvOrDefault(zn.LOG_LEVEL_KEY, ar.LOG_LEVEL_INFO), n = Bn.stringToEnumValue(ar, a.toUpperCase());
    return n || console.warn(
      "[zhi-log] LOG_LEVEL is invalid in you .env file.It must be either debug, info, warn or error, fallback to default info level"
    ), n;
  }
  /**
   * 获取默认日志
   */
  static getEnvLogger(t) {
    return t ? t.getEnv(zn.LOG_PREFIX_KEY) : void 0;
  }
}
var pi = { exports: {} }, Sc = { exports: {} }, xc;
function z_() {
  return xc || (xc = 1, function(e) {
    const t = typeof process < "u" && process.env.TERM_PROGRAM === "Hyper", a = typeof process < "u" && process.platform === "win32", n = typeof process < "u" && process.platform === "linux", s = {
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
    }, c = Object.assign({}, s, {
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
    }), p = Object.assign({}, s, {
      ballotCross: "✘",
      check: "✔",
      cross: "✖",
      ellipsisLarge: "⋯",
      ellipsis: "…",
      info: "ℹ",
      questionFull: "？",
      questionSmall: "﹖",
      pointer: n ? "▸" : "❯",
      pointerSmall: n ? "‣" : "›",
      radioOff: "◯",
      radioOn: "◉",
      warning: "⚠"
    });
    e.exports = a && !t ? c : p, Reflect.defineProperty(e.exports, "common", { enumerable: !1, value: s }), Reflect.defineProperty(e.exports, "windows", { enumerable: !1, value: c }), Reflect.defineProperty(e.exports, "other", { enumerable: !1, value: p });
  }(Sc)), Sc.exports;
}
const B_ = (e) => e !== null && typeof e == "object" && !Array.isArray(e), V_ = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g, F_ = () => typeof process < "u" ? process.env.FORCE_COLOR !== "0" : !1, Eu = () => {
  const e = {
    enabled: F_(),
    visible: !0,
    styles: {},
    keys: {}
  }, t = (c) => {
    let p = c.open = `\x1B[${c.codes[0]}m`, b = c.close = `\x1B[${c.codes[1]}m`, _ = c.regex = new RegExp(`\\u001b\\[${c.codes[1]}m`, "g");
    return c.wrap = (y, g) => {
      y.includes(b) && (y = y.replace(_, b + p));
      let S = p + y + b;
      return g ? S.replace(/\r*\n/g, `${b}$&${p}`) : S;
    }, c;
  }, a = (c, p, b) => typeof c == "function" ? c(p) : c.wrap(p, b), n = (c, p) => {
    if (c === "" || c == null)
      return "";
    if (e.enabled === !1)
      return c;
    if (e.visible === !1)
      return "";
    let b = "" + c, _ = b.includes(`
`), y = p.length;
    for (y > 0 && p.includes("unstyle") && (p = [.../* @__PURE__ */ new Set(["unstyle", ...p])].reverse()); y-- > 0; )
      b = a(e.styles[p[y]], b, _);
    return b;
  }, s = (c, p, b) => {
    e.styles[c] = t({ name: c, codes: p }), (e.keys[b] || (e.keys[b] = [])).push(c), Reflect.defineProperty(e, c, {
      configurable: !0,
      enumerable: !0,
      set(_) {
        e.alias(c, _);
      },
      get() {
        let _ = (y) => n(y, _.stack);
        return Reflect.setPrototypeOf(_, e), _.stack = this.stack ? this.stack.concat(c) : [c], _;
      }
    });
  };
  return s("reset", [0, 0], "modifier"), s("bold", [1, 22], "modifier"), s("dim", [2, 22], "modifier"), s("italic", [3, 23], "modifier"), s("underline", [4, 24], "modifier"), s("inverse", [7, 27], "modifier"), s("hidden", [8, 28], "modifier"), s("strikethrough", [9, 29], "modifier"), s("black", [30, 39], "color"), s("red", [31, 39], "color"), s("green", [32, 39], "color"), s("yellow", [33, 39], "color"), s("blue", [34, 39], "color"), s("magenta", [35, 39], "color"), s("cyan", [36, 39], "color"), s("white", [37, 39], "color"), s("gray", [90, 39], "color"), s("grey", [90, 39], "color"), s("bgBlack", [40, 49], "bg"), s("bgRed", [41, 49], "bg"), s("bgGreen", [42, 49], "bg"), s("bgYellow", [43, 49], "bg"), s("bgBlue", [44, 49], "bg"), s("bgMagenta", [45, 49], "bg"), s("bgCyan", [46, 49], "bg"), s("bgWhite", [47, 49], "bg"), s("blackBright", [90, 39], "bright"), s("redBright", [91, 39], "bright"), s("greenBright", [92, 39], "bright"), s("yellowBright", [93, 39], "bright"), s("blueBright", [94, 39], "bright"), s("magentaBright", [95, 39], "bright"), s("cyanBright", [96, 39], "bright"), s("whiteBright", [97, 39], "bright"), s("bgBlackBright", [100, 49], "bgBright"), s("bgRedBright", [101, 49], "bgBright"), s("bgGreenBright", [102, 49], "bgBright"), s("bgYellowBright", [103, 49], "bgBright"), s("bgBlueBright", [104, 49], "bgBright"), s("bgMagentaBright", [105, 49], "bgBright"), s("bgCyanBright", [106, 49], "bgBright"), s("bgWhiteBright", [107, 49], "bgBright"), e.ansiRegex = V_, e.hasColor = e.hasAnsi = (c) => (e.ansiRegex.lastIndex = 0, typeof c == "string" && c !== "" && e.ansiRegex.test(c)), e.alias = (c, p) => {
    let b = typeof p == "string" ? e[p] : p;
    if (typeof b != "function")
      throw new TypeError("Expected alias to be the name of an existing color (string) or a function");
    b.stack || (Reflect.defineProperty(b, "name", { value: c }), e.styles[c] = b, b.stack = [c]), Reflect.defineProperty(e, c, {
      configurable: !0,
      enumerable: !0,
      set(_) {
        e.alias(c, _);
      },
      get() {
        let _ = (y) => n(y, _.stack);
        return Reflect.setPrototypeOf(_, e), _.stack = this.stack ? this.stack.concat(b.stack) : b.stack, _;
      }
    });
  }, e.theme = (c) => {
    if (!B_(c))
      throw new TypeError("Expected theme to be an object");
    for (let p of Object.keys(c))
      e.alias(p, c[p]);
    return e;
  }, e.alias("unstyle", (c) => typeof c == "string" && c !== "" ? (e.ansiRegex.lastIndex = 0, c.replace(e.ansiRegex, "")) : ""), e.alias("noop", (c) => c), e.none = e.clear = e.noop, e.stripColor = e.unstyle, e.symbols = z_(), e.define = s, e;
};
pi.exports = Eu();
pi.exports.create = Eu;
var U_ = pi.exports;
const Nt = /* @__PURE__ */ hi(U_);
let Mo, Pu, Su, xu, Tu = !0;
typeof process < "u" && ({ FORCE_COLOR: Mo, NODE_DISABLE_COLORS: Pu, NO_COLOR: Su, TERM: xu } = process.env || {}, Tu = process.stdout && process.stdout.isTTY);
const ge = {
  enabled: !Pu && Su == null && xu !== "dumb" && (Mo != null && Mo !== "0" || Tu),
  // modifiers
  reset: Ne(0, 0),
  bold: Ne(1, 22),
  dim: Ne(2, 22),
  italic: Ne(3, 23),
  underline: Ne(4, 24),
  inverse: Ne(7, 27),
  hidden: Ne(8, 28),
  strikethrough: Ne(9, 29),
  // colors
  black: Ne(30, 39),
  red: Ne(31, 39),
  green: Ne(32, 39),
  yellow: Ne(33, 39),
  blue: Ne(34, 39),
  magenta: Ne(35, 39),
  cyan: Ne(36, 39),
  white: Ne(37, 39),
  gray: Ne(90, 39),
  grey: Ne(90, 39),
  // background colors
  bgBlack: Ne(40, 49),
  bgRed: Ne(41, 49),
  bgGreen: Ne(42, 49),
  bgYellow: Ne(43, 49),
  bgBlue: Ne(44, 49),
  bgMagenta: Ne(45, 49),
  bgCyan: Ne(46, 49),
  bgWhite: Ne(47, 49)
};
function Tc(e, t) {
  let a = 0, n, s = "", c = "";
  for (; a < e.length; a++)
    n = e[a], s += n.open, c += n.close, ~t.indexOf(n.close) && (t = t.replace(n.rgx, n.close + n.open));
  return s + t + c;
}
function q_(e, t) {
  let a = { has: e, keys: t };
  return a.reset = ge.reset.bind(a), a.bold = ge.bold.bind(a), a.dim = ge.dim.bind(a), a.italic = ge.italic.bind(a), a.underline = ge.underline.bind(a), a.inverse = ge.inverse.bind(a), a.hidden = ge.hidden.bind(a), a.strikethrough = ge.strikethrough.bind(a), a.black = ge.black.bind(a), a.red = ge.red.bind(a), a.green = ge.green.bind(a), a.yellow = ge.yellow.bind(a), a.blue = ge.blue.bind(a), a.magenta = ge.magenta.bind(a), a.cyan = ge.cyan.bind(a), a.white = ge.white.bind(a), a.gray = ge.gray.bind(a), a.grey = ge.grey.bind(a), a.bgBlack = ge.bgBlack.bind(a), a.bgRed = ge.bgRed.bind(a), a.bgGreen = ge.bgGreen.bind(a), a.bgYellow = ge.bgYellow.bind(a), a.bgBlue = ge.bgBlue.bind(a), a.bgMagenta = ge.bgMagenta.bind(a), a.bgCyan = ge.bgCyan.bind(a), a.bgWhite = ge.bgWhite.bind(a), a;
}
function Ne(e, t) {
  let a = {
    open: `\x1B[${e}m`,
    close: `\x1B[${t}m`,
    rgx: new RegExp(`\\x1b\\[${t}m`, "g")
  };
  return function(n) {
    return this !== void 0 && this.has !== void 0 ? (~this.has.indexOf(e) || (this.has.push(e), this.keys.push(a)), n === void 0 ? this : ge.enabled ? Tc(this.keys, n + "") : n + "") : n === void 0 ? q_([e], [a]) : ge.enabled ? Tc([a], n + "") : n + "";
  };
}
var H_ = Object.defineProperty, G_ = (e, t, a) => t in e ? H_(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, Ze = (e, t, a) => (G_(e, typeof t != "symbol" ? t + "" : t, a), a);
const Zt = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return Zt.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let Se = Zt;
Ze(Se, "isNode", typeof process < "u"), /**
* 是否在浏览器环境
*/
Ze(Se, "isInBrowser", typeof window < "u"), /**
* 浏览器路径分隔符
*/
Ze(Se, "BrowserSeperator", "/"), /**
* 是否是Electron环境
*/
Ze(Se, "isElectron", () => !Zt.isInBrowser || !window.navigator || !window.navigator.userAgent ? !1 : /Electron/.test(window.navigator.userAgent)), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
Ze(Se, "hasNodeEnv", () => Zt.isElectron() || Zt.isNode), /**
* 获取url参数
*
* @param sParam - 参数
*/
Ze(Se, "getQueryString", (e) => {
  if (!Zt.isInBrowser)
    return "";
  const t = window.location.search.substring(1).split("&");
  for (let a = 0; a < t.length; a++) {
    const n = t[a].split("=");
    if (n[0] === e)
      return n[1];
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
Ze(Se, "replaceUrlParam", (e, t, a) => {
  a == null && (a = "");
  const n = new RegExp("\\b(" + t + "=).*?(&|#|$)");
  if (e.search(n) >= 0)
    return e.replace(n, "$1" + a + "$2");
  const [s, c] = e.split("#"), [p, b] = s.split("?"), _ = new URLSearchParams(b);
  _.set(t, a);
  const y = _.toString(), g = p + (y ? "?" + y : "");
  return c ? g + "#" + c : g;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
Ze(Se, "setUrlParameter", (e, t, a) => {
  if (e.includes(t))
    return Zt.replaceUrlParam(e, t, a);
  const n = e.split("#");
  let s = n[0];
  const c = n[1];
  return s.includes("?") ? s += `&${t}=${a}` : s += `?${t}=${a}`, c && (s += "#" + c), s;
}), /**
* 重新加载指定tab
*
* @param tabname - tabname
* @param t - 延迟时间
*/
Ze(Se, "reloadTabPage", (e, t = 200) => {
  setTimeout(function() {
    if (Zt.isInBrowser) {
      const a = window.location.href;
      window.location.href = Zt.setUrlParameter(a, "tab", e);
    }
  }, t);
}), /**
* 刷新当前tab页面
*/
Ze(Se, "reloadPage", () => {
  setTimeout(function() {
    Zt.isInBrowser && window.location.reload();
  }, 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
*/
Ze(Se, "reloadPageWithMessageCallback", (e, t) => {
  t && t(e), setTimeout(function() {
    Zt.isInBrowser && window.location.reload();
  }, 200);
});
var ft = /* @__PURE__ */ ((e) => (e.BasePathType_Appearance = "Appearance", e.BasePathType_Data = "Data", e.BasePathType_Themes = "Themes", e.BasePathType_ZhiTheme = "ZhiTheme", e.BasePathType_None = "None", e))(ft || {});
const yt = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return Se.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : !1;
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
    let a = e;
    switch (t) {
      case ft.BasePathType_Appearance:
        a = this.browserJoinPath(this.siyuanAppearanceRelativePath(), e);
        break;
      case ft.BasePathType_Data:
        a = this.browserJoinPath(this.siyuanDataRelativePath(), e);
        break;
      case ft.BasePathType_Themes:
        a = this.browserJoinPath(this.siyuanThemeRelativePath(), e);
        break;
      case ft.BasePathType_ZhiTheme:
        a = this.browserJoinPath(this.zhiThemeRelativePath(), e);
        break;
      default:
        throw new Error("type must be provided");
    }
    const { default: n } = await import(
      /* @vite-ignore */
      a
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
  static async importZhiThemeJs(e) {
    return await this.importJs(e, ft.BasePathType_ZhiTheme);
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
    if (Se.hasNodeEnv()) {
      const t = this.requireLib("path");
      if (t)
        return t.join(...e);
    }
    return this.browserJoinPath(...e);
  }
  static browserJoinPath(...e) {
    return e.join(Se.BrowserSeperator);
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
    if (Se.hasNodeEnv())
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
let Ir = yt;
Ze(Ir, "isInSiyuanWidget", () => Se.isInBrowser ? window.frameElement != null && window.frameElement.parentElement != null && window.frameElement.parentElement.parentElement != null && window.frameElement.parentElement.parentElement.getAttribute("data-node-id") !== "" : !1), /**
* 思源笔记新窗口
*
* @deprecated window.terwer 判断方式已废弃，建议以后打开新窗口注入 window.siyuanNewWin ，这样语义会更容易理解
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
Ze(Ir, "isInSiyuanNewWin", () => !Se.isInBrowser || !Se.isElectron() ? !1 : typeof window.terwer < "u" || typeof window.siyuanNewWin < "u"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
Ze(Ir, "requireLib", (e, t = !0, a = ft.BasePathType_None) => {
  if (!Se.hasNodeEnv())
    throw new Error("require ony works on node env");
  let n = e;
  if (!t)
    switch (a) {
      case ft.BasePathType_Appearance:
        n = yt.joinPath(yt.siyuanAppearancePath(), e);
        break;
      case ft.BasePathType_Data:
        n = yt.joinPath(yt.siyuanDataPath(), e);
        break;
      case ft.BasePathType_Themes:
        n = yt.joinPath(yt.siyuanAppearancePath(), "themes", e);
        break;
      case ft.BasePathType_ZhiTheme:
        n = yt.joinPath(yt.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const s = yt.siyuanWindow();
  if (!s)
    return require(n);
  if (typeof s.require < "u")
    return s.require(n);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
Ze(Ir, "requireAppearanceLib", (e) => yt.requireLib(e, !1, ft.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
Ze(Ir, "requireDataLib", (e) => yt.requireLib(e, !1, ft.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
Ze(Ir, "requireThemesLib", (e) => yt.requireLib(e, !1, ft.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
Ze(Ir, "requireZhiThemeLib", (e) => yt.requireLib(e, !1, ft.BasePathType_ZhiTheme));
const Lt = {
  white: (e) => Se.isElectron() ? Nt.whiteBright(e) : ge.white(e),
  gray: (e) => Se.isElectron() ? Nt.gray(e) : ge.gray(e),
  blue: (e) => Se.isElectron() ? Nt.blue(e) : ge.blue(e),
  green: (e) => Se.isElectron() ? Nt.green(e) : ge.green(e),
  yellow: (e) => Se.isElectron() ? Nt.yellow(e) : ge.yellow(e),
  red: (e) => Se.isElectron() ? Nt.red(e) : ge.red(e),
  bgWhite: (e) => Se.isElectron() ? Nt.bgWhiteBright(e) : ge.bgWhite(e),
  bgGrey: (e) => Se.isElectron() ? Nt.bgCyanBright(e) : ge.bgCyan(e),
  bgBlue: (e) => Se.isElectron() ? Nt.bgBlueBright(e) : ge.bgBlue(e),
  bgGreen: (e) => Se.isElectron() ? Nt.bgGreenBright(e) : ge.bgGreen(e),
  bgYellow: (e) => Se.isElectron() ? Nt.bgYellowBright(e) : ge.bgYellow(e),
  bgRed: (e) => Se.isElectron() ? Nt.bgRedBright(e) : ge.bgRed(e)
};
class K_ {
  constructor(t, a, n) {
    oa(this, "consoleLogger", "console"), oa(this, "stackSize", 1), oa(this, "getLogger", (p) => {
      let b;
      if (p)
        b = p;
      else {
        const _ = this.getCallStack(), y = [], g = [];
        for (let S = 0; S < _.length; S++) {
          const L = _[S], A = L.getFileName() ?? "none";
          if (S > this.stackSize - 1)
            break;
          const N = A + "-" + L.getLineNumber() + ":" + L.getColumnNumber();
          y.push(N);
        }
        g.length > 0 && (b = y.join(" -> "));
      }
      return (!b || b.trim().length === 0) && (b = this.consoleLogger), gn.getLogger(b);
    }), this.stackSize = 1;
    let s;
    t ? s = t : s = Bn.getEnvLevel(n), s = s ?? ar.LOG_LEVEL_INFO, gn.setLevel(s);
    const c = (p, b, _, y) => {
      const g = [], S = a ?? Bn.getEnvLogger(n) ?? "zhi";
      return g.push(Lt.gray("[") + y(S) + Lt.gray("]")), g.push(Lt.gray("[") + Lt.gray(_.toString()) + Lt.gray("]")), g.push(y(p.toUpperCase().toString())), g.push(y(b)), g.push(Lt.gray(":")), g;
    };
    Pc.reg(gn), Pc.apply(gn, {
      format(p, b, _) {
        let y = [];
        const g = b ?? "";
        switch (p) {
          case ar.LOG_LEVEL_TRACE:
            y = c(p, g, _, Lt.gray);
            break;
          case ar.LOG_LEVEL_DEBUG:
            y = c(p, g, _, Lt.blue);
            break;
          case ar.LOG_LEVEL_INFO:
            y = c(p, g, _, Lt.green);
            break;
          case ar.LOG_LEVEL_WARN:
            y = c(p, g, _, Lt.yellow);
            break;
          case ar.LOG_LEVEL_ERROR:
            y = c(p, g, _, Lt.red);
            break;
          default:
            y = c(ar.LOG_LEVEL_INFO, g, _, Lt.green);
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
      t = D_();
    } catch {
      t = [];
    }
    return t;
  }
}
class W_ {
  /**
   * 默认日志级别
   *
   * @param level - 可选，未设置默认INFO
   * @param sign - 可选前缀，默认zhi
   * @param env - 可选环境变量实例
   */
  constructor(t, a, n) {
    oa(this, "logger"), this.logger = new K_(t, a, n);
  }
  /**
   * 获取日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   * @protected
   */
  getLogger(t, a) {
    return this.logger.setStackSize(a), this.logger.getLogger(t);
  }
}
class jc extends W_ {
  constructor(t, a, n) {
    super(t, a, n);
  }
  /**
   * 获取默认的日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   */
  getLogger(t, a) {
    return super.getLogger(t, a);
  }
}
class fi {
  /**
   * 默认日志记录器
   *
   * @param stackSize - 栈的深度
   * @param env - 环境变量实例
   */
  static defaultLogger(t, a) {
    return fi.customLogFactory(void 0, void 0, t).getLogger(void 0, a);
  }
  /**
   * 自定义日志工厂
   *
   * @param level - 级别
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customLogFactory(t, a, n) {
    return new jc(t, a, n);
  }
  /**
   * 自定义日志工厂，自定义前缀
   *
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customSignLogFactory(t, a) {
    return new jc(void 0, t, a);
  }
}
const J_ = "zhi";
class Ua {
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
  static zhiLogWithSign(t, a) {
    if (this.loggerMap[a])
      return this.loggerMap[a].debug("Zhi-log use cache"), this.loggerMap[a];
    const n = this.env, s = fi.customSignLogFactory(t, n).getLogger(a);
    return this.loggerMap[a] = s, s.debug("Zhi-log add new logger"), s;
  }
  /**
   * 获取 zhi-log 实例
   *
   * @param loggerName - 日志名称
   */
  static zhiLog(t) {
    return this.zhiLogWithSign(J_, t);
  }
  /**
   * 获取 zhi-common 实例
   */
  static zhiCommon() {
    return this.common || (this.common = new Ou()), this.common;
  }
}
Qe(Ua, "env"), /**
* zhi-util 的日志器缓存
*/
Qe(Ua, "loggerMap", {}), /**
* zhi-util 的通用工具类
*/
Qe(Ua, "common");
class mi extends Ua {
  static zhiEnv() {
    return this.env || (this.env = new L_({ BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 })), this.env;
  }
}
class Cc {
  constructor() {
    Qe(this, "logger"), this.logger = mi.zhiLog("lute-adaptor"), Lute ? this.logger.debug("Detected Lute is bundled, will use!") : this.logger.debug("Lute is not available!");
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
    const a = new RegExp("(?<=^|[\\s\\S])==([^\\n]+?)==(?=($|[\\s\\S]))", "g");
    return t.replace(a, '<span class="mark">$1</span>');
  }
  /**
   * 渲染Markdown
   *
   * @param md - Markdown
   */
  async renderMarkdownStr(t) {
    if (!this.isAvailable())
      return this.logger.error("Lute is not available, will return original md"), t;
    const a = Lute, n = a.New(), s = {
      renderText: (c, p) => p ? [this.highlightWords(c.Text()), a.WalkContinue] : ["", a.WalkContinue]
      // renderStrong: (node: any, entering: any) => {
      //     return ["", luteObj.WalkContinue]
      // },
      // renderParagraph: (node: any, entering: any) => {
      //     return ["", luteObj.WalkContinue]
      // }
    };
    return n.SetJSRenderers({
      renderers: {
        Md2HTML: s
      }
    }), this.logger.info("Lute is rendering md to HTML..."), n.MarkdownStr("", t);
  }
}
var ju = { exports: {} };
(function(e) {
  (function() {
    function t(r) {
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
      if (r === !1)
        return JSON.parse(JSON.stringify(i));
      var o = {};
      for (var l in i)
        i.hasOwnProperty(l) && (o[l] = i[l].defaultValue);
      return o;
    }
    function a() {
      var r = t(!0), i = {};
      for (var o in r)
        r.hasOwnProperty(o) && (i[o] = !0);
      return i;
    }
    var n = {}, s = {}, c = {}, p = t(!0), b = "vanilla", _ = {
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
      allOn: a()
    };
    n.helper = {}, n.extensions = {}, n.setOption = function(r, i) {
      return p[r] = i, this;
    }, n.getOption = function(r) {
      return p[r];
    }, n.getOptions = function() {
      return p;
    }, n.resetOptions = function() {
      p = t(!0);
    }, n.setFlavor = function(r) {
      if (!_.hasOwnProperty(r))
        throw Error(r + " flavor was not found");
      n.resetOptions();
      var i = _[r];
      b = r;
      for (var o in i)
        i.hasOwnProperty(o) && (p[o] = i[o]);
    }, n.getFlavor = function() {
      return b;
    }, n.getFlavorOptions = function(r) {
      if (_.hasOwnProperty(r))
        return _[r];
    }, n.getDefaultOptions = function(r) {
      return t(r);
    }, n.subParser = function(r, i) {
      if (n.helper.isString(r))
        if (typeof i < "u")
          s[r] = i;
        else {
          if (s.hasOwnProperty(r))
            return s[r];
          throw Error("SubParser named " + r + " not registered!");
        }
    }, n.extension = function(r, i) {
      if (!n.helper.isString(r))
        throw Error("Extension 'name' must be a string");
      if (r = n.helper.stdExtName(r), n.helper.isUndefined(i)) {
        if (!c.hasOwnProperty(r))
          throw Error("Extension named " + r + " is not registered!");
        return c[r];
      } else {
        typeof i == "function" && (i = i()), n.helper.isArray(i) || (i = [i]);
        var o = y(i, r);
        if (o.valid)
          c[r] = i;
        else
          throw Error(o.error);
      }
    }, n.getAllExtensions = function() {
      return c;
    }, n.removeExtension = function(r) {
      delete c[r];
    }, n.resetExtensions = function() {
      c = {};
    };
    function y(r, i) {
      var o = i ? "Error in " + i + " extension->" : "Error in unnamed extension", l = {
        valid: !0,
        error: ""
      };
      n.helper.isArray(r) || (r = [r]);
      for (var u = 0; u < r.length; ++u) {
        var m = o + " sub-extension " + u + ": ", f = r[u];
        if (typeof f != "object")
          return l.valid = !1, l.error = m + "must be an object, but " + typeof f + " given", l;
        if (!n.helper.isString(f.type))
          return l.valid = !1, l.error = m + 'property "type" must be a string, but ' + typeof f.type + " given", l;
        var x = f.type = f.type.toLowerCase();
        if (x === "language" && (x = f.type = "lang"), x === "html" && (x = f.type = "output"), x !== "lang" && x !== "output" && x !== "listener")
          return l.valid = !1, l.error = m + "type " + x + ' is not recognized. Valid values: "lang/language", "output/html" or "listener"', l;
        if (x === "listener") {
          if (n.helper.isUndefined(f.listeners))
            return l.valid = !1, l.error = m + '. Extensions of type "listener" must have a property called "listeners"', l;
        } else if (n.helper.isUndefined(f.filter) && n.helper.isUndefined(f.regex))
          return l.valid = !1, l.error = m + x + ' extensions must define either a "regex" property or a "filter" method', l;
        if (f.listeners) {
          if (typeof f.listeners != "object")
            return l.valid = !1, l.error = m + '"listeners" property must be an object but ' + typeof f.listeners + " given", l;
          for (var B in f.listeners)
            if (f.listeners.hasOwnProperty(B) && typeof f.listeners[B] != "function")
              return l.valid = !1, l.error = m + '"listeners" property must be an hash of [event name]: [callback]. listeners.' + B + " must be a function but " + typeof f.listeners[B] + " given", l;
        }
        if (f.filter) {
          if (typeof f.filter != "function")
            return l.valid = !1, l.error = m + '"filter" must be a function, but ' + typeof f.filter + " given", l;
        } else if (f.regex) {
          if (n.helper.isString(f.regex) && (f.regex = new RegExp(f.regex, "g")), !(f.regex instanceof RegExp))
            return l.valid = !1, l.error = m + '"regex" property must either be a string or a RegExp object, but ' + typeof f.regex + " given", l;
          if (n.helper.isUndefined(f.replace))
            return l.valid = !1, l.error = m + '"regex" extensions must implement a replace string or function', l;
        }
      }
      return l;
    }
    n.validateExtension = function(r) {
      var i = y(r, null);
      return i.valid ? !0 : (console.warn(i.error), !1);
    }, n.hasOwnProperty("helper") || (n.helper = {}), n.helper.isString = function(r) {
      return typeof r == "string" || r instanceof String;
    }, n.helper.isFunction = function(r) {
      var i = {};
      return r && i.toString.call(r) === "[object Function]";
    }, n.helper.isArray = function(r) {
      return Array.isArray(r);
    }, n.helper.isUndefined = function(r) {
      return typeof r > "u";
    }, n.helper.forEach = function(r, i) {
      if (n.helper.isUndefined(r))
        throw new Error("obj param is required");
      if (n.helper.isUndefined(i))
        throw new Error("callback param is required");
      if (!n.helper.isFunction(i))
        throw new Error("callback param must be a function/closure");
      if (typeof r.forEach == "function")
        r.forEach(i);
      else if (n.helper.isArray(r))
        for (var o = 0; o < r.length; o++)
          i(r[o], o, r);
      else if (typeof r == "object")
        for (var l in r)
          r.hasOwnProperty(l) && i(r[l], l, r);
      else
        throw new Error("obj does not seem to be an array or an iterable object");
    }, n.helper.stdExtName = function(r) {
      return r.replace(/[_?*+\/\\.^-]/g, "").replace(/\s/g, "").toLowerCase();
    };
    function g(r, i) {
      var o = i.charCodeAt(0);
      return "¨E" + o + "E";
    }
    n.helper.escapeCharactersCallback = g, n.helper.escapeCharacters = function(r, i, o) {
      var l = "([" + i.replace(/([\[\]\\])/g, "\\$1") + "])";
      o && (l = "\\\\" + l);
      var u = new RegExp(l, "g");
      return r = r.replace(u, g), r;
    }, n.helper.unescapeHTMLEntities = function(r) {
      return r.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    var S = function(r, i, o, l) {
      var u = l || "", m = u.indexOf("g") > -1, f = new RegExp(i + "|" + o, "g" + u.replace(/g/g, "")), x = new RegExp(i, u.replace(/g/g, "")), B = [], U, z, H, w, q;
      do
        for (U = 0; H = f.exec(r); )
          if (x.test(H[0]))
            U++ || (z = f.lastIndex, w = z - H[0].length);
          else if (U && !--U) {
            q = H.index + H[0].length;
            var W = {
              left: { start: w, end: z },
              match: { start: z, end: H.index },
              right: { start: H.index, end: q },
              wholeMatch: { start: w, end: q }
            };
            if (B.push(W), !m)
              return B;
          }
      while (U && (f.lastIndex = z));
      return B;
    };
    n.helper.matchRecursiveRegExp = function(r, i, o, l) {
      for (var u = S(r, i, o, l), m = [], f = 0; f < u.length; ++f)
        m.push([
          r.slice(u[f].wholeMatch.start, u[f].wholeMatch.end),
          r.slice(u[f].match.start, u[f].match.end),
          r.slice(u[f].left.start, u[f].left.end),
          r.slice(u[f].right.start, u[f].right.end)
        ]);
      return m;
    }, n.helper.replaceRecursiveRegExp = function(r, i, o, l, u) {
      if (!n.helper.isFunction(i)) {
        var m = i;
        i = function() {
          return m;
        };
      }
      var f = S(r, o, l, u), x = r, B = f.length;
      if (B > 0) {
        var U = [];
        f[0].wholeMatch.start !== 0 && U.push(r.slice(0, f[0].wholeMatch.start));
        for (var z = 0; z < B; ++z)
          U.push(
            i(
              r.slice(f[z].wholeMatch.start, f[z].wholeMatch.end),
              r.slice(f[z].match.start, f[z].match.end),
              r.slice(f[z].left.start, f[z].left.end),
              r.slice(f[z].right.start, f[z].right.end)
            )
          ), z < B - 1 && U.push(r.slice(f[z].wholeMatch.end, f[z + 1].wholeMatch.start));
        f[B - 1].wholeMatch.end < r.length && U.push(r.slice(f[B - 1].wholeMatch.end)), x = U.join("");
      }
      return x;
    }, n.helper.regexIndexOf = function(r, i, o) {
      if (!n.helper.isString(r))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      if (!(i instanceof RegExp))
        throw "InvalidArgumentError: second parameter of showdown.helper.regexIndexOf function must be an instance of RegExp";
      var l = r.substring(o || 0).search(i);
      return l >= 0 ? l + (o || 0) : l;
    }, n.helper.splitAtIndex = function(r, i) {
      if (!n.helper.isString(r))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      return [r.substring(0, i), r.substring(i)];
    }, n.helper.encodeEmailAddress = function(r) {
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
      return r = r.replace(/./g, function(o) {
        if (o === "@")
          o = i[Math.floor(Math.random() * 2)](o);
        else {
          var l = Math.random();
          o = l > 0.9 ? i[2](o) : l > 0.45 ? i[1](o) : i[0](o);
        }
        return o;
      }), r;
    }, n.helper.padEnd = function(r, i, o) {
      return i = i >> 0, o = String(o || " "), r.length > i ? String(r) : (i = i - r.length, i > o.length && (o += o.repeat(i / o.length)), String(r) + o.slice(0, i));
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
    }), n.helper.regexes = {
      asteriskDashAndColon: /([*_:~])/g
    }, n.helper.emojis = {
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
    }, n.Converter = function(r) {
      var i = {}, o = [], l = [], u = {}, m = b, f = {
        parsed: {},
        raw: "",
        format: ""
      };
      x();
      function x() {
        r = r || {};
        for (var w in p)
          p.hasOwnProperty(w) && (i[w] = p[w]);
        if (typeof r == "object")
          for (var q in r)
            r.hasOwnProperty(q) && (i[q] = r[q]);
        else
          throw Error("Converter expects the passed parameter to be an object, but " + typeof r + " was passed instead.");
        i.extensions && n.helper.forEach(i.extensions, B);
      }
      function B(w, q) {
        if (q = q || null, n.helper.isString(w))
          if (w = n.helper.stdExtName(w), q = w, n.extensions[w]) {
            console.warn("DEPRECATION WARNING: " + w + " is an old extension that uses a deprecated loading method.Please inform the developer that the extension should be updated!"), U(n.extensions[w], w);
            return;
          } else if (!n.helper.isUndefined(c[w]))
            w = c[w];
          else
            throw Error('Extension "' + w + '" could not be loaded. It was either not found or is not a valid extension.');
        typeof w == "function" && (w = w()), n.helper.isArray(w) || (w = [w]);
        var W = y(w, q);
        if (!W.valid)
          throw Error(W.error);
        for (var J = 0; J < w.length; ++J) {
          switch (w[J].type) {
            case "lang":
              o.push(w[J]);
              break;
            case "output":
              l.push(w[J]);
              break;
          }
          if (w[J].hasOwnProperty("listeners"))
            for (var V in w[J].listeners)
              w[J].listeners.hasOwnProperty(V) && z(V, w[J].listeners[V]);
        }
      }
      function U(w, q) {
        typeof w == "function" && (w = w(new n.Converter())), n.helper.isArray(w) || (w = [w]);
        var W = y(w, q);
        if (!W.valid)
          throw Error(W.error);
        for (var J = 0; J < w.length; ++J)
          switch (w[J].type) {
            case "lang":
              o.push(w[J]);
              break;
            case "output":
              l.push(w[J]);
              break;
            default:
              throw Error("Extension loader error: Type unrecognized!!!");
          }
      }
      function z(w, q) {
        if (!n.helper.isString(w))
          throw Error("Invalid argument in converter.listen() method: name must be a string, but " + typeof w + " given");
        if (typeof q != "function")
          throw Error("Invalid argument in converter.listen() method: callback must be a function, but " + typeof q + " given");
        u.hasOwnProperty(w) || (u[w] = []), u[w].push(q);
      }
      function H(w) {
        var q = w.match(/^\s*/)[0].length, W = new RegExp("^\\s{0," + q + "}", "gm");
        return w.replace(W, "");
      }
      this._dispatch = function(w, q, W, J) {
        if (u.hasOwnProperty(w))
          for (var V = 0; V < u[w].length; ++V) {
            var E = u[w][V](w, q, this, W, J);
            E && typeof E < "u" && (q = E);
          }
        return q;
      }, this.listen = function(w, q) {
        return z(w, q), this;
      }, this.makeHtml = function(w) {
        if (!w)
          return w;
        var q = {
          gHtmlBlocks: [],
          gHtmlMdBlocks: [],
          gHtmlSpans: [],
          gUrls: {},
          gTitles: {},
          gDimensions: {},
          gListLevel: 0,
          hashLinkCounts: {},
          langExtensions: o,
          outputModifiers: l,
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
`), w = w.replace(/\u00A0/g, "&nbsp;"), i.smartIndentationFix && (w = H(w)), w = `

` + w + `

`, w = n.subParser("detab")(w, i, q), w = w.replace(/^[ \t]+$/mg, ""), n.helper.forEach(o, function(W) {
          w = n.subParser("runExtension")(W, w, i, q);
        }), w = n.subParser("metadata")(w, i, q), w = n.subParser("hashPreCodeTags")(w, i, q), w = n.subParser("githubCodeBlocks")(w, i, q), w = n.subParser("hashHTMLBlocks")(w, i, q), w = n.subParser("hashCodeTags")(w, i, q), w = n.subParser("stripLinkDefinitions")(w, i, q), w = n.subParser("blockGamut")(w, i, q), w = n.subParser("unhashHTMLSpans")(w, i, q), w = n.subParser("unescapeSpecialChars")(w, i, q), w = w.replace(/¨D/g, "$$"), w = w.replace(/¨T/g, "¨"), w = n.subParser("completeHTMLDocument")(w, i, q), n.helper.forEach(l, function(W) {
          w = n.subParser("runExtension")(W, w, i, q);
        }), f = q.metadata, w;
      }, this.makeMarkdown = this.makeMd = function(w, q) {
        if (w = w.replace(/\r\n/g, `
`), w = w.replace(/\r/g, `
`), w = w.replace(/>[ \t]+</, ">¨NBSP;<"), !q)
          if (window && window.document)
            q = window.document;
          else
            throw new Error("HTMLParser is undefined. If in a webworker or nodejs environment, you need to provide a WHATWG DOM and HTML such as JSDOM");
        var W = q.createElement("div");
        W.innerHTML = w;
        var J = {
          preList: d(W)
        };
        O(W);
        for (var V = W.childNodes, E = "", F = 0; F < V.length; F++)
          E += n.subParser("makeMarkdown.node")(V[F], J);
        function O(k) {
          for (var R = 0; R < k.childNodes.length; ++R) {
            var G = k.childNodes[R];
            G.nodeType === 3 ? !/\S/.test(G.nodeValue) && !/^[ ]+$/.test(G.nodeValue) ? (k.removeChild(G), --R) : (G.nodeValue = G.nodeValue.split(`
`).join(" "), G.nodeValue = G.nodeValue.replace(/(\s)+/g, "$1")) : G.nodeType === 1 && O(G);
          }
        }
        function d(k) {
          for (var R = k.querySelectorAll("pre"), G = [], K = 0; K < R.length; ++K)
            if (R[K].childElementCount === 1 && R[K].firstChild.tagName.toLowerCase() === "code") {
              var X = R[K].firstChild.innerHTML.trim(), ee = R[K].firstChild.getAttribute("data-language") || "";
              if (ee === "")
                for (var ie = R[K].firstChild.className.split(" "), xe = 0; xe < ie.length; ++xe) {
                  var qe = ie[xe].match(/^language-(.+)$/);
                  if (qe !== null) {
                    ee = qe[1];
                    break;
                  }
                }
              X = n.helper.unescapeHTMLEntities(X), G.push(X), R[K].outerHTML = '<precode language="' + ee + '" precodenum="' + K.toString() + '"></precode>';
            } else
              G.push(R[K].innerHTML), R[K].innerHTML = "", R[K].setAttribute("prenum", K.toString());
          return G;
        }
        return E;
      }, this.setOption = function(w, q) {
        i[w] = q;
      }, this.getOption = function(w) {
        return i[w];
      }, this.getOptions = function() {
        return i;
      }, this.addExtension = function(w, q) {
        q = q || null, B(w, q);
      }, this.useExtension = function(w) {
        B(w);
      }, this.setFlavor = function(w) {
        if (!_.hasOwnProperty(w))
          throw Error(w + " flavor was not found");
        var q = _[w];
        m = w;
        for (var W in q)
          q.hasOwnProperty(W) && (i[W] = q[W]);
      }, this.getFlavor = function() {
        return m;
      }, this.removeExtension = function(w) {
        n.helper.isArray(w) || (w = [w]);
        for (var q = 0; q < w.length; ++q) {
          for (var W = w[q], J = 0; J < o.length; ++J)
            o[J] === W && o.splice(J, 1);
          for (var V = 0; V < l.length; ++V)
            l[V] === W && l.splice(V, 1);
        }
      }, this.getAllExtensions = function() {
        return {
          language: o,
          output: l
        };
      }, this.getMetadata = function(w) {
        return w ? f.raw : f.parsed;
      }, this.getMetadataFormat = function() {
        return f.format;
      }, this._setMetadataPair = function(w, q) {
        f.parsed[w] = q;
      }, this._setMetadataFormat = function(w) {
        f.format = w;
      }, this._setMetadataRaw = function(w) {
        f.raw = w;
      };
    }, n.subParser("anchors", function(r, i, o) {
      r = o.converter._dispatch("anchors.before", r, i, o);
      var l = function(u, m, f, x, B, U, z) {
        if (n.helper.isUndefined(z) && (z = ""), f = f.toLowerCase(), u.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          x = "";
        else if (!x)
          if (f || (f = m.toLowerCase().replace(/ ?\n/g, " ")), x = "#" + f, !n.helper.isUndefined(o.gUrls[f]))
            x = o.gUrls[f], n.helper.isUndefined(o.gTitles[f]) || (z = o.gTitles[f]);
          else
            return u;
        x = x.replace(n.helper.regexes.asteriskDashAndColon, n.helper.escapeCharactersCallback);
        var H = '<a href="' + x + '"';
        return z !== "" && z !== null && (z = z.replace(/"/g, "&quot;"), z = z.replace(n.helper.regexes.asteriskDashAndColon, n.helper.escapeCharactersCallback), H += ' title="' + z + '"'), i.openLinksInNewWindow && !/^#/.test(x) && (H += ' rel="noopener noreferrer" target="¨E95Eblank"'), H += ">" + m + "</a>", H;
      };
      return r = r.replace(/\[((?:\[[^\]]*]|[^\[\]])*)] ?(?:\n *)?\[(.*?)]()()()()/g, l), r = r.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<([^>]*)>(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        l
      ), r = r.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        l
      ), r = r.replace(/\[([^\[\]]+)]()()()()()/g, l), i.ghMentions && (r = r.replace(/(^|\s)(\\)?(@([a-z\d]+(?:[a-z\d.-]+?[a-z\d]+)*))/gmi, function(u, m, f, x, B) {
        if (f === "\\")
          return m + x;
        if (!n.helper.isString(i.ghMentionsLink))
          throw new Error("ghMentionsLink option must be a string");
        var U = i.ghMentionsLink.replace(/\{u}/g, B), z = "";
        return i.openLinksInNewWindow && (z = ' rel="noopener noreferrer" target="¨E95Eblank"'), m + '<a href="' + U + '"' + z + ">" + x + "</a>";
      })), r = o.converter._dispatch("anchors.after", r, i, o), r;
    });
    var L = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+?\.[^'">\s]+?)()(\1)?(?=\s|$)(?!["<>])/gi, A = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+?)([.!?,()\[\]])?(\1)?(?=\s|$)(?!["<>])/gi, N = /()<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)()>()/gi, C = /(^|\s)(?:mailto:)?([A-Za-z0-9!#$%&'*+-/=?^_`{|}~.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?=$|\s)/gmi, T = /<()(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi, v = function(r) {
      return function(i, o, l, u, m, f, x) {
        l = l.replace(n.helper.regexes.asteriskDashAndColon, n.helper.escapeCharactersCallback);
        var B = l, U = "", z = "", H = o || "", w = x || "";
        return /^www\./i.test(l) && (l = l.replace(/^www\./i, "http://www.")), r.excludeTrailingPunctuationFromURLs && f && (U = f), r.openLinksInNewWindow && (z = ' rel="noopener noreferrer" target="¨E95Eblank"'), H + '<a href="' + l + '"' + z + ">" + B + "</a>" + U + w;
      };
    }, j = function(r, i) {
      return function(o, l, u) {
        var m = "mailto:";
        return l = l || "", u = n.subParser("unescapeSpecialChars")(u, r, i), r.encodeEmails ? (m = n.helper.encodeEmailAddress(m + u), u = n.helper.encodeEmailAddress(u)) : m = m + u, l + '<a href="' + m + '">' + u + "</a>";
      };
    };
    n.subParser("autoLinks", function(r, i, o) {
      return r = o.converter._dispatch("autoLinks.before", r, i, o), r = r.replace(N, v(i)), r = r.replace(T, j(i, o)), r = o.converter._dispatch("autoLinks.after", r, i, o), r;
    }), n.subParser("simplifiedAutoLinks", function(r, i, o) {
      return i.simplifiedAutoLink && (r = o.converter._dispatch("simplifiedAutoLinks.before", r, i, o), i.excludeTrailingPunctuationFromURLs ? r = r.replace(A, v(i)) : r = r.replace(L, v(i)), r = r.replace(C, j(i, o)), r = o.converter._dispatch("simplifiedAutoLinks.after", r, i, o)), r;
    }), n.subParser("blockGamut", function(r, i, o) {
      return r = o.converter._dispatch("blockGamut.before", r, i, o), r = n.subParser("blockQuotes")(r, i, o), r = n.subParser("headers")(r, i, o), r = n.subParser("horizontalRule")(r, i, o), r = n.subParser("lists")(r, i, o), r = n.subParser("codeBlocks")(r, i, o), r = n.subParser("tables")(r, i, o), r = n.subParser("hashHTMLBlocks")(r, i, o), r = n.subParser("paragraphs")(r, i, o), r = o.converter._dispatch("blockGamut.after", r, i, o), r;
    }), n.subParser("blockQuotes", function(r, i, o) {
      r = o.converter._dispatch("blockQuotes.before", r, i, o), r = r + `

`;
      var l = /(^ {0,3}>[ \t]?.+\n(.+\n)*\n*)+/gm;
      return i.splitAdjacentBlockquotes && (l = /^ {0,3}>[\s\S]*?(?:\n\n)/gm), r = r.replace(l, function(u) {
        return u = u.replace(/^[ \t]*>[ \t]?/gm, ""), u = u.replace(/¨0/g, ""), u = u.replace(/^[ \t]+$/gm, ""), u = n.subParser("githubCodeBlocks")(u, i, o), u = n.subParser("blockGamut")(u, i, o), u = u.replace(/(^|\n)/g, "$1  "), u = u.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(m, f) {
          var x = f;
          return x = x.replace(/^  /mg, "¨0"), x = x.replace(/¨0/g, ""), x;
        }), n.subParser("hashBlock")(`<blockquote>
` + u + `
</blockquote>`, i, o);
      }), r = o.converter._dispatch("blockQuotes.after", r, i, o), r;
    }), n.subParser("codeBlocks", function(r, i, o) {
      r = o.converter._dispatch("codeBlocks.before", r, i, o), r += "¨0";
      var l = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=¨0))/g;
      return r = r.replace(l, function(u, m, f) {
        var x = m, B = f, U = `
`;
        return x = n.subParser("outdent")(x, i, o), x = n.subParser("encodeCode")(x, i, o), x = n.subParser("detab")(x, i, o), x = x.replace(/^\n+/g, ""), x = x.replace(/\n+$/g, ""), i.omitExtraWLInCodeBlocks && (U = ""), x = "<pre><code>" + x + U + "</code></pre>", n.subParser("hashBlock")(x, i, o) + B;
      }), r = r.replace(/¨0/, ""), r = o.converter._dispatch("codeBlocks.after", r, i, o), r;
    }), n.subParser("codeSpans", function(r, i, o) {
      return r = o.converter._dispatch("codeSpans.before", r, i, o), typeof r > "u" && (r = ""), r = r.replace(
        /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
        function(l, u, m, f) {
          var x = f;
          return x = x.replace(/^([ \t]*)/g, ""), x = x.replace(/[ \t]*$/g, ""), x = n.subParser("encodeCode")(x, i, o), x = u + "<code>" + x + "</code>", x = n.subParser("hashHTMLSpans")(x, i, o), x;
        }
      ), r = o.converter._dispatch("codeSpans.after", r, i, o), r;
    }), n.subParser("completeHTMLDocument", function(r, i, o) {
      if (!i.completeHTMLDocument)
        return r;
      r = o.converter._dispatch("completeHTMLDocument.before", r, i, o);
      var l = "html", u = `<!DOCTYPE HTML>
`, m = "", f = `<meta charset="utf-8">
`, x = "", B = "";
      typeof o.metadata.parsed.doctype < "u" && (u = "<!DOCTYPE " + o.metadata.parsed.doctype + `>
`, l = o.metadata.parsed.doctype.toString().toLowerCase(), (l === "html" || l === "html5") && (f = '<meta charset="utf-8">'));
      for (var U in o.metadata.parsed)
        if (o.metadata.parsed.hasOwnProperty(U))
          switch (U.toLowerCase()) {
            case "doctype":
              break;
            case "title":
              m = "<title>" + o.metadata.parsed.title + `</title>
`;
              break;
            case "charset":
              l === "html" || l === "html5" ? f = '<meta charset="' + o.metadata.parsed.charset + `">
` : f = '<meta name="charset" content="' + o.metadata.parsed.charset + `">
`;
              break;
            case "language":
            case "lang":
              x = ' lang="' + o.metadata.parsed[U] + '"', B += '<meta name="' + U + '" content="' + o.metadata.parsed[U] + `">
`;
              break;
            default:
              B += '<meta name="' + U + '" content="' + o.metadata.parsed[U] + `">
`;
          }
      return r = u + "<html" + x + `>
<head>
` + m + f + B + `</head>
<body>
` + r.trim() + `
</body>
</html>`, r = o.converter._dispatch("completeHTMLDocument.after", r, i, o), r;
    }), n.subParser("detab", function(r, i, o) {
      return r = o.converter._dispatch("detab.before", r, i, o), r = r.replace(/\t(?=\t)/g, "    "), r = r.replace(/\t/g, "¨A¨B"), r = r.replace(/¨B(.+?)¨A/g, function(l, u) {
        for (var m = u, f = 4 - m.length % 4, x = 0; x < f; x++)
          m += " ";
        return m;
      }), r = r.replace(/¨A/g, "    "), r = r.replace(/¨B/g, ""), r = o.converter._dispatch("detab.after", r, i, o), r;
    }), n.subParser("ellipsis", function(r, i, o) {
      return i.ellipsis && (r = o.converter._dispatch("ellipsis.before", r, i, o), r = r.replace(/\.\.\./g, "…"), r = o.converter._dispatch("ellipsis.after", r, i, o)), r;
    }), n.subParser("emoji", function(r, i, o) {
      if (!i.emoji)
        return r;
      r = o.converter._dispatch("emoji.before", r, i, o);
      var l = /:([\S]+?):/g;
      return r = r.replace(l, function(u, m) {
        return n.helper.emojis.hasOwnProperty(m) ? n.helper.emojis[m] : u;
      }), r = o.converter._dispatch("emoji.after", r, i, o), r;
    }), n.subParser("encodeAmpsAndAngles", function(r, i, o) {
      return r = o.converter._dispatch("encodeAmpsAndAngles.before", r, i, o), r = r.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;"), r = r.replace(/<(?![a-z\/?$!])/gi, "&lt;"), r = r.replace(/</g, "&lt;"), r = r.replace(/>/g, "&gt;"), r = o.converter._dispatch("encodeAmpsAndAngles.after", r, i, o), r;
    }), n.subParser("encodeBackslashEscapes", function(r, i, o) {
      return r = o.converter._dispatch("encodeBackslashEscapes.before", r, i, o), r = r.replace(/\\(\\)/g, n.helper.escapeCharactersCallback), r = r.replace(/\\([`*_{}\[\]()>#+.!~=|:-])/g, n.helper.escapeCharactersCallback), r = o.converter._dispatch("encodeBackslashEscapes.after", r, i, o), r;
    }), n.subParser("encodeCode", function(r, i, o) {
      return r = o.converter._dispatch("encodeCode.before", r, i, o), r = r.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/([*_{}\[\]\\=~-])/g, n.helper.escapeCharactersCallback), r = o.converter._dispatch("encodeCode.after", r, i, o), r;
    }), n.subParser("escapeSpecialCharsWithinTagAttributes", function(r, i, o) {
      r = o.converter._dispatch("escapeSpecialCharsWithinTagAttributes.before", r, i, o);
      var l = /<\/?[a-z\d_:-]+(?:[\s]+[\s\S]+?)?>/gi, u = /<!(--(?:(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>/gi;
      return r = r.replace(l, function(m) {
        return m.replace(/(.)<\/?code>(?=.)/g, "$1`").replace(/([\\`*_~=|])/g, n.helper.escapeCharactersCallback);
      }), r = r.replace(u, function(m) {
        return m.replace(/([\\`*_~=|])/g, n.helper.escapeCharactersCallback);
      }), r = o.converter._dispatch("escapeSpecialCharsWithinTagAttributes.after", r, i, o), r;
    }), n.subParser("githubCodeBlocks", function(r, i, o) {
      return i.ghCodeBlocks ? (r = o.converter._dispatch("githubCodeBlocks.before", r, i, o), r += "¨0", r = r.replace(/(?:^|\n)(?: {0,3})(```+|~~~+)(?: *)([^\s`~]*)\n([\s\S]*?)\n(?: {0,3})\1/g, function(l, u, m, f) {
        var x = i.omitExtraWLInCodeBlocks ? "" : `
`;
        return f = n.subParser("encodeCode")(f, i, o), f = n.subParser("detab")(f, i, o), f = f.replace(/^\n+/g, ""), f = f.replace(/\n+$/g, ""), f = "<pre><code" + (m ? ' class="' + m + " language-" + m + '"' : "") + ">" + f + x + "</code></pre>", f = n.subParser("hashBlock")(f, i, o), `

¨G` + (o.ghCodeBlocks.push({ text: l, codeblock: f }) - 1) + `G

`;
      }), r = r.replace(/¨0/, ""), o.converter._dispatch("githubCodeBlocks.after", r, i, o)) : r;
    }), n.subParser("hashBlock", function(r, i, o) {
      return r = o.converter._dispatch("hashBlock.before", r, i, o), r = r.replace(/(^\n+|\n+$)/g, ""), r = `

¨K` + (o.gHtmlBlocks.push(r) - 1) + `K

`, r = o.converter._dispatch("hashBlock.after", r, i, o), r;
    }), n.subParser("hashCodeTags", function(r, i, o) {
      r = o.converter._dispatch("hashCodeTags.before", r, i, o);
      var l = function(u, m, f, x) {
        var B = f + n.subParser("encodeCode")(m, i, o) + x;
        return "¨C" + (o.gHtmlSpans.push(B) - 1) + "C";
      };
      return r = n.helper.replaceRecursiveRegExp(r, l, "<code\\b[^>]*>", "</code>", "gim"), r = o.converter._dispatch("hashCodeTags.after", r, i, o), r;
    }), n.subParser("hashElement", function(r, i, o) {
      return function(l, u) {
        var m = u;
        return m = m.replace(/\n\n/g, `
`), m = m.replace(/^\n/, ""), m = m.replace(/\n+$/g, ""), m = `

¨K` + (o.gHtmlBlocks.push(m) - 1) + `K

`, m;
      };
    }), n.subParser("hashHTMLBlocks", function(r, i, o) {
      r = o.converter._dispatch("hashHTMLBlocks.before", r, i, o);
      var l = [
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
      ], u = function(w, q, W, J) {
        var V = w;
        return W.search(/\bmarkdown\b/) !== -1 && (V = W + o.converter.makeHtml(q) + J), `

¨K` + (o.gHtmlBlocks.push(V) - 1) + `K

`;
      };
      i.backslashEscapesHTMLTags && (r = r.replace(/\\<(\/?[^>]+?)>/g, function(w, q) {
        return "&lt;" + q + "&gt;";
      }));
      for (var m = 0; m < l.length; ++m)
        for (var f, x = new RegExp("^ {0,3}(<" + l[m] + "\\b[^>]*>)", "im"), B = "<" + l[m] + "\\b[^>]*>", U = "</" + l[m] + ">"; (f = n.helper.regexIndexOf(r, x)) !== -1; ) {
          var z = n.helper.splitAtIndex(r, f), H = n.helper.replaceRecursiveRegExp(z[1], u, B, U, "im");
          if (H === z[1])
            break;
          r = z[0].concat(H);
        }
      return r = r.replace(
        /(\n {0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
        n.subParser("hashElement")(r, i, o)
      ), r = n.helper.replaceRecursiveRegExp(r, function(w) {
        return `

¨K` + (o.gHtmlBlocks.push(w) - 1) + `K

`;
      }, "^ {0,3}<!--", "-->", "gm"), r = r.replace(
        /(?:\n\n)( {0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
        n.subParser("hashElement")(r, i, o)
      ), r = o.converter._dispatch("hashHTMLBlocks.after", r, i, o), r;
    }), n.subParser("hashHTMLSpans", function(r, i, o) {
      r = o.converter._dispatch("hashHTMLSpans.before", r, i, o);
      function l(u) {
        return "¨C" + (o.gHtmlSpans.push(u) - 1) + "C";
      }
      return r = r.replace(/<[^>]+?\/>/gi, function(u) {
        return l(u);
      }), r = r.replace(/<([^>]+?)>[\s\S]*?<\/\1>/g, function(u) {
        return l(u);
      }), r = r.replace(/<([^>]+?)\s[^>]+?>[\s\S]*?<\/\1>/g, function(u) {
        return l(u);
      }), r = r.replace(/<[^>]+?>/gi, function(u) {
        return l(u);
      }), r = o.converter._dispatch("hashHTMLSpans.after", r, i, o), r;
    }), n.subParser("unhashHTMLSpans", function(r, i, o) {
      r = o.converter._dispatch("unhashHTMLSpans.before", r, i, o);
      for (var l = 0; l < o.gHtmlSpans.length; ++l) {
        for (var u = o.gHtmlSpans[l], m = 0; /¨C(\d+)C/.test(u); ) {
          var f = RegExp.$1;
          if (u = u.replace("¨C" + f + "C", o.gHtmlSpans[f]), m === 10) {
            console.error("maximum nesting of 10 spans reached!!!");
            break;
          }
          ++m;
        }
        r = r.replace("¨C" + l + "C", u);
      }
      return r = o.converter._dispatch("unhashHTMLSpans.after", r, i, o), r;
    }), n.subParser("hashPreCodeTags", function(r, i, o) {
      r = o.converter._dispatch("hashPreCodeTags.before", r, i, o);
      var l = function(u, m, f, x) {
        var B = f + n.subParser("encodeCode")(m, i, o) + x;
        return `

¨G` + (o.ghCodeBlocks.push({ text: u, codeblock: B }) - 1) + `G

`;
      };
      return r = n.helper.replaceRecursiveRegExp(r, l, "^ {0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>", "^ {0,3}</code>\\s*</pre>", "gim"), r = o.converter._dispatch("hashPreCodeTags.after", r, i, o), r;
    }), n.subParser("headers", function(r, i, o) {
      r = o.converter._dispatch("headers.before", r, i, o);
      var l = isNaN(parseInt(i.headerLevelStart)) ? 1 : parseInt(i.headerLevelStart), u = i.smoothLivePreview ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm, m = i.smoothLivePreview ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;
      r = r.replace(u, function(B, U) {
        var z = n.subParser("spanGamut")(U, i, o), H = i.noHeaderId ? "" : ' id="' + x(U) + '"', w = l, q = "<h" + w + H + ">" + z + "</h" + w + ">";
        return n.subParser("hashBlock")(q, i, o);
      }), r = r.replace(m, function(B, U) {
        var z = n.subParser("spanGamut")(U, i, o), H = i.noHeaderId ? "" : ' id="' + x(U) + '"', w = l + 1, q = "<h" + w + H + ">" + z + "</h" + w + ">";
        return n.subParser("hashBlock")(q, i, o);
      });
      var f = i.requireSpaceBeforeHeadingText ? /^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm : /^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm;
      r = r.replace(f, function(B, U, z) {
        var H = z;
        i.customizedHeaderId && (H = z.replace(/\s?\{([^{]+?)}\s*$/, ""));
        var w = n.subParser("spanGamut")(H, i, o), q = i.noHeaderId ? "" : ' id="' + x(z) + '"', W = l - 1 + U.length, J = "<h" + W + q + ">" + w + "</h" + W + ">";
        return n.subParser("hashBlock")(J, i, o);
      });
      function x(B) {
        var U, z;
        if (i.customizedHeaderId) {
          var H = B.match(/\{([^{]+?)}\s*$/);
          H && H[1] && (B = H[1]);
        }
        return U = B, n.helper.isString(i.prefixHeaderId) ? z = i.prefixHeaderId : i.prefixHeaderId === !0 ? z = "section-" : z = "", i.rawPrefixHeaderId || (U = z + U), i.ghCompatibleHeaderId ? U = U.replace(/ /g, "-").replace(/&amp;/g, "").replace(/¨T/g, "").replace(/¨D/g, "").replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g, "").toLowerCase() : i.rawHeaderId ? U = U.replace(/ /g, "-").replace(/&amp;/g, "&").replace(/¨T/g, "¨").replace(/¨D/g, "$").replace(/["']/g, "-").toLowerCase() : U = U.replace(/[^\w]/g, "").toLowerCase(), i.rawPrefixHeaderId && (U = z + U), o.hashLinkCounts[U] ? U = U + "-" + o.hashLinkCounts[U]++ : o.hashLinkCounts[U] = 1, U;
      }
      return r = o.converter._dispatch("headers.after", r, i, o), r;
    }), n.subParser("horizontalRule", function(r, i, o) {
      r = o.converter._dispatch("horizontalRule.before", r, i, o);
      var l = n.subParser("hashBlock")("<hr />", i, o);
      return r = r.replace(/^ {0,2}( ?-){3,}[ \t]*$/gm, l), r = r.replace(/^ {0,2}( ?\*){3,}[ \t]*$/gm, l), r = r.replace(/^ {0,2}( ?_){3,}[ \t]*$/gm, l), r = o.converter._dispatch("horizontalRule.after", r, i, o), r;
    }), n.subParser("images", function(r, i, o) {
      r = o.converter._dispatch("images.before", r, i, o);
      var l = /!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, u = /!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)/g, m = /!\[([^\]]*?)][ \t]*()\([ \t]?<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, f = /!\[([^\]]*?)] ?(?:\n *)?\[([\s\S]*?)]()()()()()/g, x = /!\[([^\[\]]+)]()()()()()/g;
      function B(z, H, w, q, W, J, V, E) {
        return q = q.replace(/\s/g, ""), U(z, H, w, q, W, J, V, E);
      }
      function U(z, H, w, q, W, J, V, E) {
        var F = o.gUrls, O = o.gTitles, d = o.gDimensions;
        if (w = w.toLowerCase(), E || (E = ""), z.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          q = "";
        else if (q === "" || q === null)
          if ((w === "" || w === null) && (w = H.toLowerCase().replace(/ ?\n/g, " ")), q = "#" + w, !n.helper.isUndefined(F[w]))
            q = F[w], n.helper.isUndefined(O[w]) || (E = O[w]), n.helper.isUndefined(d[w]) || (W = d[w].width, J = d[w].height);
          else
            return z;
        H = H.replace(/"/g, "&quot;").replace(n.helper.regexes.asteriskDashAndColon, n.helper.escapeCharactersCallback), q = q.replace(n.helper.regexes.asteriskDashAndColon, n.helper.escapeCharactersCallback);
        var k = '<img src="' + q + '" alt="' + H + '"';
        return E && n.helper.isString(E) && (E = E.replace(/"/g, "&quot;").replace(n.helper.regexes.asteriskDashAndColon, n.helper.escapeCharactersCallback), k += ' title="' + E + '"'), W && J && (W = W === "*" ? "auto" : W, J = J === "*" ? "auto" : J, k += ' width="' + W + '"', k += ' height="' + J + '"'), k += " />", k;
      }
      return r = r.replace(f, U), r = r.replace(m, B), r = r.replace(u, U), r = r.replace(l, U), r = r.replace(x, U), r = o.converter._dispatch("images.after", r, i, o), r;
    }), n.subParser("italicsAndBold", function(r, i, o) {
      r = o.converter._dispatch("italicsAndBold.before", r, i, o);
      function l(u, m, f) {
        return m + u + f;
      }
      return i.literalMidWordUnderscores ? (r = r.replace(/\b___(\S[\s\S]*?)___\b/g, function(u, m) {
        return l(m, "<strong><em>", "</em></strong>");
      }), r = r.replace(/\b__(\S[\s\S]*?)__\b/g, function(u, m) {
        return l(m, "<strong>", "</strong>");
      }), r = r.replace(/\b_(\S[\s\S]*?)_\b/g, function(u, m) {
        return l(m, "<em>", "</em>");
      })) : (r = r.replace(/___(\S[\s\S]*?)___/g, function(u, m) {
        return /\S$/.test(m) ? l(m, "<strong><em>", "</em></strong>") : u;
      }), r = r.replace(/__(\S[\s\S]*?)__/g, function(u, m) {
        return /\S$/.test(m) ? l(m, "<strong>", "</strong>") : u;
      }), r = r.replace(/_([^\s_][\s\S]*?)_/g, function(u, m) {
        return /\S$/.test(m) ? l(m, "<em>", "</em>") : u;
      })), i.literalMidWordAsterisks ? (r = r.replace(/([^*]|^)\B\*\*\*(\S[\s\S]*?)\*\*\*\B(?!\*)/g, function(u, m, f) {
        return l(f, m + "<strong><em>", "</em></strong>");
      }), r = r.replace(/([^*]|^)\B\*\*(\S[\s\S]*?)\*\*\B(?!\*)/g, function(u, m, f) {
        return l(f, m + "<strong>", "</strong>");
      }), r = r.replace(/([^*]|^)\B\*(\S[\s\S]*?)\*\B(?!\*)/g, function(u, m, f) {
        return l(f, m + "<em>", "</em>");
      })) : (r = r.replace(/\*\*\*(\S[\s\S]*?)\*\*\*/g, function(u, m) {
        return /\S$/.test(m) ? l(m, "<strong><em>", "</em></strong>") : u;
      }), r = r.replace(/\*\*(\S[\s\S]*?)\*\*/g, function(u, m) {
        return /\S$/.test(m) ? l(m, "<strong>", "</strong>") : u;
      }), r = r.replace(/\*([^\s*][\s\S]*?)\*/g, function(u, m) {
        return /\S$/.test(m) ? l(m, "<em>", "</em>") : u;
      })), r = o.converter._dispatch("italicsAndBold.after", r, i, o), r;
    }), n.subParser("lists", function(r, i, o) {
      function l(f, x) {
        o.gListLevel++, f = f.replace(/\n{2,}$/, `
`), f += "¨0";
        var B = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0| {0,3}([*+-]|\d+[.])[ \t]+))/gm, U = /\n[ \t]*\n(?!¨0)/.test(f);
        return i.disableForced4SpacesIndentedSublists && (B = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0|\2([*+-]|\d+[.])[ \t]+))/gm), f = f.replace(B, function(z, H, w, q, W, J, V) {
          V = V && V.trim() !== "";
          var E = n.subParser("outdent")(W, i, o), F = "";
          return J && i.tasklists && (F = ' class="task-list-item" style="list-style-type: none;"', E = E.replace(/^[ \t]*\[(x|X| )?]/m, function() {
            var O = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
            return V && (O += " checked"), O += ">", O;
          })), E = E.replace(/^([-*+]|\d\.)[ \t]+[\S\n ]*/g, function(O) {
            return "¨A" + O;
          }), H || E.search(/\n{2,}/) > -1 ? (E = n.subParser("githubCodeBlocks")(E, i, o), E = n.subParser("blockGamut")(E, i, o)) : (E = n.subParser("lists")(E, i, o), E = E.replace(/\n$/, ""), E = n.subParser("hashHTMLBlocks")(E, i, o), E = E.replace(/\n\n+/g, `

`), U ? E = n.subParser("paragraphs")(E, i, o) : E = n.subParser("spanGamut")(E, i, o)), E = E.replace("¨A", ""), E = "<li" + F + ">" + E + `</li>
`, E;
        }), f = f.replace(/¨0/g, ""), o.gListLevel--, x && (f = f.replace(/\s+$/, "")), f;
      }
      function u(f, x) {
        if (x === "ol") {
          var B = f.match(/^ *(\d+)\./);
          if (B && B[1] !== "1")
            return ' start="' + B[1] + '"';
        }
        return "";
      }
      function m(f, x, B) {
        var U = i.disableForced4SpacesIndentedSublists ? /^ ?\d+\.[ \t]/gm : /^ {0,3}\d+\.[ \t]/gm, z = i.disableForced4SpacesIndentedSublists ? /^ ?[*+-][ \t]/gm : /^ {0,3}[*+-][ \t]/gm, H = x === "ul" ? U : z, w = "";
        if (f.search(H) !== -1)
          (function W(J) {
            var V = J.search(H), E = u(f, x);
            V !== -1 ? (w += `

<` + x + E + `>
` + l(J.slice(0, V), !!B) + "</" + x + `>
`, x = x === "ul" ? "ol" : "ul", H = x === "ul" ? U : z, W(J.slice(V))) : w += `

<` + x + E + `>
` + l(J, !!B) + "</" + x + `>
`;
          })(f);
        else {
          var q = u(f, x);
          w = `

<` + x + q + `>
` + l(f, !!B) + "</" + x + `>
`;
        }
        return w;
      }
      return r = o.converter._dispatch("lists.before", r, i, o), r += "¨0", o.gListLevel ? r = r.replace(
        /^(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(f, x, B) {
          var U = B.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return m(x, U, !0);
        }
      ) : r = r.replace(
        /(\n\n|^\n?)(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(f, x, B, U) {
          var z = U.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return m(B, z, !1);
        }
      ), r = r.replace(/¨0/, ""), r = o.converter._dispatch("lists.after", r, i, o), r;
    }), n.subParser("metadata", function(r, i, o) {
      if (!i.metadata)
        return r;
      r = o.converter._dispatch("metadata.before", r, i, o);
      function l(u) {
        o.metadata.raw = u, u = u.replace(/&/g, "&amp;").replace(/"/g, "&quot;"), u = u.replace(/\n {4}/g, " "), u.replace(/^([\S ]+): +([\s\S]+?)$/gm, function(m, f, x) {
          return o.metadata.parsed[f] = x, "";
        });
      }
      return r = r.replace(/^\s*«««+(\S*?)\n([\s\S]+?)\n»»»+\n/, function(u, m, f) {
        return l(f), "¨M";
      }), r = r.replace(/^\s*---+(\S*?)\n([\s\S]+?)\n---+\n/, function(u, m, f) {
        return m && (o.metadata.format = m), l(f), "¨M";
      }), r = r.replace(/¨M/g, ""), r = o.converter._dispatch("metadata.after", r, i, o), r;
    }), n.subParser("outdent", function(r, i, o) {
      return r = o.converter._dispatch("outdent.before", r, i, o), r = r.replace(/^(\t|[ ]{1,4})/gm, "¨0"), r = r.replace(/¨0/g, ""), r = o.converter._dispatch("outdent.after", r, i, o), r;
    }), n.subParser("paragraphs", function(r, i, o) {
      r = o.converter._dispatch("paragraphs.before", r, i, o), r = r.replace(/^\n+/g, ""), r = r.replace(/\n+$/g, "");
      for (var l = r.split(/\n{2,}/g), u = [], m = l.length, f = 0; f < m; f++) {
        var x = l[f];
        x.search(/¨(K|G)(\d+)\1/g) >= 0 ? u.push(x) : x.search(/\S/) >= 0 && (x = n.subParser("spanGamut")(x, i, o), x = x.replace(/^([ \t]*)/g, "<p>"), x += "</p>", u.push(x));
      }
      for (m = u.length, f = 0; f < m; f++) {
        for (var B = "", U = u[f], z = !1; /¨(K|G)(\d+)\1/.test(U); ) {
          var H = RegExp.$1, w = RegExp.$2;
          H === "K" ? B = o.gHtmlBlocks[w] : z ? B = n.subParser("encodeCode")(o.ghCodeBlocks[w].text, i, o) : B = o.ghCodeBlocks[w].codeblock, B = B.replace(/\$/g, "$$$$"), U = U.replace(/(\n\n)?¨(K|G)\d+\2(\n\n)?/, B), /^<pre\b[^>]*>\s*<code\b[^>]*>/.test(U) && (z = !0);
        }
        u[f] = U;
      }
      return r = u.join(`
`), r = r.replace(/^\n+/g, ""), r = r.replace(/\n+$/g, ""), o.converter._dispatch("paragraphs.after", r, i, o);
    }), n.subParser("runExtension", function(r, i, o, l) {
      if (r.filter)
        i = r.filter(i, l.converter, o);
      else if (r.regex) {
        var u = r.regex;
        u instanceof RegExp || (u = new RegExp(u, "g")), i = i.replace(u, r.replace);
      }
      return i;
    }), n.subParser("spanGamut", function(r, i, o) {
      return r = o.converter._dispatch("spanGamut.before", r, i, o), r = n.subParser("codeSpans")(r, i, o), r = n.subParser("escapeSpecialCharsWithinTagAttributes")(r, i, o), r = n.subParser("encodeBackslashEscapes")(r, i, o), r = n.subParser("images")(r, i, o), r = n.subParser("anchors")(r, i, o), r = n.subParser("autoLinks")(r, i, o), r = n.subParser("simplifiedAutoLinks")(r, i, o), r = n.subParser("emoji")(r, i, o), r = n.subParser("underline")(r, i, o), r = n.subParser("italicsAndBold")(r, i, o), r = n.subParser("strikethrough")(r, i, o), r = n.subParser("ellipsis")(r, i, o), r = n.subParser("hashHTMLSpans")(r, i, o), r = n.subParser("encodeAmpsAndAngles")(r, i, o), i.simpleLineBreaks ? /\n\n¨K/.test(r) || (r = r.replace(/\n+/g, `<br />
`)) : r = r.replace(/  +\n/g, `<br />
`), r = o.converter._dispatch("spanGamut.after", r, i, o), r;
    }), n.subParser("strikethrough", function(r, i, o) {
      function l(u) {
        return i.simplifiedAutoLink && (u = n.subParser("simplifiedAutoLinks")(u, i, o)), "<del>" + u + "</del>";
      }
      return i.strikethrough && (r = o.converter._dispatch("strikethrough.before", r, i, o), r = r.replace(/(?:~){2}([\s\S]+?)(?:~){2}/g, function(u, m) {
        return l(m);
      }), r = o.converter._dispatch("strikethrough.after", r, i, o)), r;
    }), n.subParser("stripLinkDefinitions", function(r, i, o) {
      var l = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?([^>\s]+)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=¨0))/gm, u = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n\n|(?=¨0)|(?=\n\[))/gm;
      r += "¨0";
      var m = function(f, x, B, U, z, H, w) {
        return x = x.toLowerCase(), r.toLowerCase().split(x).length - 1 < 2 ? f : (B.match(/^data:.+?\/.+?;base64,/) ? o.gUrls[x] = B.replace(/\s/g, "") : o.gUrls[x] = n.subParser("encodeAmpsAndAngles")(B, i, o), H ? H + w : (w && (o.gTitles[x] = w.replace(/"|'/g, "&quot;")), i.parseImgDimensions && U && z && (o.gDimensions[x] = {
          width: U,
          height: z
        }), ""));
      };
      return r = r.replace(u, m), r = r.replace(l, m), r = r.replace(/¨0/, ""), r;
    }), n.subParser("tables", function(r, i, o) {
      if (!i.tables)
        return r;
      var l = /^ {0,3}\|?.+\|.+\n {0,3}\|?[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:[-=]){2,}[\s\S]+?(?:\n\n|¨0)/gm, u = /^ {0,3}\|.+\|[ \t]*\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n( {0,3}\|.+\|[ \t]*\n)*(?:\n|¨0)/gm;
      function m(z) {
        return /^:[ \t]*--*$/.test(z) ? ' style="text-align:left;"' : /^--*[ \t]*:[ \t]*$/.test(z) ? ' style="text-align:right;"' : /^:[ \t]*--*[ \t]*:$/.test(z) ? ' style="text-align:center;"' : "";
      }
      function f(z, H) {
        var w = "";
        return z = z.trim(), (i.tablesHeaderId || i.tableHeaderId) && (w = ' id="' + z.replace(/ /g, "_").toLowerCase() + '"'), z = n.subParser("spanGamut")(z, i, o), "<th" + w + H + ">" + z + `</th>
`;
      }
      function x(z, H) {
        var w = n.subParser("spanGamut")(z, i, o);
        return "<td" + H + ">" + w + `</td>
`;
      }
      function B(z, H) {
        for (var w = `<table>
<thead>
<tr>
`, q = z.length, W = 0; W < q; ++W)
          w += z[W];
        for (w += `</tr>
</thead>
<tbody>
`, W = 0; W < H.length; ++W) {
          w += `<tr>
`;
          for (var J = 0; J < q; ++J)
            w += H[W][J];
          w += `</tr>
`;
        }
        return w += `</tbody>
</table>
`, w;
      }
      function U(z) {
        var H, w = z.split(`
`);
        for (H = 0; H < w.length; ++H)
          /^ {0,3}\|/.test(w[H]) && (w[H] = w[H].replace(/^ {0,3}\|/, "")), /\|[ \t]*$/.test(w[H]) && (w[H] = w[H].replace(/\|[ \t]*$/, "")), w[H] = n.subParser("codeSpans")(w[H], i, o);
        var q = w[0].split("|").map(function(k) {
          return k.trim();
        }), W = w[1].split("|").map(function(k) {
          return k.trim();
        }), J = [], V = [], E = [], F = [];
        for (w.shift(), w.shift(), H = 0; H < w.length; ++H)
          w[H].trim() !== "" && J.push(
            w[H].split("|").map(function(k) {
              return k.trim();
            })
          );
        if (q.length < W.length)
          return z;
        for (H = 0; H < W.length; ++H)
          E.push(m(W[H]));
        for (H = 0; H < q.length; ++H)
          n.helper.isUndefined(E[H]) && (E[H] = ""), V.push(f(q[H], E[H]));
        for (H = 0; H < J.length; ++H) {
          for (var O = [], d = 0; d < V.length; ++d)
            n.helper.isUndefined(J[H][d]), O.push(x(J[H][d], E[d]));
          F.push(O);
        }
        return B(V, F);
      }
      return r = o.converter._dispatch("tables.before", r, i, o), r = r.replace(/\\(\|)/g, n.helper.escapeCharactersCallback), r = r.replace(l, U), r = r.replace(u, U), r = o.converter._dispatch("tables.after", r, i, o), r;
    }), n.subParser("underline", function(r, i, o) {
      return i.underline && (r = o.converter._dispatch("underline.before", r, i, o), i.literalMidWordUnderscores ? (r = r.replace(/\b___(\S[\s\S]*?)___\b/g, function(l, u) {
        return "<u>" + u + "</u>";
      }), r = r.replace(/\b__(\S[\s\S]*?)__\b/g, function(l, u) {
        return "<u>" + u + "</u>";
      })) : (r = r.replace(/___(\S[\s\S]*?)___/g, function(l, u) {
        return /\S$/.test(u) ? "<u>" + u + "</u>" : l;
      }), r = r.replace(/__(\S[\s\S]*?)__/g, function(l, u) {
        return /\S$/.test(u) ? "<u>" + u + "</u>" : l;
      })), r = r.replace(/(_)/g, n.helper.escapeCharactersCallback), r = o.converter._dispatch("underline.after", r, i, o)), r;
    }), n.subParser("unescapeSpecialChars", function(r, i, o) {
      return r = o.converter._dispatch("unescapeSpecialChars.before", r, i, o), r = r.replace(/¨E(\d+)E/g, function(l, u) {
        var m = parseInt(u);
        return String.fromCharCode(m);
      }), r = o.converter._dispatch("unescapeSpecialChars.after", r, i, o), r;
    }), n.subParser("makeMarkdown.blockquote", function(r, i) {
      var o = "";
      if (r.hasChildNodes())
        for (var l = r.childNodes, u = l.length, m = 0; m < u; ++m) {
          var f = n.subParser("makeMarkdown.node")(l[m], i);
          f !== "" && (o += f);
        }
      return o = o.trim(), o = "> " + o.split(`
`).join(`
> `), o;
    }), n.subParser("makeMarkdown.codeBlock", function(r, i) {
      var o = r.getAttribute("language"), l = r.getAttribute("precodenum");
      return "```" + o + `
` + i.preList[l] + "\n```";
    }), n.subParser("makeMarkdown.codeSpan", function(r) {
      return "`" + r.innerHTML + "`";
    }), n.subParser("makeMarkdown.emphasis", function(r, i) {
      var o = "";
      if (r.hasChildNodes()) {
        o += "*";
        for (var l = r.childNodes, u = l.length, m = 0; m < u; ++m)
          o += n.subParser("makeMarkdown.node")(l[m], i);
        o += "*";
      }
      return o;
    }), n.subParser("makeMarkdown.header", function(r, i, o) {
      var l = new Array(o + 1).join("#"), u = "";
      if (r.hasChildNodes()) {
        u = l + " ";
        for (var m = r.childNodes, f = m.length, x = 0; x < f; ++x)
          u += n.subParser("makeMarkdown.node")(m[x], i);
      }
      return u;
    }), n.subParser("makeMarkdown.hr", function() {
      return "---";
    }), n.subParser("makeMarkdown.image", function(r) {
      var i = "";
      return r.hasAttribute("src") && (i += "![" + r.getAttribute("alt") + "](", i += "<" + r.getAttribute("src") + ">", r.hasAttribute("width") && r.hasAttribute("height") && (i += " =" + r.getAttribute("width") + "x" + r.getAttribute("height")), r.hasAttribute("title") && (i += ' "' + r.getAttribute("title") + '"'), i += ")"), i;
    }), n.subParser("makeMarkdown.links", function(r, i) {
      var o = "";
      if (r.hasChildNodes() && r.hasAttribute("href")) {
        var l = r.childNodes, u = l.length;
        o = "[";
        for (var m = 0; m < u; ++m)
          o += n.subParser("makeMarkdown.node")(l[m], i);
        o += "](", o += "<" + r.getAttribute("href") + ">", r.hasAttribute("title") && (o += ' "' + r.getAttribute("title") + '"'), o += ")";
      }
      return o;
    }), n.subParser("makeMarkdown.list", function(r, i, o) {
      var l = "";
      if (!r.hasChildNodes())
        return "";
      for (var u = r.childNodes, m = u.length, f = r.getAttribute("start") || 1, x = 0; x < m; ++x)
        if (!(typeof u[x].tagName > "u" || u[x].tagName.toLowerCase() !== "li")) {
          var B = "";
          o === "ol" ? B = f.toString() + ". " : B = "- ", l += B + n.subParser("makeMarkdown.listItem")(u[x], i), ++f;
        }
      return l += `
<!-- -->
`, l.trim();
    }), n.subParser("makeMarkdown.listItem", function(r, i) {
      for (var o = "", l = r.childNodes, u = l.length, m = 0; m < u; ++m)
        o += n.subParser("makeMarkdown.node")(l[m], i);
      return /\n$/.test(o) ? o = o.split(`
`).join(`
    `).replace(/^ {4}$/gm, "").replace(/\n\n+/g, `

`) : o += `
`, o;
    }), n.subParser("makeMarkdown.node", function(r, i, o) {
      o = o || !1;
      var l = "";
      if (r.nodeType === 3)
        return n.subParser("makeMarkdown.txt")(r, i);
      if (r.nodeType === 8)
        return "<!--" + r.data + `-->

`;
      if (r.nodeType !== 1)
        return "";
      var u = r.tagName.toLowerCase();
      switch (u) {
        case "h1":
          o || (l = n.subParser("makeMarkdown.header")(r, i, 1) + `

`);
          break;
        case "h2":
          o || (l = n.subParser("makeMarkdown.header")(r, i, 2) + `

`);
          break;
        case "h3":
          o || (l = n.subParser("makeMarkdown.header")(r, i, 3) + `

`);
          break;
        case "h4":
          o || (l = n.subParser("makeMarkdown.header")(r, i, 4) + `

`);
          break;
        case "h5":
          o || (l = n.subParser("makeMarkdown.header")(r, i, 5) + `

`);
          break;
        case "h6":
          o || (l = n.subParser("makeMarkdown.header")(r, i, 6) + `

`);
          break;
        case "p":
          o || (l = n.subParser("makeMarkdown.paragraph")(r, i) + `

`);
          break;
        case "blockquote":
          o || (l = n.subParser("makeMarkdown.blockquote")(r, i) + `

`);
          break;
        case "hr":
          o || (l = n.subParser("makeMarkdown.hr")(r, i) + `

`);
          break;
        case "ol":
          o || (l = n.subParser("makeMarkdown.list")(r, i, "ol") + `

`);
          break;
        case "ul":
          o || (l = n.subParser("makeMarkdown.list")(r, i, "ul") + `

`);
          break;
        case "precode":
          o || (l = n.subParser("makeMarkdown.codeBlock")(r, i) + `

`);
          break;
        case "pre":
          o || (l = n.subParser("makeMarkdown.pre")(r, i) + `

`);
          break;
        case "table":
          o || (l = n.subParser("makeMarkdown.table")(r, i) + `

`);
          break;
        case "code":
          l = n.subParser("makeMarkdown.codeSpan")(r, i);
          break;
        case "em":
        case "i":
          l = n.subParser("makeMarkdown.emphasis")(r, i);
          break;
        case "strong":
        case "b":
          l = n.subParser("makeMarkdown.strong")(r, i);
          break;
        case "del":
          l = n.subParser("makeMarkdown.strikethrough")(r, i);
          break;
        case "a":
          l = n.subParser("makeMarkdown.links")(r, i);
          break;
        case "img":
          l = n.subParser("makeMarkdown.image")(r, i);
          break;
        default:
          l = r.outerHTML + `

`;
      }
      return l;
    }), n.subParser("makeMarkdown.paragraph", function(r, i) {
      var o = "";
      if (r.hasChildNodes())
        for (var l = r.childNodes, u = l.length, m = 0; m < u; ++m)
          o += n.subParser("makeMarkdown.node")(l[m], i);
      return o = o.trim(), o;
    }), n.subParser("makeMarkdown.pre", function(r, i) {
      var o = r.getAttribute("prenum");
      return "<pre>" + i.preList[o] + "</pre>";
    }), n.subParser("makeMarkdown.strikethrough", function(r, i) {
      var o = "";
      if (r.hasChildNodes()) {
        o += "~~";
        for (var l = r.childNodes, u = l.length, m = 0; m < u; ++m)
          o += n.subParser("makeMarkdown.node")(l[m], i);
        o += "~~";
      }
      return o;
    }), n.subParser("makeMarkdown.strong", function(r, i) {
      var o = "";
      if (r.hasChildNodes()) {
        o += "**";
        for (var l = r.childNodes, u = l.length, m = 0; m < u; ++m)
          o += n.subParser("makeMarkdown.node")(l[m], i);
        o += "**";
      }
      return o;
    }), n.subParser("makeMarkdown.table", function(r, i) {
      var o = "", l = [[], []], u = r.querySelectorAll("thead>tr>th"), m = r.querySelectorAll("tbody>tr"), f, x;
      for (f = 0; f < u.length; ++f) {
        var B = n.subParser("makeMarkdown.tableCell")(u[f], i), U = "---";
        if (u[f].hasAttribute("style")) {
          var z = u[f].getAttribute("style").toLowerCase().replace(/\s/g, "");
          switch (z) {
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
        l[0][f] = B.trim(), l[1][f] = U;
      }
      for (f = 0; f < m.length; ++f) {
        var H = l.push([]) - 1, w = m[f].getElementsByTagName("td");
        for (x = 0; x < u.length; ++x) {
          var q = " ";
          typeof w[x] < "u" && (q = n.subParser("makeMarkdown.tableCell")(w[x], i)), l[H].push(q);
        }
      }
      var W = 3;
      for (f = 0; f < l.length; ++f)
        for (x = 0; x < l[f].length; ++x) {
          var J = l[f][x].length;
          J > W && (W = J);
        }
      for (f = 0; f < l.length; ++f) {
        for (x = 0; x < l[f].length; ++x)
          f === 1 ? l[f][x].slice(-1) === ":" ? l[f][x] = n.helper.padEnd(l[f][x].slice(-1), W - 1, "-") + ":" : l[f][x] = n.helper.padEnd(l[f][x], W, "-") : l[f][x] = n.helper.padEnd(l[f][x], W);
        o += "| " + l[f].join(" | ") + ` |
`;
      }
      return o.trim();
    }), n.subParser("makeMarkdown.tableCell", function(r, i) {
      var o = "";
      if (!r.hasChildNodes())
        return "";
      for (var l = r.childNodes, u = l.length, m = 0; m < u; ++m)
        o += n.subParser("makeMarkdown.node")(l[m], i, !0);
      return o.trim();
    }), n.subParser("makeMarkdown.txt", function(r) {
      var i = r.nodeValue;
      return i = i.replace(/ +/g, " "), i = i.replace(/¨NBSP;/g, " "), i = n.helper.unescapeHTMLEntities(i), i = i.replace(/([*_~|`])/g, "\\$1"), i = i.replace(/^(\s*)>/g, "\\$1>"), i = i.replace(/^#/gm, "\\#"), i = i.replace(/^(\s*)([-=]{3,})(\s*)$/, "$1\\$2$3"), i = i.replace(/^( {0,3}\d+)\./gm, "$1\\."), i = i.replace(/^( {0,3})([+-])/gm, "$1\\$2"), i = i.replace(/]([\s]*)\(/g, "\\]$1\\("), i = i.replace(/^ {0,3}\[([\S \t]*?)]:/gm, "\\[$1]:"), i;
    });
    var I = this;
    e.exports ? e.exports = n : I.showdown = n;
  }).call(Dl);
})(ju);
var Z_ = ju.exports;
const Oc = /* @__PURE__ */ zl(Z_);
class Nc {
  constructor() {
    Qe(this, "logger"), Qe(this, "converter"), this.logger = mi.zhiLog("showdown-adaptor"), this.converter = new Oc.Converter();
  }
  isAvailable() {
    return typeof Oc < "u";
  }
  renderMarkdownStr(t) {
    if (!this.isAvailable())
      throw new Error("Showdown is not available");
    return this.logger.info("Showdown is rendering md to HTML..."), Promise.resolve(this.converter.makeHtml(t));
  }
}
class Cu {
  constructor() {
    Qe(this, "logger"), Qe(this, "mdAdaptor", new Nc()), this.logger = mi.zhiLog("markdown-util");
  }
  /**
   * 获取当前 MD 解析器名称
   */
  getCurrentAdaptorName() {
    return this.mdAdaptor instanceof Cc ? "Lute" : this.mdAdaptor instanceof Nc ? "Showdown" : "None";
  }
  /**
   * 渲染Markdown
   *
   * @param md - Markdown文本
   */
  async renderHTML(t) {
    const a = new Cc();
    return this.logger.debug("Lute status =>", a.isAvailable()), a.isAvailable() && (this.mdAdaptor = a), this.logger.info(`Using ${this.getCurrentAdaptorName()} as markdown renderer`), await this.mdAdaptor.renderMarkdownStr(t);
  }
}
class Y_ {
  constructor() {
    Qe(this, "mdUtil"), this.mdUtil = new Cu();
  }
  /**
   * 移除标题数字
   *
   * @param str - 字符串
   */
  removeTitleNumber(t) {
    let a = t;
    const n = /([0-9]*)\./;
    return a = a.replace(n, ""), a;
  }
  /**
   * 删除挂件的HTML
   *
   * @param str - 原字符
   */
  removeWidgetTag(t) {
    let a = t.toString();
    const n = /<iframe.*src="\/widgets\/publisher.*<\/iframe>/g;
    a = a.replace(n, "");
    const s = /<iframe.*src="\/widgets\/sy-post-publisher.*<\/iframe>/g;
    a = a.replace(s, "");
    const c = /<iframe.*\/widgets\/Note*\sAttrs.*\/iframe>/g;
    return a = a.replace(c, ""), a;
  }
  /**
   * 删除Markdown文本的挂件的HTML
   *
   * @param str - 原字符
   */
  removeMdWidgetTag(t) {
    let a = t.toString();
    return a = this.removeWidgetTag(a), a;
  }
  /**
   * 去除html标签，残缺不全也可以
   *
   * @param str - 字符串
   */
  filterHtml(t) {
    t = t.replace(/<style((.|\n|\r)*?)<\/style>/g, ""), t = t.replace(/<script((.|\n|\r)*?)<\/script>/g, ""), t = t.replace(/<[^>]*>/g, ""), t = t.replace(/&.*;/g, ""), t = t.replace(/(^\s*)|(\s*$)/g, ""), t = t.replace(/</g, "").replace(/>/g, ""), t = t.replace(/"/g, "").replace(/'/g, ""), t = t.replace(/\*/g, ""), t = t.replace(/\$/g, ""), t = t.replace(/\./g, ""), t = t.replace(/\+/g, ""), t = t.replace(/\s+/g, ""), t = t.replace(/[:|：]/g, "_"), t = t.replace(/[;|；]/g, "_"), t = t.replace(/\^/g, "_"), t = t.replace(/!/g, "_"), t = t.replace(/@/g, "at_");
    const a = ["\\d*/\\d/\\d*", "[、|\\\\]", "[，|,]", "\\d", "/", "-"];
    for (let n = 0; n < a.length; n++) {
      const s = new RegExp(a[n], "g");
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
  parseHtml(t, a, n) {
    const s = this.filterHtml(t);
    return s.length < a ? s : n === !0 ? s.substring(0, a) : s.substring(0, a) + "...";
  }
  /**
   * 将Markdown转换为HTML
   *
   * @param md - Markdown
   */
  async mdToHtml(t) {
    const a = await this.mdUtil.renderHTML(t);
    return this.removeWidgetTag(a);
  }
  /**
   * 将Markdown转换为纯文本
   *
   * @param md - Markdown
   */
  async mdToPlainText(t) {
    const a = await this.mdToHtml(t);
    return this.filterHtml(a);
  }
  /**
   * 移除H1标签
   *
   * @param html - html
   */
  removeH1(t) {
    let a = t;
    const n = /<h1.*\/h1>/g;
    return a = a.replace(n, ""), a;
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
    let a = t;
    const n = /^# .*$/gm;
    return a = a.replace(n, ""), a;
  }
}
class Q_ {
  /**
   * 检测是否是空对象
   *
   * @param obj - 对象
   */
  isEmptyObject(t) {
    return t ? Object.getPrototypeOf(t) === Object.prototype && Object.getOwnPropertyNames(t).length === 0 && Object.getOwnPropertySymbols(t).length === 0 : !0;
  }
}
class X_ {
  constructor() {
    Qe(this, "dateUtil"), Qe(this, "strUtil"), Qe(this, "versionUtil"), Qe(this, "htmlUtil"), Qe(this, "markdownUtil"), Qe(this, "jsonUtil"), Qe(this, "objectUtil"), this.dateUtil = new P_(), this.strUtil = new S_(), this.versionUtil = new C_(), this.htmlUtil = new Y_(), this.markdownUtil = new Cu(), this.jsonUtil = new E_(), this.objectUtil = new Q_();
  }
}
const Ou = X_;
class Vn {
}
/**
 * 思源 API 伺服地址
 */
Ke(Vn, "VITE_SIYUAN_API_URL_KEY", "VITE_SIYUAN_API_URL"), /**
 * 思源 token
 */
Ke(Vn, "VITE_SIYUAN_AUTH_TOKEN_KEY", "VITE_SIYUAN_AUTH_TOKEN");
var ew = Object.defineProperty, tw = (e, t, a) => t in e ? ew(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, ea = (e, t, a) => (tw(e, typeof t != "symbol" ? t + "" : t, a), a);
class Pr {
}
ea(Pr, "NODE_ENV_KEY", "NODE_ENV"), /**
* 开发环境
*/
ea(Pr, "NODE_ENV_DEVELOPMENT", "development"), /**
* 生产环境
*/
ea(Pr, "NODE_ENV_PRODUCTION", "production"), /**
* 测试环境
*/
ea(Pr, "NODE_ENV_TEST", "test"), /**
* 是否处于调试模式
*/
ea(Pr, "VITE_DEBUG_MODE_KEY", "VITE_DEBUG_MODE");
class rw {
  /**
   * 环境初始化
   *
   * @param envMeta - 需要传入 {"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":false} 。特别提醒：此参数是静态元数据，取决于最终使用的项目。因此仅仅在最终使用的地方显示传递此值，中间项目请保持参数传递
   * @see {@link https://vitejs.dev/guide/env-and-mode.html#production-replacement}
   */
  constructor(t) {
    ea(this, "envMeta"), this.envMeta = t;
  }
  /**
   * 是否是开发阶段调试
   */
  isNodeDev() {
    return this.getEnv(Pr.NODE_ENV_KEY) === Pr.NODE_ENV_DEVELOPMENT;
  }
  /**
   * 是否是调试阶段
   */
  isDev() {
    return this.isNodeDev() || this.getBooleanEnv(Pr.VITE_DEBUG_MODE_KEY);
  }
  /**
   * 获取环境变量，key不存在返回undefined
   * @param key - key
   */
  getEnv(t) {
    let a;
    try {
      this.envMeta[t] && (a = this.envMeta[t]);
    } catch {
    }
    return a;
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
    let a = !1;
    return this.getEnv(t) && (a = this.getStringEnv(t).toLowerCase() === "true"), a;
  }
  /**
   * 获取环境变量，如果未定义或者为空值，用指定的默认值代替
   *
   * @param key - key
   * @param defaultValue - 默认值
   * @since 0.1.0
   * @author terwer
   */
  getEnvOrDefault(t, a) {
    const n = this.getStringEnv(t);
    return n.trim().length == 0 ? a : n;
  }
}
class Do extends Ua {
  static zhiEnv() {
    return this.env || (this.env = new rw({ BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 })), this.env;
  }
}
class Zn {
  /**
   * 初始化思源服务端 API
   *
   * @param cfg - 环境变量 或者 配置项
   */
  constructor(t) {
    /**
     * 思源笔记服务端API版本号
     */
    Ke(this, "VERSION");
    Ke(this, "logger");
    Ke(this, "env");
    Ke(this, "common");
    Ke(this, "siyuanConfig");
    if (this.VERSION = "1.0.0", this.env = Do.zhiEnv(), this.common = new Ou(), t instanceof Ji)
      this.siyuanConfig = t, this.logger = tc.customLogFactory(Yt.LOG_LEVEL_DEBUG, "zhi").getLogger("siyuan-kernel-api");
    else {
      const a = t, n = Ha.getEnvLevel(a), s = a.getStringEnv(Vn.VITE_SIYUAN_API_URL_KEY), c = a.getStringEnv(Vn.VITE_SIYUAN_AUTH_TOKEN_KEY);
      this.siyuanConfig = new Ji(s, c), this.logger = tc.customLogFactory(n, "siyuan-kernel-api", a).getLogger(Zn.name);
    }
  }
  /**
   * 分页获取根文档
   *
   * @param keyword - 关键字
   */
  async getRootBlocksCount(t) {
    const a = `SELECT COUNT(DISTINCT b1.root_id) as count
        FROM blocks b1
        WHERE 1 = 1
        AND (b1.root_id ='${t}' OR (b1.content LIKE '%${t}%') OR (b1.tag LIKE '%${t}%')
    )`, n = await this.sql(a);
    return this.logger.debug("getRootBlocksCount data=>", n[0].count), n[0].count;
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
  async getRootBlocks(t, a, n) {
    const s = `select DISTINCT b2.root_id,b2.parent_id,b2.content from blocks b2
        WHERE 1==1
        AND b2.id IN (
             SELECT DISTINCT b1.root_id
                FROM blocks b1
                WHERE 1 = 1
                AND (b1.root_id ='${n}' OR (b1.content LIKE '%${n}%') OR (b1.tag LIKE '%${n}%'))
                ORDER BY b1.updated DESC,b1.created DESC LIMIT ${t * a},${a}
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
    const a = `SELECT COUNT(DISTINCT b1.root_id) AS count
        FROM blocks b1
        WHERE b1.root_id='${t}' OR b1.path LIKE '%/${t}%'`;
    return (await this.sql(a))[0].count;
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
  async getSubdocs(t, a, n, s) {
    const c = `SELECT DISTINCT b2.root_id,b2.content,b2.path FROM blocks b2
        WHERE b2.id IN (
          SELECT DISTINCT b1.root_id
             FROM blocks b1
             WHERE b1.root_id='${t}' OR b1.path like '%/${t}%'
             AND ((b1.content LIKE '%${s}%') OR (b1.tag LIKE '%${s}%'))
             ORDER BY b1.updated DESC,b1.created DESC LIMIT ${a * n},${n}
        )
        ORDER BY b2.content,b2.updated DESC,b2.created DESC,id`;
    return this.logger.debug("siyuanApi getSubdocs sql=>", c), await this.sql(c);
  }
  /**
   * 以id获取思源块信息
   * @param blockId 块ID
   */
  async getBlockByID(t) {
    const a = `select *
                from blocks
                where id = '${t}'`, n = await this.sql(a);
    if (!n || n.length === 0)
      throw new Error("通过ID查询块信息失败");
    return n[0];
  }
  /**
   * 以slug获取思源块信息
   * @param slug 内容快别名
   */
  async getRootBlockBySlug(t) {
    const a = `select root_id from attributes where name='custom-slug' and value='${t}' limit 1`;
    return (await this.sql(a))[0];
  }
  /**
   * 以内容块ID获取根块
   *
   * @param blockID 内容块ID
   */
  async getRootBlock(t) {
    const a = `select root_id from blocks where id='${t}' limit 1`;
    return (await this.sql(a))[0];
  }
  /**
   * 导出markdown文本
   * @param docId 文档id
   */
  async exportMdContent(t) {
    const a = {
      id: t
    }, n = "/api/export/exportMdContent";
    return await this.siyuanRequest(n, a);
  }
  /**
   * 以sql发送请求
   *
   * @param sql - sql
   */
  async sql(t) {
    const a = {
      stmt: t
    }, n = "/api/query/sql";
    return this.env.isDev() && this.logger.trace("sql=>", t), await this.siyuanRequest(n, a);
  }
  /**
   * 向思源请求数据
   *
   * @param url - url
   * @param data - 数据
   */
  async siyuanRequest(t, a) {
    const n = `${this.siyuanConfig.apiUrl}${t}`, s = {
      body: JSON.stringify(a),
      method: "POST"
    };
    this.common.strUtil.isEmptyString(this.siyuanConfig.password) || Object.assign(s, {
      headers: {
        Authorization: `Token ${this.siyuanConfig.password}`
      }
    }), this.env.isDev() && (this.logger.trace("开始向思源请求数据，reqUrl=>", n), this.logger.trace("开始向思源请求数据，fetchOps=>", s));
    const p = await (await fetch(n, s)).json();
    if (this.env.isDev() && this.logger.trace("思源请求数据返回，resJson=>", p), p.code === -1)
      throw new Error(p.msg);
    return p.code === 0 ? p.data : null;
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
  async renameNotebook(t, a) {
    return await this.siyuanRequest("/api/notebook/renameNotebook", {
      notebook: t,
      name: a
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
    const a = {
      id: t
    }, n = "/api/attr/getBlockAttrs";
    return await this.siyuanRequest(n, a);
  }
  /**
   * 设置块属性
   * @param blockId
   * @param attrs
   */
  async setBlockAttrs(t, a) {
    const n = "/api/attr/setBlockAttrs";
    return await this.siyuanRequest(n, {
      id: t,
      attrs: a
    });
  }
}
class aw {
}
class Cw {
  /**
   * 构造思源 API对象
   *
   * @param cfg - 环境变量 或者 配置项
   */
  constructor(t) {
    /**
     * 思源笔记内核API
     */
    Ke(this, "kernelApi");
    /**
     * 思源笔记客户端API
     */
    Ke(this, "clientApi");
    this.kernelApi = new Zn(t), this.clientApi = new aw();
  }
}
class Ow {
  /**
   * 初始化思源 API 适配器
   *
   * @param cfg - 环境变量 或者 配置项
   */
  constructor(t) {
    Ke(this, "logger");
    Ke(this, "common");
    Ke(this, "siyuanKernelApi");
    Ke(this, "cfg");
    this.logger = Do.zhiLog("siyuan-api-adaptor"), this.common = Do.zhiCommon(), this.siyuanKernelApi = new Zn(t), this.cfg = this.siyuanKernelApi.siyuanConfig;
  }
  async deletePost(t) {
    return console.log(t), Promise.resolve(!1);
  }
  async editPost(t, a, n) {
    return console.log(`${t} ${a} ${n}`), Promise.resolve(!1);
  }
  async getCategories() {
    return Promise.resolve([]);
  }
  async getPost(t, a, n) {
    let s = t;
    if (a) {
      const N = await this.siyuanKernelApi.getRootBlockBySlug(t);
      N && (s = N.root_id);
    }
    const c = await this.siyuanKernelApi.getBlockByID(s);
    if (!c)
      throw new Error("文章不存存在，postid=>" + s);
    const p = await this.siyuanKernelApi.getBlockAttrs(s);
    let b = !0;
    (p["custom-publish-status"] || "draft") === "secret" && (b = !1);
    const y = p["custom-post-password"] || "", g = p["custom-desc"] || "";
    let S = c.content ?? "";
    this.cfg.fixTitle && (S = this.common.htmlUtil.removeTitleNumber(S));
    let L;
    if (!n) {
      const N = await this.siyuanKernelApi.exportMdContent(s);
      L = await this.common.markdownUtil.renderHTML(N.content), L = this.common.htmlUtil.removeWidgetTag(L), this.cfg.fixTitle && (L = this.common.htmlUtil.removeH1(L));
    }
    const A = new gi();
    return A.postid = c.root_id || "", A.title = S || "", A.description = L || "", A.shortDesc = g || "", A.mt_keywords = p.tags || "", A.post_status = b ? Sn.PostStatusEnum_Publish : Sn.PostStatusEnum_Draft, A.wp_password = y, A;
  }
  async getPreviewUrl(t) {
    return console.log(t), Promise.resolve("");
  }
  async getRecentPosts(t, a, n) {
    const s = [];
    let c = 0;
    a && (c = a);
    const p = n ?? "", b = await this.siyuanKernelApi.getRootBlocks(c, t, p);
    this.logger.debug("getRecentPosts from siyuan, get counts =>", b.length);
    for (let _ = 0; _ < b.length; _++) {
      const y = b[_], g = await this.siyuanKernelApi.getBlockAttrs(y.root_id), S = await this.getPost(y.root_id, !1, !0), L = g["custom-slug"] || "";
      let A = y.content ?? "";
      this.cfg.fixTitle && (A = this.common.htmlUtil.removeTitleNumber(A));
      const N = new gi();
      N.postid = y.root_id, N.title = A, N.permalink = L === "" ? this.common.strUtil.appendStr("/post/", y.root_id) : this.common.strUtil.appendStr("/post/", L, ".html"), N.mt_keywords = S.mt_keywords, N.description = S.description, s.push(N);
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
  async newPost(t, a) {
    return console.log(`${t} ${a}`), Promise.resolve("");
  }
}
export {
  Ow as SiYuanApiAdaptor,
  Cw as SiyuanApi,
  Ji as SiyuanConfig,
  Vn as SiyuanConstants,
  Zn as SiyuanKernelApi
};
