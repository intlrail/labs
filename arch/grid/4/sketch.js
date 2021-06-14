let sketch = function(p) {
  let THE_SEED;
  let poster_padding = 50;
  let padding = 8;
  let cutoff = 50;
  let palette;

  p.setup = function() {
    p.createCanvas(innerWidth, innerHeight);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.noLoop();
    //p.background('#ecebe4');
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
    p.translate(
      poster_padding + (p.width - poster_padding * 2) / 10,
      poster_padding + (p.height - poster_padding * 2) / 10
    );
    for (let i = 0; i < 5; i++) {
      p.push();
      for (let j = 0; j < 5; j++) {
        draw_layout();
        p.translate((p.width - poster_padding * 2) / 5, 0);
      }
      p.pop();
      p.translate(0, (p.height - poster_padding * 2) / 5);
    }
  };

  function draw_layout() {
    let w = p.random(100, 150);
    let h = p.random(100, 150);
    draw_block(p.createVector(-w / 2, -h / 2), p.createVector(w / 2, h / 2));
  }
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
    }
  }

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
    }
  }

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
    if (p.keyCode === 80) p.saveCanvas('grid6_' + THE_SEED, 'png');
  };
};
new p5(sketch);
