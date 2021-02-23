/*
  Johan Karlsson, 2020
  https://twitter.com/DonKarlssonSan
  MIT License, see Details View
*/

class Logo {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.svgNs = "http://www.w3.org/2000/svg";
    this.color = color;
  }
    
  draw(appendTo) {
    let groupElement = appendTo.querySelector("#jk-logo");
    if(groupElement) {
      groupElement.remove();
    }
    groupElement = document.createElementNS(this.svgNs, "g");

    groupElement.setAttribute("id", "jk-logo");
    groupElement.setAttribute("stroke-width", 0);
    groupElement.setAttribute("fill", "none");
    if(this.color) {
      groupElement.setAttribute("stroke", this.color);
    } else {
      groupElement.setAttribute("stroke", "#000");
    }
    groupElement.setAttribute("stroke-linecap", "round"); 
    
    /*
    let x0 = this.x + 5;
    let y0 = this.y - 25;
    this.addLine(groupElement, x0, y0, x0, y0 + 50);
    this.addPath(groupElement, x0 + 5, y0, x0 + 2, y0 + 25, x0 + 5, y0 + 50);
    this.addPath(groupElement, x0 + 10, y0, x0 + 4, y0 + 25, x0 + 10, y0 + 50);
    this.addPath(groupElement, x0 + 15, y0, x0 + 6, y0 + 25, x0 + 15, y0 + 50);
    this.addPath(groupElement, x0 + 20, y0, x0 + 8, y0 + 25, x0 + 20, y0 + 50);
    
    x0 = this.x - 18;
    y0 = this.y + 12;
    for(let i = 0; i < 6; i++) {
      this.addHalfCircle(groupElement, x0, y0, 3 + i * 2);
    }
    
    x0 = this.x - 5;
    this.addLine(groupElement, x0, this.y - 25, x0, this.y + 12);
    */
    /*
    let x0 = this.x + 10;
    let y0 = this.y - 50;
    this.addLine(groupElement, x0, y0, x0, y0 + 100);
    this.addPath(groupElement, x0 + 10, y0, x0 + 4, y0 + 50, x0 + 10, y0 + 100);
    this.addPath(groupElement, x0 + 20, y0, x0 + 8, y0 + 50, x0 + 20, y0 + 100);
    this.addPath(groupElement, x0 + 30, y0, x0 + 12, y0 + 50, x0 + 30, y0 + 100);
    this.addPath(groupElement, x0 + 40, y0, x0 + 16, y0 + 50, x0 + 40, y0 + 100);
    
    x0 = this.x - 36;
    y0 = this.y + 24;
    for(let i = 0; i < 6; i++) {
      this.addHalfCircle(groupElement, x0, y0, 6 + i * 4);
    }
    
    x0 = this.x - 10;
    this.addLine(groupElement, x0, this.y - 50, x0, this.y + 24);
    */
    
    let x0 = this.x + 5;
    let y0 = this.y - 25;
    this.addLine(groupElement, x0, y0, x0, y0 + 50);
    this.addPath(groupElement, x0 + 10, y0, x0 + 4, y0 + 25, x0 + 10, y0 + 50);
    this.addPath(groupElement, x0 + 20, y0, x0 + 8, y0 + 25, x0 + 20, y0 + 50);
    
    x0 = this.x - 18;
    y0 = this.y + 12;
    for(let i = 0; i < 3; i++) {
      this.addHalfCircle(groupElement, x0, y0, 5 + i * 4);
    }
    
    x0 = this.x - 5;
    this.addLine(groupElement, x0, this.y - 25, x0, this.y + 12);

    appendTo.appendChild(groupElement);
  }
  
  addPath(groupElement, x1, y1, x2, y2, x3, y3) {
    let path = document.createElementNS(this.svgNs, "path");
    let commands = [];
    commands.push(`M ${x1} ${y1}`);
    commands.push(`L ${x2} ${y2}`);
    commands.push(`L ${x3} ${y3}`);
    
    path.setAttribute("d", commands.join(" "));
    groupElement.appendChild(path);
  }
  
  addHalfCircle(groupElement, x, y, r) {
    let path = document.createElementNS(this.svgNs, "path");
    let xStart = x - r;
    let xEnd = x + r;
    let sweepFlag = 0;
    let command = `M ${xStart} ${y} A ${r} ${r} 0 0 ${sweepFlag} ${xEnd} ${y}`;
    path.setAttribute("d", command);
    groupElement.appendChild(path);
  }  
  
  addLine(groupElement, x1, y1, x2, y2) {
    let line = document.createElementNS(this.svgNs, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    groupElement.appendChild(line);
  }
}