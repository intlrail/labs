let sketch = function(p) {
  let rings = 100;
  let dim_init = 0;
  let dim_delta = 1;
  let chaos_init = 0;
  let chaos_delta = 0.09;
  let chaos_mag = 1;

  let ox = p.random(10000);
  let oy = p.random(10000);
  let oz = p.random(10000);

  let arr = [];
  let spacing = 1.618;
  let magnitude = 100;
  let noise_delta = 0.125;
  let noise_radius = 0.49;

  let cols = ['#1c1c1e', '#2c2c2e', '#3a3a3c', '#48484a', '#636366', '#7c7c80'];
  let cols2 = ['#414141','#484848','#4f4f4f','#565656','#5d5d5d','#646464'];
  let cols3 = ['#6b6b6b', '#727272', '#797979', '#818181', '#898989', '#919191'];
  let cols4 = ['#999999', '#a2a2a2', '#ababab', '#b4b4b4', '#bebebe', '#c8c8c8'];
  let cols5 = ['#101010', '#1b1b1b', '#242424', '#2c2c2c', '#333333', '#3a3a3a'];
  let cols6 = ['#242426', '#363638', '#444446', '#545456', '#6c6c70', '#8e8e8e'];
  let cols7 = ['#8e8e93','#aeaeb2','#c7c7cc','#d8d8dc','#ebebf0', '#fafafa'];
  let cols8 = ['#aeaeb2','#bcbcc0','#d1d1d6','#e5e5ea','#f2f2f7', '#ffffff'];

  p.setup = function() {
    let c = p.createCanvas(window.innerWidth, window.innerHeight);
    //c.style('');
    c.parent('sketch');
    p.strokeWeight(1);
    p.stroke(40, 255);
    p.smooth();
    p.noLoop();

    for (let i = 0; i < 360; i++) {
      arr.push(dim_init);
    }
  };

  p.draw = function() {
    p.push();
    p.translate(p.randomGaussian(p.width / 2, 250), p.randomGaussian(p.height / 2, 250));
    display();
    p.pop();
    display_crosses();
    display_grid();
  };

  function display() {
    for (let i = 0; i < rings; i++) {
      if (i % 6 == 0) p.strokeWeight(2);
      else p.strokeWeight(1);

      p.fill(cols[p.floor(i / rings * cols.length)]);
      p.fill(cols[p.floor(p.random(cols.length))]);

      var new_arr = [];

      p.beginShape();
      for (const ang in arr) {
        let rad = p.radians(ang);
        let new_radius = spacing + arr[ang] + getNoise(rad, i * noise_delta) * magnitude;

        p.vertex(new_radius * p.cos(rad), new_radius * p.sin(rad));
        new_arr[ang] = new_radius;
      }
      p.beginContour();
      for (const ang in arr) {
        let rad = p.radians(359 - ang);
        p.vertex(arr[359 - ang] * p.cos(rad), arr[359 - ang] * p.sin(rad));
      }
      p.endContour();

      p.endShape(p.CLOSE);

      arr = new_arr;
    }
  }

  function display_crosses() {
    for (var i = 0; i < 50; i++) {
      p.push();
      p.translate(p.random(50, p.width-100), p.random(50, p.height-100));

      p.line(-5, 0, 5, 0);
      p.line(0, -5, 0, 5);
      p.pop();
    }
  }

  function display_grid() {
    p.stroke(0, 25);
    p.strokeWeight(1);
    let grid_space = 10;
    for (var i = grid_space; i < p.height; i += grid_space) {
      p.line(0, i, p.width, i);
    }
    for (var j = grid_space; j < p.width; j += grid_space) {
      p.line(j, 0, j, p.height);
    }
  }

  function getNoise(radian, dim) {
    let r = radian % p.TAU;
    if (r < 0.0) {
      r += p.TAU;
    }
    return p.noise(ox + p.cos(r) * (noise_radius + dim / 200), oy + p.sin(r) * (noise_radius + dim / 200), dim);
  }

  function getNoiseWithTime(radian, dim, time) {
    let r = radian % p.TWO_PI;
    if (r < 0.0) {
      r += p.TWO_PI;
    }
    return p.noise(ox + p.cos(r) * dim, oy + p.sin(r) * dim, oz + time);
  }
};

new p5(sketch);
