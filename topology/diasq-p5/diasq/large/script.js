// Note: This is just my attempt to understanding how to do this.
// If you want a proper implementation, use https://github.com/qiao/fractal-terrain-generator

var Generator = function(segmentCount, zScaleStart, zScaleReduction) {
  var geometry;
  
  function initGeometry(size) {
    geometry = new THREE.PlaneGeometry(size, size, segmentCount, segmentCount);
    return geometry;
  };
  
  function getVertexZAverage() {
    var sum = 0; 
    for (var i = 0; i < arguments.length; i++) {            
      sum += getVertexZ(arguments[i][0], arguments[i][1]);      
    }        
    return sum / arguments.length;
  };
  
  function generateVertexZ(x, y, average, zScale) {
     var vertex = geometry.vertices[(y*(segmentCount + 1)) + x];
     vertex.z = (average + zScale * (Math.random() - 0.5));
     geometry.verticesNeedUpdate = true;
  };
  
  function getVertexZ(x, y) {
     var vertex = geometry.vertices[(y*(segmentCount + 1)) + x];
     return vertex ? vertex.z : 0;
  };
  
  function diamondSquareStep(square, zScale, next) {      
    function diamond(centerX, centerY, half) {
      var average = getVertexZAverage([centerX - half, centerY],
                                      [centerX + half, centerY],
                                      [centerX, centerY - half],
                                      [centerX, centerY + half]);
      generateVertexZ(centerX, centerY, average, zScale);
    }
    
    var half = (square.x2 - square.x1) / 2;
    var centerX = square.x1 + half;
    var centerY = square.y1 + half;
    var average = getVertexZAverage([square.x1, square.y1],
                                    [square.x2, square.y1],
                                    [square.x1, square.y2],
                                    [square.x2, square.y2]);        
    generateVertexZ(centerX, centerY, average, zScale);
    
    diamond(square.x1, centerY, half); 
    diamond(square.x2, centerY, half);  
    diamond(centerX, square.y1, half);  
    diamond(centerX, square.y2, half);
    
    if (half === 1)
      return;
    
    next.push({x1: square.x1, x2: centerX, y1: square.y1, y2: centerY});
    next.push({x1: square.x1, x2: centerX, y1: centerY, y2: square.y2});
    next.push({x1: centerX, x2: square.x2, y1: square.y1, y2: centerY});
    next.push({x1: centerX, x2: square.x2, y1: centerY, y2: square.y2});
  }
  
  var zScaleCurrent = zScaleStart;
  var squares = [{x1: 0, y1: 0, x2: segmentCount, y2: segmentCount}];
  function generateNextStep() {
    var newSquares = [];
    for (var i = 0; i < squares.length; i++) {
      diamondSquareStep(squares[i], zScaleCurrent, newSquares);
    }
    
    squares = newSquares;
    zScaleCurrent /= zScaleReduction;
    return squares.length > 0;
  }
  
  return {
    initGeometry : initGeometry,
    generateNextStep : generateNextStep
  };
}

var generator = new Generator(256, 256, 2);

function main() {
    var $container = $('#container');
    var width = $container.width();
    var height = $container.height();

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    var scene = new THREE.Scene();
    camera.position.z = 600;
    camera.position.y = -100;
    renderer.setSize(width, height);
    $container.append(renderer.domElement);

    // create the mesh's material
    var meshMaterial = new THREE.MeshBasicMaterial({
        color : 0xffffff,
        wireframe : true
    });
    var geometry = generator.initGeometry(500);
    geometry.dynamic = true;
    var mesh = new THREE.Mesh(geometry, meshMaterial);
    mesh.rotation.x = 2.25;

    // add the mesh to the scene
    scene.add(mesh);
    scene.add(camera);
      
    (function generate() {
        if (generator.generateNextStep())
            setTimeout(generate, 10);
    })();
  
    (function rotate() {        
        mesh.rotation.z += 0.0;  
        setTimeout(rotate, 60);
    })();

    (function draw() {        
        renderer.render(scene, camera);
        requestAnimationFrame(draw);
    })();
}

// height bug fix
setTimeout(main, 10);