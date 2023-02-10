export const Num = {
  difference: function(a, b) {
    return Math.abs(a - b);
  },

  norm: function (value, min, max) {
    return (value - min) / (max - min);
  },

  lerp: function (min, max, t) {
    return min + (max - min) * t;
  },

  wrap: function(value, min, max) {
    const range = max - min;
    return min + ((((value - min) % range) + range) % range);
  },

  map: function (srcValue, srcMin, srcMax, dstMin, dstMax) {
    const norm = this.norm(srcValue, srcMin, srcMax);
    return this.lerp(dstMin, dstMax, norm);
  },

  clamp: function (value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  roundTo: function(value, decimal) {
    const mult = Math.pow(10, decimal);
    return Math.round(value * mult) / mult;
  },

  roundToNearest: function(value, mult) {
    return Math.round(value / mult) * mult;
  },

  sinRange: function(angle, min, max) {
    return Num.map(Math.sin(angle), -1, 1, min, max);
  },

  cosRange: function(angle, min, max) {
    return Num.map(Math.cos(angle), -1, 1, min, max);
  },

  lerpSin: function(value, max, min) {
    return Num.sinRange(value * Math.PI * 2, min, max);
  },

  equalish: function(a, b, delta) {
    return Num.difference(a, b) < delta;
  },

  dotProduct: function(x0, y0, x1, y1, x2, y2, x3, y3) {
    const dx0 = x1 - x0,
      dy0 = y1 - y0,
      dx1 = x3 - x2,
      dy1 = y3 - y2;
    return dx0 * dx1 + dy0 * dy1;
  },

  angleBetween: function(x0, y0, x1, y1, x2, y2, x3, y3) {
    const dp = this.dotProduct(x0, y0, x1, y1, x2, y2, x3, y3),
      mag0 = this.dist(x0, y0, x1, y1),
      mag1 = this.dist(x2, y2, x3, y3);
    return Math.acos(dp / mag0 / mag1);
  },

  polarToPoint: function (angle, radius) {
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  },

  pointToPolar: function(p) {
    return {
      angle: Math.atan2(p.y, p.x),
      radius: this.magnitude(p),
    };
  },

  magnitude: function(p) {
    return this.dist(0, 0, p.x, p.y);
  },

  dist: function (x0, y0, x1, y1) {
    if (arguments.length === 2) {
      return this.dist(x0.x, x0.y, y0.x, y0.y);
    }
    const dx = x1 - x0,
      dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
  },

  lerpPoint: function(p0, p1, t) {
    return {
      x: this.lerp(p0.x, p1.x, t),
      y: this.lerp(p0.y, p1.y, t),
    };
  },

  bezier: function(p0, p1, p2, p3, t) {
    const oneMinusT = 1 - t,
      m0 = oneMinusT * oneMinusT * oneMinusT,
      m1 = 3 * oneMinusT * oneMinusT * t,
      m2 = 3 * oneMinusT * t * t,
      m3 = t * t * t;
    return {
      x: m0 * p0.x + m1 * p1.x + m2 * p2.x + m3 * p3.x,
      y: m0 * p0.y + m1 * p1.y + m2 * p2.y + m3 * p3.y,
    };
  },

  quadratic: function(p0, p1, p2, t) {
    const oneMinusT = 1 - t,
      m0 = oneMinusT * oneMinusT,
      m1 = 2 * oneMinusT * t,
      m2 = t * t;
    return {
      x: m0 * p0.x + m1 * p1.x + m2 * p2.x,
      y: m0 * p0.y + m1 * p1.y + m2 * p2.y,
    };
  },

  pointInCircle: function(px, py, cx, cy, cr) {
    const dist = this.dist(px, py, cx, cy);
    return dist <= cr;
  },

  pointInRect: function(px, py, rx, ry, rw, rh) {
    return px >= rx &&
      py >= ry &&
      px <= rx + rw &&
      py <= ry + rh;
  },

  _abcFromPoints: function(p0, p1) {
    const a = p1.y - p0.y;
    const b = p0.x - p1.x;
    const c = a * p0.x + b * p0.y;
    return { a, b, c };
  },

  /**
   * Finds the point where two lines intersect.
   */
  lineIntersect: function(p0, p1, p2, p3) {
    const line0 = Num._abcFromPoints(p0, p1);
    const line1 = Num._abcFromPoints(p2, p3);
    return Num._lineIntersectABC(line0.a, line0.b, line0.c, line1.a, line1.b, line1.c);
  },

  _lineIntersectABC: function(a0, b0, c0, a1, b1, c1) {
    const d = a0 * b1 - a1 * b0;

    if (d === 0) {
      return null;
    }
    return {
      x: (b1 * c0 - b0 * c1) / d,
      y: (a0 * c1 - a1 * c0) / d,
    };
  },

  /**
   * Finds the point where two line segments intersect (if any).
   */
  segmentIntersect: function(p0, p1, p2, p3) {
    const pI = Num.lineIntersect(p0, p1, p2, p3);

    const rx0 = (pI.x - p0.x) / (p1.x - p0.x);
    const ry0 = (pI.y - p0.y) / (p1.y - p0.y);
    const rx1 = (pI.x - p2.x) / (p3.x - p2.x);
    const ry1 = (pI.y - p2.y) / (p3.y - p2.y);

    if (((rx0 >= 0 && rx0 <= 1) || (ry0 >= 0 && ry0 <= 1)) &&
      ((rx1 >= 0 && rx1 <= 1) || (ry1 >= 0 && ry1 <= 1))) {
      return pI;
    }
    return null;
  },

  _perpBisector(p0, p1, line) {
    const midx = (p0.x + p1.x) / 2;
    const midy = (p0.y + p1.y) / 2;
    const c = -line.b * midx + line.a * midy;
    const a = -line.b;
    const b = line.a;
    return {a, b, c};
  },

  circumCenter: function(p0, p1, p2) {
    const line0 = Num._abcFromPoints(p0, p1);
    const bs0 = Num._perpBisector(p0, p1, line0);
    const line1 = Num._abcFromPoints(p1, p2);
    const bs1 = Num._perpBisector(p1, p2, line1);

    return Num._lineIntersectABC(bs0.a, bs0.b, bs0.c, bs1.a, bs1.b, bs1.c);
  },

  centroid: function(p0, p1, p2) {
    return {
      x: (p0.x + p1.x + p2.x) / 3,
      y: (p0.y + p1.y + p2.y) / 3,
    };
  },

  orthoCenter: function(p0, p1, p2) {
    const cc = Num.circumCenter(p0, p1, p2);
    if (!cc) {
      return null;
    }
    const ct = Num.centroid(p0, p1, p2);
    return {
      x: 3 * ct.x - 2 * cc.x,
      y: 3 * ct.y - 2 * cc.y,
    };
  },

  tangentPointToCircle: function(x, y, cx, cy, cr, anticlockwise) {
    const dist = Math.dist(x, y, cx, cy),
      dir = anticlockwise ? 1 : -1,
      angle = Math.acos(-cr / dist) * dir,
      baseAngle = Math.atan2(cy - y, cx - x),
      totalAngle = baseAngle + angle;

    return {
      x: cx + Math.cos(totalAngle) * cr,
      y: cy + Math.sin(totalAngle) * cr,
    };
  },

  hexPoint: function(x, y, size, xfirst) {
    const sin60r = Math.sin(Math.PI / 3) * size;
    const xInc = 2 * sin60r;
    const yInc = size * 1.5;
    const offset = y % 2 * sin60r;
    const xx = (x * xInc + offset);
    const yy = (y * yInc);
    if (xfirst) {
      return {x: xx, y: yy};
    }
    return {x: yy, y: xx};
  },

};
