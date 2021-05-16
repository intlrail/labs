const p5 = require('p5');

const ui = require('./ui');

var sketch = function (p) {
  const w = p.windowWidth;
  const h = p.windowHeight;
  let t = 0;
  let n = 800;
  let particles = [];

  p.setup = function() {
    p.createCanvas(w, h);
    for (var i = 0; i < n; i++) {
      particles.push({
          pos: p.createVector(p.random(w), p.random(h)),
          vel: p.createVector(0,0),
          seed: i
        });
    }
  };


  p.draw = function() {
    particles.forEach( function(prtcl) {
      ui.display(p, prtcl.pos, prtcl.vel);
      ui.update(p, t, prtcl.pos, prtcl.vel, prtcl.seed);
    });
    t += 0.s2;
  };
};

  p.keyPressed = function() {
    if (p.keyCode === 80) {
      p.saveCanvas('atmoperlin', 'png');
    }
  };

new p5(sketch);
