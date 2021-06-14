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
        simple = true,
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
  
{name: 'intlrail',
    colors: ['#1c1c1e', '#242426', '#2c2c2e', '#363638', '#3a3a3c', '#444446',
    '#48484a', '#545456', '#636366', '#6c6c70', '#7c7c80', '#8e8e8e', '#8e8e93',
    '#aeaeb2', '#aeaeb2', '#bcbcc0', '#c7c7cc', '#d1d1d6', '#d8d8dc', '#e5e5ea',
    '#ebebf0', '#f2f2f7'],
    // background: '#000',
    stroke: '#2b2b2b'
}
  ];


  const pals = intlrail

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

  /**
   * Topological sorting function
   *
   * @param {Array} edges
   * @returns {Array}
   */

  var toposort_1 = function(edges) {
    return toposort(uniqueNodes(edges), edges)
  };

  var array = toposort;

  function toposort(nodes, edges) {
    var cursor = nodes.length
      , sorted = new Array(cursor)
      , visited = {}
      , i = cursor
      // Better data structures make algorithm much faster.
      , outgoingEdges = makeOutgoingEdges(edges)
      , nodesHash = makeNodesHash(nodes);

    // check for unknown nodes
    edges.forEach(function(edge) {
      if (!nodesHash.has(edge[0]) || !nodesHash.has(edge[1])) {
        throw new Error('Unknown node. There is an unknown node in the supplied edges.')
      }
    });

    while (i--) {
      if (!visited[i]) visit(nodes[i], i, new Set());
    }

    return sorted

    function visit(node, i, predecessors) {
      if(predecessors.has(node)) {
        var nodeRep;
        try {
          nodeRep = ", node was:" + JSON.stringify(node);
        } catch(e) {
          nodeRep = "";
        }
        throw new Error('Cyclic dependency' + nodeRep)
      }

      if (!nodesHash.has(node)) {
        throw new Error('Found unknown node. Make sure to provided all involved nodes. Unknown node: '+JSON.stringify(node))
      }

      if (visited[i]) return;
      visited[i] = true;

      var outgoing = outgoingEdges.get(node) || new Set();
      outgoing = Array.from(outgoing);

      if (i = outgoing.length) {
        predecessors.add(node);
        do {
          var child = outgoing[--i];
          visit(child, nodesHash.get(child), predecessors);
        } while (i)
        predecessors.delete(node);
      }

      sorted[--cursor] = node;
    }
  }

  function uniqueNodes(arr){
    var res = new Set();
    for (var i = 0, len = arr.length; i < len; i++) {
      var edge = arr[i];
      res.add(edge[0]);
      res.add(edge[1]);
    }
    return Array.from(res)
  }

  function makeOutgoingEdges(arr){
    var edges = new Map();
    for (var i = 0, len = arr.length; i < len; i++) {
      var edge = arr[i];
      if (!edges.has(edge[0])) edges.set(edge[0], new Set());
      if (!edges.has(edge[1])) edges.set(edge[1], new Set());
      edges.get(edge[0]).add(edge[1]);
    }
    return edges
  }

  function makeNodesHash(arr){
    var res = new Map();
    for (var i = 0, len = arr.length; i < len; i++) {
      res.set(arr[i], i);
    }
    return res
  }
  toposort_1.array = array;

  /*** sketch options ***/

  let sketch = function(p) {
    let THE_SEED;

    const cubedim = 1;
    const mag = 25;

    const xr = -Math.PI / 6;
    const yr = Math.PI / 2;
    const zr = Math.PI / 6;

    const xu = [Math.cos(xr) * mag, Math.sin(xr) * mag]; // X Unit
    const yu = [Math.cos(yr) * mag, Math.sin(yr) * mag]; // Y Unit
    const zu = [Math.cos(zr) * mag, Math.sin(zr) * mag]; // Z Unit
    const nxu = xu.map(v => -v);
    const nyu = yu.map(v => -v);
    const nzu = zu.map(v => -v);

    const maxDepth = 1;
    const depthSteps = 8;

    const palette = get_palette();
    const shade = [0, 80];
    const none = [0, 40];
    const light = [0, 0];
    const stroke = [0, 40];

    const generator = new index(cubedim, cubedim, {
      simple: true,
      extension_chance: 0.95,
      horizontal_symmetry: false,
      vertical_chance: 0.5
    });

    const innerApparatusOptions = {
      simple: true,
      extension_chance: 0.8,
      horizontal_symmetry: false,
      vertical_chance: 0.5,
      color_mode: 'group',
      group_size: 0.4,
      colors: palette.colors
    };

    let frontLayout, leftLayout, topLayout;

    p.setup = function() {
      p.createCanvas(innerWidth, innerHeight);
      THE_SEED = p.floor(p.random(9999999));
      p.randomSeed(THE_SEED);
      p.noFill();
      p.smooth();
      p.frameRate(0);
      p.noLoop();
      // p.background(palette.background ? palette.background : '#eee');
      p.strokeJoin(p.ROUND);

      p.draw();
    };

    p.draw = function() {
      reset();
      displayLayout(4, true);
    };

    p.keyPressed = function() {
      if (p.keyCode === 80) p.saveCanvas('isocube_' + THE_SEED, 'png');
    };

    function reset() {
      // p.background(palette.background ? palette.background : '#eee');
      p.translate(p.width / 2, p.height / 2);

      const frontApp = generator.generate(null, null, true);
      const leftApp = generator.generate(
        frontApp[1].map(i => ({ ...i[1], v: i[1].h })),
        null,
        true
      );
      const topApp = generator.generate(
        leftApp[1].map(i => ({ ...i[1], v: i[1].h })),
        frontApp[1][1].map(i => ({ ...i, h: i.v })),
        true
      );

      const frontGrids = frontApp[0].map(a => createGrid(a, null, null));
      const leftGrids = leftApp[0].map(a => createGrid(a, frontGrids, null));
      const topGrids = topApp[0].map(a => createGrid(a, leftGrids, frontGrids));

      frontLayout = get_overlap_graph(frontGrids.flatMap(g => g.content));
      leftLayout = get_overlap_graph(leftGrids.flatMap(g => g.content));
      topLayout = get_overlap_graph(topGrids.flatMap(g => g.content));
    }

    function displayLayout(depth, colorize) {
      frontLayout.forEach(i =>
        displayBox(i, depth, colorize, xu, yu, zu, [none, shade, light])
      );
      leftLayout.forEach(i =>
        displayBox(i, depth, colorize, yu, nzu, nxu, [shade, light, none])
      );
      topLayout.forEach(i =>
        displayBox(i, depth, colorize, nzu, xu, nyu, [light, none, shade])
      );
    }

    function displayBox(box, maxLevel, colorize, xu, yu, zu, shades) {
      if (box.content != null && box.content.length > 0 && maxLevel > box.level) {
        box.content.forEach(c => displayBox(c, maxLevel, colorize));
      }

      if (box.filled && colorize) p.fill(box.col);
      else p.noFill();

      p.stroke(stroke[0], stroke[1]);

      p.beginShape();
      p.vertex(
        box.x1 * xu[0] + box.y1 * yu[0] + box.z1 * zu[0],
        box.x1 * xu[1] + box.y1 * yu[1] + box.z1 * zu[1]
      );
      p.vertex(
        (box.x1 + box.w) * xu[0] + box.y1 * yu[0] + box.z1 * zu[0],
        (box.x1 + box.w) * xu[1] + box.y1 * yu[1] + box.z1 * zu[1]
      );
      p.vertex(
        (box.x1 + box.w) * xu[0] + (box.y1 + box.h) * yu[0] + box.z1 * zu[0],
        (box.x1 + box.w) * xu[1] + (box.y1 + box.h) * yu[1] + box.z1 * zu[1]
      );
      p.vertex(
        box.x1 * xu[0] + (box.y1 + box.h) * yu[0] + box.z1 * zu[0],
        box.x1 * xu[1] + (box.y1 + box.h) * yu[1] + box.z1 * zu[1]
      );
      p.endShape(p.CLOSE);

      p.beginShape();
      p.vertex(
        box.x1 * xu[0] + box.y1 * yu[0] + box.z1 * zu[0],
        box.x1 * xu[1] + box.y1 * yu[1] + box.z1 * zu[1]
      );
      p.vertex(
        box.x1 * xu[0] + (box.y1 + box.h) * yu[0] + box.z1 * zu[0],
        box.x1 * xu[1] + (box.y1 + box.h) * yu[1] + box.z1 * zu[1]
      );
      p.vertex(
        box.x1 * xu[0] + (box.y1 + box.h) * yu[0],
        box.x1 * xu[1] + (box.y1 + box.h) * yu[1]
      );
      p.vertex(box.x1 * xu[0] + box.y1 * yu[0], box.x1 * xu[1] + box.y1 * yu[1]);
      p.endShape(p.CLOSE);

      p.beginShape();
      p.vertex(
        box.x1 * xu[0] + box.y1 * yu[0] + box.z1 * zu[0],
        box.x1 * xu[1] + box.y1 * yu[1] + box.z1 * zu[1]
      );
      p.vertex(
        (box.x1 + box.w) * xu[0] + box.y1 * yu[0] + box.z1 * zu[0],
        (box.x1 + box.w) * xu[1] + box.y1 * yu[1] + box.z1 * zu[1]
      );
      p.vertex(
        (box.x1 + box.w) * xu[0] + box.y1 * yu[0],
        (box.x1 + box.w) * xu[1] + box.y1 * yu[1]
      );
      p.vertex(box.x1 * xu[0] + box.y1 * yu[0], box.x1 * xu[1] + box.y1 * yu[1]);
      p.endShape(p.CLOSE);

      {
        p.noStroke();

        p.fill(shades[0][0], shades[0][1]);
        p.beginShape();
        p.vertex(
          box.x1 * xu[0] + box.y1 * yu[0] + box.z1 * zu[0],
          box.x1 * xu[1] + box.y1 * yu[1] + box.z1 * zu[1]
        );
        p.vertex(
          (box.x1 + box.w) * xu[0] + box.y1 * yu[0] + box.z1 * zu[0],
          (box.x1 + box.w) * xu[1] + box.y1 * yu[1] + box.z1 * zu[1]
        );
        p.vertex(
          (box.x1 + box.w) * xu[0] + (box.y1 + box.h) * yu[0] + box.z1 * zu[0],
          (box.x1 + box.w) * xu[1] + (box.y1 + box.h) * yu[1] + box.z1 * zu[1]
        );
        p.vertex(
          box.x1 * xu[0] + (box.y1 + box.h) * yu[0] + box.z1 * zu[0],
          box.x1 * xu[1] + (box.y1 + box.h) * yu[1] + box.z1 * zu[1]
        );
        p.endShape(p.CLOSE);

        p.fill(shades[1][0], shades[1][1]);
        p.beginShape();
        p.vertex(
          box.x1 * xu[0] + box.y1 * yu[0] + box.z1 * zu[0],
          box.x1 * xu[1] + box.y1 * yu[1] + box.z1 * zu[1]
        );
        p.vertex(
          box.x1 * xu[0] + (box.y1 + box.h) * yu[0] + box.z1 * zu[0],
          box.x1 * xu[1] + (box.y1 + box.h) * yu[1] + box.z1 * zu[1]
        );
        p.vertex(
          box.x1 * xu[0] + (box.y1 + box.h) * yu[0],
          box.x1 * xu[1] + (box.y1 + box.h) * yu[1]
        );
        p.vertex(
          box.x1 * xu[0] + box.y1 * yu[0],
          box.x1 * xu[1] + box.y1 * yu[1]
        );
        p.endShape(p.CLOSE);

        p.fill(shades[2][0], shades[2][1]);
        p.beginShape();
        p.vertex(
          box.x1 * xu[0] + box.y1 * yu[0] + box.z1 * zu[0],
          box.x1 * xu[1] + box.y1 * yu[1] + box.z1 * zu[1]
        );
        p.vertex(
          (box.x1 + box.w) * xu[0] + box.y1 * yu[0] + box.z1 * zu[0],
          (box.x1 + box.w) * xu[1] + box.y1 * yu[1] + box.z1 * zu[1]
        );
        p.vertex(
          (box.x1 + box.w) * xu[0] + box.y1 * yu[0],
          (box.x1 + box.w) * xu[1] + box.y1 * yu[1]
        );
        p.vertex(
          box.x1 * xu[0] + box.y1 * yu[0],
          box.x1 * xu[1] + box.y1 * yu[1]
        );
        p.endShape(p.CLOSE);
      }
    }

    function createGrid(box, topside, leftside) {
      const { x1, y1, w, h } = box;

      const topsideGrid =
        topside && y1 == 1
          ? topside.filter(c => c.x1 == 1 && c.y1 == x1)[0]
          : null;

      const leftsideGrid =
        leftside && x1 == 1
          ? leftside.filter(c => c.y1 == 1 && c.x1 == y1)[0]
          : null;

      const cols = topsideGrid
        ? topsideGrid.rows
        : Math.ceil((Math.random() * w) / 3);
      const rows = leftsideGrid
        ? leftsideGrid.cols
        : Math.ceil((Math.random() * h) / 2);

      const cell_w = w / cols;
      const cell_h = h / rows;

      const init_top = topsideGrid
        ? topsideGrid.apparatus.map(i => ({ ...i[1], v: i[1].h }))
        : null;

      const init_left = leftsideGrid
        ? leftsideGrid.apparatus[1].map(i => ({ ...i, h: i.v }))
        : null;

      const apparatus = createApparatus(cell_w, cell_h, init_top, init_left);
      let grid = [];
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const content = apparatus[0].map(app => {
            const xpos = x1 + app.x1 + j * cell_w - 1;
            const ypos = y1 + app.y1 + i * cell_h - 1;
            let y_offset =
              topsideGrid && i == 0 && ypos <= 0
                ? topsideGrid.content.filter(
                    c => c.x1 <= 0 && p.max(c.y1, 0) == xpos
                  )[0].z1
                : 0;
            let x_offset =
              leftsideGrid && j == 0 && xpos <= 0
                ? leftsideGrid.content.filter(
                    c => c.y1 <= 0 && p.max(c.x1, 0) == ypos
                  )[0].z1
                : 0;
            return {
              ...app,
              x1: xpos - x_offset,
              y1: ypos - y_offset,
              w: app.w + x_offset,
              h: app.h + y_offset,
              level: 2,
              filled: true,
              crossed: app.w < 1.5 && app.h < 1.5 && Math.random() < 0.3,
              legend_width: 2 + Math.random() * (app.w - 3)
            };
          });

          grid = grid.concat(content);
        }
      }
      return {
        x1: x1,
        y1: y1,
        cols: cols,
        rows: rows,
        apparatus: apparatus[1],
        content: grid
      };
    }

    function createApparatus(w, h, top, left) {
      const cols = Math.round(w, 0);
      const rows = Math.round(h, 0);

      const w_unit = w / cols;
      const h_unit = h / rows;

      const generator = new index(
        (cols - 11) / 2,
        (rows - 11) / 2,
        innerApparatusOptions
      );

      const apparatus = generator.generate(top, left, true);
      apparatus[0] = apparatus[0].map(a => ({
        x1: (a.x1 - 1) * w_unit,
        y1: (a.y1 - 1) * h_unit,
        z1: maxDepth * (Math.floor(Math.random() * depthSteps) / depthSteps),
        w: a.w * w_unit,
        h: a.h * h_unit,
        col: a.col
      }));

      return apparatus;
    }

    function overlaps(a, b) {
      const lca = [a.x1 + a.w, a.y1];
      const rca = [a.x1, a.y1 + a.h];
      const ba = [a.x1, a.y1];

      const lcb = [b.x1 + b.w, b.y1];
      const rcb = [b.x1, b.y1 + b.h];
      const bb = [b.x1, b.y1];

      if (a.y1 + 0.005 >= b.y1 + b.h || a.x1 + 0.005 >= b.x1 + b.w) return false;

      if (ba[1] - ba[0] < bb[1] - bb[0]) {
        // A is left of B
        if (rca[1] - rca[0] <= lcb[1] - lcb[0]) return false;
        return rca[1] + rca[0] < lcb[1] + lcb[0]; // positive if A is in front of B
      }

      if (ba[1] - ba[0] > bb[1] - bb[0]) {
        // A is right of B
        if (lca[1] - lca[0] >= rcb[1] - rcb[0]) return false;
        return lca[1] + lca[0] < rcb[1] + rcb[0]; // positive if A is in front of B
      }
      return ba[1] + ba[0] < bb[1] + bb[0];
    }

    function get_overlap_graph(boxes) {
      const nodes = [];
      boxes.forEach((box, i) => nodes.push(i));

      const edges = [];
      boxes.forEach((b1, i) => {
        boxes.forEach((b2, j) => {
          if (overlaps(b1, b2)) edges.push([i, j, b1, b2]);
        });
      });

      const overlapping = toposort_1(edges);
      return overlapping.reverse().map(i => boxes[i]);
    }
  };

  new p5(sketch);

  function get_palette() {
    const url = window.location.href.split('#');
    if (url.length === 1) return get('intlrail');
    return get(url[1]);
  }

})));
