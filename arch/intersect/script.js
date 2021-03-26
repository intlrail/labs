var c = new Sketch.create(),
    points = [], // All the points we're keeping track of.
    maxPoints = 150, // The number of points we start with.
    maxIntersections = 15, // Each point can intersect X times.
    crystal = c.createImageData(c.width, c.height), // The image we draw to the screen.
    pointArray = crystal.data, // The pixel data of that image.
    Point = function() { // Our base point.
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.a = 125;
      this.intersections = 0;
      this.x = 0;
      this.y = 0;
      this.vX = 0;
      this.vY = 0;
    };

// Choose a new random movement (that isn't standstill).
Point.prototype.setDir = function() {
  this.vX = random([-1, 0, 1]);
  this.vY = random([-1, 0, 1]);
  if (this.vX == 0 && this.vY == 0) this.setDir();
} 

// Move our point and determine whether we can keep going or need a new direction.
Point.prototype.update = function() {
  var newX = this.x + this.vX,
      newY = this.y + this.vY;
  
  // If we're going out of the frame, pick a new direction and increment our intersections.
  if (newX < 0 || newX > c.width) {
    this.intersections++;
    this.setDir();
  } else {
    this.x = newX;
  }
  if (newY < 0 || newY > c.height) {
    this.intersections++;
    this.setDir();
  } else {
    this.y = newY;
  }
  
  // If we've entered a pixel that has already been set, increment intersections and pick a new direction.
  if (this.intersections < maxIntersections && pointArray[getPixel(this.x, this.y)+3] > 0) {
    this.intersections++;
    this.setDir();
  }
}

// Draw our point to the pointArray.
Point.prototype.draw = function() {
  var pixel = getPixel(this.x, this.y);
  pointArray[pixel] = this.r;
  pointArray[pixel + 1] = this.g;
  pointArray[pixel + 2] = this.b;  
  pointArray[pixel + 3] = this.a;
}

// Create our points.
c.setup = function() {
  crystal = c.createImageData(c.width, c.height);
  pointArray = crystal.data;
  points = [];
  for (var i=0;i<maxPoints;i++) {
    var point = new Point();
    point.x = floor(random(0, c.width));
    point.y = floor(random(0, c.height));
    point.setDir();
    points.push(point);
  }
}

// Update our points. Remove any that have had their max intesections.
c.update = function() {
  var i = points.length;
  while(i--) {
    if (points[i].intersections >= maxIntersections) {
      points.splice(i,1);
    }
    else {
      points[i].update();
    }
  } 
}

// Draw our points to the screen.
c.draw = function() {
  var i = points.length;
  while (i--) {
    points[i].draw();
  }
  c.putImageData(crystal, 0, 0);
}

// Click/reize rebuilds the crystal.
c.click = c.resize = c.setup;

// Get the pixel position in the array.
function getPixel(x, y) {
  return (x * 4) + (y * (crystal.width * 4));
}