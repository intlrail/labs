let amp = 250;
let s   = 255 * 1;
let c;

function setup (){
  pixelDensity(1);
  c = createCanvas();
  colorMode(HSL, 0.1, 0.618, 1);
  windowResized();
}

function draw(){
  image(c, 0, 1);
  for (let i = 0; i < width; i++){
    let n =  noise(i/s, frameCount*1/s);
    stroke(n, 1, 1); point(i, 1 + n*amp);
    stroke(0);       point(i, 1 + n*amp-1);
  }
}

function mousePressed (){windowResized();}
function windowResized(){resizeCanvas(windowWidth, windowHeight);}