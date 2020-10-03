/*
  Johan Karlsson, 2020
  https://twitter.com/DonKarlssonSan
  MIT License, see Details View
*/

let svg;
let w = 1200;
let h = 1200;

function setup() {
  svg = document.querySelector("svg");
  document.addEventListener("click", draw);
  document.addEventListener("keydown", onKeyDown);
}

function createSvgElement(elementName) {
  const svgNs = "http://www.w3.org/2000/svg";
  return document.createElementNS(svgNs, elementName);
}

function onKeyDown (e) {
  if(e.code === "KeyD") {
    download();
  }
}

function download() {
  let svgDoc = svg.outerHTML;
  let filename = "circle-grid.svg";
  let element = document.createElement("a");
  element.setAttribute("href", "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgDoc));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.addEventListener("click", e => e.stopPropagation());
  element.click();
  document.body.removeChild(element);
}

function drawPattern(groupElement) {
  for(let col = 0; col < 5; col++) {
    for(let row = 0; row < 5; row++) {
      if(col === 0 && row === 4 || 
         col === 1 && row === 3 || 
         col === 2 && row === 2 ||
         col === 3 && row === 1) {
        drawEccentricCircles(col, row, 1, groupElement);
        drawRandomEccentricCircles(col, row, 30, groupElement);
        //drawConcentricCircles(col, row, groupElement);
      } else if(col === 4 && row === 0) {
        drawEccentricCircles(col, row, -1, groupElement);
      } /*else if(col === 3 && row === 1) {
        drawSpiragraph(3, 1, groupElement);
        drawConcentricCircles(col, row, groupElement);
        //drawStripedCircle(col, row, groupElement);
        //drawRandomSquares(3, 1, 120, groupElement);
      }*/ else {
        drawRandomEccentricCircles(col, row, 70, groupElement);
      }
    }
  }
}

function drawConcentricCircles(col, row, groupElement) {
  drawCircle(col, row, 10, groupElement);
  drawCircle(col, row, 20, groupElement);
  drawCircle(col, row, 30, groupElement);
  drawCircle(col, row, 40, groupElement);
  drawCircle(col, row, 50, groupElement);
  drawCircle(col, row, 60, groupElement);
  drawCircle(col, row, 70, groupElement);
  drawCircle(col, row, 80, groupElement);
  drawCircle(col, row, 90, groupElement);
}

function drawStripedCircle(col, row, groupElement) {
  let x0 = (col + 1) * w / 6;
  let y0 = (row + 1) * h / 6;
  let r = 80;
  // Since we know the y position of the stripe
  // and we know the radius, we can calculate x1
  // and x2 with the Pythagorian theorem:
  // a^2 + b^2 = c^2
  // a = sqrt(c^2 - b^2);
  let stripes = 20;
  for(let i = 0; i < stripes; i++) {
    let y = r * 2 * i / stripes - r;
    let x = Math.sqrt(r*r - y*y);
    console.log(y, x0, x);
    let x1 = x0 + x;
    let x2 = x0 - x;
    addLine(x1, y + y0, x2, y + y0, groupElement);
  }
}

function drawSquare(x, y, size, groupElement) {
  let square = createSvgElement("rect");
  square.setAttribute("x", x - size / 2);
  square.setAttribute("y", y - size / 2);
  square.setAttribute("width", size);
  square.setAttribute("height", size);
  groupElement.appendChild(square);
}

function drawSpiragraph(col, row, groupElement) {
  let x0 = (col + 1) * w / 6;
  let y0 = (row + 1) * h / 6;
  let r = 30;
  let R = 60;
  let nrOfCircles = 8;
  for(let i = 0; i < nrOfCircles; i++) {
    let angle = Math.PI * 2 * i / nrOfCircles;
    let x = Math.cos(angle) * r + x0;
    let y = Math.sin(angle) * r + y0;
    drawCircleByCoords(x, y, R, groupElement);
  }
}

function addLine(x1, y1, x2, y2, groupElement) {
  let line = createSvgElement("line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  groupElement.appendChild(line);
}

function drawCircles(col, row, r, groupElement) {
  drawCircle
}

function drawCircle(col, row, r, groupElement) {
  let x = (col + 1) * w / 6;
  let y = (row + 1) * h / 6;
  drawCircleByCoords(x, y, r,  groupElement);
}

function drawRandomEccentricCircles(col, row, maxRadius, groupElement) {
  let x = (col + 1) * w / 6;
  let y = (row + 1) * h / 6;
  for(let i = 0; i < 5; i++) {
    let xOffset = Math.random() * 20 - 10;
    let yOffset = Math.random() * 20 - 10;
    let r = Math.random() * maxRadius + 10;
    drawCircleByCoords(x + xOffset, y + yOffset, r,  groupElement);

  }
}

function drawRandomSquares(col, row, maxRadius, groupElement) {
  let x = (col + 1) * w / 6;
  let y = (row + 1) * h / 6;
  for(let i = 0; i < 5; i++) {
    let xOffset = Math.random() * 20 - 10;
    let yOffset = Math.random() * 20 - 10;
    let r = Math.random() * maxRadius + 10;
    drawSquare(x + xOffset, y + yOffset, r,  groupElement);
  }
}


function drawEccentricCircles(col, row, direction, groupElement) {
  let x = (col + 1) * w / 6;
  let y = (row + 1) * h / 6;
  for(let i = 0; i < 7; i++) {
    let xOffset = -i * 7 * direction;
    let yOffset = i * 7 * direction;
    let r = i * 10 + 10;
    drawCircleByCoords(x + xOffset + 50 * direction, y + yOffset - 50 * direction, r,  groupElement);

  }
}

function drawCircleByCoords(x, y, r, groupElement) {
  let circle = createSvgElement("circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", r);
  groupElement.appendChild(circle);
}

function draw() {
  console.clear();
  
  let group = document.querySelector("#container");
  if(group) {
    group.remove();
  }
  group = createSvgElement("g");
  group.setAttribute("id", "container");
  group.setAttribute("fill", "none");
  group.setAttribute("stroke", "white");
  group.setAttribute("stroke-linecap", "round");
  group.setAttribute("stroke-linejoin", "round");
  
  drawPattern(group);
  svg.appendChild(group);
}

setup();
draw();