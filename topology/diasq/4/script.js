let col, row;
let scl = 20;
let terrain = [];
let fly = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  col = 2*width/scl;
  row = 2*height/scl;
}

function draw() {
  background(0);
  stroke(255);
  fill(0);
  let xoff = 0;
  for(let x=0; x<col; x++){
    let yoff = fly;
    
    terrain[x] = [];
    for(let y=0; y<row; y++){
      terrain[x][y] = map(noise(xoff,yoff),0,1,-100,100);
      yoff = yoff +0.1;
    }
    
    xoff = xoff +0.1;
  }
  
  fly = fly -0.02;
  
  rotateX(Math.PI/3);
  translate(-width, -height);
  
  for(let x=0; x<col-1; x++){
    beginShape();
    for(let y=0; y<row-1; y++){

      
      vertex(x*scl, y*scl, terrain[x][y]);
      vertex(x*scl, (y+1)*scl, terrain[x][y+1]);
      vertex((x+1)*scl, y*scl, terrain[x+1][y]);
      }
      endShape();
  }

}