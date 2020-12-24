var bg;
var yoff = 0.0;        // layer of perlin noise

function setup() {
  createCanvas(windowWidth, windowHeight);
  //random(255),random(255),255
    //bg = loadImage("404182.jpg");
    
}

function draw() {
background(0);

  fill(138);
  
  // Shape Maker
  beginShape(); 
  
  var xoff = 1;       
  var xoff = yoff; 
  
  // 
  for (var x = 0; x <= width; x += 10) {
    // Calculate a y value according to noise, map to 
    
    // Layer1
    var y = map(noise(xoff, yoff), 0, 1, 400,1000);

    //Parallax 1
    var y = map(noise(xoff), 0, 1, 1000,600);
    
    // Set the vertex
    vertex(x, y); 
    vertex(x+2,y-1);
    vertex(x+70,y-800);
    // x distort
    xoff += 0.05;
  }
  // distort y 
  yoff += 0.05;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
 
  noFill();
  
  
  
  //CAVE
  
  // 
  for (var x = 0; x <= width; x += 10) {
    // Calculate a y value according to noise, map to 
    
    // Layer2
    var y = map(noise(xoff, yoff), 0, 1, 400,1000);

    //Parallax 2
    var y = map(noise(xoff), 0, 1, 1000,600);
    
    // Set the vertex
    vertex(x, y); 
    vertex(x+50,y+20);
    vertex(x+170,y-700);
     //distort x
    xoff += 0.05;
 }
  // creating distort y 
  yoff += 0.05;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  noFill()

  
  
  
  

  
 }