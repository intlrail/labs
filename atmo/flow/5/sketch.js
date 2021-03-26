let sketch = function(p) {
  let THE_SEED;
  let tick = 0;

  let points_in_stripe = 1000;
  let stripe = [];
  let color1, color2;

  p.setup = function() {
    p.createCanvas(innerWidth, innerHeight);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);

    p.strokeWeight(1.618);
    p.noFill();
    p.colorMode(p.HSL);

    color1 = p.color(255, 255, 255, .47);
    color2 = p.color(0, 0, 0, .48);

    for (var i = 0; i < points_in_stripe; i++) {
      stripe.push(p.createVector(i / (points_in_stripe - 1) * p.width, -500, 0));
    }
  };

  p.draw = function() {
    update();
    display();
  };

  function update() {
    tick++;
    stripe.forEach(function(pnt, i) {p
      pnt.y += p.noise(i / 800, tick / 700) * 1;
      pnt.z = p.noise(400 + i / 200, 400 + tick / 10);
    });
  }

  function display() {
    //p.beginShape();
    for (var i = 1; i < stripe.length; i++) {
      let col = p.lerpColor(color1, color2, stripe[i].z);
      p.stroke(col);
      p.line(stripe[i - 1].x, stripe[i - 1].y, stripe[i].x, stripe[i].y);
      p.point(stripe[i].x, stripe[i].y);
    }
    //p.endShape();
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('swirl' + THE_SEED, 'png');
  };
};
new p5(sketch);
