var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    width = innerWidth,
    height = innerHeight;

canvas.width = width;
canvas.height = height;

//width of canvas, height of canvas, and displace to keep
//lines in bounds
function terrain(width, height, change, range){
	var points = [],
      max = Math.pow(2, Math.ceil(Math.log(width)/Math.log(2))); //needs to be exponenet of 2 that completely fills out the canvas (log2(width)). Math.ceil is necessary to round values up to the nearest whole number (2000 -> 2048, 1000 -> 1024 etc..)
  
  
  //console.log('max ' + max);
  //setting left point
  points[0] = height/2 + (Math.random() * change * 2) - change;
  //console.log('point 0 ' + points[0]);
  //setting right point
  points[max] = height/2 + (Math.random() * change * 2) - change;
  //console.log('point 1 ' + points[max]);
  
  //We're using 2 loops so that i increases and we can keep using it
  //to find the midpoints using max/2 then max/4 etc 
  for (i = 1; i < max; i *= 2) {
    //what iteration we're on... for example looking for max/2 and its endpoints... Just used for my own sanity.
    var iter = (max/i)/2;
    for (mid = iter; mid < max; mid += 2 * iter){
  		//finding midpoint of the line and adjusting it
  		points[mid] = (points[mid-iter] + points[mid + iter])/2;
      //now need to offset new midpoint
      points[mid] += (Math.random() * change * 2) - change;
    }
    //reduces the range of random numbers, to stay inside the canvas
    change *= range;
	}
  //return all the points for the terrain!
  return points;
  
}

//get all the terrain points (which are y values)
var terrainPoints = terrain(width, height, height/16, 0.482);
console.log(terrainPoints);

//takes in an array of points and a boolean to see if it's drawing the bottom or the top (if the points are mirrored or not)
function drawLine(points, mirrored) {
  
  console.log(points);
  //curr is x value
  curr = 0;
  //set start point
  context.moveTo(curr, points[0]);
  //plot the points
  for(i = 1; i < points.length; i++){
		curr += width/points.length;
    //draw line segment
		context.lineTo(curr, points[i]);
    
  }
  //if it's mirrored, fill out the top not the bottom
  if(!mirrored){
  	//fill out rectangle points
  	context.lineTo(width, canvas.height);
  	context.lineTo(0, canvas.height);
	} else {
    //fill out mirrored things
    context.lineTo(width, 0);
    context.lineTo(0, 0);
  }
  context.closePath();
  context.fill(); 
}

//want to mirror the bottom points to create a top terrain
function mirrorPoints(points, width) {
  var mirrored = [];
  for (i = 0; i < points.length; i++) {
    mirrored[i] = points[i] - width;
    console.log('mirrored: ' + mirrored[i]);
    console.log('original: ' + points[i]);
  }
  return mirrored;
}

//mirrored points
var mirrorTerrain = mirrorPoints(terrainPoints, height / 4);

//call drawLine
drawLine(terrainPoints, false);
drawLine(mirrorTerrain, true);