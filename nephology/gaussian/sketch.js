const p5 = require('p5');
const ui = require('./ui');

let sketch = function(p) {
  let n = 10;
  let r = 100;

  let points;
  let current;

  p.setup = function() {
    var canvas = p.createCanvas(innerWidth, innerHeight);
    p.fill(100,22,65,.6);
    p.noStroke();
    //p.frameRate(2);
    p.blendMode(p.OVERLAY);
    p.noLoop();
    current = [];
    points = ui.init(p,n,r,points);
  }

  p.draw = function() {
    p.clear();
    p.translate(p.width*2, p.height*2);
    ui.run(p, current, points);
    points = ui.init(p,n,r,points,current);
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'png');
  };
}

new p5(sketch);
