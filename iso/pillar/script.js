//color scheme from https://color.adobe.com/Copy-of-Wikipedia-color-theme-9248024/?showPublished=true

let colors = [


'rgba(28,28,30,0.1)',
'rgba(36,36,38,.15)',
'rgba(44,44,46,.2)',
'rgba(54,54,56,.25)',
'rgba(58,58,60,.3)',
'rgba(68,68,70,.35)',
'rgba(72,72,74,.4)',
'rgba(84,84,86,.45)',
'rgba(99,99,102,.5)',
'rgba(108,108,112,.55)',
'rgba(124,124,128,.6)',
'rgba(142,142,142,.65)',
'rgba(142,142,147,.7)',
'rgba(174,174,178,.75)',
'rgba(174,174,178,.8)',
'rgba(188,188,192,.85)',
'rgba(199,199,204,.85)',
'rgba(209,209,214,.9)',
'rgba(216,216,220,.95)',
'rgba(229,229,234,1)',
'rgba(235,235,240,1)',
'rgba(242,242,247,1)',
'rgba(255,255,255, 1)'
];
let clouds = [];
let N = 80;

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
  blendMode(BLEND);
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
  this.proportion = random(1, 12);
  this.vx = 0;
  this.vy = random(-.2, -.6);
  this.w = random(50, 100);
  this.h = random(25, 175);
  this.life = random(1000, 1500);
  this.stroke = colors[floor(random(colors.length))];

  this.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.proportion += random(-0.5, 0.5);
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