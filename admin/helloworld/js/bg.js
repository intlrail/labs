const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
  });

const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

const scene = new THREE.Scene();

// lighting
{
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
}

// intlrail logo

  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const texture = new THREE.TextureLoader().load('assets/textures/intlrail.png')
  const material = new THREE.MeshPhongMaterial( { map: texture } );
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

// side objects

function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.x = x;
    return cube;
  }

  const cubes = [
    makeInstance(geometry, red, -2),
    makeInstance(geometry, white,  2),
  ];

  const loader = new THREE.TextureLoader();
  const bgTexture = loader.load('assets/images/1.png');
  scene.background = bgTexture;


// responsive display

      window.onresize = function(){
        console.log("Window size: "+window.innerWidth+"x"+window.innerHeight+"px");
        renderer.setSize(window.innerWidth,window.innerHeight);
        var aspectRatio = window.innerWidth/window.innerHeight;
        camera.aspect = aspectRatio;
        camera.updateProjectionMatrix();
      }

        var animate = function() {
            requestAnimationFrame ( animate );
                
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;

                renderer.render(scene, camera);
         };

        animate();
 

