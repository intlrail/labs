//color scheme from https://color.adobe.com/Copy-of-Wikipedia-color-theme-9248024/?showPublished=true

// let colors = [
//   'rgba(208, 210, 196, 1)',
//   'rgba(84,  176, 189, 1)',
//   'rgba(7,   111, 138, 1)',
//   'rgba(214,  57,  50, 1)',
//   'rgba(3,    142,  147, 1)'
// ];
let colors = [
//  'rgba(0, 0, 0, 0.1)',
//  'rgba(0, 0, 0, 0.15)',
//  'rgba(0, 0, 0, 0.2)',
//  'rgba(0, 0, 0, 0.25)',
//  'rgba(0, 0, 0, 0.3)'
'rgba(28,28,30,1)', 'rgba(36,36,38,1)', 'rgba(44,44,46,1)', 'rgba(54,54,56,1)',
'rgba(58,58,60,1)', 'rgba(68,68,70,1)', 'rgba(72,72,74,1)', 'rgba(84,84,86,1)',
'rgba(99,99,102,1)','rgba(108,108,112,1)', 'rgba(124,124,128,1)', 'rgba(142,142,142,1)', 
'rgba(142,142,147,1)', 'rgba(174,174,178,1)', 'rgba(174,174,178,1)', 'rgba(188,188,192,1)',
'rgba(199,199,204,1)', 'rgba(209,209,214,1)', 'rgba(216,216,220,1)', 'rgba(229,229,234,1)', 
'rgba(235,235,240,1)', 'rgba(242,242,247,1)'];
let clouds = [];
let N = 2;

function setup() {
   createCanvas(windowWidth, windowHeight);
  // createCanvas(3200, 1800);
  for (let i = 0; i < N; i++) {
    let c = new Cloud();
    clouds.push(c);
  }
  // background(20);
  // background(255);
  // noFill();
  strokeWeight(1);
  stroke('#ffffff');
  rectMode(CENTER);
}

function draw() {
  clouds.forEach(function(c) {
    c.update();
    if (c.life > 0) c.render();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  clouds = [];
  setup();
}

function Cloud() {
  this.x = random(width);
  this.y = random(height);
  this.proportion = random(1, 2);
  this.vx = 0;
  this.vy = random(0.0, 1.0);
  this.w = random(75, 125);
  this.h = random(75, 125);
  this.life = random(1000,1200);
  this.stroke = colors[floor(random(colors.length))];

  this.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.proportion += random(-0.05, 0.05);
    this.proportion = constrain(this.proportion, 0.25, 1);
    this.life--;

    if (random() < 0.15)
      this.stroke = colors[floor(random(5))];
      this.stroke = noise(frameCount/1000) * 255;
  }
  this.render = function() {
    stroke(this.stroke);
    push();
    translate(this.x, this.y);

    scale(this.proportion);
    rotate(-PI / 6);
    scale(1, .86062); // scale vertical 86.062%
    shearX(PI / 6); // skew 30 degrees


    rect(0, 0, this.w, this.h);
    pop();
  }
}
/*function keyPressed() {
  clouds = [];
  setup();
}*/