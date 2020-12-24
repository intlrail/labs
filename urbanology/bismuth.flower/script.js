var crystals = [];
var frames = [];

var current;

var newLineChance = 0.65;
var newGroupChance = 0.15;
var deathChance = .06;
var maxGroups = 10000;

var xAngle = 0;
var yAngle = .5;

var s = 1;

function Crystal(x, y, hue){
  this.x = x;
  this.y = y;
  this.growing = true;
  this.headX = x;
  this.headY = y;
  this.segs = [];
  this.angle = floor(random(4))*PI/2;
  this.dir = random() < .5 ? 1 : -1;
  
  this.hue = hue;
  this.hueSpeed = random()*.4 + 2;
  
  this.tick = function(){
    if (!this.growing) return;
    this.hue += this.hueSpeed;
    var m = random();
    if (random() < newLineChance) this.segs.push(new Seg());
    this.headX = this.x;
    this.headY = this.y;
    var a = this.angle;
    for (var i = 0; i < this.segs.length; i++){
      var seg = this.segs[i];
      seg.tick(m);
      this.headX += cos(a)*seg.length;
      this.headY += sin(a)*seg.length;
      a += this.dir*PI/2;
      if (this.segs.length > 10){
        this.segs.splice(0, 1);
        i--;
        this.x = this.headX;
        this.y = this.headY;
        this.angle = a;
      }
    }
    if (random() < newGroupChance){
      crystals.push(new Crystal(this.headX, this.headY, this.hue));
      this.segs.pop();
    }
    if (random() < deathChance && crystals.length > 3) this.growing = false;
  }
  
  this.render = function(){
    if (!this.growing) return;
    for (var j = 0; j < 2; j++){
      current.push();
      if (j == 0){
        current.stroke((this.hue + 60)%360, 100, random()*50 + 50);
        current.strokeWeight(1);
      } else {
        current.stroke(this.hue%360, random()*50 + 50, 100);
      }
      current.translate(this.x, this.y);
      current.rotate(this.angle);
      for (var i = 0; i < this.segs.length; i++){
        var off = random()*2 - 1;
        var seg = this.segs[i];
        current.line(0, 0, seg.length + off, 0);
        current.translate(seg.length + off, 0);
        current.rotate(this.dir*PI/2);
      }
      current.pop();
    }
  }
}

function Seg(){
  this.length = 0;
  this.growRate = 1;
  
  this.tick = function(m){
    this.length += this.growRate*m*3;
  }
}

function setup(){
  createCanvas();
  colorMode(HSB);
  windowResized();
  imageMode(CENTER);
  init();
}

function init(){
  crystals = [];
  frames = [];
  var startHue = random(360);
  for (var i = 0; i < 3; i++){
    crystals.push(new Crystal(500, 500, startHue));
  }
  addFrame();
}

function addFrame(){
  current = createGraphics(500, 500);
  current.colorMode(HSB);
  current.clear();
  frames.push(current);
}

function draw(){
  if (!crystals || crystals.length == 0) return;
  background(0);
  current.strokeWeight(0.1);
  if (frameCount%3 == 0) addFrame();
  
  if(crystals.length < maxGroups){
    for (var i = 0; i < crystals.length; i++){
      crystals[i].tick();
      crystals[i].render();
    }
  }
  
  translate(width/2, height*.75);
  scale(s);
  for (var i = 0; i < frames.length; i++){
    push();
    translate(0, -i*4*(1 - sin(yAngle)));
    scale(1, sin(yAngle));
    rotate(xAngle);
    image(frames[i], 0, 0);
    pop();
  }
  
  if (!mouseIsPressed) xAngle += .01;
}

function mouseReleased(){
  init();
  yAngle = .5;
}

function mouseDragged(){
  xAngle += (pmouseX - mouseX)/100;
  yAngle += (mouseY - pmouseY)/100;
  yAngle = constrain(yAngle, .3, PI/2);
}

function mouseWheel(event) {
  if (event.delta > 0) s *= .95;
  else s *= 1.05;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pixelDensity(1);
}