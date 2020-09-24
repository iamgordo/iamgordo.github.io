(function () {
    /*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
 tree
*/
    "use strict";
    var d,
        e =
            "function" == typeof Object.create
                ? Object.create
                : function (a) {
                      var c = function () {};
                      c.prototype = a;
                      return new c();
                  },
        f;
    if ("function" == typeof Object.setPrototypeOf) f = Object.setPrototypeOf;
    else {
        var g;
        a: {
            var h = { l: !0 },
                l = {};
            try {
                l.__proto__ = h;
                g = l.l;
                break a;
            } catch (a) {}
            g = !1;
        }
        f = g
            ? function (a, c) {
                  a.__proto__ = c;
                  if (a.__proto__ !== c)
                      throw new TypeError(a + " is not extensible");
                  return a;
              }
            : null;
    }
    var m = f;
    var n = function (a, c) {
        var b = void 0 === b ? null : b;
        var k = document.createEvent("CustomEvent");
        k.initCustomEvent(a, !0, !0, b);
        c.dispatchEvent(k);
    };
    var p = function () {
            var a = HTMLElement.call(this) || this;
            a.j = a.m.bind(a);
            a.a = [];
            a.g = !1;
            a.f = !1;
            a.b = !1;
            a.i = -1;
            a.h = -1;
            a.c = !1;
            return a;
        },
        q = HTMLElement;
    p.prototype = e(q.prototype);
    p.prototype.constructor = p;
    if (m) m(p, q);
    else
        for (var r in q)
            if ("prototype" != r)
                if (Object.defineProperties) {
                    var t = Object.getOwnPropertyDescriptor(q, r);
                    t && Object.defineProperty(p, r, t);
                } else p[r] = q[r];
    d = p.prototype;
    d.connectedCallback = function () {
        var a = this;
        this.i =
            parseInt(this.getAttribute("data-gwd-width"), 10) ||
            this.clientWidth;
        this.h =
            parseInt(this.getAttribute("data-gwd-height"), 10) ||
            this.clientHeight;
        this.addEventListener("ready", this.j, !1);
        this.style.visibility = "hidden";
        setTimeout(function () {
            a.a = Array.prototype.slice
                .call(a.querySelectorAll("*"))
                .filter(function (c) {
                    return "function" != typeof c.gwdLoad ||
                        "function" != typeof c.gwdIsLoaded ||
                        c.gwdIsLoaded()
                        ? !1
                        : !0;
                }, a);
            a.g = !0;
            0 < a.a.length ? (a.f = !1) : u(a);
            a.b = !0;
            n("attached", a);
        }, 0);
    };
    d.disconnectedCallback = function () {
        this.removeEventListener("ready", this.j, !1);
        this.classList.remove("gwd-play-animation");
        n("detached", this);
    };
    d.gwdActivate = function () {
        this.classList.remove("gwd-inactive");
        Array.prototype.slice
            .call(this.querySelectorAll("*"))
            .forEach(function (a) {
                "function" == typeof a.gwdActivate &&
                    "function" == typeof a.gwdIsActive &&
                    0 == a.gwdIsActive() &&
                    a.gwdActivate();
            });
        this.c = !0;
        this.b ? (this.b = !1) : n("attached", this);
        n("pageactivated", this);
    };
    d.gwdDeactivate = function () {
        this.classList.add("gwd-inactive");
        this.classList.remove("gwd-play-animation");
        var a = Array.prototype.slice.call(this.querySelectorAll("*"));
        a.push(this);
        for (var c = 0; c < a.length; c++) {
            var b = a[c];
            if (
                b.classList &&
                (b.classList.remove("gwd-pause-animation"),
                b.hasAttribute("data-gwd-current-label"))
            ) {
                var k = b.getAttribute("data-gwd-current-label");
                b.classList.remove(k);
                b.removeAttribute("data-gwd-current-label");
            }
            delete b.gwdGotoCounters;
            b != this &&
                "function" == typeof b.gwdDeactivate &&
                "function" == typeof b.gwdIsActive &&
                1 == b.gwdIsActive() &&
                b.gwdDeactivate();
        }
        this.c = !1;
        n("pagedeactivated", this);
        n("detached", this);
    };
    d.gwdIsActive = function () {
        return this.c;
    };
    d.gwdIsLoaded = function () {
        return this.g && 0 == this.a.length;
    };
    d.gwdLoad = function () {
        if (this.gwdIsLoaded()) u(this);
        else for (var a = this.a.length - 1; 0 <= a; a--) this.a[a].gwdLoad();
    };
    d.m = function (a) {
        a = this.a.indexOf(a.target);
        -1 < a && (this.a.splice(a, 1), 0 == this.a.length && u(this));
    };
    var u = function (a) {
        a.style.visibility = "";
        a.f || (n("ready", a), n("pageload", a));
        a.f = !0;
    };
    p.prototype.gwdPresent = function () {
        n("pagepresenting", this);
        this.classList.add("gwd-play-animation");
    };
    p.prototype.isPortrait = function () {
        return this.h >= this.i;
    };
    customElements.define("gwd-page", p);
}.call(this));
