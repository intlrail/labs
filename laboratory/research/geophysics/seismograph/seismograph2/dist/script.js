var w = window.innerWidth,
    h = window.innerHeight;
function getContext(a, c, d) {
    var f = document.createElement("canvas");
    !0 === !!d && document.body.appendChild(f);
    f.width = a || window.innerWidth;
    f.height = c || window.innerHeight;
    return f.getContext("2d");
}
var ctx = getContext(w, h, !0),
    Point = function (a, c) {
        this.x = a || 0;
        this.y = c || 0;
        return this;
    };
Point.prototype = {
    add: function (a) {
        this.x += a.x;
        this.y += a.y;
        return this;
    },
    sub: function (a) {
        this.x -= a.x;
        this.y -= a.y;
        return this;
    },
    clone: function () {
        return new Point(this.x, this.y);
    },
    copy: function (a) {
        this.x = a.x;
        this.y = a.y;
        return this;
    },
    set: function (a, c) {
        this.x = a;
        this.y = c;
        return this;
    },
    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    normalize: function (a) {
        var c = this.length();
        this.x /= c;
        this.y /= c;
        null != a && this.multiplyScalar(a);
        return this;
    },
    multiplyScalar: function (a) {
        this.x *= a;
        this.y *= a;
        return this;
    },
    direction: function (a) {
        return a.clone().sub(this).normalize();
    },
    negate: function () {
        this.x *= -1;
        this.y *= -1;
        return this;
    },
    dot: function (a) {
        return this.x * a.x + this.y * a.y;
    },
    equals: function (a) {
        return this.x == a.x && this.y == a.y;
    },
    midpoint: function (a) {
        return new Point((this.x + a.x) / 2, (this.y + a.y) / 2);
    },
};
var Q = function (a, c, d, f) {
    this.x = a;
    this.y = c;
    this.w = d;
    this.h = f;
    this.points = [new Point(this.x, this.y), new Point(this.x + this.w, this.y), new Point(this.x + this.w, this.y + this.h), new Point(this.x, this.y + this.h)];
    this.area = this.w * this.h;
};
Q.prototype = {
    draw: function (a) {
        a.beginPath();
        a.moveTo(this.x, this.y);
        a.lineTo(this.x + this.w, this.y);
        a.lineTo(this.x + this.w, this.y + this.h);
        a.lineTo(this.x, this.y + this.h);
        a.closePath();
    },
    split: function () {
        if (100 > this.w * this.h) return [];
        var a = Math.max(this.w, this.h) / Math.min(this.w, this.h);
        if (0.25 > a || 5 < a) return [];
        a = this.x;
        var c = this.y,
            d = 0.5 + 0.5 * (Math.random() - 0.5),
            f = 0.5 + 0.5 * (Math.random() - 0.5),
            n = this.w * d,
            m = this.h * f;
        d = this.w * (1 - d);
        f = this.h * (1 - f);
        return [new Q(a, c, n, m), new Q(a + n, c, d, m), new Q(a, c + m, n, f), new Q(a + n, c + m, d, f)];
    },
    stairs: function (a) {
        a.fillStyle = "white";
        var c = 0.5 < Math.random() ? 0 : 1;
        var d = this.points[0];
        var f = this.points[1];
        var n = this.points[3];
        for (var m = 0, e = 10 / this.h, g = d.x, k, b, l = 0; 1 > l; l += e)
            (g += 3),
                0 == c ? ((k = lerp(l, d.y, n.y)), (b = lerp(l + e, d.y, n.y))) : ((k = lerp(1 - l, d.y, n.y)), (b = lerp(1 - l + e, d.y, n.y))),
                (m += 0.15),
                (a.globalAlpha = m),
                a.beginPath(),
                a.moveTo(g, k),
                a.lineTo(f.x, k),
                a.lineTo(f.x, b),
                a.lineTo(g, b),
                a.stroke(),
                a.fill(),
                a.translate(0, 0.5 * e);
    },
};
function reset() {
    w = window.innerWidth;
    h = window.innerHeight;
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    var a = new Point();
    a.radius = h / 3;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#ff423e";
    ctx.globalAlpha = 1;
    var c = [];
    new Q(a.x - a.radius, a.y - a.radius, 1.25 * a.radius, 1.25 * a.radius).split().forEach(function (e) {
        e.split().forEach(function (g) {
            g.split().forEach(function (k) {
                k.split().forEach(function (b) {
                    c.push(b);
                });
            });
        });
    });
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(1, 0.62);
    ctx.rotate(Math.PI / 4);
    var d = [],
        f = [],
        n = [];
    ctx.beginPath();
    c.forEach(function (e, g) {
        var k = new Point(e.x + e.w / 2, e.y + e.h / 2);
        if (circleContainsPoint(k, a) && !(Math.random() > 2 * (1 - distance(k, a) / a.radius)))
            if (e.area < Math.pow(6, 3))
                e.split().forEach(function (l) {
                    b = offsetPolygon(l.points.concat(), 4);
                    l.points = b;
                    ctx.moveTo(b[0].x, b[0].y);
                    ctx.lineTo(b[1].x, b[1].y);
                    ctx.lineTo(b[2].x, b[2].y);
                    ctx.lineTo(b[3].x, b[3].y);
                    ctx.lineTo(b[0].x, b[0].y);
                    n.push(l);
                });
            else if (e.area < Math.pow(120, 2.5))
                e.split().forEach(function (l) {
                    b = offsetPolygon(l.points.concat(), 4);
                    l.points = b;
                    ctx.moveTo(b[0].x, b[0].y);
                    ctx.lineTo(b[1].x, b[1].y);
                    ctx.lineTo(b[2].x, b[2].y);
                    ctx.lineTo(b[3].x, b[3].y);
                    ctx.lineTo(b[0].x, b[0].y);
                    f.push(l);
                });
            else if (e.area < Math.pow(95, 2))
                e.split().forEach(function (l) {
                    var p = offsetPolygon(l.points.concat(), 4);
                    l.points = p;
                    d.push(l);
                    ctx.moveTo(p[0].x, p[0].y);
                    ctx.lineTo(p[1].x, p[1].y);
                    ctx.lineTo(p[2].x, p[2].y);
                    ctx.lineTo(p[3].x, p[3].y);
                    ctx.lineTo(p[0].x, p[0].y);
                });
            else {
                var b = offsetPolygon(e.points.concat(), 4);
                e.points = b;
                f.push(e);
                ctx.moveTo(b[0].x, b[0].y);
                ctx.lineTo(b[1].x, b[1].y);
                ctx.lineTo(b[2].x, b[2].y);
                ctx.lineTo(b[3].x, b[3].y);
                ctx.lineTo(b[0].x, b[0].y);
            }
    });
    ctx.closePath();
    ctx.stroke();
    ctx.save();
    ctx.clip();
    ctx.shadowBlur = 10;
    ctx.shadowColor = "purple";
    ctx.fillRect(-w, -h, 2 * w, 2 * h);
    d.forEach(function (e, g) {
        e.stairs(ctx, g);
    });
    ctx.restore();
    f.forEach(function (e, g) {
        if (0 == g % 4) {
            var k = 10,
                b = 10;
            ctx.save();
            e.draw(ctx);
            ctx.clip();
            ctx.fillStyle = "#ff7442";
            ctx.shadowBlur = 12;
            ctx.shadowColor = "#ff423e";
            for (var l = 0; 10 > l; l++) ctx.translate(k, k), (ctx.globalAlpha = 1 - l / b), e.draw(ctx), ctx.fill();
            ctx.restore();
        } else {
            ctx.globalAlpha = 1;
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = "#111";
            ctx.shadowBlur = 125;
            ctx.shadowColor = "#fc9824";
            ctx.save();
            b = k = 1;
            for (l = 0; l < b; l += k) ctx.translate(-k, -k), (ctx.globalAlpha = 1 - l / b / 2), e.draw(ctx), ctx.fill();
            ctx.restore();
            ctx.stroke();
        }
    });
    n.forEach(function (e) {
        ctx.globalAlpha = 0.382;
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#ffdd1a";
        var g = 20 + 300 * Math.random();
        ctx.save();
        for (var k = 0; k < g; k += 1) ctx.translate(-1, -1), (ctx.globalAlpha = Math.pow((k / g) * 2, 10)), e.draw(ctx), ctx.stroke();
        ctx.restore();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#000";
        ctx.globalAlpha = 0.25;
        ctx.stroke();
    });
    var m = ctx.getImageData(0, 0, w, h);
    m.data = (function (e, g, k, b) {
        for (var l = 0; l < b; l++)
            for (var p = 0; p < k; p++) {
                var q = 4 * (l * k + p),
                    r = ~~((Math.random() - 0.5) * e);
                g[q] += r;
                g[q + 1] += r;
                g[q + 2] += r;
            }
        return g;
    })(32, m.data, w, h);
    ctx.putImageData(m, 0, 0);
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#fff";
    ctx.font = "12px verdana";
    ctx.fillText("click to reset", 16, h - 16);
}
window.addEventListener("mousedown", reset);
window.addEventListener("touchstart", reset);
reset();
function squareDistance(a, c, d, f) {
    return (a - d) * (a - d) + (c - f) * (c - f);
}
function distance(a, c) {
    return Math.sqrt(squareDistance(a.x, a.y, c.x, c.y));
}
function circleContainsPoint(a, c) {
    return distance(c, a) < c.radius;
}
function offsetPolygon(a, c) {
    for (var d = [], f = a.length, n = 0; n < f; n++) {
        var m = n - 1;
        0 > m && (m += f);
        var e = a[m],
            g = a[n];
        m = a[(n + 1) % f];
        var k = distance(g, e),
            b = new Point(-((g.y - e.y) / k) * c, ((g.x - e.x) / k) * c);
        k = distance(g, m);
        k = new Point(-((m.y - g.y) / k) * c, ((m.x - g.x) / k) * c);
        e = new Point(e.x + b.x, e.y + b.y);
        b = new Point(g.x + b.x, g.y + b.y);
        g = new Point(g.x + k.x, g.y + k.y);
        m = new Point(m.x + k.x, m.y + k.y);
        m = lineIntersectLine(e, b, g, m);
        null != m && d.push(m);
    }
    return d;
}
function lineIntersectLine(a, c, d, f, n, m) {
    var e = c.y - a.y;
    var g = a.x - c.x;
    var k = f.y - d.y;
    var b = d.x - f.x;
    var l = e * b - k * g;
    if (0 == l) return null;
    var p = c.x * a.y - a.x * c.y;
    var q = f.x * d.y - d.x * f.y;
    ip = new Point();
    ip.x = (g * q - b * p) / l;
    ip.y = (k * p - e * q) / l;
    a.x == c.x ? (ip.x = a.x) : d.x == f.x && (ip.x = d.x);
    a.y == c.y ? (ip.y = a.y) : d.y == f.y && (ip.y = d.y);
    return (n && ((a.x < c.x ? ip.x < a.x || ip.x > c.x : ip.x > a.x || ip.x < c.x) || (a.y < c.y ? ip.y < a.y || ip.y > c.y : ip.y > a.y || ip.y < c.y))) ||
        (m && ((d.x < f.x ? ip.x < d.x || ip.x > f.x : ip.x > d.x || ip.x < f.x) || (d.y < f.y ? ip.y < d.y || ip.y > f.y : ip.y > d.y || ip.y < f.y)))
        ? null
        : ip;
}
function lerp(a, c, d) {
    return c * (1 - a) + d * a;
}
