(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var seedRandom = createCommonjsModule(function (module) {

  var width = 256;// each RC4 output is 0 <= x < 256
  var chunks = 6;// at least six RC4 outputs for each double
  var digits = 52;// there are 52 significant digits in a double
  var pool = [];// pool: entropy pool starts empty
  var GLOBAL = typeof commonjsGlobal === 'undefined' ? window : commonjsGlobal;

  //
  // The following constants are related to IEEE 754 limits.
  //
  var startdenom = Math.pow(width, chunks),
      significance = Math.pow(2, digits),
      overflow = significance * 2,
      mask = width - 1;


  var oldRandom = Math.random;

  //
  // seedrandom()
  // This is the seedrandom function described above.
  //
  module.exports = function(seed, options) {
    if (options && options.global === true) {
      options.global = false;
      Math.random = module.exports(seed, options);
      options.global = true;
      return Math.random;
    }
    var use_entropy = (options && options.entropy) || false;
    var key = [];

    // Flatten the seed string or build one from local entropy if needed.
    var shortseed = mixkey(flatten(
      use_entropy ? [seed, tostring(pool)] :
      0 in arguments ? seed : autoseed(), 3), key);

    // Use the seed to initialize an ARC4 generator.
    var arc4 = new ARC4(key);

    // Mix the randomness into accumulated entropy.
    mixkey(tostring(arc4.S), pool);

    // Override Math.random

    // This function returns a random double in [0, 1) that contains
    // randomness in every bit of the mantissa of the IEEE 754 value.

    return function() {         // Closure to return a random double:
      var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
          d = startdenom,                 //   and denominator d = 2 ^ 48.
          x = 0;                          //   and no 'extra last byte'.
      while (n < significance) {          // Fill up all significant digits by
        n = (n + x) * width;              //   shifting numerator and
        d *= width;                       //   denominator and generating a
        x = arc4.g(1);                    //   new least-significant-byte.
      }
      while (n >= overflow) {             // To avoid rounding up, before adding
        n /= 2;                           //   last byte, shift everything
        d /= 2;                           //   right using integer Math until
        x >>>= 1;                         //   we have exactly the desired bits.
      }
      return (n + x) / d;                 // Form the number within [0, 1).
    };
  };

  module.exports.resetGlobal = function () {
    Math.random = oldRandom;
  };

  //
  // ARC4
  //
  // An ARC4 implementation.  The constructor takes a key in the form of
  // an array of at most (width) integers that should be 0 <= x < (width).
  //
  // The g(count) method returns a pseudorandom integer that concatenates
  // the next (count) outputs from ARC4.  Its return value is a number x
  // that is in the range 0 <= x < (width ^ count).
  //
  /** @constructor */
  function ARC4(key) {
    var t, keylen = key.length,
        me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

    // The empty key [] is treated as [0].
    if (!keylen) { key = [keylen++]; }

    // Set up S using the standard key scheduling algorithm.
    while (i < width) {
      s[i] = i++;
    }
    for (i = 0; i < width; i++) {
      s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
      s[j] = t;
    }

    // The "g" method returns the next (count) outputs as one number.
    (me.g = function(count) {
      // Using instance members instead of closure state nearly doubles speed.
      var t, r = 0,
          i = me.i, j = me.j, s = me.S;
      while (count--) {
        t = s[i = mask & (i + 1)];
        r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
      }
      me.i = i; me.j = j;
      return r;
      // For robust unpredictability discard an initial batch of values.
      // See http://www.rsa.com/rsalabs/node.asp?id=2009
    })(width);
  }

  //
  // flatten()
  // Converts an object tree to nested arrays of strings.
  //
  function flatten(obj, depth) {
    var result = [], typ = (typeof obj)[0], prop;
    if (depth && typ == 'o') {
      for (prop in obj) {
        try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
      }
    }
    return (result.length ? result : typ == 's' ? obj : obj + '\0');
  }

  //
  // mixkey()
  // Mixes a string seed into a key that is an array of integers, and
  // returns a shortened string seed that is equivalent to the result key.
  //
  function mixkey(seed, key) {
    var stringseed = seed + '', smear, j = 0;
    while (j < stringseed.length) {
      key[mask & j] =
        mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
    }
    return tostring(key);
  }

  //
  // autoseed()
  // Returns an object for autoseeding, using window.crypto if available.
  //
  /** @param {Uint8Array=} seed */
  function autoseed(seed) {
    try {
      GLOBAL.crypto.getRandomValues(seed = new Uint8Array(width));
      return tostring(seed);
    } catch (e) {
      return [+new Date, GLOBAL, GLOBAL.navigator && GLOBAL.navigator.plugins,
              GLOBAL.screen, tostring(pool)];
    }
  }

  //
  // tostring()
  // Converts an array of charcodes to a string
  //
  function tostring(a) {
    return String.fromCharCode.apply(0, a);
  }

  //
  // When seedrandom.js is loaded, we immediately mix a few bits
  // from the built-in RNG into the entropy pool.  Because we do
  // not want to intefere with determinstic PRNG state later,
  // seedrandom will not call Math.random on its own again after
  // initialization.
  //
  mixkey(Math.random(), pool);
  });
  var seedRandom_1 = seedRandom.resetGlobal;

  class index {
    constructor(
      width,
      height,
      {
        initiate_chance = 0.8,
        extension_chance = 0.8,
        vertical_chance = 0.8,
        horizontal_symmetry = true,
        vertical_symmetry = false,
        roundness = 0.1,
        solidness = 0.5,
        colors = [],
        color_mode = 'group',
        group_size = 0.8,
        simple = false,
        simplex = null,
        rate_of_change = 0.01,
      } = {}
    ) {
      this.xdim = Math.round(width * 2 + 11, 0);
      this.ydim = Math.round(height * 2 + 11, 0);
      this.radius_x = width;
      this.radius_y = height;
      this.chance_new = initiate_chance;
      this.chance_extend = extension_chance;
      this.chance_vertical = vertical_chance;
      this.colors = colors;
      this.color_mode = color_mode;
      this.group_size = group_size;
      this.h_symmetric = horizontal_symmetry;
      this.v_symmetric = vertical_symmetry;
      this.roundness = roundness;
      this.solidness = solidness;
      this.simple = simple;
      this.simplex = simplex;
      this.rate_of_change = rate_of_change;
      this.global_seed = Math.random();
    }

    generate(initial_top = null, initial_left = null, verbose = false, idx = 0, idy = 0) {
      this.idx = idx;
      this.idy = idy;

      this.main_color = this.get_random(this.colors, 1, 1);
      this.id_counter = 0;

      let grid = new Array(this.ydim + 1);
      for (var i = 0; i < grid.length; i++) {
        grid[i] = new Array(this.xdim + 1);
        for (var j = 0; j < grid[i].length; j++) {
          if (i == 0 || j == 0) grid[i][j] = { h: false, v: false, in: false, col: null };
          else if (i == 1 && initial_top != null) grid[i][j] = { ...initial_top[j], h: true };
          else if (j == 1 && initial_left != null) grid[i][j] = { ...initial_left[i], v: true };
          else if (this.h_symmetric && j > grid[i].length / 2) {
            grid[i][j] = deep_copy(grid[i][grid[i].length - j]);
            grid[i][j].v = grid[i][grid[i].length - j + 1].v;
          } else if (this.v_symmetric && i > grid.length / 2) {
            grid[i][j] = deep_copy(grid[grid.length - i][j]);
            grid[i][j].h = grid[grid.length - i + 1][j].h;
          } else {
            grid[i][j] = this.next_block(j, i, grid[i][j - 1], grid[i - 1][j]);
          }
        }
      }
      let rects = convert_linegrid_to_rectangles(grid);
      return verbose ? [rects, grid] : rects;
    }

    next_block(x, y, left, top) {
      const context = this;

      if (!left.in && !top.in) {
        return block_set_1(x, y);
      }

      if (left.in && !top.in) {
        if (left.h) return block_set_3(x, y);
        return block_set_2(x, y);
      }

      if (!left.in && top.in) {
        if (top.v) return block_set_5(x, y);
        return block_set_4(x, y);
      }

      if (left.in && top.in) {
        if (!left.h && !top.v) return block_set_6();
        if (left.h && !top.v) return block_set_7(x, y);
        if (!left.h && top.v) return block_set_8(x, y);
        return block_set_9(x, y);
      }

      // --- Block sets ----

      function block_set_1(x, y) {
        if (start_new_from_blank(x, y)) return new_block(x, y);
        return { v: false, h: false, in: false, col: null, id: null };
      }

      function block_set_2(x, y) {
        if (start_new_from_blank(x, y)) return new_block(x, y);
        return { v: true, h: false, in: false, col: null, id: null };
      }

      function block_set_3(x, y) {
        if (extend(x, y)) return { v: false, h: true, in: true, col: left.col, id: left.id };
        return block_set_2(x, y);
      }

      function block_set_4(x, y) {
        if (start_new_from_blank(x, y)) return new_block(x, y);
        return { v: false, h: true, in: false, col: null, id: null };
      }

      function block_set_5(x, y) {
        if (extend(x, y)) return { v: true, h: false, in: true, col: top.col, id: top.id };
        return block_set_4(x, y);
      }

      function block_set_6() {
        return { v: false, h: false, in: true, col: left.col, id: left.id };
      }

      function block_set_7(x, y) {
        if (extend(x, y)) return { v: false, h: true, in: true, col: left.col, id: left.id };
        if (start_new(x, y)) return new_block(x, y);
        return { v: true, h: true, in: false, col: null, id: null };
      }

      function block_set_8(x, y) {
        if (extend(x, y)) return { v: true, h: false, in: true, col: top.col, id: top.id };
        if (start_new(x, y)) return new_block(x, y);
        return { v: true, h: true, in: false, col: null, id: null };
      }

      function block_set_9(x, y) {
        if (vertical_dir(x, y)) return { v: true, h: false, in: true, col: top.col, id: top.id };
        return { v: false, h: true, in: true, col: left.col, id: left.id };
      }

      // ---- Blocks ----

      function new_block(nx, ny) {
        let col;
        if (context.color_mode === 'random') {
          col = context.get_random(context.colors, nx, ny);
        } else if (context.color_mode === 'main') {
          col = context.noise(x, y, '_main') > 0.75 ? context.get_random(context.colors, x, y) : context.main_color;
        } else if (context.color_mode === 'group') {
          let keep = context.noise(x, y, '_keep') > 0.5 ? left.col : top.col;
          context.main_color =
            context.noise(x, y, '_group') > context.group_size
              ? context.get_random(context.colors, x, y)
              : keep || context.main_color;
          col = context.main_color;
        } else {
          col = context.main_color;
        }

        return { v: true, h: true, in: true, col: col, id: context.id_counter++ };
      }

      // ---- Decisions ----

      function start_new_from_blank(x, y) {
        if (context.simple) return true;
        if (!active_position(x, y, -1 * (1 - context.roundness))) return false;
        return context.noise(x, y, '_blank') <= context.solidness;
      }

      function start_new(x, y) {
        if (context.simple) return true;
        if (!active_position(x, y, 0)) return false;
        return context.noise(x, y, '_new') <= context.chance_new;
      }

      function extend(x, y) {
        if (!active_position(x, y, 1 - context.roundness) && !context.simple) return false;
        return context.noise(x, y, '_extend') <= context.chance_extend;
      }

      function vertical_dir(x, y) {
        return context.noise(x, y, '_vert') <= context.chance_vertical;
      }

      function active_position(x, y, fuzzy) {
        let fuzziness = 1 + context.noise(x, y, '_active') * fuzzy;
        let xa = Math.pow(x - context.xdim / 2, 2) / Math.pow(context.radius_x * fuzziness, 2);
        let ya = Math.pow(y - context.ydim / 2, 2) / Math.pow(context.radius_y * fuzziness, 2);
        return xa + ya < 1;
      }
    }

    noise(nx, ny, nz = '') {
      if (!this.simplex) return Math.random();
      const rng = seedRandom('' + this.global_seed + nx + ny + nz);
      const n = this.simplex.noise3D(this.idx * this.rate_of_change, this.idy * this.rate_of_change, rng() * 23.4567);
      return (n + 1) / 2;
    }

    get_random(array, nx, ny) {
      return array[Math.floor(this.noise(nx, ny, '_array') * array.length)];
    }
  }

  function deep_copy(obj) {
    let nobj = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        nobj[key] = obj[key];
      }
    }
    return nobj;
  }

  // --- Conversion ---
  function convert_linegrid_to_rectangles(grid) {
    let nw_corners = get_nw_corners(grid);
    extend_corners_to_rectangles(nw_corners, grid);
    return nw_corners;
  }

  function get_nw_corners(grid) {
    let nw_corners = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        let cell = grid[i][j];
        if (cell.h && cell.v && cell.in) nw_corners.push({ x1: j, y1: i, col: cell.col, id: cell.id });
      }
    }
    return nw_corners;
  }

  function extend_corners_to_rectangles(corners, grid) {
    corners.map(c => {
      let accx = 1;
      while (c.x1 + accx < grid[c.y1].length && !grid[c.y1][c.x1 + accx].v) {
        accx++;
      }
      let accy = 1;
      while (c.y1 + accy < grid.length && !grid[c.y1 + accy][c.x1].h) {
        accy++;
      }
      c.w = accx;
      c.h = accy;
      return c;
    });
  }

  var intlrail = [
{
    name: 'intlrail',
    colors: ['#1c1c1e', '#242426', '#2c2c2e', '#363638',
        '#3a3a3c', '#444446', '#48484a', '#545456', '#636366'],
    background: '#000000',
}
  ];

  var misc = [
    {
      name: 'frozen-rose',
      colors: ['#29368f', '#e9697b', '#1b164d', '#f7d996'],
      background: '#f2e8e4',
    },
  ];

  const pals = misc.concat(
    intlrail
  );

  var palettes = pals.map((p) => {
    p.size = p.colors.length;
    return p;
  });

  function getRandom() {
    return palettes[Math.floor(Math.random() * palettes.length)];
  }

  function get(name) {
    if (name === undefined) return getRandom();
    return palettes.find(pal => pal.name == name);
  }

  let sketch = function(p) {
    let THE_SEED;

    const mag = 12;
    const xu = [1 * mag, -0.5 * mag]; // X Unit
    const yu = [1 * mag, 0.5 * mag]; // Y Unit
    //const xu = [1 * mag, 0 * mag]; // X Unit
    //const yu = [0 * mag, 1 * mag]; // Y Unit

    const palette = get_palette();

    const top = [];
    for (let i = 0; i < 16 * 2 + 11; i++) {
      top.push({ h: false, v: true, in: true, col: '#f88' });
    }

    const left = [];
    for (let i = 0; i < 25 * 2 + 11; i++) {
      left.push({ h: true, v: false, in: true, col: '#f88' });
    }

    const generator = new index(16, 16, {
      simple: true,
      extension_chance: 0.97,
      horizontal_symmetry: false,
      vertical_chance: 0.2,
      initial_top: top,
      initial_left: left
    });

    const innerApparatusOptions = {
      simple: true,
      extension_chance: 0.8,
      horizontal_symmetry: false,
      vertical_chance: 0.2,
      color_mode: 'main',
      colors: palette.colors
    };

    let layout;
    let tick;

    p.setup = function() {
      p.createCanvas(innerWidth, innerHeight);
      THE_SEED = p.floor(p.random(9999999));
      p.randomSeed(THE_SEED);
      p.noFill();
      p.smooth();
      p.frameRate(0.5);
      p.stroke(palette.stroke ? palette.stroke : '#eee');
      p.background(palette.background ? palette.background : '#000');

      tick = 0;
    };

    p.draw = function() {
      if (tick % 9 == 0) reset();
      displayLayout(tick % 9, true);
      tick++;
    };

    p.keyPressed = function() {
      if (p.keyCode === 80) p.saveCanvas('sheet_' + THE_SEED, 'png');
    };

    function reset() {
      p.background(palette.background ? palette.background : '#000');
      layout = generator
        .generate()
        .map(b => ({ ...b, level: 0, filled: false, content: createGrid(b) }));
    }

    function displayLayout(depth, colorize) {
      p.translate(300, 500);
      layout.forEach(box => {
        displayBox(box, depth, colorize);
      });
    }

    function displayBox(box, maxLevel, colorize) {
      if (box.content != null && box.content.length > 0 && maxLevel > box.level) {
        box.content.forEach(c => displayBox(c, maxLevel, colorize));
      }

      if (box.filled && colorize) p.fill(box.col);
      else p.noFill();

      p.strokeWeight(2 / (box.level + 1));
      p.beginShape();
      p.vertex(box.x1 * xu[0] + box.y1 * yu[0], box.x1 * xu[1] + box.y1 * yu[1]);
      p.vertex(
        (box.x1 + box.w) * xu[0] + box.y1 * yu[0],
        (box.x1 + box.w) * xu[1] + box.y1 * yu[1]
      );
      p.vertex(
        (box.x1 + box.w) * xu[0] + (box.y1 + box.h) * yu[0],
        (box.x1 + box.w) * xu[1] + (box.y1 + box.h) * yu[1]
      );
      p.vertex(
        box.x1 * xu[0] + (box.y1 + box.h) * yu[0],
        box.x1 * xu[1] + (box.y1 + box.h) * yu[1]
      );
      p.endShape(p.CLOSE);

      if (colorize && box.filled && box.h > 1.5 && box.w > 3) {
        displayLegend(box);
      }

      if (colorize && box.filled && box.crossed) {
        displayCross(box);
      }
    }

    function displayLegend(box) {
      p.line(
        (box.x1 + 0.5) * xu[0] + (box.y1 + 0.5) * yu[0],
        (box.x1 + 0.5) * xu[1] + (box.y1 + 0.5) * yu[1],
        (box.x1 + box.legend_width) * xu[0] + (box.y1 + 0.5) * yu[0],
        (box.x1 + box.legend_width) * xu[1] + (box.y1 + 0.5) * yu[1]
      );
    }

    function displayCross(box) {
      p.line(
        box.x1 * xu[0] + box.y1 * yu[0],
        box.x1 * xu[1] + box.y1 * yu[1],
        (box.x1 + box.w) * xu[0] + (box.y1 + box.h) * yu[0],
        (box.x1 + box.w) * xu[1] + (box.y1 + box.h) * yu[1]
      );
      p.line(
        (box.x1 + box.w) * xu[0] + box.y1 * yu[0],
        (box.x1 + box.w) * xu[1] + box.y1 * yu[1],
        box.x1 * xu[0] + (box.y1 + box.h) * yu[0],
        box.x1 * xu[1] + (box.y1 + box.h) * yu[1]
      );
    }

    function createGrid(box) {
      const { x1, y1, w, h } = box;
      const cols = Math.ceil((Math.random() * w) / 4);
      const rows = Math.ceil((Math.random() * h) / 2);
      const cell_w = w / cols;
      const cell_h = h / rows;

      const apparatus = createApparatus(cell_w, cell_h);

      const grid = [];
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const cell = {
            x1: x1 + j * cell_w,
            y1: y1 + i * cell_h,
            w: cell_w,
            h: cell_h,
            level: 1,
            filled: false
          };
          const content = apparatus.map(app => ({
            ...app,
            x1: app.x1 + cell.x1,
            y1: app.y1 + cell.y1,
            level: 2,
            filled: true,
            crossed: app.w < 1.5 && app.h < 1.5 && Math.random() < 0.3,
            legend_width: 2 + Math.random() * (app.w - 3)
          }));

          grid.push({ ...cell, content: content });
        }
      }
      return grid;
    }

    function createApparatus(w, h) {
      const cols = Math.round(w, 0);
      const rows = Math.round(h, 0);

      const w_unit = w / cols;
      const h_unit = h / rows;

      const generator = new index(
        (cols - 11) / 2,
        (rows - 11) / 2,
        innerApparatusOptions
      );

      return generator.generate().map(a => ({
        x1: (a.x1 - 1) * w_unit,
        y1: (a.y1 - 1) * h_unit,
        w: a.w * w_unit,
        h: a.h * h_unit,
        col: a.col
      }));
    }
  };

  new p5(sketch);

  function get_palette() {
    const url = window.location.href.split('#');
    if (url.length === 1) return get('intlrail');
    return get(url[1]);
  }

})));
