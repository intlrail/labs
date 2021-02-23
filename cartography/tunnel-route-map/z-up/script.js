//color scheme from https://color.adobe.com/Copy-of-Wikipedia-color-theme-9248024/?showPublished=true

// let colors = [
//   'rgba(208, 210, 196, 1)',
//   'rgba(84,  176, 189, 1)',
//   'rgba(7,   111, 138, 1)',
//   'rgba(214,  57,  50, 1)',
//   'rgba(3,    142,  147, 1)'
// ];
let colors = [
  'rgba(255,255,255, 0.51)',
  'rgba(255,255,255, 0.615)',
  'rgba(255,255,255, 0.72)',
  'rgba(255,255,255, 0.825)',
  'rgba(255,255,255, 0.93)'
];
let clouds = [];
let N = 23;

function setup() {
  // createCanvas(windowWidth, windowHeight);
  createCanvas(window.innerWidth, window.innerHeight);
  for (let i = 0; i < N; i++) {
    let c = new Cloud();
    clouds.push(c);
  }
  
  //background(0);
  noFill();
  strokeWeight(1);
  stroke('rgba(255, 255, 255, .614)');
  rectMode(CENTER);
  blendMode(SCREEN);
  // saveFrames('a/iso', 'png', 2, 30);
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
  this.proportion = random(0.5, 1.2);
  this.vx = 0;
  this.vy = random(-.2, -.6);
  this.w = random(100, 100);
  this.h = random(100, 100);
  this.life = random(5000, 10000);
  this.stroke = colors[floor(random(colors.length))];

  this.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.proportion += random(-0.15, 0.15);
    this.proportion = constrain(this.proportion, -1, 1);
    this.life--;

    if (random() < 0.15)
      this.stroke = colors[floor(random(4))];
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

//wfunction keyPressed() {
//clouds = [];
//setup();
//}