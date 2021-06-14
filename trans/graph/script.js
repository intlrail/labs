//math utils
function lineline(x1, y1, x2, y2, x3, y3, x4, y4) {
  var v1x = x2 - x1,
    v1y = y2 - y1,
    v2x = x4 - x3,
    v2y = y4 - y3;
  var w = -v1x * v2y + v1y * v2x,
    wa = -(x3 - x1) * v2y + (y3 - y1) * v2x,
    wb = v1x * (y3 - y1) - v1y * (x3 - x1);
  var a = wa / w,
    b = wb / w;

  if (a >= 0 && a <= 1 && b >= 0 && b <= 1) {
    return [x1 + v1x * a, y1 + v1y * a];
  } else return false;
}

function dist(pt, nx, ny) {
  if (Array.isArray(nx))
    return Math.sqrt((pt[0] - nx[0]) * (pt[0] - nx[0]) + (pt[1] - nx[1]) * (pt[1] - nx[1]));
  else
    return Math.sqrt((pt[0] - nx) * (pt[0] - nx) + (pt[1] - ny) * (pt[1] - ny));
}

function adiff(a1, a2) {
  var r = a2 - a1;
  if (r > Math.PI) r -= 2 * Math.PI;
  if (r < -Math.PI) r += 2 * Math.PI;
  return r;
};

//main stuff
var graph = {
    grid: [],
    edges: []
  },
  vx, vy, bx, by, tgx, tgy, etgx, etgy;
var mindist = 77,
  generatorTries = 300,
  prob = 0.618;
var desiredTracks = 8;
var behindTheScenes = false; //violates encapsulation xD


function generateGrid(graph, minX, maxX, minY, maxY) //can't be maxX
{
  var grid = graph.grid,
    edges = graph.edges;

  var newedge, tdx, ngrid, dhash = [],
    nx, ny, t, dnow, mnx, mxx, mny, mxy;
  var failed = 0;

  gen: while (failed < generatorTries && (Math.random() < prob)) {
    nx = minX + Math.random() * (maxX - minX);
    ny = minY + Math.random() * (maxY - minY);
    for (t = 0; t < grid.length; t++) {
      dnow = dist(grid[t].c, nx, ny);
      dhash[t] = dnow;

      if (dnow < mindist) {
        failed++;
        continue gen;
      }
    }
    ngrid = {
      c: [nx, ny],
      neighbors: [],
      source: false
    };

    for (t = 0; t < grid.length; t++) {
      dnow = dhash[t];

      if (dnow < 3 * mindist) //this can be an edge!
      {
        newedge = true;
        tdx = edges.length;
        mnx = Math.min(nx, grid[t].c[0]);
        mxx = Math.max(nx, grid[t].c[0]);

        mny = Math.min(ny, grid[t].c[1]);
        mxy = Math.max(ny, grid[t].c[1]);

        for (t2 = 0; t2 < edges.length; t2++) {
          if (edges[t2].e[0] == grid[t] || edges[t2].e[1] == grid[t] || edges[t2].e[0] == ngrid || edges[t2].e[1] == ngrid) continue;

          if (mnx > edges[t2].mxx || mxx < edges[t2].mnx) continue;
          if (mny > edges[t2].mxy || mxy < edges[t2].mny) continue;


          col = lineline(edges[t2].e[0].c[0], edges[t2].e[0].c[1], edges[t2].e[1].c[0], edges[t2].e[1].c[1], grid[t].c[0], grid[t].c[1], nx, ny);

          if (col && edges[t2].length <= dnow) //if it collides with shorter or equal
          {
            newedge = false;
            break;
          }

          if (t2 < tdx && edges[t2].length > dnow) //we've found a place to insert new edge (sorted by length)
            tdx = t2;

          if (col) //now we know we can delete edges, coz we will insert new one (array is sorted)
          {
            t2 = removeEdge(graph, t2);
          }
        }
        if (newedge) {
          newedge = {
            e: [grid[t], ngrid],
            length: dnow,
            mnx: mnx,
            mxx: mxx,
            mny: mny,
            mxy: mxy,
            type: 0,
            fill: 0,
            fillFrom: 0,
            fillStart: 0
          };
          edges.splice(tdx, 0, newedge);
          grid[t].neighbors.push(ngrid);
          ngrid.neighbors.push(grid[t]);
        }
      }
    }
    failed = 0;
    grid.push(ngrid);
  }
}

function moveGrid(graph, mx, my) {
  var grid = graph.grid,
    edges = graph.edges;

  var t, t2, a, b, t4;
  //move & remove
  for (t = 0; t < grid.length; t++) {
    if ((grid[t].c[0] + mx) > bx / 2 || (grid[t].c[0] + mx) < -bx / 2 || (grid[t].c[1] + my) > by / 2 || (grid[t].c[1] + my) < -by / 2) {
      t = removePoint(graph, t);
    } else {
      grid[t].c[0] += mx;
      grid[t].c[1] += my;
    }
  }

  for (t = 0; t < edges.length; t++) {
    edges[t].mnx += mx;
    edges[t].mxx += mx;
    edges[t].mny += my;
    edges[t].mxy += my;
  }
  //regenerate grid
  if (mx) {
    a = (mx > 0 ? -bx / 2 : bx / 2 + mx);
    b = (mx > 0 ? -bx / 2 + mx : bx / 2);
    if (a > b) {
      t2 = a;
      a = b;
      b = t2;
    }
    for (t = a; t < b; t++)
      generateGrid(graph, t, t + 1, -by / 2, by / 2);
  }
  if (my) {
    a = (my > 0 ? -by / 2 : by / 2 + my);
    b = (my > 0 ? -by / 2 + my : by / 2);
    if (a > b) {
      t2 = a;
      a = b;
      b = t2;
    }
    for (t = a; t < b; t++)
      generateGrid(graph, -bx / 2, bx / 2, t, t + 1);
  }
  tsearch: for (t = 0; t < graph.tracks.length; t++) {
    for (t2 = 0; t2 < graph.tracks[t].t.length; t2++) {
      if (!(graph.tracks[t].t[t2].c[0] < tgx / 2 && graph.tracks[t].t[t2].c[0] > -tgx / 2 && graph.tracks[t].t[t2].c[1] < tgy / 2 && graph.tracks[t].t[t2].c[1] > -tgy / 2)) {
        removePointFromTrack(graph, t, t2, true);
        t--;
        continue tsearch;
      }
    }
  }
}

function fillTracks(graph) {
  var t;
  for (t = 0; t < graph.tracks.length; t++) {
    if (extendTrack(graph, graph.tracks[t]) == 2) {
      swapETGX(graph);
      t = -1;
      continue;
    }
  }
}

function extendTrack(graph, track, generated) {
  if (!track.etimes) track.etimes = 0;
  track.etimes++;
  var isVX, isTGX, dir, t, diff, angle, best, bestdiff, bestangle, angle2 = 0;
  var t, dx, track, t4, t2, t8, dir, e0vx, e0vy, e1vx, e1vy;
  var prevPoint, lastPoint, lastAngle;
  var ret = 0;

  for (dir = 0; dir < 2; dir++) {
    prevPoint = track.t[track.t.length - 2];
    lastPoint = track.t[track.t.length - 1];

    isVX = (lastPoint.c[0] < vx / 2 && lastPoint.c[0] > -vx / 2 && lastPoint.c[1] < vy / 2 && lastPoint.c[1] > -vy / 2);

    //isTGX = true; //what if it's not tgx? another story
    isTGX = lastPoint.c[0] < tgx / 2 && lastPoint.c[0] > -tgx / 2 && lastPoint.c[1] < tgy / 2 && lastPoint.c[1] > -tgy / 2;

    lastAngle = Math.atan2(lastPoint.c[1] - prevPoint.c[1], lastPoint.c[0] - prevPoint.c[0]) + angle2;
    search: while (true) //we'll check the destination not source
      {
        bestdiff = Infinity;

        candidate: for (t = 0; t < lastPoint.neighbors.length; t++) {
          if (lastPoint.neighbors[t] == lastPoint) continue;

          angle = Math.atan2(lastPoint.neighbors[t].c[1] - lastPoint.c[1], lastPoint.neighbors[t].c[0] - lastPoint.c[0]) + angle2;

          diff = Math.abs(adiff(angle, lastAngle));
          if (diff < bestdiff) {
            bestdiff = diff;
            best = lastPoint.neighbors[t];
            bestangle = angle;
          }
        }
        if (bestdiff != Infinity) {

          for (t2 = 0; t2 < graph.tracks.length; t2++) {
            for (t4 = 0; t4 < graph.tracks[t2].t.length - 1; t4++) {
              if (graph.tracks[t2].t[t4] == lastPoint && graph.tracks[t2].t[t4 + 1] == best || graph.tracks[t2].t[t4 + 1] == lastPoint && graph.tracks[t2].t[t4] == best)
                break search;
            }
          }

          if (!(best.c[0] < etgx / 2 && best.c[0] > -etgx / 2 && best.c[1] < etgy / 2 && best.c[1] > -etgy / 2))
            break;

          e0vx = best.c[0] < vx / 2 && best.c[0] > -vx / 2;
          e0vy = best.c[1] < vy / 2 && best.c[1] > -vy / 2;
          e1vx = lastPoint.c[0] < vx / 2 && lastPoint.c[0] > -vx / 2;
          e1vy = lastPoint.c[1] < vy / 2 && lastPoint.c[1] > -vy / 2;

          if (!isVX && (e0vx && e0vy || ((e0vx) ^ (e1vx) && (e0vy) ^ (e1vy)))) {
            if (generated) return 1; //this track is illegal, nothing to do here
            else if (!isTGX) {
              ret = 2;
              break;
            }
            if (isTGX) {
              break;
            }
          } else if (isVX && !(best.c[0] < vx / 2 && best.c[0] > -vx / 2 && best.c[1] < vy / 2 && best.c[1] > -vy / 2))
            isVX = false;

          if (isTGX && (best.c[0] < tgx / 2 && best.c[0] > -tgx / 2 && best.c[1] < tgy / 2 && best.c[1] > -tgy / 2)) {
            track.t.push(best);

            if (!generated)
              for (t4 = 0; t4 < graph.edges.length; t4++) {
                if (graph.edges[t4].e[0] == lastPoint && graph.edges[t4].e[1] == best || graph.edges[t4].e[1] == lastPoint && graph.edges[t4].e[0] == best) {
                  graph.edges[t4].type = track.type + 1;
                  break;
                }
              }
          } else if (isTGX && !(best.c[0] < tgx / 2 && best.c[0] > -tgx / 2 && best.c[1] < tgy / 2 && best.c[1] > -tgy / 2))
            isTGX = false;

          prevPoint = lastPoint;
          lastPoint = best;
          lastAngle = bestangle;
        } else break;
      }

    track.t.reverse();
    angle2 = dir == 0 ? Math.PI : 0;
  }

  return ret;
}


//this should be used only when the user changes stuff
function repaintTracks(graph, mainTrack) {
  var t, t2, t4, queue = [];
  for (t = 0; t < graph.tracks.length; t++) {
    if (graph.tracks[t] != mainTrack)
      queue.push(graph.tracks[t]);
  }
  queue.push(mainTrack);

  for (t = 0; t < graph.edges.length; t++) {
    graph.edges[t].type = 0;
  }

  for (t = 0; t < queue.length; t++)
    paintTrack(queue[t]);
}

function paintTrack(track) {
  var t, t2;
  for (t = 0; t < track.t.length - 1; t++) {
    for (t2 = 0; t2 < graph.edges.length; t2++) {
      if (graph.edges[t2].e[0] == track.t[t] && graph.edges[t2].e[1] == track.t[t + 1] || graph.edges[t2].e[1] == track.t[t] && graph.edges[t2].e[0] == track.t[t + 1]) {
        if (graph.edges[t2].type != 2)
          graph.edges[t2].type = track.type + 1;
        break;
      }
    }
  }
}

function addTrack(graph, visible, type) //visible otherwise for tgx
{
  var rdx, t, t2, watchdog = 0,
    was, ntrack, m = Math.random() * 2 | 0;
  var goodedges = [],
    edge, e0vx, e1vx, e0vy, e1vy;

  for (t = 0; t < graph.edges.length; t++) {
    e0vx = graph.edges[t].e[0].c[0] < vx / 2 && graph.edges[t].e[0].c[0] > -vx / 2;
    e0vy = graph.edges[t].e[0].c[1] < vy / 2 && graph.edges[t].e[0].c[1] > -vy / 2;
    e1vx = graph.edges[t].e[1].c[0] < vx / 2 && graph.edges[t].e[1].c[0] > -vx / 2;
    e1vy = graph.edges[t].e[1].c[1] < vy / 2 && graph.edges[t].e[1].c[1] > -vy / 2;

    if (visible && (!e0vx || !e0vy || !e1vx || !e1vy))
      continue;

    else if (!visible && ((!(graph.edges[t].e[0].c[0] < tgx / 2 && graph.edges[t].e[0].c[0] > -tgx / 2 && graph.edges[t].e[0].c[1] < tgy / 2 && graph.edges[t].e[0].c[1] > -tgy / 2) || !(graph.edges[t].e[1].c[0] < tgx / 2 && graph.edges[t].e[1].c[0] > -tgx / 2 && graph.edges[t].e[1].c[1] < tgy / 2 && graph.edges[t].e[1].c[1] > -tgy / 2) ||
        (e0vx && e0vy) || (e1vx && e1vy)) || ((e0vx) ^ (e1vx) && (e0vy) ^ (e1vy))))
      continue;



    goodedges.push(graph.edges[t]);
  }

  candidate: while (watchdog++ < 15) //probability that it will be ok is high, so no need to check all
    {
      rdx = Math.random() * goodedges.length | 0;
      edge = goodedges[rdx];

      for (t = 0; t < graph.tracks.length; t++) {
        for (t2 = 0; t2 < graph.tracks[t].t.length - 1; t2++) {
          if (graph.tracks[t].t[t2] == edge.e[0] && graph.tracks[t].t[t2 + 1] == edge.e[1] || graph.tracks[t].t[t2] == edge.e[1] && graph.tracks[t].t[t2 + 1] == edge.e[0])
            continue candidate;
        }
      }

      ntrack = {
        t: [],
        type: type !== undefined ? type : 2 + (Math.random() * 3 | 0),
        osource: null,
        odest: null
      };
      ntrack.t.push(edge.e[m], edge.e[1 - m]); //dafuq?

      ntrack.osource = edge.e[m];
      ntrack.odest = edge.e[1 - m];

      graph.tracks.push(ntrack);
      if (extendTrack(graph, ntrack, true) == 1) {
        graph.tracks.length--;
        continue;
      }

      //and now repaint the full track
      paintTrack(ntrack);



      break;
    }
}

function removePoint(graph, tx) //use with while(graph.grid.length)
{
  var t, tt;
  for (t = 0; t < graph.edges.length; t++) {
    if (graph.edges[t].e[0] == graph.grid[tx] || graph.edges[t].e[1] == graph.grid[tx])
      graph.edges.splice(t--, 1);
  }

  for (t = 0; t < graph.grid[tx].neighbors.length; t++)
    graph.grid[tx].neighbors[t].neighbors.splice(graph.grid[tx].neighbors[t].neighbors.indexOf(graph.grid[tx]), 1);

  for (t = 0; t < graph.tracks.length; t++) {
    if ((tt = graph.tracks[t].t.indexOf(graph.grid[tx])) != -1) {
      removePointFromTrack(graph, t, tt);
      t--; //to guarantee this track will be rescanned
    }
  }

  graph.grid.splice(tx--, 1);
  return tx;
}

function removeEdge(graph, tx) //to be called in gengrid
{
  var t, t2;
  graph.edges[tx].e[0].neighbors.splice(graph.edges[tx].e[0].neighbors.indexOf(graph.edges[tx].e[1]), 1);
  graph.edges[tx].e[1].neighbors.splice(graph.edges[tx].e[1].neighbors.indexOf(graph.edges[tx].e[0]), 1);

  for (t = 0; t < graph.tracks.length; t++) {
    for (t2 = 0; t2 < graph.tracks[t].t.length - 1; t2++) {
      if (graph.tracks[t].t[t2] == graph.edges[tx].e[0] && graph.tracks[t].t[t2 + 1] == graph.edges[tx].e[1] || graph.tracks[t].t[t2 + 1] == graph.edges[tx].e[0] && graph.tracks[t].t[t2] == graph.edges[tx].e[1])
        break;
    }
    if (t2 < graph.tracks[t].t.length - 1) {
      removeEdgeFromTrack(graph, t, t2);
      t--; //to guarantee this track will be rescanned
    }
  }

  graph.edges.splice(tx--, 1);
  return tx;
}

function removeEdgeFromTrack(graph, t, tx) {
  if (!tx || tx == graph.tracks[t].t.length - 2) {
    if (!tx) {
      graph.tracks[t].t.splice(0, 1);
    } else {
      graph.tracks[t].t.length--;
    }

    if (graph.tracks[t].t.length < 2)
      graph.tracks.splice(t, 1);
  } else {
    //don't splice any point here
    //split this into two
    var ntrack = {
        t: [],
        type: graph.tracks[t].type,
        osource: null,
        odest: null
      },
      t2, b;
    for (t2 = 0, b = 0; t2 < graph.tracks[t].t.length; t2++) {
      if (graph.tracks[t].t[t2].source) {
        b = t2;
        break;
      }
    }

    if (tx < b) {
      ntrack.t = graph.tracks[t].t.slice(0, tx + 1);
      graph.tracks[t].t.splice(0, tx + 1);
    } else {
      ntrack.t = graph.tracks[t].t.slice(tx + 1);
      graph.tracks[t].t.length = tx + 1;
    }
  }
}

function removePointFromTrack(graph, t, a, scan) {

  if (scan) {
    var a1 = a > 0 ? a - 1 : a,
      a2 = a < graph.tracks[t].t.length - 1 ? a + 1 : a;
    var ts, ts2;
    for (ts2 = 0; ts2 < graph.edges.length; ts2++) {
      if (graph.edges[ts2].e[0] == graph.tracks[t].t[a1] && graph.edges[ts2].e[1] == graph.tracks[t].t[a] || graph.edges[ts2].e[1] == graph.tracks[t].t[a1] && graph.edges[ts2].e[0] == graph.tracks[t].t[a] || graph.edges[ts2].e[0] == graph.tracks[t].t[a] && graph.edges[ts2].e[1] == graph.tracks[t].t[a2] || graph.edges[ts2].e[1] == graph.tracks[t].t[a] && graph.edges[ts2].e[0] == graph.tracks[t].t[a2]) {
        graph.edges[ts2].type = 0;
      }
    }
  }

  if (graph.tracks[t].osource == graph.tracks[t].t[a] || graph.tracks[t].odest == graph.tracks[t].t[a]) {
    graph.tracks[t].osource = graph.tracks[t].odest = null;
  }

  if (a == 0 || a == (graph.tracks[t].t.length - 1)) {
    graph.tracks[t].t.splice(a, 1);

    if (graph.tracks[t].t.length < 2)
      graph.tracks.splice(t, 1);
  } else if (a == 1 || a == (graph.tracks[t].t.length - 2)) {
    if (a == 1) {
      graph.tracks[t].t.splice(0, 2);
    } else {
      graph.tracks[t].t.length -= 2;
    }

    if (graph.tracks[t].t.length < 2)
      graph.tracks.splice(t, 1);
  } else {
    //split this into two
    var ntrack = {
        t: [],
        type: graph.tracks[t].type,
        osource: null,
        odest: null
      },
      t2, b;
    for (t2 = 0, b = 0; t2 < graph.tracks[t].t.length; t2++) {
      if (graph.tracks[t].t[t2].source) {
        b = t2;
        break;
      }
    }

    if (a < b) {
      ntrack.t = graph.tracks[t].t.slice(0, a);

      graph.tracks[t].t.splice(0, a + 1);
    } else {
      ntrack.t = graph.tracks[t].t.slice(a + 1);

      graph.tracks[t].t.length = a;
    }

    graph.tracks.push(ntrack);
  }
}

function swapETGX(graph) {
  var t;
  for (t = 0; t < graph.grid.length; t++) {
    if (!(graph.grid[t].c[0] < tgx / 2 && graph.grid[t].c[0] > -tgx / 2 && graph.grid[t].c[1] < tgy / 2 && graph.grid[t].c[1] > -tgy / 2) && (graph.grid[t].c[0] < etgx / 2 && graph.grid[t].c[0] > -etgx / 2 && graph.grid[t].c[1] < etgy / 2 && graph.grid[t].c[1] > -etgy / 2)) {
      t = removePoint(graph, t);
    }
  }

  //fill horizontal bars
  for (t = tgy / 2; t < by / 2; t++) {
    generateGrid(graph, -bx / 2, bx / 2, t, t + 1);
    generateGrid(graph, -bx / 2, bx / 2, -t, -t - 1);
  }

  //and vertical bars
  for (t = tgx / 2; t < bx / 2; t++) {
    generateGrid(graph, t, t + 1, -tgy / 2, tgy / 2);
    generateGrid(graph, -t, -t - 1, -tgy / 2, tgy / 2);
  }
}
var clx, cly;

function centerAt(mx, my) {
  clx = mx;
  cly = my;
  if (mx || my)
    moveGrid(graph, mx, my);
}

function setSize(x, y) {
  graph = {
    grid: [],
    edges: [],
    tracks: [],
    reserved: []
  }
  vx = x;
  vy = y;
  bx = x + 10 * mindist + 5 * mindist; //edge cant be longer, so it may not go into queue zone
  by = y + 10 * mindist + 5 * mindist;

  etgx = x + 4 * mindist + 5 * mindist;
  etgy = y + 4 * mindist + 5 * mindist;

  tgx = x + 4 * mindist;
  tgy = y + 4 * mindist;

  var t;
  for (t = -bx / 2; t < bx / 2; t++)
    generateGrid(graph, t, t + 1, -by / 2, by / 2);

  fillTracks(graph);

  addTrack(graph, true, 0);
  for (t = 1; t < desiredTracks; t++)
    addTrack(graph, true);

  //repaintTracks(graph, graph.tracks[0]);
}

//view stuff
var tx = document.getElementById('canvas').getContext('2d'),
  dx, dy;
//temp
var radius = 1,
  nodeColor = 'rgb(255,0,0)',
  standardWidth = 2,
  standardColor = 'rgb(45,45,45)',
  ourWidth = 4,
  ourColor = 'rgb(250,250,250)',
  trainWidth = 2,
  trainColor = 'rgb(0,0,250)',
  trackWidth = 2.5,
  trackColor1 = 'rgb(154,154,110)',
  trackColor2 = 'rgb(110,154,154)',
  trackColor3 = 'rgb(110,154,110)';

function setDisplaySize(x, y) {
  tx.canvas.width = dx = x;
  tx.canvas.height = dy = y;
  tx.translate(dx / 2, dy / 2);
}

function paintGrid(graph) {
  tx.clearRect(-dx / 2, -dy / 2, dx, dy);
  if (behindTheScenes) {
    tx.save();
    tx.scale(1 / 3, 1 / 3);
    tx.strokeStyle = 'rgb(174,174,74)';
    tx.strokeRect(-dx / 2, -dy / 2, dx, dy);
    tx.strokeStyle = 'rgb(74,174,74)';
    tx.strokeRect(-tgx / 2, -tgy / 2, tgx, tgy); //violates encapsulation
    tx.strokeStyle = 'rgb(74,174,174)';
    tx.strokeRect(-etgx / 2, -etgy / 2, etgx, etgy); //violates encapsulation
  }

  tx.fillStyle = nodeColor;

  var t, tt, ac;
  for (tt = 0; tt < 7; tt++) //coz context switch is expensive
  {
    if (tt == 0) //standard
    {
      tx.lineWidth = standardWidth;
      tx.strokeStyle = standardColor;
    } else if (tt == 1) //our road
    {
      tx.lineWidth = ourWidth;
      tx.strokeStyle = ourColor;
    } else if (tt == 2 || tt == 6) {
      tx.lineWidth = trainWidth;
      tx.strokeStyle = trainColor;
    } else if (tt == 3) {
      tx.lineWidth = trackWidth;
      tx.strokeStyle = trackColor1;
    } else if (tt == 4) {
      tx.lineWidth = trackWidth;
      tx.strokeStyle = trackColor2;
    } else if (tt == 5) {
      tx.lineWidth = trackWidth;
      tx.strokeStyle = trackColor3;
    }

    for (t = 0; t < graph.edges.length; t++) {
      if (tt == 6 && !graph.edges[t].fill || tt != 6 && graph.edges[t].type != tt) continue;
      tx.beginPath();
      if (tt == 6) {
        tx.moveTo(graph.edges[t].e[graph.edges[t].fillFrom].c[0] + graph.edges[t].fillStart * (graph.edges[t].e[1 - graph.edges[t].fillFrom].c[0] - graph.edges[t].e[graph.edges[t].fillFrom].c[0]), graph.edges[t].e[graph.edges[t].fillFrom].c[1] + graph.edges[t].fillStart * (graph.edges[t].e[1 - graph.edges[t].fillFrom].c[1] - graph.edges[t].e[graph.edges[t].fillFrom].c[1]));
        tx.lineTo(graph.edges[t].e[graph.edges[t].fillFrom].c[0] + graph.edges[t].fill * (graph.edges[t].e[1 - graph.edges[t].fillFrom].c[0] - graph.edges[t].e[graph.edges[t].fillFrom].c[0]), graph.edges[t].e[graph.edges[t].fillFrom].c[1] + graph.edges[t].fill * (graph.edges[t].e[1 - graph.edges[t].fillFrom].c[1] - graph.edges[t].e[graph.edges[t].fillFrom].c[1]));
      } else {
        tx.moveTo(graph.edges[t].e[0].c[0], graph.edges[t].e[0].c[1]);
        tx.lineTo(graph.edges[t].e[1].c[0], graph.edges[t].e[1].c[1]);
      }
      tx.stroke();
    }
  }


  for (t = 0; t < graph.grid.length; t++) {
    tx.beginPath();
    tx.arc(graph.grid[t].c[0], graph.grid[t].c[1], graph.grid[t].loly ? radius * 2 : radius, 0, 2 * Math.PI);
    tx.fill();
  }
  tx.restore();
}

//controller stuff
/*

-vx - view zone
-tgx - new tracks go here if they don't cross view zone - at least 1.3mindist to allow any edge here, max 45, others would intersect view zone
-etgx - extension, we swap it if tracks cross view zone because they return in this zone
-bx - the generation zone
bx is unstable, we need stable dist = empirically 3x mindist


*/
addEventListener('resize', go);

var _trainLength = 0.25,
  trainLength = mindist / 4,
  _speed = 0.124,
  speed = 2.4;
var cursor = {
  track: null,
  backEdge: null,
  headEdge: null,
  source: null,
  destination: null,
  newPart: 0,
  backX: null,
  backY: null,
  headX: null,
  headY: null
};


function advance() {
  cursor.newPart = 0;
  if (cursor.backEdge)
    cursor.backEdge.fill = 0;
  cursor.backEdge = cursor.headEdge;
  cursor.backEdge.fillFrom = 1 - cursor.backEdge.fillFrom;
  cursor.backEdge.fillStart = 0;

  var t, dx = cursor.track.t.length,
    was;
  for (t = 0, was = false; t < cursor.track.t.length; t++) {
    if (!was && cursor.track.t[t] == cursor.source) was = true;
    else if (was && cursor.track.t[t] == cursor.destination) {
      dx = t + 1;
      break;
    } else was = false;
  }
  if (dx == cursor.track.t.length) //okrzei mode (end of rail...)
    throw 'fail';

  cursor.source.source = false;

  cursor.source = cursor.destination;
  cursor.destination = cursor.track.t[dx];

  cursor.source.source = true;

  setCursorEdge(cursor.source, cursor.destination);
}

function setCursorEdge(source, destination) {
  var t;
  for (t = 0; t < graph.edges.length; t++) {
    if (graph.edges[t].e[0] == source && graph.edges[t].e[1] == destination) {
      cursor.headEdge = graph.edges[t];
      graph.edges[t].fillFrom = 0;
      break;
    } else if (graph.edges[t].e[1] == source && graph.edges[t].e[0] == destination) {
      cursor.headEdge = graph.edges[t];
      graph.edges[t].fillFrom = 1;
      break;
    }
  }

  cursor.headEdge.fillStart = 0;
}

function step(cursor) {
  var toadd = speed;
  if (cursor.newPart + speed > cursor.headEdge.length) {
    toadd = cursor.newPart + speed - cursor.headEdge.length;
    advance(); //this will throw if the end or sth?
  }
  cursor.newPart += toadd;
  cursor.headEdge.fill = cursor.newPart / cursor.headEdge.length;

  headX = cursor.headEdge.e[cursor.headEdge.fillFrom].c[0] + (cursor.headEdge.fill) * (cursor.headEdge.e[1 - cursor.headEdge.fillFrom].c[0] - cursor.headEdge.e[cursor.headEdge.fillFrom].c[0]);
  headY = cursor.headEdge.e[cursor.headEdge.fillFrom].c[1] + (cursor.headEdge.fill) * (cursor.headEdge.e[1 - cursor.headEdge.fillFrom].c[1] - cursor.headEdge.e[cursor.headEdge.fillFrom].c[1]);


  if (trainLength > cursor.newPart) {
    cursor.backEdge.fill = (trainLength - cursor.newPart) / cursor.backEdge.length;

    backX = cursor.backEdge.e[cursor.backEdge.fillFrom].c[0] + (cursor.backEdge.fill) * (cursor.backEdge.e[1 - cursor.backEdge.fillFrom].c[0] - cursor.backEdge.e[cursor.backEdge.fillFrom].c[0]);
    backY = cursor.backEdge.e[cursor.backEdge.fillFrom].c[1] + (cursor.backEdge.fill) * (cursor.backEdge.e[1 - cursor.backEdge.fillFrom].c[1] - cursor.backEdge.e[cursor.backEdge.fillFrom].c[1]);

  } else {
    cursor.headEdge.fillStart = (cursor.newPart - trainLength) / cursor.headEdge.length;

    backX = cursor.headEdge.e[cursor.headEdge.fillFrom].c[0] + (cursor.headEdge.fillStart) * (cursor.headEdge.e[1 - cursor.headEdge.fillFrom].c[0] - cursor.headEdge.e[cursor.headEdge.fillFrom].c[0]);
    backY = cursor.headEdge.e[cursor.headEdge.fillFrom].c[1] + (cursor.headEdge.fillStart) * (cursor.headEdge.e[1 - cursor.headEdge.fillFrom].c[1] - cursor.headEdge.e[cursor.headEdge.fillFrom].c[1]);

    if (cursor.backEdge)
      cursor.backEdge.fill = 0;
  }

  centerX = (backX + headX) / 2;
  centerY = (backY + headY) / 2;


  centerAt(-centerX, -centerY);
}

function jumpToTrack(track) {
  if (cursor.backEdge)
    cursor.backEdge.fill = 0;

  if (cursor.headEdge)
    cursor.headEdge.fill = 0;

  cursor.track = track;
  cursor.newPart = trainLength + 0.1;
  cursor.backEdge = null;

  cursor.source = track.osource;
  cursor.destination = track.odest;
  track.osource = track.odest = null;

  setCursorEdge(cursor.source, cursor.destination);
  step(cursor);
}

function go() {
  setDisplaySize(innerWidth, innerHeight);
  setSize(innerWidth, innerHeight);

  jumpToTrack(graph.tracks[0]);
  fillTracks(graph);

  paintGrid(graph);
}
go();

function cgo() {
  requestAnimationFrame(cgo); //yes I DO know it's wrong - it shouldn't be used for logic, just for painting, but no f... TIMEEEEEE... ;/
  step(cursor);

  fillTracks(graph);

  for (var t = graph.tracks.length; t < desiredTracks; t++)
    addTrack(graph);

  fillTracks(graph);

  paintGrid(graph);
}
cgo()

//GUI
var gui =  new dat.GUI();
/*
dat.gui helper functions
*/
function forceStep(ctrl, pow)
{
 ctrl.step(Math.pow(10, -pow));
 ctrl.__impliedStep = Math.pow(10, -pow);
 ctrl.__precision = pow;
 return ctrl;
}


function chTrain()
{
 trainLength = mindist*_trainLength;
 go();
}
function chSpeed()
{
 speed = _speed*trainLength;
}

var ggui = gui.addFolder('Graph settings');
ggui.add(window, 'mindist').name('Min edge length').onFinishChange(go);
ggui.add(window, 'prob').min(0).max(1).name('Density probability').onFinishChange(go);
ggui.add(window, 'generatorTries').name('Max node tries').min(1).onFinishChange(go);


var dgui = gui.addFolder('Display settings');
dgui.add(window, 'radius').min(0).name('Node radius');
dgui.addColor(window, 'nodeColor').name('Node color');
dgui.add(window, 'standardWidth').min(0).name('Edge width');
dgui.addColor(window, 'standardColor').name('Edge color');
dgui.add(window, 'ourWidth').min(0).name('Main track width');
dgui.addColor(window, 'ourColor').name('Main track color');
dgui.add(window, 'trainWidth').min(0).name('Train width');
dgui.addColor(window, 'trainColor').name('Train color');
dgui.add(window, 'trackWidth').min(0).name('Other track width');
dgui.addColor(window, 'trackColor1').name('Other track color #1');
dgui.addColor(window, 'trackColor2').name('Other track color #2');
dgui.addColor(window, 'trackColor3').name('Other track color #3');

gui.add(window, 'behindTheScenes').name('Debug view');
gui.add(window, 'desiredTracks').name('Desired tracks').min(0).step(1);
gui.add(window, '_trainLength').min(0).max(0.9).name('Train length (/min)').onFinishChange(chTrain);
gui.add(window, '_speed').min(0).max(0.9).name('Speed (/train)').onFinishChange(chSpeed); //divide with remainder?