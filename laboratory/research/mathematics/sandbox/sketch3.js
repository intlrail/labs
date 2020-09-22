let sketch = function(p) {
  let steps = 20;
  let size = 600;

  p.setup = function() {
    var canvas = p.createCanvas(size,size);
    canvas.parent('#sketch1');
    p.noStroke();
    p.fill(255,240,230);
    //p.blendMode(p.OVERLAY);
    p.noLoop();
    p.frameRate(1);
  }

  p.draw = function() {
    p.clear();
    p.fill(215,150,60);
    let s = generate_string(8);
    display(s);
    p.fill(185,50,130);
    s = generate_string(8);
    display(s);
    p.fill(80,190,155);
    s = generate_string(8);
    display(s);
  }
/*
  function generate_string (d) {
    if (d == 0) {
      let r = p.random(5);
      if (r < 1) return "W";
      return "B";
    }

    let r = p.random(10 + (d * 8));
    if (r < 5) return "W";
    if (r < 10) return "B";
    let ul = generate_string(d - 1);
    let ur = generate_string(d - 1);
    let ll = generate_string(d - 1);
    let lr = generate_string(d - 1);
    return "[" + ul + "-" + ur + "/" + ll + "-" + lr + "]";
  }

  function display(s) {
    let depth = 0;
    for(let i = 0; i < s.length; i++) {
      let t = s[i];
      let cur_size = size / p.pow(2, depth);
      //p.fill(p.random(255),p.random(255),p.random(255));
      if (t == "B") {
        p.rect(0, 0, cur_size-1, cur_size-1);
      } else if (t == "[") {
        depth++;
      } else if (t == "]") {
        p.translate(-cur_size, -cur_size);
        depth--;
      } else if (t == "-") {
        p.translate(cur_size, 0);
      } else if (t == "/") {
        p.translate(-cur_size, cur_size);
      }
    }
  }
*/

}

let sketch2 = function(p) {
  let n = 10;
  let r = 300;

  let points;
  let current;

  p.setup = function() {
    var canvas = p.createCanvas(600, 600);
    canvas.parent('#sketch2');
    p.fill(0, 22, 65, 1);
    p.noStroke();
    //p.frameRate(2);
    p.colorMode(p.HSB);
    p.blendMode(p.SCREEN);
    p.noLoop();

    current = [];
    points = init(n, r, points);
  };

  p.draw = function() {
    p.background();
    for (var i = 0; i < 5; i++) {
      p.push();
      p.translate(p.randomGaussian(p.width / 2, 350), p.randomGaussian(p.height / 2, 250));
      p.fill(p.random(360), 100, 100, 0.012);
      points = init(n, p.random(100, 500), points);
      run(current, points);
      p.pop();
    }
  };

  function init(n, r, points) {
    points = [];
    for (let i = 0; i < n; i++) {
      let rads = i / n * p.TWO_PI;
      let vec = p.createVector(p.cos(rads) * r, p.sin(rads) * r, p.random(1.2));
      move_nearby(vec, 100);
      points.push(vec);
    }
    for (let b = 0; b < 5; b++) {
      interpolate(points);
    }
    return points;
  }

  function run(current, points) {
    for (var i = 0; i < 60; i++) {
      current = update(current, points);
      display(current);
    }
  }

  function update(current, points) {
    current = deep_copy(points);
    for (let b = 0; b < 5; b++) {
      for (let i = 0; i < current.length; i++) {
        move_nearby(current[i], 100);
      }
    }
    return current;
  }

  function interpolate(points) {
    for (var i = points.length - 1; i > 0; i--) {
      points.splice(i, 0, generate_midpoint(points[i - 1], points[i]));
    }
    points.splice(0, 0, generate_midpoint(points[points.length - 1], points[0]));
  }

  function generate_midpoint(p1, p2) {
    let p3 = p.createVector((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2 * 0.7 * p.random(0.3, 1.8));
    move_nearby(p3, 100);
    return p3;
  }

  let move_nearby = function(pnt, sd) {
    pnt.x = p.randomGaussian(pnt.x, pnt.z * sd);
    pnt.y = p.randomGaussian(pnt.y, pnt.z * sd);
  };

  function display(current) {
    //p.clear();
    p.beginShape();
    for (let i = 0; i < current.length; i++) {
      p.vertex(current[i].x, current[i].y);
    }
    p.endShape(p.CLOSE);
  }

  let deep_copy = function(arr) {
    let narr = [];
    for (var i = 0; i < arr.length; i++) {
      narr.push(arr[i].copy());
    }
    return narr;
  };
};

new p5(sketch1);
new p5(sketch2);
