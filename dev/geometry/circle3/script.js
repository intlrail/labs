var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var side = canvas.width = canvas.height = 800;
var R = 100; // seed number of rings
var r = 1; // diameter of inner hole  
var p = 50; // diameter of torus
var Q = 50; // radius of ring rotation 
var n = 0; // number of iterations
var θ = 0; // ?

function draw() {
  θ = 0;
  ctx.beginPath();
  do {
    var x = (R-r)*Math.cos(θ) + (r + p) * Math.cos((R+r)/r * θ) + Q * Math.cos(n * θ);
    var y = (R-r)*Math.sin(θ) - (r + p) * Math.sin((R+r)/r * θ) + Q * Math.sin(n * θ);

    ctx.lineTo(x + side/2, y + side/2);
    θ += 0.0006;
  } while(θ < Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'white';

}

function animate() {
  ctx.clearRect(0, 0, side, side);
  Q += 0.035;
  //p += 0.5;
  //r -= 0.1;
  //if(r < 1) r = 180;
  n += 0.01;
  requestAnimationFrame(animate);
  draw();
}
animate();