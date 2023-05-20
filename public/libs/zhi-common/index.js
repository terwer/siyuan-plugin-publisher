var Ts = Object.defineProperty;
var js = (e, r, n) => r in e ? Ts(e, r, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[r] = n;
var be = (e, r, n) => (js(e, typeof r != "symbol" ? r + "" : r, n), n);
var kn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Pn(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var zt = { exports: {} }, Sn = {}, He = {}, Rr = {}, et = {}, se = {}, xr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class r {
  }
  e._CodeOrName = r, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class n extends r {
    constructor(O) {
      if (super(), !e.IDENTIFIER.test(O))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = O;
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
  class a extends r {
    constructor(O) {
      super(), this._items = typeof O == "string" ? [O] : O;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const O = this._items[0];
      return O === "" || O === '""';
    }
    get str() {
      var O;
      return (O = this._str) !== null && O !== void 0 ? O : this._str = this._items.reduce((D, t) => `${D}${t}`, "");
    }
    get names() {
      var O;
      return (O = this._names) !== null && O !== void 0 ? O : this._names = this._items.reduce((D, t) => (t instanceof n && (D[t.str] = (D[t.str] || 0) + 1), D), {});
    }
  }
  e._Code = a, e.nil = new a("");
  function u($, ...O) {
    const D = [$[0]];
    let t = 0;
    for (; t < O.length; )
      y(D, O[t]), D.push($[++t]);
    return new a(D);
  }
  e._ = u;
  const o = new a("+");
  function p($, ...O) {
    const D = [L($[0])];
    let t = 0;
    for (; t < O.length; )
      D.push(o), y(D, O[t]), D.push(o, L($[++t]));
    return b(D), new a(D);
  }
  e.str = p;
  function y($, O) {
    O instanceof a ? $.push(...O._items) : O instanceof n ? $.push(O) : $.push(S(O));
  }
  e.addCodeArg = y;
  function b($) {
    let O = 1;
    for (; O < $.length - 1; ) {
      if ($[O] === o) {
        const D = v($[O - 1], $[O + 1]);
        if (D !== void 0) {
          $.splice(O - 1, 3, D);
          continue;
        }
        $[O++] = "+";
      }
      O++;
    }
  }
  function v($, O) {
    if (O === '""')
      return $;
    if ($ === '""')
      return O;
    if (typeof $ == "string")
      return O instanceof n || $[$.length - 1] !== '"' ? void 0 : typeof O != "string" ? `${$.slice(0, -1)}${O}"` : O[0] === '"' ? $.slice(0, -1) + O.slice(1) : void 0;
    if (typeof O == "string" && O[0] === '"' && !($ instanceof n))
      return `"${$}${O.slice(1)}`;
  }
  function g($, O) {
    return O.emptyStr() ? $ : $.emptyStr() ? O : p`${$}${O}`;
  }
  e.strConcat = g;
  function S($) {
    return typeof $ == "number" || typeof $ == "boolean" || $ === null ? $ : L(Array.isArray($) ? $.join(",") : $);
  }
  function z($) {
    return new a(L($));
  }
  e.stringify = z;
  function L($) {
    return JSON.stringify($).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = L;
  function R($) {
    return typeof $ == "string" && e.IDENTIFIER.test($) ? new a(`.${$}`) : u`[${$}]`;
  }
  e.getProperty = R;
  function j($) {
    if (typeof $ == "string" && e.IDENTIFIER.test($))
      return new a(`${$}`);
    throw new Error(`CodeGen: invalid export name: ${$}, use explicit $id name mapping`);
  }
  e.getEsmExportName = j;
  function T($) {
    return new a($.toString());
  }
  e.regexpCode = T;
})(xr);
var Vt = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const r = xr;
  class n extends Error {
    constructor(v) {
      super(`CodeGen: "code" for ${v} not defined`), this.value = v.value;
    }
  }
  var a;
  (function(b) {
    b[b.Started = 0] = "Started", b[b.Completed = 1] = "Completed";
  })(a = e.UsedValueState || (e.UsedValueState = {})), e.varKinds = {
    const: new r.Name("const"),
    let: new r.Name("let"),
    var: new r.Name("var")
  };
  class u {
    constructor({ prefixes: v, parent: g } = {}) {
      this._names = {}, this._prefixes = v, this._parent = g;
    }
    toName(v) {
      return v instanceof r.Name ? v : this.name(v);
    }
    name(v) {
      return new r.Name(this._newName(v));
    }
    _newName(v) {
      const g = this._names[v] || this._nameGroup(v);
      return `${v}${g.index++}`;
    }
    _nameGroup(v) {
      var g, S;
      if (!((S = (g = this._parent) === null || g === void 0 ? void 0 : g._prefixes) === null || S === void 0) && S.has(v) || this._prefixes && !this._prefixes.has(v))
        throw new Error(`CodeGen: prefix "${v}" is not allowed in this scope`);
      return this._names[v] = { prefix: v, index: 0 };
    }
  }
  e.Scope = u;
  class o extends r.Name {
    constructor(v, g) {
      super(g), this.prefix = v;
    }
    setValue(v, { property: g, itemIndex: S }) {
      this.value = v, this.scopePath = (0, r._)`.${new r.Name(g)}[${S}]`;
    }
  }
  e.ValueScopeName = o;
  const p = (0, r._)`\n`;
  class y extends u {
    constructor(v) {
      super(v), this._values = {}, this._scope = v.scope, this.opts = { ...v, _n: v.lines ? p : r.nil };
    }
    get() {
      return this._scope;
    }
    name(v) {
      return new o(v, this._newName(v));
    }
    value(v, g) {
      var S;
      if (g.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const z = this.toName(v), { prefix: L } = z, R = (S = g.key) !== null && S !== void 0 ? S : g.ref;
      let j = this._values[L];
      if (j) {
        const O = j.get(R);
        if (O)
          return O;
      } else
        j = this._values[L] = /* @__PURE__ */ new Map();
      j.set(R, z);
      const T = this._scope[L] || (this._scope[L] = []), $ = T.length;
      return T[$] = g.ref, z.setValue(g, { property: L, itemIndex: $ }), z;
    }
    getValue(v, g) {
      const S = this._values[v];
      if (S)
        return S.get(g);
    }
    scopeRefs(v, g = this._values) {
      return this._reduceValues(g, (S) => {
        if (S.scopePath === void 0)
          throw new Error(`CodeGen: name "${S}" has no value`);
        return (0, r._)`${v}${S.scopePath}`;
      });
    }
    scopeCode(v = this._values, g, S) {
      return this._reduceValues(v, (z) => {
        if (z.value === void 0)
          throw new Error(`CodeGen: name "${z}" has no value`);
        return z.value.code;
      }, g, S);
    }
    _reduceValues(v, g, S = {}, z) {
      let L = r.nil;
      for (const R in v) {
        const j = v[R];
        if (!j)
          continue;
        const T = S[R] = S[R] || /* @__PURE__ */ new Map();
        j.forEach(($) => {
          if (T.has($))
            return;
          T.set($, a.Started);
          let O = g($);
          if (O) {
            const D = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            L = (0, r._)`${L}${D} ${$} = ${O};${this.opts._n}`;
          } else if (O = z == null ? void 0 : z($))
            L = (0, r._)`${L}${O}${this.opts._n}`;
          else
            throw new n($);
          T.set($, a.Completed);
        });
      }
      return L;
    }
  }
  e.ValueScope = y;
})(Vt);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const r = xr, n = Vt;
  var a = xr;
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
  var u = Vt;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return u.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return u.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return u.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return u.varKinds;
  } }), e.operators = {
    GT: new r._Code(">"),
    GTE: new r._Code(">="),
    LT: new r._Code("<"),
    LTE: new r._Code("<="),
    EQ: new r._Code("==="),
    NEQ: new r._Code("!=="),
    NOT: new r._Code("!"),
    OR: new r._Code("||"),
    AND: new r._Code("&&"),
    ADD: new r._Code("+")
  };
  class o {
    optimizeNodes() {
      return this;
    }
    optimizeNames(l, w) {
      return this;
    }
  }
  class p extends o {
    constructor(l, w, I) {
      super(), this.varKind = l, this.name = w, this.rhs = I;
    }
    render({ es5: l, _n: w }) {
      const I = l ? n.varKinds.var : this.varKind, K = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${I} ${this.name}${K};` + w;
    }
    optimizeNames(l, w) {
      if (l[this.name.str])
        return this.rhs && (this.rhs = V(this.rhs, l, w)), this;
    }
    get names() {
      return this.rhs instanceof r._CodeOrName ? this.rhs.names : {};
    }
  }
  class y extends o {
    constructor(l, w, I) {
      super(), this.lhs = l, this.rhs = w, this.sideEffects = I;
    }
    render({ _n: l }) {
      return `${this.lhs} = ${this.rhs};` + l;
    }
    optimizeNames(l, w) {
      if (!(this.lhs instanceof r.Name && !l[this.lhs.str] && !this.sideEffects))
        return this.rhs = V(this.rhs, l, w), this;
    }
    get names() {
      const l = this.lhs instanceof r.Name ? {} : { ...this.lhs.names };
      return H(l, this.rhs);
    }
  }
  class b extends y {
    constructor(l, w, I, K) {
      super(l, I, K), this.op = w;
    }
    render({ _n: l }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + l;
    }
  }
  class v extends o {
    constructor(l) {
      super(), this.label = l, this.names = {};
    }
    render({ _n: l }) {
      return `${this.label}:` + l;
    }
  }
  class g extends o {
    constructor(l) {
      super(), this.label = l, this.names = {};
    }
    render({ _n: l }) {
      return `break${this.label ? ` ${this.label}` : ""};` + l;
    }
  }
  class S extends o {
    constructor(l) {
      super(), this.error = l;
    }
    render({ _n: l }) {
      return `throw ${this.error};` + l;
    }
    get names() {
      return this.error.names;
    }
  }
  class z extends o {
    constructor(l) {
      super(), this.code = l;
    }
    render({ _n: l }) {
      return `${this.code};` + l;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(l, w) {
      return this.code = V(this.code, l, w), this;
    }
    get names() {
      return this.code instanceof r._CodeOrName ? this.code.names : {};
    }
  }
  class L extends o {
    constructor(l = []) {
      super(), this.nodes = l;
    }
    render(l) {
      return this.nodes.reduce((w, I) => w + I.render(l), "");
    }
    optimizeNodes() {
      const { nodes: l } = this;
      let w = l.length;
      for (; w--; ) {
        const I = l[w].optimizeNodes();
        Array.isArray(I) ? l.splice(w, 1, ...I) : I ? l[w] = I : l.splice(w, 1);
      }
      return l.length > 0 ? this : void 0;
    }
    optimizeNames(l, w) {
      const { nodes: I } = this;
      let K = I.length;
      for (; K--; ) {
        const W = I[K];
        W.optimizeNames(l, w) || (G(l, W.names), I.splice(K, 1));
      }
      return I.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((l, w) => U(l, w.names), {});
    }
  }
  class R extends L {
    render(l) {
      return "{" + l._n + super.render(l) + "}" + l._n;
    }
  }
  class j extends L {
  }
  class T extends R {
  }
  T.kind = "else";
  class $ extends R {
    constructor(l, w) {
      super(w), this.condition = l;
    }
    render(l) {
      let w = `if(${this.condition})` + super.render(l);
      return this.else && (w += "else " + this.else.render(l)), w;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const l = this.condition;
      if (l === !0)
        return this.nodes;
      let w = this.else;
      if (w) {
        const I = w.optimizeNodes();
        w = this.else = Array.isArray(I) ? new T(I) : I;
      }
      if (w)
        return l === !1 ? w instanceof $ ? w : w.nodes : this.nodes.length ? this : new $(_(l), w instanceof $ ? [w] : w.nodes);
      if (!(l === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(l, w) {
      var I;
      if (this.else = (I = this.else) === null || I === void 0 ? void 0 : I.optimizeNames(l, w), !!(super.optimizeNames(l, w) || this.else))
        return this.condition = V(this.condition, l, w), this;
    }
    get names() {
      const l = super.names;
      return H(l, this.condition), this.else && U(l, this.else.names), l;
    }
  }
  $.kind = "if";
  class O extends R {
  }
  O.kind = "for";
  class D extends O {
    constructor(l) {
      super(), this.iteration = l;
    }
    render(l) {
      return `for(${this.iteration})` + super.render(l);
    }
    optimizeNames(l, w) {
      if (super.optimizeNames(l, w))
        return this.iteration = V(this.iteration, l, w), this;
    }
    get names() {
      return U(super.names, this.iteration.names);
    }
  }
  class t extends O {
    constructor(l, w, I, K) {
      super(), this.varKind = l, this.name = w, this.from = I, this.to = K;
    }
    render(l) {
      const w = l.es5 ? n.varKinds.var : this.varKind, { name: I, from: K, to: W } = this;
      return `for(${w} ${I}=${K}; ${I}<${W}; ${I}++)` + super.render(l);
    }
    get names() {
      const l = H(super.names, this.from);
      return H(l, this.to);
    }
  }
  class d extends O {
    constructor(l, w, I, K) {
      super(), this.loop = l, this.varKind = w, this.name = I, this.iterable = K;
    }
    render(l) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(l);
    }
    optimizeNames(l, w) {
      if (super.optimizeNames(l, w))
        return this.iterable = V(this.iterable, l, w), this;
    }
    get names() {
      return U(super.names, this.iterable.names);
    }
  }
  class s extends R {
    constructor(l, w, I) {
      super(), this.name = l, this.args = w, this.async = I;
    }
    render(l) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(l);
    }
  }
  s.kind = "func";
  class i extends L {
    render(l) {
      return "return " + super.render(l);
    }
  }
  i.kind = "return";
  class c extends R {
    render(l) {
      let w = "try" + super.render(l);
      return this.catch && (w += this.catch.render(l)), this.finally && (w += this.finally.render(l)), w;
    }
    optimizeNodes() {
      var l, w;
      return super.optimizeNodes(), (l = this.catch) === null || l === void 0 || l.optimizeNodes(), (w = this.finally) === null || w === void 0 || w.optimizeNodes(), this;
    }
    optimizeNames(l, w) {
      var I, K;
      return super.optimizeNames(l, w), (I = this.catch) === null || I === void 0 || I.optimizeNames(l, w), (K = this.finally) === null || K === void 0 || K.optimizeNames(l, w), this;
    }
    get names() {
      const l = super.names;
      return this.catch && U(l, this.catch.names), this.finally && U(l, this.finally.names), l;
    }
  }
  class m extends R {
    constructor(l) {
      super(), this.error = l;
    }
    render(l) {
      return `catch(${this.error})` + super.render(l);
    }
  }
  m.kind = "catch";
  class h extends R {
    render(l) {
      return "finally" + super.render(l);
    }
  }
  h.kind = "finally";
  class C {
    constructor(l, w = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...w, _n: w.lines ? `
` : "" }, this._extScope = l, this._scope = new n.Scope({ parent: l }), this._nodes = [new j()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(l) {
      return this._scope.name(l);
    }
    // reserves unique name in the external scope
    scopeName(l) {
      return this._extScope.name(l);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(l, w) {
      const I = this._extScope.value(l, w);
      return (this._values[I.prefix] || (this._values[I.prefix] = /* @__PURE__ */ new Set())).add(I), I;
    }
    getScopeValue(l, w) {
      return this._extScope.getValue(l, w);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(l) {
      return this._extScope.scopeRefs(l, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(l, w, I, K) {
      const W = this._scope.toName(w);
      return I !== void 0 && K && (this._constants[W.str] = I), this._leafNode(new p(l, W, I)), W;
    }
    // `const` declaration (`var` in es5 mode)
    const(l, w, I) {
      return this._def(n.varKinds.const, l, w, I);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(l, w, I) {
      return this._def(n.varKinds.let, l, w, I);
    }
    // `var` declaration with optional assignment
    var(l, w, I) {
      return this._def(n.varKinds.var, l, w, I);
    }
    // assignment code
    assign(l, w, I) {
      return this._leafNode(new y(l, w, I));
    }
    // `+=` code
    add(l, w) {
      return this._leafNode(new b(l, e.operators.ADD, w));
    }
    // appends passed SafeExpr to code or executes Block
    code(l) {
      return typeof l == "function" ? l() : l !== r.nil && this._leafNode(new z(l)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...l) {
      const w = ["{"];
      for (const [I, K] of l)
        w.length > 1 && w.push(","), w.push(I), (I !== K || this.opts.es5) && (w.push(":"), (0, r.addCodeArg)(w, K));
      return w.push("}"), new r._Code(w);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(l, w, I) {
      if (this._blockNode(new $(l)), w && I)
        this.code(w).else().code(I).endIf();
      else if (w)
        this.code(w).endIf();
      else if (I)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(l) {
      return this._elseNode(new $(l));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new T());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode($, T);
    }
    _for(l, w) {
      return this._blockNode(l), w && this.code(w).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(l, w) {
      return this._for(new D(l), w);
    }
    // `for` statement for a range of values
    forRange(l, w, I, K, W = this.opts.es5 ? n.varKinds.var : n.varKinds.let) {
      const re = this._scope.toName(l);
      return this._for(new t(W, re, w, I), () => K(re));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(l, w, I, K = n.varKinds.const) {
      const W = this._scope.toName(l);
      if (this.opts.es5) {
        const re = w instanceof r.Name ? w : this.var("_arr", w);
        return this.forRange("_i", 0, (0, r._)`${re}.length`, (ae) => {
          this.var(W, (0, r._)`${re}[${ae}]`), I(W);
        });
      }
      return this._for(new d("of", K, W, w), () => I(W));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(l, w, I, K = this.opts.es5 ? n.varKinds.var : n.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(l, (0, r._)`Object.keys(${w})`, I);
      const W = this._scope.toName(l);
      return this._for(new d("in", K, W, w), () => I(W));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(O);
    }
    // `label` statement
    label(l) {
      return this._leafNode(new v(l));
    }
    // `break` statement
    break(l) {
      return this._leafNode(new g(l));
    }
    // `return` statement
    return(l) {
      const w = new i();
      if (this._blockNode(w), this.code(l), w.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(i);
    }
    // `try` statement
    try(l, w, I) {
      if (!w && !I)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const K = new c();
      if (this._blockNode(K), this.code(l), w) {
        const W = this.name("e");
        this._currNode = K.catch = new m(W), w(W);
      }
      return I && (this._currNode = K.finally = new h(), this.code(I)), this._endBlockNode(m, h);
    }
    // `throw` statement
    throw(l) {
      return this._leafNode(new S(l));
    }
    // start self-balancing block
    block(l, w) {
      return this._blockStarts.push(this._nodes.length), l && this.code(l).endBlock(w), this;
    }
    // end the current self-balancing block
    endBlock(l) {
      const w = this._blockStarts.pop();
      if (w === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const I = this._nodes.length - w;
      if (I < 0 || l !== void 0 && I !== l)
        throw new Error(`CodeGen: wrong number of nodes: ${I} vs ${l} expected`);
      return this._nodes.length = w, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(l, w = r.nil, I, K) {
      return this._blockNode(new s(l, w, I)), K && this.code(K).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(s);
    }
    optimize(l = 1) {
      for (; l-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(l) {
      return this._currNode.nodes.push(l), this;
    }
    _blockNode(l) {
      this._currNode.nodes.push(l), this._nodes.push(l);
    }
    _endBlockNode(l, w) {
      const I = this._currNode;
      if (I instanceof l || w && I instanceof w)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${w ? `${l.kind}/${w.kind}` : l.kind}"`);
    }
    _elseNode(l) {
      const w = this._currNode;
      if (!(w instanceof $))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = w.else = l, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const l = this._nodes;
      return l[l.length - 1];
    }
    set _currNode(l) {
      const w = this._nodes;
      w[w.length - 1] = l;
    }
  }
  e.CodeGen = C;
  function U(N, l) {
    for (const w in l)
      N[w] = (N[w] || 0) + (l[w] || 0);
    return N;
  }
  function H(N, l) {
    return l instanceof r._CodeOrName ? U(N, l.names) : N;
  }
  function V(N, l, w) {
    if (N instanceof r.Name)
      return I(N);
    if (!K(N))
      return N;
    return new r._Code(N._items.reduce((W, re) => (re instanceof r.Name && (re = I(re)), re instanceof r._Code ? W.push(...re._items) : W.push(re), W), []));
    function I(W) {
      const re = w[W.str];
      return re === void 0 || l[W.str] !== 1 ? W : (delete l[W.str], re);
    }
    function K(W) {
      return W instanceof r._Code && W._items.some((re) => re instanceof r.Name && l[re.str] === 1 && w[re.str] !== void 0);
    }
  }
  function G(N, l) {
    for (const w in l)
      N[w] = (N[w] || 0) - (l[w] || 0);
  }
  function _(N) {
    return typeof N == "boolean" || typeof N == "number" || N === null ? !N : (0, r._)`!${F(N)}`;
  }
  e.not = _;
  const q = k(e.operators.AND);
  function J(...N) {
    return N.reduce(q);
  }
  e.and = J;
  const Z = k(e.operators.OR);
  function B(...N) {
    return N.reduce(Z);
  }
  e.or = B;
  function k(N) {
    return (l, w) => l === r.nil ? w : w === r.nil ? l : (0, r._)`${F(l)} ${N} ${F(w)}`;
  }
  function F(N) {
    return N instanceof r.Name ? N : (0, r._)`(${N})`;
  }
})(se);
var ie = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.checkStrictMode = e.getErrorPath = e.Type = e.useFunc = e.setEvaluated = e.evaluatedPropsToName = e.mergeEvaluated = e.eachItem = e.unescapeJsonPointer = e.escapeJsonPointer = e.escapeFragment = e.unescapeFragment = e.schemaRefOrVal = e.schemaHasRulesButRef = e.schemaHasRules = e.checkUnknownRules = e.alwaysValidSchema = e.toHash = void 0;
  const r = se, n = xr;
  function a(s) {
    const i = {};
    for (const c of s)
      i[c] = !0;
    return i;
  }
  e.toHash = a;
  function u(s, i) {
    return typeof i == "boolean" ? i : Object.keys(i).length === 0 ? !0 : (o(s, i), !p(i, s.self.RULES.all));
  }
  e.alwaysValidSchema = u;
  function o(s, i = s.schema) {
    const { opts: c, self: m } = s;
    if (!c.strictSchema || typeof i == "boolean")
      return;
    const h = m.RULES.keywords;
    for (const C in i)
      h[C] || d(s, `unknown keyword: "${C}"`);
  }
  e.checkUnknownRules = o;
  function p(s, i) {
    if (typeof s == "boolean")
      return !s;
    for (const c in s)
      if (i[c])
        return !0;
    return !1;
  }
  e.schemaHasRules = p;
  function y(s, i) {
    if (typeof s == "boolean")
      return !s;
    for (const c in s)
      if (c !== "$ref" && i.all[c])
        return !0;
    return !1;
  }
  e.schemaHasRulesButRef = y;
  function b({ topSchemaRef: s, schemaPath: i }, c, m, h) {
    if (!h) {
      if (typeof c == "number" || typeof c == "boolean")
        return c;
      if (typeof c == "string")
        return (0, r._)`${c}`;
    }
    return (0, r._)`${s}${i}${(0, r.getProperty)(m)}`;
  }
  e.schemaRefOrVal = b;
  function v(s) {
    return z(decodeURIComponent(s));
  }
  e.unescapeFragment = v;
  function g(s) {
    return encodeURIComponent(S(s));
  }
  e.escapeFragment = g;
  function S(s) {
    return typeof s == "number" ? `${s}` : s.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  e.escapeJsonPointer = S;
  function z(s) {
    return s.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  e.unescapeJsonPointer = z;
  function L(s, i) {
    if (Array.isArray(s))
      for (const c of s)
        i(c);
    else
      i(s);
  }
  e.eachItem = L;
  function R({ mergeNames: s, mergeToName: i, mergeValues: c, resultToName: m }) {
    return (h, C, U, H) => {
      const V = U === void 0 ? C : U instanceof r.Name ? (C instanceof r.Name ? s(h, C, U) : i(h, C, U), U) : C instanceof r.Name ? (i(h, U, C), C) : c(C, U);
      return H === r.Name && !(V instanceof r.Name) ? m(h, V) : V;
    };
  }
  e.mergeEvaluated = {
    props: R({
      mergeNames: (s, i, c) => s.if((0, r._)`${c} !== true && ${i} !== undefined`, () => {
        s.if((0, r._)`${i} === true`, () => s.assign(c, !0), () => s.assign(c, (0, r._)`${c} || {}`).code((0, r._)`Object.assign(${c}, ${i})`));
      }),
      mergeToName: (s, i, c) => s.if((0, r._)`${c} !== true`, () => {
        i === !0 ? s.assign(c, !0) : (s.assign(c, (0, r._)`${c} || {}`), T(s, c, i));
      }),
      mergeValues: (s, i) => s === !0 ? !0 : { ...s, ...i },
      resultToName: j
    }),
    items: R({
      mergeNames: (s, i, c) => s.if((0, r._)`${c} !== true && ${i} !== undefined`, () => s.assign(c, (0, r._)`${i} === true ? true : ${c} > ${i} ? ${c} : ${i}`)),
      mergeToName: (s, i, c) => s.if((0, r._)`${c} !== true`, () => s.assign(c, i === !0 ? !0 : (0, r._)`${c} > ${i} ? ${c} : ${i}`)),
      mergeValues: (s, i) => s === !0 ? !0 : Math.max(s, i),
      resultToName: (s, i) => s.var("items", i)
    })
  };
  function j(s, i) {
    if (i === !0)
      return s.var("props", !0);
    const c = s.var("props", (0, r._)`{}`);
    return i !== void 0 && T(s, c, i), c;
  }
  e.evaluatedPropsToName = j;
  function T(s, i, c) {
    Object.keys(c).forEach((m) => s.assign((0, r._)`${i}${(0, r.getProperty)(m)}`, !0));
  }
  e.setEvaluated = T;
  const $ = {};
  function O(s, i) {
    return s.scopeValue("func", {
      ref: i,
      code: $[i.code] || ($[i.code] = new n._Code(i.code))
    });
  }
  e.useFunc = O;
  var D;
  (function(s) {
    s[s.Num = 0] = "Num", s[s.Str = 1] = "Str";
  })(D = e.Type || (e.Type = {}));
  function t(s, i, c) {
    if (s instanceof r.Name) {
      const m = i === D.Num;
      return c ? m ? (0, r._)`"[" + ${s} + "]"` : (0, r._)`"['" + ${s} + "']"` : m ? (0, r._)`"/" + ${s}` : (0, r._)`"/" + ${s}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return c ? (0, r.getProperty)(s).toString() : "/" + S(s);
  }
  e.getErrorPath = t;
  function d(s, i, c = s.opts.strictSchema) {
    if (c) {
      if (i = `strict mode: ${i}`, c === !0)
        throw new Error(i);
      s.self.logger.warn(i);
    }
  }
  e.checkStrictMode = d;
})(ie);
var Qe = {};
Object.defineProperty(Qe, "__esModule", { value: !0 });
const Pe = se, Os = {
  // validation function arguments
  data: new Pe.Name("data"),
  // args passed from referencing schema
  valCxt: new Pe.Name("valCxt"),
  instancePath: new Pe.Name("instancePath"),
  parentData: new Pe.Name("parentData"),
  parentDataProperty: new Pe.Name("parentDataProperty"),
  rootData: new Pe.Name("rootData"),
  dynamicAnchors: new Pe.Name("dynamicAnchors"),
  // function scoped variables
  vErrors: new Pe.Name("vErrors"),
  errors: new Pe.Name("errors"),
  this: new Pe.Name("this"),
  // "globals"
  self: new Pe.Name("self"),
  scope: new Pe.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Pe.Name("json"),
  jsonPos: new Pe.Name("jsonPos"),
  jsonLen: new Pe.Name("jsonLen"),
  jsonPart: new Pe.Name("jsonPart")
};
Qe.default = Os;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const r = se, n = ie, a = Qe;
  e.keywordError = {
    message: ({ keyword: T }) => (0, r.str)`must pass "${T}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: T, schemaType: $ }) => $ ? (0, r.str)`"${T}" keyword must be ${$} ($data)` : (0, r.str)`"${T}" keyword is invalid ($data)`
  };
  function u(T, $ = e.keywordError, O, D) {
    const { it: t } = T, { gen: d, compositeRule: s, allErrors: i } = t, c = S(T, $, O);
    D ?? (s || i) ? b(d, c) : v(t, (0, r._)`[${c}]`);
  }
  e.reportError = u;
  function o(T, $ = e.keywordError, O) {
    const { it: D } = T, { gen: t, compositeRule: d, allErrors: s } = D, i = S(T, $, O);
    b(t, i), d || s || v(D, a.default.vErrors);
  }
  e.reportExtraError = o;
  function p(T, $) {
    T.assign(a.default.errors, $), T.if((0, r._)`${a.default.vErrors} !== null`, () => T.if($, () => T.assign((0, r._)`${a.default.vErrors}.length`, $), () => T.assign(a.default.vErrors, null)));
  }
  e.resetErrorsCount = p;
  function y({ gen: T, keyword: $, schemaValue: O, data: D, errsCount: t, it: d }) {
    if (t === void 0)
      throw new Error("ajv implementation error");
    const s = T.name("err");
    T.forRange("i", t, a.default.errors, (i) => {
      T.const(s, (0, r._)`${a.default.vErrors}[${i}]`), T.if((0, r._)`${s}.instancePath === undefined`, () => T.assign((0, r._)`${s}.instancePath`, (0, r.strConcat)(a.default.instancePath, d.errorPath))), T.assign((0, r._)`${s}.schemaPath`, (0, r.str)`${d.errSchemaPath}/${$}`), d.opts.verbose && (T.assign((0, r._)`${s}.schema`, O), T.assign((0, r._)`${s}.data`, D));
    });
  }
  e.extendErrors = y;
  function b(T, $) {
    const O = T.const("err", $);
    T.if((0, r._)`${a.default.vErrors} === null`, () => T.assign(a.default.vErrors, (0, r._)`[${O}]`), (0, r._)`${a.default.vErrors}.push(${O})`), T.code((0, r._)`${a.default.errors}++`);
  }
  function v(T, $) {
    const { gen: O, validateName: D, schemaEnv: t } = T;
    t.$async ? O.throw((0, r._)`new ${T.ValidationError}(${$})`) : (O.assign((0, r._)`${D}.errors`, $), O.return(!1));
  }
  const g = {
    keyword: new r.Name("keyword"),
    schemaPath: new r.Name("schemaPath"),
    params: new r.Name("params"),
    propertyName: new r.Name("propertyName"),
    message: new r.Name("message"),
    schema: new r.Name("schema"),
    parentSchema: new r.Name("parentSchema")
  };
  function S(T, $, O) {
    const { createErrors: D } = T.it;
    return D === !1 ? (0, r._)`{}` : z(T, $, O);
  }
  function z(T, $, O = {}) {
    const { gen: D, it: t } = T, d = [
      L(t, O),
      R(T, O)
    ];
    return j(T, $, d), D.object(...d);
  }
  function L({ errorPath: T }, { instancePath: $ }) {
    const O = $ ? (0, r.str)`${T}${(0, n.getErrorPath)($, n.Type.Str)}` : T;
    return [a.default.instancePath, (0, r.strConcat)(a.default.instancePath, O)];
  }
  function R({ keyword: T, it: { errSchemaPath: $ } }, { schemaPath: O, parentSchema: D }) {
    let t = D ? $ : (0, r.str)`${$}/${T}`;
    return O && (t = (0, r.str)`${t}${(0, n.getErrorPath)(O, n.Type.Str)}`), [g.schemaPath, t];
  }
  function j(T, { params: $, message: O }, D) {
    const { keyword: t, data: d, schemaValue: s, it: i } = T, { opts: c, propertyName: m, topSchemaRef: h, schemaPath: C } = i;
    D.push([g.keyword, t], [g.params, typeof $ == "function" ? $(T) : $ || (0, r._)`{}`]), c.messages && D.push([g.message, typeof O == "function" ? O(T) : O]), c.verbose && D.push([g.schema, s], [g.parentSchema, (0, r._)`${h}${C}`], [a.default.data, d]), m && D.push([g.propertyName, m]);
  }
})(et);
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.boolOrEmptySchema = Rr.topBoolOrEmptySchema = void 0;
const Ns = et, Rs = se, As = Qe, Is = {
  message: "boolean schema is false"
};
function Ms(e) {
  const { gen: r, schema: n, validateName: a } = e;
  n === !1 ? Cn(e, !1) : typeof n == "object" && n.$async === !0 ? r.return(As.default.data) : (r.assign((0, Rs._)`${a}.errors`, null), r.return(!0));
}
Rr.topBoolOrEmptySchema = Ms;
function Ds(e, r) {
  const { gen: n, schema: a } = e;
  a === !1 ? (n.var(r, !1), Cn(e)) : n.var(r, !0);
}
Rr.boolOrEmptySchema = Ds;
function Cn(e, r) {
  const { gen: n, data: a } = e, u = {
    gen: n,
    keyword: "false schema",
    data: a,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, Ns.reportError)(u, Is, void 0, r);
}
var rt = {}, vr = {};
Object.defineProperty(vr, "__esModule", { value: !0 });
vr.getRules = vr.isJSONType = void 0;
const Ls = ["string", "number", "integer", "boolean", "null", "object", "array"], zs = new Set(Ls);
function Vs(e) {
  return typeof e == "string" && zs.has(e);
}
vr.isJSONType = Vs;
function Fs() {
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
vr.getRules = Fs;
var rr = {};
Object.defineProperty(rr, "__esModule", { value: !0 });
rr.shouldUseRule = rr.shouldUseGroup = rr.schemaHasRulesForType = void 0;
function Us({ schema: e, self: r }, n) {
  const a = r.RULES.types[n];
  return a && a !== !0 && Tn(e, a);
}
rr.schemaHasRulesForType = Us;
function Tn(e, r) {
  return r.rules.some((n) => jn(e, n));
}
rr.shouldUseGroup = Tn;
function jn(e, r) {
  var n;
  return e[r.keyword] !== void 0 || ((n = r.definition.implements) === null || n === void 0 ? void 0 : n.some((a) => e[a] !== void 0));
}
rr.shouldUseRule = jn;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.reportTypeError = e.checkDataTypes = e.checkDataType = e.coerceAndCheckDataType = e.getJSONTypes = e.getSchemaTypes = e.DataType = void 0;
  const r = vr, n = rr, a = et, u = se, o = ie;
  var p;
  (function(D) {
    D[D.Correct = 0] = "Correct", D[D.Wrong = 1] = "Wrong";
  })(p = e.DataType || (e.DataType = {}));
  function y(D) {
    const t = b(D.type);
    if (t.includes("null")) {
      if (D.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!t.length && D.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      D.nullable === !0 && t.push("null");
    }
    return t;
  }
  e.getSchemaTypes = y;
  function b(D) {
    const t = Array.isArray(D) ? D : D ? [D] : [];
    if (t.every(r.isJSONType))
      return t;
    throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
  }
  e.getJSONTypes = b;
  function v(D, t) {
    const { gen: d, data: s, opts: i } = D, c = S(t, i.coerceTypes), m = t.length > 0 && !(c.length === 0 && t.length === 1 && (0, n.schemaHasRulesForType)(D, t[0]));
    if (m) {
      const h = j(t, s, i.strictNumbers, p.Wrong);
      d.if(h, () => {
        c.length ? z(D, t, c) : $(D);
      });
    }
    return m;
  }
  e.coerceAndCheckDataType = v;
  const g = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function S(D, t) {
    return t ? D.filter((d) => g.has(d) || t === "array" && d === "array") : [];
  }
  function z(D, t, d) {
    const { gen: s, data: i, opts: c } = D, m = s.let("dataType", (0, u._)`typeof ${i}`), h = s.let("coerced", (0, u._)`undefined`);
    c.coerceTypes === "array" && s.if((0, u._)`${m} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => s.assign(i, (0, u._)`${i}[0]`).assign(m, (0, u._)`typeof ${i}`).if(j(t, i, c.strictNumbers), () => s.assign(h, i))), s.if((0, u._)`${h} !== undefined`);
    for (const U of d)
      (g.has(U) || U === "array" && c.coerceTypes === "array") && C(U);
    s.else(), $(D), s.endIf(), s.if((0, u._)`${h} !== undefined`, () => {
      s.assign(i, h), L(D, h);
    });
    function C(U) {
      switch (U) {
        case "string":
          s.elseIf((0, u._)`${m} == "number" || ${m} == "boolean"`).assign(h, (0, u._)`"" + ${i}`).elseIf((0, u._)`${i} === null`).assign(h, (0, u._)`""`);
          return;
        case "number":
          s.elseIf((0, u._)`${m} == "boolean" || ${i} === null
              || (${m} == "string" && ${i} && ${i} == +${i})`).assign(h, (0, u._)`+${i}`);
          return;
        case "integer":
          s.elseIf((0, u._)`${m} === "boolean" || ${i} === null
              || (${m} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(h, (0, u._)`+${i}`);
          return;
        case "boolean":
          s.elseIf((0, u._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(h, !1).elseIf((0, u._)`${i} === "true" || ${i} === 1`).assign(h, !0);
          return;
        case "null":
          s.elseIf((0, u._)`${i} === "" || ${i} === 0 || ${i} === false`), s.assign(h, null);
          return;
        case "array":
          s.elseIf((0, u._)`${m} === "string" || ${m} === "number"
              || ${m} === "boolean" || ${i} === null`).assign(h, (0, u._)`[${i}]`);
      }
    }
  }
  function L({ gen: D, parentData: t, parentDataProperty: d }, s) {
    D.if((0, u._)`${t} !== undefined`, () => D.assign((0, u._)`${t}[${d}]`, s));
  }
  function R(D, t, d, s = p.Correct) {
    const i = s === p.Correct ? u.operators.EQ : u.operators.NEQ;
    let c;
    switch (D) {
      case "null":
        return (0, u._)`${t} ${i} null`;
      case "array":
        c = (0, u._)`Array.isArray(${t})`;
        break;
      case "object":
        c = (0, u._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
        break;
      case "integer":
        c = m((0, u._)`!(${t} % 1) && !isNaN(${t})`);
        break;
      case "number":
        c = m();
        break;
      default:
        return (0, u._)`typeof ${t} ${i} ${D}`;
    }
    return s === p.Correct ? c : (0, u.not)(c);
    function m(h = u.nil) {
      return (0, u.and)((0, u._)`typeof ${t} == "number"`, h, d ? (0, u._)`isFinite(${t})` : u.nil);
    }
  }
  e.checkDataType = R;
  function j(D, t, d, s) {
    if (D.length === 1)
      return R(D[0], t, d, s);
    let i;
    const c = (0, o.toHash)(D);
    if (c.array && c.object) {
      const m = (0, u._)`typeof ${t} != "object"`;
      i = c.null ? m : (0, u._)`!${t} || ${m}`, delete c.null, delete c.array, delete c.object;
    } else
      i = u.nil;
    c.number && delete c.integer;
    for (const m in c)
      i = (0, u.and)(i, R(m, t, d, s));
    return i;
  }
  e.checkDataTypes = j;
  const T = {
    message: ({ schema: D }) => `must be ${D}`,
    params: ({ schema: D, schemaValue: t }) => typeof D == "string" ? (0, u._)`{type: ${D}}` : (0, u._)`{type: ${t}}`
  };
  function $(D) {
    const t = O(D);
    (0, a.reportError)(t, T);
  }
  e.reportTypeError = $;
  function O(D) {
    const { gen: t, data: d, schema: s } = D, i = (0, o.schemaRefOrVal)(D, s, "type");
    return {
      gen: t,
      keyword: "type",
      data: d,
      schema: s.type,
      schemaCode: i,
      schemaValue: i,
      parentSchema: s,
      params: {},
      it: D
    };
  }
})(rt);
var Ct = {};
Object.defineProperty(Ct, "__esModule", { value: !0 });
Ct.assignDefaults = void 0;
const Sr = se, Bs = ie;
function Hs(e, r) {
  const { properties: n, items: a } = e.schema;
  if (r === "object" && n)
    for (const u in n)
      Ka(e, u, n[u].default);
  else
    r === "array" && Array.isArray(a) && a.forEach((u, o) => Ka(e, o, u.default));
}
Ct.assignDefaults = Hs;
function Ka(e, r, n) {
  const { gen: a, compositeRule: u, data: o, opts: p } = e;
  if (n === void 0)
    return;
  const y = (0, Sr._)`${o}${(0, Sr.getProperty)(r)}`;
  if (u) {
    (0, Bs.checkStrictMode)(e, `default is ignored for: ${y}`);
    return;
  }
  let b = (0, Sr._)`${y} === undefined`;
  p.useDefaults === "empty" && (b = (0, Sr._)`${b} || ${y} === null || ${y} === ""`), a.if(b, (0, Sr._)`${y} = ${(0, Sr.stringify)(n)}`);
}
var Xe = {}, ne = {};
Object.defineProperty(ne, "__esModule", { value: !0 });
ne.validateUnion = ne.validateArray = ne.usePattern = ne.callValidateCode = ne.schemaProperties = ne.allSchemaProperties = ne.noPropertyInData = ne.propertyInData = ne.isOwnProperty = ne.hasPropFunc = ne.reportMissingProp = ne.checkMissingProp = ne.checkReportMissingProp = void 0;
const pe = se, Kt = ie, nr = Qe, qs = ie;
function Gs(e, r) {
  const { gen: n, data: a, it: u } = e;
  n.if(Jt(n, a, r, u.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, pe._)`${r}` }, !0), e.error();
  });
}
ne.checkReportMissingProp = Gs;
function Ks({ gen: e, data: r, it: { opts: n } }, a, u) {
  return (0, pe.or)(...a.map((o) => (0, pe.and)(Jt(e, r, o, n.ownProperties), (0, pe._)`${u} = ${o}`)));
}
ne.checkMissingProp = Ks;
function Ws(e, r) {
  e.setParams({ missingProperty: r }, !0), e.error();
}
ne.reportMissingProp = Ws;
function On(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, pe._)`Object.prototype.hasOwnProperty`
  });
}
ne.hasPropFunc = On;
function Wt(e, r, n) {
  return (0, pe._)`${On(e)}.call(${r}, ${n})`;
}
ne.isOwnProperty = Wt;
function Js(e, r, n, a) {
  const u = (0, pe._)`${r}${(0, pe.getProperty)(n)} !== undefined`;
  return a ? (0, pe._)`${u} && ${Wt(e, r, n)}` : u;
}
ne.propertyInData = Js;
function Jt(e, r, n, a) {
  const u = (0, pe._)`${r}${(0, pe.getProperty)(n)} === undefined`;
  return a ? (0, pe.or)(u, (0, pe.not)(Wt(e, r, n))) : u;
}
ne.noPropertyInData = Jt;
function Nn(e) {
  return e ? Object.keys(e).filter((r) => r !== "__proto__") : [];
}
ne.allSchemaProperties = Nn;
function Zs(e, r) {
  return Nn(r).filter((n) => !(0, Kt.alwaysValidSchema)(e, r[n]));
}
ne.schemaProperties = Zs;
function Ys({ schemaCode: e, data: r, it: { gen: n, topSchemaRef: a, schemaPath: u, errorPath: o }, it: p }, y, b, v) {
  const g = v ? (0, pe._)`${e}, ${r}, ${a}${u}` : r, S = [
    [nr.default.instancePath, (0, pe.strConcat)(nr.default.instancePath, o)],
    [nr.default.parentData, p.parentData],
    [nr.default.parentDataProperty, p.parentDataProperty],
    [nr.default.rootData, nr.default.rootData]
  ];
  p.opts.dynamicRef && S.push([nr.default.dynamicAnchors, nr.default.dynamicAnchors]);
  const z = (0, pe._)`${g}, ${n.object(...S)}`;
  return b !== pe.nil ? (0, pe._)`${y}.call(${b}, ${z})` : (0, pe._)`${y}(${z})`;
}
ne.callValidateCode = Ys;
const Xs = (0, pe._)`new RegExp`;
function Qs({ gen: e, it: { opts: r } }, n) {
  const a = r.unicodeRegExp ? "u" : "", { regExp: u } = r.code, o = u(n, a);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, pe._)`${u.code === "new RegExp" ? Xs : (0, qs.useFunc)(e, u)}(${n}, ${a})`
  });
}
ne.usePattern = Qs;
function xs(e) {
  const { gen: r, data: n, keyword: a, it: u } = e, o = r.name("valid");
  if (u.allErrors) {
    const y = r.let("valid", !0);
    return p(() => r.assign(y, !1)), y;
  }
  return r.var(o, !0), p(() => r.break()), o;
  function p(y) {
    const b = r.const("len", (0, pe._)`${n}.length`);
    r.forRange("i", 0, b, (v) => {
      e.subschema({
        keyword: a,
        dataProp: v,
        dataPropType: Kt.Type.Num
      }, o), r.if((0, pe.not)(o), y);
    });
  }
}
ne.validateArray = xs;
function ed(e) {
  const { gen: r, schema: n, keyword: a, it: u } = e;
  if (!Array.isArray(n))
    throw new Error("ajv implementation error");
  if (n.some((b) => (0, Kt.alwaysValidSchema)(u, b)) && !u.opts.unevaluated)
    return;
  const p = r.let("valid", !1), y = r.name("_valid");
  r.block(() => n.forEach((b, v) => {
    const g = e.subschema({
      keyword: a,
      schemaProp: v,
      compositeRule: !0
    }, y);
    r.assign(p, (0, pe._)`${p} || ${y}`), e.mergeValidEvaluated(g, y) || r.if((0, pe.not)(p));
  })), e.result(p, () => e.reset(), () => e.error(!0));
}
ne.validateUnion = ed;
Object.defineProperty(Xe, "__esModule", { value: !0 });
Xe.validateKeywordUsage = Xe.validSchemaType = Xe.funcKeywordCode = Xe.macroKeywordCode = void 0;
const Se = se, mr = Qe, rd = ne, td = et;
function ad(e, r) {
  const { gen: n, keyword: a, schema: u, parentSchema: o, it: p } = e, y = r.macro.call(p.self, u, o, p), b = Rn(n, a, y);
  p.opts.validateSchema !== !1 && p.self.validateSchema(y, !0);
  const v = n.name("valid");
  e.subschema({
    schema: y,
    schemaPath: Se.nil,
    errSchemaPath: `${p.errSchemaPath}/${a}`,
    topSchemaRef: b,
    compositeRule: !0
  }, v), e.pass(v, () => e.error(!0));
}
Xe.macroKeywordCode = ad;
function nd(e, r) {
  var n;
  const { gen: a, keyword: u, schema: o, parentSchema: p, $data: y, it: b } = e;
  dd(b, r);
  const v = !y && r.compile ? r.compile.call(b.self, o, p, b) : r.validate, g = Rn(a, u, v), S = a.let("valid");
  e.block$data(S, z), e.ok((n = r.valid) !== null && n !== void 0 ? n : S);
  function z() {
    if (r.errors === !1)
      j(), r.modifying && Wa(e), T(() => e.error());
    else {
      const $ = r.async ? L() : R();
      r.modifying && Wa(e), T(() => sd(e, $));
    }
  }
  function L() {
    const $ = a.let("ruleErrs", null);
    return a.try(() => j((0, Se._)`await `), (O) => a.assign(S, !1).if((0, Se._)`${O} instanceof ${b.ValidationError}`, () => a.assign($, (0, Se._)`${O}.errors`), () => a.throw(O))), $;
  }
  function R() {
    const $ = (0, Se._)`${g}.errors`;
    return a.assign($, null), j(Se.nil), $;
  }
  function j($ = r.async ? (0, Se._)`await ` : Se.nil) {
    const O = b.opts.passContext ? mr.default.this : mr.default.self, D = !("compile" in r && !y || r.schema === !1);
    a.assign(S, (0, Se._)`${$}${(0, rd.callValidateCode)(e, g, O, D)}`, r.modifying);
  }
  function T($) {
    var O;
    a.if((0, Se.not)((O = r.valid) !== null && O !== void 0 ? O : S), $);
  }
}
Xe.funcKeywordCode = nd;
function Wa(e) {
  const { gen: r, data: n, it: a } = e;
  r.if(a.parentData, () => r.assign(n, (0, Se._)`${a.parentData}[${a.parentDataProperty}]`));
}
function sd(e, r) {
  const { gen: n } = e;
  n.if((0, Se._)`Array.isArray(${r})`, () => {
    n.assign(mr.default.vErrors, (0, Se._)`${mr.default.vErrors} === null ? ${r} : ${mr.default.vErrors}.concat(${r})`).assign(mr.default.errors, (0, Se._)`${mr.default.vErrors}.length`), (0, td.extendErrors)(e);
  }, () => e.error());
}
function dd({ schemaEnv: e }, r) {
  if (r.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Rn(e, r, n) {
  if (n === void 0)
    throw new Error(`keyword "${r}" failed to compile`);
  return e.scopeValue("keyword", typeof n == "function" ? { ref: n } : { ref: n, code: (0, Se.stringify)(n) });
}
function ud(e, r, n = !1) {
  return !r.length || r.some((a) => a === "array" ? Array.isArray(e) : a === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == a || n && typeof e > "u");
}
Xe.validSchemaType = ud;
function id({ schema: e, opts: r, self: n, errSchemaPath: a }, u, o) {
  if (Array.isArray(u.keyword) ? !u.keyword.includes(o) : u.keyword !== o)
    throw new Error("ajv implementation error");
  const p = u.dependencies;
  if (p != null && p.some((y) => !Object.prototype.hasOwnProperty.call(e, y)))
    throw new Error(`parent schema must have dependencies of ${o}: ${p.join(",")}`);
  if (u.validateSchema && !u.validateSchema(e[o])) {
    const b = `keyword "${o}" value is invalid at path "${a}": ` + n.errorsText(u.validateSchema.errors);
    if (r.validateSchema === "log")
      n.logger.error(b);
    else
      throw new Error(b);
  }
}
Xe.validateKeywordUsage = id;
var ir = {};
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.extendSubschemaMode = ir.extendSubschemaData = ir.getSubschema = void 0;
const Ye = se, An = ie;
function od(e, { keyword: r, schemaProp: n, schema: a, schemaPath: u, errSchemaPath: o, topSchemaRef: p }) {
  if (r !== void 0 && a !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (r !== void 0) {
    const y = e.schema[r];
    return n === void 0 ? {
      schema: y,
      schemaPath: (0, Ye._)`${e.schemaPath}${(0, Ye.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${r}`
    } : {
      schema: y[n],
      schemaPath: (0, Ye._)`${e.schemaPath}${(0, Ye.getProperty)(r)}${(0, Ye.getProperty)(n)}`,
      errSchemaPath: `${e.errSchemaPath}/${r}/${(0, An.escapeFragment)(n)}`
    };
  }
  if (a !== void 0) {
    if (u === void 0 || o === void 0 || p === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: a,
      schemaPath: u,
      topSchemaRef: p,
      errSchemaPath: o
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
ir.getSubschema = od;
function cd(e, r, { dataProp: n, dataPropType: a, data: u, dataTypes: o, propertyName: p }) {
  if (u !== void 0 && n !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: y } = r;
  if (n !== void 0) {
    const { errorPath: v, dataPathArr: g, opts: S } = r, z = y.let("data", (0, Ye._)`${r.data}${(0, Ye.getProperty)(n)}`, !0);
    b(z), e.errorPath = (0, Ye.str)`${v}${(0, An.getErrorPath)(n, a, S.jsPropertySyntax)}`, e.parentDataProperty = (0, Ye._)`${n}`, e.dataPathArr = [...g, e.parentDataProperty];
  }
  if (u !== void 0) {
    const v = u instanceof Ye.Name ? u : y.let("data", u, !0);
    b(v), p !== void 0 && (e.propertyName = p);
  }
  o && (e.dataTypes = o);
  function b(v) {
    e.data = v, e.dataLevel = r.dataLevel + 1, e.dataTypes = [], r.definedProperties = /* @__PURE__ */ new Set(), e.parentData = r.data, e.dataNames = [...r.dataNames, v];
  }
}
ir.extendSubschemaData = cd;
function ld(e, { jtdDiscriminator: r, jtdMetadata: n, compositeRule: a, createErrors: u, allErrors: o }) {
  a !== void 0 && (e.compositeRule = a), u !== void 0 && (e.createErrors = u), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = r, e.jtdMetadata = n;
}
ir.extendSubschemaMode = ld;
var ke = {}, In = function e(r, n) {
  if (r === n)
    return !0;
  if (r && n && typeof r == "object" && typeof n == "object") {
    if (r.constructor !== n.constructor)
      return !1;
    var a, u, o;
    if (Array.isArray(r)) {
      if (a = r.length, a != n.length)
        return !1;
      for (u = a; u-- !== 0; )
        if (!e(r[u], n[u]))
          return !1;
      return !0;
    }
    if (r.constructor === RegExp)
      return r.source === n.source && r.flags === n.flags;
    if (r.valueOf !== Object.prototype.valueOf)
      return r.valueOf() === n.valueOf();
    if (r.toString !== Object.prototype.toString)
      return r.toString() === n.toString();
    if (o = Object.keys(r), a = o.length, a !== Object.keys(n).length)
      return !1;
    for (u = a; u-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(n, o[u]))
        return !1;
    for (u = a; u-- !== 0; ) {
      var p = o[u];
      if (!e(r[p], n[p]))
        return !1;
    }
    return !0;
  }
  return r !== r && n !== n;
}, Mn = { exports: {} }, ur = Mn.exports = function(e, r, n) {
  typeof r == "function" && (n = r, r = {}), n = r.cb || n;
  var a = typeof n == "function" ? n : n.pre || function() {
  }, u = n.post || function() {
  };
  mt(r, a, u, e, "", e);
};
ur.keywords = {
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
ur.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
ur.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
ur.skipKeywords = {
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
function mt(e, r, n, a, u, o, p, y, b, v) {
  if (a && typeof a == "object" && !Array.isArray(a)) {
    r(a, u, o, p, y, b, v);
    for (var g in a) {
      var S = a[g];
      if (Array.isArray(S)) {
        if (g in ur.arrayKeywords)
          for (var z = 0; z < S.length; z++)
            mt(e, r, n, S[z], u + "/" + g + "/" + z, o, u, g, a, z);
      } else if (g in ur.propsKeywords) {
        if (S && typeof S == "object")
          for (var L in S)
            mt(e, r, n, S[L], u + "/" + g + "/" + fd(L), o, u, g, a, L);
      } else
        (g in ur.keywords || e.allKeys && !(g in ur.skipKeywords)) && mt(e, r, n, S, u + "/" + g, o, u, g, a);
    }
    n(a, u, o, p, y, b, v);
  }
}
function fd(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var hd = Mn.exports;
Object.defineProperty(ke, "__esModule", { value: !0 });
ke.getSchemaRefs = ke.resolveUrl = ke.normalizeId = ke._getFullPath = ke.getFullPath = ke.inlineRef = void 0;
const pd = ie, md = In, gd = hd, _d = /* @__PURE__ */ new Set([
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
function vd(e, r = !0) {
  return typeof e == "boolean" ? !0 : r === !0 ? !Ft(e) : r ? Dn(e) <= r : !1;
}
ke.inlineRef = vd;
const yd = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Ft(e) {
  for (const r in e) {
    if (yd.has(r))
      return !0;
    const n = e[r];
    if (Array.isArray(n) && n.some(Ft) || typeof n == "object" && Ft(n))
      return !0;
  }
  return !1;
}
function Dn(e) {
  let r = 0;
  for (const n in e) {
    if (n === "$ref")
      return 1 / 0;
    if (r++, !_d.has(n) && (typeof e[n] == "object" && (0, pd.eachItem)(e[n], (a) => r += Dn(a)), r === 1 / 0))
      return 1 / 0;
  }
  return r;
}
function Ln(e, r = "", n) {
  n !== !1 && (r = Or(r));
  const a = e.parse(r);
  return zn(e, a);
}
ke.getFullPath = Ln;
function zn(e, r) {
  return e.serialize(r).split("#")[0] + "#";
}
ke._getFullPath = zn;
const wd = /#\/?$/;
function Or(e) {
  return e ? e.replace(wd, "") : "";
}
ke.normalizeId = Or;
function bd(e, r, n) {
  return n = Or(n), e.resolve(r, n);
}
ke.resolveUrl = bd;
const $d = /^[a-z_][-a-z0-9._]*$/i;
function Ed(e, r) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: n, uriResolver: a } = this.opts, u = Or(e[n] || r), o = { "": u }, p = Ln(a, u, !1), y = {}, b = /* @__PURE__ */ new Set();
  return gd(e, { allKeys: !0 }, (S, z, L, R) => {
    if (R === void 0)
      return;
    const j = p + z;
    let T = o[R];
    typeof S[n] == "string" && (T = $.call(this, S[n])), O.call(this, S.$anchor), O.call(this, S.$dynamicAnchor), o[z] = T;
    function $(D) {
      const t = this.opts.uriResolver.resolve;
      if (D = Or(T ? t(T, D) : D), b.has(D))
        throw g(D);
      b.add(D);
      let d = this.refs[D];
      return typeof d == "string" && (d = this.refs[d]), typeof d == "object" ? v(S, d.schema, D) : D !== Or(j) && (D[0] === "#" ? (v(S, y[D], D), y[D] = S) : this.refs[D] = j), D;
    }
    function O(D) {
      if (typeof D == "string") {
        if (!$d.test(D))
          throw new Error(`invalid anchor "${D}"`);
        $.call(this, `#${D}`);
      }
    }
  }), y;
  function v(S, z, L) {
    if (z !== void 0 && !md(S, z))
      throw g(L);
  }
  function g(S) {
    return new Error(`reference "${S}" resolves to more than one schema`);
  }
}
ke.getSchemaRefs = Ed;
Object.defineProperty(He, "__esModule", { value: !0 });
He.getData = He.KeywordCxt = He.validateFunctionCode = void 0;
const Vn = Rr, Ja = rt, Zt = rr, wt = rt, kd = Ct, Jr = Xe, Rt = ir, Y = se, x = Qe, Pd = ke, tr = ie, Gr = et;
function Sd(e) {
  if (Bn(e) && (Hn(e), Un(e))) {
    jd(e);
    return;
  }
  Fn(e, () => (0, Vn.topBoolOrEmptySchema)(e));
}
He.validateFunctionCode = Sd;
function Fn({ gen: e, validateName: r, schema: n, schemaEnv: a, opts: u }, o) {
  u.code.es5 ? e.func(r, (0, Y._)`${x.default.data}, ${x.default.valCxt}`, a.$async, () => {
    e.code((0, Y._)`"use strict"; ${Za(n, u)}`), Td(e, u), e.code(o);
  }) : e.func(r, (0, Y._)`${x.default.data}, ${Cd(u)}`, a.$async, () => e.code(Za(n, u)).code(o));
}
function Cd(e) {
  return (0, Y._)`{${x.default.instancePath}="", ${x.default.parentData}, ${x.default.parentDataProperty}, ${x.default.rootData}=${x.default.data}${e.dynamicRef ? (0, Y._)`, ${x.default.dynamicAnchors}={}` : Y.nil}}={}`;
}
function Td(e, r) {
  e.if(x.default.valCxt, () => {
    e.var(x.default.instancePath, (0, Y._)`${x.default.valCxt}.${x.default.instancePath}`), e.var(x.default.parentData, (0, Y._)`${x.default.valCxt}.${x.default.parentData}`), e.var(x.default.parentDataProperty, (0, Y._)`${x.default.valCxt}.${x.default.parentDataProperty}`), e.var(x.default.rootData, (0, Y._)`${x.default.valCxt}.${x.default.rootData}`), r.dynamicRef && e.var(x.default.dynamicAnchors, (0, Y._)`${x.default.valCxt}.${x.default.dynamicAnchors}`);
  }, () => {
    e.var(x.default.instancePath, (0, Y._)`""`), e.var(x.default.parentData, (0, Y._)`undefined`), e.var(x.default.parentDataProperty, (0, Y._)`undefined`), e.var(x.default.rootData, x.default.data), r.dynamicRef && e.var(x.default.dynamicAnchors, (0, Y._)`{}`);
  });
}
function jd(e) {
  const { schema: r, opts: n, gen: a } = e;
  Fn(e, () => {
    n.$comment && r.$comment && Gn(e), Id(e), a.let(x.default.vErrors, null), a.let(x.default.errors, 0), n.unevaluated && Od(e), qn(e), Ld(e);
  });
}
function Od(e) {
  const { gen: r, validateName: n } = e;
  e.evaluated = r.const("evaluated", (0, Y._)`${n}.evaluated`), r.if((0, Y._)`${e.evaluated}.dynamicProps`, () => r.assign((0, Y._)`${e.evaluated}.props`, (0, Y._)`undefined`)), r.if((0, Y._)`${e.evaluated}.dynamicItems`, () => r.assign((0, Y._)`${e.evaluated}.items`, (0, Y._)`undefined`));
}
function Za(e, r) {
  const n = typeof e == "object" && e[r.schemaId];
  return n && (r.code.source || r.code.process) ? (0, Y._)`/*# sourceURL=${n} */` : Y.nil;
}
function Nd(e, r) {
  if (Bn(e) && (Hn(e), Un(e))) {
    Rd(e, r);
    return;
  }
  (0, Vn.boolOrEmptySchema)(e, r);
}
function Un({ schema: e, self: r }) {
  if (typeof e == "boolean")
    return !e;
  for (const n in e)
    if (r.RULES.all[n])
      return !0;
  return !1;
}
function Bn(e) {
  return typeof e.schema != "boolean";
}
function Rd(e, r) {
  const { schema: n, gen: a, opts: u } = e;
  u.$comment && n.$comment && Gn(e), Md(e), Dd(e);
  const o = a.const("_errs", x.default.errors);
  qn(e, o), a.var(r, (0, Y._)`${o} === ${x.default.errors}`);
}
function Hn(e) {
  (0, tr.checkUnknownRules)(e), Ad(e);
}
function qn(e, r) {
  if (e.opts.jtd)
    return Ya(e, [], !1, r);
  const n = (0, Ja.getSchemaTypes)(e.schema), a = (0, Ja.coerceAndCheckDataType)(e, n);
  Ya(e, n, !a, r);
}
function Ad(e) {
  const { schema: r, errSchemaPath: n, opts: a, self: u } = e;
  r.$ref && a.ignoreKeywordsWithRef && (0, tr.schemaHasRulesButRef)(r, u.RULES) && u.logger.warn(`$ref: keywords ignored in schema at path "${n}"`);
}
function Id(e) {
  const { schema: r, opts: n } = e;
  r.default !== void 0 && n.useDefaults && n.strictSchema && (0, tr.checkStrictMode)(e, "default is ignored in the schema root");
}
function Md(e) {
  const r = e.schema[e.opts.schemaId];
  r && (e.baseId = (0, Pd.resolveUrl)(e.opts.uriResolver, e.baseId, r));
}
function Dd(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Gn({ gen: e, schemaEnv: r, schema: n, errSchemaPath: a, opts: u }) {
  const o = n.$comment;
  if (u.$comment === !0)
    e.code((0, Y._)`${x.default.self}.logger.log(${o})`);
  else if (typeof u.$comment == "function") {
    const p = (0, Y.str)`${a}/$comment`, y = e.scopeValue("root", { ref: r.root });
    e.code((0, Y._)`${x.default.self}.opts.$comment(${o}, ${p}, ${y}.schema)`);
  }
}
function Ld(e) {
  const { gen: r, schemaEnv: n, validateName: a, ValidationError: u, opts: o } = e;
  n.$async ? r.if((0, Y._)`${x.default.errors} === 0`, () => r.return(x.default.data), () => r.throw((0, Y._)`new ${u}(${x.default.vErrors})`)) : (r.assign((0, Y._)`${a}.errors`, x.default.vErrors), o.unevaluated && zd(e), r.return((0, Y._)`${x.default.errors} === 0`));
}
function zd({ gen: e, evaluated: r, props: n, items: a }) {
  n instanceof Y.Name && e.assign((0, Y._)`${r}.props`, n), a instanceof Y.Name && e.assign((0, Y._)`${r}.items`, a);
}
function Ya(e, r, n, a) {
  const { gen: u, schema: o, data: p, allErrors: y, opts: b, self: v } = e, { RULES: g } = v;
  if (o.$ref && (b.ignoreKeywordsWithRef || !(0, tr.schemaHasRulesButRef)(o, g))) {
    u.block(() => Jn(e, "$ref", g.all.$ref.definition));
    return;
  }
  b.jtd || Vd(e, r), u.block(() => {
    for (const z of g.rules)
      S(z);
    S(g.post);
  });
  function S(z) {
    (0, Zt.shouldUseGroup)(o, z) && (z.type ? (u.if((0, wt.checkDataType)(z.type, p, b.strictNumbers)), Xa(e, z), r.length === 1 && r[0] === z.type && n && (u.else(), (0, wt.reportTypeError)(e)), u.endIf()) : Xa(e, z), y || u.if((0, Y._)`${x.default.errors} === ${a || 0}`));
  }
}
function Xa(e, r) {
  const { gen: n, schema: a, opts: { useDefaults: u } } = e;
  u && (0, kd.assignDefaults)(e, r.type), n.block(() => {
    for (const o of r.rules)
      (0, Zt.shouldUseRule)(a, o) && Jn(e, o.keyword, o.definition, r.type);
  });
}
function Vd(e, r) {
  e.schemaEnv.meta || !e.opts.strictTypes || (Fd(e, r), e.opts.allowUnionTypes || Ud(e, r), Bd(e, e.dataTypes));
}
function Fd(e, r) {
  if (r.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = r;
      return;
    }
    r.forEach((n) => {
      Kn(e.dataTypes, n) || Yt(e, `type "${n}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), qd(e, r);
  }
}
function Ud(e, r) {
  r.length > 1 && !(r.length === 2 && r.includes("null")) && Yt(e, "use allowUnionTypes to allow union type keyword");
}
function Bd(e, r) {
  const n = e.self.RULES.all;
  for (const a in n) {
    const u = n[a];
    if (typeof u == "object" && (0, Zt.shouldUseRule)(e.schema, u)) {
      const { type: o } = u.definition;
      o.length && !o.some((p) => Hd(r, p)) && Yt(e, `missing type "${o.join(",")}" for keyword "${a}"`);
    }
  }
}
function Hd(e, r) {
  return e.includes(r) || r === "number" && e.includes("integer");
}
function Kn(e, r) {
  return e.includes(r) || r === "integer" && e.includes("number");
}
function qd(e, r) {
  const n = [];
  for (const a of e.dataTypes)
    Kn(r, a) ? n.push(a) : r.includes("integer") && a === "number" && n.push("integer");
  e.dataTypes = n;
}
function Yt(e, r) {
  const n = e.schemaEnv.baseId + e.errSchemaPath;
  r += ` at "${n}" (strictTypes)`, (0, tr.checkStrictMode)(e, r, e.opts.strictTypes);
}
class Wn {
  constructor(r, n, a) {
    if ((0, Jr.validateKeywordUsage)(r, n, a), this.gen = r.gen, this.allErrors = r.allErrors, this.keyword = a, this.data = r.data, this.schema = r.schema[a], this.$data = n.$data && r.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, tr.schemaRefOrVal)(r, this.schema, a, this.$data), this.schemaType = n.schemaType, this.parentSchema = r.schema, this.params = {}, this.it = r, this.def = n, this.$data)
      this.schemaCode = r.gen.const("vSchema", Zn(this.$data, r));
    else if (this.schemaCode = this.schemaValue, !(0, Jr.validSchemaType)(this.schema, n.schemaType, n.allowUndefined))
      throw new Error(`${a} value must be ${JSON.stringify(n.schemaType)}`);
    ("code" in n ? n.trackErrors : n.errors !== !1) && (this.errsCount = r.gen.const("_errs", x.default.errors));
  }
  result(r, n, a) {
    this.failResult((0, Y.not)(r), n, a);
  }
  failResult(r, n, a) {
    this.gen.if(r), a ? a() : this.error(), n ? (this.gen.else(), n(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(r, n) {
    this.failResult((0, Y.not)(r), void 0, n);
  }
  fail(r) {
    if (r === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(r), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(r) {
    if (!this.$data)
      return this.fail(r);
    const { schemaCode: n } = this;
    this.fail((0, Y._)`${n} !== undefined && (${(0, Y.or)(this.invalid$data(), r)})`);
  }
  error(r, n, a) {
    if (n) {
      this.setParams(n), this._error(r, a), this.setParams({});
      return;
    }
    this._error(r, a);
  }
  _error(r, n) {
    (r ? Gr.reportExtraError : Gr.reportError)(this, this.def.error, n);
  }
  $dataError() {
    (0, Gr.reportError)(this, this.def.$dataError || Gr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Gr.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(r) {
    this.allErrors || this.gen.if(r);
  }
  setParams(r, n) {
    n ? Object.assign(this.params, r) : this.params = r;
  }
  block$data(r, n, a = Y.nil) {
    this.gen.block(() => {
      this.check$data(r, a), n();
    });
  }
  check$data(r = Y.nil, n = Y.nil) {
    if (!this.$data)
      return;
    const { gen: a, schemaCode: u, schemaType: o, def: p } = this;
    a.if((0, Y.or)((0, Y._)`${u} === undefined`, n)), r !== Y.nil && a.assign(r, !0), (o.length || p.validateSchema) && (a.elseIf(this.invalid$data()), this.$dataError(), r !== Y.nil && a.assign(r, !1)), a.else();
  }
  invalid$data() {
    const { gen: r, schemaCode: n, schemaType: a, def: u, it: o } = this;
    return (0, Y.or)(p(), y());
    function p() {
      if (a.length) {
        if (!(n instanceof Y.Name))
          throw new Error("ajv implementation error");
        const b = Array.isArray(a) ? a : [a];
        return (0, Y._)`${(0, wt.checkDataTypes)(b, n, o.opts.strictNumbers, wt.DataType.Wrong)}`;
      }
      return Y.nil;
    }
    function y() {
      if (u.validateSchema) {
        const b = r.scopeValue("validate$data", { ref: u.validateSchema });
        return (0, Y._)`!${b}(${n})`;
      }
      return Y.nil;
    }
  }
  subschema(r, n) {
    const a = (0, Rt.getSubschema)(this.it, r);
    (0, Rt.extendSubschemaData)(a, this.it, r), (0, Rt.extendSubschemaMode)(a, r);
    const u = { ...this.it, ...a, items: void 0, props: void 0 };
    return Nd(u, n), u;
  }
  mergeEvaluated(r, n) {
    const { it: a, gen: u } = this;
    a.opts.unevaluated && (a.props !== !0 && r.props !== void 0 && (a.props = tr.mergeEvaluated.props(u, r.props, a.props, n)), a.items !== !0 && r.items !== void 0 && (a.items = tr.mergeEvaluated.items(u, r.items, a.items, n)));
  }
  mergeValidEvaluated(r, n) {
    const { it: a, gen: u } = this;
    if (a.opts.unevaluated && (a.props !== !0 || a.items !== !0))
      return u.if(n, () => this.mergeEvaluated(r, Y.Name)), !0;
  }
}
He.KeywordCxt = Wn;
function Jn(e, r, n, a) {
  const u = new Wn(e, n, r);
  "code" in n ? n.code(u, a) : u.$data && n.validate ? (0, Jr.funcKeywordCode)(u, n) : "macro" in n ? (0, Jr.macroKeywordCode)(u, n) : (n.compile || n.validate) && (0, Jr.funcKeywordCode)(u, n);
}
const Gd = /^\/(?:[^~]|~0|~1)*$/, Kd = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Zn(e, { dataLevel: r, dataNames: n, dataPathArr: a }) {
  let u, o;
  if (e === "")
    return x.default.rootData;
  if (e[0] === "/") {
    if (!Gd.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    u = e, o = x.default.rootData;
  } else {
    const v = Kd.exec(e);
    if (!v)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const g = +v[1];
    if (u = v[2], u === "#") {
      if (g >= r)
        throw new Error(b("property/index", g));
      return a[r - g];
    }
    if (g > r)
      throw new Error(b("data", g));
    if (o = n[r - g], !u)
      return o;
  }
  let p = o;
  const y = u.split("/");
  for (const v of y)
    v && (o = (0, Y._)`${o}${(0, Y.getProperty)((0, tr.unescapeJsonPointer)(v))}`, p = (0, Y._)`${p} && ${o}`);
  return p;
  function b(v, g) {
    return `Cannot access ${v} ${g} levels up, current level is ${r}`;
  }
}
He.getData = Zn;
var tt = {};
Object.defineProperty(tt, "__esModule", { value: !0 });
class Wd extends Error {
  constructor(r) {
    super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
  }
}
tt.default = Wd;
var at = {};
Object.defineProperty(at, "__esModule", { value: !0 });
const At = ke;
class Jd extends Error {
  constructor(r, n, a, u) {
    super(u || `can't resolve reference ${a} from id ${n}`), this.missingRef = (0, At.resolveUrl)(r, n, a), this.missingSchema = (0, At.normalizeId)((0, At.getFullPath)(r, this.missingRef));
  }
}
at.default = Jd;
var Re = {};
Object.defineProperty(Re, "__esModule", { value: !0 });
Re.resolveSchema = Re.getCompilingSchema = Re.resolveRef = Re.compileSchema = Re.SchemaEnv = void 0;
const Ve = se, Zd = tt, hr = Qe, Be = ke, Qa = ie, Yd = He;
class Tt {
  constructor(r) {
    var n;
    this.refs = {}, this.dynamicAnchors = {};
    let a;
    typeof r.schema == "object" && (a = r.schema), this.schema = r.schema, this.schemaId = r.schemaId, this.root = r.root || this, this.baseId = (n = r.baseId) !== null && n !== void 0 ? n : (0, Be.normalizeId)(a == null ? void 0 : a[r.schemaId || "$id"]), this.schemaPath = r.schemaPath, this.localRefs = r.localRefs, this.meta = r.meta, this.$async = a == null ? void 0 : a.$async, this.refs = {};
  }
}
Re.SchemaEnv = Tt;
function Xt(e) {
  const r = Yn.call(this, e);
  if (r)
    return r;
  const n = (0, Be.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: a, lines: u } = this.opts.code, { ownProperties: o } = this.opts, p = new Ve.CodeGen(this.scope, { es5: a, lines: u, ownProperties: o });
  let y;
  e.$async && (y = p.scopeValue("Error", {
    ref: Zd.default,
    code: (0, Ve._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const b = p.scopeName("validate");
  e.validateName = b;
  const v = {
    gen: p,
    allErrors: this.opts.allErrors,
    data: hr.default.data,
    parentData: hr.default.parentData,
    parentDataProperty: hr.default.parentDataProperty,
    dataNames: [hr.default.data],
    dataPathArr: [Ve.nil],
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: p.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ve.stringify)(e.schema) } : { ref: e.schema }),
    validateName: b,
    ValidationError: y,
    schema: e.schema,
    schemaEnv: e,
    rootId: n,
    baseId: e.baseId || n,
    schemaPath: Ve.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Ve._)`""`,
    opts: this.opts,
    self: this
  };
  let g;
  try {
    this._compilations.add(e), (0, Yd.validateFunctionCode)(v), p.optimize(this.opts.code.optimize);
    const S = p.toString();
    g = `${p.scopeRefs(hr.default.scope)}return ${S}`, this.opts.code.process && (g = this.opts.code.process(g, e));
    const L = new Function(`${hr.default.self}`, `${hr.default.scope}`, g)(this, this.scope.get());
    if (this.scope.value(b, { ref: L }), L.errors = null, L.schema = e.schema, L.schemaEnv = e, e.$async && (L.$async = !0), this.opts.code.source === !0 && (L.source = { validateName: b, validateCode: S, scopeValues: p._values }), this.opts.unevaluated) {
      const { props: R, items: j } = v;
      L.evaluated = {
        props: R instanceof Ve.Name ? void 0 : R,
        items: j instanceof Ve.Name ? void 0 : j,
        dynamicProps: R instanceof Ve.Name,
        dynamicItems: j instanceof Ve.Name
      }, L.source && (L.source.evaluated = (0, Ve.stringify)(L.evaluated));
    }
    return e.validate = L, e;
  } catch (S) {
    throw delete e.validate, delete e.validateName, g && this.logger.error("Error compiling schema, function code:", g), S;
  } finally {
    this._compilations.delete(e);
  }
}
Re.compileSchema = Xt;
function Xd(e, r, n) {
  var a;
  n = (0, Be.resolveUrl)(this.opts.uriResolver, r, n);
  const u = e.refs[n];
  if (u)
    return u;
  let o = eu.call(this, e, n);
  if (o === void 0) {
    const p = (a = e.localRefs) === null || a === void 0 ? void 0 : a[n], { schemaId: y } = this.opts;
    p && (o = new Tt({ schema: p, schemaId: y, root: e, baseId: r }));
  }
  if (o !== void 0)
    return e.refs[n] = Qd.call(this, o);
}
Re.resolveRef = Xd;
function Qd(e) {
  return (0, Be.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Xt.call(this, e);
}
function Yn(e) {
  for (const r of this._compilations)
    if (xd(r, e))
      return r;
}
Re.getCompilingSchema = Yn;
function xd(e, r) {
  return e.schema === r.schema && e.root === r.root && e.baseId === r.baseId;
}
function eu(e, r) {
  let n;
  for (; typeof (n = this.refs[r]) == "string"; )
    r = n;
  return n || this.schemas[r] || jt.call(this, e, r);
}
function jt(e, r) {
  const n = this.opts.uriResolver.parse(r), a = (0, Be._getFullPath)(this.opts.uriResolver, n);
  let u = (0, Be.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && a === u)
    return It.call(this, n, e);
  const o = (0, Be.normalizeId)(a), p = this.refs[o] || this.schemas[o];
  if (typeof p == "string") {
    const y = jt.call(this, e, p);
    return typeof (y == null ? void 0 : y.schema) != "object" ? void 0 : It.call(this, n, y);
  }
  if (typeof (p == null ? void 0 : p.schema) == "object") {
    if (p.validate || Xt.call(this, p), o === (0, Be.normalizeId)(r)) {
      const { schema: y } = p, { schemaId: b } = this.opts, v = y[b];
      return v && (u = (0, Be.resolveUrl)(this.opts.uriResolver, u, v)), new Tt({ schema: y, schemaId: b, root: e, baseId: u });
    }
    return It.call(this, n, p);
  }
}
Re.resolveSchema = jt;
const ru = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function It(e, { baseId: r, schema: n, root: a }) {
  var u;
  if (((u = e.fragment) === null || u === void 0 ? void 0 : u[0]) !== "/")
    return;
  for (const y of e.fragment.slice(1).split("/")) {
    if (typeof n == "boolean")
      return;
    const b = n[(0, Qa.unescapeFragment)(y)];
    if (b === void 0)
      return;
    n = b;
    const v = typeof n == "object" && n[this.opts.schemaId];
    !ru.has(y) && v && (r = (0, Be.resolveUrl)(this.opts.uriResolver, r, v));
  }
  let o;
  if (typeof n != "boolean" && n.$ref && !(0, Qa.schemaHasRulesButRef)(n, this.RULES)) {
    const y = (0, Be.resolveUrl)(this.opts.uriResolver, r, n.$ref);
    o = jt.call(this, a, y);
  }
  const { schemaId: p } = this.opts;
  if (o = o || new Tt({ schema: n, schemaId: p, root: a, baseId: r }), o.schema !== o.root.schema)
    return o;
}
const tu = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", au = "Meta-schema for $data reference (JSON AnySchema extension proposal)", nu = "object", su = [
  "$data"
], du = {
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
}, uu = !1, iu = {
  $id: tu,
  description: au,
  type: nu,
  required: su,
  properties: du,
  additionalProperties: uu
};
var Qt = {}, Ut = { exports: {} };
/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
(function(e, r) {
  (function(n, a) {
    a(r);
  })(kn, function(n) {
    function a() {
      for (var E = arguments.length, f = Array(E), P = 0; P < E; P++)
        f[P] = arguments[P];
      if (f.length > 1) {
        f[0] = f[0].slice(0, -1);
        for (var M = f.length - 1, A = 1; A < M; ++A)
          f[A] = f[A].slice(1, -1);
        return f[M] = f[M].slice(1), f.join("");
      } else
        return f[0];
    }
    function u(E) {
      return "(?:" + E + ")";
    }
    function o(E) {
      return E === void 0 ? "undefined" : E === null ? "null" : Object.prototype.toString.call(E).split(" ").pop().split("]").shift().toLowerCase();
    }
    function p(E) {
      return E.toUpperCase();
    }
    function y(E) {
      return E != null ? E instanceof Array ? E : typeof E.length != "number" || E.split || E.setInterval || E.call ? [E] : Array.prototype.slice.call(E) : [];
    }
    function b(E, f) {
      var P = E;
      if (f)
        for (var M in f)
          P[M] = f[M];
      return P;
    }
    function v(E) {
      var f = "[A-Za-z]", P = "[0-9]", M = a(P, "[A-Fa-f]"), A = u(u("%[EFef]" + M + "%" + M + M + "%" + M + M) + "|" + u("%[89A-Fa-f]" + M + "%" + M + M) + "|" + u("%" + M + M)), X = "[\\:\\/\\?\\#\\[\\]\\@]", Q = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", ue = a(X, Q), he = E ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]", _e = E ? "[\\uE000-\\uF8FF]" : "[]", de = a(f, P, "[\\-\\.\\_\\~]", he);
      u(f + a(f, P, "[\\+\\-\\.]") + "*"), u(u(A + "|" + a(de, Q, "[\\:]")) + "*");
      var ce = u(u("25[0-5]") + "|" + u("2[0-4]" + P) + "|" + u("1" + P + P) + "|" + u("0?[1-9]" + P) + "|0?0?" + P), ve = u(ce + "\\." + ce + "\\." + ce + "\\." + ce), ee = u(M + "{1,4}"), me = u(u(ee + "\\:" + ee) + "|" + ve), we = u(u(ee + "\\:") + "{6}" + me), ge = u("\\:\\:" + u(ee + "\\:") + "{5}" + me), ar = u(u(ee) + "?\\:\\:" + u(ee + "\\:") + "{4}" + me), Ke = u(u(u(ee + "\\:") + "{0,1}" + ee) + "?\\:\\:" + u(ee + "\\:") + "{3}" + me), We = u(u(u(ee + "\\:") + "{0,2}" + ee) + "?\\:\\:" + u(ee + "\\:") + "{2}" + me), Pr = u(u(u(ee + "\\:") + "{0,3}" + ee) + "?\\:\\:" + ee + "\\:" + me), lr = u(u(u(ee + "\\:") + "{0,4}" + ee) + "?\\:\\:" + me), Me = u(u(u(ee + "\\:") + "{0,5}" + ee) + "?\\:\\:" + ee), Je = u(u(u(ee + "\\:") + "{0,6}" + ee) + "?\\:\\:"), fr = u([we, ge, ar, Ke, We, Pr, lr, Me, Je].join("|")), er = u(u(de + "|" + A) + "+");
      u("[vV]" + M + "+\\." + a(de, Q, "[\\:]") + "+"), u(u(A + "|" + a(de, Q)) + "*");
      var Hr = u(A + "|" + a(de, Q, "[\\:\\@]"));
      return u(u(A + "|" + a(de, Q, "[\\@]")) + "+"), u(u(Hr + "|" + a("[\\/\\?]", _e)) + "*"), {
        NOT_SCHEME: new RegExp(a("[^]", f, P, "[\\+\\-\\.]"), "g"),
        NOT_USERINFO: new RegExp(a("[^\\%\\:]", de, Q), "g"),
        NOT_HOST: new RegExp(a("[^\\%\\[\\]\\:]", de, Q), "g"),
        NOT_PATH: new RegExp(a("[^\\%\\/\\:\\@]", de, Q), "g"),
        NOT_PATH_NOSCHEME: new RegExp(a("[^\\%\\/\\@]", de, Q), "g"),
        NOT_QUERY: new RegExp(a("[^\\%]", de, Q, "[\\:\\@\\/\\?]", _e), "g"),
        NOT_FRAGMENT: new RegExp(a("[^\\%]", de, Q, "[\\:\\@\\/\\?]"), "g"),
        ESCAPE: new RegExp(a("[^]", de, Q), "g"),
        UNRESERVED: new RegExp(de, "g"),
        OTHER_CHARS: new RegExp(a("[^\\%]", de, ue), "g"),
        PCT_ENCODED: new RegExp(A, "g"),
        IPV4ADDRESS: new RegExp("^(" + ve + ")$"),
        IPV6ADDRESS: new RegExp("^\\[?(" + fr + ")" + u(u("\\%25|\\%(?!" + M + "{2})") + "(" + er + ")") + "?\\]?$")
        //RFC 6874, with relaxed parsing rules
      };
    }
    var g = v(!1), S = v(!0), z = function() {
      function E(f, P) {
        var M = [], A = !0, X = !1, Q = void 0;
        try {
          for (var ue = f[Symbol.iterator](), he; !(A = (he = ue.next()).done) && (M.push(he.value), !(P && M.length === P)); A = !0)
            ;
        } catch (_e) {
          X = !0, Q = _e;
        } finally {
          try {
            !A && ue.return && ue.return();
          } finally {
            if (X)
              throw Q;
          }
        }
        return M;
      }
      return function(f, P) {
        if (Array.isArray(f))
          return f;
        if (Symbol.iterator in Object(f))
          return E(f, P);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      };
    }(), L = function(E) {
      if (Array.isArray(E)) {
        for (var f = 0, P = Array(E.length); f < E.length; f++)
          P[f] = E[f];
        return P;
      } else
        return Array.from(E);
    }, R = 2147483647, j = 36, T = 1, $ = 26, O = 38, D = 700, t = 72, d = 128, s = "-", i = /^xn--/, c = /[^\0-\x7E]/, m = /[\x2E\u3002\uFF0E\uFF61]/g, h = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    }, C = j - T, U = Math.floor, H = String.fromCharCode;
    function V(E) {
      throw new RangeError(h[E]);
    }
    function G(E, f) {
      for (var P = [], M = E.length; M--; )
        P[M] = f(E[M]);
      return P;
    }
    function _(E, f) {
      var P = E.split("@"), M = "";
      P.length > 1 && (M = P[0] + "@", E = P[1]), E = E.replace(m, ".");
      var A = E.split("."), X = G(A, f).join(".");
      return M + X;
    }
    function q(E) {
      for (var f = [], P = 0, M = E.length; P < M; ) {
        var A = E.charCodeAt(P++);
        if (A >= 55296 && A <= 56319 && P < M) {
          var X = E.charCodeAt(P++);
          (X & 64512) == 56320 ? f.push(((A & 1023) << 10) + (X & 1023) + 65536) : (f.push(A), P--);
        } else
          f.push(A);
      }
      return f;
    }
    var J = function(f) {
      return String.fromCodePoint.apply(String, L(f));
    }, Z = function(f) {
      return f - 48 < 10 ? f - 22 : f - 65 < 26 ? f - 65 : f - 97 < 26 ? f - 97 : j;
    }, B = function(f, P) {
      return f + 22 + 75 * (f < 26) - ((P != 0) << 5);
    }, k = function(f, P, M) {
      var A = 0;
      for (
        f = M ? U(f / D) : f >> 1, f += U(f / P);
        /* no initialization */
        f > C * $ >> 1;
        A += j
      )
        f = U(f / C);
      return U(A + (C + 1) * f / (f + O));
    }, F = function(f) {
      var P = [], M = f.length, A = 0, X = d, Q = t, ue = f.lastIndexOf(s);
      ue < 0 && (ue = 0);
      for (var he = 0; he < ue; ++he)
        f.charCodeAt(he) >= 128 && V("not-basic"), P.push(f.charCodeAt(he));
      for (var _e = ue > 0 ? ue + 1 : 0; _e < M; ) {
        for (
          var de = A, ce = 1, ve = j;
          ;
          /* no condition */
          ve += j
        ) {
          _e >= M && V("invalid-input");
          var ee = Z(f.charCodeAt(_e++));
          (ee >= j || ee > U((R - A) / ce)) && V("overflow"), A += ee * ce;
          var me = ve <= Q ? T : ve >= Q + $ ? $ : ve - Q;
          if (ee < me)
            break;
          var we = j - me;
          ce > U(R / we) && V("overflow"), ce *= we;
        }
        var ge = P.length + 1;
        Q = k(A - de, ge, de == 0), U(A / ge) > R - X && V("overflow"), X += U(A / ge), A %= ge, P.splice(A++, 0, X);
      }
      return String.fromCodePoint.apply(String, P);
    }, N = function(f) {
      var P = [];
      f = q(f);
      var M = f.length, A = d, X = 0, Q = t, ue = !0, he = !1, _e = void 0;
      try {
        for (var de = f[Symbol.iterator](), ce; !(ue = (ce = de.next()).done); ue = !0) {
          var ve = ce.value;
          ve < 128 && P.push(H(ve));
        }
      } catch (qr) {
        he = !0, _e = qr;
      } finally {
        try {
          !ue && de.return && de.return();
        } finally {
          if (he)
            throw _e;
        }
      }
      var ee = P.length, me = ee;
      for (ee && P.push(s); me < M; ) {
        var we = R, ge = !0, ar = !1, Ke = void 0;
        try {
          for (var We = f[Symbol.iterator](), Pr; !(ge = (Pr = We.next()).done); ge = !0) {
            var lr = Pr.value;
            lr >= A && lr < we && (we = lr);
          }
        } catch (qr) {
          ar = !0, Ke = qr;
        } finally {
          try {
            !ge && We.return && We.return();
          } finally {
            if (ar)
              throw Ke;
          }
        }
        var Me = me + 1;
        we - A > U((R - X) / Me) && V("overflow"), X += (we - A) * Me, A = we;
        var Je = !0, fr = !1, er = void 0;
        try {
          for (var Hr = f[Symbol.iterator](), Ba; !(Je = (Ba = Hr.next()).done); Je = !0) {
            var Ha = Ba.value;
            if (Ha < A && ++X > R && V("overflow"), Ha == A) {
              for (
                var dt = X, ut = j;
                ;
                /* no condition */
                ut += j
              ) {
                var it = ut <= Q ? T : ut >= Q + $ ? $ : ut - Q;
                if (dt < it)
                  break;
                var qa = dt - it, Ga = j - it;
                P.push(H(B(it + qa % Ga, 0))), dt = U(qa / Ga);
              }
              P.push(H(B(dt, 0))), Q = k(X, Me, me == ee), X = 0, ++me;
            }
          }
        } catch (qr) {
          fr = !0, er = qr;
        } finally {
          try {
            !Je && Hr.return && Hr.return();
          } finally {
            if (fr)
              throw er;
          }
        }
        ++X, ++A;
      }
      return P.join("");
    }, l = function(f) {
      return _(f, function(P) {
        return i.test(P) ? F(P.slice(4).toLowerCase()) : P;
      });
    }, w = function(f) {
      return _(f, function(P) {
        return c.test(P) ? "xn--" + N(P) : P;
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
        decode: q,
        encode: J
      },
      decode: F,
      encode: N,
      toASCII: w,
      toUnicode: l
    }, K = {};
    function W(E) {
      var f = E.charCodeAt(0), P = void 0;
      return f < 16 ? P = "%0" + f.toString(16).toUpperCase() : f < 128 ? P = "%" + f.toString(16).toUpperCase() : f < 2048 ? P = "%" + (f >> 6 | 192).toString(16).toUpperCase() + "%" + (f & 63 | 128).toString(16).toUpperCase() : P = "%" + (f >> 12 | 224).toString(16).toUpperCase() + "%" + (f >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (f & 63 | 128).toString(16).toUpperCase(), P;
    }
    function re(E) {
      for (var f = "", P = 0, M = E.length; P < M; ) {
        var A = parseInt(E.substr(P + 1, 2), 16);
        if (A < 128)
          f += String.fromCharCode(A), P += 3;
        else if (A >= 194 && A < 224) {
          if (M - P >= 6) {
            var X = parseInt(E.substr(P + 4, 2), 16);
            f += String.fromCharCode((A & 31) << 6 | X & 63);
          } else
            f += E.substr(P, 6);
          P += 6;
        } else if (A >= 224) {
          if (M - P >= 9) {
            var Q = parseInt(E.substr(P + 4, 2), 16), ue = parseInt(E.substr(P + 7, 2), 16);
            f += String.fromCharCode((A & 15) << 12 | (Q & 63) << 6 | ue & 63);
          } else
            f += E.substr(P, 9);
          P += 9;
        } else
          f += E.substr(P, 3), P += 3;
      }
      return f;
    }
    function ae(E, f) {
      function P(M) {
        var A = re(M);
        return A.match(f.UNRESERVED) ? A : M;
      }
      return E.scheme && (E.scheme = String(E.scheme).replace(f.PCT_ENCODED, P).toLowerCase().replace(f.NOT_SCHEME, "")), E.userinfo !== void 0 && (E.userinfo = String(E.userinfo).replace(f.PCT_ENCODED, P).replace(f.NOT_USERINFO, W).replace(f.PCT_ENCODED, p)), E.host !== void 0 && (E.host = String(E.host).replace(f.PCT_ENCODED, P).toLowerCase().replace(f.NOT_HOST, W).replace(f.PCT_ENCODED, p)), E.path !== void 0 && (E.path = String(E.path).replace(f.PCT_ENCODED, P).replace(E.scheme ? f.NOT_PATH : f.NOT_PATH_NOSCHEME, W).replace(f.PCT_ENCODED, p)), E.query !== void 0 && (E.query = String(E.query).replace(f.PCT_ENCODED, P).replace(f.NOT_QUERY, W).replace(f.PCT_ENCODED, p)), E.fragment !== void 0 && (E.fragment = String(E.fragment).replace(f.PCT_ENCODED, P).replace(f.NOT_FRAGMENT, W).replace(f.PCT_ENCODED, p)), E;
    }
    function fe(E) {
      return E.replace(/^0*(.*)/, "$1") || "0";
    }
    function Te(E, f) {
      var P = E.match(f.IPV4ADDRESS) || [], M = z(P, 2), A = M[1];
      return A ? A.split(".").map(fe).join(".") : E;
    }
    function xe(E, f) {
      var P = E.match(f.IPV6ADDRESS) || [], M = z(P, 3), A = M[1], X = M[2];
      if (A) {
        for (var Q = A.toLowerCase().split("::").reverse(), ue = z(Q, 2), he = ue[0], _e = ue[1], de = _e ? _e.split(":").map(fe) : [], ce = he.split(":").map(fe), ve = f.IPV4ADDRESS.test(ce[ce.length - 1]), ee = ve ? 7 : 8, me = ce.length - ee, we = Array(ee), ge = 0; ge < ee; ++ge)
          we[ge] = de[ge] || ce[me + ge] || "";
        ve && (we[ee - 1] = Te(we[ee - 1], f));
        var ar = we.reduce(function(Me, Je, fr) {
          if (!Je || Je === "0") {
            var er = Me[Me.length - 1];
            er && er.index + er.length === fr ? er.length++ : Me.push({ index: fr, length: 1 });
          }
          return Me;
        }, []), Ke = ar.sort(function(Me, Je) {
          return Je.length - Me.length;
        })[0], We = void 0;
        if (Ke && Ke.length > 1) {
          var Pr = we.slice(0, Ke.index), lr = we.slice(Ke.index + Ke.length);
          We = Pr.join(":") + "::" + lr.join(":");
        } else
          We = we.join(":");
        return X && (We += "%" + X), We;
      } else
        return E;
    }
    var Dr = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i, Lr = "".match(/(){0}/)[1] === void 0;
    function Ae(E) {
      var f = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, P = {}, M = f.iri !== !1 ? S : g;
      f.reference === "suffix" && (E = (f.scheme ? f.scheme + ":" : "") + "//" + E);
      var A = E.match(Dr);
      if (A) {
        Lr ? (P.scheme = A[1], P.userinfo = A[3], P.host = A[4], P.port = parseInt(A[5], 10), P.path = A[6] || "", P.query = A[7], P.fragment = A[8], isNaN(P.port) && (P.port = A[5])) : (P.scheme = A[1] || void 0, P.userinfo = E.indexOf("@") !== -1 ? A[3] : void 0, P.host = E.indexOf("//") !== -1 ? A[4] : void 0, P.port = parseInt(A[5], 10), P.path = A[6] || "", P.query = E.indexOf("?") !== -1 ? A[7] : void 0, P.fragment = E.indexOf("#") !== -1 ? A[8] : void 0, isNaN(P.port) && (P.port = E.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? A[4] : void 0)), P.host && (P.host = xe(Te(P.host, M), M)), P.scheme === void 0 && P.userinfo === void 0 && P.host === void 0 && P.port === void 0 && !P.path && P.query === void 0 ? P.reference = "same-document" : P.scheme === void 0 ? P.reference = "relative" : P.fragment === void 0 ? P.reference = "absolute" : P.reference = "uri", f.reference && f.reference !== "suffix" && f.reference !== P.reference && (P.error = P.error || "URI is not a " + f.reference + " reference.");
        var X = K[(f.scheme || P.scheme || "").toLowerCase()];
        if (!f.unicodeSupport && (!X || !X.unicodeSupport)) {
          if (P.host && (f.domainHost || X && X.domainHost))
            try {
              P.host = I.toASCII(P.host.replace(M.PCT_ENCODED, re).toLowerCase());
            } catch (Q) {
              P.error = P.error || "Host's domain name can not be converted to ASCII via punycode: " + Q;
            }
          ae(P, g);
        } else
          ae(P, M);
        X && X.parse && X.parse(P, f);
      } else
        P.error = P.error || "URI can not be parsed.";
      return P;
    }
    function zr(E, f) {
      var P = f.iri !== !1 ? S : g, M = [];
      return E.userinfo !== void 0 && (M.push(E.userinfo), M.push("@")), E.host !== void 0 && M.push(xe(Te(String(E.host), P), P).replace(P.IPV6ADDRESS, function(A, X, Q) {
        return "[" + X + (Q ? "%25" + Q : "") + "]";
      })), (typeof E.port == "number" || typeof E.port == "string") && (M.push(":"), M.push(String(E.port))), M.length ? M.join("") : void 0;
    }
    var wr = /^\.\.?\//, br = /^\/\.(\/|$)/, $r = /^\/\.\.(\/|$)/, Vr = /^\/?(?:.|\n)*?(?=\/|$)/;
    function qe(E) {
      for (var f = []; E.length; )
        if (E.match(wr))
          E = E.replace(wr, "");
        else if (E.match(br))
          E = E.replace(br, "/");
        else if (E.match($r))
          E = E.replace($r, "/"), f.pop();
        else if (E === "." || E === "..")
          E = "";
        else {
          var P = E.match(Vr);
          if (P) {
            var M = P[0];
            E = E.slice(M.length), f.push(M);
          } else
            throw new Error("Unexpected dot segment condition");
        }
      return f.join("");
    }
    function je(E) {
      var f = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, P = f.iri ? S : g, M = [], A = K[(f.scheme || E.scheme || "").toLowerCase()];
      if (A && A.serialize && A.serialize(E, f), E.host && !P.IPV6ADDRESS.test(E.host)) {
        if (f.domainHost || A && A.domainHost)
          try {
            E.host = f.iri ? I.toUnicode(E.host) : I.toASCII(E.host.replace(P.PCT_ENCODED, re).toLowerCase());
          } catch (ue) {
            E.error = E.error || "Host's domain name can not be converted to " + (f.iri ? "Unicode" : "ASCII") + " via punycode: " + ue;
          }
      }
      ae(E, P), f.reference !== "suffix" && E.scheme && (M.push(E.scheme), M.push(":"));
      var X = zr(E, f);
      if (X !== void 0 && (f.reference !== "suffix" && M.push("//"), M.push(X), E.path && E.path.charAt(0) !== "/" && M.push("/")), E.path !== void 0) {
        var Q = E.path;
        !f.absolutePath && (!A || !A.absolutePath) && (Q = qe(Q)), X === void 0 && (Q = Q.replace(/^\/\//, "/%2F")), M.push(Q);
      }
      return E.query !== void 0 && (M.push("?"), M.push(E.query)), E.fragment !== void 0 && (M.push("#"), M.push(E.fragment)), M.join("");
    }
    function Er(E, f) {
      var P = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, M = arguments[3], A = {};
      return M || (E = Ae(je(E, P), P), f = Ae(je(f, P), P)), P = P || {}, !P.tolerant && f.scheme ? (A.scheme = f.scheme, A.userinfo = f.userinfo, A.host = f.host, A.port = f.port, A.path = qe(f.path || ""), A.query = f.query) : (f.userinfo !== void 0 || f.host !== void 0 || f.port !== void 0 ? (A.userinfo = f.userinfo, A.host = f.host, A.port = f.port, A.path = qe(f.path || ""), A.query = f.query) : (f.path ? (f.path.charAt(0) === "/" ? A.path = qe(f.path) : ((E.userinfo !== void 0 || E.host !== void 0 || E.port !== void 0) && !E.path ? A.path = "/" + f.path : E.path ? A.path = E.path.slice(0, E.path.lastIndexOf("/") + 1) + f.path : A.path = f.path, A.path = qe(A.path)), A.query = f.query) : (A.path = E.path, f.query !== void 0 ? A.query = f.query : A.query = E.query), A.userinfo = E.userinfo, A.host = E.host, A.port = E.port), A.scheme = E.scheme), A.fragment = f.fragment, A;
    }
    function Fr(E, f, P) {
      var M = b({ scheme: "null" }, P);
      return je(Er(Ae(E, M), Ae(f, M), M, !0), M);
    }
    function or(E, f) {
      return typeof E == "string" ? E = je(Ae(E, f), f) : o(E) === "object" && (E = Ae(je(E, f), f)), E;
    }
    function Ur(E, f, P) {
      return typeof E == "string" ? E = je(Ae(E, P), P) : o(E) === "object" && (E = je(E, P)), typeof f == "string" ? f = je(Ae(f, P), P) : o(f) === "object" && (f = je(f, P)), E === f;
    }
    function st(E, f) {
      return E && E.toString().replace(!f || !f.iri ? g.ESCAPE : S.ESCAPE, W);
    }
    function Ie(E, f) {
      return E && E.toString().replace(!f || !f.iri ? g.PCT_ENCODED : S.PCT_ENCODED, re);
    }
    var cr = {
      scheme: "http",
      domainHost: !0,
      parse: function(f, P) {
        return f.host || (f.error = f.error || "HTTP URIs must have a host."), f;
      },
      serialize: function(f, P) {
        var M = String(f.scheme).toLowerCase() === "https";
        return (f.port === (M ? 443 : 80) || f.port === "") && (f.port = void 0), f.path || (f.path = "/"), f;
      }
    }, Ia = {
      scheme: "https",
      domainHost: cr.domainHost,
      parse: cr.parse,
      serialize: cr.serialize
    };
    function Ma(E) {
      return typeof E.secure == "boolean" ? E.secure : String(E.scheme).toLowerCase() === "wss";
    }
    var Br = {
      scheme: "ws",
      domainHost: !0,
      parse: function(f, P) {
        var M = f;
        return M.secure = Ma(M), M.resourceName = (M.path || "/") + (M.query ? "?" + M.query : ""), M.path = void 0, M.query = void 0, M;
      },
      serialize: function(f, P) {
        if ((f.port === (Ma(f) ? 443 : 80) || f.port === "") && (f.port = void 0), typeof f.secure == "boolean" && (f.scheme = f.secure ? "wss" : "ws", f.secure = void 0), f.resourceName) {
          var M = f.resourceName.split("?"), A = z(M, 2), X = A[0], Q = A[1];
          f.path = X && X !== "/" ? X : void 0, f.query = Q, f.resourceName = void 0;
        }
        return f.fragment = void 0, f;
      }
    }, Da = {
      scheme: "wss",
      domainHost: Br.domainHost,
      parse: Br.parse,
      serialize: Br.serialize
    }, _s = {}, La = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]", Ge = "[0-9A-Fa-f]", vs = u(u("%[EFef]" + Ge + "%" + Ge + Ge + "%" + Ge + Ge) + "|" + u("%[89A-Fa-f]" + Ge + "%" + Ge + Ge) + "|" + u("%" + Ge + Ge)), ys = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", ws = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", bs = a(ws, '[\\"\\\\]'), $s = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]", Es = new RegExp(La, "g"), kr = new RegExp(vs, "g"), ks = new RegExp(a("[^]", ys, "[\\.]", '[\\"]', bs), "g"), za = new RegExp(a("[^]", La, $s), "g"), Ps = za;
    function Nt(E) {
      var f = re(E);
      return f.match(Es) ? f : E;
    }
    var Va = {
      scheme: "mailto",
      parse: function(f, P) {
        var M = f, A = M.to = M.path ? M.path.split(",") : [];
        if (M.path = void 0, M.query) {
          for (var X = !1, Q = {}, ue = M.query.split("&"), he = 0, _e = ue.length; he < _e; ++he) {
            var de = ue[he].split("=");
            switch (de[0]) {
              case "to":
                for (var ce = de[1].split(","), ve = 0, ee = ce.length; ve < ee; ++ve)
                  A.push(ce[ve]);
                break;
              case "subject":
                M.subject = Ie(de[1], P);
                break;
              case "body":
                M.body = Ie(de[1], P);
                break;
              default:
                X = !0, Q[Ie(de[0], P)] = Ie(de[1], P);
                break;
            }
          }
          X && (M.headers = Q);
        }
        M.query = void 0;
        for (var me = 0, we = A.length; me < we; ++me) {
          var ge = A[me].split("@");
          if (ge[0] = Ie(ge[0]), P.unicodeSupport)
            ge[1] = Ie(ge[1], P).toLowerCase();
          else
            try {
              ge[1] = I.toASCII(Ie(ge[1], P).toLowerCase());
            } catch (ar) {
              M.error = M.error || "Email address's domain name can not be converted to ASCII via punycode: " + ar;
            }
          A[me] = ge.join("@");
        }
        return M;
      },
      serialize: function(f, P) {
        var M = f, A = y(f.to);
        if (A) {
          for (var X = 0, Q = A.length; X < Q; ++X) {
            var ue = String(A[X]), he = ue.lastIndexOf("@"), _e = ue.slice(0, he).replace(kr, Nt).replace(kr, p).replace(ks, W), de = ue.slice(he + 1);
            try {
              de = P.iri ? I.toUnicode(de) : I.toASCII(Ie(de, P).toLowerCase());
            } catch (me) {
              M.error = M.error || "Email address's domain name can not be converted to " + (P.iri ? "Unicode" : "ASCII") + " via punycode: " + me;
            }
            A[X] = _e + "@" + de;
          }
          M.path = A.join(",");
        }
        var ce = f.headers = f.headers || {};
        f.subject && (ce.subject = f.subject), f.body && (ce.body = f.body);
        var ve = [];
        for (var ee in ce)
          ce[ee] !== _s[ee] && ve.push(ee.replace(kr, Nt).replace(kr, p).replace(za, W) + "=" + ce[ee].replace(kr, Nt).replace(kr, p).replace(Ps, W));
        return ve.length && (M.query = ve.join("&")), M;
      }
    }, Ss = /^([^\:]+)\:(.*)/, Fa = {
      scheme: "urn",
      parse: function(f, P) {
        var M = f.path && f.path.match(Ss), A = f;
        if (M) {
          var X = P.scheme || A.scheme || "urn", Q = M[1].toLowerCase(), ue = M[2], he = X + ":" + (P.nid || Q), _e = K[he];
          A.nid = Q, A.nss = ue, A.path = void 0, _e && (A = _e.parse(A, P));
        } else
          A.error = A.error || "URN can not be parsed.";
        return A;
      },
      serialize: function(f, P) {
        var M = P.scheme || f.scheme || "urn", A = f.nid, X = M + ":" + (P.nid || A), Q = K[X];
        Q && (f = Q.serialize(f, P));
        var ue = f, he = f.nss;
        return ue.path = (A || P.nid) + ":" + he, ue;
      }
    }, Cs = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/, Ua = {
      scheme: "urn:uuid",
      parse: function(f, P) {
        var M = f;
        return M.uuid = M.nss, M.nss = void 0, !P.tolerant && (!M.uuid || !M.uuid.match(Cs)) && (M.error = M.error || "UUID is not valid."), M;
      },
      serialize: function(f, P) {
        var M = f;
        return M.nss = (f.uuid || "").toLowerCase(), M;
      }
    };
    K[cr.scheme] = cr, K[Ia.scheme] = Ia, K[Br.scheme] = Br, K[Da.scheme] = Da, K[Va.scheme] = Va, K[Fa.scheme] = Fa, K[Ua.scheme] = Ua, n.SCHEMES = K, n.pctEncChar = W, n.pctDecChars = re, n.parse = Ae, n.removeDotSegments = qe, n.serialize = je, n.resolveComponents = Er, n.resolve = Fr, n.normalize = or, n.equal = Ur, n.escapeComponent = st, n.unescapeComponent = Ie, Object.defineProperty(n, "__esModule", { value: !0 });
  });
})(Ut, Ut.exports);
var ou = Ut.exports;
Object.defineProperty(Qt, "__esModule", { value: !0 });
const Xn = ou;
Xn.code = 'require("ajv/dist/runtime/uri").default';
Qt.default = Xn;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var r = He;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return r.KeywordCxt;
  } });
  var n = se;
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
  const a = tt, u = at, o = vr, p = Re, y = se, b = ke, v = rt, g = ie, S = iu, z = Qt, L = (B, k) => new RegExp(B, k);
  L.code = "new RegExp";
  const R = ["removeAdditional", "useDefaults", "coerceTypes"], j = /* @__PURE__ */ new Set([
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
  }, $ = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, O = 200;
  function D(B) {
    var k, F, N, l, w, I, K, W, re, ae, fe, Te, xe, Dr, Lr, Ae, zr, wr, br, $r, Vr, qe, je, Er, Fr;
    const or = B.strict, Ur = (k = B.code) === null || k === void 0 ? void 0 : k.optimize, st = Ur === !0 || Ur === void 0 ? 1 : Ur || 0, Ie = (N = (F = B.code) === null || F === void 0 ? void 0 : F.regExp) !== null && N !== void 0 ? N : L, cr = (l = B.uriResolver) !== null && l !== void 0 ? l : z.default;
    return {
      strictSchema: (I = (w = B.strictSchema) !== null && w !== void 0 ? w : or) !== null && I !== void 0 ? I : !0,
      strictNumbers: (W = (K = B.strictNumbers) !== null && K !== void 0 ? K : or) !== null && W !== void 0 ? W : !0,
      strictTypes: (ae = (re = B.strictTypes) !== null && re !== void 0 ? re : or) !== null && ae !== void 0 ? ae : "log",
      strictTuples: (Te = (fe = B.strictTuples) !== null && fe !== void 0 ? fe : or) !== null && Te !== void 0 ? Te : "log",
      strictRequired: (Dr = (xe = B.strictRequired) !== null && xe !== void 0 ? xe : or) !== null && Dr !== void 0 ? Dr : !1,
      code: B.code ? { ...B.code, optimize: st, regExp: Ie } : { optimize: st, regExp: Ie },
      loopRequired: (Lr = B.loopRequired) !== null && Lr !== void 0 ? Lr : O,
      loopEnum: (Ae = B.loopEnum) !== null && Ae !== void 0 ? Ae : O,
      meta: (zr = B.meta) !== null && zr !== void 0 ? zr : !0,
      messages: (wr = B.messages) !== null && wr !== void 0 ? wr : !0,
      inlineRefs: (br = B.inlineRefs) !== null && br !== void 0 ? br : !0,
      schemaId: ($r = B.schemaId) !== null && $r !== void 0 ? $r : "$id",
      addUsedSchema: (Vr = B.addUsedSchema) !== null && Vr !== void 0 ? Vr : !0,
      validateSchema: (qe = B.validateSchema) !== null && qe !== void 0 ? qe : !0,
      validateFormats: (je = B.validateFormats) !== null && je !== void 0 ? je : !0,
      unicodeRegExp: (Er = B.unicodeRegExp) !== null && Er !== void 0 ? Er : !0,
      int32range: (Fr = B.int32range) !== null && Fr !== void 0 ? Fr : !0,
      uriResolver: cr
    };
  }
  class t {
    constructor(k = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), k = this.opts = { ...k, ...D(k) };
      const { es5: F, lines: N } = this.opts.code;
      this.scope = new y.ValueScope({ scope: {}, prefixes: j, es5: F, lines: N }), this.logger = U(k.logger);
      const l = k.validateFormats;
      k.validateFormats = !1, this.RULES = (0, o.getRules)(), d.call(this, T, k, "NOT SUPPORTED"), d.call(this, $, k, "DEPRECATED", "warn"), this._metaOpts = h.call(this), k.formats && c.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), k.keywords && m.call(this, k.keywords), typeof k.meta == "object" && this.addMetaSchema(k.meta), i.call(this), k.validateFormats = l;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: k, meta: F, schemaId: N } = this.opts;
      let l = S;
      N === "id" && (l = { ...S }, l.id = l.$id, delete l.$id), F && k && this.addMetaSchema(l, l[N], !1);
    }
    defaultMeta() {
      const { meta: k, schemaId: F } = this.opts;
      return this.opts.defaultMeta = typeof k == "object" ? k[F] || k : void 0;
    }
    validate(k, F) {
      let N;
      if (typeof k == "string") {
        if (N = this.getSchema(k), !N)
          throw new Error(`no schema with key or ref "${k}"`);
      } else
        N = this.compile(k);
      const l = N(F);
      return "$async" in N || (this.errors = N.errors), l;
    }
    compile(k, F) {
      const N = this._addSchema(k, F);
      return N.validate || this._compileSchemaEnv(N);
    }
    compileAsync(k, F) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: N } = this.opts;
      return l.call(this, k, F);
      async function l(ae, fe) {
        await w.call(this, ae.$schema);
        const Te = this._addSchema(ae, fe);
        return Te.validate || I.call(this, Te);
      }
      async function w(ae) {
        ae && !this.getSchema(ae) && await l.call(this, { $ref: ae }, !0);
      }
      async function I(ae) {
        try {
          return this._compileSchemaEnv(ae);
        } catch (fe) {
          if (!(fe instanceof u.default))
            throw fe;
          return K.call(this, fe), await W.call(this, fe.missingSchema), I.call(this, ae);
        }
      }
      function K({ missingSchema: ae, missingRef: fe }) {
        if (this.refs[ae])
          throw new Error(`AnySchema ${ae} is loaded but ${fe} cannot be resolved`);
      }
      async function W(ae) {
        const fe = await re.call(this, ae);
        this.refs[ae] || await w.call(this, fe.$schema), this.refs[ae] || this.addSchema(fe, ae, F);
      }
      async function re(ae) {
        const fe = this._loading[ae];
        if (fe)
          return fe;
        try {
          return await (this._loading[ae] = N(ae));
        } finally {
          delete this._loading[ae];
        }
      }
    }
    // Adds schema to the instance
    addSchema(k, F, N, l = this.opts.validateSchema) {
      if (Array.isArray(k)) {
        for (const I of k)
          this.addSchema(I, void 0, N, l);
        return this;
      }
      let w;
      if (typeof k == "object") {
        const { schemaId: I } = this.opts;
        if (w = k[I], w !== void 0 && typeof w != "string")
          throw new Error(`schema ${I} must be string`);
      }
      return F = (0, b.normalizeId)(F || w), this._checkUnique(F), this.schemas[F] = this._addSchema(k, N, F, l, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(k, F, N = this.opts.validateSchema) {
      return this.addSchema(k, F, !0, N), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(k, F) {
      if (typeof k == "boolean")
        return !0;
      let N;
      if (N = k.$schema, N !== void 0 && typeof N != "string")
        throw new Error("$schema must be a string");
      if (N = N || this.opts.defaultMeta || this.defaultMeta(), !N)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const l = this.validate(N, k);
      if (!l && F) {
        const w = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(w);
        else
          throw new Error(w);
      }
      return l;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(k) {
      let F;
      for (; typeof (F = s.call(this, k)) == "string"; )
        k = F;
      if (F === void 0) {
        const { schemaId: N } = this.opts, l = new p.SchemaEnv({ schema: {}, schemaId: N });
        if (F = p.resolveSchema.call(this, l, k), !F)
          return;
        this.refs[k] = F;
      }
      return F.validate || this._compileSchemaEnv(F);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(k) {
      if (k instanceof RegExp)
        return this._removeAllSchemas(this.schemas, k), this._removeAllSchemas(this.refs, k), this;
      switch (typeof k) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const F = s.call(this, k);
          return typeof F == "object" && this._cache.delete(F.schema), delete this.schemas[k], delete this.refs[k], this;
        }
        case "object": {
          const F = k;
          this._cache.delete(F);
          let N = k[this.opts.schemaId];
          return N && (N = (0, b.normalizeId)(N), delete this.schemas[N], delete this.refs[N]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(k) {
      for (const F of k)
        this.addKeyword(F);
      return this;
    }
    addKeyword(k, F) {
      let N;
      if (typeof k == "string")
        N = k, typeof F == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), F.keyword = N);
      else if (typeof k == "object" && F === void 0) {
        if (F = k, N = F.keyword, Array.isArray(N) && !N.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (V.call(this, N, F), !F)
        return (0, g.eachItem)(N, (w) => G.call(this, w)), this;
      q.call(this, F);
      const l = {
        ...F,
        type: (0, v.getJSONTypes)(F.type),
        schemaType: (0, v.getJSONTypes)(F.schemaType)
      };
      return (0, g.eachItem)(N, l.type.length === 0 ? (w) => G.call(this, w, l) : (w) => l.type.forEach((I) => G.call(this, w, l, I))), this;
    }
    getKeyword(k) {
      const F = this.RULES.all[k];
      return typeof F == "object" ? F.definition : !!F;
    }
    // Remove keyword
    removeKeyword(k) {
      const { RULES: F } = this;
      delete F.keywords[k], delete F.all[k];
      for (const N of F.rules) {
        const l = N.rules.findIndex((w) => w.keyword === k);
        l >= 0 && N.rules.splice(l, 1);
      }
      return this;
    }
    // Add format
    addFormat(k, F) {
      return typeof F == "string" && (F = new RegExp(F)), this.formats[k] = F, this;
    }
    errorsText(k = this.errors, { separator: F = ", ", dataVar: N = "data" } = {}) {
      return !k || k.length === 0 ? "No errors" : k.map((l) => `${N}${l.instancePath} ${l.message}`).reduce((l, w) => l + F + w);
    }
    $dataMetaSchema(k, F) {
      const N = this.RULES.all;
      k = JSON.parse(JSON.stringify(k));
      for (const l of F) {
        const w = l.split("/").slice(1);
        let I = k;
        for (const K of w)
          I = I[K];
        for (const K in N) {
          const W = N[K];
          if (typeof W != "object")
            continue;
          const { $data: re } = W.definition, ae = I[K];
          re && ae && (I[K] = Z(ae));
        }
      }
      return k;
    }
    _removeAllSchemas(k, F) {
      for (const N in k) {
        const l = k[N];
        (!F || F.test(N)) && (typeof l == "string" ? delete k[N] : l && !l.meta && (this._cache.delete(l.schema), delete k[N]));
      }
    }
    _addSchema(k, F, N, l = this.opts.validateSchema, w = this.opts.addUsedSchema) {
      let I;
      const { schemaId: K } = this.opts;
      if (typeof k == "object")
        I = k[K];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof k != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let W = this._cache.get(k);
      if (W !== void 0)
        return W;
      N = (0, b.normalizeId)(I || N);
      const re = b.getSchemaRefs.call(this, k, N);
      return W = new p.SchemaEnv({ schema: k, schemaId: K, meta: F, baseId: N, localRefs: re }), this._cache.set(W.schema, W), w && !N.startsWith("#") && (N && this._checkUnique(N), this.refs[N] = W), l && this.validateSchema(k, !0), W;
    }
    _checkUnique(k) {
      if (this.schemas[k] || this.refs[k])
        throw new Error(`schema with key or id "${k}" already exists`);
    }
    _compileSchemaEnv(k) {
      if (k.meta ? this._compileMetaSchema(k) : p.compileSchema.call(this, k), !k.validate)
        throw new Error("ajv implementation error");
      return k.validate;
    }
    _compileMetaSchema(k) {
      const F = this.opts;
      this.opts = this._metaOpts;
      try {
        p.compileSchema.call(this, k);
      } finally {
        this.opts = F;
      }
    }
  }
  e.default = t, t.ValidationError = a.default, t.MissingRefError = u.default;
  function d(B, k, F, N = "error") {
    for (const l in B) {
      const w = l;
      w in k && this.logger[N](`${F}: option ${l}. ${B[w]}`);
    }
  }
  function s(B) {
    return B = (0, b.normalizeId)(B), this.schemas[B] || this.refs[B];
  }
  function i() {
    const B = this.opts.schemas;
    if (B)
      if (Array.isArray(B))
        this.addSchema(B);
      else
        for (const k in B)
          this.addSchema(B[k], k);
  }
  function c() {
    for (const B in this.opts.formats) {
      const k = this.opts.formats[B];
      k && this.addFormat(B, k);
    }
  }
  function m(B) {
    if (Array.isArray(B)) {
      this.addVocabulary(B);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const k in B) {
      const F = B[k];
      F.keyword || (F.keyword = k), this.addKeyword(F);
    }
  }
  function h() {
    const B = { ...this.opts };
    for (const k of R)
      delete B[k];
    return B;
  }
  const C = { log() {
  }, warn() {
  }, error() {
  } };
  function U(B) {
    if (B === !1)
      return C;
    if (B === void 0)
      return console;
    if (B.log && B.warn && B.error)
      return B;
    throw new Error("logger must implement log, warn and error methods");
  }
  const H = /^[a-z_$][a-z0-9_$:-]*$/i;
  function V(B, k) {
    const { RULES: F } = this;
    if ((0, g.eachItem)(B, (N) => {
      if (F.keywords[N])
        throw new Error(`Keyword ${N} is already defined`);
      if (!H.test(N))
        throw new Error(`Keyword ${N} has invalid name`);
    }), !!k && k.$data && !("code" in k || "validate" in k))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function G(B, k, F) {
    var N;
    const l = k == null ? void 0 : k.post;
    if (F && l)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: w } = this;
    let I = l ? w.post : w.rules.find(({ type: W }) => W === F);
    if (I || (I = { type: F, rules: [] }, w.rules.push(I)), w.keywords[B] = !0, !k)
      return;
    const K = {
      keyword: B,
      definition: {
        ...k,
        type: (0, v.getJSONTypes)(k.type),
        schemaType: (0, v.getJSONTypes)(k.schemaType)
      }
    };
    k.before ? _.call(this, I, K, k.before) : I.rules.push(K), w.all[B] = K, (N = k.implements) === null || N === void 0 || N.forEach((W) => this.addKeyword(W));
  }
  function _(B, k, F) {
    const N = B.rules.findIndex((l) => l.keyword === F);
    N >= 0 ? B.rules.splice(N, 0, k) : (B.rules.push(k), this.logger.warn(`rule ${F} is not defined`));
  }
  function q(B) {
    let { metaSchema: k } = B;
    k !== void 0 && (B.$data && this.opts.$data && (k = Z(k)), B.validateSchema = this.compile(k, !0));
  }
  const J = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function Z(B) {
    return { anyOf: [B, J] };
  }
})(Sn);
var xt = {}, ea = {}, ra = {};
Object.defineProperty(ra, "__esModule", { value: !0 });
const cu = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
ra.default = cu;
var yr = {};
Object.defineProperty(yr, "__esModule", { value: !0 });
yr.callRef = yr.getValidate = void 0;
const lu = at, xa = ne, Ne = se, Cr = Qe, en = Re, ot = ie, fu = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: r, schema: n, it: a } = e, { baseId: u, schemaEnv: o, validateName: p, opts: y, self: b } = a, { root: v } = o;
    if ((n === "#" || n === "#/") && u === v.baseId)
      return S();
    const g = en.resolveRef.call(b, v, u, n);
    if (g === void 0)
      throw new lu.default(a.opts.uriResolver, u, n);
    if (g instanceof en.SchemaEnv)
      return z(g);
    return L(g);
    function S() {
      if (o === v)
        return gt(e, p, o, o.$async);
      const R = r.scopeValue("root", { ref: v });
      return gt(e, (0, Ne._)`${R}.validate`, v, v.$async);
    }
    function z(R) {
      const j = Qn(e, R);
      gt(e, j, R, R.$async);
    }
    function L(R) {
      const j = r.scopeValue("schema", y.code.source === !0 ? { ref: R, code: (0, Ne.stringify)(R) } : { ref: R }), T = r.name("valid"), $ = e.subschema({
        schema: R,
        dataTypes: [],
        schemaPath: Ne.nil,
        topSchemaRef: j,
        errSchemaPath: n
      }, T);
      e.mergeEvaluated($), e.ok(T);
    }
  }
};
function Qn(e, r) {
  const { gen: n } = e;
  return r.validate ? n.scopeValue("validate", { ref: r.validate }) : (0, Ne._)`${n.scopeValue("wrapper", { ref: r })}.validate`;
}
yr.getValidate = Qn;
function gt(e, r, n, a) {
  const { gen: u, it: o } = e, { allErrors: p, schemaEnv: y, opts: b } = o, v = b.passContext ? Cr.default.this : Ne.nil;
  a ? g() : S();
  function g() {
    if (!y.$async)
      throw new Error("async schema referenced by sync schema");
    const R = u.let("valid");
    u.try(() => {
      u.code((0, Ne._)`await ${(0, xa.callValidateCode)(e, r, v)}`), L(r), p || u.assign(R, !0);
    }, (j) => {
      u.if((0, Ne._)`!(${j} instanceof ${o.ValidationError})`, () => u.throw(j)), z(j), p || u.assign(R, !1);
    }), e.ok(R);
  }
  function S() {
    e.result((0, xa.callValidateCode)(e, r, v), () => L(r), () => z(r));
  }
  function z(R) {
    const j = (0, Ne._)`${R}.errors`;
    u.assign(Cr.default.vErrors, (0, Ne._)`${Cr.default.vErrors} === null ? ${j} : ${Cr.default.vErrors}.concat(${j})`), u.assign(Cr.default.errors, (0, Ne._)`${Cr.default.vErrors}.length`);
  }
  function L(R) {
    var j;
    if (!o.opts.unevaluated)
      return;
    const T = (j = n == null ? void 0 : n.validate) === null || j === void 0 ? void 0 : j.evaluated;
    if (o.props !== !0)
      if (T && !T.dynamicProps)
        T.props !== void 0 && (o.props = ot.mergeEvaluated.props(u, T.props, o.props));
      else {
        const $ = u.var("props", (0, Ne._)`${R}.evaluated.props`);
        o.props = ot.mergeEvaluated.props(u, $, o.props, Ne.Name);
      }
    if (o.items !== !0)
      if (T && !T.dynamicItems)
        T.items !== void 0 && (o.items = ot.mergeEvaluated.items(u, T.items, o.items));
      else {
        const $ = u.var("items", (0, Ne._)`${R}.evaluated.items`);
        o.items = ot.mergeEvaluated.items(u, $, o.items, Ne.Name);
      }
  }
}
yr.callRef = gt;
yr.default = fu;
Object.defineProperty(ea, "__esModule", { value: !0 });
const hu = ra, pu = yr, mu = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  hu.default,
  pu.default
];
ea.default = mu;
var ta = {}, aa = {};
Object.defineProperty(aa, "__esModule", { value: !0 });
const bt = se, sr = bt.operators, $t = {
  maximum: { okStr: "<=", ok: sr.LTE, fail: sr.GT },
  minimum: { okStr: ">=", ok: sr.GTE, fail: sr.LT },
  exclusiveMaximum: { okStr: "<", ok: sr.LT, fail: sr.GTE },
  exclusiveMinimum: { okStr: ">", ok: sr.GT, fail: sr.LTE }
}, gu = {
  message: ({ keyword: e, schemaCode: r }) => (0, bt.str)`must be ${$t[e].okStr} ${r}`,
  params: ({ keyword: e, schemaCode: r }) => (0, bt._)`{comparison: ${$t[e].okStr}, limit: ${r}}`
}, _u = {
  keyword: Object.keys($t),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: gu,
  code(e) {
    const { keyword: r, data: n, schemaCode: a } = e;
    e.fail$data((0, bt._)`${n} ${$t[r].fail} ${a} || isNaN(${n})`);
  }
};
aa.default = _u;
var na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
const Zr = se, vu = {
  message: ({ schemaCode: e }) => (0, Zr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Zr._)`{multipleOf: ${e}}`
}, yu = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: vu,
  code(e) {
    const { gen: r, data: n, schemaCode: a, it: u } = e, o = u.opts.multipleOfPrecision, p = r.let("res"), y = o ? (0, Zr._)`Math.abs(Math.round(${p}) - ${p}) > 1e-${o}` : (0, Zr._)`${p} !== parseInt(${p})`;
    e.fail$data((0, Zr._)`(${a} === 0 || (${p} = ${n}/${a}, ${y}))`);
  }
};
na.default = yu;
var sa = {}, da = {};
Object.defineProperty(da, "__esModule", { value: !0 });
function xn(e) {
  const r = e.length;
  let n = 0, a = 0, u;
  for (; a < r; )
    n++, u = e.charCodeAt(a++), u >= 55296 && u <= 56319 && a < r && (u = e.charCodeAt(a), (u & 64512) === 56320 && a++);
  return n;
}
da.default = xn;
xn.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(sa, "__esModule", { value: !0 });
const gr = se, wu = ie, bu = da, $u = {
  message({ keyword: e, schemaCode: r }) {
    const n = e === "maxLength" ? "more" : "fewer";
    return (0, gr.str)`must NOT have ${n} than ${r} characters`;
  },
  params: ({ schemaCode: e }) => (0, gr._)`{limit: ${e}}`
}, Eu = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: $u,
  code(e) {
    const { keyword: r, data: n, schemaCode: a, it: u } = e, o = r === "maxLength" ? gr.operators.GT : gr.operators.LT, p = u.opts.unicode === !1 ? (0, gr._)`${n}.length` : (0, gr._)`${(0, wu.useFunc)(e.gen, bu.default)}(${n})`;
    e.fail$data((0, gr._)`${p} ${o} ${a}`);
  }
};
sa.default = Eu;
var ua = {};
Object.defineProperty(ua, "__esModule", { value: !0 });
const ku = ne, Et = se, Pu = {
  message: ({ schemaCode: e }) => (0, Et.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Et._)`{pattern: ${e}}`
}, Su = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Pu,
  code(e) {
    const { data: r, $data: n, schema: a, schemaCode: u, it: o } = e, p = o.opts.unicodeRegExp ? "u" : "", y = n ? (0, Et._)`(new RegExp(${u}, ${p}))` : (0, ku.usePattern)(e, a);
    e.fail$data((0, Et._)`!${y}.test(${r})`);
  }
};
ua.default = Su;
var ia = {};
Object.defineProperty(ia, "__esModule", { value: !0 });
const Yr = se, Cu = {
  message({ keyword: e, schemaCode: r }) {
    const n = e === "maxProperties" ? "more" : "fewer";
    return (0, Yr.str)`must NOT have ${n} than ${r} properties`;
  },
  params: ({ schemaCode: e }) => (0, Yr._)`{limit: ${e}}`
}, Tu = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Cu,
  code(e) {
    const { keyword: r, data: n, schemaCode: a } = e, u = r === "maxProperties" ? Yr.operators.GT : Yr.operators.LT;
    e.fail$data((0, Yr._)`Object.keys(${n}).length ${u} ${a}`);
  }
};
ia.default = Tu;
var oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
const Kr = ne, Xr = se, ju = ie, Ou = {
  message: ({ params: { missingProperty: e } }) => (0, Xr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Xr._)`{missingProperty: ${e}}`
}, Nu = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Ou,
  code(e) {
    const { gen: r, schema: n, schemaCode: a, data: u, $data: o, it: p } = e, { opts: y } = p;
    if (!o && n.length === 0)
      return;
    const b = n.length >= y.loopRequired;
    if (p.allErrors ? v() : g(), y.strictRequired) {
      const L = e.parentSchema.properties, { definedProperties: R } = e.it;
      for (const j of n)
        if ((L == null ? void 0 : L[j]) === void 0 && !R.has(j)) {
          const T = p.schemaEnv.baseId + p.errSchemaPath, $ = `required property "${j}" is not defined at "${T}" (strictRequired)`;
          (0, ju.checkStrictMode)(p, $, p.opts.strictRequired);
        }
    }
    function v() {
      if (b || o)
        e.block$data(Xr.nil, S);
      else
        for (const L of n)
          (0, Kr.checkReportMissingProp)(e, L);
    }
    function g() {
      const L = r.let("missing");
      if (b || o) {
        const R = r.let("valid", !0);
        e.block$data(R, () => z(L, R)), e.ok(R);
      } else
        r.if((0, Kr.checkMissingProp)(e, n, L)), (0, Kr.reportMissingProp)(e, L), r.else();
    }
    function S() {
      r.forOf("prop", a, (L) => {
        e.setParams({ missingProperty: L }), r.if((0, Kr.noPropertyInData)(r, u, L, y.ownProperties), () => e.error());
      });
    }
    function z(L, R) {
      e.setParams({ missingProperty: L }), r.forOf(L, a, () => {
        r.assign(R, (0, Kr.propertyInData)(r, u, L, y.ownProperties)), r.if((0, Xr.not)(R), () => {
          e.error(), r.break();
        });
      }, Xr.nil);
    }
  }
};
oa.default = Nu;
var ca = {};
Object.defineProperty(ca, "__esModule", { value: !0 });
const Qr = se, Ru = {
  message({ keyword: e, schemaCode: r }) {
    const n = e === "maxItems" ? "more" : "fewer";
    return (0, Qr.str)`must NOT have ${n} than ${r} items`;
  },
  params: ({ schemaCode: e }) => (0, Qr._)`{limit: ${e}}`
}, Au = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Ru,
  code(e) {
    const { keyword: r, data: n, schemaCode: a } = e, u = r === "maxItems" ? Qr.operators.GT : Qr.operators.LT;
    e.fail$data((0, Qr._)`${n}.length ${u} ${a}`);
  }
};
ca.default = Au;
var la = {}, nt = {};
Object.defineProperty(nt, "__esModule", { value: !0 });
const es = In;
es.code = 'require("ajv/dist/runtime/equal").default';
nt.default = es;
Object.defineProperty(la, "__esModule", { value: !0 });
const Mt = rt, Ee = se, Iu = ie, Mu = nt, Du = {
  message: ({ params: { i: e, j: r } }) => (0, Ee.str)`must NOT have duplicate items (items ## ${r} and ${e} are identical)`,
  params: ({ params: { i: e, j: r } }) => (0, Ee._)`{i: ${e}, j: ${r}}`
}, Lu = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Du,
  code(e) {
    const { gen: r, data: n, $data: a, schema: u, parentSchema: o, schemaCode: p, it: y } = e;
    if (!a && !u)
      return;
    const b = r.let("valid"), v = o.items ? (0, Mt.getSchemaTypes)(o.items) : [];
    e.block$data(b, g, (0, Ee._)`${p} === false`), e.ok(b);
    function g() {
      const R = r.let("i", (0, Ee._)`${n}.length`), j = r.let("j");
      e.setParams({ i: R, j }), r.assign(b, !0), r.if((0, Ee._)`${R} > 1`, () => (S() ? z : L)(R, j));
    }
    function S() {
      return v.length > 0 && !v.some((R) => R === "object" || R === "array");
    }
    function z(R, j) {
      const T = r.name("item"), $ = (0, Mt.checkDataTypes)(v, T, y.opts.strictNumbers, Mt.DataType.Wrong), O = r.const("indices", (0, Ee._)`{}`);
      r.for((0, Ee._)`;${R}--;`, () => {
        r.let(T, (0, Ee._)`${n}[${R}]`), r.if($, (0, Ee._)`continue`), v.length > 1 && r.if((0, Ee._)`typeof ${T} == "string"`, (0, Ee._)`${T} += "_"`), r.if((0, Ee._)`typeof ${O}[${T}] == "number"`, () => {
          r.assign(j, (0, Ee._)`${O}[${T}]`), e.error(), r.assign(b, !1).break();
        }).code((0, Ee._)`${O}[${T}] = ${R}`);
      });
    }
    function L(R, j) {
      const T = (0, Iu.useFunc)(r, Mu.default), $ = r.name("outer");
      r.label($).for((0, Ee._)`;${R}--;`, () => r.for((0, Ee._)`${j} = ${R}; ${j}--;`, () => r.if((0, Ee._)`${T}(${n}[${R}], ${n}[${j}])`, () => {
        e.error(), r.assign(b, !1).break($);
      })));
    }
  }
};
la.default = Lu;
var fa = {};
Object.defineProperty(fa, "__esModule", { value: !0 });
const Bt = se, zu = ie, Vu = nt, Fu = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Bt._)`{allowedValue: ${e}}`
}, Uu = {
  keyword: "const",
  $data: !0,
  error: Fu,
  code(e) {
    const { gen: r, data: n, $data: a, schemaCode: u, schema: o } = e;
    a || o && typeof o == "object" ? e.fail$data((0, Bt._)`!${(0, zu.useFunc)(r, Vu.default)}(${n}, ${u})`) : e.fail((0, Bt._)`${o} !== ${n}`);
  }
};
fa.default = Uu;
var ha = {};
Object.defineProperty(ha, "__esModule", { value: !0 });
const Wr = se, Bu = ie, Hu = nt, qu = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Wr._)`{allowedValues: ${e}}`
}, Gu = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: qu,
  code(e) {
    const { gen: r, data: n, $data: a, schema: u, schemaCode: o, it: p } = e;
    if (!a && u.length === 0)
      throw new Error("enum must have non-empty array");
    const y = u.length >= p.opts.loopEnum;
    let b;
    const v = () => b ?? (b = (0, Bu.useFunc)(r, Hu.default));
    let g;
    if (y || a)
      g = r.let("valid"), e.block$data(g, S);
    else {
      if (!Array.isArray(u))
        throw new Error("ajv implementation error");
      const L = r.const("vSchema", o);
      g = (0, Wr.or)(...u.map((R, j) => z(L, j)));
    }
    e.pass(g);
    function S() {
      r.assign(g, !1), r.forOf("v", o, (L) => r.if((0, Wr._)`${v()}(${n}, ${L})`, () => r.assign(g, !0).break()));
    }
    function z(L, R) {
      const j = u[R];
      return typeof j == "object" && j !== null ? (0, Wr._)`${v()}(${n}, ${L}[${R}])` : (0, Wr._)`${n} === ${j}`;
    }
  }
};
ha.default = Gu;
Object.defineProperty(ta, "__esModule", { value: !0 });
const Ku = aa, Wu = na, Ju = sa, Zu = ua, Yu = ia, Xu = oa, Qu = ca, xu = la, ei = fa, ri = ha, ti = [
  // number
  Ku.default,
  Wu.default,
  // string
  Ju.default,
  Zu.default,
  // object
  Yu.default,
  Xu.default,
  // array
  Qu.default,
  xu.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  ei.default,
  ri.default
];
ta.default = ti;
var pa = {}, Ir = {};
Object.defineProperty(Ir, "__esModule", { value: !0 });
Ir.validateAdditionalItems = void 0;
const _r = se, Ht = ie, ai = {
  message: ({ params: { len: e } }) => (0, _r.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, _r._)`{limit: ${e}}`
}, ni = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: ai,
  code(e) {
    const { parentSchema: r, it: n } = e, { items: a } = r;
    if (!Array.isArray(a)) {
      (0, Ht.checkStrictMode)(n, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    rs(e, a);
  }
};
function rs(e, r) {
  const { gen: n, schema: a, data: u, keyword: o, it: p } = e;
  p.items = !0;
  const y = n.const("len", (0, _r._)`${u}.length`);
  if (a === !1)
    e.setParams({ len: r.length }), e.pass((0, _r._)`${y} <= ${r.length}`);
  else if (typeof a == "object" && !(0, Ht.alwaysValidSchema)(p, a)) {
    const v = n.var("valid", (0, _r._)`${y} <= ${r.length}`);
    n.if((0, _r.not)(v), () => b(v)), e.ok(v);
  }
  function b(v) {
    n.forRange("i", r.length, y, (g) => {
      e.subschema({ keyword: o, dataProp: g, dataPropType: Ht.Type.Num }, v), p.allErrors || n.if((0, _r.not)(v), () => n.break());
    });
  }
}
Ir.validateAdditionalItems = rs;
Ir.default = ni;
var ma = {}, Mr = {};
Object.defineProperty(Mr, "__esModule", { value: !0 });
Mr.validateTuple = void 0;
const rn = se, _t = ie, si = ne, di = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: r, it: n } = e;
    if (Array.isArray(r))
      return ts(e, "additionalItems", r);
    n.items = !0, !(0, _t.alwaysValidSchema)(n, r) && e.ok((0, si.validateArray)(e));
  }
};
function ts(e, r, n = e.schema) {
  const { gen: a, parentSchema: u, data: o, keyword: p, it: y } = e;
  g(u), y.opts.unevaluated && n.length && y.items !== !0 && (y.items = _t.mergeEvaluated.items(a, n.length, y.items));
  const b = a.name("valid"), v = a.const("len", (0, rn._)`${o}.length`);
  n.forEach((S, z) => {
    (0, _t.alwaysValidSchema)(y, S) || (a.if((0, rn._)`${v} > ${z}`, () => e.subschema({
      keyword: p,
      schemaProp: z,
      dataProp: z
    }, b)), e.ok(b));
  });
  function g(S) {
    const { opts: z, errSchemaPath: L } = y, R = n.length, j = R === S.minItems && (R === S.maxItems || S[r] === !1);
    if (z.strictTuples && !j) {
      const T = `"${p}" is ${R}-tuple, but minItems or maxItems/${r} are not specified or different at path "${L}"`;
      (0, _t.checkStrictMode)(y, T, z.strictTuples);
    }
  }
}
Mr.validateTuple = ts;
Mr.default = di;
Object.defineProperty(ma, "__esModule", { value: !0 });
const ui = Mr, ii = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, ui.validateTuple)(e, "items")
};
ma.default = ii;
var ga = {};
Object.defineProperty(ga, "__esModule", { value: !0 });
const tn = se, oi = ie, ci = ne, li = Ir, fi = {
  message: ({ params: { len: e } }) => (0, tn.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, tn._)`{limit: ${e}}`
}, hi = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: fi,
  code(e) {
    const { schema: r, parentSchema: n, it: a } = e, { prefixItems: u } = n;
    a.items = !0, !(0, oi.alwaysValidSchema)(a, r) && (u ? (0, li.validateAdditionalItems)(e, u) : e.ok((0, ci.validateArray)(e)));
  }
};
ga.default = hi;
var _a = {};
Object.defineProperty(_a, "__esModule", { value: !0 });
const ze = se, ct = ie, pi = {
  message: ({ params: { min: e, max: r } }) => r === void 0 ? (0, ze.str)`must contain at least ${e} valid item(s)` : (0, ze.str)`must contain at least ${e} and no more than ${r} valid item(s)`,
  params: ({ params: { min: e, max: r } }) => r === void 0 ? (0, ze._)`{minContains: ${e}}` : (0, ze._)`{minContains: ${e}, maxContains: ${r}}`
}, mi = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: pi,
  code(e) {
    const { gen: r, schema: n, parentSchema: a, data: u, it: o } = e;
    let p, y;
    const { minContains: b, maxContains: v } = a;
    o.opts.next ? (p = b === void 0 ? 1 : b, y = v) : p = 1;
    const g = r.const("len", (0, ze._)`${u}.length`);
    if (e.setParams({ min: p, max: y }), y === void 0 && p === 0) {
      (0, ct.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (y !== void 0 && p > y) {
      (0, ct.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, ct.alwaysValidSchema)(o, n)) {
      let j = (0, ze._)`${g} >= ${p}`;
      y !== void 0 && (j = (0, ze._)`${j} && ${g} <= ${y}`), e.pass(j);
      return;
    }
    o.items = !0;
    const S = r.name("valid");
    y === void 0 && p === 1 ? L(S, () => r.if(S, () => r.break())) : p === 0 ? (r.let(S, !0), y !== void 0 && r.if((0, ze._)`${u}.length > 0`, z)) : (r.let(S, !1), z()), e.result(S, () => e.reset());
    function z() {
      const j = r.name("_valid"), T = r.let("count", 0);
      L(j, () => r.if(j, () => R(T)));
    }
    function L(j, T) {
      r.forRange("i", 0, g, ($) => {
        e.subschema({
          keyword: "contains",
          dataProp: $,
          dataPropType: ct.Type.Num,
          compositeRule: !0
        }, j), T();
      });
    }
    function R(j) {
      r.code((0, ze._)`${j}++`), y === void 0 ? r.if((0, ze._)`${j} >= ${p}`, () => r.assign(S, !0).break()) : (r.if((0, ze._)`${j} > ${y}`, () => r.assign(S, !1).break()), p === 1 ? r.assign(S, !0) : r.if((0, ze._)`${j} >= ${p}`, () => r.assign(S, !0)));
    }
  }
};
_a.default = mi;
var as = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const r = se, n = ie, a = ne;
  e.error = {
    message: ({ params: { property: b, depsCount: v, deps: g } }) => {
      const S = v === 1 ? "property" : "properties";
      return (0, r.str)`must have ${S} ${g} when property ${b} is present`;
    },
    params: ({ params: { property: b, depsCount: v, deps: g, missingProperty: S } }) => (0, r._)`{property: ${b},
    missingProperty: ${S},
    depsCount: ${v},
    deps: ${g}}`
    // TODO change to reference
  };
  const u = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(b) {
      const [v, g] = o(b);
      p(b, v), y(b, g);
    }
  };
  function o({ schema: b }) {
    const v = {}, g = {};
    for (const S in b) {
      if (S === "__proto__")
        continue;
      const z = Array.isArray(b[S]) ? v : g;
      z[S] = b[S];
    }
    return [v, g];
  }
  function p(b, v = b.schema) {
    const { gen: g, data: S, it: z } = b;
    if (Object.keys(v).length === 0)
      return;
    const L = g.let("missing");
    for (const R in v) {
      const j = v[R];
      if (j.length === 0)
        continue;
      const T = (0, a.propertyInData)(g, S, R, z.opts.ownProperties);
      b.setParams({
        property: R,
        depsCount: j.length,
        deps: j.join(", ")
      }), z.allErrors ? g.if(T, () => {
        for (const $ of j)
          (0, a.checkReportMissingProp)(b, $);
      }) : (g.if((0, r._)`${T} && (${(0, a.checkMissingProp)(b, j, L)})`), (0, a.reportMissingProp)(b, L), g.else());
    }
  }
  e.validatePropertyDeps = p;
  function y(b, v = b.schema) {
    const { gen: g, data: S, keyword: z, it: L } = b, R = g.name("valid");
    for (const j in v)
      (0, n.alwaysValidSchema)(L, v[j]) || (g.if(
        (0, a.propertyInData)(g, S, j, L.opts.ownProperties),
        () => {
          const T = b.subschema({ keyword: z, schemaProp: j }, R);
          b.mergeValidEvaluated(T, R);
        },
        () => g.var(R, !0)
        // TODO var
      ), b.ok(R));
  }
  e.validateSchemaDeps = y, e.default = u;
})(as);
var va = {};
Object.defineProperty(va, "__esModule", { value: !0 });
const ns = se, gi = ie, _i = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, ns._)`{propertyName: ${e.propertyName}}`
}, vi = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: _i,
  code(e) {
    const { gen: r, schema: n, data: a, it: u } = e;
    if ((0, gi.alwaysValidSchema)(u, n))
      return;
    const o = r.name("valid");
    r.forIn("key", a, (p) => {
      e.setParams({ propertyName: p }), e.subschema({
        keyword: "propertyNames",
        data: p,
        dataTypes: ["string"],
        propertyName: p,
        compositeRule: !0
      }, o), r.if((0, ns.not)(o), () => {
        e.error(!0), u.allErrors || r.break();
      });
    }), e.ok(o);
  }
};
va.default = vi;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
const lt = ne, Fe = se, yi = Qe, ft = ie, wi = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Fe._)`{additionalProperty: ${e.additionalProperty}}`
}, bi = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: wi,
  code(e) {
    const { gen: r, schema: n, parentSchema: a, data: u, errsCount: o, it: p } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: y, opts: b } = p;
    if (p.props = !0, b.removeAdditional !== "all" && (0, ft.alwaysValidSchema)(p, n))
      return;
    const v = (0, lt.allSchemaProperties)(a.properties), g = (0, lt.allSchemaProperties)(a.patternProperties);
    S(), e.ok((0, Fe._)`${o} === ${yi.default.errors}`);
    function S() {
      r.forIn("key", u, (T) => {
        !v.length && !g.length ? R(T) : r.if(z(T), () => R(T));
      });
    }
    function z(T) {
      let $;
      if (v.length > 8) {
        const O = (0, ft.schemaRefOrVal)(p, a.properties, "properties");
        $ = (0, lt.isOwnProperty)(r, O, T);
      } else
        v.length ? $ = (0, Fe.or)(...v.map((O) => (0, Fe._)`${T} === ${O}`)) : $ = Fe.nil;
      return g.length && ($ = (0, Fe.or)($, ...g.map((O) => (0, Fe._)`${(0, lt.usePattern)(e, O)}.test(${T})`))), (0, Fe.not)($);
    }
    function L(T) {
      r.code((0, Fe._)`delete ${u}[${T}]`);
    }
    function R(T) {
      if (b.removeAdditional === "all" || b.removeAdditional && n === !1) {
        L(T);
        return;
      }
      if (n === !1) {
        e.setParams({ additionalProperty: T }), e.error(), y || r.break();
        return;
      }
      if (typeof n == "object" && !(0, ft.alwaysValidSchema)(p, n)) {
        const $ = r.name("valid");
        b.removeAdditional === "failing" ? (j(T, $, !1), r.if((0, Fe.not)($), () => {
          e.reset(), L(T);
        })) : (j(T, $), y || r.if((0, Fe.not)($), () => r.break()));
      }
    }
    function j(T, $, O) {
      const D = {
        keyword: "additionalProperties",
        dataProp: T,
        dataPropType: ft.Type.Str
      };
      O === !1 && Object.assign(D, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(D, $);
    }
  }
};
Ot.default = bi;
var ya = {};
Object.defineProperty(ya, "__esModule", { value: !0 });
const $i = He, an = ne, Dt = ie, nn = Ot, Ei = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: r, schema: n, parentSchema: a, data: u, it: o } = e;
    o.opts.removeAdditional === "all" && a.additionalProperties === void 0 && nn.default.code(new $i.KeywordCxt(o, nn.default, "additionalProperties"));
    const p = (0, an.allSchemaProperties)(n);
    for (const S of p)
      o.definedProperties.add(S);
    o.opts.unevaluated && p.length && o.props !== !0 && (o.props = Dt.mergeEvaluated.props(r, (0, Dt.toHash)(p), o.props));
    const y = p.filter((S) => !(0, Dt.alwaysValidSchema)(o, n[S]));
    if (y.length === 0)
      return;
    const b = r.name("valid");
    for (const S of y)
      v(S) ? g(S) : (r.if((0, an.propertyInData)(r, u, S, o.opts.ownProperties)), g(S), o.allErrors || r.else().var(b, !0), r.endIf()), e.it.definedProperties.add(S), e.ok(b);
    function v(S) {
      return o.opts.useDefaults && !o.compositeRule && n[S].default !== void 0;
    }
    function g(S) {
      e.subschema({
        keyword: "properties",
        schemaProp: S,
        dataProp: S
      }, b);
    }
  }
};
ya.default = Ei;
var wa = {};
Object.defineProperty(wa, "__esModule", { value: !0 });
const sn = ne, ht = se, dn = ie, un = ie, ki = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: r, schema: n, data: a, parentSchema: u, it: o } = e, { opts: p } = o, y = (0, sn.allSchemaProperties)(n), b = y.filter((j) => (0, dn.alwaysValidSchema)(o, n[j]));
    if (y.length === 0 || b.length === y.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const v = p.strictSchema && !p.allowMatchingProperties && u.properties, g = r.name("valid");
    o.props !== !0 && !(o.props instanceof ht.Name) && (o.props = (0, un.evaluatedPropsToName)(r, o.props));
    const { props: S } = o;
    z();
    function z() {
      for (const j of y)
        v && L(j), o.allErrors ? R(j) : (r.var(g, !0), R(j), r.if(g));
    }
    function L(j) {
      for (const T in v)
        new RegExp(j).test(T) && (0, dn.checkStrictMode)(o, `property ${T} matches pattern ${j} (use allowMatchingProperties)`);
    }
    function R(j) {
      r.forIn("key", a, (T) => {
        r.if((0, ht._)`${(0, sn.usePattern)(e, j)}.test(${T})`, () => {
          const $ = b.includes(j);
          $ || e.subschema({
            keyword: "patternProperties",
            schemaProp: j,
            dataProp: T,
            dataPropType: un.Type.Str
          }, g), o.opts.unevaluated && S !== !0 ? r.assign((0, ht._)`${S}[${T}]`, !0) : !$ && !o.allErrors && r.if((0, ht.not)(g), () => r.break());
        });
      });
    }
  }
};
wa.default = ki;
var ba = {};
Object.defineProperty(ba, "__esModule", { value: !0 });
const Pi = ie, Si = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: r, schema: n, it: a } = e;
    if ((0, Pi.alwaysValidSchema)(a, n)) {
      e.fail();
      return;
    }
    const u = r.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, u), e.failResult(u, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
ba.default = Si;
var $a = {};
Object.defineProperty($a, "__esModule", { value: !0 });
const Ci = ne, Ti = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Ci.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
$a.default = Ti;
var Ea = {};
Object.defineProperty(Ea, "__esModule", { value: !0 });
const vt = se, ji = ie, Oi = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, vt._)`{passingSchemas: ${e.passing}}`
}, Ni = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Oi,
  code(e) {
    const { gen: r, schema: n, parentSchema: a, it: u } = e;
    if (!Array.isArray(n))
      throw new Error("ajv implementation error");
    if (u.opts.discriminator && a.discriminator)
      return;
    const o = n, p = r.let("valid", !1), y = r.let("passing", null), b = r.name("_valid");
    e.setParams({ passing: y }), r.block(v), e.result(p, () => e.reset(), () => e.error(!0));
    function v() {
      o.forEach((g, S) => {
        let z;
        (0, ji.alwaysValidSchema)(u, g) ? r.var(b, !0) : z = e.subschema({
          keyword: "oneOf",
          schemaProp: S,
          compositeRule: !0
        }, b), S > 0 && r.if((0, vt._)`${b} && ${p}`).assign(p, !1).assign(y, (0, vt._)`[${y}, ${S}]`).else(), r.if(b, () => {
          r.assign(p, !0), r.assign(y, S), z && e.mergeEvaluated(z, vt.Name);
        });
      });
    }
  }
};
Ea.default = Ni;
var ka = {};
Object.defineProperty(ka, "__esModule", { value: !0 });
const Ri = ie, Ai = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: r, schema: n, it: a } = e;
    if (!Array.isArray(n))
      throw new Error("ajv implementation error");
    const u = r.name("valid");
    n.forEach((o, p) => {
      if ((0, Ri.alwaysValidSchema)(a, o))
        return;
      const y = e.subschema({ keyword: "allOf", schemaProp: p }, u);
      e.ok(u), e.mergeEvaluated(y);
    });
  }
};
ka.default = Ai;
var Pa = {};
Object.defineProperty(Pa, "__esModule", { value: !0 });
const kt = se, ss = ie, Ii = {
  message: ({ params: e }) => (0, kt.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, kt._)`{failingKeyword: ${e.ifClause}}`
}, Mi = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Ii,
  code(e) {
    const { gen: r, parentSchema: n, it: a } = e;
    n.then === void 0 && n.else === void 0 && (0, ss.checkStrictMode)(a, '"if" without "then" and "else" is ignored');
    const u = on(a, "then"), o = on(a, "else");
    if (!u && !o)
      return;
    const p = r.let("valid", !0), y = r.name("_valid");
    if (b(), e.reset(), u && o) {
      const g = r.let("ifClause");
      e.setParams({ ifClause: g }), r.if(y, v("then", g), v("else", g));
    } else
      u ? r.if(y, v("then")) : r.if((0, kt.not)(y), v("else"));
    e.pass(p, () => e.error(!0));
    function b() {
      const g = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, y);
      e.mergeEvaluated(g);
    }
    function v(g, S) {
      return () => {
        const z = e.subschema({ keyword: g }, y);
        r.assign(p, y), e.mergeValidEvaluated(z, p), S ? r.assign(S, (0, kt._)`${g}`) : e.setParams({ ifClause: g });
      };
    }
  }
};
function on(e, r) {
  const n = e.schema[r];
  return n !== void 0 && !(0, ss.alwaysValidSchema)(e, n);
}
Pa.default = Mi;
var Sa = {};
Object.defineProperty(Sa, "__esModule", { value: !0 });
const Di = ie, Li = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: r, it: n }) {
    r.if === void 0 && (0, Di.checkStrictMode)(n, `"${e}" without "if" is ignored`);
  }
};
Sa.default = Li;
Object.defineProperty(pa, "__esModule", { value: !0 });
const zi = Ir, Vi = ma, Fi = Mr, Ui = ga, Bi = _a, Hi = as, qi = va, Gi = Ot, Ki = ya, Wi = wa, Ji = ba, Zi = $a, Yi = Ea, Xi = ka, Qi = Pa, xi = Sa;
function eo(e = !1) {
  const r = [
    // any
    Ji.default,
    Zi.default,
    Yi.default,
    Xi.default,
    Qi.default,
    xi.default,
    // object
    qi.default,
    Gi.default,
    Hi.default,
    Ki.default,
    Wi.default
  ];
  return e ? r.push(Vi.default, Ui.default) : r.push(zi.default, Fi.default), r.push(Bi.default), r;
}
pa.default = eo;
var Ca = {}, Ta = {};
Object.defineProperty(Ta, "__esModule", { value: !0 });
const ye = se, ro = {
  message: ({ schemaCode: e }) => (0, ye.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, ye._)`{format: ${e}}`
}, to = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: ro,
  code(e, r) {
    const { gen: n, data: a, $data: u, schema: o, schemaCode: p, it: y } = e, { opts: b, errSchemaPath: v, schemaEnv: g, self: S } = y;
    if (!b.validateFormats)
      return;
    u ? z() : L();
    function z() {
      const R = n.scopeValue("formats", {
        ref: S.formats,
        code: b.code.formats
      }), j = n.const("fDef", (0, ye._)`${R}[${p}]`), T = n.let("fType"), $ = n.let("format");
      n.if((0, ye._)`typeof ${j} == "object" && !(${j} instanceof RegExp)`, () => n.assign(T, (0, ye._)`${j}.type || "string"`).assign($, (0, ye._)`${j}.validate`), () => n.assign(T, (0, ye._)`"string"`).assign($, j)), e.fail$data((0, ye.or)(O(), D()));
      function O() {
        return b.strictSchema === !1 ? ye.nil : (0, ye._)`${p} && !${$}`;
      }
      function D() {
        const t = g.$async ? (0, ye._)`(${j}.async ? await ${$}(${a}) : ${$}(${a}))` : (0, ye._)`${$}(${a})`, d = (0, ye._)`(typeof ${$} == "function" ? ${t} : ${$}.test(${a}))`;
        return (0, ye._)`${$} && ${$} !== true && ${T} === ${r} && !${d}`;
      }
    }
    function L() {
      const R = S.formats[o];
      if (!R) {
        O();
        return;
      }
      if (R === !0)
        return;
      const [j, T, $] = D(R);
      j === r && e.pass(t());
      function O() {
        if (b.strictSchema === !1) {
          S.logger.warn(d());
          return;
        }
        throw new Error(d());
        function d() {
          return `unknown format "${o}" ignored in schema at path "${v}"`;
        }
      }
      function D(d) {
        const s = d instanceof RegExp ? (0, ye.regexpCode)(d) : b.code.formats ? (0, ye._)`${b.code.formats}${(0, ye.getProperty)(o)}` : void 0, i = n.scopeValue("formats", { key: o, ref: d, code: s });
        return typeof d == "object" && !(d instanceof RegExp) ? [d.type || "string", d.validate, (0, ye._)`${i}.validate`] : ["string", d, i];
      }
      function t() {
        if (typeof R == "object" && !(R instanceof RegExp) && R.async) {
          if (!g.$async)
            throw new Error("async format in sync schema");
          return (0, ye._)`await ${$}(${a})`;
        }
        return typeof T == "function" ? (0, ye._)`${$}(${a})` : (0, ye._)`${$}.test(${a})`;
      }
    }
  }
};
Ta.default = to;
Object.defineProperty(Ca, "__esModule", { value: !0 });
const ao = Ta, no = [ao.default];
Ca.default = no;
var Ar = {};
Object.defineProperty(Ar, "__esModule", { value: !0 });
Ar.contentVocabulary = Ar.metadataVocabulary = void 0;
Ar.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Ar.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(xt, "__esModule", { value: !0 });
const so = ea, uo = ta, io = pa, oo = Ca, cn = Ar, co = [
  so.default,
  uo.default,
  (0, io.default)(),
  oo.default,
  cn.metadataVocabulary,
  cn.contentVocabulary
];
xt.default = co;
var ja = {}, ds = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.DiscrError = void 0, function(r) {
    r.Tag = "tag", r.Mapping = "mapping";
  }(e.DiscrError || (e.DiscrError = {}));
})(ds);
Object.defineProperty(ja, "__esModule", { value: !0 });
const Tr = se, qt = ds, ln = Re, lo = ie, fo = {
  message: ({ params: { discrError: e, tagName: r } }) => e === qt.DiscrError.Tag ? `tag "${r}" must be string` : `value of tag "${r}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: r, tagName: n } }) => (0, Tr._)`{error: ${e}, tag: ${n}, tagValue: ${r}}`
}, ho = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: fo,
  code(e) {
    const { gen: r, data: n, schema: a, parentSchema: u, it: o } = e, { oneOf: p } = u;
    if (!o.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const y = a.propertyName;
    if (typeof y != "string")
      throw new Error("discriminator: requires propertyName");
    if (a.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!p)
      throw new Error("discriminator: requires oneOf keyword");
    const b = r.let("valid", !1), v = r.const("tag", (0, Tr._)`${n}${(0, Tr.getProperty)(y)}`);
    r.if((0, Tr._)`typeof ${v} == "string"`, () => g(), () => e.error(!1, { discrError: qt.DiscrError.Tag, tag: v, tagName: y })), e.ok(b);
    function g() {
      const L = z();
      r.if(!1);
      for (const R in L)
        r.elseIf((0, Tr._)`${v} === ${R}`), r.assign(b, S(L[R]));
      r.else(), e.error(!1, { discrError: qt.DiscrError.Mapping, tag: v, tagName: y }), r.endIf();
    }
    function S(L) {
      const R = r.name("valid"), j = e.subschema({ keyword: "oneOf", schemaProp: L }, R);
      return e.mergeEvaluated(j, Tr.Name), R;
    }
    function z() {
      var L;
      const R = {}, j = $(u);
      let T = !0;
      for (let t = 0; t < p.length; t++) {
        let d = p[t];
        d != null && d.$ref && !(0, lo.schemaHasRulesButRef)(d, o.self.RULES) && (d = ln.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, d == null ? void 0 : d.$ref), d instanceof ln.SchemaEnv && (d = d.schema));
        const s = (L = d == null ? void 0 : d.properties) === null || L === void 0 ? void 0 : L[y];
        if (typeof s != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${y}"`);
        T = T && (j || $(d)), O(s, t);
      }
      if (!T)
        throw new Error(`discriminator: "${y}" must be required`);
      return R;
      function $({ required: t }) {
        return Array.isArray(t) && t.includes(y);
      }
      function O(t, d) {
        if (t.const)
          D(t.const, d);
        else if (t.enum)
          for (const s of t.enum)
            D(s, d);
        else
          throw new Error(`discriminator: "properties/${y}" must have "const" or "enum"`);
      }
      function D(t, d) {
        if (typeof t != "string" || t in R)
          throw new Error(`discriminator: "${y}" values must be unique strings`);
        R[t] = d;
      }
    }
  }
};
ja.default = ho;
const po = "http://json-schema.org/draft-07/schema#", mo = "http://json-schema.org/draft-07/schema#", go = "Core schema meta-schema", _o = {
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
}, vo = [
  "object",
  "boolean"
], yo = {
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
}, wo = {
  $schema: po,
  $id: mo,
  title: go,
  definitions: _o,
  type: vo,
  properties: yo,
  default: !0
};
(function(e, r) {
  Object.defineProperty(r, "__esModule", { value: !0 }), r.MissingRefError = r.ValidationError = r.CodeGen = r.Name = r.nil = r.stringify = r.str = r._ = r.KeywordCxt = void 0;
  const n = Sn, a = xt, u = ja, o = wo, p = ["/properties"], y = "http://json-schema.org/draft-07/schema";
  class b extends n.default {
    _addVocabularies() {
      super._addVocabularies(), a.default.forEach((R) => this.addVocabulary(R)), this.opts.discriminator && this.addKeyword(u.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const R = this.opts.$data ? this.$dataMetaSchema(o, p) : o;
      this.addMetaSchema(R, y, !1), this.refs["http://json-schema.org/schema"] = y;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(y) ? y : void 0);
    }
  }
  e.exports = r = b, Object.defineProperty(r, "__esModule", { value: !0 }), r.default = b;
  var v = He;
  Object.defineProperty(r, "KeywordCxt", { enumerable: !0, get: function() {
    return v.KeywordCxt;
  } });
  var g = se;
  Object.defineProperty(r, "_", { enumerable: !0, get: function() {
    return g._;
  } }), Object.defineProperty(r, "str", { enumerable: !0, get: function() {
    return g.str;
  } }), Object.defineProperty(r, "stringify", { enumerable: !0, get: function() {
    return g.stringify;
  } }), Object.defineProperty(r, "nil", { enumerable: !0, get: function() {
    return g.nil;
  } }), Object.defineProperty(r, "Name", { enumerable: !0, get: function() {
    return g.Name;
  } }), Object.defineProperty(r, "CodeGen", { enumerable: !0, get: function() {
    return g.CodeGen;
  } });
  var S = tt;
  Object.defineProperty(r, "ValidationError", { enumerable: !0, get: function() {
    return S.default;
  } });
  var z = at;
  Object.defineProperty(r, "MissingRefError", { enumerable: !0, get: function() {
    return z.default;
  } });
})(zt, zt.exports);
var bo = zt.exports;
const $o = /* @__PURE__ */ Pn(bo);
class Eo {
  constructor() {
    be(this, "ajv");
    this.ajv = new $o();
  }
  validateJson(r, n) {
    const a = this.ajv.validate(r, n);
    return a ? { valid: a } : { valid: a, error: this.ajv.errorsText() };
  }
  validateObjectSchema(r, n) {
    const a = this.ajv.validate(r, n);
    return a ? { valid: a } : { valid: a, error: this.ajv.errorsText() };
  }
}
class ko {
  constructor() {
    be(this, "TIME_SPLIT", " ");
  }
  /**
   * 给日期添加小时
   *
   * @param date - Date
   * @param numOfHours - 数字
   * @author terwer
   * @since 1.0.0
   */
  addHoursToDate(r, n) {
    return r.setTime(r.getTime() + n * 60 * 60 * 1e3), r;
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
  formatIsoToZhDateFormat(r, n, a) {
    if (!r)
      return "";
    let u = r;
    const o = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(.\d{3})Z$/gm, p = u.match(o);
    if (p == null)
      return r;
    for (let y = 0; y < p.length; y++) {
      const b = p[y];
      let v = b;
      n && (v = this.addHoursToDate(new Date(b), 8).toISOString());
      const g = v.split("T"), S = g[0], z = g[1].split(".")[0];
      let L = S + this.TIME_SPLIT + z;
      a && (L = S), u = u.replace(b, L);
    }
    return u;
  }
  /**
   * 转换ISO日期为中文完整时间
   *
   * @param str - '2022-07-18T06:25:48.000Z
   */
  formatIsoToZh(r) {
    return this.formatIsoToZhDateFormat(r, !1, !1);
  }
  /**
   * 转换ISO日期为中文日期
   *
   * @param str - '2022-07-18T06:25:48.000Z
   */
  formatIsoToZhDate(r) {
    return this.formatIsoToZhDateFormat(r, !1, !0);
  }
  /**
   * 转换ISO日期为中文时间
   *
   * @param str - '2022-07-18T06:25:48.000Z
   */
  formatIsoToZhTime(r) {
    return this.formatIsoToZhDateFormat(r, !1).split(this.TIME_SPLIT)[1];
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
class Po {
  /**
   * 格式化字符串
   *
   * @param str - 字符串，可用占位符，例如：test \{0\} str
   * @param args - 按占位符顺序排列的参数
   * @author terwer
   * @since 0.0.1
   */
  f(r, ...n) {
    let a = r;
    for (let u = 0; u < n.length; u++) {
      const o = n[u];
      typeof o == "string" ? a = a.replace(`{${u}}`, o) : a = a.replace(`{${u}}`, o.toString());
    }
    return a;
  }
  /**
   * 字符串拼接
   *
   * @param str - 字符串数组
   */
  appendStr(...r) {
    return r.join("");
  }
  /**
   * 判断字符串中，是否包含数组中任何一个元素
   *
   * @param str - 字符串
   * @param arr - 字符串数组
   */
  includeInArray(r, n) {
    let a = !1;
    for (let u = 0; u < n.length; u++) {
      const o = n[u];
      r.includes(o) && (a = !0);
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
  getByLength(r, n, a) {
    const u = r;
    return u.length < n ? u : a ? u.substring(0, n) : u.substring(0, n) + "...";
  }
  /**
   * 字符串空值检测
   *
   * @param str - 待检测的字符串
   */
  isEmptyString(r) {
    return !r || typeof r != "string" ? !0 : r.trim().length === 0;
  }
  /**
   * 路径组合，解决多出来/的问题
   *
   * @param path1 - 路径1
   * @param path2 - 路径2
   */
  pathJoin(r, n) {
    let a = r;
    const u = r.lastIndexOf("/");
    return u + 1 === r.length && (a = r.substring(0, u)), n.indexOf("/") > 0 ? a = a + "/" + n : a = a + n, a;
  }
  /**
   * 强转boolean
   *
   * @param val - val
   */
  parseBoolean(r) {
    return r || (r = "false"), r.toString().toLowerCase() === "true";
  }
}
const Lt = (e, r) => {
  const n = fn(e), a = fn(r), u = n.pop(), o = a.pop(), p = mn(n, a);
  return p !== 0 ? p : u && o ? mn(u.split("."), o.split(".")) : u || o ? u ? -1 : 1 : 0;
}, So = /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i, fn = (e) => {
  if (typeof e != "string")
    throw new TypeError("Invalid argument expected string");
  const r = e.match(So);
  if (!r)
    throw new Error(`Invalid argument not valid semver ('${e}' received)`);
  return r.shift(), r;
}, hn = (e) => e === "*" || e === "x" || e === "X", pn = (e) => {
  const r = parseInt(e, 10);
  return isNaN(r) ? e : r;
}, Co = (e, r) => typeof e != typeof r ? [String(e), String(r)] : [e, r], To = (e, r) => {
  if (hn(e) || hn(r))
    return 0;
  const [n, a] = Co(pn(e), pn(r));
  return n > a ? 1 : n < a ? -1 : 0;
}, mn = (e, r) => {
  for (let n = 0; n < Math.max(e.length, r.length); n++) {
    const a = To(e[n] || "0", r[n] || "0");
    if (a !== 0)
      return a;
  }
  return 0;
};
class jo {
  /**
   * Compare [semver](https://semver.org/) version strings
   * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
   *
   * @param v1 - First version to compare
   * @param v2 - Second version to compare
   * @returns boolean true if v1 is higher than v2
   */
  greater(r, n) {
    return Lt(r, n) > 0;
  }
  /**
   * Compare [semver](https://semver.org/) version strings
   * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
   *
   * @param v1 - First version to compare
   * @param v2 - Second version to compare
   * @returns boolean true if v1 is equal to v2
   */
  equal(r, n) {
    return Lt(r, n) === 0;
  }
  /**
   * Compare [semver](https://semver.org/) version strings
   * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
   *
   * @param v1 - First version to compare
   * @param v2 - Second version to compare
   * @returns boolean true if v1 is lesser than v2
   */
  lesser(r, n) {
    return Lt(r, n) < 0;
  }
}
var Oo = Object.defineProperty, No = (e, r, n) => r in e ? Oo(e, r, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[r] = n, jr = (e, r, n) => (No(e, typeof r != "symbol" ? r + "" : r, n), n);
let dr = class {
};
jr(dr, "NODE_ENV_KEY", "NODE_ENV"), /**
* 开发环境
*/
jr(dr, "NODE_ENV_DEVELOPMENT", "development"), /**
* 生产环境
*/
jr(dr, "NODE_ENV_PRODUCTION", "production"), /**
* 测试环境
*/
jr(dr, "NODE_ENV_TEST", "test"), /**
* 是否处于调试模式
*/
jr(dr, "VITE_DEBUG_MODE_KEY", "VITE_DEBUG_MODE");
class Ro {
  /**
   * 环境初始化
   *
   * @param envMeta - 需要传入 {"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":false} 。特别提醒：此参数是静态元数据，取决于最终使用的项目。因此仅仅在最终使用的地方显示传递此值，中间项目请保持参数传递
   * @see {@link https://vitejs.dev/guide/env-and-mode.html#production-replacement}
   */
  constructor(r) {
    jr(this, "envMeta"), this.envMeta = r;
  }
  /**
   * 是否是开发阶段调试
   */
  isNodeDev() {
    return this.getEnv(dr.NODE_ENV_KEY) === dr.NODE_ENV_DEVELOPMENT;
  }
  /**
   * 是否是调试阶段
   */
  isDev() {
    return this.isNodeDev() || this.getBooleanEnv(dr.VITE_DEBUG_MODE_KEY);
  }
  /**
   * 获取环境变量，key不存在返回undefined
   * @param key - key
   */
  getEnv(r) {
    let n;
    try {
      this.envMeta[r] && (n = this.envMeta[r]);
    } catch {
    }
    return n;
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
    let n = !1;
    return this.getEnv(r) && (n = this.getStringEnv(r).toLowerCase() === "true"), n;
  }
  /**
   * 获取环境变量，如果未定义或者为空值，用指定的默认值代替
   *
   * @param key - key
   * @param defaultValue - 默认值
   * @since 0.1.0
   * @author terwer
   */
  getEnvOrDefault(r, n) {
    const a = this.getStringEnv(r);
    return a.trim().length == 0 ? n : a;
  }
}
var Ao = Object.defineProperty, Io = (e, r, n) => r in e ? Ao(e, r, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[r] = n, Nr = (e, r, n) => (Io(e, typeof r != "symbol" ? r + "" : r, n), n);
class Pt {
}
Nr(Pt, "LOG_LEVEL_KEY", "VITE_LOG_LEVEL"), Nr(Pt, "LOG_PREFIX_KEY", "VITE_LOG_PREFIX");
var Ze = /* @__PURE__ */ ((e) => (e.LOG_LEVEL_TRACE = "TRACE", e.LOG_LEVEL_DEBUG = "DEBUG", e.LOG_LEVEL_INFO = "INFO", e.LOG_LEVEL_WARN = "WARN", e.LOG_LEVEL_ERROR = "ERROR", e))(Ze || {}), us = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Oa(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var is = { exports: {} };
(function(e) {
  (function(r, n) {
    e.exports ? e.exports = n() : r.log = n();
  })(us, function() {
    var r = function() {
    }, n = "undefined", a = typeof window !== n && typeof window.navigator !== n && /Trident\/|MSIE /.test(window.navigator.userAgent), u = [
      "trace",
      "debug",
      "info",
      "warn",
      "error"
    ];
    function o(j, T) {
      var $ = j[T];
      if (typeof $.bind == "function")
        return $.bind(j);
      try {
        return Function.prototype.bind.call($, j);
      } catch {
        return function() {
          return Function.prototype.apply.apply($, [j, arguments]);
        };
      }
    }
    function p() {
      console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
    }
    function y(j) {
      return j === "debug" && (j = "log"), typeof console === n ? !1 : j === "trace" && a ? p : console[j] !== void 0 ? o(console, j) : console.log !== void 0 ? o(console, "log") : r;
    }
    function b(j, T) {
      for (var $ = 0; $ < u.length; $++) {
        var O = u[$];
        this[O] = $ < j ? r : this.methodFactory(O, j, T);
      }
      this.log = this.debug;
    }
    function v(j, T, $) {
      return function() {
        typeof console !== n && (b.call(this, T, $), this[j].apply(this, arguments));
      };
    }
    function g(j, T, $) {
      return y(j) || v.apply(this, arguments);
    }
    function S(j, T, $) {
      var O = this, D;
      T = T ?? "WARN";
      var t = "loglevel";
      typeof j == "string" ? t += ":" + j : typeof j == "symbol" && (t = void 0);
      function d(m) {
        var h = (u[m] || "silent").toUpperCase();
        if (!(typeof window === n || !t)) {
          try {
            window.localStorage[t] = h;
            return;
          } catch {
          }
          try {
            window.document.cookie = encodeURIComponent(t) + "=" + h + ";";
          } catch {
          }
        }
      }
      function s() {
        var m;
        if (!(typeof window === n || !t)) {
          try {
            m = window.localStorage[t];
          } catch {
          }
          if (typeof m === n)
            try {
              var h = window.document.cookie, C = h.indexOf(
                encodeURIComponent(t) + "="
              );
              C !== -1 && (m = /^([^;]+)/.exec(h.slice(C))[1]);
            } catch {
            }
          return O.levels[m] === void 0 && (m = void 0), m;
        }
      }
      function i() {
        if (!(typeof window === n || !t)) {
          try {
            window.localStorage.removeItem(t);
            return;
          } catch {
          }
          try {
            window.document.cookie = encodeURIComponent(t) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
          } catch {
          }
        }
      }
      O.name = j, O.levels = {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        SILENT: 5
      }, O.methodFactory = $ || g, O.getLevel = function() {
        return D;
      }, O.setLevel = function(m, h) {
        if (typeof m == "string" && O.levels[m.toUpperCase()] !== void 0 && (m = O.levels[m.toUpperCase()]), typeof m == "number" && m >= 0 && m <= O.levels.SILENT) {
          if (D = m, h !== !1 && d(m), b.call(O, m, j), typeof console === n && m < O.levels.SILENT)
            return "No console available for logging";
        } else
          throw "log.setLevel() called with invalid level: " + m;
      }, O.setDefaultLevel = function(m) {
        T = m, s() || O.setLevel(m, !1);
      }, O.resetLevel = function() {
        O.setLevel(T, !1), i();
      }, O.enableAll = function(m) {
        O.setLevel(O.levels.TRACE, m);
      }, O.disableAll = function(m) {
        O.setLevel(O.levels.SILENT, m);
      };
      var c = s();
      c == null && (c = T), O.setLevel(c, !1);
    }
    var z = new S(), L = {};
    z.getLogger = function(j) {
      if (typeof j != "symbol" && typeof j != "string" || j === "")
        throw new TypeError("You must supply a name when creating a logger.");
      var T = L[j];
      return T || (T = L[j] = new S(
        j,
        z.getLevel(),
        z.methodFactory
      )), T;
    };
    var R = typeof window !== n ? window.log : void 0;
    return z.noConflict = function() {
      return typeof window !== n && window.log === z && (window.log = R), z;
    }, z.getLoggers = function() {
      return L;
    }, z.default = z, z;
  });
})(is);
var Mo = is.exports;
const pt = /* @__PURE__ */ Oa(Mo);
var os = { exports: {} };
(function(e) {
  (function(r, n) {
    e.exports ? e.exports = n() : r.prefix = n(r);
  })(us, function(r) {
    var n = function(g) {
      for (var S = 1, z = arguments.length, L; S < z; S++)
        for (L in arguments[S])
          Object.prototype.hasOwnProperty.call(arguments[S], L) && (g[L] = arguments[S][L]);
      return g;
    }, a = {
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
    }, u, o = {}, p = function(g) {
      if (!g || !g.getLogger)
        throw new TypeError("Argument is not a root logger");
      u = g;
    }, y = function(g, S) {
      if (!g || !g.setLevel)
        throw new TypeError("Argument is not a logger");
      var z = g.methodFactory, L = g.name || "", R = o[L] || o[""] || a;
      function j(T, $, O) {
        var D = z(T, $, O), t = o[O] || o[""], d = t.template.indexOf("%t") !== -1, s = t.template.indexOf("%l") !== -1, i = t.template.indexOf("%n") !== -1;
        return function() {
          for (var c = "", m = arguments.length, h = Array(m), C = 0; C < m; C++)
            h[C] = arguments[C];
          if (L || !o[O]) {
            var U = t.timestampFormatter(/* @__PURE__ */ new Date()), H = t.levelFormatter(T), V = t.nameFormatter(O);
            t.format ? c += t.format(H, V, U) : (c += t.template, d && (c = c.replace(/%t/, U)), s && (c = c.replace(/%l/, H)), i && (c = c.replace(/%n/, V))), h.length && typeof h[0] == "string" ? h[0] = c + " " + h[0] : h.unshift(c);
          }
          D.apply(void 0, h);
        };
      }
      return o[L] || (g.methodFactory = j), S = S || {}, S.template && (S.format = void 0), o[L] = n({}, R, S), g.setLevel(g.getLevel()), u || g.warn(
        "It is necessary to call the function reg() of loglevel-plugin-prefix before calling apply. From the next release, it will throw an error. See more: https://github.com/kutuluk/loglevel-plugin-prefix/blob/master/README.md"
      ), g;
    }, b = {
      reg: p,
      apply: y
    }, v;
    return r && (v = r.prefix, b.noConflict = function() {
      return r.prefix === b && (r.prefix = v), b;
    }), b;
  });
})(os);
var Do = os.exports;
const gn = /* @__PURE__ */ Oa(Do);
function Lo() {
  const e = Error.prepareStackTrace;
  Error.prepareStackTrace = (n, a) => a;
  const r = new Error().stack.slice(1);
  return Error.prepareStackTrace = e, r;
}
class St {
  /**
   * 解析日志级别为枚举
   *
   * @param enumObj - 枚举对象
   * @param value - 配置的值
   */
  static stringToEnumValue(r, n) {
    return r[Object.keys(r).filter((a) => r[a].toString() === n)[0]];
  }
  /**
   * 获取配置的日志级别
   */
  static getEnvLevel(r) {
    if (!r)
      return;
    const n = r.getEnvOrDefault(Pt.LOG_LEVEL_KEY, Ze.LOG_LEVEL_INFO), a = St.stringToEnumValue(Ze, n.toUpperCase());
    return a || console.warn(
      "[zhi-log] LOG_LEVEL is invalid in you .env file.It must be either debug, info, warn or error, fallback to default info level"
    ), a;
  }
  /**
   * 获取默认日志
   */
  static getEnvLogger(r) {
    return r ? r.getEnv(Pt.LOG_PREFIX_KEY) : void 0;
  }
}
var Na = { exports: {} }, _n = { exports: {} }, vn;
function zo() {
  return vn || (vn = 1, function(e) {
    const r = typeof process < "u" && process.env.TERM_PROGRAM === "Hyper", n = typeof process < "u" && process.platform === "win32", a = typeof process < "u" && process.platform === "linux", u = {
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
    }, o = Object.assign({}, u, {
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
    }), p = Object.assign({}, u, {
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
    e.exports = n && !r ? o : p, Reflect.defineProperty(e.exports, "common", { enumerable: !1, value: u }), Reflect.defineProperty(e.exports, "windows", { enumerable: !1, value: o }), Reflect.defineProperty(e.exports, "other", { enumerable: !1, value: p });
  }(_n)), _n.exports;
}
const Vo = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Fo = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g, Uo = () => typeof process < "u" ? process.env.FORCE_COLOR !== "0" : !1, cs = () => {
  const e = {
    enabled: Uo(),
    visible: !0,
    styles: {},
    keys: {}
  }, r = (o) => {
    let p = o.open = `\x1B[${o.codes[0]}m`, y = o.close = `\x1B[${o.codes[1]}m`, b = o.regex = new RegExp(`\\u001b\\[${o.codes[1]}m`, "g");
    return o.wrap = (v, g) => {
      v.includes(y) && (v = v.replace(b, y + p));
      let S = p + v + y;
      return g ? S.replace(/\r*\n/g, `${y}$&${p}`) : S;
    }, o;
  }, n = (o, p, y) => typeof o == "function" ? o(p) : o.wrap(p, y), a = (o, p) => {
    if (o === "" || o == null)
      return "";
    if (e.enabled === !1)
      return o;
    if (e.visible === !1)
      return "";
    let y = "" + o, b = y.includes(`
`), v = p.length;
    for (v > 0 && p.includes("unstyle") && (p = [.../* @__PURE__ */ new Set(["unstyle", ...p])].reverse()); v-- > 0; )
      y = n(e.styles[p[v]], y, b);
    return y;
  }, u = (o, p, y) => {
    e.styles[o] = r({ name: o, codes: p }), (e.keys[y] || (e.keys[y] = [])).push(o), Reflect.defineProperty(e, o, {
      configurable: !0,
      enumerable: !0,
      set(b) {
        e.alias(o, b);
      },
      get() {
        let b = (v) => a(v, b.stack);
        return Reflect.setPrototypeOf(b, e), b.stack = this.stack ? this.stack.concat(o) : [o], b;
      }
    });
  };
  return u("reset", [0, 0], "modifier"), u("bold", [1, 22], "modifier"), u("dim", [2, 22], "modifier"), u("italic", [3, 23], "modifier"), u("underline", [4, 24], "modifier"), u("inverse", [7, 27], "modifier"), u("hidden", [8, 28], "modifier"), u("strikethrough", [9, 29], "modifier"), u("black", [30, 39], "color"), u("red", [31, 39], "color"), u("green", [32, 39], "color"), u("yellow", [33, 39], "color"), u("blue", [34, 39], "color"), u("magenta", [35, 39], "color"), u("cyan", [36, 39], "color"), u("white", [37, 39], "color"), u("gray", [90, 39], "color"), u("grey", [90, 39], "color"), u("bgBlack", [40, 49], "bg"), u("bgRed", [41, 49], "bg"), u("bgGreen", [42, 49], "bg"), u("bgYellow", [43, 49], "bg"), u("bgBlue", [44, 49], "bg"), u("bgMagenta", [45, 49], "bg"), u("bgCyan", [46, 49], "bg"), u("bgWhite", [47, 49], "bg"), u("blackBright", [90, 39], "bright"), u("redBright", [91, 39], "bright"), u("greenBright", [92, 39], "bright"), u("yellowBright", [93, 39], "bright"), u("blueBright", [94, 39], "bright"), u("magentaBright", [95, 39], "bright"), u("cyanBright", [96, 39], "bright"), u("whiteBright", [97, 39], "bright"), u("bgBlackBright", [100, 49], "bgBright"), u("bgRedBright", [101, 49], "bgBright"), u("bgGreenBright", [102, 49], "bgBright"), u("bgYellowBright", [103, 49], "bgBright"), u("bgBlueBright", [104, 49], "bgBright"), u("bgMagentaBright", [105, 49], "bgBright"), u("bgCyanBright", [106, 49], "bgBright"), u("bgWhiteBright", [107, 49], "bgBright"), e.ansiRegex = Fo, e.hasColor = e.hasAnsi = (o) => (e.ansiRegex.lastIndex = 0, typeof o == "string" && o !== "" && e.ansiRegex.test(o)), e.alias = (o, p) => {
    let y = typeof p == "string" ? e[p] : p;
    if (typeof y != "function")
      throw new TypeError("Expected alias to be the name of an existing color (string) or a function");
    y.stack || (Reflect.defineProperty(y, "name", { value: o }), e.styles[o] = y, y.stack = [o]), Reflect.defineProperty(e, o, {
      configurable: !0,
      enumerable: !0,
      set(b) {
        e.alias(o, b);
      },
      get() {
        let b = (v) => a(v, b.stack);
        return Reflect.setPrototypeOf(b, e), b.stack = this.stack ? this.stack.concat(y.stack) : y.stack, b;
      }
    });
  }, e.theme = (o) => {
    if (!Vo(o))
      throw new TypeError("Expected theme to be an object");
    for (let p of Object.keys(o))
      e.alias(p, o[p]);
    return e;
  }, e.alias("unstyle", (o) => typeof o == "string" && o !== "" ? (e.ansiRegex.lastIndex = 0, o.replace(e.ansiRegex, "")) : ""), e.alias("noop", (o) => o), e.none = e.clear = e.noop, e.stripColor = e.unstyle, e.symbols = zo(), e.define = u, e;
};
Na.exports = cs();
Na.exports.create = cs;
var Bo = Na.exports;
const De = /* @__PURE__ */ Oa(Bo);
let Gt, ls, fs, hs, ps = !0;
typeof process < "u" && ({ FORCE_COLOR: Gt, NODE_DISABLE_COLORS: ls, NO_COLOR: fs, TERM: hs } = process.env || {}, ps = process.stdout && process.stdout.isTTY);
const te = {
  enabled: !ls && fs == null && hs !== "dumb" && (Gt != null && Gt !== "0" || ps),
  // modifiers
  reset: le(0, 0),
  bold: le(1, 22),
  dim: le(2, 22),
  italic: le(3, 23),
  underline: le(4, 24),
  inverse: le(7, 27),
  hidden: le(8, 28),
  strikethrough: le(9, 29),
  // colors
  black: le(30, 39),
  red: le(31, 39),
  green: le(32, 39),
  yellow: le(33, 39),
  blue: le(34, 39),
  magenta: le(35, 39),
  cyan: le(36, 39),
  white: le(37, 39),
  gray: le(90, 39),
  grey: le(90, 39),
  // background colors
  bgBlack: le(40, 49),
  bgRed: le(41, 49),
  bgGreen: le(42, 49),
  bgYellow: le(43, 49),
  bgBlue: le(44, 49),
  bgMagenta: le(45, 49),
  bgCyan: le(46, 49),
  bgWhite: le(47, 49)
};
function yn(e, r) {
  let n = 0, a, u = "", o = "";
  for (; n < e.length; n++)
    a = e[n], u += a.open, o += a.close, ~r.indexOf(a.close) && (r = r.replace(a.rgx, a.close + a.open));
  return u + r + o;
}
function Ho(e, r) {
  let n = { has: e, keys: r };
  return n.reset = te.reset.bind(n), n.bold = te.bold.bind(n), n.dim = te.dim.bind(n), n.italic = te.italic.bind(n), n.underline = te.underline.bind(n), n.inverse = te.inverse.bind(n), n.hidden = te.hidden.bind(n), n.strikethrough = te.strikethrough.bind(n), n.black = te.black.bind(n), n.red = te.red.bind(n), n.green = te.green.bind(n), n.yellow = te.yellow.bind(n), n.blue = te.blue.bind(n), n.magenta = te.magenta.bind(n), n.cyan = te.cyan.bind(n), n.white = te.white.bind(n), n.gray = te.gray.bind(n), n.grey = te.grey.bind(n), n.bgBlack = te.bgBlack.bind(n), n.bgRed = te.bgRed.bind(n), n.bgGreen = te.bgGreen.bind(n), n.bgYellow = te.bgYellow.bind(n), n.bgBlue = te.bgBlue.bind(n), n.bgMagenta = te.bgMagenta.bind(n), n.bgCyan = te.bgCyan.bind(n), n.bgWhite = te.bgWhite.bind(n), n;
}
function le(e, r) {
  let n = {
    open: `\x1B[${e}m`,
    close: `\x1B[${r}m`,
    rgx: new RegExp(`\\x1b\\[${r}m`, "g")
  };
  return function(a) {
    return this !== void 0 && this.has !== void 0 ? (~this.has.indexOf(e) || (this.has.push(e), this.keys.push(n)), a === void 0 ? this : te.enabled ? yn(this.keys, a + "") : a + "") : a === void 0 ? Ho([e], [n]) : te.enabled ? yn([n], a + "") : a + "";
  };
}
var qo = Object.defineProperty, Go = (e, r, n) => r in e ? qo(e, r, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[r] = n, $e = (e, r, n) => (Go(e, typeof r != "symbol" ? r + "" : r, n), n);
const Ue = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return Ue.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : !1;
  }
};
let oe = Ue;
$e(oe, "isNode", typeof process < "u"), /**
* 是否在浏览器环境
*/
$e(oe, "isInBrowser", typeof window < "u"), /**
* 浏览器路径分隔符
*/
$e(oe, "BrowserSeperator", "/"), /**
* 是否是Electron环境
*/
$e(oe, "isElectron", () => !Ue.isInBrowser || !window.navigator || !window.navigator.userAgent ? !1 : /Electron/.test(window.navigator.userAgent)), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
$e(oe, "hasNodeEnv", () => Ue.isElectron() || Ue.isNode), /**
* 获取url参数
*
* @param sParam - 参数
*/
$e(oe, "getQueryString", (e) => {
  if (!Ue.isInBrowser)
    return "";
  const r = window.location.search.substring(1).split("&");
  for (let n = 0; n < r.length; n++) {
    const a = r[n].split("=");
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
$e(oe, "replaceUrlParam", (e, r, n) => {
  n == null && (n = "");
  const a = new RegExp("\\b(" + r + "=).*?(&|#|$)");
  if (e.search(a) >= 0)
    return e.replace(a, "$1" + n + "$2");
  const [u, o] = e.split("#"), [p, y] = u.split("?"), b = new URLSearchParams(y);
  b.set(r, n);
  const v = b.toString(), g = p + (v ? "?" + v : "");
  return o ? g + "#" + o : g;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
$e(oe, "setUrlParameter", (e, r, n) => {
  if (e.includes(r))
    return Ue.replaceUrlParam(e, r, n);
  const a = e.split("#");
  let u = a[0];
  const o = a[1];
  return u.includes("?") ? u += `&${r}=${n}` : u += `?${r}=${n}`, o && (u += "#" + o), u;
}), /**
* 重新加载指定tab
*
* @param tabname - tabname
* @param t - 延迟时间
*/
$e(oe, "reloadTabPage", (e, r = 200) => {
  setTimeout(function() {
    if (Ue.isInBrowser) {
      const n = window.location.href;
      window.location.href = Ue.setUrlParameter(n, "tab", e);
    }
  }, r);
}), /**
* 刷新当前tab页面
*/
$e(oe, "reloadPage", () => {
  setTimeout(function() {
    Ue.isInBrowser && window.location.reload();
  }, 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
*/
$e(oe, "reloadPageWithMessageCallback", (e, r) => {
  r && r(e), setTimeout(function() {
    Ue.isInBrowser && window.location.reload();
  }, 200);
});
var Ce = /* @__PURE__ */ ((e) => (e.BasePathType_Appearance = "Appearance", e.BasePathType_Data = "Data", e.BasePathType_Themes = "Themes", e.BasePathType_ZhiTheme = "ZhiTheme", e.BasePathType_None = "None", e))(Ce || {});
const Oe = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return oe.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : !1;
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
    let n = e;
    switch (r) {
      case Ce.BasePathType_Appearance:
        n = this.browserJoinPath(this.siyuanAppearanceRelativePath(), e);
        break;
      case Ce.BasePathType_Data:
        n = this.browserJoinPath(this.siyuanDataRelativePath(), e);
        break;
      case Ce.BasePathType_Themes:
        n = this.browserJoinPath(this.siyuanThemeRelativePath(), e);
        break;
      case Ce.BasePathType_ZhiTheme:
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
    return await this.importJs(e, Ce.BasePathType_ZhiTheme);
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
    if (oe.hasNodeEnv()) {
      const r = this.requireLib("path");
      if (r)
        return r.join(...e);
    }
    return this.browserJoinPath(...e);
  }
  static browserJoinPath(...e) {
    return e.join(oe.BrowserSeperator);
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
    if (oe.hasNodeEnv())
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
let pr = Oe;
$e(pr, "isInSiyuanWidget", () => oe.isInBrowser ? window.frameElement != null && window.frameElement.parentElement != null && window.frameElement.parentElement.parentElement != null && window.frameElement.parentElement.parentElement.getAttribute("data-node-id") !== "" : !1), /**
* 思源笔记新窗口
*
* @deprecated window.terwer 判断方式已废弃，建议以后打开新窗口注入 window.siyuanNewWin ，这样语义会更容易理解
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
$e(pr, "isInSiyuanNewWin", () => !oe.isInBrowser || !oe.isElectron() ? !1 : typeof window.terwer < "u" || typeof window.siyuanNewWin < "u"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
$e(pr, "requireLib", (e, r = !0, n = Ce.BasePathType_None) => {
  if (!oe.hasNodeEnv())
    throw new Error("require ony works on node env");
  let a = e;
  if (!r)
    switch (n) {
      case Ce.BasePathType_Appearance:
        a = Oe.joinPath(Oe.siyuanAppearancePath(), e);
        break;
      case Ce.BasePathType_Data:
        a = Oe.joinPath(Oe.siyuanDataPath(), e);
        break;
      case Ce.BasePathType_Themes:
        a = Oe.joinPath(Oe.siyuanAppearancePath(), "themes", e);
        break;
      case Ce.BasePathType_ZhiTheme:
        a = Oe.joinPath(Oe.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const u = Oe.siyuanWindow();
  if (!u)
    return require(a);
  if (typeof u.require < "u")
    return u.require(a);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
$e(pr, "requireAppearanceLib", (e) => Oe.requireLib(e, !1, Ce.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
$e(pr, "requireDataLib", (e) => Oe.requireLib(e, !1, Ce.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
$e(pr, "requireThemesLib", (e) => Oe.requireLib(e, !1, Ce.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
$e(pr, "requireZhiThemeLib", (e) => Oe.requireLib(e, !1, Ce.BasePathType_ZhiTheme));
const Le = {
  white: (e) => oe.isElectron() ? De.whiteBright(e) : te.white(e),
  gray: (e) => oe.isElectron() ? De.gray(e) : te.gray(e),
  blue: (e) => oe.isElectron() ? De.blue(e) : te.blue(e),
  green: (e) => oe.isElectron() ? De.green(e) : te.green(e),
  yellow: (e) => oe.isElectron() ? De.yellow(e) : te.yellow(e),
  red: (e) => oe.isElectron() ? De.red(e) : te.red(e),
  bgWhite: (e) => oe.isElectron() ? De.bgWhiteBright(e) : te.bgWhite(e),
  bgGrey: (e) => oe.isElectron() ? De.bgCyanBright(e) : te.bgCyan(e),
  bgBlue: (e) => oe.isElectron() ? De.bgBlueBright(e) : te.bgBlue(e),
  bgGreen: (e) => oe.isElectron() ? De.bgGreenBright(e) : te.bgGreen(e),
  bgYellow: (e) => oe.isElectron() ? De.bgYellowBright(e) : te.bgYellow(e),
  bgRed: (e) => oe.isElectron() ? De.bgRedBright(e) : te.bgRed(e)
};
class Ko {
  constructor(r, n, a) {
    Nr(this, "consoleLogger", "console"), Nr(this, "stackSize", 1), Nr(this, "getLogger", (p) => {
      let y;
      if (p)
        y = p;
      else {
        const b = this.getCallStack(), v = [], g = [];
        for (let S = 0; S < b.length; S++) {
          const z = b[S], L = z.getFileName() ?? "none";
          if (S > this.stackSize - 1)
            break;
          const R = L + "-" + z.getLineNumber() + ":" + z.getColumnNumber();
          v.push(R);
        }
        g.length > 0 && (y = v.join(" -> "));
      }
      return (!y || y.trim().length === 0) && (y = this.consoleLogger), pt.getLogger(y);
    }), this.stackSize = 1;
    let u;
    r ? u = r : u = St.getEnvLevel(a), u = u ?? Ze.LOG_LEVEL_INFO, pt.setLevel(u);
    const o = (p, y, b, v) => {
      const g = [], S = n ?? St.getEnvLogger(a) ?? "zhi";
      return g.push(Le.gray("[") + v(S) + Le.gray("]")), g.push(Le.gray("[") + Le.gray(b.toString()) + Le.gray("]")), g.push(v(p.toUpperCase().toString())), g.push(v(y)), g.push(Le.gray(":")), g;
    };
    gn.reg(pt), gn.apply(pt, {
      format(p, y, b) {
        let v = [];
        const g = y ?? "";
        switch (p) {
          case Ze.LOG_LEVEL_TRACE:
            v = o(p, g, b, Le.gray);
            break;
          case Ze.LOG_LEVEL_DEBUG:
            v = o(p, g, b, Le.blue);
            break;
          case Ze.LOG_LEVEL_INFO:
            v = o(p, g, b, Le.green);
            break;
          case Ze.LOG_LEVEL_WARN:
            v = o(p, g, b, Le.yellow);
            break;
          case Ze.LOG_LEVEL_ERROR:
            v = o(p, g, b, Le.red);
            break;
          default:
            v = o(Ze.LOG_LEVEL_INFO, g, b, Le.green);
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
      r = Lo();
    } catch {
      r = [];
    }
    return r;
  }
}
class Wo {
  /**
   * 默认日志级别
   *
   * @param level - 可选，未设置默认INFO
   * @param sign - 可选前缀，默认zhi
   * @param env - 可选环境变量实例
   */
  constructor(r, n, a) {
    Nr(this, "logger"), this.logger = new Ko(r, n, a);
  }
  /**
   * 获取日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   * @protected
   */
  getLogger(r, n) {
    return this.logger.setStackSize(n), this.logger.getLogger(r);
  }
}
class wn extends Wo {
  constructor(r, n, a) {
    super(r, n, a);
  }
  /**
   * 获取默认的日志记录器
   *
   * @param loggerName - 日志记录器名称
   * @param stackSize - 打印栈的深度
   */
  getLogger(r, n) {
    return super.getLogger(r, n);
  }
}
class Ra {
  /**
   * 默认日志记录器
   *
   * @param stackSize - 栈的深度
   * @param env - 环境变量实例
   */
  static defaultLogger(r, n) {
    return Ra.customLogFactory(void 0, void 0, r).getLogger(void 0, n);
  }
  /**
   * 自定义日志工厂
   *
   * @param level - 级别
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customLogFactory(r, n, a) {
    return new wn(r, n, a);
  }
  /**
   * 自定义日志工厂，自定义前缀
   *
   * @param sign - 标志
   * @param env - 环境变量
   */
  static customSignLogFactory(r, n) {
    return new wn(void 0, r, n);
  }
}
const Jo = "zhi";
class yt {
  /**
   * 某些情况下，可能需要手动 init 之后才能用
   */
  static initEnv(r) {
    this.env = r;
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
  static zhiLogWithSign(r, n) {
    if (this.loggerMap[n])
      return this.loggerMap[n].debug("Zhi-log use cache"), this.loggerMap[n];
    const a = this.env, u = Ra.customSignLogFactory(r, a).getLogger(n);
    return this.loggerMap[n] = u, u.debug("Zhi-log add new logger"), u;
  }
  /**
   * 获取 zhi-log 实例
   *
   * @param loggerName - 日志名称
   */
  static zhiLog(r) {
    return this.zhiLogWithSign(Jo, r);
  }
  /**
   * 获取 zhi-common 实例
   */
  static zhiCommon() {
    return this.common || (this.common = new xo()), this.common;
  }
}
/**
 * zhi-util 的运行时环境
 */
be(yt, "env"), /**
 * zhi-util 的日志器缓存
 */
be(yt, "loggerMap", {}), /**
 * zhi-util 的通用工具类
 */
be(yt, "common");
class Aa extends yt {
  static zhiEnv() {
    return this.env || (this.env = new Ro({ BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 })), this.env;
  }
}
class bn {
  constructor() {
    be(this, "logger");
    this.logger = Aa.zhiLog("lute-adaptor"), Lute ? this.logger.debug("Detected Lute is bundled, will use!") : this.logger.debug("Lute is not available!");
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
  highlightWords(r) {
    const n = new RegExp("(?<=^|[\\s\\S])==([^\\n]+?)==(?=($|[\\s\\S]))", "g");
    return r.replace(n, '<span class="mark">$1</span>');
  }
  /**
   * 渲染Markdown
   *
   * @param md - Markdown
   */
  async renderMarkdownStr(r) {
    if (!this.isAvailable())
      return this.logger.error("Lute is not available, will return original md"), r;
    const n = Lute, a = n.New(), u = {
      renderText: (o, p) => p ? [this.highlightWords(o.Text()), n.WalkContinue] : ["", n.WalkContinue]
      // renderStrong: (node: any, entering: any) => {
      //     return ["", luteObj.WalkContinue]
      // },
      // renderParagraph: (node: any, entering: any) => {
      //     return ["", luteObj.WalkContinue]
      // }
    };
    return a.SetJSRenderers({
      renderers: {
        Md2HTML: u
      }
    }), this.logger.info("Lute is rendering md to HTML..."), a.MarkdownStr("", r);
  }
}
var ms = { exports: {} };
(function(e) {
  (function() {
    function r(t) {
      var d = {
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
      if (t === !1)
        return JSON.parse(JSON.stringify(d));
      var s = {};
      for (var i in d)
        d.hasOwnProperty(i) && (s[i] = d[i].defaultValue);
      return s;
    }
    function n() {
      var t = r(!0), d = {};
      for (var s in t)
        t.hasOwnProperty(s) && (d[s] = !0);
      return d;
    }
    var a = {}, u = {}, o = {}, p = r(!0), y = "vanilla", b = {
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
      vanilla: r(!0),
      allOn: n()
    };
    a.helper = {}, a.extensions = {}, a.setOption = function(t, d) {
      return p[t] = d, this;
    }, a.getOption = function(t) {
      return p[t];
    }, a.getOptions = function() {
      return p;
    }, a.resetOptions = function() {
      p = r(!0);
    }, a.setFlavor = function(t) {
      if (!b.hasOwnProperty(t))
        throw Error(t + " flavor was not found");
      a.resetOptions();
      var d = b[t];
      y = t;
      for (var s in d)
        d.hasOwnProperty(s) && (p[s] = d[s]);
    }, a.getFlavor = function() {
      return y;
    }, a.getFlavorOptions = function(t) {
      if (b.hasOwnProperty(t))
        return b[t];
    }, a.getDefaultOptions = function(t) {
      return r(t);
    }, a.subParser = function(t, d) {
      if (a.helper.isString(t))
        if (typeof d < "u")
          u[t] = d;
        else {
          if (u.hasOwnProperty(t))
            return u[t];
          throw Error("SubParser named " + t + " not registered!");
        }
    }, a.extension = function(t, d) {
      if (!a.helper.isString(t))
        throw Error("Extension 'name' must be a string");
      if (t = a.helper.stdExtName(t), a.helper.isUndefined(d)) {
        if (!o.hasOwnProperty(t))
          throw Error("Extension named " + t + " is not registered!");
        return o[t];
      } else {
        typeof d == "function" && (d = d()), a.helper.isArray(d) || (d = [d]);
        var s = v(d, t);
        if (s.valid)
          o[t] = d;
        else
          throw Error(s.error);
      }
    }, a.getAllExtensions = function() {
      return o;
    }, a.removeExtension = function(t) {
      delete o[t];
    }, a.resetExtensions = function() {
      o = {};
    };
    function v(t, d) {
      var s = d ? "Error in " + d + " extension->" : "Error in unnamed extension", i = {
        valid: !0,
        error: ""
      };
      a.helper.isArray(t) || (t = [t]);
      for (var c = 0; c < t.length; ++c) {
        var m = s + " sub-extension " + c + ": ", h = t[c];
        if (typeof h != "object")
          return i.valid = !1, i.error = m + "must be an object, but " + typeof h + " given", i;
        if (!a.helper.isString(h.type))
          return i.valid = !1, i.error = m + 'property "type" must be a string, but ' + typeof h.type + " given", i;
        var C = h.type = h.type.toLowerCase();
        if (C === "language" && (C = h.type = "lang"), C === "html" && (C = h.type = "output"), C !== "lang" && C !== "output" && C !== "listener")
          return i.valid = !1, i.error = m + "type " + C + ' is not recognized. Valid values: "lang/language", "output/html" or "listener"', i;
        if (C === "listener") {
          if (a.helper.isUndefined(h.listeners))
            return i.valid = !1, i.error = m + '. Extensions of type "listener" must have a property called "listeners"', i;
        } else if (a.helper.isUndefined(h.filter) && a.helper.isUndefined(h.regex))
          return i.valid = !1, i.error = m + C + ' extensions must define either a "regex" property or a "filter" method', i;
        if (h.listeners) {
          if (typeof h.listeners != "object")
            return i.valid = !1, i.error = m + '"listeners" property must be an object but ' + typeof h.listeners + " given", i;
          for (var U in h.listeners)
            if (h.listeners.hasOwnProperty(U) && typeof h.listeners[U] != "function")
              return i.valid = !1, i.error = m + '"listeners" property must be an hash of [event name]: [callback]. listeners.' + U + " must be a function but " + typeof h.listeners[U] + " given", i;
        }
        if (h.filter) {
          if (typeof h.filter != "function")
            return i.valid = !1, i.error = m + '"filter" must be a function, but ' + typeof h.filter + " given", i;
        } else if (h.regex) {
          if (a.helper.isString(h.regex) && (h.regex = new RegExp(h.regex, "g")), !(h.regex instanceof RegExp))
            return i.valid = !1, i.error = m + '"regex" property must either be a string or a RegExp object, but ' + typeof h.regex + " given", i;
          if (a.helper.isUndefined(h.replace))
            return i.valid = !1, i.error = m + '"regex" extensions must implement a replace string or function', i;
        }
      }
      return i;
    }
    a.validateExtension = function(t) {
      var d = v(t, null);
      return d.valid ? !0 : (console.warn(d.error), !1);
    }, a.hasOwnProperty("helper") || (a.helper = {}), a.helper.isString = function(t) {
      return typeof t == "string" || t instanceof String;
    }, a.helper.isFunction = function(t) {
      var d = {};
      return t && d.toString.call(t) === "[object Function]";
    }, a.helper.isArray = function(t) {
      return Array.isArray(t);
    }, a.helper.isUndefined = function(t) {
      return typeof t > "u";
    }, a.helper.forEach = function(t, d) {
      if (a.helper.isUndefined(t))
        throw new Error("obj param is required");
      if (a.helper.isUndefined(d))
        throw new Error("callback param is required");
      if (!a.helper.isFunction(d))
        throw new Error("callback param must be a function/closure");
      if (typeof t.forEach == "function")
        t.forEach(d);
      else if (a.helper.isArray(t))
        for (var s = 0; s < t.length; s++)
          d(t[s], s, t);
      else if (typeof t == "object")
        for (var i in t)
          t.hasOwnProperty(i) && d(t[i], i, t);
      else
        throw new Error("obj does not seem to be an array or an iterable object");
    }, a.helper.stdExtName = function(t) {
      return t.replace(/[_?*+\/\\.^-]/g, "").replace(/\s/g, "").toLowerCase();
    };
    function g(t, d) {
      var s = d.charCodeAt(0);
      return "¨E" + s + "E";
    }
    a.helper.escapeCharactersCallback = g, a.helper.escapeCharacters = function(t, d, s) {
      var i = "([" + d.replace(/([\[\]\\])/g, "\\$1") + "])";
      s && (i = "\\\\" + i);
      var c = new RegExp(i, "g");
      return t = t.replace(c, g), t;
    }, a.helper.unescapeHTMLEntities = function(t) {
      return t.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    var S = function(t, d, s, i) {
      var c = i || "", m = c.indexOf("g") > -1, h = new RegExp(d + "|" + s, "g" + c.replace(/g/g, "")), C = new RegExp(d, c.replace(/g/g, "")), U = [], H, V, G, _, q;
      do
        for (H = 0; G = h.exec(t); )
          if (C.test(G[0]))
            H++ || (V = h.lastIndex, _ = V - G[0].length);
          else if (H && !--H) {
            q = G.index + G[0].length;
            var J = {
              left: { start: _, end: V },
              match: { start: V, end: G.index },
              right: { start: G.index, end: q },
              wholeMatch: { start: _, end: q }
            };
            if (U.push(J), !m)
              return U;
          }
      while (H && (h.lastIndex = V));
      return U;
    };
    a.helper.matchRecursiveRegExp = function(t, d, s, i) {
      for (var c = S(t, d, s, i), m = [], h = 0; h < c.length; ++h)
        m.push([
          t.slice(c[h].wholeMatch.start, c[h].wholeMatch.end),
          t.slice(c[h].match.start, c[h].match.end),
          t.slice(c[h].left.start, c[h].left.end),
          t.slice(c[h].right.start, c[h].right.end)
        ]);
      return m;
    }, a.helper.replaceRecursiveRegExp = function(t, d, s, i, c) {
      if (!a.helper.isFunction(d)) {
        var m = d;
        d = function() {
          return m;
        };
      }
      var h = S(t, s, i, c), C = t, U = h.length;
      if (U > 0) {
        var H = [];
        h[0].wholeMatch.start !== 0 && H.push(t.slice(0, h[0].wholeMatch.start));
        for (var V = 0; V < U; ++V)
          H.push(
            d(
              t.slice(h[V].wholeMatch.start, h[V].wholeMatch.end),
              t.slice(h[V].match.start, h[V].match.end),
              t.slice(h[V].left.start, h[V].left.end),
              t.slice(h[V].right.start, h[V].right.end)
            )
          ), V < U - 1 && H.push(t.slice(h[V].wholeMatch.end, h[V + 1].wholeMatch.start));
        h[U - 1].wholeMatch.end < t.length && H.push(t.slice(h[U - 1].wholeMatch.end)), C = H.join("");
      }
      return C;
    }, a.helper.regexIndexOf = function(t, d, s) {
      if (!a.helper.isString(t))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      if (!(d instanceof RegExp))
        throw "InvalidArgumentError: second parameter of showdown.helper.regexIndexOf function must be an instance of RegExp";
      var i = t.substring(s || 0).search(d);
      return i >= 0 ? i + (s || 0) : i;
    }, a.helper.splitAtIndex = function(t, d) {
      if (!a.helper.isString(t))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      return [t.substring(0, d), t.substring(d)];
    }, a.helper.encodeEmailAddress = function(t) {
      var d = [
        function(s) {
          return "&#" + s.charCodeAt(0) + ";";
        },
        function(s) {
          return "&#x" + s.charCodeAt(0).toString(16) + ";";
        },
        function(s) {
          return s;
        }
      ];
      return t = t.replace(/./g, function(s) {
        if (s === "@")
          s = d[Math.floor(Math.random() * 2)](s);
        else {
          var i = Math.random();
          s = i > 0.9 ? d[2](s) : i > 0.45 ? d[1](s) : d[0](s);
        }
        return s;
      }), t;
    }, a.helper.padEnd = function(d, s, i) {
      return s = s >> 0, i = String(i || " "), d.length > s ? String(d) : (s = s - d.length, s > i.length && (i += i.repeat(s / i.length)), String(d) + i.slice(0, s));
    }, typeof console > "u" && (console = {
      warn: function(t) {
        alert(t);
      },
      log: function(t) {
        alert(t);
      },
      error: function(t) {
        throw t;
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
    }, a.Converter = function(t) {
      var d = {}, s = [], i = [], c = {}, m = y, h = {
        parsed: {},
        raw: "",
        format: ""
      };
      C();
      function C() {
        t = t || {};
        for (var _ in p)
          p.hasOwnProperty(_) && (d[_] = p[_]);
        if (typeof t == "object")
          for (var q in t)
            t.hasOwnProperty(q) && (d[q] = t[q]);
        else
          throw Error("Converter expects the passed parameter to be an object, but " + typeof t + " was passed instead.");
        d.extensions && a.helper.forEach(d.extensions, U);
      }
      function U(_, q) {
        if (q = q || null, a.helper.isString(_))
          if (_ = a.helper.stdExtName(_), q = _, a.extensions[_]) {
            console.warn("DEPRECATION WARNING: " + _ + " is an old extension that uses a deprecated loading method.Please inform the developer that the extension should be updated!"), H(a.extensions[_], _);
            return;
          } else if (!a.helper.isUndefined(o[_]))
            _ = o[_];
          else
            throw Error('Extension "' + _ + '" could not be loaded. It was either not found or is not a valid extension.');
        typeof _ == "function" && (_ = _()), a.helper.isArray(_) || (_ = [_]);
        var J = v(_, q);
        if (!J.valid)
          throw Error(J.error);
        for (var Z = 0; Z < _.length; ++Z) {
          switch (_[Z].type) {
            case "lang":
              s.push(_[Z]);
              break;
            case "output":
              i.push(_[Z]);
              break;
          }
          if (_[Z].hasOwnProperty("listeners"))
            for (var B in _[Z].listeners)
              _[Z].listeners.hasOwnProperty(B) && V(B, _[Z].listeners[B]);
        }
      }
      function H(_, q) {
        typeof _ == "function" && (_ = _(new a.Converter())), a.helper.isArray(_) || (_ = [_]);
        var J = v(_, q);
        if (!J.valid)
          throw Error(J.error);
        for (var Z = 0; Z < _.length; ++Z)
          switch (_[Z].type) {
            case "lang":
              s.push(_[Z]);
              break;
            case "output":
              i.push(_[Z]);
              break;
            default:
              throw Error("Extension loader error: Type unrecognized!!!");
          }
      }
      function V(_, q) {
        if (!a.helper.isString(_))
          throw Error("Invalid argument in converter.listen() method: name must be a string, but " + typeof _ + " given");
        if (typeof q != "function")
          throw Error("Invalid argument in converter.listen() method: callback must be a function, but " + typeof q + " given");
        c.hasOwnProperty(_) || (c[_] = []), c[_].push(q);
      }
      function G(_) {
        var q = _.match(/^\s*/)[0].length, J = new RegExp("^\\s{0," + q + "}", "gm");
        return _.replace(J, "");
      }
      this._dispatch = function(q, J, Z, B) {
        if (c.hasOwnProperty(q))
          for (var k = 0; k < c[q].length; ++k) {
            var F = c[q][k](q, J, this, Z, B);
            F && typeof F < "u" && (J = F);
          }
        return J;
      }, this.listen = function(_, q) {
        return V(_, q), this;
      }, this.makeHtml = function(_) {
        if (!_)
          return _;
        var q = {
          gHtmlBlocks: [],
          gHtmlMdBlocks: [],
          gHtmlSpans: [],
          gUrls: {},
          gTitles: {},
          gDimensions: {},
          gListLevel: 0,
          hashLinkCounts: {},
          langExtensions: s,
          outputModifiers: i,
          converter: this,
          ghCodeBlocks: [],
          metadata: {
            parsed: {},
            raw: "",
            format: ""
          }
        };
        return _ = _.replace(/¨/g, "¨T"), _ = _.replace(/\$/g, "¨D"), _ = _.replace(/\r\n/g, `
`), _ = _.replace(/\r/g, `
`), _ = _.replace(/\u00A0/g, "&nbsp;"), d.smartIndentationFix && (_ = G(_)), _ = `

` + _ + `

`, _ = a.subParser("detab")(_, d, q), _ = _.replace(/^[ \t]+$/mg, ""), a.helper.forEach(s, function(J) {
          _ = a.subParser("runExtension")(J, _, d, q);
        }), _ = a.subParser("metadata")(_, d, q), _ = a.subParser("hashPreCodeTags")(_, d, q), _ = a.subParser("githubCodeBlocks")(_, d, q), _ = a.subParser("hashHTMLBlocks")(_, d, q), _ = a.subParser("hashCodeTags")(_, d, q), _ = a.subParser("stripLinkDefinitions")(_, d, q), _ = a.subParser("blockGamut")(_, d, q), _ = a.subParser("unhashHTMLSpans")(_, d, q), _ = a.subParser("unescapeSpecialChars")(_, d, q), _ = _.replace(/¨D/g, "$$"), _ = _.replace(/¨T/g, "¨"), _ = a.subParser("completeHTMLDocument")(_, d, q), a.helper.forEach(i, function(J) {
          _ = a.subParser("runExtension")(J, _, d, q);
        }), h = q.metadata, _;
      }, this.makeMarkdown = this.makeMd = function(_, q) {
        if (_ = _.replace(/\r\n/g, `
`), _ = _.replace(/\r/g, `
`), _ = _.replace(/>[ \t]+</, ">¨NBSP;<"), !q)
          if (window && window.document)
            q = window.document;
          else
            throw new Error("HTMLParser is undefined. If in a webworker or nodejs environment, you need to provide a WHATWG DOM and HTML such as JSDOM");
        var J = q.createElement("div");
        J.innerHTML = _;
        var Z = {
          preList: l(J)
        };
        N(J);
        for (var B = J.childNodes, k = "", F = 0; F < B.length; F++)
          k += a.subParser("makeMarkdown.node")(B[F], Z);
        function N(w) {
          for (var I = 0; I < w.childNodes.length; ++I) {
            var K = w.childNodes[I];
            K.nodeType === 3 ? !/\S/.test(K.nodeValue) && !/^[ ]+$/.test(K.nodeValue) ? (w.removeChild(K), --I) : (K.nodeValue = K.nodeValue.split(`
`).join(" "), K.nodeValue = K.nodeValue.replace(/(\s)+/g, "$1")) : K.nodeType === 1 && N(K);
          }
        }
        function l(w) {
          for (var I = w.querySelectorAll("pre"), K = [], W = 0; W < I.length; ++W)
            if (I[W].childElementCount === 1 && I[W].firstChild.tagName.toLowerCase() === "code") {
              var re = I[W].firstChild.innerHTML.trim(), ae = I[W].firstChild.getAttribute("data-language") || "";
              if (ae === "")
                for (var fe = I[W].firstChild.className.split(" "), Te = 0; Te < fe.length; ++Te) {
                  var xe = fe[Te].match(/^language-(.+)$/);
                  if (xe !== null) {
                    ae = xe[1];
                    break;
                  }
                }
              re = a.helper.unescapeHTMLEntities(re), K.push(re), I[W].outerHTML = '<precode language="' + ae + '" precodenum="' + W.toString() + '"></precode>';
            } else
              K.push(I[W].innerHTML), I[W].innerHTML = "", I[W].setAttribute("prenum", W.toString());
          return K;
        }
        return k;
      }, this.setOption = function(_, q) {
        d[_] = q;
      }, this.getOption = function(_) {
        return d[_];
      }, this.getOptions = function() {
        return d;
      }, this.addExtension = function(_, q) {
        q = q || null, U(_, q);
      }, this.useExtension = function(_) {
        U(_);
      }, this.setFlavor = function(_) {
        if (!b.hasOwnProperty(_))
          throw Error(_ + " flavor was not found");
        var q = b[_];
        m = _;
        for (var J in q)
          q.hasOwnProperty(J) && (d[J] = q[J]);
      }, this.getFlavor = function() {
        return m;
      }, this.removeExtension = function(_) {
        a.helper.isArray(_) || (_ = [_]);
        for (var q = 0; q < _.length; ++q) {
          for (var J = _[q], Z = 0; Z < s.length; ++Z)
            s[Z] === J && s.splice(Z, 1);
          for (var B = 0; B < i.length; ++B)
            i[B] === J && i.splice(B, 1);
        }
      }, this.getAllExtensions = function() {
        return {
          language: s,
          output: i
        };
      }, this.getMetadata = function(_) {
        return _ ? h.raw : h.parsed;
      }, this.getMetadataFormat = function() {
        return h.format;
      }, this._setMetadataPair = function(_, q) {
        h.parsed[_] = q;
      }, this._setMetadataFormat = function(_) {
        h.format = _;
      }, this._setMetadataRaw = function(_) {
        h.raw = _;
      };
    }, a.subParser("anchors", function(t, d, s) {
      t = s.converter._dispatch("anchors.before", t, d, s);
      var i = function(c, m, h, C, U, H, V) {
        if (a.helper.isUndefined(V) && (V = ""), h = h.toLowerCase(), c.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          C = "";
        else if (!C)
          if (h || (h = m.toLowerCase().replace(/ ?\n/g, " ")), C = "#" + h, !a.helper.isUndefined(s.gUrls[h]))
            C = s.gUrls[h], a.helper.isUndefined(s.gTitles[h]) || (V = s.gTitles[h]);
          else
            return c;
        C = C.replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback);
        var G = '<a href="' + C + '"';
        return V !== "" && V !== null && (V = V.replace(/"/g, "&quot;"), V = V.replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback), G += ' title="' + V + '"'), d.openLinksInNewWindow && !/^#/.test(C) && (G += ' rel="noopener noreferrer" target="¨E95Eblank"'), G += ">" + m + "</a>", G;
      };
      return t = t.replace(/\[((?:\[[^\]]*]|[^\[\]])*)] ?(?:\n *)?\[(.*?)]()()()()/g, i), t = t.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<([^>]*)>(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        i
      ), t = t.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        i
      ), t = t.replace(/\[([^\[\]]+)]()()()()()/g, i), d.ghMentions && (t = t.replace(/(^|\s)(\\)?(@([a-z\d]+(?:[a-z\d.-]+?[a-z\d]+)*))/gmi, function(c, m, h, C, U) {
        if (h === "\\")
          return m + C;
        if (!a.helper.isString(d.ghMentionsLink))
          throw new Error("ghMentionsLink option must be a string");
        var H = d.ghMentionsLink.replace(/\{u}/g, U), V = "";
        return d.openLinksInNewWindow && (V = ' rel="noopener noreferrer" target="¨E95Eblank"'), m + '<a href="' + H + '"' + V + ">" + C + "</a>";
      })), t = s.converter._dispatch("anchors.after", t, d, s), t;
    });
    var z = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+?\.[^'">\s]+?)()(\1)?(?=\s|$)(?!["<>])/gi, L = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+?)([.!?,()\[\]])?(\1)?(?=\s|$)(?!["<>])/gi, R = /()<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)()>()/gi, j = /(^|\s)(?:mailto:)?([A-Za-z0-9!#$%&'*+-/=?^_`{|}~.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?=$|\s)/gmi, T = /<()(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi, $ = function(t) {
      return function(d, s, i, c, m, h, C) {
        i = i.replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback);
        var U = i, H = "", V = "", G = s || "", _ = C || "";
        return /^www\./i.test(i) && (i = i.replace(/^www\./i, "http://www.")), t.excludeTrailingPunctuationFromURLs && h && (H = h), t.openLinksInNewWindow && (V = ' rel="noopener noreferrer" target="¨E95Eblank"'), G + '<a href="' + i + '"' + V + ">" + U + "</a>" + H + _;
      };
    }, O = function(t, d) {
      return function(s, i, c) {
        var m = "mailto:";
        return i = i || "", c = a.subParser("unescapeSpecialChars")(c, t, d), t.encodeEmails ? (m = a.helper.encodeEmailAddress(m + c), c = a.helper.encodeEmailAddress(c)) : m = m + c, i + '<a href="' + m + '">' + c + "</a>";
      };
    };
    a.subParser("autoLinks", function(t, d, s) {
      return t = s.converter._dispatch("autoLinks.before", t, d, s), t = t.replace(R, $(d)), t = t.replace(T, O(d, s)), t = s.converter._dispatch("autoLinks.after", t, d, s), t;
    }), a.subParser("simplifiedAutoLinks", function(t, d, s) {
      return d.simplifiedAutoLink && (t = s.converter._dispatch("simplifiedAutoLinks.before", t, d, s), d.excludeTrailingPunctuationFromURLs ? t = t.replace(L, $(d)) : t = t.replace(z, $(d)), t = t.replace(j, O(d, s)), t = s.converter._dispatch("simplifiedAutoLinks.after", t, d, s)), t;
    }), a.subParser("blockGamut", function(t, d, s) {
      return t = s.converter._dispatch("blockGamut.before", t, d, s), t = a.subParser("blockQuotes")(t, d, s), t = a.subParser("headers")(t, d, s), t = a.subParser("horizontalRule")(t, d, s), t = a.subParser("lists")(t, d, s), t = a.subParser("codeBlocks")(t, d, s), t = a.subParser("tables")(t, d, s), t = a.subParser("hashHTMLBlocks")(t, d, s), t = a.subParser("paragraphs")(t, d, s), t = s.converter._dispatch("blockGamut.after", t, d, s), t;
    }), a.subParser("blockQuotes", function(t, d, s) {
      t = s.converter._dispatch("blockQuotes.before", t, d, s), t = t + `

`;
      var i = /(^ {0,3}>[ \t]?.+\n(.+\n)*\n*)+/gm;
      return d.splitAdjacentBlockquotes && (i = /^ {0,3}>[\s\S]*?(?:\n\n)/gm), t = t.replace(i, function(c) {
        return c = c.replace(/^[ \t]*>[ \t]?/gm, ""), c = c.replace(/¨0/g, ""), c = c.replace(/^[ \t]+$/gm, ""), c = a.subParser("githubCodeBlocks")(c, d, s), c = a.subParser("blockGamut")(c, d, s), c = c.replace(/(^|\n)/g, "$1  "), c = c.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(m, h) {
          var C = h;
          return C = C.replace(/^  /mg, "¨0"), C = C.replace(/¨0/g, ""), C;
        }), a.subParser("hashBlock")(`<blockquote>
` + c + `
</blockquote>`, d, s);
      }), t = s.converter._dispatch("blockQuotes.after", t, d, s), t;
    }), a.subParser("codeBlocks", function(t, d, s) {
      t = s.converter._dispatch("codeBlocks.before", t, d, s), t += "¨0";
      var i = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=¨0))/g;
      return t = t.replace(i, function(c, m, h) {
        var C = m, U = h, H = `
`;
        return C = a.subParser("outdent")(C, d, s), C = a.subParser("encodeCode")(C, d, s), C = a.subParser("detab")(C, d, s), C = C.replace(/^\n+/g, ""), C = C.replace(/\n+$/g, ""), d.omitExtraWLInCodeBlocks && (H = ""), C = "<pre><code>" + C + H + "</code></pre>", a.subParser("hashBlock")(C, d, s) + U;
      }), t = t.replace(/¨0/, ""), t = s.converter._dispatch("codeBlocks.after", t, d, s), t;
    }), a.subParser("codeSpans", function(t, d, s) {
      return t = s.converter._dispatch("codeSpans.before", t, d, s), typeof t > "u" && (t = ""), t = t.replace(
        /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
        function(i, c, m, h) {
          var C = h;
          return C = C.replace(/^([ \t]*)/g, ""), C = C.replace(/[ \t]*$/g, ""), C = a.subParser("encodeCode")(C, d, s), C = c + "<code>" + C + "</code>", C = a.subParser("hashHTMLSpans")(C, d, s), C;
        }
      ), t = s.converter._dispatch("codeSpans.after", t, d, s), t;
    }), a.subParser("completeHTMLDocument", function(t, d, s) {
      if (!d.completeHTMLDocument)
        return t;
      t = s.converter._dispatch("completeHTMLDocument.before", t, d, s);
      var i = "html", c = `<!DOCTYPE HTML>
`, m = "", h = `<meta charset="utf-8">
`, C = "", U = "";
      typeof s.metadata.parsed.doctype < "u" && (c = "<!DOCTYPE " + s.metadata.parsed.doctype + `>
`, i = s.metadata.parsed.doctype.toString().toLowerCase(), (i === "html" || i === "html5") && (h = '<meta charset="utf-8">'));
      for (var H in s.metadata.parsed)
        if (s.metadata.parsed.hasOwnProperty(H))
          switch (H.toLowerCase()) {
            case "doctype":
              break;
            case "title":
              m = "<title>" + s.metadata.parsed.title + `</title>
`;
              break;
            case "charset":
              i === "html" || i === "html5" ? h = '<meta charset="' + s.metadata.parsed.charset + `">
` : h = '<meta name="charset" content="' + s.metadata.parsed.charset + `">
`;
              break;
            case "language":
            case "lang":
              C = ' lang="' + s.metadata.parsed[H] + '"', U += '<meta name="' + H + '" content="' + s.metadata.parsed[H] + `">
`;
              break;
            default:
              U += '<meta name="' + H + '" content="' + s.metadata.parsed[H] + `">
`;
          }
      return t = c + "<html" + C + `>
<head>
` + m + h + U + `</head>
<body>
` + t.trim() + `
</body>
</html>`, t = s.converter._dispatch("completeHTMLDocument.after", t, d, s), t;
    }), a.subParser("detab", function(t, d, s) {
      return t = s.converter._dispatch("detab.before", t, d, s), t = t.replace(/\t(?=\t)/g, "    "), t = t.replace(/\t/g, "¨A¨B"), t = t.replace(/¨B(.+?)¨A/g, function(i, c) {
        for (var m = c, h = 4 - m.length % 4, C = 0; C < h; C++)
          m += " ";
        return m;
      }), t = t.replace(/¨A/g, "    "), t = t.replace(/¨B/g, ""), t = s.converter._dispatch("detab.after", t, d, s), t;
    }), a.subParser("ellipsis", function(t, d, s) {
      return d.ellipsis && (t = s.converter._dispatch("ellipsis.before", t, d, s), t = t.replace(/\.\.\./g, "…"), t = s.converter._dispatch("ellipsis.after", t, d, s)), t;
    }), a.subParser("emoji", function(t, d, s) {
      if (!d.emoji)
        return t;
      t = s.converter._dispatch("emoji.before", t, d, s);
      var i = /:([\S]+?):/g;
      return t = t.replace(i, function(c, m) {
        return a.helper.emojis.hasOwnProperty(m) ? a.helper.emojis[m] : c;
      }), t = s.converter._dispatch("emoji.after", t, d, s), t;
    }), a.subParser("encodeAmpsAndAngles", function(t, d, s) {
      return t = s.converter._dispatch("encodeAmpsAndAngles.before", t, d, s), t = t.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;"), t = t.replace(/<(?![a-z\/?$!])/gi, "&lt;"), t = t.replace(/</g, "&lt;"), t = t.replace(/>/g, "&gt;"), t = s.converter._dispatch("encodeAmpsAndAngles.after", t, d, s), t;
    }), a.subParser("encodeBackslashEscapes", function(t, d, s) {
      return t = s.converter._dispatch("encodeBackslashEscapes.before", t, d, s), t = t.replace(/\\(\\)/g, a.helper.escapeCharactersCallback), t = t.replace(/\\([`*_{}\[\]()>#+.!~=|:-])/g, a.helper.escapeCharactersCallback), t = s.converter._dispatch("encodeBackslashEscapes.after", t, d, s), t;
    }), a.subParser("encodeCode", function(t, d, s) {
      return t = s.converter._dispatch("encodeCode.before", t, d, s), t = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/([*_{}\[\]\\=~-])/g, a.helper.escapeCharactersCallback), t = s.converter._dispatch("encodeCode.after", t, d, s), t;
    }), a.subParser("escapeSpecialCharsWithinTagAttributes", function(t, d, s) {
      t = s.converter._dispatch("escapeSpecialCharsWithinTagAttributes.before", t, d, s);
      var i = /<\/?[a-z\d_:-]+(?:[\s]+[\s\S]+?)?>/gi, c = /<!(--(?:(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>/gi;
      return t = t.replace(i, function(m) {
        return m.replace(/(.)<\/?code>(?=.)/g, "$1`").replace(/([\\`*_~=|])/g, a.helper.escapeCharactersCallback);
      }), t = t.replace(c, function(m) {
        return m.replace(/([\\`*_~=|])/g, a.helper.escapeCharactersCallback);
      }), t = s.converter._dispatch("escapeSpecialCharsWithinTagAttributes.after", t, d, s), t;
    }), a.subParser("githubCodeBlocks", function(t, d, s) {
      return d.ghCodeBlocks ? (t = s.converter._dispatch("githubCodeBlocks.before", t, d, s), t += "¨0", t = t.replace(/(?:^|\n)(?: {0,3})(```+|~~~+)(?: *)([^\s`~]*)\n([\s\S]*?)\n(?: {0,3})\1/g, function(i, c, m, h) {
        var C = d.omitExtraWLInCodeBlocks ? "" : `
`;
        return h = a.subParser("encodeCode")(h, d, s), h = a.subParser("detab")(h, d, s), h = h.replace(/^\n+/g, ""), h = h.replace(/\n+$/g, ""), h = "<pre><code" + (m ? ' class="' + m + " language-" + m + '"' : "") + ">" + h + C + "</code></pre>", h = a.subParser("hashBlock")(h, d, s), `

¨G` + (s.ghCodeBlocks.push({ text: i, codeblock: h }) - 1) + `G

`;
      }), t = t.replace(/¨0/, ""), s.converter._dispatch("githubCodeBlocks.after", t, d, s)) : t;
    }), a.subParser("hashBlock", function(t, d, s) {
      return t = s.converter._dispatch("hashBlock.before", t, d, s), t = t.replace(/(^\n+|\n+$)/g, ""), t = `

¨K` + (s.gHtmlBlocks.push(t) - 1) + `K

`, t = s.converter._dispatch("hashBlock.after", t, d, s), t;
    }), a.subParser("hashCodeTags", function(t, d, s) {
      t = s.converter._dispatch("hashCodeTags.before", t, d, s);
      var i = function(c, m, h, C) {
        var U = h + a.subParser("encodeCode")(m, d, s) + C;
        return "¨C" + (s.gHtmlSpans.push(U) - 1) + "C";
      };
      return t = a.helper.replaceRecursiveRegExp(t, i, "<code\\b[^>]*>", "</code>", "gim"), t = s.converter._dispatch("hashCodeTags.after", t, d, s), t;
    }), a.subParser("hashElement", function(t, d, s) {
      return function(i, c) {
        var m = c;
        return m = m.replace(/\n\n/g, `
`), m = m.replace(/^\n/, ""), m = m.replace(/\n+$/g, ""), m = `

¨K` + (s.gHtmlBlocks.push(m) - 1) + `K

`, m;
      };
    }), a.subParser("hashHTMLBlocks", function(t, d, s) {
      t = s.converter._dispatch("hashHTMLBlocks.before", t, d, s);
      var i = [
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
      ], c = function(_, q, J, Z) {
        var B = _;
        return J.search(/\bmarkdown\b/) !== -1 && (B = J + s.converter.makeHtml(q) + Z), `

¨K` + (s.gHtmlBlocks.push(B) - 1) + `K

`;
      };
      d.backslashEscapesHTMLTags && (t = t.replace(/\\<(\/?[^>]+?)>/g, function(_, q) {
        return "&lt;" + q + "&gt;";
      }));
      for (var m = 0; m < i.length; ++m)
        for (var h, C = new RegExp("^ {0,3}(<" + i[m] + "\\b[^>]*>)", "im"), U = "<" + i[m] + "\\b[^>]*>", H = "</" + i[m] + ">"; (h = a.helper.regexIndexOf(t, C)) !== -1; ) {
          var V = a.helper.splitAtIndex(t, h), G = a.helper.replaceRecursiveRegExp(V[1], c, U, H, "im");
          if (G === V[1])
            break;
          t = V[0].concat(G);
        }
      return t = t.replace(
        /(\n {0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
        a.subParser("hashElement")(t, d, s)
      ), t = a.helper.replaceRecursiveRegExp(t, function(_) {
        return `

¨K` + (s.gHtmlBlocks.push(_) - 1) + `K

`;
      }, "^ {0,3}<!--", "-->", "gm"), t = t.replace(
        /(?:\n\n)( {0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
        a.subParser("hashElement")(t, d, s)
      ), t = s.converter._dispatch("hashHTMLBlocks.after", t, d, s), t;
    }), a.subParser("hashHTMLSpans", function(t, d, s) {
      t = s.converter._dispatch("hashHTMLSpans.before", t, d, s);
      function i(c) {
        return "¨C" + (s.gHtmlSpans.push(c) - 1) + "C";
      }
      return t = t.replace(/<[^>]+?\/>/gi, function(c) {
        return i(c);
      }), t = t.replace(/<([^>]+?)>[\s\S]*?<\/\1>/g, function(c) {
        return i(c);
      }), t = t.replace(/<([^>]+?)\s[^>]+?>[\s\S]*?<\/\1>/g, function(c) {
        return i(c);
      }), t = t.replace(/<[^>]+?>/gi, function(c) {
        return i(c);
      }), t = s.converter._dispatch("hashHTMLSpans.after", t, d, s), t;
    }), a.subParser("unhashHTMLSpans", function(t, d, s) {
      t = s.converter._dispatch("unhashHTMLSpans.before", t, d, s);
      for (var i = 0; i < s.gHtmlSpans.length; ++i) {
        for (var c = s.gHtmlSpans[i], m = 0; /¨C(\d+)C/.test(c); ) {
          var h = RegExp.$1;
          if (c = c.replace("¨C" + h + "C", s.gHtmlSpans[h]), m === 10) {
            console.error("maximum nesting of 10 spans reached!!!");
            break;
          }
          ++m;
        }
        t = t.replace("¨C" + i + "C", c);
      }
      return t = s.converter._dispatch("unhashHTMLSpans.after", t, d, s), t;
    }), a.subParser("hashPreCodeTags", function(t, d, s) {
      t = s.converter._dispatch("hashPreCodeTags.before", t, d, s);
      var i = function(c, m, h, C) {
        var U = h + a.subParser("encodeCode")(m, d, s) + C;
        return `

¨G` + (s.ghCodeBlocks.push({ text: c, codeblock: U }) - 1) + `G

`;
      };
      return t = a.helper.replaceRecursiveRegExp(t, i, "^ {0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>", "^ {0,3}</code>\\s*</pre>", "gim"), t = s.converter._dispatch("hashPreCodeTags.after", t, d, s), t;
    }), a.subParser("headers", function(t, d, s) {
      t = s.converter._dispatch("headers.before", t, d, s);
      var i = isNaN(parseInt(d.headerLevelStart)) ? 1 : parseInt(d.headerLevelStart), c = d.smoothLivePreview ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm, m = d.smoothLivePreview ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;
      t = t.replace(c, function(U, H) {
        var V = a.subParser("spanGamut")(H, d, s), G = d.noHeaderId ? "" : ' id="' + C(H) + '"', _ = i, q = "<h" + _ + G + ">" + V + "</h" + _ + ">";
        return a.subParser("hashBlock")(q, d, s);
      }), t = t.replace(m, function(U, H) {
        var V = a.subParser("spanGamut")(H, d, s), G = d.noHeaderId ? "" : ' id="' + C(H) + '"', _ = i + 1, q = "<h" + _ + G + ">" + V + "</h" + _ + ">";
        return a.subParser("hashBlock")(q, d, s);
      });
      var h = d.requireSpaceBeforeHeadingText ? /^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm : /^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm;
      t = t.replace(h, function(U, H, V) {
        var G = V;
        d.customizedHeaderId && (G = V.replace(/\s?\{([^{]+?)}\s*$/, ""));
        var _ = a.subParser("spanGamut")(G, d, s), q = d.noHeaderId ? "" : ' id="' + C(V) + '"', J = i - 1 + H.length, Z = "<h" + J + q + ">" + _ + "</h" + J + ">";
        return a.subParser("hashBlock")(Z, d, s);
      });
      function C(U) {
        var H, V;
        if (d.customizedHeaderId) {
          var G = U.match(/\{([^{]+?)}\s*$/);
          G && G[1] && (U = G[1]);
        }
        return H = U, a.helper.isString(d.prefixHeaderId) ? V = d.prefixHeaderId : d.prefixHeaderId === !0 ? V = "section-" : V = "", d.rawPrefixHeaderId || (H = V + H), d.ghCompatibleHeaderId ? H = H.replace(/ /g, "-").replace(/&amp;/g, "").replace(/¨T/g, "").replace(/¨D/g, "").replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g, "").toLowerCase() : d.rawHeaderId ? H = H.replace(/ /g, "-").replace(/&amp;/g, "&").replace(/¨T/g, "¨").replace(/¨D/g, "$").replace(/["']/g, "-").toLowerCase() : H = H.replace(/[^\w]/g, "").toLowerCase(), d.rawPrefixHeaderId && (H = V + H), s.hashLinkCounts[H] ? H = H + "-" + s.hashLinkCounts[H]++ : s.hashLinkCounts[H] = 1, H;
      }
      return t = s.converter._dispatch("headers.after", t, d, s), t;
    }), a.subParser("horizontalRule", function(t, d, s) {
      t = s.converter._dispatch("horizontalRule.before", t, d, s);
      var i = a.subParser("hashBlock")("<hr />", d, s);
      return t = t.replace(/^ {0,2}( ?-){3,}[ \t]*$/gm, i), t = t.replace(/^ {0,2}( ?\*){3,}[ \t]*$/gm, i), t = t.replace(/^ {0,2}( ?_){3,}[ \t]*$/gm, i), t = s.converter._dispatch("horizontalRule.after", t, d, s), t;
    }), a.subParser("images", function(t, d, s) {
      t = s.converter._dispatch("images.before", t, d, s);
      var i = /!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, c = /!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)/g, m = /!\[([^\]]*?)][ \t]*()\([ \t]?<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, h = /!\[([^\]]*?)] ?(?:\n *)?\[([\s\S]*?)]()()()()()/g, C = /!\[([^\[\]]+)]()()()()()/g;
      function U(V, G, _, q, J, Z, B, k) {
        return q = q.replace(/\s/g, ""), H(V, G, _, q, J, Z, B, k);
      }
      function H(V, G, _, q, J, Z, B, k) {
        var F = s.gUrls, N = s.gTitles, l = s.gDimensions;
        if (_ = _.toLowerCase(), k || (k = ""), V.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          q = "";
        else if (q === "" || q === null)
          if ((_ === "" || _ === null) && (_ = G.toLowerCase().replace(/ ?\n/g, " ")), q = "#" + _, !a.helper.isUndefined(F[_]))
            q = F[_], a.helper.isUndefined(N[_]) || (k = N[_]), a.helper.isUndefined(l[_]) || (J = l[_].width, Z = l[_].height);
          else
            return V;
        G = G.replace(/"/g, "&quot;").replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback), q = q.replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback);
        var w = '<img src="' + q + '" alt="' + G + '"';
        return k && a.helper.isString(k) && (k = k.replace(/"/g, "&quot;").replace(a.helper.regexes.asteriskDashAndColon, a.helper.escapeCharactersCallback), w += ' title="' + k + '"'), J && Z && (J = J === "*" ? "auto" : J, Z = Z === "*" ? "auto" : Z, w += ' width="' + J + '"', w += ' height="' + Z + '"'), w += " />", w;
      }
      return t = t.replace(h, H), t = t.replace(m, U), t = t.replace(c, H), t = t.replace(i, H), t = t.replace(C, H), t = s.converter._dispatch("images.after", t, d, s), t;
    }), a.subParser("italicsAndBold", function(t, d, s) {
      t = s.converter._dispatch("italicsAndBold.before", t, d, s);
      function i(c, m, h) {
        return m + c + h;
      }
      return d.literalMidWordUnderscores ? (t = t.replace(/\b___(\S[\s\S]*?)___\b/g, function(c, m) {
        return i(m, "<strong><em>", "</em></strong>");
      }), t = t.replace(/\b__(\S[\s\S]*?)__\b/g, function(c, m) {
        return i(m, "<strong>", "</strong>");
      }), t = t.replace(/\b_(\S[\s\S]*?)_\b/g, function(c, m) {
        return i(m, "<em>", "</em>");
      })) : (t = t.replace(/___(\S[\s\S]*?)___/g, function(c, m) {
        return /\S$/.test(m) ? i(m, "<strong><em>", "</em></strong>") : c;
      }), t = t.replace(/__(\S[\s\S]*?)__/g, function(c, m) {
        return /\S$/.test(m) ? i(m, "<strong>", "</strong>") : c;
      }), t = t.replace(/_([^\s_][\s\S]*?)_/g, function(c, m) {
        return /\S$/.test(m) ? i(m, "<em>", "</em>") : c;
      })), d.literalMidWordAsterisks ? (t = t.replace(/([^*]|^)\B\*\*\*(\S[\s\S]*?)\*\*\*\B(?!\*)/g, function(c, m, h) {
        return i(h, m + "<strong><em>", "</em></strong>");
      }), t = t.replace(/([^*]|^)\B\*\*(\S[\s\S]*?)\*\*\B(?!\*)/g, function(c, m, h) {
        return i(h, m + "<strong>", "</strong>");
      }), t = t.replace(/([^*]|^)\B\*(\S[\s\S]*?)\*\B(?!\*)/g, function(c, m, h) {
        return i(h, m + "<em>", "</em>");
      })) : (t = t.replace(/\*\*\*(\S[\s\S]*?)\*\*\*/g, function(c, m) {
        return /\S$/.test(m) ? i(m, "<strong><em>", "</em></strong>") : c;
      }), t = t.replace(/\*\*(\S[\s\S]*?)\*\*/g, function(c, m) {
        return /\S$/.test(m) ? i(m, "<strong>", "</strong>") : c;
      }), t = t.replace(/\*([^\s*][\s\S]*?)\*/g, function(c, m) {
        return /\S$/.test(m) ? i(m, "<em>", "</em>") : c;
      })), t = s.converter._dispatch("italicsAndBold.after", t, d, s), t;
    }), a.subParser("lists", function(t, d, s) {
      function i(h, C) {
        s.gListLevel++, h = h.replace(/\n{2,}$/, `
`), h += "¨0";
        var U = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0| {0,3}([*+-]|\d+[.])[ \t]+))/gm, H = /\n[ \t]*\n(?!¨0)/.test(h);
        return d.disableForced4SpacesIndentedSublists && (U = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0|\2([*+-]|\d+[.])[ \t]+))/gm), h = h.replace(U, function(V, G, _, q, J, Z, B) {
          B = B && B.trim() !== "";
          var k = a.subParser("outdent")(J, d, s), F = "";
          return Z && d.tasklists && (F = ' class="task-list-item" style="list-style-type: none;"', k = k.replace(/^[ \t]*\[(x|X| )?]/m, function() {
            var N = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
            return B && (N += " checked"), N += ">", N;
          })), k = k.replace(/^([-*+]|\d\.)[ \t]+[\S\n ]*/g, function(N) {
            return "¨A" + N;
          }), G || k.search(/\n{2,}/) > -1 ? (k = a.subParser("githubCodeBlocks")(k, d, s), k = a.subParser("blockGamut")(k, d, s)) : (k = a.subParser("lists")(k, d, s), k = k.replace(/\n$/, ""), k = a.subParser("hashHTMLBlocks")(k, d, s), k = k.replace(/\n\n+/g, `

`), H ? k = a.subParser("paragraphs")(k, d, s) : k = a.subParser("spanGamut")(k, d, s)), k = k.replace("¨A", ""), k = "<li" + F + ">" + k + `</li>
`, k;
        }), h = h.replace(/¨0/g, ""), s.gListLevel--, C && (h = h.replace(/\s+$/, "")), h;
      }
      function c(h, C) {
        if (C === "ol") {
          var U = h.match(/^ *(\d+)\./);
          if (U && U[1] !== "1")
            return ' start="' + U[1] + '"';
        }
        return "";
      }
      function m(h, C, U) {
        var H = d.disableForced4SpacesIndentedSublists ? /^ ?\d+\.[ \t]/gm : /^ {0,3}\d+\.[ \t]/gm, V = d.disableForced4SpacesIndentedSublists ? /^ ?[*+-][ \t]/gm : /^ {0,3}[*+-][ \t]/gm, G = C === "ul" ? H : V, _ = "";
        if (h.search(G) !== -1)
          (function J(Z) {
            var B = Z.search(G), k = c(h, C);
            B !== -1 ? (_ += `

<` + C + k + `>
` + i(Z.slice(0, B), !!U) + "</" + C + `>
`, C = C === "ul" ? "ol" : "ul", G = C === "ul" ? H : V, J(Z.slice(B))) : _ += `

<` + C + k + `>
` + i(Z, !!U) + "</" + C + `>
`;
          })(h);
        else {
          var q = c(h, C);
          _ = `

<` + C + q + `>
` + i(h, !!U) + "</" + C + `>
`;
        }
        return _;
      }
      return t = s.converter._dispatch("lists.before", t, d, s), t += "¨0", s.gListLevel ? t = t.replace(
        /^(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(h, C, U) {
          var H = U.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return m(C, H, !0);
        }
      ) : t = t.replace(
        /(\n\n|^\n?)(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(h, C, U, H) {
          var V = H.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return m(U, V, !1);
        }
      ), t = t.replace(/¨0/, ""), t = s.converter._dispatch("lists.after", t, d, s), t;
    }), a.subParser("metadata", function(t, d, s) {
      if (!d.metadata)
        return t;
      t = s.converter._dispatch("metadata.before", t, d, s);
      function i(c) {
        s.metadata.raw = c, c = c.replace(/&/g, "&amp;").replace(/"/g, "&quot;"), c = c.replace(/\n {4}/g, " "), c.replace(/^([\S ]+): +([\s\S]+?)$/gm, function(m, h, C) {
          return s.metadata.parsed[h] = C, "";
        });
      }
      return t = t.replace(/^\s*«««+(\S*?)\n([\s\S]+?)\n»»»+\n/, function(c, m, h) {
        return i(h), "¨M";
      }), t = t.replace(/^\s*---+(\S*?)\n([\s\S]+?)\n---+\n/, function(c, m, h) {
        return m && (s.metadata.format = m), i(h), "¨M";
      }), t = t.replace(/¨M/g, ""), t = s.converter._dispatch("metadata.after", t, d, s), t;
    }), a.subParser("outdent", function(t, d, s) {
      return t = s.converter._dispatch("outdent.before", t, d, s), t = t.replace(/^(\t|[ ]{1,4})/gm, "¨0"), t = t.replace(/¨0/g, ""), t = s.converter._dispatch("outdent.after", t, d, s), t;
    }), a.subParser("paragraphs", function(t, d, s) {
      t = s.converter._dispatch("paragraphs.before", t, d, s), t = t.replace(/^\n+/g, ""), t = t.replace(/\n+$/g, "");
      for (var i = t.split(/\n{2,}/g), c = [], m = i.length, h = 0; h < m; h++) {
        var C = i[h];
        C.search(/¨(K|G)(\d+)\1/g) >= 0 ? c.push(C) : C.search(/\S/) >= 0 && (C = a.subParser("spanGamut")(C, d, s), C = C.replace(/^([ \t]*)/g, "<p>"), C += "</p>", c.push(C));
      }
      for (m = c.length, h = 0; h < m; h++) {
        for (var U = "", H = c[h], V = !1; /¨(K|G)(\d+)\1/.test(H); ) {
          var G = RegExp.$1, _ = RegExp.$2;
          G === "K" ? U = s.gHtmlBlocks[_] : V ? U = a.subParser("encodeCode")(s.ghCodeBlocks[_].text, d, s) : U = s.ghCodeBlocks[_].codeblock, U = U.replace(/\$/g, "$$$$"), H = H.replace(/(\n\n)?¨(K|G)\d+\2(\n\n)?/, U), /^<pre\b[^>]*>\s*<code\b[^>]*>/.test(H) && (V = !0);
        }
        c[h] = H;
      }
      return t = c.join(`
`), t = t.replace(/^\n+/g, ""), t = t.replace(/\n+$/g, ""), s.converter._dispatch("paragraphs.after", t, d, s);
    }), a.subParser("runExtension", function(t, d, s, i) {
      if (t.filter)
        d = t.filter(d, i.converter, s);
      else if (t.regex) {
        var c = t.regex;
        c instanceof RegExp || (c = new RegExp(c, "g")), d = d.replace(c, t.replace);
      }
      return d;
    }), a.subParser("spanGamut", function(t, d, s) {
      return t = s.converter._dispatch("spanGamut.before", t, d, s), t = a.subParser("codeSpans")(t, d, s), t = a.subParser("escapeSpecialCharsWithinTagAttributes")(t, d, s), t = a.subParser("encodeBackslashEscapes")(t, d, s), t = a.subParser("images")(t, d, s), t = a.subParser("anchors")(t, d, s), t = a.subParser("autoLinks")(t, d, s), t = a.subParser("simplifiedAutoLinks")(t, d, s), t = a.subParser("emoji")(t, d, s), t = a.subParser("underline")(t, d, s), t = a.subParser("italicsAndBold")(t, d, s), t = a.subParser("strikethrough")(t, d, s), t = a.subParser("ellipsis")(t, d, s), t = a.subParser("hashHTMLSpans")(t, d, s), t = a.subParser("encodeAmpsAndAngles")(t, d, s), d.simpleLineBreaks ? /\n\n¨K/.test(t) || (t = t.replace(/\n+/g, `<br />
`)) : t = t.replace(/  +\n/g, `<br />
`), t = s.converter._dispatch("spanGamut.after", t, d, s), t;
    }), a.subParser("strikethrough", function(t, d, s) {
      function i(c) {
        return d.simplifiedAutoLink && (c = a.subParser("simplifiedAutoLinks")(c, d, s)), "<del>" + c + "</del>";
      }
      return d.strikethrough && (t = s.converter._dispatch("strikethrough.before", t, d, s), t = t.replace(/(?:~){2}([\s\S]+?)(?:~){2}/g, function(c, m) {
        return i(m);
      }), t = s.converter._dispatch("strikethrough.after", t, d, s)), t;
    }), a.subParser("stripLinkDefinitions", function(t, d, s) {
      var i = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?([^>\s]+)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=¨0))/gm, c = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n\n|(?=¨0)|(?=\n\[))/gm;
      t += "¨0";
      var m = function(h, C, U, H, V, G, _) {
        return C = C.toLowerCase(), t.toLowerCase().split(C).length - 1 < 2 ? h : (U.match(/^data:.+?\/.+?;base64,/) ? s.gUrls[C] = U.replace(/\s/g, "") : s.gUrls[C] = a.subParser("encodeAmpsAndAngles")(U, d, s), G ? G + _ : (_ && (s.gTitles[C] = _.replace(/"|'/g, "&quot;")), d.parseImgDimensions && H && V && (s.gDimensions[C] = {
          width: H,
          height: V
        }), ""));
      };
      return t = t.replace(c, m), t = t.replace(i, m), t = t.replace(/¨0/, ""), t;
    }), a.subParser("tables", function(t, d, s) {
      if (!d.tables)
        return t;
      var i = /^ {0,3}\|?.+\|.+\n {0,3}\|?[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:[-=]){2,}[\s\S]+?(?:\n\n|¨0)/gm, c = /^ {0,3}\|.+\|[ \t]*\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n( {0,3}\|.+\|[ \t]*\n)*(?:\n|¨0)/gm;
      function m(V) {
        return /^:[ \t]*--*$/.test(V) ? ' style="text-align:left;"' : /^--*[ \t]*:[ \t]*$/.test(V) ? ' style="text-align:right;"' : /^:[ \t]*--*[ \t]*:$/.test(V) ? ' style="text-align:center;"' : "";
      }
      function h(V, G) {
        var _ = "";
        return V = V.trim(), (d.tablesHeaderId || d.tableHeaderId) && (_ = ' id="' + V.replace(/ /g, "_").toLowerCase() + '"'), V = a.subParser("spanGamut")(V, d, s), "<th" + _ + G + ">" + V + `</th>
`;
      }
      function C(V, G) {
        var _ = a.subParser("spanGamut")(V, d, s);
        return "<td" + G + ">" + _ + `</td>
`;
      }
      function U(V, G) {
        for (var _ = `<table>
<thead>
<tr>
`, q = V.length, J = 0; J < q; ++J)
          _ += V[J];
        for (_ += `</tr>
</thead>
<tbody>
`, J = 0; J < G.length; ++J) {
          _ += `<tr>
`;
          for (var Z = 0; Z < q; ++Z)
            _ += G[J][Z];
          _ += `</tr>
`;
        }
        return _ += `</tbody>
</table>
`, _;
      }
      function H(V) {
        var G, _ = V.split(`
`);
        for (G = 0; G < _.length; ++G)
          /^ {0,3}\|/.test(_[G]) && (_[G] = _[G].replace(/^ {0,3}\|/, "")), /\|[ \t]*$/.test(_[G]) && (_[G] = _[G].replace(/\|[ \t]*$/, "")), _[G] = a.subParser("codeSpans")(_[G], d, s);
        var q = _[0].split("|").map(function(w) {
          return w.trim();
        }), J = _[1].split("|").map(function(w) {
          return w.trim();
        }), Z = [], B = [], k = [], F = [];
        for (_.shift(), _.shift(), G = 0; G < _.length; ++G)
          _[G].trim() !== "" && Z.push(
            _[G].split("|").map(function(w) {
              return w.trim();
            })
          );
        if (q.length < J.length)
          return V;
        for (G = 0; G < J.length; ++G)
          k.push(m(J[G]));
        for (G = 0; G < q.length; ++G)
          a.helper.isUndefined(k[G]) && (k[G] = ""), B.push(h(q[G], k[G]));
        for (G = 0; G < Z.length; ++G) {
          for (var N = [], l = 0; l < B.length; ++l)
            a.helper.isUndefined(Z[G][l]), N.push(C(Z[G][l], k[l]));
          F.push(N);
        }
        return U(B, F);
      }
      return t = s.converter._dispatch("tables.before", t, d, s), t = t.replace(/\\(\|)/g, a.helper.escapeCharactersCallback), t = t.replace(i, H), t = t.replace(c, H), t = s.converter._dispatch("tables.after", t, d, s), t;
    }), a.subParser("underline", function(t, d, s) {
      return d.underline && (t = s.converter._dispatch("underline.before", t, d, s), d.literalMidWordUnderscores ? (t = t.replace(/\b___(\S[\s\S]*?)___\b/g, function(i, c) {
        return "<u>" + c + "</u>";
      }), t = t.replace(/\b__(\S[\s\S]*?)__\b/g, function(i, c) {
        return "<u>" + c + "</u>";
      })) : (t = t.replace(/___(\S[\s\S]*?)___/g, function(i, c) {
        return /\S$/.test(c) ? "<u>" + c + "</u>" : i;
      }), t = t.replace(/__(\S[\s\S]*?)__/g, function(i, c) {
        return /\S$/.test(c) ? "<u>" + c + "</u>" : i;
      })), t = t.replace(/(_)/g, a.helper.escapeCharactersCallback), t = s.converter._dispatch("underline.after", t, d, s)), t;
    }), a.subParser("unescapeSpecialChars", function(t, d, s) {
      return t = s.converter._dispatch("unescapeSpecialChars.before", t, d, s), t = t.replace(/¨E(\d+)E/g, function(i, c) {
        var m = parseInt(c);
        return String.fromCharCode(m);
      }), t = s.converter._dispatch("unescapeSpecialChars.after", t, d, s), t;
    }), a.subParser("makeMarkdown.blockquote", function(t, d) {
      var s = "";
      if (t.hasChildNodes())
        for (var i = t.childNodes, c = i.length, m = 0; m < c; ++m) {
          var h = a.subParser("makeMarkdown.node")(i[m], d);
          h !== "" && (s += h);
        }
      return s = s.trim(), s = "> " + s.split(`
`).join(`
> `), s;
    }), a.subParser("makeMarkdown.codeBlock", function(t, d) {
      var s = t.getAttribute("language"), i = t.getAttribute("precodenum");
      return "```" + s + `
` + d.preList[i] + "\n```";
    }), a.subParser("makeMarkdown.codeSpan", function(t) {
      return "`" + t.innerHTML + "`";
    }), a.subParser("makeMarkdown.emphasis", function(t, d) {
      var s = "";
      if (t.hasChildNodes()) {
        s += "*";
        for (var i = t.childNodes, c = i.length, m = 0; m < c; ++m)
          s += a.subParser("makeMarkdown.node")(i[m], d);
        s += "*";
      }
      return s;
    }), a.subParser("makeMarkdown.header", function(t, d, s) {
      var i = new Array(s + 1).join("#"), c = "";
      if (t.hasChildNodes()) {
        c = i + " ";
        for (var m = t.childNodes, h = m.length, C = 0; C < h; ++C)
          c += a.subParser("makeMarkdown.node")(m[C], d);
      }
      return c;
    }), a.subParser("makeMarkdown.hr", function() {
      return "---";
    }), a.subParser("makeMarkdown.image", function(t) {
      var d = "";
      return t.hasAttribute("src") && (d += "![" + t.getAttribute("alt") + "](", d += "<" + t.getAttribute("src") + ">", t.hasAttribute("width") && t.hasAttribute("height") && (d += " =" + t.getAttribute("width") + "x" + t.getAttribute("height")), t.hasAttribute("title") && (d += ' "' + t.getAttribute("title") + '"'), d += ")"), d;
    }), a.subParser("makeMarkdown.links", function(t, d) {
      var s = "";
      if (t.hasChildNodes() && t.hasAttribute("href")) {
        var i = t.childNodes, c = i.length;
        s = "[";
        for (var m = 0; m < c; ++m)
          s += a.subParser("makeMarkdown.node")(i[m], d);
        s += "](", s += "<" + t.getAttribute("href") + ">", t.hasAttribute("title") && (s += ' "' + t.getAttribute("title") + '"'), s += ")";
      }
      return s;
    }), a.subParser("makeMarkdown.list", function(t, d, s) {
      var i = "";
      if (!t.hasChildNodes())
        return "";
      for (var c = t.childNodes, m = c.length, h = t.getAttribute("start") || 1, C = 0; C < m; ++C)
        if (!(typeof c[C].tagName > "u" || c[C].tagName.toLowerCase() !== "li")) {
          var U = "";
          s === "ol" ? U = h.toString() + ". " : U = "- ", i += U + a.subParser("makeMarkdown.listItem")(c[C], d), ++h;
        }
      return i += `
<!-- -->
`, i.trim();
    }), a.subParser("makeMarkdown.listItem", function(t, d) {
      for (var s = "", i = t.childNodes, c = i.length, m = 0; m < c; ++m)
        s += a.subParser("makeMarkdown.node")(i[m], d);
      return /\n$/.test(s) ? s = s.split(`
`).join(`
    `).replace(/^ {4}$/gm, "").replace(/\n\n+/g, `

`) : s += `
`, s;
    }), a.subParser("makeMarkdown.node", function(t, d, s) {
      s = s || !1;
      var i = "";
      if (t.nodeType === 3)
        return a.subParser("makeMarkdown.txt")(t, d);
      if (t.nodeType === 8)
        return "<!--" + t.data + `-->

`;
      if (t.nodeType !== 1)
        return "";
      var c = t.tagName.toLowerCase();
      switch (c) {
        case "h1":
          s || (i = a.subParser("makeMarkdown.header")(t, d, 1) + `

`);
          break;
        case "h2":
          s || (i = a.subParser("makeMarkdown.header")(t, d, 2) + `

`);
          break;
        case "h3":
          s || (i = a.subParser("makeMarkdown.header")(t, d, 3) + `

`);
          break;
        case "h4":
          s || (i = a.subParser("makeMarkdown.header")(t, d, 4) + `

`);
          break;
        case "h5":
          s || (i = a.subParser("makeMarkdown.header")(t, d, 5) + `

`);
          break;
        case "h6":
          s || (i = a.subParser("makeMarkdown.header")(t, d, 6) + `

`);
          break;
        case "p":
          s || (i = a.subParser("makeMarkdown.paragraph")(t, d) + `

`);
          break;
        case "blockquote":
          s || (i = a.subParser("makeMarkdown.blockquote")(t, d) + `

`);
          break;
        case "hr":
          s || (i = a.subParser("makeMarkdown.hr")(t, d) + `

`);
          break;
        case "ol":
          s || (i = a.subParser("makeMarkdown.list")(t, d, "ol") + `

`);
          break;
        case "ul":
          s || (i = a.subParser("makeMarkdown.list")(t, d, "ul") + `

`);
          break;
        case "precode":
          s || (i = a.subParser("makeMarkdown.codeBlock")(t, d) + `

`);
          break;
        case "pre":
          s || (i = a.subParser("makeMarkdown.pre")(t, d) + `

`);
          break;
        case "table":
          s || (i = a.subParser("makeMarkdown.table")(t, d) + `

`);
          break;
        case "code":
          i = a.subParser("makeMarkdown.codeSpan")(t, d);
          break;
        case "em":
        case "i":
          i = a.subParser("makeMarkdown.emphasis")(t, d);
          break;
        case "strong":
        case "b":
          i = a.subParser("makeMarkdown.strong")(t, d);
          break;
        case "del":
          i = a.subParser("makeMarkdown.strikethrough")(t, d);
          break;
        case "a":
          i = a.subParser("makeMarkdown.links")(t, d);
          break;
        case "img":
          i = a.subParser("makeMarkdown.image")(t, d);
          break;
        default:
          i = t.outerHTML + `

`;
      }
      return i;
    }), a.subParser("makeMarkdown.paragraph", function(t, d) {
      var s = "";
      if (t.hasChildNodes())
        for (var i = t.childNodes, c = i.length, m = 0; m < c; ++m)
          s += a.subParser("makeMarkdown.node")(i[m], d);
      return s = s.trim(), s;
    }), a.subParser("makeMarkdown.pre", function(t, d) {
      var s = t.getAttribute("prenum");
      return "<pre>" + d.preList[s] + "</pre>";
    }), a.subParser("makeMarkdown.strikethrough", function(t, d) {
      var s = "";
      if (t.hasChildNodes()) {
        s += "~~";
        for (var i = t.childNodes, c = i.length, m = 0; m < c; ++m)
          s += a.subParser("makeMarkdown.node")(i[m], d);
        s += "~~";
      }
      return s;
    }), a.subParser("makeMarkdown.strong", function(t, d) {
      var s = "";
      if (t.hasChildNodes()) {
        s += "**";
        for (var i = t.childNodes, c = i.length, m = 0; m < c; ++m)
          s += a.subParser("makeMarkdown.node")(i[m], d);
        s += "**";
      }
      return s;
    }), a.subParser("makeMarkdown.table", function(t, d) {
      var s = "", i = [[], []], c = t.querySelectorAll("thead>tr>th"), m = t.querySelectorAll("tbody>tr"), h, C;
      for (h = 0; h < c.length; ++h) {
        var U = a.subParser("makeMarkdown.tableCell")(c[h], d), H = "---";
        if (c[h].hasAttribute("style")) {
          var V = c[h].getAttribute("style").toLowerCase().replace(/\s/g, "");
          switch (V) {
            case "text-align:left;":
              H = ":---";
              break;
            case "text-align:right;":
              H = "---:";
              break;
            case "text-align:center;":
              H = ":---:";
              break;
          }
        }
        i[0][h] = U.trim(), i[1][h] = H;
      }
      for (h = 0; h < m.length; ++h) {
        var G = i.push([]) - 1, _ = m[h].getElementsByTagName("td");
        for (C = 0; C < c.length; ++C) {
          var q = " ";
          typeof _[C] < "u" && (q = a.subParser("makeMarkdown.tableCell")(_[C], d)), i[G].push(q);
        }
      }
      var J = 3;
      for (h = 0; h < i.length; ++h)
        for (C = 0; C < i[h].length; ++C) {
          var Z = i[h][C].length;
          Z > J && (J = Z);
        }
      for (h = 0; h < i.length; ++h) {
        for (C = 0; C < i[h].length; ++C)
          h === 1 ? i[h][C].slice(-1) === ":" ? i[h][C] = a.helper.padEnd(i[h][C].slice(-1), J - 1, "-") + ":" : i[h][C] = a.helper.padEnd(i[h][C], J, "-") : i[h][C] = a.helper.padEnd(i[h][C], J);
        s += "| " + i[h].join(" | ") + ` |
`;
      }
      return s.trim();
    }), a.subParser("makeMarkdown.tableCell", function(t, d) {
      var s = "";
      if (!t.hasChildNodes())
        return "";
      for (var i = t.childNodes, c = i.length, m = 0; m < c; ++m)
        s += a.subParser("makeMarkdown.node")(i[m], d, !0);
      return s.trim();
    }), a.subParser("makeMarkdown.txt", function(t) {
      var d = t.nodeValue;
      return d = d.replace(/ +/g, " "), d = d.replace(/¨NBSP;/g, " "), d = a.helper.unescapeHTMLEntities(d), d = d.replace(/([*_~|`])/g, "\\$1"), d = d.replace(/^(\s*)>/g, "\\$1>"), d = d.replace(/^#/gm, "\\#"), d = d.replace(/^(\s*)([-=]{3,})(\s*)$/, "$1\\$2$3"), d = d.replace(/^( {0,3}\d+)\./gm, "$1\\."), d = d.replace(/^( {0,3})([+-])/gm, "$1\\$2"), d = d.replace(/]([\s]*)\(/g, "\\]$1\\("), d = d.replace(/^ {0,3}\[([\S \t]*?)]:/gm, "\\[$1]:"), d;
    });
    var D = this;
    e.exports ? e.exports = a : D.showdown = a;
  }).call(kn);
})(ms);
var Zo = ms.exports;
const $n = /* @__PURE__ */ Pn(Zo);
class En {
  constructor() {
    be(this, "logger");
    be(this, "converter");
    this.logger = Aa.zhiLog("showdown-adaptor"), this.converter = new $n.Converter();
  }
  isAvailable() {
    return typeof $n < "u";
  }
  renderMarkdownStr(r) {
    if (!this.isAvailable())
      throw new Error("Showdown is not available");
    return this.logger.info("Showdown is rendering md to HTML..."), Promise.resolve(this.converter.makeHtml(r));
  }
}
class gs {
  constructor() {
    be(this, "logger");
    be(this, "mdAdaptor", new En());
    this.logger = Aa.zhiLog("markdown-util");
  }
  /**
   * 获取当前 MD 解析器名称
   */
  getCurrentAdaptorName() {
    return this.mdAdaptor instanceof bn ? "Lute" : this.mdAdaptor instanceof En ? "Showdown" : "None";
  }
  /**
   * 渲染Markdown
   *
   * @param md - Markdown文本
   */
  async renderHTML(r) {
    const n = new bn();
    return this.logger.debug("Lute status =>", n.isAvailable()), n.isAvailable() && (this.mdAdaptor = n), this.logger.info(`Using ${this.getCurrentAdaptorName()} as markdown renderer`), await this.mdAdaptor.renderMarkdownStr(r);
  }
}
class Yo {
  constructor() {
    be(this, "mdUtil");
    this.mdUtil = new gs();
  }
  /**
   * 移除标题数字
   *
   * @param str - 字符串
   */
  removeTitleNumber(r) {
    let n = r;
    const a = /([0-9]*)\./;
    return n = n.replace(a, ""), n;
  }
  /**
   * 删除挂件的HTML
   *
   * @param str - 原字符
   */
  removeWidgetTag(r) {
    let n = r.toString();
    const a = /<iframe.*src="\/widgets\/publisher.*<\/iframe>/g;
    n = n.replace(a, "");
    const u = /<iframe.*src="\/widgets\/sy-post-publisher.*<\/iframe>/g;
    n = n.replace(u, "");
    const o = /<iframe.*\/widgets\/Note*\sAttrs.*\/iframe>/g;
    return n = n.replace(o, ""), n;
  }
  /**
   * 删除Markdown文本的挂件的HTML
   *
   * @param str - 原字符
   */
  removeMdWidgetTag(r) {
    let n = r.toString();
    return n = this.removeWidgetTag(n), n;
  }
  /**
   * 去除html标签，残缺不全也可以
   *
   * @param str - 字符串
   */
  filterHtml(r) {
    r = r.replace(/<style((.|\n|\r)*?)<\/style>/g, ""), r = r.replace(/<script((.|\n|\r)*?)<\/script>/g, ""), r = r.replace(/<[^>]*>/g, ""), r = r.replace(/&.*;/g, ""), r = r.replace(/(^\s*)|(\s*$)/g, ""), r = r.replace(/</g, "").replace(/>/g, ""), r = r.replace(/"/g, "").replace(/'/g, ""), r = r.replace(/\*/g, ""), r = r.replace(/\$/g, ""), r = r.replace(/\./g, ""), r = r.replace(/\+/g, ""), r = r.replace(/\s+/g, ""), r = r.replace(/[:|：]/g, "_"), r = r.replace(/[;|；]/g, "_"), r = r.replace(/\^/g, "_"), r = r.replace(/!/g, "_"), r = r.replace(/@/g, "at_");
    const n = ["\\d*/\\d/\\d*", "[、|\\\\]", "[，|,]", "\\d", "/", "-"];
    for (let a = 0; a < n.length; a++) {
      const u = new RegExp(n[a], "g");
      r = r.replace(u, "");
    }
    return r = r.toLowerCase(), r;
  }
  /**
   * 截取指定长度html
   *
   * @param html - html
   * @param length - 长度
   * @param ignore - 不要结尾省略号
   */
  parseHtml(r, n, a) {
    const u = this.filterHtml(r);
    return u.length < n ? u : a === !0 ? u.substring(0, n) : u.substring(0, n) + "...";
  }
  /**
   * 将Markdown转换为HTML
   *
   * @param md - Markdown
   */
  async mdToHtml(r) {
    const n = await this.mdUtil.renderHTML(r);
    return this.removeWidgetTag(n);
  }
  /**
   * 将Markdown转换为纯文本
   *
   * @param md - Markdown
   */
  async mdToPlainText(r) {
    const n = await this.mdToHtml(r);
    return this.filterHtml(n);
  }
  /**
   * 移除H1标签
   *
   * @param html - html
   */
  removeH1(r) {
    let n = r;
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
  removeMdH1(r) {
    let n = r;
    const a = /^# .*$/gm;
    return n = n.replace(a, ""), n;
  }
}
class Xo {
  /**
   * 检测是否是空对象
   *
   * @param obj - 对象
   */
  isEmptyObject(r) {
    return r ? Object.getPrototypeOf(r) === Object.prototype && Object.getOwnPropertyNames(r).length === 0 && Object.getOwnPropertySymbols(r).length === 0 : !0;
  }
}
class Qo {
  constructor() {
    be(this, "dateUtil");
    be(this, "strUtil");
    be(this, "versionUtil");
    be(this, "htmlUtil");
    be(this, "markdownUtil");
    be(this, "jsonUtil");
    be(this, "objectUtil");
    this.dateUtil = new ko(), this.strUtil = new Po(), this.versionUtil = new jo(), this.htmlUtil = new Yo(), this.markdownUtil = new gs(), this.jsonUtil = new Eo(), this.objectUtil = new Xo();
  }
}
const xo = Qo;
export {
  xo as ZhiCommon,
  yt as ZhiUtil
};
