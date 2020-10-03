function getContext(w, h) {
  var can = document.createElement("canvas");
  document.body.appendChild(can);
  can.width = w || window.innerWidth;
  can.height = h || window.innerHeight;
  return can.getContext("2d");
}
var w = window.innerWidth;
var h = window.innerHeight;
var ctx = getContext(w, h);

var Point = function(x, y) {
  this.x = x;
  this.y = y;
};
Point.prototype.copy = function(p) {
  this.x = p.x;
  this.y = p.y;
  return this;
};
Point.prototype.add = function(p) {
  this.x += p.x;
  this.y += p.y;
  return this;
};
Point.prototype.clone = function() {
  return new Point(this.x, this.y);
};
Point.prototype.multiplyScalar = function(v) {
  this.x *= v;
  this.y *= v;
  return this;
};
Point.prototype.length = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};
Point.prototype.normalize = function() {
  var l = Math.sqrt(this.x * this.x + this.y * this.y);
  this.x /= l;
  this.y /= l;
  return this;
};

//circle size
var radius = Math.min(w, h) / 3;
var points = [];
var count = 300;
for (var i = 0; i < count; i++) {
  for (var j = 0; j < count; j++) {
    var x = j / count * radius - radius / 2;
    var y = i / count * radius - radius / 2;
    var p = new Point(x, y);
    p.origin = p.clone();
    p.life = Math.random() * 50;
    points.push(p);
  }
}

function curlNoise(p, scale, delta) {
  var p_x0 = noise.perlin2(scale * p.x - scale, p.y * scale);
  var p_x1 = noise.perlin2(scale * p.x + scale, p.y * scale);
  var p_y0 = noise.perlin2(scale * p.x, scale * p.y - scale);
  var p_y1 = noise.perlin2(scale * p.x, scale * p.y + scale);
  return new Point(p_y0 - p_y1, p_x0 - p_x1)
    .normalize()
    .multiplyScalar(1.0 / (2.0 * delta));
}

function raf() {
  requestAnimationFrame(raf);

  ctx.restore();
  ctx.fillStyle = "#000";
  ctx.strokeStyle = "#fff"
  ctx.globalAlpha = 15 / 0xff;
  ctx.fillRect(0, 0, w, h);
  //            ctx.clearRect(0,0,w,h);

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.globalAlpha = 0.2;

  var K = 25;
  var scale = 0.05;
  var time = Date.now() * 0.001;
  var d = new Point(Math.cos(time), Math.sin(time));

  var n = new Point(0, 0);
  var t = time * 2;// lerp( Math.abs( Math.sin( time * .01 ) ), time * 2, Math.sin( time ) * 10 ); 
  var o = new Point( time * 10, t );
  o.add(curlNoise(o, 0.05, 2));

  var length,x,y,r0 = radius;

  ctx.beginPath();
  points.forEach(function(p) {
    n.copy(p).add(o);
    var cp = curlNoise(n, scale, 1);
    p.add(cp);
    length = p.length();
    if (length > r0 * 0.45) return;

    //hyperbolic point
    x = p.x / (length + K) * r0;
    y = p.y / (length + K) * r0;

    ctx.moveTo(x, y);
    ctx.lineTo(x + 1, y);

    //bounds
    if (p.x > radius / 2) p.x -= radius;
    if (p.x < -radius / 2) p.x += radius;
    if (p.y > radius / 2) p.y -= radius;
    if (p.y < -radius / 2) p.y += radius;

    //respawn
    if (p.life-- < 0) {
      p.copy(p.origin);
      p.life = Math.random() * 100;
    }
  });
  ctx.stroke();
}
window.onload = raf;

function lerp ( t, a, b ){ return a * (1-t) + b * t; }
function norm( t, a, b ){return ( t - a ) / ( b - a );}
function map( t, a0, b0, a1, b1 ){ return lerp( norm( t, a0, b0 ), a1, b1 );}

/////////////////////////////////
/*
         * A speed-improved perlin and simplex noise algorithms for 2D.
         *
         * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
         * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
         * Better rank ordering method by Stefan Gustavson in 2012.
         * Converted to Javascript by Joseph Gentle.
         *
         * Version 2012-03-09
         *
         * This code was placed in the public domain by its original author,
         * Stefan Gustavson. You may use it as you see fit, but
         * attribution is appreciated.
         *https://github.com/josephg/noisejs
         */

(function(global) {
  var module = (global.noise = {});

  function Grad(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  Grad.prototype.dot2 = function(x, y) {
    return this.x * x + this.y * y;
  };

  Grad.prototype.dot3 = function(x, y, z) {
    return this.x * x + this.y * y + this.z * z;
  };

  var grad3 = [
    new Grad(1, 1, 0),
    new Grad(-1, 1, 0),
    new Grad(1, -1, 0),
    new Grad(-1, -1, 0),
    new Grad(1, 0, 1),
    new Grad(-1, 0, 1),
    new Grad(1, 0, -1),
    new Grad(-1, 0, -1),
    new Grad(0, 1, 1),
    new Grad(0, -1, 1),
    new Grad(0, 1, -1),
    new Grad(0, -1, -1)
  ];

  var p = [
    151,
    160,
    137,
    91,
    90,
    15,
    131,
    13,
    201,
    95,
    96,
    53,
    194,
    233,
    7,
    225,
    140,
    36,
    103,
    30,
    69,
    142,
    8,
    99,
    37,
    240,
    21,
    10,
    23,
    190,
    6,
    148,
    247,
    120,
    234,
    75,
    0,
    26,
    197,
    62,
    94,
    252,
    219,
    203,
    117,
    35,
    11,
    32,
    57,
    177,
    33,
    88,
    237,
    149,
    56,
    87,
    174,
    20,
    125,
    136,
    171,
    168,
    68,
    175,
    74,
    165,
    71,
    134,
    139,
    48,
    27,
    166,
    77,
    146,
    158,
    231,
    83,
    111,
    229,
    122,
    60,
    211,
    133,
    230,
    220,
    105,
    92,
    41,
    55,
    46,
    245,
    40,
    244,
    102,
    143,
    54,
    65,
    25,
    63,
    161,
    1,
    216,
    80,
    73,
    209,
    76,
    132,
    187,
    208,
    89,
    18,
    169,
    200,
    196,
    135,
    130,
    116,
    188,
    159,
    86,
    164,
    100,
    109,
    198,
    173,
    186,
    3,
    64,
    52,
    217,
    226,
    250,
    124,
    123,
    5,
    202,
    38,
    147,
    118,
    126,
    255,
    82,
    85,
    212,
    207,
    206,
    59,
    227,
    47,
    16,
    58,
    17,
    182,
    189,
    28,
    42,
    223,
    183,
    170,
    213,
    119,
    248,
    152,
    2,
    44,
    154,
    163,
    70,
    221,
    153,
    101,
    155,
    167,
    43,
    172,
    9,
    129,
    22,
    39,
    253,
    19,
    98,
    108,
    110,
    79,
    113,
    224,
    232,
    178,
    185,
    112,
    104,
    218,
    246,
    97,
    228,
    251,
    34,
    242,
    193,
    238,
    210,
    144,
    12,
    191,
    179,
    162,
    241,
    81,
    51,
    145,
    235,
    249,
    14,
    239,
    107,
    49,
    192,
    214,
    31,
    181,
    199,
    106,
    157,
    184,
    84,
    204,
    176,
    115,
    121,
    50,
    45,
    127,
    4,
    150,
    254,
    138,
    236,
    205,
    93,
    222,
    114,
    67,
    29,
    24,
    72,
    243,
    141,
    128,
    195,
    78,
    66,
    215,
    61,
    156,
    180
  ];
  // To remove the need for index wrapping, double the permutation table length
  var perm = new Array(512);
  var gradP = new Array(512);

  // This isn't a very good seeding function, but it works ok. It supports 2^16
  // different seed values. Write something better if you need more seeds.
  module.seed = function(seed) {
    if (seed > 0 && seed < 1) {
      // Scale the seed out
      seed *= 65536;
    }

    seed = Math.floor(seed);
    if (seed < 256) {
      seed |= seed << 8;
    }

    for (var i = 0; i < 256; i++) {
      var v;
      if (i & 1) {
        v = p[i] ^ (seed & 255);
      } else {
        v = p[i] ^ ((seed >> 8) & 255);
      }

      perm[i] = perm[i + 256] = v;
      gradP[i] = gradP[i + 256] = grad3[v % 12];
    }
  };

  module.seed(0);

  // ##### Perlin noise stuff

  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }

  // 2D Perlin Noise
  module.perlin2 = function(x, y) {
    // Find unit grid cell containing point
    var X = Math.floor(x),
      Y = Math.floor(y);
    // Get relative xy coordinates of point within that cell
    x = x - X;
    y = y - Y;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255;
    Y = Y & 255;

    // Calculate noise contributions from each of the four corners
    var n00 = gradP[X + perm[Y]].dot2(x, y);
    var n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1);
    var n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y);
    var n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1);

    // Compute the fade curve value for x
    var u = fade(x);

    // Interpolate the four results
    return lerp(lerp(n00, n10, u), lerp(n01, n11, u), fade(y));
  };
})(this);