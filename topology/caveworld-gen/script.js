let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    map = [],
    squares = [],
    rooms = [],
    size = 10,
    fillPrecentage = 0.574,
    wallThreshold = 10,
    roomThreshold = 10;

class Room {
  constructor(tiles) {
    this.size = tiles.length;
    this.tiles = tiles;
    this.mainRoom = false;
    this.connectedToMainRoom = false;
    this.outline = this.getOutline();
    this.connectedRooms = [];
  }
  
  getOutline() {
    let outline = [];
    for(let i=0; i<this.tiles.length; i++) {
      let tile = this.tiles[i];
      for(let x=tile.x-1; x<=tile.x+1; x++) {
        for(let y=tile.y-1; y<=tile.y+1; y++) {
          if((x==tile.x || y==tile.y) && isInBounds(x,y)) {
            if(map[x][y] == 1) {
              outline.push(tile);
              break;
            }
          }
        }
      }
    }
    return outline;
  }
  
  connectTo(room) {
    this.connectedRooms.push(room);
    room.connectedRooms.push(this);
    if(this.connectedToMainRoom)
      room.connectedToMainRoom = true;
    if(room.connectedToMainRoom)
      this.connectedToMainRoom = true;
    
    let bestTileA = -1, bestTileB = -1, bestDist = -1;
    for(let i=0; i<this.tiles.length; i++) {
      let tileA = this.tiles[i];
      for(let j=0; j<room.tiles.length; j++) {
        let tileB = room.tiles[j],
            dx = tileA.x - tileB.x,
            dy = tileA.y - tileB.y,
            dist = dx*dx+dy*dy;
        if(bestDist == -1 || dist < bestDist) {
          bestDist = dist;
          bestTileA = tileA;
          bestTileB = tileB;
        }
      }
    }
    
    ctx.strokeStyle = "#bbb";
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(bestTileA.y * size, bestTileA.x * size);
    ctx.lineTo(bestTileB.y * size, bestTileB.x * size);
    ctx.stroke();
  }
}

class Square {
  constructor(configuration, x, y) {
    this.configuration = configuration;
    this.x = x;
    this.y = y;
  }
  
  draw() {
    let x = this.x,
        y = this.y;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    switch(this.configuration) {
      case 0:
        break;
      case 1:
        ctx.moveTo(x, y+size);
        ctx.lineTo(x+size/2, y+size);
        ctx.lineTo(x, y+size/2);
        break;
      case 2:
        ctx.moveTo(x+size, y+size);
        ctx.lineTo(x+size/2, y+size);
        ctx.lineTo(x+size, y+size/2);
        break;
      case 3:
        ctx.moveTo(x, y+size);
        ctx.lineTo(x, y+size/2);
        ctx.lineTo(x+size, y+size/2);
        ctx.lineTo(x+size, y+size);
        break;
      case 4:
        ctx.moveTo(x+size,y);
        ctx.lineTo(x+size/2, y);
        ctx.lineTo(x+size, y+size/2);
        break;
      case 5:
        ctx.moveTo(x+size, y);
        ctx.lineTo(x+size, y+size/2);
        ctx.lineTo(x+size/2, y+size);
        ctx.lineTo(x, y+size);
        ctx.lineTo(x, y+size/2);
        ctx.lineTo(x+size/2, y);
        break;
      case 6:
        ctx.moveTo(x+size, y);
        ctx.lineTo(x+size/2, y);
        ctx.lineTo(x+size/2, y+size);
        ctx.lineTo(x+size, y+size);
        break;
      case 7:
        ctx.moveTo(x+size, y);
        ctx.lineTo(x+size, y+size);
        ctx.lineTo(x, y+size);
        ctx.lineTo(x, y+size/2);
        ctx.lineTo(x+size/2, y);
        break;
      case 8:
        ctx.moveTo(x, y);
        ctx.lineTo(x+size/2, y);
        ctx.lineTo(x, y+size/2);
        break;
      case 9:
        ctx.moveTo(x, y);
        ctx.lineTo(x+size/2, y);
        ctx.lineTo(x+size/2, y+size);
        ctx.lineTo(x, y+size);
        break;
      case 10:
        ctx.moveTo(x, y);
        ctx.lineTo(x+size/2, y);
        ctx.lineTo(x+size, y+size/2);
        ctx.lineTo(x+size, y+size);
        ctx.lineTo(x+size/2, y+size);
        ctx.lineTo(x, y+size/2);
        break;
      case 11:
        ctx.moveTo(x, y);
        ctx.lineTo(x+size/2, y);
        ctx.lineTo(x+size, y+size/2);
        ctx.lineTo(x+size, y+size);
        ctx.lineTo(x, y+size);
        break;
      case 12:
        ctx.moveTo(x, y);
        ctx.lineTo(x+size, y);
        ctx.lineTo(x+size, y+size/2);
        ctx.lineTo(x, y+size/2);
        break;
      case 13:
        ctx.moveTo(x, y);
        ctx.lineTo(x+size, y);
        ctx.lineTo(x+size, y+size/2);
        ctx.lineTo(x+size/2, y+size);
        ctx.lineTo(x, y+size);
        break;
      case 14:
        ctx.moveTo(x, y);
        ctx.lineTo(x+size, y);
        ctx.lineTo(x+size, y+size);
        ctx.lineTo(x+size/2, y+size);
        ctx.lineTo(x, y+size/2);
        break;
      case 15:
        ctx.moveTo(x,y);
        ctx.lineTo(x+size, y);
        ctx.lineTo(x+size, y+size);
        ctx.lineTo(x, y+size);
        break;
    }
    ctx.closePath();
    ctx.fill();
  }
}

let rc = () => {
  return Math.floor(Math.random()*255);
}

let clear = () => {
  ctx.fillStyle = "#aaa";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let resize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  clear();
  if(!map[0]) reload();
  draw();
}

let update = () => {
}

let generateMap = () => {
  for(let i=0; i<canvas.height/size; i++) {
    map[i] = [];
    for(let j=0; j<canvas.width/size; j++) {
      map[i][j] = Math.random() < fillPrecentage ? 1 : 0;
    }
  }
  for(let i=0; i<5; i++) {
    smooth();
  }
}
let generateSquares = () => {
  for(let i=0;i<map.length-1;i++) {
    squares[i] = [];
    for(let j=0;j<map[i].length-1;j++) {
      let config = 0;
      if(map[i][j]) config += 8;
      if(map[i][j+1]) config += 4;
      if(map[i+1][j+1]) config += 2;
      if(map[i+1][j]) config += 1;
      squares[i][j] = new Square(config, j*size+size/4, i*size+size/4);
    }
  }
}

let getRoom = (i,j,visited,kind) => {
  let room = [{x: i, y: j}];
  let que = [{x: i, y: j}];
  while(que.length > 0) {
    let tile = que.shift();
    visited[tile.x][tile.y] = 1;
    for(let x=tile.x-1; x<=tile.x+1; x++) {
      for(let y=tile.y-1; y<=tile.y+1; y++) {
        if(x == tile.x || y == tile.y && isInBounds(x,y)) {
          if(!visited[x][y]) {
            visited[x][y] = 1;
            if(map[x][y] == kind) {
              room.push({x, y});
              que.push({x, y});
            }
          }
        }
      }
    }
  }
  return room;
}
let getRooms = (kind) => {
  let visited = [];
  for(let i=0; i < map.length; i++) {
    visited[i] = [];
    for(let j=0; j < map[i].length; j++) {
      visited[i][j] = 0;
    }
  }
  
  let rooms = [];
  for(let i=0; i<map.length;i++) {
    for(let j=0; j < map[i].length; j++) {
      if(visited[i][j] == 0 && map[i][j] == kind) {
        let room = getRoom(i,j,visited,kind);
        rooms.push(room);
      }
    }
  }
  return rooms;
}
let getRidOfSmallParts = () => {
  let survivors = [];
  let rooms = getRooms(0);
  for(let i=0; i<rooms.length; i++) {
    if(rooms[i].length < roomThreshold) {
      for(let j=0; j<rooms[i].length; j++) {
        let tile = rooms[i][j];
        map[tile.x][tile.y] = 1;
      }
    }
    else {
      survivors.push(rooms[i]);
    }
  }
  
  let walls = getRooms(1);
  for(let i=0; i<walls.length; i++) {
    if(walls[i].length < wallThreshold) {
      for(let j=0; j<walls[i].length; j++) {
        let tile = walls[i][j];
        map[tile.x][tile.y] = 0;
      }
    }
  }
  return survivors;
}

let connectRooms = (rooms) => {
  rooms = rooms.map(room => new Room(room));
  rooms.sort((roomA, roomB) => roomA.size < roomB.size);
  if(rooms.length > 1) {
    rooms[0].mainRoom = true;
    rooms[0].connectedToMainRoom = true;
    rooms[0].connectTo(rooms[1]);
  }
}

let reload = () => {
  map = [];
  generateMap();
  let rooms = getRidOfSmallParts();
  generateSquares();
  clear();
  draw();
  connectRooms(rooms);
}

let draw = () => {
  for(let i=0; i<squares.length; i++) {
    for(let j=0; j<squares[i].length; j++) {
      squares[i][j].draw();
    }
  }
}

let smooth = () => {
  for(let i=0; i<canvas.height/size; i++) {
    for(let j=0; j<canvas.width/size; j++) {
      let adjecentWalls = getSurrounding(j,i);
      if(adjecentWalls < 4) map[i][j] = 0;
      else if(adjecentWalls > 4) map[i][j] = 1;
    }
  }
}

let isInBounds = (x,y) => {
  return !(x < 0 || x >= map.length || y < 0 || y >= map[0].length);
}

let getSurrounding = (middleX,middleY) => {
  let result = 0;
  for (let x = middleX - 1; x <= middleX + 1; x++) {
    for (let y = middleY - 1; y <= middleY + 1; y++) {
      if (y == middleY && x == middleX) continue;
      else if (!isInBounds(y,x)) result+=4;
      else if (isInBounds(y,x)) result += map[y][x];
    }
  }
  return result; 
}

let loop = () => {
  update();
  draw();
  
  // setTimeout(loop, 1000/30);
}

let init = () => {
  window.onresize = resize;
  window.onclick = reload;
  resize();
  document.body.appendChild(canvas);
  
  reload();
}

init();