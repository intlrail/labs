let sketch = function(p) {

  let rings = 20;
  let dim_init = 10;
  let dim_delta = 5;

  let chaos_init = .1;
  let chaos_delta = 0.005;
  let chaos_mag = 28;

  let ox = p.random(10000);
  let oy = p.random(10000);
  let oz = p.random(10000);

  p.setup = function(){
    p.createCanvas(innerWidth,innerHeight);
    p.strokeWeight(.66);
    p.stroke(250);
    p.noFill();
    p.smooth();
    //p.noLoop();
    p.translate(w / 2, h / 2);
    p.scale(1, 0.5);
    p.rotate(45 * Math.PI / 180);

  }

  p.draw = function() {
    p.clear();
    p.translate(p.width / 2, p.height / 2);
    display();
  }

  function display(){
    ox+=0.005;
    oy-=0.005;
    oz+=0.005;
    for(let i = 0; i < rings; i ++){
    p.beginShape();
      for(let angle = 0; angle < 360; angle++){
        let radian = p.radians(angle);
        let radius =  (chaos_mag * i * getNoiseWithTime(radian, chaos_delta * i + chaos_init, oz)) + (dim_delta * i) + dim_init;
        p.vertex(radius * p.cos(radian), radius * p.sin(radian));
      }
    p.endShape(p.CLOSE);
    }
  }

  function getNoise (radian, dim){
    let r = radian % p.TWO_PI;
    if(r < 0.0){r += p.TWO_PI;}
    return p.noise(ox + p.cos(r) * dim, oy + p.sin(r) * dim);
  }

  function getNoiseWithTime (radian, dim, time){
    let r = radian % p.TWO_PI;
    if(r < 0.0){r += p.TWO_PI;}
    return p.noise(ox + p.cos(r) * dim , oy + p.sin(r) * dim, oz + time);
  }
}

new p5(sketch);
