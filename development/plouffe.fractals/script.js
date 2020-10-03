/*
  Johan Karlsson (DonKarlssonSan)
*/
var canvases = [];
var contexts = [];
var numberOfCanvases = 800;
for(var i = 0; i < numberOfCanvases; i++){  
  var canvas = document.createElement("canvas");
  canvas.width = 50;
  canvas.height = 50;
  document.body.appendChild(canvas);
  canvases.push(canvas);
  var ctx = canvas.getContext("2d");
  contexts.push(ctx);
}

var centerX = 25;
var centerY = 25;
var radius = 25;

var x, y;
var angle;
var numberOfPointsAlongCircle = 1;
var iteration = 0;
var maxIterations = 1500;

function drawSingleCanvas(index, table) {
  canvas = canvases[index];
  ctx = contexts[index];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  ctx.stroke();

  for(var i = 1; i < numberOfPointsAlongCircle; i++) {
    angle = Math.PI*2/numberOfPointsAlongCircle*i;
    x = Math.cos(angle)*radius + centerX;
    y = Math.sin(angle)*radius + centerY;
    ctx.beginPath();
    ctx.moveTo(x, y);
    angle = angle*table;
    x = Math.cos(angle)*radius + centerX;
    y = Math.sin(angle)*radius + centerY;
    ctx.lineTo(x, y);
    ctx.strokeStyle = "hsl(" + (`100` + i) + ", 100%, 100%)";
    ctx.stroke();
  }  
}

function drawAll() {
  if(iteration < maxIterations) {
    requestAnimationFrame(drawAll);
  }
  iteration++;
  for(var index = 0; index < numberOfCanvases; index++) {
    drawSingleCanvas(index, index+2);
  }
  numberOfPointsAlongCircle += 0.2;
}

drawAll();