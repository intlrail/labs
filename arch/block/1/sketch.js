import BlockBuilder from './logic.js';

let sketch = function(p) {
  let THE_SEED;
  let xdim = 18;
  let ydim = 18;
  let radius = 8;
  let size = 10;

  let chance_start = 1;
  let chance_extend = 0.88;
  let chance_vertical = 0.5;

  let colors;

  let grid;
  let builder;

  p.setup = function() {
    p.createCanvas(innerWidth, innerHeight);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.noLoop();
    //p.fill('#eeeee8');
    //p.background('#eeeee8');
    colors = [
      
      p.color('#c7c7cc'),
      p.color('#6c6c70'),
      p.color('#3a3a3c'),
      p.color('#48484a'),
      p.color('#e5e5ea'),
      p.color('#2c2c2e'),
      p.color('#444446')
    ];

    builder = new BlockBuilder(xdim, ydim, radius, chance_start, chance_extend, chance_vertical, colors);
  };

  p.draw = function() {
    /*
    p.translate(240, 240);
    grid = builder.generate();
    p.strokeWeight(10);
    display();
    p.strokeWeight(4);
    display();
    */

    p.translate(10, 10);
    for (let i = 0; i < 3; i++) {
      p.push();
      for (let j = 0; j < 6; j++) {
        grid = builder.generate();
        p.strokeWeight(6);
        display();
        p.strokeWeight(2);
        display();
        p.translate(300, 0);
      }
      p.pop();
      p.translate(0, 300);
    }
  };

  function display() {
    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < grid[i].length; j++) {
        p.noStroke();
        if (grid[i][j].in && grid[i][j].col != null) {
          p.fill(grid[i][j].col);
          p.rect(j * size, i * size, size, size);
        }
        p.stroke('#050505');
        if (grid[i][j].h) p.line(j * size, i * size, (j + 1) * size, i * size);
        if (grid[i][j].v) p.line(j * size, i * size, j * size, (i + 1) * size);
      }
    }
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('grid6_' + THE_SEED, 'png');
  };
};

new p5(sketch);
