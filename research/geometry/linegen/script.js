var steps;

function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  cursor(HAND);
  reset();
}

function draw() {
  background(0);
  stroke(255, 100)
  noLoop();
  var l = min(windowWidth, windowHeight);
  drawLines(windowWidth / 2 - l / 2, windowHeight / 2, l, 0, steps);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
  reset();
  draw();
}

function reset() {
  steps = round(random(4, 6));
}

function drawLines(x, y, length, angle, level) {
  if (level === 0) {
    return;
  }
  push();
  translate(x, y);
  rotate(angle);

  line(0, 0, length, 0);
  var nrOfParams = round(random(4, 6));
  for (var i = 0; i < nrOfParams; i++) {
    var angle = random([-PI / 4, PI / 4]);
    var position = random();
    var sizeFactor = random(0.382, 0.618);
    drawLines(length * position, 0, length * sizeFactor, angle, level - 1);
  }

  pop();
}