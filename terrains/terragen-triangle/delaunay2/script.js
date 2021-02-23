/*
  Johan Karlsson, 2020
  https://twitter.com/DonKarlssonSan
  MIT License, see Details View
  
  Similar triangles (side splitting theorem):
  http://www.malinc.se/math/geometry/similartrianglesen.php
  https://en.wikipedia.org/wiki/Delaunay_triangulation
  https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm
  https://en.wikipedia.org/wiki/Circumscribed_circle
*/

const svgNs = "http://www.w3.org/2000/svg";
let svg;
let w;
let h;

class Triangle {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
  
  vertexes() {
    return [this.a, this.b, this.c];
  }
  
  vertexesAsString() {
    return this.vertexes().map(vertex => `${vertex.x}, ${vertex.y}`).join(", ");
  }
  
  draw(groupElement) {
    let polygon = document.createElementNS(svgNs, "polygon");
    polygon.setAttribute("points", this.vertexesAsString());
    polygon.setAttribute("stroke-width", 0.618);
    groupElement.appendChild(polygon);
    
    // Similar triangles, see link at the top
    let nrOfPoints = this.height() / 4;
    let points1 = this.getPoints(this.c, this.a, nrOfPoints);
    let points2 = this.getPoints(this.c, this.b, nrOfPoints);
    for(let i = 0; i < nrOfPoints; i++) {
      let line = document.createElementNS(svgNs, "line");
      line.setAttribute("x1", points1[i].x);
      line.setAttribute("y1", points1[i].y);
      line.setAttribute("x2", points2[i].x);
      line.setAttribute("y2", points2[i].y);
      line.setAttribute("stroke-width", 0.618);
      groupElement.appendChild(line);
    }
  }
  
  getPoints(p1, p2, nrOfPoints) {
    let points = [];
    let delta = p1.sub(p2).div(nrOfPoints+1);
    for(let i = 1; i < nrOfPoints+1; i++) {
      let currentPos = p2.add(delta.mult(i));
      points.push(currentPos);
    }
    return points;
  }
  
  height() {
    // There's probably a smarter way to do this 
    // with vector math, but this works. =)
    let a = this.a.distanceTo(this.b);
    let b = this.b.distanceTo(this.c);
    let c = this.c.distanceTo(this.a);
    let s = (a + b + c) / 2;
    let h = 2 * Math.sqrt(s * (s - a) * (s - b) * (s - c)) / a;
    return h;
  }

  edges() {
    return [
      [this.a, this.b],
      [this.b, this.c],
      [this.c, this.a]
    ];
  }
  
  sharesAVertexWith(triangle) {
    // TODO: optimize me please!
    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++) {
        let v = this.vertexes()[i];
        let vv = triangle.vertexes()[j];
        if(v.equals(vv)) {
          return true;
        }
      }
    }
    return false;
  }

  hasEdge(edge) {
    for(let i = 0; i < 3; i++) {
      let e = this.edges()[i];
      if(e[0].equals(edge[0]) && e[1].equals(edge[1]) || 
         e[1].equals(edge[0]) && e[0].equals(edge[1])) {
        return true;
      }
    }
    return false;
  }
  
  circumcenter() {
    let d = 2 * (this.a.x * (this.b.y - this.c.y) + 
                 this.b.x * (this.c.y - this.a.y) + 
                 this.c.x * (this.a.y - this.b.y));
    
    let x = 1 / d * ((this.a.x * this.a.x + this.a.y * this.a.y) * (this.b.y - this.c.y) + 
                     (this.b.x * this.b.x + this.b.y * this.b.y) * (this.c.y - this.a.y) + 
                     (this.c.x * this.c.x + this.c.y * this.c.y) * (this.a.y - this.b.y));
    
    let y = 1 / d * ((this.a.x * this.a.x + this.a.y * this.a.y) * (this.c.x - this.b.x) + 
                     (this.b.x * this.b.x + this.b.y * this.b.y) * (this.a.x - this.c.x) + 
                     (this.c.x * this.c.x + this.c.y * this.c.y) * (this.b.x - this.a.x));
    
    return new Vector(x, y);
  }
  
  circumradius() {
    return this.circumcenter().sub(this.a).getLength();    
  }
  
  pointIsInsideCircumcircle(point) {
    let circumcenter = this.circumcenter();
    let circumradius = circumcenter.sub(this.a).getLength();
    let dist = point.sub(circumcenter).getLength();
    return dist < circumradius;
  }
}

function getRandomPoints() {
  let pointList = [];
  let div = Math.random() * 100 + 1000;
  let nrOfPoints = w * h / div;
  for(let i = 0; i < nrOfPoints; i++) {
    pointList.push(new Vector(
      Math.random() * w * 1.4 - 0.2 * w,
      Math.random() * h * 1.4 - 0.2 * h 
    ));
  }
  return pointList;
}

function bowyerWatson (superTriangle, pointList) {
  // pointList is a set of coordinates defining the 
  // points to be triangulated
  let triangulation = [];

  // add super-triangle to triangulation 
  // must be large enough to completely contain all 
  // the points in pointList
  triangulation.push(superTriangle);
  
  // add all the points one at a time to the triangulation
  pointList.forEach(point => {
    let badTriangles = [];
    
    // first find all the triangles that are no 
    // longer valid due to the insertion
    triangulation.forEach(triangle => { 
      if(triangle.pointIsInsideCircumcircle(point)) {
        badTriangles.push(triangle); 
      }
    });
    let polygon = [];
    
    // find the boundary of the polygonal hole
    badTriangles.forEach(triangle => {
      triangle.edges().forEach(edge => {
        let edgeIsShared = false;
        badTriangles.forEach(otherTriangle => {
          if(triangle !== otherTriangle &&  otherTriangle.hasEdge(edge)) {
            edgeIsShared = true;
          }
        });
        if(!edgeIsShared) {
          //edge is not shared by any other 
          // triangles in badTriangles
          polygon.push(edge);
        }
      });
    });
    
    // remove them from the data structure
    badTriangles.forEach(triangle => {
      let index = triangulation.indexOf(triangle);
      if (index > -1) {
        triangulation.splice(index, 1);
      }
    });
    
    // re-triangulate the polygonal hole
    polygon.forEach(edge => {
      //form a triangle from edge to point
      let newTri = new Triangle(edge[0], edge[1], point);
      triangulation.push(newTri);
    });
  });
  
  // done inserting points, now clean up
  let i = triangulation.length;
  while(i--) {
    let triangle = triangulation[i];
    if(triangle.sharesAVertexWith(superTriangle)) {
      //remove triangle from triangulation
      let index = triangulation.indexOf(triangle);
      if (index > -1) {
        triangulation.splice(index, 1);
      }
    }  
  }
  
  return triangulation;
}

function setup() {
  svg = document.querySelector("svg");
  document.addEventListener("click", draw);
  document.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", onResize);
  onResize();
}

function onResize() {
  w = window.innerWidth;
  h = window.innerHeight;
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  draw();
}

function onKeyDown (e) {
  if(e.code === "KeyD") {
    download();
  }
}

function download() {
  let svgDoc = svg.outerHTML;
  let filename = "delunay.svg";
  let element = document.createElement("a");
  element.setAttribute("href", "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgDoc));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.addEventListener("click", e => e.stopPropagation());
  element.click();
  document.body.removeChild(element);
}

function draw() {
  let group = document.querySelector("g");
  if(group) {
    group.remove();
  }
  group = document.createElementNS(svgNs, "g");
  group.setAttribute("fill", "none");
  group.setAttribute("stroke", "#ffffff");
  group.setAttribute("opacity", "0.88");
  group.setAttribute("stroke-linecap", "round");
  group.setAttribute("stroke-linejoin", "round");
  
  let pointList = getRandomPoints();
  
  let superTriangle = new Triangle(
    new Vector(-w * 10, h * 10),
    new Vector(w * 10, h * 10),
    new Vector(w / 2, -h * 10)
  );
  
  let triangles = bowyerWatson(superTriangle, pointList);
  triangles.forEach(t => t.draw(group));
  svg.appendChild(group);
}

setup();