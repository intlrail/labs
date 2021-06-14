let sketch = function(p) {
<<<<<<< Updated upstream
    let xdim = 125;
    let ydim = 80;
    let size = 40 ;
    let grid;
    let colors;

    p.setup = function() {
        p.createCanvas(innerWidth, innerHeight);
        p.noLoop();
        p.noFill();
        colors = [p.color(231, 231, 231), p.color(190, 190, 190), p.color(89, 89, 89), p.color(255, 255, 255)];
    };

    p.draw = function() {
        // p.clear();
        // p.translate(10, 200);
        generate_grid(xdim, ydim);
        p.strokeWeight(2);
        p.stroke(180, 180, 180);
        display(9, 9, 9, 9);
        p.translate(360, 0);
        p.scale(1, 1);
        display(0, 0, 9, 9);
        p.translate(0, 360);
        p.scale(1, 1);
        display(0, 0, 9, 9);
        p.translate(360, 0);
        p.scale(1, 1);
        display(0, 0, 9, 9);
        p.strokeWeight(2);
        p.stroke(249, 249, 249);
        display(0, 0, 9, 9);
        p.translate(360, 0);
        p.scale(1, 1);
        display(0, 0, 9, 9);
        p.translate(0, 360);
        p.scale(1, 1);
        display(0, 0, 9, 9);
        p.translate(360, 0);
        p.scale(1, 1);
        display(0, 0, 9, 9);
        p.translate(10, 10);
        p.scale(1, 1);
    };

    function generate_grid(xd, yd) {
        grid = new Array(yd + 1);
        for (var i = 0; i < grid.length; i++) {
            grid[i] = new Array(xd + 1);
            for (var j = 0; j < grid[i].length; j++) {
                if (i == 0 || j == 0) grid[i][j] = { h: true, v: true };
                else if (i == 1 && j == 1) grid[i][j] = { h: true, v: true };
                else grid[i][j] = generate_cell(grid[i][j - 1].h, grid[i - 1][j].v);
            }
        }
=======
  let THE_SEED;
  let padding = 16;
  let cutoff = 40;
  let palette;

  p.setup = function() {
    p.createCanvas(innerWidth, innerHeight);
    //p.frameRate(2);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.strokeWeight(1);
    p.rectMode(p.CORNERS);
    palette = [
      p.color('#c7c7cc'),
      p.color('#6c6c70'),
      p.color('#3a3a3c'),
      p.color('#48484a'),
      p.color('#e5e5ea'),
      p.color('#2c2c2e'),
      p.color('#444446')
    ];
  };

  p.draw = function() {
    //p.background('#ebebe4');
    // let w = p.random(250, 400);
    // let h = p.random(250, 400);
    let w = 400;
    let h = 400;
    p.translate(p.width / 2, p.height / 2);
    draw_block(p.createVector(-w / 2, -h / 2), p.createVector(w / 2, h / 2));
    

    p.noLoop()
  };

  function draw_section(v1, v2) {
    if (v2.x - v1.x < cutoff || v2.y - v1.y < cutoff) {
      draw_block(v1, v2);
      return;
    }
    let decide = p.random();

    if (decide < 0.5) {
      draw_block(v1, v2);
    } else if (decide < 0.95) {
      split_section(v1, v2);
    } else {
      //NOTHING, FOR NOW...
    }
  }

  function draw_block(v1, v2) {
    if (v2.x - v1.x < cutoff || v2.y - v1.y < cutoff) {
      draw_rectangle(v1, v2);
      return;
    }
    let decide = p.random();

    if (decide < 0.4) {
      draw_rectangle(v1, v2);
      draw_section(p.createVector(v1.x + padding, v1.y + padding), p.createVector(v2.x - padding, v2.y - padding));
    } else if (decide < 0.95) {
      split_block(v1, v2);
    } else {
      draw_rectangle(v1, v2);
>>>>>>> Stashed changes
    }

<<<<<<< Updated upstream
    function generate_cell(west, north) {
        if (!west && !north) return { h: false, v: false };
        if (!west) return { h: flip_coin(), v: true };
        if (!north) return { h: true, v: flip_coin() };
        let h = flip_coin();
        let v = h ? flip_coin() : true;
        return { h: h, v: v };
    }

    function display(x1, y1, sx, sy) {
        // p.rect(size,size, (sx-1) * size, (sy-1) * size);
        for (var i = 1; i < sy; i++) {
            for (var j = 1; j < sx; j++) {
                if (grid[y1 + i][x1 + j].h) p.line(j * size, i * size, (j + 1) * size, i * size);
                if (grid[y1 + i][x1 + j].v) p.line(j * size, i * size, j * size, (i + 1) * size);
            }
        }
=======
  function split_section(v1, v2) {
    let cut_dir = get_cut_direction(v1, v2);
    if (cut_dir == 'H') {
      let pivot = get_cut_pos(v1.y, v2.y);
      draw_section(v1, p.createVector(v2.x, pivot - padding / 2));
      draw_section(p.createVector(v1.x, pivot + padding / 2), v2);
    } else {
      let pivot = get_cut_pos(v1.x, v2.x);
      draw_section(v1, p.createVector(pivot - padding / 2, v2.y));
      draw_section(p.createVector(pivot + padding / 2, v1.y), v2);
    }
  }

  function split_block(v1, v2) {
    let cut_dir = get_cut_direction(v1, v2);
    if (cut_dir == 'H') {
      let pivot = get_cut_pos(v1.y, v2.y);
      draw_block(v1, p.createVector(v2.x, pivot));
      draw_block(p.createVector(v1.x, pivot), v2);
    } else {
      let pivot = get_cut_pos(v1.x, v2.x);
      draw_block(v1, p.createVector(pivot, v2.y));
      draw_block(p.createVector(pivot, v1.y), v2);
>>>>>>> Stashed changes
    }

<<<<<<< Updated upstream
    function flip_coin() {
        return p.random() < 0.5 ? false : true;
    }

    function dist(n, m) {
        return p.max(n - m, m - n);
    }
};

new p5(sketch);
=======
  function draw_rectangle(v1, v2) {
    p.fill(palette[p.floor(p.random(palette.length))]);
    p.rect(v1.x, v1.y, v2.x, v2.y);
  }

  function get_cut_direction(v1, v2) {
    return v2.x - v1.x < v2.y - v1.y ? 'H' : 'V';
  }

  function get_cut_pos(p1, p2) {
    return p.constrain(p.randomGaussian((p1 + p2) / 2, (p2 - p1) / 8), p1 + 20, p2 - 20);
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('grid5_' + THE_SEED, 'png');
  };
};
new p5(sketch);
>>>>>>> Stashed changes
