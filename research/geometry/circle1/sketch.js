let sketch = function(p) {

  let rings = 100;
  let dim_init = 50;
  let dim_delta = 1.618;
  let chaos_init = .5;
  let chaos_delta = 0.125;
  let chaos_mag = 15;

  let ox = p.random(10000);
  let oy = p.random(10000);
  let oz = p.random(10000);

  p.setup = function(){
    p.createCanvas(800, 800);
    p.strokeWeight(1);
    p.stroke(255);
    p.smooth();
    p.noFill();
    //p.noLoop();

  }

  p.draw = function() {
    p.clear();
    p.translate(p.width / 2, p.height / 2);
    //p.scale(1, 0.86)
    //p.shearX(Math.PI / -12);
    display();
  }


//oscilliation settings

  function display(){
    ox+=0.0125;
    oy-=0.02;
    oz+=0.01;
    for(let i = 0; i < rings; i ++){
    p.beginShape();
      for(let angle = 0; angle < 360; angle++){
        let radian = p.radians(angle);
        let radius =  (chaos_mag * getNoiseWithTime(radian, chaos_delta * i + chaos_init, oz)) + (dim_delta * i + dim_init);
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