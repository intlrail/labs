class Vec3{
  constructor(x, y, z, r=10){
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = r;
  }
  op(p, f){
    this.x = f(this.x, p.x != undefined ? p.x : p);
    this.y = f(this.y, p.y != undefined ? p.y : p);
    this.z = f(this.z, p.z != undefined ? p.z : p);
    return this;
  }
  normalize(){
    let d = sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    return this.div(d);
  }
  dot   (p){return this.x*p.x + this.y*p.y + this.z*p.z}
  plus  (p){return this.op(p, (a, b) => a + b)}
  minus (p){return this.op(p, (a, b) => a - b)}
  times (p){return this.op(p, (a, b) => a * b)}
  div   (p){return this.op(p, (a, b) => a / b)}
  distTo(p){return Math.hypot(this.x-p.x, this.y-p.y, this.x-p.z)}
  clone  (){return new Vec3(this.x, this.y, this.z, this.r)}
  updateRotation(){
    let {x, y, z} = this.clone().minus(origin);
    this.screenCoord = [
      (x*cx - y*sx),
      (y*cx + x*sx)*cy + sy*z
    ];
    this.depth = z*cy - sy*(y*cx + x*sx);
  }
  render(fc=.5, sc = 1){
    fill(fc);
    stroke(sc);
    strokeWeight(1);
    ellipse(...this.screenCoord, this.r);
  }
}

class Shape{
  constructor(points, {strokeColor="white", fillColor=color(1, .5), strokeWeight=1, showPoints = true,}){
    this.points = points;
    this.center = new Vec3(0, 0, 0);
    this.strokeColor = strokeColor;
    this.fillColor = fillColor;
    this.strokeWeight = strokeWeight;
    this.showPoints = showPoints;
    for (let p of this.points) this.center.plus(p);
    this.center.div(this.points.length);
    
    this.computeNormal();
  }
  computeNormal(){
    if (this.points.length > 2){
      let A = this.points[1].clone().minus(this.points[0]);
      let B = this.points[2].clone().minus(this.points[0]);
      this.normal = (new Vec3(
        A.y*B.z-A.z*B.y,
        A.z*B.x-A.x*B.z,
        A.x*B.y-A.y*B.x,
      )).normalize();
    }    
  }
  updateRotation(){
    this.points.map(p => p.updateRotation());
    this.center.updateRotation();
    this.depth = this.center.depth;
  }
  render(){
    strokeWeight(this.strokeWeight);
    stroke(this.strokeColor);
    fill(this.fillColor);
    beginShape();
    for (let p of this.points) vertex(...(p.screenCoord));
    endShape(CLOSE);
    if (this.showPoints){
      let points = [...(this.points), this.center].sort((a, b) => a.depth-b.depth);
      for (let p of points) p.render();
    }
  }
}

class Geom{
  constructor(verts, faces, style = {}){
    this.shapes = [];
    for (let face of faces){
      let shape = new Shape(face.map(idx => verts[idx]), style);
      this.shapes.push(shape);
    }
  }
  updateRotation(){
    this.shapes.map(s => s.updateRotation());
  }
  render(){
    let shapes = this.shapes.sort((a, b) => a.depth - b.depth);
    for (let s of shapes) s.render();
  }
}

let Box = (anchor, w, l, h, style={}) => {
  let verts = [
    anchor,
    anchor.clone().plus(new Vec3(w, 0, 0)),
  ];
  verts = verts.concat(verts.map(p => p.clone().plus(new Vec3(0, l, 0))));
  verts = verts.concat(verts.map(p => p.clone().plus(new Vec3(0, 0, h))));
  let faces = [
    [0, 1, 3, 2], //bottom
    [4, 5, 7, 6], //top
    [0, 1, 5, 4], //+x
    [3, 2, 6, 7], //-x
    [1, 3, 7, 5], //+y
    [2, 0, 4, 6], //-y
  ];
  return new Geom(verts, faces, style);
}

let Tree = (x, y, z, h) => {
  z += 5;
  let base = v3(x, y, z+h);
  let shapes = [];
  
  let col = color(random(.23, .3), random(.7, .8), random(.3, .5));
  let style = {strokeColor:col, fillColor:col, showPoints:false}
  
  let points = [
    v3(x, y-h/3, z),
    v3(x+h/3, y, z),
    v3(x, y+h/3, z),
    v3(x-h/3, y, z),
  ];
  
  for (let i = 0; i < points.length; i++){
    shapes.push(new Shape(
      [
        points[i],
        points[(i+1)%points.length],
        base,
      ],
      style
    ))
  }
  
  return shapes;
}

function setup (){
  pixelDensity(1);
  createCanvas();
  colorMode(HSB, 1, 1, 1);
  strokeJoin(ROUND);
  windowResized();
}

let points = [];
let r = (n) => random(-n, n);
let v3 = (x, y, z) => new Vec3(x, y, z);
let l3 = (p1, p2, c) => new Line(p1, p2, c);
let rPoint = (n) => v3(r(n), r(n), r(n));

let rows = 30;
let cols = 30;
let gridSize = 700;

let init = () => {
  points = [];
  // points.push(new Shape([v3(0, 0, 0), v3(0, 0, 200)], {strokeColor:"blue"}));
  // points.push(new Shape([v3(0, 0, 0), v3(0, 200, 0)], {strokeColor:"green"}));
  // points.push(new Shape([v3(0, 0, 0), v3(200, 0, 0)], {strokeColor:"red"}));
  
  let seed = random(1e6);
  let grid = [];
  
  for (let i = 0; i < rows; i++){
    let x = (i/rows-.5)*gridSize;
    grid.push([]);
    for (let j = 0; j < cols; j++){
      let y = (j/cols-.5)*gridSize;
      let n = noise(i/10, j/10, seed);
      grid[i].push(v3(x, y,(n*2-1)*150));
    }
  }
  
  let style = {showPoints:false, fillColor:1, strokeColor:0};
  
  let col1 = color(.25, .8, .8);
  let col2 = color(.5, .1, 1);
  
  let light = v3(1, 1, -1).normalize();
  
  // points.push(new Shape([v3(0, 0, 0), light.clone().times(100)], {}));
  
  let tris = (p1, p2, p3) => {
    let s = new Shape([p1, p2, p3], style);
    let amt = (s.center.z+150)/300;
    let l = s.normal.dot(light)*.5 + .5;
    let hue = lerp(.25, .5, amt);
    let sat = lerp(.8, 0, amt);
    let bal = lerp(.8, 1, amt)*(1-l);
    let col = color(hue, sat, bal);
    s.fillColor = col;
    s.strokeColor = col;
    points.push(s);
  }
  
  for (let i = 0; i < rows-1; i++){
    for (let j = 0; j < cols-1; j++){
      let p1 = grid[i][j];
      let p2 = grid[i+1][j];
      let p3 = grid[i][j+1];
      let p4 = grid[i+1][j+1];
      tris(p1, p2, p3);
      tris(p3, p2, p4);
      if (p1.z < 0 && random() < .1){
        let tree = Tree(p1.x, p1.y, p1.z, random(30, 40));
        points.push(...tree);
      }
    }
  }
  
}

let rotY = -Math.PI/3;
let rotX = .4;
let zoom = 1;
let cx, sx, cy, sy;

let near = 500;

let mX = 0;
let mY = 0;

let origin = new Vec3(0, 0, 0);

function draw(){
  background(0);
  stroke(1);
  
  rotX += .01;
  
  updateCamera();
  translate(width/2, height/2);
  scale(zoom);
  let [x, y] = origin.screenCoord;
  translate(x, y);
  
  let n = near/(zoom*zoom);
  
  points.map(p => p.updateRotation());
  let ps = points.filter(a => a.depth < n).sort((a, b) => a.depth-b.depth);
  ps.map(p => p.render());
}

let updateCamera = () => {
  rotX += mX;
  rotY += mY;
  rotY = constrain(rotY, -PI, 0);
  mX *= .9;
  mY *= .9;
  [cx, sx, cy, sy] = [cos(rotX), sin(rotX), cos(rotY), sin(rotY)];
  
  let [xMove, yMove] = [0, 0];
  if (keys.w) yMove -= 10/zoom;
  if (keys.s) yMove += 10/zoom;
  if (keys.d) xMove += 10/zoom;
  if (keys.a) xMove -= 10/zoom;
  
  origin.x += cx*xMove + sx*yMove;
  origin.y += cx*yMove - sx*xMove;
  
  origin.updateRotation();
}

function mouseDragged(){
  mX = -movedX/100;
  mY =  movedY/100;
}

let keys = {}
function keyPressed (evt){keys[key] = true }
function keyReleased(evt){
  keys[key] = false;
  if (evt.key === " ") init();
}

function mouseWheel(evt){
  if (evt.deltaY > 0) zoom *= .95;
  if (evt.deltaY < 0) zoom /= .95;
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  init();
}