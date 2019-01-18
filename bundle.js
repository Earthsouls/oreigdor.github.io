~ function() {
    var p = p || {};
    p.scope = {};
    p.ASSUME_ES5 = !1;
    p.ASSUME_NO_NATIVE_MAP = !1;
    p.ASSUME_NO_NATIVE_SET = !1;
    p.defineProperty = p.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(g, f, d) {
        g != Array.prototype && g != Object.prototype && (g[f] = d.value)
    };
    p.getGlobal = function(g) {
        return "undefined" != typeof window && window === g ? g : "undefined" != typeof global && null != global ? global : g
    };
    p.global = p.getGlobal(this);
    p.SYMBOL_PREFIX = "jscomp_symbol_";
    p.initSymbol = function() {
        p.initSymbol = function() {};
        p.global.Symbol || (p.global.Symbol = p.Symbol)
    };
    p.Symbol = function() {
        var g = 0;
        return function(f) {
            return p.SYMBOL_PREFIX + (f || "") + g++
        }
    }();
    p.initSymbolIterator = function() {
        p.initSymbol();
        var g = p.global.Symbol.iterator;
        g || (g = p.global.Symbol.iterator = p.global.Symbol("iterator"));
        "function" != typeof Array.prototype[g] && p.defineProperty(Array.prototype, g, {
            configurable: !0,
            writable: !0,
            value: function() {
                return p.arrayIterator(this)
            }
        });
        p.initSymbolIterator = function() {}
    };
    p.initSymbolAsyncIterator = function() {
        p.initSymbol();
        var g = p.global.Symbol.asyncIterator;
        g || (g = p.global.Symbol.asyncIterator = p.global.Symbol("asyncIterator"));
        p.initSymbolAsyncIterator = function() {}
    };
    p.arrayIterator = function(g) {
        var f = 0;
        return p.iteratorPrototype(function() {
            return f < g.length ? {
                done: !1,
                value: g[f++]
            } : {
                done: !0
            }
        })
    };
    p.iteratorPrototype = function(g) {
        p.initSymbolIterator();
        g = {
            next: g
        };
        g[p.global.Symbol.iterator] = function() {
            return this
        };
        return g
    };
    p.makeIterator = function(g) {
        p.initSymbolIterator();
        p.initSymbol();
        p.initSymbolIterator();
        var f = g[Symbol.iterator];
        return f ? f.call(g) : p.arrayIterator(g)
    };
    p.arrayFromIterator = function(g) {
        for (var f, d = []; !(f = g.next()).done;) d.push(f.value);
        return d
    };
    p.arrayFromIterable = function(g) {
        return g instanceof Array ? g : p.arrayFromIterator(p.makeIterator(g))
    };
    p.polyfill = function(g, f) {
        if (f) {
            var d = p.global;
            g = g.split(".");
            for (var b = 0; b < g.length - 1; b++) {
                var a = g[b];
                a in d || (d[a] = {});
                d = d[a]
            }
            g = g[g.length - 1];
            b = d[g];
            f = f(b);
            f != b && null != f && p.defineProperty(d, g, {
                configurable: !0,
                writable: !0,
                value: f
            })
        }
    };
    p.polyfill("Object.getOwnPropertySymbols", function(g) {
        return g ? g : function() {
            return []
        }
    }, "es6", "es5");
    p.polyfill("Reflect.ownKeys", function(g) {
        return g ? g : function(f) {
            var d = [],
                b = Object.getOwnPropertyNames(f);
            f = Object.getOwnPropertySymbols(f);
            for (var a = 0; a < b.length; a++)("jscomp_symbol_" == b[a].substring(0, 14) ? f : d).push(b[a]);
            return d.concat(f)
        }
    }, "es6", "es5");
    p.polyfill("Array.prototype.fill", function(g) {
        return g ? g : function(f, d, b) {
            var a = this.length || 0;
            0 > d && (d = Math.max(0, a + d));
            if (null == b || b > a) b = a;
            b = Number(b);
            0 > b && (b = Math.max(0, a + b));
            for (d = Number(d || 0); d < b; d++) this[d] = f;
            return this
        }
    }, "es6", "es3");
    p.findInternal = function(g, f, d) {
        g instanceof String && (g = String(g));
        for (var b = g.length, a = 0; a < b; a++) {
            var m = g[a];
            if (f.call(d, m, a, g)) return {
                i: a,
                v: m
            }
        }
        return {
            i: -1,
            v: void 0
        }
    };
    p.polyfill("Array.prototype.findIndex", function(g) {
        return g ? g : function(f, d) {
            return p.findInternal(this, f, d).i
        }
    }, "es6", "es3");
    p.owns = function(g, f) {
        return Object.prototype.hasOwnProperty.call(g, f)
    };
    p.polyfill("Object.entries", function(g) {
        return g ? g : function(f) {
            var d = [],
                b;
            for (b in f) p.owns(f, b) && d.push([b, f[b]]);
            return d
        }
    }, "es8", "es3");
    p.polyfill("Object.values", function(g) {
        return g ? g : function(f) {
            var d = [],
                b;
            for (b in f) p.owns(f, b) && d.push(f[b]);
            return d
        }
    }, "es8", "es3");
    p.polyfill("Array.prototype.find", function(g) {
        return g ? g : function(f, d) {
            return p.findInternal(this, f, d).v
        }
    }, "es6", "es3");
    p.checkStringArgs = function(g, f, d) {
        if (null == g) throw new TypeError("The 'this' value for String.prototype." + d + " must not be null or undefined");
        if (f instanceof RegExp) throw new TypeError("First argument to String.prototype." + d + " must not be a regular expression");
        return g + ""
    };
    p.polyfill("String.prototype.startsWith", function(g) {
        return g ? g : function(f, d) {
            var b = p.checkStringArgs(this, f, "startsWith");
            f += "";
            var a = b.length,
                g = f.length;
            d = Math.max(0, Math.min(d | 0, b.length));
            for (var v = 0; v < g && d < a;)
                if (b[d++] != f[v++]) return !1;
            return v >= g
        }
    }, "es6", "es3");
    p.polyfill("String.prototype.repeat", function(g) {
        return g ? g : function(f) {
            var d = p.checkStringArgs(this, null, "repeat");
            if (0 > f || 1342177279 < f) throw new RangeError("Invalid count value");
            f |= 0;
            for (var b = ""; f;)
                if (f & 1 && (b += d), f >>>= 1) d += d;
            return b
        }
    }, "es6", "es3");
    p.stringPadding = function(g, f) {
        g = void 0 !== g ? String(g) : " ";
        return 0 < f && g ? g.repeat(Math.ceil(f / g.length)).substring(0, f) : ""
    };
    p.polyfill("String.prototype.padStart", function(g) {
        return g ? g : function(f, d) {
            var b = p.checkStringArgs(this, null, "padStart");
            return p.stringPadding(d, f - b.length) + b
        }
    }, "es8", "es3");
    p.FORCE_POLYFILL_PROMISE = !1;
    p.polyfill("Promise", function(g) {
        function f(a) {
            this.state_ = 0;
            this.result_ = void 0;
            this.onSettledCallbacks_ = [];
            var b = this.createResolveAndReject_();
            try {
                a(b.resolve, b.reject)
            } catch (L) {
                b.reject(L)
            }
        }


        function d() {
            this.batch_ = null
        }


        function b(a) {
            return a instanceof f ? a : new f(function(b) {
                b(a)
            })
        }
        if (g && !p.FORCE_POLYFILL_PROMISE) return g;
        d.prototype.asyncExecute = function(a) {
            null == this.batch_ && (this.batch_ = [], this.asyncExecuteBatch_());
            this.batch_.push(a);
            return this
        };
        d.prototype.asyncExecuteBatch_ = function() {
            var a =
                this;
            this.asyncExecuteFunction(function() {
                a.executeBatch_()
            })
        };
        var a = p.global.setTimeout;
        d.prototype.asyncExecuteFunction = function(b) {
            a(b, 0)
        };
        d.prototype.executeBatch_ = function() {
            for (; this.batch_ && this.batch_.length;) {
                var a = this.batch_;
                this.batch_ = [];
                for (var b = 0; b < a.length; ++b) {
                    var d = a[b];
                    a[b] = null;
                    try {
                        d()
                    } catch (M) {
                        this.asyncThrow_(M)
                    }
                }
            }
            this.batch_ = null
        };
        d.prototype.asyncThrow_ = function(a) {
            this.asyncExecuteFunction(function() {
                throw a;
            })
        };
        f.prototype.createResolveAndReject_ = function() {
            function a(a) {
                return function(f) {
                    d ||
                        (d = !0, a.call(b, f))
                }
            }
            var b = this,
                d = !1;
            return {
                resolve: a(this.resolveTo_),
                reject: a(this.reject_)
            }
        };
        f.prototype.resolveTo_ = function(a) {
            if (a === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
            else if (a instanceof f) this.settleSameAsPromise_(a);
            else {
                a: switch (typeof a) {
                    case "object":
                        var b = null != a;
                        break a;
                    case "function":
                        b = !0;
                        break a;
                    default:
                        b = !1
                }
                b ? this.resolveToNonPromiseObj_(a) : this.fulfill_(a)
            }
        };
        f.prototype.resolveToNonPromiseObj_ = function(a) {
            var b = void 0;
            try {
                b = a.then
            } catch (L) {
                this.reject_(L);
                return
            }
            "function" == typeof b ? this.settleSameAsThenable_(b, a) : this.fulfill_(a)
        };
        f.prototype.reject_ = function(a) {
            this.settle_(2, a)
        };
        f.prototype.fulfill_ = function(a) {
            this.settle_(1, a)
        };
        f.prototype.settle_ = function(a, b) {
            if (0 != this.state_) throw Error("Cannot settle(" + a + ", " + b + "): Promise already settled in state" + this.state_);
            this.state_ = a;
            this.result_ = b;
            this.executeOnSettledCallbacks_()
        };
        f.prototype.executeOnSettledCallbacks_ = function() {
            if (null != this.onSettledCallbacks_) {
                for (var a = 0; a < this.onSettledCallbacks_.length; ++a) m.asyncExecute(this.onSettledCallbacks_[a]);
                this.onSettledCallbacks_ = null
            }
        };
        var m = new d;
        f.prototype.settleSameAsPromise_ = function(a) {
            var b = this.createResolveAndReject_();
            a.callWhenSettled_(b.resolve, b.reject)
        };
        f.prototype.settleSameAsThenable_ = function(a, b) {
            var d = this.createResolveAndReject_();
            try {
                a.call(b, d.resolve, d.reject)
            } catch (M) {
                d.reject(M)
            }
        };
        f.prototype.then = function(a, b) {
            function d(a, b) {
                return "function" == typeof a ? function(b) {
                    try {
                        g(a(b))
                    } catch (xa) {
                        m(xa)
                    }
                } : b
            }
            var g, m, v = new f(function(a, b) {
                g = a;
                m = b
            });
            this.callWhenSettled_(d(a, g), d(b, m));
            return v
        };
        f.prototype.catch = function(a) {
            return this.then(void 0, a)
        };
        f.prototype.callWhenSettled_ = function(a, b) {
            function d() {
                switch (f.state_) {
                    case 1:
                        a(f.result_);
                        break;
                    case 2:
                        b(f.result_);
                        break;
                    default:
                        throw Error("Unexpected state: " + f.state_);
                }
            }
            var f = this;
            null == this.onSettledCallbacks_ ? m.asyncExecute(d) : this.onSettledCallbacks_.push(d)
        };
        f.resolve = b;
        f.reject = function(a) {
            return new f(function(b, d) {
                d(a)
            })
        };
        f.race = function(a) {
            return new f(function(d, f) {
                for (var g = p.makeIterator(a), m = g.next(); !m.done; m =
                    g.next()) b(m.value).callWhenSettled_(d, f)
            })
        };
        f.all = function(a) {
            var d = p.makeIterator(a),
                g = d.next();
            return g.done ? b([]) : new f(function(a, f) {
                function m(b) {
                    return function(d) {
                        v[b] = d;
                        q--;
                        0 == q && a(v)
                    }
                }
                var v = [],
                    q = 0;
                do v.push(void 0), q++, b(g.value).callWhenSettled_(m(v.length - 1), f), g = d.next(); while (!g.done)
            })
        };
        return f
    }, "es6", "es3");
    (function(g) {
        function f(b) {
            if (d[b]) return d[b].exports;
            var a = d[b] = {
                i: b,
                l: !1,
                exports: {}
            };
            g[b].call(a.exports, a, a.exports, f);
            a.l = !0;
            return a.exports
        }
        var d = {};
        f.m = g;
        f.c = d;
        f.d = function(b, a, d) {
            f.o(b, a) || Object.defineProperty(b, a, {
                enumerable: !0,
                get: d
            })
        };
        f.r = function(b) {
            p.initSymbol();
            p.initSymbol();
            "undefined" !== typeof Symbol && Symbol.toStringTag && (p.initSymbol(), Object.defineProperty(b, Symbol.toStringTag, {
                value: "Module"
            }));
            Object.defineProperty(b, "__esModule", {
                value: !0
            })
        };
        f.t = function(b, a) {
            a & 1 && (b = f(b));
            if (a & 8 || a & 4 && "object" === typeof b && b && b.__esModule) return b;
            var d = Object.create(null);
            f.r(d);
            Object.defineProperty(d, "default", {
                enumerable: !0,
                value: b
            });
            if (a & 2 && "string" != typeof b)
                for (var g in b) f.d(d, g, function(a) {
                    return b[a]
                }.bind(null, g));
            return d
        };
        f.n = function(b) {
            var a = b && b.__esModule ? function() {
                return b["default"]
            } : function() {
                return b
            };
            f.d(a, "a", a);
            return a
        };
        f.o = function(b, a) {
            return Object.prototype.hasOwnProperty.call(b, a)
        };
        f.p = "";
        return f(f.s = 0)
    })([function(g, f, d) {
        function b() {
            return Date.now() -
                ua - La
        }


        function a(a) {
            var c = a.shift();
            if (c) {
                var e = document.createElement("b");
                e.innerHTML = c;
                ha.appendChild(e);
                if (c.startsWith("POLL")) {
                    c = p.makeIterator(a.shift().split(",").map(function(e) {
                        return e.trim()
                    }));
                    var b = c.next().value,
                        h = c.next().value;
                    c = c.next().value;
                    c = "true" === c;
                    var d = Math.ceil((new Date(h.trim()) - Date.now()) / 36E5);
                    e.appendChild(document.createElement("br"));
                    h = document.createElement("small");
                    h.appendChild(document.createTextNode(0 < d ? "closing in " + d + " hour" + (1 === d ? "" : "s") : "closed"));
                    var I =
                        document.createElement("a");
                    I.href = "javascript:;";
                    I.innerText = "view all results";
                    c && h.appendChild(I);
                    e.appendChild(h);
                    ha.appendChild(document.createElement("br"));
                    e = document.createElement("table");
                    e.className = c ? "poll-table" : "poll-list";
                    h = document.createElement("tbody");
                    var t = function() {
                        var e = [],
                            a = [],
                            h = fetch("https://arras-lb.glitch.me/poll/" + b + "/status").then(function(e) {
                                return e.json()
                            }).then(function(e) {
                                if (!e.ok) throw Error("Poll does not exist!");
                                a = e.options
                            });
                        I.onclick = function() {
                            I.remove();
                            for (var a =
                                    p.makeIterator(e), h = a.next(); !h.done; h = a.next()) h = h.value, h.className = "", h.innerHTML = parseInt(h.title, 10), h.title = ""
                        };
                        var c = 0;
                        return function(x) {
                            function N(e) {
                                return (x ? x + " - " : "") + e + " vote" + (1 === e ? "" : "s")
                            }
                            var I = c++,
                                t = document.createElement("label");
                            t.className = "container";
                            var f = document.createElement("input");
                            f.tabIndex = -1;
                            f.className = "checkbox";
                            f.type = "checkbox";
                            f.disabled = !0;
                            h.then(function() {
                                var e = a[I] || {
                                        voted: !1,
                                        votes: 0
                                    },
                                    h = e.voted;
                                e = e.votes;
                                f.checked = h;
                                f.disabled = 0 >= d;
                                var c = e - h;
                                f.onchange = function() {
                                    fetch("https://alb.glitch.me/poll/" +
                                        b + "/set/" + I + "/" + f.checked);
                                    var e = c + (f.checked ? 1 : 0);
                                    x ? g.nodeValue = N(e) : t.title = N(e)
                                };
                                x ? g.nodeValue = N(e) : t.title = N(e)
                            });
                            if (x) {
                                var g = document.createTextNode(x);
                                t.appendChild(g)
                            }
                            t.appendChild(f);
                            var k = document.createElement("span");
                            k.className = "checkmark";
                            t.appendChild(k);
                            e.push(t);
                            return t
                        }
                    }();
                    a = p.makeIterator(a);
                    for (var f = a.next(); !f.done; f = a.next()) {
                        var g = f.value;
                        f = document.createElement("tr");
                        if (c) {
                            g = p.makeIterator(g.split("|"));
                            for (var k = g.next(); !k.done; k = g.next()) {
                                k = k.value;
                                k = k.trim();
                                var l = document.createElement("td");
                                if ("X" === k) l.appendChild(t());
                                else {
                                    var m = k.match(/^:*/)[0].length;
                                    l.colSpan = m + 1;
                                    l.innerHTML = k.slice(m)
                                }
                                f.appendChild(l)
                            }
                        } else k = document.createElement("td"), k.appendChild(t(g)), f.appendChild(k);
                        h.appendChild(f)
                    }
                    e.appendChild(h);
                    ha.appendChild(e)
                } else {
                    c = document.createElement("ul");
                    e = p.makeIterator(a);
                    for (h = e.next(); !h.done; h = e.next()) h = h.value, t = document.createElement("li"), t.innerHTML = h, c.appendChild(t);
                    ha.appendChild(c)
                }
                return !0
            }
        }


        function m() {
            return Math.max(c.screenWidth / r.renderv, c.screenHeight /
                r.renderv / 9 * 16)
        }


        function v(a) {
            this.speed = void 0 === a ? 200 : a;
            this.map = {};
            this.lastUpdate = Date.now()
        }


        function G() {
            dataLayer.push(arguments)
        }


        function L(a) {
            switch (a) {
                case 0:
                    return k.teal;
                case 1:
                    return k.lgreen;
                case 2:
                    return k.orange;
                case 3:
                    return k.yellow;
                case 4:
                    return k.lavender;
                case 5:
                    return k.pink;
                case 6:
                    return k.vlgrey;
                case 7:
                    return k.lgrey;
                case 8:
                    return k.guiwhite;
                case 9:
                    return k.black;
                case 10:
                    return k.blue;
                case 11:
                    return k.green;
                case 12:
                    return k.red;
                case 13:
                    return k.gold;
                case 14:
                    return k.purple;
                case 15:
                    return k.magenta;
                case 16:
                    return k.grey;
                case 17:
                    return k.dgrey;
                case 18:
                    return k.white;
                case 19:
                    return k.guiblack;
                case 20:
                    return 150 > Date.now() % 300 ? k.blue : k.red;
                case 21:
                    return 150 > Date.now() % 300 ? k.blue : k.grey;
                case 22:
                    return 150 > Date.now() % 300 ? k.grey : k.blue;
                case 23:
                    return 150 > Date.now() % 300 ? k.red : k.grey;
                case 24:
                    return 150 > Date.now() % 300 ? k.grey : k.red;
                default:
                    return "#FF0000"
            }
        }


        function M(a) {
            var c = D.graphical.neon ? k.white : k.black;
            return D.graphical.darkBorders ? c : ja(a, c, k.border)
        }


        function q(a) {
            switch (a) {
                case "bas1":
                case "bap1":
                case "dom1":
                    return k.blue;
                case "bas2":
                case "bap2":
                case "dom2":
                    return k.green;
                case "bas3":
                case "bap3":
                case "dom3":
                    return k.red;
                case "bas4":
                case "bap4":
                case "dom4":
                    return k.pink;
                case "domx":
                case "dom0":
                    return k.yellow;
                case "port":
                    return l.globalAlpha = 1, k.black;
                case "edge":
                    return ja(k.white, k.guiblack, 1 / 3);
                case "dor1":
                    return k.vlgrey;
                default:
                    return k.white
            }
        }


        function da(a, c) {
            D.graphical.neon ? (a.fillStyle = M(c), a.strokeStyle = c) : (a.fillStyle = c, a.strokeStyle = M(c))
        }


        function H(a, c) {
            c = void 0 === c ? U[a].color : c;
            var e = U[a];
            return {
                time: 0,
                index: a,
                x: e.x,
                y: e.y,
                vx: 0,
                vy: 0,
                size: e.size,
                realSize: e.realSize,
                color: c,
                render: {
                    status: {
                        getFade: function() {
                            return 1
                        },
                        getColor: function() {
                            return "#FFFFFF"
                        },
                        getBlend: function() {
                            return 0
                        },
                        health: {
                            get: function() {
                                return 1
                            }
                        },
                        shield: {
                            get: function() {
                                return 1
                            }
                        }
                    }
                },
                facing: e.facing,
                shape: e.shape,
                name: e.name,
                score: 0,
                tiggle: 0,
                layer: e.layer,
                guns: {
                    length: e.guns.length,
                    getPositions: function() {
                        return Array(e.guns.length).fill(0)
                    },
                    update: function() {}
                },
                turrets: e.turrets.map(function(a) {
                    var c = H(a.index);
                    c.realSize = c.realSize /
                        c.size * e.size * a.sizeFactor;
                    c.size = e.size * a.sizeFactor;
                    c.angle = a.angle;
                    c.offset = a.offset;
                    c.direction = a.direction;
                    c.facing = a.direction + a.angle;
                    return c
                })
            }
        }


        function A(a, c, e) {
            e = void 0 === e ? 3 : e;
            var b = Date.now(),
                h = a,
                x = a;
            return {
                set: function(e) {
                    a !== e && (x = h, a = e, b = Date.now())
                },
                get: function() {
                    var N = (Date.now() - b) / 1E3;
                    return h = N < c ? x + (a - x) * Math.pow(N / c, 1 / e) : a
                }
            }
        }


        function Ca(a) {
            try {
                var c = a.replace(/\s+/g, "");
                2 == c.length % 4 ? c += "==" : 3 == c.length % 4 && (c += "=");
                var e = atob(c);
                c = "Unknown Theme";
                var b = "",
                    h = e.indexOf("\x00");
                if (-1 === h) return null;
                c = e.slice(0, h);
                e = e.slice(h + 1);
                h = e.indexOf("\x00");
                if (-1 === h) return null;
                b = e.slice(0, h);
                e = e.slice(h + 1);
                var d = e.charCodeAt(0) / 255;
                e = e.slice(1);
                var I = Math.floor(e.length / 3);
                if (2 > I) return null;
                h = [];
                for (var f = 0; f < I; f++) {
                    var g = e.charCodeAt(3 * f),
                        t = e.charCodeAt(3 * f + 1),
                        k = e.charCodeAt(3 * f + 2);
                    h.push("#" + (g << 16 | t << 8 | k).toString(16).padStart(6, 0))
                }
                return {
                    name: c,
                    author: b,
                    content: {
                        teal: h[0],
                        lgreen: h[1],
                        orange: h[2],
                        yellow: h[3],
                        lavender: h[4],
                        pink: h[5],
                        vlgrey: h[6],
                        lgrey: h[7],
                        guiwhite: h[8],
                        black: h[9],
                        blue: h[10],
                        green: h[11],
                        red: h[12],
                        gold: h[13],
                        purple: h[14],
                        magenta: h[15],
                        grey: h[16],
                        dgrey: h[17],
                        white: h[18],
                        guiblack: h[19],
                        paletteSize: I,
                        border: d
                    }
                }
            } catch (eb) {}
            try {
                var l = JSON.parse(a);
                if ("object" !== typeof l) return null;
                for (var m = void 0 === l.name ? "Unknown Theme" : l.name, v = l.content, n = p.makeIterator([v.teal, v.lgreen, v.orange, v.yellow, v.lavender, v.pink, v.vlgrey, v.lgrey, v.guiwhite, v.black, v.blue, v.green, v.red, v.gold, v.purple, v.magenta, v.grey, v.dgrey, v.white, v.guiblack]), q = n.next(); !q.done; q = n.next())
                    if (!q.value.match(/^#[0-9a-fA-F]{6}$/)) return null;
                return {
                    isJSON: !0,
                    name: "string" === typeof m && m || "Unknown Theme",
                    author: "string" === typeof m ? m : "",
                    content: v
                }
            } catch (eb) {}
            return null
        }


        function xa(a) {
            var c = a.content,
                e = c.border;
            a = (void 0 === a.name ? "Unknown Theme" : a.name) + "\x00" + (void 0 === a.author ? "" : a.author) + "\x00" + String.fromCharCode(1 <= e ? 255 : 0 > e ? 0 : Math.floor(256 * e));
            c = p.makeIterator([c.teal, c.lgreen, c.orange, c.yellow, c.lavender, c.pink, c.vlgrey, c.lgrey, c.guiwhite, c.black, c.blue, c.green, c.red, c.gold, c.purple, c.magenta, c.grey, c.dgrey, c.white, c.guiblack]);
            for (e = c.next(); !e.done; e = c.next()) e = parseInt(e.value.slice(1), 16), a += String.fromCharCode(e >> 16, e >> 8 & 255, e & 255);
            return btoa(a).replace(/=+/, "")
        }


        function ea() {
            if (c.mobile) {
                var a = document.body;
                a.requestFullscreen ? a.requestFullscreen() : a.msRequestFullscreen ? a.msRequestFullscreen() : a.mozRequestFullScreen ? a.mozRequestFullScreen() : a.webkitRequestFullscreen && a.webkitRequestFullscreen()
            }
            P.submitToLocalStorage("optScreenshotMode");
            D.graphical.screenshotMode = document.getElementById("optScreenshotMode").checked;
            P.submitToLocalStorage("optFancy");
            D.graphical.pointy = !document.getElementById("optNoPointy").checked;
            P.submitToLocalStorage("optNoPointy");
            D.graphical.fancyAnimations = !document.getElementById("optFancy").checked;
            P.submitToLocalStorage("optShield");
            D.graphical.shieldbars = document.getElementById("optShield").checked;
            P.submitToLocalStorage("optBorders");
            switch (document.getElementById("optBorders").value) {
                case "normal":
                    D.graphical.darkBorders = D.graphical.neon = !1;
                    break;
                case "dark":
                    D.graphical.darkBorders = !0;
                    D.graphical.neon = !1;
                    break;
                case "glass":
                    D.graphical.darkBorders = !1;
                    D.graphical.neon = !0;
                    break;
                case "neon":
                    D.graphical.darkBorders = D.graphical.neon = !0
            }
            P.submitToLocalStorage("optColors");
            a = document.getElementById("optColors").value;
            if ("custom" === a) {
                var b = Ca(document.getElementById("optCustom").value);
                b && (Pa.custom = b.content, b.isJSON && (document.getElementById("optCustom").value = xa(b)))
            }
            P.submitToLocalStorage("optCustom");
            window.hereYaGoCuzImTooLazy = k = Pa[a] || k;
            a = document.getElementById("playerNameInput");
            P.submitToLocalStorage("playerNameInput");
            c.playerName = r.name = a.value;
            c.playerKey = "z" === c.server.id ? Qa : oa;
            c.screenWidth = window.innerWidth;
            c.screenHeight = window.innerHeight;
            document.getElementById("startMenuWrapper").style.top = "-600px";
            document.getElementById("gameAreaWrapper").style.opacity = 1;
            if (!c.socket) {
                a = "https:" === location.protocol ? 1 : -1;
                var e = (1 === (c.server.secure || a) ? "https://" : "http://") + c.server.at + "/mockups.json",
                    d = function() {
                        return P.pullJSON(e).then(function(a) {
                            U = a
                        }).catch(function(a) {
                            console.error(a);
                            setTimeout(function() {
                                return d()
                            }, 5E3)
                        })
                    };
                d();
                c.socket = gb()
            }
            c.animLoopHandle || Ra();
            fa.socket = c.socket;
            setInterval(function() {
                return Sa.iterate(c.socket.cmd.getMotion())
            }, 1E3 / 30);
            document.getElementById("gameCanvas").focus();
            c.isInGame = !0
        }


        function za(a, b) {
            l.fillStyle = a;
            l.globalAlpha = b;
            l.fillRect(0, 0, c.screenWidth, c.screenHeight);
            l.globalAlpha = 1
        }


        function R(a, c, e, b, h) {
            (void 0 === h ? 0 : h) ? l.strokeRect(a, c, e, b): l.fillRect(a, c, e, b)
        }


        function Ga(a, c, e, b) {
            b = void 0 === b ? !1 : b;
            l.beginPath();
            l.arc(a, c, e, 0, 2 * Math.PI,
                !1);
            l.closePath();
            b ? l.stroke() : l.fill()
        }


        function Ta(a, c, e, b) {
            l.beginPath();
            l.lineTo(Math.round(a) + .5, Math.round(c) + .5);
            l.lineTo(Math.round(e) + .5, Math.round(b) + .5);
            l.closePath();
            l.stroke()
        }


        function Q(a, c, e, b, h) {
            l.beginPath();
            l.lineTo(a, e);
            l.lineTo(c, e);
            l.lineWidth = b;
            l.strokeStyle = h;
            l.closePath();
            l.stroke()
        }


        function Ra() {
            c.animLoopHandle = window.requestAnimFrame(Ra);
            r.renderv += (r.view - r.renderv) / 30;
            l.lineCap = "round";
            l.lineJoin = "round";
            c.gameStart && !c.disconnected && (c.time = b(), 1E3 < c.time - Ua && (Ua = c.time,
                O.rendertime = Ha, Ha = 0, O.updatetime = pa, pa = 0), O.lag = c.time - r.time);
            c.gameStart ? hb(m()) : c.disconnected || ib();
            c.died && jb();
            c.disconnected && kb()
        }
        var Va = Function.bind.call(Function.call, Array.prototype.reduce),
            Wa = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable),
            Xa = Function.bind.call(Function.call, Array.prototype.concat),
            Ya = Reflect.ownKeys;
        Object.values || (Object.values = function(a) {
            return Va(Ya(a), function(c, e) {
                return Xa(c, "string" === typeof e && Wa(a, e) ? [a[e]] : [])
            }, [])
        });
        Object.entries ||
            (Object.entries = function(a) {
                return Va(Ya(a), function(c, e) {
                    return Xa(c, "string" === typeof e && Wa(a, e) ? [
                        [e, a[e]]
                    ] : [])
                }, [])
            });
        var c = d(1),
            P = d(2);
        g = d(3).blockAdBlock;
        window.dataLayer = window.dataLayer || [];
        G("js", new Date);
        G("config", "UA-120544149-1");
        g.on(!0, function() {
            G("event", "yes_adblock", {
                event_category: "adblock_detection",
                non_interaction: !0
            })
        }).on(!1, function() {
            G("event", "no_adblock", {
                event_category: "adblock_detection",
                non_interaction: !0
            })
        });
        var D = {
                graphical: {
                    screenshotMode: !1,
                    borderChunk: 6,
                    barChunk: 5,
                    mininumBorderChunk: 3,
                    darkBorders: !1,
                    fancyAnimations: !0,
                    colors: "normal",
                    pointy: !0,
                    fontSizeBoost: 1,
                    shieldbars: !1,
                    neon: !1
                },
                gui: {
                    expectedMaxSkillLevel: 9
                },
                lag: {
                    memory: 60
                }
            },
            ja = function() {
                return function(a, c, e) {
                    e = void 0 === e ? .5 : e;
                    if (1 === e) return c;
                    if (0 === e) return a;
                    for (var b = "#", h = 1; 6 >= h; h += 2) {
                        var d = parseInt(c.substr(h, 2), 16),
                            f = parseInt(a.substr(h, 2), 16);
                        for (d = Math.floor(f + (d - f) * e).toString(16); 2 > d.length;) d = "0" + d;
                        b += d
                    }
                    return b
                }
            }(),
            U = [];
        c.clickables = function() {
            var a = function() {
                function a() {
                    var a = 0,
                        c = 0,
                        h =
                        0,
                        b = 0,
                        d = !1;
                    return {
                        set: function(e, f, N, I) {
                            a = e;
                            c = f;
                            h = N;
                            b = I;
                            d = !0
                        },
                        check: function(e) {
                            var f = Math.round(e.x - a);
                            e = Math.round(e.y - c);
                            return d && 0 <= f && 0 <= e && f <= h && e <= b
                        },
                        hide: function() {
                            d = !1
                        }
                    }
                }
                return function(e) {
                    for (var c = [], h = 0; h < e; h++) c.push(a());
                    return {
                        place: function(a, e) {
                            for (var h = [], b = 1; b < arguments.length; ++b) h[b - 1] = arguments[b];
                            if (a >= c.length) throw console.log(a), console.log(c), Error("Trying to reference a clickable outside a region!");
                            c[a].set.apply(c[a], p.arrayFromIterable(h))
                        },
                        hide: function() {
                            for (var a =
                                    p.makeIterator(c), e = a.next(); !e.done; e = a.next()) e.value.hide()
                        },
                        check: function(a) {
                            return c.findIndex(function(e) {
                                return e.check(a)
                            })
                        }
                    }
                }
            }();
            return {
                stat: a(10),
                upgrade: a(9),
                hover: a(1),
                skipUpgrades: a(1)
            }
        }();
        c.statHover = !1;
        c.upgradeHover = !1;
        v.prototype.update = function(a) {
            this.lastUpdate = Date.now();
            for (var c = p.makeIterator(Object.entries(this.map)), e = c.next(); !e.done; e = c.next()) {
                var b = p.makeIterator(e.value);
                e = b.next().value;
                b = b.next().value;
                b.now ? (b.old = b.now, b.now = null) : delete this.map[e]
            }
            a = p.makeIterator(a);
            for (c = a.next(); !c.done; c = a.next()) c = c.value, this.map[c.id] ? this.map[c.id].now = c : this.map[c.id] = {
                old: null,
                now: c
            }
        };
        v.prototype.get = function() {
            var a = Math.min(1, (Date.now() - this.lastUpdate) / this.speed),
                c = 1 - a;
            return Object.values(this.map).map(function(e) {
                var b = e.old;
                return (e = e.now) ? b ? {
                    type: e.type,
                    id: e.id,
                    x: a * e.x + c * b.x,
                    y: a * e.y + c * b.y,
                    color: e.color,
                    size: a * e.size + c * b.size,
                    alpha: 1
                } : {
                    type: e.type,
                    id: e.id,
                    x: e.x,
                    y: e.y,
                    color: e.color,
                    size: e.size,
                    alpha: a
                } : {
                    type: b.type,
                    id: b.id,
                    x: b.x,
                    y: b.y,
                    color: b.color,
                    size: b.size,
                    alpha: c
                }
            })
        };
        var qa = [],
            Za = new v(200),
            Da = 0,
            Aa = c.messages = [],
            O = c.metrics = {
                latency: [],
                lag: 0,
                rendertime: 0,
                updatetime: 0,
                lastlag: 0,
                lastrender: 0,
                rendergap: 0,
                lastuplink: 0
            },
            Ua = 0,
            Ha = 0,
            pa = 0,
            Ia = {
                x: 0,
                y: 0
            },
            ka = [
                ["norm"]
            ],
            u = {
                getStatNames: function(a) {
                    switch (a) {
                        case 1:
                            return "Body Damage;Max Health;Bullet Speed;Bullet Health;Bullet Penetration;Bullet Damage;Engine Acceleration;Movement Speed;Shield Regeneration;Shield Capacity".split(";");
                        case 2:
                            return "Body Damage;Max Health;Drone Speed;Drone Health;Drone Penetration;Drone Damage;Respawn Rate;Movement Speed;Shield Regeneration;Shield Capacity".split(";");
                        case 3:
                            return "Body Damage;Max Health;Drone Speed;Drone Health;Drone Penetration;Drone Damage;Max Drone Count;Movement Speed;Shield Regeneration;Shield Capacity".split(";");
                        case 4:
                            return "Body Damage;Max Health;Swarm Speed;Swarm Health;Swarm Penetration;Swarm Damage;Reload;Movement Speed;Shield Regeneration;Shield Capacity".split(";");
                        case 5:
                            return "Body Damage;Max Health;Placement Speed;Trap Health;Trap Penetration;Trap Damage;Reload;Movement Speed;Shield Regeneration;Shield Capacity".split(";");
                        case 6:
                            return "Body Damage;Max Health;Weapon Speed;Weapon Health;Weapon Penetration;Weapon Damage;Reload;Movement Speed;Shield Regeneration;Shield Capacity".split(";");
                        default:
                            return "Body Damage;Max Health;Bullet Speed;Bullet Health;Bullet Penetration;Bullet Damage;Reload;Movement Speed;Shield Regeneration;Shield Capacity".split(";")
                    }
                },
                skills: [{
                        amount: 0,
                        color: "purple",
                        cap: 1,
                        softcap: 1
                    }, {
                        amount: 0,
                        color: "pink",
                        cap: 1,
                        softcap: 1
                    }, {
                        amount: 0,
                        color: "blue",
                        cap: 1,
                        softcap: 1
                    }, {
                        amount: 0,
                        color: "lgreen",
                        cap: 1,
                        softcap: 1
                    }, {
                        amount: 0,
                        color: "red",
                        cap: 1,
                        softcap: 1
                    }, {
                        amount: 0,
                        color: "yellow",
                        cap: 1,
                        softcap: 1
                    }, {
                        amount: 0,
                        color: "green",
                        cap: 1,
                        softcap: 1
                    }, {
                        amount: 0,
                        color: "teal",
                        cap: 1,
                        softcap: 1
                    },
                    {
                        amount: 0,
                        color: "gold",
                        cap: 1,
                        softcap: 1
                    }, {
                        amount: 0,
                        color: "orange",
                        cap: 1,
                        softcap: 1
                    }
                ],
                points: 0,
                upgrades: [],
                playerid: -1,
                __s: function() {
                    var a = 0,
                        c = 0,
                        e = 0,
                        b = A(0, 10);
                    return {
                        setScore: function(a) {
                            a ? (b.set(a), c > b.get() && (c = e = 0)) : (b = A(0, 10), e = 0)
                        },
                        update: function() {
                            a = Math.ceil(1.8 * Math.pow(e + 1, 1.8) - 2 * e + 1);
                            b.get() - c >= a && (c += a, e += 1)
                        },
                        getProgress: function() {
                            return a ? Math.min(1, Math.max(0, (b.get() - c) / a)) : 0
                        },
                        getScore: function() {
                            return b.get()
                        },
                        getLevel: function() {
                            return e
                        }
                    }
                }(),
                type: 0,
                fps: 0,
                color: 0,
                accel: 0,
                party: 0
            };
        c.clearUpgrades = function() {
            u.upgrades = []
        };
        var Ba = function() {
            function a(a, c, b) {
                a = void 0 === a ? "" : a;
                c = void 0 === c ? 0 : c;
                b = void 0 === b ? 0 : b;
                var e = 0,
                    h = A(0, 10);
                return {
                    update: function(a, c) {
                        e = a;
                        h.set(c)
                    },
                    publish: function() {
                        var d = U[e];
                        return {
                            image: H(e, b),
                            position: d.position,
                            barcolor: L(c),
                            label: "" === a ? d.name : a + " - " + d.name,
                            score: h.get()
                        }
                    }
                }
            }
            var c = {};
            return {
                get: function() {
                    var a = [],
                        b = 1,
                        h;
                    for (h in c)
                        if (c.hasOwnProperty(h)) {
                            var d = c[h].publish();
                            a.push(d);
                            d.score > b && (b = d.score)
                        } a.sort(function(a, c) {
                        return c.score - a.score
                    });
                    return {
                        data: a,
                        max: b
                    }
                },
                remove: function(a) {
                    if (void 0 === c["_" + a]) return console.log("Warning: Asked to removed an unknown leaderboard entry."), -1;
                    delete c["_" + a]
                },
                add: function(e) {
                    var b = a(e.name, e.barcolor, e.color);
                    b.update(e.index, e.score);
                    c["_" + e.id] = b
                },
                update: function(a) {
                    if (void 0 === c["_" + a.id]) return console.log("Warning: Asked to update an unknown leaderboard entry."), -1;
                    c["_" + a.id].update(a.index, a.score)
                },
                purge: function() {
                    c = {}
                }
            }
        }();
        c.target = Ia;
        c.canUpgrade = !1;
        c.canSkill = !1;
        c.message = "";
        c.time =
            0;
        localStorage.password && -1 === localStorage.password.toString().indexOf("$") && (localStorage.password = "", delete localStorage.password);
        var oa = localStorage.password || null,
            Qa = null;
        f = p.makeIterator(location.hash.match(/^#(?:([a-zA-Z]+)([0-9]*)|private=([^;]+)(?:;([^]*))?)$/) || []);
        f.next();
        var va = f.next().value;
        g = f.next().value;
        var ra = f.next().value;
        f = f.next().value;
        ra ? (g = "z-" + ra.toLowerCase().replace(/(\.[^\.]+)?\.[^\.]+$/, "").replace(/[^a-z0-9\-]/, "-"), c.servers[0].location = g, c.servers[0].at = ra, va = "z",
            Qa = f || null) : va ? c.partyLink = +g || 0 : va = "";
        c.server = c.servers.find(function(a) {
            return a.id === (va || localStorage.gameMode)
        });
        if (!c.server) {
            do c.server = c.servers[Math.floor(Math.random() * c.servers.length)]; while (c.server.visible < (oa ? 1 : 2))
        }
        var $a = document.getElementById("serverSelector");
        g = {};
        f = p.makeIterator(c.servers);
        for (var Ja = f.next(); !Ja.done; g = {
                tr: g.tr,
                server: g.server
            }, Ja = f.next())
            if (g.server = Ja.value, !(g.server.visible < (oa ? 1 : 2) && c.server !== g.server) && (g.tr = document.createElement("tr"), g.tr.appendChild(document.createElement("td")).textContent =
                    g.server.host, g.tr.appendChild(document.createElement("td")).textContent = g.server.region, g.tr.appendChild(document.createElement("td")).textContent = g.server.name, g.tr.onclick = function(a) {
                        return function() {
                            wa.className = "";
                            wa = a.tr;
                            wa.className = "selected";
                            c.server = a.server;
                            localStorage.gameMode = a.server.id;
                            location.hash = "#" + a.server.id + (c.partyLink ? c.partyLink.toString() : "")
                        }
                    }(g), $a.appendChild(g.tr), c.server === g.server)) {
                var wa = g.tr;
                wa.className = "selected";
                setTimeout(function(a) {
                    return function() {
                        $a.parentNode.parentNode.scrollTop =
                            a.tr.offsetTop - 30
                    }
                }(g))
            } var ha = document.getElementById("patchNotes");
        fetch("changelog.md", {
            cache: "no-cache"
        }).then(function(a) {
            return a.text()
        }).then(function(c) {
            var b = [];
            c = p.makeIterator(c.split("\n"));
            for (var e = c.next(); !e.done; e = c.next())
                if (e = e.value, 0 !== e.length) {
                    var d = e.charAt(0);
                    "#" === d ? (a(b) && (ha.appendChild(document.createElement("hr")), ha.appendChild(document.createElement("br"))), b = [e.slice(1).trim()]) : "-" === d ? b.push(e.slice(1).trim()) : b[b.length - 1] += " " + e.trim()
                } a(b)
        });
        window.onload = function() {
            P.retrieveFromLocalStorage("playerNameInput");
            P.retrieveFromLocalStorage("optScreenshotMode");
            P.retrieveFromLocalStorage("optShield");
            P.retrieveFromLocalStorage("optFancy");
            P.retrieveFromLocalStorage("optColors");
            P.retrieveFromLocalStorage("optNoPointy");
            P.retrieveFromLocalStorage("optBorders");
            P.retrieveFromLocalStorage("optCustom");
            "" === document.getElementById("optColors").value && (document.getElementById("optColors").value = "normal");
            "" === document.getElementById("optBorders").value && (document.getElementById("optBorders").value = "normal");
            var a =
                document.getElementById("optCustom");
            a.oninput = function() {
                (a.value ? Ca(a.value) : 1) ? a.classList.remove("error"): a.classList.add("error")
            };
            document.getElementById("startButton").onclick = function() {
                ea()
            };
            document.onkeydown = function(a) {
                (a.which || a.keyCode) !== c.KEY_ENTER || !c.dead && c.gameStart || ea()
            };
            window.addEventListener("resize", function() {
                r.screenWidth = fa.cv.width = c.screenWidth = window.innerWidth;
                r.screenHeight = fa.cv.height = c.screenHeight = window.innerHeight
            })
        };
        var fa = new(d(4)),
            l = fa.cv.getContext("2d"),
            ab = document.createElement("canvas").getContext("2d"),
            Z = [],
            ua = 0,
            La = 0,
            bb = function() {
                var a = [];
                return {
                    get: function() {
                        return a.length ? a.reduce(function(a, c) {
                            return a + c
                        }, 0) / a.length : 0
                    },
                    add: function(c) {
                        a.push(c);
                        a.length > D.lag.memory && a.splice(0, 1)
                    }
                }
            }(),
            r = {
                x: 0,
                y: 0,
                cx: 0,
                cy: 0,
                vx: 0,
                vy: 0,
                lastvx: 0,
                lastvy: 0,
                renderx: 0,
                rendery: 0,
                renderv: 1,
                lastx: 0,
                lasty: 0,
                target: fa.target,
                name: "",
                view: 1,
                lastUpdate: 0,
                time: 0
            };
        c.player = r;
        var Sa = function() {
                var a = 0,
                    b = 0,
                    e = 0,
                    d = 0;
                return {
                    reset: function() {
                        b = a = 0
                    },
                    get: function() {
                        return {
                            x: a,
                            y: b
                        }
                    },
                    iterate: function(h) {
                        if (c.died || c.gameStart) return 0;
                        var f = u.accel / u.topSpeed,
                            g = Math.sqrt(h.x * h.x + h.y * h.y);
                        e += u.accel * h.x / g;
                        d += u.accel * h.y / g;
                        h = Math.sqrt(e * e + d * d);
                        0 < h && f && (f = h / (f / 0 + 1), e = f * e / h, d = f * d / h);
                        a += e;
                        b += d
                    }
                }
            }(),
            gb = function() {
                window.WebSocket = window.WebSocket || window.MozWebSocket;
                var a = d(5),
                    f = function() {
                        var a = function() {
                            var a = 0,
                                c = [];
                            return {
                                next: function() {
                                    if (a >= c.length) throw console.log(c), Error("Trying to crawl past the end of the provided data!");
                                    return c[a++]
                                },
                                set: function(b) {
                                    c = b;
                                    a = 0
                                }
                            }
                        }();
                        return {
                            begin: function(c) {
                                return a.set(c)
                            },
                            data: function() {
                                var e = function() {
                                    function c() {
                                        var a = "normal",
                                            c = b();
                                        return {
                                            set: function(e) {
                                                if (e !== a || "injured" === a) "dying" !== a && (c = b()), a = e
                                            },
                                            getFade: function() {
                                                return "dying" === a || "killed" === a ? 1 - Math.min(1, (b() - c) / 300) : 1
                                            },
                                            getColor: function() {
                                                return "#FFFFFF"
                                            },
                                            getBlend: function() {
                                                var e = "normal" === a || "dying" === a ? 0 : 1 - Math.min(1, (b() - c) / 80);
                                                500 < b() - c && "injured" === a && (a = "normal");
                                                return e
                                            }
                                        }
                                    }
                                    var d = function() {
                                        function a(a) {
                                            a.isUpdated = !0;
                                            if (a.motion || a.position) a.motion -=
                                                .2 * a.position, a.position += a.motion, 0 > a.position && (a.position = 0, a.motion = -a.motion), 0 < a.motion && (a.motion *= .5)
                                        }
                                        return function(c) {
                                            for (var b = [], e = 0; e < c; e++) b.push({
                                                motion: 0,
                                                position: 0,
                                                isUpdated: !0
                                            });
                                            return {
                                                getPositions: function() {
                                                    return b.map(function(a) {
                                                        return a.position
                                                    })
                                                },
                                                update: function() {
                                                    return b.forEach(a)
                                                },
                                                fire: function(a, c) {
                                                    b[a].isUpdated && (b[a].motion += Math.sqrt(c) / 20);
                                                    b[a].isUpdated = !1
                                                },
                                                length: b.length
                                            }
                                        }
                                    }();
                                    return function(b) {
                                        b = void 0 === b ? {} : b;
                                        var h = null == b.facing,
                                            f = a.next();
                                        if (f & 1) b.facing =
                                            a.next(), b.layer = a.next();
                                        else {
                                            b.interval = O.rendergap;
                                            b.id = a.next();
                                            h = qa.findIndex(function(a) {
                                                return a.id === b.id
                                            }); - 1 !== h && (b = qa.splice(h, 1)[0]);
                                            h = -1 === h;
                                            h || (b.render.draws = !0, b.render.lastx = b.x, b.render.lasty = b.y, b.render.lastvx = b.vx, b.render.lastvy = b.vy, b.render.lastf = b.facing, b.render.lastRender = r.time);
                                            b.index = a.next();
                                            b.x = a.next();
                                            b.y = a.next();
                                            b.vx = a.next();
                                            b.vy = a.next();
                                            b.size = a.next();
                                            b.facing = a.next();
                                            b.vfacing = a.next();
                                            b.twiggle = a.next();
                                            b.layer = a.next();
                                            b.color = a.next();
                                            if (h) b.health = a.next() /
                                                255, b.shield = a.next() / 255;
                                            else {
                                                var g = b.health,
                                                    k = b.shield;
                                                b.health = a.next() / 255;
                                                b.shield = a.next() / 255;
                                                b.health < g || b.shield < k ? b.render.status.set("injured") : 1 !== b.render.status.getFade() && b.render.status.set("normal")
                                            }
                                            b.drawsHealth = !!(f & 2);
                                            b.alpha = a.next() / 255;
                                            f & 4 && (b.name = a.next(), b.score = a.next());
                                            b.nameplate = f & 4;
                                            h && (b.render = {
                                                draws: !1,
                                                expandsWithDeath: b.drawsHealth,
                                                lastRender: r.time,
                                                x: b.x,
                                                y: b.y,
                                                lastx: b.x - 1E3 / 30 * D.roomSpeed * O.rendergap * b.vx,
                                                lasty: b.y - 1E3 / 30 * D.roomSpeed * O.rendergap * b.vy,
                                                lastvx: b.vx,
                                                lastvy: b.vy,
                                                lastf: b.facing,
                                                f: b.facing,
                                                h: b.health,
                                                s: b.shield,
                                                interval: O.rendergap,
                                                slip: 0,
                                                status: c(),
                                                health: A(b.health, .5, 5),
                                                shield: A(b.shield, .5, 5)
                                            });
                                            b.render.health.set(b.health);
                                            b.render.shield.set(b.shield);
                                            h || b.oldIndex === b.index || (h = !0);
                                            b.oldIndex = b.index
                                        }
                                        f = a.next();
                                        if (h) b.guns = d(f);
                                        else if (f !== b.guns.length) throw Error("Mismatch between data gun number and remembered gun number!");
                                        for (g = 0; g < f; g++) {
                                            k = a.next();
                                            var l = a.next();
                                            k > r.lastUpdate - O.rendergap && b.guns.fire(g, l)
                                        }
                                        f = a.next();
                                        if (h)
                                            for (b.turrets = [], h = 0; h < f; h++) b.turrets.push(e());
                                        else {
                                            if (b.turrets.length !== f) throw Error("Mismatch between data turret number and remembered turret number!");
                                            b.turrets.forEach(e)
                                        }
                                        return b
                                    }
                                }();
                                return function() {
                                    for (var b = [], d = 0, f = a.next(); d < f; d++) b.push(e());
                                    qa.forEach(function(a) {
                                        a.render.status.set(1 === a.health ? "dying" : "killed");
                                        var e;
                                        if (e = 0 !== a.render.status.getFade()) {
                                            e = a.render.x - r.renderx;
                                            var h = a.render.y - r.rendery,
                                                d = a.size,
                                                f = !0;
                                            f = void 0 === f ? !1 : f;
                                            var g = m();
                                            d += D.graphical.borderChunk;
                                            f ? (g *= 2, e = e > -c.screenWidth /
                                                g - d && e < c.screenWidth / g + d && h > -c.screenHeight / g - d && h < c.screenHeight / g + d) : e = e > -d && e < c.screenWidth / g + d && h > -d && h < c.screenHeight / g + d
                                        }
                                        e && b.push(a)
                                    });
                                    qa = b;
                                    qa.sort(function(a, c) {
                                        var b = a.layer - c.layer;
                                        b || (b = c.id - a.id);
                                        return b
                                    })
                                }
                            }(),
                            gui: function() {
                                var b = a.next(),
                                    e = b & 2,
                                    d = b & 4,
                                    f = b & 8,
                                    g = b & 16,
                                    k = b & 32,
                                    l = b & 64,
                                    m = b & 128,
                                    v = b & 256;
                                b & 1 && (u.fps = a.next());
                                e && (u.type = a.next(), u.color = a.next(), u.playerid = a.next());
                                d && u.__s.setScore(a.next());
                                f && (u.points = a.next());
                                if (g)
                                    for (u.upgrades = [], b = 0, e = a.next(); b < e; b++) u.upgrades.push(a.next());
                                if (k)
                                    for (k = 9; 0 <= k; k--) u.skills[k].name = a.next(), u.skills[k].cap = a.next(), u.skills[k].softcap = a.next();
                                l && (l = parseInt(a.next(), 36), u.skills[0].amount = l / 68719476736 & 15, u.skills[1].amount = l / 4294967296 & 15, u.skills[2].amount = l / 268435456 & 15, u.skills[3].amount = l / 16777216 & 15, u.skills[4].amount = l / 1048576 & 15, u.skills[5].amount = l / 65536 & 15, u.skills[6].amount = l / 4096 & 15, u.skills[7].amount = l / 256 & 15, u.skills[8].amount = l / 16 & 15, u.skills[9].amount = l / 1 & 15);
                                m && (u.accel = a.next());
                                v && (u.party = a.next(), ra || (location.hash =
                                    "#" + c.server.id + (u.party || "")))
                            },
                            minimap: function() {
                                for (var b = [], e = a.next(); - 1 !== e;) b.push({
                                    type: e,
                                    id: a.next(),
                                    x: a.next() * c.gameWidth / 255,
                                    y: a.next() * c.gameHeight / 255,
                                    color: a.next(),
                                    size: e && a.next()
                                }), e = a.next();
                                Za.update(b)
                            },
                            leaderboard: function() {
                                var b = !1,
                                    c = a.next();
                                if (-1 === c) Ba.purge();
                                else
                                    for (var e = 0; e < c; e++) Ba.remove(a.next());
                                c = 0;
                                for (e = a.next(); c < e; c++) {
                                    var d = a.next();
                                    0 > d ? (d = {
                                        id: -d,
                                        score: a.next(),
                                        index: a.next(),
                                        name: a.next(),
                                        color: a.next(),
                                        barcolor: a.next()
                                    }, Ba.add(d)) : -1 === Ba.update({
                                        id: d,
                                        score: a.next(),
                                        index: a.next()
                                    }) && (b = !0)
                                }
                                return b
                            }
                        }
                    }();
                return function() {
                    var e = "https:" === location.protocol ? 1 : -1,
                        d = new WebSocket((1 === (c.server.secure || e) ? "wss://" : "ws://") + c.server.at + "/");
                    d.binaryType = "arraybuffer";
                    d.open = !1;
                    d.cmd = function() {
                        var a = !1,
                            b = [!1, !1, !1, !1, !1, !1, !1, !1];
                        return {
                            set: function(c, e) {
                                b[c] !== e && (b[c] = e, a = !0)
                            },
                            talk: function() {
                                a = !1;
                                for (var c = 0, e = 0; 8 > e; e++) b[e] && (c += Math.pow(2, e));
                                e = m();
                                d.talk("C", Math.round(fa.target.x / e), Math.round(fa.target.y / e), c)
                            },
                            check: function() {
                                return a
                            },
                            getMotion: function() {
                                return {
                                    x: b[3] -
                                        b[2],
                                    y: b[1] - b[0]
                                }
                            }
                        }
                    }();
                    d.talk = function(b) {
                        for (var c = [], e = 0; e < arguments.length; ++e) c[e - 0] = arguments[e];
                        if (!d.open) return 1;
                        d.send(a.encode(c))
                    };
                    d.onopen = function() {
                        function a() {
                            document.hasFocus() ? (d.cmd.check() && d.cmd.talk(), d.commandCycle = setTimeout(a)) : d.commandCycle = setTimeout(a, 1E3)
                        }
                        d.open = !0;
                        c.message = "";
                        c.playerKey ? d.talk("k", c.playerKey) : d.talk("k");
                        console.log("Token submitted to the server for validation.");
                        d.ping = function(a) {
                            d.talk("p", a)
                        };
                        a()
                    };
                    d.onmessage = function(e) {
                        e = a.decode(e.data);
                        if (-1 === e) throw Error("Malformed packet.");
                        switch (e.splice(0, 1)[0]) {
                            case "w":
                                e[0] ? (console.log("The server has welcomed us to the game room. Sending spawn request."), d.talk("s", c.playerName, c.partyLink), c.message = "") : (console.log("The server has rejected us."), e[1] && (c.message = e[1]));
                                c.socket.ping(b());
                                break;
                            case "R":
                                c.gameWidth = e[0];
                                c.gameHeight = e[1];
                                ka = JSON.parse(e[2]);
                                La = JSON.parse(e[3]);
                                D.roomSpeed = "string" === typeof e[4] ? e[5] : e[4];
                                console.log("Room data recieved. Commencing syncing process.");
                                d.talk("S", b());
                                break;
                            case "r":
                                c.gameWidth = e[0];
                                c.gameHeight = e[1];
                                ka = JSON.parse(e[2]);
                                console.log("Room data reset.");
                                break;
                            case "e":
                                break;
                            case "c":
                                r.cx = e[0];
                                r.cy = e[1];
                                r.view = e[2];
                                r.renderx = r.cx;
                                r.rendery = r.cy;
                                r.renderv = r.view;
                                console.log("Camera moved!");
                                break;
                            case "S":
                                var g = e[0];
                                e = e[1];
                                g = (b() - g) / 2;
                                e = b() - g - e;
                                Z.push({
                                    delta: e,
                                    latency: g
                                });
                                if (10 > Z.length) setTimeout(function() {
                                    d.talk("S", b())
                                }, 10), c.message = "Syncing clocks, please do not tab away. " + Z.length + "/10...";
                                else {
                                    Z.sort(function(a, b) {
                                        return a.latency -
                                            b.latency
                                    });
                                    var h = Z[Math.floor(Z.length / 2)].latency,
                                        k = 0,
                                        l = 0,
                                        m = 0;
                                    Z.forEach(function(a) {
                                        k += Math.pow(a.latency - h, 2)
                                    });
                                    k = Math.sqrt(k / Z.length);
                                    Z.forEach(function(a) {
                                        Math.abs(a.latency - h) < k && (l += a.delta, m++)
                                    });
                                    ua = Math.round(l / m);
                                    console.log(Z);
                                    console.log("Syncing complete, calculated clock difference " + ua + "ms. Beginning game.");
                                    c.gameStart = !0;
                                    c.message = ""
                                }
                                break;
                            case "m":
                                Aa.push({
                                    text: e[0],
                                    status: 2,
                                    alpha: 0,
                                    time: Date.now()
                                });
                                break;
                            case "u":
                                g = e[0];
                                var v = e[1],
                                    n = e[2],
                                    q = e[3],
                                    x = e[4],
                                    u = e[5];
                                e = e.slice(6);
                                g > r.lastUpdate ?
                                    (bb.add(b() - g), r.time = g + bb.get(), O.rendergap = g - r.lastUpdate, 0 >= O.rendergap && console.log("yo some bullshit is up wtf"), r.lastUpdate = g, f.begin(e), f.gui(), f.data(), r.lastx = r.cx, r.lasty = r.cy, r.lastvx = r.vx, r.lastvy = r.vy, r.cx = v, r.cy = n, r.vx = c.died ? 0 : x, r.vy = c.died ? 0 : u, isNaN(r.renderx) && (r.renderx = r.cx), isNaN(r.rendery) && (r.rendery = r.cy), Sa.reset(), r.view = q, r.renderv || (r.renderv = 2E3), O.lastlag = O.lag, O.lastuplink = b()) : console.log("Old data! Last given time: " + r.time + "; offered packet timestamp: " + g + ".");
                                d.talk("d",
                                    Math.max(r.lastUpdate, g));
                                d.cmd.talk();
                                pa++;
                                break;
                            case "b":
                                f.begin(e);
                                f.minimap();
                                f.leaderboard() && d.talk("z");
                                break;
                            case "p":
                                setTimeout(function() {
                                    return c.socket.ping(b())
                                }, 50);
                                16 <= O.latency.length && O.latency.shift();
                                e = b() - e[0];
                                0 < e && O.latency.push(e);
                                break;
                            case "F":
                                c.finalScore = A(0, 4);
                                c.finalScore.set(e[0]);
                                c.finalLifetime = A(0, 5);
                                c.finalLifetime.set(e[1]);
                                c.finalKills = [A(0, 3), A(0, 4.5), A(0, 2.5)];
                                c.finalKills[0].set(e[2]);
                                c.finalKills[1].set(e[3]);
                                c.finalKills[2].set(e[4]);
                                c.finalKillers = [];
                                for (g =
                                    0; g < e[5]; g++) c.finalKillers.push(e[6 + g]);
                                c.died = !0;
                                c.diedOn = Date.now();
                            case "K":
                                c.isInGame = !1;
                                break;
                            default:
                                throw Error("Unknown message index.");
                        }
                    };
                    d.onclose = function(a) {
                        d.open = !1;
                        c.disconnected = !0;
                        c.isInGame && (c.isInGame = !1, c.died || (c.message = "Socket closed. If you disconnected, respawn within 30 seconds to regain your score."));
                        console.log("WebSocket closed: ", a);
                        clearInterval(d.commandCycle)
                    };
                    d.onerror = function(a) {
                        console.log("WebSocket error: " + a);
                        c.message = "Socket error. Maybe another server will work.";
                        c.isInGame = !1
                    };
                    return d
                }
            }(),
            k = {
                teal: "#7ADBBC",
                lgreen: "#B9E87E",
                orange: "#E7896D",
                yellow: "#FDF380",
                lavender: "#B58EFD",
                pink: "#EF99C3",
                vlgrey: "#E8EBF7",
                lgrey: "#AA9F9E",
                guiwhite: "#FFFFFF",
                black: "#484848",
                blue: "#3CA4CB",
                green: "#8ABC3F",
                red: "#E03E41",
                gold: "#EFC74B",
                purple: "#8D6ADF",
                magenta: "#CC669C",
                grey: "#A7A7AF",
                dgrey: "#726F6F",
                white: "#DBDBDB",
                guiblack: "#000000",
                paletteSize: 10,
                border: .65
            },
            Pa = d(6),
            Ka = function() {
                var a = document.createElement("canvas").getContext("2d");
                if (a.measureText) {
                    if (a.measureText("test").emHeightAscent) return function(b,
                        c, e) {
                        e = void 0 === e ? !1 : e;
                        c += D.graphical.fontSizeBoost;
                        a.font = "bold " + c + "px Ubuntu";
                        b = a.measureText(b);
                        return e ? {
                            width: b.width,
                            height: b.emHeightAscent
                        } : b.width
                    };
                    console.log("Using semi mode!");
                    var b = document.createElement("div");
                    b.style.padding = "0";
                    b.style.margin = "0";
                    b.style.position = "absolute";
                    b.style.visibility = "hidden";
                    document.body.appendChild(b);
                    return function(c, e, d) {
                        e += D.graphical.fontSizeBoost;
                        if (void 0 === d ? 0 : d) return b.style.font = "bold " + e + "px Ubuntu", b.innerText = c, {
                            width: b.clientWidth,
                            height: b.clientHeight
                        };
                        a.font = "bold " + e + "px Ubuntu";
                        return a.measureText(c).width
                    }
                }
                console.log("Using full mode!");
                var c = document.createElement("div");
                c.style.padding = "0";
                c.style.margin = "0";
                c.style.position = "absolute";
                c.style.visibility = "hidden";
                document.body.appendChild(c);
                return function(a, b, e) {
                    b += D.graphical.fontSizeBoost;
                    c.style.font = "bold " + b + "px Ubuntu";
                    c.innerText = a;
                    return (void 0 === e ? 0 : e) ? {
                        width: c.clientWidth,
                        height: c.clientHeight
                    } : c.clientWidth
                }
            }(),
            n = function() {
                function a(a) {
                    a = void 0 === a ? null : a;
                    var b = !0;
                    return {
                        update: function(c) {
                            var e = !1;
                            if (null == a) e = !0;
                            else switch (typeof c !== typeof a && (e = !0), typeof c) {
                                case "number":
                                case "string":
                                    c !== a && (e = !0);
                                    break;
                                case "object":
                                    if (Array.isArray(c)) {
                                        if (c.length !== a.length) e = !0;
                                        else
                                            for (var d = 0, f = c.length; d < f; d++) c[d] !== a[d] && (e = !0);
                                        break
                                    }
                                default:
                                    throw console.log(c), Error("Unsupported type for a floppyvar!");
                            }
                            e && (b = !0, a = c)
                        },
                        publish: function() {
                            return a
                        },
                        check: function() {
                            return b ? (b = !1, !0) : !1
                        }
                    }
                }
                return function() {
                    var c = document.createElement("canvas").getContext("2d");
                    c.imageSmoothingEnabled = !1;
                    var b = [a(""), a(0), a(0), a(1), a("#FF0000"), a("left")];
                    b.map(function(a) {
                        return a.publish()
                    });
                    var d = 0,
                        f = 0;
                    return {
                        draw: function(a, e, g, h, m, v, n) {
                            v = void 0 === v ? "left" : v;
                            n = void 0 === n ? !1 : n;
                            h += D.graphical.fontSizeBoost;
                            b[0].update(a);
                            b[1].update(e);
                            b[2].update(g);
                            b[3].update(h);
                            b[4].update(m);
                            b[5].update(v);
                            if (b.some(function(a) {
                                    return a.check()
                                })) {
                                var q = Math.max(3, h / 5),
                                    r = Ka(a, h - D.graphical.fontSizeBoost, !0);
                                c.canvas.height = r.height + 2 * q;
                                c.canvas.width = r.width + 2 * q;
                                switch (v) {
                                    case "left":
                                        d = q;
                                        break;
                                    case "center":
                                        d =
                                            c.canvas.width / 2;
                                        break;
                                    case "right":
                                        d = c.canvas.width - q
                                }
                                f = c.canvas.height / 2;
                                c.lineWidth = q;
                                c.font = "bold " + h + "px Ubuntu";
                                c.textAlign = v;
                                c.textBaseline = "middle";
                                c.strokeStyle = k.black;
                                c.fillStyle = m;
                                c.lineCap = "round";
                                c.lineJoin = "round";
                                c.strokeText(a, d, f);
                                c.fillText(a, d, f)
                            }
                            l.drawImage(c.canvas, Math.round(e - d), Math.round(g - f * (n ? 1.05 : 1.5)))
                        }
                    }
                }
            }(),
            la = function() {
                return function(a, c, b, d, f, g, m, v, n, q, r) {
                    f = void 0 === f ? 1 : f;
                    g = void 0 === g ? 1 : g;
                    m = void 0 === m ? 0 : m;
                    v = void 0 === v ? !1 : v;
                    n = void 0 === n ? !1 : n;
                    q = void 0 === q ? !1 : q;
                    r = void 0 ===
                        r ? b.render : r;
                    var e = n || l,
                        h = q ? 1 : r.status.getFade();
                    g = g * d * b.size;
                    var u = U[b.index],
                        M = a,
                        G = c;
                    q = !1 === q ? b : q;
                    if (0 !== h && 0 !== f) {
                        r.expandsWithDeath && (g *= 1 + .5 * (1 - h));
                        if (n !== ab && (1 !== h || 1 !== f))
                            if (D.graphical.fancyAnimations) e = ab, e.canvas.width = e.canvas.height = g * u.position.axis + 20 * d, M = e.canvas.width / 2 - g * u.position.axis * u.position.middle.x * Math.cos(m) / 4, G = e.canvas.height / 2 - g * u.position.axis * u.position.middle.x * Math.sin(m) / 4, n = !1;
                            else if (.5 > h * f) return;
                        "object" !== typeof e && (e = l);
                        e.lineCap = "round";
                        e.lineJoin = "round";
                        if (q.turrets.length === u.turrets.length)
                            for (var x = 0; x < u.turrets.length; x++) {
                                var H = u.turrets[x];
                                if (0 === H.layer) {
                                    var t = H.direction + H.angle + m,
                                        A = H.offset * g;
                                    la(M + A * Math.cos(t), G + A * Math.sin(t), H, d, f, g / d / H.size * H.sizeFactor, q.turrets[x].facing + v * m, v, e, q.turrets[x], r)
                                }
                            } else throw Error("Mismatch turret number with mockup.");
                        q.guns.update();
                        e.lineWidth = Math.max(D.graphical.mininumBorderChunk, d * D.graphical.borderChunk);
                        da(e, ja(k.grey, r.status.getColor(), r.status.getBlend()));
                        if (q.guns.length === u.guns.length)
                            for (x =
                                q.guns.getPositions(), H = 0; H < u.guns.length; H++) {
                                var F = u.guns[H],
                                    C = x[H] / (1 === F.aspect ? 2 : 1);
                                t = e;
                                A = M + g * (F.offset * Math.cos(F.direction + F.angle + m) + (F.length / 2 - C) * Math.cos(F.angle + m));
                                var J = G + g * (F.offset * Math.sin(F.direction + F.angle + m) + (F.length / 2 - C) * Math.sin(F.angle + m));
                                C = g * (F.length / 2 - (1 === F.aspect ? 2 * C : 0));
                                var K = g * F.width / 2,
                                    S = F.aspect;
                                F = F.angle + m;
                                S = 0 < S ? [K * S, K] : [K, -K * S];
                                K = [Math.atan2(S[0], C), Math.atan2(S[1], C)];
                                C = [Math.sqrt(C * C + S[0] * S[0]), Math.sqrt(C * C + S[1] * S[1])];
                                t.beginPath();
                                t.lineTo(A + C[0] * Math.cos(F +
                                    K[0]), J + C[0] * Math.sin(F + K[0]));
                                t.lineTo(A + C[1] * Math.cos(F + Math.PI - K[1]), J + C[1] * Math.sin(F + Math.PI - K[1]));
                                t.lineTo(A + C[1] * Math.cos(F + Math.PI + K[1]), J + C[1] * Math.sin(F + Math.PI + K[1]));
                                t.lineTo(A + C[0] * Math.cos(F - K[0]), J + C[0] * Math.sin(F - K[0]));
                                t.closePath();
                                t.stroke();
                                t.fill()
                            } else throw Error("Mismatch gun number with mockup.");
                        e.globalAlpha = 1;
                        da(e, ja(L(b.color), r.status.getColor(), r.status.getBlend()));
                        a: {
                            b = e;x = M;H = G;t = g / u.size * u.realSize;J = u.shape;C = m;A = void 0;C = void 0 === C ? 0 : C;A = void 0 === A ? !0 : A;b.beginPath();
                            if (!J) b.arc(x, H, t, 0, 2 * Math.PI);
                            else if (J instanceof Array)
                                for (F = Math.cos(C), C = Math.sin(C), J = p.makeIterator(J), K = J.next(); !K.done; K = J.next()) S = p.makeIterator(K.value), K = S.next().value, S = S.next().value, b.lineTo(x + t * (K * F - S * C), H + t * (S * F + K * C));
                            else if ("string" === typeof J) {
                                J = new Path2D(J);
                                b.save();
                                b.translate(x, H);
                                b.scale(t, t);
                                b.lineWidth /= t;
                                b.rotate(C);
                                b.stroke(J);
                                A && b.fill(J);
                                b.restore();
                                break a
                            } else if (0 > J)
                                for (C += J % 2 ? 0 : Math.PI / J, D.graphical.pointy && (b.lineJoin = "miter"), F = 1 - 6 / J / J, J = -J, b.moveTo(x + t * Math.cos(C),
                                        H + t * Math.sin(C)), K = 0; K < J; K++) {
                                    S = (K + 1) / J * 2 * Math.PI;
                                    var Na = (K + .5) / J * 2 * Math.PI;
                                    b.quadraticCurveTo(x + t * F * Math.cos(Na + C), H + t * F * Math.sin(Na + C), x + t * Math.cos(S + C), H + t * Math.sin(S + C))
                                } else if (0 < J)
                                    for (C += J % 2 ? 0 : Math.PI / J, F = 0; F < J; F++) K = F / J * 2 * Math.PI, b.lineTo(x + t * Math.cos(K + C), H + t * Math.sin(K + C));b.closePath();b.stroke();A && b.fill();b.lineJoin = "round"
                        }
                        if (q.turrets.length === u.turrets.length)
                            for (b = 0; b < u.turrets.length; b++) x = u.turrets[b], 1 === x.layer && (H = x.direction + x.angle + m, t = x.offset * g, la(M + t * Math.cos(H), G + t * Math.sin(H),
                                x, d, f, g / d / x.size * x.sizeFactor, q.turrets[b].facing + v * m, v, e, q.turrets[b], r));
                        else throw Error("Mismatch turret number with mockup.");
                        n || e === l || (l.save(), l.globalAlpha = f * h, l.drawImage(e.canvas, a - M, c - G), l.restore())
                    }
                }
            }();
        window.requestAnimFrame = function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(a) {
                window.setTimeout(a, 1E3 / 60)
            }
        }();
        var hb = function() {
                function a() {
                    var a = [];
                    return function(b, c, e, d, f, g) {
                        for (a.push(b); a.length >
                            d;) a.splice(0, 1);
                        var h = Math.min.apply(Math, p.arrayFromIterable(a));
                        b = Math.max.apply(Math, p.arrayFromIterable(a));
                        var m = b - h;
                        0 < b && 0 > h && Q(c, c + d, e + f * b / m, 2, k.guiwhite);
                        l.beginPath();
                        l.moveTo(c, e + f * (b - a[0]) / m);
                        for (d = 1; d < a.length; d++) l.lineTo(c + d, e + f * (b - a[d]) / m);
                        l.lineWidth = 1;
                        l.strokeStyle = g;
                        l.stroke()
                    }
                }
                var d = A(0, .7, 1.5),
                    e = A(0, 2, 3),
                    f = function() {
                        return function() {
                            var a = 0,
                                c = 0;
                            return {
                                set: function(e, d) {
                                    e = void 0 === e ? r.time : e;
                                    d = void 0 === d ? O.rendergap : d;
                                    a = Math.max(b() - e - 80, -d);
                                    150 < a && 1E3 > a && (a = 150);
                                    1E3 < a && (a = 1E6 *
                                        Math.sin(a / 1E3 - 1) / a + 1E3);
                                    c = a / d
                                },
                                predict: function(b, e, d, f) {
                                    if (0 <= a) b = e + (e - b) * c;
                                    else {
                                        var g = Math.cos((1 + c) * Math.PI);
                                        b = .5 * (((1 + c) * d + b) * (g + 1) + (-c * f + e) * (1 - g))
                                    }
                                    return b
                                },
                                predictFacing: function(a, b) {
                                    var e = 2 * Math.PI;
                                    return a + (1 + c) * (((b - a + Math.PI) % e + e) % e - Math.PI)
                                },
                                getPrediction: function() {
                                    return a
                                }
                            }
                        }
                    }(),
                    g = a(),
                    m = a(),
                    v = a(),
                    M = function() {
                        for (var a = [], b = 0; b < 2 * D.gui.expectedMaxSkillLevel; b++) a.push(Math.log(b / D.gui.expectedMaxSkillLevel * 4 + 1) / Math.log(5));
                        return function(b) {
                            return a[b]
                        }
                    }(),
                    G = [n(), n(), n(), n(), n(),
                        n(), n(), n(), n(), n()
                    ],
                    da = [n(), n(), n(), n(), n(), n(), n(), n(), n(), n()],
                    fb = [n(), n(), n(), n(), n(), n(), n(), n(), n(), n()],
                    Y = n(),
                    xa = n(),
                    Ca = n(),
                    Z = n(),
                    ea = [n(), n(), n(), n(), n(), n()],
                    fa = n(),
                    ha = [n(), n(), n(), n(), n(), n(), n(), n(), n(), n()],
                    ma = [n(), n(), n(), n(), n(), n(), n(), n(), n()],
                    va = [n(), n(), n(), n(), n(), n()],
                    F = n();
                return function(a) {
                    var h = 0;
                    Ha++;
                    var x = Math.max(c.screenWidth, 16 * c.screenHeight / 9) / (1280 >= c.screenWidth ? 1280 : 1920 <= c.screenWidth ? 1920 : c.screenWidth),
                        t = f();
                    t.set();
                    h = t.getPrediction();
                    var A = t.predict(r.lastx, r.cx,
                        r.lastvx, r.vx);
                    t = t.predict(r.lasty, r.cy, r.lastvy, r.vy);
                    r.renderx = A;
                    r.rendery = t;
                    var C = a * r.renderx;
                    var ya = a * r.rendery;
                    za(k.white, 1);
                    za(k.guiblack, .1);
                    A = ka[0].length;
                    t = ka.length;
                    for (var N = 0; N < t; N++)
                        for (var w = ka[N], y = 0; y < A; y++) {
                            var z = Math.max(0, a * y * c.gameWidth / A - C + c.screenWidth / 2),
                                B = Math.max(0, a * N * c.gameHeight / t - ya + c.screenHeight / 2),
                                E = Math.min(c.screenWidth, a * (y + 1) * c.gameWidth / A - C + c.screenWidth / 2),
                                I = Math.min(c.screenHeight, a * (N + 1) * c.gameHeight / t - ya + c.screenHeight / 2);
                            l.globalAlpha = 1;
                            l.fillStyle = k.white;
                            l.fillRect(z, B, E - z, I - B);
                            l.globalAlpha = .3;
                            l.fillStyle = q(w[y]);
                            l.fillRect(z, B, E - z, I - B)
                        }
                    l.lineWidth = 1;
                    l.strokeStyle = k.guiblack;
                    l.globalAlpha = .04;
                    l.beginPath();
                    A = 30 * a;
                    for (t = (c.screenWidth / 2 - C) % A; t < c.screenWidth; t += A) l.moveTo(t, 0), l.lineTo(t, c.screenHeight);
                    for (t = (c.screenHeight / 2 - ya) % A; t < c.screenHeight; t += A) l.moveTo(0, t), l.lineTo(c.screenWidth, t);
                    l.stroke();
                    l.globalAlpha = 1;
                    r.x = r.y = null;
                    qa.forEach(function(b) {
                        if (!b.render.draws) return 1;
                        var e = f();
                        1 === b.render.status.getFade() ? e.set() : e.set(b.render.lastRender,
                            b.render.interval);
                        b.render.x = e.predict(b.render.lastx, b.x, b.render.lastvx, b.vx);
                        b.render.y = e.predict(b.render.lasty, b.y, b.render.lastvy, b.vy);
                        b.render.f = e.predictFacing(b.render.lastf, b.facing);
                        b.id === u.playerid && 0 === (b.twiggle & 1) && (b.render.f = Math.atan2(Ia.y, Ia.x), b.twiggle & 2 && (b.render.f += Math.PI));
                        e = a * b.render.x - C;
                        var d = a * b.render.y - ya;
                        e += c.screenWidth / 2;
                        d += c.screenHeight / 2;
                        b.id === u.playerid && (r.x = e, r.y = d);
                        la(e, d, b, a, b.id === u.playerid ? b.alpha ? .6 * b.alpha + .4 : .25 : b.alpha, 1.1, b.render.f, !1, !0)
                    });
                    D.graphical.screenshotMode || qa.forEach(function(b) {
                        var e = a * b.render.x - C,
                            d = a * b.render.y - ya;
                        e += c.screenWidth / 2;
                        d += c.screenHeight / 2;
                        var f = b.id === u.playerid ? 1 : b.alpha;
                        if (!(.05 > f)) {
                            var g = b.render.status.getFade();
                            g *= g;
                            l.globalAlpha = g;
                            var h = b.size * a,
                                m = U[b.index];
                            m = h / m.size * m.realSize;
                            if (b.drawsHealth) {
                                var v = b.render.health.get(),
                                    q = b.render.shield.get();
                                if (1 > v || 1 > q) {
                                    var t = d + 1.1 * m + 15;
                                    l.globalAlpha = f * f * g;
                                    D.graphical.shieldbars ? (Q(e - h, e + h, t, 6 + D.graphical.barChunk, k.black), q ? (Q(e - h, e - h + 2 * h * v, t + 1.5, 3, k.lgreen),
                                        l.globalAlpha *= .7, Q(e - h, e - h + 2 * h * q, t - 1.5, 3, k.teal)) : Q(e - h, e - h + 2 * h * v, t, 4, k.lgreen)) : (Q(e - h, e + h, t, 3 + D.graphical.barChunk, k.black), Q(e - h, e - h + 2 * h * v, t, 3, k.lgreen), q && (l.globalAlpha *= .3 + .3 * q, Q(e - h, e - h + 2 * h * q, t, 3, k.teal)));
                                    l.globalAlpha = g
                                }
                            }
                            b.nameplate && b.id !== u.playerid && (null == b.render.textobjs && (b.render.textobjs = [n(), n()]), g = b.name, h = k.guiwhite, g.startsWith("\u200b\u200b") && (g = g.slice(2), g.length && (h = ja(k.yellow, h, .125))), l.globalAlpha = f, b.render.textobjs[0].draw(g, e, d - m - 30, 16, h, "center"), b.render.textobjs[1].draw(P.handleLargeNumber(b.score,
                                !0), e, d - m - 16, 8, h, "center"), l.globalAlpha = 1)
                        }
                    });
                    if (!c.hideGui) {
                        A = function(a, b) {
                            c.screenWidth /= a;
                            c.screenHeight /= a;
                            l.scale(a, a);
                            b || (x *= a)
                        };
                        A(x, !0);
                        u.__s.update();
                        t = Ba.get();
                        N = t.max;
                        w = {};
                        if (c.showTree && (y = U.find(function(a) {
                                return "Basic" === a.name
                            }))) {
                            w.tiles = [];
                            w.measureSize = function(a) {
                                return function(b, c, e, d) {
                                    var f = d.index,
                                        g = void 0 === d.tier ? 0 : d.tier;
                                    a.tiles.push({
                                        x: b,
                                        y: c,
                                        colorIndex: e,
                                        index: f
                                    });
                                    e = U[f].upgrades;
                                    switch (g) {
                                        case 3:
                                            return {
                                                width: 1,
                                                height: 1
                                            };
                                        case 2:
                                            return e.forEach(function(e, d) {
                                                return a.measureSize(b,
                                                    c + 2 + d, d, e)
                                            }), {
                                                width: 1,
                                                height: 2 + e.length
                                            };
                                        case 1:
                                        case 0:
                                            return e = e.map(function(e, d) {
                                                e = a.measureSize(b, c + 2 * (e.tier - g), d, e);
                                                b += e.width;
                                                return e
                                            }), {
                                                width: e.map(function(a) {
                                                    return a.width
                                                }).reduce(function(a, b) {
                                                    return a + b
                                                }),
                                                height: 2 + Math.max.apply(Math, p.arrayFromIterable(e.map(function(a) {
                                                    return a.height
                                                })))
                                            }
                                    }
                                }
                            }(w);
                            y = w.measureSize(0, 0, 0, {
                                index: y.index
                            });
                            z = Math.min(.9 * c.screenWidth / y.width, .9 * c.screenHeight / y.height);
                            l.globalAlpha = .5;
                            l.fillStyle = k.guiwhite;
                            R(0, 0, c.screenWidth, c.screenHeight);
                            B = p.makeIterator(w.tiles);
                            for (E = B.next(); !E.done; E = B.next()) {
                                I = E.value;
                                var ia = I.colorIndex,
                                    ca = I.index;
                                E = c.screenWidth / 2 + (I.x - y.width / 2) * z + 2;
                                I = c.screenHeight / 2 + (I.y - y.height / 2) * z + 2;
                                var V = z - 4;
                                l.globalAlpha = 1;
                                l.fillStyle = L(ia + 10);
                                R(E, I, V, V);
                                l.globalAlpha = .2;
                                l.fillStyle = L(ia);
                                R(E, I, V, .6 * V);
                                l.fillStyle = k.black;
                                R(E, I + .6 * V, V, .4 * V);
                                l.globalAlpha = 1;
                                ia = -Math.PI / 4;
                                var na = H(ca, u.color);
                                ca = U[ca].position;
                                var Ea = .8 * V / ca.axis;
                                la(E + .5 * V - Ea * ca.middle.x * Math.cos(ia), I + .5 * V - Ea * ca.middle.x * Math.sin(ia), na, .5, 1, Ea / na.size * 2, ia, !0);
                                l.strokeStyle =
                                    k.black;
                                l.lineWidth = 2;
                                R(E, I, V, V, !0)
                            }
                            w = {
                                tiles: w.tiles,
                                measureSize: w.measureSize
                            }
                        }
                        c.mobile && A(1.4);
                        w = c.screenWidth / 2;
                        y = 20;
                        for (z = Aa.length - 1; 0 <= z; z--) B = Aa[z], E = B.text, null == B.textobj && (B.textobj = n()), null == B.len && (B.len = Ka(E, 14)), l.globalAlpha = .5 * B.alpha, Q(w - B.len / 2, w + B.len / 2, y + 9, 18, k.black), l.globalAlpha = Math.min(1, B.alpha), B.textobj.draw(E, w, y + 9, 14, k.guiwhite, "center", !0), y += 22, 1 < B.status && (y -= 22 * (1 - Math.sqrt(B.alpha))), 1 < B.status ? (B.status -= .05, B.alpha += .05) : 0 === z && (5 < Aa.length || 1E4 < Date.now() - B.time) &&
                            (B.status -= .05, B.alpha -= .05, 0 >= B.alpha && Aa.splice(0, 1));
                        l.globalAlpha = 1;
                        c.canSkill = 0 < u.points && u.skills.some(function(a) {
                            return a.amount < a.cap
                        });
                        d.set(0 + (c.canSkill || c.died || c.statHover));
                        c.clickables.stat.hide();
                        var T = 200,
                            ra = T,
                            W = -20 - 2 * T + d.get() * (40 + 2 * T),
                            X = c.screenHeight - 20 - 15,
                            sa = 11,
                            wa = u.getStatNames(U[u.type].statnames || -1);
                        u.skills.forEach(function(a) {
                            sa--;
                            var b = wa[sa - 1],
                                e = a.amount,
                                d = k[a.color],
                                f = a.softcap;
                            a = a.cap;
                            if (f) {
                                T = ra;
                                var g = D.gui.expectedMaxSkillLevel,
                                    h = f < a;
                                f > g && (g = f);
                                Q(W + 7.5, W - 7.5 + T * M(f),
                                    X + 7.5, 12 + D.graphical.barChunk, k.black);
                                Q(W + 7.5, W + 7.5 + (T - 35) * M(f), X + 7.5, 12, k.grey);
                                Q(W + 7.5, W + 7.5 + (T - 35) * M(e), X + 7.5, 11.5, d);
                                if (h)
                                    for (l.lineWidth = 1, l.strokeStyle = k.grey, h = f + 1; h < g; h++) Ta(W + (T - 35) * M(h), X + 1.5, W + (T - 35) * M(h), X - 3 + 15);
                                l.strokeStyle = k.black;
                                for (h = l.lineWidth = 1; h < e + 1; h++) Ta(W + (T - 35) * M(h), X + 1.5, W + (T - 35) * M(h), X - 3 + 15);
                                T = ra * M(g);
                                f = e === a ? d : !u.points || f !== a && e === f ? k.grey : k.guiwhite;
                                G[sa - 1].draw(b, Math.round(W + T / 2) + .5, X + 7.5, 10, f, "center", !0);
                                da[sa - 1].draw("[" + sa % 10 + "]", Math.round(W + T - 3.75) - 1.5, X + 7.5,
                                    10, f, "right", !0);
                                f === k.guiwhite && c.clickables.stat.place(sa - 1, W * x, X * x, T * x, 15 * x);
                                e && fb[sa - 1].draw(f === d ? "MAX" : "+" + e, Math.round(W + T + 4) + .5, X + 7.5, 10, d, "left", !0);
                                X -= 19
                            }
                        });
                        c.clickables.hover.place(0, 0, X * x, .8 * T * x, .8 * (c.screenHeight - X) * x);
                        0 !== u.points && Y.draw("x" + u.points, Math.round(W + T - 2) + .5, Math.round(X + 15 - 4) + .5, 20, k.guiwhite, "right");
                        c.mobile && A(1 / 1.4);
                        w = 25;
                        y = (c.screenWidth - 330) / 2;
                        z = c.screenHeight - 20 - w;
                        l.lineWidth = 1;
                        Q(y, y + 330, z + w / 2, w - 3 + D.graphical.barChunk, k.black);
                        Q(y, y + 330, z + w / 2, w - 3, k.grey);
                        Q(y, y + 330 *
                            u.__s.getProgress(), z + w / 2, w - 3.5, k.gold);
                        Z.draw("Level " + u.__s.getLevel() + " " + U[u.type].name, y + 165, z + w / 2, w - 4, k.guiwhite, "center", !0);
                        w = 14;
                        z -= w + 4;
                        Q(y + 33, y + 297, z + w / 2, w - 3 + D.graphical.barChunk, k.black);
                        Q(y + 33, y + 297, z + w / 2, w - 3, k.grey);
                        Q(y + 33, y + 330 * (.1 + .8 * (N ? Math.min(1, u.__s.getScore() / N) : 1)), z + w / 2, w - 3.5, k.green);
                        xa.draw("Score: " + P.formatLargeNumber(u.__s.getScore()), y + 165, z + w / 2, w - 2, k.guiwhite, "center", !0);
                        l.lineWidth = 4;
                        Ca.draw(r.name, Math.round(y + 165) + .5, Math.round(z - 10 - 4) + .5, 32, k.guiwhite, "center");
                        c.mobile &&
                            A(.8);
                        z = 200 / c.gameWidth * c.gameHeight;
                        w = c.screenWidth - 200 - 20;
                        y = c.screenHeight - z - 20;
                        B = ka[0].length;
                        E = ka.length;
                        I = 200 / B;
                        V = z / E;
                        for (ca = 0; ca < E; ca++)
                            for (ia = ka[ca], na = 0; na < B; na++) l.globalAlpha = .6, l.fillStyle = q(ia[na]), R(w + na * I, y + ca * V, I, V);
                        l.globalAlpha = .3;
                        l.fillStyle = ja(k.grey, k.vlgrey);
                        R(w, y, 200, z);
                        B = p.makeIterator(Za.get());
                        for (E = B.next(); !E.done; E = B.next()) E = E.value, l.fillStyle = ja(L(E.color), k.black, .3), l.globalAlpha = E.alpha, 2 === E.type ? R(w + (E.x - E.size) / c.gameWidth * 200 - .4, y + (E.y - E.size) / c.gameWidth * 200 -
                            1, 2 * E.size / c.gameWidth * 200 + .2, 2 * E.size / c.gameWidth * 200 + .2) : 1 === E.type ? Ga(w + E.x / c.gameWidth * 200, y + E.y / c.gameWidth * 200, E.size / c.gameWidth * 200 + .2) : E.id !== u.playerid && Ga(w + E.x / c.gameWidth * 200, y + E.y / c.gameWidth * 200, 2);
                        l.fillStyle = k.black;
                        l.globalAlpha = 1;
                        Ga(w + r.cx / c.gameWidth * 200, y + r.cy / c.gameWidth * 200, 2);
                        l.lineWidth = 3;
                        l.strokeStyle = k.black;
                        R(w, y, 200, z, !0);
                        z = y - 10;
                        B = O.latency.reduce(function(a, b) {
                            return a + b
                        }, 0) / O.latency.length;
                        c.showDebug && (R(w, y - 40, 200, 30), g(h, w, y - 40, 200, 30, k.yellow), v(O.rendergap, w, y -
                            40, 200, 30, k.pink), m(B, w, y - 40, 200, 30, k.teal), z -= 40);
                        c.showDebug ? (ea[5].draw("Arras.io", w + 200, z - 70 - 2, 15, k.guiwhite, "right"), ea[4].draw("Prediction: " + Math.round(h) + "ms", w + 200, z - 56, 10, k.guiwhite, "right"), ea[3].draw("Update Rate: " + O.updatetime + "Hz", w + 200, z - 42, 10, k.guiwhite, "right")) : ea[5].draw("Arras.io", w + 200, z - 42 - 2, 15, k.guiwhite, "right");
                        ea[2].draw("Client Speed: " + O.rendertime + " FPS", w + 200, z - 28, 10, 10 < O.rendertime ? k.guiwhite : k.orange, "right");
                        ea[1].draw("Server Speed: " + (100 * u.fps).toFixed(2) + "%",
                            w + 200, z - 14, 10, 1 === u.fps ? k.guiwhite : k.orange, "right");
                        ea[0].draw(B.toFixed(1) + " ms  " + c.server.location + " :" + c.server.type + ":", w + 200, z, 10, k.guiwhite, "right");
                        c.mobile && A(1.25);
                        c.mobile && A(1.4);
                        h = c.screenWidth - 200 - 20;
                        w = 48;
                        fa.draw("Leaderboard", Math.round(h + 100) + .5, Math.round(w - 10) + .5, 18, k.guiwhite, "center");
                        for (y = 0; y < t.data.length && (!c.mobile || 6 > y); y++) z = t.data[y], Q(h, h + 200, w + 7, 11 + D.graphical.barChunk, k.black), Q(h, h + 200, w + 7, 11, k.grey), Q(h, h + 200 * Math.min(1, z.score / N), w + 7, 10.5, z.barcolor), ha[y].draw(z.label +
                            ": " + P.handleLargeNumber(Math.round(z.score)), h + 100, w + 7, 9, k.guiwhite, "center", !0), B = 14 / z.position.axis, la(h - 21 - B * z.position.middle.x * .707, w + 7 + B * z.position.middle.x * .707, z.image, 1 / B, 1, B * B / z.image.size, -Math.PI / 4, !0), w += 18;
                        c.mobile && A(1 / 1.4);
                        e.set(0 + (c.canUpgrade || c.upgradeHover));
                        var ta = e.get();
                        c.clickables.upgrade.hide();
                        if (0 < u.upgrades.length) {
                            c.canUpgrade = !0;
                            var aa = 40 * ta - 20,
                                ba = 20,
                                ua = aa,
                                Ma = 0,
                                Fa = ba,
                                Oa = 0;
                            Da += .01;
                            var oa = 0,
                                pa = 0;
                            u.upgrades.forEach(function(a) {
                                ba > Fa && (Fa = ba);
                                Ma = aa;
                                c.clickables.upgrade.place(pa++,
                                    aa * x, ba * x, 100 * x, 100 * x);
                                l.globalAlpha = .5;
                                l.fillStyle = L(oa + 10);
                                R(aa, ba, 100, 100);
                                l.globalAlpha = .1;
                                l.fillStyle = L(oa);
                                oa++;
                                R(aa, ba, 100, 60);
                                l.fillStyle = k.black;
                                R(aa, ba + 60, 100, 40);
                                l.globalAlpha = 1;
                                var b = H(a, u.color);
                                a = U[a].position;
                                var e = 60 / a.axis;
                                la(aa + 50 - e * a.middle.x * Math.cos(Da), ba + 50 - e * a.middle.x * Math.sin(Da), b, 1, 1, e / b.size, Da, !0);
                                ma[pa - 1].draw(b.name, aa + 45, ba + 100 - 6, 9.5, k.guiwhite, "center");
                                (b = "yuihjk".charAt(Oa)) && va[pa - 1].draw("[" + b + "]", aa + 100 - 4, ba + 100 - 6, 9.5, k.guiwhite, "right");
                                l.strokeStyle = k.black;
                                l.globalAlpha = 1;
                                l.lineWidth = 3;
                                R(aa, ba, 100, 100, !0);
                                0 !== ++Oa % 3 || c.mobile ? aa += 114 * ta : (aa = ua, ba += 114)
                            });
                            h = Ka("Don't Upgrade", 11) + 10;
                            t = (Ma + 100 + 14 + ua - 15) / 2;
                            N = Fa + 100 + 14;
                            Q(t - h / 2, t + h / 2, N + 7, 14 + D.graphical.barChunk, k.black);
                            Q(t - h / 2, t + h / 2, N + 7, 14, k.white);
                            F.draw("Don't Upgrade", t, N + 7, 12, k.guiwhite, "center", !0);
                            c.clickables.skipUpgrades.place(0, (t - h / 2) * x, N * x, h * x, 14 * x)
                        } else c.canUpgrade = !1, c.clickables.upgrade.hide(), c.clickables.skipUpgrades.hide();
                        A(1 / x, !0)
                    }
                    O.lastrender = b()
                }
            }(),
            jb = function() {
                function a() {
                    return c.finalKillers.length ?
                        "\ud83d\udd2a Succumbed to " + c.finalKillers.map(function(a) {
                            return P.addArticle(U[a].name)
                        }).join(" and ") + "." : "\ud83e\udd37 Well that was kinda dumb huh"
                }


                function b() {
                    var a = [Math.round(c.finalKills[0].get()), Math.round(c.finalKills[1].get()), Math.round(c.finalKills[2].get())],
                        b = a[0] + .5 * a[1] + 3 * a[2],
                        e = (0 === b ? "\ud83c\udf3c" : 4 > b ? "\ud83c\udfaf" : 8 > b ? "\ud83d\udca5" : 15 > b ? "\ud83d\udca2" : 25 > b ? "\ud83d\udd25" : 50 > b ? "\ud83d\udca3" : 75 > b ? "\ud83d\udc7a" : 100 > b ? "\ud83c\udf36\ufe0f" : "\ud83d\udcaf") + " ";
                    if (0 === b) return e +
                        "A true pacifist";
                    b = [];
                    a[0] && b.push(a[0] + " kills");
                    a[1] && b.push(a[1] + " assists");
                    a[2] && b.push(a[2] + " visitors defeated");
                    return e + b.join(" and ")
                }
                var e = n(),
                    d = n(),
                    f = n(),
                    g = n(),
                    m = n(),
                    l = n(),
                    v = n();
                return function() {
                    za(k.black, .25);
                    var h = c.screenWidth / 2,
                        q = c.screenHeight / 2 - 50,
                        n = H(u.type, u.color),
                        t = U[u.type].position,
                        r = 140 / t.axis;
                    la(c.screenWidth / 2 - r * t.middle.x * .707 - 190 - 70, c.screenHeight / 2 - 35 + r * t.middle.x * .707 - 10, n, 1.5, 1, .5 * r / n.realSize, -Math.PI / 4, !0);
                    e.draw("lol you died", h, q - 80, 8, k.guiwhite, "center");
                    d.draw("Level " +
                        u.__s.getLevel() + " " + U[u.type].name + ".", h - 170, q - 30, 24, k.guiwhite);
                    f.draw("Final score: " + P.formatLargeNumber(Math.round(c.finalScore.get())), h - 170, q + 25, 50, k.guiwhite);
                    g.draw("\u231a Survived for " + P.timeForHumans(Math.round(c.finalLifetime.get())) + ".", h - 170, q + 55, 16, k.guiwhite);
                    m.draw(b(), h - 170, q + 77, 16, k.guiwhite);
                    l.draw(a(), h - 170, q + 99, 16, k.guiwhite);
                    n = Math.ceil((c.diedOn + 3E3 - Date.now()) / 1E3);
                    v.draw(0 < n ? "You may respawn in " + n + " second" + (1 === n ? "" : "s") + "." : c.mobile ? "Tap to respawn!" : "Press enter to respawn!",
                        h, q + 125, 16, k.guiwhite, "center")
                }
            }();
        window.onbeforeunload = function() {
            return c.isInGame && !c.died ? !0 : null
        };
        window.$createProfile = function() {
            var a = n(),
                b = n();
            return function(c, d, f, g) {
                d = void 0 === d ? -1 : d;
                f = void 0 === f ? 200 : f;
                g = void 0 === g ? -Math.PI / 4 : g;
                var e = l.canvas.width,
                    h = l.canvas.height,
                    m = l.canvas.width = f;
                f = l.canvas.height = f; - 1 === d ? l.clearRect(0, 0, m, f) : (l.fillStyle = k.white, l.fillRect(0, 0, m, f), l.globalAlpha = .5, l.fillStyle = L(d + 10), R(0, 0, m, f), l.globalAlpha = .1, l.fillStyle = L(d), R(0, 0, m, .6 * f), l.fillStyle = k.black,
                    R(0, .6 * f, m, .4 * f), l.globalAlpha = 1);
                var v = H(c, u.color);
                c = U[c].position;
                var q = .6 * m / c.axis;
                la(.5 * m - q * c.middle.x * Math.cos(g), .5 * f - q * c.middle.x * Math.sin(g), v, 1, 1, q / v.size, g, !0); - 1 !== d && (a.draw(v.name, .9 * m / 2, f - 6, f / 8 - 3, k.guiwhite, "center"), (d = "yuihjk".charAt(i)) && b.draw("[" + d + "]", m - 4, f - 6, f / 8 - 3, k.guiwhite, "right"), l.strokeStyle = k.black, l.globalAlpha = 1, l.lineWidth = 3, R(0, 0, m, f, !0));
                m = l.canvas.toDataURL();
                l.canvas.width = e;
                l.canvas.height = h;
                return m
            }
        }();
        var ib = function() {
                var a = n(),
                    b = n();
                return function() {
                    za(k.white,
                        .5);
                    a.draw("Connecting...", c.screenWidth / 2, c.screenHeight / 2, 30, k.guiwhite, "center");
                    b.draw(c.message, c.screenWidth / 2, c.screenHeight / 2 + 30, 15, k.lgreen, "center")
                }
            }(),
            kb = function() {
                var a = n(),
                    b = n();
                return function() {
                    za(ja(k.red, k.guiblack, .3), .25);
                    a.draw("\ud83d\udc80 Disconnected \ud83d\udc80", c.screenWidth / 2, c.screenHeight / 2, 30, k.guiwhite, "center");
                    b.draw(c.message, c.screenWidth / 2, c.screenHeight / 2 + 30, 15, k.orange, "center")
                }
            }(),
            cb = c.mobile ? 0 : Math.max(0, 1 - Math.abs(Date.now() - new Date(2018, 11, 25)) / 15E8);
        if (cb) {
            var Y = document.createElement("canvas");
            Y.style.position = "absolute";
            Y.style.top = "0";
            document.body.insertBefore(Y, document.body.firstChild);
            var ma = Y.getContext("2d"),
                ta = [],
                db = function() {
                    Y.width !== window.innerWidth && (Y.width = window.innerWidth);
                    Y.height !== window.innerHeight && (Y.height = window.innerHeight);
                    ma.clearRect(0, 0, Y.width, Y.height);
                    ma.fillStyle = "#ffffff";
                    for (var a = p.makeIterator(ta), b = a.next(); !b.done; b = a.next()) {
                        b = b.value;
                        b.x += 5 / b.r + Math.random();
                        b.y += 12.5 / b.r + Math.random();
                        var e = 2 * Math.min(.4,
                            .9 - b.y / Y.height);
                        0 < e ? (ma.globalAlpha = e, ma.beginPath(), ma.arc(b.x, b.y, b.r, 0, 2 * Math.PI), ma.fill()) : b.gone = !0
                    }
                    cb > Math.random() && ta.push({
                        x: Y.width * (1.5 * Math.random() - .5),
                        y: -50 - 100 * Math.random(),
                        r: 2 + Math.random() * Math.random() * 4
                    });
                    c.gameStart ? Y.remove() : requestAnimFrame(db)
                };
            setInterval(function() {
                ta = ta.filter(function(a) {
                    return !a.gone
                })
            }, 2E3);
            db()
        }
    }, function(g) {
        var f = {
            openshift: function(d, b) {
                return d + "-" + b + ".1d35.starter-us-east-1.openshiftapps.com"
            },
            glitch: function(d) {
                return "arras-n-" + d + ".glitch.me"
            },
            heroku: function(d) {
                return "arras-" + d + ".herokuapp.com"
            },
            wedeploy: function(d) {
                return d + "-moxncet.wedeploy.io"
            },
            arras: function(d) {
                return "ip-" + d + ".arras.io:5000"
            }
        };
        g.exports = {
            KEY_TOGGLEUI: 8,
KEY_ESC: 27,
            KEY_ENTER: 13,
            KEY_CHAT: 13,
            KEY_FIREFOOD: 119,
            KEY_SPLIT: 32,
            KEY_LEFT: 65,
            KEY_UP: 87,
            KEY_RIGHT: 68,
            KEY_DOWN: 83,
            KEY_LEFT_ARROW: 37,
            KEY_UP_ARROW: 38,
            KEY_RIGHT_ARROW: 39,
            KEY_DOWN_ARROW: 40,
            KEY_AUTO_SPIN: 67,
            KEY_AUTO_FIRE: 69,
            KEY_OVER_RIDE: 82,
            KEY_REVERSE_MOUSE: 66,
            KEY_REVERSE_TANK: 86,
            KEY_RECORD: 90,
            KEY_UPGRADE_ATK: 49,
            KEY_UPGRADE_HTL: 50,
            KEY_UPGRADE_SPD: 51,
            KEY_UPGRADE_STR: 52,
            KEY_UPGRADE_PEN: 53,
            KEY_UPGRADE_DAM: 54,
            KEY_UPGRADE_RLD: 55,
            KEY_UPGRADE_MOB: 56,
            KEY_UPGRADE_RGN: 57,
            KEY_UPGRADE_SHI: 48,
            KEY_MOUSE_0: 32,
            KEY_MOUSE_1: 86,
            KEY_MOUSE_2: 16,
            KEY_CHOOSE_1: 89,
            KEY_CHOOSE_2: 85,
            KEY_CHOOSE_3: 73,
            KEY_CHOOSE_4: 72,
            KEY_CHOOSE_5: 74,
            KEY_CHOOSE_6: 75,
            KEY_LEVEL_UP: 78,
            KEY_FUCK_YOU: 192,
        KEY_BASIC: 66,
        KEY_ULT: 18,
            KEY_KILL_YOURSELF: 79,
            KEY_UPGRADE_MAX: 77,
            KEY_PING: 76,
            KEY_CLASS_TREE: 220,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            gameWidth: 0,
            gameHeight: 0,
            xoffset: -0,
            yoffset: -0,
            gameStart: !1,
            disconnected: !1,
            died: !1,
            kicked: !1,
            continuity: !1,
            startPingTime: 0,
            toggleMassState: 0,
            backgroundColor: "#f2fbff",
            lineColor: "#000000",
            showDebug: !1,
            showTree: !1,
            server: null,
            servers: [{
                    visible: 0,
                    id: "z",
                    host: "Oreigdor",
                    region: "US East",
                    type: "ovw",
                    name: "Oreigdors Arras Io",
                    location: "z-unknown",
                    at: f.glitch("oreigdors-arras-io")
                }, {
                    visible: 0,
                    id: "x",
                    host: "Local",
                    region: "Local",
                    type: "unk",
                    name: "Localhost",
                    location: "x-local",
                    at: "localhost:8080",
                    secure: -1
                }, {
                    visible: 0,
                    id: "p",
                    host: "OpenShift",
                    region: "US East",
                    type: "unk",
                    name: "Maze Mothership",
                    location: "os-virginia",
                    at: f.arras("p"),
                    secure: -1
                }, {
                    visible: 2,
                    id: "ga",
                    host: "Glitch",
                    region: "US East",
                    type: "ffa",
                    name: "FFA",
                    location: "glitch-virginia",
                    at: f.glitch("ga")
                }, {
                    visible: 2,
                    id: "gb",
                    host: "Glitch",
                    region: "US East",
                    type: "4tdm",
                    name: "4TDM",
                    location: "glitch-virginia",
                    at: f.glitch("gb")
                }, {
                    visible: 0,
                    id: "gf",
                    host: "Glitch",
                    region: "US East",
                    type: "3dom",
                    name: "3 Team Maze Domination",
                    location: "glitch-virginia",
                    at: f.glitch("gf")
                }, {
                    visible: 0,
                    id: "gm",
                    host: "Glitch",
                    region: "US East",
                    type: "2mot",
                    name: "Maze Mothership",
                    location: "glitch-virginia",
                    at: f.glitch("gm")
                }, {
                    visible: 1,
                    id: "c",
                    host: "Glitch",
                    region: "US East",
                    type: "unk",
                    name: "Private",
                    location: "glitch-virginia",
                    at: f.glitch("c")
                }, {
                    visible: 0,
                    id: "d",
                    host: "Glitch",
                    region: "US East",
                    type: "unk",
                    name: "Special",
                    location: "glitch-virginia",
                    at: f.glitch("d")
                }, {
                    visible: 1,
                    id: "e",
                    host: "Glitch",
                    region: "US East",
                    type: "unk",
                    name: "Staging",
                    location: "glitch-virginia",
                    at: f.glitch("e")
                }, {
                    visible: 0,
                    id: "a",
                    host: "OpenShift",
                    region: "US East",
                    type: "ffa",
                    name: "FFA",
                    location: "os-virginia",
                    at: f.openshift("a", "cx8128")
                },
                {
                    visible: 0,
                    id: "b",
                    host: "OpenShift",
                    region: "US East",
                    type: "4tdm",
                    name: "4TDM",
                    location: "os-virginia",
                    at: f.openshift("b", "cx8128")
                }, {
                    visible: 0,
                    id: "m",
                    host: "OpenShift",
                    region: "US East",
                    type: "2mot",
                    name: "Maze Mothership",
                    location: "os-virginia",
                    at: f.openshift("m", "arras-c1")
                }, {
                    visible: 2,
                    id: "ha",
                    host: "Heroku",
                    region: "US East",
                    type: "3dom",
                    name: "3 Team Maze Domination",
                    location: "heroku-virginia",
                    at: f.heroku("ha")
                }, {
                    visible: 2,
                    id: "wb",
                    host: "WeDeploy",
                    region: "US East",
                    type: "4tdm",
                    name: "4TDM",
                    location: "wedeploy-virginia",
                    at: f.wedeploy("n9cgmhg"),
                    secure: 1
                }, {
                    visible: 2,
                    id: "la",
                    host: "Linode",
                    region: "Europe",
                    type: "3dom",
                    name: "3 Team Maze Domination",
                    location: "linode-frankfurt",
                    at: f.arras("la"),
                    secure: -1
                }, {
                    visible: 0,
                    id: "va",
                    host: "Vultr",
                    region: "US West",
                    type: "2mot",
                    name: "Maze Mothership",
                    location: "vultr-silicon-valley",
                    at: f.arras("va"),
                    secure: -1
                }, {
                    visible: 2,
                    id: "ba",
                    host: "BuyVM",
                    region: "US West",
                    type: "2mot",
                    name: "Maze Mothership",
                    location: "buyvm-la",
                    at: f.arras("ba"),
                    secure: -1
                }
            ].map(function(d, b) {
                return {
                    data: d,
                    i: b
                }
            }).sort(function(d,
                b) {
                return d.data.type > b.data.type ? -1 : b.data.type < d.data.type ? 1 : d.i - b.i
            }).map(function(d) {
                return d.data
            }),
            partyLink: 0,
            mobile: /android|mobi/i.test(navigator.userAgent)
        }
    }, function(g, f) {
        f.submitToLocalStorage = function(d) {
            localStorage.setItem(d + "Value", document.getElementById(d).value);
            localStorage.setItem(d + "Checked", document.getElementById(d).checked);
            return !1
        };
        f.retrieveFromLocalStorage = function(d) {
            document.getElementById(d).value = localStorage.getItem(d + "Value");
            document.getElementById(d).checked = "true" ===
                localStorage.getItem(d + "Checked");
            return !1
        };
        f.handleLargeNumber = function(d, b) {
            return (void 0 === b ? 0 : b) && 0 >= d ? "" : 1E3 > d ? d.toFixed(0) + "" : 1E6 > d ? (d / 1E3).toFixed(2) + "k" : 1E9 > d ? (d / 1E6).toFixed(2) + "m" : 1E12 > d ? (d / 1E9).toFixed(2) + "b" : 1E15 > d ? (d / 1E12).toFixed(2) + "t" : 1E18 > d ? (d / 1E15).toFixed(2) + "q" : "\u221e"
        };
        f.timeForHumans = function(d) {
            function b(a, b) {
                a && (G = G + ("" === G ? "" : ", ") + a + " " + b + (1 < a ? "s" : ""))
            }
            var a = d % 60;
            d = Math.floor(d / 60);
            var f = d % 60;
            d = Math.floor(d / 60);
            var g = d % 24;
            d = Math.floor(d / 24);
            var G = "";
            if (300 < d) return "FOREVER";
            b(d, "day");
            b(g, "hour");
            b(f, "minute");
            b(a, "second");
            "" === G && (G = "less than a second");
            return G
        };
        f.addArticle = function(d) {
            return /[aeiouAEIOU]/.test(d[0]) ? "an " + d : "a " + d
        };
        f.formatLargeNumber = function(d) {
            return 1E18 > d ? d.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "\u221e"
        };
        f.pullJSON = function(d) {
            if (window.fetch) return fetch(d, {
                cache: "no-cache"
            }).then(function(a) {
                return a.json()
            });
            var b = new XMLHttpRequest;
            console.log("Loading JSON from " + d);
            b.responseType = "json";
            return new Promise(function(a, f) {
                b.open("GET",
                    d);
                b.onload = function() {
                    a(b.response);
                    console.log("JSON load complete.")
                };
                b.onerror = function() {
                    f(b.statusText);
                    console.log("JSON load failed.");
                    console.log(b.statusText)
                };
                b.send()
            })
        }
    }, function(g, f) {
        (function(d) {
            function b(a) {
                function b() {
                    setTimeout(function() {
                        !0 === f._options.checkOnLoad && (!0 === f._options.debug && f._log("onload->eventCallback", "A check loading is launched"), null === f._var.bait && f._creatBait(), setTimeout(function() {
                            f.check()
                        }, 1))
                    }, 1)
                }
                this._options = {
                    checkOnLoad: !1,
                    resetOnEnd: !1,
                    loopCheckTime: 50,
                    loopMaxNumber: 5,
                    baitClass: "pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links",
                    baitStyle: "width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;",
                    debug: !1
                };
                this._var = {
                    version: "3.2.1",
                    bait: null,
                    checking: !1,
                    loop: null,
                    loopNumber: 0,
                    event: {
                        detected: [],
                        notDetected: []
                    }
                };
                void 0 !== a && this.setOption(a);
                var f = this;
                void 0 !== d.addEventListener ? d.addEventListener("load", b, !1) : d.attachEvent("onload",
                    b)
            }
            b.prototype._options = null;
            b.prototype._var = null;
            b.prototype._bait = null;
            b.prototype._log = function(a, b) {
                console.log("[BlockAdBlock][" + a + "] " + b)
            };
            b.prototype.setOption = function(a, b) {
                if (void 0 !== b) {
                    var d = a;
                    a = {};
                    a[d] = b
                }
                for (var f in a) this._options[f] = a[f], !0 === this._options.debug && this._log("setOption", 'The option "' + f + '" he was assigned to "' + a[f] + '"');
                return this
            };
            b.prototype._creatBait = function() {
                var a = document.createElement("div");
                a.setAttribute("class", this._options.baitClass);
                a.setAttribute("style",
                    this._options.baitStyle);
                this._var.bait = d.document.body.appendChild(a);
                this._var.bait.offsetParent;
                this._var.bait.offsetHeight;
                this._var.bait.offsetLeft;
                this._var.bait.offsetTop;
                this._var.bait.offsetWidth;
                this._var.bait.clientHeight;
                this._var.bait.clientWidth;
                !0 === this._options.debug && this._log("_creatBait", "Bait has been created")
            };
            b.prototype._destroyBait = function() {
                d.document.body.removeChild(this._var.bait);
                this._var.bait = null;
                !0 === this._options.debug && this._log("_destroyBait", "Bait has been removed")
            };
            b.prototype.check = function(a) {
                void 0 === a && (a = !0);
                !0 === this._options.debug && this._log("check", "An audit was requested " + (!0 === a ? "with a" : "without") + " loop");
                if (!0 === this._var.checking) return !0 === this._options.debug && this._log("check", "A check was canceled because there is already an ongoing"), !1;
                this._var.checking = !0;
                null === this._var.bait && this._creatBait();
                var b = this;
                this._var.loopNumber = 0;
                !0 === a && (this._var.loop = setInterval(function() {
                    b._checkBait(a)
                }, this._options.loopCheckTime));
                setTimeout(function() {
                        b._checkBait(a)
                    },
                    1);
                !0 === this._options.debug && this._log("check", "A check is in progress ...");
                return !0
            };
            b.prototype._checkBait = function(a) {
                var b = !1;
                null === this._var.bait && this._creatBait();
                if (null !== d.document.body.getAttribute("abp") || null === this._var.bait.offsetParent || 0 == this._var.bait.offsetHeight || 0 == this._var.bait.offsetLeft || 0 == this._var.bait.offsetTop || 0 == this._var.bait.offsetWidth || 0 == this._var.bait.clientHeight || 0 == this._var.bait.clientWidth) b = !0;
                if (void 0 !== d.getComputedStyle) {
                    var f = d.getComputedStyle(this._var.bait,
                        null);
                    !f || "none" != f.getPropertyValue("display") && "hidden" != f.getPropertyValue("visibility") || (b = !0)
                }!0 === this._options.debug && this._log("_checkBait", "A check (" + (this._var.loopNumber + 1) + "/" + this._options.loopMaxNumber + " ~" + (1 + this._var.loopNumber * this._options.loopCheckTime) + "ms) was conducted and detection is " + (!0 === b ? "positive" : "negative"));
                !0 === a && (this._var.loopNumber++, this._var.loopNumber >= this._options.loopMaxNumber && this._stopLoop());
                if (!0 === b) this._stopLoop(), this._destroyBait(), this.emitEvent(!0),
                    !0 === a && (this._var.checking = !1);
                else if (null === this._var.loop || !1 === a) this._destroyBait(), this.emitEvent(!1), !0 === a && (this._var.checking = !1)
            };
            b.prototype._stopLoop = function() {
                clearInterval(this._var.loop);
                this._var.loop = null;
                this._var.loopNumber = 0;
                !0 === this._options.debug && this._log("_stopLoop", "A loop has been stopped")
            };
            b.prototype.emitEvent = function(a) {
                !0 === this._options.debug && this._log("emitEvent", "An event with a " + (!0 === a ? "positive" : "negative") + " detection was called");
                a = this._var.event[!0 ===
                    a ? "detected" : "notDetected"];
                for (var b in a)
                    if (!0 === this._options.debug && this._log("emitEvent", "Call function " + (parseInt(b) + 1) + "/" + a.length), a.hasOwnProperty(b)) a[b]();
                !0 === this._options.resetOnEnd && this.clearEvent();
                return this
            };
            b.prototype.clearEvent = function() {
                this._var.event.detected = [];
                this._var.event.notDetected = [];
                !0 === this._options.debug && this._log("clearEvent", "The event list has been cleared")
            };
            b.prototype.on = function(a, b) {
                this._var.event[!0 === a ? "detected" : "notDetected"].push(b);
                !0 === this._options.debug &&
                    this._log("on", 'A type of event "' + (!0 === a ? "detected" : "notDetected") + '" was added');
                return this
            };
            b.prototype.onDetected = function(a) {
                return this.on(!0, a)
            };
            b.prototype.onNotDetected = function(a) {
                return this.on(!1, a)
            };
            f.BlockAdBlock = b;
            f.blockAdBlock = new b({
                checkOnLoad: !0,
                resetOnEnd: !0
            })
        })(window)
    }, function(g, f, d) {
        function b() {
            var b = this;
            this.directionLock = !1;
            this.target = a.target;
            this.reenviar = !0;
            this.socket = a.socket;
            this.directions = [];
            this.statMaxing = !1;
            var d = document.getElementById("gameCanvas");
            d.width =
                a.screenWidth;
            d.height = a.screenHeight;
            if (a.mobile) {
                d.controlTouch = null;
                d.movementTouch = null;
                d.movementTop = !1;
                d.movementBottom = !1;
                d.movementLeft = !1;
                d.movementRight = !1;
                d.addEventListener("touchstart", this.touchStart, !1);
                d.addEventListener("touchmove", this.touchMove, !1);
                d.addEventListener("touchend", this.touchEnd, !1);
                d.addEventListener("touchcancel", this.touchEnd, !1);
                var f = 60,
                    g = setInterval(function() {
                        b.socket && (b.socket.talk("L"), 0 >= --f && clearInterval(g))
                    }, 100);
                document.body.className += " mobile"
            } else d.addEventListener("keydown",
                this.keyboardDown, !1), d.addEventListener("keyup", this.keyboardUp, !1), d.addEventListener("mousedown", this.mouseDown, !1), d.addEventListener("mousemove", this.mouseMove, !1), d.addEventListener("mouseup", this.mouseUp, !1);
            d.parent = this;
            this.cv = d;
            a.canvas = this
        }
        var a = d(1);
        b.prototype.emit = function(a) {
            this.socket && this.socket.talk(a)
        };
        b.prototype.talk = function(a, b) {
            this.socket && this.socket.talk(a, b)
        };
        b.prototype.spawn = function(a) {
            this.socket && this.socket.talk("s", a, -1)
        };
        b.prototype.set = function(a, b) {
            this.socket &&
                this.socket.cmd.set(a, b)
        };
        b.prototype.keyboardDown = function(b) {
            switch (b.keyCode) {
                case 13:
                    a.died && 0 >= a.diedOn + 3E3 - Date.now() && (this.parent.spawn(a.playerName), a.died = !1);
                    break;
                case a.KEY_UP_ARROW:
                case a.KEY_UP:
                    this.parent.set(0, !0);
                    break;
                case a.KEY_DOWN_ARROW:
                case a.KEY_DOWN:
                    this.parent.set(1, !0);
                    break;
                case a.KEY_LEFT_ARROW:
                case a.KEY_LEFT:
                    this.parent.set(2, !0);
                    break;
                case a.KEY_RIGHT_ARROW:
                case a.KEY_RIGHT:
                    this.parent.set(3, !0);
                    break;
                case a.KEY_MOUSE_0:
                    this.parent.set(4, !0);
                    break;
                case a.KEY_MOUSE_1:
                    this.parent.set(5,
                        !0);
                    break;
                case a.KEY_MOUSE_2:
                    this.parent.set(6, !0);
                    break;
                case a.KEY_LEVEL_UP:
                    this.parent.emit("L")
            }
            if (a.canSkill) {
                var d = this.statMaxing ? 12 : 1;
                do switch (b.keyCode) {
                    case a.KEY_UPGRADE_ATK:
                        this.parent.talk("x", 0);
                        break;
                    case a.KEY_UPGRADE_HTL:
                        this.parent.talk("x", 1);
                        break;
                    case a.KEY_UPGRADE_SPD:
                        this.parent.talk("x", 2);
                        break;
                    case a.KEY_UPGRADE_STR:
                        this.parent.talk("x", 3);
                        break;
                    case a.KEY_UPGRADE_PEN:
                        this.parent.talk("x", 4);
                        break;
                    case a.KEY_UPGRADE_DAM:
                        this.parent.talk("x", 5);
                        break;
                    case a.KEY_UPGRADE_RLD:
                        this.parent.talk("x",
                            6);
                        break;
                    case a.KEY_UPGRADE_MOB:
                        this.parent.talk("x", 7);
                        break;
                    case a.KEY_UPGRADE_RGN:
                        this.parent.talk("x", 8);
                        break;
                    case a.KEY_UPGRADE_SHI:
                        this.parent.talk("x", 9)
                }
                while (--d)
            }
            if (!b.repeat) {
                switch (b.keyCode) {
                    case a.KEY_AUTO_SPIN:
                        this.parent.talk("t", 0);
                        break;
                    case a.KEY_AUTO_FIRE:
                        this.parent.talk("t", 1);
                        break;
                    case a.KEY_OVER_RIDE:
                        this.parent.talk("t", 2);
                        break;
                    case a.KEY_REVERSE_MOUSE:
                        this.parent.talk("t", 3);
                        break;
                    case a.KEY_REVERSE_TANK:
                        this.parent.talk("t", 4);
                        break;
                    case a.KEY_UPGRADE_MAX:
                        this.statMaxing = !0;
                        break;
                    case a.KEY_FUCK_YOU:
                        this.parent.emit("0");
                        break;
case a.KEY_ULT:
                        this.parent.emit("`");
                        Break;
Case a.KEY_TOGGLEUI:
this.parent.emit(“q”);
                    case a.KEY_KILL_YOURSELF:
                        this.parent.emit("K");
                        break;
                    case a.KEY_PING:
                        a.showDebug = !0;
                        break;
                    case a.KEY_CLASS_TREE:
                        a.showTree = !0;
                        break;
                    case a.KEY_RECORD:
                        if (this.captureStream && window.MediaRecorder)
                            if (this.videoRecorder) switch (this.videoRecorder.state) {
                                case "inactive":
                                    a.messages.push({
                                        text: "Recorder started!",
                                        status: 2,
                                        alpha: 0,
                                        time: Date.now()
                                    });
                                    this.videoRecorder.start();
                                    break;
                                case "recording":
                                    a.messages.push({
                                        text: "Recorder stopped! Saving file...",
                                        status: 2,
                                        alpha: 0,
                                        time: Date.now()
                                    }), this.videoRecorder.stop()
                            } else {
                                var f = [];
                                this.videoRecorder = new MediaRecorder(this.captureStream(60));
                                this.videoRecorder.ondataavailable = function(a) {
                                    return f.push(a.data)
                                };
                                this.videoRecorder.onstop = function() {
                                    var a = new Blob(f, {
                                        type: "video/webm"
                                    });
                                    f.length = 0;
                                    var b = URL.createObjectURL(a),
                                        d = document.createElement("a");
                                    d.style.display = "none";
                                    d.setAttribute("download", "video.webm");
                                    d.setAttribute("href", b);
                                    document.body.appendChild(d);
                                    setTimeout(function() {
                                        URL.revokeObjectURL(b);
                                        document.body.removeChild(d)
                                    }, 100);
                                    d.click()
                                };
                                a.messages.push({
                                    text: "Recorder initiated and started!",
                                    status: 2,
                                    alpha: 0,
                                    time: Date.now()
                                });
                                this.videoRecorder.start()
                            } else a.messages.push({
                                text: "Media recorder not supported in this browser!",
                                status: 2,
                                alpha: 0,
                                time: Date.now()
                            })
                }
                if (a.canUpgrade) switch (b.keyCode) {
                    case a.KEY_CHOOSE_1:
                        this.parent.talk("U", 0);
                        break;
                    case a.KEY_CHOOSE_2:
                        this.parent.talk("U", 1);
                        break;
                    case a.KEY_CHOOSE_3:
                        this.parent.talk("U", 2);
                        break;
                    case a.KEY_CHOOSE_4:
                        this.parent.talk("U", 3);
                        break;
                    case a.KEY_CHOOSE_5:
                        this.parent.talk("U", 4);
                        break;
                    case a.KEY_CHOOSE_6:
                        this.parent.talk("U", 5)
                }
            }
        };
        b.prototype.keyboardUp = function(b) {
            switch (b.keyCode) {
                case a.KEY_UP_ARROW:
                case a.KEY_UP:
                    this.parent.set(0, !1);
                    break;
                case a.KEY_DOWN_ARROW:
                case a.KEY_DOWN:
                    this.parent.set(1, !1);
                    break;
                case a.KEY_LEFT_ARROW:
                case a.KEY_LEFT:
                    this.parent.set(2, !1);
                    break;
                case a.KEY_RIGHT_ARROW:
                case a.KEY_RIGHT:
                    this.parent.set(3, !1);
                    break;
                case a.KEY_MOUSE_0:
                    this.parent.set(4, !1);
                    break;
                case a.KEY_MOUSE_1:
                    this.parent.set(5,
                        !1);
                    break;
                case a.KEY_MOUSE_2:
                    this.parent.set(6, !1);
                    break;
                case a.KEY_UPGRADE_MAX:
                    this.statMaxing = !1;
                    break;
                case a.KEY_PING:
                    a.showDebug = !1;
                    break;
                case a.KEY_CLASS_TREE:
                    a.showTree = !1
            }
        };
        b.prototype.mouseDown = function(b) {
            switch (b.button) {
                case 0:
                    b = {
                        x: b.clientX,
                        y: b.clientY
                    };
                    var d = a.clickables.stat.check(b); - 1 !== d ? this.parent.talk("x", d) : -1 !== a.clickables.skipUpgrades.check(b) ? a.clearUpgrades() : (b = a.clickables.upgrade.check(b), -1 !== b ? this.parent.talk("U", b) : this.parent.set(4, !0));
                    break;
                case 1:
                    this.parent.set(5,
                        !0);
                    break;
                case 2:
                    this.parent.set(6, !0)
            }
        };
        b.prototype.mouseMove = function(b) {
            null !== a.player.x && (this.parent.target.x = b.clientX - a.player.x, this.parent.target.y = b.clientY - a.player.y);
            a.target = this.parent.target;
            a.statHover = 0 === a.clickables.hover.check({
                x: b.clientX,
                y: b.clientY
            })
        };
        b.prototype.mouseUp = function(a) {
            switch (a.button) {
                case 0:
                    this.parent.set(4, !1);
                    break;
                case 1:
                    this.parent.set(5, !1);
                    break;
                case 2:
                    this.parent.set(6, !1)
            }
        };
        b.prototype.touchStart = function(b) {
            var d = this;
            b.preventDefault();
            if (a.died &&
                0 >= a.diedOn + 3E3 - Date.now()) {
                this.parent.spawn(a.playerName);
                var f = 60,
                    g = setInterval(function() {
                        d.parent.emit("L");
                        0 >= --f && clearInterval(g)
                    }, 100);
                a.died = !1
            }
            b = p.makeIterator(b.changedTouches);
            for (var m = b.next(); !m.done; m = b.next()) {
                var q = m.value;
                m = {
                    x: q.clientX,
                    y: q.clientY
                };
                q = q.identifier;
                var da = a.clickables.stat.check(m); - 1 !== da ? this.parent.talk("x", da) : -1 !== a.clickables.skipUpgrades.check(m) ? a.clearUpgrades() : (da = a.clickables.upgrade.check(m), -1 !== da ? this.parent.talk("U", da) : (m = m.x < this.width / 2, null ===
                    this.movementTouch && m ? this.movementTouch = q : null !== this.controlTouch || m || (this.controlTouch = q, this.parent.set(4, !0))))
            }
        };
        b.prototype.touchMove = function(b) {
            b.preventDefault();
            b = p.makeIterator(b.changedTouches);
            for (var d = b.next(); !d.done; d = b.next()) {
                var f = d.value,
                    g = f.clientX;
                d = f.clientY;
                f = f.identifier;
                this.movementTouch === f ? (g -= this.width / 4, d -= this.height / 2, f = Math.sqrt(g * g + d * d), g /= f, d /= f, -.3826834323650898 > d !== this.movementTop && this.parent.set(0, this.movementTop = -.3826834323650898 > d), .3826834323650898 <
                    d !== this.movementBottom && this.parent.set(1, this.movementBottom = .3826834323650898 < d), -.3826834323650898 > g !== this.movementLeft && this.parent.set(2, this.movementLeft = -.3826834323650898 > g), .3826834323650898 < g !== this.movementRight && this.parent.set(3, this.movementRight = .3826834323650898 < g)) : this.controlTouch === f && (this.parent.target.x = g - 3 * this.width / 4, this.parent.target.y = d - this.height / 2)
            }
            a.target = this.parent.target
        };
        b.prototype.touchEnd = function(a) {
            a.preventDefault();
            a = p.makeIterator(a.changedTouches);
            for (var b = a.next(); !b.done; b = a.next()) b = b.value.identifier, this.movementTouch === b ? (this.movementTouch = null, this.movementTop && this.parent.set(0, this.movementTop = !1), this.movementBottom && this.parent.set(1, this.movementBottom = !1), this.movementLeft && this.parent.set(2, this.movementLeft = !1), this.movementRight && this.parent.set(3, this.movementRight = !1)) : this.controlTouch === b && (this.controlTouch = null, this.parent.set(4, !1))
        };
        g.exports = b
    }, function(g, f) {
        f.encode = function() {
            function d(a) {
                if ("string" === typeof a) {
                    for (var b =
                            0; b < a.length; b++)
                        if (255 < a.charCodeAt(b)) return "String16";
                    return "String8"
                }
                if ("boolean" === typeof a) return "Uint8";
                if ("number" !== typeof a) throw Error("Unencodable data type");
                if (a !== Math.floor(a)) return "Float32";
                if (0 > a) {
                    if (-256 <= a) return "Sint8";
                    if (-65535 <= a) return "Sint16";
                    if (-4294967295 <= a) return "Sint32"
                } else {
                    if (256 > a) return "Uint8";
                    if (65535 > a) return "Uint16";
                    if (4294967295 > a) return "Uint32"
                }
                return "Float32"
            }


            function b(d, m) {
                var v = "";
                switch (d) {
                    case "RawUint8":
                        return a[0] = m, String.fromCharCode(a[0]);
                    case "RawUint16":
                        return f[0] =
                            m, String.fromCharCode(g[0], g[1]);
                    case "Uint8":
                        return a[0] = m, "0" + String.fromCharCode(a[0]);
                    case "Uint16":
                        return f[0] = m, "1" + String.fromCharCode(g[0], g[1]);
                    case "Uint32":
                        return G[0] = m, "2" + String.fromCharCode(L[0], L[1], L[2], L[3]);
                    case "Sint8":
                        return a[0] = -1 - m, "3" + String.fromCharCode(a[0]);
                    case "Sint16":
                        return f[0] = -1 - m, "4" + String.fromCharCode(g[0], g[1]);
                    case "Sint32":
                        return G[0] = -1 - m, "5" + String.fromCharCode(L[0], L[1], L[2], L[3]);
                    case "Float32":
                        return M[0] = m, "6" + String.fromCharCode(q[0], q[1], q[2], q[3]);
                    case "String8":
                        return "7" + b("RawUint16", m.length) + m;
                    case "String16":
                        d = 0;
                        for (var H = m.length; d < H; d++) v += b("RawUint16", m.charCodeAt(d));
                        return "8" + b("RawUint16", v.length) + v;
                    default:
                        throw Error("Unknown encoding type.");
                }
            }
            var a = new Uint8Array(1),
                f = new Uint16Array(1),
                g = new Uint8Array(f.buffer),
                G = new Uint32Array(1),
                L = new Uint8Array(G.buffer),
                M = new Float32Array(1),
                q = new Uint8Array(M.buffer);
            return function(a, f) {
                f = void 0 === f ? !1 : f;
                var g = a.splice(0, 1)[0];
                if ("string" !== typeof g) throw Error("No identification code!");
                a.forEach(function(a) {
                    g += b(d(a), a)
                });
                a = g.length;
                for (var q = new ArrayBuffer(a), m = new Uint8Array(q), v = 0; v < a; v++) m[v] = g.charCodeAt(v);
                f && (console.log("OUTPUT: " + m), console.log("RAW OUTPUT: " + g), console.log("SIZE: " + a));
                return q
            }
        }();
        f.decode = function() {
            function d(d, q, m) {
                switch (q) {
                    case "Uint8":
                        return d.charCodeAt(m++);
                    case "Uint16":
                        for (q = 0; 2 > q; q++) a[q] = d.charCodeAt(m++);
                        return b[0];
                    case "Uint32":
                        for (q = 0; 4 > q; q++) g[q] = d.charCodeAt(m++);
                        return f[0];
                    case "Sint8":
                        return -1 - d.charCodeAt(m++);
                    case "Sint16":
                        for (q =
                            0; 2 > q; q++) a[q] = d.charCodeAt(m++);
                        return -1 - b[0];
                    case "Sint32":
                        for (q = 0; 4 > q; q++) g[q] = d.charCodeAt(m++);
                        return -1 - f[0];
                    case "Float32":
                        for (q = 0; 4 > q; q++) L[q] = d.charCodeAt(m++);
                        return G[0];
                    default:
                        throw Error("Unknown decoding type.");
                }
            }
            var b = new Uint16Array(1),
                a = new Uint8Array(b.buffer),
                f = new Uint32Array(1),
                g = new Uint8Array(f.buffer),
                G = new Float32Array(1),
                L = new Uint8Array(G.buffer);
            return function(a) {
                try {
                    var b = new Uint8Array(a);
                    a = "";
                    for (var f = 0, g = b.length; f < g; f++) a += String.fromCharCode(b[f]);
                    b = 1;
                    for (var m = [a.charAt(0)]; b < a.length;) switch (a[b++]) {
                        case "0":
                            m.push(d(a, "Uint8", b));
                            b++;
                            break;
                        case "1":
                            m.push(d(a, "Uint16", b));
                            b += 2;
                            break;
                        case "2":
                            m.push(d(a, "Uint32", b));
                            b += 4;
                            break;
                        case "3":
                            m.push(d(a, "Sint8", b));
                            b++;
                            break;
                        case "4":
                            m.push(d(a, "Sint16", b));
                            b += 2;
                            break;
                        case "5":
                            m.push(d(a, "Sint32", b));
                            b += 4;
                            break;
                        case "6":
                            m.push(d(a, "Float32", b));
                            b += 4;
                            break;
                        case "7":
                            var v = d(a, "Uint16", b);
                            b += 2;
                            m.push(a.slice(b, b + v));
                            b += v;
                            break;
                        case "8":
                            var G = d(a, "Uint16", b);
                            b += 2;
                            var M = a.slice(b, b + G),
                                L = new Uint16Array(G / 2);
                            for (g =
                                0; g < G; g += 2) L[g / 2] = d(M, "Uint16", g);
                            m.push(String.fromCharCode.apply(null, L));
                            b += G;
                            break;
                        default:
                            throw Error("Unknown decoding command. Decoding exited.");
                    }
                    return m
                } catch (R) {
                    return console.log(R), -1
                }
            }
        }()
    }, function(g) {
        g.exports = {
            normal: {
                teal: "#7ADBBC",
                lgreen: "#B9E87E",
                orange: "#E7896D",
                yellow: "#FDF380",
                lavender: "#B58EFD",
                pink: "#EF99C3",
                vlgrey: "#E8EBF7",
                lgrey: "#AA9F9E",
                guiwhite: "#FFFFFF",
                black: "#484848",
                blue: "#3CA4CB",
                green: "#8ABC3F",
                red: "#E03E41",
                gold: "#EFC74B",
                purple: "#8D6ADF",
                magenta: "#CC669C",
                grey: "#A7A7AF",
                dgrey: "#726F6F",
                white: "#DBDBDB",
                guiblack: "#000000",
                paletteSize: 10,
                border: .65
            },
            classic: {
                teal: "#8EFFFB",
                lgreen: "#85E37D",
                orange: "#FC7676",
                yellow: "#FFEB8E",
                lavender: "#B58EFF",
                pink: "#F177DD",
                vlgrey: "#CDCDCD",
                lgrey: "#999999",
                guiwhite: "#FFFFFF",
                black: "#525252",
                blue: "#00B0E1",
                green: "#00E06C",
                red: "#F04F54",
                gold: "#FFE46B",
                purple: "#768CFC",
                magenta: "#BE7FF5",
                grey: "#999999",
                dgrey: "#545454",
                white: "#C0C0C0",
                guiblack: "#000000",
                paletteSize: 10,
                border: .5
            },
            dark: {
                teal: "#8975B7",
                lgreen: "#0C491D",
                orange: "#C46748",
                yellow: "#B2B224",
                lavender: "#7D56C5",
                pink: "#B24FAE",
                vlgrey: "#1E1E1E",
                lgrey: "#3C3A3A",
                guiwhite: "#000000",
                black: "#E5E5E5",
                blue: "#379FC6",
                green: "#30B53B",
                red: "#FF6C6E",
                gold: "#FFC665",
                purple: "#9673E8",
                magenta: "#C8679B",
                grey: "#635F5F",
                dgrey: "#73747A",
                white: "#11110F",
                guiblack: "#FFFFFF",
                paletteSize: 10,
                border: .15
            },
            natural: {
                teal: "#76C1BB",
                lgreen: "#AAD35D",
                orange: "#E09545",
                yellow: "#FFD993",
                lavender: "#939FFF",
                pink: "#D87FB2",
                vlgrey: "#C4B6B6",
                lgrey: "#7F7F7F",
                guiwhite: "#FFFFFF",
                black: "#373834",
                blue: "#4F93B5",
                green: "#00B659",
                red: "#E14F65",
                gold: "#E5BF42",
                purple: "#8053A0",
                magenta: "#B67CAA",
                grey: "#998F8F",
                dgrey: "#494954",
                white: "#A5B2A5",
                guiblack: "#000000",
                paletteSize: 10,
                border: .2
            },
            pumpkin: {
                teal: "#721970",
                lgreen: "#ff6347",
                orange: "#1b713a",
                yellow: "#fdf380",
                lavender: "#941100",
                pink: "#194417",
                vlgrey: "#1b713a",
                lgrey: "#aa9f9e",
                guiwhite: "#fed8b1",
                black: "#484848",
                blue: "#3ca4cb",
                green: "#76EEC6",
                red: "#F04F54",
                gold: "#1b713a",
                purple: "#1b713a",
                magenta: "#cc669c",
                grey: "#ffffff",
                dgrey: "#726f6f",
                white: "#ff9b58",
                guiblack: "#000000",
                paletteSize: 10,
                border: 3.3
            },
            forest: {
                teal: "#884AA5",
                lgreen: "#8C9B3E",
                orange: "#D16A80",
                yellow: "#97596D",
                lavender: "#499855",
                pink: "#60294F",
                vlgrey: "#DDC6B8",
                lgrey: "#7E949E",
                guiwhite: "#FFFFE8",
                black: "#665750",
                blue: "#807BB6",
                green: "#A1BE55",
                red: "#E5B05B",
                gold: "#FF4747",
                purple: "#BAC674",
                magenta: "#BA78D1",
                grey: "#998866",
                dgrey: "#529758",
                white: "#7DA060",
                guiblack: "#000000",
                paletteSize: 10,
                border: .7
            },
            midnight: {
                teal: "#2B9098",
                lgreen: "#4BAA5D",
                orange: "#345678",
                yellow: "#CDC684",
                lavender: "#89778E",
                pink: "#A85C90",
                vlgrey: "#CCCCCC",
                lgrey: "#A7B2B7",
                guiwhite: "#BAC6FF",
                black: "#091F28",
                blue: "#123455",
                green: "#098765",
                red: "#000013",
                gold: "#566381",
                purple: "#743784",
                magenta: "#B29098",
                grey: "#555555",
                dgrey: "#649EB7",
                white: "#444444",
                guiblack: "#000000",
                paletteSize: 10,
                border: .6
            },
            pastel: {
                teal: "#89BFBA",
                lgreen: "#B5D17D",
                orange: "#E5E0E0",
                yellow: "#B5BBE5",
                lavender: "#939FFF",
                pink: "#646DE5",
                vlgrey: "#B2B2B2",
                lgrey: "#7F7F7F",
                guiwhite: "#FFFFFF",
                black: "#383835",
                blue: "#AEAEFF",
                green: "#AEFFAE",
                red: "#FFAEAE",
                gold: "#FFFFFF",
                purple: "#C3C3D8",
                magenta: "#FFB5FF",
                grey: "#CCCCCC",
                dgrey: "#A0A0B2",
                white: "#F2F2F2",
                guiblack: "#000000",
                paletteSize: 10,
                border: .35
            },
            space: {
                teal: "#4788F3",
                lgreen: "#AF1010",
                orange: "#FF0000",
                yellow: "#82F850",
                lavender: "#FFFFFF",
                pink: "#57006C",
                vlgrey: "#FFFFFF",
                lgrey: "#272727",
                guiwhite: "#000000",
                black: "#7F7F7F",
                blue: "#0E1B92",
                green: "#0AEB80",
                red: "#C2B90A",
                gold: "#3E7E8C",
                purple: "#285911",
                magenta: "#A9707E",
                grey: "#6F6A68",
                dgrey: "#2D0738",
                white: "#000000",
                guiblack: "#FFFFFF",
                paletteSize: 10,
                border: .25
            },
            nebula: {
                teal: "#38B06E",
                lgreen: "#22882E",
                orange: "#D28E7F",
                yellow: "#D5D879",
                lavender: "#E084EB",
                pink: "#DF3E3E",
                vlgrey: "#F0F2CC",
                lgrey: "#7D7D7D",
                guiwhite: "#C2C5EF",
                black: "#161616",
                blue: "#9274E6",
                green: "#89F470",
                red: "#E08E5D",
                gold: "#ECDC58",
                purple: "#58CBEC",
                magenta: "#EA58EC",
                grey: "#7E5713",
                dgrey: "#303030",
                white: "#555555",
                guiblack: "#EAEAEA",
                paletteSize: 10,
                border: .5
            },
            bleach: {
                teal: "#00FFFF",
                lgreen: "#00FF00",
                orange: "#FF3200",
                yellow: "#FFEC00",
                lavender: "#FF24A7",
                pink: "#FF3CBD",
                vlgrey: "#FFF186",
                lgrey: "#918181",
                guiwhite: "#F1F1F1",
                black: "#5F5F5F",
                blue: "#0025FF",
                green: "#00FF00",
                red: "#FF0000",
                gold: "#FFFA23",
                purple: "#3100FF",
                magenta: "#D4D3D3",
                grey: "#838383",
                dgrey: "#4C4C4C",
                white: "#FFFEFE",
                guiblack: "#080808",
                paletteSize: 10,
                border: .4
            },
            ocean: {
                teal: "#76EEC6",
                lgreen: "#41AA78",
                orange: "#FF7F50",
                yellow: "#FFD250",
                lavender: "#DC3388",
                pink: "#FA8072",
                vlgrey: "#8B8886",
                lgrey: "#BFC1C2",
                guiwhite: "#FFFFFF",
                black: "#12466B",
                blue: "#4200AE",
                green: "#0D6338",
                red: "#DC4333",
                gold: "#FEA904",
                purple: "#7B4BAB",
                magenta: "#5C246E",
                grey: "#656884",
                dgrey: "#D4D7D9",
                white: "#3283BC",
                guiblack: "#000000",
                paletteSize: 10,
                border: .3
            },
            badlands: {
                teal: "#F9CB9C",
                lgreen: "#F1C232",
                orange: "#38761D",
                yellow: "#E69138",
                lavender: "#B7B7B7",
                pink: "#78866B",
                vlgrey: "#6AA84F",
                lgrey: "#B7B7B7",
                guiwhite: "#A4C2F4",
                black: "#000000",
                blue: "#0C5A9E",
                green: "#6E8922",
                red: "#5B0000",
                gold: "#783F04",
                purple: "#591C77",
                magenta: "#20124D",
                grey: "#2F1C16",
                dgrey: "#999999",
                white: "#543517",
                guiblack: "#CFE2F3",
                paletteSize: 10,
                border: .4
            },
            custom: {
                teal: "#7ADBBC",
                lgreen: "#B9E87E",
                orange: "#E7896D",
                yellow: "#FDF380",
                lavender: "#B58EFD",
                pink: "#EF99C3",
                vlgrey: "#E8EBF7",
                lgrey: "#AA9F9E",
                guiwhite: "#FFFFFF",
                black: "#484848",
                blue: "#3CA4CB",
                green: "#8ABC3F",
                red: "#E03E41",
                gold: "#EFC74B",
                purple: "#8D6ADF",
                magenta: "#CC669C",
                grey: "#A7A7AF",
                dgrey: "#726F6F",
                white: "#DBDBDB",
                guiblack: "#000000",
                paletteSize: 10,
                border: .65
            }
        }
    }]);
}()
