var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor( 0xffffff, 0);
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry(2, 2, 2);

// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

var texture = new THREE.TextureLoader().load('/assets/textures/intlrail.png')
var material = new THREE.MeshBasicMaterial( { map: texture } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

  const loader = new THREE.TextureLoader();
  const bgTexture = loader.load('assets/images/1.png');
  scene.background = bgTexture;

function animate() {
    requestAnimationFrame ( animate );
        
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
 };

 function onWindowResize() {
 		camera.aspect = window.innerWidth / window.innerHeight;
 		camera.updateProjectionMatrix();
 		renderer.setSize( window.innerWidth, window.innerHeight );
 }

window.addEventListner('resize', onWindowResize, false);

init();
animate();

