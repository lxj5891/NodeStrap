F.module("/static/common/ui/lazyLoadImg/lazyLoadImg.js", function (d, b) {
  var c = d("/static/common/lib/tangram/base/base.js");
  var a = function (e) {
    e = e || {};
    e.preloadHeight = e.preloadHeight || 0;
    e.className = e.className || "lazy-img";
    e.placeHolder = e.placeHolder || "/static/common/ui/lazyLoadImg/img/grey.gif";
    c.dom.ready(function () {
      var j = document.getElementsByTagName("IMG"), l = j, m = j.length, h = 0, p = g(), o = "data-src", n;
      l = [];
      for (; h < m; ++h) {
        if (c.dom.hasClass(j[h], e.className)) {
          l.push(j[h])
        }
      }
      if (e.fadeIn) {
        c("." + e.className).bind("load", function (i) {
          k(this);
          c(this).unbind("load")
        })
      }
      function g() {
        return c.page.getScrollTop() + c.page.getViewHeight() + e.preloadHeight
      }

      function k(r, s, q, u) {
        function i(x, w) {
          (c.browser.ie && c.browser.ie < 10) ? x.style.filter = "alpha(opacity=" + w + ")" : x.style.opacity = w / 100
        }

        s = s || 20;
        q = q || 100;
        r.style.display = "block";
        i(r, 0);
        var t = 0;
        (function () {
          i(r, t);
          t += 5;
          if (t <= q) {
            setTimeout(arguments.callee, s)
          } else {
            if (u) {
              u()
            }
          }
        })()
      }

      for (h = 0, m = l.length; h < m; ++h) {
        n = l[h];
        if (c.dom.getPosition(n).top < p) {
          if (e.fadeIn) {
            c(n).css({filter: "alpha(opacity=0)", "-moz-opacity": "0", opacity: "0"})
          }
          n.setAttribute("src", n.getAttribute(o));
          n.removeAttribute(o)
        }
      }
      var f = function () {
        var r = g(), t, u = true, s = 0, q = l.length;
        for (; s < q; ++s) {
          n = l[s];
          t = n.getAttribute(o);
          t && (u = false);
          if (c.dom.getPosition(n).top < r && t) {
            if (e.fadeIn) {
              c(n).css({filter: "alpha(opacity=0)", "-moz-opacity": "0", opacity: "0"})
            }
            n.src = t;
            n.removeAttribute(o);
            c.lang.isFunction(e.onlazyload) && e.onlazyload(n)
          }
        }
        u && c.dom(window).off("scroll resize", f)
      };
      c.dom(window).on("scroll resize", f)
    })
  };
  b = a;
  return b
}, ["/static/common/lib/tangram/base/base.js"]);